import { RegisterInput } from "models";
import { fetchRegister } from "services";
import { AxiosError } from "axios";

const fetchRegisterAdapter = async (
  values: RegisterInput
): Promise<string | AxiosError> => {
  try {
    const { data } = await fetchRegister(values);

    return data.message;
  } catch (error) {
    throw error;
  }
};

export default fetchRegisterAdapter;
