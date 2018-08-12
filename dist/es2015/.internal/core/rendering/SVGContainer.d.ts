/**
 * This functionality is related to the HTML wrapper that houses `<svg>` tag.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../Container";
import { IDisposer } from "../utils/Disposer";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A array of all SVG Containers (one SVG container per chart instance).
 *
 * @ignore Exclude from docs
 * @type {Array<SVGContainer>}
 */
export declare const svgContainers: Array<SVGContainer>;
/**
 * A class used to create an HTML wrapper for the SVG contents.
 */
export declare class SVGContainer implements IDisposer {
    /**
     * Indicates if this object has already been deleted. Any
     * destruction/disposal code should take this into account when deciding
     * wheter to run potentially costly disposal operations if they already have
     * been run.
     *
     * @type {boolean}
     */
    protected _disposed: boolean;
    /**
     * Width of HTML element.
     *
     * @type {Optional<number>}
     */
    width: $type.Optional<number>;
    /**
     * Height of HTML element.
     *
     * @type {Optional<number>}
     */
    height: $type.Optional<number>;
    /**
     * A [[Container]] element which is placed into container.
     *
     * @type {Optional<Container>}
     */
    protected _container: $type.Optional<Container>;
    /**
     * A parent HTML container that SVG wrapper element is placed in.
     *
     * @type {HTMLElement}
     */
    htmlElement: HTMLElement;
    /**
     * If this component is in a separate HTML container, `autoResize` means the
     * module will constantly measure container's size and adopt contents to it.
     *
     * @type {Boolean}
     */
    autoResize: Boolean;
    /**
     * A `<div>` element which acts as a wrapper/holder for the SVG element.
     *
     * @type {HTMLDivElement}
     */
    SVGContainer: HTMLDivElement;
    /**
     * Constructor
     *
     * * Creates an HTML wrapper for SVG
     */
    constructor(htmlElement: HTMLElement);
    /**
     * Measures size of parent HTML element.
     *
     * @ignore Exclude from docs
     */
    measure(): void;
    /**
     * @return {Optional<Container>} Container
     */
    /**
     * A [[Container]] element which is placed into container.
     *
     * @param {Optional<Container>}  container  Container
     */
    container: $type.Optional<Container>;
    /**
     * Returns if this object has been already been disposed.
     *
     * @return {boolean} Is disposed?
     */
    isDisposed(): boolean;
    /**
     * Removes this container from SVG container list in system, which
     * effectively disables size change monitoring for it.
     */
    dispose(): void;
}
