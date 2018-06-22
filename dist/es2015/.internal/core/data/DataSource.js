var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { dataLoader } from "./DataLoader";
import { JSONParser } from "./JSONParser";
import { CSVParser } from "./CSVParser";
import { BaseObjectEvents } from "../Base";
import { Adapter } from "../utils/Adapter";
import { Language } from "../utils/Language";
import { DateFormatter } from "../formatters/DateFormatter";
import { registry } from "../Registry";
import * as $type from "../utils/Type";
;
;
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Represents a single data source - external file with all of its settings,
 * such as format, data parsing, etc.
 *
 * ```TypeScript
 * chart.dataSource.url = "http://www.myweb.com/data.json";
 * chart.dataSource.parser = am4core.JSONParser;
 * ```
 * ```JavaScript
 * chart.dataSource.url = "http://www.myweb.com/data.json";
 * chart.dataSource.parser = am4core.JSONParser;
 * ```
 * ```JSON
 * {
 *   // ...
 *   "dataSource": {
 *     "url": "http://www.myweb.com/data.json",
 *     "parser": "JSONParser"
 *   },
 *   // ...
 * }
 * ```
 *
 * @see {@link IDataSourceEvents} for a list of available events
 * @see {@link IDataSourceAdapters} for a list of available Adapters
 */
var DataSource = /** @class */ (function (_super) {
    __extends(DataSource, _super);
    /**
     * Constructor
     */
    function DataSource(url, parser) {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Adapter.
         *
         * @type {Adapter<DataSource, IDataSourceAdapters>}
         */
        _this.adapter = new Adapter(_this);
        /**
         * Custom options for HTTP(S) request.
         *
         * @type {INetRequestOptions}
         */
        _this._requestOptions = {};
        /**
         * Will show loading indicator when loading files.
         *
         * @type {boolean}
         */
        _this.showPreloader = true;
        _this.className = "DataSource";
        // Set defaults
        if (url) {
            _this.url = url;
        }
        // Set parser
        if (parser) {
            if (typeof parser == "string") {
                _this.parser = dataLoader.getParserByType(parser);
            }
            else {
                _this.parser = parser;
            }
        }
        return _this;
    }
    /**
     * Processes the loaded data.
     *
     * @ignore Exclude from docs
     * @param {string}  data  Raw (unparsed) data
     * @param {string}  type  Content type of the loaded data (optional)
     */
    DataSource.prototype.processData = function (data, type) {
        var _this = this;
        // Parsing started
        this.dispatchImmediately("parsestarted");
        // Check if parser is set
        if (!this.parser) {
            // Try to resolve from data
            this.parser = dataLoader.getParserByData(data, type);
            if (!this.parser) {
                // We have a problem - nobody knows what to do with the data
                // Raise error
                if (this.events.isEnabled("parseerror")) {
                    var event_1 = {
                        type: "parseerror",
                        message: this.language.translate("No parser available for file: %1", null, this.url),
                        target: this
                    };
                    this.events.dispatchImmediately("parseerror", event_1);
                }
                this.dispatchImmediately("parseended");
                return;
            }
        }
        // Apply options adapters
        this.parser.options = this.adapter.apply("parserOptions", this.parser.options);
        this.parser.options.dateFields = this.adapter.apply("dateFields", this.parser.options.dateFields || []);
        this.parser.options.numberFields = this.adapter.apply("numberFields", this.parser.options.numberFields || []);
        // Check if we need to pass in date formatter
        if (this.parser.options.dateFields && !this.parser.options.dateFormatter) {
            this.parser.options.dateFormatter = this.dateFormatter;
        }
        // Parse
        this.data = this.adapter.apply("parsedData", this.parser.parse(this.adapter.apply("unparsedData", data)));
        // Check for parsing errors
        if (!$type.hasValue(this.data) && this.events.isEnabled("parseerror")) {
            var event_2 = {
                type: "parseerror",
                message: this.language.translate("Error parsing file: %1", null, this.url),
                target: this
            };
            this.events.dispatchImmediately("parseerror", event_2);
        }
        // Wrap up
        this.dispatchImmediately("parseended");
        this.dispatchImmediately("done", {
            "data": this.data
        });
        // Update component
        /*if (this.component) {

            // Set new data
            if (this.data && this.incremental) {
                this.component.addData(this.data);
            }
            else {
                this.component.data = this.data;
            }

        }*/
        // Update last data load
        this.lastLoad = new Date();
        // Should we schedule a reload?
        if (this.reloadFrequency) {
            this._reloadTimeout = setTimeout(function () {
                _this.load();
            }, this.reloadFrequency);
        }
    };
    Object.defineProperty(DataSource.prototype, "url", {
        /**
         * @return {string} URL
         */
        get: function () {
            return this.adapter.apply("url", this.disableCache
                ? this.timestampUrl(this._url)
                : this._url);
        },
        /**
         * URL of the data source.
         *
         * @param {string}  value  URL
         */
        set: function (value) {
            this._url = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataSource.prototype, "requestOptions", {
        /**
         * @return {INetRequestOptions} Options
         */
        get: function () {
            return this.adapter.apply("requestOptions", this._requestOptions);
        },
        /**
         * Custom options for HTTP(S) request.
         *
         * At this moment the only option supported is: `requestHeaders`, which holds
         * an array of objects for custom request headers, e.g.:
         *
         * ```TypeScript
         * chart.dataSource.requestOptions.requestHeaders = [{
         *   "key": "x-access-token",
         *   "value": "123456789"
         * }];
         * ``````JavaScript
         * chart.dataSource.requestOptions.requestHeaders = [{
         *   "key": "x-access-token",
         *   "value": "123456789"
         * }];
         * ```
         * ```JSON
         * {
         *   // ...
         *   "dataSource": {
         *     // ...
         *     "requestOptions": {
         *       "requestHeaders": [{
         *         "key": "x-access-token",
         *         "value": "123456789"
         *       }]
         *     }
         *   }
         * }
         * ```
         *
         * NOTE: setting this options on an-already loaded DataSource will not
         * trigger a reload.
         *
         * @param {INetRequestOptions}  value  Options
         */
        set: function (value) {
            this._requestOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataSource.prototype, "parser", {
        /**
         * @return {DataParser} Data parser
         */
        get: function () {
            if (!this._parser) {
                this._parser = new JSONParser();
            }
            return this.adapter.apply("parser", this._parser);
        },
        /**
         * A parser to be used to parse data.
         *
         * ```TypeScript
         * chart.dataSource.url = "http://www.myweb.com/data.json";
         * chart.dataSource.parser = am4core.JSONParser;
         * ```
         * ```JavaScript
         * chart.dataSource.url = "http://www.myweb.com/data.json";
         * chart.dataSource.parser = am4core.JSONParser;
         * ```
         * ```JSON
         * {
         *   // ...
         *   "dataSource": {
         *     "url": "http://www.myweb.com/data.json",
         *     "parser": "JSONParser"
         *   },
         *   // ...
         * }
         * ```
         *
         * @default JSONParser
         * @param {DataParser}  value  Data parser
         */
        set: function (value) {
            this._parser = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataSource.prototype, "reloadFrequency", {
        /**
         * @return {number} Reload frequency (ms)
         */
        get: function () {
            return this.adapter.apply("reloadTimeout", this._reloadFrequency);
        },
        /**
         * Data source reload frequency.
         *
         * If set, it will reload the same URL every X milliseconds.
         *
         * @param {number} value Reload frequency (ms)
         */
        set: function (value) {
            this._reloadFrequency = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataSource.prototype, "incremental", {
        /**
         * @return {boolean} Incremental load?
         */
        get: function () {
            return this.adapter.apply("incremental", this._incremental);
        },
        /**
         * Should subsequent reloads be treated as incremental?
         *
         * Incremental loads will assume that they contain only new data items
         * since the last load.
         *
         * If `incremental = false` the loader will replace all of the target's
         * data with each load.
         *
         * @default false
         * @param {boolean} Incremental load?
         */
        set: function (value) {
            this._incremental = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataSource.prototype, "language", {
        /**
         * @return {Language} A [[Language]] instance to be used
         */
        get: function () {
            if (this._language) {
                return this._language;
            }
            else if (this.component) {
                this._language = this.component.language;
                return this._language;
            }
            this.language = new Language();
            return this.language;
        },
        /**
         * Language instance to use.
         *
         * Will inherit and use chart's language, if not set.
         *
         * @param {Language} value An instance of Language
         */
        set: function (value) {
            this._language = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataSource.prototype, "dateFormatter", {
        /**
         * @return {DateFormatter} A [[DateFormatter]] instance to be used
         */
        get: function () {
            if (this._dateFormatter) {
                return this._dateFormatter;
            }
            else if (this.component) {
                this._dateFormatter = this.component.dateFormatter;
                return this._dateFormatter;
            }
            this.dateFormatter = new DateFormatter();
            return this.dateFormatter;
        },
        /**
         * A [[DateFormatter]] to use when parsing dates from string formats.
         *
         * Will inherit and use chart's DateFormatter if not ser.
         *
         * @param {DateFormatter} value An instance of [[DateFormatter]]
         */
        set: function (value) {
            this._dateFormatter = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds current timestamp to the URL.
     *
     * @param  {string}  url  Source URL
     * @return {string}       Timestamped URL
     */
    DataSource.prototype.timestampUrl = function (url) {
        var p = url.split("?"), tstamp = new Date().getTime().toString();
        if (1 === p.length) {
            p[1] = tstamp;
        }
        else {
            p[1] += "&" + tstamp;
        }
        return p.join("?");
    };
    /**
     * Disposes of this object.
     */
    DataSource.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._reloadTimeout) {
            clearTimeout(this._reloadTimeout);
        }
    };
    /**
     * Initiate the load.
     *
     * All loading in JavaScript is asynchronous. This function will trigger the
     * load and will exit immediately.
     *
     * Use DataSource's events to watch for loaded data and errors.
     */
    DataSource.prototype.load = function () {
        dataLoader.load(this);
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    DataSource.prototype.processConfig = function (config) {
        registry.registeredClasses["json"] = JSONParser;
        registry.registeredClasses["JSONParser"] = JSONParser;
        registry.registeredClasses["csv"] = CSVParser;
        registry.registeredClasses["CSVParser"] = CSVParser;
        _super.prototype.processConfig.call(this, config);
    };
    return DataSource;
}(BaseObjectEvents));
export { DataSource };
//# sourceMappingURL=DataSource.js.map