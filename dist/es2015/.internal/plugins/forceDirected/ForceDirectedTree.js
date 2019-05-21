/**
 * ForceDirectedTree chart module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, SerialChartDataItem } from "../../charts/types/SerialChart";
import { ForceDirectedSeries } from "./ForceDirectedSeries";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 * @see {@link DataItem}
 */
var ForceDirectedTreeDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(ForceDirectedTreeDataItem, _super);
    function ForceDirectedTreeDataItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ForceDirectedTreeDataItem;
}(SerialChartDataItem));
export { ForceDirectedTreeDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A main class for [[ForceDirectedTree]] chart type.
 *
 * @see {@link IForceDirectedTreeEvents} for a list of available Events
 * @see {@link IForceDirectedTreeAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/force-directed/} For more information
 * @since 4.3.8
 * @important
 */
var ForceDirectedTree = /** @class */ (function (_super) {
    tslib_1.__extends(ForceDirectedTree, _super);
    /**
     * Constructor
     */
    function ForceDirectedTree() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "ForceDirectedTree";
        _this.seriesContainer.isMeasured = true;
        _this.seriesContainer.layout = "absolute";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Creates and returns a new series of the suitable type.
     *
     * @return New series
     */
    ForceDirectedTree.prototype.createSeries = function () {
        return new ForceDirectedSeries();
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return Data Item
     */
    ForceDirectedTree.prototype.createDataItem = function () {
        return new ForceDirectedTreeDataItem();
    };
    /**
     * Setups the legend to use the chart's data.
     *
     * @ignore
     */
    ForceDirectedTree.prototype.feedLegend = function () {
        var legend = this.legend;
        if (legend) {
            var legendData_1 = [];
            this.series.each(function (series) {
                if (!series.hiddenInLegend) {
                    var dataItems = series.dataItems;
                    if (dataItems.length == 1) {
                        var children = series.dataItems.getIndex(0).children;
                        if (children.length > 0) {
                            dataItems = children;
                        }
                    }
                    dataItems.each(function (dataItem) {
                        if (!dataItem.hiddenInLegend) {
                            legendData_1.push(dataItem);
                            var legendSettings = series.legendSettings;
                            if (legendSettings) {
                                if (legendSettings.labelText) {
                                    legend.labels.template.text = legendSettings.labelText;
                                }
                                if (legendSettings.itemLabelText) {
                                    legend.labels.template.text = legendSettings.itemLabelText;
                                }
                                if (legendSettings.valueText) {
                                    legend.valueLabels.template.text = legendSettings.valueText;
                                }
                                if (legendSettings.itemValueText) {
                                    legend.valueLabels.template.text = legendSettings.itemValueText;
                                }
                            }
                        }
                    });
                }
            });
            legend.data = legendData_1;
            legend.dataFields.name = "name";
        }
    };
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    ForceDirectedTree.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Force directed tree");
        }
    };
    /**
     * Since this chart uses hierarchical data, we need to remove childrent
     * dataField from export of non-hierarchical formats such as CSV and XSLX.
     *
     * @return Export
     */
    ForceDirectedTree.prototype.getExporting = function () {
        var _this = this;
        var exporting = _super.prototype.getExporting.call(this);
        exporting.adapter.add("formatDataFields", function (info) {
            if (info.format == "csv" || info.format == "xlsx") {
                _this.series.each(function (series) {
                    if ($type.hasValue(series.dataFields.children)) {
                        delete info.dataFields[series.dataFields.children];
                    }
                });
            }
            return info;
        });
        return exporting;
    };
    return ForceDirectedTree;
}(SerialChart));
export { ForceDirectedTree };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ForceDirectedTree"] = ForceDirectedTree;
registry.registeredClasses["ForceDirectedTreeDataItem"] = ForceDirectedTreeDataItem;
//# sourceMappingURL=ForceDirectedTree.js.map