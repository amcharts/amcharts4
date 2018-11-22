/**
 * Morpher module contains functionality that allows morphing one polygon to
 * another.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../Base";
import { IPoint } from "../defs/IPoint";
import { IRectangle } from "../defs/IRectangle";
import { IMorphable } from "../defs/IMorphable";
import { IAnimatable, Animation } from "../utils/Animation";
import * as $type from "../utils/Type";
/**
 * Morpher can be used to morph one polygon to some other polygon.
 */
export declare class Morpher extends BaseObject implements IAnimatable {
    /**
     * An element that will be a subject for morphing.
     *
     * @type {IMorphable}
     */
    morphable: IMorphable;
    /**
     * [_morphFromPointsReal description]
     *
     * @todo Description
     * @type {Optional<IPoint[][][]>}
     */
    protected _morphFromPointsReal: $type.Optional<IPoint[][][]>;
    /**
     * [_morphToPointsReal description]
     *
     * @todo Description
     * @type {Optional<IPoint[][][]>}
     */
    protected _morphToPointsReal: $type.Optional<IPoint[][][]>;
    /**
     * [_morphToPoints description]
     *
     * @todo Description
     * @type {Optional<IPoint[][][]>}
     */
    protected _morphToPoints: $type.Optional<IPoint[][][]>;
    /**
     * Morph progress (0-1)
     *
     * @type {Optional<number>}
     */
    protected _morphProgress: $type.Optional<number>;
    /**
     * List of animations currently running.
     *
     * @type {Optional<Array<Animation>>}
     */
    protected _animations: $type.Optional<Array<Animation>>;
    /**
     * A storage for measurements.
     *
     * @type {IRectangle[]}
     */
    protected _bboxes: IRectangle[];
    /**
     * Duration of the morphing animation in milliseconds.
     *
     * @type {number}
     */
    morphDuration: number;
    /**
     * An easing function to use for morphing animation.
     *
     * @see {@link Ease}
     * @type {Function}
     */
    morphEasing: (value: number) => number;
    /**
     * If set to `true`, all separate parts of the multi-part polygon will
     * morph into a single circle or polygon when using built-in methods
     * `morphToCircle()` or `morphToPolygon()`.
     *
     * Otherwise each separate part of polygon will morph to individual target
     * circle or polgyon.
     *
     * @type {boolean}
     */
    morphToSingle: boolean;
    /**
     * A ratio to scale morphed object in relation to the source object.
     *
     * @type {number}
     */
    scaleRatio: number;
    /**
     * Constructor.
     *
     * @param {IMorphable} morphable An object to morph
     */
    constructor(morphable: IMorphable);
    /**
     * Morphs a polygon to another polygon.
     *
     * @param {IPoint[][][]}        toPoints  Corner points of the target shape
     * @param {number}              duration  Duration in milliseconds
     * @param {(number) => number}  easing    Easing function
     * @return {Animation}                    Animation
     */
    morphToPolygon(toPoints: IPoint[][][], duration?: number, easing?: (value: number) => number): Animation;
    /**
     * [normalizePoints description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {IPoint[][][]}  pointsA  Point A
     * @param  {IPoint[][][]}  pointsB  Point B
     * @return {IPoint[]}               Normalized points
     */
    normalizePoints(pointsA: IPoint[][][], pointsB: IPoint[][][]): IPoint[][][];
    /**
     * [sortPoints description]
     *
     * @ignore Exclude from doc
     * @todo Description
     * @param {IPoint[][][]}  points  [description]
     * @return                        common bbox of points
     */
    sortPoints(points: IPoint[][][]): $type.Optional<IRectangle>;
    /**
     * Morphs polygon to a circle (it is actually a polygon which makes a circle).
     *
     * @param  {number}              radius    Target circle radius (px)
     * @param  {number}              duration  Duration (ms)
     * @param  {(number) => number}  easing    Easing function
     * @return {Animation}                     Animation
     */
    morphToCircle(radius?: number, duration?: number, easing?: (value: number) => number): Animation;
    /**
     * [addPoints description]
     *
     * @ignore Exclude from doc
     * @todo Description
     * @param  {IPoint[]}  points         [description]
     * @param  {number}    mustHaveCount  [description]
     * @return {IPoint[]}                 [description]
     */
    addPoints(points: IPoint[], mustHaveCount: number): IPoint[];
    /**
     * Morphs polygon into a rectangular polygon.
     *
     * @param  {number}              width     Width of the target rectangle (px)
     * @param  {number}              height    Height of the target rectangle (px)
     * @param  {number}              duration  Duration (ms)
     * @param  {(number) => number}  easing    Easing function
     * @return {Animation}                     Animation
     */
    morphToRectangle(width?: number, height?: number, duration?: number, easing?: (value: number) => number): Animation;
    /**
     * Returns the progress of morph transition.
     *
     * @return {Optional<number>} Progress (0-1)
     */
    /**
     * Progress of the morph transition.
     *
     * Setting this will also trigger actual transformation.
     *
     * @param {number}  value  Progress (0-1)
     */
    morphProgress: $type.Optional<number>;
    /**
     * Restores the polygon to its original appearance.
     *
     * @param {number}              duration  Duration (ms)
     * @param {(number) => number}  easing    Easing function
     * @return {Animation}                    Animation
     */
    morphBack(duration?: number, easing?: (value: number) => number): Animation;
    /**
     * Returns a list of morph animations currently being played.
     *
     * @return {Array<Animation>} List of animations
     */
    readonly animations: Array<Animation>;
}
