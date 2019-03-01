/**
 * Map spline series module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapLineSeries, MapLineSeriesDataItem, IMapLineSeriesProperties, IMapLineSeriesDataFields, IMapLineSeriesAdapters, IMapLineSeriesEvents } from "./MapLineSeries";
import { MapSpline } from "./MapSpline";
import { registry } from "../../core/Registry";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[MapSplineSeries]]
 * @see {@link DataItem}
 */
export class MapSplineSeriesDataItem extends MapLineSeriesDataItem {

	/**
	 * A [[MapSpline]] element related to this data item.
	 */
	public _mapLine: MapSpline;

	/**
	 * Defines a type of [[Component]] this data item is used for
	 */
	public _component!: MapSplineSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "MapSplineSeriesDataItem";
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
 * Defines data fields for [[MapSplineSeries]].
 */
export interface IMapSplineSeriesDataFields extends IMapLineSeriesDataFields { }

/**
 * Defines properties for [[MapSplineSeries]].
 */
export interface IMapSplineSeriesProperties extends IMapLineSeriesProperties { }

/**
 * Defines events for [[MapSplineSeries]].
 */
export interface IMapSplineSeriesEvents extends IMapLineSeriesEvents { }

/**
 * Defines adapters for [[MapSplineSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapSplineSeriesAdapters extends IMapLineSeriesAdapters, IMapSplineSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A series of map spline elements.
 *
 * @see {@link IMapSplineSeriesEvents} for a list of available Events
 * @see {@link IMapSplineSeriesAdapters} for a list of available Adapters
 * @important
 */
export class MapSplineSeries extends MapLineSeries {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IMapSplineSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapSplineSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapSplineSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapSplineSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: MapSplineSeriesDataItem;

	/**
	 * Defines the type of the line items in this series.
	 */
	public _mapLine: MapSpline;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "MapSplineSeries";
		this.applyTheme();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new MapSplineSeriesDataItem();
	}

	/**
	 * Returns a new line instance of suitable type.
	 *
	 * @return New line
	 */
	protected createLine(): this["_mapLine"] {
		return new MapSpline();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapSplineSeries"] = MapSplineSeries;
registry.registeredClasses["MapSplineSeriesDataItem"] = MapSplineSeriesDataItem;
