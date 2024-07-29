import { RoomInterface } from "models";

export const roomValues = (room: RoomInterface): RoomInterface => {
  return {
    _id: room._id,
    name: room.name,
    own: room.own,
    buyIn: room.buyIn,
    players: room.players
  };
};
