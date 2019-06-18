var $webpack = require("webpack");
var $path = require("path");
var $UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var $ChunkIdPlugin = require("webpack-hashed-chunk-id-plugin");

module.exports = function (info) {
    return {
        entry: info.entry,

        devtool: "source-map",

        output: {
            path: $path.resolve(info.baseDir),
            publicPath: (info.runtimeDir != null ? info.runtimeDir: info.baseDir),
            filename: "[name].js",
            chunkFilename: "deps/[name].js",
            jsonpFunction: info.jsonpFunction || "am4internal_webpackJsonp",
            libraryTarget: "var",
            pathinfo: !info.minify
        },

        stats: "errors-only",
        /*stats: {
            // Examine all modules
            maxModules: Infinity,
            // Display bailout reasons
            optimizationBailout: true,
            // TODO this is needed to suppress harmless warnings from ts-loader
            warningsFilter: /export .* was not found in/
        },*/

        plugins: [
            new $webpack.optimize.ModuleConcatenationPlugin(),

            new $webpack.optimize.CommonsChunkPlugin({
                name: info.baseChunk,
                minChunks: 2,
            }),

            new $webpack.HashedModuleIdsPlugin({
                hashFunction: "sha256"
            }),

            new $webpack.BannerPlugin({
                raw: true,
                banner:
`/**
 * @license
 * Copyright (c) 2018 amCharts (Antanas Marcelionis, Martynas Majeris)
 *
 * This sofware is provided under multiple licenses. Please see below for
 * links to appropriate usage.
 *
 * Free amCharts linkware license. Details and conditions:
 * https://github.com/amcharts/amcharts4/blob/master/LICENSE
 *
 * One of the amCharts commercial licenses. Details and pricing:
 * https://www.amcharts.com/online-store/
 * https://www.amcharts.com/online-store/licenses-explained/
 *
 * If in doubt, contact amCharts at contact@amcharts.com
 *
 * PLEASE DO NOT REMOVE THIS COPYRIGHT NOTICE.
 * @hidden
 */
 `
            }),
        ].concat(
            (info.minify ? [
                new $UglifyJsPlugin({
                    cache: true,
                    sourceMap: true,
                    parallel: true,
                    uglifyOptions: {
                        output: {
                            comments: /@license/,
                        }
                    }
                })
            ] : []),
        ).concat([
            new $ChunkIdPlugin({}),
        ]),

        module: {
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            rules: [{
                test: /\.js$/,
                include: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-syntax-dynamic-import"]
                    }
                }
            }, {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"]
            }]
        },

        externals: info.externals || [
            "jsdom",
            "xmldom",
            "canvas"
        ]
    };
}
