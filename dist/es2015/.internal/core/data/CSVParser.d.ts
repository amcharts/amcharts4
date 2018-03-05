/**
 * CSV parser.
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
 * Defines options for CSV format parser
 */
export interface ICSVOptions extends IDataParserOptions {
    /**
     * A delimiter character for columns.
     *
     * @default ','
     * @type {string}
     */
    delimiter?: string;
    /**
     * The data is in reverse order.
     *
     * If iset to `true`, parser will invert the order of the data items before
     * passing back the data.
     *
     * @default false
     * @type {number}
     */
    reverse?: boolean;
    /**
     * Skip a number of rows from the beginning of the data.
     *
     * Useful if your data contains non-data headers, such as column names.
     *
     * @default 0
     * @type {number}
     */
    skipRows?: number;
    /**
     * Skip empty rows.
     *
     * If set to `false`, parser will generate empty data points for empty rows
     * in data.
     *
     * @default true
     * @type {boolean}
     */
    skipEmpty?: boolean;
    /**
     * Use the first row in data to generte column names.
     *
     * Normally, parser will name each column `col0`, `col1`, etc.
     *
     * Setting this to `true` will make the parser look at the first row, for
     * actual column names.
     *
     * @default false
     * @type {boolean}
     */
    useColumnNames?: boolean;
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
 * A parser for CSV format.
 *
 * @important
 */
export declare class CSVParser extends DataParser {
    /**
     * Tests if the format is CSV.
     *
     * @param  {string}   data  Source data
     * @return {boolean}        Is it CSV?
     */
    static isCSV(data: string): boolean;
    /**
     * Tries to determine a column separator.
     *
     * @param  {string}  data  Source data
     * @return {string}        Separator
     */
    static getDelimiterFromData(data: string): string;
    /**
     * Content-type suitable for CSV format.
     *
     * @type {string}
     */
    type: string;
    /**
     * Parser options.
     *
     * @see {@link ICSVOptions} for description of each option
     * @type {ICSVOptions}
     */
    options: ICSVOptions;
    /**
     * Parses and returns data.
     *
     * @param  {string}  data  Unparsed data
     * @return {any}           Parsed data
     */
    parse(csv: string): any[];
    /**
     * Converts CSV into array.
     *
     * The functionality of this function is taken from here:
     * http://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
     *
     * @param  {string}  data       Source data
     * @param  {string}  delimiter  Column delimiter
     * @return {any[]}              Parsed array
     */
    CSVToArray(data: string, delimiter: string): any[];
}
