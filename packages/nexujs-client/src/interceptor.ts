import axios, {
  AxiosResponse,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { InterceptorConfig } from "./types";

let isRefreshing = false;
let subscribers: Array<(token: string) => void> = [];

const onTokenRefreshed = (token: string) => {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
};

const addSubscriber = (callback: (token: string) => void) => {
  subscribers.push(callback);
};

const getInterceptor = (Config: InterceptorConfig): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: Config.baseUrl,
    timeout: Config.timeOut,
    ...Config.axiosConfig,
  });

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<any> => {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      const accessToken =
        Config.getAccessToken?.() ||
        localStorage.getItem(Config.accessTokenKey || "accessToken");

      if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }

      if (Config.onRequest) {
        // Allow user-defined request handling
        return await Config.onRequest(config);
      }

      return config;
    },
    (error) => {
      console.error("Request Interceptor Error:", error);
      if (Config.onRequestError) {
        Config.onRequestError(error);
      }
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    async (response: AxiosResponse) => {
      if (Config.onResponse) {
        // Allow user-defined response handling
        return await Config.onResponse(response);
      }
      return response;
    },
    async (error) => {
      console.error("Response Interceptor Error:", error);

      if (error.response?.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshedToken =
              (Config.onTokenRefresh && (await Config.onTokenRefresh())) || "";

            if (refreshedToken) {
              localStorage.setItem(
                Config.accessTokenKey || "accessToken",
                refreshedToken
              );
              onTokenRefreshed(refreshedToken);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            if (Config.onTokenRefreshError) {
              Config.onTokenRefreshError(refreshError);
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return new Promise((resolve, reject) => {
          addSubscriber((token) => {
            error.config.headers.set("Authorization", `Bearer ${token}`);
            resolve(axiosInstance.request(error.config));
          });
        });
      }

      if (Config.onResponseError) {
        Config.onResponseError(error);
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default getInterceptor;
