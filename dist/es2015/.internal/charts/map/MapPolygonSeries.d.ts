/**
 * Map polygon series module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapSeries, MapSeriesDataItem, IMapSeriesProperties, IMapSeriesDataFields, IMapSeriesAdapters, IMapSeriesEvents } from "./MapSeries";
import { MapChart } from "../types/MapChart";
import { MapPolygon } from "./MapPolygon";
import { ListTemplate } from "../../core/utils/List";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapPolygonSeries]]
 * @see {@link DataItem}
 */
export declare class MapPolygonSeriesDataItem extends MapSeriesDataItem {
    /**
     * A [[MapPolygon]] element related to this data item.
     *
     * @type {MapPolygon}
     */
    protected _mapPolygon: MapPolygon;
    /**
     * A collection of X/Y coordinates for a single polygon.
     *
     * @type {number[][][]}
     */
    protected _polygon: number[][][];
    /**
     * A collection of X/Y coordinates for a multi-part polygon.
     *
     * @type {number[][][][]}
     */
    protected _multiPolygon: number[][][][];
    /**
     * A collection of lat/long coordinates for a single polygon.
     *
     * @type {IGeoPoint[][]}
     */
    protected _geoPolygon: IGeoPoint[][];
    /**
     * A collection of lat/long coordinates for a multi-part polygon.
     *
     * @type {IGeoPoint[][][]}
     */
    protected _multiGeoPolygon: IGeoPoint[][][];
    /**
     * Defines a type of [[Component]] this data item is used for
     * @type {MapPolygonSeries}
     */
    _component: MapPolygonSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * A [[MapPolygon]] element related to this data item.
     *
     * @readonly
     * @return {MapPolygon} Element
     */
    readonly mapPolygon: MapPolygon;
    /**
     * @return {number[]} Coordinates
     */
    /**
     * A collection of X/Y coordinates for a single polygon. E.g.:
     *
     * ```JSON
     * [
     *   [
     *     [ 100, 150 ],
     *     [ 120, 200 ],
     *     [ 150, 200 ],
     *     [ 170, 240 ],
     *     [ 100, 150 ]
     *   ]
     * ]
     * ```
     *
     * @param {number[][][]}  polygon  Coordinates
     */
    polygon: number[][][];
    /**
     * @return {number[]} Coordinates
     */
    /**
     * A collection of X/Y coordinates for a multi-part polygon. E.g.:
     *
     * ```JSON
     * [
     *   // Part 1
     *   [
     *     [
     *       [ 100, 150 ],
     *       [ 120, 200 ],
     *       [ 150, 220 ],
     *       [ 170, 240 ],
     *       [ 100, 150 ]
     *     ]
     *   ],
     *
     *   // Part 2
     *   [
     *     [
     *       [ 300, 350 ],
     *       [ 320, 400 ],
     *       [ 350, 420 ],
     *       [ 370, 440 ],
     *       [ 300, 350 ]
     *     ]
     *   ]
     * ]
     * ```
     *
     * @param {number[][][]}  multiPolygon  Coordinates
     */
    multiPolygon: number[][][][];
    /**
     * @return {IGeoPoint[]} Coordinates
     */
    /**
     * A collection of lat/long coordinates for a single polygon. E.g.:
     *
     * ```JSON
     * [
     *   [
     *     { latitude: -10.0, longitude: -10.0 },
     *     { latitude: 10.0, longitude: -10.0 },
     *     { latitude: 10.0, longitude: 10.0 },
     *     { latitude: -10.0, longitude: -10.0 }
     *   ]
     * ]
     * ```
     *
     * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.6} GeoJSON Polygon reference
     * @param {IGeoPoint[][]}  geoPolygon  Coordinates
     */
    geoPolygon: IGeoPoint[][];
    /**
     * @return {IGeoPoint[]} Coordinates
     */
    /**
     * A collection of lat/long coordinates for a multi-part polygon. E.g.:
     *
     * ```JSON
     * [
     *   [
     *     [
     *       { longitude: 180.0, latitude: 40.0 },
     *       { longitude: 180.0, latitude: 50.0 },
     *       { longitude: 170.0, latitude: 50.0 },
     *       { longitude: 170.0, latitude: 40.0 },
     *       { longitude: 180.0, latitude: 40.0 }
     *     ]
     *   ],
     *   [
     *     [
     *       { longitude: -170.0, latitude: 40.0 },
     *       { longitude: -170.0, latitude: 50.0 },
     *       { longitude: -180.0, latitude: 50.0 },
     *       { longitude: -180.0, latitude: 40.0 },
     *       { longitude: -170.0, latitude: 40.0 }
     *     ]
     *   ]
     * ]
     * ```
     *
     * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.7} GeoJSON MultiPolygon reference
     * @param {IGeoPoint[][][]}  multiGeoPolygon  Coordinates
     */
    multiGeoPolygon: IGeoPoint[][][];
    /**
     * Updates the item's bounding coordinates: coordinates of the East, West,
     * North, and South-most points.
     *
     * @ignore Exclude from docs
     * @param {IGeoPoint[]}  geoPoints  Points of the element
     */
    updateAreaExtremes(multiGeoPolygon: IGeoPoint[][][]): void;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[MapPolygonSeries]].
 */
export interface IMapPolygonSeriesDataFields extends IMapSeriesDataFields {
    /**
     * Field name that holds polygon pixels.
     *
     * @type {string}
     */
    polygon?: string;
    /**
     * Field name that holds multi-polygon pixels.
     *
     * @type {string}
     */
    multiPolygon?: string;
    /**
     * Field name that holds polygon data in Geo coordinates.
     *
     * @type {string}
     */
    geoPolygon?: string;
    /**
     * Field name that holds poly-polygon data in Geo coordinates.
     *
     * @type {string}
     */
    multiGeoPolygon?: string;
}
/**
 * Defines properties for [[MapPolygonSeries]].
 */
export interface IMapPolygonSeriesProperties extends IMapSeriesProperties {
}
/**
 * Defines events for [[MapPolygonSeries]].
 */
export interface IMapPolygonSeriesEvents extends IMapSeriesEvents {
}
/**
 * Defines adapters for [[MapPolygonSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapPolygonSeriesAdapters extends IMapSeriesAdapters, IMapPolygonSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A series of map polygon elements.
 *
 * @see {@link IMapPolygonSeriesEvents} for a list of available Events
 * @see {@link IMapPolygonSeriesAdapters} for a list of available Adapters
 * @important
 */
export declare class MapPolygonSeries extends MapSeries {
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IMapPolygonSeriesDataFields}
     */
    _dataFields: IMapPolygonSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapPolygonSeriesProperties}
     */
    _properties: IMapPolygonSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapPolygonSeriesAdapters}
     */
    _adapter: IMapPolygonSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapPolygonSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IMapPolygonSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {MapPolygonSeriesDataItem}
     */
    _dataItem: MapPolygonSeriesDataItem;
    /**
     * A related chart/map object, this element is drawn on.
     *
     * @type {MapChart}
     */
    chart: MapChart;
    /**
     * A list of map polygons in the series.
     *
     * @type {ListTemplate<MapImage>}
     */
    protected _mapPolygons: ListTemplate<MapPolygon>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapPolygonSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * @ignore
     */
    protected processIncExc(): void;
    /**
     * (Re)validates series data, effectively causing the whole series to be
     * redrawn.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    /**
     * (Re)validates the series
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * List of polygon elements in the series.
     *
     * @return {ListTemplate<MapPolygon>} Polygon list
     */
    readonly mapPolygons: ListTemplate<MapPolygon>;
    /**
     * returns MapPolygon by id in geoJSON file
     * @param {string} polygon id
     * @return {MapPolygon}
     */
    getPolygonById(id: string): MapPolygon;
    /**
     * Copies all properties from another instance of [[Series]].
     *
     * @param {Series}  source  Source series
     */
    copyFrom(source: this): void;
}
