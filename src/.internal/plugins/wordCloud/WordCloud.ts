/**
 * WordCloud chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, ISerialChartProperties, ISerialChartDataFields, ISerialChartAdapters, ISerialChartEvents, SerialChartDataItem } from "../../charts/types/SerialChart";
import { WordCloudSeries } from "./WordCloudSeries";
import { registry } from "../../core/Registry";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[WordCloud]].
 *
 * @see {@link DataItem}
 */
export class WordCloudDataItem extends SerialChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: WordCloud;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "WordCloudDataItem";
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
 * Defines data fields for [[WordCloud]].
 */
export interface IWordCloudDataFields extends ISerialChartDataFields { }

/**
 * Defines properties for [[WordCloud]]
 */
export interface IWordCloudProperties extends ISerialChartProperties { }

/**
 * Defines events for [[WordCloud]].
 */
export interface IWordCloudEvents extends ISerialChartEvents { }

/**
 * Defines adapters for [[WordCloud]].
 *
 * @see {@link Adapter}
 */
export interface IWordCloudAdapters extends ISerialChartAdapters, IWordCloudProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This is a base class for "percent-based" chart types like Pie and Funnel.
 *
 * @see {@link IWordCloudEvents} for a list of available Events
 * @see {@link IWordCloudAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/wordcloud/} for documentation
 */
export class WordCloud extends SerialChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IWordCloudDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IWordCloudProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IWordCloudAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IWordCloudEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: WordCloudSeries;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "WordCloud";

		this.seriesContainer.isMeasured = true;
		this.seriesContainer.layout = "absolute";

		this._usesData = true;

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Creates a new [[PercentSeries]].
	 *
	 * @return New series
	 */
	protected createSeries(): this["_seriesType"] {
		return new WordCloudSeries();
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @hidden
 */
registry.registeredClasses["WordCloud"] = WordCloud;
registry.registeredClasses["WordCloudDataItem"] = WordCloudDataItem;
