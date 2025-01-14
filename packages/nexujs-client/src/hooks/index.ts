import { Error } from "../types";

export const getError = (error: Error | any) => {
  const errMsg = error.response?.data || error.message || error.error;
  return errMsg.toString();
};
