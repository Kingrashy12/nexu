import { log } from "@clack/prompts";
import { logger } from "../logger.js";
import { selected } from "./select.js";
import chalk from "chalk";
import { installPkg } from "./deps.js";
import { execSync } from "child_process";
import path from "path";
import { createFiles } from "./file-create.js";
import { handlePackage } from "./handle-pk.js";
import { createDBConfig } from "./create-db-config.js";

export const handleFiles = async (
  isTs,
  db,
  appName,
  git,
  public_key,
  private_key
) => {
  await handlePackage(db, isTs, appName);
  await createDBConfig(isTs, db, appName, public_key, private_key);
  await addFiles(isTs, appName, db, git);
};

const addFiles = async (isTs, appName, db, git) => {
  const ext = isTs === "yes" ? ".ts" : ".js";
  const files = [
    `routes/hello${ext}`,
    `server${ext}`,
    "package.json",
    ".gitignore",
    `nexu.config${ext}`,
    "README.md",
  ];
  const mongoclient = `config/mongo-client${ext}`;
  const pgclient = `config/postgres-client${ext}`;
  const neonclient = `config/neon-client${ext}`;
  const isPostgres = db === selected.db[0];
  const isMongo = db === selected.db[1];
  const isNeon = db === selected.db[2];

  try {
    await createDBConfig(isTs, db, appName);
    await createFiles(isTs, appName);
    if (selected.db.includes(db)) {
      if (isMongo) files.push(mongoclient);
      else if (isPostgres) files.push(pgclient);
      else if (isNeon) files.push(neonclient);
    }

    if (ext === ".ts") {
      files.push("tsconfig.json");
    }

    logger.log("\nfiles:\n");
    for (const file of files) {
      log.message(chalk.blueBright(`/${file}`));
    }
    // log.success(chalk.greenBright("Project created successfully!"));
    if (git) {
      await initializeRepo(appName);
    }
    await installPkg(appName);
  } catch (error) {
    logger.error(error);
  }
};

const initializeRepo = async (appName) => {
  try {
    if (appName !== "./") {
      execSync(`cd ${path.resolve(appName)} && git init`, { stdio: "ignore" });
    } else {
      execSync(`git init`, { stdio: "ignore" });
    }
    logger.success("Git repository initialized successfully.");
  } catch (error) {
    logger.error("Error initializing Git repository:", error.message);
  }
};
