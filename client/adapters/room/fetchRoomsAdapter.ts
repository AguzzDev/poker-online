import { RoomInterface } from "models";
import { fetchRooms } from "services";
import { roomValues } from "./roomValues";

const getRoomsAdapter = async (): Promise<RoomInterface[] | string> => {
  try {
    const rooms = await fetchRooms();
    return rooms.data.map((room: RoomInterface) => {
      return roomValues(room);
    });
  } catch (error) {
    throw "Failed getting rooms"
  }
};

export default getRoomsAdapter;
