#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { logger } from "../logger.js";

export const updateBatch = () => {
  const projectDir = process.cwd();

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
      logger.message(`Updating ${dep} to latest in ${projectDir}...`);
      execSync(`npm install ${dep}@latest`, {
        stdio: "inherit",
        cwd: projectDir,
      });
    });

    logger.success("All dependencies updated to their latest versions!");
  } catch (error) {
    logger.error("Failed to update dependencies:", error.message);
  }
};
