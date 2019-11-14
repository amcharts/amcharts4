/**
 * Radar column series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, IColumnSeriesProperties, IColumnSeriesDataFields, IColumnSeriesAdapters, IColumnSeriesEvents, ColumnSeriesDataItem } from "../series/ColumnSeries";
import { Sprite, visualProperties } from "../../core/Sprite";
import { RadarChart } from "../types/RadarChart";
import { AxisRendererRadial } from "../axes/AxisRendererRadial";
import { Axis } from "../axes/Axis";
import { AxisRendererCircular } from "../axes/AxisRendererCircular";
import { RadarColumn } from "../elements/RadarColumn";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";
import * as $math from "../../core/utils/Math";
import * as $object from "../../core/utils/Object";
import { Percent } from "../../core/utils/Percent";
import * as $iter from "../../core/utils/Iterator";
import * as $array from "../../core/utils/Array";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[RadarColumnSeries]].
 *
 * @see {@link DataItem}
 */
export class RadarColumnSeriesDataItem extends ColumnSeriesDataItem {

	/**
	 * A sprite used to draw the column.
	 */
	public _column: RadarColumn;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: RadarColumnSeries;

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
 * Defines data fields for [[RadarColumnSeries]].
 */
export interface IRadarColumnSeriesDataFields extends IColumnSeriesDataFields { }

/**
 * Defines properties for [[RadarColumnSeries]].
 */
export interface IRadarColumnSeriesProperties extends IColumnSeriesProperties { }

/**
 * Defines events for [[RadarColumnSeries]].
 */
export interface IRadarColumnSeriesEvents extends IColumnSeriesEvents { }

/**
 * Defines adapters for [[RadarColumnSeries]].
 *
 * @see {@link Adapter}
 */
export interface IRadarColumnSeriesAdapters extends IColumnSeriesAdapters, IRadarColumnSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a 3D column graph.
 *
 * @see {@link IRadarColumnSeriesEvents} for a list of available Events
 * @see {@link IRadarColumnSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class RadarColumnSeries extends ColumnSeries {

	/**
	 * Type of data item.
	 */
	public _dataItem: RadarColumnSeriesDataItem;

	/**
	 * Type of column.
	 */
	public _column: RadarColumn;

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: IRadarColumnSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IRadarColumnSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IRadarColumnSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IRadarColumnSeriesEvents;

	/**
	 * A chart series belongs to.
	 */
	public _chart: RadarChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "RadarColumnSeries";
		this.applyTheme();
	}

	/**
	 * Creates and returns a RadarColumn element to use as column in radar chart.
	 *
	 * @return RadarColumn.
	 */
	protected createColumnTemplate(): this["_column"] {
		return new RadarColumn();
	}

	/**
	 * (Re)validates the whole series, effectively causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {

		// so that radius would be updated
		if (this.chart.invalid) {
			this.chart.validate();
		}

		super.validate();
	}

	/**
	 * @ignore
	 */
	protected disableUnusedColumns(dataItem: ColumnSeriesDataItem) {
		if (dataItem) {
			if (dataItem.column) {
				dataItem.column.__disabled = true;
			}

			$iter.each(this.axisRanges.iterator(), (axisRange) => {
				let rangeColumn: Sprite = dataItem.rangesColumns.getKey(axisRange.uid);
				if (rangeColumn) {
					rangeColumn.__disabled = true;
				}
			});
		}
	}	

	/**
	 * Validates data item's element, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElementReal(dataItem: this["_dataItem"]): void {
		let startAngle = this.chart.startAngle;
		let endAngle = this.chart.endAngle;

		let yField: string = this.yField;
		let yOpenField: string = this.yOpenField;
		let xField: string = this.xField;
		let xOpenField: string = this.xOpenField;

		let lAngle: number;
		let rAngle: number;

		let tRadius: number;
		let bRadius: number;

		let startLocation = this.getStartLocation(dataItem);
		let endLocation = this.getEndLocation(dataItem);

		let cellAngle = (endAngle - startAngle) / (this.dataItems.length * (this.end - this.start));

		let radarColumn = dataItem.column;
		if (!radarColumn) {
			radarColumn = this.columns.create();
			dataItem.column = radarColumn;
			$object.forceCopyProperties(this.columns.template, radarColumn, visualProperties);
			dataItem.addSprite(radarColumn);
			radarColumn.paper = this.paper; // sometimes pattern is not drawn if is set with adapter without this.
			this.setColumnStates(radarColumn);
		}

		let width = radarColumn.width;
		let percentWidth = 100;

		if (width instanceof Percent) {
			percentWidth = width.percent;
		}

		let offset: number = $math.round((endLocation - startLocation) * (1 - percentWidth / 100) / 2, 5);
		startLocation += offset;
		endLocation -= offset;

		if (this.baseAxis == this.xAxis) {
			tRadius = $math.getDistance({ x: this.yAxis.getX(dataItem, yField, dataItem.locations[yField], "valueY"), y: this.yAxis.getY(dataItem, yField, dataItem.locations[yField], "valueY") });
			bRadius = $math.getDistance({ x: this.yAxis.getX(dataItem, yOpenField, dataItem.locations[yOpenField], "valueY"), y: this.yAxis.getY(dataItem, yOpenField, dataItem.locations[yOpenField], "valueY") });

			lAngle = this.xAxis.getAngle(dataItem, xOpenField, startLocation, "valueX");
			rAngle = this.xAxis.getAngle(dataItem, xField, endLocation, "valueX");

			startAngle = startAngle + startLocation * cellAngle;
			endAngle = endAngle - (1 - endLocation) * cellAngle;
		}
		else {
			tRadius = $math.getDistance({ x: this.yAxis.getX(dataItem, yField, startLocation, "valueY"), y: this.yAxis.getY(dataItem, yField, startLocation, "valueY") });
			bRadius = $math.getDistance({ x: this.yAxis.getX(dataItem, yOpenField, endLocation, "valueY"), y: this.yAxis.getY(dataItem, yOpenField, endLocation, "valueY") });

			lAngle = this.xAxis.getAngle(dataItem, xField, dataItem.locations[xField], "valueX");

			rAngle = this.xAxis.getAngle(dataItem, xOpenField, dataItem.locations[xOpenField], "valueX");
		}

		if (rAngle < lAngle) {
			let temp = rAngle;
			rAngle = lAngle;
			lAngle = temp;
		}

		lAngle = $math.fitToRange(lAngle, startAngle, endAngle);
		rAngle = $math.fitToRange(rAngle, startAngle, endAngle);

		let slice = radarColumn.radarColumn;

		slice.startAngle = lAngle;

		let arc = rAngle - lAngle;

		if (arc > 0) {
			slice.arc = arc;
			slice.radius = tRadius;
			slice.innerRadius = bRadius;
			radarColumn.__disabled = false;

			radarColumn.parent = this.columnsContainer;

			$iter.each(this.axisRanges.iterator(), (axisRange) => {
				let rangeColumn = dataItem.rangesColumns.getKey(axisRange.uid);
				if (!rangeColumn) {
					rangeColumn = this.columns.create();

					$object.forceCopyProperties(this.columns.template, rangeColumn, visualProperties);
					$object.copyProperties(axisRange.contents, rangeColumn, visualProperties); // need this because 3d columns are not in the same container

					if (rangeColumn.dataItem) {
						$array.remove(rangeColumn.dataItem.sprites, rangeColumn);
					}

					dataItem.addSprite(rangeColumn);
					rangeColumn.paper = this.paper; // sometimes pattern is not drawn if is set with adapter without this.					
					this.setColumnStates(rangeColumn);
					dataItem.rangesColumns.setKey(axisRange.uid, rangeColumn);
				}

				let slice = rangeColumn.radarColumn;
				slice.startAngle = lAngle;
				slice.arc = arc;
				slice.radius = tRadius;
				slice.innerRadius = bRadius;

				if (slice.invalid) {
					slice.paper = this.paper;
					slice.validate(); // validate as if it was used previously, it will flicker with previous dimensions
				}

				rangeColumn.__disabled = false;
				rangeColumn.parent = axisRange.contents;
			});
		}
		else {
			this.disableUnusedColumns(dataItem);
		}
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
	public getPoint(dataItem: RadarColumnSeriesDataItem, xKey: string, yKey: string, locationX?: number, locationY?: number, stackKeyX?: string, stackKeyY?: string) {

		if (!stackKeyX) {
			stackKeyX = "valueX";
		}
		if (!stackKeyY) {
			stackKeyY = "valueY";
		}

		let x: number = this.yAxis.getX(dataItem, yKey, locationY, stackKeyY);
		let y: number = this.yAxis.getY(dataItem, yKey, locationY, stackKeyY);

		let radius: number = $math.getDistance({ x: x, y: y });
		// hack to be able to determine angle later
		if (radius == 0) {
			radius = 0.00001;
		}

		let angle: number = this.xAxis.getAngle(dataItem, xKey, locationX, stackKeyX);

		return { x: radius * $math.cos(angle), y: radius * $math.sin(angle) };
	}


	/**
	 * Returns an SVG path to be used as a mask for the series.
	 *
	 * @return SVG path
	 */
	protected getMaskPath(): string {
		let renderer: AxisRendererRadial = <AxisRendererRadial>this.yAxis.renderer;
		return $path.arc(renderer.startAngle, renderer.endAngle - renderer.startAngle, renderer.pixelRadius, renderer.pixelInnerRadius);
	}

	protected positionBulletReal(bullet:Sprite, positionX:number, positionY:number){
		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		if(positionX < xAxis.start || positionX > xAxis.end || positionY < yAxis.start || positionY > yAxis.end){
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
		let rendererX = <AxisRendererCircular>this.xAxis.renderer;
		let rendererY = <AxisRendererRadial>this.yAxis.renderer;

		rendererX.axisRendererY = rendererY;
	}	
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["RadarColumnSeries"] = RadarColumnSeries;
registry.registeredClasses["RadarColumnSeriesDataItem"] = RadarColumnSeriesDataItem;
