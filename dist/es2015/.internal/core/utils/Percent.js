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
var Percent = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {number}  percent  Percent value
     */
    function Percent(percent) {
        this._value = percent;
    }
    Object.defineProperty(Percent.prototype, "value", {
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
        get: function () {
            return this._value / 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Percent.prototype, "percent", {
        /**
         * Value in percent.
         *
         * @return {number} Percent
         */
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return Percent;
}());
export { Percent };
//# sourceMappingURL=Percent.js.map