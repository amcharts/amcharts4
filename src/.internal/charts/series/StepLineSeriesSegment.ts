/**
 * Line series segment module.
 * @todo Add description about what this is
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ILineSeriesSegmentAdapters, ILineSeriesSegmentEvents, ILineSeriesSegmentProperties, LineSeriesSegment } from "./LineSeriesSegment";
import { Sprite } from "../../core/Sprite";
import { IPoint } from "../../core/defs/IPoint";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[StepLineSeriesSegment]].
 */
export interface IStepLineSeriesSegmentProperties extends ILineSeriesSegmentProperties { }

/**
 * Defines events for [[StepLineSeriesSegment]].
 */
export interface IStepLineSeriesSegmentEvents extends ILineSeriesSegmentEvents { }

/**
 * Defines adapters for [[StepLineSeriesSegment]].
 *
 * @see {@link Adapter}
 */
export interface IStepLineSeriesSegmentAdapters extends ILineSeriesSegmentAdapters, IStepLineSeriesSegmentProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Represents a line series segment.
 *
 * A line segment can be used to apply different properties to a part of the
 * line series, between two data points.
 *
 * @see {@link IStepLineSeriesSegmentEvents} for a list of available events
 * @see {@link IStepLineSeriesSegmentAdapters} for a list of available Adapters
 * @todo Example
 */
export class StepLineSeriesSegment extends LineSeriesSegment {

	/**
	 * Defines available properties.
	 */
	public _properties!: IStepLineSeriesSegmentProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IStepLineSeriesSegmentAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IStepLineSeriesSegmentEvents;

	/**
	 * Segment's line element.
	 *
	 * @ignore Exclude from docs
	 */
	public strokeSprite: Sprite;

	/**
	 * Segment's fill element.
	 *
	 * @ignore Exclude from docs
	 */
	public fillSprite: Sprite;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "StepLineSeriesSegment";
	}

	/**
	 * Draws the series segment.
	 *
	 * @ignore Exclude from docs
	 * @param points       Points to connect
	 * @param closePoints  ?
	 * @param smoothnessX  Horizontal bezier setting (?)
	 * @param smoothnessY  Vertical bezier setting (?)
	 */
	public drawSegment(points: IPoint[], closePoints: IPoint[], smoothnessX: number, smoothnessY: number, noRisers?: boolean, vertical?: boolean): void {
		if (points.length > 0 && closePoints.length > 0) {

			if (noRisers) {
				let path: string = $path.moveTo(points[0]);
				if (points.length > 0) {
					for (let i = 1; i < points.length; i++) {
						let point = points[i];
						if (i / 2 == Math.round(i / 2)) {
							path += $path.moveTo(point);
						}
						else {
							path += $path.lineTo(point);
						}
					}
				}

				this.strokeSprite.path = path;

				if (this.fillOpacity > 0 || this.fillSprite.fillOpacity > 0) { // helps to avoid drawing fill object if fill is not visible
					path = $path.moveTo(points[0]) + $path.polyline(points);
					path += $path.lineTo(closePoints[0]) + $path.polyline(closePoints);
					path += $path.lineTo(points[0]);
					path += $path.closePath();

					this.fillSprite.path = path;
				}
				else {

				}
			}
			else {
				let path: string = $path.moveTo(points[0]) + $path.polyline(points);

				this.strokeSprite.path = path;

				if (this.fillOpacity > 0 || this.fillSprite.fillOpacity > 0) { // helps to avoid drawing fill object if fill is not visible
					path += $path.lineTo(closePoints[0]) + $path.polyline(closePoints);
					path += $path.lineTo(points[0]);
					path += $path.closePath();

					this.fillSprite.path = path;
				}
			}
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StepLineSeriesSegment"] = StepLineSeriesSegment;
