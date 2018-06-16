/**
 * Module for "Desaturate" filter.
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
 * Defines additional properties relative to the "Desaturate" filter
 */
export interface DesaturateFilterProperties extends FilterProperties {
    /**
     * Saturation. (0-1)
     *
     * @type {number}
     */
    saturation: number;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creats a "Desaturate" filter
 */
export declare class DesaturateFilter extends Filter {
    /**
     * Defines property types.
     *
     * @ignore Exclude from docs
     * @type {DesaturateFilterProperties}
     */
    _properties: DesaturateFilterProperties;
    /**
     * A storage for Filter property/value pairs.
     * @see [@link DesaturateFilterProperties]
     * @type {Dictionary<DesaturateFilterProperties, any>}
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
     * @return {number} Saturation (0-1)
     */
    /**
     * Saturation.
     *
     * 0 - completely desaturated.
     * 1 - fully saturated.
     *
     * @param {number}  value  Saturation (0-1)
     * @todo Describe possible values
     */
    saturation: number;
}
