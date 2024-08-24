import { PokerHandsEnum } from "models";
import { PokerHandsIcon } from "public/icons/PokerHandsIcon";

export const Stats = ({
  title,
  value,
}: {
  title: PokerHandsEnum;
  value: number;
}) => {
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
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-workSansSBI">{statsTextDictionary[title]}</h4>

          <p className="block lg:hidden font-bold">{value}</p>
        </div>

        <PokerHandsIcon type={title} />
      </div>

      <h5 className="hidden lg:block px-2 font-bold">{value}</h5>
    </div>
  );
};
