/**
 * Module contains functionality related to [[Sprite]] states.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "./Base";
import { Adapter } from "./utils/Adapter";
import { List, ListDisposer } from "./utils/List";
import { toColor } from "./utils/Color";
import { percent } from "./utils/Percent";
import * as $utils from "./utils/Utils";
import * as $ease from "./utils/Ease";
import * as $object from "./utils/Object";
import * as $type from "./utils/Type";
/**
 * Defines a state for [[Sprite]].
 *
 * A "state" is a special object that has all the same properties as the
 * [[Sprite]] of the same type, and which can be used to quickly apply a set
 * of property values. (set state)
 *
 * When [[Sprite]] (or any object that extends Sprite) is created it creates a
 * "default" state. You can modify the "default" state so that when the Sprite
 * returns to default state certain properties are added.
 *
 * Default state can be accessed using Sprite's `defaultState` getter.
 *
 * ```TypeScript
 * sprite.defaultState.properties.fillOpacity = 0.5;
 * ```
 * ```JavaScript
 * sprite.defaultState.properties.fillOpacity = 0.5;
 * ```
 * ```JSON
 * {
 *   // ...
 *   "defaultState": {
 *     "properties": {
 *       "fillOpacity": 0.5
 *     }
 *   }
 * }
 * ```
 *
 * If Sprite is "hoverable", it automatically adds a "hover" state, which is
 * applied when it has a cursor over it.
 *
 * ```TypeScript
 * let hoverstate = sprite.states.create("hover");
 * hoverstate.properties.fillOpacity = 1;
 * ```
 * ```JavaScript
 * var hoverstate = sprite.states.create("hover");
 * hoverstate.properties.fillOpacity = 1;
 * ```
 * ```JSON
 * {
 *   // ...
 *   "states": {
 *     "hover": {
 *       "properties": {
 *         "fillOpacity": 0.5
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * The above will automatically apply "hover" state when the Sprite is hovered,
 * thus will set its `fillOpacity` property to 1, and will reset it to 0.5 when
 * it's no longer hovered.
 *
 * Every object that inherits from [[Sprite]] can and will add their own
 * properties to the available list.
 *
 * User can create their own states, and apply them as needed:
 *
 * ```TypeScript
 * let myCustomState = sprite.states.create("mystate");
 * myCustomState.properties.fillOpacity = 0.5;
 * myCustomState.properties.strokeOpacity = 0.8;
 * sprite.setState("mystate");
 * ```
 * ```JavaScript
 * var myCustomState = sprite.states.create("mystate");
 * myCustomState.properties.fillOpacity = 0.5;
 * myCustomState.properties.strokeOpacity = 0.8;
 * sprite.setState("mystate");
 * ```
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/states/}
 * @important
 */
var SpriteState = /** @class */ (function (_super) {
    tslib_1.__extends(SpriteState, _super);
    /**
     * Constructor
     */
    function SpriteState() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Holds Adapter.
         *
         * @type {Adapter<Sprite, SpriteAdapters>}
         */
        _this.adapter = new Adapter(_this);
        /**
         * Duration of the transition to this state. 0 means instantenous transition.
         * Any number means the [[Sprite]] will transit smoothly to this state,
         * animating all animatable properties.
         *
         * @default 0
         * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
         * @type {number}
         */
        _this.transitionDuration = 0;
        /**
         * Easing function to use when transitioning to this state.
         *
         * @default cubicOut
         * @see {@link Ease}
         * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
         * @type {(number) => number}
         */
        _this.transitionEasing = $ease.cubicOut;
        /**
         * Collection of properties and their values that should be applied to [[Sprite]]
         * when switching to this State.
         *
         * The property values set on a [[SpriteState]] will override the ones set
         * directly on a [[Sprite]].
         *
         * @type {Dictionary<string, any>}
         */
        _this.properties = {};
        /**
         * A collection of key/value pairs that can be used to bind specific Sprite
         * properties to [[DataItem]].
         *
         * For example: `fill` property can be bound to `myCustomColor` field in
         * DataItem. The Sprite will automatically get the value for `fill` from its
         * DataItem.
         *
         * SpriteState-specific binding will override binding set directly on
         * [[Sprite]]. I.e. you can make Sprite use different fill color on hover by
         * adding a `fill` binding to a different DataItem key for Sprite's "hover"
         * state object.
         *
         * @see {@link Sprite}
         * @type {Object}
         */
        _this.propertyFields = {};
        //public propertyFields: Dictionary<keyof this["_properties"], string> = new Dictionary<keyof this["_properties"], string>();;
        /**
         * A list of [[Filter]] elements to be applied to the relative [[Sprite]]
         * when switching to this State.
         *
         * @param {List}
         */
        _this.filters = new List();
        /**
         * Identifies if this object is a "template" and should not be treated as
         * real object that is drawn or actually used in the chart.
         *
         * @type {boolean}
         */
        _this.isTemplate = false;
        _this.className = "SpriteState";
        // Make filter list disposable
        _this._disposers.push(new ListDisposer(_this.filters));
        // Decorate adapter with events so that we can apply its settings whenever
        // it is modified
        _this.adapter.events.on("inserted", function (ev) {
            _this[ev.newValue.key] = _this[ev.newValue.key];
        }, undefined, false);
        _this.adapter.events.on("removed", function (ev) {
            _this[ev.newValue.key] = _this[ev.newValue.key];
        }, undefined, false);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns [[Sprite]] element's property value.
     *
     * Will check if there are any bindings with [[DataItem]] and if there are
     * any method callbacks set up for the specific property.
     *
     * @param  {Properties}  propertyName  Property name
     * @return {any}                       Property value
     */
    SpriteState.prototype.getPropertyValue = function (propertyName) {
        var propValue = this.properties[propertyName];
        var sprite = this.sprite;
        if (sprite) {
            var fieldName = this.propertyFields[propertyName];
            if ($type.hasValue(fieldName)) {
                if (sprite.dataItem) {
                    propValue = sprite.dataItem.dataContext[fieldName];
                }
            }
            // Apply adapters
            // If the value itself is undefined, we're going to pass in Sprite's
            // value to adapters
            // @todo get rid of <any>
            if (!$type.hasValue(propValue)) {
                var spriteValue = sprite.getPropertyValue(propertyName);
                propValue = this.adapter.apply(propertyName, sprite.getPropertyValue(propertyName));
                if (propValue == spriteValue) {
                    propValue = undefined;
                }
            }
            else {
                propValue = this.adapter.apply(propertyName, propValue);
            }
            /*let method = this.propertyMethods.getKey(propertyName);
            if (method) {
                propValue = method(sprite, propertyName);
            }*/
        }
        return propValue;
    };
    /**
     * Copies all property and style values from another [[SpriteState]] object.
     *
     * @param {SpriteState}  source  Source [[SpriteState]]
     */
    SpriteState.prototype.copyFrom = function (source) {
        if (source && source != this) {
            this.transitionDuration = source.transitionDuration;
            this.transitionEasing = source.transitionEasing;
            $utils.copyProperties(source.properties, this.properties);
            $utils.copyProperties(source.propertyFields, this.propertyFields);
            this.filters.copyFrom(source.filters);
            this.adapter.copyFrom(source.adapter);
        }
    };
    Object.defineProperty(SpriteState.prototype, "allValues", {
        /**
         * Returns all values that should be applied by the SpriteState.
         *
         * It takes adapters into account.
         *
         * @ignore Exclude from docs
         * @return {ISpriteProperties} Properties
         * @todo Add adapter values
         * @todo proper type this["_properties"]
         */
        get: function () {
            var _this = this;
            // Init return value
            var res = {};
            // Apply adapters to all values
            $object.each(this.properties, function (prop, value) {
                res[prop] = _this.getPropertyValue(prop);
            });
            // Cycle through all adapters and add values for missing properties
            var keys = this.adapter.keys();
            for (var x in keys) {
                var prop = keys[x];
                var value = this.getPropertyValue(prop);
                res[prop] = value;
            }
            // Cycle through all property fileds and add values for missing properties
            var propertyFields = this.propertyFields;
            for (var prop in propertyFields) {
                var value = this.getPropertyValue(prop);
                res[prop] = value;
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resets the State to initial state - no values or Filters applied.
     */
    SpriteState.prototype.reset = function () {
        this.properties = {};
        this.filters.clear();
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    SpriteState.prototype.processConfig = function (config) {
        if ($type.hasValue(config) && $type.hasValue(config["properties"])) {
            $object.each(config["properties"], function (key, value) {
                if ($type.isString(value)) {
                    if (value.match(/^[0-9.\-]+\%$/)) {
                        config["properties"][key] = percent($type.toNumber(value));
                    }
                    else if (value.match(/^\#[0-9abcdef]{3,}$/i)) {
                        config["properties"][key] = toColor(value);
                    }
                }
            });
        }
        _super.prototype.processConfig.call(this, config);
    };
    return SpriteState;
}(BaseObject));
export { SpriteState };
//# sourceMappingURL=SpriteState.js.map