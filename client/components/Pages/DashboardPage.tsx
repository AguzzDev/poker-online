import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ButtonOne } from "components/Button/ButtonOne";
import { Container } from "components/Container/Container";
import { IconSm } from "components/Icon";
import { Layout } from "components/Layout/Layout";
import { NewRoom } from "components/Room/NewRoom";
import { Rooms } from "components/Room/Rooms";
import { TextUnderline } from "components/Text/TextUnderline";
import { useGame } from "context/Game/GameProvider";
import { LayoutTypeEnum } from "models";
import { useRouter } from "next/router";
import { useState } from "react";

export const DashboardPage = () => {
  let body;
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const { playersOnline, getPlayers } = useGame();

  if (screen === 0) {
    body = (
      <section>
        <div className="flex justify-between gap-10">
          <ButtonOne className="w-full" onClick={() => setScreen(1)}>
            Create Room
          </ButtonOne>
          <ButtonOne
            className="w-full"
            onClick={() => {
              getPlayers();
              setScreen(2);
            }}
          >
            Players
          </ButtonOne>
        </div>

        <div className="grid gap-3 mt-3 mb-10">
          <h4>Rooms</h4>

          <Rooms />
        </div>
      </section>
    );
  } else if (screen === 1) {
    body = <NewRoom />;
  } else {
    body = (
      <div>
        <h4>Players Online</h4>

        <div className="mt-3">
          {playersOnline?.map((name, i) => (
            <p key={i}>{name}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Layout type={LayoutTypeEnum.app}>
      <Container style="h-full">
        <div className="flex space-x-3 mb-3">
          <button
            onClick={() => {
              if (screen == 0) {
                router.back();
              }
              setScreen(0);
            }}
          >
            <IconSm Icon={ChevronLeftIcon} />
          </button>
          <TextUnderline text="Dashboard" />
        </div>

        <div className="overflow-scroll h-full">{body}</div>
      </Container>
    </Layout>
  );
};
