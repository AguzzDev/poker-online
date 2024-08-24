import { changePassword } from "services";
import { AxiosError } from "axios";

const fetchChangePassword = async (
  email: string
): Promise<string | AxiosError> => {
  try {
    const { data } = await changePassword({ email });

    return data.message;
  } catch (error) {
    throw error;
  }
};

export default fetchChangePassword;
