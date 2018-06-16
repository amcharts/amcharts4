/**
 * Module for "Blur" filter.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Filter, FilterProperties } from "./Filter";
import { AMElement } from "../AMElement";
import { Color } from "../../utils/Color";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines additional properties relative to the "Blur" filter.
 */
export interface BlurFilterProperties extends FilterProperties {
    /**
     * Horizontal offset in pixels.
     *
     * @type {number}
     * @ignore Deprecated
     * @deprecated ?
     * @todo Remove?
     */
    dx?: number;
    /**
     * Vertical offset in pixels.
     *
     * @type {number}
     * @ignore Deprecated
     * @deprecated ?
     * @todo Remove?
     */
    dy?: number;
    /**
     * Blur value.
     *
     * @type {number}
     */
    blur: number;
    /**
     * Opacity. (0-1)
     *
     * @type {number}
     * @ignore Deprecated
     * @deprecated ?
     * @todo Remove?
     */
    opacity?: number;
    /**
     * Color.
     *
     * @type {Color}
     * @ignore Deprecated
     * @deprecated ?
     * @todo Remove?
     */
    color?: Color;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a "Blur" filter.
 */
export declare class BlurFilter extends Filter {
    /**
     * Defines property types.
     *
     * @ignore Exclude from docs
     * @type {BlurFilterProperties}
     */
    _properties: BlurFilterProperties;
    /**
     * A storage for Filter property/value pairs.
     * @see [@link BlurFilterProperties]
     * @type {Dictionary<BlurFilterProperties, any>}
     */
    /**
     * Reference to the `<feGaussianBlur>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feGaussianBlur: AMElement;
    /**
     * Constructor
     * * Creates primitve (effect) elements
     * * Sets default properties
     */
    constructor();
    /**
     * @return {number} Blur
     */
    /**
     * Blur value.
     *
     * @default 1.5
     * @param {number} value Blur
     */
    blur: number;
}
