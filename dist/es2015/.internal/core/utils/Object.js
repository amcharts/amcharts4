/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as $array from "./Array";
import * as $type from "./Type";
/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Returns an iterator for all entries in object.
 *
 * Can be used to safely iterate through all properties of the object.
 *
 * @param   {object}    object  Source object
 * @returns {Iterator}          Iterator
 */
export function entries(object) {
    return function (push) {
        // TODO make this more efficient ?
        for (var key in object) {
            if (typeof key === "string" && hasKey(object, key)) {
                if (!push([key, object[key]])) {
                    break;
                }
            }
        }
    };
}
/**
 * Returns an array of object's property names.
 *
 * @param   {object}        object  Source object
 * @returns {Array<string}          Object property names
 */
export function keys(object) {
    return Object.keys(object);
}
/**
 * Returns an array of object's property names ordered using specific ordering
 * function.
 *
 * @param   {object}        object  Source object
 * @param   {function}      order   Ordering function
 * @returns {Array<string}          Object property names
 */
export function keysOrdered(object, order) {
    return Object.keys(object).sort(order);
}
/**
 * Checks if `object` has a specific `key`.
 *
 * @param   {object}   object  Source object
 * @param   {string}   key     Property name
 * @returns {boolean}          Has key?
 */
export function hasKey(object, key) {
    return {}.hasOwnProperty.call(object, key);
}
/**
 * Returns value of the specific `key`.
 *
 * @param   {object}   object  Source object
 * @param   {string}   key     Property name
 * @returns {any}              Key value
 */
export function getKey(object, key) {
    return object[key];
}
/**
 * Iterates through all properties of the object calling `fn` for each of them.
 *
 * If return value of the function evaluates to `false` further iteration is
 * cancelled.
 *
 * @param {object}   object  Source object
 * @param {function} fn      Callback function
 */
export function eachContinue(object, fn) {
    for (var key in object) {
        if (typeof key === "string" && hasKey(object, key)) {
            if (!fn(key, object[key])) {
                break;
            }
        }
    }
}
/**
 * Iterates through all properties of the object calling `fn` for each of them.
 *
 * @param {object}   object  Source object
 * @param {function} fn      Callback function
 */
export function each(object, fn) {
    eachContinue(object, function (key, value) {
        fn(key, value);
        return true;
    });
}
/**
 * Orders object properties using custom `ord` function and iterates through
 * them calling `fn` for each of them.
 *
 * @param {object}    object  Source object
 * @param {function}  fn      Callback function
 * @param {function}  order   Ordering function
 */
export function eachOrdered(object, fn, ord) {
    $array.each(keysOrdered(object, ord), function (key) {
        fn(key, object[key]);
    });
}
/**
 * Returns a copy of the object.
 *
 * @param   {object} object  Source object
 * @returns {object}         Copy of the object
 */
export function copy(object) {
    return Object.assign({}, object);
}
/**
 * Merges two objects and returns a new object that contains properties from
 * both source objects.
 *
 * @param   {object} object1  Source object #1
 * @param   {object} object2  Source object #2
 * @returns {object}          Combined object
 */
export function merge(object1, object2) {
    return Object.assign({}, object1, object2);
}
/**
 * Copies a list of properties from one object to another.
 *
 * Will not copy empty properties.
 *
 * @param {object}         from  Source object
 * @param {object}         to    Target object
 * @param {Array<string>}  keys  List of keys to copy
 */
export function copyProperties(from, to, keys) {
    $array.each(keys, function (key) {
        if ($type.hasValue(from[key])) {
            to[key] = from[key];
        }
    });
}
/**
 * Copies a list of properties from one object to another.
 *
 * Will copy empty properties.
 *
 * @param {object}         from  Source object
 * @param {object}         to    Target object
 * @param {Array<string>}  keys  List of keys to copy
 */
export function forceCopyProperties(from, to, keys) {
    $array.each(keys, function (key) {
        to[key] = from[key];
    });
}
/**
 * Copies all properties from one object to another.
 *
 * @param {object}  from  Source object
 * @param {object}  to    Target object
 */
export function copyAllProperties(from, to) {
    copyProperties(from, to, keys(from));
}
//# sourceMappingURL=Object.js.map