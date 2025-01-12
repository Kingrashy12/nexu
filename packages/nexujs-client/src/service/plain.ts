import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import handleDecryptedResponse, { encryptPayload } from "../gate";

const nexuClient = {
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const encryptedData = data ? encryptPayload(data) : undefined;
    const response: AxiosResponse = await axios.post(
      url,
      encryptedData,
      config
    );
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
    const encryptedData = data ? encryptPayload(data) : undefined;
    const response: AxiosResponse = await axios.patch(
      url,
      encryptedData,
      config
    );
    return handleDecryptedResponse(response);
  },

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const encryptedData = data ? encryptPayload(data) : undefined;
    const response: AxiosResponse = await axios.put(url, encryptedData, config);
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
