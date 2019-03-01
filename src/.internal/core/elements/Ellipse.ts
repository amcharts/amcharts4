/**
 * Ellipse module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Circle, ICircleProperties, ICircleAdapters, ICircleEvents } from "./Circle";
import { registry } from "../Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Ellipse]].
 */
export interface IEllipseProperties extends ICircleProperties {

	/**
	 * Vertical radius.
	 *
	 * It's a relative size to the `radius`.
	 *
	 * E.g. 0.8 will mean the height of the ellipsis will be 80% of it's
	 * horizontal radius.
	 */
	radiusY?: number;

}

/**
 * Defines events for [[Ellipse]].
 */
export interface IEllipseEvents extends ICircleEvents { }

/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IEllipseAdapters extends ICircleAdapters, IEllipseProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws an ellipse
 * @see {@link IEllipseEvents} for a list of available events
 * @see {@link IEllipseAdapters} for a list of available Adapters
 */
export class Ellipse extends Circle {

	/**
	 * Defines available properties.
	 */
	public _properties!: IEllipseProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IEllipseAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IEllipseEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Ellipse";

		this.element = this.paper.add("ellipse");

		this.applyTheme();
	}

	/**
	 * Draws the ellipsis.
	 */
	protected draw() {
		super.draw();
		this.element.attr({ "rx": this.radius });
		this.element.attr({ "ry": this.radiusY });
	}

	/**
	 * Vertical radius.
	 *
	 * It's a relative size to the `radius`.
	 *
	 * E.g. 0.8 will mean the height of the ellipsis will be 80% of it's
	 * horizontal radius.
	 *
	 * @param value  Vertical radius
	 */
	public set radiusY(value: number) {
		this.height = value * 2;
		this.invalidate();
	}

	/**
	 * @return Vertical radius
	 */
	public get radiusY(): number {
		return this.innerHeight / 2;
	}

	/**
	 * Horizontal radius.
	 *
	 * @param value  Horizontal radius
	 */
	public set radius(value: number) {
		this.width = value * 2;
		this.invalidate();
	}

	/**
	 * @return Horizontal radius
	 */
	public get radius(): number {
		return this.innerWidth / 2;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Ellipse"] = Ellipse;
