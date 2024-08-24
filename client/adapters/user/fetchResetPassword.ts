import { resetPassword } from "services";
import { AxiosError } from "axios";

const fetchResetPassword = async (
  values: any
): Promise<string | AxiosError> => {
  try {
    const { data } = await resetPassword(values);

    return data;
  } catch (error) {
    throw error;
  }
};

export default fetchResetPassword;
