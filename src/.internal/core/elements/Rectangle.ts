/**
 * Functionality for drawing rectangles.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../Sprite";
import { registry } from "../Registry";
import * as $math from "../utils/Math";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Rectangle]].
 */
export interface IRectangleProperties extends ISpriteProperties { }

/**
 * Defines events for [[Rectangle]].
 */
export interface IRectangleEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[Rectangle]].
 *
 * @see {@link Adapter}
 */
export interface IRectangleAdapters extends ISpriteAdapters, IRectangleProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to draw a rectangle.
 *
 * @see {@link IRectangleEvents} for a list of available events
 * @see {@link IRectangleAdapters} for a list of available Adapters
 */
export class Rectangle extends Sprite {

	/**
	 * Defines available properties.
	 *
	 * @type {IRectangleProperties}
	 */
	public _properties!: IRectangleProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IRectangleAdapters}
	 */
	public _adapter!: IRectangleAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IRectangleEvents}
	 */
	public _events!: IRectangleEvents;

	/**
	 * Constructor
	 * * Creates a `<rect>` element
	 * * Creates default state
	 */
	constructor() {
		super();
		this.className = "Rectangle";
		this.element = this.paper.add("rect");
		//this.pixelPerfect = false;
		this.applyTheme();
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		let precision: number = this._positionPrecision;
		if (this.pixelPerfect) {
			precision = 0;
		}

		let w: number = $math.round(this.innerWidth, precision);
		let h: number = $math.round(this.innerHeight, precision);

		this.element.attr({
			"width": w,
			"height": h
		});
	}

	/**
	 * Updates bounding box based on element dimension settings.
	 *
	 * @ignore Exclude from docs
	 */
	public measureElement(): void {
		this._bbox = {
			x: 0,
			y: 0,
			width: this.innerWidth,
			height: this.innerHeight
		};
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Rectangle"] = Rectangle;
