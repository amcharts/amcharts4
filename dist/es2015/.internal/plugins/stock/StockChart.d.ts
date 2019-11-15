/**
 * Module for building 3D serial charts.
 */
/**
 * ============================================================================
 * Imports
 * ============================================================================
 * @hidden
 */
import { XYChart, IXYChartProperties, IXYChartDataFields, IXYChartAdapters, IXYChartEvents, XYChartDataItem } from "../../charts/types/XYChart";
import { XYSeries } from "../../charts/series/XYSeries";
import { StockPanel } from "./StockPanel";
import { List, IListEvents } from "../../core/utils/List";
import { Axis } from "../../charts/axes/Axis";
import { AxisRenderer } from "../../charts/axes/AxisRenderer";
import { Legend } from "../../charts/Legend";
import { Container } from "../../core/Container";
import { Sprite } from "../../core/Sprite";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[StockChart]].
 *
 * @see {@link DataItem}
 */
export declare class StockChartDataItem extends XYChartDataItem {
    constructor();
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[StockChart]].
 */
export interface IStockChartDataFields extends IXYChartDataFields {
}
/**
 * Defines available properties for [[StockChart]].
 */
export interface IStockChartProperties extends IXYChartProperties {
}
/**
 * Defines events for [[StockChart]].
 */
export interface IStockChartEvents extends IXYChartEvents {
}
/**
 * Defines adapters for [[StockChart]].
 *
 * @see {@link Adapter}
 */
export interface IStockChartAdapters extends IXYChartAdapters, IStockChartProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a 3D XY chart.
 *
 * @see {@link IStockChartEvents} for a list of available Events
 * @see {@link IStockChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/} for documentation
 * @important
 */
export declare class StockChart extends XYChart {
    /**
     * Available data fields.
     */
    _dataFields: IStockChartDataFields;
    /**
     * Defines available properties.
     */
    _properties: IStockChartProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IStockChartAdapters;
    /**
     * Defines available events.
     */
    _events: IStockChartEvents;
    protected _panels: List<StockPanel>;
    panelsContainer: Container;
    protected _plotMask: Sprite;
    /**
     * Constructor
     */
    constructor();
    readonly panels: List<StockPanel>;
    protected updateMask(): void;
    handlePanelAdded(event: IListEvents<StockPanel>["inserted"]): void;
    handlePanelRemoved(event: IListEvents<StockPanel>["removed"]): void;
    /**
     * @ignore
     */
    handleYAxisSet(series: XYSeries): void;
    /**
     * Decorates an Axis for use with this chart, e.g. sets proper renderer
     * and containers for placement.
     *
     * @param axis  Axis
     */
    protected processAxis(axis: Axis): void;
    protected setAxisParent(axis: Axis): void;
    /**
     * Triggers (re)rendering of the vertical (Y) axis.
     *
     * @ignore Exclude from docs
     * @param axis  Axis
     */
    updateYAxis(renderer: AxisRenderer): void;
    getAxisPanel(axis: Axis): StockPanel;
    /**
     * Prepares the legend instance for use in this chart.
     *
     * @param legend  Legend
     */
    protected setLegend(legend: Legend): void;
    protected arrangeLegendItems(): void;
    /**
     * Updates margins for horizontal axes based on settings and available space.
     *
     * @ignore Exclude from docs
     */
    protected updateXAxesMargins(): void;
}
