/**
 * Functionality for drawing waved lines.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Line, ILineProperties, ILineAdapters, ILineEvents } from "./Line";
import { IWavedShape } from "../defs/IWavedShape";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines available properties for [[WavedLine]].
 */
export interface IWavedLineProperties extends ILineProperties {
    /**
     * Wave length in pixels.
     *
     * @default 16
     * @type {number}
     */
    waveLength?: number;
    /**
     * Wave height in pixels.
     *
     * @default 4
     * @type {number}
     */
    waveHeight?: number;
    /**
     * Wave tension.
     *
     * @default 0.8
     * @type {number}
     */
    tension?: number;
}
/**
 * Defines events for [[WavedLine]].
 */
export interface IWavedLineEvents extends ILineEvents {
}
/**
 * Defines adapters for [[WavedLine]].
 *
 * @see {@link Adapter}
 */
export interface IWavedLineAdapters extends ILineAdapters, IWavedLineProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a waved line.
 *
 * @see {@link IWavedLineEvents} for a list of available events
 * @see {@link IWavedLineAdapters} for a list of available Adapters
 */
export declare class WavedLine extends Line implements IWavedShape {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IWavedLineProperties}
     */
    _properties: IWavedLineProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IWavedLineAdapters}
     */
    _adapter: IWavedLineAdapters;
    /**
     * Defines available events.
     *
     * @type {IWavedLineEvents}
     * @ignore Exclude from docs
     */
    _events: IWavedLineEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the waved line.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * @return {number} Wave length (px)
     */
    /**
     * Wave length in pixels.
     *
     * @default 16
     * @param {number}  value  Wave length (px)
     */
    waveLength: number;
    /**
     * @return {number} Wave height (px)
     */
    /**
     * Wave height in pixels.
     *
     * @default 4
     * @param {number}  value  Wave height (px)
     */
    waveHeight: number;
    /**
     * @return {number} Tension
     */
    /**
     * Tension of the wave.
     *
     * @default 0.8
     * @param {number}  value  Tension
     */
    tension: number;
}
