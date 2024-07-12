import axios from "axios";
import { parseCookies } from "nookies";

const URL = process.env.NEXT_PUBLIC_API_URL;

const API_DEFAULT = axios.create({ baseURL: URL });

const API_TOKEN = () => {
  const { user } = parseCookies();

  return axios.create({
    baseURL: URL,
    headers: { token: JSON.parse(user).accessToken },
  });
};

//ROOMS
export const fetchRooms = () => API_DEFAULT.get("/room");
export const fetchRoom = (id) => API_DEFAULT.get(`/room/${id}`);

//AUTH
export const fetchLogin = (values) => API_DEFAULT.post("/auth/login", values);
export const fetchRegister = (values) =>
  API_DEFAULT.post("/auth/register", values);

//USER
export const fetchUpdateUser = ({ id, values }) =>
  API_TOKEN().put(`/user/${id}`, values);
