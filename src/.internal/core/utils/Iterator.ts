/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IClone } from "./Clone";
import { Ordering } from "./Order";
import * as $array from "./Array";
import * as $type from "./Type";


/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 * @hidden
 */

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export interface Iterator<A> {
	(push: (value: A) => boolean): void;
}

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export interface Iterable<A> {
	iterator(): Iterator<A>;
}

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export function fromArray<A>(array: Array<A>): Iterator<A> {
	return (push) => {
		const length = array.length;

		for (let i = 0; i < length; ++i) {
			if (!push(array[i])) {
				break;
			}
		}
	};
}

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export function length<A>(iter: Iterator<A>): number {
	let sum = 0;

	iter((_) => {
		++sum;
		return true;
	});

	return sum;
}

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export function toArray<A>(iter: Iterator<A>): Array<A> {
	const output: Array<A> = [];

	iter((value) => {
		output.push(value);
		return true;
	});

	return output;
}

/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function eachContinue<A>(iter: Iterator<A>, fn: (value: A) => boolean): void {
	iter(fn);
}

/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function each<A>(iter: Iterator<A>, fn: (value: A) => void): void {
	iter((value) => {
		fn(value);
		return true;
	});
}

/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function sort<A>(iter: Iterator<A>, fn: (left: A, right: A) => Ordering): Iterator<A> {
	return fromArray(toArray(iter).sort(fn));
}

/**
 * [A description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function map<A, B>(iter: Iterator<A>, fn: (value: A) => B): Iterator<B> {
	return (push) => iter((value) => push(fn(value)));
}

/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function filter<A>(iter: Iterator<A>, fn: (value: A) => boolean): Iterator<A> {
	return (push) => iter((value) => {
		if (fn(value)) {
			return push(value);

		} else {
			return true;
		}
	});
}

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export function concat<A>(...args: Array<Iterator<A>>): Iterator<A> {
	return (push) => {
		let go = true;

		const push2 = (value: A) => (go = push(value));

		const length = args.length;

		for (let i = 0; i < length; ++i) {
			args[i](push2);

			if (!go) {
				break;
			}
		}
	};
}

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export function flatten<A>(iter: Iterator<Iterator<A>>): Iterator<A> {
	return (push) => {
		let go = true;

		const push2 = (value: A) => (go = push(value));

		iter((value) => {
			value(push2);
			return go;
		});
	};
}

/**
 * [number description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function indexed<A>(iter: Iterator<A>): Iterator<[number, A]> {
	return (push) => {
		let index = 0;

		iter((value) => push([index++, value]));
	};
}

/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function findIndex<A>(iter: Iterator<A>, matches: (value: A) => boolean): number {
	let found = false;
	let i = 0;

	iter((value) => {
		if (matches(value)) {
			found = true;
			return false;

		} else {
			++i;
			return true;
		}
	});

	return (found ? i : -1);
}

/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function find<A>(iter: Iterator<A>, matches: (value: A) => boolean): A | undefined {
	let output;

	iter((value) => {
		if (matches(value)) {
			output = value;
			return false;

		} else {
			return true;
		}
	});

	return output;
}

/**
 * [A description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function findMap<A, B>(iter: Iterator<A>, matches: (value: A) => B | null): B | undefined {
	let output;

	iter((value) => {
		const v = matches(value);

		if (v !== null) {
			output = v;
			return false;

		} else {
			return true;
		}
	});

	return output;
}

/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function contains<A>(iter: Iterator<A>, matches: (value: A) => boolean): boolean {
	let output = false;

	iter((value) => {
		if (matches(value)) {
			output = true;
			return false;

		} else {
			return true;
		}
	});

	return output;
}

/**
 * [A description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export function foldl<A, B>(iter: Iterator<A>, init: B, fn: (state: B, value: A) => B): B {
	iter((value) => {
		init = fn(init, value);
		return true;
	});

	return init;
}

/**
 * [min2 description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param left [description]
 * @param right [description]
 * @return [description]
 */
function min2(left: number | null, right: number): number {
	if (left == null || right < left) {
		return right;

	} else {
		return left;
	}
}

/**
 * [min description]
 *
 * @ignore Exclude from docs
 * @todo Verify that this works correctly
 * @todo Description
 * @param a [description]
 * @return [description]
 */
export function min(a: Iterator<number>): number | null {
	return foldl(a, null, min2);
}

/**
 * [max2 description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param left [description]
 * @param right [description]
 * @return [description]
 */
function max2(left: number | null, right: number): number {
	if (left == null || right > left) {
		return right;

	} else {
		return left;
	}
}

/**
 * [max description]
 *
 * @ignore Exclude from docs
 * @todo Verify that this works correctly
 * @todo Description
 * @param a [description]
 * @return [description]
 */
export function max(a: Iterator<number>): number | null {
	return foldl(a, null, max2);
}


/**
 * [join description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param iter [description]
 * @param separator [description]
 * @return [description]
 */
export function join(iter: Iterator<string>, separator: string = ""): string {
	let first = true;
	let init = "";

	iter((value) => {
		if (first) {
			first = false;

		} else {
			init += separator;
		}

		init += value;

		return true;
	});

	return init;
}

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export class ListIterator<T extends IClone<T>> {
	private _listCopy!: Array<T>;
	private _create: () => T;

	public list: Iterable<T>;

	// flag specifies if iterator should create new list item if it is reqested for a nextItem but there is no more left in the list
	public createNewItems: boolean = false;

	/**
	 * Constructor
	 *
	 * @param list [description]
	 * @param create [description]
	 */
	constructor(list: Iterable<T>, create: () => T) {
		this.list = list;
		this._create = create;
		this.reset();
	}

	reset() {
		this._listCopy = toArray(this.list.iterator());
	}

	clear() {
		this._listCopy.length = 0;
	}

	getFirst(): $type.Optional<T> {
		return this.returnItem(0);
	}

	getLast(): $type.Optional<T> {
		return this.returnItem(this._listCopy.length - 1);
	}

	find(fn: (value: T) => boolean): $type.Optional<T> {
		let index: number = $array.findIndex(this._listCopy, fn);

		if (index !== -1) {
			let item = this._listCopy[index];
			// TODO use removeIndex instead ?
			$array.remove(this._listCopy, item);
			return item;

		} else {
			return this.getLast();
		}
	}

	removeItem(item: T): boolean {
		return $array.remove(this._listCopy, item);
	}

	protected returnItem(index: number): $type.Optional<T> {
		if (index >= 0 && index < this._listCopy.length) {
			let item = this._listCopy[index];
			// TODO use removeIndex instead ?
			$array.remove(this._listCopy, item);
			return item;

		} else if (this.createNewItems) {
			return this._create();
		}
	}

	iterator() {
		return fromArray(this._listCopy);
	}
}
