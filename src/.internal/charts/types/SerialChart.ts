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
import { IListEvents, ListTemplate, ListDisposer } from "../../core/utils/List";
import { Container } from "../../core/Container";
import { Series } from "../series/Series";
import { percent } from "../../core/utils/Percent";
import { ColorSet } from "../../core/utils/ColorSet";
import { PatternSet } from "../../core/utils/PatternSet";
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
	 */
	colors?: ColorSet;

	/**
	 * A set of patterns to use for fills, like Series, Slices, etc.
	 * 
	 * @since 4.7.5
	 */
	patterns?: PatternSet;

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
	 */
	public _dataFields: ISerialChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ISerialChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISerialChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISerialChartEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: Series;

	/**
	 * Holds a list of [[Series]] displayed on the chart.
	 */
	protected _series: ListTemplate<this["_seriesType"]>

	/**
	 * Holds the reference to the container actual series are drawn in.
	 */
	public readonly seriesContainer: Container;

	/**
	 * Holds a reference to the container series' bullets are drawn in.
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

		this._usesData = false;

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

		if (this.patterns) {
			this.patterns.dispose();
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
	 * @return Chart's series
	 */
	public get series(): ListTemplate<this["_seriesType"]> {
		if (!this._series) {
			this._series = new ListTemplate<this["_seriesType"]>(this.createSeries());
			this._series.events.on("inserted", (event) => {
				this.handleSeriesAdded(event);
			}, undefined, false);
			this._series.events.on("removed", (event) => {
				let series = event.oldValue;
				this.dataUsers.removeValue(series);
				this.dataUsers.each((dataUser) => {
					dataUser.invalidateDataItems();
				})
				if (series.autoDispose) {
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
	 * @param event  Event
	 */
	public handleSeriesAdded(event: IListEvents<Series>["inserted"]): void {
		let series: Series = event.newValue;
		if (series.isDisposed()) {
			return;
		}
		series.chart = this;
		series.parent = this.seriesContainer;

		series.bulletsContainer.parent = this.bulletsContainer;

		this._dataUsers.moveValue(series);
		series.addDisposer(new Disposer(() => {
			this.dataUsers.removeValue(series);
		}))

		this.handleSeriesAdded2(series);

		this.feedLegend();
	}

	protected handleSeriesAdded2(series: Series) {
		if (!this.dataInvalid) {
			if(!series.data || series.data.length == 0){
				this.invalidateData();
			}
		}
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
				if (!series.hiddenInLegend) {
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
	 * @return New series
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
	 * @param value Color list
	 */
	public set colors(value: ColorSet) {
		this.setPropertyValue("colors", value, true);
	}

	/**
	 * @return Color list
	 */
	public get colors(): ColorSet {
		return this.getPropertyValue("colors");
	}

	/**
	 * A [[PatternSet]] to use when creating patterned fills for slices.
	 *
	 * @since 4.7.5
	 * @param value  Pattern set
	 */
	public set patterns(value: PatternSet) {
		this.setPropertyValue("patterns", value, true);
	}

	/**
	 * @return Pattern set
	 */
	public get patterns(): PatternSet {
		return this.getPropertyValue("patterns");
	}

	/**
	 * Copies all parameters from another [[SerialChart]].
	 *
	 * @param source Source SerialChart
	 */
	public copyFrom(source: this) {
		super.copyFrom(source);
		this.series.copyFrom(source.series);
	}


	/**
	 * Hides the chart instantly and then shows it. If defaultState.transitionDuration > 0, this will result an animation in which properties of hidden state will animate to properties of visible state.
	 */
	public appear() {
		super.appear();

		this.series.each((series) => {
			if (series.showOnInit && series.inited) {
				series.appear();
			}
		})
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SerialChart"] = SerialChart;
