import { cancel, isCancel, log, select, spinner, text } from "@clack/prompts";
import { createPath, createRootPath, folders } from "../config/file.js";
import chalk from "chalk";
import { handleFiles } from "../config/handle.js";
import { logger } from "../logger.js";
import { selected } from "../config/select.js";
import { fetchFiles } from "../config/fetch-files.js";
import { generateRsaKey } from "./generate-key.js";
import "./global.js";

const Spinner = spinner();

class CreateApp {
  projectName = "";
  selectedDb = "";
  selectedLang = "";
  initGit = true;
  bits = 2048;
  public_key;
  private_key;

  async #askProjectName() {
    const project_name = await text({
      message: "What is your project name?",
      placeholder: "nexu-app",
      defaultValue: "nexu-app",
    });
    this.projectName = project_name;
  }

  async #askDBOptions() {
    const db_option = await select({
      message: "Which database would you like to use?",
      options: [
        { value: "mongodb", label: "MongoDB" },
        { value: "postgresql", label: "PostgreSQL" },
        { value: "neon", label: "Neon" },
        { value: "others", label: "Others" },
      ],
    });
    this.selectedDb = db_option;
  }

  async #askLanguage() {
    const lang_options = await select({
      message: "Would you like to use Typescript?",
      options: [
        { value: "yes", label: "Yes", hint: "Recommended" },
        { value: "no", label: "No" },
      ],
    });
    this.selectedLang = lang_options;
  }

  async #askGitInit() {
    const git = await select({
      message: "Would you like to initialize a git repo",
      options: [
        { value: true, label: "Yes", hint: "Default" },
        { value: false, label: "No" },
      ],
    });
    this.initGit = git;
  }

  async #askBits() {
    const bits = await select({
      message: "Select RSA key length:",
      options: [
        { value: 2048, label: "2048 (Recommended)" },
        { value: 3072, label: "3072 (High Security)" },
        { value: 4096, label: "4096 (Very High Security, may be slow)" },
      ],
    });
    this.bits = bits;
  }

  async #generateKeys() {
    const { publicKey, privateKey } = await generateRsaKey(this.bits);
    this.public_key = publicKey;
    this.private_key = privateKey;
  }

  createDir = async (sub, db) => {
    try {
      if (selected.db.includes(db)) {
        folders.push("config");
      }
      for (const dir of folders) {
        createPath(`${sub}/${dir}`);
      }
      logger.log("\nfolders:\n");
      for (const dir of folders) {
        log.message(chalk.blueBright(`/${dir}`));
      }
    } catch (error) {
      logger.error(error);
    }
  };

  async #handleDir() {
    await createRootPath(this.projectName);
    await this.createDir(this.projectName, this.selectedDb);
  }

  #success(name) {
    console.log(`${chalk.whiteBright("Done. Now run")}

${chalk.greenBright(name && `\cd ${this.projectName} && `)}npm run dev
    `);

    process.exit(0);
  }

  async init() {
    try {
      log.info(chalk.green("🚀 Starting project creation..."));

      await this.#askProjectName();
      if (isCancel(this.projectName)) {
        cancel(
          chalk.red("❌ Process closed: Project name input was cancelled.")
        );
        process.exit(0);
      }

      await this.#askLanguage();
      if (isCancel(this.selectedLang)) {
        cancel(
          chalk.red("❌ Process closed: Language selection was cancelled.")
        );
        process.exit(0);
      }

      await this.#askDBOptions();
      if (isCancel(this.selectedDb)) {
        cancel(
          chalk.red("❌ Process closed: Database selection was cancelled.")
        );
        process.exit(0);
      }

      await this.#askGitInit();
      if (isCancel(this.initGit)) {
        cancel(chalk.red("❌ Process closed: Git init was cancelled."));
        process.exit(0);
      }

      await this.#askBits();
      if (isCancel(this.bits)) {
        cancel(
          chalk.red(
            "❌ Process closed: RSA key length selection was cancelled."
          )
        );
        process.exit(0);
      }

      await this.#generateKeys();
      await this.#downloadBoilerPlates();
      await this.#handleDir();

      Spinner.start(
        `📂 Creating project: ${chalk.blueBright(this.projectName)}...`
      );

      await handleFiles(
        this.selectedLang,
        this.selectedDb,
        this.projectName,
        this.initGit,
        this.public_key,
        this.private_key
      );

      Spinner.stop(
        chalk.green(`✅ Project "${this.projectName}" created successfully 🎉`)
      );

      const name = this.projectName !== "./" ? this.projectName : "";
      this.#success(name);

      if (!this.projectName || !this.selectedLang || !this.selectedDb) {
        log.warning("Missing required inputs. Please try again.");
        process.exit(1);
      }
    } catch (error) {
      Spinner.stop(chalk.red("❌ Something went wrong."));
      log.error(chalk.red(`▲ Error: ${error}`));
      process.exit(1);
    }
  }

  async #downloadBoilerPlates() {
    const boilerplates = await fetchFiles();
    globalThis.boilerplates = boilerplates;
  }
}

export const createApp = new CreateApp();
