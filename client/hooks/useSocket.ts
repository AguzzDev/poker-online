import { useGame } from "context/Game/GameProvider";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const useSocket = (accessToken) => {
  const { socket, setSocket } = useGame();

  useEffect(() => {
    if (!socket) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
        reconnection: false,
        auth: {
          token: accessToken || "",
        },
      });

      setSocket(newSocket);
    }
  }, [socket]);
};
