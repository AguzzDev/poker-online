import { UserInterface } from 'src/models';

export function userResponse(
  user: Partial<UserInterface>,
): Partial<UserInterface> {
  return {
    _id: user._id,
    username: user.username,
    image: user.image,
    chips: user.chips,
    createdAt: user.createdAt,
    missions: user.missions,
    matches: user.matches,
    role: user.role,
  };
}

export function userResponseWithAccessToken(
  user: Partial<UserInterface>,
): Partial<UserInterface> {
  return {
    _id: user._id,
    username: user.username,
    image: user.image,
    chips: user.chips,
    createdAt: user.createdAt,
    missions: user.missions,
    matches: user.matches,
    role: user.role,
    accessToken: user.accessToken,
  };
}
