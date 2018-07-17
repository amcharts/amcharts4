/**
 * Pie chart module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, ISerialChartProperties, ISerialChartDataFields, ISerialChartAdapters, ISerialChartEvents, SerialChartDataItem } from "./SerialChart";
import { Percent } from "../../core/utils/Percent";
import { PieSeries } from "../series/PieSeries";
import { Legend } from "../Legend";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[PieChart]].
 *
 * @see {@link DataItem}
 */
export declare class PieChartDataItem extends SerialChartDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {PieChart}
     */
    _component: PieChart;
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
 * Defines data fields for [[PieChart]].
 */
export interface IPieChartDataFields extends ISerialChartDataFields {
}
/**
 * Defines properties for [[PieChart]]
 */
export interface IPieChartProperties extends ISerialChartProperties {
    /**
     * Outer radius of the pie.
     *
     * @type {number | Percent}
     */
    radius?: number | Percent;
    /**
     * Relative inner radius (0-1).
     *
     * @type {number}
     */
    innerRadius?: number;
    /**
     * An angle pie starts on. (degrees)
     *
     * @default -90
     * @type {number}
     */
    startAngle?: number;
    /**
     * An angle pie ends on. (degrees)
     *
     * @default 270
     * @type {number}
     */
    endAngle?: number;
}
/**
 * Defines events for [[PieChart]].
 */
export interface IPieChartEvents extends ISerialChartEvents {
}
/**
 * Defines adapters for [[PieChart]].
 *
 * @see {@link Adapter}
 */
export interface IPieChartAdapters extends ISerialChartAdapters, IPieChartProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Pie chart.
 *
 * ```TypeScript
 * // Includes
 * import * as am4core from "@amcharts/amcharts4/core";
 * import * as am4charts from "@amcharts/amcharts4/charts";
 *
 * // Create chart
 * let chart = am4core.create("chartdiv", am4charts.PieChart);
 *
 * // Set data
 * chart.data = [{
 * 	"country": "Lithuania",
 * 	"litres": 501.9
 * }, {
 * 	"country": "Czech Republic",
 * 	"litres": 301.9
 * }, {
 * 	"country": "Ireland",
 * 	"litres": 201.1
 * }];
 *
 * // Create series
 * let series = chart.series.push(new am4charts.PieSeries());
 * series.dataFields.value = "litres";
 * series.dataFields.category = "country";
 * ```
 * ```JavaScript
 * // Create chart
 * var chart = am4core.create("chartdiv", am4charts.PieChart);
 *
 * // The following would work as well:
 * // var chart = am4core.create("chartdiv", "PieChart");
 *
 * // Set data
 * chart.data = [{
 * 	"country": "Lithuania",
 * 	"litres": 501.9
 * }, {
 * 	"country": "Czech Republic",
 * 	"litres": 301.9
 * }, {
 * 	"country": "Ireland",
 * 	"litres": 201.1
 * }];
 *
 * // Create series
 * var series = chart.series.push(new am4charts.PieSeries());
 * series.dataFields.value = "litres";
 * series.dataFields.category = "country";
 * ```
 * ```JSON
 * var chart = am4core.createFromConfig({
 *
 * 	// Series
 * 	"series": [{
 * 		"type": "PieSeries",
 * 		"dataFields": {
 * 			"value": "litres",
 * 			"category": "country"
 * 		}
 * 	}],
 *
 * 	// Data
 * 	"data": [{
 * 		"country": "Lithuania",
 * 		"litres": 501.9
 * 	}, {
 * 		"country": "Czech Republic",
 * 		"litres": 301.9
 * 	}, {
 * 		"country": "Ireland",
 * 		"litres": 201.1
 * 	}]
 *
 * }, "chartdiv", "PieChart");
 * ```
 *
 * @see {@link IPieChartEvents} for a list of available Events
 * @see {@link IPieChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/pie-chart/} for documentation
 * @important
 */
export declare class PieChart extends SerialChart {
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IPieChartDataFields}
     */
    _dataFields: IPieChartDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IPieChartProperties}
     */
    _properties: IPieChartProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {SeriesAdapters}
     */
    _adapter: IPieChartAdapters;
    /**
     * Defines available events.
     *
     * @type {IPieChartEvents}
     * @ignore Exclude from docs
     */
    _events: IPieChartEvents;
    /**
     * Defines a type of series that this chart uses.
     *
     * @ignore Exclude from docs
     * @type {PieSeries}
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
    /**
     * (Re)validates the chart, causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * (Re)validates chart data.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    /**
     * Recalculates pie's radius, based on a number of criteria.
     *
     * @ignore Exclude from docs
     */
    updateRadius(): void;
    /**
     * Setups the legend to use the chart's data.
     */
    protected feedLegend(): void;
    /**
     * @return {number} Radius (px or relative)
     */
    /**
     * Sets radius of the pie chart.
     *
     * Setting to a number will mean a fixed pixel radius.
     *
     * Setting to an instance of [[Percent]] will mean a relative radius to
     * available space.
     *
     * E.g.:
     *
     * ```TypeScript
     * // Set pie chart to be at 50% of the available space
     * pieChart.radius = am4core.percent.percent(50);
     * ```
     * ```JavaScript
     * // Set pie chart to be at 50% of the available space
     * pieChart.radius = am4core.percent.percent(50);
     * ```
     * ```JSON
     * {
     *   // Set pie chart to be at 50% of the available space
     *   "radius": "50%"
     * }
     * ```
     *
     * @param {number | Percent}  value  Radius (px or relative)
     */
    radius: number | Percent;
    /**
     * @return {number} Relative inner radius (0-1)
     */
    /**
     * Sets relative inner radius (to create a donut chart).
     *
     * The inner radius is relative to pie's radius:
     * * 0 - solid pie (no hole inside);
     * * 0.5 - hole is half the radius of the pie;
     * * 1 - does not make sense, because the hole will take up the whole radius.
     *
     * @param {number | Percent}  value  Relative inner radius (0-1)
     * @todo Setting things like `innerRadius` modifies `slice.radius` and it then looks like it is not the same value as in default state
     */
    innerRadius: number | Percent;
    /**
     * Creates a new [[PieSeries]].
     *
     * @return {PieSeries} New series
     */
    protected createSeries(): this["_seriesType"];
    /**
     * @return {number} Start angle (degrees)
     */
    /**
     * Starting angle of the Pie circle. (degrees)
     *
     * Normally, a pie chart begins (the left side of the first slice is drawn)
     * at the top center. (at -90 degrees)
     *
     * You can use `startAngle` to change this setting.
     *
     * E.g. setting this to 0 will make the first slice be drawn to the right.
     *
     * For a perfect circle the absolute sum of `startAngle` and `endAngle`
     * needs to be 360.
     *
     * However, it's **not** necessary to do so. You can set to those lesser
     * numbers, to create semi-circles.
     *
     * E.g. `startAngle = -90` with `endAngle = 0` will create a Pie chart that
     * looks like a quarter of a circle.
     *
     * @default -90
     * @param {number}  value  Start angle (degrees)
     */
    startAngle: number;
    /**
     * @return {number} End angle (degrees)
     */
    /**
     * End angle of the Pie circle. (degrees)
     *
     * Normally, a pie chart ends (the right side of the last slice is drawn)
     * at the top center. (at 270 degrees)
     *
     * You can use `endAngle` to change this setting.
     *
     * For a perfect circle the absolute sum of `startAngle` and `endAngle`
     * needs to be 360.
     *
     * However, it's **not** necessary to do so. You can set to those lesser
     * numbers, to create semi-circles.
     *
     * E.g. `startAngle = -90` with `endAngle = 0` will create a Pie chart that
     * looks like a quarter of a circle.
     *
     * @default 270
     * @param {number}  value  End angle (degrees)
     */
    endAngle: number;
    /**
     * @ignore
     */
    protected setLegend(legend: Legend): void;
}
