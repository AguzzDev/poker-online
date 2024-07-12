import { RoomInterface } from "models";
import { fetchRoom } from "services";
import { roomValues } from "./roomValues";

const getRoomAdapter = async (
  id: RoomInterface["_id"]
): Promise<RoomInterface | string> => {
  try {
    const rooms = await fetchRoom(id);
    return rooms.data.map((room: RoomInterface) => {
      return roomValues(room);
    });
  } catch (error) {
    throw new Error("Failed getting rooms");
  }
};

export default getRoomAdapter;
