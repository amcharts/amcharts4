/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as $array from "./Array";
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
 * @param object  Source object
 * @returns Iterator
 */
export function entries<Object>(object: Object): $iter.Iterator<[$type.Keyof<Object>, Object[$type.Keyof<Object>]]> {
	return (push) => {
		// TODO make this more efficient ?
		for (let key in object) {
			if (hasKey(object, key)) {
				if (!push([key as $type.Keyof<Object>, object[key] as Object[$type.Keyof<Object>]])) {
					break;
				}
			}
		}
	};
}

/**
 * Returns an array of object's property names.
 *
 * @param object  Source object
 * @returns Object property names
 */
export function keys<Object>(object: Object): Array<$type.Keyof<Object>> {
	const output = [];

	for (let key in object) {
		if (hasKey(object, key)) {
			output.push(key as $type.Keyof<Object>);
		}
	}

	return output;
}

/**
 * Returns an array of object's property names ordered using specific ordering
 * function.
 *
 * @param object  Source object
 * @param order   Ordering function
 * @returns Object property names
 */
export function keysOrdered<Object>(object: Object, order: (a: $type.Keyof<Object>, b: $type.Keyof<Object>) => Ordering): Array<$type.Keyof<Object>> {
	return keys(object).sort(order);
}

/**
 * Checks if `object` has a specific `key`.
 *
 * @param object  Source object
 * @param key     Property name
 * @returns Has key?
 */
export function hasKey<Object, Key extends keyof Object>(object: Object, key: Key): boolean {
	return {}.hasOwnProperty.call(object, key);
}

/**
 * Returns value of the specific `key`.
 *
 * @param object  Source object
 * @param key     Property name
 * @returns Key value
 */
export function getKey<Object, Key extends keyof Object>(object: Object, key: Key): Object[Key] {
	return object[key];
}

/**
 * Iterates through all properties of the object calling `fn` for each of them.
 *
 * If return value of the function evaluates to `false` further iteration is
 * cancelled.
 *
 * @param object  Source object
 * @param fn      Callback function
 */
export function eachContinue<Object>(object: Object, fn: <Key extends $type.Keyof<Object>>(key: Key, value: Object[Key]) => boolean): void {
	for (let key in object) {
		if (hasKey(object, key)) {
			if (!fn(key as $type.Keyof<Object>, object[key] as Object[$type.Keyof<Object>])) {
				break;
			}
		}
	}
}

/**
 * Iterates through all properties of the object calling `fn` for each of them.
 *
 * @param object  Source object
 * @param fn      Callback function
 */
export function each<Object>(object: Object, fn: <Key extends $type.Keyof<Object>>(key: Key, value: Object[Key]) => void): void {
	eachContinue(object, (key, value) => {
		fn(key, value);
		return true;
	});
}

/**
 * Orders object properties using custom `ord` function and iterates through
 * them calling `fn` for each of them.
 *
 * @param object  Source object
 * @param fn      Callback function
 * @param order   Ordering function
 */
export function eachOrdered<Object>(object: Object, fn: <Key extends $type.Keyof<Object>>(key: Key, value: Object[Key]) => void, ord: (a: $type.Keyof<Object>, b: $type.Keyof<Object>) => Ordering): void {
	$array.each(keysOrdered(object, ord), (key) => {
		fn(key, object[key]);
	});
}

/**
 * Returns a copy of the object.
 *
 * @param object  Source object
 * @returns Copy of the object
 */
export function copy<Object>(object: Object): Object {
	return Object.assign({}, object);
}

/**
 * Merges two objects and returns a new object that contains properties from
 * both source objects.
 *
 * @param object1  Source object #1
 * @param object2  Source object #2
 * @returns Combined object
 */
export function merge<Object1, Object2>(object1: Object1, object2: Object2): Object1 & Object2 {
	return Object.assign({}, object1, object2);
}

/**
 * Copies a list of properties from one object to another.
 *
 * Will not copy empty properties.
 *
 * @param source  Source object
 * @param target    Target object
 * @param keys  List of keys to copy
 */
export function copyProperties(source: { [key: string]: any }, target: { [key: string]: any }, keys: Array<string>): void {
	$array.each(keys, (key) => {
		if ($type.hasValue(source[key])) {
			target[key] = source[key];
		}
	});
}

/**
 * Copies a list of properties from one object to another only if target does't have value of the property set.
 *
 * Will not copy empty properties.
 *
 * @param source  Source object
 * @param target    Target object
 * @param keys  List of keys to copy
 */
export function softCopyProperties(source: { [key: string]: any }, target: { [key: string]: any }, keys: Array<string>): void {
	$array.each(keys, (key) => {
		if ($type.hasValue(source[key]) && !($type.hasValue((<any>target)[key]))) {
			target[key] = source[key];
		}
	});
}

/**
 * Copies a list of properties from one object to another.
 *
 * Will copy empty properties.
 *
 * @param source  Source object
 * @param target    Target object
 * @param keys  List of keys to copy
 */
export function forceCopyProperties(source: { [key: string]: any }, target: { [key: string]: any }, keys: Array<string>): void {
	$array.each(keys, (key) => {
		target[key] = source[key];
	});
}

/**
 * Copies all properties from one object to another.
 *
 * @param from  Source object
 * @param to    Target object
 */
export function copyAllProperties(from: { [key: string]: any }, to: { [key: string]: any }): void {
	copyProperties(from, to, keys(from));
}
