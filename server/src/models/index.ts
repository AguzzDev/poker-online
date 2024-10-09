import { Request } from 'express';
import * as mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';
import {
  ConnectRoomDto,
  CreateRoomDto,
  TakeSitDto,
} from 'src/modules/common/dto';

export interface HandInterface {
  heirarchy: HandEnum;
  heirarchyValue: string | number;
  message: string;
  cards?: CardInterface[];
  cardHigh?: number;
  cardDecider?: CardInterface | number;
}
export interface MissionInterface {
  name: string;
  requirement: number;
  progress: number;
  type: MissionTypeEnum;
  value?: HandEnum;
  completed?: boolean;
}
export interface RequestInterface extends Request {
  user: string;
}
export interface SocketCustom extends Socket {
  user: Partial<UserInterface>;
  users: any[];
}
export interface CardInterface {
  id: number;
  suit: string;
  value: number;
}
export interface PlayerInterface {
  _id?: string;
  userId?: string;
  username?: string;
  image?: string;
  chips?: number;
  sit?: number;
  cards?: CardInterface[];
  winningPot?: number;
  bid?: number;
  hand?: HandInterface;
  action?: Status | '';
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
}
export interface MessageInterface {
  userId?: string;
  username?: string;
  message?: string;
  image?: string;
  role?: UserRoleEnum;
  timestamp?: Date;
  cards?: CardInterface[];
}
export interface RoomInterface {
  _id?: mongoose.Types.ObjectId;
  name?: string;
  password?: string;
  own?: string;
  start?: boolean;
  buyIn?: number;
  desk?: DeskInterface;
  messages?: MessageInterface[];
  players?: number;
}
export interface UserInterface {
  _id: string;
  username: string;
  image: string;
  email: string;
  password: string;
  chips: number;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  verifyCode: string;
  verify: boolean;
  role: string;
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
  missions: {
    daily: MissionItemInterface;
    weekly: MissionItemInterface;
    monthly: MissionItemInterface;
    master: MissionItemInterface;
  };
  accessToken: string;
}
export interface MissionItemInterface {
  missions: MissionInterface[];
  redeemed: boolean;
}
export interface UserWithTokenInterface extends UserInterface {
  accessToken: string;
}
export interface ErrorInterface {
  error: boolean;
  message: string;
}

//args
export interface PlayerRebuyChipsArgs {
  values: { roomId: string; userId: string; chips: number };
  sockets: Server['sockets'];
}
export interface GetMyChipsArgs {
  id: string;
  socket: SocketCustom;
}
export interface DeleteRoomArgs {
  roomId: string;
  server: Server;
}
export interface PlayersRebuyChipsArgs {
  roomId: string;
  server: Server;
  players: PlayerInterface[];
}
export interface InitialRoundArgs {
  roomId: string;
  room: RoomInterface;
  server: Server;
  playerPos: number;
}
export interface StartGameArgs {
  roomId: string;
  server: Server;
}
export interface ClearPlayerMoveArgs {
  roomId: string;
  userId: string;
}
export interface AdvancedRoundArgs {
  roomId: string;
  server: Server;
}
export interface SetAutoBlindArgs {
  roomId: string;
  x: number;
  blind: number;
  players: PlayerInterface[];
}
export interface PlayerTurnArgs {
  roomId: string;
  player: PlayerInterface;
  server: Server;
  bidToPay: number;
}
export interface updateInRoomArgs {
  id: string;
  values?: RoomInterface;
}
export interface UpdateInMessagesArgs {
  id: string;
  values?: MessageInterface;
  type: MessageTypeEnum;
}
export interface UpdateInDeskArgs {
  id: string;
  values?: any;
  type?: DeskTypesEnum;
}
export interface UpdateInPlayerArgs {
  id: string;
  values?: PlayerInterface;
  type?: PlayerTypesEnum;
}
export interface UpdateUserArgs {
  id: string;
  values: Partial<UserInterface>[] | Partial<UserInterface>;
}
export interface UserJoinToRoomArgs {
  id: string;
  values: PlayerInterface;
}
export interface ContinueGameArgs {
  room: RoomInterface;
  roomId: string;
  server: Server;
  player?: any;
  round?: number;
}
export interface sendMailArgs {
  type: MailTypeEnum;
  email: string;
}
export interface SetMessageArgs {
  roomId: string;
  message: MessageInterface;
}
export interface NewMessageArgs {
  values: {
    id: string;
    userId?: string;
    message: string;
    cards?: CardInterface[];
  };
  server: Server;
  socket?: SocketCustom;
}
export interface findPlayerMoveArgs {
  roomId: string;
  userId: string;
}
export interface UpdatePlayerChipsArgs extends findPlayerMoveArgs {
  chips: number;
  winningPot?: number;
}
export interface UpdateChipsArgs {
  id: string;
  chips: number;
  socket?: SocketCustom;
}
export interface UpdateMissionArgs {
  id: string;
  type: string;
}
export interface AddPlayerArgs {
  roomId: string;
  sit: number;
  socket: SocketCustom;
}
export interface CreateRoomArgs {
  values: CreateRoomDto;
  server: Server;
}
export interface ConnectRoomArgs {
  values: ConnectRoomDto;
  socket: SocketCustom;
}
export interface TakeSitArgs {
  values: TakeSitDto;
  server: Server;
  socket: SocketCustom;
}
export interface LeaveRoomOrDisconnectArgs extends ServerAndSocketArgs {
  spectator?: boolean;
}
export interface ServerAndSocketArgs {
  server: Server;
  socket: SocketCustom;
}
export interface ShuffleArgs {
  roomId: string;
  cards: CardInterface[];
}

//enums
export enum Status {
  fold = 'fold',
  check = 'check',
  call = 'call',
  bid = 'bid',
  raise = 'raise',
  allIn = 'allIn',
}
export enum UpdatePlayerOptionsEnum {
  action = 'action',
  showAction = 'showAction',
  cards = 'cards',
  blind = 'blind',
  winningPot = 'winningPot',
  hand = 'hand',
}
export enum UpdateDeskOptionsEnum {
  players = 'players',
  bidToPay = 'bidToPay',
}
export enum PlayerTypesEnum {
  add = 'add',
  delete = 'delete',
  reset = 'reset',
  stop = 'stop',
  clearShowAction = 'clearShowAction',
  clearActions = 'clearActions',
  clearBid = 'clearBid',
}
export enum DeskTypesEnum {
  addPlayer = 'addPlayer',
  removePlayer = 'removePlayer',
  dealer = 'dealer',
  stop = 'stop',
  takeCard = 'takeCard',
  reset = 'reset',
}
export enum MessageTypeEnum {
  setMessage = 'setMessage',
  deleteAll = 'deleteAll',
}
export enum GameSoundTypesEnum {
  shuffle = 'shuffle',
  deal = 'deal',
  check = 'check',
  call = 'bid',
  bid = 'bid',
  allIn = 'allIn',
}
export enum GameStatusEnum {
  continue = 'continue',
  stopGame = 'stopGame',
  endGame = 'endGame',
  fold = 'fold',
  allIn = 'allIn',
}
export enum UserRoleEnum {
  user = 'user',
  vip = 'vip',
  admin = 'admin',
  creator = 'creator',
}
export enum MailTypeEnum {
  welcome = 'welcome',
  verifyEmail = 'verifyEmail',
  resetPassword = 'resetPassword',
  resetPasswordSuccesful = 'resetPasswordSuccesful',
}
export enum MissionTypeEnum {
  'Rounds' = 'Rounds',
  'Chips' = 'Chips',
  'Hand' = 'Hand',
}
export enum HandEnum {
  'High Card' = 'High Card',
  'One Pair' = 'One Pair',
  'Two Pair' = 'Two Pair',
  'Three of a Kind' = 'Three of a Kind',
  'Straight' = 'Straight',
  'Flush' = 'Flush',
  'Full House' = 'Full House',
  'Poker' = 'Poker',
  'Straight Flush' = 'Straight Flush',
  'Royal Flush' = 'Royal Flush',
}
export enum MissionCategoryEnum {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  master = 'master',
}
