/**
 * Polyspline (smoothed line) module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Polyline, IPolylineProperties, IPolylineAdapters, IPolylineEvents } from "./Polyline";
import { IPoint } from "../../core/defs/IPoint";
import { registry } from "../Registry";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Polyspline]].
 */
export interface IPolysplineProperties extends IPolylineProperties {

	/**
	 * Horizontal tension for the spline.
	 *
	 * Used by the line smoothing algorithm.
	 *
	 * @default 0.5
	 */
	tensionX: number;

	/**
	 * Vertical tension for the spline.
	 *
	 * Used by the line smoothing algorithm.
	 *
	 * @default 0.5
	 */
	tensionY: number;

}

/**
 * Defines events for [[Polyspline]].
 */
export interface IPolysplineEvents extends IPolylineEvents { }

/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IPolysplineAdapters extends IPolylineAdapters, IPolysplineProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a polysline. (smoothed multi-sigment line)
 *
 * @see {@link IPolysplineEvents} for a list of available events
 * @see {@link IPolysplineAdapters} for a list of available Adapters
 */
export class Polyspline extends Polyline {

	/**
	 * Defines available properties.
	 *
	 * @todo Description
	 */
	public _properties!: IPolysplineProperties;

	/**
	 * Defines available adapters.
	 *
	 * @todo Description
	 */
	public _adapter!: IPolysplineAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPolysplineEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Polyspline";

		this.tensionX = 0.5;
		this.tensionY = 0.5;

		this.applyTheme();
	}

	/**
	 * Creats and adds an SVG path for the arc.
	 *
	 * @ignore Exclude from docs
	 */
	public makePath(): void {
		this._distance = 0;
		let segments = this.segments;

		let tensionX: number = this.tensionX;
		let tensionY: number = this.tensionY;

		if (segments && segments.length > 0) {
			let path: string = "";
			this._realSegments = [];

			for (let i = 0, len = segments.length; i < len; i++) {
				let points: IPoint[] = segments[i];
				let realPoints: IPoint[] = [];
				this._realSegments.push(realPoints);

				if (points.length > 0) {

					path += $path.moveTo(points[0]);

					for (let p = 0; p < points.length - 1; p++) {

						let p0: IPoint = points[p - 1];

						let p1: IPoint = points[p];

						let p2: IPoint = points[p + 1];

						let p3: IPoint = points[p + 2];

						if (p === 0) {
							p0 = points[p];
						} else if (p == points.length - 2) {
							p3 = points[p + 1];
						}

						if (!p3) {
							p3 = p2;
						}

						let controlPointA: IPoint = $math.getCubicControlPointA(p0, p1, p2, p3, tensionX, tensionY);
						let controlPointB: IPoint = $math.getCubicControlPointB(p0, p1, p2, p3, tensionX, tensionY);

						path += $path.cubicCurveTo(p2, controlPointA, controlPointB);

						// now split to small segments so that we could have positionToPoint later
						let stepCount: number = Math.ceil($math.getDistance(p1, p2)) / 2;
						let prevPoint: IPoint = p1;
						if (stepCount > 0) {
							for (let s = 0; s <= stepCount; s++) {
								let point = $math.getPointOnCubicCurve(p1, p2, controlPointA, controlPointB, s / stepCount);
								realPoints.push(point);
								this._distance += $math.getDistance(prevPoint, point);
								//path += $path.lineTo(point);
								prevPoint = point;
							}
						}
						else {
							realPoints.push(p0);
						}
					}
				}
			}
			this.path = path;
		}
	}

	/**
	 * Horizontal tension for the spline.
	 *
	 * Used by the line smoothing algorithm.
	 *
	 * @default 0.5
	 * @param value  Tension
	 */
	public set tensionX(value: number) {
		this.setPropertyValue("tensionX", value);
		this.makePath();
	}

	/**
	 * @return Tension
	 */
	public get tensionX(): number {
		return this.getPropertyValue("tensionX");
	}

	/**
	 * Vertical tension for the spline.
	 *
	 * Used by the line smoothing algorithm.
	 *
	 * @default 0.5
	 * @param value  Tensions
	 */
	public set tensionY(value: number) {
		this.setPropertyValue("tensionY", value, true);
		this.makePath();
	}

	/**
	 * @return Tension
	 */
	public get tensionY(): number {
		return this.getPropertyValue("tensionY");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Polyspline"] = Polyspline;
