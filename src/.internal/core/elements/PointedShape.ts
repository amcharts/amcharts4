/**
 * Pointed shape module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../Sprite";
import * as $type from "../utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[PointedShape]].
 */
export interface IPointedShapeProperties extends ISpriteProperties {

	/**
	 * A width of the pinter's (stem's) thick end (base) in pixels.
	 *
	 * @default 15
	 * @type {number}
	 */
	pointerBaseWidth?: number;

	/**
	 * A length of the pinter (stem) in pixels.
	 *
	 * @default 10
	 * @type {number}
	 */
	pointerLength?: number;

	/**
	 * X coordinate the shape is pointing to.
	 *
	 * @type {number}
	 */
	pointerX?: number;

	/**
	 * Y coordinate the shape is pointing to.
	 *
	 * @type {number}
	 */
	pointerY?: number;

}

/**
 * Defines events for [[PointedShape]].
 */
export interface IPointedShapeEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[PointedShape]].
 *
 * @see {@link Adapter}
 */
export interface IPointedShapeAdapters extends ISpriteAdapters, IPointedShapeProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a shape with a pointer.
 *
 * @see {@link IPointedShapeEvents} for a list of available events
 * @see {@link IPointedShapeAdapters} for a list of available Adapters
 */
export class PointedShape extends Sprite {

	/**
	 * Defines available properties.
	 *
	 * @type {IPointedShapeProperties}
	 */
	public _properties!: IPointedShapeProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IPointedShapeAdapters}
	 */
	public _adapter!: IPointedShapeAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IPointedShapeEvents}
	 */
	public _events!: IPointedShapeEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PointedShape";
		this.pointerBaseWidth = 15;
		this.pointerLength = 10;

		this.applyTheme();
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();
		if (!$type.isNumber(this.pointerX)) {
			this.pointerX = this.pixelWidth / 2;
		}
		if (!$type.isNumber(this.pointerY)) {
			this.pointerY = this.pixelHeight + 10;
		}
	}

	/**
	 * A width of the pinter's (stem's) thick end (base) in pixels.
	 *
	 * @default 15
	 * @param {number}  value  Width (px)
	 */
	public set pointerBaseWidth(value: number) {
		this.setPropertyValue("pointerBaseWidth", value, true);
	}

	/**
	 * A length of the pinter (stem) in pixels.
	 *
	 * @default 10
	 * @param {number}  value  Length (px)
	 */
	public set pointerLength(value: number) {
		this.setPropertyValue("pointerLength", value);
	}

	/**
	 * @return {number} Length (px)
	 */
	public get pointerLength(): number {
		return this.getPropertyValue("pointerLength");
	}

	/**
	 * @return {number} Width (px)
	 */
	public get pointerBaseWidth(): number {
		return this.getPropertyValue("pointerBaseWidth");
	}

	/**
	 * X coordinate the shape is pointing to.
	 *
	 * @param {number}  value  X
	 */
	public set pointerX(value: number) {
		this.setPropertyValue("pointerX", value, true);
	}

	/**
	 * @return {number} X
	 */
	public get pointerX(): number {
		return this.getPropertyValue("pointerX");
	}

	/**
	 * Y coordinate the shape is pointing to.
	 *
	 * @param {number}  value  Y
	 */
	public set pointerY(value: number) {
		this.setPropertyValue("pointerY", value, true);
	}

	/**
	 * @return {number} Y
	 */
	public get pointerY(): number {
		return this.getPropertyValue("pointerY");
	}

}
