var $path = require("path");

module.exports = function (info) {
  return {
    mode: "production",

    entry: {
      "index": "./index.js"
    },

    output: {
      path: $path.join(__dirname, "dist"),
      filename: "[name].js",
      chunkFilename: "[name].js",
    }
  };
}