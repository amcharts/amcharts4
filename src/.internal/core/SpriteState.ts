/**
 * Module contains functionality related to [[Sprite]] states.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "./Base";
import { registry } from "./Registry";
import { Adapter } from "./utils/Adapter";
import { List, ListDisposer } from "./utils/List";
import { Filter } from "./rendering/filters/Filter";
import { Sprite } from "./Sprite";

import { toColor } from "./utils/Color";
import { percent } from "./utils/Percent";
import * as $utils from "./utils/Utils";
import * as $ease from "./utils/Ease";
import * as $object from "./utils/Object";
import * as $type from "./utils/Type";

/**
 * Defines a state for [[Sprite]].
 *
 * A "state" is a special object that has all the same properties as the
 * [[Sprite]] of the same type, and which can be used to quickly apply a set
 * of property values. (set state)
 *
 * When [[Sprite]] (or any object that extends Sprite) is created it creates a
 * "default" state. You can modify the "default" state so that when the Sprite
 * returns to default state certain properties are added.
 *
 * Default state can be accessed using Sprite's `defaultState` getter.
 *
 * ```TypeScript
 * sprite.defaultState.properties.fillOpacity = 0.5;
 * ```
 * ```JavaScript
 * sprite.defaultState.properties.fillOpacity = 0.5;
 * ```
 * ```JSON
 * {
 *   // ...
 *   "defaultState": {
 *     "properties": {
 *       "fillOpacity": 0.5
 *     }
 *   }
 * }
 * ```
 *
 * If Sprite is "hoverable", it automatically adds a "hover" state, which is
 * applied when it has a cursor over it.
 *
 * ```TypeScript
 * let hoverstate = sprite.states.create("hover");
 * hoverstate.properties.fillOpacity = 1;
 * ```
 * ```JavaScript
 * var hoverstate = sprite.states.create("hover");
 * hoverstate.properties.fillOpacity = 1;
 * ```
 * ```JSON
 * {
 *   // ...
 *   "states": {
 *     "hover": {
 *       "properties": {
 *         "fillOpacity": 0.5
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * The above will automatically apply "hover" state when the Sprite is hovered,
 * thus will set its `fillOpacity` property to 1, and will reset it to 0.5 when
 * it's no longer hovered.
 *
 * Every object that inherits from [[Sprite]] can and will add their own
 * properties to the available list.
 *
 * User can create their own states, and apply them as needed:
 *
 * ```TypeScript
 * let myCustomState = sprite.states.create("mystate");
 * myCustomState.properties.fillOpacity = 0.5;
 * myCustomState.properties.strokeOpacity = 0.8;
 * sprite.setState("mystate");
 * ```
 * ```JavaScript
 * var myCustomState = sprite.states.create("mystate");
 * myCustomState.properties.fillOpacity = 0.5;
 * myCustomState.properties.strokeOpacity = 0.8;
 * sprite.setState("mystate");
 * ```
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/states/}
 * @important
 */
export class SpriteState<P, A> extends BaseObject {

	/**
	 * Defines property types.
	 */
	public _properties!: P;

	/**
	 * Defines adapter types.
	 */
	public _adapter!: A;

	/**
	 * Title of the state, i.e. "default", "hidden", etc.
	 */
	public name: string;

	/**
	 * Reference to [[Sprite]] element this State is for.
	 */
	public sprite: $type.Optional<Sprite>;

	/**
	 * @ignore
	 */
	public _adapterO: Adapter<this, A>;

	/**
	 * Holds Adapter.
	 */
	public get adapter(): Adapter<this, A> {
		if (!this._adapterO) {
			this._adapterO = new Adapter<this, A>(this);

			// Decorate adapter with events so that we can apply its settings whenever
			// it is modified
			this._adapterO.events.on("inserted", (ev: any) => {
				(<any>this)[ev.newValue.key] = (<any>this)[ev.newValue.key];
			}, undefined, false);
			this._adapterO.events.on("removed", (ev: any) => {
				(<any>this)[ev.newValue.key] = (<any>this)[ev.newValue.key];
			}, undefined, false);
		}
		return this._adapterO;
	}

	/**
	 * Duration of the transition to this state. 0 means instantenous transition.
	 * Any number means the [[Sprite]] will transit smoothly to this state,
	 * animating all animatable properties.
	 *
	 * @default 0
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
	 */
	public transitionDuration: number = 0;

	/**
	 * Easing function to use when transitioning to this state.
	 *
	 * @default cubicOut
	 * @see {@link Ease}
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
	 */
	public transitionEasing: (value: number) => number = $ease.cubicOut;

	/**
	 * Collection of properties and their values that should be applied to [[Sprite]]
	 * when switching to this State.
	 *
	 * The property values set on a [[SpriteState]] will override the ones set
	 * directly on a [[Sprite]].
	 */
	public properties: P = <P>{};

	/**
	 * A collection of key/value pairs that can be used to bind specific Sprite
	 * properties to [[DataItem]].
	 *
	 * For example: `fill` property can be bound to `myCustomColor` field in
	 * DataItem. The Sprite will automatically get the value for `fill` from its
	 * DataItem.
	 *
	 * SpriteState-specific binding will override binding set directly on
	 * [[Sprite]]. I.e. you can make Sprite use different fill color on hover by
	 * adding a `fill` binding to a different DataItem key for Sprite's "hover"
	 * state object.
	 *
	 * @see {@link Sprite}
	 */
	public propertyFields: { [index in keyof this["_properties"]]?: string } = {};
	//public propertyFields: Dictionary<keyof this["_properties"], string> = new Dictionary<keyof this["_properties"], string>();;

	/**
	 * A list of [[Filter]] elements to be applied to the relative [[Sprite]]
	 * when switching to this State.
	 *
	 * @param {List}
	 */
	public filters = new List<Filter>();

	/**
	 * Identifies if this object is a "template" and should not be treated as
	 * real object that is drawn or actually used in the chart.
	 */
	public isTemplate: boolean = false;

	/**
	 * Constructor
	 */
	constructor() {
		// Init
		super();
		this.className = "SpriteState";

		// Make filter list disposable
		this._disposers.push(new ListDisposer(this.filters));

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Returns [[Sprite]] element's property value.
	 *
	 * Will check if there are any bindings with [[DataItem]] and if there are
	 * any method callbacks set up for the specific property.
	 *
	 * @param propertyName  Property name
	 * @return Property value
	 */
	public getPropertyValue<Key extends keyof P>(propertyName: Key): P[Key] {
		let propValue: any = this.properties[propertyName];
		let sprite: $type.Optional<Sprite> = this.sprite;

		if (sprite) {
			let fieldName: string = this.propertyFields[propertyName];

			if ($type.hasValue(fieldName)) {
				if (sprite.dataItem) {
					propValue = (<any>sprite.dataItem.dataContext)[fieldName];
				}
			}

			// Apply adapters
			// If the value itself is undefined, we're going to pass in Sprite's
			// value to adapters
			// @todo get rid of <any>
			if (!$type.hasValue(propValue)) {
				let spriteValue = sprite.getPropertyValue(<any>propertyName);
				if (this._adapterO) {
					propValue = this._adapterO.apply(<any>propertyName, spriteValue);
				}
				else {
					propValue = spriteValue;
				}

				if (propValue == spriteValue) {
					propValue = undefined;
				}
			} else {
				if (this._adapterO) {
					propValue = this._adapterO.apply(<any>propertyName, propValue)
				}
			}

			/*let method = this.propertyMethods.getKey(propertyName);
			if (method) {
				propValue = method(sprite, propertyName);
			}*/

		}

		return propValue;
	}

	/**
	 * Copies all property and style values from another [[SpriteState]] object.
	 *
	 * @param source  Source [[SpriteState]]
	 */
	public copyFrom(source: this) {
		if (source && source != this) {
			this.transitionDuration = source.transitionDuration;
			this.transitionEasing = source.transitionEasing;

			$utils.copyProperties(source.properties, this.properties);
			$utils.copyProperties(source.propertyFields, this.propertyFields);
			this.filters.copyFrom(source.filters);
			if(source._adapterO){
				this.adapter.copyFrom(source._adapterO);
			}
		}
	}

	/**
	 * Returns all values that should be applied by the SpriteState.
	 *
	 * It takes adapters into account.
	 *
	 * @ignore Exclude from docs
	 * @return Properties
	 * @todo Add adapter values
	 * @todo proper type this["_properties"]
	 */
	public get allValues(): P {

		// Init return value
		let res: P = <P>{};

		// Apply adapters to all values
		$object.each(this.properties, (prop, value) => {
			res[prop] = this.getPropertyValue(prop);
		});

		// Cycle through all adapters and add values for missing properties
		if(this._adapterO){
			let keys = this._adapterO.keys();

			$object.each(keys, (_x, prop) => {
				let value = this.getPropertyValue<any>(prop);
				(<any>res)[prop] = value;
			});
		}

		// Cycle through all property fileds and add values for missing properties
		let propertyFields = this.propertyFields;

		$object.each(propertyFields, (prop) => {
			let value = this.getPropertyValue<any>(prop);
			(<any>res)[prop] = value;
		});

		return res;
	}

	/**
	 * Resets the State to initial state - no values or Filters applied.
	 */
	public reset(): void {
		this.properties = <P>{};
		this.filters.clear();
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if ($type.hasValue(config) && $type.hasValue(config["properties"])) {
			$object.each(config["properties"], (key, value) => {
				if ($type.isString(value)) {
					if (value.match(/^[0-9.\-]+\%$/)) {
						config["properties"][key] = percent($type.toNumber(value));
					}
					else if (value.match(/^\#[0-9abcdef]{3,}$/i)) {
						config["properties"][key] = toColor(value);
					}
				}
			});
		}

		super.processConfig(config);
	}

	/**
	 * Adds easing functions to "function" fields.
	 *
	 * @param field  Field name
	 * @return Assign as function?
	 */
	protected asFunction(field: string): boolean {
		return field == "transitionEasing" || super.asIs(field);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SpriteState"] = SpriteState;
