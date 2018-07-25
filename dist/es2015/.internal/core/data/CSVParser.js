/**
 * CSV parser.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { DataParser } from "./DataParser";
import * as $type from "../utils/Type";
/**
 * Define possible separators.
 */
var separators = [",", ";", "\t"];
/**
 * A parser for CSV format.
 *
 * @important
 */
var CSVParser = /** @class */ (function (_super) {
    tslib_1.__extends(CSVParser, _super);
    function CSVParser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Content-type suitable for CSV format.
         *
         * @type {string}
         */
        _this.type = "text/csv";
        /**
         * Parser options.
         *
         * @see {@link ICSVOptions} for description of each option
         * @type {ICSVOptions}
         */
        _this.options = {
            delimiter: "",
            reverse: false,
            skipRows: 0,
            skipEmpty: true,
            useColumnNames: false
        };
        return _this;
    }
    /**
     * Tests if the format is CSV.
     *
     * @param  {string}   data  Source data
     * @return {boolean}        Is it CSV?
     */
    CSVParser.isCSV = function (data) {
        return CSVParser.getDelimiterFromData(data) ? true : false;
    };
    /**
     * Tries to determine a column separator.
     *
     * @param  {string}  data  Source data
     * @return {string}        Separator
     */
    CSVParser.getDelimiterFromData = function (data) {
        // We're going to take first few lines of the CSV with different
        // possible separators and check if it results in same number of columns.
        // If it does, we're going to assume it's a CSV
        var lines = data.split("\n");
        var separator;
        try {
            // TODO replace with iterators
            for (var separators_1 = tslib_1.__values(separators), separators_1_1 = separators_1.next(); !separators_1_1.done; separators_1_1 = separators_1.next()) {
                var sep = separators_1_1.value;
                var columns = 0, lineColums = 0;
                for (var i in lines) {
                    // Get number of columns in a line
                    columns = lines[i].split(sep).length;
                    if (columns > 1) {
                        // More than one column - possible candidate
                        if (lineColums === 0) {
                            // First line
                            lineColums = columns;
                        }
                        else if (columns != lineColums) {
                            // Incorrect number of columns, give up on this separator
                            lineColums = 0;
                            break;
                        }
                    }
                    else {
                        // Not this separator
                        // Not point in continuing
                        lineColums = 0;
                        break;
                    }
                }
                // Check if we have a winner
                if (lineColums) {
                    separator = sep;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (separators_1_1 && !separators_1_1.done && (_a = separators_1.return)) _a.call(separators_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return separator;
        var e_1, _a;
    };
    /**
     * Parses and returns data.
     *
     * @param  {string}  data  Unparsed data
     * @return {any}           Parsed data
     */
    CSVParser.prototype.parse = function (csv) {
        // Check if we have delimiter set
        if (!this.options.delimiter) {
            this.options.delimiter = CSVParser.getDelimiterFromData(csv);
        }
        // Get CSV data as array
        var data = this.CSVToArray(csv, this.options.delimiter);
        // Do we need to cast some fields to numbers?
        var empty = $type.hasValue(this.options.emptyAs);
        var numbers = this.parsableNumbers;
        var dates = this.parsableDates;
        // Init resuling array
        var res = [], cols = [], col, i;
        // First row holds column names?
        if (this.options.useColumnNames) {
            cols = data.shift();
            // Normalize column names
            for (var x = 0; x < cols.length; x++) {
                // trim
                col = cols[x].replace(/^\s+|\s+$/gm, "");
                // Check for empty
                if ("" === col)
                    col = "col" + x;
                cols[x] = col;
            }
            if (0 < this.options.skipRows)
                this.options.skipRows--;
        }
        // Skip rows
        for (i = 0; i < this.options.skipRows; i++)
            data.shift();
        // Iterate through the result set
        var row;
        while ((row = this.options.reverse ? data.pop() : data.shift())) {
            if (this.options.skipEmpty && row.length === 1 && row[0] === "")
                continue;
            var dataPoint = {};
            for (i = 0; i < row.length; i++) {
                col = undefined === cols[i] ? "col" + i : cols[i];
                dataPoint[col] = row[i] === "" ? this.options.emptyAs : row[i];
                // Convert
                if (empty) {
                    row[col] = this.maybeToEmpty(dataPoint[col]);
                }
                if (numbers) {
                    row[col] = this.maybeToNumber(col, dataPoint[col]);
                }
                if (dates) {
                    row[col] = this.maybeToDate(col, dataPoint[col]);
                }
            }
            res.push(dataPoint);
        }
        return res;
    };
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
    CSVParser.prototype.CSVToArray = function (data, delimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        delimiter = (delimiter || ',');
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp((
        // Delimiters.
        "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + delimiter + "\\r\\n]*))"), "gi");
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [
            []
        ];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while ((arrMatches = objPattern.exec(data))) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length &&
                (strMatchedDelimiter !== delimiter)) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            var strMatchedValue = void 0;
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
            }
            else {
                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    };
    return CSVParser;
}(DataParser));
export { CSVParser };
//# sourceMappingURL=CSVParser.js.map