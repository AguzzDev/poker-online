import { CardInterface, PlayerInterface } from 'src/models';

interface HandResult {
  heirarchy: string;
  heirarchyValue: string | number;
  message: string;
  cards?: CardInterface[];
  cardHigh?: number;
  cardDecider?: CardInterface | number;
}

const cardsValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const cardsSuit = ['spades', 'hearts', 'diamonds', 'clubs'];
const cardNumberToText = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A',
};

const heirarchyValues = {
  'High Card': 1,
  'One Pair': 2,
  'Two Pair': 3,
  'Three of a Kind': 4,
  Straight: 5,
  Flush: 6,
  'Full House': 7,
  Poker: 8,
  'Straight Flush': 9,
  'Royal Flush': 10,
};

const checkDraw = (array) => {
  const orderByCardDecider = array.sort((a, b) =>
    a.cardDecider.value < b.cardDecider.value ? 1 : -1,
  );
  const cardDeciderIsUnique = orderByCardDecider.filter(
    ({ cardDecider }) =>
      cardDecider.value === orderByCardDecider[0].cardDecider.value,
  );

  if (cardDeciderIsUnique.length > 1) {
    return {
      usersId: orderByCardDecider.map(({ _id }) => _id),
      names: orderByCardDecider.map(({ name }) => name).join(', '),
      heirarchy: orderByCardDecider[0].heirarchy,
      cards: orderByCardDecider[0].cards,
    };
  }

  return {
    usersId: orderByCardDecider[0]._id,
    heirarchy: orderByCardDecider[0].heirarchy,
    cards: orderByCardDecider[0].cards,
  };
};

export const getWinner = (
  playerHands,
): {
  usersId: string | string[];
  names?: string[];
  heirarchy: string;
  cards: CardInterface[];
} => {
  const orderPlayersArray = (array, type) => {
    return type === 'array'
      ? array
          .map((player) => ({
            ...player,
            cards: player.cards.reduce((acc, i) => i + acc, 0),
          }))
          .sort((a, b) => (a.cards < b.cards ? 1 : -1))
      : array.sort((a, b) => (a.cardHigh < b.cardHigh ? 1 : -1));
  };
  let order;

  const heirarchyMaxValue = playerHands.sort((a, b) =>
    a.heirarchyValue < b.heirarchyValue ? 1 : -1,
  )[0].heirarchyValue;

  const playersFilter = playerHands.filter(
    (player) => player.heirarchyValue === heirarchyMaxValue,
  );

  if (playersFilter.length === 1) {
    const player = playersFilter[0];

    return {
      usersId: player._id,
      heirarchy: player.heirarchy,
      cards: player.cards,
    };
  } else {
    order = orderPlayersArray(playersFilter, 'string');

    if (order.every(({ cardHigh }) => cardHigh === order[0].cardHigh)) {
      return checkDraw(order);
    }

    return {
      usersId: order[0]._id,
      heirarchy: order[0].heirarchy,
      cards: order[0].cards,
    };
  }
};

export const getAllCards = (): CardInterface[] => {
  let i = -1;

  return cardsValues.flatMap((value) =>
    cardsSuit.map((suit) => {
      i++;
      return { id: i, suit, value };
    }),
  );
};

export const evaluateHand = ({ cards, playerCards }) => {
  const allCards = [...cards, ...playerCards];
  const playerCardsSort = playerCards.sort((a, b) =>
    a.value < b.value ? 1 : -1,
  ) as CardInterface[];

  const flush = isFlushHand(allCards, playerCardsSort);
  if (flush) {
    return flush;
  }
  const straight = isStraightHand(allCards, playerCardsSort);
  if (straight) {
    return straight;
  }
  const parTwoParOrThree = isParTwoParOrThree(allCards, playerCardsSort);
  if (parTwoParOrThree) {
    return parTwoParOrThree;
  }
};

const isStraightHand = (cards, cardsPlayer): HandResult => {
  cards.sort((a, b) => a.value - b.value);

  for (let i = 0; i <= cards.length - 5; i++) {
    if (
      cards[i].value + 1 === cards[i + 1].value &&
      cards[i + 1].value + 1 === cards[i + 2].value &&
      cards[i + 2].value + 1 === cards[i + 3].value &&
      cards[i + 3].value + 1 === cards[i + 4].value
    ) {
      return {
        heirarchy: 'Straight',
        heirarchyValue: heirarchyValues['Straight'],
        message: `Straight of ${cardNumberToText[cards[i].value]}-${cardNumberToText[cards[i + 4].value]}`,
        cards: cards.slice(i, i + 5),
        cardDecider: cardsPlayer[0],
      };
    }
  }

  return null;
};

const isFlushHand = (
  cards: CardInterface[],
  cardsPlayer: CardInterface[],
): HandResult => {
  const suits = {
    spades: 0,
    hearts: 0,
    diamonds: 0,
    clubs: 0,
  };

  cards.forEach(({ suit }) => {
    suits[suit]++;
  });
  const matchingSuit = Object.entries(suits).find(([, count]) => count === 5);
  if (!matchingSuit) return null;

  const cardsFilterSuit = cards
    .filter(({ suit }) => suit === matchingSuit[0])
    .sort((a, b) => a.id - b.id);
  const isPossibleRoyalFlush = cardsFilterSuit[0].id >= 32;

  if (isPossibleRoyalFlush) {
    const isRoyalFlush = isStraightHand(cardsFilterSuit, cardsPlayer);
    return {
      ...isRoyalFlush,
      heirarchyValue: heirarchyValues['Royal Flush'],
      heirarchy: 'Royal Flush',
      cards: isRoyalFlush.cards,
      cardDecider: cardsPlayer[0],
    };
  }

  const isStraight = isStraightHand(cards, cardsPlayer);
  if (isStraight) {
    return {
      ...isStraight,
      heirarchyValue: heirarchyValues['Straight Flush'],
      heirarchy: 'Straight Flush',
      cards: isStraight.cards,
      cardDecider: cardsPlayer[0],
    };
  }

  return {
    heirarchy: 'Flush',
    heirarchyValue: heirarchyValues['Flush'],
    message: `Flush of ${matchingSuit[0]}`,
    cards: cardsFilterSuit,
    cardDecider: cardsPlayer[0],
  };
};

const isParTwoParOrThree = (
  cards: CardInterface[],
  cardsPlayer: CardInterface[],
): HandResult => {
  const values: number[] = cards.map((card) => card.value);

  const counts: { [value: number]: number } = values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  const matches = Object.entries(counts)
    .map(([value, count]) => [parseInt(value), count])
    .sort((a, b) => {
      if (a[1] !== b[1]) {
        return b[1] - a[1];
      } else {
        return b[0] - a[0];
      }
    })
    .filter(([_, count]) => count >= 2);

  let winningCards: CardInterface[] = [];
  const arrCombined = [...cards, ...cardsPlayer];

  if (matches.length === 0) {
    const highCard = cardsPlayer.sort((a, b) => b.value - a.value);

    return {
      heirarchy: 'High Card',
      heirarchyValue: heirarchyValues['High Card'],
      message: `High Card of ${cardNumberToText[highCard[0].value]}`,
      cardHigh: highCard[0].value,
      cards: [highCard[0]],
      cardDecider: highCard[1],
    };
  } else if (matches.length === 1) {
    const [value, count] = matches[0];
    const cardDecider = cardsPlayer.filter((card) => card.value != value)[0];

    winningCards.push(...arrCombined.filter((card) => card.value === value));

    switch (count) {
      case 2:
        return {
          heirarchy: 'One Pair',
          message: `One Pair of ${cardNumberToText[value]}`,
          heirarchyValue: heirarchyValues['One Pair'],
          cardHigh: value,
          cardDecider,
          cards: Array.from(new Set(winningCards)),
        };
      case 3:
        return {
          heirarchy: 'Three of a Kind',
          message: `Three of a Kind of ${cardNumberToText[value]}`,
          heirarchyValue: heirarchyValues['Three of a Kind'],
          cardHigh: value,
          cardDecider,
          cards: Array.from(new Set(winningCards)),
        };
      case 4:
        return {
          heirarchy: 'Poker',
          message: `Poker of ${cardNumberToText[value]}`,
          heirarchyValue: heirarchyValues['Poker'],
          cardHigh: value,
          cardDecider,
          cards: Array.from(new Set(winningCards)),
        };
    }
  } else {
    const [value1, count1] = matches[0];
    const [value2, count2] = matches[1];

    const cardDecider =
      cardsPlayer.filter(
        (card) => card.value != value1 && card.value != value2,
      )[0] || cardsPlayer[0];

    winningCards.push(
      ...arrCombined.filter(
        (card) => card.value === value1 || card.value === value2,
      ),
    );

    if (count1 === 3 && count2 === 2) {
      return {
        heirarchy: 'Full House',
        message: 'Full House',
        heirarchyValue: heirarchyValues['Full House'],
        cards: Array.from(new Set(winningCards)),
        cardDecider,
      };
    } else {
      return {
        heirarchy: 'Two Pair',
        message: `Two Pair ${cardNumberToText[value1]} and ${cardNumberToText[value2]}`,
        heirarchyValue: heirarchyValues['Two Pair'],
        cards: Array.from(new Set(winningCards)),
        cardDecider,
      };
    }
  }
};
