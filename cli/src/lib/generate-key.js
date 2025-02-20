import chalk from "chalk";
import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import path from "path";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spinner = ora();

export const generateRsaKey = async (bits) => {
  spinner.start(chalk.blueBright("🔒 Generating RSA keys..."));

  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, "rsaWorker.js");
    const worker = new Worker(workerPath);

    worker.postMessage(bits);

    worker.on("message", (keys) => {
      spinner.succeed(chalk.greenBright("🔑 RSA keys generated."));
      resolve(keys);
    });

    worker.on("error", (error) => {
      spinner.fail("❌ RSA key generation failed.");
      reject(error);
    });
  });
};
