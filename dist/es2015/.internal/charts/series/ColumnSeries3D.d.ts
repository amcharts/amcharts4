/**
 * 3D column series module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, IColumnSeriesProperties, IColumnSeriesDataFields, IColumnSeriesAdapters, IColumnSeriesEvents, ColumnSeriesDataItem } from "../series/ColumnSeries";
import { Container } from "../../core/Container";
import { XYChart3D } from "../types/XYChart3D";
import { Column3D } from "../elements/Column3D";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
export declare class ColumnSeries3DDataItem extends ColumnSeriesDataItem {
    /**
     * A sprite used to draw the column.
     * @ignore
     * @type {Column3D}
     */
    _column: Column3D;
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
 * Defines data fields for [[ColumnSeries3D]].
 */
export interface IColumnSeries3DDataFields extends IColumnSeriesDataFields {
}
/**
 * Defines properties for [[ColumnSeries3D]].
 */
export interface IColumnSeries3DProperties extends IColumnSeriesProperties {
    /**
     * Depth (height) of the slices in the series in pixels.
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    depth?: number;
    /**
     * Angle of view for the slices in series. (0-360)
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    angle?: number;
}
/**
 * Defines events for [[ColumnSeries3D]].
 */
export interface IColumnSeries3DEvents extends IColumnSeriesEvents {
}
/**
 * Defines adapters for [[ColumnSeries3D]].
 *
 * @see {@link Adapter}
 */
export interface IColumnSeries3DAdapters extends IColumnSeriesAdapters, IColumnSeries3DProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a 3D column graph.
 *
 * @see {@link IColumnSeries3DEvents} for a list of available Events
 * @see {@link IColumnSeries3DAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export declare class ColumnSeries3D extends ColumnSeries {
    /**
     * @ignore
     */
    _dataItem: ColumnSeries3DDataItem;
    /**
     * @ignore
     */
    _column: Column3D;
    /**
     * Defines the type for data fields.
     *
     * @ignore Exclude from docs
     * @type {IColumnSeries3DDataFields}
     */
    _dataFields: IColumnSeries3DDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IColumnSeries3DProperties}
     */
    _properties: IColumnSeries3DProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IColumnSeries3DAdapters}
     */
    _adapter: IColumnSeries3DAdapters;
    /**
     * Defines available events.
     *
     * @type {IColumnSeries3DEvents}
     * @ignore Exclude from docs
     */
    _events: IColumnSeries3DEvents;
    /**
     * Specifies how deep in 3d space columns should be drawn.
     *
     * Internal use only.
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    depthIndex: number;
    /**
     * A chart series belongs to.
     *
     * @ignore Exclude from docs
     * @type {XYChart3D}
     */
    _chart: XYChart3D;
    /**
     * Constructor
     */
    constructor();
    readonly columnsContainer: Container;
    /**
     * Returns an element to use for 3D bar.
     * @ignore
     * @return {this["_column"]} Element.
     */
    protected createColumnTemplate(): this["_column"];
    /**
     * Returns SVG path to use as a mask for the series.
     *
     * @return {string} Mask path
     */
    protected getMaskPath(): string;
    /**
     * @ignore Exclude from docs
     * @return {number} Depth (px)
     */
    /**
     * Depth (height) of the slices in the series in pixels.
     *
     * @ignore Exclude from docs
     * @param {number}  value  Depth (px)
     */
    depth: number;
    /**
     * @ignore Exclude from docs
     * @return {number} Angle (0-360)
     */
    /**
     * Angle of view for the slices in series. (0-360)
     *
     * @ignore Exclude from docs
     * @param {number}  value  Angle (0-360)
     */
    angle: number;
}
