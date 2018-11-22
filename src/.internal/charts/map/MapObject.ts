/**
 * Map object module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { MapSeries } from "./MapSeries";
import { registry } from "../../core/Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines propeties for [[MapObject]].
 */
export interface IMapObjectProperties extends IContainerProperties { }

/**
 * Defines events for [[MapObject]].
 */
export interface IMapObjectEvents extends IContainerEvents { }

/**
 * Defines adapters for [[MapObject]].
 *
 * @see {@link Adapter}
 */
export interface IMapObjectAdapters extends IContainerAdapters, IMapObjectProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A base class for all map objects: lines, images, etc.
 *
 * @see {@link IMapObjectEvents} for a list of available events
 * @see {@link IMapObjectAdapters} for a list of available Adapters
 */
export class MapObject extends Container {

	/**
	 * Defines available properties.
	 *
	 * @type {IMapObjectProperties}
	 */
	public _properties!: IMapObjectProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IMapObjectAdapters}
	 */
	public _adapter!: IMapObjectAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IMapObjectEvents}
	 */
	public _events!: IMapObjectEvents;

	/**
	 * A map series this object belongs to.
	 *
	 * @type {MapSeries}
	 */
	public series: MapSeries;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "MapObject";

		// Set defaults
		this.isMeasured = false;
		this.layout = "none";
		this.clickable = true;

		// Apply theme
		this.applyTheme();

	}

	/**
	 * (Re)validates this object, forcing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		if (this.series) {
			this.readerTitle = this.series.itemReaderText;
		}
		super.validate();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapObject"] = MapObject;
