import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import logo from "../assets/logo.png";
import { QRCodeComponent } from "../components/QRComponent";

export const RoomOrganizer = () => {
  const { id } = useParams();

  // Access core context values and actions
  const { ws, userId, room, handleEndQueue, handleDequeue } =
    useContext(RoomContext);

  const [showPopup, setShowPopup] = useState(false);

  // useEffect: Organizer joins the room upon component mount
  useEffect(() => {
    if (userId) {
      ws.emit("join-room", { roomId: id, userId });
    }
  }, [id, ws, userId]);

  // Handler: Move queue forward (Dequeue the first participant)
  const handleNext = () => {
    if (room.participants.length > 0) {
      handleDequeue(id);
    }
  };

  // Handler: Confirms and executes queue closure
  const confirmClose = () => {
    setShowPopup(false);
    handleEndQueue(id);
  };

  return (
    // Main layout: Two columns (Sidebar and Main Queue)
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar: Queue Info and QR Code */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col items-center justify-center p-8 shadow-lg z-10">
        <div className="space-y-8 text-center">
          <img src={logo} className="w-40 mx-auto" alt="Logo" />
          <div>
            <h2 className="text-gray-500 font-medium uppercase tracking-wider text-sm">
              Current Queue
            </h2>
            <h1 className="text-3xl font-bold text-[#FF7A00] mt-1 break-words">
              {room.queueName || "Untitled Queue"}
            </h1>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 inline-block">
            {/* Display QR code for users to join */}
            {id && <QRCodeComponent id={id} size={200} />}
          </div>
          <p className="text-gray-400 text-sm">Scan to join the waitlist</p>
        </div>
      </div>

      {/* Main Queue List Area */}
      <div className="flex-1 flex flex-col h-full relative">
        <div className="px-8 py-6 bg-white border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Waiting List</h2>
            <p className="text-sm text-gray-500">
              Total waiting: {room.participants.length}
            </p>
          </div>
          {/* Button to initiate queue closure popup */}
          <button
            onClick={() => setShowPopup(true)}
            className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            End Queue
          </button>
        </div>

        {/* Scrollable Participant List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {room.participants.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
              <p className="mt-4 text-lg">The queue is currently empty.</p>
            </div>
          ) : (
            room.participants.map((participant, index) => {
              // Extract and truncate user ID for display
              const displayId =
                typeof participant === "object" && participant.userId
                  ? participant.userId.substring(0, 8)
                  : "Unknown";

              const isNext = index === 0;

              return (
                // Individual participant card
                <div
                  key={participant.userId}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isNext
                      ? "bg-orange-50 border-[#FF7A00] shadow-md transform scale-[1.01]"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Position Number */}
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                        isNext
                          ? "bg-[#FF7A00] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      {/* Participant ID */}
                      <p
                        className={`font-mono text-lg ${
                          isNext ? "font-bold text-gray-900" : "text-gray-600"
                        }`}
                      >
                        #{displayId.toUpperCase()}
                      </p>
                      {isNext && (
                        <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-wide">
                          On Call
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Status Indicator */}
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isNext ? "bg-green-500 animate-pulse" : "bg-gray-300"
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Dequeue Button (Fixed at bottom) */}
        <div className="p-6 bg-white border-t border-gray-200 shadow-xl z-20">
          <button
            onClick={handleNext}
            disabled={room.participants.length === 0}
            className={`w-full py-4 rounded-xl text-xl font-bold shadow-lg transition-all ${
              room.participants.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#0D47A1] text-white hover:bg-[#0a3d8f] hover:scale-[1.02] active:scale-95"
            }`}
          >
            {room.participants.length === 0
              ? "Waiting for Users..."
              : "Call Next Ticket"}
          </button>
        </div>
      </div>

      {/* Confirmation Modal/Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Close Queue?
            </h3>
            <p className="text-gray-500 mb-8">
              This will disconnect all users and delete the current list.{" "}
              <b>A report will be generated</b> before closing.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmClose}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-[#B22222] text-white hover:bg-[#8f1b1b]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
