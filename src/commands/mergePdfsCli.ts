import { join } from "node:path";
import { writeFileSync } from "node:fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { greenBright } from "colorette";

import { mergePDFs } from "../";
import { name, version } from "../../package.json";

export async function mergePdfsCli() {
	const program = yargs(hideBin(process.argv)).scriptName(name)
		.usage("$0 <entry...>")
		.option("o", {
			alias: "output",
			default: "merged-pdf.pdf",
			describe: "Output file",
			type: "string",
			demandOption: false,
		})
		.example([
			["$0 1.pdf 2.pdf", "Merge two PDFs files"],
			["$0 1.pdf 2.pdf -o merged-pdf.pdf", "Merge two PDFs files into merged-pdf.pdf file"],
			["$0 pdfs/*.pdf -o merged-pdf.pdf", "Merge some PDFs files into merged-pdf.pdf file"],
		])
		.showHelpOnFail(false)
		.alias("h", "help")
		.version("version", version)
		.alias("v", "version")
		.help();
	const argv = await program.argv;
	const entry = argv._;
	let output = argv.o;

	const outBuffer = await mergePDFs(entry as string[]);
	if (!output.endsWith(".pdf"))
		output += ".pdf";

	writeFileSync(output, outBuffer);
	process.stdout.write(greenBright(`\n Saved to ${join(process.cwd(), argv.o)}\n`));
}
