/**
 * XY series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Series, SeriesDataItem, ISeriesProperties, ISeriesDataFields, ISeriesAdapters, ISeriesEvents } from "./Series";
import { Sprite } from "../../core/Sprite";
import { Axis } from "../axes/Axis";
import { AxisRenderer } from "../axes/AxisRenderer";
import { ValueAxis } from "../axes/ValueAxis";
import { Dictionary } from "../../core/utils/Dictionary";
import { List } from "../../core/utils/List";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { XYChart } from "../types/XYChart";
import { XYCursor } from "../cursors/XYCursor";
import { CategoryAxis } from "../axes/CategoryAxis";
import { IPoint } from "../../core/defs/IPoint";
import { DateAxis } from "../axes/DateAxis";
import { Bullet } from "../elements/Bullet";
import { CalculatedValue } from "../../core/Component";
import { Animation } from "../../core/utils/Animation";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";
import * as $time from "../../core/utils/Time";
import * as $array from "../../core/utils/Array";
import * as $object from "../../core/utils/Object";
import * as $path from "../../core/rendering/Path";
import { ITimeInterval } from "../../core/defs/ITimeInterval";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[XYSeries]].
 *
 * @see {@link DataItem}
 */
export class XYSeriesDataItem extends SeriesDataItem {

	/**
	 * [_minX description]
	 *
	 * @todo Descripion
	 */
	protected _minX: number;

	/**
	 * [_maxX description]
	 *
	 * @todo Descripion
	 */
	protected _maxX: number;

	/**
	 * [_minY description]
	 *
	 * @todo Descripion
	 */
	protected _minY: number;

	/**
	 * [_maxY description]
	 *
	 * @todo Descripion
	 */
	protected _maxY: number;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 * 
	 * @ignore
	 */
	public _component!: XYSeries;

	/**
	 * References to any aggregate data items this data item is part of.
	 *
	 * @ignore
	 * @since 4.7.0
	 */
	public groupDataItems: this[];

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "XYSeriesDataItem";

		this.values.customValue = {};

		this.values.valueX = { stack: 0 };
		this.values.valueY = { stack: 0 };
		this.values.openValueX = {};
		this.values.openValueY = {};

		this.values.dateX = {};
		this.values.dateY = {};
		this.values.openDateX = {};
		this.values.openDateY = {};

		this.setLocation("dateX", 0.5, 0);
		this.setLocation("dateY", 0.5, 0);

		this.setLocation("categoryX", 0.5, 0);
		this.setLocation("categoryY", 0.5, 0);

		this.applyTheme();
	}

	/**
	 * Item's numeric value on X value axis.
	 *
	 * @param value  Value
	 */
	public set valueX(value: number) {
		this.setValue("valueX", value);
	}

	/**
	 * @return Value
	 */
	public get valueX(): number {
		return this.values.valueX.value;
	}

	/**
	 * Item's custom numeric value.
	 *
	 * @param value  Value
	 */
	public set customValue(value: number) {
		this.setValue("customValue", value);
	}

	/**
	 * @return Value
	 */
	public get customValue(): number {
		return this.values.customValue.value;
	}

	/**
	 * Item's numeric value on Y value axis.
	 *
	 * @param value  Value
	 */
	public set valueY(value: number) {
		this.setValue("valueY", value);
	}

	/**
	 * @return Value
	 */
	public get valueY(): number {
		return this.values.valueY.value;
	}

	/**
	 * Item's date value on X date-based axis.
	 *
	 * @param date  Date
	 */
	public set dateX(date: Date) {
		this.setDate("dateX", date);
	}

	/**
	 * @return Date
	 */
	public get dateX(): Date {
		return this.getDate("dateX");
	}

	/**
	 * Item's date value on Y date-based axis.
	 *
	 * @param date  Date
	 */
	public set dateY(date: Date) {
		this.setDate("dateY", date);
	}

	/**
	 * @return Date
	 */
	public get dateY(): Date {
		return this.getDate("dateY");
	}

	/**
	 * Item's category on X category axis.
	 *
	 * @param category  Category
	 */
	public set categoryX(category: string) {
		this.setCategory("categoryX", category);
	}

	/**
	 * @return Category
	 */
	public get categoryX(): string {
		return this.categories.categoryX;
	}

	/**
	 * Item's category on Y category axis.
	 *
	 * @param category  Category
	 */
	public set categoryY(category: string) {
		this.setCategory("categoryY", category);
	}

	/**
	 * @return Category
	 */
	public get categoryY(): string {
		return this.categories.categoryY;
	}

	/**
	 * Item's open numeric value on X value axis.
	 *
	 * @param value  Value
	 */
	public set openValueX(value: number) {
		this.setValue("openValueX", value);
	}

	/**
	 * @return Value
	 */
	public get openValueX(): number {
		return this.values.openValueX.value;
	}

	/**
	 * Item's open numeric value on Y value axis.
	 *
	 * @param value  Value
	 */
	public set openValueY(value: number) {
		this.setValue("openValueY", value);
	}

	/**
	 * @return Value
	 */
	public get openValueY(): number {
		return this.values.openValueY.value;
	}

	/**
	 * Item's open date value on X date-based axis.
	 *
	 * @param date  Date
	 */
	public set openDateX(date: Date) {
		this.setDate("openDateX", date);
	}

	/**
	 * @return Date
	 */
	public get openDateX(): Date {
		return this.getDate("openDateX");
	}

	/**
	 * Item's open date value on Y date-based axis.
	 *
	 * @param date  Date
	 */
	public set openDateY(date: Date) {
		this.setDate("openDateY", date);
	}

	/**
	 * @return Date
	 */
	public get openDateY(): Date {
		return this.getDate("openDateY");
	}

	/**
	 * Item's open category on X category axis.
	 *
	 * @param category  Category
	 */
	public set openCategoryX(category: string) {
		this.setCategory("openCategoryX", category);
	}

	/**
	 * @return Category
	 */
	public get openCategoryX(): string {
		return this.categories.openCategoryX;
	}

	/**
	 * Item's open category on Y category axis.
	 *
	 * @param category  Category
	 */
	public set openCategoryY(category: string) {
		this.setCategory("openCategoryY", category);
	}

	/**
	 * @return Category
	 */
	public get openCategoryY(): string {
		return this.categories.openCategoryY;
	}

	/**
	 * Return smallest value out of all item's value fields.
	 *
	 * @ignore Exclude from docs
	 * @param fields      Fields to check in
	 * @param working     Include working (temporary) values
	 * @param stackValue  If item is in a stack, the value item starts as
	 * @return Value
	 */
	public getMin(fields: string[], working?: boolean, stackValue?: number): number {
		//if (this.visible) {  // dumped because of non smooth zooming
		let min: number;

		if (!$type.isNumber(stackValue)) {
			stackValue = 0;
		}

		$array.each(fields, (field) => {
			let value: number;

			if (working) {
				value = this.getWorkingValue(field);
			}
			else {
				value = this.getValue(field);
			}

			value += stackValue;

			if (value < min || !$type.isNumber(min)) {
				min = value;
			}
		});
		return min;
		//}
	}

	/**
	 * Return biggest value out of all item's value fields.
	 *
	 * @ignore Exclude from docs
	 * @param fields      Fields to check in
	 * @param working     Include working (temporary) values
	 * @param stackValue  If item is in a stack, the value item starts as
	 * @return Value
	 */
	public getMax(fields: string[], working?: boolean, stackValue?: number): number {
		//if (this.visible) { // dumped because of non smooth zooming
		let max: number;

		if (!$type.isNumber(stackValue)) {
			stackValue = 0;
		}

		$array.each(fields, (field) => {
			let value: number;

			if (working) {
				value = this.getWorkingValue(field);
			}
			else {
				value = this.getValue(field);
			}

			value += stackValue;

			if (value > max || !$type.isNumber(max)) {
				max = value;
			}
		});

		return max;
		//}
	}

}


/**
 * Defines property set for a [[XYSeries]] tooltip event that contains information about dataItem
 */
export type XYSeriesTooltipEvent = {

	/**
	 * Shift in coordinates after dragging.
	 */
	dataItem: XYSeriesDataItem;
};


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[XYSeries]].
 */
export interface IXYSeriesDataFields extends ISeriesDataFields {

	/**
	 * Name of the field in data that holds numeric value for horizontal axis.
	 */
	valueX?: string;

	/**
	 * Name of the field in data that holds numeric value for vertical axis.
	 */
	valueY?: string;

	/**
	 * Name of the field in data that holds category for horizontal axis.
	 */
	categoryX?: string;

	/**
	 * Name of the field in data that holds category for vertical axis.
	 */
	categoryY?: string;

	/**
	 * Name of the field in data that holds date for horizontal axis.
	 */
	dateX?: string;

	/**
	 * Name of the field in data that holds date for vertical axis.
	 */
	dateY?: string;

	/**
	 * Name of the field in data that holds open numeric value for horizontal
	 * axis.
	 */
	openValueX?: string;

	/**
	 * Name of the field in data that holds open numeric value for vertical
	 * axis.
	 */
	openValueY?: string;

	/**
	 * Name of the field in data that holds open category for horizontal axis.
	 */
	openCategoryX?: string;

	/**
	 * Name of the field in data that holds open category for vertical axis.
	 */
	openCategoryY?: string;

	/**
	 * Name of the field in data that holds open date for horizontal axis.
	 */
	openDateX?: string;

	/**
	 * Name of the field in data that holds open date for vertical axis.
	 */
	openDateY?: string;

	/**
	 * Which calculated field to use to use as a horizontal axis value for the
	 * item.
	 */
	valueXShow?: CalculatedValue;

	/**
	 * Which calculated field to use to use as a vertical axis value for the
	 * item.
	 */
	valueYShow?: CalculatedValue;

	/**
	 * Which calculated field to use to use as a horizontal axis open value for
	 * the item.
	 */
	openValueXShow?: CalculatedValue;

	/**
	 * Which calculated field to use to use as a vertical axis open value for
	 * the item.
	 */
	openValueYShow?: CalculatedValue;

	/**
	 * Name of the field in data that holds numeric value for some custom data.
	 */
	customValue?: string;
}


/**
 * Defines types of the aggregate value.
 *
 * @since 4.7.0
 */
export type GroupField = "open" | "close" | "low" | "high" | "average" | "sum";

/**
 * Defines data fields that can be calculated for aggregate values.
 * 
 * @since 4.7.0
 */
export interface IXYSeriesGroupFields {

	/**
	 * Indicates how to calculate aggregate value for `valueX` data field.
	 *
	 * @default "close"
	 */
	valueX?: GroupField;

	/**
	 * Indicates how to calculate aggregate value for `valueY` data field.
	 * 
	 * @default "close"
	 */
	valueY?: GroupField;

	/**
	 * Indicates how to calculate aggregate value for `customValue` value data field.
	 * 
	 * @default "close"
	 */
	customValue?: GroupField;

	/**
	 * Indicates how to calculate aggregate value for `openValueX` data field.
	 * 
	 * @default "open"
	 */
	openValueX?: GroupField;

	/**
	 * Indicates how to calculate aggregate value for `openValueY` data field.
	 * 
	 * @default "open"
	 */
	openValueY?: GroupField;
}

/**
 * Defines properties for [[XYSeries]].
 */
export interface IXYSeriesProperties extends ISeriesProperties {

	/**
	 * Can items from this series be included into stacks?
	 *
	 * @default false
	 */
	stacked?: boolean;

	/**
	 * Should the nearest tooltip be shown if no data item is found on the
	 * current cursor position
	 *
	 * @default false
	 */
	snapTooltip?: boolean;

	/**
	 * Indicates if series should display a tooltip for chart's cursor.
	 *
	 * @default true
	 */
	cursorTooltipEnabled?: boolean;

	/**
	 * Indicates if series should apply hover state on bullets/columns/etc when
	 * cursor is over the data item.
	 * 
	 * @default true
	 */
	cursorHoverEnabled?: boolean;

	/**
	 * Indicates if series' values should be excluded when calculating totals.
	 * 
	 * @default false
	 */
	excludeFromTotal?: boolean;


	/**
	 * Indicates if series' tooltip should be hidden while series axis range is
	 * animating (zooming)
	 *
	 * @since 4.7.16
	 * @default true
	 */
	hideTooltipWhileZooming?: boolean;

	/**
	 * Should series bullets be masked?
	 * @default true
	 * @since 4.7.17
	 */
	maskBullets?: boolean;
}

/**
 * Defines events for [[XYSeries]].
 */
export interface IXYSeriesEvents extends ISeriesEvents {
	/**
	 * Invoked when series tooltip was shown on some particular data item
	 */
	tooltipshownat: XYSeriesTooltipEvent;
}

/**
 * Defines adapters for [[XYSeries]].
 *
 * @see {@link Adapter}
 */
export interface IXYSeriesAdapters extends ISeriesAdapters, IXYSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines Series for [[XYChart]].
 *
 * @see {@link IXYSeriesEvents} for a list of available Events
 * @see {@link IXYSeriesAdapters} for a list of available Adapters
 * @important
 */
export class XYSeries extends Series {

	/**
	 * Defines type of the group fields.
	 * 
	 * @ignore
	 * @since 4.7.0
	 */
	public _groupFields: IXYSeriesGroupFields;

	/**
	 * Indicates which of the series' `dataFields` to calculate aggregate values
	 * for.
	 *
	 * Available data fields for all [[XYSeries]] are:
	 * `valueX`, `valueY`, `openValueX`, and `openValueY`.
	 *
	 * [[CandlestickSeries]] adds:
	 * `lowValueX`, `lowValueY`, `highValueX`, and `highValueY`.
	 *
	 * Available options:
	 * `"open"`, `"close"`, `"low"`, `"high"`, "average", `"sum"`.
	 *
	 * Defaults are as follows:
	 * * `valueX`: `"close"`
	 * * `valueY`: `"close"`
	 * * `openValueX`: `"open"`
	 * * `openValueY`: `"open"`
	 * * `lowValueX`: `"low"`
	 * * `lowValueY`: `"low"`
	 * * `highValueX`: `"high"`
	 * * `highValueY`: `"high"`
	 *
	 * Is required only if data being plotted on a `DateAxis` and
	 * its `groupData` is set to `true`.
	 *
	 * ```TypeScript
	 * let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
	 * dateAxis.groupData = true;
	 *
	 * let valueAxis = chart.xAxes.push(new am4charts.valueAxis());
	 *
	 * let series = chart.series.push(new am4charts.LineSeries());
	 * series.dataFields.dateX = "date";
	 * series.dataFields.valueY = "value";
	 * series.groupFields.valueY = "average";
	 * ```
	 * ```JavaScript
	 * var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
	 * dateAxis.groupData = true;
	 *
	 * var valueAxis = chart.xAxes.push(new am4charts.valueAxis());
	 *
	 * var series = chart.series.push(new am4charts.LineSeries());
	 * series.dataFields.dateX = "date";
	 * series.dataFields.valueY = "value";
	 * series.groupFields.valueY = "average";
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "xAxes": [{
	 *     "type": "DateAxis",
	 *     "groupData": true
	 *   }],
	 *   "yAxes": [{
	 *     "type": "ValueAxis"
	 *   }],
	 *   "series": [{
	 *     "type": "LineSeries",
	 *     "dataFields": {
	 *       "dateX": "date",
	 *       "valueY": "value"
	 *     },
	 *     "groupFields": {
	 *       "valueY": "average"
	 *     }
	 *   }]
	 * }
	 * ```
	 *
	 * The above setup will ensure, that if there are many data items within
	 * selected range, they will be grouped into aggregated data points, using
	 * average value of all the values.
	 *
	 * For example if we have 2 years worth of daily data (~700 data items), when
	 * fully zoomed out, the chart would show ~100 data items instead: one for
	 * each week in those two years.
	 *
	 * Grouping will occur automatically, based on current selection range, and
	 * will change dynamically when user zooms in/out the chart.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Dynamic_data_item_grouping} for more information about dynamic data item grouping.
	 * @since 4.7.0
	 */
	public groupFields: this["_groupFields"] = {};

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: IXYSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IXYSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IXYSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IXYSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: XYSeriesDataItem;

	/**
	 * X axis the series is attached to.
	 */
	protected _xAxis = new MutableValueDisposer<Axis<AxisRenderer>>();

	/**
	 * Y axis the series is attached to.
	 */
	protected _yAxis = new MutableValueDisposer<Axis<AxisRenderer>>();

	/**
	 * A chart series belongs to.
	 */
	public _chart: XYChart;

	/**
	 * The main (base) axis.
	 *
	 * This is the axis that series fills will go to, or grow animations will
	 * happen from.
	 */
	protected _baseAxis: Axis;

	/**
	 * Total data item count.
	 */
	protected _count: Dictionary<string, number>;

	/**
	 * Data item count in current selection.
	 */
	protected _scount: Dictionary<string, number>;

	/**
	 * [_xField description]
	 *
	 * @todo Description
	 */
	protected _xField: string;

	/**
	 * [_yField description]
	 *
	 * @todo Description
	 */
	protected _yField: string;

	/**
	 * [_xOpenField description]
	 *
	 * @todo Description
	 */
	protected _xOpenField: string;

	/**
	 * [_yOpenField description]
	 *
	 * @todo Description
	 */
	protected _yOpenField: string;

	/**
	 * [_tooltipXField description]
	 *
	 * @todo Description
	 */
	protected _tooltipXField: string;

	/**
	 * [_tooltipYField description]
	 *
	 * @todo Description
	 */
	protected _tooltipYField: string;

	/**
	 * [_xValueFields description]
	 *
	 * @todo Description
	 */
	protected _xValueFields: Array<string> = [];

	/**
	 * [_yValueFields description]
	 *
	 * @todo Description
	 */
	protected _yValueFields: Array<string> = [];

	/**
	 * Series which is stacked on top of this series, if any.
	 *
	 * @ignore Exclude from docs
	 */
	public stackedSeries: XYSeries;

	/**
	 * Dataitem of previously shown tooltip, used to avoid multiple
	 * tooltipshownat dispatches.
	 */
	protected _prevTooltipDataItem: XYSeriesDataItem;

	/**
	 * @ignore
	 */
	public _baseInterval: { [index: string]: ITimeInterval } = {};


	/**
	 * @ignore
	 */
	public dataGrouped = false;

	/**
	 * @ignore
	 */
	public usesShowFields: boolean = false;

	/**
	 * @ignore
	 */
	protected _dataSetChanged: boolean = false;


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "XYSeries";
		this.isMeasured = false;


		this.groupFields.valueX = "close";
		this.groupFields.valueY = "close";
		this.groupFields.customValue = "close";

		this.groupFields.openValueX = "open";
		this.groupFields.openValueY = "open";

		this.cursorTooltipEnabled = true;

		this.cursorHoverEnabled = true;
		this.excludeFromTotal = false;

		this.mainContainer.mask = new Sprite();
		this.mainContainer.mask.setElement(this.paper.add("path"));

		this.stacked = false;
		this.snapTooltip = false;

		this.tooltip.pointerOrientation = "horizontal";

		this.hideTooltipWhileZooming = true;
		this.maskBullets = true;

		this.tooltip.events.on("hidden", () => {
			this.returnBulletDefaultState();
		}, undefined, false)

		this._disposers.push(this._xAxis);
		this._disposers.push(this._yAxis);

		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("X/Y Series");
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new XYSeriesDataItem();
	}

	/**
	 * @ignore
	 */
	public dataChangeUpdate() {
		this._tmin.clear();
		this._tmax.clear();

		this._smin.clear();
		this._smax.clear();

		if (this.xAxis) {
			this.xAxis.seriesDataChangeUpdate(this);
		}

		if (this.yAxis) {
			this.yAxis.seriesDataChangeUpdate(this);
		}
	}

	/**
	 * (Re)validates the series' data.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {
		this._baseInterval = {};
		let dataFields = this.dataFields;
		if (dataFields.valueYShow || dataFields.openValueXShow || dataFields.openValueXShow || dataFields.openValueYShow) {
			this.usesShowFields = true;
		}
		else {
			this.usesShowFields = false;
		}

		this.defineFields();

		if (this.data.length > 0) {
			this.dataChangeUpdate();
		}

		super.validateData();

		this.updateItemReaderText();
		if (this.chart) {
			if (!$type.hasValue(this.dataFields[<keyof this["_dataFields"]>this._xField]) || !$type.hasValue(this.dataFields[<keyof this["_dataFields"]>this._yField])) {
				throw Error("Data fields for series \"" + (this.name ? this.name : this.uid) + "\" are not properly defined.");
			}
		}

		this.dataGrouped = false;
	}

	/**
	 * Processes data item.
	 *
	 * @param dataItem     Data item
	 * @param dataContext  Raw data
	 * @param index        Index of the data item
	 */
	protected processDataItem(dataItem: this["_dataItem"], dataContext?: Object): void {
		try {
			super.processDataItem(dataItem, dataContext);

			this.xAxis.processSeriesDataItem(dataItem, "X");
			this.yAxis.processSeriesDataItem(dataItem, "Y");

			this.setInitialWorkingValues(dataItem);
		}
		catch (e) {
			if (this._chart) {
				this._chart.raiseCriticalError(e);
			}
		}
	}

	/**
	 *
	 * When validating raw data, instead of processing data item, we update it
	 *
	 * @ignore Exclude from docs
	 * @param item
	 */
	protected updateDataItem(dataItem: this["_dataItem"]): void {
		super.updateDataItem(dataItem);

		//dataItem.events.disable();
		this.xAxis.processSeriesDataItem(dataItem, "X");
		this.yAxis.processSeriesDataItem(dataItem, "Y");
		//dataItem.events.enable();		
	}


	/**
	 * Inits data item's working values.
	 *
	 * @param dataItem  Data item
	 * @param index     Data item's index
	 */

	protected setInitialWorkingValues(dataItem: this["_dataItem"]): void {

	}

	/**
	 * @ignore
	 */
	public disposeData() {
		super.disposeData();
		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		if (xAxis) {
			let dataItemsX = this.dataItemsByAxis.getKey(xAxis.uid);
			if (dataItemsX) {
				dataItemsX.clear();
			}
			if (xAxis instanceof CategoryAxis) {
				this.clearCatAxis(xAxis);
			}
		}
		if (yAxis) {
			let dataItemsY = this.dataItemsByAxis.getKey(yAxis.uid);
			if (dataItemsY) {
				dataItemsY.clear();
			}
			if (yAxis instanceof CategoryAxis) {
				this.clearCatAxis(yAxis);
			}
		}
	}

	/**
	 * @ignore
	 */
	protected clearCatAxis(axis: CategoryAxis) {
		let uid = this.uid;
		axis.dataItems.each((dataItem) => {
			if (dataItem.seriesDataItems[uid]) {
				dataItem.seriesDataItems[uid] = [];
			}
		})
	}


	/**
	 * Sets up which data fields to use for data access.
	 */
	protected defineFields() {
		let xAxis: Axis = this.xAxis;
		let yAxis: Axis = this.yAxis;
		if (xAxis && yAxis) {
			let xAxisFieldName: string = xAxis.axisFieldName;
			let xField: $type.Keyof<this["_dataFields"]> = <$type.Keyof<this["_dataFields"]>>(xAxisFieldName + "X");
			let xOpenField: $type.Keyof<this["_dataFields"]> = <$type.Keyof<this["_dataFields"]>>("open" + $utils.capitalize(xAxisFieldName) + "X");

			let yAxisFieldName: string = yAxis.axisFieldName;
			let yField: $type.Keyof<this["_dataFields"]> = <$type.Keyof<this["_dataFields"]>>(yAxisFieldName + "Y");
			let yOpenField: $type.Keyof<this["_dataFields"]> = <$type.Keyof<this["_dataFields"]>>("open" + $utils.capitalize(yAxisFieldName) + "Y");

			this._xField = xField;
			this._yField = yField;

			if (this.dataFields[xOpenField]) {
				this._xOpenField = xOpenField;
			}

			if (this.dataFields[yOpenField]) {
				this._yOpenField = yOpenField;
			}

			if (!this.dataFields[yOpenField] && this.baseAxis == yAxis) {
				this._yOpenField = yField;
			}

			if (!this.dataFields[xOpenField] && this.baseAxis == xAxis) {
				this._xOpenField = xField;
			}

			if (this.stacked && this.baseAxis == xAxis) {
				this._xOpenField = xField;
			}

			if (this.stacked && this.baseAxis == yAxis) {
				this._yOpenField = yField;
			}

			if ((xAxis instanceof CategoryAxis) && (yAxis instanceof CategoryAxis)) {
				if (!this._yOpenField) {
					this._yOpenField = yField;
				}
			}

			this._xValueFields = [];
			this._yValueFields = [];

			this.addValueField(xAxis, <any>this._xValueFields, <any>this._xField);
			this.addValueField(xAxis, <any>this._xValueFields, <any>this._xOpenField);

			this.addValueField(yAxis, <any>this._yValueFields, <any>this._yField);
			this.addValueField(yAxis, <any>this._yValueFields, <any>this._yOpenField);
		}
	}

	/**
	 * [axis description]
	 *
	 * @todo Description
	 * @param axis    Axis
	 * @param fields  Fields (?)
	 * @param field   Field
	 */
	protected addValueField<Key extends keyof this["_dataFields"]>(axis: Axis, fields: Array<Key>, field: Key): void {
		if (axis instanceof ValueAxis) {
			if ($type.hasValue(this.dataFields[field]) && fields.indexOf(field) == -1) {
				fields.push(field);
			}
		}
	}

	/**
	 * Sets category field from the category axis.
	 *
	 * User might set field for category axis only, but not for series. In such
	 * case, we take field value from axis and set it for series.
	 *
	 * @param field  Field
	 * @param axis   Axis
	 */
	protected setCategoryAxisField<Key extends keyof this["_dataFields"]>(field: Key, axis: CategoryAxis): void {
		if (!$type.hasValue(this.dataFields[field])) {
			this.dataFields[field] = <any>axis.dataFields.category;
		}
	}

	/**
	 * Sets date field from the date axis.
	 *
	 * User might set field for category axis only, but not for series. In such
	 * case, we take field value from axis and set it for series.
	 *
	 * @param field  Field
	 * @param axis   Axis
	 */
	protected setDateAxisField<Key extends keyof this["_dataFields"]>(field: Key, axis: DateAxis): void {
		if (!$type.hasValue(this.dataFields[field])) {
			this.dataFields[field] = <any>axis.dataFields.date;
		}
	}

	/**
	 * Performs after-draw tasks, e.g. creates masks.
	 */
	protected afterDraw(): void {
		super.afterDraw();
		this.createMask();
	}

	/**
	 * Create a mask for the series.
	 *
	 * @ignore Exclude from docs
	 */
	public createMask(): void {
		// this mask from which we cut out ranges. does not work well if ranges overlap.
		if (this.mainContainer.mask) {
			let path: string = this.getMaskPath();

			// @todo: this approach won't work well on circluar or other non x/y axes
			$iter.each(this.axisRanges.iterator(), (range) => {
				if (range.axisFill.fillPath) {
					range.axisFill.validate();
					path += range.axisFill.fillPath;
				}
			});

			this.mainContainer.mask.path = path;
		}
	}

	/**
	 * Returns an SVG path to use as series mask.
	 *
	 * @return SVG path
	 */
	protected getMaskPath(): string {
		if (this.xAxis && this.yAxis) {
			return $path.rectToPath({
				x: 0,
				y: 0,
				width: this.xAxis.axisLength,
				height: this.yAxis.axisLength
			});
		}
		return "";
	}

	/**
	 * Returns axis data field to use.
	 *
	 * @param axis  Axis
	 * @return Field name
	 */
	public getAxisField(axis: Axis): string {
		if (axis == this.xAxis) {
			return this.xField;
		}
		if (axis == this.yAxis) {
			return this.yField;
		}
	}

	/**
	 * Validates data items.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataItems() {

		// this helps date axis to check which baseInterval we should use
		let xAxis = this.xAxis;
		let yAxis = this.yAxis;
		if (xAxis && yAxis) {
			xAxis.updateAxisBySeries();
			yAxis.updateAxisBySeries();
		}

		super.validateDataItems();

		if (xAxis && yAxis) {
			xAxis.postProcessSeriesDataItems();
			yAxis.postProcessSeriesDataItems();
		}
	}

	/**
	 * Validates data range.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataRange() {
		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		if (xAxis && yAxis) {
			if (xAxis.dataRangeInvalid) {
				xAxis.validateDataRange();
			}

			if (yAxis.dataRangeInvalid) {
				yAxis.validateDataRange();
			}
		}

		super.validateDataRange();
	}

	/**
	 * (Re)validates the whole series, effectively causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {

		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		if (xAxis && yAxis) {
			if (xAxis.invalid) {
				xAxis.validate();
			}

			if (yAxis.invalid) {
				yAxis.validate();
			}

			this.y = yAxis.pixelY;
			this.x = xAxis.pixelX;


			this._showBullets = true;
			let minBulletDistance: number = this.minBulletDistance;
			if ($type.isNumber(minBulletDistance)) {
				if (this.baseAxis.axisLength / (this.endIndex - this.startIndex) < minBulletDistance) {
					this._showBullets = false;
				}
			}
		}

		super.validate();
	}

	/**
	 * X axis the series is attached to.
	 *
	 * @param axis  Axis
	 */
	public set xAxis(axis: Axis) {
		this.setXAxis(axis);
	}

	protected setXAxis(axis: Axis) {
		let oldAxis = this._xAxis.get();
		if (oldAxis != axis) {
			if (oldAxis) {
				this.dataItemsByAxis.removeKey(oldAxis.uid);
				// TODO why is this here ?
				this._xAxis.dispose();
				// temp @todo: why it is not disposed?
				oldAxis.series.removeValue(this);
			}

			this._xAxis.set(axis, axis.registerSeries(this));

			this.dataItemsByAxis.setKey(axis.uid, new Dictionary<string, this["_dataItem"]>());
			this.invalidateData();
		}
	}

	/**
	 * @return Axis
	 */
	public get xAxis(): Axis {
		if (this.chart) {
			if (!this._xAxis.get()) {
				const axis = this.chart.xAxes.getIndex(0);

				if (!axis) {
					throw Error("There are no X axes on chart.");
				}

				this.xAxis = axis;
			}
			return this._xAxis.get();
		}
	}

	/**
	 * Y axis the series is attached to.
	 *
	 * @param axis  Axis
	 */
	public set yAxis(axis: Axis) {
		this.setYAxis(axis);
	}

	protected setYAxis(axis: Axis) {
		let oldAxis = this._yAxis.get();
		if (oldAxis != axis) {
			if (oldAxis) {
				this.dataItemsByAxis.removeKey(oldAxis.uid);
				// TODO why is this here ?
				this._yAxis.dispose();
				// temp @todo: why it is not disposed?
				oldAxis.series.removeValue(this);
			}

			this._yAxis.set(axis, axis.registerSeries(this));

			if (axis.chart instanceof XYChart) {
				axis.chart.handleYAxisSet(this);
			}

			this.dataItemsByAxis.setKey(axis.uid, new Dictionary<string, this["_dataItem"]>());
			this.invalidateData();
		}
	}

	/**
	 * @return Axis
	 */
	public get yAxis(): Axis {
		if (this.chart) {
			if (!this._yAxis.get()) {
				const axis = this.chart.yAxes.getIndex(0);

				if (!axis) {
					throw Error("There are no Y axes on chart.");
				}

				this.yAxis = axis;
			}

			return this._yAxis.get();
		}
	}

	/**
	 * The main (base) axis.
	 *
	 * This is the axis that series fills will go to, or grow animations will
	 * happen from.
	 *
	 * @param value  Axis
	 */
	public set baseAxis(value: Axis) {
		if (this._baseAxis != value) {
			this._baseAxis = value;
			this.invalidate();
		}
	}

	/**
	 * @return Axis
	 */
	public get baseAxis(): Axis {
		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		if (!this._baseAxis && xAxis && yAxis) {
			if (yAxis instanceof DateAxis) {
				this._baseAxis = yAxis;
			}

			if (xAxis instanceof DateAxis) {
				this._baseAxis = xAxis;
			}

			if (yAxis instanceof CategoryAxis) {
				this._baseAxis = yAxis;
			}

			if (xAxis instanceof CategoryAxis) {
				this._baseAxis = xAxis;
			}

			if (!this._baseAxis) {
				this._baseAxis = xAxis;
			}
		}
		return this._baseAxis;
	}

	/**
	 * Makes the chart use particular data set.
	 *
	 * If `id` is not provided or there is no such data set, main data will be
	 * used.
	 *
	 * @ignore
	 * @since 4.7.0
	 * @param  id  Data set id
	 */
	public setDataSet(id: string): boolean {
		let changed = super.setDataSet(id);
		if (changed) {
			this._dataSetChanged = true;
			let dataItems = this.dataItems;

			this._tmax.clear();
			this._tmin.clear();

			this._smax.clear();
			this._smin.clear();

			let xAxis = this.xAxis;
			let yAxis = this.yAxis;

			this._prevStartIndex = undefined;
			this._prevEndIndex = undefined;

			//this.processValues(false); // this will slow down!

			if (xAxis instanceof DateAxis && xAxis == this.baseAxis) {
				this._tmin.setKey(xAxis.uid, dataItems.getIndex(0).dateX.getTime());
				this._tmax.setKey(xAxis.uid, dataItems.getIndex(dataItems.length - 1).dateX.getTime());
				this.dispatch("extremeschanged");
			}

			if (yAxis instanceof DateAxis && yAxis == this.baseAxis) {
				this._tmin.setKey(yAxis.uid, dataItems.getIndex(0).dateY.getTime());
				this._tmax.setKey(yAxis.uid, dataItems.getIndex(dataItems.length - 1).dateY.getTime());
				this.dispatch("extremeschanged");
			}
		}

		return changed
	}


	/**
	 * Processes values after data items' were added.
	 *
	 * @ignore Exclude from docs
	 * @param dataItems  Data items
	 */
	public processValues(working: boolean): void {
		super.processValues(working);

		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		if (!xAxis || !yAxis) {
			return;
		}

		let dataItems = this.dataItems;

		let minX = Infinity;
		let maxX = - Infinity;

		let minY = Infinity;
		let maxY = - Infinity;

		let startIndex = this.startIndex;
		let endIndex = this.endIndex;

		let workingStartIndex = startIndex;
		let workingEndIndex = endIndex;

		if (!working) {
			startIndex = 0;
			endIndex = this.dataItems.length;
		}

		for (let i = startIndex; i < endIndex; i++) {
			let dataItem = dataItems.getIndex(i);

			this.getStackValue(dataItem, working);

			let stackX = dataItem.getValue("valueX", "stack");
			let stackY = dataItem.getValue("valueY", "stack");

			minX = $math.min(dataItem.getMin(this._xValueFields, working, stackX), minX);
			minY = $math.min(dataItem.getMin(this._yValueFields, working, stackY), minY);

			maxX = $math.max(dataItem.getMax(this._xValueFields, working, stackX), maxX);
			maxY = $math.max(dataItem.getMax(this._yValueFields, working, stackY), maxY);

			// if it's stacked, pay attention to stack value
			if (this.stacked) {
				if (this.baseAxis == xAxis) {
					if (stackY < minY) {
						minY = stackY
					}
					if (stackY > maxY) {
						maxY = stackY;
					}
				}
				if (this.baseAxis == yAxis) {
					if (stackX < minX) {
						minX = stackX;
					}
					if (stackX > maxX) {
						maxX = stackX;
					}
				}
			}
		}


		// this is mainly for value axis to calculate total and perecent.total of each series category
		xAxis.processSeriesDataItems();
		yAxis.processSeriesDataItems();

		let xAxisId: string = xAxis.uid;
		let yAxisId: string = yAxis.uid;

		if (this.xAxis instanceof ValueAxis && (minX == Infinity || maxX == -Infinity)) {
			return;
		}

		if (this.yAxis instanceof ValueAxis && (minY == Infinity || maxY == -Infinity)) {
			return;
		}

		if (!working) {
			if (this._tmin.getKey(xAxisId) != minX || this._tmax.getKey(xAxisId) != maxX || this._tmin.getKey(yAxisId) != minY || this._tmax.getKey(yAxisId) != maxY) {
				this._tmin.setKey(xAxisId, minX);
				this._tmax.setKey(xAxisId, maxX);
				this._tmin.setKey(yAxisId, minY);
				this._tmax.setKey(yAxisId, maxY);

				let stackedSeries = this.stackedSeries;
				if (stackedSeries) {
					if (stackedSeries.isDisposed()) {
						this.stackedSeries = undefined;
					}
					else {
						stackedSeries.processValues(false);
					}
				}

				this.dispatchImmediately("extremeschanged");
			}
		}

		if (startIndex != workingStartIndex || endIndex != workingEndIndex) {
			minX = Infinity;
			maxX = - Infinity;

			minY = Infinity;
			maxY = - Infinity;

			for (let i = workingStartIndex; i < workingEndIndex; i++) {
				let dataItem = dataItems.getIndex(i);

				this.getStackValue(dataItem, working);

				let stackX = dataItem.getValue("valueX", "stack");
				let stackY = dataItem.getValue("valueY", "stack");

				minX = $math.min(dataItem.getMin(this._xValueFields, working, stackX), minX);

				minY = $math.min(dataItem.getMin(this._yValueFields, working, stackY), minY);

				maxX = $math.max(dataItem.getMax(this._xValueFields, working, stackX), maxX);
				maxY = $math.max(dataItem.getMax(this._yValueFields, working, stackY), maxY);

				// if it's stacked, pay attention to stack value
				if (this.stacked) {
					if (this.baseAxis == xAxis) {
						if (stackY < minY) {
							minY = stackY
						}
						if (stackY > maxY) {
							maxY = stackY;
						}
					}
					if (this.baseAxis == yAxis) {
						if (stackX < minX) {
							minX = stackX;
						}
						if (stackX > maxX) {
							maxX = stackX;
						}
					}
				}
			}
		}

		if (this.xAxis instanceof ValueAxis && (minX == Infinity || maxX == -Infinity)) {
			return;
		}

		if (this.yAxis instanceof ValueAxis && (minY == Infinity || maxY == -Infinity)) {
			return;
		}

		if (this._smin.getKey(xAxisId) != minX || this._smax.getKey(xAxisId) != maxX || this._smin.getKey(yAxisId) != minY || this._smax.getKey(yAxisId) != maxY) {

			this._smin.setKey(xAxisId, minX);
			this._smax.setKey(xAxisId, maxX);
			this._smin.setKey(yAxisId, minY);
			this._smax.setKey(yAxisId, maxY);

			if (this.appeared || this.start != 0 || this.end != 1 || this.dataItems != this.mainDataSet) {

				/// new, helps to handle issues with change percent
				let changed = false;

				if (yAxis instanceof ValueAxis && !(yAxis instanceof DateAxis)) {
					let tmin = this._tmin.getKey(yAxisId);

					if (!$type.isNumber(tmin) || ((this.usesShowFields || this._dataSetChanged) && minY < tmin) || this.stackedSeries) {
						this._tmin.setKey(yAxisId, minY);
						changed = true;
					}
					let tmax = this._tmax.getKey(yAxisId);
					if (!$type.isNumber(tmax) || ((this.usesShowFields || this._dataSetChanged) && maxY > tmax) || this.stackedSeries) {
						this._tmax.setKey(yAxisId, maxY);
						changed = true;
					}
				}

				if (xAxis instanceof ValueAxis && !(xAxis instanceof DateAxis)) {
					let tmin = this._tmin.getKey(xAxisId);
					if (!$type.isNumber(tmin) || ((this.usesShowFields || this._dataSetChanged) && minX < tmin) || this.stackedSeries) {
						this._tmin.setKey(xAxisId, minX);
						changed = true;
					}
					let tmax = this._tmax.getKey(xAxisId);
					if (!$type.isNumber(tmax) || ((this.usesShowFields || this._dataSetChanged) && maxX > tmax) || this.stackedSeries) {
						this._tmax.setKey(xAxisId, maxX);
						changed = true;
					}
				}


				if (changed) {
					this.dispatchImmediately("extremeschanged");
				}

				if (this.start == 0 && this.end == 1) {
					// yes, its ok. otherwise min/max won't be updated when zooming out
					this._dataSetChanged = false;
				}

				this.dispatchImmediately("selectionextremeschanged");
			}
		}

		if (!working && this.stacked) {
			this.processValues(true);
		}
	}

	/**
	 * Hides element's [[Tooltip]].
	 *
	 * @see {@link Tooltip}
	 */
	public hideTooltip() {
		super.hideTooltip();
		this.returnBulletDefaultState();
		this._prevTooltipDataItem = undefined;
	}


	/**
	 * Shows series tooltip at specific position.
	 *
	 * @param xPosition  X
	 * @param yPosition  Y
	 */
	public showTooltipAtPosition(xPosition: number, yPosition: number): IPoint {

		let dataItem: this["_dataItem"];

		if (this.visible && !this.isHiding && !this.isShowing) {

			let xAxis: Axis = this._xAxis.get();
			let yAxis: Axis = this._yAxis.get();

			if (xAxis == this.baseAxis) {
				dataItem = <this["_dataItem"]>xAxis.getSeriesDataItem(this, xAxis.toAxisPosition(xPosition), this.snapTooltip);
			}
			if (yAxis == this.baseAxis) {
				dataItem = <this["_dataItem"]>yAxis.getSeriesDataItem(this, yAxis.toAxisPosition(yPosition), this.snapTooltip);
			}

			let point = this.showTooltipAtDataItem(dataItem);

			if (point) {
				return point;
			}

			// so that if tooltip is shown on columns or bullets for it not to be hidden
			if (!this.tooltipText) {
				return;
			}
		}

		this.hideTooltip();
	}

	protected getAdjustedXLocation(dataItem: this["_dataItem"], field: string) {
		return dataItem.locations[field];
	}

	protected getAdjustedYLocation(dataItem: this["_dataItem"], field: string) {
		return dataItem.locations[field];
	}


	/**
	 * Shows series tooltip at specific dataItem.
	 *
	 * @param dataItem
	 */
	public showTooltipAtDataItem(dataItem: this["_dataItem"]): IPoint {

		let cursor = <XYCursor>this.chart.cursor;
		if (cursor && cursor.hideSeriesTooltipsOnSelection && cursor.selection.visible && cursor.downPoint) {
			this.hideTooltip();
			return;
		}

		this.returnBulletDefaultState(dataItem);
		if (dataItem && dataItem.visible) {

			this.updateLegendValue(dataItem);
			if (this.cursorTooltipEnabled) {
				this.tooltipDataItem = dataItem;

				// todo: add tooltipXField and tooltipYField.
				let tooltipXField = this.tooltipXField;
				let tooltipYField = this.tooltipYField;

				if ($type.hasValue((<any>dataItem)[tooltipXField]) && $type.hasValue((<any>dataItem)[tooltipYField])) {

					let tooltipPoint = this.getPoint(dataItem, tooltipXField, tooltipYField, this.getAdjustedXLocation(dataItem, tooltipXField), this.getAdjustedYLocation(dataItem, tooltipYField));

					if (tooltipPoint) {

						this.tooltipX = tooltipPoint.x;
						this.tooltipY = tooltipPoint.y;

						if (this._prevTooltipDataItem != dataItem) {
							this.dispatchImmediately("tooltipshownat", {
								type: "tooltipshownat",
								target: this,
								dataItem: dataItem
							});

							this._prevTooltipDataItem = dataItem;
						}

						if (this.cursorHoverEnabled) {
							for (let sprite of dataItem.sprites) {
								if (!sprite.parent.visible || sprite.isHidden || sprite.__disabled || sprite.disabled || sprite.isHiding) {

								}
								else {
									sprite.isHover = true;
								}
							}
						}

						if (this.showTooltip()) {
							return $utils.spritePointToSvg({ x: tooltipPoint.x, y: tooltipPoint.y }, this);
						}
						return;
					}
				}
			}
		}
		else {
			this.updateLegendValue(dataItem, true);
		}
	}
	/**
	 * returns default state to bullets when tooltip is shown at some other data item or hidden
	 *
	 * @ignore Exclude from docs
	 */
	protected returnBulletDefaultState(dataItem?: XYSeriesDataItem) {
		if (this._prevTooltipDataItem && this._prevTooltipDataItem != dataItem) {
			for (let sprite of this._prevTooltipDataItem.sprites) {
				if (!sprite.isDisposed()) {
					sprite.isHover = false;
				}
				else {
					this._prevTooltipDataItem = undefined;
				}
			}
		}
	}


	protected shouldCreateBullet(dataItem: this["_dataItem"], bulletTemplate: Bullet): boolean {
		// use series xField/yField if bullet doesn't have fields set
		let xField: string = bulletTemplate.xField;
		if (!$type.hasValue(xField)) {
			xField = this.xField;
		}

		let yField: string = bulletTemplate.yField;
		if (!$type.hasValue(yField)) {
			yField = this.yField;
		}

		if ((this.xAxis instanceof ValueAxis && !dataItem.hasValue([xField])) || (this.yAxis instanceof ValueAxis && !dataItem.hasValue([yField]))) {
			return false;
		}

		if (bulletTemplate.disabled) {
			let disabledField = bulletTemplate.propertyFields.disabled;
			let dataContext = <any>dataItem.dataContext;
			if (dataContext && dataContext[disabledField] === false) {
				return true;
			}
			else {
				return false;
			}
		}

		return true;
	}


	public positionBullet(bullet: Bullet) {
		super.positionBullet(bullet);

		let dataItem: XYSeriesDataItem = <XYSeriesDataItem>bullet.dataItem;

		// use series xField/yField if bullet doesn't have fields set
		let xField: string = bullet.xField;
		if (!$type.hasValue(xField)) {
			xField = this.xField;
		}

		let yField: string = bullet.yField;
		if (!$type.hasValue(yField)) {
			yField = this.yField;
		}

		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		if ((xAxis instanceof ValueAxis && !dataItem.hasValue([xField])) || (yAxis instanceof ValueAxis && !dataItem.hasValue([yField]))) {
			bullet.visible = false;
		}
		else {
			let bulletLocationX: number = this.getBulletLocationX(bullet, xField);
			let bulletLocationY: number = this.getBulletLocationY(bullet, yField);

			let point = this.getPoint(dataItem, xField, yField, bulletLocationX, bulletLocationY);
			if (point) {
				let xOpenField = this.xOpenField;
				let yOpenField = this.yOpenField;

				let positionX: number;
				let positionY: number;


				if (xAxis instanceof DateAxis) {

					if (!$type.isNumber(bulletLocationX)) {
						bulletLocationX = 0;
					}

					let openValue: number;
					let closeValue: number = dataItem.getWorkingValue(xField);

					if (!xOpenField) {
						if (xAxis == this.baseAxis) {
							openValue = xAxis.baseValue;
						}
					}
					else {
						openValue = dataItem.getWorkingValue(xOpenField);
					}

					if (!$type.isNumber(openValue)) {
						openValue = closeValue;
					}

					let stack: number = dataItem.getValue("valueX", "stack");
					openValue += stack;
					closeValue += stack;

					if (openValue == closeValue) {
						let baseInterval = xAxis.baseInterval;
						let dateFormatter = xAxis.dateFormatter;
						openValue = $time.round(new Date(openValue), baseInterval.timeUnit, baseInterval.count, dateFormatter.firstDayOfWeek, dateFormatter.utc).getTime();
						closeValue = $time.add(new Date(openValue), baseInterval.timeUnit, baseInterval.count, dateFormatter.utc).getTime();
					}

					let middleValue: number;
					if (xAxis == this.baseAxis) {
						middleValue = openValue + (closeValue - openValue) * bulletLocationX;
					}
					else {
						middleValue = openValue + (closeValue - openValue) * (1 - bulletLocationX);
					}

					positionX = xAxis.valueToPosition(middleValue);
				}
				else if (xAxis instanceof ValueAxis) {

					if (!$type.isNumber(bulletLocationX)) {
						bulletLocationX = 0;
					}

					let openValue: number;
					let closeValue: number = dataItem.getWorkingValue(xField);

					if (!xOpenField) {
						openValue = xAxis.baseValue;
					}
					else {
						openValue = dataItem.getWorkingValue(xOpenField);
					}

					let stack: number = dataItem.getValue("valueX", "stack");
					openValue += stack;
					closeValue += stack;

					let middleValue = openValue + (closeValue - openValue) * (1 - bulletLocationX);

					positionX = xAxis.valueToPosition(middleValue);
				}
				else if (xAxis instanceof CategoryAxis) {

					let rightLocation = this.getAdjustedXLocation(dataItem, xField);
					let leftLocation = this.getAdjustedXLocation(dataItem, xOpenField);

					positionX = xAxis.categoryToPosition((<any>dataItem)[xField], rightLocation);
					let openPositionX: number;


					if (xOpenField) {
						openPositionX = xAxis.categoryToPosition((<any>dataItem)[xOpenField], leftLocation);
					}

					if (!$type.isNumber(openPositionX)) {
						openPositionX = 1;
					}

					positionX = openPositionX + (positionX - openPositionX) * bulletLocationX;
				}

				if (yAxis instanceof DateAxis) {
					if (!$type.isNumber(bulletLocationY)) {
						bulletLocationY = 0;
					}

					let openValue: number;
					let closeValue: number = dataItem.getWorkingValue(yField);

					if (!yOpenField) {
						if (yAxis == this.baseAxis) {
							openValue = yAxis.baseValue;
						}
					}
					else {
						openValue = dataItem.getWorkingValue(yOpenField);
					}

					if (!$type.isNumber(openValue)) {
						openValue = closeValue;
					}

					let stack: number = dataItem.getValue("valueY", "stack");
					openValue += stack;
					closeValue += stack;

					if (openValue == closeValue) {
						let baseInterval = yAxis.baseInterval;
						let dateFormatter = yAxis.dateFormatter;
						openValue = $time.round(new Date(openValue), baseInterval.timeUnit, baseInterval.count, dateFormatter.firstDayOfWeek, dateFormatter.utc).getTime();
						closeValue = $time.add(new Date(openValue), baseInterval.timeUnit, baseInterval.count, dateFormatter.utc).getTime();
					}

					let middleValue: number;

					if (yAxis == this.baseAxis) {
						middleValue = openValue + (closeValue - openValue) * bulletLocationY;
					}
					else {
						middleValue = openValue + (closeValue - openValue) * (1 - bulletLocationY);
					}

					positionY = yAxis.valueToPosition(middleValue);
				}
				else if (yAxis instanceof ValueAxis) {

					if (!$type.isNumber(bulletLocationY)) {
						bulletLocationY = 0;
					}

					let openValue: number;
					let closeValue: number = dataItem.getWorkingValue(yField);

					if (!yOpenField) {
						openValue = yAxis.baseValue;
					}
					else {
						openValue = dataItem.getWorkingValue(yOpenField);
					}

					let stack: number = dataItem.getValue("valueY", "stack");
					openValue += stack;
					closeValue += stack;

					let middleValue = openValue + (closeValue - openValue) * (1 - bulletLocationY);

					positionY = yAxis.valueToPosition(middleValue);
				}
				else if (yAxis instanceof CategoryAxis) {
					positionY = yAxis.categoryToPosition((<any>dataItem)[yField], bulletLocationY);

					let topLocation = this.getAdjustedYLocation(dataItem, yField);
					let bottomLocation = this.getAdjustedYLocation(dataItem, yOpenField);

					positionY = yAxis.categoryToPosition((<any>dataItem)[yField], topLocation);
					let openPositionY: number;

					if (yOpenField) {
						openPositionY = yAxis.categoryToPosition((<any>dataItem)[yOpenField], bottomLocation);
					}
					if (!$type.isNumber(openPositionY)) {
						openPositionY = 1;
					}

					positionY = openPositionY + (positionY - openPositionY) * bulletLocationY;

				}

				bullet.visible = true;
				this.positionBulletReal(bullet, positionX, positionY);
			}
			else {
				bullet.visible = false;
			}
		}
	}

	protected positionBulletReal(bullet: Sprite, positionX: number, positionY: number) {
		bullet.x = this.xAxis.renderer.positionToPoint(positionX, positionY).x;
		bullet.y = this.yAxis.renderer.positionToPoint(positionY, positionX).y;
	}

	/**
	* returns bullet x location
	* @ignore
	*/
	protected getBulletLocationX(bullet: Bullet, field: string): number {
		let bulletLocation: number = bullet.locationX;
		let dataItem = bullet.dataItem;
		if (!$type.isNumber(bulletLocation)) {
			bulletLocation = dataItem.workingLocations[field];
		}
		return bulletLocation;
	}


	/**
	* returns bullet x location
	* @ignore
	*/
	protected getBulletLocationY(bullet: Bullet, field: string): number {
		let bulletLocation: number = bullet.locationY;
		let dataItem = bullet.dataItem;
		if (!$type.isNumber(bulletLocation)) {
			bulletLocation = dataItem.workingLocations[field];
		}
		return bulletLocation;
	}

	/**
	 * Can items from this series be included into stacks?
	 * 
	 * Note: proper stacking is only possible if series have the same number
	 * of data items. To ensure this, don't set data directly on series
	 * but do this on chart instead.
	 *
	 * @default false
	 * @param stacked  Can be stacked?
	 */
	public set stacked(stacked: boolean) {
		this.setPropertyValue("stacked", stacked, true);
	}

	/**
	 * @return Can be stacked?
	 */
	public get stacked(): boolean {
		return this.getPropertyValue("stacked");
	}

	/**
	 * Should the nearest tooltip be shown if no data item is found on the
	 * current cursor position? In order this to work, you should set snapTooltip = false on the series baseAxis.
	 *
	 * @default false
	 * @param value  Should snap?
	 */
	public set snapTooltip(value: boolean) {
		this.setPropertyValue("snapTooltip", value);
	}

	/**
	 * @return Should snap?
	 */
	public get snapTooltip(): boolean {
		return this.getPropertyValue("snapTooltip");
	}


	/**
	 * Shows hidden series.
	 *
	 * @param duration  Duration of reveal animation (ms)
	 * @return Animation
	 */
	public show(duration?: number): Animation {

		let fields: string[];
		if (this.xAxis instanceof ValueAxis && this.xAxis != this.baseAxis) {
			fields = this._xValueFields;
		}

		if (this.yAxis instanceof ValueAxis && this.yAxis != this.baseAxis) {
			fields = this._yValueFields;
		}

		let startIndex: number = this.startIndex;
		let endIndex: number = this.endIndex;
		let delay: number = 0;

		let interpolationDuration = this.defaultState.transitionDuration;
		if ($type.isNumber(duration)) {
			interpolationDuration = duration;
		}

		let anim: Animation;
		$iter.each($iter.indexed(this.dataItems.iterator()), (a) => {
			let i = a[0];
			let dataItem = a[1];

			if (this.sequencedInterpolation && interpolationDuration > 0) {
				delay = this.sequencedInterpolationDelay * i + interpolationDuration * (i - startIndex) / (endIndex - startIndex);
			}
			anim = dataItem.show(interpolationDuration, delay, fields);
		});

		// other data sets
		this.dataSets.each((key, dataSet) => {
			if (dataSet != this.dataItems) {
				dataSet.each((dataItem) => {
					dataItem.events.disable();
					dataItem.show(0, 0, fields);
					dataItem.events.enable();
				})
			}
		})

		if (this.mainDataSet != this.dataItems) {
			this.mainDataSet.each((dataItem) => {
				dataItem.events.disable();
				dataItem.show(0, 0, fields);
				dataItem.events.enable();
			})
		}

		let animation = super.show(duration);

		if (anim && !anim.isFinished()) {
			animation = anim;
		}

		if (this.hidden) {
			this.dispatchImmediately("selectionextremeschanged");
			this.hidden = false;
		}

		return animation;
	}

	/**
	 * Hides series.
	 *
	 * @param duration  Duration of hiding animation (ms)
	 * @return Animation
	 */
	public hide(duration?: number): Animation {

		let fields: string[];
		let value: number;
		let xAxis: Axis = this.xAxis;

		if (xAxis instanceof ValueAxis && xAxis != this.baseAxis) {
			fields = this._xValueFields;
			// animate to zero if 0 is within zoomMin/zoomMax
			if (this.stacked || (xAxis.minZoomed < xAxis.baseValue && xAxis.maxZoomed > xAxis.baseValue) || this.stackedSeries) {
				value = xAxis.baseValue;
			}
			else {
				value = xAxis.min;
			}
		}

		let yAxis: Axis = this.yAxis;
		if (yAxis instanceof ValueAxis && yAxis != this.baseAxis) {
			fields = this._yValueFields;
			// animate to zero if 0 is within zoomMin/zoomMax
			if (this.stacked || (yAxis.minZoomed < yAxis.baseValue && yAxis.maxZoomed > yAxis.baseValue) || this.stackedSeries) {
				value = yAxis.baseValue;
			}
			else {
				value = yAxis.min;
			}
		}

		//if ($type.hasValue(fields)) {
		let startIndex: number = this.startIndex;
		let endIndex: number = this.endIndex;

		let interpolationDuration = this.hiddenState.transitionDuration;
		if ($type.isNumber(duration)) {
			interpolationDuration = duration;
		}

		let delay: number = 0;
		let anim: Animation;
		$iter.each($iter.indexed(this.dataItems.iterator()), (a) => {
			let i = a[0];
			let dataItem = a[1];

			if (interpolationDuration == 0) {
				dataItem.hide(0, 0, value, fields);
			}
			else {
				if (this.sequencedInterpolation && interpolationDuration > 0) {
					delay = this.sequencedInterpolationDelay * i + interpolationDuration * (i - startIndex) / (endIndex - startIndex);
				}
				anim = dataItem.hide(interpolationDuration, delay, value, fields);
			}
		});

		let animation = super.hide(interpolationDuration);
		if (animation && !animation.isFinished()) {
			animation.delay(delay);
		}

		if (anim && !anim.isFinished()) {
			animation = anim;
		}

		// helps to avoid flicker. otherwise columns will show up at full size and only on next frame will animate from 0
		this.validateDataElements();
		//}
		return animation;
	}

	/**
	 * [handleDataItemWorkingValueChange description]
	 *
	 * @ignore Exclude from docs
	 */
	public handleDataItemWorkingValueChange(dataItem?: this["_dataItem"], name?: string): void {
		super.handleDataItemWorkingValueChange(dataItem, name);

		// to calculate stack values
		let axisSeries: List<XYSeries> = <List<XYSeries>>this.baseAxis.series;

		$iter.each(axisSeries.iterator(), (series) => {
			if (series.stacked || series.stackedSeries) {
				series.invalidateProcessedData();
			}
		});
	}

	/**
	 * [getStackValue description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param dataItem  Data item
	 */
	public getStackValue(dataItem: this["_dataItem"], working?: boolean): void {
		// todo: here wer stack x and y values only. question is - what should we do with other values, like openX, openY?
		// if this series is not stacked or new stack begins, return.

		let xAxis = this.xAxis;
		let yAxis = this.yAxis;

		if (!this.stacked || !xAxis || !yAxis) {
			return;
		}
		else {
			// it might seem that it's better to go through base axis series, but we do not maintain the same order as in chart.series there.
			let chart: XYChart = this.chart;
			let index: number = chart.series.indexOf(this);

			let field: string;

			if (xAxis != this.baseAxis && xAxis instanceof ValueAxis) {
				field = this.xField;
			}
			if (yAxis != this.baseAxis && yAxis instanceof ValueAxis) {
				field = this.yField;
			}

			if (!field) {
				return;
			}

			//this is good for removing series, otherwise stack values will remain the same and chart won't pay atention when adding/removing series			
			dataItem.setCalculatedValue(field, 0, "stack");

			$iter.eachContinue(chart.series.range(0, index).backwards().iterator(), (prevSeries) => {
				// stacking is only possible if both axes are the same
				if (prevSeries.xAxis == xAxis && prevSeries.yAxis == yAxis) {
					// saving value
					prevSeries.stackedSeries = this;

					let prevDataItem = prevSeries.dataItems.getIndex(dataItem.index); // indexes should match

					if (prevDataItem && prevDataItem.hasValue(this._xValueFields) && prevDataItem.hasValue(this._yValueFields)) {

						let value = dataItem.getValue(field);
						let prevValue: number;
						let prevRealValue = prevDataItem.getValue(field) + prevDataItem.getValue(field, "stack");

						if (working) {
							prevValue = prevDataItem.getWorkingValue(field) + prevDataItem.getValue(field, "stack");
						}
						else {
							prevValue = prevDataItem.getValue(field) + prevDataItem.getValue(field, "stack");
						}

						if ((value >= 0 && prevRealValue >= 0) || (value < 0 && prevRealValue < 0)) {
							//dataItem.events.disable();
							dataItem.setCalculatedValue(field, prevValue, "stack");
							//dataItem.events.enable();
							return false;
						}
					}
					else if (!prevSeries.stacked) {
						return false;
					}
				}

				return true;
			});
		}
	}

	/**
	 * [xField description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @return [description]
	 */
	public get xField(): string {
		return this._xField;
	}

	/**
	 * [yField description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @return [description]
	 */
	public get yField(): string {
		return this._yField;
	}

	/**
	 * [xOpenField description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @return [description]
	 */
	public get xOpenField(): string {
		return this._xOpenField;
	}

	/**
	 * [yOpenField description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @return [description]
	 */
	public get yOpenField(): string {
		return this._yOpenField;
	}

	/**
	 * [tooltipXField description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param value [description]
	 */
	public set tooltipXField(value: string) {
		this._tooltipXField = value;
	}

	/**
	 * @ignore Exclude from docs
	 * @todo Description
	 * @return [description]
	 */
	public get tooltipXField(): string {
		if (this._tooltipXField) {
			return this._tooltipXField;
		}
		return this._xField;
	}

	/**
	 * [tooltipYField description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param value [description]
	 */
	public set tooltipYField(value: string) {
		this._tooltipYField = value;
	}

	/**
	 * @ignore Exclude from docs
	 * @todo Description
	 * @return [description]
	 */
	public get tooltipYField(): string {
		if (this._tooltipYField) {
			return this._tooltipYField;
		}
		return this._yField;
	}

	/**
	 * Returns lowest value in the series for the specific axis.
	 *
	 * @ignore Exclude from docs
	 * @param axis  Axis
	 * @return value
	 */
	public min(axis: ValueAxis): number {
		return this._tmin.getKey(axis.uid);
	}

	/**
	 * Returns highest value in the series for the specific axis.
	 *
	 * @ignore Exclude from docs
	 * @param axis  Axis
	 * @return value
	 */
	public max(axis: ValueAxis): number {
		return this._tmax.getKey(axis.uid);
	}

	/**
	 * Returns lowest value in the series for the specific axis within current
	 * selection.
	 *
	 * @ignore Exclude from docs
	 * @param axis  Axis
	 * @return value
	 */
	public selectionMin(axis: ValueAxis): number {
		let value = this._smin.getKey(axis.uid);
		if (!$type.isNumber(value)) {
			value = this.min(axis);
		}
		return value;
	}

	/**
	 * Returns highest value in the series for the specific axis within current
	 * selection.
	 *
	 * @ignore Exclude from docs
	 * @param axis  Axis
	 * @return value
	 */
	public selectionMax(axis: ValueAxis): number {
		let value = this._smax.getKey(axis.uid);
		if (!$type.isNumber(value)) {
			value = this.max(axis);
		}
		return value;
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Set up base axes
			if ($type.hasValue(config.baseAxis) && $type.isString(config.baseAxis)) {
				if (this.map.hasKey(config.baseAxis)) {
					config.baseAxis = this.map.getKey(config.baseAxis);
				}
				else {
					this.processingErrors.push("[XYSeries (" + (this.name || "unnamed") + ")] No axis with id \"" + config.baseAxis + "\" found for `baseAxis`.");
					delete config.baseAxis;
				}
			}

			// Set up axes
			if ($type.hasValue(config.xAxis) && $type.isString(config.xAxis)) {
				if (this.map.hasKey(config.xAxis)) {
					config.xAxis = this.map.getKey(config.xAxis);
				}
				else {
					this.processingErrors.push("[XYSeries (" + (this.name || "unnamed") + ")] No axis with id \"" + config.xAxis + "\" found for `xAxis`.");
					delete config.xAxis;
				}
			}
			if ($type.hasValue(config.yAxis) && $type.isString(config.yAxis)) {
				if (this.map.hasKey(config.yAxis)) {
					config.yAxis = this.map.getKey(config.yAxis);
				}
				else {
					this.processingErrors.push("[XYSeries (" + (this.name || "unnamed") + ")] No axis with id \"" + config.yAxis + "\" found for `yAxis`.");
					delete config.yAxis;
				}
			}

			// Set up axis ranges
			if ($type.hasValue(config.axisRanges) && $type.isArray(config.axisRanges)) {
				for (let i = 0, len = config.axisRanges.length; i < len; i++) {
					let range = config.axisRanges[i];
					if (!$type.hasValue(range.type)) {
						range.type = "AxisDataItem";
					}
					if ($type.hasValue(range.axis) && $type.isString(range.axis) && this.map.hasKey(range.axis)) {
						range.component = this.map.getKey(range.axis);
					}
					else if ($type.hasValue(range.component) && $type.isString(range.component) && this.map.hasKey(range.component)) {
						range.component = this.map.getKey(range.component);
					}
				}
			}

			// Parse date fields based on the series fields
			if (!$type.hasValue(config.dataFields) || !$type.isObject(config.dataFields)) {
				this.processingErrors.push("`dataFields` is not set for series [" + (this.name || "unnamed") + "]");
			}

		}

		super.processConfig(config);

	}

	/**
	 * Returns an [[IPoint]] coordinates of the specific Serie's data point.
	 *
	 * @param    dataItem   Data item
	 * @param    xKey       Name of X data field
	 * @param    yKey       Name of Y data field
	 * @param    locationX  X location
	 * @param    locationY  Y location
	 * @param    stackKeyX  ?
	 * @param    stackKeyY  ?
	 * @returns             Coordinates
	 */
	public getPoint(dataItem: XYSeriesDataItem, xKey: string, yKey: string, locationX?: number, locationY?: number, stackKeyX?: string, stackKeyY?: string): IPoint {
		if (this.xAxis && this.yAxis) {
			let x: number = this.xAxis.getX(dataItem, xKey, locationX);
			let y: number = this.yAxis.getY(dataItem, yKey, locationY);

			x = $math.fitToRange(x, -100000, 100000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
			y = $math.fitToRange(y, -100000, 100000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.

			return { x: x, y: y };
		}
	}


	/**
	 * Updates item reader text based on the type and set up of axis.
	 */
	protected updateItemReaderText(): void {

		// We do not want to overwrite this if `itemReaderText` was changed by
		// user code.
		if (this._itemReaderTextChanged) {
			return;
		}
		let text = ""
		$object.each(this.dataFields, (key, val) => {
			text += "{" + key + "} ";
		});
		this.itemReaderText = text;
		this._itemReaderTextChanged = false;
	}

	/**
	 * Indicates if series should display a tooltip for chart's cursor.
	 *
	 * If set to `true` (default), the tooltips set for all series item's
	 * elements like columns and bullets will be automatically shown
	 * when [[XYCursor]] passes over category/date, even if its not hovered
	 * directly over the item.
	 *
	 * Set this to `false` to disable such behavior and display item-specific
	 * tooltips only when hovered directly over them
	 *
	 * @default true
	 * @param value Display tooltip?
	 */
	public set cursorTooltipEnabled(value: boolean) {
		this.setPropertyValue("cursorTooltipEnabled", value);
	}

	/**
	 * @return Display tooltip?
	 */
	public get cursorTooltipEnabled(): boolean {
		return this.getPropertyValue("cursorTooltipEnabled");
	}

	/**
	 * Indicates if series should apply hover state on bullets/columns/etc when
	 * cursor is over the data item.
	 *
	 * If set to `true` (default) and chart cursor is enabled on th chart,
	 * hovering over date/category will trigger hover states on related Series
	 * items like bullets and columns.
	 *
	 * @default true
	 * @since 4.2.2
	 * @param  value  Hover enabled?
	 */
	public set cursorHoverEnabled(value: boolean) {
		this.setPropertyValue("cursorHoverEnabled", value);
	}

	/**
	 * @return Hover enabled?
	 */
	public get cursorHoverEnabled(): boolean {
		return this.getPropertyValue("cursorHoverEnabled");
	}

	/**
	 * Indicates if series' values should be excluded when calculating totals.
	 * 
	 * @default false
	 * @since 4.4.9
	 * @param  value  Exclude from totals?
	 */
	public set excludeFromTotal(value: boolean) {
		this.setPropertyValue("excludeFromTotal", value);
	}

	/**
	 * @return Exclude from totals?
	 */
	public get excludeFromTotal(): boolean {
		return this.getPropertyValue("excludeFromTotal");
	}

	/**
	 * Indicates if series' tooltip should be hidden while series axis range is
	 * animating (zooming).
	 * 
	 * @default true
	 * @since 4.7.16
	 * @param  value  Hide tooltip while zooming?
	 */
	public set hideTooltipWhileZooming(value: boolean) {
		this.setPropertyValue("hideTooltipWhileZooming", value);
	}

	/**
	 * @return Hide tooltip while zooming?
	 */
	public get hideTooltipWhileZooming(): boolean {
		return this.getPropertyValue("hideTooltipWhileZooming");
	}


	/**
	 * Indicates if series' bullets should be masked.
	 * 
	 * @default true
	 * @since 4.7.17
	 * @param  value  Mask bullets?
	 */
	public set maskBullets(value: boolean) {
		this.setPropertyValue("maskBullets", value)
		let chart = this.chart;
		if (chart) {
			if (value) {
				this.bulletsContainer.parent = chart.bulletsContainer;
			}
			else {
				this.bulletsContainer.parent = chart.axisBulletsContainer;
			}
		}
	}

	/**
	 * @return Mask bullets?
	 */
	public get maskBullets(): boolean {
		return this.getPropertyValue("maskBullets");
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYSeries"] = XYSeries;
registry.registeredClasses["XYSeriesDataItem"] = XYSeriesDataItem;
