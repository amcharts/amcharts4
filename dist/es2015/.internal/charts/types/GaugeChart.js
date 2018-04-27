/**
 * Module for building Gauge charts.
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
import { RadarChart, RadarChartDataItem } from "./RadarChart";
import { ListTemplate } from "../../core/utils/List";
import { ClockHand } from "../elements/ClockHand";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[GaugeChart]].
 *
 * @see {@link DataItem}
 */
var GaugeChartDataItem = /** @class */ (function (_super) {
    __extends(GaugeChartDataItem, _super);
    /**
     * Constructor
     */
    function GaugeChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "GaugeChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return GaugeChartDataItem;
}(RadarChartDataItem));
export { GaugeChartDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Gauge chart.
 *
 * @see {@link IGaugeChartEvents} for a list of available Events
 * @see {@link IGaugeChartAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var GaugeChart = /** @class */ (function (_super) {
    __extends(GaugeChart, _super);
    /**
     * Constructor
     */
    function GaugeChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "GaugeChart";
        _this.startAngle = 180;
        _this.endAngle = 360;
        _this.hands = new ListTemplate(new ClockHand());
        _this.hands.events.on("insert", _this.processHand, _this);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    GaugeChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Gauge chart");
        }
    };
    /**
     * Decorates a [[ClockHand]] when it is added to the chart.
     *
     * @param {IListEvents<ClockHand>["insert"]}  event  Event
     */
    GaugeChart.prototype.processHand = function (event) {
        var hand = event.newValue;
        if (!hand.axis) {
            hand.axis = this.xAxes.getIndex(0);
        }
    };
    return GaugeChart;
}(RadarChart));
export { GaugeChart };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["GaugeChart"] = GaugeChart;
//# sourceMappingURL=GaugeChart.js.map