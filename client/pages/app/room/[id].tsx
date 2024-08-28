import axios from "axios";
import { RoomPage } from "components/Pages/RoomPage";
import { useGame } from "context/Game/GameProvider";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Room: NextPage = () => {
  const router = useRouter();
  const { joinRoom, socket } = useGame();

  useEffect(() => {
    if (!socket) return;

    joinRoom({ id: router.query.id as string });
  }, [socket]);

  return <RoomPage />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const isLogged = !!context.req.cookies.user;

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/room/${context?.params?.id}`
    );

    if (!data || !isLogged) {
      return {
        props: {},
        redirect: { destination: "/app" },
      };
    }

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default Room;
