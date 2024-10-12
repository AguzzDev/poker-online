import { AxiosError } from "axios";
import { FormikErrors } from "formik";

export const handleApiCall = async (
  apiCall: Function,
  setErrors: (errors: FormikErrors<{ global: string }>) => void
) => {
  try {
    const res = await apiCall();

    if ("message" in res) {
      setErrors(res.message);
    }
    return res;
  } catch (error: unknown) {
    const err = error as AxiosError;

    if (!setErrors) return;
    if (err.status === 500) {
      setErrors({
        global: err.message,
      });

      return;
    }
    const data = err.response?.data;

    if (data && typeof data === "object" && "message" in data) {
      if (Array.isArray(data.message)) {
        const errors = {};
        data.message.forEach((err: Record<string, any>) => {
          const field = Object.keys(err)[0] as string;
          err[field] = Object.values(err)[0];
        });

        setErrors(errors);
      } else {
        const field = data.message as Record<string, string>;
        const key = Object.keys(field)[0] as string;
        const value = Object.values(field)[0] as string | number;

        setErrors({ [key]: [value] });
      }
    } else {
      setErrors({ global: "An unknown error occurred." });
    }
  }
};
