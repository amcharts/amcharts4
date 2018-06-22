/**
 * Map image series module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapSeries, MapSeriesDataItem, IMapSeriesProperties, IMapSeriesDataFields, IMapSeriesAdapters, IMapSeriesEvents } from "./MapSeries";
import { MapChart } from "../types/MapChart";
import { MapImage } from "./MapImage";
import { ListTemplate } from "../../core/utils/List";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapImageSeries]]
 * @see {@link DataItem}
 */
export declare class MapImageSeriesDataItem extends MapSeriesDataItem {
    /**
     * A [[MapImage]] element related to this data item.
     *
     * @type {MapImage}
     */
    protected _mapImage: MapImage;
    /**
     * [_point description]
     *
     * @todo Description
     * @type {number[]}
     */
    protected _point: number[];
    /**
     * Geographical coordinates image is placed at.
     *
     * @type {IGeoPoint}
     */
    protected _geoPoint: IGeoPoint;
    /**
     * Defines a type of [[Component]] this data item is used for
     * @type {Component}
     */
    _component: MapImageSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * A [[MapImage]] element related to this data item.
     *
     * @return {MapImage} Element
     */
    readonly mapImage: MapImage;
    /**
     * @return {number[]} [description]
     */
    /**
     * [point description]
     *
     * @todo Description
     * @param {number[]} point [description]
     */
    point: number[];
    /**
     * @return {IGeoPoint} Image coordinates
     */
    /**
     * Geographical coordinates (lat/long) image is placed at.
     *
     * @param {IGeoPoint} geoPoint Image coordinates
     */
    geoPoint: IGeoPoint;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[MapImageSeries]].
 */
export interface IMapImageSeriesDataFields extends IMapSeriesDataFields {
    /**
     * Field name that holds image point data in pixels.
     *
     * @type {string}
     */
    point?: string;
    /**
     * Field name that holds multi-image point data in pixels.
     *
     * @type {string}
     */
    multiPoint?: string;
    /**
     * Field name that holds image point data in Geo coordinates.
     *
     * @type {string}
     */
    geoPoint?: string;
    /**
     * Field name that holds multi-image point data in Geo coordinates.
     *
     * @type {string}
     */
    multiGeoPoint?: string;
}
/**
 * Defines properties for [[MapImageSeries]].
 */
export interface IMapImageSeriesProperties extends IMapSeriesProperties {
}
/**
 * Defines events for [[MapImageSeries]].
 */
export interface IMapImageSeriesEvents extends IMapSeriesEvents {
}
/**
 * Defines adapters for [[MapImageSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapImageSeriesAdapters extends IMapSeriesAdapters, IMapImageSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A series of map image (marker) elements.
 *
 * @see {@link IMapImageSeriesEvents} for a list of available Events
 * @see {@link IMapImageSeriesAdapters} for a list of available Adapters
 * @important
 */
export declare class MapImageSeries extends MapSeries {
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IMapImageSeriesDataFields}
     */
    _dataFields: IMapImageSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapImageSeriesProperties}
     */
    _properties: IMapImageSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapImageSeriesAdapters}
     */
    _adapter: IMapImageSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapImageSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IMapImageSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {MapImageSeriesDataItem}
     */
    _dataItem: MapImageSeriesDataItem;
    /**
     * A related chart/map object, this image is drawn on.
     *
     * @type {MapChart}
     */
    chart: MapChart;
    /**
     * A list of map images in the series.
     *
     * @type {ListTemplate<MapImage>}
     */
    protected _mapImages: ListTemplate<MapImage>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapImageSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * (Re)validates the data of the sries, effectively forcing it to redraw
     * all of its elements.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    /**
     * A list of map images in the series.
     *
     * @return {ListTemplate<MapImage>} Map images
     */
    readonly mapImages: ListTemplate<MapImage>;
    /**
     * (Re)validates data element, effectively triggering its redrawal.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    validateDataElement(dataItem: this["_dataItem"]): void;
    /**
     * (Re)validates the series
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Copies all properties from another instance of [[Series]].
     *
     * @param {Series}  source  Source series
     */
    copyFrom(source: this): void;
}
