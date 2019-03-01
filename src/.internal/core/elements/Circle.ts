/**
 * Functionality for drawing circles.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../Sprite";
import { percent, Percent } from "../utils/Percent";
import { registry } from "../Registry";
import * as $utils from "../utils/Utils";
import * as $math from "../utils/Math";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Circle]].
 */
export interface ICircleProperties extends ISpriteProperties {

	/**
	 * Radius of the circle.
	 *
	 * Can be either absolute (pixels) or relative ([Percent]).
	 */
	radius?: number | Percent;

}

/**
 * Defines events for [[Circle]].
 */
export interface ICircleEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[Circle]].
 *
 * @see {@link Adapter}
 */
export interface ICircleAdapters extends ISpriteAdapters, ICircleProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to create a circle
 * @see {@link ICircleEvents} for a list of available events
 * @see {@link ICircleAdapters} for a list of available Adapters
 */
export class Circle extends Sprite {

	/**
	 * Defines available properties.
	 */
	public _properties!: ICircleProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICircleAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICircleEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "Circle";
		this.element = this.paper.add("circle");

		this.setPercentProperty("radius", percent(100));
		this.setPropertyValue("horizontalCenter", "middle");
		this.setPropertyValue("verticalCenter", "middle");
		this.applyTheme();
	}

	/**
	 * Draws the circle.
	 */
	protected draw(): void {
		super.draw();
		this.element.attr({ "r": this.pixelRadius });
	}

	/**
	 * Radius of the circle.
	 *
	 * Can be either absolute (pixels) or relative ([Percent]).
	 *
	 * @param value  Radius
	 */
	public set radius(value: number | Percent) {
		this.setPercentProperty("radius", value, true, false, 10, false);
	}

	/**
	 * @return Radius
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * Radius of the circle in pixels.
	 *
	 * This is a read-only property. To set radius in pixels, use `radius`
	 * property.
	 *
	 * @readonly
	 * @return Radius (px)
	 */
	public get pixelRadius(): number {
		return $utils.relativeToValue(this.radius, $math.min(this.innerWidth / 2, this.innerHeight / 2));
	}

	/**
	 * Updates bounding box.
	 *
	 * @ignore Exclude from docs
	 */
	public measureElement(): void {
		let pixelRadius = this.pixelRadius;
		this._bbox = {
			x: -pixelRadius,
			y: -pixelRadius,
			width: pixelRadius * 2,
			height: pixelRadius * 2
		};
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Circle"] = Circle;
