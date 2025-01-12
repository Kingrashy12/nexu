import express, { Application, Router } from "express";
import routes from "./routes";
import { pathToFileURL } from "url";
import dotenv from "dotenv";
import { logger } from "./logger";
import { NexuMiddleware, NexuNext, NexuRequest, NexuResponse } from "../types";
import NexuRouter from "./router";
import { nexuKeys } from "./keys";
import cors from "cors";
import { readConfig } from "../utils/config";
import CryptoJS from "crypto-js";
import bodyParser from "body-parser";
import https from "https";
import http from "http";
import fs, { existsSync } from "fs";
import path from "path";
import helmet from "helmet";

class App {
  app: Application;
  router: Router;
  private cors_config = {};
  private bodyParserConfigJson = {};
  private bodyParserConfigUrl = {};
  private key = "";
  private nexuRouter = new NexuRouter(this.key).getRouter();
  private port: number;
  private Config = readConfig();
  constructor() {
    this.app = express();
    this.router = this.nexuRouter;
    this.registerSecurityHeaders();
    this.app.use(express.json());
    this.loadEnv();
    this.port = this.Config?.port || 5000;
    this.key = this.Config?.key || nexuKeys.router;
    this.cors_config = this.Config?.corsConfig || {};
    this.bodyParserConfigJson = this.Config?.parserConfig?.json || {};
    this.bodyParserConfigUrl = this.Config?.parserConfig?.url || {};
    this.registerStaticFiles();
    this.useFileBasedRouting();
    this.useConfig();
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
  }

  private registerSecurityHeaders() {
    // Using helmet to set security headers
    const configOptions = this.Config?.helmetOptions;

    // Apply CSP policy

    if (!this.Config?.disableHelmet) {
      this.app.use(helmet(configOptions));
    }
  }

  private registerStaticFiles(): void {
    logger.info("Checking public paths for static files...");
    // Serve static files from 'public' directory in the root folder
    const publicDir = path.join(process.cwd(), "public");
    // Serve static files from 'nexujs/public' directory inside node_modules
    const libDir = path.join(process.cwd(), "node_modules/nexujs/public");

    // Check if the library static folder exists
    if (existsSync(libDir)) {
      logger.success("Serving static files from 'nexujs/public'.");
      this.app.use("/nexujs", express.static(libDir)); // Mount at /nexujs path
    }

    // Serve static files from the local 'public' directory
    if (existsSync(publicDir)) {
      logger.success("Serving static files from 'public'.");
      this.app.use(express.static(publicDir)); // Serve files at root path '/'
    }
  }

  private useFileBasedRouting() {
    const autoRoutes = this.Config?.experimental?.fileBasedRouting;
    if (autoRoutes) {
      logger.warning(
        "The experimental feature 'fileBasedRouting' is enabled.\n" +
          "This feature is not stable and may lead to unexpected behavior.\n" +
          "Please use it with caution."
      );

      this.registerRoutes();
    }
  }

  private useConfig() {
    this.app.options("*", cors(this.cors_config));
    this.app.use(cors(this.cors_config));
    this.app.use(bodyParser.json(this.bodyParserConfigJson));
    this.app.use(
      bodyParser.urlencoded({ extended: true, ...this.bodyParserConfigUrl })
    );
  }

  private registerRoutes() {
    const Config = readConfig();
    this.cors_config = Config?.corsConfig || {};
    this.bodyParserConfigJson = Config?.parserConfig?.json || {};
    this.bodyParserConfigUrl = Config?.parserConfig?.url || {};

    this.useConfig();

    const { routesName, routesPath } = routes;

    routesName.forEach((routeName, index) => {
      const routePath = routesPath[index];
      const routeURL = pathToFileURL(routePath).href;
      const addon = Config?.addonPrefix;
      const path = addon ? `/${addon}/${routeName}` : `/${routeName}`;

      this.app.use(
        path,
        async (req: NexuRequest, res: NexuResponse, next: NexuNext) => {
          try {
            const module = await import(routeURL);
            if (module.default) {
              module.default(req, res, next); // Route logic
            } else {
              console.error(`[NexuApp] Invalid route module at ${routeURL}`);
              res
                .status(500)
                .send({ error: "Route module not properly exported" });
            }
          } catch (error) {
            logger.error(`Error loading route ${path}:`, error);
            next(error);
          }
        }
      );
    });

    // Catch-all route for 404 errors
    this.app.use((req, res) => {
      res.status(404).send("Route not found");
    });
  }

  startHttps(key: string, cert: string, port: number) {
    // Start HTTP server for redirecting HTTP to HTTPS
    const httpServer = http.createServer((req, res) => {
      // Use Express for the response handling
      this.app(req, res);
    });

    // Add middleware to redirect HTTP to HTTPS before passing to Express
    httpServer.on("request", (req, res) => {
      if (req.headers["x-forwarded-proto"] !== "https") {
        res.writeHead(301, {
          Location: `https://${req.headers.host}${req.url}`,
        });
        res.end();
      } else {
        this.app(req, res); // Let Express handle the request if HTTPS
      }
    });

    // Start HTTP server on port 80
    httpServer.listen(80, () => {
      console.log("HTTP server running on http://localhost:80");
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
      const serverPort = port || 443;
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
  }

  private start() {
    const PORT = this.port;
    const httpsKey = this.Config?.experimental?.httpsKeyPaths;
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
}

const appInstance = new App();
const app = appInstance.init();
const nexuRouter = appInstance.getRouter();

export { nexuRouter, appInstance as nexu, app };
