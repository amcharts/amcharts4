/**
 * Pie chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PercentChart, IPercentChartProperties, IPercentChartDataFields, IPercentChartAdapters, IPercentChartEvents, PercentChartDataItem } from "./PercentChart";
import { percent, Percent } from "../../core/utils/Percent";
import { PieSeries } from "../series/PieSeries";
import { IListEvents } from "../../core/utils/List";
import { IRectangle } from "../../core/defs/IRectangle";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $utils from "../../core/utils/Utils";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";

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
export class PieChartDataItem extends PercentChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: PieChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PieChartDataItem";
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
 * Defines data fields for [[PieChart]].
 */
export interface IPieChartDataFields extends IPercentChartDataFields { }

/**
 * Defines properties for [[PieChart]]
 */
export interface IPieChartProperties extends IPercentChartProperties {

	/**
	 * Outer radius of the pie.
	 */
	radius?: number | Percent;

	/**
	 * Relative inner radius (0-1).
	 */
	innerRadius?: number;

	/**
	 * An angle pie starts on. (degrees)
	 *
	 * @default -90
	 */
	startAngle?: number;

	/**
	 * An angle pie ends on. (degrees)
	 *
	 * @default 270
	 */
	endAngle?: number;

}

/**
 * Defines events for [[PieChart]].
 */
export interface IPieChartEvents extends IPercentChartEvents { }

/**
 * Defines adapters for [[PieChart]].
 *
 * @see {@link Adapter}
 */
export interface IPieChartAdapters extends IPercentChartAdapters, IPieChartProperties { }


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
 * 	"country": "Czechia",
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
 * 	"country": "Czechia",
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
 * 		"country": "Czechia",
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
export class PieChart extends PercentChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IPieChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IPieChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPieChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPieChartEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: PieSeries;

	protected _chartPixelRadius:number;

	protected _chartPixelInnerRadius:number;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "PieChart";

		// Set defaults
		this.innerRadius = 0;
		this.radius = percent(80);
		this.align = "none";
		this.valign = "none";

		this.startAngle = -90;
		this.endAngle = 270;

		let seriesContainer = this.seriesContainer;
		seriesContainer.isMeasured = true;
		seriesContainer.valign = "middle";
		seriesContainer.align = "center";
		seriesContainer.layout = "absolute";
		seriesContainer.width = undefined;
		seriesContainer.height = undefined;

		// so that the pie is always drawn, even the legend wants all the space
		this.chartContainer.minHeight = 50;
		this.chartContainer.minWidth = 50;

		this.chartContainer.events.on("maxsizechanged", this.updateRadius, this, false); // need this for the chart to change radius if legend is removed/disabled

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {

		super.applyInternalDefaults();

		// Add a default screen reader title for accessibility
		// This will be overridden in screen reader if there are any `titles` set
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Pie chart");
		}
	}

	/**
	 * (Re)validates the chart, causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validateLayout(): void {
		super.validateLayout();
		this.updateRadius();
	}

	/**
	 * Decorates a new [[Series]] object with required parameters when it is
	 * added to the chart.
	 *
	 * @ignore Exclude from docs
	 * @param event  Event
	 */
	public handleSeriesAdded(event: IListEvents<PieSeries>["inserted"]): void {
		super.handleSeriesAdded(event);
		this._chartPixelRadius = undefined;
		this.updateSeriesAngles();
	}

	protected updateSeriesAngles(){
		this.series.each((series)=>{
			series._startAngleInternal = this.startAngle;
			series._endAngleInternal = this.endAngle;
			//series.defaultState.properties.startAngle = this.startAngle;
			//series.defaultState.properties.endAngle = this.endAngle;
		})
	}

	/**
	 * Recalculates pie's radius, based on a number of criteria.
	 *
	 * @ignore Exclude from docs
	 */
	public updateRadius(): void {

		let chartCont = this.chartContainer;

		let rect = $math.getArcRect(this.startAngle, this.endAngle, 1);
		let innerRect: IRectangle = { x: 0, y: 0, width: 0, height: 0 };

		let innerRadius = this.innerRadius;

		if (innerRadius instanceof Percent) {
			innerRect = $math.getArcRect(this.startAngle, this.endAngle, innerRadius.value);
		}
		// @todo handle this when innerRadius set in pixels (do it for radar also)

		rect = $math.getCommonRectangle([rect, innerRect]);

		let maxRadius = Math.min(chartCont.innerWidth / rect.width, chartCont.innerHeight / rect.height);

		if(!$type.isNumber(maxRadius)){
			maxRadius = 0;
		}

		let chartRadius = $utils.relativeRadiusToValue(this.radius, maxRadius);

		let chartPixelInnerRadius = $utils.relativeRadiusToValue(this.innerRadius, maxRadius);

		let seriesRadius = (chartRadius - chartPixelInnerRadius) / this.series.length;

		if(chartRadius != this._chartPixelRadius || chartPixelInnerRadius != this._chartPixelInnerRadius){
			this._chartPixelRadius = chartRadius;
			this._chartPixelInnerRadius = chartPixelInnerRadius;

			//@todo: make it possible to set series radius in percent
			$iter.each($iter.indexed(this.series.iterator()), (a) => {
				let i = a[0];
				let series = a[1];

				let radius = chartPixelInnerRadius + $utils.relativeRadiusToValue(series.radius, chartRadius - chartPixelInnerRadius);
				let innerRadius = chartPixelInnerRadius + $utils.relativeRadiusToValue(series.innerRadius, chartRadius - chartPixelInnerRadius);

				if(!$type.isNumber(radius)){
					radius = chartPixelInnerRadius + seriesRadius * (i + 1);
				}
				if(!$type.isNumber(innerRadius)){
					innerRadius = chartPixelInnerRadius + seriesRadius * i;
				}

				series.pixelRadius = radius;
				series.pixelInnerRadius = innerRadius;
			});


			this.seriesContainer.definedBBox = { x: chartRadius * rect.x, y: chartRadius * rect.y, width: chartRadius * rect.width, height: chartRadius * rect.height };
			this.seriesContainer.invalidateLayout();

			this.bulletsContainer.x = this.seriesContainer.x;
			this.bulletsContainer.y = this.seriesContainer.y;
		}
	}

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
	 * @default 80%
	 * @param value  Radius (px or relative)
	 */
	public set radius(value: number | Percent) {
		if(this.setPercentProperty("radius", value, true, false, 10, false)){
			this.invalidateLayout();
		}
	}

	/**
	 * @return Radius (px or relative)
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * Sets relative inner radius (to create a donut chart).
	 *
	 * Setting to a number will mean a fixed pixel radius.
	 *
	 * Setting to an instance of [[Percent]] will mean a relative radius to
	 * available space.
	 *
	 * NOTE: it's not related to `radius`.
	 *
	 * E.g.:
	 *
	 * ```TypeScript
	 * // Set pie chart to be at 50% of the available space
	 * pieChart.innerRadius = am4core.percent.percent(50);
	 * ```
	 * ```JavaScript
	 * // Set pie chart to be at 50% of the available space
	 * pieChart.innerRadius = am4core.percent.percent(50);
	 * ```
	 * ```JSON
	 * {
	 *   // Set pie chart to be at 50% of the available space
	 *   "innerRadius": "50%"
	 * }
	 * ```
	 *
	 * @default 0
	 * @param value  Relative inner radius (0-1)
	 * @todo Setting things like `innerRadius` modifies `slice.radius` and it then looks like it is not the same value as in default state
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, true, false, 10, false);
	}

	/**
	 * @return Relative inner radius (0-1)
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Creates a new [[PieSeries]].
	 *
	 * @return New series
	 */
	protected createSeries(): this["_seriesType"] {
		return new PieSeries();
	}

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
	 * NOTE: This setting is not supported in a 3D pie chart.
	 *
	 * @default -90
	 * @param value  Start angle (degrees)
	 */
	public set startAngle(value: number) {
		if(this.setPropertyValue("startAngle", value)){
			this.updateRadius();
			this.updateSeriesAngles()
		}
	}

	/**
	 * @return Start angle (degrees)
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

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
	 * NOTE: This setting is not supported in a 3D pie chart.
	 *
	 * @default 270
	 * @param value  End angle (degrees)
	 */
	public set endAngle(value: number) {
		if(this.setPropertyValue("endAngle", value)){
			this.updateRadius();
			this.updateSeriesAngles()
		}
	}

	/**
	 * @return End angle (degrees)
	 */
	public get endAngle(): number {
		return this.getPropertyValue("endAngle");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PieChart"] = PieChart;
registry.registeredClasses["PieChartDataItem"] = PieChartDataItem;
