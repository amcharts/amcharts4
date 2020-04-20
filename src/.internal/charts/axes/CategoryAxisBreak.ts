/**
 * A module which defines functionality related to Category Axis Break.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */

import { AxisBreak, IAxisBreakProperties, IAxisBreakAdapters, IAxisBreakEvents } from "./AxisBreak";
import { CategoryAxis } from "./CategoryAxis";
import { registry } from "../../core/Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[CategoryAxisBreak]].
 */
export interface ICategoryAxisBreakProperties extends IAxisBreakProperties {

	/**
	 * Category break starts on.
	 */
	startCategory?: string;

	/**
	 * Category break ends on.
	 */
	endCategory?: string;

	/**
	 * Location where break starts within cell (0-1).
	 */
	startLocation?: number;

	/**
	 * Location where break ends within cell (0-1).
	 */
	endLocation?: number;
}

/**
 * Defines events for [[CategoryAxisBreak]].
 */
export interface ICategoryAxisBreakEvents extends IAxisBreakEvents { }

/**
 * Defines adapters for [[CategoryAxisBreak]].
 *
 * @see {@link Adapter}
 */
export interface ICategoryAxisBreakAdapters extends IAxisBreakAdapters, ICategoryAxisBreakProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Base class to define "breaks" in axes
 * @see {@link ICategoryAxisBreakEvents} for a list of available events
 * @see {@link ICategoryAxisBreakAdapters} for a list of available Adapters
 */
export class CategoryAxisBreak extends AxisBreak {

	/**
	 * Defines available properties.
	 */
	public _properties!: ICategoryAxisBreakProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICategoryAxisBreakAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICategoryAxisBreakEvents;

	/**
	 * Defines the type of the Axis this break is used for.
	 */
	public _axisType: CategoryAxis;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CategoryAxisBreak";
		this.properties.startLocation = 0.5;
		this.properties.endLocation = 0.5;
		this.applyTheme();
	}

	/**
	 * Pixel position of the break's start.
	 *
	 * @return Position (px)
	 * @readonly
	 */
	public get startPosition(): number {
		if (this.axis) {
			return this.axis.indexToPosition(this.adjustedStartValue, this.startLocation);
		}
	}

	/**
	 * Pixel position of the break's end.
	 *
	 * @return Position (px)
	 * @readonly
	 */
	public get endPosition(): number {
		if (this.axis) {
			return this.axis.indexToPosition(this.adjustedEndValue, this.endLocation);
		}
	}

	/**
	 * A category break starts on.
	 *
	 * @param value Start category
	 */
	public set startCategory(value: string) {
		if (this.setPropertyValue("startCategory", value)) {
			if (this.axis) {
				this.axis.invalidateDataItems();
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return Start category
	 */
	public get startCategory(): string {
		return this.getPropertyValue("startCategory");
	}

	/**
	 * A category break ends on.
	 *
	 * @param value  End category
	 */
	public set endCategory(value: string) {
		if (this.setPropertyValue("endCategory", value)) {
			if (this.axis) {
				this.axis.invalidateDataItems();
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return End category
	 */
	public get endCategory(): string {
		return this.getPropertyValue("endCategory");
	}

	/**
	 * An index of start category.
	 *
	 * @param value  Value
	 */
	public set startValue(value: number) {
		if (this.setPropertyValue("startValue", value)) {
			if (this.axis) {
				this.axis.invalidateDataItems();
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return Value
	 */
	public get startValue(): number {
		let category: string = this.getPropertyValue("startCategory");
		if (category) {
			return this.axis.categoryToIndex(category);
		}
		else {
			return this.getPropertyValue("startValue");
		}

	}

	/**
	 * An index of end category or a end value.
	 *
	 * @param value  Value
	 */
	public set endValue(value: number) {
		if (this.setPropertyValue("endValue", value)) {
			if (this.axis) {
				this.axis.invalidateDataItems();
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return Value
	 */
	public get endValue(): number {
		let category: string = this.getPropertyValue("endCategory");
		if (category) {
			return this.axis.categoryToIndex(category);
		}
		else {
			return this.getPropertyValue("endValue");
		}
	}

	/**
	 * Indicates where within starting category break should begin.
	 *
	 * Values range from `0` (start) to `1` (end), with default being `0.5` (middle).
	 *
	 * E.g. if you want to a break to fully encompass start and end categories,
	 * you should set `startLocation = 0` and `endLocation = 1`.
	 *
	 * @since 4.9.17
	 * @default 0.5
	 * @param  value  Break start location
	 */
	public set startLocation(value: number) {
		if (this.setPropertyValue("startLocation", value)) {
			if (this.axis) {
				this.axis.invalidateDataItems();
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return Break start location
	 */
	public get startLocation(): number {
		return this.getPropertyValue("startLocation");
	}

	/**
	 * Indicates where within ending category break should end.
	 *
	 * Values range from `0` (start) to `1` (end), with default being `0.5` (middle).
	 *
	 * E.g. if you want to a break to fully encompass start and end categories,
	 * you should set `startLocation = 0` and `endLocation = 1`.
	 *
	 * @since 4.9.17
	 * @default 0.5
	 * @param  value  Break end location
	 */
	public set endLocation(value: number) {
		if (this.setPropertyValue("endLocation", value)) {
			if (this.axis) {
				this.axis.invalidateDataItems();
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return Break end location
	 */
	public get endLocation(): number {
		return this.getPropertyValue("endLocation");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CategoryAxisBreak"] = CategoryAxisBreak;
