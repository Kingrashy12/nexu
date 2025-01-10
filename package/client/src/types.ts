import { AxiosError } from "axios";

export type Error = AxiosError & { error: string };

export type UseFetchResponse<T> = {
  data: T | null;
  error: string;
  loading: boolean;
};
