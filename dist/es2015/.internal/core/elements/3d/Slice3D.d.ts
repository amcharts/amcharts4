/**
 * 3D slice module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Slice, ISliceProperties, ISliceAdapters, ISliceEvents } from "../Slice";
import { Sprite } from "../../Sprite";
import { Container } from "../../Container";
/**
 * Defines properties for [[Slice3D]].
 */
export interface ISlice3DProperties extends ISliceProperties {
    /**
     * Depth (height) of the 3D slice in pixels.
     *
     * @default 20
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
 * Defines events for [[Slice3D]].
 */
export interface ISlice3DEvents extends ISliceEvents {
}
/**
 * Defines adapters for [[Slice3D]].
 *
 * @see {@link Adapter}
 */
export interface ISlice3DAdapters extends ISliceAdapters, ISlice3DProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw a 3D slice of a Pie chart.
 *
 * @see {@link ISlice3DEvents} for a list of available events
 * @see {@link ISlice3DAdapters} for a list of available Adapters
 */
export declare class Slice3D extends Slice {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ISlice3DProperties}
     */
    _properties: ISlice3DProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ISlice3DAdapters}
     */
    _adapter: ISlice3DAdapters;
    /**
     * Defines available events.
     *
     * @type {ISlice3DEvents}
     * @ignore Exclude from docs
     */
    _events: ISlice3DEvents;
    /**
     * Container element for elements of the 3D sides.
     *
     * @ignore Exclude from docs
     * @type {Container}
     */
    edge: Container;
    /**
     * Side element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    sideA: Sprite;
    /**
     * Side element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    sideB: Sprite;
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
     * Depth (height) of the 3D slice in pixels.
     *
     * @default 20
     * @param {number}  depth  Depth (px)
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
    radiusY: number;
}
