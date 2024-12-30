import { cancel, isCancel, log, select, text } from "@clack/prompts";
import { createPath, folders } from "../config/file.js";
import chalk from "chalk";
import { handleFiles } from "../config/handle.js";
import { logger } from "../logger.js";
import { selected } from "../config/select.js";

class CreateApp {
  projectName = "";
  selectedDb = "";
  selectedLang = "";

  async #askProjectName() {
    const project_name = await text({
      message: "What is your project name?",
      placeholder: "turbo-app",
      defaultValue: "turbo-app",
    });
    this.projectName = project_name;
  }

  async #askDBOptions() {
    const db_option = await select({
      message: "Which database would you like to use?",
      options: [
        { value: "mongodb", label: "MongoDB" },
        { value: "postgresql", label: "PostgreSQL" },
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

  async #handleDir() {
    await createPath(this.projectName);
    await createDir(this.projectName, this.selectedDb);
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

    await this.#handleDir();

    await handleFiles(this.selectedLang, this.selectedDb, this.projectName);

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
