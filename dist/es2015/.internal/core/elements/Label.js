/**
 * Text class deals with all text placed on chart.
 */
import * as tslib_1 from "tslib";
import { Container } from "../Container";
import { registry } from "../Registry";
import { getTextFormatter } from "../formatters/TextFormatter";
import { MultiDisposer } from "../utils/Disposer";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $math from "../utils/Math";
import * as $utils from "../utils/Utils";
import * as $iter from "../utils/Iterator";
import * as $type from "../utils/Type";
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
 * label.text = "The title is: {title}";
 * ```
 * ```JavaScript
 * label.dataItem = myDataItem;
 * label.text = "The title is: {title}";
 * ```
 *
 * The above will automatically replace "{title}" in the string with the
 * actual data value from `myDataItem`.
 *
 * Note, that most often dataItem is set by the Component.
 *
 *
 * @see {@link ILabelEvents} for a list of available events
 * @see {@link ILabelAdapters} for a list of available Adapters
 * @todo Vertical align
 * @todo Linkage to relative documentation (formatters, data binding)
 * @important
 */
var Label = /** @class */ (function (_super) {
    tslib_1.__extends(Label, _super);
    /**
     * Constructor
     */
    function Label() {
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
        _this.className = "Label";
        _this.fill = new InterfaceColorSet().getFor("text");
        // not good to set this, as then these will appear on each label and values set on container won't be applied.
        //this.textDecoration = "none";
        //this.fontWeight = "normal";
        // Set defaults
        _this.wrap = false;
        _this.truncate = false;
        _this.fullWords = true;
        _this.ellipsis = "...";
        _this.textAlign = "start";
        _this.textValign = "top";
        _this.layout = "absolute";
        _this.renderingFrequency = 1;
        // Set up adapters for manipulating accessibility
        _this.adapter.add("readerTitle", function (arg) {
            if (!arg) {
                arg = _this.populateString($utils.plainText($utils.isNotEmpty(_this.html)
                    ? _this.html
                    : _this.text));
            }
            return arg;
        });
        // Add events to watch for maxWidth/maxHeight changes so that we can
        // invalidate this
        _this.events.on("maxsizechanged", function (ev) {
            if ((_this.bbox.width > _this.availableWidth)
                || ((_this.bbox.width < _this.availableWidth) && _this.isOversized)
                || (_this.bbox.height > _this.availableHeight)
                || ((_this.bbox.height < _this.availableHeight) && _this.isOversized)) {
                _this.invalidate();
            }
            else {
                _this.alignSVGText();
            }
        });
        // Aply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * [arrange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Label.prototype.arrange = function () {
    };
    /**
     * Updates current text according to data item and supported features.
     * Returns `true` if current text has changed.
     *
     * @return {boolean} Text changed?
     */
    Label.prototype.updateCurrentText = function () {
        // Determine output format
        var output, text;
        if ($utils.isNotEmpty(this.html) && this.paper.supportsForeignObject()) {
            // We favor HTML text if it's set and browser supports `foreignObject`
            output = "html";
            text = this.html;
        }
        else {
            output = "svg";
            text = this.text;
        }
        // Need to format text all the time
        if ($type.hasValue(text) && text !== "") {
            text = this.populateString(text, this.dataItem);
        }
        if (output == "html") {
            text = this.adapter.apply("htmlOutput", text);
        }
        else {
            text = this.adapter.apply("textOutput", text);
        }
        // Update the text
        var changed = text != this.currentText || output != this._currentFormat;
        this.currentText = text;
        this._currentFormat = output;
        return changed;
    };
    /**
     * Draws the textual label.
     *
     * @ignore Exclude from docs
     */
    Label.prototype.draw = function () {
        var _this = this;
        // Draw super
        _super.prototype.draw.call(this);
        var topParent = this.topParent;
        if (topParent) {
            if (!topParent.maxWidth || !topParent.maxHeight) {
                topParent.events.once("maxsizechanged", function () {
                    _this._prevStatus = "";
                    _this.invalidate();
                });
                return;
            }
        }
        // Calculate max width and height
        var maxWidth = $math.max(this.availableWidth - this.pixelPaddingLeft - this.pixelPaddingRight, 0);
        var maxHeight = $math.max(this.availableHeight - this.pixelPaddingTop - this.pixelPaddingBottom, 0);
        // save
        var status = maxHeight + "," + maxWidth + this.wrap + this.truncate + this.fullWords + this.rtl + this.ellipsis;
        // Update text
        if (!this.updateCurrentText() && this.inited && this._prevStatus == status) {
            return;
        }
        this._measuredWidth = 0;
        this._measuredHeight = 0;
        // Reset
        this.isOversized = false;
        // Determine output format
        var output = this._currentFormat;
        var text = this.currentText;
        // Empty string
        if (!$type.hasValue(text) || text == "") {
            this.element.attr({ display: "none" });
            return;
        }
        // Chop up text into lines
        // We're still processing SVG and HTML in the same way for now
        var lines = text.split("\n");
        // Do we need to go through the trouble of measuring lines
        //let measure: boolean = true;// (lines.length > 1) || this.wrap;
        this._prevStatus = status;
        this.textAlign = this.textAlign;
        // need this to measure
        var display = this.group.getAttr("display");
        if (display == "none") {
            this.group.removeAttr("display");
        }
        // SVG or HTML?
        if (output === "svg") {
            /**
             * SVG
             */
            this.element.removeAttr("display");
            // Clear the element
            var group = this.element;
            this.resetBBox();
            // Init state variables
            var currentHeight = 0;
            var currentFormat = "";
            // Process each line
            for (var i = 0; i < lines.length; i++) {
                // Get line
                var line = lines[i];
                // Check if line is empty
                if (line == "") {
                    // It is, let's just update currentHeight and go to the next one
                    // If it's the first line, we'll have to use arbirary line height,
                    // since there's nothing to measure. For subsequent lines we can take
                    // previous line's height
                    var tempElement = this.getSVGLineElement("", 0);
                    tempElement.add(this.getSvgElement(".", getTextFormatter().translateStyleShortcuts(currentFormat)));
                    group.add(tempElement);
                    var offset = Math.ceil(tempElement.getBBox().height);
                    if (offset > 0) {
                        currentHeight += offset;
                    }
                    group.removeElement(tempElement);
                    continue;
                }
                // Chunk up the line and process each chunk
                var chunks = getTextFormatter().chunk(line);
                var currentLineHeight = 0;
                var firstChunk = true;
                var skipTextChunks = false;
                // Create line element or grab it from cache
                var lineInfo = void 0;
                if (lineInfo = this.getLineInfo(i)) {
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
                lineInfo.element.removeAttr("display");
                lineInfo.element.removeChildren(); // memory leak without this
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
                        // Add chunk to the current element
                        //lineInfo.element.content += $utils.trim(getTextFormatter().format(currentFormat + chunk.text, output));
                        lineInfo.element.add(this.getSvgElement(chunk.text, getTextFormatter().translateStyleShortcuts(currentFormat)));
                        lineInfo.bbox = lineInfo.element.getBBox();
                        lineInfo.bbox.width = Math.ceil(lineInfo.bbox.width);
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
                                        // If we're on first chunk of text, or we explicitly
                                        // enabled word-breaking, we can break mid-word.
                                        // Otherwise we break by words.
                                        if (e === 0 || !this.fullWords) {
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
                                        lastElement_1.textContent = getTextFormatter().cleanUp($utils.trim(splitLines.shift()));
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
                        if (this.bbox.width < lineInfo.bbox.width) {
                            this.bbox.width = lineInfo.bbox.width;
                        }
                        // commented to avoid bug (seen on sankey link) where text is incorrectly aligned
                        //if (this.bbox.x > lineInfo.bbox.x) {
                        //this.bbox.x = lineInfo.bbox.x; 
                        //}
                        this.bbox.height = currentHeight + currentLineHeight;
                        // Position current line
                        lineInfo.element.attr({
                            "x": "0",
                            "y": currentHeight + currentLineHeight,
                            "dy": $math.round((-0.2 * currentLineHeight), 3).toString()
                        });
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
                // Save line cache
                this.addLineInfo(lineInfo, i);
            }
            // Check if maybe we need to hide the whole label if it doesn't fit
            if (this.hideOversized && ((this.availableWidth < this.bbox.width) || (this.availableHeight < this.bbox.height))) {
                this.element.attr({ display: "none" });
                this.isOversized = true;
            }
            this._measuredWidth = $math.max(this.bbox.width, this.pixelWidth - this.pixelPaddingLeft - this.pixelPaddingRight);
            this._measuredHeight = $math.max(this.bbox.height, this.pixelHeight - this.pixelPaddingTop - this.pixelPaddingBottom);
            // Align the lines
            this.alignSVGText();
            this.bbox.width = this._measuredWidth;
            this.bbox.height = this._measuredHeight;
            this.hideUnused(lines.length);
        }
        else {
            /**
             * HTML
             */
            this.element.removeAttr("display");
            this.resetBBox();
            // Clear the element
            var group = this.element;
            group.disposeChildren();
            // Create a ForeignObject to use as HTML container
            var fo = this.paper.foreignObject();
            group.add(fo);
            // Set group and foreignObject dimensions
            var width = maxWidth > 0 ? (maxWidth).toString() + "px" : "100%";
            var height = maxHeight > 0 ? (maxHeight).toString() + "px" : "100%";
            /*			fo.attr({
                            width: width,
                            height: height
                        });*/
            // Create line element
            //let lineElement: HTMLElement = this.getHTMLLineElement(getTextFormatter().format(this.html, output));
            var lineElement = this.getHTMLLineElement(text);
            fo.node.appendChild(lineElement);
            // Temporarily set to inline-block so we can measure real width and height
            lineElement.style.display = "inline-block";
            var tmpBBox = lineElement.getBoundingClientRect();
            lineElement.style.display = "block";
            this.bbox = {
                x: 0,
                y: 0,
                width: tmpBBox.width,
                height: tmpBBox.height
            };
            // Set exact dimensions of foreignObject so it is sized exactly as
            // the content within
            fo.attr({
                width: tmpBBox.width,
                height: tmpBBox.height
            });
            // Set measurements and update bbox
            this._measuredWidth = $math.max(this.bbox.width, this.pixelWidth - this.pixelPaddingLeft - this.pixelPaddingRight);
            this._measuredHeight = $math.max(this.bbox.height, this.pixelHeight - this.pixelPaddingTop - this.pixelPaddingBottom);
            this.bbox.width = this._measuredWidth;
            this.bbox.height = this._measuredHeight;
            // Don't let labels bleed out of the alotted area
            if (this.truncate) {
                lineElement.style.overflow = "hidden";
            }
            if ((tmpBBox.width > maxWidth) || (tmpBBox.height > maxHeight)) {
                this.isOversized = true;
            }
        }
        // Set applicable styles
        this.setStyles();
        this.updateCenter();
        this.updateBackground();
        if (display == "none") {
            this.group.attr({ display: "none" });
        }
    };
    /**
     * Aligns the lines horizontally ant vertically, based on properties.
     *
     * @ignore Exclude from docs
     */
    Label.prototype.alignSVGText = function () {
        var _this = this;
        // Get Group
        var group = this.element;
        // Is there anything to align?
        if (!group.children) {
            return;
        }
        var width = this._measuredWidth;
        var height = this._measuredHeight;
        var paddingLeft = this.pixelPaddingLeft;
        var paddingRight = this.pixelPaddingRight;
        var paddingTop = this.pixelPaddingTop;
        var paddingBottom = this.pixelPaddingBottom;
        // Process each line
        $iter.each(group.children.backwards().iterator(), function (element) {
            // Align horizontally
            // Since we are using `text-anchor` for horizontal alignment, all we need
            // to do here is move the `x` position
            element.attr({ "text-anchor": _this.textAlign });
            switch (_this.textAlign) {
                case "middle":
                    element.attr({ "x": (width / 2).toString() });
                    break;
                case "end":
                    if (_this.rtl) {
                    }
                    else {
                        element.attr({ "x": width.toString() });
                    }
                    break;
                default:
                    if (_this.rtl) {
                        element.attr({ "x": width.toString() });
                    }
                    else {
                        element.removeAttr("text-anchor");
                    }
                    break;
            }
            var y = $type.toNumber(element.getAttr("y"));
            switch (_this.textValign) {
                case "middle":
                    element.attr({ "y": (y + (height - _this.bbox.height) / 2).toString() });
                    break;
                case "bottom":
                    element.attr({ "y": (y + height - _this.bbox.height).toString() });
                    break;
                default:
                    element.attr({ "y": y.toString() });
                    break;
            }
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
    Label.prototype.getSVGLineElement = function (text, y) {
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
     * Resets cached BBox.
     *
     * @ignore Exclude from docs
     */
    Label.prototype.resetBBox = function () {
        this.bbox = { x: 0, y: 0, width: 0, height: 0 };
    };
    /**
     * Creates and returns an HTML line element (`<div>`).
     *
     * @ignore Exclude from docs
     * @param  {string}       text  Text to add
     * @return {HTMLElement}        `<div>` element reference
     */
    Label.prototype.getHTMLLineElement = function (text) {
        // Create the <div> element
        var div = document.createElement("div");
        div.innerHTML = text;
        // Set text alignment
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
        // Don't let labels bleed out of the alotted area
        // Moved to `draw()` because setting "hidden" kills all measuring
        /*if (this.truncate) {
            div.style.overflow = "hidden";
        }*/
        // Set RTL-related styles
        if (this.rtl) {
            div.style.direction = "rtl";
            div.style.unicodeBidi = "bidi-override";
        }
        // Translate some of the SVG styles into CSS
        if ($type.hasValue(this.fill)) {
            div.style.color = this.fill.toString();
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
    Label.prototype.setStyles = function () {
        var group = this.element;
        if (!this.selectable || this.draggable || this.resizable || this.swipeable) {
            group.addStyle({
                "webkitUserSelect": "none",
                "msUserSelect": "none"
            });
        }
        else if (this.selectable) {
            group.removeStyle("webkitUserSelect");
            group.removeStyle("msUserSelect");
        }
    };
    /**
     * Hides unused lines
     */
    Label.prototype.hideUnused = function (index) {
        this.initLineCache();
        var lines = this.getCache("lineInfo");
        if (lines.length >= index) {
            for (var i = index; i < lines.length; i++) {
                var line = lines[i];
                if (line && line.element) {
                    line.element.attr({ "display": "none" });
                }
            }
        }
    };
    Object.defineProperty(Label.prototype, "text", {
        /**
         * @return {string} SVG text
         */
        get: function () {
            return this.getPropertyValue("text");
        },
        /**
         * An SVG text.
         *
         * Please note that setting `html` will override this setting if browser
         * supports `foreignObject` in SGV, such as most modern browsers excluding
         * IEs.
         *
         * @param {string}  value  SVG Text
         */
        set: function (value) {
            //this.setPropertyValue("html", undefined);
            this.setPropertyValue("text", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "wrap", {
        /**
         * @return {boolean} Auto-wrap enabled or not
         */
        get: function () {
            return this.getPropertyValue("wrap");
        },
        /**
         * Enables or disables autowrapping of text.
         *
         * @param {boolean}  value  Auto-wrapping enabled
         */
        set: function (value) {
            this.resetBBox();
            this.setPropertyValue("wrap", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "truncate", {
        /**
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
    Object.defineProperty(Label.prototype, "fullWords", {
        /**
         * @return {boolean} Truncate on full words?
         */
        get: function () {
            return this.getPropertyValue("fullWords");
        },
        /**
         * If `truncate` is enabled, should Label try to break only on full words
         * (`true`), or whenever needed, including middle of the word. (`false`)
         *
         * @default true
         * @param {boolean}  value  Truncate on full words?
         */
        set: function (value) {
            this.setPropertyValue("fullWords", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "ellipsis", {
        /**
         * @return {string} Ellipsis string
         */
        get: function () {
            return this.getPropertyValue("ellipsis");
        },
        /**
         * Ellipsis character to use if `truncate` is enabled.
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
    Object.defineProperty(Label.prototype, "selectable", {
        /**
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
    Object.defineProperty(Label.prototype, "textAlign", {
        /**
         * @return {TextAlign} Alignment
         */
        get: function () {
            return this.getPropertyValue("textAlign");
        },
        /**
         * Horizontal text alignment.
         *
         * Available choices:
         * * "start"
         * * "middle"
         * * "end"
         *
         * @param {TextAlign}  value  Alignment
         */
        set: function (value) {
            this.setPropertyValue("textAlign", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "textValign", {
        /**
         * @ignore Exclude from docs (not used)
         * @return {TextValign} Alignment
         * @deprecated
         */
        get: function () {
            return this.getPropertyValue("textValign");
        },
        /**
         * Vertical text alignment.
         *
         * @ignore Exclude from docs (not used)
         * @param {TextValign}  value  Alignment
         * @deprecated
         */
        set: function (value) {
            this.setPropertyValue("textValign", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "html", {
        /**
         * @return {string} HTML content
         */
        get: function () {
            return this.getPropertyValue("html");
        },
        /**
         * Raw HTML to be used as text.
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
    Object.defineProperty(Label.prototype, "hideOversized", {
        /**
         * @return {boolean} Hide if text does not fit?
         */
        get: function () {
            return this.getPropertyValue("hideOversized");
        },
        /**
         * Indicates whether the whole text should be hidden if it does not fit into
         * its allotted space.
         *
         * @param {boolean}  value  Hide if text does not fit?
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
    Label.prototype.measureElement = function () { };
    /**
     * Returns information about a line element.
     *
     * @ignore Exclude from docs
     * @param  {number}         index  Line index
     * @return {ITextLineInfo}         Line info object
     */
    Label.prototype.getLineInfo = function (index) {
        this.initLineCache();
        var lines = this.getCache("lineInfo");
        return lines.length > index ? lines[index] : undefined;
    };
    /**
     * Adds a line to line info cache.
     *
     * @ignore Exclude from docs
     * @param {ITextLineInfo}  line     Line info object
     * @param {number}         index    Insert at specified index
     */
    Label.prototype.addLineInfo = function (line, index) {
        this.initLineCache();
        this.getCache("lineInfo")[index] = line;
    };
    /**
     * Checks if line cache is initialized and initializes it.
     */
    Label.prototype.initLineCache = function () {
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
    Label.prototype.setDataItem = function (dataItem) {
        if (this._sourceDataItemEvents) {
            this._sourceDataItemEvents.dispose();
        }
        if (dataItem) {
            this._sourceDataItemEvents = new MultiDisposer([
                dataItem.events.on("valuechanged", this.invalidate, this),
                dataItem.events.on("workingvaluechanged", this.invalidate, this),
                dataItem.events.on("calculatedvaluechanged", this.invalidate, this),
                dataItem.events.on("propertychanged", this.invalidate, this)
            ]);
        }
        _super.prototype.setDataItem.call(this, dataItem);
    };
    Object.defineProperty(Label.prototype, "availableWidth", {
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
    Object.defineProperty(Label.prototype, "availableHeight", {
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
    Label.prototype.appendDefs = function () {
        _super.prototype.appendDefs.call(this);
        this.invalidate(); // otherwise getBBOx of text element returns 0 simetimes
    };
    // temp, replacing textFormatter method
    Label.prototype.getSvgElement = function (text, style) {
        var element = this.paper.add("tspan");
        element.textContent = text;
        if (style) {
            element.node.setAttribute("style", style);
        }
        return element;
    };
    return Label;
}(Container));
export { Label };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Label"] = Label;
//# sourceMappingURL=Label.js.map