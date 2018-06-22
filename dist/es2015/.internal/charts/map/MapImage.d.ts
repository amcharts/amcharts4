/**
 *
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapObject, IMapObjectProperties, IMapObjectAdapters, IMapObjectEvents } from "./MapObject";
import { MapImageSeriesDataItem, MapImageSeries } from "./MapImageSeries";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[MapImage]].
 */
export interface IMapImageProperties extends IMapObjectProperties {
    /**
     * Latitude of the image location.
     *
     * @type {number}
     */
    latitude?: number;
    /**
     * Longitude of the mage location.
     *
     * @type {number}
     */
    longitude?: number;
}
/**
 * Defines events for [[MapImage]].
 */
export interface IMapImageEvents extends IMapObjectEvents {
}
/**
 * Defines adapters for [[MapImage]].
 *
 * @see {@link Adapter}
 */
export interface IMapImageAdapters extends IMapObjectAdapters, IMapImageProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to place an image on the map.
 *
 * @see {@link IMapImageEvents} for a list of available events
 * @see {@link IMapImageAdapters} for a list of available Adapters
 */
export declare class MapImage extends MapObject {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapImageProperties}
     */
    _properties: IMapImageProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapImageAdapters}
     */
    _adapter: IMapImageAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapImageEvents}
     * @ignore Exclude from docs
     */
    _events: IMapImageEvents;
    /**
     * A related data item.
     *
     * @ignore Exclude from docs
     * @type {MapImageSeriesDataItem}
     */
    _dataItem: MapImageSeriesDataItem;
    /**
     * A map series this object belongs to.
     *
     * @type {MapImageSeries}
     */
    series: MapImageSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Latitude
     */
    /**
     * Latitude image is placed at.
     *
     * @param {number}  value  Latitude
     */
    latitude: number;
    /**
     * @return {number} Longitude
     */
    /**
     * Longitude image is placed on.
     *
     * @param {number}  value  Longitude
     */
    longitude: number;
    /**
     * Repositions the image to it's current position.
     *
     * @ignore Exclude from docs
     */
    validatePosition(): void;
}
