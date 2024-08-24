import { AxiosError } from "axios";
import { FormikErrors } from "formik";

export const handleApiCall = async (
  apiCall: Function,
  setErrors: (errors: FormikErrors<{ global: string }>) => void
) => {
  try {
    const res = await apiCall();

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
          const fieldName = Object.keys(err)[0];
          err[fieldName] = Object.values(err)[0];
        });

        setErrors(errors);
      } else {
        const fieldName = data.message as Record<string, string>;

        setErrors({
          [Object.keys(fieldName)[0]]: [Object.values(fieldName)[0]],
        });
      }
    }
  }
};
