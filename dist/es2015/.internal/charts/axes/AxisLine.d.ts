/**
 *
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AxisLine]].
 */
export interface IAxisLineProperties extends ISpriteProperties {
}
/**
 * Defines events for [[AxisLine]].
 */
export interface IAxisLineEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[AxisLine]].
 *
 * @see {@link Adapter}
 */
export interface IAxisLineAdapters extends ISpriteAdapters, IAxisLineProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw Axis line.
 *
 * @see {@link IAxisLineEvents} for a list of available events
 * @see {@link IAxisLineAdapters} for a list of available Adapters
 */
export declare class AxisLine extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IAxisLineProperties}
     */
    _properties: IAxisLineProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IAxisLineAdapters}
     */
    _adapter: IAxisLineAdapters;
    /**
     * Event dispatcher.
     *
     * @type {SpriteEventDispatcher<AMEvent<AxisLine, IAxisLineEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<AxisLine, IAxisLineEvents>>;
    /**
     * Constructor
     */
    constructor();
}
