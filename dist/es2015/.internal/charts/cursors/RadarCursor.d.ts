/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { RadarChart } from "../types/RadarChart";
import { XYCursor, IXYCursorAdapters, IXYCursorEvents, IXYCursorProperties } from "./XYCursor";
import { IPoint } from "../../core/defs/IPoint";
import { ISpriteEvents } from "../../core/Sprite";
import { Percent } from "../../core/utils/Percent";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[RadarCursor]].
 */
export interface IRadarCursorProperties extends IXYCursorProperties {
    /**
     * Inner radius of the cursor's circular line.
     * Absolute (px) or relative ([[Percent]]).
     *
     * @type {number | Percent}
     */
    innerRadius: number | Percent;
    /**
     * Outer radius of the cursor's circular line.
     * Absolute (px) or relative ([[Percent]]).
     *
     * @type {number | Percent}
     */
    radius: number | Percent;
    /**
     * Starting angle of the cursor's radial line.
     *
     * @type {number}
     */
    startAngle: number;
    /**
     * Ending angle of the cursor's radial line.
     *
     * @type {number}
     */
    endAngle: number;
}
/**
 * Defines events for [[RadarCursor]].
 */
export interface IRadarCursorEvents extends IXYCursorEvents {
}
/**
 * Defines adapters for [[RadarCursor]].
 *
 * @see {@link Adapter}
 */
export interface IRadarCursorAdapters extends IXYCursorAdapters, IRadarCursorProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Cursor for [[RadarChart]].
 *
 * @see {@link IRadarCursorEvents} for a list of available events
 * @see {@link IRadarCursorAdapters} for a list of available Adapters
 */
export declare class RadarCursor extends XYCursor {
    /**
     * Defines available properties
     * @type {IRadarCursorProperties}
     * @ignore
     */
    _properties: IRadarCursorProperties;
    /**
     * Defines available adapters
     * @type {IRadarCursorAdapters}
     * @ignore
     */
    _adapter: IRadarCursorAdapters;
    /**
     * Defines available events.
     *
     * @type {IRadarCursorEvents}
     * @ignore Exclude from docs
     */
    _events: IRadarCursorEvents;
    /**
     * A reference to chart cursor belongs to.
     *
     * @ignore Exclude from docs
     * @type {Chart}
     */
    _chart: RadarChart;
    protected _prevAngle: number;
    /**
     * Constructor
     */
    constructor();
    /**
     * Checks if point is within bounds of a container.
     *
     * @ignore Exclude from docs
     * @param  {IPoint}   point  Point to check
     * @return {boolean}         Fits within container?
     */
    fitsToBounds(point: IPoint): boolean;
    /**
     * @return {number} Start angle
     */
    /**
     * Starting angle of the cursor's radial line.
     *
     * @param {number} value Start angle
     */
    startAngle: number;
    /**
     * @return {number} End angle
     */
    /**
     * End angle of the cursor's radial line.
     *
     * @param {number} value End angle
     */
    endAngle: number;
    protected triggerMoveReal(point: IPoint): void;
    /**
     * (Re)draws the horizontal (circular) cursor's line.
     *
     * @param {IPoint} point New target point
     */
    protected updateLineX(point: IPoint): void;
    /**
     * (Re)draws the vertical (radial) cursor's line.
     *
     * @param {IPoint} point New target point
     */
    protected updateLineY(point: IPoint): void;
    /**
     * Updates selection dimensions on size change.
     *
     * @ignore Exclude from docs
     */
    updateSelection(): void;
    /**
     * Updates cursors current positions.
     */
    protected getPositions(): void;
    /**
     * Overriding inherited method, so that nothing happens when it's triggered.
     *
     * @ignore Exclude from docs
     */
    protected updatePoint(point: IPoint): void;
    /**
     * Updates Cursor's position when axis tooltip changes horizontal position.
     *
     * @param {ISpriteEvents["positionchanged"]} event Axis event
     */
    protected handleXTooltipPosition(event: ISpriteEvents["positionchanged"]): void;
    /**
     * Updates Cursor's position when axis tooltip changes vertical position.
     *
     * @todo Description
     * @param {ISpriteEvents["positionchanged"]} event Axis event
     */
    protected handleYTooltipPosition(event: ISpriteEvents["positionchanged"]): void;
    /**
     * needs to be overriden
     * @ignore
     */
    protected updateLinePositions(point: IPoint): void;
    /**
     * [getRanges description]
     *
     * @todo Description
     */
    protected getRanges(): void;
    /**
     * Overriding inherited method, so that nothing happens when `updateSize`
     * is triggered.
     *
     * RadarCursor is quite complicated and needs own sizing logic.
     *
     * @ignore Exclude from docs
     */
    updateSize(): void;
    /**
     * @return {number} Outer radius
     */
    /**
     * Outer radius of the cursor's circular line.
     * Absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Outer radius
     */
    radius: number | Percent;
    /**
     * Outer radius of the circular line in pixels.
     *
     * @return {number} Outer radius (px)
     * @readonly
     */
    readonly pixelRadius: number;
    /**
     * [truePixelRadius description]
     *
     * @todo Description
     * @return {number} Outer radius (px)
     * @readonly
     */
    readonly truePixelRadius: number;
    /**
     * @return {number} Inner radius
     */
    /**
     * Inner radius of the cursor's circular line.
     * Absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Inner radius
     */
    innerRadius: number | Percent;
    /**
     * Inner radius of the circular line in pixels.
     *
     * @return {number} Inner radius (px)
     * @readonly
     */
    readonly pixelInnerRadius: number;
    /**
     *
     * @ignore Exclude from docs
     */
    protected fixPoint(point: IPoint): IPoint;
}
