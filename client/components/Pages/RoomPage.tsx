import { Container } from "components/Container/Container";
import { Layout } from "components/Layout/Layout";
import { Chat, Game } from "components/Room";
import { useGame } from "context/Game/GameProvider";
import { LayoutTypeEnum, NavbarTypeEnum } from "models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const RoomPage = () => {
  const [showChat, setShowChat] = useState<boolean>(true);
  const router = useRouter();

  let body = <></>;

  const { room, joinRoom, socket } = useGame();

  useEffect(() => {
    if (!socket) return;
    if (!room) {
      joinRoom({ id: router.query.id as string });
    }
  }, [socket, room]);

  if (room) {
    body = (
      <Layout type={LayoutTypeEnum.appRoom} navType={NavbarTypeEnum.app}>
        <Container style="p-2 flex space-x-5 h-full">
          <Game showChat={showChat} setShowChat={setShowChat} />

          {showChat ? (
            <section className="hidden md:block w-[35%] lg:w-1/4">
              <Chat />
            </section>
          ) : null}
        </Container>
      </Layout>
    );
  }

  return body;
};
