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
import { MapSeries } from "./MapSeries";
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
     * @ignore Exclude from docs
     * @type {IMapObjectProperties}
     */
    _properties: IMapObjectProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapObjectAdapters}
     */
    _adapter: IMapObjectAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapObjectEvents}
     * @ignore Exclude from docs
     */
    _events: IMapObjectEvents;
    /**
     * A map series this object belongs to.
     *
     * @type {MapSeries}
     */
    series: MapSeries;
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
