/**
 * Module for building 3D serial charts.
 */
/**
 * ============================================================================
 * Imports
 * ============================================================================
 * @hidden
 */
import { XYChart, IXYChartProperties, IXYChartDataFields, IXYChartAdapters, IXYChartEvents, XYChartDataItem } from "./XYChart";
import { Container } from "../../core/Container";
import { AxisRendererX3D } from "../axes/AxisRendererX3D";
import { AxisRendererY3D } from "../axes/AxisRendererY3D";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[XYChart3D]].
 *
 * @see {@link DataItem}
 */
export declare class XYChart3DDataItem extends XYChartDataItem {
    constructor();
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[XYChart3D]].
 */
export interface IXYChart3DDataFields extends IXYChartDataFields {
}
/**
 * Defines available properties for [[XYChart3D]].
 */
export interface IXYChart3DProperties extends IXYChartProperties {
    /**
     * Depths of the chart in pixels.
     *
     * @type {number}
     */
    depth?: number;
    /**
     * Angle the chart is viewed at.
     *
     * @type {number}
     */
    angle?: number;
}
/**
 * Defines events for [[XYChart3D]].
 */
export interface IXYChart3DEvents extends IXYChartEvents {
}
/**
 * Defines adapters for [[XYChart3D]].
 *
 * @see {@link Adapter}
 */
export interface IXYChart3DAdapters extends IXYChartAdapters, IXYChart3DProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a 3D XY chart.
 *
 * @see {@link IXYChart3DEvents} for a list of available Events
 * @see {@link IXYChart3DAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/} for documentation
 * @important
 */
export declare class XYChart3D extends XYChart {
    /**
     * Available data fields.
     *
     * @ignore Exclude from docs
     * @type {IXYChart3DDataFields}
     */
    _dataFields: IXYChart3DDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IXYChart3DProperties}
     */
    _properties: IXYChart3DProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IXYChart3DAdapters}
     */
    _adapter: IXYChart3DAdapters;
    /**
     * Defines available events.
     *
     * @type {IXYChart3DEvents}
     * @ignore Exclude from docs
     */
    _events: IXYChart3DEvents;
    /**
     * Type of the axis renderer to use for X axes.
     *
     * @type {[type]}
     */
    protected _axisRendererX: typeof AxisRendererX3D;
    /**
     * Type of the axis renderer to use for Y axes.
     * @type {[type]}
     */
    protected _axisRendererY: typeof AxisRendererY3D;
    /**
     * A container to add 3D column elements to.
     *
     * @ignore Exclude from docs
     * @type {Container}
     */
    columnsContainer: Container;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Depth (px)
     */
    /**
     * Depth of the 3D chart / columns in pixels.
     *
     * @param {number}  value  Depth (px)
     */
    depth: number;
    /**
     * @return {number} Angle
     */
    /**
     * Angle the chart is viewed at.
     *
     * @todo Description (review)
     * @param {number}  value  Angle
     */
    angle: number;
    /**
     * A calculated horizontal 3D offset (px).
     *
     * @readonly
     * @return {number} Offset (px)
     */
    readonly dx3D: number;
    /**
     * A calculated vertical 3D offset (px).
     *
     * @readonly
     * @return {number} Offset (px)
     */
    readonly dy3D: number;
    /**
     * (Re)validates the chart.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Updates the layout (padding and scrollbar positions) to accommodate for
     * 3D depth and angle.
     */
    protected fixLayout(): void;
    /**
     * Updates column positions, offset and dimensions based on chart's angle
     * and depth.
     */
    protected fixColumns(): void;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
}
