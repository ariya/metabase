const SRC_PATH = __dirname + "/frontend/src/metabase";
const BUILD_PATH = __dirname + "/resources/frontend_client";

module.exports = {
  mode: "production",
  context: SRC_PATH,

  performance: {
    hints: false,
  },

  entry: {
    "lib-static-viz": {
      import: "./static-viz/index.js",
      library: {
        name: "StaticViz",
        type: "var",
      },
    },
  },

  output: {
    path: BUILD_PATH + "/app/dist",
    filename: "[name].bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              target: "es2015",
            }
          }
        ],
      },
    ],
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".js", ".jsx", ".ts", ".tsx"],
    alias: {
      metabase: SRC_PATH,
    },
  },
};
