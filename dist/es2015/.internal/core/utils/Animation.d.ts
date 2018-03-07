/**
 * Animation module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents, IBaseObjectEvents } from "../Base";
import { List } from "../utils/List";
import { EventDispatcher, AMEvent } from "../utils/EventDispatcher";
import { IDisposer } from "../utils/Disposer";
import { Color } from "../utils/Color";
import { Percent } from "../utils/Percent";
import * as $type from "../utils/Type";
/**
 * Defines interface for animation objects.
 *
 * Should at least contain `update()` method.
 */
export interface IAnimationObject {
    update: () => void;
}
/**
 * Defines interface for objects that can be animated
 */
export interface IAnimatable {
    animations: List<Animation>;
}
/**
 * Defines interface for animation options.
 */
export interface IAnimationOptions {
    /**
     * An initial value to animate from.
     *
     * If omitted, the source value will be current value.
     *
     * @type {Color | Percent | number | string | boolean}
     */
    from?: Color | Percent | number | string | boolean;
    /**
     * A target value to animate from.
     *
     * @type {Color | Percent | number | string | boolean}
     */
    to: Color | Percent | number | string | boolean;
    /**
     * Property name to animate.
     *
     * @type {string}
     */
    property?: any;
    /**
     * If current values should be taken from different object than the target
     * element of the animation, this property should be set to that object.
     *
     * @type {object}
     */
    childObject?: {
        [index: string]: any;
    };
    /**
     * A method/function reference that will be called to for updating the
     * property value.
     *
     * @type {function}
     */
    updateMethod?: (options: IAnimationOptions | IPercentAnimationOptions | IColorAnimationOptions, progress: number) => string | number | Color | Percent;
}
/**
 * An interface for an object defining [[Percent]] animation.
 */
export interface IPercentAnimationOptions extends IAnimationOptions {
    /**
     * Initial value.
     *
     * @type {Percent}
     */
    from?: Percent;
    /**
     * Target value.
     *
     * @type {Percent}
     */
    to: Percent;
}
/**
 * An interface for an object defining [[Color]] animation.
 */
export interface IColorAnimationOptions extends IAnimationOptions {
    /**
     * Initial value.
     *
     * @type {Color}
     */
    from?: Color;
    /**
     * Target value.
     *
     * @type {Color}
     */
    to: Color;
}
/**
 * Calls a `callback` function for the `duration` of milliseconds.
 *
 * @todo Needed?
 * @deprecated Not used anywhere
 * @ignore Exclude from docs
 * @param  {number}     duration  Duration (ms)
 * @param  {function}   callback  Callback function
 * @return {IDisposer}            Disposer
 */
export declare function animate(duration: number, callback: (time: number) => void): IDisposer;
/**
 * Defines events for [[Animation]].
 */
export interface IAnimationEvents extends IBaseObjectEvents {
    /**
     * Invoked when animation starts playing.
     */
    animationstart: {
        progress: number;
    };
    /**
     * Invoked when animation finishes playing.
     */
    animationend: {
        progress: number;
    };
    /**
     * Invoked when animation makes progress.
     */
    animationprogress: {
        progress: number;
    };
    /**
     * Invoked when animation is stopped by some other process, before it had
     * a chance to finish.
     */
    animationstop: {
        progress: number;
    };
}
/**
 * Holds the list of currently playing animations.
 *
 * @ignore Exclude from docs
 * @type {Array<IAnimationObject>}
 */
export declare const animations: Array<IAnimationObject>;
/**
 * Animation can be used to transition certain properties on an object that
 * implements [[IAnimatable]] interface.
 *
 * @see {@link IAnimationEvents} for a list of available events
 */
export declare class Animation extends BaseObjectEvents implements IAnimationObject {
    /**
     * Event dispatcher.
     *
     * @type {EventDispatcher<AMEvent<Animation, IAnimationEvents>>}
     */
    events: EventDispatcher<AMEvent<Animation, IAnimationEvents>>;
    /**
     * An animation target object. [[Animation]] will update properties of
     * this object.
     *
     * @type {IAnimatable}
     */
    object: IAnimatable;
    /**
     * An array of animation option objects. Each animation object represent
     * one property. Animation can animate any number of properties
     * simultaneously.
     *
     * @type {IAnimationOptions[]}
     */
    animationOptions: IAnimationOptions[];
    /**
     * Duration of the animation in milliseconds.
     *
     * @type {number}
     */
    duration: number;
    /**
     * Easing function to use.
     *
     * @see {@link Ease}
     * @type {(value: number) => number}
     */
    easing: (value: number) => number;
    /**
     * Contains progress of the current animation: 0 (start) to 1 (end).
     *
     * @type {Optional<number>}
     */
    progress: $type.Optional<number>;
    /**
     * Is this a frame-based animation?
     *
     * If the animation is frame-based, Animation will ensure that every frame
     * is played, regardless of time.
     *
     * If the animation is non-frame-based, it will play exactly the time set in
     * [[duration]].
     *
     * @type {boolean}
     */
    frameBased: boolean;
    /**
     * A list of options that cannot be animated. Those will be applied when
     * Animation ends.
     *
     * @type {IAnimationOptions[]}
     */
    protected staticOptions: IAnimationOptions[];
    /**
     * Indicated how many times animation should loop.
     *
     * @type {number}
     */
    protected _loop: number;
    /**
     * Animation duration in frames.
     *
     * @type {number}
     */
    protected _frames: number;
    /**
     * Current frame.
     *
     * @type {number}
     */
    protected _frame: $type.Optional<number>;
    /**
     * Animation is paused.
     *
     * @type {boolean}
     */
    protected _pause: boolean;
    /**
     * Holds reference to timeout for delayed play.
     *
     * @type {IDisposer}
     */
    protected _delayTimeout: $type.Optional<IDisposer>;
    /**
     * A timestamp of when animation started playing.
     *
     * @type {number}
     */
    protected _startTime: $type.Optional<number>;
    /**
     * Elapsed time in currently playing animation.
     *
     * @type {number}
     */
    protected _time: $type.Optional<number>;
    /**
     * Constructor
     *
     * @param {IAnimatable}                              object            An object animation should run on
     * @param {IAnimationOptions[] | IAnimationOptions}  animationOptions  One or several (array) of animation options
     * @param {number}                                   duration          Duration (ms)
     * @param {(number) => number}                       easing            Easing function
     */
    constructor(object: IAnimatable, animationOptions: IAnimationOptions[] | IAnimationOptions, duration: number, easing?: (value: number) => number);
    /**
     * Disposes this object, clears up after itself.
     */
    dispose(): void;
    /**
     * Delays animation start by X milliseconds.
     *
     * @param  {number}     delay  Delay (ms)
     * @return {Animation}         Animation
     */
    delay(delay: number): Animation;
    /**
     * Starts animation.
     *
     * @return {Animation} Animation
     */
    start(): Animation;
    /**
     * Sets loop count for the animation. If parameter is not a valid number the
     * animation will keep on looping indefinitely.
     *
     * @param  {number}     count  Number of times to loop animation
     * @return {Animation}         Animation
     */
    loop(count?: number): Animation;
    /**
     * Pauses animation.
     *
     * @return {Animation} Animation
     */
    pause(): Animation;
    /**
     * Resumes paused animation.
     *
     * @return {Animation} Animation
     */
    resume(): Animation;
    /**
     * Jumps to animation end. If animation is set to loop, this will start
     * another round of animation from start.
     *
     * @return {Animation} Animation
     */
    end(): Animation;
    /**
     * Applies static options that can't be animated.
     */
    protected applyStaticOptions(): void;
    /**
     * Stops animation.
     *
     * When animation is stopped, the properties of the target object will remain
     * where they were at the moment when `stop()` was called.
     *
     * @param  {boolean}    skipEvent  Do not trigger `animationstop` event
     * @return {Animation}             Animation
     */
    stop(skipEvent?: boolean): Animation;
    /**
     * Returns numeric value accoring to progress between start and end values.
     *
     * @param  {IAnimationOptions}  options   Option
     * @param  {number}             progress  Progress (0-1)
     * @return {number}                       Value according to progress
     */
    protected getProgressNumber(options: IAnimationOptions, progress: number): number;
    /**
     * Returns [[Percent]] value accoring to progress between start and end
     * values.
     *
     * @param  {IPercentAnimationOptions}  options   Option
     * @param  {number}                    progress  Progress (0-1)
     * @return {number}                              Value according to progress
     */
    protected getProgressPercent(options: IPercentAnimationOptions, progress: number): Percent;
    /**
     * Returns color value accoring to progress between start and end values.
     *
     * @param  {IAnimationOptions}  options   Option
     * @param  {number}             progress  Progress (0-1)
     * @return {string}                       Color according to progress
     */
    protected getProgressColor(options: IColorAnimationOptions, progress: number): Color;
    /**
     * Sets current progress and updates object's numeric and color values.
     *
     * @param {number} progress Progress (0-1)
     */
    setProgress(progress: number): void;
    /**
     * Tracks and sets progress according to time or frames.
     *
     * @ignore Exclude from docs
     * @return {Animation} Animation
     */
    update(): Animation;
    /**
     * Returns `true` if this animation is delayed.
     *
     * @readonly
     * @return {boolean} [description]
     */
    readonly delayed: boolean;
    /**
     * Checks other animations currently running on the same object and removes
     * overlapping options from those other animations that are contained in
     * this animation.
     *
     * This is needed to ensure that no two confurent animations step on each
     * other's toes by trying to animate the same property.
     */
    private stopSameAnimations();
    /**
     * [getHybridProperty description]
     *
     * @todo Description
     * @param  {string}     property [description]
     * @param  {"pixel" |        "relative"}  type [description]
     * @return {string}              [description]
     */
    private getHybridProperty(property, type);
}
