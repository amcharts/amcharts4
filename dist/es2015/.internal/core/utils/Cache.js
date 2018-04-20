/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Dictionary } from "./Dictionary";
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
var Cache = /** @class */ (function () {
    function Cache() {
        /**
         * Storage for cache items.
         *
         * @type {Object}
         */
        this._storage = new Dictionary();
        /**
         * Default TTL in milliseconds.
         *
         * @type {number}
         */
        this.ttl = 1000;
    }
    /**
     * Caches or updates cached value, resets TTL.
     *
     * @param {string}  owner  An id of the object that owns this cache
     * @param {string}  key    Index key
     * @param {A}       value  Value
     */
    Cache.prototype.set = function (owner, key, value) {
        // Create if storage does not exist for this owner
        var ownerStorage = this._storage.insertKeyIfEmpty(owner, function () { return new Dictionary(); });
        // Create cache item
        var item = {
            "touched": new Date().getTime(),
            "ttl": this.ttl,
            "value": value
        };
        // Set
        ownerStorage.setKey(key, item);
    };
    /**
     * Rerturns cached item, respecting TTL.
     *
     * @param  {string}  owner  An id of the object that owns this cache
     * @param  {string}  key    Index key
     * @return {A}              Value, or `undefined` if not set
     */
    Cache.prototype.get = function (owner, key) {
        // 		 || ypeof this._storage[owner][key] === "undefined" || this._storage[owner][key].expired === true) {
        if (this._storage.hasKey(owner)) {
            var ownerStorage = this._storage.getKey(owner);
            if (ownerStorage.hasKey(key)) {
                var cacheItem = ownerStorage.getKey(key);
                return cacheItem.expired === true ? undefined : cacheItem.value;
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    };
    /**
     * Clears cache for specific owner or everything.
     *
     * @param {string} owner Owner to clear cache for
     */
    Cache.prototype.clear = function (owner) {
        if (owner) {
            this._storage.removeKey(owner);
        }
        else {
            this._storage.clear();
        }
    };
    return Cache;
}());
export { Cache };
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
export var cache = new Cache();
//# sourceMappingURL=Cache.js.map