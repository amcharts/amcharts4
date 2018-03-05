/**
 * Module for "Lighten" filter.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Filter, FilterProperties } from "./Filter";
import { AMElement } from "../AMElement";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines additional properties relative to the "Lighten" filter
 */
export interface LightenFilterProperties extends FilterProperties {
    /**
     * Lightness. (0-1)
     *
     * @type {number}
     */
    lightness: number;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a "Lighten" filter.
 */
export declare class LightenFilter extends Filter {
    /**
     * Defines property types.
     *
     * @ignore Exclude from docs
     * @type {LightenFilterProperties}
     */
    _properties: LightenFilterProperties;
    /**
     * A storage for Filter property/value pairs.
     * @see [@link LightenFilterProperties]
     * @type {Dictionary<LightenFilterProperties, any>}
     */
    /**
     * Reference to the `<feColorMatrix>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feColorMatrix: AMElement;
    /**
     * Constructor
     * * Creates primitve (effect) elements
     * * Sets default properties
     */
    constructor();
    /**
     * @return {number} Lightness (0-1)
     */
    /**
     * Lightness. (0-1)
     *
     * @param {number} value Lightness (0-1)
     */
    lightness: number;
}
