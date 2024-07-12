import { CircularProgressBar } from "components/Bar/CircularProgressBar";
import { IconSm } from "components/Icon";
import { useGame } from "context/Game/GameProvider";
import { Status } from "models";
import Image from "next/image";
import {
  MdPersonAdd,
  MdPersonAddAlt,
  MdPersonAddAlt1,
  MdPersonOutline,
} from "react-icons/md";

import { formatPrice } from "utils/formatPrice";

const MePlayerView = ({ player }) => (
  <div>
    {player.action == "fold" ? (
      <div>fold</div>
    ) : (
      <>
        <div className="w-32">
          {/* <TimerBar player={player.userId} direction={direction} /> */}

          <div className="flex space-x-5">
            {player.cards.map(({ id }) => (
              <Image
                key={id}
                src={`/cards/${id}.svg`}
                height={150}
                width={110}
                alt="Carta"
              />
            ))}
          </div>
        </div>

        <div className="flex w-52 bg-black1 border-borderWidth border-borderColor1 rounded-full">
          <div className="px-6 py-3">
            <h3>{player.name}</h3>
            <p className="text-stone-400">
              {player.chips > 0 ? formatPrice(player.chips) : "All In"}
            </p>
          </div>
        </div>
      </>
    )}
  </div>
);

const PlayerView = ({ player, x, y }) => {
  const { timer, turn } = useGame();

  const { bid, showAction, action, cards, userId, chips, name, blind } = player;

  return (
    <div className="relative w-48 md:w-52 h-[4.5rem] md:h-20">
      {action == "fold" ? (
        <div>esta fold</div>
      ) : (
        <>
          <div
            className={`z-30 absolute -top-6 ${
              x === "left" ? "left-2" : "right-2"
            }`}
          >
            {cards.map(({ id }) => (
              <Image
                key={id}
                src={`/cards/cardBackside.png`}
                height={60}
                width={50}
                alt="Carta"
              />
            ))}
          </div>

          {bid > 0 ? (
            <div
              className={`absolute ${y === "bottom" ? "-top-8" : "-bottom-8"} ${
                x === "right" ? "-left-3" : "-right-3"
              }`}
            >
              <Image src="/chips/red.svg" width={22} height={16} />
              <p className="text-xs">{bid}</p>
            </div>
          ) : null}

          <div
            className={`${
              x === "left" && "flex-row-reverse"
            } flex bg-black1 border-borderWidth border-borderColor1 rounded-full w-full h-full absolute z-40`}
          >
            <div className="w-4/6 px-6 py-2 md:py-3">
              <h3>{name}</h3>
              <p className="text-xs">{showAction}</p>
              <p className="text-xs text-stone-400">{formatPrice(chips)}</p>
            </div>

            <div className="relative w-20">
              <div className="absolute z-50 -top-[7%] -right-[6.8%] md:-right-[11%]">
                {turn == userId ? (
                  <CircularProgressBar percentage={timer} />
                ) : null}
              </div>

              <img
                src="https://www.fcbarcelona.com/photo-resources/2022/08/02/ae5252d1-b79b-4950-9e34-6e67fac09bb0/LeoMessi20092010_pic_fcb-arsenal62.jpg?width=1200&height=750"
                className="w-full h-full rounded-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const PlayerInTable = ({ sit, position, x, y }) => {
  const { room, takeSit, player } = useGame();

  const isSitTaken = room.desk.players.filter((v) => v!.sit === sit)[0];

  return (
    <div className={`absolute ${position} `}>
      <div className="relative flex flex-col items-center">
        {isSitTaken && !player ? (
          <PlayerView player={isSitTaken} x={x} y={y} />
        ) : !isSitTaken && !player ? (
          <button onClick={() => takeSit(sit)}>
            <div className="flex justify-center">
              <IconSm Icon={MdPersonAddAlt1} />
            </div>
            <p>Sit here</p>
          </button>
        ) : isSitTaken?.userId === player.userId ? (
          // <MePlayerView player={isSitTaken} />
          <PlayerView player={isSitTaken} x={x} y={y} />
        ) : isSitTaken ? (
          <PlayerView player={isSitTaken} x={x} y={y} />
        ) : null}
      </div>
    </div>
  );
};
