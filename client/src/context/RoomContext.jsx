import { useEffect, useReducer, createContext } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
import {
  clearLocalQueueData,
  usePersistentQueue,
} from "../hooks/useParticipantsStorage";

// Define the WebSocket server endpoint
const WS = "https://fc76e4c4b470.ngrok-free.app";

// Create and export the Context for consumer components
// eslint-disable-next-line react-refresh/only-export-components
export const RoomContext = createContext(null);

// Initialize the global WebSocket connection (outside the component)
const ws = socketIOClient(WS, { transports: ["websocket"] });

// --- Reducer Initial State ---
const initialState = {
  queueName: "",
  attention: "",
  participants: [],
  error: null,
  // Load existing userId from localStorage or generate a new one
  userId: localStorage.getItem("userId") || uuidV4(),
  organizerId: null,
  finalReport: null,
};

// --- Reducer Function to manage state transitions ---
const reducer = (state, action) => {
  switch (action.type) {
    case "set": // Set initial queue details during creation
      return {
        ...state,
        queueName: action.queueName,
        attention: action.attention,
      };
    case "update_full_state": // Used for general state sync
      return {
        ...state,
        participants: action.participants,
        queueName: action.queueName,
        attention: action.attention,
      };
    case "update_queue": // Full sync of queue data from server
      return {
        ...state,
        queueName: action.queueName,
        attention: action.attention,
        participants: action.participants,
        organizerId: action.organizerId,
      };
    case "set_report": // Store final report data before navigation
      return {
        ...state,
        finalReport: action.payload,
      };
    case "clear_state": // Reset main queue state, but preserve userId and report data
      return {
        ...initialState,
        userId: state.userId,
        finalReport: state.finalReport,
      };
    default:
      return state;
  }
};

export const RoomProvider = ({ children }) => {
  const nav = useNavigate();
  const [room, dispatch] = useReducer(reducer, initialState);

  // Custom hook to handle state persistence (Local Storage sync)
  const { clearStorage } = usePersistentQueue(room, dispatch, room.userId);

  const userId = room.userId;

  // --- Action Handlers (Emitters) ---

  // Action: Organizer ends the queue
  const handleEndQueue = (id) => {
    if (id) {
      ws.emit("end-and-destroy-room", { roomId: id });
    }

    clearStorage(); // Clear persistent state
    dispatch({ type: "clear_state" });
  };

  // Action: Organizer moves the queue forward
  const handleDequeue = (id) => {
    if (id && room.participants.length > 0) {
      ws.emit("dequeue-user", { roomId: id });
    }
  };

  // Action: Participant leaves the queue
  const handleExitQueue = (id) => {
    if (id) {
      ws.emit("exit-queue", { roomId: id, userId });
    }
    clearLocalQueueData(room.userId);
    dispatch({ type: "clear_state" });
    nav("/home");
  };

  // --- Socket Event Listeners (useEffect) ---

  useEffect(() => {
    // Persist userId on mount if it's new
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", userId);
    }

    // Listener: Organizer confirmation after room creation
    const enterRoom = ({ roomId }) => {
      nav(`/queue/${roomId}/organizer`);
    };
    ws.on("room-created", enterRoom);

    // Listener: Syncs queue data (participants, name, attention) from server
    const syncQueueState = ({
      participants,
      queueName,
      attention,
      organizerId,
    }) => {
      dispatch({
        type: "update_queue",
        participants,
        queueName,
        attention,
        organizerId,
      });
    };
    ws.on("update-queue", syncQueueState);

    // Listener: Receives final report data upon queue closure
    const handleFinalReport = (data) => {
      sessionStorage.setItem("final_queue_report", JSON.stringify(data));
      dispatch({ type: "set_report", payload: data });

      clearStorage();
      dispatch({ type: "clear_state" });
      nav(`/report/${data.roomId}`);
    };
    ws.on("final-report-data", handleFinalReport);

    // Listener: Handles remote queue closure (e.g., organizer ended it)
    const handleQueueEnded = () => {
      console.log("Organizer ended the queue. Navigating home.");
      clearLocalQueueData(room.userId);
      dispatch({ type: "clear_state" });
      nav("/home");
    };
    ws.on("queue-ended", handleQueueEnded);

    // Listener: Confirmation that participant has been served (dequeued by organizer)
    const handleCompletionConfirmation = () => {
      console.log("You have been served. Navigating home.");
      clearLocalQueueData(room.userId);
      dispatch({ type: "clear_state" });
    };
    ws.on("queue-completion-confirmation", handleCompletionConfirmation);

    // --- Cleanup: Remove listeners on unmount/re-render ---
    return () => {
      ws.off("room-created", enterRoom);
      ws.off("update-queue", syncQueueState);
      ws.off("final-report-data", handleFinalReport);
      ws.off("queue-ended", handleQueueEnded);
      ws.off("queue-completion-confirmation", handleCompletionConfirmation);
    };
  }, [userId, nav, clearStorage]);

  return (
    // Provide state and action handlers to the rest of the application
    <RoomContext.Provider
      value={{
        ws,
        userId,
        room,
        dispatch,
        handleEndQueue,
        handleDequeue,
        handleExitQueue,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
