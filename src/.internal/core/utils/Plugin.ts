/**
 * A plugin base class.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Optional } from "./Type";
import { IDisposer } from "./Disposer";
import { Sprite } from "../Sprite";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
export interface IPlugin extends IDisposer {
	target: Optional<Sprite>;
	init(): void;
}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This is a base class that provides core functionality for plugins.
 *
 * The easiest way to start off with a new plugin is to extend this class.
 *
 * It will provide all the mandatory functionality, such as disposers.
 *
 * @since 4.2.2
 */
export class Plugin implements IPlugin {


	/**
	 * A target object plugin is for.
	 */
	public target: Optional<Sprite>;

	/**
	 * Is this object disposed?
	 */
	protected _disposed: boolean = false;

	/**
	 * List of IDisposer which will be disposed when the BaseObject is disposed.
	 *
	 * @ignore Exclude from docs
	 */
	protected _disposers: Array<IDisposer> = [];

	/**
	 * Constructor
	 */
	constructor() {
		// Nothing to do here
	}

	/**
	 * Decorates series with required events and adapters used to hijack its
	 * data.
	 */
	public init(): void {
		// Does nothing
		// Override it
	}

	/**
	 * Returns if this element is already disposed.
	 *
	 * @return Is disposed?
	 */
	public isDisposed(): boolean {
		return this._disposed;
	}

	/**
	 * Disposes this object and related stuff.
	 */
	public dispose(): void {
		if (!this._disposed) {
			this._disposed = true;

			const a = this._disposers;

			this._disposers = <any>null;

			while (a.length !== 0) {
				const disposer = a.shift();
				disposer.dispose();
			}
		}
	}

}
