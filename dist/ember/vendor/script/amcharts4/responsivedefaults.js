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
 
webpackJsonp([3],{

/***/ 141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisLabelCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisLabel__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(2);
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

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisRendererCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisRenderer__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AxisFillCircular__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__GridCircular__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AxisLabelCircular__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Percent__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Type__ = __webpack_require__(2);
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

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisFillCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisFill__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(2);
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

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Grid__ = __webpack_require__(144);
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

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SmallMap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Rectangle__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Color__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__ = __webpack_require__(2);
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

/***/ 294:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ZoomControl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Button__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_RoundedRectangle__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Keyboard__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_interaction_Interaction__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_InterfaceColorSet__ = __webpack_require__(8);
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

/***/ }),

/***/ 590:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__charts_axes_AxisRenderer__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__charts_axes_AxisRendererX__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__charts_axes_AxisRendererY__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__charts_axes_AxisRendererCircular__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__charts_Chart__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__charts_Legend__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__charts_map_SmallMap__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__charts_map_ZoomControl__ = __webpack_require__(294);
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

/***/ })

});