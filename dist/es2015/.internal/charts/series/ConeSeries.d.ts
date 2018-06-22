/**
 * ConeSeries module
 * Not recommended using if you use scrollbars or your chart is zoomable in some other way.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, IColumnSeriesDataFields, IColumnSeriesProperties, IColumnSeriesAdapters, IColumnSeriesEvents, ColumnSeriesDataItem } from "./ColumnSeries";
import { ConeColumn } from "../elements/ConeColumn";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ConeSeries]].
 *
 * @see {@link DataItem}
 */
export declare class ConeSeriesDataItem extends ColumnSeriesDataItem {
    /**
     * A sprite used to draw the column.
     * @ignore
     * @type {ConeColumn}
     */
    _column: ConeColumn;
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {ConeSeries}
     */
    _component: ConeSeries;
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
 * Defines data fields for [[ConeSeries]].
 */
export interface IConeSeriesDataFields extends IColumnSeriesDataFields {
}
/**
 * Defines properties for [[ConeSeries]].
 */
export interface IConeSeriesProperties extends IColumnSeriesProperties {
}
/**
 * Defines events for [[ConeSeries]].
 */
export interface IConeSeriesEvents extends IColumnSeriesEvents {
}
/**
 * Defines adapters for [[ConeSeries]].
 *
 * @see {@link Adapter}
 */
export interface IConeSeriesAdapters extends IColumnSeriesAdapters, IConeSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a cone graph.
 *
 * @see {@link IConeSeriesEvents} for a list of available Events
 * @see {@link IConeSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export declare class ConeSeries extends ColumnSeries {
    _column: ConeColumn;
    /**
     * @ignore
     */
    _dataItem: ConeSeriesDataItem;
    /**
     * Defines the type of data fields used for the series.
     *
     * @ignore Exclude from docs
     * @type {IConeSeriesDataFields}
     */
    _dataFields: IConeSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IConeSeriesProperties}
     */
    _properties: IConeSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IConeSeriesAdapters}
     */
    _adapter: IConeSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IConeSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IConeSeriesEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns an element to use for Candlestick
     * @ignore
     * @return {this["_column"]} Element.
     */
    protected createColumnTemplate(): this["_column"];
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Returns an SVG path to use as series mask.
     *
     * @return {string} SVG path
     */
    protected getMaskPath(): string;
    /**
     * Validates data item's elements.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    validateDataElementReal(dataItem: this["_dataItem"]): void;
}
