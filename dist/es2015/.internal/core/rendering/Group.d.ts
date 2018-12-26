/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AMElement } from "./AMElement";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates an SVG `<g>` element.
 *
 * SVG groups are used for elements that need more elements just one.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g} About `<g>` element
 */
export declare class Group extends AMElement {
    /**
     * Constructor.
     *
     * @param {string} elementName Element type (should be "g")
     */
    constructor(elementName: string);
    /**
     * Adds an element to group.
     *
     * This will manipulate DOM. `element` will be physically moved into group.
     *
     * @param {AMElement}  element  Element
     */
    add(element: AMElement): void;
    /**
     * Adds an element to group.
     *
     * This will manipulate DOM. `element` will be physically moved into group.
     *
     * @param {AMElement}  element  Element
     */
    addToBack(element: AMElement): void;
    /**
     * Removes the `element` from group.
     *
     * Please note that this will not dispose the element itself, it will just
     * remove it from the group.
     *
     * @param {AMElement}  element  Element
     */
    removeElement(element: AMElement): void;
    /**
     * Checks if this group already has the child element added
     *
     * @param {AMElement}  element
     * @return {boolean}
     */
    hasChild(element: AMElement): boolean;
    /**
     * @return {string} SVG markup
     */
    /**
     * Content of the group element.
     *
     * Can be used to add a lot of proprietary SVG markup into group.
     *
     * @param {string}  value  SVG markup
     */
    content: string;
    /**
     * Removes all children from the group.
     */
    removeChildren(): void;
}
