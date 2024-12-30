#!/usr/bin/env node

import { Command } from "commander";
import { createApp } from "./src/lib/create.js";
import { updateBatch } from "./src/lib/update-pkg.js";

const program = new Command();

program
  .name("turbo-express-cli")
  .description("CLI for scaffolding and managing Turbo-Express apps")
  .version("0.1.0");

// Define the update-deps command to update the dependencies in the current project
program
  .command("update-deps")
  .description(
    "Update all dependencies to their latest versions in the scaffolded project"
  )
  .action(() => {
    updateBatch(); // Calls the updateBatch function from update-pkg.js
  });

// Other commands (e.g., scaffolding a new app)
program
  .command("init")
  .description("Scaffold a new Turbo-Express app")
  .action(() => {
    createApp.init();
  });

program.parse(process.argv);

// import { createApp } from "./src/lib/create.js";

// const runCli = () => {
//   createApp.init();
// };
// runCli();
