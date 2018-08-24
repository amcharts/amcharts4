/**
 * Value Axis module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Axis, AxisDataItem, IAxisProperties, IAxisDataFields, IAxisAdapters, IAxisEvents } from "./Axis";
import { AxisRenderer } from "./AxisRenderer";
import { List } from "../../core/utils/List";
import { IPoint, IOrientationPoint } from "../../core/defs/IPoint";
import { IDisposer } from "../../core/utils/Disposer";
import { SerialChart } from "../types/SerialChart";
import { XYSeries, XYSeriesDataItem } from "../series/XYSeries";
import { ValueAxisBreak } from "./ValueAxisBreak";
import { Animation } from "../../core/utils/Animation";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ValueAxis]].
 *
 * @see {@link DataItem}
 */
export declare class ValueAxisDataItem extends AxisDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {ValueAxis}
     */
    _component: ValueAxis;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Value
     */
    /**
     * A data point's numeric value.
     *
     * @param {number}  value  Value
     */
    value: number;
    /**
     * @return {number} Value
     */
    /**
     * Data point's numeric end value.
     *
     * @param {number}  value  End value
     */
    endValue: number;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 *
 */
export interface IMinMaxStep {
    min: number;
    max: number;
    step: number;
}
/**
 * Defines data fields for [[ValueAxis]].
 */
export interface IValueAxisDataFields extends IAxisDataFields {
}
/**
 * Defines properties for [[ValueAxis]].
 */
export interface IValueAxisProperties extends IAxisProperties {
    strictMinMax?: boolean;
    logarithmic?: boolean;
    maxPrecision?: number;
}
/**
 * Defines events for [[ValueAxis]].
 */
export interface IValueAxisEvents extends IAxisEvents {
    /**
     * Invoked when selection/zoom on axis occurs and start/end coordinates
     * change.
     */
    selectionextremeschanged: {};
    /**
     * Invoked when start/end coordinates of the axis change.
     */
    extremeschanged: {};
}
/**
 * Defines adapters for [[ValueAxis]].
 *
 * @see {@link Adapter}
 */
export interface IValueAxisAdapters extends IAxisAdapters, IValueAxisProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to create a value axis for the chart.
 *
 * ```TypeScript
 * // Create the axis
 * let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 *
 * // Set settings
 * valueAxis.title.text = "Monthly Sales";
 * ```
 * ```JavaScript
 * // Create the axis
 * var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 *
 * // Set settings
 * valueAxis.title.text = "Monthly Sales";
 * ```
 * ```JSON
 * "yAxes": [{
 *   "type": "ValueAxis",
 *   "title": {
 *     "text": "Monthly Sales"
 *   }
 * }]
 * ```
 *
 * @see {@link IValueAxisEvents} for a list of available Events
 * @see {@link IValueAxisAdapters} for a list of available Adapters
 * @important
 */
export declare class ValueAxis<T extends AxisRenderer = AxisRenderer> extends Axis<T> {
    /**
     * Defines data fields.
     *
     * @ignore Exclude from docs
     * @type {IValueAxisDataFields}
     */
    _dataFields: IValueAxisDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IValueAxisProperties}
     */
    _properties: IValueAxisProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IValueAxisAdapters}
     */
    _adapter: IValueAxisAdapters;
    /**
     * Defines the type of the Date Items.
     *
     * @ignore Exclude from docs
     * @type {ValueAxisDataItem}
     */
    _dataItem: ValueAxisDataItem;
    /**
     * Defines the type of the axis breaks.
     *
     * @ignore Exclude from docs
     * @type {ValueAxisBreak}
     */
    _axisBreak: ValueAxisBreak;
    /**
     * Defines available events.
     *
     * @type {IValueAxisEvents}
     * @ignore Exclude from docs
     */
    _events: IValueAxisEvents;
    /**
     * A reference to chart the axis is for.
     *
     * @type {SerialChart}
     */
    chart: SerialChart;
    /**
     * A list of Series that are using this Axis.
     *
     * @type {List<XYSeries>}
     */
    series: List<XYSeries>;
    /**
     * Minimum value for the axis scale.
     *
     * @type {number}
     */
    protected _min: number;
    /**
     * Maximum value for the axis scale.
     *
     * @type {number}
     */
    protected _max: number;
    /**
     * User-defined min value for axis.
     *
     * @type {number}
     */
    protected _minDefined: number;
    /**
     * User-defined max value for axis.
     *
     * @type {number}
     */
    protected _maxDefined: number;
    /**
     * [_minAdjusted description]
     *
     * @todo Description
     * @type {number}
     */
    protected _minAdjusted: number;
    /**
     * [_maxAdjusted description]
     *
     * @todo Description
     * @type {number}
     */
    protected _maxAdjusted: number;
    /**
     * Min real value. (lowest value of all data points)
     *
     * @type {number}
     */
    protected _minReal: number;
    /**
     * Max real value. (highest value of all data points)
     *
     * @type {number}
     */
    protected _maxReal: number;
    /**
     * Min value within current zoom.
     *
     * @type {number}
     */
    protected _minZoomed: number;
    /**
     * Max value within current zoom.
     *
     * @type {number}
     */
    protected _maxZoomed: number;
    /**
     * [_step description]
     *
     * @todo Description
     * @type {number}
     */
    protected _step: number;
    /**
     * [_stepDecimalPlaces description]
     *
     * @todo Description
     * @type {number}
     */
    protected _stepDecimalPlaces: number;
    /**
     * [_difference description]
     *
     * @todo Description
     * @type {number}
     */
    protected _difference: number;
    /**
     * Should axis scale explicitly start and `min` and `max`?
     *
     * @type {boolean}
     */
    protected _strictMinMax: boolean;
    /**
     * Base value for the axis.
     *
     * @type {number}
     */
    protected _baseValue: number;
    /**
     * [_previousValue description]
     *
     * @todo Description
     * @type {number}
     */
    protected _previousValue: number;
    /**
     * [_previousPoint description]
     *
     * @todo Description
     * @type {IPoint}
     */
    protected _previousPoint: IPoint;
    /**
     * Adjusted start in case we have breaks.
     *
     * @todo Description
     * @type {number}
     */
    protected _adjustedStart: number;
    /**
     * Adjusted end in case we have breaks.
     *
     * @todo Description
     * @type {number}
     */
    protected _adjustedEnd: number;
    /**
     * @todo Description
     */
    protected _valueToPosition: {
        [key: string]: number;
    };
    /**
     * @todo Description
     */
    protected _positionToValue: {
        [key: string]: number;
    };
    protected _finalMin: number;
    protected _finalMax: number;
    /**
     * Holds reference to a function that accepts a DataItem as parameter.
     *
     * It can either return a fill opacity for a fill, or manipulate data item
     * directly, to create various highlighting scenarios.
     *
     * @type {function}
     */
    fillRule: (dataItem: ValueAxisDataItem) => any;
    /**
     * As calculating totals is expensive operation and not often needed, we
     * don't do it by default.
     *
     * In case you use `totalPercent` or `total` in your charts, this must be set
     * to `true`.
     *
     * @default false
     * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/#100_stacks} For using `calculateTotals` for 100% stacked series.
     * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-strings/#Placeholders_for_numeric_values} For using `calculateTotals` in labels.
     * @type {boolean}
     */
    calculateTotals: boolean;
    protected _minMaxAnimation: Animation;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty [[DataItem]] of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {ValueAxisDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Returns a new/empty [[AxisBreak]] of the appropriate type.
     *
     * @return {ValueAxisBreak} Axis break
     */
    protected createAxisBreak(): this["_axisBreak"];
    /**
     * Validates Axis' data items.
     *
     * @ignore Exclude from docs
     */
    validateDataItems(): void;
    /**
     * Processes data items of the related Series.
     *
     * @ignore Exclude from docs
     */
    processSeriesDataItems(): void;
    /**
     * Validates the data range.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    validateDataRange(): void;
    /**
     * Validates the whole axis. Causes it to redraw.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    validate(): void;
    /**
     * Calculates all positions, related to axis as per current zoom.
     *
     * @ignore Exclude from docs
     */
    calculateZoom(): void;
    /**
     * Validates Axis elements.
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    validateAxisElements(): void;
    /**
     * Validates axis data item.
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {ValueAxisDataItem}  dataItem  Data item
     */
    validateDataElement(dataItem: this["_dataItem"]): void;
    /**
     * Formats the value according to axis' own [[NumberFormatter]].
     *
     * @param  {number}  value  Source value
     * @return {string}         Formatted value
     */
    formatLabel(value: number): string;
    /**
     * Coordinates of the actual axis start.
     *
     * @ignore Exclude from docs
     * @return {IPoint} Base point
     */
    readonly basePoint: IPoint;
    /**
     * @return {number} base value
     */
    /**
     * A base value.
     *
     * This is a threshold value that will divide "positive" and "negative"
     * value ranges.
     *
     * Other scale-related functionality also depend on base value. E.g. stacks,
     * value-dependent coloring, etc.
     *
     * @param {number} value Base value
     */
    baseValue: number;
    /**
     * Converts a numeric value to relative position on axis
     *
     * An alias to `valueToPosition()`.
     *
     * @param  {number}  value  Value
     * @return {number}         Position
     */
    anyToPosition(value: number): number;
    /**
     * Converts a numeric value to orientation point (x, y, angle) on axis
     *
     * @param  {number}  value  Value
     * @return {IOrientationPoint}  Orientation point
     */
    valueToPoint(value: number): IOrientationPoint;
    /**
     * Converts a numeric value to orientation (x, y, angle) point on axis
     *
     * @param  {number}  value  Value
     * @return {IOrientationPoint}  Orientation point
     */
    anyToPoint(value: number): IOrientationPoint;
    /**
     * Converts a numeric value to relative position on axis.
     *
     * @param  {number}  value  Value
     * @return {number}  relative position
     */
    valueToPosition(value: number): number;
    /**
     * Converts an relative position to a corresponding value within
     * axis' scale.
     *
     * @param  {number}  position  Position (px)
     * @return {number}            Value
     */
    positionToValue(position: number): number;
    /**
     * Converts an X coordinate to a relative value in axis' scale.
     *
     * @param  {number}  x  X (px)
     * @return {number}     Value
     */
    xToValue(x: number): number;
    /**
     * Converts an Y coordinate to a relative value in axis' scale.
     *
     * @param  {number}  y  Y (px)
     * @return {number}     Value
     */
    yToValue(y: number): number;
    /**
     * Converts pixel coordinates to a relative position. (0-1)
     *
     * @param {IPoint}   point  Coorinates (px)
     * @return {number}         Position (0-1)
     */
    pointToPosition(point: IPoint): number;
    /**
     * Calculates smallest and biggest value for the axis scale.
     *
     * @todo Description (review)
     */
    protected getMinMax(): void;
    /**
     * Adjusts the minimum value.
     *
     * This is a placeholder method for extending classes to override.
     *
     * For numeric values this does nothing, however for more complex types, like
     * dates, it may be necessary to adjust.
     *
     * @param  {number}  value  Value
     * @return {number}         Adjusted value
     */
    protected fixMin(value: number): number;
    /**
     * Adjusts the maximum value.
     *
     * This is a placeholder method for extending classes to override.
     *
     * For numeric values this does nothing, however for more complex types, like
     * dates, it may be necessary to adjust.
     *
     * @param  {number}  value  Value
     * @return {number}         Adjusted value
     */
    protected fixMax(value: number): number;
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
     * @return {number} Min value
     */
    /**
     * A minimum value for the axis scale.
     *
     * This value might be auto-adjusted by the Axis in order to accomodate the
     * grid nicely, i.e. plot area is divided by grid in nice equal cells.
     *
     * The above might be overridden by `strictMinMax` which will force exact
     * user-defined min and max values to be used for scale.
     *
     * @param {number}  value  Min value
     */
    min: number;
    /**
     * Current calculated delta in values between two adjacent grid lines (step).
     *
     * This is a read-only value and cannot be used to set ctual step.
     *
     * @readonly
     * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/#Setting_the_density_of_the_the_grid_labels} For more information about modifying density of labels
     * @return {number} [description]
     */
    readonly step: number;
    /**
     * @return {number} Max value
     */
    /**
     * A maximum value for the axis scale.
     *
     * This value might be auto-adjusted by the Axis in order to accomodate the
     * grid nicely, i.e. plot area is divided by grid in nice equal cells.
     *
     * The above might be overridden by `strictMinMax` which will force exact
     * user-defined min and max values to be used for scale.
     *
     * @param {number}  value  Max value
     */
    max: number;
    /**
     * Used for the Series to register itself as the user of this Axis.
     *
     * This will also decorate both the Series and Axis with event handlers, used
     * to redraw on Axis position/zoom change.
     *
     * A disposer for those events is returned, so that they can be disposed
     * together with Series.
     *
     * @ignore Exclude from docs
     * @param  {XYSeries}   series  Series
     * @return {IDisposer}          Disposer for events
     */
    registerSeries(series: XYSeries): IDisposer;
    /**
     * Perform tasks after Axis zoom.
     */
    protected handleSelectionExtremesChange(): void;
    /**
     * @return {boolean} Use exact values?
     */
    /**
     * Indicates whether to blindly use exact `min` and `max` values set by user
     * when generating Axis scale.
     *
     * If not set, the Axis might slightly adjust those values to accomodate a
     * better looking grid.
     *
     * @default false
     * @param {boolean} value Use exact values?
     */
    strictMinMax: boolean;
    /**
     * @return {boolean} Logarithmic scale?
     */
    /**
     * Indicates if this axis should use a logarithmic scale.
     *
     * Please note that logarithmic axis can **only** accommodate values bigger
     * than zero.
     *
     * Having zero or negative values will result in error and failure of the
     * whole chart.
     *
     * @param {boolean} value Logarithmic scale?
     */
    logarithmic: boolean;
    /**
     * @return {boolean} max precision
     */
    /**
     * Maximum number of decimals to allow when placing grid lines and labels
     * on axis.
     *
     * Set it to `0` (zero) to force integer-only axis labels.
     *
     * @param {number}
     */
    maxPrecision: number;
    /**
     * Invalidates axis data items when series extremes change
     */
    protected handleExtremesChange(): void;
    /**
     * Returns the X coordinate for series' data item's value.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}            key       Data field to get value from
     * @param  {number}            location  Location (0-1)
     * @param  {string}            stackKey  ?
     * @return {number}                      X coordinate (px)
     */
    getX(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number;
    /**
     * Returns the Y coordinate for series' data item's value.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}            key       Data field to get value from
     * @param  {number}            location  Location (0-1)
     * @param  {string}            stackKey  Stack ID
     * @return {number}                      Y coordinate (px)
     */
    getY(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number;
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
     * [getAnyRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}  start     [description]
     * @param  {number}  end       [description]
     * @param  {number}  location  [description]
     * @return {string}            [description]
     */
    getAnyRangePath(start: number, end: number, location?: number): string;
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
     * Zooms axis to specific values.
     *
     * @param {number}   startValue      Start value
     * @param {number}   endValue        End value
     * @param {boolean}  skipRangeEvent  Do not invoke events
     * @param {boolean}  instantly       Do not play zoom animations
     */
    zoomToValues(startValue: number, endValue: number, skipRangeEvent?: boolean, instantly?: boolean): void;
    /**
     * A smallest value in axis scale within current zoom.
     *
     * @return {number} Min zoom value
     */
    readonly minZoomed: number;
    /**
     * A biggest value in axis scale within current zoom.
     * @return {number} [description]
     */
    readonly maxZoomed: number;
    /**
     * Updates positioning of Axis breaks after something changes.
     *
     * @ignore Exclude from docs
     */
    fixAxisBreaks(): void;
    /**
     * Returns value based on position.
     *
     * @param  {number}  position  Relative position on axis (0-1)
     * @return {string}            Position label
     */
    getPositionLabel(position: number): string;
    /**
     * Shows Axis tooltip at specific value
     *
     * @param {number} value Value
     */
    showTooltipAt(value: number): void;
}
