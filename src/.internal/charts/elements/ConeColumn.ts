/**
 * Module that defines everything related to building Cone Columns.
 * It is a container which has coneColumn element which is a Cone.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Column, IColumnProperties, IColumnAdapters, IColumnEvents } from "./Column";
import { Cone } from "../../core/elements/3d/Cone";
import { registry } from "../../core/Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[ConeColumn]].
 */
export interface IConeColumnProperties extends IColumnProperties { }

/**
 * Defines events for [[ConeColumn]].
 */
export interface IConeColumnEvents extends IColumnEvents { }

/**
 * Defines adapters for [[ConeColumn]].
 *
 * @see {@link Adapter}
 */
export interface IConeColumnAdapters extends IColumnAdapters, IConeColumnProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Class used to creates ConeColumns.
 *
 * @see {@link IConeColumnEvents} for a list of available events
 * @see {@link IConeColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export class ConeColumn extends Column {

	/**
	 * Defines available properties.
	 */
	public _properties!: IConeColumnProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IConeColumnAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IConeColumnEvents;


	/**
	 * Cone column element
	 */
	public coneColumn: Cone;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ConeColumn";
	}

	/**
	 * @ignore
	 */
	createAssets() {
		this.coneColumn = this.createChild(Cone);
		this.coneColumn.shouldClone = false;

		// some dirty hack so that if user access column, it won't get error
		this.column = <any>this.coneColumn;
	}

	/**
	 * Copies all parameters from another [[ConeColumn]].
	 *
	 * @param source Source ConeColumn
	 */
	copyFrom(source: this) {
		super.copyFrom(source)
		if (this.coneColumn) {
			this.coneColumn.copyFrom(source.coneColumn);
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ConeColumn"] = ConeColumn;
