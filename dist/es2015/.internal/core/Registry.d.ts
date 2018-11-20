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
import * as $type from "./utils/Type";
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
export declare class Registry {
    /**
     * Unique ID of the object.
     *
     * @type {string}
     */
    uid: string;
    /**
     * Event dispacther.
     *
     * @type {EventDispatcher}
     */
    events: EventDispatcher<AMEvent<Registry, IRegistryEvents>>;
    /**
     * Holds a universal mapping collection, so that elements and their children
     * can create and look up all kinds of relations between id and object.
     *
     * @type {Dictionary<string, any>}
     * @ignore Exclude from docs
     */
    protected _map: $type.Optional<Dictionary<string, any>>;
    /**
     * All currently applied themes. All new chart instances created will
     * automatically inherit and retain System's themes.
     *
     * @type {ITheme}
     */
    themes: ITheme[];
    /**
     * List of all loaded available themes.
     *
     * Whenever a theme loads, it registers itself in System's `loadedThemes`
     * collection.
     */
    loadedThemes: {
        [index: string]: ITheme;
    };
    /**
     * An indeternal counter used to generate unique IDs.
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _uidCount: number;
    /**
     * Keeps register of class references so that they can be instnatiated using
     * string key.
     *
     * @ignore Exclude from docs
     */
    registeredClasses: {
        [index: string]: any;
    };
    /**
     * Holds all generated placeholders.
     */
    protected _placeholders: {
        [index: string]: string;
    };
    /**
 * A list of invalid(ated) [[Sprite]] objects that need to be re-validated
 * during next cycle.
 *
 * @ignore Exclude from docs
 * @type { [index: string]: Array<Sprite> }
 */
    invalidSprites: {
        [index: string]: Array<Sprite>;
    };
    /**
     * Components are added to this list when their data provider changes to
     * a new one or data is added/removed from their data provider.
     *
     * @ignore Exclude from docs
     * @type { [index: string]: Array<Component> }
     */
    invalidDatas: {
        [index: string]: Array<Component>;
    };
    /**
     * Components are added to this list when values of their raw data change.
     * Used when we want a smooth animation from one set of values to another.
     *
     * @ignore Exclude from docs
     * @type {Array<Component>}
     */
    invalidRawDatas: Array<Component>;
    /**
     * Components are added to this list when values of their data changes
     * (but not data provider itself).
     *
     * @ignore Exclude from docs
     * @type {Array<Component>}
     */
    invalidDataItems: Array<Component>;
    /**
     * Components are added to this list when their data range (selection) is
     * changed, e.g. zoomed.
     *
     * @ignore Exclude from docs
     * @type {Array<Component>}
     */
    invalidDataRange: Array<Component>;
    /**
     * A list of [[Sprite]] objects that have invalid(ated) positions, that need
     * to be recalculated.
     *
     * @ignore Exclude from docs
     * @type { [index: string]: Array<Sprite>}
     */
    invalidPositions: {
        [index: string]: Array<Sprite>;
    };
    /**
     * A list of [[Container]] objects with invalid(ated) layouts.
     *
     * @ignore Exclude from docs
     * @type { [index: string]: Array<Container>}
     */
    invalidLayouts: {
        [index: string]: Array<Container>;
    };
    /**
     * An array holding all active (non-disposed) top level elemens.
     *
     * When, for example, a new chart is created, its instance will be added to
     * this array, and will be removed when the chart is disposed.
     *
     * @type {Array<Sprite>}
     */
    baseSprites: Array<Sprite>;
    baseSpritesByUid: {
        [index: string]: Sprite;
    };
    constructor();
    /**
     * Generates a unique chart system-wide ID.
     *
     * @return {string} Generated ID
     */
    getUniqueId(): string;
    /**
     * Returns a universal collection for mapping ids with objects.
     *
     * @ignore Exclude from docs
     * @return {Dictionary<string, any>} Map collection
     */
    readonly map: Dictionary<string, any>;
    /**
     * Caches value in object's cache.
     *
     * @ignore Exclude from docs
     * @param {string}  key    Key
     * @param {any}     value  Value
     * @param {number}  ttl    TTL in seconds
     */
    setCache(key: string, value: any, ttl?: number): void;
    /**
     * Retrieves cached value.
     *
     * @ignore Exclude from docs
     * @param  {string}  key    Key
     * @param  {any}     value  Value to return if cache is not available
     * @return {any}            Value
     */
    getCache(key: string, value?: any): any;
    /**
     * Dispatches an event using own event dispatcher. Will automatically
     * populate event data object with event type and target (this element).
     * It also checks if there are any handlers registered for this sepecific
     * event.
     *
     * @param {Key} eventType Event type (name)
     * @param {any}    data      Data to pass into event handler(s)
     */
    dispatch<Key extends keyof IRegistryEvents>(eventType: Key, data?: any): void;
    /**
     * Works like `dispatch`, except event is triggered immediately, without
     * waiting for the next frame cycle.
     *
     * @param {Key} eventType Event type (name)
     * @param {any}    data      Data to pass into event handler(s)
     */
    dispatchImmediately<Key extends keyof IRegistryEvents>(eventType: Key, data?: any): void;
    /**
     * Returns a unique placeholder suitable for the key.
     *
     * @param  {string}  key  Key
     * @return {string}       Random string to be used as placeholder
     */
    getPlaceholder(key: string): string;
    /**
     * @ignore
     */
    addToInvalidComponents(component: Component): void;
    /**
     * @ignore
     */
    removeFromInvalidComponents(component: Component): void;
    /**
     * @ignore
     */
    addToInvalidSprites(sprite: Sprite): void;
    /**
     * @ignore
     */
    removeFromInvalidSprites(sprite: Sprite): void;
    /**
     * @ignore
     */
    addToInvalidPositions(sprite: Sprite): void;
    /**
     * @ignore
     */
    removeFromInvalidPositions(sprite: Sprite): void;
    /**
     * @ignore
     */
    addToInvalidLayouts(sprite: Sprite): void;
    /**
     * @ignore
     */
    removeFromInvalidLayouts(sprite: Sprite): void;
}
/**
 * A singleton global instance of [[Registry]].
 *
 * @ignore Exclude from docs
 */
export declare let registry: Registry;
