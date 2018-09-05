/**
 * Cursor for XY chart
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Cursor, ICursorProperties, ICursorAdapters, ICursorEvents } from "./Cursor";
import { Sprite, ISpriteEvents } from "../../core/Sprite";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { IPoint } from "../../core/defs/IPoint";
import { IRange } from "../../core/defs/IRange";
import { Axis } from "../axes/Axis";
import { AxisRenderer } from "../axes/AxisRenderer";
import { XYChart } from "../types/XYChart";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[XYCursor]].
 */
export interface IXYCursorProperties extends ICursorProperties {
    /**
     * Cursor's behavior when moved with pointer down:
     *
     * * "zoomX" - zooms horizontally; (default)
     * * "zoomY" - zooms vertically;
     * * "zoomXY" - zooms both horizontally and vertically;
     * * "selectX" - selects a range horizontally;
     * * "selectY" - selects a range vertically;
     * * "selectXY" - selects a range both horizontally and vertically;
     * * "panX" - moves (pans) current selection horizontally;
     * * "panY" - moves (pans) current selection vertically;
     * * "panXY" - moves (pans) current selection both horizontally and vertically;
     * * "none" - does nothing with pointer down.
     *
     * @default "zoomX"
     */
    behavior?: "zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none";
    /**
     * Cursor's horizontal line is expanded to take full width of the related
     * Axis' cell/category.
     *
     * @type {boolean}
     */
    fullWidthLineX?: boolean;
    /**
     * Cursor's vertical line is expanded to take full width of the related
     * Axis' cell/category.
     *
     * @type {boolean}
     */
    fullWidthLineY?: boolean;
    /**
     * If cursor behavior is panX or panY, we allow to pan plot out of it's max bounds for a better user experience.
     * This setting specifies relative value by how much we can pan out the plot
     *
     * @type {number}
     */
    maxPanOut?: number;
}
/**
 * Defines events for [[XYCursor]].
 */
export interface IXYCursorEvents extends ICursorEvents {
}
/**
 * Defines adapters for [[XYCursor]].
 *
 * @see {@link Adapter}
 */
export interface IXYCursorAdapters extends ICursorAdapters, IXYCursorProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A cursor used on [[XYChart]].
 *
 * @see {@link IXYCursorEvents} for a list of available events
 * @see {@link IXYCursorAdapters} for a list of available Adapters
 * @todo Add description, examples
 * @todo Should we allow changing `_generalBehavior`?
 */
export declare class XYCursor extends Cursor {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IXYCursorProperties}
     */
    _properties: IXYCursorProperties;
    /**
     * Defines available adapters
     *
     * @ignore Exclude from docs
     * @type {IXYCursorAdapters}
     */
    _adapter: IXYCursorAdapters;
    /**
     * Defines available events.
     *
     * @type {IXYCursorEvents}
     * @ignore Exclude from docs
     */
    _events: IXYCursorEvents;
    /**
     * Vertical cursor line element.
     *
     * @type {MutableValueDisposer<Sprite>}
     */
    protected _lineX: MutableValueDisposer<Sprite>;
    /**
     * Horizontal cursor line element.
     *
     * @type {MutableValueDisposer<Sprite>}
     */
    protected _lineY: MutableValueDisposer<Sprite>;
    /**
     * Element which highlights selected area.
     *
     * @type {Sprite}
     */
    protected _selection: Sprite;
    /**
     * A range of current horizontal selection.
     *
     * @type {IRange}
     */
    xRange: IRange;
    /**
     * A range of current vertical selection.
     *
     * @type {IRange}
     */
    yRange: IRange;
    /**
     * Horizontal [[Axis]].
     *
     * @type {MutableValueDisposer<Axis>}
     */
    protected _xAxis: MutableValueDisposer<Axis<AxisRenderer>>;
    /**
     * Vertical [[Axis]].
     *
     * @type {MutableValueDisposer<Axis>}
     */
    protected _yAxis: MutableValueDisposer<Axis<AxisRenderer>>;
    /**
     * A reference to chart cursor belongs to.
     *
     * @ignore Exclude from docs
     * @type {Chart}
     */
    _chart: XYChart;
    /**
     * Constructor
     */
    constructor();
    /**
     * Updates cursor element dimensions on size change.
     *
     * @ignore Exclude from docs
     */
    updateSize(): void;
    /**
     * Updates selection dimensions on size change.
     *
     * @ignore Exclude from docs
     */
    updateSelection(): void;
    /**
     *
     * @ignore Exclude from docs
     */
    protected fixPoint(point: IPoint): IPoint;
    /**
     * Places the cursor at specific point.
     *
     * @param {IPoint}   point Point to place cursor at
     */
    protected triggerMoveReal(point: IPoint): void;
    /**
     *
     * @ignore Exclude from docs
     */
    protected updateLinePositions(point: IPoint): void;
    protected triggerDownReal(point: IPoint): void;
    /**
     * Updates the coordinates of where pointer down event occurred
     * (was pressed).
     */
    protected updatePoint(point: IPoint): void;
    protected triggerUpReal(point: IPoint): void;
    /**
     * [getRanges description]
     *
     * @todo Description
     */
    protected getPanningRanges(): void;
    /**
     * [getRanges description]
     *
     * @todo Description
     */
    protected getRanges(): void;
    /**
     * @type {"zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none"} Bheavior
     */
    /**
     * Cursor's behavior when it's moved with pointer down:
     *
     * * "zoomX" - zooms horizontally;
     * * "zoomY" - zooms vertically;
     * * "zoomXY" - zooms both horizontally and vertically;
     * * "selectX" - selects a range horizontally;
     * * "selectY" - selects a range vertically;
     * * "selectXY" - selects a range both horizontally and vertically;
     * * "panX" - moves (pans) current selection horizontally;
     * * "panY" - moves (pans) current selection vertically;
     * * "panXY" - moves (pans) current selection both horizontally and vertically;
     * * "none" - does nothing with pointer down.
     *
     * E.g. "zoomXY" will mean that pressing a mouse (or touching) over plot area
     * and dragging it will start zooming the chart.
     *
     * @param {"zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none"} value Bheavior
     */
    behavior: "zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none";
    /**
     * @return {boolean} Full width?
     */
    /**
     * Cursor's horizontal line is expanded to take full width of the related
     * Axis' cell/category.
     *
     * NOTE: this setting will work properly if `xAxis` is set and only in case
     * `xAxis` is [[CategoryAxis]] or [[DateAxis]].
     *
     * @param {boolean} value Full width?
     */
    fullWidthLineX: boolean;
    /**
     * @return {boolean} Full width?
     */
    /**
     * Cursor's vertical line is expanded to take full width of the related
     * Axis' cell/category.
     *
     * NOTE: this setting will work properly if `yAxis` is set and only in case
     * `yAxis` is [[CategoryAxis]] or [[DateAxis]].
     *
     * @param {boolean} value Full width?
     */
    fullWidthLineY: boolean;
    /**
     * @return {number} Full width?
     */
    /**
     * If cursor behavior is panX or panY, we allow to pan plot out of it's max bounds for a better user experience.
     * This setting specifies relative value by how much we can pan out the plot
     *
     * @param {number} value
     */
    maxPanOut: number;
    /**
     * @return {Axis} X axis
     */
    /**
     * A reference to X [[Axis]].
     *
     * An XY cursor can live without `xAxis` set. You set xAxis for cursor when
     * you have axis tooltip enabled and you want cursor line to be at the same
     * position as tooltip.
     *
     * This works with [[CategoryAxis]] and [[DateAxis]] but not with
     * [[ValueAxis]].
     *
     * @todo Description (review)
     * @param {Axis} axis X axis
     */
    xAxis: Axis;
    /**
     * @return {Axis} Y Axis
     */
    /**
     * A reference to Y [[Axis]].
     *
     * An XY cursor can live without `yAxis` set. You set xAxis for cursor when
     * you have axis tooltip enabled and you want cursor line to be at the same
     * position as tooltip.
     *
     * This works with [[CategoryAxis]] and [[DateAxis]] but not with
     * [[ValueAxis]].
     *
     * @todo Description (review)
     * @param {Axis} axis Y axis
     */
    yAxis: Axis;
    /**
     * Updates Cursor's position when axis tooltip changes position.
     *
     * @ignore Exclude from docs
     * @param {ISpriteEvents["positionchanged"]} event Original Axis event
     */
    protected handleXTooltipPosition(event: ISpriteEvents["positionchanged"]): void;
    /**
     * Updates Cursor's position when Y axis changes position or scale.
     *
     * @ignore Exclude from docs
     * @param {ISpriteEvents["positionchanged"]} event Original Axis event
     */
    protected handleYTooltipPosition(event: ISpriteEvents["positionchanged"]): void;
    /**
     * @return {Sprite} Line element
     */
    /**
     * A Line element to use for X axis.
     *
     * @param {Sprite} lineX Line
     */
    lineX: Sprite;
    /**
     * @return {Sprite} Line element
     */
    /**
     * A Line element to use Y axis.
     *
     * @param {Sprite} lineY Line
     */
    lineY: Sprite;
    /**
     * @return {Sprite} Selection rectangle
     */
    /**
     * A selection element ([[Sprite]]).
     *
     * @param {Sprite} selection Selection rectangle
     */
    selection: Sprite;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * Looks if `xAxis` and `yAxis` is set via ID in JSON config, and replaces
     * with real references.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
}
