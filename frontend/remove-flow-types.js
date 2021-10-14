#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const glob = require("glob");
const babel = require("@babel/core");

const PATTERN = "frontend/src/metabase/visualizations/**/*.{js,jsx}";

glob.sync(PATTERN).map(fileName => {
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
