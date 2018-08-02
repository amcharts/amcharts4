/**
 * Module, defining base Axis Renderer.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Sprite } from "../../core/Sprite";
import { IPoint } from "../../core/defs/IPoint";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { Axis } from "./Axis";
import { AxisLine } from "./AxisLine";
import { AxisFill } from "./AxisFill";
import { Grid } from "./Grid";
import { AxisLabel } from "./AxisLabel";
import { AxisTick } from "./AxisTick";
import { AxisBreak } from "./AxisBreak";
import { Chart } from "../Chart";
import { ListTemplate } from "../../core/utils/List";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AxisRenderer]].
 */
export interface IAxisRendererProperties extends IContainerProperties {
    /**
     * Minimum distance in pixels between grid elements.
     *
     * @type {number}
     */
    minGridDistance?: number;
    /**
     * Draw axis labels inside axis.
     *
     * @type {boolean}
     */
    inside?: boolean;
    /**
     * Draw axis on opposite side of the plot area?
     *
     * @type {boolean}
     */
    opposite?: boolean;
    /**
     * Inverse the order of the scale for the Axis.
     *
     * @type {boolean}
     */
    inversed?: boolean;
    /**
     * Location of the cell start. (0-1)
     *
     * @type {number}
     */
    cellStartLocation?: number;
    /**
     * Location of the cell end. (0-1)
     * @type {number}
     */
    cellEndLocation?: number;
    /**
     * Location of the axis tooltip. (0-1)
     *
     * @type {number}
     */
    tooltipLocation?: number;
    /**
     * Resize axis tooltip to the full width of the cell.
     *
     * @type {boolean}
     */
    fullWidthTooltip?: boolean;
    /**
     * Labels with position less than this will be hidden.
     *
     * @type {number}
     */
    minLabelPosition?: number;
    /**
     * Labels with position bigger than this will be hidden.
     *
     * @type {number}
     */
    maxLabelPosition?: number;
}
/**
 * Defines events for [[AxisRenderer]].
 */
export interface IAxisRendererEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[AxisRenderer]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererAdapters extends IContainerAdapters, IAxisRendererProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for all axis renderers.
 *
 * @see {@link IAxisRendererEvents} for a list of available events
 * @see {@link IAxisRendererAdapters} for a list of available Adapters
 */
export declare class AxisRenderer extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IAxisRendererProperties}
     */
    _properties: IAxisRendererProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IAxisRendererAdapters}
     */
    _adapter: IAxisRendererAdapters;
    /**
     * Defines available events.
     *
     * @type {IAxisRendererEvents}
     * @ignore Exclude from docs
     */
    _events: IAxisRendererEvents;
    /**
     * A related Axis.
     *
     * @type {Axis}
     */
    protected _axis: Axis;
    /**
     * A line object of the related axis.
     *
     * @type {AxisLine}
     */
    line: AxisLine;
    /**
     * Base grid element. ([[Sprite]])
     *
     * For value axes base grid is at value 0.
     *
     * For category/date axis it is added at the end of the last item/date.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    baseGrid: Sprite;
    /**
     * A [[Container]] holding all of the [[Grid]] elements.
     *
     * @type {Container}
     */
    gridContainer: Container;
    /**
     * A [[Container]] holding all of the [[AxisBreak]] elements.
     *
     * @type {Container}
     */
    breakContainer: Container;
    /**
     * A related chart.
     *
     * @type {MutableValueDisposer}
     */
    protected _chart: MutableValueDisposer<Chart>;
    /**
     * Defines type of the grid elements.
     *
     * @ignore Exclude from docs
     * @type {Grid}
     */
    _gridType: Grid;
    /**
     * Defines type for the fill elements.
     *
     * @ignore Exclude from docs
     * @type {AxisFill}
     */
    _fillType: AxisFill;
    /**
     * Defines type for tick elements.
     *
     * @ignore Exclude from docs
     * @type {AxisTick}
     */
    _tickType: AxisTick;
    /**
     * Defines type for the label elements.
     *
     * @ignore Exclude from docs
     * @type {AxisLabel}
     */
    _labelType: AxisLabel;
    /**
     * A list of grid elements.
     */
    protected _grid: ListTemplate<this["_gridType"]>;
    /**
     * A list of tick elements.
     */
    protected _ticks: ListTemplate<this["_tickType"]>;
    /**
     * A list of label elements.
     */
    protected _labels: ListTemplate<this["_labelType"]>;
    /**
     * A list of fill elements.
     */
    protected _axisFills: ListTemplate<this["_fillType"]>;
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    constructor();
    axis: Axis;
    /**
    * @ignore
    */
    setAxis(axis: Axis): void;
    /**
     * Called when rendered is attached to an Axis, as well as a property of
     * Axis that might affect the appearance is updated.
     *
     * E.g. `axis.opposite`, `axis.inside`, etc.
     *
     * This method is called **before** draw, so that any related setting
     * changed in this method can be changed.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    processRenderer(): void;
    /**
     * Updates Axis' tooltip.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    updateTooltip(): void;
    /**
     * Returns actual length of the Axis, in pixels.
     *
     * @return {number} Length (px)
     */
    readonly axisLength: number;
    /**
     * Re-positions an element to new coordinates.
     *
     * @ignore Exclude from docs
     * @param {Sprite}  item   A target element
     * @param {IPoint}  point  New coordinates
     */
    positionItem(item: Sprite, point: IPoint): void;
    /**
     * Converts relative position on axis to point coordinates.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position (0-1)
     * @return {IPoint}            Point
     */
    positionToPoint(position: number): IPoint;
    /**
     * Converts relative position on axis to angle.
     *
     * @ignore Exclude from docs
     * @todo Description (review / units)
     * @param  {number}  position  Position (0-1)
     * @return {number}            Angle
     */
    positionToAngle(position: number): number;
    /**
     * Converts relative position (0-1) on axis to a pixel coordinate.
     *
     * @param  {number}  position  Position (0-1)
     * @return {number}            Coordinate (px)
     */
    positionToCoordinate(position: number): number;
    protected getHeight(): number;
    protected getWidth(): number;
    /**
     * Converts a coordinate in pixels to a relative position. (0-1)
     *
     * @param  {number}  coordinate  Coordinate (px)
     * @return {number}              Position (0-1)
     */
    coordinateToPosition(coordinate: number): number;
    /**
     * Converts a point at specific coordinates to a relative position (0-1)
     * on the axis.
     *
     * @ignore Exclude from docs
     * @param  {IPoint}  point  Point
     * @return {number}         Position (0-1)
     */
    pointToPosition(point: IPoint): number;
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
     * Invalidates all axis data items, effectively causing them re-evaluated.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    invalidateAxisItems(): void;
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    updateGridElement(grid: Sprite, position: number, endPosition: number): void;
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
    updateLabelElement(label: AxisLabel, position: number, endPosition: number): void;
    /**
     * Updates and positions the axis line element.
     *
     * @ignore Exclude from docs
     * @param {AxisFill}  fill         Fill element
     * @param {number}    position     Starting position
     * @param {number}    endPosition  Ending position
     */
    updateFillElement(fill: AxisFill, position: number, endPosition: number): void;
    /**
     * Updates and positions the axis line element.
     *
     * @ignore Exclude from docs
     */
    updateAxisLine(): void;
    /**
     * Updates and positions the base grid element.
     *
     * @ignore Exclude from docs
     */
    updateBaseGridElement(): void;
    /**
     * Updates and positions an axis break element.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Break element
     */
    updateBreakElement(axisBreak: AxisBreak): void;
    /**
     * @return {number} Min distance (px)
     */
    /**
     * Minimum distance in pixels between grid elements.
     *
     * @param {number}  value  Min distance (px)
     */
    minGridDistance: number;
    /**
     * @ignore Exclude from docs
     * @return {Chart} Chart
     */
    /**
     * A chart, associated with the Axis.
     *
     * @ignore Exclude from docs
     * @param {Chart}  value  Chart
     */
    chart: Chart;
    /**
     * Toggles visibility of an element, based on its current position and
     * min/max position settings.
     *
     * E.g. labels based on `minLabelPosition` and `maxLabelPosition`.
     *
     * @ignore Exclude from docs
     * @param {Sprite}  sprite       An element to toggle
     * @param {number}  position     Elements current position
     * @param {number}  minPosition  Min position setting
     * @param {number}  maxPosition  Max position setting
     */
    protected toggleVisibility(sprite: Sprite, position: number, minPosition: number, maxPosition: number): void;
    /**
     * Creates visual elements for and axis break.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Axis break
     */
    createBreakSprites(axisBreak: AxisBreak): void;
    /**
     * A list of Axis' Fill elements.
     *
     * @return {ListTemplate} Fill elements
     */
    readonly axisFills: ListTemplate<this["_fillType"]>;
    /**
     * Returns a new fill element, suitable for this Axis Renderer type.
     *
     * @return {AxisFill} Fill element
     */
    createFill(axis: Axis): this["_fillType"];
    /**
     * A list of Axis' Grid elements.
     *
     * @return {ListTemplate} Grid elements
     */
    readonly grid: ListTemplate<this["_gridType"]>;
    /**
     * Returns a new grid element, suitable for this Axis Renderer type.
     *
     * @return {Grid} Grid element
     */
    createGrid(): this["_gridType"];
    /**
     * A list of Axis' Tick elements.
     *
     * @return {ListTemplate} Tick elements
     */
    readonly ticks: ListTemplate<this["_tickType"]>;
    /**
     * Returns a new tick element, suitable for this Axis Renderer type.
     *
     * @return {AxisTick} Tick element
     */
    createTick(): this["_tickType"];
    /**
     * A list of Axis' Label elements.
     *
     * @return {ListTemplate} Label elements
     */
    readonly labels: ListTemplate<this["_labelType"]>;
    /**
     * Returns a new label element, suitable for this Axis Renderer type.
     *
     * @return {AxisLabel} Label element
     */
    createLabel(): this["_labelType"];
    /**
     * @return {boolean} Labels inside?
     */
    /**
     * Indicates whether Axis' labels and ticks should be drawn inside Plot area.
     *
     * Does not work with all renderers, like AxisRendererRadial.
     *
     * @param {boolean}  value  Labels inside?
     */
    inside: boolean;
    /**
     * @return {boolean} Draw axis on opposite side?
     */
    /**
     * Indicates whether Axis should be drawn on the opposite side of the plot
     * area than it would normally be drawn based on chart's settings.
     *
     * Does not work with all renderers, like [[AxisRendererRadial]] and
     * [[AxisRenderer Circular].
     *
     * @param {boolean}  value  Draw axis on opposite side?
     */
    opposite: boolean;
    /**
     * @return {boolean} Full width tooltip?
     */
    /**
     * Indicates if Axis tooltip should take the whole width of the axis cell.
     * (between two grid lines)
     *
     * NOTE: this setting is ignored on circular axis types.
     *
     * @param {boolean} value Full width tooltip?
     */
    fullWidthTooltip: boolean;
    /**
     * @return {number} Tooltip location
     */
    /**
     * Location within axis cell to show tooltip on. (0-1)
     *
     * 0 - show at the start
     * 0.5 - show right in the middle
     * 1 - show at the end
     *
     * @param {number} value Tooltip location
     */
    tooltipLocation: number;
    /**
     * @return {number} Cell start (0-1)
     */
    /**
     * Location for the cell start.
     *
     * Normally a "cell" is the whole available width in a category.
     *
     * If there are several clustered column-like series available, the whole
     * space is divided between each clustered column, or column stacks.
     *
     * `cellStartLocation` identifies where, within available space, the actual
     * cell starts.
     *
     * This, together with column series' `width` will affect actual width of
     * columns, and thus gaps between them.
     *
     * This will affect category-like axes only, like [[DateAxis]], or
     * [[CategoryAxis]].
     *
     * This is used to limit a space occupied by series like column.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
     * @param {number} value Cell start (0-1)
     */
    cellStartLocation: number;
    /**
     * @return {number} Cell end (0-1)
     */
    /**
     * Location for the cell end.
     *
     * Normally a "cell" is the whole available width in a category.
     *
     * If there are several clustered column-like series available, the whole
     * space is divided between each clustered column, or column stacks.
     *
     * `cellEndLocation` identifies where, within available space, the actual
     * cell ends.
     *
     * This, together with column series' `width` will affect actual width of
     * columns, and thus gaps between them.
     *
     * This will affect category-like axes only, like [[DateAxis]], or
     * [[CategoryAxis]].
     *
     * This is used to limit a space occupied by series like column.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
     * @param {number} value Cell end (0-1)
     */
    cellEndLocation: number;
    /**
     * @return {boolean} Flip axis?
     */
    /**
     * Indicates if the scale of the axis should be flipped.
     *
     * @param {boolean} value Flip axis?
     */
    inversed: boolean;
    /**
     * @return {number} Min label position (0-1)
     */
    /**
     * Minimum position along the Axis, for labels.
     *
     * Labels, which have their position closer to the start of the Axis, will be
     * automatically hidden.
     *
     * E.g., setting this to 0.05 (5% of total axis length) would hide labels,
     * that would otherwise be drawn very near start of the Axis.
     *
     * This is especially usefull with `inside = true`, or if the chart hasn't
     * got any extra margins.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
     * @param {number}  value  Min label position (0-1)
     */
    minLabelPosition: number;
    /**
     * @return {number} Max label position (0-1)
     */
    /**
     * Maximum position along the Axis, for labels.
     *
     * Labels, which have their position closer to the and of the Axis, will be
     * automatically hidden.
     *
     * E.g., setting this to 0.95 (95% of total axis length) would hide labels,
     * that would otherwise be drawn very near end of the Axis.
     *
     * This is especially usefull with `inside = true`, or if the chart hasn't
     * got any extra margins.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
     * @param {number}  value  Max label position (0-1)
     */
    maxLabelPosition: number;
    /**
     * Copies all settings and related items from another object of the same
     * type.
     *
     * @param {this}  source  Source object
     */
    copyFrom(source: this): void;
}
