/**
 * HeatMapSeries module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, IColumnSeriesDataFields, IColumnSeriesProperties, IColumnSeriesAdapters, IColumnSeriesEvents, ColumnSeriesDataItem } from "./ColumnSeries";
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { Color } from "../../core/utils/Color";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[HeatMapSeries]].
 *
 * @see {@link DataItem}
 */
export declare class HeatMapSeriesDataItem extends ColumnSeriesDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {HeatMapSeries}
     */
    _component: HeatMapSeries;
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
 * Defines data fields for [[HeatMapSeries]].
 */
export interface IHeatMapSeriesDataFields extends IColumnSeriesDataFields {
}
/**
 * Defines properties for [[HeatMapSeries]].
 */
export interface IHeatMapSeriesProperties extends IColumnSeriesProperties {
    /**
 * A color to apply to columns with the lowest value.
 *
 * @type {Color}
 */
    minColor?: Color;
    /**
     * A color to apply to columns with the highest value.
     *
     * @type {Color}
     */
    maxColor?: Color;
}
/**
 * Defines events for [[HeatMapSeries]].
 */
export interface IHeatMapSeriesEvents extends IColumnSeriesEvents {
}
/**
 * Defines adapters for [[HeatMapSeries]].
 *
 * @see {@link Adapter}
 */
export interface IHeatMapSeriesAdapters extends IColumnSeriesAdapters, IHeatMapSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a cone graph.
 *
 * @see {@link IHeatMapSeriesEvents} for a list of available Events
 * @see {@link IHeatMapSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export declare class HeatMapSeries extends ColumnSeries {
    /**
     * Defines the type of data fields used for the series.
     *
     * @ignore Exclude from docs
     * @type {IHeatMapSeriesDataFields}
     */
    _dataFields: IHeatMapSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IHeatMapSeriesProperties}
     */
    _properties: IHeatMapSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IHeatMapSeriesAdapters}
     */
    _adapter: IHeatMapSeriesAdapters;
    /**
     * Event dispacther.
     *
     * @type {SpriteEventDispatcher<AMEvent<HeatMapSeries, IHeatMapSeriesEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<HeatMapSeries, IHeatMapSeriesEvents>>;
    /**
     * User-defined lowest value in the series.
     * @ignore
     * @type {number}
     */
    protected _minValue: number;
    /**
     * User-defined heighest value in the series.
     * @ignore
     * @type {number}
     */
    protected _maxValue: number;
    /**
     * previous min value
     * @ignore
     * @type {number}
     */
    protected _prevMin: number;
    /**
     * previous max value
     * @ignore
     * @type {number}
     */
    protected _prevMax: number;
    /**
     * A function which fills columns with intermediate color between minColor and maxColor if dataItem has value
     *
     * @todo Description
     * @type {function}
     */
    fillRule: (column: Sprite) => any;
    /**
     * Constructor
     */
    constructor();
    /**
     * (Re)validates the series
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Validates data item's elements.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    validateDataElementReal(dataItem: this["_dataItem"]): void;
    /**
     * @return {Color} Lowest color
     */
    /**
     * Color for the lowest value in a heat map.
     *
     * In heat map, each object will be colored with an intermediate color
     * between `minColor` and `maxColor` based on their `value` position between
     * `min` and `max`.
     *
     * @param {Color}  value  Lowest color
     */
    minColor: Color;
    /**
     * @return {Color} Highest color
     */
    /**
     * Color for the highest value in a heat map.
     *
     * In heat map, each object will be colored with an intermediate color
     * between `minColor` and `maxColor` based on their `value` position between
     * `min` and `max`.
     *
     * @param {Color}  value  Highest color
     */
    maxColor: Color;
    /**
     * @return {number} Highest value
     */
    /**
     * User-defined highest value in the series.
     *
     * If not set, the map will use the highest `value` out of actual items in
     * the series.
     *
     * This is used to determine object's color in a heat map.
     *
     * @param {number}  value  Highest value
     */
    maxValue: number;
    /**
     * @return {number} Lowest value
     */
    /**
     * User-defined lowest value in the series.
     *
     * If not set, the map will use the lowest `value` out of actual items in
     * the series.
     *
     * This is used to determine object's color in a heat map.
     *
     * @param {number}  value  Lowest value
     */
    minValue: number;
}
