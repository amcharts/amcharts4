/**
 * Contains code and logic for generating radial gradients.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../../Base";
import { List } from "../../utils/List";
import { Group } from "../Group";
import { Paper } from "../Paper";
import { IGradientStop } from "./LinearGradient";
import { Color } from "../../utils/Color";
import { Percent } from "../../utils/Percent";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Radial gradient class.
 */
export declare class RadialGradient extends BaseObject {
    /**
     * List of colors switch definitions in a gradient.
     *
     * @type {List<IGradientStop>}
     */
    protected _stops: List<IGradientStop>;
    /**
     * An SVG `<group>` element used to draw gradient.
     *
     * @ignore Exclude from docs
     * @type {Group}
     */
    element: Group;
    /**
     * Reference to Paper to add element to.
     *
     * @type {Paper}
     */
    protected _paper: Paper;
    /**
     * A center x coordinate for the radial gradient, can be set in pixels or as Percent
     *
     * @type { number | Percent}
     */
    protected _cx: number | Percent;
    /**
     * A center y coordinate for the radial gradient, can be set in pixels or as Percent
     *
     * @type { number | Percent }
     */
    protected _cy: number | Percent;
    /**
     * A y coordinate of the focal point of a gradient, can be set in pixels or as Percent
     *
     * @type { number | Percent}
     */
    protected _fx: number | Percent;
    /**
     * A y coordinate of the focal point of a gradient, can be set in pixels or as Percent
     *
     * @type { number | Percent }
     */
    protected _fy: number | Percent;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws gradient.
     */
    protected draw(): void;
    /**
     * Adds a color step to the gradient.
     *
     * @param {Color}   color    Color (hex code or named color)
     * @param {number}  opacity  Opacity (value from 0 to 1; 0 completely transaprent, 1 fully opaque)
     * @param {number}  offset   Position of color in the gradient (value 0 to 1; 0 meaning start of the gradient and 1 end)
     */
    addColor(color: Color, opacity?: number, offset?: number): void;
    /**
     * @ignore Exclude from docs
     * @return {Paper} Paper
     */
    /**
     * A [[Paper]] instace to use for the gradient.
     *
     * @ignore Exclude from docs
     * @param {Paper}  paper  Paper
     */
    paper: Paper;
    /**
     * Center x coordinate of the gradient, can be set as number or Percent
     *
     * @param {number | Percent}  point  Center point
     */
    cx: number | Percent;
    /**
     * Center y coordinate of the gradient, can be set as number or Percent
     *
     * @param {number | Percent}  point  Center point
     */
    cy: number | Percent;
    /**
     * y coordinate of the focal point of a gradient, can be set in pixels or as Percent
     *
     * @param {number | Percent}  point  Center point
     */
    fx: number | Percent;
    /**
     * y coordinate of the focal point of a gradient, can be set in pixels or as Percent
     *
     * @param {number | Percent}  point  Center point
     */
    fy: number | Percent;
    copyFrom(source: this): void;
    /**
     * A list of color stops in the gradient.
     *
     * @return {List<IGradientStop>} Stops
     */
    readonly stops: List<IGradientStop>;
}
