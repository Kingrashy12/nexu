import { AxiosRequestConfig } from "axios";
import { createApiClient, Delete, Get, Patch, Post, Put } from "./service";
import { ApiClient, Error, Response, SendRequest, UserConfig } from "./types";
import { getError } from "./hooks";

type Constructor = {
  publicKey: string;
  privateKey: string;
  useInterceptors?: boolean;
  interceptors?: UserConfig["interceptors"];
};

/**
 * A client for interacting with the `nexujs` server, providing methods for making HTTP requests
 * (GET, POST, PUT, PATCH, DELETE) with automatic handling of encryption keys.
 * It simplifies making requests to the API by handling common configuration like API keys and interceptors.
 * It can be configured to use interceptors for request/response handling.
 *
 * @example
 * const client = new NexuClient({ publicKey: 'your_public_key', privateKey: 'your_private_key' });
 * const response = await client.Get({ url: '/path/to/resource' });
 *
 * @param {Object} constructor - The configuration object.
 * @param {string} constructor.publicKey - The public API key used for encryption.
 * @param {string} constructor.privateKey - The private API key used for encryption.
 * @param {boolean} [constructor.useInterceptors=false] - Whether or not to enable request/response interceptors.
 */

class NexuClient {
  private public_key: string;
  private private_key: string;
  private useInterceptors: boolean | undefined;
  private interceptors: UserConfig["interceptors"];

  constructor({
    privateKey,
    publicKey,
    useInterceptors,
    interceptors,
  }: Constructor) {
    this.private_key = privateKey;
    this.public_key = publicKey;
    this.useInterceptors = useInterceptors;
    this.interceptors = interceptors;
    this.checkConfig();
  }

  /**
   * Sends a GET request to the specified URL.
   * @param {Response} param - The request parameters including `url` and optional `config`.
   * @param {string} param.url - The URL to send the GET request to.
   * @param {AxiosRequestConfig} [param.config] - Optional Axios configuration.
   * @returns {Promise<T>} The response data.
   */
  Get<T = unknown>({ url, config }: Response): Promise<T> {
    return Get<T>(
      url,
      { private_key: this.private_key, public_key: this.public_key },
      config
    );
  }

  /**
   * Sends a DELETE request to the specified URL.
   * @param {Response} param - The request parameters including `url` and optional `config`.
   * @param {string} param.url - The URL to send the DELETE request to.
   * @param {AxiosRequestConfig} [param.config] - Optional Axios configuration.
   * @returns {Promise<T>} The response data.
   */
  Delete<T = unknown>({ url, config }: Response): Promise<T> {
    return Delete<T>(
      url,
      { private_key: this.private_key, public_key: this.public_key },
      config
    );
  }

  /**
   * Sends a POST request to the specified URL.
   * @param {SendRequest} param - The request parameters including `url`, `data`, and optional `config`.
   * @param {string} param.url - The URL to send the POST request to.
   * @param {unknown} param.data - The data to send with the POST request.
   * @param {AxiosRequestConfig} [param.config] - Optional Axios configuration.
   * @returns {Promise<T>} The response data.
   */
  Post<T = unknown>({ url, data, config }: SendRequest): Promise<T> {
    return Post<T>(
      url,
      { public_key: this.public_key, private_key: this.private_key },
      data,
      config
    );
  }

  /**
   * Sends a PUT request to the specified URL.
   * @param {SendRequest} param - The request parameters including `url`, `data`, and optional `config`.
   * @param {string} param.url - The URL to send the PUT request to.
   * @param {unknown} param.data - The data to send with the PUT request.
   * @param {AxiosRequestConfig} [param.config] - Optional Axios configuration.
   * @returns {Promise<T>} The response data.
   */
  Put<T = unknown>({ url, data, config }: SendRequest): Promise<T> {
    return Put<T>(
      url,
      { private_key: this.private_key, public_key: this.public_key },
      data,
      config
    );
  }

  /**
   * Sends a PATCH request to the specified URL.
   * @param {SendRequest} param - The request parameters including `url`, `data`, and optional `config`.
   * @param {string} param.url - The URL to send the PATCH request to.
   * @param {unknown} param.data - The data to send with the PATCH request.
   * @param {AxiosRequestConfig} [param.config] - Optional Axios configuration.
   * @returns {Promise<T>} The response data.
   */
  Patch<T = unknown>({ url, data, config }: SendRequest): Promise<T> {
    return Patch<T>(
      url,
      { private_key: this.private_key, public_key: this.public_key },
      data,
      config
    );
  }

  private checkConfig() {
    // Ensure that if `useInterceptors` is enabled, `interceptors` is defined
    if (this.useInterceptors && !this.interceptors) {
      throw new Error(
        "Configuration Error: `useInterceptors` is enabled, but no `interceptors` configuration is provided."
      );
    }

    // Ensure that both `private_key` and `public_key` are defined
    if (!this.private_key || !this.public_key) {
      throw new Error(
        "Configuration Error: Both `privateKey` and `publicKey` must be provided."
      );
    }
  }

  /**
   * Creates an API client that automatically injects the necessary encryption keys into
   * the request headers and includes Axios interceptors for handling requests and responses.
   * The client methods (POST, GET, PUT, PATCH, DELETE) return functions that can be invoked
   * to send the corresponding HTTP requests.
   *
   * @returns {Object} The methods (post, patch, put, get, delete) to make the respective API requests.
   *
   * @example
   * const { post, patch, put, get, Delete } = client.createApiClient();
   * const response = await post({ url: '/path/to/resource', data: { key: 'value' } }); // POST request
   */
  createApiClient() {
    const methods = createApiClient({
      useInterceptors: this.useInterceptors,
      interceptors: this.interceptors,
    });

    const post = <T = unknown>({ url, data, config }: ApiClient) =>
      methods.post<T>(
        url,
        { private_key: this.private_key, public_key: this.public_key },
        data,
        config
      );

    const patch = <T = unknown>({ url, data, config }: ApiClient) =>
      methods.patch<T>(
        url,
        { private_key: this.private_key, public_key: this.public_key },
        data,
        config
      );

    const put = <T = unknown>({ url, data, config }: ApiClient) =>
      methods.put<T>(
        url,
        { private_key: this.private_key, public_key: this.public_key },
        data,
        config
      );

    const get = <T = unknown>({ url, config }: ApiClient) =>
      methods.get<T>(
        url,
        { private_key: this.private_key, public_key: this.public_key },
        config
      );

    const Delete = <T = unknown>({ url, config }: ApiClient) =>
      methods.delete<T>(
        url,
        { private_key: this.private_key, public_key: this.public_key },
        config
      );

    return { post, patch, put, Delete, get };
  }

  /**
   * Fetches data from the specified URL using the GET method and tracks loading/error state.
   * @param {string} url - The URL to fetch data from.
   * @param {AxiosRequestConfig} [config] - Optional Axios configuration.
   * @returns {Promise<{ data: T | null, error: string, loading: boolean }>} The data, error message (if any), and loading state.
   */
  async fetchData<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<{ data: T | null; error: string; loading: boolean }> {
    let data: T | null = null;
    let error = "";
    let loading = true;

    try {
      data = await this.Get<T>({ url, config });
    } catch (err) {
      error = getError(err as Error);
    } finally {
      loading = false;
    }

    return { data, error, loading };
  }
}

export default NexuClient;
