/**
 * Module for building 3D serial charts.
 */

/**
 * ============================================================================
 * Imports
 * ============================================================================
 * @hidden
 */
import { XYChart, IXYChartProperties, IXYChartDataFields, IXYChartAdapters, IXYChartEvents, XYChartDataItem } from "../../charts/types/XYChart";
import { XYSeries } from "../../charts/series/XYSeries";
import { registry } from "../../core/Registry";
import { StockPanel } from "./StockPanel";
import { List, IListEvents } from "../../core/utils/List";
import { Axis } from "../../charts/axes/Axis";
import { AxisRenderer } from "../../charts/axes/AxisRenderer";
import { Legend } from "../../charts/Legend";
import { Container } from "../../core/Container";
import { Sprite } from "../../core/Sprite";
import { percent } from "../../core/utils/Percent";
import * as $utils from "../../core/utils/Utils";
import * as $path from "../../core/rendering/Path";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[StockChart]].
 *
 * @see {@link DataItem}
 */
export class StockChartDataItem extends XYChartDataItem {

	constructor() {
		super();
		this.className = "StockChartDataItem";
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
 * Defines data fields for [[StockChart]].
 */
export interface IStockChartDataFields extends IXYChartDataFields { }

/**
 * Defines available properties for [[StockChart]].
 */
export interface IStockChartProperties extends IXYChartProperties { }

/**
 * Defines events for [[StockChart]].
 */
export interface IStockChartEvents extends IXYChartEvents { }

/**
 * Defines adapters for [[StockChart]].
 *
 * @see {@link Adapter}
 */
export interface IStockChartAdapters extends IXYChartAdapters, IStockChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a 3D XY chart.
 *
 * @see {@link IStockChartEvents} for a list of available Events
 * @see {@link IStockChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/} for documentation
 * @important
 */
export class StockChart extends XYChart {

	/**
	 * Available data fields.
	 */
	public _dataFields: IStockChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IStockChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IStockChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IStockChartEvents;

	protected _panels: List<StockPanel>

	public panelsContainer: Container;

	protected _plotMask:Sprite;

	/**
	 * Constructor
	 */
	constructor() {
		// Init
		super();
		this.className = "StockChart";

		let panelsContainer = this.yAxesAndPlotContainer.createChild(Container);
		panelsContainer.isMeasured = false;
		panelsContainer.layout = "vertical";
		panelsContainer.width = percent(100);
		panelsContainer.height = percent(100);		
		panelsContainer.events.on("layoutvalidated", this.updateMask, this, false);
		this.panelsContainer = panelsContainer;

		this.leftAxesContainer.parent = undefined;
		this.rightAxesContainer.parent = undefined;

		this.zoomOutButton.disabled = true;

		this._plotMask = panelsContainer.createChild(Sprite);

		// Apply theme
		this.applyTheme();
	}

	// @todo mm
	public get panels(): List<StockPanel> {
		if (!this._panels) {
			this._panels = new List<StockPanel>();
			this._panels.events.on("inserted", this.handlePanelAdded, this, false);
			this._panels.events.on("removed", this.handlePanelRemoved, this, false);
		}

		return this._panels;
	}

	protected updateMask(){
		let path = ""
		this.panels.each((panel)=>{
			let c = panel.yAxesAndPlotContainer;
			let x = c.pixelX;
			let y = c.pixelY;

			let point = $utils.spritePointToSprite({x:x, y:y}, panel, this.panelsContainer);

			x = point.x;
			y = point.y;

			let w = c.measuredWidth;
			let h = c.measuredHeight;			
			path += $path.moveTo({x:x, y: y});
			path += $path.lineTo({x:x + w, y: y});
			path += $path.lineTo({x:x + w, y: y + h});
			path += $path.lineTo({x:x, y: y + h});
			path += $path.lineTo({x:x, y: y});
		})

		this._plotMask.path = path;
		this.plotContainer.mask = this._plotMask;
	}


	public handlePanelAdded(event: IListEvents<StockPanel>["inserted"]): void {
		let panel = event.newValue;
		panel.chart = this;
		panel.parent = this.panelsContainer;
	}

	public handlePanelRemoved(event: IListEvents<StockPanel>["removed"]): void {
		let panel = event.oldValue;
		this.series.each((series)=>{
			if(panel.yAxes.indexOf(series.yAxis) != -1){
				this.series.removeValue(series);
			}
		})

		panel.yAxes.each((axis)=>{
			this.yAxes.removeValue(axis);
		})

		event.oldValue.dispose();
	}

	/**
	 * @ignore
	 */
	public handleYAxisSet(series: XYSeries) {
		let panel = this.getAxisPanel(series.yAxis);
		if (panel) {
			series.parent = panel.seriesContainer;
		}
	}


	/**
	 * Decorates an Axis for use with this chart, e.g. sets proper renderer
	 * and containers for placement.
	 *
	 * @param axis  Axis
	 */
	protected processAxis(axis: Axis): void {
		super.processAxis(axis);
		this.setAxisParent(axis);
	}



	protected setAxisParent(axis: Axis) {
		let panel = this.getAxisPanel(axis);
		if (panel) {
			if (axis.renderer.opposite) {
				axis.parent = panel.rightAxesContainer;
				axis.toBack();
			}
			else {
				axis.parent = panel.leftAxesContainer;
				axis.toFront();
			}

			axis.renderer.gridContainer.parent = panel.plotContainer;
			this._disposers.push(axis.events.on("sizechanged", this.updateXAxesMargins, this, false));
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
		this.setAxisParent(axis);
		if (axis.renderer) {
			axis.renderer.processRenderer();
		}
	}

	public getAxisPanel(axis: Axis) {
		if (this._panels) {
			let axisPanel: StockPanel;
			this._panels.each((panel) => {
				if (panel.yAxes.indexOf(axis) != -1) {
					axisPanel = panel;
				}
			})
			return axisPanel;
		}
	}


	/**
	 * Prepares the legend instance for use in this chart.
	 *
	 * @param legend  Legend
	 */
	protected setLegend(legend: Legend) {
		super.setLegend(legend);
		if (legend) {
			legend.itemContainers.template.paddingTop = 0;
			legend.itemContainers.template.paddingBottom = 0;
			legend.valign = "middle";
			legend.events.on("datavalidated", this.arrangeLegendItems, this, false);
		}
	}

	protected arrangeLegendItems() {
		if (this.legend) {
			this.legend.itemContainers.each((itemContainer) => {
				let dataItem = itemContainer.dataItem;
				let series = <XYSeries>dataItem.dataContext;

				let panel = this.getAxisPanel(series.yAxis);
				if (panel) {
					itemContainer.parent = panel.legendItemsContainer;
				}
			})
		}
	}

	/**
	 * Updates margins for horizontal axes based on settings and available space.
	 *
	 * @ignore Exclude from docs
	 */
	protected updateXAxesMargins(): void {

		let leftAxesWidth = 0;
		let rightAxesWidth = 0;

		this.yAxes.each((axis)=>{
			if(axis.renderer.opposite){
				if(axis.measuredWidth > rightAxesWidth){
					rightAxesWidth = axis.measuredWidth;
				}
			}
			else{
				if(axis.measuredWidth > leftAxesWidth){
					leftAxesWidth = axis.measuredWidth;
				}				
			}
		})

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

		this.panels.each((panel)=>{
			panel.leftAxesContainer.minWidth = leftAxesWidth;
			panel.rightAxesContainer.minWidth = rightAxesWidth;
			panel.headerContainer.paddingLeft = leftAxesWidth;
			panel.headerContainer.paddingRight = rightAxesWidth;
		})		

		this.leftAxesContainer.minWidth = leftAxesWidth;
		this.rightAxesContainer.minWidth = rightAxesWidth;
	}	
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StockChart"] = StockChart;
