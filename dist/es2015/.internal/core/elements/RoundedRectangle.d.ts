/**
 * Rounded rectangle module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../Sprite";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[RoundedRectangle]].
 */
export interface IRoundedRectangleProperties extends ISpriteProperties {
    /**
     * Radius of the top-left corner in pixels.
     *
     * @default 3
     * @type {number}
     */
    cornerRadiusTopLeft?: number;
    /**
     * Radius of the top-right corner in pixels.
     *
     * @default 3
     * @type {number}
     */
    cornerRadiusTopRight?: number;
    /**
     * Radius of the bottom-right corner in pixels.
     *
     * @default 3
     * @type {number}
     */
    cornerRadiusBottomRight?: number;
    /**
     * Radius of the bottom-left corner in pixels.
     *
     * @default 3
     * @type {number}
     */
    cornerRadiusBottomLeft?: number;
}
/**
 * Defines events for [[RoundedRectangle]].
 */
export interface IRoundedRectangleEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[RoundedRectangle]].
 *
 * @see {@link Adapter}
 */
export interface IRoundedRectangleAdapters extends ISpriteAdapters, IRoundedRectangleProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a rectangle with rounded corners.
 *
 * @see {@link IRoundedRectangleEvents} for a list of available events
 * @see {@link IRoundedRectangleAdapters} for a list of available Adapters
 */
export declare class RoundedRectangle extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IRoundedRectangleProperties}
     */
    _properties: IRoundedRectangleProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IRoundedRectangleAdapters}
     */
    _adapter: IRoundedRectangleAdapters;
    /**
     * Defines available events.
     *
     * @type {IRoundedRectangleEvents}
     * @ignore Exclude from docs
     */
    _events: IRoundedRectangleEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * Sets radius for all four corners at ones.
     *
     * All numbers are in pixels.
     *
     * @param {number}  tl  Top-left corner
     * @param {number}  tr  Top-right corner
     * @param {number}  bl  Bottom-left corner
     * @param {number}  br  Bottom-right corner
     */
    cornerRadius(tl: number, tr: number, bl: number, br: number): void;
    /**
     * @return {number} Radius (px)
     */
    /**
     * Radius of the top-left corner in pixels.
     *
     * @default 3
     * @param {number}  value  Radius (px)
     */
    cornerRadiusTopLeft: number;
    /**
     * @return {number} Radius (px)
     */
    /**
     * Radius of the top-right corner in pixels.
     *
     * @default 3
     * @param {number}  value  Radius (px)
     */
    cornerRadiusTopRight: number;
    /**
     * @return {number} Radius (px)
     */
    /**
     * Radius of the bottom-right corner in pixels.
     *
     * @default 3
     * @param {number}  value  Radius (px)
     */
    cornerRadiusBottomRight: number;
    /**
     * @return {number} Radius (px)
     */
    /**
     * Radius of the bottom-left corner in pixels.
     *
     * @default 3
     * @param {number}  value  Radius (px)
     */
    cornerRadiusBottomLeft: number;
    /**
     * Measures the element.
     *
     * @ignore Exclude from docs
     */
    measureElement(): void;
}
