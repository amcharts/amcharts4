/**
 * Module, defining Axis Renderer for vertical 3D axes.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRendererY, IAxisRendererYProperties, IAxisRendererYAdapters, IAxisRendererYEvents } from "../axes/AxisRendererY";
import { Sprite, ISpriteEvents, AMEvent } from "../../core/Sprite";
import { XYChart3D } from "../types/XYChart3D";
import { Grid } from "../axes/Grid";
import { MutableValueDisposer } from "../../core/utils/Disposer";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AxisRendererY3D]].
 */
export interface IAxisRendererY3DProperties extends IAxisRendererYProperties {
}
/**
 * Defines events for [[AxisRendererY3D]].
 */
export interface IAxisRendererY3DEvents extends IAxisRendererYEvents {
}
/**
 * Defines adapters for [[AxisRendererY3D]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererY3DAdapters extends IAxisRendererYAdapters, IAxisRendererY3DProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Renderer for vertical 3D axis.
 *
 * @see {@link IAxisRendererY3DEvents} for a list of available events
 * @see {@link IAxisRendererY3DAdapters} for a list of available Adapters
 */
export declare class AxisRendererY3D extends AxisRendererY {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IAxisRendererY3DProperties}
     */
    _properties: IAxisRendererY3DProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IAxisRendererY3DAdapters}
     */
    _adapter: IAxisRendererY3DAdapters;
    /**
     * Defines available events.
     *
     * @type {IAxisRendererY3DEvents}
     * @ignore Exclude from docs
     */
    _events: IAxisRendererY3DEvents;
    /**
     * A related chart.
     *
     * @todo Description
     * @type {MutableValueDisposer}
     */
    protected _chart: MutableValueDisposer<XYChart3D>;
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    constructor();
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    updateGridElement(grid: Grid, position: number, endPosition: number): void;
    /**
     * Updates and positions the base grid element.
     *
     * @ignore Exclude from docs
     */
    updateBaseGridElement(): void;
    /**
     * @ignore Exclude from docs
     * @return {XYChart3D} Chart
     */
    /**
     * Chart, associated with the Axis.
     *
     * @ignore Exclude from docs
     * @param {XYChart3D}  value  Chart
     */
    chart: XYChart3D;
    /**
     * Invoked when 3D-related settings change, like depth or angle.
     *
     * @param {AMEvent<Sprite, ISpriteEvents>["propertychanged"]} event Event
     */
    protected handle3DChanged(event: AMEvent<Sprite, ISpriteEvents>["propertychanged"]): void;
}
