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
import { IPoint } from "../../defs/IPoint";
import { Color } from "../../utils/Color";
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
     * A center coordinates for the radial gradient.
     *
     * @type {IPoint}
     */
    protected _center: IPoint;
    /**
     * Focal point coordinates.
     *
     * @type {IPoint}
     */
    protected _focalPoint: IPoint;
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
     * Center coordinates of the gradient.
     *
     * @ignore Exclude from docs
     * @param {IPoint}  point  Center point
     */
    center: IPoint;
    /**
     * Focal point coordinates of the gradient.
     *
     * @ignore Exclude from docs
     * @param {IPoint}  point  Focal point
     */
    focalPoint: IPoint;
}
