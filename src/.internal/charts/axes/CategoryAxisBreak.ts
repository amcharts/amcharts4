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
			return this.axis.indexToPosition(this.adjustedStartValue);
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
			return this.axis.indexToPosition(this.adjustedEndValue);
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

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CategoryAxisBreak"] = CategoryAxisBreak;
