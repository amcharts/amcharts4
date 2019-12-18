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
import { LineSeriesDataItem } from "../series/LineSeries";
import { TimeUnit } from "../../core/defs/TimeUnit";
import { ITimeInterval } from "../../core/defs/ITimeInterval";
import { IMinMaxStep } from "./ValueAxis";
import { DateAxisBreak } from "./DateAxisBreak";
import { registry } from "../../core/Registry";
import * as $time from "../../core/utils/Time";
import * as $type from "../../core/utils/Type";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $array from "../../core/utils/Array";
import * as $object from "../../core/utils/Object";
import * as $utils from "../../core/utils/Utils";
import { IRange } from "../../core/defs/IRange";
import { DateFormatter } from "../../core/formatters/DateFormatter";
import { OrderedListTemplate } from "../../core/utils/SortedList";
import { Animation } from "../../core/utils/Animation";

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
	 * @param date  Date
	 */
	public set date(date: Date) {
		this.setDate("date", date);
		this.value = date.getTime();
	}

	/**
	 * @return Date
	 */
	public get date(): Date {
		return this.dates["date"];
	}


	/**
	 * End date for data item.
	 *
	 * @param date End date
	 */
	public set endDate(date: Date) {
		this.setDate("endDate", date);
		this.endValue = date.getTime();
	}

	/**
	 * @return End date
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
	 */
	skipEmptyPeriods?: boolean;

	/**
	 * Use `periodChangeDateFormats` to apply different formats to the first
	 * label in bigger time unit.
	 *
	 * @default true
	 * @param value  Use different format for period beginning?
	 */
	markUnitChange?: boolean;

	/**
	 * Should the nearest tooltip be shown if no data item is found on the
	 * current cursor position.
	 *
	 * @default true
	 */
	snapTooltip?: boolean;

	/**
	 * A special date format to apply axis tooltips.
	 *
	 * Will use same format as for labels, if not set.
	 */
	tooltipDateFormat?: string | Intl.DateTimeFormatOptions;

	/**
	 * Indicates if data should be aggregated to composide data items if there
	 * are more data items in selected range than `groupCount`.
	 *
	 * @default false
	 * @since 4.7.0
	 */
	groupData?: boolean;

	/**
	 * Indicates threshold of data items in selected range at which to start
	 * aggregating data items if `groupData = true`.
	 * 
	 * @default 200
	 * @since 4.7.0
	 */
	groupCount?: number;

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
 * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/date-axis/} got `DateAxis` documention
 * @important
 */
export class DateAxis<T extends AxisRenderer = AxisRenderer> extends ValueAxis<T> {

	/**
	 * Defines data fields.
	 */
	public _dataFields: IDateAxisDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IDateAxisProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IDateAxisAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IDateAxisEvents;

	/**
	 * Defines the type of the Date Items.
	 */
	public _dataItem: DateAxisDataItem;

	/**
	 * Defines the type of the axis breaks.
	 */
	public _axisBreak: DateAxisBreak;

	protected _gapBreaks: boolean = false;

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
	 */
	public gridIntervals: List<ITimeInterval> = new List<ITimeInterval>();

	/**
	 * If data aggregation is enabled by setting Axis' `groupData = true`, the
	 * chart will try to aggregate data items into grouped data items.
	 *
	 * If there are more data items in selected period than `groupCount`, it will
	 * group data items into bigger period.
	 *
	 * For example seconds might be grouped into 10-second aggregate data items.
	 *
	 * This setting indicates what group intervals can the chart group to.
	 *
	 * Default intervals:
	 *
	 * ```JSON
	 * [
	 *   { timeUnit: "millisecond", count: 1},
	 *   { timeUnit: "millisecond", count: 10 },
	 *   { timeUnit: "millisecond", count: 100 },
	 *   { timeUnit: "second", count: 1 },
	 *   { timeUnit: "second", count: 10 },
	 *   { timeUnit: "minute", count: 1 },
	 *   { timeUnit: "minute", count: 10 },
	 *   { timeUnit: "hour", count: 1 },
	 *   { timeUnit: "day", count: 1 },
	 *   { timeUnit: "week", count: 1 },
	 *   { timeUnit: "month", count: 1 },
	 *   { timeUnit: "year", count: 1 }
	 * ]
	 * ```
	 * 
	 * @since 4.7.0
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Dynamic_data_item_grouping} for more information about dynamic data item grouping.
	 */
	public groupIntervals: List<ITimeInterval> = new List<ITimeInterval>();

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
	 */
	public dateFormats: Dictionary<TimeUnit, string | Intl.DateTimeFormatOptions> = new Dictionary<TimeUnit, string | Intl.DateTimeFormatOptions>();

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
	 */
	public periodChangeDateFormats: Dictionary<TimeUnit, string | Intl.DateTimeFormatOptions> = new Dictionary<TimeUnit, string | Intl.DateTimeFormatOptions>();

	/**
	 * At which intervals grid elements are displayed.
	 */
	protected _gridInterval: ITimeInterval;

	/**
	 * [_intervalDuration description]
	 *
	 * @todo Description
	 */
	protected _intervalDuration: number;

	/**
	 * [_gridDate description]
	 *
	 * @todo Description
	 */
	protected _gridDate: Date;

	/**
	 * [_nextGridUnit description]
	 *
	 * @todo Description
	 */
	protected _nextGridUnit: TimeUnit;

	/**
	 * User-defined granularity of data.
	 */
	protected _baseInterval: ITimeInterval;

	/**
	 * This is base interval of the main data set.
	 */
	protected _mainBaseInterval: ITimeInterval;

	/**
	 * This is base interval of the currently selected data set.
	 */
	protected _groupInterval: ITimeInterval;

	/**
	 * Actual interval (granularity) derived from the actual data.
	 */
	protected _baseIntervalReal: ITimeInterval = { timeUnit: "day", count: 1 };

	/**
	 */
	protected _prevSeriesTime: number;

	/**
	 * [_minDifference description]
	 *
	 * @todo Description
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
	 */
	public fillRule(dataItem: this["_dataItem"]): void {
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
	 * @ignore
	 */
	protected _firstWeekDay: number = 1;

	/**
	 * @ignore
	 */
	protected _df: DateFormatter;

	/**
	 * A collection of start timestamps to use as axis' min timestamp for
	 * particular data item item periods.
	 *
	 * @since 4.7.0
	 * @readonly
	 */
	public groupMin: { [index: string]: number } = {};

	/**
	 * A collection of start timestamps to use as axis' max timestamp for
	 * particular data item item periods.
	 *
	 * @since 4.7.0
	 * @readonly
	 */
	public groupMax: { [index: string]: number } = {};

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "DateAxis";

		this.setPropertyValue("markUnitChange", true);
		this.snapTooltip = true;
		this.tooltipPosition = "pointer";

		this.setPropertyValue("groupData", false);
		this.groupCount = 200;

		this.events.on("parentset", this.getDFFormatter, this, false);

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

		this.groupIntervals.pushAll([
			{ timeUnit: "millisecond", count: 1 },
			{ timeUnit: "millisecond", count: 10 },
			{ timeUnit: "millisecond", count: 100 },
			{ timeUnit: "second", count: 1 },
			{ timeUnit: "second", count: 10 },
			{ timeUnit: "minute", count: 1 },
			{ timeUnit: "minute", count: 10 },
			{ timeUnit: "hour", count: 1 },
			{ timeUnit: "day", count: 1 },
			{ timeUnit: "week", count: 1 },
			{ timeUnit: "month", count: 1 },
			{ timeUnit: "year", count: 1 }
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
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new DateAxisDataItem();
	}

	/**
	 * Returns a new/empty [[AxisBreak]] of the appropriate type.
	 *
	 * @return Axis break
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
		let baseDuration = this.baseDuration;
		let periodCount: number = (this.max - this.min) / baseDuration;

		this._firstWeekDay = this.getFirstWeekDay();
		this.getDFFormatter();

		super.validateDataItems();

		let mainBaseDuration = $time.getDuration(this.mainBaseInterval.timeUnit, this.mainBaseInterval.count)

		this.maxZoomFactor = (this.max - this.min) / mainBaseDuration;

		this._deltaMinMax = this.baseDuration / 2;

		// allows to keep selection of the same size
		let newPeriodCount: number = (this.max - this.min) / baseDuration;
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

		let difference = this.adjustDifference(this._minZoomed, this._maxZoomed);
		let dataSetChanged = false;

		// if data has to be grouped, choose interval and set dataset
		if (this.groupData && $type.hasValue(difference)) {
			let mainBaseInterval = this.mainBaseInterval;
			let groupInterval = this.chooseInterval(0, difference, this.groupCount, this.groupIntervals);
			if ($time.getDuration(groupInterval.timeUnit, groupInterval.count) < $time.getDuration(mainBaseInterval.timeUnit, mainBaseInterval.count)) {
				groupInterval = { ...mainBaseInterval };
			}
			this._groupInterval = groupInterval;

			this._currentDataSetId = groupInterval.timeUnit + groupInterval.count;

			this.series.each((series) => {
				if (series.baseAxis == this) {
					if (series.setDataSet(this._currentDataSetId)) {
						dataSetChanged = true;
					}
				}
			})
		}

		let gridInterval: ITimeInterval = this.chooseInterval(0, difference, this._gridCount);

		if ($time.getDuration(gridInterval.timeUnit, gridInterval.count) < this.baseDuration) {
			gridInterval = { ...this.baseInterval };
		}

		this._gridInterval = gridInterval;
		this._nextGridUnit = $time.getNextUnit(gridInterval.timeUnit);

		// the following is needed to avoid grid flickering while scrolling
		this._intervalDuration = $time.getDuration(gridInterval.timeUnit, gridInterval.count);
		this._gridDate = $time.round(new Date(this.minZoomed - $time.getDuration(gridInterval.timeUnit, gridInterval.count)), gridInterval.timeUnit, gridInterval.count, this._firstWeekDay, this._df.utc, new Date(this.min));

		// tell series start/end
		$iter.each(this.series.iterator(), (series) => {
			if (series.baseAxis == this) {
				let field = <keyof XYSeriesDataItem>series.getAxisField(this);

				let minZoomed = $time.round(new Date(this._minZoomed), this.baseInterval.timeUnit, this.baseInterval.count).getTime();
				let minZoomedStr = minZoomed.toString();
				let startDataItem = series.dataItemsByAxis.getKey(this.uid).getKey(minZoomedStr + series.currentDataSetId);

				let startIndex: number = 0;
				if (this.start != 0) {
					if (startDataItem) {
						startDataItem = this.findFirst(startDataItem, minZoomed, field);
						startIndex = startDataItem.index;
					}
					else {
						startIndex = series.dataItems.findClosestIndex(this._minZoomed, (x) => <number>x[field], "left");
					}
				}
				// 1 millisecond is removed so that if only first item is selected, it would not count in the second.
				let baseInterval = this.baseInterval;
				let maxZoomed = $time.add($time.round(new Date(this._maxZoomed), baseInterval.timeUnit, baseInterval.count, this._firstWeekDay, this._df.utc), baseInterval.timeUnit, baseInterval.count, this._df.utc).getTime();

				let maxZoomedStr = maxZoomed.toString();
				let endDataItem = series.dataItemsByAxis.getKey(this.uid).getKey(maxZoomedStr + series.currentDataSetId);
				let endIndex: number = series.dataItems.length;
				if (this.end != 1) {
					if (endDataItem) {
						endIndex = endDataItem.index;
					}
					else {
						maxZoomed -= 1;
						endIndex = series.dataItems.findClosestIndex(maxZoomed, (x) => <number>x[field], "right");

						if (endIndex < series.dataItems.length) {
							endIndex++;
						}
					}
				}

				series.startIndex = startIndex;
				series.endIndex = endIndex;

				if (!dataSetChanged && series.dataRangeInvalid) {
					series.validateDataRange();
				}
			}
		});
	}

	protected findFirst(dataItem: XYSeriesDataItem, time: number, key: string): XYSeriesDataItem {
		let index = dataItem.index;
		if (index > 0) {
			let series = dataItem.component;
			let previousDataItem = series.dataItems.getIndex(index - 1);
			let previousDate = (<any>previousDataItem)[key];
			if (!previousDate || previousDate.getTime() < time) {
				return dataItem;
			}
			else {
				return this.findFirst(previousDataItem, time, key);
			}
		}
		else {
			return dataItem;
		}
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
		let minDifference = Number.MAX_VALUE;

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
		this.series.each((series) => {
			if (JSON.stringify(series._baseInterval[this.uid]) != JSON.stringify(this.mainBaseInterval)) {
				series.mainDataSet.each((dataItem) => {
					this.postProcessSeriesDataItem(dataItem);
				});
				series._baseInterval[this.uid] = this.mainBaseInterval;
				if (this.groupData) {
					this.groupSeriesData(series);
				}
			}
		});

		this.addEmptyUnitsBreaks();
	}

	public groupSeriesData(series: XYSeries) {
		if (series.baseAxis == this && series.dataItems.length > 0 && !series.dataGrouped) {
			// make array of intervals which will be used;
			let intervals: ITimeInterval[] = [];
			let mainBaseInterval = this.mainBaseInterval;
			let mainIntervalDuration = $time.getDuration(mainBaseInterval.timeUnit, mainBaseInterval.count);

			this.groupIntervals.each((interval) => {
				let intervalDuration = $time.getDuration(interval.timeUnit, interval.count);
				if (intervalDuration > mainIntervalDuration && intervalDuration < (this.max - this.min)) {
					intervals.push(interval);
				}
			})

			if (series._dataSets) {
				series._dataSets.each((key, dataItems) => {
					dataItems.each((dataItem) => {
						dataItem.dispose();
					})
					dataItems.clear();
				})
				series._dataSets.clear();
			}

			$array.each(intervals, (interval) => {
				//let mainBaseInterval = this._mainBaseInterval;
				let key = "date" + this.axisLetter;

				// create data set
				let dataSetId = interval.timeUnit + interval.count;
				// todo: check where this clone goes
				let dataSet = new OrderedListTemplate(series.mainDataSet.template.clone());

				series.dataSets.setKey(dataSetId, dataSet);
				series.dataGrouped = true;

				let dataItems = series.mainDataSet;
				let previousTime: number = Number.NEGATIVE_INFINITY;
				let i = 0;
				let newDataItem: XYSeriesDataItem;

				let dataFields: string[] = [];

				$object.each(series.dataFields, (dfkey, df) => {
					let dfk = <string>dfkey;
					if (dfk != key && dfk.indexOf("Show") == -1) {
						dataFields.push(dfk);
					}
				})


				dataItems.each((dataItem) => {
					let date = dataItem.getDate(key);
					if (date) {
						let time = date.getTime();
						let roundedDate = $time.round(new Date(time), interval.timeUnit, interval.count, this._df.firstDayOfWeek, this._df.utc);
						let currentTime = roundedDate.getTime();
						// changed period								
						if (previousTime < currentTime) {
							newDataItem = dataSet.create();
							newDataItem.dataContext = {};
							newDataItem.component = series;
							// other Dates?
							newDataItem.setDate(key, roundedDate);
							newDataItem._index = i;							
							i++;

							$array.each(dataFields, (vkey) => {
								//let groupFieldName = vkey + "Group";
								let dvalues = dataItem.values[vkey];
								if (dvalues) {
									let value = dvalues.value;
									let values = newDataItem.values[vkey];
									if ($type.isNumber(value)) {

										values.value = value;
										values.workingValue = value;

										values.open = value;
										values.close = value;
										values.low = value;
										values.high = value;
										values.sum = value;
										values.average = value;
										values.count = 1;
									}
									else {
										values.count = 0;
									}
								}
							})

							this.postProcessSeriesDataItem(newDataItem, interval);

							$object.each(series.propertyFields, (key, fieldValue) => {
								const f: string = <string>key;
								let value: any = (<any>dataItem.properties)[key];

								if ($type.hasValue(value)) {
									newDataItem.hasProperties = true;
									newDataItem.setProperty(f, value);
								}
							});
							newDataItem.groupDataItems = [dataItem];
							previousTime = currentTime;
						}
						else {
							if (newDataItem) {
								$array.each(dataFields, (vkey) => {
									let groupFieldName = (<any>series.groupFields)[vkey];
									let dvalues = dataItem.values[vkey];
									if (dvalues) {
										let value = dvalues.value;

										if ($type.isNumber(value)) {
											let values = newDataItem.values[vkey];

											if (!$type.isNumber(values.open)) {
												values.open = value;
											}

											values.close = value;

											if (values.low > value || !$type.isNumber(values.low)) {
												values.low = value;
											}
											if (values.high < value || !$type.isNumber(values.high)) {
												values.high = value;
											}
											if ($type.isNumber(values.sum)) {
												values.sum += value;
											}
											else {
												values.sum = value;
											}
											values.count++;

											values.average = values.sum / values.count;

											if ($type.isNumber(values[groupFieldName])) {
												values.value = values[groupFieldName];
												values.workingValue = values.value;
											}
										}
									}
								})
								$utils.copyProperties(dataItem.properties, newDataItem.properties);

								$object.each(series.propertyFields, (key, fieldValue) => {
									const f: string = <string>key;
									let value: any = (<any>dataItem.properties)[key];
									if ($type.hasValue(value)) {
										newDataItem.hasProperties = true;
										newDataItem.setProperty(f, value);
									}
								});

								newDataItem.groupDataItems.push(dataItem);
							}
						}
					}

					if(newDataItem){
						$utils.copyProperties(dataItem.dataContext, newDataItem.dataContext);
					}
				})
			})

			this.calculateZoom();
		}
	}

	/**
	 * @ignore
	 */
	protected getDFFormatter() {
		this._df = this.dateFormatter;
	}

	/**
	 * [postProcessSeriesDataItem description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param dataItem Data item
	 */
	public postProcessSeriesDataItem(dataItem: XYSeriesDataItem, interval?: ITimeInterval): void {
		// we need to do this for all series data items not only added recently, as baseInterval might change
		let intervalID = "";
		if (interval) {
			intervalID = interval.timeUnit + interval.count;
		}
		else {
			interval = this.mainBaseInterval;
		}

		let series: XYSeries = dataItem.component;
		let dataItemsByAxis = series.dataItemsByAxis.getKey(this.uid);

		$object.each(dataItem.dates, (key) => {
			let date: Date = dataItem.getDate(key);
			let time = date.getTime();

			let startDate: Date = $time.round(new Date(time), interval.timeUnit, interval.count, this._firstWeekDay, this._df.utc);
			let startTime = startDate.getTime();
			let endDate: Date = $time.add(new Date(startTime), interval.timeUnit, interval.count, this._df.utc);

			dataItem.setCalculatedValue(key, startTime, "open");
			dataItem.setCalculatedValue(key, endDate.getTime(), "close");

			dataItemsByAxis.setKey(startTime + intervalID, dataItem);
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

			if (this._axisBreaks) {
				this._axisBreaks.clear(); // TODO: what about breaks added by user?
			}

			let date: Date = $time.round(new Date(this.min), timeUnit, count, this._firstWeekDay, this._df.utc);
			let axisBreak: DateAxisBreak;

			while (date.getTime() < this.max - this.baseDuration) {
				$time.add(date, timeUnit, count, this._df.utc);

				let startTime: number = date.getTime();
				let startTimeStr: string = startTime.toString();

				let hasData = $iter.contains(this.series.iterator(), (series) => {
					return !!series.dataItemsByAxis.getKey(this.uid).getKey(startTimeStr + series.currentDataSetId);
				});

				// open break if not yet opened
				if (!hasData) {
					if (!axisBreak) {
						axisBreak = <DateAxisBreak>this.axisBreaks.create();
						axisBreak.startDate = new Date(startTime);
						this._gapBreaks = true;
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
		if (axisBreaks) {
			if (axisBreaks.length > 0) {
				// process breaks
				axisBreaks.each((axisBreak) => {
					let breakGridCount: number = Math.ceil(this._gridCount * (Math.min(this.end, axisBreak.endPosition) - Math.max(this.start, axisBreak.startPosition)) / (this.end - this.start));
					axisBreak.gridInterval = this.chooseInterval(0, axisBreak.adjustedEndValue - axisBreak.adjustedStartValue, breakGridCount);
					let gridDate = $time.round(new Date(axisBreak.adjustedStartValue), axisBreak.gridInterval.timeUnit, axisBreak.gridInterval.count, this._firstWeekDay, this._df.utc);
					if (gridDate.getTime() > axisBreak.startDate.getTime()) {
						$time.add(gridDate, axisBreak.gridInterval.timeUnit, axisBreak.gridInterval.count, this._df.utc);
					}

					axisBreak.gridDate = gridDate;
				});
			}
		}
	}

	/**
	 * @ignore
	 */
	protected getFirstWeekDay(): number {
		if (this._df) {
			return this._df.firstDayOfWeek;
		}
		return 1;
	}

	/**
	 * [getGridDate description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param date           [description]
	 * @param intervalCount  [description]
	 * @return [description]
	 */
	public getGridDate(date: Date, intervalCount: number): Date {
		let timeUnit: TimeUnit = this._gridInterval.timeUnit;
		let realIntervalCount: number = this._gridInterval.count;
		// round date
		$time.round(date, timeUnit, 1, this._firstWeekDay, this._df.utc);

		let prevTimestamp: number = date.getTime();

		let newDate: Date = $time.copy(date);
		// modify date by adding intervalcount
		let timestamp: number = $time.add(newDate, timeUnit, intervalCount, this._df.utc).getTime();

		// if it's axis break, get first rounded date which is not in a break
		let axisBreak: DateAxisBreak = <DateAxisBreak>this.isInBreak(timestamp);
		if (axisBreak && axisBreak.endDate) {
			newDate = new Date(axisBreak.endDate.getTime());
			$time.round(newDate, timeUnit, realIntervalCount, this._firstWeekDay, this._df.utc);
			if (newDate.getTime() < axisBreak.endDate.getTime()) {
				$time.add(newDate, timeUnit, realIntervalCount, this._df.utc);
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
	 * @param axisBreak  [description]
	 * @param timeUnit   [description]
	 * @param count      [description]
	 * @return [description]
	 */
	public getBreaklessDate(axisBreak: DateAxisBreak, timeUnit: TimeUnit, count: number): Date {
		let date = new Date(axisBreak.endValue);
		$time.round(date, timeUnit, count, this._firstWeekDay, this._df.utc);
		$time.add(date, timeUnit, count, this._df.utc);

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
				let date = this.getGridDate($time.copy(prevGridDate), intervalCount);
				timestamp = date.getTime();

				let endDate = $time.copy(date); // you might think it's easier to add intervalduration to timestamp, however it won't work for months or years which are not of the same length
				endDate = $time.add(endDate, timeUnit, intervalCount, this._df.utc);

				let format = this.dateFormats.getKey(timeUnit);

				if (this.markUnitChange && prevGridDate) {
					if ($time.checkChange(date, prevGridDate, this._nextGridUnit, this._df.utc)) {
						if (timeUnit !== "year") {
							format = this.periodChangeDateFormats.getKey(timeUnit);
						}
					}
				}

				let text = this._df.format(date, format);

				let dataItem = dataItemsIterator.find((x) => x.text === text);
				if (dataItem.__disabled) {
					dataItem.__disabled = false;
				}
				this.appendDataItem(dataItem);

				dataItem.axisBreak = undefined;
				dataItem.date = date;
				dataItem.endDate = endDate;

				dataItem.text = text;

				this.validateDataElement(dataItem);

				prevGridDate = date;
			}

			// breaks later
			let renderer: AxisRenderer = this.renderer;

			if (this._axisBreaks) {
				$iter.each(this._axisBreaks.iterator(), (axisBreak) => {
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
								timestamp = $time.add(date, timeUnit, intervalCount * count, this._df.utc).getTime();
								count++;
								if (timestamp > axisBreak.adjustedStartValue && timestamp < axisBreak.adjustedEndValue) {
									let endDate = $time.copy(date); // you might think it's easier to add intervalduration to timestamp, however it won't work for months or years which are not of the same length
									endDate = $time.add(endDate, timeUnit, intervalCount, this._df.utc);

									let format = this.dateFormats.getKey(timeUnit);

									if (this.markUnitChange && prevGridDate) {
										if ($time.checkChange(date, prevGridDate, this._nextGridUnit, this._df.utc)) {
											if (timeUnit !== "year") {
												format = this.periodChangeDateFormats.getKey(timeUnit);
											}
										}
									}

									let text: string = this._df.format(date, format);

									let dataItem: this["_dataItem"] = dataItemsIterator.find((x) => x.text === text);
									if (dataItem.__disabled) {
										dataItem.__disabled = false;
									}
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
	}

	/**
	 * Validates Axis data item.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {

		dataItem.itemIndex = this._axisItemCount;
		this._axisItemCount++;

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

			if (!dataItem.isRange && this._gridInterval.count > this.baseInterval.count) {
				endPosition = position + (endPosition - position) / (this._gridInterval.count / this.baseInterval.count);
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

			if (dataItem.bullet) {
				renderer.updateBullet(dataItem.bullet, position, endPosition);
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
	 * @return Duration (ms)
	 */
	public get baseDuration(): number {
		return $time.getDuration(this.baseInterval.timeUnit, this.baseInterval.count);
	}

	/**
	 * Adjusts min/max values.
	 *
	 * @ignore Exclude from docs.
	 * @todo Description (review)
	 * @param min  Min timestamp
	 * @param max  Max timestamp
	 * @return Adjusted min/max step
	 */
	public adjustMinMax(min: number, max: number): IMinMaxStep {
		return { min: min, max: max, step: this.baseDuration };
	}

	/**
	 * Adjusts the minimum timestamp as per cell start location.
	 *
	 * @param value  Value
	 * @return Adjusted value
	 */
	protected fixMin(value: number) {
		// like this because months are not equal
		let interval = this.baseInterval;

		let startTime = $time.round(new Date(value), interval.timeUnit, interval.count, this._firstWeekDay, this._df.utc).getTime();
		let endTime = $time.add(new Date(startTime), interval.timeUnit, interval.count, this._df.utc).getTime();

		return startTime + (endTime - startTime) * this.startLocation;
	}

	/**
	 * Adjusts the maximum timestamp as per cell start location.
	 *
	 * @param value  Value
	 * @return Adjusted value
	 */
	protected fixMax(value: number) {
		// like this because months are not equal
		let interval = this.baseInterval;

		let startTime = $time.round(new Date(value), interval.timeUnit, interval.count, this._firstWeekDay, this._df.utc).getTime();
		let endTime = $time.add(new Date(startTime), interval.timeUnit, interval.count, this._df.utc).getTime();

		return startTime + (endTime - startTime) * this.endLocation;
	}

	/**
	 * [chooseInterval description]
	 *
	 * @ignore Exclude from docs.
	 * @todo Description
	 * @param index      [description]
	 * @param duration   [description]
	 * @param gridCount  [description]
	 * @return [description]
	 */
	public chooseInterval(index: number, duration: number, gridCount: number, intervals?: List<ITimeInterval>): ITimeInterval {
		if (!intervals) {
			intervals = this.gridIntervals;
		}

		let gridInterval: ITimeInterval = intervals.getIndex(index);

		let intervalDuration: number = $time.getDuration(gridInterval.timeUnit, gridInterval.count);

		let lastIndex: number = intervals.length - 1;
		if (index >= lastIndex) {
			return { ...intervals.getIndex(lastIndex) };
		}

		let count: number = Math.ceil(duration / intervalDuration);

		if (duration < intervalDuration && index > 0) {
			return { ...intervals.getIndex(index - 1) };
		}
		if (count <= gridCount) {
			return { ...intervals.getIndex(index) };
		} else {
			if (index + 1 < intervals.length) {
				return this.chooseInterval(index + 1, duration, gridCount, intervals);
			} else {
				return { ...intervals.getIndex(index) };
			}
		}
	}

	/**
	 * Formats the value according to axis' own [[DateFormatter]].
	 *
	 * @param value  Source value
	 * @return Formatted value
	 */
	public formatLabel(value: number): string {
		return this._df.format(value);
	}

	/**
	 * Converts a Date to an asbolute pixel position within Axis.
	 *
	 * @param date  Date
	 * @return Position (px)
	 */
	public dateToPosition(date: Date): number {
		return this.valueToPosition(date.getTime());
	}

	/**
	 * Converts a numeric timestamp or a `Date` to a relative position on axis.
	 *
	 * @param date  Date or a timestamp
	 * @return Relative position
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
	 * @param date Date
	 * @return IOrientationPoint
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
	 * @param value  Value
	 * @return Orientation point
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
	 * @param position  Position (px)
	 * @return Date
	 */
	public positionToDate(position: number): Date {
		return new Date(this.positionToValue(position));
	}

	/**
	 * Returns the relative position on axis for series' data item's value.
	 *
	 * @since 4.5.14
	 * @param  dataItem  Data item
	 * @param  key       Data field to get value from
	 * @param  location  Location (0-1)
	 * @return           Relative position
	 */
	public getPositionX(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		let value: number = this.getTimeByLocation(dataItem, key, location);
		//let stack: number = dataItem.getValue("valueX", "stack");

		if (!$type.isNumber(value)) {
			value = this.baseValue;
		}

		let position = this.valueToPosition(value);
		if (range) {
			position = $math.fitToRange(position, range.start, range.end);
		}

		return position;
	}


	/**
	 * Returns relative position on axis for series' data item's value.
	 *
	 * @since 4.5.14
	 * @param  dataItem  Data item
	 * @param  key       Data field to get value from
	 * @param  location  Location (0-1)
	 * @return           Relative position
	 */
	public getPositionY(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		let value: number = this.getTimeByLocation(dataItem, key, location);
		let stack: number = dataItem.getValue("valueX", "stack");

		if (!$type.isNumber(value)) {
			value = this.baseValue;
		}

		let position = this.valueToPosition(value + stack);
		if (range) {
			position = $math.fitToRange(position, range.start, range.end);
		}

		return position;
	}

	/**
	 * Returns an angle for series data item.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem  Data item
	 * @param key       Data field to get value from
	 * @param location  Location (0-1)
	 * @param stackKey  Stack ID
	 * @param range Range to fit in
	 * @return Angle
	 */
	public getAngle(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		let value: number = this.getTimeByLocation(dataItem, key, location);
		let stack: number = dataItem.getValue(stackKey, "stack");

		if (!$type.isNumber(value)) {
			value = this.baseValue;
		}

		let position = this.valueToPosition(value + stack);
		if (range) {
			position = $math.fitToRange(position, range.start, range.end);
		}

		return this.positionToAngle(position);
	}

	/**
	 * [getTimeByLocation description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param dataItem  [description]
	 * @param key       [description]
	 * @param location  [description]
	 * @return [description]
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

		let workingValue = dataItem.values[key].workingValue;
		let value = dataItem.values[key].value;

		let difference = value - workingValue;
		startTime -= difference;
		endTime -= difference;

		if ($type.isNumber(startTime) && $type.isNumber(endTime)) {
			return startTime + (endTime - startTime) * location;
		}
	}

	/**
	 * Processes a related series' data item.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param dataItem  Data item
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

		if (series._baseInterval[this.uid]) {
			this.postProcessSeriesDataItem(dataItem);
		}
		else {
			if (this._baseInterval) {
				series._baseInterval[this.uid] = this._baseInterval;
				this.postProcessSeriesDataItem(dataItem);
			}
		}
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
		if (baseInterval.timeUnit == "month") {
			if (this.minDifference >= $time.getDuration("day", 29 * 2) && baseInterval.count == 1) {
				baseInterval.count = 2;
			}

			if (this.minDifference >= $time.getDuration("day", 29 * 3) && baseInterval.count == 2) {
				baseInterval.count = 3;
			}

			if (this.minDifference >= $time.getDuration("day", 29 * 6) && baseInterval.count == 5) {
				baseInterval.count = 6;
			}
		}

		// handle daylight saving
		if (this.minDifference >= $time.getDuration("hour", 23) && baseInterval.timeUnit == "hour") {
			baseInterval.timeUnit = "day";
			baseInterval.count = 1;
		}

		if (this.minDifference >= $time.getDuration("week", 1) - $time.getDuration("hour", 1) && baseInterval.timeUnit == "day") {
			baseInterval.timeUnit = "week";
			baseInterval.count = 1;
		}

		if (this.minDifference >= $time.getDuration("year", 1) - $time.getDuration("day", 1.01) && baseInterval.timeUnit == "month") {
			baseInterval.timeUnit = "year";
			baseInterval.count = 1;
		}

		this._baseIntervalReal = baseInterval;
		this._mainBaseInterval = baseInterval;

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
	 * For best results, try to follow these values for `count`:
	 *
	 * When unit is "month", use 12 / count = round number
	 * When unit is "hour", use 24 / count = round number
	 * When unit is "second" and "minute", use 60 / count = round number
	 *
	 * @param timeInterval base interval
	 */
	public set baseInterval(timeInterval: ITimeInterval) {
		if (JSON.stringify(this._baseInterval) != JSON.stringify(timeInterval)) {
			this._baseInterval = timeInterval;
			this._mainBaseInterval = timeInterval;
			if (!$type.isNumber(timeInterval.count)) {
				timeInterval.count = 1;
			}
			this.invalidate();
			this.postProcessSeriesDataItems();
		}
	}

	/**
	 * @return Base interval
	 */
	public get baseInterval(): ITimeInterval {
		if (this._groupInterval) {
			return this._groupInterval;
		}
		else if (this._baseInterval) {
			return this._baseInterval;
		}
		else {
			return this._baseIntervalReal;
		}
	}

	/**
	 * Indicates granularity of the data of source (unaggregated) data.
	 *
	 * @since 4.7.0
	 * @return Granularity of the main data set
	 */
	public get mainBaseInterval(): ITimeInterval {
		if (this._baseInterval) {
			return this._baseInterval;
		}
		else if (this._mainBaseInterval) {
			return this._mainBaseInterval;
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
	 * @param value  Remove empty stretches of time?
	 */
	public set skipEmptyPeriods(value: boolean) {

		if (value) {
			let breakTemplate = this.axisBreaks.template;
			breakTemplate.startLine.disabled = true;
			breakTemplate.endLine.disabled = true;
			breakTemplate.fillShape.disabled = true;
			breakTemplate.breakSize = 0;
		}
		else {
			if (this._gapBreaks) {
				this.axisBreaks.clear();
				this._gapBreaks = false;
			}
		}

		if (this.setPropertyValue("skipEmptyPeriods", value)) {
			this.invalidate();
			this.postProcessSeriesDataItems();
			this.invalidateSeries();
		}
	}

	/**
	 * @return Remove empty stretches of time?
	 */
	public get skipEmptyPeriods(): boolean {
		return this.getPropertyValue("skipEmptyPeriods");
	}

	/**
	 * A special date format to apply axis tooltips.
	 *
	 * Will use same format as for labels, if not set.
	 *
	 * @param value  Date format
	 */
	public set tooltipDateFormat(value: string | Intl.DateTimeFormatOptions) {
		this.setPropertyValue("tooltipDateFormat", value);
	}

	/**
	 * @return Date format
	 */
	public get tooltipDateFormat(): string | Intl.DateTimeFormatOptions {
		return this.getPropertyValue("tooltipDateFormat");
	}

	/**
	 * Use `periodChangeDateFormats` to apply different formats to the first
	 * label in bigger time unit.
	 *
	 * @default true
	 * @param value  Use different format for period beginning?
	 */
	public set markUnitChange(value: boolean) {
		if (this.setPropertyValue("markUnitChange", value)) {
			this.invalidateData();
		}
	}

	/**
	 * @return Use different format for period beginning?
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
	 * @param position  Position
	 * @return Label (formatted date)
	 */
	public getTooltipText(position: number): string {
		let text: string;
		let date = this.positionToDate(position);
		date = $time.round(date, this.baseInterval.timeUnit, this.baseInterval.count, this._firstWeekDay, this._df.utc, new Date(this.min));

		if ($type.hasValue(this.tooltipDateFormat)) {
			text = this._df.format(date, this.tooltipDateFormat);
		}
		else {
			let dateFormat = this.dateFormats.getKey(this.baseInterval.timeUnit);
			if (dateFormat) {
				text = this._df.format(date, dateFormat);
			}
			else {
				text = this.getPositionLabel(position);
			}
		}
		if (!this._adapterO) {
			return text;
		}
		else {
			return this._adapterO.apply("getTooltipText", text);
		}
	}

	/**
	 * Takes an absolute position within axis and adjust it to a specific position within base interval. (cell)
	 *
	 * @ignore Exclude from docs
	 * @param position Source position
	 * @param location  Location in the cell
	 * @return Adjusted position
	 */
	public roundPosition(position: number, location?: AxisItemLocation, axisLocation?: number): number {
		let baseInterval = this.baseInterval;
		let timeUnit = baseInterval.timeUnit;
		let count = baseInterval.count;

		let date: Date = this.positionToDate(position);

		$time.round(date, timeUnit, count, this._firstWeekDay, this._df.utc);

		if (location > 0) {
			$time.add(date, timeUnit, location * count, this._df.utc);
		}

		if (axisLocation > 0 && axisLocation < 1) {
			date.setTime(date.getTime() + this.baseDuration * axisLocation);
		}

		if (this.isInBreak(date.getTime())) {
			while (date.getTime() < this.max) {
				$time.add(date, timeUnit, count, this._df.utc);
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
	 * @param position  Relative position
	 * @return Cell start relative position
	 */
	public getCellStartPosition(position: number): number {
		return this.roundPosition(position, 0);
	}

	/**
	 * Returns an relative position of the end of the cell (period), that specific position value falls into.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param position  Relative position
	 * @return Cell end relative position
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
	 * @param series       Series
	 * @param position     Position (px)
	 * @param findNearest  Should axis try to find nearest tooltip if there is no data item at exact position
	 * @return Data item
	 */
	public getSeriesDataItem(series: XYSeries, position: number, findNearest?: boolean): XYSeriesDataItem {

		let value: number = this.positionToValue(position);
		let date: Date = $time.round(new Date(value), this.baseInterval.timeUnit, this.baseInterval.count, this._firstWeekDay, this._df.utc);


		let dataItemsByAxis = series.dataItemsByAxis.getKey(this.uid);

		let dataItem = dataItemsByAxis.getKey(date.getTime().toString());

		// todo:  alternatively we can find closiest here
		if (!dataItem && findNearest) {

			let key: "dateX" | "dateY";

			if (this.axisLetter == "Y") {
				key = "dateY";
			}
			else {
				key = "dateX";
			}

			dataItem = series.dataItems.getIndex(series.dataItems.findClosestIndex(date.getTime(), (x) => {
				if (x[key]) {
					return <number>x[key].getTime();
				}
				else {
					return -Infinity;
				}
			}, "any"));
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
	 * @param position  Relative position on axis (0-1)
	 * @return Position label
	 */
	public getPositionLabel(position: number): string {
		// @todo Better format recognition
		let date = this.positionToDate(position);
		return this._df.format(date, this.getCurrentLabelFormat());
	}

	/**
	 * Returns label date format based on currently used time units
	 *
	 * @return Format
	 */
	protected getCurrentLabelFormat(): string | Intl.DateTimeFormatOptions {
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
	 * @return Base point
	 */
	public get basePoint(): IPoint {
		return { x: 0, y: 0 };
	}

	/**
	 * @ignore
	 */
	protected animateMinMax(min: number, max: number): Animation {
		let animation = this.animate([{ property: "_minAdjusted", from: this._minAdjusted, to: min }, { property: "_maxAdjusted", from: this._maxAdjusted, to: max }], this.rangeChangeDuration, this.rangeChangeEasing);
		animation.events.on("animationprogress", () => {
			this.dispatch("extremeschanged");
		})
		return animation;
	}

	/**
	 * Invalidates axis data items when series extremes change
	 */
	protected handleExtremesChange() {
		super.handleExtremesChange();

		if (this.groupData) {
			let id = this.baseInterval.timeUnit + this.baseInterval.count;
			this.groupMin[id] = this.min;
			this.groupMax[id] = this.max;
		}
	}


	/**
	 * Zooms axis to specific Dates.
	 *
	 * @param startDate       Start date
	 * @param endValue        End date
	 * @param skipRangeEvent  Do not invoke events
	 * @param instantly       Do not play zoom animations
	 */
	public zoomToDates(startDate: Date, endDate: Date, skipRangeEvent?: boolean, instantly?: boolean, adjust?: boolean): void {
		startDate = this._df.parse(startDate);
		endDate = this._df.parse(endDate);
		this.zoomToValues(startDate.getTime(), endDate.getTime(), skipRangeEvent, instantly, adjust);
	}

	/**
	 * Zooms axis to specific values.
	 *
	 * @param startValue      Start value
	 * @param endValue        End value
	 * @param skipRangeEvent  Do not invoke events
	 * @param instantly       Do not play zoom animations
	 */
	public zoomToValues(startValue: number, endValue: number, skipRangeEvent?: boolean, instantly?: boolean, adjust?: boolean): void {
		if (!this.groupData) {
			let start: number = (startValue - this.min) / (this.max - this.min);
			let end: number = (endValue - this.min) / (this.max - this.min);

			this.zoom({ start: start, end: end }, skipRangeEvent, instantly);
		}
		else {
			let difference = this.adjustDifference(startValue, endValue);
			let isEnd = false;
			if (endValue == this.max) {
				isEnd = true;
			}
			let isStart = false;
			if (startValue == this.min) {
				isStart = true;
			}

			if ($type.hasValue(difference)) {
				let mainBaseInterval = this.mainBaseInterval;
				let groupInterval = this.chooseInterval(0, difference, this.groupCount, this.groupIntervals);

				if ((groupInterval.timeUnit == mainBaseInterval.timeUnit && groupInterval.count < mainBaseInterval.count) || $time.getDuration(groupInterval.timeUnit, 1) < $time.getDuration(mainBaseInterval.timeUnit, 1)) {
					groupInterval = { ...mainBaseInterval };
				}

				let id = groupInterval.timeUnit + groupInterval.count;
				let min = this.groupMin[id];
				let max = this.groupMax[id];

				if (!$type.isNumber(min) || !$type.isNumber(max)) {
					min = Number.POSITIVE_INFINITY;
					max = Number.NEGATIVE_INFINITY;
					this.series.each((series) => {
						let seriesMin = series.min(this);
						let seriesMax = series.max(this);
						if (seriesMin < min) {
							min = seriesMin;
						}
						if (seriesMax < max) {
							max = seriesMax;
						}
					})
					this.groupMin[id] = min;
					this.groupMax[id] = max;
				}

				startValue = $math.fitToRange(startValue, min, max);
				endValue = $math.fitToRange(endValue, min, max);

				if (adjust) {
					if (isEnd) {
						startValue = endValue - difference;
						startValue = $math.fitToRange(startValue, min, max);
					}

					if (isStart) {
						endValue = startValue + difference;
						endValue = $math.fitToRange(endValue, min, max);
					}
				}

				let start: number = (startValue - min) / (max - min);
				let end: number = (endValue - min) / (max - min);

				this.zoom({ start: start, end: end }, skipRangeEvent, instantly);
			}
		}
	}

	/**
	 * Adds `baseInterval` to "as is" fields.
	 *
	 * @param field  Field name
	 * @return Assign as is?
	 */
	protected asIs(field: string): boolean {
		return field == "baseInterval" || super.asIs(field);
	}

	/**
	 * Copies all properties and related data from a different instance of Axis.
	 *
	 * @param source Source Axis
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.dateFormats = source.dateFormats;
		this.periodChangeDateFormats = source.periodChangeDateFormats;
		this.groupIntervals.clear();
		source.groupIntervals.each((interval) => {
			this.groupIntervals.push({ ...interval });
		})

		this.gridIntervals.clear();
		source.gridIntervals.each((interval) => {
			this.gridIntervals.push({ ...interval });
		})

		if (source._baseInterval) {
			this.baseInterval = source._baseInterval;
		}
	}


	/**
	 * Shows Axis tooltip at specific relative position within Axis. (0-1)
	 *
	 * @param position Position (0-1)
	 * @param local or global position
	 */
	public showTooltipAtPosition(position: number, local?: boolean) {

		if (!local) {
			position = this.toAxisPosition(position);
		}

		if (this.snapTooltip) {
			// rounding is not good, pen/aac4e7f66f019d36b2447f050c600c13 (no last tootltip shown)
			let actualDate = this.positionToDate(position) //$time.round(this.positionToDate(position), this.baseInterval.timeUnit, 1, this.getFirstWeekDay(), this.dateFormatter.utc);

			let actualTime = actualDate.getTime();
			let closestDate: Date;

			this.series.each((series) => {
				if (series.baseAxis == this) {
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
				}
			})

			if (closestDate) {
				let closestTime = closestDate.getTime();
				closestDate = $time.round(new Date(closestTime), this.baseInterval.timeUnit, this.baseInterval.count, this._firstWeekDay, this._df.utc);
				closestTime = closestDate.getTime();

				let tooltipLocation = this.renderer.tooltipLocation;
				if (tooltipLocation == 0) {
					tooltipLocation = 0.0001;
				}

				closestDate = new Date(closestDate.getTime() + this.baseDuration * tooltipLocation);
				position = this.dateToPosition(closestDate);

				this.series.each((series) => {

					let dataItem = series.dataItemsByAxis.getKey(this.uid).getKey(closestTime + series.currentDataSetId);
					let point = series.showTooltipAtDataItem(dataItem);
					if (point) {
						this.chart._seriesPoints.push({ series: series, point: point });
					}
					else {
						// check, otherwise column tooltip will be hidden
						if (series.tooltipText || series.tooltipHTML) {
							series.hideTooltip();
						}
					}
				})

				//this.chart.sortSeriesTooltips(seriesPoints);
			}
		}

		super.showTooltipAtPosition(position, true);
	}

	/**
	 * Should the nearest tooltip be shown if no data item is found on the
	 * current cursor position.
	 *
	 * @default true
	 * @param value  Should snap?
	 */
	public set snapTooltip(value: boolean) {
		this.setPropertyValue("snapTooltip", value);
	}

	/**
	 * @return Should snap?
	 */
	public get snapTooltip(): boolean {
		return this.getPropertyValue("snapTooltip");
	}

	/**
	 * Indicates if data should be aggregated to composide data items if there
	 * are more data items in selected range than `groupCount`.
	 *
	 * Grouping will occur automatically, based on current selection range, and
	 * will change dynamically when user zooms in/out the chart.
	 *
	 * NOTE: This works only if [[DateAxis]] is base axis of an [[XYSeries]].
	 *
	 * The related [[XYSeries]] also needs to be set up to take advantage of, by
	 * setting its [`groupFields`](https://www.amcharts.com/docs/v4/reference/xyseries/#groupFields_property).
	 *
	 * The group intervals to aggregate data to is defined by `groupIntervals`
	 * property.
	 *
	 * ```TypeScript
	 * let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
	 * dateAxis.groupData = true;
	 * 
	 * let valueAxis = chart.xAxes.push(new am4charts.valueAxis());
	 * 
	 * let series = chart.series.push(new am4charts.LineSeries());
	 * series.dataFields.dateX = "date";
	 * series.dataFields.valueY = "value";
	 * series.groupFields.valueY = "average";
	 * ```
	 * ```JavaScript
	 * var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
	 * dateAxis.groupData = true;
	 * 
	 * var valueAxis = chart.xAxes.push(new am4charts.valueAxis());
	 * 
	 * var series = chart.series.push(new am4charts.LineSeries());
	 * series.dataFields.dateX = "date";
	 * series.dataFields.valueY = "value";
	 * series.groupFields.valueY = "average";
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "xAxes": [{
	 *     "type": "DateAxis",
	 *     "groupData": true
	 *   }],
	 *   "yAxes": [{
	 *     "type": "ValueAxis"
	 *   }],
	 *   "series": [{
	 *     "type": "LineSeries",
	 *     "dataFields": {
	 *       "dateX": "date",
	 *       "valueY": "value"
	 *     },
	 *     "groupFields": {
	 *       "valueY": "average"
	 *     }
	 *   }]
	 * }
	 * ```
	 *
	 * @default false
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Dynamic_data_item_grouping} for more information about dynamic data item grouping.
	 * @since 4.7.0
	 * @param  value  Group data points?
	 */
	public set groupData(value: boolean) {
		if (this.setPropertyValue("groupData", value)) {
			this.series.each((series) => {
				series.setDataSet("");
			})

			this._currentDataSetId = ""
			this._groupInterval = undefined;
			this.invalidate();
			this.invalidateSeries();
		}
	}

	/**
	 * @return Group data points?
	 */
	public get groupData(): boolean {
		return this.getPropertyValue("groupData");
	}

	/**
	 * Indicates threshold of data items in selected range at which to start
	 * aggregating data items if `groupData = true`.
	 * 
	 * @default 200
	 * @since 4.7.0
	 * @param  value  Number of data items
	 */
	public set groupCount(value: number) {
		this.setPropertyValue("groupCount", value);
	}

	/**
	 * @return Number of data items
	 */
	public get groupCount(): number {
		return this.getPropertyValue("groupCount");
	}

	/**
	 * Current grid interval.
	 *
	 * @return Grid interval
	 */
	public get gridInterval(): ITimeInterval {
		return this._gridInterval;
	}


	/**
	 * @ignore
	 */
	public makeGap(dataItem: LineSeriesDataItem, previous: LineSeriesDataItem): boolean {
		let series = dataItem.component;
		if (dataItem && previous) {
			if (!series.connect && $type.isNumber(series.autoGapCount)) {
				if (series.baseAxis == this) {
					let date = dataItem.dates["date" + this.axisLetter];
					let prevDate = previous.dates["date" + this.axisLetter];

					if (date && prevDate) {
						let time = date.getTime();
						let prevTime = prevDate.getTime();

						if (time - prevTime > series.autoGapCount * this.baseDuration) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	/**
	 * @return base value
	 */
	public get baseValue(): number {
		return this.min;
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
