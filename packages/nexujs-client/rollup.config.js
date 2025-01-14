import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import { visualizer } from "rollup-plugin-visualizer";
import del from "rollup-plugin-delete";
import PeerDepsExternalPlugin from "rollup-plugin-peer-deps-external";
import esbuild from "rollup-plugin-esbuild";

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
    resolve({ browser: true }),
    PeerDepsExternalPlugin(),
    commonjs(),
    json(),
    typescript({ tsconfig: "./tsconfig.json" }),
    esbuild({ minify: true }),
    visualizer({ open: false }),
  ],
  external: ["axios", "node-forge"],
};
