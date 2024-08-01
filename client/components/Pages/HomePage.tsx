import { Layout } from "components/Layout/Layout";
import { useGame } from "context/Game/GameProvider";
import { useUser } from "context/User/UserProvider";
import {
  LayoutTypeEnum,
  NavbarTypeEnum,
  PokerHandsEnum,
  RoomInterface,
} from "models";
import { Stats } from "components/Stats/Stats";
import { Container } from "components/Container/Container";
import { TextUnderline } from "components/Text/TextUnderline";
import { RoomItem } from "components/Room/RoomItem";
import { LoadingSpinner } from "components/Spinner/LoadingSpinner";

export const HomePage = () => {
  const { user } = useUser();
  const { usersOnline, rooms } = useGame();

  const {
    flush,
    fullHouse,
    highCard,
    onePair,
    poker,
    royalFlush,
    straight,
    straightFlush,
    threeOfKind,
    twoPair,
  } = user!.matches;

  const roomsData = Array.isArray(rooms)
    ? rooms.map((data: Partial<RoomInterface>, i: number) => (
        <RoomItem data={data} i={i} />
      ))
    : rooms;

  return (
    <Layout type={LayoutTypeEnum.app} navType={NavbarTypeEnum.app}>
      <section className="flex flex-col-reverse lg:flex-row lg:space-x-5 h-full">
        <Container style="flex flex-col w-full lg:w-4/6 h-full md:h-full">
          <div className="flex items-center justify-between">
            <TextUnderline text="Rooms" />

            <h4>Players online: {usersOnline}</h4>
          </div>

          {!rooms ? (
            <div className="flex items-center justify-center h-3/4">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-scroll mt-3 pr-5 md:pr-3">
              {roomsData}
            </div>
          )}
        </Container>

        <Container style="flex flex-col h-72 lg:flex-1 lg:h-full mb-5 lg:mb-0">
          <TextUnderline text="Statistics" />

          <div className="flex flex-row lg:flex-col items-center lg:items-start h-full space-x-10 lg:space-x-0 lg:space-y-5 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden lg:overflow-y-scroll lg:pb-2 pr-5 lg:pr-3">
            <Stats title={PokerHandsEnum["highCard"]} value={highCard} />
            <Stats title={PokerHandsEnum["onePair"]} value={onePair} />
            <Stats title={PokerHandsEnum["twoPair"]} value={twoPair} />
            <Stats title={PokerHandsEnum["threeOfKind"]} value={threeOfKind} />
            <Stats title={PokerHandsEnum["straight"]} value={straight} />
            <Stats title={PokerHandsEnum["flush"]} value={flush} />
            <Stats title={PokerHandsEnum["fullHouse"]} value={fullHouse} />
            <Stats title={PokerHandsEnum["poker"]} value={poker} />
            <Stats
              title={PokerHandsEnum["straightFlush"]}
              value={straightFlush}
            />
            <Stats title={PokerHandsEnum["royalFlush"]} value={royalFlush} />
          </div>
        </Container>
      </section>
    </Layout>
  );
};
