/**
 * Radar column series module.
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
import { ColumnSeries, ColumnSeriesDataItem } from "../series/ColumnSeries";
import { visualProperties } from "../../core/Sprite";
import { Slice } from "../../core/elements/Slice";
import { system } from "../../core/System";
import * as $path from "../../core/rendering/Path";
import * as $math from "../../core/utils/Math";
import * as $object from "../../core/utils/Object";
import * as $type from "../../core/utils/Type";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[RadarColumnSeries]].
 *
 * @see {@link DataItem}
 */
var RadarColumnSeriesDataItem = /** @class */ (function (_super) {
    __extends(RadarColumnSeriesDataItem, _super);
    /**
     * Constructor
     */
    function RadarColumnSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "ColumnSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    return RadarColumnSeriesDataItem;
}(ColumnSeriesDataItem));
export { RadarColumnSeriesDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a 3D column graph.
 *
 * @see {@link IRadarColumnSeriesEvents} for a list of available Events
 * @see {@link IRadarColumnSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var RadarColumnSeries = /** @class */ (function (_super) {
    __extends(RadarColumnSeries, _super);
    /**
     * Constructor
     */
    function RadarColumnSeries() {
        var _this = _super.call(this) || this;
        _this.className = "RadarColumnSeries";
        _this.applyTheme();
        return _this;
    }
    /**
     * Creates and returns a Slice element to use as column in radar chart.
     *
     * @return {Sprite} Clice/column.
     */
    RadarColumnSeries.prototype.getColumnTemplate = function () {
        return new Slice();
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    RadarColumnSeries.prototype.validate = function () {
        // so that radius would be updated
        if (this.chart.invalid) {
            this.chart.validate();
        }
        _super.prototype.validate.call(this);
    };
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {RadarColumnSeriesDataItem}  dataItem  Data item
     */
    RadarColumnSeries.prototype.validateDataElementReal = function (dataItem) {
        var _this = this;
        var startAngle = this.chart.startAngle;
        var endAngle = this.chart.endAngle;
        var yField = this.yField;
        var yOpenField = this.yOpenField;
        var xField = this.xField;
        var xOpenField = this.xOpenField;
        var lAngle;
        var rAngle;
        var tRadius;
        var bRadius;
        var startLocation = this.getStartLocation(dataItem);
        var endLocation = this.getEndLocation(dataItem);
        var cellAngle = (endAngle - startAngle) / (this.dataItems.length * (this.end - this.start));
        startAngle = startAngle + startLocation * cellAngle;
        endAngle = endAngle - (1 - endLocation) * cellAngle;
        var template = this.columns.template;
        var percentWidth = template.percentWidth;
        if ($type.isNaN(percentWidth)) {
            percentWidth = 100;
        }
        var offset = $math.round((endLocation - startLocation) * (1 - percentWidth / 100) / 2, 5);
        startLocation += offset;
        endLocation -= offset;
        // @todo use getPoint() instead of these
        if (this.baseAxis == this.xAxis) {
            tRadius = $math.getDistance({ x: this.yAxis.getX(dataItem, yField, dataItem.locations[yField], "valueY"), y: this.yAxis.getY(dataItem, yField, dataItem.locations[yField], "valueY") });
            bRadius = $math.getDistance({ x: this.yAxis.getX(dataItem, yOpenField, dataItem.locations[yOpenField], "valueY"), y: this.yAxis.getY(dataItem, yOpenField, dataItem.locations[yOpenField], "valueY") });
            lAngle = this.xAxis.getAngle(dataItem, xOpenField, startLocation, "valueX");
            rAngle = this.xAxis.getAngle(dataItem, xField, endLocation, "valueX");
        }
        else {
            tRadius = $math.getDistance({ x: this.yAxis.getX(dataItem, yField, startLocation, "valueY"), y: this.yAxis.getY(dataItem, yField, startLocation, "valueY") });
            bRadius = $math.getDistance({ x: this.yAxis.getX(dataItem, yOpenField, endLocation, "valueY"), y: this.yAxis.getY(dataItem, yOpenField, endLocation, "valueY") });
            lAngle = this.xAxis.getAngle(dataItem, xField, dataItem.locations[xField], "valueX");
            rAngle = this.xAxis.getAngle(dataItem, xOpenField, dataItem.locations[xOpenField], "valueX");
        }
        if (rAngle < lAngle) {
            var temp = rAngle;
            rAngle = lAngle;
            lAngle = temp;
        }
        lAngle = $math.fitToRange(lAngle, startAngle, endAngle);
        rAngle = $math.fitToRange(rAngle, startAngle, endAngle);
        var slice = dataItem.column;
        if (!slice) {
            slice = this._columnsIterator.getFirst();
            if (slice.dataItem != dataItem) {
                $object.forceCopyProperties(this.columns.template, slice, visualProperties);
                slice.dataItem = dataItem;
                dataItem.column = slice;
                this.setColumnStates(slice);
            }
        }
        slice.startAngle = lAngle;
        slice.arc = rAngle - lAngle;
        slice.radius = tRadius;
        slice.innerRadius = bRadius;
        slice.__disabled = false;
        slice.parent = this.columnsContainer;
        $iter.each(this.axisRanges.iterator(), function (axisRange) {
            var rangeColumn = slice.clone();
            rangeColumn.parent = axisRange.contents;
            $object.copyProperties(axisRange, rangeColumn, visualProperties);
            if (rangeColumn.dataItem != dataItem) {
                $object.forceCopyProperties(_this.columns.template, rangeColumn, visualProperties);
            }
            rangeColumn.dataItem = dataItem;
            rangeColumn.__disabled = false;
            _this.setColumnStates(rangeColumn);
        });
    };
    /**
     * Returnsan SVG path that is used as mask for the series.
     *
     * @return {string} SVG path
     */
    RadarColumnSeries.prototype.getMaskPath = function () {
        var renderer = this.yAxis.renderer;
        return $path.arc(renderer.startAngle, renderer.endAngle - renderer.startAngle, renderer.pixelRadius, renderer.pixelInnerRadius);
    };
    /**
     * [getPoint description]
     *
     * @todo Description
     * @param {RadarColumnSeriesDataItem} dataItem  [description]
     * @param {string}                    xKey      [description]
     * @param {string}                    yKey      [description]
     * @param {number}                    locationX [description]
     * @param {number}                    locationY [description]
     * @param {string}                    stackKeyX [description]
     * @param {string}                    stackKeyY [description]
     */
    RadarColumnSeries.prototype.getPoint = function (dataItem, xKey, yKey, locationX, locationY, stackKeyX, stackKeyY) {
        var x = this.yAxis.getX(dataItem, yKey, locationY, stackKeyY);
        var y = this.yAxis.getY(dataItem, yKey, locationY, stackKeyY);
        var radius = $math.getDistance({ x: x, y: y });
        var angle = this.xAxis.getAngle(dataItem, xKey, locationX, stackKeyX);
        return { x: radius * $math.cos(angle), y: radius * $math.sin(angle) };
    };
    return RadarColumnSeries;
}(ColumnSeries));
export { RadarColumnSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
system.registeredClasses["RadarColumnSeries"] = RadarColumnSeries;
system.registeredClasses["RadarColumnSeriesDataItem"] = RadarColumnSeriesDataItem;
//# sourceMappingURL=RadarColumnSeries.js.map