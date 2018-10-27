/**
 * Defines Pie Chart Series.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IPercentSeriesAdapters, IPercentSeriesDataFields, IPercentSeriesEvents, IPercentSeriesProperties, PercentSeries, PercentSeriesDataItem } from "./PercentSeries";
import { ISpriteEvents, AMEvent } from "../../core/Sprite";
import { Slice } from "../../core/elements/Slice";
import { AxisLabelCircular } from "../axes/AxisLabelCircular";
import { PieTick } from "../elements/PieTick";
import { Animation } from "../../core/utils/Animation";
import { Bullet } from "../elements/Bullet";
import { IRectangle } from "../../core/defs/IRectangle";
import { PieChart } from "../types/PieChart";
import { Percent } from "../../core/utils/Percent";
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
export declare class PieSeriesDataItem extends PercentSeriesDataItem {
    /**
     * A type of slice used for this series.
     *
     * @type {Slice}
     */
    _slice: Slice;
    /**
     * A reference to a slice label element.
     * @ignore Exclude from docs
     * @type {AxisLabelCircular}
     */
    _label: AxisLabelCircular;
    /**
     * A reference to a slice tick element.
     * @ignore Exclude from docs
     * @type {PieTick}
     */
    _tick: PieTick;
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {PieSeries}
     */
    _component: PieSeries;
    /**
     * Constructor
     */
    constructor();
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
export interface IPieSeriesDataFields extends IPercentSeriesDataFields {
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
export interface IPieSeriesProperties extends IPercentSeriesProperties {
    /**
     * Outer radius for the series' slices in pixels.
     *
     * @ignore Exclude from docs
     * @type {number | Percent}
     */
    radius?: number | Percent;
    /**
     * Inner radius for the series' slices in pixels.
     *
     * @ignore Exclude from docs
     * @type {number | Percent}
     */
    innerRadius?: number | Percent;
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
}
/**
 * Defines events for [[PieSeries]].
 */
export interface IPieSeriesEvents extends IPercentSeriesEvents {
}
/**
 * Defines adapters for [[PieSeries]].
 *
 * @see {@link Adapter}
 */
export interface IPieSeriesAdapters extends IPercentSeriesAdapters, IPieSeriesProperties {
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
export declare class PieSeries extends PercentSeries {
    _slice: Slice;
    _tick: PieTick;
    _label: AxisLabelCircular;
    _chart: PieChart;
    /**
     * Defines the type of data fields used for the series.
     *
     * @type {IPieSeriesDataFields}
     */
    _dataFields: IPieSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @type {IPieSeriesProperties}
     */
    _properties: IPieSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @type {IPieSeriesAdapters}
     */
    _adapter: IPieSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IPieSeriesEvents}
     */
    _events: IPieSeriesEvents;
    /**
     * Defines the type of data item.
     *
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
     * [_pixelRadius description]
     *
     * @ignore this is set by pie chart, not by user
     * @type {number}
     */
    protected _pixelRadius: number;
    /**
     * [_pixelInnerRadius description]
     *
     * @ignore this is set by pie chart, not by user
     * @type {number}
     */
    protected _pixelInnerRadius: number;
    /**
     * Constructor
     */
    constructor();
    /**
     * creates slice
     */
    protected createSlice(): this["_slice"];
    /**
     * creates tick
     */
    protected createTick(): this["_tick"];
    /**
     * creates label
     */
    protected createLabel(): this["_label"];
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
     * Inits slice.
     *
     * @param  {Slice} slice to init
     */
    protected initSlice(slice: this["_slice"]): void;
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
     * @return {number | Percent} Radius
     */
    /**
     * Outer radius for the series' slices in pixels or [[Percent]].
     *
     * @param {number | Percent}  value  Radius
     */
    radius: number | Percent;
    /**
     * @return {number} Radius
     * @ignore
     */
    /**
     * @ignore
     */
    pixelRadius: number;
    /**
     * @return {number} Pixel inner radius
     * @ignore
     */
    /**
     * @ignore
     */
    pixelInnerRadius: number;
    /**
     * @ignore Exclude from docs
     * @return {number | Percent} Radius
     */
    /**
     * Inner radius for the series' slices in pixels.
     *
     * @ignore Exclude from docs
     * @todo Redo so that users can set it
     * @param {number | Percent}  value  Radius
     */
    innerRadius: number | Percent;
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
     * Positions series bullet.
     *
     * @ignore Exclude from docs
     * @param {Bullet}  bullet  Bullet
     */
    positionBullet(bullet: Bullet): void;
    /**
     * Repositions bullet and labels when slice moves.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Slice, ISpriteEvents>["propertychanged"]}  event  Event
     */
    protected handleSliceMove(event: AMEvent<this["_slice"], ISpriteEvents>["propertychanged"]): void;
    /**
     * Returns bounding box (square) for this element.
     *
     * @ignore Exclude from docs
     * @type {IRectangle}
     */
    readonly bbox: IRectangle;
}
