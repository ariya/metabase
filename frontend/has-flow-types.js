#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const glob = require("glob");
const parser = require("@babel/parser");

const PATTERN = "{enterprise/,}frontend/src/**/*.{js,jsx}";

glob.sync(PATTERN).map(fileName => {
  const contents = fs.readFileSync(fileName, "utf-8");
  const options = {
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    decoratorsBeforeExport: true,
    sourceType: "unambiguous",
    plugins: ["jsx", "decorators-legacy", "exportDefaultFrom"],
  };
  try {
    parser.parse(contents, options);
  } catch (e) {
    console.log(fileName);
  }
});
