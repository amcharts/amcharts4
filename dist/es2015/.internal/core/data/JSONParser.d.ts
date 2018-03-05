/**
 * JSON parser.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { DataParser, IDataParserOptions } from "./DataParser";
import { DateFormatter } from "../formatters/DateFormatter";
/**
 * Defines options for JSON format parser
 */
export interface IJSONOptions extends IDataParserOptions {
    /**
     * A list of fields that should be treaded as numeric.
     *
     * Any information container in such fields will be converted to `number`.
     *
     * @type {string[]}
     */
    numberFields?: string[];
    /**
     * A list of fields that hold date/time infromation.
     *
     * Parser will try to convert such fields into `Date` objects.
     *
     * @type {string[]}
     */
    dateFields?: string[];
    /**
     * A date formatted to be used when parsing dates.
     *
     * @type {DateFormatter}
     */
    dateFormatter?: DateFormatter;
}
/**
 * A parser for JSON.
 *
 * @important
 */
export declare class JSONParser extends DataParser {
    /**
     * Tests if the data is valid JSON.
     *
     * @param  {string}   data  Source data
     * @return {boolean}        Is it JSON?
     */
    static isJSON(data: string): boolean;
    /**
     * Content-type suitable for JSON format.
     *
     * @type {string}
     */
    type: string;
    /**
     * Parser options.
     *
     * @see {@link IJSONOptions} for description of each option
     * @type {IJSONOptions}
     */
    options: IJSONOptions;
    /**
     * Parses and returns data.
     *
     * @param  {string}  data  Unparsed data
     * @return {any}           Parsed data
     */
    parse(data: string): any;
}
