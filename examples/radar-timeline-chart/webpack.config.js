var $path = require("path");

module.exports = function (info) {
  return {
    entry: {
      "index": "./index.ts"
    },

    output: {
      path: $path.join(__dirname, "dist"),
      filename: "[name].js"
    },

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [{
            loader: "ts-loader"
          }],
          exclude: $path.join(__dirname, "node_modules")
        }
      ]
    }
  };
}
