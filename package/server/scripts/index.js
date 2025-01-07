#!/usr/bin/env node

import { Command } from "commander";
import { runDev, runDevTs, start } from "./script.js";

const program = new Command();

program.command("start").description("Start the application").action(start);

program
  .command("dev")
  .description("Run the application in development mode")
  .action(runDev);

program
  .command("dev:ts")
  .description("Run the application in TypeScript development mode")
  .action(runDevTs);

program.parse(process.argv);
