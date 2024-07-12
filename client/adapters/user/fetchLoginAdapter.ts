import { LoginInput, UserInterface } from "models";
import { fetchLogin } from "services";
import { userValues } from "./userValues";
import { AxiosError } from "axios";

const fetchLoginAdapter = async (
  values: LoginInput
): Promise<UserInterface | AxiosError> => {
  try {
    const user = await fetchLogin(values);

    return userValues(user.data);
  } catch (error) {
    throw error;
  }
};

export default fetchLoginAdapter;
