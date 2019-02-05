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
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
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
	location?: number;
	inside?: boolean;
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
	 * A referecent to Axis element this fill is applied to.
	 */
	public axis: Axis;

	constructor() {
		super();

		this.className = "AxisTick";

		this.element = this.paper.add("path");

		this.location = 0.5;

		this.isMeasured = false;

		this.pixelPerfect = true;

		this.strokeOpacity = 0;

		this.length = 5;

		this.applyTheme();
	}

	set location(value: AxisItemLocation) {
		this.setPropertyValue("location", value, true);
	}

	get location(): AxisItemLocation {
		return this.getPropertyValue("location");
	}

	set inside(value: boolean) {
		this.setPropertyValue("inside", value, true);
	}

	get inside(): boolean {
		return this.getPropertyValue("inside");
	}


	/**
	 * @ignore
	 */
	protected setDisabled(value: boolean):boolean {
		let changed = super.setDisabled(value);
		if(this.axis){
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
