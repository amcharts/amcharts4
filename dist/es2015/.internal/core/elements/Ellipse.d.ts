/**
 * Ellipse module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Circle, ICircleProperties, ICircleAdapters, ICircleEvents } from "./Circle";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Ellipse]].
 */
export interface IEllipseProperties extends ICircleProperties {
    /**
     * Vertical radius.
     *
     * It's a relative size to the `radius`.
     *
     * E.g. 0.8 will mean the height of the ellipsis will be 80% of it's
     * horizontal radius.
     *
     * @type {number}
     */
    radiusY?: number;
}
/**
 * Defines events for [[Ellipse]].
 */
export interface IEllipseEvents extends ICircleEvents {
}
/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IEllipseAdapters extends ICircleAdapters, IEllipseProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws an ellipse
 * @see {@link IEllipseEvents} for a list of available events
 * @see {@link IEllipseAdapters} for a list of available Adapters
 */
export declare class Ellipse extends Circle {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IEllipseProperties}
     */
    _properties: IEllipseProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IEllipseAdapters}
     */
    _adapter: IEllipseAdapters;
    /**
     * Defines available events.
     *
     * @type {IEllipseEvents}
     * @ignore Exclude from docs
     */
    _events: IEllipseEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the ellipsis.
     */
    protected draw(): void;
    /**
     * @return {number} Vertical radius
     */
    /**
     * Vertical radius.
     *
     * It's a relative size to the `radius`.
     *
     * E.g. 0.8 will mean the height of the ellipsis will be 80% of it's
     * horizontal radius.
     *
     * @param {number}  value  Vertical radius
     */
    radiusY: number;
    /**
     * @return {number} Horizontal radius
     */
    /**
     * Horizontal radius.
     *
     * @param {number}  value  Horizontal radius
     */
    radius: number;
}
