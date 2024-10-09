import { CardIconProps, CardIconTypeEnum, CardSuitEnum } from "models";
import ClubsIcon from "public/icons/ClubsIcon";
import DiamondsIcon from "public/icons/DiamondsIcon";
import HeartsIcon from "public/icons/HeartsIcon";
import SpadesIcon from "public/icons/SpadesIcon";

export const CardIcon = ({
  suit,
  value,
  style,
  delay,
  type = CardIconTypeEnum.default,
}: CardIconProps) => {
  let body;
  let color = "";

  if (type === CardIconTypeEnum.loading) {
    color = "text-primary";
  } else {
    color =
      suit === CardSuitEnum.diamonds || suit === CardSuitEnum.hearts
        ? "text-[#F24822]"
        : "text-black";
  }

  const SuitIcon = () => {
    switch (suit!) {
      case CardSuitEnum.clubs:
        return <ClubsIcon className={color} />;
      case CardSuitEnum.diamonds:
        return <DiamondsIcon className={color} />;
      case CardSuitEnum.hearts:
        return <HeartsIcon className={color} />;
      case CardSuitEnum.spades:
        return <SpadesIcon className={color} />;
    }
  };

  if (type === CardIconTypeEnum.back) {
    return (body = (
      <div className="relative cardSizeRoom border-[1.5px] border-[#3A3A3A] bg-white rounded-md p-1"></div>
    ));
  } else if (type === CardIconTypeEnum.loading) {
    body = (
      <div
        style={{ animationDelay: `${Number(delay)/2}ms` }}
        className={`${style} card-animation invisible relative w-10 h-14 border-[1.5px] border-[#3A3A3A] bg-gray1 rounded-md overflow-hidden`}
      >
        <div className="absolute top-[2px] left-[2px] flex flex-col items-center h-[50%] w-[30%]">
          <p className={`${color} text-[0.5rem] leading-[0.5rem] my-[2px]`}>
            {value}
          </p>

          <div className="scale-75 fill-current mt-1">
            <SuitIcon />
          </div>
        </div>
      </div>
    );
  } else {
    body = (
      <div
        className={`${style} ${
          type === CardIconTypeEnum.room
            ? "border-[#3A3A3A] bg-white cardSizeRoom"
            : "border-[#3A3A3A] bg-gray1 w-10 h-16 xl:w-16 xl:h-24"
        } relative border-[1.5px] rounded-md overflow-hidden `}
      >
        <div className="ml-1 mt-1 flex flex-col items-center w-[30%]">
          <p
            className={`${color} font-semibold text-base leading-[0.5rem] p-1 xl:px-0`}
          >
            {value}
          </p>

          <div className="scale-75 fill-current">
            <SuitIcon />
          </div>
        </div>
      </div>
    );
  }

  return body;
};
