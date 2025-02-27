import rateLimit from "express-rate-limit";
import { Config } from "../types";
import { Application } from "express";
import { existsSync } from "fs";
import path from "path";
import express from "express";
import { logger } from "./logger";

class ServerConfig {
  private Config: Config;
  private app: Application;

  constructor(app: Application, Config: Config) {
    this.Config = Config;
    this.app = app;
  }

  public addLimit() {
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

  public registerStaticFiles(): void {
    serverLog?.info("Checking public paths for static files...", "ssp-001");

    const publicDir = path.join(process.cwd(), "public");
    const libDir = path.join(process.cwd(), "node_modules/nexujs/public");

    if (existsSync(libDir)) {
      serverLog?.success(
        "Serving static files from 'nexujs/public'.",
        "ssp-002"
      );
      this.app.use("/nexujs", express.static(libDir));
    }

    if (existsSync(publicDir)) {
      serverLog?.success("Serving static files from 'public'.", "ssp-003");
      this.app.use(express.static(publicDir));
    }
  }

  public watch() {
    process.on("SIGINT", () => {
      logger.warning("🔴 Process interrupted (CTRL+C). Cleaning up...");
      serverLog?.clear();
      console.clear();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      logger.warning(
        "🔴 Process terminated (kill command or system shutdown). Cleaning up..."
      );
      serverLog?.clear();
      console.clear();
      process.exit(0);
    });
  }
}

export default ServerConfig;
