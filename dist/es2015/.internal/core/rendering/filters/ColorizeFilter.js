/**
 * Module for "Colorize" filter.
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
import { Filter } from "./Filter";
;
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a "Colorize" filter.
 */
var ColorizeFilter = /** @class */ (function (_super) {
    __extends(ColorizeFilter, _super);
    /**
     * Constructor
     * * Creates primitve (effect) elements
     * * Sets default properties
     */
    function ColorizeFilter() {
        var _this = _super.call(this) || this;
        _this.className = "ColorizeFilter";
        // Create elements
        // NOTE: we do not need to add each individual element to `_disposers`
        // because `filterPrimitives` has an event handler which automatically adds
        // anything added to it to `_disposers`
        _this.feColorMatrix = _this.paper.add("feColorMatrix");
        _this.feColorMatrix.attr({ "type": "matrix" });
        //this.feColorMatrix.setAttribute("in", "SourceAlpha");
        _this.filterPrimitives.push(_this.feColorMatrix);
        // Set default properties
        _this.intensity = 1;
        _this.applyTheme();
        return _this;
    }
    /**
     * (Re)applies colors to the already existing filter by modifying filyer's
     * color matrix element.
     *
     * @ignore Exclude from docs
     */
    ColorizeFilter.prototype.applyFilter = function () {
        var i = this.intensity;
        var ii = 1 - i;
        var r;
        var g;
        var b;
        var color = this.color;
        if (!color) {
            r = 0;
            g = 0;
            b = 0;
        }
        else {
            r = color.rgb.r / 255 * i;
            g = color.rgb.g / 255 * i;
            b = color.rgb.b / 255 * i;
        }
        this.feColorMatrix.attr({ "values": ii + " 0 0 0 " + r + " 0 " + ii + " 0 0 " + g + " 0 0 " + ii + " 0 " + b + " 0 0 0 1 0" });
    };
    Object.defineProperty(ColorizeFilter.prototype, "color", {
        /**
         * @return {Color} Color
         */
        get: function () {
            return this.properties["color"];
        },
        /**
         * Color.
         *
         * @param {Color}  value  Color
         */
        set: function (value) {
            this.properties["color"] = value;
            this.applyFilter();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorizeFilter.prototype, "intensity", {
        /**
         * @return {number} Intensity (0-1)
         */
        get: function () {
            return this.properties.intensity;
        },
        /**
         * Intensity of the color. (0-1)
         *
         * @default 1
         * @param {number} value Intensity (0-1)
         * @todo Describe possible values
         */
        set: function (value) {
            this.properties.intensity = value;
            this.applyFilter();
        },
        enumerable: true,
        configurable: true
    });
    return ColorizeFilter;
}(Filter));
export { ColorizeFilter };
//# sourceMappingURL=ColorizeFilter.js.map