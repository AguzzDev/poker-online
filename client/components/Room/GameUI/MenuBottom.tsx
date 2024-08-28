import { formatChips } from "utils/formatChips";
import { useGame } from "context/Game/GameProvider";
import { Status } from "models";
import { roundNumber } from "utils/roundNumber";

const ActionButtons = () => {
  const { player, turn, playMove, room, bid } = useGame();

  const { bidToPay } = room!.desk;
  const { userId, bid: playerBid, chips } = player!;

  const playerBidToPay = roundNumber(bidToPay - playerBid);

  const SecondButton = () => (
    <>
      {playerBid < bidToPay ? (
        <Element type="call" text="Call" />
      ) : (
        <Element type="check" text="Check" />
      )}
    </>
  );

  const ThirdButton = () => {
    let body;

    if (
      room!.desk.status === Status.bid ||
      room!.desk.status === Status.raise
    ) {
      body = (
        <>
          {bidToPay * 2 > chips || bidToPay >= chips + bid ? (
            <Element type="allIn" text="All In" />
          ) : (
            <Element type="raise" text="Raise" />
          )}
        </>
      );
    } else {
      body = <Element type="bid" text="Bid" />;
    }

    return body;
  };

  const Element = ({ type, text }: { [key: string]: string }) => {
    let body;
    const style = `${
      type === "fold" ? "bg-red1" : "bg-green1"
    } py-2 1920:py-2 font-bold text-md lg:text-xl rounded-xl w-full flex flex-col justify-center items-center`;

    const statusType = type as Status;

    if (userId == turn) {
      body = (
        <button className={style} onClick={() => playMove(statusType)}>
          {text}
          <br />
          <span className="text-sm">{type === "call" && playerBidToPay}</span>
        </button>
      );
    } else {
      body = (
        <div className={style}>
          {text}
          <br />
          <span className="text-sm">{type === "call" && playerBidToPay}</span>
        </div>
      );
    }

    return body;
  };

  return (
    <div className="flex justify-center space-x-3">
      <Element type="fold" text="Fold" />
      {bid !== chips && bidToPay < chips + playerBid ? (
        <>
          <SecondButton />
          <ThirdButton />
        </>
      ) : (
        <Element type="allIn" text="All In" />
      )}
    </div>
  );
};

const PotButtons = () => {
  const { room, player, setBid } = useGame();
  const { totalBid } = room!.desk;

  const style = "px-3 py-1 text-sm 1920:text-base bg-primary rounded-md";

  return (
    <div className="flex space-x-2">
      <button onClick={() => setBid((50 * totalBid) / 100)} className={style}>
        2/4
      </button>
      <button onClick={() => setBid((75 * totalBid) / 100)} className={style}>
        3/4
      </button>
      <button onClick={() => setBid(totalBid)} className={style}>
        Pot
      </button>
      <button
        onClick={() => {
          setBid(player!.chips);
        }}
        className={style}
      >
        All In
      </button>
    </div>
  );
};

export const MenuBottom = () => {
  const { room, player, bid, setBid } = useGame();
  const { players, maxPlayerRoom, blind } = room!.desk;

  if (!player) return;

  return (
    <section className="flex justify-between w-full">
      <div className="hidden md:flex flex-1 flex-col justify-end">
        <h3>{room!.name}</h3>
        <h6>Blind: {blind}</h6>
        <h6>Buy in: {formatChips(room!.buyIn)}</h6>
        <h6>
          {players.length} / {maxPlayerRoom} Players
        </h6>
      </div>

      {player && player.chips! > 0 ? (
        <div className="flex-col space-y-2 w-full md:w-2/4">
          <PotButtons />

          <div>
            <h4 className="pb-1">{formatChips(bid)}</h4>
            <input
              type="range"
              min={roundNumber((blind * 100) / player.chips)}
              onChange={(e) =>
                setBid(roundNumber(Number(e.target.value) * player.chips) / 100)
              }
              max={roundNumber((player.chips * 100) / player!.chips)}
              value={roundNumber((bid * 100) / player.chips)}
              className="rangeInput"
            />
          </div>

          <ActionButtons />
        </div>
      ) : null}
    </section>
  );
};
