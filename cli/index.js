#!/usr/bin/env node

import { Command } from "commander";
import { createApp } from "./src/lib/create.js";
import { updateBatch } from "./src/lib/update-pkg.js";

const program = new Command();

program
  .name("nexujs-cli")
  .description("CLI for scaffolding and managing NexuJs apps")
  .version("0.1.18");

program
  .command("update-deps")
  .description(
    "Update all dependencies to their latest versions in the scaffolded project"
  )
  .action(() => {
    updateBatch();
  });

program
  .command("init")
  .description("Scaffold a new NexuJs app")
  .action(() => {
    createApp.init();
  });

program.parse(process.argv);
