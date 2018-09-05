/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "./Container";
import { AMEvent } from "./Sprite";
import { List, IListEvents } from "./utils/List";
import { OrderedListTemplate } from "./utils/SortedList";
import { Animation } from "./utils/Animation";
import { Dictionary } from "./utils/Dictionary";
import { IDisposer } from "./utils/Disposer";
import { Export } from "./export/Export";
import { DataSource } from "./data/DataSource";
import { Responsive } from "./responsive/Responsive";
import { DataItem, IDataItemEvents } from "./DataItem";
import { IRange } from "./defs/IRange";
import * as $type from "./utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * A list of available types for calculated values.
 * @todo Not finished
 * @todo Description
 */
export declare type CalculatedValue = "value" | "percent" | "change" | "changePercent" | "previousChangePercent" | "previousChange" | "sum" | "average" | "open" | "close" | "low" | "high" | "count" | "total" | "totalPercent" | "stack";
/**
 * Defines properties for [[Component]].
 */
export interface IComponentProperties extends IContainerProperties {
    /**
     * maximum zoom factor of a component
     */
    maxZoomFactor?: number;
}
/**
 * Defines data fields for [[Component]].
 */
export interface IComponentDataFields {
    data?: string;
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
     *
     * @todo: change to valuesvalidated?
     */
    valueschanged: {};
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
        value: any;
        field: string;
        dataItem: DataItem;
    };
    /**
     * Applied to chart's data before it is retrieved for use.
     */
    data: any[];
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
export declare class Component extends Container {
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IComponentDataFields}
     */
    _dataFields: IComponentDataFields;
    /**
     * Holds data field names.
     *
     * Data fields define connection beween [[DataItem]] and actual properties
     * in raw data.
     *
     * @type {IComponentDataFields}
     */
    dataFields: this["_dataFields"];
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IComponentProperties}
     */
    _properties: IComponentProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IComponentAdapters}
     */
    _adapter: IComponentAdapters;
    /**
     * Defines available events.
     *
     * @type {IComponentEvents}
     * @ignore Exclude from docs
     */
    _events: IComponentEvents;
    /**
     * Holds the data for the component.
     *
     * @ignore Exclude from docs
     * @type {Optional<any[]>}
     */
    protected _data: $type.Optional<any[]>;
    /**
     * A [[Component]] which provides data to this component (like Chart provides
     * data for Series).
     *
     * @type {Optional<Component>}
     */
    dataProvider: $type.Optional<Component>;
    /**
     * A list of [[DataSource]] definitions of external data source.
     *
     * @ignore Exclude from docs
     * @type {Object}
     */
    protected _dataSources: {
        [index: string]: DataSource;
    };
    /**
     * An instance of [[Responsive]].
     *
     * @ignore Exclude from docs
     * @type {Optional<Responsive>}
     */
    protected _responsive: $type.Optional<Responsive>;
    /**
     * This is used when only new data is invalidated (if added using `addData`
     * method).
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _parseDataFrom: number;
    /**
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {Optional<List<Component>>}
     */
    protected _dataUsers: $type.Optional<List<Component>>;
    /**
     * Holds the disposers for the dataItems and dataUsers
     *
     * @ignore Exclude from docs
     * @type {Array<IDisposer>}
     */
    protected _dataDisposers: Array<IDisposer>;
    /**
     *
     * @ignore Exclude from docs
     * @todo Description
     * @deprecated Not used?
     * @type {Optional<Dictionary>}
     */
    protected _dataMethods: $type.Optional<Dictionary<string, (value: number) => number>>;
    /**
     * Identifies the type of the [[DataItem]] used in this element.
     *
     * @ignore Exclude from docs
     * @type {DataItem}
     */
    _dataItem: DataItem;
    /**
     * List of element's source data items.
     *
     * @ignore Exclude from docs
     */
    protected _dataItems: $type.Optional<OrderedListTemplate<this["_dataItem"]>>;
    /**
     * [_startIndex description]
     *
     * @ignore Exclude from docs
     * @type {Optional<number>}
     */
    protected _startIndex: $type.Optional<number>;
    /**
     * [_endIndex description]
     *
     * @ignore Exclude from docs
     * @type {Optional<number>}
     */
    protected _endIndex: $type.Optional<number>;
    /**
     * [_start description]
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _start: number;
    /**
     * [_end description]
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _end: number;
    /**
     * [_finalStart description]
     *
     * @ignore Exclude from docs
     * @type {Optional<number>}
     */
    protected _finalStart: $type.Optional<number>;
    /**
     * [_finalEnd description]
     *
     * @ignore Exclude from docs
     * @type {Optional<number>}
     */
    protected _finalEnd: $type.Optional<number>;
    /**
     * If set to `true`, changing data range in element will not trigger
     * `daterangechanged` event.
     *
     * @type {boolean}
     */
    skipRangeEvent: boolean;
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
     * @type {number}
     */
    rangeChangeDuration: number;
    /**
     * An easing function to use for range change animation.
     *
     * @see {@link Ease}
     * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
     * @type {function}
     */
    rangeChangeEasing: (value: number) => number;
    /**
     * A reference to a currently playing range change [[Animation]] object.
     *
     * @ignore Exclude from docs
     * @type {Optional<Animation>}
     */
    rangeChangeAnimation: $type.Optional<Animation>;
    /**
     * A duration (ms) of each data parsing step. A Component parses its data in
     * chunks in order to avoid completely freezing the machine when large data
     * sets are used. This setting will control how many milliseconds should pass
     * when parsing data until parser stops for a brief moment to let other
     * processes catch up.
     *
     * @type {number}
     */
    parsingStepDuration: number;
    /**
     * [dataInvalid description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {boolean}
     */
    dataInvalid: boolean;
    /**
     *
     * @ignore Exclude from docs
     */
    rawDataInvalid: boolean;
    /**
     * [dataRangeInvalid description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {boolean}
     */
    dataRangeInvalid: boolean;
    /**
     * [dataItemsInvalid description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {boolean}
     */
    dataItemsInvalid: boolean;
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
     * @type {number}
     */
    interpolationDuration: number;
    /**
     * An easing function to use for interpolating values when transiting from
     * one source value to another.
     *
     * @default cubicOut
     * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
     * @see {@link Ease}
     * @type {function}
     */
    interpolationEasing: (value: number) => number;
    /**
     * Indicates whether transition between data item's values should start and
     * play out all at once, or with a small delay (as defined by
     * `sequencedInterpolationDelay`) for each subsequent data item.
     *
     * @default true
     * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
     * @type {boolean}
     */
    sequencedInterpolation: boolean;
    /**
     * A delay (ms) to wait between animating each subsequent data item's
     * interpolation animation.
     *
     * Relative only if `sequencedInterpolation = true`.
     *
     * @default 0
     * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
     * @type {number}
     */
    sequencedInterpolationDelay: number;
    /**
     * A progress (0-1) for the data validation process.
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    dataValidationProgress: number;
    /**
     * [_prevStartIndex description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {Optional<number>}
     */
    protected _prevStartIndex: $type.Optional<number>;
    /**
     * [_prevEndIndex description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {Optional<number>}
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
     * @type {Optional<number>}
     */
    protected _workingStartIndex: $type.Optional<number>;
    /**
     * [_workingEndIndex description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {Optional<number>}
     */
    protected _workingEndIndex: $type.Optional<number>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {DataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * [handleDataUserAdded description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {IListEvents<Component>["inserted"]} event Event object
     */
    protected handleDataUserAdded(event: IListEvents<Component>["inserted"]): void;
    /**
     * [handleDataItemValueChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    protected handleDataItemValueChange(): void;
    /**
     * [handleDataItemWorkingValueChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    protected handleDataItemWorkingValueChange(event: AMEvent<DataItem, IDataItemEvents>["workingvaluechanged"]): void;
    /**
     * [handleDataItemWorkingLocationChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    protected handleDataItemWorkingLocationChange(event: AMEvent<DataItem, IDataItemEvents>["workinglocationchanged"]): void;
    /**
     * [handleDataItemCalculatedValueChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    protected handleDataItemCalculatedValueChange(): void;
    /**
     * [handleDataItemPropertyChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    protected handleDataItemPropertyChange(): void;
    /**
     * Populates a [[DataItem]] width data from data source.
     *
     * Loops through all the fields and if such a field is found in raw data
     * object, a corresponding value on passed in `dataItem` is set.
     *
     * @ignore Exclude from docs
     * @param {Object} item
     */
    protected processDataItem(dataItem: this["_dataItem"], dataContext?: Object): void;
    /**
     *
     * When validating raw data, instead of processing data item, we update it
     *
     * @ignore Exclude from docs
     * @param {Object} item
     */
    protected updateDataItem(dataItem: this["_dataItem"]): void;
    /**
     * [validateDataElements description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    protected validateDataElements(): void;
    /**
     * Validates this element and its related elements.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * [validateDataElement description]
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]} dataItem [description]
     */
    validateDataElement(dataItem: this["_dataItem"]): void;
    /**
     * Adds one or several (array) of data items to the existing data.
     *
     * @param {Object | Object[]} rawDataItem One or many raw data item objects
     */
    addData(rawDataItem: Object | Object[], removeCount?: number): void;
    /**
     * Removes elements from the beginning of data
     *
     * @param {Optional<number>} coun number of elements to remove
     */
    removeData(count: $type.Optional<number>): void;
    /**
     * Triggers a data (re)parsing.
     *
     * @ignore Exclude from docs
     */
    invalidateData(): void;
    /**
     * [invalidateDataUsers description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    invalidateDataUsers(): void;
    /**
     * Invalidates data values. When data array is not changed, but values within
     * it changes, we invalidate data so that component would process changes.
     *
     * @ignore Exclude from docs
     */
    invalidateDataItems(): void;
    /**
     * Invalidates data range. This is done when data which must be shown
     * changes (chart is zoomed for example).
     *
     * @ignore Exclude from docs
     */
    invalidateDataRange(): void;
    /**
     * Processes data range.
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    validateDataRange(): void;
    /**
     * [sliceData description]
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    protected sliceData(): void;
    /**
     * [rangeChangeUpdate description]
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    protected rangeChangeUpdate(): void;
    /**
     * [removeDataItems description]
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    protected removeDataItems(): void;
    /**
     * [appendDataItems description]
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    protected appendDataItems(): void;
    /**
     * [appendDataItem description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {this["_dataItem"]} dataItem [description]
     */
    protected appendDataItem(dataItem: this["_dataItem"]): void;
    /**
     * If you want to have a smooth transition from one data values to another, you change your raw data and then you must call this method.
     * then instead of redrawing everything, the chart will check raw data and smoothly transit from previous to new data
     */
    invalidateRawData(): void;
    /**
     * @ignore
     */
    validateRawData(): void;
    /**
     * @ignore
     */
    disposeData(): void;
    /**
     * Validates (processes) data.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    /**
     * Validates (processes) data items.
     *
     * @ignore Exclude from docs
     */
    validateDataItems(): void;
    /**
     * Returns element's source (raw) data.
     *
     * @return {any[]} Data
     */
    /**
     * Sets source (raw) data for the element. The "data" is always an `Array`
     * of objects.
     *
     * @param {any[]} value Data
     */
    data: any[];
    /**
     * Returns (creates if necessary) a [[DataSource]] bound to any specific
     * property.
     *
     * For example if I want to bind `data` to an external JSON file, I'd create
     * a DataSource for it.
     *
     * @param  {string}      property  Property to bind external data to
     * @return {DataSource}            A DataSource for property
     */
    getDataSource(property: string): DataSource;
    /**
     * @return {DataSource} Data source
     */
    /**
     *A [[DataSource]] to be used for loading Component's data.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/loading-external-data/} for more on loading external data
     * @param {DataSource}  value  Data source
     */
    dataSource: DataSource;
    /**
     * Initiates loading of the external data via [[DataSource]].
     *
     * @ignore Exclude from docs
     */
    protected loadData(property: string): void;
    /**
     * This function is called by the [[DataSource]]'s `dateFields` adapater
     * so that particular chart types can popuplate this setting with their
     * own type-speicifc data fields so they are parsed properly.
     *
     * @ignore Exclude from docs
     * @param  {string[]}  value  Array of date fields
     * @return {string[]}         Array of date fields populated with chart's date fields
     */
    protected dataSourceDateFields(value: string[]): string[];
    /**
     * This function is called by the [[DataSource]]'s `numberFields` adapater
     * so that particular chart types can popuplate this setting with their
     * own type-speicifc data fields so they are parsed properly.
     *
     * @ignore Exclude from docs
     * @param  {string[]}  value  Array of number fields
     * @return {string[]}         Array of number fields populated with chart's number fields
     */
    protected dataSourceNumberFields(value: string[]): string[];
    /**
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {string[]}  list        [description]
     * @param  {object}    dataFields  [description]
     * @param  {string[]}  targetList  [description]
     * @return {string[]}              [description]
     */
    protected populateDataSourceFields(list: string[], dataFields: {
        [index: string]: string;
    }, targetList: string[]): string[];
    /**
     * Sets events on a [[DataSource]].
     *
     * @ignore Exclude from docs
     */
    protected setDataSourceEvents(ds: DataSource, property?: string): void;
    /**
     * @return {DataSource} Data source
     */
    /**
     * A [[Responsive]] instance to be used when applying conditional
     * property values.
     *
     * NOTE: Responsive features are currently in development and may not work
     * as expected, if at all.
     *
     * @param {Responsive}  value  Data source
     */
    responsive: Responsive;
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
     * @param  {IRange}  range          Range
     * @param  {boolean} skipRangeEvent Should rangechanged event not be triggered?
     * @param  {boolean} instantly      Do not animate?
     * @return {IRange}                 Actual modidied range (taking `maxZoomFactor` into account)
     */
    zoom(range: IRange, skipRangeEvent?: boolean, instantly?: boolean): IRange;
    /**
     * Zooms to specific data items using their index in data.
     *
     * This method will not have any effect when called on a chart object.
     * Since the chart can have a number of axes and series, each with its own
     * data, the meaning of "index" is very ambiguous.
     *
     * To zoom the chart use `zoom*` methods on its respective axes.
     *
     * @param {number}  startIndex     Index of the starting data item
     * @param {number}  endIndex       Index of the ending data item
     * @param {boolean} skipRangeEvent Should rangechanged event not be triggered?
     * @param {boolean} instantly      Do not animate?
     */
    zoomToIndexes(startIndex: number, endIndex: number, skipRangeEvent?: boolean, instantly?: boolean): void;
    /**
     * A current zoom factor (0-1). 1 meaning fully zoomed out. (showing all of
     * the available data)
     *
     * @return {number} Zoom factor
     */
    readonly zoomFactor: number;
    /**
     * @return {number} Maximum `zoomFactor`
     */
    /**
     * Max available `zoomFactor`.
     *
     * The element will not allow zoom to occur beyond this factor.
     *
     * @param {number}  value  Maximum `zoomFactor`
     */
    maxZoomFactor: number;
    /**
     * Current starting index.
     *
     * @return {number} Start index
     */
    /**
     * Sets current starting index.
     *
     * @ignore Exclude from docs
     * @param {number} value Start index
     */
    startIndex: number;
    /**
     * @ignore
     * @todo:review description
     * returns item's relative position by the index of the item
     * @param {number} index
     */
    indexToPosition(index: number): number;
    /**
     * Current ending index.
     *
     * @return {number} End index
     */
    /**
     * Sets current ending index.
     *
     * @ignore Exclude from docs
     * @param {number} value End index
     */
    endIndex: number;
    /**
     * Current relative starting position of the data range (zoom).
     *
     * @return {number} Start (0-1)
     */
    /**
     * Sets start of the current data range (zoom).
     *
     * @ignore Exclude from docs
     * @param {number} value Start (0-1)
     */
    start: number;
    /**
     * Current relative ending position fo the data range (zoom).
     *
     * @return {number} End (0-1)
     */
    /**
     * Sets end of the current data range (zoom).
     *
     * @ignore Exclude from docs
     * @param {number} value End (0-1)
     */
    end: number;
    /**
     * [removeFromInvalids description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    protected removeFromInvalids(): void;
    /**
     * Returns a list of source [[DataItem]] objects.
     *
     * @return {OrderedListTemplate} List of data items
     */
    readonly dataItems: OrderedListTemplate<this["_dataItem"]>;
    /**
     * Processes newly added [[DataItem]] as well as triggers data re-validation.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<DataItem>["inserted"]} event [description]
     */
    protected handleDataItemAdded(event: IListEvents<DataItem>["inserted"]): void;
    /**
     * removes [[DataItem]] as well as triggers data re-validation.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<DataItem>["inserted"]} event [description]
     */
    protected handleDataItemRemoved(event: IListEvents<DataItem>["removed"]): void;
    /**
     * [dataMethods description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @deprecated Not used?
     * @param {Dictionary} List of data methods
     */
    readonly dataMethods: Dictionary<string, (value: number) => number>;
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
     * @param {Key}                       field  Field name
     * @param {this["_dataFields"][Key]}  value  Field name in data
     */
    bindDataField<Key extends keyof this["_dataFields"]>(field: Key, value: this["_dataFields"][Key]): void;
    /**
     * Invalidates processed data.
     *
     * @ignore Exclude from docs
     */
    invalidateProcessedData(): void;
    /**
     * [resetProcessedRange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    resetProcessedRange(): void;
    /**
     * Returns all other [[Component]] objects that are using this element's
     * data.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @return {List<Component>} [description]
     */
    readonly dataUsers: List<Component>;
    /**
     * Returns a clone of this element.
     *
     * @return {this} Clone
     */
    clone(): this;
    /**
     * Copies all parameters from another [[Component]].
     *
     * @param {Component} source Source Component
     */
    copyFrom(source: this): void;
    /**
     * Invalidates the whole element, including all its children, causing
     * complete re-parsing of data and redraw.
     *
     * Use sparingly!
     */
    reinit(): void;
    /**
     * Add an adapter for data.
     *
     * @return {Export} Exporting
     */
    protected getExporting(): Export;
    private _exportData(arg);
    protected setDisabled(value: boolean): void;
}
