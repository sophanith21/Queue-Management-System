import { rooms } from "../websocket/RoomHandler.js";

export const getRoom = (req, res) => {
  const { roomId } = req.params;
  if (roomId) {
    return res.json({ roomId, organizerId: rooms[roomId] });
  }

  res.json({ error: "Room does not exist" });
};
