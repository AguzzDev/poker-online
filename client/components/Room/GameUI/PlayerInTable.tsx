import { UserPlusIcon } from "@heroicons/react/20/solid";
import { CircularProgressBar } from "components/Bar/CircularProgressBar";
import { IconSm } from "components/Icon";
import { useGame } from "context/Game/GameProvider";
import { PlayerInTableProps, PlayerInterface, Status } from "models";
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
  const { turn } = useGame();
  const { bid, showAction, cards, chips, username, blind, winningPot } = player;
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
            <div key={id} className="relative cardSize scale-90">
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

        <div
          className={`flex flex-row sm:flex-col
              absolute ${
                y === "bottom" ? "-top-10 sm:top-5" : "-bottom-10 sm:bottom-5"
              } ${
            x === "right"
              ? "flex-row-reverse -left-2 sm:-left-20"
              : "-right-2 sm:-right-20"
          }`}
        >
          {blind ? (
            <div className="mx-2 sm:mx-0 rounded-full bg-primary">
              <p className="text-xs text-center px-2 py-1">B</p>
            </div>
          ) : null}

          {bid > 0 || winningPot > 0 ? (
            <div className="flex items-center">
              <div className="w-6 h-6">
                <div className="relative w-full h-full">
                  <Image src="/chips/red.svg" alt="Chips image" layout="fill" />
                </div>
              </div>
              <h6 className="text-xs md:text-base">{showChips}</h6>
            </div>
          ) : null}
        </div>

        <div
          className={`${
            x === "left" && "flex-row-reverse"
          } flex justify-between bg-black1 border-2 border-borderColor1 rounded-full w-full h-full absolute z-40`}
        >
          <div
            className={`${
              x === "right" ? "pl-4 lg:pl-7" : "pr-4 lg:pr-7"
            } w-[60%] flex-col py-1 overflow-clip`}
          >
            <p
              className={`${
                username.length > 10
                  ? "text-sm sm:text-lg"
                  : "text-base sm:text-xl"
              } truncate w-32`}
            >
              {username}
            </p>
            <p className="text-sm text-stone-400">{formatChips(chips)}</p>
            <p className="text-sm text-stone-400">{showAction}</p>
          </div>

          <div className="relative flex-1">
            <div
              className={`absolute z-50 top-0 w-full h-full scale-110 ${
                x === "left" ? "-left-[.05rem]" : "-right-[.05rem]"
              }`}
            >
              {turn === player.userId ? <CircularProgressBar /> : null}
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

  const { status } = room!.desk;
  const allInStatus = status === Status.allIn;
  const isSitTaken = room!.desk.players.filter((v) => v!.sit === sit)[0];

  return (
    <div className={`absolute ${position}`}>
      {isSitTaken && !player ? (
        <PlayerView
          showCards={allInStatus}
          player={isSitTaken}
          directions={directions}
        />
      ) : !isSitTaken && !player ? (
        <button onClick={() => takeSit(sit)}>
          <div className="flex justify-center">
            <IconSm Icon={UserPlusIcon} />
          </div>

          <h6>Sit here</h6>
        </button>
      ) : isSitTaken?.userId === player!.userId ? (
        <PlayerView
          player={isSitTaken}
          showCards={true}
          directions={directions}
        />
      ) : isSitTaken ? (
        <PlayerView
          showCards={allInStatus}
          player={isSitTaken}
          directions={directions}
        />
      ) : null}
    </div>
  );
};
