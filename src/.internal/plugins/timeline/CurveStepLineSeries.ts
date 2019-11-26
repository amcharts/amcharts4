/**
 * Curve step line series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { CurveLineSeries, CurveLineSeriesDataItem, ICurveLineSeriesAdapters, ICurveLineSeriesDataFields, ICurveLineSeriesEvents, ICurveLineSeriesProperties } from "./CurveLineSeries";
import { AxisRendererCurveX } from "./AxisRendererCurveX";
import { StepLineSeriesSegment } from "../../charts/series/StepLineSeriesSegment";
import { IPoint } from "../../core/defs/IPoint";
import { CurveChart } from "./CurveChart";
import { DateAxis } from "../../charts/axes/DateAxis";
import { registry } from "../../core/Registry";
//import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[CurveStepLineSeries]].
 *
 * @see {@link DataItem}
 */
export class CurveStepLineSeriesDataItem extends CurveLineSeriesDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: CurveStepLineSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CurveStepLineSeriesDataItem";
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
 * Defines data fields for [[CurveStepLineSeries]].
 */
export interface ICurveStepLineSeriesDataFields extends ICurveLineSeriesDataFields { }

/**
 * Defines properties for [[CurveStepLineSeries]].
 */
export interface ICurveStepLineSeriesProperties extends ICurveLineSeriesProperties {

	/**
	 * Relative location in cell where step should start.
	 *
	 * @default 0
	 */
	startLocation?: number;

	/**
	 * Relative location in cell where step should end.
	 *
	 * @default 1
	 */
	endLocation?: number;

}

/**
 * Defines events for [[CurveStepLineSeries]].
 */
export interface ICurveStepLineSeriesEvents extends ICurveLineSeriesEvents { }

/**
 * Defines adapters for [[CurveStepLineSeries]].
 *
 * @see {@link Adapter}
 */
export interface ICurveStepLineSeriesAdapters extends ICurveLineSeriesAdapters, ICurveStepLineSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a radar graph.
 *
 * @see {@link ICurveStepLineSeriesEvents} for a list of available Events
 * @see {@link ICurveStepLineSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class CurveStepLineSeries extends CurveLineSeries {

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: ICurveStepLineSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ICurveStepLineSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICurveStepLineSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICurveStepLineSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: CurveStepLineSeriesDataItem;

	/**
	 * A chart series belongs to.
	 */
	public _chart: CurveChart;

	/**
	 * Defines type for segment.
	 */
	public _segment: StepLineSeriesSegment;

	protected _previousPosition: number;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CurveStepLineSeries";

		this.startLocation = 0;
		this.endLocation = 1;

		this.applyTheme();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new CurveStepLineSeriesDataItem();
	}

	/**
	 * [addPoints description]
	 *
	 * @ignore
	 * @todo Description
	 * @param points    [description]
	 * @param dataItem  [description]
	 * @param xField    [description]
	 * @param yField    [description]
	 * @param backwards [description]
	 */
	protected addPoints(points: IPoint[], dataItem: this["_dataItem"], xField: string, yField: string, backwards?: boolean): void {

		let startLocation = this.startLocation;
		let endLocation = this.endLocation;
		if (backwards) {
			startLocation = this.endLocation;
			endLocation = this.startLocation;
		}

		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		let previousPosition = this._previousPosition;

		let rangeX = { start: xAxis.start, end: xAxis.end };
		let rangeY = { start: yAxis.start, end: yAxis.end };

		let xRenderer = <AxisRendererCurveX>xAxis.renderer;

		if (this.baseAxis == this.xAxis) {
			let count = Math.ceil(this.xAxis.axisLength / xRenderer.precisionStep / (this.endIndex - this.startIndex)) + 2;

			let step = Math.abs(endLocation - startLocation) / count;

			// this solves issues with missing values
			// this is not done for when y is date axis due to unlikely situation
			if (this.xAxis instanceof DateAxis) {
				let index = dataItem.index;
				if (backwards) {
					let nextDataItem = this.dataItems.getIndex(index - 1);
					let baseDuration = this.xAxis.baseDuration;

					if (nextDataItem) {
						let nextTime = nextDataItem.dateX.getTime();
						let currentTime = dataItem.dateX.getTime()
						if (nextTime < currentTime - baseDuration) {
							endLocation -= (currentTime - nextTime) / baseDuration - 1;
						}
					}
				}
				else {
					let nextDataItem = this.dataItems.getIndex(index + 1);
					let baseDuration = this.xAxis.baseDuration;

					if (nextDataItem) {
						let nextTime = nextDataItem.dateX.getTime();
						let currentTime = dataItem.dateX.getTime()
						if (nextTime > currentTime + baseDuration) {
							endLocation += (nextTime - currentTime) / baseDuration - 1;
						}
					}
				}
			}

			if (backwards) {
				for (let i = startLocation; i >= endLocation; i = i - step) {
					if (i < endLocation) {
						i = endLocation;
					}
					points.push(this.getPoint(dataItem, xField, yField, i, dataItem.locations[yField]));
				}
				points.push(this.getPoint(dataItem, xField, yField, endLocation, dataItem.locations[yField]));
			}
			else {
				for (let i = startLocation; i <= endLocation; i = i + step) {
					if (i > endLocation) {
						i = endLocation;
					}
					points.push(this.getPoint(dataItem, xField, yField, i, dataItem.locations[yField]));
				}

				points.push(this.getPoint(dataItem, xField, yField, endLocation, dataItem.locations[yField]));
			}
		}
		else {
			let positionX = xAxis.getPositionX(dataItem, xField, dataItem.locations[xField], "valueX", rangeX);
			let positionY = yAxis.getPositionY(dataItem, yField, startLocation, "valueY", rangeY);

			if ($type.isNumber(previousPosition)) {
				let count = Math.ceil((xAxis.axisLength / xRenderer.precisionStep) * (positionX - previousPosition) / (xAxis.end - xAxis.start)) + 2;
				let step = Math.abs((positionX - previousPosition) / count);

				if (positionX > previousPosition) {
					for (let i = previousPosition; i <= positionX; i = i + step) {
						if (i > positionX) {
							i = positionX;
						}
						points.push(xAxis.renderer.positionToPoint(i, positionY));
					}
				}
				else if (positionX < previousPosition) {
					for (let i = previousPosition; i >= positionX; i = i - step) {
						if (i < positionX) {
							i = positionX;
						}
						points.push(xAxis.renderer.positionToPoint(i, positionY));
					}
				}
			}

			let startPoint = this.getPoint(dataItem, xField, yField, dataItem.locations[xField], startLocation);
			if (startPoint) {
				points.push(startPoint);
			}
			let endPoint = this.getPoint(dataItem, xField, yField, dataItem.locations[xField], endLocation);
			if (endPoint) {
				points.push(endPoint);
			}

			this._previousPosition = positionX;
		}
	}

	//protected createSegment(): this["_segment"] {
	//	return new StepLineSeriesSegment();
	//}	

	/**
	 * Relative location in cell where step should start.
	 *
	 * @default 0
	 * @param value Location (0-1)
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
	 * Relative location in cell where step should end.
	 *
	 * @default 1
	 * @param value Location (0-1)
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
registry.registeredClasses["CurveStepLineSeries"] = CurveStepLineSeries;
registry.registeredClasses["CurveStepLineSeriesDataItem"] = CurveStepLineSeriesDataItem;
