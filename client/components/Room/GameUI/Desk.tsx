import { useGame } from "context/Game/GameProvider";
import Image from "next/image";
import { formatChips } from "utils/formatChips";
import { PlayerInTable } from "./PlayerInTable";
import { RoomInterface } from "models";

interface RoomProps {
  room: RoomInterface;
}

const DeskComponent = ({ room }: RoomProps) => (
  <div className="relative w-3/4 h-full border-[1.5rem] border-primary mx-auto rounded-full">
    <div className="relative w-full h-full shadow-xl rounded-full bg-secondary border-borderWidth border-accent">
      <div className="absolute w-full -top-12">
        <div className="w-max lg:w-1/4 py-2 mx-auto text-center text-black1 bg-accent rounded-2xl border-2 border-[#debcf6]">
          <p>
            Apuesta Total
            <br />
            {formatChips(room?.desk?.totalBid)}
          </p>
        </div>
      </div>

      <div className="flex w-full justify-center mt-8">
        {room?.desk?.dealer.map(({ id }, i) => (
          <motion.div
            key={`${id}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: i < 3 ? i / 3 + 0.1 : 0,
            }}
          >
            <Image
              src={`/cards/${id}.svg`}
              height={75}
              width={60}
              alt="Carta"
            />
          </motion.div>
        ))}
      </div>

      <div>
        <PlayerInTable
          sit={1}
          position="-bottom-10 -left-16 md:-left-24 lg:-left-34"
          x="left"
          y="bottom"
        />
        <PlayerInTable
          sit={2}
          position="-top-10 -left-16 md:-left-24 lg:-left-34"
          x="left"
          y="top"
        />
        <PlayerInTable
          sit={4}
          position="-bottom-10 -right-16 md:-right-24 lg:-right-34"
          x="right"
          y="bottom"
        />
        <PlayerInTable
          sit={3}
          position="-top-10 -right-16 md:-right-24 lg:-right-34"
          x="right"
          y="top"
        />
      </div>

      <div className="absolute top-0 left-0 flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
        Blind
      </div>
    </div>
  </div>
);

export const Desk = () => {
  const { room } = useGame();
  return (
    <>
      <section className="max-w-3xl mx-auto h-full pt-10">
        <DeskComponent room={room} />
      </section>
    </>
  );
};
