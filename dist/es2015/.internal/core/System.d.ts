/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents, IBaseObjectEvents } from "./Base";
import { EventDispatcher, AMEvent } from "./utils/EventDispatcher";
import { Sprite } from "./Sprite";
import { Container } from "./Container";
import { SVGContainer } from "./rendering/SVGContainer";
import { Component } from "./Component";
import { Paper } from "./rendering/Paper";
import { ITheme } from "../themes/ITheme";
import { TextFormatter } from "./formatters/TextFormatter";
import * as $type from "./utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Define events available for [[System]]
 */
export interface ISystemEvents extends IBaseObjectEvents {
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
export declare class System extends BaseObjectEvents {
    /**
     * Event dispacther.
     *
     * @type {EventDispatcher}
     */
    events: EventDispatcher<AMEvent<System, ISystemEvents>>;
    /**
     * A [[Paper]] instance to create elements, that are not yet ready to be
     * placed in visible DOM.
     *
     * @ignore Exclude from docs
     * @type {Paper}
     */
    ghostPaper: Paper;
    /**
     * All currently applied themes. All new chart instances created will
     * automatically inherit and retain System's themes.
     *
     * @type {ITheme}
     */
    themes: ITheme[];
    /**
     * List of all loaded available themes.
     *
     * Whenever a theme loads, it registers itself in System's `loadedThemes`
     * collection.
     */
    loadedThemes: {
        [index: string]: ITheme;
    };
    /**
     * An indeternal counter used to generate unique IDs.
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _uidCount: number;
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
     * A list of invalid(ated) [[Sprite]] objects that need to be re-validated
     * during next cycle.
     *
     * @ignore Exclude from docs
     * @type {Array<Sprite>}
     */
    invalidSprites: Array<Sprite>;
    /**
     * Components are added to this list when their data provider changes to
     * a new one or data is added/removed from their data provider.
     *
     * @ignore Exclude from docs
     * @type {Array<Component>}
     */
    invalidDatas: Array<Component>;
    /**
     * Components are added to this list when values of their raw data change.
     * Used when we want a smooth animation from one set of values to another.
     *
     * @ignore Exclude from docs
     * @type {Array<Component>}
     */
    invalidRawDatas: Array<Component>;
    /**
     * Components are added to this list when values of their data changes
     * (but not data provider itself).
     *
     * @ignore Exclude from docs
     * @type {Array<Component>}
     */
    invalidDataItems: Array<Component>;
    /**
     * Components are added to this list when their data range (selection) is
     * changed, e.g. zoomed.
     *
     * @ignore Exclude from docs
     * @type {Array<Component>}
     */
    invalidDataRange: Array<Component>;
    /**
     * A list of [[Sprite]] objects that have invalid(ated) positions, that need
     * to be recalculated.
     *
     * @ignore Exclude from docs
     * @type {Array<Sprite>}
     */
    invalidPositions: Array<Sprite>;
    /**
     * A list of [[Container]] objects with invalid(ated) layouts.
     *
     * @ignore Exclude from docs
     * @type {Array<Container>}
     */
    invalidLayouts: Array<Container>;
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
     */
    frameRate: number;
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
     * Keeps register of class references so that they can be instnatiated using
     * string key.
     *
     * @ignore Exclude from docs
     */
    registeredClasses: {
        [index: string]: any;
    };
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
     * Creates all HTML and SVG containers needed for the chart instance, as well
     * as the new [[Sprite]] (as specified in `classType` parameter).
     *
     * @param  {Optional<HTMLElement | string>}  htmlElement  A container to creat elements in
     * @param  {T}                               classType    A class definition of the new element to create
     * @return {T}                                            Newly-created Sprite object
     */
    createChild<T extends Sprite>(htmlElement: $type.Optional<HTMLElement | string>, classType: {
        new (): T;
    }): T;
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
     * Sets style property on DOM element.
     *
     * @ignore Exclude from docs
     * @todo Still needed?
     */
    setStyle(element: HTMLElement | SVGSVGElement, property: string, value: string): void;
    /**
     * Outputs string to console if `verbose` is `true`.
     *
     * @param {any} value Message to output to console
     */
    log(value: any): void;
}
/**
 * A singleton global instance of [[System]].
 *
 * All code should access this system variable, rather than instantiate their
 * own.
 */
export declare let system: System;
