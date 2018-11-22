/**
 * Line drawing functionality.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../Sprite";
import { color } from "../utils/Color";
import { LinearGradient } from "../rendering/fills/LinearGradient";
import { registry } from "../Registry";
import * as $type from "../utils/Type";
import * as $math from "../utils/Math";
import { IPoint, IOrientationPoint } from "../defs/IPoint";



/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Line]].
 */
export interface ILineProperties extends ISpriteProperties {

	/**
	 * X coordinate of first end.
	 *
	 * @type {number}
	 */
	x1?: number;

	/**
	 * Y coordinate of first end.
	 *
	 * @type {number}
	 */
	y1?: number;

	/**
	 * X coordinate of second end.
	 *
	 * @type {number}
	 */
	x2?: number;

	/**
	 * Y coordinate of second end.
	 *
	 * @type {number}
	 */
	y2?: number;

}

/**
 * Defines events for [[Line]].
 */
export interface ILineEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[Line]].
 *
 * @see {@link Adapter}
 */
export interface ILineAdapters extends ISpriteAdapters, ILineProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a line.
 *
 * @see {@link ILineEvents} for a list of available events
 * @see {@link ILineAdapters} for a list of available Adapters
 */
export class Line extends Sprite {

	/**
	 * Defines available properties.
	 *
	 * @type {ILineProperties}
	 */
	public _properties!: ILineProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {ILineAdapters}
	 */
	public _adapter!: ILineAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {ILineEvents}
	 */
	public _events!: ILineEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Line";
		this.element = this.paper.add("line");
		this.fill = color(); //"none";

		this.x1 = 0;
		this.y1 = 0;

		this.applyTheme();
	}

	/**
	 * Draws the line.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();
		if (this.x1 == this.x2 || this.y1 == this.y2) {
			this.pixelPerfect = true;
		}
		else {
			this.pixelPerfect = false;
		}

		this.x1 = this.x1;
		this.x2 = this.x2;

		this.y1 = this.y1;
		this.y2 = this.y2;
	}

	/**
	 * X coordinate of first end.
	 *
	 * @param {number} value X
	 */
	public set x1(value: number) {
		if (!$type.isNumber(value)) {
			value = 0;
		}
		let delta = 0;
		if (this.pixelPerfect && this.stroke instanceof LinearGradient) {
			delta = 0.00001;
		}

		this.setPropertyValue("x1", value, true);
		this.element.attr({ "x1": value + delta });
	}

	/**
	 * @return {number} X
	 */
	public get x1(): number {
		return this.getPropertyValue("x1");
	}

	/**
	 * X coordinate of second end.
	 *
	 * @param {number} value X
	 */
	public set x2(value: number) {
		if (!$type.isNumber(value)) {
			value = 0;
		}
		this.setPropertyValue("x2", value, true);
		this.element.attr({ "x2": value });
	}

	/**
	 * @return {number} X
	 */
	public get x2(): number {
		let value = this.getPropertyValue("x2");
		if (!$type.isNumber(value)) {
			value = this.pixelWidth;
		}
		return value;
	}

	/**
	 * Y coordinate of first end.
	 *
	 * @param {number} value Y
	 */
	public set y1(value: number) {
		if (!$type.isNumber(value)) {
			value = 0;
		}

		let delta = 0;
		if (this.pixelPerfect && this.stroke instanceof LinearGradient) {
			delta = 0.00001;
		}

		this.setPropertyValue("y1", value, true);
		this.element.attr({ "y1": value + delta });
	}

	/**
	 * @return {number} Y
	 */
	public get y1(): number {
		return this.getPropertyValue("y1");
	}

	/**
	 * Y coordinate of second end.
	 *
	 * @param {number} value Y
	 */
	public set y2(value: number) {
		if (!$type.isNumber(value)) {
			value = 0;
		}
		this.setPropertyValue("y2", value, true);
		this.element.attr({ "y2": value });
	}

	/**
	 * @return {number} Y
	 */
	public get y2(): number {
		let value = this.getPropertyValue("y2");
		if (!$type.isNumber(value)) {
			value = this.pixelHeight;
		}
		return value;
	}

	/**
	 * Converts relative position along the line (0-1) into pixel coordinates.
	 *
	 * @param  {number}             position  Position (0-1)
	 * @return {IOrientationPoint}            Coordinates
	 */
	public positionToPoint(position: number): IOrientationPoint {
		let point1 = { x: this.x1, y: this.y1 };
		let point2 = { x: this.x2, y: this.y2 };
		let point = $math.getMidPoint(point1, point2, position);
		let angle = $math.getAngle(point1, point2);

		return {x:point.x, y:point.y, angle:angle};
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Line"] = Line;
