/**
 * Bullet module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Bullet, IBulletProperties, IBulletAdapters, IBulletEvents } from "./Bullet";
import { Circle } from "../../core/elements/Circle";
import { registry } from "../../core/Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Bullet]]
 */
export interface ICircleBulletProperties extends IBulletProperties { }

/**
 * Defines events for [[Bullet]]
 */
export interface ICircleBulletEvents extends IBulletEvents { }

/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface ICircleBulletAdapters extends IBulletAdapters, ICircleBulletProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a bullet with a textual label.
 *
 * Uses [[Label]] instance to draw the label, so the label itself is
 * configurable.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export class CircleBullet extends Bullet {

	/**
	 * Defines available properties.
	 */
	public _properties!: ICircleBulletProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICircleBulletAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICircleBulletEvents;

	/**
	 * A label (textual) element for the bullet.
	 */
	public circle: Circle;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "CircleBullet";

		let circle = this.createChild(Circle);
		circle.shouldClone = false;
		circle.radius = 5;
		circle.isMeasured = false;
		this.circle = circle;

		this.applyTheme();
	}

	/**
	 * Copies all proprities and related stuff from another instance of
	 * [[CircleBullet]].
	 *
	 * @param source  Source element
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.circle.copyFrom(source.circle);
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CircleBullet"] = CircleBullet;
