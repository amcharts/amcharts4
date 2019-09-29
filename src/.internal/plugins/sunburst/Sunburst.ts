/**
 * Sunburst chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PieChart, IPieChartProperties, IPieChartDataFields, IPieChartAdapters, IPieChartEvents, PieChartDataItem } from "../../charts/types/PieChart";
import { SunburstSeries, SunburstSeriesDataItem } from "./SunburstSeries";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";
import { percent } from "../../core/utils/Percent";
import { Color } from "../../core/utils/Color";
import { ColorSet } from "../../core/utils/ColorSet";
import { OrderedListTemplate } from "../../core/utils/SortedList";
import { DictionaryTemplate, DictionaryDisposer } from "../../core/utils/Dictionary";
import { Export } from "../../core/export/Export";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[Sunburst]].
 *
 * @since 4.1.6
 * @see {@link DataItem}
 */
export class SunburstDataItem extends PieChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: Sunburst;

	/**
	 * A treemap level this data item is displayed at.
	 */
	protected _level: number;

	/**
	 * Series of children data items.
	 */
	protected _series: SunburstSeries;

	/**
	 * Related series data item.
	 */
	public seriesDataItem: SunburstSeriesDataItem;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SunburstDataItem";

		this.values.value = {};

		this.hasChildren.children = true;

		this.applyTheme();
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
	 * Numeric value of the slice.
	 *
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
	}

	/**
	 * Percent of the slice.
	 *
	 * @return {number} Percent
	 */
	public get percent(): number {
		if (this.parent) {
			return this.value / this.parent.value * 100;
		}
		return 100;
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
	 * @param children  Item's children
	 */
	public set children(children: OrderedListTemplate<SunburstDataItem>) {
		this.setProperty("children", children);
	}

	/**
	 * @return Item's children
	 */
	public get children(): OrderedListTemplate<SunburstDataItem> {
		return this.properties.children;
	}

	/**
	 * Depth level in the Sunburst hierarchy.
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
	 * A series representing slice's children.
	 *
	 * @param  series Child series
	 */
	public set series(series: SunburstSeries) {
		if (series != this._series) {
			if (this._series) {
				this.component.series.removeValue(this._series);
				this._series.dispose();
			}
			this._series = series;
			this._disposers.push(series);
		}
	}

	/**
	 * @return Child series
	 */
	public get series(): SunburstSeries {
		return this._series;
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[Sunburst]].
 *
 * @since 4.1.6
 */
export interface ISunburstDataFields extends IPieChartDataFields {

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
 * Defines properties for [[Sunburst]].
 *
 * @since 4.1.6
 */
export interface ISunburstProperties extends IPieChartProperties { }

/**
 * Defines events for [[Sunburst]].
 *
 * @since 4.1.6
 */
export interface ISunburstEvents extends IPieChartEvents { }

/**
 * Defines adapters for [[Sunburst]].
 *
 * @since 4.1.6
 * @see {@link Adapter}
 */
export interface ISunburstAdapters extends IPieChartAdapters, ISunburstProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A main class for Sunburst chart type.
 *
 * @since 4.1.6
 * @see {@link ISunburstEvents} for a list of available Events
 * @see {@link ISunburstAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/sunburst/} For more information
 * @todo Example
 * @important
 */
export class Sunburst extends PieChart {

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: SunburstDataItem;

	/**
	 * Defines available data fields.
	 */
	public _dataFields: ISunburstDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ISunburstProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISunburstAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISunburstEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: SunburstSeries;

	/**
	 * A set of colors to be applied automatically to each new chart item, if
	 * not explicitly set.
	 */
	public colors: ColorSet;

	/**
	 * Holds series object for each Sunburst level.
	 *
	 * "0" is the top-level series.
	 * "1" is the second level.
	 * Etc.
	 */
	public seriesTemplates: DictionaryTemplate<string, this["_seriesType"]>;

	/**
	 * [_homeDataItem description]
	 *
	 * @todo Description
	 */
	protected _homeDataItem: SunburstDataItem;

	/**
	 * Number of levels in current chart.
	 */
	protected _levelCount: number;


	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Sunburst";

		this.colors = new ColorSet();

		this._usesData = true;

		const template = new SunburstSeries();
		this.seriesTemplates = new DictionaryTemplate<string, this["_seriesType"]>(template);
		template.virtualParent = this;
		this._disposers.push(new DictionaryDisposer(this.seriesTemplates));
		this._disposers.push(template);

		this.radius = percent(95);

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Creates and returns a new series of the suitable type.
	 *
	 * @return New series
	 */
	protected createSeries(): this["_seriesType"] {
		return new SunburstSeries();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new SunburstDataItem();
	}

	/**
	 * (Re)validates chart's data.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {

		this.series.clear();

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

		this._levelCount = 0;

		this.createSunburstSeries(homeDataItem);
	}

	/**
	 * Creates [[SunburstSeries]] instance for item's children.
	 *
	 * @param  dataItem Data item
	 */
	protected createSunburstSeries(dataItem: this["_dataItem"]) {
		if (dataItem.children) {
			this.initSeries(dataItem);

			for (let i = 0; i < dataItem.children.length; i++) {
				let child = dataItem.children.getIndex(i);
				if (child.children) {
					this.createSunburstSeries(child);
				}
			}
		}
	}

	/**
	 * Initializes the Sunburst series.
	 *
	 * @param  dataItem  Chart data item
	 */
	protected initSeries(dataItem: SunburstDataItem) {
		if (!dataItem.series) {
			let series: this["_seriesType"];

			let template = this.seriesTemplates.getKey(dataItem.level.toString());
			if (template) {
				series = template.clone();
				this.series.moveValue(series);
			}
			else {
				series = this.series.create();
			}

			series.name = dataItem.name;
			series.parentDataItem = dataItem;
			dataItem.series = series;

			let level = dataItem.level;
			series.level = level;

			if (this._levelCount < level + 1) {
				this._levelCount = level + 1;
			}

			let dataContext: any = dataItem.dataContext;
			if (dataContext) {
				series.config = dataContext.config;
			}

			this.dataUsers.removeValue(series); // series do not use data directly, that's why we remove it
			series.data = dataItem.children.values;
			series.fill = dataItem.color;

			series.slices.template.adapter.add("fill", (fill, target) => {
				let dataItem = <SunburstSeriesDataItem>target.dataItem;
				if (dataItem) {
					let sunburstDataItem = dataItem.sunburstDataItem;
					if (sunburstDataItem) {
						target.fill = sunburstDataItem.color;
						target.adapter.remove("fill"); //@todo: make it possible adapters applied once?
						return sunburstDataItem.color;
					}
				}
			});

			series.adapter.add("startAngle", (startAngle, target) => {
				let parentDataItem = target.parentDataItem;
				if (parentDataItem) {
					let seriesDataItem = parentDataItem.seriesDataItem;
					if (seriesDataItem) {
						startAngle = seriesDataItem.slice.startAngle;
					}
				}
				return startAngle;
			})

			series.adapter.add("endAngle", (startAngle, target) => {
				let parentDataItem = target.parentDataItem;
				if (parentDataItem) {
					let seriesDataItem = parentDataItem.seriesDataItem;
					if (seriesDataItem) {
						startAngle = seriesDataItem.slice.startAngle + seriesDataItem.slice.arc;
					}
				}
				return startAngle;
			})

			series.validateData();

			if (dataItem.seriesDataItem) {
				dataItem.seriesDataItem.slice.events.on("propertychanged", (event) => {
					if (event.property == "startAngle" || event.property == "arc") {
						series.invalidate();
					}
				})
			}
		}
	}

	/**
	 * Recalculates Sunburst radius, based on a number of criteria.
	 *
	 * @ignore Exclude from docs
	 */
	public updateRadius(): void {

		super.updateRadius();

		let chartRadius = this._chartPixelRadius;
		let chartPixelInnerRadius = this._chartPixelInnerRadius;

		let seriesRadius = (chartRadius - chartPixelInnerRadius) / this._levelCount;

		$iter.each($iter.indexed(this.series.iterator()), (a) => {
			let series = a[1];

			let radius = chartPixelInnerRadius + $utils.relativeRadiusToValue(series.radius, chartRadius - chartPixelInnerRadius);
			let innerRadius = chartPixelInnerRadius + $utils.relativeRadiusToValue(series.innerRadius, chartRadius - chartPixelInnerRadius);

			if (!$type.isNumber(radius)) {
				radius = chartPixelInnerRadius + seriesRadius * (series.level + 1);
			}
			if (!$type.isNumber(innerRadius)) {
				innerRadius = chartPixelInnerRadius + seriesRadius * series.level;
			}

			series.pixelRadius = radius;
			series.pixelInnerRadius = innerRadius;
		});
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
			this.readerTitle = this.language.translate("Sunburst chart");
		}
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
				if($type.hasValue(this.dataFields.children)) {
					delete info.dataFields[this.dataFields.children];
				}
			}
			return info;
		})
		return exporting;
	}

	protected handleSeriesAdded2(){
		// void
	}	

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Sunburst"] = Sunburst;
registry.registeredClasses["SunburstDataItem"] = SunburstDataItem;
