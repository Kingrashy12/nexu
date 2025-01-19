import { OptionsJson, OptionsUrlencoded } from "body-parser";
import { CorsOptions } from "cors";
import { NextFunction, Request, Response } from "express";
import { Options } from "express-rate-limit";
import { HelmetOptions } from "helmet";

export type NexuRequest = Request;
export type NexuResponse = Response;
export type NexuNext = NextFunction;
export type Method = "get" | "post" | "put" | "delete" | "patch";

type NexuExperimental = {
  /**
   * Enables file-based routing functionality.
   * If true, routes will be automatically generated based on the file structure.
   */
  fileBasedRouting?: boolean;
  /**
   * Optional SSL/TLS key and certificate configuration for HTTPS.
   * Used when setting up secure HTTPS connections for the app.
   */
  httpsKeyPaths?: {
    /**
     * The relative path to the private key file.
     * The path should be relative to the project root and must point to the private key file.
     * @example "config/private-key.pem"
     */
    key: string;

    /**
     * The relative path to the SSL certificate file.
     * The path should be relative to the project root and must point to the SSL certificate file.
     * @example "config/certificate.pem"
     */
    cert: string;
  };
};

export interface Config {
  /**
   * The port the server will listen on.
   * Must be one of the predefined values: 443 (HTTPS), 5000, 8000, or 8080.
   */
  port: 443 | 5000 | 8000 | 8080;

  /**
   * Keys for encryption, `public` and `private`
   */
  keys: {
    /**
     * The public key used for encryption
     */
    public: string;

    /**
     * The private key used for decryption
     */
    private: string;
  };

  /**
   * Optional CORS configuration.
   * Defines the CORS policy settings for the application.
   */
  corsConfig?: CorsOptions;

  /**
   * An optional prefix that can be added to routes.
   * This can be used to define a custom path prefix for routes.
   *
   * **Note**: only use this when `fileBasedRouting` is enabled
   */
  addonPrefix?: string;

  /**
   * Optional parser configuration for request bodies.
   * Specifies how JSON and URL-encoded data should be parsed.
   */
  parserConfig?: {
    /**
     * JSON parser options.
     */
    json: OptionsJson;

    /**
     * URL-encoded body parser options.
     */
    url: OptionsUrlencoded;
  };
  /**
   * Optional configuration object for customizing the security headers in your app.
   * This configuration is passed to the `helmet` middleware to control security headers such as CSP, XSS filtering, and more.
   *
   * @example
   * export default defineConfig ({
   *   helmetOptions: {
   *     contentSecurityPolicy: {
   *       directives: {
   *         defaultSrc: ["'self'"],
   *         scriptSrc: ["'self'", "'unsafe-inline'"],
   *       },
   *     },
   *     xssFilter: true,
   *     noSniff: true,
   *   },
   * });
   */
  helmetOptions?: HelmetOptions;
  /**
   * Experimental features configuration.
   */
  experimental?: NexuExperimental;
  /**
   * Rate limiting configuration.
   */
  rateLimit?: Partial<Options>;
  dev?: {
    disableEncryption?: boolean;
  };
}

export interface EnforceHTTPSOptions {
  redirectHTTP: boolean;
}

export type NexuMiddleware = (
  req: NexuRequest,
  res: NexuResponse,
  next: NexuNext
) => void;

export type NexuHandler = (
  req: NexuRequest,
  res: NexuResponse,
  next: NexuNext
) => void;

export type RequestAction = {
  /**
   * A function that processes the request and response, typically handling asynchronous operations.
   * It can also call the `next` middleware if necessary.
   *
   * @param {NexuRequest} req - The request object, containing information about the HTTP request, such as body, headers, etc.
   * @param {NexuResponse} res - The response object, used to send a response back to the client.
   * @param {NexuNext} next - The next middleware function to be called in the request-response cycle.
   * @returns {Promise<any>} - A promise that resolves with the result of the action, or rejects if an error occurs.
   * @throws {Error} - This function may throw an error that can be handled by subsequent error-handling middleware.
   */
  action: NexuHandler;
};

type ErrorCode =
  | "400"
  | "401"
  | "403"
  | "404"
  | "402"
  | "405"
  | "406"
  | "408"
  | "500"
  | "502"
  | "503"
  | "504";

export type ThrowError = {
  /**
   * The error object or details associated with the error.
   *
   * @type {any}
   */
  error?: any;

  /**
   * The response object to send back the error response.
   *
   * @type {NexuResponse}
   */
  res: NexuResponse;

  /**
   * The HTTP status code indicating the error type.
   *
   * @default "403"
   */
  status: ErrorCode;

  /**
   * Optional custom error message to provide more context.
   * If not provided, a default message will be used.
   *
   * @type {string}
   */
  message?: string;
};

export type EncryptedData = {
  aesKey: string;
  cipherText: string;
  iv: string;
  tag: string;
};
