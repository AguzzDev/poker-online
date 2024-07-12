import { formatPrice } from "utils/formatPrice";
import { useGame } from "context/Game/GameProvider";
import { Status } from "models";
import { useEffect } from "react";

const ActionButtons = ({ status, bid }) => {
  let body;
  const { player, turn, playMove, room } = useGame();

  const { bidToPay } = room.desk;
  const { userId, bid: Pbid, chips } = player;

  const Element = ({ type, text }) => {
    let body;
    const style = `${
      type === "fold" ? "bg-red1" : Status[type] ? "bg-green1" : "bg-primary"
    } py-2 font-bold text-sm rounded-full w-full text-center`;

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

  return (
    <div className="flex justify-center space-x-3">
      {body}

      {/* {status === "bid" || status === "raise" || status === "allIn" ? (
        status === "allIn" ? (
          <>
            {bidToPay < chips ? <Element type="call" text="Call" /> : null}
            <Element type={"allIn"} text={"All In"} />
          </>
        ) : (
          <>
            {Pbid <= bidToPay ? (
              <Element type="call" text="Call" />
            ) : (
              <Element type="check" text="Check" />
            )}
            <Element
              type={bid === chips ? "allIn" : "raise"}
              text={bid === chips ? "All In" : "Raise"}
            />
          </>
        )
      ) : (
        <>
          <Element type="check" text="Check" />
          <Element type="bid" text="Bid" />
        </>
      )} */}
    </div>
  );
};

const PotButtons = ({ setBid }) => {
  const { room, player } = useGame();
  const { totalBid } = room.desk;

  const style = "px-5 py-1 text-xs bg-primary rounded-md";

  return (
    <div className="flex space-x-2">
      <button onClick={() => setBid(50 * totalBid / 100)} className={style}>
        2/4
      </button>
      <button onClick={() => setBid(75 * totalBid / 100)} className={style}>
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
    <section className="flex justify-between items-end w-full h-full">
      <div className="flex flex-col">
        <h2>{room.name}</h2>
        <p>Blind: {blind}</p>
        <p>Buy in: {formatPrice(room.buyIn)}</p>
        <p>
          {players.length} / {maxPlayerRoom} Jugadores
        </p>
      </div>

      {player ? (
        <div className="flex flex-col min-w-80">
          <PotButtons setBid={setBid} />

          <div className="py-1">
            <h3>{formatPrice(bid)}</h3>
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
