import { join } from "path";
import { NexuNext, NexuRequest, NexuResponse } from "../types";
import { logger } from "./logger";
import { existsSync } from "fs";

class ModuleHandler {
  constructor() {}

  public async handleModule(
    routeURL: string,
    req: NexuRequest,
    res: NexuResponse,
    next: NexuNext
  ) {
    try {
      const module = await this.loadModule(routeURL);
      this.invokeModuleHandler(module, req, res, next);
    } catch (error) {
      logger.error(`Error loading module at ${routeURL}:`, error);
      res.status(500).send({ error: "Internal server error" });
    }
  }

  /** Loads the module based on the environment (ESM or CommonJS).*/
  private async loadModule(routeURL: string) {
    const tsConfig = join(process.cwd(), "tsconfig.json");
    if (existsSync(tsConfig)) {
      return this.loadCommonJSModule(routeURL);
    } else {
      return this.loadESMModule(routeURL);
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
}
export default ModuleHandler;
