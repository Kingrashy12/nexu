import { Config } from "@/types";
import { existsSync, readFileSync } from "fs";
import path from "path";

export const readConfig = () => {
  const tsConfig = path.join(process.cwd(), "/tsconfig.json");
  const extention = existsSync(tsConfig) ? ".ts" : ".js";
  const dir = path.join(process.cwd(), `/nexu.config${extention}`);
  const impt = 'import { defineConfig } from "nexujs";';

  try {
    const content = readFileSync(dir, "utf-8");
    const trimed = content.replace(impt, "").trim().replace(/\s+/g, "").trim();
    const match = trimed.match(/\{.*\}/)?.[0];
    if (match) {
      const configObj: Config = new Function(`return ${match}`)();
      return { ...configObj };
    } else {
      console.log("Invalid config file");
      return;
    }
  } catch (error) {
    console.error("error reading config:", error);
  }
};
