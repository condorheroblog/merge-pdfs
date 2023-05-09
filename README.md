# @condorhero/merge-pdfs

[![NPM version](https://img.shields.io/npm/v/@condorhero/merge-pdfs)](https://www.npmjs.com/package/@condorhero/merge-pdfs)
[![NPM Downloads](https://img.shields.io/npm/dm/@condorhero/merge-pdfs)](https://www.npmjs.com/package/@condorhero/merge-pdfs)
[![GitHub stars](https://img.shields.io/github/stars/condorheroblog/merge-pdfs?style=social)](https://github.com/condorheroblog/merge-pdfs)
[![LICENSE](https://img.shields.io/github/license/condorheroblog/merge-pdfs.svg)](./LICENSE)

Merging PDF (with Outline).

> `Node.js > 18.5.0`.Technical support provided by [pypdf](https://pypdf.readthedocs.io/en/stable/user/merging-pdfs.html).

## motive

In the Javascript world, when merging multiple PDFs with outlines, the outline will be automatically lost. Neither [pdf-lib](https://github.com/Hopding/pdf-lib/issues/341) nor [pdfjs](https://github.com/rkusa/pdfjs/issues/308) solve this problem, and even the PDFCPU that processes PDFs in the GO language world does not support this feature. The reason is that the outline and page are not within the same object of the PDF specification, making copying the outline more complex. However, this feature can be achieved, such as [pypdf](https://pypdf.readthedocs.io/en/stable/user/merging-pdfs.html) in the Python language world.

## Installation

```sh
npm install -D @condorhero/merge-pdfs
```

## Usage

```bash
# The default export file name is merged-pdf.pdf
merge-pdfs 1.pdf 2.pdf

# Customize to Export File Name
merge-pdfs 1.pdf 2.pdf -o custom.pdf

# glob: merge some pdf
merge-pdfs pdf/*.pdf -o merged-pdf.pdf
```

## License

[MIT](https://github.com/condorheroblog/merge-pdfs/blob/main/LICENSE)
