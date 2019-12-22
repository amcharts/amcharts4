/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "./Container";
import { List, IListEvents, ListDisposer } from "./utils/List";
import { OrderedListTemplate, ISortedListEvents } from "./utils/SortedList";
import { Animation } from "./utils/Animation";
import { Dictionary } from "./utils/Dictionary";
import { IDisposer, Disposer, MultiDisposer } from "./utils/Disposer";
import { Export, IExportAdapters } from "./export/Export";
import { DataSource } from "./data/DataSource";
import { Responsive } from "./utils/Responsive";
import { system } from "./System";

import { DataItem } from "./DataItem";
import { registry } from "./Registry";
import { Preloader } from "./elements/Preloader";
import { IRange } from "./defs/IRange";

import * as $math from "./utils/Math";
import * as $array from "./utils/Array";
import * as $ease from "./utils/Ease";
import * as $utils from "./utils/Utils";
import * as $iter from "./utils/Iterator";
import * as $object from "./utils/Object";
import * as $type from "./utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * A list of available types for calculated values.
 */
export type CalculatedValue =
	"value" |
	"percent" |
	"change" |
	"changePercent" |
	"startChangePercent" |
	"startChange" |
	"previousChangePercent" |
	"previousChange" |
	"sum" |
	"absoluteSum" |
	"average" |
	"open" |
	"close" |
	"low" |
	"high" |
	"count" |
	"total" |
	"totalPercent" |
	"stack";

/**
 * Defines properties for [[Component]].
 */
export interface IComponentProperties extends IContainerProperties {

	/**
	 * Maximum zoom factor of a component.
	 */
	maxZoomFactor?: number;

	/**
	 * Maximum zoom declination (how much out of 0-1 range it will allow to step out)
	 *
	 * @ignore
	 * @default 0.5
	 */
	maxZoomDeclination?: number;

	/**
	 * Use this for [[CategoryAxis]] or [[DateAxis]].
	 *
	 * Allows restricting zoom in beyond certain number of categories or base
	 * intervals.
	 *
	 * The chart will not zoom in beyond this number of items.
	 *
	 * @default 1
	 */
	minZoomCount?: number;

	/**
	 * Use this for [[CategoryAxis]] or [[DateAxis]].
	 *
	 * Limits how many categories or base intervals can be shown at the same
	 * time.
	 *
	 * If there are more items in the chart, the chart will auto-zoom.
	 *
	 * @default 0 (no limit)
	 */
	maxZoomCount?: number;

}

/**
 * Defines data fields for [[Component]].
 */
export interface IComponentDataFields {

	/**
	 * Data.
	 */
	data?: string;

	/**
	 * ID.
	 */
	id?: string;

}

/**
 * Defines events for [[Component]].
 */
export interface IComponentEvents extends IContainerEvents {

	/**
	 * Invoked when range of the currently selected data is validated.
	 *
	 * @todo: change to datarangevalidated?
	 */
	datarangechanged: {};

	/**
	 * Invoked when the raw data for the component changes.
	 */
	datavalidated: {};

	/**
	 * Invoked when value(s) of the element's data items are validated.
	 */
	dataitemsvalidated: {};

	/**
	 * Invoked just before element is validated (after changes).
	 */
	beforedatavalidated: {};

	/**
	 * Invoked when range change animation starts
	 */
	rangechangestarted: {};

	/**
	 * Invoked when range change animation ends
	 */
	rangechangeended: {};

	/**
	 * Invoked when start position changes
	 */
	startchanged: {};

	/**
	 * Invoked when end position changes
	 */
	endchanged: {};

	/**
	 * Invoked when start or end position changes, unlike startchanged/endchanged this event is fired not immediately but at the end of a cycle.
	 */
	startendchanged: {};
}

/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IComponentAdapters extends IContainerAdapters, IComponentProperties {

	/**
	 * Applied after [[Component]] retrieves data value from data context
	 * (raw data), but before it is provided to [[DataItem]].
	 */
	dataContextValue: {
		value: any,
		field: string,
		dataItem: DataItem
	};

	/**
	 * Applied to chart's data before it is retrieved for use.
	 */
	data: any[];

	start: number;

	end: number;
}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A Component represents an independent functional element or control, that
 * can have it's own behavior, children, data, etc.
 *
 * A few examples of a Component: [[Legend]], [[Series]], [[Scrollbar]].
 *
 * @see {@link IComponentEvents} for a list of available events
 * @see {@link IComponentAdapters} for a list of available Adapters
 * @important
 */
export class Component extends Container {

	/**
	 * Defines available data fields.
	 */
	public _dataFields!: IComponentDataFields;

	/**
	 * Holds data field names.
	 *
	 * Data fields define connection beween [[DataItem]] and actual properties
	 * in raw data.
	 */
	public dataFields: this["_dataFields"] = {};

	/**
	 * Defines available properties.
	 */
	public _properties!: IComponentProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IComponentAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IComponentEvents;

	/**
	 * Holds the data for the component.
	 *
	 * @ignore Exclude from docs
	 */
	protected _data: $type.Optional<any[]>;

	/**
	 * A [[Component]] which provides data to this component (like Chart provides
	 * data for Series).
	 */
	public dataProvider: $type.Optional<Component>;

	/**
	 * A list of [[DataSource]] definitions of external data source.
	 *
	 * @ignore Exclude from docs
	 */
	protected _dataSources: { [index: string]: DataSource } = {};

	/**
	 * An instance of [[Responsive]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _responsive: $type.Optional<Responsive>;

	/**
	 * This is used when only new data is invalidated (if added using `addData`
	 * method).
	 *
	 * @ignore Exclude from docs
	 */
	protected _parseDataFrom: number = 0;

	/**
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected _dataUsers: $type.Optional<List<Component>>;

	/**
	 * Holds the disposers for the dataItems and dataUsers
	 *
	 * @ignore Exclude from docs
	 */
	protected _dataDisposers: Array<IDisposer> = [];


	/**
	 * Identifies the type of the [[DataItem]] used in this element.
	 */
	public _dataItem!: DataItem;

	/**
	 * List of element's source data items.
	 *
	 * @ignore Exclude from docs
	 */
	protected _dataItems: $type.Optional<OrderedListTemplate<this["_dataItem"]>>;

	/**
	 * Holds aggregated data items.
	 *
	 * @ignore
	 */
	public _dataSets: Dictionary<string, OrderedListTemplate<this["_dataItem"]>>;

	/**
	 * Currently selected "data set".
	 *
	 * If it's set to `""`, main data set (unaggregated data) is used.
	 */
	protected _currentDataSetId: string = "";

	/**
	 * [_startIndex description]
	 *
	 * @ignore Exclude from docs
	 */
	protected _startIndex: $type.Optional<number>;

	/**
	 * [_endIndex description]
	 *
	 * @ignore Exclude from docs
	 */
	protected _endIndex: $type.Optional<number>;

	/**
	 * [_start description]
	 *
	 * @ignore Exclude from docs
	 */
	protected _start: number = 0;

	/**
	 * [_end description]
	 *
	 * @ignore Exclude from docs
	 */
	protected _end: number = 1;

	/**
	 * [_finalStart description]
	 *
	 * @ignore Exclude from docs
	 */
	protected _finalStart: $type.Optional<number>;

	/**
	 * [_finalEnd description]
	 *
	 * @ignore Exclude from docs
	 */
	protected _finalEnd: $type.Optional<number>;

	/**
	 * If set to `true`, changing data range in element will not trigger
	 * `daterangechanged` event.
	 */
	public skipRangeEvent: boolean = false;

	/**
	 * Whenever selected scope changes (chart is zoomed or panned), for example
	 * by interaction from a Scrollbar, or API, a chart needs to reposition
	 * its contents.
	 *
	 * `rangeChangeDuration` influences how this is performed.
	 *
	 * If set to zero (0), the change will happen instantenously.
	 *
	 * If set to non-zero value, the chart will gradually animate into new
	 * position for the set amount of milliseconds.
	 *
	 * @default 0
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
	 */
	public rangeChangeDuration: number = 0;

	/**
	 * An easing function to use for range change animation.
	 *
	 * @see {@link Ease}
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
	 */
	public rangeChangeEasing: (value: number) => number = $ease.cubicOut;

	/**
	 * A reference to a currently playing range change [[Animation]] object.
	 *
	 * @ignore Exclude from docs
	 */
	public rangeChangeAnimation: $type.Optional<Animation>;

	/**
	 * A duration (ms) of each data parsing step. A Component parses its data in
	 * chunks in order to avoid completely freezing the machine when large data
	 * sets are used. This setting will control how many milliseconds should pass
	 * when parsing data until parser stops for a brief moment to let other
	 * processes catch up.
	 */
	public parsingStepDuration: number = 50;

	/**
	 * [dataInvalid description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public dataInvalid: boolean = false;


	/**
	 *
	 * @ignore Exclude from docs
	 */
	public rawDataInvalid: boolean = false;

	/**
	 * [dataRangeInvalid description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public dataRangeInvalid: boolean = false;

	/**
	 * [dataItemsInvalid description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public dataItemsInvalid: boolean = false;

	/**
	 * If set to a non-zero number the element will "animate" data values of its
	 * children.
	 *
	 * This will happen on first load and whenever data values change.
	 *
	 * Enabling interpolation will mean that elements will transit smoothly into
	 * new values rather than updating instantly.
	 *
	 * @default 0
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
	 */
	public interpolationDuration: number = 0;

	/**
	 * An easing function to use for interpolating values when transiting from
	 * one source value to another.
	 *
	 * @default cubicOut
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
	 * @see {@link Ease}
	 */
	public interpolationEasing: (value: number) => number = $ease.cubicOut;

	/**
	 * Indicates whether transition between data item's values should start and
	 * play out all at once, or with a small delay (as defined by
	 * `sequencedInterpolationDelay`) for each subsequent data item.
	 *
	 * @default true
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
	 */
	public sequencedInterpolation: boolean = true;

	/**
	 * A delay (ms) to wait between animating each subsequent data item's
	 * interpolation animation.
	 *
	 * Relative only if `sequencedInterpolation = true`.
	 *
	 * @default 0
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
	 */
	public sequencedInterpolationDelay: number = 0;

	/**
	 * A progress (0-1) for the data validation process.
	 *
	 * @ignore Exclude from docs
	 */
	public dataValidationProgress: number = 0;

	/**
	 * [_prevStartIndex description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected _prevStartIndex: $type.Optional<number>;

	/**
	 * [_prevEndIndex description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected _prevEndIndex: $type.Optional<number>;

	/**
	 * Sometimes we need to process more dataItems then actually is
	 * selected (for example, not to cut lines at the end/beginning).
	 * However when calculating averages, min, max, etc we need not to include
	 * them. So we store `workingStartIndex` and `workingEndIndex` to know which
	 * dataItems should be included and which should not.
	 */

	/**
	 * [_workingStartIndex description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected _workingStartIndex: $type.Optional<number>;

	/**
	 * [_workingEndIndex description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected _workingEndIndex: $type.Optional<number>;

	protected _addAllDataItems: boolean = true;

	protected _showOnInitDisposer2: IDisposer;

	protected _usesData: boolean = true;



	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Component";

		this.minZoomCount = 1;
		this.maxZoomCount = 0;

		this._dataItems = new OrderedListTemplate<DataItem>(this.createDataItem());
		this._dataItems.events.on("inserted", this.handleDataItemAdded, this, false);
		this._dataItems.events.on("removed", this.handleDataItemRemoved, this, false);
		this._disposers.push(new ListDisposer(this._dataItems));
		this._disposers.push(this._dataItems.template);

		this.invalidateData();

		// TODO what about remove ?
		this.dataUsers.events.on("inserted", this.handleDataUserAdded, this, false);

		// Set up disposers
		this._disposers.push(new MultiDisposer(this._dataDisposers));

		this._start = 0;
		this._end = 1;

		this.maxZoomDeclination = 1;

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new DataItem();
	}

	/**
	 * [handleDataUserAdded description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param event Event object
	 */
	protected handleDataUserAdded(event: IListEvents<Component>["inserted"]) {
		let dataUser = event.newValue;
		dataUser.dataProvider = this;
	}

	/**
	 * [handleDataItemValueChange description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public handleDataItemValueChange(dataItem?: this["_dataItem"], name?: string): void {
		if (!this.dataItemsInvalid) {
			this.invalidateDataItems();
		}
	}

	/**
	 * [handleDataItemWorkingValueChange description]
	 *
	 * @ignore Exclude from docs
	 */
	public handleDataItemWorkingValueChange(dataItem?: this["_dataItem"], name?: string): void {

	}

	/**
	 * [handleDataItemWorkingLocationChange description]
	 *
	 * @ignore Exclude from docs
	 */
	public handleDataItemWorkingLocationChange(dataItem?: this["_dataItem"], name?: string): void {

	}

	/**
	 * [handleDataItemCalculatedValueChange description]
	 *
	 * @ignore Exclude from docs
	 */
	public handleDataItemCalculatedValueChange(dataItem?: this["_dataItem"], name?: string) {

	}

	/**
	 * [handleDataItemPropertyChange description]
	 *
	 * @ignore Exclude from docs
	 */
	public handleDataItemPropertyChange(dataItem?: this["_dataItem"], name?: string): void {

	}

	/**
	 * Populates a [[DataItem]] width data from data source.
	 *
	 * Loops through all the fields and if such a field is found in raw data
	 * object, a corresponding value on passed in `dataItem` is set.
	 *
	 * @ignore Exclude from docs
	 * @param item
	 */
	protected processDataItem(dataItem: this["_dataItem"], dataContext?: Object): void {
		if (dataItem) {
			if (!dataContext) {
				dataContext = {};
			}

			// store reference to original data item
			dataItem.dataContext = dataContext;

			let hasSomeValues = false;

			$object.each(this.dataFields, (key, fieldValue) => {
				const fieldName: string = <string>key;

				let value: any = (<any>dataContext)[fieldValue];
				// Apply adapters to a retrieved value
				if (this._adapterO) {
					if (this._adapterO.isEnabled("dataContextValue")) {
						value = this._adapterO.apply("dataContextValue", {
							field: fieldName,
							value: value,
							dataItem: dataItem
						}).value;
					}
				}

				if (dataItem.hasChildren[fieldName]) {
					if ($type.hasValue(value)) {
						hasSomeValues = true;
						let template = this.createDataItem();
						template.copyFrom(this.mainDataSet.template);
						let children = new OrderedListTemplate<DataItem>(template);
						children.events.on("inserted", this.handleDataItemAdded, this, false);
						children.events.on("removed", this.handleDataItemRemoved, this, false);
						this._dataDisposers.push(new ListDisposer(children));
						let count = value.length;
						for (let i = 0; i < count; i++) {
							let rawDataItem = value[i];
							let childDataItem: this["_dataItem"] = children.create();
							childDataItem.parent = dataItem;
							this.processDataItem(childDataItem, rawDataItem);
						}
						let anyDataItem = <any>dataItem;
						anyDataItem[fieldName] = <any>children;
					}
				}
				else {
					// data is converted to numbers/dates in each dataItem
					if ($type.hasValue(value)) {
						hasSomeValues = true;
						(<any>dataItem)[fieldName] = value;
					}
				}
			});

			$object.each(this.propertyFields, (key, fieldValue) => {
				const f: string = <string>key;
				let value: any = (<any>dataContext)[fieldValue];

				if ($type.hasValue(value)) {
					hasSomeValues = true;
					dataItem.setProperty(f, value);
				}
			});

			// @todo we might need some flag which would tell whether we should create empty data items or not.
			if (!this._addAllDataItems && !hasSomeValues) {
				this.mainDataSet.remove(dataItem);
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
		if (dataItem) {

			let dataContext = dataItem.dataContext;

			$object.each(this.dataFields, (key, fieldValue) => {
				const fieldName: string = <string>key;

				let value: any = (<any>dataContext)[fieldValue];
				// Apply adapters to a retrieved value
				if (this._adapterO) {
					value = this._adapterO.apply("dataContextValue", {
						field: fieldName,
						value: value,
						dataItem: dataItem
					}).value;
				}

				if (dataItem.hasChildren[fieldName]) {
					if (value) {
						let anyDataItem = <any>dataItem;
						let children = <OrderedListTemplate<this["_dataItem"]>><any>(anyDataItem[fieldName]);
						$iter.each(children.iterator(), (child) => {
							this.updateDataItem(child);
						})
					}
				}
				else {
					// data is converted to numbers/dates in each dataItem
					if ($type.hasValue(value)) {
						(<any>dataItem)[fieldName] = value;
					}
				}
			});

			$object.each(this.propertyFields, (key, fieldValue) => {
				const f: string = <string>key;
				let value: any = (<any>dataContext)[fieldValue];
				if ($type.hasValue(value)) {
					dataItem.setProperty(f, value);
				}
			});
		}
	}


	/**
	 * [validateDataElements description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected validateDataElements() {
		let count = this.endIndex;

		for (let i = this.startIndex; i < count; i++) {
			const dataItem = this.dataItems.getIndex(i);

			// TODO is this correct
			if (dataItem) {
				this.validateDataElement(dataItem);
			}
		}
	}

	/**
	 * Validates this element and its related elements.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		this.validateDataElements();
		super.validate();
	}

	/**
	 * [validateDataElement description]
	 *
	 * @ignore Exclude from docs
	 * @param dataItem [description]
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {

	}

	/**
	 * Adds one or several (array) of data items to the existing data.
	 *
	 * @param rawDataItem One or many raw data item objects
	 */
	public addData(rawDataItem: Object | Object[], removeCount?: number): void {

		// need to check if data is invalid, as addData might be called multiple times
		if (!this.dataInvalid && this.inited) {
			this._parseDataFrom = this.data.length; // save length of parsed data
		}

		if (rawDataItem instanceof Array) {
			// can't use concat because new array is returned
			$array.each(rawDataItem, (dataItem) => {
				this.data.push(dataItem);
			})
		}
		else {
			this.data.push(rawDataItem); // add to raw data array
		}

		if (this.inited) {
			this.removeData(removeCount);
		}
		else {
			if ($type.isNumber(removeCount)) {
				while (removeCount > 0) {
					this.data.shift();
					removeCount--;
				}
			}
		}

		this.invalidateData();
	}

	/**
	 * Removes elements from the beginning of data
	 *
	 * @param count number of elements to remove
	 */
	public removeData(count: $type.Optional<number>) {
		if ($type.isNumber(count)) {
			while (count > 0) {
				let dataItem = this.mainDataSet.getIndex(0);
				if (dataItem) {
					this.mainDataSet.remove(dataItem);
				}

				this.dataUsers.each((dataUser) => {
					if(!dataUser.data || dataUser.data.length == 0){
						let dataItem = dataUser.dataItems.getIndex(0);
						if (dataItem) {
							dataUser.dataItems.remove(dataItem);
						}
					}
				});

				this.data.shift();

				if (this._parseDataFrom > 0) {
					this._parseDataFrom--;
				}

				count--;
			}
			this.invalidateData();
		}
	}

	/**
	 * Triggers a data (re)parsing.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidateData(): void {
		if (this.disabled || this.isTemplate) {
			return;
		}

		//if(!this.dataInvalid){
		registry.addToInvalidComponents(this);
		system.requestFrame();
		this.dataInvalid = true;

		$iter.each(this.dataUsers.iterator(), (x) => {
			x.invalidateDataItems();
		});
		//}
	}

	/**
	 * [invalidateDataUsers description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public invalidateDataUsers(): void {
		$iter.each(this.dataUsers.iterator(), (x) => {
			x.invalidate();
		});
	}

	/**
	 * Invalidates data values. When data array is not changed, but values within
	 * it changes, we invalidate data so that component would process changes.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidateDataItems(): void {
		if (this.disabled || this.isTemplate) {
			return;
		}

		//if(!this.dataItemsInvalid){
		$array.move(registry.invalidDataItems, this);
		system.requestFrame();

		this.dataItemsInvalid = true;

		$iter.each(this.dataUsers.iterator(), (x) => {
			x.invalidateDataItems();
		});
		//}
	}

	/**
	 * Invalidates data range. This is done when data which must be shown
	 * changes (chart is zoomed for example).
	 *
	 * @ignore Exclude from docs
	 */
	public invalidateDataRange(): void {
		if (this.disabled || this.isTemplate) {
			return;
		}

		//if(!this.dataRangeInvalid){
		this.dataRangeInvalid = true;
		$array.move(registry.invalidDataRange, this);
		system.requestFrame();
		//}
	}

	/**
	 * Processes data range.
	 *
	 * @todo Description
	 * @ignore Exclude from docs
	 */
	public validateDataRange(): void {
		$array.remove(registry.invalidDataRange, this);
		this.dataRangeInvalid = false;

		if (this.startIndex != this._prevStartIndex || this.endIndex != this._prevEndIndex) {
			this.rangeChangeUpdate();
			this.appendDataItems();
			this.invalidate();
			this.dispatchImmediately("datarangechanged");
		}
	}

	/**
	 * [sliceData description]
	 *
	 * @todo Description
	 * @ignore Exclude from docs
	 */
	protected sliceData() {
		this._workingStartIndex = this.startIndex;
		this._workingEndIndex = this.endIndex;
	}

	/**
	 * [rangeChangeUpdate description]
	 *
	 * @todo Description
	 * @ignore Exclude from docs
	 */
	protected rangeChangeUpdate() {
		this.sliceData();
		this._prevStartIndex = this.startIndex;
		this._prevEndIndex = this.endIndex;
	}

	/**
	 * [appendDataItems description]
	 *
	 * @todo Description
	 * @ignore Exclude from docs
	 */
	protected appendDataItems() {
		// TODO use an iterator instead
		let count = this.endIndex;
		for (let i: number = this.startIndex; i < count; i++) {

			// data item
			let dataItem = this.dataItems.getIndex(i);
			if (dataItem) {
				dataItem.__disabled = false;
			}
		}

		for (let i = 0; i < this.startIndex; i++) {
			let dataItem = this.dataItems.getIndex(i);
			dataItem.__disabled = true;
		}

		for (let i = this.endIndex; i < this.dataItems.length; i++) {
			let dataItem = this.dataItems.getIndex(i);
			dataItem.__disabled = true;
		}
	}

	/**
	 * If you want to have a smooth transition from one data values to another, you change your raw data and then you must call this method.
	 * then instead of redrawing everything, the chart will check raw data and smoothly transit from previous to new data
	 */
	public invalidateRawData(): void {
		if (this.disabled || this.isTemplate) {
			return;
		}

		//if(!this.rawDataInvalid){
		$array.move(registry.invalidRawDatas, this);
		system.requestFrame();

		this.rawDataInvalid = true;

		$iter.each(this.dataUsers.iterator(), (x) => {
			x.invalidateRawData();
		});
		//}
	}

	/**
	 * @ignore
	 */
	public validateRawData() {
		$array.remove(registry.invalidRawDatas, this);
		$iter.each(this.mainDataSet.iterator(), (dataItem) => {
			if (dataItem) {
				this.updateDataItem(dataItem);
			}
		});
	}

	/**
	 * Destroys this object and all related data.
	 */
	public dispose() {
		this.mainDataSet.template.clones.clear();
		$object.each(this._dataSources, (key, source) => {
			this.removeDispose(source);
		});
		super.dispose();
	}

	/**
	 * @ignore
	 */
	public disposeData() {
		this.mainDataSet.template.clones.clear();

		$array.each(this._dataDisposers, (x) => {
			x.dispose();
		});

		// and for all components
		$iter.each(this.dataUsers.iterator(), (dataUser) => {
			dataUser.disposeData();
		});

		this._dataDisposers.length = 0;

		this._startIndex = undefined;
		this._endIndex = undefined;

		// dispose old
		this.mainDataSet.clear();

		this.mainDataSet.template.clones.clear();

		if (this._dataSets) {
			this._dataSets.clear();
		}
	}


	protected getDataItem(dataContext?: any): this["_dataItem"] {
		return this.mainDataSet.create();
	}

	/**
	 * Validates (processes) data.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {
		this.dispatchImmediately("beforedatavalidated");

		this.dataInvalid = false;

		registry.removeFromInvalidComponents(this);

		if (this.__disabled) {
			return;
		}

		this.dataValidationProgress = 0;
		// need this to slice new data
		this._prevStartIndex = undefined;
		this._prevEndIndex = undefined;

		// todo: this needs some overthinking, maybe some extra settings like zoomOotonDataupdate like in v3 or so. some charts like pie chart probably should act like this always
		this._startIndex = undefined;
		this._endIndex = undefined;

		if (this.dataFields.data && this.dataItem) {
			let dataContext = <any>this.dataItem.dataContext;
			this._data = dataContext[this.dataFields.data];
		}

		// data items array is reset only if all data is validated, if _parseDataFrom is not 0, we append new data only
		// check heatmap demo if uncommented
		// fixed both issues by adding && this.data.length > 0
		// check adding series example if changed
		if (this._parseDataFrom === 0 && this.data.length > 0) {
			this.disposeData();
		}

		if (this.data.length > 0) {
			let preloader: $type.Optional<Preloader> = this.preloader;

			// and for all components
			$iter.each(this.dataUsers.iterator(), (dataUser) => {
				// todo: this needs some overthinking, maybe some extra settings like zoomOUtonDataupdate like in v3 or so. some charts like pie chart probably should act like this always
				dataUser._startIndex = undefined;
				dataUser._endIndex = undefined;
			});

			let counter: number = 0;
			let startTime: number = Date.now();
			// parse data
			let i = this._parseDataFrom;
			let n = this.data.length;

			for (i; i < n; i++) {
				let rawDataItem = this.data[i];
				if (this._usesData) {
					let dataItem: this["_dataItem"] = this.getDataItem(rawDataItem);
					this.processDataItem(dataItem, rawDataItem);
				}

				this.dataUsers.each((dataUser) => {
					if (dataUser.data.length == 0) { // checking if data is not set directly
						let dataUserDataItem: DataItem = dataUser.getDataItem(rawDataItem);
						dataUser.processDataItem(dataUserDataItem, rawDataItem);
					}
				});

				counter++;

				// show preloader if this takes too many time
				if (counter == 100) { // no need to check it on each data item
					counter = 0;
					let elapsed: number = Date.now() - startTime;

					if (elapsed > this.parsingStepDuration) {
						if (i < this.data.length - 10) {
							this._parseDataFrom = i + 1;

							// update preloader
							if (preloader) {
								if (i / this.data.length > 0.5 && !preloader.visible) {
									// do not start showing
								}
								else {
									preloader.progress = i / this.data.length;
								}
							}

							this.dataValidationProgress = i / this.data.length;

							i = this.data.length; // stops cycle
							this.invalidateData();
							return;
						}
					}
				}
			}

			if (preloader) {
				preloader.progress = 1;
			}

			this.dataUsers.each((dataUser) => {
				if (dataUser.hidden) {
					dataUser.hide(0);
				}
			});
		}

		this.dataValidationProgress = 1;
		this._parseDataFrom = 0; // reset this index, it is set to dataItems.length if addData() method was used.

		this.invalidateDataItems();

		if (!this._internalDefaultsApplied) {
			this.applyInternalDefaults();
		}

		this.dispatch("datavalidated"); // can't zoom chart if dispatched immediately
	}

	/**
	 * Validates (processes) data items.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataItems(): void {
		$array.remove(registry.invalidDataItems, this);

		this.dataItemsInvalid = false;

		this.invalidateDataRange();
		this.invalidate();
		this.dispatch("dataitemsvalidated");
	}

	/**
	 * Sets source (raw) data for the element. The "data" is always an `Array`
	 * of objects.
	 *
	 * @param value Data
	 */
	public set data(value: any[]) {
		this.setData(value);
	}

	protected setData(value: any[]) {
		// array might be the same, but there might be items added
		// todo: check if array changed, toString maybe?
		//if (this._data != value) {
		this._parseDataFrom = 0;
		this.disposeData();
		this._data = value;
		if (value && value.length > 0) {
			this.invalidateData();
		}
		//}
	}

	/**
	 * Returns element's source (raw) data.
	 *
	 * @return Data
	 */
	public get data(): any[] {
		if (!this._data) {
			this._data = [];
		}
		if (!this._adapterO) {
			return this._data;
		}
		else {
			return this._adapterO.apply("data", this._data);
		}
	}

	/**
	 * Returns (creates if necessary) a [[DataSource]] bound to any specific
	 * property.
	 *
	 * For example if I want to bind `data` to an external JSON file, I'd create
	 * a DataSource for it.
	 *
	 * @param property  Property to bind external data to
	 * @return A DataSource for property
	 */
	public getDataSource(property: string): DataSource {
		if (!$type.hasValue(this._dataSources[property])) {
			this._dataSources[property] = new DataSource();
			this._dataSources[property].component = this;
			this.setDataSourceEvents(this._dataSources[property], property);
			this._dataSources[property].adapter.add("dateFields", (val) => {
				return this.dataSourceDateFields(val);
			});
			this._dataSources[property].adapter.add("numberFields", (val) => {
				return this.dataSourceNumberFields(val);
			});
			this.events.on("inited", () => {
				this.loadData(property);
			}, this, false);
		}
		return this._dataSources[property];
	}

	/**
	 *A [[DataSource]] to be used for loading Component's data.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/loading-external-data/} for more on loading external data
	 * @param value  Data source
	 */
	public set dataSource(value: DataSource) {
		if (this._dataSources["data"]) {
			this.removeDispose(this._dataSources["data"]);
		}
		this._dataSources["data"] = value;
		this._dataSources["data"].component = this;
		this.events.on("inited", () => {
			this.loadData("data")
		}, this, false);
		this.setDataSourceEvents(value, "data");
	}

	/**
	 * @return Data source
	 */
	public get dataSource(): DataSource {
		if (!this._dataSources["data"]) {
			this.getDataSource("data");
		}
		return this._dataSources["data"];
	}

	/**
	 * Initiates loading of the external data via [[DataSource]].
	 *
	 * @ignore Exclude from docs
	 */
	protected loadData(property: string): void {
		this._dataSources[property].load();
	}

	/**
	 * This function is called by the [[DataSource]]'s `dateFields` adapater
	 * so that particular chart types can popuplate this setting with their
	 * own type-specific data fields so they are parsed properly.
	 *
	 * @ignore Exclude from docs
	 * @param value  Array of date fields
	 * @return Array of date fields populated with chart's date fields
	 */
	protected dataSourceDateFields(value: string[]): string[] {
		return value;
	}

	/**
	 * This function is called by the [[DataSource]]'s `numberFields` adapater
	 * so that particular chart types can popuplate this setting with their
	 * own type-specific data fields so they are parsed properly.
	 *
	 * @ignore Exclude from docs
	 * @param value  Array of number fields
	 * @return Array of number fields populated with chart's number fields
	 */
	protected dataSourceNumberFields(value: string[]): string[] {
		return value;
	}

	/**
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param list        [description]
	 * @param dataFields  [description]
	 * @param targetList  [description]
	 * @return [description]
	 */
	protected populateDataSourceFields(list: string[], dataFields: { [index: string]: string }, targetList: string[]): string[] {
		$array.each(targetList, (value: string) => {
			if (dataFields[value] && $array.indexOf(list, dataFields[value]) === -1) {
				list.push(dataFields[value]);
			}
		});
		return list;
	}

	/**
	 * Sets events on a [[DataSource]].
	 *
	 * @ignore Exclude from docs
	 */
	protected setDataSourceEvents(ds: DataSource, property?: string): void {
		ds.events.on("started", (ev) => {
			const preloader = this.preloader;
			if (preloader) {
				preloader.progress = 0;
				//preloader.label.text = this.language.translate("Loading");
			}
		}, undefined, false);
		ds.events.on("loadstarted", (ev) => {
			const preloader = this.preloader;
			if (preloader) {
				preloader.progress = 0.25;
			}
		}, undefined, false);
		ds.events.on("loadended", (ev) => {
			const preloader = this.preloader;
			if (preloader) {
				preloader.progress = 0.5;
			}
		}, undefined, false);
		ds.events.on("parseended", (ev) => {
			const preloader = this.preloader;
			if (preloader) {
				preloader.progress = 0.75;
			}
		}, undefined, false);
		ds.events.on("ended", (ev) => {
			const preloader = this.preloader;
			if (preloader) {
				preloader.progress = 1;
			}
		}, undefined, false);
		ds.events.on("error", (ev) => {
			const preloader = this.preloader;
			if (preloader) {
				preloader.progress = 1;
			}
			this.openModal(ev.message);
		}, undefined, false);

		if (property) {
			ds.events.on("done", (ev) => {
				const preloader = this.preloader;
				if (preloader) {
					preloader.progress = 1;
				}
				if (property == "data" && !$type.isArray(ev.data)) {
					ev.data = [ev.data];
				}
				if (ds.incremental && property == "data" && this.data.length) {
					this.addData(ev.data, ds.keepCount ? ev.data.length : 0);
				}
				else if (ds.updateCurrentData && property == "data" && this.data.length) {
					// cycle through existing data items
					$array.each(this.data, (item, index) => {
						if ($type.hasValue(ev.data[index])) {
							$object.each(item, (key, val) => {
								if ($type.hasValue(ev.data[index][key])) {
									item[key] = ev.data[index][key];
								}
							});
						}
					});
					this.invalidateRawData();
				}
				else {
					(<any>this)[property] = ev.data;
				}
			});
		}

	}

	/**
	 * A [[Responsive]] instance to be used when applying conditional
	 * property values.
	 *
	 * NOTE: Responsive features are currently in development and may not work
	 * as expected, if at all.
	 *
	 * @param value  Responsive rules handler
	 */
	public set responsive(value: Responsive) {
		this._responsive = value;
		this._responsive.component = this;
	}

	/**
	 * @return Responsive rules handler
	 */
	public get responsive(): Responsive {
		if (!this._responsive) {
			this._responsive = new Responsive();
			this._responsive.component = this;
		}
		return this._responsive;
	}

	/**
	 * Sets current zoom.
	 *
	 * The range uses relative values from 0 to 1, with 0 marking beginning and 1
	 * marking end of the available data range.
	 *
	 * This method will not have any effect when called on a chart object.
	 * Since the chart can have a number of axes and series, each with its own
	 * data, the meaning of "range" is very ambiguous.
	 *
	 * To zoom the chart use `zoom*` methods on its respective axes.
	 *
	 * @param range          Range
	 * @param skipRangeEvent Should rangechanged event not be triggered?
	 * @param instantly      Do not animate?
	 * @return Actual modidied range (taking `maxZoomFactor` into account)
	 */
	public zoom(range: IRange, skipRangeEvent: boolean = false, instantly: boolean = false, declination?: number): IRange {
		let start: $type.Optional<number> = range.start;
		let end = range.end;
		let priority = range.priority;

		if(range.start == range.end){
			range.start = range.start - 0.5 / this.maxZoomFactor;
			range.end = range.end + 0.5 / this.maxZoomFactor;
		}

		if (priority == "end" && end == 1 && start != 0) {
			if (start < this.start) {
				priority = "start";
			}
		}

		if (priority == "start" && start == 0) {
			if (end > this.end) {
				priority = "end";
			}
		}

		if (!$type.isNumber(declination)) {
			declination = this.maxZoomDeclination;
		}

		if (!$type.isNumber(start) || !$type.isNumber(end)) {
			return { start: this.start, end: this.end };
		}

		if (this._finalStart != start || this._finalEnd != end) {

			let maxZoomFactor: number = this.maxZoomFactor / this.minZoomCount;
			let minZoomFactor: number = this.maxZoomFactor / this.maxZoomCount;

			// most likely we are dragging left scrollbar grip here, so we tend to modify end

			if (priority == "start") {

				if (this.maxZoomCount > 0) {
					// add to the end
					if (1 / (end - start) < minZoomFactor) {
						end = start + 1 / minZoomFactor;
					}
				}

				// add to the end
				if (1 / (end - start) > maxZoomFactor) {
					end = start + 1 / maxZoomFactor;
				}
				//unless end is > 0
				if (end > 1 && end - start < 1 / maxZoomFactor) {
					//end = 1;
					start = end - 1 / maxZoomFactor;
				}
			}
			// most likely we are dragging right, so we modify left
			else {

				if (this.maxZoomCount > 0) {
					// add to the end
					if (1 / (end - start) < minZoomFactor) {
						start = end - 1 / minZoomFactor;
					}
				}

				// remove from start
				if (1 / (end - start) > maxZoomFactor) {
					start = end - 1 / maxZoomFactor;
				}
				if (start < 0 && end - start < 1 / maxZoomFactor) {
					//start = 0;
					end = start + 1 / maxZoomFactor;
				}
			}

			if (start < - declination) {
				start = - declination;
			}

			if (1 / (end - start) > maxZoomFactor) {
				end = start + 1 / maxZoomFactor;
			}

			if (end > 1 + declination) {
				end = 1 + declination;
			}

			if (1 / (end - start) > maxZoomFactor) {
				start = end - 1 / maxZoomFactor;
			}

			this._finalEnd = end;
			this._finalStart = start;

			this.skipRangeEvent = skipRangeEvent;

			this.dispatchImmediately("rangechangestarted");			

			if (this.rangeChangeDuration > 0 && !instantly) {

				// todo: maybe move this to Animation
				let rangeChangeAnimation: $type.Optional<Animation> = this.rangeChangeAnimation;
				if (rangeChangeAnimation && rangeChangeAnimation.progress < 1) {
					let options = rangeChangeAnimation.animationOptions;
					if (options.length > 1) {
						if (options[0].to == start && options[1].to == end) {
							return { start: start, end: end };
						}
						else {
							if (!rangeChangeAnimation.isDisposed()) {
								rangeChangeAnimation.stop();
							}
						}
					}
				}

				if (this.rangeChangeAnimation) {
					this.rangeChangeAnimation.kill();
				}

				rangeChangeAnimation = this.animate([{ property: "start", to: start }, { property: "end", to: end }], this.rangeChangeDuration, this.rangeChangeEasing);
				this.rangeChangeAnimation = rangeChangeAnimation;

				if (rangeChangeAnimation && !rangeChangeAnimation.isFinished()) {
					rangeChangeAnimation.events.on("animationended", () => {
						this.dispatchImmediately("rangechangeended");
					})
				}
				else {
					this.dispatchImmediately("rangechangeended");
				}

			}
			else {
				this.start = start;
				this.end = end;
				this.dispatch("rangechangeended");
			}
		}

		return { start: start, end: end };
	}

	/**
	 * Zooms to specific data items using their index in data.
	 *
	 * This method will not have any effect when called on a chart object.
	 * Since the chart can have a number of axes and series, each with its own
	 * data, the meaning of "index" is very ambiguous.
	 *
	 * To zoom the chart use `zoom*` methods on its respective axes.
	 *
	 * @param startIndex     Index of the starting data item
	 * @param endIndex       Index of the ending data item
	 * @param skipRangeEvent Should rangechanged event not be triggered?
	 * @param instantly      Do not animate?
	 */
	public zoomToIndexes(startIndex: number, endIndex: number, skipRangeEvent?: boolean, instantly?: boolean) {
		if (!$type.isNumber(startIndex) || !$type.isNumber(endIndex)) {
			return;
		}

		let start: number = startIndex / this.dataItems.length;
		let end: number = endIndex / this.dataItems.length;

		this.zoom({ start: start, end: end }, skipRangeEvent, instantly);
	}

	/**
	 * A current zoom factor (0-1). 1 meaning fully zoomed out. (showing all of
	 * the available data)
	 *
	 * @return Zoom factor
	 */
	public get zoomFactor(): number {
		return $math.fitToRange(1 / (this.end - this.start), 1, this.maxZoomFactor);
	}

	/**
	 * Max available `zoomFactor`.
	 *
	 * The element will not allow zoom to occur beyond this factor.
	 *
	 * [[DateAxis]] and [[CategoryAxis]] calculate this atutomatically so that
	 * category axis could be zoomed to one category and date axis allows to be
	 * zoomed up to one base interval.
	 *
	 * In case you want to restrict category or date axis to be zoomed to more
	 * than one category or more than one base interval, use `minZoomCount`
	 * property (set it to `> 1`).
	 *
	 * Default value of [[ValueAxis]]'s `maxZoomFactor` is `1000`.
	 *
	 * Feel free to modify it to allow bigger zoom or to restrict zooming.
	 *
	 * @param value  Maximum zoomFactor
	 */
	public set maxZoomFactor(value: number) {
		if (this.setPropertyValue("maxZoomFactor", value)) {
			if (value == 1) {
				this.maxZoomDeclination = 0;
			}

			this.invalidateDataRange();
		}
	}

	/**
	 * @return Maximum zoomFactor
	 */
	public get maxZoomFactor(): number {
		return this.getPropertyValue("maxZoomFactor");
	}


	/**
	 * Max zoom declination.
	 *
	 * @ignore
	 * @default 1
	 * @param value  Maximum zoom declination
	 */
	public set maxZoomDeclination(value: number) {
		if (this.setPropertyValue("maxZoomDeclination", value)) {
			this.invalidateDataRange();
		}
	}

	/**
	 * @ignore
	 * @return Maximum zoom declination
	 */
	public get maxZoomDeclination(): number {
		return this.getPropertyValue("maxZoomDeclination");
	}

	/**
	 * Sets current starting index.
	 *
	 * @ignore Exclude from docs
	 * @param value Start index
	 */
	public set startIndex(value: number) {
		this._startIndex = $math.fitToRange(Math.round(value), 0, this.dataItems.length);
		//this._workingStartIndex = this._startIndex; // not good, breaks adjusted working start index of line series
		this.start = this.indexToPosition(this._startIndex);
	}

	/**
	 * @ignore
	 * @todo:review description
	 * returns item's relative position by the index of the item
	 * @param index
	 */
	public indexToPosition(index: number) {
		return index / this.dataItems.length;
	}

	/**
	 * Current starting index.
	 *
	 * @return Start index
	 */
	public get startIndex(): number {
		if (!$type.isNumber(this._startIndex)) {
			this._startIndex = 0;
		}

		return this._startIndex;
	}

	/**
	 * Sets current ending index.
	 *
	 * @ignore Exclude from docs
	 * @param value End index
	 */
	public set endIndex(value: number) {
		this._endIndex = $math.fitToRange(Math.round(value), 0, this.dataItems.length);
		//this._workingEndIndex = this._endIndex; // not good, breaks adjusted workingend index of line series
		this.end = this.indexToPosition(this._endIndex);
	}

	/**
	 * Current ending index.
	 *
	 * @return End index
	 */
	public get endIndex(): number {
		let count = this.dataItems.length;
		if (!$type.isNumber(this._endIndex) || this._endIndex > count) {
			this._endIndex = count;
		}
		return this._endIndex;
	}

	/**
	 * Start of the current data range (zoom).
	 *
	 * These are relative values from 0 (beginning) to 1 (end).
	 *
	 * @param value Start (0-1)
	 */
	public set start(value: number) {
		// value = $math.round(value, 10); not good

		//if (1 / (this.end - value) > this.maxZoomFactor) {
		//	value = this.end - 1 / this.maxZoomFactor;
		//}
		if (this._start != value) {
			this._start = value;
			let startIndex = Math.max(0, Math.floor(this.dataItems.length * value) || 0);
			this._startIndex = Math.min(startIndex, this.dataItems.length);
			this.invalidateDataRange();
			this.invalidate();
			this.dispatchImmediately("startchanged");
			this.dispatch("startendchanged");
		}
	}

	/**
	 * @return Start (0-1)
	 */
	public get start(): number {
		if (!this._adapterO) {
			return this._start;
		}
		else {
			return this._adapterO.apply("start", this._start);
		}
	}

	/**
	 * End of the current data range (zoom).
	 *
	 * These are relative values from 0 (beginning) to 1 (end).
	 *
	 * @param value End (0-1)
	 */
	public set end(value: number) {
		// value = $math.round(value, 10); // not good

		//if (1 / (value - this.start) > this.maxZoomFactor) {
		//	value = 1 / this.maxZoomFactor + this.start;
		//}

		if (this._end != value) {
			this._end = value;
			this._endIndex = Math.min(this.dataItems.length, Math.ceil(this.dataItems.length * value) || 0);
			this.invalidateDataRange();
			this.invalidate();
			this.dispatchImmediately("endchanged");
			this.dispatch("startendchanged");
		}
	}

	/**
	 * @return End (0-1)
	 */
	public get end(): number {
		if (!this._adapterO) {
			return this._end;
		}
		else {
			return this._adapterO.apply("end", this._end);
		}
	}


	/**
	 * [removeFromInvalids description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected removeFromInvalids(): void {
		super.removeFromInvalids();
		registry.removeFromInvalidComponents(this);
		$array.remove(registry.invalidDataItems, this);
		$array.remove(registry.invalidDataRange, this);
		$array.remove(registry.invalidRawDatas, this);
	}

	/**
	 * Returns a list of source [[DataItem]] objects currently used in the chart.
	 *
	 * @return List of data items
	 */
	public get dataItems(): OrderedListTemplate<this["_dataItem"]> {
		if (this._currentDataSetId != "") {
			let dataItems = this.dataSets.getKey(this._currentDataSetId);
			if (dataItems) {
				return dataItems;
			}
		}
		return this._dataItems;
	}

	/**
	 * Holds data items for data sets (usually aggregated data).
	 *
	 * @ignore
	 * @since 4.7.0
	 * @return  Data sets
	 */
	public get dataSets(): Dictionary<string, OrderedListTemplate<this["_dataItem"]>> {
		if (!this._dataSets) {
			this._dataSets = new Dictionary();
		}
		return this._dataSets;
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

		if (this._currentDataSetId != id) {
			let dataSet = this.dataSets.getKey(id);
			if (!dataSet) {
				if (this._currentDataSetId != "") {
					this.dataItems.each((dataItem) => {
						dataItem.__disabled = true;
					})

					this._currentDataSetId = "";

					this.invalidateDataRange();

					this._prevStartIndex = undefined;

					this.dataItems.each((dataItem) => {
						dataItem.__disabled = false;
					})

					return true;
				}
			}
			else {
				this.dataItems.each((dataItem) => {
					dataItem.__disabled = true;
				})

				this._currentDataSetId = id;

				this.invalidateDataRange();

				this._prevStartIndex = undefined;

				this.dataItems.each((dataItem) => {
					dataItem.__disabled = false;
				})

				return true;
			}
		}
		return false
	}

	/**
	 * Returns id of the currently used data set, or `undefined` if main data set
	 * is in use.
	 *
	 * @since 4.7.0
	 * @return Current data set id
	 */
	public get currentDataSetId(): string {
		return this._currentDataSetId;
	}

	/**
	 * Returns reference to "main" data set (unaggregated data as it was supplied
	 * in `data`).
	 *
	 * @since 4.7.0
	 * @return Main data set
	 */
	public get mainDataSet(): OrderedListTemplate<this["_dataItem"]> {
		return this._dataItems;
	}

	/**
	 * Updates the indexes for the dataItems
	 *
	 * @ignore Exclude from docs
	 */
	protected _updateDataItemIndexes(startIndex: number): void {
		const dataItems = this.mainDataSet.values;
		const length = dataItems.length;

		for (let i = startIndex; i < length; ++i) {
			dataItems[i]._index = i;
		}
	}

	/**
	 * Processes newly added [[DataItem]] as well as triggers data re-validation.
	 *
	 * @ignore Exclude from docs
	 * @param event [description]
	 */
	protected handleDataItemAdded(event: ISortedListEvents<DataItem>["inserted"]) {
		event.newValue.component = this;

		this._updateDataItemIndexes(event.index);

		if (!this.dataItemsInvalid) {
			this.invalidateDataItems();
		}
	}

	/**
	 * removes [[DataItem]] as well as triggers data re-validation.
	 *
	 * @ignore Exclude from docs
	 * @param event [description]
	 */
	protected handleDataItemRemoved(event: ISortedListEvents<DataItem>["removed"]) {
		//		event.oldValue.component = undefined; // not good, as some items might be not removed from component lists

		this._updateDataItemIndexes(event.index);

		if (!this.dataItemsInvalid) {
			this.invalidateDataItems();
		}
	}

	/**
	 * Binds a data element's field to a specific field in raw data.
	 * For example, for the very basic column chart you'd want to bind a `value`
	 * field to a field in data, such as `price`.
	 *
	 * Some more advanced Components, like [[CandlestickSeries]] need several
	 * data fields bound to data, such as ones for open, high, low and close
	 * values.
	 *
	 * @todo Example
	 * @param field  Field name
	 * @param value  Field name in data
	 */
	public bindDataField<Key extends keyof this["_dataFields"]>(field: Key, value: this["_dataFields"][Key]) {
		this.dataFields[field] = value;
		this.invalidateDataRange();
	}

	/**
	 * Invalidates processed data.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidateProcessedData(): void {
		this.resetProcessedRange();
		this.invalidateDataRange();
	}

	/**
	 * [resetProcessedRange description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public resetProcessedRange(): void {
		this._prevEndIndex = null;
		this._prevStartIndex = null;
	}

	/**
	 * Returns all other [[Component]] objects that are using this element's
	 * data.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @return [description]
	 */
	public get dataUsers(): List<Component> {
		if (!this._dataUsers) {
			this._dataUsers = new List<Component>();

			//this._disposers.push(new ListDisposer(this._dataUsers));

			// TODO better way of handling this? e.g. move into another module ?
			this._disposers.push(new Disposer(() => {
				// TODO clear the list ?
				$iter.each(this._dataUsers.iterator(), (x) => {
					x.dispose();
				});
			}));
		}

		return this._dataUsers;
	}

	/**
	 * Returns a clone of this element.
	 *
	 * @return Clone
	 */
	public clone(): this {
		let component: this = super.clone();
		component.dataFields = $utils.copyProperties(this.dataFields, {});
		return component;
	}

	/**
	 * Copies all parameters from another [[Component]].
	 *
	 * @param source Source Component
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.data = source.data;
		this.sequencedInterpolation = source.sequencedInterpolation;
		this.sequencedInterpolationDelay = source.sequencedInterpolationDelay;
		this.interpolationDuration = source.interpolationDuration;
		this.interpolationEasing = source.interpolationEasing;
	}

	/**
	 * Invalidates the whole element, including all its children, causing
	 * complete re-parsing of data and redraw.
	 *
	 * Use sparingly!
	 */
	public reinit(): void {
		this._inited = false;
		this.deepInvalidate();
	}

	/**
	 * Add an adapter for data.
	 *
	 * @return Exporting
	 */
	protected getExporting(): Export {
		const _export = super.getExporting();
		if (!_export.adapter.has("data", this._exportData, -1, this)) {
			_export.adapter.add("data", this._exportData, -1, this);
			this.events.on("datavalidated", (ev) => {
				if (_export.menu) {
					_export.menu.invalidate();
				}
				_export.handleDataUpdated();
			});
		}
		return _export;
	}

	private _exportData(arg: IExportAdapters["data"]): IExportAdapters["data"] {
		arg.data = this.data;
		return arg;
	}

	protected setDisabled(value: boolean): boolean {
		let changed = super.setDisabled(value);
		if (changed) {
			this.invalidateData();
		}
		return changed;
	}

	/**
	 * @ignore
	 */
	protected setShowOnInit(value: boolean) {
		if (value != this.getPropertyValue("showOnInit")) {
			if (value && !this.inited && !this.hidden) {
				this._showOnInitDisposer2 = this.events.once("dataitemsvalidated", this.hideInitially, this, false);
				this._disposers.push(this._showOnInitDisposer2);
			}
			else {
				if (this._showOnInitDisposer2) {
					this.removeDispose(this._showOnInitDisposer2);
				}
			}
		}
		// important order here
		super.setShowOnInit(value);
	}

	protected setBaseId(value: string) {
		if (value != this._baseId) {
			if (this.dataInvalid) {
				this.dataInvalid = false;
				registry.removeFromInvalidComponents(this);
				this._baseId = value;
				this.invalidateData();
			}
		}
		super.setBaseId(value);
	}

	/**
	 * Use this for [[CategoryAxis]] or [[DateAxis]].
	 *
	 * Allows restricting zoom in beyond certain number of categories or base
	 * intervals.
	 *
	 * @default 1
	 * @param value  Min zoom count
	 */
	public set minZoomCount(value: number) {
		this.setPropertyValue("minZoomCount", value);
	}

	/**
	 * @return Min zoom count
	 */
	public get minZoomCount(): number {
		return this.getPropertyValue("minZoomCount");
	}

	/**
	 * Use this for [[CategoryAxis]] or [[DateAxis]].
	 *
	 * Limits how many categories or base intervals can be shown at the same
	 * time.
	 *
	 * If there are more items in the chart, the chart will auto-zoom.
	 *
	 * @default 0 (no limit)
	 * @since 4.6.2
	 * @param value  Max zoom count
	 */
	public set maxZoomCount(value: number) {
		this.setPropertyValue("maxZoomCount", value);
	}

	/**
	 * @return Max zoom count
	 */
	public get maxZoomCount(): number {
		return this.getPropertyValue("maxZoomCount");
	}

	/**
	 * Called during the System.update method
	 *
	 * @ignore Exclude from docs
	 */
	public _systemCheckIfValidate(): boolean {
		if (this.dataInvalid || (this.dataProvider && this.dataProvider.dataInvalid)) {
			return false;

		} else {
			return true;
		}
	}

	/**
	 * Adds easing functions to "function" fields.
	 *
	 * @param field  Field name
	 * @return Assign as function?
	 */
	protected asFunction(field: string): boolean {
		return field == "interpolationEasing" || field == "rangeChangeEasing" || super.asIs(field);
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Component"] = Component;
