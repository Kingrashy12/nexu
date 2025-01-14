import axios, {
  AxiosResponse,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { UserConfig } from "./types";

let isRefreshing = false;
let subscribers: Array<(token: string) => void> = [];

const onTokenRefreshed = (token: string) => {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
};

const addSubscriber = (callback: (token: string) => void) => {
  subscribers.push(callback);
};

const refreshAccessToken = async (accessTkn: string | any): Promise<string> => {
  return Promise.resolve(accessTkn);
};

const getInterceptor = (Config: UserConfig): AxiosInstance => {
  if (Config?.useInterceptors && Config.interceptors) {
    const axiosInstance = axios.create({
      baseURL: Config.interceptors.baseUrl,
      timeout: Config.interceptors.timeOut,
    });
    const accessTkn = Config.interceptors.accessToken;
    axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers = config.headers || {};

        const accessToken =
          Config.interceptors?.accessToken ||
          localStorage.getItem(accessTkn) ||
          "";

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => {
        console.error("Request Interceptor Error:", error);
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        console.error("Response Interceptor Error:", error);

        if (error.response?.status === 401) {
          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const refreshedToken = await refreshAccessToken(
                Config.interceptors?.accessToken
              );
              localStorage.setItem(accessTkn, refreshedToken);
              onTokenRefreshed(refreshedToken);
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }

          return new Promise((resolve, reject) => {
            addSubscriber((token) => {
              error.config.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance.request(error.config));
            });
          });
        }

        return Promise.reject(error);
      }
    );

    return axiosInstance;
  } else {
    console.warn(
      "Interceptors are disabled in the configuration. Returning a default Axios instance."
    );

    return axios.create();
  }
};

export default getInterceptor;
