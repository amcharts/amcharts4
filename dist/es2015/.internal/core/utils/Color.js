/**
 * This module contains Color object definition
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { color, isColor, castColor } from "./Colors";
import * as $colors from "./Colors";
// Re-export
export { color, isColor, castColor };
/**
 * Represents a color.
 *
 * `Color` accepts value only in [[iRGB]] object format. To create `Color`
 * object by parsing it from any supported string-based formats, use helper
 * [[color]] function:
 *
 * ```TypeScript
 * amcharts4.color("#ff0000");
 * amcharts4.color("#f00");
 * amcharts4.color("rgb(255, 0, 0)");
 * amcharts4.color("rgba(255, 0, 0, 0.5)");
 * amcharts4.color({ r: 255, g: 0, b: 0 });
 * amcharts4.color("red");
 * ```
 * ```JavaScript
 * amcharts4.color("#ff0000");
 * amcharts4.color("#f00");
 * amcharts4.color("rgb(255, 0, 0)");
 * amcharts4.color("rgba(255, 0, 0, 0.5)");
 * amcharts4.color({ r: 255, g: 0, b: 0 });
 * amcharts4.color("red");
 * ```
 */
var Color = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {iRGB} color Source color
     */
    function Color(color) {
        this._value = color;
    }
    Object.defineProperty(Color.prototype, "rgb", {
        /**
         * Returns [[iRGB]] representation of the color.
         *
         * @return {iRGB} RGB object
         */
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hex", {
        /**
         * Returns color hex value string, e.g. "#FF0000".
         *
         * @return {string} Hex color code
         */
        get: function () {
            return this._value ? $colors.rgbToHex(this._value) : "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "rgba", {
        /**
         * Returns an `rgba()` representation of the color, e.g.:
         * `rgba(255, 0, 0, 0.5)`.
         *
         * @return {string} rgba color string
         */
        get: function () {
            return this._value ? $colors.rgbToRGBA(this._value) : "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "alpha", {
        /**
         * Returns current transparency.
         *
         * @return {number} Alpha (0-1)
         */
        get: function () {
            if (this._value != null && this._value.a != null) {
                return this._value.a;
            }
            else {
                return 1;
            }
        },
        /**
         * Set alpha (transparency) of the color.
         *
         * @param {number} value Alpha (0-1)
         */
        set: function (value) {
            if (this._value) {
                this._value.a = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "lightColor", {
        /**
         * Returns current light color setting.
         *
         * @return {Color} Color
         */
        get: function () {
            if (!this._lightColor) {
                this._lightColor = new Color({ r: 255, g: 255, b: 255 });
            }
            return this._lightColor;
        },
        /**
         * Sets "light" color. Used when determining contrasting color.
         *
         * @param {Color} color Color
         */
        set: function (color) {
            this._lightColor = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "darkColor", {
        /**
         * Returns current dark color setting.
         *
         * @return {Color} Color
         */
        get: function () {
            if (!this._darkColor) {
                this._darkColor = new Color({ r: 0, g: 0, b: 0 });
            }
            return this._darkColor;
        },
        /**
         * Sets "dark" color. Used when determining contrasting color.
         *
         * @param {Color} color Color
         */
        set: function (color) {
            this._darkColor = color;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Overrides `toString` method so that [[Color]] object can be used as
     * string.
     *
     * @ignore Exclude from docs
     * @return {string} String represantion of color (usable in CSS)
     */
    Color.prototype.toString = function () {
        return this.alpha < 1 ? this.rgba : this.hex;
    };
    /**
     * Retruns a new [[Color]] which is percent lighter (positivive value),
     * or darker (negative value).
     *
     * Parameter is in the scale of -1 to 1.
     *
     * @param  {number}  percent  Increase/decrease lightness by X
     * @return {Color}            New Color
     */
    Color.prototype.lighten = function (percent) {
        return $colors.lighten(this, percent);
    };
    /**
     * Retruns a new [[Color]] which is percent brighter (positivive value),
     * or darker (negative value).
     *
     * Parameter is in the scale of -1 to 1.
     *
     * @param  {number}  percent  Increase/decrease brightness by X
     * @return {Color}            New Color
     */
    Color.prototype.brighten = function (percent) {
        return $colors.brighten(this, percent);
    };
    /**
     * Returns a new [[Color]] based on current color with specific saturation
     * applied.
     *
     * `saturation` can be in the range of 0 (fully desaturated) to 1 (fully
     * saturated).
     *
     * @param  {number}  saturation  Saturation (0-1)
     * @return {Color}               New (saturated) color
     */
    Color.prototype.saturate = function (saturation) {
        return $colors.saturate(this, saturation);
    };
    Object.defineProperty(Color.prototype, "alternative", {
        /**
         * Returns a either light or dark color that contrasts specifically with
         * this color.
         *
         * Uses properties `darkColor` (default black) and `lightColor` (default
         * white).
         *
         * Useful when determining which color label should be on a colored
         * background, so that it stands out.
         *
         * @return {Color} Contrasting color
         */
        get: function () {
            if (this.rgb != null) {
                return $colors.isLight(this.rgb) ? this.darkColor : this.lightColor;
            }
            else {
                throw new Error("Color does not exist");
            }
        },
        enumerable: true,
        configurable: true
    });
    return Color;
}());
export { Color };
//# sourceMappingURL=Color.js.map