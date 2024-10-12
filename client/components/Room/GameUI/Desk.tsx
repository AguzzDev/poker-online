import { useGame } from "context/Game/GameProvider";
import { formatChips } from "utils/formatChips";
import { PlayerInTable } from "./PlayerInTable";
import { RoomInterface } from "models";
import { motion } from "framer-motion";
import { getCard } from "utils/getCard";

const DeskComponent = ({ room }: { room: RoomInterface }) => (
  <div className="relative w-full h-full border-[1.5rem] md:border-[2rem] 1920:border-[3rem] border-primary rounded-full">
    <div className="relative w-full h-full shadow-xl rounded-full bg-secondary border-2 border-accent">
      <div className="absolute w-full -top-12 1920:-top-16">
        <div className="w-max px-10 lg:px-0 lg:w-1/4 py-2 1920:py-4 mx-auto text-center text-black1 bg-accent rounded-2xl border-2 border-[#debcf6]">
          <h4>Total bet</h4>
          <h5>{formatChips(room?.desk?.totalBid)}</h5>
        </div>
      </div>

      <div className="w-full flex justify-center items-center space-x-1 h-full">
        {room?.desk?.dealer?.map(({ id }, i) => (
          <motion.div
            key={`${id}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: i < 3 ? i / 3 + 0.1 : 0,
            }}
          >
            {getCard(id)}
          </motion.div>
        ))}
      </div>

      <div data-id="seats">
        <PlayerInTable
          sit={1}
          position="bottom-8 sm:bottom-5 md:-bottom-5 xl:-bottom-2 -left-14 md:-left-24 lg:-left-32"
          directions={{ x: "left", y: "bottom" }}
        />
        <PlayerInTable
          sit={2}
          position="top-8 sm:top-5 md:-top-5 xl:-top-2 -left-14 md:-left-24 lg:-left-32"
          directions={{ x: "left", y: "top" }}
        />
        <PlayerInTable
          sit={4}
          position="bottom-8 sm:bottom-5 md:-bottom-5 xl:-bottom-2 -right-14 md:-right-24 lg:-right-32"
          directions={{ x: "right", y: "bottom" }}
        />
        <PlayerInTable
          sit={3}
          position="top-8 sm:bottom-5 md:-top-5 xl:-top-2 -top-10 -right-14 md:-right-24 lg:-right-32"
          directions={{ x: "right", y: "top" }}
        />
      </div>
    </div>
  </div>
);

export const Desk = () => {
  const { room } = useGame();

  return (
    <>
      <section className="flex items-center w-[85%] lg:w-3/4 mx-auto h-[95%] sm:h-full pt-10 md:pt-10">
        <DeskComponent room={room!} />
      </section>
    </>
  );
};
