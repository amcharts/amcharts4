/**
 * Functionality for drawing rectangles with waved edges.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Rectangle, IRectangleProperties, IRectangleAdapters, IRectangleEvents } from "./Rectangle";
import { IWavedShape } from "../defs/IWavedShape";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines available properties for [[WavedRectangle]].
 */
export interface IWavedRectangleProperties extends IRectangleProperties {
    /**
     * Wave length in pixels.
     *
     * @default 16
     * @type {number}
     */
    waveHeight?: number;
    /**
     * Wave height in pixels.
     *
     * @default 4
     * @type {number}
     */
    waveLength?: number;
    /**
     * Wave tension.
     *
     * @default 0.8
     * @type {number}
     */
    tension?: number;
}
/**
 * Defines events for [[WavedRectangle]].
 */
export interface IWavedRectangleEvents extends IRectangleEvents {
}
/**
 * Defines adapters for [[WavedRectangle]].
 *
 * @see {@link Adapter}
 */
export interface IWavedRectangleAdapters extends IRectangleAdapters, IWavedRectangleProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a rectangle with waved edges.
 *
 * @see {@link IWavedRectangleEvents} for a list of available events
 * @see {@link IWavedRectangleAdapters} for a list of available Adapters
 */
export declare class WavedRectangle extends Rectangle implements IWavedShape {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IWavedRectangleProperties}
     */
    _properties: IWavedRectangleProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IWavedRectangleAdapters}
     */
    _adapter: IWavedRectangleAdapters;
    /**
     * Defines available events.
     *
     * @type {IWavedRectangleEvents}
     * @ignore Exclude from docs
     */
    _events: IWavedRectangleEvents;
    /**
     * Top waved?
     *
     * @type {boolean}
     */
    protected _twaved: boolean;
    /**
     * Right side waved?
     *
     * @type {boolean}
     */
    protected _rwaved: boolean;
    /**
     * Bottom waved?
     *
     * @type {boolean}
     */
    protected _bwaved: boolean;
    /**
     * Left side waved?
     *
     * @type {boolean}
     */
    protected _lwaved: boolean;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the waved rectangle.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
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
     * Sets which side should be waved or not. If particular side is set to
     * `false`, a straight line will be drawn on that side.
     *
     * @param {boolean}  top     Top waved?
     * @param {boolean}  right   Right side waved?
     * @param {boolean}  bottom  Bottom Waved?
     * @param {boolean}  left    Left side waved?
     */
    setWavedSides(top: boolean, right: boolean, bottom: boolean, left: boolean): void;
    /**
     * Updates bounding box based on element dimension settings.
     *
     * @ignore Exclude from docs
     */
    measureElement(): void;
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
