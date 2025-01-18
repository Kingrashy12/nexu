import { Error, NexuError } from "../types";

export const getError = (error: Error | any): NexuError => {
  const errObj = error.response?.data as NexuError;
  return errObj;
};
