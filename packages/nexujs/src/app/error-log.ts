import { Application } from "express";
import { logger } from "./logger";
import fs, { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Config } from "../types";
import { sendErrorLog } from "../utils/content-send";

class ErrorLog {
  private app: Application;
  private Config: Config;
  private port: number;

  constructor(app: Application, config: Config, port: number) {
    this.app = app;
    this.Config = config;
    this.port = port;
  }

  public log() {
    const { errorLog, fileExits } = this.logConfig();

    if (fileExits) {
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

  public watch() {
    const { errorLog, fileExits } = this.logConfig();

    if (fileExits) {
      const onHttps = this.Config?.httpsKeyPaths;
      fs.watchFile(errorLog, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
          const message = `Error logged, view at ${
            onHttps ? "https" : "http"
          }://localhost:${this.port}/errorlog`;
          logger.info(message);
        }
      });
    }
  }

  private logConfig() {
    const errorLog = join(process.cwd(), "error.log");
    const fileExits = existsSync(errorLog);

    return { errorLog, fileExits };
  }
}

export default ErrorLog;
