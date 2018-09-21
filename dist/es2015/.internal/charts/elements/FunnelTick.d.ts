/**
 * Funnel tick module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Tick, ITickProperties, ITickAdapters, ITickEvents } from "../elements/Tick";
import { Label } from "../../core/elements/Label";
import { FunnelSlice } from "./FunnelSlice";
import { MutableValueDisposer } from "../../core/utils/Disposer";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[FunnelTick]].
 */
export interface IFunnelTickProperties extends ITickProperties {
}
/**
 * Defines events for [[FunnelTick]].
 */
export interface IFunnelTickEvents extends ITickEvents {
}
/**
 * Defines adapters for [[FunnelTick]].
 *
 * @see {@link Adapter}
 */
export interface IFunnelTickAdapters extends ITickAdapters, IFunnelTickProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws an tick line for a funnel slice connecting it to a related label.
 *
 * @see {@link IFunnelTickEvents} for a list of available events
 * @see {@link IFunnelTickAdapters} for a list of available Adapters
 */
export declare class FunnelTick extends Tick {
    /**
     * Defines available properties.
     *
     * @type {IFunnelTickProperties}
     */
    _properties: IFunnelTickProperties;
    /**
     * Defines available adapters.
     *
     * @type {IFunnelTickAdapters}
     */
    _adapter: IFunnelTickAdapters;
    /**
     * Defines available events.
     *
     * @type {IFunnelTickEvents}
     */
    _events: IFunnelTickEvents;
    /**
     * A label element this tick is attached to.
     *
     * @type {MutableValueDisposer}
     */
    protected _label: MutableValueDisposer<Label>;
    /**
     * A slice element this tick is attached to.
     *
     * @type {MutableValueDisposer}
     */
    protected _slice: MutableValueDisposer<FunnelSlice>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the tick element.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * @return {FunnelSlice} FunnelSlice
     */
    /**
     * [[FunnelSlice]] element tick is attached to.
     *
     * @param {FunnelSlice}  slice  Slice
     */
    slice: FunnelSlice;
    /**
     * @return {AxisLabelCircular} Label
     */
    /**
     * [[Label]] element tick is attached to.
     *
     * @param {Label}  label  Label
     */
    label: Label;
}
