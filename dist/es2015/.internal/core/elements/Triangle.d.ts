/**
 * Functionality for drawing triangles.
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
 * Defines properties for [[Triangle]].
 */
export interface ITriangleProperties extends ISpriteProperties {
    direction: "left" | "right" | "top" | "bottom";
}
/**
 * Defines events for [[Triangle]].
 */
export interface ITriangleEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[Triangle]].
 *
 * @see {@link Adapter}
 */
export interface ITriangleAdapters extends ISpriteAdapters, ITriangleProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw a triangle.
 *
 * @see {@link ITriangleEvents} for a list of available events
 * @see {@link ITriangleAdapters} for a list of available Adapters
 */
export declare class Triangle extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ITriangleProperties}
     */
    _properties: ITriangleProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ITriangleAdapters}
     */
    _adapter: ITriangleAdapters;
    /**
     * Defines available events.
     *
     * @type {ITriangleEvents}
     * @ignore Exclude from docs
     */
    _events: ITriangleEvents;
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
     * Returns direction of a triangle
     *
     * @return {"left" | "right" | "top" | "bottom"} value
     */
    /**
     * Sets direction of a triangle
     *
     * @param {"left" | "right" | "top" | "bottom"} value
     */
    direction: "left" | "right" | "top" | "bottom";
}
