/**
 * Curve column series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, IColumnSeriesProperties, IColumnSeriesDataFields, IColumnSeriesAdapters, IColumnSeriesEvents, ColumnSeriesDataItem } from "../../charts/series/ColumnSeries";
import { Sprite } from "../../core/Sprite";
import { CurveChart } from "./CurveChart";
import { AxisRendererCurveX } from "./AxisRendererCurveX";
import { AxisRendererCurveY } from "./AxisRendererCurveY";
import { Axis } from "../../charts/axes/Axis";
//import { AxisRendererCircular } from "../axes/AxisRendererCircular";
import { CurveColumn } from "./CurveColumn";
import { registry } from "../../core/Registry";
import { ValueAxis } from "../../charts/axes/ValueAxis";
import { CategoryAxis } from "../../charts/axes/CategoryAxis";
import { IPoint } from "../../core/defs/IPoint";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import * as $path from "../../core/rendering/Path";
import * as $array from "../../core/utils/Array";



/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[CurveColumnSeries]].
 *
 * @see {@link DataItem}
 */
export class CurveColumnSeriesDataItem extends ColumnSeriesDataItem {

	/**
	 * A sprite used to draw the column.
	 */
	public _column: CurveColumn;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: CurveColumnSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ColumnSeriesDataItem";
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
 * Defines data fields for [[CurveColumnSeries]].
 */
export interface ICurveColumnSeriesDataFields extends IColumnSeriesDataFields { }

/**
 * Defines properties for [[CurveColumnSeries]].
 */
export interface ICurveColumnSeriesProperties extends IColumnSeriesProperties {

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
 * Defines events for [[CurveColumnSeries]].
 */
export interface ICurveColumnSeriesEvents extends IColumnSeriesEvents { }

/**
 * Defines adapters for [[CurveColumnSeries]].
 *
 * @see {@link Adapter}
 */
export interface ICurveColumnSeriesAdapters extends IColumnSeriesAdapters, ICurveColumnSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a 3D column graph.
 *
 * @see {@link ICurveColumnSeriesEvents} for a list of available Events
 * @see {@link ICurveColumnSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class CurveColumnSeries extends ColumnSeries {

	/**
	 */
	public _dataItem: CurveColumnSeriesDataItem;

	/**
	 */
	public _column: CurveColumn;

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: ICurveColumnSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ICurveColumnSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICurveColumnSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICurveColumnSeriesEvents;

	/**
	 * A chart series belongs to.
	 */
	public _chart: CurveChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CurveColumnSeries";

		this.bulletsContainer.mask = new Sprite();

		this.topOffset = 0.2;
		this.bottomOffset = 0.2;

		this.applyTheme();
	}

	/**
	 * Creates and returns a CurveColumn element to use as column in radar chart.
	 *
	 * @return CurveColumn.
	 */
	protected createColumnTemplate(): this["_column"] {
		return new CurveColumn();
	}

	/**
	 * Validates data item's element, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElementReal(dataItem: this["_dataItem"]): void {
		//let startAngle = this.chart.startAngle;
		//let endAngle = this.chart.endAngle;

		let yField: string = this.yField;
		let yOpenField: string = this.yOpenField;
		let xField: string = this.xField;
		let xOpenField: string = this.xOpenField;

		let startLocation = this.getStartLocation(dataItem);
		let endLocation = this.getEndLocation(dataItem);

		//let cellAngle = (endAngle - startAngle) / (this.dataItems.length * (this.end - this.start));

		let template: Sprite = this.columns.template;

		let percentWidth: number = template.percentWidth;
		let percentHeight: number = template.percentHeight;

		if ($type.isNaN(percentWidth)) {
			percentWidth = 100;
		}

		let points: IPoint[] = [];

		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		let axisRendererX: AxisRendererCurveX = <AxisRendererCurveX>xAxis.renderer;
		let middlePoint: IPoint;

		if (this.baseAxis == this.xAxis) {

			let offset: number = $math.round((endLocation - startLocation) * (1 - percentWidth / 100) / 2, 5);
			startLocation += offset;
			endLocation -= offset;

			let count = Math.ceil(this.xAxis.axisLength / axisRendererX.precisionStep / (this.endIndex - this.startIndex)) + 2;

			let step = (endLocation - startLocation) / count;

			let bottomLocation = dataItem.locations[yOpenField];
			let topLocation = dataItem.locations[yField];
			// otherwise gantt chart will start items in the middle of a cell
			if (this.yAxis instanceof ValueAxis) {
				if ((<any>this.dataFields)[this.yField] != (<any>this.dataFields)[this.yOpenField]) {
					bottomLocation = 0;
					topLocation = 0;
				}
			}
			else if (this.yAxis instanceof CategoryAxis) {
				if (!$type.isNaN(percentHeight)) {
					topLocation = 0;
					bottomLocation = 1;
					let offset: number = $math.round((1 - percentHeight / 100) / 2, 5);
					topLocation += offset;
					bottomLocation -= offset;
				}
			}

			for (let i = startLocation; i <= endLocation; i = i + step) {
				if (i > endLocation) {
					i = endLocation;
				}
				points.push(this.getPoint(dataItem, xField, yField, i, topLocation));
			}
			points.push(this.getPoint(dataItem, xField, yField, endLocation, topLocation));

			for (let i = endLocation; i >= startLocation; i = i - step) {
				if (i < startLocation) {
					i = startLocation;
				}
				points.push(this.getPoint(dataItem, xOpenField, yOpenField, i, bottomLocation));
			}
			points.push(this.getPoint(dataItem, xOpenField, yOpenField, startLocation, bottomLocation));

			middlePoint = this.getPoint(dataItem, xField, yField, startLocation + (endLocation - startLocation) / 2, 0.5);
		}
		else {

			let offset: number = $math.round((endLocation - startLocation) * (1 - percentHeight / 100) / 2, 5);
			startLocation += offset;
			endLocation -= offset;

			let rangeX = { start: xAxis.start, end: xAxis.end };
			let rangeY = { start: yAxis.start, end: yAxis.end };

			let rightLocation = dataItem.locations[xField];
			let leftLocation = dataItem.locations[xOpenField];

			// otherwise gantt chart will start items in the middle of a cell
			if (this.xAxis instanceof ValueAxis) {
				if ((<any>this.dataFields)[this.xField] != (<any>this.dataFields)[this.xOpenField]) {
					rightLocation = 0;
					leftLocation = 0;
				}
			}

			let openPositionX = xAxis.getPositionX(dataItem, xOpenField, leftLocation, "valueX", rangeX);
			let positionX = xAxis.getPositionX(dataItem, xField, rightLocation, "valueX", rangeX);

			let openPositionY = yAxis.getPositionY(dataItem, yOpenField, startLocation, "valueY", rangeY)
			let positionY = yAxis.getPositionY(dataItem, yField, endLocation, "valueY", rangeY)

			let count = Math.ceil((xAxis.axisLength / axisRendererX.precisionStep) * (positionX - openPositionX) / (xAxis.end - xAxis.start)) + 2;
			let step = (positionX - openPositionX) / count;

			if (positionX > openPositionX) {
				for (let i = openPositionX; i <= positionX; i = i + step) {
					if (i > positionX) {
						i = positionX;
					}
					points.push(xAxis.renderer.positionToPoint(i, openPositionY));
				}
				points.push(xAxis.renderer.positionToPoint(positionX, openPositionY));

				for (let i = positionX; i >= openPositionX; i = i - step) {
					if (i < openPositionX) {
						i = openPositionX;
					}
					points.push(xAxis.renderer.positionToPoint(i, positionY));
				}
				points.push(xAxis.renderer.positionToPoint(openPositionX, positionY));
			}

			middlePoint = xAxis.renderer.positionToPoint(openPositionX + (positionX - openPositionX) / 2, openPositionY + (positionY - openPositionY) / 2);
		}

		let column = dataItem.column;

		if (!column) {
			column = this.columns.create();
			dataItem.column = column;
			dataItem.addSprite(column);
			this.setColumnStates(column);
			column.paper = this.paper;
		}

		let CurveColumn = column.CurveColumn;
		if (points.length > 0) {
			points.push(points[0]);
		}
		CurveColumn.path = $path.pointsToPath(points);

		column.__disabled = false;
		column.parent = this.columnsContainer;

		column.tooltipX = middlePoint.x;
		column.tooltipY = middlePoint.y;

		column.CurveColumn.tooltipX = middlePoint.x;
		column.CurveColumn.tooltipY = middlePoint.y;

		this.axisRanges.each((axisRange) => {
			let rangeColumn = dataItem.rangesColumns.getKey(axisRange.uid);
			if (!rangeColumn) {
				rangeColumn = this.columns.create();

				if (rangeColumn.dataItem) {
					$array.remove(rangeColumn.dataItem.sprites, rangeColumn);
				}

				dataItem.addSprite(rangeColumn);
				rangeColumn.paper = this.paper;
				this.setColumnStates(rangeColumn);
				dataItem.rangesColumns.setKey(axisRange.uid, rangeColumn);
			}

			let rangeCurveColumn = rangeColumn.CurveColumn;
			rangeCurveColumn.path = CurveColumn.path;

			rangeColumn.__disabled = false;
			rangeColumn.parent = axisRange.contents;
		});

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
	public getPoint(dataItem: CurveColumnSeriesDataItem, xKey: string, yKey: string, locationX?: number, locationY?: number, stackKeyX?: string, stackKeyY?: string) {

		if (!stackKeyX) {
			stackKeyX = "valueX";
		}
		if (!stackKeyY) {
			stackKeyY = "valueY";
		}
		let renderer: AxisRendererCurveY = <AxisRendererCurveY>this.yAxis.renderer;
		//let radius = $math.fitToRange(this.yAxis.getY(dataItem, yKey, locationY, stackKeyY), renderer.innerRadius * (1 + this.bottomOffset), renderer.radius * (1 + this.topOffset));

		//let radius = this.yAxis.getY(dataItem, yKey, locationY, stackKeyY);

		let radius = $math.fitToRange(this.yAxis.getY(dataItem, yKey, locationY, stackKeyY), -renderer.radius * (1 + this.topOffset), -renderer.innerRadius * (1 + this.bottomOffset));
		let range = { start: this.xAxis.start, end: this.xAxis.end };

		let xx: number = this.xAxis.getX(dataItem, xKey, locationX, stackKeyX, range);
		let xy: number = this.xAxis.getY(dataItem, xKey, locationX, stackKeyX, range);

		let angle: number = this.xAxis.getAngle(dataItem, xKey, locationX, stackKeyX, range);

		return { x: xx + radius * $math.cos(angle), y: xy + radius * $math.sin(angle) };
	}

	/**
	 * Returns an SVG path to be used as a mask for the series.
	 *
	 * @return SVG path
	 */
	protected getMaskPath(): string {
		let renderer: AxisRendererCurveY = <AxisRendererCurveY>this.yAxis.renderer;
		let path = renderer.getPositionRangePath(renderer.axis.start, renderer.axis.end);

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
	 * @ignore
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

	protected setXAxis(axis: Axis) {
		super.setXAxis(axis);
		this.updateRendererRefs();
	}

	protected setYAxis(axis: Axis) {
		super.setYAxis(axis);
		this.updateRendererRefs();
	}

	protected updateRendererRefs() {
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
registry.registeredClasses["CurveColumnSeries"] = CurveColumnSeries;
registry.registeredClasses["CurveColumnSeriesDataItem"] = CurveColumnSeriesDataItem;
