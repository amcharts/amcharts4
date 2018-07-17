/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { EventDispatcher, AMEvent } from "./EventDispatcher";
import { Ordering } from "./Order";
import { IClone } from "./Clone";
import * as $iter from "./Iterator";
/**
 * Defines evends for [[SortedList]].
 */
export interface ISortedListEvents<A> {
    /**
     * Invoked when new value is inserted into the list.
     */
    inserted: {
        /**
         * Inserted value.
         *
         * @type {A}
         */
        newValue: A;
    };
    /**
     * Invoked when a value is removed from the list.
     */
    removed: {
        /**
         * Removed value.
         *
         * @type {A}
         */
        oldValue: A;
    };
}
/**
 * Ordered list contains values of any type in an indexed array.
 */
export declare class OrderedList<T> {
    /**
     * Holds list values.
     *
     * @type {Array<T>}
     */
    protected _values: Array<T>;
    /**
     * Event dispatcher.
     *
     * @type {EventDispatcher<AMEvent<this, ISortedListEvents<T>>>}
     */
    events: EventDispatcher<AMEvent<this, ISortedListEvents<T>>>;
    /**
     * Constructor
     *
     * @param {Array<T>}  initial  Inital list of values to add to list
     */
    constructor(initial?: Array<T>);
    /**
     * All items of the list.
     *
     * Do not modify the list directly. Rather use `insert()` and `remove()`
     * methods.
     *
     * @return {Array<T>} List values
     */
    readonly values: Array<T>;
    /**
     * Inserts a value into list item array.
     *
     * @param {T}  value  Value
     */
    protected _insert(value: T): void;
    /**
     * Number of items in the list.
     *
     * @readonly
     * @return {number} Length
     */
    readonly length: number;
    /**
     * Returns the index of the specific `value`.
     *
     * -1 if not found.
     *
     * @param  {T}       value  Value
     * @return {number}        Index
     */
    indexOf(value: T): number;
    /**
     * Checks if list contains the `value`.
     *
     * @param  {T}        value  Value
     * @return {boolean}         In the list?
     */
    contains(value: T): boolean;
    /**
     * Returns an item at specific `index`.
     *
     * @param  {number}  index  Index
     * @return {T}              Item
     */
    getIndex(index: number): T | undefined;
    /**
     * First item in the list.
     *
     * @return {T} Item
     */
    readonly first: T | undefined;
    /**
     * Last item in the list.
     *
     * @return {T} Item
     */
    readonly last: T | undefined;
    /**
     * Inserts a value into list.
     *
     * @param {T}  value  Value
     */
    insert(value: T): void;
    /**
     * Removes an item with the `value` from the list.
     *
     * @param {T}  value  Value
     */
    remove(value: T): void;
    /**
     * Sets multiple items to the list.
     *
     * All current items are removed.
     *
     * @param {Array<T>}  newArray  New items
     */
    setAll(newArray: Array<T>): void;
    /**
     * Removes all items from the list.
     */
    clear(): void;
    /**
     * Returns part of the list between `start` and `end` indexes, as a new
     * [[OrderedList]].
     *
     * @param  {number}          start  Start index
     * @param  {number}          end    End index
     * @return {OrderedList<T>}         Items in range
     */
    slice(start: number, end: number): OrderedList<T>;
    /**
     * Finds a closest available index to the `value` in specified direction.
     *
     * @ignore exclude from docs
     * @param  {number}                      value      value to search for
     * @param  {function}                    fn         A callback function that returns value of the item
     * @param  {"left" | "right" |  "any" }  direction  Direciton
     * @return {number}                                 Index
     */
    findClosestIndex(value: number, fn: (value: T) => number, direction?: "left" | "right" | "any"): number;
    /**
     * Returns a list iterator.
     *
     * @return {Iterator} Iterator
     */
    iterator(): $iter.Iterator<T>;
    /**
     * Returns an ES6 iterator for the list.
     */
    [Symbol.iterator](): Iterator<T>;
    /**
     * Calls `f` for each element in the list.
     */
    each(f: (value: T) => void): void;
}
/**
 * A list where all items are ordered according to specific ordering function,
 * which is passed in via constructor parameter, when creating an instance of
 * [[SortedList]].
 */
export declare class SortedList<T> extends OrderedList<T> {
    /**
     * A reference to the ordering function.
     *
     * @type {T}
     */
    private _ordering;
    /**
     * Constructor.
     *
     * @param {T) => Ordering}  sort  Ordering function
     */
    constructor(sort: (left: T, right: T) => Ordering);
    /**
     * Inserts item into the list.
     *
     * @param {T}  value  Item
     */
    protected _insert(value: T): void;
    /**
     * Returns index of the item in list if found.
     *
     * -1 if item is not in the list.
     *
     * @param  {T}       value  Item to search for
     * @return {number}         Index
     */
    indexOf(value: T): number;
    /**
     * [udpate description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {T} value [description]
     */
    update(value: T): void;
}
/**
 * A version of a [[OrderedList]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
export declare class OrderedListTemplate<T extends IClone<T> & {
    isTemplate: boolean;
}> extends OrderedList<T> {
    /**
     * A template object.
     *
     * @todo Make this private
     * @type {T}
     */
    _template: T;
    /**
     * Constructor
     *
     * @param {T} t Template object
     */
    constructor(t: T);
    /**
     * @return {T} Template object
     */
    /**
     * A "template" object to copy all properties from when creating new list
     * items.
     *
     * @param {T}  v  Template object
     */
    template: T;
    /**
     * Copies all elements from other list.
     *
     * @param {OrderedListTemplate}  source  Source list
     */
    copyFrom(source: this): void;
    /**
     * Returns part of the list, starting at `start` and ending at `end` indexes,
     * as a new [[OrderedListTemplate]].
     *
     * @param  {number}                  start  Start index
     * @param  {number}                  end    End index
     * @return {OrderedListTemplate<T>}         New list
     */
    slice(start: number, end: number): OrderedListTemplate<T>;
    /**
     * Instantiates a new object of the specified type, adds it to the end of
     * the list, and returns it.
     *
     * @param make  Item type to use. Will use the default type for the list if not specified.
     * @return      Newly created item
     */
    create<T>(make: {
        new (): T;
    }): T;
    create(): T;
}
/**
 * A version of a [[SortedList]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
export declare class SortedListTemplate<T extends IClone<T> & {
    isTemplate: boolean;
}> extends SortedList<T> {
    /**
     * A template object.
     *
     * @todo Make this private
     * @type {T}
     */
    _template: T;
    /**
     * Constructor
     *
     * @param {T}         t     Template object
     * @param {function}  sort  Ordering function
     */
    constructor(t: T, sort: (left: T, right: T) => Ordering);
    /**
     * @return {T} Template object
     */
    /**
     * A "template" object to copy all properties from when creating new list
     * items.
     *
     * @param {T}  v  Template object
     */
    template: T;
    /**
     * Copies all elements from other list.
     *
     * @param {SortedListTemplate}  source  Source list
     */
    copyFrom(source: this): void;
    /**
     * Instantiates a new object of the specified type, adds it to the end of
     * the list, and returns it.
     *
     * @param make  Item type to use. Will use the default type for the list if not specified.
     * @return      Newly created item
     */
    create<T>(make: {
        new (): T;
    }): T;
    create(): T;
}
