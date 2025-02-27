import express, { Application, Router } from "express";
import routes from "./routes";
import { pathToFileURL } from "url";
import dotenv from "dotenv";
import { logger } from "./logger";
import { NexuMiddleware } from "../types";
import NexuRouter from "./router";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import { readConfig } from "../utils/config";
import { StartHttps } from "./https";
import ModuleHandler from "./module";
import ErrorLog from "./error-log";
import ServerConfig from "./server-config";
import "../types/global";

class App {
  app: Application;
  router: Router;
  private cors_config = {};
  private bodyParserConfigJson = {};
  private bodyParserConfigUrl = {};
  private nexuRouter = new NexuRouter().getRouter();
  private port: number;
  private Config = readConfig();

  constructor() {
    this.app = express();
    this.router = this.nexuRouter;
    this.registerSecurityHeaders();
    this.app.use(express.json());
    this.loadEnv();
    this.port = this.Config?.port || 5000;
    this.cors_config = this.Config?.corsConfig || {};
    this.bodyParserConfigJson = this.Config?.parserConfig?.json || {};
    this.bodyParserConfigUrl = this.Config?.parserConfig?.url || {};
    this.useConfig();
    this.serverLog();
    this.useFileBasedRouting();
    routes.delete();
    this.start();
  }

  init(): Application {
    return this.app;
  }

  getRouter() {
    return this.router;
  }

  /**
   * Registers an array of middleware functions to be used by the Express app.
   *
   * @param {Array<Function>} args - An array of middleware functions to apply.
   */
  useMiddleware(args: NexuMiddleware[]) {
    if (this.Config?.experimental?.fileBasedRouting) {
      if (!Array.isArray(args) || args.length === 0) {
        return logger.error("Middleware list should be a non-empty array.");
      }

      args.forEach((middleware) => {
        if (middleware && typeof middleware === "function") {
          this.app.use(middleware);
        }
      });
    } else {
      logger.warning(
        "useMiddleware should only be used when fileBasedRouting is enabled."
      );
    }
  }

  private registerSecurityHeaders() {
    const configOptions = this.Config?.helmetOptions;

    this.app.use(helmet(configOptions));
  }

  private useFileBasedRouting() {
    const autoRoutes = this.Config?.experimental?.fileBasedRouting;
    if (autoRoutes) {
      logger.warning(
        "The experimental feature 'fileBasedRouting' is enabled.\n"
      );

      this.registerRoutes();
    }
  }

  private useConfig() {
    this.app.use(cors(this.cors_config));
    this.app.use(bodyParser.json(this.bodyParserConfigJson));
    this.app.use(
      bodyParser.urlencoded({ extended: true, ...this.bodyParserConfigUrl })
    );

    const serverConfig = new ServerConfig(this.app, this.Config!);

    serverConfig.addLimit();
    serverConfig.registerStaticFiles();
    serverConfig.watch();
  }

  private registerRoutes() {
    const { routesName, routesPath } = routes;
    const moduleHandler = new ModuleHandler();

    routesName.forEach((routeName, index) => {
      const routePath = routesPath[index];
      const routeURL = pathToFileURL(routePath).href;
      const addon = this.Config?.addonPrefix;
      const path = addon ? `/${addon}/${routeName}` : `/${routeName}`;

      this.app.use(path, async (req, res, next) => {
        await moduleHandler.handleModule(routeURL, req, res, next);
      });
    });

    this.app.use(this.router);
  }

  private startHttps(key: string, cert: string, port: number) {
    StartHttps(this.app, key, cert, port);
  }

  private start() {
    const PORT = this.port;
    const httpsKey = this.Config?.httpsKeyPaths;

    if (httpsKey?.cert && httpsKey.key) {
      const { key, cert } = httpsKey;
      this.startHttps(key, cert, PORT);
    } else {
      this.app.listen(PORT, () => {
        logger.success(`Server running on port http://localhost:${PORT}`);
      });
    }
  }

  private loadEnv() {
    return dotenv.config();
  }

  private serverLog() {
    const errorLog = new ErrorLog(this.app, this.Config!, this.port);
    errorLog.watch();
    errorLog.log();
  }
}

const nexu = new App();
const app = nexu.init();
const nexuRouter = nexu.getRouter();

export { nexuRouter, nexu, app };
