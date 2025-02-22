import { Error, NexuError } from "../types";

export const getError = (error: Error | any): NexuError => {
  const Err_Data = error.response?.data;
  let errObj = Err_Data as NexuError;
  if (typeof Err_Data === "string") {
    errObj = { message: Err_Data, error: Err_Data };
  }
  return errObj;
};
