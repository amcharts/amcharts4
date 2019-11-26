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
	 */
	public _dataFields: IStepLineSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IStepLineSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IStepLineSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IStepLineSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: StepLineSeriesDataItem;

	/**
	 * Defines type for segement.
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
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new StepLineSeriesDataItem();
	}

	/**
	 * [addPoints description]
	 *
	 * @todo Description
	 * @param points     [description]
	 * @param dataItem   [description]
	 * @param xField     [description]
	 * @param yField     [description]
	 * @param backwards  [description]
	 */
	protected addPoints(points: IPoint[], dataItem: this["_dataItem"], xField: string, yField: string, backwards?: boolean): void {

		let startLocationX:number;
		let endLocationX:number;

		let startLocationY:number;
		let endLocationY:number;		

		if(this.baseAxis == this.xAxis){
			startLocationX = this.startLocation;
			endLocationX = this.endLocation;

			startLocationY = this.getAdjustedXLocation(dataItem, this.yOpenField);
			endLocationY = this.getAdjustedXLocation(dataItem, this.yField);
		}

		if(this.baseAxis == this.yAxis){
			startLocationY = this.startLocation;
			endLocationY = this.endLocation;

			startLocationX = this.getAdjustedXLocation(dataItem, this.xOpenField);
			endLocationX = this.getAdjustedXLocation(dataItem, this.xField);			
		}


		let x0: number = this.xAxis.getX(dataItem, xField, startLocationX);
		let y0: number = this.yAxis.getY(dataItem, yField, startLocationY);

		let x1: number = this.xAxis.getX(dataItem, xField, endLocationX);
		let y1: number = this.yAxis.getY(dataItem, yField, endLocationY);

		x0 = $math.fitToRange(x0, -100000, 100000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
		y0 = $math.fitToRange(y0, -100000, 100000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.

		x1 = $math.fitToRange(x1, -100000, 100000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
		y1 = $math.fitToRange(y1, -100000, 100000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.

		// this might make an impression that points are duplicated, and they indeed are, but this is needed to handle gaps in data
		if (!this.noRisers) {
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
	 * @param segment     Segment
	 * @param points      Segment points
	 * @param closePoints Segment close points
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
	 * @param value  No risers
	 */
	public set noRisers(value: boolean) {
		this.setPropertyValue("noRisers", value, true);
	}

	/**
	 * @return No risers
	 */
	public get noRisers(): boolean {
		return this.getPropertyValue("noRisers");
	}


	/**
	 * start location of the step
	 *
	 * @param value Location (0-1)
	 * @default 0
	 */
	public set startLocation(value: number) {
		this.setPropertyValue("startLocation", value, true);
	}

	/**
	 * @return Location (0-1)
	 */
	public get startLocation(): number {
		return this.getPropertyValue("startLocation");
	}

	/**
	 * Step end location.
	 *
	 * @param value Location (0-1)
	 * #default 1
	 */
	public set endLocation(value: number) {
		this.setPropertyValue("endLocation", value, true);
	}

	/**
	 * @return Location (0-1)
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
