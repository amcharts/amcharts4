/**
 * Defines Funnel Chart Series.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IPercentSeriesAdapters, IPercentSeriesDataFields, IPercentSeriesEvents, IPercentSeriesProperties, PercentSeries, PercentSeriesDataItem } from "./PercentSeries";
import { FunnelSlice } from "../elements/FunnelSlice";
import { Label } from "../../core/elements/Label";
import { FunnelTick } from "../elements/FunnelTick";
import { ListTemplate } from "../../core/utils/List";
import { Animation } from "../../core/utils/Animation";
import { Bullet } from "../elements/Bullet";
import { SlicedChart } from "../types/SlicedChart";
import { Orientation } from "../../core/defs/Orientation";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[FunnelSeries]].
 *
 * @see {@link DataItem}
 */
export declare class FunnelSeriesDataItem extends PercentSeriesDataItem {
    /**
     * A type of slice used for this series.
     *
     * @type {FunnelSlice}
     */
    _slice: FunnelSlice;
    /**
     * A reference to a label element.
     * @ignore Exclude from docs
     * @type {Label}
     */
    _label: Label;
    /**
     * A reference to a tick element.
     * @ignore Exclude from docs
     * @type {FunnelTick}
     */
    _tick: FunnelTick;
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {FunnelSeries}
     */
    _component: FunnelSeries;
    /**
     * Defines a type of elements linking slices.
     *
     * @type {FunnelSlice}
     */
    _sliceLink: FunnelSlice;
    /**
     * A [[FunnelSlice]] element, related to this data item ([[FunnelSlice]]).
     *
     * @readonly
     * @return {FunnelSlice} Slice element
     */
    readonly sliceLink: this["_sliceLink"];
    /**
     * Constructor
     */
    constructor();
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[FunnelSeries]].
 */
export interface IFunnelSeriesDataFields extends IPercentSeriesDataFields {
}
/**
 * Defines properties for [[FunnelSeries]].
 */
export interface IFunnelSeriesProperties extends IPercentSeriesProperties {
    /**
     * Relative width of the slice bottom. See description of `bottomRatio`
     * property for full description.
     *
     * @default 0
     * @type {number}
     */
    bottomRatio?: number;
    /**
     * Orientation of series
     *
     * @default "vertical"
     * @type {Orientation}
     */
    orientation?: Orientation;
}
/**
 * Defines events for [[FunnelSeries]].
 */
export interface IFunnelSeriesEvents extends IPercentSeriesEvents {
}
/**
 * Defines adapters for [[FunnelSeries]].
 *
 * @see {@link Adapter}
 */
export interface IFunnelSeriesAdapters extends IPercentSeriesAdapters, IFunnelSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a FunnelSlice series on a [[SlicedChart]].
 *
 * @see {@link IFunnelSeriesEvents} for a list of available Events
 * @see {@link IFunnelSeriesAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/sliced-chart/} for documentation
 * @important
 */
export declare class FunnelSeries extends PercentSeries {
    /**
     * Defines the type of data fields used for the series.
     *
     * @type {IFunnelSeriesDataFields}
     */
    _slice: FunnelSlice;
    /**
     * Defines available properties.
     *
     * @type {IFunnelSeriesProperties}
     */
    _tick: FunnelTick;
    /**
     * Defines available adapters.
     *
     * @type {IFunnelSeriesAdapters}
     */
    _label: Label;
    /**
     * A reference to chart this series is for.
     *
     * @ignore Exclude from docs
     * @type {SlicedChart}
     */
    _chart: SlicedChart;
    /**
     * Defines the type of data fields used for the series.
     *
     * @type {IFunnelSeriesDataFields}
     */
    _dataFields: IFunnelSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @type {IFunnelSeriesProperties}
     */
    _properties: IFunnelSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @type {IFunnelSeriesAdapters}
     */
    _adapter: IFunnelSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IFunnelSeriesEvents}
     */
    _events: IFunnelSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @type {FunnelSeriesDataItem}
     */
    _dataItem: FunnelSeriesDataItem;
    protected _nextY: number;
    /**
     * List of slice elements.
     *
     * @type {ListTemplate<Slice>}
     */
    protected _sliceLinks: ListTemplate<this["_slice"]>;
    /**
     * Holds sum of values for all slices
     *
     * @type {number}
     */
    protected _total: number;
    /**
     * Holds number of slices.
     *
     * @type {number}
     */
    protected _count: number;
    /**
     * Constructor
     */
    constructor();
    /**
     * Creates a [[FunnelSlice]] element.
     *
     * @return {FunnelSlice} Slice
     */
    protected createSlice(): this["_slice"];
    /**
     * Creates a [[FunnelTick]] element.
     *
     * @return {FunnelTick} Tick
     */
    protected createTick(): this["_tick"];
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {FunnelSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Inits FunnelSlice.
     *
     * @param  {FunnelSlice} slice to init
     */
    protected initSlice(slice: this["_slice"]): void;
    /**
     * [initLabel description]
     *
     * @todo Description
     * @param {this["_label"]} label [description]
     */
    protected initLabel(label: this["_label"]): void;
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * [validateDataElements description]
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    validateDataElements(): void;
    /**
     * [getNextValue description]
     *
     * @todo Description
     * @param  {FunnelSeriesDataItem}  dataItem  [description]
     * @return {number}                          [description]
     */
    protected getNextValue(dataItem: FunnelSeriesDataItem): number;
    /**
     * [formDataElement description]
     *
     * @todo Description
     */
    protected formDataElement(): void;
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {FunnelSeriesDataItem}  dataItem  Data item
     */
    validateDataElement(dataItem: this["_dataItem"]): void;
    /**
     * [decorateSlice description]
     *
     * @todo Description
     * @param {this["_dataItem"]} dataItem [description]
     */
    protected decorateSlice(dataItem: this["_dataItem"]): void;
    /**
     * [arrangeLabels description]
     *
     * @todo Description
     */
    protected arrangeLabels(): void;
    /**
     * Positions series bullet.
     *
     * @ignore Exclude from docs
     * @param {Bullet}  bullet  Bullet
     */
    positionBullet(bullet: Bullet): void;
    /**
     * @return {Orientation} Orientation
     */
    /**
     * Orientation of the funnel slices: "horizontal" or "vertical" (default).
     *
     * @default "vertical"
     * @param {Orientation} value Orientation
     */
    orientation: Orientation;
    /**
     * @return {number}
     */
    /**
     * Indicates how slice's bottom will change in relation to slices top AND
     * next slices top.
     *
     * Basically it's a relative value (0-1) that indicates bottom width
     * position between current slice's top width and the top withd of the next
     * one.
     *
     * The scale goes from 0 (closer to current slice width) to 1 (closer to next
     * slice with).
     *
     * `0` (default) will mean that bottom will be the same as top, resulting in
     * a prefectly square slice.
     *
     * From the data-viz standpoint `0` is a correct setting, since area of the
     * slices will depict their value correctly.
     *
     * `1` will mean that slice will become trapezoid with its bottom matching
     * width of the next slice.
     *
     * `0.5` will make bottom width be in the middle of width of current slice
     * and the next slice.
     *
     * @default 0
     * @param {number}
     */
    bottomRatio: number;
    /**
     * A list of elements linking each actual slice.
     *
     * Please note that links are [[FunnelSlice]] objects, just like real links,
     * so they have all the same configuration options.
     *
     * You can use `template` of this link, to specify how links will look.
     *
     * ```TypeScript
     * series.sliceLinks.template.fillOpacity = 0.5;
     * ```
     * ```JavaScript
     * series.sliceLinks.template.fillOpacity = 0.5;
     * ```
     * ```JSON
     * {
     *   // ...
     *   "series": [{
     *     "type": "FunnelSeries",
     *      // ...
     *      "sliceLinks": {
     *        "fillOpacity": 0.5
     *      }
     *   }]
     * }
     * ```
     *
     * @return {ListTemplate} Funnel links
     */
    readonly sliceLinks: ListTemplate<this["_slice"]>;
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
}
