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
import { Percent } from "./Percent";
/**
 * @todo Description
 * @ignore Exclude from docs
 */
export declare type Public<T> = {
    [P in keyof T]: T[P];
};
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
export declare function isNaN(value: number): boolean;
/**
 * Represents a type for all available JavaScript variable types.
 *
 * @type {[type]}
 */
export declare type Type = "[object Object]" | "[object Array]" | "[object String]" | "[object Number]" | "[object Boolean]" | "[object Date]";
/**
 * Returns a type of the value.
 *
 * @param  {any}   value  Input value
 * @return {Type}         Type of the value
 */
export declare function getType<A>(value: A): Type;
/**
 * Returns a default value if the passed in value is empty.
 *
 * @param  {any}   value     Input value
 * @param  {any}   optional  Default value
 * @return {any}             Value or default value whichever is available
 * @deprecated Not used anywhere
 */
export declare function getDefault<A>(value: null | undefined | A, optional: A): A;
/**
 * Checks if the passed in value is a string.
 *
 * @param  {any}   value  Value
 * @return {value}        Is string?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
export declare function checkString(value: any): value is string;
/**
 * Checks if the passed in value is a boolean.
 *
 * @param  {any}   value  Value
 * @return {value}        Is boolean?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
export declare function checkBoolean(value: any): value is boolean;
/**
 * Checks if the passed in value is a number.
 *
 * @param  {any}   value  Value
 * @return {value}        Is number?
 * @throws {Error}
 */
export declare function checkNumber(value: any): value is number;
/**
 * Checks if the passed in value is an object.
 *
 * @param  {any}   value  Value
 * @return {value}        Is object?
 * @throws {Error}
 * @todo Is the input type correct?
 * @deprecated Not used anywhere
 */
export declare function checkObject(value: {}): value is {};
/**
 * Checks if the passed in value is an array.
 *
 * @param  {any}   value  Value
 * @return {value}        Is array?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
export declare function checkArray<A>(value: Array<A>): value is Array<A>;
/**
 * Checks if the passed in value is a Date object.
 *
 * @param  {any}   value  Value
 * @return {value}        Is Date object?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
export declare function checkDate(value: Date): value is Date;
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
export declare function castString(value: string | number): string;
/**
 * Casts string or a number into a number.
 *
 * @param  {string | number | Date}  value   Input value
 * @return {number}                  Number  value
 * @throws {Error}
 */
export declare function castNumber(value: string | number | Date): number;
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
export declare function toBoolean(value: any): boolean;
/**
 * Converts any value into a `number`.
 *
 * @param  {any}     value  Source value
 * @return {number}         Number representation of value
 */
export declare function toNumber(value: any): number;
/**
 * Converts any value into a string (text).
 *
 * @param  {any}     value  Source value
 * @return {string}         String representation of the input
 */
export declare function toText(value: any): string;
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
export declare function toNumberOrPercent(value: any): number | Percent;
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
export declare type Optional<A> = A | undefined;
/**
 * Checks if a variable has a value.
 *
 * @param {Optional<A> | null}  a  Input value
 * @returns                        Has value?
 */
export declare function hasValue<A>(a: Optional<A> | null): a is A;
/**
 * Returns a value or throws an {Error} exception if the variable has not
 * value.
 *
 * @param {Optional<A> | null}  a  Input value
 * @returns                        Value
 */
export declare function getValue<A>(a: Optional<A> | null): A;
/**
 * Returns a value, or returns the default value if it doesn't have a value.
 *
 * @param {Optional<A> | null}  a  Input value
 * @returns                        Value
 */
export declare function getValueDefault<A>(a: Optional<A> | null, defaultValue: A): A;
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
export declare function isDate(value: any): value is Date;
/**
 * Checks if parameter is `string`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is string?
 */
export declare function isString(value: any): value is string;
/**
 * Checks if parameter is `number`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is number?
 */
export declare function isNumber(value: any): value is number;
/**
 * Checks if parameter is `object`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is object?
 */
export declare function isObject(value: any): value is number;
/**
 * Checks if parameter is `Array`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is Array?
 */
export declare function isArray(value: any): value is Array<any>;
