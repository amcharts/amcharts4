/**
 * Radar series module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { LineSeries, LineSeriesDataItem, ILineSeriesDataFields, ILineSeriesProperties, ILineSeriesAdapters, ILineSeriesEvents } from "./LineSeries";
import { LineSeriesSegment } from "./LineSeriesSegment";
import { IPoint } from "../../core/defs/IPoint";
import { RadarChart } from "../types/RadarChart";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[RadarSeries]].
 *
 * @see {@link DataItem}
 */
export declare class RadarSeriesDataItem extends LineSeriesDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {RadarSeries}
     */
    _component: RadarSeries;
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
 * Defines data fields for [[RadarSeries]].
 */
export interface IRadarSeriesDataFields extends ILineSeriesDataFields {
}
/**
 * Defines properties for [[RadarSeries]].
 */
export interface IRadarSeriesProperties extends ILineSeriesProperties {
    /**
     * Should the last and and first data points be connected, forming a complete
     * closed circle?
     *
     * @default true
     * @type {boolean}
     */
    connectEnds?: boolean;
}
/**
 * Defines events for [[RadarSeries]].
 */
export interface IRadarSeriesEvents extends ILineSeriesEvents {
}
/**
 * Defines adapters for [[RadarSeries]].
 *
 * @see {@link Adapter}
 */
export interface IRadarSeriesAdapters extends ILineSeriesAdapters, IRadarSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a radar graph.
 *
 * @see {@link IRadarSeriesEvents} for a list of available Events
 * @see {@link IRadarSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export declare class RadarSeries extends LineSeries {
    /**
     * Defines the type of data fields used for the series.
     *
     * @ignore Exclude from docs
     * @type {IRadarSeriesDataFields}
     */
    _dataFields: IRadarSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IRadarSeriesProperties}
     */
    _properties: IRadarSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IRadarSeriesAdapters}
     */
    _adapter: IRadarSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IRadarSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IRadarSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {RadarSeriesDataItem}
     */
    _dataItem: RadarSeriesDataItem;
    /**
     * A chart series belongs to.
     *
     * @ignore Exclude from docs
     * @type {RadarChart}
     */
    _chart: RadarChart;
    /**
     * Constructor
     */
    constructor();
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {RadarSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * [getPoint description]
     *
     * @todo Description
     * @param {RadarSeriesDataItem} dataItem  [description]
     * @param {string}              xKey      [description]
     * @param {string}              yKey      [description]
     * @param {number}              locationX [description]
     * @param {number}              locationY [description]
     * @param {string}              stackKeyX [description]
     * @param {string}              stackKeyY [description]
     */
    protected getPoint(dataItem: RadarSeriesDataItem, xKey: string, yKey: string, locationX?: number, locationY?: number, stackKeyX?: string, stackKeyY?: string): {
        x: number;
        y: number;
    };
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
     * Returns an SVG path to be used as a mask for the series.
     *
     * @return {string} SVG path
     */
    protected getMaskPath(): string;
    /**
     * [drawSegment description]
     *
     * @todo Description
     * @param {LineSeriesSegment}  segment      [description]
     * @param {IPoint[]}           points       [description]
     * @param {IPoint[]}           closePoints  [description]
     */
    protected drawSegment(segment: LineSeriesSegment, points: IPoint[], closePoints: IPoint[]): void;
    /**
     * @return {boolean} Connect?
     */
    /**
     * Should the last and and first data points be connected, forming a complete
     * closed circle?
     *
     * @default true
     * @param {boolean}  value  Connect?
     */
    connectEnds: boolean;
}
