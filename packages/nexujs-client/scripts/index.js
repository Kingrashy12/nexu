#!/usr/bin/env node

import { existsSync, writeFileSync } from "fs";
import path from "path";
import tmColor from "./tm-color.js";

const configData = `import { defineConfig } from "nexujs-client";

export default defineConfig({
  /* Define your config here */
})
`;

async function createConfig() {
  const cwd = process.cwd();
  const tsconfig = path.join(cwd, "/tsconfig.json");
  const isTs = existsSync(tsconfig);
  const ext = isTs ? ".ts" : ".js";

  const fileName = `nexu.config${ext}`;
  const filePath = path.join(cwd, fileName);
  try {
    if (!existsSync(path.join(cwd, filePath))) {
      await writeFileSync(filePath, configData);
      console.log(tmColor.green(`Added ${fileName}`));
    } else {
      console.log(tmColor.blue(`nexu.config${ext} already exits`));
    }
  } catch (error) {
    console.log(tmColor.red("Error creating config:", error.message));
  }
}

createConfig();
