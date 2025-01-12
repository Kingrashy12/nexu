import handleDecryptedResponse from "../gate";
import getInterceptor from "../interceptor";

const createApiClient = () => {
  const axiosInstance = getInterceptor();

  // Wrapper for making requests
  const request = async <T = unknown>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
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

      return handleDecryptedResponse(response);
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  };

  return {
    get: <T = unknown>(url: string, config?: any) =>
      request<T>("get", url, undefined, config),
    post: <T = unknown>(url: string, data?: unknown, config?: any) =>
      request<T>("post", url, data, config),
    put: <T = unknown>(url: string, data?: unknown, config?: any) =>
      request<T>("put", url, data, config),
    patch: <T = unknown>(url: string, data?: unknown, config?: any) =>
      request<T>("patch", url, data, config),
    delete: <T = unknown>(url: string, config?: any) =>
      request<T>("delete", url, undefined, config),
  };
};

export default createApiClient;
