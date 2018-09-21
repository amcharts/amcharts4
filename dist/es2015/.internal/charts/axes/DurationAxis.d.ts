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
export declare class DurationAxisDataItem extends ValueAxisDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {DurationAxis}
     */
    _component: DurationAxis;
    /**
     * Constructor
     */
    constructor();
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
export interface IDurationAxisDataFields extends IValueAxisDataFields {
}
/**
 * Defines properties for [[DurationAxis]].
 */
export interface IDurationAxisProperties extends IValueAxisProperties {
}
/**
 * Defines events for [[DurationAxis]].
 */
export interface IDurationAxisEvents extends IValueAxisEvents {
}
/**
 * Defines adapters for [[DurationAxis]].
 *
 * @see {@link Adapter}
 */
export interface IDurationAxisAdapters extends IValueAxisAdapters, IDurationAxisProperties {
}
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
export declare class DurationAxis<T extends AxisRenderer = AxisRenderer> extends ValueAxis<T> {
    /**
     * Defines data fields.
     *
     * @type {IDurationAxisDataFields}
     */
    _dataFields: IDurationAxisDataFields;
    /**
     * Defines available properties.
     *
     * @type {IDurationAxisProperties}
     */
    _properties: IDurationAxisProperties;
    /**
     * Defines available adapters.
     *
     * @type {IDurationAxisAdapters}
     */
    _adapter: IDurationAxisAdapters;
    /**
     * Defines available events.
     *
     * @type {IDurationAxisEvents}
     */
    _events: IDurationAxisEvents;
    /**
     * Defines the type of the Date Items.
     *
     * @type {DurationAxisDataItem}
     */
    _dataItem: DurationAxisDataItem;
    /**
     * A base unit (granularity) of data.
     *
     * Used to indicate what are the base units of your data.
     */
    protected _baseUnit: TimeUnit;
    /**
     * A special duration format to apply axis tooltips.
     *
     * Will use same format as for labels, if not set.
     *
     * @type {string}
     */
    protected _tooltipDurationFormat: string;
    /**
     * Axis date format chosen dynamically based on min/max and baseUnit.
     *
     * @readonly
     */
    axisDurationFormat: string;
    /**
     * Constructor
     */
    constructor();
    /**
     * Formats the value according to axis' own [[DurationFormatter]].
     *
     * @param  {number}  value  Source value
     * @return {string}         Formatted value
     */
    formatLabel(value: number, format?: string): string;
    /**
     * Adjusts actual min and max scale values so that the axis starts and ends
     * at "nice" values, unless `strictMinMax` is set.
     *
     * The `difference` can be something else than `max - min`, because of the
     * axis breaks.
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}      min        [description]
     * @param  {number}      max        [description]
     * @param  {number}      difference [description]
     * @param  {number}      gridCount  [description]
     * @param  {boolean}     strictMode [description]
     * @return {IMinMaxStep}            [description]
     */
    adjustMinMax(min: number, max: number, difference: number, gridCount: number, strictMode?: boolean): IMinMaxStep;
    /**
     * @return {string} Duration format for axis labels
     */
    /**
     * A special duration format to apply axis tooltips.
     *
     * Will use same format as for labels, if not set.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} for mor information.
     * @param {string}  value  Duration format for axis labels
     */
    tooltipDurationFormat: string;
    /**
     * Returns text to show in a axis tooltip, based on specific position within
     * axis.
     *
     * The label will be formatted as per [[NumberFormatter]] set for the whole
     * chart, or explicitly for this Axis.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position (px)
     * @return {string}            Label (numeric value)
     */
    getTooltipText(position: number): string;
    /**
     * @return {TimeUnit} Base unit
     */
    /**
     * A base unit (granularity) of data.
     *
     * Used to indicate what are the base units of your data.
     *
     * Available options: "millisecond", "second" (default), "minute", "hour",
     * "day", "week", "month", "year".
     *
     * @default "second"
     * @param {TimeUnit} timeUnit
     */
    baseUnit: TimeUnit;
    /**
     * Copies all properties and related data from a different instance of Axis.
     *
     * @param {this} source Source Axis
     */
    copyFrom(source: this): void;
}
