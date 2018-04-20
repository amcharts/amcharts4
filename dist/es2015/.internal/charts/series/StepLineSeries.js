/**
 * Step line series module.
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
import { LineSeries, LineSeriesDataItem } from "./LineSeries";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[StepLineSeries]].
 *
 * @see {@link DataItem}
 */
var StepLineSeriesDataItem = /** @class */ (function (_super) {
    __extends(StepLineSeriesDataItem, _super);
    /**
     * Constructor
     */
    function StepLineSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "StepLineSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    return StepLineSeriesDataItem;
}(LineSeriesDataItem));
export { StepLineSeriesDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a step line graph.
 *
 * @see {@link IStepLineSeriesEvents} for a list of available Events
 * @see {@link IStepLineSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var StepLineSeries = /** @class */ (function (_super) {
    __extends(StepLineSeries, _super);
    /**
     * Constructor
     */
    function StepLineSeries() {
        var _this = _super.call(this) || this;
        _this.className = "StepLineSeries";
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {StepLineSeriesDataItem} Data Item
     */
    StepLineSeries.prototype.createDataItem = function () {
        return new StepLineSeriesDataItem();
    };
    /**
     * [addPoints description]
     *
     * @todo Description
     * @param {IPoint[]}           points     [description]
     * @param {this["_dataItem"]}  dataItem   [description]
     * @param {string}             xField     [description]
     * @param {string}             yField     [description]
     * @param {boolean}            backwards  [description]
     */
    StepLineSeries.prototype.addPoints = function (points, dataItem, xField, yField, backwards) {
        var x0 = this.xAxis.getX(dataItem, xField, 0);
        var y0 = this.yAxis.getY(dataItem, yField, 0);
        var x1 = this.xAxis.getX(dataItem, xField, 1);
        var y1 = this.yAxis.getY(dataItem, yField, 1);
        x0 = $math.fitToRange(x0, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        y0 = $math.fitToRange(y0, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        x1 = $math.fitToRange(x1, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        y1 = $math.fitToRange(y1, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        // this might make an impression that points are duplicated, and they indeed are, but this is needed to handle gaps in data
        if (this.connect) {
            if (points.length > 1) {
                var prevPoint = points[points.length - 1];
                if (this.baseAxis == this.xAxis) {
                    if (backwards) {
                        points.push({ x: prevPoint.x, y: y1 });
                    }
                    else {
                        points.push({ x: x0, y: prevPoint.y });
                    }
                }
                if (this.baseAxis == this.yAxis) {
                    if (backwards) {
                        points.push({ x: x1, y: prevPoint.y });
                    }
                    else {
                        points.push({ x: prevPoint.x, y: y0 });
                    }
                }
            }
        }
        var point0 = { x: x0, y: y0 };
        var point1 = { x: x1, y: y1 };
        if (backwards) {
            points.push(point1, point0);
        }
        else {
            points.push(point0, point1);
        }
    };
    return StepLineSeries;
}(LineSeries));
export { StepLineSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StepLineSeries"] = StepLineSeries;
registry.registeredClasses["StepLineSeriesDataItem"] = StepLineSeriesDataItem;
//# sourceMappingURL=StepLineSeries.js.map