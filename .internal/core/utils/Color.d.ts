/**
 * This module contains Color object definition
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { iRGB, iHSV, iHSL, color, isColor, castColor } from "./Colors";
import * as $type from "./Type";
export { iRGB, iHSV, iHSL, color, isColor, castColor };
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
export declare class Color {
    /**
     * Light color (used when light contrasting color is required).
     *
     * @param {Color}
     * @ignore
     */
    protected _lightColor: $type.Optional<Color>;
    /**
     * Dark color (used when dark contrasting color is required).
     *
     * @param {Color}
     * @ignore
     */
    protected _darkColor: $type.Optional<Color>;
    /**
     * Holds RGB value of the color.
     *
     * @type {iRGB}
     */
    protected _value: $type.Optional<iRGB>;
    /**
     * Constructor
     *
     * @param {iRGB} color Source color
     */
    constructor(color?: iRGB);
    /**
     * Returns [[iRGB]] representation of the color.
     *
     * @return {iRGB} RGB object
     */
    readonly rgb: $type.Optional<iRGB>;
    /**
     * Returns color hex value string, e.g. "#FF0000".
     *
     * @return {string} Hex color code
     */
    readonly hex: string;
    /**
     * Returns an `rgba()` representation of the color, e.g.:
     * `rgba(255, 0, 0, 0.5)`.
     *
     * @return {string} rgba color string
     */
    readonly rgba: string;
    /**
     * Returns current transparency.
     *
     * @return {number} Alpha (0-1)
     */
    /**
     * Set alpha (transparency) of the color.
     *
     * @param {number} value Alpha (0-1)
     */
    alpha: number;
    /**
     * Returns current light color setting.
     *
     * @return {Color} Color
     */
    /**
     * Sets "light" color. Used when determining contrasting color.
     *
     * @param {Color} color Color
     */
    lightColor: Color;
    /**
     * Returns current dark color setting.
     *
     * @return {Color} Color
     */
    /**
     * Sets "dark" color. Used when determining contrasting color.
     *
     * @param {Color} color Color
     */
    darkColor: Color;
    /**
     * Overrides `toString` method so that [[Color]] object can be used as
     * string.
     *
     * @ignore Exclude from docs
     * @return {string} String represantion of color (usable in CSS)
     */
    toString(): string;
    /**
     * Retruns a new [[Color]] which is percent lighter (positivive value),
     * or darker (negative value).
     *
     * Parameter is in the scale of -1 to 1.
     *
     * @param  {number}  percent  Increase/decrease lightness by X
     * @return {Color}            New Color
     */
    lighten(percent: number): Color;
    /**
     * Retruns a new [[Color]] which is percent brighter (positivive value),
     * or darker (negative value).
     *
     * Parameter is in the scale of -1 to 1.
     *
     * @param  {number}  percent  Increase/decrease brightness by X
     * @return {Color}            New Color
     */
    brighten(percent: number): Color;
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
    saturate(saturation: number): Color;
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
    readonly alternative: Color;
}
