/**
 * Defines functionality for "Data Item"
 *
 * A Data Item can be any object that can hold data. For example [[LineSeries]]
 * holds a number of values, that comprise a line graph. Each of those values
 * (data points) is a {DataItem}.
 *
 * Furthermore the [[LineSeries]] itself can be represented as a entry in the
 * legend. Since legend needs access to Line Series' value, a DataItem is
 * created for the series.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents, IBaseObjectEvents } from "./Base";
import { AMEvent } from "./utils/EventDispatcher";
import { Adapter } from "./utils/Adapter";
import { Component, CalculatedValue } from "./Component";
import { IAnimatable, Animation, IAnimationOptions, IAnimationEvents, AnimationDisposer } from "./utils/Animation";
import { Sprite } from "./Sprite";
import { IDisposer } from "./utils/Disposer";
import * as $utils from "./utils/Utils";
import * as $array from "./utils/Array";
//import * as $object from "./utils/Object";
import * as $type from "./utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 *
 * @todo Description
  */
export interface IValues { }

/**
 * Defines data events for [[DataItem]]
 */
export interface IDataItemEvents extends IBaseObjectEvents {

	/**
	 * Invoked when the visibility of the Data Item changes, i.e. Series is
	 * hidden
	 */
	visibilitychanged: {
		visible: boolean;
	};

	/**
	 * Invoked when the value is changed
	 */
	valuechanged: {
		property: string;
	};

	/**
	 * Invoked when the internal/intermediate value has changed
	 */
	workingvaluechanged: {
		property: string;
	};

	/**
	 * Invoked when the calculated value has changed
	 */
	calculatedvaluechanged: {
		property: string;
	};

	/**
	 * Invoked when the location of Data Item changes
	 */
	locationchanged: {
		property: string;
	};

	/**
	 * Invoked when working location of Data Item changes
	 */
	workinglocationchanged: {
		property: string;
	};

	/**
	 * Invoked when a property of the Data Item changes
	 */
	propertychanged: {
		property: string;
		value: any; // TODO don't make this any
	};

}

/**
 * Defines adapters for [[DataItem]]
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IDataItemAdapters {

	duration: number;

	value: {
		value: number,
		field: string
	};

	workingValue: {
		workingValue: number,
		field: string
	};

	date: {
		date: Date,
		field: string
	};

}

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * DataItem represents single element in data, for example a data point in a
 * Serial Chart Series, e.g. a column.
 *
 * DataItem defines relationship between structured data, required for specific
 * chart type or task, and raw source data.
 *
 * It also implements required calculations, updates related visual elements,
 * etc.
 *
 * @todo Description
 * @important
 */
export class DataItem extends BaseObjectEvents implements IAnimatable {

	/**
	 * When we are using a nested data structure, like for example in a TreeMap,
	 * this property points to a parent Data Item of this one.
	 */
	public parent: $type.Optional<this>;

	/**
	 * Defines available events.
	 */
	public _events!: IDataItemEvents;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IDataItemAdapters;

	/**
	 * @ignore
	 */
	public _adapterO: Adapter<DataItem, IDataItemAdapters>;

	/**
	 * Holds Adapter.
	 */
	public get adapter(): Adapter<DataItem, IDataItemAdapters> {
		if (!this._adapterO) {
			this._adapterO = new Adapter<DataItem, IDataItemAdapters>(this);
		}
		return this._adapterO;
	}

	/**
	 * Defines a type of [[Component]] this Data Item is used for.
	 */
	public _component!: Component;

	/**
	 * A reference to a [[Component]] this Data Item belongs to.
	 *
	 * @ignore Exclude from docs
	 */
	public component: $type.Optional<this["_component"]>;

	/**
	 * A reference to the original Data Item in raw data.
	 *
	 * @ignore Exclude from docs
	 */
	protected _dataContext: Object;

	/**
	 * This Data Item is currently disabled.
	 *
	 * @ignore Exclude from docs
	 */
	protected _disabled: boolean = false;

	/**
	 * Indicates whether Data Item has any properties set.
	 *
	 * If it does not have any, the code can use this property to check whether
	 * they need to apply costly operation of re-applying properties, whenever
	 * Data Item-related element is redrawn, e.g. series.
	 */
	public hasProperties: boolean = false;

	/**
	 * An object containing calculated values.
	 */
	public readonly values: { [index: string]: { [index: string]: number } } = {};

	/**
	 * An object container current working values.
	 */
	//public readonly workingValues: { [index: string]: { [index: string]: number } } = {};

	/**
	 * An object containing categories.
	 */
	public readonly categories: { [index: string]: string } = {};

	/**
	 * An object containing dates.
	 */
	public readonly dates: { [index: string]: Date } = {};

	/**
	 * An object containing locations for the Data Item.
	 *
	 * A location is a position within date or category, or, in some other cases,
	 * where there is no single point but rather some period.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/series/#Data_item_locations} for info how data item locations work
	 */
	public readonly locations: { [index: string]: number } = {};

	/**
	 * Current working locations.
	 */
	public readonly workingLocations: { [index: string]: number } = {};

	/**
	 * An object containing Data Item specific appearance properties in key-value
	 * pairs.
	 *
	 * Sometimes a single Data Item needs to apply different properties than the
	 * rest of the data [[Series]] it is part of. E.g. a single column,
	 * represented by a Data Item needs to be filled with a different color than
	 * the reset of the [[ColumnSeries]] it belongs to.
	 *
	 * That's where Data Item's `properties` come into play.
	 *
	 * Please note that you should set Data Item-specific properties using
	 * `setProperty()` method, rather than access `properties` object directly.
	 */
	public readonly properties: { [index: string]: any } = {};

	/**
	 * A list of [[Sprite]] elements that are associated with this Data Item.
	 *
	 * E.g. an [[Axis]] Data Item has several separate elements associated with
	 * it, like [[AxisTick]], [[AxisLabel]], and [[Grid]].
	 *
	 * Data Item keeps track of all of them, so it can toggle all related visual
	 * elements when it itself is toggled.
	 */
	public sprites: Sprite[] = [];

	/**
	 * Identifies if this object is a "template" and should not be treated as
	 * real object that is drawn or actually used in the chart.
	 */
	public isTemplate: boolean = false;

	/**
	 * List of animations currently animating Data Item's values.
	 *
	 * @ignore Exclude from docs
	 */
	protected _animations: $type.Optional<Array<Animation>>;

	/**
	 * The current index within the dataItems
	 *
	 * @ignore Exclude from docs
	 */
	public _index: number | null = null;

	/**
	 * Is Data Item currently visible?
	 *
	 * @ignore Exclude from docs
	 */
	protected _visible: boolean = true;

	/**
	 * Is Data Item currently hidden?
	 *
	 * @ignore Exclude from docs
	 */
	protected _hidden: boolean = false;

	/**
	 * Should this Data Item be used when calculating data ranges and scales?
	 *
	 * @ignore Exclude from docs
	 */
	protected _ignoreMinMax: boolean = false;

	/**
	 * Some of the Data Item's data fields may contain an array of children. This
	 * property contains an object indicating which fields hold an array, so that
	 * they can be processed properly.
	 *
	 * @ignore Exclude from docs
	 */
	public hasChildren: { [index: string]: boolean } = {};

	/**
	 * Indicates whether Data Item is currently animiting from visible to hidden
	 * state.
	 */
	public isHiding: boolean = false;

	/**
	 * Holds a Disposer reference to hiding [[Animation]] currently playing.
	 *
	 * @ignore Exclude from docs
	 */
	protected _hideDisposer: $type.Optional<IDisposer>;

	/**
	 *
	 * @ignore Exclude from docs
	 */
	protected _valueAnimations: { [key: string]: Animation } = {};

	/**
	 *
	 * @ignore Exclude from docs
	 */
	protected _locationAnimations: { [key: string]: Animation } = {};

	/**
	 * Constructor
	 * @todo Adding events to disposers produces errors in some cases, which means that chart is using disposed Data Items which is not right
	 */
	constructor() {
		super();
		this.className = "DataItem";
		this.applyTheme();
	}


	/**
	 * Data Item's position index in Component's data.
	 *
	 * @return Index
	 */
	public get index(): number {
		if (this.component) {
			if (this._index != null) {
				return this._index;
			} else {
				return -1;
			}
		}
		else {
			return -1;
		}
	}

	/**
	 * A list of [[Animations]] objects currently mutating Data Item's values.
	 *
	 * @return [description]
	 */
	public get animations(): Array<Animation> {
		if (!this._animations) {
			this._animations = [];
			this._disposers.push(new AnimationDisposer(this._animations));
		}
		return this._animations;
	}

	/**
	 * Sets visibility of the Data Item.
	 *
	 * @param value Visible?
	 */
	public set visible(value: boolean) {
		if (value) {
			this.hidden = false;
		}
		if (this._visible != value) {
			this.setVisibility(value);
		}
	}

	/**
	 * Sets hidden flag for data item. Mostly used to initially hide data item.
	 *
	 * @param value Hidden?
	 */
	public set hidden(value: boolean) {
		if (this._hidden != value) {
			this._hidden = value;
			if (value) {
				this.setVisibility(false);
			}
			else {
				this.setVisibility(true, true);
			}
		}
	}

	/**
	 * Returns `true` if this Data Item is currently hidden.
	 *
	 * @return Hidden?
	 */
	public get hidden(): boolean {
		return this._hidden;
	}

	/**
	 * Disables all Sprites associated with this Data Item.
	 *
	 * @ignore Exclude from docs
	 * @param {boolean}
	 */
	public set __disabled(value: boolean) {
		//	if (this._disabled != value) { // not good
		this._disabled = value;

		$array.each(this.sprites, (sprite) => {
			sprite.__disabled = value;
		});
		//	}
	}

	/**
	 * Is this Data Item currently disabled?
	 *
	 * @ignore Exclude from docs
	 * @param {boolean}
	 */
	public get __disabled(): boolean {
		return this._disabled;
	}

	/**
	 * Sets visibility of the Data Item.
	 *
	 * @param value Data Item
	 */
	public setVisibility(value: boolean, noChangeValues?: boolean): void {
		$array.each(this.sprites, (sprite) => {
			if (value) {
				sprite.visible = sprite.defaultState.properties.visible;
			}
			else {
				if (sprite.hiddenState) {
					sprite.visible = sprite.hiddenState.properties.visible;
				}
				else {
					sprite.visible = false;
				}
			}
		});

		this._visible = value;
		if (this._eventDispatcher && !this.__disabled) {
			if (this.events.isEnabled("visibilitychanged")) {
				const event: AMEvent<this, IDataItemEvents>["visibilitychanged"] = {
					type: "visibilitychanged",
					target: this,
					visible: value
				};
				this.events.dispatchImmediately("visibilitychanged", event);
			}
		}
	}

	/**
	 * Returns `true` if this Data Item is currently visible.
	 *
	 * @return Visible?
	 */
	public get visible(): boolean {
		if (this._hidden) {
			return false;
		}
		return this._visible;
	}

	/**
	 * Shows the Data Item and related visual elements.
	 *
	 * @param duration  Animation duration (ms)
	 * @param delay     Delay animation (ms)
	 * @param fields    A list of fields to set values of
	 */
	public show(duration?: number, delay?: number, fields?: string[]): $type.Optional<Animation> {
		if (!this.hidden) {
			this.setVisibility(true, true);

			this.isHiding = false;

			if (this._hideDisposer) {
				this.removeDispose(this._hideDisposer);
			}

			let animation: $type.Optional<Animation>;

			if (fields) {
				$array.each(fields, (field) => {
					animation = this.setWorkingValue(field, this.values[field].value, duration, delay);
				});
			}

			$array.each(this.sprites, (sprite) => {
				let animation = sprite.show(duration);

				if (animation != null && !animation.isFinished()) {
					this._disposers.push(animation);

					if (delay != null && delay > 0) {
						animation.delay(delay);
					}
				}
			});
			return animation;
		}
	}

	/**
	 * Destroys this object and all related data.
	 */
	public dispose() {
		super.dispose();

		$array.each(this.sprites, (sprite) => {
			sprite.dispose();
		});

		this.sprites = [];
	}

	/**
	 * Hides the Data Item and related visual elements.
	 *
	 * @param duration  Animation duration (ms)
	 * @param delay     Delay animation (ms)
	 * @param toValue   A value to set to `fields` when hiding
	 * @param fields    A list of data fields to set value to `toValue`
	 */
	public hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): $type.Optional<Animation> {
		this.isHiding = true;

		$array.each(this.sprites, (sprite) => {

			let animation = sprite.hide(duration);

			if (animation != null && !animation.isFinished()) {
				this._disposers.push(animation);

				if (delay != null && delay > 0) {
					animation.delay(delay);
				}
			}
		});

		if ($type.isNumber(toValue) && fields) {
			let animation: $type.Optional<Animation>;

			$array.each(fields, (field) => {
				let anim = this.setWorkingValue(field, toValue, duration, delay);
				if (anim) {
					animation = anim;
				}
			});

			if (animation && !animation.isFinished()) {
				this._hideDisposer = animation.events.on("animationended", () => {
					this.setVisibility(false, true);
					this.isHiding = false;
				});

				this._disposers.push(this._hideDisposer);
				return animation;
			}
			else {
				this.isHiding = false;
				this.setVisibility(false, true);
			}
		}
		else {
			this.isHiding = false;
			this.setVisibility(false);
		}
	}

	/**
	 * Returns a duration (ms) the Data Item should take to animate from one
	 * value to another.
	 *
	 * If the duration is not specified via parameter, this method will try to
	 * request a default duration from the related `Component`.
	 *
	 * @param duration  Default duration (ms)
	 * @return Duration (ms)
	 */
	public getDuration(duration?: number): $type.Optional<number> {
		if (!$type.isNumber(duration)) {
			let component: $type.Optional<Component> = this.component;
			if (component) {
				duration = component.interpolationDuration;
			}
		}

		if (duration != null) {
			if (!this._adapterO) {
				return duration;
			}
			else {
				return this._adapterO.apply("duration", duration);
			}
		}
	}

	/**
	 * Returns a numeric value for specific data field.
	 *
	 * If `calculated` is not set, it will return a raw value, as it is in
	 * source data.
	 *
	 * If `calculated` is set, it will return a pre-calculated specific value.
	 *
	 * @param name        Data field name
	 * @param calculated  A calculated value name
	 * @return Value
	 */
	public getValue(name: string, calculated?: CalculatedValue): $type.Optional<number> {
		if (name && this.component) {
			if (!calculated) {
				calculated = (<any>this.component.dataFields)[name + "Show"];
				if (!calculated) {
					calculated = "value";
				}
			}

			const value = this.values[name][calculated];

			if (this._adapterO && this._adapterO.isEnabled("value")) {
				return this._adapterO.apply("value", {
					value: value,
					field: name
				}).value;

			} else {
				return value;
			}
		}
	}

	/**
	 * Returns a current working value for a specific data field.
	 *
	 * The actual value may differ from the one returned by `getValue()`. The
	 * latter returns static values from the data source.
	 *
	 * `getWorkingValue()` returns current value, which is usually different if
	 * Data Item is animating from one state to another.
	 *
	 * @param name        Data field name
	 * @return Value
	 */
	public getWorkingValue(name: string): $type.Optional<number> {
		if (name && this.component) {
			let realName = (<any>this.component.dataFields)[name + "Show"];

			if (!realName) {
				realName = "workingValue";
			}
			if (this._adapterO) {
				return this._adapterO.apply("workingValue", {
					workingValue: this.values[name][realName],
					field: name
				}).workingValue;
			}
			else {
				return this.values[name][realName];
			}
		}
	}

	/**
	 * @ignore
	 * @return Value
	 */
	public getActualWorkingValue(name: string): $type.Optional<number> {
		return this.values[name].workingValue;
	}


	/**
	 * Sets a numeric value for specific data field.
	 *
	 * @param name        Data field name
	 * @param value       Value
	 * @param calculated  Calculated data field name
	 * @param duration    Duration (ms) to animate to new value to
	 * @param delay       Delay animation (ms)
	 */
	public setValue(name: string, value: number, duration?: number, delay?: number): void {
		let currentValue: number = this.values[name].value;
		let newDuration: $type.Optional<number> = this.getDuration(duration);
		value = $type.toNumber(value);
		if (currentValue !== value) {
			this.values[name].value = value;
			if (this._eventDispatcher && !this.__disabled) {
				if (this.events.isEnabled("valuechanged")) {
					const event: AMEvent<this, IDataItemEvents>["valuechanged"] = {
						type: "valuechanged",
						target: this,
						property: name
					};
					this.events.dispatchImmediately("valuechanged", event);
				}
			}

			if (this.component) {
				this.component.handleDataItemValueChange(this, name);
			}
		}

		this.setWorkingValue(name, value, newDuration, delay);
	}

	setCalculatedValue(name: string, value: number, calculated: CalculatedValue): void {
		let currentValue: number = this.values[name][calculated];

		if (currentValue !== value && $type.isNumber(value)) {
			this.values[name][calculated] = value;

			if (this._eventDispatcher && !this.__disabled) {
				if (this.events.isEnabled("calculatedvaluechanged")) {
					const event: AMEvent<this, IDataItemEvents>["calculatedvaluechanged"] = {
						type: "calculatedvaluechanged",
						target: this,
						property: name
					};
					this.events.dispatchImmediately("calculatedvaluechanged", event);
				}
			}

			if (this.component) {
				this.component.handleDataItemCalculatedValueChange(this, name);
			}
		}
	}

	/**
	 * Set current working numeric value for a specific data field.
	 *
	 * @param name        Data field name
	 * @param value       Value
	 * @param calculated  Calculated data field name
	 * @param duration    Duration (ms) to animate to new value to
	 * @param delay       Delay animation (ms)
	 * @return An [[Animation]] object used for transition to new values
	 */
	public setWorkingValue(name: string, value: number, duration?: number, delay?: number): $type.Optional<Animation> {
		if ($type.isNumber(this.values[name].value)) {
			let newDuration: $type.Optional<number> = this.getDuration(duration);

			let workingValue: number = this.values[name].workingValue;

			if (newDuration != null && newDuration > 0 && $type.isNumber(workingValue) && this.component) { // sometimes NaN is passed, so only change this to != null if all cases of NaN are handled, otherwise animation won't stop

				if (workingValue != value) {
					let animation: Animation = this.animate({ childObject: this.values[name], property: "workingValue", from: workingValue, to: value, dummyData: name }, newDuration, this.component.interpolationEasing);
					if (delay != null) {
						animation.delay(delay);
					}
					animation.events.on("animationstarted", this.handleInterpolationProgress, this);
					animation.events.on("animationprogress", this.handleInterpolationProgress, this);
					animation.events.on("animationended", this.handleInterpolationProgress, this);
					this._valueAnimations[name] = animation;
					return animation;
				}
				else {
					let valueAnimation = this._valueAnimations[name];
					if (valueAnimation) {
						valueAnimation.stop();
					}

					this.values[name].workingValue = value;
				}
			}
			else {

				let valueAnimation = this._valueAnimations[name];
				if (valueAnimation) {
					valueAnimation.stop();
				}

				this.values[name].workingValue = value;
				if (this._eventDispatcher && !this.__disabled) {
					if (this.events.isEnabled("workingvaluechanged")) {
						const event: AMEvent<this, IDataItemEvents>["workingvaluechanged"] = {
							type: "workingvaluechanged",
							target: this,
							property: name
						};
						this.events.dispatchImmediately("workingvaluechanged", event);
					}
				}

				if (this.component) {
					this.component.handleDataItemWorkingValueChange(this, name);
				}
			}
		}
	}

	/**
	 * Sets a relative location for a data field.
	 *
	 * A location is always relative on a 0 to 1 scale, with 0 being beginning,
	 * 0.5 middle and 1 end.
	 *
	 * @todo Rewiew description
	 * @param name      Data field name
	 * @param value     Location (0-1)
	 * @param duration  Duration (ms) to animate to new value to
	 * @param delay     Delay animation (ms)
	 */
	public setLocation(name: string, value: number, duration?: number, delay?: number) {
		let currentLocation: number = this.locations[name];

		if (currentLocation !== value) {
			this.locations[name] = value;
			if (this._eventDispatcher && !this.__disabled) {
				if (this.events.isEnabled("locationchanged")) {
					const event: AMEvent<this, IDataItemEvents>["locationchanged"] = {
						type: "locationchanged",
						target: this,
						property: name
					};
					this.events.dispatchImmediately("locationchanged", event);
				}
			}

			if (this.component) {
				this.component.handleDataItemValueChange(this, name); // correct
			}

			this.setWorkingLocation(name, value, duration, delay);
		}
	}

	/**
	 * Sets a current working location for a data field.
	 *
	 * @todo Rewiew description
	 * @param name      Data field name
	 * @param value     Location (0-1)
	 * @param duration  Duration (ms) to animate to new value to
	 * @param delay     Delay animation (ms)
	 */
	public setWorkingLocation(name: string, value: number, duration?: number, delay?: number): $type.Optional<Animation> {
		let newDuration: $type.Optional<number> = this.getDuration(duration);
		let workingLocation: number = this.workingLocations[name];

		if (newDuration != null && newDuration > 0 && $type.isNumber(workingLocation) && this.component) { // sometimes NaN is passed, so only change this to != null if all cases of NaN are handled, otherwise animation won't stop
			if (workingLocation != value) {
				let animation: Animation = this.animate({ childObject: this.workingLocations, property: name, from: workingLocation, to: value, dummyData: name }, newDuration, this.component.interpolationEasing);
				if (delay != null) {
					animation.delay(delay);
				}
				animation.events.on("animationstarted", this.handleInterpolationProgress, this);
				animation.events.on("animationprogress", this.handleInterpolationProgress, this);
				animation.events.on("animationended", this.handleInterpolationProgress, this);
				this._locationAnimations[name] = animation;
				return animation;
			}
			else {
				let locationAnimation = this._locationAnimations[name];
				if (locationAnimation) {
					locationAnimation.stop();
				}

				this.workingLocations[name] = value;
			}
		}
		else {
			let locationAnimation = this._locationAnimations[name];
			if (locationAnimation) {
				locationAnimation.stop();
			}

			this.workingLocations[name] = value;

			if (this._eventDispatcher && !this.__disabled) {
				if (this.events.isEnabled("workinglocationchanged")) {
					const event: AMEvent<this, IDataItemEvents>["workinglocationchanged"] = {
						type: "workinglocationchanged",
						target: this,
						property: name
					};
					this.events.dispatchImmediately("workinglocationchanged", event);
				}
			}

			if (this.component) {
				this.component.handleDataItemWorkingLocationChange(this, name);
			}
		}

	}

	/**
	 * Sets Date value to a data field.
	 *
	 * @param name      Data field name
	 * @param date      Date object
	 * @param duration  Duration (ms) to animate to new value to
	 */
	public setDate(name: string, date: Date, duration?: number) {
		if (!$type.isDate(date) && this.component) {
			date = this.component.dateFormatter.parse(date);
		}

		let currentDate: Date = this.dates[name];
		if (currentDate !== date) {
			this.dates[name] = date;
			this.setValue(name, date.getTime(), duration);
		}
	}

	/**
	 * Returns a Date value of the data field.
	 *
	 * @param name  Data field name
	 * @return Date object
	 */
	public getDate(name: string): Date {
		if (this._adapterO) {
			return this._adapterO.apply("date", {
				date: this.dates[name],
				field: name
			}).date;
		}
		else {
			return this.dates[name];
		}
	}

	/**
	 * Sets a Data Item-specific visual properties to apply to related elements.
	 *
	 * @param name   Property name
	 * @param value  Property value
	 */
	public setProperty(name: string, value: any) {
		if (this.properties[name] !== value) {
			this.hasProperties = true;
			this.properties[name] = value;
			if (this._eventDispatcher && !this.__disabled) {
				if (this.events.isEnabled("propertychanged")) {
					const event: AMEvent<this, IDataItemEvents>["propertychanged"] = {
						type: "propertychanged",
						target: this,
						property: name,
						value: value
					};
					this.events.dispatchImmediately("propertychanged", event);
				}
			}

			if (this.component) {
				this.component.handleDataItemPropertyChange(this, name);
			}
		}
	}

	/**
	 * Sets a related category for this Data Item.
	 *
	 * @todo Review description
	 * @param name   Data field name
	 * @param value  Category
	 */
	public setCategory(name: string, value: string) {
		if (!$type.isString(value)) {
			value = $type.castString(value);
		}

		if (this.categories[name] !== value) {
			this.categories[name] = value;
		}
	}

	/**
	 * Clones the Data Item, including all related data.
	 *
	 * @return New Data Item clone
	 */
	//public clone(cloneId?: string): this {
	//	let dataItem: this = super.clone(cloneId);
	//	dataItem.copyFrom(this);
	//	return dataItem;
	//}

	/**
	 * Copies all properties and related data from different data item.
	 *
	 * @param object Source data item
	 */
	public copyFrom(source: this) {

		super.copyFrom(source);

		if (source.dataContext) {
			this.dataContext = $utils.copy(source.dataContext, {});
		}

		$utils.copyProperties(source.locations, this.locations);
		/*
		$utils.copyProperties(source.properties, this.properties);
		$utils.copyProperties(source.categories, this.categories);
		$utils.copyProperties(source.values, this.values);
		$utils.copyProperties(source.dates, this.dates);

		$object.each(source.values, (name, value) => {
			this.values[name] = $object.copy(value);
		});*/
		if (source._adapterO) {
			this.adapter.copyFrom(source._adapterO);
		}
		//this.events.copyFrom(source.events); // because copied in Base
		this.component = source.component;
	}

	/**
	 * Sets opacity for all Data Item's related elements (Sprites).
	 *
	 * @param value Opacity (0-1)
	 */
	public set opacity(value: number) {
		$array.each(this.sprites, (sprite) => {
			sprite.opacity = value;
		});
	}

	/**
	 * Sets whether this data point should not be included in the scale and
	 * minimum/maximum calculations.
	 *
	 * E.g. some we may want to exclude a particular data point from influencing
	 * [[ValueAxis]] scale.
	 *
	 * @param value  Exclude from min/max calculations?
	 */
	public set ignoreMinMax(value: boolean) {
		this._ignoreMinMax = value;
		if (this._eventDispatcher && !this.__disabled) {
			if (this.events.isEnabled("propertychanged")) {
				const event: AMEvent<this, IDataItemEvents>["propertychanged"] = {
					type: "propertychanged",
					target: this,
					property: "ignoreMinMax",
					value: value
				};
				this.events.dispatchImmediately("propertychanged", event);
			}
		}

		if (this.component) {
			this.component.handleDataItemPropertyChange(this, "ignoreMinMax");
		}
	}

	/**
	 * Exclude from min/max calculations?
	 * @return Exclude from min/max calculations?
	 */
	public get ignoreMinMax(): boolean {
		return this._ignoreMinMax;
	}

	/**
	 * Creates and starts an [[Animation]] to interpolate (morph) Data Item's
	 * properties and/or values.
	 *
	 * @see {@link Animation}
	 * @param animationOptions  Animation options
	 * @param duration          Animation duration (ms)
	 * @param easing            Easing function
	 * @return Animation
	 */
	public animate(animationOptions: IAnimationOptions[] | IAnimationOptions, duration: number, easing?: (value: number) => number): Animation {
		return new Animation(this, animationOptions, duration, easing).start();
	}

	/**
	 * Handles intermediate steps when Data Item is interpolating (morphing) from
	 * one value to another.
	 *
	 * @ignore Exclude from docs
	 * @param event Event object
	 */
	public handleInterpolationProgress(event: AMEvent<Animation, IAnimationEvents>["animationstarted" | "animationended" | "animationprogress"]) {
		let animation: Animation = event.target;

		// it's always only one options, no need cycle
		let animationOptions: IAnimationOptions = animation.animationOptions[0];
		if (animationOptions) {
			if (this._eventDispatcher && !this.__disabled) {
				if (this.events.isEnabled("workingvaluechanged")) {
					const event: AMEvent<this, IDataItemEvents>["workingvaluechanged"] = {
						type: "workingvaluechanged",
						target: this,
						property: animationOptions.dummyData
					};

					this.events.dispatchImmediately("workingvaluechanged", event);
				}
			}

			if (this.component) {
				this.component.handleDataItemWorkingValueChange(this, animationOptions.dummyData);
			}
		}
	}

	/**
	 * Checks whether Data Item has values set for all of the data fields,
	 * supplied via argument.
	 *
	 * @ignore Exclude from docs
	 * @param fields  Field list to check
	 * @return Has values for all fields?
	 */
	public hasValue(fields: string[]): boolean {
		// todo: what about categories?
		for (let i = 0, len = fields.length; i < len; i++) {
			let values = this.values[fields[i]];
			if (!values || !$type.hasValue(values.value)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Depth of the Data Item.
	 *
	 * In nested data structures, like TreeMap, this indicates the level this
	 * data point is at, in relation to the parent Data Item.
	 *
	 * @return Depth
	 */
	public get depth(): number {
		if (!this.parent) {
			return 0;

		} else {
			return this.parent.depth + 1;
		}
	}

	/**
	 * Sets to a reference to an original object from Component's data.
	 *
	 * @return [description]
	 */
	public get dataContext(): Object {
		return this._dataContext;
	}

	/**
	 * A reference to an original object in Component's data, that this Data Item
	 * is derived from.
	 *
	 * @param value Original data object
	 */
	public set dataContext(value: Object) {
		this._dataContext = value;
	}


	/**
	 * adds a sprite to dataItem.sprites array
	 * @ignore
	 */
	addSprite(sprite: Sprite) {
		if (sprite.dataItem && sprite.dataItem != this) {
			$array.remove(sprite.dataItem.sprites, sprite);
		}
		if (!this.visible) {
			sprite.hide(0);
		}

		if (this.isHiding) {
			sprite.hide();
		}
		this.sprites.push(sprite);
		sprite.dataItem = this;
	}
}
