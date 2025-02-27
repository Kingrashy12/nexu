import { writeFileSync, readFileSync, existsSync } from "fs";
import path from "path";
import { logger } from "../app/logger";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE_PATH = path.join(__dirname, "server-log.json");

function loadLogs(): {
  loggedMessages: string[];
  loggerIds: string[];
  hasStartServer: boolean;
} {
  if (!existsSync(LOG_FILE_PATH))
    return { loggedMessages: [], loggerIds: [], hasStartServer: false };
  try {
    return JSON.parse(readFileSync(LOG_FILE_PATH, "utf-8"));
  } catch {
    return { loggedMessages: [], loggerIds: [], hasStartServer: false };
  }
}

function saveLogs(loggerIds: Set<string>) {
  writeFileSync(
    LOG_FILE_PATH,
    JSON.stringify({
      loggerIds: Array.from(loggerIds),
    })
  );
}

const existingLogs = loadLogs();

function updateServerStatus(status: boolean) {
  existingLogs.hasStartServer = status;
}

globalThis.serverLog = globalThis.serverLog ?? {
  hasStartServer: false,
  loggerIds: new Set(existingLogs.loggerIds),

  pushId(id) {
    this.loggerIds.add(id);
    saveLogs(this.loggerIds);
  },

  info(msg, id) {
    if (this.hasStartServer && this.loggerIds.has(id)) {
      return;
    }

    this.pushId(id);
    logger.info(msg);
  },
  success(msg, id) {
    if (this.hasStartServer && this.loggerIds.has(id)) {
      return;
    }

    this.pushId(id);
    logger.success(msg);
  },

  warning(msg, id) {
    if (this.loggerIds.has(id)) {
      return;
    }

    this.pushId(id);
    logger.warning(msg);
  },

  setServerStarted(status) {
    updateServerStatus(status);
    this.hasStartServer = status;
  },

  clear() {
    this.hasStartServer = false;
    this.loggerIds = new Set();
  },
};

export { serverLog };
