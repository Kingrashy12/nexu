#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { logger } from "../logger.js";
import ora from "ora";

export const updateBatch = () => {
  const projectDir = process.cwd();
  const spinner = ora();

  try {
    const packageJsonPath = path.join(projectDir, "package.json");

    // Ensure package.json exists
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`package.json not found in ${projectDir}`);
    }

    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Get all dependencies and devDependencies
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});

    // Combine all dependencies
    const allDeps = [...deps, ...devDeps];
    // Install the latest version for each dependency
    allDeps.forEach((dep) => {
      spinner.start(`Updating ${dep} to latest...`);

      try {
        execSync(`npm install ${dep}@latest`, {
          stdio: "ignore",
          cwd: projectDir,
        });
        spinner.succeed(`${dep} updated to latest.`);
      } catch (error) {
        spinner.fail(`Failed to update ${dep}: ${error.message}`);
      }
    });
  } catch (error) {
    logger.error("Failed to update dependencies:", error.message);
  }
};
