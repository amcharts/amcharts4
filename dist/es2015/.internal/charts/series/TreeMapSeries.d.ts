/**
 * TreeMap series module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, IColumnSeriesProperties, IColumnSeriesDataFields, IColumnSeriesAdapters, IColumnSeriesEvents, ColumnSeriesDataItem } from "./ColumnSeries";
import { TreeMap, TreeMapDataItem } from "../types/TreeMap";
import { Animation } from "../../core/utils/Animation";
import { Container } from "../../core/Container";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[TreeMapSeries]].
 *
 * @see {@link DataItem}
 */
export declare class TreeMapSeriesDataItem extends ColumnSeriesDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {TreeMapSeries}
     */
    _component: TreeMapSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * Data for the this particular item.
     *
     * @param {Object}  value  Item's data
     */
    /**
     * @return {Object} Item's data
     */
    /**
     * The name of the item's parent item.
     *
     * @return {string} Parent name
     */
    readonly parentName: string;
    /**
     * Item's numeric value.
     *
     * @readonly
     * @return {number} Value
     */
    readonly value: number;
    /**
     * A corresponding data item from the tree map.
     *
     * @readonly
     * @return {TreeMapDataItem} Data item
     */
    readonly treeMapDataItem: TreeMapDataItem;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[TreeMapSeries]].
 */
export interface ITreeMapSeriesDataFields extends IColumnSeriesDataFields {
    /**
     * Name of the field in data that holds numeric value.
     *
     * @type {string}
     */
    value?: string;
}
/**
 * Defines properties for [[TreeMapSeries]].
 */
export interface ITreeMapSeriesProperties extends IColumnSeriesProperties {
}
/**
 * Defines events for [[TreeMapSeries]].
 */
export interface ITreeMapSeriesEvents extends IColumnSeriesEvents {
}
/**
 * Defines adapters for [[TreeMapSeries]].
 *
 * @see {@link Adapter}
 */
export interface ITreeMapSeriesAdapters extends IColumnSeriesAdapters, ITreeMapSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines Series for a TreeMap chart.
 *
 * @see {@link ITreeMapSeriesEvents} for a list of available Events
 * @see {@link ITreeMapSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export declare class TreeMapSeries extends ColumnSeries {
    /**
     * Defines the type of data fields used for the series.
     *
     * @ignore Exclude from docs
     * @type {ITreeMapSeriesDataFields}
     */
    _dataFields: ITreeMapSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ITreeMapSeriesProperties}
     */
    _properties: ITreeMapSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ITreeMapSeriesAdapters}
     */
    _adapter: ITreeMapSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {ITreeMapSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: ITreeMapSeriesEvents;
    /**
     * The level in treemap hierarchy series is at.
     *
     * @type {number}
     */
    level: number;
    /**
     * Type of the data item used by series.
     *
     * @ignore Exclude from docs
     * @type {TreeMapSeriesDataItem}
     */
    _dataItem: TreeMapSeriesDataItem;
    /**
     * A chart series belongs to.
     *
     * @ignore Exclude from docs
     * @type {TreeMap}
     */
    _chart: TreeMap;
    parentDataItem: TreeMapDataItem;
    /**
     * Constructor
     */
    constructor();
    /**
     * Processes data item.
     *
     * @param {TreeMapSeriesDataItem}  dataItem     Data item
     * @param {Object}                 dataContext  Raw data
     * @param {number}                 index        Index of the data item
     */
    protected processDataItem(dataItem: this["_dataItem"], dataContext?: Object): void;
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {TreeMapSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Shows series.
     *
     * @param  {number}     duration  Duration of fade in (ms)
     * @return {Animation}            Animation
     */
    show(duration?: number): Animation;
    /**
     * Hides series.
     *
     * @param  {number}     duration  Duration of fade out (ms)
     * @return {Animation}            Animation
     */
    hide(duration?: number): Animation;
    appear(): void;
    /**
     * Process values.
     *
     * @ignore Exclude from docs
     */
    processValues(): void;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
    /**
     * Creates elements in related legend container, that mimics the look of this
     * Series.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Legend item container
     */
    createLegendMarker(marker: Container): void;
}
