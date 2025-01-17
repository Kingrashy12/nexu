import { NexuHandler } from "../types";

const watchResError: NexuHandler = (req, res, next) => {
  // List of error codes to monitor
  const errorCode = [
    "400",
    "401",
    "402",
    "403",
    "404",
    "405",
    "406",
    "408",
    "500",
    "502",
    "503",
    "504",
  ];

  // Store the original `status` method
  const originalStatus = res.status.bind(res);

  // Override the `status` method
  res.status = function (code: number) {
    if (errorCode.includes(String(code))) {
      const errorLog = req.header("x-error-log");

      // If the `error-log` header is not set, set it
      if (!errorLog) {
        res.setHeader("x-error-log", "true");
      }
    }

    // Call the original `status` method for chaining
    return originalStatus(code);
  };

  // Call the next middleware in the chain
  next();
};

export default watchResError;
