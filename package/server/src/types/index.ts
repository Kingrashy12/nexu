import { OptionsJson, OptionsUrlencoded } from "body-parser";
import { CorsOptions } from "cors";
import { NextFunction, Request, Response } from "express";
import { HelmetOptions } from "helmet";

export type NexuRequest = Request;
export type NexuResponse = Response;
export type NexuNext = NextFunction;
export type Method = "get" | "post" | "put" | "delete" | "patch";

export interface Config {
  /**
   * The port the server will listen on.
   * Must be one of the predefined values: 443 (HTTPS), 5000, 8000, or 8080.
   */
  port: 443 | 5000 | 8000 | 8080;

  /**
   * An optional key used for encryption.
   */
  key?: string;

  /**
   * Optional CORS configuration.
   * Defines the CORS policy settings for the application.
   */
  corsConfig?: CorsOptions;

  /**
   * An optional prefix that can be added to routes.
   * This can be used to define a custom path prefix for routes.
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
}

export interface EnforceHTTPSOptions {
  redirectHTTP: boolean;
}

export type NexuMiddleware = (
  req: NexuRequest,
  res: NexuResponse,
  next: NexuNext
) => void;
