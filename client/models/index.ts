import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

//component
export type ChildrenType = JSX.Element | JSX.Element[];
export interface RFCProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ChildrenType | string;
}
export interface RFCButtonProps extends Omit<RFCProps, "style"> {
  style?: string;
}

//props
export interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}
export interface ModalProps {
  button?: JSX.Element | JSX.Element[] | string;
  content: JSX.Element | JSX.Element[];
}
export interface CreateRoomProps {
  name: string;
  password: string;
  withPass: boolean;
}
export interface GameRoomProps {
  playerMode: PlayerModeEnum;
  mode?: string;
}
export interface HistoryBidProps {
  bid: number;
  player: string;
}

//types
export interface GameContextType {
  socket: Socket;
  bid: number;
  roomInfo: string;
  usersOnline: number;
  player: PlayerInterface;
  room: RoomInterface;
  roomMessage: any;
  rooms: RoomInterface[];
  timer: number;
  turn: string;
  showReBuyMenu: boolean;
  setSocket: Dispatch<SetStateAction<any>>;
  setShowReBuyMenu: Dispatch<SetStateAction<boolean>>;
  setBid: Dispatch<SetStateAction<number>>;
  setPlayer: Dispatch<SetStateAction<any>>;
  setRoomMessage: Dispatch<SetStateAction<any>>;
  setRoom: Dispatch<SetStateAction<any>>;
  setTimer: Dispatch<SetStateAction<any>>;
  setRooms: Dispatch<SetStateAction<any>>;
  setTurn: Dispatch<SetStateAction<any>>;
  createRoom: Function;
  leaveRoom: Function;
  newMessage: Function;
  joinRoom: Function;
  takeSit: Function;
  startGame: Function;
  playMove: Function;
  deleteGame: Function;
}
export interface UserContextType {
  user: UserInterface;
  updateUser: Function;
  removeAccount: Function;
  setAccount: Function;
}

//interfaces
export interface CardInterface {
  id: number;
  suit: string;
  value: number;
}
export interface PlayerInterface {
  _id?: string;
  userId?: string;
  name?: string;
  chips?: number;
  sit?: number;
  cards?: CardInterface[];
  bid?: number;
  hand?: {
    heirarchy: string;
    message: string;
    cards: CardInterface[];
  };
  action?: Status | "";
  showAction?: string;
  blind?: boolean;
}
export interface DeskInterface {
  status?: Status.bid | Status.raise | Status.allIn | null;
  bidToPay?: number;
  totalBid?: number;
  maxPlayerRoom?: number;
  cards?: CardInterface[];
  players?: PlayerInterface[];
  dealer?: CardInterface[];
  blind?: number;
  buyIn?: number;
}
export interface MessageInterface {
  userId: string;
  message: string;
}
export interface RoomInterface {
  _id?: string;
  name?: string;
  password?: string;
  own?: string;
  start?: boolean;
  desk?: DeskInterface;
  messages?: MessageInterface[];
  buyIn?: number;
}
export interface UserInterface {
  _id: string;
  username: string;
  image: string;
  chips: number;
  matches: {
    wins: number;
    loses: number;
    par: number;
    trio: number;
    full: number;
    poker: number;
    flush: number;
    straight: number;
    straightFlush: number;
    straightFlushReal: number;
  };
  createdAt: Date;
  accessToken: string;
}

//inputs
export interface LoginInput {
  email: string;
  password: string;
}
export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  password2: string;
}
//enum
export enum Status {
  fold = "fold",
  check = "check",
  call = "call",
  bid = "bid",
  raise = "raise",
  allIn = "allIn",
}
export enum PlayerModeEnum {
  Spectator,
  Player,
}
