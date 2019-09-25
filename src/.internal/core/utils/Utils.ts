/**
 * A collection of universal utility functions.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../Sprite";
import { IPoint } from "../defs/IPoint";
import { IRectangle } from "../defs/IRectangle";
import { Percent } from "./Percent";
import { isSafari } from "./Browser";
import * as $math from "../utils/Math";
import * as $type from "../utils/Type";
import * as $string from "./String";
import * as $strings from "./Strings";
import * as $object from "./Object";
import * as $array from "./Array";


/**
 * ============================================================================
 * MISC FUNCTIONS
 * ============================================================================
 * @hidden
 */


/**
 * Marks a value as being used (e.g. because the value has side effects).
 */
export function used<A>(value: A) { }

/**
 * Copies all properties of one object to the other, omitting undefined.
 *
 * @param fromObject  Source object
 * @param toObject    Target object
 * @return Updated target object
 * @todo Maybe consolidate with utils.copy?
 */
export function copyProperties(source: Object, target: Object): Object {
	$object.each(source, (key, value) => {
		// only if value is set
		if ($type.hasValue(value)) {
			(<any>target)[key] = value;
		}
	});

	return target;
}

/**
 * Removes target from url
 */
export function stripHash(url: string): string {
	return /^[^#]*/.exec(url)[0];
}

export function getBaseURI() {
	let url = "#";

	// Needed until https://bugs.webkit.org/show_bug.cgi?id=189499 is fixed
	if (isSafari()) {
		let baseURI = document.baseURI;
		if (baseURI) {
			baseURI = stripHash(baseURI);
			let loc = stripHash(location.href);
			if (baseURI !== loc) {
				url = loc + url;
			}
		}
	}

	return url;
}

/**
 * Copies all properties of one object to the other, omitting undefined, but only if property in target object doesn't have a value set.
 *
 * @param fromObject  Source object
 * @param toObject    Target object
 * @return Updated target object
 * @todo Maybe consolidate with utils.copy?
 */
export function softCopyProperties(source: Object, target: Object): Object {
	$object.each(source, (key, value) => {
		// only if value is set
		if ($type.hasValue(value) && !($type.hasValue((<any>target)[key]))) {
			(<any>target)[key] = value;
		}
	});
	return target;
}

/**
 * Copies all properties of one object to the other.
 *
 * @param source     Source object
 * @param recipient  Target object
 * @return Updated target object
 */
export function copy(source: Object, target: Object): Object {
	$object.each(source, (key, value) => {
		(<any>target)[key] = value;
	});
	return target;
}

/**
 * Checks if value is not empty (undefined or zero-length string).
 *
 * @param value  Value to check
 * @return `true` if value is not "empty"
 */
export function isNotEmpty(value: $type.Optional<string>): value is string {
	return $type.hasValue(value) && (value.toString() !== "");
}

/**
 * [relativeToValue description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param percent  [description]
 * @param full     [description]
 * @return [description]
 */
export function relativeToValue(percent: $type.Optional<number | Percent>, full: number): number {
	if ($type.isNumber(percent)) {
		return percent;
	} else if (percent != null && $type.isNumber(percent.value) && $type.isNumber(full)) {
		return full * percent.value;

	} else {
		return 0;
	}
}

/**
 * [relativeRadiusToValue description]
 *
 * Differs from relativeToValue so that if a value is negative, it subtracts
 * it from full value.
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param percent             [description]
 * @param full                [description]
 * @param subtractIfNegative  [description]
 * @return [description]
 */
export function relativeRadiusToValue(percent: $type.Optional<number | Percent>, full: number, subtractIfNegative?: boolean): $type.Optional<number> {
	let value: $type.Optional<number>;

	if ($type.isNumber(percent)) {
		value = percent;

		if (value < 0) {
			if (subtractIfNegative) {
				value = full + value;
			}
			else {
				value = full - value;
			}
		}

	} else if (percent != null && $type.isNumber(percent.value)) {
		value = full * percent.value;
	}

	return value;
}

/**
 * [valueToRelative description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param value  [description]
 * @param full   [description]
 * @return [description]
 */
export function valueToRelative(value: number | Percent, full: number): number {
	if (value instanceof Percent) {
		return value.value;
	}
	else {
		return value / full;
	}
}

/**
 * Returns pixel ratio of the current screen (used on retina displays).
 *
 * @return Pixel ratio
 */
export function getPixelRatio(): number {
	let ratio = window.devicePixelRatio || 1;
	return ratio;
}


/**
 * ============================================================================
 * STRING FORMATTING FUNCTIONS
 * ============================================================================
 * @hidden
 */

/**
 * Converts camelCased text to dashed version:
 * ("thisIsString" > "this-is-string")
 *
 * @param str  Input
 * @return Output
 */
export function camelToDashed(str: string): string {
	return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Converts tring to uppercase.
 *
 * @param str  String to convert
 * @return uppercased string
 * @todo Maybe make it better
 */
export function capitalize(str: string): string {
	let arr: string[] = str.split("");
	arr[0] = arr[0].toUpperCase();
	return arr.join("");
}

/**
 * Converts any value into its string representation.
 *
 * @param value  Value
 * @return String represantation of the value
 */
export function stringify(value: any): string {
	return JSON.stringify(value);
}

/**
 * Escapes string so it can safely be used in a Regex.
 *
 * @param value  Unsescaped string
 * @return Escaped string
 */
export function escapeForRgex(value: string): string {
	return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Splits the text into multiple lines, respecting maximum character count.
 * Prioretizes splitting on spaces and punctuation. Falls back on splitting
 * mid-word if there's no other option.
 *
 * @param text      Text
 * @param maxChars  Maximum number of characters per line
 * @return An array of split text
 */
export function splitTextByCharCount(text: string, maxChars: number, fullWords?: boolean, rtl?: boolean): string[] {

	// Maybe the text fits?
	if (text.length <= maxChars) {
		return [text];
	}

	// Init result
	let res: string[] = [];

	// Split by words or by charts
	if (fullWords) {

		// Split by words first

		// Split by spacing
		let currentIndex: number = -1;
		let tmpText = text.replace(/([,;:!?\\\/\.\s]+)/g, $strings.PLACEHOLDER + "$1" + $strings.PLACEHOLDER);
		let words = tmpText.split($strings.PLACEHOLDER);

		// Process each word
		for (let i = 0; i < words.length; i++) {

			// Get word and symbol count
			let word: string = words[i];
			let wordLength: number = word.length;

			// Ignore empty words
			if (wordLength === 0) {
				continue;
			}

			// Check word length
			//if ((wordLength > maxChars) && fullWords !== true) {
			if (wordLength > maxChars) {
				// A single word is longer than allowed symbol count
				// Break it up
				if (rtl) {
					word = reverseString(word);
				}
				let parts: RegExpMatchArray | null = word.match(new RegExp(".{1," + maxChars + "}", "g"));

				// TODO is this correct ?
				if (parts) {
					if (rtl) {
						for (let x = 0; x < parts.length; x++) {
							parts[x] = reverseString(parts[x]);
						}
						//parts.reverse();
					}

					res = res.concat(parts);
				}
			}
			else {

				// Init current line
				if (currentIndex === -1) {
					res.push("");
					currentIndex = 0;
				}

				// Check if we need to break into another line
				if (((res[currentIndex].length + wordLength + 1) > maxChars) && res[currentIndex] !== "") {
					res.push("");
					currentIndex++;
				}

				// Add word
				res[currentIndex] += word;

			}

			// Update index
			currentIndex = res.length - 1;
		}
	}
	else {

		// Splitting by anywhere (living la vida facil)
		let parts: RegExpMatchArray | null = text.match(new RegExp(".{1," + maxChars + "}", "g"));

		if (parts) {
			if (rtl) {
				for (let x = 0; x < parts.length; x++) {
					parts[x] = reverseString(parts[x]);
				}
			}

			res = parts;
		}

	}

	// Do we have only one word that does not fit?
	// Since fullWords is set and we can't split the word, we end up with empty
	// set.
	if (res.length == 1 && fullWords && (res[0].length > maxChars)) {
		res = [];
	}

	return res;
}

/**
 * Truncates the text to certain character count.
 *
 * Will add ellipsis if the string is truncated. Optionally, can truncate on
 * full words only.
 *
 * For RTL support, pass in the fifth parameter as `true`.
 *
 * @param text       Input text
 * @param maxChars   Maximum character count of output
 * @param ellipsis   Ellipsis string, i.e. "..."
 * @param fullWords  If `true`, will not break mid-word, unless there's a single word and it does not with into `maxChars`
 * @param rtl        Is this an RTL text?
 * @return Truncated text
 */
export function truncateWithEllipsis(text: string, maxChars: number, ellipsis: string, fullWords?: boolean, rtl?: boolean): string {

	if (text.length <= maxChars) {
		return text;
	}

	// Calc max chars
	maxChars -= ellipsis.length;
	if (maxChars < 1) {
		maxChars = 1;
		//ellipsis = "";
	}

	// Get lines
	let lines = splitTextByCharCount(text, maxChars, fullWords, rtl);

	// Use first line
	return (lines[0] || "") + ellipsis;
}

/**
 * Removes whitespace from beginning and end of the string.
 *
 * @param str  Input
 * @return Output
 */
export function trim(str: string): string {
	return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
};

/**
 * Removes whitespace from end of the string.
 *
 * @param str  Input
 * @return Output
 */
export function rtrim(str: string): string {
	return str.replace(/[\s\uFEFF\xA0]+$/g, "");
};

/**
 * Removes whitespace from beginning of the string.
 *
 * @param str  Input
 * @return Output
 */
export function ltrim(str: string): string {
	return str.replace(/^[\s\uFEFF\xA0]+/g, "");
};

/**
 * Reverses string.
 *
 * @param str  Input
 * @return Output
 */
export function reverseString(str: string): string {
	return str.split("").reverse().join("");
}

/**
 * Removes quotes from the string.
 *
 * @param str  Input
 * @return Output
 */
export function unquote(str: string): string {
	let res = str.trim();
	res = str.replace(/^'(.*)'$/, "$1");
	if (res == str) {
		res = str.replace(/^"(.*)"$/, "$1");
	}
	return res;
}

/**
 * Pads a string with additional characters to certain length.
 *
 * @param value  A numeric value
 * @param len    Result string length in characters
 * @param char   A character to use for padding
 * @return Padded value as string
 */
export function padString(value: any, len: number = 0, char: string = "0"): string {
	if (typeof value !== "string") {
		value = value.toString();
	}

	return len > value.length ? Array(len - value.length + 1).join(char) + value : value;
}

/**
 * Tries to determine format type.
 *
 * @ignore Exclude from docs
 * @param format  Format string
 * @return Format type ("string" | "number" | "date" | "duration")
 */
export function getFormat(format: string): string {

	// Undefined?
	if (typeof format === "undefined") {
		return $strings.STRING;
	}

	// Cleanup and lowercase format
	format = format.toLowerCase().replace(/^\[[^\]]*\]/, "");

	// Remove style tags
	format = format.replace(/\[[^\]]+\]/, "");

	// Trim
	format = format.trim();

	// Check for any explicit format hints (i.e. /Date)
	let hints: RegExpMatchArray | null = format.match(/\/(date|number|duration)$/);

	if (hints) {
		return hints[1];
	}

	// Check for explicit hints
	if (format === $strings.NUMBER) {
		return $strings.NUMBER;
	}

	if (format === $strings.DATE) {
		return $strings.DATE;
	}

	if (format === $strings.DURATION) {
		return $strings.DURATION;
	}

	// Detect number formatting symbols
	if (format.match(/[#0]/)) {
		return $strings.NUMBER;
	}

	// Detect date formatting symbols
	if (format.match(/[ymwdhnsqaxkzgtei]/)) {
		return $strings.DATE;
	}

	// Nothing? Let's display as string
	return $strings.STRING;
}

/**
 * Cleans up format:
 * * Strips out formatter hints
 *
 * @ignore Exclude from docs
 * @param format  Format
 * @return Cleaned format
 */
export function cleanFormat(format: string): string {
	return format.replace(/\/(date|number|duration)$/i, "");
}

/**
 * Strips all tags from the string.
 *
 * @param text  Source string
 * @return String without tags
 */
export function stripTags(text: string): string {
	return text ? text.replace(/<[^>]*>/g, "") : text;
}

/**
 * Removes new lines and tags from a string.
 *
 * @param text  String to conver
 * @return Converted string
 */
export function plainText(text: string): string {
	return text ? stripTags(text.replace(/[\n\r]+/g, ". ")) : text;
}


/**
 * ============================================================================
 * TYPE CONVERSION FUNCTIONS
 * ============================================================================
 * @hidden
 */

/**
 * Converts numeric value into string. Deals with large or small numbers that
 * would otherwise use exponents.
 *
 * @param value  Numeric value
 * @return Numeric value as string
 */
export function numberToString(value: number): string {
	// TODO handle Infinity and -Infinity
	if ($type.isNaN(value)) {
		return "NaN";
	}

	if (value === Infinity) {
		return "Infinity";
	}

	if (value === -Infinity) {
		return "-Infinity";
	}

	// Negative 0
	if ((value === 0) && (1 / value === -Infinity)) {
		return "-0";
	}

	// Preserve negative and deal with absoute values
	let negative = value < 0;

	value = Math.abs(value);

	// TODO test this
	let parsed = $type.getValue(/^([0-9]+)(?:\.([0-9]+))?(?:e[\+\-]([0-9]+))?$/.exec("" + value));
	let digits = parsed[1];
	let decimals = parsed[2] || "";

	let res: string;

	// Leave the nummber as it is if it does not use exponents
	if (parsed[3] == null) {
		res = (decimals === "" ? digits : digits + "." + decimals);

	} else {
		let exponent = +parsed[3];

		// Deal with decimals
		if (value < 1) {
			let zeros = exponent - 1;

			res = "0." + $string.repeat("0", zeros) + digits + decimals;

			// Deal with integers
		} else {
			let zeros = exponent - decimals.length;

			if (zeros === 0) {
				res = digits + decimals;

			} else if (zeros < 0) {
				res = digits + decimals.slice(0, zeros) + "." + decimals.slice(zeros);

			} else {
				res = digits + decimals + $string.repeat("0", zeros);
			}
		}
	}

	return negative ? "-" + res : res;
}

/**
 * Converts anything to Date object.
 *
 * @param value  A value of any type
 * @return Date object representing a value
 */
export function anyToDate(value: Date | number | string): Date {
	if ($type.isDate(value)) {
		// TODO maybe don't create a new Date ?
		return new Date(value);
	}

	else if ($type.isNumber(value)) {
		return new Date(value);
	}

	else {
		// Try converting to number (assuming timestamp)
		let num = Number(value);

		if (!$type.isNumber(num)) {
			return new Date(value);
		}
		else {
			return new Date(num);
		}
	}
}

/**
 * Tries converting any value to a number.
 *
 * @param value  Source value
 * @return Number
 */
export function anyToNumber(value: Date | number | string): $type.Optional<number> {
	if ($type.isDate(value)) {
		return value.getTime();
	}

	else if ($type.isNumber(value)) {
		return value;
	}

	else if ($type.isString(value)) {
		// Try converting to number (assuming timestamp)
		let num = Number(value);

		if (!$type.isNumber(num)) {
			// Failing
			return undefined;
		}
		else {
			return num;
		}
	}
}


/**
 * ============================================================================
 * DATE-RELATED FUNCTIONS
 * ============================================================================
 * @hidden
 */

/**
 * Returns a year day.
 *
 * @param date  Date
 * @param utc   Assume UTC dates?
 * @return Year day
 * @todo Account for UTC
 */
export function getYearDay(date: Date, utc: boolean = false): number {
	let first = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
	return Math.floor((date.getTime() - first.getTime()) / 86400000) + 1;
}

/**
 * Returns week number for a given date.
 *
 * @param date  Date
 * @param utc   Assume UTC dates?
 * @return Week number
 * @todo Account for UTC
 */
export function getWeek(date: Date, utc: boolean = false): number {
	let day = getYearDay(date, utc) - 1;
	let week = Math.floor((day - (date.getDay() || 7) + 10) / 7);
	if (week === 0) {
		week = 53;
	}
	else if (week === 53) {
		week = 1;
	}
	return week;
}

/**
 * Returns a week number in the month.
 *
 * @param date  Source Date
 * @param utc   Assume UTC dates?
 * @return Week number in month
 */
export function getMonthWeek(date: Date, utc: boolean = false): number {
	let firstWeek = getWeek(new Date(date.getFullYear(), date.getMonth(), 1), utc);
	let currentWeek = getWeek(date, utc);
	if (currentWeek == 1) {
		currentWeek = 53;
	}
	return currentWeek - firstWeek + 1;
}

/**
 * Returns a year day out of the given week number.
 *
 * @param week     Week
 * @param year     Year
 * @param weekday  Weekday
 * @param utc      Assume UTC dates
 * @return Day in a year
 */
export function getDayFromWeek(week: number, year: number, weekday: number = 1, utc: boolean = false): number {
	let date = new Date(year, 0, 4, 0, 0, 0, 0);
	if (utc) {
		date.setUTCFullYear(year);
	}
	let day = week * 7 + weekday - ((date.getDay() || 7) + 3);
	return day;
}

/**
 * Returns 12-hour representation out of the 24-hour hours.
 *
 * @param hours  24-hour number
 * @return 12-hour number
 */
export function get12Hours(hours: number, base?: number): number {
	if (hours > 12) {
		hours -= 12;
	}
	else if (hours === 0) {
		hours = 12;
	}
	return $type.hasValue(base) ? hours + (base - 1) : hours;
}

/**
 * Returns a string name of the tome zone.
 *
 * @param date     Date object
 * @param long     Should return long ("Pacific Standard Time") or short abbreviation ("PST")
 * @param savings  Include information if it's in daylight savings mode
 * @param utc      Assume UTC dates
 * @return Time zone name
 */
export function getTimeZone(date: Date, long: boolean = false, savings: boolean = false, utc: boolean = false): string {
	if (utc) {
		return long ? "Coordinated Universal Time" : "UTC";
	}
	let wotz = date.toLocaleString("UTC");
	let wtz = date.toLocaleString("UTC", { timeZoneName: long ? "long" : "short" }).substr(wotz.length);
	//wtz = wtz.replace(/[+-]+[0-9]+$/, "");
	if (savings === false) {
		wtz = wtz.replace(/ (standard|daylight|summer|winter) /i, " ");
	}
	return wtz;
}


/**
 * ============================================================================
 * NUMBER-RELATED FUNCTIONS
 * ============================================================================
 * @hidden
 */

/**
 * Returns a random number between `from` and `to`.
 *
 * @param from  From number
 * @param to    To number
 * @return Random number
 */
export function random(from: number, to: number): number {
	return Math.floor(Math.random() * to) + from;
}

/**
 * Fits the number into specific `min` and `max` bounds.
 *
 * @param value  Input value
 * @param min    Minimum value
 * @param max    Maximum value
 * @return Possibly adjusted value
 */
export function fitNumber(value: number, min: number, max: number): number {
	if (value > max) {
		return max;
	}
	else if (value < min) {
		return min;
	}
	return value;
}

/**
 * Fits the number into specific `min` and `max` bounds.
 *
 * If the value is does not fit withing specified range, it "wraps" around the
 * values.
 *
 * For example, if we have input value 10 with min set at 1 and max set at 8,
 * the value will not fit. The remainder that does not fit (2) will be added
 * to `min`, resulting in 3.
 *
 * The output of regular `fitNumber()` would return 8 instead.
 *
 * @param value  Input value
 * @param min    Minimum value
 * @param max    Maximum value
 * @return Possibly adjusted value
 */
export function fitNumberRelative(value: number, min: number, max: number): number {
	let gap = max - min;
	if (value > max) {
		value = min + (value - gap * Math.floor(value / gap));
	}
	else if (value < min) {
		value = min + (value - gap * Math.floor(value / gap));
	}
	return value;
}


/**
 * ============================================================================
 * SPRITE-RELATED FUNCTIONS
 * ============================================================================
 * @hidden
 */

/**
 * Converts SVG element coordinates to coordinates within specific [[Sprite]].
 *
 * @param point   SVG coordinates
 * @param sprite  Sprite
 * @return Sprite coordinates
 */
export function svgPointToSprite(point: IPoint, sprite: Sprite): IPoint {
	let x: number = point.x;
	let y: number = point.y;
	let sprites: Sprite[] = [];
	if (sprite) {
		while ($type.hasValue(sprite.parent)) {
			sprites.push(sprite);
			sprite = sprite.parent as any;
		}

		sprites.reverse();

		for (let i = 0; i < sprites.length; i++) {
			let sprite: Sprite = sprites[i];
			let angle: number = sprite.rotation;

			let relativeX = x - sprite.pixelX - sprite.ex;
			let relativeY = y - sprite.pixelY - sprite.ey;

			if (sprite.dx) {
				x -= sprite.dx;
			}
			if (sprite.dy) {
				y -= sprite.dy;
			}

			let scale = sprite.scale;

			// this handles nonscaling
			if(sprite.group){
				scale = sprite.group.scale; 
			}

			x = ($math.cos(-angle) * relativeX - $math.sin(-angle) * relativeY) / scale - sprite.pixelPaddingLeft;
			y = ($math.cos(-angle) * relativeY + $math.sin(-angle) * relativeX) / scale - sprite.pixelPaddingTop;
		}
	}

	return { x: x, y: y };
}

/**
 * Converts coordinates within [[Sprite]] to coordinates relative to the whole
 * SVG element.
 *
 * @param point   Sprite coordinates
 * @param sprite  Sprite
 * @return SVG coordinates
 */
export function spritePointToSvg(point: IPoint, sprite: Sprite): IPoint {
	let x: number = point.x;
	let y: number = point.y;

	if (sprite) {
		while ($type.hasValue(sprite.parent)) {
			let angle: number = sprite.rotation;

			x += sprite.pixelPaddingLeft + sprite.ex;
			y += sprite.pixelPaddingTop + sprite.ey;

			if (sprite.dx) {
				x += sprite.dx;
			}
			if (sprite.dy) {
				y += sprite.dy;
			}

			let scale = sprite.scale;

			// this handles nonscaling
			if(sprite.group){
				scale = sprite.group.scale; 
			}

			let relativeX = sprite.pixelX + ((x * $math.cos(angle) - y * $math.sin(angle))) * scale;
			let relativeY = sprite.pixelY + ((x * $math.sin(angle) + y * $math.cos(angle))) * scale;

			x = relativeX;
			y = relativeY;

			sprite = sprite.parent as any;
		}
	}
	return { x: x, y: y };
}


/**
 * Converts coordinates of one sprite to another.
 *
 * @param point   Sprite coordinates
 * @param sprite  Sprite
 * @param toSprite  Sprite
 * @return converted coordinates
 */
export function spritePointToSprite(point: IPoint, sprite: Sprite, toSprite: Sprite): IPoint {
	return svgPointToSprite(spritePointToSvg(point, sprite), toSprite);
}


/**
 * Converts a rectangle expressed in SVG element coordinates to coordinates
 * within specific [[Sprite]].
 *
 * @param rect    SVG rectangle
 * @param sprite  Sprite
 * @return Sprite rectangle
 */
export function svgRectToSprite(rect: IRectangle, sprite: Sprite): IRectangle {
	let p1: IPoint = svgPointToSprite(rect, sprite);
	let p2: IPoint = svgPointToSprite({ x: rect.x + rect.width, y: rect.y + rect.height }, sprite);
	return { x: p1.x, y: p1.y, width: p2.x - p1.x, height: p2.y - p1.y };
}

/**
 * Converts a rectangle expressed in [[Sprite]] coordinates to SVG coordinates.
 *
 * @param rect    Sprite rectangle
 * @param sprite  Sprite
 * @return SVG rectangle
 */
export function spriteRectToSvg(rect: IRectangle, sprite: Sprite): IRectangle {
	let p1: IPoint = spritePointToSvg(rect, sprite);
	let p2: IPoint = spritePointToSvg({ x: rect.x + rect.width, y: rect.y + rect.height }, sprite);
	return { x: p1.x, y: p1.y, width: p2.x - p1.x, height: p2.y - p1.y };
}

/**
 * Converts global document-wide coordinates to coordinates within SVG element.
 *
 * @param point         Global coordinates
 * @param svgContainer  SVG element
 * @return SVG coordinates
 */
export function documentPointToSvg(point: IPoint, svgContainer: HTMLElement, cssScale?: number): IPoint {
	try {
		let bbox = svgContainer.getBoundingClientRect();

		if (!$type.isNumber(cssScale)) {
			cssScale = 1;
		}

		return {
			"x": (point.x - bbox.left) / cssScale,
			"y": (point.y - bbox.top) / cssScale
		};
	}
	catch (e) {
		return point;
	}
}

/**
 * Converts SVG coordinates to global document-wide coordinates.
 *
 * @param point         SVG coordinates
 * @param svgContainer  SVG element
 * @return Global coordinates
 */
export function svgPointToDocument(point: IPoint, svgContainer: HTMLElement): IPoint {
	try {
		let bbox = svgContainer.getBoundingClientRect();

		return {
			"x": point.x + bbox.left,
			"y": point.y + bbox.top
		};
	}
	catch (e) {
		return point;
	}
}

/**
 * Converts document-wide global coordinates to coordinates within specific
 * [[Sprite]].
 *
 * @param point   Global coordinates
 * @param sprite  Sprite
 * @return Sprite coordinates
 */
export function documentPointToSprite(point: IPoint, sprite: Sprite): IPoint {
	if (sprite && sprite.htmlContainer) {
		let svgPoint: IPoint = documentPointToSvg(point, $type.getValue(sprite.htmlContainer), sprite.svgContainer.cssScale);
		return svgPointToSprite(svgPoint, sprite);
	}
	else {
		return point;
	}
}

/**
 * Converts coordinates within [[Sprite]] to global document coordinates.
 *
 * @param point   Sprite coordinates
 * @param sprite  Sprite
 * @return Global coordinates
 */
export function spritePointToDocument(point: IPoint, sprite: Sprite): IPoint {
	if (sprite && sprite.htmlContainer) {
		let svgPoint: IPoint = spritePointToSvg(point, sprite);
		return svgPointToDocument(svgPoint, $type.getValue(sprite.htmlContainer));
	}
	else {
		return point;
	}
}


/**
 * ============================================================================
 * DEPRECATED FUNCTIONS
 * @todo Review and remove
 * ============================================================================
 * @hidden
 */

/**
 * Returns element's width.
 *
 * @ignore Exclude from docs
 * @param element  Element
 * @return Width (px)
 * @deprecated Not used anywhere
 */
export function width(element: HTMLElement): number {

	let cs = getComputedStyle(element);

	let paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
	let borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);

	return element.clientWidth - paddingX - borderX;
}

/**
 * Returns element's height.
 *
 * @ignore Exclude from docs
 * @param element  Element
 * @return Height (px)
 * @deprecated Not used anywhere
 */
export function height(element: HTMLElement): number {

	let cs = getComputedStyle(element);

	let paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
	let borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

	return element.clientHeight - paddingY - borderY;
}

/**
 * Returns number of decimals
 *
 * @ignore Exclude from docs
 * @param number  Input number
 * @return Number of decimals
 */
export function decimalPlaces(number: number): number {
	let match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	if (!match) { return 0; }
	return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
}


/**
 * A parsed URL
 *
 * @ignore Exclude from docs
 */
export interface Url {
	protocol: string;
	separator: string;
	authority: string;
	domain: string;
	port: string;
	path: string;
	query: string;
	hash: string;
}

const urlRegexp = /^([a-zA-Z][a-zA-Z0-9\+\.\-]*:)?(?:(\/\/)([^\@]+\@)?([^\/\?\#\:]*)(\:[0-9]+)?)?([^\?\#]*)(\?[^\#]*)?(\#.*)?$/;

/**
 * Parses a URL
 *
 * @ignore Exclude from docs
 */
// TODO test this
export function parseUrl(url: string): Url {
	const match = urlRegexp.exec(url);

	return {
		protocol: (match && match[1]) || "",
		separator: (match && match[2]) || "",
		authority: (match && match[3]) || "",
		domain: (match && match[4]) || "",
		port: (match && match[5]) || "",
		path: (match && match[6]) || "",
		query: (match && match[7]) || "",
		hash: (match && match[8]) || ""
	};
}

/**
 * Serializes a Url into a string
 *
 * @ignore Exclude from docs
 */
export function serializeUrl(url: Url): string {
	return url.protocol + url.separator + url.authority + url.domain + url.port + url.path + url.query + url.hash;
}

/**
 * Checks whether a Url is relative or not
 *
 * @ignore Exclude from docs
 */
// TODO is this correct ?
function isRelativeUrl(url: Url): boolean {
	return url.protocol === "" &&
		url.separator === "" &&
		url.authority === "" &&
		url.domain === "" &&
		url.port === "";
}

/**
 * Joins together two URLs, resolving relative URLs correctly
 *
 * @ignore Exclude from docs
 */
// TODO test this
export function joinUrl(left: string, right: string): string {
	const parsedLeft = parseUrl(left);
	const parsedRight = parseUrl(right);

	if (isRelativeUrl(parsedLeft)) {
		throw new Error("Left URL is not absolute");
	}

	if (isRelativeUrl(parsedRight)) {
		// TODO is this correct ?
		if (parsedRight.path !== "") {
			if (parsedRight.path[0] === "/") {
				parsedLeft.path = parsedRight.path;

				// TODO is this correct ?
			} else {
				const leftPath = parsedLeft.path.split(/\//);
				const rightPath = parsedRight.path.split(/\//);

				// TODO is this correct ?
				if (leftPath.length === 0) {
					if (rightPath.length !== 0) {
						leftPath.push("");
					}

				} else if (leftPath.length > 1) {
					leftPath.pop();
				}

				$array.pushAll(leftPath, rightPath);

				parsedLeft.path = leftPath.join("/");

				if (parsedLeft.path !== "" && parsedLeft.path[0] !== "/") {
					throw new Error("URL path must start with /");
				}
			}
		}

		// TODO is this correct ?
		parsedLeft.query = parsedRight.query;
		parsedLeft.hash = parsedRight.hash;

		return serializeUrl(parsedLeft);

	} else {
		return serializeUrl(parsedRight);
	}
}

/**
 * Detects MSIE.
 *
 * @return Is IE?
 */
export function isIE(): boolean {
	return !!(<any>window).MSInputMethodContext && !!(<any>document).documentMode;
}
