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
import * as $type from "../utils/Type";
import * as $array from "../utils/Array";

/**
 * Defines options for CSV format parser
 */
export interface ICSVOptions extends IDataParserOptions {

	/**
	 * A delimiter character for columns.
	 *
	 * @default ','
	 */
	delimiter?: string;

	/**
	 * The data is in reverse order.
	 *
	 * If iset to `true`, parser will invert the order of the data items before
	 * passing back the data.
	 *
	 * @default false
	 */
	reverse?: boolean;

	/**
	 * Skip a number of rows from the beginning of the data.
	 *
	 * Useful if your data contains non-data headers, such as column names or
	 * empty rows.
	 *
	 * @default 0
	 */
	skipRows?: number;

	/**
	 * Skip empty rows.
	 *
	 * If set to `false`, parser will generate empty data points for empty rows
	 * in data.
	 *
	 * @default true
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
	 * Please note that if you use it with `skipRows`, the specified number of
	 * rows will be removed, then the parser will look for column names in the
	 * first row of what's left.
	 *
	 * @default false
	 */
	useColumnNames?: boolean;

	/**
	 * A list of fields that should be treaded as numeric.
	 *
	 * Any information container in such fields will be converted to `number`.
	 */
	numberFields?: string[];

	/**
	 * A list of fields that hold date/time infromation.
	 *
	 * Parser will try to convert such fields into `Date` objects.
	 */
	dateFields?: string[];

	/**
	 * A date formatted to be used when parsing dates.
	 */
	dateFormatter?: DateFormatter;
}

/**
 * Define possible separators.
 */
let separators = [",", ";", "\t"];

/**
 * A parser for CSV format.
 *
 * @important
 */
export class CSVParser extends DataParser {

	/**
	 * Tests if the format is CSV.
	 *
	 * @param data  Source data
	 * @return Is it CSV?
	 */
	static isCSV(data: string): boolean {
		return CSVParser.getDelimiterFromData(data) ? true : false;
	}

	/**
	 * Tries to determine a column separator.
	 *
	 * @param data  Source data
	 * @return Separator
	 */
	static getDelimiterFromData(data: string): string {

		// We're going to take first few lines of the CSV with different
		// possible separators and check if it results in same number of columns.
		// If it does, we're going to assume it's a CSV
		let lines = data.split("\n");
		let len = lines.length;
		let separator: string;

		$array.each(separators, (sep) => {
			let columns = 0,
				lineColums = 0;

			// TODO replace with iterators
			for (let i = 0; i < len; ++i) {

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
		});

		return separator;
	}

	/**
	 * Content-type suitable for CSV format.
	 */
	public contentType: string = "text/csv";

	/**
	 * Parser options.
	 *
	 * @see {@link ICSVOptions} for description of each option
	 */
	public options: ICSVOptions = {
		delimiter: "",
		reverse: false,
		skipRows: 0,
		skipEmpty: true,
		useColumnNames: false
	};

	/**
	 * Parses and returns data.
	 *
	 * @param data  Unparsed data
	 * @return Parsed data
	 */
	public parse(csv: string): any[] {

		// Check if we have delimiter set
		if (!this.options.delimiter) {
			this.options.delimiter = CSVParser.getDelimiterFromData(csv);
		}

		// Get CSV data as array
		let data = this.CSVToArray(csv, this.options.delimiter);

		// Do we need to cast some fields to numbers?
		let empty = $type.hasValue(this.options.emptyAs);
		let numbers = this.parsableNumbers;
		let dates = this.parsableDates;

		// Init resuling array
		let res: any[] = [],
			cols: string[] = [],
			col: string,
			i: number;

		// Skip rows
		for (i = 0; i < this.options.skipRows; i++) {
			data.shift();
		}

		// First row holds column names?
		if (this.options.useColumnNames) {
			cols = data.shift();

			// Normalize column names
			for (let x = 0; x < cols.length; x++) {
				// trim
				col = $type.hasValue(cols[x]) ? cols[x].replace(/^\s+|\s+$/gm, "") : "";

				// Check for empty
				if ("" === col) {
					col = "col" + x;
				}

				cols[x] = col;
			}
		}

		// Iterate through the result set
		let row;
		while (true) {
			row = this.options.reverse ? data.pop() : data.shift();

			if (!row) {
				break;
			}

			if (this.options.skipEmpty && row.length === 1 && row[0] === "") {
				continue;
			}

			let dataPoint: any = {};
			for (i = 0; i < row.length; i++) {
				col = undefined === cols[i] ? "col" + i : cols[i];
				dataPoint[col] = row[i] === "" ? this.options.emptyAs : row[i];

				// Convert
				if (empty) {
					dataPoint[col] = this.maybeToEmpty(dataPoint[col]);
				}
				if (numbers) {
					dataPoint[col] = this.maybeToNumber(col, dataPoint[col]);
				}
				if (dates) {
					dataPoint[col] = this.maybeToDate(col, dataPoint[col]);
				}

			}
			res.push(dataPoint);
		}

		return res;
	}

	/**
 	 * Converts CSV into array.
 	 *
 	 * The functionality of this function is taken from here:
 	 * http://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
 	 *
 	 * @param data       Source data
 	 * @param delimiter  Column delimiter
 	 * @return Parsed array
 	 */
	public CSVToArray(data: string, delimiter: string): any[] {

		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		delimiter = (delimiter || ',');

		// Create a regular expression to parse the CSV values.
		let objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + delimiter + "|\\r?\\n|\\r|^)" +

				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

				// Standard fields.
				"([^\"\\" + delimiter + "\\r\\n]*))"
			),
			"gi"
		);


		// Create an array to hold our data. Give the array
		// a default empty first row.
		let arrData: any[] = [
			[]
		];

		// Create an array to hold our individual pattern
		// matching groups.
		let arrMatches = null;

		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (true) {
			arrMatches = objPattern.exec(data);

			if (!arrMatches) {
				break;
			}

			// Get the delimiter that was found.
			let strMatchedDelimiter = arrMatches[1];

			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (
				strMatchedDelimiter.length &&
				(strMatchedDelimiter !== delimiter)
			) {

				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push([]);

			}

			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			let strMatchedValue;
			if (arrMatches[2]) {

				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				strMatchedValue = arrMatches[2].replace(
					new RegExp("\"\"", "g"),
					"\""
				);

			} else {

				// We found a non-quoted value.
				strMatchedValue = arrMatches[3];

			}

			// Now that we have our value string, let's add
			// it to the data array.
			arrData[arrData.length - 1].push(strMatchedValue);
		}

		// Return the parsed data.
		return (arrData);
	}

}
