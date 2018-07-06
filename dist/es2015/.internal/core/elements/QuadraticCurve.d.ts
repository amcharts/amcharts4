/**
 * Functionality for drawing quadratic curves.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Line, ILineProperties, ILineAdapters, ILineEvents } from "./Line";
import { IOrientationPoint } from "../defs/IPoint";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines available properties for [[QuadraticCurve]].
 */
export interface IQuadraticCurveProperties extends ILineProperties {
    /**
     * X coordinate of control point.
     *
     * @type {number}
     */
    cpx?: number;
    /**
     * Y coordinate of control point.
     *
     * @type {number}
     */
    cpy?: number;
}
/**
 * Defines events for [[QuadraticCurve]].
 */
export interface IQuadraticCurveEvents extends ILineEvents {
}
/**
 * Defines adapters for [[QuadraticCurve]].
 *
 * @see {@link Adapter}
 */
export interface IQuadraticCurveAdapters extends ILineAdapters, IQuadraticCurveProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a waved line.
 *
 * @see {@link IQuadraticCurveEvents} for a list of available events
 * @see {@link IQuadraticCurveAdapters} for a list of available Adapters
 */
export declare class QuadraticCurve extends Line {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IQuadraticCurveProperties}
     */
    _properties: IQuadraticCurveProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IQuadraticCurveAdapters}
     */
    _adapter: IQuadraticCurveAdapters;
    /**
     * Defines available events.
     *
     * @type {IQuadraticCurveEvents}
     * @ignore Exclude from docs
     */
    _events: IQuadraticCurveEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the waved line.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * @return {number} X
     */
    /**
     * X coordinate of control point.
     *
     * @param {number} value X
     */
    cpx: number;
    /**
     * @return {number} Y
     */
    /**
     * Y coordinate of control point.
     *
     * @param {number} value Y
     */
    cpy: number;
    /**
     * Converts relative position along the line (0-1) into pixel coordinates.
     *
     * @param  {number}             position  Position (0-1)
     * @return {IOrientationPoint}            Coordinates
     */
    positionToPoint(position: number): IOrientationPoint;
}
