import { AxiosError, AxiosRequestConfig } from "axios";

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
}

export type SendRequest = {
  url: string;
  data?: unknown;
  config?: AxiosRequestConfig;
};

export type Response = {
  url: string;
  config?: AxiosRequestConfig;
};

export type Keys = {
  public_key: string;
  private_key: string;
};

export type ApiClient = {
  url: string;
  data?: unknown;
  config?: AxiosRequestConfig;
};
