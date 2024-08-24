import { Layout } from "components/Layout/Layout";
import { useGame } from "context/Game/GameProvider";
import { useUser } from "context/User/UserProvider";
import { LayoutTypeEnum, NavbarTypeEnum, PokerHandsEnum } from "models";
import { Stats } from "components/Stats/Stats";
import { Container } from "components/Container/Container";
import { TextUnderline } from "components/Text/TextUnderline";
import { ButtonOne } from "components/Button/ButtonOne";
import { useRouter } from "next/router";
import { Rooms } from "components/Room/Rooms";

export const AppPage = () => {
  const router = useRouter();
  const { user, adminRole } = useUser();
  const { usersOnline } = useGame();

  return (
    <Layout type={LayoutTypeEnum.app} navType={NavbarTypeEnum.app}>
      <section className="flex flex-col-reverse xl:flex-row xl:space-x-5 h-full">
        <Container style="flex flex-col w-full xl:w-4/6 h-full md:h-full">
          <div className="flex items-center justify-between mb-3">
            <TextUnderline text="Rooms" />

            <h4>Players online: {usersOnline}</h4>
          </div>

          {adminRole ? (
            <ButtonOne onClick={() => router.push("/dashboard")}>
              Dashboard
            </ButtonOne>
          ) : null}

          <Rooms />
        </Container>

        <Container style="flex flex-col h-80 xl:flex-1 xl:h-full mb-5 xl:mb-0">
          <TextUnderline text="Statistics" />

          {user ? (
            <div className="flex flex-row lg:flex-col items-center lg:items-start h-full space-x-10 lg:space-x-0 lg:space-y-5 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden lg:overflow-y-scroll lg:pb-2 pr-5 lg:pr-3 mt-3">
              <Stats
                title={PokerHandsEnum["highCard"]}
                value={user.matches.highCard}
              />
              <Stats
                title={PokerHandsEnum["onePair"]}
                value={user.matches.onePair}
              />
              <Stats
                title={PokerHandsEnum["twoPair"]}
                value={user.matches.twoPair}
              />
              <Stats
                title={PokerHandsEnum["threeOfKind"]}
                value={user.matches.threeOfKind}
              />
              <Stats
                title={PokerHandsEnum["straight"]}
                value={user.matches.straight}
              />
              <Stats
                title={PokerHandsEnum["flush"]}
                value={user.matches.flush}
              />
              <Stats
                title={PokerHandsEnum["fullHouse"]}
                value={user.matches.fullHouse}
              />
              <Stats
                title={PokerHandsEnum["poker"]}
                value={user.matches.poker}
              />
              <Stats
                title={PokerHandsEnum["straightFlush"]}
                value={user.matches.straightFlush}
              />
              <Stats
                title={PokerHandsEnum["royalFlush"]}
                value={user.matches.royalFlush}
              />
            </div>
          ) : null}
        </Container>
      </section>
    </Layout>
  );
};
