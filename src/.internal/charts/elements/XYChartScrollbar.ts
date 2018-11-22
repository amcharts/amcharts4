/**
 * A module with functionality for buildin a scrollbar with an XY graph in it.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Scrollbar, IScrollbarProperties, IScrollbarAdapters, IScrollbarEvents } from "../../core/elements/Scrollbar";
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { List, IListEvents } from "../../core/utils/List";
import { XYSeries } from "../series/XYSeries";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { XYChart } from "../types/XYChart";
import { Axis } from "../axes/Axis";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { DesaturateFilter } from "../../core/rendering/filters/DesaturateFilter";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[XYChartScrollbar]].
 */
export interface IXYChartScrollbarProperties extends IScrollbarProperties { }

/**
 * Defines events for [[XYChartScrollbar]].
 */
export interface IXYChartScrollbarEvents extends IScrollbarEvents { }

/**
 * Defines adapters for [[XYChartScrollbar]].
 *
 * @see {@link Adapter}
 */
export interface IXYChartScrollbarAdapters extends IScrollbarAdapters, IXYChartScrollbarProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A special version of the Scrollbar that has an XY chart in it.
 *
 * Used mainly as an advanced scrollbar with a preview for other XY charts.
 *
 * However, can be used as standalone element.
 *
 * @see {@link IXYChartScrollbarEvents} for a list of available events
 * @see {@link IXYChartScrollbarAdapters} for a list of available Adapters
 * @important
 */
export class XYChartScrollbar extends Scrollbar {

	/**
	 * Defines available properties.
	 *
	 * @type {IXYChartScrollbarProperties}
	 */
	public _properties!: IXYChartScrollbarProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IXYChartScrollbarAdapters}
	 */
	public _adapter!: IXYChartScrollbarAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IXYChartScrollbarEvents}
	 */
	public _events!: IXYChartScrollbarEvents;

	/**
	 * An [[XYSeries]] used to draw a graph on the Scrollbar.
	 *
	 * @type {List<XYSeries>}
	 */
	protected _series: List<XYSeries>;

	/**
	 * A chart element Scrollbar is for.
	 *
	 * @type {MutableValueDisposer}
	 */
	protected _chart = new MutableValueDisposer<XYChart>();

	/**
	 * A chart instance that shows mini-chart within Scrollbar.
	 *
	 * @type {XYChart}
	 */
	protected _scrollbarChart: XYChart;

	/**
	 * [_unselectedOverlay description]
	 *
	 * @todo Description
	 * @type {Sprite}
	 */
	protected _unselectedOverlay: Sprite;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "XYChartScrollbar";

		let interfaceColors = new InterfaceColorSet();
		this.padding(0, 0, 0, 0);

		let scrollbarChart: XYChart = this.createChild(XYChart);
		scrollbarChart.shouldClone = false;
		scrollbarChart.margin(0, 0, 0, 0);
		scrollbarChart.padding(0, 0, 0, 0);
		scrollbarChart.interactionsEnabled = false;

		this._scrollbarChart = scrollbarChart;
		this._disposers.push(this._scrollbarChart);

		this.minHeight = 60;
		this.minWidth = 60;

		let unselectedOverlay: Sprite = this.createChild(Sprite);
		unselectedOverlay.shouldClone = false;
		unselectedOverlay.setElement(this.paper.add("path"));
		unselectedOverlay.fill = interfaceColors.getFor("background");
		unselectedOverlay.fillOpacity = 0.8;
		unselectedOverlay.interactionsEnabled = false;
		unselectedOverlay.isMeasured = false;
		unselectedOverlay.toBack();
		this._unselectedOverlay = unselectedOverlay;
		this._disposers.push(this._unselectedOverlay);

		scrollbarChart.toBack();

		this.background.cornerRadius(0, 0, 0, 0);

		let thumbBackground = this.thumb.background;
		thumbBackground.cornerRadius(0, 0, 0, 0);
		thumbBackground.fillOpacity = 0;
		thumbBackground.fill = interfaceColors.getFor("background");

		let hoverState = thumbBackground.states.getKey("hover");
		if (hoverState) {
			hoverState.properties.fillOpacity = 0.2;
		}

		let downState = thumbBackground.states.getKey("down");
		if (downState) {
			downState.properties.fillOpacity = 0.4;
		}

		this._disposers.push(this._chart);

		this.applyTheme();
	}

	/**
	 * A list of series that are used to draw graph(s) on the scrollbar.
	 *
	 * @readonly
	 * @return {List<XYSeries>} Series
	 */
	public get series(): List<XYSeries> {
		if (!this._series) {
			this._series = new List<XYSeries>();
			this._disposers.push(this._series.events.on("inserted", this.handleSeriesAdded, this, false));
			this._disposers.push(this._series.events.on("removed", this.handleSeriesRemoved, this, false));
		}
		return this._series;
	}

	/**
	 * Decorates a new series when they are pushed into a `series` list.
	 *
	 * @param {IListEvents<XYSeries>["inserted"]} event Event
	 */
	protected handleSeriesAdded(event: IListEvents<XYSeries>["inserted"]) {
		let sourceSeries: XYSeries = event.newValue;
		let scrollbarChart: XYChart = this.scrollbarChart;
		scrollbarChart.zoomOutButton.disabled = true;

		this.chart = sourceSeries.chart;

		let addXAxis: boolean = true;
		let addYAxis: boolean = true;

		// check if we haven't added clone of x or y axis before
		$iter.each(this.series.iterator(), (series) => {
			if (series != sourceSeries) {
				if (series.xAxis == sourceSeries.xAxis) {
					addXAxis = false;
				}
				if (series.yAxis == sourceSeries.yAxis) {
					addYAxis = false;
				}
			}
		});

		let interfaceColors = new InterfaceColorSet();

		let series: XYSeries = <XYSeries>sourceSeries.clone();

		if (addXAxis) {

			let xAxis = sourceSeries.xAxis.clone();
			scrollbarChart.xAxes.moveValue(xAxis);
			xAxis.title.disabled = true;
			xAxis.rangeChangeDuration = 0;
			xAxis.id = sourceSeries.uid;
			xAxis.title.disabled = true;

			let renderer = xAxis.renderer;
			renderer.ticks.template.disabled = true;
			renderer.inside = true;
			renderer.line.strokeOpacity = 0;
			renderer.minLabelPosition = 0.02;
			renderer.maxLabelPosition = 0.98;
			renderer.line.disabled = true;
			renderer.axisFills.template.disabled = true;
			renderer.baseGrid.disabled = true;
			renderer.grid.template.strokeOpacity = 0.05;

			let labelsTemplate = renderer.labels.template;
			labelsTemplate.fillOpacity = 0.5;

			series.xAxis = xAxis;
		}
		else {
			// @todo find clone, otherwise there might be probs with multiple axes
		}


		if (addYAxis) {
			let yAxis: Axis = <Axis>sourceSeries.yAxis.clone();
			scrollbarChart.yAxes.moveValue(yAxis);
			yAxis.title.disabled = true;
			yAxis.rangeChangeDuration = 0;

			let renderer = yAxis.renderer;
			renderer.ticks.template.disabled = true;
			renderer.inside = true;
			renderer.line.strokeOpacity = 0;
			renderer.minLabelPosition = 0.02;
			renderer.maxLabelPosition = 0.98;
			renderer.line.disabled = true;
			renderer.axisFills.template.disabled = true;
			renderer.grid.template.stroke = interfaceColors.getFor("background");
			renderer.baseGrid.disabled = true;
			renderer.grid.template.strokeOpacity = 0.05;

			let labelsTemplate = renderer.labels.template;
			labelsTemplate.fillOpacity = 0.5;

			series.yAxis = yAxis;
		}
		else {
			// @todo find clone, otherwise there might be probs with multiple axes
		}

		series.rangeChangeDuration = 0;
		series.interpolationDuration = 0;
		series.defaultState.transitionDuration = 0;

		this._disposers.push(series.events.on("validated", this.zoomOutAxes, this, false));

		// data might be set drectly on series
		this._disposers.push(sourceSeries.events.on("datavalidated", () => {
			if (series.data != sourceSeries.data) { // data setter doesn't check this
				series.data = sourceSeries.data;
			}
		}, undefined, false));
		series.defaultState.properties.visible = true;

		series.filters.push(new DesaturateFilter());
		scrollbarChart.series.push(series);

		this.updateByOrientation();
	}

	/**
	 * @ignore
	 */
	protected updateByOrientation() {
		$iter.each(this._scrollbarChart.xAxes.iterator(), (xAxis) => {
			if (this.orientation == "vertical") {
				let renderer = xAxis.renderer;
				renderer.grid.template.disabled = true;
				renderer.labels.template.disabled = true;
				renderer.minGridDistance = 10;
			}
		});

		$iter.each(this._scrollbarChart.yAxes.iterator(), (yAxis) => {
			if (this.orientation == "horizontal") {
				let renderer = yAxis.renderer;
				renderer.grid.template.disabled = true;
				renderer.labels.template.disabled = true;
				renderer.minGridDistance = 10;
			}
		});
	}


	/**
	 * Cleans up after series are removed from Scrollbar.
	 *
	 * @param {IListEvents<XYSeries>["removed"]}  event  Event
	 */
	protected handleSeriesRemoved(event: IListEvents<XYSeries>["removed"]) {
		let sourceSeries: XYSeries = event.oldValue;
		sourceSeries.events.off("validated", this.zoomOutAxes, this);
	}

	/**
	 * A chart element that is used to display graphs in the Scrollbar.
	 *
	 * This is not the same as `chart`. It's a totally independent instance of
	 * [[XYChart]] with separate config, series, etc.
	 *
	 * It can be configured just like any other [[XYChart]].
	 *
	 * @readonly
	 * @return {XYChart} Scrollbar's internal chart
	 */
	public get scrollbarChart(): XYChart {
		return this._scrollbarChart;
	}

	/**
	 * A chart that Scrollbar belongs to.
	 *
	 * @param {XYChart} chart  Chart
	 */
	public set chart(chart: XYChart) {
		if (this._chart.get() !== chart) {
			this._chart.set(chart, chart.events.on("datavalidated", this.handleDataChanged, this, false));
			this.handleDataChanged();			
			this._scrollbarChart.dataProvider = chart; // this makes scrollbar chart do not validate data untill charts' data is validated
		}
	}

	/**
	 * @return {XYChart} Chart
	 */
	public get chart(): XYChart {
		return this._chart.get();
	}

	/**
	 * Updates Scrollbar's internal chart's data when the main chart's data
	 * changes.
	 *
	 * @ignore Exclude from docs
	 */
	public handleDataChanged() {
		//@todo: what if raw data changed?
		if (this.chart.data != this.scrollbarChart.data) {
			this.scrollbarChart.data = this.chart.data;
		}
	}

	/**
	 * Zooms out all axes on the internal chart.
	 */
	protected zoomOutAxes() {
		let scrollbarChart: XYChart = this.scrollbarChart;
		$iter.each(scrollbarChart.xAxes.iterator(), (x) => {
			x.zoom({ start: 0, end: 1 }, true, true);
		});
		$iter.each(scrollbarChart.yAxes.iterator(), (y) => {
			y.zoom({ start: 0, end: 1 }, true, true);
		});
	}

	/**
	 * Updates scrollbar thumb.
	 */
	protected updateThumb() {
		super.updateThumb();
		if (this._unselectedOverlay) {
			let thumb = this.thumb;
			let x: number = thumb.pixelX || 0;
			let y: number = thumb.pixelY || 0;
			let w: number = thumb.pixelWidth || 0;
			let h: number = thumb.pixelHeight || 0;

			let path: string = "";

			if (this.orientation == "horizontal") {
				path = $path.rectToPath({
					x: -1,
					y: 0,
					width: x,
					height: h
				});

				path += $path.rectToPath({
					x: x + w,
					y: 0,
					width: (this.pixelWidth || 0) - x - w,
					height: h
				});
			}
			else {
				path = $path.rectToPath({
					x: 0,
					y: 0,
					width: w,
					height: y
				});

				path += $path.rectToPath({
					x: 0,
					y: y + h,
					width: w,
					height: (this.pixelHeight || 0) - y - h
				});
			}

			this._unselectedOverlay.path = path;
		}
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param {object}  config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			if ($type.hasValue(config.series) && $type.isArray(config.series)) {
				for (let i = 0, len = config.series.length; i < len; i++) {
					let series = config.series[i];
					if ($type.hasValue(series) && $type.isString(series)) {
						if (this.map.hasKey(series)) {
							config.series[i] = this.map.getKey(series);
						}
						else {
							throw Error("XYChartScrollbar error: Series with id `" + series + "` does not exist.");
						}
					}
				}
			}

		}

		super.processConfig(config);

	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYChartScrollbar"] = XYChartScrollbar;
