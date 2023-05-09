import { describe, expect, it } from "vitest";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Parser from "pdfjs/lib/parser/parser";
import { mergePDFs } from "../src";

describe("mergePDFs function", () => {
	it("merging two PDF's Named Destination", async () => {
		const data = await mergePDFs(["./__test__/pdfs/book.pdf", "./__test__/pdfs/food.pdf"]);
		const parser = new Parser(data);
		parser.parse();
		const catalog = parser.trailer.get("Root").object.properties;
		const names = catalog.get("Names").object.properties;
		expect(!!names).toBeTruthy();
	});
});
