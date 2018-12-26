/**
 * DateAxis module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ValueAxis, ValueAxisDataItem, IValueAxisProperties, IValueAxisDataFields, IValueAxisAdapters, IValueAxisEvents } from "./ValueAxis";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { AxisItemLocation } from "./Axis";
import { AxisRenderer } from "./AxisRenderer";
import { AxisTick } from "./AxisTick";
import { AxisLabel } from "./AxisLabel";
import { AxisFill } from "./AxisFill";
import { List } from "../../core/utils/List";
import { Dictionary } from "../../core/utils/Dictionary";
import { IPoint, IOrientationPoint } from "../../core/defs/IPoint";
import { Grid } from "./Grid";
import { XYSeries, XYSeriesDataItem } from "../series/XYSeries";
import { TimeUnit } from "../../core/defs/TimeUnit";
import { ITimeInterval } from "../../core/defs/ITimeInterval";
import { IMinMaxStep } from "./ValueAxis";
import { DateAxisBreak } from "./DateAxisBreak";
import { registry } from "../../core/Registry";
import { IDisposer, Disposer, MultiDisposer } from "../../core/utils/Disposer";
import * as $time from "../../core/utils/Time";
import * as $type from "../../core/utils/Type";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $object from "../../core/utils/Object";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines data item for [[DateAxis]].
 *
 * @see {@link DataItem}
 */
export class DateAxisDataItem extends ValueAxisDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 *
	 * @type {DateAxis}
	 */
	public _component!: DateAxis;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "DateAxisDataItem";
		this.applyTheme();

		this.values.date = {};
		this.values.endDate = {};
	}

	/**
	 * Date position of the data item.
	 *
	 * @param {Date}  date  Date
	 */
	public set date(date: Date) {
		this.setDate("date", date);
		this.value = date.getTime();
	}

	/**
	 * @return {Date} Date
	 */
	public get date(): Date {
		return this.dates["date"];
	}


	/**
	 * End date for data item.
	 *
	 * @param {Date} date End date
	 */
	public set endDate(date: Date) {
		this.setDate("endDate", date);
		this.endValue = date.getTime();
	}

	/**
	 * @return {Date} End date
	 */
	public get endDate(): Date {
		return this.dates["endDate"];
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[DateAxis]].
 */
export interface IDateAxisDataFields extends IValueAxisDataFields {

	/**
	 * Date.
	 *
	 * @type {string}
	 */
	date?: string;

}

/**
 * Defines properties for [[DateAxis]].
 */
export interface IDateAxisProperties extends IValueAxisProperties {

	/**
	 * If enabled, axis will automatically collapse empty (without data points)
	 * periods of time, i.e. weekends.
	 *
	 * @default false
	 * @type {boolean}
	 */
	skipEmptyPeriods?: boolean;

	/**
	 * Use `periodChangeDateFormats` to apply different formats to the first
	 * label in bigger time unit.
	 *
	 * @default true
	 * @param {boolean}  value  Use different format for period beginning?
	 */
	markUnitChange?: boolean;

	/**
	 * Should the nearest tooltip be shown if no data item is found on the
	 * current cursor position.
	 *
	 * @default true
	 * @type {boolean}
	 */
	snapTooltip?: boolean;

	/**
	 * A special date format to apply axis tooltips.
	 *
	 * Will use same format as for labels, if not set.
	 *
	 * @type {string}
	 */
	tooltipDateFormat?: string;
}

/**
 * Defines events for [[DateAxis]].
 */
export interface IDateAxisEvents extends IValueAxisEvents { }

/**
 * Defines adapters for [[DateAxis]].
 *
 * @see {@link Adapter}
 */
export interface IDateAxisAdapters extends IValueAxisAdapters, IDateAxisProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to create a date/time-based axis for the chart.
 *
 * ```TypeScript
 * // Create the axis
 * let xAxis = chart.xAxes.push(new am4charts.DateAxis());
 *
 * // Set settings
 * xAxis.title.text = "Time";
 * ```
 * ```JavaScript
 * // Create the axis
 * var valueAxis = chart.xAxes.push(new am4charts.DateAxis());
 *
 * // Set settings
 * valueAxis.title.text = "Time";
 * ```
 * ```JSON
 * "xAxes": [{
 *   "type": "DateAxis",
 *   "title": {
 *     "text": "Time"
 *   }
 * }]
 * ```
 *
 * @see {@link IDateAxisEvents} for a list of available Events
 * @see {@link IDateAxisAdapters} for a list of available Adapters
 * @important
 */
export class DateAxis<T extends AxisRenderer = AxisRenderer> extends ValueAxis<T> {

	/**
	 * Defines data fields.
	 *
	 * @type {IDateAxisDataFields}
	 */
	public _dataFields: IDateAxisDataFields;

	/**
	 * Defines available properties.
	 *
	 * @type {IDateAxisProperties}
	 */
	public _properties!: IDateAxisProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IDateAxisAdapters}
	 */
	public _adapter!: IDateAxisAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IDateAxisEvents}
	 */
	public _events!: IDateAxisEvents;

	/**
	 * Defines the type of the Date Items.
	 *
	 * @type {DateAxisDataItem}
	 */
	public _dataItem: DateAxisDataItem;

	/**
	 * Defines the type of the axis breaks.
	 *
	 * @type {DateAxisBreak}
	 */
	public _axisBreak: DateAxisBreak;

	/**
	 * A list of date/time intervals for Date axis.
	 *
	 * This define various granularities available for the axis. For example
	 * if you have an axis spanning an hour, and space for 6 grid lines / labels
	 * the axis will choose the granularity of 10 minutes, displaying a label
	 * every 10 minutes.
	 *
	 * Default intervals:
	 *
	 * ```JSON
	 * [
	 *  { timeUnit: "millisecond", count: 1 },
	 *  { timeUnit: "millisecond", count: 5 },
	 *  { timeUnit: "millisecond", count: 10 },
	 *  { timeUnit: "millisecond", count: 50 },
	 *  { timeUnit: "millisecond", count: 100 },
	 *  { timeUnit: "millisecond", count: 500 },
	 *  { timeUnit: "second", count: 1 },
	 *  { timeUnit: "second", count: 5 },
	 *  { timeUnit: "second", count: 10 },
	 *  { timeUnit: "second", count: 30 },
	 *  { timeUnit: "minute", count: 1 },
	 *  { timeUnit: "minute", count: 5 },
	 *  { timeUnit: "minute", count: 10 },
	 *  { timeUnit: "minute", count: 30 },
	 *  { timeUnit: "hour", count: 1 },
	 *  { timeUnit: "hour", count: 3 },
	 *  { timeUnit: "hour", count: 6 },
	 *  { timeUnit: "hour", count: 12 },
	 *  { timeUnit: "day", count: 1 },
	 *  { timeUnit: "day", count: 2 },
	 *  { timeUnit: "day", count: 3 },
	 *  { timeUnit: "day", count: 4 },
	 *  { timeUnit: "day", count: 5 },
	 *  { timeUnit: "week", count: 1 },
	 *  { timeUnit: "month", count: 1 },
	 *  { timeUnit: "month", count: 2 },
	 *  { timeUnit: "month", count: 3 },
	 *  { timeUnit: "month", count: 6 },
	 *  { timeUnit: "year", count: 1 },
	 *  { timeUnit: "year", count: 2 },
	 *  { timeUnit: "year", count: 5 },
	 *  { timeUnit: "year", count: 10 },
	 *  { timeUnit: "year", count: 50 },
	 *  { timeUnit: "year", count: 100 }
	 * ]
	 * ```
	 *
	 * @type {List<ITimeInterval>}
	 */
	public gridIntervals: List<ITimeInterval> = new List<ITimeInterval>();

	/**
	 * A collection of date formats to use when formatting different time units
	 * on Date/time axis.
	 *
	 * Actual defaults will depend on the language locale set for the chart.
	 *
	 * To override format for a specific time unit, say days, you need to set
	 * the appropriate key to a format string. E.g.:
	 *
	 * ```TypeScript
	 * axis.dateFormats.setKey("day", "MMMM d, yyyy");
	 * ```
	 * ```JavaScript
	 * axis.dateFormats.setKey("day", "MMMM d, yyyy");
	 * ```
	 * ```JSON
	 * "xAxes": [{
	 *   "type": "DateAxis",
	 *   "dateFormats": {
	 *     "day": "MMMM d, yyyy"
	 *   }
	 * }]
	 * ```
	 *
	 * @see {@link DateFormatter}
	 * @type {Dictionary<TimeUnit, string>}
	 */
	public dateFormats: Dictionary<TimeUnit, string> = new Dictionary<TimeUnit, string>();

	/**
	 * These formats are applied to labels that are first in a larger unit.
	 *
	 * For example, if we have a DateAxis with days on it, the first day of month
	 * indicates a break in month - a start of the bigger period.
	 *
	 * For those labels, `periodChangeDateFormats` are applied instead of
	 * `dateFormats`.
	 *
	 * This allows us implement convenient structures, like instead of:
	 *
	 * `Jan 1 - Jan 2 - Jan 3 - ...`
	 *
	 * We can have:
	 *
	 * `Jan - 1 - 2 - 3 - ...`
	 *
	 * This can be disabled by setting `markUnitChange = false`.
	 *
	 * @type {Dictionary<TimeUnit, string>}
	 */
	public periodChangeDateFormats: Dictionary<TimeUnit, string> = new Dictionary<TimeUnit, string>();

	/**
	 * At which intervals grid elements are displayed.
	 *
	 * @type {ITimeInterval}
	 */
	protected _gridInterval: ITimeInterval;

	/**
	 * [_intervalDuration description]
	 *
	 * @todo Description
	 * @type {number}
	 */
	protected _intervalDuration: number;

	/**
	 * [_gridDate description]
	 *
	 * @todo Description
	 * @type {Date}
	 */
	protected _gridDate: Date;

	/**
	 * [_nextGridUnit description]
	 *
	 * @todo Description
	 * @type {TimeUnit}
	 */
	protected _nextGridUnit: TimeUnit;

	/**
	 * User-defined granularity of data.
	 *
	 * @type {ITimeInterval}
	 */
	protected _baseInterval: ITimeInterval;

	/**
	 * Actual interval (granularity) derived from the actual data.
	 *
	 * @type {ITimeInterval}
	 */
	protected _baseIntervalReal: ITimeInterval = { timeUnit: "day", count: 1 };

	/**
	 * @type {number}
	 */
	protected _prevSeriesTime: number;

	/**
	 * [_minDifference description]
	 *
	 * @todo Description
	 * @type {number}
	 */
	protected _minDifference: { [index: string]: number } = {};

	/**
	 * A function which applies fills to axis cells.
	 *
	 * Default function fills every second fill. You can set this to a function
	 * that follows some other logic.
	 *
	 * Function should accept a [[DateAxisDataItem]] and modify its `axisFill`
	 * property accordingly.
	 *
	 * @todo type
	 */
	public fillRule(dataItem: DateAxisDataItem) {
		let value = dataItem.value;
		let axis = dataItem.component;
		let gridInterval = axis._gridInterval;
		let gridDuration = $time.getDuration(gridInterval.timeUnit, gridInterval.count);

		if (Math.round((value - axis.min) / gridDuration) / 2 == Math.round(Math.round((value - axis.min) / gridDuration) / 2)) {
			dataItem.axisFill.__disabled = true;
		}
		else {
			dataItem.axisFill.__disabled = false;
		}
	}

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "DateAxis";

		this.setPropertyValue("markUnitChange", true);
		this.snapTooltip = true;

		// Translatable defaults are applied in `applyInternalDefaults()`
		// ...

		// Define default intervals
		this.gridIntervals.pushAll([
			{ timeUnit: "millisecond", count: 1 },
			{ timeUnit: "millisecond", count: 5 },
			{ timeUnit: "millisecond", count: 10 },
			{ timeUnit: "millisecond", count: 50 },
			{ timeUnit: "millisecond", count: 100 },
			{ timeUnit: "millisecond", count: 500 },
			{ timeUnit: "second", count: 1 },
			{ timeUnit: "second", count: 5 },
			{ timeUnit: "second", count: 10 },
			{ timeUnit: "second", count: 30 },
			{ timeUnit: "minute", count: 1 },
			{ timeUnit: "minute", count: 5 },
			{ timeUnit: "minute", count: 10 },
			{ timeUnit: "minute", count: 15 },
			{ timeUnit: "minute", count: 30 },
			{ timeUnit: "hour", count: 1 },
			{ timeUnit: "hour", count: 3 },
			{ timeUnit: "hour", count: 6 },
			{ timeUnit: "hour", count: 12 },
			{ timeUnit: "day", count: 1 },
			{ timeUnit: "day", count: 2 },
			{ timeUnit: "day", count: 3 },
			{ timeUnit: "day", count: 4 },
			{ timeUnit: "day", count: 5 },
			{ timeUnit: "week", count: 1 },
			{ timeUnit: "month", count: 1 },
			{ timeUnit: "month", count: 2 },
			{ timeUnit: "month", count: 3 },
			{ timeUnit: "month", count: 6 },
			{ timeUnit: "year", count: 1 },
			{ timeUnit: "year", count: 2 },
			{ timeUnit: "year", count: 5 },
			{ timeUnit: "year", count: 10 },
			{ timeUnit: "year", count: 50 },
			{ timeUnit: "year", count: 100 },
			{ timeUnit: "year", count: 200 },
			{ timeUnit: "year", count: 500 },
			{ timeUnit: "year", count: 1000 },
			{ timeUnit: "year", count: 2000 },
			{ timeUnit: "year", count: 5000 },
			{ timeUnit: "year", count: 10000 },
			{ timeUnit: "year", count: 100000 }
		]);

		// Set field name
		this.axisFieldName = "date";

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();

		// Set default date formats
		if (!this.dateFormats.hasKey("millisecond")) {
			this.dateFormats.setKey("millisecond", this.language.translate("_date_millisecond"));
		}
		if (!this.dateFormats.hasKey("second")) {
			this.dateFormats.setKey("second", this.language.translate("_date_second"));
		}
		if (!this.dateFormats.hasKey("minute")) {
			this.dateFormats.setKey("minute", this.language.translate("_date_minute"));
		}
		if (!this.dateFormats.hasKey("hour")) {
			this.dateFormats.setKey("hour", this.language.translate("_date_hour"));
		}
		if (!this.dateFormats.hasKey("day")) {
			this.dateFormats.setKey("day", this.language.translate("_date_day"));
		}
		if (!this.dateFormats.hasKey("week")) {
			this.dateFormats.setKey("week", this.language.translate("_date_day"));	 // not a mistake
		}
		if (!this.dateFormats.hasKey("month")) {
			this.dateFormats.setKey("month", this.language.translate("_date_month"));
		}
		if (!this.dateFormats.hasKey("year")) {
			this.dateFormats.setKey("year", this.language.translate("_date_year"));
		}

		if (!this.periodChangeDateFormats.hasKey("millisecond")) {
			this.periodChangeDateFormats.setKey("millisecond", this.language.translate("_date_millisecond"));
		}
		if (!this.periodChangeDateFormats.hasKey("second")) {
			this.periodChangeDateFormats.setKey("second", this.language.translate("_date_second"));
		}
		if (!this.periodChangeDateFormats.hasKey("minute")) {
			this.periodChangeDateFormats.setKey("minute", this.language.translate("_date_minute"));
		}
		if (!this.periodChangeDateFormats.hasKey("hour")) {
			this.periodChangeDateFormats.setKey("hour", this.language.translate("_date_hour"));
		}
		if (!this.periodChangeDateFormats.hasKey("day")) {
			this.periodChangeDateFormats.setKey("day", this.language.translate("_date_day"));
		}
		if (!this.periodChangeDateFormats.hasKey("week")) {
			this.periodChangeDateFormats.setKey("week", this.language.translate("_date_day"));
		}
		if (!this.periodChangeDateFormats.hasKey("month")) {
			this.periodChangeDateFormats.setKey("month", this.language.translate("_date_month") + " " + this.language.translate("_date_year"));
		}

	}

	/**
	 * Returns a new/empty [[DataItem]] of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return {DateAxisDataItem} Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new DateAxisDataItem();
	}

	/**
	 * Returns a new/empty [[AxisBreak]] of the appropriate type.
	 *
	 * @return {DateAxisBreak} Axis break
	 */
	protected createAxisBreak(): this["_axisBreak"] {
		return new DateAxisBreak();
	}

	/**
	 * Validates Axis' data items.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataItems(): void {
		// allows to keep selection of the same size
		let start: number = this.start;
		let end: number = this.end;
		let periodCount: number = (this.max - this.min) / this.baseDuration;

		super.validateDataItems();

		this.maxZoomFactor = (this.max - this.min) / this.baseDuration;

		// allows to keep selection of the same size
		let newPeriodCount: number = (this.max - this.min) / this.baseDuration;
		start = start + (end - start) * (1 - periodCount / newPeriodCount);
		this.zoom({ start: start, end: end }, false, true); // added instantlyto solve zoomout problem when we have axes gaps. @todo: check how this affects maxZoomFactor
	}

	/**
	 * Handles process after zoom.
	 *
	 * @ignore Exclude from docs
	 * @todo Does nothing?
	 */
	public handleSelectionExtremesChange(): void {

	}

	/**
	 * Calculates all positions, related to axis as per current zoom.
	 *
	 * @ignore Exclude from docs
	 */
	public calculateZoom(): void {
		super.calculateZoom();

		let gridInterval: ITimeInterval = this.chooseInterval(0, this.adjustDifference(this._minZoomed, this._maxZoomed), this._gridCount);

		if ($time.getDuration(gridInterval.timeUnit, gridInterval.count) < this.baseDuration) {
			gridInterval = { ...this.baseInterval };
		}

		this._gridInterval = gridInterval;

		this._gridDate = $time.round(new Date(this.min), gridInterval.timeUnit, gridInterval.count);
		this._nextGridUnit = $time.getNextUnit(gridInterval.timeUnit);

		// the following is needed to avoid grid flickering while scrolling
		this._intervalDuration = $time.getDuration(gridInterval.timeUnit, gridInterval.count);
		let count: number = Math.ceil(this._difference / this._intervalDuration);
		count = Math.floor(this.start * count) - 3; // some extra is needed

		$time.add(this._gridDate, gridInterval.timeUnit, count * gridInterval.count);

		// tell series start/end
		$iter.each(this.series.iterator(), (series) => {
			if (series.baseAxis == this) {
				let field = <keyof XYSeriesDataItem>series.getAxisField(this);

				// TODO use $type.castNumber ?
				let startIndex: number = series.dataItems.findClosestIndex(this._minZoomed, (x) => <number>x[field], "left");
				// 1 millisecond is removed so that if only first item is selected, it would not count in the second.
				let endIndex: number = series.dataItems.findClosestIndex(this._maxZoomed - 1, (x) => <number>x[field], "left") + 1;

				series.startIndex = startIndex;
				series.endIndex = endIndex;
			}
		});
	}

	/**
	 * (Re)validates data.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {
		super.validateData();
		if (!$type.isNumber(this.baseInterval.count)) {
			this.baseInterval.count = 1;
		}
	}

	/**
	 * @ignore
	 */
	public get minDifference(): number {
		var minDifference = Number.MAX_VALUE;
		this.series.each((series) => {
			if (minDifference > this._minDifference[series.uid]) {
				minDifference = this._minDifference[series.uid];
			}
		})

		if (minDifference == Number.MAX_VALUE || minDifference == 0) {
			minDifference = $time.getDuration("day");
		}

		return minDifference;
	}

	/**
	 * [dataChangeUpdate description]
	 *
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public seriesDataChangeUpdate(series: XYSeries): void {
		this._minDifference[series.uid] = Number.MAX_VALUE;
	}

	/**
	 * [postProcessSeriesDataItems description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public postProcessSeriesDataItems(): void {
		$iter.each(this.series.iterator(), (series) => {
			$iter.each(series.dataItems.iterator(), (dataItem) => {
				this.postProcessSeriesDataItem(dataItem);
			});
		});

		this.addEmptyUnitsBreaks();
	}

	/**
	 * [postProcessSeriesDataItem description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param {XYSeriesDataItem} dataItem Data item
	 */
	public postProcessSeriesDataItem(dataItem: XYSeriesDataItem): void {
		// we need to do this for all series data items not only added recently, as baseInterval might change
		let baseInterval: ITimeInterval = this.baseInterval;

		$object.each(dataItem.dates, (key) => {
			//for (let key in dataItem.dates) {
			let date: Date = dataItem.getDate(key);
			let startDate: Date = $time.round($time.copy(date), baseInterval.timeUnit, baseInterval.count);
			let endDate: Date = $time.add($time.copy(startDate), baseInterval.timeUnit, baseInterval.count);

			dataItem.setCalculatedValue(key, startDate.getTime(), "open");
			dataItem.setCalculatedValue(key, endDate.getTime(), "close");

			let series: XYSeries = dataItem.component;
			series.dataItemsByAxis.getKey(this.uid).setKey(startDate.getTime().toString(), dataItem);
		});
	}

	/**
	 * Collapses empty stretches of date/time scale by creating [[AxisBreak]]
	 * elements for them.
	 *
	 * Can be used to automatically remove strethes without data, like weekends.
	 *
	 * No, need to call this manually. It will automatically be done if
	 * `skipEmptyPeriods = true`.
	 *
	 * @ignore Exclude from docs
	 */
	protected addEmptyUnitsBreaks(): void {

		if (this.skipEmptyPeriods && $type.isNumber(this.min) && $type.isNumber(this.max)) {
			let timeUnit: TimeUnit = this.baseInterval.timeUnit;
			let count: number = this.baseInterval.count;

			this.axisBreaks.clear(); // TODO: what about breaks added by user?

			let date: Date = $time.round(new Date(this.min), timeUnit, count);
			let axisBreak: DateAxisBreak;

			while (date.getTime() < this.max - this.baseDuration) {
				$time.add(date, timeUnit, count);

				let startTime: number = date.getTime();
				let startTimeStr: string = startTime.toString();

				let hasData = $iter.contains(this.series.iterator(), (series) => {
					return !!series.dataItemsByAxis.getKey(this.uid).getKey(startTimeStr);
				});

				// open break if not yet opened
				if (!hasData) {
					if (!axisBreak) {
						axisBreak = <DateAxisBreak>this.axisBreaks.create();
						axisBreak.startDate = new Date(startTime);
					}
				}
				else {
					// close if already opened
					if (axisBreak) {
						// close at end time minus one millisecond
						axisBreak.endDate = new Date(startTime - 1);
						axisBreak = undefined;
					}
				}
			}
		}
	}

	/**
	 * Updates positioning of Axis breaks after something changes.
	 *
	 * @ignore Exclude from docs
	 */
	public fixAxisBreaks(): void {
		super.fixAxisBreaks();
		let axisBreaks = this._axisBreaks;
		$iter.each(axisBreaks.iterator(), (axisBreak) => {
			let breakGridCount: number = Math.ceil(this._gridCount * (Math.min(this.end, axisBreak.endPosition) - Math.max(this.start, axisBreak.startPosition)) / (this.end - this.start));
			axisBreak.gridInterval = this.chooseInterval(0, axisBreak.adjustedEndValue - axisBreak.adjustedStartValue, breakGridCount);
			let gridDate = $time.round(new Date(axisBreak.adjustedStartValue), axisBreak.gridInterval.timeUnit, axisBreak.gridInterval.count);
			if (gridDate.getTime() > axisBreak.startDate.getTime()) {
				$time.add(gridDate, axisBreak.gridInterval.timeUnit, axisBreak.gridInterval.count);
			}

			axisBreak.gridDate = gridDate;
		});
	}

	/**
	 * [getGridDate description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param  {Date}    date           [description]
	 * @param  {number}  intervalCount  [description]
	 * @return {Date}                   [description]
	 */
	public getGridDate(date: Date, intervalCount: number): Date {
		let timeUnit: TimeUnit = this._gridInterval.timeUnit;
		let realIntervalCount: number = this._gridInterval.count;
		// round date
		$time.round(date, timeUnit);

		let prevTimestamp: number = date.getTime();

		let newDate: Date = $time.copy(date);
		// modify date by adding intervalcount
		let timestamp: number = $time.add(newDate, timeUnit, intervalCount).getTime();

		// if it's axis break, get first rounded date which is not in a break
		let axisBreak: DateAxisBreak = <DateAxisBreak>this.isInBreak(timestamp);
		if (axisBreak) {
			newDate = new Date(axisBreak.endDate.getTime());
			$time.round(newDate, timeUnit, realIntervalCount);
			if (newDate.getTime() < axisBreak.endDate.getTime()) {
				$time.add(newDate, timeUnit, realIntervalCount);
			}
			timestamp = newDate.getTime();
		}

		// get duration between grid lines with break duration removed
		let durationBreaksRemoved: number = this.adjustDifference(prevTimestamp, timestamp);
		// calculate how many time units fit to this duration
		let countBreaksRemoved: number = Math.round(durationBreaksRemoved / $time.getDuration(timeUnit));

		// if less units fit, add one and repeat
		if (countBreaksRemoved < realIntervalCount) {
			return this.getGridDate(date, intervalCount + realIntervalCount);
		}

		return newDate;
	}

	/**
	 * [getBreaklessDate description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param  {DateAxisBreak}  axisBreak  [description]
	 * @param  {TimeUnit}       timeUnit   [description]
	 * @param  {number}         count      [description]
	 * @return {Date}                      [description]
	 */
	public getBreaklessDate(axisBreak: DateAxisBreak, timeUnit: TimeUnit, count: number): Date {
		let date = new Date(axisBreak.endValue);
		$time.round(date, timeUnit, count);
		$time.add(date, timeUnit, count);

		let timestamp = date.getTime();

		axisBreak = <DateAxisBreak>this.isInBreak(timestamp);
		if (axisBreak) {
			return this.getBreaklessDate(axisBreak, timeUnit, count);
		}
		return date;
	}

	/**
	 * (Re)validates all Axis elements.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 */
	public validateAxisElements(): void {
		if ($type.isNumber(this.max) && $type.isNumber(this.min)) {

			this.calculateZoom();

			// first regular items
			let timestamp = this._gridDate.getTime();
			let timeUnit = this._gridInterval.timeUnit;
			let intervalCount = this._gridInterval.count;
			let prevGridDate = $time.copy(this._gridDate);

			let dataItemsIterator = this._dataItemsIterator;
			this.resetIterators();

			while (timestamp <= this._maxZoomed) {
				let date = this.getGridDate(new Date(prevGridDate), intervalCount);

				timestamp = date.getTime();

				let endDate = $time.copy(date); // you might think it's easier to add intervalduration to timestamp, however it won't work for months or years which are not of the same length
				endDate = $time.add(endDate, timeUnit, intervalCount);

				let format = this.dateFormats.getKey(timeUnit);

				if (this.markUnitChange && prevGridDate) {
					if ($time.checkChange(date, prevGridDate, this._nextGridUnit)) {
						if (timeUnit !== "year") {
							format = this.periodChangeDateFormats.getKey(timeUnit);
						}
					}
				}

				let text = this.dateFormatter.format(date, format);

				let dataItem = dataItemsIterator.find((x) => x.text === text);
				this.appendDataItem(dataItem);

				dataItem.axisBreak = undefined;
				dataItem.date = date;
				dataItem.endDate = endDate;

				dataItem.text = text;

				prevGridDate = date;

				this.validateDataElement(dataItem);
			}

			// breaks later
			let renderer: AxisRenderer = this.renderer;

			$iter.each(this.axisBreaks.iterator(), (axisBreak) => {
				if (axisBreak.breakSize > 0) {
					let timeUnit: TimeUnit = axisBreak.gridInterval.timeUnit;
					let intervalCount: number = axisBreak.gridInterval.count;

					// only add grid if gap is bigger then minGridDistance
					if ($math.getDistance(axisBreak.startPoint, axisBreak.endPoint) > renderer.minGridDistance * 4) {
						let timestamp: number = axisBreak.gridDate.getTime();

						let prevGridDate;
						let count: number = 0;
						while (timestamp <= axisBreak.adjustedMax) {
							let date: Date = $time.copy(axisBreak.gridDate);
							timestamp = $time.add(date, timeUnit, intervalCount * count).getTime();
							count++;
							if (timestamp > axisBreak.adjustedStartValue && timestamp < axisBreak.adjustedEndValue) {
								let endDate = $time.copy(date); // you might think it's easier to add intervalduration to timestamp, however it won't work for months or years which are not of the same length
								endDate = $time.add(endDate, timeUnit, intervalCount);

								let format: string = this.dateFormats.getKey(timeUnit);

								if (this.markUnitChange && prevGridDate) {
									if ($time.checkChange(date, prevGridDate, this._nextGridUnit)) {
										if (timeUnit !== "year") {
											format = this.periodChangeDateFormats.getKey(timeUnit);
										}
									}
								}

								let text: string = this.dateFormatter.format(date, format);

								let dataItem: this["_dataItem"] = dataItemsIterator.find((x) => x.text === text);
								//this.processDataItem(dataItem);
								this.appendDataItem(dataItem);
								dataItem.axisBreak = axisBreak;
								axisBreak.dataItems.moveValue(dataItem);

								dataItem.date = date;
								dataItem.endDate = endDate;
								dataItem.text = text;
								prevGridDate = date;
								this.validateDataElement(dataItem);
							}
						}
					}
				}
			});
		}
	}

	/**
	 * Validates Axis data item.
	 *
	 * @ignore Exclude from docs
	 * @param {DateAxisDataItem} dataItem Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {
		//super.validateDataElement(dataItem);
		if ($type.isNumber(this.max) && $type.isNumber(this.min)) {
			let renderer: AxisRenderer = this.renderer;

			let timestamp = dataItem.value;
			let endTimestamp = dataItem.endValue;

			if (!$type.isNumber(endTimestamp)) {
				endTimestamp = timestamp;
			}

			let position: number = this.valueToPosition(timestamp);
			let endPosition: number = this.valueToPosition(endTimestamp);
			let fillEndPosition = endPosition;

			if (!dataItem.isRange && this._gridInterval.count > 1) {
				endPosition = position + (endPosition - position) / this._gridInterval.count;
			}

			dataItem.position = position;

			let tick: AxisTick = dataItem.tick;
			if (tick && !tick.disabled) {
				renderer.updateTickElement(tick, position, endPosition);
			}

			let grid: Grid = dataItem.grid;
			if (grid && !grid.disabled) {
				renderer.updateGridElement(grid, position, endPosition);
			}

			let fill: AxisFill = dataItem.axisFill;
			if (fill && !fill.disabled) {
				renderer.updateFillElement(fill, position, fillEndPosition);
				if (!dataItem.isRange) {
					this.fillRule(dataItem);
				}
			}

			let mask: AxisFill = dataItem.mask;
			if (mask) {
				renderer.updateFillElement(mask, position, endPosition);
			}

			let label: AxisLabel = dataItem.label;
			if (label && !label.disabled) {
				let location = label.location;

				if (location == 0) {
					if (this._gridInterval.count == 1 && this._gridInterval.timeUnit != "week" && !dataItem.isRange) {
						location = 0.5;
					}
					else {
						location = 0;
					}
				}

				renderer.updateLabelElement(label, position, endPosition, location);
			}
		}
	}

	/**
	 * A duration in milliseconds of the `baseInterval`.
	 *
	 * @return {number} Duration (ms)
	 */
	public get baseDuration(): number {
		return $time.getDuration(this.baseInterval.timeUnit, this.baseInterval.count);
	}

	/**
	 * Adjusts min/max values.
	 *
	 * @ignore Exclude from docs.
	 * @todo Description (review)
	 * @param  {number}       min  Min timestamp
	 * @param  {number}       max  Max timestamp
	 * @return {IMinMaxStep}       Adjusted min/max step
	 */
	public adjustMinMax(min: number, max: number): IMinMaxStep {
		return { min: min, max: max, step: this.baseDuration };
	}

	/**
	 * Adjusts the minimum timestamp as per cell start location.
	 *
	 * @param  {number}  value  Value
	 * @return {number}         Adjusted value
	 */
	protected fixMin(value: number) {
		return $time.round(new Date(value), this.baseInterval.timeUnit, this.baseInterval.count).getTime() + this.baseDuration * this.startLocation;
	}

	/**
	 * Adjusts the maximum timestamp as per cell start location.
	 *
	 * @param  {number}  value  Value
	 * @return {number}         Adjusted value
	 */
	protected fixMax(value: number) {
		return $time.round(new Date(value), this.baseInterval.timeUnit, this.baseInterval.count).getTime() + this.baseDuration * this.endLocation;
	}

	/**
	 * [chooseInterval description]
	 *
	 * @ignore Exclude from docs.
	 * @todo Description
	 * @param  {number}         index      [description]
	 * @param  {number}         duration   [description]
	 * @param  {number}         gridCount  [description]
	 * @return {ITimeInterval}             [description]
	 */
	public chooseInterval(index: number, duration: number, gridCount: number): ITimeInterval {
		let gridIntervals: List<ITimeInterval> = this.gridIntervals;

		let gridInterval: ITimeInterval = gridIntervals.getIndex(index);

		let intervalDuration: number = $time.getDuration(gridInterval.timeUnit, gridInterval.count);

		let lastIndex: number = gridIntervals.length - 1;
		if (index >= lastIndex) {
			return { ...gridIntervals.getIndex(lastIndex) };
		}

		let count: number = Math.ceil(duration / intervalDuration);

		if (duration < intervalDuration && index > 0) {
			return { ...gridIntervals.getIndex(index - 1) };
		}

		if (count <= gridCount) {
			return { ...gridIntervals.getIndex(index) };
		} else {
			if (index + 1 < gridIntervals.length) {
				return this.chooseInterval(index + 1, duration, gridCount);
			} else {
				return { ...gridIntervals.getIndex(index) };
			}
		}
	}

	/**
	 * Formats the value according to axis' own [[DateFormatter]].
	 *
	 * @param  {number}  value  Source value
	 * @return {string}         Formatted value
	 */
	public formatLabel(value: number): string {
		return this.dateFormatter.format(value);
	}

	/**
	 * Converts a Date to an asbolute pixel position within Axis.
	 *
	 * @param  {Date}    date  Date
	 * @return {number}        Position (px)
	 */
	public dateToPosition(date: Date): number {
		return this.valueToPosition(date.getTime());
	}

	/**
	 * Converts a numeric timestamp or a `Date` to a relative position on axis.
	 *
	 * @param  {Date | number}  date  Date or a timestamp
	 * @return {number}               Relative position
	 */
	public anyToPosition(date: Date | number): number {
		if (date instanceof Date) {
			return this.dateToPosition(date);
		}
		else {
			return this.valueToPosition(date);
		}
	}

	/**
	 * Converts date to orientation point (x, y, angle) on axis
	 *
	 * @param  {Date}  date Date
	 * @return {IOrientationPoint} IOrientationPoint
	 */
	public dateToPoint(date: Date): IOrientationPoint {
		let position = this.dateToPosition(date);
		let point = this.renderer.positionToPoint(position);
		let angle = this.renderer.positionToAngle(position);
		return { x: point.x, y: point.y, angle: angle };
	}


	/**
	 * Converts a numeric value to orientation (x, y, angle) point on axis
	 *
	 * @param  {number}  value  Value
	 * @return {IOrientationPoint}  Orientation point
	 */
	public anyToPoint(date: Date | number): IOrientationPoint {
		if (date instanceof Date) {
			return this.dateToPoint(date);
		}
		else {
			return this.valueToPoint(date);
		}
	}

	/**
	 * Converts pixel position within Axis to a corresponding Date.
	 *
	 * @param  {number}  position  Position (px)
	 * @return {Date}              Date
	 */
	public positionToDate(position: number): Date {
		return new Date(this.positionToValue(position));
	}

	/**
	 * Returns the X coordinate for series' data item's value.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param  {XYSeriesDataItem}  dataItem  Data item
	 * @param  {string}            key       Data field to get value from
	 * @param  {number}            location  Location (0-1)
	 * @return {number}                      X coordinate (px)
	 */
	public getX(dataItem: XYSeriesDataItem, key: string, location?: number): number {
		let value: number = this.getTimeByLocation(dataItem, key, location);
		//let stack: number = dataItem.getValue("valueX", "stack");

		if (!$type.isNumber(value)) {
			value = this.baseValue;
		}

		return this.renderer.positionToPoint(this.valueToPosition(value)).x;
	}

	/**
	 * Returns the Y coordinate for series' data item's value.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param  {XYSeriesDataItem}  dataItem  Data item
	 * @param  {string}            key       Data field to get value from
	 * @param  {number}            location  Location (0-1)
	 * @return {number}                      Y coordinate (px)
	 */
	public getY(dataItem: XYSeriesDataItem, key: string, location?: number): number {
		let value: number = this.getTimeByLocation(dataItem, key, location);
		let stack: number = dataItem.getValue("valueX", "stack");

		if (!$type.isNumber(value)) {
			value = this.baseValue;
		}

		return this.renderer.positionToPoint(this.valueToPosition(value + stack)).y;
	}

	/**
	 * Returns an angle for series data item.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param  {XYSeriesDataItem}  dataItem  Data item
	 * @param  {string}            key       Data field to get value from
	 * @param  {number}            location  Location (0-1)
	 * @param  {string}            stackKey  Stack ID
	 * @return {number}                      Angle
	 */
	public getAngle(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number {
		let value: number = this.getTimeByLocation(dataItem, key, location);
		let stack: number = dataItem.getValue(stackKey, "stack");

		if (!$type.isNumber(value)) {
			value = this.baseValue;
		}

		return this.positionToAngle(this.valueToPosition(value + stack));
	}

	/**
	 * [getTimeByLocation description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param  {XYSeriesDataItem}  dataItem  [description]
	 * @param  {string}            key       [description]
	 * @param  {number}            location  [description]
	 * @return {number}                      [description]
	 */
	protected getTimeByLocation(dataItem: XYSeriesDataItem, key: string, location: number): number {
		if (!$type.hasValue(key)) {
			return;
		}

		if (!$type.isNumber(location)) {
			location = dataItem.workingLocations[key];

			if (!$type.isNumber(location)) {
				location = 0;
			}
		}

		let startTime: number = dataItem.values[key]["open"];
		let endTime: number = dataItem.values[key]["close"];

		if ($type.isNumber(startTime) && $type.isNumber(endTime)) {
			return startTime + (endTime - startTime) * location;
		}
	}

	/**
	 * Processes a related series' data item.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param {XYSeriesDataItem}  dataItem  Data item
	 */
	public processSeriesDataItem(dataItem: XYSeriesDataItem, axisLetter?: string): void {

		let series = dataItem.component;
		let time: number;

		let date: Date = (<any>dataItem)["date" + axisLetter];
		if (date) {
			time = date.getTime();
		}
		else {
			return;
		}
		let openDate: Date = (<any>dataItem)["openDate" + axisLetter];
		let prevSeriesTime: number = this._prevSeriesTime;


		let openTime: number;
		if (openDate) {
			openTime = openDate.getTime();
		}

		if ($type.isNumber(openTime)) {
			let difference = Math.abs(time - openTime);

			if (this._minDifference[series.uid] > difference) {
				this._minDifference[series.uid] = difference;
			}
		}

		let differece: number = time - prevSeriesTime;

		if (differece > 0) {
			if (this._minDifference[series.uid] > differece) {
				this._minDifference[series.uid] = differece;
			}
		}

		this._prevSeriesTime = time;
	}

	/**
	 * [updateAxisBySeries description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public updateAxisBySeries() {
		super.updateAxisBySeries();

		let baseInterval: ITimeInterval = this.chooseInterval(0, this.minDifference, 1);
		// handle short months
		if (this.minDifference >= $time.getDuration("day", 27) && baseInterval.timeUnit == "week") {
			baseInterval.timeUnit = "month";
			baseInterval.count = 1;
		}
		// handle daylight saving
		if (this.minDifference >= $time.getDuration("hour", 23) && baseInterval.timeUnit == "hour") {
			baseInterval.timeUnit = "day";
			baseInterval.count = 1;
		}

		//baseInterval.count = 1; // good
		this._baseIntervalReal = baseInterval;
		// no need to invalidate
	}

	/**
	 * A base interval (granularity) of data.
	 *
	 * Used to indicate what are the base units of your data.
	 *
	 * For example, if you have a data set that has a data point every 5 minutes,
	 * you may want to set this to `{ timeUnit: "minute", count: 5 }`.
	 *
	 * If not set, the Axis will try to determine the setting by its own, looking
	 * at actual data.
	 *
	 * @param {ITimeInterval} timeInterval base interval
	 */
	public set baseInterval(timeInterval: ITimeInterval) {
		this._baseInterval = timeInterval;
	}

	/**
	 * @return {ITimeInterval} Base interval
	 */
	public get baseInterval(): ITimeInterval {
		if (this._baseInterval) {
			return this._baseInterval;
		}
		else {
			return this._baseIntervalReal;
		}
	}

	/**
	 * If enabled, axis will automatically collapse empty (without data points)
	 * periods of time, i.e. weekends.
	 *
	 * An "empty" period is considered a stretch of time in the length of current
	 * `baseInterval` without a single data point in it.
	 *
	 * For each such empty period, axis will automatically create an
	 * [[AxisBreak]]. By default they will be invisible. You can still configure
	 * them by accessing `axis.breaks.template`.
	 *
	 * [More info about breaks](https://www.amcharts.com/docs/v4/concepts/axes/#Breaks).
	 *
	 * Important notes:
	 * * If you set this property to `true`, you can not add your custom axis breaks to this axis anymore.
	 * * Using this feature affects performance. Use only if you need it.
	 * * Setting this to `true` will reset appearance of breaks. If you want to modify appearance, do it *after* you set `skipEmptyPeriods`.
	 *
	 * @default false
	 * @param {boolean}  value  Remove empty stretches of time?
	 */
	public set skipEmptyPeriods(value: boolean) {
		if (this.setPropertyValue("skipEmptyPeriods", value)) {
			this.invalidateData();
		}

		if (value) {
			let breakTemplate = this.axisBreaks.template;
			breakTemplate.startLine.disabled = true;
			breakTemplate.endLine.disabled = true;
			breakTemplate.fillShape.disabled = true;
			breakTemplate.breakSize = 0;
		}
	}

	/**
	 * @return {boolean} Remove empty stretches of time?
	 */
	public get skipEmptyPeriods(): boolean {
		return this.getPropertyValue("skipEmptyPeriods");
	}

	/**
	 * A special date format to apply axis tooltips.
	 *
	 * Will use same format as for labels, if not set.
	 *
	 * @param {string}  value  Date format
	 */
	public set tooltipDateFormat(value: string) {
		this.setPropertyValue("tooltipDateFormat", value);
	}

	/**
	 * @return {string} Date format
	 */
	public get tooltipDateFormat(): string {
		return this.getPropertyValue("tooltipDateFormat");
	}

	/**
	 * Use `periodChangeDateFormats` to apply different formats to the first
	 * label in bigger time unit.
	 *
	 * @default true
	 * @param {boolean}  value  Use different format for period beginning?
	 */
	public set markUnitChange(value: boolean) {
		if (this.setPropertyValue("markUnitChange", value)) {
			this.invalidateData();
		}
	}

	/**
	 * @return {boolean} Use different format for period beginning?
	 */
	public get markUnitChange(): boolean {
		return this.getPropertyValue("markUnitChange");
	}

	/**
	 * Returns text to show in a tooltip, based on specific relative position
	 * within axis.
	 *
	 * The label will be formatted as per [[DateFormatter]] set for the whole
	 * chart, or explicitly for this Axis.
	 *
	 * @ignore Exclude from docs
	 * @param  {number}  position  Position
	 * @return {string}            Label (formatted date)
	 */
	public getTooltipText(position: number): string {
		let text: string;
		let date = this.positionToDate(position);
		date = $time.round(date, this.baseInterval.timeUnit, this.baseInterval.count);

		if ($type.hasValue(this.tooltipDateFormat)) {
			text = this.dateFormatter.format(date, this.tooltipDateFormat);
		}
		else {
			let dateFormat = this.dateFormats.getKey(this.baseInterval.timeUnit);
			if (dateFormat) {
				text = this.dateFormatter.format(date, dateFormat);
			}
			else {
				text = this.getPositionLabel(position);
			}
		}
		return this.adapter.apply("getTooltipText", text);
	}

	/**
	 * Takes an absolute position within axis and adjust it to a specific position within base interval. (cell)
	 *
	 * @ignore Exclude from docs
	 * @param  {number}            position Source position
	 * @param  {AxisItemLocation}  location  Location in the cell
	 * @return {number}            Adjusted position
	 */
	public roundPosition(position: number, location?: AxisItemLocation): number {
		let baseInterval = this.baseInterval;
		let timeUnit = baseInterval.timeUnit;
		let count = baseInterval.count;

		let date: Date = this.positionToDate(position);

		$time.round(date, timeUnit, count);

		if (location > 0) {
			$time.add(date, timeUnit, location * count);
		}

		if (this.isInBreak(date.getTime())) {
			while (date.getTime() < this.max) {
				$time.add(date, timeUnit, count);
				if (!this.isInBreak(date.getTime())) {
					break;
				}
			}
		}

		return this.dateToPosition(date);
	}

	/**
	 * Returns an relative position of the start of the cell (period), that specific position value falls into.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param  {number}  position  Relative position
	 * @return {number}            Cell start relative position
	 */
	public getCellStartPosition(position: number): number {
		return this.roundPosition(position, 0);
	}

	/**
	 * Returns an relative position of the end of the cell (period), that specific position value falls into.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param  {number}  position  Relative position
	 * @return {number}            Cell end relative position
	 */
	public getCellEndPosition(position: number): number {
		return this.roundPosition(position, 1);
		//return this.dateToPosition($time.add(this.positionToDate(this.roundPosition(position, 1)), this.baseInterval.timeUnit, this.baseInterval.count));
	}

	/**
	 * Returns a Series data item that corresponds to the specific pixel position
	 * of the Axis.
	 *
	 * If `findNearest` (third parameter) is set to `true`, the method will try
	 * to locate nearest available data item if none is found directly under
	 * `position`.
	 *
	 * @param  {XYSeries}          series       Series
	 * @param  {number}            position     Position (px)
	 * @param  {boolean}           findNearest  Should axis try to find nearest tooltip if there is no data item at exact position
	 * @return {XYSeriesDataItem}               Data item
	 */
	public getSeriesDataItem(series: XYSeries, position: number, findNearest?: boolean): XYSeriesDataItem {
		let value: number = this.positionToValue(position);
		let date: Date = $time.round(new Date(value), this.baseInterval.timeUnit, this.baseInterval.count);
		let dataItem = series.dataItemsByAxis.getKey(this.uid).getKey(date.getTime().toString());

		// todo:  alternatively we can find closiest here
		if (!dataItem && findNearest) {
			// to the left
			let leftCount = 0;
			let leftDataItem: XYSeriesDataItem;
			let leftDate = new Date(date.getTime());

			while (leftDate.getTime() > this.minZoomed) {
				leftDate = $time.add(leftDate, this.baseInterval.timeUnit, -this.baseInterval.count);
				leftDataItem = series.dataItemsByAxis.getKey(this.uid).getKey(leftDate.getTime().toString());
				if (leftDataItem) {
					break;
				}
				leftCount++;
				if (leftCount > 5000) {
					break;
				}
			}

			let rightCount = 0;
			let rightDataItem: XYSeriesDataItem;
			let rightDate = new Date(date.getTime());
			while (rightDate.getTime() < this.maxZoomed) {
				rightDate = $time.add(rightDate, this.baseInterval.timeUnit, this.baseInterval.count);
				rightDataItem = series.dataItemsByAxis.getKey(this.uid).getKey(rightDate.getTime().toString());
				if (rightDataItem) {
					break;
				}
				rightCount++;
				if (rightCount > 5000) {
					break;
				}
			}

			if (leftDataItem && !rightDataItem) {
				return leftDataItem;
			}
			else if (!leftDataItem && rightDataItem) {
				return rightDataItem;
			}
			else if (leftDataItem && rightDataItem) {
				if (leftCount < rightCount) {
					return leftDataItem;
				}
				else {
					return rightDataItem;
				}
			}
		}
		return dataItem;
	}

	/**
	 * Returns a formatted date based on position in axis scale.
	 *
	 * Please note that `position` represents position within axis which may be
	 * zoomed and not correspond to Cursor's `position`.
	 *
	 * To convert Cursor's `position` to Axis' `position` use `toAxisPosition()` method.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/tutorials/tracking-cursors-position-via-api/#Tracking_Cursor_s_position} For more information about cursor tracking.
	 * @param  {number}  position  Relative position on axis (0-1)
	 * @return {string}            Position label
	 */
	public getPositionLabel(position: number): string {
		// @todo Better format recognition
		let date = this.positionToDate(position);
		return this.dateFormatter.format(date, this.getCurrentLabelFormat());
	}

	/**
	 * Returns label date format based on currently used time units
	 *
	 * @return {string}  Format
	 */
	protected getCurrentLabelFormat(): string {
		return this.dateFormats.getKey(this._gridInterval ? this._gridInterval.timeUnit : "day");
	}

	/**
	 * Initializes an Axis renderer.
	 *
	 * @ignore Exclude from docs
	 */
	public initRenderer(): void {
		super.initRenderer();
		let renderer = this.renderer;
		if (renderer) {
			// Set defaults
			renderer.ticks.template.location = 0;
			renderer.grid.template.location = 0;
			renderer.labels.template.location = 0;
			renderer.baseGrid.disabled = true;
		}
	}

	/**
	 * Coordinates of the actual axis start.
	 *
	 * @ignore Exclude from docs
	 * @return {IPoint} Base point
	 */
	public get basePoint(): IPoint {
		return { x: 0, y: 0 };
	}


	/**
	 * Zooms axis to specific Dates.
	 *
	 * @param {Date}     startDate       Start date
	 * @param {Date}     endValue        End date
	 * @param {boolean}  skipRangeEvent  Do not invoke events
	 * @param {boolean}  instantly       Do not play zoom animations
	 */
	public zoomToDates(startDate: Date, endDate: Date, skipRangeEvent?: boolean, instantly?: boolean): void {
		startDate = this.dateFormatter.parse(startDate);
		endDate = this.dateFormatter.parse(endDate);
		this.zoomToValues(startDate.getTime(), endDate.getTime(), skipRangeEvent, instantly);
	}

	/**
	 * Adds `baseInterval` to "as is" fields.
	 *
	 * @param  {string}   field  Field name
	 * @return {boolean}         Assign as is?
	 */
	protected asIs(field: string): boolean {
		return field == "baseInterval" || super.asIs(field);
	}

	/**
	 * Copies all properties and related data from a different instance of Axis.
	 *
	 * @param {this} source Source Axis
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.dateFormats = source.dateFormats;
		this.periodChangeDateFormats = source.periodChangeDateFormats;
		if (source["_baseInterval"]) {
			this.baseInterval = source.baseInterval;
		}
	}


	/**
	 * Shows Axis tooltip at specific relative position within Axis. (0-1)
	 *
	 * @param {number} position Position (0-1)
	 * @param {boolean} local or global position
	 */
	public showTooltipAtPosition(position: number, local?: boolean) {

		if (!local) {
			position = this.toAxisPosition(position);
		}
		if (this.snapTooltip) {
			let actualDate = $time.round(this.positionToDate(position), this.baseInterval.timeUnit, 1);

			let actualTime = actualDate.getTime();
			let closestDate: Date;

			this.series.each((series) => {

				let dataItem = this.getSeriesDataItem(series, position, true);
				if (dataItem) {
					let date: Date;
					if (series.xAxis == this) {
						date = dataItem.dateX;
					}
					if (series.yAxis == this) {
						date = dataItem.dateY;
					}

					if (!closestDate) {
						closestDate = date;
					}
					else {
						if (Math.abs(closestDate.getTime() - actualTime) > Math.abs(date.getTime() - actualTime)) {
							closestDate = date;
						}
					}
				}
			})

			if (closestDate) {
				closestDate = $time.round(new Date(closestDate.getTime()), this.baseInterval.timeUnit, this.baseInterval.count);
				closestDate = new Date(closestDate.getTime() + this.baseDuration / 2);
				position = this.dateToPosition(closestDate);
			}
		}

		super.showTooltipAtPosition(position, true);

		let globalPosition = this.toGlobalPosition(position);

		this.series.each((series) => {
			if (series.xAxis == this) {
				series.showTooltipAtPosition(globalPosition, undefined);
			}
			if (series.yAxis == this) {
				series.showTooltipAtPosition(undefined, globalPosition);
			}
		})
	}

	/**
	 * Should the nearest tooltip be shown if no data item is found on the
	 * current cursor position.
	 *
	 * @default true
	 * @param {boolean}  value  Should snap?
	 */
	public set snapTooltip(value: boolean) {
		this.setPropertyValue("snapTooltip", value);
	}

	/**
	 * @return {boolean} Should snap?
	 */
	public get snapTooltip(): boolean {
		return this.getPropertyValue("snapTooltip");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["DateAxis"] = DateAxis;
registry.registeredClasses["DateAxisDataItem"] = DateAxisDataItem;
