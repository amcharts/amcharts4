/**
 * This module contains a version of ColorSet that can (and should) be used for
 * coloring UI elements.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../Base";
import { Color } from "./Color";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines available color purposes and their relation with the color set color
 * index.
 */
export interface ColorPurpose {
    stroke: Color;
    fill: Color;
    primaryButton: Color;
    primaryButtonHover: Color;
    primaryButtonDown: Color;
    primaryButtonActive: Color;
    primaryButtonText: Color;
    primaryButtonStroke: Color;
    secondaryButton: Color;
    secondaryButtonHover: Color;
    secondaryButtonDown: Color;
    secondaryButtonActive: Color;
    secondaryButtonText: Color;
    secondaryButtonStroke: Color;
    grid: Color;
    background: Color;
    alternativeBackground: Color;
    text: Color;
    alternativeText: Color;
    disabledBackground: Color;
    positive: Color;
    negative: Color;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This module contains a version of ColorSet that can (and should) be used for
 * coloring UI elements.
 *
 * The main difference from the basic [[ColorSet]] is that instead of sequenced
 * colors, it uses a concept of named colors.
 *
 * This way, every element in the UI can extract an exact color theme author
 * meant for the specific purpose, like strokes, backgrounds, etc.
 */
export declare class InterfaceColorSet extends BaseObject {
    /**
     * Maps the list of purposes (like "stroke") to an index of color of the
     * color set.
     */
    protected _purposes: ColorPurpose;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a color to be used for the specific purpose.
     *
     * ```TypeScript
     * let uicolors = new am4core.InterfaceColorSet();
     * console.log(uicolors.getFor("stroke"));
     * ```
     * ```JavaScript
     * var uicolors = new am4core.InterfaceColorSet();
     * console.log(uicolors.getFor("stroke"));
     * ```
     *
     * @param  {keyof ColorPurpose}  purpose  Color use purpuse
     * @return {Color}                        Color
     */
    getFor(purpose: keyof ColorPurpose): Color;
    /**
     * Sets color to be used for the specific purpose.
     *
     * @param {keyof ColorPurpose}  purpose  Color use purpose
     * @param {Color}               color    Color
     */
    setFor(purpose: keyof ColorPurpose, color: Color): void;
}
