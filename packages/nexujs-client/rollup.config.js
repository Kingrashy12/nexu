import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import esbuild from "rollup-plugin-esbuild";
import { visualizer } from "rollup-plugin-visualizer";
import del from "rollup-plugin-delete";
import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "es",
      sourcemap: false,
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
      sourcemap: false,
    },
  ],
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
  external: ["axios", "path", "node-forge", "dotenv/config", "dotenv"],
};
