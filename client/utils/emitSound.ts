import { SoundsEnum } from "models";

export const emitSound = (type: SoundsEnum) => {
  const sounds: { [key: string]: string } = {
    shuffle: "/sounds/shuffle.mp3",
    deal: "/sounds/deal.mp3",
    check: "/sounds/check.mp3",
    bid: "/sounds/bid.mp3",
    allIn: "/sounds/allIn.mp3",
  };

  const sound = new Audio(sounds[type]);
  sound.play();
};
