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
  type?: LayoutTypeEnum;
  navType?: NavbarTypeEnum;
}
export interface FooterProps {
  type?: FooterTypeEnum;
}
export interface NavbarProps {
  type: NavbarTypeEnum;
}
export interface ContainerProps {
  style?: string;
  children: React.ReactNode;
  type?: ContainerTypeEnum;
}
export interface RadixComponentProps {
  trigger?: JSX.Element | JSX.Element[] | string;
  content: JSX.Element | JSX.Element[];
}
export interface ModalProps extends RadixComponentProps {
  position?: PositionsEnum;
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
  rooms: RoomInterface[] | string;
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
  user: UserInterface | null;
  updateUser: Function;
  removeAccount: Function;
  setAccount: Function;
}
export interface CardIconProps {
  value: string;
  suit: CardSuitEnum;
  opacity?: boolean;
  style?: string;
  delay?: string;
}

//interfaces
export interface CardInterface {
  id: number;
  suit: CardSuitEnum;
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
  players?: number;
}
export interface UserInterface {
  _id: string;
  username: string;
  image: string;
  chips: number;
  role: UserRoleEnum;
  matches: {
    highCard: number;
    onePair: number;
    twoPair: nu;
    threeOfKind: nu;
    straight: nu;
    flush: nu;
    fullHouse: nu;
    poker: nu;
    straightFlush: nu;
    royalFlush: nu;
  };
  createdAt: Date;
  accessToken: string;
}

//inputs
export interface LoginInput {
  email: string;
  password: string;
  global: string;
}
export interface RegisterInput extends LoginInput {
  username: string;
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

export enum SoundsEnum {
  shuffle = "shuffle",
  deal = "deal",
  check = "check",
  bid = "bid",
  allIn = "allIn",
}

export enum LayoutTypeEnum {
  default = "default",
  withoutFooter = "withoutFooter",
  empty = "empty",
  app = "app",
  appRoom = "appRoom",
}

export enum NavbarTypeEnum {
  default = "default",
  app = "app",
}

export enum FooterTypeEnum {
  default = "default",
  app = "app",
}

export enum ContainerTypeEnum {
  default = "default",
  bordersWhite = "bordersWhite",
}

export enum UserRoleEnum {
  user = "user",
  vip = "vip",
  admin = "admin",
  creator = "creator",
}

export enum CardSuitEnum {
  spades = "spades",
  diamonds = "diamonds",
  hearts = "hearts",
  clubs = "clubs",
}

export enum PokerHandsEnum {
  highCard = "highCard",
  onePair = "onePair",
  twoPair = "twoPair",
  threeOfKind = "threeOfKind",
  straight = "straight",
  flush = "flush",
  fullHouse = "fullHouse",
  poker = "poker",
  straightFlush = "straightFlush",
  royalFlush = "royalFlush",
}

export enum PositionsEnum {
  center = "center",
  top = "top",
}
