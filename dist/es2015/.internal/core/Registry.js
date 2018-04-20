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
var Registry = /** @class */ (function () {
    function Registry() {
        /**
         * All currently applied themes. All new chart instances created will
         * automatically inherit and retain System's themes.
         *
         * @type {ITheme}
         */
        this.themes = [];
        /**
         * List of all loaded available themes.
         *
         * Whenever a theme loads, it registers itself in System's `loadedThemes`
         * collection.
         */
        this.loadedThemes = {};
        /**
         * An indeternal counter used to generate unique IDs.
         *
         * @ignore Exclude from docs
         * @type {number}
         */
        this._uidCount = 0;
        /**
         * Keeps register of class references so that they can be instnatiated using
         * string key.
         *
         * @ignore Exclude from docs
         */
        this.registeredClasses = {};
    }
    /**
     * Generates a unique chart system-wide ID.
     *
     * @return {string} Generated ID
     */
    Registry.prototype.getUniqueId = function () {
        var uid = this._uidCount;
        this._uidCount += 1;
        return "id-" + uid;
    };
    Object.defineProperty(Registry.prototype, "map", {
        /**
         * Returns a universal collection for mapping ids with objects.
         *
         * @ignore Exclude from docs
         * @return {Dictionary<string, any>} Map collection
         */
        get: function () {
            if (!this._map) {
                this._map = new Dictionary();
            }
            return this._map;
        },
        enumerable: true,
        configurable: true
    });
    return Registry;
}());
export { Registry };
/**
 * A singleton global instance of [[Registry]].
 */
export var registry = new Registry();
//# sourceMappingURL=Registry.js.map