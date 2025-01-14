import { AxiosError } from "axios";

export type Error = AxiosError & { error: string };

export type FetchResponse<T> = {
  data: T | null;
  error: string;
  loading: boolean;
};

export interface UserConfig {
  useInterceptors?: boolean;
  interceptors?: {
    baseUrl: string;
    timeOut: number;
    accessToken: string;
  };
  dev?: {
    disablePayloadEncrytion?: boolean;
  };
}
