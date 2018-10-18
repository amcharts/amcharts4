/**
 * Defines Percent Chart Series.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Series, SeriesDataItem, ISeriesProperties, ISeriesDataFields, ISeriesAdapters, ISeriesEvents } from "./Series";
import { ISpriteEvents, AMEvent } from "../../core/Sprite";
import { Sprite } from "../../core/Sprite";
import { Label } from "../../core/elements/Label";
import { Tick } from "../elements/Tick";
import { ListTemplate } from "../../core/utils/List";
import { Container } from "../../core/Container";
import { Animation } from "../../core/utils/Animation";
import { LegendDataItem, LegendSettings } from "../../charts/Legend";
import { ColorSet } from "../../core/utils/ColorSet";
import { PercentChart } from "../types/PercentChart";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[PercentSeries]].
 *
 * @see {@link DataItem}
 */
export declare class PercentSeriesDataItem extends SeriesDataItem {
    /**
     * A type of slice used for this series.
     *
     * @type {Slice}
     */
    _slice: Sprite;
    /**
     * A reference to a slice label element.
     *
     * @ignore Exclude from docs
     * @type {AxisLabelCircular}
     */
    _label: Label;
    /**
     * A reference to a slice tick element.
     * @ignore Exclude from docs
     * @type {Tick}
     */
    _tick: Tick;
    /**
     * A reference to a corresponding legend data item.
     *
     * @type {LegendDataItem<DataItem, IDataItemEvents>}
     */
    protected _legendDataItem: LegendDataItem;
    /**
     * Custom settings for the legend item.
     * Not used, only added to sattisfy LegendDataItem
     *
     * @type {LegendSettings}
     * @ignore
     */
    legendSettings: LegendSettings;
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {PercentSeries}
     */
    _component: PercentSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * Adds an `id` attribute the the slice element and returns its id.
     *
     * @ignore Exclude from docs
     */
    uidAttr(): string;
    /**
     * Hide the data item (and corresponding visual elements).
     *
     * @param {number}    duration  Duration (ms)
     * @param {number}    delay     Delay hiding (ms)
     * @param {number}    toValue   Target value for animation
     * @param {string[]}  fields    Fields to animate while hiding
     */
    hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): Animation;
    /**
     * Sets visibility of the Data Item.
     *
     * @param {boolean} value Data Item
     */
    setVisibility(value: boolean, noChangeValues?: boolean): void;
    /**
     * Show hidden data item (and corresponding cisual elements).
     *
     * @param {number}    duration  Duration (ms)
     * @param {number}    delay     Delay hiding (ms)
     * @param {string[]}  fields    Fields to animate while hiding
     */
    show(duration?: number, delay?: number, fields?: string[]): Animation;
    /**
     * @return {string} Category
     */
    /**
     * Category.
     *
     * @param {string}  value  Category
     */
    category: string;
    /**
     * Creates a marker used in the legend for this slice.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Marker container
     */
    createLegendMarker(marker: Container): void;
    /**
     * @return {LegendDataItem<DataItem, IDataItemEvents>} Legend data item
     */
    /**
     * A legend's data item, that corresponds to this data item.
     *
     * @param {LegendDataItem<DataItem, IDataItemEvents>}  value  Legend data item
     */
    legendDataItem: LegendDataItem;
    /**
     * A Tick element, related to this data item. (slice)
     *
     * @readonly
     * @return {this["_tick"]} Tick element
     */
    readonly tick: this["_tick"];
    /**
     * A Label element, related to this data item. (slice)
     *
     * @readonly
     * @return {this["_label"]} Label element
     */
    readonly label: this["_label"];
    /**
     * An element, related to this data item. (slice)
     *
     * @readonly
     * @return {Sprite} Slice element
     */
    readonly slice: this["_slice"];
    /**
     * @return {boolean} Disabled in legend?
     */
    /**
     * Should dataItem (slice) be hidden in legend?
     *
     * @param {boolean} value Visible in legend?
     */
    hiddenInLegend: boolean;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[PercentSeries]].
 */
export interface IPercentSeriesDataFields extends ISeriesDataFields {
    /**
     * Name of the field in data that holds category.
     *
     * @type {string}
     */
    category?: string;
    /**
     * Name of the field in data that holds boolean flag if item should be
     * hidden in legend.
     *
     * @type {string}
     */
    hiddenInLegend?: string;
}
/**
 * Defines properties for [[PercentSeries]].
 */
export interface IPercentSeriesProperties extends ISeriesProperties {
    /**
     * A color set to be used for slices.
     *
     * For each new subsequent slice, the chart will assign the next color in
     * this set.
     *
     * @type {ColorSet}
     */
    colors?: ColorSet;
    /**
     * Align labels into nice vertical columns?
     *
     * @default true
     * @type {number}
     */
    alignLabels?: number;
}
/**
 * Defines events for [[PercentSeries]].
 */
export interface IPercentSeriesEvents extends ISeriesEvents {
}
/**
 * Defines adapters for [[PercentSeries]].
 *
 * @see {@link Adapter}
 */
export interface IPercentSeriesAdapters extends ISeriesAdapters, IPercentSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[PercentSeries]] which is a base class for [[PieSeries]],
 * [[FunnelSeries]], and [[PyramidSeries]].
 *
 * @see {@link IPercentSeriesEvents} for a list of available Events
 * @see {@link IPercentSeriesAdapters} for a list of available Adapters
 */
export declare class PercentSeries extends Series {
    /**
     * Defines type of the slice elements for the series.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    _slice: Sprite;
    /**
     * Defines type of the tick elements for the series.
     *
     * @ignore Exclude from docs
     * @type {Tick}
     */
    _tick: Tick;
    /**
     * Defines type of the label elements for the series.
     *
     * @ignore Exclude from docs
     * @type {Label}
     */
    _label: Label;
    /**
     * A reference to chart this series is for.
     *
     * @ignore Exclude from docs
     * @type {PercentChart}
     */
    _chart: PercentChart;
    /**
     * Defines the type of data fields used for the series.
     *
     * @type {IPercentSeriesDataFields}
     */
    _dataFields: IPercentSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @type {IPercentSeriesProperties}
     */
    _properties: IPercentSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @type {IPercentSeriesAdapters}
     */
    _adapter: IPercentSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IPercentSeriesEvents}
     */
    _events: IPercentSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @type {PercentSeriesDataItem}
     */
    _dataItem: PercentSeriesDataItem;
    /**
     * Container slice elements are put in.
     *
     * @ignore Exclude from docs
     * @type {Container}
     */
    slicesContainer: Container;
    /**
     * Container tick elements are put in.
     *
     * @ignore Exclude from docs
     * @type {Container}
     */
    ticksContainer: Container;
    /**
     * Container label elements are put in.
     *
     * @ignore Exclude from docs
     * @type {Container}
     */
    labelsContainer: Container;
    /**
     * List of slice elements.
     *
     * @type {ListTemplate<Slice>}
     */
    protected _slices: ListTemplate<this["_slice"]>;
    /**
     * List of tick elements.
     *
     * @type {ListTemplate<this["_tick"]>}
     */
    protected _ticks: ListTemplate<this["_tick"]>;
    /**
     * List of label elements.
     *
     * @type {ListTemplate<this["_label"]>}
     */
    protected _labels: ListTemplate<this["_label"]>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Creates a slice element.
     *
     * @return {FunnelSlice} Slice
     */
    protected createSlice(): this["_slice"];
    /**
     * Creates a tick element.
     *
     * @return {Tick} Tick
     */
    protected createTick(): this["_tick"];
    /**
     * Sreates label element.
     *
     * @return {Label} label
     */
    protected createLabel(): this["_label"];
    readonly slices: ListTemplate<this["_slice"]>;
    readonly ticks: ListTemplate<this["_tick"]>;
    readonly labels: ListTemplate<this["_label"]>;
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {PercentSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Creates and returns a new slice element.
     *
     * @param  {typeof Slice}  sliceType  Type of the slice element
     * @return {Slice}                    Slice
     */
    protected initSlice(slice: this["_slice"]): void;
    protected initLabel(label: this["_label"]): void;
    protected initTick(label: this["_tick"]): void;
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {PercentSeriesDataItem}  dataItem  Data item
     */
    validateDataElement(dataItem: this["_dataItem"]): void;
    /**
     * Arranges slice labels according to position settings.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"][]}  dataItems  Data items
     */
    protected arrangeLabels(dataItems: this["_dataItem"][]): void;
    /**
     * Returns the next label according to `index`.
     *
     * @param  {number}              index      Current index
     * @param  {PieSerisDataItem[]}  dataItems  Data items
     * @return {AxisLabelCircular}              Label element
     */
    protected getNextLabel(index: number, dataItems: this["_dataItem"][]): this["_label"];
    /**
     * @return {ColorSet} Color set
     */
    /**
     * A color set to be used for slices.
     *
     * For each new subsequent slice, the chart will assign the next color in
     * this set.
     *
     * @param {ColorSet}  value  Color set
     */
    colors: ColorSet;
    /**
     * Binds related legend data item's visual settings to this series' visual
     * settings.
     *
     * @ignore Exclude from docs
     * @param {Container}          marker    Container
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    createLegendMarker(marker: Container, dataItem?: this["_dataItem"]): void;
    /**
     * Repositions bullets when slice's size changes.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Slice, ISpriteEvents>["propertychanged"]}  event  Event
     */
    protected handleSliceScale(event: AMEvent<this["_slice"], ISpriteEvents>["propertychanged"]): void;
    /**
     * Repositions bullet and labels when slice moves.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Slice, ISpriteEvents>["propertychanged"]}  event  Event
     */
    protected handleSliceMove(event: AMEvent<this["_slice"], ISpriteEvents>["propertychanged"]): void;
    /**
     * Copies all properties from another instance of [[PercentSeries]].
     *
     * @param {ColumnSeries}  source  Source series
     */
    copyFrom(source: this): void;
    /**
     * @return {boolean} Align labels?
     */
    /**
     * Align labels into nice vertical columns?
     *
     * This will ensure that labels never overlap with each other.
     *
     * Arranging labels into columns makes them more readble, and better user
     * experience.
     *
     * If set to `false` labels will be positioned at `label.radius` distance,
     * and may, in some cases, overlap.
     *
     * @default true
     * @param {boolean}  value  Align labels?
     */
    alignLabels: boolean;
}
