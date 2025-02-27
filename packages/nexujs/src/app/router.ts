import express, { Request, Router, RouterOptions } from "express";
import { NexuResponse } from "../types";
import { logger } from "./logger";
import { decrypt, encrypt } from "./encrypt";
import { readConfig } from "../utils/config";

class NexuRouter {
  private router: Router;
  private Config = readConfig();

  constructor(options?: RouterOptions) {
    this.router = express.Router(options);

    this.extendMethods();
  }

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
    const encryptionIsDisabled = this.Config?.disableEncryption;
    if (encryptionIsDisabled) {
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
    return async (req, res, next) => {
      const encryptionIsDisabled = this.Config?.disableEncryption;

      const originalStatus = res.status.bind(res);

      let error = false;

      // Overridden `res.status` to track error status codes
      res.status = (code: number) => {
        const errorCode = [
          400, 401, 402, 403, 404, 405, 406, 408, 500, 502, 503, 504,
        ];
        if (errorCode.includes(code)) {
          error = true;
        }
        return originalStatus(code);
      };

      try {
        this.decryptRequestBody(req, res);

        const originalJson = res.json.bind(res);

        res.json = (data: any) => {
          try {
            if (error || encryptionIsDisabled) {
              return originalJson(data);
            }

            const encryptedData = encrypt(data);
            return originalJson({ nexu: encryptedData });
          } catch (error) {
            const errMsg = error as any;
            console.error(`[NexuRouter] Encryption error: ${errMsg.message}`);
            next(error);
            return res;
          }
        };

        await handler(req, res, next);
      } catch (error) {
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
