/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { EventDispatcher, AMEvent } from "./EventDispatcher";
import { Ordering } from "./Order";
import { IClone } from "./Clone";
import * as $array from "./Array";
import * as $iter from "./Iterator";
import * as $type from "./Type";

/**
 * Defines evends for [[SortedList]].
 */
export interface ISortedListEvents<A> {

	/**
	 * Invoked when new value is inserted into the list.
	 */
	inserted: {
		/**
		 * Index where the element was inserted.
		 */
		index: number;

		/**
		 * Inserted value.
		 */
		newValue: A;
	};

	/**
	 * Invoked when a value is removed from the list.
	 */
	removed: {
		/**
		 * Index of the element which was removed.
		 */
		index: number;

		/**
		 * Removed value.
		 */
		oldValue: A;
	};

}

/**
 * Ordered list contains values of any type in an indexed array.
 */
export class OrderedList<T> {

	/**
	 * Holds list values.
	 */
	protected _values: Array<T> = [];

	/**
	 * Event dispatcher.
	 */
	public events: EventDispatcher<AMEvent<OrderedList<T>, ISortedListEvents<T>>> = new EventDispatcher();

	/**
	 * Constructor
	 *
	 * @param initial  Inital list of values to add to list
	 */
	constructor(initial?: Array<T>) {
		if (initial != null) {
			this.setAll(initial);
		}
	}

	/**
	 * All items of the list.
	 *
	 * Do not modify the list directly. Rather use `insert()` and `remove()`
	 * methods.
	 *
	 * @return List values
	 */
	public get values(): Array<T> {
		return this._values;
	}

	/**
	 * Inserts a value into list item array.
	 *
	 * @param value  Value
	 */
	protected _insert(value: T): number {
		this._values.push(value);
		return this._values.length - 1;
	}

	/**
	 * Number of items in the list.
	 *
	 * @readonly
	 * @return Length
	 */
	public get length(): number {
		return this._values.length;
	}

	/**
	 * Returns the index of the specific `value`.
	 *
	 * -1 if not found.
	 *
	 * @param value  Value
	 * @return Index
	 */
	public indexOf(value: T): number {
		return $array.indexOf(this._values, value);
	}

	/**
	 * Checks if list contains the `value`.
	 *
	 * @param value  Value
	 * @return In the list?
	 */
	public contains(value: T): boolean {
		return this.indexOf(value) !== -1;
	}

	/**
	 * Returns an item at specific `index`.
	 *
	 * @param index  Index
	 * @return Item
	 */
	public getIndex(index: number): T | undefined {
		return this._values[index];
	}

	/**
	 * First item in the list.
	 *
	 * @return Item
	 */
	public get first(): T | undefined {
		return this._values[0];
	}

	/**
	 * Last item in the list.
	 *
	 * @return Item
	 */
	public get last(): T | undefined {
		return this._values[this._values.length - 1];
	}

	/**
	 * Inserts a value into list.
	 *
	 * @param value  Value
	 */
	public insert(value: T): void {
		const index = this._insert(value);

		if (this.events.isEnabled("inserted")) {
			this.events.dispatchImmediately("inserted", {
				type: "inserted",
				target: this,
				index: index,
				newValue: value
			});
		}
	}

	/**
	 * Removes an item with the `value` from the list.
	 *
	 * @param value  Value
	 */
	public remove(value: T): void {
		const index = this.indexOf(value);

		if (index !== -1) {
			const oldValue = this._values[index];

			$array.removeIndex(this._values, index);

			if (this.events.isEnabled("removed")) {
				this.events.dispatchImmediately("removed", {
					type: "removed",
					target: this,
					index: index,
					oldValue: oldValue,
				});
			}
		}
	}

	/**
	 * Sets multiple items to the list.
	 *
	 * All current items are removed.
	 *
	 * @param newArray  New items
	 */
	public setAll(newArray: Array<T>): void {
		$array.eachReverse(this._values, (x, i) => {
			this._values.pop();

			if (this.events.isEnabled("removed")) {
				this.events.dispatchImmediately("removed", {
					type: "removed",
					target: this,
					index: i,
					oldValue: x
				});
			}
		});

		$array.each(newArray, (value) => {
			this.insert(value);
		});
	}

	/**
	 * Removes all items from the list.
	 */
	public clear(): void {
		this.setAll([]);
	}

	/**
	 * Returns part of the list between `start` and `end` indexes, as a new
	 * [[OrderedList]].
	 *
	 * @param start  Start index
	 * @param end    End index
	 * @return Items in range
	 */
	public slice(start: number, end: number): OrderedList<T> {
		const out = new OrderedList<T>();

		out._values = this._values.slice(start, end);

		return out;
	}

	/**
	 * Finds a closest available index to the `value` in specified direction.
	 *
	 * @ignore exclude from docs
	 * @param value      value to search for
	 * @param fn         A callback function that returns value of the item
	 * @param direction  Direciton
	 * @return Index
	 */
	public findClosestIndex(value: number, fn: (value: T) => number, direction: "left" | "right" | "any" = "any"): number {
		// Init temporary values
		let closestIndex: number = -1;
		let closestValue: number;
		let closestDifference: number;

		let i = 0;

		$iter.eachContinue(this.iterator(), (element) => {
			const item: number = fn(element);

			// Calc difference
			if (direction === "any") {

				// Exact match?
				if (item === value) {
					// Found exact value - don't bother searching further
					closestIndex = i;
					return false;
				}

				let difference = Math.abs(value - item);
				if (!$type.hasValue(closestDifference) || (closestDifference > difference)) {
					closestIndex = i;
					closestValue = item;
					closestDifference = difference;
				}
			}
			else if (direction === "left" && (item < value)) {
				if (!$type.hasValue(closestValue) || (closestValue < item)) {
					closestIndex = i;
					closestValue = item;
				}
			}
			else if (direction === "right" && (item >= value)) {
				if (!$type.hasValue(closestValue) || (closestValue >= item)) {
					closestIndex = i;
					closestValue = item;
				}
			}

			++i;
			return true;
		});

		// Found nothing?
		if (closestIndex === -1) {
			if (direction === "left") {
				// Use First one
				closestIndex = 0;
			}
			else if (direction === "right") {
				// Use last item
				closestIndex = this.length - 1;
			}
		}

		return closestIndex;
	}

	/**
	 * Returns a list iterator.
	 *
	 * @return Iterator
	 */
	public iterator(): $iter.Iterator<T> {
		return $iter.fromArray(this._values);
	}

	/**
	 * Returns an ES6 iterator for the list.
	 */
	public *[Symbol.iterator](): Iterator<T> {
		const length = this._values.length;

		for (let i = 0; i < length; ++i) {
			yield this._values[i];
		}
	}

	/**
	 * Calls `f` for each element in the list.
	 */
	public each(f: (value: T, index: number) => void): void {
		$array.each(this._values, f);
	}
}

/**
 * A list where all items are ordered according to specific ordering function,
 * which is passed in via constructor parameter, when creating an instance of
 * [[SortedList]].
 */
export class SortedList<T> extends OrderedList<T> {

	/**
	 * A reference to the ordering function.
	 */
	private _ordering: any;

	/**
	 * Constructor.
	 *
	 * @param sort  Ordering function
	 */
	constructor(sort: (left: T, right: T) => Ordering) {
		super();
		this._ordering = sort;
	}

	/**
	 * Inserts item into the list.
	 *
	 * @param value  Item
	 */
	protected _insert(value: T): number {
		const { index } = $array.getSortedIndex(this._values, this._ordering, value);

		$array.insertIndex(this._values, index, value);

		return index;
	}

	/**
	 * Returns index of the item in list if found.
	 *
	 * -1 if item is not in the list.
	 *
	 * @param value  Item to search for
	 * @return Index
	 */
	public indexOf(value: T): number {
		const { found, index } = $array.getSortedIndex(this._values, this._ordering, value);

		if (found) {
			return index;

		} else {
			return -1;
		}
	}

	/**
	 * [udpate description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param value [description]
	 */
	public update(value: T): void {
		// @todo test this
		const index = $array.indexOf(this._values, value);

		// @todo throw an error if it doesn't exist ?
		if (index !== -1) {
			const last = this._values.length - 1;

			// Check if the current ordering is correct
			if (!((index === 0 || this._ordering(this._values[index - 1], value) < 0) &&
				(index === last || this._ordering(value, this._values[index + 1]) < 0))) {
				// TODO send remove/insert/move events
				$array.removeIndex(this._values, index);
				this._insert(value);
			}
		}
	}

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
export class OrderedListTemplate<T extends IClone<T> & { isTemplate: boolean }> extends OrderedList<T> {

	/**
	 * A template object.
	 *
	 * @todo Make this private
	 */
	public _template!: T;

	/**
	 * Constructor
	 *
	 * @param t Template object
	 */
	public constructor(t: T) {
		super();
		this.template = t;
	}

	/**
	 * A "template" object to copy all properties from when creating new list
	 * items.
	 *
	 * @param v  Template object
	 */
	public set template(v: T) {
		v.isTemplate = true;
		this._template = v;
	}

	/**
	 * @return Template object
	 */
	public get template(): T {
		return this._template;
	}

	/**
	 * Copies all elements from other list.
	 *
	 * @param source  Source list
	 */
	public copyFrom(source: this): void {
		$iter.each(source.iterator(), (value) => {
			this.insert(value.clone());
		});
	}

	/**
	 * Returns part of the list, starting at `start` and ending at `end` indexes,
	 * as a new [[OrderedListTemplate]].
	 *
	 * @param start  Start index
	 * @param end    End index
	 * @return New list
	 */
	public slice(start: number, end: number): OrderedListTemplate<T> {
		const out = new OrderedListTemplate<T>(this.template);

		out._values = this._values.slice(start, end);

		return out;
	}

	/**
	 * Instantiates a new object of the specified type, adds it to the end of
	 * the list, and returns it.
	 *
	 * @param make  Item type to use. Will use the default type for the list if not specified.
	 * @return      Newly created item
	 */
	public create<T>(make: { new(): T; }): T;
	public create(): T;
	public create(make?: { new(): T; }): T {
		const clone =
			(make != null
				? new make()
				: this.template.clone());

		this.insert(clone);

		return clone;
	}
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
export class SortedListTemplate<T extends IClone<T> & { isTemplate: boolean }> extends SortedList<T> {

	// @todo code duplication

	/**
	 * A template object.
	 *
	 * @todo Make this private
	 */
	public _template!: T;

	/**
	 * Constructor
	 *
	 * @param t     Template object
	 * @param sort  Ordering function
	 */
	public constructor(t: T, sort: (left: T, right: T) => Ordering) {
		super(sort);
		this.template = t;
	}

	/**
	 * A "template" object to copy all properties from when creating new list
	 * items.
	 *
	 * @param v  Template object
	 */
	public set template(v: T) {
		v.isTemplate = true;
		this._template = v;
	}

	/**
	 * @return Template object
	 */
	public get template(): T {
		return this._template;
	}

	/**
	 * Copies all elements from other list.
	 *
	 * @param source  Source list
	 */
	public copyFrom(source: this): void {
		$iter.each(source.iterator(), (value) => {
			this.insert(value.clone());
		});
	}

	/**
	 * Instantiates a new object of the specified type, adds it to the end of
	 * the list, and returns it.
	 *
	 * @param make  Item type to use. Will use the default type for the list if not specified.
	 * @return      Newly created item
	 */
	public create<T>(make: { new(): T; }): T;
	public create(): T;
	public create(make?: { new(): T; }): T {
		const clone =
			(make != null
				? new make()
				: this.template.clone());

		this.insert(clone);

		return clone;
	}

}
