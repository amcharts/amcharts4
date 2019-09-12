/**
 * Module that defines everything related to building CurveColumns.
 * It is a container which has CurveColumn element which is a Slice.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Column, IColumnProperties, IColumnAdapters, IColumnEvents } from "../../charts/elements/Column";
import { Sprite } from "../../core/Sprite";
import { registry } from "../../core/Registry";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[CurveColumn]].
 */
export interface ICurveColumnProperties extends IColumnProperties { }

/**
 * Defines events for [[CurveColumn]].
 */
export interface ICurveColumnEvents extends IColumnEvents { }

/**
 * Defines adapters for [[CurveColumn]].
 *
 * @see {@link Adapter}
 */
export interface ICurveColumnAdapters extends IColumnAdapters, ICurveColumnProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Class used to create CurveColumns.
 *
 * @see {@link ICurveColumnEvents} for a list of available events
 * @see {@link ICurveColumnAdapters} for a list of available Adapters
 * @important
 */
export class CurveColumn extends Column {

	/**
	 * Defines available properties.
	 */
	public _properties!: ICurveColumnProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICurveColumnAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICurveColumnEvents;


	/**
	 * Radar column element
	 */
	public CurveColumn: Sprite;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CurveColumn";
	}

	/**
	 * @ignore
	 */
	protected createAssets() {
		this.CurveColumn = this.createChild(Sprite);
		this.CurveColumn.shouldClone = false;
		this.CurveColumn.strokeOpacity = undefined;
		// some dirty hack so that if user access column, it won't get error
		this.column = <any>this.CurveColumn;
	}

	/**
	 * Copies all parameters from another [[CurveColumn]].
	 *
	 * @param source Source CurveColumn
	 */
	public copyFrom(source: this) {
		super.copyFrom(source)
		if (this.CurveColumn) {
			this.CurveColumn.copyFrom(source.CurveColumn)
		}
	}
}

/**
 * Regiscolumn system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CurveColumn"] = CurveColumn;
