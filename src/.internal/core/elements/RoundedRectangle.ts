/**
 * Rounded rectangle module.
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
import * as $type from "../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[RoundedRectangle]].
 */
export interface IRoundedRectangleProperties extends ISpriteProperties {

	/**
	 * Radius of the top-left corner in pixels.
	 *
	 * @default 3
	 * @type {number}
	 */
	cornerRadiusTopLeft?: number;

	/**
	 * Radius of the top-right corner in pixels.
	 *
	 * @default 3
	 * @type {number}
	 */
	cornerRadiusTopRight?: number;

	/**
	 * Radius of the bottom-right corner in pixels.
	 *
	 * @default 3
	 * @type {number}
	 */
	cornerRadiusBottomRight?: number;

	/**
	 * Radius of the bottom-left corner in pixels.
	 *
	 * @default 3
	 * @type {number}
	 */
	cornerRadiusBottomLeft?: number;

}

/**
 * Defines events for [[RoundedRectangle]].
 */
export interface IRoundedRectangleEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[RoundedRectangle]].
 *
 * @see {@link Adapter}
 */
export interface IRoundedRectangleAdapters extends ISpriteAdapters, IRoundedRectangleProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a rectangle with rounded corners.
 *
 * @see {@link IRoundedRectangleEvents} for a list of available events
 * @see {@link IRoundedRectangleAdapters} for a list of available Adapters
 */
export class RoundedRectangle extends Sprite {

	/**
	 * Defines available properties.
	 *
	 * @type {IRoundedRectangleProperties}
	 */
	public _properties!: IRoundedRectangleProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IRoundedRectangleAdapters}
	 */
	public _adapter!: IRoundedRectangleAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IRoundedRectangleEvents}
	 */
	public _events!: IRoundedRectangleEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "RoundedRectangle";

		this.element = this.paper.add("path");

		//this.pixelPerfect = false;

		this.cornerRadius(3, 3, 3, 3);

		this.applyTheme();
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		let w: number = this.innerWidth;
		let h: number = this.innerHeight;

		if ($type.isNumber(w) && $type.isNumber(h)) {
			let maxcr: number = $math.min(Math.abs(w / 2), Math.abs(h / 2));
			let crtl: number = $math.fitToRange(this.cornerRadiusTopLeft, 0, maxcr);
			let crtr: number = $math.fitToRange(this.cornerRadiusTopRight, 0, maxcr);
			let crbr: number = $math.fitToRange(this.cornerRadiusBottomRight, 0, maxcr);
			let crbl: number = $math.fitToRange(this.cornerRadiusBottomLeft, 0, maxcr);

			let lineT: string = "M" + crtl + ",0 L" + (w - crtr) + ",0";
			let lineB: string = " L" + crbl + "," + h;
			let lineL: string = " L0," + crtl;
			let lineR: string = " L" + w + "," + (h - crbr);

			let arcTR: string = " a" + crtr + "," + crtr + " 0 0 1 " + crtr + "," + crtr;
			let arcBR: string = " a" + crbr + "," + crbr + " 0 0 1 -" + crbr + "," + crbr;
			let arcBL: string = " a" + crbl + "," + crbl + " 0 0 1 -" + crbl + ",-" + crbl;
			let arcTL: string = " a" + crtl + "," + crtl + " 0 0 1 " + crtl + ",-" + crtl;


			let path: string = lineT + arcTR + lineR + arcBR + lineB + arcBL + lineL + arcTL + " Z";

			this.path = path;
		}
	}

	/**
	 * Sets radius for all four corners at ones.
	 *
	 * All numbers are in pixels.
	 *
	 * @param {number}  tl  Top-left corner
	 * @param {number}  tr  Top-right corner
	 * @param {number}  bl  Bottom-left corner
	 * @param {number}  br  Bottom-right corner
	 */
	public cornerRadius(tl: number, tr: number, bl: number, br: number) {
		this.cornerRadiusTopLeft = tl;
		this.cornerRadiusTopRight = tr;
		this.cornerRadiusBottomLeft = bl;
		this.cornerRadiusBottomRight = br;
	}

	/**
	 * Radius of the top-left corner in pixels.
	 *
	 * @default 3
	 * @param {number}  value  Radius (px)
	 */
	public set cornerRadiusTopLeft(value: number) {
		this.setPropertyValue("cornerRadiusTopLeft", value, true);
	}

	/**
	 * @return {number} Radius (px)
	 */
	public get cornerRadiusTopLeft(): number {
		return this.getPropertyValue("cornerRadiusTopLeft");
	}

	/**
	 * Radius of the top-right corner in pixels.
	 *
	 * @default 3
	 * @param {number}  value  Radius (px)
	 */
	public set cornerRadiusTopRight(value: number) {
		this.setPropertyValue("cornerRadiusTopRight", value, true);
	}

	/**
	 * @return {number} Radius (px)
	 */
	public get cornerRadiusTopRight(): number {
		return this.getPropertyValue("cornerRadiusTopRight");
	}

	/**
	 * Radius of the bottom-right corner in pixels.
	 *
	 * @default 3
	 * @param {number}  value  Radius (px)
	 */
	public set cornerRadiusBottomRight(value: number) {
		this.setPropertyValue("cornerRadiusBottomRight", value, true);
	}

	/**
	 * @return {number} Radius (px)
	 */
	public get cornerRadiusBottomRight(): number {
		return this.getPropertyValue("cornerRadiusBottomRight");
	}

	/**
	 * Radius of the bottom-left corner in pixels.
	 *
	 * @default 3
	 * @param {number}  value  Radius (px)
	 */
	public set cornerRadiusBottomLeft(value: number) {
		this.setPropertyValue("cornerRadiusBottomLeft", value, true);
	}

	/**
	 * @return {number} Radius (px)
	 */
	public get cornerRadiusBottomLeft(): number {
		return this.getPropertyValue("cornerRadiusBottomLeft");
	}

	/**
	 * Measures the element.
	 *
	 * @ignore Exclude from docs
	 */
	public measureElement(): void {
		this._bbox = { x: 0, y: 0, width: this.innerWidth, height: this.innerHeight };
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["RoundedRectangle"] = RoundedRectangle;
