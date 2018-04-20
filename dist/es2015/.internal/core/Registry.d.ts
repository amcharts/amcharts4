/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ITheme } from "../themes/ITheme";
import { Dictionary } from "./utils/Dictionary";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Registry is used to store miscellaneous system-wide information, like ids,
 * maps, themes, and registered classes.
 */
export declare class Registry {
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
}
/**
 * A singleton global instance of [[Registry]].
 */
export declare let registry: Registry;
