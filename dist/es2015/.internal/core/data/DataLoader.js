/**
 * Data Loader is responsible for loading and parsing external data
 */
import { CSVParser } from "./CSVParser";
import { JSONParser } from "./JSONParser";
import { Adapter } from "../utils/Adapter";
import * as $net from "../utils/Net";
;
/**
 * Data Loader is responsible for loading and parsing external data.
 *
 * There is just one instance of DataLoader per system. Unless you have a
 * speicific reason, do not instantiate additional instances.
 *
 * The global instance of Data Loader is accessible via:
 *
 * ```TypeScript
 * am4core.dataLoader;
 * ```
 * ```JavaScript
 * am4core.dataLoader;
 * ```
 *
 * A loading of specific data source is done via [[DataSource]].
 *
     Please refer to [[DataSource]] for information how to use it.
 *
 * @see {@link IDataLoaderAdapters} for a list of available Adapters
 */
var DataLoader = /** @class */ (function () {
    function DataLoader() {
        /**
         * Adapter.
         *
         * @type {Adapter<DataLoader, IDataLoaderAdapters>}
         */
        this.adapter = new Adapter(this);
    }
    /**
     * Loads a supplied [[DataSource]] or an array of data sources, then calls
     * their respective `parse` methods.
     *
     * @param  {DataSource | DataSource[]}  source  A single data source or an array of multiple of data sources
     */
    DataLoader.prototype.load = function (source) {
        var sources = Array.isArray(source) ? source : [source];
        var promises = [];
        // Add each Source to the list to be loaded simultaneously
        for (var x in sources) {
            // Dispatch events
            sources[x].dispatchImmediately("started");
            sources[x].dispatchImmediately("loadstarted");
            promises.push($net.load(sources[x].url, sources[x], sources[x].requestOptions));
        }
        // Run all promises in parallel
        Promise.all(promises).then(function (res) {
            // Process each loaded source
            for (var x in res) {
                // Get Source
                var result = res[x];
                var source_1 = result.target;
                // Dispatch events
                source_1.dispatchImmediately("loadended");
                if (result.error) {
                    if (source_1.events.isEnabled("error")) {
                        source_1.events.dispatchImmediately("error", {
                            type: "error",
                            code: result.xhr.status,
                            message: source_1.language.translate("Unable to load file: %1", null, source_1.url),
                            target: source_1
                        });
                    }
                }
                else {
                    // Initiate parsing of the loaded data
                    source_1.processData(result.response, result.type);
                }
                source_1.dispatchImmediately("ended");
            }
        }).catch(function (res) {
            res.target.dispatchImmediately("loadended");
            if (res.target.events.isEnabled("error")) {
                res.target.events.dispatchImmediately("error", {
                    type: "error",
                    code: res.xhr.status,
                    message: res.target.language.translate("Unable to load file: %1", null, res.target.url),
                    target: res.target
                });
            }
            res.target.dispatchImmediately("ended");
        });
    };
    /**
     * Instantiates a [[DataParser]] object based on the data type.
     * Built-in parser types are as follows:
     *
     * * "csv" or "text/csv"
     * * "json" or "application/json"
     *
     * @param  {string}      type  A format type
     * @return {DataParser}        A parser object
     */
    DataLoader.prototype.getParserByType = function (type) {
        // Let some plugin decide
        var parser;
        if (parser = this.adapter.apply("getParserByType", {
            parser: null,
            type: type
        }).parser) {
            return parser;
        }
        if (type == "csv" || type == "text/csv") {
            return new CSVParser();
        }
        if (type == "json" || type == "application/json") {
            return new JSONParser();
        }
        return;
    };
    /**
     * Tries to determine a parser out of content type and/or actual data.
     *
     * @param  {string}      data  Data
     * @param  {string}      type  Content-type
     * @return {DataParser}        Parser instance
     */
    DataLoader.prototype.getParserByData = function (data, type) {
        // Let some plugin decide
        var parser = this.adapter.apply("getParserByData", {
            parser: null,
            data: data,
            type: type
        }).parser;
        // Check if we have parser from outside code
        if (!parser) {
            // No, let's try to figure it out
            if (parser = this.getParserByType(type)) {
                // We're able to figure out parser by conten-type
                return parser;
            }
            else if (JSONParser.isJSON(data)) {
                return this.getParserByType("json");
            }
            else if (CSVParser.isCSV(data)) {
                return this.getParserByType("csv");
            }
        }
        return parser;
    };
    return DataLoader;
}());
export { DataLoader };
/**
 * Create instance of Data Loader
 */
export var dataLoader = new DataLoader();
//# sourceMappingURL=DataLoader.js.map