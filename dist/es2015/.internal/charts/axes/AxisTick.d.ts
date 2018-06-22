/**
 * Axis Tick module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Tick, ITickProperties, ITickAdapters, ITickEvents } from "../elements/Tick";
import { AxisItemLocation, AxisDataItem } from "./Axis";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AxisTick]].
 */
export interface IAxisTickProperties extends ITickProperties {
    location?: number;
    inside?: boolean;
}
/**
 * Defines events for [[AxisTick]].
 */
export interface IAxisTickEvents extends ITickEvents {
}
/**
 * Defines adapter for [[AxisTick]].
 *
 * @see {@link Adapter}
 */
export interface IAxisTickAdapters extends ITickAdapters, IAxisTickProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws an axis tick
 * @see {@link IAxisTickEvents} for a list of available events
 * @see {@link IAxisTickAdapters} for a list of available Adapters
 */
export declare class AxisTick extends Tick {
    /**
     * Defines available properties
     * @type {AxisTicPkroperties}
     * @ignore
     */
    _properties: IAxisTickProperties;
    /**
     * Defines available adapters
     * @type {IAxisTickAdapters}
     * @ignore
     */
    _adapter: IAxisTickAdapters;
    /**
     * Defines available events.
     *
     * @type {IAxisTickEvents}
     * @ignore Exclude from docs
     */
    _events: IAxisTickEvents;
    _dataItem: AxisDataItem;
    constructor();
    location: AxisItemLocation;
    inside: boolean;
}
