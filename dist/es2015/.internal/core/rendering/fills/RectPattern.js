/**
 * Rectangular pattern module.
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
import { Pattern } from "./Pattern";
;
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Rectangular pattern
 */
var RectPattern = /** @class */ (function (_super) {
    __extends(RectPattern, _super);
    /**
     * Collection of property values for the pattern
     *
     * @todo Remove?
     * @deprecated
     * @type {Dictionary<RectPatternProperties, any>}
     */
    //public propertyValues: Dictionary<RectPatternProperties, any>;
    /**
     * Constructor
     */
    function RectPattern() {
        var _this = _super.call(this) || this;
        _this.rectHeight = 1;
        _this.rectWidth = 1;
        return _this;
    }
    /**
     * Draws the rectangular element.
     */
    RectPattern.prototype.draw = function () {
        if (this._rect) {
            this.removeElement(this._rect);
        }
        this._rect = this.paper.add("rect");
        this._rect.attr({ "width": this.rectWidth, "height": this.rectHeight });
        this.addElement(this._rect);
        _super.prototype.draw.call(this);
    };
    Object.defineProperty(RectPattern.prototype, "rectWidth", {
        /**
         * @return {number} Width (px)
         */
        get: function () {
            return this.properties["rectWidth"];
        },
        /**
         * Rectangle width in pixels.
         *
         * @param {number} value Width (px)
         */
        set: function (value) {
            this.properties["rectWidth"] = value;
            this.draw();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RectPattern.prototype, "rectHeight", {
        /**
         * @return {number} Height (px)
         */
        get: function () {
            return this.properties["rectHeight"];
        },
        /**
         * Rectangle height in pixels.
         *
         * @param {number} value Height (px)
         */
        set: function (value) {
            this.properties["rectHeight"] = value;
            this.draw();
        },
        enumerable: true,
        configurable: true
    });
    return RectPattern;
}(Pattern));
export { RectPattern };
//# sourceMappingURL=RectPattern.js.map