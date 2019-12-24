/**
 * XY Chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, ISerialChartProperties, ISerialChartDataFields, ISerialChartAdapters, ISerialChartEvents, SerialChartDataItem } from "./SerialChart";
import { Sprite, ISpriteEvents, AMEvent } from "../../core/Sprite";
import { Container } from "../../core/Container";
import { List, IListEvents } from "../../core/utils/List";
import { Color } from "../../core/utils/Color";
import { Axis } from "../axes/Axis";
import { ValueAxis } from "../axes/ValueAxis";
import { DateAxis } from "../axes/DateAxis";
import { Optional } from "../../core/utils/Type";
import { AxisRenderer } from "../axes/AxisRenderer";
import { AxisRendererX } from "../axes/AxisRendererX";
import { AxisRendererY } from "../axes/AxisRendererY";
import { CategoryAxis } from "../axes/CategoryAxis";
import { XYSeries, XYSeriesDataItem } from "../series/XYSeries";
import { Scrollbar, IScrollbarEvents } from "../../core/elements/Scrollbar";
import { IRange } from "../../core/defs/IRange";
import { XYCursor, IXYCursorEvents } from "../cursors/XYCursor";
import { IPoint } from "../../core/defs/IPoint";
import { IDisposer, Disposer } from "../../core/utils/Disposer";
import { Button } from "../../core/elements/Button";
import { ZoomOutButton } from "../../core/elements/ZoomOutButton";
import { percent } from "../../core/utils/Percent";
import { Ordering } from "../../core/utils/Order";
import { registry } from "../../core/Registry";
import { XYChartScrollbar } from "../elements/XYChartScrollbar";

import * as $math from "../../core/utils/Math";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $utils from "../../core/utils/Utils";
import * as $array from "../../core/utils/Array";
import * as $number from "../../core/utils/Number";

import { defaultRules, ResponsiveBreakpoints } from "../../core/utils/Responsive";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[XYChart]].
 *
 * @see {@link DataItem}
 */
export class XYChartDataItem extends SerialChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: XYChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "XYChartDataItem";
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
 * Defines data fields for [[XYChart]].
 */
export interface IXYChartDataFields extends ISerialChartDataFields { }

/**
 * Defines properties for [[XYChart]].
 */
export interface IXYChartProperties extends ISerialChartProperties {

	/**
	 * A container that is used as a maske for bullets so that they can't
	 * "spill" outside of the plot area.
	 */
	maskBullets?: boolean;

	/**
	 * Specifies what should chart do if when mouse wheel is rotated.
	 *
	 * @default "none"
	 */
	mouseWheelBehavior?: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none";

	/**
	 * Specifies what should chart do if when horizontal mouse wheel is rotated.
	 *
	 * @default "none"
	 */
	horizontalMouseWheelBehavior?: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none";

	/**
	 * Specifies if chart should arrange series tooltips so that they won't
	 * overlap.
	 *
	 * @default true
	 */
	arrangeTooltips?: boolean;
}

/**
 * Defines events for [[XYChart]].
 */
export interface IXYChartEvents extends ISerialChartEvents { }

/**
 * Defines adapters for [[XYChart]].
 *
 * @see {@link Adapter}
 */
export interface IXYChartAdapters extends ISerialChartAdapters, IXYChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates an XY chart, and any derivative chart, like Serial, Date-based, etc.
 *
 * Basically this is a chart type, that is used to display any chart
 * information in a square plot area.
 *
 * The horizontal and vertical scale is determined by the type of Axis.
 *
 * The plot types are determined by type of Series.
 *
 * ```TypeScript
 * // Includes
 * import * as am4core from "@amcharts/amcharts4/core";
 * import * as am4charts from "@amcharts/amcharts4/charts";
 *
 * // Create chart
 * let chart = am4core.create("chartdiv", am4charts.XYChart);
 *
 * // Add Data
 * chart.data = [{
 * "country": "USA",
 * "visits": 3025
 * }, {
 * 	"country": "China",
 * 	"visits": 1882
 * }, {
 * 	"country": "Japan",
 * 	"visits": 1809
 * }];
 *
 * // Add category axis
 * let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 * categoryAxis.dataFields.category = "country";
 *
 * // Add value axis
 * let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 *
 * // Add series
 * let series = chart.series.push(new am4charts.ColumnSeries());
 * series.name = "Web Traffic";
 * series.dataFields.categoryX = "country";
 * series.dataFields.valueY = "visits";
 * ```
 * ```JavaScript
 * // Create chart
 * var chart = am4core.create("chartdiv", am4charts.XYChart);
 *
 * // The following would work as well:
 * // var chart = am4core.create("chartdiv", "XYChart");
 *
 * // Add Data
 * chart.data = [{
 * "country": "USA",
 * "visits": 3025
 * }, {
 * 	"country": "China",
 * 	"visits": 1882
 * }, {
 * 	"country": "Japan",
 * 	"visits": 1809
 * }];
 *
 * // Add category axis
 * var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 * categoryAxis.dataFields.category = "country";
 *
 * // Add value axis
 * var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 *
 * // Add series
 * var series = chart.series.push(new am4charts.ColumnSeries());
 * series.name = "Web Traffic";
 * series.dataFields.categoryX = "country";
 * series.dataFields.valueY = "visits";
 * ```
 * ```JSON
 * var chart = am4core.createFromConfig({
 *
 * 	// Category axis
 * 	"xAxes": [{
 * 		"type": "CategoryAxis",
 * 		"dataFields": {
 * 			"category": "country"
 * 		}
 * 	}],
 *
 * 	// Value axis
 * 	"yAxes": [{
 * 		"type": "ValueAxis"
 * 	}],
 *
 * 	// Series
 * 	"series": [{
 * 		"type": "ColumnSeries",
 * 		"dataFields": {
 * 			"categoryX": "country",
 * 			"valueY": "visits"
 * 		},
 * 		"name": "Web Traffic"
 * 	}],
 *
 * 	// Cursor
 * 	"cursor": {},
 *
 * 	// Data
 * 	"data": [{
 * 		"country": "USA",
 * 		"visits": 3025
 * 	}, {
 * 		"country": "China",
 * 		"visits": 1882
 * 	}, {
 * 		"country": "Japan",
 * 		"visits": 1809
 * 	}]
 *
 * }, "chartdiv", "XYChart");
 * ```
 *
 *
 * @see {@link IXYChartEvents} for a list of available Events
 * @see {@link IXYChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/} for documentation
 * @important
 */
export class XYChart extends SerialChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IXYChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IXYChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IXYChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IXYChartEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: XYSeries;

	/**
	 * A list of horizontal axes.
	 */
	protected _xAxes: List<Axis<this["_xAxisRendererType"]>>;

	/**
	 * A list of vertical axes.
	 */
	protected _yAxes: List<Axis<this["_yAxisRendererType"]>>;

	/**
	 * A container that holds vertical axes and plot area.
	 *
	 * @type {Container}
	 */
	public yAxesAndPlotContainer: Container

	/**
	 * A container that holds top axes.
	 *
	 * @type {Container}
	 */
	public topAxesContainer: Container;

	/**
	 * A container that holds bottom axes.
	 *
	 * @type {Container}
	 */
	public bottomAxesContainer: Container;

	/**
	 * A container that holds left axes.
	 *
	 * @type {Container}
	 */
	public leftAxesContainer: Container;

	/**
	 * A container that holds right axes.
	 *
	 * @type {Container}
	 */
	public rightAxesContainer: Container;

	/**
	 * A container for plot area.
	 *
	 * @type {Container}
	 */
	public plotContainer: Container;

	/**
	 * A reference to horizontal [[Scrollbar]].
	 */
	protected _scrollbarX: Scrollbar;

	/**
	 * A reference to vertical [[Scrollbar]].
	 */
	protected _scrollbarY: Scrollbar;

	/**
	 * A reference to chart's cursor.
	 */
	public _cursor: XYCursor;

	/**
	 * A container that chart's cursor is placed in.
	 */
	protected _cursorContainer: Container;

	/**
	 * Defines the type of horizontal axis rederer.
	 */
	protected _axisRendererX: typeof AxisRendererX = AxisRendererX;

	/**
	 * Defines the type of vertical axis rederer.
	 */
	protected _axisRendererY: typeof AxisRendererY = AxisRendererY;

	/**
	 * Defines the type horizontal axis renderer.
	 */
	public _xAxisRendererType: AxisRendererX;

	/**
	 * Defines the type of vertical axis renderer.
	 */
	public _yAxisRendererType: AxisRendererY;

	/**
	 * A button which is used to zoom out the chart.
	 */
	protected _zoomOutButton: Button;

	/**
	 * An element that is used as a mask to contain bullets from spilling out of
	 * the plot area.
	 */
	protected _bulletMask: Sprite;


	protected _panStartXRange: IRange;

	protected _panStartYRange: IRange;

	protected _panEndXRange: IRange;

	protected _panEndYRange: IRange;

	protected _mouseWheelDisposer: IDisposer;

	protected _mouseWheelDisposer2: IDisposer;

	protected _cursorXPosition: number;

	protected _cursorYPosition: number;

	/**
	 * Holds a reference to the container axis bullets are drawn in.
	 */
	public axisBulletsContainer: Container;

	/**
	 * @ignore
	 */
	public _seriesPoints: { point: IPoint, series: XYSeries }[] = [];

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();

		this.className = "XYChart";

		// Set defaults
		//this.margin(10, 10, 10, 10);
		this.maskBullets = true;
		this.arrangeTooltips = true;

		// Create main chart container
		let chartContainer = this.chartContainer;
		chartContainer.layout = "vertical";
		this.padding(15, 15, 15, 15);

		// Create top axes container
		let topAxesCont = chartContainer.createChild(Container);
		topAxesCont.shouldClone = false;
		topAxesCont.layout = "vertical";
		topAxesCont.width = percent(100);
		topAxesCont.zIndex = 1;
		this.topAxesContainer = topAxesCont;

		// Create vertical axes and plot area container
		// Plot area and vertical axes share the whole width of the chart,
		// so we need to put then into a separate container so that layouting
		// engine takes care of the positioning
		let yAxesAndPlotCont = chartContainer.createChild(Container);
		yAxesAndPlotCont.shouldClone = false;
		yAxesAndPlotCont.layout = "horizontal";
		yAxesAndPlotCont.width = percent(100);
		yAxesAndPlotCont.height = percent(100);
		yAxesAndPlotCont.zIndex = 0;
		this.yAxesAndPlotContainer = yAxesAndPlotCont;

		// Create a container for bottom axes
		let bottomAxesCont = chartContainer.createChild(Container);
		bottomAxesCont.shouldClone = false;
		bottomAxesCont.width = percent(100);
		bottomAxesCont.layout = "vertical";
		bottomAxesCont.zIndex = 1;
		this.bottomAxesContainer = bottomAxesCont;

		// Create a container for left-side axes
		let leftAxesCont = yAxesAndPlotCont.createChild(Container);
		leftAxesCont.shouldClone = false;
		leftAxesCont.layout = "horizontal";
		leftAxesCont.height = percent(100);
		leftAxesCont.contentAlign = "right";
		leftAxesCont.events.on("transformed", this.updateXAxesMargins, this, false);
		leftAxesCont.zIndex = 1;
		this.leftAxesContainer = leftAxesCont;

		// Create a container for plot area
		let plotCont = yAxesAndPlotCont.createChild(Container);
		plotCont.shouldClone = false;
		plotCont.height = percent(100);
		plotCont.width = percent(100);
		// Create transparend background for plot container so that hover works
		// on all of it
		plotCont.background.fillOpacity = 0;
		this.plotContainer = plotCont;

		// must go below plot container
		this.mouseWheelBehavior = "none";

		this._cursorContainer = plotCont;

		// Create a container for right-side axes
		let rightAxesCont = yAxesAndPlotCont.createChild(Container);
		rightAxesCont.shouldClone = false;
		rightAxesCont.layout = "horizontal";
		rightAxesCont.height = percent(100);
		rightAxesCont.zIndex = 1;
		rightAxesCont.events.on("transformed", this.updateXAxesMargins, this, false);
		this.rightAxesContainer = rightAxesCont;

		this.seriesContainer.parent = plotCont;
		this.bulletsContainer.parent = plotCont;

		let zoomOutButton = plotCont.createChild(ZoomOutButton);
		zoomOutButton.shouldClone = false;
		zoomOutButton.align = "right";
		zoomOutButton.valign = "top";
		zoomOutButton.zIndex = Number.MAX_SAFE_INTEGER;
		zoomOutButton.marginTop = 5;
		zoomOutButton.marginRight = 5;

		zoomOutButton.hide(0);
		this.zoomOutButton = zoomOutButton;

		// Create a container for bullets
		let axisBulletsContainer: Container = this.plotContainer.createChild(Container);
		axisBulletsContainer.shouldClone = false;
		axisBulletsContainer.width = percent(100);
		axisBulletsContainer.height = percent(100);
		axisBulletsContainer.isMeasured = false;
		axisBulletsContainer.zIndex = 4;
		axisBulletsContainer.layout = "none";
		this.axisBulletsContainer = axisBulletsContainer;

		this._bulletMask = this.plotContainer;

		this.events.on("beforedatavalidated", () => {
			this.series.each((series) => {
				series.dataGrouped = false;
				series._baseInterval = {};
			})
		}, this, false);

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {

		super.applyInternalDefaults();
		this.zoomOutButton.exportable = false;
		// Add a default screen reader title for accessibility
		// This will be overridden in screen reader if there are any `titles` set
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("X/Y chart");
		}

	}

	/**
	 * Draws the chart.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		this.seriesContainer.toFront();
		this.bulletsContainer.toFront();

		if (this.maskBullets) {
			this.bulletsContainer.mask = this._bulletMask;
		}

		this.updateSeriesLegend();
	}

	/**
	 * Triggers a redrawing of all chart's series.
	 *
	 * @ignore Exclude from docs
	 */
	public updatePlotElements(): void {
		$iter.each(this.series.iterator(), (series) => {
			series.invalidate();
		});
	}

	/**
	 * Triggers data (re)validation which in turn can cause a redraw of the
	 * whole chart or just aprticular series / elements.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {

		// tell axes that data changed
		if (this._parseDataFrom == 0) {
			$iter.each(this.xAxes.iterator(), (axis) => {
				axis.dataChangeUpdate();
			});

			$iter.each(this.yAxes.iterator(), (axis) => {
				axis.dataChangeUpdate();
			});

			$iter.each(this.series.iterator(), (series) => {
				series.dataChangeUpdate();
			});
		}

		super.validateData();
	}

	/**
	 * Updates margins for horizontal axes based on settings and available space.
	 *
	 * @ignore Exclude from docs
	 */
	protected updateXAxesMargins(): void {

		let leftAxesWidth = this.leftAxesContainer.measuredWidth;
		let rightAxesWidth = this.rightAxesContainer.measuredWidth;
		let bottomAxesCont = this.bottomAxesContainer;

		if (bottomAxesCont.paddingLeft != leftAxesWidth || bottomAxesCont.paddingRight != rightAxesWidth) {
			bottomAxesCont.paddingLeft = leftAxesWidth;
			bottomAxesCont.paddingRight = rightAxesWidth;
		}

		let topAxesCont = this.topAxesContainer;

		if (topAxesCont.paddingLeft != leftAxesWidth || topAxesCont.paddingRight != rightAxesWidth) {
			topAxesCont.paddingLeft = leftAxesWidth;
			topAxesCont.paddingRight = rightAxesWidth;
		}
	}

	/**
	 * Triggers a re-initialization of this element.
	 *
	 * Will result in complete redrawing of the element.
	 *
	 * @ignore Exclude from docs
	 */
	public reinit(): void {
		super.reinit();

		this.series.each((series) => {
			series.appeared = false;
		})
	}

	/**
	 * Triggers an update on the horizontal axis when one of its properties
	 * change.
	 *
	 * @ignore Exclude from docs
	 * @param event An event object
	 */
	public handleXAxisChange(event: AMEvent<AxisRenderer, ISpriteEvents>["propertychanged"]) {
		this.updateXAxis(event.target);
	}

	/**
	 * Triggers an update on the vertical axis when one of its properties
	 * change.
	 *
	 * @ignore Exclude from docs
	 * @param event An event object
	 */
	public handleYAxisChange(event: AMEvent<AxisRenderer, ISpriteEvents>["propertychanged"]) {
		this.updateYAxis(event.target);
	}

	/**
	 * Sets up a new horizontal (X) axis when it is added to the chart.
	 *
	 * @ignore Exclude from docs
	 * @param event  Axis insert event
	 */
	public processXAxis(event: IListEvents<Axis>["inserted"]): void {

		let axis: Axis = event.newValue;
		axis.chart = this;

		if (!axis.renderer) {
			axis.renderer = new this._axisRendererX();
			axis.renderer.observe(["opposite", "inside", "inversed", "minGridDistance"], this.handleXAxisChange, this, false);
		}
		axis.axisLetter = "X";

		axis.events.on("startendchanged", this.handleXAxisRangeChange, this, false);
		//axis.events.on("endchanged", this.handleXAxisRangeChange, this, false);

		// Although axis does not use data directly, we set dataProvider here
		// (but not add to chart data users) to hold up rendering before data
		// is parsed (system handles this)
		axis.dataProvider = this;

		this.updateXAxis(axis.renderer);
		this.processAxis(axis);

	}

	/**
	 * Sets up a new vertical (Y) axis when it is added to the chart.
	 *
	 * @ignore Exclude from docs
	 * @param event Axis insert event
	 */
	public processYAxis(event: IListEvents<Axis>["inserted"]): void {

		let axis: Axis = event.newValue;
		axis.chart = this;
		if (!axis.renderer) {
			axis.renderer = new this._axisRendererY();
			axis.renderer.observe(["opposite", "inside", "inversed", "minGridDistance"], this.handleYAxisChange, this, false);
		}
		axis.axisLetter = "Y";

		axis.events.on("startendchanged", this.handleYAxisRangeChange, this, false);
		//axis.events.on("endchanged", this.handleYAxisRangeChange, this, false);

		// Although axis does not use data directly, we set dataProvider here
		// (but not add to chart data users) to hold up rendering before data
		// is parsed (system handles this)
		axis.dataProvider = this;

		this.updateYAxis(axis.renderer);
		this.processAxis(axis);
	}

	/**
	 * Updates horizontal (X) scrollbar and other horizontal axis whenever axis'
	 * value range changes.
	 */
	protected handleXAxisRangeChange() {
		let range: IRange = this.getCommonAxisRange(this.xAxes);
		if (this.scrollbarX) {
			this.zoomAxes(this.xAxes, range, true);
		}
		this.toggleZoomOutButton();
		this.updateScrollbar(this.scrollbarX, range);
	}

	/**
	 * Shows or hides the Zoom Out button depending on whether the chart is fully
	 * zoomed out or not.
	 */
	public toggleZoomOutButton() {
		if (this.zoomOutButton) {
			let show = false;

			$iter.eachContinue(this.xAxes.iterator(), (axis): boolean => {
				if (axis.toggleZoomOutButton) {
					if (axis.maxZoomCount > 0) {
						let minZoomFactor: number = axis.maxZoomFactor / axis.maxZoomCount;
						if ($math.round(axis.end - axis.start, 3) < 1 / minZoomFactor) {
							show = true;
							return false;
						}
					}
					else {
						if ($math.round(axis.start, 3) != 0 || $math.round(axis.end, 3) != 1) {
							show = true;
							return false;
						}
					}
				}
				return true;
			});
			$iter.eachContinue(this.yAxes.iterator(), (axis): boolean => {
				if (axis.toggleZoomOutButton) {
					if (axis.maxZoomCount > 0) {
						let minZoomFactor: number = axis.maxZoomFactor / axis.maxZoomCount;
						if ($math.round(axis.end - axis.start, 3) < 1 / minZoomFactor) {
							show = true;
							return false;
						}
					}
					else {
						if ($math.round(axis.start, 3) != 0 || $math.round(axis.end, 3) != 1) {
							show = true;
							return false;
						}
					}
					return true;
				}
			});

			if (!this.seriesAppeared) {
				show = false;
			}

			if (show) {
				this.zoomOutButton.show();
			}
			else {
				this.zoomOutButton.hide();
			}
		}
	}

	/**
	 * @ignore
	 * moved this check to a separate method so that we could override it in TreeMapSeries
	 */
	protected seriesAppeared(): boolean {
		let appeared: boolean = false;
		$iter.each(this.series.iterator(), (series) => {
			if (!series.appeared) {
				appeared = false;
				return false;
			}
		})
		return appeared;
	}

	/**
	 * Updates vertical (Y) scrollbar and other horizontal axis whenever axis'
	 * value range changes.
	 */
	protected handleYAxisRangeChange() {
		let range: IRange = this.getCommonAxisRange(this.yAxes);

		if (this.scrollbarY) {
			this.zoomAxes(this.yAxes, range, true);
		}
		this.toggleZoomOutButton();
		this.updateScrollbar(this.scrollbarY, range);
	}

	/**
	 * Updates a relative scrollbar whenever data range of the axis changes.
	 *
	 * @param scrollbar  Scrollbar instance
	 * @param range      New data (values) range of the axis
	 */
	protected updateScrollbar(scrollbar: Scrollbar, range: IRange): void {
		if (scrollbar) {
			scrollbar.skipRangeEvents();
			scrollbar.start = range.start;
			scrollbar.end = range.end;
		}
	}

	/**
	 * Returns a common range of values between a list of axes.
	 *
	 * This is used to synchronize the zoom between multiple axes.
	 *
	 * @ignore Exclude from docs
	 * @param axes  A list of axes
	 * @return Common value range
	 */
	public getCommonAxisRange(axes: List<Axis>): IRange {
		let start: Optional<number>;
		let end: Optional<number>;

		$iter.each(axes.iterator(), (axis) => {
			let axisStart = axis.start;
			let axisEnd = axis.end;

			if (axis.renderer.inversed) {
				axisStart = 1 - axis.end;
				axisEnd = 1 - axis.start;
			}

			if (!$type.isNumber(start) || (axisStart < start)) {
				start = axisStart;
			}
			if (!$type.isNumber(end) || (axisEnd > end)) {
				end = axisEnd;
			}
		});

		return { start: start, end: end };
	}

	/**
	 * Triggers (re)rendering of the horizontal (X) axis.
	 *
	 * @ignore Exclude from docs
	 * @param axis  Axis
	 */
	public updateXAxis(renderer: AxisRenderer) {
		let axis = renderer.axis;
		if (renderer.opposite) {
			axis.parent = this.topAxesContainer;
			axis.toFront();
		}
		else {
			axis.parent = this.bottomAxesContainer;
			axis.toBack();
		}
		if (axis.renderer) {
			axis.renderer.processRenderer();
		}
	}

	/**
	 * Triggers (re)rendering of the vertical (Y) axis.
	 *
	 * @ignore Exclude from docs
	 * @param axis  Axis
	 */
	public updateYAxis(renderer: AxisRenderer) {
		let axis = renderer.axis;
		if (renderer.opposite) {
			axis.parent = this.rightAxesContainer;
			axis.toBack();
		}
		else {
			axis.parent = this.leftAxesContainer;
			axis.toFront();
		}
		if (axis.renderer) {
			axis.renderer.processRenderer();
		}
	}

	/**
	 * Decorates an Axis for use with this chart, e.g. sets proper renderer
	 * and containers for placement.
	 *
	 * @param axis  Axis
	 */
	protected processAxis(axis: Axis): void {
		// Value axis does not use data directly, only category axis does
		if (axis instanceof CategoryAxis) {
			this._dataUsers.moveValue(axis);
		}

		let renderer: AxisRenderer = axis.renderer;

		renderer.gridContainer.parent = this.plotContainer;
		renderer.gridContainer.toBack();

		renderer.breakContainer.parent = this.plotContainer;
		renderer.breakContainer.toFront();
		renderer.breakContainer.zIndex = 10;

		axis.addDisposer(new Disposer(() => {
			this.dataUsers.removeValue(axis);
		}))

		renderer.bulletsContainer.parent = this.axisBulletsContainer;

		this._disposers.push(axis.events.on("positionchanged", () => {
			let point = $utils.spritePointToSprite({ x: 0, y: 0 }, axis, this.axisBulletsContainer);
			if (axis.renderer instanceof AxisRendererY) {
				renderer.bulletsContainer.y = point.y;
			}
			if (axis.renderer instanceof AxisRendererX) {
				renderer.bulletsContainer.x = point.x;
			}
		}, undefined, false));

		this.plotContainer.events.on("maxsizechanged", () => {
			if (this.inited) {
				axis.invalidateDataItems();
				this.updateSeriesMasks();
			}
		}, axis, false);
	}

	/**
	 * This is done because for some reason IE doesn't change mask if path of a
	 * mask changes.
	 */
	protected updateSeriesMasks(): void {
		if ($utils.isIE()) {
			this.series.each((series) => {
				let mask = series.mainContainer.mask;
				series.mainContainer.mask = undefined;
				series.mainContainer.mask = mask;
			});
		}
	}

	/**
	 * A list of horizontal (X) axes.
	 *
	 * @return List of axes
	 */
	public get xAxes(): List<Axis<this["_xAxisRendererType"]>> {
		if (!this._xAxes) {
			this._xAxes = new List<Axis<this["_xAxisRendererType"]>>();
			this._xAxes.events.on("inserted", this.processXAxis, this, false);
			this._xAxes.events.on("removed", this.handleAxisRemoval, this, false);
		}

		return this._xAxes;
	}

	/**
	 * @ignore
	 */
	public handleAxisRemoval(event: IListEvents<Axis>["removed"]) {
		let axis = event.oldValue;
		this.dataUsers.removeValue(axis); // need to remove, as it might not be disposed
		if (axis.autoDispose) {
			axis.dispose();
		}
	}

	/**
	 * A list of vertical (Y) axes.
	 *
	 * @return List of axes
	 */
	public get yAxes(): List<Axis<this["_yAxisRendererType"]>> {
		if (!this._yAxes) {
			this._yAxes = new List<Axis<this["_yAxisRendererType"]>>();
			this._yAxes.events.on("inserted", this.processYAxis, this, false);
			this._yAxes.events.on("removed", this.handleAxisRemoval, this, false);
		}

		return this._yAxes;
	}

	/**
	 * Decorates a new [[XYSeries]] object with required parameters when it is
	 * added to the chart.
	 *
	 * @ignore Exclude from docs
	 * @param event  Event
	 */
	public handleSeriesAdded(event: IListEvents<XYSeries>["inserted"]): void {
		try {
			super.handleSeriesAdded(event);
			let series: XYSeries = event.newValue;

			if (this.xAxes.length == 0 || this.yAxes.length == 0) {
				registry.removeFromInvalidComponents(series);
				series.dataInvalid = false;
			}

			$utils.used(series.xAxis); // this is enough to get axis, handled in getter
			$utils.used(series.yAxis); // this is enough to get axis, handled in getter

			series.maskBullets = series.maskBullets;

			if (series.fill == undefined) {
				if (this.patterns) {
					if (!$type.hasValue(series.stroke)) {
						series.stroke = this.colors.next();
					}
					series.fill = this.patterns.next();
					if ($type.hasValue(series.fillOpacity)) {
						series.fill.backgroundOpacity = series.fillOpacity;
					}
					if (series.stroke instanceof Color) {
						series.fill.stroke = series.stroke;
						series.fill.fill = series.stroke;
					}
				}
				else {
					series.fill = this.colors.next();
				}
			}

			if (!$type.hasValue(series.stroke)) {
				series.stroke = series.fill;
			}
		}
		catch (e) {
			this.raiseCriticalError(e);
		}
	}

	/**
	 * Chart's [[Cursor]].
	 *
	 * @param cursor  Cursor
	 */
	public set cursor(cursor: this["_cursor"]) {
		if (this._cursor != cursor) {
			if (this._cursor) {
				this.removeDispose(this._cursor);
			}

			this._cursor = cursor;

			if (cursor) {
				// TODO this is wrong, fix it
				this._disposers.push(cursor);
				cursor.chart = this;
				cursor.shouldClone = false;
				cursor.parent = this._cursorContainer;
				cursor.events.on("cursorpositionchanged", this.handleCursorPositionChange, this, false);
				cursor.events.on("zoomstarted", this.handleCursorZoomStart, this, false);
				cursor.events.on("zoomended", this.handleCursorZoomEnd, this, false);
				cursor.events.on("panstarted", this.handleCursorPanStart, this, false);
				cursor.events.on("panning", this.handleCursorPanning, this, false);
				cursor.events.on("panended", this.handleCursorPanEnd, this, false);
				cursor.events.on("behaviorcanceled", this.handleCursorCanceled, this, false);
				cursor.events.on("hidden", this.handleHideCursor, this, false);
				cursor.zIndex = Number.MAX_SAFE_INTEGER - 1;

				if (this.tapToActivate) {
					// We need this in order to setup cursor properly
					this.setTapToActivate(this.tapToActivate);
				}
			}
		}
	}

	/**
	 * @return Cursor
	 */
	public get cursor(): this["_cursor"] {
		return this._cursor;
	}

	/**
	 * Performs tasks when the cursor's position changes, e.g. shows proper
	 * tooltips on axes and series.
	 *
	 * @ignore Exclude from docs
	 */
	public handleCursorPositionChange(): void {

		let cursor = this.cursor;

		if (cursor.visible && !cursor.isHiding) {
			let xPosition: number = this.cursor.xPosition;
			let yPosition: number = this.cursor.yPosition;

			this.showSeriesTooltip({
				x: xPosition,
				y: yPosition
			});

			let exceptAxis: Axis;
			let snapToSeries = cursor.snapToSeries;
			if (snapToSeries) {
				if (snapToSeries.baseAxis == snapToSeries.xAxis) {
					exceptAxis = snapToSeries.yAxis;
				}
				if (snapToSeries.baseAxis == snapToSeries.yAxis) {
					exceptAxis = snapToSeries.xAxis;
				}

				let xAxis = snapToSeries.xAxis;
				let yAxis = snapToSeries.yAxis;

				if (xAxis instanceof ValueAxis && !(xAxis instanceof DateAxis) && yAxis instanceof ValueAxis && !(yAxis instanceof DateAxis)) {
					let closestDataItem: XYSeriesDataItem;
					let minDistance: number = Infinity;

					snapToSeries.dataItems.each((dataItem) => {

						//let xxPosition = xAxis.toAxisPosition(xPosition);
						//let yyPosition = yAxis.toAxisPosition(xPosition);

						let dxPosition = xAxis.toGlobalPosition(xAxis.getPositionX(dataItem, "valueX")) * xAxis.axisFullLength;
						let dyPosition = yAxis.toGlobalPosition(yAxis.getPositionY(dataItem, "valueY")) * yAxis.axisFullLength;

						let distance = Math.sqrt(Math.pow(xPosition * xAxis.axisFullLength - dxPosition, 2) + Math.pow(yPosition * yAxis.axisFullLength - dyPosition, 2));

						if (distance < minDistance) {
							minDistance = distance;
							closestDataItem = dataItem;
						}
					})

					if (closestDataItem) {
						snapToSeries.showTooltipAtDataItem(closestDataItem);
					}
				}
			}
			this._seriesPoints = [];

			if (this._cursorXPosition != xPosition) {
				this.showAxisTooltip(this.xAxes, xPosition, exceptAxis);
			}
			if (this._cursorYPosition != yPosition) {
				this.showAxisTooltip(this.yAxes, yPosition, exceptAxis);
			}
			if (this.arrangeTooltips) {
				this.sortSeriesTooltips(this._seriesPoints);
			}
		}
	}

	/**
	 * Hides all cursor-related tooltips when the cursor itself is hidden.
	 *
	 * @ignore Exclude from docs
	 */
	public handleHideCursor(): void {
		this.hideObjectTooltip(this.xAxes);
		this.hideObjectTooltip(this.yAxes);
		this.hideObjectTooltip(this.series);
		this._cursorXPosition = undefined;
		this._cursorYPosition = undefined;

		this.updateSeriesLegend();
	}

	/**
	 * Updates values for each series' legend item.
	 *
	 * @ignore Exclude from docs
	 */
	public updateSeriesLegend(): void {
		$iter.each(this.series.iterator(), (series) => {
			series.updateLegendValue();
		});
	}

	/**
	 * Hides a tooltip for a list of objects.
	 *
	 * @ignore Exclude from docs
	 * @param sprites  A list of sprites to hide tooltip for
	 */
	public hideObjectTooltip(sprites: List<Sprite>): void {
		$iter.each(sprites.iterator(), (sprite) => {
			sprite.hideTooltip(0);
		});
	}

	/**
	 * Shows a tooltip for all chart's series, using specific coordinates as a
	 * reference point.
	 *
	 * The tooltip might be shown at different coordinates depending on the
	 * actual data point's position, overlapping with other tooltips, etc.
	 *
	 * @ignore Exclude from docs
	 * @param position  Reference point
	 */
	public showSeriesTooltip(position?: IPoint): void {

		if (!position) {
			this.series.each((series) => {
				series.hideTooltip();
			});
			return;
		}

		let seriesPoints: { point: IPoint, series: XYSeries }[] = [];

		this.series.each((series) => {
			//if (series.tooltipText || series.tooltipHTML) { // not good, bullets are not hovered then

			if ((series.xAxis instanceof DateAxis && series.xAxis.snapTooltip) || (series.yAxis instanceof DateAxis && series.yAxis.snapTooltip)) {
				// void
			}
			else {
				let point = series.showTooltipAtPosition(position.x, position.y);
				if (point) {
					series.tooltip.setBounds($utils.spriteRectToSvg({ x: 0, y: 0, width: this.pixelWidth, height: this.pixelHeight }, this));
					seriesPoints.push({ series: series, point: point });
				}
			}

			//}
		});

		if (this.arrangeTooltips) {
			this.sortSeriesTooltips(seriesPoints);
		}
	}


	/**
	 * @ignore
	 */
	public sortSeriesTooltips(seriesPoints: { point: IPoint, series: XYSeries }[]) {
		let cursor = this.cursor;

		if (cursor && $type.isNumber(cursor.maxTooltipDistance)) {

			let cursorPoint = $utils.spritePointToSvg({ x: cursor.point.x, y: cursor.point.y }, cursor);

			let nearestSeries: XYSeries;
			let nearestPoint: IPoint;
			let smallestDistance: number = Infinity;

			$array.each(seriesPoints, (seriesPoint) => {
				let series = seriesPoint.series;
				let fixedPoint = seriesPoint.point;
				if (fixedPoint) {
					let point = { x: fixedPoint.x, y: fixedPoint.y };

					let distance = Math.abs($math.getDistance(point, cursorPoint));
					if (distance < smallestDistance) {
						nearestPoint = point;
						smallestDistance = distance;
						nearestSeries = series;
					}
				}
			})
			let newSeriesPoints: { point: IPoint, series: XYSeries }[] = [];
			if (nearestSeries) {
				$array.each(seriesPoints, (seriesPoint) => {
					if (Math.abs($math.getDistance(seriesPoint.point, nearestPoint)) <= cursor.maxTooltipDistance) {
						newSeriesPoints.push({ series: seriesPoint.series, point: seriesPoint.point });
					}
					else {
						seriesPoint.series.tooltip.hide(0);
					}
				})

			}
			seriesPoints = newSeriesPoints;
		}


		let topLeft = $utils.spritePointToSvg({ x: -0.5, y: -0.5 }, this.plotContainer);
		let bottomRight = $utils.spritePointToSvg({ x: this.plotContainer.pixelWidth + 0.5, y: this.plotContainer.pixelHeight + 0.5 }, this.plotContainer);

		let sum = 0;
		let filteredSeriesPoints: { point: IPoint, series: XYSeries }[] = [];
		$array.each(seriesPoints, (seriesPoint) => {
			let point = seriesPoint.point;
			if (point && $math.isInRectangle(point, { x: topLeft.x, y: topLeft.y, width: bottomRight.x - topLeft.x, height: bottomRight.y - topLeft.y })) {
				filteredSeriesPoints.push({ point: point, series: seriesPoint.series });
				sum += point.y;
			}
		})

		seriesPoints = filteredSeriesPoints;

		let firstSeries = this.series.getIndex(0);
		let inversed = false;
		if (firstSeries && firstSeries.yAxis && firstSeries.yAxis.renderer.inversed) {
			inversed = true;
		}

		if (inversed) {
			seriesPoints.sort((a, b) => $number.order(a.point.y, b.point.y))
		}
		else {
			seriesPoints.sort((a, b) => $number.order(b.point.y, a.point.y))
			seriesPoints.reverse();
		}

		let averageY = sum / seriesPoints.length;
		let maxY = $utils.svgPointToDocument({ x: 0, y: 0 }, this.svgContainer.SVGContainer).y;

		if (seriesPoints.length > 0) {

			let top = topLeft.y;
			let bottom = bottomRight.y;

			// TODO is this needed ?
			$utils.spritePointToDocument({ x: 0, y: top }, this);

			let dropped = false;

			if (averageY > top + (bottom - top) / 2) {
				let nextHeight = bottom;
				for (let i = seriesPoints.length - 1; i >= 0; i--) {
					let series = seriesPoints[i].series;

					let tooltip = series.tooltip;
					let pointY = seriesPoints[i].point.y;

					tooltip.setBounds({ x: 0, y: -maxY, width: this.pixelWidth, height: nextHeight + maxY });

					if (tooltip.invalid) {
						tooltip.validate();
					}

					tooltip.toBack();
					nextHeight = $utils.spritePointToSvg({ x: 0, y: tooltip.label.pixelY - tooltip.pixelY + pointY - tooltip.pixelMarginTop }, tooltip).y;

					if (nextHeight < -maxY) {
						dropped = true;
						break;
					}
				}
			}

			if (averageY <= top + (bottom - top) / 2 || dropped) {
				let nextY = top;
				for (let i = 0, len = seriesPoints.length; i < len; i++) {
					let series = seriesPoints[i].series;
					let pointY = seriesPoints[i].point.y;
					let tooltip = series.tooltip;
					tooltip.setBounds({ x: 0, y: nextY, width: this.pixelWidth, height: bottom });

					if (tooltip.invalid) {
						tooltip.validate();
					}

					tooltip.toBack();

					nextY = $utils.spritePointToSvg({ x: 0, y: tooltip.label.pixelY + tooltip.label.measuredHeight - tooltip.pixelY + pointY + tooltip.pixelMarginBottom }, tooltip).y;
				}
			}
		}
	}

	/**
	 * Shows tooltips for a list of axes at specific position.
	 *
	 * Position might be X coordinate for horizontal axes, and Y coordinate for
	 * vertical axes.
	 *
	 * @ignore Exclude from docs
	 * @param axes      List of axes to show tooltip on
	 * @param position  Position (px)
	 */
	public showAxisTooltip(axes: List<Axis>, position: number, except?: Axis): void {
		$iter.each(axes.iterator(), (axis) => {
			if (axis != except) {
				if (this.dataItems.length > 0 || axis.dataItems.length > 0) {
					axis.showTooltipAtPosition(position);
				}
			}
		});
	}

	/**
	 * Recalculates the value range for the axis taking into account zoom level & inversed.
	 *
	 * @param axis   Axis
	 * @param range  Range
	 * @return Modified range
	 */
	public getUpdatedRange(axis: Axis<this["_xAxisRendererType"]>, range: IRange): IRange {

		if (!axis) {
			return;
		}

		let start: number;
		let end: number;
		let inversed = axis.renderer.inversed;

		if (inversed) {
			$math.invertRange(range);

			start = 1 - axis.end;
			end = 1 - axis.start;
		}
		else {
			start = axis.start;
			end = axis.end;
		}

		let difference: number = end - start;

		return {
			start: start + range.start * difference,
			end: start + range.end * difference
		};
	}

	/**
	 * Performs zoom and other operations when user finishes zooming using chart
	 * cursor, e.g. zooms axes.
	 *
	 * @param event Cursor's event
	 */
	protected handleCursorZoomEnd(event: IXYCursorEvents["zoomended"]): void {
		let cursor: XYCursor = this.cursor;
		let behavior = cursor.behavior;
		if (behavior == "zoomX" || behavior == "zoomXY") {
			let xRange: IRange = cursor.xRange;
			if (xRange && this.xAxes.length > 0) {
				xRange = this.getUpdatedRange(this.xAxes.getIndex(0), xRange);
				xRange.priority = "start";
				this.zoomAxes(this.xAxes, xRange);
			}
		}

		if (behavior == "zoomY" || behavior == "zoomXY") {
			let yRange: IRange = cursor.yRange;
			if (yRange && this.yAxes.length > 0) {
				yRange = this.getUpdatedRange(this.yAxes.getIndex(0), yRange);
				yRange.priority = "start";
				this.zoomAxes(this.yAxes, yRange);
			}
		}

		this.handleHideCursor();
	}


	/**
	 * Performs zoom and other operations when user is panning chart plot using chart cursor.
	 *
	 * @param event Cursor's event
	 */
	protected handleCursorPanStart(event: IXYCursorEvents["panning"]): void {
		let xAxis = this.xAxes.getIndex(0);
		if (xAxis) {
			this._panStartXRange = { start: xAxis.start, end: xAxis.end };
		}

		let yAxis = this.yAxes.getIndex(0);
		if (yAxis) {
			this._panStartYRange = { start: yAxis.start, end: yAxis.end };
		}
	}

	/**
	 * Performs zoom and other operations when user ends panning
	 *
	 * @param event Cursor's event
	 */
	protected handleCursorPanEnd(event: IXYCursorEvents["panning"]): void {
		let cursor: XYCursor = this.cursor;
		let behavior = cursor.behavior;

		if (this._panEndXRange && (behavior == "panX" || behavior == "panXY")) {
			let panEndRange = this._panEndXRange;
			let delta = 0;

			if (panEndRange.start < 0) {
				delta = panEndRange.start;
			}
			if (panEndRange.end > 1) {
				delta = panEndRange.end - 1;
			}
			this.zoomAxes(this.xAxes, { start: panEndRange.start - delta, end: panEndRange.end - delta }, false, true);
			this._panEndXRange = undefined;
			this._panStartXRange = undefined;
		}
		if (this._panEndYRange && (behavior == "panY" || behavior == "panXY")) {
			let panEndRange = this._panEndYRange;

			let delta = 0;
			if (panEndRange.start < 0) {
				delta = panEndRange.start;
			}
			if (panEndRange.end > 1) {
				delta = panEndRange.end - 1;
			}

			this.zoomAxes(this.yAxes, { start: panEndRange.start - delta, end: panEndRange.end - delta }, false, true);
			this._panEndYRange = undefined;
			this._panStartYRange = undefined;
		}
	}

	protected handleCursorCanceled(): void {
		this._panEndXRange = undefined;
		this._panStartXRange = undefined;
	}

	/**
	 * Performs zoom and other operations when user is panning chart plot using chart cursor.
	 *
	 * @param event Cursor's event
	 */
	protected handleCursorPanning(event: IXYCursorEvents["panning"]): void {
		let cursor: XYCursor = this.cursor;
		let behavior = cursor.behavior;
		let maxPanOut = cursor.maxPanOut;
		if (this._panStartXRange && (behavior == "panX" || behavior == "panXY")) {
			let panStartRange = this._panStartXRange;
			let range = cursor.xRange;

			let axisRange = this.getCommonAxisRange(this.xAxes);

			let difference = (panStartRange.end - panStartRange.start);
			let delta = range.start * (axisRange.end - axisRange.start);

			let newStart = Math.max(-maxPanOut, delta + panStartRange.start);
			let newEnd = Math.min(delta + panStartRange.end, 1 + maxPanOut);

			if (newStart <= 0) {
				newEnd = newStart + difference;
			}

			if (newEnd >= 1) {
				newStart = newEnd - difference;
			}

			let newRange = {
				start: newStart,
				end: newEnd
			}
			this._panEndXRange = newRange;

			this.zoomAxes(this.xAxes, newRange, false, false, cursor.maxPanOut);
		}

		if (this._panStartYRange && (behavior == "panY" || behavior == "panXY")) {
			let panStartRange = this._panStartYRange;
			let range = cursor.yRange;

			let axisRange = this.getCommonAxisRange(this.yAxes);

			let difference = panStartRange.end - panStartRange.start;
			let delta = range.start * (axisRange.end - axisRange.start);

			let newStart = Math.max(-maxPanOut, delta + panStartRange.start);
			let newEnd = Math.min(delta + panStartRange.end, 1 + maxPanOut);

			if (newStart <= 0) {
				newEnd = newStart + difference;
			}

			if (newEnd >= 1) {
				newStart = newEnd - difference;
			}

			let newRange = {
				start: newStart,
				end: newEnd
			}
			this._panEndYRange = newRange;
			this.zoomAxes(this.yAxes, newRange, false, false, cursor.maxPanOut);
		}

		this.handleHideCursor();
	}

	/**
	 * @ignore
	 */
	public handleYAxisSet(series: XYSeries) {

	}

	/**
	 * Performs zoom and other operations when user starts zooming using chart
	 * cursor, e.g. zooms axes.
	 *
	 * @param event Cursor's event
	 */
	protected handleCursorZoomStart(event: IXYCursorEvents["zoomstarted"]): void {

		// Nothing here
		// This method is here only as a "placeholder" for extending classes to
		// override if necessary

	}

	/**
	 * Horizontal (X) scrollbar.
	 *
	 * @param scrollbar Scrollbar
	 */
	public set scrollbarX(scrollbar: Scrollbar) {
		if (this._scrollbarX) {
			this.removeDispose(this._scrollbarX);
		}
		this._scrollbarX = scrollbar;

		if (scrollbar) {
			this._disposers.push(scrollbar);
			scrollbar.parent = this.topAxesContainer;
			scrollbar.shouldClone = false;
			scrollbar.startGrip.exportable = false;
			scrollbar.endGrip.exportable = false;
			scrollbar.toBack();
			scrollbar.orientation = "horizontal";
			scrollbar.events.on("rangechanged", this.handleXScrollbarChange, this, false);
			// accessibility related
			scrollbar.adapter.add("positionValue", (arg) => {
				let xAxis = this.xAxes.getIndex(0);
				if (xAxis) {
					arg.value = xAxis.getPositionLabel(
						xAxis.renderer.inversed
							? 1 - arg.position
							: arg.position
					);
				}
				return arg;
			});
		}
	}

	/**
	 * @return Scrollbar
	 */
	public get scrollbarX(): Scrollbar {
		return this._scrollbarX;
	}

	/**
	 * Vertical (Y) scrollbar.
	 *
	 * @param scrollbar Scrollbar
	 */
	public set scrollbarY(scrollbar: Scrollbar) {
		if (this._scrollbarY) {
			this.removeDispose(this._scrollbarY);
		}
		this._scrollbarY = scrollbar;

		if (scrollbar) {
			this._disposers.push(scrollbar);
			scrollbar.parent = this.rightAxesContainer;
			scrollbar.startGrip.exportable = false;
			scrollbar.shouldClone = false;
			scrollbar.endGrip.exportable = false;
			scrollbar.toFront();
			scrollbar.orientation = "vertical";
			scrollbar.events.on("rangechanged", this.handleYScrollbarChange, this, false);
			// accessibility related
			scrollbar.adapter.add("positionValue", (arg) => {
				let yAxis = this.yAxes.getIndex(0);
				if (yAxis) {
					arg.value = yAxis.getPositionLabel(arg.position);
				}
				return arg;
			});
		}
	}

	/**
	 * @return Scrollbar
	 */
	public get scrollbarY(): Scrollbar {
		return this._scrollbarY;
	}

	/**
	 * Zooms axes affected by the horizontal (X) scrollbar when the selection
	 * on it changes.
	 *
	 * @param event Scrollbar range change event
	 */
	protected handleXScrollbarChange(event: AMEvent<Scrollbar, IScrollbarEvents>["rangechanged"]): void {

		if (this.inited) {
			let scrollbar: Scrollbar = event.target;
			let range = scrollbar.range;

			if (range.start == 0) {
				range.priority = "start";
			}

			if (range.end == 1) {
				range.priority = "end";
			}

			range = this.zoomAxes(this.xAxes, range);

			scrollbar.fixRange(range);
		}
	}

	/**
	 * Zooms axes affected by the vertical (Y) scrollbar when the selection
	 * on it changes.
	 *
	 * @param event Scrollbar range change event
	 */
	protected handleYScrollbarChange(event: AMEvent<Scrollbar, IScrollbarEvents>["rangechanged"]): void {
		if (this.inited) {
			let scrollbar: Scrollbar = event.target;
			let range = scrollbar.range;
			if (range.end == 1) {
				range.priority = "end";
			}
			if (range.start == 0) {
				range.priority = "start";
			}
			range = this.zoomAxes(this.yAxes, range);
			scrollbar.fixRange(range);
		}

	}

	/**
	 * Zooms axes that are affected by to specific relative range.
	 *
	 * @param axes       List of axes to zoom
	 * @param range      Range of values to zoom to (0-1)
	 * @param instantly  If set to `true` will skip zooming animation
	 * @return Recalculated range that is common to all involved axes
	 */
	protected zoomAxes(axes: List<Axis<this["_xAxisRendererType"]>>, range: IRange, instantly?: boolean, round?: boolean, declination?: number): IRange {
		let realRange: IRange = { start: 0, end: 1 };

		this.showSeriesTooltip(); // hides

		if (!this.dataInvalid) {
			$iter.each(axes.iterator(), (axis) => {
				if (axis.renderer.inversed) {
					range = $math.invertRange(range);
				}

				axis.hideTooltip(0);

				if (round) {
					//let diff = range.end - range.start;
					if (axis instanceof CategoryAxis) {
						let cellWidth = axis.getCellEndPosition(0) - axis.getCellStartPosition(0);

						range.start = axis.roundPosition(range.start + cellWidth / 2 - (axis.startLocation) * cellWidth, axis.startLocation);
						range.end = axis.roundPosition(range.end - cellWidth / 2 + (1 - axis.endLocation) * cellWidth, axis.endLocation);
					}
					else {
						range.start = axis.roundPosition(range.start + 0.0001, 0, axis.startLocation);
						range.end = axis.roundPosition(range.end + 0.0001, 0, axis.endLocation);
					}
				}

				let axisRange: IRange = axis.zoom(range, instantly, instantly, declination);

				if (axis.renderer.inversed) {
					axisRange = $math.invertRange(axisRange);
				}

				realRange = axisRange;
			});
		}
		return realRange;
	}

	/**
	 * Indicates if bullet container is masked.
	 *
	 * If it is set to `true`, any bullets that do not fit into bullet container
	 * will be clipped off. Settting to `false` will allow bullets to "spill out"
	 * of the plot area so they are not cut off.
	 *
	 * @param value Mask bullet container?
	 */
	public set maskBullets(value: boolean) {
		if (this.setPropertyValue("maskBullets", value, true) && this.bulletsContainer) {
			if (value) {
				this.bulletsContainer.mask = this._bulletMask;
			}
			else {
				this.bulletsContainer.mask = undefined;
			}
		}
	}

	/**
	 * @return Mask bullet container?
	 */
	public get maskBullets(): boolean {
		return this.getPropertyValue("maskBullets");
	}

	/**
	 * Indicates if chart should arrange series tooltips so that they would not
	 * overlap.
	 *
	 * If set to `true` (default), the chart will adjust vertical positions of
	 * all simultaneously shown tooltips to avoid overlapping.
	 *
	 * However, if you have a vertically-arranged chart, it might not make sense,
	 * because tooltips would most probably not be aligned horizontally. In this
	 * case it would probably be a good idea to set this setting to `false`.
	 *
	 * @default true
	 * @param value Arrange tooltips?
	 */
	public set arrangeTooltips(value: boolean) {
		this.setPropertyValue("arrangeTooltips", value, true);
	}

	/**
	 * @return Arrange tooltips?
	 */
	public get arrangeTooltips(): boolean {
		return this.getPropertyValue("arrangeTooltips");
	}


	/**
	 * Handles mouse wheel event.
	 *
	 * @param event  Original event
	 */
	protected handleWheel(event: AMEvent<Sprite, ISpriteEvents>["wheel"]) {
		let plotContainer = this.plotContainer;
		let svgPoint: IPoint = $utils.documentPointToSvg(event.point, this.htmlContainer, this.svgContainer.cssScale);
		let plotPoint = $utils.svgPointToSprite(svgPoint, plotContainer);
		let shift = event.shift.y;

		this.handleWheelReal(shift, this.mouseWheelBehavior, plotPoint);
	}


	/**
	 * Handles mouse wheel event.
	 *
	 * @param event  Original event
	 */
	protected handleHorizontalWheel(event: AMEvent<Sprite, ISpriteEvents>["wheel"]) {
		let plotContainer = this.plotContainer;
		let svgPoint: IPoint = $utils.documentPointToSvg(event.point, this.htmlContainer, this.svgContainer.cssScale);
		let plotPoint = $utils.svgPointToSprite(svgPoint, plotContainer);

		this.handleWheelReal(event.shift.x, this.horizontalMouseWheelBehavior, plotPoint)

	}

	/**
	 * @ignore
	 */
	protected handleWheelReal(shift: number, mouseWheelBehavior: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none", plotPoint: IPoint) {
		if (shift != 0) {
			let plotContainer = this.plotContainer;

			let rangeX: IRange = this.getCommonAxisRange(this.xAxes);
			let rangeY: IRange = this.getCommonAxisRange(this.yAxes);

			let shiftStep = 0.1;

			let maxPanOut = 0;

			if (mouseWheelBehavior == "panX" || mouseWheelBehavior == "panXY") {

				let differenceX = rangeX.end - rangeX.start;

				let newStartX = Math.max(-maxPanOut, rangeX.start + shiftStep * shift / 100 * (rangeX.end - rangeX.start));
				let newEndX = Math.min(rangeX.end + shiftStep * shift / 100 * (rangeX.end - rangeX.start), 1 + maxPanOut);

				if (newStartX <= 0) {
					newEndX = newStartX + differenceX;
				}

				if (newEndX >= 1) {
					newStartX = newEndX - differenceX;
				}

				this.zoomAxes(this.xAxes, { start: newStartX, end: newEndX });
			}

			if (mouseWheelBehavior == "panY" || mouseWheelBehavior == "panXY") {
				shift *= -1;
				let differenceY = rangeY.end - rangeY.start;

				let newStartY = Math.max(-maxPanOut, rangeY.start + shiftStep * shift / 100 * (rangeY.end - rangeY.start));
				let newEndY = Math.min(rangeY.end + shiftStep * shift / 100 * (rangeY.end - rangeY.start), 1 + maxPanOut);

				if (newStartY <= 0) {
					newEndY = newStartY + differenceY;
				}

				if (newEndY >= 1) {
					newStartY = newEndY - differenceY;
				}

				this.zoomAxes(this.yAxes, { start: newStartY, end: newEndY });
			}

			if (mouseWheelBehavior == "zoomX" || mouseWheelBehavior == "zoomXY") {
				let locationX = plotPoint.x / plotContainer.maxWidth;

				let location2X = this.xAxes.getIndex(0).toAxisPosition(locationX);

				let newStartX = Math.max(-maxPanOut, rangeX.start - shiftStep * (rangeX.end - rangeX.start) * shift / 100 * locationX);
				newStartX = Math.min(newStartX, location2X);

				let newEndX = Math.min(rangeX.end + shiftStep * (rangeX.end - rangeX.start) * shift / 100 * (1 - locationX), 1 + maxPanOut);
				newEndX = Math.max(newEndX, location2X);

				this.zoomAxes(this.xAxes, { start: newStartX, end: newEndX });
			}

			if (mouseWheelBehavior == "zoomY" || mouseWheelBehavior == "zoomXY") {
				let locationY = plotPoint.y / plotContainer.maxHeight;

				let location2Y = this.yAxes.getIndex(0).toAxisPosition(locationY);

				let newStartY = Math.max(-maxPanOut, rangeY.start - shiftStep * (rangeY.end - rangeY.start) * shift / 100 * (1 - locationY));
				newStartY = Math.min(newStartY, location2Y);

				let newEndY = Math.min(rangeY.end + shiftStep * shift / 100 * locationY * (rangeY.end - rangeY.start), 1 + maxPanOut);
				newEndY = Math.max(newEndY, location2Y);

				this.zoomAxes(this.yAxes, { start: newStartY, end: newEndY });
			}
		}
	}

	/**
	 * Specifies action for when mouse wheel is used when over the chart.
	 *
	 * Options: Options: `"zoomX"`, `"zoomY"`, `"zoomXY"`, `"panX"`, `"panY"`,`"panXY"`, `"none"` (default).
	 *
	 * You can control sensitivity of wheel zooming via `mouseOptions`.
	 *
	 * @default "none"
	 * @see {@link https://www.amcharts.com/docs/v4/reference/sprite/#mouseOptions_property} More information about `mouseOptions`
	 * @param mouse wheel behavior
	 */
	public set mouseWheelBehavior(value: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none") {

		if (this.setPropertyValue("mouseWheelBehavior", value)) {
			if (value != "none") {
				this._mouseWheelDisposer = this.plotContainer.events.on("wheel", this.handleWheel, this, false);
				this._disposers.push(this._mouseWheelDisposer);
			}
			else {
				if (this._mouseWheelDisposer) {
					this.plotContainer.wheelable = false;
					this.plotContainer.hoverable = false;
					this._mouseWheelDisposer.dispose();
				}
			}
		}
	}

	/**
	 * @return Mouse wheel behavior
	 */
	public get mouseWheelBehavior(): "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none" {
		return this.getPropertyValue("mouseWheelBehavior");
	}

	/**
	 * Specifies action for when horizontal mouse wheel is used when over the chart.
	 *
	 * Options: Options: `"zoomX"`, `"zoomY"`, `"zoomXY"`, `"panX"`, `"panY"`, `"panXY"`, `"none"` (default).
	 *
	 * @default "none"
	 * @see {@link https://www.amcharts.com/docs/v4/reference/sprite/#mouseOptions_property} More information about `mouseOptions`
	 * @param mouse wheel behavior
	 */
	public set horizontalMouseWheelBehavior(value: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none") {

		if (this.setPropertyValue("horizontalMouseWheelBehavior", value)) {
			if (value != "none") {
				this._mouseWheelDisposer2 = this.plotContainer.events.on("wheel", this.handleHorizontalWheel, this, false);
				this._disposers.push(this._mouseWheelDisposer2);
			}
			else {
				if (this._mouseWheelDisposer2) {
					this.plotContainer.wheelable = false;
					this.plotContainer.hoverable = false;
					this._mouseWheelDisposer2.dispose();
				}
			}
		}
	}

	/**
	 * @return Horizontal mouse wheel behavior
	 */
	public get horizontalMouseWheelBehavior(): "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none" {
		return this.getPropertyValue("horizontalMouseWheelBehavior");
	}

	/**
	 * This function is called by the [[DataSource]]'s `dateFields` adapater
	 * so that particular chart types can popuplate this setting with their
	 * own type-specific data fields so they are parsed properly.
	 *
	 * @param fields  Array of date fields
	 * @return Array of date fields populated with chart's date fields
	 */
	protected dataSourceDateFields(fields: string[]): string[] {
		// Process parent
		fields = super.dataSourceDateFields(fields);

		// Check if we have any series with date-fields
		$iter.each(this.series.iterator(), (series: this["_seriesType"]) => {
			fields = this.populateDataSourceFields(
				fields,
				<any>series.dataFields,
				["dateX", "dateY", "openDateX", "openDateY"]
			);
		});

		return fields;
	}

	/**
	 * This function is called by the [[DataSource]]'s `numberFields` adapater
	 * so that particular chart types can popuplate this setting with their
	 * own type-specific data fields so they are parsed properly.
	 *
	 * @param value  Array of number fields
	 * @return Array of number fields populated with chart's number fields
	 */
	protected dataSourceNumberFields(fields: string[]): string[] {
		fields = super.dataSourceDateFields(fields);

		// Check if we have any series with date-fields
		$iter.each(this.series.iterator(), (series: this["_seriesType"]) => {
			fields = this.populateDataSourceFields(
				fields,
				<any>series.dataFields,
				["valueX", "valueY", "openValueX", "openValueY"]
			);
		});

		return fields;
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Save axis ranges for later processing
			let xAxes: any[] = [];
			let yAxes: any[] = [];

			// Set up axes
			if ($type.hasValue(config.xAxes) && $type.isArray(config.xAxes)) {
				for (let i = 0, len = config.xAxes.length; i < len; i++) {
					if (!config.xAxes[i].type) {
						throw Error("[XYChart error] No type set for xAxes[" + i + "].");
					}
					else if ($type.hasValue(config.xAxes[i]["axisRanges"])) {

						// Maybe convert string dates?
						for (let x = 0, len = config.xAxes[i]["axisRanges"].length; x < len; x++) {
							let range = config.xAxes[i]["axisRanges"][x];
							if ($type.hasValue(range.date) && $type.isString(range.date)) {
								range.date = this.dateFormatter.parse(range.date);
							}
							if ($type.hasValue(range.endDate) && $type.isString(range.endDate)) {
								range.endDate = this.dateFormatter.parse(range.endDate);
							}
						}

						xAxes.push({
							axisRanges: config.xAxes[i]["axisRanges"],
							index: i
						});
						delete (config.xAxes[i]["axisRanges"]);
					}
				}
			}
			if ($type.hasValue(config.yAxes) && $type.isArray(config.yAxes)) {
				for (let i = 0, len = config.yAxes.length; i < len; i++) {
					if (!config.yAxes[i].type) {
						throw Error("[XYChart error] No type set for yAxes[" + i + "].");
					}
					else if ($type.hasValue(config.yAxes[i]["axisRanges"])) {

						// Maybe convert string dates?
						for (let x = 0, len = config.yAxes[i]["axisRanges"].length; x < len; x++) {
							let range = config.yAxes[i]["axisRanges"][x];
							if ($type.hasValue(range.date) && $type.isString(range.date)) {
								range.date = this.dateFormatter.parse(range.date);
							}
							if ($type.hasValue(range.endDate) && $type.isString(range.endDate)) {
								range.endDate = this.dateFormatter.parse(range.endDate);
							}
						}

						yAxes.push({
							axisRanges: config.yAxes[i]["axisRanges"],
							index: i
						});
						delete (config.yAxes[i]["axisRanges"]);
					}
				}
			}

			// Set up series
			if ($type.hasValue(config.series) && $type.isArray(config.series)) {
				for (let i = 0, len = config.series.length; i < len; i++) {
					config.series[i].type = config.series[i].type || "LineSeries";
				}
			}

			// Set up cursor
			if ($type.hasValue(config.cursor) && !$type.hasValue(config.cursor.type)) {
				config.cursor.type = "XYCursor";
			}

			// Set up scrollbars
			if ($type.hasValue(config.scrollbarX) && !$type.hasValue(config.scrollbarX.type)) {
				config.scrollbarX.type = "Scrollbar";
			}

			if ($type.hasValue(config.scrollbarY) && !$type.hasValue(config.scrollbarY.type)) {
				config.scrollbarY.type = "Scrollbar";
			}

			super.processConfig(config);

			// Finish up with ranges.
			// We need to do this here because series are processed last in JSON
			// config. Therefore their respective objects are not yet are available
			// when axis (and respectively their ranges) are being processed.
			if (yAxes.length) {
				for (let i = 0, len = yAxes.length; i < len; i++) {
					this.yAxes.getIndex(yAxes[i].index).config = {
						axisRanges: yAxes[i].axisRanges
					};
				}
			}
			if (xAxes.length) {
				for (let i = 0, len = xAxes.length; i < len; i++) {
					this.xAxes.getIndex(xAxes[i].index).config = {
						axisRanges: xAxes[i].axisRanges
					};
				}
			}
		}

	}

	/**
	 * This function is used to sort element's JSON config properties, so that
	 * some properties that absolutely need to be processed last, can be put at
	 * the end.
	 *
	 * @ignore Exclude from docs
	 * @param a  Element 1
	 * @param b  Element 2
	 * @return Sorting number
	 */
	protected configOrder(a: string, b: string): Ordering {
		if (a == b) {
			return 0;
		}
		// Must come last
		else if (a == "scrollbarX") {
			return 1;
		}
		else if (b == "scrollbarX") {
			return -1;
		}
		else if (a == "scrollbarY") {
			return 1;
		}
		else if (b == "scrollbarY") {
			return -1;
		}
		else if (a == "cursor") {
			return 1;
		}
		else if (b == "cursor") {
			return -1;
		}
		else if (a == "series") {
			return 1;
		}
		else if (b == "series") {
			return -1;
		}
		else {
			return super.configOrder(a, b);
		}
	}

	/**
	 * Creates a new Series of type suitable for this chart.
	 *
	 * @return New series
	 */
	protected createSeries(): this["_seriesType"] {
		return new XYSeries();
	}

	/**
	 * A [[Button]] element that is used for zooming out the chart.
	 *
	 * This button appears only when chart is zoomed in, and disappears
	 * autoamatically when it is zoome dout.
	 *
	 * @param button  Zoom out button
	 */
	public set zoomOutButton(button: Button) {
		this._zoomOutButton = button;
		if (button) {
			button.events.on("hit", () => {
				this.zoomAxes(this.xAxes, { start: 0, end: 1 });
				this.zoomAxes(this.yAxes, { start: 0, end: 1 });
			}, undefined, false);
		}
	}

	/**
	 * @return Zoom out button
	 */
	public get zoomOutButton(): Button {
		return this._zoomOutButton;
	}


	/**
	 * Copies all parameters from another [[XYChart]].
	 *
	 * @param source Source XYChart
	 */
	public copyFrom(source: this) {

		source.xAxes.each((axis) => {
			this.xAxes.push(axis.clone());
		})

		source.yAxes.each((axis) => {
			this.yAxes.push(axis.clone());
		})

		//this.xAxes.copyFrom(source.xAxes);
		//this.yAxes.copyFrom(source.yAxes);

		super.copyFrom(source);

		//this.zoomOutButton.copyFrom(source.zoomOutButton);

		if (source.cursor) {
			this.cursor = source.cursor.clone();
		}

		if (source.scrollbarX) {
			this.scrollbarX = source.scrollbarX.clone();
		}

		if (source.scrollbarY) {
			this.scrollbarY = source.scrollbarY.clone();
		}
		//@todo copy all container properties
	}

	/**
	 * @ignore
	 */
	public disposeData() {
		super.disposeData();

		let scrollbarX = this.scrollbarX;
		if (scrollbarX && scrollbarX instanceof XYChartScrollbar) {
			scrollbarX.scrollbarChart.disposeData();
		}

		let scrollbarY = this.scrollbarY;
		if (scrollbarY && scrollbarY instanceof XYChartScrollbar) {
			scrollbarY.scrollbarChart.disposeData();
		}

		this.xAxes.each((axis) => {
			axis.disposeData();
		})

		this.yAxes.each((axis) => {
			axis.disposeData();
		})
	}

	/**
	 * Adds one or several (array) of data items to the existing data.
	 *
	 * @param rawDataItem One or many raw data item objects
	 */
	public addData(rawDataItem: Object | Object[], removeCount?: number): void {
		if (this.scrollbarX instanceof XYChartScrollbar) {
			this.addScrollbarData(this.scrollbarX, removeCount);
		}
		if (this.scrollbarY instanceof XYChartScrollbar) {
			this.addScrollbarData(this.scrollbarY, removeCount);
		}

		super.addData(rawDataItem, removeCount);
	}

	/**
	 * @ignore
	 */
	protected addScrollbarData(scrollbar: XYChartScrollbar, removeCount: number) {
		let chart = scrollbar.scrollbarChart;
		chart._parseDataFrom = chart.data.length;
		chart.invalidateData();
	}

	/**
	 * @ignore
	 */
	protected removeScrollbarData(scrollbar: XYChartScrollbar, removeCount: number) {
		let chart = scrollbar.scrollbarChart;
		if ($type.isNumber(removeCount)) {
			while (removeCount > 0) {
				let dataItem = this.dataItems.getIndex(0);
				if (dataItem) {
					chart.dataItems.remove(dataItem);
				}

				chart.dataUsers.each((dataUser) => {
					let dataItem = dataUser.dataItems.getIndex(0);
					if (dataItem) {
						dataUser.dataItems.remove(dataItem);
					}
				});

				chart._parseDataFrom--;

				removeCount--;
			}

			chart.invalidateData();
		}
	}

	/**
	 * Removes elements from the beginning of data
	 *
	 * @param count number of elements to remove
	 */
	public removeData(count: $type.Optional<number>) {
		if (this.scrollbarX instanceof XYChartScrollbar) {
			this.removeScrollbarData(this.scrollbarX, count);
		}
		if (this.scrollbarY instanceof XYChartScrollbar) {
			this.removeScrollbarData(this.scrollbarY, count);
		}

		super.removeData(count);
	}

	/**
	 * @param  value  Tap to activate?
	 */
	protected setTapToActivate(value: boolean): void {
		super.setTapToActivate(value);
		if (this.cursor) {
			this.cursor.interactions.isTouchProtected = value;
			this.plotContainer.interactions.isTouchProtected = value;
		}
	}

	protected handleTapToActivate(): void {
		super.handleTapToActivate();
		if (this.cursor) {
			this.cursor.interactions.isTouchProtected = false;
			this.plotContainer.interactions.isTouchProtected = false;
		}
	}

	protected handleTapToActivateDeactivation(): void {
		super.handleTapToActivateDeactivation();
		if (this.cursor) {
			this.cursor.interactions.isTouchProtected = true;
			this.plotContainer.interactions.isTouchProtected = true;
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYChart"] = XYChart;

/**
 * Add default responsive rules
 */

/**
 * Remove horizontal scrollbar on narrow charts.
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.maybeXS,
	state: function(target, stateId) {
		if (target instanceof XYChart && target.scrollbarX) {
			let state = target.states.create(stateId);
			let sbstate = target.scrollbarX.states.create(stateId);
			sbstate.properties.disabled = true;
			return state;
		}

		return null;
	}
});

/**
 * Remove vertical scrollbar on short charts.
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.maybeXS,
	state: function(target, stateId) {
		if (target instanceof XYChart && target.scrollbarY) {
			let state = target.states.create(stateId);
			let sbstate = target.scrollbarY.states.create(stateId);
			sbstate.properties.disabled = true;
			return state;
		}

		return null;
	}
});
