/**
 * Line series module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { XYSeries, XYSeriesDataItem, IXYSeriesProperties, IXYSeriesDataFields, IXYSeriesAdapters, IXYSeriesEvents } from "./XYSeries";
import { Container } from "../../core/Container";
import { ListTemplate } from "../../core/utils/List";
import { IPoint } from "../../core/defs/IPoint";
import { LineSeriesSegment } from "./LineSeriesSegment";
import { AxisDataItem } from "../axes/Axis";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[LineSeries]].
 *
 * @see {@link DataItem}
 */
export declare class LineSeriesDataItem extends XYSeriesDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {LineSeries}
     */
    _component: LineSeries;
    /**
     * Point of line series data item
     * @type {IPoint}
     */
    point: IPoint;
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
 * Defines data fields for [[LineSeries]].
 */
export interface ILineSeriesDataFields extends IXYSeriesDataFields {
}
/**
 * Defines properties for [[LineSeries]].
 */
export interface ILineSeriesProperties extends IXYSeriesProperties {
    /**
     * Horizontal tension setting of the line (0-1).
     *
     * Used for smoothed lines.
     *
     * @default 1
     * @type {number}
     */
    tensionX?: number;
    /**
     * Vertical tension setting of the line (0-1).
     *
     * Used for smoothed lines.
     *
     * @default 1
     * @type {number}
     */
    tensionY?: number;
    /**
     * Connect the lines over empty data points?
     *
     * @default true
     * @type {boolean}
     */
    connect?: boolean;
}
/**
 * Defines events for [[LineSeries]].
 */
export interface ILineSeriesEvents extends IXYSeriesEvents {
}
/**
 * Defines adapters for [[LineSeries]].
 *
 * @see {@link Adapter}
 */
export interface ILineSeriesAdapters extends IXYSeriesAdapters, ILineSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a line graph.
 *
 * @see {@link ILineSeriesEvents} for a list of available Events
 * @see {@link ILineSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export declare class LineSeries extends XYSeries {
    /**
     * Defines the type of data fields used for the series.
     *
     * @ignore Exclude from docs
     * @type {ILineSeriesDataFields}
     */
    _dataFields: ILineSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ILineSeriesProperties}
     */
    _properties: ILineSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ILineSeriesAdapters}
     */
    _adapter: ILineSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {ILineSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: ILineSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {LineSeriesDataItem}
     */
    _dataItem: LineSeriesDataItem;
    /**
     * A list of line series segments.
     *
     * Segments are used in two cases:
     *
     * * When we want to change the appearance of a part of the line series;
     * * When we have an axis range.
     *
     * @type {ListTemplate<this["_segment"]>}
     */
    segments: ListTemplate<this["_segment"]>;
    /**
     * @ignore
     */
    _segment: LineSeriesSegment;
    /**
     * A container for segment elements.
     *
     * @ignore Exclude from docs
     * @type {Container}
     */
    segmentsContainer: Container;
    /**
     * Minimum distance in pixels between two adjacent points.
     *
     * If the distance is less than this setting, a point is skipped.
     *
     * This allows acceptable performance with huge amounts of data points.
     *
     * @default 0.5
     * @type {number}
     */
    minDistance: number;
    /**
     * Iterator for segments.
     *
     * @type {ListIterator<LineSeriesSegment>}
     */
    protected _segmentsIterator: $iter.ListIterator<this["_segment"]>;
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
     * @ignore
     */
    protected createSegment(): this["_segment"];
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {LineSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Inits data item's working values.
     *
     * @param {this["_dataItem"]}  dataItem  Data item
     * @param {number}             index     Data item's index
     */
    protected setInitialWorkingValues(dataItem: this["_dataItem"]): void;
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * [sliceData description]
     *
     * @todo Description
     */
    protected sliceData(): void;
    /**
     * [openSegment description]
     *
     * @todo Description
     * @param {number}        openIndex  [description]
     * @param {AxisDataItem}  axisRange  [description]
     */
    protected openSegment(openIndex: number, axisRange?: AxisDataItem): void;
    /**
     * [addPoints description]
     *
     * @todo Description
     * @param {IPoint[]}          points    [description]
     * @param {this["_dataItem"]} dataItem  [description]
     * @param {string}            xField    [description]
     * @param {string}            yField    [description]
     * @param {boolean}           backwards [description]
     */
    protected addPoints(points: IPoint[], dataItem: this["_dataItem"], xField: string, yField: string, backwards?: boolean): void;
    /**
     * [closeSegment description]
     *
     * @todo Description
     * @param {LineSeriesSegment} segment    [description]
     * @param {IPoint[]}          points     [description]
     * @param {number}            openIndex  [description]
     * @param {number}            closeIndex [description]
     * @param {AxisDataItem}      axisRange  [description]
     */
    protected closeSegment(segment: LineSeriesSegment, points: IPoint[], openIndex: number, closeIndex: number, axisRange?: AxisDataItem): void;
    /**
     * Draws the line segment.
     *
     * @param {LineSeriesSegment}  segment     Segment
     * @param {IPoint[]}           points      Segment points
     * @param {IPoint[]}           closePoints Segment close points
     */
    protected drawSegment(segment: LineSeriesSegment, points: IPoint[], closePoints: IPoint[]): void;
    /**
     * Segement will get its colors from `this.dataItem`, as thats how
     * `getPropertyValue()` method works.
     *
     * We pass `lineSeriesDataItem.properties` as item here each time when a flag
     * `hasProperties` is set to `true` on data item (this means it can contain
     * some properties set).
     *
     * @param  {object}             itemProperties  Item properties
     * @param  {LineSeriesSegment}  segment         Segment
     * @return {boolean}                            Properties changed?
     */
    protected updateSegmentProperties(itemProperties: {
        [index: string]: any;
    }, segment?: LineSeriesSegment): boolean;
    /**
     * @return {boolean} Connect?
     */
    /**
     * Connect the lines over empty data points?
     *
     * @default true
     * @param {boolean}  value  Connect?
     */
    connect: boolean;
    /**
     * @return {number} Horizontal tension (0-1)
     */
    /**
     * Horizontal tension setting of the line (0-1).
     *
     * Can be used to create smoothed lines. It works like this:
     *
     * Accepted values are in the range between 0 and 1. The biggest value (1)
     * will mean that the "tension" is very high, so the line is maximally
     * attracted to the points it connects, hence the straight line.
     *
     * Using smaller numbers will "relax" the tension, creating some curving.
     *
     * The smaller the tension setting, the more relaxed the line and the more
     * wide the curve.
     *
     * This setting is for horizontal tension, meaning the curve will bend in
     * such way that it never goes below or above connecting points. To enable
     * vertical bending as well, use `tensionY`.
     *
     * @default 1
     * @param {number}  value  Horizontal tension (0-1)
     */
    tensionX: number;
    /**
     * @return {number} Vertical tension (0-1)
     */
    /**
     * Can be used to create smoothed lines. It works like this:
     *
     * Accepted values are in the range between 0 and 1. The biggest value (1)
     * will mean that the "tension" is very high, so the line is maximally
     * attracted to the points it connects, hence the straight line.
     *
     * Using smaller numbers will "relax" the tension, creating some curving.
     *
     * The smaller the tension setting, the more relaxed the line and the more
     * wide the curve.
     *
     * This setting is for vertical tension, meaning the curve might bend in
     * such way that it will go below or above connected points.
     *
     * Combine this setting with `tensionX` to create beautifully looking
     * smoothed line series.
     *
     * @default 1
     * @param {number}  value  Vertical tension (0-1)
     */
    tensionY: number;
    /**
     * Creates elements in related legend container, that mimics the look of this
     * Series.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Legend item container
     */
    createLegendMarker(marker: Container): void;
}
