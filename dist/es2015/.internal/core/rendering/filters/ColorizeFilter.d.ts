/**
 * Module for "Colorize" filter.
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
import * as $type from "../../utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines additional properties relative to the "Colorize" filter.
 */
export interface ColorizeFilterProperties extends FilterProperties {
    /**
     * Color.
     *
     * @type {Color}
     */
    color?: Color;
    /**
     * Intensity. (0-1)
     *
     * @default 1
     * @type {number}
     */
    intensity: number;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a "Colorize" filter.
 */
export declare class ColorizeFilter extends Filter {
    /**
     * Defines property types.
     *
     * @ignore Exclude from docs
     * @type {ColorizeFilterProperties}
     */
    _properties: ColorizeFilterProperties;
    /**
     * A storage for Filter property/value pairs.
     * @see [@link ColorizeFilterProperties]
     * @type {Dictionary<ColorizeFilterProperties, any>}
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
     * (Re)applies colors to the already existing filter by modifying filyer's
     * color matrix element.
     *
     * @ignore Exclude from docs
     */
    applyFilter(): void;
    /**
     * @return {Color} Color
     */
    /**
     * Color.
     *
     * @param {Color}  value  Color
     */
    color: $type.Optional<Color>;
    /**
     * @return {number} Intensity (0-1)
     */
    /**
     * Intensity of the color. (0-1)
     *
     * @default 1
     * @param {number} value Intensity (0-1)
     * @todo Describe possible values
     */
    intensity: number;
}
