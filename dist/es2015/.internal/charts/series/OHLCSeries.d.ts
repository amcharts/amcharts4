/**
 * Candlestick Series module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { CandlestickSeries, CandlestickSeriesDataItem, ICandlestickSeriesDataFields, ICandlestickSeriesProperties, ICandlestickSeriesAdapters, ICandlestickSeriesEvents } from "./CandlestickSeries";
import { Container } from "../../core/Container";
import { OHLC } from "../elements/OHLC";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[OHLCSeries]].
 *
 * @see {@link DataItem}
 */
export declare class OHLCSeriesDataItem extends CandlestickSeriesDataItem {
    /**
     * A sprite used to draw the OHLC elements.
     * @ignore
     * @type {OHLC}
     */
    _column: OHLC;
    /**
     * Defines a type of [[Component]] this data item is used for
     * @type {OHLCSeries}
     * @todo Disabled to work around TS bug (see if we can re-enable it again)
     */
    /**
     * Constructor
     */
    constructor();
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[OHLCSeries]].
 */
export interface IOHLCSeriesDataFields extends ICandlestickSeriesDataFields {
}
/**
 * Defines properties for [[OHLCSeries]].
 */
export interface IOHLCSeriesProperties extends ICandlestickSeriesProperties {
}
/**
 * Defines events for [[OHLCSeries]].
 */
export interface IOHLCSeriesEvents extends ICandlestickSeriesEvents {
}
/**
 * Defines adapters for [[OHLCSeries]].
 *
 * @see {@link Adapter}
 */
export interface IOHLCSeriesAdapters extends ICandlestickSeriesAdapters, IOHLCSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a candlestick graph.
 *
 * @see {@link IOHLCSeriesEvents} for a list of available Events
 * @see {@link IOHLCSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export declare class OHLCSeries extends CandlestickSeries {
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {OHLCSeriesDataItem}
     */
    _dataItem: OHLCSeriesDataItem;
    /**
     * @ignore
     */
    _column: OHLC;
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IOHLCSeriesDataFields}
     */
    _dataFields: IOHLCSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IOHLCSeriesProperties}
     */
    _properties: IOHLCSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IOHLCSeriesAdapters}
     */
    _adapter: IOHLCSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IOHLCSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IOHLCSeriesEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {OHLCSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    protected validateCandlestick(dataItem: this["_dataItem"]): void;
    /**
     * Creates elements in related legend container, that mimics the look of this
     * Series.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Legend item container
     */
    createLegendMarker(marker: Container): void;
    /**
     * Returns an element to use for Candlestick
     * @ignore
     * @return {this["_column"]} Element.
     */
    protected createColumnTemplate(): this["_column"];
}
