/**
 * Curve line series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { LineSeries, LineSeriesDataItem, ILineSeriesDataFields, ILineSeriesProperties, ILineSeriesAdapters, ILineSeriesEvents } from "../../charts/series/LineSeries";
import { LineSeriesSegment } from "../../charts/series/LineSeriesSegment";
import { Axis } from "../../charts/axes/Axis";
import { IPoint } from "../../core/defs/IPoint";
import { CurveChart } from "./CurveChart";
import { AxisRendererCurveY } from "./AxisRendererCurveY";
import { AxisRendererCurveX } from "./AxisRendererCurveX";
import { registry } from "../../core/Registry";
import { Sprite } from "../../core/Sprite";
import * as $math from "../../core/utils/Math";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[CurveLineSeries]].
 *
 * @see {@link DataItem}
 */
export class CurveLineSeriesDataItem extends LineSeriesDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: CurveLineSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CurveLineSeriesDataItem";
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
 * Defines data fields for [[CurveLineSeries]].
 */
export interface ICurveLineSeriesDataFields extends ILineSeriesDataFields { }

/**
 * Defines properties for [[CurveLineSeries]].
 */
export interface ICurveLineSeriesProperties extends ILineSeriesProperties {

	/**
	 * Should the last and and first data points be connected, forming a complete
	 * closed circle?
	 *
	 * @default false
	 */
	connectEnds?: boolean;

	/**
	 * A relative part of an series elements allowed outside of the outer edge of
	 * the "plot area".
	 */
	topOffset?: number;

	/**
	 * A relative part of an series elements allowed outside of the inner edge of
	 * the "plot area".
	 */
	bottomOffset?: number;

}

/**
 * Defines events for [[CurveLineSeries]].
 */
export interface ICurveLineSeriesEvents extends ILineSeriesEvents { }

/**
 * Defines adapters for [[CurveLineSeries]].
 *
 * @see {@link Adapter}
 */
export interface ICurveLineSeriesAdapters extends ILineSeriesAdapters, ICurveLineSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a radar graph.
 *
 * @see {@link ICurveLineSeriesEvents} for a list of available Events
 * @see {@link ICurveLineSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class CurveLineSeries extends LineSeries {

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: ICurveLineSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ICurveLineSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICurveLineSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICurveLineSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: CurveLineSeriesDataItem;

	/**
	 * A chart series belongs to.
	 */
	public _chart: CurveChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CurveLineSeries";
		this.connectEnds = false;

		this.bulletsContainer.mask = new Sprite();

		this.topOffset = 0.2;
		this.bottomOffset = 0.2;

		this.applyTheme();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new CurveLineSeriesDataItem();
	}

	/**
	 * Returns an [[IPoint]] coordinates of the specific Serie's data point.
	 *
	 * @param    dataItem   Data item
	 * @param    xKey       Name of X data field
	 * @param    yKey       Name of Y data field
	 * @param    locationX  X location
	 * @param    locationY  Y location
	 * @param    stackKeyX  ?
	 * @param    stackKeyY  ?
	 * @returns             Coordinates
	 */
	public getPoint(dataItem: CurveLineSeriesDataItem, xKey: string, yKey: string, locationX?: number, locationY?: number, stackKeyX?: string, stackKeyY?: string) {
		if (!stackKeyX) {
			stackKeyX = "valueX";
		}
		if (!stackKeyY) {
			stackKeyY = "valueY";
		}

		let renderer: AxisRendererCurveY = <AxisRendererCurveY>this.yAxis.renderer;

		let radius: number = $math.fitToRange(this.yAxis.getY(dataItem, yKey, locationY, stackKeyY), -renderer.radius * (1 + this.bottomOffset), -renderer.innerRadius * (1 + this.topOffset));

		let xx: number = this.xAxis.getX(dataItem, xKey, locationX, stackKeyX);
		let xy: number = this.xAxis.getY(dataItem, xKey, locationX, stackKeyX);

		let angle: number = this.xAxis.getAngle(dataItem, xKey, locationX, stackKeyX);

		return { x: xx + radius * $math.cos(angle), y: xy + radius * $math.sin(angle) };
	}

	/**
	 * [addPoints description]
	 *
	 * @todo Description
	 * @param points    [description]
	 * @param dataItem  [description]
	 * @param xField    [description]
	 * @param yField    [description]
	 * @param backwards [description]
	 */
	protected addPoints(points: IPoint[], dataItem: this["_dataItem"], xField: string, yField: string, backwards?: boolean): void {
		let point = this.getPoint(dataItem, xField, yField, dataItem.locations[xField], dataItem.locations[yField]);
		if (point) {
			points.push(point);
		}
	}

	/**
	 * Returns an SVG path to be used as a mask for the series.
	 *
	 * @return SVG path
	 */
	protected getMaskPath(): string {
		let rendererY = this.yAxis.renderer;
		let path = rendererY.getPositionRangePath(this.yAxis.start, this.yAxis.end);

		let bulletsContainer = this.bulletsContainer;
		if (this.chart && this.chart.maskBullets) {
			if (!bulletsContainer.mask) {
				bulletsContainer.mask = new Sprite();
			}
			bulletsContainer.mask.path = path;
		}
		else {
			bulletsContainer.mask = undefined;
		}

		return path;
	}

	/**
	 * [drawSegment description]
	 *
	 * @todo Description
	 * @param segment      [description]
	 * @param points       [description]
	 * @param closePoints  [description]
	 */
	protected drawSegment(segment: LineSeriesSegment, points: IPoint[], closePoints: IPoint[]): void {
		if (this.connectEnds) {
			// adds one point to the beginning of closePoints array, if needed
			if (this.dataFields[<keyof this["_dataFields"]>this._xOpenField] ||
				this.dataFields[<keyof this["_dataFields"]>this._yOpenField] ||
				this.stacked) {
				points.push(points[0]);
				if (closePoints.length > 0) {
					closePoints.unshift(closePoints[closePoints.length - 1]);
				}
			}
		}
		super.drawSegment(segment, points, closePoints);
	}

	/**
	 * Should the last and and first data points be connected, forming a complete
	 * closed circle?
	 *
	 * @default false
	 * @param  value  Connect?
	 */
	public set connectEnds(value: boolean) {
		this.setPropertyValue("connectEnds", value, true);
	}

	/**
	 * @return Connect?
	 */
	public get connectEnds(): boolean {
		return this.getPropertyValue("connectEnds");
	}

	/**
	 * A relative part of an series elements allowed outside of the outer edge of
	 * the "plot area".
	 * 
	 * @default 0.2
	 * @param  value  Top offset
	 */
	public set topOffset(value: number) {
		this.setPropertyValue("topOffset", value, true);
	}

	/**
	 * @return Top offset
	 */
	public get topOffset(): number {
		return this.getPropertyValue("topOffset");
	}

	/**
	 * A relative part of an series elements allowed outside of the inner edge of
	 * the "plot area".
	 * 
	 * @default 0.2
	 * @param  value  Bottom offset
	 */
	public set bottomOffset(value: number) {
		this.setPropertyValue("bottomOffset", value, true);
	}

	/**
	 * @return Bottom offset
	 */
	public get bottomOffset(): number {
		return this.getPropertyValue("bottomOffset");
	}

	/**
	 * [positionBulletReal description]
	 *
	 * @param {Sprite} bullet    [description]
	 * @param {number} positionX [description]
	 * @param {number} positionY [description]
	 */
	protected positionBulletReal(bullet: Sprite, positionX: number, positionY: number) {
		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		if (positionX < xAxis.start || positionX > xAxis.end || positionY < yAxis.start || positionY > yAxis.end) {
			bullet.visible = false;
		}

		bullet.moveTo(this.xAxis.renderer.positionToPoint(positionX, positionY));
	}

	protected setXAxis(axis:Axis){
		super.setXAxis(axis);
		this.updateRendererRefs();
	}

	protected setYAxis(axis:Axis){
		super.setYAxis(axis);
		this.updateRendererRefs();
	}	

	protected updateRendererRefs(){
		let rendererX = <AxisRendererCurveX>this.xAxis.renderer;
		let rendererY = <AxisRendererCurveY>this.yAxis.renderer;

		rendererX.axisRendererY = rendererY;
		rendererY.axisRendererX = rendererX;		
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CurveLineSeries"] = CurveLineSeries;
registry.registeredClasses["CurveLineSeriesDataItem"] = CurveLineSeriesDataItem;
