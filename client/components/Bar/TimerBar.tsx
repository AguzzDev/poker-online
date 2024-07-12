import { useGame } from "context/Game/GameProvider";

export const TimerBar = ({ direction, player }) => {
  const { timer, turn } = useGame();

  return (
    <div
      className={`${
        direction === "center" ? "mb-2" : null
      } relative w-32 h-2 rounded-md bg-gray-300 border border-gray-400 overflow-hidden`}
    >
      {player === turn ? (
        <div
          style={{ width: `${timer}%` }}
          className="absolute bg-blue2 h-full"
        ></div>
      ) : null}
    </div>
  );
};
