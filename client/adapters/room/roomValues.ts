import { RoomInterface } from "models";

export const roomValues = (room: RoomInterface): RoomInterface => {
  return {
    _id: room._id,
    name: room.name,
    password: room.password,
    own: room.own,
    start: room.start,
    buyIn: room.buyIn,
    desk: {
      status: room.desk.status,
      bidToPay: room.desk.bidToPay,
      totalBid: room.desk.totalBid,
      maxPlayerRoom: room.desk.maxPlayerRoom,
      cards: room.desk.cards,
      players: room.desk.players,
      dealer: room.desk.dealer,
      blind: room.desk.blind,
      buyIn: room.desk.buyIn,
    },
    messages: room.messages.map((messages) => {
      return {
        userId: messages.userId,
        message: messages.message,
      };
    }),
  };
};
