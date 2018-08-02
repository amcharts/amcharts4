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
import { percent, isPercent } from "./Percent";
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
export function isNaN(value) {
    return Number(value) !== value;
}
/**
 * Returns a type of the value.
 *
 * @param  {any}   value  Input value
 * @return {Type}         Type of the value
 */
export function getType(value) {
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
export function getDefault(value, optional) {
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
export function checkString(value) {
    if (typeof value === "string") {
        return true;
    }
    else {
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
export function checkBoolean(value) {
    if (typeof value === "boolean") {
        return true;
    }
    else {
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
export function checkNumber(value) {
    if (typeof value === "number") {
        if (isNaN(value)) {
            throw new Error("Expected a number but got NaN");
        }
    }
    else {
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
export function checkObject(value) {
    var t = getType(value);
    if (t === "[object Object]") {
        return true;
    }
    else {
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
export function checkArray(value) {
    if (Array.isArray(value)) {
        return true;
    }
    else {
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
export function checkDate(value) {
    var t = getType(value);
    if (t === "[object Date]") {
        return true;
    }
    else {
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
export function castString(value) {
    if (typeof value === "string") {
        return value;
    }
    else if (typeof value === "number") {
        return "" + value;
    }
    else {
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
export function castNumber(value) {
    if (typeof value === "string") {
        var number = +value;
        if (isNaN(number)) {
            throw new Error("Cannot cast string " + JSON.stringify(value) + " to a number");
        }
        else {
            return number;
        }
    }
    else if (typeof value === "number") {
        if (isNaN(value)) {
            throw new Error("Expected a number but got NaN");
        }
        else {
            return value;
        }
    }
    else {
        var t = getType(value);
        if (t === "[object Date]") {
            return value.getTime();
        }
        else {
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
export function toBoolean(value) {
    return value ? true : false;
}
/**
 * Converts any value into a `number`.
 *
 * @param  {any}     value  Source value
 * @return {number}         Number representation of value
 */
export function toNumber(value) {
    if (hasValue(value) && !isNumber(value)) {
        var converted = Number(value);
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
export function toText(value) {
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
export function toNumberOrPercent(value) {
    if (!hasValue(value) || isNumber(value) || isPercent(value)) {
        return value;
    }
    if (isString(value) && value.indexOf("%") != -1) {
        return percent(toNumber(value));
    }
    return toNumber(value);
}
/**
 * Checks if a variable has a value.
 *
 * @param {Optional<A> | null}  a  Input value
 * @returns                        Has value?
 */
export function hasValue(a) {
    return a != null;
}
/**
 * Returns a value or throws an {Error} exception if the variable has not
 * value.
 *
 * @param {Optional<A> | null}  a  Input value
 * @returns                        Value
 */
export function getValue(a) {
    if (hasValue(a)) {
        return a;
    }
    else {
        throw new Error("Value doesn't exist");
    }
}
/**
 * Returns a value, or returns the default value if it doesn't have a value.
 *
 * @param {Optional<A> | null}  a  Input value
 * @returns                        Value
 */
export function getValueDefault(a, defaultValue) {
    if (hasValue(a)) {
        return a;
    }
    else {
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
export function isDate(value) {
    return getType(value) === "[object Date]";
}
/**
 * Checks if parameter is `string`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is string?
 */
export function isString(value) {
    return typeof value === "string";
}
/**
 * Checks if parameter is `number`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is number?
 */
export function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
}
/**
 * Checks if parameter is `object`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is object?
 */
export function isObject(value) {
    return typeof value === "object";
}
/**
 * Checks if parameter is `Array`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is Array?
 */
export function isArray(value) {
    return Array.isArray(value);
}
//# sourceMappingURL=Type.js.map