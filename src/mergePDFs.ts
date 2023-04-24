import { readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";
import { yellowBright } from "colorette";

import fg from "fast-glob";
import { loadPyodide } from "pyodide";

export interface IMAPMergePDFs {
	entry: string[]
	_?: string[]
	o?: string
	output: string
	$0?: string
}

export const MERGE_PDF_NAME = "66699f18-ad5a-43c2-a96e-97bddaef0e6b.pdf";

export const mergePDFs = async ({ entry, output }: IMAPMergePDFs) => {
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

	const pyodide = await loadPyodide({ indexURL: "./node_modules/pyodide" });
	await pyodide.loadPackage("micropip");
	const micropip = pyodide.pyimport("micropip");
	await micropip.install("pypdf");

	const tempFileNameArr: string[] = [];
	absolutePathArr.forEach((filePath) => {
		const tempFileName = `/${filePath.split("/").join("-")}`;
		tempFileNameArr.push(tempFileName);
		pyodide.FS.writeFile(tempFileName, readFileSync(filePath), { encoding: "utf8" });
	});

	await pyodide.runPythonAsync(`
		from pypdf import PdfWriter
		from json import loads

		merger = PdfWriter()

		for path in loads('${JSON.stringify(tempFileNameArr)}'):
			merger.append(path)

		merger.write("/${MERGE_PDF_NAME}")
		merger.close()
	`);

	const outBuffer = pyodide.FS.readFile(`/${MERGE_PDF_NAME}`);

	if (!output.endsWith(".pdf"))
		output += ".pdf";

	writeFileSync(output, outBuffer);
	return outBuffer;
};
