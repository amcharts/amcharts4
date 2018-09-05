/**
 * Defines functionality for "Data Item"
 *
 * A Data Item can be any object that can hold data. For example [[LineSeries]]
 * holds a number of values, that comprise a line graph. Each of those values
 * (data points) is a {DataItem}.
 *
 * Furthermore the [[LineSeries]] itself can be represented as a entry in the
 * legend. Since legend needs access to Line Series' value, a DataItem is
 * created for the series.
 *
 * @todo Verify/update description
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents } from "./Base";
import { Adapter } from "./utils/Adapter";
import { Animation, AnimationDisposer } from "./utils/Animation";
import * as $utils from "./utils/Utils";
import * as $array from "./utils/Array";
import * as $object from "./utils/Object";
import * as $type from "./utils/Type";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * DataItem represents single element in data, for example a data point in a
 * Serial Chart Series, e.g. a column.
 *
 * DataItem defines relationship between structured data, required for specific
 * chart type or task, and raw source data.
 *
 * It also implements required calculations, updates related visual elements,
 * etc.
 *
 * @todo Description
 * @important
 */
var DataItem = /** @class */ (function (_super) {
    tslib_1.__extends(DataItem, _super);
    /**
     * Constructor
     * @todo Adding events to disposers produces errors in some cases, which means that chart is using disposed Data Items which is not right
     */
    function DataItem() {
        var _this = _super.call(this) || this;
        /**
         * Holds Adapter.
         *
         * @type {Adapter<DataItem, IDataItemAdapters>}
         */
        _this.adapter = new Adapter(_this);
        /**
         * This Data Item is currently disabled.
         *
         * @ignore Exclude from docs
         * @type {boolean}
         */
        _this._disabled = false;
        /**
         * Indicates whether Data Item has any properties set.
         *
         * If it does not have any, the code can use this property to check whether
         * they need to apply costly operation of re-applying properties, whenever
         * Data Item-related element is redrawn, e.g. series.
         *
         * @type {boolean}
         */
        _this.hasProperties = false;
        /**
         * An object containing calculated values.
         */
        _this.values = {};
        /**
         * An object container current working values.
         */
        //public readonly workingValues: { [index: string]: { [index: string]: number } } = {};
        /**
         * An object containing categories.
         */
        _this.categories = {};
        /**
         * An object containing dates.
         */
        _this.dates = {};
        /**
         * An object containing locations for the Data Item.
         *
         * A location is a position within date or category, or, in some other cases,
         * where there is no single point but rather some period.
         */
        _this.locations = {};
        /**
         * Current working locations.
         */
        _this.workingLocations = {};
        /**
         * An object containing Data Item specific appearance properties in key-value
         * pairs.
         *
         * Sometimes a single Data Item needs to apply different properties than the
         * rest of the data [[Series]] it is part of. E.g. a single column,
         * represented by a Data Item needs to be filled with a different color than
         * the reset of the [[ColumnSeries]] it belongs to.
         *
         * That's where Data Item's `properties` come into play.
         *
         * Please note that you should set Data Item-specific properties using
         * `setProperty()` method, rather than access `properties` object directly.
         */
        _this.properties = {};
        /**
         * A list of [[Sprite]] elements that are associated with this Data Item.
         *
         * E.g. an [[Axis]] Data Item has several separate elements associated with
         * it, like [[AxisTick]], [[AxisLabel]], and [[Grid]].
         *
         * Data Item keeps track of all of them, so it can toggle all related visual
         * elements when it itself is toggled.
         *
         * @type {Sprite[]}
         */
        _this.sprites = [];
        /**
         * Identifies if this object is a "template" and should not be treated as
         * real object that is drawn or actually used in the chart.
         *
         * @type {boolean}
         */
        _this.isTemplate = false;
        /**
         * Is Data Item currently visible?
         *
         * @ignore Exclude from docs
         * @type {boolean}
         */
        _this._visible = true;
        /**
         * Should this Data Item be used when calculating data ranges and scales?
         *
         * @ignore Exclude from docs
         * @type {boolean}
         */
        _this._ignoreMinMax = false;
        /**
         * Some of the Data Item's data fields may contain an array of children. This
         * property contains an object indicating which fields hold an array, so that
         * they can be processed properly.
         *
         * @ignore Exclude from docs
         */
        _this.hasChildren = {};
        /**
         * Indicates whether Data Item is currently animiting from visible to hidden
         * state.
         *
         * @type {boolean}
         */
        _this.isHiding = false;
        /**
         *
         * @ignore Exclude from docs
         */
        _this._valueAnimations = {};
        /**
         *
         * @ignore Exclude from docs
         */
        _this._locationAnimations = {};
        _this.className = "DataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(DataItem.prototype, "index", {
        /**
         * Data Item's position index in Component's data.
         *
         * @return {number} Index
         */
        get: function () {
            if (this.component) {
                return this.component.dataItems.indexOf(this);
            }
            else {
                return -1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataItem.prototype, "animations", {
        /**
         * A list of [[Animations]] objects currently mutating Data Item's values.
         *
         * @return {Array<Animation>} [description]
         */
        get: function () {
            if (!this._animations) {
                this._animations = [];
                this._disposers.push(new AnimationDisposer(this._animations));
            }
            return this._animations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataItem.prototype, "visible", {
        /**
         * Returns `true` if this Data Item is currently visible.
         *
         * @return {boolean} Visible?
         */
        get: function () {
            return this._visible;
        },
        /**
         * Sets visibility of the Data Item.
         *
         * @param {boolean} value Visible?
         */
        set: function (value) {
            this.setVisibility(value);
            if (this._visible != value) {
                this._visible = value;
                if (this.events.isEnabled("visibilitychanged")) {
                    var event_1 = {
                        type: "visibilitychanged",
                        target: this,
                        visible: value
                    };
                    this.events.dispatchImmediately("visibilitychanged", event_1);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataItem.prototype, "__disabled", {
        /**
         * Is this Data Item currently disabled?
         *
         * @ignore Exclude from docs
         * @param {boolean}
         */
        get: function () {
            return this._disabled;
        },
        /**
         * Disables all Sprites associated with this Data Item.
         *
         * @ignore Exclude from docs
         * @param {boolean}
         */
        set: function (value) {
            //	if (this._disabled != value) { // not good
            this._disabled = value;
            $array.each(this.sprites, function (sprite) {
                sprite.__disabled = value;
            });
            //	}
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets visibility of the Data Item.
     *
     * @param {boolean} value Data Item
     */
    DataItem.prototype.setVisibility = function (value) {
        $array.each(this.sprites, function (sprite) {
            sprite.visible = value;
            //sprite.hide();
        });
    };
    /**
     * Shows the Data Item and related visual elements.
     *
     * @param {number}    duration  Animation duration (ms)
     * @param {number}    delay     Delay animation (ms)
     * @param {string[]}  fields    A list of fields to set values of
     */
    DataItem.prototype.show = function (duration, delay, fields) {
        var _this = this;
        this.isHiding = false;
        if (this._hideDisposer) {
            this.removeDispose(this._hideDisposer);
        }
        var animation;
        if (fields) {
            $array.each(fields, function (field) {
                animation = _this.setWorkingValue(field, _this.values[field].value, duration, delay);
            });
        }
        $array.each(this.sprites, function (sprite) {
            var animation = sprite.show(duration);
            if (delay != null && delay > 0 && animation != null && !animation.isDisposed()) {
                animation.delay(delay);
            }
        });
        this._visible = true;
        return animation;
    };
    /**
     * Destroys this object and all related data.
     */
    DataItem.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        $array.each(this.sprites, function (sprite) {
            sprite.dispose();
        });
        this.sprites = [];
    };
    /**
     * Hides the Data Item and related visual elements.
     *
     * @param {number}    duration  Animation duration (ms)
     * @param {number}    delay     Delay animation (ms)
     * @param {number}    toValue   A value to set to `fields` when hiding
     * @param {string[]}  fields    A list of data fields to set value to `toValue`
     */
    DataItem.prototype.hide = function (duration, delay, toValue, fields) {
        var _this = this;
        this.isHiding = true;
        $array.each(this.sprites, function (sprite) {
            var animation = sprite.hide(duration);
            if (delay != null && delay > 0 && animation != null && !animation.isDisposed()) {
                animation.delay(delay);
            }
        });
        if ($type.isNumber(toValue) && fields) {
            var animation_1;
            $array.each(fields, function (field) {
                var anim = _this.setWorkingValue(field, toValue, duration, delay);
                if (anim) {
                    animation_1 = anim;
                }
            });
            if (animation_1) {
                this._hideDisposer = animation_1.events.on("animationended", function () {
                    _this.visible = false;
                    _this.isHiding = false;
                });
                this._disposers.push(this._hideDisposer);
                return animation_1;
            }
        }
        this.visible = false;
    };
    /**
     * Returns a duration (ms) the Data Item should take to animate from one
     * value to another.
     *
     * If the duration is not specified via parameter, this method will try to
     * request a default duration from the related `Component`.
     *
     * @param  {number}  duration  Default duration (ms)
     * @return {number}            Duration (ms)
     */
    DataItem.prototype.getDuration = function (duration) {
        var component = this.component;
        if (component) {
            if (!$type.isNumber(duration)) {
                duration = component.interpolationDuration;
            }
        }
        if (duration != null) {
            return this.adapter.apply("duration", duration);
        }
    };
    /**
     * Returns a numeric value for specific data field.
     *
     * If `calculated` is not set, it will return a raw value, as it is in
     * source data.
     *
     * If `calculated` is set, it will return a pre-calculated specific value.
     *
     * @param  {string}           name        Data field name
     * @param  {CalculatedValue}  calculated  A calculated value name
     * @return {Optional<number>}             Value
     */
    DataItem.prototype.getValue = function (name, calculated) {
        if (name && this.component) {
            if (!calculated) {
                calculated = this.component.dataFields[name + "Show"];
                if (!calculated) {
                    calculated = "value";
                }
            }
            var value = this.values[name][calculated];
            if (this.adapter.isEnabled("value")) {
                return this.adapter.apply("value", {
                    value: value,
                    field: name
                }).value;
            }
            else {
                return value;
            }
        }
    };
    /**
     * Returns a current working value for a specific data field.
     *
     * The actual value may differ from the one returned by `getValue()`. The
     * latter returns static values from the data source.
     *
     * `getWorkingValue()` returns current value, which is usually different if
     * Data Item is animating from one state to another.
     *
     * @param  {string}           name        Data field name
     * @param  {CalculatedValue}  calculated  A calculated value name
     * @return {Optional<number>}             Value
     */
    DataItem.prototype.getWorkingValue = function (name) {
        if (name && this.component) {
            var realName = this.component.dataFields[name + "Show"];
            if (!realName) {
                realName = "workingValue";
            }
            return this.adapter.apply("workingValue", {
                workingValue: this.values[name][realName],
                field: name
            }).workingValue;
        }
    };
    /**
     * Sets a numeric value for specific data field.
     *
     * @param {string}           name        Data field name
     * @param {number}           value       Value
     * @param {CalculatedValue}  calculated  Calculated data field name
     * @param {number}           duration    Duration (ms) to animate to new value to
     * @param {number}           delay       Delay animation (ms)
     */
    DataItem.prototype.setValue = function (name, value, duration, delay) {
        var currentValue = this.values[name].value;
        var newDuration = this.getDuration(duration);
        value = $type.toNumber(value);
        if (currentValue !== value) {
            this.values[name].value = value;
            if (this.events.isEnabled("valuechanged")) {
                var event_2 = {
                    type: "valuechanged",
                    target: this,
                    property: name
                };
                this.events.dispatchImmediately("valuechanged", event_2);
            }
        }
        this.setWorkingValue(name, value, newDuration, delay);
    };
    DataItem.prototype.setCalculatedValue = function (name, value, calculated) {
        var currentValue = this.values[name][calculated];
        if (currentValue !== value && $type.isNumber(value)) {
            this.values[name][calculated] = value;
            if (this.events.isEnabled("calculatedvaluechanged")) {
                var event_3 = {
                    type: "calculatedvaluechanged",
                    target: this,
                    property: name
                };
                this.events.dispatchImmediately("calculatedvaluechanged", event_3);
            }
        }
    };
    /**
     * Set current working numeric value for a specific data field.
     *
     * @param  {string}           name        Data field name
     * @param  {number}           value       Value
     * @param  {CalculatedValue}  calculated  Calculated data field name
     * @param  {number}           duration    Duration (ms) to animate to new value to
     * @param  {number}           delay       Delay animation (ms)
     * @return {Optional<Animation>}          An [[Animation]] object used for transition to new values
     */
    DataItem.prototype.setWorkingValue = function (name, value, duration, delay) {
        if ($type.isNumber(this.values[name].value)) {
            var newDuration = this.getDuration(duration);
            var workingValue = this.values[name].workingValue;
            if (newDuration != null && newDuration > 0 && $type.isNumber(workingValue) && this.component) { // sometimes NaN is passed, so only change this to != null if all cases of NaN are handled, otherwise animation won't stop
                if (workingValue != value) {
                    var animation = this.animate({ childObject: this.values[name], property: "workingValue", from: workingValue, to: value, dummyData: name }, newDuration, this.component.interpolationEasing);
                    if (delay != null) {
                        animation.delay(delay);
                    }
                    animation.events.on("animationstarted", this.handleInterpolationProgress, this);
                    animation.events.on("animationprogress", this.handleInterpolationProgress, this);
                    animation.events.on("animationended", this.handleInterpolationProgress, this);
                    this._valueAnimations[name] = animation;
                    return animation;
                }
                else {
                    var valueAnimation = this._valueAnimations[name];
                    if (valueAnimation) {
                        valueAnimation.stop();
                    }
                    this.values[name].workingValue = value;
                }
            }
            else {
                var valueAnimation = this._valueAnimations[name];
                if (valueAnimation) {
                    valueAnimation.stop();
                }
                this.values[name].workingValue = value;
                if (this.events.isEnabled("workingvaluechanged")) {
                    var event_4 = {
                        type: "workingvaluechanged",
                        target: this,
                        property: name
                    };
                    this.events.dispatchImmediately("workingvaluechanged", event_4);
                }
            }
        }
    };
    /**
     * Sets a relative location for a data field.
     *
     * A location is always relative on a 0 to 1 scale, with 0 being beginning,
     * 0.5 middle and 1 end.
     *
     * @todo Rewiew description
     * @param {string}  name      Data field name
     * @param {number}  value     Location (0-1)
     * @param {number}  duration  Duration (ms) to animate to new value to
     * @param {number}  delay     Delay animation (ms)
     */
    DataItem.prototype.setLocation = function (name, value, duration, delay) {
        var currentLocation = this.locations[name];
        if (currentLocation !== value) {
            this.locations[name] = value;
            if (this.events.isEnabled("locationchanged")) {
                var event_5 = {
                    type: "locationchanged",
                    target: this,
                    property: name
                };
                this.events.dispatchImmediately("locationchanged", event_5);
            }
            this.setWorkingLocation(name, value, duration, delay);
        }
    };
    /**
     * Sets a current working location for a data field.
     *
     * @todo Rewiew description
     * @param {string}  name      Data field name
     * @param {number}  value     Location (0-1)
     * @param {number}  duration  Duration (ms) to animate to new value to
     * @param {number}  delay     Delay animation (ms)
     */
    DataItem.prototype.setWorkingLocation = function (name, value, duration, delay) {
        var newDuration = this.getDuration(duration);
        var workingLocation = this.workingLocations[name];
        if (newDuration != null && newDuration > 0 && $type.isNumber(workingLocation) && this.component) { // sometimes NaN is passed, so only change this to != null if all cases of NaN are handled, otherwise animation won't stop
            if (workingLocation != value) {
                var animation = this.animate({ childObject: this.workingLocations, property: name, from: workingLocation, to: value, dummyData: name }, newDuration, this.component.interpolationEasing);
                if (delay != null) {
                    animation.delay(delay);
                }
                animation.events.on("animationstarted", this.handleInterpolationProgress, this);
                animation.events.on("animationprogress", this.handleInterpolationProgress, this);
                animation.events.on("animationended", this.handleInterpolationProgress, this);
                this._locationAnimations[name] = animation;
                return animation;
            }
            else {
                var locationAnimation = this._locationAnimations[name];
                if (locationAnimation) {
                    locationAnimation.stop();
                }
                this.workingLocations[name] = value;
            }
        }
        else {
            var locationAnimation = this._locationAnimations[name];
            if (locationAnimation) {
                locationAnimation.stop();
            }
            this.workingLocations[name] = value;
            if (this.events.isEnabled("workinglocationchanged")) {
                var event_6 = {
                    type: "workinglocationchanged",
                    target: this,
                    property: name
                };
                this.events.dispatchImmediately("workinglocationchanged", event_6);
            }
        }
    };
    /**
     * Sets Date value to a data field.
     *
     * @param {string}  name      Data field name
     * @param {Date}    date      Date object
     * @param {number}  duration  Duration (ms) to animate to new value to
     */
    DataItem.prototype.setDate = function (name, date, duration) {
        if (!$type.isDate(date) && this.component) {
            date = this.component.dateFormatter.parse(date);
        }
        var currentDate = this.dates[name];
        if (currentDate !== date) {
            this.dates[name] = date;
            this.setValue(name, date.getTime(), duration);
        }
    };
    /**
     * Returns a Date value of the data field.
     *
     * @param  {string}  name  Data field name
     * @return {Date}          Date object
     */
    DataItem.prototype.getDate = function (name) {
        return this.adapter.apply("date", {
            date: this.dates[name],
            field: name
        }).date;
    };
    /**
     * Sets a Data Item-specific visual properties to apply to related elements.
     *
     * @param {string}  name   Property name
     * @param {any}     value  Property value
     */
    DataItem.prototype.setProperty = function (name, value) {
        if (this.properties[name] !== value) {
            this.hasProperties = true;
            this.properties[name] = value;
            if (this.events.isEnabled("propertychanged")) {
                var event_7 = {
                    type: "propertychanged",
                    target: this,
                    property: name,
                    value: value
                };
                this.events.dispatchImmediately("propertychanged", event_7);
            }
        }
    };
    /**
     * Sets a related category for this Data Item.
     *
     * @todo Review description
     * @param {string}  name   Data field name
     * @param {string}  value  Category
     */
    DataItem.prototype.setCategory = function (name, value) {
        if (!$type.isString(value)) {
            value = $type.castString(value);
        }
        if (this.categories[name] !== value) {
            this.categories[name] = value;
        }
    };
    /**
     * Clones the Data Item, including all related data.
     *
     * @return {this} New Data Item clone
     */
    DataItem.prototype.clone = function (cloneId) {
        var dataItem = _super.prototype.clone.call(this, cloneId);
        if (this.dataContext) {
            dataItem.dataContext = $utils.copy(this.dataContext, {});
        }
        $utils.copyProperties(this.locations, dataItem.locations);
        $utils.copyProperties(this.properties, dataItem.properties);
        $utils.copyProperties(this.categories, dataItem.categories);
        $utils.copyProperties(this.values, dataItem.values);
        $utils.copyProperties(this.dates, dataItem.dates);
        $object.each(this.values, function (name, value) {
            //for (let name in this.values) {
            dataItem.values[name] = $object.copy(value);
        });
        dataItem.events.copyFrom(this.events);
        dataItem.component = this.component;
        return dataItem;
    };
    Object.defineProperty(DataItem.prototype, "opacity", {
        /**
         * Sets opacity for all Data Item's related elements (Sprites).
         *
         * @param {number} value Opacity (0-1)
         */
        set: function (value) {
            $array.each(this.sprites, function (sprite) {
                sprite.opacity = value;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataItem.prototype, "ignoreMinMax", {
        /**
         * Exclude from min/max calculations?
         * @return {boolean} Exclude from min/max calculations?
         */
        get: function () {
            return this._ignoreMinMax;
        },
        /**
         * Sets whether this data point should not be included in the scale and
         * minimum/maximum calculations.
         *
         * E.g. some we may want to exclude a particular data point from influencing
         * [[ValueAxis]] scale.
         *
         * @param {boolean}  value  Exclude from min/max calculations?
         */
        set: function (value) {
            this._ignoreMinMax = value;
            if (this.events.isEnabled("propertychanged")) {
                var event_8 = {
                    type: "propertychanged",
                    target: this,
                    property: "ignoreMinMax",
                    value: value
                };
                this.events.dispatchImmediately("propertychanged", event_8);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and starts an [[Animation]] to interpolate (morph) Data Item's
     * properties and/or values.
     *
     * @see {@link Animation}
     * @param  {IAnimationOptions[] | IAnimationOptions}  animationOptions  Animation options
     * @param  {number}                                   duration          Animation duration (ms)
     * @param  {function}                                 easing            Easing function
     * @return {Animation}                                                  Animation
     */
    DataItem.prototype.animate = function (animationOptions, duration, easing) {
        return new Animation(this, animationOptions, duration, easing).start();
    };
    /**
     * Handles intermediate steps when Data Item is interpolating (morphing) from
     * one value to another.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Animation, IAnimationEvents>["animationstarted" | "animationended" | "animationprogress"]} event Event object
     */
    DataItem.prototype.handleInterpolationProgress = function (event) {
        var animation = event.target;
        // it's always only one options, no need cycle
        var animationOptions = animation.animationOptions[0];
        if (animationOptions) {
            if (this.events.isEnabled("workingvaluechanged")) {
                var event_9 = {
                    type: "workingvaluechanged",
                    target: this,
                    property: animationOptions.dummyData
                };
                this.events.dispatchImmediately("workingvaluechanged", event_9);
            }
        }
    };
    /**
     * Checks whether Data Item has values set for all of the data fields,
     * supplied via argument.
     *
     * @ignore Exclude from docs
     * @param  {string[]}  fields  Field list to check
     * @return {boolean}           Has values for all fields?
     */
    DataItem.prototype.hasValue = function (fields) {
        // todo: what about categories?
        for (var i = 0; i < fields.length; i++) {
            if (!$type.hasValue(this.values[fields[i]].value)) {
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(DataItem.prototype, "depth", {
        /**
         * Depth of the Data Item.
         *
         * In nested data structures, like TreeMap, this indicates the level this
         * data point is at, in relation to the parent Data Item.
         *
         * @return {number} Depth
         */
        get: function () {
            if (!this.parent) {
                return 0;
            }
            else {
                return this.parent.depth + 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataItem.prototype, "dataContext", {
        /**
         * Sets to a reference to an original object from Component's data.
         *
         * @return {Object} [description]
         */
        get: function () {
            return this._dataContext;
        },
        /**
         * A reference to an original object in Component's data, that this Data Item
         * is derived from.
         *
         * @param {Object} value Original data object
         */
        set: function (value) {
            this._dataContext = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * adds a sprite to dataItem.sprites array
     * @ignore
     */
    DataItem.prototype.addSprite = function (sprite) {
        if (sprite.dataItem && sprite.dataItem != this) {
            $array.remove(sprite.dataItem.sprites, sprite);
        }
        this.sprites.push(sprite);
        sprite.dataItem = this;
    };
    return DataItem;
}(BaseObjectEvents));
export { DataItem };
//# sourceMappingURL=DataItem.js.map