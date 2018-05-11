/**
 * Radar chart module.
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
import { XYChart, XYChartDataItem } from "./XYChart";
import { percent, Percent } from "../../core/utils/Percent";
import { RadarSeries } from "../series/RadarSeries";
import { Container } from "../../core/Container";
import { Circle } from "../../core/elements/Circle";
import { registry } from "../../core/Registry";
import { RadarCursor } from "../cursors/RadarCursor";
import { AxisRendererCircular } from "../axes/AxisRendererCircular";
import { AxisRendererRadial } from "../axes/AxisRendererRadial";
import * as $utils from "../../core/utils/Utils";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[RadarChart]].
 *
 * @see {@link DataItem}
 */
var RadarChartDataItem = /** @class */ (function (_super) {
    __extends(RadarChartDataItem, _super);
    /**
     * Constructor
     */
    function RadarChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "RadarChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return RadarChartDataItem;
}(XYChartDataItem));
export { RadarChartDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Radar chart.
 *
 * @see {@link IRadarChartEvents} for a list of available Events
 * @see {@link IRadarChartAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var RadarChart = /** @class */ (function (_super) {
    __extends(RadarChart, _super);
    /**
     * Constructor
     */
    function RadarChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Defines X axis renderer type.
         *
         * @type {AxisRendererCircular}
         */
        _this._axisRendererX = AxisRendererCircular;
        /**
         * Defines Y axis renderer type.
         *
         * @type {AxisRendererRadial}
         */
        _this._axisRendererY = AxisRendererRadial;
        /**
         * used by cursor. We adjust innerradius if start and end angle are close to each other
         * @ignore Exclude from docs
         */
        _this.innerRadiusModifyer = 1;
        _this.className = "RadarChart";
        _this.startAngle = -90;
        _this.endAngle = 270;
        _this.radius = percent(80);
        _this.innerRadius = 0;
        var radarContainer = _this.plotContainer.createChild(Container);
        radarContainer.shouldClone = false;
        radarContainer.width = percent(100);
        radarContainer.height = percent(100);
        radarContainer.layout = "none";
        radarContainer.events.on("maxsizechanged", function () {
            _this.invalidate();
        });
        _this.seriesContainer.parent = radarContainer;
        _this.radarContainer = radarContainer;
        _this.bulletsContainer.parent = radarContainer;
        _this._cursorContainer = radarContainer;
        _this._bulletMask = radarContainer.createChild(Circle);
        _this._bulletMask.shouldClone = false;
        _this._bulletMask.element = _this.paper.add("path");
        _this._bulletMask.opacity = 0;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    RadarChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Radar chart");
        }
    };
    /**
     * Decorates Axis with required properties for this chart.
     *
     * @param {Axis}  axis  Axis
     */
    RadarChart.prototype.processAxis = function (axis) {
        _super.prototype.processAxis.call(this, axis);
        var renderer = axis.renderer;
        renderer.gridContainer.parent = renderer;
        renderer.breakContainer.parent = renderer;
        axis.parent = this.radarContainer;
        renderer.toBack();
    };
    /**
     * Updates all X axes after range change event.
     *
     * @param {AMEvent<Axis, IComponentEvents>["datarangechanged"]}  event  Event
     */
    RadarChart.prototype.handleXAxisRangeChange = function (event) {
        _super.prototype.handleXAxisRangeChange.call(this, event);
        $iter.each(this.yAxes.iterator(), function (axis) {
            axis.invalidate();
        });
    };
    /**
     * Updates all Y axes after range change event.
     *
     * @param {AMEvent<Axis, IComponentEvents>["datarangechanged"]}  event  Event
     */
    RadarChart.prototype.handleYAxisRangeChange = function (event) {
        _super.prototype.handleYAxisRangeChange.call(this, event);
        $iter.each(this.xAxes.iterator(), function (axis) {
            axis.invalidate();
        });
    };
    /**
     * Creates and returns a new Cursor, of type suitable for RadarChart.
     *
     * @return {RadarCursor} Cursor
     */
    RadarChart.prototype.createCursor = function () {
        return new RadarCursor();
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    RadarChart.prototype.processConfig = function (config) {
        if (config) {
            // Set up cursor
            if ($type.hasValue(config.cursor) && !$type.hasValue(config.cursor.type)) {
                config.cursor.type = "RadarCursor";
            }
            // Set up series
            if ($type.hasValue(config.series) && $type.isArray(config.series)) {
                for (var i = 0, len = config.series.length; i < len; i++) {
                    config.series[i].type = config.series[i].type || "RadarSeries";
                }
            }
            // Set up axes
            /*if ($type.hasValue(config.xAxes) && $type.isArray(config.xAxes)) {
                for (let i = 0, len = config.xAxes.length; i < len; i++) {
                    config.xAxes[i].type = config.xAxes[i].type || "AxisRendererCircular";
                }
            }
            if ($type.hasValue(config.yAxes) && $type.isArray(config.yAxes)) {
                for (let i = 0, len = config.yAxes.length; i < len; i++) {
                    config.yAxes[i].type = config.yAxes[i].type || "AxisRendererRadial";
                }
            }*/
        }
        _super.prototype.processConfig.call(this, config);
    };
    /**
     * Does calculations before drawing the chart.
     */
    RadarChart.prototype.beforeDraw = function () {
        _super.prototype.beforeDraw.call(this);
        var radarCont = this.radarContainer;
        var rect = $math.getArcRect(this.startAngle, this.endAngle, 1);
        var innerRect = { x: 0, y: 0, width: 0, height: 0 };
        var wr = radarCont.innerWidth / rect.width;
        var hr = radarCont.innerHeight / rect.height;
        var innerRadius = this.innerRadius;
        if (innerRadius instanceof Percent) {
            var value = innerRadius.value;
            var mr = Math.min(wr, hr);
            value = Math.max(mr * value, mr - Math.min(radarCont.innerHeight, radarCont.innerWidth)) / mr;
            innerRect = $math.getArcRect(this.startAngle, this.endAngle, value);
            this.innerRadiusModifyer = value / innerRadius.value;
            innerRadius = percent(value * 100);
        }
        // @todo handle this when innerRadius set in pixels (do it for pie also)
        rect = $math.getCommonRectangle([rect, innerRect]);
        var maxRadius = Math.min(radarCont.innerWidth / rect.width, radarCont.innerHeight / rect.height);
        var diameter = $utils.relativeRadiusToValue(this.radius, maxRadius) * 2;
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        this._pixelInnerRadius = $utils.relativeRadiusToValue(innerRadius, diameter / 2);
        this._bulletMask.element.attr({ "d": $path.arc(startAngle, endAngle - startAngle, diameter / 2, this._pixelInnerRadius) });
        $iter.each(this.xAxes.iterator(), function (axis) {
            axis.renderer.startAngle = startAngle;
            axis.renderer.endAngle = endAngle;
            axis.width = diameter;
            axis.height = diameter;
            //axis.renderer.width = diameter;
            //axis.renderer.height = diameter;
            axis.renderer.pixelRadiusReal = diameter / 2;
            axis.renderer.innerRadius = innerRadius;
        });
        $iter.each(this.yAxes.iterator(), function (axis) {
            axis.renderer.startAngle = startAngle;
            axis.renderer.endAngle = endAngle;
            axis.width = diameter;
            axis.height = diameter;
            //axis.renderer.width = diameter;
            //axis.renderer.height = diameter;
            axis.renderer.pixelRadiusReal = diameter / 2;
            axis.renderer.innerRadius = innerRadius;
        });
        var cursor = this.cursor;
        if (cursor) {
            cursor.width = diameter;
            cursor.height = diameter;
            cursor.startAngle = startAngle;
            cursor.endAngle = endAngle;
        }
        var x0 = rect.x;
        var y0 = rect.y;
        var x1 = rect.x + rect.width;
        var y1 = rect.y + rect.height;
        var point = { x: this.seriesContainer.maxWidth / 2 - diameter / 2 * (x0 + (x1 - x0) / 2), y: this.seriesContainer.maxHeight / 2 - diameter / 2 * (y0 + (y1 - y0) / 2) };
        this.radarContainer.moveTo(point);
    };
    /**
     * Creates and returns a new Series, suitable for RadarChart.
     *
     * @return {RadarSeries} New Series
     */
    RadarChart.prototype.createSeries = function () {
        return new RadarSeries();
    };
    Object.defineProperty(RadarChart.prototype, "startAngle", {
        /**
         * @return {number} Start angle (degrees)
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
        /**
         * Starting angle of the Radar face. (degrees)
         *
         * Normally, a circular radar face begins (the radial axis is drawn) at the
         * top center. (at -90 degrees)
         *
         * You can use `startAngle` to change this setting.
         *
         * E.g. setting this to 0 will make the radial axis start horizontally to
         * the right, as opposed to vertical.
         *
         * For a perfect circle the absolute sum of `startAngle` and `endAngle`
         * needs to be 360.
         *
         * However, it's **not** necessary to do so. You can set those to lesser
         * numbers, to create semi-circles.
         *
         * E.g. `startAngle = -90` with `endAngle = 0` will create a radar face that
         * looks like a quarter of a circle.
         *
         * @default -90
         * @param {number}  value  Start angle (degrees)
         */
        set: function (value) {
            this.setPropertyValue("startAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarChart.prototype, "endAngle", {
        /**
         * @return {number} End angle (degrees)
         */
        get: function () {
            return this.getPropertyValue("endAngle");
        },
        /**
         * Starting angle of the Radar face. (degrees)
         *
         * Normally, a circular radar face ends (the radial axis is drawn) exactly
         * where it has started, forming a full 360 circle. (at 270 degrees)
         *
         * You can use `endAngle` to end the circle somewhere else.
         *
         * E.g. setting this to 180 will make the radar face end at horizontal line
         * to the left off the center.
         *
         * For a perfect circle the absolute sum of `startAngle` and `endAngle`
         * needs to be 360.
         *
         * However, it's **not** necessary to do so. You can set those to lesser
         * numbers, to create semi-circles.
         *
         * E.g. `startAngle = -90` with `endAngle = 0` will create a radar face that
         * looks like a quarter of a circle.
         *
         * @default -90
         * @param {number}  value  End angle (degrees)
         */
        set: function (value) {
            this.setPropertyValue("endAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarChart.prototype, "radius", {
        /**
         * @return {number} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Outer radius of the Radar face.
         *
         * This can either be in absolute pixel value, or relative [[Percent]].
         *
         * @param {number | Percent}  value  Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarChart.prototype, "pixelInnerRadius", {
        /**
         * @return {number} Inner radius in pixels
         */
        get: function () {
            return this._pixelInnerRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarChart.prototype, "innerRadius", {
        /**
         * @return {number} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Inner radius of the radar face.
         *
         * This can either be in absolute pixel value, or relative [[Percent]].
         *
         * If set in Percent, it will be relative to `radius`. (outer radius)
         *
         * @param {number | Percent} value Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Triggers (re)rendering of the horizontal (X) axis.
     *
     * @ignore Exclude from docs
     * @param {Axis} axis Axis
     */
    RadarChart.prototype.updateXAxis = function (renderer) {
        //do not call super!
        renderer.axis.initRenderer();
    };
    /**
     * Triggers (re)rendering of the vertical (Y) axis.
     *
     * @ignore Exclude from docs
     * @param {Axis} axis Axis
     */
    RadarChart.prototype.updateYAxis = function (renderer) {
        // do not call super!
        renderer.axis.initRenderer();
    };
    return RadarChart;
}(XYChart));
export { RadarChart };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["RadarChart"] = RadarChart;
//# sourceMappingURL=RadarChart.js.map