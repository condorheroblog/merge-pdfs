import { copy } from "esbuild-plugin-copy";
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
			assets: {
				from: "./src/pyodide/**/*",
				to: "./pyodide",
			},
		}),
	],
});
