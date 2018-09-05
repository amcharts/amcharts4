/**
 * XY Chart module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, SerialChartDataItem } from "./SerialChart";
import { Container } from "../../core/Container";
import { List } from "../../core/utils/List";
import { AxisRendererX } from "../axes/AxisRendererX";
import { AxisRendererY } from "../axes/AxisRendererY";
import { CategoryAxis } from "../axes/CategoryAxis";
import { XYSeries } from "../series/XYSeries";
import { XYCursor } from "../cursors/XYCursor";
import { ZoomOutButton } from "../../core/elements/ZoomOutButton";
import { percent } from "../../core/utils/Percent";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $utils from "../../core/utils/Utils";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[XYChart]].
 *
 * @see {@link DataItem}
 */
var XYChartDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(XYChartDataItem, _super);
    /**
     * Constructor
     */
    function XYChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "XYChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return XYChartDataItem;
}(SerialChartDataItem));
export { XYChartDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates an XY chart, and any derivative chart, like Serial, Date-based, etc.
 *
 * Basically this is a chart type, that is used to display any chart
 * information in a square plot area.
 *
 * The horizontal and vertical scale is determined by the type of Axis.
 *
 * The plot types are determined by type of Series.
 *
 * ```TypeScript
 * // Includes
 * import * as am4core from "@amcharts/amcharts4/core";
 * import * as am4charts from "@amcharts/amcharts4/charts";
 *
 * // Create chart
 * let chart = am4core.create("chartdiv", am4charts.XYChart);
 *
 * // Add Data
 * chart.data = [{
 * "country": "USA",
 * "visits": 3025
 * }, {
 * 	"country": "China",
 * 	"visits": 1882
 * }, {
 * 	"country": "Japan",
 * 	"visits": 1809
 * }];
 *
 * // Add category axis
 * let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 * categoryAxis.dataFields.category = "country";
 *
 * // Add value axis
 * let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 *
 * // Add series
 * let series = chart.series.push(new am4charts.ColumnSeries());
 * series.name = "Web Traffic";
 * series.dataFields.categoryX = "country";
 * series.dataFields.valueY = "visits";
 * ```
 * ```JavaScript
 * // Create chart
 * var chart = am4core.create("chartdiv", am4charts.XYChart);
 *
 * // The following would work as well:
 * // var chart = am4core.create("chartdiv", "XYChart");
 *
 * // Add Data
 * chart.data = [{
 * "country": "USA",
 * "visits": 3025
 * }, {
 * 	"country": "China",
 * 	"visits": 1882
 * }, {
 * 	"country": "Japan",
 * 	"visits": 1809
 * }];
 *
 * // Add category axis
 * var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 * categoryAxis.dataFields.category = "country";
 *
 * // Add value axis
 * var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 *
 * // Add series
 * var series = chart.series.push(new am4charts.ColumnSeries());
 * series.name = "Web Traffic";
 * series.dataFields.categoryX = "country";
 * series.dataFields.valueY = "visits";
 * ```
 * ```JSON
 * var chart = am4core.createFromConfig({
 *
 * 	// Category axis
 * 	"xAxes": [{
 * 		"type": "CategoryAxis",
 * 		"dataFields": {
 * 			"category": "country"
 * 		}
 * 	}],
 *
 * 	// Value axis
 * 	"yAxes": [{
 * 		"type": "ValueAxis"
 * 	}],
 *
 * 	// Series
 * 	"series": [{
 * 		"type": "ColumnSeries",
 * 		"dataFields": {
 * 			"categoryX": "country",
 * 			"valueY": "visits"
 * 		},
 * 		"name": "Web Traffic"
 * 	}],
 *
 * 	// Cursor
 * 	"cursor": {},
 *
 * 	// Data
 * 	"data": [{
 * 		"country": "USA",
 * 		"visits": 3025
 * 	}, {
 * 		"country": "China",
 * 		"visits": 1882
 * 	}, {
 * 		"country": "Japan",
 * 		"visits": 1809
 * 	}]
 *
 * }, "chartdiv", "XYChart");
 * ```
 *
 *
 * @see {@link IXYChartEvents} for a list of available Events
 * @see {@link IXYChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/} for documentation
 * @important
 */
var XYChart = /** @class */ (function (_super) {
    tslib_1.__extends(XYChart, _super);
    /**
     * Constructor
     */
    function XYChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Defines the type of horizontal axis rederer.
         *
         * @type {typeof AxisRendererX}
         */
        _this._axisRendererX = AxisRendererX;
        /**
         * Defines the type of vertical axis rederer.
         *
         * @type {typeof AxisRendererY}
         */
        _this._axisRendererY = AxisRendererY;
        _this.className = "XYChart";
        // Set defaults
        //this.margin(10, 10, 10, 10);
        _this.maskBullets = true;
        // Create main chart container
        var chartContainer = _this.chartContainer;
        chartContainer.layout = "vertical";
        _this.padding(15, 15, 15, 15);
        // Create top axes container
        var topAxesCont = chartContainer.createChild(Container);
        topAxesCont.shouldClone = false;
        topAxesCont.layout = "vertical";
        topAxesCont.width = percent(100);
        topAxesCont.zIndex = 1;
        _this.topAxesContainer = topAxesCont;
        // Create vertical axes and plot area container
        // Plot area and vertical axes share the whole width of the chart,
        // so we need to put then into a separate container so that layouting
        // engine takes care of the positioning
        var yAxesAndPlotCont = chartContainer.createChild(Container);
        yAxesAndPlotCont.shouldClone = false;
        yAxesAndPlotCont.layout = "horizontal";
        yAxesAndPlotCont.width = percent(100);
        yAxesAndPlotCont.height = percent(100);
        yAxesAndPlotCont.zIndex = 0;
        _this.yAxesAndPlotContainer = yAxesAndPlotCont;
        // Create a container for bottom axes
        var bottomAxesCont = chartContainer.createChild(Container);
        bottomAxesCont.shouldClone = false;
        bottomAxesCont.width = percent(100);
        bottomAxesCont.layout = "vertical";
        bottomAxesCont.zIndex = 1;
        _this.bottomAxesContainer = bottomAxesCont;
        // Create a container for left-side axes
        var leftAxesCont = yAxesAndPlotCont.createChild(Container);
        leftAxesCont.shouldClone = false;
        leftAxesCont.layout = "horizontal";
        leftAxesCont.height = percent(100);
        leftAxesCont.contentAlign = "right";
        leftAxesCont.events.on("transformed", _this.updateXAxesMargins, _this);
        leftAxesCont.zIndex = 1;
        _this.leftAxesContainer = leftAxesCont;
        // Create a container for plot area
        var plotCont = yAxesAndPlotCont.createChild(Container);
        plotCont.shouldClone = false;
        plotCont.height = percent(100);
        plotCont.width = percent(100);
        _this.plotContainer = plotCont;
        // must go below plot container
        _this.mouseWheelBehavior = "zoomX";
        _this._cursorContainer = plotCont;
        // Create a container for right-side axes
        var rightAxesCont = yAxesAndPlotCont.createChild(Container);
        rightAxesCont.shouldClone = false;
        rightAxesCont.layout = "horizontal";
        rightAxesCont.height = percent(100);
        rightAxesCont.zIndex = 1;
        rightAxesCont.events.on("transformed", _this.updateXAxesMargins, _this);
        _this.rightAxesContainer = rightAxesCont;
        _this.seriesContainer.parent = plotCont;
        _this.bulletsContainer.parent = plotCont;
        var zoomOutButton = plotCont.createChild(ZoomOutButton);
        zoomOutButton.shouldClone = false;
        zoomOutButton.align = "right";
        zoomOutButton.valign = "top";
        zoomOutButton.zIndex = Number.MAX_SAFE_INTEGER;
        zoomOutButton.marginTop = 5;
        zoomOutButton.marginRight = 5;
        zoomOutButton.hide(0);
        _this.zoomOutButton = zoomOutButton;
        _this._bulletMask = _this.plotContainer;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    XYChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("X/Y chart");
        }
    };
    /**
     * Draws the chart.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.seriesContainer.toFront();
        this.bulletsContainer.toFront();
        if (this.maskBullets) {
            this.bulletsContainer.mask = this._bulletMask;
        }
    };
    /**
     * Triggers a redrawing of all chart's series.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.updatePlotElements = function () {
        $iter.each(this.series.iterator(), function (series) {
            series.invalidate();
        });
    };
    /**
     * Triggers data (re)validation which in turn can cause a redraw of the
     * whole chart or just aprticular series / elements.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.validateData = function () {
        // tell axes that data changed
        if (this._parseDataFrom == 0) {
            $iter.each(this.xAxes.iterator(), function (axis) {
                axis.dataChangeUpdate();
            });
            $iter.each(this.yAxes.iterator(), function (axis) {
                axis.dataChangeUpdate();
            });
        }
        //$iter.each(this.series.iterator(), (series) => {
        //	series.appeared = false;
        //});		
        _super.prototype.validateData.call(this);
        // reset minimums
        this.leftAxesContainer.minWidth = undefined;
        this.rightAxesContainer.minWidth = undefined;
    };
    /**
     * Updates margins for horizontal axes based on settings and available space.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.updateXAxesMargins = function () {
        var leftAxesWidth = this.leftAxesContainer.measuredWidth;
        var rightAxesWidth = this.rightAxesContainer.measuredWidth;
        var bottomAxesCont = this.bottomAxesContainer;
        if (bottomAxesCont.paddingLeft != leftAxesWidth || bottomAxesCont.paddingRight != rightAxesWidth) {
            bottomAxesCont.paddingLeft = leftAxesWidth;
            bottomAxesCont.paddingRight = rightAxesWidth;
        }
        var topAxesCont = this.topAxesContainer;
        if (topAxesCont.paddingLeft != leftAxesWidth || topAxesCont.paddingRight != rightAxesWidth) {
            topAxesCont.paddingLeft = leftAxesWidth;
            topAxesCont.paddingRight = rightAxesWidth;
        }
    };
    /**
     * Triggers an update on the horizontal axis when one of its properties
     * change.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Axis, ISpriteEvents>["propertychanged"]} event An event object
     */
    XYChart.prototype.handleXAxisChange = function (event) {
        this.updateXAxis(event.target);
    };
    /**
     * Triggers an update on the vertical axis when one of its properties
     * change.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Axis, ISpriteEvents>["propertychanged"]} event An event object
     */
    XYChart.prototype.handleYAxisChange = function (event) {
        this.updateYAxis(event.target);
    };
    /**
     * Sets up a new horizontal (X) axis when it is added to the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Axis>["inserted"]}  event  Axis insert event
     */
    XYChart.prototype.processXAxis = function (event) {
        var axis = event.newValue;
        axis.chart = this;
        axis.renderer = new this._axisRendererX();
        axis.axisLetter = "X";
        axis.renderer.observe(["opposite", "inside", "inversed", "minGridDistance"], this.handleXAxisChange, this);
        axis.events.on("datarangechanged", this.handleXAxisRangeChange, this);
        // Although axis does not use data directly, we set dataProvider here
        // (but not add to chart data users) to hold up rendering before data
        // is parsed (system handles this)
        axis.dataProvider = this;
        this.updateXAxis(axis.renderer);
        this.processAxis(axis);
    };
    /**
     * Removes events from the Axis when it is removed from the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Axis>["removed"]}  event  Event
     */
    XYChart.prototype.processXAxisRemoval = function (event) {
        var axis = event.oldValue;
        axis.events.off("datarangechanged", this.handleXAxisRangeChange, this);
    };
    /**
     * Sets up a new vertical (Y) axis when it is added to the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Axis>["inserted"]} event Axis insert event
     */
    XYChart.prototype.processYAxis = function (event) {
        var axis = event.newValue;
        axis.chart = this;
        axis.renderer = new this._axisRendererY();
        axis.axisLetter = "Y";
        axis.renderer.observe(["opposite", "inside", "inversed", "minGridDistance"], this.handleYAxisChange, this);
        axis.events.on("datarangechanged", this.handleYAxisRangeChange, this);
        // Although axis does not use data directly, we set dataProvider here
        // (but not add to chart data users) to hold up rendering before data
        // is parsed (system handles this)
        axis.dataProvider = this;
        this.updateYAxis(axis.renderer);
        this.processAxis(axis);
    };
    /**
     * Removes events from the Axis when it is removed from the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Axis>["removed"]}  event  Event
     */
    XYChart.prototype.processYAxisRemoval = function (event) {
        var axis = event.oldValue;
        axis.events.off("datarangechanged", this.handleYAxisRangeChange, this);
    };
    /**
     * Updates horizontal (X) scrollbar and other horizontal axis whenever axis'
     * value range changes.
     *
     * @param {AMEvent<Axis, IComponentEvents>["datarangechanged"]} event Range change event
     */
    XYChart.prototype.handleXAxisRangeChange = function (event) {
        var range = this.getCommonAxisRange(this.xAxes);
        if (this.scrollbarX) {
            this.zoomAxes(this.xAxes, range, true);
        }
        this.toggleZoomOutButton();
        this.updateScrollbar(this.scrollbarX, range);
    };
    /**
     * Shows or hides the Zoom Out button depending on whether the chart is fully
     * zoomed out or not.
     */
    XYChart.prototype.toggleZoomOutButton = function () {
        if (this.zoomOutButton) {
            var show_1 = false;
            $iter.eachContinue(this.xAxes.iterator(), function (axis) {
                if ($math.round(axis.start, 3) != 0 || $math.round(axis.end, 3) != 1) {
                    show_1 = true;
                    return false;
                }
                return true;
            });
            $iter.eachContinue(this.yAxes.iterator(), function (axis) {
                if ($math.round(axis.start, 3) != 0 || $math.round(axis.end, 3) != 1) {
                    show_1 = true;
                    return false;
                }
                return true;
            });
            if (!this.seriesAppeared) {
                show_1 = false;
            }
            if (show_1) {
                this.zoomOutButton.show();
            }
            else {
                this.zoomOutButton.hide();
            }
        }
    };
    /**
     * @ignore
     * moved this check to a separate method so that we could override it in TreeMapSeries
     */
    XYChart.prototype.seriesAppeared = function () {
        var appeared = false;
        $iter.each(this.series.iterator(), function (series) {
            if (!series.appeared) {
                appeared = false;
                return false;
            }
        });
        return appeared;
    };
    /**
     * Updates vertical (Y) scrollbar and other horizontal axis whenever axis'
     * value range changes.
     *
     * @param {AMEvent<Axis, IComponentEvents>["datarangechanged"]} event Range change event
     */
    XYChart.prototype.handleYAxisRangeChange = function (event) {
        var range = this.getCommonAxisRange(this.yAxes);
        if (this.scrollbarY) {
            this.zoomAxes(this.yAxes, range, true);
        }
        this.toggleZoomOutButton();
        this.updateScrollbar(this.scrollbarY, range);
    };
    /**
     * Updates a relative scrollbar whenever data range of the axis changes.
     *
     * @param {Scrollbar}  scrollbar  Scrollbar instance
     * @param {IRange}     range      New data (values) range of the axis
     */
    XYChart.prototype.updateScrollbar = function (scrollbar, range) {
        if (scrollbar) {
            scrollbar.skipRangeEvents();
            scrollbar.start = range.start;
            scrollbar.end = range.end;
        }
    };
    /**
     * Returns a common range of values between a list of axes.
     *
     * This is used to synchronize the zoom between multiple axes.
     *
     * @ignore Exclude from docs
     * @param  {List<Axis>}  axes  A list of axes
     * @return {IRange}            Common value range
     */
    XYChart.prototype.getCommonAxisRange = function (axes) {
        var start;
        var end;
        $iter.each(axes.iterator(), function (axis) {
            var axisStart = axis.start;
            var axisEnd = axis.end;
            if (axis.renderer.inversed) {
                axisStart = 1 - axis.end;
                axisEnd = 1 - axis.start;
            }
            if (!$type.isNumber(start) || (axisStart < start)) {
                start = axisStart;
            }
            if (!$type.isNumber(end) || (axisEnd > end)) {
                end = axisEnd;
            }
        });
        return { start: start, end: end };
    };
    /**
     * Triggers (re)rendering of the horizontal (X) axis.
     *
     * @ignore Exclude from docs
     * @param {Axis}  axis  Axis
     */
    XYChart.prototype.updateXAxis = function (renderer) {
        var axis = renderer.axis;
        if (renderer.opposite) {
            axis.parent = this.topAxesContainer;
            axis.toFront();
        }
        else {
            axis.parent = this.bottomAxesContainer;
            axis.toBack();
        }
        if (axis.renderer) {
            axis.renderer.processRenderer();
        }
    };
    /**
     * Triggers (re)rendering of the vertical (Y) axis.
     *
     * @ignore Exclude from docs
     * @param {Axis}  axis  Axis
     */
    XYChart.prototype.updateYAxis = function (renderer) {
        var axis = renderer.axis;
        if (renderer.opposite) {
            axis.parent = this.rightAxesContainer;
            axis.toBack();
        }
        else {
            axis.parent = this.leftAxesContainer;
            axis.toFront();
        }
        if (axis.renderer) {
            axis.renderer.processRenderer();
        }
    };
    /**
     * Decorates an Axis for use with this chart, e.g. sets proper renderer
     * and containers for placement.
     *
     * @param {Axis}  axis  Axis
     */
    XYChart.prototype.processAxis = function (axis) {
        // Value axis does not use data directly, only category axis does
        if (axis instanceof CategoryAxis) {
            this._dataUsers.moveValue(axis);
        }
        var renderer = axis.renderer;
        renderer.gridContainer.parent = this.plotContainer;
        renderer.gridContainer.toBack();
        renderer.breakContainer.parent = this.plotContainer;
        renderer.breakContainer.toFront();
        renderer.breakContainer.zIndex = 10;
        this.plotContainer.events.on("maxsizechanged", function (event) {
            axis.invalidateDataItems();
        });
    };
    Object.defineProperty(XYChart.prototype, "xAxes", {
        /**
         * A list of horizontal (X) axes.
         *
         * @return {List<Axis>} List of axes
         */
        get: function () {
            if (!this._xAxes) {
                this._xAxes = new List();
                this._xAxes.events.on("inserted", this.processXAxis, this);
                this._xAxes.events.on("removed", this.processXAxisRemoval, this);
            }
            return this._xAxes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChart.prototype, "yAxes", {
        /**
         * A list of vertical (Y) axes.
         *
         * @return {List<Axis>} List of axes
         */
        get: function () {
            if (!this._yAxes) {
                this._yAxes = new List();
                this._yAxes.events.on("inserted", this.processYAxis, this);
                this._yAxes.events.on("removed", this.processYAxisRemoval, this);
            }
            return this._yAxes;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorates a new [[XYSeries]] object with required parameters when it is
     * added to the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<XYSeries>["inserted"]}  event  Event
     */
    XYChart.prototype.handleSeriesAdded = function (event) {
        try {
            _super.prototype.handleSeriesAdded.call(this, event);
            var series = event.newValue;
            series.xAxis; // this is enough to get axis, handled in getter
            series.yAxis; // this is enough to get axis, handled in getter
            if (series.fill == undefined) {
                series.fill = this.colors.next();
            }
            if (series.stroke == undefined) {
                series.stroke = series.fill;
            }
        }
        catch (e) {
            this.raiseCriticalError(e);
        }
    };
    Object.defineProperty(XYChart.prototype, "cursor", {
        /**
         * @return {XYCursor} Cursor
         */
        get: function () {
            return this._cursor;
        },
        /**
         * Chart's [[Cursor]].
         *
         * @param {XYCursor}  cursor  Cursor
         */
        set: function (cursor) {
            if (this._cursor != cursor) {
                if (this._cursor) {
                    this.removeDispose(this._cursor);
                }
                this._cursor = cursor;
                if (cursor) {
                    // TODO this is wrong, fix it
                    this._disposers.push(cursor);
                    cursor.chart = this;
                    cursor.parent = this._cursorContainer;
                    cursor.events.on("cursorpositionchanged", this.handleCursorPositionChange, this);
                    cursor.events.on("zoomstarted", this.handleCursorZoomStart, this);
                    cursor.events.on("zoomended", this.handleCursorZoomEnd, this);
                    cursor.events.on("panstarted", this.handleCursorPanStart, this);
                    cursor.events.on("panning", this.handleCursorPanning, this);
                    cursor.events.on("panended", this.handleCursorPanEnd, this);
                    cursor.events.on("behaviorcanceled", this.handleCursorCanceled, this);
                    cursor.events.on("hidden", this.handleHideCursor, this);
                    cursor.zIndex = Number.MAX_SAFE_INTEGER - 1;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and returns a new [[Cursor]] suitable for this chart type.
     *
     * @return {this} New cursor
     */
    XYChart.prototype.createCursor = function () {
        return new XYCursor();
    };
    /**
     * Performs tasks when the cursor's position changes, e.g. shows proper
     * tooltips on axes and series.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.handleCursorPositionChange = function () {
        if (this.cursor.visible && !this.cursor.isHiding) {
            var xPosition = this.cursor.xPosition;
            var yPosition = this.cursor.yPosition;
            this.showAxisTooltip(this.xAxes, xPosition);
            this.showAxisTooltip(this.yAxes, yPosition);
            this.showSeriesTooltip({
                x: xPosition,
                y: yPosition
            });
        }
    };
    /**
     * Hides all cursor-related tooltips when the cursor itself is hidden.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.handleHideCursor = function () {
        this.hideObjectTooltip(this.xAxes);
        this.hideObjectTooltip(this.yAxes);
        this.hideObjectTooltip(this.series);
        this.updateSeriesLegend();
    };
    /**
     * Updates values for each series' legend item.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.updateSeriesLegend = function () {
        $iter.each(this.series.iterator(), function (series) {
            series.updateLegendValue();
        });
    };
    /**
     * Hides a tooltip for a list of objects.
     *
     * @ignore Exclude from docs
     * @param {List<Sprite>}  sprites  A list of sprites to hide tooltip for
     */
    XYChart.prototype.hideObjectTooltip = function (sprites) {
        $iter.each(sprites.iterator(), function (sprite) {
            sprite.tooltip.hide(0);
        });
    };
    /**
     * Shows a tooltip for all chart's series, using specific coordinates as a
     * reference point.
     *
     * The tooltip might be shown at different coordinates depending on the
     * actual data point's position, overlapping with other tooltips, etc.
     *
     * @ignore Exclude from docs
     * @param {IPoint}  position  Reference point
     */
    XYChart.prototype.showSeriesTooltip = function (position) {
        var _this = this;
        var topLeft = $utils.spritePointToSvg({ x: -0.5, y: -0.5 }, this.plotContainer);
        var bottomRight = $utils.spritePointToSvg({ x: this.plotContainer.pixelWidth + 0.5, y: this.plotContainer.pixelHeight + 0.5 }, this.plotContainer);
        var seriesPoints = [];
        this.series.each(function (series) {
            if (series.tooltipText || series.tooltipHTML) {
                series.tooltip.setBounds({ x: 0, y: 0, width: _this.pixelWidth, height: _this.pixelHeight });
                var point = series.showTooltipAtPosition(position.x, position.y);
                if (point && $math.isInRectangle(point, { x: topLeft.x, y: topLeft.y, width: bottomRight.x - topLeft.x, height: bottomRight.y - topLeft.y })) {
                    seriesPoints.push({ point: point, series: series });
                }
                else {
                    series.tooltip.hide(0);
                }
            }
        });
        seriesPoints.sort(function (a, b) {
            if (a.point.y > b.point.y) {
                return 1;
            }
            else {
                return 0;
            }
        });
        if (seriesPoints.length > 0) {
            var top_1 = topLeft.y;
            var bottom = bottomRight.y;
            var topSeriesPoints = [];
            var botSeriesPoints = [];
            for (var i = 0; i < seriesPoints.length; i++) {
                if (seriesPoints[i].point.y < top_1 + (bottom - top_1) / 2) {
                    topSeriesPoints.push(seriesPoints[i]);
                }
                else {
                    botSeriesPoints.push(seriesPoints[i]);
                }
            }
            var nextY = top_1;
            //@todo: solve overlapping when tooltips are close to center
            for (var i = 0; i < topSeriesPoints.length; i++) {
                var series = topSeriesPoints[i].series;
                var pointY = topSeriesPoints[i].point.y;
                var tooltip = series.tooltip;
                tooltip.setBounds({ x: 0, y: nextY, width: this.pixelWidth, height: bottom });
                if (tooltip.invalid) {
                    tooltip.validate();
                }
                tooltip.toBack();
                //@labeltodo
                nextY = $utils.spritePointToSvg({ x: 0, y: tooltip.label.pixelY + tooltip.label.measuredHeight - tooltip.pixelY + pointY + tooltip.pixelMarginBottom }, tooltip).y;
            }
            var nextHeight = bottom;
            for (var i = botSeriesPoints.length - 1; i >= 0; i--) {
                var series = botSeriesPoints[i].series;
                var tooltip = series.tooltip;
                var pointY = botSeriesPoints[i].point.y;
                tooltip.setBounds({ x: 0, y: 0, width: this.pixelWidth, height: nextHeight });
                if (tooltip.invalid) {
                    tooltip.validate();
                }
                tooltip.toBack();
                //@labeltodo
                nextHeight = $utils.spritePointToSvg({ x: 0, y: tooltip.label.pixelY - tooltip.pixelY + pointY - tooltip.pixelMarginTop }, tooltip).y;
            }
        }
    };
    /**
     * Shows tooltips for a list of axes at specific position.
     *
     * Position might be X coordinate for horizontal axes, and Y coordinate for
     * vertical axes.
     *
     * @ignore Exclude from docs
     * @param {List<Axis>}  axes      List of axes to show tooltip on
     * @param {number}      position  Position (px)
     */
    XYChart.prototype.showAxisTooltip = function (axes, position) {
        var _this = this;
        $iter.each(axes.iterator(), function (axis) {
            if (_this.dataItems.length > 0 || axis.dataItems.length > 0) {
                axis.showTooltipAtPosition(position);
            }
        });
    };
    /**
     * Recalculates the value range for the axis taking into account zoom level & inversed.
     *
     * @param  {Axis}    axis   Axis
     * @param  {IRange}  range  Range
     * @return {IRange}         Modified range
     */
    XYChart.prototype.getUpdatedRange = function (axis, range) {
        var start;
        var end;
        var inversed = axis.renderer.inversed;
        if (axis.renderer instanceof AxisRendererY) {
            range = $math.invertRange(range);
        }
        if (inversed) {
            $math.invertRange(range);
            start = 1 - axis.end;
            end = 1 - axis.start;
        }
        else {
            start = axis.start;
            end = axis.end;
        }
        var difference = end - start;
        return {
            start: start + range.start * difference,
            end: start + range.end * difference
        };
    };
    /**
     * Performs zoom and other operations when user finishes zooming using chart
     * cursor, e.g. zooms axes.
     *
     * @param {IXYCursorEvents["zoomended"]} event Cursor's event
     */
    XYChart.prototype.handleCursorZoomEnd = function (event) {
        var cursor = this.cursor;
        var behavior = cursor.behavior;
        if (behavior == "zoomX" || behavior == "zoomXY") {
            var xRange = cursor.xRange;
            if (xRange) {
                xRange = this.getUpdatedRange(this.xAxes.getIndex(0), xRange);
                xRange.priority = "start";
                this.zoomAxes(this.xAxes, xRange);
            }
        }
        if (behavior == "zoomY" || behavior == "zoomXY") {
            var yRange = cursor.yRange;
            if (yRange) {
                yRange = this.getUpdatedRange(this.yAxes.getIndex(0), yRange);
                yRange.priority = "start";
                this.zoomAxes(this.yAxes, yRange);
            }
        }
        this.handleHideCursor();
    };
    /**
     * Performs zoom and other operations when user is panning chart plot using chart cursor.
     *
     * @param {IXYCursorEvents["panning"]} event Cursor's event
     */
    XYChart.prototype.handleCursorPanStart = function (event) {
        var xAxis = this.xAxes.getIndex(0);
        if (xAxis) {
            this._panStartXRange = { start: xAxis.start, end: xAxis.end };
        }
        var yAxis = this.yAxes.getIndex(0);
        if (yAxis) {
            this._panStartYRange = { start: yAxis.start, end: yAxis.end };
        }
    };
    /**
     * Performs zoom and other operations when user ends panning
     *
     * @param {IXYCursorEvents["panning"]} event Cursor's event
     */
    XYChart.prototype.handleCursorPanEnd = function (event) {
        var cursor = this.cursor;
        var behavior = cursor.behavior;
        if (this._panEndXRange && (behavior == "panX" || behavior == "panXY")) {
            var panEndRange = this._panEndXRange;
            var delta = 0;
            if (panEndRange.start < 0) {
                delta = panEndRange.start;
            }
            if (panEndRange.end > 1) {
                delta = panEndRange.end - 1;
            }
            this.zoomAxes(this.xAxes, { start: panEndRange.start - delta, end: panEndRange.end - delta }, false, true);
            this._panEndXRange = undefined;
            this._panStartXRange = undefined;
        }
        if (this._panEndYRange && (behavior == "panY" || behavior == "panXY")) {
            var panEndRange = this._panEndYRange;
            var delta = 0;
            if (panEndRange.start < 0) {
                delta = panEndRange.start;
            }
            if (panEndRange.end > 1) {
                delta = panEndRange.end - 1;
            }
            this.zoomAxes(this.yAxes, { start: panEndRange.start - delta, end: panEndRange.end - delta }, false, true);
            this._panEndYRange = undefined;
            this._panStartYRange = undefined;
        }
    };
    XYChart.prototype.handleCursorCanceled = function () {
        this._panEndXRange = undefined;
        this._panStartXRange = undefined;
    };
    /**
     * Performs zoom and other operations when user is panning chart plot using chart cursor.
     *
     * @param {IXYCursorEvents["panning"]} event Cursor's event
     */
    XYChart.prototype.handleCursorPanning = function (event) {
        var cursor = this.cursor;
        var behavior = cursor.behavior;
        var maxPanOut = cursor.maxPanOut;
        if (this._panStartXRange && (behavior == "panX" || behavior == "panXY")) {
            var panStartRange = this._panStartXRange;
            var range = cursor.xRange;
            var difference = panStartRange.end - panStartRange.start;
            var delta = range.start;
            var newStart = Math.max(-maxPanOut, delta + panStartRange.start);
            var newEnd = Math.min(range.start + panStartRange.end, 1 + maxPanOut);
            if (newStart <= 0) {
                newEnd = newStart + difference;
            }
            if (newEnd >= 1) {
                newStart = newEnd - difference;
            }
            var newRange = {
                start: newStart,
                end: newEnd
            };
            this._panEndXRange = newRange;
            this.zoomAxes(this.xAxes, newRange);
        }
        if (this._panStartYRange && (behavior == "panY" || behavior == "panXY")) {
            var panStartRange = this._panStartYRange;
            var range = cursor.yRange;
            var difference = panStartRange.end - panStartRange.start;
            var delta = range.start;
            var newStart = Math.max(-maxPanOut, delta + panStartRange.start);
            var newEnd = Math.min(range.start + panStartRange.end, 1 + maxPanOut);
            if (newStart <= 0) {
                newEnd = newStart + difference;
            }
            if (newEnd >= 1) {
                newStart = newEnd - difference;
            }
            var newRange = {
                start: newStart,
                end: newEnd
            };
            this._panEndYRange = newRange;
            this.zoomAxes(this.yAxes, newRange);
        }
        this.handleHideCursor();
    };
    /**
     * Performs zoom and other operations when user starts zooming using chart
     * cursor, e.g. zooms axes.
     *
     * @param {IXYCursorEvents["zoomended"]} event Cursor's event
     */
    XYChart.prototype.handleCursorZoomStart = function (event) {
        // Nothing here
        // This method is here only as a "placeholder" for extending classes to
        // override if necessary
    };
    Object.defineProperty(XYChart.prototype, "scrollbarX", {
        /**
         * @return {Scrollbar} Scrollbar
         */
        get: function () {
            return this._scrollbarX;
        },
        /**
         * Horizontal (X) scrollbar.
         *
         * @param {Scrollbar} scrollbar Scrollbar
         */
        set: function (scrollbar) {
            var _this = this;
            if (this._scrollbarX) {
                this.removeDispose(this._scrollbarX);
            }
            this._scrollbarX = scrollbar;
            if (scrollbar) {
                this._disposers.push(scrollbar);
                scrollbar.parent = this.topAxesContainer;
                scrollbar.toBack();
                scrollbar.orientation = "horizontal";
                scrollbar.events.on("rangechanged", this.handleXScrollbarChange, this);
                // accessibility related
                scrollbar.adapter.add("positionValue", function (arg) {
                    var xAxis = _this.xAxes.getIndex(0);
                    if (xAxis) {
                        arg.value = xAxis.getPositionLabel(arg.position);
                    }
                    return arg;
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChart.prototype, "scrollbarY", {
        /**
         * @return {Scrollbar} Scrollbar
         */
        get: function () {
            return this._scrollbarY;
        },
        /**
         * Vertical (Y) scrollbar.
         *
         * @param {Scrollbar} scrollbar Scrollbar
         */
        set: function (scrollbar) {
            var _this = this;
            if (this._scrollbarY) {
                this.removeDispose(this._scrollbarY);
            }
            this._scrollbarY = scrollbar;
            if (scrollbar) {
                this._disposers.push(scrollbar);
                scrollbar.parent = this.rightAxesContainer;
                scrollbar.toFront();
                scrollbar.orientation = "vertical";
                scrollbar.events.on("rangechanged", this.handleYScrollbarChange, this);
                // accessibility related
                scrollbar.adapter.add("positionValue", function (arg) {
                    var yAxis = _this.yAxes.getIndex(0);
                    if (yAxis) {
                        arg.value = yAxis.getPositionLabel(arg.position);
                    }
                    return arg;
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Zooms axes affected by the horizontal (X) scrollbar when the selection
     * on it changes.
     *
     * @param {AMEvent<Scrollbar, IScrollbarEvents>["rangechanged"]} event Scrollbar range change event
     */
    XYChart.prototype.handleXScrollbarChange = function (event) {
        var scrollbar = event.target;
        var range = this.zoomAxes(this.xAxes, scrollbar.range);
        scrollbar.fixRange(range);
    };
    /**
     * Zooms axes affected by the vertical (Y) scrollbar when the selection
     * on it changes.
     *
     * @param {AMEvent<Scrollbar, IScrollbarEvents>["rangechanged"]} event Scrollbar range change event
     */
    XYChart.prototype.handleYScrollbarChange = function (event) {
        var scrollbar = event.target;
        var range = this.zoomAxes(this.yAxes, scrollbar.range);
        scrollbar.fixRange(range);
    };
    /**
     * Zooms axes that are affected by to specific relative range.
     *
     * @param  {List<Axis>}  axes       List of axes to zoom
     * @param  {IRange}      range      Range of values to zoom to (0-1)
     * @param  {boolean}     instantly  If set to `true` will skip zooming animation
     * @return {IRange}                 Recalculated range that is common to all involved axes
     */
    XYChart.prototype.zoomAxes = function (axes, range, instantly, round) {
        var realRange = { start: 0, end: 1 };
        if (!this.dataInvalid) {
            $iter.each(axes.iterator(), function (axis) {
                if (axis.renderer.inversed) {
                    range = $math.invertRange(range);
                }
                if (round) {
                    var diff = range.end - range.start;
                    range.start = axis.roundPosition(range.start + 0.0001, 0);
                    range.end = range.start + diff;
                }
                var axisRange = axis.zoom(range, instantly, instantly);
                if (axis.renderer.inversed) {
                    axisRange = $math.invertRange(axisRange);
                }
                realRange = axisRange;
            });
        }
        return realRange;
    };
    Object.defineProperty(XYChart.prototype, "maskBullets", {
        /**
         * @return {boolean} Mask bullet container?
         */
        get: function () {
            return this.getPropertyValue("maskBullets");
        },
        /**
         * Indicates if bullet container is masked.
         *
         * If it is set to `true`, any bullets that do not fit into bullet container
         * will be clipped off. Settting to `false` will allow bullets to "spill out"
         * of the plot area so they are not cut off.
         *
         * @param {boolean} value Mask bullet container?
         */
        set: function (value) {
            this.setPropertyValue("maskBullets", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handles mouse wheel event.
     *
     * @param {AMEvent<Sprite, ISpriteEvents>["wheel"]}  event  Original event
     */
    XYChart.prototype.handleWheel = function (event) {
        var plotContainer = this.plotContainer;
        var svgPoint = $utils.documentPointToSvg(event.point, this.htmlContainer);
        var plotPoint = $utils.svgPointToSprite(svgPoint, plotContainer);
        var shift = event.shift.y;
        var rangeX = this.getCommonAxisRange(this.xAxes);
        var rangeY = this.getCommonAxisRange(this.yAxes);
        var shiftStep = 0.05;
        var maxPanOut = 0;
        var mouseWheelBehavior = this.mouseWheelBehavior;
        if (mouseWheelBehavior == "panX" || mouseWheelBehavior == "panXY") {
            var differenceX = rangeX.end - rangeX.start;
            var newStartX = Math.max(-maxPanOut, rangeX.start + shiftStep * shift / 100);
            var newEndX = Math.min(rangeX.end + shiftStep * shift / 100, 1 + maxPanOut);
            if (newStartX <= 0) {
                newEndX = newStartX + differenceX;
            }
            if (newEndX >= 1) {
                newStartX = newEndX - differenceX;
            }
            this.zoomAxes(this.xAxes, { start: newStartX, end: newEndX });
        }
        if (mouseWheelBehavior == "panY" || mouseWheelBehavior == "panXY") {
            shift *= -1;
            var differenceY = rangeY.end - rangeY.start;
            var newStartY = Math.max(-maxPanOut, rangeY.start + shiftStep * shift / 100);
            var newEndY = Math.min(rangeY.end + shiftStep * shift / 100, 1 + maxPanOut);
            if (newStartY <= 0) {
                newEndY = newStartY + differenceY;
            }
            if (newEndY >= 1) {
                newStartY = newEndY - differenceY;
            }
            this.zoomAxes(this.yAxes, { start: newStartY, end: newEndY });
        }
        if (mouseWheelBehavior == "zoomX" || mouseWheelBehavior == "zoomXY") {
            var locationX = plotPoint.x / plotContainer.maxWidth;
            var newStartX = Math.max(-maxPanOut, rangeX.start - shiftStep * shift / 100 * locationX);
            newStartX = Math.min(newStartX, locationX);
            var newEndX = Math.min(rangeX.end + shiftStep * shift / 100 * (1 - locationX), 1 + maxPanOut);
            newEndX = Math.max(newEndX, locationX);
            this.zoomAxes(this.xAxes, { start: newStartX, end: newEndX });
        }
        if (mouseWheelBehavior == "zoomY" || mouseWheelBehavior == "zoomXY") {
            var locationY = plotPoint.y / plotContainer.maxHeight;
            var newStartY = Math.max(-maxPanOut, rangeY.start - shiftStep * shift / 100 * (1 - locationY));
            newStartY = Math.min(newStartY, locationY);
            var newEndY = Math.min(rangeY.end + shiftStep * shift / 100 * locationY, 1 + maxPanOut);
            newEndY = Math.max(newEndY, locationY);
            this.zoomAxes(this.yAxes, { start: newStartY, end: newEndY });
        }
    };
    Object.defineProperty(XYChart.prototype, "mouseWheelBehavior", {
        /**
         * @return {"zoomX" | "zoomY" | "zoomXY" | "panX" | "panY"  | "panXY" | "none"}  mouse wheel behavior
         */
        get: function () {
            return this.getPropertyValue("mouseWheelBehavior");
        },
        /**
         * Specifies action for when mouse wheel is used when over the chart.
         *
         * Options: Options: `"zoomX"` (default), `"zoomY"`, `"zoomXY"`, `"panX"`, `"panY"`, `"panXY"`, `"none"`.
         *
         * @default "zoomX"
         * @param {"zoomX" | "zoomY" | "zoomXY" | "panX" | "panY"  | "panXY" | "none"} mouse wheel behavior
         * @default zoomX
         */
        set: function (value) {
            if (this.setPropertyValue("mouseWheelBehavior", value)) {
                if (value != "none") {
                    this._mouseWheelDisposer = this.plotContainer.events.on("wheel", this.handleWheel, this);
                    this._disposers.push(this._mouseWheelDisposer);
                }
                else {
                    if (this._mouseWheelDisposer) {
                        this._mouseWheelDisposer.dispose();
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This function is called by the [[DataSource]]'s `dateFields` adapater
     * so that particular chart types can popuplate this setting with their
     * own type-speicifc data fields so they are parsed properly.
     *
     * @param  {string[]}  fields  Array of date fields
     * @return {string[]}          Array of date fields populated with chart's date fields
     */
    XYChart.prototype.dataSourceDateFields = function (fields) {
        var _this = this;
        // Process parent
        fields = _super.prototype.dataSourceDateFields.call(this, fields);
        // Check if we have any series with date-fields
        $iter.each(this.series.iterator(), function (series) {
            fields = _this.populateDataSourceFields(fields, series.dataFields, ["dateX", "dateY", "openDateX", "openDateY"]);
        });
        return fields;
    };
    /**
     * This function is called by the [[DataSource]]'s `numberFields` adapater
     * so that particular chart types can popuplate this setting with their
     * own type-specific data fields so they are parsed properly.
     *
     * @param  {string[]}  value  Array of number fields
     * @return {string[]}         Array of number fields populated with chart's number fields
     */
    XYChart.prototype.dataSourceNumberFields = function (fields) {
        var _this = this;
        fields = _super.prototype.dataSourceDateFields.call(this, fields);
        // Check if we have any series with date-fields
        $iter.each(this.series.iterator(), function (series) {
            fields = _this.populateDataSourceFields(fields, series.dataFields, ["valueX", "valueY", "openValueX", "openValueY"]);
        });
        return fields;
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    XYChart.prototype.processConfig = function (config) {
        if (config) {
            // Save axis ranges for later processing
            var xAxes = [];
            var yAxes = [];
            // Set up axes
            if ($type.hasValue(config.xAxes) && $type.isArray(config.xAxes)) {
                for (var i = 0, len = config.xAxes.length; i < len; i++) {
                    if (!config.xAxes[i].type) {
                        throw Error("[XYChart error] No type set for xAxes[" + i + "].");
                    }
                    else if ($type.hasValue(config.xAxes[i]["axisRanges"])) {
                        xAxes.push({
                            axisRanges: config.xAxes[i]["axisRanges"],
                            index: i
                        });
                        delete (config.xAxes[i]["axisRanges"]);
                    }
                }
            }
            if ($type.hasValue(config.yAxes) && $type.isArray(config.yAxes)) {
                for (var i = 0, len = config.yAxes.length; i < len; i++) {
                    if (!config.yAxes[i].type) {
                        throw Error("[XYChart error] No type set for yAxes[" + i + "].");
                    }
                    else if ($type.hasValue(config.yAxes[i]["axisRanges"])) {
                        yAxes.push({
                            axisRanges: config.yAxes[i]["axisRanges"],
                            index: i
                        });
                        delete (config.yAxes[i]["axisRanges"]);
                    }
                }
            }
            // Set up series
            if ($type.hasValue(config.series) && $type.isArray(config.series)) {
                for (var i = 0, len = config.series.length; i < len; i++) {
                    config.series[i].type = config.series[i].type || "LineSeries";
                }
            }
            // Set up cursor
            if ($type.hasValue(config.cursor) && !$type.hasValue(config.cursor.type)) {
                config.cursor.type = "XYCursor";
            }
            // Set up scrollbars
            if ($type.hasValue(config.scrollbarX) && !$type.hasValue(config.scrollbarX.type)) {
                config.scrollbarX.type = "Scrollbar";
            }
            if ($type.hasValue(config.scrollbarY) && !$type.hasValue(config.scrollbarY.type)) {
                config.scrollbarY.type = "Scrollbar";
            }
            _super.prototype.processConfig.call(this, config);
            // Finish up with ranges.
            // We need to do this here because series are processed last in JSON
            // config. Therefore their respective objects are not yet are available
            // when axis (and respectively their ranges) are being processed.
            if (yAxes.length) {
                for (var i = 0; i < yAxes.length; i++) {
                    this.yAxes.getIndex(yAxes[i].index).config = {
                        axisRanges: yAxes[i].axisRanges
                    };
                }
            }
            if (xAxes.length) {
                for (var i = 0; i < xAxes.length; i++) {
                    this.xAxes.getIndex(xAxes[i].index).config = {
                        axisRanges: xAxes[i].axisRanges
                    };
                }
            }
        }
    };
    /**
     * This function is used to sort element's JSON config properties, so that
     * some properties that absolutely need to be processed last, can be put at
     * the end.
     *
     * @ignore Exclude from docs
     * @param  {string}  a  Element 1
     * @param  {string}  b  Element 2
     * @return {Ordering}   Sorting number
     */
    XYChart.prototype.configOrder = function (a, b) {
        if (a == b) {
            return 0;
        }
        // Must come last
        else if (a == "scrollbarX") {
            return 1;
        }
        else if (b == "scrollbarX") {
            return -1;
        }
        else if (a == "scrollbarY") {
            return 1;
        }
        else if (b == "scrollbarY") {
            return -1;
        }
        else if (a == "series") {
            return 1;
        }
        else if (b == "series") {
            return -1;
        }
        else {
            return _super.prototype.configOrder.call(this, a, b);
        }
    };
    /**
     * Creates a new Series of type suitable for this chart.
     *
     * @return {this} New series
     */
    XYChart.prototype.createSeries = function () {
        return new XYSeries();
    };
    Object.defineProperty(XYChart.prototype, "zoomOutButton", {
        /**
         * @return {Button} Zoom out button
         */
        get: function () {
            return this._zoomOutButton;
        },
        /**
         * A [[Button]] element that is used for zooming out the chart.
         *
         * This button appears only when chart is zoomed in, and disappears
         * autoamatically when it is zoome dout.
         *
         * @param {Button}  button  Zoom out button
         */
        set: function (button) {
            var _this = this;
            this._zoomOutButton = button;
            if (button) {
                button.events.on("hit", function () {
                    _this.zoomAxes(_this.xAxes, { start: 0, end: 1 });
                    _this.zoomAxes(_this.yAxes, { start: 0, end: 1 });
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all parameters from another [[XYChart]].
     *
     * @param {XYChart} source Source XYChart
     */
    XYChart.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.xAxes.copyFrom(source.xAxes);
        this.yAxes.copyFrom(source.yAxes);
        this.zoomOutButton.copyFrom(source.zoomOutButton);
        //@todo copy all container properties
    };
    return XYChart;
}(SerialChart));
export { XYChart };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYChart"] = XYChart;
//# sourceMappingURL=XYChart.js.map