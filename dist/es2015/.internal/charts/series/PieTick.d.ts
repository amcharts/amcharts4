/**
 * Pie tick module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Tick, ITickProperties, ITickAdapters, ITickEvents } from "../elements/Tick";
import { AxisLabelCircular } from "../axes/AxisLabelCircular";
import { Slice } from "../../core/elements/Slice";
import { MutableValueDisposer } from "../../core/utils/Disposer";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[PieTick]].
 */
export interface IPieTickProperties extends ITickProperties {
}
/**
 * Defines events for [[PieTick]].
 */
export interface IPieTickEvents extends ITickEvents {
}
/**
 * Defines adapters for [[PieTick]].
 *
 * @see {@link Adapter}
 */
export interface IPieTickAdapters extends ITickAdapters, IPieTickProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws an tick line for a pie slice connecting it to a related label.
 *
 * @see {@link IPieTickEvents} for a list of available events
 * @see {@link IPieTickAdapters} for a list of available Adapters
 */
export declare class PieTick extends Tick {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IPieTickProperties}
     */
    _properties: IPieTickProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IPieTickAdapters}
     */
    _adapter: IPieTickAdapters;
    /**
     * Defines available events.
     *
     * @type {IPieTickEvents}
     * @ignore Exclude from docs
     */
    _events: IPieTickEvents;
    /**
     * A label element this tick is attached to.
     *
     * @type {MutableValueDisposer}
     */
    protected _label: MutableValueDisposer<AxisLabelCircular>;
    /**
     * A slice element this tick is attached to.
     *
     * @type {MutableValueDisposer}
     */
    protected _slice: MutableValueDisposer<Slice>;
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
     * @return {Slice} Slice
     */
    /**
     * Slice element tick is attached to.
     *
     * @param {Slice}  slice  Slice
     */
    slice: Slice;
    /**
     * @return {AxisLabelCircular} Label
     */
    /**
     * Label element tick is attached to.
     *
     * @param {AxisLabelCircular}  label  Label
     */
    label: AxisLabelCircular;
}
