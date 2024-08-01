import { formatChips } from "utils/formatChips";
import { useGame } from "context/Game/GameProvider";
import { Status } from "models";

const ActionButtons = ({ status, bid }) => {
  let body;
  const { player, turn, playMove, room } = useGame();

  const { bidToPay } = room.desk;
  const { userId, bid: Pbid, chips } = player;

  const Element = ({ type, text }) => {
    let body;
    const style = `${
      type === "fold" ? "bg-red1" : Status[type] ? "bg-green1" : "bg-primary"
    } py-2 1920:py-4 font-bold text-md lg:text-xl rounded-xl w-full text-center`;

    if (userId == turn) {
      body = (
        <button className={style} onClick={() => playMove(type)}>
          {text}
        </button>
      );
    } else {
      body = <div className={style}>{text}</div>;
    }

    return body;
  };

  if (!status) {
    body = (
      <>
        <Element type="fold" text="Fold" />
        <Element type="check" text="Check" />
        <Element
          type={bid === chips ? "allIn" : "bid"}
          text={bid === chips ? "All In" : "Bid"}
        />
      </>
    );
  } else {
    body = (
      <>
        <Element type="fold" text="Fold" />

        {Pbid < bidToPay ? (
          <Element type="call" text="Call" />
        ) : (
          <Element type="check" text="Check" />
        )}

        {bidToPay * 2 > chips ? (
          <Element type="allIn" text="All In" />
        ) : (
          <Element
            type={bid === chips ? "allIn" : "raise"}
            text={bid === chips ? "All In" : "Raise"}
          />
        )}
      </>
    );
  }

  return <div className="flex justify-center space-x-3">{body}</div>;
};

const PotButtons = ({ setBid }) => {
  const { room, player } = useGame();
  const { totalBid } = room.desk;

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
          setBid(player.chips);
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
  const { status, bidToPay, players, maxPlayerRoom, blind } = room.desk;

  return (
    <section className="flex justify-between w-full">
      <div className="hidden md:flex flex-1 flex-col justify-end">
        <h3>{room.name}</h3>
        <h6>Blind: {blind}</h6>
        <h6>Buy in: {formatChips(room.buyIn)}</h6>
        <h6>
          {players.length} / {maxPlayerRoom} Players
        </h6>
      </div>

      {player ? (
        <div className="flex-col space-y-2 w-full md:w-2/4">
          <PotButtons setBid={setBid} />

          <div>
            <h4 className="pb-1">{formatChips(bid)}</h4>
            <input
              type="range"
              min={
                bidToPay
                  ? Math.round((bidToPay * 100) / player.chips)
                  : Math.round((blind * 100) / player.chips)
              }
              onChange={(e) =>
                setBid((Number(e.target.value) * player.chips) / 100)
              }
              value={Math.round((bid * 100) / player.chips)}
              className="rangeInput"
            />
          </div>

          <ActionButtons status={status} bid={bid} />
        </div>
      ) : null}
    </section>
  );
};
