/**
 * Text class deals with all text placed on chart.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../Sprite";
import { system } from "../System";
import { MultiDisposer } from "../utils/Disposer";
import * as $math from "../utils/Math";
import * as $utils from "../utils/Utils";
import * as $iter from "../utils/Iterator";
import * as $type from "../utils/Type";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
;
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Text is used to display highly configurable, data-enabled textual elements.
 *
 * ## Data Binding
 *
 * A Text element can dynamically parse and populate its contents with values
 * from a [[DataItem]].
 *
 * To activate such binding, set element's `dataItem` property.
 *
 * When activated, text contents will be parsed for special tags, e.g.:
 *
 * ```TypeScript
 * label.dataItem = myDataItem;
 * label.text = "The title is: ${title}";
 * ```
 * ```JavaScript
 * label.dataItem = myDataItem;
 * label.text = "The title is: ${title}";
 * ```
 *
 * The above will atuomatically replace "${title}" in the string with the
 * actual data value from `myDataItem`.
 *
 * ## Fast Rendering
 *
 * Creating elements in SVG is expensive. If you are redrawing textual elements
 * constantly, like animating a value, you might consider enabling "shallow
 * rendering".
 *
 * ```TypeScript
 * text.shallowRendering = true;
 * ```
 * ```JavaScript
 * text.shallowRendering = true;
 * ```
 *
 * If this is set to `true` [[Text]] will try to re-use cached line height
 * and DOM elements in order to speed up rendering as much as possible.
 *
 * The downside is that dimensions of the text element might change during
 * the process, making it not fit into selected bounds, and/or not well
 * aligned.
 *
 *
 * @see {@link ITextEvents} for a list of available events
 * @see {@link ITextAdapters} for a list of available Adapters
 * @todo Vertical align
 * @todo Linkage to relative documentation (formatters, data binding)
 * @important
 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    /**
     * Constructor
     */
    function Text() {
        var _this = 
        // Execute super's constructor
        _super.call(this) || this;
        /**
         * Indicates if the whole text does not fit into max dimenstions set for it.
         *
         * @type {boolean}
         */
        _this.isOversized = false;
        // Set this class name
        _this.className = "Text";
        // Create the element
        _this.element = _this.paper.addGroup("g");
        _this.fill = new InterfaceColorSet().getFor("text");
        _this.textDecoration = "none";
        _this.fontWeigth = "normal";
        // Set defaults
        _this.wrap = false;
        _this.truncate = false;
        _this.ellipsis = "...";
        _this.textAlign = "start";
        _this.textValign = "top";
        _this.renderingFrequency = 2;
        // Set up adapters for manipulating accessibility
        _this.adapter.add("readerTitle", function (arg) {
            if (!arg) {
                arg = _this.populateString($utils.plainText(!$utils.empty(_this.html)
                    ? _this.html
                    : _this.text));
            }
            return arg;
        });
        // Add events to watch for maxWidth/maxHeight changes so that we can
        // invalidate this
        _this.events.on("maxsizechanged", function (ev) {
            if ((_this._bbox.width > _this.availableWidth)
                || ((_this._bbox.width < _this.availableWidth) && _this.isOversized)
                || (_this._bbox.height > _this.availableHeight)
                || ((_this._bbox.height < _this.availableHeight) && _this.isOversized)) {
                _this.invalidate();
            }
            else {
                _this.alignSVGText();
            }
        });
        // helps to avoid a strange bug which incorrectly measures text elementz\
        _this.events.once("inited", function () {
            system.events.once("enterframe", function () {
                if (_this.parent) {
                    _this.parent.invalidate();
                }
            });
        }, _this);
        // Aply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Redraws the element, but only if the text actually changed from the
     * currently displayed one.
     *
     * This is useful for saving processing power by eliminating unnecessary
     * expensive redraws.
     */
    Text.prototype.update = function () {
        if (this.updateCurrentText()) {
            this.invalidate();
        }
    };
    /**
     * Updates current text according to data item and supported features.
     * Returns `true` if current text has changed.
     *
     * @return {boolean} Text changed?
     */
    Text.prototype.updateCurrentText = function () {
        // Determine output format
        var output, text;
        if (!$utils.empty(this.html) && this.paper.supportsForeignObject()) {
            // We favor HTML text if it's set and browser supports `foreignObject`
            output = "html";
            text = this.html;
        }
        else if (!$utils.empty(this.text)) {
            // HTML not set or not supported, use SVG text
            output = "svg";
            text = this.text;
        }
        else if (!$utils.empty(this.html)) {
            // SVG is not set, let's strip the tags out of HTML and display as SVG
            output = "svg";
            text = $utils.stripTags(this.html);
        }
        else {
            // Empty, noting to do here
            text = "";
            return;
        }
        // Empty string
        if (!$type.hasValue(text)) {
            return;
        }
        // Need to format text all the time
        if (text !== "") {
            text = this.populateString(text, this.dataItem);
        }
        // Update the text
        var changed = text != this._currentText || output != this._currentFormat;
        this._currentText = text;
        this._currentFormat = output;
        return changed;
    };
    /**
     * Draws the textual label.
     *
     * @ignore Exclude from docs
     */
    Text.prototype.draw = function () {
        // Draw super
        _super.prototype.draw.call(this);
        // Reset
        this.isOversized = false;
        // Update text
        this.updateCurrentText();
        // Determine output format
        var output = this._currentFormat;
        var text = this._currentText;
        // Empty string
        if (!$type.hasValue(text)) {
            return;
        }
        // Chop up text into lines
        // We're still processing SVG and HTML in the same way for now
        var lines = text.split("\n");
        // Do we need to go through the trouble of measuring lines
        var measure = true; // (lines.length > 1) || this.wrap;
        // Calculate max width and height
        var maxWidth = $math.max(this.availableWidth - this.pixelPaddingLeft - this.pixelPaddingRight, 0);
        var maxHeight = $math.max(this.availableHeight - this.pixelPaddingTop - this.pixelPaddingBottom, 0);
        // SVG or HTML?
        if (output === "svg") {
            /**
             * SVG
             */
            // Clear the element
            var group = this.element;
            if (!this.shallowRendering) {
                group.disposeChildren();
                this.resetBBox();
            }
            else {
                this._bbox.height = 0;
            }
            // Init state variables
            var currentHeight = 0;
            var currentFormat = "";
            // Process each line
            for (var i = 0; i < lines.length; i++) {
                // Get line
                var line = lines[i];
                // Chunk up the line and process each chunk
                var chunks = system.textFormatter.chunk(line);
                var currentLineHeight = 0, currentLineWidth = 0;
                var firstChunk = true;
                var skipTextChunks = false;
                // Create line element or grab it from cache
                var lineInfo = void 0;
                if (this.shallowRendering && (lineInfo = this.getLineInfo(i))) {
                    // Empty line
                    lineInfo.element.textContent = "";
                }
                else {
                    // Init new line info
                    lineInfo = {
                        "element": this.getSVGLineElement("", 0),
                        "complex": false
                    };
                    // Create the line element
                    //lineInfo.element = this.getSVGLineElement("", 0);
                    //lineElement = this.getSVGLineElement("", 0);
                    group.add(lineInfo.element);
                }
                if (this.rtl) {
                    chunks.reverse();
                }
                // Process each chunk
                for (var x = 0; x < chunks.length; x++) {
                    // If there's more than one chunk, means the line is "complex"
                    if (x) {
                        lineInfo.complex = true;
                    }
                    // Get chunk
                    var chunk = chunks[x];
                    // Is this chunk format or text?
                    if (chunk.type === "format") {
                        // Log current format, so that we can apply it to multiple lines if
                        // necessary
                        currentFormat = chunk.text;
                    }
                    else {
                        // It's text block
                        // Need to skip?
                        // We do this when truncating. We can't just simply go ahead and
                        // abandon chunk processing as they might have formatting
                        // instructions in them that are relevant for subsequent lines
                        if (skipTextChunks) {
                            continue;
                        }
                        // Needs measuring?
                        if (measure) {
                            /**
                             * The text needs measuring
                             * We will use the temporary element to measure stuff before
                             * adding it to the main "production" element
                             */
                            // Add chunk to the current element
                            //lineInfo.element.content += $utils.trim(system.textFormatter.format(currentFormat + chunk.text, output));
                            lineInfo.element.add(system.textFormatter.getSvgElement(chunk.text, system.textFormatter.translateStyleShortcuts(currentFormat)));
                            // Measure it if necessary
                            if (!this.shallowRendering || !lineInfo.bbox || lineInfo.complex) {
                                lineInfo.bbox = lineInfo.element.getBBox();
                                lineInfo.bbox.width = Math.ceil(lineInfo.bbox.width);
                            }
                            // Updated current line height
                            if (currentLineHeight < lineInfo.bbox.height) {
                                currentLineHeight = lineInfo.bbox.height;
                            }
                            // Wrapping?
                            if ((this.wrap || this.truncate) && (lineInfo.bbox.width > maxWidth)) {
                                // Set oversized
                                this.isOversized = true;
                                // Take temporary measurements
                                var lineText = lineInfo.element.textContent;
                                var avgCharWidth = (lineInfo.bbox.width / lineText.length) * .9;
                                // Calculate average number of symbols / width
                                var excessChars = $math.min(Math.ceil((lineInfo.bbox.width - maxWidth) / avgCharWidth), lineText.length);
                                // Are we truncating or auto-wrapping text?
                                if (this.truncate) {
                                    /**
                                     * Processing line truncation
                                     * With the addition of each text chunk we measure if current
                                     * line does not exceed maxWidth. If it does, we will stop
                                     * addition of further chunks as well as try to truncate
                                     * current or any number of previous chunks with an added
                                     * ellipsis
                                     */
                                    // Indicator whether we need to add ellipsis to the current
                                    // element, even if it fits. This is needed to indicate
                                    // whether we have already removed some subsequent chunks in
                                    // which case we need to add ellipsis.
                                    var addEllipsis = false;
                                    // Process each child in the temporary line, until the whole
                                    // line fits, preferably with an ellipsis
                                    // TODO use iterator instead
                                    for (var e = lineInfo.element.children.length - 1; e >= 0; e--) {
                                        // Get current element
                                        var element = lineInfo.element.children.getIndex(e);
                                        // Add ellipsis only if previous chunk was removed in full
                                        // and this chunk already fits
                                        //if (addEllipsis && (bbox.width <= maxWidth)) {
                                        if (addEllipsis && (lineInfo.bbox.width <= maxWidth)) {
                                            // Add ellipsis
                                            element.textContent += " " + this.ellipsis;
                                            // Measure again (we need to make sure ellipsis fits)
                                            lineInfo.bbox = lineInfo.element.getBBox();
                                            lineInfo.bbox.width = Math.floor(lineInfo.bbox.width);
                                            // If it fits, we're done here
                                            // If it doesn't we continue rolling
                                            if (lineInfo.bbox.width <= maxWidth) {
                                                break;
                                            }
                                        }
                                        addEllipsis = false;
                                        // Get element text
                                        var elementText = element.textContent;
                                        // Calculate average number of symbols / width
                                        lineText = lineInfo.element.textContent;
                                        excessChars = $math.min(Math.ceil((lineInfo.bbox.width - maxWidth) / avgCharWidth), lineText.length);
                                        // Do this until we fit
                                        while ((lineInfo.bbox.width > maxWidth) && (excessChars <= lineText.length) && (excessChars > 0)) {
                                            // Calculate max available chars
                                            var maxChars = $math.max(elementText.length - excessChars - this.ellipsis.length, 1);
                                            // Is there anything left?
                                            if (maxChars <= 1) {
                                                // Nope, let's jump to the previous item
                                                // Set excess characters to zero so that this loop does
                                                // not repeat when it over
                                                excessChars = 0;
                                                // Add ellipsis to previous item
                                                // Subsequent iterations will check if the ellipsis fits
                                                if (e > 0) {
                                                    // Indicating to add ellipsis to previous item
                                                    addEllipsis = true;
                                                    // Removing this node
                                                    lineInfo.element.removeElement(element);
                                                }
                                            }
                                            // If we're on first chunk of text, we can break mid-word.
                                            // Otherwise we break by words
                                            if (e === 0) {
                                                elementText = $utils.truncateWithEllipsis(elementText, maxChars, this.ellipsis, false, this.rtl);
                                            }
                                            else {
                                                elementText = $utils.truncateWithEllipsis(elementText, maxChars, this.ellipsis, true, this.rtl);
                                            }
                                            // Set truncated text
                                            element.textContent = elementText;
                                            // Measure again
                                            lineInfo.bbox = lineInfo.element.getBBox();
                                            lineInfo.bbox.width = Math.floor(lineInfo.bbox.width);
                                            // Increase excess characters count, just in case it still
                                            // doesn't fit and we have to go at it again
                                            excessChars = Math.ceil(excessChars * 1.1);
                                        }
                                        // Do not process further chunks
                                        skipTextChunks = true;
                                    }
                                }
                                else {
                                    /**
                                     * Processign auto-wrap
                                     * In this case we're going to be adding text chunks until
                                     * they don't fit into current line. Once that happens we will
                                     * inject the rest of the chunks to the next line
                                     */
                                    // Get last node added and measure it
                                    var lastElement_1 = lineInfo.element.lastChild;
                                    // Init split lines
                                    var splitLines = void 0;
                                    while ((lineInfo.bbox.width > maxWidth) && (excessChars <= lineText.length) && (excessChars > 0)) {
                                        // Calculate max available chars
                                        var maxChars = $math.max(chunk.text.length - excessChars, 1);
                                        // Don't split the words mid-word if it's not the first chunk
                                        // in the line
                                        if (firstChunk) {
                                            // Split mid-word if necessary
                                            splitLines = $utils.splitTextByCharCount(chunk.text, maxChars, false, this.rtl);
                                        }
                                        else {
                                            // Don't split mid-word
                                            splitLines = $utils.splitTextByCharCount(chunk.text, maxChars, true, this.rtl);
                                            // Check if the first word is too long
                                            if ((splitLines[0].length > maxChars) || maxChars === 1) {
                                                // Yes - move the whole chunk to the next line
                                                // Remove the element we just added
                                                lineInfo.element.removeElement(lastElement_1);
                                                // Break out of the while on next cycle
                                                excessChars = 0;
                                            }
                                        }
                                        // Use the first line to update last item
                                        if (excessChars > 0) {
                                            lastElement_1.textContent = system.textFormatter.cleanUp($utils.trim(splitLines.shift()));
                                        }
                                        // Measure again, just in case
                                        lineInfo.bbox = lineInfo.element.getBBox();
                                        lineInfo.bbox.width = Math.floor(lineInfo.bbox.width);
                                        // Increase excess characters count, just in case it still
                                        // doesn't fit and we have to go at it again
                                        excessChars = Math.ceil(excessChars * 1.1);
                                    }
                                    // Construct the rest of the line
                                    if (splitLines.length > 0) {
                                        var restOfLine = "";
                                        // Add leftovers from splitting the current chunk
                                        if ($type.hasValue(splitLines)) {
                                            if (this.rtl) {
                                                restOfLine += splitLines.join("") + currentFormat;
                                            }
                                            else {
                                                restOfLine += currentFormat + splitLines.join("");
                                            }
                                        }
                                        // Add the rest of the chunks
                                        for (var c = x + 1; c < chunks.length; c++) {
                                            restOfLine += chunks[c].text;
                                        }
                                        // Inject the rest of the lines as chunks for subsequent
                                        lines.splice(i + 1, 0, restOfLine);
                                    }
                                    // Skip processing the rest of the chunks
                                    skipTextChunks = true;
                                }
                            }
                            // Let's update the text's bbox with the line's one
                            if (this._bbox.width < lineInfo.bbox.width) {
                                this._bbox.width = lineInfo.bbox.width;
                            }
                            this._bbox.height = currentHeight + currentLineHeight;
                            // Position current line
                            lineInfo.element.attr({
                                "x": "0",
                                "y": currentHeight + currentLineHeight,
                                "dy": (-0.2 * currentLineHeight).toString()
                            });
                        }
                        else {
                            /**
                             * Does not need measuring
                             * Let's just plop everything to the main element
                             */
                            lineInfo.element.add(system.textFormatter.getSvgElement(chunk.text, system.textFormatter.translateStyleShortcuts(currentFormat)));
                        }
                        firstChunk = false;
                    }
                }
                // Trim the last item
                var lastElement = lineInfo.element.lastChild;
                if (lastElement) {
                    lastElement.textContent = this.rtl ?
                        $utils.ltrim(lastElement.textContent) :
                        $utils.rtrim(lastElement.textContent);
                }
                // Increment collective height
                currentHeight += currentLineHeight;
                // Save line cache if necessary
                if (this.shallowRendering) {
                    this.addLineInfo(lineInfo);
                }
            }
            // Check if maybe we need to hide the whole label if it doesn't fit
            if (this.hideOversized && ((this.availableWidth < this._bbox.width) || (this.availableHeight < this._bbox.height))) {
                this.hide();
                this.isOversized = true;
            }
            else {
                this.show();
            }
            // Align the lines
            this.alignSVGText();
        }
        else {
            /**
             * HTML
             */
            // Create a ForeignObject to use as HTML container
            this.element = this.paper.foreignObject();
            this.paper.append(this.group);
            this.resetBBox();
            // Set ForeignObject dimensions
            var width = maxWidth > 0 ? (maxWidth).toString() + "px" : "100%";
            var height = maxHeight > 0 ? (maxHeight).toString() + "px" : "100%";
            this.element.attr({
                "width": width,
                "height": height
            });
            // Create line element
            //let lineElement: HTMLElement = this.getHTMLLineElement(system.textFormatter.format(this.html, output));
            var lineElement = this.getHTMLLineElement(text);
            this.element.node.appendChild(lineElement);
            this.isOversized = true;
        }
        // Set applicable styles
        this.setStyles();
    };
    /**
     * Aligns the lines horizontally ant vertically, based on properties.
     *
     * @ignore Exclude from docs
     */
    Text.prototype.alignSVGText = function () {
        var _this = this;
        // Ger Group
        var group = this.element;
        // Is there anything to align?
        if (!group.children) {
            return;
        }
        // Calculate max width
        var maxWidth = $math.max(this.availableWidth - this.pixelPaddingLeft - this.pixelPaddingRight, 0);
        // Measure the whole stuff
        //let bbox: SVGRect = this.element.getBBox();
        var width = $math.max(this._bbox.width, maxWidth);
        // Process each line
        $iter.each(group.children.backwards().iterator(), function (element) {
            // Align horizontally
            // Since we are using `text-anchor` for horizontal alignement, all we need
            // to do here is move the `x` position
            switch (_this.textAlign) {
                case "middle":
                    element.attr({ "x": (width / 2).toString() });
                    element.attr({ "text-anchor": "middle" });
                    break;
                case "end":
                    if (_this.rtl) {
                        element.attr({ "x": "0" });
                        element.attr({ "text-anchor": "end" });
                    }
                    else {
                        element.attr({ "x": (width).toString() });
                        element.attr({ "text-anchor": "end" });
                    }
                    break;
                default:
                    if (_this.rtl) {
                        element.attr({ "x": (width).toString() });
                        element.attr({ "text-anchor": "start" });
                    }
                    else {
                        element.attr({ "x": "0" });
                        element.removeAttr("text-anchor");
                    }
                    break;
            }
            // Align vertically
            // @todo Maybe?
        });
    };
    /**
     * Produces an SVG line element with formatted text.
     *
     * @ignore Exclude from docs
     * @param  {string}     text    Text to wrap into line
     * @param  {number}     y       Current line vertical position
     * @return {AMElement}          A DOM element
     * @todo Implement HTML support
     */
    Text.prototype.getSVGLineElement = function (text, y) {
        // Create a <text> node and set text
        var element = this.paper.addGroup("text");
        element.textContent = text;
        // Set parameters
        element.attr({
            "x": "0"
            //"alignment-baseline": "hanging",
            //"baseline-shift": "-20%",
            //"text-anchor": "center"
        });
        // Set `y` position
        if ($type.hasValue(y)) {
            element.attr({
                "y": y.toString()
            });
        }
        // Don't let labels blled out of the alotted area
        if (this.truncate || this.wrap) {
            element.attr({ "overflow": "hidden" });
        }
        // Add RTL?
        if (this.rtl) {
            element.attr({
                "direction": "rtl",
                "unicode-bidi": "bidi-override"
            });
        }
        return element;
    };
    /**
     * Updates cached bbox dimensions for each text line, just so we don't have to
     * measure the whole element all over again when we're done painting it.
     *
     * @ignore Exclude from docs
     * @param {IRectangle} lineBBox Line's BBox
     */
    Text.prototype.updateBBox = function (lineBBox) {
        if (this._bbox.width < lineBBox.width) {
            this._bbox.width = lineBBox.width;
        }
        this._bbox.height += lineBBox.height;
    };
    /**
     * Resets cached BBox.
     *
     * @ignore Exclude from docs
     */
    Text.prototype.resetBBox = function () {
        this._bbox = { x: 0, y: 0, width: 0, height: 0 };
    };
    /**
     * Creates and returns an HTML line element (`<div>`).
     *
     * @ignore Exclude from docs
     * @param  {string}       text  Text to add
     * @return {HTMLElement}        `<div>` element reference
     */
    Text.prototype.getHTMLLineElement = function (text) {
        // Create the <div> element
        var div = document.createElement("div");
        div.innerHTML = text;
        // Set text alignement
        switch (this.textAlign) {
            case "middle":
                div.style.textAlign = "center";
                break;
            case "end":
                div.style.textAlign = "right";
                break;
        }
        // Disable or enable wrapping
        if (this.wrap) {
            div.style.wordWrap = "break-word";
        }
        else {
            div.style.whiteSpace = "nowrap";
        }
        // Don't let labels blled out of the alotted area
        if (this.truncate) {
            div.style.overflow = "hidden";
        }
        // Set RTL-related styles
        if (this.rtl) {
            div.style.direction = "rtl";
            div.style.unicodeBidi = "bidi-override";
        }
        return div;
    };
    /**
     * Applies specific styles to text to make it not selectable, unless it is
     * explicitly set as `selectable`.
     *
     * @ignore Exclude from docs
     * @todo Set styles via AMElement
     */
    Text.prototype.setStyles = function () {
        var group = this.element;
        if (!this.selectable || this.draggable || this.resizable || this.swipeable) {
            group.addStyle({
                "webkitUserSelect": "none",
                "msUserSelect": "none",
                "pointerEvents": "none"
            });
        }
        else if (this.selectable) {
            group.removeStyle("webkitUserSelect");
            group.removeStyle("msUserSelect");
            group.removeStyle("pointerEvents");
        }
    };
    Object.defineProperty(Text.prototype, "text", {
        /**
         * Returns current SVG text.
         *
         * @return {string} SVG text
         */
        get: function () {
            return this.getPropertyValue("text");
        },
        /**
         * Sets SVG text.
         *
         * Please note that setting `html` will override this setting if browser
         * supports `foreignObject` in SGV, such as most modern browsers excluding
         * IEs.
         *
         * @param {string} value SVG Text
         */
        set: function (value) {
            //this.setPropertyValue("html", undefined);
            this.setPropertyValue("text", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "wrap", {
        /**
         * Returns current auto-wrap setting.
         *
         * @return {boolean} Auto-wrap enabled or not
         */
        get: function () {
            return this.getPropertyValue("wrap");
        },
        /**
         * Enables or disables autowrapping of text.
         *
         * @param {boolean} value Auto-wrapping enabled
         */
        set: function (value) {
            this.resetBBox();
            this.setPropertyValue("wrap", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "truncate", {
        /**
         * Returns current truncation setting.
         *
         * @return {boolean} Truncate text?
         */
        get: function () {
            return this.getPropertyValue("truncate");
        },
        /**
         * Indicates if text lines need to be truncated if they do not fit, using
         * configurable `ellipsis` string.
         *
         * `truncate` overrides `wrap` if both are set to `true`.
         *
         * NOTE: For HTML text, this setting **won't** trigger a parser and actual
         * line truncation with ellipsis. It will just hide everything that goes
         * outside the label.
         *
         * @param {boolean}  value  trincate text?
         */
        set: function (value) {
            this.resetBBox();
            this.setPropertyValue("truncate", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "ellipsis", {
        /**
         * Returns current ellipsis setting.
         *
         * @return {string} Ellipsis string
         */
        get: function () {
            return this.getPropertyValue("ellipsis");
        },
        /**
         * Sets ellipsis character to use if `truncate` is enabled.
         *
         * @param {string} value Ellipsis string
         * @default "..."
         */
        set: function (value) {
            this.setPropertyValue("ellipsis", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "selectable", {
        /**
         * Returns current setting for selectable text.
         *
         * @return {boolean} Text selectable?
         */
        get: function () {
            return this.getPropertyValue("selectable");
        },
        /**
         * Forces the text to be selectable. This setting will be ignored if the
         * object has some kind of interaction attached to it, such as it is
         * `draggable`, `swipeable`, `resizable`.
         *
         * @param {boolean}  value  Text selectable?
         * @default false
         */
        set: function (value) {
            this.setPropertyValue("selectable", value, true);
            this.setStyles();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "textAlign", {
        /**
         * Returns current horizontal text alignement.
         *
         * @return {TextAlign} Alignement
         */
        get: function () {
            return this.getPropertyValue("textAlign");
        },
        /**
         * Sets text alignement.
         *
         * Available choices:
         * * "start"
         * * "middle"
         * * "end"
         *
         * @param {TextAlign} value Alignement
         */
        set: function (value) {
            this.setPropertyValue("textAlign", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "textValign", {
        /**
         * Returns vertical text alignement.
         *
         * @ignore Exclude from docs (not used)
         * @return {TextValign} Alignement
         * @deprecated
         */
        get: function () {
            return this.getPropertyValue("textValign");
        },
        /**
         * Sets vertical text alignement.
         *
         * @ignore Exclude from docs (not used)
         * @param {TextValign} value Alignement
         * @deprecated
         */
        set: function (value) {
            this.setPropertyValue("textValign", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "fontSize", {
        /**
         * Returns current font size for text element.
         *
         * @return {any} Font size
         */
        get: function () {
            return this.getPropertyValue("fontSize");
        },
        /**
         * Sets font size to be used for the text. The size can either be numeric, in
         * pxels, or other measurements.
         *
         * Parts of the text may override this setting using in-line formatting.
         *
         * @param {any} value Font size value
         */
        set: function (value) {
            this.setPropertyValue("fontSize", value, true);
            this.setSVGAttribute({ "font-size": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "fontWeigth", {
        /**
         * Returns currently set font weight.
         *
         * @return {FontWeight} Font weight
         */
        get: function () {
            return this.getPropertyValue("fontWeigth");
        },
        /**
         * Sets font weight to use for text.
         *
         * Parts of the text may override this setting using in-line formatting.
         *
         * @param {FontWeight} value Font weight
         */
        set: function (value) {
            this.setPropertyValue("fontWeigth", value);
            this.setSVGAttribute({ "font-weight": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "textDecoration", {
        /**
         * Returns current text decoration setting.
         *
         * @return {TextDecoration} Decoration
         */
        get: function () {
            return this.getPropertyValue("textDecoration");
        },
        /**
         * Sets a text decoration to use for text.
         *
         * Parts of the text may override this setting using in-line formatting.
         *
         * @param {TextDecoration} value Decoration
         */
        set: function (value) {
            this.setPropertyValue("textDecoration", value);
            this.setSVGAttribute({ "text-decoration": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "html", {
        /**
         * Returns current HTML content of the label.
         *
         * @return {string} HTML content
         */
        get: function () {
            return this.getPropertyValue("html");
        },
        /**
         * Sets raw HTML to be used as text.
         *
         * NOTE: HTML text is subject to browser support. It relies on browsers
         * supporting SVG `foreignObject` nodes. Some browsers (read IEs) do not
         * support it. On those browsers, the text will fall back to basic SVG text,
         * striping out all HTML markup and styling that goes with it.
         *
         * For more information about `foreignObject` and its browser compatibility
         * refer to [this page](https://developer.mozilla.org/en/docs/Web/SVG/Element/foreignObject#Browser_compatibility).
         *
         * @param {string} value HTML text
         */
        set: function (value) {
            this.setPropertyValue("html", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "hideOversized", {
        /**
         * Returns current setting for hiding oversized text.
         *
         * @return {boolean} Hide if text does not fit?
         */
        get: function () {
            return this.getPropertyValue("hideOversized");
        },
        /**
         * Sets whether the whole text should be hidden if it does not fit into its
         * allotted space.
         *
         * @param {boolean} value Hide if text does not fit?
         */
        set: function (value) {
            this.setPropertyValue("hideOversized", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Override `mesaureElement` so it does not get measure again, because
     * internal `_bbox` is being updated by measuring routines in Text itself.
     */
    Text.prototype.measureElement = function () { };
    /**
     * Returns information about a line element.
     *
     * @ignore Exclude from docs
     * @param  {number}         index  Line index
     * @return {ITextLineInfo}         Line info object
     */
    Text.prototype.getLineInfo = function (index) {
        this.initLineCache();
        var lines = this.getCache("lineInfo");
        return lines.length > index ? lines[index] : undefined;
    };
    /**
     * Adds a line to line info cache.
     *
     * @ignore Exclude from docs
     * @param {ITextLineInfo}  line     Line info object
     * @param {boolean}        replace  Replace existing item
     * @param {number}         index    Insert at specified index
     */
    Text.prototype.addLineInfo = function (line, replace, index) {
        this.initLineCache();
        this.getCache("lineInfo").push(line);
    };
    /**
     * Checks if line cache is initialized and initializes it.
     */
    Text.prototype.initLineCache = function () {
        if (!this.getCache("lineInfo")) {
            this.setCache("lineInfo", []);
        }
    };
    /**
     * Sets a [[DataItem]] to use for populating dynamic sections of the text.
     *
     * Check the description for [[Text]] class, for data binding.
     *
     * @param {DataItem} dataItem Data item
     */
    Text.prototype.setDataItem = function (dataItem) {
        if (this._sourceDataItemEvents) {
            this._sourceDataItemEvents.dispose();
        }
        if (dataItem) {
            this._sourceDataItemEvents = new MultiDisposer([
                dataItem.events.on("valuechanged", this.invalidate, this),
                dataItem.events.on("workingvaluechanged", this.invalidate, this),
                dataItem.events.on("propertychanged", this.invalidate, this)
            ]);
        }
        _super.prototype.setDataItem.call(this, dataItem);
    };
    Object.defineProperty(Text.prototype, "availableWidth", {
        /**
         * Returns available horizontal space.
         *
         * @ignore Exclude from docs
         * @return {number} Available width (px)
         */
        get: function () {
            return $type.hasValue(this.maxWidth) ? this.maxWidth : this.pixelWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "availableHeight", {
        /**
         * Returns available vertical space.
         *
         * @return {number} Available height (px)
         */
        get: function () {
            return $type.hasValue(this.maxHeight) ? this.maxHeight : this.pixelHeight;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Invalidates the whole element, causing its redraw.
     *
     * Appending `<defs>` section might influence appearance and thus its
     * dimensions.
     *
     * @ignore Exclude from docs
     */
    Text.prototype.appendDefs = function () {
        _super.prototype.appendDefs.call(this);
        this.invalidate(); // otherwise getBBOx of text element returns 0 simetimes
    };
    return Text;
}(Sprite));
export { Text };
//# sourceMappingURL=Text.js.map