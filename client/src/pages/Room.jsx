import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";

export const Room = () => {
  const { id } = useParams();
  const { ws, userId, room, handleExitQueue } = useContext(RoomContext);

  const [isJoined, setIsJoined] = useState(false);
  const [isDequeued, setIsDequeued] = useState(false);

  const nav = useNavigate();
  const participantsCount = room.participants.length;
  console.log(participantsCount);

  // --- FIX 1: Find user index by checking the userId property of the object ---
  const userIndex = room.participants.findIndex((p) => p.userId === userId);
  const userIsParticipant = userIndex !== -1;

  const userQueuePosition = userIsParticipant ? userIndex + 1 : null;

  // --- FIX 2: Access userId from the object at index 0 ---
  const onCallId =
    participantsCount > 0
      ? room.participants[0].userId.substring(0, 8)
      : "None";

  // --- FIX 3: Access userId from the object at userIndex - 1 ---
  const aheadQueueId =
    userIndex > 0
      ? room.participants[userIndex - 1].userId.substring(0, 8)
      : "N/A";

  const displayPeerId = userId?.substring(0, 8) ?? "Loading...";
  // ---------------------------------------------

  const handleExit = () => {
    setIsJoined(false);
    handleExitQueue(id);
  };

  const handleJoin = () => {
    setIsDequeued(false); // Reset dequeued status when joining again
    setIsJoined(true);
  };

  useEffect(() => {
    // This useEffect handles adding the user to the queue AFTER the component mounts AND the user clicks 'Join Queue'
    if (userId && isJoined && !userIsParticipant) {
      ws.emit("join-room", { roomId: id, userId });
      ws.emit("add-to-queue", { roomId: id, userId });
    }
  }, [userId, id, ws, isJoined, userIsParticipant]);

  const handleStillInqueue = () => {
    setIsJoined(true);
  };

  useEffect(() => {
    // This useEffect handles initial sync and event listeners

    const handleRoomNotFound = () => {
      alert("Room not found");
      nav("/home");
    };

    // Emit check on mount
    ws.emit("im-in-room", { roomId: id, userId });

    // Handle the queue completion signal (now handled in RoomProvider as well, but this state is local)
    const handleCompletion = () => {
      setIsJoined(false);
      setIsDequeued(true);
      // NOTE: The navigation is now handled by the RoomProvider's listener.
    };
    ws.on("queue-completion-confirmation", handleCompletion);

    ws.on("yes-you-in", handleStillInqueue);
    ws.on("room-not-found", handleRoomNotFound);

    return () => {
      ws.off("room-not-found", handleRoomNotFound);
      ws.off("yes-you-in", handleStillInqueue);
      ws.off("queue-completion-confirmation", handleCompletion);
    };
  }, [ws, nav, id, userId, room.userId]);

  return (
    // Outer container: flex flex-col is essential for grow to work vertically
    // h-screen ensures the flex container takes full viewport height
    <div className="flex flex-col h-screen max-w-[400px] mx-auto bg-white px-6 pt-6 pb-6 relative">
      {/* Content wrapper: This should not use flex-col if we want to separate content blocks */}
      <div>
        <h1 className="text-center text-[#FF7A00] font-bold text-xl mb-8">
          Queue Information
        </h1>

        {/* --- Dynamic Main Ticket Card --- */}
        <div className="border-2 border-[#FF7A00] rounded-xl p-6 mb-8 text-center bg-white shadow-sm">
          {isDequeued ? (
            /* STATE 1: User is Dequeued/Complete */
            <>
              <p className="font-medium mb-2 text-1xl text-green-600">
                Thank You for Waiting!
              </p>
              <div className="text-green-600 text-5xl font-bold">
                SERVICE COMPLETE
              </div>
            </>
          ) : isJoined && userIsParticipant ? (
            /* STATE 2: User is Joined and Found in Participant List */
            <>
              <p
                className="font-medium mb-2 text-1xl"
                style={{ color: userIndex === 0 ? "#10B981" : "#6B7280" }}
              >
                {userIndex === 0 ? "IT'S YOUR TURN!" : "Your Current Position"}
              </p>
              <div className="text-[#FF7A00] text-5xl font-bold">
                #{userQueuePosition}
              </div>
            </>
          ) : (
            /* STATE 3: User is NOT Joined (Default View) */
            <>
              <p className="text-gray-600 font-medium mb-2 text-1xl">
                Ready to Join?
              </p>
              <div className="text-[#FF7A00] text-5xl font-bold">
                Click Below
              </div>
            </>
          )}
        </div>

        {/* --- Details List (Only shows useful data post-join and pre-dequeue) --- */}
        {!isDequeued && (
          <div className="space-y-4 text-sm font-medium">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Queue Name</span>
              <span className="text-gray-900">{room.queueName || ""}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Your ID</span>
              <span className="text-gray-900">#{displayPeerId}</span>
            </div>
            {isJoined && userIsParticipant && userIndex > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">On Call</span>
                <span className="text-gray-900">#{onCallId}</span>
              </div>
            )}
            {isJoined && userIsParticipant && userIndex > 1 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Ahead of You</span>
                <span className="text-gray-900">#{aheadQueueId}</span>
              </div>
            )}
            {isJoined && userIsParticipant && userIndex > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">People Behind</span>
                <span className="text-gray-900">
                  {participantsCount - userQueuePosition}
                </span>
              </div>
            )}
            <div className="flex flex-col justify-between items-center space-y-3">
              <h1 className="text-[#FF7A00] font-bold">Attention</h1>
              <p1 className="text-[#FF7A00]">{room.attention || ""}</p1>
            </div>
          </div>
        )}
      </div>

      {/* This element now correctly takes all remaining vertical space, 
          pushing the button below it to the bottom of the parent (h-screen) div. */}
      <div className="grow"></div>

      {/* --- Dynamic Button (Pushed to the bottom) --- */}
      {isDequeued ? (
        <button
          onClick={() => nav("/home")}
          className="w-full bg-[#10B981] text-white font-bold py-4 rounded-full shadow-lg active:scale-95 transition-transform text-center"
        >
          Go Home
        </button>
      ) : !isJoined ? (
        <button
          onClick={handleJoin}
          className="w-full bg-[#FF7A00] text-white font-bold py-4 rounded-full shadow-lg active:scale-95 transition-transform text-center"
        >
          Join Queue
        </button>
      ) : (
        <button
          onClick={handleExit}
          className="w-full bg-[#B22222] text-white font-bold py-4 rounded-full shadow-lg active:scale-95 transition-transform text-center"
        >
          Exit Queue
        </button>
      )}
    </div>
  );
};
