/**
 * Handles formatting of pseudo-markup in text.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../Base";
import { AMElement } from "../rendering/AMElement";
import { Adapter } from "../utils/Adapter";
import { registry } from "../Registry";
import * as $strings from "../utils/Strings";
import * as $type from "../utils/Type";
/**
 * Handles formatting of pseudo-markdown in text.
 *
 * @todo Encode < > in output
 * @todo Add more adapters
 * @important
 */
var TextFormatter = /** @class */ (function (_super) {
    tslib_1.__extends(TextFormatter, _super);
    /**
     * Constructor
     */
    function TextFormatter() {
        var _this = _super.call(this) || this;
        /**
         * Adapter.
         *
         * @type {Adapter<TextFormatter, ITextFormatterAdapters>}
         */
        _this.adapter = new Adapter(_this);
        _this.className = "TextFormatter";
        _this.applyTheme();
        return _this;
    }
    TextFormatter.prototype.debug = function () { };
    /**
     * Formats the text according to specifications passed in.
     *
     * @param  {string}  text    Text to format
     * @param  {string}  output  Output format (svg, html)
     * @return {string}          Formatted text
     */
    TextFormatter.prototype.format = function (text, output) {
        // Apply default
        if (!$type.hasValue(output)) {
            output = "svg";
        }
        // Init return value
        var formatted = "";
        // Replace double (escaped) square spaces with remporary codes
        text = this.escape(text);
        // Divvy up the string by style tags
        var styles = text.match(/\[([^\]]*?)\]/gm);
        if (!styles) {
            // Nothing to do here - no formatting elements
            return this.wrap(text, "", output);
        }
        // Get pure text - no style tags
        var texts = text.split(/\[[^\[\]]*\]/);
        // Go through each of the texts and wrap it in style tags
        for (var i = 0; i < texts.length; i++) {
            // Get text bit
            var t = texts[i];
            // Check if string is empty
            if (t === "") {
                continue;
            }
            // Run through an adapter
            t = this.adapter.apply("chunk", t);
            // Get related style
            var s = "";
            if (i > 0) {
                s = styles[i - 1].replace('[', '').replace(']', '');
            }
            // Wrap text in tag
            formatted += this.wrap(t, s, output);
        }
        // Replace placeholders back
        formatted = this.unescape(formatted);
        // Return result
        return this.cleanUp(formatted);
    };
    /**
     * Replaces brackets with temporary placeholders.
     *
     * @ignore Exclude from docs
     * @param  {string}  text  Input text
     * @return {string}        Escaped text
     */
    TextFormatter.prototype.escape = function (text) {
        return text.
            replace(/\[\[/g, registry.getPlaceholder("1")).
            replace(/\]\]/g, registry.getPlaceholder("2")).
            replace(/\{\{/g, registry.getPlaceholder("3")).
            replace(/\}\}/g, registry.getPlaceholder("4")).
            replace(/\'\'/g, registry.getPlaceholder("5"));
    };
    /**
     * Replaces placeholders back to brackets.
     *
     * @ignore Exclude from docs
     * @param  {string}  text  Escaped text
     * @return {string}        Unescaped text
     */
    TextFormatter.prototype.unescape = function (text) {
        return text.
            replace(new RegExp(registry.getPlaceholder("1"), "g"), "[[").
            replace(new RegExp(registry.getPlaceholder("2"), "g"), "]]").
            replace(new RegExp(registry.getPlaceholder("3"), "g"), "{{").
            replace(new RegExp(registry.getPlaceholder("4"), "g"), "}}").
            replace(new RegExp(registry.getPlaceholder("5"), "g"), "'");
    };
    /**
     * Cleans up the text text for leftover double square brackets.
     *
     * @ignore Exclude from docs
     * @param  {string}  text  Input text
     * @return {string}        Cleaned up text
     */
    TextFormatter.prototype.cleanUp = function (text) {
        return text.
            replace(/\[\[/g, "[").
            replace(/\]\]/g, "]").
            replace(/\{\{/g, "{").
            replace(/\}\}/g, "}").
            replace(/\'\'/g, "'");
    };
    /**
     * Wraps text into corresponding tags.
     *
     * @ignore Exclude from docs
     * @param  {string}  text   Text to wrap
     * @param  {string}  style  Styles
     * @param  {string}  output  Format to output in (svg, html)
     * @return {string}          Formatted string
     */
    TextFormatter.prototype.wrap = function (text, style, output) {
        if (style === "" || style === "/") {
            //return text;
            style = "";
        }
        switch (output) {
            case "html":
                return this.wrapHtml(text, this.translateStyleShortcuts(style));
            default:
                return this.wrapSvg(text, this.translateStyleShortcuts(style));
        }
    };
    /**
     * Wraps text in styled SVG tag.
     *
     * @ignore Exclude from docs
     * @param  {string}  text   Text to wrap
     * @param  {string}  style  Style property
     * @return {string}         Formatted tag
     */
    TextFormatter.prototype.wrapSvg = function (text, style) {
        if (style === "") {
            return "<tspan>" + text + "</tspan>";
        }
        else {
            return "<tspan style='" + style + "'>" + text + "</tspan>";
        }
    };
    /**
     * Returns an SVG `<tspan>` element.
     *
     * @ignore Exclude from docs
     * @param  {string}     text   Text
     * @param  {string}     style  Style
     * @return {AMElement}         Element
     */
    TextFormatter.prototype.getSvgElement = function (text, style) {
        var element = new AMElement("tspan");
        element.textContent = text;
        if (style) {
            element.node.setAttribute("style", style);
        }
        return element;
    };
    /**
     * Wraps text in HTML <span> tag.
     *
     * @ignore Exclude from docs
     * @param  {string}  text   Text to wrap
     * @param  {string}  style  Style property
     * @return {string}         Formatted tag
     * @todo Translate SVG styles into HTML ones
     */
    TextFormatter.prototype.wrapHtml = function (text, style) {
        if (style === "") {
            return "<span>" + text + "</span>";
        }
        else {
            return "<span style='" + this.styleSvgToHtml(style) + "'>" + text + "</span>";
        }
    };
    /**
     * Returns an HTML `<span>` element.
     *
     * @ignore Exclude from docs
     * @param  {string}       text   Text/HTML
     * @param  {string}       style  Style definition
     * @return {HTMLElement}         HTML element
     */
    TextFormatter.prototype.getHtmlElement = function (text, style) {
        var element = document.createElement("span");
        element.innerHTML = text;
        if (style) {
            element.setAttribute("style", style);
        }
        return element;
    };
    /**
     * Trabslates SVG CSS into HTML CSS.
     *
     * @ignore Exclude from docs
     * @param  {string}  style  SVG CSS
     * @return {string}         HTML CSS
     * @todo Implement actual translation
     */
    TextFormatter.prototype.styleSvgToHtml = function (style) {
        style = style.replace(/fill:/, "color:");
        return style;
    };
    /**
     * Translates style shortcuts into full styles, i.e.:
     * "bold" => "font-weight: bold"
     * "#f00" => "fill: #f00"
     *
     * @ignore Exclude from docs
     * @param  {string}  style  Untranslated style
     * @return {string}         Translated style
     * @todo Implement actual translation
     */
    TextFormatter.prototype.translateStyleShortcuts = function (style) {
        if (style == "[ ]") {
            return "";
        }
        // Get style parts
        var b = style.match(/([\w\-]*:[\s]?[^;\s\]]*)|(\#[\w]{1,6})|([\w]+)|(\/)/gi);
        // Empty?
        if (!b) {
            return style;
        }
        // Check each part
        for (var i = 0; i < b.length; i++) {
            if (b[i].match(/^bold$/i)) {
                // Bold
                b[i] = "font-weight:" + b[i];
            }
            else if (b[i] == "/") {
                // Just closing tag
                // Do nothing
                b[i] = "";
            }
            else if (!b[i].match(/:/)) {
                // Color
                b[i] = "fill:" + b[i];
            }
        }
        return b.join(';');
    };
    /**
     * Splits string into chunks. (style blocks, quoted blocks, regular blocks)
     *
     * If the second parameter `quotedBlocks` is set to `true` this method will
     * also single out text blocks enclosed within single quotes that no
     * formatting should be applied to, and they should be displayed as is.
     *
     * Default for the above is `false`, so that you can use single quote in text
     * without escaping it.
     *
     * If enabled, single quotes can be escaped by doubling it - adding two
     * single quotes, which will be replaced by a one single quote in the final
     * output.
     *
     * @ignore Exclude from docs
     * @param  {string}    text          Text to chunk
     * @param  {boolean}   quotedBlocks  Use quoted blocks
     * @return {string[]}                Array of string chunks
     */
    TextFormatter.prototype.chunk = function (text, quotedBlocks) {
        if (quotedBlocks === void 0) { quotedBlocks = false; }
        // Init result
        var res = [];
        // Replace double (escaped) square spaces and quotes with temporary codes
        text = this.escape(text);
        // Deal with style blocks
        var chunks = quotedBlocks ? text.split("'") : [text];
        for (var i = 0; i < chunks.length; i++) {
            var chunk = chunks[i];
            // Empty?
            if (chunk === "") {
                continue;
            }
            if ((i % 2) === 0) {
                // Text outside quotes
                // Parse for style blocks which are "text" chunks, the rest chunks are
                // "value"
                chunk = chunk.replace(/\]\[/g, "]" + $strings.PLACEHOLDER + "[");
                chunk = chunk.replace(/\[\]/g, "[ ]");
                var chunks2 = chunk.split(/[\[\]]+/);
                for (var i2 = 0; i2 < chunks2.length; i2++) {
                    var chunk2 = this.cleanUp(this.unescape(chunks2[i2]));
                    // Placeholder?
                    if (chunk2 === $strings.PLACEHOLDER) {
                        continue;
                    }
                    // Empty?
                    if (chunk2 === "") {
                        continue;
                    }
                    // Block or value
                    if ((i2 % 2) === 0) {
                        res.push({
                            "type": "value",
                            "text": this.adapter.apply("chunk", chunk2)
                        });
                    }
                    else {
                        res.push({
                            "type": "format",
                            "text": "[" + chunk2 + "]"
                        });
                    }
                }
            }
            else {
                // A text within doublequotes
                // All chunks are "text"
                var chunks2 = chunk.split(/[\[\]]+/);
                for (var i2 = 0; i2 < chunks2.length; i2++) {
                    var chunk2 = this.cleanUp(this.unescape(chunks2[i2]));
                    // Empty?
                    if (chunk2 === "") {
                        continue;
                    }
                    // Block or text
                    if ((i2 % 2) === 0) {
                        res.push({
                            "type": "text",
                            "text": chunk2
                        });
                    }
                    else if (this.isImage(chunk2)) {
                        res.push({
                            "type": "image",
                            "text": "[" + chunk2 + "]"
                        });
                    }
                    else {
                        res.push({
                            "type": "format",
                            "text": "[" + chunk2 + "]"
                        });
                    }
                }
            }
        }
        return res;
    };
    /**
     * Checks if supplied format contains image information and should be
     * formatted as such.
     * I.e.: `[img: myImage.png]`
     *
     * @ignore Exclude from docs
     * @param  {string}   text  Format
     * @return {boolean}        `true` if it is an image
     */
    TextFormatter.prototype.isImage = function (text) {
        return text.match(/img[ ]?:/) ? true : false;
    };
    return TextFormatter;
}(BaseObject));
export { TextFormatter };
var formatter;
/**
 * Returns the global instance of [[TextFormatter]].
 *
 * All classes and instances should reuse this universal text formatter,
 * rather than create their own instance of it.
 *
 * @type {TextFormatter}
 */
export function getTextFormatter() {
    if (formatter == null) {
        formatter = new TextFormatter();
    }
    return formatter;
}
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["TextFormatter"] = TextFormatter;
//# sourceMappingURL=TextFormatter.js.map