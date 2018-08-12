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
 *
 * @type {string}
 */
export declare type PatternUnits = "userSpaceOnUse" | "objectBoundingBox";
/**
 * Defines properties for [[Pattern]].
 *
 * @type {string}
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
    patternUnits: PatternUnits;
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
     *
     * @type {Optional<Array<Animation>>}
     */
    protected _animations: $type.Optional<Array<Animation>>;
    /**
     * An SVG `<group>` element to put sub-elements into.
     *
     * @type {Group}
     */
    element: Group;
    /**
     * Reference to [[Paper]] instance.
     *
     * @type {Optional<Paper>}
     */
    protected _paper: $type.Optional<Paper>;
    /**
     * List of elements the pattern consists of.
     *
     * @type {List<AMElement>}
     */
    protected _elements: List<AMElement>;
    /**
     * Defines property types.
     *
     * @ignore Exclude from docs
     * @type {FilterProperties}
     */
    _properties: PatternProperties;
    /**
     * A storage for Filter property/value pairs.
     *
     * @ignore Exclude from docs
     * @see {@link PatternProperties}
     * @type {PatternProperties}
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
     * @param  {IAnimationOptions[] | IAnimationOptions}  animationOptions  Animation options
     * @param  {number}                                   duration          Duration (ms)
     * @param  {(number) => number}                       easing            Easing function
     * @return {Animation}                                                  Animation instance
     */
    animate(animationOptions: IAnimationOptions[] | IAnimationOptions, duration: number, easing?: (value: number) => number): Animation;
    /**
     * Adds an element to the pattern.
     *
     * @param {AMElement}  element  Element
     */
    addElement(element: AMElement): void;
    /**
     * Remove an element from the pattern.
     *
     * @param {AMElement}  element  Element
     */
    removeElement(element: AMElement): void;
    /**
     * Returns the list of SVG elements comprising the pattern.
     *
     * @return {List<AMElement>} Pattern elements
     */
    readonly elements: List<AMElement>;
    /**
     * @return {number} Opacity (0-1)
     */
    /**
     * Pattern fill opacity. (0-1)
     *
     * @param {number}  value  Opacity (0-1)
     */
    fillOpacity: number;
    /**
     * @return {Color} Fill color
     */
    /**
     * Fill color of the pattern.
     *
     * @param {Color}  value  Fill color
     */
    fill: Color;
    /**
     * @return {Color} Background color
     */
    /**
     * Pattern background fill color.
     *
     * @param {Color}  value  Background color
     */
    backgroundFill: Color;
    /**
     * @return {number} Background opacity (0-1)
     */
    /**
     * Pattern backgorund opacity. (0-1)
     *
     * @param {number}  value  Background opacity (0-1)
     */
    backgroundOpacity: number;
    /**
     * @return {Color} Color
     */
    /**
     * Pattern stroke (border) color.
     *
     * @param {Color}  value  Color
     */
    stroke: Color;
    /**
     * @return {number} Opacity (0-1)
     */
    /**
     * Pattern stroke opacity. (0-1)
     *
     * @param {number}  value  Opacity (0-1)
     */
    strokeOpacity: number;
    /**
     * @return {number} Stroke thickness (px)
     */
    /**
     * Pattern stroke thickness in pixels.
     *
     * @param {number}  value  Stroke thickness (px)
     */
    strokeWidth: number;
    /**
     * Shape rendering
     * @param {ShapeRendering} value [description]
     */
    shapeRendering: ShapeRendering;
    /**
     * @return {number} Rotation
     */
    /**
     * Pattern rotation in degrees.
     *
     * @param {number}  value  Rotation
     */
    rotation: number;
    /**
     * @return {"userSpaceOnUse" | "objectBoundingBox"} Units
     */
    /**
     * Pattern measuring units.
     *
     * Available options: "userSpaceOnUse" | "objectBoundingBox".
     *
     * @param {"userSpaceOnUse" | "objectBoundingBox"}  value  Units
     */
    patternUnits: "userSpaceOnUse" | "objectBoundingBox";
    /**
     * @return {number} Width (px)
     */
    /**
     * Pattern width in pixels.
     *
     * @param {number}  value  Width (px)
     */
    width: number;
    /**
     * @return {number} Height (px)
     */
    /**
     * Pattern height in pixels.
     *
     * @param {number} value Height (px)
     */
    height: number;
    /**
     * @return {number} X (px)
     */
    /**
     * X position. (pixels)
     *
     * @param {number} value X (px)
     */
    x: number;
    /**
     * @return {number} Y (px)
     */
    /**
     * Y position (px).
     *
     * @param {number} value Y (px)
     */
    y: number;
    /**
     * @ignore Exclude from docs
     * @return {Paper} Paper
     */
    /**
     * [[Paper]] instance to draw pattern in.
     *
     * @ignore Exclude from docs
     * @param {Paper}  paper  Paper
     */
    paper: Paper;
    /**
     * Copies properties from another Pattern instance.
     *
     * @param {this}  source  Source pattern
     */
    copyFrom(source: this): void;
    /**
     * A list of animations currently running on the patter.
     *
     * @ignore Exclude from docs
     * @return {Array<Animation>} Animation list
     */
    readonly animations: Array<Animation>;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
}
