import express, { NextFunction, Request, Response, Router } from "express";
import routes from "./routes";
import { pathToFileURL } from "url";
import dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config();

class App {
  private addonValue = "";
  app: any;
  router: Router;
  constructor() {
    this.app = express();
    this.router = express.Router();
    this.registerRoutes();
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

  registerRoutes() {
    this.router.stack = [];

    const { routesName, routesPath } = routes;
    routesName.forEach((routeName, index) => {
      const routePath = routesPath[index];
      const routeURL = pathToFileURL(routePath).href;
      const addon = this.addonValue;

      const path = addon ? `/${addon}/${routeName}` : `/${routeName}`;
      this.app.use(
        path,
        async (req: Request, res: Response, next: NextFunction) => {
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
  }

  private start() {
    const PORT = process.env.PORT || 5000;
    this.app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  }
}

const appInstance = new App();
const app = appInstance.init();
const nexuRouter = appInstance.getRouter();

export default app;
export { nexuRouter, appInstance as nexu };
