import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import esbuild from "rollup-plugin-esbuild";
import { visualizer } from "rollup-plugin-visualizer";
import del from "rollup-plugin-delete";
import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";

export default {
  input: "src/index.ts", // Entry point
  output: {
    file: "dist/index.js", // Output file
    format: "es", // CommonJS for backend
    sourcemap: false,
  },
  plugins: [
    del({ targets: "dist/*" }),
    resolve(),
    PeerDepsExternalPlugin(),
    commonjs(),
    json(),
    typescript({ tsconfig: "./tsconfig.json" }),
    esbuild({ minify: true }),
    visualizer({ open: true }),
  ],
  external: [
    "path",
    "fs",
    "chalk",
    "dotenv",
    "commander",
    "concurrently",
    "cors",
    "crypto-js",
  ],
};
