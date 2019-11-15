/**
 * XY series module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Series, SeriesDataItem, ISeriesProperties, ISeriesDataFields, ISeriesAdapters, ISeriesEvents } from "./Series";
import { Sprite } from "../../core/Sprite";
import { Axis } from "../axes/Axis";
import { AxisRenderer } from "../axes/AxisRenderer";
import { ValueAxis } from "../axes/ValueAxis";
import { Dictionary } from "../../core/utils/Dictionary";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { XYChart } from "../types/XYChart";
import { CategoryAxis } from "../axes/CategoryAxis";
import { IPoint } from "../../core/defs/IPoint";
import { DateAxis } from "../axes/DateAxis";
import { Bullet } from "../elements/Bullet";
import { CalculatedValue } from "../../core/Component";
import { Animation } from "../../core/utils/Animation";
import { ITimeInterval } from "../../core/defs/ITimeInterval";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[XYSeries]].
 *
 * @see {@link DataItem}
 */
export declare class XYSeriesDataItem extends SeriesDataItem {
    /**
     * [_minX description]
     *
     * @todo Descripion
     */
    protected _minX: number;
    /**
     * [_maxX description]
     *
     * @todo Descripion
     */
    protected _maxX: number;
    /**
     * [_minY description]
     *
     * @todo Descripion
     */
    protected _minY: number;
    /**
     * [_maxY description]
     *
     * @todo Descripion
     */
    protected _maxY: number;
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore
     */
    _component: XYSeries;
    /**
     * References to any aggregate data items this data item is part of.
     *
     * @ignore
     * @since 4.7.0
     */
    groupDataItems: this[];
    /**
     * Constructor
     */
    constructor();
    /**
     * @return Value
     */
    /**
     * Item's numeric value on X value axis.
     *
     * @param value  Value
     */
    valueX: number;
    /**
     * @return Value
     */
    /**
     * Item's numeric value on Y value axis.
     *
     * @param value  Value
     */
    valueY: number;
    /**
     * @return Date
     */
    /**
     * Item's date value on X date-based axis.
     *
     * @param date  Date
     */
    dateX: Date;
    /**
     * @return Date
     */
    /**
     * Item's date value on Y date-based axis.
     *
     * @param date  Date
     */
    dateY: Date;
    /**
     * @return Category
     */
    /**
     * Item's category on X category axis.
     *
     * @param category  Category
     */
    categoryX: string;
    /**
     * @return Category
     */
    /**
     * Item's category on Y category axis.
     *
     * @param category  Category
     */
    categoryY: string;
    /**
     * @return Value
     */
    /**
     * Item's open numeric value on X value axis.
     *
     * @param value  Value
     */
    openValueX: number;
    /**
     * @return Value
     */
    /**
     * Item's open numeric value on Y value axis.
     *
     * @param value  Value
     */
    openValueY: number;
    /**
     * @return Date
     */
    /**
     * Item's open date value on X date-based axis.
     *
     * @param date  Date
     */
    openDateX: Date;
    /**
     * @return Date
     */
    /**
     * Item's open date value on Y date-based axis.
     *
     * @param date  Date
     */
    openDateY: Date;
    /**
     * @return Category
     */
    /**
     * Item's open category on X category axis.
     *
     * @param category  Category
     */
    openCategoryX: string;
    /**
     * @return Category
     */
    /**
     * Item's open category on Y category axis.
     *
     * @param category  Category
     */
    openCategoryY: string;
    /**
     * Return smallest value out of all item's value fields.
     *
     * @ignore Exclude from docs
     * @param fields      Fields to check in
     * @param working     Include working (temporary) values
     * @param stackValue  If item is in a stack, the value item starts as
     * @return Value
     */
    getMin(fields: string[], working?: boolean, stackValue?: number): number;
    /**
     * Return biggest value out of all item's value fields.
     *
     * @ignore Exclude from docs
     * @param fields      Fields to check in
     * @param working     Include working (temporary) values
     * @param stackValue  If item is in a stack, the value item starts as
     * @return Value
     */
    getMax(fields: string[], working?: boolean, stackValue?: number): number;
}
/**
 * Defines property set for a [[XYSeries]] tooltip event that contains information about dataItem
 */
export declare type XYSeriesTooltipEvent = {
    /**
     * Shift in coordinates after dragging.
     */
    dataItem: XYSeriesDataItem;
};
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[XYSeries]].
 */
export interface IXYSeriesDataFields extends ISeriesDataFields {
    /**
     * Name of the field in data that holds numeric value for horizontal axis.
     */
    valueX?: string;
    /**
     * Name of the field in data that holds numeric value for vertical axis.
     */
    valueY?: string;
    /**
     * Name of the field in data that holds category for horizontal axis.
     */
    categoryX?: string;
    /**
     * Name of the field in data that holds category for vertical axis.
     */
    categoryY?: string;
    /**
     * Name of the field in data that holds date for horizontal axis.
     */
    dateX?: string;
    /**
     * Name of the field in data that holds date for vertical axis.
     */
    dateY?: string;
    /**
     * Name of the field in data that holds open numeric value for horizontal
     * axis.
     */
    openValueX?: string;
    /**
     * Name of the field in data that holds open numeric value for vertical
     * axis.
     */
    openValueY?: string;
    /**
     * Name of the field in data that holds open category for horizontal axis.
     */
    openCategoryX?: string;
    /**
     * Name of the field in data that holds open category for vertical axis.
     */
    openCategoryY?: string;
    /**
     * Name of the field in data that holds open date for horizontal axis.
     */
    openDateX?: string;
    /**
     * Name of the field in data that holds open date for vertical axis.
     */
    openDateY?: string;
    /**
     * Which calculated field to use to use as a horizontal axis value for the
     * item.
     */
    valueXShow?: CalculatedValue;
    /**
     * Which calculated field to use to use as a vertical axis value for the
     * item.
     */
    valueYShow?: CalculatedValue;
    /**
     * Which calculated field to use to use as a horizontal axis open value for
     * the item.
     */
    openValueXShow?: CalculatedValue;
    /**
     * Which calculated field to use to use as a vertical axis open value for
     * the item.
     */
    openValueYShow?: CalculatedValue;
}
/**
 * Defines types of the aggregate value.
 *
 * @since 4.7.0
 */
export declare type GroupField = "open" | "close" | "low" | "high" | "average" | "sum";
/**
 * Defines data fields that can be calculated for aggregate values.
 *
 * @since 4.7.0
 */
export interface IXYSeriesGroupFields {
    /**
     * Indicates how to calculate aggregate value for `valueX` data field.
     *
     * @default "close"
     */
    valueX?: GroupField;
    /**
     * Indicates how to calculate aggregate value for `valueY` data field.
     *
     * @default "close"
     */
    valueY?: GroupField;
    /**
     * Indicates how to calculate aggregate value for `openValueX` data field.
     *
     * @default "open"
     */
    openValueX?: GroupField;
    /**
     * Indicates how to calculate aggregate value for `openValueY` data field.
     *
     * @default "open"
     */
    openValueY?: GroupField;
}
/**
 * Defines properties for [[XYSeries]].
 */
export interface IXYSeriesProperties extends ISeriesProperties {
    /**
     * Can items from this series be included into stacks?
     *
     * @default false
     */
    stacked?: boolean;
    /**
     * Should the nearest tooltip be shown if no data item is found on the
     * current cursor position
     *
     * @default false
     */
    snapTooltip?: boolean;
    /**
     * Indicates if series should display a tooltip for chart's cursor.
     *
     * @default true
     */
    cursorTooltipEnabled?: boolean;
    /**
     * Indicates if series should apply hover state on bullets/columns/etc when
     * cursor is over the data item.
     *
     * @default true
     */
    cursorHoverEnabled?: boolean;
    /**
     * Indicates if series' values should be excluded when calculating totals.
     *
     * @default false
     */
    excludeFromTotal?: boolean;
}
/**
 * Defines events for [[XYSeries]].
 */
export interface IXYSeriesEvents extends ISeriesEvents {
    /**
     * Invoked when series tooltip was shown on some particular data item
     */
    tooltipshownat: XYSeriesTooltipEvent;
}
/**
 * Defines adapters for [[XYSeries]].
 *
 * @see {@link Adapter}
 */
export interface IXYSeriesAdapters extends ISeriesAdapters, IXYSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines Series for [[XYChart]].
 *
 * @see {@link IXYSeriesEvents} for a list of available Events
 * @see {@link IXYSeriesAdapters} for a list of available Adapters
 * @important
 */
export declare class XYSeries extends Series {
    /**
     * Defines type of the group fields.
     *
     * @ignore
     * @since 4.7.0
     */
    _groupFields: IXYSeriesGroupFields;
    /**
     * Indicates which of the series' `dataFields` to calculate aggregate values
     * for.
     *
     * Available data fields for all [[XYSeries]] are:
     * `valueX`, `valueY`, `openValueX`, and `openValueY`.
     *
     * [[CandlestickSeries]] adds:
     * `lowValueX`, `lowValueY`, `highValueX`, and `highValueY`.
     *
     * Available options:
     * `"open"`, `"close"`, `"low"`, `"high"`, "average", `"sum"`.
     *
     * Defaults are as follows:
     * * `valueX`: `"close"`
     * * `valueY`: `"close"`
     * * `openValueX`: `"open"`
     * * `openValueY`: `"open"`
     * * `lowValueX`: `"low"`
     * * `lowValueY`: `"low"`
     * * `highValueX`: `"high"`
     * * `highValueY`: `"high"`
     *
     * Is required only if data being plotted on a `DateAxis` and
     * its `groupData` is set to `true`.
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
     * The above setup will ensure, that if there are many data items within
     * selected range, they will be grouped into aggregated data points, using
     * average value of all the values.
     *
     * For example if we have 2 years worth of daily data (~700 data items), when
     * fully zoomed out, the chart would show ~100 data items instead: one for
     * each week in those two years.
     *
     * Grouping will occur automatically, based on current selection range, and
     * will change dynamically when user zooms in/out the chart.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Dynamic_data_item_grouping} for more information about dynamic data item grouping.
     * @since 4.7.0
     */
    groupFields: this["_groupFields"];
    /**
     * Defines the type of data fields used for the series.
     */
    _dataFields: IXYSeriesDataFields;
    /**
     * Defines available properties.
     */
    _properties: IXYSeriesProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IXYSeriesAdapters;
    /**
     * Defines available events.
     */
    _events: IXYSeriesEvents;
    /**
     * Defines the type of data item.
     */
    _dataItem: XYSeriesDataItem;
    /**
     * X axis the series is attached to.
     */
    protected _xAxis: MutableValueDisposer<Axis<AxisRenderer>>;
    /**
     * Y axis the series is attached to.
     */
    protected _yAxis: MutableValueDisposer<Axis<AxisRenderer>>;
    /**
     * A chart series belongs to.
     */
    _chart: XYChart;
    /**
     * The main (base) axis.
     *
     * This is the axis that series fills will go to, or grow animations will
     * happen from.
     */
    protected _baseAxis: Axis;
    /**
     * Total data item count.
     */
    protected _count: Dictionary<string, number>;
    /**
     * Data item count in current selection.
     */
    protected _scount: Dictionary<string, number>;
    /**
     * [_xField description]
     *
     * @todo Description
     */
    protected _xField: string;
    /**
     * [_yField description]
     *
     * @todo Description
     */
    protected _yField: string;
    /**
     * [_xOpenField description]
     *
     * @todo Description
     */
    protected _xOpenField: string;
    /**
     * [_yOpenField description]
     *
     * @todo Description
     */
    protected _yOpenField: string;
    /**
     * [_tooltipXField description]
     *
     * @todo Description
     */
    protected _tooltipXField: string;
    /**
     * [_tooltipYField description]
     *
     * @todo Description
     */
    protected _tooltipYField: string;
    /**
     * [_xValueFields description]
     *
     * @todo Description
     */
    protected _xValueFields: Array<string>;
    /**
     * [_yValueFields description]
     *
     * @todo Description
     */
    protected _yValueFields: Array<string>;
    /**
     * Series which is stacked on top of this series, if any.
     *
     * @ignore Exclude from docs
     */
    stackedSeries: XYSeries;
    /**
     * Dataitem of previously shown tooltip, used to avoid multiple
     * tooltipshownat dispatches.
     */
    protected _prevTooltipDataItem: XYSeriesDataItem;
    /**
     * @ignore
     */
    _baseInterval: {
        [index: string]: ITimeInterval;
    };
    /**
     * @ignore
     */
    dataGrouped: boolean;
    /**
     * @ignore
     */
    usesShowFields: boolean;
    /**
     * @ignore
     */
    protected _dataSetChanged: boolean;
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
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * @ignore
     */
    dataChangeUpdate(): void;
    /**
     * (Re)validates the series' data.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    /**
     * Processes data item.
     *
     * @param dataItem     Data item
     * @param dataContext  Raw data
     * @param index        Index of the data item
     */
    protected processDataItem(dataItem: this["_dataItem"], dataContext?: Object): void;
    /**
     *
     * When validating raw data, instead of processing data item, we update it
     *
     * @ignore Exclude from docs
     * @param item
     */
    protected updateDataItem(dataItem: this["_dataItem"]): void;
    /**
     * Inits data item's working values.
     *
     * @param dataItem  Data item
     * @param index     Data item's index
     */
    protected setInitialWorkingValues(dataItem: this["_dataItem"]): void;
    /**
     * @ignore
     */
    disposeData(): void;
    /**
     * @ignore
     */
    protected clearCatAxis(axis: CategoryAxis): void;
    /**
     * Sets up which data fields to use for data access.
     */
    protected defineFields(): void;
    /**
     * [axis description]
     *
     * @todo Description
     * @param axis    Axis
     * @param fields  Fields (?)
     * @param field   Field
     */
    protected addValueField<Key extends keyof this["_dataFields"]>(axis: Axis, fields: Array<Key>, field: Key): void;
    /**
     * Sets category field from the category axis.
     *
     * User might set field for category axis only, but not for series. In such
     * case, we take field value from axis and set it for series.
     *
     * @param field  Field
     * @param axis   Axis
     */
    protected setCategoryAxisField<Key extends keyof this["_dataFields"]>(field: Key, axis: CategoryAxis): void;
    /**
     * Sets date field from the date axis.
     *
     * User might set field for category axis only, but not for series. In such
     * case, we take field value from axis and set it for series.
     *
     * @param field  Field
     * @param axis   Axis
     */
    protected setDateAxisField<Key extends keyof this["_dataFields"]>(field: Key, axis: DateAxis): void;
    /**
     * Performs after-draw tasks, e.g. creates masks.
     */
    protected afterDraw(): void;
    /**
     * Create a mask for the series.
     *
     * @ignore Exclude from docs
     */
    createMask(): void;
    /**
     * Returns an SVG path to use as series mask.
     *
     * @return SVG path
     */
    protected getMaskPath(): string;
    /**
     * Returns axis data field to use.
     *
     * @param axis  Axis
     * @return Field name
     */
    getAxisField(axis: Axis): string;
    /**
     * Validates data items.
     *
     * @ignore Exclude from docs
     */
    validateDataItems(): void;
    /**
     * Validates data range.
     *
     * @ignore Exclude from docs
     */
    validateDataRange(): void;
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * @return Axis
     */
    /**
     * X axis the series is attached to.
     *
     * @param axis  Axis
     */
    xAxis: Axis;
    protected setXAxis(axis: Axis): void;
    /**
     * @return Axis
     */
    /**
     * Y axis the series is attached to.
     *
     * @param axis  Axis
     */
    yAxis: Axis;
    protected setYAxis(axis: Axis): void;
    /**
     * @return Axis
     */
    /**
     * The main (base) axis.
     *
     * This is the axis that series fills will go to, or grow animations will
     * happen from.
     *
     * @param value  Axis
     */
    baseAxis: Axis;
    /**
     * Makes the chart use particular data set.
     *
     * If `id` is not provided or there is no such data set, main data will be
     * used.
     *
     * @ignore
     * @since 4.7.0
     * @param  id  Data set id
     */
    setDataSet(id: string): boolean;
    /**
     * Processes values after data items' were added.
     *
     * @ignore Exclude from docs
     * @param dataItems  Data items
     */
    processValues(working: boolean): void;
    /**
     * Hides element's [[Tooltip]].
     *
     * @see {@link Tooltip}
     */
    hideTooltip(): void;
    /**
     * Shows series tooltip at specific position.
     *
     * @param xPosition  X
     * @param yPosition  Y
     */
    showTooltipAtPosition(xPosition: number, yPosition: number): IPoint;
    protected getAdjustedXLocation(dataItem: this["_dataItem"], field: string): number;
    protected getAdjustedYLocation(dataItem: this["_dataItem"], field: string): number;
    /**
     * Shows series tooltip at specific dataItem.
     *
     * @param dataItem
     */
    showTooltipAtDataItem(dataItem: this["_dataItem"]): IPoint;
    /**
     * returns default state to bullets when tooltip is shown at some other data item or hidden
     *
     * @ignore Exclude from docs
     */
    protected returnBulletDefaultState(dataItem?: XYSeriesDataItem): void;
    protected shouldCreateBullet(dataItem: this["_dataItem"], bulletTemplate: Bullet): boolean;
    positionBullet(bullet: Bullet): void;
    protected positionBulletReal(bullet: Sprite, positionX: number, positionY: number): void;
    /**
    * returns bullet x location
    * @ignore
    */
    protected getBulletLocationX(bullet: Bullet, field: string): number;
    /**
    * returns bullet x location
    * @ignore
    */
    protected getBulletLocationY(bullet: Bullet, field: string): number;
    /**
     * @return Can be stacked?
     */
    /**
     * Can items from this series be included into stacks?
     *
     * Note: proper stacking is only possible if series have the same number
     * of data items. To ensure this, don't set data directly on series
     * but do this on chart instead.
     *
     * @default false
     * @param stacked  Can be stacked?
     */
    stacked: boolean;
    /**
     * @return Should snap?
     */
    /**
     * Should the nearest tooltip be shown if no data item is found on the
     * current cursor position? In order this to work, you should set snapTooltip = false on the series baseAxis.
     *
     * @default false
     * @param value  Should snap?
     */
    snapTooltip: boolean;
    /**
     * Shows hidden series.
     *
     * @param duration  Duration of reveal animation (ms)
     * @return Animation
     */
    show(duration?: number): Animation;
    /**
     * Hides series.
     *
     * @param duration  Duration of hiding animation (ms)
     * @return Animation
     */
    hide(duration?: number): Animation;
    /**
     * [handleDataItemWorkingValueChange description]
     *
     * @ignore Exclude from docs
     */
    handleDataItemWorkingValueChange(dataItem?: this["_dataItem"], name?: string): void;
    /**
     * [getStackValue description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param dataItem  Data item
     */
    getStackValue(dataItem: this["_dataItem"], working?: boolean): void;
    /**
     * [xField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @return [description]
     */
    readonly xField: string;
    /**
     * [yField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @return [description]
     */
    readonly yField: string;
    /**
     * [xOpenField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @return [description]
     */
    readonly xOpenField: string;
    /**
     * [yOpenField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @return [description]
     */
    readonly yOpenField: string;
    /**
     * @ignore Exclude from docs
     * @todo Description
     * @return [description]
     */
    /**
     * [tooltipXField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param value [description]
     */
    tooltipXField: string;
    /**
     * @ignore Exclude from docs
     * @todo Description
     * @return [description]
     */
    /**
     * [tooltipYField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param value [description]
     */
    tooltipYField: string;
    /**
     * Returns lowest value in the series for the specific axis.
     *
     * @ignore Exclude from docs
     * @param axis  Axis
     * @return value
     */
    min(axis: ValueAxis): number;
    /**
     * Returns highest value in the series for the specific axis.
     *
     * @ignore Exclude from docs
     * @param axis  Axis
     * @return value
     */
    max(axis: ValueAxis): number;
    /**
     * Returns lowest value in the series for the specific axis within current
     * selection.
     *
     * @ignore Exclude from docs
     * @param axis  Axis
     * @return value
     */
    selectionMin(axis: ValueAxis): number;
    /**
     * Returns highest value in the series for the specific axis within current
     * selection.
     *
     * @ignore Exclude from docs
     * @param axis  Axis
     * @return value
     */
    selectionMax(axis: ValueAxis): number;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
    /**
     * Returns an [[IPoint]] coordinates of the specific Serie's data point.
     *
     * @param    dataItem   Data item
     * @param    xKey       Name of X data field
     * @param    yKey       Name of Y data field
     * @param    locationX  X location
     * @param    locationY  Y location
     * @param    stackKeyX  ?
     * @param    stackKeyY  ?
     * @returns             Coordinates
     */
    getPoint(dataItem: XYSeriesDataItem, xKey: string, yKey: string, locationX?: number, locationY?: number, stackKeyX?: string, stackKeyY?: string): IPoint;
    /**
     * Updates item reader text based on the type and set up of axis.
     */
    protected updateItemReaderText(): void;
    /**
     * @return Display tooltip?
     */
    /**
     * Indicates if series should display a tooltip for chart's cursor.
     *
     * If set to `true` (default), the tooltips set for all series item's
     * elements like columns and bullets will be automatically shown
     * when [[XYCursor]] passes over category/date, even if its not hovered
     * directly over the item.
     *
     * Set this to `false` to disable such behavior and display item-specific
     * tooltips only when hovered directly over them
     *
     * @default true
     * @param value Display tooltip?
     */
    cursorTooltipEnabled: boolean;
    /**
     * @return Hover enabled?
     */
    /**
     * Indicates if series should apply hover state on bullets/columns/etc when
     * cursor is over the data item.
     *
     * If set to `true` (default) and chart cursor is enabled on th chart,
     * hovering over date/category will trigger hover states on related Series
     * items like bullets and columns.
     *
     * @default true
     * @since 4.2.2
     * @param  value  Hover enabled?
     */
    cursorHoverEnabled: boolean;
    /**
     * @return Exclude from totals?
     */
    /**
     * Indicates if series' values should be excluded when calculating totals.
     *
     * @default false
     * @since 4.4.9
     * @param  value  Exclude from totals?
     */
    excludeFromTotal: boolean;
}
