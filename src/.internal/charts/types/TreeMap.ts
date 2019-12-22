/**
 * TreeMap chart module.
 *
 * Parts of the functionality used in this module are taken from D3.js library
 * (https://d3js.org/)
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { XYChart, IXYChartProperties, IXYChartDataFields, IXYChartAdapters, IXYChartEvents, XYChartDataItem } from "./XYChart";
import { registry } from "../../core/Registry";
import { DictionaryTemplate, DictionaryDisposer } from "../../core/utils/Dictionary";
import { ValueAxis } from "../axes/ValueAxis";
import { OrderedListTemplate } from "../../core/utils/SortedList";
import { TreeMapSeries } from "../series/TreeMapSeries";
import { Color } from "../../core/utils/Color";
import { TreeMapSeriesDataItem } from "../series/TreeMapSeries";
import { NavigationBar } from "../elements/NavigationBar";
import { ColorSet } from "../../core/utils/ColorSet";
import { MouseCursorStyle } from "../../core/interaction/Mouse";
import { Export } from "../../core/export/Export";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $array from "../../core/utils/Array";
import { Animation } from "../../core/utils/Animation";
import { LegendDataItem } from "../../charts/Legend";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[TreeMap]].
 *
 * @see {@link DataItem}
 */
export class TreeMapDataItem extends XYChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: TreeMap;

	/**
	 * A treemap level this data item is displayed at.
	 */
	protected _level: number;

	/**
	 * Series of children data items.
	 */
	protected _series: TreeMapSeries;

	/**
	 * Related series data item.
	 */
	public seriesDataItem: TreeMapSeriesDataItem;

	/**
	 * Required for squarify functionality.
	 *
	 * @ignore Exclude from docs
	 */
	public rows: TreeMapDataItem[] = [];

	/**
	 * Required for squarify functionality.
	 *
	 * @ignore Exclude from docs
	 */
	public rowsRatio: number;

	/**
	 * Required for squarify functionality.
	 *
	 * @ignore Exclude from docs
	 */
	public dice: boolean;

	/**
	 * A reference to a corresponding legend data item.
	 */
	protected _legendDataItem: LegendDataItem;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "TreeMapDataItem";

		this.values.value = {};

		this.values.x0 = {};

		this.values.y0 = {};

		this.values.x1 = {};

		this.values.y1 = {};

		this.hasChildren.children = true;

		this.applyTheme();
	}

	/**
	 * A legend's data item, that corresponds to this data item.
	 *
	 * @param value  Legend data item
	 */
	public set legendDataItem(value: LegendDataItem) {
		this._legendDataItem = value;
		if (value.label) {
			value.label.dataItem = this;
		}
		if (value.valueLabel) {
			value.valueLabel.dataItem = this;
		}
	}

	/**
	 * @return Legend data item
	 */
	public get legendDataItem(): LegendDataItem {
		return this._legendDataItem;
	}

	/**
	 * Returns a duration (ms) the Data Item should take to animate from one
	 * value to another.
	 *
	 * If the duration is not specified via parameter, this method will try to
	 * request a default duration from the related `Component`.
	 *
	 * @param duration  Default duration (ms)
	 * @return Duration (ms)
	 */
	public getDuration(): number {
		return 0;
	}

	/**
	 * Numeric value of the item.
	 *
	 * @param value  Value
	 */
	public set value(value: number) {
		this.setValue("value", value);
	}

	/**
	 * @return Value
	 */
	public get value(): number {

		let value = 0;
		if (!this.children || this.children.length == 0) {
			value = this.values["value"].workingValue;
		}

		else {
			$iter.each(this.children.iterator(), (child) => {
				let childValue = child.value;
				if ($type.isNumber(childValue)) {
					value += childValue;
				}
			});

		}

		return value;
		/*
		let value = this.values["value"].workingValue;

		if (!$type.isNumber(value)) {
			value = 0;
			if (this.children) {
				$iter.each(this.children.iterator(), (child) => {
					if ($type.isNumber(child.value)) {
						value += child.value;
					}
				});
			}
		}
		return value;*/
	}

	public get percent(): number {
		if (this.parent) {
			return this.value / this.parent.value * 100;
		}
		return 100;
	}

	/**
	 * Item's X position.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param value  X
	 */
	public set x0(value: number) {
		this.setValue("x0", value);
	}

	/**
	 * @return X
	 */
	public get x0(): number {
		return this.values.x0.value;
	}

	/**
	 * Item's X position.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param value  X
	 */
	public set x1(value: number) {
		this.setValue("x1", value);
	}

	/**
	 * @return X
	 */
	public get x1(): number {
		return this.values.x1.value;
	}

	/**
	 * Item's Y position.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param value  Y
	 */
	public set y0(value: number) {
		this.setValue("y0", value);
	}

	/**
	 * @return Y
	 */
	public get y0(): number {
		return this.values.y0.value;
	}

	/**
	 * Item's Y position.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param value  Y
	 */
	public set y1(value: number) {
		this.setValue("y1", value);
	}

	/**
	 * @return Y
	 */
	public get y1(): number {
		return this.values.y1.value;
	}

	/**
	 * Item's name.
	 *
	 * @param name  Name
	 */
	public set name(name: string) {
		this.setProperty("name", name);
	}

	/**
	 * @return Name
	 */
	public get name(): string {
		return this.properties.name;
	}

	/**
	 * A list of item's sub-children.
	 *
	 * Having children means that the TreeMap chat will automatically be
	 * "drillable". Clicking on an item with children will zoom to the item, then
	 * display its children.
	 *
	 * Treemap can have any level of nesting.
	 *
	 * @param children  Item's children
	 */
	public set children(children: OrderedListTemplate<TreeMapDataItem>) {
		this.setProperty("children", children);
	}

	/**
	 * @return Item's children
	 */
	public get children(): OrderedListTemplate<TreeMapDataItem> {
		return this.properties.children;
	}

	/**
	 * Depth level in the treemap hierarchy.
	 *
	 * The top-level item will have level set at 0. Its children will have
	 * level 1, and so on.
	 *
	 * @readonly
	 * @return Level
	 */
	public get level(): number {
		if (!this.parent) {
			return 0;
		}
		else {
			return this.parent.level + 1;
		}
	}

	/**
	 * Item's color.
	 *
	 * If not set, will use parent's color, or, if that is not set either,
	 * automatically assigned color from chart's color set. (`chart.colors`)
	 *
	 * @param value  Color
	 */
	public set color(value: Color) {
		this.setProperty("color", value);
	}

	/**
	 * @ignore
	 * For the legend to work properly
	 */
	public get fill(): Color {
		return this.color;
	}

	/**
	 * @return Color
	 */
	public get color(): Color {
		let color = this.properties.color;

		if (color == undefined) {
			if (this.parent) {
				color = this.parent.color;
			}
		}
		if (color == undefined) {
			if (this.component) {
				color = this.component.colors.getIndex(this.component.colors.step * this.index);
			}
		}
		return color;
	}

	/**
	 * Series of children data items
	 * @todo: proper descrition
	 */
	public set series(series: TreeMapSeries) {
		if (series != this._series) {
			if (this._series) {
				this.component.series.removeValue(this._series);
				this._series.dispose();
			}
			this._series = series;
			this._disposers.push(series);
		}
	}

	public get series(): TreeMapSeries {
		return this._series;
	}

	/**
	 * Hides the Data Item and related visual elements.
	 *
	 * @param duration  Animation duration (ms)
	 * @param delay     Delay animation (ms)
	 * @param toValue   A value to set to `fields` when hiding
	 * @param fields    A list of data fields to set value to `toValue`
	 */
	public hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): $type.Optional<Animation> {
		this.setWorkingValue("value", 0);

		if (this.children) {
			this.children.each((child) => {
				child.hide(duration, delay, toValue, fields);
			})
		}

		let seriesDataItem = this.seriesDataItem;
		if(seriesDataItem){
			seriesDataItem.bullets.each((key, value)=>{
				value.hide();
				value.preventShow = true;
			})
		}

		return super.hide(duration, delay, toValue, fields);
	}

	/**
	 * Shows the Data Item and related visual elements.
	 *
	 * @param duration  Animation duration (ms)
	 * @param delay     Delay animation (ms)
	 * @param fields    A list of fields to set values of
	 */
	public show(duration?: number, delay?: number, fields?: string[]): $type.Optional<Animation> {
		this.setWorkingValue("value", this.values.value.value);
		if (this.children) {
			this.children.each((child) => {
				child.show(duration, delay, fields);
			})
		}

		let seriesDataItem = this.seriesDataItem;
		if(seriesDataItem){
			seriesDataItem.bullets.each((key, value)=>{
				value.preventShow = false;
			})
		}

		return super.show(duration, delay, fields);
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[TreeMap]].
 */
export interface ITreeMapDataFields extends IXYChartDataFields {

	/**
	 * A name of the field in data that holds item's numeric value.
	 */
	value?: string;

	/**
	 * A name of the field in data that holds item's sub-items.
	 */
	children?: string;

	/**
	 * A name of the field in data that holds item's name.
	 */
	name?: string;

	/**
	 * A name of the field in data that holds item's color.
	 *
	 * If not set, a new color will be automatically assigned to each item as
	 * defined by theme.
	 */
	color?: string;

}

/**
 * Defines properties for [[TreeMap]].
 */
export interface ITreeMapProperties extends IXYChartProperties {

	/**
	 * Maximum number of levels the chart will display initially.
	 *
	 * @default 2
	 */
	maxLevels?: number;

	/**
	 * Current drill-down level the treemap is at.
	 */
	currentLevel?: number;

	/**
	 * Sorting direction of treemap items.
	 *
	 * @default "descending"
	 */
	sorting?: "none" | "ascending" | "descending";

	/**
	 * If set to `true`, columns of parent nodes will be hidden when user
	 * drills-down into deeper levels.
	 * 
	 * @sice 4.7.4
	 * @default false
	 */
	hideParentColumns?: boolean;

}

/**
 * Defines events for [[TreeMap]].
 */
export interface ITreeMapEvents extends IXYChartEvents { }

/**
 * Defines adapters for [[TreeMap]].
 *
 * @see {@link Adapter}
 */
export interface ITreeMapAdapters extends IXYChartAdapters, ITreeMapProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a TreeMap chart.
 *
 * @see {@link ITreeMapEvents} for a list of available Events
 * @see {@link ITreeMapAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/treemap/} for documentation
 */
export class TreeMap extends XYChart {

	/**
	 * Defines a type of the data item used for this chart.
	 */
	public _dataItem: TreeMapDataItem;

	/**
	 * Defines available data fields.
	 */
	public _dataFields: ITreeMapDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ITreeMapProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ITreeMapAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ITreeMapEvents;

	/**
	 * A horizontal value axis.
	 *
	 * TreeMap chart is basically an XY chart, which means it has vertical and
	 * horizontal value axes.
	 *
	 * As with any XY-based chart, it can be zoomed.
	 */
	public xAxis: ValueAxis;

	/**
	 * A vertical value axis.
	 *
	 * TreeMap chart is basically an XY chart, which means it has vertical and
	 * horizontal value axes.
	 *
	 * As with any XY-based chart, it can be zoomed.
	 */
	public yAxis: ValueAxis;

	/**
	 * An algorithm used to divide area into squares based on their value.
	 *
	 * Available options: squarify (default), binaryTree, slice, dice, sliceDice.
	 *
	 * ```TypeScript
	 * chart.layoutAlgorithm = chart.sliceDice;
	 * ```
	 * ```JavaScript
	 * chart.layoutAlgorithm = chart.sliceDice;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "layoutAlgorithm": "sliceDice",
	 *   // ...
	 * }
	 * ```
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/treemap/#Area_division_methods} For more info and examples.
	 * @default squarify
	 */
	public layoutAlgorithm: (parent: TreeMapDataItem) => void = this.squarify;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: TreeMapSeries;

	/**
	 * [_homeDataItem description]
	 *
	 * @todo Description
	 */
	protected _homeDataItem: TreeMapDataItem;

	/**
	 * [_tempSeries description]
	 *
	 * @todo Description
	 */
	protected _tempSeries: TreeMapSeries[];

	/**
	 * A text dispalyed on the home button in breadcurmb nav control.
	 */
	protected _homeText: string;

	/**
	 * A set of colors to be applied automatically to each new chart item, if
	 * not explicitly set.
	 */
	public colors: ColorSet;

	/**
	 * Holds series object for each TreeMap level.
	 *
	 * "0" is the top-level series.
	 * "1" is the second level.
	 * Etc.
	 *
	 * @todo Description
	 * @param Templates for each level
	 */
	public seriesTemplates: DictionaryTemplate<string, this["_seriesType"]>;

	/**
	 * Is the chart zoomable?
	 *
	 * If the chart is `zoomable`, and items have sub-items, the chart will
	 * drill-down to sub-items when click on their parent item.
	 *
	 * @default true
	 */
	public zoomable: boolean = true;


	/**
	 * A navigation bar used to show "breadcrumb" control, indicating current
	 * drill-down path.
	 */
	protected _navigationBar: NavigationBar;

	/**
	 * Currently selected data item.
	 * @readonly
	 */
	public currentlyZoomed: TreeMapDataItem;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "TreeMap";

		this._usesData = true;

		this.maxLevels = 2;
		this.currentLevel = 0;
		this.hideParentColumns = false;

		this.colors = new ColorSet();
		this.sorting = "descending";

		// create two value axes for the chart
		let xAxis = this.xAxes.push(new ValueAxis<any>());
		xAxis.title.disabled = true;
		xAxis.strictMinMax = true;

		let xRenderer = xAxis.renderer;
		xRenderer.inside = true;
		xRenderer.labels.template.disabled = true;
		xRenderer.ticks.template.disabled = true;
		xRenderer.grid.template.disabled = true;
		xRenderer.axisFills.template.disabled = true;
		xRenderer.minGridDistance = 100;
		xRenderer.line.disabled = true;
		xRenderer.baseGrid.disabled = true;
		//xRenderer.inversed = true;

		let yAxis = this.yAxes.push(new ValueAxis<any>());
		yAxis.title.disabled = true;
		yAxis.strictMinMax = true;

		let yRenderer = yAxis.renderer;
		yRenderer.inside = true;
		yRenderer.labels.template.disabled = true;
		yRenderer.ticks.template.disabled = true;
		yRenderer.grid.template.disabled = true;
		yRenderer.axisFills.template.disabled = true;
		yRenderer.minGridDistance = 100;
		yRenderer.line.disabled = true;
		yRenderer.baseGrid.disabled = true;
		yRenderer.inversed = true;

		// shortcuts
		this.xAxis = xAxis;
		this.yAxis = yAxis;

		const template = new TreeMapSeries();
		this.seriesTemplates = new DictionaryTemplate<string, this["_seriesType"]>(template);
		template.virtualParent = this;
		this._disposers.push(new DictionaryDisposer(this.seriesTemplates));
		this._disposers.push(template);

		this.zoomOutButton.events.on("hit", () => {
			this.zoomToChartDataItem(this._homeDataItem);
		}, undefined, false)

		this.seriesTemplates.events.on("insertKey", (event) => {
			event.newValue.isTemplate = true;
		}, undefined, false)

		// Apply theme
		this.applyTheme();
	}

	/**
	 * A navigation bar used to show "breadcrumb" control, indicating current
	 * drill-down path.
	 */
	public set navigationBar(navigationBar: NavigationBar) {
		if (this._navigationBar != navigationBar) {
			this._navigationBar = navigationBar;
			navigationBar.parent = this;
			navigationBar.toBack();
			navigationBar.links.template.events.on("hit", (event) => {
				let dataItem = <TreeMapDataItem>event.target.dataItem.dataContext;
				if (!dataItem.isDisposed()) {
					this.zoomToChartDataItem(dataItem);
					this.createTreeSeries(dataItem);
				}
			}, undefined, true);

			this._disposers.push(navigationBar);
		}
	}

	/**
	 * Returns navigationBar if it is added to a chart
	 */
	public get navigationBar(): NavigationBar {
		return this._navigationBar;
	}


	/**
	 * (Re)validates chart's data.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {

		this.series.clear();
		this._tempSeries = [];

		super.validateData();

		if (this._homeDataItem) {
			this._homeDataItem.dispose();
		}

		let homeDataItem = this.dataItems.template.clone(); // cant' use createDataItem here!

		this._homeDataItem = homeDataItem;

		$iter.each(this.dataItems.iterator(), (dataItem) => {
			dataItem.parent = homeDataItem;
		});

		homeDataItem.children = this.dataItems;

		homeDataItem.x0 = 0;
		homeDataItem.y0 = 0;
		homeDataItem.name = this._homeText;

		let maxX = 1000;
		let maxY = Math.round((maxX * this.pixelHeight / this.pixelWidth) / 10) * 10 || 1000;

		homeDataItem.x1 = maxX;
		homeDataItem.y1 = maxY;

		this.xAxis.min = 0;
		this.xAxis.max = maxX;
		this.xAxis.getMinMax();

		this.yAxis.min = 0;
		this.yAxis.max = maxY;
		this.yAxis.getMinMax();

		this.layoutItems(homeDataItem);

		this.createTreeSeries(homeDataItem);
	}

	/**
	 * Layouts and sizes all items according to their value and
	 * `layoutAlgorithm`.
	 *
	 * @ignore Exclude from docs
	 * @param parent  Parent data item
	 */
	public layoutItems(parent: TreeMapDataItem, sorting?: "none" | "ascending" | "descending"): void {
		if (parent) {
			let children = parent.children;

			if (!sorting) {
				sorting = this.sorting;
			}

			if (sorting == "ascending") {
				children.values.sort((a, b) => {
					return a.value - b.value;
				});
			}
			if (sorting == "descending") {
				children.values.sort((a, b) => {
					return b.value - a.value;
				});
			}

			this._updateDataItemIndexes(0);

			this.layoutAlgorithm(parent);

			for (let i = 0, len = children.length; i < len; i++) {

				let node = children.getIndex(i);

				if (node.children) {
					this.layoutItems(node);
				}
			}
		}
	}


	/**
	 * Creates and returns a new treemap series.
	 *
	 * @todo Description
	 * @param dataItem  Data item to create series out of
	 */
	protected createTreeSeries(dataItem: TreeMapDataItem) {
		this._tempSeries = [];

		let navigationData = [dataItem];

		// create parent series and navigation data
		let parentDataItem = dataItem.parent;
		while (parentDataItem != undefined) {
			this.initSeries(parentDataItem);
			navigationData.push(parentDataItem);
			parentDataItem = parentDataItem.parent;
		}

		navigationData.reverse();

		if (this.navigationBar) {
			this.navigationBar.data = navigationData;
		}

		// create series and children series
		this.createTreeSeriesReal(dataItem);

		// add those which are not in the list
		$array.each(this._tempSeries, (series) => {
			if (this.series.indexOf(series) == -1) {
				this.series.push(series);
			}
			series.zIndex = series.level;
		})
	}

	/**
	 * [createTreeSeriesReal description]
	 *
	 * @todo Description
	 * @param dataItem [description]
	 */
	protected createTreeSeriesReal(dataItem: TreeMapDataItem) {
		if (dataItem.children) {
			let level = dataItem.level;

			if (level < this.currentLevel + this.maxLevels) {

				this.initSeries(dataItem);

				for (let i = 0; i < dataItem.children.length; i++) {
					let child = dataItem.children.getIndex(i);
					if (child.children) {
						this.createTreeSeriesReal(child);
					}
				}
			}
		}
	}

	protected setData(value: any[]) {
		this.currentLevel = 0;
		this.currentlyZoomed = undefined;
		this.xAxis.start = 0;
		this.xAxis.end = 1;
		this.yAxis.start = 0;
		this.yAxis.end = 1;
		super.setData(value);
	}
	/**
	 * @ignore
	 * Overriding, as tree map series are created on the fly all the time
	 */
	protected seriesAppeared(): boolean {
		return true;
	}


	/**
	 * Initializes the treemap series.
	 *
	 * @todo Description
	 * @param dataItem  Chart data item
	 */
	protected initSeries(dataItem: TreeMapDataItem) {
		if (!dataItem.series) {
			let series: TreeMapSeries;

			let template = this.seriesTemplates.getKey(dataItem.level.toString());
			if (template) {
				series = template.clone();
			}
			else {
				series = this.series.create();
			}
			// for the legend to get {value}
			series.dataItem.dataContext = dataItem;

			series.name = dataItem.name;
			series.parentDataItem = dataItem;
			dataItem.series = series;

			let level = dataItem.level;
			series.level = level;

			let dataContext: any = dataItem.dataContext;
			if (dataContext) {
				series.config = dataContext.config;
			}

			this.dataUsers.removeValue(series); // series do not use data directly, that's why we remove it
			series.data = dataItem.children.values;
			series.fill = dataItem.color;

			series.columnsContainer.hide(0);
			series.bulletsContainer.hide(0);

			series.columns.template.adapter.add("fill", (fill, target) => {
				let dataItem = <TreeMapSeriesDataItem>target.dataItem;
				if (dataItem) {
					let treeMapDataItem = dataItem.treeMapDataItem;
					if (treeMapDataItem) {
						target.fill = treeMapDataItem.color;
						target.adapter.remove("fill"); //@todo: make it possible adapters applied once?
						return treeMapDataItem.color;
					}
				}
			});

			if (this.zoomable && (dataItem.level > this.currentLevel || (dataItem.children && dataItem.children.length > 0))) {
				series.columns.template.cursorOverStyle = MouseCursorStyle.pointer;
				if (this.zoomable) {
					series.columns.template.events.on("hit", (event) => {
						let seriesDataItem = <TreeMapSeriesDataItem>event.target.dataItem;

						if (dataItem.level > this.currentLevel) {
							this.zoomToChartDataItem(seriesDataItem.treeMapDataItem.parent);
						}
						else {
							this.zoomToSeriesDataItem(seriesDataItem);
						}

					}, this, undefined);
				}
			}
		}

		this._tempSeries.push(dataItem.series);
	}

	/**
	 * Toggles bullets so that labels that belong to current drill level are
	 * shown.
	 *
	 * @param duration  Animation duration (ms)
	 */
	protected toggleBullets(duration?: number): void {
		// hide all series which are not in tempSeries
		$iter.each(this.series.iterator(), (series) => {
			if (this._tempSeries.indexOf(series) == - 1) {
				//series.hideReal(duration);
				series.columnsContainer.hide();
				series.bulletsContainer.hide(duration);
			}
			else {
				//series.showReal(duration);
				series.columnsContainer.show();
				series.bulletsContainer.show(duration);

				series.dataItems.each((dataItem) => {
					dataItem.bullets.each((key, bullet) => {
						bullet.show();
					})
				})

				if (series.level < this.currentLevel) {
					if (this.hideParentColumns) {
						series.columnsContainer.hide();
					}
					series.bulletsContainer.hide(duration);
				}
				else if (series.level == this.currentLevel) {
					if (this.maxLevels > 1) {
						series.dataItems.each((dataItem) => {
							if (dataItem.treeMapDataItem.children) {
								dataItem.bullets.each((key, bullet) => {
									bullet.hide();
								})
							}
						})
					}
				}
			}
		});
	}

	/**
	 * Zooms to particular item in series.
	 *
	 * @param dataItem  Data item
	 */
	public zoomToSeriesDataItem(dataItem: TreeMapSeriesDataItem): void {
		this.zoomToChartDataItem(dataItem.treeMapDataItem);
	}

	/**
	 * Zooms to particular item.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public zoomToChartDataItem(dataItem: TreeMapDataItem): void {
		let zoomOutButton = this.zoomOutButton;
		// this is needed because if there is only one fist level, it wont' be shown
		if (zoomOutButton) {
			if (dataItem != this._homeDataItem) {
				zoomOutButton.show();
			}
			else {
				zoomOutButton.hide();
			}
		}

		if (dataItem && dataItem.children) {
			this.xAxis.zoomToValues(dataItem.x0, dataItem.x1);
			this.yAxis.zoomToValues(dataItem.y0, dataItem.y1);

			this.currentLevel = dataItem.level;
			this.currentlyZoomed = dataItem;

			this.createTreeSeries(dataItem);

			let rangeChangeAnimation = this.xAxis.rangeChangeAnimation || this.yAxis.rangeChangeAnimation;

			if (rangeChangeAnimation && !rangeChangeAnimation.isDisposed() && !rangeChangeAnimation.isFinished()) {
				this._dataDisposers.push(rangeChangeAnimation);

				rangeChangeAnimation.events.once("animationended", () => {
					this.toggleBullets();
				})
			}
			else {
				this.toggleBullets();
			}
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
			this.readerTitle = this.language.translate("TreeMap chart");
		}
		//this.homeText = this.language.translate("Home");
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new TreeMapDataItem();
	}

	/**
	 * Maximum number of levels the chart will display initially.
	 *
	 * @default 2
	 * @param value  Maximum drill-down level
	 */
	public set maxLevels(value: number) {
		this.setPropertyValue("maxLevels", value, true);
	}

	/**
	 * @return Maximum drill-down level
	 */
	public get maxLevels(): number {
		return this.getPropertyValue("maxLevels");
	}

	/**
	 * Current drill-down level the chart is at.
	 *
	 * @param value  Current level
	 */
	public set currentLevel(value: number) {
		this.setPropertyValue("currentLevel", value, true);
	}

	/**
	 * @return Current level
	 */
	public get currentLevel(): number {
		return this.getPropertyValue("currentLevel");
	}

	/**
	 * If set to `true`, columns of parent nodes will be hidden when user
	 * drills-down into deeper levels.
	 * 
	 * @sice 4.7.4
	 * @default false
	 * @param  value  Hide?
	 */
	public set hideParentColumns(value: boolean) {
		this.setPropertyValue("hideParentColumns", value);
	}

	/**
	 * @return Hide?
	 */
	public get hideParentColumns(): boolean {
		return this.getPropertyValue("hideParentColumns");
	}

	/**
	 * Sorting direction of treemap items.
	 *
	 * Available options: "none", "ascending", and "descending" (default).
	 *
	 * @default "descending"
	 * @param value [description]
	 */
	public set sorting(value: "none" | "ascending" | "descending") {
		this.setPropertyValue("sorting", value, true);
	}

	public get sorting(): "none" | "ascending" | "descending" {
		return this.getPropertyValue("sorting");
	}

	/**
	 * Creates and returns a new series of the suitable type.
	 *
	 * @return new series
	 */
	protected createSeries(): this["_seriesType"] {
		return new TreeMapSeries();
	}

	/**
	 * A text displayed on the "home" button which is used to go back to level 0
	 * after drill into sub-items.
	 *
	 * @param value  Home text
	 */
	public set homeText(value: string) {
		this._homeText = value;
		if (this._homeDataItem) {
			this._homeDataItem.name = this._homeText;
		}
	}

	/**
	 * @return Home text
	 */
	public get homeText(): string {
		return this._homeText;
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Instantiate layout algorithm
			if ($type.hasValue(config["layoutAlgorithm"]) && $type.isString(config["layoutAlgorithm"])) {
				switch (config["layoutAlgorithm"]) {
					case "squarify":
						config["layoutAlgorithm"] = this.squarify;
						break;
					case "binaryTree":
						config["layoutAlgorithm"] = this.binaryTree;
						break;
					case "slice":
						config["layoutAlgorithm"] = this.slice;
						break;
					case "dice":
						config["layoutAlgorithm"] = this.dice;
						break;
					case "sliceDice":
						config["layoutAlgorithm"] = this.sliceDice;
						break;
					default:
						delete config["layoutAlgorithm"];
						break;
				}

			}

			// Set type for navigation bar
			if ($type.hasValue(config.navigationBar) && !$type.hasValue(config.navigationBar.type)) {
				config.navigationBar.type = "NavigationBar";
			}

			super.processConfig(config);
		}
	}

	/**
	 * Measures the size of container and informs its children of how much size
	 * they can occupy, by setting their relative `maxWidth` and `maxHeight`
	 * properties.
	 *
	 * @ignore Exclude from docs
	 */
	public validateLayout() {
		super.validateLayout();
		this.layoutItems(this.currentlyZoomed);
	}

	/**
	 * Validates (processes) data items.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataItems() {
		super.validateDataItems();
		this.layoutItems(this._homeDataItem);

		$iter.each(this.series.iterator(), (series) => {
			series.validateRawData();
		});

		this.zoomToChartDataItem(this._homeDataItem);
	}


	/**
	 * ==========================================================================
	 * TREEMAP LAYOUT FUNCTIONS
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * The functions below are from D3.js library (https://d3js.org/)
	 *
	 * --------------------------------------------------------------------------
	 * Copyright 2017 Mike Bostock
	 *
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are met:
	 *
	 * 1. Redistributions of source code must retain the above copyright notice,
	 *    this list of conditions and the following disclaimer.
	 *
	 * 2. Redistributions in binary form must reproduce the above copyright
	 *    notice,this list of conditions and the following disclaimer in the
	 *    documentation and/or other materials provided with the distribution.
	 *
	 * 3. Neither the name of the copyright holder nor the names of its
	 *    contributors may be used to endorse or promote products derived from
	 *    this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
	 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
	 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
	 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
	 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
	 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	 * POSSIBILITY OF SUCH DAMAGE.
	 * --------------------------------------------------------------------------
	 * @hidden
	 */

	/**
	 * Treemap layout algorithm: binaryTree.
	 *
	 * @ignore Exclude from docs
	 * @param parent  Data item
	 */
	public binaryTree(parent: TreeMapDataItem): void {
		let nodes = parent.children,
			i, n = nodes.length,
			sum, sums = new Array(n + 1);

		for (sums[0] = sum = i = 0; i < n; ++i) {
			sums[i + 1] = sum += nodes.getIndex(i).value;
		}

		partition(0, n, parent.value, parent.x0, parent.y0, parent.x1, parent.y1);

		function partition(i: number, j: number, value: number, x0: number, y0: number, x1: number, y1: number) {
			if (i >= j - 1) {
				let node = nodes.getIndex(i);
				node.x0 = x0;
				node.y0 = y0;
				node.x1 = x1;
				node.y1 = y1;
				return;
			}

			let valueOffset = sums[i],
				valueTarget = (value / 2) + valueOffset,
				k = i + 1,
				hi = j - 1;

			while (k < hi) {
				let mid = k + hi >>> 1;
				if (sums[mid] < valueTarget) {
					k = mid + 1;
				} else {
					hi = mid;
				}
			}

			if ((valueTarget - sums[k - 1]) < (sums[k] - valueTarget) && i + 1 < k) {
				--k;
			}

			let valueLeft = sums[k] - valueOffset,
				valueRight = value - valueLeft;

			if ((x1 - x0) > (y1 - y0)) {
				let xk = (x0 * valueRight + x1 * valueLeft) / value;
				partition(i, k, valueLeft, x0, y0, xk, y1);
				partition(k, j, valueRight, xk, y0, x1, y1);
			} else {
				let yk = (y0 * valueRight + y1 * valueLeft) / value;
				partition(i, k, valueLeft, x0, y0, x1, yk);
				partition(k, j, valueRight, x0, yk, x1, y1);
			}
		}
	}

	/**
	 * Treemap layout algorithm: slice.
	 *
	 * @ignore Exclude from docs
	 * @param parent  Data item
	 */
	public slice(parent: TreeMapDataItem): void {
		let x0 = parent.x0;
		let x1 = parent.x1;
		let y0 = parent.y0;
		let y1 = parent.y1;

		let nodes = parent.children;
		let node;
		let i = -1;
		let n = nodes.length;
		let k = parent.value && (y1 - y0) / parent.value;

		while (++i < n) {
			node = nodes.getIndex(i);
			node.x0 = x0;
			node.x1 = x1;
			node.y0 = y0;
			y0 += node.value * k;
			node.y1 = y0;
		}
	}

	/**
	 * Treemap layout algorithm: dice.
	 *
	 * @ignore Exclude from docs
	 * @param parent  Data item
	 */
	public dice(parent: TreeMapDataItem): void {
		let x0 = parent.x0;
		let x1 = parent.x1;
		let y0 = parent.y0;
		let y1 = parent.y1;

		let nodes = parent.children,
			node,
			i = -1,
			n = nodes.length,
			k = parent.value && (x1 - x0) / parent.value;

		while (++i < n) {
			node = nodes.getIndex(i);
			node.y0 = y0;
			node.y1 = y1;
			node.x0 = x0;
			x0 += node.value * k;
			node.x1 = x0;
		}
	}

	/**
	 * Treemap layout algorithm: slideDice.
	 *
	 * @ignore Exclude from docs
	 * @param parent  Data item
	 */
	public sliceDice(parent: TreeMapDataItem): void {
		if (parent.level & 1) {
			this.slice(parent);
		} else {
			this.dice(parent);
		}
	}

	/**
	 * Treemap layout algorithm: squarify.
	 *
	 * @ignore Exclude from docs
	 * @param parent  Data item
	 */
	public squarify(parent: TreeMapDataItem): void {
		let ratio = (1 + Math.sqrt(5)) / 2;

		let x0 = parent.x0;
		let x1 = parent.x1;
		let y0 = parent.y0;
		let y1 = parent.y1;

		let nodes = parent.children;
		let nodeValue;
		let i0 = 0;
		let i1 = 0;
		let n = nodes.length;
		let dx;
		let dy;
		let value = parent.value;
		let sumValue;
		let minValue;
		let maxValue;
		let newRatio;
		let minRatio;
		let alpha;
		let beta;

		while (i0 < n) {
			dx = x1 - x0;
			dy = y1 - y0;

			// Find the next non-empty node.
			do {
				sumValue = nodes.getIndex(i1++).value;
			} while (!sumValue && i1 < n);

			minValue = maxValue = sumValue;
			alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
			beta = sumValue * sumValue * alpha;
			minRatio = Math.max(maxValue / beta, beta / minValue);

			// Keep adding nodes while the aspect ratio maintains or improves.
			for (; i1 < n; ++i1) {
				sumValue += nodeValue = nodes.getIndex(i1).value;
				if (nodeValue < minValue) {
					minValue = nodeValue;
				}
				if (nodeValue > maxValue) {
					maxValue = nodeValue;
				}
				beta = sumValue * sumValue * alpha;
				newRatio = Math.max(maxValue / beta, beta / minValue);
				if (newRatio > minRatio) {
					sumValue -= nodeValue; break;
				}
				minRatio = newRatio;
			}

			// Position and record the row orientation.
			let row = this.dataItems.template.clone();
			row.value = sumValue;
			row.dice = dx < dy;
			row.children = nodes.slice(i0, i1);
			row.x0 = x0;
			row.y0 = y0;
			row.x1 = x1;
			row.y1 = y1;

			if (row.dice) {
				row.y1 = value ? (y0 += (dy * sumValue) / value) : y1;
				this.dice(row);
			}
			else {
				row.x1 = value ? (x0 += (dx * sumValue) / value) : x1;
				this.slice(row);
			}
			value -= sumValue;
			i0 = i1;
		}
	}

	protected handleSeriesAdded2() {
		// void
	}

	/**
	 * [handleDataItemValueChange description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public handleDataItemValueChange(dataItem?: this["_dataItem"], name?: string): void {
		if (name == "value") {
			this.invalidateDataItems();
		}
	}

	public handleDataItemWorkingValueChange(dataItem?: this["_dataItem"], name?: string): void {
		if (name == "value") {
			this.invalidateDataItems();
		}
	}

	protected getLegendLevel(dataItem: TreeMapDataItem): TreeMapDataItem {
		if (!dataItem) {
			return;
		}

		if (!dataItem.children) {
			return;
		}

		if (dataItem.children.length > 1) {
			return dataItem;
		}
		else if (dataItem.children.length == 1) {
			return this.getLegendLevel(dataItem.children.getIndex(0));
		}
		else {
			return dataItem;
		}
	}


	/**
	 * Setups the legend to use the chart's data.
	 * @ignore
	 */
	public feedLegend(): void {
		let legend = this.legend;
		if (legend) {

			legend.dataFields.name = "name";

			let legendParent = this.getLegendLevel(this._homeDataItem);
			if (legendParent) {
				let legendData: Array<this["_dataItem"]> = [];

				legendParent.children.each((dataItem) => {
					//if (!dataItem.hiddenInLegend) {
					legendData.push(dataItem);
					//}
				});

				legend.data = legendData;
			}
		}
	}

	/**
	 * @ignore
	 */
	public disposeData() {

		super.disposeData();

		this._homeDataItem = undefined;

		this.series.clear();

		if (this.navigationBar) {
			this.navigationBar.disposeData();
		}

		this.xAxis.disposeData();
		this.yAxis.disposeData();
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
				if ($type.hasValue(this.dataFields.children)) {
					delete info.dataFields[this.dataFields.children];
				}
			}
			return info;
		})
		return exporting;
	}

}

/**
 * Register class, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["TreeMap"] = TreeMap;
