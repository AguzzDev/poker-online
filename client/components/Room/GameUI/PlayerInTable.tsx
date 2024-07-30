import { UserPlusIcon } from "@heroicons/react/20/solid";
import { CircularProgressBar } from "components/Bar/CircularProgressBar";
import { IconSm, IconXs } from "components/Icon";
import { useGame } from "context/Game/GameProvider";
import Image from "next/image";
import { MdPersonAddAlt1 } from "react-icons/md";

import { formatChips } from "utils/formatChips";

const PlayerView = ({ player, showCards = false, x, y }) => {
  const { timer, turn } = useGame();

  const { bid, showAction, action, cards, userId, chips, name, blind } = player;

  return (
    <div className="relative w-36 sm:w-44 h-16">
      <div
        className={`absolute z-50 -top-1 ${
          x === "left" ? "-left-[3.5%]" : "-right-[3.5%]"
        }`}
      >
        {turn == userId ? <CircularProgressBar percentage={timer} /> : null}
      </div>

      <>
        <div
          className={`z-30 absolute -top-6 ${
            x === "left" ? "left-1" : "right-1"
          }`}
        >
          {cards.map(({ id }) => (
            <Image
              key={id}
              src={`${
                showCards ? `/cards/${id}.svg` : "/cards/cardBackside.png"
              }`}
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
          <div className="flex-1 flex-col pl-4 py-1">
            <h2 className="text-sm">{name}</h2>
            <p className="text-xs">{showAction}</p>
            <p className="text-xs text-stone-400">{formatChips(chips)}</p>
          </div>

          <div className="relative w-[4rem] rounded-full overflow-hidden">
            <Image
              src="data:image/jpeg;base64,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"
              layout="fill"
            />
          </div>
        </div>
      </>
    </div>
  );
};

export const PlayerInTable = ({ sit, position, x, y }) => {
  const { room, takeSit, player } = useGame();

  const isSitTaken = room.desk.players.filter((v) => v!.sit === sit)[0];

  return (
    <div className={`absolute ${position}`}>
      {isSitTaken && !player ? (
        <PlayerView player={isSitTaken} x={x} y={y} />
      ) : !isSitTaken && !player ? (
        <button onClick={() => takeSit(sit)}>
          <div className="flex justify-center">
            <IconSm Icon={UserPlusIcon} />
          </div>

          <p>Sit here</p>
        </button>
      ) : isSitTaken?.userId === player.userId ? (
        <PlayerView player={isSitTaken} showCards={true} x={x} y={y} />
      ) : isSitTaken ? (
        <PlayerView player={isSitTaken} x={x} y={y} />
      ) : null}
    </div>
  );
};
