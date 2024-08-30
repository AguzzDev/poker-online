import { Container } from "components/Container/Container";
import { Layout } from "components/Layout/Layout";
import { Chat, Game } from "components/Room";
import { useGame } from "context/Game/GameProvider";
import { LayoutTypeEnum, NavbarTypeEnum } from "models";
import { useState } from "react";

export const RoomPage = () => {
  const [showChat, setShowChat] = useState<boolean>(true);

  let body = <></>;

  const { room } = useGame();

  if (room) {
    body = (
      <Layout type={LayoutTypeEnum.appRoom} navType={NavbarTypeEnum.app}>
        <Container style="p-2 flex space-x-5 h-full">
          <Game showChat={showChat} setShowChat={setShowChat} />

          {showChat ? (
            <section className="hidden lg:block w-[35%] lg:w-1/4">
              <Chat />
            </section>
          ) : null}
        </Container>
      </Layout>
    );
  }

  return body;
};
