/**
 * Sunburst chart module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PieChart, IPieChartProperties, IPieChartDataFields, IPieChartAdapters, IPieChartEvents, PieChartDataItem } from "./PieChart";
import { PieSeries } from "../series/PieSeries";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[Sunburst]].
 *
 * @see {@link DataItem}
 */
export declare class SunburstDataItem extends PieChartDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     */
    _component: Sunburst;
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
 * Defines data fields for [[Sunburst]].
 */
export interface ISunburstDataFields extends IPieChartDataFields {
}
/**
 * Defines properties for [[Sunburst]]
 */
export interface ISunburstProperties extends IPieChartProperties {
}
/**
 * Defines events for [[Sunburst]].
 */
export interface ISunburstEvents extends IPieChartEvents {
}
/**
 * Defines adapters for [[Sunburst]].
 *
 * @see {@link Adapter}
 */
export interface ISunburstAdapters extends IPieChartAdapters, ISunburstProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
export declare class Sunburst extends PieChart {
    /**
     * Defines available data fields.
     */
    _dataFields: ISunburstDataFields;
    /**
     * Defines available properties.
     */
    _properties: ISunburstProperties;
    /**
     * Defines available adapters.
     */
    _adapter: ISunburstAdapters;
    /**
     * Defines available events.
     */
    _events: ISunburstEvents;
    /**
     * Defines a type of series that this chart uses.
     */
    _seriesType: PieSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
}
