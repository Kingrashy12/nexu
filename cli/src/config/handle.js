import { log, spinner } from "@clack/prompts";
import { dbConfig, envFile } from "../../boilerplate/files/db.config.js";
import {
  gitignore,
  helloRoute,
  mainFile,
  nexuConfig,
  readmeFile,
  tsconfigFile,
} from "../../boilerplate/files/files.js";
import { getPkg } from "../../boilerplate/pkg/main.js";
import { getPkgWithDB } from "../../boilerplate/pkg/with-db.js";
import { logger } from "../logger.js";
import { createFile } from "./file.js";
import { selected } from "./select.js";
import chalk from "chalk";
import { installPkg } from "./deps.js";
import { execSync } from "child_process";
import path from "path";

export const Files = (appName) => {
  const name = appName === "./" ? "nexu-server" : appName;

  const pkg = getPkg(name).js;
  const pkgTs = getPkg(name).ts;

  const mongoMain = getPkgWithDB(name).mongoMain;
  const mongoTs = getPkgWithDB(name).mongoTs;

  const pgMain = getPkgWithDB(name).pgMain;
  const pgTs = getPkgWithDB(name).pgTs;

  const serverFile = mainFile;

  const tscFile = tsconfigFile;

  const configFile = dbConfig();

  const envContent = envFile();

  return {
    pgMain,
    pgTs,
    mongoMain,
    mongoTs,
    pkg,
    pkgTs,
    serverFile,
    envContent,
    configFile,
    tscFile,
  };
};

const handlePkg = (pkg, attr) => {
  const Parsed = JSON.parse(pkg);
  const pk = Object.keys(Parsed[attr]).map((dep) => dep.split(":")[0]);
  return pk;
};

export const handleFiles = async (isTs, db, appName, git) => {
  const files = Files(appName);
  const isMongo = db === selected.db[1];
  const isPostgres = db === selected.db[0];

  if (isMongo) {
    switch (isTs) {
      case "yes":
        await createPkgFile(appName, files.mongoTs);
        break;
      case "no":
        await createPkgFile(appName, files.mongoMain);
        break;
    }
  } else if (isPostgres) {
    switch (isTs) {
      case "yes":
        await createPkgFile(appName, files.pgTs);
        break;
      case "no":
        await createPkgFile(appName, files.pgMain);
        break;
    }
  } else {
    switch (isTs) {
      case "yes":
        await createPkgFile(appName, files.pkgTs);
        break;
      case "no":
        await createPkgFile(appName, files.pkg);
        break;
    }
  }
  await addFiles(isTs, appName, db, git);
};

const createPkgFile = async (appName, content) => {
  const logDeps = (deps) => {
    for (const dep of deps) {
      log.message(chalk.blueBright(`- ${dep}`));
    }
  };
  try {
    await createFile(`${appName}/package.json`, content);
    const deps = handlePkg(content, "dependencies");
    const Devdeps = handlePkg(content, "devDependencies");
    logger.log("\ndependencies:\n");
    logDeps(deps);
    logger.log("\ndevDependencies:\n");
    logDeps(Devdeps);
  } catch (error) {
    logger.error(error.message);
  }
};

const createDBConfig = async (isTs, db, appName) => {
  const isMongo = db === selected.db[1];
  const isPostgres = db === selected.db[0];
  const path = `${appName}/config`;
  const envPath = `${appName}/.env`;
  const files = Files(appName);

  if (isPostgres) {
    switch (isTs) {
      case "yes":
        await createFile(`${path}/postgresClient.ts`, files.configFile.pg);
        break;
      case "no":
        await createFile(`${path}/postgresClient.js`, files.configFile.pg);
        break;
    }
    await createFile(envPath, files.envContent.pg);
  } else if (isMongo) {
    switch (isTs) {
      case "yes":
        await createFile(`${path}/mongoClient.ts`, files.configFile.mongo);
        break;
      case "no":
        await createFile(`${path}/mongoClient.js`, files.configFile.mongo);
        break;
    }
    await createFile(envPath, files.envContent.mongo);
  } else {
    await createFile(envPath, files.envContent.main);
  }
};

const createFiles = async (isTs, appName) => {
  const ext = isTs === "yes" ? ".ts" : ".js";

  await createFile(
    `${appName}/routes/hello${ext}`,
    ext === ".ts" ? helloRoute.tsRoute : helloRoute.jsRoute
  );
  await createFile(`${appName}/server${ext}`, mainFile);
  await createFile(`${appName}/.gitignore`, gitignore);
  await createFile(`${appName}/nexu.config${ext}`, nexuConfig);
  await createFile(`${appName}/README.md`, readmeFile);
  if (ext === ".ts") {
    await createFile(`${appName}/tsconfig.json`, tsconfigFile);
  }
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
  const mongoclient = `config/mongoClient${ext}`;
  const pgclient = `config/postgresClient${ext}`;
  const isMongo = db === selected.db[1];
  const isPostgres = db === selected.db[0];

  try {
    await createDBConfig(isTs, db, appName);
    await createFiles(isTs, appName);
    if (selected.db.includes(db)) {
      if (isMongo) files.push(mongoclient);
      else if (isPostgres) files.push(pgclient);
    }

    if (ext === ".ts") {
      files.push("tsconfig.json");
    }

    logger.log("\nfiles:\n");
    for (const file of files) {
      log.message(chalk.blueBright(`/${file}`));
    }
    log.success(chalk.greenBright("Project created successfully!"));
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
      // Initialize Git in the specified directory
      execSync(`cd ${path.resolve(appName)} && git init`, { stdio: "ignore" });
    } else {
      // Initialize Git in the current directory
      execSync(`git init`, { stdio: "ignore" });
    }
    logger.success("Git repository initialized successfully.");
  } catch (error) {
    logger.error("Error initializing Git repository:", error.message);
  }
};
