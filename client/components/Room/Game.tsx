import { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { formatPrice } from "utils/formatPrice";

import { useRouter } from "next/dist/client/router";
import { useGame } from "context/Game/GameProvider";
import { HistoryBidProps, PlayerModeEnum, GameRoomProps } from "models";
import { MenuBottom, TopComponent, PlayerInTable } from "./GameUI";
import { useUser } from "context/User/UserProvider";
import { ReBuyModal } from "components/Modal/ReBuyModal";

export const Game = ({ showChat, setShowChat }) => {
  const { showReBuyMenu, room, roomMessage, setRoomMessage } = useGame();

  useEffect(() => {
    if (roomMessage) {
      setTimeout(() => {
        setRoomMessage(null);
      }, 5000);
    }
  }, [roomMessage]);

  return (
    <>
      {showReBuyMenu ? <ReBuyModal /> : null}

      <section
        className={`${
          showReBuyMenu ? "opacity-25" : null
        } flex flex-col mx-4 w-full`}
      >
        <section className="h-[65vh] relative">
          <TopComponent showChat={showChat} setShowChat={setShowChat} />
          <p className="absolute top-0 left-0">{roomMessage}</p>

          <div className="relative min-h-[56%] md:min-h-[65%] w-[85%] md:w-[70%] bg-purple2 mt-10 border-borderWidth border-purple3 mx-auto rounded-full flex items-center justify-center">
            <div className="relative w-[91%] py-20 shadow-xl rounded-full gradient-desk border-borderWidth border-purple4">
              <div className="absolute w-full -top-12">
                <div className="w-1/4 py-2 mx-auto text-center bg-accent rounded-2xl border border-purple4">
                  <h4>
                    Apuesta Total
                    <br />
                    {formatPrice(room?.desk?.totalBid)}
                  </h4>
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
        </section>

        <section className="flex items-end h-[25vh] pb-5">
          <MenuBottom />
        </section>
      </section>
    </>
  );
};
