import { UserPlusIcon } from "@heroicons/react/20/solid";
import { CircularProgressBar } from "components/Bar/CircularProgressBar";
import { IconMd } from "components/Icon";
import { useGame } from "context/Game/GameProvider";
import { PlayerInTableProps, PlayerInterface } from "models";
import Image from "next/image";
import { formatChips } from "utils/formatChips";
import { UserImage } from "utils/userImage";

const PlayerView = ({
  player,
  showCards = false,
  directions,
}: {
  player: PlayerInterface;
  showCards?: boolean;
  directions: { x: string; y: string };
}) => {
  const { timer, turn } = useGame();
  const { bid, showAction, cards, userId, chips, username, blind, winningPot } =
    player;
  const { x, y } = directions;

  const showChips = winningPot > 0 ? winningPot : bid;
  return (
    <div className="relative w-40 h-[4.6rem] md:w-56 md:h-24 1920:w-72 1920:h-28">
      <>
        <div
          className={`flex space-x-2 lg:space-x-0 z-30 absolute -top-8 md:-top-10 ${
            x === "left" ? "left-1" : "right-1"
          }`}
        >
          {cards.map(({ id }) => (
            <div key={id} className="relative cardSize">
              <Image
                src={`${
                  showCards ? `/cards/${id}.svg` : "/cards/cardBackside.png"
                }`}
                layout="fill"
                alt="Card image"
              />
            </div>
          ))}
        </div>

        {blind ? (
          <div className="absolute -top-10 left-0 p-2 rounded-full bg-red-300">
            <p className="text-xs">Blind</p>
          </div>
        ) : null}
        {bid > 0 || winningPot > 0 ? (
          <div
            className={`absolute ${
              y === "bottom"
                ? "-top-12 md:top-6 lg:-top-3"
                : "-bottom-12 md:top-0 lg:-bottom-3"
            } ${
              x === "right"
                ? "left-6 md:-left-8 lg:-left-14"
                : "right-6 md:-right-8 lg:-right-14"
            } w-6 h-6 lg:w-8 lg:h-8`}
          >
            <div className="relative w-full h-full">
              <Image src="/chips/red.svg" alt="Chips image" layout="fill" />
            </div>

            <h6 className="text-xs md:text-lg">{showChips}</h6>
          </div>
        ) : null}

        <div
          className={`${
            x === "left" && "flex-row-reverse"
          } flex justify-between bg-black1 border-borderWidth border-borderColor1 rounded-full w-full h-full absolute z-40`}
        >
          <div
            className={`${
              x === "left" ? "mr-1 lg:mr-3" : "ml-1 lg:ml-3"
            } w-[60%] flex-col px-4 py-1 overflow-clip`}
          >
            <p
              className={`${
                username.length > 10 ? "text-lg" : "text-xl"
              } truncate w-32`}
            >
              {username}
            </p>
            <h6 className="text-sm sm:text-xl text-stone-400">
              {formatChips(chips)}
            </h6>
            <h6 className="text-sm sm:text-xl text-stone-400">{showAction}</h6>
          </div>

          <div className="relative flex-1">
            <div
              className={`absolute z-50 top-0 w-full h-full scale-160 lg:scale-150 1920:scale-125 ${
                x === "left" ? "-left-[0.05%]" : "-right-[0.05%]"
              }`}
            >
              <CircularProgressBar percentage={turn == userId ? timer : 0} />
            </div>

            <UserImage image={player.image} />
          </div>
        </div>
      </>
    </div>
  );
};

export const PlayerInTable = ({
  sit,
  position,
  directions,
}: PlayerInTableProps) => {
  const { room, takeSit, player } = useGame();

  const isSitTaken = room!.desk.players.filter((v) => v!.sit === sit)[0];

  return (
    <div className={`absolute ${position}`}>
      {isSitTaken && !player ? (
        <PlayerView player={isSitTaken} directions={directions} />
      ) : !isSitTaken && !player ? (
        <button onClick={() => takeSit(sit)}>
          <div className="flex justify-center">
            <IconMd Icon={UserPlusIcon} />
          </div>

          <h5>Sit here</h5>
        </button>
      ) : isSitTaken?.userId === player!.userId ? (
        <PlayerView
          player={isSitTaken}
          showCards={true}
          directions={directions}
        />
      ) : isSitTaken ? (
        <PlayerView player={isSitTaken} directions={directions} />
      ) : null}
    </div>
  );
};
