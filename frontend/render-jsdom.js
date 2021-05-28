const fs = require("fs");
const { Script } = require("vm");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const HTMLContent = `<!DOCTYPE html></html>`;

const dom = new JSDOM(HTMLContent, { runScripts: "dangerously" });
const vmContext = dom.getInternalVMContext();

new Script("console.log('Bootstrapping with JSDOM')").runInContext(vmContext);
