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

  const roomsData = Array.isArray(rooms.data)
    ? rooms.data.map((data: Partial<RoomInterface>, i: number) => (
        <RoomItem data={data} i={i} />
      ))
    : rooms.data;

  return (
    <Layout type={LayoutTypeEnum.app} navType={NavbarTypeEnum.app}>
      <section className="flex flex-col-reverse md:flex-row md:space-x-5 h-full">
        <Container style="flex flex-col w-full md:w-4/6 h-full md:h-full">
          <div className="flex items-center justify-between">
            <TextUnderline text="Rooms" />

            <h5>Players online: {usersOnline}</h5>
          </div>

          {rooms.loading ? (
            <div className="flex items-center justify-center h-3/4">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-y-scroll mt-3 pr-5 md:pr-3">
              {roomsData}
            </div>
          )}
        </Container>

        <Container style="flex flex-col h-48 md:flex-1 mb-5 md:mb-0 md:h-full">
          <TextUnderline text="Statistics" />

          <div className="flex flex-row md:flex-col items-center md:items-start h-full space-x-4 md:space-x-0 md:space-y-2 overflow-x-auto overflow-y-hidden md:overflow-x-hidden md:overflow-y-scroll md:pb-2 pr-5 md:pr-3">
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
