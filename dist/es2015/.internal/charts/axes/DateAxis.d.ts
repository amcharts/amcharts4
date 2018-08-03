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
import { List } from "../../core/utils/List";
import { Dictionary } from "../../core/utils/Dictionary";
import { IPoint, IOrientationPoint } from "../../core/defs/IPoint";
import { XYSeries, XYSeriesDataItem } from "../series/XYSeries";
import { TimeUnit } from "../../core/defs/TimeUnit";
import { ITimeInterval } from "../../core/defs/ITimeInterval";
import { IMinMaxStep } from "./ValueAxis";
import { DateAxisBreak } from "./DateAxisBreak";
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
export declare class DateAxisDataItem extends ValueAxisDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {DateAxis}
     */
    _component: DateAxis;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {Date} Date
     */
    /**
     * Date position of the data item.
     *
     * @param {Date}  date  Date
     */
    date: Date;
    /**
     * @return {Date} End date
     */
    /**
     * End date for data item.
     *
     * @param {Date} date End date
     */
    endDate: Date;
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
    skipEmptyPeriods?: boolean;
}
/**
 * Defines events for [[DateAxis]].
 */
export interface IDateAxisEvents extends IValueAxisEvents {
}
/**
 * Defines adapters for [[DateAxis]].
 *
 * @see {@link Adapter}
 */
export interface IDateAxisAdapters extends IValueAxisAdapters, IDateAxisProperties {
}
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
export declare class DateAxis<T extends AxisRenderer = AxisRenderer> extends ValueAxis<T> {
    /**
     * Defines data fields.
     *
     * @ignore Exclude from docs
     * @type {IDateAxisDataFields}
     */
    _dataFields: IDateAxisDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IDateAxisProperties}
     */
    _properties: IDateAxisProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IDateAxisAdapters}
     */
    _adapter: IDateAxisAdapters;
    /**
     * Defines available events.
     *
     * @type {IDateAxisEvents}
     * @ignore Exclude from docs
     */
    _events: IDateAxisEvents;
    /**
     * Defines the type of the Date Items.
     *
     * @ignore Exclude from docs
     * @type {DateAxisDataItem}
     */
    _dataItem: DateAxisDataItem;
    /**
     * Defines the type of the axis breaks.
     *
     * @ignore Exclude from docs
     * @type {DateAxisBreak}
     */
    _axisBreak: DateAxisBreak;
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
    gridIntervals: List<ITimeInterval>;
    /**
     * A collection of date formats to use when formatting different time units
     * on Date/time axis.
     *
     * Actual defaults will depend on the language locale set for the chart.
     *
     * To override format for a specific time unit, say days, you need to set
     * the approperiate key to a format string. E.g.:
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
    dateFormats: Dictionary<TimeUnit, string>;
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
    periodChangeDateFormats: Dictionary<TimeUnit, string>;
    /**
     * A special date format to apply axis tooltips.
     *
     * Will use same format as for labels, if not set.
     *
     * @type {string}
     */
    protected _tooltipDateFormat: string;
    /**
     * Use `periodChangeDateFormats` to apply different formats to the first
     * label in bigger time unit.
     *
     * @type {boolean}
     */
    protected _markUnitChange: boolean;
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
    protected _baseIntervalReal: ITimeInterval;
    /**
     * Axis start location.
     *
     * * 0 - Full first cell is shown.
     * * 0.5 - Half of first cell is shown.
     * * 1 - None of the first cell is visible. (you probably don't want that)
     *
     * @param {number} value Location (0-1)
     */
    protected _startLocation: AxisItemLocation;
    /**
     * Axis end location.
     *
     * * 0 - None of the last cell is shown. (don't do that)
     * * 0.5 - Half of the last cell is shown.
     * * 1 - Full last cell is shown.
     *
     * @param {number} value Location (0-1)
     */
    protected _endLocation: AxisItemLocation;
    /**
     * A collection of timestamps of previously processed data items. Used
     * internally to track distance between data items when processing data.
     *
     * @type {Dictionary<string, number>}
     */
    protected _prevSeriesTime: Dictionary<string, number>;
    /**
     * [_minSeriesDifference description]
     *
     * @todo Description
     * @type {number}
     */
    protected _minSeriesDifference: number;
    /**
     * A function which applies fills to axis cells.
     *
     * Default function fills every second fill. You can set this to a function
     * that follows some other logic.
     *
     * Function should accept a [[DateAxisDataItem]] and modify its `axisFill`
     * property accordingly.
     *
     * @type {function}
     */
    fillRule: (dataItem: DateAxisDataItem) => any;
    /**
     * Constructor
     */
    constructor();
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
    /**
     * Returns a new/empty [[DataItem]] of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {DateAxisDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Returns a new/empty [[AxisBreak]] of the appropriate type.
     *
     * @return {DateAxisBreak} Axis break
     */
    protected createAxisBreak(): this["_axisBreak"];
    /**
     * Validates Axis' data items.
     *
     * @ignore Exclude from docs
     */
    validateDataItems(): void;
    /**
     * Handles process after zoom.
     *
     * @ignore Exclude from docs
     * @todo Does nothing?
     */
    handleSelectionExtremesChange(): void;
    /**
     * Calculates all positions, related to axis as per current zoom.
     *
     * @ignore Exclude from docs
     */
    calculateZoom(): void;
    /**
     * (Re)validates data.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    /**
     * [dataChangeUpdate description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    dataChangeUpdate(): void;
    /**
     * [postProcessSeriesDataItems description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    postProcessSeriesDataItems(): void;
    /**
     * [postProcessSeriesDataItem description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {XYSeriesDataItem} dataItem Data item
     */
    postProcessSeriesDataItem(dataItem: XYSeriesDataItem): void;
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
    addEmptyUnitsBreaks(): void;
    /**
     * Updates positioning of Axis breaks after something changes.
     *
     * @ignore Exclude from docs
     */
    fixAxisBreaks(): void;
    /**
     * [getGridDate description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {Date}    date           [description]
     * @param  {number}  intervalCount  [description]
     * @return {Date}                   [description]
     */
    getGridDate(date: Date, intervalCount: number): Date;
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
    getBreaklessDate(axisBreak: DateAxisBreak, timeUnit: TimeUnit, count: number): Date;
    /**
     * (Re)validates all Axis elements.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    validateAxisElements(): void;
    /**
     * Validates Axis data item.
     *
     * @ignore Exclude from docs
     * @param {DateAxisDataItem} dataItem Data item
     */
    validateDataElement(dataItem: this["_dataItem"]): void;
    /**
     * A duration in milliseconds of the `baseInterval`.
     *
     * @return {number} Duration (ms)
     */
    readonly baseDuration: number;
    /**
     * Adjusts min/max values.
     *
     * @ignore Exclude from docs.
     * @todo Description (review)
     * @param  {number}       min  Min timestamp
     * @param  {number}       max  Max timestamp
     * @return {IMinMaxStep}       Adjusted min/max step
     */
    adjustMinMax(min: number, max: number): IMinMaxStep;
    /**
     * Adjusts the minimum timestamp as per cell start location.
     *
     * @param  {number}  value  Value
     * @return {number}         Adjusted value
     */
    protected fixMin(value: number): number;
    /**
     * Adjusts the maximum timestamp as per cell start location.
     *
     * @param  {number}  value  Value
     * @return {number}         Adjusted value
     */
    protected fixMax(value: number): number;
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
    chooseInterval(index: number, duration: number, gridCount: number): ITimeInterval;
    /**
     * Formats the value according to axis' own [[DateFormatter]].
     *
     * @param  {number}  value  Source value
     * @return {string}         Formatted value
     */
    formatLabel(value: number): string;
    /**
     * Converts a Date to an asbolute pixel position within Axis.
     *
     * @param  {Date}    date  Date
     * @return {number}        Position (px)
     */
    dateToPosition(date: Date): number;
    /**
     * Converts a numeric timestamp or a `Date` to a relative position on axis.
     *
     * @param  {Date | number}  date  Date or a timestamp
     * @return {number}               Relative position
     */
    anyToPosition(date: Date | number): number;
    /**
     * Converts date to orientation point (x, y, angle) on axis
     *
     * @param  {Date}  date Date
     * @return {IOrientationPoint} IOrientationPoint
     */
    dateToPoint(date: Date): IOrientationPoint;
    /**
     * Converts a numeric value to orientation (x, y, angle) point on axis
     *
     * @param  {number}  value  Value
     * @return {IOrientationPoint}  Orientation point
     */
    anyToPoint(date: Date | number): IOrientationPoint;
    /**
     * Converts pixel position within Axis to a corresponding Date.
     *
     * @param  {number}  position  Position (px)
     * @return {Date}              Date
     */
    positionToDate(position: number): Date;
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
    getX(dataItem: XYSeriesDataItem, key: string, location?: number): number;
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
    getY(dataItem: XYSeriesDataItem, key: string, location?: number): number;
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
    getAngle(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number;
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
    protected getTimeByLocation(dataItem: XYSeriesDataItem, key: string, location: number): number;
    /**
     * Processes a related series' data item.
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {XYSeriesDataItem}  dataItem  Data item
     */
    processSeriesDataItem(dataItem: XYSeriesDataItem): void;
    /**
     * [updateAxisBySeries description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    updateAxisBySeries(): void;
    /**
     * @return {ITimeInterval} Base interval
     */
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
    baseInterval: ITimeInterval;
    /**
     * @return {number} Location (0-1)
     */
    /**
     * Axis start location.
     *
     * * 0 - Full first cell is shown.
     * * 0.5 - Half of first cell is shown.
     * * 1 - None of the first cell is visible. (you probably don't want that)
     *
     * @param {number} value Location (0-1)
     */
    startLocation: number;
    /**
     * @return {number} Location (0-1)
     */
    /**
     * Axis end location.
     *
     * * 0 - None of the last cell is shown. (don't do that)
     * * 0.5 - Half of the last cell is shown.
     * * 1 - Full last cell is shown.
     *
     * @param {number} value Location (0-1)
     */
    endLocation: number;
    /**
     * @return {boolean} Remove empty stretches of time?
     */
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
     * @param {boolean}  value  Remove empty stretches of time?
     */
    skipEmptyPeriods: boolean;
    /**
     * @return {string} Date format
     */
    /**
     * A special date format to apply axis tooltips.
     *
     * Will use same format as for labels, if not set.
     *
     * @param {string}  value  Date format
     */
    tooltipDateFormat: string;
    /**
     * @return {boolean} Use different format for period beginning?
     */
    /**
     * Use `changeDateFormats` to apply different formats to the first label in
     * bigger time unit.
     *
     * @default true
     * @param {boolean}  value  Use different format for period beginning?
     */
    markUnitChange: boolean;
    /**
     * Returns text to show in a tooltip, based on specific relative position within axis.
     *
     * The label will be formatted as per [[DateFormatter]] set for the whole
     * chart, or explicitly for this Axis.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position
     * @return {string}            Label (formatted date)
     */
    getTooltipText(position: number): string;
    /**
     * Takes an absolute position within axis and adjust it to a specific position within base interval. (cell)
     *
     * @ignore Exclude from docs
     * @param  {number}            position Source position
     * @param  {AxisItemLocation}  location  Location in the cell
     * @return {number}            Adjusted position
     */
    roundPosition(position: number, location?: AxisItemLocation): number;
    /**
     * Returns an relative position of the start of the cell (period), that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  position  Relative position
     * @return {number}            Cell start relative position
     */
    getCellStartPosition(position: number): number;
    /**
     * Returns an relative position of the end of the cell (period), that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  position  Relative position
     * @return {number}            Cell end relative position
     */
    getCellEndPosition(position: number): number;
    /**
     * Returns a Series data item that corresponds to the specific pixel position
     * of the Axis.
     *
     * @param  {XYSeries}          series    Series
     * @param  {number}            position  Position (px)
     * @return {XYSeriesDataItem}            Data item
     */
    getSeriesDataItem(series: XYSeries, position: number): XYSeriesDataItem;
    /**
     * Returns a formatted date based on position in axis scale.
     *
     * @param  {number}  position  Relative position on axis (0-1)
     * @return {string}            Position label
     * @todo Better format recognition
     */
    getPositionLabel(position: number): string;
    /**
     * Returns label date format based on currently used time units
     *
     * @return {string}  Format
     */
    protected getCurrentLabelFormat(): string;
    /**
     * Initializes an Axis renderer.
     *
     * @ignore Exclude from docs
     */
    initRenderer(): void;
    /**
     * Coordinates of the actual axis start.
     *
     * @ignore Exclude from docs
     * @return {IPoint} Base point
     */
    readonly basePoint: IPoint;
    /**
     * Zooms axis to specific Dates.
     *
     * @param {Date}     startDate       Start date
     * @param {Date}     endValue        End date
     * @param {boolean}  skipRangeEvent  Do not invoke events
     * @param {boolean}  instantly       Do not play zoom animations
     */
    zoomToDates(startDate: Date, endDate: Date, skipRangeEvent?: boolean, instantly?: boolean): void;
}
