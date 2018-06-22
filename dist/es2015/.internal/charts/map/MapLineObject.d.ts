/**
 * Map line module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { MapLine } from "./MapLine";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[MapLineObject]].
 */
export interface IMapLineObjectProperties extends IContainerProperties {
    /**
     * [number description]
     *
     * @todo Description
     * @type {number}
     */
    position?: number;
    /**
     * [boolean description]
     *
     * @todo Description
     * @type {boolean}
     */
    adjustRotation?: boolean;
}
/**
 * Defines events for [[MapLineObject]].
 */
export interface IMapLineObjectEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[MapLineObject]].
 *
 * @see {@link Adapter}
 */
export interface IMapLineObjectAdapters extends IContainerAdapters, IMapLineObjectProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a line on the map.
 *
 * @see {@link IMapLineObjectEvents} for a list of available events
 * @see {@link IMapLineObjectAdapters} for a list of available Adapters
 */
export declare class MapLineObject extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapLineObjectProperties}
     */
    _properties: IMapLineObjectProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapLineObjectAdapters}
     */
    _adapter: IMapLineObjectAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapLineObjectEvents}
     * @ignore Exclude from docs
     */
    _events: IMapLineObjectEvents;
    /**
     * [mapLine description]
     *
     * @todo Description
     * @todo Review if necessary (same as parent)
     * @type {MapLine}
     */
    mapLine: MapLine;
    /**
     * Constructor
     */
    constructor();
    /**
     * (Re)validates element's position.
     *
     * @ignore Exclude from docs
     */
    validatePosition(): void;
    /**
     * @return {number} [description]
     */
    /**
     * [position description]
     *
     * @todo Description
     * @param {number} value [description]
     */
    position: number;
    /**
     * @return {boolean} [description]
     */
    /**
     * [adjustRotation description]
     *
     * @todo Description
     * @param {boolean} value [description]
     */
    adjustRotation: boolean;
}
