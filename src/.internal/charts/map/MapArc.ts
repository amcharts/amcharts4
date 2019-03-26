/**
 * Map arched line module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapLine, IMapLineProperties, IMapLineAdapters, IMapLineEvents } from "./MapLine";
import { Polyarc } from "../../core/elements/Polyarc";
import { registry } from "../../core/Registry";
import { MapArcSeries } from "./MapArcSeries";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[MapArc]].
 */
export interface IMapArcProperties extends IMapLineProperties { }

/**
 * Defines events for [[MapArc]].
 */
export interface IMapArcEvents extends IMapLineEvents { }

/**
 * Defines adapters for [[MapArc]].
 *
 * @see {@link Adapter}
 */
export interface IMapArcAdapters extends IMapLineAdapters, IMapArcProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to draw an arched line on the map.
 *
 * @see {@link IMapArcEvents} for a list of available events
 * @see {@link IMapArcAdapters} for a list of available Adapters
 */
export class MapArc extends MapLine {

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapArcProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapArcAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapArcEvents;

	/**
	 * A visual element.
	 */
	public line: Polyarc;

	/**
	 * A map series this object belongs to.
	 */
	public series: MapArcSeries;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "MapArc";

		// Apply theme
		this.applyTheme();
	}

	/**
	 * @ignore
	 */
	protected createLine(){
		this.line = new Polyarc();
	}


	/**
	 * `shortestDistance = true` is not supported by `MapArc`.
	 *
	 * Only [[MapLine]] supports it.
	 *
	 * @default false
	 * @param value
	 */
	public set shortestDistance(value: boolean) {

	}

	public get shortestDistance(): boolean {
		return false;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapArc"] = MapArc;
