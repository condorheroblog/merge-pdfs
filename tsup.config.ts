import copy from "esbuild-copy-files-plugin";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.ts", "!src/pyodide"],
	dts: true,
	format: ["cjs", "esm"],
	// legacyOutput: true,
	shims: true,
	clean: true,
	esbuildPlugins: [
		copy({
			source: ["./src/pyodide"],
			target: "./dist",
			copyWithFolder: true,
		}),
	],
});
