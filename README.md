After switching to this branch:

```
yarn build:cljs
yarn build:js
```

This will create, among others, the following files:

```
resources/frontend_client/app/dist/vendor.bundle.js
resources/frontend_client/app/dist/styles.bundle.js
resources/frontend_client/app/dist/vizrender.bundle.js
```

The last one is a custom addition, generated from `frontend/src/metabase/vizrender.js`.

Then run the following, which will load the above bundles in a simulated browser environment [using JSDOM](https://www.npmjs.com/package/jsdom):

```
node frontend/render-jsdom.js
```

You should see some console error messages (akin to the one appearing on browser Dev Tools):

```
Loading resources/frontend_client/app/dist/vendor.bundle.js -> 11177756 bytes
Loading resources/frontend_client/app/dist/styles.bundle.js -> 5347 bytes
Loading resources/frontend_client/app/dist/vizrender.bundle.js -> 7332376 bytes
JSDOM Error Warning: Each child in a list should have a unique "key" prop.%s%s See https://fb.me/react-warning-keys for more information.%s
JSDOM Error Warning: Failed prop type: The prop `onRenderError` is marked as required in `CardRenderer`, but its value is `undefined`.
    in CardRenderer (created by CardRenderer)
    in CardRenderer (created by LineAreaBarChart)
    in div (created by LineAreaBarChart)
    in LineAreaBarChart
JSDOM Error TypeError: Cannot read property 'data' of undefined
    at checkSeriesIsValid (file://resources/frontend_client/app/dist/vizrender.bundle.js:8308:58)
    at lineAreaBar (file://resources/frontend_client/app/dist/vizrender.bundle.js:9161:3)
    at Object.barRenderer [as renderer] (file://resources/frontend_client/app/dist/vizrender.bundle.js:9277:10)
    at CardRenderer.renderChart (file://resources/frontend_client/app/dist/vizrender.bundle.js:100020:39)
    at CardRenderer.componentDidUpdate (file://resources/frontend_client/app/dist/vizrender.bundle.js:99962:12)
    at commitLifeCycles (file://resources/frontend_client/app/dist/vendor.bundle.js:221917:22)
    at commitLayoutEffects (file://resources/frontend_client/app/dist/vendor.bundle.js:224885:7)
    at HTMLUnknownElement.callCallback (file://resources/frontend_client/app/dist/vendor.bundle.js:202270:14)
```