/**
 * A module defining functionality for circular axis grid elements.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Grid, IGridProperties, IGridAdapters, IGridEvents } from "./Grid";
import { registry } from "../../core/Registry";
import { Percent } from "../../core/utils/Percent";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[GridCircular]].
 */
export interface IGridCircularProperties extends IGridProperties {

	/**
	 * Inner radius of the circular grid. (absolute or relative)
	 */
	innerRadius: number | Percent;

	/**
	 * Outer radius of the circular grid. (absolute or relative)
	 */
	radius: number | Percent;

}

/**
 * Defines events for [[GridCircular]].
 */
export interface IGridCircularEvents extends IGridEvents { }

/**
 * Defines adapters for [[GridCircular]].
 *
 * @see {@link Adapter}
 */
export interface IGridCircularAdapters extends IGridAdapters, IGridCircularProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a circular grid element for circular-type axis.
 *
 * @see {@link IGridCircularEvents} for a list of available events
 * @see {@link IGridCircularAdapters} for a list of available Adapters
 * @todo Review: container is better, as we'll be able to attach something to the GridCircular, also with 3d charts we might need some additional elements
 */
export class GridCircular extends Grid {

	/**
	 * Defines available properties.
	 */
	public _properties!: IGridCircularProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IGridCircularAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IGridCircularEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "GridCircular";
		this.pixelPerfect = false;
		this.applyTheme();
	}

	/**
	 * Inner radius of the circular grid. (absolute or relative)
	 *
	 * @param value Inner radius
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, true, false, 10, false);
	}

	/**
	 * @return Inner radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Outer radius of the circular grid. (absolute or relative)
	 *
	 * @param value Outer radius
	 */
	public set radius(value: number | Percent) {
		this.setPercentProperty("radius", value, true, false, 10, false);
	}

	/**
	 * @return Outer radius
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

}


/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["GridCircular"] = GridCircular;
