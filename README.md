Bookletize.js
========

JavaScript widget that reformats PDFs into signatures for making bound paper booklets. Print the resulting PDF, fold the stack in half and staple along the spine to form a **saddle stitch booklet**, or fold and stack sheets individually then glue the spine for a **perfect binding**.

Demo: https://jywarren.github.io/bookletize.js

NPM: http://npmjs.com/package/bookletize.js

---

This provides a CLI script `saddlestitch.js` and a `Makefile` to help install it.

```
cd ~/.cache
git clone https://github.com/purarue/bookletize.js
cd ./bookletize.js
make
make install
```

That installs a script called `saddlestitch`:

```
Converts a pdf to saddlestitch (zine) format

Usage:
  saddlestitch <INPUT_PDF> <OUTPUT_PDF>

Examples:
  saddlestitch input.pdf output.pdf
```
