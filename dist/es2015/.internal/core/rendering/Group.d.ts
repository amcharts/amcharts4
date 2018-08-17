/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AMElement } from "./AMElement";
import { List } from "../utils/List";
import * as $type from "../utils/Type";
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
     * All child elements contained in the group.
     *
     * @type {List<AMElement>}
     */
    children: List<AMElement>;
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
     * First element in the group.
     *
     * @return {Optional<AMElement>} First element
     */
    readonly firstChild: $type.Optional<AMElement>;
    /**
     * Last element in the group.
     *
     * @return {Optional<AMElement>} Last element
     */
    readonly lastChild: $type.Optional<AMElement>;
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
     *
     * This will note dispose the children. They will remain in memory as
     * orphans. To automatically remove and dispose children elements use
     * `disposeChildren()` instead.
     */
    removeChildren(): void;
    /**
     * Removes and disposes all elements in the group.
     */
    disposeChildren(): void;
    /**
     * Regenerates internal `children` list out of the actual nodes in DOM.
     *
     * @ignore Exclude from docs
     */
    populateChildren(): void;
}
