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
  trigger: JSX.Element | JSX.Element[] | string;
  content: JSX.Element[] | JSX.Element;
}
export interface DropdownProps extends RadixComponentProps {
  size?: number | string;
}
export interface ModalProps extends RadixComponentProps {
  position?: PositionsEnum;
  rounded?: string;
}
export interface GameRoomProps {
  playerMode: PlayerModeEnum;
  mode?: string;
}
export interface HistoryBidProps {
  bid: number;
  player: string;
}
export interface CardIconProps {
  value?: string;
  suit?: CardSuitEnum;
  opacity?: boolean;
  style?: string;
  delay?: string;
  type?: CardIconTypeEnum;
}
export interface FormProps {
  errors: string | undefined;
  resetForm: () => void;
  actionButton?: Array<any>;
  inputs: {
    name: string;
    type?: string;
    options?: { label: string; value: string }[];
  }[];
  buttonText: string;
}
export interface InputFieldProps {
  name: string;
  type?: string;
  options?: { label: string; value: string }[];
  [key: string]: any;
}
export interface PlayerInTableProps {
  sit: number;
  position: string;
  directions: { x: string; y: string };
}
export interface ShowChatProps {
  showChat: boolean;
  setShowChat: Dispatch<SetStateAction<ShowChatProps["showChat"]>>;
}

//types
export interface GameContextType {
  socket: Socket | null;
  room: RoomInterface | null;
  rooms: RoomInterface[] | string | null;
  player: PlayerInterface | null;
  playersOnline: any[] | null;
  reBuyMessage: string | null;
  roomNotification: string | null;
  roomStatus: string | null;
  turn: string | null;
  bid: number;
  usersOnline: number;
  showReBuyMenu: boolean;
  setBid: Dispatch<SetStateAction<GameContextType["bid"]>>;
  setShowReBuyMenu: Dispatch<SetStateAction<GameContextType["showReBuyMenu"]>>;
  setRoom: Dispatch<SetStateAction<GameContextType["room"]>>;
  setRoomNotification: Dispatch<
    SetStateAction<GameContextType["roomNotification"]>
  >;
  createRoom: (v: CreateRoomInput) => void;
  deleteRoom: (id: string) => void;
  leaveRoom: () => void;
  newMessage: (v: NewMessageInput) => void;
  joinRoom: ({ id }: { id: string }) => void;
  takeSit: (num: number) => void;
  startGame: (id: string) => void;
  playMove: (action: Status) => void;
  reBuyChips: () => void;
  getPlayers: () => void;
}
export interface UserContextType {
  user: UserInterface | null;
  adminRole: boolean;
  updateUser: Function;
  removeAccount: Function;
  setAccount: (data: UserInterface) => void;
}

//interfaces
export interface ErrorInterface {
  error: boolean;
  message: string;
}
export interface CardInterface {
  id: number;
  suit: CardSuitEnum;
  value: number;
}
export interface PlayerInterface {
  _id: string;
  userId: string;
  username: string;
  chips: number;
  image: string;
  sit: number;
  cards: CardInterface[];
  bid: number;
  hand: {
    heirarchy: string;
    message: string;
    cards: CardInterface[];
  };
  action: Status;
  showAction: string;
  blind: boolean;
  winningPot: number;
}
export interface DeskInterface {
  status: Status.bid | Status.raise | Status.allIn | null;
  bidToPay: number;
  totalBid: number;
  maxPlayerRoom: number;
  cards: CardInterface[];
  players: PlayerInterface[];
  dealer: CardInterface[];
  blind: number;
  buyIn: number;
}
export interface MessageInterface {
  userId: string;
  username: string;
  message: string;
  image: string;
  role: UserRoleEnum;
  timestamp: Date;
  cards: CardInterface[];
}
export interface RoomInterface {
  _id: string;
  name: string;
  own: string;
  start: boolean;
  desk: DeskInterface;
  messages: MessageInterface[];
  buyIn: number;
  players: number;
}
export interface UserInterface {
  _id: string;
  username: string;
  image: string;
  chips: number;
  provider: string;
  role: UserRoleEnum;
  matches: {
    highCard: number;
    onePair: number;
    twoPair: number;
    threeOfKind: number;
    straight: number;
    flush: number;
    fullHouse: number;
    poker: number;
    straightFlush: number;
    royalFlush: number;
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
export interface oAuthInput {
  username: string;
  email: string;
  provider: string;
}
export interface RegisterInput extends LoginInput {
  username: string;
  password2: string;
}
export interface ChangePasswordInput extends Omit<LoginInput, "password"> {}
export interface ResetPasswordInput {
  password: string;
  password2: string;
  global: string;
}
export interface CreateRoomInput {
  name: string;
  buyIn: string;
  global: string;
}
export interface NewMessageInput {
  id: string;
  userId: string;
  message: string;
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
  form = "form",
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
export enum LoginScreenTypeEnum {
  login = "login",
  register = "register",
  accountCreated = "accountCreated",
  resetPassword = "resetPassword",
  resetPasswordSuccessful = "resetPasswordSuccessful",
}
export enum CardIconTypeEnum {
  default = "default",
  loading = "loading",
  back = "back",
  room = "room",
}
