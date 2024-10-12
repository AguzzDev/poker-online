import { useGame } from "context/Game/GameProvider";
import { Room } from "./Room";
import { LoadingSpinner } from "components/Spinner/LoadingSpinner";
import { useRouter } from "next/router";

export const Rooms = () => {
  const router = useRouter();
  const { rooms } = useGame();

  const roomsData = Array.isArray(rooms)
    ? rooms.map((data, i: number) => (
        <button
          key={i}
          onClick={() => {
            router.push(`/app/room/${data._id}`);
          }}
        >
          <Room data={data} />
        </button>
      ))
    : rooms;

  return (
    <>
      {!rooms ? (
        <div className="flex items-center justify-center h-3/4 1920:scale-110">
          <LoadingSpinner />
        </div>
      ) : (
        <div data-id="rooms" className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto mt-3 pr-5 md:pr-3">
          {roomsData}
        </div>
      )}
    </>
  );
};
