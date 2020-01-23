/**
 * Pattern module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../../Base";
import { Group } from "../Group";
import { AMElement } from "../AMElement";
import { Paper } from "../Paper";
import { ShapeRendering } from "../../defs/ShapeRendering";
import { List } from "../../utils/List";
import { Animation, IAnimatable, IAnimationOptions } from "../../utils/Animation";
import { Color } from "../../utils/Color";
import * as $type from "../../utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines available units to measure patterns.
 */
export declare type PatternUnits = "userSpaceOnUse" | "objectBoundingBox";
/**
 * Defines properties for [[Pattern]].
 */
export interface PatternProperties {
    x: number;
    y: number;
    width: number;
    height: number;
    backgroundOpacity: number;
    backgroundFill: Color;
    fillOpacity: number;
    fill: Color;
    stroke: Color;
    strokeOpacity: number;
    strokeWidth: number;
    shapeRendering: ShapeRendering;
    rotation: number;
    rotationX: number;
    rotationY: number;
    patternUnits: PatternUnits;
    strokeDashArray: string;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Base class to define patterns.
 */
export declare class Pattern extends BaseObject implements IAnimatable {
    /**
     * List of available animations currently running on a pattern.
     */
    protected _animations: $type.Optional<Array<Animation>>;
    /**
     * An SVG `<group>` element to put sub-elements into.
     */
    element: Group;
    /**
     * Reference to [[Paper]] instance.
     */
    protected _paper: $type.Optional<Paper>;
    /**
     * List of elements the pattern consists of.
     */
    protected _elements: List<AMElement>;
    /**
     * Defines property types.
     */
    _properties: PatternProperties;
    /**
     * A storage for Filter property/value pairs.
     *
     * @ignore Exclude from docs
     * @see {@link PatternProperties}
     */
    properties: this["_properties"];
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the pattern.
     */
    protected draw(): void;
    /**
     * Animate pattern properties.
     *
     * @see {@link Animation}
     * @param animationOptions  Animation options
     * @param duration          Duration (ms)
     * @param easing            Easing function
     * @return Animation instance
     */
    animate(animationOptions: IAnimationOptions[] | IAnimationOptions, duration: number, easing?: (value: number) => number): Animation;
    /**
     * Adds an element to the pattern.
     *
     * @param element  Element
     */
    addElement(element: AMElement): void;
    /**
     * Remove an element from the pattern.
     *
     * @param element  Element
     */
    removeElement(element: AMElement): void;
    /**
     * Returns the list of SVG elements comprising the pattern.
     *
     * @return Pattern elements
     */
    get elements(): List<AMElement>;
    /**
     * Pattern fill opacity. (0-1)
     *
     * @param value  Opacity (0-1)
     */
    set fillOpacity(value: number);
    /**
     * @return Opacity (0-1)
     */
    get fillOpacity(): number;
    /**
     * Fill color of the pattern.
     *
     * @param value  Fill color
     */
    set fill(value: Color);
    /**
     * @return Fill color
     */
    get fill(): Color;
    /**
     * Pattern background fill color.
     *
     * @param value  Background color
     */
    set backgroundFill(value: Color);
    /**
     * @return Background color
     */
    get backgroundFill(): Color;
    /**
     * Pattern backgorund opacity. (0-1)
     *
     * @param value  Background opacity (0-1)
     */
    set backgroundOpacity(value: number);
    /**
     * @return Background opacity (0-1)
     */
    get backgroundOpacity(): number;
    /**
     * Pattern stroke (border) color.
     *
     * @param value  Color
     */
    set stroke(value: Color);
    /**
     * @return Color
     */
    get stroke(): Color;
    /**
     * Pattern stroke opacity. (0-1)
     *
     * @param value  Opacity (0-1)
     */
    set strokeOpacity(value: number);
    /**
     * @return Opacity (0-1)
     */
    get strokeOpacity(): number;
    /**
     * Pattern stroke thickness in pixels.
     *
     * @param value  Stroke thickness (px)
     */
    set strokeWidth(value: number);
    /**
     * @return Stroke thickness (px)
     */
    get strokeWidth(): number;
    /**
     * Shape rendering
     * @param value [description]
     */
    set shapeRendering(value: ShapeRendering);
    get shapeRendering(): ShapeRendering;
    /**
     * Pattern rotation in degrees.
     *
     * @param value  Rotation
     */
    set rotation(value: number);
    /**
     * @return Rotation
     */
    get rotation(): number;
    /**
     * Pattern measuring units.
     *
     * Available options: "userSpaceOnUse" | "objectBoundingBox".
     *
     * @param value  Units
     */
    set patternUnits(value: "userSpaceOnUse" | "objectBoundingBox");
    /**
     * @return Units
     */
    get patternUnits(): "userSpaceOnUse" | "objectBoundingBox";
    /**
     * Pattern width in pixels.
     *
     * @param value  Width (px)
     */
    set width(value: number);
    /**
     * @return Width (px)
     */
    get width(): number;
    /**
     * Pattern height in pixels.
     *
     * @param value Height (px)
     */
    set height(value: number);
    /**
     * @return Height (px)
     */
    get height(): number;
    /**
     * X position. (pixels)
     *
     * @param value X (px)
     */
    set x(value: number);
    /**
     * @return X (px)
     */
    get x(): number;
    /**
     * Y position (px).
     *
     * @param value Y (px)
     */
    set y(value: number);
    /**
     * @return Y (px)
     */
    get y(): number;
    /**
     * [[Paper]] instance to draw pattern in.
     *
     * @ignore Exclude from docs
     * @param paper  Paper
     */
    set paper(paper: Paper);
    /**
     * @ignore Exclude from docs
     * @return Paper
     */
    get paper(): Paper;
    /**
     * Copies properties from another Pattern instance.
     *
     * @param source  Source pattern
     */
    copyFrom(source: this): void;
    /**
     * A list of animations currently running on the patter.
     *
     * @ignore Exclude from docs
     * @return Animation list
     */
    get animations(): Array<Animation>;
    /**
     * A `stroke-dasharray` for the stroke (outline).
     *
     * "Dasharray" allows setting rules to make lines dashed, dotted, etc.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray} for more info on `stroke-dasharray`
     * @param value  `stroke-dasharray`
     */
    set strokeDasharray(value: string);
    /**
     * @return `stroke-dasharray`
     */
    get strokeDasharray(): string;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
}
