/**
 * Defines Pie Chart Series.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Series, SeriesDataItem, ISeriesProperties, ISeriesDataFields, ISeriesAdapters, ISeriesEvents } from "./Series";
import { ISpriteEvents, AMEvent } from "../../core/Sprite";
import { Slice } from "../../core/elements/Slice";
import { AxisLabelCircular } from "../axes/AxisLabelCircular";
import { PieTick } from "./PieTick";
import { ListTemplate } from "../../core/utils/List";
import { Container } from "../../core/Container";
import { Animation } from "../../core/utils/Animation";
import { LegendDataItem, LegendSettings } from "../../charts/Legend";
import { Bullet } from "../elements/Bullet";
import { ColorSet } from "../../core/utils/ColorSet";
import { IRectangle } from "../../core/defs/IRectangle";
import { PieChart } from "../types/PieChart";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[PieSeries]].
 *
 * @see {@link DataItem}
 */
export declare class PieSeriesDataItem extends SeriesDataItem {
    /**
     * A type of slice used for this series.
     *
     * @ignore Exclude from docs
     * @type {Slice}
     */
    _slice: Slice;
    /**
     * A reference to a slice label element.
     * @ignore Exclude from docs
     * @type {AxisLabelCircular}
     */
    protected _label: AxisLabelCircular;
    /**
     * A reference to a slice tick element.
     * @ignore Exclude from docs
     * @type {PieTick}
     */
    protected _tick: PieTick;
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
     * @ignore Exclude from docs
     * @type {PieSeries}
     */
    _component: PieSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * Sets visibility of the Data Item.
     *
     * @param {boolean} value Data Item
     */
    setVisibility(value: boolean): void;
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
     * @return {number} Radius
     */
    /**
     * Slice's radius, if other than default.
     *
     * @param {number}  value  Radius
     */
    radiusValue: number;
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
     * A Pie Tick element, related to this data item. (slice)
     *
     * @readonly
     * @return {PieTick} Tick element
     */
    readonly tick: PieTick;
    /**
     * A Label element, related to this data item. (slice)
     *
     * @readonly
     * @return {AxisLabelCircular} Label element
     */
    readonly label: AxisLabelCircular;
    /**
     * A Slice element, related to this data item. (slice)
     *
     * @readonly
     * @return {Slice} Slice element
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
 * Defines data fields for [[PieSeries]].
 */
export interface IPieSeriesDataFields extends ISeriesDataFields {
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
    /**
     * Name of the field in data that holds boolean flag if item should be hidden.
     *
     * @type {string}
     */
    visible?: string;
    /**
     * Name of the field in data that holds item's radius value.
     *
     * @type {string}
     */
    radiusValue?: string;
}
/**
 * Defines properties for [[PieSeries]].
 */
export interface IPieSeriesProperties extends ISeriesProperties {
    /**
     * Outer radius for the series' slices in pixels.
     *
     * @ignore Exclude from docs
     * @todo Redo so that users can set it
     * @type {number}
     */
    radius?: number;
    /**
     * Inner radius for the series' slices in pixels.
     *
     * @ignore Exclude from docs
     * @todo Redo so that users can set it
     * @type {number}
     */
    innerRadius?: number;
    /**
     * Start angle for the series' slices in degrees. (0-360)
     *
     * @ignore Exclude from docs
     * @todo Redo so that users can set it
     * @type {number}
     */
    startAngle?: number;
    /**
     * End angle for the series' slices in degrees. (0-360)
     *
     * @ignore Exclude from docs
     * @todo Redo so that users can set it
     * @type {number}
     */
    endAngle?: number;
    /**
     * Align labels into nice vertical columns?
     *
     * @default true
     * @type {number}
     */
    alignLabels?: number;
    /**
     * A color set to be used for slices.
     *
     * For each new subsequent slice, the chart will assign the next color in
     * this set.
     *
     * @type {ColorSet}
     */
    colors?: ColorSet;
}
/**
 * Defines events for [[PieSeries]].
 */
export interface IPieSeriesEvents extends ISeriesEvents {
}
/**
 * Defines adapters for [[PieSeries]].
 *
 * @see {@link Adapter}
 */
export interface IPieSeriesAdapters extends ISeriesAdapters, IPieSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a slice series on a Pie chart.
 *
 * @see {@link IPieSeriesEvents} for a list of available Events
 * @see {@link IPieSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export declare class PieSeries extends Series {
    _chart: PieChart;
    /**
     * Defines the type of data fields used for the series.
     *
     * @ignore Exclude from docs
     * @type {IPieSeriesDataFields}
     */
    _dataFields: IPieSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IPieSeriesProperties}
     */
    _properties: IPieSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IPieSeriesAdapters}
     */
    _adapter: IPieSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IPieSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IPieSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {PieSeriesDataItem}
     */
    _dataItem: PieSeriesDataItem;
    /**
     * Holds current angle for the next slice to start on.
     *
     * @type {number}
     */
    protected _currentStartAngle: number;
    /**
     * Data items that fall to the left side of the pie.
     */
    protected _leftItems: this["_dataItem"][];
    /**
     * Data items that fall to the right side of the pie.
     */
    protected _rightItems: this["_dataItem"][];
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
    slices: ListTemplate<Slice>;
    /**
     * List of tick elements.
     *
     * @type {ListTemplate<PieTick>}
     */
    ticks: ListTemplate<PieTick>;
    /**
     * List of label elements.
     *
     * @type {ListTemplate<AxisLabelCircular>}
     */
    labels: ListTemplate<AxisLabelCircular>;
    /**
     * [_arcRect description]
     *
     * @todo Description
     * @type {IRectangle}
     */
    protected _arcRect: IRectangle;
    /**
     * [_maxRadiusPercent description]
     *
     * @todo Description
     * @type {number}
     */
    protected _maxRadiusPercent: number;
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
     * @return {PieSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Creates and returns a new slice element.
     *
     * @param  {typeof Slice}  sliceType  Type of the slice element
     * @return {Slice}                    Slice
     */
    protected initSlice(sliceType: typeof Slice): Slice;
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {PieSeriesDataItem}  dataItem  Data item
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
    protected getNextLabel(index: number, dataItems: this["_dataItem"][]): AxisLabelCircular;
    /**
     * @ignore Exclude from docs
     * @return {number} Radius
     */
    /**
     * Outer radius for the series' slices in pixels.
     *
     * @ignore Exclude from docs
     * @todo Redo so that users can set it
     * @param {number}  value  Radius
     */
    radius: number;
    /**
     * @ignore Exclude from docs
     * @return {number} Radius
     */
    /**
     * Inner radius for the series' slices in pixels.
     *
     * @ignore Exclude from docs
     * @todo Redo so that users can set it
     * @param {number}  value  Radius
     */
    innerRadius: number;
    /**
     * @ignore Exclude from docs
     * @return {number} Angle
     */
    /**
     * Start angle for the series' slices in degrees. (0-360)
     *
     * @ignore Exclude from docs
     * @todo Redo so that users can set it
     * @param {number}  value  Angle
     */
    startAngle: number;
    /**
     * @ignore Exclude from docs
     * @return {number} Angle
     */
    /**
     * End angle for the series' slices in degrees. (0-360)
     *
     * @ignore Exclude from docs
     * @todo Redo so that users can set it
     * @param {number}  value  Angle
     */
    endAngle: number;
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
     * Positions series bullet.
     *
     * @ignore Exclude from docs
     * @param {Bullet}  bullet  Bullet
     */
    positionBullet(bullet: Bullet): void;
    /**
     * Repositions bullets when slice's size changes.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Slice, ISpriteEvents>["propertychanged"]}  event  Event
     */
    protected handleSliceScale(event: AMEvent<Slice, ISpriteEvents>["propertychanged"]): void;
    /**
     * Repositions bullet and labels when slice moves.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Slice, ISpriteEvents>["propertychanged"]}  event  Event
     */
    protected handleSliceMove(event: AMEvent<Slice, ISpriteEvents>["propertychanged"]): void;
    /**
     * Copies all properties from another instance of [[PieSeries]].
     *
     * @param {ColumnSeries}  source  Source series
     */
    copyFrom(source: this): void;
    protected getContainerBBox(): IRectangle;
}
