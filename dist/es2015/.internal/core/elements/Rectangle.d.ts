/**
 * Functionality for drawing rectangles.
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
 * Defines properties for [[Rectangle]].
 */
export interface IRectangleProperties extends ISpriteProperties {
}
/**
 * Defines events for [[Rectangle]].
 */
export interface IRectangleEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[Rectangle]].
 *
 * @see {@link Adapter}
 */
export interface IRectangleAdapters extends ISpriteAdapters, IRectangleProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw a rectangle.
 *
 * @see {@link IRectangleEvents} for a list of available events
 * @see {@link IRectangleAdapters} for a list of available Adapters
 */
export declare class Rectangle extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IRectangleProperties}
     */
    _properties: IRectangleProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IRectangleAdapters}
     */
    _adapter: IRectangleAdapters;
    /**
     * Defines available events.
     *
     * @type {IRectangleEvents}
     * @ignore Exclude from docs
     */
    _events: IRectangleEvents;
    /**
     * Constructor
     * * Creates a `<rect>` element
     * * Creates default state
     */
    constructor();
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * Updates bounding box based on element dimension settings.
     *
     * @ignore Exclude from docs
     */
    measureElement(): void;
}
