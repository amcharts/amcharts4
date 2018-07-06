/**
 * Map polygon module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapObject, IMapObjectProperties, IMapObjectAdapters, IMapObjectEvents } from "./MapObject";
import { MapPolygonSeriesDataItem, MapPolygonSeries } from "./MapPolygonSeries";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { Polygon } from "../../core/elements/Polygon";
/**
 * ============================f================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[MapPolygon]].
 */
export interface IMapPolygonProperties extends IMapObjectProperties {
    /**
     * Set of coordinates for the polygon.
     */
    multiGeoPolygon?: IGeoPoint[][][];
}
/**
 * Defines events for [[MapPolygon]].
 */
export interface IMapPolygonEvents extends IMapObjectEvents {
}
/**
 * Defines adapters for [[MapPolygon]].
 *
 * @see {@link Adapter}
 */
export interface IMapPolygonAdapters extends IMapObjectAdapters, IMapPolygonProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw a polygon on the map.
 *
 * @see {@link IMapPolygonEvents} for a list of available events
 * @see {@link IMapPolygonAdapters} for a list of available Adapters
 */
export declare class MapPolygon extends MapObject {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapPolygonProperties}
     */
    _properties: IMapPolygonProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapPolygonAdapters}
     */
    _adapter: IMapPolygonAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapPolygonEvents}
     * @ignore Exclude from docs
     */
    _events: IMapPolygonEvents;
    /**
     * A visual polygon element.
     *
     * @type {Polygon}
     */
    polygon: Polygon;
    /**
     * A related data item.
     *
     * @ignore Exclude from docs
     * @type {MapPolygonSeriesDataItem}
     */
    _dataItem: MapPolygonSeriesDataItem;
    /**
     * A map series this object belongs to.
     *
     * @type {MapPolygonSeries}
     */
    series: MapPolygonSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {IGeoPoint[]} Polygon coordinates
     */
    /**
     * Set of coordinates for the polygon.
     *
     * @param {IGeoPoint[][][]}  multiGeoPolygon  Polygon coordinates
     */
    multiGeoPolygon: IGeoPoint[][][];
    /**
     * (Re)validates the polygon, effectively redrawing it.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * @ignore Exclude from docs
     */
    measureElement(): void;
    /**
     * Calculated polygon center latitude.
     *
     * @readonly
     * @return {number} Center latitude
     */
    readonly latitude: number;
    /**
     * Calculated polygon center longitude.
     *
     * @readonly
     * @return {number} Center longitude
     */
    readonly longitude: number;
    /**
     * Not 100% sure about this, as if we add something to MapPolygon this
     * won't be true, but otherwise we will get all 0 and the tooltip won't
     * be positioned properly
     * @hidden
     */
    /**
     * Element's width in pixels.
     *
     * @readonly
     * @return {number} Width (px)
     */
    readonly pixelWidth: number;
    /**
     * Element's height in pixels.
     *
     * @readonly
     * @return {number} Width (px)
     */
    readonly pixelHeight: number;
}
