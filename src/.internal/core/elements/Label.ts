/**
 * Text class deals with all text placed on chart.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../Container";
import { DataItem } from "../DataItem";
import { TextValign } from "../defs/TextValign";
import { TextAlign } from "../defs/TextAlign";
import { IRectangle } from "../defs/IRectangle";
import { AMElement } from "../rendering/AMElement";
import { Group } from "../rendering/Group";
import { registry } from "../Registry";
import { ITextChunk, getTextFormatter } from "../formatters/TextFormatter";
import { MultiDisposer } from "../utils/Disposer";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $math from "../utils/Math";
import * as $utils from "../utils/Utils";
import * as $type from "../utils/Type";
import { Paper } from "../rendering/Paper";
import * as $dom from "../utils/DOM";
import { defaultRules, ResponsiveBreakpoints } from "../utils/Responsive";


/**
 * Defines properties for [[Text]].
 */
export interface ILabelProperties extends IContainerProperties {

	/**
	 * Horizontal align of the text.
	 *
	 * @default "start"
	 */
	textAlign?: TextAlign;

	/**
	 * Vertical align of the text.
	 *
	 * @default "top"
	 */
	textValign?: TextValign;

	/**
	 * A plain text content.
	 */
	text?: string;

	/**
	 * Should the lines wrap if they do not fit into max width?
	 *
	 * @default false
	 */
	wrap?: boolean;

	/**
	 * Should the text be selectable>
	 *
	 * @default false
	 */
	selectable?: boolean;

	/**
	 * HTML content.
	 */
	html?: string;

	/**
	 * Should the lines be truncated (optionally with ellipsis) if they do not
	 * fit into max width?
	 *
	 * @default false
	 */
	truncate?: boolean;

	/**
	 * If `truncate` is enabled, should Label try to break only on full words
	 * (`true`), or whenever needed, including middle of the word. (`false`)
	 *
	 * @default true
	 */
	fullWords?: boolean;

	/**
	 * If lines are truncated, this ellipsis will be added at the end.
	 *
	 * @default "..."
	 */
	ellipsis?: string;

	/**
	 * Hide text of it does not fit into element's dimensions?
	 *
	 * @default false
	 */
	hideOversized?: boolean;

	/**
	 * If set to `true` square-bracket formatting blocks will be treated as
	 * regular text.
	 *
	 * @default false
	 */
	ignoreFormatting?: boolean;

	/**
	 * Path string along which text should be arranged
	 */
	path?: string

	/**
	 * Relative label location on path.
	 */
	locationOnPath?: number;

	/**
	 * A ratio to calculate text baseline. Ralative distance from the bottom of
	 * the label.
	 *
	 * @default -0.27
	 */
	baseLineRatio?: number;
}

/**
 * Text line information.
 *
 * Objects used to hold cached information about lines in a Text element.
 */
export interface ITextLineInfo {

	/**
	 * Measurements for the bounding box of the line.
	 */
	"bbox"?: IRectangle,

	/**
	 * A reference to an SVG `<g>` element that holds line elements.
	 */
	"element"?: Group,

	/**
	 * Indicates if line contains more than one element, e.g. has multiple
	 * formatted blocks.
	 */
	"complex"?: boolean,

	"text"?: string,

	"style"?: string
};

/**
 * Defines events for [[Text]].
 */
export interface ILabelEvents extends IContainerEvents { }

/**
 * Adapters for [[Text]].
 *
 * Includes both the [[Adapter]] definitions and properties.
 *
 * @see {@link Adapter}
 */
export interface ILabelAdapters extends IContainerAdapters, ILabelProperties {

	/**
	 * Applied to the final formatted label text.
	 */
	textOutput: string;

	/**
	 * Applied to the final formatted label HTML.
	 */
	htmlOutput: string;

}


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
 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-strings/} for info on string formatting and data binding
 * @todo Vertical align
 * @important
 */
export class Label extends Container {
	/**
	 * Defines available properties.
	 */
	public _properties!: ILabelProperties;

	/**
	 * Defines Adapter type.
	 */
	public _adapter!: ILabelAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ILabelEvents;

	/**
	 * Indicates if the whole text does not fit into max dimenstions set for it.
	 */
	public isOversized: boolean = false;

	/**
	 * Currently formatted text, read only.
	 */
	public currentText: string;

	/**
	 * Current format to be used for outputing text.
	 */
	protected _currentFormat: string;

	/**
	 * [_sourceDataItemEvents description]
	 *
	 * @todo Description
	 */
	protected _sourceDataItemEvents: MultiDisposer;


	protected _prevStatus: string;

	/**
	 * SVG path element.
	 *
	 * @ignore Exclude from docs
	 */
	public pathElement: $type.Optional<AMElement>;

	/**
	 * SVG textpath element.
	 *
	 * @ignore Exclude from docs
	 */
	public textPathElement: $type.Optional<Group>;

	/**
	 * Constructor
	 */
	constructor() {

		// Execute super's constructor
		super();

		// Set this class name
		this.className = "Label";

		this.fill = new InterfaceColorSet().getFor("text");

		// not good to set this, as then these will appear on each label and values set on container won't be applied.
		//this.textDecoration = "none";
		//this.fontWeight = "normal";


		// Set defaults
		this.wrap = false;
		this.truncate = false;
		this.fullWords = true;
		this.ellipsis = "...";
		this.textAlign = "start";
		this.textValign = "top";

		this.layout = "absolute";
		this.baseLineRatio = -0.27;
		//this.pixelPerfect = true;
		this._positionPrecision = 1;

		// Add events to watch for maxWidth/maxHeight changes so that we can
		// invalidate this
		this.events.on("maxsizechanged", () => {
			if (this.inited) {
				this.handleMaxSize()
			}
		}, this, false);

		// this solves strange bug when text just added to svg is 0x0
		this.events.once("validated", this.handleValidate, this, false);

		// Aply theme
		this.applyTheme();
	}


	/**
	 * A placeholder method that is called **after** element finishes drawing
	 * itself.
	 *
	 * @ignore Exclude from docs
	 */
	protected afterDraw(): void {
		// since we removed validatePosition from sprite, we still need it here to handle rotated text
		super.afterDraw();
		this.validatePosition();
	}


	/**
	 * Sets [[Paper]] instance to use to draw elements.
	 * @ignore
	 * @param paper Paper
	 * @return true if paper was changed, false, if it's the same
	 */
	public setPaper(paper: Paper): boolean {

		let changed = super.setPaper(paper);

		if (changed) {
			this.hardInvalidate();
		}
		return changed;
	}

	/**
	 * @ignore
	 */
	protected handleValidate() {
		if ((this.currentText || this.text) && (this.bbox.width == 0 || this.bbox.height == 0)) {
			registry.events.once("exitframe", this.hardInvalidate, this);
		}
	}

	/**
	 * @ignore
	 */
	protected handleMaxSize() {
		if (
			(this.bbox.width > this.availableWidth)
			|| ((this.bbox.width < this.availableWidth) && (this.isOversized || this.truncate))
			|| (this.bbox.height > this.availableHeight)
			|| ((this.bbox.height < this.availableHeight) && this.isOversized)
		) {
			this.invalidate();
		}
		else {
			this.alignSVGText();
		}
	}

	/**
	 * [arrange description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public arrange(): void {

	}

	/**
	 * Updates current text according to data item and supported features.
	 * Returns `true` if current text has changed.
	 *
	 * @return Text changed?
	 */
	protected updateCurrentText(): boolean {
		// Determine output format
		let output: string, text: string;

		if ($utils.isNotEmpty(this.html) && this.paper.supportsForeignObject()) {

			// We favor HTML text if it's set and browser supports `foreignObject`
			output = "html";
			text = this.html;
		}
		else {
			output = "svg";
			text = this.text;
		}

		// Need to toString source?
		if ($type.isObject(text)) {
			text = text.toString();
		}

		// Need to format text all the time
		if ($type.hasValue(text) && text !== "") {
			text = this.populateString(text, this.dataItem);
		}

		if (output == "html") {
			if (this._adapterO) {
				text = this._adapterO.apply("htmlOutput", text);
			}
		}
		else {
			if (this._adapterO) {
				text = this._adapterO.apply("textOutput", text);
			}
		}

		// Update the text
		let changed = text != this.currentText || output != this._currentFormat;
		this.currentText = text;
		this._currentFormat = output;

		return changed;
	}

	/**
	 * Hard invalidate means the text will be redrawn even if it hasn't changed.
	 * This is used when we change `fontSize`, `fontFamily`, or for some other
	 * reasons.
	 */
	public hardInvalidate() {
		this._prevStatus = "";
		this.invalidate();
	}

	/**
	 * Gets line bbox, uses caching to save cpu
	 * @ignore
	 */
	protected getLineBBox(lineInfo: ITextLineInfo) {
		//let cacheKey = lineInfo.text + lineInfo.style;

		//let lineBBox = this.getCache(cacheKey);
		//if (!lineBBox) {
		//lineBBox = lineInfo.element.getBBox();
		//if (lineBBox.width != 0 && lineBBox.height != 0) {
		//	this.setCache(cacheKey, lineBBox, 5000);
		//}
		//}

		let element = lineInfo && lineInfo.element;
		let node = element && element.node;

		// Check for the parent Node to avoid FF from throwing errors
		if (node && node.parentNode) {
			lineInfo.bbox = element.getBBox();
		}
	}

	/**
	 * Draws the textual label.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {

		// Draw super
		super.draw();

		let oldW = this.bbox.width;
		let oldH = this.bbox.height;

		let topParent = this.topParent;
		if (topParent) {
			if (!topParent.maxWidth || !topParent.maxHeight) {
				topParent.events.once("maxsizechanged", this.hardInvalidate, this, false);
				return;
			}
		}

		// Calculate max width and height
		let maxWidth: number = $math.max(this.availableWidth - this.pixelPaddingLeft - this.pixelPaddingRight, 0);
		let maxHeight: number = $math.max(this.availableHeight - this.pixelPaddingTop - this.pixelPaddingBottom, 0);

		// save
		let status = maxHeight + "," + maxWidth + this.wrap + this.truncate + this.fullWords + this.rtl + this.ellipsis;

		// Update text
		if (!this.updateCurrentText() && this.inited && this._prevStatus == status) {
			return;
		}

		this._measuredWidth = 0;
		this._measuredHeight = 0;

		// Reset
		this.isOversized = false;

		// Determine output format
		let output = this._currentFormat;
		let text = this.currentText;

		// Empty string
		if (!$type.hasValue(text) || text == "") {
			this.element.attr({ display: "none" });
			return;
		}

		// Chop up text into lines
		// We're still processing SVG and HTML in the same way for now
		let lines: string[] = text.split("\n");

		// Do we need to go through the trouble of measuring lines
		//let measure: boolean = true;// (lines.length > 1) || this.wrap;

		this._prevStatus = status;

		this.textAlign = this.textAlign;

		// need this to measure
		let display = this.group.getAttr("display");
		if (display == "none") {
			this.group.removeAttr("display");
		}		

		if (this.textPathElement) {
			this.textPathElement.removeChildren();
		}

		// SVG or HTML?
		if (output === "svg") {
			/**
			 * SVG
			 */

			this.element.removeAttr("display");

			// Clear the element
			let group: Group = <Group>this.element;

			this.resetBBox();

			// Init state variables
			let currentHeight: number = 0;
			let currentFormat: string = "";

			// Process each line
			for (let i = 0; i < lines.length; i++) {

				// Get line
				let line: string = lines[i];

				// Check if line is empty
				if (line == "") {
					// It is, let's just update currentHeight and go to the next one
					// If it's the first line, we'll have to use arbirary line height,
					// since there's nothing to measure. For subsequent lines we can take
					// previous line's height
					let tempElement = this.getSVGLineElement("", 0);
					tempElement.add(
						this.getSvgElement(
							".",
							getTextFormatter().translateStyleShortcuts(currentFormat)
						)
					);

					group.add(tempElement);
					let offset = Math.ceil(tempElement.getBBox().height);
					if (offset > 0) {
						currentHeight += offset;
					}
					group.removeElement(tempElement);
					continue;

				}

				// Chunk up the line and process each chunk
				let chunks: ITextChunk[] = getTextFormatter().chunk(line, null, this.ignoreFormatting);
				let currentLineHeight: number = 0;
				let firstChunk: boolean = true;
				let skipTextChunks: boolean = false;

				// Create line element or grab it from cache
				let lineInfo: ITextLineInfo = this.getLineInfo(i);

				if (lineInfo) {
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

				if (this.textPathElement) {
					lineInfo.element.add(this.textPathElement);
				}

				/*// @todo not needed anymore
				if (this.rtl) {
					chunks.reverse();
				}*/

				// Process each chunk
				for (let x: number = 0; x < chunks.length; x++) {

					// If there's more than one chunk, means the line is "complex"
					if (x) {
						lineInfo.complex = true;
					}

					// Get chunk
					let chunk = chunks[x];

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

						lineInfo.text = chunk.text;
						lineInfo.style = getTextFormatter().translateStyleShortcuts(currentFormat);

						let tspan = this.getSvgElement(lineInfo.text, lineInfo.style);

						if (this.textPathElement) {
							this.textPathElement.add(tspan);
						}
						else {
							lineInfo.element.add(tspan);
						}

						this.getLineBBox(lineInfo);
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
							let lineText: string = lineInfo.element.textContent;
							let avgCharWidth: number = (lineInfo.bbox.width / lineText.length); // * .9;

							// Calculate average number of symbols / width
							let excessChars: number = $math.min(Math.ceil((lineInfo.bbox.width - maxWidth) / avgCharWidth), lineText.length);

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
								let addEllipsis: boolean = false;

								// Process each child in the temporary line, until the whole
								// line fits, preferably with an ellipsis
								// TODO use iterator instead
								let node = lineInfo.element.node;
								if (node && node.childNodes) {
									for (let e = lineInfo.element.node.childNodes.length - 1; e >= 0; e--) {

										// Get current element
										let node = lineInfo.element.node.childNodes[e];


										// Add ellipsis only if previous chunk was removed in full
										// and this chunk already fits
										//if (addEllipsis && (bbox.width <= maxWidth)) {
										if (addEllipsis && (lineInfo.bbox.width <= maxWidth)) {

											// Add ellipsis
											node.textContent += " " + this.ellipsis;

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
										let elementText = node.textContent;

										// Calculate average number of symbols / width
										lineText = lineInfo.element.textContent;
										excessChars = $math.min(Math.ceil((lineInfo.bbox.width - maxWidth) / avgCharWidth), lineText.length);

										// Do this until we fit
										while ((lineInfo.bbox.width > maxWidth) && (excessChars <= lineText.length) && (excessChars > 0)) {

											// Calculate max available chars
											let maxChars: number = $math.max(elementText.length - excessChars - this.ellipsis.length, 1);

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
													lineInfo.element.node.removeChild(node);
												}

											}

											// Truncate the text
											elementText = $utils.truncateWithEllipsis(elementText, maxChars, this.ellipsis, this.fullWords, this.rtl);

											if ((elementText.length > maxChars) && this.fullWords) {
												// Still too long?
												// Let's try truncating breaking words anyway
												elementText = $utils.truncateWithEllipsis(elementText, maxChars, this.ellipsis, false, this.rtl);
											}

											// Set truncated text
											node.textContent = elementText;

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

							}
							else {

								/**
								 * Processign auto-wrap
								 * In this case we're going to be adding text chunks until
								 * they don't fit into current line. Once that happens we will
								 * inject the rest of the chunks to the next line
								 */
								// Get last node added and measure it
								let node = lineInfo.element.node;
								if (node) {
									let lastNode = lineInfo.element.node.lastChild;

									// Init split lines
									let splitLines: string[];
									while ((lineInfo.bbox.width > maxWidth) && (excessChars <= lineText.length) && (excessChars > 0)) {

										// Calculate max available chars
										let maxChars: number = $math.max(chunk.text.length - excessChars, 1);

										// Don't split the words mid-word if it's not the first chunk
										// in the line
										if (firstChunk) {

											// Split mid-word if necessary
											splitLines = $utils.splitTextByCharCount(chunk.text, maxChars, true, this.rtl);

										}
										else {

											// Don't split mid-word
											splitLines = $utils.splitTextByCharCount(chunk.text, maxChars, true, this.rtl);

											// Check if the first word is too long
											if ((splitLines[0].length > maxChars) || maxChars === 1) {

												// Yes - move the whole chunk to the next line
												// Remove the element we just added
												lineInfo.element.node.removeChild(lastNode)

												// Break out of the while on next cycle
												excessChars = 0;
											}

										}

										// Use the first line to update last item
										if (excessChars > 0) {
											lastNode.textContent = getTextFormatter().cleanUp($utils.trim(splitLines.shift()));
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

										let restOfLine: string = "";

										// Add leftovers from splitting the current chunk
										if ($type.hasValue(splitLines)) {
											if (this.rtl) {
												restOfLine += splitLines.join("") + currentFormat;
											}
											else {
												restOfLine += currentFormat + splitLines.join("").replace(/([\[\]]{1})/g, "$1$1");
											}
										}

										// Add the rest of the chunks
										for (let c: number = x + 1; c < chunks.length; c++) {
											if (chunks[c].type == "value") {
												// We're escaping single square brackets that were
												// cleaned up by chunk() back to double square brackets
												// so that they are not being treated as format on
												// next pass.
												restOfLine += chunks[c].text.replace(/([\[\]]{1})/g, "$1$1");
											}
											else {
												restOfLine += chunks[c].text;
											}
										}

										// Inject the rest of the lines as chunks for subsequent

										lines.splice(i + 1, 0, restOfLine);
									}
									// Skip processing the rest of the chunks
									skipTextChunks = true;
								}
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
						if (!this.textPathElement) {
							lineInfo.element.attr({
								"x": "0",
								"y": currentHeight + currentLineHeight,
								"dy": $math.round((this.baseLineRatio * currentLineHeight), 3).toString()
							});
						}
						else {
							lineInfo.element.attr({
								"dy": -this.paddingBottom.toString()
							});
						}
						firstChunk = false;
					}

				}

				// Trim the last item
				let node = lineInfo.element.node;
				if (node) {
					let lastNode = node.lastChild;
					if (lastNode) {
						lastNode.textContent = this.rtl ?
							$utils.ltrim(lastNode.textContent) :
							$utils.rtrim(lastNode.textContent);
					}
				}

				// Increment collective height
				currentHeight += currentLineHeight;

				// Save line cache
				this.addLineInfo(lineInfo, i);
			}

			// Check if maybe we need to hide the whole label if it doesn't fit
			this.maybeHideOversized();

			this.measureFailed = false;
			if(this.bbox.width == 0 || this.bbox.height == 0){
				this.measureFailed = true;
			}			

			// Updated measured dims
			this._measuredWidth = $math.round($math.max(this.bbox.width, this.pixelWidth - this.pixelPaddingLeft - this.pixelPaddingRight));
			this._measuredHeight = $math.round($math.max(this.bbox.height, this.pixelHeight - this.pixelPaddingTop - this.pixelPaddingBottom));

			// Align the lines
			this.alignSVGText();

			this.bbox.width = this._measuredWidth;
			this.bbox.height = this._measuredHeight;

			if (oldH != this._measuredHeight || oldW != this._measuredWidth) {
				this.dispatch("transformed");
			}

			this.hideUnused(lines.length);
		}
		else {

			/**
			 * HTML
			 */

			this.element.removeAttr("display");
			this.resetBBox();

			// Clear the element
			let group: Group = <Group>this.element;
			group.removeChildren();

			// Create a ForeignObject to use as HTML container
			let fo = this.paper.foreignObject();
			group.add(fo);

			// Set widths on foreignObject so that autosizing measurements work
			// This will bet reset to actual content width/height
			if (this.maxWidth) {
				fo.attr({
					width: this.maxWidth
				});
			}
			if (this.maxHeight) {
				fo.attr({
					height: this.maxHeight
				});
			}

			// Create line element
			//let lineElement: HTMLElement = this.getHTMLLineElement(getTextFormatter().format(this.html, output));
			let lineElement: HTMLElement = this.getHTMLLineElement(text);
			fo.node.appendChild(lineElement);

			// Temporarily set to inline-block so we can measure real width and height
			lineElement.style.display = "inline-block";
			const clientWidth = lineElement.clientWidth;
			const clientHeight = lineElement.clientHeight;

			lineElement.style.display = "block";
			this._bbox = {
				x: 0,
				y: 0,
				width: clientWidth,
				height: clientHeight
			};

			// Set exact dimensions of foreignObject so it is sized exactly as
			// the content within
			fo.attr({
				width: clientWidth,
				height: clientHeight
			});

			// Check if maybe we need to hide the whole label if it doesn't fit
			this.maybeHideOversized();

			// Set measurements and update bbox
			this._measuredWidth = $math.max(this.bbox.width, this.pixelWidth - this.pixelPaddingLeft - this.pixelPaddingRight);
			this._measuredHeight = $math.max(this.bbox.height, this.pixelHeight - this.pixelPaddingTop - this.pixelPaddingBottom);

			this.bbox.width = this._measuredWidth;
			this.bbox.height = this._measuredHeight;

			// Don't let labels bleed out of the alotted area
			if (this.truncate) {
				lineElement.style.overflow = "hidden";
			}

			if ((clientWidth > maxWidth) || (clientHeight > maxHeight)) {
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

		if (this.pathElement) {
			this.paper.appendDef(this.pathElement);
		}
	}

	/**
	 * Hides element if it does not fit into available space
	 */
	private maybeHideOversized(): void {
		if (this.hideOversized) {
			if ((this.availableWidth < this.bbox.width) || (this.availableHeight < this.bbox.height)) {
				this.element.attr({ display: "none" });
				this.isOversized = true;
			}
			else {
				this.element.removeAttr("display");
				this.isOversized = false;
			}
		}
	}

	/**
	 * Aligns the lines horizontally ant vertically, based on properties.
	 *
	 * @ignore Exclude from docs
	 */
	public alignSVGText(): void {
		// Get Group
		let group: Group = <Group>this.element;
		let children = group.node.children || group.node.childNodes;

		// Is there anything to align?
		if (!children || (children && children.length == 0)) {
			return;
		}

		let width = this._measuredWidth;
		let height = this._measuredHeight;

		// TODO maybe these aren't needed ?
		$utils.used(this.pixelPaddingLeft);
		$utils.used(this.pixelPaddingRight);
		$utils.used(this.pixelPaddingTop);
		$utils.used(this.pixelPaddingBottom);

		// Process each line
		//$iter.each(group.children.backwards().iterator(), (element) => {
		for (let i = children.length - 1; i >= 0; i--) {
			// Align horizontally
			// Since we are using `text-anchor` for horizontal alignment, all we need
			// to do here is move the `x` position
			let node = <SVGElement>children[i];

			node.setAttribute("text-anchor", this.textAlign);

			if (this.textPathElement) {
				node.removeAttribute("x");
				node.removeAttribute("y");
			}
			else {
				switch (this.textAlign) {
					case "middle":
						node.setAttribute("x", (width / 2).toString() + "px");
						break;
					case "end":
						if (this.rtl) {

						}
						else {
							node.setAttribute("x", width.toString());
						}
						break;
					default:
						if (this.rtl) {
							node.setAttribute("x", width.toString());
						}
						else {
							node.removeAttribute("text-anchor");
						}
						break;
				}

				let y = $type.toNumber(node.getAttribute("y"));

				switch (this.textValign) {
					case "middle":
						node.setAttribute("y", (y + (height - this.bbox.height) / 2).toString());
						break;
					case "bottom":
						node.setAttribute("y", (y + height - this.bbox.height).toString());
						break;
					default:
						node.setAttribute("y", y.toString());
						break;
				}
			}
		}
	}

	/**
	 * Produces an SVG line element with formatted text.
	 *
	 * @ignore Exclude from docs
	 * @param text    Text to wrap into line
	 * @param y       Current line vertical position
	 * @return A DOM element
	 * @todo Implement HTML support
	 */
	public getSVGLineElement(text: string, y?: number): Group {

		// Create a <text> node and set text
		let element: Group = this.paper.addGroup("text");
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
				//"unicode-bidi": "bidi-override"
			});
		}

		return element;
	}

	/**
	 * Resets cached BBox.
	 *
	 * @ignore Exclude from docs
	 */
	public resetBBox(): void {
		this._bbox = { x: 0, y: 0, width: 0, height: 0 };
	}


	/**
	 * Creates and returns an HTML line element (`<div>`).
	 *
	 * @ignore Exclude from docs
	 * @param text  Text to add
	 * @return `<div>` element reference
	 */
	public getHTMLLineElement(text: string): HTMLElement {

		// Create the <div> element
		let div: HTMLElement = document.createElement("div");
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
			//div.style.unicodeBidi = "bidi-override";
		}

		// Translate some of the SVG styles into CSS
		if ($type.hasValue(this.fill)) {
			div.style.color = this.fill.toString();
		}

		return div;
	}

	/**
	 * Applies specific styles to text to make it not selectable, unless it is
	 * explicitly set as `selectable`.
	 *
	 * @ignore Exclude from docs
	 * @todo Set styles via AMElement
	 */
	public setStyles(): void {
		let group: Group = <Group>this.element;
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
	}

	/**
	 * Hides unused lines
	 */
	protected hideUnused(index: number) {
		this.initLineCache();
		let lines: ITextLineInfo[] = this.getCache("lineInfo");
		if (lines.length >= index) {
			for (let i = index; i < lines.length; i++) {
				let line = lines[i];
				if (line && line.element) {
					line.element.attr({ "display": "none" });
				}
			}
		}
	}

	/**
	 * An SVG text.
	 *
	 * Please note that setting `html` will override this setting if browser
	 * supports `foreignObject` in SGV, such as most modern browsers excluding
	 * IEs.
	 *
	 * @param value  SVG Text
	 */
	public set text(value: string) {
		//this.setPropertyValue("html", undefined);
		this.setPropertyValue("text", value, true);
	}

	/**
	 * @return SVG text
	 */
	public get text(): string {
		return this.getPropertyValue("text");
	}

	/**
	 * An SVG path string to position text along. If set, the text will follow
	 * the curvature of the path.
	 *
	 * Location along the path can be set using `locationOnPath`.
	 *
	 * IMPORTANT: Only SVG text can be put on path. If you are using HTML text
	 * this setting will be ignored.
	 *
	 * @since 4.1.2
	 * @param  value  Path
	 */
	public set path(value: string) {
		if (this.setPropertyValue("path", value, true)) {
			if (this.pathElement) {
				this.pathElement.dispose();
			}

			if (this.textPathElement) {
				this.textPathElement.dispose();
			}

			this.pathElement = this.paper.add("path");
			this.pathElement.attr({ "d": value });
			this.pathElement.attr({ "id": "text-path-" + this.uid });
			this._disposers.push(this.pathElement);

			this.textPathElement = this.paper.addGroup("textPath");
			this.textPathElement.attrNS($dom.XLINK, "xlink:href", "#text-path-" + this.uid);
			// TODO remove after https://bugzilla.mozilla.org/show_bug.cgi?id=455986 is fixed
			this.textPathElement.attr({ "path": value });
			this._disposers.push(this.textPathElement);
			this.hardInvalidate();
		}
	}

	/**
	 * @return Path
	 */
	public get path(): string {
		return this.getPropertyValue("path");
	}

	/**
	 * Relative label location on `path`. Value range is from 0 (beginning)
	 * to 1 (end).
	 *
	 * Works only if you set `path` setting to an SVG path.
	 *
	 * @since 4.1.2
	 * @default 0
	 * @param  value  Relatvie location on path
	 */
	public set locationOnPath(value: number) {
		this.setPropertyValue("locationOnPath", value);
		if (this.textPathElement) {
			this.textPathElement.attr({ "startOffset": (value * 100) + "%" })
		}
	}

	/**
	 * @return Relatvie location on path
	 */
	public get locationOnPath(): number {
		return this.getPropertyValue("locationOnPath");
	}

	/**
	 * A ratio to calculate text baseline. Ralative distance from the bottom of
	 * the label.
	 *
	 * @since 4.4.2
	 * @default -0.27
	 * @param  value  Base line ratio
	 */
	public set baseLineRatio(value: number) {
		this.setPropertyValue("baseLineRatio", value);
	}

	/**
	 * @return Base line ratio
	 */
	public get baseLineRatio(): number {
		return this.getPropertyValue("baseLineRatio");
	}

	/**
	 * Enables or disables autowrapping of text.
	 *
	 * @param value  Auto-wrapping enabled
	 */
	public set wrap(value: boolean) {
		this.resetBBox();
		this.setPropertyValue("wrap", value, true);
	}

	/**
	 * @return Auto-wrap enabled or not
	 */
	public get wrap(): boolean {
		return this.getPropertyValue("wrap");
	}

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
	 * @param value  trincate text?
	 */
	public set truncate(value: boolean) {
		this.resetBBox();
		this.setPropertyValue("truncate", value, true);
	}

	/**
	 * @return Truncate text?
	 */
	public get truncate(): boolean {
		return this.getPropertyValue("truncate");
	}

	/**
	 * If `truncate` is enabled, should Label try to break only on full words
	 * (`true`), or whenever needed, including middle of the word. (`false`)
	 *
	 * @default true
	 * @param value  Truncate on full words?
	 */
	public set fullWords(value: boolean) {
		this.setPropertyValue("fullWords", value, true);
	}

	/**
	 * @return Truncate on full words?
	 */
	public get fullWords(): boolean {
		return this.getPropertyValue("fullWords");
	}

	/**
	 * Ellipsis character to use if `truncate` is enabled.
	 *
	 * @param value Ellipsis string
	 * @default "..."
	 */
	public set ellipsis(value: string) {
		this.setPropertyValue("ellipsis", value, true);
	}

	/**
	 * @return Ellipsis string
	 */
	public get ellipsis(): string {
		return this.getPropertyValue("ellipsis");
	}

	/**
	 * Forces the text to be selectable. This setting will be ignored if the
	 * object has some kind of interaction attached to it, such as it is
	 * `draggable`, `swipeable`, `resizable`.
	 *
	 * @param value  Text selectable?
	 * @default false
	 */
	public set selectable(value: boolean) {
		this.setPropertyValue("selectable", value, true);
		this.setStyles();
	}

	/**
	 * @return Text selectable?
	 */
	public get selectable(): boolean {
		return this.getPropertyValue("selectable");
	}

	/**
	 * Horizontal text alignment.
	 *
	 * Available choices:
	 * * "start"
	 * * "middle"
	 * * "end"
	 *
	 * @param value  Alignment
	 */
	public set textAlign(value: TextAlign) {
		this.setPropertyValue("textAlign", value, true);
	}

	/**
	 * @return Alignment
	 */
	public get textAlign(): TextAlign {
		return this.getPropertyValue("textAlign");
	}

	/**
	 * Vertical text alignment.
	 *
	 * @ignore Exclude from docs (not used)
	 * @param value  Alignment
	 * @deprecated
	 */
	public set textValign(value: TextValign) {
		this.setPropertyValue("textValign", value, true);
	}

	/**
	 * @ignore Exclude from docs (not used)
	 * @return Alignment
	 * @deprecated
	 */
	public get textValign(): TextValign {
		return this.getPropertyValue("textValign");
	}


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
	 * @param value HTML text
	 */
	public set html(value: string) {
		this.setPropertyValue("html", value, true);
	}

	/**
	 * @return HTML content
	 */
	public get html(): string {
		return this.getPropertyValue("html");
	}

	/**
	 * Indicates whether the whole text should be hidden if it does not fit into
	 * its allotted space.
	 *
	 * @param value  Hide if text does not fit?
	 */
	public set hideOversized(value: boolean) {
		this.setPropertyValue("hideOversized", value, true);
	}

	/**
	 * @return Hide if text does not fit?
	 */
	public get hideOversized(): boolean {
		return this.getPropertyValue("hideOversized");
	}

	/**
	 * If set to `true` square-bracket formatting blocks will be treated as
	 * regular text.
	 *
	 * @default false
	 * @param value  Ignore formatting?
	 */
	public set ignoreFormatting(value: boolean) {
		this.setPropertyValue("ignoreFormatting", value, true);
	}

	/**
	 * @return Ignore formatting?
	 */
	public get ignoreFormatting(): boolean {
		return this.getPropertyValue("ignoreFormatting");
	}

	/**
	 * Override `mesaureElement` so it does not get measure again, because
	 * internal `_bbox` is being updated by measuring routines in Text itself.
	 */
	public measureElement(): void { }

	/**
	 * Returns information about a line element.
	 *
	 * @ignore Exclude from docs
	 * @param index  Line index
	 * @return Line info object
	 */
	public getLineInfo(index: number): ITextLineInfo {
		this.initLineCache();
		let lines = this.getCache("lineInfo");
		return lines.length > index ? lines[index] : undefined;
	}

	/**
	 * Adds a line to line info cache.
	 *
	 * @ignore Exclude from docs
	 * @param line     Line info object
	 * @param index    Insert at specified index
	 */
	public addLineInfo(line: ITextLineInfo, index: number): void {
		this.initLineCache();
		this.getCache("lineInfo")[index] = line;
	}

	/**
	 * Checks if line cache is initialized and initializes it.
	 */
	private initLineCache(): void {
		if (!$type.hasValue(this.getCache("lineInfo"))) {
			this.setCache("lineInfo", [], 0);
		}
	}

	/**
	 * Sets a [[DataItem]] to use for populating dynamic sections of the text.
	 *
	 * Check the description for [[Text]] class, for data binding.
	 *
	 * @param dataItem Data item
	 */
	public setDataItem(dataItem: DataItem): void {
		if (this._sourceDataItemEvents) {
			this._sourceDataItemEvents.dispose();
		}
		if (dataItem) {
			this._sourceDataItemEvents = new MultiDisposer([
				dataItem.events.on("valuechanged", this.invalidate, this, false),
				dataItem.events.on("workingvaluechanged", this.invalidate, this, false),
				dataItem.events.on("calculatedvaluechanged", this.invalidate, this, false),
				dataItem.events.on("propertychanged", this.invalidate, this, false)
			]);
		}
		super.setDataItem(dataItem);
	}

	/**
	 * Returns available horizontal space.
	 *
	 * @ignore Exclude from docs
	 * @return Available width (px)
	 */
	public get availableWidth(): number {
		return $type.hasValue(this.maxWidth) ? this.maxWidth : this.pixelWidth;
	}

	/**
	 * Returns available vertical space.
	 *
	 * @return Available height (px)
	 */
	public get availableHeight(): number {
		return $type.hasValue(this.maxHeight) ? this.maxHeight : this.pixelHeight;
	}

	// temp, replacing textFormatter method
	public getSvgElement(text: string, style?: string): AMElement {
		let element = this.paper.add("tspan");
		element.textContent = text;
		if (style) {
			element.node.setAttribute("style", style);
		}
		return element;
	}

	/**
	 * Invalidates the whole element, including layout AND all its child
	 * elements.
	 */
	public deepInvalidate() {
		super.deepInvalidate();
		this.hardInvalidate();
	}

	/**
	 * Screen reader title of the element.
	 *
	 * @param value Title
	 */
	public set readerTitle(value: string) {
		value = $type.toText(value);
		if (this.setPropertyValue("readerTitle", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @return Title
	 */
	public get readerTitle(): string {
		let title = this.getPropertyValue("readerTitle");
		if (!title) {
			title = this.populateString(
				$utils.plainText(
					$utils.isNotEmpty(this.html)
						? this.html
						: this.text
				)
			);
		}
		return title;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Label"] = Label;

/**
 * Add default responsive rules
 */

/**
 * Hide labels added directly to chart, like titles if chart is short.
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.heightXS,
	state: function(target, stateId) {
		if (target instanceof Label && target.parent && target.parent.isBaseSprite) {
			let state = target.states.create(stateId);
			state.properties.disabled = true;
			return state;
		}

		return null;
	}
});
