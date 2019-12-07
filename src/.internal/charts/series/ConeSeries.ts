/**
 * ConeSeries module
 * Not recommended using if you use scrollbars or your chart is zoomable in some other way.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, IColumnSeriesDataFields, IColumnSeriesProperties, IColumnSeriesAdapters, IColumnSeriesEvents, ColumnSeriesDataItem } from "./ColumnSeries";
import { ConeColumn } from "../elements/ConeColumn";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[ConeSeries]].
 *
 * @see {@link DataItem}
 */
export class ConeSeriesDataItem extends ColumnSeriesDataItem {

	/**
	 * A sprite used to draw the column.
	 */
	public _column: ConeColumn;


	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: ConeSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ConeSeriesDataItem";
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
 * Defines data fields for [[ConeSeries]].
 */
export interface IConeSeriesDataFields extends IColumnSeriesDataFields { }

/**
 * Defines properties for [[ConeSeries]].
 */
export interface IConeSeriesProperties extends IColumnSeriesProperties { }

/**
 * Defines events for [[ConeSeries]].
 */
export interface IConeSeriesEvents extends IColumnSeriesEvents { }

/**
 * Defines adapters for [[ConeSeries]].
 *
 * @see {@link Adapter}
 */
export interface IConeSeriesAdapters extends IColumnSeriesAdapters, IConeSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a cone graph.
 *
 * @see {@link IConeSeriesEvents} for a list of available Events
 * @see {@link IConeSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class ConeSeries extends ColumnSeries {

	/**
	 * Type of column.
	 */
	public _column: ConeColumn;

	/**
	 */
	public _dataItem: ConeSeriesDataItem;

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: IConeSeriesDataFields

	/**
	 * Defines available properties.
	 */
	public _properties!: IConeSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IConeSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IConeSeriesEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "ConeSeries";
		this.applyTheme();
	}

	/**
	 * Returns an element to use for Candlestick
	 * @ignore
	 * @return Element.
	 */
	protected createColumnTemplate(): this["_column"] {
		return new ConeColumn();
	}

	/**
	 * Returns an SVG path to use as series mask.
	 *
	 * @return SVG path
	 */
	protected getMaskPath(): string {		
		let dx = 0;
		let dy = 0;
		let column = this.columns.getIndex(0);

		if(column){
			if (this.baseAxis == this.xAxis) {
				dy = column.coneColumn.innerWidth / 2 + 1
			}
			else {
				dx = column.coneColumn.innerHeight / 2 + 1;
			}

			return $path.rectToPath({
				x: -dx,
				y: 0,
				width: this.xAxis.axisLength + dx,
				height: this.yAxis.axisLength + dy
			});
		}
	}


	/**
	 * Validates data item's elements.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElementReal(dataItem: this["_dataItem"]): void {
		super.validateDataElementReal(dataItem);
		let column = dataItem.column;
		if(column){
			let coneColumn = dataItem.column.coneColumn;

			coneColumn.fill = dataItem.column.fill;

			if (this.baseAxis == this.yAxis) {
				coneColumn.orientation = "horizontal";
			}
			else {
				coneColumn.orientation = "vertical";
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
registry.registeredClasses["ConeSeries"] = ConeSeries;
registry.registeredClasses["ConeSeriesDataItem"] = ConeSeriesDataItem;
