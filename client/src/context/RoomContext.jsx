import { useEffect, useReducer, useState, useRef } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { removeStoredData } from "../hooks/useParticipantsStorage";

const WS = "http://localhost:3000";

// eslint-disable-next-line react-refresh/only-export-components
export const RoomContext = createContext(null);

const ws = socketIOClient(WS, { transports: ["websocket"] });

const initialState = {
  participants: [],
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "add": {
      let newList = [...state.participants];
      if (!newList.includes(action.participant)) {
        newList.push(action.participant);
      }

      return { participants: newList };
    }
    case "remove": {
      let newList = [...state.participants];
      if (newList.includes(action.participant)) {
        newList = newList.filter((e) => e !== action.participant);
      }
      return { participants: newList };
    }
    case "update":
      return { ...state, participants: action.participants };

    default:
      return { error: "No such Action" };
  }
};

export const RoomProvider = ({ children }) => {
  const nav = useNavigate();
  const [user, setUser] = useState({ peer: null, conn: null });
  const [room, dispatch] = useReducer(reducer, initialState);

  const roomRef = useRef(room);

  const enterRoom = ({ roomId }) => {
    console.log({ roomId });
    nav(`/room/${roomId}/organizer`);
  };

  const joinQueue = ({ peerId }) => {
    dispatch({ type: "add", participant: peerId });
  };

  const exitQueue = ({ peerId }) => {
    dispatch({ type: "remove", participant: peerId });
  };

  const redirectToRoom = ({ organizerId }) => {
    console.log("Organizer " + organizerId);
    const conn = user.peer.connect(organizerId);

    const handler = (data) => {
      const { participants, type } = data;
      if (participants) dispatch({ type: "update", participants });
      if (type === "queue-end") {
        removeStoredData(dispatch);
        nav("/");
      }
    };

    conn.on("data", handler);
    conn.on("open", () => {
      conn.send({ type: "getList" });
    });

    setUser((prev) => ({ peer: prev.peer, conn: conn }));
  };

  const broadcastParticipants = () => {
    const conns = Object.values(user.conn || {});
    const participants = roomRef.current.participants;

    conns.forEach((conn) => {
      if (conn && typeof conn.send === "function") {
        conn.send({ participants });
      }
    });
  };

  useEffect(() => {
    roomRef.current = room;
    if (typeof user.conn === "object") broadcastParticipants();
  }, [room]);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = uuidV4();
      localStorage.setItem("userId", userId);
    }

    const peer = new Peer(userId);

    peer.on("open", (id) => {
      setUser({ peer, conn: null });
      console.log("Peer ready with ID:", id);
    });
  }, []);

  useEffect(() => {
    if (!user.peer) return;

    const handleConnection = (conn) => {
      console.log("New connection:", conn.peer);

      // store the connection
      setUser((prev) => ({
        peer: prev.peer,
        conn: { ...prev.conn, [conn.peer]: conn },
      }));

      conn.on("data", (data) => {
        if (data.type === "getList") {
          conn.send({ participants: roomRef.current.participants });
        }
        if (data.type === "exitQueue") {
          exitQueue({ peerId: conn.peer });
        }
      });
    };

    user.peer.on("connection", handleConnection);

    return () => {
      user.peer.off("connection", handleConnection);
    };
  }, [user.peer]);

  useEffect(() => {
    if (user.peer) {
      ws.on("room-created", enterRoom);

      ws.on("user-joined", joinQueue);

      ws.on("redirect-to-room", redirectToRoom);
    }
  }, [user.peer]);

  return (
    <RoomContext.Provider value={{ ws, user, room, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};
