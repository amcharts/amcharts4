var $path = require("path");

module.exports = {
  mode: "production",

  devtool: "source-map",

  entry: {
    index: "./index.ts"
  },

  output: {
    path: $path.join(__dirname, "dist"),
    publicPath: "dist/",
    filename: "[name].js",
    chunkFilename: "[name].js"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [{
      test: /.tsx?$/,
      loader: "ts-loader"
    }, {
      test: /.js$/,
      use: ["source-map-loader"],
      enforce: "pre"
    }]
  }
};