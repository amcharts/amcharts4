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
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { percent, Percent } from "../../core/utils/Percent";
import { PercentSeries, PercentSeriesDataItem } from "../series/PercentSeries";
import { DataItem, IDataItemEvents } from "../../core/DataItem";
import { List, IListEvents, ListTemplate } from "../../core/utils/List";
import { Legend } from "../Legend";
import { IPoint } from "../../core/defs/IPoint";
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

							let legendSettings = series.legendSettings;
							if (legendSettings) {
								if (legendSettings.labelText) {
									legend.labels.template.text = legendSettings.labelText;
								}
								if (legendSettings.itemLabelText) {
									legend.labels.template.text = legendSettings.itemLabelText;
								}
								if (legendSettings.valueText) {
									legend.valueLabels.template.text = legendSettings.valueText;
								}
								if (legendSettings.itemValueText) {
									legend.valueLabels.template.text = legendSettings.itemValueText;
								}
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
