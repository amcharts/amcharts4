/**
 * ConeSeries module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries3D, IColumnSeries3DDataFields, IColumnSeries3DProperties, IColumnSeries3DAdapters, IColumnSeries3DEvents, ColumnSeries3DDataItem } from "./ColumnSeries3D";
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
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
export declare class ConeSeriesDataItem extends ColumnSeries3DDataItem {
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
export interface IConeSeriesDataFields extends IColumnSeries3DDataFields {
}
/**
 * Defines properties for [[ConeSeries]].
 */
export interface IConeSeriesProperties extends IColumnSeries3DProperties {
}
/**
 * Defines events for [[ConeSeries]].
 */
export interface IConeSeriesEvents extends IColumnSeries3DEvents {
}
/**
 * Defines adapters for [[ConeSeries]].
 *
 * @see {@link Adapter}
 */
export interface IConeSeriesAdapters extends IColumnSeries3DAdapters, IConeSeriesProperties {
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
export declare class ConeSeries extends ColumnSeries3D {
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
     * Event dispacther.
     *
     * @type {SpriteEventDispatcher<AMEvent<ConeSeries, IConeSeriesEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<ConeSeries, IConeSeriesEvents>>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new element to use as a template for the series.
     *
     * @return {Sprite} Element
     */
    protected getColumnTemplate(): Sprite;
}
