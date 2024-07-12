import { useGame } from "context/Game/GameProvider";
import { Modal } from "./Modal";
import EVENTS from "utils/events";
import { useState } from "react";
import { ButtonOne } from "components/Button/ButtonOne";
import { ButtonTwo } from "components/Button/ButtonTwo";
import { useRouter } from "next/router";

export const ReBuyModal = () => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();

  const { setShowReBuyMenu, rebuyChips,reBuy } = useGame();

  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
      <div className="min-w-[40vw] h-[40vh] flex flex-col py-3 px-5 bg-background z-50">
        <h1>Do you wanna keep playing?</h1>
        <p>Buy more chips...</p>

        <p className="text-xs text-red-500 my-5">{reBuy.message}</p>

        <div className="flex items-end h-full">
          {reBuy.error ? (
            <div className="flex justify-between space-x-5">
              <ButtonOne onClick={() => router.push("/")}>
                Volver al inicio
              </ButtonOne>
              <ButtonTwo onClick={() => setShowReBuyMenu(false)}>
                Quedarse como espectador
              </ButtonTwo>
            </div>
          ) : (
            <ButtonOne
              style="w-full"
              disabled={disabled}
              onClick={() => {
                setDisabled(!disabled);
                rebuyChips();
              }}
            >
              Rebuy
            </ButtonOne>
          )}
        </div>
      </div>
    </div>
  );
};
