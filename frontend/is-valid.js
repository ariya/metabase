#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const glob = require("glob");
const parser = require("@babel/parser");

const PATTERN = "frontend/src/metabase/visualizations/**/*.{js,jsx}";

glob.sync(PATTERN).map(fileName => {
  const contents = fs.readFileSync(fileName, "utf-8");
  const options = {
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    decoratorsBeforeExport: true,
    sourceType: "unambiguous",
    plugins: ["jsx", "typescript", "decorators-legacy", "exportDefaultFrom"],
  };
  try {
    parser.parse(contents, options);
  } catch (e) {
    console.error("ERROR", fileName, e.toString());
  }
});
