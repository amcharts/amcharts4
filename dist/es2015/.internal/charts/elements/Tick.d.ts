/**
 * Tick module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../../core/Sprite";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Tick]].
 */
export interface ITickProperties extends ISpriteProperties {
    /**
     * Length of the tick (px).
     *
     * @type {number}
     */
    length?: number;
}
/**
 * Defines events for [[Tick]].
 */
export interface ITickEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[Tick]].
 *
 * @see {@link Adapter}
 */
export interface ITickAdapters extends ISpriteAdapters, ITickProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A basic Tick class.
 *
 * A tick is a short dash, mainly connecting an object like axis or slice to
 * it's textual label.
 *
 * @see {@link ITickEvents} for a list of available events
 * @see {@link ITickAdapters} for a list of available Adapters
 * @important
 */
export declare class Tick extends Sprite {
    /**
     * Defines available properties.
     *
     * @type {ITickProperties}
     */
    _properties: ITickProperties;
    /**
     * Defines available adapters.
     *
     * @type {ITickAdapters}
     */
    _adapter: ITickAdapters;
    /**
     * Defines available events.
     *
     * @type {ITickEvents}
     */
    _events: ITickEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Length (px)
     */
    /**
     * Length of the tick in pixels.
     *
     * @param {number}  value  Length (px)
     */
    length: number;
}
