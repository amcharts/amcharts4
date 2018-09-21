/**
 * Duration formatting functionality.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../Sprite";
import { Language } from "../utils/Language";
import { BaseObject } from "../Base";
import { TimeUnit } from "../defs/TimeUnit";
import { Optional } from "../utils/Type";
import * as $type from "../utils/Type";
/**
 * DurationFormatter class. Formats numbers as durations.
 *
 * `1000` as `16:40`
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Tutorial on duration formatting
 */
export declare class DurationFormatter extends BaseObject {
    /**
     * If set will force this format to be used, regardless of the scale.
     *
     * @type {string}
     */
    protected _durationFormat: string;
    /**
     * Holds duration formats for various possible scenarios.
     *
     * @type {Partial<Record<TimeUnit, Partial<Record<TimeUnit, string>>>>}
     */
    protected _durationFormats: Partial<Record<TimeUnit, Partial<Record<TimeUnit, string>>>>;
    /**
     * A base value for negative numbers. Will treat all numbers below this value
     * as negative numbers.
     *
     * @type {number}
     */
    protected _negativeBase: number;
    /**
     * A base unit to consider values are in.
     *
     * @default "s"
     * @type {TimeUnit}
     */
    protected _baseUnit: TimeUnit;
    /**
     * Output format to produce. If the format calls for applying color to the
     * formatted value, this setting will determine what markup to use: SVG or
     * HTML.
     *
     * Available options: svg, html.
     *
     * @default "svg"
     * @type {string}
     */
    protected _outputFormat: string;
    /**
     * How many milliseconds each unit represents.
     *
     * @type {Object}
     */
    protected _unitValues: Record<TimeUnit, number>;
    /**
     * Collection of aliases for units.
     *
     * @type {Object}
     */
    protected _unitAliases: {
        [index: string]: string;
    };
    /**
     * Holds reference to parent [[Sprite]] object.
     *
     * @type {Optional<Sprite>}
     */
    sprite: $type.Optional<Sprite>;
    /**
     * Holds reference to [[Language]] object.
     *
     * @type {Optional<Language>}
     */
    language: $type.Optional<Language>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Formats the number according as duration.
     *
     * For example `1000` (base unit seconds) would be converted to `16:40` as in
     * 16 minutes and 40 seconds.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Tutorial on duration formatting
     * @param  {number | string}  value   Value to format
     * @param  {string}           format  Format to apply
     * @param  {TimeUnit}         base    Override base unit
     * @return {string}                   Formatted number
     */
    format(value: number | string, format?: string, base?: TimeUnit): string;
    /**
     * Parses supplied format into structured object which can be used to format
     * the number.
     *
     * @param  {string}    format  Format string, i.e. "#,###.00"
     * @param  {TimeUnit}  base    Override base unit
     * @return {any}               Parsed information
     */
    protected parseFormat(format: string, base?: TimeUnit): any;
    /**
     * Applies parsed format to a numeric value.
     *
     * @param  {number}  value    Value
     * @param  {any}     details  Parsed format as returned by {parseFormat}
     * @return {string}           Formatted duration
     */
    protected applyFormat(value: number, details: any): string;
    /**
     * Converts numeric value to timestamp in milliseconds.
     *
     * @param  {number}    value     A source value
     * @param  {TimeUnit}  baseUnit  Base unit the source value is in: "q", "s", "i", "h", "d", "w", "m", "y"
     * @return {number}              Value representation as a timestamp in milliseconds
     */
    toTimeStamp(value: number, baseUnit: TimeUnit): number;
    protected toTimeUnit(code: string): Optional<TimeUnit>;
    /**
     * Invalidates the parent [[Sprite]] object.
     */
    protected invalidateSprite(): void;
    /**
     * @return {string} Base unit
     */
    /**
     * Base unit the values are in.
     *
     * A base unit will be used to recalculate the numeric value to millisecond
     * timestamps.
     *
     * Available options:
     *
     * * "millisecond"
     * * "second"
     * * "minute"
     * * "hour"
     * * "day"
     * * "week"
     * * "month"
     * * "year"
     *
     * @default "s"
     * @param {TimeUnit}  baseUnit  A base unit
     */
    baseUnit: TimeUnit;
    /**
     * Getter for output format.
     *
     * @ignore Exclude from docs
     * @return {string} Output format
     */
    /**
     * Setter for output format: "svg" or "html.
     *
     * @ignore Exclude from docs
     * @param {string}  value  Output format
     */
    outputFormat: string;
    /**
     * Returns appropriate default format for the value.
     *
     * If `maxValue` is sepcified, it will use that value to determine the time
     * unit for the format.
     *
     * For example if your `baseUnit` is `"second"` and you pass in `10`, you
     * will get `"10"`.
     *
     * However, you might want it to be formatted in the context of bigger scale,
     * say 10 minutes (600 seconds). If you pass in `600` as `maxValue`, all
     * values, including small ones will use format with minutes, e.g.:
     * `00:10`, `00:50`, `12: 30`, etc.
     *
     * @param  {number}    value     Value to format
     * @param  {number}    maxValue  Maximum value to be used to determine format
     * @param  {TimeUnit}  baseUnit  Base unit of the value
     * @return {string}              Format
     */
    getFormat(value: number, maxValue?: number, baseUnit?: TimeUnit): string;
    /**
     * Returns value's closest denominator time unit, e.g 100 seconds is
     * `"minute"`, while 59 seconds would still be `second`.
     *
     * @param  {number}    value     Source duration value
     * @param  {TimeUnit}  baseUnit  Base unit
     * @return {TimeUnit}            Denominator
     */
    getValueUnit(value: number, baseUnit?: TimeUnit): TimeUnit;
    /**
     * Converts value to milliseconds according to `baseUnit`.
     *
     * @param  {number}    value     Source duration value
     * @param  {TimeUnit}  baseUnit  Base unit
     * @return {number}              Value in milliseconds
     */
    getMilliseconds(value: number, baseUnit?: TimeUnit): number;
    /**
     * @return {Optional<string>} Format
     */
    /**
     * If set, this format will be used instead of the one determined dynamically
     * based on the basedUnit and range of values.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Available fomatting codes
     * @param {string}  value  Format
     */
    durationFormat: string;
    /**
     * @return {Partial} Formats
     */
    /**
     * Duration formats for various combination of base units.
     *
     * @param {Partial<Record<TimeUnit, Partial<Record<TimeUnit, string>>>>}  value  Formats
     */
    durationFormats: Partial<Record<TimeUnit, Partial<Record<TimeUnit, string>>>>;
}
