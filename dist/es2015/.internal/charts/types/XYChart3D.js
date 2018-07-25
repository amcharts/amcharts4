/**
 * Module for building 3D serial charts.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * Imports
 * ============================================================================
 * @hidden
 */
import { XYChart, XYChartDataItem } from "./XYChart";
import { Container } from "../../core/Container";
import { AxisRendererX3D } from "../axes/AxisRendererX3D";
import { AxisRendererY3D } from "../axes/AxisRendererY3D";
import { ColumnSeries3D } from "../series/ColumnSeries3D";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[XYChart3D]].
 *
 * @see {@link DataItem}
 */
var XYChart3DDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(XYChart3DDataItem, _super);
    function XYChart3DDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "XYChart3DDataItem";
        _this.applyTheme();
        return _this;
    }
    return XYChart3DDataItem;
}(XYChartDataItem));
export { XYChart3DDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a 3D XY chart.
 *
 * @see {@link IXYChart3DEvents} for a list of available Events
 * @see {@link IXYChart3DAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/} for documentation
 * @important
 */
var XYChart3D = /** @class */ (function (_super) {
    tslib_1.__extends(XYChart3D, _super);
    /**
     * Constructor
     */
    function XYChart3D() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Type of the axis renderer to use for X axes.
         *
         * @type {[type]}
         */
        _this._axisRendererX = AxisRendererX3D;
        /**
         * Type of the axis renderer to use for Y axes.
         * @type {[type]}
         */
        _this._axisRendererY = AxisRendererY3D;
        _this.className = "XYChart3D";
        // Set defaults
        _this.depth = 30;
        _this.angle = 30;
        // Creeate container for columns
        var columnsContainer = _this.seriesContainer.createChild(Container);
        columnsContainer.shouldClone = false;
        columnsContainer.isMeasured = false;
        columnsContainer.layout = "none";
        _this.columnsContainer = columnsContainer;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(XYChart3D.prototype, "depth", {
        /**
         * @return {number} Depth (px)
         */
        get: function () {
            return this.getPropertyValue("depth");
        },
        /**
         * Depth of the 3D chart / columns in pixels.
         *
         * @param {number}  value  Depth (px)
         */
        set: function (value) {
            this.setPropertyValue("depth", value);
            this.fixLayout();
            this.invalidateDataUsers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChart3D.prototype, "angle", {
        /**
         * @return {number} Angle
         */
        get: function () {
            return this.getPropertyValue("angle");
        },
        /**
         * Angle the chart is viewed at.
         *
         * @todo Description (review)
         * @param {number}  value  Angle
         */
        set: function (value) {
            this.setPropertyValue("angle", value);
            this.fixLayout();
            this.invalidateDataUsers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChart3D.prototype, "dx3D", {
        /**
         * A calculated horizontal 3D offset (px).
         *
         * @readonly
         * @return {number} Offset (px)
         */
        get: function () {
            return $math.cos(this.angle) * this.depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChart3D.prototype, "dy3D", {
        /**
         * A calculated vertical 3D offset (px).
         *
         * @readonly
         * @return {number} Offset (px)
         */
        get: function () {
            return -$math.sin(this.angle) * this.depth;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * (Re)validates the chart.
     *
     * @ignore Exclude from docs
     */
    XYChart3D.prototype.validate = function () {
        _super.prototype.validate.call(this);
        this.fixLayout();
    };
    /**
     * Updates the layout (padding and scrollbar positions) to accommodate for
     * 3D depth and angle.
     */
    XYChart3D.prototype.fixLayout = function () {
        this.chartContainer.marginTop = -this.dy3D;
        this.chartContainer.paddingRight = this.dx3D;
        if (this.scrollbarX) {
            this.scrollbarX.dy = this.dy3D;
            this.scrollbarX.dx = this.dx3D;
        }
        if (this.scrollbarY) {
            this.scrollbarY.dy = this.dy3D;
            this.scrollbarY.dx = this.dx3D;
        }
        this.fixColumns();
    };
    /**
     * Updates column positions, offset and dimensions based on chart's angle
     * and depth.
     */
    XYChart3D.prototype.fixColumns = function () {
        var _this = this;
        var count = 1;
        $iter.each(this.series.iterator(), function (series) {
            if (series instanceof ColumnSeries3D) {
                if (!series.clustered) {
                    count++;
                }
                series.depthIndex = count - 1;
            }
        });
        var s = 0;
        $iter.each(this.series.iterator(), function (series) {
            if (series instanceof ColumnSeries3D) {
                series.depth = _this.depth / count;
                series.angle = _this.angle;
                series.dx = _this.depth / count * $math.cos(_this.angle) * series.depthIndex;
                series.dy = -_this.depth / count * $math.sin(_this.angle) * series.depthIndex;
                var i_1 = 1;
                $iter.each(series.columns.iterator(), function (column) {
                    column.zIndex = 1000 * i_1 + s - series.depthIndex * 100;
                    i_1++;
                });
                s++;
            }
        });
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    XYChart3D.prototype.processConfig = function (config) {
        if (config) {
            // Set up series
            if ($type.hasValue(config.series) && $type.isArray(config.series)) {
                for (var i = 0, len = config.series.length; i < len; i++) {
                    config.series[i].type = config.series[i].type || "ColumnSeries3D";
                }
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return XYChart3D;
}(XYChart));
export { XYChart3D };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYChart3D"] = XYChart3D;
//# sourceMappingURL=XYChart3D.js.map