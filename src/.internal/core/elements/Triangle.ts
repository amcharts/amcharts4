/**
 * Functionality for drawing triangles.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../Sprite";
import { registry } from "../Registry";
import * as $path from "../rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Triangle]].
 */
export interface ITriangleProperties extends ISpriteProperties {
	direction: "left" | "right" | "top" | "bottom"
}

/**
 * Defines events for [[Triangle]].
 */
export interface ITriangleEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[Triangle]].
 *
 * @see {@link Adapter}
 */
export interface ITriangleAdapters extends ISpriteAdapters, ITriangleProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to draw a triangle.
 *
 * @see {@link ITriangleEvents} for a list of available events
 * @see {@link ITriangleAdapters} for a list of available Adapters
 */
export class Triangle extends Sprite {

	/**
	 * Defines available properties.
	 */
	public _properties!: ITriangleProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ITriangleAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ITriangleEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Triangle";
		this.element = this.paper.add("path");
		this.direction = "top";
		this.applyTheme();
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();
		let w: number = this.pixelWidth;
		let h: number = this.pixelHeight;

		let path: string;



		switch (this.direction) {
			case "right":
				path = $path.moveTo({ x: 0, y: 0 })
					+ $path.lineTo({ x: w, y: h / 2 })
					+ $path.lineTo({ x: 0, y: h })
					+ $path.closePath();
				break;
			case "left":
				path = $path.moveTo({ x: w, y: 0 })
					+ $path.lineTo({ x: 0, y: h / 2 })
					+ $path.lineTo({ x: w, y: h })
					+ $path.closePath();
				break;
			case "bottom":
				path = $path.moveTo({ x: 0, y: 0 })
					+ $path.lineTo({ x: w, y: 0 })
					+ $path.lineTo({ x: w / 2, y: h })
					+ $path.closePath();
				break;
			case "top":
				path = $path.moveTo({ x: w / 2, y: 0 })
					+ $path.lineTo({ x: w, y: h })
					+ $path.lineTo({ x: 0, y: h })
					+ $path.closePath();
				break;
		}

		this.path = path;
	}

	/**
	 * Sets direction of a triangle
	 *
	 * @param value
	 */
	public set direction(value: "left" | "right" | "top" | "bottom") {
		this.setPropertyValue("direction", value, true);
	}


	/**
	 * Returns direction of a triangle
	 *
	 * @return value
	 */
	public get direction(): "left" | "right" | "top" | "bottom" {
		return this.getPropertyValue("direction");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Triangle"] = Triangle;
