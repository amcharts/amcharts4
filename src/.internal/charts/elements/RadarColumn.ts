/**
 * Module that defines everything related to building RadarColumns.
 * It is a container which has radarColumn element which is a Slice.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Column, IColumnProperties, IColumnAdapters, IColumnEvents } from "./Column";
import { Slice } from "../../core/elements/Slice";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[RadarColumn]].
 */
export interface IRadarColumnProperties extends IColumnProperties { }

/**
 * Defines events for [[RadarColumn]].
 */
export interface IRadarColumnEvents extends IColumnEvents { }

/**
 * Defines adapters for [[RadarColumn]].
 *
 * @see {@link Adapter}
 */
export interface IRadarColumnAdapters extends IColumnAdapters, IRadarColumnProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Class used to creates RadarColumns.
 *
 * @see {@link IRadarColumnEvents} for a list of available events
 * @see {@link IRadarColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export class RadarColumn extends Column {

	/**
	 * Defines available properties.
	 */
	public _properties!: IRadarColumnProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IRadarColumnAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IRadarColumnEvents;


	/**
	 * Radar column element
	 */
	public radarColumn: Slice;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "RadarColumn";
	}

	/**
	 * @ignore
	 */
	protected createAssets() {
		this.radarColumn = this.createChild(Slice);
		this.radarColumn.shouldClone = false;
		this.radarColumn.strokeOpacity = undefined;
		// some dirty hack so that if user access column, it won't get error
		this.column = <any>this.radarColumn;
	}

	/**
	 * Copies all parameters from another [[RadarColumn]].
	 *
	 * @param source Source RadarColumn
	 */
	public copyFrom(source: this) {
		super.copyFrom(source)
		if (this.radarColumn) {
			this.radarColumn.copyFrom(source.radarColumn);
		}
	}


	/**
	 * X coordinate for the slice tooltip.
	 *
	 * @return X
	 * @ignore
	 */
	public getTooltipX(): number {
		let value = this.getPropertyValue("tooltipX");
		if (!$type.isNumber(value)) {
			return this.radarColumn.getTooltipX();
		}
		return value;
	}

	/**
	 * Y coordinate for the slice tooltip.
	 *
	 * @return Y
	 * @ignore
	 */
	public getTooltipY(): number {
		let value = this.getPropertyValue("tooltipX");
		if (!$type.isNumber(value)) {
			return this.radarColumn.getTooltipY();
		}
		return value;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["RadarColumn"] = RadarColumn;
