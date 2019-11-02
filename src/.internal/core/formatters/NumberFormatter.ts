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
import { ITextChunk, getTextFormatter } from "../formatters/TextFormatter";
import { registry } from "../Registry";
import * as $strings from "../utils/Strings";
import * as $object from "../utils/Object";
import * as $utils from "../utils/Utils";
import * as $type from "../utils/Type";

/**
 * @ignore
 */
export interface INumberSuffix {
	number: number;
	suffix: string;
}

/**
 * NumberFormatter class. Formats numbers according to specified formats.
 *
 * @todo Apply translations to suffixes/prefixes
 */
export class NumberFormatter extends BaseObject {

	/**
	 * A base value for negative numbers. Will treat all numbers below this value
	 * as negative numbers.
	 */
	protected _negativeBase: number = 0;

	/**
	 * Holds number format.
	 *
	 * @default #,###.#####
	 */
	protected _numberFormat: string | Intl.NumberFormatOptions = "#,###.#####";

	/**
	 * Locales to use when formatting using Intl.NumberFormatter
	 */
	protected _intlLocales: string;

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
	 * Holds big number prefixes to apply to numbers if `a` modifier is used in
	 * format.
	 */
	protected _bigNumberPrefixes: INumberSuffix[];

	/**
	 * Holds small number prefixes to apply to numbers if `a` modifier is used in
	 * format.
	 */
	protected _smallNumberPrefixes: INumberSuffix[];

	/**
	 * Any number smaller than this will be considered "small" number, which will
	 * trigger special formatting if "a" format modifier is used.
	 */
	protected _smallNumberThreshold: number = 1.00;

	/**
	 * Holds prefixes to apply to data size numbers if `b` modifier is used in
	 * format.
	 */
	protected _bytePrefixes: INumberSuffix[];

	/**
	 * Holds reference to parent [[Sprite]] object.
	 */
	public sprite: $type.Optional<Sprite>;

	/**
	 * Holds reference to [[Language]] object.
	 */
	private _language: $type.Optional<Language>;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "NumberFormatter";
		this.applyTheme();
	}

	public dispose(): void {
		super.dispose();

		if (this.language) {
			this.language.dispose();
		}
	}

	/**
	 * A reference to [[Language]] instance.
	 *
	 * Formatter will use language to translate various items, like number
	 * suffixes, etc.
	 *
	 * @param value  Language
	 */
	public set language(value: Language) {
		this._language = value;
	}

	/**
	 * @return Language
	 */
	public get language(): Language {
		if (!this._language) {
			if (this.sprite) {
				this._language = this.sprite.language;
			}
			else {
				this._language = new Language;
			}
		}
		return this._language;
	}

	/**
	 * Formats the number according to specific format.
	 *
	 * @param value   Value to format
	 * @param format  Format to apply
	 * @return Formatted number
	 */
	public format(value: number | string, format?: string |  Intl.NumberFormatOptions): string {

		// no format passed in or "Number"
		if (typeof format === "undefined" || ($type.isString(format) && format.toLowerCase() === "number")) {
			format = this._numberFormat;
		}

		// Init return value
		let formatted;

		// Cast to number just in case
		// TODO: maybe use better casting
		let source: number = Number(value);

		// Is it a built-in format or Intl.NumberFormatOptions
		if (format instanceof Object) {

			if (this.intlLocales) {
				return new Intl.NumberFormat(this.intlLocales, <Intl.NumberFormatOptions>format).format(source);
			}
			else {
				return new Intl.NumberFormat(undefined, <Intl.NumberFormatOptions>format).format(source);
			}

		}
		else {

			// Clean format
			format = $utils.cleanFormat(format);

			// Get format info (it will also deal with parser caching)
			let info = this.parseFormat(format, this.language);

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
			formatted = details.template.split($strings.PLACEHOLDER).join(this.applyFormat(source, details));

		}

		return formatted;
	}

	/**
	 * Parses supplied format into structured object which can be used to format
	 * the number.
	 *
	 * @param format Format string, i.e. "#,###.00"
	 * @param language Language
	 */
	protected parseFormat(format: string, language: Language): any {

		// Check cache
		let cached = this.getCache(format);
		if ($type.hasValue(cached)) {
			return cached;
		}

		// init format parse info holder
		let info: any = {
			"positive": {
				"thousands": {
					"active": -1,
					"passive": -1,
					"interval": -1,
					"separator": language.translateEmpty("_thousandSeparator")
				},
				"decimals": {
					"active": -1,
					"passive": -1,
					"separator": language.translateEmpty("_decimalSeparator")
				},
				"template": "",
				"source": "",
				"parsed": false
			},
			"negative": {
				"thousands": {
					"active": -1,
					"passive": -1,
					"interval": -1,
					"separator": language.translateEmpty("_thousandSeparator")
				},
				"decimals": {
					"active": -1,
					"passive": -1,
					"separator": language.translateEmpty("_decimalSeparator")
				},
				"template": "",
				"source": "",
				"parsed": false
			},
			"zero": {
				"thousands": {
					"active": -1,
					"passive": -1,
					"interval": -1,
					"separator": language.translateEmpty("_thousandSeparator")
				},
				"decimals": {
					"active": -1,
					"passive": -1,
					"separator": language.translateEmpty("_decimalSeparator")
				},
				"template": "",
				"source": "",
				"parsed": false
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

			// Just "Number"?
			if (partFormat.toLowerCase() === "number") {
				partFormat = $type.isString(this._numberFormat) ? this._numberFormat : "#,###.#####";
			}

			// Let TextFormatter split into chunks
			let chunks: ITextChunk[] = getTextFormatter().chunk(partFormat, true);
			for (let i: number = 0; i < chunks.length; i++) {
				let chunk: ITextChunk = chunks[i];

				// replace back double vertical bar
				chunk.text = chunk.text.replace($strings.PLACEHOLDER2, "|");

				if (chunk.type === "value") {
					// Parse format

					// Look for codes
					let matches: string[] | null = chunk.text.match(/[#0.,]+[ ]?[abesABES%!]?[abesABES‰!]?/);

					if (matches) {
						if (matches === null || matches[0] === "") {
							// no codes here - assume string
							// nothing to do here
							item.template += chunk.text;
						}
						else {

							// look for the format modifiers at the end
							let mods: string[] | null = matches[0].match(/[abesABES%‰!]{2}|[abesABES%‰]{1}$/);

							if (mods) {
								item.mod = mods[0].toLowerCase();
								item.modSpacing = matches[0].match(/[ ]{1}[abesABES%‰!]{1}$/) ? true : false;
							}

							// break the format up
							let a = matches[0].split(".");

							// Deal with thousands
							if (a[0] === "") {
								// No directives for thousands
								// Leave default settings (no formatting)
							}
							else {
								// Counts
								item.thousands.active = (a[0].match(/0/g) || []).length;
								item.thousands.passive = (a[0].match(/\#/g) || []).length + item.thousands.active;

								// Separator interval
								let b = a[0].split(",");
								if (b.length === 1) {
									// No thousands separators
									// Do nothing
								}
								else {
									// Use length fo the last chunk as thousands length
									item.thousands.interval = $type.getValue(b.pop()).length;

									if (item.thousands.interval === 0) {
										item.thousands.interval = -1;
									}
								}
							}

							// Deal with decimals
							if (typeof (a[1]) === "undefined") {
								// No directives for decimals
								// Leave at defaults (no formatting)
							}
							else {
								// Counts
								item.decimals.active = (a[1].match(/0/g) || []).length;
								item.decimals.passive = (a[1].match(/\#/g) || []).length + item.decimals.active;
							}

							// Add special code to template
							item.template += chunk.text.split(matches[0]).join($strings.PLACEHOLDER);

						}
					}
				}
				else {
					// Quoted string - take it as it is
					item.template += chunk.text;
				}
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
	 * @param details  Parsed format as returned by parseFormat()
	 * @return Formatted number
	 */
	protected applyFormat(value: number, details: any): string {

		// Use absolute values
		let negative: boolean = value < 0;
		value = Math.abs(value);

		// Recalculate according to modifier
		let prefix: string = "", suffix: string = "";
		let mods: string[] = details.mod ? details.mod.split("") : [];
		if (mods.indexOf("b") !== -1) {
			let a = this.applyPrefix(value, this.bytePrefixes, mods.indexOf("!") !== -1);
			value = a[0];
			prefix = a[1];
			suffix = a[2];
			if (details.modSpacing) {
				suffix = " " + suffix;
			}
		}
		else if (mods.indexOf("a") !== -1) {
			let a = this.applyPrefix(value, value < this.smallNumberThreshold ? this.smallNumberPrefixes : this.bigNumberPrefixes, mods.indexOf("!") !== -1);
			value = a[0];
			prefix = a[1];
			suffix = a[2];
			if (details.modSpacing) {
				suffix = " " + suffix;
			}
		}
		else if (mods.indexOf("%") !== -1) {
			let ol = value.toString().length;
			value *= 100;
			value = parseFloat(value.toPrecision(ol + 2));
			suffix = "%";
		}
		else if (mods.indexOf("‰") !== -1) {
			let ol = value.toString().length;
			value *= 1000;
			value = parseFloat(value.toPrecision(ol + 3));
			suffix = "‰";
		}

		// Round to passive
		if (mods.indexOf("e") !== -1) {
			// convert the value to exponential
			let exp: string[];
			if (details.decimals.passive >= 0) {
				exp = value.toExponential(details.decimals.passive).split("e");
			}
			else {
				exp = value.toExponential().split("e");
			}
			value = Number(exp[0]);
			suffix = "e" + exp[1];
			if (details.modSpacing) {
				suffix = " " + suffix;
			}
		}
		else if (details.decimals.passive === 0) {
			value = Math.round(value);
		}
		else if (details.decimals.passive > 0) {
			let d: number = Math.pow(10, details.decimals.passive);
			value = Math.round(value * d) / d;
		}

		// Init return value
		let res: string = "";

		// Calc integer and decimal parts
		let a = $utils.numberToString(value).split(".");

		// Format integers
		let ints = a[0];

		// Pad integers to active length
		if (ints.length < details.thousands.active) {
			ints = Array(details.thousands.active - ints.length + 1).join("0") + ints;
		}

		// Insert thousands separators
		if (details.thousands.interval > 0) {
			let ip: string[] = [];
			let intsr: string = ints.split("").reverse().join("");
			for (let i = 0, len = ints.length; i <= len; i += details.thousands.interval) {
				let c: string = intsr.substr(i, details.thousands.interval).split("").reverse().join("");
				if (c !== "") {
					ip.unshift(c);
				}
			}
			ints = ip.join(details.thousands.separator);
		}

		// Add integers
		res += ints;

		// Add decimals
		if (a.length === 1) {
			a.push("");
		}
		let decs: string = a[1];

		// Fill zeros?
		if (decs.length < details.decimals.active) {
			decs += Array(details.decimals.active - decs.length + 1).join("0");
		}

		if (decs !== "") {
			res += details.decimals.separator + decs;
		}

		// Can't have empty return value
		if (res === "") {
			res = "0";
		}

		// Add minus sign back
		if (value !== 0 && negative && (mods.indexOf("s") === -1)) {
			res = "-" + res;
		}

		// Add suffixes/prefixes
		if (prefix) {
			res = prefix + res;
		}
		if (suffix) {
			res += suffix;
		}

		return res;
	}

	/**
	 * Chooses appropriate prefix and suffix based on the passed in rules.
	 *
	 * @param  value     Value
	 * @param  prefixes  Prefix array
	 * @param  force     Force application of a first prefix (@sice 4.5.4)
	 * @return Result
	 */
	protected applyPrefix(value: number, prefixes: any[], force: boolean = false): any[] {
		let newvalue = value;
		let prefix = "";
		let suffix = "";
		let applied = false;
		let k = 1;

		for (let i = 0, len = prefixes.length; i < len; i++) {
			if (prefixes[i].number <= value) {
				if (prefixes[i].number === 0) {
					newvalue = 0;
				}
				else {
					newvalue = value / prefixes[i].number;
					k = prefixes[i].number;
				}
				prefix = prefixes[i].prefix;
				suffix = prefixes[i].suffix;
				applied = true;
			}
		}


		if (!applied && force && prefixes.length && value != 0) {
			// Prefix was not applied. Use the first prefix.
			newvalue = value / prefixes[0].number;
			prefix = prefixes[0].prefix;
			suffix = prefixes[0].suffix;
			applied = true;
		}

		if (applied) {
			newvalue = parseFloat(
				newvalue.toPrecision(
					k.toString().length + Math.floor(newvalue).toString().replace(/[^0-9]*/g, "").length
				)
			);
		}

		return [newvalue, prefix, suffix];
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
	 * Number format.
	 *
	 * @default "#,###.#####"
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
	 * @param format  A format to use for number formatting
	 */
	public set numberFormat(format: string | Intl.NumberFormatOptions) {
		this._numberFormat = format;
	}

	/**
	 * @return A format to use for number formatting
	 */
	public get numberFormat(): string | Intl.NumberFormatOptions {
		return this._numberFormat;
	}

	/**
	 * Locales if you are using date formats in `Intl.NumberFormatOptions` syntax.
	 * 
	 * @see (@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) about using Intl for number formatting
	 * @param value Locales
	 */
	public set intlLocales(value: string) {
		this._intlLocales = value;
		this.invalidateSprite();
	}

	/**
	 * @return Date format
	 */
	public get intlLocales(): string {
		return this._intlLocales;
	}

	/**
	 * Negative base for negative numbers.
	 *
	 * @default 0
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
	 * @param format  A format to use for number formatting
	 */
	public set negativeBase(value: number) {
		this._negativeBase = value;
	}

	/**
	 * @return A format to use for number formatting
	 */
	public get negativeBase(): number {
		return this._negativeBase;
	}

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
	 * @param prefixes  Prefixes for big numbers
	 */
	public set bigNumberPrefixes(prefixes: INumberSuffix[]) {
		this._bigNumberPrefixes = prefixes;
	}

	/**
	 * @return Prefixes for big numbers
	 */
	public get bigNumberPrefixes(): INumberSuffix[] {
		if (!$type.hasValue(this._bigNumberPrefixes)) {
			this._bigNumberPrefixes = [
				{ "number": 1e+3, "suffix": this.language.translate("_big_number_suffix_3") },
				{ "number": 1e+6, "suffix": this.language.translate("_big_number_suffix_6") },
				{ "number": 1e+9, "suffix": this.language.translate("_big_number_suffix_9") },
				{ "number": 1e+12, "suffix": this.language.translate("_big_number_suffix_12") },
				{ "number": 1e+15, "suffix": this.language.translate("_big_number_suffix_15") },
				{ "number": 1e+18, "suffix": this.language.translate("_big_number_suffix_18") },
				{ "number": 1e+21, "suffix": this.language.translate("_big_number_suffix_21") },
				{ "number": 1e+24, "suffix": this.language.translate("_big_number_suffix_24") }
			]
		}
		return this._bigNumberPrefixes;
	}

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
	 * IMPORTANT: The order of the suffixes is important. The list must start
	 * from the smallest number and work towards bigger ones.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
	 * @param prefixes  Prefixes for small numbers
	 */
	public set smallNumberPrefixes(prefixes: INumberSuffix[]) {
		this._smallNumberPrefixes = prefixes;
	}

	/**
	 * @return Prefixes for small numbers
	 */
	public get smallNumberPrefixes(): INumberSuffix[] {
		if (!$type.hasValue(this._smallNumberPrefixes)) {
			this._smallNumberPrefixes = [
				{ "number": 1e-24, "suffix": this.language.translate("_small_number_suffix_24") },
				{ "number": 1e-21, "suffix": this.language.translate("_small_number_suffix_21") },
				{ "number": 1e-18, "suffix": this.language.translate("_small_number_suffix_18") },
				{ "number": 1e-15, "suffix": this.language.translate("_small_number_suffix_15") },
				{ "number": 1e-12, "suffix": this.language.translate("_small_number_suffix_12") },
				{ "number": 1e-9, "suffix": this.language.translate("_small_number_suffix_9") },
				{ "number": 1e-6, "suffix": this.language.translate("_small_number_suffix_6") },
				{ "number": 1e-3, "suffix": this.language.translate("_small_number_suffix_3") }
			]
		}
		return this._smallNumberPrefixes;
	}

	/**
	 * Any number smaller than this will be considered "small" number, which will
	 * trigger special formatting if "a" format modifier is used.
	 *
	 * @since 4.6.8
	 * @param  value  Small number threshold
	 */
	public set smallNumberThreshold(value: number) {
		this._smallNumberThreshold = value;
	}

	/**
	 * @return Small number threshold
	 */
	public get smallNumberThreshold(): number {
		return this._smallNumberThreshold;
	}

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
	 * @param prefixes  Prefixes for byte-size formatting
	 */
	public set bytePrefixes(prefixes: INumberSuffix[]) {
		this._bytePrefixes = prefixes;
	}

	/**
	 * @return Prefixes for byte-size formatting
	 */
	public get bytePrefixes(): INumberSuffix[] {
		if (!$type.hasValue(this._bytePrefixes)) {
			this._bytePrefixes = [
				{ "number": 1, suffix: this.language.translate("_byte_suffix_B") },
				{ "number": 1024, suffix: this.language.translate("_byte_suffix_KB") },
				{ "number": 1048576, suffix: this.language.translate("_byte_suffix_MB") },
				{ "number": 1073741824, suffix: this.language.translate("_byte_suffix_GB") },
				{ "number": 1099511627776, suffix: this.language.translate("_byte_suffix_TB") },
				{ "number": 1125899906842624, suffix: this.language.translate("_byte_suffix_PB") }
			]
		}
		return this._bytePrefixes;
	}

	/**
	 * Ooutput format: "svg" or "html".
	 *
	 * @ignore Exclude from docs
	 * @param value  Output format
	 */
	public set outputFormat(outputFormat: string) {
		this._outputFormat = outputFormat.toLowerCase();
		this.invalidateSprite();
	}

	/**
	 * @ignore Exclude from docs
	 * @return Output format
	 */
	public get outputFormat(): string {
		return this._outputFormat;
	}

	/**
	 * Replaces brackets with temporary placeholders.
	 *
	 * @ignore Exclude from docs
	 * @param text  Input text
	 * @return Escaped text
	 */
	public escape(text: string): string {
		return text.replace("||", $strings.PLACEHOLDER2);
	}

	/**
	 * Replaces placeholders back to brackets.
	 *
	 * @ignore Exclude from docs
	 * @param text  Escaped text
	 * @return Unescaped text
	 */
	public unescape(text: string): string {
		return text.replace($strings.PLACEHOLDER2, "|");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["NumberFormatter"] = NumberFormatter;
