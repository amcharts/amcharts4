/**
 * Map line series module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapSeries, MapSeriesDataItem, IMapSeriesProperties, IMapSeriesDataFields, IMapSeriesAdapters, IMapSeriesEvents } from "./MapSeries";
import { MapChart } from "../types/MapChart";
import { MapLine } from "./MapLine";
import { ListTemplate } from "../../core/utils/List";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapLineSeries]]
 * @see {@link DataItem}
 */
export declare class MapLineSeriesDataItem extends MapSeriesDataItem {
    /**
     * A [[MapLine]] element related to this data item.
     *
     * @type {MapLine}
     */
    protected _mapLine: MapLine;
    /**
     * A collection of X/Y coordinates for a single-segment line.
     *
     * @type {number[][]}
     */
    protected _line: number[][];
    /**
     * A collection of X/Y coordinates for a multi-segment line.
     *
     * @type {number[][][]}
     */
    protected _multiLine: number[][][];
    /**
     * A collection of lat/long coordinates for a single-segment line.
     *
     * @type {IGeoPoint[]}
     */
    protected _geoLine: IGeoPoint[];
    /**
     * A collection of lat/long coordinates for a multi-segment line.
     *
     * @type {IGeoPoint[][]}
     */
    protected _multiGeoLine: IGeoPoint[][];
    /**
     * Defines a type of [[Component]] this data item is used for
     * @type {MapLineSeries}
     */
    _component: MapLineSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * A [[MapLine]] element related to this data item.
     *
     * @readonly
     * @return {MapLine} Element
     */
    readonly mapLine: MapLine;
    /**
     * @return {number[]} Coordinates
     */
    /**
     * A collection of X/Y coordinates for a single-segment line. E.g.:
     *
     * ```JSON
     * [
     *   [ 100, 150 ],
     *   [ 120, 200 ]
     * ]
     * ```
     *
     * @param {number[][]}  line  Coordinates
     */
    line: number[][];
    /**
     * @return {number[]} Coordinates
     */
    /**
     * A collection of X/Y coordinates for a multi-segment line. E.g.:
     *
     * ```JSON
     * [
     *   // Segment 1
     *   [
     *     [ 100, 150 ],
     *     [ 120, 200 ]
     *   ],
     *
     *   // Segment 2
     *   [
     *     [ 120, 200 ],
     *     [ 150, 100 ]
     *   ]
     * ]
     * ```
     *
     * @param {number[][]}  multiLine  Coordinates
     */
    multiLine: number[][][];
    /**
     * @return {IGeoPoint[]} Coordinates
     */
    /**
     * A collection of lat/long coordinates for a single-segment line. E.g.:
     *
     * ```JSON
     * [
     *   { longitude: 3.121, latitude: 0.58 },
     *   { longitude: -5.199, latitude: 21.223 }
     * ]
     * ```
     *
     * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.4} GeoJSON LineString reference
     * @param {IGeoPoint[][]}  geoLine  Coordinates
     */
    geoLine: IGeoPoint[];
    /**
     * @return {IGeoPoint[]} Coordinates
     */
    /**
     * A collection of X/Y coordinates for a multi-segment line. E.g.:
     *
     * ```JSON
     * [
     *   // Segment 1
     *   [
     *     { longitude: 3.121, latitude: 0.58 },
     *     { longitude: -5.199, latitude: 21.223 }
     *   ],
     *
     *   // Segment 2
     *   [
     *     { longitude: -5.199, latitude: 21.223 },
     *     { longitude: -12.9, latitude: 25.85 }
     *   ]
     * ]
     * ```
     *
     * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.5} GeoJSON MultiLineString reference
     * @param {IGeoPoint[][]}  multiGeoLine  Coordinates
     */
    multiGeoLine: IGeoPoint[][];
    /**
     * Updates the item's bounding coordinates: coordinates of the East, West,
     * North, and South-most points.
     *
     * @ignore Exclude from docs
     * @param {IGeoPoint[]}  geoPoints  Points of the element
     */
    updateLineExtremes(multiGeoLine: IGeoPoint[][]): void;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[MapLineSeries]].
 */
export interface IMapLineSeriesDataFields extends IMapSeriesDataFields {
    /**
     * Field name that holds line data in pixels.
     *
     * @type {string}
     */
    line?: string;
    /**
     * Field name that holds multi-line data in pixels.
     *
     * @type {string}
     */
    multiLine?: string;
    /**
     * Field name that holds line data in Geo coordinates.
     *
     * @type {string}
     */
    geoLine?: string;
    /**
     * Field name that holds multi-line data in Geo coordinates.
     *
     * @type {string}
     */
    multiGeoLine?: string;
}
/**
 * Defines properties for [[MapLineSeries]].
 */
export interface IMapLineSeriesProperties extends IMapSeriesProperties {
}
/**
 * Defines events for [[MapLineSeries]].
 */
export interface IMapLineSeriesEvents extends IMapSeriesEvents {
}
/**
 * Defines adapters for [[MapLineSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapLineSeriesAdapters extends IMapSeriesAdapters, IMapLineSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A series of map line series.
 *
 * @see {@link IMapLineSeriesEvents} for a list of available Events
 * @see {@link IMapLineSeriesAdapters} for a list of available Adapters
 * @important
 */
export declare class MapLineSeries extends MapSeries {
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IMapLineSeriesDataFields}
     */
    _dataFields: IMapLineSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapLineSeriesProperties}
     */
    _properties: IMapLineSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapLineSeriesAdapters}
     */
    _adapter: IMapLineSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapLineSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IMapLineSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {MapLineSeriesDataItem}
     */
    _dataItem: MapLineSeriesDataItem;
    /**
     * A related chart/map object, this element is drawn on.
     *
     * @type {MapChart}
     */
    chart: MapChart;
    /**
     * Defines the type of the line items in this series.
     *
     * @ignore Exclude from docs
     * @type {MapLine}
     */
    _mapLine: MapLine;
    /**
     * A list of map lins in the series.
     *
     * @type {ListTemplate<MapImage>}
     */
    protected _mapLines: ListTemplate<this["_mapLine"]>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapLineSeriesDataItem} Data Item
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
     * A list of lines in the series.
     *
     * @return {ListTemplate} Lines
     */
    readonly mapLines: ListTemplate<this["_mapLine"]>;
    /**
     * Returns a new line instance of suitable type.
     *
     * @return {MapLine} New line
     */
    protected createLine(): this["_mapLine"];
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
