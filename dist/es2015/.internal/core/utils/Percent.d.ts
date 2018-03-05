/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { percent, isPercent } from "./Type";
export { percent, isPercent };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Represents a relative value. (percent)
 */
export declare class Percent {
    /**
     * Value in percent.
     *
     * @type {number}
     */
    protected _value: number;
    /**
     * Constructor.
     *
     * @param {number}  percent  Percent value
     */
    constructor(percent: number);
    /**
     * Relative value.
     *
     * E.g. 100% is 1, 50% is 0.5, etc.
     *
     * This is useful to apply transformations to other values. E.g.:
     *
     * ```TypeScript
     * let value = 256;
     * let percent = new amcharts4.Percent(50);
     * console.log(value * percent.value); // outputs 128
     * ```
     * ```JavaScript
     * var value = 256;
     * var percent = new amcharts4.Percent(50);
     * console.log(value * percent.value); // outputs 128
     * ```
     *
     * @readonly
     * @return {number} Relative value
     */
    readonly value: number;
    /**
     * Value in percent.
     *
     * @return {number} Percent
     */
    readonly percent: number;
}
