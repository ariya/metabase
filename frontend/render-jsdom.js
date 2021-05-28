const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const HTMLContent = `<!DOCTYPE html>
<head>
<script src="http://app/dist/vendor.bundle.js"></script>
<script src="http://app/dist/styles.bundle.js"></script>
<script src="http://app/dist/vizrender.bundle.js"></script>
</head>
<body>
<script>console.log('Bootstrapping with JSDOM')</script>
</body>
</html>`;

class CustomResourceLoader extends jsdom.ResourceLoader {
  fetch(url, options) {
    const fname = "resources/frontend_client/" + url.replace("http://", "");
    const content = fs.readFileSync(fname);
    console.log(`Loading ${fname} -> ${content.length} bytes`);
    return Promise.resolve(content);
  }
}
const resources = new CustomResourceLoader();
const runScripts = "dangerously";
const dom = new JSDOM(HTMLContent, {
  resources,
  runScripts,
  storageQuota: 10000000,
});
