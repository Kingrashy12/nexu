import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import CryptoJS from "crypto-js";

const getKey = (): string => {
  const PROCESS = typeof process !== "undefined" && process.env;

  // Check for `import.meta.env` (used in Vite)
  // @ts-ignore
  if (typeof import.meta !== "undefined" && import.meta.env.VITE_NEXU_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_NEXU_KEY as string;
  }

  // Check for `process.env` (used in Node.js)
  if (PROCESS) {
    if (process.env.NEXU_KEY) {
      return process.env.NEXU_KEY;
    }
    if (process.env.NEXT_PUBLIC_NEXU_KEY) {
      return process.env.NEXT_PUBLIC_NEXU_KEY;
    }
  }

  // Throw an error if the key is not found in either
  throw new Error(
    "Environment key not found: Ensure that one of the following is defined:\n" +
      "- For React: NEXU_KEY\n" +
      "- For Vite: VITE_NEXU_KEY\n" +
      "- For Next.js: NEXT_PUBLIC_NEXU_KEY"
  );
};

// Function to decrypt the response
const decryptResponse = (encryptedData: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, getKey());
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  const data = JSON.parse(decrypted);
  return data.data;
};

// Create an extended Axios client
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

// Helper function to decrypt the response
const handleDecryptedResponse = <T = unknown>(response: AxiosResponse): T => {
  // Check if the response contains an encrypted payload
  if (response.data && response.data.nexu) {
    return decryptResponse(response.data.nexu);
  }

  // If no encryption, return the raw data
  return response.data;
};

export const {
  post: Post,
  patch: Patch,
  get: Get,
  put: Put,
  delete: Delete,
} = nexuClient;
