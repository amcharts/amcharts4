/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Pattern, PatternProperties } from "./Pattern";
import { AMElement } from "../AMElement";
export interface LinePatternProperties extends PatternProperties {
    gap: number;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Line pattern.
 */
export declare class LinePattern extends Pattern {
    /**
     * SVG `<line>` element used for pattern.
     */
    protected _line: AMElement;
    /**
     * Defines property types.
     */
    _properties: LinePatternProperties;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the pattern.
     */
    protected draw(): void;
    /**
     * @return gap
     */
    /**
     * @todo mm
     */
    gap: number;
}
