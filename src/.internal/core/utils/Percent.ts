/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Represents a relative value (percent).
 *
 * The Percent object, can be instantiated using two ways:
 *
 * * Via `new Percent(X)`.
 * * Via `am4core.percent(X)`.
 *
 * `Percent` type objects can be used in a number of dual-measuring or
 * positioning properties, like `width`. E.g.:
 *
 * ```TypeScript
 * chart.paddingRight = new Percent(10);
 * // or
 * chart.paddingRight = am4core.percent(10);
 * ```
 * ```JavaScript
 * chart.paddingRight = new Percent(10);
 * // or
 * chart.paddingRight = am4core.percent(10);
 * ```
 * ```JSON
 * {
 *   // ...
 *   "paddingRight": "10%"
 * }
 * ```
 */
export class Percent {

	/**
	 * Value in percent.
	 */
	protected _value: number;

	/**
	 * Constructor.
	 *
	 * @param percent  Percent value
	 */
	constructor(percent: number) {
		this._value = percent;
	}

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
	 * Alternatively, you can use `am4core.percent()` helper function:
	 *
	 * ```TypeScript
	 * let value = 256;
	 * let percent = am4core.percent(50);
	 * console.log(value * percent.value); // outputs 128
	 * ```
	 * ```JavaScript
	 * var value = 256;
	 * var percent = am4core.percent(50);
	 * console.log(value * percent.value); // outputs 128
	 * ```
	 *
	 * @readonly
	 * @return Relative value
	 */
	public get value(): number {
		return this._value / 100;
	}

	/**
	 * Value in percent.
	 *
	 * @return Percent
	 */
	public get percent(): number {
		return this._value;
	}

	public toString(): string {
		return "" + this._value + "%";
	}

	/*public toNumber(): number {
		return this.percent;
	}*/

}


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
export function percent(value: number): Percent {
	return new Percent(value);
}


/**
 * Checks if value is a [[Percent]] object.
 *
 * @ignore Exclude from docs
 * @param value  Input value
 * @return Is percent?
 */
export function isPercent(value: any): boolean {
	return value instanceof Percent;
}
