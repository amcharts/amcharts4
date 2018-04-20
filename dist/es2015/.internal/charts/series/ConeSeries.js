/**
 * ConeSeries module
 * Not recommended using if you use scrollbars or your chart is zoomable in some other way.
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
import { ConeColumn } from "../elements/ConeColumn";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ConeSeries]].
 *
 * @see {@link DataItem}
 */
var ConeSeriesDataItem = /** @class */ (function (_super) {
    __extends(ConeSeriesDataItem, _super);
    /**
     * Constructor
     */
    function ConeSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "ConeSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    return ConeSeriesDataItem;
}(ColumnSeriesDataItem));
export { ConeSeriesDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a cone graph.
 *
 * @see {@link IConeSeriesEvents} for a list of available Events
 * @see {@link IConeSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var ConeSeries = /** @class */ (function (_super) {
    __extends(ConeSeries, _super);
    /**
     * Constructor
     */
    function ConeSeries() {
        var _this = _super.call(this) || this;
        _this.className = "ConeSeries";
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns an element to use for Candlestick
     * @ignore
     * @return {this["_column"]} Element.
     */
    ConeSeries.prototype.createColumnTemplate = function () {
        return new ConeColumn();
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    ConeSeries.prototype.validate = function () {
        _super.prototype.validate.call(this);
    };
    /**
     * Returns an SVG path to use as series mask.
     *
     * @return {string} SVG path
     */
    ConeSeries.prototype.getMaskPath = function () {
        var dx = 0;
        var dy = 0;
        var column = this.columns.getIndex(0);
        if (this.baseAxis == this.xAxis) {
            dy = column.coneColumn.bottom.radiusY + 1;
        }
        else {
            dx = column.coneColumn.bottom.radiusY + 1;
        }
        return $path.rectToPath({
            x: -dx,
            y: 0,
            width: this.xAxis.axisLength + dx,
            height: this.yAxis.axisLength + dy
        });
    };
    /**
     * Validates data item's elements.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    ConeSeries.prototype.validateDataElementReal = function (dataItem) {
        _super.prototype.validateDataElementReal.call(this, dataItem);
        var coneColumn = dataItem.column.coneColumn;
        coneColumn.fill = dataItem.column.fill;
        if (this.baseAxis == this.yAxis) {
            coneColumn.orientation = "horizontal";
        }
        else {
            coneColumn.orientation = "vertical";
        }
    };
    return ConeSeries;
}(ColumnSeries));
export { ConeSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ConeSeries"] = ConeSeries;
registry.registeredClasses["ConeSeriesDataItem"] = ConeSeriesDataItem;
//# sourceMappingURL=ConeSeries.js.map