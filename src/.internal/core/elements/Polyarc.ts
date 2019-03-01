/**
 * Module for a multi-part arched line.
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
 * Defines properties for [[Polyarc]].
 */
export interface IPolyarcProperties extends IPolylineProperties {

	/**
	 * Relative position along the line the control point is. (0-1)
	 *
	 * @default 0.5
	 */
	controlPointPosition: number;

	/**
	 * Relative distance of the control point. (0-1)
	 *
	 * Default is half the length of the line. (0.5)
	 *
	 * @default 0.5
	 */
	controlPointDistance: number;

}

/**
 * Defines events for [[Polyarc]].
 */
export interface IPolyarcEvents extends IPolylineEvents { }

/**
 * Defines adapters for [[Polyarc]].
 *
 * @see {@link Adapter}
 */
export interface IPolyarcAdapters extends IPolylineAdapters, IPolyarcProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a multi-part arched line.
 *
 * @see {@link IPolyarcEvents} for a list of available events
 * @see {@link IPolyarcAdapters} for a list of available Adapters
 */
export class Polyarc extends Polyline {

	/**
	 * Defines available properties.
	 */
	public _properties!: IPolyarcProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPolyarcAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPolyarcEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Polyarc";

		this.controlPointDistance = 0.5;
		this.controlPointPosition = 0.5;

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

		if (segments && segments.length > 0) {
			let path: string = "";
			this._realSegments = [];

			for (let i = 0, len = segments.length; i < len; i++) {
				let points: IPoint[] = segments[i];
				let realPoints: IPoint[] = [];
				this._realSegments.push(realPoints);
				if (points.length > 0) {
					path += $path.moveTo(points[0]);

					for (let p = 1; p < points.length; p++) {
						let pointA: IPoint = points[p - 1];
						let pointB: IPoint = points[p];

						let distanceAB: number = $math.getDistance(pointB, pointA);
						let cpDistance: number = distanceAB * this.controlPointDistance;
						let controlPointPosition: number = this.controlPointPosition;
						let angle: number = -$math.getAngle(pointA, pointB);

						let cpx: number = pointA.x + (pointB.x - pointA.x) * controlPointPosition * 0.5 - cpDistance * $math.sin(angle);
						let cpy: number = pointA.y + (pointB.y - pointA.y) * controlPointPosition * 0.5 - cpDistance * $math.cos(angle);
						let controlPoint1: IPoint = { x: cpx, y: cpy };

						let cpx2: number = pointA.x + (pointB.x - pointA.x) * controlPointPosition * 1.5 - cpDistance * $math.sin(angle);
						let cpy2: number = pointA.y + (pointB.y - pointA.y) * controlPointPosition * 1.5 - cpDistance * $math.cos(angle);
						let controlPoint2: IPoint = { x: cpx2, y: cpy2 };

						path += $path.cubicCurveTo(pointB, controlPoint1, controlPoint2);

						// we add a lot of points in order to get the position/angle later
						let stepCount: number = Math.ceil(distanceAB);
						let prevPoint: IPoint = pointA;
						if (stepCount > 0) {
							for (let i: number = 0; i <= stepCount; i++) {
								let point: IPoint = $math.getPointOnCubicCurve(pointA, pointB, controlPoint1, controlPoint2, i / stepCount);
								realPoints.push(point);
								this._distance += $math.getDistance(prevPoint, point);
								prevPoint = point;
							}
						}
						else {
							realPoints.push(pointA);
						}
					}
				}
			}
			this.path = path;
		}
	}

	/**
	 * Relative position along the line the control point is. (0-1)
	 *
	 * @default 0.5
	 * @param value  Position (0-1)
	 */
	public set controlPointPosition(value: number) {
		this.setPropertyValue("controlPointPosition", value);
		this.makePath();
	}

	/**
	 * @return Position (0-1)
	 */
	public get controlPointPosition(): number {
		return this.getPropertyValue("controlPointPosition");
	}

	/**
	 * Relative distance of the control point. (0-1)
	 *
	 * Default is half the length of the line. (0.5)
	 *
	 * @default 0.5
	 * @param value  Distance (0-1)
	 */
	public set controlPointDistance(value: number) {
		this.setPropertyValue("controlPointDistance", value);
		this.makePath();
	}

	/**
	 * @return Distance (0-1)
	 */
	public get controlPointDistance(): number {
		return this.getPropertyValue("controlPointDistance");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Polyarc"] = Polyarc;
