import express, { Application, Router } from "express";
import routes from "./routes";
import { pathToFileURL } from "url";
import dotenv from "dotenv";
import { logger } from "./logger";
import { NexuNext, NexuRequest, NexuResponse } from "../types";
import NexuRouter from "./router";
import { nexuKeys } from "./keys";
import cors, { CorsOptions } from "cors";
import { readConfig } from "@/utils/config";
import CryptoJS from "crypto-js";
import bodyParser from "body-parser";

class App {
  private addonValue = "";
  app: Application;
  router: Router;
  private cors_config: CorsOptions = {};
  private key = "";
  private nexuRouter = new NexuRouter(this.key).getRouter();
  private port: number;
  constructor() {
    this.app = express();
    this.router = this.nexuRouter;
    this.registerRoutes();
    this.app.use(express.json());
    this.loadEnv();
    this.port = readConfig()?.port || 5000;
    this.key = readConfig()?.key || nexuKeys.router;
    this.start();
  }

  init() {
    return this.app;
  }

  getRouter() {
    return this.router;
  }

  addon(value: string) {
    this.addonValue = value;
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.stack = [];
    this.app.options("*", cors(this.cors_config));
    this.app.use(cors(this.cors_config));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    const { routesName, routesPath } = routes;
    routesName.forEach((routeName, index) => {
      const routePath = routesPath[index];
      const routeURL = pathToFileURL(routePath).href;
      const addon = this.addonValue;

      const path = addon ? `/${addon}/${routeName}` : `/${routeName}`;
      this.app.use(
        path,
        this.decryptMiddleware.bind(this),
        async (req: NexuRequest, res: NexuResponse, next: NexuNext) => {
          try {
            const module = await import(routeURL);
            module.default(req, res, next);
          } catch (error) {
            logger.error(error);
            next(error);
          }
        }
      );
    });

    this.app.use(this.router);
  }

  private start() {
    const PORT = this.port;
    this.app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  }

  private loadEnv() {
    return dotenv.config();
  }

  corsConfig(arg: CorsOptions) {
    this.cors_config = arg;
    this.app.use(cors({ ...this.cors_config }));
    this.registerRoutes();
  }

  decryptMiddleware(req: NexuRequest, res: NexuResponse, next: NexuNext) {
    try {
      if (req.body && req.body.encrypted) {
        const bytes = CryptoJS.AES.decrypt(req.body.nexu, this.key);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        req.body = JSON.parse(decrypted);
      }
      next();
    } catch (error) {
      res.status(400).send({ error: "Failed to decrypt request data" });
    }
  }
}

const appInstance = new App();
const app = appInstance.init();
const nexuRouter = appInstance.getRouter();

export { nexuRouter, appInstance as nexu, app };
