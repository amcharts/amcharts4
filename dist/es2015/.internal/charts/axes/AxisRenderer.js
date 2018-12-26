/**
 * Module, defining base Axis Renderer.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../../core/Container";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { AxisLine } from "./AxisLine";
import { AxisFill } from "./AxisFill";
import { Grid } from "./Grid";
import { AxisLabel } from "./AxisLabel";
import { AxisTick } from "./AxisTick";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { registry } from "../../core/Registry";
import { percent } from "../../core/utils/Percent";
import * as $math from "../../core/utils/Math";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for all axis renderers.
 *
 * @see {@link IAxisRendererEvents} for a list of available events
 * @see {@link IAxisRendererAdapters} for a list of available Adapters
 */
var AxisRenderer = /** @class */ (function (_super) {
    tslib_1.__extends(AxisRenderer, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRenderer() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * A related chart.
         *
         * @type {MutableValueDisposer}
         */
        _this._chart = new MutableValueDisposer();
        _this.className = "AxisRenderer";
        // Set defaults
        _this.minGridDistance = 50;
        _this.inside = false;
        _this.inversed = false;
        _this.tooltipLocation = 0.5;
        _this.fullWidthTooltip = false;
        _this.cellStartLocation = 0;
        _this.cellEndLocation = 1;
        _this.minLabelPosition = 0;
        _this.maxLabelPosition = 1;
        _this.shouldClone = false;
        var gridContainer = _this.createChild(Container);
        gridContainer.shouldClone = false;
        gridContainer.layout = "none";
        gridContainer.isMeasured = false;
        gridContainer.width = percent(100);
        gridContainer.height = percent(100);
        _this.gridContainer = gridContainer;
        // not good without this
        gridContainer.events.on("maxsizechanged", function () {
            if (_this.inited) {
                _this.invalidateAxisItems();
            }
        }, _this, false);
        var breakContainer = _this.createChild(Container);
        breakContainer.shouldClone = false;
        breakContainer.isMeasured = false;
        breakContainer.layout = "none";
        breakContainer.width = percent(100);
        breakContainer.height = percent(100);
        _this.breakContainer = breakContainer;
        _this.line = _this.createChild(AxisLine);
        _this.line.shouldClone = false;
        _this.line.strokeOpacity = 0;
        var baseGrid = _this.createChild(Grid);
        baseGrid.shouldClone = false;
        _this.baseGrid = baseGrid;
        // Make elements disposable
        var disposers = _this._disposers;
        disposers.push(baseGrid);
        disposers.push(_this.line);
        disposers.push(gridContainer);
        disposers.push(breakContainer);
        disposers.push(_this._chart);
        _this.ticks.template.disabled = true;
        _this.axisFills.template.disabled = true;
        _this.axisFills.template.interactionsEnabled = false;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(AxisRenderer.prototype, "axis", {
        get: function () {
            return this._axis;
        },
        set: function (axis) {
            this.setAxis(axis);
        },
        enumerable: true,
        configurable: true
    });
    /**
    * @ignore
    */
    AxisRenderer.prototype.setAxis = function (axis) {
        this._axis = axis;
        this.baseGrid.parent = axis;
        this.line.parent = axis;
    };
    /**
     * Called when rendered is attached to an Axis, as well as a property of
     * Axis that might affect the appearance is updated.
     *
     * E.g. `axis.opposite`, `axis.inside`, etc.
     *
     * This method is called **before** draw, so that any related setting
     * changed in this method can be changed.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    AxisRenderer.prototype.processRenderer = function () {
        this.events.on("sizechanged", this.updateTooltip, this, false);
        this.events.on("positionchanged", this.updateTooltip, this, false);
        this.labels.template.inside = this.inside;
        this.ticks.template.inside = this.inside;
    };
    /**
     * Updates Axis' tooltip.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    AxisRenderer.prototype.updateTooltip = function () {
        // This is a placeholder method for extending classes to override.
    };
    Object.defineProperty(AxisRenderer.prototype, "axisLength", {
        /**
         * Returns actual length of the Axis, in pixels.
         *
         * @return {number} Length (px)
         */
        get: function () {
            // This is a placeholder method for extending classes to override.
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Re-positions an element to new coordinates.
     *
     * @ignore Exclude from docs
     * @param {Sprite}  item   A target element
     * @param {IPoint}  point  New coordinates
     */
    AxisRenderer.prototype.positionItem = function (item, point) {
        if (item) {
            item.moveTo(point);
        }
    };
    /**
     * Converts relative position on axis to point coordinates.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position (0-1)
     * @return {IPoint}            Point
     */
    AxisRenderer.prototype.positionToPoint = function (position) {
        // This is a placeholder method for extending classes to override.
        return { x: 0, y: 0 };
    };
    /**
     * Converts relative position on axis to angle.
     *
     * @ignore Exclude from docs
     * @todo Description (review / units)
     * @param  {number}  position  Position (0-1)
     * @return {number}            Angle
     */
    AxisRenderer.prototype.positionToAngle = function (position) {
        // This is a placeholder method for extending classes to override.
        return 0;
    };
    /**
     * Converts relative position (0-1) on axis to a pixel coordinate.
     *
     * @param  {number}  position  Position (0-1)
     * @return {number}            Coordinate (px)
     */
    AxisRenderer.prototype.positionToCoordinate = function (position) {
        var coordinate;
        var axis = this.axis;
        var axisFullLength = axis.axisFullLength;
        if (axis.renderer.inversed) {
            coordinate = (axis.end - position) * axisFullLength;
        }
        else {
            coordinate = (position - axis.start) * axisFullLength;
        }
        return coordinate;
    };
    AxisRenderer.prototype.getHeight = function () {
        var axis = this.axis;
        if (axis && axis.chart) {
            var chart = this.axis.chart;
            if (chart.plotContainer) {
                return chart.plotContainer.pixelHeight || 0;
            }
        }
        return this.gridContainer.pixelHeight || 0;
    };
    AxisRenderer.prototype.getWidth = function () {
        var axis = this.axis;
        if (axis && axis.chart) {
            var chart = this.axis.chart;
            if (chart.plotContainer) {
                return chart.plotContainer.pixelWidth || 0;
            }
        }
        return this.gridContainer.pixelWidth || 0;
    };
    /**
     * Converts a coordinate in pixels to a relative position. (0-1)
     *
     * @param  {number}  coordinate  Coordinate (px)
     * @return {number}              Position (0-1)
     */
    AxisRenderer.prototype.coordinateToPosition = function (coordinate) {
        var position;
        var axis = this.axis;
        var axisFullLength = axis.axisFullLength;
        if (axis.renderer.inversed) {
            position = axis.end - coordinate / axisFullLength;
        }
        else {
            position = coordinate / axisFullLength + axis.start;
        }
        return $math.round(position, 5);
    };
    /**
     * Converts a point at specific coordinates to a relative position (0-1)
     * on the axis.
     *
     * @ignore Exclude from docs
     * @param  {IPoint}  point  Point
     * @return {number}         Position (0-1)
     */
    AxisRenderer.prototype.pointToPosition = function (point) {
        // This is a placeholder method for extending classes to override.
        return 0;
    };
    /**
     * [getPositionRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}  startPosition  Starting position
     * @param  {number}  endPosition    End position
     * @return {string}                 SVG path
     */
    AxisRenderer.prototype.getPositionRangePath = function (startPosition, endPosition) {
        return "";
    };
    /**
     * Invalidates all axis data items, effectively causing them re-evaluated.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    AxisRenderer.prototype.invalidateAxisItems = function () {
        var axis = this.axis;
        if (axis) {
            axis.invalidateDataItems();
        }
    };
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    AxisRenderer.prototype.updateGridElement = function (grid, position, endPosition) {
        // This is a placeholder method for extending classes to override.
    };
    /**
     * Updates and positions a tick element.
     *
     * @ignore Exclude from docs
     * @param {AxisTick}  tick         Tick element
     * @param {number}    position     Starting position
     * @param {number}    endPosition  End position
     */
    AxisRenderer.prototype.updateTickElement = function (tick, position, endPosition) {
        // This is a placeholder method for extending classes to override.
    };
    /**
     * Updates and positions a label element.
     *
     * @ignore Exclude from docs
     * @param {AxisLabel}  label        Label element
     * @param {number}     position     Starting position
     * @param {number}     endPosition  Ending position
     */
    AxisRenderer.prototype.updateLabelElement = function (label, position, endPosition, location) {
        // This is a placeholder method for extending classes to override.
    };
    /**
     * Updates and positions the axis fill element.
     *
     * @ignore Exclude from docs
     * @param {AxisFill}  fill         Fill element
     * @param {number}    position     Starting position
     * @param {number}    endPosition  Ending position
     */
    AxisRenderer.prototype.updateFillElement = function (fill, position, endPosition) {
        fill.startPosition = position;
        fill.endPosition = endPosition;
    };
    /**
     * Updates and positions the axis line element.
     *
     * @ignore Exclude from docs
     */
    AxisRenderer.prototype.updateAxisLine = function () {
        // This is a placeholder method for extending classes to override.
    };
    /**
     * Updates and positions the base grid element.
     *
     * @ignore Exclude from docs
     */
    AxisRenderer.prototype.updateBaseGridElement = function () {
        // This is a placeholder method for extending classes to override.
    };
    /**
     * Updates and positions an axis break element.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Break element
     */
    AxisRenderer.prototype.updateBreakElement = function (axisBreak) {
        this.positionItem(axisBreak.startLine, axisBreak.startPoint);
        this.toggleVisibility(axisBreak.startLine, axisBreak.startPosition, 0, 1);
        this.positionItem(axisBreak.endLine, axisBreak.endPoint);
        this.toggleVisibility(axisBreak.endLine, axisBreak.endPosition, 0, 1);
    };
    Object.defineProperty(AxisRenderer.prototype, "minGridDistance", {
        /**
         * @return {number} Min distance (px)
         */
        get: function () {
            return this.getPropertyValue("minGridDistance");
        },
        /**
         * Minimum distance in pixels between grid elements.
         *
         * @param {number}  value  Min distance (px)
         */
        set: function (value) {
            if (this.setPropertyValue("minGridDistance", value)) {
                if (this.axis) {
                    this.axis.invalidateLayout();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "chart", {
        /**
         * @ignore Exclude from docs
         * @return {Chart} Chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * A chart, associated with the Axis.
         *
         * @ignore Exclude from docs
         * @param {Chart}  value  Chart
         */
        set: function (value) {
            this._chart.set(value, null);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Toggles visibility of an element, based on its current position and
     * min/max position settings.
     *
     * E.g. labels based on `minLabelPosition` and `maxLabelPosition`.
     *
     * @ignore Exclude from docs
     * @param {Sprite}  sprite       An element to toggle
     * @param {number}  position     Elements current position
     * @param {number}  minPosition  Min position setting
     * @param {number}  maxPosition  Max position setting
     */
    AxisRenderer.prototype.toggleVisibility = function (sprite, position, minPosition, maxPosition) {
        var axis = this.axis;
        var updatedStart = axis.start + (axis.end - axis.start) * minPosition - 0.00001;
        var updatedEnd = axis.start + (axis.end - axis.start) * maxPosition + 0.00001;
        if (!sprite.disabled) {
            if (position < updatedStart || position > updatedEnd) {
                sprite.__disabled = true;
            }
            else {
                sprite.__disabled = false;
            }
        }
    };
    /**
     * Creates visual elements for and axis break.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Axis break
     */
    AxisRenderer.prototype.createBreakSprites = function (axisBreak) {
        // This is a placeholder method for extending classes to override.
    };
    Object.defineProperty(AxisRenderer.prototype, "axisFills", {
        /**
         * A list of Axis' Fill elements.
         *
         * Those are fill elements that cover the space between every second set
         * of grid lines, and can be configured to create striped charts.
         *
         * Please note that these are disabled by default. To enable them, set
         * template to true.
         *
         * ```TypeScript
         * categoryAxis.renderer.axisFills.template.disabled = false;
         * ```
         * ```JavaScript
         * categoryAxis.renderer.axisFills.template.disabled = false;
         * ```
         * ```JSON
         * {
         *   // ...
         *   "xAxes": [{
         *     // ...
         *     "renderer": {
         *       "axisFills": {
         *         "disabled": false
         *       }
         *     }
         *   }]
         * }
         * ```
         *
         * @see {@link https://www.amcharts.com/docs/v4/tutorials/alternated-axis-fills/} this tutorial for more info.
         * @return {ListTemplate} Fill elements
         */
        get: function () {
            if (!this._axisFills) {
                var fill = this.createFill(this.axis);
                this._axisFills = new ListTemplate(fill);
                fill.applyOnClones = true;
                fill.events.on("enabled", this.invalidateAxisItems, this, false);
                this._disposers.push(new ListDisposer(this._axisFills));
                this._disposers.push(this._axisFills.template);
            }
            return this._axisFills;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a new fill element, suitable for this Axis Renderer type.
     *
     * @return {AxisFill} Fill element
     */
    AxisRenderer.prototype.createFill = function (axis) {
        return new AxisFill(axis);
    };
    Object.defineProperty(AxisRenderer.prototype, "grid", {
        /**
         * A list of Axis' Grid elements.
         *
         * @return {ListTemplate} Grid elements
         */
        get: function () {
            if (!this._grid) {
                var grid = this.createGrid();
                this._grid = new ListTemplate(grid);
                grid.applyOnClones = true;
                grid.events.on("enabled", this.invalidateAxisItems, this, false);
                this._disposers.push(new ListDisposer(this._grid));
                this._disposers.push(this._grid.template);
            }
            return this._grid;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a new grid element, suitable for this Axis Renderer type.
     *
     * @return {Grid} Grid element
     */
    AxisRenderer.prototype.createGrid = function () {
        return new Grid();
    };
    Object.defineProperty(AxisRenderer.prototype, "ticks", {
        /**
         * A list of Axis' Tick elements.
         *
         * Please note that these are disabled by default. To enable them, set
         * template to true.
         *
         * ```TypeScript
         * categoryAxis.renderer.ticks.template.disabled = false;
         * ```
         * ```JavaScript
         * categoryAxis.renderer.ticks.template.disabled = false;
         * ```
         * ```JSON
         * {
         *   // ...
         *   "xAxes": [{
         *     // ...
         *     "renderer": {
         *       "ticks": {
         *         "disabled": false
         *       }
         *     }
         *   }]
         * }
         * ```
         *
         * @return {ListTemplate} Tick elements
         */
        get: function () {
            if (!this._ticks) {
                var tick = this.createTick();
                tick.applyOnClones = true;
                tick.isMeasured = false;
                tick.events.on("enabled", this.invalidateAxisItems, this, false);
                this._ticks = new ListTemplate(tick);
                this._disposers.push(new ListDisposer(this._ticks));
                this._disposers.push(this._ticks.template);
            }
            return this._ticks;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a new tick element, suitable for this Axis Renderer type.
     *
     * @return {AxisTick} Tick element
     */
    AxisRenderer.prototype.createTick = function () {
        return new AxisTick();
    };
    Object.defineProperty(AxisRenderer.prototype, "labels", {
        /**
         * A list of Axis' Label elements.
         *
         * @return {ListTemplate} Label elements
         */
        get: function () {
            if (!this._labels) {
                var label = this.createLabel();
                this._labels = new ListTemplate(label);
                label.applyOnClones = true;
                label.events.on("enabled", this.invalidateAxisItems, this, false);
                this._disposers.push(new ListDisposer(this._labels));
                this._disposers.push(this._labels.template);
            }
            return this._labels;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a new label element, suitable for this Axis Renderer type.
     *
     * @return {AxisLabel} Label element
     */
    AxisRenderer.prototype.createLabel = function () {
        return new AxisLabel();
    };
    Object.defineProperty(AxisRenderer.prototype, "inside", {
        /**
         * @return {boolean} Labels inside?
         */
        get: function () {
            return this.getPropertyValue("inside");
        },
        /**
         * Indicates whether Axis' labels and ticks should be drawn inside Plot area.
         *
         * Does not work with all renderers, like AxisRendererRadial.
         *
         * @param {boolean}  value  Labels inside?
         */
        set: function (value) {
            if (this.setPropertyValue("inside", value)) {
                if (this.axis) {
                    this.axis.invalidate();
                }
            }
            if (value) {
                this.width = 0;
                this.height = 0;
            }
            else {
                this.width = undefined;
                this.height = undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "opposite", {
        /**
         * @return {boolean} Draw axis on opposite side?
         */
        get: function () {
            return this.getPropertyValue("opposite");
        },
        /**
         * Indicates whether Axis should be drawn on the opposite side of the plot
         * area than it would normally be drawn based on chart's settings.
         *
         * Does not work with all renderers, like [[AxisRendererRadial]] and
         * [[AxisRenderer Circular].
         *
         * @param {boolean}  value  Draw axis on opposite side?
         */
        set: function (value) {
            this.setPropertyValue("opposite", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "fullWidthTooltip", {
        /**
         * @return {boolean} Full width tooltip?
         */
        get: function () {
            return this.getPropertyValue("fullWidthTooltip");
        },
        /**
         * Indicates if Axis tooltip should take the whole width of the axis cell.
         * (between two grid lines)
         *
         * NOTE: this setting is ignored on circular axis types.
         *
         * @param {boolean} value Full width tooltip?
         */
        set: function (value) {
            this.setPropertyValue("fullWidthTooltip", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "tooltipLocation", {
        /**
         * @return {number} Tooltip location
         */
        get: function () {
            return this.getPropertyValue("tooltipLocation");
        },
        /**
         * Location within axis cell to show tooltip on. (0-1)
         *
         * 0 - show at the start
         * 0.5 - show right in the middle
         * 1 - show at the end
         *
         * @param {number} value Tooltip location
         */
        set: function (value) {
            this.setPropertyValue("tooltipLocation", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "cellStartLocation", {
        /**
         * @return {number} Cell start (0-1)
         */
        get: function () {
            return this.getPropertyValue("cellStartLocation");
        },
        /**
         * Location for the cell start.
         *
         * Normally a "cell" is the whole available width in a category.
         *
         * If there are several clustered column-like series available, the whole
         * space is divided between each clustered column, or column stacks.
         *
         * `cellStartLocation` identifies where, within available space, the actual
         * cell starts.
         *
         * This, together with column series' `width` will affect actual width of
         * columns, and thus gaps between them.
         *
         * This will affect category-like axes only, like [[DateAxis]], or
         * [[CategoryAxis]].
         *
         * This is used to limit a space occupied by series like column.
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
         * @param {number} value Cell start (0-1)
         */
        set: function (value) {
            if (this.setPropertyValue("cellStartLocation", value)) {
                if (this.axis) {
                    this.axis.invalidateSeries();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "cellEndLocation", {
        /**
         * @return {number} Cell end (0-1)
         */
        get: function () {
            return this.getPropertyValue("cellEndLocation");
        },
        /**
         * Location for the cell end.
         *
         * Normally a "cell" is the whole available width in a category.
         *
         * If there are several clustered column-like series available, the whole
         * space is divided between each clustered column, or column stacks.
         *
         * `cellEndLocation` identifies where, within available space, the actual
         * cell ends.
         *
         * This, together with column series' `width` will affect actual width of
         * columns, and thus gaps between them.
         *
         * This will affect category-like axes only, like [[DateAxis]], or
         * [[CategoryAxis]].
         *
         * This is used to limit a space occupied by series like column.
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
         * @param {number} value Cell end (0-1)
         */
        set: function (value) {
            if (this.setPropertyValue("cellEndLocation", value)) {
                if (this.axis) {
                    this.axis.invalidateSeries();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "inversed", {
        /**
         * @return {boolean} Flip axis?
         */
        get: function () {
            return this.getPropertyValue("inversed");
        },
        /**
         * Indicates if the scale of the axis should be flipped.
         *
         * @param {boolean} value Flip axis?
         */
        set: function (value) {
            this.setPropertyValue("inversed", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "minLabelPosition", {
        /**
         * @return {number} Min label position (0-1)
         */
        get: function () {
            return this.getPropertyValue("minLabelPosition");
        },
        /**
         * Minimum position along the Axis, for labels.
         *
         * Labels, which have their position closer to the start of the Axis, will be
         * automatically hidden.
         *
         * E.g., setting this to 0.05 (5% of total axis length) would hide labels,
         * that would otherwise be drawn very near start of the Axis.
         *
         * This is especially usefull with `inside = true`, or if the chart hasn't
         * got any extra margins.
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
         * @param {number}  value  Min label position (0-1)
         */
        set: function (value) {
            this.setPropertyValue("minLabelPosition", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "maxLabelPosition", {
        /**
         * @return {number} Max label position (0-1)
         */
        get: function () {
            return this.getPropertyValue("maxLabelPosition");
        },
        /**
         * Maximum position along the Axis, for labels.
         *
         * Labels, which have their position closer to the and of the Axis, will be
         * automatically hidden.
         *
         * E.g., setting this to 0.95 (95% of total axis length) would hide labels,
         * that would otherwise be drawn very near end of the Axis.
         *
         * This is especially usefull with `inside = true`, or if the chart hasn't
         * got any extra margins.
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
         * @param {number}  value  Max label position (0-1)
         */
        set: function (value) {
            this.setPropertyValue("maxLabelPosition", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all settings and related items from another object of the same
     * type.
     *
     * @param {this}  source  Source object
     */
    AxisRenderer.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.grid.template.copyFrom(source.grid.template);
        this.ticks.template.copyFrom(source.ticks.template);
        this.labels.template.copyFrom(source.labels.template);
        this.axisFills.template.copyFrom(source.axisFills.template);
        this.line.copyFrom(source.line);
        this.baseGrid.copyFrom(source.baseGrid);
    };
    return AxisRenderer;
}(Container));
export { AxisRenderer };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRenderer"] = AxisRenderer;
//# sourceMappingURL=AxisRenderer.js.map