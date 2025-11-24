import { v4 as uuidv4 } from "uuid";

export const rooms = {};

export const roomHandler = (socket, io) => {
  const createRoom = ({ organizerId }) => {
    const roomId = uuidv4();
    rooms[roomId] = {
      organizerId: organizerId, // persistent
      organizerSocket: socket.id, // current socket
    };

    socket.emit("room-created", { roomId });
    console.log("room created");
    console.log(rooms[roomId]);
  };

  const joinRoom = ({ roomId, peerId }) => {
    if (!rooms[roomId]) return;

    const room = rooms[roomId];

    // Update socket if reconnect
    if (room.organizerId === peerId) {
      room.organizerSocket = socket.id;
      console.log(rooms[roomId]);
      return;
    }

    io.to(rooms[roomId].organizerSocket).emit("user-joined", { peerId });
    socket.emit("redirect-to-room", { organizerId: rooms[roomId].organizerId });
    console.log(rooms[roomId]);
  };

  socket.on("create-room", createRoom);

  socket.on("join-room", joinRoom);

  // socket.on("leave-room", leaveRoom);
};
