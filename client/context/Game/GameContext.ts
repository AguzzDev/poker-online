import { GameContextType } from "models";
import { createContext } from "react";
import { Socket } from "socket.io-client";

const GameContext = createContext<GameContextType>({
  socket: {} as Socket,
  bid: 0,
  roomInfo: "",
  usersOnline: 0,
  player: {} as GameContextType["player"],
  room: {} as GameContextType["room"],
  roomMessage: null,
  rooms: {} as GameContextType["rooms"],
  timer: 0,
  turn: "",
  showReBuyMenu: false,
  setSocket: () => {},
  setShowReBuyMenu: () => {},
  setBid: () => {},
  setPlayer: () => {},
  setRoomMessage: () => {},
  setRoom: () => {},
  setTimer: () => {},
  setRooms: () => {},
  setTurn: () => {},
  createRoom: () => {},
  leaveRoom: () => {},
  newMessage: () => {},
  joinRoom: () => {},
  takeSit: () => {},
  startGame: () => {},
  playMove: () => {},
  deleteGame: () => {},
});

export default GameContext;
