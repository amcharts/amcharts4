/**
 * Sliced chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PercentChart, IPercentChartProperties, IPercentChartDataFields, IPercentChartAdapters, IPercentChartEvents, PercentChartDataItem } from "./PercentChart";
import { FunnelSeries } from "../series/FunnelSeries";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[SlicedChart]].
 *
 * @see {@link DataItem}
 */
export class SlicedChartDataItem extends PercentChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: SlicedChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SlicedChartDataItem";
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
 * Defines data fields for [[SlicedChart]].
 */
export interface ISlicedChartDataFields extends IPercentChartDataFields { }

/**
 * Defines properties for [[SlicedChart]]
 */
export interface ISlicedChartProperties extends IPercentChartProperties { }

/**
 * Defines events for [[SlicedChart]].
 */
export interface ISlicedChartEvents extends IPercentChartEvents { }

/**
 * Defines adapters for [[SlicedChart]].
 *
 * @see {@link Adapter}
 */
export interface ISlicedChartAdapters extends IPercentChartAdapters, ISlicedChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a Sliced chart.
 *
 * @see {@link ISlicedChartEvents} for a list of available Events
 * @see {@link ISlicedChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/sliced-chart/} for documentation
 * @important
 */
export class SlicedChart extends PercentChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: ISlicedChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ISlicedChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISlicedChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISlicedChartEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: FunnelSeries;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "SlicedChart";

		this.seriesContainer.layout = "horizontal";

		this.padding(15, 15, 15, 15);

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
			this.readerTitle = this.language.translate("Sliced chart");
		}
	}

	/**
	 * (Re)validates the chart, causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		super.validate();
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SlicedChart"] = SlicedChart;
registry.registeredClasses["SlicedChartDataItem"] = SlicedChartDataItem;
