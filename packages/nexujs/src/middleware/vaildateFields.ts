import { NexuHandler } from "../types";

/**
 * Middleware function to validate the presence of required fields in the request body.
 *
 * This function checks whether the specified `requiredFields` are present and non-empty in the request body.
 * If any required field is missing or empty, it returns a `400 Bad Request` response with an error message.
 * Otherwise, it passes the request to the next middleware or route handler.
 *
 * @param {string[]} requiredFields - An array of field names that must be present in the request body.
 * @returns {Function} A middleware function for validating required fields in the request body.
 *
 * @example
 * app.post('/submit', validateFields(['name', 'email']), (req, res) => {
 *   res.send('Form submitted successfully!');
 * });
 */
const validateFields =
  (requiredFields: string[]): NexuHandler =>
  (req, res, next) => {
    const missingFields = requiredFields.filter(
      (field) => !req.body[field] || req.body[field].trim() === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        error: `The following fields are required: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
export default validateFields;
