import * as $math from "./Math";
import * as $type from "./Type";
/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Searches `array` for `value`.
 *
 * Returns -1 if not found.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {A}             value  Value to search
 * @returns {number}               Index
 */
export function indexOf(array, value) {
    var length = array.length;
    for (var i = 0; i < length; ++i) {
        // TODO handle NaN
        if (array[i] === value) {
            return i;
        }
    }
    return -1;
}
/**
 * Calls `fn` function for every member of array and returns a new array out
 * of all outputs.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {function}      fn     Callback function
 * @returns {number}               New array
 */
export function map(array, fn) {
    var length = array.length;
    var output = new Array(length);
    for (var i = 0; i < length; ++i) {
        output[i] = fn(array[i], i);
    }
    return output;
}
/**
 * Iterates through all items in array and calls `fn` function for each of
 * them.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {function}      fn     Callback function
 */
export function each(array, fn) {
    var length = array.length;
    for (var i = 0; i < length; ++i) {
        fn(array[i], i);
    }
}
/**
 * Iterates through all items in array in reverse order and calls `fn` function for each of
 * them.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {function}      fn     Callback function
 */
export function eachReverse(array, fn) {
    var i = array.length;
    while (i--) {
        fn(array[i], i);
    }
}
/**
 * Iterates through all items in array and calls `fn` function for each of
 * them.
 *
 * If `fn` call evaluates to `false`, further iteration is cancelled.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {function}      fn     Callback function
 */
export function eachContinue(array, fn) {
    var length = array.length;
    for (var i = 0; i < length; ++i) {
        if (!fn(array[i], i)) {
            break;
        }
    }
}
/**
 * Shifts an item at `index` towards beginning of the array.
 *
 * @param {ArrayLike<A>}  array  Source array
 * @param {number}        index  Target element index
 */
export function shiftLeft(array, index) {
    var length = array.length;
    for (var i = index; i < length; ++i) {
        array[i - index] = array[i];
    }
    array.length = length - index;
}
/**
 * Returns the last item of the array.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @returns {A}                    Last item
 */
export function last(array) {
    var length = array.length;
    return length ? array[length - 1] : undefined;
}
/**
 * Returns the first item of the array.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @returns {A}                    Last item
 */
export function first(array) {
    return array[0];
}
/**
 * Inserts `element` into `array` at `index`.
 *
 * Caps `index` to be between `0` and `array.length`
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item to insert
 * @param {ArrayLike<A>}  array    Index to insert item at
 */
export function insert(array, element, index) {
    //if (array) {
    index = $math.fitToRange(index, 0, array.length);
    array.splice(index, 0, element);
    //}
}
/**
 * Removes all copies of `element` from `array` (if they exist) and then
 * inserts `element` at `index`.
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item
 * @param {ArrayLike<A>}  array    Index to move item to
 */
export function setIndex(array, element, index) {
    remove(array, element);
    insert(array, element, index);
}
/**
 * Pushes all of the elements from `input` into `array`.
 *
 * @param {ArrayLike<A>}  array  Output array
 * @param {ArrayLike<A>}  input  Input array
 */
export function pushAll(array, input) {
    var length = input.length;
    for (var i = 0; i < length; ++i) {
        array.push(input[i]);
    }
}
/**
 * Removes `element` from `array`.
 *
 * If there are multiple copies of `element`, they are all removed.
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item to remove
 */
export function remove(array, element) {
    var found = false;
    if (array) {
        var index = void 0;
        while ((index = array.indexOf(element)) !== -1) {
            array.splice(index, 1);
            found = true;
        }
    }
    return found;
}
/**
 * Adds an `element` to `array`.
 *
 * If array already contains and item like this, it is removed before adding
 * it again.
 *
 * Optionally `toIndex` can be specified to add element at specific index.
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item to add
 * @param {ArrayLike<A>}  array    Index to move item to
 */
export function move(array, element, toIndex) {
    // @todo this implementation must be the same as the List.moveValue method
    // @todo don't do anything if the desired index is the same as the current index
    var index = indexOf(array, element);
    // @todo remove all old values rather than only the first ?
    if (index !== -1) {
        removeIndex(array, index);
    }
    if (toIndex == null) {
        array.push(element);
    }
    else {
        insertIndex(array, toIndex, element);
    }
}
/**
 * Inserts `element` into `array` at `index`.
 *
 * If `index` is not provided, it will insert `element` at the end of `array`.
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item to add
 * @param {ArrayLike<A>}  array    Index to add item at
 */
export function add(array, element, index) {
    // Append to the end if index is not set
    if (!$type.isNumber(index)) {
        array.push(element);
    }
    // Add to the beginning of array if index is 0
    else if (index === 0) {
        array.unshift(element);
    }
    // Add to indicated place if index is set
    else {
        array.splice(index, 0, element);
    }
}
/**
 * Removes `element` from `array` (if it exists) and then inserts `element` at
 * `index`.
 *
 * If `index` is not provided, it will insert `element` at the end of `array`.
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item to remove
 * @param {ArrayLike<A>}  array    Index to move item to
 */
export function replace(array, element, index) {
    // check if exists
    var ind = array.indexOf(element);
    // remove if exists
    if (ind !== -1) {
        array.splice(ind, 1);
    }
    // add to end if index is not set
    if (!$type.isNumber(index)) {
        array.push(element);
    }
    // add to indicated place if index is set
    else {
        array.splice(index, 0, element);
    }
}
/**
 * Wraps `input` in an array, if it isn't already an array.
 *
 * @param {Array<A> | A}  input  Source value
 * @return {Array<A>} An array
 */
export function toArray(input) {
    if (Array.isArray(input)) {
        return input;
    }
    else {
        return [input];
    }
}
/**
 * Returns `true` if `element` exists in `array`.
 *
 * @param   {ArrayLike<A>}  array    Source array
 * @param   {ArrayLike<A>}  element  Item to search for
 * @returns {boolean}                Item in array?
 */
export function has(array, element) {
    return indexOf(array, element) !== -1;
}
/**
 * Returns a shallow copy of `array`.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @returns {boolean}              Copy of the array
 */
export function copy(array) {
    var length = array.length;
    // It's faster to create the array with a pre-defined length
    var output = new Array(length);
    for (var i = 0; i < length; ++i) {
        // Because the array has a pre-defined length, we have to assign rather than push
        // This is also faster than pushing
        output[i] = array[i];
    }
    return output;
}
/**
 * Returns a copy of `array` which contains all the elements between `start`
 * and `end`. (including `start` and excluding `end`)
 *
 * If `end` is not provided, it defaults to `array.length`.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {number}        start  Start index
 * @param   {number}        end    End index
 * @returns {Array<A>}             Part of the array
 */
export function slice(array, start, end) {
    if (end === void 0) { end = array.length; }
    var output = new Array(end - start);
    for (var i = start; i < end; ++i) {
        output[i - start] = array[i];
    }
    return output;
}
/**
 * Inserts a value into array at specific index.
 *
 * @param {Array<A>}  array  Source array
 * @param {number}    index  Index
 * @param {A}         value  Value to insert
 */
export function insertIndex(array, index, value) {
    array.splice(index, 0, value);
}
/**
 * Removes a value from array at specific index.
 *
 * @param {Array<A>}  array  Source array
 * @param {number}    index  Index
 */
export function removeIndex(array, index) {
    array.splice(index, 1);
}
/**
 * Orders an array using specific `ordering` function and returns index of
 * the `value`.
 *
 * @ignore Exclude from docs
 * @param   {ArrayLike<A>}  array     Source array
 * @param   {function}      ordering  An ordering function
 * @param   {ArrayLike<A>}  value     Value to search for
 * @returns {SortResult}              Result of the search
 */
export function getSortedIndex(array, ordering, value) {
    var start = 0;
    var end = array.length;
    var found = false;
    while (start < end) {
        // TODO is this faster/slower than using Math.floor ?
        var pivot = (start + end) >> 1;
        var order = ordering(value, array[pivot]);
        // less
        if (order < 0) {
            end = pivot;
            // equal
        }
        else if (order === 0) {
            found = true;
            start = pivot + 1;
            // more
        }
        else {
            start = pivot + 1;
        }
    }
    return {
        found: found,
        index: (found ? start - 1 : start)
    };
}
/**
 * Searches the array using custom function and returns index of the item if
 * found.
 *
 * Will call `matches` function on all items of the array. If return value
 * evaluates to `true`, index is returned.
 *
 * Otherwise returns -1.
 *
 * @param   {ArrayLike<A>}  array    Source array
 * @param   {function}      matches  Search function
 * @returns {number}                 Index of the item if found
 */
export function findIndex(array, matches) {
    var length = array.length;
    for (var i = 0; i < length; ++i) {
        if (matches(array[i], i)) {
            return i;
        }
    }
    return -1;
}
/**
 * Searches the array using custom function and returns item if found.
 *
 * Will call `matches` function on all items of the array. If return value
 * evaluates to `true`, index is returned.
 *
 * Otherwise returns `undefined`.
 *
 * @param   {ArrayLike<A>}  array    Source array
 * @param   {function}      matches  Search function
 * @returns {number}                 Item if found
 */
export function find(array, matches) {
    var index = findIndex(array, matches);
    if (index !== -1) {
        return array[index];
    }
}
//# sourceMappingURL=Array.js.map