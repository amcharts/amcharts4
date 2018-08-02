/**
 * A module which defines functionality related to Category Axis Break.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisBreak, IAxisBreakProperties, IAxisBreakAdapters, IAxisBreakEvents } from "./AxisBreak";
import { CategoryAxis } from "./CategoryAxis";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[CategoryAxisBreak]].
 */
export interface ICategoryAxisBreakProperties extends IAxisBreakProperties {
    /**
     * Category break starts on.
     *
     * @type {string}
     */
    startCategory?: string;
    /**
     * Category break ends on.
     *
     * @type {string}
     */
    endCategory?: string;
}
/**
 * Defines events for [[CategoryAxisBreak]].
 */
export interface ICategoryAxisBreakEvents extends IAxisBreakEvents {
}
/**
 * Defines adapters for [[CategoryAxisBreak]].
 *
 * @see {@link Adapter}
 */
export interface ICategoryAxisBreakAdapters extends IAxisBreakAdapters, ICategoryAxisBreakProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Base class to define "breaks" in axes
 * @see {@link ICategoryAxisBreakEvents} for a list of available events
 * @see {@link ICategoryAxisBreakAdapters} for a list of available Adapters
 */
export declare class CategoryAxisBreak extends AxisBreak {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ICategoryAxisBreakProperties}
     */
    _properties: ICategoryAxisBreakProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ICategoryAxisBreakAdapters}
     */
    _adapter: ICategoryAxisBreakAdapters;
    /**
     * Defines available events.
     *
     * @type {ICategoryAxisBreakEvents}
     * @ignore Exclude from docs
     */
    _events: ICategoryAxisBreakEvents;
    /**
     * Defines the type of the Axis this break is used for.
     *
     * @ignore Exclude from docs
     * @type {Axis}
     */
    _axisType: CategoryAxis;
    /**
     * Constructor
     */
    constructor();
    /**
     * Pixel position of the break's start.
     *
     * @return {number} Position (px)
     * @readonly
     */
    readonly startPosition: number;
    /**
     * Pixel position of the break's end.
     *
     * @return {number} Position (px)
     * @readonly
     */
    readonly endPosition: number;
    /**
     * @return {string} Start category
     */
    /**
     * A category break starts on.
     *
     * @param {string}  value Start category
     */
    startCategory: string;
    /**
     * @return {string} End category
     */
    /**
     * A category break ends on.
     *
     * @param {string}  value  End category
     */
    endCategory: string;
    /**
     * @return {number} Value
     */
    /**
     * An index of start category.
     *
     * @param {number}  value  Value
     */
    startValue: number;
    /**
     * @return {number} Value
     */
    /**
     * An index of end category or a end value.
     *
     * @param {number}  value  Value
     */
    endValue: number;
}
