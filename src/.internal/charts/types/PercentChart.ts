/**
 * Percent chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, ISerialChartProperties, ISerialChartDataFields, ISerialChartAdapters, ISerialChartEvents, SerialChartDataItem } from "./SerialChart";
import { PercentSeries, PercentSeriesDataItem } from "../series/PercentSeries";
import { Legend } from "../Legend";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[PercentChart]].
 *
 * @see {@link DataItem}
 */
export class PercentChartDataItem extends SerialChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: PercentChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PercentChartDataItem";
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
 * Defines data fields for [[PercentChart]].
 */
export interface IPercentChartDataFields extends ISerialChartDataFields { }

/**
 * Defines properties for [[PercentChart]]
 */
export interface IPercentChartProperties extends ISerialChartProperties { }

/**
 * Defines events for [[PercentChart]].
 */
export interface IPercentChartEvents extends ISerialChartEvents { }

/**
 * Defines adapters for [[PercentChart]].
 *
 * @see {@link Adapter}
 */
export interface IPercentChartAdapters extends ISerialChartAdapters, IPercentChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This is a base class for "percent-based" chart types like Pie and Funnel.
 *
 * @see {@link IPercentChartEvents} for a list of available Events
 * @see {@link IPercentChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/pie-chart/} for Pie chart documentation
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/sliced-chart/} for Sliced chart documentation
 */
export class PercentChart extends SerialChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IPercentChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IPercentChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPercentChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPercentChartEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: PercentSeries;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "PercentChart";

		this.align = "none";
		this.valign = "none";

		// so that the chart is always drawn, even the legend wants all the space
		this.chartContainer.minHeight = 50;
		this.chartContainer.minWidth = 50;

		// Apply theme
		this.applyTheme();
	}

	/**
	 * (Re)validates chart data.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {
		super.validateData();
		this.feedLegend();
	}
	/**
	 * Setups the legend to use the chart's data.
	 * @ignore
	 */
	public feedLegend(): void {
		let legend = this.legend;
		if (legend) {

			let legendData: any[] = [];

			$iter.each(this.series.iterator(), (series) => {
				if (!series.hiddenInLegend) {
					$iter.each(series.dataItems.iterator(), (dataItem) => {
						if (!dataItem.hiddenInLegend) {
							legendData.push(<PercentSeriesDataItem>dataItem);
							if(!dataItem.legendSettings){
								dataItem.legendSettings = series.legendSettings;
							}
						}
					});
				}
			});

			legend.data = legendData;
			legend.dataFields.name = "category";
		}
	}

	/**
	 * Creates a new [[PercentSeries]].
	 *
	 * @return New series
	 */
	protected createSeries(): this["_seriesType"] {
		return new PercentSeries();
	}


	/**
	 * @ignore
	 */
	protected setLegend(legend: Legend) {
		super.setLegend(legend);
		if (legend) {
			legend.labels.template.text = "{category}";
			legend.valueLabels.template.text = "{value.percent.formatNumber('#.0')}%";

			legend.itemContainers.template.events.on("over", (event) => {
				let PercentSeriesDataItem: PercentSeriesDataItem = <PercentSeriesDataItem>event.target.dataItem.dataContext;
				if (PercentSeriesDataItem.visible && !PercentSeriesDataItem.isHiding) {
					PercentSeriesDataItem.slice.isHover = true;
				}
			})

			legend.itemContainers.template.events.on("out", (event) => {
				let PercentSeriesDataItem: PercentSeriesDataItem = <PercentSeriesDataItem>event.target.dataItem.dataContext;
				PercentSeriesDataItem.slice.isHover = false;
			})
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @hidden
 */
registry.registeredClasses["PercentChart"] = PercentChart;
registry.registeredClasses["PercentChartDataItem"] = PercentChartDataItem;
