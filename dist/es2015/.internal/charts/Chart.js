/**
 * [[Chart]] class provides base functionality for all chart types to inherit.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Component } from "../core/Component";
import { registry } from "../core/Registry";
import { ListTemplate, ListDisposer } from "../core/utils/List";
import { Container } from "../core/Container";
import { Label } from "../core/elements/Label";
import { DataItem } from "../core/DataItem";
import { percent } from "../core/utils/Percent";
import * as $iter from "../core/utils/Iterator";
import * as $type from "../core/utils/Type";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[Chart]].
 *
 * @see {@link DataItem}
 */
var ChartDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(ChartDataItem, _super);
    /**
     * Constructor
     */
    function ChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "ChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return ChartDataItem;
}(DataItem));
export { ChartDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for all Charts.
 *
 * @see {@link IChartEvents} for a list of available Events
 * @see {@link IChartAdapters} for a list of available Adapters
 */
var Chart = /** @class */ (function (_super) {
    tslib_1.__extends(Chart, _super);
    /**
     * Constructor
     */
    function Chart() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "Chart";
        // Create a list of titles
        var template = new Label();
        _this.titles = new ListTemplate(template);
        _this._disposers.push(new ListDisposer(_this.titles));
        _this._disposers.push(template);
        // Chart component is also a container. it holds _chartAndLegendCont and titles
        _this.width = percent(100);
        _this.height = percent(100);
        _this.layout = "vertical";
        // Chart and legend
        var chartAndLegendContainer = _this.createChild(Container);
        chartAndLegendContainer.shouldClone = false;
        chartAndLegendContainer.layout = "vertical";
        chartAndLegendContainer.width = percent(100);
        chartAndLegendContainer.height = percent(100);
        _this.chartAndLegendContainer = chartAndLegendContainer;
        // Chart container holds all the elements of a chart, extept titles and legend
        var chartContainer = chartAndLegendContainer.createChild(Container);
        chartContainer.shouldClone = false;
        chartContainer.width = percent(100);
        chartContainer.height = percent(100);
        _this.chartContainer = chartContainer;
        // hides everything on first frame and shows only on second. helps to avoid technical flickering
        chartAndLegendContainer.visible = false;
        chartAndLegendContainer.events.once("validated", function () {
            registry.events.once("enterframe", function () {
                chartAndLegendContainer.visible = true;
            });
        });
        // Add title list events to apply certain formatting options and to make
        // the chart reference them as accessible screen reader labels
        _this.titles.events.on("inserted", function (label) {
            _this.processTitle(label);
            _this.updateReaderTitleReferences();
        }, _this);
        _this.titles.events.on("removed", function (label) {
            _this.updateReaderTitleReferences();
        }, _this);
        // Accessibility
        // It seems we can't set focusable on the whole chart because it seems to
        // mess up the whole focus event system - getting a focus on an inside
        // object also trigger focus on parent
        //this.focusable = true;
        _this.role = "region";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    Chart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Chart");
        }
    };
    /**
     * Initiates drawing of the chart.
     *
     * @ignore Exclude from docs
     */
    Chart.prototype.draw = function () {
        this.fixLayout();
        _super.prototype.draw.call(this);
    };
    /**
     * Updates legend's hierarchy based on the position.
     */
    Chart.prototype.fixLayout = function () {
        var legend = this.legend;
        if (legend) {
            var chartAndLegendContainer = this.chartAndLegendContainer;
            switch (legend.position) {
                case "left":
                    chartAndLegendContainer.layout = "horizontal";
                    if (!$type.isNumber(legend.width)) {
                        legend.width = 200;
                    }
                    //legend.maxWidth = legend.width;
                    legend.toBack();
                    break;
                case "right":
                    chartAndLegendContainer.layout = "horizontal";
                    if (!$type.isNumber(legend.width)) {
                        legend.width = 200;
                    }
                    //legend.maxWidth = legend.width;
                    legend.toFront();
                    break;
                case "top":
                    chartAndLegendContainer.layout = "vertical";
                    legend.maxWidth = undefined;
                    legend.toBack();
                    break;
                case "bottom":
                    chartAndLegendContainer.layout = "vertical";
                    legend.maxWidth = undefined;
                    legend.toFront();
            }
        }
    };
    /**
     * Setups the legend to use the chart's data.
     */
    Chart.prototype.feedLegend = function () {
        // Nothing here. This method is provided only as a "placeholder" for
        // extending classes to override
    };
    /**
     * Adds a new title to the chart when it is inserted into chart's titles
     * list.
     * @param  {IListEvents<Label>["inserted"]}  event  An event object which is triggered when inserting into titles list
     * @return {Label}                               Label object
     */
    Chart.prototype.processTitle = function (event) {
        var title = event.newValue;
        title.parent = this;
        title.toBack();
        title.align = "center";
        // Need to explicitly apply the `id` attribute so it can be referenced by
        // `aria-labelledby`
        title.uidAttr();
        return title;
    };
    /**
     * Checks if chart has any title elements. If it does, we will use them in an
     * `aria-labelledby` attribute so that screen readers can use them to properly
     * describe the chart when it is focused or hovered.
     *
     * @ignore Exclude from docs
     */
    Chart.prototype.updateReaderTitleReferences = function () {
        if (this.titles.length) {
            var titleIds_1 = [];
            $iter.each(this.titles.iterator(), function (title) {
                titleIds_1.push(title.uid);
            });
            this.setSVGAttribute({ "aria-labelledby": titleIds_1.join(" ") });
        }
        else {
            this.removeSVGAttribute("aria-labelledby");
        }
    };
    Object.defineProperty(Chart.prototype, "legend", {
        /**
         * @return {Legend} Legend
         */
        get: function () {
            return this._legend;
        },
        /**
         * Holds the instance of chart's [[Leged]].
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/legend/} for more information about legends
         * @param {Legend} Legend
         */
        set: function (legend) {
            this.setLegend(legend);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Prepares the legend instance for use in this chart.
     *
     * @param {Legend}  legend  Legend
     */
    Chart.prototype.setLegend = function (legend) {
        var _this = this;
        if (this._legend != legend) {
            if (this._legend) {
                this.removeDispose(this._legend);
            }
            this._legend = legend;
            if (legend) {
                this._disposers.push(legend);
                // Set legend options
                legend.parent = this.chartAndLegendContainer;
                legend.events.on("propertychanged", function (event) {
                    if (event.property == "position" || event.property == "width") {
                        _this.fixLayout();
                    }
                });
            }
            this.feedLegend();
        }
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    Chart.prototype.processConfig = function (config) {
        if (config) {
            // Set up legend
            if ($type.hasValue(config.legend) && !$type.hasValue(config.legend.type)) {
                config.legend.type = "Legend";
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return Chart;
}(Component));
export { Chart };
//# sourceMappingURL=Chart.js.map