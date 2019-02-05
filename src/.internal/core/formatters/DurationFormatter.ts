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
import { ITextChunk, getTextFormatter } from "../formatters/TextFormatter";
import { registry } from "../Registry";
import { TimeUnit } from "../defs/TimeUnit";
import { Optional } from "../utils/Type";
import * as $strings from "../utils/Strings";
import * as $object from "../utils/Object";
import * as $utils from "../utils/Utils";
import * as $type from "../utils/Type";
import * as $math from "../utils/Math";

/**
 * DurationFormatter class. Formats numbers as durations.
 *
 * `1000` as `16:40`
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Tutorial on duration formatting
 */
export class DurationFormatter extends BaseObject {

	/**
	 * If set will force this format to be used, regardless of the scale.
	 */
	protected _durationFormat: string;

	/**
	 * Holds duration formats for various possible scenarios.
	 */
	protected _durationFormats: Partial<Record<TimeUnit, Partial<Record<TimeUnit, string>>>>;

	/**
	 * A base value for negative numbers. Will treat all numbers below this value
	 * as negative numbers.
	 */
	protected _negativeBase: number = 0;

	/**
	 * A base unit to consider values are in.
	 *
	 * @default "s"
	 */
	protected _baseUnit: TimeUnit = "second";

	/**
	 * Output format to produce. If the format calls for applying color to the
	 * formatted value, this setting will determine what markup to use: SVG or
	 * HTML.
	 *
	 * Available options: svg, html.
	 *
	 * @default "svg"
	 */
	protected _outputFormat: string = "svg";


	/**
	 * How many milliseconds each unit represents.
	 */
	protected _unitValues: Record<TimeUnit, number> = {
		"millisecond": 1,
		"second": 1000,
		"minute": 60000,
		"hour": 3600000,
		"day": 86400000,
		"week": 604800000,
		"month": 2592000000,
		"year": 31536000000,
	};

	/**
	 * Collection of aliases for units.
	 */
	protected _unitAliases: { [index: string]: string } = {
		"Y": "y",
		"D": "d",
		"H": "h",
		"K": "h",
		"k": "h",
		"n": "S"
	};

	/**
	 * Holds reference to parent [[Sprite]] object.
	 */
	public sprite: $type.Optional<Sprite>;

	/**
	 * Holds reference to [[Language]] object.
	 */
	public language: $type.Optional<Language>;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "DurationFormatter";
		this.applyTheme();
	}

	/**
	 * Formats the number according as duration.
	 *
	 * For example `1000` (base unit seconds) would be converted to `16:40` as in
	 * 16 minutes and 40 seconds.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Tutorial on duration formatting
	 * @param value   Value to format
	 * @param format  Format to apply
	 * @param base    Override base unit
	 * @return Formatted number
	 */
	public format(value: number | string, format?: string, base?: TimeUnit): string {

		// no language?
		if (!this.language) {
			if (this.sprite) {
				this.language = this.sprite.language;
			}
			else {
				this.language = new Language;
			}
		}

		// no base unit?
		let baseUnit = base || this._baseUnit;

		// no format passed in or empty
		if (typeof format === "undefined" || format === "") {
			if ($type.hasValue(this.durationFormat)) {
				format = this.durationFormat;
			}
			else {
				format = this.getFormat($type.toNumber(value), null, baseUnit);
			}
		}

		// Clean format
		format = $utils.cleanFormat(format);

		// get format info (it will also deal with parser caching)
		let info = this.parseFormat(format, baseUnit);

		// cast to number just in case
		// TODO: maybe use better casting
		let source: number = Number(value);

		// format and replace the number
		let details;
		if (source > this._negativeBase) {
			details = info.positive;
		}
		else if (source < this._negativeBase) {
			details = info.negative;
		}
		else {
			details = info.zero;
		}


		// Format
		let formatted = this.applyFormat(source, details);

		// Apply color?
		if (details.color !== "") {
			if (this._outputFormat === "svg") {
				formatted = "<tspan fill='" + details.color + "'>" + formatted + "</tspan>";
			}
			else if (this._outputFormat === "html") {
				formatted = "<span style='color: " + details.color + ";'>" + formatted + "</span>";
			}
		}

		return formatted;
	}

	/**
	 * Parses supplied format into structured object which can be used to format
	 * the number.
	 *
	 * @param format  Format string, i.e. "#,###.00"
	 * @param base    Override base unit
	 * @return Parsed information
	 */
	protected parseFormat(format: string, base?: TimeUnit): any {

		// Check cache
		let cached = this.getCache(format);
		if ($type.hasValue(cached)) {
			return cached;
		}

		// no base unit?
		let baseUnit = base || this._baseUnit;

		// Initialize duration parsing info
		let info = {
			"positive": {
				"color": "",
				"template": "",
				"parts": <any>[],
				"source": "",
				"baseUnit": baseUnit,
				"parsed": false,
				"absolute": false
			},
			"negative": {
				"color": "",
				"template": "",
				"parts": <any>[],
				"source": "",
				"baseUnit": baseUnit,
				"parsed": false,
				"absolute": false
			},
			"zero": {
				"color": "",
				"template": "",
				"parts": <any>[],
				"source": "",
				"baseUnit": baseUnit,
				"parsed": false,
				"absolute": false
			}
		};

		// Escape double vertical bars (that mean display one vertical bar)
		format = format.replace("||", $strings.PLACEHOLDER2);

		// Split it up and deal with different formats
		let parts = format.split("|");
		info.positive.source = parts[0];

		if (typeof parts[2] === "undefined") {
			info.zero = info.positive;
		}
		else {
			info.zero.source = parts[2];
		}

		if (typeof parts[1] === "undefined") {
			info.negative = info.positive;
		}
		else {
			info.negative.source = parts[1];
		}

		// Parse each
		$object.each(info, (part, item) => {
			// Already parsed
			if (item.parsed) {
				return;
			}

			// Check cached
			if (typeof this.getCache(item.source) !== "undefined") {
				info[part] = this.getCache(item.source);
				return;
			}

			// Begin parsing
			let partFormat: string = item.source;

			// Check for [] directives
			let dirs: string[] | null = [];
			dirs = item.source.match(/^\[([^\]]*)\]/);
			if (dirs && dirs.length && dirs[0] !== "") {
				partFormat = item.source.substr(dirs[0].length);
				item.color = dirs[1];
			}


			// Let TextFormatter split into chunks
			let chunks: ITextChunk[] = getTextFormatter().chunk(partFormat, true);
			for (let i: number = 0; i < chunks.length; i++) {
				let chunk: ITextChunk = chunks[i];

				// replace back double vertical bar
				chunk.text = chunk.text.replace($strings.PLACEHOLDER2, "|");

				if (chunk.type === "value") {

					// Just "Duration"?
					// if (chunk.text.toLowerCase() === "duration") {
					// 	chunk.text = durationFormat;
					// }

					// Check for "a" (absolute) modifier
					if (chunk.text.match(/[yYMdDwhHKkmsSn]+a/)) {
						item.absolute = true;
						chunk.text = chunk.text.replace(/([yYMdDwhHKkmsSn]+)a/, "$1");
					}

					// Find all possible parts
					let matches = chunk.text.match(/y+|Y+|M+|d+|D+|w+|h+|H+|K+|k+|m+|s+|S+|n+/g);

					if (matches) {
						// Populate template
						for (let x = 0; x < matches.length; x++) {
							// Is it an alias?
							if (!$type.hasValue(matches[x])) {
								matches[x] = this._unitAliases[matches[x]];
							}
							item.parts.push(matches[x]);
							chunk.text = chunk.text.replace(matches[x], $strings.PLACEHOLDER);
						}
					}
				}

				// Apply to template
				item.template += chunk.text;
			}

			// Apply style formatting
			//item.template = getTextFormatter().format(item.template, this.outputFormat);

			// Save cache
			this.setCache(item.source, item);

			// Mark this as parsed
			item.parsed = true;
		});

		// Save cache (the whole thing)
		this.setCache(format, info);

		return info;
	}

	/**
	 * Applies parsed format to a numeric value.
	 *
	 * @param value    Value
	 * @param details  Parsed format as returned by {parseFormat}
	 * @return Formatted duration
	 */
	protected applyFormat(value: number, details: any): string {

		// Use absolute values
		let negative: boolean = !details.absolute && (value < this._negativeBase);
		value = Math.abs(value);

		// Recalculate to milliseconds
		let tstamp: number = this.toTimeStamp(value, details.baseUnit);

		// Init return value
		let res: string = details.template;

		// Iterate through duration parts
		for (let i = 0, len = details.parts.length; i < len; i++) {

			// Gather the part
			let part: string = details.parts[i];
			let unit: TimeUnit = this.toTimeUnit(part.substr(0, 1));
			let digits: number = part.length;

			// Calculate current unit value
			let ints: number = Math.floor(tstamp / this._unitValues[unit]);
			res = res.replace($strings.PLACEHOLDER, $utils.padString(ints, digits, "0"));

			// Reduce timestamp
			tstamp -= ints * this._unitValues[unit];
		}

		// Reapply negative sign
		if (negative) {
			res = "-" + res;
		}

		return res;
	}

	/**
	 * Converts numeric value to timestamp in milliseconds.
	 *
	 * @param value     A source value
	 * @param baseUnit  Base unit the source value is in: "q", "s", "i", "h", "d", "w", "m", "y"
	 * @return Value representation as a timestamp in milliseconds
	 */
	public toTimeStamp(value: number, baseUnit: TimeUnit): number {
		return value * this._unitValues[baseUnit];
	}

	protected toTimeUnit(code: string): Optional<TimeUnit> {
		switch (code) {
			case "S":
				return "millisecond";
			case "s":
				return "second";
			case "m":
				return "minute";
			case "h":
				return "hour";
			case "d":
				return "day";
			case "w":
				return "week";
			case "M":
				return "month";
			case "y":
				return "year";
		};
	}

	/**
	 * Invalidates the parent [[Sprite]] object.
	 */
	protected invalidateSprite(): void {
		if (this.sprite) {
			this.sprite.invalidate();
		}
	}

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
	 * @param baseUnit  A base unit
	 */
	public set baseUnit(baseUnit: TimeUnit) {
		this._baseUnit = baseUnit;
		this.invalidateSprite();
	}

	/**
	 * @return Base unit
	 */
	public get baseUnit(): TimeUnit {
		return this._baseUnit;
	}

	/**
	 * Setter for output format: "svg" or "html.
	 *
	 * @ignore Exclude from docs
	 * @param value  Output format
	 */
	public set outputFormat(outputFormat: string) {
		this._outputFormat = outputFormat.toLowerCase();
		this.invalidateSprite();
	}

	/**
	 * Getter for output format.
	 *
	 * @ignore Exclude from docs
	 * @return Output format
	 */
	public get outputFormat(): string {
		return this._outputFormat;
	}

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
	 * @param value     Value to format
	 * @param maxValue  Maximum value to be used to determine format
	 * @param baseUnit  Base unit of the value
	 * @return Format
	 */
	public getFormat(value: number, maxValue?: number, baseUnit?: TimeUnit): string {

		// Is format override set?
		if ($type.hasValue(this.durationFormat)) {
			return this.durationFormat;
		}

		// Get base unit
		if (!baseUnit) {
			baseUnit = this.baseUnit;
		}

		if ($type.hasValue(maxValue) && value != maxValue) {
			value = Math.abs(value);
			maxValue = Math.abs(maxValue);
			let maxUnit = this.getValueUnit($math.max(value, maxValue), baseUnit);
			//let diffUnit = this.getValueUnit(Math.abs(maxValue - value), baseUnit);
			//console.log(maxUnit, diffUnit);
			return this.durationFormats[baseUnit][maxUnit];
		}
		else {
			let unit = this.getValueUnit(value, baseUnit);
			return this.durationFormats[baseUnit][unit];
		}

	}

	/**
	 * Returns value's closest denominator time unit, e.g 100 seconds is
	 * `"minute"`, while 59 seconds would still be `second`.
	 *
	 * @param value     Source duration value
	 * @param baseUnit  Base unit
	 * @return Denominator
	 */
	public getValueUnit(value: number, baseUnit?: TimeUnit): TimeUnit {

		// Get base unit
		if (!baseUnit) {
			baseUnit = this.baseUnit;
		}

		// Convert to milliseconds
		let currentUnit: TimeUnit;
		let ms = this.getMilliseconds(value, baseUnit);
		$object.eachContinue(this._unitValues, (key, val) => {
			if (key == baseUnit || currentUnit) {
				let num = ms / val;
				if (num <= 1) {
					if (!currentUnit) {
						currentUnit = key;
					}
					return false;
				}
				currentUnit = key;
			}
			return true;
		});

		return currentUnit;
	}

	/**
	 * Converts value to milliseconds according to `baseUnit`.
	 *
	 * @param value     Source duration value
	 * @param baseUnit  Base unit
	 * @return Value in milliseconds
	 */
	public getMilliseconds(value: number, baseUnit?: TimeUnit): number {

		// Get base unit
		if (!baseUnit) {
			baseUnit = this.baseUnit;
		}

		return value * this._unitValues[baseUnit];
	}

	/**
	 * If set, this format will be used instead of the one determined dynamically
	 * based on the basedUnit and range of values.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Available fomatting codes
	 * @param value  Format
	 */
	public set durationFormat(value: string) {
		if (this._durationFormat != value) {
			this._durationFormat = value;
			this.invalidateSprite();
		}
	}

	/**
	 * @return Format
	 */
	public get durationFormat(): Optional<string> {
		return this._durationFormat;
	}

	/**
	 * Duration formats for various combination of base units.
	 *
	 * @param value  Formats
	 */
	public set durationFormats(value: Partial<Record<TimeUnit, Partial<Record<TimeUnit, string>>>>) {
		this._durationFormats = value;
		this.invalidateSprite();
	}

	/**
	 * @return Formats
	 */
	public get durationFormats(): Partial<Record<TimeUnit, Partial<Record<TimeUnit, string>>>> {
		if (!this._durationFormats) {
			this._durationFormats = {
				"millisecond": {
					"millisecond": this.language.translate("_duration_millisecond"),
					"second": this.language.translate("_duration_millisecond_second"),
					"minute": this.language.translate("_duration_millisecond_minute"),
					"hour": this.language.translate("_duration_millisecond_hour"),
					"day": this.language.translate("_duration_millisecond_day"),
					"week": this.language.translate("_duration_millisecond_week"),
					"month": this.language.translate("_duration_millisecond_month"),
					"year": this.language.translate("_duration_millisecond_year")
				},
				"second": {
					"second": this.language.translate("_duration_second"),
					"minute": this.language.translate("_duration_second_minute"),
					"hour": this.language.translate("_duration_second_hour"),
					"day": this.language.translate("_duration_second_day"),
					"week": this.language.translate("_duration_second_week"),
					"month": this.language.translate("_duration_second_month"),
					"year": this.language.translate("_duration_second_year")
				},
				"minute": {
					"minute": this.language.translate("_duration_minute"),
					"hour": this.language.translate("_duration_minute_hour"),
					"day": this.language.translate("_duration_minute_day"),
					"week": this.language.translate("_duration_minute_week"),
					"month": this.language.translate("_duration_minute_month"),
					"year": this.language.translate("_duration_minute_year")
				},
				"hour": {
					"hour": this.language.translate("_duration_hour"),
					"day": this.language.translate("_duration_hour_day"),
					"week": this.language.translate("_duration_hour_week"),
					"month": this.language.translate("_duration_hour_month"),
					"year": this.language.translate("_duration_hour_year")
				},
				"day": {
					"day": this.language.translate("_duration_day"),
					"week": this.language.translate("_duration_day_week"),
					"month": this.language.translate("_duration_day_month"),
					"year": this.language.translate("_duration_day_year")
				},
				"week": {
					"week": this.language.translate("_duration_week"),
					"month": this.language.translate("_duration_week_month"),
					"year": this.language.translate("_duration_week_year")
				},
				"month": {
					"month": this.language.translate("_duration_month"),
					"year": this.language.translate("_duration_month_year")
				},
				"year": {
					"year": this.language.translate("_duration_year")
				}
			};
		}
		return this._durationFormats;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["DurationFormatter"] = DurationFormatter;
