/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Represents a relative value. (percent)
 */
export class Percent {

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
	 * @readonly
	 * @return {number} Relative value
	 */
	public get value(): number {
		return this._value / 100;
	}

	/**
	 * Value in percent.
	 *
	 * @return {number} Percent
	 */
	public get percent(): number {
		return this._value;
	}

	/*public toString(): string {
		return "" + this._value + "%";
	}

	public toNumber(): number {
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
 * @param  {number}   value  Percent
 * @return {Percent}         Percent object
 */
export function percent(value: number): Percent {
	return new Percent(value);
}


/**
 * Checks if value is a [[Percent]] object.
 *
 * @ignore Exclude from docs
 * @param  {any}      value  Input value
 * @return {boolean}         Is percent?
 */
export function isPercent(value: any): boolean {
	return value instanceof Percent;
}
