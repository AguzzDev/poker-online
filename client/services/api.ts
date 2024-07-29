import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";

const URL = process.env.NEXT_PUBLIC_API_URL;
const errInterceptor = (err: AxiosError) => {
  if (err.code === "ERR_NETWORK" || err.status === 500) {
    throw { status: 500, message: "Server is down, try again later" };
  }

  return Promise.reject(err);
};

const API_DEFAULT = axios.create({ baseURL: URL });
API_DEFAULT.interceptors.response.use(
  (response) => response,
  (err) => errInterceptor(err)
);

const API_TOKEN = () => {
  const { user } = parseCookies();

  return axios
    .create({
      baseURL: URL,
      headers: { token: JSON.parse(user).accessToken },
    })
    .interceptors.response.use(
      (response) => response,
      (err) => errInterceptor(err)
    );
};

//ROOMS
export const fetchRooms = () => API_DEFAULT.get("/room");
export const fetchRoom = (id) => API_DEFAULT.get(`/room/${id}`);
export const createRoom = (values) => API_TOKEN().post("/room", values);
//AUTH
export const fetchLogin = (values) => API_DEFAULT.post("/auth/login", values);
export const fetchRegister = (values) =>
  API_DEFAULT.post("/auth/register", values);

//USER
export const fetchUpdateUser = ({ id, values }) =>
  API_TOKEN().put(`/user/${id}`, values);
