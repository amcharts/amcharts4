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
     */
    dx: number;
    /**
     * Vertical offset in pixels.
     */
    dy: number;
    /**
     * Blur.
     */
    blur: number;
    /**
     * Shadow opacity. (0-1)
     */
    opacity: number;
    /**
     * Shadow color.
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
     */
    _properties: DropShadowFilterProperties;
    /**
     * A storage for Filter property/value pairs.
     *
     * @see [@link DropShadowFilterProperties]
     */
    /**
     * Reference to the `<feGaussianBlur>` element.
     *
     * @ignore Exclude from docs
     */
    feGaussianBlur: AMElement;
    /**
     * Reference to the `<feOffset>` element.
     *
     * @ignore Exclude from docs
     */
    feOffset: AMElement;
    /**
     * Reference to the `<feFlood>` element.
     *
     * @ignore Exclude from docs
     */
    feFlood: AMElement;
    /**
     * Reference to the `<feFlood>` element.
     *
     * @ignore Exclude from docs
     */
    feComposite: AMElement;
    /**
     * Reference to the `<feMerge>` element.
     *
     * @ignore Exclude from docs
     */
    feMerge: Group;
    /**
     * Constructor
     */
    constructor();
    /**
     * Shadow color.
     *
     * @param value  Color
     */
    set color(value: Color);
    /**
     * @return Color
     */
    get color(): Color;
    /**
     * Opacity of the shadow. (0-1)
     *
     * @param value  Opacity (0-1)
     */
    set opacity(value: number);
    /**
     * @return Opacity (0-1)
     */
    get opacity(): number;
    /**
     * Horizontal offset in pixels.
     *
     * @param value  Horizontal offset (px)
     */
    set dx(value: number);
    /**
     * @return Horizontal offset (px)
     */
    get dx(): number;
    /**
     * Vertical offset in pixels.
     *
     * @param value Vertical offset (px)
     */
    set dy(value: number);
    /**
     * @return Vertical offset (px)
     */
    get dy(): number;
    /**
     * Blur.
     *
     * @param value  Blur
     */
    set blur(value: number);
    /**
     * @return Blur
     */
    get blur(): number;
    /**
     * [updateScale description]
     *
     * @todo Description
     */
    protected updateScale(): void;
}
