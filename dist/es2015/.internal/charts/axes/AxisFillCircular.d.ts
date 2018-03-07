/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisFill, IAxisFillProperties, IAxisFillAdapters, IAxisFillEvents } from "./AxisFill";
import { Axis } from "./Axis";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
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
     * [number description]
     *
     * @todo Description
     * @type {[type]}
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
     * Event dispacther.
     *
     * @type {AxisFillEventDispatcher<AMEvent<AxisFillCircular, IAxisFillCircularEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<AxisFillCircular, IAxisFillCircularEvents>>;
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
     * Returns current inner radius.
     *
     * @return {number} Inner radius
     */
    /**
     * Sets inner radius of the fill. Relative ([[Percent]]) or absolute (pixels).
     *
     * @param {number | Percent}  value  Inner radius
     */
    innerRadius: number | Percent;
    /**
     * Returns current outer radius.
     *
     * @return {number} Outer radius
     */
    /**
     * Sets outer radius of the fill. Relative ([[Percent]]) or absolute (pixels).
     *
     * @param {number | Percent}  value  Outer radius
     */
    radius: number | Percent;
    /**
     * Returns current corner radius.
     *
     * @return {number} Corner radius (px)
     */
    /**
     * Sets corner radius for the fill. In pixels.
     *
     * @param {number}  value  Corner radius (px)
     */
    cornerRadius: number;
}
