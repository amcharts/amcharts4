/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisFill, IAxisFillProperties, IAxisFillAdapters, IAxisFillEvents } from "./AxisFill";
import { Axis } from "./Axis";
import { Percent } from "../../core/utils/Percent";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AxisFillCircular]].
 */
export interface IAxisFillCircularProperties extends IAxisFillProperties {
    /**
     * Inner radius. Relative ir absolute.
     *
     * @type {number | Percent}
     */
    innerRadius?: number | Percent;
    /**
     * Outer radius. Relative or absolute.
     *
     * @type {number | Percent}
     */
    radius?: number | Percent;
    /**
     * Corner radius for the fill. In pixels.
     *
     * @type {number}
     */
    cornerRadius?: number;
}
/**
 * Defines events for [[AxisFillCircular]].
 */
export interface IAxisFillCircularEvents extends IAxisFillEvents {
}
/**
 * Defines adapters for [[AxisFillCircular]].
 *
 * @see {@link Adapter}
 */
export interface IAxisFillCircularAdapters extends IAxisFillAdapters, IAxisFillCircularProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Provides fill element functionality for circular Axes.
 *
 * @see {@link IAxisFillCircularEvents} for a list of available events
 * @see {@link IAxisFillCircularAdapters} for a list of available Adapters
 * @todo Needs description
 */
export declare class AxisFillCircular extends AxisFill {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IAxisFillCircularProperties}
     */
    _properties: IAxisFillCircularProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IAxisFillCircularAdapters}
     */
    _adapter: IAxisFillCircularAdapters;
    /**
     * Defines available events.
     *
     * @type {IAxisFillCircularEvents}
     * @ignore Exclude from docs
     */
    _events: IAxisFillCircularEvents;
    /**
     * An SVG path, used to draw fill shape.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @type {string}
     */
    fillPath: string;
    /**
     * Constructor.
     *
     * @param {Axis} axis Axis
     */
    constructor(axis: Axis);
    /**
     * Draws the fill element.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * @return {number} Inner radius
     */
    /**
     * Inner radius of the fill. Relative ([[Percent]]) or absolute (pixels).
     *
     * @param {number | Percent}  value  Inner radius
     */
    innerRadius: number | Percent;
    /**
     * @return {number} Outer radius
     */
    /**
     * Outer radius of the fill. Relative ([[Percent]]) or absolute (pixels).
     *
     * @param {number | Percent}  value  Outer radius
     */
    radius: number | Percent;
    /**
     * @return {number} Corner radius (px)
     */
    /**
     * Corner radius for the fill. In pixels.
     *
     * @param {number}  value  Corner radius (px)
     */
    cornerRadius: number;
}
