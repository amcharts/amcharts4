/**
 * Module that defines everything related to building Candlesticks.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Column, IColumnProperties, IColumnAdapters, IColumnEvents } from "./Column";
import { Line } from "../../core/elements/Line";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Candlestick]].
 */
export interface ICandlestickProperties extends IColumnProperties {
}
/**
 * Defines events for [[Candlestick]].
 */
export interface ICandlestickEvents extends IColumnEvents {
}
/**
 * Defines adapters for [[Candlestick]].
 *
 * @see {@link Adapter}
 */
export interface ICandlestickAdapters extends IColumnAdapters, ICandlestickProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates Candlesticks.
 *
 * @see {@link ICandlestickEvents} for a list of available events
 * @see {@link ICandlestickAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export declare class Candlestick extends Column {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ICandlestickProperties}
     */
    _properties: ICandlestickProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ICandlestickAdapters}
     */
    _adapter: ICandlestickAdapters;
    /**
     * Defines available events.
     *
     * @type {ICandlestickEvents}
     * @ignore Exclude from docs
     */
    _events: ICandlestickEvents;
    /**
     * Low line element
     * @type {Line}
     */
    lowLine: Line;
    /**
     * High line element
     * @type {Line}
     */
    highLine: Line;
    /**
     * Constructor
     */
    constructor();
    createAssets(): void;
    copyFrom(source: this): void;
}
