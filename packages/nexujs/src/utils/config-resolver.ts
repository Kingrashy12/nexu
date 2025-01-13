import path from "path";
import { existsSync } from "fs";
import { createRequire } from "module";
import { logger } from "../app/logger";
import { Config } from "../types";

export const readConfig = (): Config => {
  const tsConfig = path.join(process.cwd(), "/tsconfig.json");
  const extension = existsSync(tsConfig) ? ".ts" : ".js";
  const configPath = path.join(process.cwd(), `/nexu.config${extension}`);

  try {
    const require = createRequire(import.meta.url);

    if (extension === ".ts") {
      // Register `ts-node` to handle TypeScript files
      const tsNode = require("ts-node");
      tsNode.register({ transpileOnly: true });
    }

    const userConfig = require(configPath).default;

    if (!userConfig || typeof userConfig !== "object") {
      throw new Error(
        "Invalid configuration. Ensure your config file exports a valid object."
      );
    }

    return userConfig;
  } catch (error) {
    logger.error("Error loading config file:", (error as any).message);
    throw error;
  }
};
