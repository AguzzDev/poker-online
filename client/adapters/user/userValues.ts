import { UserInterface } from "models";

export const userValues = (user: UserInterface): UserInterface => {
  return {
    _id: user._id,
    username: user.username,
    image: user.image,
    chips: user.chips,
    matches: {
      wins: user.matches.wins,
      loses: user.matches.loses,
      par: user.matches.par,
      trio: user.matches.trio,
      full: user.matches.full,
      poker: user.matches.poker,
      flush: user.matches.flush,
      straight: user.matches.straight,
      straightFlush: user.matches.straightFlush,
      straightFlushReal: user.matches.straightFlushReal,
    },
    createdAt: user.createdAt,
    accessToken: user.accessToken,
  };
};
