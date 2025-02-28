import { log } from "@clack/prompts";
import { logger } from "../logger.js";
import { createFile } from "./file.js";
import chalk from "chalk";

const handlePkg = (pkg, attr) => {
  const Parsed = JSON.parse(pkg);
  const pk = Object.keys(Parsed[attr]).map((dep) => dep.split(":")[0]);
  return pk;
};

export const createPkgFile = async (appName, content) => {
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

export const createFiles = async (isTs, appName) => {
  const ext = isTs === "yes" ? ".ts" : ".js";

  await createFile(
    `${appName}/routes/hello${ext}`,
    ext === ".ts"
      ? globalThis.boilerplates.typescripts["hello-route"]
      : globalThis.boilerplates.javascripts["hello-route"]
  );
  await createFile(
    `${appName}/server${ext}`,
    globalThis.boilerplates.common.server
  );
  await createFile(
    `${appName}/.gitignore`,
    globalThis.boilerplates.common.gitignore
  );
  await createFile(
    `${appName}/nexu.config${ext}`,
    globalThis.boilerplates.common["app-config"]
  );
  await createFile(
    `${appName}/README.md`,
    globalThis.boilerplates.common.readme
  );
  if (ext === ".ts") {
    await createFile(
      `${appName}/tsconfig.json`,
      globalThis.boilerplates.typescripts.tsconfig
    );
  }
};
