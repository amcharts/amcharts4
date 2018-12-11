/**
 * Base functionality
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IClone } from "./utils/Clone";
import { List, ListTemplate } from "./utils/List";
import { Dictionary, DictionaryTemplate } from "./utils/Dictionary";
import { Disposer, IDisposer } from "./utils/Disposer";
import { EventDispatcher, AMEvent } from "./utils/EventDispatcher";
import { Adapter } from "./utils/Adapter";
import { Color, color } from "./utils/Color";
import { Percent, percent } from "./utils/Percent";
import { ITheme } from "../themes/ITheme";
import { Ordering } from "./utils/Order";

import { registry } from "./Registry";
import { cache } from "./utils/Cache";

import * as $array from "./utils/Array";
import * as $object from "./utils/Object";
import * as $type from "./utils/Type";

//import * as $debug from "./utils/Debug";

/**
 * Provides base functionality for all derivative objects, like generating ids,
 * handling cache, etc.
 */
export class BaseObject implements IClone<BaseObject>, IDisposer {

	/**
	 * A unique ID for this object.
	 *
	 * Generated on first access by `uid()` getter.
	 *
	 * @type {Optional<string>}
	 * @ignore Exclude from docs
	 */
	protected _uid: $type.Optional<string>;

	/**
	 * Indicates if this object has already been deleted. Any
	 * destruction/disposal code should take this into account when deciding
	 * wheter to run potentially costly disposal operations if they already have
	 * been run.
	 *
	 * @type {boolean}
	 * @ignore Exclude from docs
	 */
	protected _disposed: boolean = false;

	/**
	 * List of IDisposer which will be disposed when the BaseObject is disposed.
	 *
	 * @ignore Exclude from docs
	 */
	protected _disposers: Array<IDisposer> = [];

	/**
	 * User-defined id of the object.
	 *
	 * @type {Optional<string>}
	 * @ignore Exclude from docs
	 */
	protected _id: $type.Optional<string>;

	/**
	 * Holds a universal mapping collection, so that elements and their children
	 * can create and look up all kinds of relations between id and object.
	 *
	 * @type {Optional<Dictionary<string, any>>}
	 * @ignore Exclude from docs
	 */
	protected _map: $type.Optional<Dictionary<string, any>>;

	/**
	 * The theme used by this object.
	 *
	 * @type {Optional<ITheme[]>}
	 * @ignore Exclude from docs
	 */
	protected _themes: $type.Optional<ITheme[]>;

	// @review
	/**
	 * A list of objects that are clones of this object. An object needs to
	 * maintain a list of its clones so that properties can be re-applied to
	 * clones whenever property on the object they were cloned from changes.
	 *
	 * @type {Optional<Dictionary<string, this>>}
	 */
	protected _clones: $type.Optional<List<this>>;


	// @review
	/**
	 * Reference to the original object this object was cloned from. We need to
	 * keep this so we can disassociate it from source object when this object
	 * is disposed.
	 *
	 * @type {Optional<this>}
	 */
	public clonedFrom: $type.Optional<this>;

	/**
	 * A class name for the object.
	 *
	 * This property is used by deriving classes to identify which class it is.
	 * We could derive the class name from the object itself, however method of
	 * doing so is too costly, so we are relying on this property to quickly
	 * access type of class.
	 *
	 * @type {Optional<string>}
	 * @ignore Exclude from docs
	 */
	protected _className: $type.Optional<string>;

	/**
	 * [cloneId description]
	 *
	 * @type {Optional<string>}
	 * @todo Needs description
	 * @ignore Exclude from docs
	 */
	public cloneId: $type.Optional<string>;

	//protected _classes: { [index: string]: any } = {};

	/**
	 * Constructor
	 * * Sets class name
	 */
	constructor() {
		this.className = "BaseObject";
		//this.debug();
	}

	protected debug(): void {
		//$debug.debug(this);
	}

	/**
	 * Returns object's internal unique ID.
	 *
	 * @return {string} Unique ID
	 */
	public get uid(): string {
		if (!this._uid) {
			this._uid = registry.getUniqueId();
			registry.map.setKey(this._uid, this);
		}
		return this._uid;
	}

	/**
	 * Sets the user-defined id of the element.
	 *
	 * @param {Optional<string>} value Id
	 */
	public set id(value: $type.Optional<string>) {
		//registry.map.setKey(value, this); // registry.map only stores by uid
		this._id = value;
	}

	/**
	 * @return {Optional<string>} Id
	 */
	public get id(): $type.Optional<string> {
		return this._id;
	}

	/**
	 * Returns a universal collection for mapping ids with objects.
	 *
	 * @ignore Exclude from docs
	 * @return {Dictionary<string, any>} Map collection
	 */
	public get map(): Dictionary<string, any> {
		if (!this._map) {
			this._map = new Dictionary<string, any>();
		}
		return this._map;
	}

	/**
	 * Applies properties from all assigned themes.
	 *
	 * @ignore Exclude from docs
	 */
	public applyTheme(): void {
		// TODO is this needed ?
		if (registry) {
			let themes = this.getCurrentThemes();

			// TODO is this needed ?
			if (themes) {
				$array.each(themes, (theme, index) => {
					theme(this);
				});
			}
		}
	}

	/**
	 * A list of themes to be used for this element.
	 *
	 * @ignore Exclude from docs
	 * @param {Optional<ITheme[]>} value An array of themes
	 */
	public set themes(value: $type.Optional<ITheme[]>) {
		this._themes = value;
	}

	/**
	 * @ignore Exclude from docs
	 * @return {Optional<ITheme[]>} An array of themes
	 */
	public get themes(): $type.Optional<ITheme[]> {
		return this._themes;
	}

	/**
	 * Returns a list of themes that should be applied to this element. It could
	 * either be a list of themes set explicitly on this element, or system-wide.
	 *
	 * @return {ITheme[]} List of themes
	 */
	public getCurrentThemes(): ITheme[] {
		return this.themes || registry.themes;
	}

	/**
	 * Returns if this object has been already been disposed.
	 *
	 * @return {boolean} Is disposed?
	 */
	public isDisposed(): boolean {
		return this._disposed;
	}

	/**
	 * Destroys this object and all related data.
	 */
	public dispose(): void {
		if (!this._disposed) {
			this._disposed = true;

			const a = this._disposers;

			this._disposers = <any>null;

			while (a.length !== 0) {
				const disposer = a.shift();
				disposer.dispose();
			}

			// Clear cache
			this.clearCache();

			// remove from clones list
			if (this.clonedFrom) {
				this.clonedFrom.clones.removeValue(this);
			}

			const uid = this._uid;

			if (uid != null) {
				registry.map.removeKey(uid);
			}
		}
	}

	/**
	 * Adds an IDisposer, which will be disposed when this object is disposed.
	 *
	 * @param {IDisposer} target Object to dispose
	 * @ignore Exclude from docs
	 */
	public addDisposer(target: IDisposer): void {
		this._disposers.push(target);
	}

	/**
	 * Disposes disposable object and removes it from `_disposers`.
	 *
	 * @param {IDisposer} target Object to dispose
	 * @ignore Exclude from docs
	 */
	public removeDispose(target: IDisposer): void {
		//if(target){
		if (!this._disposed) {
			let index = $array.indexOf(this._disposers, target);
			if (index > -1) {
				this._disposers.splice(index, 1);
			}
		}

		target.dispose();
		//}
	}

	/**
	 * Makes a copy of this object and returns the clone. Try to avoid cloning complex objects like chart, create new instances if you need them.
	 *
	 * @param   {string}  cloneId  An id to use for clone (if not set a unique id will be generated)
	 * @returns {Object}           Clone
	 */
	public clone<A extends this>(cloneId?: string): this {
		if (!cloneId) {
			cloneId = "clone-" + registry.getUniqueId();
		}

		let newObject: this = new (<{ new(): A; }>this.constructor)();
		newObject.cloneId = cloneId;

		newObject.copyFrom(this);

		// add to clones list
		// this.clones.push(newObject); // moved this to copyFrom


		return newObject;
	}

	/**
	 * Returns a collection of object's clones.
	 *
	 * @ignore Exclude from docs
	 * @return {Dictionary<string, this>} Clones
	 */
	public get clones(): List<this> {
		if (!this._clones) {
			this._clones = new List<this>();
		}
		return this._clones;
	}

	/**
	 * Copies all properties and related data from different element.
	 *
	 * @param {this} object Source element
	 */
	public copyFrom(object: this): void {
		object.clones.moveValue(this);
		this.clonedFrom = object;
	}

	/**
	 * Element's class name. (a class that was used to instantiate the element)
	 *
	 * @ignore Exclude from docs
	 * @param {string}  value  Class name
	 */
	public set className(value: $type.Optional<string>) {
		this._className = value;
		/*if (registry) {
			registry.registeredClasses[value] = typeof this;
		}*/
	}

	/**
	 * @ignore Exclude from docs
	 * @return {string} Class name
	 */
	public get className(): $type.Optional<string> {
		return this._className;
	}

	/**
	 * Caches value in object's cache.
	 *
	 * @ignore Exclude from docs
	 * @param {string}  key    Key
	 * @param {any}     value  Value
	 * @param {number}  ttl    TTL in seconds
	 */
	public setCache(key: string, value: any, ttl?: number): void {
		cache.set(this.uid, key, value, ttl);
	}

	/**
	 * Retrieves cached value.
	 *
	 * If optional second padarameter is specified, it will return that value
	 * if cache is not available or is expired.
	 *
	 * @ignore Exclude from docs
	 * @param  {string}  key    Key
	 * @param  {any}     value  Value to return if cache is not available
	 * @return {any}            Value
	 */
	public getCache(key: string, value: any = undefined): any {
		return cache.get(this.uid, key, value);
	}

	/**
	 * Clears object's local cache.
	 *
	 * @ignore Exclude from docs
	 */
	public clearCache(): void {
		cache.clear(this.uid);
	}

	/**
	 * Creates [[Disposer]] for `setTimeout` function call. This ensures that all
	 * timeouts created by the object will be cleared when object itself is
	 * disposed.
	 *
	 * @ignore Exclude from docs
	 * @param  {() => void}  fn     Callback function
	 * @param  {number}      delay  Timeout (ms)
	 * @return {IDisposer}          Disposer for timeout
	 */
	public setTimeout(fn: () => void, delay: number): IDisposer {
		const id = setTimeout(() => {
			this.removeDispose(disposer);
			fn();
		}, delay);

		const disposer = new Disposer(() => {
			clearTimeout(id);
		});

		this._disposers.push(disposer);
		return disposer;
	}

	/**
	 * Creates [[Disposer]] for `setInterval` function call. This ensures that all
	 * timeouts created by the object will be cleared when object itself is
	 * disposed.
	 *
	 * @ignore Exclude from docs
	 * @param  {() => void}  fn     Callback function
	 * @param  {number}      delay  Timeout (ms)
	 * @return {IDisposer}          Disposer for timeout
	 */
	public setInterval(fn: () => void, delay: number): IDisposer {
		const id = setInterval(() => {
			this.removeDispose(disposer);
			fn();
		}, delay);

		const disposer = new Disposer(() => {
			clearTimeout(id);
		});

		this._disposers.push(disposer);
		return disposer;
	}

	/**
	 * ==========================================================================
	 * JSON-BASED CONFIG PROCESSING
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Use this property to set JSON-based config. When set, triggers processing
	 * routine, which will go through all properties, and try to apply values,
	 * create instances, etc.
	 *
	 * Use this with caution, as it is a time-consuming process. It's used for
	 * initialchart setup only, not routine operations.
	 *
	 * @param {object} json JSON config
	 */
	public set config(config: object) {
		try {
			this.processConfig(config);
		}
		catch (e) {
			/*if (this instanceof Sprite) {
				this.raiseCriticalError(e);
			}*/
			(<any>this).raiseCriticalError(e);
		}
	}

	/**
	 * Processes the JSON config.
	 *
	 * @param {object}  json  JSON config
	 * @ignore Exclude from docs
	 */
	protected processConfig(config?: object): void {

		if (!config) {
			return;
		}

		// Get target
		let target = <any>this;

		// Iterate through all of the items
		$object.eachOrdered(config, (configKey, value) => {
			let configValue: any = value;

			// Is this a callback?
			if (configKey == "callback" && typeof value == "function") {
				(<any>value).call(target);
			}

			// Check if there's a property in target
			if (this.hasProperty(configKey)) {

				let item: any;

				// Do we have instructions to create an object?
				if ($type.isObject(configValue) && $type.hasValue((<any>configValue)["type"])) {
					// Create new instance
					if (item = this.createClassInstance((<any>configValue)["type"])) {
						target[configKey] = item;
					}
					else {
						item = target[configKey];
					}

				}
				else {
					// Get item from the object
					item = target[configKey];
				}

				/**
				 * It is...
				 * --------------------------------------------------------------------
				 */

				if (item instanceof Adapter) {

					// ... an Adapter, try to add handlers to it
					// ------------------------------------------------------------------
					this.processAdapters(item, configValue);

				}
				else if (item instanceof EventDispatcher) {

					// ... an EventDispatcher, try to add handlers to it
					// ------------------------------------------------------------------
					this.processEvents(item, configValue);

				}
				else if (this.asIs(configKey)) {

					// ... a special field, just set it to new value
					// ------------------------------------------------------------------
					// (no need to add each indvidual item)
					target[configKey] = configValue;

				}
				else if (<any>configValue instanceof BaseObject) {

					// ... a BaseObject object, we just going to use it as it is
					// ------------------------------------------------------------------
					target[configKey] = configValue;

				}
				else if (item instanceof BaseObject) {

					// ... another child BaseObject
					// ------------------------------------------------------------------
					// Let's just pass in config part in and let itself deal with it
					item.config = configValue;

				}
				else if (item instanceof ListTemplate) {

					// ... a list with template
					// ------------------------------------------------------------------

					// Let's see what we can do with it
					if ($type.isArray(configValue)) {

						// It's an array.
						// Create a list item for entry, or try to apply properties to an
						// existing entry if possible and it is present.
						$array.each(configValue, (entry, index) => {
							let type = this.getConfigEntryType(entry);
							let listItem;
							if (item.hasIndex(index) && !entry["forceCreate"]) {
								listItem = item.getIndex(index);
							}
							else if (<any>entry instanceof BaseObject) {
								// Item is already a BaseObject, no need to process it further
								item.push(entry);
								return;
							}
							else if (type) {
								listItem = item.create(type);
							}
							else {
								listItem = item.create();
							}

							if ($type.isObject(entry)) {

								// If the list item is BaseObject, we just need to let it
								// deal if its own config
								if (listItem instanceof BaseObject) {
									(<any>listItem).config = entry;
								}
								else if ($type.isObject(listItem) && $type.isObject(entry)) {
									$object.copyAllProperties(<Object>entry, <Object>listItem);
								}
								else {
									item.setIndex(item.indexOf(listItem), entry);
								}

							}
						});

						// Truncate the list if it contains less items than the config
						// array
						while (configValue.length > item.length) {
							item.pop();
						}

					}
					else if ($type.isObject(configValue)) {
						// It's a single oject.
						// Treat it as a template.
						if (<any>configValue instanceof BaseObject) {
							// Item is already a BaseObject, no need to process it further
							item.template = configValue;
						}
						else if (item.template instanceof BaseObject) {
							// Template is a BaseObject so we will just let its config
							// deal with the configuration
							(<any>item.template).config = configValue;
						}
						else {
							$object.each(configValue, (entryKey, entryValue) => {

								let listItem = (<any>item.template)[entryKey];

								if (listItem instanceof Adapter) {
									this.processAdapters(listItem, entryValue);
								}
								else if (listItem instanceof EventDispatcher) {
									this.processEvents(listItem, entryValue);
								}
								else if (listItem instanceof DictionaryTemplate) {
									this.processDictionaryTemplate(listItem, entryValue);
								}
								else if (item.template[entryKey] instanceof BaseObject) {
									// Template is a BaseObject. Let it deal with its own config.
									(<any>item.template[entryKey]).config = entryValue;
								}
								else if ($type.isObject(entryValue) && $type.hasValue((<any>entryValue)["type"])) {
									if (listItem = this.createClassInstance((<any>entryValue)["type"])) {
										if (listItem instanceof BaseObject) {
											listItem.config = entryValue;
										}
										item.template[entryKey] = listItem;
									}
									else {
										item.template[entryKey] = entryValue;
									}
								}
								else if (listItem instanceof List) {
									// It's List, process it
									this.processList(entryValue, listItem);
								}
								else {
									// Aything else. Just assing and be done with it.
									item.template[entryKey] = this.maybeColorOrPercent(entryValue);
								}
							});
						}

					}
					else {

						// Something else?
						// Not sure what to do with it on a list - ignore

					}

				}

				else if (item instanceof List) {

					// ... a list
					// ------------------------------------------------------------------

					this.processList(configValue, item);

				}

				else if (item instanceof DictionaryTemplate) {

					// ... a dictionary with template
					// ------------------------------------------------------------------

					this.processDictionaryTemplate(item, configValue);

				}

				else if (item instanceof Dictionary) {

					// ... a dictionary
					// ------------------------------------------------------------------
					
					this.processDictionary(item, configValue);

				}

				else if (item instanceof Color || item instanceof Percent) {

					// ... it's a Color or Percent
					// ------------------------------------------------------------------
					target[configKey] = this.maybeColorOrPercent(configValue);

				}

				else if ($type.isObject(item) && $type.isObject(configValue)) {

					// ... a regular object
					// ------------------------------------------------------------------

					$object.copyAllProperties(<Object>configValue, <Object>item);

				}

				else {

					// ... something else - probably a simple property or object
					// ------------------------------------------------------------------

					// Maybe convert to `Percent` or `Color`?
					configValue = this.maybeColorOrPercent(configValue);

					// Assign
					target[configKey] = configValue;

				}

			}
		}, this.configOrder);

	}

	/**
	 * Tries to detect if value is color or percent and converts to proper object
	 * if necessary.
	 *
	 * Returns the same source value if no color/percent detected
	 *
	 * @param  {any}  value  Source value
	 * @return {any}         Converted value
	 */
	protected maybeColorOrPercent(value: any): any {
		if ($type.isString(value)) {
			if (value.match(/^[0-9.\-]+\%$/)) {
				return percent($type.toNumber(value));
			}
			else if (value.match(/^\#[0-9abcdef]{3,}$/i)) {
				return color(value);
			}
		}
		return value;
	}

	protected processAdapters(item: Adapter<any, any>, config: any): void {
		if ($type.isArray(config)) {
			$array.each(config, (entry: { key: string, callback: any, priority?: number }, index) => {
				item.add(entry.key, entry.callback, entry.priority || 0, this);
			});
		}
		else if ($type.isObject(config)) {
			$object.each(config, (key, entry) => {
				if (!item.has(key, entry)) {
					item.add(key, entry);
				}
			});
		}
	}

	protected processEvents(item: EventDispatcher<any>, config: any): void {
		if ($type.isObject(config)) {
			$object.each(config, (key, entry) => {
				if (!item.has(key, entry)) {
					item.on(key, entry);
				}
			});
		}
		else if ($type.isArray(config)) {
			$array.each(config, (entry: { type: string, callback: any }, index) => {
				item.on(entry.type, entry.callback, this);
			});
		}
	}

	/**
	 * Processes JSON config for a [[DictionaryTemplate]] item.
	 *
	 * @todo Description
	 * @param {DictionaryTemplate<any, any>}  item    Item
	 * @param {any}                           config  Config
	 */
	protected processDictionaryTemplate(item: DictionaryTemplate<any, any>, config: any): void {

		// We can only process object
		// Not sure what to do with other types - ignore
		if ($type.isObject(config)) {

			// Create an entry for each item, or override properties for
			// existing one.
			$object.each(config, (entryKey, entryValue) => {
				let listItem;

				// Get existing one, or create a new one
				if (entryKey == "template") {
					listItem = item.template;
				}
				else if (item.hasKey(entryKey)) {
					listItem = item.getKey(entryKey);
				}
				else {
					listItem = item.create(entryKey);
				}

				// Set data
				if (listItem instanceof BaseObject) {
					listItem.config = entryValue;
				}
				else if ($type.isObject(listItem) && $type.isObject(entryValue)) {
					$object.copyAllProperties(<Object>entryValue, <Object>listItem);
				}
				else {
					listItem.setKey(entryKey, entryValue);
				}
			});

		}
	}

	/**
	 * Processes JSON config for a [[Dictionary]] item.
	 *
	 * @todo Description
	 * @param {Dictionary<any, any>}  item    Item
	 * @param {any}                   config  Config
	 */
	protected processDictionary(item: Dictionary<any, any>, config: any): void {

		// We can only process object
		// Not sure what to do with other types - ignore
		if ($type.isObject(config)) {

			// Create an entry for each item, or override properties for
			// existing one.
			// @todo support for non-basic types
			$object.each(config, (entryKey, entryValue) => {
					item.setKey(entryKey, entryValue);
			});

		}
	}

	/**
	 * Processes [[List]].
	 *
	 * @param {any}        configValue  Config value
	 * @param {List<any>}  item         Item
	 */
	protected processList(configValue: any, item: List<any>): void {

		// Convert to array if necessary
		if (!$type.isArray(configValue)) {
			configValue = [configValue];
		}

		// It's an array
		// Create a list item for entry
		const itemCount = item.length;
		$array.each(configValue, (entry, index) => {

			if ($type.isObject(entry)) {

				// An object.
				//
				// Let's see if we can instantiate a class out of it, or we need
				// to push it into list as it is.
				//
				// If there are items already at the specified index in the list,
				// apply properties rather than create a new one.

				let listItem;
				if ((index < (itemCount - 1)) && !(<any>entry)["forceCreate"]) {
					listItem = item.getIndex(index);
				}
				else if (<any>entry instanceof BaseObject) {
					// Item is already a BaseObject, no need to process it further
					item.push(entry);
					return;
				}
				else {
					listItem = this.createEntryInstance(entry);
					item.push(listItem);
				}

				// If the list item is BaseObject, we just need to let it
				// deal if its own config
				if (listItem instanceof BaseObject) {
					(<any>listItem).config = entry;
				}

			}
			else {

				// Basic value.
				// Just push it into list, or override existing value
				if (item.hasIndex(index)) {
					item.setIndex(index, entry);
				}
				else {
					item.push(entry);
				}

			}

		});

		// Truncate the list if it contains less items than the config
		// array
		while (configValue.length > item.length) {
			item.pop();
		}

	}

	/**
	 * This function is used to sort element's JSON config properties, so that
	 * some properties that absolutely need to be processed last, can be put at
	 * the end.
	 *
	 * @ignore Exclude from docs
	 * @param  {string}  a  Element 1
	 * @param  {string}  b  Element 2
	 * @return {Ordering}   Sorting number
	 */
	protected configOrder(a: string, b: string): Ordering {
		if (a == b) {
			return 0;
		}

		// Language must come first, so it's all set up when the rest of the
		// elements are being instantiated
		else if (a == "language") {
			return -1;
		}
		else if (b == "language") {
			return 1;
		}

		else {
			return 0;
		}
	}

	/**
	 * Checks if field should be just assigned as is, without any checking when
	 * processing JSON config.
	 *
	 * Extending functions can override this function to do their own checks.
	 *
	 * @param  {string}   field  Field name
	 * @return {boolean}         Assign as is?
	 */
	protected asIs(field: string): boolean {
		return $array.indexOf(["locale"], field) != -1;
	}

	/**
	 * Creates a relevant class instance if such class definition exists.
	 *
	 * @ignore Exclude from docs
	 * @param  {string}  className  Class name
	 * @return {Object}             Instance
	 */
	protected createClassInstance(className: string): Object {
		if ($type.hasValue(registry.registeredClasses[className])) {
			return new registry.registeredClasses[className]();
		}
		return;
	}

	/**
	 * Creates a class instance for a config entry using it's type. (as set in
	 * `type` property)
	 *
	 * @ignore Exclude from docs
	 * @param  {any}  config  Config part
	 * @return {any}          Instance
	 */
	protected createEntryInstance(config: any): any {
		let res: Object;
		if ($type.hasValue(config["type"])) {
			res = this.createClassInstance(config["type"]);
		}
		if (!res) {
			return config;
		}
		return res;
	}

	/**
	 * Determines config object type.
	 *
	 * @ignore Exclude from docs
	 * @param  {any}  config  Config part
	 * @return {any}          Type
	 */
	protected getConfigEntryType(config: any): any {
		if ($type.hasValue(config["type"])) {
			if ($type.hasValue(registry.registeredClasses[config["type"]])) {
				return registry.registeredClasses[config["type"]];
			}
			else {
				throw Error("Invalid type: \"" + config["type"] + "\".");
			}
		}
		return;
	}

	/**
	 * Checks if this element has a property.
	 *
	 * @ignore Exclude from docs
	 * @param  {string}   prop  Property name
	 * @return {boolean}        Has property?
	 */
	protected hasProperty(prop: string): boolean {
		return prop in this ? true : false;
	}

}

/**
 * Defines events for [[BaseObjectEvents]].
 */
export interface IBaseObjectEvents { };

/**
 * A version of [[BaseObject]] with events properties and methods.
 * Classes that use [[EventDispatcher]] should extend this instead of
 * [[BaseObject]] directly.
 */
export class BaseObjectEvents extends BaseObject {

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "BaseObjectEvents";
		this._disposers.push(this.events);
	}

	public _events!: IBaseObjectEvents;

	/**
	 * An [[EventDispatcher]] instance
	 */
	public events: EventDispatcher<AMEvent<this, this["_events"]>> = new EventDispatcher();

	/**
	 * Dispatches an event using own event dispatcher. Will automatically
	 * populate event data object with event type and target (this element).
	 * It also checks if there are any handlers registered for this sepecific
	 * event.
	 *
	 * @param {Key} eventType Event type (name)
	 * @param {any}    data      Data to pass into event handler(s)
	 */
	public dispatch<Key extends keyof this["_events"]>(eventType: Key, data?: any): void {
		// @todo Implement proper type check
		if (this.events.isEnabled(eventType)) {
			if (data) {
				data.type = eventType;
				data.target = data.target || this;
				(<any>this.events).dispatch(eventType, {
					type: eventType,
					target: this
				});
			}
			else {
				(<any>this.events).dispatch(eventType, {
					type: eventType,
					target: this
				});
			}
		}
	}

	/**
	 * Works like `dispatch`, except event is triggered immediately, without
	 * waiting for the next frame cycle.
	 *
	 * @param {Key} eventType Event type (name)
	 * @param {any}    data      Data to pass into event handler(s)
	 */
	public dispatchImmediately<Key extends keyof this["_events"]>(eventType: Key, data?: any): void {
		// @todo Implement proper type check
		if (this.events.isEnabled(eventType)) {
			if (data) {
				data.type = eventType;
				data.target = data.target || this;
				(<any>this.events).dispatchImmediately(eventType, data);
			}
			else {
				(<any>this.events).dispatchImmediately(eventType, {
					type: eventType,
					target: this
				});
			}
		}
	}

	/**
	 * Copies all parameters from another [[Sprite]].
	 *
	 * @param {BaseObjectEvents} source Source object
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.events.copyFrom(source.events);
	}

}
