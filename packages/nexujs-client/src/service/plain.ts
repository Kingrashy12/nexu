import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import handleDecryptedResponse, { encryptPayload } from "../gate";
import { Keys } from "../types";

const encryptData = (data: unknown, key: Keys) => encryptPayload(data, key);

const nexuClient = {
  async post<T = unknown>(
    url: string,
    key: Keys,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const encryptedData = data ? encryptData(data, key) : undefined;
    const response: AxiosResponse = await axios.post(
      url,
      encryptedData,
      config
    );
    return handleDecryptedResponse(response, key);
  },

  async get<T = unknown>(
    url: string,
    key: Keys,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse = await axios.get(url, config);
    return handleDecryptedResponse(response, key);
  },

  async patch<T = unknown>(
    url: string,
    key: Keys,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const encryptedData = data ? encryptData(data, key) : undefined;
    const response: AxiosResponse = await axios.patch(
      url,
      encryptedData,
      config
    );
    return handleDecryptedResponse(response, key);
  },

  async put<T = unknown>(
    url: string,
    key: Keys,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const encryptedData = data ? encryptData(data, key) : undefined;
    const response: AxiosResponse = await axios.put(url, encryptedData, config);
    return handleDecryptedResponse(response, key);
  },

  async delete<T = unknown>(
    url: string,
    key: Keys,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse = await axios.delete(url, config);
    return handleDecryptedResponse(response, key);
  },
};

export default nexuClient;
