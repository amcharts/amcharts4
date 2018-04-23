import { EventDispatcher, AMEvent } from "./utils/EventDispatcher";
import { SVGContainer } from "./rendering/SVGContainer";
import { TextFormatter } from "./formatters/TextFormatter";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Define events available for [[System]]
 */
export interface ISystemEvents {
    /**
     * Invoked when update cycle starts. Before invalid elements are re-validated.
     */
    enterframe: {};
    /**
     * Invoked when udpate cycle ends. After invalid elements have been
     * re-validated.
     */
    exitframe: {};
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * The main class that handles system-wide tasks, like caching, heartbeats, etc.
 * @important
 */
export declare class System {
    /**
     * Unique ID of the object.
     *
     * @type {string}
     */
    uid: string;
    /**
     * Event dispacther.
     *
     * @type {EventDispatcher}
     */
    events: EventDispatcher<AMEvent<System, ISystemEvents>>;
    /**
     * amCharts Version.
     *
     * This follows npm's semver specification.
     *
     * @see {@link https://docs.npmjs.com/misc/semver}
     * @type {string}
     */
    static VERSION: string;
    /**
     * Console output enabled.
     *
     * @type {boolean}
     */
    verbose: boolean;
    /**
     * A array of all SVG Containers (one SVG container per chart instance).
     *
     * @ignore Exclude from docs
     * @type {Array<SVGContainer>}
     */
    svgContainers: Array<SVGContainer>;
    /**
     * Invalid sizes
     * @rodo Remove commented code
     */
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
     * @deprecated Moved to [[Registry]]
     */
    /**
     * Number of times per second component container is measured.
     *
     * It is not wise to measure container as often as `frameRate`, as this would
     * use a lot of CPU when resizing window.
     *
     * @type {number}
     */
    measureRate: number;
    /**
     * @todo Description
     * @ignore Exclude from docs
     * @private
     * @type {number}
     */
    measureCounter: number;
    /**
     * @todo Description
     * @ignore Exclude from docs
     * @private
     * @type {number}
     */
    measureAt: number;
    /**
     * amCharts will add `class` property to some elements. All those class names
     * will be prefixed by `classNamePrefix`.
     *
     * @type {string}
     */
    classNamePrefix: string;
    /**
     * Holds the global instancce to [[TextFormatter]].
     *
     * All classes and instances are to reuse this universal text formatter,
     * rather than create their own instance of it.
     *
     * @type {TextFormatter}
     */
    textFormatter: TextFormatter;
    /**
     * @todo Description
     * @todo Needed?
     * @ignore Exclude from docs
     * @type {number}
     */
    dummyCounter: number;
    /**
     * @todo Description
     * @ignore Exclude from docs
     * @type {number}
     */
    time: number;
    /**
     * @ignore
     */
    commercialLicense: boolean;
    /**
     * Constructor
     */
    constructor();
    /**
     * Performs initialization of the System object.
     *
     * Called when the first [[Sprite]] object is created.
     *
     * @ignore Exclude from docs
     */
    init(): void;
    /**
     * Reports time elapsed since timer was reset.
     *
     * @ignore Exclude from docs
     * @todo Needed?
     * @param {string}   msg    Message to report in console
     * @param {boolean}  reset  Reset time counter
     */
    reportTime(msg: string, reset?: boolean): void;
    /**
     * Performs "heartbeat" operations `frameRate` number of times per second.
     *
     * When the chart element is invalidated, it is not immediately redrawn.
     *
     * Instead it waits for the next `update()` cycle to be re-validated.
     *
     * @ignore Exclude from docs
     * @todo Maybe should be private?
     */
    update(): void;
    /**
     * Triggers position re-validation on all [[Sprite]] elements that have
     * invalid(ated) positions.
     *
     * @ignore Exclude from docs
     * @todo Maybe should be private?
     */
    validatePositions(): void;
    /**
     * Triggers position re-validation on all [[Container]] elements that have
     * invalid(ated) layouts.
     *
     * @ignore Exclude from docs
     * @todo Maybe should be private?
     */
    validateLayouts(): void;
    /**
     * (Re)measures all top-level SVG containers for size.
     *
     * @ignore Exclude from docs
     * @todo Maybe should be private?
     */
    measure(): void;
    /**
     * Outputs string to console if `verbose` is `true`.
     *
     * @param {any} value Message to output to console
     */
    log(value: any): void;
    /**
     * @return {number} Frame rate
     */
    /**
     * Get current theme
     * @return {ITheme} [description]
     */
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
     * @type {number} Frame rate
     */
    frameRate: number;
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
/**
 * A singleton global instance of [[System]].
 *
 * All code should access this system variable, rather than instantiate their
 * own.
 */
export declare let system: System;
