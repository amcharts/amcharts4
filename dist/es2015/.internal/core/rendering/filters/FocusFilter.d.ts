/**
 * Module for "Focus" filter.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../../Sprite";
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
 * Defines additional properties relative to the "Focus" filter.
 */
export interface FocusFilterProperties extends FilterProperties {
    /**
     * Opacity of the outline. (0-1)
     *
     * @type {number}
     */
    opacity?: number;
    /**
     * Stroke (outline) color.
     *
     * @type {Color}
     */
    stroke?: Color;
    /**
     * Stroke (outline) thickness in pixels.
     *
     * @type {number}
     */
    strokeWidth?: number;
    /**
     * Stroke (outline) opacity. (0-1)
     *
     * @type {number}
     */
    strokeOpacity?: number;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a "Focus" filter.
 */
export declare class FocusFilter extends Filter {
    /**
     * Defines property types.
     *
     * @ignore Exclude from docs
     * @type {FocusFilterProperties}
     */
    _properties: FocusFilterProperties;
    /**
     * A storage for Filter property/value pairs.
     * @see [@link FocusFilterProperties]
     * @type {Dictionary<FocusFilterProperties, any>}
     */
    /**
     * Reference to the `<feFlood>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feFlood: AMElement;
    /**
     * Reference to the `<feMorphology>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feMorphology: AMElement;
    /**
     * Reference to the `<feFlood>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feColorMatrix: AMElement;
    /**
     * Reference to the `<feComposite>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feComposite: AMElement;
    /**
     * Reference to the `<feFlood>` element.
     *
     * @ignore Exclude from docs
     * @type {AMElement}
     */
    feBlend: AMElement;
    /**
     * Constructor
     * * Creates primitve (effect) elements
     * * Sets default properties
     */
    constructor();
    /**
     * @return {Optional<Color>} Color
     */
    /**
     * Stroke (outline) color.
     *
     * @param {Color}  value  Color
     */
    stroke: $type.Optional<Color>;
    /**
     * @return {number} Outline thickness (px)
     */
    /**
     * Stroke (outline) thickness in pixels.
     *
     * @param {number}  value  Outline thickness (px)
     */
    strokeWidth: $type.Optional<number>;
    /**
     * @return {number} Outline opacity (0-1)
     */
    /**
     * Opacity of the outline. (0-1)
     *
     * @param {number}  value  Outline opacity (0-1)
     */
    opacity: $type.Optional<number>;
    /**
     * Sets filter's target element.
     *
     * In addition it also disables built-in focus outline on element this
     * filter is applied to.
     *
     * @ignore Exclude from docs
     * @param {Sprite}  value  Element filter is being attached to
     */
    protected setSprite(value: Sprite): void;
}
