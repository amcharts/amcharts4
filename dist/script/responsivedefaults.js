/**
 * @license
 * Copyright (c) 2018 amCharts (Antanas Marcelionis, Martynas Majeris)
 *
 * This sofware is provided under multiple licenses. Please see below for
 * links to appropriate usage.
 *
 * Free amCharts linkware license. Details and conditions:
 * https://github.com/amcharts/amcharts4/blob/master/LICENSE
 *
 * One of the amCharts commercial licenses. Details and pricing:
 * https://www.amcharts.com/online-store/
 * https://www.amcharts.com/online-store/licenses-explained/
 *
 * If in doubt, contact amCharts at contact@amcharts.com
 *
 * PLEASE DO NOT REMOVE THIS COPYRIGHT NOTICE.
 * @hidden
 */
 
webpackJsonp([1],{

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WavedLine; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Line__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_Color__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rendering_Path__ = __webpack_require__(19);
/**
 * Functionality for drawing waved lines.
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



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a waved line.
 *
 * @see {@link IWavedLineEvents} for a list of available events
 * @see {@link IWavedLineAdapters} for a list of available Adapters
 */
var WavedLine = /** @class */ (function (_super) {
    __extends(WavedLine, _super);
    /**
     * Constructor
     */
    function WavedLine() {
        var _this = _super.call(this) || this;
        _this.className = "WavedLine";
        _this.element = _this.paper.add("path");
        _this.waveLength = 16;
        _this.waveHeight = 4;
        _this.tension = 0.8;
        _this.pixelPerfect = false;
        _this.fill = Object(__WEBPACK_IMPORTED_MODULE_1__utils_Color__["c" /* color */])();
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the waved line.
     *
     * @ignore Exclude from docs
     */
    WavedLine.prototype.draw = function () {
        //super.draw();
        var p1 = { x: this.x1, y: this.y1 };
        var p2 = { x: this.x2, y: this.y2 };
        var d = __WEBPACK_IMPORTED_MODULE_2__rendering_Path__["moveTo"](p1) + __WEBPACK_IMPORTED_MODULE_2__rendering_Path__["wavedLine"](p1, p2, this.waveLength, this.waveHeight, this.tension, true);
        this.element.attr({ "d": d });
    };
    Object.defineProperty(WavedLine.prototype, "waveLength", {
        /**
         * @return {number} Wave length (px)
         */
        get: function () {
            return this.getPropertyValue("waveLength");
        },
        /**
         * Wave length in pixels.
         *
         * @default 16
         * @param {number}  value  Wave length (px)
         */
        set: function (value) {
            this.setPropertyValue("waveLength", value);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WavedLine.prototype, "waveHeight", {
        /**
         * @return {number} Wave height (px)
         */
        get: function () {
            return this.getPropertyValue("waveHeight");
        },
        /**
         * Wave height in pixels.
         *
         * @default 4
         * @param {number}  value  Wave height (px)
         */
        set: function (value) {
            this.setPropertyValue("waveHeight", value);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WavedLine.prototype, "tension", {
        /**
         * @return {number} Tension
         */
        get: function () {
            return this.getPropertyValue("tension");
        },
        /**
         * Tension of the wave.
         *
         * @default 0.8
         * @param {number}  value  Tension
         */
        set: function (value) {
            this.setPropertyValue("tension", value);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    return WavedLine;
}(__WEBPACK_IMPORTED_MODULE_0__Line__["a" /* Line */]));

//# sourceMappingURL=WavedLine.js.map

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisRendererY; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisRenderer__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_WavedLine__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_WavedRectangle__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__ = __webpack_require__(9);
/**
 * Module, defining Axis Renderer for vertical axes.
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








/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A renderer for vertical axis.
 *
 * @see {@link IAxisRendererYEvents} for a list of available events
 * @see {@link IAxisRendererYAdapters} for a list of available Adapters
 */
var AxisRendererY = /** @class */ (function (_super) {
    __extends(AxisRendererY, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRendererY(axis) {
        var _this = _super.call(this, axis) || this;
        _this.className = "AxisRendererY";
        _this.minGridDistance = 40;
        _this.opposite = false;
        _this.height = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(100);
        _this.labels.template.verticalCenter = "middle";
        axis.layout = "horizontal"; // in order to properly position title, as title goes to axis, not renderer
        _this.applyTheme();
        return _this;
    }
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
    AxisRendererY.prototype.processRenderer = function () {
        _super.prototype.processRenderer.call(this);
        var axis = this.axis;
        if (axis) {
            var title = axis.title;
            title.valign = "middle";
            axis.height = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(100);
            if (this.opposite) {
                title.rotation = 90;
                this.line.toBack();
                title.toFront();
            }
            else {
                title.rotation = -90;
                title.toBack();
                this.line.toFront();
            }
        }
    };
    /**
     * Updates some of the Axis tooltip's visual properties, related to
     * rendering of the Axis.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    AxisRendererY.prototype.updateTooltip = function () {
        var axis = this.axis;
        if (axis) {
            var bigNum = 2000;
            var bbx = 0;
            var bby = 0;
            var bbw = bigNum;
            var bbh = this.pixelHeight;
            // right
            if (this.opposite) {
                if (this.inside) {
                    bbx = -bigNum;
                    bbw = bigNum;
                }
            }
            // left
            else {
                if (!this.inside) {
                    bbx = -bigNum;
                    bbw = bigNum;
                }
            }
            this.axis.updateTooltip("horizontal", { x: bbx, y: bby, width: bbw, height: bbh });
        }
    };
    Object.defineProperty(AxisRendererY.prototype, "axisLength", {
        /**
         * Returns actual length of the Axis, in pixels.
         *
         * @return {number} Length (px)
         */
        get: function () {
            var axis = this.axis;
            return axis.pixelHeight - axis.pixelPaddingTop - axis.pixelPaddingBottom;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts relative position on axis to point coordinates.
     *
     * @param  {number}  position  Position (0-1)
     * @return {IPoint}            Point
     */
    AxisRendererY.prototype.positionToPoint = function (position) {
        return { x: 0, y: this.positionToCoordinate(position) };
    };
    /**
     * Converts a point at specific coordinates to a relative position (0-1)
     * on the axis.
     *
     * @param  {IPoint}  point  Point
     * @return {number}         Position (0-1)
     */
    AxisRendererY.prototype.pointToPosition = function (point) {
        return this.coordinateToPosition(point.y);
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
    AxisRendererY.prototype.getPositionRangePath = function (startPosition, endPosition) {
        var y1 = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["fitToRange"](this.positionToCoordinate(startPosition), 0, this.axisLength);
        var y2 = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["fitToRange"](this.positionToCoordinate(endPosition), 0, this.axisLength);
        var h = Math.abs(y2 - y1);
        var w = this.gridContainer.pixelWidth;
        var y = Math.min(y1, y2);
        var x = 0;
        return __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["rectToPath"]({
            x: x,
            y: y,
            width: w,
            height: h
        }, true);
    };
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    AxisRendererY.prototype.updateGridElement = function (grid, position, endPosition) {
        var point = this.positionToPoint(position);
        if (grid.element) {
            grid.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["lineTo"]({ x: this.gridContainer.pixelWidth, y: 0 }) });
        }
        this.positionItem(grid, point);
        this.toggleVisibility(grid, position, 0, 1);
    };
    /**
     * Updates and positions a tick element.
     *
     * @ignore Exclude from docs
     * @param {AxisTick}  tick         Tick element
     * @param {number}    position     Starting position
     * @param {number}    endPosition  End position
     */
    AxisRendererY.prototype.updateTickElement = function (tick, position, endPosition) {
        var point = this.positionToPoint(position);
        var tickLength = tick.length;
        if (!this.opposite) {
            point.x = this.pixelWidth;
            tickLength *= (tick.inside ? 1 : -1);
        }
        else {
            tickLength *= (tick.inside ? -1 : 1);
        }
        tick.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["lineTo"]({ x: tickLength, y: 0 }) });
        this.positionItem(tick, point);
        this.toggleVisibility(tick, position, 0, 1);
    };
    /**
     * Updates and positions the axis line element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererY.prototype.updateAxisLine = function () {
        var element = this.line.element;
        if (element) {
            element.attr({ "d": __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["lineTo"]({ x: 0, y: this.axisLength }) });
        }
    };
    /**
     * Updates and positions the base grid element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererY.prototype.updateBaseGridElement = function () {
        _super.prototype.updateBaseGridElement.call(this);
        var axis = this.axis;
        var w = this.gridContainer.pixelWidth;
        var h = this.gridContainer.pixelHeight;
        var y = axis.basePoint.y;
        var baseGrid = this.baseGrid;
        if (y < 0 || y > h) {
            baseGrid.hide(0);
        }
        else {
            var x = __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__["spritePointToSprite"]({ x: 0, y: 0 }, this.gridContainer, this).x;
            baseGrid.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["lineTo"]({ x: w, y: 0 }) });
            baseGrid.moveTo({ x: x, y: y });
            baseGrid.show(0);
        }
    };
    /**
     * Updates and positions a label element.
     *
     * @ignore Exclude from docs
     * @param {AxisLabel}  label        Label element
     * @param {number}     position     Starting position
     * @param {number}     endPosition  Ending position
     */
    AxisRendererY.prototype.updateLabelElement = function (label, position, endPosition) {
        position = position + (endPosition - position) * label.location;
        label.isMeasured = !label.inside;
        var point = this.positionToPoint(position);
        var align;
        if (this.opposite) {
            if (label.inside) {
                align = "right";
            }
            else {
                align = "left";
            }
            point.x = 0;
        }
        else {
            if (label.inside) {
                align = "left";
            }
            else {
                align = "right";
            }
            point.x = this.pixelWidth;
        }
        label.horizontalCenter = align;
        this.positionItem(label, point);
        this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
    };
    /**
     * Updates and positions an axis break element.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Break element
     */
    AxisRendererY.prototype.updateBreakElement = function (axisBreak) {
        _super.prototype.updateBreakElement.call(this, axisBreak);
        var startLine = axisBreak.startLine;
        var endLine = axisBreak.endLine;
        var fillShape = axisBreak.fillShape;
        var startPoint = axisBreak.startPoint;
        var endPoint = axisBreak.endPoint;
        var x1 = axisBreak.pixelMarginLeft;
        var x2 = this.gridContainer.pixelWidth - axisBreak.pixelMarginLeft - axisBreak.pixelMarginRight;
        var w = Math.abs(x2 - x1);
        startLine.x = x1;
        startLine.height = 0;
        startLine.width = w;
        endLine.x = x1;
        endLine.height = 0;
        endLine.width = w;
        fillShape.width = w;
        fillShape.height = Math.abs(endPoint.y - startPoint.y);
        fillShape.x = x1;
        fillShape.y = endPoint.y;
    };
    /**
     * Creates visual elements for and axis break.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Axis break
     */
    AxisRendererY.prototype.createBreakSprites = function (axisBreak) {
        axisBreak.startLine = new __WEBPACK_IMPORTED_MODULE_1__core_elements_WavedLine__["a" /* WavedLine */]();
        axisBreak.endLine = new __WEBPACK_IMPORTED_MODULE_1__core_elements_WavedLine__["a" /* WavedLine */]();
        var wavedRectangle = new __WEBPACK_IMPORTED_MODULE_2__core_elements_WavedRectangle__["a" /* WavedRectangle */]();
        wavedRectangle.setWavedSides(true, false, true, false);
        axisBreak.fillShape = wavedRectangle;
    };
    Object.defineProperty(AxisRendererY.prototype, "inside", {
        /**
         * Returns current setting for `inside`.
         *
         * @return {boolean} Labels inside?
         */
        get: function () {
            return this.getPropertyValue("inside");
        },
        /**
         * Sets if Axis labels should be drawn inside Axis.
         *
         * @param {boolean} value Labels inside?
         */
        set: function (value) {
            this.setPropertyValue("inside", value);
            this.minWidth = value ? undefined : 65;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts a position on the axis to a coordinate in pixels.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position (0-1)
     * @return {number}            Coordinate (px)
     */
    AxisRendererY.prototype.positionToCoordinate = function (position) {
        var coordinate;
        var axis = this.axis;
        var axisFullLength = axis.axisFullLength;
        if (!axis.renderer.inversed) {
            coordinate = (axis.end - position) * axisFullLength;
        }
        else {
            coordinate = (position - axis.start) * axisFullLength;
        }
        return __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["round"](coordinate, 1);
    };
    return AxisRendererY;
}(__WEBPACK_IMPORTED_MODULE_0__AxisRenderer__["a" /* AxisRenderer */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["a" /* registry */].registeredClasses["AxisRendererY"] = AxisRendererY;
//# sourceMappingURL=AxisRendererY.js.map

/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Line; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Sprite__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_Color__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_Type__ = __webpack_require__(0);
/**
 * Line drawing functionality.
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



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a line.
 *
 * @see {@link ILineEvents} for a list of available events
 * @see {@link ILineAdapters} for a list of available Adapters
 */
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    /**
     * Constructor
     */
    function Line() {
        var _this = _super.call(this) || this;
        _this.className = "Line";
        _this.element = _this.paper.add("line");
        _this.fill = Object(__WEBPACK_IMPORTED_MODULE_1__utils_Color__["c" /* color */])(); //"none";
        _this.x1 = 0;
        _this.y1 = 0;
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the line.
     *
     * @ignore Exclude from docs
     */
    Line.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (this.x1 == this.x2 || this.y1 == this.y2) {
            this.pixelPerfect = true;
        }
        else {
            this.pixelPerfect = false;
        }
        this.x1 = this.x1;
        this.x2 = this.x2;
        this.y1 = this.y1;
        this.y2 = this.y2;
    };
    Object.defineProperty(Line.prototype, "x1", {
        /**
         * @return {number} X
         */
        get: function () {
            return this.getPropertyValue("x1");
        },
        /**
         * X coordinate of first end.
         *
         * @param {number} value X
         */
        set: function (value) {
            if (!__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](value)) {
                value = 0;
            }
            this.setPropertyValue("x1", value);
            this.element.attr({ "x1": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "x2", {
        /**
         * @return {number} X
         */
        get: function () {
            var value = this.getPropertyValue("x2");
            if (!__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](value)) {
                value = this.pixelWidth;
            }
            return value;
        },
        /**
         * X coordinate of second end.
         *
         * @param {number} value X
         */
        set: function (value) {
            if (!__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](value)) {
                value = 0;
            }
            this.setPropertyValue("x2", value);
            this.element.attr({ "x2": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "y1", {
        /**
         * @return {number} Y
         */
        get: function () {
            return this.getPropertyValue("y1");
        },
        /**
         * Y coordinate of first end.
         *
         * @param {number} value Y
         */
        set: function (value) {
            if (!__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](value)) {
                value = 0;
            }
            this.setPropertyValue("y1", value);
            this.element.attr({ "y1": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "y2", {
        /**
         * @return {number} Y
         */
        get: function () {
            var value = this.getPropertyValue("y2");
            if (!__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](value)) {
                value = this.pixelHeight;
            }
            return value;
        },
        /**
         * Y coordinate of second end.
         *
         * @param {number} value Y
         */
        set: function (value) {
            if (!__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](value)) {
                value = 0;
            }
            this.setPropertyValue("y2", value);
            this.element.attr({ "y2": value });
        },
        enumerable: true,
        configurable: true
    });
    return Line;
}(__WEBPACK_IMPORTED_MODULE_0__Sprite__["a" /* Sprite */]));

//# sourceMappingURL=Line.js.map

/***/ }),

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Disposer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AxisLine__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AxisFill__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Grid__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__AxisLabel__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__AxisTick__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_utils_Math__ = __webpack_require__(2);
/**
 * Module, defining base Axis Renderer.
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
    __extends(AxisRenderer, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRenderer(axis) {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * A related chart.
         *
         * @todo Description
         * @type {MutableValueDisposer}
         */
        _this._chart = new __WEBPACK_IMPORTED_MODULE_1__core_utils_Disposer__["d" /* MutableValueDisposer */]();
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
        // Set axis
        _this.axis = axis;
        var gridContainer = _this.createChild(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]);
        gridContainer.shouldClone = false;
        gridContainer.layout = "none";
        gridContainer.isMeasured = false;
        gridContainer.width = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        gridContainer.height = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        _this.gridContainer = gridContainer;
        var breakContainer = _this.createChild(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]);
        breakContainer.shouldClone = false;
        breakContainer.isMeasured = false;
        breakContainer.layout = "none";
        breakContainer.width = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        breakContainer.height = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        _this.breakContainer = breakContainer;
        _this.line = axis.createChild(__WEBPACK_IMPORTED_MODULE_2__AxisLine__["a" /* AxisLine */]); // yes, to axis, not to renderer
        _this.line.shouldClone = false;
        _this.line.strokeOpacity = 0;
        _this.ticks.template.strokeOpacity = 0;
        //this.ticks.template.disabled = true;
        //this.axisFills.template.disabled = true;
        var baseGrid = axis.createChild(__WEBPACK_IMPORTED_MODULE_4__Grid__["a" /* Grid */]);
        baseGrid.shouldClone = false;
        _this.baseGrid = baseGrid;
        _this.gridContainer.events.on("maxsizechanged", _this.invalidateAxisItems, _this);
        // Make elements disposable
        var disposers = _this._disposers;
        disposers.push(baseGrid);
        disposers.push(_this.line);
        disposers.push(gridContainer);
        disposers.push(breakContainer);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
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
        this.events.on("sizechanged", this.updateTooltip, this);
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
            //item.visible = this.fitsToBounds(point);
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
     * @todo Description (review)
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
        return __WEBPACK_IMPORTED_MODULE_10__core_utils_Math__["round"](coordinate, 1);
    };
    /**
     * Converts a coordinate in pixels to a relative position. (0-1)
     *
     * @todo Description (review)
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
        return __WEBPACK_IMPORTED_MODULE_10__core_utils_Math__["round"](position, 5);
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
    AxisRenderer.prototype.updateLabelElement = function (label, position, endPosition) {
        // This is a placeholder method for extending classes to override.
    };
    /**
     * Updates and positions the axis line element.
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
        this.positionItem(axisBreak.endLine, axisBreak.endPoint);
    };
    Object.defineProperty(AxisRenderer.prototype, "minGridDistance", {
        /**
         * Returns currently set minimum distance.
         *
         * @return {number} Min distance (px)
         */
        get: function () {
            return this.getPropertyValue("minGridDistance");
        },
        /**
         * Sets mMinimum distance in pixels between grid elements.
         *
         * @param {number} value Min distance (px)
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
         * Returns currently set associated chart.
         *
         * @ignore Exclude from docs
         * @return {Chart} Chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * Sets a chart, associated with the Axis.
         *
         * @ignore Exclude from docs
         * @param {Chart} value Chart
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
        var updatedStart = axis.start + (axis.end - axis.start) * minPosition;
        var updatedEnd = axis.start + (axis.end - axis.start) * maxPosition;
        if (position < updatedStart || position > updatedEnd) {
            sprite.__disabled = true;
        }
        else {
            sprite.__disabled = false;
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
         * @return {ListTemplate} Fill elements
         */
        get: function () {
            if (!this._axisFills) {
                this._axisFills = new __WEBPACK_IMPORTED_MODULE_7__core_utils_List__["e" /* ListTemplate */](this.createFill(this.axis));
                this._disposers.push(new __WEBPACK_IMPORTED_MODULE_7__core_utils_List__["c" /* ListDisposer */](this._axisFills));
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
        return new __WEBPACK_IMPORTED_MODULE_3__AxisFill__["a" /* AxisFill */](axis);
    };
    Object.defineProperty(AxisRenderer.prototype, "grid", {
        /**
         * A list of Axis' Grid elements.
         *
         * @return {ListTemplate} Grid elements
         */
        get: function () {
            if (!this._grid) {
                this._grid = new __WEBPACK_IMPORTED_MODULE_7__core_utils_List__["e" /* ListTemplate */](this.createGrid());
                this._disposers.push(new __WEBPACK_IMPORTED_MODULE_7__core_utils_List__["c" /* ListDisposer */](this._grid));
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
        return new __WEBPACK_IMPORTED_MODULE_4__Grid__["a" /* Grid */]();
    };
    Object.defineProperty(AxisRenderer.prototype, "ticks", {
        /**
         * A list of Axis' Tick elements.
         *
         * @return {ListTemplate} Tick elements
         */
        get: function () {
            if (!this._ticks) {
                var tick = this.createTick();
                tick.isMeasured = false;
                this._ticks = new __WEBPACK_IMPORTED_MODULE_7__core_utils_List__["e" /* ListTemplate */](tick);
                this._disposers.push(new __WEBPACK_IMPORTED_MODULE_7__core_utils_List__["c" /* ListDisposer */](this._ticks));
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
        return new __WEBPACK_IMPORTED_MODULE_6__AxisTick__["a" /* AxisTick */]();
    };
    Object.defineProperty(AxisRenderer.prototype, "labels", {
        /**
         * A list of Axis' Label elements.
         *
         * @return {ListTemplate} Label elements
         */
        get: function () {
            if (!this._labels) {
                this._labels = new __WEBPACK_IMPORTED_MODULE_7__core_utils_List__["e" /* ListTemplate */](this.createLabel());
                this._disposers.push(new __WEBPACK_IMPORTED_MODULE_7__core_utils_List__["c" /* ListDisposer */](this._labels));
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
        return new __WEBPACK_IMPORTED_MODULE_5__AxisLabel__["a" /* AxisLabel */]();
    };
    Object.defineProperty(AxisRenderer.prototype, "inside", {
        /**
         * Returns current setting for `inside`.
         *
         * @return {boolean} Labels inside?
         */
        get: function () {
            return this.getPropertyValue("inside");
        },
        /**
         * Sets if Axis labels and ticks should be drawn inside Plot area, does not work with all renderers, like AxisRendererRadial.
         *
         * @param {boolean} value Labels inside?
         */
        set: function (value) {
            this.setPropertyValue("inside", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "opposite", {
        /**
         * Returns current setting for `opposite`.
         *
         * @return {boolean} Draw axis on opposite side?
         */
        get: function () {
            return this.getPropertyValue("opposite");
        },
        /**
         * Sets whether axis should be drawn on the opposite side of the plot area,
         * than it would normally be drawn base on chart's settings. Does not work with all renderers, like AxisRendererRadial and AxisRenderer Circular.
         *
         * @param {boolean} value Draw axis on opposite side?
         */
        set: function (value) {
            this.setPropertyValue("opposite", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "fullWidthTooltip", {
        /**
         * Returns current setting for full-width tooltips.
         *
         * @return {boolean} Full width tooltip?
         */
        get: function () {
            return this.getPropertyValue("fullWidthTooltip");
        },
        /**
         * Sets if Axis tooltip should take the whole width of the axis cell.
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
         * Returns current axis tooltip location.
         *
         * @return {number} Tooltip location
         */
        get: function () {
            return this.getPropertyValue("tooltipLocation");
        },
        /**
         * Sets location within axis cell to show tooltip on. (0-1)
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
         * Returns currently set cell start location.
         *
         * @return {number} Cell start (0-1)
         */
        get: function () {
            return this.getPropertyValue("cellStartLocation");
        },
        /**
         * Sets location for the cell start.
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
         * @todo Description (review)
         * @param {number} value Cell start (0-1)
         */
        set: function (value) {
            this.setPropertyValue("cellStartLocation", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "cellEndLocation", {
        /**
         * Returns currently set cell end location.
         *
         * @return {number} Cell end (0-1)
         */
        get: function () {
            return this.getPropertyValue("cellEndLocation");
        },
        /**
         * Sets location for the cell end.
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
         * @todo Description (review)
         * @param {number} value Cell end (0-1)
         */
        set: function (value) {
            this.setPropertyValue("cellEndLocation", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "inversed", {
        /**
         * Returns currently set `inversed` setting.
         *
         * @return {boolean} Flip axis?
         */
        get: function () {
            return this.getPropertyValue("inversed");
        },
        /**
         * Sets if the scale of the axis should be flipped.
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
         * Returns currently set min label position.
         *
         * @return {number} Min label position (0-1)
         */
        get: function () {
            return this.getPropertyValue("minLabelPosition");
        },
        /**
         * Sets a minimum position along the Axis, for labels.
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
         * @param {number} value Min label position (0-1)
         */
        set: function (value) {
            this.setPropertyValue("minLabelPosition", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRenderer.prototype, "maxLabelPosition", {
        /**
         * Returns currently set max label position.
         *
         * @return {number} Max label position (0-1)
         */
        get: function () {
            return this.getPropertyValue("maxLabelPosition");
        },
        /**
         * Sets a maximum position along the Axis, for labels.
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
         * @param {number} value Max label position (0-1)
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
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_8__core_Registry__["a" /* registry */].registeredClasses["AxisRenderer"] = AxisRenderer;
//# sourceMappingURL=AxisRenderer.js.map

/***/ }),

/***/ 123:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WavedRectangle; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Rectangle__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__rendering_Path__ = __webpack_require__(19);
/**
 * Functionality for drawing rectangles with waved edges.
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


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a rectangle with waved edges.
 *
 * @see {@link IWavedRectangleEvents} for a list of available events
 * @see {@link IWavedRectangleAdapters} for a list of available Adapters
 */
var WavedRectangle = /** @class */ (function (_super) {
    __extends(WavedRectangle, _super);
    /**
     * Constructor
     */
    function WavedRectangle() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Top waved?
         *
         * @type {boolean}
         */
        _this._twaved = true;
        /**
         * Right side waved?
         *
         * @type {boolean}
         */
        _this._rwaved = true;
        /**
         * Bottom waved?
         *
         * @type {boolean}
         */
        _this._bwaved = true;
        /**
         * Left side waved?
         *
         * @type {boolean}
         */
        _this._lwaved = true;
        _this.className = "WavedRectangle";
        // Add path element
        _this.element = _this.paper.add("path");
        // Set defaults
        _this.waveLength = 16;
        _this.waveHeight = 4;
        _this.tension = 0.8;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the waved rectangle.
     *
     * @ignore Exclude from docs
     */
    WavedRectangle.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var w = this.pixelWidth;
        var h = this._pixelHeight;
        if (w > 0 && h > 0) {
            var p1 = { x: 0, y: 0 };
            var p2 = { x: w, y: 0 };
            var p3 = { x: w, y: h };
            var p4 = { x: 0, y: h };
            var waveLength = this.waveLength;
            var waveHeight = this.waveHeight;
            var td = "";
            var rd = "";
            var bd = "";
            var ld = "";
            if (this._twaved) {
                td = __WEBPACK_IMPORTED_MODULE_1__rendering_Path__["wavedLine"](p1, p2, waveLength, waveHeight, this.tension, true);
            }
            if (this._rwaved) {
                ld = __WEBPACK_IMPORTED_MODULE_1__rendering_Path__["wavedLine"](p2, p3, waveLength, waveHeight, this.tension, true);
            }
            if (this._bwaved) {
                bd = __WEBPACK_IMPORTED_MODULE_1__rendering_Path__["wavedLine"](p3, p4, waveLength, waveHeight, this.tension, true);
            }
            if (this._rwaved) {
                rd = __WEBPACK_IMPORTED_MODULE_1__rendering_Path__["wavedLine"](p4, p1, waveLength, waveHeight, this.tension, true);
            }
            var d = __WEBPACK_IMPORTED_MODULE_1__rendering_Path__["moveTo"](p1) + td + __WEBPACK_IMPORTED_MODULE_1__rendering_Path__["lineTo"](p2) + ld + __WEBPACK_IMPORTED_MODULE_1__rendering_Path__["lineTo"](p3) + bd + __WEBPACK_IMPORTED_MODULE_1__rendering_Path__["lineTo"](p4) + rd + "z";
            this.element.attr({ "d": d });
        }
    };
    Object.defineProperty(WavedRectangle.prototype, "waveLength", {
        /**
         * @return {number} Wave length (px)
         */
        get: function () {
            return this.getPropertyValue("waveLength");
        },
        /**
         * Wave length in pixels.
         *
         * @default 16
         * @param {number}  value  Wave length (px)
         */
        set: function (value) {
            this.setPropertyValue("waveLength", value);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WavedRectangle.prototype, "waveHeight", {
        /**
         * @return {number} Wave height (px)
         */
        get: function () {
            return this.getPropertyValue("waveHeight");
        },
        /**
         * Wave height in pixels.
         *
         * @default 4
         * @param {number}  value  Wave height (px)
         */
        set: function (value) {
            this.setPropertyValue("waveHeight", value);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets which side should be waved or not. If particular side is set to
     * `false`, a straight line will be drawn on that side.
     *
     * @param {boolean}  top     Top waved?
     * @param {boolean}  right   Right side waved?
     * @param {boolean}  bottom  Bottom Waved?
     * @param {boolean}  left    Left side waved?
     */
    WavedRectangle.prototype.setWavedSides = function (top, right, bottom, left) {
        this._twaved = top;
        this._lwaved = right;
        this._bwaved = bottom;
        this._rwaved = left;
    };
    /**
     * Updates bounding box based on element dimension settings.
     *
     * @ignore Exclude from docs
     */
    WavedRectangle.prototype.measureElement = function () {
        this._bbox = {
            x: 0,
            y: 0,
            width: this.innerWidth,
            height: this.innerHeight
        };
    };
    Object.defineProperty(WavedRectangle.prototype, "tension", {
        /**
         * @return {number} Tension
         */
        get: function () {
            return this.getPropertyValue("tension");
        },
        /**
         * Tension of the wave.
         *
         * @default 0.8
         * @param {number}  value  Tension
         */
        set: function (value) {
            this.setPropertyValue("tension", value);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    return WavedRectangle;
}(__WEBPACK_IMPORTED_MODULE_0__Rectangle__["a" /* Rectangle */]));

//# sourceMappingURL=WavedRectangle.js.map

/***/ }),

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ChartDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Chart; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Component__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_System__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Container__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_elements_Label__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_DataItem__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__ = __webpack_require__(0);
/**
 * [[Chart]] class provides base functionality for all chart types to inherit.
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
    __extends(ChartDataItem, _super);
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
}(__WEBPACK_IMPORTED_MODULE_5__core_DataItem__["a" /* DataItem */]));

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
    __extends(Chart, _super);
    /**
     * Constructor
     */
    function Chart() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "Chart";
        // Create a list of titles
        _this.titles = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["e" /* ListTemplate */](new __WEBPACK_IMPORTED_MODULE_4__core_elements_Label__["a" /* Label */]());
        // Chart component is also a container. it holds _chartAndLegendCont and titles
        _this.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
        _this.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
        _this.layout = "vertical";
        // Chart and legend
        var chartAndLegendContainer = _this.createChild(__WEBPACK_IMPORTED_MODULE_3__core_Container__["a" /* Container */]);
        chartAndLegendContainer.shouldClone = false;
        chartAndLegendContainer.layout = "vertical";
        chartAndLegendContainer.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
        chartAndLegendContainer.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
        _this.chartAndLegendContainer = chartAndLegendContainer;
        // Chart container holds all the elements of a chart, extept titles and legend
        var chartContainer = chartAndLegendContainer.createChild(__WEBPACK_IMPORTED_MODULE_3__core_Container__["a" /* Container */]);
        chartContainer.shouldClone = false;
        chartContainer.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
        chartContainer.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
        _this.chartContainer = chartContainer;
        // hides everything on first frame and shows only on second. helps to avoid technical flickering
        chartAndLegendContainer.visible = false;
        chartAndLegendContainer.events.once("validated", function () {
            __WEBPACK_IMPORTED_MODULE_1__core_System__["b" /* system */].events.once("enterframe", function () {
                chartAndLegendContainer.visible = true;
            });
        });
        // Add title list events to apply certain formatting options and to make
        // the chart reference them as accessible screen reader labels
        _this.titles.events.on("insert", function (label) {
            _this.processTitle(label);
            _this.updateReaderTitleReferences();
        }, _this);
        _this.titles.events.on("remove", function (label) {
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
        this.readerTitle = this.language.translate("Chart");
    };
    /**
     * (Re)validates chart data.
     *
     * @ignore Exclude from docs
     */
    Chart.prototype.validateData = function () {
        _super.prototype.validateData.call(this);
        this.feedLegend();
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
                    legend.toBack();
                    break;
                case "right":
                    chartAndLegendContainer.layout = "horizontal";
                    legend.toFront();
                    break;
                case "top":
                    chartAndLegendContainer.layout = "vertical";
                    legend.toBack();
                    break;
                case "bottom":
                    chartAndLegendContainer.layout = "vertical";
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
     * @param  {IListEvents<Label>["insert"]}  event  An event object which is triggered when inserting into titles list
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
            __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.titles.iterator(), function (title) {
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
         * @return {Legend} legend
         */
        get: function () {
            return this._legend;
        },
        /**
         * Chart legend
         *
         * @todo Description
         *
         * @param {Legend} legend
         */
        set: function (legend) {
            this.setLegend(legend);
        },
        enumerable: true,
        configurable: true
    });
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
                    if (event.property == "position") {
                        _this.fixLayout();
                    }
                });
            }
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
            if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](config.legend) && !__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](config.legend.type)) {
                config.legend.type = "Legend";
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return Chart;
}(__WEBPACK_IMPORTED_MODULE_0__core_Component__["a" /* Component */]));

//# sourceMappingURL=Chart.js.map

/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LegendDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return LegendSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Legend; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Component__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_DataItem__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_elements_RoundedRectangle__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_Container__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_elements_Label__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Keyboard__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_interaction_Interaction__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_utils_InterfaceColorSet__ = __webpack_require__(13);
/**
 * Legend-related functionality.
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











/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[Legend]].
 *
 * @see {@link DataItem}
 */
var LegendDataItem = /** @class */ (function (_super) {
    __extends(LegendDataItem, _super);
    /**
     * Constructor
     */
    function LegendDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "LegendDataItem";
        _this.applyTheme();
        return _this;
    }
    return LegendDataItem;
}(__WEBPACK_IMPORTED_MODULE_1__core_DataItem__["a" /* DataItem */]));

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines a class that carries legend settings.
 *
 * A legend might change its settings dynamically. Legend can also be shared
 * by several elements, requiring different settings.
 *
 * Having legend's settings in a separate object is a good way to "hot swap"
 * a set of settings for the legend.
 */
var LegendSettings = /** @class */ (function () {
    function LegendSettings() {
        /**
         * Should marker be created for each legend item.
         *
         * @type {boolean}
         */
        this.createMarker = true;
    }
    return LegendSettings;
}());

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * [[Legend]] class is used to create legend for the chart.
 *
 * @see {@link ILegendEvents} for a list of available events
 * @see {@link ILegendAdapters} for a list of available Adapters
 * @todo Verify/implement dynamic updating of legend items once the properties of related Series change
 */
var Legend = /** @class */ (function (_super) {
    __extends(Legend, _super);
    /**
     * Constructor
     */
    function Legend() {
        var _this = _super.call(this) || this;
        _this.className = "Legend";
        // Set defaults
        _this.layout = "grid";
        _this.useDefaultMarker = false;
        _this.contentAlign = "center";
        // Create a template container and list for legend items
        var itemContainer = new __WEBPACK_IMPORTED_MODULE_4__core_Container__["a" /* Container */]();
        itemContainer.padding(10, 0, 10, 0);
        itemContainer.margin(0, 5, 0, 0);
        itemContainer.layout = "horizontal";
        itemContainer.clickable = true;
        itemContainer.focusable = true;
        itemContainer.role = "checkbox";
        itemContainer.background.opacity = 0; // creates hit area
        itemContainer.togglable = true;
        // Add click/tap event to toggle item
        itemContainer.events.on("hit", function (ev) {
            _this.toggleDataItem(ev.target.dataItem);
        }, _this);
        // Add focus event so that we can track which object is currently in focus
        // for keyboard toggling
        itemContainer.events.on("focus", function (ev) {
            _this.focusedItem = ev.target.dataItem;
        });
        itemContainer.events.on("blur", function (ev) {
            _this.focusedItem = undefined;
        });
        // Create container list using item template we just created
        _this.itemContainers = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["e" /* ListTemplate */](itemContainer);
        // Set up global keyboard events for toggling elements
        __WEBPACK_IMPORTED_MODULE_8__core_interaction_Interaction__["b" /* interaction */].body.events.on("keyup", function (ev) {
            if (__WEBPACK_IMPORTED_MODULE_6__core_utils_Keyboard__["b" /* keyboard */].isKey(ev.event, "enter") && _this.focusedItem) {
                _this.toggleDataItem(_this.focusedItem);
            }
        }, _this);
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_10__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        // Create a template container and list for the a marker
        var marker = new __WEBPACK_IMPORTED_MODULE_4__core_Container__["a" /* Container */]();
        marker.width = 23;
        marker.height = 23;
        marker.mouseEnabled = false;
        marker.setStateOnChildren = true;
        marker.propertyFields.fill = "fill";
        var disabledColor = interfaceColors.getFor("disabledBackground");
        marker.events.on("childadded", function (event) {
            var activeState = event.newValue.states.create("active");
            activeState.properties.stroke = disabledColor;
            activeState.properties.fill = disabledColor;
        });
        _this.markers = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["e" /* ListTemplate */](marker);
        // Create a legend background element
        var rectangle = marker.createChild(__WEBPACK_IMPORTED_MODULE_3__core_elements_RoundedRectangle__["a" /* RoundedRectangle */]);
        rectangle.width = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        rectangle.height = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        // Create a template container and list for item labels
        var label = new __WEBPACK_IMPORTED_MODULE_5__core_elements_Label__["a" /* Label */]();
        label.text = "{name}";
        label.margin(0, 5, 0, 5);
        label.valign = "middle";
        label.states.create("active").properties.fill = interfaceColors.getFor("disabledBackground");
        label.renderingFrequency = 2;
        _this.labels = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["e" /* ListTemplate */](label);
        // Create a template container and list for item value labels
        var valueLabel = new __WEBPACK_IMPORTED_MODULE_5__core_elements_Label__["a" /* Label */]();
        valueLabel.margin(0, 5, 0, 0);
        valueLabel.valign = "middle";
        valueLabel.width = 40; // to avoid rearranging legend entries when value changes.
        valueLabel.align = "right";
        valueLabel.textAlign = "end";
        valueLabel.states.create("active").properties.fill = interfaceColors.getFor("disabledBackground");
        valueLabel.renderingFrequency = 2;
        _this.valueLabels = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["e" /* ListTemplate */](valueLabel);
        _this.position = "bottom";
        // Create a state for disabled legend items
        itemContainer.states.create("active");
        itemContainer.setStateOnChildren = true;
        // Apply accessibility settings
        _this.role = "group";
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    Legend.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        this.readerTitle = this.language.translate("Legend");
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {LegendDataItem} Data Item
     */
    Legend.prototype.createDataItem = function () {
        return new LegendDataItem();
    };
    /**
     * Removes children before calling validate method of the super class. (which
     * initiates building of the legend)
     *
     * @ignore Exclude from docs
     */
    Legend.prototype.validate = function () {
        this.removeChildren();
        _super.prototype.validate.call(this);
    };
    /**
     * [validateDataElement description]
     *
     * @ignore Exclude from docs
     * @param {LegendDataItem} dataItem Data item
     * @todo Description
     * @todo Figure out how to update appearance of legend item without losing focus
     * @todo Update legend marker appearance as apperance of related series changes
     */
    Legend.prototype.validateDataElement = function (dataItem) {
        _super.prototype.validateDataElement.call(this, dataItem);
        // Get data item (legend item's) container and assign it to legend container
        var container = dataItem.itemContainer;
        if (!container) {
            // Create new container for the data item
            container = this.itemContainers.create();
            dataItem.addSprite(container);
            container.readerTitle = this.language.translate("Click, tap or press ENTER to toggle");
            container.readerControls = dataItem.dataContext.uidAttr();
            container.readerLabelledBy = dataItem.dataContext.uidAttr();
            dataItem.itemContainer = container;
            // Add an event to check for item's properties
            // We cannot do this on a template since template does not have
            // dataContext, yet
            dataItem.dataContext.events.on("propertychanged", function (ev) {
                if (ev.property == "visible") {
                    container.readerChecked = dataItem.dataContext.visible;
                }
                else {
                    //this.validateDataElement(dataItem);
                }
            });
        }
        // Set parent and update current state
        container.parent = this;
        container.readerChecked = dataItem.dataContext.visible;
        // Create a marker for legend item
        var marker = dataItem.marker;
        if (!marker) {
            marker = this.markers.create();
            marker.parent = container;
            dataItem.marker = marker;
        }
        // If we are not using default markers, create a unique legend marker based
        // on the data item type
        if (!this.useDefaultMarker) {
            dataItem.dataContext.createLegendMarker(marker);
        }
        // Create label
        var label = dataItem.label;
        if (!label) {
            label = this.labels.create();
            label.parent = container;
            dataItem.label = label;
        }
        // Create value label
        var valueLabel = dataItem.valueLabel;
        if (!valueLabel) {
            valueLabel = this.valueLabels.create();
            valueLabel.parent = container;
            dataItem.valueLabel = valueLabel;
        }
        // Tell series its legend data item
        dataItem.dataContext.legendDataItem = dataItem;
    };
    Object.defineProperty(Legend.prototype, "position", {
        /**
         * @return {LegendPosition} Position
         */
        get: function () {
            return this.getPropertyValue("position");
        },
        /**
         * Position of the legend.
         *
         * Options: "left", "right", "top", "bottom" (default), or "absolute".
         *
         * @default "bottom"
         * @param {LegendPosition}  value  Position
         */
        set: function (value) {
            if (this.setPropertyValue("position", value)) {
                if (value == "left" || value == "right") {
                    this.width = 200;
                    this.margin(10, 20, 10, 20);
                    this.valign = "middle";
                    this.itemContainers.template.width = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
                    this.valueLabels.template.width = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
                }
                else {
                    this.itemContainers.template.maxWidth = undefined;
                    this.width = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
                    this.valueLabels.template.width = 40;
                }
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Legend.prototype, "useDefaultMarker", {
        /**
         * @return {boolean} Use default marker?
         */
        get: function () {
            return this.getPropertyValue("useDefaultMarker");
        },
        /**
         * Should legend try to mirror the look of the related item when building
         * the marker for legend item?
         *
         * If set to `true` it will try to make the marker look like its related
         * item.
         *
         * E.g. if an item is for a Line Series, it will display a line of the
         * same thickness, color, and will use the same bullets if series have them.
         *
         * @default false
         * @param {boolean} value Use default marker?
         */
        set: function (value) {
            this.setPropertyValue("useDefaultMarker", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Toggles a legend item.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]} item Legend item
     * @todo Maybe do it with togglable instead
     */
    Legend.prototype.toggleDataItem = function (item) {
        var dataContext = item.dataContext;
        if (!dataContext.visible || dataContext.isHiding) {
            dataContext.show();
        }
        else {
            dataContext.hide();
        }
    };
    Object.defineProperty(Legend.prototype, "preloader", {
        /**
         * Override preloader method so that legend does not accidentally show its
         * own preloader.
         *
         * @ignore Exclude from docs
         * @return {Preloader} Always `undefined`
         */
        get: function () {
            return;
        },
        enumerable: true,
        configurable: true
    });
    return Legend;
}(__WEBPACK_IMPORTED_MODULE_0__core_Component__["a" /* Component */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["a" /* registry */].registeredClasses["Legend"] = Legend;
//# sourceMappingURL=Legend.js.map

/***/ }),

/***/ 141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisRendererX; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisRenderer__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_WavedLine__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_WavedRectangle__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__ = __webpack_require__(9);
/**
 * Module, defining Axis Renderer for vertical axes.
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








/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A renderer for horizontal axis.
 *
 * @see {@link IAxisRendererEvents} for a list of available events
 * @see {@link IAxisRendererAdapters} for a list of available Adapters
 */
var AxisRendererX = /** @class */ (function (_super) {
    __extends(AxisRendererX, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRendererX(axis) {
        var _this = _super.call(this, axis) || this;
        _this.className = "AxisRendererX";
        _this.minGridDistance = 120;
        _this.opposite = false;
        _this.rotation = 0;
        _this.width = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(100);
        axis.layout = "vertical"; // in order to properly position title, as title goes to axis, not renderer
        _this.labels.template.horizontalCenter = "middle";
        _this.applyTheme();
        return _this;
    }
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
    AxisRendererX.prototype.processRenderer = function () {
        _super.prototype.processRenderer.call(this);
        // can not do this in init, as axis is set later
        var axis = this.axis;
        if (axis) {
            axis.width = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(100);
            // @todo Is thi sneeded?
            this.line;
            var title = axis.title;
            title.rotation = 0;
            title.align = "center";
            if (this.opposite) {
                this.line.toFront();
                title.toBack();
            }
            else {
                title.toFront();
                this.line.toBack();
            }
        }
    };
    /**
     * Updates some of the Axis tooltip's visual properties, related to
     * rendering of the Axis.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    AxisRendererX.prototype.updateTooltip = function () {
        var axis = this.axis;
        if (axis) {
            var bigNum = 1000;
            var bbx = this.line.pixelX;
            var bby = this.line.pixelY;
            var bbw = this.pixelWidth;
            var bbh = bigNum;
            // top
            if (this.opposite) {
                if (!this.inside) {
                    bby = -bigNum;
                    bbh = bigNum;
                }
            }
            // bottom
            else {
                if (this.inside) {
                    bby = -bigNum;
                    bbh = bigNum;
                }
            }
            this.axis.updateTooltip("vertical", { x: bbx, y: bby, width: bbw, height: bbh });
        }
    };
    /**
     * Updates and positions a label element.
     *
     * @ignore Exclude from docs
     * @param {AxisLabel}  label        Label element
     * @param {number}     position     Starting position
     * @param {number}     endPosition  Ending position
     */
    AxisRendererX.prototype.updateLabelElement = function (label, position, endPosition) {
        position = position + (endPosition - position) * label.location;
        var point = this.positionToPoint(position);
        label.isMeasured = !label.inside;
        if (!this.opposite && label.inside) {
            label.verticalCenter = "bottom";
        }
        this.positionItem(label, point);
        this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
    };
    Object.defineProperty(AxisRendererX.prototype, "axisLength", {
        /**
         * Returns actual length of the Axis, in pixels.
         *
         * @return {number} Length (px)
         */
        get: function () {
            var axis = this.axis;
            return axis.pixelWidth - axis.pixelPaddingRight - axis.pixelPaddingLeft;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts relative position on axis to point coordinates.
     *
     * @param  {number}  position  Position (0-1)
     * @return {IPoint}            Point
     */
    AxisRendererX.prototype.positionToPoint = function (position) {
        return { x: this.positionToCoordinate(position), y: 0 };
    };
    /**
     * Converts a point at specific coordinates to a relative position (0-1)
     * on the axis.
     *
     * @param  {IPoint}  point  Point
     * @return {number}         Position (0-1)
     */
    AxisRendererX.prototype.pointToPosition = function (point) {
        return this.coordinateToPosition(point.x);
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
    AxisRendererX.prototype.getPositionRangePath = function (startPosition, endPosition) {
        var x1 = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["fitToRange"](this.positionToCoordinate(startPosition), 0, this.axisLength);
        var x2 = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["fitToRange"](this.positionToCoordinate(endPosition), 0, this.axisLength);
        var w = Math.abs(x2 - x1);
        var h = this.gridContainer.pixelHeight;
        var x = Math.min(x1, x2);
        var y = 0;
        return __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["rectToPath"]({
            x: x,
            y: y,
            width: w,
            height: h
        }, true);
    };
    /**
     * Updates and positions an axis break element.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Break element
     */
    AxisRendererX.prototype.updateBreakElement = function (axisBreak) {
        _super.prototype.updateBreakElement.call(this, axisBreak);
        var startLine = axisBreak.startLine;
        var endLine = axisBreak.endLine;
        var fillShape = axisBreak.fillShape;
        var startPoint = axisBreak.startPoint;
        var endPoint = axisBreak.endPoint;
        var y1 = axisBreak.pixelMarginLeft;
        var y2 = this.gridContainer.pixelHeight - axisBreak.pixelMarginTop - axisBreak.pixelMarginBottom;
        startLine.y = y1;
        startLine.width = 0;
        startLine.height = y2;
        endLine.y = y1;
        endLine.width = 0;
        endLine.height = y2;
        fillShape.height = Math.abs(y2 - y1);
        fillShape.width = Math.abs(endPoint.x - startPoint.x);
        fillShape.y = y1;
        fillShape.x = startPoint.x;
    };
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    AxisRendererX.prototype.updateGridElement = function (grid, position, endPosition) {
        position = position + (endPosition - position) * grid.location;
        var point = this.positionToPoint(position);
        if (grid.element) {
            grid.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["lineTo"]({ x: 0, y: this.gridContainer.pixelHeight }) });
        }
        this.positionItem(grid, point);
        this.toggleVisibility(grid, position, 0, 1);
    };
    /**
     * Updates and positions a tick element.
     *
     * @ignore Exclude from docs
     * @param {AxisTick}  tick         Tick element
     * @param {number}    position     Starting position
     * @param {number}    endPosition  End position
     */
    AxisRendererX.prototype.updateTickElement = function (tick, position, endPosition) {
        position = position + (endPosition - position) * tick.location;
        var point = this.positionToPoint(position);
        var tickLength = tick.length;
        if (this.opposite) {
            point.y = this.pixelHeight;
            tickLength *= (tick.inside ? 1 : -1);
        }
        else {
            tickLength *= (tick.inside ? -1 : 1);
        }
        tick.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["lineTo"]({ x: 0, y: tickLength }) });
        this.positionItem(tick, point);
        this.toggleVisibility(tick, position, 0, 1);
    };
    /**
     * Updates and positions the axis line element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererX.prototype.updateAxisLine = function () {
        var element = this.line.element;
        if (element) {
            element.attr({ "d": __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["lineTo"]({ x: this.axisLength, y: 0 }) });
        }
    };
    /**
     * Updates and positions the base grid element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererX.prototype.updateBaseGridElement = function () {
        _super.prototype.updateBaseGridElement.call(this);
        var axis = this.axis;
        var h = this.gridContainer.pixelHeight;
        var w = this.gridContainer.pixelWidth;
        var baseGrid = this.baseGrid;
        var x = axis.basePoint.x;
        if (x < 0 || x > w) {
            baseGrid.hide(0);
        }
        else {
            var y = __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__["spritePointToSprite"]({ x: 0, y: 0 }, this.gridContainer, this).y;
            baseGrid.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_6__core_rendering_Path__["lineTo"]({ x: 0, y: h }) });
            baseGrid.moveTo({ x: x, y: y });
            baseGrid.show(0);
        }
    };
    /**
     * Creates visual elements for and axis break.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Axis break
     */
    AxisRendererX.prototype.createBreakSprites = function (axisBreak) {
        axisBreak.startLine = new __WEBPACK_IMPORTED_MODULE_1__core_elements_WavedLine__["a" /* WavedLine */]();
        axisBreak.endLine = new __WEBPACK_IMPORTED_MODULE_1__core_elements_WavedLine__["a" /* WavedLine */]();
        var wavedRectangle = new __WEBPACK_IMPORTED_MODULE_2__core_elements_WavedRectangle__["a" /* WavedRectangle */]();
        wavedRectangle.setWavedSides(false, true, false, true);
        axisBreak.fillShape = wavedRectangle;
    };
    Object.defineProperty(AxisRendererX.prototype, "inside", {
        /**
         * Returns current setting for `inside`.
         *
         * @return {boolean} Labels inside?
         */
        get: function () {
            return this.getPropertyValue("inside");
        },
        /**
         * Sets if Axis labels should be drawn inside Axis.
         *
         * @param {boolean} value Labels inside?
         */
        set: function (value) {
            this.setPropertyValue("inside", value);
            this.minHeight = value ? undefined : 40;
        },
        enumerable: true,
        configurable: true
    });
    return AxisRendererX;
}(__WEBPACK_IMPORTED_MODULE_0__AxisRenderer__["a" /* AxisRenderer */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["a" /* registry */].registeredClasses["AxisRendererX"] = AxisRendererX;
//# sourceMappingURL=AxisRendererX.js.map

/***/ }),

/***/ 151:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisFill; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Sprite__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_InterfaceColorSet__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(0);
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




/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * AxisFill is a base class used to defines fill shapes for various
 * type-specific Axes.
 *
 * Axis fills are used to add fills to specific ranges of those axes.
 *
 * @see {@link IAxisFillEvents} for a list of available events
 * @see {@link IAxisFillAdapters} for a list of available Adapters
 * @important
 */
var AxisFill = /** @class */ (function (_super) {
    __extends(AxisFill, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Axis
     */
    function AxisFill(axis) {
        var _this = _super.call(this) || this;
        _this.axis = axis;
        _this.element = _this.paper.add("path");
        _this.className = "AxisFill";
        _this.isMeasured = false;
        _this.location = 0;
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_2__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        _this.fill = interfaceColors.getFor("alternativeBackground");
        _this.fillOpacity = 0;
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the fill element.
     *
     * @ignore Exclude from docs
     */
    AxisFill.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (this.axis && __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](this.startPosition) && __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](this.endPosition)) {
            this.fillPath = this.axis.getPositionRangePath(this.startPosition, this.endPosition);
            this.element.attr({ "d": this.fillPath });
        }
    };
    Object.defineProperty(AxisFill.prototype, "startPosition", {
        /**
         * Returns current starting position.
         *
         * @return {number} Start position
         */
        get: function () {
            return this.getPropertyValue("startPosition");
        },
        /**
         * Sets the actual starting position of the fill.
         *
         * @param {number} value Starting position
         */
        set: function (value) {
            this.setPropertyValue("startPosition", value);
            this.invalidate(); // this is needed as relative position might not change when zooming
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisFill.prototype, "endPosition", {
        /**
         * Returns current end position.
         *
         * @return {number} End position
         */
        get: function () {
            return this.getPropertyValue("endPosition");
        },
        /**
         * Sets the actual end position of the fill.
         *
         * @param {number} value End position
         */
        set: function (value) {
            this.setPropertyValue("endPosition", value);
            this.invalidate(); // this is needed as relative position might not change when zooming
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisFill.prototype, "location", {
        /**
         * Returns current relative location.
         *
         * @return {AxisItemLocation} Location (0-1)
         */
        get: function () {
            return this.getPropertyValue("location");
        },
        /**
         * Sets the relative location of the fill. (0-1)
         *
         * @param {number} value Location (0-1)
         */
        set: function (value) {
            this.setPropertyValue("location", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return AxisFill;
}(__WEBPACK_IMPORTED_MODULE_0__core_Sprite__["a" /* Sprite */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["AxisFill"] = AxisFill;
//# sourceMappingURL=AxisFill.js.map

/***/ }),

/***/ 152:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Grid; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Sprite__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Color__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_InterfaceColorSet__ = __webpack_require__(13);
/**
 * A module defining functionality for axis grid elements.
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




/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Displays an axis grid line.
 *
 * @see {@link IGridEvents} for a list of available events
 * @see {@link IGridAdapters} for a list of available Adapters
 * @todo Review: container is better, as we'll be able to attach something to the grid, also with 3d charts we might need some additional elements
 * @important
 */
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    /**
     * Constructor
     */
    function Grid() {
        var _this = _super.call(this) || this;
        _this.className = "Grid";
        _this.element = _this.paper.add("path");
        _this.location = 0.5;
        _this.isMeasured = false;
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_3__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        _this.stroke = interfaceColors.getFor("grid");
        _this.pixelPerfect = true;
        _this.strokeOpacity = 0.15;
        _this.fill = Object(__WEBPACK_IMPORTED_MODULE_2__core_utils_Color__["c" /* color */])(); // "none";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(Grid.prototype, "location", {
        /**
         * @return {AxisItemLocation} Location (0-1)
         */
        get: function () {
            return this.getPropertyValue("location");
        },
        /**
         * Location within axis cell to place grid line on.
         *
         * * 0 - start
         * * 0.5 - middle
         * * 1 - end
         *
         * @param {AxisItemLocation}  value  Location (0-1)
         */
        set: function (value) {
            this.setPropertyValue("location", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return Grid;
}(__WEBPACK_IMPORTED_MODULE_0__core_Sprite__["a" /* Sprite */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["Grid"] = Grid;
//# sourceMappingURL=Grid.js.map

/***/ }),

/***/ 153:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisLabel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_elements_Label__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * Axis Label module
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


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Use to create labels on Axis.
 *
 * @see {@link IAxisLabelEvents} for a list of available events
 * @see {@link IAxisLabelAdapters} for a list of available Adapters
 * @important
 */
var AxisLabel = /** @class */ (function (_super) {
    __extends(AxisLabel, _super);
    /**
     * Constructor
     */
    function AxisLabel() {
        var _this = _super.call(this) || this;
        _this.className = "AxisLabel";
        _this.isMeasured = false;
        _this.padding(10, 10, 10, 10);
        _this.renderingFrequency = 1;
        _this.location = 0.5;
        _this.nonScaling = true;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(AxisLabel.prototype, "location", {
        /**
         * Returns current location of the label.
         *
         * @return {AxisItemLocation} Location (0-1)
         */
        get: function () {
            return this.getPropertyValue("location");
        },
        /**
         * Sets relative location of the label. (0-1)
         *
         * @param {AxisItemLocation}  value  Location (0-1)
         */
        set: function (value) {
            this.setPropertyValue("location", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisLabel.prototype, "inside", {
        /**
         * Returns if label is set to be drawn inside axis.
         *
         * @return {boolean} Inside?
         */
        get: function () {
            return this.getPropertyValue("inside");
        },
        /**
         * Sets if label should be drawn inside axis.
         *
         * @param {boolean}  value  Inside?
         */
        set: function (value) {
            this.setPropertyValue("inside", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return AxisLabel;
}(__WEBPACK_IMPORTED_MODULE_0__core_elements_Label__["a" /* Label */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["AxisLabel"] = AxisLabel;
//# sourceMappingURL=AxisLabel.js.map

/***/ }),

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Tick; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Sprite__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_InterfaceColorSet__ = __webpack_require__(13);
/**
 * Tick module
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



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A basic Tick class.
 *
 * A tick is a short dash, mainly connecting an object like axis or slice to
 * it's textual label.
 *
 * @see {@link ITickEvents} for a list of available events
 * @see {@link ITickAdapters} for a list of available Adapters
 * @important
 */
var Tick = /** @class */ (function (_super) {
    __extends(Tick, _super);
    /**
     * Constructor
     */
    function Tick() {
        var _this = _super.call(this) || this;
        _this.className = "Tick";
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_2__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        _this.fillOpacity = 0;
        _this.length = 6;
        _this.strokeOpacity = 0.2;
        _this.stroke = interfaceColors.getFor("grid");
        _this.isMeasured = false;
        _this.nonScalingStroke = true;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(Tick.prototype, "length", {
        /**
         * @return {number} Length (px)
         */
        get: function () {
            if (this.disabled) {
                return 0;
            }
            return this.getPropertyValue("length");
        },
        /**
         * Length of the tick in pixels.
         *
         * @param {number}  value  Length (px)
         */
        set: function (value) {
            this.setPropertyValue("length", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return Tick;
}(__WEBPACK_IMPORTED_MODULE_0__core_Sprite__["a" /* Sprite */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["Tick"] = Tick;
//# sourceMappingURL=Tick.js.map

/***/ }),

/***/ 159:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__charts_axes_AxisRenderer__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__charts_axes_AxisRendererX__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__charts_axes_AxisRendererY__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__charts_axes_AxisRendererCircular__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__charts_Chart__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__charts_Legend__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__charts_map_SmallMap__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__charts_map_ZoomControl__ = __webpack_require__(302);
/**
 * Defines default Responsive rules
 * @hidden
 */








/**
 * ============================================================================
 * RULES
 * ============================================================================
 * @hidden
 */
/**
 * Default rules.
 *
 * @ignore Exclude from docs
 * @todo Do not create states for objects that do not have any overrides
 */
/* harmony default export */ __webpack_exports__["default"] = ([
    /**
     * --------------------------------------------------------------------------
     * Microcharts and sparklines
     * W<=100 || H<=100
     * @todo
     */
    {
        relevant: function (container) {
            if ((container.pixelWidth <= 100) || (container.pixelHeight <= 100)) {
                return true;
            }
            return false;
        },
        state: function (object, stateId) {
            // Put vertical axis labels inside
            if (object instanceof __WEBPACK_IMPORTED_MODULE_0__charts_axes_AxisRenderer__["a" /* AxisRenderer */]) {
                var state = object.states.create(stateId);
                state.properties.minLabelPosition = 1;
                state.properties.maxLabelPosition = 0;
                return state;
            }
            return null;
        }
    },
    /**
     * --------------------------------------------------------------------------
     * Narrow
     * W<=200
     */
    {
        relevant: function (container) {
            if ((container.pixelWidth <= 200)) {
                return true;
            }
            return false;
        },
        state: function (object, stateId) {
            // Put vertical axis labels inside
            if (object instanceof __WEBPACK_IMPORTED_MODULE_2__charts_axes_AxisRendererY__["a" /* AxisRendererY */]) {
                var state = object.states.create(stateId);
                state.properties.inside = true;
                return state;
            }
            if (object instanceof __WEBPACK_IMPORTED_MODULE_3__charts_axes_AxisRendererCircular__["a" /* AxisRendererCircular */]) {
                var state = object.states.create(stateId);
                state.properties.inside = true;
                return state;
            }
            if (object instanceof __WEBPACK_IMPORTED_MODULE_6__charts_map_SmallMap__["a" /* SmallMap */]) {
                var state = object.states.create(stateId);
                state.properties.disabled = true;
                return state;
            }
            /*if (object instanceof Container && object.parent instanceof ZoomControl && !(object instanceof Button)) {
                let state = object.states.create(stateId);
                state.properties.height = 0;
                return state;
            }*/
            if (object instanceof __WEBPACK_IMPORTED_MODULE_7__charts_map_ZoomControl__["a" /* ZoomControl */]) {
                var state = object.states.create(stateId);
                state.properties.layout = "vertical";
                return state;
            }
            if (object instanceof __WEBPACK_IMPORTED_MODULE_4__charts_Chart__["a" /* Chart */]) {
                var state = object.states.create(stateId);
                state.properties.marginLeft = 0;
                state.properties.marginRight = 0;
                return state;
            }
            if (object instanceof __WEBPACK_IMPORTED_MODULE_5__charts_Legend__["a" /* Legend */] && (object.position == "left" || object.position == "right")) {
                var state = object.states.create(stateId);
                state.properties.position = "bottom";
                return state;
            }
            return null;
        }
    },
    /**
     * --------------------------------------------------------------------------
     * Short
     * H<=200
     */
    {
        relevant: function (container) {
            if ((container.pixelHeight <= 200)) {
                return true;
            }
            return false;
        },
        state: function (object, stateId) {
            // Put vertical axis labels inside
            if (object instanceof __WEBPACK_IMPORTED_MODULE_1__charts_axes_AxisRendererX__["a" /* AxisRendererX */]) {
                var state = object.states.create(stateId);
                state.properties.inside = true;
                return state;
            }
            if (object instanceof __WEBPACK_IMPORTED_MODULE_3__charts_axes_AxisRendererCircular__["a" /* AxisRendererCircular */]) {
                var state = object.states.create(stateId);
                state.properties.inside = true;
                return state;
            }
            if (object instanceof __WEBPACK_IMPORTED_MODULE_6__charts_map_SmallMap__["a" /* SmallMap */]) {
                var state = object.states.create(stateId);
                state.properties.disabled = true;
                return state;
            }
            /*if (object instanceof Container && object.parent instanceof ZoomControl && !(object instanceof Button)) {
                let state = object.states.create(stateId);
                state.properties.width = 100;
                return state;
            }*/
            if (object instanceof __WEBPACK_IMPORTED_MODULE_7__charts_map_ZoomControl__["a" /* ZoomControl */]) {
                var state = object.states.create(stateId);
                state.properties.layout = "horizontal";
                return state;
            }
            if (object instanceof __WEBPACK_IMPORTED_MODULE_4__charts_Chart__["a" /* Chart */]) {
                var state = object.states.create(stateId);
                state.properties.marginTop = 0;
                state.properties.marginBottom = 0;
                return state;
            }
            if (object instanceof __WEBPACK_IMPORTED_MODULE_5__charts_Legend__["a" /* Legend */] && (object.position == "bottom" || object.position == "top")) {
                var state = object.states.create(stateId);
                state.properties.position = "right";
                return state;
            }
            return null;
        }
    },
    /**
     * --------------------------------------------------------------------------
     * Super-small
     * W<=200 && H<=200
     */
    {
        relevant: function (container) {
            if ((container.pixelWidth <= 200) && (container.pixelHeight <= 200)) {
                return true;
            }
            return false;
        },
        state: function (object, stateId) {
            // Hide legend
            if (object instanceof __WEBPACK_IMPORTED_MODULE_5__charts_Legend__["a" /* Legend */]) {
                var state = object.states.create(stateId);
                state.properties.disabled = true;
                return state;
            }
            if (object instanceof __WEBPACK_IMPORTED_MODULE_7__charts_map_ZoomControl__["a" /* ZoomControl */]) {
                var state = object.states.create(stateId);
                state.properties.disabled = true;
                return state;
            }
            return null;
        }
    }
]);
//# sourceMappingURL=ResponsiveDefaults.js.map

/***/ }),

/***/ 169:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisLine; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Sprite__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Color__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_InterfaceColorSet__ = __webpack_require__(13);
/**
 *
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




/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw Axis line.
 *
 * @see {@link IAxisLineEvents} for a list of available events
 * @see {@link IAxisLineAdapters} for a list of available Adapters
 */
var AxisLine = /** @class */ (function (_super) {
    __extends(AxisLine, _super);
    /**
     * Constructor
     */
    function AxisLine() {
        var _this = _super.call(this) || this;
        _this.className = "AxisLine";
        _this.element = _this.paper.add("path");
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_3__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        _this.stroke = interfaceColors.getFor("grid");
        _this.strokeOpacity = 0.15;
        _this.pixelPerfect = true;
        _this.fill = Object(__WEBPACK_IMPORTED_MODULE_2__core_utils_Color__["c" /* color */])();
        _this.applyTheme();
        _this.mouseEnabled = false;
        _this.element.moveTo({ x: 0, y: 0 });
        return _this;
    }
    return AxisLine;
}(__WEBPACK_IMPORTED_MODULE_0__core_Sprite__["a" /* Sprite */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["AxisLine"] = AxisLine;
//# sourceMappingURL=AxisLine.js.map

/***/ }),

/***/ 170:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisTick; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__elements_Tick__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * Axis Tick module
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


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws an axis tick
 * @see {@link IAxisTickEvents} for a list of available events
 * @see {@link IAxisTickAdapters} for a list of available Adapters
 */
var AxisTick = /** @class */ (function (_super) {
    __extends(AxisTick, _super);
    function AxisTick() {
        var _this = _super.call(this) || this;
        _this.className = "AxisTick";
        _this.element = _this.paper.add("path");
        _this.location = 0.5;
        _this.isMeasured = false;
        _this.pixelPerfect = true;
        _this.length = 5;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(AxisTick.prototype, "location", {
        get: function () {
            return this.getPropertyValue("location");
        },
        set: function (value) {
            this.setPropertyValue("location", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisTick.prototype, "inside", {
        get: function () {
            return this.getPropertyValue("inside");
        },
        set: function (value) {
            this.setPropertyValue("inside", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return AxisTick;
}(__WEBPACK_IMPORTED_MODULE_0__elements_Tick__["a" /* Tick */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["AxisTick"] = AxisTick;
//# sourceMappingURL=AxisTick.js.map

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisLabelCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisLabel__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(0);
/**
 * Axis Label module
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




/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Use to create labels on circular axis.
 *
 * @see {@link IAxisLabelCircularEvents} for a list of available events
 * @see {@link IAxisLabelCircularAdapters} for a list of available Adapters
 */
var AxisLabelCircular = /** @class */ (function (_super) {
    __extends(AxisLabelCircular, _super);
    /**
     * Constructor
     */
    function AxisLabelCircular() {
        var _this = _super.call(this) || this;
        _this.className = "AxisLabelCircular";
        _this.padding(0, 0, 0, 0);
        _this.location = 0.5;
        _this.radius = 0;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(AxisLabelCircular.prototype, "relativeRotation", {
        /**
         * Returns current relative rotation.
         *
         * @return {number} Rotation angle
         */
        get: function () {
            return this.getPropertyValue("relativeRotation");
        },
        /**
         * Sets relative rotation of the label.
         *
         * It is an angle to circle. In case 90, labels will be positioned like rays
         * of light, if 0 - positione along the circle.
         *
         * @param {number} value Rotation angle
         */
        set: function (value) {
            this.setPropertyValue("relativeRotation", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisLabelCircular.prototype, "radius", {
        /**
         * Returns current setting for label distance.
         *
         * @return {number} Distance (px)
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Sets distance from axis circle to label in pixels.
         *
         * @param {number} value Distance (px)
         */
        set: function (value) {
            // No percent here, as it would be quite complicated to calculate radius
            // of a chart together with axis label radius
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [fixPoint description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {IPoint}  point       Label affixation point
     * @param  {number}  axisRadius  Distance from point (px)
     * @return {IPoint}              [description]
     */
    AxisLabelCircular.prototype.fixPoint = function (point, axisRadius) {
        var angle = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["DEGREES"] * Math.atan2(point.y, point.x);
        if (this.invalid) {
            this.validate(); //@todo" check if we need this
        }
        var sign = 1;
        if (this.inside) {
            sign = -1;
        }
        var relativeRotation = this.relativeRotation;
        // we don't use valign for labels because then they would jump while animating. instead we modify dy depending on a y position
        // this math makes dy to be 1 at the top of the circle, 0.5 at the middle and 1 at the bottom
        // @todo with this math doesn't work well with inside = true
        this.dy = -this.measuredHeight * (1 - (point.y + axisRadius) / (2 * axisRadius));
        // simmilar with dx
        this.dx = -this.measuredWidth * (1 - (point.x + axisRadius) / (2 * axisRadius));
        var labelRadius = this.radius * sign;
        if (__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](relativeRotation)) {
            this.rotation = relativeRotation + angle + 90;
            var pixelWidth = this._bbox.width;
            var pixelHeight = this._bbox.height;
            var dH = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](relativeRotation) / 2;
            var dW = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](relativeRotation) / 2;
            var rotation = this.rotation;
            this.dx = pixelHeight * dH * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](rotation) - pixelWidth * dW * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](rotation);
            this.dy = -pixelHeight * dH * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](rotation) - pixelWidth * dW * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](rotation);
            var pixelPaddingBottom = this.pixelPaddingBottom;
            var pixelPaddingTop = this.pixelPaddingTop;
            var pixelPaddingLeft = this.pixelPaddingLeft;
            var pixelPaddingRight = this.pixelPaddingRight;
            if (!this.inside) {
                labelRadius += (pixelHeight + pixelPaddingBottom + pixelPaddingTop) * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](relativeRotation) + (pixelWidth + pixelPaddingLeft + pixelPaddingRight) * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](relativeRotation);
            }
            else {
                labelRadius -= (pixelPaddingBottom + pixelPaddingTop) * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](relativeRotation) + (pixelPaddingLeft + pixelPaddingRight) * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](relativeRotation);
            }
        }
        point.x += __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](angle) * labelRadius;
        point.y += __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](angle) * labelRadius;
        return point;
    };
    return AxisLabelCircular;
}(__WEBPACK_IMPORTED_MODULE_0__AxisLabel__["a" /* AxisLabel */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["AxisLabelCircular"] = AxisLabelCircular;
//# sourceMappingURL=AxisLabelCircular.js.map

/***/ }),

/***/ 243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisRendererCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisRenderer__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AxisFillCircular__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__GridCircular__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AxisLabelCircular__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Percent__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Type__ = __webpack_require__(0);
/**
 * Module, defining Axis Renderer for circular axes.
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










/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A renderer for circular axis.
 */
var AxisRendererCircular = /** @class */ (function (_super) {
    __extends(AxisRendererCircular, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRendererCircular(axis) {
        var _this = 
        // Init
        _super.call(this, axis) || this;
        // axis.layout = "none"; // does not trigger redraw when size changes
        _this.layout = "none";
        _this.className = "AxisRendererCircular";
        _this.isMeasured = false;
        _this.startAngle = -90;
        _this.endAngle = 270;
        _this.width = Object(__WEBPACK_IMPORTED_MODULE_5__core_utils_Percent__["c" /* percent */])(100);
        _this.height = Object(__WEBPACK_IMPORTED_MODULE_5__core_utils_Percent__["c" /* percent */])(100);
        _this.radius = Object(__WEBPACK_IMPORTED_MODULE_5__core_utils_Percent__["c" /* percent */])(100);
        _this.isMeasured = false;
        axis.isMeasured = false;
        _this.grid.template.location = 0;
        _this.labels.template.location = 0;
        _this.labels.template.isMeasured = true;
        _this.labels.template.radius = 15;
        _this.ticks.template.location = 0;
        _this.ticks.template.pixelPerfect = false;
        _this.tooltipLocation = 0;
        _this.line.strokeOpacity = 0;
        // modify x and y so that tooltip would always be on circle
        var tooltip = axis.tooltip;
        tooltip.adapter.add("dx", function (x, target) {
            var point = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["svgPointToSprite"]({ x: target.pixelX, y: target.pixelY }, _this);
            return _this.pixelRadius * Math.cos(Math.atan2(point.y, point.x)) - point.x;
        });
        tooltip.adapter.add("dy", function (y, target) {
            var point = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["svgPointToSprite"]({ x: target.pixelX, y: target.pixelY }, _this);
            return _this.pixelRadius * Math.sin(Math.atan2(point.y, point.x)) - point.y;
        });
        _this.applyTheme();
        return _this;
    }
    /**
     * Validates Axis renderer.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    AxisRendererCircular.prototype.validate = function () {
        // so that radius would be updated
        if (this.chart && this.chart.invalid) {
            this.chart.validate();
        }
        _super.prototype.validate.call(this);
    };
    Object.defineProperty(AxisRendererCircular.prototype, "axisLength", {
        /**
         * Returns actual length of the Axis, in pixels.
         *
         * @return {number} Length (px)
         */
        get: function () {
            return 2 * Math.PI * this.pixelRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "radius", {
        /**
         * Returns currently set outer radius.
         *
         * @return {number | Percent} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Sets outer radius of the axis.
         *
         * Can be absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "pixelRadius", {
        /**
         * Outer radius in pixels.
         *
         * @return {number} Outer radius (px)
         */
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](this.radius, __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["min"](this.innerWidth / 2, this.innerHeight / 2));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "innerRadius", {
        /**
         * Returns currently set inner radius.
         *
         * @return {number | Percent} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Sets inner radius of the axis.
         *
         * Can be absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "pixelInnerRadius", {
        /**
         * Inner radius in pixels.
         *
         * @return {number} Inner radius (px)
         */
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](this.innerRadius, __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["min"](this.innerWidth / 2, this.innerHeight / 2)) || 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts relative position on axis to point coordinates.
     *
     * @param  {number}  position  Position (0-1)
     * @return {IPoint}            Point
     */
    AxisRendererCircular.prototype.positionToPoint = function (position) {
        var coordinate = this.positionToCoordinate(position);
        var angle = this.startAngle + (this.endAngle - this.startAngle) * coordinate / this.axisLength;
        return { x: this.pixelRadius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](angle), y: this.pixelRadius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](angle) };
    };
    /**
     * Converts relative position on axis to angle.
     *
     * @todo Description (units)
     * @param  {number}  position  Position (0-1)
     * @return {number}            Angle
     */
    AxisRendererCircular.prototype.positionToAngle = function (position) {
        var axis = this.axis;
        var arc = (this.endAngle - this.startAngle) / (axis.end - axis.start);
        var angle;
        if (axis.renderer.inversed) {
            angle = this.startAngle + (axis.end - position) * arc;
        }
        else {
            angle = this.startAngle + (position - axis.start) * arc;
        }
        return __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"](angle, 3);
    };
    /**
     * Updates and positions the axis line element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererCircular.prototype.updateAxisLine = function () {
        var element = this.line.element;
        // @todo Is this needed?
        this.chart;
        var radius = this.pixelRadius;
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        var arc = endAngle - startAngle;
        element.attr({ "d": __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["moveTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](startAngle), y: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](startAngle) }) + __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["arcTo"](startAngle, arc, radius, radius) });
    };
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    AxisRendererCircular.prototype.updateGridElement = function (grid, position, endPosition) {
        position = position + (endPosition - position) * grid.location;
        var point = this.positionToPoint(position);
        if (grid.element) {
            var angle = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["DEGREES"] * Math.atan2(point.y, point.x);
            var radius = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](__WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["isNumber"](grid.radius) ? grid.radius : this.radius, this.pixelRadius);
            var gridInnerRadius = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](grid.innerRadius, this.pixelRadius);
            grid.zIndex = 0;
            var innerRadius = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](__WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["isNumber"](gridInnerRadius) ? gridInnerRadius : this.innerRadius, this.pixelRadius, true);
            grid.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["moveTo"]({ x: innerRadius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](angle), y: innerRadius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](angle) }) + __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["lineTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](angle) }) });
        }
        this.toggleVisibility(grid, position, 0, 1);
    };
    /**
     * Updates and positions a tick element.
     *
     * @ignore Exclude from docs
     * @param {AxisTick}  tick         Tick element
     * @param {number}    position     Starting position
     * @param {number}    endPosition  End position
     */
    AxisRendererCircular.prototype.updateTickElement = function (tick, position, endPosition) {
        position = position + (endPosition - position) * tick.location;
        var point = this.positionToPoint(position);
        if (tick.element) {
            var radius = this.pixelRadius;
            var angle = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["DEGREES"] * Math.atan2(point.y, point.x);
            var tickLength = tick.length;
            if (tick.inside) {
                tickLength = -tickLength;
            }
            tick.zIndex = 1;
            tick.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["moveTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](angle) }) + __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["lineTo"]({ x: (radius + tickLength) * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](angle), y: (radius + tickLength) * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](angle) }) });
        }
        this.toggleVisibility(tick, position, 0, 1);
    };
    /**
     * Updates and positions a label element.
     *
     * @ignore Exclude from docs
     * @param {AxisLabel}  label        Label element
     * @param {number}     position     Starting position
     * @param {number}     endPosition  Ending position
     */
    AxisRendererCircular.prototype.updateLabelElement = function (label, position, endPosition) {
        position = position + (endPosition - position) * label.location;
        var point = this.positionToPoint(position);
        label.fixPoint(point, this.pixelRadius);
        label.zIndex = 2;
        this.positionItem(label, point);
        this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
    };
    /**
     * Checks if point is within bounds of a container.
     *
     * @ignore Exclude from docs
     * @param  {IPoint}   point Point coordinates
     * @return {boolean}         Fits?
     */
    AxisRendererCircular.prototype.fitsToBounds = function (point) {
        return true;
    };
    Object.defineProperty(AxisRendererCircular.prototype, "startAngle", {
        /**
         * Returns currently set start angle.
         *
         * @todo Description (units)
         * @return {number} Start angle
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
        /**
         * Sets start angle of the axis.
         *
         * @todo Description (units)
         * @param {number} value Start angle
         */
        set: function (value) {
            // do not normalize angel here!
            this.setPropertyValue("startAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "endAngle", {
        /**
         * Returns currently set end angle.
         *
         * @todo Description (units)
         * @return {number} End angle
         */
        get: function () {
            return this.getPropertyValue("endAngle");
        },
        /**
         * Sets end angle of the axis.
         *
         * @todo Description (units)
         * @param {number} value end angle
         */
        set: function (value) {
            // do not normalize angel here!
            this.setPropertyValue("endAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [getPositionRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}  startPosition  Starting position
     * @param  {number}  endPosition    End position
     * @return {string}                 SVG path
     */
    AxisRendererCircular.prototype.getPositionRangePath = function (startPosition, endPosition, radius, innerRadius, cornerRadius) {
        var path = "";
        if (__WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["isNumber"](startPosition) && __WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["isNumber"](endPosition)) {
            if (!__WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["hasValue"](radius)) {
                radius = this.radius;
            }
            startPosition = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["max"](startPosition, this.axis.start);
            endPosition = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["min"](endPosition, this.axis.end);
            if (endPosition < startPosition) {
                endPosition = startPosition;
            }
            var pixelRadius = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](radius, this.pixelRadius);
            var pixelInnerRadius = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](innerRadius, this.pixelRadius, true);
            var startAngle = this.positionToAngle(startPosition);
            var endAngle = this.positionToAngle(endPosition);
            var arc = endAngle - startAngle;
            path = __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["arc"](startAngle, arc, pixelRadius, pixelInnerRadius, pixelRadius, cornerRadius);
        }
        return path;
    };
    /**
     * Returns a new grid element, suitable for this Axis Renderer type.
     *
     * @return {GridCircular} Grid element
     */
    AxisRendererCircular.prototype.createGrid = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__GridCircular__["a" /* GridCircular */]();
    };
    /**
     * Returns a new fill element, suitable for this Axis Renderer type.
     *
     * @return {AxisFillCircular} Fill element
     */
    AxisRendererCircular.prototype.createFill = function (axis) {
        return new __WEBPACK_IMPORTED_MODULE_1__AxisFillCircular__["a" /* AxisFillCircular */](axis);
    };
    /**
     * Returns a new label element, suitable for this Axis Renderer type.
     *
     * @return {AxisLabelCircular} Label element
     */
    AxisRendererCircular.prototype.createLabel = function () {
        return new __WEBPACK_IMPORTED_MODULE_3__AxisLabelCircular__["a" /* AxisLabelCircular */]();
    };
    return AxisRendererCircular;
}(__WEBPACK_IMPORTED_MODULE_0__AxisRenderer__["a" /* AxisRenderer */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_4__core_Registry__["a" /* registry */].registeredClasses["AxisRendererCircular"] = AxisRendererCircular;
//# sourceMappingURL=AxisRendererCircular.js.map

/***/ }),

/***/ 244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisFillCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisFill__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(0);
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




/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Provides fill element functionality for circular Axes.
 *
 * @see {@link IAxisFillCircularEvents} for a list of available events
 * @see {@link IAxisFillCircularAdapters} for a list of available Adapters
 * @todo Needs description
 */
var AxisFillCircular = /** @class */ (function (_super) {
    __extends(AxisFillCircular, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Axis
     */
    function AxisFillCircular(axis) {
        var _this = _super.call(this, axis) || this;
        _this.className = "AxisFillCircular";
        _this.element = _this.paper.add("path");
        _this.radius = Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(100);
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the fill element.
     *
     * @ignore Exclude from docs
     */
    AxisFillCircular.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (this.axis) {
            var renderer = this.axis.renderer;
            this.fillPath = renderer.getPositionRangePath(this.startPosition, this.endPosition, this.radius, __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](this.innerRadius) ? this.innerRadius : renderer.innerRadius, this.cornerRadius);
            this.element.attr({ "d": this.fillPath });
        }
    };
    Object.defineProperty(AxisFillCircular.prototype, "innerRadius", {
        /**
         * Returns current inner radius.
         *
         * @return {number} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Sets inner radius of the fill. Relative ([[Percent]]) or absolute (pixels).
         *
         * @param {number | Percent}  value  Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisFillCircular.prototype, "radius", {
        /**
         * Returns current outer radius.
         *
         * @return {number} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Sets outer radius of the fill. Relative ([[Percent]]) or absolute (pixels).
         *
         * @param {number | Percent}  value  Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisFillCircular.prototype, "cornerRadius", {
        /**
         * Returns current corner radius.
         *
         * @return {number} Corner radius (px)
         */
        get: function () {
            return this.getPropertyValue("cornerRadius");
        },
        /**
         * Sets corner radius for the fill. In pixels.
         *
         * @param {number}  value  Corner radius (px)
         */
        set: function (value) {
            this.setPropertyValue("cornerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return AxisFillCircular;
}(__WEBPACK_IMPORTED_MODULE_0__AxisFill__["a" /* AxisFill */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["a" /* registry */].registeredClasses["AxisFillCircular"] = AxisFillCircular;
//# sourceMappingURL=AxisFillCircular.js.map

/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Grid__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * A module defining functionality for circular axis grid elements.
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
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a circular grid element for circular-type axis.
 *
 * @see {@link IGridCircularEvents} for a list of available events
 * @see {@link IGridCircularAdapters} for a list of available Adapters
 * @todo Review: container is better, as we'll be able to attach something to the GridCircular, also with 3d charts we might need some additional elements
 */
var GridCircular = /** @class */ (function (_super) {
    __extends(GridCircular, _super);
    /**
     * Constructor
     */
    function GridCircular() {
        var _this = _super.call(this) || this;
        _this.className = "GridCircular";
        _this.pixelPerfect = false;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(GridCircular.prototype, "innerRadius", {
        /**
         * @return {number} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Inner radius of the circular grid. (absolute or relative)
         *
         * @param {number | Percent} value Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridCircular.prototype, "radius", {
        /**
         * @return {number} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Outer radius of the circular grid. (absolute or relative)
         *
         * @param {number | Percent} value Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return GridCircular;
}(__WEBPACK_IMPORTED_MODULE_0__Grid__["a" /* Grid */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["GridCircular"] = GridCircular;
//# sourceMappingURL=GridCircular.js.map

/***/ }),

/***/ 246:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SmallMap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Rectangle__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Color__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__ = __webpack_require__(0);
/**
 * A module for the mini-map control.
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









/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a "bird's eye" view of the whole map.
 *
 * This control creates a mini-map with the whole of the map, highlighting
 * the area which is in the current viewport of the map map.
 *
 * @see {@link ISmallMapEvents} for a list of available events
 * @see {@link ISmallMapAdapters} for a list of available Adapters
 * @important
 */
var SmallMap = /** @class */ (function (_super) {
    __extends(SmallMap, _super);
    /**
     * Constructor
     */
    function SmallMap() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * A target map.
         *
         * @type {MutableValueDisposer<MapChart>}
         */
        _this._chart = new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "SmallMap";
        // Set defaults
        _this.align = "left";
        _this.valign = "bottom";
        _this.percentHeight = 20;
        _this.percentWidth = 20;
        _this.margin(5, 5, 5, 5);
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        // Set background defailts
        _this.background.fillOpacity = 0.9;
        _this.background.fill = interfaceColors.getFor("background");
        // Set up events
        _this.events.on("hit", _this.moveToPosition, _this);
        _this.events.on("maxsizechanged", _this.updateMapSize, _this);
        // Create a container
        _this.seriesContainer = _this.createChild(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]);
        _this.seriesContainer.shouldClone = false;
        // Create an outline rectangle
        var rectangle = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Rectangle__["a" /* Rectangle */]);
        rectangle.shouldClone = false;
        rectangle.stroke = interfaceColors.getFor("alternativeBackground");
        rectangle.strokeWidth = 1;
        rectangle.strokeOpacity = 0.5;
        rectangle.fill = Object(__WEBPACK_IMPORTED_MODULE_5__core_utils_Color__["c" /* color */])(); //"none";
        rectangle.verticalCenter = "middle";
        rectangle.horizontalCenter = "middle";
        rectangle.isMeasured = false;
        _this.rectangle = rectangle;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(SmallMap.prototype, "series", {
        /**
         * A list of map series used to draw the mini-map.
         *
         * @readonly
         * @return {List<MapSeries>} Series
         */
        get: function () {
            if (!this._series) {
                this._series = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["b" /* List */]();
                this._series.events.on("insert", this.handleSeriesAdded, this);
                this._series.events.on("remove", this.handleSeriesRemoved, this);
            }
            return this._series;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorates a new series when they are pushed into a `series` list.
     *
     * @param {IListEvents<MapSeries>["insert"]} event Event
     */
    SmallMap.prototype.handleSeriesAdded = function (event) {
        var series = event.newValue;
        if (this.chart.series.contains(series)) {
            var newSeries = series.clone();
            this._series.removeValue(series);
            this._series.push(newSeries);
            series = newSeries;
        }
        series.chart = this.chart;
        series.parent = this.seriesContainer;
        series.mouseEnabled = false;
    };
    /**
     * Cleans up after series are removed from Scrollbar.
     *
     * @param {IListEvents<XYSeries>["remove"]}  event  Event
     */
    SmallMap.prototype.handleSeriesRemoved = function (event) {
        //let sourceSeries: MapSeries = event.oldValue;
        this.invalidate();
    };
    /**
     * Moves main map pan position after click on the small map.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["hit"]}  event  Event
     */
    SmallMap.prototype.moveToPosition = function (event) {
        var svgPoint = event.svgPoint;
        var rectPoint = __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__["svgPointToSprite"](svgPoint, this.rectangle);
        var zoomLevel = this.chart.zoomLevel;
        var scale = Math.min(this.percentWidth, this.percentHeight) / 100;
        var x = (rectPoint.x + this.rectangle.pixelWidth / 2) / scale * zoomLevel;
        var y = (rectPoint.y + this.rectangle.pixelHeight / 2) / scale * zoomLevel;
        var geoPoint = this.chart.svgPointToGeo({ x: x, y: y });
        this.chart.zoomToGeoPoint(geoPoint, this.chart.zoomLevel, true);
    };
    Object.defineProperty(SmallMap.prototype, "chart", {
        /**
         * @return {MapChart} Chart/map
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * A chart/map that this control is meant for.
         *
         * @param {MapChart}  chart  Chart/map
         */
        set: function (chart) {
            if (this.chart != chart) {
                this._chart.set(chart, new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["c" /* MultiDisposer */]([
                    chart.events.on("zoomlevelchanged", this.updateRectangle, this),
                    chart.events.on("mappositionchanged", this.updateRectangle, this),
                    chart.events.on("scaleratiochanged", this.updateMapSize, this)
                ]));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the viewport recangle as per current map zoom/pan position.
     *
     * @ignore Exclude from docs
     */
    SmallMap.prototype.updateRectangle = function () {
        var chart = this.chart;
        var zoomLevel = chart.zoomLevel;
        var rectangle = this.rectangle;
        rectangle.width = this.pixelWidth / zoomLevel;
        rectangle.height = this.pixelHeight / zoomLevel;
        var scale = Math.min(this.percentWidth, this.percentHeight) / 100;
        var seriesContainer = chart.seriesContainer;
        var x = Math.ceil((zoomLevel * seriesContainer.pixelWidth / 2 - seriesContainer.pixelX) * scale / zoomLevel + rectangle.pixelWidth / 2);
        var y = Math.ceil((zoomLevel * seriesContainer.pixelHeight / 2 - seriesContainer.pixelY) * scale / zoomLevel + rectangle.pixelHeight / 2);
        rectangle.x = x;
        rectangle.y = y;
    };
    /**
     * Update map size so that internal elements can redraw themselves after
     * the size of the small map changes.
     *
     * @ignore Exclude from docs
     */
    SmallMap.prototype.updateMapSize = function () {
        if (this.chart) {
            this.seriesContainer.scale = this.chart.scaleRatio * Math.min(this.percentWidth, this.percentHeight) / 100;
            this.afterDraw();
        }
    };
    /**
     * Update elements after drawing the small map.
     */
    SmallMap.prototype.afterDraw = function () {
        _super.prototype.afterDraw.call(this);
        this.seriesContainer.moveTo({ x: this.pixelWidth / 2, y: this.pixelHeight / 2 });
        this.rectangle.maskRectangle = { x: -1, y: -1, width: Math.ceil(this.pixelWidth + 2), height: Math.ceil(this.pixelHeight + 2) };
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    SmallMap.prototype.processConfig = function (config) {
        if (config) {
            // Set up series
            if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](config.series) && __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isArray"](config.series)) {
                for (var i = 0, len = config.series.length; i < len; i++) {
                    var series = config.series[i];
                    if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](series) && __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isString"](series) && this.map.hasKey(series)) {
                        config.series[i] = this.map.getKey(series);
                    }
                }
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return SmallMap;
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_4__core_Registry__["a" /* registry */].registeredClasses["SmallMap"] = SmallMap;
//# sourceMappingURL=SmallMap.js.map

/***/ }),

/***/ 302:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ZoomControl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Button__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_RoundedRectangle__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Keyboard__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_interaction_Interaction__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_InterfaceColorSet__ = __webpack_require__(13);
/**
 * Zoom control module
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









/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a control for zooming the map.
 *
 * @see {@link IZoomControlEvents} for a list of available events
 * @see {@link IZoomControlAdapters} for a list of available Adapters
 * @important
 */
var ZoomControl = /** @class */ (function (_super) {
    __extends(ZoomControl, _super);
    /**
     * Constructor
     */
    function ZoomControl() {
        var _this = _super.call(this) || this;
        /**
         * A target map.
         *
         * @type {MutableValueDisposer<MapChart>}
         */
        _this._chart = new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "ZoomControl";
        _this.align = "right";
        _this.valign = "bottom";
        _this.layout = "vertical";
        _this.padding(5, 5, 5, 5);
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_8__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        var plusButton = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Button__["a" /* Button */]);
        plusButton.shouldClone = false;
        plusButton.label.text = "+";
        plusButton.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
        plusButton.padding(5, 5, 5, 5);
        _this.plusButton = plusButton;
        var slider = _this.createChild(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]);
        slider.shouldClone = false;
        slider.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
        slider.background.fill = interfaceColors.getFor("alternativeBackground");
        slider.background.fillOpacity = 0.05;
        slider.background.events.on("hit", _this.handleBackgroundClick, _this);
        slider.events.on("sizechanged", _this.updateThumbSize, _this);
        _this.slider = slider;
        var thumb = slider.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Button__["a" /* Button */]);
        thumb.shouldClone = false;
        thumb.padding(0, 0, 0, 0);
        thumb.draggable = true;
        thumb.events.on("drag", _this.handleThumbDrag, _this);
        _this.thumb = thumb;
        var minusButton = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Button__["a" /* Button */]);
        minusButton.shouldClone = false;
        minusButton.label.text = "-";
        minusButton.padding(5, 5, 5, 5);
        _this.minusButton = minusButton;
        // Set roles
        _this.thumb.role = "slider";
        _this.thumb.readerLive = "polite";
        // Set reader text
        _this.thumb.readerTitle = _this.language.translate("Use arrow keys to zoom in and out");
        _this.minusButton.readerTitle = _this.language.translate("Press ENTER to zoom in");
        _this.plusButton.readerTitle = _this.language.translate("Press ENTER to zoom out");
        _this.applyTheme();
        _this.events.on("propertychanged", function (event) {
            if (event.property == "layout") {
                _this.fixLayout();
            }
        });
        _this.fixLayout();
        return _this;
    }
    ZoomControl.prototype.fixLayout = function () {
        if (this.layout == "vertical") {
            this.width = 40;
            this.height = undefined;
            this.minusButton.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.thumb.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.plusButton.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.slider.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.minusButton.marginTop = 1;
            this.plusButton.marginBottom = 2;
            this.slider.height = 0;
            this.minusButton.toFront();
            this.plusButton.toBack();
            this.thumb.minX = 0;
            this.thumb.maxX = 0;
            this.thumb.minY = 0;
        }
        else if (this.layout == "horizontal") {
            this.thumb.minX = 0;
            this.thumb.minY = 0;
            this.thumb.maxY = 0;
            this.height = 40;
            this.width = undefined;
            this.minusButton.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.minusButton.width = 30;
            this.thumb.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.thumb.width = undefined;
            this.plusButton.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.plusButton.width = 30;
            this.slider.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.slider.width = 0;
            this.minusButton.marginLeft = 2;
            this.plusButton.marginRight = 2;
            this.minusButton.toBack();
            this.plusButton.toFront();
        }
    };
    /**
     * Handles zoom operation after clicking on the slider background.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["hit"]}  event  Event
     */
    ZoomControl.prototype.handleBackgroundClick = function (event) {
        var sprite = event.target;
        var y = event.spritePoint.y;
        var chart = this.chart;
        var maxPower = Math.log(chart.maxZoomLevel) / Math.LN2;
        var minPower = Math.log(chart.minZoomLevel) / Math.LN2;
        var power = (sprite.pixelHeight - y) / sprite.pixelHeight * (minPower + (maxPower - minPower));
        var zoomLevel = Math.pow(2, power);
        chart.zoomToGeoPoint(chart.zoomGeoPoint, zoomLevel);
    };
    Object.defineProperty(ZoomControl.prototype, "chart", {
        /**
         * @return {MapChart} Map/chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * A main chart/map that this zoom control is for.
         *
         * @param {MapChart}  chart  Map/chart
         */
        set: function (chart) {
            var _this = this;
            this._chart.set(chart, new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["c" /* MultiDisposer */]([
                chart.events.on("maxsizechanged", this.updateThumbSize, this),
                chart.events.on("zoomlevelchanged", this.updateThumb, this),
                this.minusButton.events.on("hit", function () { chart.zoomOut(chart.zoomGeoPoint); }, chart),
                __WEBPACK_IMPORTED_MODULE_5__core_interaction_Interaction__["b" /* interaction */].body.events.on("keyup", function (ev) {
                    if (_this.topParent.hasFocused) {
                        if (__WEBPACK_IMPORTED_MODULE_4__core_utils_Keyboard__["b" /* keyboard */].isKey(ev.event, "enter")) {
                            if (_this.minusButton.isFocused) {
                                chart.zoomOut();
                            }
                            else if (_this.plusButton.isFocused) {
                                chart.zoomIn();
                            }
                        }
                        else if (__WEBPACK_IMPORTED_MODULE_4__core_utils_Keyboard__["b" /* keyboard */].isKey(ev.event, "plus")) {
                            chart.zoomIn();
                        }
                        else if (__WEBPACK_IMPORTED_MODULE_4__core_utils_Keyboard__["b" /* keyboard */].isKey(ev.event, "minus")) {
                            chart.zoomOut();
                        }
                    }
                }, chart),
                this.plusButton.events.on("hit", function () { chart.zoomIn(chart.zoomGeoPoint); }, chart)
            ]));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the slider's thumb size based on the available zoom space.
     *
     * @ignore Exclude from docs
     */
    ZoomControl.prototype.updateThumbSize = function () {
        var chart = this.chart;
        if (chart) {
            var slider = this.slider;
            var thumb = this.thumb;
            if (this.layout == "vertical") {
                thumb.minHeight = Math.min(this.slider.pixelHeight, 20);
                thumb.height = slider.pixelHeight / (chart.maxZoomLevel - chart.minZoomLevel);
                thumb.maxY = slider.pixelHeight - thumb.pixelHeight;
                if (thumb.pixelHeight <= 1) {
                    thumb.visible = false;
                }
                else {
                    thumb.visible = true;
                }
            }
            else {
                thumb.minWidth = Math.min(this.slider.pixelWidth, 20);
                thumb.width = slider.pixelWidth / (chart.maxZoomLevel - chart.minZoomLevel);
                thumb.maxX = slider.pixelWidth - thumb.pixelWidth;
                if (thumb.pixelWidth <= 1) {
                    thumb.visible = false;
                }
                else {
                    thumb.visible = true;
                }
            }
        }
    };
    /**
     * Updates thumb according to current zoom position from map.
     *
     * @ignore Exclude from docs
     */
    ZoomControl.prototype.updateThumb = function () {
        var slider = this.slider;
        var chart = this.chart;
        var thumb = this.thumb;
        if (!thumb.isDown) {
            var step = Math.log(chart.zoomLevel) / Math.LN2;
            if (this.layout == "vertical") {
                thumb.y = slider.pixelHeight - (slider.pixelHeight - thumb.pixelHeight) * (step + 1) / this.stepCount;
            }
            else {
                thumb.x = slider.pixelWidth * step / this.stepCount;
            }
        }
    };
    /**
     * Zooms the actual map when slider position changes.
     *
     * @ignore Exclude from docs
     */
    ZoomControl.prototype.handleThumbDrag = function () {
        var slider = this.slider;
        var chart = this.chart;
        var thumb = this.thumb;
        var step;
        if (this.layout == "vertical") {
            step = this.stepCount * (slider.pixelHeight - thumb.pixelY - thumb.pixelHeight) / (slider.pixelHeight - thumb.pixelHeight) - 1;
        }
        else {
            step = this.stepCount * thumb.pixelX / slider.pixelWidth;
        }
        var zoomLevel = Math.pow(2, step);
        chart.zoomToGeoPoint(undefined, zoomLevel, false, 0);
    };
    Object.defineProperty(ZoomControl.prototype, "stepCount", {
        /**
         * Returns the step countfor the slider grid according to map's min and max
         * zoom level settings.
         *
         * @ignore Exclude from docs
         * @return {number} Step count
         */
        get: function () {
            return Math.log(this.chart.maxZoomLevel) / Math.LN2 - Math.log(this.chart.minZoomLevel) / Math.LN2;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a background element for slider control.
     *
     * @ignore Exclude from docs
     * @return {this} Background
     */
    ZoomControl.prototype.createBackground = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__core_elements_RoundedRectangle__["a" /* RoundedRectangle */]();
    };
    return ZoomControl;
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["a" /* registry */].registeredClasses["ZoomControl"] = ZoomControl;
//# sourceMappingURL=ZoomControl.js.map

/***/ })

});