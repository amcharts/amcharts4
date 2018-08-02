/**
 * Category axis module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Axis, AxisItemLocation, AxisDataItem, IAxisProperties, IAxisDataFields, IAxisAdapters, IAxisEvents } from "./Axis";
import { IPoint, IOrientationPoint } from "../../core/defs/IPoint";
import { AxisRenderer } from "./AxisRenderer";
import { SerialChart } from "../types/SerialChart";
import { Dictionary } from "../../core/utils/Dictionary";
import { XYSeries, XYSeriesDataItem } from "../series/XYSeries";
import { CategoryAxisBreak } from "./CategoryAxisBreak";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[CategoryAxis]].
 *
 * @see {@link DataItem}
 */
export declare class CategoryAxisDataItem extends AxisDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {CategoryAxis}
     */
    _component: CategoryAxis;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {string} Category
     */
    /**
     * Category.
     *
     * @param {string}  value  Category
     */
    category: string;
    /**
     * @return {string} End category
     */
    /**
     * End category.
     *
     * Used for items that span several categories, like [[CategoryAxisBreak]].
     *
     * @param {string}  value  End category
     */
    endCategory: string;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[CategoryAxis]].
 *
 */
export interface ICategoryAxisDataFields extends IAxisDataFields {
    /**
     * A field that holds category information.
     *
     * @type {string}
     */
    category?: string;
}
/**
 * Defines properties for [[CategoryAxis]].
 *
 */
export interface ICategoryAxisProperties extends IAxisProperties {
}
/**
 * Defines events for [[CategoryAxis]].
 *
 */
export interface ICategoryAxisEvents extends IAxisEvents {
}
/**
 * Defines adapter for [[CategoryAxis]].
 *
 * @see {@link Adapter}
 */
export interface ICategoryAxisAdapters extends IAxisAdapters, ICategoryAxisProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to create a category-based axis for the chart.
 *
 * ```TypeScript
 * // Create the axis
 * let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 *
 * // Set settings
 * xAxis.title.text = "Clients";
 * ```
 * ```JavaScript
 * // Create the axis
 * var valueAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 *
 * // Set settings
 * valueAxis.title.text = "Clients";
 * ```
 * ```JSON
 * "xAxes": [{
 *   "type": "CategoryAxis",
 *   "title": {
 *     "text": "Clients"
 *   }
 * }]
 * ```
 *
 * @see {@link ICategoryAxisEvents} for a list of available Events
 * @see {@link ICategoryAxisAdapters} for a list of available Adapters
 * @important
 */
export declare class CategoryAxis<T extends AxisRenderer = AxisRenderer> extends Axis<T> {
    /**
     * Defines data fields.
     *
     * @ignore Exclude from docs
     * @type {CategoryAxisDataFIelds}
     */
    _dataFields: ICategoryAxisDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ICategoryAxisProperties}
     */
    _properties: ICategoryAxisProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ICategoryAxisAdapters}
     */
    _adapter: ICategoryAxisAdapters;
    /**
     * Defines available events.
     *
     * @type {ICategoryAxisEvents}
     * @ignore Exclude from docs
     */
    _events: ICategoryAxisEvents;
    /**
     * Defines the type of the Date Items.
     *
     * @ignore Exclude from docs
     * @type {CategoryAxisDataItem}
     */
    _dataItem: CategoryAxisDataItem;
    /**
     * Defines the type of the axis breaks.
     *
     * @ignore Exclude from docs
     * @type {CategoryAxisBreak}
     */
    _axisBreak: CategoryAxisBreak;
    /**
     * A reference to chart the axis is for.
     *
     * @type {SerialChart}
     */
    chart: SerialChart;
    /**
     * Frequency of the labels on axis.
     *
     * @type {number}
     */
    protected _frequency: number;
    /**
     * A collection that holds Axis' data items sorted by each category.
     *
     * @type {Dictionary}
     */
    dataItemsByCategory: Dictionary<string, this["_dataItem"]>;
    /**
     * last data item is used for the closing grid
     */
    protected _lastDataItem: CategoryAxisDataItem;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty [[DataItem]] of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {CategoryAxisDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Returns a new/empty [[AxisBreak]] of the appropriate type.
     *
     * @return {CategoryAxisBreak} Axis break
     */
    protected createAxisBreak(): this["_axisBreak"];
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
     * [validateDataElement description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {CategoryAxisDataItem}  dataItem   [description]
     * @param {number}                itemIndex  [description]
     */
    validateDataElement(dataItem: this["_dataItem"], itemIndex?: number, index?: number): void;
    /**
     * Processes the axis data item.
     *
     * @ignore Exclude from docs
     * @param {CategoryAxisDataItem}  dataItem     Data item
     * @param {Object}                dataContext  The raw data that corresponds to this data item
     */
    processDataItem(dataItem: this["_dataItem"], dataContext: Object): void;
    /**
     * Converts a category index to an actual screen coordinate on the axis.
     *
     * `location` identifies relative location within category. 0 - beginning,
     * 0.5 - middle, 1 - end, and anything inbetween.
     *
     * @param  {number}                     index     Index
     * @param  {AxisItemLocation | number}  location  Location (0-1)
     * @return {number}                               Position (px)
     */
    indexToPosition(index: number, location?: AxisItemLocation | number): number;
    /**
     * Converts a string category name to relative position on axis.
     *
     * `location` identifies relative location within category. 0 - beginning,
     * 0.5 - middle, 1 - end, and anything inbetween.
     *
     * @param  {string}            category  Category name
     * @param  {AxisItemLocation}  location  Location (0-1)
     * @return {number}                      Position
     */
    categoryToPosition(category: string, location?: AxisItemLocation): number;
    /**
     * Converts a string category name to a orientation point (x, y, angle) on axis
     *
     * `location` identifies relative location within category. 0 - beginning,
     * 0.5 - middle, 1 - end, and anything inbetween.
     * @param  {string}            category  Category name
     * @param  {AxisItemLocation}  location  Location (0-1)
     * @return {IOrientationPoint}  Orientation point
     */
    categoryToPoint(category: string, location?: AxisItemLocation): IOrientationPoint;
    /**
     * Converts a string category name to a orientation point (x, y, angle) on axis
     *
     * `location` identifies relative location within category. 0 - beginning,
     * 0.5 - middle, 1 - end, and anything inbetween.
     * @param  {string}            category  Category name
     * @param  {AxisItemLocation}  location  Location (0-1)
     * @return {IOrientationPoint}  Orientation point
     */
    anyToPoint(category: string, location?: AxisItemLocation): IOrientationPoint;
    /**
     * Converts a string category name to relative position on axis.
     *
     * An alias to `categoryToPosition()`.
     *
     * @param  {string}            category  Category name
     * @param  {AxisItemLocation}  location  Location (0-1)
     * @return {number}                      Relative position
     */
    anyToPosition(category: string, location?: AxisItemLocation): number;
    /**
     * Converts named category to an index of data item it corresponds to.
     *
     * @param  {string}  category  Category
     * @return {number}            Data item index
     */
    categoryToIndex(category: string): number;
    /**
     * Zooms the axis to specific named ctaegories.
     *
     * @param {string}  startCategory  Start category
     * @param {string}  endCategory    End category
     */
    zoomToCategories(startCategory: string, endCategory: string): void;
    /**
     * [getAnyRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {string}           start         [description]
     * @param  {string}           end           [description]
     * @param  {AxisItemLocation} startLocation [description]
     * @param  {AxisItemLocation} endLocation   [description]
     * @return {string}                         [description]
     */
    getAnyRangePath(start: string, end: string, startLocation?: AxisItemLocation, endLocation?: AxisItemLocation): string;
    /**
     * Takes an absolute position (px) within axis and adjust it to a specific
     * `location` within category it corresponds to.
     *
     * @param  {number}            position  Source position (px)
     * @param  {AxisItemLocation}  location  Location within category (0-1)
     * @return {number}                      Adjusted position (px)
     */
    roundPosition(position: number, location?: AxisItemLocation): number;
    /**
     * Returns a data item from Series that corresponds to a specific absolute
     * position on the Axis.
     *
     * @param  {XYSeries}          series    Target series
     * @param  {number}            position  Position (px)
     * @return {XYSeriesDataItem}            Series data item
     */
    getSeriesDataItem(series: XYSeries, position: number): XYSeriesDataItem;
    /**
     * Returns the X coordinate for series' data item.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {SeriesDataItem}  dataItem  Data item
     * @param  {string}          key       Category
     * @param  {number}          location  Location (0-1)
     * @return {number}                    X coordinate (px)
     */
    getX(dataItem: XYSeriesDataItem, key?: string, location?: number): number;
    /**
     * Returns the Y coordinate for series' data item.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {SeriesDataItem}  dataItem  Data item
     * @param  {string}          key       Category
     * @param  {number}          location  Location (0-1)
     * @return {number}                    Y coordinate (px)
     */
    getY(dataItem: XYSeriesDataItem, key?: string, location?: number): number;
    /**
     * Returns an angle for series data item.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}            key       Category
     * @param  {number}            location  Location (0-1)
     * @param  {string}            stackKey  Stack key (?)
     * @return {number}                      Angle
     */
    getAngle(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number;
    /**
     * Returns an absolute pixel coordinate of the start of the cell (category),
     * that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  position  Position (px)
     * @return {number}            Cell start position (px)
     */
    getCellStartPosition(position: number): number;
    /**
     * Returns an absolute pixel coordinate of the end of the cell (category),
     * that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  position  Position (px)
     * @return {number}            Cell end position (px)
     */
    getCellEndPosition(position: number): number;
    /**
     * Returns text to show in a category tooltip, based on specific position
     * within axis.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position (px)
     * @return {string}            Label (category)
     */
    getTooltipText(position: number): string;
    /**
     * Returns an index of the category that corresponds to specific pixel
     * position within axis.
     *
     * @param  {number}  position  Position (px)
     * @return {number}            Category index
     */
    positionToIndex(position: number): number;
    /**
     * Returns category based on position.
     *
     * @param  {number}  position  Relative position on axis (0-1)
     * @return {string}            Position label
     */
    getPositionLabel(position: number): string;
    /**
     * Coordinates of the actual axis start.
     *
     * @ignore Exclude from docs
     * @return {IPoint} Base point
     */
    readonly basePoint: IPoint;
    /**
     * Initializes Axis' renderer.
     *
     * @ignore Exclude from docs
     */
    initRenderer(): void;
}
