/**
 * ForceDirectedTree chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, ISerialChartProperties, ISerialChartDataFields, ISerialChartAdapters, ISerialChartEvents, SerialChartDataItem } from "../../charts/types/SerialChart";
import { ForceDirectedSeries, ForceDirectedSeriesDataItem } from "./ForceDirectedSeries";
import { Export } from "../../core/export/Export";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 * @see {@link DataItem}
 */
export class ForceDirectedTreeDataItem extends SerialChartDataItem { }


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedTreeDataFields extends ISerialChartDataFields { }

/**
 * Defines properties for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedTreeProperties extends ISerialChartProperties { }

/**
 * Defines events for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedTreeEvents extends ISerialChartEvents { }

/**
 * Defines adapters for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 * @see {@link Adapter}
 */
export interface IForceDirectedTreeAdapters extends ISerialChartAdapters, IForceDirectedTreeProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A main class for [[ForceDirectedTree]] chart type.
 *
 * @see {@link IForceDirectedTreeEvents} for a list of available Events
 * @see {@link IForceDirectedTreeAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/force-directed/} For more information
 * @since 4.3.8
 * @important
 */
export class ForceDirectedTree extends SerialChart {

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: ForceDirectedTreeDataItem;

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IForceDirectedTreeDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IForceDirectedTreeProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IForceDirectedTreeAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IForceDirectedTreeEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: ForceDirectedSeries;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "ForceDirectedTree";

		this.seriesContainer.isMeasured = true;
		this.seriesContainer.layout = "absolute";


		// Apply theme
		this.applyTheme();
	}

	/**
	 * Creates and returns a new series of the suitable type.
	 *
	 * @return New series
	 */
	protected createSeries(): this["_seriesType"] {
		return new ForceDirectedSeries();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new ForceDirectedTreeDataItem();
	}

	/**
	 * Setups the legend to use the chart's data.
	 *
	 * @ignore
	 */
	public feedLegend(): void {
		let legend = this.legend;
		if (legend) {

			let legendData: any[] = [];

			this.series.each((series) => {
				if (!series.hiddenInLegend) {

					let dataItems = series.dataItems;
					if (dataItems.length == 1) {
						let children = series.dataItems.getIndex(0).children;
						if (children.length > 0) {
							dataItems = children;
						}
					}

					dataItems.each((dataItem) => {
						if (!dataItem.hiddenInLegend) {
							legendData.push(<ForceDirectedSeriesDataItem>dataItem);

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
			legend.dataFields.name = "name";
		}
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
			this.readerTitle = this.language.translate("Force directed tree");
		}
	}

	/**
	 * Since this chart uses hierarchical data, we need to remove childrent
	 * dataField from export of non-hierarchical formats such as CSV and XSLX.
	 *
	 * @return Export
	 */
	protected getExporting(): Export {
		const exporting = super.getExporting();
		exporting.adapter.add("formatDataFields", (info) => {
			if (info.format == "csv" || info.format == "xlsx") {
				this.series.each((series) => {
					if($type.hasValue(series.dataFields.children)) {
						delete info.dataFields[series.dataFields.children];
					}
				})
			}
			return info;
		})
		return exporting;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ForceDirectedTree"] = ForceDirectedTree;
registry.registeredClasses["ForceDirectedTreeDataItem"] = ForceDirectedTreeDataItem;
