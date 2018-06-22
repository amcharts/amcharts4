/**
 * Polyspline (smoothed line) module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Polyline, IPolylineProperties, IPolylineAdapters, IPolylineEvents } from "./Polyline";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Polyspline]].
 */
export interface IPolysplineProperties extends IPolylineProperties {
    /**
     * Horizontal tension for the spline.
     *
     * Used by the line smoothing algorithm.
     *
     * @default 0.5
     * @type {number}
     */
    tensionX: number;
    /**
     * Vertical tension for the spline.
     *
     * Used by the line smoothing algorithm.
     *
     * @default 0.5
     * @type {number}
     */
    tensionY: number;
}
/**
 * Defines events for [[Polyspline]].
 */
export interface IPolysplineEvents extends IPolylineEvents {
}
/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IPolysplineAdapters extends IPolylineAdapters, IPolysplineProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a polysline. (smoothed multi-sigment line)
 *
 * @see {@link IPolysplineEvents} for a list of available events
 * @see {@link IPolysplineAdapters} for a list of available Adapters
 */
export declare class Polyspline extends Polyline {
    /**
     * Defines available properties.
     *
     * @todo Description
     * @type {IPolysplineProperties}
     */
    _properties: IPolysplineProperties;
    /**
     * Defines available adapters.
     *
     * @todo Description
     * @type {IPolysplineAdapters}
     */
    _adapter: IPolysplineAdapters;
    /**
     * Defines available events.
     *
     * @type {IPolysplineEvents}
     * @ignore Exclude from docs
     */
    _events: IPolysplineEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * Creats and adds an SVG path for the arc.
     *
     * @ignore Exclude from docs
     */
    makePath(): void;
    /**
     * @return {number} Tension
     */
    /**
     * Horizontal tension for the spline.
     *
     * Used by the line smoothing algorithm.
     *
     * @default 0.5
     * @param {number}  value  Tension
     */
    tensionX: number;
    /**
     * @return {number} Tension
     */
    /**
     * Vertical tension for the spline.
     *
     * Used by the line smoothing algorithm.
     *
     * @default 0.5
     * @param {number}  value  Tensions
     */
    tensionY: number;
}
