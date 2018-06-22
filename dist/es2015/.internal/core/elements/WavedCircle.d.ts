/**
 * Functionality for drawing waved circles.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Circle, ICircleProperties, ICircleAdapters, ICircleEvents } from "./Circle";
import { IWavedShape } from "../defs/IWavedShape";
import { IPoint } from "../defs/IPoint";
import { Percent } from "../utils/Percent";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[WavedCircle]].
 */
export interface IWavedCircleProperties extends ICircleProperties {
    /**
     * Wave length in pixels.
     *
     * @default 16
     * @type {number}
     */
    waveLength?: number;
    /**
     * Wave height in pixels.
     *
     * @default 4
     * @type {number}
     */
    waveHeight?: number;
    /**
     * Wave tension.
     *
     * @default 0.8
     * @type {number}
     */
    tension?: number;
    /**
     * Inner radius of the circle in pixels.
     *
     * @type {number | Percent}
     */
    innerRadius?: number | Percent;
}
/**
 * Defines events for [[WavedCircle]].
 */
export interface IWavedCircleEvents extends ICircleEvents {
}
/**
 * Defines adapters for [[WavedCircle]].
 *
 * @see {@link Adapter}
 */
export interface IWavedCircleAdapters extends ICircleAdapters, IWavedCircleProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a waved circle.
 *
 * @see {@link IWavedCircleEvents} for a list of available events
 * @see {@link IWavedCircleAdapters} for a list of available Adapters
 */
export declare class WavedCircle extends Circle implements IWavedShape {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IWavedCircleProperties}
     */
    _properties: IWavedCircleProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IWavedCircleAdapters}
     */
    _adapter: IWavedCircleAdapters;
    /**
     * Defines available events.
     *
     * @type {IWavedCircleEvents}
     * @ignore Exclude from docs
     */
    _events: IWavedCircleEvents;
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
     * Returns points that circle consists of.
     *
     * @param  {number}    radius  Radius (px)
     * @return {IPoint[]}          Points
     */
    protected getPoints(radius: number): IPoint[];
    /**
     * @return {number} Inner radius
     */
    /**
     * Inner radius of the circle in pixels (absolute) or [[Percent]] (relative).
     *
     * @param {number | Percent}  value  Inner radius
     */
    innerRadius: number | Percent;
    /**
     * Calculated inner radius of the circle in pixels.
     *
     * @readonly
     * @return {number} Inner radius (px)
     */
    readonly pixelInnerRadius: number;
    /**
     * @return {number} Wave length (px)
     */
    /**
     * Wave length in pixels.
     *
     * @default 16
     * @param {number}  value  Wave length (px)
     */
    waveLength: number;
    /**
     * @return {number} Wave height (px)
     */
    /**
     * Wave height in pixels.
     *
     * @default 4
     * @param {number}  value  Wave height (px)
     */
    waveHeight: number;
    /**
     * @return {number} Tension
     */
    /**
     * Tension of the wave.
     *
     * @default 0.8
     * @param {number}  value  Tension
     */
    tension: number;
}
