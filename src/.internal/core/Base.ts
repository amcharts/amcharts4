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
import { OrderedListTemplate, SortedListTemplate } from "./utils/SortedList";
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
	 * @ignore Exclude from docs
	 */
	protected _uid: $type.Optional<string>;

	/**
	 * Indicates if this object has already been deleted. Any
	 * destruction/disposal code should take this into account when deciding
	 * wheter to run potentially costly disposal operations if they already have
	 * been run.
	 *
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
	 * @ignore Exclude from docs
	 */
	protected _id: $type.Optional<string>;

	/**
	 * Holds a universal mapping collection, so that elements and their children
	 * can create and look up all kinds of relations between id and object.
	 *
	 * @ignore Exclude from docs
	 */
	protected _map: $type.Optional<Dictionary<string, any>>;

	/**
	 * The theme used by this object.
	 *
	 * @ignore Exclude from docs
	 */
	protected _themes: $type.Optional<ITheme[]>;

	// @review
	/**
	 * A list of objects that are clones of this object. An object needs to
	 * maintain a list of its clones so that properties can be re-applied to
	 * clones whenever property on the object they were cloned from changes.
	 */
	protected _clones: $type.Optional<List<this>>;


	// @review
	/**
	 * Reference to the original object this object was cloned from. We need to
	 * keep this so we can disassociate it from source object when this object
	 * is disposed.
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
	 * @ignore Exclude from docs
	 */
	protected _className: $type.Optional<string>;

	/**
	 * [cloneId description]
	 *
	 * @todo Needs description
	 * @ignore Exclude from docs
	 */
	public cloneId: $type.Optional<string>;

	/**
	 * Holds processing error list.
	 */
	protected _processingErrors: string[];

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
	 * @return Unique ID
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
	 * @param value Id
	 */
	public set id(value: $type.Optional<string>) {
		//registry.map.setKey(value, this); // registry.map only stores by uid
		this._id = value;
	}

	/**
	 * @return Id
	 */
	public get id(): $type.Optional<string> {
		return this._id;
	}

	/**
	 * Returns a universal collection for mapping ids with objects.
	 *
	 * @ignore Exclude from docs
	 * @return Map collection
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
	 * @param value An array of themes
	 */
	public set themes(value: $type.Optional<ITheme[]>) {
		this._themes = value;
	}

	/**
	 * @ignore Exclude from docs
	 * @return An array of themes
	 */
	public get themes(): $type.Optional<ITheme[]> {
		return this._themes;
	}

	/**
	 * Returns a list of themes that should be applied to this element. It could
	 * either be a list of themes set explicitly on this element, or system-wide.
	 *
	 * @return List of themes
	 */
	public getCurrentThemes(): ITheme[] {
		return this.themes || registry.themes;
	}

	/**
	 * Returns if this object has been already been disposed.
	 *
	 * @return Is disposed?
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
	 * @param target Object to dispose
	 * @ignore Exclude from docs
	 */
	public addDisposer(target: IDisposer): void {
		this._disposers.push(target);
	}

	/**
	 * Disposes disposable object and removes it from `_disposers`.
	 *
	 * @param target Object to dispose
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
	 * @param cloneId  An id to use for clone (if not set a unique id will be generated)
	 * @returns Clone
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
	 * @return Clones
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
	 * @param object Source element
	 */
	public copyFrom(object: this): void {
		object.clones.push(this); // do not moveValue, as it is expensive! even if there will be several items in clones list, it's not that bad.
		this.clonedFrom = object;
	}

	/**
	 * Element's class name. (a class that was used to instantiate the element)
	 *
	 * @ignore Exclude from docs
	 * @param value  Class name
	 */
	public set className(value: $type.Optional<string>) {
		this._className = value;
		/*if (registry) {
			registry.registeredClasses[value] = typeof this;
		}*/
	}

	/**
	 * @ignore Exclude from docs
	 * @return Class name
	 */
	public get className(): $type.Optional<string> {
		return this._className;
	}

	/**
	 * Caches value in object's cache.
	 *
	 * @ignore Exclude from docs
	 * @param key    Key
	 * @param value  Value
	 * @param ttl    TTL in seconds
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
	 * @param key    Key
	 * @param value  Value to return if cache is not available
	 * @return Value
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
	 * @param fn     Callback function
	 * @param delay  Timeout (ms)
	 * @return Disposer for timeout
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
	 * @param fn     Callback function
	 * @param delay  Timeout (ms)
	 * @return Disposer for timeout
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
	 * @param json JSON config
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
	 * @param json  JSON config
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
				// We create a new object if "type" key is set, but only if the
				// target object is of different type.
				if (
					$type.isObject(configValue)
					&& $type.hasValue((<any>configValue)["type"])
					&& (
						!$type.isObject(target[configKey])
						|| !$type.hasValue(target[configKey].className)
						|| (<any>configValue)["forceCreate"]
						|| target[configKey].className != (<any>configValue)["type"]
					)
					&& !this.asIs(configKey)
				) {
					item = this.createClassInstance((<any>configValue)["type"]);

					// Create new instance
					if (item) {
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
				else if (configKey == "locale" && $type.isString(configValue)) {

					// ... a locale specified as string, e.g. "fr_FR"
					// ------------------------------------------------------------------
					if ((<any>document)["am4lang_" + configValue]) {
						target[configKey] = (<any>document)["am4lang_" + configValue];
					}

				}
				else if (configKey == "parent" && $type.isString(configValue)) {

					// ... a parent referred via its it
					// ------------------------------------------------------------------
					const parent = this.map.getKey(configValue);
					if (parent) {
						target[configKey] = parent;
					}
					else {
						throw Error("Non-existing ID in config: \"" + configValue + "\".");
					}

				}
				else if (this.asIs(configKey)) {

					// ... a special field, just set it to new value
					// ------------------------------------------------------------------
					// (no need to add each indvidual item)
					target[configKey] = configValue;

				}
				else if (this.asFunction(configKey) && $type.isString(configValue)) {

					// ... a field indicating function name to look for in registry
					// ------------------------------------------------------------------
					if ($type.hasValue(registry.registeredClasses[configValue])) {
						target[configKey] = registry.registeredClasses[configValue];
					}
					else {
						throw Error("Invalid easing function: " + configValue);
					}

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
				else if (item instanceof ListTemplate || item instanceof OrderedListTemplate || item instanceof SortedListTemplate) {

					// ... a list with template
					// ------------------------------------------------------------------

					// Let's see what we can do with it
					if ($type.isArray(configValue)) {

						// It's an array.
						// Create a list item for entry, or try to apply properties to an
						// existing entry if possible and it is present.
						if (item instanceof ListTemplate) {
							this.processListTemplate(configValue, item);
						}
						else {
							this.processOrderedTemplate(configValue, item);
						}

					}
					else if ($type.isObject(configValue)) {
						// It's a single oject.
						// Treat it as a template.
						if (<any>configValue instanceof BaseObject) {
							// Item is already a BaseObject, no need to process it further
							item.template = configValue;
						}
						else {

							// Now let's find out if the whole object if a template, or we
							// need to get it from `template` key
							let templateValue;
							if ($type.hasValue((<any>configValue).template)) {
								templateValue = (<any>configValue).template;
							}
							else {
								templateValue = configValue;
							}

							if (item.template instanceof BaseObject) {
								// Template is a BaseObject so we will just let its config
								// deal with the configuration
								(<any>item.template).config = templateValue;
							}
							else {

								$object.each(templateValue, (entryKey, entryValue) => {

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
										listItem = this.createClassInstance((<any>entryValue)["type"])

										if (listItem) {
											if (listItem instanceof BaseObject) {
												listItem.config = <any>entryValue;
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

							// Check maybe there are `values` to insert
							if ($type.hasValue((<any>configValue).values)) {
								if (item instanceof ListTemplate) {
									this.processListTemplate((<any>configValue).values, item);
								}
								else {
									this.processOrderedTemplate((<any>configValue).values, item);
								}
							}
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

					if (configKey == "children") {
						this.processList(configValue, item, this);
					}
					else {
						this.processList(configValue, item);
					}


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
			else if (!this.isReserved(configKey)) {

				// Doesn't have property set. But we're going to assume JSON config
				// creator knows what he/she is doing and set it anyway.
				target[configKey] = configValue;

			}
		}, this.configOrder);

		// Any errors?
		if (this.processingErrors.length) {
			let errors = this.processingErrors.join("\n");
			this._processingErrors = [];
			throw Error(errors);

		}

	}

	/**
	 * Tries to detect if value is color or percent and converts to proper object
	 * if necessary.
	 *
	 * Returns the same source value if no color/percent detected
	 *
	 * @param value  Source value
	 * @return Converted value
	 */
	protected maybeColorOrPercent(value: any): any {
		if ($type.isString(value)) {
			if (value.match(/^[\-]?[0-9.]+\%$/)) {
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
	 * @param item    Item
	 * @param config  Config
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
	 * @param item    Item
	 * @param config  Config
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
	 * Processes [[ListTemplate]].
	 *
	 * @param configValue  Config value
	 * @param item         Item
	 */
	protected processListTemplate(configValue: any, item: ListTemplate<any>): void {

		$array.each(configValue, (entry, index) => {
			let type = this.getConfigEntryType(entry);
			let listItem;
			if (item.hasIndex(index) && !(<any>entry)["forceCreate"]) {
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

			if (entry === listItem) {
				// It's already the same item, do nothing
			}
			else {

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

			}
		});

		// Truncate the list if it contains less items than the config
		// array
		while (configValue.length > item.length) {
			item.pop();
		}

	}

	/**
	 * Processes [[OrdererListTemplate]] or [[SortedListTemplate]].
	 *
	 * @param configValue  Config value
	 * @param item         Item
	 */
	protected processOrderedTemplate(configValue: any, item: OrderedListTemplate<any> | SortedListTemplate<any>): void {

		$array.each(configValue, (entry, index) => {
			let type = this.getConfigEntryType(entry);
			let listItem;
			if (type) {
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
					item.insert(entry);
				}

			}
		});

	}

	/**
	 * Processes [[List]].
	 *
	 * @param configValue  Config value
	 * @param item         Item
	 */
	protected processList(configValue: any, item: List<any>, parent?: any): void {

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
				if ((index < itemCount) && !(<any>entry)["forceCreate"]) {
					listItem = item.getIndex(index);
				}
				else if (<any>entry instanceof BaseObject) {
					// Item is already a BaseObject, no need to process it further
					item.push(entry);
					return;
				}
				else {
					listItem = this.createEntryInstance(entry);
					if (parent) {
						listItem.parent = parent;
					}
					else {
						item.push(listItem);
					}
				}

				// If the list item is BaseObject, we just need to let it
				// deal if its own config
				if (listItem instanceof BaseObject) {
					(<any>listItem).config = entry;
				}
				else if ($type.isObject(listItem) && $type.isObject(entry)) {
					$object.copyAllProperties(<Object>entry, <Object>listItem);
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
	 * @param a  Element 1
	 * @param b  Element 2
	 * @return Sorting number
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
	 * @param field  Field name
	 * @return Assign as is?
	 */
	protected asIs(field: string): boolean {
		return $array.indexOf(["locale"], field) != -1;
	}

	/**
	 * Checks if field needs to be converted to function, if it is specified
	 * as string.
	 *
	 * @param field  Field name
	 * @return Assign as function?
	 */
	protected asFunction(field: string): boolean {
		return false;
	}

	/**
	 * Creates a relevant class instance if such class definition exists.
	 *
	 * @ignore Exclude from docs
	 * @param className  Class name
	 * @return Instance
	 */
	protected createClassInstance(className: string): Object {
		if ($type.hasValue(registry.registeredClasses[className])) {
			return new registry.registeredClasses[className]();
		}
		else {
			throw Error("Invalid type: \"" + className + "\".");
		}
	}

	/**
	 * Creates a class instance for a config entry using it's type. (as set in
	 * `type` property)
	 *
	 * @ignore Exclude from docs
	 * @param config  Config part
	 * @return Instance
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
	 * @param config  Config part
	 * @return Type
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
	 * @param prop  Property name
	 * @return Has property?
	 */
	protected hasProperty(prop: string): boolean {
		return prop in this ? true : false;
	}

	/**
	 * Checkes whether JSON key is a reserved keyword.
	 *
	 * @param key  Key
	 * @return Reserved
	 */
	protected isReserved(key: string): boolean {
		return ["type", "forceCreate"].indexOf(key) !== -1;
	}

	/**
	 * A list of errors that happened during JSON processing.
	 *
	 * @return Errors
	 */
	protected get processingErrors(): string[] {
		if (!this._processingErrors) {
			this._processingErrors = [];
		}
		return this._processingErrors;
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
	}

	public _events!: IBaseObjectEvents;

	/**
	 * An [[EventDispatcher]] instance
	 * @ignore
	 */
	public _eventDispatcher: EventDispatcher<AMEvent<this, this["_events"]>>;

	/**
	 * An [[EventDispatcher]] instance
	 */
	public get events(): EventDispatcher<AMEvent<this, this["_events"]>> {
		if (!this._eventDispatcher) {
			this._eventDispatcher = new EventDispatcher();
			this._disposers.push(this._eventDispatcher);
		}
		return this._eventDispatcher;
	}

	//public set events(value:EventDispatcher<AMEvent<this, this["_events"]>>){
	//	this._eventDispatcher = value;
	//}

	/**
	 * Dispatches an event using own event dispatcher. Will automatically
	 * populate event data object with event type and target (this element).
	 * It also checks if there are any handlers registered for this sepecific
	 * event.
	 *
	 * @param eventType Event type (name)
	 * @param data      Data to pass into event handler(s)
	 */
	public dispatch<Key extends keyof this["_events"]>(eventType: Key, data?: any): void {
		// @todo Implement proper type check
		if (this._eventDispatcher) {
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
	}

	/**
	 * Works like `dispatch`, except event is triggered immediately, without
	 * waiting for the next frame cycle.
	 *
	 * @param eventType Event type (name)
	 * @param data      Data to pass into event handler(s)
	 */
	public dispatchImmediately<Key extends keyof this["_events"]>(eventType: Key, data?: any): void {
		// @todo Implement proper type check
		if (this._eventDispatcher) {
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
	}

	/**
	 * Copies all parameters from another [[Sprite]].
	 *
	 * @param source Source object
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		if (source._eventDispatcher) {
			this.events.copyFrom(source._eventDispatcher);
		}
	}

}
