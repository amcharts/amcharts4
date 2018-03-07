/**
 * Module for a multi-part arched line.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Polyline, IPolylineProperties, IPolylineAdapters, IPolylineEvents } from "./Polyline";
import { SpriteEventDispatcher, AMEvent } from "../Sprite";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Polyarc]].
 */
export interface IPolyarcProperties extends IPolylineProperties {
    /**
     * Relative position along the line the control point is. (0-1)
     *
     * @default 0.5
     * @type {number}
     */
    controlPointPosition: number;
    /**
     * Relative distance of the control point. (0-1)
     *
     * Default is half the length of the line. (0.5)
     *
     * @default 0.5
     * @type {number}
     */
    controlPointDistance: number;
}
/**
 * Defines events for [[Polyarc]].
 */
export interface IPolyarcEvents extends IPolylineEvents {
}
/**
 * Defines adapters for [[Polyarc]].
 *
 * @see {@link Adapter}
 */
export interface IPolyarcAdapters extends IPolylineAdapters, IPolyarcProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a multi-part arched line.
 *
 * @see {@link IPolyarcEvents} for a list of available events
 * @see {@link IPolyarcAdapters} for a list of available Adapters
 */
export declare class Polyarc extends Polyline {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IPolyarcProperties}
     */
    _properties: IPolyarcProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IPolyarcAdapters}
     */
    _adapter: IPolyarcAdapters;
    /**
     * Event dispatcher.
     *
     * @type {SpriteEventDispatcher<AMEvent<Polyarc, IPolyarcEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<Polyarc, IPolyarcEvents>>;
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
     * @return {number} Position (0-1)
     */
    /**
     * Relative position along the line the control point is. (0-1)
     *
     * @default 0.5
     * @param {number}  value  Position (0-1)
     */
    controlPointPosition: number;
    /**
     * @return {number} Distance (0-1)
     */
    /**
     * Relative distance of the control point. (0-1)
     *
     * Default is half the length of the line. (0.5)
     *
     * @default 0.5
     * @param {number}  value  Distance (0-1)
     */
    controlPointDistance: number;
}
