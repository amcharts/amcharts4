/**
 * Rounded rectangle module.
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
import * as $type from "../utils/Type";
import { IRectangle } from "../defs/IRectangle";


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
	 */
	cornerRadiusTopLeft?: number;

	/**
	 * Radius of the top-right corner in pixels.
	 *
	 * @default 3
	 */
	cornerRadiusTopRight?: number;

	/**
	 * Radius of the bottom-right corner in pixels.
	 *
	 * @default 3
	 */
	cornerRadiusBottomRight?: number;

	/**
	 * Radius of the bottom-left corner in pixels.
	 *
	 * @default 3
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
	 */
	public _properties!: IRoundedRectangleProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IRoundedRectangleAdapters;

	/**
	 * Defines available events.
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
	 * @param tl  Top-left corner
	 * @param tr  Top-right corner
	 * @param bl  Bottom-left corner
	 * @param br  Bottom-right corner
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
	 * @param value  Radius (px)
	 */
	public set cornerRadiusTopLeft(value: number) {
		this.setPropertyValue("cornerRadiusTopLeft", value, true);
	}

	/**
	 * @return Radius (px)
	 */
	public get cornerRadiusTopLeft(): number {
		return this.getPropertyValue("cornerRadiusTopLeft");
	}

	/**
	 * Radius of the top-right corner in pixels.
	 *
	 * @default 3
	 * @param value  Radius (px)
	 */
	public set cornerRadiusTopRight(value: number) {
		this.setPropertyValue("cornerRadiusTopRight", value, true);
	}

	/**
	 * @return Radius (px)
	 */
	public get cornerRadiusTopRight(): number {
		return this.getPropertyValue("cornerRadiusTopRight");
	}

	/**
	 * Radius of the bottom-right corner in pixels.
	 *
	 * @default 3
	 * @param value  Radius (px)
	 */
	public set cornerRadiusBottomRight(value: number) {
		this.setPropertyValue("cornerRadiusBottomRight", value, true);
	}

	/**
	 * @return Radius (px)
	 */
	public get cornerRadiusBottomRight(): number {
		return this.getPropertyValue("cornerRadiusBottomRight");
	}

	/**
	 * Radius of the bottom-left corner in pixels.
	 *
	 * @default 3
	 * @param value  Radius (px)
	 */
	public set cornerRadiusBottomLeft(value: number) {
		this.setPropertyValue("cornerRadiusBottomLeft", value, true);
	}

	/**
	 * @return Radius (px)
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
registry.registeredClasses["RoundedRectangle"] = RoundedRectangle;
