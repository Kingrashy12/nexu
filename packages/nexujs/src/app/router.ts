import express, { Request, NextFunction, Router, RouterOptions } from "express";
import { nexuKeys } from "./keys";
import { randomUUID } from "crypto";
import CryptoJS from "crypto-js";
import { NexuRequest, NexuResponse } from "../types";

class NexuRouter {
  private router: Router;
  private secret: string;

  constructor(secret?: string, options?: RouterOptions) {
    this.router = express.Router(options);
    this.secret = secret || nexuKeys.router;

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

  private encryptData(data: unknown) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secret).toString();
  }

  private decryptData(data: string) {
    const bytes = CryptoJS.AES.decrypt(data, this.secret);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const body = JSON.parse(decrypted);
    return body;
  }

  // Middleware to decrypt request body before the handler
  private decryptRequestBody(
    req: Request,
    res: NexuResponse,
    next: NextFunction
  ) {
    try {
      // Check if the body is encrypted
      if (req.body && req.body.nexu) {
        const decryptedData = this.decryptData(req.body.nexu);
        req.body = decryptedData; // Replace the encrypted body with the decrypted data
      }
      next(); // Proceed to the handler
    } catch (error) {
      type Error = { message: string };
      console.error("[NexuRouter] Decryption error:", (error as Error).message);
      res.status(400).send({ error: "Failed to decrypt request data" });
      next(error);
    }
  }

  private wrapHandler(handler: express.RequestHandler): express.RequestHandler {
    return async (req: NexuRequest, res: NexuResponse, next: NextFunction) => {
      this.decryptRequestBody(req, res, next);

      const originalJson = res.json.bind(res);

      // Override res.json to encrypt the response
      res.json = (data: any) => {
        try {
          const payload = {
            data,
            nonce: randomUUID(),
          };

          const encryptedData = this.encryptData(payload);
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
