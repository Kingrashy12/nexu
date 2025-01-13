import { execSync } from "child_process";

const start = () => {
  try {
    execSync("nodemon dist/server.js", { stdio: "inherit" });
  } catch (error) {
    console.error("Error executing start command:", error.message);
    process.exit(1);
  }
};

const runDev = () => {
  try {
    execSync("nodemon server.js", { stdio: "inherit" });
  } catch (error) {
    console.error("Error executing dev command:", error.message);
    process.exit(1);
  }
};

const runDevTs = () => {
  try {
    execSync('npx tsc && concurrently "tsc --watch" "nodemon dist/server.js"', {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Error executing dev:ts command:", error.message);
    process.exit(1);
  }
};

export { runDev, runDevTs, start };
