/**
 * A module defining functionality for axis grid elements.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteEvents, ISpriteAdapters } from "../../core/Sprite";
import { AxisItemLocation, AxisDataItem, Axis } from "./Axis";
import { registry } from "../../core/Registry";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { defaultRules, ResponsiveBreakpoints } from "../../core/utils/Responsive";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Grid]].
 */
export interface IGridProperties extends ISpriteProperties {

	/**
	 * Location of the grid item within cell. (0-1)
	 */
	location?: AxisItemLocation;

	/**
	 * Normally fill goes below series. Set this to `true` to go above.
	 *
	 * @default false
	 */
	above?: boolean;
}

/**
 * Defines events for [[Grid]].
 */
export interface IGridEvents extends ISpriteEvents { }

/**
 * Defines adapters  for [[Grid]].
 *
 * @see {@link Adapter}
 */
export interface IGridAdapters extends ISpriteAdapters, IGridProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Displays an axis grid line.
 *
 * @see {@link IGridEvents} for a list of available events
 * @see {@link IGridAdapters} for a list of available Adapters
 * @todo Review: container is better, as we'll be able to attach something to the grid, also with 3d charts we might need some additional elements
 * @important
 */
export class Grid extends Sprite {

	/**
	 * Defines available properties.
	 */
	public _properties!: IGridProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IGridAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IGridEvents;

	/**
	 * An axis data item that corresponds to the this grid element.
	 */
	public _dataItem: AxisDataItem;

	/**
	 * A referecent to Axis element this fill is applied to.
	 */
	public axis: Axis;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Grid";

		this.element = this.paper.add("path");

		this.location = 0.5;
		this.isMeasured = false;
		this.above = false;

		let interfaceColors = new InterfaceColorSet();
		this.stroke = interfaceColors.getFor("grid");

		this.pixelPerfect = true;
		this.strokeOpacity = 0.15;
		this.fill = color(); // "none";

		this.applyTheme();
	}

	/**
	 * Location within axis cell to place grid line on.
	 *
	 * * 0 - start
	 * * 0.5 - middle
	 * * 1 - end
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
	 * Normally fill goes below series. Set this to `true` to go above.
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
registry.registeredClasses["Grid"] = Grid;

/**
 * Add default responsive rules
 */

/**
 * Disable grid on smaller charts
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.maybeXS,
	state: function(target, stateId) {
		if (target instanceof Grid) {
			let state = target.states.create(stateId);
			state.properties.disabled = true;
			return state;
		}

		return null;
	}
});