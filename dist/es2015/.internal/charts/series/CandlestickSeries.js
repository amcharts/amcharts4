/**
 * Candlestick Series module.
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
import { visualProperties } from "../../core/Sprite";
import { Line } from "../../core/elements/Line";
import { ListTemplate } from "../../core/utils/List";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
import { system } from "../../core/System";
import * as $utils from "../../core/utils/Utils";
import * as $object from "../../core/utils/Object";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[CandlestickSeries]].
 *
 * @see {@link DataItem}
 */
var CandlestickSeriesDataItem = /** @class */ (function (_super) {
    __extends(CandlestickSeriesDataItem, _super);
    /**
     * Defines a type of [[Component]] this data item is used for
     * @type {CandlestickSeries}
     * @todo Disabled to work around TS bug (see if we can re-enable it again)
     */
    //public _component: CandlestickSeries;
    /**
     * Constructor
     */
    function CandlestickSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.values.lowValueX = {};
        _this.values.lowValueY = {};
        _this.values.highValueX = {};
        _this.values.highValueY = {};
        _this.className = "CandlestickSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "lowValueX", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.lowValueX.value;
        },
        /**
         * Low value for horizontal axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("lowValueX", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "lowValueY", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.lowValueY.value;
        },
        /**
         * Low value for vertical axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("lowValueY", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "highValueX", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.highValueX.value;
        },
        /**
         * High value for horizontal axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("highValueX", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "highValueY", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.highValueY.value;
        },
        /**
         * High value for vertical axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("highValueY", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "closeValueX", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.valueX.value;
        },
        /**
         * Close value for horizontal axis.
         *
         * This is an alias for `valueX` added for convenience only.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("valueX", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "closeValueY", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.valueY.value;
        },
        /**
         * Close value for vertical axis.
         *
         * This is an alias for `valueX` added for convenience only.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("valueY", value);
        },
        enumerable: true,
        configurable: true
    });
    return CandlestickSeriesDataItem;
}(ColumnSeriesDataItem));
export { CandlestickSeriesDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a candlestick graph.
 *
 * @see {@link ICandlestickSeriesEvents} for a list of available Events
 * @see {@link ICandlestickSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var CandlestickSeries = /** @class */ (function (_super) {
    __extends(CandlestickSeries, _super);
    /**
     * Constructor
     */
    function CandlestickSeries() {
        var _this = _super.call(this) || this;
        _this.className = "CandlestickSeries";
        _this.lowLines;
        _this.highLines;
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    CandlestickSeries.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        this.readerTitle = this.language.translate("Candlestick Series");
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {CandlestickSeriesDataItem} Data Item
     */
    CandlestickSeries.prototype.createDataItem = function () {
        return new CandlestickSeriesDataItem();
    };
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {CandlestickSeriesDataItem}  dataItem  Data item
     */
    CandlestickSeries.prototype.validateDataElement = function (dataItem) {
        _super.prototype.validateDataElement.call(this, dataItem);
        var lowLine = this._lowLinesIterator.getFirst();
        var highLine = this._highLinesIterator.getFirst();
        lowLine.dataItem = dataItem;
        highLine.dataItem = dataItem;
        var column = dataItem.column;
        if (this.baseAxis == this.xAxis) {
            var x = column.pixelX + column.pixelWidth / 2;
            lowLine.x = x;
            highLine.x = x;
            var open_1 = dataItem.getWorkingValue(this.yOpenField);
            var close_1 = dataItem.getWorkingValue(this.yField);
            var yOpen = this.yAxis.getY(dataItem, this.yOpenField);
            var yClose = this.yAxis.getY(dataItem, this.yField);
            var yLow = this.yAxis.getY(dataItem, this.yLowField);
            var yHigh = this.yAxis.getY(dataItem, this.yHighField);
            lowLine.y1 = yLow;
            highLine.y1 = yHigh;
            if (open_1 < close_1) {
                lowLine.y2 = yOpen;
                highLine.y2 = yClose;
            }
            else {
                lowLine.y2 = yClose;
                highLine.y2 = yOpen;
            }
        }
        if (this.baseAxis == this.yAxis) {
            var y = column.pixelY + column.pixelHeight / 2;
            lowLine.y = y;
            highLine.y = y;
            var open_2 = dataItem.getWorkingValue(this.xOpenField);
            var close_2 = dataItem.getWorkingValue(this.xField);
            var xOpen = this.xAxis.getX(dataItem, this.xOpenField);
            var xClose = this.xAxis.getX(dataItem, this.xField);
            var xLow = this.xAxis.getX(dataItem, this.xLowField);
            var xHigh = this.xAxis.getX(dataItem, this.xHighField);
            lowLine.x1 = xLow;
            highLine.x1 = xHigh;
            if (open_2 < close_2) {
                lowLine.x2 = xOpen;
                highLine.x2 = xClose;
            }
            else {
                lowLine.x2 = xClose;
                highLine.x2 = xOpen;
            }
        }
        this.setColumnStates(lowLine);
        this.setColumnStates(highLine);
        lowLine.parent = this.columnsContainer;
        highLine.parent = this.columnsContainer;
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    CandlestickSeries.prototype.validate = function () {
        this._columnsIterator.reset();
        this._lowLinesIterator.reset();
        this._highLinesIterator.reset();
        _super.prototype.validate.call(this);
    };
    Object.defineProperty(CandlestickSeries.prototype, "xLowField", {
        /**
         * A data field to look for "low" value for horizontal axis.
         *
         * @ignore Exclude from docs
         * @return {string} Field name
         */
        get: function () {
            return this._xLowField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeries.prototype, "yLowField", {
        /**
         * A data field to look for "low" value for vertical axis.
         *
         * @ignore Exclude from docs
         * @return {string} Field name
         */
        get: function () {
            return this._yLowField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeries.prototype, "xHighField", {
        /**
         * A data field to look for "high" value for horizontal axis.
         *
         * @ignore Exclude from docs
         * @return {string} Field name
         */
        get: function () {
            return this._xHighField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeries.prototype, "yHighField", {
        /**
         * A data field to look for "high" value for vertical axis.
         *
         * @ignore Exclude from docs
         * @return {string} Field name
         */
        get: function () {
            return this._yHighField;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets up which data fields to use for data access.
     */
    CandlestickSeries.prototype.defineFields = function () {
        _super.prototype.defineFields.call(this);
        if (this.baseAxis == this.xAxis) {
            var yAxisFieldName = $utils.capitalize(this.yAxis.axisFieldName);
            this._yLowField = ("low" + yAxisFieldName + "Y");
            this._yHighField = ("high" + yAxisFieldName + "Y");
        }
        if (this.baseAxis == this.yAxis) {
            var xAxisFieldName = $utils.capitalize(this.xAxis.axisFieldName);
            this._xLowField = ("low" + xAxisFieldName + "X");
            this._xHighField = ("high" + xAxisFieldName + "X");
        }
        this.addValueField(this.xAxis, this._xValueFields, this._xLowField);
        this.addValueField(this.xAxis, this._xValueFields, this._xHighField);
        this.addValueField(this.yAxis, this._yValueFields, this._yLowField);
        this.addValueField(this.yAxis, this._yValueFields, this._yHighField);
    };
    Object.defineProperty(CandlestickSeries.prototype, "lowLines", {
        /**
         * List of "low" line elements.
         *
         * @ignore Exclude from docs
         * @return {ListTemplate<Line>} Element list
         */
        get: function () {
            var _this = this;
            if (!this._lowLines) {
                var lineTemplate = new Line();
                lineTemplate.isMeasured = false;
                this._lowLines = new ListTemplate(lineTemplate);
                this._lowLinesIterator = new $iter.ListIterator(this._lowLines, function () { return _this._lowLines.create(); });
                this._lowLinesIterator.createNewItems = true;
            }
            return this._lowLines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeries.prototype, "highLines", {
        /**
         * List of "high" line elements.
         *
         * @ignore Exclude from docs
         * @return {ListTemplate<Line>} Element list
         */
        get: function () {
            var _this = this;
            if (!this._highLines) {
                var lineTemplate = new Line();
                lineTemplate.isMeasured = false;
                this._highLines = new ListTemplate(lineTemplate);
                this._highLinesIterator = new $iter.ListIterator(this._highLines, function () { return _this._highLines.create(); });
                this._highLinesIterator.createNewItems = true;
            }
            return this._highLines;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates elements in related legend container, that mimics the look of this
     * Series.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Legend item container
     */
    CandlestickSeries.prototype.createLegendMarker = function (marker) {
        var w = marker.pixelWidth;
        var h = marker.pixelHeight;
        marker.removeChildren();
        var column = marker.createChild(RoundedRectangle);
        column.copyFrom(this.columns.template);
        var cw;
        var ch;
        var highLine = marker.createChild(Line);
        var lowLine = marker.createChild(Line);
        if (this.baseAxis == this.yAxis) {
            cw = w / 3;
            ch = h;
            highLine.y = h / 2;
            lowLine.y = h / 2;
            highLine.x2 = w / 3;
            lowLine.x2 = w / 3;
            lowLine.x = w / 3 * 2;
            column.x = w / 3;
        }
        else {
            cw = w;
            ch = h / 3;
            highLine.x = w / 2;
            lowLine.x = w / 2;
            highLine.y2 = h / 3;
            lowLine.y2 = h / 3;
            lowLine.y = h / 3 * 2;
            column.y = h / 3;
        }
        column.width = cw;
        column.height = ch;
        $object.copyProperties(this, marker, visualProperties);
        $object.copyProperties(this.columns.template, column, visualProperties);
        $object.copyProperties(this.lowLines.template, lowLine, visualProperties);
        $object.copyProperties(this.highLines.template, highLine, visualProperties);
    };
    return CandlestickSeries;
}(ColumnSeries));
export { CandlestickSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
system.registeredClasses["CandlestickSeries"] = CandlestickSeries;
system.registeredClasses["CandlestickSeriesDataItem"] = CandlestickSeriesDataItem;
//# sourceMappingURL=CandlestickSeries.js.map