import { Dispatch, SetStateAction } from "react";

/**
 * @param {Function} apiCall - Adapter.
 * @param {Object} values - Input values.
 * @param {Function} updateState - Update state.
 * @param {Function} setErrors - Set errors.
 */
export const handleApiCall = async (
  apiCall: Function,
  values: Object,
  updateState?: Function,
  setErrors?: Dispatch<SetStateAction<any>>
) => {
  try {
    const fetch = await apiCall(values);

    updateState(fetch);
  } catch (error) {
    if (!error.response.data.message.length) {
      setErrors({
        [Object.keys(error.response.data.message)[0]]: [
          Object.values(error.response.data.message)[0],
        ],
      });
      return;
    }

    const errors = {};
    error.response.data.message.forEach((err) => {
      const fieldName = Object.keys(err)[0];
      errors[fieldName] = Object.values(err)[0];
    });

    setErrors(errors);
  }
};
