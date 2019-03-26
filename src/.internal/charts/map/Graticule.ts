/**
 * Graticule (map grid line).
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapLine, IMapLineProperties, IMapLineAdapters, IMapLineEvents } from "./MapLine";
import { registry } from "../../core/Registry";
import { GraticuleSeries } from "./GraticuleSeries";
import { Polyline } from "../../core/elements/Polyline";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Graticule]].
 */
export interface IGraticuleProperties extends IMapLineProperties { }

/**
 * Defines events for [[Graticule]].
 */
export interface IGraticuleEvents extends IMapLineEvents { }

/**
 * Defines adapters for [[Graticule]].
 *
 * @see {@link Adapter}
 */
export interface IGraticuleAdapters extends IMapLineAdapters, IGraticuleProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Graticule is a map line spanning from the poles or around the globe.
 *
 * @since 4.3.0
 * @see {@link IGraticuleEvents} for a list of available events
 * @see {@link IGraticuleAdapters} for a list of available Adapters
 */
export class Graticule extends MapLine {

	/**
	 * Defines available properties.
	 */
	public _properties!: IGraticuleProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IGraticuleAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IGraticuleEvents;

	/**
	 * A visual element.
	 */
	public line: Polyline;

	/**
	 * A map series this object belongs to.
	 */
	public series: GraticuleSeries;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Graticule";

		// Apply theme
		this.applyTheme();

		this.shortestDistance = true;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Graticule"] = Graticule;
