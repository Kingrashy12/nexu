import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

interface ErrorWithContext extends Error {
  context?: string;
}

// Logger function
const logger = (error: ErrorWithContext, context: string = ""): void => {
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "short",

    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Create an error message
  const errorMessage = `
[${timestamp}]  at: ${context} - Error: ${error.message || error}
Stack: ${error.stack || "No stack available"}
    `;

  console.error(errorMessage);

  const logFilePath = path.join(process.cwd(), "error.log");
  fs.appendFile(logFilePath, errorMessage, (err) => {
    if (err) {
      console.error("Failed to write error to log file:", err);
    }
  });
};

/**
 * Error handling middleware that logs the error and sends a generic 500 response.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
const ErrorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger(err as ErrorWithContext, req.originalUrl);

  // Send response
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message || "Unknown error",
  });
};

export default ErrorLogger;
