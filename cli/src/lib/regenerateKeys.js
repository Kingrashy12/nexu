import NodeRSA from "node-rsa";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import ora from "ora";
import chalk from "chalk";
import { select } from "@clack/prompts";

const spinner = ora();

const generateNewKeys = async () => {
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
    };
  } else return;
};

const envPath = path.join(process.cwd(), ".env");

const updateEnvFileAsync = async () => {
  const { publicKey, privateKey } = await generateNewKeys();
  const envContent = await readFile(envPath, "utf-8");
  const updatedContent = envContent
    .replace(
      /^NEXU_PUBLIC_KEY="(?:[^"]|\n)*"$/gm,
      `NEXU_PUBLIC_KEY="${publicKey}"`
    )
    .replace(
      /^NEXU_PRIVATE_KEY="(?:[^"]|\n)*"$/gm,
      `NEXU_PRIVATE_KEY="${privateKey}"`
    );

  const cleanedContent = updatedContent.replace(/^\s*[\r\n]/gm, "");
  await writeFile(envPath, cleanedContent, "utf-8");
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
