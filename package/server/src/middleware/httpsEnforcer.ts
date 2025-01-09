import { logger } from "@/app/logger";
import { EnforceHTTPSOptions } from "../types";
import { Application, Request, Response, NextFunction } from "express";

export function enforceHTTPS(
  app: Application,
  options: EnforceHTTPSOptions
): void {
  if (options.redirectHTTP) {
    // Redirect HTTP to HTTPS
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect(`https://${req.headers.host}${req.url}`);
      }
      next();
    });
  }

  logger.info("HTTPS enforcement middleware initialized");
}
