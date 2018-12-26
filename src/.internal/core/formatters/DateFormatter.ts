/**
 * Handles date and time formatting
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../Sprite";
import { Language, ILocaleProperties } from "../utils/Language";
import { BaseObject } from "../Base";
import { ITextChunk, getTextFormatter } from "../formatters/TextFormatter";
import { registry } from "../Registry";
import * as $strings from "../utils/Strings";
import * as $utils from "../utils/Utils";
import * as $type from "../utils/Type";

/**
 * Interface describing parsed date format definition.
 */
export interface DateFormatInfo {
	"template": string;
	"parts": any[];
}

/**
 * Month names.
 *
 * @type {string}
 */
export type MonthNames = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";

/**
 * Short month names.
 *
 * @param {string}
 */
export type ShortMonthNames = "Jan" | "Feb" | "Mar" | "Apr" | "May(short)" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

/**
 * Weekedays.
 *
 * @type {string}
 */
export type Weekdays = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

/**
 * Short weekday names.
 *
 * @type {string}
 */
export type ShortWeekdays = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

/**
 * Handles date and time formatting.
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-date-time/} Tutorial on date/time formatting
 * @todo Better type casting of passed in date?
 * @todo Quarter support?
 * @todo When parsing named months make the search case-insensitive
 * @todo Escape a.m./p.m. properly when used in RegEx
 */
export class DateFormatter extends BaseObject {

	/**
	 * Date format.
	 *
	 * @type {string}
	 */
	protected _dateFormat: string = "yyyy-MM-dd";

	/**
	 * Input date format.
	 *
	 * @type {string}
	 */
	protected _inputDateFormat: string = "yyyy-MM-dd";

	/**
	 * Assume UTC time zone.
	 *
	 * @type {boolean}
	 */
	protected _utc: boolean = false;

	/**
	 * First day of week.
	 *
	 * 0 - Sunday
	 * 1 - Monday
	 *
	 * Etc.
	 *
	 * @type {number}
	 */
	protected _firstDayOfWeek: number = 1;

	/**
	 * A list of month names.
	 *
	 * @type {Array<MonthNames>}
	 */
	protected _months: Array<MonthNames> = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	/**
	 * A list of short month names.
	 *
	 * @param {Array<ShortMonthNames>}
	 */
	protected _monthsShort: Array<ShortMonthNames> = ["Jan", "Feb", "Mar", "Apr", "May(short)", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	/**
	 * A list of weekday names.
	 *
	 * @type {Array<Weekdays>}
	 */
	protected _weekdays: Array<Weekdays> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	/**
	 * A list of short weekday names.
	 *
	 * @type {Array<ShortWeekdays>}
	 */
	protected _weekdaysShort: Array<ShortWeekdays> = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
	protected _outputFormat: string = "svg";

	/**
	 * Holds reference to parent [[Sprite]] object.
	 *
	 * @type {Optional<Sprite>}
	 */
	public sprite: $type.Optional<Sprite>;

	/**
	 * Holds reference to [[Language]] object.
	 *
	 * @type {Optional<Language>}
	 */
	public language: $type.Optional<Language>;


	/**
	 * Should the first letter of the formatted date be capitalized?
	 *
	 * @default true
	 * @type {boolean}
	 */
	public capitalize: boolean = true;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "DateFormatter";
		this.applyTheme();
	}

	/**
	 * Formats the date value according to specified format.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-date-time/} Tutorial on date/time formatting
	 * @param  {any}     source  Date value
	 * @param  {string}  format  Format
	 * @return {string}          Formatted date string
	 */
	public format(source: any, format?: string): string {

		// No language?
		if (!this.language) {
			if (this.sprite) {
				this.language = this.sprite.language;
			}
			else {
				this.language = new Language;
			}
		}

		// No format passed in or it's empty
		if (typeof format === "undefined" || format === "") {
			format = this._dateFormat;
		}

		// Clean format
		format = $utils.cleanFormat(format);

		// get format info (it will also deal with parser caching)
		let info = this.parseFormat(format);

		// Do any casting if required
		// This will take care of timestamps as well as Date objects
		let date: Date = $utils.anyToDate(source);

		// Check if it's a valid date
		if (!$type.isNumber(date.getTime())) {
			return this.language.translate("Invalid date");
		}

		// Apply format
		let formatted = this.applyFormat(date, info, this.language);


		// Capitalize
		if (this.capitalize) {
			formatted = formatted.replace(
				/^.{1}/, formatted.substr(0, 1).toUpperCase()
			);
		}

		// We're done
		return formatted;
	}

	/**
	 * Parses format into structured infromation.
	 *
	 * @param {string} format Format template
	 */
	protected parseFormat(format: string): DateFormatInfo {

		// Check cache
		let cached = this.getCache(format);
		if ($type.hasValue(cached)) {
			return cached;
		}

		// Init format parse info holder
		let info: DateFormatInfo = {
			"template": "",
			"parts": <any>[]
		};

		// Let TextFormatter split into chunks
		let chunks: ITextChunk[] = getTextFormatter().chunk(format, true);
		for (let i: number = 0; i < chunks.length; i++) {
			let chunk: ITextChunk = chunks[i];

			if (chunk.type === "value") {

				// Just "Date"?
				if (chunk.text.match(/^date$/i)) {
					chunk.text = this._dateFormat;
				}

				// Find all possible parts
				let matches = chunk.text.match(/G|yyyy|yyy|yy|y|YYYY|YYY|YY|Y|u|MMMMM|MMMM|MMM|MM|M|ww|w|W|dd|d|DDD|DD|D|F|g|EEEEE|EEEE|EEE|EE|E|eeeee|eeee|eee|ee|e|aaa|aa|a|hh|h|HH|H|KK|K|kk|k|mm|m|ss|s|SSS|SS|S|A|zzzz|zzz|zz|z|ZZ|Z|t|x|nnn|nn|n|i|I/g);

				// Found?
				if (matches) {

					// Populate template
					for (let x = 0; x < matches.length; x++) {
						info.parts.push(matches[x]);
						chunk.text = chunk.text.replace(matches[x], $strings.PLACEHOLDER);
					}

				}

			}

			// Apply to template
			info.template += chunk.text;
		}

		// Apply style formatting
		//info.template = getTextFormatter().format(info.template, this.outputFormat);

		// Save cache
		this.setCache(format, info);

		return info;
	}

	/**
	 * Applies format to Date.
	 *
	 * @param  {Date}            date      Date object
	 * @param  {DateFormatInfo}  info      Parsed format information
	 * @param  {Language}        language  Language
	 * @return {string}                    Formatted date string
	 */
	protected applyFormat(date: Date, info: DateFormatInfo, language: Language): string {

		// Init return value
		let res = info.template;

		// Get values
		let fullYear: number,
			month: number,
			weekday: number,
			day: number,
			hours: number,
			minutes: number,
			seconds: number,
			milliseconds: number,
			offset: number = date.getTimezoneOffset(),
			timestamp: number = date.getTime();
		if (this.utc) {
			fullYear = date.getUTCFullYear();
			month = date.getUTCMonth();
			weekday = date.getUTCDay();
			day = date.getUTCDate();
			hours = date.getUTCHours();
			minutes = date.getUTCMinutes();
			seconds = date.getUTCSeconds();
			milliseconds = date.getUTCMilliseconds();
		}
		else {
			fullYear = date.getFullYear();
			month = date.getMonth();
			weekday = date.getDay();
			day = date.getDate();
			hours = date.getHours();
			minutes = date.getMinutes();
			seconds = date.getSeconds();
			milliseconds = date.getMilliseconds();
		}

		// Go through each part and format/replace it in template
		for (let i = 0, len = info.parts.length; i < len; i++) {
			let value: string = "";
			switch (info.parts[i]) {

				case "G":
					value = language.translate(
						fullYear < 0
							? "_era_bc"
							: "_era_ad"
					);
					break;

				case "yyyy":
					value = Math.abs(fullYear).toString();
					if (fullYear < 0) {
						value += language.translate("_era_bc");
					}
					break;

				case "yyy":
				case "yy":
				case "y":
					value = Math.abs(fullYear).toString().substr(-info.parts[i].length);
					if (fullYear < 0) {
						value += language.translate("_era_bc");
					}
					break;

				case "YYYY":
				case "YYY":
				case "YY":
				case "Y":
					let week = $utils.getWeek(date);
					let year = fullYear;
					if (week == 1 && weekday > 1) {
						year++;
					}
					if (info.parts[i] == "YYYY") {
						value = Math.abs(year).toString();
					}
					else {
						value = Math.abs(year).toString().substr(-info.parts[i].length);
					}
					if (year < 0) {
						value += language.translate("_era_bc");
					}
					break;

				case "u":
					// @todo
					break;

				case "MMMMM":
					value = language.translate(this._months[month]).substr(0, 1);
					break;

				case "MMMM":
					value = language.translate(this._months[month]);
					break;

				case "MMM":
					value = language.translate(this._monthsShort[month]);
					break;

				case "MM":
					value = $utils.padString(month + 1, 2, "0");
					break;

				case "M":
					value = (month + 1).toString();
					break;

				case "ww":
					value = $utils.padString($utils.getWeek(date, this.utc), 2, "0");
					break;

				case "w":
					value = $utils.getWeek(date, this.utc).toString();
					break;

				case "W":
					value = $utils.getMonthWeek(date, this.utc).toString();
					break;

				case "dd":
					value = $utils.padString(day, 2, "0");
					break;

				case "d":
					value = day.toString();
					break;

				case "DD":
				case "DDD":
					value = $utils.padString($utils.getYearDay(date, this.utc).toString(), info.parts[i].length, "0");
					break;

				case "D":
					value = $utils.getYearDay(date, this.utc).toString();
					break;

				case "F":
					// @todo
					break;

				case "g":
					// @todo
					break;

				case "t":
					value = language.translateFunc("_dateOrd").call(this, day);
					break;

				case "E":
					value = (weekday || 7).toString();
					break;

				case "EE":
					value = $utils.padString((weekday || 7).toString(), 2, "0");
					break;

				case "EEE":
				case "eee":
					value = language.translate(this._weekdaysShort[weekday]);
					break;

				case "EEEE":
				case "eeee":
					value = language.translate(this._weekdays[weekday]);
					break;

				case "EEEEE":
				case "eeeee":
					value = language.translate(this._weekdays[weekday]).substr(0, 1);
					break;

				case "e":
				case "ee":
					value = (weekday - this.firstDayOfWeek + 1).toString();
					if (info.parts[i] == "ee") {
						value = $utils.padString(value, 2, "0");
					}
					break;

				case "a":
					if (hours >= 12) {
						value = language.translate("PM");
					}
					else {
						value = language.translate("AM");
					}
					break;

				case "aa":
					if (hours >= 12) {
						value = language.translate("P.M.");
					}
					else {
						value = language.translate("A.M.");
					}
					break;

				case "aaa":
					if (hours >= 12) {
						value = language.translate("P");
					}
					else {
						value = language.translate("A");
					}
					break;

				case "h":
					value = $utils.get12Hours(hours).toString();
					break;

				case "hh":
					value = $utils.padString($utils.get12Hours(hours), 2, "0");
					break;

				case "H":
					value = hours.toString();
					break;

				case "HH":
					value = $utils.padString(hours, 2, "0");
					break;

				case "K":
					value = $utils.get12Hours(hours, 0).toString();
					break;

				case "KK":
					value = $utils.padString($utils.get12Hours(hours, 0), 2, "0");
					break;

				case "k":
					value = (hours + 1).toString();
					break;

				case "kk":
					value = $utils.padString(hours + 1, 2, "0");
					break;

				case "m":
					value = minutes.toString();
					break;

				case "mm":
					value = $utils.padString(minutes, 2, "0");
					break;

				case "s":
					value = seconds.toString();
					break;

				case "ss":
					value = $utils.padString(seconds, 2, "0");
					break;

				case "S":
				case "SS":
				case "SSS":
					value = Math.round((milliseconds / 1000) * Math.pow(10, info.parts[i].length)).toString();
					break;

				case "x":
					value = timestamp.toString();
					break;

				case "n":
				case "nn":
				case "nnn":
					value = $utils.padString(milliseconds, info.parts[i].length, "0");
					break;

				case "z":
					value = $utils.getTimeZone(date, false, false, this.utc);
					break;

				case "zz":
					value = $utils.getTimeZone(date, true, false, this.utc);
					break;

				case "zzz":
					value = $utils.getTimeZone(date, false, true, this.utc);
					break;

				case "zzzz":
					value = $utils.getTimeZone(date, true, true, this.utc);
					break;

				case "Z":
				case "ZZ":
					let tz = Math.abs(offset) / 60;
					let tzh = Math.floor(tz);
					let tzm = tz * 60 - tzh * 60;

					if (info.parts[i] == "Z") {
						value = "GMT";
						value += offset > 0 ? "-" : "+";
						value += $utils.padString(tzh, 2) + ":" + $utils.padString(tzm, 2);
					}
					else {
						value = offset > 0 ? "-" : "+";
						value += $utils.padString(tzh, 2) + $utils.padString(tzm, 2);
					}
					break;

				case "i":
					value = date.toISOString();
					break;

				case "I":
					value = date.toUTCString();
					break;

			}
			res = res.replace($strings.PLACEHOLDER, value);
		}

		return res;
	}

	/**
	 * Parses any input value into Date object.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-date-time/#Parsing_Dates} Tutorial on date/time parsing
	 * @param  {any}     source  Source value
	 * @param  {string}  format  Source format
	 * @return {Date}            Date object
	 */
	public parse(source: any, format?: string): Date {

		// Format set?
		if (!$type.hasValue(format)) {
			format = this.inputDateFormat;
		}

		// Is it already a Date
		if (source instanceof Date) {
			return source;
		}

		// Is it a numeric timestamp
		if (typeof source === "number") {
			return new Date(source);
		}

		// No? Let's check if it's string, and try converting to it if nec
		if (typeof source !== "string") {
			source = source.toString();
		}

		// no language?
		if (!this.language) {
			if (this.sprite) {
				this.language = this.sprite.language;
			}
			else {
				this.language = new Language;
			}
		}

		// Init return value
		let res: Date = new Date(1970, 0, 1, 0, 0, 0);

		// Init RegEx for parsing
		let reg: string = "";

		// Clean format
		format = $utils.cleanFormat(format);

		// Parse format
		let info = this.parseFormat(format);

		// Init parsed items holder
		let parsedIndexes = {
			"year": -1,
			"year3": -1,
			"year2": -1,
			"year1": -1,
			"month": -1,
			"monthShort": -1,
			"monthLong": -1,
			"weekdayShort": -1,
			"weekdayLong": -1,
			"day": -1,
			"yearDay": -1,
			"week": -1,
			"hourBase0": -1,
			"hour12Base0": -1,
			"hourBase1": -1,
			"hour12Base1": -1,
			"minute": -1,
			"second": -1,
			"millisecond": -1,
			"millisecondDigits": -1,
			"am": -1,
			"zone": -1,
			"timestamp": -1,
			"iso": -1
		};

		// Index adjuster
		let indexAdjust: number = 0,
			index: number = 0;

		// Iterate through all of the parts
		for (let i: number = 0; i < info.parts.length; i++) {

			// Set current match index
			index = i + indexAdjust + 1;

			switch (info.parts[i]) {

				case "yyyy":
				case "YYYY":
					reg += "([0-9]{4,})";
					parsedIndexes.year = index;
					break;

				case "yyy":
				case "YYY":
					reg += "([0-9]{3})";
					parsedIndexes.year3 = index;
					break;

				case "yy":
				case "YY":
					reg += "([0-9]{2})";
					parsedIndexes.year2 = index;
					break;

				case "y":
				case "Y":
					reg += "([0-9]{1})";
					parsedIndexes.year1 = index;
					break;

				case "MMMM":
					reg += "(" + this.getStringList(this._months).join("|") + ")";
					parsedIndexes.monthLong = index;
					break;

				case "MMM":
					reg += "(" + this.getStringList(this._monthsShort).join("|") + ")";
					parsedIndexes.monthShort = index;
					break;

				case "MM":
				case "M":
					reg += "([0-9]{2}|[0-9]{1})";
					parsedIndexes.month = index;
					break;

				case "ww":
				case "w":
					reg += "([0-9]{2}|[0-9]{1})";
					parsedIndexes.week = index;
					break;

				case "dd":
				case "d":
					reg += "([0-9]{2}|[0-9]{1})";
					parsedIndexes.day = index;
					break;

				case "DDD":
				case "DD":
				case "D":
					reg += "([0-9]{3}|[0-9]{2}|[0-9]{1})";
					parsedIndexes.yearDay = index;
					break;


				case "dddd":
					reg += "(" + this.getStringList(this._weekdays).join("|") + ")";
					parsedIndexes.weekdayLong = index;
					break;

				case "ddd":
					reg += "(" + this.getStringList(this._weekdaysShort).join("|") + ")";
					parsedIndexes.weekdayShort = index;
					break;

				case "aaa":
				case "aa":
				case "a":
					// TODO: fix (escape regex)
					reg += "(" + this.getStringList(["AM", "PM", "A\.M\.", "P\.M\.", "A", "P"]).join("|") + ")";
					parsedIndexes.am = index;
					break;

				case "hh":
				case "h":
					reg += "([0-9]{2}|[0-9]{1})";
					parsedIndexes.hour12Base1 = index;
					break;

				case "HH":
				case "H":
					reg += "([0-9]{2}|[0-9]{1})";
					parsedIndexes.hourBase0 = index;
					break;

				case "KK":
				case "K":
					reg += "([0-9]{2}|[0-9]{1})";
					parsedIndexes.hour12Base0 = index;
					break;

				case "kk":
				case "k":
					reg += "([0-9]{2}|[0-9]{1})";
					parsedIndexes.hourBase1 = index;
					break;

				case "mm":
				case "m":
					reg += "([0-9]{2}|[0-9]{1})";
					parsedIndexes.minute = index;
					break;

				case "ss":
				case "s":
					reg += "([0-9]{2}|[0-9]{1})";
					parsedIndexes.second = index;
					break;

				case "SSS":
				case "SS":
				case "S":
					reg += "([0-9]{3}|[0-9]{2}|[0-9]{1})";
					parsedIndexes.millisecond = index;
					parsedIndexes.millisecondDigits = info.parts[i].length;
					break;

				case "nnn":
				case "nn":
				case "n":
					reg += "([0-9]{3}|[0-9]{2}|[0-9]{1})";
					parsedIndexes.millisecond = index;
					break;

				case "x":
					reg += "([0-9]{1,})";
					parsedIndexes.timestamp = index;
					break;

				case "Z":
					reg += "GMT([-+]+[0-9]{2}:[0-9]{2})";
					parsedIndexes.zone = index;
					break;

				case "ZZ":
					reg += "([\\-+]+[0-9]{2}[0-9]{2})";
					parsedIndexes.zone = index;
					break;

				case "i":
					reg += "([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{3})([Zz]?)";
					parsedIndexes.iso = index;
					indexAdjust += 7;
					break;

				case "G":
				case "YYYY":
				case "YYY":
				case "YY":
				case "Y":
				case "MMMMM":
				case "W":
				case "EEEEE":
				case "EEEE":
				case "EEE":
				case "EE":
				case "E":
				case "eeeee":
				case "eeee":
				case "eee":
				case "ee":
				case "e":
				case "zzzz":
				case "zzz":
				case "zz":
				case "z":
				case "t":
					// Ignore
					indexAdjust--;
					break;
			}

			reg += "[^0-9]*";
		}

		// Try matching
		let regex = new RegExp(reg);
		let matches: RegExpMatchArray;
		if (matches = source.match(regex)) {
			// Populate the date object

			// Full year
			if (parsedIndexes.year > -1) {
				let val = parseInt(matches[parsedIndexes.year]);
				if (this.utc) {
					res.setUTCFullYear(val);
				}
				else {
					res.setFullYear(val);
				}
			}

			// 3-digit year
			if (parsedIndexes.year3 > -1) {
				let val = parseInt(matches[parsedIndexes.year3]);
				val += 1000;
				if (this.utc) {
					res.setUTCFullYear(val);
				}
				else {
					res.setFullYear(val);
				}
			}

			// 2-digit year
			if (parsedIndexes.year2 > -1) {
				let val = parseInt(matches[parsedIndexes.year2]);
				if (val > 50) {
					val += 1000;
				}
				else {
					val += 2000;
				}

				if (this.utc) {
					res.setUTCFullYear(val);
				}
				else {
					res.setFullYear(val);
				}
			}

			// 1-digit year
			if (parsedIndexes.year1 > -1) {
				let val = parseInt(matches[parsedIndexes.year1]);
				val = Math.floor((new Date().getFullYear()) / 10) * 10 + val;
				if (this.utc) {
					res.setUTCFullYear(val);
				}
				else {
					res.setFullYear(val);
				}
			}

			// Full month
			if (parsedIndexes.monthLong > -1) {
				let val = this.resolveMonth(<any>matches[parsedIndexes.monthLong]);
				if (this.utc) {
					res.setUTCMonth(val);
				}
				else {
					res.setMonth(val);
				}
			}

			// Short month
			if (parsedIndexes.monthShort > -1) {
				let val = this.resolveShortMonth(<any>matches[parsedIndexes.monthShort]);
				if (this.utc) {
					res.setUTCMonth(val);
				}
				else {
					res.setMonth(val);
				}
			}

			// Numeric month
			if (parsedIndexes.month > -1) {
				let val = parseInt(matches[parsedIndexes.month]) - 1;
				if (this.utc) {
					res.setUTCMonth(val);
				}
				else {
					res.setMonth(val);
				}
			}

			// Weekday
			// @todo

			// Week
			if ((parsedIndexes.week > -1) && (parsedIndexes.day === -1)) {
				// We parse weeks ONLY if day is not explicitly set
				// TODO: this needs work
				// (but maybe later - I can hardly imagine anyone passing their dates in weeks)
				let val = $utils.getDayFromWeek(
					parseInt(matches[parsedIndexes.week]),
					this.utc ? res.getUTCFullYear() : res.getFullYear(),
					1,
					this.utc
				);
				if (this.utc) {
					res.setUTCMonth(0);
					res.setUTCDate(val);
				}
				else {
					res.setMonth(0);
					res.setDate(val);
				}
			}

			// Day
			if (parsedIndexes.day > -1) {
				let val = parseInt(matches[parsedIndexes.day]);
				if (this.utc) {
					res.setUTCDate(val);
				}
				else {
					res.setDate(val);
				}
			}

			// Year day
			if (parsedIndexes.yearDay > -1) {
				let val = parseInt(matches[parsedIndexes.yearDay]);
				if (this.utc) {
					res.setUTCMonth(0);
					res.setUTCDate(val);
				}
				else {
					res.setMonth(0);
					res.setDate(val);
				}
			}

			// 24 Hour (0-23)
			if (parsedIndexes.hourBase0 > -1) {
				let val = parseInt(matches[parsedIndexes.hourBase0]);
				if (this.utc) {
					res.setUTCHours(val);
				}
				else {
					res.setHours(val);
				}
			}

			// 24 Hour (1-24)
			if (parsedIndexes.hourBase1 > -1) {
				let val = parseInt(matches[parsedIndexes.hourBase1]) - 1;
				if (this.utc) {
					res.setUTCHours(val);
				}
				else {
					res.setHours(val);
				}
			}

			// 12 Hour (0-11)
			if (parsedIndexes.hour12Base0 > -1) {
				let val = parseInt(matches[parsedIndexes.hour12Base0]);
				if (val == 11) {
					val = 0;
				}
				if ((parsedIndexes.am > -1) && !this.isAm(matches[parsedIndexes.am])) {
					val += 12;
				}
				if (this.utc) {
					res.setUTCHours(val);
				}
				else {
					res.setHours(val);
				}
			}

			// 12 Hour (1-12)
			if (parsedIndexes.hour12Base1 > -1) {
				let val = parseInt(matches[parsedIndexes.hour12Base1]);
				if (val == 12) {
					val = 0;
				}
				if ((parsedIndexes.am > -1) && !this.isAm(matches[parsedIndexes.am])) {
					val += 12;
				}
				if (this.utc) {
					res.setUTCHours(val);
				}
				else {
					res.setHours(val);
				}
			}

			// Minute
			if (parsedIndexes.minute > -1) {
				let val = parseInt(matches[parsedIndexes.minute]);
				if (this.utc) {
					res.setUTCMinutes(val);
				}
				else {
					res.setMinutes(val);
				}
			}

			// Second
			if (parsedIndexes.second > -1) {
				let val = parseInt(matches[parsedIndexes.second]);
				if (this.utc) {
					res.setUTCSeconds(val);
				}
				else {
					res.setSeconds(val);
				}
			}

			// Millisecond
			if (parsedIndexes.millisecond > -1) {
				let val = parseInt(matches[parsedIndexes.millisecond]);
				if (parsedIndexes.millisecondDigits == 2) {
					val *= 10;
				}
				else if (parsedIndexes.millisecondDigits == 1) {
					val *= 100;
				}
				if (this.utc) {
					res.setUTCMilliseconds(val);
				}
				else {
					res.setMilliseconds(val);
				}
			}

			// Timestamp
			if (parsedIndexes.timestamp > -1) {
				res.setTime(parseInt(matches[parsedIndexes.timestamp]))
			}

			// Adjust time zone
			if (parsedIndexes.zone > -1) {
				let zone = matches[parsedIndexes.zone].replace(/:/, "");
				let match = $type.getValue(zone.match(/([+\-]?)([0-9]{2})([0-9]{2})/));
				let dir = match[1];
				let hour = match[2];
				let minute = match[3];
				let offset = parseInt(hour) * 60 + parseInt(minute);

				// Adjust offset
				// Making it negative does not seem to make sense, but it's right
				// because of how JavaScript calculates GTM offsets
				if (dir == "+") {
					offset *= -1;
				}

				// Check the difference in offset
				let originalOffset = res.getTimezoneOffset();
				let diff = offset - originalOffset;
				if (diff != 0) {
					res.setMinutes(res.getMinutes() + diff);
				}
			}

			// ISO
			if (parsedIndexes.iso > -1) {
				if (matches[parsedIndexes.iso + 7] == "Z" || matches[parsedIndexes.iso + 7] == "z") {
					res = new Date();
					res.setUTCFullYear($type.toNumber(matches[parsedIndexes.iso + 0]));
					res.setUTCMonth($type.toNumber(matches[parsedIndexes.iso + 1]) - 1);
					res.setUTCDate($type.toNumber(matches[parsedIndexes.iso + 2]));
					res.setUTCHours($type.toNumber(matches[parsedIndexes.iso + 3]));
					res.setUTCMinutes($type.toNumber(matches[parsedIndexes.iso + 4]));
					res.setUTCSeconds($type.toNumber(matches[parsedIndexes.iso + 5]));
					res.setUTCMilliseconds($type.toNumber(matches[parsedIndexes.iso + 6]));
				}
				else {
					res = new Date(
						$type.toNumber(matches[parsedIndexes.iso + 0]),
						$type.toNumber(matches[parsedIndexes.iso + 1]) - 1,
						$type.toNumber(matches[parsedIndexes.iso + 2]),
						$type.toNumber(matches[parsedIndexes.iso + 3]),
						$type.toNumber(matches[parsedIndexes.iso + 4]),
						$type.toNumber(matches[parsedIndexes.iso + 5]),
						$type.toNumber(matches[parsedIndexes.iso + 6]),
					);
				}
			}

		}
		else {
			// Didn't match anything
			// Let's try dropping it into Date constructor and hope for the best
			res = new Date(source);
		}

		return res;
	}

	/**
	 * Resolves month name (i.e. "December") into a month number (11).
	 *
	 * @param  {MonthNames}  value  Month name
	 * @return {number}             Month number
	 */
	protected resolveMonth(value: MonthNames): number {

		// Let's try English first
		let month: number = this._months.indexOf(value);
		if (month > -1) {
			return month;
		}

		// Try the translation
		if (this.language && !this.language.isDefault()) {
			month = this.language.translateAll(this._months).indexOf(value);
			if (month > -1) {
				return month
			}
		}

		return 0;
	}

	/**
	 * Resolves short month name (i.e. "Dec") into a month number.
	 *
	 * @param  {ShortMonthNames}  value  Short month name
	 * @return {number}                  Month number
	 */
	protected resolveShortMonth(value: ShortMonthNames): number {

		// Let's try English first
		let month: number = this._monthsShort.indexOf(value);
		if (month > -1) {
			return month;
		}

		// Try the translation
		if (this.language && !this.language.isDefault()) {
			month = this.language.translateAll(this._monthsShort).indexOf(value);
			if (month > -1) {
				return month
			}
		}

		return 0;
	}

	/**
	 * Checks if passed in string represents AM/PM notation in many of its
	 * versions.
	 *
	 * @param  {string}   value  Source string
	 * @return {boolean}         Is it AM/PM?
	 */
	protected isAm(value: string): boolean {
		let list = this.getStringList(["AM", "A.M.", "A"]);
		return list.indexOf(value.toUpperCase()) > -1;
	}

	/**
	 * Invalidates related [[Sprite]] causing it to redraw.
	 */
	protected invalidateSprite(): void {
		if (this.sprite) {
			this.sprite.invalidate();
		}
	}

	/**
	 * Translates list of strings.
	 *
	 * @param  {Array<keyof ILocaleProperties>}  list  Source strings
	 * @return {Array<string>}                         Translated strings
	 */
	protected getStringList(list: Array<keyof ILocaleProperties>): Array<string> {
		let res: string[] = [];
		for (let i: number = 0; i < list.length; i++) {
			res.push($utils.escapeForRgex(list[i]));
			// translate?
			if (this.language && !this.language.isDefault()) {
				res.push($utils.escapeForRgex(this.language.translate(list[i])));
			}
		}
		return res;
	}

	/**
	 * Date format to use.
	 *
	 * If format is not supplied in-line in the string, this setting will be
	 * used.
	 *
	 * @default "yyyy-MM-dd"
	 * @param {string} value Date format
	 */
	public set dateFormat(value: string) {
		this._dateFormat = value;
		this.invalidateSprite();
	}

	/**
	 * @return {string} Date format
	 */
	public get dateFormat(): string {
		return this._dateFormat;
	}

	/**
	 * Date format to use when parsing dates.
	 *
	 * @default "yyyy-MM-dd"
	 * @param {string} value Date format
	 */
	public set inputDateFormat(value: string) {
		this._inputDateFormat = value;
		this.invalidateSprite();
	}

	/**
	 * @return {string} Date format
	 */
	public get inputDateFormat(): string {
		return this._inputDateFormat;
	}

	/**
	 * Should formatter use UTC functions?
	 *
	 * If UTC is used, all date/time values will be independent on client's
	 * time zone.
	 *
	 * @param {boolean} value Use UTC?
	 */
	public set utc(value: boolean) {
		this._utc = value;
		this.invalidateSprite();
	}

	/**
	 * @return {boolean} Use UTC?
	 */
	public get utc(): boolean {
		return this._utc;
	}

	/**
	 * Dirst day of the week:
	 *
	 * * 0 - Sunday
	 * * 1 - Monday
	 * * 2 - Tuesday
	 *
	 * Etc.
	 *
	 * @param {number} value First day of week
	 */
	public set firstDayOfWeek(value: number) {
		this._firstDayOfWeek = value;
		this.invalidateSprite();
	}

	/**
	 * @return {number} First day of week
	 */
	public get firstDayOfWeek(): number {
		return this._firstDayOfWeek;
	}

	/**
	 * Output format for the formatted date.
	 *
	 * @ignore Exclude from docs
	 * @param {string}  value  Format
	 */
	public set outputFormat(value: string) {
		this._outputFormat = value.toLowerCase();
		this.invalidateSprite();
	}

	/**
	 * @ignore Exclude from docs
	 * @return {string} Format
	 */
	public get outputFormat(): string {
		return this._outputFormat;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["DateFormatter"] = DateFormatter;
