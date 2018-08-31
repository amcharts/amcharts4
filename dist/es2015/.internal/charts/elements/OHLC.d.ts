/**
 * Module that defines everything related to building OHLCs.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Candlestick, ICandlestickProperties, ICandlestickAdapters, ICandlestickEvents } from "./Candlestick";
import { Line } from "../../core/elements/Line";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[OHLC]].
 */
export interface IOHLCProperties extends ICandlestickProperties {
}
/**
 * Defines events for [[OHLC]].
 */
export interface IOHLCEvents extends ICandlestickEvents {
}
/**
 * Defines adapters for [[OHLC]].
 *
 * @see {@link Adapter}
 */
export interface IOHLCAdapters extends ICandlestickAdapters, IOHLCProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates OHLCs.
 *
 * @see {@link IOHLCEvents} for a list of available events
 * @see {@link IOHLCAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export declare class OHLC extends Candlestick {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IOHLCProperties}
     */
    _properties: IOHLCProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IOHLCAdapters}
     */
    _adapter: IOHLCAdapters;
    /**
     * Defines available events.
     *
     * @type {IOHLCEvents}
     * @ignore Exclude from docs
     */
    _events: IOHLCEvents;
    /**
     * Open line element
     * @type {Line}
     */
    openLine: Line;
    /**
     * Close line element
     * @type {Line}
     */
    closeLine: Line;
    /**
     * High-low line element
     * @type {Line}
     */
    highLowLine: Line;
    /**
     * Constructor
     */
    constructor();
    createAssets(): void;
    copyFrom(source: this): void;
}
