import express, { Application, Router } from "express";
import routes from "./routes";
import { pathToFileURL } from "url";
import dotenv from "dotenv";
import { logger } from "./logger";
import { NexuMiddleware, NexuNext, NexuRequest, NexuResponse } from "../types";
import NexuRouter from "./router";
import cors from "cors";
import bodyParser from "body-parser";
import https from "https";
import http from "http";
import fs, { existsSync, readFileSync } from "fs";
import path from "path";
import helmet from "helmet";
import { readConfig } from "../utils/config";
import rateLimit from "express-rate-limit";
import { sendErrorLog } from "../utils/content-send";

class App {
  app: Application;
  router: Router;
  private cors_config = {};
  private bodyParserConfigJson = {};
  private bodyParserConfigUrl = {};
  private nexuRouter = new NexuRouter().getRouter();
  private port: number;
  private Config = readConfig();
  private hasLoggedStaticFiles = false;
  private hasStartServer = false;
  private hasLoggedServerError = false;

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
    this.registerStaticFiles();
    this.useConfig();
    this.addLimit();
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
   * This method ensures that only valid functions are added as middleware.
   *
   * @param {Array<Function>} ware - An array of middleware functions to apply.
   */
  useMiddleware(ware: NexuMiddleware[]) {
    if (this.Config?.experimental?.fileBasedRouting) {
      logger.info("Appling middleware...");

      if (Array.isArray(ware)) {
        ware.forEach((middleware) => {
          if (middleware && typeof middleware === "function") {
            this.app.use(middleware);
          }
        });
      } else {
        logger.error(
          "The 'use' property must be an array of functions. Received: " +
            typeof ware
        );
      }
    } else {
      logger.warning(
        "useMiddleware should only be used when fileBasedRouting is enabled."
      );
    }
  }

  private registerSecurityHeaders() {
    // Using helmet to set security headers
    const configOptions = this.Config?.helmetOptions;

    // Apply CSP policy

    this.app.use(helmet(configOptions));
  }

  private registerStaticFiles(): void {
    if (!this.hasLoggedStaticFiles) {
      logger.info("Checking public paths for static files...");
      this.hasLoggedStaticFiles = true;
    }

    const publicDir = path.join(process.cwd(), "public");
    const libDir = path.join(process.cwd(), "node_modules/nexujs/public");

    if (existsSync(libDir)) {
      logger.success("Serving static files from 'nexujs/public'.");
      this.app.use("/nexujs", express.static(libDir));
    }

    if (existsSync(publicDir)) {
      logger.success("Serving static files from 'public'.");
      this.app.use(express.static(publicDir));
    }
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
    // this.app.options("*", cors(this.cors_config));
    this.app.use(cors(this.cors_config));
    this.app.use(bodyParser.json(this.bodyParserConfigJson));
    this.app.use(
      bodyParser.urlencoded({ extended: true, ...this.bodyParserConfigUrl })
    );
  }

  private addLimit() {
    const defaultLimit = {
      windowMs: 15 * 60 * 1000,
      max: 20,
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    };

    const limiter = rateLimit({
      windowMs: this.Config?.rateLimit?.windowMs || defaultLimit.windowMs,
      limit: this.Config?.rateLimit?.limit || defaultLimit.max,
      standardHeaders:
        this.Config?.rateLimit?.standardHeaders || defaultLimit.standardHeaders,
      legacyHeaders:
        this.Config?.rateLimit?.legacyHeaders || defaultLimit.legacyHeaders,
      message: this.Config?.rateLimit?.message || defaultLimit.message,
      ...this.Config?.rateLimit,
    });

    this.app.use(limiter);
  }

  private async handleModule(
    routeURL: string,
    req: NexuRequest,
    res: NexuResponse,
    next: NexuNext,
    isESM: boolean
  ) {
    try {
      const module = await this.loadModule(routeURL, isESM);
      this.invokeModuleHandler(module, req, res, next);
    } catch (error) {
      logger.error(`Error loading module at ${routeURL}:`, error);
      res.status(500).send({ error: "Internal server error" });
    }
  }

  /** Loads the module based on the environment (ESM or CommonJS).*/
  private async loadModule(routeURL: string, isESM: boolean) {
    if (isESM) {
      return this.loadESMModule(routeURL);
    } else {
      return this.loadCommonJSModule(routeURL);
    }
  }

  /** Loads an ESM module. */
  private async loadESMModule(routeURL: string) {
    const module = await import(routeURL);

    if (!module.default || typeof module.default !== "function") {
      throw new Error(`Invalid default export in ESM module at ${routeURL}`);
    }
    return module;
  }

  /** Loads a CommonJS module.*/
  private loadCommonJSModule(routeURL: string) {
    const module = require(routeURL);

    if (module.default && typeof module.default === "function") {
      return module;
    } else if (typeof module === "function") {
      return { default: module };
    } else {
      throw new Error(`Invalid route module at ${routeURL}`);
    }
  }

  /** Invokes the module's handler function with the provided parameters. */
  private invokeModuleHandler(
    module: any,
    req: NexuRequest,
    res: NexuResponse,
    next: NexuNext
  ) {
    try {
      module.default(req, res, next);
    } catch (error) {
      logger.error(`Error invoking handler in module:`, error);
      res.status(500).send({ error: "Error processing the route" });
    }
  }

  private registerRoutes() {
    const { routesName, routesPath } = routes;

    routesName.forEach((routeName, index) => {
      const routePath = routesPath[index];
      const routeURL = pathToFileURL(routePath).href;
      const addon = this.Config?.addonPrefix;
      const path = addon ? `/${addon}/${routeName}` : `/${routeName}`;

      const isESM = module.constructor.name === "Module";

      this.app.use(path, async (req, res, next) => {
        await this.handleModule(routeURL, req, res, next, isESM);
      });
    });

    this.app.use(this.router);
  }

  private startHttps(key: string, cert: string, port: number) {
    if (this.hasStartServer) return;

    const httpServer = http.createServer((req, res) => {
      this.app(req, res);
    });

    // A middleware to redirect HTTP to HTTPS before passing to Express
    httpServer.on("request", (req, res) => {
      if (req.headers["x-forwarded-proto"] !== "https") {
        res.writeHead(301, {
          Location: `https://${req.headers.host}${req.url}`,
        });
        res.end();
      } else {
        this.app(req, res);
      }
    });

    // Start HTTP server on port 80
    httpServer.listen(80, () => {
      if (!this.hasStartServer) {
        console.log("HTTP server running on http://localhost:80");
      }
    });

    const fetchKeyPath = () => {
      const keyPath = path.join(process.cwd(), key);
      const certPath = path.join(process.cwd(), cert);

      if (existsSync(keyPath) && existsSync(certPath)) {
        const httpsOptions = {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        };

        return httpsOptions;
      } else {
        logger.error(`SSL/TLS key or certificate file missing. 
          Key: ${keyPath} 
          Cert: ${certPath}`);
        return undefined;
      }
    };

    // Start HTTPS server with SSL/TLS
    const httpsOptions = fetchKeyPath();

    if (httpsOptions) {
      const httpsServer = https.createServer(httpsOptions, this.app);
      const serverPort = port;
      httpsServer.listen(serverPort, () => {
        logger.success(
          `HTTPS server running on https://localhost:${serverPort}`
        );
      });
    } else {
      logger.error(
        "Failed to start HTTPS server due to missing key/certificate."
      );
    }

    this.hasStartServer = true;
  }

  private start() {
    const PORT = this.port;
    const httpsKey = this.Config?.httpsKeyPaths;

    if (this.hasStartServer) return;

    if (httpsKey?.cert && httpsKey.key) {
      const { key, cert } = httpsKey;
      this.startHttps(key, cert, PORT);
      this.hasStartServer = true;
    } else {
      this.app.listen(PORT, () => {
        logger.success(`Server running on port http://localhost:${PORT}`);
      });
    }

    this.hasStartServer = true;
  }

  private loadEnv() {
    return dotenv.config();
  }

  private serverLog() {
    const errorLog = path.join(process.cwd(), "error.log");
    if (existsSync(errorLog)) {
      const onHttps = this.Config?.httpsKeyPaths;

      fs.watchFile(errorLog, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
          logger.info(
            `Error logged, view at ${onHttps ? "https" : "http"}://localhost:${
              this.port
            }/errorlog`
          );
        }
      });

      this.app.get("/errorlog", (req, res) => {
        try {
          logger.success("Serving error log file...");
          const content = readFileSync(errorLog, "utf8");
          const styledContent = sendErrorLog(content);

          res.setHeader("Content-Type", "text/html");
          res.send(styledContent);
        } catch (error) {
          console.error("Error reading the error log:", error);
          res.status(500).send("Unable to read the error log.");
        }
      });
    }
  }
}

const nexu = new App();
const app = nexu.init();
const nexuRouter = nexu.getRouter();

export { nexuRouter, nexu, app };
