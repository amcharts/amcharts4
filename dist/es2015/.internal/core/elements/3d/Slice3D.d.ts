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
     */
    depth?: number;
    /**
     * Angle of the point of view to the 3D element. (0-360)
     *
     * @default 30
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
     */
    _properties: ISlice3DProperties;
    /**
     * Defines available adapters.
     */
    _adapter: ISlice3DAdapters;
    /**
     * Defines available events.
     */
    _events: ISlice3DEvents;
    /**
     * Container element for elements of the 3D sides.
     *
     * @ignore Exclude from docs
     */
    edge: Container;
    /**
     * Side element.
     *
     * @ignore Exclude from docs
     */
    sideA: Sprite;
    /**
     * Side element.
     *
     * @ignore Exclude from docs
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
     * @return Depth (px)
     */
    /**
     * Depth (height) of the 3D slice in pixels.
     *
     * @default 20
     * @param depth  Depth (px)
     */
    depth: number;
    /**
     * @return Angle
     */
    /**
     * Angle of the point of view to the 3D element. (0-360)
     *
     * @default 30
     * @param value  Angle
     */
    angle: number;
    /**
     * @return Vertical radius (0-1)
     */
    /**
     * Vertical radius for creating skewed slices.
     *
     * This is relevant to `radius`, e.g. 0.5 will set vertical radius to half
     * the `radius`.
     *
     * @param value Vertical radius (0-1)
     */
    radiusY: number;
    /**
     * Copies all properties and related data from a different instance of Axis.
     *
     * @param source Source Axis
     */
    copyFrom(source: this): void;
}
