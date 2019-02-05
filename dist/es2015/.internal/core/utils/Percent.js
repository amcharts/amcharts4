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
     * @param percent  Percent value
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
         * let percent = new am4core.Percent(50);
         * console.log(value * percent.value); // outputs 128
         * ```
         * ```JavaScript
         * var value = 256;
         * var percent = new am4core.Percent(50);
         * console.log(value * percent.value); // outputs 128
         * ```
         *
         * @readonly
         * @return Relative value
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
         * @return Percent
         */
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Percent.prototype.toString = function () {
        return "" + this._value + "%";
    };
    return Percent;
}());
export { Percent };
/**
 * Converts numeric percent value to a proper [[Percent]] object.
 *
 * ```TypeScript
 * pieSeries.radius = am4core.percent(80);
 * ```
 * ```JavaScript
 * pieSeries.radius = am4core.percent(80);
 * ```
 *
 * @param value  Percent
 * @return Percent object
 */
export function percent(value) {
    return new Percent(value);
}
/**
 * Checks if value is a [[Percent]] object.
 *
 * @ignore Exclude from docs
 * @param value  Input value
 * @return Is percent?
 */
export function isPercent(value) {
    return value instanceof Percent;
}
//# sourceMappingURL=Percent.js.map