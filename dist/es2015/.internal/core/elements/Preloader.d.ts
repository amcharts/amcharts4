/**
 * Preloader module.
 *
 * Preloader is a progress indicator.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../Container";
import { Slice } from "./Slice";
import { Label } from "./Label";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Preloader]].
 */
export interface IPreloaderProperties extends IContainerProperties {
    /**
     * Current preload progress. (0-1)
     *
     * * 0 - 0%
     * * 0.5 - 50%
     * * 1 - 100%
     *
     * @type {number}
     */
    progress?: number;
    /**
     * Delay display of preloader by X milliseconds.
     *
     * When loading starts (`progress` is set to <1) and finishes (`progress` is
     * set to 1) before `delay` ms, the loader is never shown.
     *
     * This is used to avoid brief flashing of the preload for very quick loads.
     *
     * @default 1000
     * @type {number}
     */
    delay?: number;
}
/**
 * Defines events for [[Preloader]].
 */
export interface IPreloaderEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[Preloader]].
 *
 * @see {@link Adapter}
 */
export interface IPreloaderAdapters extends IContainerAdapters, IPreloaderProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A class used to draw and display progress indicator.
 *
 * @see {@link IPreloaderEvents} for a list of available events
 * @see {@link IPreloaderAdapters} for a list of available Adapters
 */
export declare class Preloader extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IPreloaderProperties}
     */
    _properties: IPreloaderProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IPreloaderAdapters}
     */
    _adapter: IPreloaderAdapters;
    /**
     * Defines available events.
     *
     * @type {IPreloaderEvents}
     * @ignore Exclude from docs
     */
    _events: IPreloaderEvents;
    /**
     * A [[Slice]] element that indicates load progress.
     *
     * This can be used to modify appearance of the preloader elements.
     *
     * @type {Slice}
     */
    progressSlice: Slice;
    /**
     * A [[Slice]] element that shows the full ring. (background for the
     * `progressSlice`)
     *
     * This can be used to modify appearance of the preloader elements.
     *
     * @type {Slice}
     */
    backgroundSlice: Slice;
    /**
     * Label that displays progress in percent.
     *
     * This can be used to modify appearance of the preloader elements.
     *
     * @type {Label}
     */
    label: Label;
    /**
     * Logs the timestamp of when the loader was initiated. It will be used to
     * delay showing of the Preloader so for quick operations it does not even
     * appear on screen.
     *
     * @type {Optional<number>}
     */
    protected _started: $type.Optional<number>;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Progress (0-1)
     */
    /**
     * Current preload progress. (0-1)
     *
     * * 0 - 0%
     * * 0.5 - 50%
     * * 1 - 100%
     *
     * Setting this to a value less than 1, will automatically reveal the
     * preloader, while setting it to 1 (100%) will hide it.
     *
     * @param {number} value Progress (0-1)
     */
    progress: number;
    /**
     * @return {number} Delay (ms)
     */
    /**
     * Delay display of preloader by X milliseconds.
     *
     * When loading starts (`progress` is set to <1) and finishes (`progress` is
     * set to 1) before `delay` ms, the loader is never shown.
     *
     * This is used to avoid brief flashing of the preload for very quick loads.
     *
     * @default 1000
     * @param {number}  value  Delay (ms)
     */
    delay: number;
}
