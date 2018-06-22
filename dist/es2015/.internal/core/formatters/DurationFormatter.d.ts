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
import * as $type from "../utils/Type";
/**
 * DurationFormatter class. Formats numbers as durations.
 *
 * `1000` as `16:40`
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Tutorial on duration formatting
 * @todo Implement syntax to set base unit in format itself
 */
export declare class DurationFormatter extends BaseObject {
    /**
     * A base value for negative numbers. Will treat all numbers below this value
     * as negative numbers.
     *
     * @type {number}
     */
    protected _negativeBase: number;
    /**
     * Holds number format.
     *
     * @type {string}
     */
    protected _durationFormat: string;
    /**
     * A base unit to consider values are in.
     *
     * @default "s"
     * @type {string}
     */
    protected _baseUnit: string;
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
    protected _unitValues: {
        [index: string]: number;
    };
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
     * @param  {string}           base    Override base unit
     * @return {string}                   Formatted number
     */
    format(value: number | string, format?: string, base?: string): string;
    /**
     * Parses supplied format into structured object which can be used to format
     * the number.
     *
     * @param  {string}  format  Format string, i.e. "#,###.00"
     * @param  {string}  base    Override base unit
     * @return {any}             Parsed information
     */
    protected parseFormat(format: string, base?: string): any;
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
     * @param  {number}  value     A source value
     * @param  {string}  baseUnit  Base unit the source value is in: "q", "s", "i", "h", "d", "w", "m", "y"
     * @return {number}            Value representation as a timestamp in milliseconds
     */
    toTimeStamp(value: number, baseUnit: string): number;
    /**
     * Invalidates the parent [[Sprite]] object.
     */
    protected invalidateSprite(): void;
    /**
     * @return {string} Duration format
     */
    /**
     * Duration format.
     *
     * @default "mm:ss"
     * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Tutorial on duration formatting
     * @param {string}  format  Duration format
     */
    durationFormat: string;
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
     * * "q" - millisecond
     * * "s" - second
     * * "i" - minute
     * * "h" - hour
     * * "d" - day
     * * "w" - week
     * * "m" - month
     * * "y" - year
     *
     * @default "s"
     * @param {string}  baseUnit  A base unit
     */
    baseUnit: string;
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
}
