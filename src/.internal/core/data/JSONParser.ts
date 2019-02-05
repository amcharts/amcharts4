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
import * as $object from "../utils/Object";
import * as $type from "../utils/Type";


/**
 * Defines options for JSON format parser
 */
export interface IJSONOptions extends IDataParserOptions {

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
 * A parser for JSON.
 *
 * @important
 */
export class JSONParser extends DataParser {

	/**
	 * Tests if the data is valid JSON.
	 *
	 * @param data  Source data
	 * @return Is it JSON?
	 */
	static isJSON(data: string): boolean {
		try {

			// Try parsing JSON
			JSON.parse(data);

			// If we got to this point it means it's a valid JSON
			return true;
		}
		catch (e) {
			return false;
		}
	}

	/**
	 * Content-type suitable for JSON format.
	 */
	public contentType: string = "application/json";

	/**
	 * Parser options.
	 *
	 * @see {@link IJSONOptions} for description of each option
	 */
	public options: IJSONOptions = {};

	/**
	 * Parses and returns data.
	 *
	 * @param data  Unparsed data
	 * @return Parsed data
	 */
	public parse(data: string): any {

		// Init return
		let res: any;

		// Try parsing
		try {
			if ($type.hasValue(JSON)) {
				res = JSON.parse(data);
			}
		} catch (e) {
			return undefined;
		}

		// Do we need to cast some fields to numbers or dates?
		let empty = $type.hasValue(this.options.emptyAs);
		let numbers = this.parsableNumbers;
		let dates = this.parsableDates;
		if (Array.isArray(res) && (numbers || dates || empty)) {

			// Iterate through the data and check if it needs to be converted
			for (let i = 0, len = res.length; i < len; i++) {
				let row = res[i];
				$object.each(row, (key, value) => {
					if (empty) {
						row[key] = this.maybeToEmpty(row[key]);
					}
					if (numbers) {
						row[key] = this.maybeToNumber(key, row[key]);
					}
					if (dates) {
						row[key] = this.maybeToDate(key, row[key]);
					}
				});
			}

		}

		// Convert to array
		//return Array.isArray(res) ? res : [res];
		return res;

	}

}
