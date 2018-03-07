/**
 * Base functionality
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IClone } from "./utils/Clone";
import { List } from "./utils/List";
import { Dictionary, DictionaryTemplate } from "./utils/Dictionary";
import { IDisposer } from "./utils/Disposer";
import { EventDispatcher, AMEvent } from "./utils/EventDispatcher";
import { Adapter } from "./utils/Adapter";
import { ITheme } from "../themes/ITheme";
import { Ordering } from "./utils/Order";
/**
 * Provides base functionality for all derivative objects, like generating ids,
 * handling cache, etc.
 */
export declare class BaseObject implements IClone<BaseObject>, IDisposer {
    /**
     * A unique ID for this object.
     *
     * Generated on first access by `uid()` getter.
     *
     * @type {string}
     * @ignore Exclude from docs
     */
    protected _uid: string;
    /**
     * Indicates if this object has already been deleted. Any
     * destruction/disposal code should take this into account when deciding
     * wheter to run potentially costly disposal operations if they already have
     * been run.
     *
     * @type {boolean}
     * @ignore Exclude from docs
     */
    protected _disposed: boolean;
    /**
     * List of IDisposer which will be disposed when the BaseObject is disposed.
     *
     * @ignore Exclude from docs
     */
    protected _disposers: Array<IDisposer>;
    /**
     * User-defined id of the object.
     *
     * @type {string}
     * @ignore Exclude from docs
     */
    protected _id: string;
    /**
     * Holds a universal mapping collection, so that elements and their children
     * can create and look up all kinds of relations between id and object.
     *
     * @type {Dictionary<string, any>}
     * @ignore Exclude from docs
     */
    protected _map: Dictionary<string, any>;
    /**
     * The theme used by this object.
     *
     * @type {ITheme[]}
     * @ignore Exclude from docs
     */
    protected _themes: ITheme[];
    /**
     * A list of objects that are clones of this object. An object needs to
     * maintain a list of its clones so that properties can be re-applied to
     * clones whenever property on the object they were cloned from changes.
     *
     * @type {Dictionary<string, BaseObject>}
     * @ignore Exclude from docs
     */
    protected _clones: List<BaseObject>;
    /**
     * Reference to the original object this object was cloned from. We need to
     * keep this so we can disassociate it from source object when this object
     * is disposed.
     *
     * @type {BaseObject}
     * @deprecated
     * @ignore Exclude from docs
     */
    clonedFrom: BaseObject;
    /**
     * A class name for the object.
     *
     * This property is used by deriving classes to identify which class it is.
     * We could derive the class name from the object itself, however method of
     * doing so is too costly, so we are relying on this property to quickly
     * access type of class.
     *
     * @type {string}
     * @ignore Exclude from docs
     */
    protected _className: string;
    /**
     * [cloneId description]
     *
     * @type {string}
     * @todo Needs description
     * @ignore Exclude from docs
     */
    cloneId: string;
    /**
     * Identifies if this object is a "template" and should not be treated as
     * real object that is drawn or actually used in the chart.
     *
     * @type {boolean}
     */
    isTemplate: boolean;
    /**
     * Constructor
     * * Sets class name
     */
    constructor();
    /**
     * Returns object's internal unique ID.
     *
     * @return {string} Unique ID
     */
    readonly uid: string;
    /**
     * @return {string} Id
     */
    /**
     * Sets the user-defined id of the element.
     *
     * @param {string} value Id
     */
    id: string;
    /**
     * Returns a universal collection for mapping ids with objects.
     *
     * @ignore Exclude from docs
     * @return {Dictionary<string, any>} Map collection
     */
    readonly map: Dictionary<string, any>;
    /**
     * Applies properties from all assigned themes.
     *
     * @ignore Exclude from docs
     */
    applyTheme(): void;
    /**
     * @ignore Exclude from docs
     * @return {ITheme[]} An array of themes
     */
    /**
     * A list of themes to be used for this element.
     *
     * @ignore Exclude from docs
     * @param {ITheme[]} value An array of themes
     */
    themes: ITheme[];
    /**
     * Returns a list of themes that should be applied to this element. It could
     * either be a list of themes set explicitly on this element, or system-wide.
     *
     * @return {ITheme[]} List of themes
     */
    getCurrentThemes(): ITheme[];
    /**
     * Returns if this object has been already been disposed.
     *
     * @return {boolean} Is disposed?
     */
    isDisposed(): boolean;
    /**
     * Destroys this object and all related data.
     */
    dispose(): void;
    /**
     * Disposes disposable object and removes it from `_disposers`.
     *
     * @param {IDisposer} target Object to dispose
     * @ignore Exclude from docs
     */
    removeDispose(target: IDisposer): void;
    /**
     * Makes a copy of this object and returns the clone.
     *
     * @param   {string}  cloneId  An id to use for clone (if not set a unique id will be generated)
     * @returns {Object}           Clone
     */
    clone<A extends this>(cloneId?: string): this;
    /**
     * Returns a collection of object's clones.
     *
     * @ignore Exclude from docs
     * @return {Dictionary<string, BaseObject>} Clones
     */
    readonly clones: List<BaseObject>;
    /**
     * Copies all properties and related data from different element.
     *
     * @param {this} object Source element
     */
    copyFrom(object: this): void;
    /**
     * @ignore Exclude from docs
     * @return {string} Class name
     */
    /**
     * Element's class name. (a class that was used to instantiate the element)
     *
     * @ignore Exclude from docs
     * @param {string}  value  Class name
     */
    className: string;
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
    /**
     * Clears object's local cache.
     *
     * @ignore Exclude from docs
     */
    clearCache(): void;
    /**
     * Creates [[Disposer]] for `setTimeout` function call. This ensures that all
     * timeouts created by the object will be cleared when object itself is
     * disposed.
     *
     * @ignore Exclude from docs
     * @param  {() => void}  fn     Callback function
     * @param  {number}      delay  Timeout (ms)
     * @return {IDisposer}          Disposer for timeout
     */
    setTimeout(fn: () => void, delay: number): IDisposer;
    /**
     * ==========================================================================
     * JSON-BASED CONFIG PROCESSING
     * ==========================================================================
     * @hidden
     */
    /**
     * Use this property to set JSON-based config. When set, triggers processing
     * routine, which will go thorugh all properties, and try to apply values,
     * create instances, etc.
     *
     * Use this with caution, as it is a time-consuming process. It's used for
     * initialchart setup only, not routine operations.
     *
     * @param {object} json JSON config
     */
    config: object;
    /**
     * Processes the JSON config.
     *
     * @param {object}  json  JSON config
     * @ignore Exclude from docs
     */
    protected processConfig(config?: object): void;
    protected processAdapters(item: Adapter<any, any>, config: any): void;
    protected processEvents(item: EventDispatcher<any>, config: any): void;
    /**
     * Processes JSON config for a [[DictionaryTemplate]] item.
     *
     * @todo Description
     * @param {DictionaryTemplate<any, any>}  item    Item
     * @param {any}                           config  Config
     */
    protected processDictionaryTemplate(item: DictionaryTemplate<any, any>, config: any): void;
    /**
     * This function is used to sort element's JSON config properties, so that
     * some properties that absolutely need to be processed last, can be put at
     * the end.
     *
     * @ignore Exclude from docs
     * @param  {string}  a  Element 1
     * @param  {string}  b  Element 2
     * @return {Ordering}   Sorting number
     */
    protected configOrder(a: string, b: string): Ordering;
    /**
     * Checks if field should be just assigned as is, without any checking when
     * processing JSON config.
     *
     * Extending functions can override this function to do their own checks.
     *
     * @param  {string}   field  Field name
     * @return {boolean}         Assign as is?
     */
    protected asIs(field: string): boolean;
    /**
     * Creates a relevant class instance if such class definition exists.
     *
     * @ignore Exclude from docs
     * @param  {string}  className  Class name
     * @return {Object}             Instance
     */
    protected createClassInstance(className: string): Object;
    /**
     * Creates a class instance for a config entry using it's type. (as set in
     * `type` property)
     *
     * @ignore Exclude from docs
     * @param  {any}  config  Config part
     * @return {any}          Instance
     */
    protected createEntryInstance(config: any): any;
    /**
     * Determines config object type.
     *
     * @ignore Exclude from docs
     * @param  {any}  config  Config part
     * @return {any}          Type
     */
    protected getConfigEntryType(config: any): any;
    /**
     * Checks if this element has a property.
     *
     * @ignore Exclude from docs
     * @param  {string}   prop  Property name
     * @return {boolean}        Has property?
     */
    protected hasProperty(prop: string): boolean;
}
/**
 * Defines events for [[BaseObjectEvents]].
 */
export interface IBaseObjectEvents {
}
/**
 * A version of [[BaseObject]] with events properties and methods.
 * Classes that use [[EventDispatcher]] should extend this instead of
 * [[BaseObject]] directly.
 */
export declare class BaseObjectEvents extends BaseObject {
    /**
     * Constructor
     */
    constructor();
    /**
     * An [[EventDispatcher]] instance
     */
    events: EventDispatcher<AMEvent<BaseObject, IBaseObjectEvents>>;
    /**
     * Dispatches an event using own event dispatcher. Will automatically
     * populate event data object with event type and target (this element).
     * It also checks if there are any handlers registered for this sepecific
     * event.
     *
     * @param {string} eventType Event type (name)
     * @param {any}    data      Data to pass into event handler(s)
     */
    dispatch(eventType: string, data?: any): void;
    /**
     * Works like `dispatch`, except event is triggered immediately, without
     * waiting for the next frame cycle.
     *
     * @param {string} eventType Event type (name)
     * @param {any}    data      Data to pass into event handler(s)
     */
    dispatchImmediately(eventType: string, data?: any): void;
}
