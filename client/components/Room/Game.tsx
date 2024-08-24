import { useGame } from "context/Game/GameProvider";
import { Desk, MenuBottom, TopComponent } from "./GameUI";
import { ReBuyModal } from "components/Modal/ReBuyModal";
import { useEffect } from "react";
import { ShowChatProps } from "models";

export const Game = ({ showChat, setShowChat }: ShowChatProps) => {
  const { showReBuyMenu, roomNotification, setRoomNotification } = useGame();

  useEffect(() => {
    if (roomNotification) {
      setTimeout(() => {
        setRoomNotification(null);
      }, 5000);
    }
  }, [roomNotification]);

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
            <h5 className="absolute -bottom-8 left-2">{roomNotification}</h5>
          </div>

          <Desk />
        </section>

        <section className="flex items-end h-[20%] sm:h-[30%]">
          <MenuBottom />
        </section>
      </section>
    </section>
  );
};
