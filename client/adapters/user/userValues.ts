import { UserInterface } from "models";

export const userValues = (user: UserInterface): UserInterface => {
  return {
    _id: user._id,
    username: user.username,
    image: user.image,
    provider: user.provider,
    chips: user.chips,
    role: user.role,
    matches: user.matches,
    missions: user.missions,
    createdAt: user.createdAt,
    accessToken: user.accessToken,
  };
};
