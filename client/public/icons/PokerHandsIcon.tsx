import { CardSuitEnum, PokerHandsEnum } from "models";
import { CardIcon } from "../../public/icons/CardIcon";

export const PokerHandsIcon = ({ type }: { type: PokerHandsEnum }) => {
  let body = <></>;

  if (type === PokerHandsEnum.highCard) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon opacity={true} suit={CardSuitEnum.hearts} value="2" />
        <CardIcon opacity={true} suit={CardSuitEnum.hearts} value="6" />
        <CardIcon opacity={true} suit={CardSuitEnum.diamonds} value="8" />
        <CardIcon opacity={true} suit={CardSuitEnum.diamonds} value="J" />
      </div>
    );
  }
  if (type === PokerHandsEnum.onePair) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon suit={CardSuitEnum.hearts} value="A" />
        <CardIcon opacity={true} suit={CardSuitEnum.hearts} value="6" />
        <CardIcon opacity={true} suit={CardSuitEnum.diamonds} value="8" />
        <CardIcon opacity={true} suit={CardSuitEnum.diamonds} value="J" />
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
        <CardIcon opacity={true} suit={CardSuitEnum.diamonds} value="J" />
      </div>
    );
  }
  if (type === PokerHandsEnum.threeOfKind) {
    body = (
      <div className="flex space-x-2">
        <CardIcon suit={CardSuitEnum.clubs} value="A" />
        <CardIcon suit={CardSuitEnum.hearts} value="A" />
        <CardIcon suit={CardSuitEnum.diamonds} value="A" />
        <CardIcon opacity={true} suit={CardSuitEnum.clubs} value="Q" />
        <CardIcon opacity={true} suit={CardSuitEnum.diamonds} value="J" />
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
        <CardIcon opacity={true} suit={CardSuitEnum.clubs} value="J" />
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
