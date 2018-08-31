/**
 * Functionality related to inertia
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../Base";
import { InteractionObject } from "./InteractionObject";
import { Animation, IAnimatable } from "../utils/Animation";
import { IPoint } from "../defs/IPoint";
/**
 * Defines a list of available inertia types.
 *
 * @type {string}
 */
export declare type InertiaTypes = "move" | "resize" | "rotate";
/**
 * A point of inertia is to simulate gradually drecreasing motion even after
 * actual interaction by user, that caused it, has already ended.
 *
 * [[Inertia]] object will continue triggering the same [[Sprite]] handlers
 * as if the interaction was still happening, gradually reducing
 * shift/angle/scale values until full stop.
 *
 * Basically, from the target element's point of view, while inertia is
 * playing, it is still being interacted with by user, albeit with a
 * decreasing speed.
 */
export declare class Inertia extends BaseObject implements IAnimatable {
    /**
     * Holds what type of inertia it is.
     *
     * @type {InertiaTypes}
     */
    type: InertiaTypes;
    /**
     * An element we're performing animation on.
     *
     * @type {InteractionObject}
     */
    interaction: InteractionObject;
    /**
     * Starting pointer position. The position of pointer when we "released"
     * the element.
     *
     * @type {IPoint}
     */
    startPoint: IPoint;
    /**
     * Current (simulated) pointer position.
     *
     * @type {IPoint}
     */
    point: IPoint;
    /**
     * List of animations currently playing.
     *
     * @type {List<Animation>}
     */
    animations: Array<Animation>;
    /**
     * Constructor
     */
    constructor(interaction: InteractionObject, type: InertiaTypes, point: IPoint, startPoint: IPoint);
    /**
     * Returns current X coordinate.
     *
     * @return {number} X
     */
    /**
     * Sets current X coordinate.
     *
     * Will trigger "drag" event for the target element.
     *
     * @param {number} value X
     */
    x: number;
    /**
     * Returns current Y coordinate.
     *
     * @return {number} Y
     */
    /**
     * Sets current Y coordinate.
     *
     * Will trigger "drag" event for the target element.
     *
     * @param {number} value Y
     */
    y: number;
    /**
     * Simulates dragging of element.
     */
    handleMove(): void;
    /**
     * Sets current angle.
     *
     * Will trigger "rotate" event on a target element.
     *
     * @param {number} value Angle
     */
    rotation: number;
    /**
     * Finishes up the inertia animation. (removes reference to this animation
     * object)
     */
    done(): void;
}
