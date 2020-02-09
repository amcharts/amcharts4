var $path = require("path");

module.exports = {
  mode: "production",

  devtool: "source-map",

  entry: {
    index: ["core-js/stable", "./index.js"]
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
      include: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: ["@babel/plugin-syntax-dynamic-import"]
        }
      }
    }, {
      test: /.js$/,
      use: ["source-map-loader"],
      enforce: "pre"
    }]
  }
};