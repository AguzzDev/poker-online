import { MissionCategoryTitleEnum, UserInterface } from "models";
import { formatChips } from "utils/formatChips";
import { ButtonTwo } from "./Button/ButtonTwo";
import { TextUnderline } from "./Text/TextUnderline";
import { useUser } from "context/User/UserProvider";
import * as API from "services/api";
import EVENTS from "utils/events";
import { useGame } from "context/Game/GameProvider";

export const Missions = () => {
  const { user, updateUser } = useUser();

  const { socket } = useGame();

  const handleClick = async (type: string) => {
    await API.getRewards({ type, id: user!._id });
    socket!.emit(EVENTS.CLIENT.UPDATE_USER, (data: UserInterface) => {
      updateUser(data);
    });
  };

  return (
    <>
      <TextUnderline text="Missions" />

      <div className="overflow-y-scroll flex-1">
        {Object.entries(user!.missions).map(([key, missionsArray]) => (
          <div key={key} className="my-5 pr-5">
            <h3 className="mb-1">
              {
                MissionCategoryTitleEnum[
                  key as keyof typeof MissionCategoryTitleEnum
                ]
              }
            </h3>

            <ul>
              {missionsArray.missions.length > 0 ? (
                missionsArray.missions.map((mission) => (
                  <li key={mission.name}>
                    <div className="flex justify-between">
                      <p>{mission.name}</p>
                      <p>
                        {formatChips(mission.progress)}/
                        {formatChips(mission.requirement)}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li>No missions</li>
              )}
            </ul>

            {missionsArray.missions.length > 0 &&
            !missionsArray.redeemed &&
            missionsArray.missions.every((mission) => mission.completed) ? (
              <ButtonTwo
                onClick={() => handleClick(key)}
                className="w-full mt-3"
              >
                Claim
              </ButtonTwo>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
};
