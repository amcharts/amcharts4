/**
 * HeatMapSeries module
 */
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
import { ColumnSeries, ColumnSeriesDataItem } from "./ColumnSeries";
import { Color } from "../../core/utils/Color";
import { percent } from "../../core/utils/Percent";
import { system } from "../../core/System";
import * as $type from "../../core/utils/Type";
import * as $colors from "../../core/utils/Colors";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[HeatMapSeries]].
 *
 * @see {@link DataItem}
 */
var HeatMapSeriesDataItem = /** @class */ (function (_super) {
    __extends(HeatMapSeriesDataItem, _super);
    /**
     * Constructor
     */
    function HeatMapSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "HeatMapSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    return HeatMapSeriesDataItem;
}(ColumnSeriesDataItem));
export { HeatMapSeriesDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a cone graph.
 *
 * @see {@link IHeatMapSeriesEvents} for a list of available Events
 * @see {@link IHeatMapSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var HeatMapSeries = /** @class */ (function (_super) {
    __extends(HeatMapSeries, _super);
    /**
     * Constructor
     */
    function HeatMapSeries() {
        var _this = _super.call(this) || this;
        /**
         * A function which fills columns with intermediate color between minColor and maxColor if dataItem has value
         *
         * @todo Description
         * @type {function}
         */
        _this.fillRule = function (column) {
            var dataItem = column.dataItem;
            if (dataItem && dataItem.value) {
                var series = dataItem.component;
                if ($type.hasValue(series.minColor) && $type.hasValue(series.maxColor) && $type.isNumber(series.minValue) && $type.isNumber(series.maxValue)) {
                    var percent_1 = (dataItem.values.value.workingValue - series.minValue) / (series.maxValue - series.minValue);
                    column.fill = $colors.interpolate(series.minColor, series.maxColor, percent_1);
                }
            }
        };
        _this.minColor = new InterfaceColorSet().getFor("background");
        _this.className = "HeatMapSeries";
        _this.columns.template.width = percent(100);
        _this.columns.template.height = percent(100);
        _this.applyTheme();
        return _this;
    }
    /**
     * (Re)validates the series
     *
     * @ignore Exclude from docs
     */
    HeatMapSeries.prototype.validate = function () {
        if (this.minValue != this._prevMin || this.maxValue != this._prevMax) {
            this.dispatchImmediately("valueextremeschanged");
            this._prevMin = this.minValue;
            this._prevMax = this.maxValue;
        }
        _super.prototype.validate.call(this);
    };
    /**
     * Validates data item's elements.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    HeatMapSeries.prototype.validateDataElementReal = function (dataItem) {
        _super.prototype.validateDataElementReal.call(this, dataItem);
        this.fillRule(dataItem.column);
    };
    Object.defineProperty(HeatMapSeries.prototype, "minColor", {
        /**
         * @return {Color} Lowest color
         */
        get: function () {
            return this.getPropertyValue("minColor");
        },
        /**
         * Color for the lowest value in a heat map.
         *
         * In heat map, each object will be colored with an intermediate color
         * between `minColor` and `maxColor` based on their `value` position between
         * `min` and `max`.
         *
         * @param {Color}  value  Lowest color
         */
        set: function (value) {
            if (!$type.isObject(value)) {
                value = $type.toColor(value);
            }
            this.setPropertyValue("minColor", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeatMapSeries.prototype, "maxColor", {
        /**
         * @return {Color} Highest color
         */
        get: function () {
            var maxColor = this.getPropertyValue("maxColor");
            if ($type.hasValue(maxColor)) {
                return maxColor;
            }
            else if (this.fill instanceof Color) {
                return this.fill;
            }
        },
        /**
         * Color for the highest value in a heat map.
         *
         * In heat map, each object will be colored with an intermediate color
         * between `minColor` and `maxColor` based on their `value` position between
         * `min` and `max`.
         *
         * @param {Color}  value  Highest color
         */
        set: function (value) {
            if (!$type.isObject(value)) {
                value = $type.toColor(value);
            }
            this.setPropertyValue("maxColor", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeatMapSeries.prototype, "maxValue", {
        /**
         * @return {number} Highest value
         */
        get: function () {
            var maxValue = this._maxValue;
            if ($type.isNumber(maxValue)) {
                return maxValue;
            }
            else {
                var dataItem = this.dataItem;
                if (dataItem) {
                    return dataItem.values.value.high;
                }
            }
        },
        /**
         * User-defined highest value in the series.
         *
         * If not set, the map will use the highest `value` out of actual items in
         * the series.
         *
         * This is used to determine object's color in a heat map.
         *
         * @param {number}  value  Highest value
         */
        set: function (value) {
            this._maxValue = value;
            this.invalidateData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeatMapSeries.prototype, "minValue", {
        /**
         * @return {number} Lowest value
         */
        get: function () {
            var minValue = this._minValue;
            if ($type.isNumber(minValue)) {
                return minValue;
            }
            else {
                var dataItem = this.dataItem;
                if (dataItem) {
                    return dataItem.values.value.low;
                }
            }
        },
        /**
         * User-defined lowest value in the series.
         *
         * If not set, the map will use the lowest `value` out of actual items in
         * the series.
         *
         * This is used to determine object's color in a heat map.
         *
         * @param {number}  value  Lowest value
         */
        set: function (value) {
            this._minValue = value;
            this.invalidateData();
        },
        enumerable: true,
        configurable: true
    });
    return HeatMapSeries;
}(ColumnSeries));
export { HeatMapSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
system.registeredClasses["HeatMapSeries"] = HeatMapSeries;
system.registeredClasses["HeatMapSeriesDataItem"] = HeatMapSeriesDataItem;
//# sourceMappingURL=HeatMapSeries.js.map