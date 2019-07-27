/**
 * Candlestick Series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { CandlestickSeries, CandlestickSeriesDataItem, ICandlestickSeriesDataFields, ICandlestickSeriesProperties, ICandlestickSeriesAdapters, ICandlestickSeriesEvents } from "./CandlestickSeries";
import { visualProperties } from "../../core/Sprite";
import { Line } from "../../core/elements/Line";
import { Container } from "../../core/Container";
import { OHLC } from "../elements/OHLC";
import { registry } from "../../core/Registry";
import * as $object from "../../core/utils/Object";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import { LegendDataItem } from "../../charts/Legend";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[OHLCSeries]].
 *
 * @see {@link DataItem}
 */
export class OHLCSeriesDataItem extends CandlestickSeriesDataItem {

	/**
	 * A sprite used to draw the OHLC elements.
	 */
	public _column: OHLC;

	/**
	 * Defines a type of [[Component]] this data item is used for
	 * @todo Disabled to work around TS bug (see if we can re-enable it again)
	 */
	//public _component!: OHLCSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "OHLCSeriesDataItem";

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
 * Defines data fields for [[OHLCSeries]].
 */
export interface IOHLCSeriesDataFields extends ICandlestickSeriesDataFields { }

/**
 * Defines properties for [[OHLCSeries]].
 */
export interface IOHLCSeriesProperties extends ICandlestickSeriesProperties { }

/**
 * Defines events for [[OHLCSeries]].
 */
export interface IOHLCSeriesEvents extends ICandlestickSeriesEvents { }

/**
 * Defines adapters for [[OHLCSeries]].
 *
 * @see {@link Adapter}
 */
export interface IOHLCSeriesAdapters extends ICandlestickSeriesAdapters, IOHLCSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a candlestick graph.
 *
 * @see {@link IOHLCSeriesEvents} for a list of available Events
 * @see {@link IOHLCSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class OHLCSeries extends CandlestickSeries {

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: OHLCSeriesDataItem;

	/**
	 * Type of column.
	 */
	public _column: OHLC;

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IOHLCSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IOHLCSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IOHLCSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IOHLCSeriesEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "OHLCSeries";

		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("OHLC Series");
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new OHLCSeriesDataItem();
	}


	protected validateCandlestick(dataItem: this["_dataItem"]) {
		let column: OHLC = dataItem.column;
		if (column) {
			let openLine = column.openLine;
			let highLowLine = column.highLowLine;
			let closeLine = column.closeLine;

			if (this.baseAxis == this.xAxis) {
				let x: number = column.pixelWidth / 2;
				highLowLine.x = x;

				// TODO can these be removed ?
				dataItem.getWorkingValue(this.yOpenField);
				dataItem.getWorkingValue(this.yField);

				let yOpen = this.yAxis.getY(dataItem, this.yOpenField);
				let yClose = this.yAxis.getY(dataItem, this.yField);
				let yLow = this.yAxis.getY(dataItem, this.yLowField);
				let yHigh = this.yAxis.getY(dataItem, this.yHighField);

				let pixelY = column.pixelY;

				openLine.y1 = yOpen - pixelY;
				openLine.y2 = yOpen - pixelY;
				openLine.x1 = 0;
				openLine.x2 = x;

				closeLine.y1 = yClose - pixelY;
				closeLine.y2 = yClose - pixelY;
				closeLine.x1 = x;
				closeLine.x2 = 2 * x;

				highLowLine.y1 = yHigh - pixelY;
				highLowLine.y2 = yLow - pixelY;

			}
			if (this.baseAxis == this.yAxis) {
				let y: number = column.pixelHeight / 2;

				highLowLine.y = y;

				// TODO can these be removed ?
				dataItem.getWorkingValue(this.xOpenField);
				dataItem.getWorkingValue(this.xField);

				let xOpen = this.xAxis.getX(dataItem, this.xOpenField);
				let xClose = this.xAxis.getX(dataItem, this.xField);
				let xLow = this.xAxis.getX(dataItem, this.xLowField);
				let xHigh = this.xAxis.getX(dataItem, this.xHighField);

				let pixelX = column.pixelX;

				openLine.x1 = xOpen - pixelX;
				openLine.x2 = xOpen - pixelX;
				openLine.y1 = y;
				openLine.y2 = 2 * y;

				closeLine.x1 = xClose - pixelX;
				closeLine.x2 = xClose - pixelX;
				closeLine.y1 = 0;
				closeLine.y2 = y;

				highLowLine.x1 = xHigh - pixelX;
				highLowLine.x2 = xLow - pixelX;
			}

			$iter.each(this.axisRanges.iterator(), (axisRange) => {

				let rangeColumn = dataItem.rangesColumns.getKey(axisRange.uid);
				if (rangeColumn) {
					let rangeOpenLine = rangeColumn.openLine;
					rangeOpenLine.x = openLine.x;
					rangeOpenLine.y = openLine.y;
					rangeOpenLine.x1 = openLine.x1;
					rangeOpenLine.x2 = openLine.x2;
					rangeOpenLine.y1 = openLine.y1;
					rangeOpenLine.y2 = openLine.y2;

					let rangeCloseLine = rangeColumn.closeLine;
					rangeCloseLine.x = closeLine.x;
					rangeCloseLine.y = closeLine.y;
					rangeCloseLine.x1 = closeLine.x1;
					rangeCloseLine.x2 = closeLine.x2;
					rangeCloseLine.y1 = closeLine.y1;
					rangeCloseLine.y2 = closeLine.y2;

					let rangeHighLowLine = rangeColumn.highLowLine;
					rangeHighLowLine.x = highLowLine.x;
					rangeHighLowLine.y = highLowLine.y;
					rangeHighLowLine.x1 = highLowLine.x1;
					rangeHighLowLine.x2 = highLowLine.x2;
					rangeHighLowLine.y1 = highLowLine.y1;
					rangeHighLowLine.y2 = highLowLine.y2;
				}
			});
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

		let column: OHLC = marker.createChild(OHLC);
		column.shouldClone = false;
		column.copyFrom(<any>this.columns.template);

		let cw: number;
		let ch: number;

		let openLine: Line = column.openLine;
		let closeLine: Line = column.closeLine;
		let highLowLine: Line = column.highLowLine;

		if (this.baseAxis == this.yAxis) {
			cw = w / 3;
			ch = h;

			highLowLine.y = h / 2;
			highLowLine.x2 = w;

			openLine.x = w / 3 * 2;
			openLine.y2 = h / 2;

			closeLine.x = w / 3;
			closeLine.y2 = h;
			closeLine.y1 = h / 2;
		}
		else {
			cw = w;
			ch = h / 3;

			highLowLine.x = w / 2;
			highLowLine.y2 = h;

			openLine.y = h / 3 * 2;
			openLine.x2 = w / 2;

			closeLine.y = h / 3;
			closeLine.x2 = w;
			closeLine.x1 = w / 2;
		}
		column.width = cw;
		column.height = ch;

		$object.copyProperties(this, marker, visualProperties);
		$object.copyProperties(this.columns.template, column, visualProperties);

		column.stroke = this.riseFromOpenState.properties.stroke;

		let legendDataItem = <LegendDataItem>marker.dataItem;
		legendDataItem.color = column.stroke;
		legendDataItem.colorOrig = column.stroke;
	}

	/**
	 * Returns an element to use for Candlestick
	 * @ignore
	 * @return Element.
	 */
	protected createColumnTemplate(): this["_column"] {
		return new OHLC();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["OHLCSeries"] = OHLCSeries;
registry.registeredClasses["OHLCSeriesDataItem"] = OHLCSeriesDataItem;
