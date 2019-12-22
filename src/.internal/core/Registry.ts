/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ITheme } from "../themes/ITheme";
import { EventDispatcher, AMEvent } from "./utils/EventDispatcher";
import { Dictionary } from "./utils/Dictionary";
import { Sprite } from "./Sprite";
import { Container } from "./Container";
import { Component } from "./Component";
import { cache } from "./utils/Cache";
import * as $type from "./utils/Type";
import * as $string from "./utils/String";
import * as $array from "./utils/Array";


/**
 * Define events available for [[Registry]]
 */
export interface IRegistryEvents {

	/**
	 * Invoked when update cycle starts. Before invalid elements are re-validated.
	 */
	enterframe: {};

	/**
	 * Invoked when udpate cycle ends. After invalid elements have been
	 * re-validated.
	 */
	exitframe: {};

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Registry is used to store miscellaneous system-wide information, like ids,
 * maps, themes, and registered classes.
 *
 * @ignore Exclude from docs
 */
export class Registry {

	/**
	 * Unique ID of the object.
	 */
	public uid: string;

	/**
	 * Event dispacther.
	 */
	public events: EventDispatcher<AMEvent<Registry, IRegistryEvents>> = new EventDispatcher();

	/**
	 * Holds a universal mapping collection, so that elements and their children
	 * can create and look up all kinds of relations between id and object.
	 *
	 * @ignore Exclude from docs
	 */
	protected _map: $type.Optional<Dictionary<string, any>>;

	/**
	 * All currently applied themes. All new chart instances created will
	 * automatically inherit and retain System's themes.
	 */
	public themes: ITheme[] = [];

	/**
	 * List of all loaded available themes.
	 *
	 * Whenever a theme loads, it registers itself in System's `loadedThemes`
	 * collection.
	 */
	public loadedThemes: { [index: string]: ITheme } = {};

	/**
	 * An indeternal counter used to generate unique IDs.
	 *
	 * @ignore Exclude from docs
	 */
	protected _uidCount: number = 0;

	/**
	 * Keeps register of class references so that they can be instnatiated using
	 * string key.
	 *
	 * @ignore Exclude from docs
	 */
	public registeredClasses: { [index: string]: any } = {};

	/**
	 * Holds all generated placeholders.
	 */
	protected _placeholders: { [index: string]: string } = {};

	/**
 * A list of invalid(ated) [[Sprite]] objects that need to be re-validated
 * during next cycle.
 *
 * @ignore Exclude from docs
 */
	public invalidSprites: { [index: string]: Array<Sprite> } = {};

	/**
	 * Components are added to this list when their data provider changes to
	 * a new one or data is added/removed from their data provider.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidDatas: { [index: string]: Array<Component> } = {};

	/**
	 * Components are added to this list when values of their raw data change.
	 * Used when we want a smooth animation from one set of values to another.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidRawDatas: Array<Component> = [];

	/**
	 * Components are added to this list when values of their data changes
	 * (but not data provider itself).
	 *
	 * @ignore Exclude from docs
	 */
	public invalidDataItems: Array<Component> = [];

	/**
	 * Components are added to this list when their data range (selection) is
	 * changed, e.g. zoomed.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidDataRange: Array<Component> = [];

	/**
	 * A list of [[Sprite]] objects that have invalid(ated) positions, that need
	 * to be recalculated.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidPositions: { [index: string]: Array<Sprite> } = {};

	/**
	 * A list of [[Container]] objects with invalid(ated) layouts.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidLayouts: { [index: string]: Array<Container> } = {};

	/**
	 * An array holding all active (non-disposed) top level elemens.
	 *
	 * When, for example, a new chart is created, its instance will be added to
	 * this array, and will be removed when the chart is disposed.
	 */
	public baseSprites: Array<Sprite> = [];

	public baseSpritesByUid: { [index: string]: Sprite } = {};

	public queue:Array<Sprite> = [];

	constructor() {
		this.uid = this.getUniqueId();

		this.invalidSprites.noBase = [];
		this.invalidDatas.noBase = [];
		this.invalidLayouts.noBase = [];
		this.invalidPositions.noBase = [];
	}

	/**
	 * Generates a unique chart system-wide ID.
	 *
	 * @return Generated ID
	 */
	public getUniqueId(): string {
		let uid = this._uidCount;
		this._uidCount += 1;
		return "id-" + uid;
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
	 * @ignore Exclude from docs
	 * @param key    Key
	 * @param value  Value to return if cache is not available
	 * @return Value
	 */
	public getCache(key: string, value: any = undefined): any {
		return cache.get(this.uid, key, value);
	}

	/**
	 * Dispatches an event using own event dispatcher. Will automatically
	 * populate event data object with event type and target (this element).
	 * It also checks if there are any handlers registered for this sepecific
	 * event.
	 *
	 * @param eventType Event type (name)
	 * @param data      Data to pass into event handler(s)
	 */
	public dispatch<Key extends keyof IRegistryEvents>(eventType: Key, data?: any): void {
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
	 * @param eventType Event type (name)
	 * @param data      Data to pass into event handler(s)
	 */
	public dispatchImmediately<Key extends keyof IRegistryEvents>(eventType: Key, data?: any): void {
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
	 * Returns a unique placeholder suitable for the key.
	 *
	 * @param key  Key
	 * @return Random string to be used as placeholder
	 */
	public getPlaceholder(key: string): string {
		if ($type.hasValue(this._placeholders[key])) {
			return this._placeholders[key];
		}
		this._placeholders[key] = "__amcharts_" + key + "_" + $string.random(8) + "__";
		return this._placeholders[key];
	}



	/**
	 * @ignore
	 */
	public addToInvalidComponents(component: Component) {
		if (component.baseId) {
			$array.move(this.invalidDatas[component.baseId], component);
		}
		else {
			$array.move(this.invalidDatas["noBase"], component);
		}
	}

	/**
	 * @ignore
	 */
	public removeFromInvalidComponents(component: Component) {
		if (component.baseId) {
			$array.remove(this.invalidDatas[component.baseId], component);
		}

		$array.remove(this.invalidDatas["noBase"], component);
	}


	/**
	 * @ignore
	 */
	public addToInvalidSprites(sprite: Sprite) {
		if (sprite.baseId) {
			$array.add(this.invalidSprites[sprite.baseId], sprite);
		}
		else {
			$array.add(this.invalidSprites["noBase"], sprite);
		}
	}

	/**
	 * @ignore
	 */
	public removeFromInvalidSprites(sprite: Sprite) {
		if (sprite.baseId) {
			$array.remove(this.invalidSprites[sprite.baseId], sprite);
		}

		$array.remove(this.invalidSprites["noBase"], sprite);
	}


	/**
	 * @ignore
	 */
	public addToInvalidPositions(sprite: Sprite) {
		if (sprite.baseId) {
			$array.add(this.invalidPositions[sprite.baseId], sprite);
		}
		else {
			$array.add(this.invalidPositions["noBase"], sprite);
		}
	}

	/**
	 * @ignore
	 */
	public removeFromInvalidPositions(sprite: Sprite) {
		if (sprite.baseId) {
			$array.remove(this.invalidPositions[sprite.baseId], sprite);
		}

		$array.remove(this.invalidPositions["noBase"], sprite);
	}


	/**
	 * @ignore
	 */
	public addToInvalidLayouts(sprite: Container) {
		if (sprite.baseId) {
			$array.add(this.invalidLayouts[sprite.baseId], sprite);
		}
		else {
			$array.add(this.invalidLayouts["noBase"], sprite);
		}
	}

	/**
	 * @ignore
	 */
	public removeFromInvalidLayouts(sprite: Container) {
		if (sprite.baseId) {
			$array.remove(this.invalidLayouts[sprite.baseId], sprite);
		}

		$array.remove(this.invalidLayouts["noBase"], sprite);
	}
}

/**
 * A singleton global instance of [[Registry]].
 *
 * @ignore Exclude from docs
 */
export let registry = new Registry();


/**
 * Returns `true` if object is an instance of the class. It's the same as `instanceof` except it doesn't need to import the class.
 *
 * @param object Object
 * @param name Class name
 * @return Is instance of class
 */
export function is<A>(object: any, name: string): object is A {
	const x = registry.registeredClasses[name];
	return x != null && object instanceof x;
}
