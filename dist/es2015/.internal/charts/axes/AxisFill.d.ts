/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../../core/Sprite";
import { Axis, AxisItemLocation, AxisDataItem } from "./Axis";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AxisFill]].
 */
export interface IAxisFillProperties extends ISpriteProperties {
    /**
     * Start position. (0-1)
     *
     * @type {number}
     */
    startPosition?: number;
    /**
     * End position. (0-1)
     * @type {number}
     */
    endPosition?: number;
    /**
     * Location within the axis.
     *
     * @type {number}
     */
    location?: number;
}
/**
 * Defines events for [[AxisFill]].
 */
export interface IAxisFillEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[AxisFill]].
 *
 * @see {@link Adapter}
 */
export interface IAxisFillAdapters extends ISpriteAdapters, IAxisFillProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * AxisFill is a base class used to defines fill shapes for various
 * type-specific Axes.
 *
 * Axis fills are used to add fills to specific ranges of those axes.
 *
 * @see {@link IAxisFillEvents} for a list of available events
 * @see {@link IAxisFillAdapters} for a list of available Adapters
 * @important
 */
export declare class AxisFill extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IAxisFillProperties}
     */
    _properties: IAxisFillProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IAxisFillAdapters}
     */
    _adapter: IAxisFillAdapters;
    /**
     * Defines available events.
     *
     * @type {IAxisFillEvents}
     * @ignore Exclude from docs
     */
    _events: IAxisFillEvents;
    /**
     * A referecent to Axis element this fill is applied to.
     *
     * @type {Axis}
     */
    axis: Axis;
    /**
     * An SVG path, used to draw fill shape.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @type {string}
     */
    fillPath: string;
    /**
     * [_dataItem description]
     *
     * Not sure what this is doing here?
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {AxisDataItem}
     */
    _dataItem: AxisDataItem;
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
     * @return {number} Start position
     */
    /**
     * An actual starting position of the fill.
     *
     * @param {number}  value  Starting position
     */
    startPosition: number;
    /**
     * @return {number} End position
     */
    /**
     * An actual end position of the fill.
     *
     * @param {number} value End position
     */
    endPosition: number;
    /**
     * @return {AxisItemLocation} Location (0-1)
     */
    /**
     * Relative location of the fill. (0-1)
     *
     * @param {number} value Location (0-1)
     */
    location: AxisItemLocation;
}
