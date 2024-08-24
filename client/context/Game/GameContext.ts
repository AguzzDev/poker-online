import { GameContextType } from "models";
import { createContext } from "react";

const GameContext = createContext<GameContextType>({
  socket: null,
  room: null,
  rooms: null,
  player: null,
  playersOnline: null,
  reBuyMessage: null,
  roomNotification: null,
  bid: 0,
  roomStatus: null,
  usersOnline: 0,
  timer: 0,
  turn: null,
  showReBuyMenu: false,
  setRoom: () => {},
  setBid: () => {},
  setRoomNotification: () => {},
  setShowReBuyMenu: () => {},
  createRoom: () => {},
  deleteRoom: () => {},
  leaveRoom: () => {},
  newMessage: () => {},
  joinRoom: () => {},
  takeSit: () => {},
  startGame: () => {},
  playMove: () => {},
  reBuyChips: () => {},
  getPlayers: () => {},
});

export default GameContext;
