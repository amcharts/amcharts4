/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { TimeUnit } from "../defs/TimeUnit";
import * as $type from "../utils/Type";
/**
 * Maps time period names to their numeric representations in milliseconds.
 *
 * @ignore Exclude from docs
 */
export declare var timeUnitDurations: {
    [Key in TimeUnit]: number;
};
/**
 * Returns the next time unit that goes after source `unit`.
 *
 * E.g. "hour" is the next unit after "minute", etc.
 *
 * @ignore Exclude from docs
 * @param  {TimeUnit}            unit  Source time unit
 * @return {Optional<TimeUnit>}        Next time unit
 */
export declare function getNextUnit(unit: TimeUnit): $type.Optional<TimeUnit>;
/**
 * Returns number of milliseconds in the `count` of time `unit`.
 *
 * Available units: "millisecond", "second", "minute", "hour", "day", "week",
 * "month", and "year".
 *
 * @ignore Exclude from docs
 * @param  {TimeUnit}  unit   Time unit
 * @param  {number}    count  Number of units
 * @return {number}           Milliseconds
 */
export declare function getDuration(unit: TimeUnit, count?: number): number;
/**
 * Returns a copy of the `Date` object.
 *
 * @ignore Exclude from docs
 * @param  {Date}  date  Source date
 * @return {Date}        Copy
 */
export declare function copy(date: Date): Date;
/**
 * Checks if the `unit` part of two `Date` objects do not match. Two dates
 * represent a "range" of time, rather the same time date.
 *
 * @ignore Exclude from docs
 * @param  {Date}      dateOne  Date 1
 * @param  {Date}      dateTwo  Date 2
 * @param  {TimeUnit}  unit     Time unit to check
 * @return {boolean}            Range?
 */
export declare function checkChange(dateOne: Date, dateTwo: Date, unit: TimeUnit): boolean;
/**
 * Adds `count` of time `unit` to the source date. Returns a modified `Date` object.
 *
 * @ignore Exclude from docs
 * @param  {Date}      date   Source date
 * @param  {TimeUnit}  unit   Time unit
 * @param  {number}    count  Number of units to add
 * @return {Date}             Modified date
 */
export declare function add(date: Date, unit: TimeUnit, count: number): Date;
/**
 * "Rounds" the date to specific time unit.
 *
 * @ignore Exclude from docs
 * @param  {Date}      date             Source date
 * @param  {TimeUnit}  unit             Time unit
 * @param  {number}    count            Number of units to round to
 * @param  {number}    firstDateOfWeek  First day of week
 * @return {Date}                       New date
 */
export declare function round(date: Date, unit: TimeUnit, count?: number, firstDateOfWeek?: number): Date;
