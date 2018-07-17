/**
 * Handles formatting of pseudo-markup in text.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../Base";
import { AMElement } from "../rendering/AMElement";
import { Adapter } from "../utils/Adapter";
/**
 * Defines an interface for an object that holds a chunk of text.
 */
export interface ITextChunk {
    /**
     * Type of the chunk.
     *
     * @type {"value" | "text" | "format" | "image"}
     */
    "type": "value" | "text" | "format" | "image";
    /**
     * Text.
     *
     * @type {string}
     */
    "text": string;
}
/**
 * A list of Adapters for [[TextFormatter]].
 */
export interface ITextFormatterAdapters {
    /**
     * Applied to each chunk of text when it is parsed and added to chunk list.
     *
     * @type {string}
     */
    chunk: string;
}
/**
 * Handles formatting of pseudo-markdown in text.
 *
 * @todo Encode < > in output
 * @todo Add more adapters
 * @important
 */
export declare class TextFormatter extends BaseObject {
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IExportAdapters}
     */
    _adapter: ITextFormatterAdapters;
    /**
     * Adapter.
     *
     * @type {Adapter<TextFormatter, ITextFormatterAdapters>}
     */
    adapter: Adapter<TextFormatter, ITextFormatterAdapters>;
    /**
     * Constructor
     */
    constructor();
    protected debug(): void;
    /**
     * Formats the text according to specifications passed in.
     *
     * @param  {string}  text    Text to format
     * @param  {string}  output  Output format (svg, html)
     * @return {string}          Formatted text
     */
    format(text: string, output?: string): string;
    /**
     * Replaces brackets with temporary placeholders.
     *
     * @ignore Exclude from docs
     * @param  {string}  text  Input text
     * @return {string}        Escaped text
     */
    escape(text: string): string;
    /**
     * Replaces placeholders back to brackets.
     *
     * @ignore Exclude from docs
     * @param  {string}  text  Escaped text
     * @return {string}        Unescaped text
     */
    unescape(text: string): string;
    /**
     * Cleans up the text text for leftover double square brackets.
     *
     * @ignore Exclude from docs
     * @param  {string}  text  Input text
     * @return {string}        Cleaned up text
     */
    cleanUp(text: string): string;
    /**
     * Wraps text into corresponding tags.
     *
     * @ignore Exclude from docs
     * @param  {string}  text   Text to wrap
     * @param  {string}  style  Styles
     * @param  {string}  output  Format to output in (svg, html)
     * @return {string}          Formatted string
     */
    wrap(text: string, style: string, output: string): string;
    /**
     * Wraps text in styled SVG tag.
     *
     * @ignore Exclude from docs
     * @param  {string}  text   Text to wrap
     * @param  {string}  style  Style property
     * @return {string}         Formatted tag
     */
    wrapSvg(text: string, style: string): string;
    /**
     * Returns an SVG `<tspan>` element.
     *
     * @ignore Exclude from docs
     * @param  {string}     text   Text
     * @param  {string}     style  Style
     * @return {AMElement}         Element
     */
    getSvgElement(text: string, style?: string): AMElement;
    /**
     * Wraps text in HTML <span> tag.
     *
     * @ignore Exclude from docs
     * @param  {string}  text   Text to wrap
     * @param  {string}  style  Style property
     * @return {string}         Formatted tag
     * @todo Translate SVG styles into HTML ones
     */
    wrapHtml(text: string, style: string): string;
    /**
     * Returns an HTML `<span>` element.
     *
     * @ignore Exclude from docs
     * @param  {string}       text   Text/HTML
     * @param  {string}       style  Style definition
     * @return {HTMLElement}         HTML element
     */
    getHtmlElement(text: string, style?: string): HTMLElement;
    /**
     * Trabslates SVG CSS into HTML CSS.
     *
     * @ignore Exclude from docs
     * @param  {string}  style  SVG CSS
     * @return {string}         HTML CSS
     * @todo Implement actual translation
     */
    styleSvgToHtml(style: string): string;
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
    translateStyleShortcuts(style: string): string;
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
    chunk(text: string, quotedBlocks?: boolean): ITextChunk[];
    /**
     * Checks if supplied format contains image information and should be
     * formatted as such.
     * I.e.: `[img: myImage.png]`
     *
     * @ignore Exclude from docs
     * @param  {string}   text  Format
     * @return {boolean}        `true` if it is an image
     */
    isImage(text: string): boolean;
}
/**
 * Returns the global instance of [[TextFormatter]].
 *
 * All classes and instances should reuse this universal text formatter,
 * rather than create their own instance of it.
 *
 * @type {TextFormatter}
 */
export declare function getTextFormatter(): TextFormatter;
