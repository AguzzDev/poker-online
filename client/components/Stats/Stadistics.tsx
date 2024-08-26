import { PokerHandsEnum, UserInterface } from "models";
import { Stats } from "./Stats";
import { useUser } from "context/User/UserProvider";
import { TextUnderline } from "components/Text/TextUnderline";

export const Stadistics = ({ data }: { data?: UserInterface["matches"] }) => {
  const { user } = useUser();

  const player = data ? data : user?.matches;

  return (
    <>
      <TextUnderline text="Statistics" />

      <div className="flex flex-row lg:flex-col items-center lg:items-start h-full space-x-10 lg:space-x-0 lg:space-y-5 overflow-x-auto overflow-y-hidden lg:overflow-x-hidden lg:overflow-y-scroll lg:pb-2 pr-5 lg:pr-3 mt-3">
        {player ? (
          <>
            <Stats title={PokerHandsEnum["highCard"]} value={player.highCard} />
            <Stats title={PokerHandsEnum["onePair"]} value={player.onePair} />
            <Stats title={PokerHandsEnum["twoPair"]} value={player.twoPair} />
            <Stats
              title={PokerHandsEnum["threeOfKind"]}
              value={player.threeOfKind}
            />
            <Stats title={PokerHandsEnum["straight"]} value={player.straight} />
            <Stats title={PokerHandsEnum["flush"]} value={player.flush} />
            <Stats
              title={PokerHandsEnum["fullHouse"]}
              value={player.fullHouse}
            />
            <Stats title={PokerHandsEnum["poker"]} value={player.poker} />
            <Stats
              title={PokerHandsEnum["straightFlush"]}
              value={player.straightFlush}
            />
            <Stats
              title={PokerHandsEnum["royalFlush"]}
              value={player.royalFlush}
            />
          </>
        ) : null}
      </div>
    </>
  );
};
