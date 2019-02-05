/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Dictionary } from "./Dictionary";
import * as $type from "./Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines an interface for cache items.
 */
interface CacheItem<A> {

	/**
	 * A timestamp of when the item was created/updated.
	 */
	"touched": number,

	/**
	 * TTL (time to live) in milliseconds.
	 */
	"ttl"?: number,

	/**
	 * Cached value.
	 */
	"value": A,

	/**
	 * Is this item expired?
	 *
	 * @todo a system process that would check chace element TTLs and expire them
	 */
	"expired"?: boolean

}


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
export class Cache<A> {

	/**
	 * Storage for cache items.
	 */
	private _storage = new Dictionary<string, Dictionary<string, CacheItem<A>>>();

	/**
	 * Default TTL in milliseconds.
	 */
	public ttl: number = 1000;

	/**
	 * Caches or updates cached value, resets TTL.
	 *
	 * If `ttl` is set to zero, item will never expire.
	 *
	 * @param owner  An id of the object that owns this cache
	 * @param key    Index key
	 * @param value  Value
	 * @param ttl    TTL of the cache to live in milliseconds
	 */
	public set(owner: string, key: string, value: A, ttl?: number): void {

		// Create if storage does not exist for this owner
		let ownerStorage = this._storage.insertKeyIfEmpty(owner, () => new Dictionary<string, CacheItem<A>>());

		// Create cache item
		let item: CacheItem<A> = {
			"touched": new Date().getTime(),
			"ttl": $type.isNumber(ttl) ? ttl : this.ttl,
			"value": value
		};

		// Set
		ownerStorage.setKey(key, item);
	}

	/**
	 * Rerturns cached item, respecting TTL.
	 *
	 * @param owner  An id of the object that owns this cache
	 * @param key    Index key
	 * @param value  Value to return if cache not available
	 * @return Value, or `undefined` if not set
	 */
	public get(owner: string, key: string, value: any = undefined): $type.Optional<A> {
		// 		 || ypeof this._storage[owner][key] === "undefined" || this._storage[owner][key].expired === true) {
		if (this._storage.hasKey(owner)) {
			let ownerStorage = <Dictionary<string, CacheItem<A>>>this._storage.getKey(owner);

			if (ownerStorage.hasKey(key)) {
				let cacheItem: CacheItem<A> = <CacheItem<A>>ownerStorage.getKey(key);
				if (cacheItem.ttl && ((cacheItem.touched + cacheItem.ttl) < new Date().getTime())) {
					cacheItem.expired = true;
				}
				if (cacheItem.expired) {
					ownerStorage.removeKey(key);
					return value;
				}
				return cacheItem.value;
			}
			else {
				return value;
			}
		}
		else {
			return value;
		}
	}

	/**
	 * Clears cache for specific owner or everything.
	 *
	 * @param owner Owner to clear cache for
	 */
	public clear(owner?: string): void {
		if (owner) {
			this._storage.removeKey(owner);
		}
		else {
			this._storage.clear();
		}
	}

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
export let cache: Cache<any> = new Cache();
