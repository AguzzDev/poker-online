import { useGame } from "context/Game/GameProvider";
import { useState } from "react";
import { ButtonOne } from "components/Button/ButtonOne";
import { ButtonTwo } from "components/Button/ButtonTwo";
import { useRouter } from "next/router";

export const ReBuyModal = () => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();

  const { setShowReBuyMenu, reBuyChips, reBuyMessage } = useGame();

  return (
    <div className="absolute inset-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-20">
      <div className="flex-col py-5 px-5 bg-secondary rounded-md z-50 p-5">
        <h3>Do you wanna keep playing?</h3>
        <p className="mt-1">Buy more chips...</p>

        <p className="text-xs text-red-500 my-5">{reBuyMessage}</p>

        {reBuyMessage ? (
          <div className="flex justify-between space-x-5">
            <ButtonOne
              onClick={() => {
                setShowReBuyMenu(false);
                router.push("/");
              }}
            >
              Back to lobby
            </ButtonOne>
            <ButtonTwo onClick={() => setShowReBuyMenu(false)}>
              Stay as a spectator
            </ButtonTwo>
          </div>
        ) : (
          <ButtonOne
            style="w-full"
            disabled={disabled}
            onClick={() => {
              setDisabled(!disabled);
              reBuyChips();
            }}
          >
            Rebuy
          </ButtonOne>
        )}
      </div>
    </div>
  );
};
