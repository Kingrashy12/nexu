import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import handleDecryptedResponse from "../gate";

const nexuClient = {
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse = await axios.post(url, data, config);
    return handleDecryptedResponse(response);
  },

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse = await axios.get(url, config);
    return handleDecryptedResponse(response);
  },

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse = await axios.patch(url, data, config);
    return handleDecryptedResponse(response);
  },

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse = await axios.put(url, data, config);
    return handleDecryptedResponse(response);
  },

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse = await axios.delete(url, config);
    return handleDecryptedResponse(response);
  },
};

export default nexuClient;
