/**
 * Module that defines everything related to building StockPanels.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { registry } from "../../core/Registry";
import { percent, Percent } from "../../core/utils/Percent";
import { Label } from "../../core/elements/Label";
import { List, IListEvents } from "../../core/utils/List";
import { CloseButton } from "../../core/elements/CloseButton";
import { MinimizeButton } from "../../core/elements/MinimizeButton";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { Axis } from "../../charts/axes/Axis";
import { AxisRendererY } from "../../charts/axes/AxisRendererY";
import { StockChart } from "./StockChart";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[StockPanel]].
 */
export interface IStockPanelProperties extends IContainerProperties {
	closeEnabled?: boolean;

	minimizeEnabled?: boolean;

	minimized?: boolean;
}

/**
 * Defines events for [[StockPanel]].
 */
export interface IStockPanelEvents extends IContainerEvents { }

/**
 * Defines adapters for [[StockPanel]].
 *
 * @see {@link Adapter}
 */
export interface IStockPanelAdapters extends IContainerAdapters, IStockPanelProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Class used to creates StockPanels.
 *
 * @see {@link IStockPanelEvents} for a list of available events
 * @see {@link IStockPanelAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export class StockPanel extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IStockPanelProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IStockPanelAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IStockPanelEvents;

	public headerContainer: Container;

	public legendItemsContainer: Container;

	public leftAxesContainer: Container;

	public rightAxesContainer: Container;

	public yAxesAndPlotContainer: Container;

	public plotContainer: Container;

	public seriesContainer: Container;

	public bulletsContainer: Container;

	public chart: StockChart;

	protected _title: Label;

	public closeButton: CloseButton;

	public minimizeButton: MinimizeButton;

	/**
	 * Defines the type of vertical axis renderer.
	 */
	public _yAxisRendererType: AxisRendererY;

	/**
	 * A list of vertical axes.
	 */
	protected _yAxes: List<Axis<this["_yAxisRendererType"]>>;

	protected _realHeight: number | Percent;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "StockPanel";
		this.layout = "vertical";

		let headerContainer = this.createChild(Container);
//		headerContainer.width = percent(100);
		headerContainer.layout = "horizontal";
		headerContainer.paddingTop = 12;
		headerContainer.paddingBottom = 6;
		headerContainer.background.fillOpacity = 1;
		headerContainer.background.fill = new InterfaceColorSet().getFor("background");
		this.headerContainer = headerContainer;

		let legendItemsContainer = headerContainer.createChild(Container);
		legendItemsContainer.layout = "grid";
		legendItemsContainer.valign = "middle";
		//legendItemsContainer.contentAlign = "right";

		this._disposers.push(headerContainer.events.on("over", (event) => {
			let chart = this.chart;
			if (chart && chart.cursor) {
				chart.cursor.__disabled = true;
			}
		}))

		this._disposers.push(headerContainer.events.on("out", (event) => {
			let chart = this.chart;
			if (chart && chart.cursor) {
				chart.cursor.__disabled = false;
			}
		}))

		this.legendItemsContainer = legendItemsContainer;

		let axesContainer = this.createChild(Container);
		axesContainer.width = percent(100);
		axesContainer.height = percent(100);
		axesContainer.layout = "horizontal";
		this.yAxesAndPlotContainer = axesContainer;

		let leftAxesContainer = axesContainer.createChild(Container);
		leftAxesContainer.height = percent(100);
		this.leftAxesContainer = leftAxesContainer;

		let plotContainer = axesContainer.createChild(Container);
		plotContainer.height = percent(100);
		plotContainer.width = percent(100);
		this.plotContainer = plotContainer;

		let seriesContainer = plotContainer.createChild(Container);
		this.seriesContainer = seriesContainer;

		let bulletsContainer = plotContainer.createChild(Container);
		this.bulletsContainer = bulletsContainer;

		let rightAxesContainer = axesContainer.createChild(Container);
		rightAxesContainer.height = percent(100);
		this.rightAxesContainer = rightAxesContainer;

		this.width = percent(100);
		this.height = percent(100);

		this.applyTheme();
	}


	/**
	 * A list of vertical (Y) axes.
	 *
	 * @return List of axes
	 */
	public get yAxes(): List<Axis<this["_yAxisRendererType"]>> {
		if (!this._yAxes) {
			this._yAxes = new List<Axis<this["_yAxisRendererType"]>>();
			this._yAxes.events.on("inserted", this.handleYAxisAdded, this, false);
			this._yAxes.events.on("removed", this.handleYAxisRemoved, this, false);
		}

		return this._yAxes;
	}

	public handleYAxisAdded(event: IListEvents<Axis>["inserted"]): void {
		if (this.chart) {
			let axis = event.newValue;
			this.chart.yAxes.push(axis);
			axis.renderer.inside = true;
			axis.renderer.baseGrid.disabled = true;
			axis.renderer.labels.template.verticalCenter = "bottom";
			axis.renderer.labels.template.padding(2, 2, 2, 2);
			axis.renderer.maxLabelPosition = 0.95;
			axis.relativePositionSprite = this.chart.panelsContainer;
		}
	}

	public handleYAxisRemoved(event: IListEvents<Axis>["removed"]): void {
		if (this.chart) {
			this.chart.handleAxisRemoval(event);
		}
	}

	public set title(title: Label) {
		if (title != this._title) {
			if (this._title) {
				this._title.dispose();
			}
			this._title = title;
			title.marginRight = 15;
			title.fontWeight = "bold";
			title.parent = this.headerContainer;

			title.toBack();
			this.legendItemsContainer.toFront();

			if (this.closeButton) {
				this.closeButton.toBack();
			}

			if (this.minimizeButton) {
				this.minimizeButton.toBack();
			}

			title.valign = "middle";
		}
	}

	public get title(): Label {
		return this._title;
	}

	public set closeEnabled(value: boolean) {
		if (this.setPropertyValue("closeEnabled", value)) {
			let closeButton = this.closeButton;
			if (value) {
				if (!closeButton) {
					let closeButton = this.headerContainer.createChild(CloseButton);
					closeButton.marginRight = 10;
					closeButton.toBack();

					this.closeButton = closeButton;
					closeButton.events.on("hit", () => {
						this.chart.panels.removeValue(this);
					})
				}
				else {
					closeButton.disabled = false;
				}
			}
			else {
				if (closeButton) {
					closeButton.disabled = true;
				}
			}
		}
	}

	public get closeEnabled(): boolean {
		return this.getPropertyValue("closeEnabled");
	}


	public set minimized(value: boolean) {
		if (this.setPropertyValue("minimized", value)) {
			if (value) {

				this._realHeight = this.height;
				this.minHeight = this.headerContainer.measuredHeight;
				let hiddenState = this.hiddenState;
				let animation = this.animate({ property: "height", to: this.minHeight }, hiddenState.transitionDuration, hiddenState.transitionEasing);
				animation.events.on("animationended", () => {
					this.yAxesAndPlotContainer.disabled = true;
				}, this, false);
				animation.events.on("animationprogress", this.parent.invalidateLayout, this.parent);

				let chart = this.chart;
				let hasMaximized = false;
				chart.panels.each((panel) => {
					if (!panel.minimized) {
						hasMaximized = true;
					}
				})

				if (!hasMaximized) {
					let panelToMaximize: StockPanel;
					chart.panels.each((panel) => {
						if (panel != this && !panelToMaximize) {
							panelToMaximize = panel;
						}
					})
					if(panelToMaximize){
						panelToMaximize.minimized = false;
					}
				}
			}
			else {
				let hiddenState = this.hiddenState;
				this.yAxesAndPlotContainer.disabled = false;
				let animation = this.animate({ property: "height", from: percent(0), to: this._realHeight }, hiddenState.transitionDuration, hiddenState.transitionEasing);
				animation.events.on("animationprogress", this.parent.invalidateLayout, this.parent);
			}

			if (this.minimizeButton) {
				this.minimizeButton.isActive = value;
			}
		}
	}

	public get minimized(): boolean {
		return this.getPropertyValue("minimized");
	}


	public set minimizeEnabled(value: boolean) {
		if (this.setPropertyValue("minimizeEnabled", value)) {
			let minimizeButton = this.minimizeButton;
			if (value) {
				if (!minimizeButton) {
					let minimizeButton = this.headerContainer.createChild(MinimizeButton);
					minimizeButton.marginRight = 10;
					minimizeButton.toBack();

					this.minimizeButton = minimizeButton;
					minimizeButton.events.on("hit", () => {
						this.minimized = minimizeButton.isActive;
					})
				}
				else {
					minimizeButton.disabled = false;
				}
			}
			else {
				if (minimizeButton) {
					minimizeButton.disabled = true;
				}
			}
		}
	}

	public get minimizeEnabled(): boolean {
		return this.getPropertyValue("minimizeEnabled");
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StockPanel"] = StockPanel;