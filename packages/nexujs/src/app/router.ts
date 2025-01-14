import express, { Request, NextFunction, Router, RouterOptions } from "express";
import { NexuRequest, NexuResponse } from "../types";
import { logger } from "./logger";
import { decrypt, encrypt } from "./encrypt";

class NexuRouter {
  private router: Router;

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

  private decryptData(data: string) {
    const body = decrypt(data);
    // const body = JSON.parse(decrypted);
    return body;
  }

  private decryptRequestBody(req: Request, res: NexuResponse) {
    try {
      if (req.body && req.body.nexu) {
        const decryptedData = this.decryptData(req.body.nexu);
        req.body = decryptedData;
      }
    } catch (error) {
      type Error = { message: string };
      logger.bright("[NexuRouter] Decryption error:", (error as Error).message);
      return res.status(400).send({ error: "Failed to decrypt request data" });
    }
  }

  private wrapHandler(handler: express.RequestHandler): express.RequestHandler {
    return async (req: NexuRequest, res: NexuResponse, next: NextFunction) => {
      this.decryptRequestBody(req, res);

      const originalJson = res.json.bind(res);

      res.json = (data: any) => {
        try {
          const encryptedData = encrypt(data);
          return originalJson({ nexu: encryptedData });
        } catch (error) {
          const errMsg = error as any;
          console.error(`[NexuRouter] Encryption error: ${errMsg.message}`);
          next(error);
          return res;
        }
      };

      handler(req, res, next);
    };
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default NexuRouter;
