/**
 * Paper class just like the white sheet of pressed fiber it draws its name
 * inspiration from is used as a starting point to start a drawing.
 *
 * Before we can start adding elements (drawing) we need to take out a new sheet
 * of paper, or in this instance create a blank SVG element.
 *
 * This class creates such element, as well as implements methods needed to
 * start adding elements to it.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AMElement } from "./AMElement";
import { Group } from "./Group";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Represents available SVG elements that can be added to paper.
 *
 * @type {string}
 * @todo Review if we can remove commented out methods
 */
export declare type SVGElementNames = "a" | "altGlyph" | "altGlyphDef" | "altGlyphItem" | "animate" | "animateColor" | "animateMotion" | "animateTransform" | "circle" | "clipPath" | "color-profile" | "cursor" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "feConvolveMatrix" | "filter" | "font" | "font-face" | "font-face-format" | "font-face-name" | "font-face-src" | "font-face-uri" | "foreignObject" | "g" | "glyph" | "glyphRef" | "hkern" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "missing-glyph" | "mpath" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "script" | "set" | "stop" | "style" | "svg" | "switch" | "symbol" | "text" | "textPath" | "title" | "tref" | "tspan" | "use" | "view" | "vkern";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Paper class which when instantiated will create an SVG element as well as
 * some of the sub-elements like `<desc>`, `<defs>`.
 *
 * Use its methods like `addGroup` and `append` to add elements to the paper.
 */
export declare class Paper {
    /**
     * A reference `<svg>` element.
     *
     * @type {SVGSVGElement}
     */
    svg: SVGSVGElement;
    /**
     * A reference to the HTML container the `<svg>` element is placed in.
     *
     * @type {HTMLElement}
     */
    container: HTMLElement;
    /**
     * A reference to the `<defs>` element.
     *
     * @type {SVGDefsElement}
     */
    defs: SVGDefsElement;
    /**
     * An id of the element.
     *
     * @type {string}
     */
    id: string;
    /**
     * Creates main `<svg>` container and related elements.
     *
     * @param {HTMLElement} container A reference to HTML element to create `<svg>` in
     */
    constructor(container: HTMLElement, id: string);
    /**
     * Creates and returns a new element. Does not attach it to Paper yet.
     *
     * @param  {SVGElementNames}  elementName  Element name
     * @return {AMElement}                     New element
     */
    add(elementName: SVGElementNames): AMElement;
    /**
     * Creates and returns a new Group element. Does not attach it to Paper.
     *
     * @param  {SVGElementNames}  groupName  Element name
     * @return {Group}                       New Group
     */
    addGroup(groupName: SVGElementNames): Group;
    /**
     * Appends an element to Paper.
     *
     * @param {AMElement} element Element to append
     */
    append(element: AMElement): void;
    /**
     * Appends an element to `<defs>` block of the Paper.
     *
     * @param {AMElement}  element  Element
     */
    appendDef(element: AMElement): void;
    /**
     * Creates and returns new `<foreignObject>` element. Does not append it to
     * Paper.
     *
     * @return {AMElement} A foreignObject element
     */
    foreignObject(): AMElement;
    /**
     * Checks if browser supports `<foreignObject>` elements.
     *
     * @return {boolean} Supports `foreignObject`?
     */
    supportsForeignObject(): boolean;
}
/**
 * A [[Paper]] instance to create elements, that are not yet ready to be
 * placed in visible DOM.
 *
 * @ignore Exclude from docs
 * @type {Paper}
 */
export declare function getGhostPaper(): Paper;
