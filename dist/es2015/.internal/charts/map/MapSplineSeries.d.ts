/**
 * Map spline series module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapLineSeries, MapLineSeriesDataItem, IMapLineSeriesProperties, IMapLineSeriesDataFields, IMapLineSeriesAdapters, IMapLineSeriesEvents } from "./MapLineSeries";
import { MapSpline } from "./MapSpline";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapSplineSeries]]
 * @see {@link DataItem}
 */
export declare class MapSplineSeriesDataItem extends MapLineSeriesDataItem {
    /**
     * A [[MapSpline]] element related to this data item.
     *
     * @type {MapSpline}
     */
    protected _mapLine: MapSpline;
    /**
     * Defines a type of [[Component]] this data item is used for
     * @type {Component}
     */
    _component: MapSplineSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * A [[MapSpline]] element related to this data item.
     *
     * @return {MapSpline} Element
     */
    readonly mapLine: MapSpline;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[MapSplineSeries]].
 */
export interface IMapSplineSeriesDataFields extends IMapLineSeriesDataFields {
}
/**
 * Defines properties for [[MapSplineSeries]].
 */
export interface IMapSplineSeriesProperties extends IMapLineSeriesProperties {
}
/**
 * Defines events for [[MapSplineSeries]].
 */
export interface IMapSplineSeriesEvents extends IMapLineSeriesEvents {
}
/**
 * Defines adapters for [[MapSplineSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapSplineSeriesAdapters extends IMapLineSeriesAdapters, IMapSplineSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A series of map spline elements.
 *
 * @see {@link IMapSplineSeriesEvents} for a list of available Events
 * @see {@link IMapSplineSeriesAdapters} for a list of available Adapters
 * @important
 */
export declare class MapSplineSeries extends MapLineSeries {
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IMapSplineSeriesDataFields}
     */
    _dataFields: IMapSplineSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapSplineSeriesProperties}
     */
    _properties: IMapSplineSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapSplineSeriesAdapters}
     */
    _adapter: IMapSplineSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapSplineSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IMapSplineSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {MapSplineSeriesDataItem}
     */
    _dataItem: MapSplineSeriesDataItem;
    /**
     * Defines the type of the line items in this series.
     *
     * @ignore Exclude from docs
     * @type {MapSpline}
     */
    _mapLine: MapSpline;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapSplineSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Returns a new line instance of suitable type.
     *
     * @return {MapSpline} New line
     */
    protected createLine(): this["_mapLine"];
}
