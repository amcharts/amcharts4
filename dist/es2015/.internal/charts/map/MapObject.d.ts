/**
 * Map object module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { MapSeries, MapSeriesDataItem } from "./MapSeries";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines propeties for [[MapObject]].
 */
export interface IMapObjectProperties extends IContainerProperties {
    /**
     * A custom zoom level to use when `zoomToMapObject()` is called on this
     * map object.
     *
     * @type {number}
     */
    zoomLevel?: number;
    /**
     * A custom point to use when `zoomToMapObject()` is called on this map
     * object.
     *
     * @type {IGeoPoint}
     */
    zoomGeoPoint?: IGeoPoint;
}
/**
 * Defines events for [[MapObject]].
 */
export interface IMapObjectEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[MapObject]].
 *
 * @see {@link Adapter}
 */
export interface IMapObjectAdapters extends IContainerAdapters, IMapObjectProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for all map objects: lines, images, etc.
 *
 * @see {@link IMapObjectEvents} for a list of available events
 * @see {@link IMapObjectAdapters} for a list of available Adapters
 */
export declare class MapObject extends Container {
    /**
     * Defines available properties.
     *
     * @type {IMapObjectProperties}
     */
    _properties: IMapObjectProperties;
    /**
     * Defines available adapters.
     *
     * @type {IMapObjectAdapters}
     */
    _adapter: IMapObjectAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapObjectEvents}
     */
    _events: IMapObjectEvents;
    /**
     * A map series this object belongs to.
     *
     * @type {MapSeries}
     */
    series: MapSeries;
    _dataItem: MapSeriesDataItem;
    /**
     * Constructor
     */
    constructor();
    /**
     * (Re)validates this object, forcing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
}
