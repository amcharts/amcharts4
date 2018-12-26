/**
 * A collection of utility functions for various type checks and conversion
 * @todo Review unused functions for removal
 * @hidden
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { percent, Percent, isPercent } from "./Percent";

/**
 * @todo Description
 * @ignore Exclude from docs
 */
export type Public<T> = {[P in keyof T]: T[P]};


/**
 * `Keyof<T>` is the same as `keyof T` except it only accepts string keys, not numbers or symbols.
 *
 * @type {[type]}
 */
export type Keyof<T> = Extract<keyof T, string>;


/**
 * ============================================================================
 * TYPE CHECK
 * ============================================================================
 * @hidden
 */

/**
 * Returns `true` if value is not a number (NaN).
 *
 * @param  {number}  value Input value
 * @return {boolean}       Is NaN?
 * @deprecated Is not used anywhere. JS built-in isNaN is used everywhere. Maybe we don't need this, or if we do, then we should use it everywhere
 */
export function isNaN(value: number): boolean {
	return Number(value) !== value;
}

/**
 * Represents a type for all available JavaScript variable types.
 *
 * @type {[type]}
 */
export type Type
	= "[object Object]"
	| "[object Array]"
	| "[object String]"
	| "[object Number]"
	| "[object Boolean]"
	| "[object Date]";

/**
 * Returns a type of the value.
 *
 * @param  {any}   value  Input value
 * @return {Type}         Type of the value
 */
export function getType<A>(value: A): Type {
	return ({}).toString.call(value);
}

/**
 * Returns a default value if the passed in value is empty.
 *
 * @param  {any}   value     Input value
 * @param  {any}   optional  Default value
 * @return {any}             Value or default value whichever is available
 * @deprecated Not used anywhere
 */
export function getDefault<A>(value: null | undefined | A, optional: A): A {
	return value || optional;
}

/**
 * Checks if the passed in value is a string.
 *
 * @param  {any}   value  Value
 * @return {value}        Is string?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
export function checkString(value: any): value is string {
	if (typeof value === "string") {
		return true;
	} else {
		throw new Error("Expected a string but got " + getType(value));
	}
}

/**
 * Checks if the passed in value is a boolean.
 *
 * @param  {any}   value  Value
 * @return {value}        Is boolean?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
export function checkBoolean(value: any): value is boolean {
	if (typeof value === "boolean") {
		return true;
	} else {
		throw new Error("Expected a boolean but got " + getType(value));
	}
}

/**
 * Checks if the passed in value is a number.
 *
 * @param  {any}   value  Value
 * @return {value}        Is number?
 * @throws {Error}
 */
export function checkNumber(value: any): value is number {
	if (typeof value === "number") {
		if (isNaN(value)) {
			throw new Error("Expected a number but got NaN");
		}
	} else {
		throw new Error("Expected a number but got " + getType(value));
	}
	return true;
}

/**
 * Checks if the passed in value is an object.
 *
 * @param  {any}   value  Value
 * @return {value}        Is object?
 * @throws {Error}
 * @todo Is the input type correct?
 * @deprecated Not used anywhere
 */
export function checkObject(value: {}): value is {} {
	const t = getType(value);

	if (t === "[object Object]") {
		return true;

	} else {
		throw new Error("Expected an object but got " + t);
	}
}

/**
 * Checks if the passed in value is an array.
 *
 * @param  {any}   value  Value
 * @return {value}        Is array?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
export function checkArray<A>(value: Array<A>): value is Array<A> {
	if (Array.isArray(value)) {
		return true;

	} else {
		throw new Error("Expected an array but got " + getType(value));
	}
}

/**
 * Checks if the passed in value is a Date object.
 *
 * @param  {any}   value  Value
 * @return {value}        Is Date object?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
export function checkDate(value: Date): value is Date {
	const t = getType(value);

	if (t === "[object Date]") {
		return true;

	} else {
		throw new Error("Expected a date but got " + t);
	}
}


/**
 * ============================================================================
 * TYPE CASTING
 * ============================================================================
 * @hidden
 */

/**
 * Casts string or a number into string.
 *
 * @param  {string | number}  value  Input
 * @return {string}                  String value
 * @deprecated Not used anywhere
 */
export function castString(value: string | number): string {
	if (typeof value === "string") {
		return value;

	} else if (typeof value === "number") {
		return "" + value;

	} else {
		throw new Error("Expected a string or number but got " + getType(value));
	}
}

/**
 * Casts string or a number into a number.
 *
 * @param  {string | number | Date}  value   Input value
 * @return {number}                  Number  value
 * @throws {Error}
 */
export function castNumber(value: string | number | Date): number {
	if (typeof value === "string") {
		const number = +value;

		if (isNaN(number)) {
			throw new Error("Cannot cast string " + JSON.stringify(value) + " to a number");

		} else {
			return number;
		}

	} else if (typeof value === "number") {
		if (isNaN(value)) {
			throw new Error("Expected a number but got NaN");

		} else {
			return value;
		}

	} else {
		const t = getType(value);

		if (t === "[object Date]") {
			return value.getTime();

		} else {
			throw new Error("Expected a string, number, or date but got " + t);
		}
	}
}

/**
 * Casts number, string or Date into a Date object.
 *
 * @param  {string | number | Date}   value  Input value
 * @return {Date}                            Date object
 * @deprecated Not used anywhere
 * @throws {Error}
 * @hidden
 * @deprecated
 */
/*export function castDate(value: string | number | Date, formatter?: DateFormatter): Date {
	if (typeof value === "string") {
		if (formatter) {
			return formatter.parse(value);
		}
		return new Date(value);

	} else if (typeof value === "number") {
		return new Date(value);

	} else {
		const t = getType(value);

		if (t === "[object Date]") {
			return value;

		} else {
			throw new Error("Expected a string, number, or date but got " + t);
		}
	}
}*/


/**
 * ============================================================================
 * QUICK CONVERSION
 * ============================================================================
 * @hidden
 */


/**
 * Converts any value into `boolean`.
 *
 * @param  {any}      value  Source value
 * @return {boolean}         `true` or `false`
 */
export function toBoolean(value: any): boolean {
	return value ? true : false;
}

/**
 * Converts any value into a `number`.
 *
 * @param  {any}     value  Source value
 * @return {number}         Number representation of value
 */
export function toNumber(value: any): number {
	if (hasValue(value) && !isNumber(value)) {
		let converted = Number(value);
		if (isNaN(converted) && isString(value) && value != "") {
			return toNumber(value.replace(/[^0-9.\-]+/g, ''));
		}
		return converted;
	}
	return value;
}

/**
 * Converts any value into a string (text).
 *
 * @param  {any}     value  Source value
 * @return {string}         String representation of the input
 */
export function toText(value: any): string {
	if (hasValue(value) && !isString(value)) {
		return castString(value);
	}
	return value;
}

/**
 * Converts any value to a number or [[Percent]].
 *
 * If the parameter is a string and contains "%", it will
 * convert it into a [[Percent]].
 *
 * Otherwise, it will convert into a number.
 *
 * @param {number | Percent}   value  Number or percent
 * @return {number | Percent}         Percent object
 */
export function toNumberOrPercent(value: any): number | Percent {
	if (!hasValue(value) || isNumber(value) || isPercent(value)) {
		return value;
	}
	if (isString(value) && value.indexOf("%") != -1) {
		return percent(toNumber(value));
	}
	return toNumber(value);
}


/**
 * ============================================================================
 * VALUE PRESENCE CHECK
 * ============================================================================
 * @hidden
 */

/**
 * Defines an optional value that can be of any type or `undefined`.
 *
 * @type {[type]}
 */
export type Optional<A> = A | undefined;

/**
 * Checks if a variable has a value.
 *
 * @param {Optional<A> | null}  a  Input value
 * @returns                        Has value?
 */
export function hasValue<A>(a: Optional<A> | null): a is A {
	return a != null;
}

/**
 * Returns a value or throws an {Error} exception if the variable has not
 * value.
 *
 * @param {Optional<A> | null}  a  Input value
 * @returns                        Value
 */
export function getValue<A>(a: Optional<A> | null): A {
	if (hasValue(a)) {
		return a;

	} else {
		throw new Error("Value doesn't exist");
	}
}

/**
 * Returns a value, or returns the default value if it doesn't have a value.
 *
 * @param {Optional<A> | null}  a  Input value
 * @returns                        Value
 */
export function getValueDefault<A>(a: Optional<A> | null, defaultValue: A): A {
	if (hasValue(a)) {
		return a;

	} else {
		return defaultValue;
	}
}


/**
 * ============================================================================
 * TYPE CHECK
 * ============================================================================
 * @hidden
 */

/**
 * Checks if parameter is `Date`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is Date?
 */
export function isDate(value: any): value is Date {
	return getType(value) === "[object Date]";
}

/**
 * Checks if parameter is `string`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is string?
 */
export function isString(value: any): value is string {
	return typeof value === "string";
}

/**
 * Checks if parameter is `number`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is number?
 */
export function isNumber(value: any): value is number {
	return typeof value === "number" && Number(value) == value;
}

/**
 * Checks if parameter is `object`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is object?
 */
export function isObject(value: any): value is number {
	return typeof value === "object";
}

/**
 * Checks if parameter is `Array`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is Array?
 */
export function isArray(value: any): value is Array<any> {
	return Array.isArray(value);
}
