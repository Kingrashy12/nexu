import { execSync } from "child_process";
import { clearTerminal } from "./global.js";

const startTs = () => {
  try {
    execSync("node dist/server.js", { stdio: "inherit" });
  } catch (error) {
    console.error("Error executing start command:", error.message);
    process.exit(1);
  }
};

const start = () => {
  try {
    execSync("node server.js", { stdio: "inherit" });
  } catch (error) {
    console.error("Error executing start command:", error.message);
    process.exit(1);
  }
};

const runDev = () => {
  try {
    clearTerminal();
    execSync("nodemon server.js", { stdio: "inherit" });
  } catch (error) {
    console.error("Error executing dev command:", error.message);
    process.exit(1);
  }
};

const runDevTs = () => {
  try {
    clearTerminal();
    execSync('tsc-watch --onsuccess "node dist/server.js"', {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Error executing dev:ts command:", error.message);
    process.exit(1);
  }
};

export { runDev, runDevTs, start, startTs };
