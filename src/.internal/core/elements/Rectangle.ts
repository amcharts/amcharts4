/**
 * Functionality for drawing rectangles.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../Sprite";
import { registry } from "../Registry";
import * as $math from "../utils/Math";
import { IRectangle } from "../defs/IRectangle";


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
	 */
	public _properties!: IRectangleProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IRectangleAdapters;

	/**
	 * Defines available events.
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
	 * Measures the element.
	 *
	 * @ignore Exclude from docs
	 */
	public measureElement(): void {

	}

	/**
	 * Returns bounding box (square) for this element.
	 *
	 * @ignore Exclude from docs
	 */
	public get bbox(): IRectangle {
		if (this.definedBBox) {
			return this.definedBBox;
		}

		if (this.isMeasured) {
			return {
				x: 0,
				y: 0,
				width: this.innerWidth,
				height: this.innerHeight
			}
		}
		else {
			return { x: 0, y: 0, width: 0, height: 0 };
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Rectangle"] = Rectangle;
