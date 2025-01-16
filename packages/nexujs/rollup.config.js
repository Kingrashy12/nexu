import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import esbuild from "rollup-plugin-esbuild";
import { visualizer } from "rollup-plugin-visualizer";
import del from "rollup-plugin-delete";
import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";

const externalDeps = [
  "path",
  "fs",
  "chalk",
  "dotenv",
  "commander",
  "concurrently",
  "cors",
  "node-rsa",
  "helmet",
  "express",
  "body-parser",
  "node-forge",
  "express-rate-limit",
];

export default [
  {
    input: "src/index.ts", // Entry point
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.js",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      del({ targets: "dist/*" }),
      resolve(),
      PeerDepsExternalPlugin(),
      commonjs(),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
        // declarationDir: "./dist/esm"
      }),
      esbuild({ minify: true }),
      visualizer({ open: true }),
    ],
    external: externalDeps,
  },
];
