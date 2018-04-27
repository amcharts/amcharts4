/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColorModifier } from "./ColorModifier";
import { LinearGradient } from "./LinearGradient";
import { RadialGradient } from "./RadialGradient";
import { Color } from "../../utils/Color";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This class can be used to modify linear gradient steps, changing visual
 * properties like lightness, brightness, opacity of each set.
 *
 * It can also set offsets for each gradient step.
 *
 * E.g. if I want to fill a columns in a column series to be a solid fill from
 * top to 80% of height, then gradually fades out, I can use the following
 * gradient modifier as a `fillModifier`:
 *
 * ```TypeScript
 * let fillModifier = new am4core.LinearGradientModifier();
 * fillModifier.opacities = [1, 1, 0];
 * fillModifier.offsets = [0, 0.8, 1];
 * columnSeries.columns.template.fillModifier = fillModifier;
 * ```
 * ```JavaScript
 * var fillModifier = new am4core.LinearGradientModifier();
 * fillModifier.opacities = [1, 1, 0];
 * fillModifier.offsets = [0, 0.8, 1];
 * columnSeries.columns.template.fillModifier = fillModifier;
 * ```
 * ```JSON
 * "series": [{
 *   "type": "ColumnSeries",
 *   "columns": {
 *     "fillModifier": {
 *       "type": "LinearGradientModifier",
 *       "opacities": [1, 1, 0],
 *       "offsets": [0, 0.8, 1]
 *     }
 *   }
 * }]
 * ```
 */
export declare class LinearGradientModifier extends ColorModifier {
    /**
     * A reference to the gradient instance that this modifier is used for.
     *
     * @type {LinearGradient}
     */
    gradient: LinearGradient;
    /**
     * An array of lightness values for each step.
     *
     * @type {number[]}
     */
    protected _lightnesses: number[];
    /**
     * An array of brightness values for each step.
     *
     * @type {number[]}
     */
    protected _brightnesses: number[];
    /**
     * An array of opacity values for each step.
     *
     * @type {number[]}
     */
    protected _opacities: number[];
    /**
     * An array of relative position (0-1) for each step.
     *
     * If not set, all steps will be of equal relative length.
     *
     * @type {number[]}
     */
    protected _offsets: number[];
    /**
     * Constructor.
     */
    constructor();
    /**
     * @return {number[]} Lightness values
     */
    /**
     * An array of lightness values for each step.
     *
     * @param {number[]}  value  Lightness values
     */
    lightnesses: number[];
    /**
     * @return {number[]} Brightness values
     */
    /**
     * An array of brightness values for each step.
     *
     * @param {number[]}  value  Brightness values
     */
    brightnesses: number[];
    /**
     * @return {number[]} Opacity values
     */
    /**
     * An array of opacity values for each step.
     *
     * @param {number[]}  value  Opacity values
     */
    opacities: number[];
    /**
     * @return {number[]} Offsets
     */
    /**
     * An array of relative position (0-1) for each step.
     *
     * If not set, all steps will be of equal relative length.
     *
     * @param {number[]}  value  Offsets
     */
    offsets: number[];
    /**
     * Modifies the color based on step setting.
     *
     * @ignore Exclude from docs
     * @param  {Color}  value  Source color
     * @return {Color}         A gradient that matches set modification rules
     */
    modify(value: Color): Color | LinearGradient | RadialGradient;
    copyFrom(source: this): void;
}
