/**
 * Module that defines everything related to building StockPanels.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Percent } from "../../core/utils/Percent";
import { Label } from "../../core/elements/Label";
import { List, IListEvents } from "../../core/utils/List";
import { CloseButton } from "../../core/elements/CloseButton";
import { MinimizeButton } from "../../core/elements/MinimizeButton";
import { Axis } from "../../charts/axes/Axis";
import { AxisRendererY } from "../../charts/axes/AxisRendererY";
import { StockChart } from "./StockChart";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[StockPanel]].
 */
export interface IStockPanelProperties extends IContainerProperties {
    closeEnabled?: boolean;
    minimizeEnabled?: boolean;
    minimized?: boolean;
}
/**
 * Defines events for [[StockPanel]].
 */
export interface IStockPanelEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[StockPanel]].
 *
 * @see {@link Adapter}
 */
export interface IStockPanelAdapters extends IContainerAdapters, IStockPanelProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates StockPanels.
 *
 * @see {@link IStockPanelEvents} for a list of available events
 * @see {@link IStockPanelAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export declare class StockPanel extends Container {
    /**
     * Defines available properties.
     */
    _properties: IStockPanelProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IStockPanelAdapters;
    /**
     * Defines available events.
     */
    _events: IStockPanelEvents;
    headerContainer: Container;
    legendItemsContainer: Container;
    leftAxesContainer: Container;
    rightAxesContainer: Container;
    yAxesAndPlotContainer: Container;
    plotContainer: Container;
    seriesContainer: Container;
    bulletsContainer: Container;
    chart: StockChart;
    protected _title: Label;
    closeButton: CloseButton;
    minimizeButton: MinimizeButton;
    /**
     * Defines the type of vertical axis renderer.
     */
    _yAxisRendererType: AxisRendererY;
    /**
     * A list of vertical axes.
     */
    protected _yAxes: List<Axis<this["_yAxisRendererType"]>>;
    protected _realHeight: number | Percent;
    /**
     * Constructor
     */
    constructor();
    /**
     * A list of vertical (Y) axes.
     *
     * @return List of axes
     */
    readonly yAxes: List<Axis<this["_yAxisRendererType"]>>;
    handleYAxisAdded(event: IListEvents<Axis>["inserted"]): void;
    handleYAxisRemoved(event: IListEvents<Axis>["removed"]): void;
    title: Label;
    closeEnabled: boolean;
    minimized: boolean;
    minimizeEnabled: boolean;
}
