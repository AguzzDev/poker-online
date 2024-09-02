import { RoomInterface } from "models";
import { formatBuyIn } from "utils/buyInOptions";
import { motion } from "framer-motion";
import { useState } from "react";

const Item = ({ title, data }: { title: string; data: number | string }) => (
  <div className="text-center">
    <h5>{title}</h5>
    <p>{data}</p>
  </div>
);

export const Room = ({ data }: { data: RoomInterface }) => {
  const [hover, setHover] = useState(false);

  const { name, players, buyIn } = data;

  const handleHover = () => {
    if (hover) return;

    setHover(true);
  };

  return (
    <article>
      <motion.div
        onHoverStart={() => handleHover()}
        onHoverEnd={() => setHover(false)}
        className="flex py-3 border-2 bg-[#241C30] border-[#31283E] rounded-md overflow-hidden cursor-pointer"
      >
        <div className="relative w-[25%]">
          <motion.div
            className="absolute top-0 -left-1 flex items-center w-full h-full bg-primary rounded-r-[100%] border-2 border-[#31283E]"
            initial={{ width: "70%" }}
            animate={hover ? { width: "100%" } : { width: "70%" }}
          >
            <motion.h3
              initial={{ x: "-100%" }}
              animate={{ x: hover ? "30%" : "-100%" }}
              transition={{ duration: 0.6 }}
            >
              Join
            </motion.h3>
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <h4>{name}</h4>

          <div className="flex space-x-5 pt-3">
            <Item title="Buy in" data={formatBuyIn(buyIn)} />
            <Item title="Blind" data={(1 * buyIn) / 100} />
            <Item title="Players" data={players} />
          </div>
        </div>
      </motion.div>
    </article>
  );
};
