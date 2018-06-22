/**
 * DateAxisBreak includes functionality to add breaks on a [[DateAxis]].
 *
 * A "break" can be used to "cut out" specific ranges of the axis scale, e.g.
 * weekends and holidays out of the Date-based axis.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ValueAxisBreak, IValueAxisBreakProperties, IValueAxisBreakAdapters, IValueAxisBreakEvents } from "./ValueAxisBreak";
import { DateAxis } from "./DateAxis";
import { ITimeInterval } from "../../core/defs/ITimeInterval";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[DateAxisBreak]].
 */
export interface IDateAxisBreakProperties extends IValueAxisBreakProperties {
    /**
     * A `Date` break starts on.
     *
     * @type {Date}
     */
    startDate?: Date;
    /**
     * A `Date` break ends on.
     *
     * @type {Date}
     */
    endDate?: Date;
}
/**
 * Defines events for [[DateAxisBreak]]
 */
export interface IDateAxisBreakEvents extends IValueAxisBreakEvents {
}
/**
 * Defines adapters for [[DateAxisBreak]].
 *
 * @see {@link Adapter}
 */
export interface IDateAxisBreakAdapters extends IValueAxisBreakAdapters, IDateAxisBreakProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to define breaks for [[DateAxis]].
 *
 * A "break" can be used to "cut out" specific ranges of the axis scale, e.g.
 * weekends and holidays out of the Date-based axis.
 *
 * @see {@link IDateAxisBreakEvents} for a list of available events
 * @see {@link IDateAxisBreakAdapters} for a list of available Adapters
 * @important
 */
export declare class DateAxisBreak extends ValueAxisBreak {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IDateAxisBreakProperties}
     */
    _properties: IDateAxisBreakProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IDateAxisBreakAdapters}
     */
    _adapter: IDateAxisBreakAdapters;
    /**
     * Defines available events.
     *
     * @type {IDateAxisBreakEvents}
     * @ignore Exclude from docs
     */
    _events: IDateAxisBreakEvents;
    /**
     * Defines the type of the Axis this break is used for.
     *
     * @ignore Exclude from docs
     * @type {ValueAxis}
     */
    _axisType: DateAxis;
    /**
     * [gridInterval description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {ITimeInterval}
     */
    gridInterval: ITimeInterval;
    /**
     * [gridDate description]
     *
     * @ignore Exclude from docs
     * @type {Date}
     * @todo Description
     */
    gridDate: Date;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {Date} Start date
     */
    /**
     * Starting date for the break.
     *
     * @param {Date} value Start date
     */
    startDate: Date;
    /**
     * @return {Date} End date
     */
    /**
     * Ending date for the break.
     *
     * @param {Date} value End date
     */
    endDate: Date;
}
