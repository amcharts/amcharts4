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
import { IPoint, IOrientationPoint } from "../../core/defs/IPoint";
import { registry } from "../Registry";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
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
	 * Array of points of a spline with 1 px increment. used to get point by position
	 */
	public allPoints: IOrientationPoint[];

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

		this.allPoints = [];

		if (segments && segments.length > 0) {
			let path: string = "";
			this._realSegments = [];

			for (let i = 0, len = segments.length; i < len; i++) {
				let points: IPoint[] = segments[i];
				let realPoints: IPoint[] = [];
				this._realSegments.push(realPoints);

				if (points.length > 0) {

					let first: IPoint = points[0];
					let last: IPoint = points[points.length - 1];

					let closed: boolean = false;

					if ($math.round(first.x, 3) == $math.round(last.x) && $math.round(first.y) == $math.round(last.y)) {
						closed = true;
					}

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

						if (p === 0) {
							if (closed) {
								p0 = points[points.length - 2];
							}
							else {
								p0 = points[i];
							}
						} else if (p == points.length - 2) {
							if (closed) {
								p3 = points[1];
							}
							else {
								p3 = points[p + 1];
							}
						}

						let controlPointA: IPoint = $math.getCubicControlPointA(p0, p1, p2, p3, tensionX, tensionY);
						let controlPointB: IPoint = $math.getCubicControlPointB(p0, p1, p2, p3, tensionX, tensionY);

						path += $path.cubicCurveTo(p2, controlPointA, controlPointB);

						// now split to small segments so that we could have positionToPoint later
						let stepCount: number = Math.ceil($math.getCubicCurveDistance(p1, p2, controlPointA, controlPointB, 20)) * 1.2;
						let prevPoint: IPoint = p1;


						if (stepCount > 0) {

							// not good for curved charts
							//this.allPoints[0] = { x: points[0].x, y: points[0].y, angle: $math.getAngle(points[0], points[1]) };
							//realPoints.push(this.allPoints[0]);


							for (let s = 0; s <= stepCount; s++) {

								let point = $math.getPointOnCubicCurve(p1, p2, controlPointA, controlPointB, s / stepCount);

								if (point.x == prevPoint.x && point.y == prevPoint.y) {
									continue;
								}

								realPoints.push(point);

								let angle = $math.round($math.getAngle(prevPoint, point), 5);

								//this.allPoints.push({ x: point.x, y: point.y, angle: angle });
								this._distance += $math.getDistance(prevPoint, point);

								this.allPoints[Math.floor(this._distance)] = { x: point.x, y: point.y, angle: angle };
								prevPoint = point;
							}
						}
						else {
							realPoints.push(p0);
						}
					}
				}

				let allPoints = this.allPoints;
				if (allPoints.length > 1) {
					for (let i = 0; i < allPoints.length; i++) {
						if (!allPoints[i]) {
							if (i > 1) {
								allPoints[i] = allPoints[i - 1];
							}
							else {
								for (let k = 1; k < allPoints.length; k++) {
									if (allPoints[k]) {
										allPoints[i] = allPoints[k];
										break;
									}
								}
							}
						}
					}
				}
			}

			this.path = path;
		}
	}

	/**
	 * Returns an index of the point that is closest to specified coordinates.
	 * 
	 * @param   point  Reference point
	 * @return         Index
	 */
	public getClosestPointIndex(point: IPoint): number {
		let points = this.allPoints;

		let index: number;

		let closest: number = Infinity;
		if (points.length > 1) {
			for (let p = 1; p < points.length; p++) {
				let distance = $math.getDistance(point, points[p]);
				if (distance < closest) {
					index = p;
					closest = distance;
				}
			}
		}

		return index;
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

	/**
	 * Converts relative position along the line (0-1) into pixel coordinates.
	 *
	 * @param position  Position (0-1)
	 * @return Coordinates
	 */

	public positionToPoint(position: number, extend?: boolean): IOrientationPoint {

		let deltaAngle: number = 0;

		let allPoints = this.allPoints;
		let len = allPoints.length;

		if (!$type.isNumber(position)) {
			position = 0;
		}

		if (len > 1) {

			if (extend && len > 3) {
				if (position < 0) {

					if (position < -0.01) {
						position = -0.01;
					}

					let f0 = allPoints[0];
					let f1 = allPoints[1];

					let x = f0.x - (f0.x - f1.x) * len * position;
					let y = f0.y - (f0.y - f1.y) * len * position;

					return { x: x, y: y, angle: $math.getAngle(f0, f1) };
				}
				else if (position > 1) {

					if (position > 1.01) {
						position = 1.01;
					}

					let f0 = allPoints[allPoints.length - 2];
					let f1 = allPoints[allPoints.length - 3];

					let x = f0.x + (f0.x - f1.x) * len * (position - 1);
					let y = f0.y + (f0.y - f1.y) * len * (position - 1);

					return { x: x, y: y, angle: $math.getAngle(f0, { x: x, y: y }) };
				}
				else if (position == 1) {
					let point = allPoints[allPoints.length - 1]
					return { x: point.x, y: point.y, angle: point.angle };
				}
			}
			else {
				if (position < 0) {
					position = Math.abs(position);
					deltaAngle = 180;
				}

				if (position >= 1) {
					position = 0.9999999999999;
				}
			}


			let point = allPoints[Math.floor(position * len)];
			return { x: point.x, y: point.y, angle: point.angle + deltaAngle };
		}
		else if (len == 1) {
			let point = allPoints[0];
			return { x: point.x, y: point.y, angle: point.angle };
		}
		else {
			return { x: 0, y: 0, angle: 0 };
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Polyspline"] = Polyspline;
