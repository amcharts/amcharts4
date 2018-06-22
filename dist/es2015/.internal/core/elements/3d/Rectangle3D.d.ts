/**
 * Creates a 3D rectangle.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../Container";
import { Sprite } from "../../Sprite";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Rectangle3D]].
 */
export interface Rectangle3DProperties extends IContainerProperties {
    /**
     * Depth (Z dimension) of the 3D rectangle in pixels.
     *
     * @default 30
     * @type {number}
     */
    depth?: number;
    /**
     * Angle of the point of view to the 3D element. (0-360)
     *
     * @default 30
     * @type {number}
     */
    angle?: number;
}
/**
 * Defines events for [[Rectangle3D]]
 */
export interface Rectangle3DEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[Rectangle3D]].
 *
 * @see {@link Adapter}
 */
export interface Rectangle3DAdapters extends IContainerAdapters, Rectangle3DProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Builds a 3D rectangle
 * @see {@link IRectangle3DEvents} for a list of available events
 * @see {@link IRectangle3DAdapters} for a list of available Adapters
 */
export declare class Rectangle3D extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {Rectangle3DProperties}
     */
    _properties: Rectangle3DProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {Rectangle3DAdapters}
     */
    _adapter: Rectangle3DAdapters;
    /**
     * Defines available events.
     *
     * @type {Rectangle3DEvents}
     * @ignore Exclude from docs
     */
    _events: Rectangle3DEvents;
    /**
     * Left side element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    sideLeft: Sprite;
    /**
     * Right side element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    sideRight: Sprite;
    /**
     * Top element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    sideTop: Sprite;
    /**
     * Bottom element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    sideBottom: Sprite;
    /**
     * Back element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    sideBack: Sprite;
    /**
     * Front element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    sideFront: Sprite;
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
     * @return {number} Depth (px)
     */
    /**
     * Depth (Z dimension) of the 3D rectangle in pixels.
     *
     * @default 30
     * @param {number}  value  Depth (px)
     */
    depth: number;
    /**
     * @return {number} Angle
     */
    /**
     * Angle of the point of view to the 3D element. (0-360)
     *
     * @default 30
     * @param {number}  value  Angle
     */
    angle: number;
}
