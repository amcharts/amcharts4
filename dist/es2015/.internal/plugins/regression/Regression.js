/**
 * Regression plugin.
 *
 * Uses regression-js library by Tom Alexander
 * http://tom-alexander.github.io/regression-js/
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as regression from "regression";
import { Plugin } from "../../core/utils/Plugin";
import { registry } from "../../core/Registry";
import { EventDispatcher } from "../../core/utils/EventDispatcher";
import * as $object from "../../core/utils/Object";
;
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A module which automatically calculates data for for trend lines using
 * various regression algorithms.
 *
 * By pushing an instance of [[Regression]] into `plugin` list of
 * any [[XYSeries]], it automatically recalculates and overrides its
 * data to show regression trend line, inestead of the source values.
 *
 * Example:
 *
 * ```TypeScript
 * let regseries = chart.series.push(new am4charts.LineSeries());
 * regseries.dataFields.valueY = "value";
 * regseries.dataFields.dateX = "date";
 *
 * let reg = regseries.plugins.push(new am4plugins_regression.Regression());
 * reg.method = "polynomial";
 * ```
 * ```JavaScript
 * var regseries = chart.series.push(new am4charts.LineSeries());
 * regseries.dataFields.valueY = "value";
 * regseries.dataFields.dateX = "date";
 *
 * var reg = regseries.plugins.push(new am4plugins_regression.Regression());
 * reg.method = "polynomial";
 * ```
 * ```JSON
 * {
 *   // ...
 *   "series": [{
 *     // ...
 *   }, {
 *     "type": "LineSeries",
 *     "dataFields": {
 *       "valueY": "value",
 *       "dateX": "date"
 *     },
 *     "plugins": [{
 *       "type": "Regression",
 *       "method": "polynomial"
 *     }]
 *   }]
 * }
 * ```
 *
 * @since 4.2.2
 */
var Regression = /** @class */ (function (_super) {
    tslib_1.__extends(Regression, _super);
    /**
     * Constructor
     */
    function Regression() {
        var _this = 
        // Nothing to do here
        _super.call(this) || this;
        /**
         * An [[EventDispatcher]] instance.
         *
         * @since 4.3.14
         */
        _this.events = new EventDispatcher();
        /**
         * Method
         */
        _this._method = "linear";
        /**
         * Options
         */
        _this._options = {};
        /**
         * Should skip next "beforedatavalidated" event?
         */
        _this._skipValidatedEvent = false;
        return _this;
    }
    Regression.prototype.init = function () {
        _super.prototype.init.call(this);
        this.processSeries();
    };
    /**
     * Decorates series with required events and adapters used to hijack its
     * data.
     */
    Regression.prototype.processSeries = function () {
        var _this = this;
        this.invalidateData();
        // Invalidate calculated data whenever data updates
        this._disposers.push(this.target.events.on("beforedatavalidated", function (ev) {
            if (_this._skipValidatedEvent) {
                _this._skipValidatedEvent = false;
                return;
            }
            _this.calcData();
        }));
        // Save original series data
        if (this.target.data && this.target.data.length) {
            this._originalData = this.target.data;
        }
        // Set up adpater for data
        this.target.adapter.add("data", function () {
            if (_this._data === undefined) {
                _this.calcData();
            }
            return _this._data;
        });
    };
    Regression.prototype.invalidateData = function () {
        this._data = undefined;
    };
    Regression.prototype.calcData = function () {
        this._data = [];
        var series = this.target;
        // Get series' data (global or series own)
        var seriesData = this._originalData;
        if (!seriesData || seriesData.length == 0) {
            seriesData = this.target.baseSprite.data;
        }
        // Build matrix for the regression function
        var matrix = [];
        for (var i = 0; i < seriesData.length; i++) {
            matrix.push([
                series.dataFields.valueX ? seriesData[i][series.dataFields.valueX] : i,
                series.dataFields.valueY ? seriesData[i][series.dataFields.valueY] : i
            ]);
        }
        // Calculate regression values
        var result = [];
        switch (this.method) {
            case "polynomial":
                result = regression.polynomial(matrix, this.options);
                break;
            default:
                result = regression.linear(matrix, this.options);
        }
        // Set results
        this.result = result;
        // Invoke event
        this.events.dispatchImmediately("processed", {
            type: "processed",
            target: this
        });
        // Build data
        this._data = [];
        var _loop_1 = function (i) {
            var item = {};
            $object.each(this_1.target.dataFields, function (key, val) {
                if (key == "valueX") {
                    item[val] = result.points[i][0];
                }
                else if (key == "valueY") {
                    item[val] = result.points[i][1];
                }
                else {
                    item[val] = seriesData[i][val];
                }
            });
            this_1._data.push(item);
        };
        var this_1 = this;
        for (var i = 0; i < result.points.length; i++) {
            _loop_1(i);
        }
    };
    Object.defineProperty(Regression.prototype, "method", {
        /**
         * @return Method
         */
        get: function () {
            return this._method;
        },
        /**
         * Method to calculate regression.
         *
         * Supported values: "linear" (default), "polynomial".
         *
         * @default linear
         * @param  value  Method
         */
        set: function (value) {
            if (this._method != value) {
                this._method = value;
                this.invalidateData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Regression.prototype, "options", {
        /**
         * @return Options
         */
        get: function () {
            return this._options;
        },
        /**
         * Regression output options.
         *
         * Below are default alues.
         *
         * ```JSON
         * {
         *   order: 2,
         *   precision: 2,
         * }
         * ```
         *
         * @see {@link https://github.com/Tom-Alexander/regression-js#configuration-options} About options
         * @param  value  Options
         */
        set: function (value) {
            if (this._options != value) {
                this._options = value;
                this.invalidateData();
            }
        },
        enumerable: true,
        configurable: true
    });
    return Regression;
}(Plugin));
export { Regression };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Regression"] = Regression;
//# sourceMappingURL=Regression.js.map