import chalk from "chalk";

interface Logger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warning: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  success: (...args: unknown[]) => void;
  highlight: (...args: unknown[]) => void;
  bright: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

export const logger: Logger = {
  log: (...args: unknown[]) => console.log(chalk.gray(...args)),
  info: (...args: unknown[]) => console.log(chalk.blueBright(...args)),
  warning: (...args: unknown[]) => console.log(chalk.yellow(...args)),
  error: (...args: unknown[]) => console.log(chalk.redBright(...args)),
  success: (...args: unknown[]) => console.log(chalk.green(...args)),
  highlight: (...args: unknown[]) => console.log(chalk.bgCyanBright(...args)),
  bright: (...args: unknown[]) => console.log(chalk.white(...args)),
  debug: console.log,
};
