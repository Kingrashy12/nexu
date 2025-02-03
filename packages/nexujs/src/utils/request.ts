import { logger } from "../app/logger";
import { RequestAction, RequestOptions, ThrowError } from "../types";

/**
 * Utility function that executes a request action.
 *
 * This function returns the `action` function provided in the `RequestAction` object.
 * It can be used to trigger the execution of an asynchronous action related to a request.
 *
 * @param {RequestAction} param0 - An object containing the `action` function.
 * @param {Promise<any>} param0.action - The asynchronous function to process the request and response.
 * @returns {Promise<any>} - The result of invoking the `action` function.
 *
 * @example
 * const result = processRequest({
 *  async action(req, res) {
 *   // some async action logic
 *   return res.status(200).json({ message: 'Success' });
 * }});
 */
export const processRequest = ({ action }: RequestAction) => action;

/**
 * Utility function to send error responses with the specified status code.
 *
 * This function is used to throw errors with a given status code and optional custom message.
 * It sends a JSON response with the error message and details.
 *
 * @param {ThrowError} param0 - An object containing the error information and response details.
 * @param {any} param0.error - The error object, which can contain a message and other details.
 * @param {NexuResponse} param0.res - The response object to send the error response.
 * @param {string} [param0.status="403"] - The HTTP status code to send with the error (default is 403).
 * @param {string} [param0.message] - An optional custom error message.
 * @returns {void} - Sends the error response and terminates the request-response cycle.
 *
 * @example
 * const result = useRequest({
 *   async action(req, res) {
 *     try {
 *       // Logic to process the request and send a successful response
 *       return res.status(200).json({ message: 'Success' });
 *     } catch (error) {
 *       // In case of error, use throwError to send an error response
 *       return throwError({
 *         error,
 *         res,
 *         status: "500",
 *       });
 *     }
 *   },
 * });
 */
export const throwError = ({
  error,
  res,
  status = "403",
  message,
}: ThrowError) => {
  const err = error?.message ? error.message : error;
  logger.error(err);
  return res.status(Number(status)).json({
    message: message || "An error occurred",
    error: typeof error === "object" && error?.message ? error.message : error,
  });
};

/**
 * Utility that handles an API request with custom error handling.
 *
 * **Note:** The provided action is automatically wrapped in a `try-catch` block,
 * so you do not need to include error handling inside the action function.
 *
 * @param options - The request options containing the action and optional error handler.
 * @returns A function that processes the request.
 *
 * @example
 * ```ts
 * import { request } from "nexujs";
 *
 * export const getUser = request({
 *   action: async (req, res) => {
 *     const user = await User.findById(req.params.id);
 *     if (!user) {
 *       return res.status(404).json({ message: "User not found" });
 *     }
 *     res.status(200).json(user);
 *   },
 *   errorMessage: "Failed to retrieve user",
 * });
 * ```
 */
export const request = (options: RequestOptions) =>
  processRequest({
    async action(req, res, next) {
      try {
        options.action(req, res, next);
      } catch (error) {
        if (options.errorHandler) {
          return options.errorHandler(req, res, error as Error);
        }

        return throwError({
          res,
          error,
          message: options.errorMessage,
          status: "500",
        });
      }
    },
  });
