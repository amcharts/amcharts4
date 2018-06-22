/**
 * Event Dispatcher module is used for registering listeners and dispatching
 * events across amCharts system.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IDisposer } from "./Disposer";
/**
 * Defines a universal type for the event object.
 */
export declare type AMEvent<Target, T> = {
    [K in keyof T]: {
        type: K;
        target: Target;
    } & T[K];
};
/**
 * A universal interface for event listeners.
 */
export interface EventListener<T> {
    killed: boolean;
    once: boolean;
    type: keyof T | null;
    callback: any;
    context: any;
    dispatch: (type: keyof T, event: T[keyof T]) => void;
    disposer: IDisposer;
}
/**
 * Universal Event Dispatcher.
 *
 * @important
 */
export declare class EventDispatcher<T> implements IDisposer {
    protected _listeners: Array<EventListener<T>>;
    protected _killed: Array<EventListener<T>>;
    protected _disabled: {
        [key: string]: number;
    };
    protected _iterating: number;
    protected _enabled: boolean;
    protected _disposed: boolean;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns if this object has been already disposed.
     *
     * @return {boolean} Disposed?
     */
    isDisposed(): boolean;
    /**
     * Dispose (destroy) this object.
     */
    dispose(): void;
    /**
     * Checks if this particular event dispatcher has any listeners set.
     *
     * @return {boolean} Has listeners?
     */
    hasListeners(): boolean;
    /**
     * Enable dispatching of events if they were previously disabled by
     * `disable()`.
     */
    enable(): void;
    /**
     * Disable dispatching of events until re-enabled by `enable()`.
     */
    disable(): void;
    /**
     * Enable dispatching particular event, if it was disabled before by
     * `disableType()`.
     *
     * @param {Key} type Event type
     */
    enableType<Key extends keyof T>(type: Key): void;
    /**
     * Disable dispatching of events for a certain event type.
     *
     * Optionally, can set how many dispatches to skip before automatically
     * re-enabling the dispatching.
     *
     * @param {Key}                type    Event type
     * @param {number = Infinity}  amount  Number of event dispatches to skip
     */
    disableType<Key extends keyof T>(type: Key, amount?: number): void;
    /**
     * Removes listener from dispatcher.
     *
     * Will throw an exception if such listener does not exists.
     *
     * @param {EventListener<T>} listener Listener to remove
     */
    protected _removeListener(listener: EventListener<T>): void;
    /**
     * Removes existing listener by certain parameters.
     *
     * @param {boolean}     once      Listener's once setting
     * @param {Key | null}  type      Listener's type
     * @param {A}           callback  Callback function
     * @param {B}           context   Callback context
     */
    protected _removeExistingListener<A, B, Key extends keyof T>(once: boolean, type: Key | null, callback: A, context: B): void;
    /**
     * Checks if dispatching for particular event type is enabled.
     *
     * @param  {Key}      type  Event type
     * @return {boolean}        Enabled?
     */
    isEnabled<Key extends keyof T>(type: Key): boolean;
    /**
     * Checks if there's already a listener with specific parameters.
     *
     * @param   {Key | null}  type      Listener's type
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     * @return {boolean}                Has listener?
     */
    has<C, Key extends keyof T>(type: Key, callback?: (this: C, event: T[Key]) => void, context?: C): boolean;
    /**
     * Checks whether event of the particular type should be dispatched.
     *
     * @param  {Key}   type  Event type
     * @return {boolean}        Dispatch?
     */
    protected _shouldDispatch<Key extends keyof T>(type: Key): boolean;
    /**
     * [_eachListener description]
     *
     * All of this extra code is needed when a listener is removed while iterating
     *
     * @todo Description
     * @param {EventListener<T>) => void} fn [description]
     */
    protected _eachListener(fn: (listener: EventListener<T>) => void): void;
    /**
     * Dispatches an event immediately without waiting for next cycle.
     *
     * @param {Key}     type   Event type
     * @param {T[Key]}  event  Event object
     * @todo automatically add in type and target properties if they are missing
     */
    dispatchImmediately<Key extends keyof T>(type: Key, event: T[Key]): void;
    /**
     * Shelves the event to be dispatched within next update cycle.
     *
     * @param {Key}     type   Event type
     * @param {T[Key]}  event  Event object
     * @todo automatically add in type and target properties if they are missing
     */
    dispatch<Key extends keyof T>(type: Key, event: T[Key]): void;
    /**
     * Creates, catalogs and returns an [[EventListener]].
     *
     * Event listener can be disposed.
     *
     * @param   {boolean}     once      Listener's once setting
     * @param   {Key | null}  type      Listener's type
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     * @param   {function}    dispatch
     * @returns {EventListener} An event listener
     */
    protected _on<A, B, Key extends keyof T>(once: boolean, type: Key | null, callback: A, context: B, dispatch: (type: Key, event: T[Key]) => void): EventListener<T>;
    /**
     * Creates an event listener to be invoked on **any** event.
     *
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     * @returns {IDisposer}             A disposable event listener
     * @todo what if `listen` is called on the same function twice ?
     */
    onAll<C, Key extends keyof T>(callback: (this: C, type: Key, event: T[Key]) => void, context?: C): IDisposer;
    /**
     * Creates an event listener to be invoked on a specific event type.
     *
     * ```TypeScript
     * series.events.on("hidden", (ev) => {
     *   console.log("Series hidden: " + ev.target.name);
     * }, this);
     * ```
     * ```JavaScript
     * series.events.on("hidden", function(ev) {
     *   console.log("Series hidden: " + ev.target.name);
     * }, this);
     * ```
     * ```JSON
     * {
     *   // ...
     *   "series": [{
     *     // ...
     *     "events": {
     *     	"hidden": function(ev) {
     *     	  console.log("Series hidden: " + ev.target.name);
     *     	}
     *     }
     *   }]
     * }
     * ```
     *
     * The above will invoke our custom event handler whenever series we put
     * event on is hidden.
     *
     * @param   {Key | null}  type      Listener's type
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     * @returns {IDisposer}             A disposable event listener
     * @todo what if `listen` is called on the same function twice ?
     */
    on<C, Key extends keyof T>(type: Key, callback: (this: C, event: T[Key]) => void, context?: C): IDisposer;
    /**
     * Creates an event listener to be invoked on a specific event type once.
     *
     * Once the event listener is invoked, it is automatically disposed.
     *
     * ```TypeScript
     * series.events.on("hidden", (ev) => {
     *   console.log("Series hidden: " + ev.target.name);
     * }, this);
     * ```
     * ```JavaScript
     * series.events.on("hidden", function(ev) {
     *   console.log("Series hidden: " + ev.target.name);
     * }, this);
     * ```
     * ```JSON
     * {
     *   // ...
     *   "series": [{
     *     // ...
     *     "events": {
     *     	"hidden": function(ev) {
     *     	  console.log("Series hidden: " + ev.target.name);
     *     	}
     *     }
     *   }]
     * }
     * ```
     *
     * The above will invoke our custom event handler the first time series we
     * put event on is hidden.
     *
     * @param   {Key | null}  type      Listener's type
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     * @returns {IDisposer}             A disposable event listener
     * @todo what if `listen` is called on the same function twice ?
     */
    once<C, Key extends keyof T>(type: Key, callback: (this: C, event: T[Key]) => void, context?: C): IDisposer;
    /**
     * Removes the event listener with specific parameters.
     *
     * @param   {Key | null}  type      Listener's type
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     */
    off<C, Key extends keyof T>(type: Key, callback: (this: C, event: T[Key]) => void, context?: C): void;
    /**
     * Copies all dispatcher parameters, including listeners, from another event
     * dispatcher.
     *
     * @param {this} source Source event dispatcher
     */
    copyFrom(source: this): void;
}
/**
 * A version of the [[EventDispatcher]] that dispatches events for a specific
 * target object.
 *
 * @type {[type]}
 * @important
 */
export declare class TargetedEventDispatcher<Target, T> extends EventDispatcher<T> {
    /**
     * A target object which is originating events using this dispatcher.
     *
     * @type {Target}
     */
    target: Target;
    /**
     * Constructor
     *
     * @param {Target} target Event dispatcher target
     */
    constructor(target: Target);
    /**
     * Copies all dispatcher parameters, including listeners, from another event
     * dispatcher.
     *
     * @param {this} source Source event dispatcher
     */
    copyFrom(source: this): void;
}
