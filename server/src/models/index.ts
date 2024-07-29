import { Request } from 'express';
import * as mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';
import { ConnectRoomDto, CreateRoomDto, TakeSitDto } from 'src/dto';

export interface RequestInterface extends Request {
  user: string;
}
export interface SocketCustom extends Socket {
  user: Partial<UserInterface>;
}
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
  userId: string;
  message: string;
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
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  lastRoomVisited: string;
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
  accessToken: string;
}
export interface UserWithTokenInterface extends UserInterface {
  accessToken: string;
}

//args
export interface PlayerRebuyChipsArgs {
  roomId: string;
  userId: string;
  chips: number;
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
  type: ContinueGameTypeEnum;
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
  values: MessageInterface;
}
export interface UpdateInDeskArgs {
  id: string;
  values?: DeskInterface;
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
export interface SetMessageArgs {
  roomId: string;
  message: MessageInterface;
}
export interface NewMessageArgs {
  values: { roomId?: string; message: string };
  server: Server;
  socket?: SocketCustom;
}
export interface findPlayerMoveArgs {
  roomId: string;
  userId: string;
}
export interface UpdatePlayerChipsArgs extends findPlayerMoveArgs {
  chips: number;
}
export interface UpdateChipsArgs {
  id: string;
  chips: number;
  socket?: SocketCustom;
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
  server: Server;
  socket: SocketCustom;
}
export interface TakeSitArgs {
  values: TakeSitDto;
  server: Server;
  socket: SocketCustom;
}
export interface LeaveRoomOrDisconnectArgs {
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
  endRound = 'endRound',
  clearActions = 'clearActions',
}
export enum DeskTypesEnum {
  dealer = 'dealer',
  stop = 'stop',
  takeCard = 'takeCard',
  reset = 'reset',
}
export enum GameSoundTypesEnum {
  shuffle = 'shuffle',
  deal = 'deal',
  check = 'check',
  bid = 'bid',
  allIn = 'allIn',
}
export enum ContinueGameTypeEnum {
  continue = 'continue',
  break = 'break',
  desk = 'desk',
  allIn = 'allIn',
  player = 'player',
}
export enum UserRoleEnum {
  user = 'user',
  vip = 'vip',
  admin = 'admin',
  creator = 'creator',
}
