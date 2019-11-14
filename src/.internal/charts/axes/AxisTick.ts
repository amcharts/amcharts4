/**
 * Axis Tick module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Tick, ITickProperties, ITickAdapters, ITickEvents } from "../elements/Tick";
import { AxisItemLocation, AxisDataItem, Axis } from "./Axis";
import { registry } from "../../core/Registry";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisTick]].
 */
export interface IAxisTickProperties extends ITickProperties {
	/**
	 * Relative location of the tick. (0-1)
	 */
	location?: number;

	/**
	 * Draw the tick on the inside of the Axis?
	 */
	inside?: boolean;

	/**
	 * Normally fill goes below series. Set this to `true` to go above.
	 *
	 * @default false
	 */
	above?: boolean;
}

/**
 * Defines events for [[AxisTick]].
 */
export interface IAxisTickEvents extends ITickEvents {

}

/**
 * Defines adapter for [[AxisTick]].
 *
 * @see {@link Adapter}
 */
export interface IAxisTickAdapters extends ITickAdapters, IAxisTickProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws an axis tick
 * @see {@link IAxisTickEvents} for a list of available events
 * @see {@link IAxisTickAdapters} for a list of available Adapters
 */
export class AxisTick extends Tick {

	/**
	 * Defines available properties
	 */
	public _properties!: IAxisTickProperties;

	/**
	 * Defines available adapters
	 */
	public _adapter!: IAxisTickAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisTickEvents;

	public _dataItem: AxisDataItem;

	/**
	 * A referece to Axis element this tick is placed on.
	 */
	public axis: Axis;

	constructor() {
		super();

		this.className = "AxisTick";

		this.element = this.paper.add("path");

		this.location = 0.5;

		this.above = false;

		this.isMeasured = false;

		this.pixelPerfect = true;

		this.strokeOpacity = 0;

		this.length = 5;

		this.applyTheme();
	}

	/**
	 * Relative location of the tick. (0-1)
	 *
	 * @param value  Location (0-1)
	 */
	public set location(value: AxisItemLocation) {
		this.setPropertyValue("location", value, true);
	}

	/**
	 * @return Location (0-1)
	 */
	public get location(): AxisItemLocation {
		return this.getPropertyValue("location");
	}

	/**
	 * Sets if tick should be drawn inside axis.
	 *
	 * @param value  Inside?
	 */
	public set inside(value: boolean) {
		this.setPropertyValue("inside", value, true);
	}

	/**
	 * Returns if label is set to be drawn inside axis.
	 *
	 * @return Inside?
	 */
	public get inside(): boolean {
		return this.getPropertyValue("inside");
	}

	/**
	 * Normally tick goes below series. Set this to `true` to go above.
	 *
	 * @default false
	 * @since 4.5.9
	 * @param  value  Draw above series?
	 */
	public set above(value: boolean) {
		this.setPropertyValue("above", value, true);
	}

	/**
	 * @return Draw above series?
	 */
	public get above(): boolean {
		return this.getPropertyValue("above");
	}

	/**
	 * @ignore
	 */
	protected setDisabled(value: boolean): boolean {
		let changed = super.setDisabled(value);
		if (this.axis) {
			this.axis.invalidateDataItems();
		}
		return changed;
	}
}


/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisTick"] = AxisTick;
