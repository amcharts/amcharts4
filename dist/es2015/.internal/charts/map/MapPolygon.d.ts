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
     */
    _properties: IMapPolygonProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IMapPolygonAdapters;
    /**
     * Defines available events.
     */
    _events: IMapPolygonEvents;
    /**
     * A visual polygon element.
     */
    polygon: Polygon;
    /**
     * A related data item.
     */
    _dataItem: MapPolygonSeriesDataItem;
    /**
     * A map series this object belongs to.
     */
    series: MapPolygonSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return Polygon coordinates
     */
    /**
     * Set of coordinates for the polygon.
     *
     * @param multiGeoPolygon  Polygon coordinates
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
     * @return Center latitude
     */
    readonly latitude: number;
    /**
     * Calculated polygon center longitude.
     *
     * @readonly
     * @return Center longitude
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
     * @return Width (px)
     */
    readonly pixelWidth: number;
    /**
     * Element's height in pixels.
     *
     * @readonly
     * @return Width (px)
     */
    readonly pixelHeight: number;
}
