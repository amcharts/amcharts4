/**
 * Module that defines everything related to building StockPanels.
 */
import { __extends } from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../../core/Container";
import { registry } from "../../core/Registry";
import { percent } from "../../core/utils/Percent";
import { List } from "../../core/utils/List";
import { CloseButton } from "../../core/elements/CloseButton";
import { MinimizeButton } from "../../core/elements/MinimizeButton";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates StockPanels.
 *
 * @see {@link IStockPanelEvents} for a list of available events
 * @see {@link IStockPanelAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var StockPanel = /** @class */ (function (_super) {
    __extends(StockPanel, _super);
    /**
     * Constructor
     */
    function StockPanel() {
        var _this = _super.call(this) || this;
        _this.className = "StockPanel";
        _this.layout = "vertical";
        var headerContainer = _this.createChild(Container);
        //		headerContainer.width = percent(100);
        headerContainer.layout = "horizontal";
        headerContainer.paddingTop = 12;
        headerContainer.paddingBottom = 6;
        headerContainer.background.fillOpacity = 1;
        headerContainer.background.fill = new InterfaceColorSet().getFor("background");
        _this.headerContainer = headerContainer;
        var legendItemsContainer = headerContainer.createChild(Container);
        legendItemsContainer.layout = "grid";
        legendItemsContainer.valign = "middle";
        //legendItemsContainer.contentAlign = "right";
        _this._disposers.push(headerContainer.events.on("over", function (event) {
            var chart = _this.chart;
            if (chart && chart.cursor) {
                chart.cursor.__disabled = true;
            }
        }));
        _this._disposers.push(headerContainer.events.on("out", function (event) {
            var chart = _this.chart;
            if (chart && chart.cursor) {
                chart.cursor.__disabled = false;
            }
        }));
        _this.legendItemsContainer = legendItemsContainer;
        var axesContainer = _this.createChild(Container);
        axesContainer.width = percent(100);
        axesContainer.height = percent(100);
        axesContainer.layout = "horizontal";
        _this.yAxesAndPlotContainer = axesContainer;
        var leftAxesContainer = axesContainer.createChild(Container);
        leftAxesContainer.height = percent(100);
        _this.leftAxesContainer = leftAxesContainer;
        var plotContainer = axesContainer.createChild(Container);
        plotContainer.height = percent(100);
        plotContainer.width = percent(100);
        _this.plotContainer = plotContainer;
        var seriesContainer = plotContainer.createChild(Container);
        _this.seriesContainer = seriesContainer;
        var bulletsContainer = plotContainer.createChild(Container);
        _this.bulletsContainer = bulletsContainer;
        var rightAxesContainer = axesContainer.createChild(Container);
        rightAxesContainer.height = percent(100);
        _this.rightAxesContainer = rightAxesContainer;
        _this.width = percent(100);
        _this.height = percent(100);
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(StockPanel.prototype, "yAxes", {
        /**
         * A list of vertical (Y) axes.
         *
         * @return List of axes
         */
        get: function () {
            if (!this._yAxes) {
                this._yAxes = new List();
                this._yAxes.events.on("inserted", this.handleYAxisAdded, this, false);
                this._yAxes.events.on("removed", this.handleYAxisRemoved, this, false);
            }
            return this._yAxes;
        },
        enumerable: true,
        configurable: true
    });
    StockPanel.prototype.handleYAxisAdded = function (event) {
        if (this.chart) {
            var axis = event.newValue;
            this.chart.yAxes.push(axis);
            axis.renderer.inside = true;
            axis.renderer.baseGrid.disabled = true;
            axis.renderer.labels.template.verticalCenter = "bottom";
            axis.renderer.labels.template.padding(2, 2, 2, 2);
            axis.renderer.maxLabelPosition = 0.95;
            axis.relativePositionSprite = this.chart.panelsContainer;
        }
    };
    StockPanel.prototype.handleYAxisRemoved = function (event) {
        if (this.chart) {
            this.chart.handleAxisRemoval(event);
        }
    };
    Object.defineProperty(StockPanel.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (title) {
            if (title != this._title) {
                if (this._title) {
                    this._title.dispose();
                }
                this._title = title;
                title.marginRight = 15;
                title.fontWeight = "bold";
                title.parent = this.headerContainer;
                title.toBack();
                this.legendItemsContainer.toFront();
                if (this.closeButton) {
                    this.closeButton.toBack();
                }
                if (this.minimizeButton) {
                    this.minimizeButton.toBack();
                }
                title.valign = "middle";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StockPanel.prototype, "closeEnabled", {
        get: function () {
            return this.getPropertyValue("closeEnabled");
        },
        set: function (value) {
            var _this = this;
            if (this.setPropertyValue("closeEnabled", value)) {
                var closeButton = this.closeButton;
                if (value) {
                    if (!closeButton) {
                        var closeButton_1 = this.headerContainer.createChild(CloseButton);
                        closeButton_1.marginRight = 10;
                        closeButton_1.toBack();
                        this.closeButton = closeButton_1;
                        closeButton_1.events.on("hit", function () {
                            _this.chart.panels.removeValue(_this);
                        });
                    }
                    else {
                        closeButton.disabled = false;
                    }
                }
                else {
                    if (closeButton) {
                        closeButton.disabled = true;
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StockPanel.prototype, "minimized", {
        get: function () {
            return this.getPropertyValue("minimized");
        },
        set: function (value) {
            var _this = this;
            if (this.setPropertyValue("minimized", value)) {
                if (value) {
                    this._realHeight = this.height;
                    this.minHeight = this.headerContainer.measuredHeight;
                    var hiddenState = this.hiddenState;
                    var animation = this.animate({ property: "height", to: this.minHeight }, hiddenState.transitionDuration, hiddenState.transitionEasing);
                    animation.events.on("animationended", function () {
                        _this.yAxesAndPlotContainer.disabled = true;
                    }, this, false);
                    animation.events.on("animationprogress", this.parent.invalidateLayout, this.parent);
                    var chart = this.chart;
                    var hasMaximized_1 = false;
                    chart.panels.each(function (panel) {
                        if (!panel.minimized) {
                            hasMaximized_1 = true;
                        }
                    });
                    if (!hasMaximized_1) {
                        var panelToMaximize_1;
                        chart.panels.each(function (panel) {
                            if (panel != _this && !panelToMaximize_1) {
                                panelToMaximize_1 = panel;
                            }
                        });
                        if (panelToMaximize_1) {
                            panelToMaximize_1.minimized = false;
                        }
                    }
                }
                else {
                    var hiddenState = this.hiddenState;
                    this.yAxesAndPlotContainer.disabled = false;
                    var animation = this.animate({ property: "height", from: percent(0), to: this._realHeight }, hiddenState.transitionDuration, hiddenState.transitionEasing);
                    animation.events.on("animationprogress", this.parent.invalidateLayout, this.parent);
                }
                if (this.minimizeButton) {
                    this.minimizeButton.isActive = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StockPanel.prototype, "minimizeEnabled", {
        get: function () {
            return this.getPropertyValue("minimizeEnabled");
        },
        set: function (value) {
            var _this = this;
            if (this.setPropertyValue("minimizeEnabled", value)) {
                var minimizeButton = this.minimizeButton;
                if (value) {
                    if (!minimizeButton) {
                        var minimizeButton_1 = this.headerContainer.createChild(MinimizeButton);
                        minimizeButton_1.marginRight = 10;
                        minimizeButton_1.toBack();
                        this.minimizeButton = minimizeButton_1;
                        minimizeButton_1.events.on("hit", function () {
                            _this.minimized = minimizeButton_1.isActive;
                        });
                    }
                    else {
                        minimizeButton.disabled = false;
                    }
                }
                else {
                    if (minimizeButton) {
                        minimizeButton.disabled = true;
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return StockPanel;
}(Container));
export { StockPanel };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StockPanel"] = StockPanel;
//# sourceMappingURL=StockPanel.js.map