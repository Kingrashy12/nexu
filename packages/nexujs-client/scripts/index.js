#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import tmColor from "./tm-color.js";

const configData = `import { NexuClient } from "nexujs-client";

const publicKey = String("your_publicKey");
const privateKey = String("your_privateKey");

const client = new NexuClient({
  privateKey,
  publicKey,
});

export default client;
`;

/**
 * Creates the "constants" directory path if it doesn't exist.
 * @returns {string} The path to the constants directory.
 */
const getPath = () => {
  const cwd = process.cwd();
  const srcDir = path.join(cwd, "src");
  const constantsPath = existsSync(srcDir)
    ? path.join(srcDir, "constants")
    : path.join(cwd, "constants");

  if (!existsSync(constantsPath)) {
    mkdirSync(constantsPath, { recursive: true });
    console.log(tmColor.green(`Created directory: ${constantsPath}`));
  }
  return constantsPath;
};

/**
 * Creates a Nexu client configuration file in the root directory.
 */
async function createConfig() {
  const cwd = process.cwd();
  const tsconfig = path.join(cwd, "tsconfig.json");
  const isTs = existsSync(tsconfig);
  const ext = isTs ? ".ts" : ".js";

  const fileName = `nexu.client${ext}`;
  const dir = getPath();
  const filePath = path.join(dir, fileName);

  try {
    if (!existsSync(filePath)) {
      writeFileSync(filePath, configData);
      console.log(tmColor.green(`Added ${fileName}`));
    } else {
      console.log(tmColor.blue(`${fileName} already exists`));
    }
  } catch (error) {
    console.error(tmColor.red(`Error creating config: ${error.message}`));
  }
}

createConfig();
