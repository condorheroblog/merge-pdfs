import { PKG_NAME } from "../constants";
import { mergePdfsCli } from "./mergePdfsCli";

export function runCli(programName: string) {
	if (programName === PKG_NAME)
		mergePdfsCli();
}
