/**
 * Pointed rectangle module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PointedShape, IPointedShapeProperties, IPointedShapeAdapters, IPointedShapeEvents } from "./PointedShape";
import * as $math from "../utils/Math";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[PointedRectangle]].
 */
export interface IPointedRectangleProperties extends IPointedShapeProperties {

	/**
	 * Radius of rectangle's border in pixels.
	 *
	 * @default 0
	 */
	cornerRadius?: number;

}

/**
 * Defines events for [[PointedRectangle]].
 */
export interface IPointedRectangleEvents extends IPointedShapeEvents { }

/**
 * Defines adapters for [[PointedRectangle]].
 *
 * @see {@link Adapter}
 */
export interface IPointedRectangleAdapters extends IPointedShapeAdapters, IPointedRectangleProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a rectangle with a pointer.
 *
 * @see {@link IPointedRectangleEvents} for a list of available events
 * @see {@link IPointedRectangleAdapters} for a list of available Adapters
 */
export class PointedRectangle extends PointedShape {

	/**
	 * Defines available properties.
	 */
	public _properties!: IPointedRectangleProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPointedRectangleAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPointedRectangleEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PointedRectangle";
		this.element = this.paper.add("path");
		this.cornerRadius = 6;

		this.applyTheme();
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();
		let cr = this.cornerRadius;
		let w = this.innerWidth;
		let h = this.innerHeight;
		if (w > 0 && h > 0) {
			let x = this.pointerX;
			let y = this.pointerY;
			let bwh = this.pointerBaseWidth / 2;

			let maxcr: number = $math.min(w / 2, h / 2);
			let crtl: number = $math.fitToRange(cr, 0, maxcr);
			let crtr: number = $math.fitToRange(cr, 0, maxcr);
			let crbr: number = $math.fitToRange(cr, 0, maxcr);
			let crbl: number = $math.fitToRange(cr, 0, maxcr);

			// corner coordinates
			// top left
			let xtl = 0;
			let ytl = 0;
			// top right
			let xtr = w;
			let ytr = 0;
			// bottom right
			let xbr = w;
			let ybr = h;
			// bottom left
			let xbl = 0;
			let ybl = h;

			let lineT;
			let lineR;
			let lineB;
			let lineL;

			// find stem base side: http://$math.stackexchange.com/questions/274712/calculate-on-which-side-of-straign-line-is-dot-located
			// d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
			let d1 = (x - xtl) * (ybr - ytl) - (y - ytl) * (xbr - xtl);
			let d2 = (x - xbl) * (ytr - ybl) - (y - ybl) * (xtr - xbl);

			// top
			if (d1 > 0 && d2 > 0) {
				let stemX = $math.fitToRange(x, crtl + bwh, w - bwh - crtr);
				y = $math.fitToRange(y, -Infinity, 0);
				lineT = "M" + crtl + ",0 L" + (stemX - bwh) + ",0 L" + x + "," + y + " L" + (stemX + bwh) + ",0 L" + (w - crtr) + ",0";

			}
			else {
				lineT = "M" + crtl + ",0 L" + (w - crtr) + ",0";
			}
			// bottom
			if (d1 < 0 && d2 < 0) {
				let stemX = $math.fitToRange(x, crbl + bwh, w - bwh - crbr);
				y = $math.fitToRange(y, h, Infinity);
				lineB = " L" + (w - crbr) + "," + h + " L" + (stemX + bwh) + "," + h + " L" + x + "," + y + " L" + (stemX - bwh) + "," + h + " L" + crbl + "," + h;
			}
			else {
				lineB = " L" + crbl + "," + h;
			}
			// left
			if (d1 < 0 && d2 > 0) {
				let stemY = $math.fitToRange(y, crtl + bwh, h - crbl - bwh);
				x = $math.fitToRange(x, -Infinity, 0);
				lineL = " L0," + (h - crbl) + " L0," + (stemY + bwh) + " L" + x + "," + y + " L0," + (stemY - bwh) + " L0," + crtl;
			}
			else {
				lineL = " L0," + crtl;
			}
			// right
			if (d1 > 0 && d2 < 0) {
				let stemY = $math.fitToRange(y, crtr + bwh, h - bwh - crbr);
				x = $math.fitToRange(x, w, Infinity);
				lineR = " L" + w + "," + crtr + " L" + w + "," + (stemY - bwh) + " L" + x + "," + y + " L" + w + "," + (stemY + bwh) + " L" + w + "," + (h - crbr);
			}
			else {
				lineR = " L" + w + "," + (h - crbr);
			}

			let arcTR = " a" + crtr + "," + crtr + " 0 0 1 " + crtr + "," + crtr;
			let arcBR = " a" + crbr + "," + crbr + " 0 0 1 -" + crbr + "," + crbr;
			let arcBL = " a" + crbl + "," + crbl + " 0 0 1 -" + crbl + ",-" + crbl;
			let arcTL = " a" + crtl + "," + crtl + " 0 0 1 " + crtl + ",-" + crtl;

			this.path = lineT + arcTR + lineR + arcBR + lineB + arcBL + lineL + arcTL;
		}
	}

	/**
	 * Radius of rectangle's border in pixels.
	 *
	 * @default 0
	 * @param value  Corner radius (px)
	 */
	public set cornerRadius(value: number) {
		this.setPropertyValue("cornerRadius", value, true);
	}

	/**
	 * @return Corner radius (px)
	 */
	public get cornerRadius(): number {
		return this.getPropertyValue("cornerRadius");
	}

}
