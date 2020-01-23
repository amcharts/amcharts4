/**
 * HeatLegend module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerEvents, IContainerAdapters } from "../../core/Container";
import { Series } from "../series/Series";
import { Color } from "../../core/utils/Color";
import { ListTemplate } from "../../core/utils/List";
import { ValueAxis } from "../../charts/axes/ValueAxis";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[HeatLegend]].
 */
export interface IHeatLegendProperties extends IContainerProperties {
    /**
     * Minimum color
     *
     * @todo Description
     */
    minColor?: Color;
    /**
     * Minimum value
     *
     * @todo Description
     */
    minValue?: number;
    /**
     * Maximum value
     *
     * @todo Description
     */
    maxValue?: number;
    /**
     * Maximum color
     *
     * @todo Description
     */
    maxColor?: Color;
    /**
     * Number of markers (steps)
     *
     * @todo Description
     */
    markerCount?: number;
    /**
     * Orientation
     *
     * @todo Description
     */
    orientation?: "horizontal" | "vertical";
}
/**
 * Defines events for [[HeatLegend]].
 */
export interface IHeatLegendEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[HeatLegend]].
 *
 * @see {@link Adapter}
 */
export interface IHeatLegendAdapters extends IContainerAdapters, IHeatLegendProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Sankey Diagram.
 *
 * @see {@link IHeatLegendEvents} for a list of available events
 * @see {@link IHeatLegendAdapters} for a list of available Adapters
 * @important
 */
export declare class HeatLegend extends Container {
    /**
     * Defines available properties.
     */
    _properties: IHeatLegendProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IHeatLegendAdapters;
    /**
     * Defines available events.
     */
    _events: IHeatLegendEvents;
    /**
     * List of heat legend markers (color step rectangles).
     */
    markers: ListTemplate<RoundedRectangle>;
    /**
     * Container which holds markers
     */
    markerContainer: Container;
    /**
     * Value axis of a heat legend
     * @ignore
     */
    protected _valueAxis: ValueAxis;
    /**
     * Series of a heat legend
     * @ignore
     */
    protected _series: Series;
    /**
     * Constructor
     */
    constructor();
    protected getMinFromRules(property: string): undefined;
    protected getMaxFromRules(property: string): undefined;
    /**
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Min color of a heat legend. If a series is set for the legend, minColor is taken from series.
     *
     * @param {Color}
     */
    set minColor(value: Color);
    /**
     * Returns minColor value
     * @return {Color}
     */
    get minColor(): Color;
    /**
     * Max color of a heat legend. If a series is set for the legend, maxColor is taken from series.
     *
     * @param {Color}
     */
    set maxColor(value: Color);
    /**
     * Returns maxColor value
     * @return {Color}
     */
    get maxColor(): Color;
    /**
     * Number of color squares (markers) in the heat legend. If only 1 marker is used, it will be filled with gradient.
     *
     * @param {number}
     */
    set markerCount(value: number);
    /**
     * Returns number of color squares (markers).
     * @return {number}
     */
    get markerCount(): number;
    /**
     * Minimum value of heat legend's value axis. If a series is set for the legend, min is taken from series.
     *
     * @param {number}
     */
    set minValue(value: number);
    /**
     * Returns minimum value of heat legend.
     * @return {number}
     */
    get minValue(): number;
    /**
     * Maximum value of heat legend's value axis. If a series is set for the legend, max is taken from series.
     *
     * @param {number}
     */
    set maxValue(value: number);
    /**
     * Returns maximum value of heat legend.
     * @return {number}
     */
    get maxValue(): number;
    /**
    * Heat legend orientation. Note, if you change orientation of a heat legend, you must set value axis renderer properties after that, as with orientation renderer changes.
    *
    * @param {"horizontal" | "vertical"}
    */
    set orientation(value: "horizontal" | "vertical");
    /**
     * Returns orientation value.
     *
     * @return {"horizontal" | "vertical"}
     */
    get orientation(): "horizontal" | "vertical";
    /**
     * Sets a value axis of heat legend. Value axis for heat legend is created automatically.
     * @param {ValueAxis}
     */
    set valueAxis(valueAxis: ValueAxis);
    /**
     * Returns valueAxis value.
     * @return {ValueAxis}
     */
    get valueAxis(): ValueAxis;
    /**
     * You can set series for heat legend. It will take min, max, minColor and maxColor values from this series.
     * @param series
     */
    set series(series: Series);
    /**
     * Returns series value.
     * @return {Series}
     */
    get series(): Series;
    /**
     * Updates min/max of value axis.
     * @ignore
     */
    protected updateMinMax(min: number, max: number): void;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
}
