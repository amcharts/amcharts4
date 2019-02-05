/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as $array from "./Array";
import * as $type from "./Type";
import { Optional } from "./Type";

/**
 * Defines interface for disposable objects.
 *
 * @ignore Exclude from docs
 */
export interface IDisposer {
	isDisposed(): boolean;
	dispose(): void;
}

/**
 * A base class for disposable objects.
 *
 * @ignore Exclude from docs
 */
export class Disposer implements IDisposer {

	/**
	 * Is object disposed?
	 */
	private _disposed: boolean;

	/**
	 * Method that disposes the object.
	 */
	private _dispose: () => void;

	/**
	 * Constructor.
	 *
	 * @param dispose  Function that disposes object
	 */
	constructor(dispose: () => void) {
		this._disposed = false;
		this._dispose = dispose;
	}

	/**
	 * Checks if object is disposed.
	 *
	 * @return Disposed?
	 */
	public isDisposed(): boolean {
		return this._disposed;
	}

	/**
	 * Disposes the object.
	 */
	public dispose(): void {
		if (!this._disposed) {
			this._disposed = true;
			this._dispose();
		}
	}

}

/**
 * A collection of related disposers that can be disposed in one go.
 *
 * @ignore Exclude from docs
 */
export class MultiDisposer extends Disposer {
	constructor(disposers: Array<IDisposer>) {
		super(() => {
			$array.each(disposers, (x) => {
				x.dispose();
			});
		});
	}
}

/**
 * A special kind of Disposer that has attached value set.
 *
 * If a new value is set using `set()` method, the old disposer value is
 * disposed.
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export class MutableValueDisposer<T extends IDisposer> extends Disposer {

	/**
	 * Current disposer.
	 */
	private _disposer: Optional<IDisposer>;

	/**
	 * Current value.
	 */
	private _value: Optional<T>;

	/**
	 * Constructor.
	 */
	constructor() {
		super(() => {
			if ($type.hasValue(this._disposer)) {
				this._disposer.dispose();
				this._disposer = undefined;
			}
		});
	}

	/**
	 * Returns current value.
	 *
	 * @return Value
	 */
	public get(): Optional<T> {
		return this._value;
	}

	/**
	 * Sets value and disposes previous disposer if it was set.
	 *
	 * @param value     New value
	 * @param disposer  Disposer
	 */
	public set(value: Optional<T>, disposer: Optional<IDisposer>): void {
		if ($type.hasValue(this._disposer)) {
			this._disposer.dispose();
		}

		this._disposer = disposer;
		this._value = value;
	}

	/**
	 * Resets the disposer value.
	 */
	public reset(): void {
		this.set(undefined, undefined);
	}

}

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export class CounterDisposer extends Disposer {

	/**
	 * [_counter description]
	 *
	 * @todo Description
	 */
	private _counter: number = 0;

	/**
	 * [increment description]
	 *
	 * @todo Description
	 */
	public increment() {
		// TODO throw an error if it is disposed
		++this._counter;

		// TODO make this more efficient
		return new Disposer(() => {
			--this._counter;

			if (this._counter === 0) {
				this.dispose();
			}
		});
	}

}
