/**
 * 3D column series module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, ColumnSeriesDataItem } from "../series/ColumnSeries";
import { Column3D } from "../elements/Column3D";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
var ColumnSeries3DDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(ColumnSeries3DDataItem, _super);
    /**
     * Constructor
     */
    function ColumnSeries3DDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "ColumnSeries3DDataItem";
        _this.applyTheme();
        return _this;
    }
    return ColumnSeries3DDataItem;
}(ColumnSeriesDataItem));
export { ColumnSeries3DDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a 3D column graph.
 *
 * @see {@link IColumnSeries3DEvents} for a list of available Events
 * @see {@link IColumnSeries3DAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var ColumnSeries3D = /** @class */ (function (_super) {
    tslib_1.__extends(ColumnSeries3D, _super);
    /**
     * Constructor
     */
    function ColumnSeries3D() {
        var _this = _super.call(this) || this;
        _this.className = "ColumnSeries3D";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(ColumnSeries3D.prototype, "columnsContainer", {
        get: function () {
            if (this.chart && this.chart.columnsContainer) {
                // @martynas: need to check aria-things here.
                return this.chart.columnsContainer;
            }
            else {
                return this._columnsContainer;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns an element to use for 3D bar.
     * @ignore
     * @return {this["_column"]} Element.
     */
    ColumnSeries3D.prototype.createColumnTemplate = function () {
        return new Column3D();
    };
    /**
     * Returns SVG path to use as a mask for the series.
     *
     * @return {string} Mask path
     */
    ColumnSeries3D.prototype.getMaskPath = function () {
        var w = this.xAxis.axisLength;
        var h = this.yAxis.axisLength;
        var dx = this.chart.dx3D || 0;
        var dy = this.chart.dy3D || 0;
        return $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: dx, y: dy }) + $path.lineTo({ x: w + dx, y: dy }) + $path.lineTo({ x: w + dx, y: h + dy }) + $path.lineTo({ x: w, y: h }) + $path.lineTo({ x: w, y: h }) + $path.lineTo({ x: 0, y: h }) + $path.closePath();
    };
    Object.defineProperty(ColumnSeries3D.prototype, "depth", {
        /**
         * @ignore Exclude from docs
         * @return {number} Depth (px)
         */
        get: function () {
            return this.getPropertyValue("depth");
        },
        /**
         * Depth (height) of the slices in the series in pixels.
         *
         * @ignore Exclude from docs
         * @param {number}  value  Depth (px)
         */
        set: function (value) {
            this.setPropertyValue("depth", value, true);
            var template = this.columns.template; // todo: Cone is not Rectangle3D, maybe we should do some I3DShape?
            template.column3D.depth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnSeries3D.prototype, "angle", {
        /**
         * @ignore Exclude from docs
         * @return {number} Angle (0-360)
         */
        get: function () {
            return this.getPropertyValue("angle");
        },
        /**
         * Angle of view for the slices in series. (0-360)
         *
         * @ignore Exclude from docs
         * @param {number}  value  Angle (0-360)
         */
        set: function (value) {
            this.setPropertyValue("angle", value);
            var template = this.columns.template;
            template.column3D.angle = value;
        },
        enumerable: true,
        configurable: true
    });
    return ColumnSeries3D;
}(ColumnSeries));
export { ColumnSeries3D };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ColumnSeries3D"] = ColumnSeries3D;
registry.registeredClasses["ColumnSeries3DDataItem"] = ColumnSeries3DDataItem;
//# sourceMappingURL=ColumnSeries3D.js.map