import { Server } from 'socket.io';
import { SocketCustom } from 'src/models';

interface FindUserSocketProps {
  sockets: Server['sockets'];
  userId: string;
}

export const findUserSocket = ({
  sockets,
  userId,
}: FindUserSocketProps): SocketCustom | undefined => {
  let targetSocket: SocketCustom | undefined;

  sockets.sockets.forEach((socket: SocketCustom) => {
    if (socket.user._id.toString() === userId) {
      targetSocket = socket;
    }
  });

  return targetSocket;
};
