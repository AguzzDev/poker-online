import { CardIconTypeEnum, CardSuitEnum } from "models";
import { CardIcon } from "public/icons/CardIcon";

export const getCard = (i: number | string) => {
  const dictionary: Record<string | number, JSX.Element> = {
    0: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="2"
      />
    ),
    1: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="2"
      />
    ),
    2: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="2"
      />
    ),
    3: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="2"
      />
    ),
    4: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="3"
      />
    ),
    5: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="3"
      />
    ),
    6: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="3"
      />
    ),
    7: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="3"
      />
    ),
    8: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="4"
      />
    ),
    9: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="4"
      />
    ),
    10: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="4"
      />
    ),
    11: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="4"
      />
    ),
    12: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="5"
      />
    ),
    13: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="5"
      />
    ),
    14: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="5"
      />
    ),
    15: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="5"
      />
    ),
    16: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="6"
      />
    ),
    17: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="6"
      />
    ),
    18: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="6"
      />
    ),
    19: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="6"
      />
    ),
    20: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="7"
      />
    ),
    21: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="7"
      />
    ),
    22: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="7"
      />
    ),
    23: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="7"
      />
    ),
    24: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="8"
      />
    ),
    25: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="8"
      />
    ),
    26: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="8"
      />
    ),
    27: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="8"
      />
    ),
    28: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="9"
      />
    ),
    29: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="9"
      />
    ),
    30: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="9"
      />
    ),
    31: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="9"
      />
    ),
    32: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="10"
      />
    ),
    33: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="10"
      />
    ),
    34: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="10"
      />
    ),
    35: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="10"
      />
    ),
    36: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="J"
      />
    ),
    37: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="J"
      />
    ),
    38: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="J"
      />
    ),
    39: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="J"
      />
    ),
    40: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="Q"
      />
    ),
    41: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="Q"
      />
    ),
    42: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="Q"
      />
    ),
    43: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="Q"
      />
    ),
    44: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="K"
      />
    ),
    45: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="K"
      />
    ),
    46: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="K"
      />
    ),
    47: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="K"
      />
    ),
    48: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.spades}
        value="A"
      />
    ),
    49: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.hearts}
        value="A"
      />
    ),
    50: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.diamonds}
        value="A"
      />
    ),
    51: (
      <CardIcon
        type={CardIconTypeEnum.room}
        suit={CardSuitEnum.clubs}
        value="A"
      />
    ),
    back: <CardIcon type={CardIconTypeEnum.back} />,
  };

  return dictionary[i];
};
