import { v4 as uuidv4 } from "uuid";

export const rooms = {};
export const userToSocketMap = {};

const findRoomByOrganizerSocket = (socketId) => {
  for (const roomId in rooms) {
    if (rooms[roomId].organizerSocket === socketId) {
      return roomId;
    }
  }
  return null;
};

export const roomHandler = (socket, io) => {
  const createInitialMetrics = () => ({
    startTime: Date.now(),
    totalEntered: 0,
    checkedIn: 0,
    exitedEarly: 0,
    waitTimes: [],
    serviceTimes: [],
  });

  const createRoom = ({ organizerId, queueName, attention }) => {
    const roomId = uuidv4();
    rooms[roomId] = {
      organizerId: organizerId,
      organizerSocket: socket.id,
      queueName: queueName,
      attention: attention,

      queue: [],
      lastCheckinTime: 0,
      metrics: createInitialMetrics(),
    };

    socket.emit("room-created", { roomId });
    console.log(`Room ${roomId} created by ${organizerId}.`);
  };

  const joinRoom = ({ roomId, userId }) => {
    if (!rooms[roomId]) {
      socket.emit("room-not-found");
      return;
    }

    const room = rooms[roomId];

    if (room.organizerId === userId) {
      room.organizerSocket = socket.id;
      console.log(`Organizer ${userId} reconnected/joined room ${roomId}.`);
    } else {
      console.log(`User ${userId} joined room ${roomId}.`);
    }

    socket.join(roomId);
    userToSocketMap[userId] = socket.id;

    io.to(roomId).emit("update-queue", {
      queueName: room.queueName,
      attention: room.attention,
      participants: room.queue,
      organizerId: room.organizerId,
    });
  };

  const addToQueue = ({ roomId, userId }) => {
    if (!rooms[roomId]) return;

    const room = rooms[roomId];

    const isDuplicate = room.queue.some((p) => p.userId === userId);
    if (isDuplicate) return;

    const newParticipant = {
      userId,
      socketId: userToSocketMap[userId],
      joinTime: Date.now(),
    };

    room.queue.push(newParticipant);

    room.metrics.totalEntered += 1;

    io.to(roomId).emit("update-queue", {
      queueName: room.queueName,
      attention: room.attention,
      participants: room.queue,
      organizerId: room.organizerId,
    });
    console.log(`User ${userId} added to queue ${roomId}.`);
  };

  const dequeueUser = ({ roomId }) => {
    if (!rooms[roomId] || rooms[roomId].queue.length === 0) return;

    const room = rooms[roomId];
    const removedParticipant = room.queue.shift();
    const currentTime = Date.now();

    const waitDuration = currentTime - removedParticipant.joinTime;
    room.metrics.waitTimes.push({ duration: waitDuration, type: "checkedIn" });
    room.metrics.checkedIn += 1;

    if (room.lastCheckinTime !== 0) {
      const serviceDuration = currentTime - room.lastCheckinTime;
      room.metrics.serviceTimes.push(serviceDuration);
    }

    room.lastCheckinTime = currentTime;

    if (removedParticipant.socketId) {
      io.to(removedParticipant.socketId).emit("queue-completion-confirmation");
      delete userToSocketMap[removedParticipant.userId];
    }

    io.to(roomId).emit("update-queue", {
      queueName: room.queueName,
      attention: room.attention,
      participants: room.queue,
      organizerId: room.organizerId,
    });
    console.log(
      `User ${removedParticipant.userId} dequeued from room ${roomId}.`
    );
  };

  const exitQueue = ({ roomId, userId }) => {
    if (!rooms[roomId]) return;

    const room = rooms[roomId];
    const index = room.queue.findIndex((p) => p.userId === userId);

    if (index > -1) {
      const removedParticipant = room.queue.splice(index, 1)[0];

      const waitDuration = Date.now() - removedParticipant.joinTime;
      room.metrics.waitTimes.push({
        duration: waitDuration,
        type: "exitedEarly",
      });
      room.metrics.exitedEarly += 1;

      io.to(roomId).emit("update-queue", {
        queueName: room.queueName,
        attention: room.attention,
        participants: room.queue,
        organizerId: room.organizerId,
      });
      console.log(`User ${userId} manually exited queue ${roomId}.`);
    }

    delete userToSocketMap[userId];
  };

  const endAndDestroyRoom = ({ roomId }) => {
    console.log(`Room cleanup initiated for: ${roomId}`);

    if (rooms[roomId]) {
      const room = rooms[roomId];

      const finalMetrics = {
        ...room.metrics,
        endTime: Date.now(),
        waitingAtClose: room.queue.length,
        durationMs: Date.now() - room.metrics.startTime,
      };

      io.to(room.organizerSocket).emit("final-report-data", {
        roomId,
        queueName: room.queueName,
        metrics: finalMetrics,
      });

      io.to(roomId).except(room.organizerSocket).emit("queue-ended");

      const organizerId = room.organizerId;
      delete rooms[roomId];
      delete userToSocketMap[organizerId];

      io.in(roomId).socketsLeave(roomId);

      console.log(`Room ${roomId} successfully destroyed.`);
    }
  };

  const handleInRoom = () => {
    return ({ roomId, userId }) => {
      if (!rooms[roomId]) return;

      const isUserInQueue = rooms[roomId].queue.some(
        (p) => p.userId === userId
      );

      if (isUserInQueue) {
        socket.emit("yes-you-in");
      }
    };
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("im-in-room", handleInRoom());

  socket.on("add-to-queue", addToQueue);
  socket.on("dequeue-user", dequeueUser);
  socket.on("exit-queue", exitQueue);

  socket.on("end-and-destroy-room", endAndDestroyRoom);

  socket.on("disconnect", () => {
    const disconnectedUserId = Object.keys(userToSocketMap).find(
      (key) => userToSocketMap[key] === socket.id
    );

    if (disconnectedUserId) {
      delete userToSocketMap[disconnectedUserId];
      console.log(
        `Cleaned up disconnected user from map: ${disconnectedUserId}`
      );
    }
  });
};
