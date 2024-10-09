import axios, { AxiosError, AxiosInstance } from "axios";
import { CreateRoomInput, LoginInput, oAuthInput, RegisterInput } from "models";
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

const API_TOKEN = (id?: string): AxiosInstance => {
  const { user } = parseCookies();

  const API = axios.create({
    baseURL: URL,
    headers: { token: id ? id : JSON.parse(user).accessToken },
  });
  API.interceptors.response.use(
    (response) => response,
    (err) => errInterceptor(err)
  );

  return API;
};

//DASHBOARD
export const fetchDashboard = (id: string) =>
  API_TOKEN(id).get(`/user/dashboard/${id}`);
//ROOMS
export const fetchRooms = () => API_TOKEN().get("/room");
export const fetchRoom = (id: string) => API_TOKEN().get(`/room/${id}`);
export const createRoom = (values: CreateRoomInput) =>
  API_TOKEN().post("/room", values);
//AUTH
export const fetchOAuth = (values: oAuthInput) =>
  API_DEFAULT.post("/auth/oauth", values);
export const fetchLogin = (values: LoginInput) =>
  API_DEFAULT.post("/auth/login", values);
export const fetchRegister = (values: RegisterInput) =>
  API_DEFAULT.post("/auth/register", values);
export const verify = (token: string) =>
  API_DEFAULT.get(`/auth/verify?token=${token}`);
export const resetPassword = ({
  password,
  token,
}: {
  password: string;
  token: string;
}) => API_DEFAULT.post(`/auth/resetPassword?token=${token}`, { password });
export const changePassword = (email: { email: string }) =>
  API_DEFAULT.post(`/auth/changePassword`, email);
//MISSIONS
export const getRewards = ({ id, type }: { id: string; type: string }) =>
  API_TOKEN().post(`/user/rewards/${id}`, { type });
