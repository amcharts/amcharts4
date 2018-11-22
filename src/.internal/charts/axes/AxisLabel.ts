/**
 * Axis Label module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Label, ILabelProperties, ILabelAdapters, ILabelEvents } from "../../core/elements/Label";
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
 * Defines properties for [[AxisLabel]].
 */
export interface IAxisLabelProperties extends ILabelProperties {

	/**
	 * Relative location of the label. (0-1)
	 *
	 * @type {number}
	 */
	location?: number;

	/**
	 * Draw the label on the inside of the Axis?
	 *
	 * @type {boolean}
	 */
	inside?: boolean;

}

/**
 * Defines events for [[AxisLabel]].
 */
export interface IAxisLabelEvents extends ILabelEvents { }

/**
 * Defines adapters for [[AxisLabel]].
 *
 * @see {@link Adapter}
 */
export interface IAxisLabelAdapters extends ILabelAdapters, IAxisLabelProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Use to create labels on Axis.
 *
 * @see {@link IAxisLabelEvents} for a list of available events
 * @see {@link IAxisLabelAdapters} for a list of available Adapters
 * @important
 */
export class AxisLabel extends Label {

	/**
	 * Defines available properties.
	 *
	 * @type {IAxisLabelProperties}
	 */
	public _properties!: IAxisLabelProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IAxisLabelAdapters}
	 */
	public _adapter!: IAxisLabelAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IAxisLabelEvents}
	 */
	public _events!: IAxisLabelEvents;

	/**
	 * Related data item.
	 *
	 * @type {AxisDataItem}
	 */
	public _dataItem: AxisDataItem;

	/**
	 * A referecent to Axis element this fill is applied to.
	 *
	 * @type {Axis}
	 */
	public axis: Axis;	

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "AxisLabel";
		this.isMeasured = false;
		this.padding(10, 10, 10, 10);
		this.location = 0.5;
		this.nonScaling = true;
		this.applyTheme();
	}

	/**
	 * Relative location of the label. (0-1)
	 *
	 * @param {AxisItemLocation}  value  Location (0-1)
	 */
	public set location(value: AxisItemLocation) {
		this.setPropertyValue("location", value, true);
	}

	/**
	 * @return {AxisItemLocation} Location (0-1)
	 */
	public get location(): AxisItemLocation {
		return this.getPropertyValue("location");
	}

	/**
	 * Sets if label should be drawn inside axis.
	 *
	 * @param {boolean}  value  Inside?
	 */
	public set inside(value: boolean) {
		this.setPropertyValue("inside", value, true);
	}

	/**
	 * Returns if label is set to be drawn inside axis.
	 *
	 * @return {boolean} Inside?
	 */
	public get inside(): boolean {
		return this.getPropertyValue("inside");
	}


	/**
	 * @ignore
	 */
	protected setDisabled(value: boolean) {
		super.setDisabled(value);
		if(this.axis){
			this.axis.invalidateDataItems();
		}
	}	

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisLabel"] = AxisLabel;
