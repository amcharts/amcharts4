/**
 * [[Chart]] class provides base functionality for all chart types to inherit.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { registry } from "../core/Registry";
import { Component, IComponentProperties, IComponentDataFields, IComponentEvents, IComponentAdapters } from "../core/Component";
import { MutableValueDisposer } from "../core/utils/Disposer";
import { ListTemplate, IListEvents, ListDisposer } from "../core/utils/List";
import { Container } from "../core/Container";
import { Label } from "../core/elements/Label";
import { Grip } from "../core/elements/Grip";
import { Legend } from "../charts/Legend";
import { DataItem } from "../core/DataItem";
import { percent } from "../core/utils/Percent";
import * as $iter from "../core/utils/Iterator";
import * as $type from "../core/utils/Type";
import { defaultRules, ResponsiveBreakpoints } from "../core/utils/Responsive";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[Chart]].
 *
 * @see {@link DataItem}
 */
export class ChartDataItem extends DataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: Chart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ChartDataItem";
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
 * Defines data fields for [[Chart]].
 */
export interface IChartDataFields extends IComponentDataFields { }

/**
 * Defines properties for [[Chart]].
 */
export interface IChartProperties extends IComponentProperties { }

/**
 * Defines events for [[Chart]].
 */
export interface IChartEvents extends IComponentEvents { }

/**
 * Defines adapters for [[Chart]].
 *
 * @see {@link Adapter}
 */
export interface IChartAdapters extends IComponentAdapters, IChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A base class for all Charts.
 *
 * @see {@link IChartEvents} for a list of available Events
 * @see {@link IChartAdapters} for a list of available Adapters
 */
export class Chart extends Component {

	/**
	 * Available data fields.
	 */
	public _dataFields: IChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IChartEvents;

	/**
	 * A List of chart titles.
	 */
	public titles: ListTemplate<Label>;

	/**
	 * Container that holds the chart itself.
	 */
	public chartContainer: Container;

	/**
	 * A reference to a container that holds both the chart and the legend.
	 */
	public chartAndLegendContainer: Container;

	/**
	 * A reference to chart's [[Legend]].
	 * @ignore
	 */
	protected _legend = new MutableValueDisposer<Legend>();

	/**
	 * Instance of the grip element.
	 */
	protected _dragGrip: $type.Optional<Grip>;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();

		if (this.constructor === Chart) {
			throw new Error("'Chart' cannot be instantiated directly. Please use a specific chart type.");
		}
		this.className = "Chart";

		// Create a list of titles
		const template = new Label();
		this.titles = new ListTemplate<Label>(template);
		this._disposers.push(new ListDisposer(this.titles));
		this._disposers.push(template);

		// Chart component is also a container. it holds _chartAndLegendCont and titles
		this.width = percent(100);
		this.height = percent(100);
		this.layout = "vertical";

		// Chart and legend
		let chartAndLegendContainer: Container = this.createChild(Container);
		chartAndLegendContainer.shouldClone = false;
		chartAndLegendContainer.layout = "vertical";
		chartAndLegendContainer.width = percent(100);
		chartAndLegendContainer.height = percent(100);
		this.chartAndLegendContainer = chartAndLegendContainer;

		// Chart container holds all the elements of a chart, extept titles and legend
		let chartContainer = chartAndLegendContainer.createChild(Container);
		chartContainer.shouldClone = false;
		chartContainer.width = percent(100);
		chartContainer.height = percent(100);
		this.chartContainer = chartContainer;

		this.showOnInit = true;

		this._disposers.push(this._legend);

		// Add title list events to apply certain formatting options and to make
		// the chart reference them as accessible screen reader labels
		this.titles.events.on("inserted", (label) => {
			this.processTitle(label);
			this.updateReaderTitleReferences();
		}, this, false);
		this.titles.events.on("removed", (label) => {
			this.updateReaderTitleReferences();
		}, this, false);

		// Accessibility
		// It seems we can't set focusable on the whole chart because it seems to
		// mess up the whole focus event system - getting a focus on an inside
		// object also trigger focus on parent
		//this.focusable = true;
		this.role = "region";

		this.defaultState.transitionDuration = 1;

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Chart");
		}
	}

	/**
	 * Initiates drawing of the chart.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		this.fixLayout();
		super.draw();
	}

	/**
	 * Updates legend's hierarchy based on the position.
	 */
	protected fixLayout(): void {
		let legend = this.legend;
		if (legend) {
			let chartAndLegendContainer = this.chartAndLegendContainer;
			let chartContainer = this.chartContainer;
			chartContainer.x = undefined;
			chartContainer.y = undefined;
			legend.x = undefined;
			legend.y = undefined;
			switch (legend.position) {
				case "left":
					chartAndLegendContainer.layout = "horizontal";
					if (!$type.isNumber(legend.width)) {
						legend.width = 200;
					}
					//legend.maxWidth = legend.width;
					legend.toBack();
					break;

				case "right":
					chartAndLegendContainer.layout = "horizontal";
					if (!$type.isNumber(legend.width)) {
						legend.width = 200;
					}
					//legend.maxWidth = legend.width;
					legend.toFront();
					break;

				case "top":
					chartAndLegendContainer.layout = "vertical";
					legend.maxWidth = undefined;
					legend.width = percent(100);
					legend.toBack();
					break;

				case "bottom":
					chartAndLegendContainer.layout = "vertical";
					legend.maxWidth = undefined;
					legend.width = percent(100);
					legend.toFront();
			}
		}
	}

	/**
	 * Setups the legend to use the chart's data.
	 */
	protected feedLegend(): void {

		// Nothing here. This method is provided only as a "placeholder" for
		// extending classes to override

	}

	/**
	 * Adds a new title to the chart when it is inserted into chart's titles
	 * list.
	 * @param event  An event object which is triggered when inserting into titles list
	 * @return Label object
	 */
	protected processTitle(event: IListEvents<Label>["inserted"]): Label {
		let title: Label = event.newValue;
		title.parent = this;
		title.toBack();
		title.shouldClone = false;
		title.align = "center";

		// Need to explicitly apply the `id` attribute so it can be referenced by
		// `aria-labelledby`
		title.uidAttr();
		return title;
	}

	/**
	 * Checks if chart has any title elements. If it does, we will use them in an
	 * `aria-labelledby` attribute so that screen readers can use them to properly
	 * describe the chart when it is focused or hovered.
	 *
	 * @ignore Exclude from docs
	 */
	public updateReaderTitleReferences(): void {
		if (this.titles.length) {
			let titleIds: Array<string> = [];
			$iter.each(this.titles.iterator(), (title) => {
				titleIds.push(title.uid);
			});
			this.setSVGAttribute({ "aria-labelledby": titleIds.join(" ") });
		}
		else {
			this.removeSVGAttribute("aria-labelledby");
		}
	}


	/**
	 * Holds the instance of chart's [[Leged]].
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/legend/} for more information about legends
	 * @param Legend
	 */
	public set legend(legend: Legend) {
		this.setLegend(legend);
	}

	/**
	 * @return Legend
	 */
	public get legend(): Legend {
		return this._legend.get();
	}

	/**
	 * Prepares the legend instance for use in this chart.
	 *
	 * @param legend  Legend
	 */
	protected setLegend(legend: Legend) {
		if (this._legend.get() !== legend) {
			if (legend) {
				// Set legend options
				legend.parent = this.chartAndLegendContainer;

				this._legend.set(legend, legend.events.on("propertychanged", (event) => {
					if (event.property == "position" || event.property == "width") {
						this.fixLayout();
					}
				}, undefined, false));

			} else {
				this._legend.reset();
			}

			this.feedLegend();
		}
	}


	/**
	 * Destroys this object and all related data.
	 */
	public dispose(){
		// otherwise there might be some errors when disposing chart which was just inited
		if(this.legend){
			this.legend.dispose();
		}
		super.dispose();
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Set up legend
			if ($type.hasValue(config.legend) && !$type.hasValue(config.legend.type)) {
				config.legend.type = "Legend";
			}

		}

		super.processConfig(config);

	}

	/**
	 * Copies all properties from another instance of [[Series]].
	 *
	 * @param source  Source series
	 */
	public copyFrom(source: this) {
		this.titles.copyFrom(source.titles);
		this.chartContainer.copyFrom(source.chartContainer);
		if (source.legend) {
			this.legend = source.legend.clone();
			this.legend.removeChildren();
		}
		super.copyFrom(source);
	}

	/**
	 * An instance of [[Grip]] which serves as a grip point which appears on
	 * touch and allows scrolling whole page even if chart is occupying the
	 * whole of the screen and would otherwise prevent scrolling.
	 *
	 * @since 4.4.0
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/touch/} For more information.
	 * @param  value  Grip
	 */
	public set dragGrip(value: Grip) {
		this._dragGrip = value;
	}

	/**
	 * @return Grip
	 */
	public get dragGrip(): Grip {
		if (!this._dragGrip) {
			let grip = this.tooltipContainer.createChild(Grip);
			grip.align = "right";
			grip.valign = "middle";
			grip.hide(0);

			grip.events.on("down", (ev) => {
				if (ev.touch) {
					this.interactionsEnabled = false;
				}
			});

			grip.events.on("up", (ev) => {
				this.interactionsEnabled = true;
			});

			this.events.on("down", (ev) => {
				if (ev.touch) {
					grip.show();
				}
			});

			this._dragGrip = grip;
		}
		return this._dragGrip;
	}

	public set focusable(value: boolean) {
		this.parent.focusable = true;
	}

	public get focusable(): boolean {
		return this.parent.focusable;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Chart"] = Chart;



/**
 * Add default responsive rules
 */

/**
 * Reduce horizontal margins
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.widthXS,
	state: function(target, stateId) {
		if (target instanceof Chart) {
			let state = target.states.create(stateId);
			if (target.pixelPaddingLeft > 10) {
				state.properties.paddingLeft = 10;
			}
			if (target.pixelPaddingRight > 10) {
				state.properties.paddingRight = 10;
			}
			return state;
		}

		return null;
	}
});

/**
 * Reduce vertical margins
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.heightXS,
	state: function(target, stateId) {
		if (target instanceof Chart) {
			let state = target.states.create(stateId);
			if (target.pixelPaddingTop > 10) {
				state.properties.paddingTop = 10;
			}
			if (target.pixelPaddingBottom > 10) {
				state.properties.paddingBottom = 10;
			}
			return state;
		}

		return null;
	}
});

/**
 * Remove horizontal padding
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.widthXXS,
	state: function(target, stateId) {
		if (target instanceof Chart) {
			let state = target.states.create(stateId);
			state.properties.paddingLeft = 0;
			state.properties.paddingRight = 0;
			return state;
		}

		return null;
	}
});

/**
 * Remove vertical padding
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.heightXXS,
	state: function(target, stateId) {
		if (target instanceof Chart) {
			let state = target.states.create(stateId);
			state.properties.paddingTop = 0;
			state.properties.paddingBottom = 0;
			return state;
		}

		return null;
	}
});
