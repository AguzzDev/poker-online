import axios from "axios";
import { Game } from "components/Room/Game";
import { Chat } from "components/Room/Chat";
import { Sidebar } from "components/Sidebar";
import { GetStaticProps } from "next";
import { GetStaticPaths } from "next";
import { useEffect } from "react";
import { useState } from "react";
import { useGame } from "context/Game/GameProvider";
import { useUser } from "context/User/UserProvider";
import { PlayerModeEnum, RoomInterface } from "models";
import { Navbar } from "components/Navbar";
import { useRouter } from "next/router";

const Room = ({ data }: { data: RoomInterface }) => {
  const [showChat, setShowChat] = useState<boolean>(true);
  const router = useRouter();

  let body;

  const { room, setRoom, joinRoom, socket } = useGame();

  useEffect(() => {
    setRoom(data);
  }, []);

  useEffect(() => {
    if (!socket) return;
    joinRoom({ id: router.query.id });
  }, [socket]);

  if (room) {
    body = (
      <>
        <Navbar />
        <section className="flex h-[90vh]">
          <Game showChat={showChat} setShowChat={setShowChat} />
          {showChat ? <Chat /> : null}
        </section>
      </>
    );
  }

  return body;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/room`);

  const paths = data.map(({ _id }) => ({
    params: {
      id: _id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/room/${params.id}`);

  return {
    props: {
      data,
    },
  };
};

export default Room;
