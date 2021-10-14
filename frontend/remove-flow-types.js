#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const glob = require("glob");
const parser = require("@babel/parser");
const babel = require("@babel/core");

const PATTERN = "{enterprise/,}frontend/src/**/*.{js,jsx}";

const candidates = [];

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
    candidates.push(fileName);
  }
});

candidates.map(fileName => {
  console.log(fileName);
  const contents = fs.readFileSync(fileName, "utf-8");
  try {
    const transformed = babel.transformSync(contents, {
      plugins: [
        "@babel/plugin-transform-flow-strip-types",
        "@babel/plugin-syntax-jsx",
        ["@babel/plugin-syntax-decorators", { legacy: true }],
      ],
    });
    const output = transformed.code;
    fs.writeFileSync(fileName, output, "utf-8");
  } catch (e) {
    console.error("ERROR", e.toString());
  }
});
