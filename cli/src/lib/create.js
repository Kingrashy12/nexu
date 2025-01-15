import { cancel, isCancel, log, select, text } from "@clack/prompts";
import { createPath, createRootPath, folders } from "../config/file.js";
import chalk from "chalk";
import { handleFiles } from "../config/handle.js";
import { logger } from "../logger.js";
import { selected } from "../config/select.js";

class CreateApp {
  projectName = "";
  selectedDb = "";
  selectedLang = "";
  initGit = true;
  useJest = false;

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
        { value: "neon", label: "Neon", hint: "Soon" },
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

  async #askJest() {
    const jest = await select({
      message: "Do you want to use Jest for testing?",
      options: [
        { value: true, label: "Yes", hint: "Soon" },
        { value: false, label: "No" },
      ],
    });
    this.useJest = jest;
  }

  async #handleDir() {
    await createRootPath(this.projectName);
    await createDir(this.projectName, this.selectedDb);
  }

  #success(name) {
    console.log(`${chalk.whiteBright("Done. Now run")}

${chalk.greenBright(name && `\cd ${this.projectName} && `)}npm run dev
    `);
  }

  async init() {
    await this.#askProjectName();
    if (isCancel(this.projectName)) {
      cancel("Process closed: Project name input was cancelled.");
      process.exit(0);
    }

    await this.#askLanguage();
    if (isCancel(this.selectedLang)) {
      cancel("Process closed: Language selection was cancelled.");
      process.exit(0);
    }

    await this.#askDBOptions();
    if (isCancel(this.selectedDb)) {
      cancel("Process closed: Database selection was cancelled.");
      process.exit(0);
    }

    await this.#askGitInit();
    if (isCancel(this.selectedDb)) {
      cancel("Process closed: Git init was cancelled.");
      process.exit(0);
    }

    await this.#askJest();
    if (isCancel(this.selectedDb)) {
      cancel("Process jest: Git init was cancelled.");
      process.exit(0);
    }

    await this.#handleDir();

    await handleFiles(
      this.selectedLang,
      this.selectedDb,
      this.projectName,
      this.initGit
    );

    logger.success(
      chalk.green(`\nProject "${this.projectName}" created successfully 🎉`)
    );
    const name = this.projectName !== "./" ? this.projectName : "";
    this.#success(name);

    if (!this.projectName || !this.selectedLang || !this.selectedDb) {
      log.warning("Missing required inputs. Please try again.");
      process.exit(1);
    }
  }
}

export const createApp = new CreateApp();

const createDir = async (sub, db) => {
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
