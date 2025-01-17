import express, { Request, NextFunction, Router, RouterOptions } from "express";
import { NexuNext, NexuRequest, NexuResponse, ThrowError } from "../types";
import { logger } from "./logger";
import { decrypt, encrypt } from "./encrypt";
import { readConfig } from "../utils/config";

class NexuRouter {
  private router: Router;
  private Config = readConfig();

  constructor(options?: RouterOptions) {
    this.router = express.Router(options);

    // Extend HTTP methods to include encryption
    this.extendMethods();
  }

  // Extend methods to add encryption middleware
  private extendMethods(): void {
    const methodsToExtend: Array<keyof Router> = [
      "post",
      "put",
      "delete",
      "patch",
      "get",
    ];

    methodsToExtend.forEach((method) => {
      const originalMethod = (this.router[method] as any).bind(this.router);

      (this.router as any)[method] = (
        path: string,
        ...handlers: Array<express.RequestHandler>
      ) => {
        const encryptedHandlers = handlers.map((handler) =>
          this.wrapHandler(handler)
        );
        return originalMethod(path, ...encryptedHandlers);
      };
    });
  }

  private decryptData(data: any) {
    const body = decrypt(data);
    return body;
  }

  private decryptRequestBody(req: Request, res: NexuResponse) {
    const isDev =
      process.env.NODE_ENV === "development" &&
      this.Config?.dev?.disableEncryption;
    if (isDev) {
      return req.body;
    } else {
      try {
        if (req.body && req.body.nexu) {
          const decryptedData = this.decryptData(req.body.nexu);
          req.body = decryptedData;
        }
      } catch (error) {
        type Error = { message: string };
        logger.bright(
          "[NexuRouter] Decryption error:",
          (error as Error).message
        );
        return res
          .status(400)
          .send({ error: "Failed to decrypt request data" });
      }
    }
  }

  private wrapHandler(handler: express.RequestHandler): express.RequestHandler {
    return async (req: NexuRequest, res: NexuResponse, next: NextFunction) => {
      const isDev =
        process.env.NODE_ENV === "development" &&
        this.Config?.dev?.disableEncryption;
      const logRes = req.header("error-log");
      try {
        if (isDev) {
          const disableEnHeader = req.header("drop-pass");

          if (!disableEnHeader) {
            res.setHeader("drop-pass", "true");
          }
        }

        // Decrypt request body
        this.decryptRequestBody(req, res);

        // Override res.json to handle encryption
        const originalJson = res.json.bind(res);

        res.json = (data: any) => {
          try {
            if (isDev || logRes) {
              // No encryption in development if disabled
              return originalJson(data);
            }
            // Encrypt the response data
            const encryptedData = encrypt(data);
            return originalJson({ nexu: encryptedData });
          } catch (error) {
            // Handle encryption errors
            const errMsg = error as any;
            console.error(`[NexuRouter] Encryption error: ${errMsg.message}`);
            next(error);
            return res;
          }
        };

        await handler(req, res, next);
      } catch (error) {
        // Catch any errors from the handler and pass them to next()
        console.error(`[NexuRouter] Handler error: ${(error as any).message}`);
        next(error);
      }
    };
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default NexuRouter;
