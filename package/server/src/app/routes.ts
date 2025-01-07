import { existsSync, readdirSync } from "fs";
import path from "path";
import { logger } from "./logger";

class Route {
  routesName: string[] = [];
  routesPath: string[] = [];

  constructor() {
    this.getRoute();
  }

  getRoute() {
    const distPath = path.join(process.cwd(), "/dist/routes");
    const tsConfig = path.join(process.cwd(), "/tsconfig.json");
    const isTs = existsSync(tsConfig);
    if (isTs) {
      logger.info("Typescript detected switching routes path");
    }
    const routesPath = isTs ? distPath : path.join(process.cwd(), "/routes");
    if (existsSync(routesPath)) {
      const fileArray = readdirSync(routesPath, "utf-8");
      for (let file of fileArray) {
        const route = file.replace(".js", "");
        const fullPath = path.join(routesPath, file);
        this.routesName.push(route);
        this.routesPath.push(fullPath);
      }
    } else {
      logger.error("Routes directory not found");
    }
  }
}

const routes = new Route();

export default routes;
