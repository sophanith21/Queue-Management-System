import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { QRCodeCanvas } from "qrcode.react";
import {
  removeStoredData,
  useParticipantsStorage,
} from "../hooks/useParticipantsStorage";

export const RoomOrganizer = () => {
  const { id } = useParams();
  const { ws, user, room, dispatch } = useContext(RoomContext);
  const nav = useNavigate();

  const savedParticipants = useParticipantsStorage(room.participants, dispatch);

  const broadCast = ({ type }) => {
    const conns = Object.values(user.conn || []);
    conns.map((conn) => {
      if (conn && typeof conn.send === "function") conn.send({ type });
    });
  };

  const endQueue = () => {
    broadCast({ type: "queue-end" });
    removeStoredData(dispatch);
    nav("/");
  };

  useEffect(() => {
    if (user.peer) {
      ws.emit("join-room", { roomId: id, peerId: user.peer.id });
      console.log("Joining room", id, "peerId", user.peer.id);
    } else console.log("Error no user");
  }, [id, ws, user]);

  useEffect(() => {
    console.log(room);
  }, [room]);

  useEffect(() => {
    console.log("Restored participants:", savedParticipants);
  }, []);

  return (
    <>
      <h1>Room ID: {id}</h1>
      <h1>User ID: {user.peer?.id}</h1>
      <div>
        <QRCodeComponent id={id} />
      </div>
      {room && (
        <div>
          <button
            onClick={endQueue}
            className="bg-amber-500 rounded-xl p-3 m-3 text-white active:scale-85"
          >
            End Queue
          </button>
          <h1>Participants:</h1>
          {room.participants.map((p, index) => (
            <p key={index}>
              {index + 1}: {p}
            </p>
          ))}
        </div>
      )}
    </>
  );
};

export const Room = () => {
  const { id } = useParams();
  const { ws, user, room, dispatch } = useContext(RoomContext);
  const nav = useNavigate();

  const handleExit = () => {
    user.conn.send({ type: "exitQueue" });

    removeStoredData(dispatch);

    nav("/");
  };

  useEffect(() => {
    if (user.peer) {
      ws.emit("join-room", { roomId: id, peerId: user.peer.id });
      console.log("Joining room", id, "peerId", user.peer.id);
    } else console.log("Error, no user");
  }, [user.peer, id, ws]);

  useEffect(() => {
    console.log(room);
    if (room.participants.length == 0 && user.conn) {
      user.conn.send({ type: "getList" });
    }
  }, [room, user.conn]);

  return (
    <>
      <h1>Room ID: {id}</h1>
      <h1>User ID: {user.peer?.id}</h1>
      <div>
        <QRCodeComponent id={id} />
      </div>
      {room && (
        <div>
          <button
            onClick={() => {
              user.conn.send({ type: "getList" });
            }}
            className="bg-amber-500 rounded-xl p-3 m-3 text-white active:scale-85"
          >
            Update
          </button>
          <button
            onClick={handleExit}
            className="bg-amber-500 rounded-xl p-3 m-3 text-white active:scale-85"
          >
            Exit queue
          </button>
          <h1>Participants:</h1>
          {room.participants.map((p, index) => (
            <p key={index}>
              {index + 1}: {p}
            </p>
          ))}
        </div>
      )}
    </>
  );
};

const QRCodeComponent = ({ id }) => {
  const url = `https://dda5f1c03bee.ngrok-free.app/room/${id}/participant`;
  return <QRCodeCanvas value={url} size={150} />;
};
