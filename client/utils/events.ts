const EVENTS = {
  connection: "connection",
  disconnect: "disconnect",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    CONNECT_ROOM: "CONNECT_ROOM",
    MESSAGE: "MESSAGE",
    LEAVE_ROOM: "LEAVE_ROOM",
    START_GAME: "START_GAME",
    TAKE_SIT: "TAKE_SIT",
    DEAL_CARDS: "DEAL_CARDS",
    PLAYER_ACTION: "PLAYER_ACTION",
    PLAYER_REBUY: "PLAYER_REBUY",
    DELETE_ROOM: "DELETE_ROOM",
    UPDATE_USER: "UPDATE_USER",
    GET_PLAYERS: "GET_PLAYERS",
  },
  SERVER: {
    ALL_PLAYERS: "ALL_PLAYERS",
    CONNECT_ROOM: "CONNECT_ROOM",
    ROOM_CREATE: "ROOM_CREATE",
    ROOM_STATUS: "ROOM_STATUS",
    ROOMS: "ROOMS",
    PLAYERS_IN_ROOM: "PLAYER_IN_ROOM",
    UPDATE_ROOMS: "UPDATE_ROOMS",
    GAME_WINNER: "GAME_WINNER",
    GAME_SOUND: "GAME_SOUND",
    MESSAGES_HISTORY: "MESSAGES_HISTORY",
    ROOM_NOTIFICATIONS: "ROOM_NOTIFICATIONS",
    MESSAGE_SEND: "MESSAGE_SEND",
    PASSWORD_CORRECT: "PASSWORD_CORRECT",
    ROOM_INFO: "ROOM_INFO",
    UPDATE_GAME: "UPDATE_GAME",
    UPDATE_PLAYER: "UPDATE_PLAYER",
    DEAL_CARDS: "DEAL_CARDS",
    PLAYER_TURN: "PLAYER_TURN",
    PLAYER_ACTION: "PLAYER_ACTION",
    PLAYER_REBUY: "PLAYER_REBUY",
    UPDATE_USER: "UPDATE_USER",
    MISSION_PROGRESS: "MISSION_PROGRESS",
  },
};

export default EVENTS;
