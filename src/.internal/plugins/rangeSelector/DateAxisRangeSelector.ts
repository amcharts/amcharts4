/**
 * Range selector for [[DateAxis]].
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { RangeSelector, IRangeSelectorEvents } from "./RangeSelector";
import { registry } from "../../core/Registry";
import { DateAxis } from "../../charts/axes/DateAxis";
import { AxisRenderer } from "../../charts/axes/AxisRenderer";
import { ITimeInterval } from "../../core/defs/ITimeInterval";
import { DateFormatter } from "../../core/formatters/DateFormatter";
import * as $time from "../../core/utils/Time";
import * as $type from "../../core/utils/Type";
import * as $array from "../../core/utils/Array";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

export interface IDateAxisRangeSelectorPeriod {
	name: string;
	interval: ITimeInterval | "ytd" | "max";
}

/**
 * Defines events for [[RangeSelector]].
 */
export interface IDateAxisRangeSelectorEvents extends IRangeSelectorEvents {

	/**
	 * Invoked when pre-defined period is selected (button clicked).
	 * 
	 * @since 4.10.3
	 */
	periodselected: {
		interval: ITimeInterval;
		startDate: Date;
	}

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a control used to select date range and preset periods for
 * a [[DateAxis]].
 *
 * ```TypeScript
 * let selector = new am4plugins_rangeSelector.DateAxisRangeSelector()
 * selector.container = document.getElementById("selectordiv");
 * selector.axis = chart.xAxes.getIndex(0);
 * ```
 * ```JavaScript
 * var selector = new am4plugins_rangeSelector.DateAxisRangeSelector()
 * selector.container = document.getElementById("selectordiv");
 * selector.axis = chart.xAxes.getIndex(0);
 * ```
 *
 * @see {@link https://www.amcharts.com/docs/v4/tutorials/plugin-range-selector/} for more information on how to use this plugin
 * @important
 * @todo JSON example
 */
export class DateAxisRangeSelector extends RangeSelector {

	/**
	 * Defines available events.
	 */
	public _events!: IDateAxisRangeSelectorEvents;

	/**
	 * Reference to target axis.
	 *
	 * @ignore
	 */
	public _axis: DateAxis<AxisRenderer>;

	/**
	 * Holds references to various HTML elements control consists of.
	 */
	protected _elements: {
		wrapper?: HTMLElement;
		rangeWrapper?: HTMLElement;
		fromTitle?: HTMLElement;
		fromInput?: HTMLInputElement;
		toTitle?: HTMLElement;
		toInput?: HTMLInputElement;
		periodWrapper?: HTMLElement;
		periodTitle?: HTMLElement;
		periodButtons?: HTMLElement[];
	} = {
			periodButtons: []
		};

	/**
	 * List of pre-defined period buttons.
	 */
	protected _periods: IDateAxisRangeSelectorPeriod[];

	/**
	 * Date format to use for input fields.
	 */
	protected _inputDateFormat = "yyyy-MM-dd";

	/**
	 * Date formatter.
	 */
	protected _dateFormatter: DateFormatter;

	/**
	 * Timeout to use to delay zooming of axis (so it does not happen on
	 * every keystroke in input fields).
	 */
	private _zoomTimeout: any;

	/**
	 * Number of milliseconds to wait after last keystroke in date input field
	 * before zooming the axis.
	 *
	 * @default 500
	 */
	public zoomDelay: number = 500;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "DateAxisRangeSelector";
		this._disposers.push(this._language);
		this.invalidate();
		this.applyTheme();
	}

	/**
	 * (Re)draws the control.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		this.draw();
		super.validate();
	}

	/**
	 * Adds events to the axis.
	 */
	protected prepAxis(): void {
		this._disposers.push(this.axis.events.on("selectionextremeschanged", (ev) => {
			this.updateRangeInputs();
		}));
		this._disposers.push(this.axis.events.on("extremeschanged", (ev) => {
			this.updateRangeInputs();
		}));
	}

	/**
	 * Draws the control.
	 *
	 * @ignore
	 */
	public draw(): void {

		super.draw();

		const tabindex = this.tabindex;

		// Range wrapper
		if (!this._elements.rangeWrapper) {
			this._elements.rangeWrapper = document.createElement("div");
			this._elements.rangeWrapper.className = this.classPrefix + "-range-wrapper";
			this._elements.wrapper.appendChild(this._elements.rangeWrapper);
		}

		// From title
		if (!this._elements.fromTitle) {
			this._elements.fromTitle = document.createElement("span");
			this._elements.fromTitle.className = this.classPrefix + "-title " + this.classPrefix + "-from-title";
			this._elements.fromTitle.innerHTML = this.language.translateAny("From %1", undefined, "");
			this._elements.rangeWrapper.appendChild(this._elements.fromTitle);
		}

		// From input
		if (!this._elements.fromInput) {
			this._elements.fromInput = <HTMLInputElement>document.createElement("input");
			this._elements.fromInput.type = "text";
			this._elements.fromInput.className = this.classPrefix + "-from-input";

			if (tabindex) {
				this._elements.fromInput.setAttribute("tabindex", tabindex.toString());
			}

			this._elements.rangeWrapper.appendChild(this._elements.fromInput);

			this._elements.fromInput.addEventListener("keyup", () => {
				this.updateZoom()
			});
		}

		// To title
		if (!this._elements.toTitle) {
			this._elements.toTitle = document.createElement("span");
			this._elements.toTitle.className = this.classPrefix + "-title " + this.classPrefix + "-to-title";
			this._elements.toTitle.innerHTML = this.language.translateAny("To %1", undefined, "");
			this._elements.rangeWrapper.appendChild(this._elements.toTitle);
		}

		// To input
		if (!this._elements.toInput) {
			this._elements.toInput = <HTMLInputElement>document.createElement("input");
			this._elements.toInput.type = "text";
			this._elements.toInput.className = this.classPrefix + "-to-input";
			if (tabindex) {
				this._elements.toInput.setAttribute("tabindex", tabindex.toString());
			}
			this._elements.rangeWrapper.appendChild(this._elements.toInput);

			this._elements.toInput.addEventListener("keyup", () => {
				this.updateZoom()
			});
		}

		// Period buttons
		if (this.periods.length) {

			// period wrapper
			if (!this._elements.periodWrapper) {
				this._elements.periodWrapper = document.createElement("div");
				this._elements.periodWrapper.className = this.classPrefix + "-period-wrapper";
				this._elements.wrapper.appendChild(this._elements.periodWrapper);


				// Period title
				if (!this._elements.periodTitle) {
					this._elements.periodTitle = document.createElement("span");
					this._elements.periodTitle.className = this.classPrefix + "-title " + this.classPrefix + "-period-title";
					this._elements.periodTitle.innerHTML = this.language.translateAny("Zoom");
					this._elements.periodWrapper.appendChild(this._elements.periodTitle);
				}

				// Period buttons
				$array.each(this.periods, (period) => {
					const button = document.createElement("button");
					button.className = this.classPrefix + "-period-button";
					button.innerHTML = period.name;
					if (tabindex) {
						button.setAttribute("tabindex", tabindex.toString());
					}
					this._elements.periodButtons.push(button);
					this._elements.periodWrapper.appendChild(button);

					button.addEventListener("click", () => {
						this.setPeriodInterval(period.interval);
					});

				});

			}
		}

		this.dispatchImmediately("drawn", {
			type: "drawn"
		});


		this.updateRangeInputs();

	}

	/**
	 * Updates input values based on the current zoom selection of the axis.
	 *
	 * @ignore
	 */
	public updateRangeInputs(): void {
		if (this._elements.fromInput && this._elements.toInput && this.axis) {
			const axis = this.axis;
			const formatter = this.dateFormatter;
			const minZoomed = axis.minZoomed + $time.getDuration(axis.mainBaseInterval.timeUnit, axis.mainBaseInterval.count) * 0.5;
			this._elements.fromInput.value = formatter.format(minZoomed, this.inputDateFormat);
			this._elements.toInput.value = formatter.format(new Date(axis.maxZoomed), this.inputDateFormat);
		}
	}

	/**
	 * Zooms axis according to input fields.
	 *
	 * @ignore
	 */
	public updateZoom(): void {
		if (this._zoomTimeout) {
			clearTimeout(this._zoomTimeout);
		}
		this._zoomTimeout = setTimeout(() => {
			let start = this._elements.fromInput.value;
			let end = this._elements.toInput.value;
			if ((start.length < this.inputDateFormat.length) || (end.length < this.inputDateFormat.length)) {
				return;
			}
			let startDate = this.dateFormatter.parse(start, this.inputDateFormat);
			let endDate = this.dateFormatter.parse(end, this.inputDateFormat);

			if (startDate && endDate) {
				this.axis.zoomToDates(startDate, endDate);
			}
		}, this.zoomDelay);
	}

	/**
	 * Zooms the axis to a preset time interal or `"ytd"` or `"max"`.
	 * 
	 * @param  interval  Interval
	 */
	public setPeriodInterval(interval: ITimeInterval | "ytd" | "max"): void {
		let date;
		const group = this.getGroupInterval(this.axis.baseInterval);
		if (interval == "max") {
			date = new Date(this.axis.groupMin[group] || this.axis.min);
		}
		else if (interval == "ytd") {
			date = new Date(this.axis.groupMin[group] || this.axis.min);
			date = new Date(this.axis.groupMax[group] || this.axis.max);
			$time.round(date, "year", 1);
		}
		else if ($type.isObject(interval)) {
			date = new Date(this.axis.groupMax[group] || this.axis.max);
			$time.add(date, interval.timeUnit, -1 * interval.count);
		}

		if (date) {
			this.zoomToDates(date);
		}

		this.dispatchImmediately("periodselected", {
			interval: interval,
			startDate: date
		});
	}

	private getGroupInterval(interval: ITimeInterval): string {
		return interval.timeUnit + interval.count;
	}

	/**
	 * Zooms the axis using start date.
	 * 
	 * @param  date  Start date
	 */
	public zoomToDates(date: Date): void {
		const axis = this.axis;
		const group = this.getGroupInterval(axis.baseInterval);
		const min = axis.groupMin[group] || axis.min;
		const max = axis.groupMax[group] || axis.max;
		axis.keepSelection = true;
		axis.zoom({ start: (date.getTime() - min) / (max - min), end: 1 });
	}

	/**
	 * Getters and setters
	 */

	/**
	 * A list of pre-defined periods to show buttons for.
	 * 
	 * @param  value  Periods
	 */
	public set periods(value: IDateAxisRangeSelectorPeriod[]) {
		this._periods = value;
		this.invalidate();
	}

	/**
	 * @return Periods
	 */
	public get periods(): IDateAxisRangeSelectorPeriod[] {
		if (!this._periods) {
			this._periods = [
				{ name: this.language.translateAny("%1M", undefined, "1"), interval: { timeUnit: "month", count: 1 } },
				{ name: this.language.translateAny("%1M", undefined, "3"), interval: { timeUnit: "month", count: 3 } },
				{ name: this.language.translateAny("%1M", undefined, "6"), interval: { timeUnit: "month", count: 6 } },
				{ name: this.language.translateAny("%1Y", undefined, "1"), interval: { timeUnit: "year", count: 1 } },
				{ name: this.language.translateAny("YTD"), interval: "ytd" },
				{ name: this.language.translateAny("MAX"), interval: "max" },
			]
		}
		return this._periods;
	}

	/**
	 * A [[DateFormatter]] instance to use.
	 *
	 * If not set, control will inherit one from the target axis.
	 *
	 * @param  value  Formatter
	 */
	public set dateFormatter(value: DateFormatter) {
		this._dateFormatter = value;
		this.invalidate();
	}

	/**
	 * @return Formatter
	 */
	public get dateFormatter(): DateFormatter {
		if (!this._dateFormatter) {

			// Maybe use one from axis?
			if (this._axis) {
				this._dateFormatter = this._axis.dateFormatter;
			}
			else {
				this._dateFormatter = new DateFormatter();
				this._disposers.push(this._dateFormatter);
			}
		}

		return this._dateFormatter;
	}

	/**
	 * An format to use for the date input fields.
	 *
	 * If not set, it will use `dateFormat` from the [[DateFormatter]] object.
	 *
	 * @default "yyyy-MM-dd"
	 * @param  value  Date format
	 */
	public set inputDateFormat(value: string) {
		if (this._inputDateFormat != value) {
			this._inputDateFormat = value;
			this.invalidate();
		}
	}

	/**
	 * @return Date format
	 */
	public get inputDateFormat(): string {
		if (this._inputDateFormat) {
			return this._inputDateFormat;
		}
		else if (this.dateFormatter && $type.isString(this.dateFormatter.dateFormat)) {
			return this.dateFormatter.dateFormat;
		}
		else {
			return "yyyy-MM-dd";
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["DateAxisRangeSelector"] = DateAxisRangeSelector;