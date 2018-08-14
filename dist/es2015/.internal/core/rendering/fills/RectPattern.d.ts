/**
 * Rectangular pattern module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Pattern, PatternProperties } from "./Pattern";
import { AMElement } from "../AMElement";
import * as $type from "../../utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for rectangular pattern
 * @type {[type]}
 */
export interface RectPatternProperties extends PatternProperties {
    rectWidth: number;
    rectHeight: number;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Rectangular pattern
 */
export declare class RectPattern extends Pattern {
    /**
     * Reference to `<rect>` element used in pattern.
     *
     * @type {Optional<AMElement>}
     */
    protected _rect: $type.Optional<AMElement>;
    /**
     * Defines property types.
     *
     * @ignore Exclude from docs
     * @type {RectPatternProperties}
     */
    _properties: RectPatternProperties;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the rectangular element.
     */
    protected draw(): void;
    /**
     * @return {number} Width (px)
     */
    /**
     * Rectangle width in pixels.
     *
     * @param {number} value Width (px)
     */
    rectWidth: number;
    /**
     * @return {number} Height (px)
     */
    /**
     * Rectangle height in pixels.
     *
     * @param {number} value Height (px)
     */
    rectHeight: number;
}
