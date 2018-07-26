import { EventDispatcher } from "./utils/EventDispatcher";
import { Dictionary } from "./utils/Dictionary";
import { cache } from "./utils/Cache";
import * as $type from "./utils/Type";
import * as $string from "./utils/String";
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
var Registry = /** @class */ (function () {
    function Registry() {
        /**
         * Event dispacther.
         *
         * @type {EventDispatcher}
         */
        this.events = new EventDispatcher();
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
        /**
         * Holds all generated placeholders.
         */
        this._placeholders = {};
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
        this.frameRate = 60;
        /**
     * A list of invalid(ated) [[Sprite]] objects that need to be re-validated
     * during next cycle.
     *
     * @ignore Exclude from docs
     * @type {Array<Sprite>}
     */
        this.invalidSprites = [];
        /**
         * Components are added to this list when their data provider changes to
         * a new one or data is added/removed from their data provider.
         *
         * @ignore Exclude from docs
         * @type {Array<Component>}
         */
        this.invalidDatas = [];
        /**
         * Components are added to this list when values of their raw data change.
         * Used when we want a smooth animation from one set of values to another.
         *
         * @ignore Exclude from docs
         * @type {Array<Component>}
         */
        this.invalidRawDatas = [];
        /**
         * Components are added to this list when values of their data changes
         * (but not data provider itself).
         *
         * @ignore Exclude from docs
         * @type {Array<Component>}
         */
        this.invalidDataItems = [];
        /**
         * Components are added to this list when their data range (selection) is
         * changed, e.g. zoomed.
         *
         * @ignore Exclude from docs
         * @type {Array<Component>}
         */
        this.invalidDataRange = [];
        /**
         * A list of [[Sprite]] objects that have invalid(ated) positions, that need
         * to be recalculated.
         *
         * @ignore Exclude from docs
         * @type {Array<Sprite>}
         */
        this.invalidPositions = [];
        /**
         * A list of [[Container]] objects with invalid(ated) layouts.
         *
         * @ignore Exclude from docs
         * @type {Array<Container>}
         */
        this.invalidLayouts = [];
        this.uid = this.getUniqueId();
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
    /**
     * Caches value in object's cache.
     *
     * @ignore Exclude from docs
     * @param {string}  key    Key
     * @param {any}     value  Value
     */
    Registry.prototype.setCache = function (key, value) {
        cache.set(this.uid, key, value);
    };
    /**
     * Retrieves cached value.
     *
     * @ignore Exclude from docs
     * @param  {string}  key  Key
     * @return {any}          Value
     */
    Registry.prototype.getCache = function (key) {
        return cache.get(this.uid, key);
    };
    /**
     * Dispatches an event using own event dispatcher. Will automatically
     * populate event data object with event type and target (this element).
     * It also checks if there are any handlers registered for this sepecific
     * event.
     *
     * @param {Key} eventType Event type (name)
     * @param {any}    data      Data to pass into event handler(s)
     */
    Registry.prototype.dispatch = function (eventType, data) {
        // @todo Implement proper type check
        if (this.events.isEnabled(eventType)) {
            if (data) {
                data.type = eventType;
                data.target = data.target || this;
                this.events.dispatch(eventType, {
                    type: eventType,
                    target: this
                });
            }
            else {
                this.events.dispatch(eventType, {
                    type: eventType,
                    target: this
                });
            }
        }
    };
    /**
     * Works like `dispatch`, except event is triggered immediately, without
     * waiting for the next frame cycle.
     *
     * @param {Key} eventType Event type (name)
     * @param {any}    data      Data to pass into event handler(s)
     */
    Registry.prototype.dispatchImmediately = function (eventType, data) {
        // @todo Implement proper type check
        if (this.events.isEnabled(eventType)) {
            if (data) {
                data.type = eventType;
                data.target = data.target || this;
                this.events.dispatchImmediately(eventType, data);
            }
            else {
                this.events.dispatchImmediately(eventType, {
                    type: eventType,
                    target: this
                });
            }
        }
    };
    /**
     * Returns a unique placeholder suitable for the key.
     *
     * @param  {string}  key  Key
     * @return {string}       Random string to be used as placeholder
     */
    Registry.prototype.getPlaceholder = function (key) {
        if ($type.hasValue(this._placeholders[key])) {
            return this._placeholders[key];
        }
        this._placeholders[key] = "__amcharts_" + key + "_" + $string.random(8) + "__";
        return this._placeholders[key];
    };
    return Registry;
}());
export { Registry };
/**
 * A singleton global instance of [[Registry]].
 *
 * @ignore Exclude from docs
 */
export var registry = new Registry();
//# sourceMappingURL=Registry.js.map