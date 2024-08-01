import { useGame } from "context/Game/GameProvider";
import { MenuBottom, TopComponent, PlayerInTable } from "./GameUI";

import { ReBuyModal } from "components/Modal/ReBuyModal";
import { Desk } from "./GameUI/Desk";
import { useEffect } from "react";

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
    <section className="flex-1">
      {showReBuyMenu ? <ReBuyModal /> : null}

      <section
        className={`${
          showReBuyMenu ? "opacity-25" : null
        } flex flex-col w-full h-full`}
      >
        <section className="relative flex-1 pb-16">
          <div className="relative w-full">
            <TopComponent showChat={showChat} setShowChat={setShowChat} />
            <h5 className="absolute -bottom-8 left-2">{roomMessage}</h5>
          </div>

          <Desk />
        </section>

        <section className="flex items-end h-[20%] sm:h-1/4">
          <MenuBottom />
        </section>
      </section>
    </section>
  );
};
