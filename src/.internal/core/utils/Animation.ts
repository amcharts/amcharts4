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
import { AMEvent } from "../utils/EventDispatcher";
import { SVGDefaults } from "../defs/SVGDefaults";
import { Disposer, IDisposer } from "../utils/Disposer";
import { Color } from "../utils/Color";
import { Percent, percent } from "../utils/Percent";
import * as $async from "../utils/AsyncPending";
import * as $ease from "../utils/Ease";
import * as $colors from "../utils/Colors";
import * as $math from "../utils/Math";
import * as $array from "../utils/Array";
import * as $type from "../utils/Type";
import { system } from "../System";


/**
 * Defines interface for animation objects.
 *
 * Should at least contain `update()` method.
 */
export interface IAnimationObject {
	update: () => void
}

/**
 * Defines interface for objects that can be animated
 */
export interface IAnimatable {
	animations: Array<Animation>;
}


export type IAnimationOption = Color | Percent | number | string | boolean;

/**
 * Defines interface for animation options.
 */
export interface IAnimationOptions {

	/**
	 * An initial value to animate from.
	 *
	 * If omitted, the source value will be current value.
	 */
	from?: IAnimationOption;

	/**
	 * A target value to animate from.
	 */
	to: IAnimationOption;

	/**
	 * Property name to animate.
	 */
	property?: any;

	/**
	 * If current values should be taken from different object than the target
	 * element of the animation, this property should be set to that object.
	 */
	childObject?: { [index: string]: any };

	/**
	 * A method/function reference that will be called to for updating the
	 * property value.
	 */
	updateMethod?(progress: number, from: IAnimationOption, to: IAnimationOption): IAnimationOption;


	/**
	 * sometimes we need to pass some dummy data in animationOptions
	 */
	dummyData?: any;

}

/**
 * An interface for an object defining [[Percent]] animation.
 */
export interface IPercentAnimationOptions extends IAnimationOptions {

	/**
	 * Initial value.
	 */
	from?: Percent;

	/**
	 * Target value.
	 */
	to: Percent;

}

/**
 * An interface for an object defining [[Color]] animation.
 */
export interface IColorAnimationOptions extends IAnimationOptions {

	/**
	 * Initial value.
	 */
	from?: Color;

	/**
	 * Target value.
	 */
	to: Color;

}


/**
 * Calls a `callback` function for the `duration` of milliseconds.
 *
 * @todo Needed?
 * @deprecated Not used anywhere
 * @ignore Exclude from docs
 * @param duration  Duration (ms)
 * @param callback  Callback function
 * @return Disposer
 */
export function animate(duration: number, callback: (time: number) => void): IDisposer {
	let disposed = false;

	// TODO use performance.now() ?
	const startTime = Date.now();

	function loop(now: number): void {
		if (!disposed) {
			const diff = now - startTime;

			if (diff >= duration) {
				callback(1);

			} else {
				$async.nextFrame(loop);
				callback(diff / duration);
			}
		}
	}

	$async.nextFrame(loop);

	return new Disposer(() => {
		disposed = true;
	});
}


/**
 * Defines events for [[Animation]].
 */
export interface IAnimationEvents extends IBaseObjectEvents {

	/**
	 * Invoked when animation starts playing.
	 */
	animationstarted: {
		progress: number;
	};

	/**
	 * Invoked when animation finishes playing.
	 */
	animationended: {
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
	animationstopped: {
		progress: number;
	};

}


/**
 * Returns numeric value accoring to progress between start and end values.
 *
 * @param progress  Progress (0-1)
 * @param from
 * @param to
 * @return Value according to progress
 */
function getProgressNumber(progress: number, from: number, to: number): number {
	return from + ((to - from) * progress);
}

/**
 * Returns [[Percent]] value accoring to progress between start and end
 * values.
 *
 * @param progress  Progress (0-1)
 * @param from
 * @param to
 * @return Value according to progress
 */
function getProgressPercent(progress: number, from: Percent, to: Percent): Percent {
	return new Percent(getProgressNumber(progress, from.percent, to.percent));
}

/**
 * Returns color value accoring to progress between start and end values.
 *
 * @param progress  Progress (0-1)
 * @param from
 * @param to
 * @return Color according to progress
 */
function getProgressColor(progress: number, from: Color, to: Color): Color {
	return new Color($colors.interpolate(from.rgb, to.rgb, progress));
}

/**
 * [getHybridProperty description]
 *
 * @todo Description
 * @param property [description]
 * @param type [description]
 * @return [description]
 */
function getHybridProperty(property: string, type: "pixel" | "relative"): string {
	return type + property.charAt(0).toUpperCase() + property.substr(1);
}


export class AnimationDisposer implements IDisposer {
	private _disposer: Disposer;

	constructor(array: Array<Animation>) {
		this._disposer = new Disposer(() => {
			while (array.length !== 0) {
				array[0].dispose();
			}
		});
	}

	isDisposed(): boolean {
		return this._disposer.isDisposed();
	}

	dispose(): void {
		this._disposer.dispose();
	}
}


/**
 * Animation can be used to transition certain properties on an object that
 * implements [[IAnimatable]] interface.
 *
 * @see {@link IAnimationEvents} for a list of available events
 */
export class Animation extends BaseObjectEvents implements IAnimationObject {

	/**
	 * Defines available events.
	 */
	public _events!: IAnimationEvents;

	/**
	 * An animation target object. [[Animation]] will update properties of
	 * this object.
	 */
	public object: IAnimatable;

	/**
	 * An array of animation option objects. Each animation object represent
	 * one property. Animation can animate any number of properties
	 * simultaneously.
	 */
	public animationOptions: IAnimationOptions[];

	/**
	 * Duration of the animation in milliseconds.
	 */
	public duration: number = 0;

	/**
	 * Easing function to use.
	 *
	 * @see {@link Ease}
	 */
	public easing: (value: number) => number = $ease.linear;

	/**
	 * Contains progress of the current animation: 0 (start) to 1 (end).
	 */
	public progress: number = 0;

	/**
	 * A list of options that cannot be animated. Those will be applied when
	 * Animation ends.
	 */
	protected staticOptions!: IAnimationOptions[];

	/**
	 * Indicated how many times animation should loop.
	 */
	protected _loop: number = 0;

	/**
	 * Animation is paused.
	 */
	protected _pause: boolean = false;

	/**
	 * Holds reference to timeout for delayed play.
	 */
	protected _delayTimeout: IDisposer | null = null;

	/**
	 * A timestamp of when animation started playing.
	 */
	protected _startTime: $type.Optional<number>;

	/**
	 * Elapsed time in currently playing animation.
	 */
	protected _time: number = 0;

	// TODO verify that this is correct
	protected debug(): void { }

	protected _isFinished: boolean = false;

	/**
	 * Constructor
	 *
	 * @param object            An object animation should run on
	 * @param animationOptions  One or several (array) of animation options
	 * @param duration          Duration (ms)
	 * @param easing            Easing function
	 */
	constructor(object: IAnimatable, animationOptions: IAnimationOptions[] | IAnimationOptions, duration: number, easing?: (value: number) => number) {

		// Init
		super();
		this.className = "Animation";

		// Set parameters
		this.object = object;
		this.animationOptions = $array.toArray(animationOptions);
		this.duration = duration;
		if (easing) {
			this.easing = easing;
		}

		// Run check if there are already animations playing on the same properties
		// and stop them - the last animation takes precedence
		//this.stopSameAnimations();

		/*if ($type.hasValue(callback)) {
			// TODO don't use .call
			this.events.on("animationended", callback, object);
		}*/

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Disposes this object, clears up after itself.
	 */
	public dispose(): void {
		super.dispose();
		this.pause();
	}

	/**
	 * Delays animation start by X milliseconds.
	 *
	 * @param delay  Delay (ms)
	 * @return Animation
	 */
	public delay(delay: number): Animation {
		//@todo Maybe not use `bind()`
		if (delay > 0) {
			this.pause();

			// This is so that it will get disposed if `this.object` is disposed
			// TODO hacky, figure out a better way
			$array.move(this.object.animations, this);

			let id = setTimeout(() => {
				this._delayTimeout = null;
				this.start();
			}, delay);

			this._delayTimeout = new Disposer(() => {
				clearTimeout(id);
			});
		}
		return this;
	}

	private _start() {
		this._isFinished = false;
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
		$array.move(system.animations, this);

		// Register this animation in object's `animations` list
		$array.move(this.object.animations, this);

		system.requestFrame();
	}

	/**
	 * Starts animation.
	 *
	 * @return Animation
	 */
	public start(): Animation {
		this._start();
		this._startTime = Date.now();
		this._time = 0;
		this.staticOptions = [];

		// Process initial property values
		for (let i: number = this.animationOptions.length - 1; i >= 0; i--) {
			let options: IAnimationOptions = this.animationOptions[i];
			if (!$type.hasValue(options.from)) {
				if (options.childObject) {
					options.from = options.childObject[options.property];
				}
				else {
					options.from = (<any>this.object)[options.property];

					if (!$type.hasValue(options.from)) {
						options.from = (<any>SVGDefaults)[options.property];
					}
				}

				/*if (!$type.hasValue(options.from)) {
					throw Error("Could not get initial transition value.");
				}*/
			}

			if (options.from == options.to) { // || options.to == (<any>this.object)[options.property]){ this is not good, as dataItem.value is set to final at once, and we animate workingValue
				$array.remove(this.animationOptions, options);
			}
			else if (!$type.hasValue(options.from)) {
				// Initial value is undefined, treat it as static
				this.staticOptions.push(options);
				$array.remove(this.animationOptions, options);
			}
			else {
				// Use different update methods for different value types
				if ($type.isNumber(<number>options.to)) {

					// Numeric value
					options.updateMethod = getProgressNumber;

					// Check if initial value is not Percent
					if (options.from instanceof Percent) {
						// It is. Let's convert it to pixel value
						// @todo Check if we can do this in a less hacky way
						let convertedFrom: number = (<any>this.object)[getHybridProperty(options.property, "pixel")];
						if (!isNaN(convertedFrom)) {
							options.from = convertedFrom;
						}
						else {
							this.staticOptions.push(options);
							$array.remove(this.animationOptions, options);
						}
					}
					else if (isNaN(<number>options.from)) {
						// Static value
						this.staticOptions.push(options);
						$array.remove(this.animationOptions, options);
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
						if (!isNaN(<number>options.from)) {
							// It is. Let's convert it
							// @todo Check if we can do this in a less hacky way
							let convertedFrom: number = (<any>this.object)[getHybridProperty(options.property, "relative")];
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
			const event: AMEvent<this, IAnimationEvents>["animationstarted"] = {
				type: "animationstarted",
				target: this,
				progress: this.progress
			};
			this.events.dispatchImmediately("animationstarted", event);
		}

		this.update();

		// If duration is 0, just end animation
		if (this.duration === 0) {
			this.end();
		}

		return this;
	}

	/**
	 * Sets loop count for the animation. If parameter is not a valid number the
	 * animation will keep on looping indefinitely.
	 *
	 * @param count  Number of times to loop animation
	 * @return Animation
	 */
	public loop(count?: number): Animation {
		if (!$type.isNumber(count)) {
			count = Infinity;
		}
		this._loop = count;
		return this;
	}

	/**
	 * Pauses animation.
	 *
	 * @return Animation
	 */
	public pause(): Animation {
		this._pause = true;

		if (this._delayTimeout) {
			this.removeDispose(this._delayTimeout);
			this._delayTimeout = null;
		}

		$array.remove(system.animations, this);
		$array.remove(this.object.animations, this);

		return this;
	}

	/**
	 * Resumes paused animation.
	 *
	 * @return Animation
	 */
	public resume(): Animation {
		this._start();
		this._startTime = Date.now() - this._time;
		return this;
	}

	/**
	 * Jumps to animation end. If animation is set to loop, this will start
	 * another round of animation from start.
	 *
	 * @return Animation
	 */
	public end(): Animation {

		// Pause and complete the progress
		if (this._loop == 0) {
			this.pause();
		}
		this.setProgress(1);

		// Apply static options
		this.applyStaticOptions();

		if (this.events.isEnabled("animationended")) {
			const event: AMEvent<this, IAnimationEvents>["animationended"] = {
				type: "animationended",
				target: this,
				progress: this.progress
			};
			this.events.dispatchImmediately("animationended", event);
		}

		// Check if we should loop
		if (this._loop > 0) {
			this._loop--;
			this.start();
		}
		else {
			this.stop();
			this._isFinished = true;
		}

		return this;
	}

	/**
	 * Stops animation immediately leaving properties in their current values.
	 */
	public kill() {
		this.pause();
		this._isFinished = true;
	}

	/**
	 * Returns indicator if this animation is finished or not
	 *
	 * @return Is finished?
	 */
	public isFinished(): boolean {
		return this._isFinished;
	}

	/**
	 * Applies static options that can't be animated.
	 */
	protected applyStaticOptions(): void {
		$array.each(this.staticOptions, (options) => {
			if (options.childObject) {
				options.childObject[options.property] = this.progress == 1 ? options.to : options.from;
			}
			else {
				(<any>this.object)[options.property] = this.progress == 1 ? options.to : options.from;
			}
		});
	}

	/**
	 * Stops animation.
	 *
	 * When animation is stopped, the properties of the target object will remain
	 * where they were at the moment when `stop()` was called.
	 *
	 * @param skipEvent  Do not trigger `animationstopped` event
	 * @return Animation
	 */
	public stop(skipEvent?: boolean): Animation {
		this.pause();
		if (!skipEvent) {
			if (this.events.isEnabled("animationstopped")) {
				const event: AMEvent<this, IAnimationEvents>["animationstopped"] = {
					type: "animationstopped",
					target: this,
					progress: this.progress
				};
				this.events.dispatchImmediately("animationstopped", event);
			}
		}
		return this;
	}

	/**
	 * Sets current progress and updates object's numeric and color values.
	 *
	 * @param progress Progress (0-1)
	 */
	public setProgress(progress: number): void {
		this._time = this.duration * progress; // just in case we call this from outside
		$array.each(this.animationOptions, (options) => {
			if (options.updateMethod && $type.hasValue(options.from)) {
				let value = options.updateMethod(progress, options.from, options.to);

				if (options.childObject) {
					options.childObject[options.property] = value;
				}
				else {
					(<any>this.object)[options.property] = value;
				}
			}
		});

		this.progress = progress;
		if (this.events.isEnabled("animationprogress")) {
			const event: AMEvent<this, IAnimationEvents>["animationprogress"] = {
				type: "animationprogress",
				target: this,
				progress: this.progress
			};
			this.events.dispatchImmediately("animationprogress", event);
		}

		system.requestFrame();
	}

	/**
	 * Tracks and sets progress according to time or frames.
	 *
	 * @ignore Exclude from docs
	 * @return Animation
	 */
	public update(): Animation {
		if (!this._pause) {

			let progress;
			this._time = $math.fitToRange(Date.now() - this._startTime!, 0, this.duration);
			let timeProgress = this._time / this.duration;
			progress = this.easing(timeProgress);
			if (this.duration == 0 || !$type.isNumber(progress) || timeProgress >= 1) {
				progress = 1;
			}

			this.setProgress(progress);

			if ($math.round(this._time / this.duration, 6) == 1) {
				this.end();
			}

		}
		return this;
	}

	/**
	 * Returns `true` if this animation is delayed.
	 *
	 * @readonly
	 * @return [description]
	 */
	public get delayed(): boolean {
		return this._delayTimeout ? true : false;
	}

	/**
	 * Checks other animations currently running on the same object and removes
	 * overlapping options from those other animations that are contained in
	 * this animation.
	 *
	 * This is needed to ensure that no two confurent animations step on each
	 * other's toes by trying to animate the same property.
	 */
	private stopSameAnimations(): void {
		// stop animation of the same property
		// TODO make this more efficient
		// TODO don't copy the array
		$array.each($array.copy(this.object.animations), (animation) => {
			if (animation !== this && !animation.delayed) {
				const killed: Array<IAnimationOptions> = [];

				$array.each(this.animationOptions, (newOptions) => {
					$array.each(animation.animationOptions, (oldOptions) => {
						if (newOptions.property == oldOptions.property && newOptions.childObject == oldOptions.childObject) {
							killed.push(oldOptions);

							if (animation.animationOptions.length == 0) {
								animation.kill();
							}
						}
					});
				});

				$array.each(killed, (oldOptions) => {
					$array.remove(animation.animationOptions, oldOptions);
				});
			}
		});
	}

	/**
	 * Adds easing functions to "function" fields.
	 *
	 * @param field  Field name
	 * @return Assign as function?
	 */
	protected asFunction(field: string): boolean {
		return field == "easing" || super.asIs(field);
	}

}