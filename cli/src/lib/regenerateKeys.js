import NodeRSA from "node-rsa";
import path from "path";
import { appendFile, readFile, writeFile } from "fs/promises";
import ora from "ora";
import chalk from "chalk";
import { select } from "@clack/prompts";
import { logger } from "../logger.js";

const spinner = ora();

const generateNewKeys = async () => {
  logger.warning(
    "Before regenerating a new key, make sure to decrypt your old data using the old key.\
    \nFailure to do so may result in losing access to your encrypted data."
  );

  const generationChoice = await select({
    message: "How would you like to proceed with the key generation?",
    options: [
      { value: "new", label: "New", hint: "Recommended" },
      {
        value: "override",
        label: "Override",
      },
    ],
  });

  const bits = await select({
    message: "What key length would you prefer for RSA key generation?",
    options: [
      {
        value: 2048,
        label: "2048",
        hint: "Recommended for moderate security",
      },
      { value: 3072, label: "3072", hint: "High security" },
      {
        value: 4096,
        label: "4096",
        hint: "Very high security, may affect performance",
      },
    ],
  });
  if (bits) {
    spinner.start(chalk.blueBright("\n🔒 Regenerating keys..."));
    const key = new NodeRSA({ b: Number(bits) });
    return {
      publicKey: key.exportKey("public"),
      privateKey: key.exportKey("private"),
      generationChoice,
    };
  } else return;
};

const envPath = path.join(process.cwd(), ".env");

const updateEnvFileAsync = async () => {
  const { publicKey, privateKey, generationChoice } = await generateNewKeys();

  // Read the current .env content
  const envContent = await readFile(envPath, "utf-8");

  let updatedContent = "";

  if (generationChoice === "new") {
    updatedContent = `\nNEXU_PUBLIC_KEY_NEW="${publicKey}"\nNEXU_PRIVATE_KEY_NEW="${privateKey}"`;
  } else if (generationChoice === "override") {
    updatedContent = envContent
      .replace(
        /^NEXU_PUBLIC_KEY="(?:[^"]|\n)*"$/gm,
        `NEXU_PUBLIC_KEY="${publicKey}"`
      )
      .replace(
        /^NEXU_PRIVATE_KEY="(?:[^"]|\n)*"$/gm,
        `NEXU_PRIVATE_KEY="${privateKey}"`
      );
  }

  const cleanedContent = updatedContent.replace(/^\s*[\r\n]/gm, "");

  if (generationChoice === "new") {
    await appendFile(envPath, `\n${cleanedContent}`, "utf-8");
  } else {
    await writeFile(envPath, cleanedContent, "utf-8");
  }
  spinner.succeed(chalk.greenBright("\n✅ Keys regenerated and .env updated."));
};

export const generateKey = async () => {
  try {
    await updateEnvFileAsync();
  } catch (error) {
    spinner.fail(
      chalk.redBright("\n❌ Error regenerating keys:", error.message)
    );
  }
};
