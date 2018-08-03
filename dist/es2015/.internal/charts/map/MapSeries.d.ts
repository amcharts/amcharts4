/**
 * Map series module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Series, SeriesDataItem, ISeriesProperties, ISeriesDataFields, ISeriesAdapters, ISeriesEvents } from "../series/Series";
import { MapChart } from "../types/MapChart";
import { MapObject } from "./MapObject";
import { IListEvents } from "../../core/utils/List";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { DataSource } from "../../core/data/DataSource";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapSeries]].
 *
 * @see {@link DataItem}
 */
export declare class MapSeriesDataItem extends SeriesDataItem {
    /**
     * Longitude of the East-most point of the element.
     *
     * @type {number}
     */
    east: number;
    /**
     * Longitude of the West-most point of the element.
     *
     * @type {number}
     */
    west: number;
    /**
     * Latitude of the South-most point of the element.
     *
     * @type {number}
     */
    south: number;
    /**
     * Latitude of the North-most point of the element.
     *
     * @type {number}
     */
    north: number;
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {Component}
     */
    _component: MapSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Value
     */
    /**
     * Numeric value of the data item.
     *
     * Value may be used in heat-map calculations.
     *
     * @param {number}  value  Value
     */
    value: number;
    /**
     * Updates the item's bounding coordinates: coordinates of the East, West,
     * North, and South-most points.
     *
     * @ignore Exclude from docs
     * @param {IGeoPoint[]}  geoPoints  Points of the element
     */
    updateExtremes(geoPoints: IGeoPoint[]): void;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * [GEOJSONGeometry description]
 *
 * @type {string}
 * @todo Description
 */
export declare type GEOJSONGeometry = "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";
/**
 * Defines data fields for [[MapSeries]].
 *
 * @todo Alllow any number of values?
 */
export interface IMapSeriesDataFields extends ISeriesDataFields {
    /**
     * A field number in data for a numeric value of the map object.
     *
     * @type {string}
     */
    value?: string;
}
/**
 * Defines properties for [[MapSeries]].
 */
export interface IMapSeriesProperties extends ISeriesProperties {
    /**
     * A flag telling if the series should get data from `geodata` or not
     *
     * @default false
     * @type {boolean}
     */
    useGeodata?: boolean;
    /**
     * A list of object ids to include from the series.
     *
     * @type {string[]}
     */
    include?: string[];
    /**
     * A list of object ids to exclude from the series.
     *
     * @type {string[]}
     */
    exclude?: string[];
}
/**
 * Defines events for [[MapSeries]].
 */
export interface IMapSeriesEvents extends ISeriesEvents {
}
/**
 * Defines adapters for [[MapSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapSeriesAdapters extends ISeriesAdapters, IMapSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for series of map objects.
 *
 * @see {@link IMapSeriesEvents} for a list of available Events
 * @see {@link IMapSeriesAdapters} for a list of available Adapters
 * @important
 */
export declare class MapSeries extends Series {
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IMapSeriesDataFields}
     */
    _dataFields: IMapSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapSeriesProperties}
     */
    _properties: IMapSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapSeriesAdapters}
     */
    _adapter: IMapSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IMapSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {MapSeriesDataItem}
     */
    _dataItem: MapSeriesDataItem;
    /**
     * The longitude of the East-most point in the series. (out of all elements)
     *
     * @type {number}
     */
    east: number;
    /**
     * The longitude of the West-most point in the series. (out of all elements)
     *
     * @type {number}
     */
    west: number;
    /**
     * The latitude of the South-most point in the series. (out of all elements)
     *
     * @type {number}
     */
    south: number;
    /**
     * The latitude of the North-most point in the series. (out of all elements)
     *
     * @type {number}
     */
    north: number;
    /**
     * A related chart/map object, this element is drawn on.
     *
     * @type {MapChart}
     */
    chart: MapChart;
    /**
     * Map data in GeoJSON format.
     *
     * @see {@link http://geojson.org/} GeoJSON official specification
     * @type {Object}
     */
    protected _geodata: Object;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * (Re)validates series data, effectively causing the whole series to be
     * redrawn.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    /**
     * Checks whether object should be included in series.
     *
     * @param  {string[]}  includes  A list of explicitly included ids
     * @param  {string[]}  excludes  A list of explicitly excluded ids
     * @param  {string}    id        Id of the object
     * @return {boolean}             Include?
     */
    protected checkInclude(includes: string[], excludes: string[], id: string): boolean;
    /**
     * @return {boolean} Use GeoJSON data?
     */
    /**
     * Should the map extract all the data about element from the GeoJSON?
     *
     * This is especially relevant for [[MapPolygonSeries]]. If not set to `true`
     * polygon series will need to contain geographical data in itself in order
     * to be drawn.
     *
     * If this is set to `true`, series will try to extract data for its objects
     * from either chart-level `geodata` or from series' `geodata` which holds
     * map infor in GeoJSON format.
     *
     * @default false
     * @param {boolean}  value  Use GeoJSON data?
     */
    useGeodata: boolean;
    /**
     * @return {string[]} Included objects
     */
    /**
     * A list of object ids that should be explictly included in the series.
     *
     * If this is not set, the series will automatically include all of the
     * objects, available in the GeoJSON map. (minus the ones listed in
     * `exclude`)
     *
     * If you need to display only specific objects, use `include`. E.g.:
     *
     * `include = ["FR", "ES", "DE"];`
     *
     * The above will show only France, Spain, and Germany out of the whole map.
     *
     * @param {string[]}  value  Included objects
     */
    include: string[];
    /**
     * @ignore
     */
    protected processIncExc(): void;
    /**
     * @return {string[]} Excluded ids
     */
    /**
     * A list of object ids that should be excluded from the series.
     *
     * E.g. you want to include all of the areas from a GeoJSON map, except
     * Antarctica.
     *
     * You'd leave `include` empty, and set `exclude = ["AQ"]`.
     *
     * @param {string[]}  value  Excluded ids
     */
    exclude: string[];
    /**
     * Decorates a newly added object.
     *
     * @param {IListEvents<MapObject>["inserted"]} event [description]
     */
    protected handleObjectAdded(event: IListEvents<MapObject>["inserted"]): void;
    /**
     * @return {Object} GeoJSON data
     */
    /**
     * Map data in GeoJSON format.
     *
     * The series supports the following GeoJSON objects: `Point`, `LineString`,
     * `Polygon`, `MultiPoint`, `MultiLineString`, and `MultiPolygon`.
     *
     * @see {@link http://geojson.org/} Official GeoJSON format specification
     * @param {Object} geoJSON GeoJSON data
     */
    geodata: Object;
    /**
     * Returns a [[DataSource]] specifically for loading Component's data.
     *
     * @return {DataSource} Data source
     */
    /**
     * Sets a [[DataSource]] to be used for loading Component's data.
     *
     * @param {DataSource} value Data source
     */
    geodataSource: DataSource;
}
