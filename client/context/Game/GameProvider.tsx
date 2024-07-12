import { useState, useContext } from "react";
import { Socket, io } from "socket.io-client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies, setCookie } from "nookies";

import { SOCKET_URL } from "config/default";
import EVENTS from "utils/events";
import { useUser } from "context/User/UserProvider";
import * as API from "services";
import { RoomInterface, PlayerInterface } from "models";
import { emitSound } from "utils/emitSound";
import GameContext from "context/Game/GameContext";

const GameProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<Socket>(null);
  const [usersOnline, setUsersOnline] = useState<number>(0);
  const [room, setRoom] = useState<RoomInterface | null>(null);
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [roomMessage, setRoomMessage] = useState([]);
  const [roomInfo, setRoomInfo] = useState<string>("");
  const [turn, setTurn] = useState<string>("");
  const [timer, setTimer] = useState<number>(100);
  const [player, setPlayer] = useState<PlayerInterface | null>(null);
  const [bid, setBid] = useState<number>(0);
  const [showReBuyMenu, setShowReBuyMenu] = useState<boolean>(false);
  const [reBuy, setReBuy] = useState<{ err: string; message: string }>({
    err: null,
    message: null,
  });

  const router = useRouter();

  const { lastRoomVisited } = parseCookies();
  const { user, updateUser } = useUser();

  const createRoom = async (values) => {
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, {
      ...values,
      own: user._id,
    });
  };

  const deleteRoom = async (id) => {
    socket.emit(EVENTS.CLIENT.DELETE_ROOM, id);
  };

  const joinRoom = (values: string) => {
    socket.emit(EVENTS.CLIENT.CONNECT_ROOM, values, (res) => {
      if (res.error) {
        return alert(res.error);
      }

      setCookie(null, "lastRoomVisited", res.roomId);
      setRoom(res.room);
      router.push(`/room/${res.roomId}`);
    });
  };

  const takeSit = (sit) => {
    socket.emit(
      EVENTS.CLIENT.TAKE_SIT,
      {
        roomId: room._id,
        sit,
      },
      (res) => {
        if (res.error) {
          return alert(res.error);
        }

        setRoom(res.room);
        setPlayer(res.player);

        if (res.room.desk.players.length === 2) {
          return startGame(res.room._id);
        }
      }
    );
  };

  const leaveRoom = () => {
    socket.emit(EVENTS.CLIENT.LEAVE_ROOM);
    setRoom(null);
    setPlayer(null);
    router.push("/");
  };

  const newMessage = (values) => {
    socket.emit(EVENTS.CLIENT.MESSAGE, { ...values, roomId: values.id });
  };

  const playMove = (action) => {
    let actionValue = action;
    let newBid = bid;
    const { bidToPay } = room.desk;

    if (action !== "allIn") {
      if (action === "raise") {
        newBid = bid <= bidToPay * 2 ? bidToPay * 2 : bid;
      }
      if (action === "call") {
        newBid = bidToPay;
      }
      if (newBid > player.chips) {
        setBid(player.chips);
        actionValue = "allIn";
        newBid = player.chips;
      }
    }

    if (action === "allIn") {
      setBid((prev) => player.chips - prev);
      newBid = player.chips - player.bid;
    }

    socket.emit(EVENTS.CLIENT.PLAYER_ACTION, {
      roomId: room._id,
      userId: user._id,
      action: actionValue,
      bid: Math.ceil(newBid),
    });
  };

  const startGame = (id) => {
    socket.emit(EVENTS.CLIENT.START_GAME, id);
  };

  const rebuyChips = () => {
    socket.emit(
      EVENTS.CLIENT.PLAYER_REBUY,
      {
        roomId: room._id,
        userId: player.userId,
        chips: room.buyIn,
      },
      ({ err, message }) => {
        setReBuy({ err, message });
      }
    );
  };

  useEffect(() => {
    if (!socket && user) {
      const newSocket = io(SOCKET_URL, {
        reconnection: false,
        auth: {
          token: user.accessToken || "",
          lastRoomVisited: lastRoomVisited,
        },
      });

      setSocket(newSocket);
    }
  }, [socket, user, router]);

  useEffect(() => {
    if (!socket) return;

    socket.on(EVENTS.SERVER.PLAYER_CHIPS, (playerChips) => {
      updateUser({ chips: playerChips });
    });
    socket.emit(EVENTS.CLIENT.PLAYER_CHIPS);

    if (router.pathname === "/") {
      const getRooms = async () => {
        const { data } = await API.fetchRooms();

        setRooms(data);
      };

      getRooms();

      socket.on(EVENTS.SERVER.ROOMS, ({ type, room }) => {
        setRooms((prevRooms) => {
          if (type === "create") {
            return [...prevRooms, room];
          } else if (type === "update") {
            return prevRooms.map((data) =>
              data._id === room._id ? room : data
            );
          } else if (type === "delete") {
            return prevRooms.filter(({ _id }) => _id != room._id);
          }
          return prevRooms;
        });
        socket.off(EVENTS.SERVER.UPDATE_ROOMS);
      });

      socket.on(EVENTS.SERVER.ALL_PLAYERS, (users) => {
        setUsersOnline(users);
      });

      return () => {
        socket.removeAllListeners();
      };
    } else {
      socket.on(EVENTS.SERVER.GAME_SOUND, (type) => {
        emitSound(type);
      });
      socket.on(EVENTS.SERVER.ROOM_STATUS, (status) => {
        if (status === "delete") {
          return router.push("/");
        }
      });
      socket.on(EVENTS.SERVER.ROOM_INFO, ({ message, by }) => {
        if (by === user._id) {
          setRoomInfo("Tu turno");
          return;
        }
        console.log(message)
        setRoomInfo(message);
      });
      socket.on(EVENTS.SERVER.MESSAGE_SEND, (res) => {
        setRoom((prev) => ({
          ...prev,
          messages: prev.messages.concat(res),
        }));
      });
      socket.on(EVENTS.SERVER.PLAYER_REBUY, async (data) => {
        const itsMe = data.some(({ userId }) => userId === user._id);
        if (itsMe) {
          setShowReBuyMenu(true);
          await new Promise((resolve) => setTimeout(resolve, 15000));
          setShowReBuyMenu(false);
        }
      });
      socket.on(EVENTS.SERVER.UPDATE_GAME, (data) => {
        console.log("updategame", data);
        setRoom((prev) => ({ ...prev, desk: data }));
        setBid(data.bidToPay ? data.bidToPay : (25 * data.totalBid) / 100);

        const me = data.players.filter((v) => v.userId == user._id)[0];
        setPlayer(me);
      });
      socket.on(EVENTS.SERVER.ROOM_MESSAGES, (data: any) => {
        setRoomMessage(data);
      });
      socket.on(EVENTS.SERVER.PLAYERS_IN_ROOM, (data: any) => {
        setRoom((prev) => ({ ...prev, desk: { ...prev.desk, players: data } }));
      });
      socket.on(EVENTS.SERVER.DEAL_CARDS, (data) => {
        setRoom((prev) => ({
          ...prev,
          desk: { ...prev.desk, dealer: prev.desk.dealer.concat(data) },
        }));
      });
      socket.on(EVENTS.SERVER.PLAYER_TURN, (player) => {
        setTurn(player);
      });
      socket.on(EVENTS.SERVER.PLAYER_TIMER, (data) => {
        setTimer((data * 100) / 10);
      });
      return () => {
        socket.removeAllListeners();
      };
    }
  }, [socket, router]);

  return (
    <GameContext.Provider
      value={{
        socket,
        showReBuyMenu,
        bid,
        roomInfo,
        usersOnline,
        player,
        room,
        roomMessage,
        rooms,
        timer,
        turn,
        reBuy,
        setSocket,
        setPlayer,
        setShowReBuyMenu,
        setRoomMessage,
        setRoom,
        setTimer,
        setRooms,
        setTurn,
        setBid,
        createRoom,
        deleteRoom,
        leaveRoom,
        rebuyChips,
        newMessage,
        joinRoom,
        takeSit,
        startGame,
        playMove,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);

export default GameProvider;
