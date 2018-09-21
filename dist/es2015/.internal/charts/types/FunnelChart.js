/**
 * Funnel chart module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PercentChart, PercentChartDataItem } from "./PercentChart";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[FunnelChart]].
 *
 * @see {@link DataItem}
 */
var FunnelChartDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(FunnelChartDataItem, _super);
    /**
     * Constructor
     */
    function FunnelChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "FunnelChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return FunnelChartDataItem;
}(PercentChartDataItem));
export { FunnelChartDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Funnel chart.
 *
 * @see {@link IFunnelChartEvents} for a list of available Events
 * @see {@link IFunnelChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/funnel-chart/} for documentation
 * @important
 */
var FunnelChart = /** @class */ (function (_super) {
    tslib_1.__extends(FunnelChart, _super);
    /**
     * Constructor
     */
    function FunnelChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "FunnelChart";
        _this.seriesContainer.layout = "horizontal";
        _this.padding(15, 15, 15, 15);
        _this.seriesContainer.events.on("maxsizechanged", function () {
        });
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    FunnelChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Funnel chart");
        }
    };
    /**
     * (Re)validates the chart, causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    FunnelChart.prototype.validate = function () {
        _super.prototype.validate.call(this);
    };
    return FunnelChart;
}(PercentChart));
export { FunnelChart };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FunnelChart"] = FunnelChart;
registry.registeredClasses["FunnelChartDataItem"] = FunnelChartDataItem;
//# sourceMappingURL=FunnelChart.js.map