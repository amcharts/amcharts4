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
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents, IBaseObjectEvents } from "./Base";
import { AMEvent } from "./utils/EventDispatcher";
import { Adapter } from "./utils/Adapter";
import { Component, CalculatedValue } from "./Component";
import { IAnimatable, Animation, IAnimationOptions, IAnimationEvents } from "./utils/Animation";
import { Sprite } from "./Sprite";
import { IDisposer } from "./utils/Disposer";
import * as $type from "./utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 *
 * @todo Description
  */
export interface IValues {
}
/**
 * Defines data events for [[DataItem]]
 */
export interface IDataItemEvents extends IBaseObjectEvents {
    /**
     * Invoked when the visibility of the Data Item changes, i.e. Series is
     * hidden
     */
    visibilitychanged: {
        visible: boolean;
    };
    /**
     * Invoked when the value is changed
     */
    valuechanged: {
        property: string;
    };
    /**
     * Invoked when the internal/intermediate value has changed
     */
    workingvaluechanged: {
        property: string;
    };
    /**
     * Invoked when the calculated value has changed
     */
    calculatedvaluechanged: {
        property: string;
    };
    /**
     * Invoked when the location of Data Item changes
     */
    locationchanged: {
        property: string;
    };
    /**
     * Invoked when working location of Data Item changes
     */
    workinglocationchanged: {
        property: string;
    };
    /**
     * Invoked when a property of the Data Item changes
     */
    propertychanged: {
        property: string;
        value: any;
    };
}
/**
 * Defines adapters for [[DataItem]]
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IDataItemAdapters {
    duration: number;
    value: {
        value: number;
        field: string;
    };
    workingValue: {
        workingValue: number;
        field: string;
    };
    date: {
        date: Date;
        field: string;
    };
}
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
export declare class DataItem extends BaseObjectEvents implements IAnimatable {
    /**
     * When we are using a nested data structure, like for example in a TreeMap,
     * this property points to a parent Data Item of this one.
     *
     * @type {Optional<this>}
     */
    parent: $type.Optional<this>;
    /**
     * Defines available events.
     *
     * @type {IDataItemEvents}
     * @ignore Exclude from docs
     */
    _events: IDataItemEvents;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IExportAdapters}
     */
    _adapter: IDataItemAdapters;
    /**
     * Holds Adapter.
     *
     * @type {Adapter<DataItem, IDataItemAdapters>}
     */
    adapter: Adapter<DataItem, IDataItemAdapters>;
    /**
     * Defines a type of [[Component]] this Data Item is used for.
     *
     * @ignore Exclude from docs
     * @type {Component}
     */
    _component: Component;
    /**
     * A reference to a [[Component]] this Data Item belongs to.
     *
     * @ignore Exclude from docs
     * @type {Optional<Component>}
     */
    component: $type.Optional<this["_component"]>;
    /**
     * A reference to the original Data Item in raw data.
     *
     * @ignore Exclude from docs
     * @type {Object}
     */
    protected _dataContext: Object;
    /**
     * This Data Item is currently disabled.
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    protected _disabled: boolean;
    /**
     * Indicates whether Data Item has any properties set.
     *
     * If it does not have any, the code can use this property to check whether
     * they need to apply costly operation of re-applying properties, whenever
     * Data Item-related element is redrawn, e.g. series.
     *
     * @type {boolean}
     */
    hasProperties: boolean;
    /**
     * An object containing calculated values.
     */
    readonly values: {
        [index: string]: {
            [index: string]: number;
        };
    };
    /**
     * An object container current working values.
     */
    /**
     * An object containing categories.
     */
    readonly categories: {
        [index: string]: string;
    };
    /**
     * An object containing dates.
     */
    readonly dates: {
        [index: string]: Date;
    };
    /**
     * An object containing locations for the Data Item.
     *
     * A location is a position within date or category, or, in some other cases,
     * where there is no single point but rather some period.
     */
    readonly locations: {
        [index: string]: number;
    };
    /**
     * Current working locations.
     */
    readonly workingLocations: {
        [index: string]: number;
    };
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
    readonly properties: {
        [index: string]: any;
    };
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
    sprites: Sprite[];
    /**
     * Identifies if this object is a "template" and should not be treated as
     * real object that is drawn or actually used in the chart.
     *
     * @type {boolean}
     */
    isTemplate: boolean;
    /**
     * List of animations currently animating Data Item's values.
     *
     * @ignore Exclude from docs
     * @type {Optional<Array<Animation>>}
     */
    protected _animations: $type.Optional<Array<Animation>>;
    /**
     * Is Data Item currently visible?
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    protected _visible: boolean;
    /**
     * Should this Data Item be used when calculating data ranges and scales?
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    protected _ignoreMinMax: boolean;
    /**
     * Some of the Data Item's data fields may contain an array of children. This
     * property contains an object indicating which fields hold an array, so that
     * they can be processed properly.
     *
     * @ignore Exclude from docs
     */
    hasChildren: {
        [index: string]: boolean;
    };
    /**
     * Indicates whether Data Item is currently animiting from visible to hidden
     * state.
     *
     * @type {boolean}
     */
    isHiding: boolean;
    /**
     * Holds a Disposer reference to hiding [[Animation]] currently playing.
     *
     * @ignore Exclude from docs
     * @type {Optional<IDisposer>}
     */
    protected _hideDisposer: $type.Optional<IDisposer>;
    /**
     *
     * @ignore Exclude from docs
     */
    protected _valueAnimations: {
        [key: string]: Animation;
    };
    /**
     *
     * @ignore Exclude from docs
     */
    protected _locationAnimations: {
        [key: string]: Animation;
    };
    /**
     * Constructor
     * @todo Adding events to disposers produces errors in some cases, which means that chart is using disposed Data Items which is not right
     */
    constructor();
    /**
     * Data Item's position index in Component's data.
     *
     * @return {number} Index
     */
    readonly index: number;
    /**
     * A list of [[Animations]] objects currently mutating Data Item's values.
     *
     * @return {Array<Animation>} [description]
     */
    readonly animations: Array<Animation>;
    /**
     * Returns `true` if this Data Item is currently visible.
     *
     * @return {boolean} Visible?
     */
    /**
     * Sets visibility of the Data Item.
     *
     * @param {boolean} value Visible?
     */
    visible: boolean;
    /**
     * Is this Data Item currently disabled?
     *
     * @ignore Exclude from docs
     * @param {boolean}
     */
    /**
     * Disables all Sprites associated with this Data Item.
     *
     * @ignore Exclude from docs
     * @param {boolean}
     */
    __disabled: boolean;
    /**
     * Sets visibility of the Data Item.
     *
     * @param {boolean} value Data Item
     */
    setVisibility(value: boolean): void;
    /**
     * Shows the Data Item and related visual elements.
     *
     * @param {number}    duration  Animation duration (ms)
     * @param {number}    delay     Delay animation (ms)
     * @param {string[]}  fields    A list of fields to set values of
     */
    show(duration?: number, delay?: number, fields?: string[]): $type.Optional<Animation>;
    /**
     * Destroys this object and all related data.
     */
    dispose(): void;
    /**
     * Hides the Data Item and related visual elements.
     *
     * @param {number}    duration  Animation duration (ms)
     * @param {number}    delay     Delay animation (ms)
     * @param {number}    toValue   A value to set to `fields` when hiding
     * @param {string[]}  fields    A list of data fields to set value to `toValue`
     */
    hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): $type.Optional<Animation>;
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
    getDuration(duration?: number): $type.Optional<number>;
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
    getValue(name: string, calculated?: CalculatedValue): $type.Optional<number>;
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
    getWorkingValue(name: string): $type.Optional<number>;
    /**
     * Sets a numeric value for specific data field.
     *
     * @param {string}           name        Data field name
     * @param {number}           value       Value
     * @param {CalculatedValue}  calculated  Calculated data field name
     * @param {number}           duration    Duration (ms) to animate to new value to
     * @param {number}           delay       Delay animation (ms)
     */
    setValue(name: string, value: number, duration?: number, delay?: number): void;
    setCalculatedValue(name: string, value: number, calculated: CalculatedValue): void;
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
    setWorkingValue(name: string, value: number, duration?: number, delay?: number): $type.Optional<Animation>;
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
    setLocation(name: string, value: number, duration?: number, delay?: number): void;
    /**
     * Sets a current working location for a data field.
     *
     * @todo Rewiew description
     * @param {string}  name      Data field name
     * @param {number}  value     Location (0-1)
     * @param {number}  duration  Duration (ms) to animate to new value to
     * @param {number}  delay     Delay animation (ms)
     */
    setWorkingLocation(name: string, value: number, duration?: number, delay?: number): $type.Optional<Animation>;
    /**
     * Sets Date value to a data field.
     *
     * @param {string}  name      Data field name
     * @param {Date}    date      Date object
     * @param {number}  duration  Duration (ms) to animate to new value to
     */
    setDate(name: string, date: Date, duration?: number): void;
    /**
     * Returns a Date value of the data field.
     *
     * @param  {string}  name  Data field name
     * @return {Date}          Date object
     */
    getDate(name: string): Date;
    /**
     * Sets a Data Item-specific visual properties to apply to related elements.
     *
     * @param {string}  name   Property name
     * @param {any}     value  Property value
     */
    setProperty(name: string, value: any): void;
    /**
     * Sets a related category for this Data Item.
     *
     * @todo Review description
     * @param {string}  name   Data field name
     * @param {string}  value  Category
     */
    setCategory(name: string, value: string): void;
    /**
     * Clones the Data Item, including all related data.
     *
     * @return {this} New Data Item clone
     */
    clone(cloneId?: string): this;
    /**
     * Sets opacity for all Data Item's related elements (Sprites).
     *
     * @param {number} value Opacity (0-1)
     */
    opacity: number;
    /**
     * Exclude from min/max calculations?
     * @return {boolean} Exclude from min/max calculations?
     */
    /**
     * Sets whether this data point should not be included in the scale and
     * minimum/maximum calculations.
     *
     * E.g. some we may want to exclude a particular data point from influencing
     * [[ValueAxis]] scale.
     *
     * @param {boolean}  value  Exclude from min/max calculations?
     */
    ignoreMinMax: boolean;
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
    animate(animationOptions: IAnimationOptions[] | IAnimationOptions, duration: number, easing?: (value: number) => number): Animation;
    /**
     * Handles intermediate steps when Data Item is interpolating (morphing) from
     * one value to another.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Animation, IAnimationEvents>["animationstarted" | "animationended" | "animationprogress"]} event Event object
     */
    handleInterpolationProgress(event: AMEvent<Animation, IAnimationEvents>["animationstarted" | "animationended" | "animationprogress"]): void;
    /**
     * Checks whether Data Item has values set for all of the data fields,
     * supplied via argument.
     *
     * @ignore Exclude from docs
     * @param  {string[]}  fields  Field list to check
     * @return {boolean}           Has values for all fields?
     */
    hasValue(fields: string[]): boolean;
    /**
     * Depth of the Data Item.
     *
     * In nested data structures, like TreeMap, this indicates the level this
     * data point is at, in relation to the parent Data Item.
     *
     * @return {number} Depth
     */
    readonly depth: number;
    /**
     * Sets to a reference to an original object from Component's data.
     *
     * @return {Object} [description]
     */
    /**
     * A reference to an original object in Component's data, that this Data Item
     * is derived from.
     *
     * @param {Object} value Original data object
     */
    dataContext: Object;
    /**
     * adds a sprite to dataItem.sprites array
     * @ignore
     */
    addSprite(sprite: Sprite): void;
}
