/**
 * Step line series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { LineSeries, LineSeriesDataItem, ILineSeriesDataFields, ILineSeriesProperties, ILineSeriesAdapters, ILineSeriesEvents } from "./LineSeries";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { StepLineSeriesSegment } from "./StepLineSeriesSegment";
import { IPoint } from "../../core/defs/IPoint";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[StepLineSeries]].
 *
 * @see {@link DataItem}
 */
export class StepLineSeriesDataItem extends LineSeriesDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 *
	 * @type {StepLineSeries}
	 */
	public _component!: StepLineSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "StepLineSeriesDataItem";
		this.applyTheme();
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[StepLineSeries]].
 */
export interface IStepLineSeriesDataFields extends ILineSeriesDataFields { }

/**
 * Defines properties for [[StepLineSeries]].
 */
export interface IStepLineSeriesProperties extends ILineSeriesProperties {
	noRisers?: boolean;

	startLocation?: number;

	endLocation?: number;
}

/**
 * Defines events for [[StepLineSeries]].
 */
export interface IStepLineSeriesEvents extends ILineSeriesEvents { }

/**
 * Defines adapters for [[StepLineSeries]].
 *
 * @see {@link Adapter}
 */
export interface IStepLineSeriesAdapters extends ILineSeriesAdapters, IStepLineSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a step line graph.
 *
 * @see {@link IStepLineSeriesEvents} for a list of available Events
 * @see {@link IStepLineSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class StepLineSeries extends LineSeries {

	/**
	 * Defines the type of data fields used for the series.
	 *
	 * @type {IStepLineSeriesDataFields}
	 */
	public _dataFields: IStepLineSeriesDataFields;

	/**
	 * Defines available properties.
	 *
	 * @type {IStepLineSeriesProperties}
	 */
	public _properties!: IStepLineSeriesProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IStepLineSeriesAdapters}
	 */
	public _adapter!: IStepLineSeriesAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IStepLineSeriesEvents}
	 */
	public _events!: IStepLineSeriesEvents;

	/**
	 * Defines the type of data item.
	 *
	 * @type {StepLineSeriesDataItem}
	 */
	public _dataItem: StepLineSeriesDataItem;

	/**
	 */
	public _segment: StepLineSeriesSegment;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "StepLineSeries";
		this.applyTheme();
		this.startLocation = 0;
		this.endLocation = 1;
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return {StepLineSeriesDataItem} Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new StepLineSeriesDataItem();
	}

	/**
	 * [addPoints description]
	 *
	 * @todo Description
	 * @param {IPoint[]}           points     [description]
	 * @param {this["_dataItem"]}  dataItem   [description]
	 * @param {string}             xField     [description]
	 * @param {string}             yField     [description]
	 * @param {boolean}            backwards  [description]
	 */
	protected addPoints(points: IPoint[], dataItem: this["_dataItem"], xField: string, yField: string, backwards?: boolean): void {

		let startLocation = this.startLocation;
		let endLocation = this.endLocation;

		let x0: number = this.xAxis.getX(dataItem, xField, startLocation);
		let y0: number = this.yAxis.getY(dataItem, yField, startLocation);

		let x1: number = this.xAxis.getX(dataItem, xField, endLocation);
		let y1: number = this.yAxis.getY(dataItem, yField, endLocation);

		x0 = $math.fitToRange(x0, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
		y0 = $math.fitToRange(y0, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.

		x1 = $math.fitToRange(x1, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
		y1 = $math.fitToRange(y1, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.

		// this might make an impression that points are duplicated, and they indeed are, but this is needed to handle gaps in data
		if (!this.noRisers && this.connect) {
			if (points.length > 1) {
				let prevPoint: IPoint = points[points.length - 1];
				if (this.baseAxis == this.xAxis) {
					if (backwards) {
						points.push({ x: prevPoint.x, y: y1 });
					}
					else {
						points.push({ x: x0, y: prevPoint.y });
					}
				}
				if (this.baseAxis == this.yAxis) {
					if (backwards) {
						points.push({ x: x1, y: prevPoint.y });
					}
					else {
						points.push({ x: prevPoint.x, y: y0 });
					}
				}
			}
		}

		let point0: IPoint = { x: x0, y: y0 };
		let point1: IPoint = { x: x1, y: y1 };

		if (backwards) {
			points.push(point1, point0);
		}
		else {
			points.push(point0, point1);
		}
	}


	/**
	 * Draws the line segment.
	 *
	 * @param {LineSeriesSegment}  segment     Segment
	 * @param {IPoint[]}           points      Segment points
	 * @param {IPoint[]}           closePoints Segment close points
	 */
	protected drawSegment(segment: StepLineSeriesSegment, points: IPoint[], closePoints: IPoint[]): void {
		let vertical = false;
		if (this.yAxis == this.baseAxis) {
			vertical = true;
		}
		segment.drawSegment(points, closePoints, this.tensionX, this.tensionY, this.noRisers, vertical);
	}



	/**
	 * @ignore
	 */
	protected createSegment(): this["_segment"] {
		return new StepLineSeriesSegment();
	}

	/**
	 * Specifies if step line series should draw only horizontal (or only
	 * vertical, depending on base axis) lines, instead of connecting them with
	 * vertical (or horizontal) lines.
	 *
	 * @default false
	 * @param {boolean}  value  No risers
	 */
	public set noRisers(value: boolean) {
		if (this.setPropertyValue("noRisers", value)) {
			this.invalidateDataRange();
		}
	}

	/**
	 * @return {boolean} No risers
	 */
	public get noRisers(): boolean {
		return this.getPropertyValue("noRisers");
	}


	/**
	 * start location of the step
	 *
	 * @param {number} value Location (0-1)
	 * @default 0
	 */
	public set startLocation(value: number) {
		if (this.setPropertyValue("startLocation", value)) {
			this.invalidateDataRange();
		}
	}

	/**
	 * @return {number} Location (0-1)
	 */
	public get startLocation(): number {
		return this.getPropertyValue("startLocation");
	}

	/**
	 * Step end location.
	 *
	 * @param {number} value Location (0-1)
	 * #default 1
	 */
	public set endLocation(value: number) {
		if (this.setPropertyValue("endLocation", value)) {
			this.invalidateDataRange();
		}
	}

	/**
	 * @return {number} Location (0-1)
	 */
	public get endLocation(): number {
		return this.getPropertyValue("endLocation");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StepLineSeries"] = StepLineSeries;
registry.registeredClasses["StepLineSeriesDataItem"] = StepLineSeriesDataItem;
