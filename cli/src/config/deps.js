import { execSync } from "child_process";
import path from "path";
import { logger } from "../logger.js";

/**
 * Installs dependencies and runs the update-deps CLI command to update them
 * @param {string} appName - The name or path of the app
 */
const installPkg = async (appName) => {
  logger.message("\nInstalling dependencies using npm install....\n");

  const dir = path.resolve(appName);

  try {
    const installCommand =
      appName !== "/" ? `cd ${dir} && npm install` : "npm install";

    execSync(installCommand, { stdio: "inherit" });
    logger.success("Dependencies installed successfully.");
    console.clear();
  } catch (error) {
    logger.error(`Error during npm install: ${error.message}`);
    process.exit(1);
  }

  logger.message("\nUpdating dependencies....\n");

  try {
    const updateCommand =
      appName !== "/"
        ? `cd ${dir} && npx nexujs-cli update-deps`
        : "npx nexujs-cli update-deps";

    execSync(updateCommand, { stdio: "inherit" });
  } catch (error) {
    logger.error(`Error during update-deps: ${error.message}`);
    process.exit(1);
  }
};

export { installPkg };
