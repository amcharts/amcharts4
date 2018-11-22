/**
 * This module defines a [[Validatable]] class which can be used by all
 * non-[[Sprite]] classes to use system beats to revalidate themselves.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents } from "../Base";
import { registry } from "../Registry";

/**
 * This module defines a [[Validatable]] class which can be used by all
 * non-[[Sprite]] classes to use system update cycle to revalidate themselves.
 *
 * @ignore Exclude from docs
 */
export class Validatable extends BaseObjectEvents {

	/**
	 * Is invalid and should be revalidated?
	 *
	 * @type {boolean}
	 */
	protected _invalid: boolean = false;

	/**
	 * Invalidates the element, so that it can re-validate/redraw itself in the
	 * next cycle.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidate(): void {
		if (this._invalid === false) {
			this._invalid = true;
			registry.events.on("exitframe", this.validate, this);
		}
	}

	/**
	 * Validates itself.
	 *
	 * Most probably the extending class will have an overriding `validate()`
	 * method which will do actual work, as well as call this method using
	 * `super.validate()`.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		if (this._invalid === true) {
			this._invalid = false;
			registry.events.off("exitframe", this.validate, this);
		}
	}

}
