import { UserInterface } from "models";

export const userValues = (user: UserInterface): UserInterface => {
  return {
    _id: user._id,
    username: user.username,
    image: user.image,
    chips: user.chips,
    role: user.role,
    matches: {
      highCard: user.matches.highCard,
      onePair: user.matches.onePair,
      twoPair: user.matches.twoPair,
      threeOfKind: user.matches.threeOfKind,
      straight: user.matches.straight,
      flush: user.matches.flush,
      fullHouse: user.matches.fullHouse,
      poker: user.matches.poker,
      straightFlush: user.matches.straightFlush,
      royalFlush: user.matches.royalFlush,
    },
    createdAt: user.createdAt,
    accessToken: user.accessToken,
  };
};
