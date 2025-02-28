#!/usr/bin/env node

import { Command } from "commander";
import { createApp } from "./src/lib/create.js";
import { updateBatch } from "./src/lib/update-pkg.js";
import { createEnv } from "./src/lib/env.js";
// import { generateKey } from "./src/lib/regenerateKeys.js";

const program = new Command();

program
  .name("nexujs-cli")
  .description("CLI for scaffolding and managing NexuJs apps")
  .version("0.1.33");

program
  .command("update-deps")
  .description(
    "Update all dependencies to their latest versions in the scaffolded project"
  )
  .action(updateBatch);

program
  .command("init")
  .description("Scaffold a new NexuJs app")
  .action(() => createApp.init());

program
  .command("mk env")
  .description("Create a new .env file if it does not already exist")
  .action(async () => {
    console.time("⏳ createEnv took");
    await createEnv();
    console.timeEnd("⏳ createEnv took");
  });
// program
//   .command("rekey")
//   .description("Regenerate rsa keys.")
//   .action(() => generateKey());

program.parse(process.argv);
