import { useGame } from "context/Game/GameProvider";
import { useRef } from "react";
import { Modal } from "./Modal";
import { useRouter } from "next/router";

export const JoinRoomModal = ({ id, hasPassword }: any) => {
  const router = useRouter();
  const inputRef = useRef<any>();
  const { joinRoom } = useGame();

  return hasPassword ? (
    <Modal
      button={
        <button className="px-2 font-bold text-white bg-black">
          Entrar a jugar
        </button>
      }
      content={
        <section className="p-10 bg-white rounded-md">
          <input type="text" ref={inputRef} />
          <button
            onClick={() => joinRoom({ id, password: inputRef.current.value })}
          >
            Entrar
          </button>
        </section>
      }
    />
  ) : (
    <button
      onClick={() => {
        joinRoom({ id });
      }}
      className="px-2 font-bold text-white bg-blue3"
    >
      Entrar a jugar
    </button>
  );
};
