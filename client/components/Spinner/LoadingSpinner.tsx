import { CardIconTypeEnum, CardSuitEnum } from "models";
import { CardIcon } from "public/icons/CardIcon";
import DiamondLogoIcon from "public/icons/DiamondLogoIcon";

export const LoadingSpinner = () => {
  return (
    <div className="relative w-14 h-14 scale-90">
      <CardIcon
        type={CardIconTypeEnum.loading}
        delay="300"
        suit={CardSuitEnum.clubs}
        value="A"
        style="border-border absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70]"
      />
      <CardIcon
        type={CardIconTypeEnum.loading}
        delay="700"
        suit={CardSuitEnum.clubs}
        value="7"
        style="border-border absolute -top-11 left-12 transform -translate-x-1/2 -translate-y-1/2 rotate-[45deg] z-[60]"
      />
      <div className="absolute inset-0 transform rotate-90">
        <CardIcon
          type={CardIconTypeEnum.loading}
          delay="1100"
          suit={CardSuitEnum.clubs}
          value="8"
          style="border-border absolute -top-7 left-2 z-50"
        />
        <CardIcon
          type={CardIconTypeEnum.loading}
          delay="1500"
          suit={CardSuitEnum.clubs}
          value="9"
          style="border-border absolute -top-[4.5rem] left-7 rotate-[45deg] z-40"
        />
      </div>

      <div className="absolute inset-0 transform rotate-180">
        <CardIcon
          type={CardIconTypeEnum.loading}
          delay="1900"
          suit={CardSuitEnum.clubs}
          value="10"
          style="border-border absolute -top-7 left-2 z-30"
        />
        <CardIcon
          type={CardIconTypeEnum.loading}
          delay="2300"
          suit={CardSuitEnum.clubs}
          value="J"
          style="border-border absolute -top-[4.5rem] left-7 rotate-[45deg] z-20"
        />
        <div className="absolute inset-0 transform rotate-90">
          <CardIcon
            type={CardIconTypeEnum.loading}
            delay="2700"
            suit={CardSuitEnum.clubs}
            value="Q"
            style="border-border absolute -top-7 left-2 z-10"
          />
          <CardIcon
            type={CardIconTypeEnum.loading}
            delay="3100"
            suit={CardSuitEnum.clubs}
            value="K"
            style="border-border absolute -top-[4.5rem] left-7 rotate-[45deg] z-0"
          />
        </div>
      </div>

      <div className="circle-animation flex justify-center items-center z-[80] absolute inset-0 w-full h-full rounded-full bg-secondary border-borderWidth border-accent">
        <DiamondLogoIcon />
      </div>
    </div>
  );
};
