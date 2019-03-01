/**
 * Map spline module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapLine, IMapLineProperties, IMapLineAdapters, IMapLineEvents } from "./MapLine";
import { Polyspline } from "../../core/elements/Polyspline";
import { MapSplineSeriesDataItem, MapSplineSeries } from "./MapSplineSeries";
import { registry } from "../../core/Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[MapSpline]].
 */
export interface IMapSplineProperties extends IMapLineProperties { }

/**
 * Defines events for [[MapSpline]].
 */
export interface IMapSplineEvents extends IMapLineEvents { }

/**
 * Defines adapters for [[MapSpline]].
 *
 * @see {@link Adapter}
 */
export interface IMapSplineAdapters extends IMapLineAdapters, IMapSplineProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to draw a spline on the map.
 *
 * @see {@link IMapSplineEvents} for a list of available events
 * @see {@link IMapSplineAdapters} for a list of available Adapters
 */
export class MapSpline extends MapLine {

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapSplineProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapSplineAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapSplineEvents;

	/**
	 * A visual element for the spline.
	 */
	public line: Polyspline;

	/**
	 * A related data item.
	 */
	public _dataItem: MapSplineSeriesDataItem;

	/**
	 * A map series this object belongs to.
	 */
	public series: MapSplineSeries;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "MapSpline";

		// Apply theme
		this.applyTheme();
	}


	/**
	 * @ignore
	 */
	protected createLine(){
		this.line = new Polyspline();
		this.line.tensionX = 0.8;
		this.line.tensionY = 0.8;
	}


	/**
	 * ShortestDistance = true is not supported by MapSpline, only MapLine does support it
	 * @default false
	 * @param value
	 * @todo: review description
	 */
	public get shortestDistance(): boolean {
		return false;
	}

	public set shortestDistance(value: boolean) {

	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapSpline"] = MapSpline;
