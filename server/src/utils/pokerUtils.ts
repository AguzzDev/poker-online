import { CardInterface, PlayerInterface } from 'src/models';

interface Card {
  value: number;
}

interface HandResult {
  heirarchy: string;
  heirarchyValue: string | number;
  message: string;
  cards?: string | number | number[];
  cardHigh?: number;
  cardDecider?: number;
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

const checkDraw = (array, totalBid) => {
  const orderByCardDecider = array.sort((a, b) =>
    a.cardDecider < b.cardDecider ? 1 : -1,
  );

  const cardDeciderIsUnique = orderByCardDecider.filter(
    ({ cardDecider }) => cardDecider === orderByCardDecider[0].cardDecider,
  );

  if (cardDeciderIsUnique.length > 1) {
    return {
      usersId: orderByCardDecider.map(({ _id }) => _id),
      message: `${orderByCardDecider.map(({ name }) => name).join(', ')} split ${totalBid} chips tied with ${orderByCardDecider[0].heirarchy}`,
    };
  }

  return {
    usersId: orderByCardDecider[0]._id,
    heirarchy: orderByCardDecider[0].heirarchy,
    message: `${orderByCardDecider[0].name} won ${totalBid} chips with ${orderByCardDecider[0].heirarchy}`,
  };
};

export const getWinner = (playerHands, totalBid) => {
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
      message: `${player.name} won ${totalBid} chips with ${player.heirarchy}`,
    };
  } else {
    order = orderPlayersArray(playersFilter, 'string');

    if (order.every(({ cardHigh }) => cardHigh === order[0].cardHigh)) {
      return checkDraw(order, totalBid);
    }

    return {
      usersId: order[0]._id,
      heirarchy: order[0].heirarchy,
      message: `${order[0].name} won ${totalBid} chips with ${order[0].heirarchy}`,
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

export const evaluateHand = ({ cards, player }) => {
  const allCards = [...cards, ...player.cards];
  const flush = isFlushHand(allCards, player.cards);
  if (flush) {
    return flush;
  }
  const straight = isStraightHand(allCards, player.cards);
  if (straight) {
    return straight;
  }
  const parTwoParOrThree = isParTwoParOrThree(allCards, player.cards);
  if (parTwoParOrThree) {
    return parTwoParOrThree;
  }
};

const isStraightHand = (cards, cardsPlayer): HandResult => {
  cards.sort((a, b) => a.value - b.value);

  const cardDecider =
    cardsPlayer.filter(
      (cardPlayer) => !cards.some((card) => card.value == cardPlayer.value),
    )[0] || 0;

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
        cardDecider,
      };
    }
  }

  return null;
};

const isFlushHand = (cards, cardsPlayer) => {
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
    .filter(({ suit }) => suit >= matchingSuit[0])
    .sort((a, b) => a.id - b.id);
  const isPossibleRoyalFlush = cardsFilterSuit[0].id >= 32;

  if (isPossibleRoyalFlush) {
    const isRoyalFlush = isStraightHand(cardsFilterSuit, cardsPlayer);
    return {
      ...isRoyalFlush,
      heirarchyValue: heirarchyValues['Royal Flush'],
      heirarchy: 'Royal Flush',
    };
  }

  const isStraight = isStraightHand(cards, cardsPlayer);
  if (isStraight) {
    return {
      ...isStraight,
      heirarchyValue: heirarchyValues['Straight Flush'],
      heirarchy: 'Straight Flush',
    };
  }

  return {
    heirarchy: 'Flush',
    heirarchyValue: heirarchyValues['Flush'],
    message: `Flush of ${matchingSuit[0]}`,
  };
};

const isParTwoParOrThree = (cards: Card[], cardsPlayer: Card[]): HandResult => {
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

  if (matches.length === 0) {
    const highCard = cardsPlayer.sort((a, b) => b.value - a.value);

    return {
      heirarchy: 'High Card',
      heirarchyValue: heirarchyValues['High Card'],
      message: 'High Card',
      cardHigh: highCard[0].value,
    };
  } else if (matches.length === 1) {
    const [value, count] = matches[0];
    const cardDecider = cardsPlayer.filter((card) => card.value != value)[0]
      ?.value;
    switch (count) {
      case 2:
        return {
          heirarchy: 'One Pair',
          message: `One Pair de ${cardNumberToText[value]}`,
          heirarchyValue: heirarchyValues['One Pair'],
          cardHigh: value,
          cardDecider,
        };
      case 3:
        return {
          heirarchy: 'Three of a Kind',
          message: `Three of a Kind de ${cardNumberToText[value]}`,
          heirarchyValue: heirarchyValues['Three of a Kind'],
          cardHigh: value,
          cardDecider,
        };
      case 4:
        return {
          heirarchy: 'Poker',
          message: `Poker de ${cardNumberToText[value]}`,
          heirarchyValue: heirarchyValues['Poker'],
          cardHigh: value,
          cardDecider,
        };
    }
  } else {
    const [value1, count1] = matches[0];
    const [value2, count2] = matches[1];

    const cardDecider = cardsPlayer.filter(
      (card) => card.value != value1 && card.value != value2,
    )[0]?.value;

    if (count1 === 3 && count2 === 2) {
      return {
        heirarchy: 'Full House',
        message: 'Full House',
        heirarchyValue: heirarchyValues['Full House'],
        cards: [value1, value2],
        cardDecider,
      };
    } else {
      return {
        heirarchy: 'Two Pair',
        message: 'Two Pair',
        heirarchyValue: heirarchyValues['Two Pair'],
        cards: [value1, value2],
        cardDecider,
      };
    }
  }
};
