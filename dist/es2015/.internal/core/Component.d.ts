/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "./Container";
import { SpriteEventDispatcher, AMEvent } from "./Sprite";
import { List, IListEvents } from "./utils/List";
import { OrderedListTemplate } from "./utils/SortedList";
import { Animation } from "./utils/Animation";
import { Dictionary } from "./utils/Dictionary";
import { Export } from "./export/Export";
import { DataSource } from "./data/DataSource";
import { Responsive } from "./responsive/Responsive";
import { DataItem, IDataItemEvents } from "./DataItem";
import { IRange } from "./defs/IRange";
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
}
/**
 * Defines events for [[Component]].
 */
export interface IComponentEvents extends IContainerEvents {
    /**
     * Invoked when range of the currently selected data is validated.
     * @todo: change to datarangevalidated?
     */
    datarangechanged: {};
    /**
     * Invoked when the raw data for the component changes.
     */
    datavalidated: {};
    /**
     * Invoked when value(s) of the element's data items ar validated.
     * @todo: change to valuesvalidated?
     */
    valueschanged: {};
    /**
     * Invoked just before element is validated (after changes).
     */
    predatavalidate: {};
}
/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IComponentAdapters extends IContainerAdapters, IComponentProperties {
    /**
     * Applied after [[Component ]] retrieves data value from data context
     * (raw data), but before it is provided to [[DataItem]].
     */
    dataContextValue: {
        value: any;
        field: string;
        dataItem: DataItem;
    };
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
     * in raw data.\z
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
     * Event dispacther..
     *
     * @type {SpriteEventDispatcher<AMEvent<Component, IComponentEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<Component, IComponentEvents>>;
    /**
     * Holds the data for the component.
     *
     * @ignore Exclude from docs
     * @type {any[]}
     */
    protected _data: any[];
    /**
     * A [[Component]] which provides data to this component (like Chart provides
     * data for Series).
     *
     * @type {Component}
     */
    dataProvider: Component;
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
     * @type {Responsive}
     */
    protected _responsive: Responsive;
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
     * @type {List<Component>}
     */
    protected _dataUsers: List<Component>;
    /**
     *
     * @ignore Exclude from docs
     * @deprecated Not used?
     * @todo Description
     * @type {string}
     */
    protected _dataDateFormat: string;
    /**
     *
     * @ignore Exclude from docs
     * @todo Description
     * @deprecated Not used?
     * @type {Dictionary}
     */
    protected _dataMethods: Dictionary<string, (value: number) => number>;
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
    protected _dataItems: OrderedListTemplate<this["_dataItem"]>;
    /**
     * [_startIndex description]
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _startIndex: number;
    /**
     * [_endIndex description]
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _endIndex: number;
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
     * @type {number}
     */
    protected _finalStart: number;
    /**
     * [_finalEnd description]
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _finalEnd: number;
    /**
     * If set to `true`, changing data range in element will not trigger
     * `daterangechanged` event.
     *
     * @type {boolean}
     */
    skipRangeEvent: boolean;
    /**
     * Duration (ms) to animate between different range selections.
     * @type {number}
     */
    rangeChangeDuration: number;
    /**
     * An easing function to use for range change animation.
     *
     * @see {@link Ease}
     * @type {function}
     */
    rangeChangeEasing: (value: number) => number;
    /**
     * A reference to a currently playing range change [[Animation]] object.
     * @ignore Exclude from docs
     * @type {Animation}
     */
    rangeChangeAnimation: Animation;
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
     * Duration (ms) the interpolation (morphing) animation should take when
     * transiting from one value into another.
     *
     * @type {number}
     */
    interpolationDuration: number;
    /**
     * An easing function to use for the interpolation (morphing) animation for
     * transition between two values.
     *
     * @see {@link Ease}
     * @type {function}
     */
    interpolationEasing: (value: number) => number;
    /**
     * Should interpolation animations for each element's data item play
     * consequently?
     *
     * @type {boolean}
     */
    sequencedInterpolation: boolean;
    /**
     * A delay (ms) to wait between animating each subsequent data item's
     * interpolation animation.
     *
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
     * @type {number}
     */
    protected _prevStartIndex: number;
    /**
     * [_prevEndIndex description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {number}
     */
    protected _prevEndIndex: number;
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
     * @type {number}
     */
    protected _workingStartIndex: number;
    /**
     * [_workingEndIndex description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {number}
     */
    protected _workingEndIndex: number;
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
     * @param {IListEvents<Component>["insert"]} event Event object
     */
    protected handleDataUserAdded(event: IListEvents<Component>["insert"]): void;
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
    protected processDataItem(dataItem: this["_dataItem"], dataContext?: Object, index?: number): void;
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
     * Adds one or several (arrat) of data items to the existing data.
     *
     * @param {Object | Object[]} rawDataItem One or many raw data item objects
     */
    addData(rawDataItem: Object | Object[]): void;
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
     * Returns a [[DataSource]] specifically for loading Component's data.
     *
     * @return {DataSource} Data source
     */
    /**
     * Sets a [[DataSource]] to be used for loading Component's data.
     *
     * @param {DataSource} value Data source
     */
    dataSource: DataSource;
    /**
     * Initiates loading of the external data via [[DataSource]].
     *
     * @ignore Exclude from docs
     */
    protected loadData(): void;
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
     * Returns (creates if necessary) a new [[DataSource]] object for loading
     * external data files.
     *
     * @return {DataSource} Data source
     */
    /**
     * Sets a [[Responsive]] instance to be used when applying conditional
     * property values.
     *
     * @param {Responsive} value Data source
     */
    responsive: Responsive;
    /**
     * Sets current zoom.
     *
     * The range uses relative values from 0 to 1, with 0 marking beginning and 1
     * marking end of the available data range.
     *
     * @param  {IRange}  range          Range
     * @param  {boolean} skipRangeEvent Should rangechanged event not be triggered?
     * @param  {boolean} instantly      Do not animate?
     * @return {IRange}                 Actual mofidied range (taking `maxZoomFactor` into account)
     */
    zoom(range: IRange, skipRangeEvent?: boolean, instantly?: boolean): IRange;
    /**
     * Zooms to specific data items using their index in data.
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
     * Returns max available `zoomFactor`. The element will not allow zoom to
     * occur beyond this factor.
     *
     * @return {number} Maximum `zoomFactor`
     */
    /**
     * Sets max available `zoomFactor`.
     *
     * @param {number} value Maximum `zoomFactor`
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
     * Format of the dates in source data.
     *
     * @ignore Exclude from docs
     * @deprecated Not used?
     * @return {string} Format of the dates in source data
     */
    readonly dataDateFormat: string;
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
     * @todo Check if we can automatically dispose all of the data items when Component is disposed
     */
    readonly dataItems: OrderedListTemplate<this["_dataItem"]>;
    /**
     * Processes newly added [[DataItem]] as well as triggers data re-validation.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<DataItem>["insert"]} event [description]
     */
    protected handleDataItemAdded(event: IListEvents<DataItem>["insert"]): void;
    /**
     * removes [[DataItem]] as well as triggers data re-validation.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<DataItem>["insert"]} event [description]
     */
    protected handleDataItemRemoved(event: IListEvents<DataItem>["remove"]): void;
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
     * Invalidates the whole element, including all its children, causing
     * complete re-parsing of data and redraw.
     *
     * Use sparingly!
     */
    reinit(): void;
    /**
     * Returns an [[Export]] instance.
     *
     * If it does not exist it looks in parents. It also adds "data" Adapter so
     * that Export can access Component's data.
     *
     * @return {Export} Export instance
     */
    readonly exporting: Export;
}
