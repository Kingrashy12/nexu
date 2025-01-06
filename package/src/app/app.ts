import express, { Application, Router } from "express";
import routes from "./routes";
import { pathToFileURL } from "url";
import dotenv from "dotenv";
import { logger } from "./logger";
import { NexuNext, NexuRequest, NexuResponse } from "../types";
import NexuRouter from "./router";
import { nexuKeys } from "./keys";
import cors, { CorsOptions } from "cors";
import ncrypt from "ncrypt-js";

class App {
  private addonValue = "";
  app: Application;
  router: Router;
  private cors_config: CorsOptions = {};
  private nexuRouter = new NexuRouter(nexuKeys.router).getRouter();
  // private encryptRes = false;
  private ncrypt = new ncrypt(nexuKeys.router);
  constructor() {
    this.app = express();
    this.router = this.nexuRouter;
    // this.router = this.encryptRes ? this.nexuRouter : express.Router();
    this.registerRoutes();
    this.app.use(cors({ ...this.cors_config }));
    this.app.use(express.json());
    this.app.options("*", cors(this.cors_config));
    this.loadEnv();
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
    const PORT = process.env.PORT || 5000;
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

  // secureRes() {
  //   this.encryptRes = true;
  //   this.router = this.nexuRouter;
  //   this.registerRoutes();
  // }

  decryptMiddleware(req: NexuRequest, res: NexuResponse, next: NexuNext) {
    try {
      if (req.body && req.body.encrypted) {
        const decryptedBody = this.ncrypt.decrypt(req.body.encrypted);
        req.body = JSON.parse(String(decryptedBody));
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
