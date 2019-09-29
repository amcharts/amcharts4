/**
 * DurationAxis module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ValueAxis, ValueAxisDataItem, IValueAxisProperties, IValueAxisDataFields, IValueAxisAdapters, IValueAxisEvents } from "./ValueAxis";
import { AxisRenderer } from "./AxisRenderer";
import { TimeUnit } from "../../core/defs/TimeUnit";
import { IMinMaxStep } from "./ValueAxis";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines data item for [[DurationAxis]].
 *
 * @see {@link DataItem}
 */
export class DurationAxisDataItem extends ValueAxisDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: DurationAxis;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "DurationAxisDataItem";
		this.applyTheme();
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[DurationAxis]].
 */
export interface IDurationAxisDataFields extends IValueAxisDataFields { }

/**
 * Defines properties for [[DurationAxis]].
 */
export interface IDurationAxisProperties extends IValueAxisProperties { }

/**
 * Defines events for [[DurationAxis]].
 */
export interface IDurationAxisEvents extends IValueAxisEvents { }

/**
 * Defines adapters for [[DurationAxis]].
 *
 * @see {@link Adapter}
 */
export interface IDurationAxisAdapters extends IValueAxisAdapters, IDurationAxisProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to create an axis that shows time durations.
 *
 * ```TypeScript
 * // Create the axis
 * let xAxis = chart.xAxes.push(new am4charts.DurationAxis());
 *
 * // Set settings
 * xAxis.title.text = "Time";
 * ```
 * ```JavaScript
 * // Create the axis
 * var valueAxis = chart.xAxes.push(new am4charts.DurationAxis());
 *
 * // Set settings
 * valueAxis.title.text = "Time";
 * ```
 * ```JSON
 * "xAxes": [{
 *   "type": "DurationAxis",
 *   "title": {
 *     "text": "Time"
 *   }
 * }]
 * ```
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} for mor information about duration formatters.
 * @see {@link IDurationAxisEvents} for a list of available Events
 * @see {@link IDurationAxisAdapters} for a list of available Adapters
 * @important
 */
export class DurationAxis<T extends AxisRenderer = AxisRenderer> extends ValueAxis<T> {

	/**
	 * Defines data fields.
	 */
	public _dataFields: IDurationAxisDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IDurationAxisProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IDurationAxisAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IDurationAxisEvents;

	/**
	 * Defines the type of the Date Items.
	 */
	public _dataItem: DurationAxisDataItem;

	/**
	 * A base unit (granularity) of data.
	 *
	 * Used to indicate what are the base units of your data.
	 */
	protected _baseUnit: TimeUnit = "second";

	/**
	 * A special duration format to apply axis tooltips.
	 *
	 * Will use same format as for labels, if not set.
	 */
	protected _tooltipDurationFormat: string;

	/**
	 * Axis date format chosen dynamically based on min/max and baseUnit.
	 *
	 * @readonly
	 */
	public axisDurationFormat: string;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "DurationAxis";

		this.setPropertyValue("maxZoomFactor", 1000000);

		// Apply theme
		this.applyTheme();
	}


	/**
	 * Formats the value according to axis' own [[DurationFormatter]].
	 *
	 * @param value  Source value
	 * @return Formatted value
	 */
	public formatLabel(value: number, format?: string): string {
		return this.durationFormatter.format(value, format || this.axisDurationFormat);
	}

	/**
	 * Adjusts actual min and max scale values so that the axis starts and ends
	 * at "nice" values, unless `strictMinMax` is set.
	 *
	 * The `difference` can be something else than `max - min`, because of the
	 * axis breaks.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param min        [description]
	 * @param max        [description]
	 * @param difference [description]
	 * @param gridCount  [description]
	 * @param strictMode [description]
	 * @return [description]
	 */
	public adjustMinMax(min: number, max: number, difference: number, gridCount: number, strictMode?: boolean): IMinMaxStep {

		let minMaxStep: IMinMaxStep;

		let timeUnit = this.baseUnit;
		// we don't allow to go to smaller units, setting so to avoid invalidation
		this.setPropertyValue("maxPrecision", 0);

		if (timeUnit == "millisecond" || timeUnit == "second" || timeUnit == "minute" || timeUnit == "hour") {
			// will fail if 0
			if (gridCount <= 1) {
				gridCount = 1;
			}

			gridCount = Math.round(gridCount);

			let initialMin: number = min;
			let initialMax: number = max;

			// in case min and max is the same, use max
			if (difference === 0) {
				difference = Math.abs(max);
			}

			let step = difference / gridCount;

			let divisors = [60, 30, 20, 15, 10, 2, 1];
			let realDivisor = 1;

			if (timeUnit == "hour") {
				divisors = [24, 12, 6, 4, 2, 1];
			}

			for (let divisor of divisors) {
				if (difference / divisor > gridCount) {
					realDivisor = divisor;
					break;
				}
			}
			let count = Math.ceil(((max - min) / realDivisor) / gridCount);

			let exponent: number = Math.log(Math.abs(count)) * Math.LOG10E;
			let power = Math.pow(10, Math.floor(exponent)) / 10;
			let reducedCount = count / power;

			// find closest to divisor
			let closest = $math.closest(divisors, reducedCount);
			count = closest * power;

			step = realDivisor * count;

			// TODO can this be removed ?
			this.durationFormatter.getValueUnit(step, this.baseUnit);

			min = Math.floor(min / step) * step;
			max = Math.ceil(max / step) * step;

			if (strictMode) {
				min -= step;
				if (min < 0 && initialMin >= 0) {
					min = 0;
				}
				max += step;

				if (max > 0 && initialMax <= 0) {
					max = 0;
				}
			}
			minMaxStep = { min: min, max: max, step: step };
		}
		else {
			minMaxStep = super.adjustMinMax(min, max, difference, gridCount, strictMode);
		}

		// choose duration formatter based on step
		this.axisDurationFormat = this.durationFormatter.getFormat(minMaxStep.step, minMaxStep.max, this.baseUnit);

		return minMaxStep;
	}

	/**
	 * A special duration format to apply axis tooltips.
	 *
	 * Will use same format as for labels, if not set.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} for mor information.
	 * @param value  Duration format for axis labels
	 */
	public set tooltipDurationFormat(value: string) {
		this._tooltipDurationFormat = value;
	}

	/**
	 * @return Duration format for axis labels
	 */
	public get tooltipDurationFormat(): string {
		return this._tooltipDurationFormat;
	}

	/**
	 * Returns text to show in a axis tooltip, based on specific position within
	 * axis.
	 *
	 * The label will be formatted as per [[NumberFormatter]] set for the whole
	 * chart, or explicitly for this Axis.
	 *
	 * @ignore Exclude from docs
	 * @param position  Position (px)
	 * @return Label (numeric value)
	 */
	public getTooltipText(position: number): string {
		let value: number = $math.round(this.positionToValue(position), this._stepDecimalPlaces);
		let valueStr = this.formatLabel(value, this.tooltipDurationFormat)
		if (!this._adapterO) {
			return valueStr;
		}
		else {
			return this._adapterO.apply("getTooltipText", valueStr);
		}
	}

	/**
	 * A base unit (granularity) of data.
	 *
	 * Used to indicate what are the base units of your data.
	 *
	 * Available options: "millisecond", "second" (default), "minute", "hour",
	 * "day", "week", "month", "year".
	 *
	 * @default "second"
	 * @param timeUnit
	 */
	public set baseUnit(timeUnit: TimeUnit) {
		if (this._baseUnit != timeUnit) {
			this._baseUnit = timeUnit;
			this.durationFormatter.baseUnit = timeUnit;
			this.invalidate();
		}
	}

	/**
	 * @return Base unit
	 */
	public get baseUnit(): TimeUnit {
		return this._baseUnit;
	}

	/**
	 * Copies all properties and related data from a different instance of Axis.
	 *
	 * @param source Source Axis
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.baseUnit = source.baseUnit;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["DurationAxis"] = DurationAxis;
registry.registeredClasses["DurationAxisDataItem"] = DurationAxisDataItem;
