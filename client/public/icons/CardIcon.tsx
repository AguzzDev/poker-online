import { CardIconProps, CardSuitEnum } from "models";
import ClubsIcon from "public/icons/ClubsIcon";
import DiamondsIcon from "public/icons/DiamondsIcon";
import HeartsIcon from "public/icons/HeartsIcon";
import SpadesIcon from "public/icons/SpadesIcon";

export const CardIcon = ({
  suit,
  value,
  opacity = false,
  style,
  delay,
}: CardIconProps) => {
  let color = "";

  if (!!delay) {
    color = "text-primary";
  } else {
    color =
      suit === CardSuitEnum.diamonds || suit === CardSuitEnum.hearts
        ? "text-[#F24822]"
        : "text-black";
  }

  const SuitIcon = () => {
    switch (suit) {
      case CardSuitEnum.clubs:
        return <ClubsIcon className={`fill-current ${color}`} />;
      case CardSuitEnum.diamonds:
        return <DiamondsIcon className={`fill-current ${color}`} />;
      case CardSuitEnum.hearts:
        return <HeartsIcon className={`fill-current ${color}`} />;
      case CardSuitEnum.spades:
        return <SpadesIcon className={`fill-current ${color}`} />;
      default:
        return null;
    }
  };

  if (!!delay) {
    return (
      <div
        style={{ animationDelay: `${delay}ms` }}
        className={`${style} card-animation invisible relative w-10 h-14 border-[1.5px] border-[#3A3A3A] bg-[#303030] rounded-md overflow-hidden`}
      >
        <div className="absolute top-[2px] left-[2px] flex flex-col items-center">
          <p className={`${color} text-[0.5rem] leading-[0.5rem] mb-[2px]`}>
            {value}
          </p>

          <SuitIcon />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`${
          opacity ? "opacity-40" : ""
        } ${style} relative w-10 h-16 md:w-14 md:h-24 1920:w-16 1920:h-26 border-[1.5px] border-[#3A3A3A] bg-[#303030] rounded-md overflow-hidden`}
      >
        <div className="absolute top-[2px] left-[2px] flex flex-col items-center">
          <p className={`${color} text-[0.5rem] leading-[0.5rem] mb-[2px]`}>
            {value}
          </p>

          <SuitIcon />
        </div>
      </div>
    );
  }
};
