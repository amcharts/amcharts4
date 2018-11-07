import * as $iter from "./Iterator";
import * as $type from "./Type";
import { Ordering } from "./Order";
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
export declare function entries<Object>(object: Object): $iter.Iterator<[$type.Keyof<Object>, Object[$type.Keyof<Object>]]>;
/**
 * Returns an array of object's property names.
 *
 * @param   {object}        object  Source object
 * @returns {Array<string}          Object property names
 */
export declare function keys<Object>(object: Object): Array<$type.Keyof<Object>>;
/**
 * Returns an array of object's property names ordered using specific ordering
 * function.
 *
 * @param   {object}        object  Source object
 * @param   {function}      order   Ordering function
 * @returns {Array<string>}          Object property names
 */
export declare function keysOrdered<Object>(object: Object, order: (a: $type.Keyof<Object>, b: $type.Keyof<Object>) => Ordering): Array<$type.Keyof<Object>>;
/**
 * Checks if `object` has a specific `key`.
 *
 * @param   {object}   object  Source object
 * @param   {string}   key     Property name
 * @returns {boolean}          Has key?
 */
export declare function hasKey<Object, Key extends keyof Object>(object: Object, key: Key): boolean;
/**
 * Returns value of the specific `key`.
 *
 * @param   {object}   object  Source object
 * @param   {string}   key     Property name
 * @returns {any}              Key value
 */
export declare function getKey<Object, Key extends keyof Object>(object: Object, key: Key): Object[Key];
/**
 * Iterates through all properties of the object calling `fn` for each of them.
 *
 * If return value of the function evaluates to `false` further iteration is
 * cancelled.
 *
 * @param {object}   object  Source object
 * @param {function} fn      Callback function
 */
export declare function eachContinue<Object>(object: Object, fn: <Key extends $type.Keyof<Object>>(key: Key, value: Object[Key]) => boolean): void;
/**
 * Iterates through all properties of the object calling `fn` for each of them.
 *
 * @param {object}   object  Source object
 * @param {function} fn      Callback function
 */
export declare function each<Object>(object: Object, fn: <Key extends $type.Keyof<Object>>(key: Key, value: Object[Key]) => void): void;
/**
 * Orders object properties using custom `ord` function and iterates through
 * them calling `fn` for each of them.
 *
 * @param {object}    object  Source object
 * @param {function}  fn      Callback function
 * @param {function}  order   Ordering function
 */
export declare function eachOrdered<Object>(object: Object, fn: <Key extends $type.Keyof<Object>>(key: Key, value: Object[Key]) => void, ord: (a: $type.Keyof<Object>, b: $type.Keyof<Object>) => Ordering): void;
/**
 * Returns a copy of the object.
 *
 * @param   {object} object  Source object
 * @returns {object}         Copy of the object
 */
export declare function copy<Object>(object: Object): Object;
/**
 * Merges two objects and returns a new object that contains properties from
 * both source objects.
 *
 * @param   {object} object1  Source object #1
 * @param   {object} object2  Source object #2
 * @returns {object}          Combined object
 */
export declare function merge<Object1, Object2>(object1: Object1, object2: Object2): Object1 & Object2;
/**
 * Copies a list of properties from one object to another.
 *
 * Will not copy empty properties.
 *
 * @param {object}         source  Source object
 * @param {object}         target    Target object
 * @param {Array<string>}  keys  List of keys to copy
 */
export declare function copyProperties(source: {
    [key: string]: any;
}, target: {
    [key: string]: any;
}, keys: Array<string>): void;
/**
 * Copies a list of properties from one object to another only if target does't have value of the property set.
 *
 * Will not copy empty properties.
 *
 * @param {object}         source  Source object
 * @param {object}         target    Target object
 * @param {Array<string>}  keys  List of keys to copy
 */
export declare function softCopyProperties(source: {
    [key: string]: any;
}, target: {
    [key: string]: any;
}, keys: Array<string>): void;
/**
 * Copies a list of properties from one object to another.
 *
 * Will copy empty properties.
 *
 * @param {object}         source  Source object
 * @param {object}         target    Target object
 * @param {Array<string>}  keys  List of keys to copy
 */
export declare function forceCopyProperties(source: {
    [key: string]: any;
}, target: {
    [key: string]: any;
}, keys: Array<string>): void;
/**
 * Copies all properties from one object to another.
 *
 * @param {object}  from  Source object
 * @param {object}  to    Target object
 */
export declare function copyAllProperties(from: {
    [key: string]: any;
}, to: {
    [key: string]: any;
}): void;
