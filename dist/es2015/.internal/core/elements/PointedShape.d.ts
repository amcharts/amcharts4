/**
 * Pointed shape module.
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
 * Defines properties for [[PointedShape]].
 */
export interface IPointedShapeProperties extends ISpriteProperties {
    /**
     * A width of the pinter's (stem's) thick end (base) in pixels.
     *
     * @default 15
     * @type {number}
     */
    pointerBaseWidth?: number;
    /**
     * A length of the pinter (stem) in pixels.
     *
     * @default 10
     * @type {number}
     */
    pointerLength?: number;
    /**
     * X coordinate the shape is pointing to.
     *
     * @type {number}
     */
    pointerX?: number;
    /**
     * Y coordinate the shape is pointing to.
     *
     * @type {number}
     */
    pointerY?: number;
}
/**
 * Defines events for [[PointedShape]].
 */
export interface IPointedShapeEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[PointedShape]].
 *
 * @see {@link Adapter}
 */
export interface IPointedShapeAdapters extends ISpriteAdapters, IPointedShapeProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a shape with a pointer.
 *
 * @see {@link IPointedShapeEvents} for a list of available events
 * @see {@link IPointedShapeAdapters} for a list of available Adapters
 */
export declare class PointedShape extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IPointedShapeProperties}
     */
    _properties: IPointedShapeProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IPointedShapeAdapters}
     */
    _adapter: IPointedShapeAdapters;
    /**
     * Defines available events.
     *
     * @type {IPointedShapeEvents}
     * @ignore Exclude from docs
     */
    _events: IPointedShapeEvents;
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
     * @return {number} Width (px)
     */
    /**
     * A width of the pinter's (stem's) thick end (base) in pixels.
     *
     * @default 15
     * @param {number}  value  Width (px)
     */
    pointerBaseWidth: number;
    /**
     * @return {number} Length (px)
     */
    /**
     * A length of the pinter (stem) in pixels.
     *
     * @default 10
     * @param {number}  value  Length (px)
     */
    pointerLength: number;
    /**
     * @return {number} X
     */
    /**
     * X coordinate the shape is pointing to.
     *
     * @param {number}  value  X
     */
    pointerX: number;
    /**
     * @return {number} Y
     */
    /**
     * Y coordinate the shape is pointing to.
     *
     * @param {number}  value  Y
     */
    pointerY: number;
}
