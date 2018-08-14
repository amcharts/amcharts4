/**
 * Animation module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents } from "../Base";
import { SVGDefaults } from "../defs/SVGDefaults";
import { Disposer } from "../utils/Disposer";
import { Color } from "../utils/Color";
import { Percent, percent } from "../utils/Percent";
import * as $async from "../utils/AsyncPending";
import * as $ease from "../utils/Ease";
import * as $colors from "../utils/Colors";
import * as $math from "../utils/Math";
import * as $array from "../utils/Array";
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
 * Holds the list of currently playing animations.
 *
 * @ignore Exclude from docs
 * @type {Array<IAnimationObject>}
 */
export var animations = [];
/**
 * Returns numeric value accoring to progress between start and end values.
 *
 * @param  {number}  progress  Progress (0-1)
 * @param  {number}  from
 * @param  {number}  to
 * @return {number}            Value according to progress
 */
function getProgressNumber(progress, from, to) {
    return from + ((to - from) * progress);
}
/**
 * Returns [[Percent]] value accoring to progress between start and end
 * values.
 *
 * @param  {number}   progress  Progress (0-1)
 * @param  {Percent}  from
 * @param  {Percent}  to
 * @return {number}             Value according to progress
 */
function getProgressPercent(progress, from, to) {
    return new Percent(getProgressNumber(progress, from.percent, to.percent));
}
/**
 * Returns color value accoring to progress between start and end values.
 *
 * @param  {number}  progress  Progress (0-1)
 * @param  {Color}   from
 * @param  {Color}   to
 * @return {string}            Color according to progress
 */
function getProgressColor(progress, from, to) {
    return new Color($colors.interpolate(from.rgb, to.rgb, progress));
}
/**
 * [getHybridProperty description]
 *
 * @todo Description
 * @param  {string}     property [description]
 * @param  {"pixel" |        "relative"}  type [description]
 * @return {string}              [description]
 */
function getHybridProperty(property, type) {
    return type + property.charAt(0).toUpperCase() + property.substr(1);
}
function processAnimationOptions(object, animationOptions) {
    var processed = [];
    $array.each($array.toArray(animationOptions), function (options) {
        var childObject = (options.childObject ? options.childObject : object);
        if (!$type.hasValue(options.from)) {
            options.from = childObject[options.property];
            if (!$type.hasValue(options.from)) {
                options.from = SVGDefaults[options.property];
            }
            /*if (!$type.hasValue(options.from)) {
                throw Error("Could not get initial transition value.");
            }*/
        }
        if (options.from !== options.to) { // || options.to == (<any>object)[options.property]){ this is not good, as dataItem.value is set to final at once, and we animate workingValue
            // Use different update methods for different value types
            if ($type.isNumber(options.to)) {
                // Check if initial value is not Percent
                if (options.from instanceof Percent) {
                    // It is. Let's convert it to pixel value
                    // @todo Check if we can do this in a less hacky way
                    var convertedFrom = childObject[getHybridProperty(options.property, "pixel")];
                    // TODO better check
                    if (!isNaN(convertedFrom)) {
                        options.from = convertedFrom;
                    }
                }
                processed.push({
                    childObject: childObject,
                    property: options.property,
                    update: function (time) {
                        childObject[options.property] = getProgressNumber(time, options.from, options.to);
                    }
                });
                // Check if maybe we have a color or percent value
            }
            else if (options.to instanceof Color) {
                // Yup - set resolved named color
                //options.from = $colors.stringToColor(<string>options.from);
                if (options.from) {
                    processed.push({
                        childObject: childObject,
                        property: options.property,
                        update: function (time) {
                            childObject[options.property] = getProgressColor(time, options.from, options.to);
                        }
                    });
                }
                else {
                    processed.push({
                        childObject: childObject,
                        property: options.property,
                        update: function (time) {
                            childObject[options.property] = (time < 0.5 ? options.from : options.to);
                        }
                    });
                }
            }
            else if (options.to instanceof Percent) {
                // Check if the initial value is maybe in pixels
                // TODO better check
                if (!isNaN(options.from)) {
                    // It is. Let's convert it
                    // @todo Check if we can do this in a less hacky way
                    var convertedFrom = childObject[getHybridProperty(options.property, "relative")];
                    // TODO better check
                    if (!isNaN(convertedFrom)) {
                        options.from = percent(convertedFrom * 100);
                    }
                }
                processed.push({
                    childObject: childObject,
                    property: options.property,
                    update: function (time) {
                        childObject[options.property] = getProgressPercent(time, options.from, options.to);
                    }
                });
            }
            else {
                processed.push({
                    childObject: childObject,
                    property: options.property,
                    update: function (time) {
                        childObject[options.property] = (time < 0.5 ? options.from : options.to);
                    }
                });
            }
        }
    });
    return processed;
}
var AnimationDisposer = /** @class */ (function () {
    function AnimationDisposer(array) {
        this._disposer = new Disposer(function () {
            while (array.length !== 0) {
                array[0].dispose();
            }
        });
    }
    AnimationDisposer.prototype.isDisposed = function () {
        return this._disposer.isDisposed();
    };
    AnimationDisposer.prototype.dispose = function () {
        this._disposer.dispose();
    };
    return AnimationDisposer;
}());
export { AnimationDisposer };
/**
 * Animation can be used to transition certain properties on an object that
 * implements [[IAnimatable]] interface.
 *
 * @see {@link IAnimationEvents} for a list of available events
 */
var Animation = /** @class */ (function (_super) {
    tslib_1.__extends(Animation, _super);
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
         * Contains progress of the current animation: 0 (start) to 1 (end).
         *
         * @type {number}
         */
        _this.progress = 0;
        /**
         * Indicated how many times animation should loop.
         *
         * @type {number}
         */
        _this._loop = 0;
        /**
         * Animation is paused.
         *
         * @type {boolean}
         */
        _this._pause = false;
        /**
         * Holds reference to timeout for delayed play.
         *
         * @type {IDisposer}
         */
        _this._delayTimeout = null;
        /**
         * Elapsed time in currently playing animation.
         *
         * @type {number}
         */
        _this._time = 0;
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
        /*if ($type.hasValue(callback)) {
            // TODO don't use .call
            this.events.on("animationended", callback, object);
        }*/
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    // TODO verify that this is correct
    Animation.prototype.debug = function () { };
    /**
     * Disposes this object, clears up after itself.
     */
    Animation.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.pause();
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
            this.pause();
            this._delayTimeout = this.setTimeout(this.start.bind(this), delay);
        }
        return this;
    };
    Animation.prototype._start = function () {
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
        // Register animation
        $array.move(animations, this);
        // Register this animation in object's `animations` list
        $array.move(this.object.animations, this);
    };
    /**
     * Starts animation.
     *
     * @return {Animation} Animation
     */
    Animation.prototype.start = function () {
        this._start();
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
            if (options.from == options.to) { // || options.to == (<any>this.object)[options.property]){ this is not good, as dataItem.value is set to final at once, and we animate workingValue
                $array.remove(this.animationOptions, options);
            }
            else {
                // Use different update methods for different value types
                if ($type.isNumber(options.to)) {
                    // Numeric value
                    options.updateMethod = getProgressNumber;
                    // Check if initial value is not Percent
                    if (options.from instanceof Percent) {
                        // It is. Let's convert it to pixel value
                        // @todo Check if we can do this in a less hacky way
                        var convertedFrom = this.object[getHybridProperty(options.property, "pixel")];
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
                            options.updateMethod = getProgressColor;
                        }
                        else {
                            // Static value
                            this.staticOptions.push(options);
                            $array.remove(this.animationOptions, options);
                        }
                    }
                    else if (options.to instanceof Percent) {
                        // Percent
                        options.updateMethod = getProgressPercent;
                        // Check if the initial value is maybe in pixels
                        if (!isNaN(options.from)) {
                            // It is. Let's convert it
                            // @todo Check if we can do this in a less hacky way
                            var convertedFrom = this.object[getHybridProperty(options.property, "relative")];
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
        // Apply static options (just in case they were reset by previous
        // animation loop)
        this.applyStaticOptions();
        if (this.events.isEnabled("animationstarted")) {
            var event_1 = {
                type: "animationstarted",
                target: this,
                progress: this.progress
            };
            this.events.dispatchImmediately("animationstarted", event_1);
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
        if (this._delayTimeout) {
            this.removeDispose(this._delayTimeout);
            this._delayTimeout = null;
        }
        $array.remove(animations, this);
        $array.remove(this.object.animations, this);
        return this;
    };
    /**
     * Resumes paused animation.
     *
     * @return {Animation} Animation
     */
    Animation.prototype.resume = function () {
        this._start();
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
        if (this.events.isEnabled("animationended")) {
            var event_2 = {
                type: "animationended",
                target: this,
                progress: this.progress
            };
            this.events.dispatchImmediately("animationended", event_2);
        }
        // Check if we should loop
        if (this._loop > 0) {
            this._loop--;
            this.start();
        }
        else {
            this.stop();
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
     * @param  {boolean}    skipEvent  Do not trigger `animationstopped` event
     * @return {Animation}             Animation
     */
    Animation.prototype.stop = function (skipEvent) {
        this.pause();
        if (!skipEvent) {
            if (this.events.isEnabled("animationstopped")) {
                var event_3 = {
                    type: "animationstopped",
                    target: this,
                    progress: this.progress
                };
                this.events.dispatchImmediately("animationstopped", event_3);
            }
        }
        return this;
    };
    /**
     * Sets current progress and updates object's numeric and color values.
     *
     * @param {number} progress Progress (0-1)
     */
    Animation.prototype.setProgress = function (progress) {
        var _this = this;
        this._time = this.duration * progress; // just in case we call this from outside
        $array.each(this.animationOptions, function (options) {
            if (options.updateMethod && $type.hasValue(options.from)) {
                var value = options.updateMethod(progress, options.from, options.to);
                if (options.childObject) {
                    options.childObject[options.property] = value;
                }
                else {
                    _this.object[options.property] = value;
                }
            }
        });
        this.progress = progress;
        if (this.events.isEnabled("animationprogress")) {
            var event_4 = {
                type: "animationprogress",
                target: this,
                progress: this.progress
            };
            this.events.dispatchImmediately("animationprogress", event_4);
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
            this._time = $math.fitToRange(Date.now() - this._startTime, 0, this.duration);
            progress = this.easing(this._time / this.duration);
            if (this.duration == 0 || !$type.isNumber(progress)) {
                progress = 1;
            }
            this.setProgress(progress);
            if ($math.round(this._time / this.duration, 6) == 1) {
                this.end();
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
        $array.each($array.copy(this.object.animations), function (animation) {
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
    return Animation;
}(BaseObjectEvents));
export { Animation };
//# sourceMappingURL=Animation.js.map