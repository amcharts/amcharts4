/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IDisposer, Disposer } from "./Disposer";
import { EventDispatcher, AMEvent } from "./EventDispatcher";
import { Optional } from "./Type";
import { IClone } from "./Clone";
import * as $object from "./Object";
import * as $iter from "./Iterator";
import * as $string from "./String";

/**
 * Defines events from [[Dictionary]].
 */
export interface IDictionaryEvents<Key, Value> {

	/**
	 * Invoked when an item is removed from the dictionary.
	 */
	removed: {

		/**
		 * Removed value.
		 */
		oldValue: Value;

	};

	/**
	 * Invoked when dictionary is cleared.
	 */
	cleared: {};

	/**
	 * Invoked when `insertKey()` method is called.
	 */
	insertKey: {

		/**
		 * Key.
		 */
		key: Key;

		/**
		 * Added value.
		 */
		newValue: Value;

	};

	/**
	 * Invoked when `setKey()` method is called.
	 */
	setKey: {

		/**
		 * Key.
		 */
		key: Key;

		/**
		 * Removed value. (if overwriting)
		 */
		oldValue: Value;

		/**
		 * Added value.
		 */
		newValue: Value;

	};

	/**
	 * Invoked when `removeKey()` method is called.
	 */
	removeKey: {

		/**
		 * Key.
		 */
		key: Key;

		/**
		 * Removed value.
		 */
		oldValue: Value;

	};

}

/**
 * [K description]
 *
 * @ignore Exclude from docs
 * @todo Descirption
 */
export type DictionaryLike<K, A> = $iter.Iterable<[K, A]> & {
	events: EventDispatcher<{ removed: { oldValue: A } }>;
};

/**
 * A disposable dictionary, which when disposed itself will call `dispose()`
 * method on all its items.
 */
export class DictionaryDisposer<K, A extends IDisposer> extends Disposer {
	constructor(dict: DictionaryLike<K, A>) {
		const disposer = dict.events.on("removed", (x) => {
			x.oldValue.dispose();
		}, undefined, false);

		super(() => {
			disposer.dispose();

			// TODO clear the dictionary ?
			$iter.each(dict.iterator(), (a) => {
				const v = a[1];
				v.dispose();
			});
		});
	}
}

/**
 * A Dictionary is collection where values of some type can be mapped to
 * string keys.
 *
 * You might call it an "associative list" or "associative array".
 */
export class Dictionary<Key extends string, T> {

	/**
	 * Key/value pairs
	 */
	private _dictionary: { [key in Key]?: T };

	/**
	 * Event dispatcher.
	 */
	public events: EventDispatcher<AMEvent<Dictionary<Key, T>, IDictionaryEvents<Key, T>>> = new EventDispatcher();

	/**
	 * Constructor
	 */
	constructor() {
		this._dictionary = {};
	}

	/**
	 * Returns `true` if key exists in Dictionary.
	 *
	 * @param key  The key to search for
	 * @return `true` if key exists, `false` if it doesn't
	 */
	public hasKey(key: Key): boolean {
		return $object.hasKey(this._dictionary, key);
	}

	/**
	 * Returns the value for a specific key.
	 *
	 * @param key  The key to search for
	 * @return Value for the key, or `undefined` if it doesn't exist
	 */
	public getKey(key: Key): Optional<T> {
		return this._dictionary[key];
	}

	/**
	 * Inserts value at specific key.
	 *
	 * Will thrown an exception if the key already exists in the dictionary.
	 *
	 * @param key    Key
	 * @param value  Value
	 */
	public insertKey(key: Key, value: T): void {
		if ($object.hasKey(this._dictionary, key)) {
			throw new Error("Key " + key + " already exists in dictionary");

		} else {
			this._dictionary[key] = value;

			if (this.events.isEnabled("insertKey")) {
				this.events.dispatchImmediately("insertKey", {
					type: "insertKey",
					target: this,
					key: key,
					newValue: value
				});
			}
		}
	}

	/**
	 * Adds or updates key/value into dictionary.
	 *
	 * If the key already exists, the old value will be overwritten.
	 *
	 * If the new value is exactly the same as the old value (using ===), it won't do anything.
	 *
	 * @param key    Key
	 * @param value  Value
	 */
	public setKey(key: Key, value: T): void {
		if ($object.hasKey(this._dictionary, key)) {
			const oldValue = this._dictionary[key];

			if (oldValue !== value) {
				this._dictionary[key] = value;

				if (this.events.isEnabled("setKey")) {
					this.events.dispatchImmediately("setKey", {
						type: "setKey",
						target: this,
						key: key,
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
			}

		} else {
			this._dictionary[key] = value;

			if (this.events.isEnabled("insertKey")) {
				this.events.dispatchImmediately("insertKey", {
					type: "insertKey",
					target: this,
					key: key,
					newValue: value
				});
			}
		}
	}

	/**
	 * Updates the value at specific `key` using custom function.
	 *
	 * Passes in current value into the function, and uses its output as a new
	 * value.
	 *
	 * If the new value is exactly the same as the old value (using ===), it won't do anything.
	 *
	 * @ignore Exclude from docs
	 * @param key  Key
	 * @param fn   Function to transform the value
	 */
	public updateKey(key: Key, fn: (value: T) => T): void {
		if ($object.hasKey(this._dictionary, key)) {
			const oldValue = this._dictionary[key];
			const newValue = fn(oldValue);

			if (oldValue !== newValue) {
				this._dictionary[key] = newValue;

				if (this.events.isEnabled("setKey")) {
					this.events.dispatchImmediately("setKey", {
						type: "setKey",
						target: this,
						key: key,
						oldValue: oldValue,
						newValue: newValue
					});
				}

				if (this.events.isEnabled("removed")) {
					this.events.dispatchImmediately("removed", {
						type: "removed",
						target: this,
						oldValue: oldValue
					});
				}
			}

		} else {
			throw new Error("Key " + key + " doesn't exist in dictionary");
		}
	}

	/**
	 * Removes value at specific `key` from dictionary.
	 *
	 * @param key  Key to remove
	 */
	public removeKey(key: Key): void {
		if ($object.hasKey(this._dictionary, key)) {
			const oldValue = this._dictionary[key];

			delete this._dictionary[key];

			if (this.events.isEnabled("removeKey")) {
				this.events.dispatchImmediately("removeKey", {
					type: "removeKey",
					target: this,
					key: key,
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
		}
	}

	/**
	 * [insertKeyIfEmpty description]
	 *
	 * @ignore Exclude from docs
	 * @todo description
	 * @param key      [description]
	 * @param ifEmpty  [description]
	 * @return [description]
	 */
	public insertKeyIfEmpty(key: Key, ifEmpty: () => T): T {
		if (!this.hasKey(key)) {
			this.insertKey(key, ifEmpty());
		}

		return <T>this.getKey(key);
	}

	/**
	 * Removes all items from the dictionary.
	 */
	public clear(): void {
		// TODO dispatch this after clear
		if (this.events.isEnabled("removed")) {
			$object.each(this._dictionary, (key, value) => {
				this.events.dispatchImmediately("removed", {
					type: "removed",
					target: this,
					oldValue: value
				});
			});
		}

		this._dictionary = {};

		if (this.events.isEnabled("cleared")) {
			this.events.dispatchImmediately("cleared", {
				type: "cleared",
				target: this
			});
		}
	}

	/**
	 * Copies items from another Dictionary.
	 *
	 * @param source  A Dictionary to copy items from
	 */
	public copyFrom(source: this): void {
		$iter.each(source.iterator(), (a) => {
			// TODO fix this type cast
			this.setKey(<Key>a[0], a[1]);
		});
	}

	/**
	 * Returns an interator that can be used to iterate through all items in
	 * the dictionary.
	 *
	 * @return Iterator
	 */
	public iterator(): $iter.Iterator<[Key, T]> {
		// @todo fix this type after the Iterator bug is fixed
		// https://github.com/Microsoft/TypeScript/issues/16730
		return <$iter.Iterator<[Key, T]>>$object.entries(this._dictionary);
	}

	/**
	 * Returns an ES6 iterator for the keys/values of the dictionary.
	 */
	public *[Symbol.iterator](): Iterator<[Key, T]> {
		// TODO make this more efficient ?
		for (let key in this._dictionary) {
			if ($object.hasKey(this._dictionary, key)) {
				yield [<Key>key, this._dictionary[key]];
			}
		}
	}

	/**
	 * Calls `f` for each key/value in the dictionary.
	 */
	public each(f: (key: Key, value: T) => void): void {
		$iter.each(this.iterator(), ([key, value]) => f(key, value));
	}

	/**
	 * Returns an iterator that can be used to iterate through all items in
	 * the dictionary, ordered by key.
	 *
	 * @ignore Exclude from docs
	 * @return Iterator
	 */
	public sortedIterator(): $iter.Iterator<[Key, T]> {
		return $iter.sort(this.iterator(), (x, y) => $string.order(x[0], y[0]));
	}

}

/**
 * A version of a [[Dictionary]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
export class DictionaryTemplate<Key extends string, T extends IClone<T> & { isTemplate: boolean }> extends Dictionary<Key, T> {
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
	 * Copies all elements from other dictionary.
	 *
	 * @param source  Source dictionary
	 */
	public copyFrom(source: this): void {
		$iter.each(source.iterator(), (a) => {
			// TODO fix this type cast
			// TODO why does this need to clone ?
			this.setKey(<Key>a[0], a[1].clone());
		});
	}

	/**
	 * Instantiates a new object of the specified type, adds it to specified
	 * `key` in the dictionary, and returns it.
	 *
	 * @param make  Item type to use. Will use the default type for the dictionary if not specified.
	 * @return      Newly created item
	 */
	public create(key: Key): T {
		return this.insertKeyIfEmpty(key, () => this.template.clone());
	}

}
