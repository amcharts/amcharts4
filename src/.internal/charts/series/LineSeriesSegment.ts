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
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Sprite, visualProperties } from "../../core/Sprite";
import { IPoint } from "../../core/defs/IPoint";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";
import * as $object from "../../core/utils/Object";
import { color } from "../../core/utils/Color";
import * as $smoothing from "../../core/rendering/Smoothing";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[LineSeriesSegment]].
 */
export interface ILineSeriesSegmentProperties extends IContainerProperties { }

/**
 * Defines events for [[LineSeriesSegment]].
 */
export interface ILineSeriesSegmentEvents extends IContainerEvents { }

/**
 * Defines adapters for [[LineSeriesSegment]].
 *
 * @see {@link Adapter}
 */
export interface ILineSeriesSegmentAdapters extends IContainerAdapters, ILineSeriesSegmentProperties { }


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
 * @see {@link ILineSeriesSegmentEvents} for a list of available events
 * @see {@link ILineSeriesSegmentAdapters} for a list of available Adapters
 * @todo Example
 */
export class LineSeriesSegment extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: ILineSeriesSegmentProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ILineSeriesSegmentAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ILineSeriesSegmentEvents;

	/**
	 * Segment's line element.
	 */
	public strokeSprite: Sprite;

	/**
	 * Segment's fill element.
	 */
	public fillSprite: Sprite;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "LineSeriesSegment";

		// Set defaults
		this.isMeasured = false;
		this.interactionsEnabled = false;
		this.layout = "none";

		// Create fill element
		let fillSprite = this.createChild(Sprite);
		this.fillSprite = fillSprite;
		fillSprite.shouldClone = false;
		fillSprite.setElement(this.paper.add("path"));
		fillSprite.isMeasured = false;
		this._disposers.push(fillSprite);


		// Create line element
		let strokeSprite = this.createChild(Sprite);
		this.strokeSprite = strokeSprite;
		strokeSprite.shouldClone = false;
		strokeSprite.fill = color();
		strokeSprite.setElement(this.paper.add("path"));
		strokeSprite.isMeasured = false;
		this._disposers.push(strokeSprite);
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
	public drawSegment(points: IPoint[], closePoints: IPoint[], smoothnessX: number, smoothnessY: number): void {
		if (!this.disabled) {
			if (points.length > 0 && closePoints.length > 0) {
				// first moveTo helps to avoid Chrome straight line in the mask bug.
				let path: string = $path.moveTo({ x: points[0].x - 0.2, y: points[0].y - 0.2 }) + $path.moveTo(points[0]) + new $smoothing.Tension(smoothnessX, smoothnessY).smooth(points);

				if (this.strokeOpacity == 0 || this.strokeSprite.strokeOpacity == 0) {
					// like this and not if != 0, otherwise ranges stroke won't be drawn.
				}
				else {
					this.strokeSprite.path = path;
				}

				if (this.fillOpacity > 0 || this.fillSprite.fillOpacity > 0) { // helps to avoid drawing fill object if fill is not visible
					path += $path.lineTo(closePoints[0]) + new $smoothing.Tension(smoothnessX, smoothnessY).smooth(closePoints);
					path += $path.lineTo(points[0]);
					path += $path.closePath();

					this.fillSprite.path = path;
				}
			}
			else {
				this.fillSprite.path = "";
				this.strokeSprite.path = "";
			}
		}
	}

	/**
	 * Copies properties from a [[Sprite]] to both line and fill elements.
	 *
	 * @param source Source [[Sprite]] to copy properties from
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);

		let lineElement = this.strokeSprite;
		$object.copyProperties(source, lineElement.properties, visualProperties);
		lineElement.events.copyFrom(source.strokeSprite.events);
		lineElement.fillOpacity = 0;

		let fillElement = this.fillSprite;
		$object.copyProperties(source, fillElement.properties, visualProperties);
		fillElement.events.copyFrom(source.fillSprite.events);
		fillElement.strokeOpacity = 0;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LineSeriesSegment"] = LineSeriesSegment;
