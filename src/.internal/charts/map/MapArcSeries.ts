/**
 * Map arc series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapLineSeries, MapLineSeriesDataItem, IMapLineSeriesProperties, IMapLineSeriesDataFields, IMapLineSeriesAdapters, IMapLineSeriesEvents } from "./MapLineSeries";
import { MapArc } from "./MapArc";
import { registry } from "../../core/Registry";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[MapArcSeries]].
 *
 * @see {@link DataItem}
 */
export class MapArcSeriesDataItem extends MapLineSeriesDataItem {

	/**
	 * A [[MapArc]] element related to this data item.
	 */
	public _mapLine: MapArc;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: MapArcSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "MapArcSeriesDataItem";
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
 * Defines data fields for [[MapArcSeries]].
 */
export interface IMapArcSeriesDataFields extends IMapLineSeriesDataFields { }

/**
 * Defines properties for [[MapArcSeries]].
 */
export interface IMapArcSeriesProperties extends IMapLineSeriesProperties { }

/**
 * Defines events for [[MapArcSeries]].
 */
export interface IMapArcSeriesEvents extends IMapLineSeriesEvents { }

/**
 * Defines adapters for [[MapArcSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapArcSeriesAdapters extends IMapLineSeriesAdapters, IMapArcSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A series of arc elements. (curved lines)
 *
 * @see {@link IMapArcSeriesEvents} for a list of available Events
 * @see {@link IMapArcSeriesAdapters} for a list of available Adapters
 * @important
 */
export class MapArcSeries extends MapLineSeries {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IMapArcSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapArcSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapArcSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapArcSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: MapArcSeriesDataItem;

	/**
	 * Defines the type of the line items in this series.
	 */
	public _mapLine: MapArc;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "MapArcSeries";
		this.applyTheme();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new MapArcSeriesDataItem();
	}

	/**
	 * Returns a new line instance of suitable type.
	 *
	 * @return New line
	 */
	protected createLine(): this["_mapLine"] {
		return new MapArc();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapArcSeries"] = MapArcSeries;
registry.registeredClasses["MapArcSeriesDataItem"] = MapArcSeriesDataItem;
