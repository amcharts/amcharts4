/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Pattern } from "./Pattern";
import { AMElement } from "../AMElement";
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
     * Constructor
     */
    constructor();
    /**
     * Draws the pattern.
     */
    protected draw(): void;
}
