/**
 * Rounded rectangle module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../Sprite";
import { registry } from "../Registry";
import * as $math from "../utils/Math";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a rectangle with rounded corners.
 *
 * @see {@link IRoundedRectangleEvents} for a list of available events
 * @see {@link IRoundedRectangleAdapters} for a list of available Adapters
 */
var RoundedRectangle = /** @class */ (function (_super) {
    tslib_1.__extends(RoundedRectangle, _super);
    /**
     * Constructor
     */
    function RoundedRectangle() {
        var _this = _super.call(this) || this;
        _this.className = "RoundedRectangle";
        _this.element = _this.paper.add("path");
        //this.pixelPerfect = false;
        _this.cornerRadius(3, 3, 3, 3);
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    RoundedRectangle.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var w = this.innerWidth;
        var h = this.innerHeight;
        if ($type.isNumber(w) && $type.isNumber(h)) {
            var maxcr = $math.min(Math.abs(w / 2), Math.abs(h / 2));
            var crtl = $math.fitToRange(this.cornerRadiusTopLeft, 0, maxcr);
            var crtr = $math.fitToRange(this.cornerRadiusTopRight, 0, maxcr);
            var crbr = $math.fitToRange(this.cornerRadiusBottomRight, 0, maxcr);
            var crbl = $math.fitToRange(this.cornerRadiusBottomLeft, 0, maxcr);
            var lineT = "M" + crtl + ",0 L" + (w - crtr) + ",0";
            var lineB = " L" + crbl + "," + h;
            var lineL = " L0," + crtl;
            var lineR = " L" + w + "," + (h - crbr);
            var arcTR = " a" + crtr + "," + crtr + " 0 0 1 " + crtr + "," + crtr;
            var arcBR = " a" + crbr + "," + crbr + " 0 0 1 -" + crbr + "," + crbr;
            var arcBL = " a" + crbl + "," + crbl + " 0 0 1 -" + crbl + ",-" + crbl;
            var arcTL = " a" + crtl + "," + crtl + " 0 0 1 " + crtl + ",-" + crtl;
            var path = lineT + arcTR + lineR + arcBR + lineB + arcBL + lineL + arcTL + " Z";
            this.path = path;
        }
    };
    /**
     * Sets radius for all four corners at ones.
     *
     * All numbers are in pixels.
     *
     * @param {number}  tl  Top-left corner
     * @param {number}  tr  Top-right corner
     * @param {number}  bl  Bottom-left corner
     * @param {number}  br  Bottom-right corner
     */
    RoundedRectangle.prototype.cornerRadius = function (tl, tr, bl, br) {
        this.cornerRadiusTopLeft = tl;
        this.cornerRadiusTopRight = tr;
        this.cornerRadiusBottomLeft = bl;
        this.cornerRadiusBottomRight = br;
    };
    Object.defineProperty(RoundedRectangle.prototype, "cornerRadiusTopLeft", {
        /**
         * @return {number} Radius (px)
         */
        get: function () {
            return this.getPropertyValue("cornerRadiusTopLeft");
        },
        /**
         * Radius of the top-left corner in pixels.
         *
         * @default 3
         * @param {number}  value  Radius (px)
         */
        set: function (value) {
            this.setPropertyValue("cornerRadiusTopLeft", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoundedRectangle.prototype, "cornerRadiusTopRight", {
        /**
         * @return {number} Radius (px)
         */
        get: function () {
            return this.getPropertyValue("cornerRadiusTopRight");
        },
        /**
         * Radius of the top-right corner in pixels.
         *
         * @default 3
         * @param {number}  value  Radius (px)
         */
        set: function (value) {
            this.setPropertyValue("cornerRadiusTopRight", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoundedRectangle.prototype, "cornerRadiusBottomRight", {
        /**
         * @return {number} Radius (px)
         */
        get: function () {
            return this.getPropertyValue("cornerRadiusBottomRight");
        },
        /**
         * Radius of the bottom-right corner in pixels.
         *
         * @default 3
         * @param {number}  value  Radius (px)
         */
        set: function (value) {
            this.setPropertyValue("cornerRadiusBottomRight", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoundedRectangle.prototype, "cornerRadiusBottomLeft", {
        /**
         * @return {number} Radius (px)
         */
        get: function () {
            return this.getPropertyValue("cornerRadiusBottomLeft");
        },
        /**
         * Radius of the bottom-left corner in pixels.
         *
         * @default 3
         * @param {number}  value  Radius (px)
         */
        set: function (value) {
            this.setPropertyValue("cornerRadiusBottomLeft", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Measures the element.
     *
     * @ignore Exclude from docs
     */
    RoundedRectangle.prototype.measureElement = function () {
    };
    Object.defineProperty(RoundedRectangle.prototype, "bbox", {
        /**
         * Returns bounding box (square) for this element.
         *
         * @ignore Exclude from docs
         * @type {IRectangle}
         */
        get: function () {
            if (this.definedBBox) {
                return this.definedBBox;
            }
            if (this.isMeasured) {
                return {
                    x: 0,
                    y: 0,
                    width: this.innerWidth,
                    height: this.innerHeight
                };
            }
            else {
                return { x: 0, y: 0, width: 0, height: 0 };
            }
        },
        enumerable: true,
        configurable: true
    });
    return RoundedRectangle;
}(Sprite));
export { RoundedRectangle };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["RoundedRectangle"] = RoundedRectangle;
//# sourceMappingURL=RoundedRectangle.js.map