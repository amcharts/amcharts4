/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { IDisposer, MutableValueDisposer } from "../../core/utils/Disposer";
import { Axis, AxisItemLocation, AxisDataItem } from "./Axis";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisFill]].
 */
export interface IAxisFillProperties extends ISpriteProperties {

	/**
	 * Start position. (0-1)
	 *
	 * @type {number}
	 */
	startPosition?: number;

	/**
	 * End position. (0-1)
	 * @type {number}
	 */
	endPosition?: number;

	/**
	 * Location within the axis.
	 *
	 * @type {number}
	 */
	location?: number;
}

/**
 * Defines events for [[AxisFill]].
 */
export interface IAxisFillEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[AxisFill]].
 *
 * @see {@link Adapter}
 */
export interface IAxisFillAdapters extends ISpriteAdapters, IAxisFillProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * AxisFill is a base class used to defines fill shapes for various
 * type-specific Axes.
 *
 * Axis fills are used to add fills to specific ranges of those axes.
 *
 * @see {@link IAxisFillEvents} for a list of available events
 * @see {@link IAxisFillAdapters} for a list of available Adapters
 * @important
 */
export class AxisFill extends Sprite {

	/**
	 * Defines available properties.
	 *
	 * @type {IAxisFillProperties}
	 */
	public _properties!: IAxisFillProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IAxisFillAdapters}
	 */
	public _adapter!: IAxisFillAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IAxisFillEvents}
	 */
	public _events!: IAxisFillEvents;

	/**
	 * A referecent to Axis element this fill is applied to.
	 *
	 * @type {Axis}
	 */
	public axis: Axis;

	/**
	 * An SVG path, used to draw fill shape.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @type {string}
	 */
	public fillPath: string;

	/**
	 * [_dataItem description]
	 *
	 * Not sure what this is doing here?
	 *
	 * @todo Description
	 * @type {AxisDataItem}
	 */
	public _dataItem: AxisDataItem;

	/**
	 * Constructor.
	 *
	 * @param {Axis} axis Axis
	 */
	constructor(axis: Axis) {
		super();
		this.axis = axis;
		this.element = this.paper.add("path");

		this.className = "AxisFill";
		this.isMeasured = false;

		this.location = 0;

		let interfaceColors = new InterfaceColorSet();

		this.fill = interfaceColors.getFor("alternativeBackground");
		this.fillOpacity = 0;

		this.applyTheme();
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

	/**
	 * Draws the fill element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();
		if (this.axis && $type.isNumber(this.startPosition) && $type.isNumber(this.endPosition)) {
			this.fillPath = this.axis.getPositionRangePath(this.startPosition, this.endPosition);
			this.path = this.fillPath;
		}
	}

	/**
	 * An actual starting position of the fill.
	 *
	 * @param {number}  value  Starting position
	 */
	public set startPosition(value: number) {
		this.setPropertyValue("startPosition", value);
		this.invalidate(); // this is needed as relative position might not change when zooming
	}

	/**
	 * @return {number} Start position
	 */
	public get startPosition(): number {
		return this.getPropertyValue("startPosition");
	}

	/**
	 * An actual end position of the fill.
	 *
	 * @param {number} value End position
	 */
	public set endPosition(value: number) {
		this.setPropertyValue("endPosition", value);
		this.invalidate(); // this is needed as relative position might not change when zooming
	}

	/**
	 * @return {number} End position
	 */
	public get endPosition(): number {
		return this.getPropertyValue("endPosition");
	}

	/**
	 * Relative location of the fill. (0-1)
	 *
	 * @param {number} value Location (0-1)
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

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisFill"] = AxisFill;
