/**
 * Step line series module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { LineSeries, LineSeriesDataItem, ILineSeriesDataFields, ILineSeriesProperties, ILineSeriesAdapters, ILineSeriesEvents } from "./LineSeries";
import { IPoint } from "../../core/defs/IPoint";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[StepLineSeries]].
 *
 * @see {@link DataItem}
 */
export declare class StepLineSeriesDataItem extends LineSeriesDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {StepLineSeries}
     */
    _component: StepLineSeries;
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
 * Defines data fields for [[StepLineSeries]].
 */
export interface IStepLineSeriesDataFields extends ILineSeriesDataFields {
}
/**
 * Defines properties for [[StepLineSeries]].
 */
export interface IStepLineSeriesProperties extends ILineSeriesProperties {
}
/**
 * Defines events for [[StepLineSeries]].
 */
export interface IStepLineSeriesEvents extends ILineSeriesEvents {
}
/**
 * Defines adapters for [[StepLineSeries]].
 *
 * @see {@link Adapter}
 */
export interface IStepLineSeriesAdapters extends ILineSeriesAdapters, IStepLineSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a step line graph.
 *
 * @see {@link IStepLineSeriesEvents} for a list of available Events
 * @see {@link IStepLineSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export declare class StepLineSeries extends LineSeries {
    /**
     * Defines the type of data fields used for the series.
     *
     * @ignore Exclude from docs
     * @type {IStepLineSeriesDataFields}
     */
    _dataFields: IStepLineSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IStepLineSeriesProperties}
     */
    _properties: IStepLineSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IStepLineSeriesAdapters}
     */
    _adapter: IStepLineSeriesAdapters;
    /**
     * Defines available events.
     *
     * @type {IStepLineSeriesEvents}
     * @ignore Exclude from docs
     */
    _events: IStepLineSeriesEvents;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {StepLineSeriesDataItem}
     */
    _dataItem: StepLineSeriesDataItem;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {StepLineSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * [addPoints description]
     *
     * @todo Description
     * @param {IPoint[]}           points     [description]
     * @param {this["_dataItem"]}  dataItem   [description]
     * @param {string}             xField     [description]
     * @param {string}             yField     [description]
     * @param {boolean}            backwards  [description]
     */
    protected addPoints(points: IPoint[], dataItem: this["_dataItem"], xField: string, yField: string, backwards?: boolean): void;
}
