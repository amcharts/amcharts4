/**
 * A module with functionality for buildin a scrollbar with an XY graph in it.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Scrollbar } from "../../core/elements/Scrollbar";
import { Sprite } from "../../core/Sprite";
import { List } from "../../core/utils/List";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { XYChart } from "../types/XYChart";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { DesaturateFilter } from "../../core/rendering/filters/DesaturateFilter";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A special version of the Scrollbar that has an XY chart in it.
 *
 * Used mainly as an advanced scrollbar with a preview for other XY charts.
 *
 * However, can be used as standalone element.
 *
 * @see {@link IXYChartScrollbarEvents} for a list of available events
 * @see {@link IXYChartScrollbarAdapters} for a list of available Adapters
 * @important
 */
var XYChartScrollbar = /** @class */ (function (_super) {
    tslib_1.__extends(XYChartScrollbar, _super);
    /**
     * Constructor
     */
    function XYChartScrollbar() {
        var _this = _super.call(this) || this;
        /**
         * A chart element Scrollbar is for.
         *
         * @type {MutableValueDisposer}
         */
        _this._chart = new MutableValueDisposer();
        _this.className = "XYChartScrollbar";
        var interfaceColors = new InterfaceColorSet();
        _this.padding(0, 0, 0, 0);
        var scrollbarChart = _this.createChild(XYChart);
        scrollbarChart.shouldClone = false;
        scrollbarChart.margin(0, 0, 0, 0);
        scrollbarChart.padding(0, 0, 0, 0);
        scrollbarChart.interactionsEnabled = false;
        _this._scrollbarChart = scrollbarChart;
        _this._disposers.push(_this._scrollbarChart);
        _this.minHeight = 60;
        _this.minWidth = 60;
        var unselectedOverlay = _this.createChild(Sprite);
        unselectedOverlay.shouldClone = false;
        unselectedOverlay.setElement(_this.paper.add("path"));
        unselectedOverlay.fill = interfaceColors.getFor("background");
        unselectedOverlay.fillOpacity = 0.8;
        unselectedOverlay.interactionsEnabled = false;
        unselectedOverlay.isMeasured = false;
        unselectedOverlay.toBack();
        _this._unselectedOverlay = unselectedOverlay;
        _this._disposers.push(_this._unselectedOverlay);
        scrollbarChart.toBack();
        _this.background.cornerRadius(0, 0, 0, 0);
        var thumbBackground = _this.thumb.background;
        thumbBackground.cornerRadius(0, 0, 0, 0);
        thumbBackground.fillOpacity = 0;
        thumbBackground.fill = interfaceColors.getFor("background");
        var hoverState = thumbBackground.states.getKey("hover");
        if (hoverState) {
            hoverState.properties.fillOpacity = 0.2;
        }
        var downState = thumbBackground.states.getKey("down");
        if (downState) {
            downState.properties.fillOpacity = 0.4;
        }
        _this._disposers.push(_this._chart);
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(XYChartScrollbar.prototype, "series", {
        /**
         * A list of series that are used to draw graph(s) on the scrollbar.
         *
         * @readonly
         * @return {List<XYSeries>} Series
         */
        get: function () {
            if (!this._series) {
                this._series = new List();
                this._disposers.push(this._series.events.on("inserted", this.handleSeriesAdded, this, false));
                this._disposers.push(this._series.events.on("removed", this.handleSeriesRemoved, this, false));
            }
            return this._series;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorates a new series when they are pushed into a `series` list.
     *
     * @param {IListEvents<XYSeries>["inserted"]} event Event
     */
    XYChartScrollbar.prototype.handleSeriesAdded = function (event) {
        var sourceSeries = event.newValue;
        var scrollbarChart = this.scrollbarChart;
        scrollbarChart.zoomOutButton.disabled = true;
        this.chart = sourceSeries.chart;
        var addXAxis = true;
        var addYAxis = true;
        // check if we haven't added clone of x or y axis before
        $iter.each(this.series.iterator(), function (series) {
            if (series != sourceSeries) {
                if (series.xAxis == sourceSeries.xAxis) {
                    addXAxis = false;
                }
                if (series.yAxis == sourceSeries.yAxis) {
                    addYAxis = false;
                }
            }
        });
        var interfaceColors = new InterfaceColorSet();
        var series = sourceSeries.clone();
        if (addXAxis) {
            var xAxis = sourceSeries.xAxis.clone();
            scrollbarChart.xAxes.moveValue(xAxis);
            xAxis.title.disabled = true;
            xAxis.rangeChangeDuration = 0;
            xAxis.id = sourceSeries.uid;
            xAxis.title.disabled = true;
            var renderer = xAxis.renderer;
            renderer.ticks.template.disabled = true;
            renderer.inside = true;
            renderer.line.strokeOpacity = 0;
            renderer.minLabelPosition = 0.02;
            renderer.maxLabelPosition = 0.98;
            renderer.line.disabled = true;
            renderer.axisFills.template.disabled = true;
            renderer.baseGrid.disabled = true;
            renderer.grid.template.strokeOpacity = 0.05;
            var labelsTemplate = renderer.labels.template;
            labelsTemplate.fillOpacity = 0.5;
            series.xAxis = xAxis;
        }
        else {
            // @todo find clone, otherwise there might be probs with multiple axes
        }
        if (addYAxis) {
            var yAxis = sourceSeries.yAxis.clone();
            scrollbarChart.yAxes.moveValue(yAxis);
            yAxis.title.disabled = true;
            yAxis.rangeChangeDuration = 0;
            var renderer = yAxis.renderer;
            renderer.ticks.template.disabled = true;
            renderer.inside = true;
            renderer.line.strokeOpacity = 0;
            renderer.minLabelPosition = 0.02;
            renderer.maxLabelPosition = 0.98;
            renderer.line.disabled = true;
            renderer.axisFills.template.disabled = true;
            renderer.grid.template.stroke = interfaceColors.getFor("background");
            renderer.baseGrid.disabled = true;
            renderer.grid.template.strokeOpacity = 0.05;
            var labelsTemplate = renderer.labels.template;
            labelsTemplate.fillOpacity = 0.5;
            series.yAxis = yAxis;
        }
        else {
            // @todo find clone, otherwise there might be probs with multiple axes
        }
        series.rangeChangeDuration = 0;
        series.interpolationDuration = 0;
        series.defaultState.transitionDuration = 0;
        series.showOnInit = false;
        this._disposers.push(series.events.on("validated", this.zoomOutAxes, this, false));
        // data might be set drectly on series
        this._disposers.push(sourceSeries.events.on("datavalidated", function () {
            if (series.data != sourceSeries.data) { // data setter doesn't check this
                series.data = sourceSeries.data;
            }
        }, undefined, false));
        series.defaultState.properties.visible = true;
        series.filters.push(new DesaturateFilter());
        scrollbarChart.series.push(series);
        this.updateByOrientation();
    };
    /**
     * @ignore
     */
    XYChartScrollbar.prototype.updateByOrientation = function () {
        var _this = this;
        if (this._scrollbarChart) {
            $iter.each(this._scrollbarChart.xAxes.iterator(), function (xAxis) {
                var renderer = xAxis.renderer;
                if (_this.orientation == "vertical") {
                    renderer.grid.template.disabled = true;
                    renderer.labels.template.disabled = true;
                    renderer.minGridDistance = 10;
                }
                else {
                    renderer.grid.template.disabled = false;
                    renderer.labels.template.disabled = false;
                    renderer.minGridDistance = xAxis.clonedFrom.renderer.minGridDistance;
                }
            });
            $iter.each(this._scrollbarChart.yAxes.iterator(), function (yAxis) {
                var renderer = yAxis.renderer;
                if (_this.orientation == "horizontal") {
                    renderer.grid.template.disabled = true;
                    renderer.labels.template.disabled = true;
                    renderer.minGridDistance = 10;
                }
                else {
                    renderer.grid.template.disabled = false;
                    renderer.labels.template.disabled = false;
                    renderer.minGridDistance = yAxis.clonedFrom.renderer.minGridDistance;
                }
            });
        }
    };
    /**
     * Cleans up after series are removed from Scrollbar.
     *
     * @param {IListEvents<XYSeries>["removed"]}  event  Event
     */
    XYChartScrollbar.prototype.handleSeriesRemoved = function (event) {
        var sourceSeries = event.oldValue;
        sourceSeries.events.off("validated", this.zoomOutAxes, this);
    };
    Object.defineProperty(XYChartScrollbar.prototype, "scrollbarChart", {
        /**
         * A chart element that is used to display graphs in the Scrollbar.
         *
         * This is not the same as `chart`. It's a totally independent instance of
         * [[XYChart]] with separate config, series, etc.
         *
         * It can be configured just like any other [[XYChart]].
         *
         * @readonly
         * @return {XYChart} Scrollbar's internal chart
         */
        get: function () {
            return this._scrollbarChart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChartScrollbar.prototype, "chart", {
        /**
         * @return {XYChart} Chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * A chart that Scrollbar belongs to.
         *
         * @param {XYChart} chart  Chart
         */
        set: function (chart) {
            if (this._chart.get() !== chart) {
                this._chart.set(chart, chart.events.on("datavalidated", this.handleDataChanged, this, false));
                this.handleDataChanged();
                this._scrollbarChart.dataProvider = chart; // this makes scrollbar chart do not validate data untill charts' data is validated
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates Scrollbar's internal chart's data when the main chart's data
     * changes.
     *
     * @ignore Exclude from docs
     */
    XYChartScrollbar.prototype.handleDataChanged = function () {
        //@todo: what if raw data changed?
        if (this.chart.data != this.scrollbarChart.data) {
            this.scrollbarChart.data = this.chart.data;
        }
    };
    /**
     * Zooms out all axes on the internal chart.
     */
    XYChartScrollbar.prototype.zoomOutAxes = function () {
        var scrollbarChart = this.scrollbarChart;
        $iter.each(scrollbarChart.xAxes.iterator(), function (x) {
            x.zoom({ start: 0, end: 1 }, true, true);
        });
        $iter.each(scrollbarChart.yAxes.iterator(), function (y) {
            y.zoom({ start: 0, end: 1 }, true, true);
        });
    };
    /**
     * Updates scrollbar thumb.
     */
    XYChartScrollbar.prototype.updateThumb = function () {
        _super.prototype.updateThumb.call(this);
        if (this._unselectedOverlay) {
            var thumb = this.thumb;
            var x = thumb.pixelX || 0;
            var y = thumb.pixelY || 0;
            var w = thumb.pixelWidth || 0;
            var h = thumb.pixelHeight || 0;
            var path = "";
            if (this.orientation == "horizontal") {
                path = $path.rectToPath({
                    x: -1,
                    y: 0,
                    width: x,
                    height: h
                });
                path += $path.rectToPath({
                    x: x + w,
                    y: 0,
                    width: (this.pixelWidth || 0) - x - w,
                    height: h
                });
            }
            else {
                path = $path.rectToPath({
                    x: 0,
                    y: 0,
                    width: w,
                    height: y
                });
                path += $path.rectToPath({
                    x: 0,
                    y: y + h,
                    width: w,
                    height: (this.pixelHeight || 0) - y - h
                });
            }
            this._unselectedOverlay.path = path;
        }
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    XYChartScrollbar.prototype.processConfig = function (config) {
        if (config) {
            if ($type.hasValue(config.series) && $type.isArray(config.series)) {
                for (var i = 0, len = config.series.length; i < len; i++) {
                    var series = config.series[i];
                    if ($type.hasValue(series) && $type.isString(series)) {
                        if (this.map.hasKey(series)) {
                            config.series[i] = this.map.getKey(series);
                        }
                        else {
                            throw Error("XYChartScrollbar error: Series with id `" + series + "` does not exist.");
                        }
                    }
                }
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return XYChartScrollbar;
}(Scrollbar));
export { XYChartScrollbar };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYChartScrollbar"] = XYChartScrollbar;
//# sourceMappingURL=XYChartScrollbar.js.map