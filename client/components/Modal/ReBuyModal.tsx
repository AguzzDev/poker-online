import { useGame } from "context/Game/GameProvider";
import { useState } from "react";
import { ButtonOne } from "components/Button/ButtonOne";
import { ButtonTwo } from "components/Button/ButtonTwo";

export const ReBuyModal = () => {
  const [disabled, setDisabled] = useState<boolean>(false);

  const { reBuyChips, reBuyMessage, staySpectator, backToLobby } = useGame();

  return (
    <div className="absolute inset-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-20">
      <div className="flex-col py-5 px-5 bg-secondary rounded-md z-50 p-5">
        <h3>Do you wanna keep playing?</h3>
        <p className="mt-1">Buy more chips...</p>

        <p className="text-xs text-red-500 my-5">{reBuyMessage}</p>

        <ButtonOne
          className="w-full"
          disabled={disabled}
          onClick={() => {
            setDisabled(!disabled);
            reBuyChips();
          }}
        >
          Rebuy
        </ButtonOne>

        <div className="flex justify-between space-x-5 mt-3">
          <ButtonOne
            onClick={() => {
              backToLobby();
            }}
          >
            Back to lobby
          </ButtonOne>
          <ButtonTwo
            onClick={() => {
              staySpectator();
            }}
          >
            Stay as a spectator
          </ButtonTwo>
        </div>
      </div>
    </div>
  );
};
