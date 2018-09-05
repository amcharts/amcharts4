import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../Container";
import { DataItem } from "../DataItem";
import { TextValign } from "../defs/TextValign";
import { TextAlign } from "../defs/TextAlign";
import { AMElement } from "../rendering/AMElement";
import { Group } from "../rendering/Group";
import { MultiDisposer } from "../utils/Disposer";
/**
 * Defines properties for [[Text]].
 */
export interface ILabelProperties extends IContainerProperties {
    /**
     * Horizontal align of the text.
     *
     * @default "start"
     * @type {TextAlign}
     */
    textAlign?: TextAlign;
    /**
     * Vertical align of the text.
     *
     * @default "top"
     * @type {TextValign}
     */
    textValign?: TextValign;
    /**
     * A plain text content.
     *
     * @type {string}
     */
    text?: string;
    /**
     * Should the lines wrap if they do not fit into max width?
     *
     * @default false
     * @type {boolean}
     */
    wrap?: boolean;
    /**
     * Should the text be selectable>
     *
     * @default false
     * @type {boolean}
     */
    selectable?: boolean;
    /**
     * HTML content.
     *
     * @type {string}
     */
    html?: string;
    /**
     * Should the lines be truncated (optionally with ellipsis) if they do not
     * fit into max width?
     *
     * @default false
     * @type {boolean}
     */
    truncate?: boolean;
    /**
     * If `truncate` is enabled, should Label try to break only on full words
     * (`true`), or whenever needed, including middle of the word. (`false`)
     *
     * @default true
     * @type {boolean}
     */
    fullWords?: boolean;
    /**
     * If lines are truncated, this ellipsis will be added at the end.
     *
     * @default "..."
     * @type {string}
     */
    ellipsis?: string;
    /**
     * Hide text of it does not fit into element's dimensions?
     *
     * @default false
     * @type {boolean}
     */
    hideOversized?: boolean;
}
/**
 * Text line information.
 *
 * Objects used to hold cached information about lines in a Text element.
 */
export interface ITextLineInfo {
    /**
     * Measurements for the bounding box of the line.
     *
     * @type {SVGRect}
     */
    "bbox"?: SVGRect;
    /**
     * A reference to an SVG `<g>` element that holds line elements.
     *
     * @type {Group}
     */
    "element"?: Group;
    /**
     * Indicates if line contains more than one element, e.g. has multiple
     * formatted blocks.
     *
     * @type {boolean}
     */
    "complex"?: boolean;
}
/**
 * Defines events for [[Text]].
 */
export interface ILabelEvents extends IContainerEvents {
}
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
     *
     * @type {string}
     */
    textOutput: string;
    /**
     * Applied to the final formatted label HTML.
     *
     * @type {string}
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
 * @todo Vertical align
 * @todo Linkage to relative documentation (formatters, data binding)
 * @important
 */
export declare class Label extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ILabelProperties}
     */
    _properties: ILabelProperties;
    /**
     * Defines Adapter type.
     *
     * @ignore Exclude from docs
     * @type {ILabelAdapters}
     */
    _adapter: ILabelAdapters;
    /**
     * Defines available events.
     *
     * @type {ILabelEvents}
     * @ignore Exclude from docs
     */
    _events: ILabelEvents;
    /**
     * Indicates if the whole text does not fit into max dimenstions set for it.
     *
     * @type {boolean}
     */
    isOversized: boolean;
    /**
     * Currently formatted text, read only.
     *
     * @type {string}
     */
    currentText: string;
    /**
     * Current format to be used for outputing text.
     *
     * @type {string}
     */
    protected _currentFormat: string;
    /**
     * [_sourceDataItemEvents description]
     *
     * @todo Description
     * @type {MultiDisposer}
     */
    protected _sourceDataItemEvents: MultiDisposer;
    protected _prevStatus: string;
    /**
     * Constructor
     */
    constructor();
    /**
     * [arrange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    arrange(): void;
    /**
     * Updates current text according to data item and supported features.
     * Returns `true` if current text has changed.
     *
     * @return {boolean} Text changed?
     */
    protected updateCurrentText(): boolean;
    /**
     * Draws the textual label.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * Aligns the lines horizontally ant vertically, based on properties.
     *
     * @ignore Exclude from docs
     */
    alignSVGText(): void;
    /**
     * Produces an SVG line element with formatted text.
     *
     * @ignore Exclude from docs
     * @param  {string}     text    Text to wrap into line
     * @param  {number}     y       Current line vertical position
     * @return {AMElement}          A DOM element
     * @todo Implement HTML support
     */
    getSVGLineElement(text: string, y?: number): Group;
    /**
     * Resets cached BBox.
     *
     * @ignore Exclude from docs
     */
    resetBBox(): void;
    /**
     * Creates and returns an HTML line element (`<div>`).
     *
     * @ignore Exclude from docs
     * @param  {string}       text  Text to add
     * @return {HTMLElement}        `<div>` element reference
     */
    getHTMLLineElement(text: string): HTMLElement;
    /**
     * Applies specific styles to text to make it not selectable, unless it is
     * explicitly set as `selectable`.
     *
     * @ignore Exclude from docs
     * @todo Set styles via AMElement
     */
    setStyles(): void;
    /**
     * Hides unused lines
     */
    protected hideUnused(index: number): void;
    /**
     * @return {string} SVG text
     */
    /**
     * An SVG text.
     *
     * Please note that setting `html` will override this setting if browser
     * supports `foreignObject` in SGV, such as most modern browsers excluding
     * IEs.
     *
     * @param {string}  value  SVG Text
     */
    text: string;
    /**
     * @return {boolean} Auto-wrap enabled or not
     */
    /**
     * Enables or disables autowrapping of text.
     *
     * @param {boolean}  value  Auto-wrapping enabled
     */
    wrap: boolean;
    /**
     * @return {boolean} Truncate text?
     */
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
    truncate: boolean;
    /**
     * @return {boolean} Truncate on full words?
     */
    /**
     * If `truncate` is enabled, should Label try to break only on full words
     * (`true`), or whenever needed, including middle of the word. (`false`)
     *
     * @default true
     * @param {boolean}  value  Truncate on full words?
     */
    fullWords: boolean;
    /**
     * @return {string} Ellipsis string
     */
    /**
     * Ellipsis character to use if `truncate` is enabled.
     *
     * @param {string} value Ellipsis string
     * @default "..."
     */
    ellipsis: string;
    /**
     * @return {boolean} Text selectable?
     */
    /**
     * Forces the text to be selectable. This setting will be ignored if the
     * object has some kind of interaction attached to it, such as it is
     * `draggable`, `swipeable`, `resizable`.
     *
     * @param {boolean}  value  Text selectable?
     * @default false
     */
    selectable: boolean;
    /**
     * @return {TextAlign} Alignment
     */
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
    textAlign: TextAlign;
    /**
     * @ignore Exclude from docs (not used)
     * @return {TextValign} Alignment
     * @deprecated
     */
    /**
     * Vertical text alignment.
     *
     * @ignore Exclude from docs (not used)
     * @param {TextValign}  value  Alignment
     * @deprecated
     */
    textValign: TextValign;
    /**
     * @return {string} HTML content
     */
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
    html: string;
    /**
     * @return {boolean} Hide if text does not fit?
     */
    /**
     * Indicates whether the whole text should be hidden if it does not fit into
     * its allotted space.
     *
     * @param {boolean}  value  Hide if text does not fit?
     */
    hideOversized: boolean;
    /**
     * Override `mesaureElement` so it does not get measure again, because
     * internal `_bbox` is being updated by measuring routines in Text itself.
     */
    measureElement(): void;
    /**
     * Returns information about a line element.
     *
     * @ignore Exclude from docs
     * @param  {number}         index  Line index
     * @return {ITextLineInfo}         Line info object
     */
    getLineInfo(index: number): ITextLineInfo;
    /**
     * Adds a line to line info cache.
     *
     * @ignore Exclude from docs
     * @param {ITextLineInfo}  line     Line info object
     * @param {number}         index    Insert at specified index
     */
    addLineInfo(line: ITextLineInfo, index: number): void;
    /**
     * Checks if line cache is initialized and initializes it.
     */
    private initLineCache();
    /**
     * Sets a [[DataItem]] to use for populating dynamic sections of the text.
     *
     * Check the description for [[Text]] class, for data binding.
     *
     * @param {DataItem} dataItem Data item
     */
    setDataItem(dataItem: DataItem): void;
    /**
     * Returns available horizontal space.
     *
     * @ignore Exclude from docs
     * @return {number} Available width (px)
     */
    readonly availableWidth: number;
    /**
     * Returns available vertical space.
     *
     * @return {number} Available height (px)
     */
    readonly availableHeight: number;
    /**
     * Invalidates the whole element, causing its redraw.
     *
     * Appending `<defs>` section might influence appearance and thus its
     * dimensions.
     *
     * @ignore Exclude from docs
     */
    appendDefs(): void;
    getSvgElement(text: string, style?: string): AMElement;
}
