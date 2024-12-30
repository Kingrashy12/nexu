import { execSync } from "child_process";
import path from "path";
import { logger } from "../logger.js";

/**
 * Installs dependencies and runs the update-deps CLI command to update them
 * @param {string} appName - The name or path of the app
 */
const installPkg = async (appName) => {
  logger.message("\nInstalling dependencies using npm install....\n");

  try {
    const installCommand =
      appName !== "/"
        ? `cd ${path.resolve(appName)} && npm install` // if appName is a directory, install in that directory
        : "npm install"; // otherwise, install in the current directory

    // Run the installation command
    execSync(installCommand, { stdio: "inherit" });
    logger.success("Dependencies installed successfully.");
  } catch (error) {
    // Handle errors if npm install fails
    logger.error(`Error during npm install: ${error.message}`);
    return;
  }

  // Log and start updating the dependencies using CLI command
  logger.message("\nUpdating dependencies....\n");

  try {
    const updateCommand =
      appName !== "/"
        ? `cd ${path.resolve(appName)} && npx create-turbo-express update-deps` // Run the update-deps command in the app directory
        : "npx create-turbo-express update-deps"; // Run the update-deps command in the current directory

    // Run the update-deps CLI command
    execSync(updateCommand, { stdio: "inherit" });
  } catch (error) {
    // Handle errors if the update-deps CLI command fails
    logger.error(`Error during update-deps: ${error.message}`);
  }
};

export { installPkg };
