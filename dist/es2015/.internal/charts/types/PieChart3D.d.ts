/**
 * 3D Pie chart module.
 */
/**
 * ============================================================================
 * Imports
 * ============================================================================
 * @hidden
 */
import { PieChart, IPieChartProperties, IPieChartDataFields, IPieChartAdapters, IPieChartEvents, PieChartDataItem } from "./PieChart";
import { PieSeries3D } from "../series/PieSeries3D";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[PieChart3D]].
 *
 * @see {@link DataItem}
 */
export declare class PieChart3DDataItem extends PieChartDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {PieChart3D}
     */
    _component: PieChart3D;
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
 * Defines data fields for [[PieChart3D]].
 */
export interface IPieChart3DDataFields extends IPieChartDataFields {
}
/**
 * Defines properties for [[PieChart3D]].
 */
export interface IPieChart3DProperties extends IPieChartProperties {
    /**
     * Pie's "depth" or "height" in pixels.
     *
     * @type {number}
     */
    depth?: number;
    /**
     * Pie's angle at which we are looking at it. (degrees)
     *
     * @type {number}
     */
    angle?: number;
}
/**
 * Defines events for [[PieChart3D]].
 */
export interface IPieChart3DEvents extends IPieChartEvents {
}
/**
 * Defines adapters for [[PieChart3D]].
 *
 * @see {@link Adapter}
 */
export interface IPieChart3DAdapters extends IPieChartAdapters, IPieChart3DProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a 3D Pie chart.
 *
 *  * ```TypeScript
 * // Includes
 * import * as am4core from "@amcharts/amcharts4/core";
 * import * as am4charts from "@amcharts/amcharts4/charts";
 *
 * // Create chart
 * let chart = am4core.create("chartdiv", am4charts.Pie3DChart);
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
 * let series = chart.series.push(new am4charts.Pie3DSeries());
 * series.dataFields.value = "litres";
 * series.dataFields.category = "country";
 * ```
 * ```JavaScript
 * // Create chart
 * var chart = am4core.create("chartdiv", am4charts.Pie3DChart);
 *
 * // The following would work as well:
 * // var chart = am4core.create("chartdiv", "Pie3DChart");
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
 * var series = chart.series.push(new am4charts.Pie3DSeries());
 * series.dataFields.value = "litres";
 * series.dataFields.category = "country";
 * ```
 * ```JSON
 * var chart = am4core.createFromConfig({
 *
 * 	// Series
 * 	"series": [{
 * 		"type": "Pie3DSeries",
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
 * }, "chartdiv", "Pie3DChart");
 * ```
 *
 * @see {@link IPieChart3DEvents} for a list of available Events
 * @see {@link IPieChart3DAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/pie-chart/} for documentation
 * @important
 */
export declare class PieChart3D extends PieChart {
    /**
     * Available data fields.
     *
     * @ignore Exclude from docs
     * @type {IPieChart3DDataFields}
     */
    _dataFields: IPieChart3DDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IPieChart3DProperties}
     */
    _properties: IPieChart3DProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IPieChart3DAdapters}
     */
    _adapter: IPieChart3DAdapters;
    /**
     * Defines available events.
     *
     * @type {IPieChart3DEvents}
     * @ignore Exclude from docs
     */
    _events: IPieChart3DEvents;
    /**
     * Defines a type of series that this chart uses.
     *
     * @ignore Exclude from docs
     * @type {PieSeries3D}
     */
    _seriesType: PieSeries3D;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Depth (px)
     */
    /**
     * Depth of the 3D pie in pixels.
     *
     * This will determine "height" of the pie.
     *
     * @default 20
     * @param {number}  value  Depth (px)
     */
    depth: number;
    /**
     * @return {number} Angle (degrees)
     */
    /**
     * An angle of a "point of view" in degrees.
     *
     * @default 10
     * @param {number}  value  Angle (degrees)
     */
    angle: number;
    /**
     * Creates and returns a new Series.
     *
     * @return {PieSeries3D} New series
     */
    protected createSeries(): this["_seriesType"];
}
