/**
 * An Adapter can be used to apply chained synchronous transformations to any
 * value at runtime.
 *
 * Each type class using Adapters must have `adapters` property and adapter
 * interface defined.
 *
 * Adapters can be used to allow external code to apply transformations to any
 * value at any time.
 *
 * For example we have a Weather class which has a method `now()` which returns
 * current temperature.
 *
 * ```
 * function now() {
 *   // ... calculate temperature
 *   let temp = "Temperature now is " + degrees + "F";
 *   return temp;
 * }
 * ```
 *
 * Now, supposed we want to let other classes to modify the output of the
 * `now()`? We just apply an adapter to the `temp` before it is returned:
 *
 * ```
 * temp = this.adapters.apply("now", {
 *   temp: temp,
 *   degrees: degrees
 * }).temp;
 * ```
 *
 * Some other class might tap onto it by defining an Adapter that calculates
 * the temperature in Celsius:
 *
 * weather.adapters.add("now", (arg) => {
 *   arg.temp += "(" + farenheitToCelsius(arg.degrees) + "C)";
 *   return arh;
 * });
 *
 * Furthermore some time-related class could add time:
 *
 * weather.adapters.add("now", (arg) => {
 *   arg.temp += "; the time now is " + (new Date().toLocaleString());
 *   return arh;
 * });
 *
 * So without adapters we would get output like this:
 *
 * ```
 * Temperature now is 90F
 * ```
 *
 * With adapters applied we now have:
 *
 * ```
 * Temperature now is 90F (32C); the time now is 12/11/2012, 7:00:00 PM
 * ```
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SortedList } from "./SortedList";
import { EventDispatcher } from "./EventDispatcher";
import * as $number from "./Number";
import * as $order from "./Order";
import * as $iter from "../utils/Iterator";
import * as $array from "../utils/Array";
import * as $type from "../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Adapter interface.
 */
interface IAdapterCallback<Target, T> {
	id: number;
	key: any;
	callback: any;
	scope: any;
	priority: number;
}

/**
 * Defines an interface for a global adapter.
 */
interface IGlobalAdapterCallback {
	id: number;
	key: string;
	callback: <T, Target, Key extends keyof T, C>(this: C, value: T[Key], target: Target, key?: keyof T) => T[Key];
	scope: any;
	priority: number;
	type: { new(): any };
}


/**
 * ============================================================================
 * GLOBAL ADAPTER
 * ============================================================================
 * @hidden
 */

/**
 * A global adapter is an adpater that is attached to a class type rather than
 * specific object instance.
 *
 * @ignore Exclude from docs
 */
export class GlobalAdapter {

	/**
	 * Callback id iterator.
	 */
	private _callbackId: number = 0;

	/**
	 * A list of if callbacks (adapters).
	 */
	private _callbacks = new SortedList<IGlobalAdapterCallback>((left, right) => {
		return $order.or($number.order(left.priority, right.priority),
			$number.order(left.id, right.id));
	});

	public addAll<T, Target, Key extends keyof T>(
		type: { new(): Target },
		key: Key,
		callback: (value: T[Key], target: Target, key: keyof T) => T[Key],
		priority?: number
	): void;

	public addAll<T, Target, Key extends keyof T, C>(
		type: { new(): Target },
		key: Key,
		callback: (this: C, value: T[Key], target: Target, key: keyof T) => T[Key],
		priority?: number,
		scope?: C
	): void;

	/**
	 * Adds a global callback which is not specific to any particular object.
	 * Whenever an adapter in any object of the specific class type is invoked
	 * global adapters will kick in.
	 *
	 * @param type      Class type
	 * @param key       Adapter key
	 * @param callback  Callback function
	 * @param priority  Priority (higher priority meaning adapter will be applied later)
	 * @param scope     Callback function scaope
	 */
	public addAll(type: any, key: any, callback: any, priority: number = 0, scope?: any): void {
		this._callbacks.insert({
			id: ++this._callbackId,
			key: key,
			callback: callback,
			priority: priority,
			scope: scope,
			type: type
		});
	}

	/**
	 * Returns if there are adapters for specific type available.
	 *
	 * @param type  Adapter type
	 * @param key   Adapter key
	 * @return {boolean}
	 */
	public isEnabled<T, Target, Key extends keyof T>(type: Target, key: Key): boolean {
		// TODO check the type and key
		return this._callbacks.length > 0;
	}

	/**
	 * Applies global adapters for the object of the specific type.
	 *
	 * @param type   Class type
	 * @param key    Adapter key
	 * @param value  Value
	 */
	public applyAll<T, Target, Key extends keyof T = keyof T>(type: Target, key: Key, value: T[Key]): T[Key] {
		// This is needed to improve the performance and reduce garbage collection
		const callbacks = this._callbacks.values;
		const length = callbacks.length;

		if (length == 0) {
			return value;
		}

		// Cycle through all callbacks and find the ones we need to use
		for (let i = 0; i < length; ++i) {
			const item = callbacks[i];

			if (item.key === key && type instanceof item.type) {
				value = item.callback.call(item.scope, value, type, key);
			}
		}

		return value;
	}

}

/**
 * A global Adapter for plugins that want to add specific
 * functionality for any chart, not just specific instance.
 *
 * If you want to add an adapter which applies to all instances of the same
 * object type, like, for instance all slices in PieSeries, you can use
 * global adapter.
 *
 * Global adapter is a system-wide instance, accessible via `globalAdapter`.
 *
 * ```TypeScript
 * am4core.globalAdapter.addAll<am4charts.IPieSeriesAdapters, am4charts.PieSeries, "fill">(am4charts.PieSeries, "fill", (value, target, key) => {
 *   return am4core.color("#005500");
 * });
 * ```
 * ```JavaScript
 * am4core.globalAdapter.addAll(am4charts.PieSeries, "fill", (value, target, key) => {
 *   return am4core.color("#005500");
 * });
 * ```
 *
 * @todo Description (improve)
 */
export let globalAdapter: GlobalAdapter = new GlobalAdapter();


/**
 * ============================================================================
 * REGULAR ADAPTER
 * ============================================================================
 * @hidden
 */

/**
 * Adapter allows adding ordered callback functions and associating them with a
 * string-based key. An Adapter user can then easily invoke those callbacks to
 * apply custom functions on its input, output or intermediate values.
 *
 * Custom code and plugins can add their own callbacks to modify and enhance
 * core functionality.
 *
 * See the description of `add()` for an example.
 *
 * Almost any object in amCharts4 has own adapter, accessible with `adapter`
 * property.
 *
 * Any adapters added to it will be applied to that object only.
 *
 * ### Global Adapters
 *
 * If you want to add an adapter which applies to all instances of the same
 * object type, like, for instance all slices in PieSeries, you can use
 * global adapter.
 *
 * Global adapter is a system-wide instance, accessible via `globalAdapter`.
 *
 * ```TypeScript
 * am4core.globalAdapter.addAll<am4charts.IPieSeriesAdapters, am4charts.PieSeries, "fill">(am4charts.PieSeries. "fill", (value, target, key) => {
 *   return am4core.color("#005500");
 * });
 * ```
 * ```JavaScript
 * am4core.globalAdapter.addAll(am4charts.PieSeries. "fill", (value, target, key) => {
 *   return am4core.color("#005500");
 * });
 * ```
 *
 * {@link https://www.amcharts.com/docs/v4/reference/adapter_module/#globalAdapter_property More info}.
 *
 * @important
 */
export class Adapter<Target, T> {

	/**
	 * Internal counter for callback ids.
	 */
	private _callbackId: number = 0;

	/**
	 * A list of adapter callbacks.
	 *
	 * @param $number.order(left.priority, right.priority) [description]
	 * @param $number.order(left.id,       right.id));	}  [description]
	 */
	private _callbacks = new SortedList<IAdapterCallback<Target, T>>((left, right) => {
		return $order.or($number.order(left.priority, right.priority),
			$number.order(left.id, right.id));
	});

	/**
	 * Holds an object reference this Adapter is for.
	 */
	public object: Target;

	/**
	 * Event dispatcher.
	 */
	public events: EventDispatcher<{
		inserted: {};
		removed: {};
	}>;

	/**
	 * Constructor, sets the object referece this Adapter should be used for.
	 *
	 * @param c Object
	 */
	constructor(c: Target) {
		this.object = c;

		// TODO this exposes the internal events
		this.events = this._callbacks.events;
	}

	/**
	 * Adds a callback for a specific key.
	 *
	 * ```TypeScript
	 * // Override fill color value and make all slices green
	 * chart.series.template.adapter.add("fill", (value, target, key) => {
	 *   return am4core.color("#005500");
	 * });
	 * ```
	 * ```JavaScript
	 * // Override fill color value and make all slices green
	 * chart.series.template.adapter.add("fill", function(value, target, key) {
	 *   return am4core.color("#005500");
	 * });
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     // ...
	 *     "adapter": {
	 *     	// Override fill color value and make all slices green
	 *     	"fill": function(value, target, key) {
	 *     	  return am4core.color("#005500");
	 *     	}
	 *     }
	 *   }]
	 * }
	 * ```
	 *
	 * The above will call user-defined function (adapter) whenever `fill` value
	 * is requested from the Pie series, allowing it to override the default
	 * using custom code and any fuzzy logic.
	 *
	 * There can be any number of adapters set on one property key.
	 *
	 * In this case adapters will be applied in daisy-chain fashion. The first
	 * adapter in queue will make its transformation. The next one will have
	 * the output of the first adapter as a starting value, etc.
	 *
	 * The order of the adapters are determined either by the order they were
	 * added in, or their `priority` value.
	 *
	 * The heigher the `priority`, the later in the game adapter will be applied.
	 *
	 * @param key       Key
	 * @param callback  A callback function
	 * @param priority  The higher priority, the more chance the adapter will be applied last
	 * @param scope     Scope for the callback function
	 */
	public add<Key extends keyof T, C>(key: Key, callback: (this: C, value: T[Key], target: Target, key: Key) => T[Key], priority: number = 0, scope?: C): void {
		this._callbacks.insert({
			id: ++this._callbackId,
			key: key,
			callback: callback,
			priority: priority,
			scope: scope
		});
	}

	/**
	 * Checks whether specific adapter is already set.
	 *
	 * @param key       Key
	 * @param callback  A callback function
	 * @param priority  The higher priority, the more chance the adapter will be applied last
	 * @param scope     Scope for the callback function
	 * @returns                            Adapter set?
	 */
	public has<Key extends keyof T, C>(key: Key, callback: (this: C, value: T[Key], target: Target, key: Key) => T[Key], priority: number = 0, scope?: C): boolean {
		return $iter.contains(this._callbacks.iterator(), (item) => {
			return item.key === key && item.callback === callback && item.priority === priority && item.scope === scope;
		});
	}

	/**
	 * Removes adapter callbacks for the specific `key`.
	 *
	 * If `priority` is specified, only callbacks for that priority are removed.
	 *
	 * @param key      Key
	 * @param priority Priority
	 * @todo Implement
	 */
	public remove(key: string, priority?: number): void {
		// It has to make a copy because it removes the elements while iterating
		// TODO inefficient
		$array.each($iter.toArray(this._callbacks.iterator()), (item) => {
			// TODO test this
			if (item.key === key && (!$type.isNumber(priority) || priority === item.priority)) {
				this._callbacks.remove(item);
			}
		});
	}

	/**
	 * Returns if there are any adapters set for the specific `key`.
	 *
	 * @returns Are there any adapters for the key?
	 */
	public isEnabled<Key extends keyof T>(key: Key): boolean {
		// TODO check the key
		return this._callbacks.length > 0 || globalAdapter.isEnabled<T, Target, Key>(this.object, key);
	}

	/**
	 * Passes the input value through all the callbacks for the defined `key`.
	 *
	 * @param key      Key
	 * @param value    Input value
	 * @param ...rest  Rest of the parameters to be passed into callback
	 * @return Output value
	 */
	public apply<Key extends keyof T>(key: Key, value: T[Key]): T[Key] {
		// This is needed to improve the performance and reduce garbage collection
		const callbacks = this._callbacks.values;
		const length = callbacks.length;

		if (length > 0) {
			for (let i = 0; i < length; ++i) {
				const item = callbacks[i];

				if (item.key === key) {
					value = item.callback.call(item.scope, value, this.object, key);
				}
			}
		}

		// Apply global adapters
		value = globalAdapter.applyAll<T, Target, Key>(this.object, key, value);

		return value;
	}

	/**
	 * Returns all adapter keys that are currently in effect.
	 *
	 * @return Adapter keys
	 */
	public keys(): Array<string> {
		// TODO inefficient
		return $iter.toArray($iter.map(this._callbacks.iterator(), (x) => x.key));
	}


	/**
	 * Copies all the adapter callbacks from `source`.
	 *
	 * @param source  An Adapter to copy items from
	 */
	public copyFrom(source: this): void {
		$iter.each(source._callbacks.iterator(), (x) => {
			this.add(x.key, x.callback, x.priority, x.scope);
		});
	}

	/**
	 * Clears all callbacks from this Adapter.
	 */
	public clear(): void {
		this._callbacks.clear();
	}

}
