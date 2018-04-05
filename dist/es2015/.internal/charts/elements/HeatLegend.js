/**
 * HeatLegend module
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
import { Container } from "../../core/Container";
import { LinearGradient } from "../../core/rendering/fills/LinearGradient";
import { system } from "../../core/System";
import { ListTemplate } from "../../core/utils/List";
import * as $type from "../../core/utils/Type";
import * as $colors from "../../core/utils/Colors";
import { percent } from "../../core/utils/Percent";
import { ValueAxis } from "../../charts/axes/ValueAxis";
import { AxisRendererX } from "../../charts/axes/AxisRendererX";
import { AxisRendererY } from "../../charts/axes/AxisRendererY";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Sankey Diagram.
 *
 * @see {@link IHeatLegendEvents} for a list of available events
 * @see {@link IHeatLegendAdapters} for a list of available Adapters
 * @important
 */
var HeatLegend = /** @class */ (function (_super) {
    __extends(HeatLegend, _super);
    /**
     * Constructor
     */
    function HeatLegend() {
        var _this = _super.call(this) || this;
        _this.className = "HeatLegend";
        _this.markerContainer = _this.createChild(Container);
        _this.orientation = "horizontal";
        _this.markerCount = 1;
        // Create a template container and list for the a marker
        var marker = new Container();
        marker.cloneChildren = true;
        marker.minHeight = 20;
        marker.minWidth = 20;
        marker.mouseEnabled = false;
        marker.background.fillOpacity = 1;
        _this.markerContainer.minHeight = 20;
        _this.markerContainer.minWidth = 20;
        _this.markers = new ListTemplate(marker);
        _this.applyTheme();
        return _this;
    }
    /**
     *
     * @ignore Exclude from docs
     */
    HeatLegend.prototype.validate = function () {
        _super.prototype.validate.call(this);
        for (var i = 0; i < this.markerCount; i++) {
            var marker = this.markers.getIndex(i);
            if (!marker) {
                marker = this.markers.create();
                marker.parent = this.markerContainer;
                marker.height = percent(100);
                marker.width = percent(100);
            }
            if (this.markerCount == 1) {
                var gradient = new LinearGradient();
                gradient.addColor(this.minColor);
                gradient.addColor(this.maxColor);
                if (this.orientation == "vertical") {
                    gradient.rotation = -90;
                }
                marker.background.fill = gradient;
            }
            else {
                var color_1 = $colors.interpolate(this.minColor, this.maxColor, i / this.markerCount);
                marker.background.fill = color_1;
            }
        }
        var renderer = this.valueAxis.renderer;
        if (this.markerCount > 1) {
            if (this.orientation == "horizontal") {
                renderer.minGridDistance = this.pixelWidth / this.markerCount;
            }
            else {
                renderer.minGridDistance = this.pixelHeight / this.markerCount;
            }
        }
        for (var i = this.markerCount; i < this.markers.length; i++) {
            this.markers.getIndex(i).parent = undefined;
        }
    };
    Object.defineProperty(HeatLegend.prototype, "minColor", {
        /**
         * Returns minColor value
         * @return {Color}
         */
        get: function () {
            return this.getPropertyValue("minColor");
        },
        /**
         * Min color of a heat legend. If a series is set for the legend, minColor is taken from series.
         *
         * @param {Color}
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
    Object.defineProperty(HeatLegend.prototype, "maxColor", {
        /**
         * Returns maxColor value
         * @return {Color}
         */
        get: function () {
            return this.getPropertyValue("maxColor");
        },
        /**
         * Max color of a heat legend. If a series is set for the legend, maxColor is taken from series.
         *
         * @param {Color}
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
    Object.defineProperty(HeatLegend.prototype, "markerCount", {
        /**
         * Returns number of color squares (markers).
         * @return {number}
         */
        get: function () {
            return this.getPropertyValue("markerCount");
        },
        /**
         * Number of color squares (markers) in the heat legend. If only 1 marker is used, it will be filled with gradient.
         *
         * @param {number}
         */
        set: function (value) {
            this.setPropertyValue("markerCount", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeatLegend.prototype, "minValue", {
        /**
         * Returns minimum value of heat legend.
         * @return {number}
         */
        get: function () {
            return this.getPropertyValue("minValue");
        },
        /**
         * Minimum value of heat legend's value axis. If a series is set for the legend, min is taken from series.
         *
         * @param {number}
         */
        set: function (value) {
            this.setPropertyValue("minValue", value);
            this.valueAxis.min = value;
            this.valueAxis.invalidateDataRange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeatLegend.prototype, "maxValue", {
        /**
         * Returns maximum value of heat legend.
         * @return {number}
         */
        get: function () {
            return this.getPropertyValue("maxValue");
        },
        /**
         * Maximum value of heat legend's value axis. If a series is set for the legend, max is taken from series.
         *
         * @param {number}
         */
        set: function (value) {
            this.setPropertyValue("maxValue", value);
            this.valueAxis.max = value;
            this.valueAxis.invalidateDataRange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeatLegend.prototype, "orientation", {
        /**
         * Returns orientation value.
         *
         * @return {"horizontal" | "vertical"}
         */
        get: function () {
            return this.getPropertyValue("orientation");
        },
        /**
        * Heat legend orientation. Note, if you change orientation of a heat legend, you must set value axis renderer properties after that, as with orientation renderer changes.
        *
        * @param {"horizontal" | "vertical"}
        */
        set: function (value) {
            this.setPropertyValue("orientation", value, true);
            var markerContainer = this.markerContainer;
            var valueAxis = this.valueAxis;
            // HORIZONTAL
            if (value == "horizontal") {
                if (!$type.hasValue(this.width)) {
                    this.width = 200;
                }
                this.height = undefined;
                valueAxis.width = percent(100);
                valueAxis.height = undefined;
                this.layout = "vertical";
                markerContainer.width = percent(100);
                markerContainer.height = undefined;
                if (!(valueAxis.renderer instanceof AxisRendererX)) {
                    valueAxis.renderer = new AxisRendererX(valueAxis);
                }
            }
            else {
                if (!$type.hasValue(this.height)) {
                    this.height = 200;
                }
                this.width = undefined;
                this.layout = "horizontal";
                markerContainer.width = undefined;
                markerContainer.height = percent(100);
                valueAxis.height = percent(100);
                valueAxis.width = undefined;
                if (!(valueAxis.renderer instanceof AxisRendererY)) {
                    valueAxis.renderer = new AxisRendererY(valueAxis);
                }
                valueAxis.renderer.inside = true;
                valueAxis.renderer.labels.template.inside = true;
            }
            var renderer = valueAxis.renderer;
            renderer.grid.template.disabled = true;
            renderer.axisFills.template.disabled = true;
            renderer.baseGrid.disabled = true;
            renderer.labels.template.padding(2, 3, 2, 3);
            renderer.minHeight = undefined;
            renderer.minWidth = undefined;
            this.markerContainer.layout = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeatLegend.prototype, "valueAxis", {
        /**
         * Returns valueAxis value.
         * @return {ValueAxis}
         */
        get: function () {
            if (!this._valueAxis) {
                this.valueAxis = this.createChild(ValueAxis);
            }
            return this._valueAxis;
        },
        /**
         * Sets a value axis of heat legend. Value axis for heat legend is created automatically.
         * @param {ValueAxis}
         */
        set: function (valueAxis) {
            this._valueAxis = valueAxis;
            valueAxis.parent = this;
            valueAxis.strictMinMax = true;
            this.orientation = this.orientation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeatLegend.prototype, "series", {
        /**
         * Returns series value.
         * @return {IHeatLegendSeries}
         */
        get: function () {
            return this._series;
        },
        /**
         * You can set series for heat legend. It will take min, max, minColor and maxColor values from this series.
         * @param {IHeatLegendSeries} series
         */
        set: function (series) {
            var _this = this;
            this._series = series;
            this.minColor = series.minColor;
            this.maxColor = series.maxColor;
            this.updateMinMax(series.minValue, series.maxValue);
            series.events.on("propertychanged", function (event) {
                if (event.property == "minColor" || event.property == "maxColor") {
                    _this.minColor = series.minColor;
                    _this.maxColor = series.maxColor;
                }
            });
            series.dataItem.events.on("calculatedvaluechanged", function (event) {
                _this.updateMinMax(series.dataItem.values.value.low, series.dataItem.values.value.high);
            });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates min/max of value axis.
     * @ignore
     */
    HeatLegend.prototype.updateMinMax = function (min, max) {
        var valueAxis = this.valueAxis;
        if (!$type.isNumber(this.minValue)) {
            valueAxis.min = min;
            valueAxis.invalidateDataRange();
        }
        if (!$type.isNumber(this.maxValue)) {
            valueAxis.max = max;
            valueAxis.invalidateDataRange();
        }
    };
    return HeatLegend;
}(Container));
export { HeatLegend };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
system.registeredClasses["HeatLegend"] = HeatLegend;
//# sourceMappingURL=HeatLegend.js.map