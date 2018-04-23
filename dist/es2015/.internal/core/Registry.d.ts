/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ITheme } from "../themes/ITheme";
import { Dictionary } from "./utils/Dictionary";
import { Paper } from "./rendering/Paper";
import { Sprite } from "./Sprite";
import { Container } from "./Container";
import { Component } from "./Component";
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
     * Holds a universal mapping collection, so that elements and their children
     * can create and look up all kinds of relations between id and object.
     *
     * @type {Dictionary<string, any>}
     * @ignore Exclude from docs
     */
    protected _map: Dictionary<string, any>;
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
     * A [[Paper]] instance to create elements, that are not yet ready to be
     * placed in visible DOM.
     *
     * @ignore Exclude from docs
     * @type {Paper}
     */
    ghostPaper: Paper;
    /**
     * Number of times per second charts will be updated.
     *
     * This means that each time an element is invalidated it will wait for the
     * next cycle to be re-validated, and possibly redrawn.
     *
     * This happens every `1000 / frameRate` milliseconds.
     *
     * Reducing this number may reduce the load on the CPU, but might slightly
     * reduce smoothness of the animations.
     *
     * @type {number}
     */
    frameRate: number;
    /**
 * A list of invalid(ated) [[Sprite]] objects that need to be re-validated
 * during next cycle.
 *
 * @ignore Exclude from docs
 * @type {Array<Sprite>}
 */
    invalidSprites: Array<Sprite>;
    /**
     * Components are added to this list when their data provider changes to
     * a new one or data is added/removed from their data provider.
     *
     * @ignore Exclude from docs
     * @type {Array<Component>}
     */
    invalidDatas: Array<Component>;
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
     * @type {Array<Sprite>}
     */
    invalidPositions: Array<Sprite>;
    /**
     * A list of [[Container]] objects with invalid(ated) layouts.
     *
     * @ignore Exclude from docs
     * @type {Array<Container>}
     */
    invalidLayouts: Array<Container>;
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
     */
    setCache(key: string, value: any): void;
    /**
     * Retrieves cached value.
     *
     * @ignore Exclude from docs
     * @param  {string}  key  Key
     * @return {any}          Value
     */
    getCache(key: string): any;
}
/**
 * A singleton global instance of [[Registry]].
 *
 * @ignore Exclude from docs
 */
export declare let registry: Registry;
