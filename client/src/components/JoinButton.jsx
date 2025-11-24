import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export const JoinButton = () => {
  const { ws, user } = useContext(RoomContext);
  const createRoom = () => {
    console.log(ws);
    ws.emit("create-room", { organizerId: user.peer.id });
  };
  return (
    <>
      <button
        onClick={createRoom}
        disabled={!user ? true : false}
        className=" bg-amber-700 hover:bg-amber-800 text-white border-2 p-3 rounded-2xl active:scale-95"
      >
        Start a new queue
      </button>
    </>
  );
};
