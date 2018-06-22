/**
 * Module, defining Axis Renderer for circular axes.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRenderer, IAxisRendererProperties, IAxisRendererAdapters, IAxisRendererEvents } from "./AxisRenderer";
import { Axis } from "./Axis";
import { AxisFillCircular } from "./AxisFillCircular";
import { IPoint } from "../../core/defs/IPoint";
import { AxisTick } from "./AxisTick";
import { GridCircular } from "./GridCircular";
import { AxisLabelCircular } from "./AxisLabelCircular";
import { Percent } from "../../core/utils/Percent";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AxisRendererCircular]].
 */
export interface IAxisRendererCircularProperties extends IAxisRendererProperties {
    /**
     * Start angle of the circular axis.
     *
     * @todo Description (units)
     * @type {number}
     */
    startAngle?: number;
    /**
     * End angle of the circular axis.
     *
     * @todo Description (units)
     * @type {number}
     */
    endAngle?: number;
    /**
     * Outer radius of the circular axis.
     *
     * Can either be absolute (pixels) or relative ([[Percent]]).
     *
     * @type {number | Percent}
     */
    radius?: number | Percent;
    /**
     * Inner radius of the circular axis.
     *
     * Can either be absolute (pixels) or relative ([[Percent]]).
     *
     * @type {number | Percent}
     */
    innerRadius?: number | Percent;
}
/**
 * Defines events for [[AxisRendererCircular]].
 */
export interface IAxisRendererCircularEvents extends IAxisRendererEvents {
}
/**
 * Defines adapters for [[AxisRenderer]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererCircularAdapters extends IAxisRendererAdapters, IAxisRendererCircularProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A renderer for circular axis.
 */
export declare class AxisRendererCircular extends AxisRenderer {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IAxisRendererProperties}
     */
    _properties: IAxisRendererCircularProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IAxisRendererAdapters}
     */
    _adapter: IAxisRendererCircularAdapters;
    /**
     * Defines available events.
     *
     * @type {IAxisRendererCircularEvents}
     * @ignore Exclude from docs
     */
    _events: IAxisRendererCircularEvents;
    /**
     * Defines type of the grid elements.
     *
     * @ignore Exclude from docs
     * @type {GridCircular}
     */
    _gridType: GridCircular;
    /**
     * Defines type for the fill elements.
     *
     * @ignore Exclude from docs
     * @type {AxisFillCircular}
     */
    _fillType: AxisFillCircular;
    /**
     * Defines type for the label elements.
     *
     * @ignore Exclude from docs
     * @type {AxisLabelCircular}
     */
    _labelType: AxisLabelCircular;
    /**
     * @ignore
     */
    pixelRadiusReal: number;
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    constructor();
    /**
    * @ignore
    */
    setAxis(axis: Axis): void;
    /**
     * Validates Axis renderer.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    validate(): void;
    /**
     * Returns actual length of the Axis, in pixels.
     *
     * @return {number} Length (px)
     */
    readonly axisLength: number;
    /**
     * @return {number | Percent} Outer radius
     */
    /**
     * Outer radius of the axis.
     *
     * Can be absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Outer radius
     */
    radius: number | Percent;
    /**
     * Outer radius in pixels.
     *
     * @return {number} Outer radius (px)
     */
    readonly pixelRadius: number;
    /**
     * @return {number | Percent} Inner radius
     */
    /**
     * Inner radius of the axis.
     *
     * Can be absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Inner radius
     */
    innerRadius: number | Percent;
    /**
     * Inner radius in pixels.
     *
     * @return {number} Inner radius (px)
     */
    readonly pixelInnerRadius: number;
    /**
     * Converts relative position on axis to point coordinates.
     *
     * @param  {number}  position  Position (0-1)
     * @return {IPoint}            Point
     */
    positionToPoint(position: number): IPoint;
    /**
     * Converts relative position on axis to angle.
     *
     * @todo Description (units)
     * @param  {number}  position  Position (0-1)
     * @return {number}            Angle
     */
    positionToAngle(position: number): number;
    /**
     * Updates and positions the axis line element.
     *
     * @ignore Exclude from docs
     */
    updateAxisLine(): void;
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    updateGridElement(grid: GridCircular, position: number, endPosition: number): void;
    /**
     * Updates and positions a tick element.
     *
     * @ignore Exclude from docs
     * @param {AxisTick}  tick         Tick element
     * @param {number}    position     Starting position
     * @param {number}    endPosition  End position
     */
    updateTickElement(tick: AxisTick, position: number, endPosition: number): void;
    /**
     * Updates and positions a label element.
     *
     * @ignore Exclude from docs
     * @param {AxisLabel}  label        Label element
     * @param {number}     position     Starting position
     * @param {number}     endPosition  Ending position
     */
    updateLabelElement(label: this["_labelType"], position: number, endPosition: number): void;
    /**
     * Checks if point is within bounds of a container.
     *
     * @ignore Exclude from docs
     * @param  {IPoint}   point Point coordinates
     * @return {boolean}         Fits?
     */
    fitsToBounds(point: IPoint): boolean;
    /**
     * @return {number} Start angle
     */
    /**
     * Start angle of the axis.
     *
     * @todo Description (units)
     * @param {number}  value  Start angle
     */
    startAngle: number;
    /**
     * @return {number} End angle
     */
    /**
     * End angle of the axis.
     *
     * @todo Description (units)
     * @param {number}  value  end angle
     */
    endAngle: number;
    /**
     * [getPositionRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}  startPosition  Starting position
     * @param  {number}  endPosition    End position
     * @return {string}                 SVG path
     */
    getPositionRangePath(startPosition: number, endPosition: number, radius?: number | Percent, innerRadius?: number | Percent, cornerRadius?: number): string;
    /**
     * Returns a new grid element, suitable for this Axis Renderer type.
     *
     * @return {GridCircular} Grid element
     */
    createGrid(): this["_gridType"];
    /**
     * Returns a new fill element, suitable for this Axis Renderer type.
     *
     * @return {AxisFillCircular} Fill element
     */
    createFill(axis: Axis): this["_fillType"];
    /**
     * Returns a new label element, suitable for this Axis Renderer type.
     *
     * @return {AxisLabelCircular} Label element
     */
    createLabel(): this["_labelType"];
}
