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
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { Axis } from "../axes/Axis";
import { AxisRenderer } from "../axes/AxisRenderer";
import { ValueAxis } from "../axes/ValueAxis";
import { Dictionary } from "../../core/utils/Dictionary";
import { List } from "../../core/utils/List";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { XYChart } from "../types/XYChart";
import { CategoryAxis } from "../axes/CategoryAxis";
import { Rectangle } from "../../core/elements/Rectangle";
import { IPoint } from "../../core/defs/IPoint";
import { DateAxis } from "../axes/DateAxis";
import { Bullet } from "../elements/Bullet";
import { CalculatedValue } from "../../core/Component";
import { Animation } from "../../core/utils/Animation";
import { registry } from "../../core/Registry";
import { DataItem, IDataItemEvents } from "../../core/DataItem";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";
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
	 */
	public _component!: XYSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "XYSeriesDataItem";

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
		this.setProperty("openCategoryX", category);
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
		this.setProperty("openCategoryY", category);
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
	 * Should the nearest tooltip be shown if no data item is found on the current cursor position
	 *
	 * @default false
	 */
	snapTooltip?: boolean;

	/**
	 * Indicates if series should display a tooltip for chart's cursor.
	 */
	cursorTooltipEnabled?: boolean;
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
 * @todo Example
 * @important
 */
export class XYSeries extends Series {

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
	protected _xAxis = new MutableValueDisposer<Axis>();

	/**
	 * Y axis the series is attached to.
	 */
	protected _yAxis = new MutableValueDisposer<Axis>();

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
	 * dataitem of previously shown tooltip, used to avoid multiple tooltipshownat dispatches
	 * @ignore
	 */
	protected _prevTooltipDataItem: XYSeriesDataItem;


	/**
	 * @ignore
	 */
	public _baseInterval:{[index:string]:ITimeInterval} = {};


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "XYSeries";
		this.isMeasured = false;

		this.cursorTooltipEnabled = true;

		this.mainContainer.mask = new Sprite();
		this.mainContainer.mask.setElement(this.paper.add("path"));

		this.stacked = false;
		this.snapTooltip = false;

		this.tooltip.pointerOrientation = "horizontal";

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
		this.defineFields();

		if (this.data.length > 0) {
			this.dataChangeUpdate();
		}

		super.validateData();

		this.updateItemReaderText();

		if (!$type.hasValue(this.dataFields[<keyof this["_dataFields"]>this._xField]) || !$type.hasValue(this.dataFields[<keyof this["_dataFields"]>this._yField])) {
			throw Error("Data fields for series \"" + (this.name ? this.name : this.uid) + "\" are not properly defined.");
		}
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

			dataItem.events.disable();
			this.xAxis.processSeriesDataItem(dataItem, "X");
			this.yAxis.processSeriesDataItem(dataItem, "Y");

			dataItem.events.enable();

			this.setInitialWorkingValues(dataItem);
		}
		catch (e) {
			this._chart.raiseCriticalError(e);
		}
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
		if (this.xAxis) {
			let dataItemsX = this.dataItemsByAxis.getKey(this.xAxis.uid);
			if (dataItemsX) {
				dataItemsX.clear();
			}
		}
		if (this.yAxis) {
			let dataItemsY = this.dataItemsByAxis.getKey(this.yAxis.uid);
			if (dataItemsY) {
				dataItemsY.clear();
			}
		}
	}



	/**
	 * Sets up which data fields to use for data access.
	 */
	protected defineFields() {
		let xAxis: Axis = this.xAxis;
		let yAxis: Axis = this.yAxis;

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

		if (!this.dataFields[yOpenField] && this.baseAxis == this.yAxis) {
			this._yOpenField = yField;
		}

		if (!this.dataFields[xOpenField] && this.baseAxis == this.xAxis) {
			this._xOpenField = xField;
		}

		if (this.stacked && this.baseAxis == this.xAxis) {
			this._xOpenField = xField;
		}

		if (this.stacked && this.baseAxis == this.yAxis) {
			this._yOpenField = yField;
		}

		if ((this.xAxis instanceof CategoryAxis) && (this.yAxis instanceof CategoryAxis)) {
			if (!this._yOpenField) {
				this._yOpenField = yField;
			}
		}

		this._xValueFields = [];
		this._yValueFields = [];

		this.addValueField(this.xAxis, <any>this._xValueFields, <any>this._xField);
		this.addValueField(this.xAxis, <any>this._xValueFields, <any>this._xOpenField);

		this.addValueField(this.yAxis, <any>this._yValueFields, <any>this._yField);
		this.addValueField(this.yAxis, <any>this._yValueFields, <any>this._yOpenField);
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
		return $path.rectToPath({
			x: 0,
			y: 0,
			width: this.xAxis.axisLength,
			height: this.yAxis.axisLength
		});
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
		this.xAxis.updateAxisBySeries();
		this.yAxis.updateAxisBySeries();

		super.validateDataItems();

		this.xAxis.postProcessSeriesDataItems();
		this.yAxis.postProcessSeriesDataItems();
	}

	/**
	 * Validates data range.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataRange() {
		if (this.xAxis.dataRangeInvalid) {
			this.xAxis.validateDataRange();
		}

		if (this.yAxis.dataRangeInvalid) {
			this.yAxis.validateDataRange();
		}

		super.validateDataRange();
	}

	/**
	 * (Re)validates the whole series, effectively causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		if (this.xAxis.invalid) {
			this.xAxis.validate();
		}

		if (this.yAxis.invalid) {
			this.yAxis.validate();
		}

		this.y = this.yAxis.pixelY;
		this.x = this.xAxis.pixelX;


		this._showBullets = true;
		let minBulletDistance: number = this.minBulletDistance;
		if ($type.isNumber(minBulletDistance)) {
			if (this.baseAxis.axisLength / (this.endIndex - this.startIndex) < minBulletDistance) {
				this._showBullets = false;
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
		if (!this._baseAxis) {
			if (this.yAxis instanceof DateAxis) {
				this._baseAxis = this.yAxis;
			}

			if (this.xAxis instanceof DateAxis) {
				this._baseAxis = this.xAxis;
			}

			if (this.yAxis instanceof CategoryAxis) {
				this._baseAxis = this.yAxis;
			}

			if (this.xAxis instanceof CategoryAxis) {
				this._baseAxis = this.xAxis;
			}

			if (!this._baseAxis) {
				this._baseAxis = this.xAxis;
			}
		}
		return this._baseAxis;
	}

	/**
	 * Processes values after data items' were added.
	 *
	 * @ignore Exclude from docs
	 * @param dataItems  Data items
	 */
	public processValues(working: boolean): void {
		// todo: if this is stacked, ensure that series to which this one can be stacked are processed before.
		super.processValues(working);

		let dataItems = this.dataItems;

		let minX = Infinity;
		let maxX = - Infinity;

		let minY = Infinity;
		let maxY = - Infinity;

		let startIndex = this.startIndex;
		let endIndex = this.endIndex;

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
				if (this.baseAxis == this.xAxis) {
					minY = $math.min(minY, stackY);
				}
				if (this.baseAxis == this.yAxis) {
					minX = $math.min(minX, stackX);
				}
			}
		}

		// this is mainly for value axis to calculate total and perecent.total of each series category
		this.xAxis.processSeriesDataItems();
		this.yAxis.processSeriesDataItems();

		let xAxisId: string = this.xAxis.uid;
		let yAxisId: string = this.yAxis.uid;

		if (!working) {
			if (this._tmin.getKey(xAxisId) != minX || this._tmax.getKey(xAxisId) != maxX || this._tmin.getKey(yAxisId) != minY || this._tmax.getKey(yAxisId) != maxY) {
				this._tmin.setKey(xAxisId, minX);
				this._tmax.setKey(xAxisId, maxX);
				this._tmin.setKey(yAxisId, minY);
				this._tmax.setKey(yAxisId, maxY);

				if (this.stackedSeries) {
					this.stackedSeries.processValues(false);
				}

				this.dispatchImmediately("extremeschanged");
			}
		}

		if (this._smin.getKey(xAxisId) != minX || this._smax.getKey(xAxisId) != maxX || this._smin.getKey(yAxisId) != minY || this._smax.getKey(yAxisId) != maxY) {
			this._smin.setKey(xAxisId, minX);
			this._smax.setKey(xAxisId, maxX);
			this._smin.setKey(yAxisId, minY);
			this._smax.setKey(yAxisId, maxY);

			if (this.appeared || this.start != 0 || this.end != 1) {
				this.dispatchImmediately("selectionextremeschanged");
			}
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
		if (this.cursorTooltipEnabled) {
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

				if(point){
					return point;
				}

				// so that if tooltip is shown on columns or bullets for it not to be hidden
				if (!this.tooltipText) {
					return;
				}
			}

			this.hideTooltip();
		}
	}


	/**
	 * Shows series tooltip at specific dataItem.
	 *
	 * @param dataItem
	 */
	public showTooltipAtDataItem(dataItem: this["_dataItem"]): IPoint {
		this.returnBulletDefaultState(dataItem);
		if (this.cursorTooltipEnabled) {
			if (dataItem && dataItem.visible) {

				this.updateLegendValue(dataItem);
				this.tooltipDataItem = dataItem;

				// todo: add tooltipXField and tooltipYField.
				let tooltipXField = this.tooltipXField;
				let tooltipYField = this.tooltipYField;

				if ($type.hasValue((<any>dataItem)[tooltipXField]) && $type.hasValue((<any>dataItem)[tooltipYField])) {

					let tooltipPoint = this.getPoint(dataItem, tooltipXField, tooltipYField, dataItem.locations[tooltipXField], dataItem.locations[tooltipYField]);

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

						for (let a of dataItem.bullets) {
							let bullet = a[1]
							bullet.isHover = true;
						}

						if (this.showTooltip()) {
							return $utils.spritePointToSvg({ x: tooltipPoint.x, y: tooltipPoint.y }, this);
						}
						return;
					}
				}
			}
		}
	}
	/**
	 * returns default state to bullets when tooltip is shown at some other data item or hidden
	 *
	 * @ignore Exclude from docs
	 */
	protected returnBulletDefaultState(dataItem?: XYSeriesDataItem) {
		if (this._prevTooltipDataItem && this._prevTooltipDataItem != dataItem) {
			for (let a of this._prevTooltipDataItem.bullets) {
				let bullet = a[1];
				if (!bullet.isDisposed()) {
					bullet.isHover = false;
				}
				else {
					this._prevTooltipDataItem = undefined;
				}
			}
		}
	}

	/**
	 * Positions series bullet.
	 *
	 * @ignore Exclude from docs
	 * @param bullet  Bullet
	 */
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

		if ((this.xAxis instanceof ValueAxis && !dataItem.hasValue([xField])) || (this.yAxis instanceof ValueAxis && !dataItem.hasValue([yField]))) {
			bullet.visible = false;
		}
		else {
			let bulletLocationX: number = this.getBulletLocationX(bullet, xField);
			let bulletLocationY: number = this.getBulletLocationY(bullet, yField);

			let point = this.getPoint(dataItem, xField, yField, bulletLocationX, bulletLocationY);
			if (point) {
				let x: number = point.x;
				let y: number = point.y;

				if ($type.isNumber(bullet.locationX) && this.xOpenField != this.xField) {
					let openX: number = this.xAxis.getX(dataItem, this.xOpenField);
					x = x - (x - openX) * bullet.locationX;
				}


				if ($type.isNumber(bullet.locationY) && this.yOpenField != this.yField) {
					let openY: number = this.yAxis.getY(dataItem, this.yOpenField);
					y = y - (y - openY) * bullet.locationY;
				}

				bullet.moveTo({ x: x, y: y });
			}
			else {
				bullet.visible = false;
			}
		}
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
	 * current cursor position?
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

		let animation = super.show(duration);

		if (anim && !anim.isFinished()) {
			animation = anim;
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
			if (this.stacked || (xAxis.minZoomed < 0 && xAxis.maxZoomed > 0) || this.stackedSeries) {
				value = 0;
			}
			else {
				value = xAxis.min;
			}
		}

		let yAxis: Axis = this.yAxis;
		if (yAxis instanceof ValueAxis && yAxis != this.baseAxis) {
			fields = this._yValueFields;
			// animate to zero if 0 is within zoomMin/zoomMax
			if (this.stacked || (yAxis.minZoomed < 0 && yAxis.maxZoomed > 0) || this.stackedSeries) {
				value = 0;
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
			if (series.stacked) {
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

		if (!this.stacked) {
			return;
		}
		else {
			// it might seem that it's better to go through base axis series, but we do not maintain the same order as in chart.series there.
			let chart: XYChart = this.chart;
			let index: number = chart.series.indexOf(this);

			let field: string;

			if (this.xAxis != this.baseAxis && this.xAxis instanceof ValueAxis) {
				field = this.xField;
			}
			if (this.yAxis != this.baseAxis && this.yAxis instanceof ValueAxis) {
				field = this.yField;
			}

			//this is good for removing series, otherwise stack values will remain the same and chart won't pay atention when adding/removing series
			dataItem.setCalculatedValue(field, 0, "stack");

			$iter.eachContinue(chart.series.range(0, index).backwards().iterator(), (prevSeries) => {
				// stacking is only possible if both axes are the same
				if (prevSeries.xAxis == this.xAxis && prevSeries.yAxis == this.yAxis) {
					// saving value
					prevSeries.stackedSeries = this;

					let prevDataItem = prevSeries.dataItems.getIndex(dataItem.index); // indexes should match

					if (prevDataItem && prevDataItem.hasValue(this._xValueFields) && prevDataItem.hasValue(this._yValueFields)) {

						let value = dataItem.getValue(field);
						let prevValue: number;

						if (working) {
							prevValue = prevDataItem.getWorkingValue(field) + prevDataItem.getValue(field, "stack");
						}
						else {
							prevValue = prevDataItem.getValue(field) + prevDataItem.getValue(field, "stack");
						}

						if ((value >= 0 && prevValue >= 0) || (value < 0 && prevValue < 0)) {
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
	 * [getPoint description]
	 *
	 * @todo Description
	 * @param dataItem   [description]
	 * @param xKey       [description]
	 * @param yKey       [description]
	 * @param locationX  [description]
	 * @param locationY  [description]
	 * @param stackKeyX  [description]
	 * @param stackKeyY  [description]
	 */
	protected getPoint(dataItem: XYSeriesDataItem, xKey: string, yKey: string, locationX?: number, locationY?: number, stackKeyX?: string, stackKeyY?: string) {
		let x: number = this.xAxis.getX(dataItem, xKey, locationX);
		let y: number = this.yAxis.getY(dataItem, yKey, locationY);

		x = $math.fitToRange(x, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
		y = $math.fitToRange(y, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.

		return { x: x, y: y };
	}


	/**
	 * Updates item reader text based on the type and set up of axis.
	 */
	protected updateItemReaderText(): void {
		let text = ""
		$object.each(this.dataFields, (key, val) => {
			text += "{" + key + "} ";
		});
		this.itemReaderText = text;
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

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYSeries"] = XYSeries;
registry.registeredClasses["XYSeriesDataItem"] = XYSeriesDataItem;
