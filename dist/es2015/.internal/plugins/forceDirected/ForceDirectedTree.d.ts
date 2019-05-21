/**
 * ForceDirectedTree chart module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, ISerialChartProperties, ISerialChartDataFields, ISerialChartAdapters, ISerialChartEvents, SerialChartDataItem } from "../../charts/types/SerialChart";
import { ForceDirectedSeries } from "./ForceDirectedSeries";
import { Export } from "../../core/export/Export";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 * @see {@link DataItem}
 */
export declare class ForceDirectedTreeDataItem extends SerialChartDataItem {
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedTreeDataFields extends ISerialChartDataFields {
}
/**
 * Defines properties for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedTreeProperties extends ISerialChartProperties {
}
/**
 * Defines events for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedTreeEvents extends ISerialChartEvents {
}
/**
 * Defines adapters for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 * @see {@link Adapter}
 */
export interface IForceDirectedTreeAdapters extends ISerialChartAdapters, IForceDirectedTreeProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A main class for [[ForceDirectedTree]] chart type.
 *
 * @see {@link IForceDirectedTreeEvents} for a list of available Events
 * @see {@link IForceDirectedTreeAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/force-directed/} For more information
 * @since 4.3.8
 * @important
 */
export declare class ForceDirectedTree extends SerialChart {
    /**
     * Defines the type of data item.
     */
    _dataItem: ForceDirectedTreeDataItem;
    /**
     * Defines available data fields.
     */
    _dataFields: IForceDirectedTreeDataFields;
    /**
     * Defines available properties.
     */
    _properties: IForceDirectedTreeProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IForceDirectedTreeAdapters;
    /**
     * Defines available events.
     */
    _events: IForceDirectedTreeEvents;
    /**
     * Defines a type of series that this chart uses.
     */
    _seriesType: ForceDirectedSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * Creates and returns a new series of the suitable type.
     *
     * @return New series
     */
    protected createSeries(): this["_seriesType"];
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Setups the legend to use the chart's data.
     *
     * @ignore
     */
    feedLegend(): void;
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
    /**
     * Since this chart uses hierarchical data, we need to remove childrent
     * dataField from export of non-hierarchical formats such as CSV and XSLX.
     *
     * @return Export
     */
    protected getExporting(): Export;
}
