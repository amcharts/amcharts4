/**
 * Map arc series module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapLineSeries, MapLineSeriesDataItem, IMapLineSeriesProperties, IMapLineSeriesDataFields, IMapLineSeriesAdapters, IMapLineSeriesEvents } from "./MapLineSeries";
import { MapArc } from "./MapArc";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapArcSeries]].
 *
 * @see {@link DataItem}
 */
export declare class MapArcSeriesDataItem extends MapLineSeriesDataItem {
    /**
     * A [[MapArc]] element related to this data item.
     *
     * @type {MapArc}
     */
    protected _mapLine: MapArc;
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {Component}
     */
    _component: MapArcSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * A [[MapArc]] element related to this data item.
     *
     * @return {MapArc} Element
     */
    readonly mapLine: MapArc;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[MapArcSeries]].
 */
export interface IMapArcSeriesDataFields extends IMapLineSeriesDataFields {
}
/**
 * Defines properties for [[MapArcSeries]].
 */
export interface IMapArcSeriesProperties extends IMapLineSeriesProperties {
}
/**
 * Defines events for [[MapArcSeries]].
 */
export interface IMapArcSeriesEvents extends IMapLineSeriesEvents {
}
/**
 * Defines adapters for [[MapArcSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapArcSeriesAdapters extends IMapLineSeriesAdapters, IMapArcSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A series of arc elements. (curved lines)
 *
 * @see {@link IMapArcSeriesEvents} for a list of available Events
 * @see {@link IMapArcSeriesAdapters} for a list of available Adapters
 * @important
 */
export declare class MapArcSeries extends MapLineSeries {
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IMapArcSeriesDataFields}
     */
    _dataFields: IMapArcSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapArcSeriesProperties}
     */
    _properties: IMapArcSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapArcSeriesAdapters}
     */
    _adapter: IMapArcSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapArcSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IMapArcSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {MapArcSeriesDataItem}
     */
    _dataItem: MapArcSeriesDataItem;
    /**
     * Defines the type of the line items in this series.
     *
     * @ignore Exclude from docs
     * @type {MapArc}
     */
    _mapLine: MapArc;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapArcSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Returns a new line instance of suitable type.
     *
     * @return {MapArc} New line
     */
    protected createLine(): this["_mapLine"];
}
