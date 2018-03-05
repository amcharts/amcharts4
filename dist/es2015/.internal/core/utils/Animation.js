/**
 * Animation module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents } from "../Base";
import { EventDispatcher } from "../utils/EventDispatcher";
import { SVGDefaults } from "../defs/SVGDefaults";
import { Disposer } from "../utils/Disposer";
import { system } from "../System";
import { Color } from "../utils/Color";
import { Percent, percent } from "../utils/Percent";
import * as $async from "../utils/AsyncPending";
import * as $ease from "../utils/Ease";
import * as $colors from "../utils/Colors";
import * as $math from "../utils/Math";
import * as $array from "../utils/Array";
import * as $iter from "../utils/Iterator";
import * as $type from "../utils/Type";
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
export function animate(duration, callback) {
    var disposed = false;
    // TODO use performance.now() ?
    var startTime = Date.now();
    function loop(now) {
        if (!disposed) {
            var diff = now - startTime;
            if (diff >= duration) {
                callback(1);
            }
            else {
                $async.nextFrame(loop);
                callback(diff / duration);
            }
        }
    }
    $async.nextFrame(loop);
    return new Disposer(function () {
        disposed = true;
    });
}
/**
 * Tween class.
 *
 * @todo Needed?
 * @deprecated Not used anywhere
 * @ignore Exclude from docs
 */
var Tween = /** @class */ (function (_super) {
    __extends(Tween, _super);
    function Tween(duration, callback) {
        var _this = _super.call(this, function () {
            _this._stop();
        }) || this;
        _this._from = 0;
        _this._to = 0;
        _this._playing = true;
        _this._disposer = null;
        _this._duration = duration;
        _this._callback = callback;
        return _this;
    }
    Tween.prototype._stop = function () {
        var f = this._disposer;
        if ($type.hasValue(f)) {
            this._disposer = null;
            f.dispose();
        }
    };
    Tween.prototype._start = function () {
        var _this = this;
        if (!this.isDisposed()) {
            var start_1 = this._from;
            var end_1 = this._to;
            if (start_1 !== end_1) {
                if (this._duration === 0) {
                    this._from = end_1;
                    this._callback(end_1);
                }
                else {
                    this._callback(start_1);
                    this._disposer = animate(Math.abs(end_1 - start_1) * this._duration, function (t) {
                        _this._callback((_this._from = $math.stretch(t, start_1, end_1)));
                    });
                }
            }
        }
    };
    Tween.prototype.pause = function () {
        if (this._playing) {
            this._playing = false;
            this._stop();
        }
    };
    Tween.prototype.play = function () {
        if (!this._playing) {
            this._playing = true;
            this._start();
        }
    };
    Tween.prototype.jumpTo = function (to) {
        this._stop();
        this._from = to;
        this._to = to;
        if (!this.isDisposed()) {
            // TODO don't call the callback if it's paused ?
            this._callback(to);
        }
    };
    Tween.prototype.tweenTo = function (to) {
        this._stop();
        this._to = to;
        if (this._playing) {
            this._start();
        }
    };
    return Tween;
}(Disposer));
/**
 * Holds the list of currently playing animations.
 *
 * @ignore Exclude from docs
 * @type {Array<IAnimationObject>}
 */
export var animations = [];
/**
 * Animation can be used to transition certain properties on an object that
 * implements [[IAnimatable]] interface.
 *
 * @see {@link IAnimationEvents} for a list of available events
 */
var Animation = /** @class */ (function (_super) {
    __extends(Animation, _super);
    /**
     * Constructor
     *
     * @param {IAnimatable}                              object            An object animation should run on
     * @param {IAnimationOptions[] | IAnimationOptions}  animationOptions  One or several (array) of animation options
     * @param {number}                                   duration          Duration (ms)
     * @param {(number) => number}                       easing            Easing function
     */
    function Animation(object, animationOptions, duration, easing) {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Event dispatcher.
         *
         * @type {EventDispatcher<AMEvent<Animation, IAnimationEvents>>}
         */
        _this.events = new EventDispatcher();
        /**
         * Duration of the animation in milliseconds.
         *
         * @type {number}
         */
        _this.duration = 0;
        /**
         * Easing function to use.
         *
         * @see {@link Ease}
         * @type {(value: number) => number}
         */
        _this.easing = $ease.linear;
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
        _this.frameBased = false;
        /**
         * Indicated how many times animation should loop.
         *
         * @type {number}
         */
        _this._loop = 0;
        /**
         * Animation duration in frames.
         *
         * @type {number}
         */
        _this._frames = 0;
        /**
         * Animation is paused.
         *
         * @type {boolean}
         */
        _this._pause = false;
        _this.className = "Animation";
        // Set parameters
        _this.object = object;
        _this.animationOptions = $array.toArray(animationOptions);
        _this.duration = duration;
        if (easing) {
            _this.easing = easing;
        }
        // Run check if there are already animations playing on the same properties
        // and stop them - the last animation takes precedence
        //this.stopSameAnimations();
        // Register this animation in object's `animations` list
        object.animations.moveValue(_this);
        /*if ($type.hasValue(callback)) {
            // TODO don't use .call
            this.events.on("animationend", callback, object);
        }*/
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Disposes this object, clears up after itself.
     */
    Animation.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.pause();
        this.object.animations.removeValue(this);
        $array.remove(animations, this);
    };
    /**
     * Delays animation start by X milliseconds.
     *
     * @param  {number}     delay  Delay (ms)
     * @return {Animation}         Animation
     */
    Animation.prototype.delay = function (delay) {
        //@todo Maybe not use `bind()`
        if (delay > 0) {
            this._pause = true;
            this._delayTimeout = this.setTimeout(this.start.bind(this), delay);
        }
        return this;
    };
    /**
     * Starts animation.
     *
     * @return {Animation} Animation
     */
    Animation.prototype.start = function () {
        // Clear delay timeout if there was one
        if (this._delayTimeout) {
            this.removeDispose(this._delayTimeout);
            this._delayTimeout = null;
        }
        // Run check if there are already animations playing on the same properties
        // and stop them - the last animation takes precedence
        this.stopSameAnimations();
        // Reset counters
        this._pause = false;
        this._frame = 1;
        this._frames = system.frameRate * this.duration / 1000;
        this._startTime = Date.now();
        this._time = 0;
        this.staticOptions = [];
        // Process initial property values
        for (var i = this.animationOptions.length - 1; i >= 0; i--) {
            var options = this.animationOptions[i];
            if (!$type.hasValue(options.from)) {
                if (options.childObject) {
                    options.from = options.childObject[options.property];
                }
                else {
                    options.from = this.object[options.property];
                    if (!$type.hasValue(options.from)) {
                        options.from = SVGDefaults[options.property];
                    }
                }
                /*if (!$type.hasValue(options.from)) {
                    throw Error("Could not get initial transition value.");
                }*/
            }
            if (options.from == options.to) {
                $array.remove(this.animationOptions, options);
            }
            else {
                // Use different update methods for different value types
                if ($type.isNumber(options.to)) {
                    // Numeric value
                    options.updateMethod = this.getProgressNumber;
                    // Check if initial value is not Percent
                    if (options.from instanceof Percent) {
                        // It is. Let's convert it to pixel value
                        // @todo Check if we can do this in a less hacky way
                        var convertedFrom = this.object[this.getHybridProperty(options.property, "pixel")];
                        if (!isNaN(convertedFrom)) {
                            options.from = convertedFrom;
                        }
                    }
                }
                else {
                    // Check if maybe we have a color or percent value
                    if (options.to instanceof Color) {
                        // Yup - set resolved named color
                        //options.from = $colors.stringToColor(<string>options.from);
                        if (options.from) {
                            options.updateMethod = this.getProgressColor;
                        }
                        else {
                            // Static value
                            this.staticOptions.push(options);
                            $array.remove(this.animationOptions, options);
                        }
                    }
                    else if (options.to instanceof Percent) {
                        // Percent
                        options.updateMethod = this.getProgressPercent;
                        // Check if the initial value is maybe in pixels
                        if (!isNaN(options.from)) {
                            // It is. Let's convert it
                            // @todo Check if we can do this in a less hacky way
                            var convertedFrom = this.object[this.getHybridProperty(options.property, "relative")];
                            if (!isNaN(convertedFrom)) {
                                options.from = percent(convertedFrom * 100);
                            }
                        }
                    }
                    else {
                        // Static value
                        this.staticOptions.push(options);
                        $array.remove(this.animationOptions, options);
                    }
                }
            }
        }
        // Register animation
        $array.move(animations, this);
        // Apply static options (just in case they were reset by previous
        // animation loop)
        this.applyStaticOptions();
        if (this.events.isEnabled("animationstart")) {
            this.events.dispatchImmediately("animationstart", {
                type: "animationstart",
                target: this,
                progress: this.progress
            });
        }
        this.update();
        // If duration is 0, just end animation
        if (this.duration === 0) {
            this.end();
        }
        return this;
    };
    /**
     * Sets loop count for the animation. If parameter is not a valid number the
     * animation will keep on looping indefinitely.
     *
     * @param  {number}     count  Number of times to loop animation
     * @return {Animation}         Animation
     */
    Animation.prototype.loop = function (count) {
        if (!$type.isNumber(count)) {
            count = Infinity;
        }
        this._loop = count;
        return this;
    };
    /**
     * Pauses animation.
     *
     * @return {Animation} Animation
     */
    Animation.prototype.pause = function () {
        this._pause = true;
        return this;
    };
    /**
     * Resumes paused animation.
     *
     * @return {Animation} Animation
     */
    Animation.prototype.resume = function () {
        this._pause = false;
        this._startTime = Date.now() - this._time;
        return this;
    };
    /**
     * Jumps to animation end. If animation is set to loop, this will start
     * another round of animation from start.
     *
     * @return {Animation} Animation
     */
    Animation.prototype.end = function () {
        // Pause and complete the progress
        this.pause();
        this.setProgress(1);
        // Apply static options
        this.applyStaticOptions();
        if (this.events.isEnabled("animationend")) {
            this.events.dispatchImmediately("animationend", {
                type: "animationend",
                target: this,
                progress: this.progress
            });
        }
        // Check if we should loop
        if (this._loop > 0) {
            this._loop--;
            this.start();
        }
        else {
            this.dispose();
        }
        return this;
    };
    /**
     * Applies static options that can't be animated.
     */
    Animation.prototype.applyStaticOptions = function () {
        var _this = this;
        $array.each(this.staticOptions, function (options) {
            if (options.childObject) {
                options.childObject[options.property] = _this.progress == 1 ? options.to : options.from;
            }
            else {
                _this.object[options.property] = _this.progress == 1 ? options.to : options.from;
            }
        });
    };
    /**
     * Stops animation.
     *
     * When animation is stopped, the properties of the target object will remain
     * where they were at the moment when `stop()` was called.
     *
     * @param  {boolean}    skipEvent  Do not trigger `animationstop` event
     * @return {Animation}             Animation
     */
    Animation.prototype.stop = function (skipEvent) {
        this.pause();
        this.dispose();
        if (!skipEvent) {
            if (this.events.isEnabled("animationstop")) {
                this.events.dispatchImmediately("animationstop", {
                    type: "animationstop",
                    target: this,
                    progress: this.progress
                });
            }
        }
        return this;
    };
    /**
     * Returns numeric value accoring to progress between start and end values.
     *
     * @param  {IAnimationOptions}  options   Option
     * @param  {number}             progress  Progress (0-1)
     * @return {number}                       Value according to progress
     */
    Animation.prototype.getProgressNumber = function (options, progress) {
        return options.from + (options.to - options.from) * progress;
    };
    /**
     * Returns [[Percent]] value accoring to progress between start and end
     * values.
     *
     * @param  {IPercentAnimationOptions}  options   Option
     * @param  {number}                    progress  Progress (0-1)
     * @return {number}                              Value according to progress
     */
    Animation.prototype.getProgressPercent = function (options, progress) {
        return new Percent($type.getValue(options.from).percent + (options.to.percent - $type.getValue(options.from).percent) * progress);
    };
    /**
     * Returns color value accoring to progress between start and end values.
     *
     * @param  {IAnimationOptions}  options   Option
     * @param  {number}             progress  Progress (0-1)
     * @return {string}                       Color according to progress
     */
    Animation.prototype.getProgressColor = function (options, progress) {
        return $colors.interpolate($type.getValue(options.from), options.to, progress);
    };
    /**
     * Sets current progress and updates object's numeric and color values.
     *
     * @param {number} progress Progress (0-1)
     */
    Animation.prototype.setProgress = function (progress) {
        var _this = this;
        $array.each(this.animationOptions, function (options) {
            var value = options.updateMethod(options, progress);
            if (options.childObject) {
                options.childObject[options.property] = value;
            }
            else {
                _this.object[options.property] = value;
            }
        });
        this.progress = progress;
        if (this.events.isEnabled("animationprogress")) {
            this.events.dispatchImmediately("animationprogress", {
                type: "animationprogress",
                target: this,
                progress: this.progress
            });
        }
    };
    /**
     * Tracks and sets progress according to time or frames.
     *
     * @ignore Exclude from docs
     * @return {Animation} Animation
     */
    Animation.prototype.update = function () {
        if (!this._pause) {
            var progress = void 0;
            if (this.frameBased) {
                progress = this.easing(this._frame / this._frames);
            }
            else {
                this._time = $math.fitToRange(Date.now() - this._startTime, 0, this.duration);
                progress = this.easing(this._time / this.duration);
                if (this.duration == 0 || !$type.isNumber(progress)) {
                    progress = 1;
                }
            }
            this.setProgress(progress);
            if (this.frameBased) {
                this._frame++;
                if (this._frame >= this._frames) {
                    this.end();
                }
            }
            else {
                if ($math.round(this._time / this.duration, 6) == 1) {
                    this.end();
                }
            }
        }
        return this;
    };
    Object.defineProperty(Animation.prototype, "delayed", {
        /**
         * Returns `true` if this animation is delayed.
         *
         * @readonly
         * @return {boolean} [description]
         */
        get: function () {
            return this._delayTimeout ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks other animations currently running on the same object and removes
     * overlapping options from those other animations that are contained in
     * this animation.
     *
     * This is needed to ensure that no two confurent animations step on each
     * other's toes by trying to animate the same property.
     */
    Animation.prototype.stopSameAnimations = function () {
        var _this = this;
        // stop animation of the same property
        // TODO make this more efficient
        // TODO don't copy the array
        $array.each($iter.toArray(this.object.animations.iterator()), function (animation) {
            if (animation !== _this && !animation.delayed) {
                var killed_1 = [];
                $array.each(_this.animationOptions, function (newOptions) {
                    $array.each(animation.animationOptions, function (oldOptions) {
                        if (newOptions.property == oldOptions.property && newOptions.childObject == oldOptions.childObject) {
                            killed_1.push(oldOptions);
                            if (animation.animationOptions.length == 0) {
                                animation.stop(true);
                            }
                        }
                    });
                });
                $array.each(killed_1, function (oldOptions) {
                    $array.remove(animation.animationOptions, oldOptions);
                });
            }
        });
    };
    /**
     * [getHybridProperty description]
     *
     * @todo Description
     * @param  {string}     property [description]
     * @param  {"pixel" |        "relative"}  type [description]
     * @return {string}              [description]
     */
    Animation.prototype.getHybridProperty = function (property, type) {
        return type + property.charAt(0).toUpperCase() + property.substr(1);
    };
    return Animation;
}(BaseObjectEvents));
export { Animation };
//# sourceMappingURL=Animation.js.map