var $path = require("path");

module.exports = {
  mode: "production",

  devtool: "source-map",

  entry: {
    index: "./index.js"
  },

  output: {
    path: $path.join(__dirname, "dist"),
    publicPath: "dist/",
    filename: "[name].js",
    chunkFilename: "[name].js"
  },

  module: {
    rules: [{
      test: /.js$/,
      use: ["source-map-loader"],
      enforce: "pre"
    }]
  }
};