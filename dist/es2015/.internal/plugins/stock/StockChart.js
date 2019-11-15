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
import { XYChart, XYChartDataItem } from "../../charts/types/XYChart";
import { registry } from "../../core/Registry";
import { List } from "../../core/utils/List";
import { Container } from "../../core/Container";
import { Sprite } from "../../core/Sprite";
import { percent } from "../../core/utils/Percent";
import * as $utils from "../../core/utils/Utils";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[StockChart]].
 *
 * @see {@link DataItem}
 */
var StockChartDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(StockChartDataItem, _super);
    function StockChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "StockChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return StockChartDataItem;
}(XYChartDataItem));
export { StockChartDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a 3D XY chart.
 *
 * @see {@link IStockChartEvents} for a list of available Events
 * @see {@link IStockChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/} for documentation
 * @important
 */
var StockChart = /** @class */ (function (_super) {
    tslib_1.__extends(StockChart, _super);
    /**
     * Constructor
     */
    function StockChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "StockChart";
        var panelsContainer = _this.yAxesAndPlotContainer.createChild(Container);
        panelsContainer.isMeasured = false;
        panelsContainer.layout = "vertical";
        panelsContainer.width = percent(100);
        panelsContainer.height = percent(100);
        panelsContainer.events.on("layoutvalidated", _this.updateMask, _this, false);
        _this.panelsContainer = panelsContainer;
        _this.leftAxesContainer.parent = undefined;
        _this.rightAxesContainer.parent = undefined;
        _this.zoomOutButton.disabled = true;
        _this._plotMask = panelsContainer.createChild(Sprite);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(StockChart.prototype, "panels", {
        // @todo mm
        get: function () {
            if (!this._panels) {
                this._panels = new List();
                this._panels.events.on("inserted", this.handlePanelAdded, this, false);
                this._panels.events.on("removed", this.handlePanelRemoved, this, false);
            }
            return this._panels;
        },
        enumerable: true,
        configurable: true
    });
    StockChart.prototype.updateMask = function () {
        var _this = this;
        var path = "";
        this.panels.each(function (panel) {
            var c = panel.yAxesAndPlotContainer;
            var x = c.pixelX;
            var y = c.pixelY;
            var point = $utils.spritePointToSprite({ x: x, y: y }, panel, _this.panelsContainer);
            x = point.x;
            y = point.y;
            var w = c.measuredWidth;
            var h = c.measuredHeight;
            path += $path.moveTo({ x: x, y: y });
            path += $path.lineTo({ x: x + w, y: y });
            path += $path.lineTo({ x: x + w, y: y + h });
            path += $path.lineTo({ x: x, y: y + h });
            path += $path.lineTo({ x: x, y: y });
        });
        this._plotMask.path = path;
        this.plotContainer.mask = this._plotMask;
    };
    StockChart.prototype.handlePanelAdded = function (event) {
        var panel = event.newValue;
        panel.chart = this;
        panel.parent = this.panelsContainer;
    };
    StockChart.prototype.handlePanelRemoved = function (event) {
        var _this = this;
        var panel = event.oldValue;
        this.series.each(function (series) {
            if (panel.yAxes.indexOf(series.yAxis) != -1) {
                _this.series.removeValue(series);
            }
        });
        panel.yAxes.each(function (axis) {
            _this.yAxes.removeValue(axis);
        });
        event.oldValue.dispose();
    };
    /**
     * @ignore
     */
    StockChart.prototype.handleYAxisSet = function (series) {
        var panel = this.getAxisPanel(series.yAxis);
        if (panel) {
            series.parent = panel.seriesContainer;
        }
    };
    /**
     * Decorates an Axis for use with this chart, e.g. sets proper renderer
     * and containers for placement.
     *
     * @param axis  Axis
     */
    StockChart.prototype.processAxis = function (axis) {
        _super.prototype.processAxis.call(this, axis);
        this.setAxisParent(axis);
    };
    StockChart.prototype.setAxisParent = function (axis) {
        var panel = this.getAxisPanel(axis);
        if (panel) {
            if (axis.renderer.opposite) {
                axis.parent = panel.rightAxesContainer;
                axis.toBack();
            }
            else {
                axis.parent = panel.leftAxesContainer;
                axis.toFront();
            }
            axis.renderer.gridContainer.parent = panel.plotContainer;
            this._disposers.push(axis.events.on("sizechanged", this.updateXAxesMargins, this, false));
        }
    };
    /**
     * Triggers (re)rendering of the vertical (Y) axis.
     *
     * @ignore Exclude from docs
     * @param axis  Axis
     */
    StockChart.prototype.updateYAxis = function (renderer) {
        var axis = renderer.axis;
        this.setAxisParent(axis);
        if (axis.renderer) {
            axis.renderer.processRenderer();
        }
    };
    StockChart.prototype.getAxisPanel = function (axis) {
        if (this._panels) {
            var axisPanel_1;
            this._panels.each(function (panel) {
                if (panel.yAxes.indexOf(axis) != -1) {
                    axisPanel_1 = panel;
                }
            });
            return axisPanel_1;
        }
    };
    /**
     * Prepares the legend instance for use in this chart.
     *
     * @param legend  Legend
     */
    StockChart.prototype.setLegend = function (legend) {
        _super.prototype.setLegend.call(this, legend);
        if (legend) {
            legend.itemContainers.template.paddingTop = 0;
            legend.itemContainers.template.paddingBottom = 0;
            legend.valign = "middle";
            legend.events.on("datavalidated", this.arrangeLegendItems, this, false);
        }
    };
    StockChart.prototype.arrangeLegendItems = function () {
        var _this = this;
        if (this.legend) {
            this.legend.itemContainers.each(function (itemContainer) {
                var dataItem = itemContainer.dataItem;
                var series = dataItem.dataContext;
                var panel = _this.getAxisPanel(series.yAxis);
                if (panel) {
                    itemContainer.parent = panel.legendItemsContainer;
                }
            });
        }
    };
    /**
     * Updates margins for horizontal axes based on settings and available space.
     *
     * @ignore Exclude from docs
     */
    StockChart.prototype.updateXAxesMargins = function () {
        var leftAxesWidth = 0;
        var rightAxesWidth = 0;
        this.yAxes.each(function (axis) {
            if (axis.renderer.opposite) {
                if (axis.measuredWidth > rightAxesWidth) {
                    rightAxesWidth = axis.measuredWidth;
                }
            }
            else {
                if (axis.measuredWidth > leftAxesWidth) {
                    leftAxesWidth = axis.measuredWidth;
                }
            }
        });
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
        this.panels.each(function (panel) {
            panel.leftAxesContainer.minWidth = leftAxesWidth;
            panel.rightAxesContainer.minWidth = rightAxesWidth;
            panel.headerContainer.paddingLeft = leftAxesWidth;
            panel.headerContainer.paddingRight = rightAxesWidth;
        });
        this.leftAxesContainer.minWidth = leftAxesWidth;
        this.rightAxesContainer.minWidth = rightAxesWidth;
    };
    return StockChart;
}(XYChart));
export { StockChart };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StockChart"] = StockChart;
//# sourceMappingURL=StockChart.js.map