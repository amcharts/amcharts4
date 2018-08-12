/**
 * Duration formatting functionality.
 */
import * as tslib_1 from "tslib";
import { Language } from "../utils/Language";
import { BaseObject } from "../Base";
import { getTextFormatter } from "../formatters/TextFormatter";
import { registry } from "../Registry";
import * as $strings from "../utils/Strings";
import * as $object from "../utils/Object";
import * as $utils from "../utils/Utils";
import * as $type from "../utils/Type";
/**
 * DurationFormatter class. Formats numbers as durations.
 *
 * `1000` as `16:40`
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Tutorial on duration formatting
 * @todo Implement syntax to set base unit in format itself
 */
var DurationFormatter = /** @class */ (function (_super) {
    tslib_1.__extends(DurationFormatter, _super);
    /**
     * Constructor
     */
    function DurationFormatter() {
        var _this = _super.call(this) || this;
        /**
         * A base value for negative numbers. Will treat all numbers below this value
         * as negative numbers.
         *
         * @type {number}
         */
        _this._negativeBase = 0;
        /**
         * Holds number format.
         *
         * @type {string}
         */
        _this._durationFormat = "mm:ss";
        /**
         * A base unit to consider values are in.
         *
         * @default "s"
         * @type {string}
         */
        _this._baseUnit = "s";
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
        _this._outputFormat = "svg";
        /**
         * How many milliseconds each unit represents.
         *
         * @type {Object}
         */
        _this._unitValues = {
            "S": 1,
            "s": 1000,
            "m": 60000,
            "h": 3600000,
            "d": 86400000,
            "w": 604800000,
            "M": 2592000000,
            "y": 31536000000,
        };
        /**
         * Collection of aliases for units.
         *
         * @type {Object}
         */
        _this._unitAliases = {
            "Y": "y",
            "D": "d",
            "H": "h",
            "K": "h",
            "k": "h",
            "n": "S"
        };
        _this.className = "DurationFormatter";
        _this.applyTheme();
        return _this;
    }
    /**
     * Formats the number according as duration.
     *
     * For example `1000` (base unit seconds) would be converted to `16:40` as in
     * 16 minutes and 40 seconds.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Tutorial on duration formatting
     * @param  {number | string}  value   Value to format
     * @param  {string}           format  Format to apply
     * @param  {string}           base    Override base unit
     * @return {string}                   Formatted number
     */
    DurationFormatter.prototype.format = function (value, format, base) {
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
        var baseUnit = base || this._baseUnit;
        // no format passed in or empty
        if (typeof format === "undefined" || format === "") {
            format = this._durationFormat;
        }
        // Clean format
        format = $utils.cleanFormat(format);
        // get format info (it will also deal with parser caching)
        var info = this.parseFormat(format, baseUnit);
        // cast to number just in case
        // TODO: maybe use better casting
        var source = Number(value);
        // format and replace the number
        var details;
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
        var formatted = this.applyFormat(source, details);
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
    };
    /**
     * Parses supplied format into structured object which can be used to format
     * the number.
     *
     * @param  {string}  format  Format string, i.e. "#,###.00"
     * @param  {string}  base    Override base unit
     * @return {any}             Parsed information
     */
    DurationFormatter.prototype.parseFormat = function (format, base) {
        var _this = this;
        // check cache
        if (typeof (this.getCache(format)) !== "undefined") {
            return this.getCache(format);
        }
        // no base unit?
        var baseUnit = base || this._baseUnit;
        // Initialize duration parsing info
        var info = {
            "positive": {
                "color": "",
                "template": "",
                "parts": [],
                "source": "",
                "baseUnit": baseUnit,
                "parsed": false,
                "absolute": false
            },
            "negative": {
                "color": "",
                "template": "",
                "parts": [],
                "source": "",
                "baseUnit": baseUnit,
                "parsed": false,
                "absolute": false
            },
            "zero": {
                "color": "",
                "template": "",
                "parts": [],
                "source": "",
                "baseUnit": baseUnit,
                "parsed": false,
                "absolute": false
            }
        };
        // Escape double vertical bars (that mean display one vertical bar)
        format = format.replace("||", $strings.PLACEHOLDER2);
        // Split it up and deal with different formats
        var parts = format.split("|");
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
        $object.each(info, function (part, item) {
            // Already parsed
            if (item.parsed) {
                return;
            }
            // Check cached
            if (typeof _this.getCache(item.source) !== "undefined") {
                info[part] = _this.getCache(item.source);
                return;
            }
            // Begin parsing
            var partFormat = item.source;
            // Check for [] directives
            var dirs = [];
            dirs = item.source.match(/^\[([^\]]*)\]/);
            if (dirs && dirs.length && dirs[0] !== "") {
                partFormat = item.source.substr(dirs[0].length);
                item.color = dirs[1];
            }
            // Let TextFormatter split into chunks
            var chunks = getTextFormatter().chunk(partFormat, true);
            for (var i = 0; i < chunks.length; i++) {
                var chunk = chunks[i];
                // replace back double vertical bar
                chunk.text = chunk.text.replace($strings.PLACEHOLDER2, "|");
                if (chunk.type === "value") {
                    // Just "Duration"?
                    if (chunk.text.toLowerCase() === "duration") {
                        chunk.text = _this._durationFormat;
                    }
                    // Check for "a" (absolute) modifier
                    if (chunk.text.match(/[yYMdDwhHKkmsSn]+a/)) {
                        item.absolute = true;
                        chunk.text = chunk.text.replace(/([yYMdDwhHKkmsSn]+)a/, "$1");
                    }
                    // Find all possible parts
                    var matches = chunk.text.match(/y+|Y+|M+|d+|D+|w+|h+|H+|K+|k+|m+|s+|S+|n+/g);
                    if (matches) {
                        // Populate template
                        for (var x = 0; x < matches.length; x++) {
                            // Is it an alias?
                            if (!$type.hasValue(matches[x])) {
                                matches[x] = _this._unitAliases[matches[x]];
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
            _this.setCache(item.source, item);
            // Mark this as parsed
            item.parsed = true;
        });
        // Save cache (the whole thing)
        this.setCache(format, info);
        return info;
    };
    /**
     * Applies parsed format to a numeric value.
     *
     * @param  {number}  value    Value
     * @param  {any}     details  Parsed format as returned by {parseFormat}
     * @return {string}           Formatted duration
     */
    DurationFormatter.prototype.applyFormat = function (value, details) {
        // Use absolute values
        var negative = !details.absolute && (value < this._negativeBase);
        value = Math.abs(value);
        // Recalculate to milliseconds
        var tstamp = this.toTimeStamp(value, details.baseUnit);
        // Init return value
        var res = details.template;
        // Iterate through duration parts
        for (var i = 0; i < details.parts.length; i++) {
            // Gather the part
            var part = details.parts[i];
            var unit = part.substr(0, 1);
            var digits = part.length;
            // Calculate current unit value
            var ints = Math.floor(tstamp / this._unitValues[unit]);
            res = res.replace($strings.PLACEHOLDER, $utils.padString(ints, digits, "0"));
            // Reduce timestamp
            tstamp -= ints * this._unitValues[unit];
        }
        // Reapply negative sign
        if (negative) {
            res = "-" + res;
        }
        return res;
    };
    /**
     * Converts numeric value to timestamp in milliseconds.
     *
     * @param  {number}  value     A source value
     * @param  {string}  baseUnit  Base unit the source value is in: "q", "s", "i", "h", "d", "w", "m", "y"
     * @return {number}            Value representation as a timestamp in milliseconds
     */
    DurationFormatter.prototype.toTimeStamp = function (value, baseUnit) {
        return value * this._unitValues[baseUnit];
    };
    /**
     * Invalidates the parent [[Sprite]] object.
     */
    DurationFormatter.prototype.invalidateSprite = function () {
        if (this.sprite) {
            this.sprite.invalidate();
        }
    };
    Object.defineProperty(DurationFormatter.prototype, "durationFormat", {
        /**
         * @return {string} Duration format
         */
        get: function () {
            return this._durationFormat;
        },
        /**
         * Duration format.
         *
         * @default "mm:ss"
         * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-duration/} Tutorial on duration formatting
         * @param {string}  format  Duration format
         */
        set: function (format) {
            this._durationFormat = format;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DurationFormatter.prototype, "baseUnit", {
        /**
         * @return {string} Base unit
         */
        get: function () {
            return this._baseUnit;
        },
        /**
         * Base unit the values are in.
         *
         * A base unit will be used to recalculate the numeric value to millisecond
         * timestamps.
         *
         * Available options:
         *
         * * "q" - millisecond
         * * "s" - second
         * * "i" - minute
         * * "h" - hour
         * * "d" - day
         * * "w" - week
         * * "m" - month
         * * "y" - year
         *
         * @default "s"
         * @param {string}  baseUnit  A base unit
         */
        set: function (baseUnit) {
            this._baseUnit = baseUnit.toLowerCase();
            this.invalidateSprite();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DurationFormatter.prototype, "outputFormat", {
        /**
         * Getter for output format.
         *
         * @ignore Exclude from docs
         * @return {string} Output format
         */
        get: function () {
            return this._outputFormat;
        },
        /**
         * Setter for output format: "svg" or "html.
         *
         * @ignore Exclude from docs
         * @param {string}  value  Output format
         */
        set: function (outputFormat) {
            this._outputFormat = outputFormat.toLowerCase();
            this.invalidateSprite();
        },
        enumerable: true,
        configurable: true
    });
    return DurationFormatter;
}(BaseObject));
export { DurationFormatter };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["DurationFormatter"] = DurationFormatter;
//# sourceMappingURL=DurationFormatter.js.map