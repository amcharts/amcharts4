var $path = require("path");

module.exports = {
    entry: {
        index: "./index.js"
    },

    output: {
    	path: $path.join(__dirname, "dist"),
        filename: "[name].js",
        chunkFilename: "[name].js"
    }
}
