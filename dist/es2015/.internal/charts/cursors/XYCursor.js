/**
 * Cursor for XY chart
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Cursor } from "./Cursor";
import { Sprite } from "../../core/Sprite";
import { MutableValueDisposer, MultiDisposer } from "../../core/utils/Disposer";
import { registry } from "../../core/Registry";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A cursor used on [[XYChart]].
 *
 * @see {@link IXYCursorEvents} for a list of available events
 * @see {@link IXYCursorAdapters} for a list of available Adapters
 * @todo Add description, examples
 * @todo Should we allow changing `_generalBehavior`?
 */
var XYCursor = /** @class */ (function (_super) {
    tslib_1.__extends(XYCursor, _super);
    /**
     * Constructor
     */
    function XYCursor() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Vertical cursor line element.
         *
         * @type {MutableValueDisposer<Sprite>}
         */
        _this._lineX = new MutableValueDisposer();
        /**
         * Horizontal cursor line element.
         *
         * @type {MutableValueDisposer<Sprite>}
         */
        _this._lineY = new MutableValueDisposer();
        /**
         * Horizontal [[Axis]].
         *
         * @type {MutableValueDisposer<Axis>}
         */
        _this._xAxis = new MutableValueDisposer();
        /**
         * Vertical [[Axis]].
         *
         * @type {MutableValueDisposer<Axis>}
         */
        _this._yAxis = new MutableValueDisposer();
        _this.className = "XYCursor";
        // Defaults
        _this.behavior = "zoomX";
        _this.maxPanOut = 0.1;
        var interfaceColors = new InterfaceColorSet();
        // Create selection element
        var selection = _this.createChild(Sprite);
        selection.shouldClone = false;
        selection.fillOpacity = 0.2;
        selection.fill = interfaceColors.getFor("alternativeBackground");
        selection.isMeasured = false;
        _this.selection = selection;
        _this._disposers.push(_this.selection);
        // Create cursor's vertical line
        var lineX = _this.createChild(Sprite);
        lineX.shouldClone = false;
        lineX.stroke = interfaceColors.getFor("grid");
        lineX.fill = color();
        lineX.strokeDasharray = "3,3";
        lineX.isMeasured = false;
        lineX.strokeOpacity = 0.4;
        _this.lineX = lineX;
        _this._disposers.push(_this.lineX);
        // Create cursor's horizontal line
        var lineY = _this.createChild(Sprite);
        lineY.shouldClone = false;
        lineY.stroke = interfaceColors.getFor("grid");
        lineY.fill = color();
        lineY.strokeDasharray = "3,3";
        lineY.isMeasured = false;
        lineY.strokeOpacity = 0.4;
        _this.lineY = lineY;
        _this._disposers.push(_this.lineY);
        // Add handler for size changes
        _this.events.on("sizechanged", _this.updateSize, _this);
        _this._disposers.push(_this._lineX);
        _this._disposers.push(_this._lineY);
        _this._disposers.push(_this._xAxis);
        _this._disposers.push(_this._yAxis);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Updates cursor element dimensions on size change.
     *
     * @ignore Exclude from docs
     */
    XYCursor.prototype.updateSize = function () {
        if (this.lineX) {
            this.lineX.element.attr({ "d": $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: 0, y: this.innerHeight }) });
        }
        if (this.lineY) {
            this.lineY.element.attr({ "d": $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: this.innerWidth, y: 0 }) });
        }
    };
    /**
     * Updates selection dimensions on size change.
     *
     * @ignore Exclude from docs
     */
    XYCursor.prototype.updateSelection = function () {
        if (this._usesSelection) {
            var downPoint = this.downPoint;
            if (downPoint) {
                var point = this.point;
                if (this.lineX) {
                    point.x = this.lineX.pixelX;
                }
                if (this.lineY) {
                    point.y = this.lineY.pixelY;
                }
                var selection = this.selection;
                var x = Math.min(point.x, downPoint.x);
                var y = Math.min(point.y, downPoint.y);
                var w = $math.round(Math.abs(downPoint.x - point.x), this._positionPrecision);
                var h = $math.round(Math.abs(downPoint.y - point.y), this._positionPrecision);
                switch (this.behavior) {
                    case "zoomX":
                        y = 0;
                        h = this.pixelHeight;
                        break;
                    case "zoomY":
                        x = 0;
                        w = this.pixelWidth;
                        break;
                    case "selectX":
                        y = 0;
                        h = this.pixelHeight;
                        break;
                    case "selectY":
                        x = 0;
                        w = this.pixelWidth;
                        break;
                }
                selection.x = x;
                selection.y = y;
                selection.element.attr({ "d": $path.rectangle(w, h) });
                selection.validatePosition(); // otherwise Edge shoes some incorrect size rectangle
            }
            else {
                this.selection.hide();
            }
        }
    };
    /**
     *
     * @ignore Exclude from docs
     */
    XYCursor.prototype.fixPoint = function (point) {
        point.x = Math.max(0, point.x);
        point.y = Math.max(0, point.y);
        point.x = Math.min(this.pixelWidth, point.x);
        point.y = Math.min(this.pixelHeight, point.y);
        return point;
    };
    /**
     * Places the cursor at specific point.
     *
     * @param {IPoint}   point Point to place cursor at
     */
    XYCursor.prototype.triggerMoveReal = function (point) {
        _super.prototype.triggerMoveReal.call(this, point);
        this.updateLinePositions(point);
        if (this.downPoint) {
            if (this._generalBehavior == "pan") {
                this.getPanningRanges();
                this.dispatch("panning");
            }
        }
    };
    /**
     *
     * @ignore Exclude from docs
     */
    XYCursor.prototype.updateLinePositions = function (point) {
        point = this.fixPoint(this.point);
        if (this.lineX && this.lineX.visible && !this.xAxis) {
            this.lineX.x = point.x;
        }
        if (this.lineY && this.lineY.visible && !this.yAxis) {
            this.lineY.y = point.y;
        }
        this.updateSelection();
    };
    XYCursor.prototype.triggerDownReal = function (point) {
        if (this.visible && !this.isHiding) {
            if (this.fitsToBounds(point)) {
                this.downPoint = point;
                this.updatePoint(point);
                //this.updateLinePositions(point); // otherwise lines won't be in correct position and touch won't work fine
                this.point.x = this.downPoint.x;
                this.point.y = this.downPoint.y;
                var selection = this.selection;
                var selectionX = this.downPoint.x;
                var selectionY = this.downPoint.y;
                if (this._usesSelection) {
                    selection.x = selectionX;
                    selection.y = selectionY;
                    selection.element.attr({ "d": "" });
                    selection.show();
                }
                _super.prototype.triggerDownReal.call(this, point);
            }
            else {
                this.downPoint = undefined;
            }
        }
        else {
            this.downPoint = undefined;
        }
    };
    /**
     * Updates the coordinates of where pointer down event occurred
     * (was pressed).
     */
    XYCursor.prototype.updatePoint = function (point) {
        if (this.lineX) {
            point.x = this.lineX.pixelX;
        }
        if (this.lineY) {
            point.y = this.lineY.pixelY;
        }
    };
    XYCursor.prototype.triggerUpReal = function (point) {
        if (this.downPoint) {
            this.upPoint = point;
            this.updatePoint(this.upPoint);
            this.getRanges();
            if (this.behavior == "selectX" || this.behavior == "selectY" || this.behavior == "selectXY") {
                // void
            }
            else {
                this.selection.hide();
            }
            _super.prototype.triggerUpReal.call(this, point);
        }
        this.downPoint = undefined;
        this.updateSelection();
    };
    /**
     * [getRanges description]
     *
     * @todo Description
     */
    XYCursor.prototype.getPanningRanges = function () {
        var startX = $math.round(this.downPoint.x / this.innerWidth, 5);
        var startY = $math.round(this.downPoint.y / this.innerHeight, 5);
        var currentX = $math.round(this.point.x / this.innerWidth, 5);
        var currentY = $math.round(this.point.y / this.innerHeight, 5);
        var deltaX = startX - currentX;
        var deltaY = -startY + currentY;
        this.xRange = { start: deltaX, end: 1 + deltaX };
        this.yRange = { start: deltaY, end: 1 + deltaY };
        if (this.behavior == "panX") {
            this.yRange.start = 0;
            this.yRange.end = 1;
        }
        if (this.behavior == "panY") {
            this.xRange.start = 0;
            this.xRange.end = 1;
        }
    };
    /**
     * [getRanges description]
     *
     * @todo Description
     */
    XYCursor.prototype.getRanges = function () {
        if (this.lineX) {
            this.upPoint.x = this.lineX.pixelX;
        }
        if (this.lineY) {
            this.upPoint.y = this.lineY.pixelY;
        }
        // @todo Is this needed?
        this.selection;
        var startX = $math.round(this.downPoint.x / this.innerWidth, 5);
        var endX = $math.round((this.upPoint.x) / this.innerWidth, 5);
        var startY = $math.round(this.downPoint.y / this.innerHeight, 5);
        var endY = $math.round((this.upPoint.y) / this.innerHeight, 5);
        this.xRange = { start: $math.min(startX, endX), end: $math.max(startX, endX) };
        this.yRange = { start: $math.min(startY, endY), end: $math.max(startY, endY) };
    };
    Object.defineProperty(XYCursor.prototype, "behavior", {
        /**
         * @type {"zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none"} Bheavior
         */
        get: function () {
            return this.getPropertyValue("behavior");
        },
        /**
         * Cursor's behavior when it's moved with pointer down:
         *
         * * "zoomX" - zooms horizontally;
         * * "zoomY" - zooms vertically;
         * * "zoomXY" - zooms both horizontally and vertically;
         * * "selectX" - selects a range horizontally;
         * * "selectY" - selects a range vertically;
         * * "selectXY" - selects a range both horizontally and vertically;
         * * "panX" - moves (pans) current selection horizontally;
         * * "panY" - moves (pans) current selection vertically;
         * * "panXY" - moves (pans) current selection both horizontally and vertically;
         * * "none" - does nothing with pointer down.
         *
         * E.g. "zoomXY" will mean that pressing a mouse (or touching) over plot area
         * and dragging it will start zooming the chart.
         *
         * @param {"zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none"} value Bheavior
         */
        set: function (value) {
            this.setPropertyValue("behavior", value, true);
            this._usesSelection = false;
            if (value.indexOf("zoom") != -1) {
                this._generalBehavior = "zoom";
                this._usesSelection = true;
            }
            if (value.indexOf("select") != -1) {
                this._generalBehavior = "select";
                this._usesSelection = true;
            }
            if (value.indexOf("pan") != -1) {
                this._generalBehavior = "pan";
                this._usesSelection = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "fullWidthLineX", {
        /**
         * @return {boolean} Full width?
         */
        get: function () {
            return this.getPropertyValue("fullWidthLineX");
        },
        /**
         * Cursor's horizontal line is expanded to take full width of the related
         * Axis' cell/category.
         *
         * NOTE: this setting will work properly if `xAxis` is set and only in case
         * `xAxis` is [[CategoryAxis]] or [[DateAxis]].
         *
         * @param {boolean} value Full width?
         */
        set: function (value) {
            this.setPropertyValue("fullWidthLineX", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "fullWidthLineY", {
        /**
         * @return {boolean} Full width?
         */
        get: function () {
            return this.getPropertyValue("fullWidthLineY");
        },
        /**
         * Cursor's vertical line is expanded to take full width of the related
         * Axis' cell/category.
         *
         * NOTE: this setting will work properly if `yAxis` is set and only in case
         * `yAxis` is [[CategoryAxis]] or [[DateAxis]].
         *
         * @param {boolean} value Full width?
         */
        set: function (value) {
            this.setPropertyValue("fullWidthLineY", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "maxPanOut", {
        /**
         * @return {number} Full width?
         */
        get: function () {
            return this.getPropertyValue("maxPanOut");
        },
        /**
         * If cursor behavior is panX or panY, we allow to pan plot out of it's max bounds for a better user experience.
         * This setting specifies relative value by how much we can pan out the plot
         *
         * @param {number} value
         */
        set: function (value) {
            this.setPropertyValue("maxPanOut", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "xAxis", {
        /**
         * @return {Axis} X axis
         */
        get: function () {
            return this._xAxis.get();
        },
        /**
         * A reference to X [[Axis]].
         *
         * An XY cursor can live without `xAxis` set. You set xAxis for cursor when
         * you have axis tooltip enabled and you want cursor line to be at the same
         * position as tooltip.
         *
         * This works with [[CategoryAxis]] and [[DateAxis]] but not with
         * [[ValueAxis]].
         *
         * @todo Description (review)
         * @param {Axis} axis X axis
         */
        set: function (axis) {
            if (this._xAxis.get() != axis) {
                var chart = axis.chart;
                this._xAxis.set(axis, new MultiDisposer([
                    axis.tooltip.events.on("positionchanged", this.handleXTooltipPosition, this),
                    axis.events.on("validated", chart.handleCursorPositionChange, chart)
                ]));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "yAxis", {
        /**
         * @return {Axis} Y Axis
         */
        get: function () {
            return this._yAxis.get();
        },
        /**
         * A reference to Y [[Axis]].
         *
         * An XY cursor can live without `yAxis` set. You set xAxis for cursor when
         * you have axis tooltip enabled and you want cursor line to be at the same
         * position as tooltip.
         *
         * This works with [[CategoryAxis]] and [[DateAxis]] but not with
         * [[ValueAxis]].
         *
         * @todo Description (review)
         * @param {Axis} axis Y axis
         */
        set: function (axis) {
            if (this._yAxis.get() != axis) {
                var chart = axis.chart;
                this._yAxis.set(axis, new MultiDisposer([
                    axis.tooltip.events.on("positionchanged", this.handleYTooltipPosition, this),
                    axis.events.on("validated", chart.handleCursorPositionChange, chart)
                ]));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates Cursor's position when axis tooltip changes position.
     *
     * @ignore Exclude from docs
     * @param {ISpriteEvents["positionchanged"]} event Original Axis event
     */
    XYCursor.prototype.handleXTooltipPosition = function (event) {
        var tooltip = this.xAxis.tooltip;
        var point = $utils.svgPointToSprite({ x: tooltip.pixelX, y: tooltip.pixelY }, this);
        var x = point.x;
        if (this.lineX) {
            this.lineX.x = x;
            if (!this.fitsToBounds(point)) {
                this.hide();
            }
        }
        if (this.xAxis && this.fullWidthLineX) {
            var startPoint = this.xAxis.currentItemStartPoint;
            var endPoint = this.xAxis.currentItemEndPoint;
            if (startPoint && endPoint) {
                this.lineX.x = x;
                var width = endPoint.x - startPoint.x;
                this.lineX.element.attr({ "d": $path.rectangle(width, this.innerHeight, -width / 2) });
            }
        }
    };
    /**
     * Updates Cursor's position when Y axis changes position or scale.
     *
     * @ignore Exclude from docs
     * @param {ISpriteEvents["positionchanged"]} event Original Axis event
     */
    XYCursor.prototype.handleYTooltipPosition = function (event) {
        var tooltip = this.yAxis.tooltip;
        var point = $utils.svgPointToSprite({ x: tooltip.pixelX, y: tooltip.pixelY }, this);
        var y = point.y;
        if (this.lineY) {
            this.lineY.y = y;
            if (!this.fitsToBounds(point)) {
                this.hide();
            }
        }
        if (this.yAxis && this.fullWidthLineY) {
            var startPoint = this.yAxis.currentItemStartPoint;
            var endPoint = this.yAxis.currentItemEndPoint;
            if (startPoint && endPoint) {
                this.lineY.y = y;
                var height = endPoint.y - startPoint.y;
                this.lineY.element.attr({ "d": $path.rectangle(this.innerWidth, height, 0, -height / 2) });
            }
        }
    };
    Object.defineProperty(XYCursor.prototype, "lineX", {
        /**
         * @return {Sprite} Line element
         */
        get: function () {
            return this._lineX.get();
        },
        /**
         * A Line element to use for X axis.
         *
         * @param {Sprite} lineX Line
         */
        set: function (lineX) {
            if (lineX) {
                lineX.element = this.paper.add("path");
                this._lineX.set(lineX, lineX.events.on("positionchanged", this.updateSelection, this));
                lineX.interactionsEnabled = false;
                lineX.parent = this;
            }
            else {
                this._lineX.reset();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "lineY", {
        /**
         * @return {Sprite} Line element
         */
        get: function () {
            return this._lineY.get();
        },
        /**
         * A Line element to use Y axis.
         *
         * @param {Sprite} lineY Line
         */
        set: function (lineY) {
            if (lineY) {
                lineY.element = this.paper.add("path");
                this._lineY.set(lineY, lineY.events.on("positionchanged", this.updateSelection, this));
                lineY.parent = this;
                lineY.interactionsEnabled = false;
            }
            else {
                this._lineY.reset();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "selection", {
        /**
         * @return {Sprite} Selection rectangle
         */
        get: function () {
            return this._selection;
        },
        /**
         * A selection element ([[Sprite]]).
         *
         * @param {Sprite} selection Selection rectangle
         */
        set: function (selection) {
            this._selection = selection;
            if (selection) {
                selection.element = this.paper.add("path");
                selection.parent = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * Looks if `xAxis` and `yAxis` is set via ID in JSON config, and replaces
     * with real references.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    XYCursor.prototype.processConfig = function (config) {
        if (config) {
            // Set up axes
            if ($type.hasValue(config.xAxis) && $type.isString(config.xAxis) && this.map.hasKey(config.xAxis)) {
                config.xAxis = this.map.getKey(config.xAxis);
            }
            if ($type.hasValue(config.yAxis) && $type.isString(config.yAxis) && this.map.hasKey(config.yAxis)) {
                config.yAxis = this.map.getKey(config.yAxis);
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return XYCursor;
}(Cursor));
export { XYCursor };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYCursor"] = XYCursor;
//# sourceMappingURL=XYCursor.js.map