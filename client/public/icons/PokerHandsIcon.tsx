import { CardSuitEnum, PokerHandsEnum } from "models";
import { CardIcon } from "../../public/icons/CardIcon";

export const PokerHandsIcon = ({ type }: { type: PokerHandsEnum }) => {
  let body = <></>;
  const opacity = "opacity-30";

  if (type === PokerHandsEnum.highCard) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon style={opacity} suit={CardSuitEnum.hearts} value="2" />
        <CardIcon style={opacity} suit={CardSuitEnum.hearts} value="6" />
        <CardIcon style={opacity} suit={CardSuitEnum.diamonds} value="8" />
        <CardIcon style={opacity} suit={CardSuitEnum.diamonds} value="J" />
      </div>
    );
  }
  if (type === PokerHandsEnum.onePair) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon suit={CardSuitEnum.hearts} value="A" />
        <CardIcon style={opacity} suit={CardSuitEnum.hearts} value="6" />
        <CardIcon style={opacity} suit={CardSuitEnum.diamonds} value="8" />
        <CardIcon style={opacity} suit={CardSuitEnum.diamonds} value="J" />
      </div>
    );
  }
  if (type === PokerHandsEnum.twoPair) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon suit={CardSuitEnum.hearts} value="A" />
        <CardIcon suit={CardSuitEnum.hearts} value="Q" />
        <CardIcon suit={CardSuitEnum.clubs} value="Q" />
        <CardIcon style={opacity} suit={CardSuitEnum.diamonds} value="J" />
      </div>
    );
  }
  if (type === PokerHandsEnum.threeOfKind) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon suit={CardSuitEnum.hearts} value="A" />
        <CardIcon suit={CardSuitEnum.diamonds} value="A" />
        <CardIcon style={opacity} suit={CardSuitEnum.clubs} value="Q" />
        <CardIcon style={opacity} suit={CardSuitEnum.diamonds} value="J" />
      </div>
    );
  }
  if (type === PokerHandsEnum.straight) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon suit={CardSuitEnum.hearts} value="2" />
        <CardIcon suit={CardSuitEnum.diamonds} value="3" />
        <CardIcon suit={CardSuitEnum.hearts} value="4" />
        <CardIcon suit={CardSuitEnum.diamonds} value="5" />
      </div>
    );
  }
  if (type === PokerHandsEnum.flush) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon suit={CardSuitEnum.clubs} value="3" />
        <CardIcon suit={CardSuitEnum.clubs} value="Q" />
        <CardIcon suit={CardSuitEnum.clubs} value="6" />
        <CardIcon suit={CardSuitEnum.clubs} value="J" />
      </div>
    );
  }
  if (type === PokerHandsEnum.fullHouse) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.diamonds} value="A" />
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon suit={CardSuitEnum.spades} value="A" />
        <CardIcon suit={CardSuitEnum.diamonds} value="J" />
        <CardIcon suit={CardSuitEnum.clubs} value="J" />
      </div>
    );
  }
  if (type === PokerHandsEnum.poker) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.diamonds} value="A" />
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon suit={CardSuitEnum.spades} value="A" />
        <CardIcon suit={CardSuitEnum.spades} value="A" />
        <CardIcon style={opacity} suit={CardSuitEnum.clubs} value="J" />
      </div>
    );
  }
  if (type === PokerHandsEnum.straightFlush) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon suit={CardSuitEnum.clubs} value="2" />
        <CardIcon suit={CardSuitEnum.clubs} value="3" />
        <CardIcon suit={CardSuitEnum.clubs} value="4" />
        <CardIcon suit={CardSuitEnum.clubs} value="5" />
      </div>
    );
  }
  if (type === PokerHandsEnum.royalFlush) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.diamonds} value="10" />
        <CardIcon suit={CardSuitEnum.diamonds} value="J" />
        <CardIcon suit={CardSuitEnum.diamonds} value="Q" />
        <CardIcon suit={CardSuitEnum.diamonds} value="K" />
        <CardIcon suit={CardSuitEnum.diamonds} value="A" />
      </div>
    );
  }
  return body;
};
