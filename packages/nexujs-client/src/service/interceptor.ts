import handleDecryptedResponse from "../gate";
import getInterceptor from "../interceptor";
import { Keys, UserConfig } from "../types";

const createApiClient = (Config: UserConfig) => {
  const axiosInstance = getInterceptor(Config);

  // Wrapper for making requests
  const request = async <T = unknown>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    key: Keys,
    data?: unknown,
    config?: any
  ): Promise<T> => {
    try {
      const response = await axiosInstance({
        method,
        url,
        data,
        ...config,
      });

      return handleDecryptedResponse(response, key);
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  };

  return {
    get: <T = unknown>(url: string, key: Keys, config?: any) =>
      request<T>("get", url, key, config),
    post: <T = unknown>(url: string, key: Keys, data?: unknown, config?: any) =>
      request<T>("post", url, key, data, config),
    put: <T = unknown>(url: string, key: Keys, data?: unknown, config?: any) =>
      request<T>("put", url, key, data, config),
    patch: <T = unknown>(
      url: string,
      key: Keys,
      data?: unknown,
      config?: any
    ) => request<T>("patch", url, key, data, config),
    delete: <T = unknown>(url: string, key: Keys, config?: any) =>
      request<T>("delete", url, key, config),
  };
};

export default createApiClient;
