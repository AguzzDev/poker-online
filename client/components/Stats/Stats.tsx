import { PokerHandsEnum } from "models";
import { PokerHandsIcon } from "public/icons/PokerHandsIcon";

interface PropsStats {
  title: PokerHandsEnum;
  value: number | undefined;
}

export const Stats = ({ title, value }: PropsStats) => {
  const statsTextDictionary = {
    highCard: "High Card",
    onePair: "One Pair",
    twoPair: "Two Pair",
    threeOfKind: "Three Of Kind",
    straight: "Straight",
    flush: "Flush",
    fullHouse: "Full House",
    poker: "Poker",
    straightFlush: "Straight Flush",
    royalFlush: "Royal Flush",
  };

  const lastItem = title === PokerHandsEnum["royalFlush"];

  return (
    <div className="flex items-center justify-between w-full">
      <div
        className={`${
          !lastItem ? "border-r-borderWidth border-border md:border-hidden" : ""
        } flex flex-col pr-5 md:pr-0 flex-1`}
      >
        <div className="flex items-center justify-between mb-1 md:mb-0">
          <h5 className="font-workSansSBI">{statsTextDictionary[title]}</h5>

          <p className="block lg:hidden font-bold">{value}</p>
        </div>

        <PokerHandsIcon type={title} />
      </div>

      <h5 className="hidden lg:block px-2 font-bold">{value}</h5>
    </div>
  );
};
