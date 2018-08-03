/**
 * Serial chart module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Chart, IChartProperties, IChartDataFields, IChartAdapters, IChartEvents, ChartDataItem } from "../Chart";
import { IListEvents, ListTemplate } from "../../core/utils/List";
import { Container } from "../../core/Container";
import { Series } from "../series/Series";
import { ColorSet } from "../../core/utils/ColorSet";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[SerialChart]].
 *
 * @see {@link DataItem}
 */
export declare class SerialChartDataItem extends ChartDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {SerialChart}
     */
    _component: SerialChart;
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
 * Defines data fields for [[SerialChart]].
 */
export interface ISerialChartDataFields extends IChartDataFields {
}
/**
 * Defines properties for [[SerialChart]]
 */
export interface ISerialChartProperties extends IChartProperties {
    /**
     * A set of colors to be used for chart elements, like Series, Slices, etc.
     *
     * @type {ColorSet}
     */
    colors?: ColorSet;
}
/**
 * Defines events for [[SerialChart]].
 */
export interface ISerialChartEvents extends IChartEvents {
}
/**
 * Defines adapters for [[SerialChart]].
 *
 * @see {@link Adapter}
 */
export interface ISerialChartAdapters extends IChartAdapters, ISerialChartProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for all series-based charts, like XY, Pie, etc.
 *
 * Is not useful on its own.
 *
 * @see {@link ISerialChartEvents} for a list of available Events
 * @see {@link ISerialChartAdapters} for a list of available Adapters
 */
export declare class SerialChart extends Chart {
    /**
     * Defines data fields.
     *
     * @ignore Exclude from docs
     * @type {ISerialChartDataFields}
     */
    _dataFields: ISerialChartDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ISerialChartProperties}
     */
    _properties: ISerialChartProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ISerialChartAdapters}
     */
    _adapter: ISerialChartAdapters;
    /**
     * Defines available events.
     *
     * @type {ISerialChartEvents}
     * @ignore Exclude from docs
     */
    _events: ISerialChartEvents;
    /**
     * Defines a type of series that this chart uses.
     *
     * @ignore Exclude from docs
     * @type {Series}
     */
    _seriesType: Series;
    /**
     * Holds a list of [[Series]] displayed on the chart.
     */
    protected _series: ListTemplate<this["_seriesType"]>;
    /**
     * Holds the reference to the container actual series are drawn in.
     *
     * @type {Container}
     */
    readonly seriesContainer: Container;
    /**
     * Holds a reference to the container series' bullets are drawn in.
     *
     * @type {Container}
     */
    readonly bulletsContainer: Container;
    /**
     * Constructor
     */
    constructor();
    dispose(): void;
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor
     */
    protected applyInternalDefaults(): void;
    /**
     * A list of chart's series.
     *
     * @return {List} Chart's series
     */
    readonly series: ListTemplate<this["_seriesType"]>;
    /**
     * Decorates a new [[Series]] object with required parameters when it is
     * added to the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Series>["inserted"]}  event  Event
     */
    handleSeriesAdded(event: IListEvents<Series>["inserted"]): void;
    /**
     * Setups the legend to use the chart's data.
     */
    protected feedLegend(): void;
    /**
     * Creates and returns a new Series, suitable for this chart type.
     *
     * @return {this} New series
     */
    protected createSeries(): this["_seriesType"];
    /**
     * @return {ColorSet} Color list
     */
    /**
     * Chart's color list.
     *
     * This list can be used by a number of serial items, like applying a new
     * color for each Series added. Or, applying a new color for each slice
     * of a Pie chart.
     *
     * Please see [[ColorSet]] for information on how you can set up to generate
     * unique colors.
     *
     * A theme you are using may override default pre-defined colors.
     *
     * @param {ColorSet} value Color list
     */
    colors: ColorSet;
    /**
     * Copies all parameters from another [[SerialChart]].
     *
     * @param {SerialChart} source Source SerialChart
     */
    copyFrom(source: this): void;
}
