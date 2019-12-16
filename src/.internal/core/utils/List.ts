/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IClone } from "./Clone";
import { Disposer, MultiDisposer, IDisposer } from "./Disposer";
import { EventDispatcher, AMEvent } from "./EventDispatcher";
import { Ordering } from "./Order";
import * as $array from "./Array";
import * as $iter from "./Iterator";
import * as $type from "./Type";

/**
 * @todo Description
 */
export class IndexedIterable<A> {

	/**
	 * Item list
	 */
	private _array: Array<A>;

	/**
	 * Start index.
	 */
	private _start: number;

	/**
	 * End index.
	 */
	private _end: number;

	/**
	 * Constructor.
	 *
	 * @param array  List items
	 * @param start  Start index
	 * @param end    End index
	 */
	constructor(array: Array<A>, start: number, end: number) {
		this._array = array;
		this._start = start;
		this._end = end;
	}

	/**
	 * Returns a list item iterator.
	 *
	 * @return Iterator
	 */
	public iterator(): $iter.Iterator<A> {
		return (push) => {
			if (this._start !== this._end) {
				if (this._start < this._end) {
					for (let i = this._start; i < this._end; ++i) {
						if (!push(this._array[i])) {
							break;
						}
					}

				} else {
					for (let i = this._start - 1; i >= this._end; --i) {
						if (!push(this._array[i])) {
							break;
						}
					}
				}
			}
		};
	}

	/**
	 * Returns an interable list sorted backwards than current list.
	 *
	 * @return List
	 */
	public backwards(): IndexedIterable<A> {
		return new IndexedIterable(this._array, this._end, this._start);
	}

	/**
	 * Returns a new list consisting only of specific range of items between
	 * `start` and `end` indexes.
	 *
	 * @param start  Start index
	 * @param end    End index
	 * @return List
	 */
	public range(start: number, end: number): IndexedIterable<A> {
		if (start <= end) {
			if (this._start === this._end) {
				return this;

			} else if (this._start < this._end) {
				const diff = end - start;

				start = Math.max(this._start + start, this._start);
				end = Math.min(start + diff, this._end);

				return new IndexedIterable(this._array, start, end);

			} else {
				const diff = end - start;

				start = Math.max(this._start - start, this._end);
				end = Math.max(start - diff, this._end);

				return new IndexedIterable(this._array, start, end);
			}

		} else {
			throw new Error("Start index must be lower than end index");
		}
	}

}

/**
 * Defines events for the [[List]].
 */
export interface IListEvents<A> {
	/**
	 * Invoked when item is added to the list.
	 *
	 * @todo remove this later?
	 */
	inserted: {
		newValue: A;
	};

	/**
	 * Invoked when item is removed from the list.
	 *
	 * @todo remove this later?
	 */
	removed: {
		oldValue: A;
	};

	/**
	 * Invoked when `setAll` method is called.
	 */
	setAll: {
		oldArray: Array<A>;
		newArray: Array<A>;
	};

	/**
	 * Invoked when `insertIndex` method is called.
	 */
	insertIndex: {
		index: number;
		newValue: A;
	};

	/**
	 * Invoked when `setIndex` method is called.
	 */
	setIndex: {
		index: number;
		oldValue: A;
		newValue: A;
	};

	/**
	 * Invoked when item is removed.
	 */
	removeIndex: {
		index: number;
		oldValue: A;
	};

}

/**
 * ListGrouper organizes [[List]] items into groups.
 *
 * @ignore Exclude from docs
 */
export class ListGrouper<A> extends MultiDisposer {

	/**
	 * Function that can be used to extract a "value" of the list element.
	 *
	 * Used for ordering.
	 */
	private _getKey: (value: A) => number;

	/**
	 * A function that  is used to order list groups.
	 */
	private _sort: (left: number, right: number) => Ordering;

	/**
	 * Grouping keys.
	 */
	private _keys: Array<number> = [];

	/**
	 * List item groups.
	 */
	private _groups: { [key: number]: Array<A> } = {};

	/**
	 * Inserts an item (`x`) to a specific group (`key`) and specific `index`.
	 *
	 * @param x      Item
	 * @param key    Group name
	 * @param index  Index
	 */
	private _insert(x: A, key: number, index?: number): void {
		if (this._groups[key] == null) {
			this._groups[key] = [];

			// TODO code duplication with SortedList
			const { found, index } = $array.getSortedIndex(this._keys, this._sort, key);

			if (found) {
				throw new Error("Key already exists: " + key);

			} else {
				$array.insertIndex(this._keys, index, key);
			}
		}

		if (index == null) {
			this._groups[key].push(x);

		} else {
			$array.insertIndex(this._groups[key], index, x);
		}
	}

	/**
	 * Removes an item from the list.
	 *
	 * @param x Item to remove
	 */
	private _remove(x: A): void {
		const key = this._getKey(x);

		const values = this._groups[key];

		if (values != null) {
			$array.remove(values, x);

			if (values.length === 0) {
				delete this._groups[key];

				const { found, index } = $array.getSortedIndex(this._keys, this._sort, key);

				if (found) {
					$array.removeIndex(this._keys, index);

				} else {
					throw new Error("Key doesn't exist: " + key);
				}
			}
		}
	}

	/**
	 * Constructor.
	 */
	constructor(
		list: $iter.Iterable<A> & {
			events: EventDispatcher<{
				inserted: { newValue: A },
				removed: { oldValue: A }
			}>;
		},
		getKey: (value: A) => number,
		sort: (left: number, right: number) => Ordering
	) {
		super([
			list.events.on("inserted", (x) => {
				const value = x.newValue;
				const key = this._getKey(value);

				let index = 0;

				$iter.eachContinue(list.iterator(), (x) => {
					if (x === value) {
						return false;

					} else if (this._getKey(x) === key) {
						++index;
					}

					return true;
				});

				this._insert(value, key, index);
			}, undefined, false),

			list.events.on("removed", (x) => {
				this._remove(x.oldValue);
			}, undefined, false)
		]);

		this._getKey = getKey;
		this._sort = sort;

		$iter.each(list.iterator(), (x) => {
			this._insert(x, getKey(x));
		});
	}

	/**
	 * Returns an iterator for the list.
	 *
	 * The iterator will iterate through all items in all groups.
	 *
	 * @return Iterator
	 */
	public iterator(): $iter.Iterator<A> {
		return $iter.flatten($iter.map($iter.fromArray(this._keys), (key) => {
			return $iter.fromArray(this._groups[key]);
		}));
	}

}

/**
 * @todo Description
 * @ignore Exclude from docs
 */
export type ListLike<A> = $iter.Iterable<A> & {
	events: EventDispatcher<{ removed: { oldValue: A } }>;
};

/**
 * A disposable list, which when disposed itself will call `dispose()` method
 * on all its items.
 */
export class ListDisposer<A extends IDisposer> extends Disposer {
	constructor(list: ListLike<A>) {
		const disposer = list.events.on("removed", (x) => {
			x.oldValue.dispose();
		}, undefined, false);

		super(() => {
			disposer.dispose();

			// TODO clear the list ?
			$iter.each(list.iterator(), (x) => {
				x.dispose();
			});
		});
	}
}

/**
 * Checks if specific index fits into length.
 *
 * @param index  Index
 * @param len    Length
 */
function checkBounds(index: number, len: number): void {
	if (!(index >= 0 && index < len)) {
		throw new Error("Index out of bounds: " + index);
	}
}


/**
 * A List class is used to hold a number of indexed items of the same type.
 */
export class List<T> {

	/**
	 * List values.
	 */
	private _values: Array<T>;

	/**
	 * Event dispatcher.
	 */
	public events: EventDispatcher<AMEvent<this, IListEvents<T>>> = new EventDispatcher();

	/**
	 * Constructor
	 *
	 * @param initial  Inital list of values to add to list
	 */
	constructor(initial: Array<T> = []) {
		this._values = initial;
	}

	/**
	 * An array of values in the list.
	 *
	 * Do not use this property to add values. Rather use dedicated methods, like
	 * `push()`, `removeIndex()`, etc.
	 *
	 * @readonly
	 * @return List values
	 */
	public get values(): Array<T> {
		return this._values;
	}

	/**
	 * Checks if list contains specific item reference.
	 *
	 * @param item  Item to search for
	 * @return `true` if found, `false` if not found
	 */
	public contains(value: T): boolean {
		return this._values.indexOf(value) !== -1;
	}

	/**
	 * Removes specific item from the list.
	 *
	 * @param item An item to remove
	 */
	public removeValue(value: T): void {
		let i = 0;
		let length = this._values.length;

		while (i < length) {
			// TODO handle NaN
			if (this._values[i] === value) {
				this.removeIndex(i);
				--length;

			} else {
				++i;
			}
		}
	}

	/**
	 * Searches the list for specific item and returns its index.
	 *
	 * @param item  An item to search for
	 * @return Index or -1 if not found
	 */
	public indexOf(value: T): number {
		return $array.indexOf(this._values, value);
	}

	/**
	 * Number of items in list.
	 *
	 * @readonly
	 * @return Number of items
	 */
	public get length(): number {
		return this._values.length;
	}

	/**
	 * Checks if there's a value at specific index.
	 *
	 * @param index  Index
	 * @return Value exists?
	 */
	public hasIndex(index: number): boolean {
		return index >= 0 && index < this._values.length;
	}

	/**
	 * Returns an item at specified index.
	 *
	 * @param index  Index
	 * @return List item
	 */
	public getIndex(index: number): T | undefined {
		return this._values[index];
	}

	/**
	 * Sets value at specific index.
	 *
	 * If there's already a value at the index, it is overwritten.
	 *
	 * @param index  Index
	 * @param value  New value
	 * @return New value
	 */
	public setIndex(index: number, value: T): T {
		checkBounds(index, this._values.length);

		const oldValue = this._values[index];

		// Do nothing if the old value and the new value are the same
		if (oldValue !== value) {
			this._values[index] = value;

			if (this.events.isEnabled("setIndex")) {
				this.events.dispatchImmediately("setIndex", {
					type: "setIndex",
					target: this,
					index: index,
					oldValue: oldValue,
					newValue: value
				});
			}

			if (this.events.isEnabled("removed")) {
				this.events.dispatchImmediately("removed", {
					type: "removed",
					target: this,
					oldValue: oldValue
				});
			}

			if (this.events.isEnabled("inserted")) {
				this.events.dispatchImmediately("inserted", {
					type: "inserted",
					target: this,
					newValue: value
				});
			}
		}

		return oldValue;
	}

	/**
	 * Adds an item to the list at a specific index, which pushes all the other
	 * items further down the list.
	 *
	 * @param index Index
	 * @param item  An item to add
	 */
	public insertIndex(index: number, value: T): void {
		checkBounds(index, this._values.length + 1);

		$array.insertIndex(this._values, index, value);

		if (this.events.isEnabled("insertIndex")) {
			this.events.dispatchImmediately("insertIndex", {
				type: "insertIndex",
				target: this,
				index: index,
				newValue: value
			});
		}

		if (this.events.isEnabled("inserted")) {
			this.events.dispatchImmediately("inserted", {
				type: "inserted",
				target: this,
				newValue: value
			});
		}
	}

	/**
	 * [_sortQuicksort description]
	 *
	 * @todo Description
	 * @param low    [description]
	 * @param high   [description]
	 * @param order  [description]
	 */
	private _sortQuicksort(low: number, high: number, order: (left: T, right: T) => Ordering): void {
		if (low < high) {
			const p = this._sortPartition(low, high, order);
			this._sortQuicksort(low, p, order);
			this._sortQuicksort(p + 1, high, order);
		}
	}

	/**
	 * [_sortPartition description]
	 *
	 * @todo Description
	 * @param low    [description]
	 * @param high   [description]
	 * @param order  [description]
	 * @return [description]
	 */
	private _sortPartition(low: number, high: number, order: (left: T, right: T) => Ordering): number {
		const values = this._values;
		const pivot = values[low];

		let i = low - 1;
		let j = high + 1;

		for (; ;) {
			do {
				++i;
			} while (order(values[i], pivot) < 0);

			do {
				--j;
			} while (order(values[j], pivot) > 0);

			if (i >= j) {
				return j;

			} else {
				this.swap(i, j);
			}
		}
	}

	/**
	 * Reorders list items according to specific ordering function.
	 *
	 * @param order  Ordering function
	 */
	public sort(order: (left: T, right: T) => Ordering): void {
		// https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme
		// @todo faster implementation of this
		// @todo test this
		this._sortQuicksort(0, this._values.length - 1, order);
	}

	/**
	 * Swaps indexes of two items in the list.
	 *
	 * @param a  Item 1
	 * @param b  Item 2
	 */
	public swap(a: number, b: number): void {
		const len = this._values.length;

		checkBounds(a, len);
		checkBounds(b, len);

		if (a !== b) {
			const value_a = this._values[a];
			const value_b = this._values[b];

			this._values[a] = value_b;

			if (this.events.isEnabled("setIndex")) {
				this.events.dispatchImmediately("setIndex", {
					type: "setIndex",
					target: this,
					index: a,
					oldValue: value_a,
					newValue: value_b
				});
			}

			this._values[b] = value_a;

			if (this.events.isEnabled("setIndex")) {
				this.events.dispatchImmediately("setIndex", {
					type: "setIndex",
					target: this,
					index: b,
					oldValue: value_b,
					newValue: value_a
				});
			}
		}
	}

	/**
	 * Removes a value at specific index.
	 *
	 * @param index  Index of value to remove
	 * @return Removed value
	 */
	public removeIndex(index: number): T {
		checkBounds(index, this._values.length);

		const oldValue = this._values[index];

		$array.removeIndex(this._values, index);

		if (this.events.isEnabled("removeIndex")) {
			this.events.dispatchImmediately("removeIndex", {
				type: "removeIndex",
				target: this,
				index: index,
				oldValue: oldValue
			});
		}

		if (this.events.isEnabled("removed")) {
			this.events.dispatchImmediately("removed", {
				type: "removed",
				target: this,
				oldValue: oldValue
			});
		}

		return oldValue;
	}

	/**
	 * Moves an item to a specific index within the list.
	 *
	 * If the index is not specified it will move the item to the end of the
	 * list.
	 *
	 * @param value  Item to move
	 * @param index  Index to place item at
	 */
	public moveValue(value: T, toIndex?: number): void {
		// TODO don't do anything if the desired index is the same as the current index
		let index = this.indexOf(value);

		// TODO remove all old values rather than only the first ?
		if (index !== -1) {
			const oldValue = this._values[index];

			$array.removeIndex(this._values, index);

			if (this.events.isEnabled("removeIndex")) {
				this.events.dispatchImmediately("removeIndex", {
					type: "removeIndex",
					target: this,
					index: index,
					oldValue: oldValue
				});
			}
		}

		if (toIndex == null) {
			toIndex = this._values.length;
			this._values.push(value);

		} else {
			$array.insertIndex(this._values, toIndex, value);
		}

		if (this.events.isEnabled("insertIndex")) {
			this.events.dispatchImmediately("insertIndex", {
				type: "insertIndex",
				target: this,
				index: toIndex,
				newValue: value
			});
		}

		if (index === -1) {
			if (this.events.isEnabled("inserted")) {
				this.events.dispatchImmediately("inserted", {
					type: "inserted",
					target: this,
					newValue: value
				});
			}
		}
	}

	/**
	 * Adds an item to the end of the list.
	 *
	 * @param item  An item to add
	 */
	public push<K extends T>(value: K): K {
		const index = this._values.push(value) - 1;

		if (this.events.isEnabled("insertIndex")) {
			this.events.dispatchImmediately("insertIndex", {
				type: "insertIndex",
				target: this,
				index: index,
				newValue: value
			});
		}

		if (this.events.isEnabled("inserted")) {
			this.events.dispatchImmediately("inserted", {
				type: "inserted",
				target: this,
				newValue: value
			});
		}

		return value;
	}

	/**
	 * Adds an item as a first item in the list.
	 *
	 * @param item  An item to add
	 */
	public unshift(value: T): void {
		this.insertIndex(0, value);
	}

	/**
	 * Adds multiple items to the list.
	 *
	 * @param items  An Array of items to add
	 */
	public pushAll(values: Array<T>): void {
		$array.each(values, (value) => {
			this.push(value);
		});
	}

	/**
	 * Copies and adds items from abother list.
	 *
	 * @param source  A list top copy items from
	 */
	public copyFrom(source: this): void {
		this.pushAll(source._values);
	}

	/**
	 * Returns the last item from the list, and removes it.
	 *
	 * @return Item
	 */
	public pop(): $type.Optional<T> {
		let index = this._values.length - 1;
		return index < 0 ? undefined : this.removeIndex(this._values.length - 1);
	}

	/**
	 * Returns the first item from the list, and removes it.
	 *
	 * @return Item
	 */
	public shift(): $type.Optional<T> {
		return this._values.length ? this.removeIndex(0) : undefined;
	}

	/**
	 * Sets multiple items to the list.
	 *
	 * All current items are removed.
	 *
	 * @param newArray  New items
	 */
	public setAll(newArray: Array<T>): void {
		// @tod if a value exists in both the new and old arrays, don't send remove/insert events
		const oldArray = $array.copy(this._values);

		this._values.length = 0;

		$array.each(newArray, (value) => {
			this._values.push(value);
		});

		if (this.events.isEnabled("setAll")) {
			this.events.dispatchImmediately("setAll", {
				type: "setAll",
				target: this,
				oldArray: oldArray,
				newArray: this._values // TODO make a copy ?
			});
		}

		if (this.events.isEnabled("removed")) {
			$array.each(oldArray, (x) => {
				this.events.dispatchImmediately("removed", {
					type: "removed",
					target: this,
					oldValue: x
				});
			});
		}

		if (this.events.isEnabled("inserted")) {
			$array.each(this._values, (x) => {
				this.events.dispatchImmediately("inserted", {
					type: "inserted",
					target: this,
					newValue: x
				});
			});
		}
	}

	/**
	 * Removes all items from the list.
	 */
	public clear(): void {
		this.setAll([]);
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
	 *
	 * `f` should have at least one parameter defined which will get a current
	 * item, with optional second argument - index.
	 */
	public each(f: (value: T, index: number) => void): void {
		$array.each(this._values, f);
	}

	/**
	 * Returns a specific range of list items, which can be iterated.
	 *
	 * @ignore Exclude from docs
	 * @todo Code duplication with IndexedIterable
	 * @param start  Start index
	 * @param end    End index
	 * @return Range
	 */
	public range(start: number, end: number): IndexedIterable<T> {
		if (start <= end) {
			const diff = end - start;

			start = Math.max(start, 0);
			end = Math.min(start + diff, this._values.length);

			return new IndexedIterable(this._values, start, end);

		} else {
			throw new Error("Start index must be lower than end index");
		}
	}

	/**
	 * Returns an iterator that has list items sorted backwards.
	 *
	 * @ignore Exclude from docs
	 * @return List
	 */
	public backwards(): IndexedIterable<T> {
		return new IndexedIterable(this._values, this._values.length, 0);
	}

}

/**
 * A version of a [[List]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
export class ListTemplate<T extends IClone<T> & { isTemplate: boolean }> extends List<T> implements IClone<ListTemplate<T>> {
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
			this.push(value.clone());
		});
	}

	/**
	 * Instantiates a new object of the specified type, adds it to the end of
	 * the list, and returns it.
	 *
	 * @param make  Item type to use. Will use the default type for the list if not specified.
	 * @return      Newly created item
	 */
	public create(make: { new(): T; }): T;
	public create(): T;
	public create(make?: { new(): T; }): T {
		const clone =
			(make != null
				? new make()
				: this.template.clone());

		this.push(clone);

		return clone;
	}

	/**
	 * Creates an exact clone of the list, including its items and template.
	 *
	 * @return New list
	 */
	public clone(): ListTemplate<T> {
		const out = new ListTemplate(this.template);

		const values = this.values;

		const length = values.length;

		for (let i = 0; i < length; ++i) {
			out.push(values[i].clone());
		}

		return out;
	}

}
