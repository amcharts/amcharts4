import * as $type from "./Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Represents object cache.
 *
 * @ignore Exclude from docs
 * @todo Better storage
 * @todo TTL logging
 * @todo Garbage collector
 */
export declare class Cache<A> {
    /**
     * Storage for cache items.
     *
     * @type {Object}
     */
    private _storage;
    /**
     * Default TTL in milliseconds.
     *
     * @type {number}
     */
    ttl: number;
    /**
     * Caches or updates cached value, resets TTL.
     *
     * @param {string}  owner  An id of the object that owns this cache
     * @param {string}  key    Index key
     * @param {A}       value  Value
     */
    set(owner: string, key: string, value: A): void;
    /**
     * Rerturns cached item, respecting TTL.
     *
     * @param  {string}  owner  An id of the object that owns this cache
     * @param  {string}  key    Index key
     * @return {A}              Value, or `undefined` if not set
     */
    get(owner: string, key: string): $type.Optional<A>;
    /**
     * Clears cache for specific owner or everything.
     *
     * @param {string} owner Owner to clear cache for
     */
    clear(owner?: string): void;
}
/**
 * ============================================================================
 * GLOBAL INSTANCE
 * ============================================================================
 * @hidden
 */
/**
 * A global instance of cache. Use this instance to cache any values.
 *
 * @ignore Exclude from docs
 */
export declare let cache: Cache<any>;
