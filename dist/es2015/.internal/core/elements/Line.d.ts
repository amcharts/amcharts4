/**
 * Line drawing functionality.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../Sprite";
import { IOrientationPoint } from "../defs/IPoint";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Line]].
 */
export interface ILineProperties extends ISpriteProperties {
    /**
     * X coordinate of first end.
     *
     * @type {number}
     */
    x1?: number;
    /**
     * Y coordinate of first end.
     *
     * @type {number}
     */
    y1?: number;
    /**
     * X coordinate of second end.
     *
     * @type {number}
     */
    x2?: number;
    /**
     * Y coordinate of second end.
     *
     * @type {number}
     */
    y2?: number;
}
/**
 * Defines events for [[Line]].
 */
export interface ILineEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[Line]].
 *
 * @see {@link Adapter}
 */
export interface ILineAdapters extends ISpriteAdapters, ILineProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a line.
 *
 * @see {@link ILineEvents} for a list of available events
 * @see {@link ILineAdapters} for a list of available Adapters
 */
export declare class Line extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ILineProperties}
     */
    _properties: ILineProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ILineAdapters}
     */
    _adapter: ILineAdapters;
    /**
     * Defines available events.
     *
     * @type {ILineEvents}
     * @ignore Exclude from docs
     */
    _events: ILineEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the line.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * @return {number} X
     */
    /**
     * X coordinate of first end.
     *
     * @param {number} value X
     */
    x1: number;
    /**
     * @return {number} X
     */
    /**
     * X coordinate of second end.
     *
     * @param {number} value X
     */
    x2: number;
    /**
     * @return {number} Y
     */
    /**
     * Y coordinate of first end.
     *
     * @param {number} value Y
     */
    y1: number;
    /**
     * @return {number} Y
     */
    /**
     * Y coordinate of second end.
     *
     * @param {number} value Y
     */
    y2: number;
    /**
     * Converts relative position along the line (0-1) into pixel coordinates.
     *
     * @param  {number}             position  Position (0-1)
     * @return {IOrientationPoint}            Coordinates
     */
    positionToPoint(position: number): IOrientationPoint;
}
