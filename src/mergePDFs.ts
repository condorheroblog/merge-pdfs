import { fileURLToPath } from "node:url";
import type { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { yellowBright } from "colorette";
import { loadPyodide } from "pyodide";
import fg from "fast-glob";

import { author, name } from "../package.json";

/**
 * @see https://www.uuidgenerator.net/version4
 * UUID v4
 */
export const MERGE_PDF_NAME = "66699f18-ad5a-43c2-a96e-97bddaef0e6b.pdf";
export const MOUNT_DIR = "/" + "991e729a-8f2e-472a-8402-c26bb03b5ea3";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function mergePDFs(entry: string[]) {
	const dir = process.cwd();
	const absolutePathArr = fg.sync(entry, {
		ignore: ["node_modules"],
		onlyFiles: true,
		cwd: dir,
		absolute: true,
	}).filter(file => extname(file) === ".pdf");

	if (absolutePathArr.length < 2) {
		process.stdout.write(yellowBright("At least two PDF files.\n"));
		process.exit(1);
	}

	const pyodide = await loadPyodide({ indexURL: resolve(__dirname, "pyodide") });
	await pyodide.loadPackage("micropip");
	const micropip = pyodide.pyimport("micropip");

	pyodide.FS.mkdir(MOUNT_DIR);
	pyodide.FS.mount(pyodide.FS.filesystems.NODEFS, { root: __dirname }, MOUNT_DIR);
	/**
	 * @see https://github.com/pyodide/pyodide/issues/3246#issuecomment-1312210155
	 * You need to prefix the path with emfs: or it will be treated as a url
	*/
	await micropip.install(`emfs:${MOUNT_DIR}/pyodide/pypdf-3.8.1-py3-none-any.whl`);

	const tempFileNameArr: string[] = [];
	absolutePathArr.forEach((filePath) => {
		const tempFileName = `/${filePath.split("/").join("-")}`;
		tempFileNameArr.push(tempFileName);
		pyodide.FS.writeFile(tempFileName, readFileSync(filePath), { encoding: "utf8" });
	});

	await pyodide.runPythonAsync(`
		from pypdf import PdfWriter
		from json import loads

		writer = PdfWriter()
		writer.add_metadata(
				{
						"/Author": "${author}",
						"/Producer": "pypdf - ${name}",
				}
		)

		for path in loads('${JSON.stringify(tempFileNameArr)}'):
			writer.append(path)

		writer.write("/${MERGE_PDF_NAME}")
		writer.close()
	`);

	const outBuffer: Buffer = pyodide.FS.readFile(`/${MERGE_PDF_NAME}`);

	return outBuffer;
}

export default mergePDFs;
