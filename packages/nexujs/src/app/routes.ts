import { existsSync, readdirSync, unlinkSync } from "fs";
import path from "path";
import { logger } from "./logger";
import { readConfig } from "../utils/config";

class Route {
  routesName: string[] = [];
  routesPath: string[] = [];
  private Config = readConfig();

  constructor() {
    this.getRoute();
  }

  getRoute() {
    const distPath = path.join(process.cwd(), "/dist/routes");
    const tsConfig = path.join(process.cwd(), "/tsconfig.json");
    const isTs = existsSync(tsConfig);
    // Remove this once fileBaseRouting is stable
    if (this.Config?.experimental?.fileBasedRouting && isTs) {
      logger.info("Typescript detected switching routes path");
    }
    const routesPath = isTs ? distPath : path.join(process.cwd(), "/routes");
    if (existsSync(routesPath)) {
      const fileArray = readdirSync(routesPath, "utf-8");
      for (let file of fileArray) {
        const route = file.replace(/\.(js|ts)$/, "");
        const fullPath = path.join(routesPath, file);
        this.routesName.push(route);
        this.routesPath.push(fullPath);
      }
    } else {
      logger.error("Routes directory not found");
    }
  }

  delete() {
    const tsConfig = path.join(process.cwd(), "/tsconfig.json");
    const isTs = existsSync(tsConfig);

    const cwd = process.cwd();
    const distPath = path.join(cwd, "dist");
    const routesPath = path.join(distPath, "routes");
    const mainPath = path.join(cwd, "routes");

    if (isTs && existsSync(mainPath) && existsSync(routesPath)) {
      const distRoutes = readdirSync(routesPath);

      for (const route of distRoutes) {
        const fullPath = path.join(routesPath, route);

        // Remove the file extension from the route
        const routeName = route.replace(/\.(js|ts)$/, "");

        // Check if the file is not in the main routes and exists in dist/routes
        if (existsSync(fullPath) && !this.routesName.includes(routeName)) {
          unlinkSync(fullPath);
          console.log(`Deleted: ${fullPath}`);
        }
      }
    }
  }
}

const routes = new Route();

export default routes;
