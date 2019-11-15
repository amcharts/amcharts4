/**
 * Candlestick Series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, ColumnSeriesDataItem, IColumnSeriesDataFields, IColumnSeriesProperties, IColumnSeriesAdapters, IColumnSeriesEvents } from "./ColumnSeries";
import { GroupField, IXYSeriesGroupFields } from "./XYSeries";
import { visualProperties } from "../../core/Sprite";
import { Line } from "../../core/elements/Line";
import { Container } from "../../core/Container";
import { Candlestick } from "../elements/Candlestick";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $utils from "../../core/utils/Utils";
import * as $object from "../../core/utils/Object";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import { LegendDataItem } from "../../charts/Legend";
import { CalculatedValue } from "../../core/Component";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[CandlestickSeries]].
 *
 * @see {@link DataItem}
 */
export class CandlestickSeriesDataItem extends ColumnSeriesDataItem {

	/**
	 * A sprite used to draw the column.
	 */
	public _column: Candlestick;

	/**
	 * Defines a type of [[Component]] this data item is used for
	 * @todo Disabled to work around TS bug (see if we can re-enable it again)
	 */
	//public _component!: CandlestickSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.values.lowValueX = {};
		this.values.lowValueY = {};
		this.values.highValueX = {};
		this.values.highValueY = {};

		this.className = "CandlestickSeriesDataItem";

		this.applyTheme();
	}

	/**
	 * Low value for horizontal axis.
	 *
	 * @param value  Value
	 */
	public set lowValueX(value: number) {
		this.setValue("lowValueX", value);
	}

	/**
	 * @return Value
	 */
	public get lowValueX(): number {
		return this.values.lowValueX.value;
	}

	/**
	 * Low value for vertical axis.
	 *
	 * @param value  Value
	 */
	public set lowValueY(value: number) {
		this.setValue("lowValueY", value);
	}

	/**
	 * @return Value
	 */
	public get lowValueY(): number {
		return this.values.lowValueY.value;
	}

	/**
	 * High value for horizontal axis.
	 *
	 * @param value  Value
	 */
	public set highValueX(value: number) {
		this.setValue("highValueX", value);
	}

	/**
	 * @return Value
	 */
	public get highValueX(): number {
		return this.values.highValueX.value;
	}

	/**
	 * High value for vertical axis.
	 *
	 * @param value  Value
	 */
	public set highValueY(value: number) {
		this.setValue("highValueY", value);
	}

	/**
	 * @return Value
	 */
	public get highValueY(): number {
		return this.values.highValueY.value;
	}

	/**
	 * Close value for horizontal axis.
	 *
	 * This is an alias for `valueX` added for convenience only.
	 *
	 * @param value  Value
	 */
	public set closeValueX(value: number) {
		this.setValue("valueX", value);
	}

	/**
	 * @return Value
	 */
	public get closeValueX(): number {
		return this.values.valueX.value;
	}

	/**
	 * Close value for vertical axis.
	 *
	 * This is an alias for `valueX` added for convenience only.
	 *
	 * @param value  Value
	 */
	public set closeValueY(value: number) {
		this.setValue("valueY", value);
	}

	/**
	 * @return Value
	 */
	public get closeValueY(): number {
		return this.values.valueY.value;
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[CandlestickSeries]].
 */
export interface ICandlestickSeriesDataFields extends IColumnSeriesDataFields {

	/**
	 * Field name in data which holds low numeric value for horizontal axis.
	 */
	lowValueX?: string;

	/**
	 * Field name in data which holds low numeric value for vertical axis.
	 */
	lowValueY?: string;

	/**
	 * Field name in data which holds high numeric value for horizontal axis.
	 */
	highValueX?: string;

	/**
	 * Field name in data which holds low numeric value for vertical axis.
	 */
	highValueY?: string;

	/**
	 * Field name in data which holds low date for horizontal axis.
	 */
	lowDateX?: string;

	/**
	 * Field name in data which holds low date for vertical axis.
	 */
	lowDateY?: string;

	/**
	 * Field name in data which holds high date for horizontal axis.
	 */
	highDateX?: string;

	/**
	 * Field name in data which holds high date for vertical axis.
	 */
	highDateY?: string;

	/**
	 * Which calculated field to use to use as a horizontal axis high value for
	 * the item.
	 */
	highValueXShow?: CalculatedValue;

	/**
	 * Which calculated field to use to use as a horizontal axis low value for
	 * the item.
	 */
	lowValueXShow?: CalculatedValue;

	/**
	 * Which calculated field to use to use as a vertical axis low value for
	 * the item.
	 */
	lowValueYShow?: CalculatedValue;

	/**
	 * Which calculated field to use to use as a vertical axis high value for
	 * the item.
	 */
	highValueYShow?: CalculatedValue;

}

/**
 * Defines data fields that can be calculated for aggregate values.
 * 
 * @since 4.7.0
 */
export interface ICandlestickSeriesGroupFields extends IXYSeriesGroupFields {

	/**
	 * Indicates how to calculate aggregate value for `lowValueX` data field.
	 *
	 * @default "low"
	 */
	lowValueX?: GroupField;

	/**
	 * Indicates how to calculate aggregate value for `lowValueY` data field.
	 *
	 * @default "low"
	 */
	lowValueY?: GroupField;

	/**
	 * Indicates how to calculate aggregate value for `highValueX` data field.
	 *
	 * @default "high"
	 */
	highValueX?: GroupField;

	/**
	 * Indicates how to calculate aggregate value for `highValueY` data field.
	 *
	 * @default "high"
	 */
	highValueY?: GroupField;

}

/**
 * Defines properties for [[CandlestickSeries]].
 */
export interface ICandlestickSeriesProperties extends IColumnSeriesProperties { }

/**
 * Defines events for [[CandlestickSeries]].
 */
export interface ICandlestickSeriesEvents extends IColumnSeriesEvents { }

/**
 * Defines adapters for [[CandlestickSeries]].
 *
 * @see {@link Adapter}
 */
export interface ICandlestickSeriesAdapters extends IColumnSeriesAdapters, ICandlestickSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a candlestick graph.
 *
 * @see {@link ICandlestickSeriesEvents} for a list of available Events
 * @see {@link ICandlestickSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class CandlestickSeries extends ColumnSeries {

	/**
	 * Defines type of the group fields.
	 * 
	 * @ignore
	 * @since 4.7.0
	 */
	public _groupFields: ICandlestickSeriesGroupFields;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: CandlestickSeriesDataItem;

	/**
	 * Sets type of the column.
	 */
	public _column: Candlestick;

	/**
	 * Defines available data fields.
	 */
	public _dataFields: ICandlestickSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ICandlestickSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICandlestickSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICandlestickSeriesEvents;

	/**
	 * A data field to look for "low" value for horizontal axis.
	 */
	protected _xLowField: $type.Keyof<this["_dataFields"]>;

	/**
	 * A data field to look for "low" value for vertical axis.
	 */
	protected _yLowField: $type.Keyof<this["_dataFields"]>;

	/**
	 * A data field to look for "high" value for horizontal axis.
	 */
	protected _xHighField: $type.Keyof<this["_dataFields"]>;

	/**
	 * A data field to look for "high" value for vertical axis.
	 */
	protected _yHighField: $type.Keyof<this["_dataFields"]>;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CandlestickSeries";

		this.groupFields.lowValueX = "low";
		this.groupFields.lowValueY = "low";

		this.groupFields.highValueX = "high";
		this.groupFields.highValueY = "high";

		this.strokeOpacity = 1;

		let interfaceColors = new InterfaceColorSet();
		let positiveColor = interfaceColors.getFor("positive");
		let negativeColor = interfaceColors.getFor("negative");

		this.dropFromOpenState.properties.fill = negativeColor;
		this.dropFromOpenState.properties.stroke = negativeColor;

		this.riseFromOpenState.properties.fill = positiveColor;
		this.riseFromOpenState.properties.stroke = positiveColor;

		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Candlestick Series");
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new CandlestickSeriesDataItem();
	}

	/**
	 * Validates data item's element, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElementReal(dataItem: this["_dataItem"]): void {
		super.validateDataElementReal(dataItem);
		this.validateCandlestick(dataItem);
	}

	protected validateCandlestick(dataItem: this["dataItem"]) {
		let column: Candlestick = dataItem.column;
		if (column) {
			let lowLine = column.lowLine;
			let highLine = column.highLine;

			if (this.baseAxis == this.xAxis) {
				let x: number = column.pixelWidth / 2;

				lowLine.x = x;
				highLine.x = x;

				let open = dataItem.getWorkingValue(this.yOpenField);
				let close = dataItem.getWorkingValue(this.yField);

				let yOpen = this.yAxis.getY(dataItem, this.yOpenField);
				let yClose = this.yAxis.getY(dataItem, this.yField);
				let yLow = this.yAxis.getY(dataItem, this.yLowField);
				let yHigh = this.yAxis.getY(dataItem, this.yHighField);

				let pixelY = column.pixelY;

				lowLine.y1 = yLow - pixelY;
				highLine.y1 = yHigh - pixelY;

				if (open < close) {
					lowLine.y2 = yOpen - pixelY;
					highLine.y2 = yClose - pixelY;
				}
				else {
					lowLine.y2 = yClose - pixelY;
					highLine.y2 = yOpen - pixelY;
				}

			}
			if (this.baseAxis == this.yAxis) {
				let y: number = column.pixelHeight / 2;

				lowLine.y = y;
				highLine.y = y;

				let open = dataItem.getWorkingValue(this.xOpenField);
				let close = dataItem.getWorkingValue(this.xField);

				let xOpen = this.xAxis.getX(dataItem, this.xOpenField);
				let xClose = this.xAxis.getX(dataItem, this.xField);
				let xLow = this.xAxis.getX(dataItem, this.xLowField);
				let xHigh = this.xAxis.getX(dataItem, this.xHighField);

				let pixelX = column.pixelX;

				lowLine.x1 = xLow - pixelX;
				highLine.x1 = xHigh - pixelX;

				if (open < close) {
					lowLine.x2 = xOpen - pixelX;
					highLine.x2 = xClose - pixelX;
				}
				else {
					lowLine.x2 = xClose - pixelX;
					highLine.x2 = xOpen - pixelX;
				}
			}

			$iter.each(this.axisRanges.iterator(), (axisRange) => {
				// LOW LINE
				let rangeColumn = dataItem.rangesColumns.getKey(axisRange.uid);
				if (rangeColumn) {
					let rangeLowLine = rangeColumn.lowLine;
					rangeLowLine.x = lowLine.x;
					rangeLowLine.y = lowLine.y;
					rangeLowLine.x1 = lowLine.x1;
					rangeLowLine.x2 = lowLine.x2;
					rangeLowLine.y1 = lowLine.y1;
					rangeLowLine.y2 = lowLine.y2;

					// HIGH LINE
					let rangehighLine = rangeColumn.highLine;
					rangehighLine.x = highLine.x;
					rangehighLine.y = highLine.y;
					rangehighLine.x1 = highLine.x1;
					rangehighLine.x2 = highLine.x2;
					rangehighLine.y1 = highLine.y1;
					rangehighLine.y2 = highLine.y2;
				}
			});
		}
	}

	/**
	 * A data field to look for "low" value for horizontal axis.
	 *
	 * @ignore Exclude from docs
	 * @return Field name
	 */
	public get xLowField(): string {
		return this._xLowField;
	}

	/**
	 * A data field to look for "low" value for vertical axis.
	 *
	 * @ignore Exclude from docs
	 * @return Field name
	 */
	public get yLowField(): string {
		return this._yLowField;
	}

	/**
	 * A data field to look for "high" value for horizontal axis.
	 *
	 * @ignore Exclude from docs
	 * @return Field name
	 */
	public get xHighField(): string {
		return this._xHighField;
	}

	/**
	 * A data field to look for "high" value for vertical axis.
	 *
	 * @ignore Exclude from docs
	 * @return Field name
	 */
	public get yHighField(): string {
		return this._yHighField;
	}

	/**
	 * Sets up which data fields to use for data access.
	 */
	protected defineFields() {
		super.defineFields();

		let xAxis = this.xAxis;
		let yAxis = this.yAxis;
		if (xAxis && yAxis) {
			if (this.baseAxis == xAxis) {
				let yAxisFieldName: string = $utils.capitalize(yAxis.axisFieldName);
				this._yLowField = <$type.Keyof<this["_dataFields"]>>("low" + yAxisFieldName + "Y");
				this._yHighField = <$type.Keyof<this["_dataFields"]>>("high" + yAxisFieldName + "Y");
			}

			if (this.baseAxis == yAxis) {
				let xAxisFieldName: string = $utils.capitalize(xAxis.axisFieldName);
				this._xLowField = <$type.Keyof<this["_dataFields"]>>("low" + xAxisFieldName + "X");
				this._xHighField = <$type.Keyof<this["_dataFields"]>>("high" + xAxisFieldName + "X");
			}

			this.addValueField(xAxis, <any>this._xValueFields, <any>this._xLowField);
			this.addValueField(xAxis, <any>this._xValueFields, <any>this._xHighField);

			this.addValueField(yAxis, <any>this._yValueFields, <any>this._yLowField);
			this.addValueField(yAxis, <any>this._yValueFields, <any>this._yHighField);
		}
	}

	/**
	 * Creates elements in related legend container, that mimics the look of this
	 * Series.
	 *
	 * @ignore Exclude from docs
	 * @param marker  Legend item container
	 */
	public createLegendMarker(marker: Container): void {

		let w: number = marker.pixelWidth;
		let h: number = marker.pixelHeight;

		marker.removeChildren();

		let column: Candlestick = marker.createChild(Candlestick);
		column.shouldClone = false;
		column.copyFrom(<any>this.columns.template);

		let cw: number;
		let ch: number;

		let highLine: Line = column.lowLine;
		let lowLine: Line = column.highLine;

		if (this.baseAxis == this.yAxis) {
			cw = w / 3;
			ch = h;

			highLine.y = h / 2;
			lowLine.y = h / 2;

			highLine.x2 = w / 3;
			lowLine.x2 = w / 3;
			lowLine.x = w / 3 * 2;
			column.column.x = w / 3;
		}
		else {
			cw = w;
			ch = h / 3;
			highLine.x = w / 2;
			lowLine.x = w / 2;

			highLine.y2 = h / 3;
			lowLine.y2 = h / 3;
			lowLine.y = h / 3 * 2;
			column.column.y = h / 3;
		}
		column.width = cw;
		column.height = ch;

		$object.copyProperties(this, marker, visualProperties);
		$object.copyProperties(this.columns.template, column, visualProperties);

		column.stroke = this.riseFromOpenState.properties.stroke;
		column.fill = column.stroke;

		let legendDataItem = <LegendDataItem>marker.dataItem;
		legendDataItem.color = column.fill;
		legendDataItem.colorOrig = column.fill;
	}

	/**
	 * Returns an element to use for Candlestick
	 * @ignore
	 * @return Element.
	 */
	protected createColumnTemplate(): this["_column"] {
		return new Candlestick();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CandlestickSeries"] = CandlestickSeries;
registry.registeredClasses["CandlestickSeriesDataItem"] = CandlestickSeriesDataItem;
