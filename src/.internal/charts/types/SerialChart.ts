/**
 * Serial chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Chart, IChartProperties, IChartDataFields, IChartAdapters, IChartEvents, ChartDataItem } from "../Chart";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { IListEvents, ListTemplate, ListDisposer } from "../../core/utils/List";
import { Container } from "../../core/Container";
import { Series } from "../series/Series";
import { percent } from "../../core/utils/Percent";
import { ColorSet } from "../../core/utils/ColorSet";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import { Disposer } from "../../core/utils/Disposer";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[SerialChart]].
 *
 * @see {@link DataItem}
 */
export class SerialChartDataItem extends ChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 *
	 * @type {SerialChart}
	 */
	public _component!: SerialChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SerialChartDataItem";
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
 * Defines data fields for [[SerialChart]].
 */
export interface ISerialChartDataFields extends IChartDataFields { }

/**
 * Defines properties for [[SerialChart]]
 */
export interface ISerialChartProperties extends IChartProperties {

	/**
	 * A set of colors to be used for chart elements, like Series, Slices, etc.
	 *
	 * @type {ColorSet}
	 */
	colors?: ColorSet;

}

/**
 * Defines events for [[SerialChart]].
 */
export interface ISerialChartEvents extends IChartEvents { }

/**
 * Defines adapters for [[SerialChart]].
 *
 * @see {@link Adapter}
 */
export interface ISerialChartAdapters extends IChartAdapters, ISerialChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A base class for all series-based charts, like XY, Pie, etc.
 *
 * Is not useful on its own.
 *
 * @see {@link ISerialChartEvents} for a list of available Events
 * @see {@link ISerialChartAdapters} for a list of available Adapters
 */
export class SerialChart extends Chart {

	/**
	 * Defines data fields.
	 *
	 * @type {ISerialChartDataFields}
	 */
	public _dataFields: ISerialChartDataFields;

	/**
	 * Defines available properties.
	 *
	 * @type {ISerialChartProperties}
	 */
	public _properties!: ISerialChartProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {ISerialChartAdapters}
	 */
	public _adapter!: ISerialChartAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {ISerialChartEvents}
	 */
	public _events!: ISerialChartEvents;

	/**
	 * Defines a type of series that this chart uses.
	 *
	 * @type {Series}
	 */
	public _seriesType: Series;

	/**
	 * Holds a list of [[Series]] displayed on the chart.
	 */
	protected _series: ListTemplate<this["_seriesType"]>

	/**
	 * Holds the reference to the container actual series are drawn in.
	 *
	 * @type {Container}
	 */
	public readonly seriesContainer: Container;

	/**
	 * Holds a reference to the container series' bullets are drawn in.
	 *
	 * @type {Container}
	 */
	public readonly bulletsContainer: Container;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "SerialChart";

		this.colors = new ColorSet();

		// Create a container for series
		let seriesContainer: Container = this.chartContainer.createChild(Container);
		seriesContainer.shouldClone = false;
		seriesContainer.width = percent(100);
		seriesContainer.height = percent(100);
		seriesContainer.isMeasured = false;
		seriesContainer.layout = "none";
		seriesContainer.zIndex = 2;
		this.seriesContainer = seriesContainer;

		// Create a container for bullets
		let bulletsContainer: Container = this.chartContainer.createChild(Container);
		bulletsContainer.shouldClone = false;
		bulletsContainer.width = percent(100);
		bulletsContainer.height = percent(100);
		bulletsContainer.isMeasured = false;
		bulletsContainer.zIndex = 3;
		bulletsContainer.layout = "none";
		this.bulletsContainer = bulletsContainer;

		// Apply theme
		this.applyTheme();
	}

	public dispose(): void {
		super.dispose();

		if (this.colors) {
			this.colors.dispose();
		}
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor
	 */
	protected applyInternalDefaults(): void {

		super.applyInternalDefaults();

		// Add a default screen reader title for accessibility
		// This will be overridden in screen reader if there are any `titles` set
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Serial chart");
		}

	}

	/**
	 * A list of chart's series.
	 *
	 * @return {List} Chart's series
	 */
	public get series(): ListTemplate<this["_seriesType"]> {
		if (!this._series) {
			this._series = new ListTemplate<this["_seriesType"]>(this.createSeries());
			this._series.events.on("inserted", (event)=>{
				this.handleSeriesAdded(event);
			}, undefined, false);
			this._series.events.on("removed", (event) => {
				let series = event.oldValue;
				this.dataUsers.removeValue(series);
				this.dataUsers.each((dataUser)=>{
					dataUser.invalidateDataItems();
				})
				if(series.autoDispose){
					series.dispose();
				}
				this.feedLegend();
			}, undefined, false);
			this._disposers.push(new ListDisposer(this._series));
			this._disposers.push(this._series.template);
		}
		return this._series;
	}

	/**
	 * Decorates a new [[Series]] object with required parameters when it is
	 * added to the chart.
	 *
	 * @ignore Exclude from docs
	 * @param {IListEvents<Series>["inserted"]}  event  Event
	 */
	public handleSeriesAdded(event: IListEvents<Series>["inserted"]): void {
		let series: Series = event.newValue;
		series.chart = this;
		series.parent = this.seriesContainer;

		series.bulletsContainer.parent = this.bulletsContainer;

		this._dataUsers.moveValue(series);
		series.addDisposer(new Disposer(()=>{
			this.dataUsers.removeValue(series);
		}))		


		this.feedLegend();
	}

	/**
	 * Setups the legend to use the chart's data.
	 * @ignore
	 */
	public feedLegend(): void {
		let legend = this.legend;
		if (legend) {
			let legendData: Array<this["_seriesType"]> = [];

			$iter.each(this.series.iterator(), (series) => {
				if(!series.hiddenInLegend){
					legendData.push(series);
				}
			});

			legend.dataFields.name = "name";

			legend.data = legendData;
		}
	}

	/**
	 * Creates and returns a new Series, suitable for this chart type.
	 *
	 * @return {this} New series
	 */
	protected createSeries(): this["_seriesType"] {
		return new Series();
	}

	/**
	 * Chart's color list.
	 *
	 * This list can be used by a number of serial items, like applying a new
	 * color for each Series added. Or, applying a new color for each slice
	 * of a Pie chart.
	 *
	 * Please see [[ColorSet]] for information on how you can set up to generate
	 * unique colors.
	 *
	 * A theme you are using may override default pre-defined colors.
	 *
	 * @param {ColorSet} value Color list
	 */
	public set colors(value: ColorSet) {
		this.setPropertyValue("colors", value, true);
	}

	/**
	 * @return {ColorSet} Color list
	 */
	public get colors(): ColorSet {
		return this.getPropertyValue("colors");
	}

	/**
	 * Copies all parameters from another [[SerialChart]].
	 *
	 * @param {SerialChart} source Source SerialChart
	 */
	public copyFrom(source: this) {
		super.copyFrom(source);
		this.series.copyFrom(source.series);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SerialChart"] = SerialChart;
