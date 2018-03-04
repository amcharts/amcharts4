/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../../Base";
import { LinearGradient } from "./LinearGradient";
import { RadialGradient } from "./RadialGradient";
import { Color } from "../../utils/Color";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for color modifiers.
 *
 * @ignore Exclude from docs
 */
export declare class ColorModifier extends BaseObject {
    /**
     * Constructor
     */
    constructor();
    /**
     * Modifies color value.
     *
     * @ignore Exclude from docs
     * @param  {Color}  value  Original color
     * @return {Color}         Modified
     */
    modify(value: Color): Color | LinearGradient | RadialGradient;
}
