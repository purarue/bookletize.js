#!/usr/bin/env node
/*
 * This is a modified version of ./dist/bookletize.js
 * which runs on the CLI using node
 * e.g.: ./saddlestitch.js input.pdf output.pdf
 */

const PDFLib = require("pdf-lib")
const fs = require('node:fs');

async function createPdf(existingPdfBytes, outputFile, options) {
  const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
  const bookletDoc = await PDFLib.PDFDocument.create();

  options = options || {};
  const { width, height } = pdfDoc.getPages()[0].getSize();

  var pageCount = pdfDoc.getPageCount();
  // console.log(pageCount, "page count");

  // pad to a multiple of 4
  while (pageCount % 4 != 0) {
    let page = pdfDoc.addPage([width, height]);
    pageCount = pdfDoc.getPageCount();
    page.moveTo(width/2, height/2);
    page.drawText("Page " + pageCount, {
      size: 7,
      color: PDFLib.rgb(1,1,1)
    });
  }
  // console.log(pageCount, "pages padded to multiple of 4");
  const origPages = pdfDoc.getPages();
  // console.log(origPages);
  var pageNum = 0;

  // iterate through, plucking out 4 pages at a time and inserting into new sheet
  for (var sheet = 0; sheet < pageCount / 4; sheet++) {

    // this function can be configured in options, and is what fetches the "next" page from the original stack (and removes it)
    let getPage = options.getPage || async function getPage(originalPosition, placement, originalPages, _bookletDoc, _bookletPage) {
      if (originalPages.length > 0) {
        var embeddedPage = await _bookletDoc.embedPage(originalPages.splice(originalPosition,1)[0]);
        _bookletPage.drawPage(embeddedPage, placement);
      }
    }

    // double width, same height:
    const bookletPage = bookletDoc.addPage([width * 2, height]);
    const bookletPage2 = bookletDoc.addPage([width * 2, height]);

    if (options.saddleStitch){
      await getPage(origPages.length-1,{x: 0, y: 0}, origPages, bookletDoc, bookletPage)
      pageNum += 1;

      await getPage(0,{x: width, y: 0}, origPages, bookletDoc, bookletPage)
      pageNum += 1;

      await getPage(0,{x: 0, y: 0}, origPages, bookletDoc, bookletPage2)
      pageNum += 1;

      await getPage(origPages.length-1,{x: width, y: 0}, origPages, bookletDoc, bookletPage2)
      pageNum += 1;

    } else {
      await getPage(3,{x: 0, y: 0}, origPages, bookletDoc, bookletPage)
      pageNum += 1;

      await getPage(0,{x: width, y: 0}, origPages, bookletDoc, bookletPage)
      pageNum += 1;

      await getPage(0,{x: 0, y: 0}, origPages, bookletDoc, bookletPage2)
      pageNum += 1;

      await getPage(0,{x: width, y: 0}, origPages, bookletDoc, bookletPage2)
      pageNum += 1;
    }
  }

  const pdfBytes = await bookletDoc.save();
	fs.writeFileSync(outputFile, pdfBytes)
}

async function main(inputFile, outputFile) {
  const bytes = fs.readFileSync(inputFile)
  createPdf(bytes, outputFile, { saddleStitch: true })
}

function parseArgs() {
  const args = process.argv.slice(2);
  // console.log(args)
  if (args.length < 2) {
    console.error("Must provide input and output file as positional arguments");
    process.exit(1);
  }
  return args
}

if (require.main === module) {
  const args = parseArgs();
  main(args[0], args[1]);
}
