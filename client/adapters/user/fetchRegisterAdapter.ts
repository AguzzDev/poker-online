import { RegisterInput, UserInterface } from "models";
import { fetchRegister } from "services";
import { userValues } from "./userValues";
import { AxiosError } from "axios";

const fetchRegisterAdapter = async (
  values: RegisterInput
): Promise<UserInterface | AxiosError> => {
  try {
    const user = await fetchRegister(values);

    return userValues(user.data);
  } catch (error) {
    throw error;
  }
};

export default fetchRegisterAdapter;
