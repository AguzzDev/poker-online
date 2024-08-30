import { useState, useContext } from "react";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import EVENTS from "utils/events";
import { toast } from "react-toastify";
import { useUser } from "context/User/UserProvider";
import {
  PlayerInterface,
  SoundsEnum,
  GameContextType,
  Status,
  CreateRoomInput,
  NewMessageInput,
  ErrorInterface,
  RoomInterface,
  UserInterface,
} from "models";
import { emitSound } from "utils/emitSound";
import GameContext from "context/Game/GameContext";
import getRoomsAdapter from "adapters/room/fetchRoomsAdapter";

const GameProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<GameContextType["socket"]>(null);
  const [player, setPlayer] = useState<GameContextType["player"]>(null);
  const [playersOnline, setPlayersOnline] =
    useState<GameContextType["playersOnline"]>(null);
  const [room, setRoom] = useState<GameContextType["room"]>(null);
  const [rooms, setRooms] = useState<GameContextType["rooms"]>(null);
  const [roomNotification, setRoomNotification] =
    useState<GameContextType["roomNotification"]>(null);
  const [usersOnline, setUsersOnline] =
    useState<GameContextType["usersOnline"]>(0);
  const [roomStatus, setRoomStatus] =
    useState<GameContextType["roomStatus"]>(null);
  const [turn, setTurn] = useState<GameContextType["turn"]>(null);
  const [bid, setBid] = useState<GameContextType["bid"]>(0);
  const [showReBuyMenu, setShowReBuyMenu] =
    useState<GameContextType["showReBuyMenu"]>(false);
  const [reBuyMessage, setReBuyMessage] =
    useState<GameContextType["reBuyMessage"]>(null);

  const toastValues = { theme: "dark" };
  const router = useRouter();
  const { user, updateUser } = useUser();

  const createRoom = (values: CreateRoomInput) => {
    const { global, ...rest } = values;
    socket!.emit(EVENTS.CLIENT.CREATE_ROOM, rest);
  };

  const deleteRoom = (id: string) => {
    socket!.emit(EVENTS.CLIENT.DELETE_ROOM, id);
  };

  const getPlayers = () => {
    socket!.emit(EVENTS.CLIENT.GET_PLAYERS, (data: any) => {
      setPlayersOnline(data);
    });
  };
  const joinRoom = (values: { id: string }) => {
    socket!.emit(
      EVENTS.CLIENT.CONNECT_ROOM,
      values,
      (res: ErrorInterface | RoomInterface) => {
        if ("error" in res) {
          return toast.error(res.message, toastValues);
        }
        setRoom(res);
      }
    );
  };

  const takeSit = (sit: number) => {
    socket!.emit(
      EVENTS.CLIENT.TAKE_SIT,
      {
        roomId: room!._id,
        sit,
      },
      (
        res: ErrorInterface | { room: RoomInterface; player: PlayerInterface }
      ) => {
        if ("error" in res) {
          return toast.error(res.message, toastValues);
        }

        setRoom(res.room);
        setBid(res.room.desk.blind);
        setPlayer(res.player);

        if (res.room.desk.players.length >= 2) {
          return startGame(res.room._id);
        }
      }
    );
  };

  const leaveRoom = () => {
    socket!.emit(EVENTS.CLIENT.LEAVE_ROOM);
    setRoom(null);
    setPlayer(null);
    router.push("/app");
  };

  const newMessage = (values: NewMessageInput) => {
    socket!.emit(EVENTS.CLIENT.MESSAGE, values);
  };

  const playMove = (action: Status) => {
    let newBid = bid;

    const { bidToPay, totalBid } = room!.desk;

    let newBidToPay = bidToPay - player!.bid;
    if (action === Status.call) {
      newBid = newBidToPay;
    }
    if (action === Status.bid) {
      if (bid < newBidToPay || player!.chips <= bid) return;
      setBid(bid);
      newBid = bid;
    }
    if (action === Status.raise) {
      if (bid < newBidToPay || player!.chips <= bid) return;
      setBid(bid);
      newBid = bid;
    }
    if (action === Status.allIn) {
      setBid((prev) => player!.chips - prev);
      newBid = player!.chips;
    }

    socket!.emit(EVENTS.CLIENT.PLAYER_ACTION, {
      roomId: room!._id,
      userId: user!._id,
      action,
      bidToPay: newBid + player!.bid,
      bid: newBid,
      totalBid: totalBid + newBid,
    });
  };

  const startGame = (id: string) => {
    socket!.emit(EVENTS.CLIENT.START_GAME, id);
  };

  const reBuyChips = () => {
    try {
      socket!.emit(
        EVENTS.CLIENT.PLAYER_REBUY,
        {
          roomId: room!._id,
          userId: player!.userId,
          chips: room!.buyIn,
        },
        (res: ErrorInterface) => {
          if (res.error) {
            setReBuyMessage(res.message);
          }

          setShowReBuyMenu(false);
        }
      );
    } catch (error: unknown) {}
  };

  useEffect(() => {
    if (socket || !user) return;
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL!, {
      reconnection: false,
      auth: {
        token: user!.accessToken,
      },
    });

    setSocket(newSocket);
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    socket.on(EVENTS.SERVER.ALL_PLAYERS, (users) => {
      setUsersOnline(users);
    });
    socket.on(EVENTS.SERVER.UPDATE_USER, (data: Partial<UserInterface>) => {
      updateUser(data);
    });
    socket.emit(EVENTS.CLIENT.UPDATE_USER, (data: Partial<UserInterface>) => {
      updateUser(data);
    });

    if (router.pathname !== "/app/room/[id]") {
      socket!.emit(EVENTS.CLIENT.LEAVE_ROOM);

      const getRooms = async () => {
        try {
          let timeout: NodeJS.Timeout;
          const time = 4000;

          timeout = setTimeout(async () => {
            const res = await getRoomsAdapter();
            setRooms(res);
          }, time);

          return () => clearInterval(timeout);
        } catch (error) {
          setRooms(error as string);
        }
      };

      getRooms();

      socket.on(EVENTS.SERVER.ROOMS, ({ type, room }) => {
        setRooms((prevRooms) => {
          if (!Array.isArray(prevRooms)) return prevRooms;

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

      return () => {
        socket.removeAllListeners();
      };
    } else {
      socket.on(EVENTS.SERVER.GAME_SOUND, (type: SoundsEnum) => {
        emitSound(SoundsEnum[type]);
      });
      socket.on(EVENTS.SERVER.ROOM_STATUS, (status) => {
        if (status === "delete") {
          return router.push("/");
        }
      });
      socket.on(EVENTS.SERVER.ROOM_INFO, ({ message, by }) => {
        if (by === user!._id) {
          setRoomStatus("Your turn");
          return;
        }
        setRoomStatus(message);
      });
      socket.on(EVENTS.SERVER.MESSAGE_SEND, (res) => {
        setRoom((prev) => {
          if (!prev) return null;

          return {
            ...prev,
            messages: [...prev.messages, res],
          };
        });
      });
      socket.on(EVENTS.SERVER.PLAYER_REBUY, async (data: PlayerInterface[]) => {
        const itsMe = data.some(({ userId }) => userId === user!._id);
        if (itsMe) {
          setShowReBuyMenu(true);
          await new Promise((resolve) => setTimeout(resolve, 15000));
          setShowReBuyMenu(false);
        }
      });
      socket.on(EVENTS.SERVER.UPDATE_GAME, (data) => {
        setRoom((prev) => {
          if (!prev) return null;

          return {
            ...prev,
            desk: data,
          };
        });

        const me = data.players.filter(
          (p: PlayerInterface) => p.userId == user!._id
        )[0];

        setPlayer(me);
      });
      socket.on(EVENTS.SERVER.ROOM_NOTIFICATIONS, (data) => {
        setRoomNotification(data);
      });
      socket.on(EVENTS.SERVER.PLAYERS_IN_ROOM, (data) => {
        setRoom((prev) => {
          if (!prev) return null;

          return {
            ...prev,
            players: data.length,
            desk: { ...prev.desk, players: data },
          };
        });
      });
      socket.on(EVENTS.SERVER.DEAL_CARDS, (data) => {
        setRoom((prev) => {
          if (!prev) return null;

          return {
            ...prev,
            desk: { ...prev.desk, dealer: prev.desk.dealer.concat(data) },
          };
        });
      });
      socket.on(EVENTS.SERVER.PLAYER_TURN, (playerTurnId) => {
        setTurn(playerTurnId);
      });
      return () => {
        socket.removeAllListeners();
        setRoom(null);
      };
    }
  }, [socket, router]);

  return (
    <GameContext.Provider
      value={{
        socket,
        showReBuyMenu,
        bid,
        roomStatus,
        usersOnline,
        player,
        room,
        roomNotification,
        rooms,
        playersOnline,
        turn,
        reBuyMessage,
        setBid,
        setShowReBuyMenu,
        setRoomNotification,
        setRoom,
        createRoom,
        deleteRoom,
        leaveRoom,
        reBuyChips,
        newMessage,
        joinRoom,
        takeSit,
        startGame,
        playMove,
        getPlayers,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);

export default GameProvider;
