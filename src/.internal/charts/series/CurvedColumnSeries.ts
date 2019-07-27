/**
 * CurvedColumnSeries module.
 *
 * Not recommended using if you use scrollbars or your chart is zoomable in some other way.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, IColumnSeriesDataFields, IColumnSeriesProperties, IColumnSeriesAdapters, IColumnSeriesEvents, ColumnSeriesDataItem } from "./ColumnSeries";
import { CurvedColumn } from "../elements/CurvedColumn";
import { registry } from "../../core/Registry";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[CurvedColumnSeries]].
 *
 * @see {@link DataItem}
 */
export class CurvedColumnSeriesDataItem extends ColumnSeriesDataItem {

	/**
	 * A sprite used to draw the column.
	 */
	public _column: CurvedColumn;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: CurvedColumnSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CurvedColumnSeriesDataItem";
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
 * Defines data fields for [[CurvedColumnSeries]].
 */
export interface ICurvedColumnSeriesDataFields extends IColumnSeriesDataFields { }

/**
 * Defines properties for [[CurvedColumnSeries]].
 */
export interface ICurvedColumnSeriesProperties extends IColumnSeriesProperties { }

/**
 * Defines events for [[CurvedColumnSeries]].
 */
export interface ICurvedColumnSeriesEvents extends IColumnSeriesEvents { }

/**
 * Defines adapters for [[CurvedColumnSeries]].
 *
 * @see {@link Adapter}
 */
export interface ICurvedColumnSeriesAdapters extends IColumnSeriesAdapters, ICurvedColumnSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a curved columns graph.
 *
 * @see {@link ICurvedColumnSeriesEvents} for a list of available Events
 * @see {@link ICurvedColumnSeriesAdapters} for a list of available Adapters
 * @important
 */
export class CurvedColumnSeries extends ColumnSeries {

	/**
	 * Defines type of the column.
	 */
	public _column: CurvedColumn;

	/**
	 * Defines type of the data item.
	 */
	public _dataItem: CurvedColumnSeriesDataItem;

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: ICurvedColumnSeriesDataFields

	/**
	 * Defines available properties.
	 */
	public _properties!: ICurvedColumnSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICurvedColumnSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICurvedColumnSeriesEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "CurvedColumnSeries";
		this.applyTheme();
	}

	/**
	 * Returns an element to use for the curved column.
	 *
	 * @ignore Exclude from docs
	 * @return Element.
	 */
	protected createColumnTemplate(): this["_column"] {
		return new CurvedColumn();
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
		column = dataItem.column;

		if (column) {
			let curvedColumn = dataItem.column.curvedColumn;

			curvedColumn.fill = dataItem.column.fill;

			if (this.baseAxis == this.yAxis) {
				column.orientation = "horizontal";
			}
			else {
				column.orientation = "vertical";
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
registry.registeredClasses["CurvedColumnSeries"] = CurvedColumnSeries;
registry.registeredClasses["CurvedColumnSeriesDataItem"] = CurvedColumnSeriesDataItem;
