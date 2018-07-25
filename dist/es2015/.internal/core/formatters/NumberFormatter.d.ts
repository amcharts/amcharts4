/**
 * Number formatting-related functionality.
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
 * NumberFormatter class. Formats numbers according to specified formats.
 *
 * @todo Apply translations to suffixes/prefixes
 */
export declare class NumberFormatter extends BaseObject {
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
     * @default #,###.#####
     */
    protected _numberFormat: string;
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
     * Holds big number prefixes to apply to numbers if `a` modifier is used in
     * format.
     *
     * @type {Array}
     */
    protected _bigNumberPrefixes: {
        "number": number;
        "suffix": string;
    }[];
    /**
     * Holds small number prefixes to apply to numbers if `a` modifier is used in
     * format.
     *
     * @type {Array}
     */
    protected _smallNumberPrefixes: {
        "number": number;
        "suffix": string;
    }[];
    /**
     * Holds prefixes to apply to data size numbers if `b` modifier is used in
     * format.
     *
     * @type {Array}
     */
    protected _bytePrefixes: {
        "number": number;
        "suffix": string;
    }[];
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
    dispose(): void;
    /**
     * Formats the number according to specific format.
     *
     * @param  {number | string}  value   Value to format
     * @param  {string}           format  Format to apply
     * @return {string}                   Formatted number
     */
    format(value: number | string, format?: string): string;
    /**
     * Parses supplied format into structured object which can be used to format
     * the number.
     *
     * @param {string} format Format string, i.e. "#,###.00"
     * @param {Language} language Language
     */
    protected parseFormat(format: string, language: Language): any;
    /**
     * Applies parsed format to a numeric value.
     *
     * @param  {number}  value    Value
     * @param  {any}     details  Parsed format as returned by {parseFormat}
     * @return {string}          Formatted number
     */
    protected applyFormat(value: number, details: any): string;
    /**
     * Chooses appropriate prefix and suffix based on the passed in rules.
     *
     * @param  {number}  value     Value
     * @param  {any[]}   prefixes  Prefix array
     * @return {any}               Result
     */
    protected applyPrefix(value: number, prefixes: any[]): any[];
    /**
     * Invalidates the parent [[Sprite]] object.
     */
    protected invalidateSprite(): void;
    /**
     * @return {string} A format to use for number formatting
     */
    /**
     * Number format.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
     * @param {string}  format  A format to use for number formatting
     */
    numberFormat: string;
    /**
     * @return {any[]} Prefixes for big numbers
     */
    /**
     * Prefixes for big numbers.
     *
     * It's an array of objects of number/prefix pairs.
     *
     * ```JSON
     * [
     *   { "number": 1e+3, "suffix": "K" },
     *   { "number": 1e+6, "suffix": "M" },
     *   { "number": 1e+9, "suffix": "G" },
     *   { "number": 1e+12, "suffix": "T" },
     *   { "number": 1e+15, "suffix": "P" },
     *   { "number": 1e+18, "suffix": "E" },
     *   { "number": 1e+21, "suffix": "Z" },
     *   { "number": 1e+24, "suffix": "Y" }
     * ]
     * ```
     *
     * If the number is bigger than the `number` ir will be converted to the
     * appropriate bigger number with prefix.
     *
     * E.g. as per above `1500` will be converted to `1.5K`.
     *
     * Please note that for this transformation to be enabled, you need to
     * enable it specific modifier in your format setting.
     *
     * The modifier for big/small number modification is "a":
     *
     * ```Text
     * {myfield.formatNumber("#,###.00a")}
     * ```
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
     * @param {any[]}  prefixes  Prefixes for big numbers
     */
    bigNumberPrefixes: any[];
    /**
     * @return {any[]} Prefixes for small numbers
     */
    /**
     * Prefixes for big numbers.
     *
     * It's an array of objects of number/prefix pairs.
     *
     * ```JSON
     * [
     *   { "number": 1e-24, "suffix": "y" },
     *   { "number": 1e-21, "suffix": "z" },
     *   { "number": 1e-18, "suffix": "a" },
     *   { "number": 1e-15, "suffix": "f" },
     *   { "number": 1e-12, "suffix": "p" },
     *   { "number": 1e-9, "suffix": "n" },
     *   { "number": 1e-6, "suffix": "μ" },
     *   { "number": 1e-3, "suffix": "m" }
     * ]
     * ```
     *
     * If the number is smaller than the `number` ir will be converted to the
     * appropriate smaller number with prefix.
     *
     * E.g. as per above `0.0015` will be converted to `1.5m`.
     *
     * Please note that for this transformation to be enabled, you need to
     * enable it specific modifier in your format setting.
     *
     * The modifier for big/small number modification is "a":
     *
     * ```Text
     * {myfield.formatNumber("#,###.00a")}
     * ```
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
     * @param {any[]}  prefixes  Prefixes for small numbers
     */
    smallNumberPrefixes: any[];
    /**
     * @return {any[]} Prefixes for byte-size formatting
     */
    /**
     * Basically the same as `bigNumberPrefixes`, except base for calculation
     * is not thousand but byte (1024).
     *
     * The modifier is "b".
     *
     *  ```Text
     * {myfield.formatNumber("#,###.00b")}
     * ```
     *
     * The above `2048` will change to `2K`.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
     * @param {any[]}  prefixes  Prefixes for byte-size formatting
     */
    bytePrefixes: any[];
    /**
     * @ignore Exclude from docs
     * @return {string} Output format
     */
    /**
     * Ooutput format: "svg" or "html".
     *
     * @ignore Exclude from docs
     * @param {string}  value  Output format
     */
    outputFormat: string;
    /**
     * Replaces brackets with temporary placeholders.
     *
     * @ignore Exclude from docs
     * @param  {string}  text  Input text
     * @return {string}        Escaped text
     */
    escape(text: string): string;
    /**
     * Replaces placeholders back to brackets.
     *
     * @ignore Exclude from docs
     * @param  {string}  text  Escaped text
     * @return {string}        Unescaped text
     */
    unescape(text: string): string;
}
