/**
 * Polyline module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../Sprite";
import { IPoint, IOrientationPoint } from "../defs/IPoint";
import { color } from "../utils/Color";
import { registry } from "../Registry";
import * as $path from "../rendering/Path";
import * as $math from "../utils/Math";
import * as $type from "../utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Polyline]].
 */
export interface IPolylineProperties extends ISpriteProperties {

	/**
	 * A list of segment coordinates for the multi-part line.
	 */
	segments?: Array<Array<IPoint>>;

}

/**
 * Defines events for [[Polyline]].
 */
export interface IPolylineEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[Polyline]].
 *
 * @see {@link Adapter}
 */
export interface IPolylineAdapters extends ISpriteAdapters, IPolylineProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a polyline.
 *
 * @see {@link IPolylineEvents} for a list of available events
 * @see {@link IPolylineAdapters} for a list of available Adapters
 */
export class Polyline extends Sprite {

	/**
	 * Defines available properties.
	 */
	public _properties!: IPolylineProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPolylineAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPolylineEvents;

	/**
	 * [_distance description]
	 *
	 * @todo Description
	 */
	protected _distance: number = 0;

	/**
	 * [_realSegments]
	 *
	 * @todo Description
	 */
	protected _realSegments: $type.Optional<Array<Array<IPoint>>>;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Polyline";
		this.element = this.paper.add("path");
		this.shapeRendering = "auto";
		this.fill = color();
		this.strokeOpacity = 1;

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

			for (let i = 0, len = segments.length; i < len; i++) {
				let points: IPoint[] = segments[i];
				if (points.length > 0) {
					path += $path.moveTo(points[0]);

					for (let p = 1; p < points.length; p++) {
						let point: IPoint = points[p];
						path += $path.lineTo(point);
						this._distance += $math.getDistance(points[p - 1], point);
					}
				}
			}
			this.path = path;
		}

		this._realSegments = segments;
	}

	/**
	 * A list of segment coordinates for the multi-part line.
	 *
	 * @todo Example
	 * @param segments  Segments
	 */
	public set segments(segments: $type.Optional<Array<Array<IPoint>>>) {
		this.setPropertyValue("segments", segments);
		this.makePath();
	}

	/**
	 * @return Segments
	 */
	public get segments(): $type.Optional<Array<Array<IPoint>>> {
		return this.getPropertyValue("segments");
	}

	/**
	 * [distance description]
	 *
	 * @todo Description
	 * @return [description]
	 */
	public get distance(): number {
		return this._distance;
	}

	/**
	 * Converts relative position along the line (0-1) into pixel coordinates.
	 *
	 * @param position  Position (0-1)
	 * @return Coordinates
	 */
	public positionToPoint(position: number): IOrientationPoint {

		let deltaAngle: number = 0;

		if (position < 0) {
			position = Math.abs(position);
			deltaAngle = 180;
		}

		let segments: $type.Optional<Array<Array<IPoint>>> = this._realSegments;
		if (segments) {
			let totalDistance: number = this.distance;
			let currentDistance: number = 0;

			let distanceAB: number;
			let positionA: number = 0;
			let positionB: number = 0;
			let pointA: IPoint;
			let pointB: IPoint;

			for (let s = 0; s < segments.length; s++) {
				let points: IPoint[] = segments[s];
				if (points.length > 1) {
					for (let p = 1; p < points.length; p++) {
						pointA = points[p - 1];
						pointB = points[p];

						positionA = currentDistance / totalDistance;
						distanceAB = $math.getDistance(pointA, pointB);
						currentDistance += distanceAB;
						positionB = currentDistance / totalDistance;

						if (positionA <= position && positionB > position) {
							s = segments.length;
							break;
						}
					}
				}
				else if (points.length == 1) {
					pointA = points[0];
					pointB = points[0];
					positionA = 0;
					positionB = 1;
				}
			}

			if (pointA && pointB) {
				let positionAB: number = (position - positionA) / (positionB - positionA);
				let midPoint: IPoint = $math.getMidPoint(pointA, pointB, positionAB);
				return { x: midPoint.x, y: midPoint.y, angle: deltaAngle + $math.getAngle(pointA, pointB) };
			}
		}
		return { x: 0, y: 0, angle: 0 };
	}

	/**
	 * @ignore
	 */
	public get realSegments():IPoint[][]{
		return this._realSegments;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Polyline"] = Polyline;
