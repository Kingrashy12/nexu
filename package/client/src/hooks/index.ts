import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { Error, UseFetchResponse } from "../types";
import nexuClient from "../gate";

export const {
  post: Post,
  patch: Patch,
  get: Get,
  put: Put,
  delete: Delete,
} = nexuClient;

const getError = (error: Error) => {
  const errMsg = error.response?.data || error.message || error.error;
  return errMsg.toString();
};

const useFetch = <T>(
  uri: string,
  config?: AxiosRequestConfig
): UseFetchResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await nexuClient.get<T>(uri, config);
        setData(response);
      } catch (error) {
        const errMsg = getError(error as any);
        setError(error instanceof Error ? errMsg : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uri, config]);

  return { data, error, loading };
};

export { useFetch };
