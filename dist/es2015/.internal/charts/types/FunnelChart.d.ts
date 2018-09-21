/**
 * Funnel chart module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PercentChart, IPercentChartProperties, IPercentChartDataFields, IPercentChartAdapters, IPercentChartEvents, PercentChartDataItem } from "./PercentChart";
import { FunnelSeries } from "../series/FunnelSeries";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[FunnelChart]].
 *
 * @see {@link DataItem}
 */
export declare class FunnelChartDataItem extends PercentChartDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {FunnelChart}
     */
    _component: FunnelChart;
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
 * Defines data fields for [[FunnelChart]].
 */
export interface IFunnelChartDataFields extends IPercentChartDataFields {
}
/**
 * Defines properties for [[FunnelChart]]
 */
export interface IFunnelChartProperties extends IPercentChartProperties {
}
/**
 * Defines events for [[FunnelChart]].
 */
export interface IFunnelChartEvents extends IPercentChartEvents {
}
/**
 * Defines adapters for [[FunnelChart]].
 *
 * @see {@link Adapter}
 */
export interface IFunnelChartAdapters extends IPercentChartAdapters, IFunnelChartProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Funnel chart.
 *
 * @see {@link IFunnelChartEvents} for a list of available Events
 * @see {@link IFunnelChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/funnel-chart/} for documentation
 * @important
 */
export declare class FunnelChart extends PercentChart {
    /**
     * Defines available data fields.
     *
     * @type {IFunnelChartDataFields}
     */
    _dataFields: IFunnelChartDataFields;
    /**
     * Defines available properties.
     *
     * @type {IFunnelChartProperties}
     */
    _properties: IFunnelChartProperties;
    /**
     * Defines available adapters.
     *
     * @type {SeriesAdapters}
     */
    _adapter: IFunnelChartAdapters;
    /**
     * Defines available events.
     *
     * @type {IFunnelChartEvents}
     */
    _events: IFunnelChartEvents;
    /**
     * Defines a type of series that this chart uses.
     *
     * @type {FunnelSeries}
     */
    _seriesType: FunnelSeries;
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
     * (Re)validates the chart, causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
}
