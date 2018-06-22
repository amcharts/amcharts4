import { Grid, IGridProperties, IGridAdapters, IGridEvents } from "./Grid";
import { Percent } from "../../core/utils/Percent";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[GridCircular]].
 */
export interface IGridCircularProperties extends IGridProperties {
    /**
     * Inner radius of the circular grid. (absolute or relative)
     *
     * @type {number | Percent}
     */
    innerRadius: number | Percent;
    /**
     * Outer radius of the circular grid. (absolute or relative)
     *
     * @type {number | Percent}
     */
    radius: number | Percent;
}
/**
 * Defines events for [[GridCircular]].
 */
export interface IGridCircularEvents extends IGridEvents {
}
/**
 * Defines adapters for [[GridCircular]].
 *
 * @see {@link Adapter}
 */
export interface IGridCircularAdapters extends IGridAdapters, IGridCircularProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a circular grid element for circular-type axis.
 *
 * @see {@link IGridCircularEvents} for a list of available events
 * @see {@link IGridCircularAdapters} for a list of available Adapters
 * @todo Review: container is better, as we'll be able to attach something to the GridCircular, also with 3d charts we might need some additional elements
 */
export declare class GridCircular extends Grid {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IGridCircularProperties}
     */
    _properties: IGridCircularProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IGridCircularAdapters}
     */
    _adapter: IGridCircularAdapters;
    /**
     * Defines available events.
     *
     * @type {IGridCircularEvents}
     * @ignore Exclude from docs
     */
    _events: IGridCircularEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Inner radius
     */
    /**
     * Inner radius of the circular grid. (absolute or relative)
     *
     * @param {number | Percent} value Inner radius
     */
    innerRadius: number | Percent;
    /**
     * @return {number} Outer radius
     */
    /**
     * Outer radius of the circular grid. (absolute or relative)
     *
     * @param {number | Percent} value Outer radius
     */
    radius: number | Percent;
}
