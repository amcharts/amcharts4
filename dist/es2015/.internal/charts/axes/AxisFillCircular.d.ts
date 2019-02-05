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
     */
    innerRadius?: number | Percent;
    /**
     * Outer radius. Relative or absolute.
     */
    radius?: number | Percent;
    /**
     * Corner radius for the fill. In pixels.
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
     */
    _properties: IAxisFillCircularProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IAxisFillCircularAdapters;
    /**
     * Defines available events.
     */
    _events: IAxisFillCircularEvents;
    /**
     * An SVG path, used to draw fill shape.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    fillPath: string;
    /**
     * Constructor.
     *
     * @param axis Axis
     */
    constructor(axis: Axis);
    /**
     * Draws the fill element.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * @return Inner radius
     */
    /**
     * Inner radius of the fill. Relative ([[Percent]]) or absolute (pixels).
     *
     * @param value  Inner radius
     */
    innerRadius: number | Percent;
    /**
     * @return Outer radius
     */
    /**
     * Outer radius of the fill. Relative ([[Percent]]) or absolute (pixels).
     *
     * @param value  Outer radius
     */
    radius: number | Percent;
    /**
     * @return Corner radius (px)
     */
    /**
     * Corner radius for the fill. In pixels.
     *
     * @param value  Corner radius (px)
     */
    cornerRadius: number;
}
