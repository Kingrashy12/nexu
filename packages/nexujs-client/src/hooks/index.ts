import { AxiosRequestConfig } from "axios";
import { Error, FetchResponse } from "../types";
import nexuClient from "../service/plain";

const getError = (error: Error) => {
  const errMsg = error.response?.data || error.message || error.error;
  return errMsg.toString();
};

const fetchData = async <T>(
  uri: string,
  config?: AxiosRequestConfig
): Promise<FetchResponse<T>> => {
  let data: T | null = null;
  let error = "";
  let loading = true;

  try {
    data = await nexuClient.get<T>(uri, config);
  } catch (err) {
    error = getError(err as Error);
  } finally {
    loading = false;
  }

  return { data, error, loading };
};

export default fetchData;
