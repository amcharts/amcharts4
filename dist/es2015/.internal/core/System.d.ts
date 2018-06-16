import { Paper } from "./rendering/Paper";
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
     * amCharts Version.
     *
     * This follows npm's semver specification.
     *
     * @see {@link https://docs.npmjs.com/misc/semver}
     * @type {string}
     */
    static VERSION: string;
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
     * A [[Paper]] instance to create elements, that are not yet ready to be
     * placed in visible DOM.
     *
     * @ignore Exclude from docs
     * @type {Paper}
     */
    ghostPaper: Paper;
    /**
     * Performs initialization of the System object.
     *
     * Called when the first [[Sprite]] object is created.
     *
     * @ignore Exclude from docs
     */
    constructor();
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
}
/**
 * Returns a singleton global instance of [[System]].
 *
 * All code should call this function, rather than instantiating their
 * own System objects.
 */
export declare function getSystem(): System;
