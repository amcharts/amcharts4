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
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { PieSeries3D } from "../series/PieSeries3D";
import { registry } from "../../core/Registry";


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
export class PieChart3DDataItem extends PieChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 *
	 * @type {PieChart3D}
	 */
	public _component!: PieChart3D;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PieChart3DDataItem";
		this.applyTheme();
	}

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
export interface IPieChart3DDataFields extends IPieChartDataFields { }

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
export interface IPieChart3DEvents extends IPieChartEvents { }

/**
 * Defines adapters for [[PieChart3D]].
 *
 * @see {@link Adapter}
 */
export interface IPieChart3DAdapters extends IPieChartAdapters, IPieChart3DProperties { }


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
export class PieChart3D extends PieChart {

	/**
	 * Available data fields.
	 *
	 * @type {IPieChart3DDataFields}
	 */
	public _dataFields: IPieChart3DDataFields;

	/**
	 * Defines available properties.
	 *
	 * @type {IPieChart3DProperties}
	 */
	public _properties!: IPieChart3DProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IPieChart3DAdapters}
	 */
	public _adapter!: IPieChart3DAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IPieChart3DEvents}
	 */
	public _events!: IPieChart3DEvents;

	/**
	 * Defines a type of series that this chart uses.
	 *
	 * @type {PieSeries3D}
	 */
	public _seriesType: PieSeries3D;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "PieChart3D";

		this.depth = 20;
		this.angle = 10;

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Depth of the 3D pie in pixels.
	 *
	 * This will determine "height" of the pie.
	 *
	 * @default 20
	 * @param {number}  value  Depth (px)
	 */
	public set depth(value: number) {
		if (this.setPropertyValue("depth", value)) {			
			this.invalidateDataUsers();
		}
	}

	/**
	 * @return {number} Depth (px)
	 */
	public get depth(): number {
		return this.getPropertyValue("depth");
	}

	/**
	 * An angle of a "point of view" in degrees.
	 *
	 * @default 10
	 * @param {number}  value  Angle (degrees)
	 */
	public set angle(value: number) {
		if (this.setPropertyValue("angle", value)) {
			this.invalidateDataUsers();
		}
	}

	/**
	 * @return {number} Angle (degrees)
	 */
	public get angle(): number {
		return this.getPropertyValue("angle");
	}

	/**
	 * Creates and returns a new Series.
	 *
	 * @return {PieSeries3D} New series
	 */
	protected createSeries(): this["_seriesType"] {
		return new PieSeries3D();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PieChart3D"] = PieChart3D;
