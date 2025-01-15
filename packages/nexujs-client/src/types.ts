import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export type Error = AxiosError & { error: string };

export type FetchResponse<T> = {
  data: T | null;
  error: string;
  loading: boolean;
};

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

export interface InterceptorConfig {
  baseUrl: string;
  timeOut?: number;
  axiosConfig?: AxiosRequestConfig;
  accessTokenKey?: string;
  getAccessToken?: () => string | null;
  onRequest?: (
    config: AxiosRequestConfig
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRequestError?: (error: any) => void;
  onResponse?: (
    response: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>;
  onResponseError?: (error: any) => void;
  onTokenRefresh?: () => Promise<string>;
  onTokenRefreshError?: (error: any) => void;
}
