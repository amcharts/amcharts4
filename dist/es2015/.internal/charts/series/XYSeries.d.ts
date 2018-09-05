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
import { AMEvent } from "../../core/Sprite";
import { Axis } from "../axes/Axis";
import { AxisRenderer } from "../axes/AxisRenderer";
import { ValueAxis } from "../axes/ValueAxis";
import { Dictionary } from "../../core/utils/Dictionary";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { XYChart } from "../types/XYChart";
import { CategoryAxis } from "../axes/CategoryAxis";
import { IPoint } from "../../core/defs/IPoint";
import { DateAxis } from "../axes/DateAxis";
import { Bullet } from "../elements/Bullet";
import { CalculatedValue } from "../../core/Component";
import { Animation } from "../../core/utils/Animation";
import { IDataItemEvents } from "../../core/DataItem";
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
export declare class XYSeriesDataItem extends SeriesDataItem {
    /**
     * [_minX description]
     *
     * @todo Descripion
     * @type {number}
     */
    protected _minX: number;
    /**
     * [_maxX description]
     *
     * @todo Descripion
     * @type {number}
     */
    protected _maxX: number;
    /**
     * [_minY description]
     *
     * @todo Descripion
     * @type {number}
     */
    protected _minY: number;
    /**
     * [_maxY description]
     *
     * @todo Descripion
     * @type {number}
     */
    protected _maxY: number;
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {XYSeries}
     */
    _component: XYSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Value
     */
    /**
     * Item's numeric value on X value axis.
     *
     * @param {number}  value  Value
     */
    valueX: number;
    /**
     * @return {number} Value
     */
    /**
     * Item's numeric value on Y value axis.
     *
     * @param {number}  value  Value
     */
    valueY: number;
    /**
     * @return {Date} Date
     */
    /**
     * Item's date value on X date-based axis.
     *
     * @param {Date}  date  Date
     */
    dateX: Date;
    /**
     * @return {Date} Date
     */
    /**
     * Item's date value on Y date-based axis.
     *
     * @param {Date}  date  Date
     */
    dateY: Date;
    /**
     * @return {string} Category
     */
    /**
     * Item's category on X category axis.
     *
     * @param {string}  category  Category
     */
    categoryX: string;
    /**
     * @return {string} Category
     */
    /**
     * Item's category on Y category axis.
     *
     * @param {string}  category  Category
     */
    categoryY: string;
    /**
     * @return {number} Value
     */
    /**
     * Item's open numeric value on X value axis.
     *
     * @param {number}  value  Value
     */
    openValueX: number;
    /**
     * @return {number} Value
     */
    /**
     * Item's open numeric value on Y value axis.
     *
     * @param {number}  value  Value
     */
    openValueY: number;
    /**
     * @return {Date} Date
     */
    /**
     * Item's open date value on X date-based axis.
     *
     * @param {Date}  date  Date
     */
    openDateX: Date;
    /**
     * @return {Date} Date
     */
    /**
     * Item's open date value on Y date-based axis.
     *
     * @param {Date}  date  Date
     */
    openDateY: Date;
    /**
     * @return {string} Category
     */
    /**
     * Item's open category on X category axis.
     *
     * @param {string}  category  Category
     */
    openCategoryX: string;
    /**
     * @return {string} Category
     */
    /**
     * Item's open category on Y category axis.
     *
     * @param {string}  category  Category
     */
    openCategoryY: string;
    /**
     * Return smallest value out of all item's value fields.
     *
     * @ignore Exclude from docs
     * @param  {string[]}  fields      Fields to check in
     * @param  {boolean}   working     Include working (temporary) values
     * @param  {number}    stackValue  If item is in a stack, the value item starts as
     * @return {number}                Value
     */
    getMin(fields: string[], working?: boolean, stackValue?: number): number;
    /**
     * Return biggest value out of all item's value fields.
     *
     * @ignore Exclude from docs
     * @param  {string[]}  fields      Fields to check in
     * @param  {boolean}   working     Include working (temporary) values
     * @param  {number}    stackValue  If item is in a stack, the value item starts as
     * @return {number}                Value
     */
    getMax(fields: string[], working?: boolean, stackValue?: number): number;
}
/**
 * Defines property set for a [[XYSeries]] tooltip event that contains information about dataItem
 *
 * @type {Object}
 */
export declare type XYSeriesTooltipEvent = {
    /**
     * Shift in coordinates after dragging.
     *
     * @type {XYSeriesDataItem}
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
     *
     * @type {string}
     */
    valueX?: string;
    /**
     * Name of the field in data that holds numeric value for vertical axis.
     *
     * @type {string}
     */
    valueY?: string;
    /**
     * Name of the field in data that holds category for horizontal axis.
     *
     * @type {string}
     */
    categoryX?: string;
    /**
     * Name of the field in data that holds category for vertical axis.
     *
     * @type {string}
     */
    categoryY?: string;
    /**
     * Name of the field in data that holds date for horizontal axis.
     *
     * @type {string}
     */
    dateX?: string;
    /**
     * Name of the field in data that holds date for vertical axis.
     *
     * @type {string}
     */
    dateY?: string;
    /**
     * Name of the field in data that holds open numeric value for horizontal
     * axis.
     *
     * @type {string}
     */
    openValueX?: string;
    /**
     * Name of the field in data that holds open numeric value for vertical
     * axis.
     *
     * @type {string}
     */
    openValueY?: string;
    /**
     * Name of the field in data that holds open category for horizontal axis.
     *
     * @type {string}
     */
    openCategoryX?: string;
    /**
     * Name of the field in data that holds open category for vertical axis.
     *
     * @type {string}
     */
    openCategoryY?: string;
    /**
     * Name of the field in data that holds open date for horizontal axis.
     *
     * @type {string}
     */
    openDateX?: string;
    /**
     * Name of the field in data that holds open date for vertical axis.
     *
     * @type {string}
     */
    openDateY?: string;
    /**
     * Which calculated field to use to use as a horizontal axis value for the
     * item.
     *
     * @type {CalculatedValue}
     */
    valueXShow?: CalculatedValue;
    /**
     * Which calculated field to use to use as a vertical axis value for the
     * item.
     *
     * @type {CalculatedValue}
     */
    valueYShow?: CalculatedValue;
    /**
     * Which calculated field to use to use as a horizontal axis open value for
     * the item.
     *
     * @type {CalculatedValue}
     */
    openValueXShow?: CalculatedValue;
    /**
     * Which calculated field to use to use as a vertical axis open value for
     * the item.
     *
     * @type {CalculatedValue}
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
     * @type {boolean}
     */
    stacked?: boolean;
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
export interface IXYSeriesAdapters extends ISeriesAdapters, IXYSeriesProperties {
}
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
export declare class XYSeries extends Series {
    /**
     * Defines the type of data fields used for the series.
     *
     * @ignore Exclude from docs
     * @type {IXYSeriesDataFields}
     */
    _dataFields: IXYSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IXYSeriesProperties}
     */
    _properties: IXYSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IXYSeriesAdapters}
     */
    _adapter: IXYSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IXYSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IXYSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {XYSeriesDataItem}
     */
    _dataItem: XYSeriesDataItem;
    /**
     * X axis the series is attached to.
     *
     * @type {MutableValueDisposer}
     */
    protected _xAxis: MutableValueDisposer<Axis<AxisRenderer>>;
    /**
     * Y axis the series is attached to.
     *
     * @type {MutableValueDisposer}
     */
    protected _yAxis: MutableValueDisposer<Axis<AxisRenderer>>;
    /**
     * A chart series belongs to.
     *
     * @ignore Exclude from docs
     * @type {XYChart}
     */
    _chart: XYChart;
    /**
     * The main (base) axis.
     *
     * This is the axis that series fills will go to, or grow animations will
     * happen from.
     *
     * @type {Axis}
     */
    protected _baseAxis: Axis;
    /**
     * Total data item count.
     *
     * @type {Dictionary<string, number>}
     */
    protected _count: Dictionary<string, number>;
    /**
     * Data item count in current selection.
     *
     * @type {Dictionary<string, number>}
     */
    protected _scount: Dictionary<string, number>;
    /**
     * [_xField description]
     *
     * @todo Description
     * @type {string}
     */
    protected _xField: string;
    /**
     * [_yField description]
     *
     * @todo Description
     * @type {string}
     */
    protected _yField: string;
    /**
     * [_xOpenField description]
     *
     * @todo Description
     * @type {string}
     */
    protected _xOpenField: string;
    /**
     * [_yOpenField description]
     *
     * @todo Description
     * @type {string}
     */
    protected _yOpenField: string;
    /**
     * [_tooltipXField description]
     *
     * @todo Description
     * @type {string}
     */
    protected _tooltipXField: string;
    /**
     * [_tooltipYField description]
     *
     * @todo Description
     * @type {string}
     */
    protected _tooltipYField: string;
    /**
     * [_xValueFields description]
     *
     * @todo Description
     * @type {Array<string>}
     */
    protected _xValueFields: Array<string>;
    /**
     * [_yValueFields description]
     *
     * @todo Description
     * @type {Array<string>}
     */
    protected _yValueFields: Array<string>;
    /**
     * Series which is stacked on top of this series, if any.
     *
     * @ignore Exclude from docs
     * @type {XYSeries}
     */
    stackedSeries: XYSeries;
    /**
     * dataitem of previously shown tooltip, used to avoid multiple tooltipshownat dispatches
     * @ignore
     */
    protected _prevTooltipDataItem: XYSeriesDataItem;
    /**
     * Constructor
     */
    constructor();
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {XYSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * (Re)validates the series' data.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    /**
     * Processes data item.
     *
     * @param {XYSeriesDataItem}  dataItem     Data item
     * @param {Object}            dataContext  Raw data
     * @param {number}            index        Index of the data item
     */
    protected processDataItem(dataItem: this["_dataItem"], dataContext?: Object): void;
    /**
     * Inits data item's working values.
     *
     * @param {this["_dataItem"]}  dataItem  Data item
     * @param {number}             index     Data item's index
     */
    protected setInitialWorkingValues(dataItem: this["_dataItem"]): void;
    /**
     * @ignore
     */
    disposeData(): void;
    /**
     * Sets up which data fields to use for data access.
     */
    protected defineFields(): void;
    /**
     * [axis description]
     *
     * @todo Description
     * @param {Axis}        axis    Axis
     * @param {Array<Key>}  fields  Fields (?)
     * @param {Key}         field   Field
     */
    protected addValueField<Key extends keyof this["_dataFields"]>(axis: Axis, fields: Array<Key>, field: Key): void;
    /**
     * Sets category field from the category axis.
     *
     * User might set field for category axis only, but not for series. In such
     * case, we take field value from axis and set it for series.
     *
     * @param {Key}           field  Field
     * @param {CategoryAxis}  axis   Axis
     */
    protected setCategoryAxisField<Key extends keyof this["_dataFields"]>(field: Key, axis: CategoryAxis): void;
    /**
     * Sets date field from the date axis.
     *
     * User might set field for category axis only, but not for series. In such
     * case, we take field value from axis and set it for series.
     *
     * @param {Key}       field  Field
     * @param {DateAxis}  axis   Axis
     */
    protected setDateAxisField<Key extends keyof this["_dataFields"]>(field: Key, axis: DateAxis): void;
    /**
     * Performs after-draw tasks, e.g. creates masks.
     */
    protected afterDraw(): void;
    /**
     * Create a mask for the series.
     *
     * @ignore Exclude from docs
     */
    createMask(): void;
    /**
     * Returns an SVG path to use as series mask.
     *
     * @return {string} SVG path
     */
    protected getMaskPath(): string;
    /**
     * Returns axis data field to use.
     *
     * @param  {Axis}    axis  Axis
     * @return {string}        Field name
     */
    getAxisField(axis: Axis): string;
    /**
     * Validates data items.
     *
     * @ignore Exclude from docs
     */
    validateDataItems(): void;
    /**
     * Validates data range.
     *
     * @ignore Exclude from docs
     */
    validateDataRange(): void;
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * @return {Axis} Axis
     */
    /**
     * X axis the series is attached to.
     *
     * @param {Axis}  axis  Axis
     */
    xAxis: Axis;
    /**
     * @return {Axis} Axis
     */
    /**
     * Y axis the series is attached to.
     *
     * @param {Axis}  axis  Axis
     */
    yAxis: Axis;
    /**
     * @return {Axis} Axis
     */
    /**
     * The main (base) axis.
     *
     * This is the axis that series fills will go to, or grow animations will
     * happen from.
     *
     * @param {Axis}  value  Axis
     */
    baseAxis: Axis;
    /**
     * Processes values after data items' were added.
     *
     * @ignore Exclude from docs
     * @param {OrderedListTemplate<this["_dataItem"]>}  dataItems  Data items
     */
    processValues(working: boolean): void;
    /**
     * Shows series tooltip at specific position.
     *
     * @ignore Exclude from docs
     * @param {number}  xPosition  X
     * @param {number}  yPosition  Y
     */
    showTooltipAtPosition(xPosition: number, yPosition: number): IPoint;
    /**
     * returns default state to bullets when tooltip is shown at some other data item or hidden
     *
     * @ignore Exclude from docs
     */
    protected returnBulletDefaultState(dataItem?: XYSeriesDataItem): void;
    /**
     * Positions series bullet.
     *
     * @ignore Exclude from docs
     * @param {Bullet}  bullet  Bullet
     */
    positionBullet(bullet: Bullet): void;
    /**
    * returns bullet x location
    * @ignore
    */
    protected getBulletLocationX(bullet: Bullet, field: string): number;
    /**
    * returns bullet x location
    * @ignore
    */
    protected getBulletLocationY(bullet: Bullet, field: string): number;
    /**
     * @return {boolean} Can be stacked?
     */
    /**
     * Can items from this series be included into stacks?
     *
     * @default false
     * @param {boolean}  stacked  Can be stacked?
     */
    stacked: boolean;
    /**
     * Shows hidden series.
     *
     * @param  {number}     duration  Duration of reveal animation (ms)
     * @return {Animation}            Animation
     */
    show(duration?: number): Animation;
    /**
     * Hides series.
     *
     * @param  {number}     duration  Duration of hiding animation (ms)
     * @return {Animation}            Animation
     */
    hide(duration?: number): Animation;
    /**
     * Updates series appearance when working value changes.
     */
    protected handleDataItemWorkingValueChange(event: AMEvent<SeriesDataItem, IDataItemEvents>["workingvaluechanged"]): void;
    /**
     * [getStackValue description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    getStackValue(dataItem: this["_dataItem"], working?: boolean): void;
    /**
     * [xField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @return {string} [description]
     */
    readonly xField: string;
    /**
     * [yField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @return {string} [description]
     */
    readonly yField: string;
    /**
     * [xOpenField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @return {string} [description]
     */
    readonly xOpenField: string;
    /**
     * [yOpenField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @return {string} [description]
     */
    readonly yOpenField: string;
    /**
     * @ignore Exclude from docs
     * @todo Description
     * @return {string} [description]
     */
    /**
     * [tooltipXField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {string} value [description]
     */
    tooltipXField: string;
    /**
     * @ignore Exclude from docs
     * @todo Description
     * @return {string} [description]
     */
    /**
     * [tooltipYField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {string} value [description]
     */
    tooltipYField: string;
    /**
     * Returns lowest value in the series for the specific axis.
     *
     * @ignore Exclude from docs
     * @param  {ValueAxis}  axis  Axis
     * @return {number}           value
     */
    min(axis: ValueAxis): number;
    /**
     * Returns highest value in the series for the specific axis.
     *
     * @ignore Exclude from docs
     * @param  {ValueAxis}  axis  Axis
     * @return {number}           value
     */
    max(axis: ValueAxis): number;
    /**
     * Returns lowest value in the series for the specific axis within current
     * selection.
     *
     * @ignore Exclude from docs
     * @param  {ValueAxis}  axis  Axis
     * @return {number}           value
     */
    selectionMin(axis: ValueAxis): number;
    /**
     * Returns highest value in the series for the specific axis within current
     * selection.
     *
     * @ignore Exclude from docs
     * @param  {ValueAxis}  axis  Axis
     * @return {number}           value
     */
    selectionMax(axis: ValueAxis): number;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
    /**
     * [getPoint description]
     *
     * @todo Description
     * @param {XYSeriesDataItem}  dataItem   [description]
     * @param {string}          xKey       [description]
     * @param {string}          yKey       [description]
     * @param {number}          locationX  [description]
     * @param {number}          locationY  [description]
     * @param {string}          stackKeyX  [description]
     * @param {string}          stackKeyY  [description]
     */
    protected getPoint(dataItem: XYSeriesDataItem, xKey: string, yKey: string, locationX?: number, locationY?: number, stackKeyX?: string, stackKeyY?: string): {
        x: number;
        y: number;
    };
}
