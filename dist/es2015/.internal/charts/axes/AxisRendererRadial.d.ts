/**
 * Module, defining Axis Renderer for radial axes.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRendererY, IAxisRendererYProperties, IAxisRendererYAdapters, IAxisRendererYEvents } from "./AxisRendererY";
import { AxisTick } from "./AxisTick";
import { RadarChart } from "../types/RadarChart";
import { IPoint } from "../../core/defs/IPoint";
import { Grid } from "./Grid";
import { AxisBreak } from "./AxisBreak";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { Percent } from "../../core/utils/Percent";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AxisRendererRadial]].
 */
export interface IAxisRendererRadialProperties extends IAxisRendererYProperties {
    /**
     * Start angle of the radial axis in degrees. (0-360)
     *
     * @type {number}
     */
    startAngle?: number;
    /**
     * End angle of the radial axis in degrees. (0-360)
     *
     * @type {number}
     */
    endAngle?: number;
    /**
     * A grid type to display: "circles" or "polygons".
     *
     * @default "circles"
     * @type {"circles" | "polygons"}
     */
    gridType?: "circles" | "polygons";
    /**
     * An angle of the axis in degrees. (0-360)
     *
     * @type {number}
     */
    axisAngle?: number;
    /**
     * Outer radius of the radial axis.
     *
     * Can either be absolute (pixels) or relative ([[Percent]]).
     *
     * @type {number | Percent}
     */
    radius?: number | Percent;
    /**
     * Inner radius of the radial axis.
     *
     * Can either be absolute (pixels) or relative ([[Percent]]).
     *
     * @type {number | Percent}
     */
    innerRadius?: number | Percent;
}
/**
 * Defines events for [[AxisRendererRadial]].
 */
export interface IAxisRendererRadialEvents extends IAxisRendererYEvents {
}
/**
 * Defines adapters for [[AxisRenderer]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererRadialAdapters extends IAxisRendererYAdapters, IAxisRendererRadialProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A renderer for radial axis.
 */
export declare class AxisRendererRadial extends AxisRendererY {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {AxisRendererProperties}
     */
    _properties: IAxisRendererRadialProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {AxisRendererAdapters}
     */
    _adapter: IAxisRendererRadialAdapters;
    /**
     * Defines available events.
     *
     * @type {IAxisRendererRadialEvents}
     * @ignore Exclude from docs
     */
    _events: IAxisRendererRadialEvents;
    /**
     * A related chart.
     *
     * @type {MutableValueDisposer}
     */
    protected _chart: MutableValueDisposer<RadarChart>;
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
     * Validates Axis renderer.
     *
     * @ignore Exclude from docs
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
     * @param {number | Percent}  value  Outer radius
     */
    innerRadius: number | Percent;
    /**
     * Inner radius in pixels.
     *
     * @return {number} Inner radius (px)
     */
    readonly pixelInnerRadius: number;
    /**
     * @ignore Exclude from docs
     * @return {RadarChart} Chart
     */
    /**
     * Chart, associated with the Axis.
     *
     * @ignore Exclude from docs
     * @param {RadarChart} value Chart
     */
    chart: RadarChart;
    /**
     * Converts relative position on axis to point coordinates.
     *
     * @param  {number}  position  Position (0-1)
     * @return {IPoint}            Point
     */
    positionToPoint(position: number): IPoint;
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
    updateGridElement(grid: Grid, position: number, endPosition: number): void;
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
     * Updates and positions the base grid element.
     *
     * @ignore Exclude from docs
     */
    updateBaseGridElement(): void;
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
     * Start angle of the axis in degrees. (0-360)
     *
     * @param {number}  value  Start angle
     */
    startAngle: number;
    /**
     * @return {number} End angle
     */
    /**
     * End angle of the axis in degrees. (0-360)
     *
     * @param {number}  value  End angle
     */
    endAngle: number;
    /**
     * @return {number} Axis angle
     */
    /**
     * Angle of the radial axis in degrees. (0-360)
     *
     * @param {number}  value  Axis angle
     */
    axisAngle: number;
    /**
     * @type {"circles" | "polygons"} Grid type
     */
    /**
     * Grid type for radial axis.
     *
     * A grid on radia axis can either be perfect circles ("circles"), or
     * straight lines ("polygons").
     *
     * @default "circles"
     * @param {"circles" | "polygons"}  value  Grid type
     */
    gridType: "circles" | "polygons";
    /**
     * [getPositionRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}  startPosition  Starting position
     * @param  {number}  endPosition    End position
     * @return {string}                 SVG path
     */
    getPositionRangePath(startPosition: number, endPosition: number): string;
    /**
     * Updates and positions an axis break element.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Break element
     */
    updateBreakElement(axisBreak: AxisBreak): void;
    /**
     * Creates visual elements for and axis break.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Axis break
     */
    createBreakSprites(axisBreak: AxisBreak): void;
    /**
     * Updates some of the Axis tooltip's visual properties, related to
     * rendering of the Axis.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    updateTooltip(): void;
    /**
     * Updates and positions a tick element.
     *
     * @ignore Exclude from docs
     * @param {AxisTick}  tick      Tick element
     * @param {number}    position  Position
     */
    updateTickElement(tick: AxisTick, position: number): void;
    /**
     * Converts a position on the axis to a coordinate in pixels.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position (0-1)
     * @return {number}            Coordinate (px)
     */
    positionToCoordinate(position: number): number;
}
