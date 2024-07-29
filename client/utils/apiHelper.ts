import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

/**
 * @param {ApiCallFunction} apiCall - Función adaptadora para la llamada a la API.
 * @param {Record<string, unknown>} values - Valores de entrada para la llamada a la API.
 * @param {(data: unknown) => void} [updateState] - Función para actualizar el estado con los datos de la respuesta.
 * @param {Dispatch<SetStateAction<Record<string, unknown>>>} [setErrors] - Función para establecer errores en el estado.
 */
export const handleApiCall = async (
  apiCall: Function,
  values: Record<string, unknown>,
  updateState?: (data: unknown) => void,
  setErrors?: Dispatch<SetStateAction<Record<string, unknown>>>
) => {
  try {
    const fetch = await apiCall(values);

    if (updateState) {
      updateState(fetch);
    }
  } catch (error: unknown) {
    const err = error as AxiosError;

    if (!setErrors) return;
    if (err.status === 500) return setErrors({ global: err.message });

    if (Array.isArray(err.response.data.message)) {
      const errors = {};
      err.response.data.message.forEach((err: Record<string, any>) => {
        const fieldName = Object.keys(err)[0];
        err[fieldName] = Object.values(err)[0];
      });

      setErrors(errors);
    } else {
      const fieldName = err.response.data.message;
      setErrors({
        [Object.keys(fieldName)[0]]: [Object.values(fieldName)[0]],
      });
    }
  }
};
