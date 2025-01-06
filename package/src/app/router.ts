import express, {
  Request,
  Response,
  NextFunction,
  Router,
  RouterOptions,
} from "express";
import ncrypt from "ncrypt-js";
import { nexuKeys } from "./keys";
import { randomUUID } from "crypto";

class NexuRouter {
  private router: Router;
  private ncrypt: ncrypt;

  constructor(secret?: string, options?: RouterOptions) {
    this.router = express.Router(options);
    this.ncrypt = new ncrypt(secret || nexuKeys.router);

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

  private wrapHandler(handler: express.RequestHandler): express.RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      const originalJson = res.json.bind(res);

      // Override res.json to encrypt the response
      res.json = (data: any) => {
        try {
          const payload = {
            data,
            nonce: randomUUID(), // Unique random identifier
          };

          const encryptedData = this.ncrypt.encrypt(JSON.stringify(payload));
          return originalJson({ encrypted: encryptedData });
        } catch (error) {
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
