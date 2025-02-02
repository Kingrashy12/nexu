import { NexuHandler } from "../types";

/**
 * Middleware function to validate the presence of required params in the request params.
 *
 * This function checks whether the specified `requiredParams` are present and non-empty in the request params.
 * If any required field is missing or empty, it returns a `400 Bad Request` response with an error message.
 * Otherwise, it passes the request to the next middleware or route handler.
 *
 * @param {string[]} requiredParams - An array of param names that must be present in the request params.
 *
 * @example
 * app.post('/submit', validateParams(['userId', 'product_id']), (req, res) => {
 *   res.send('Form submitted successfully!');
 * });
 */
const validateParams =
  (requiredParams: string[]): NexuHandler =>
  (req, res, next) => {
    const missingFields = requiredParams.filter(
      (field) =>
        !req.params[field] || req.params[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        error: `The following fields are required: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
export default validateParams;
