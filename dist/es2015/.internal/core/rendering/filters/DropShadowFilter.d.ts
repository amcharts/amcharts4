/**
 * Module for "Drop Shadow" filter.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Filter, FilterProperties } from "./Filter";
import { AMElement } from "../AMElement";
import { Group } from "../Group";
import { Color } from "../../utils/Color";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines additional properties relative to the "Drop Shadow" filter
 */
export interface DropShadowFilterProperties extends FilterProperties {
    /**
     * Horizontal offset in pixels.
     *
     * @type {number}
     */
    dx: number;
    /**
     * Vertical offset in pixels.
     *
     * @type {number}
     */
    dy: number;
    /**
     * Blur.
     *
     * @type {number}
     */
    blur: number;
    /**
     * Shadow opacity. (0-1)
     *
     * @type {number}
     */
    opacity: number;
    /**
     * Shadow color.
     *
     * @type {Color}
     */
    color: Color;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creats a "Drop Shadow" filter.
 */
export declare class DropShadowFilter extends Filter {
    /**
     * Defines property types.
     *
     * @ignore Exclude from docs
     * @type {DropShadowFilterProperties}
     */
    _properties: DropShadowFilterProperties;
    /**
     * A storage for Filter property/value pairs.
     *
     * @see [@link DropShadowFilterProperties]
     * @type {Dictionary<DropShadowFilterProperties, any>}
     */
    /**
     * Reference to the `<feGaussianBlur>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feGaussianBlur: AMElement;
    /**
     * Reference to the `<feOffset>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feOffset: AMElement;
    /**
     * Reference to the `<feFlood>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feFlood: AMElement;
    /**
     * Reference to the `<feFlood>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feComposite: AMElement;
    /**
     * Reference to the `<feMerge>` element.
     *
     * @ignore Exclude from docs
     * @type {Group}
     */
    feMerge: Group;
    /**
     * Constructor
     * * Creates primitve (effect) elements
     * * Sets default properties
     */
    constructor();
    /**
     * @return {Color} Color
     */
    /**
     * Shadow color.
     *
     * @param {Color}  value  Color
     */
    color: Color;
    /**
     * @return {number} Opacity (0-1)
     */
    /**
     * Opacity of the shadow. (0-1)
     *
     * @param {number}  value  Opacity (0-1)
     */
    opacity: number;
    /**
     * @return {number} Horizontal offset (px)
     */
    /**
     * Horizontal offset in pixels.
     *
     * @param {number}  value  Horizontal offset (px)
     */
    dx: number;
    /**
     * @return {number} Vertical offset (px)
     */
    /**
     * Vertical offset in pixels.
     *
     * @param {number} value Vertical offset (px)
     */
    dy: number;
    /**
     * @return {number} Blur
     */
    /**
     * Blur.
     *
     * @param {number}  value  Blur
     */
    blur: number;
    /**
     * [updateScale description]
     *
     * @todo Description
     */
    protected updateScale(): void;
}
