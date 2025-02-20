import { select } from "@clack/prompts";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { logger } from "../logger.js";
import { generateRsaKey } from "./generate-key.js";

const envPath = path.join(process.cwd(), ".env");

/**
 * Reads package.json and extracts dependencies.
 */
const handlePkg = () => {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (!existsSync(packageJsonPath)) return [];

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  return Object.keys(packageJson.dependencies || {});
};

/**
 * Generates the appropriate .env content based on detected dependencies.
 */
const handleContent = (deps, public_key, private_key) => {
  let envVariables = `NEXU_PUBLIC_KEY="${public_key}"
NEXU_PRIVATE_KEY="${private_key}"

# Do not use this in production
NODE_ENV="development"`;

  if (deps.includes("pg")) {
    envVariables += `

PG_USER=YourUserName
PG_DB=YourDatabase
PG_PASS=YourPassword
PG_HOST=YourHost`;
  }

  if (deps.includes("mongoose")) {
    envVariables += `

DB_STRING=YourConnectionString`;
  }

  return envVariables;
};

/**
 * Asynchronously generates RSA keys.
 */
const generateKey = async () => {
  const bits = await select({
    message: "Select RSA key length:",
    options: [
      { value: 2048, label: "2048 (Recommended)" },
      { value: 3072, label: "3072 (High Security)" },
      { value: 4096, label: "4096 (Very High Security, may be slow)" },
    ],
  });

  if (!bits) return null;

  const keys = await generateRsaKey(bits);
  return keys;
};

/**
 * Main function to create the .env file.
 */
export const createEnv = async () => {
  if (existsSync(envPath)) {
    logger.info(".env already exists in your project");
    return;
  }

  const keyPair = await generateKey();
  if (!keyPair) {
    logger.error("\n❌ Key generation was cancelled.");
    return;
  }

  const deps = handlePkg();
  const content = handleContent(deps, keyPair.publicKey, keyPair.privateKey);

  try {
    writeFileSync(envPath, content, "utf-8");
    logger.success("\n✅ .env has been successfully created.\n");
    process.exit(0);
  } catch (error) {
    logger.error("\n❌ Error creating .env:", error.message);
    process.exit(0);
  }
};
