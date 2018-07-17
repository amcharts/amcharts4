/**
 * Radar chart module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { XYChart, IXYChartProperties, IXYChartDataFields, IXYChartAdapters, IXYChartEvents, XYChartDataItem } from "./XYChart";
import { AMEvent } from "../../core/Sprite";
import { Percent } from "../../core/utils/Percent";
import { Container } from "../../core/Container";
import { IComponentEvents } from "../../core/Component";
import { RadarCursor } from "../cursors/RadarCursor";
import { Axis } from "../axes/Axis";
import { AxisRenderer } from "../axes/AxisRenderer";
import { AxisRendererCircular } from "../axes/AxisRendererCircular";
import { AxisRendererRadial } from "../axes/AxisRendererRadial";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[RadarChart]].
 *
 * @see {@link DataItem}
 */
export declare class RadarChartDataItem extends XYChartDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {RadarChart}
     */
    _component: RadarChart;
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
 * Defines data fields for [[RadarChart]].
 */
export interface IRadarChartDataFields extends IXYChartDataFields {
}
/**
 * Defines properties for [[RadarChart]].
 */
export interface IRadarChartProperties extends IXYChartProperties {
    /**
     * Radius of the Radar face. Absolute or relative.
     *
     * @type {number | Percent}
     */
    radius?: number | Percent;
    /**
     * Inner radius of the Radar face. Percent value is relative to radius.
     *
     * @todo review desc
     * @type {number | Percent}
     */
    innerRadius?: number | Percent;
    /**
     * An angle radar face starts on. (degrees)
     *
     * @default -90
     * @type {number}
     */
    startAngle?: number;
    /**
     * An angle radar face ends on. (degrees)
     *
     * @default 270
     * @type {number}
     */
    endAngle?: number;
}
/**
 * Defines events for [[RadarChart]].
 */
export interface IRadarChartEvents extends IXYChartEvents {
}
/**
 * Defines adapters for [[RadarChart]].
 *
 * @see {@link Adapter}
 */
export interface IRadarChartAdapters extends IXYChartAdapters, IRadarChartProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Radar chart.
 *
 * @see {@link IRadarChartEvents} for a list of available Events
 * @see {@link IRadarChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/radar-chart/} for documentation
 * @important
 */
export declare class RadarChart extends XYChart {
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IRadarChartDataFields}
     */
    _dataFields: IRadarChartDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IRadarChartProperties}
     */
    _properties: IRadarChartProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {SeriesAdapters}
     */
    _adapter: IRadarChartAdapters;
    /**
     * Defines available events.
     *
     * @type {IRadarChartEvents}
     * @ignore Exclude from docs
     */
    _events: IRadarChartEvents;
    /**
     * Defines X axis renderer type.
     *
     * @ignore Exclude from docs
     * @type {AxisRendererCircular}
     */
    _xAxisRendererType: AxisRendererCircular;
    /**
     * Defines Y axis renderer type.
     *
     * @ignore Exclude from docs
     * @type {AxisRendererRadial}
     */
    _yAxisRendererType: AxisRendererRadial;
    /**
     * Defines X axis renderer type.
     *
     * @type {AxisRendererCircular}
     */
    protected _axisRendererX: typeof AxisRendererCircular;
    /**
     * Defines Y axis renderer type.
     *
     * @type {AxisRendererRadial}
     */
    protected _axisRendererY: typeof AxisRendererRadial;
    /**
     * [_cursor description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {RadarCursor}
     */
    _cursor: RadarCursor;
    /**
     * A container that holds Radar visual elements.
     *
     * @type {Container}
     */
    radarContainer: Container;
    /**
     *
     * @ignore Exclude from docs
     */
    protected _pixelInnerRadius: number;
    /**
     * used by cursor. We adjust innerradius if start and end angle are close to each other
     * @ignore Exclude from docs
     */
    innerRadiusModifyer: number;
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
     * Decorates Axis with required properties for this chart.
     *
     * @param {Axis}  axis  Axis
     */
    protected processAxis(axis: Axis): void;
    /**
     * Updates all X axes after range change event.
     *
     * @param {AMEvent<Axis, IComponentEvents>["datarangechanged"]}  event  Event
     */
    protected handleXAxisRangeChange(event: AMEvent<Axis, IComponentEvents>["datarangechanged"]): void;
    /**
     * Updates all Y axes after range change event.
     *
     * @param {AMEvent<Axis, IComponentEvents>["datarangechanged"]}  event  Event
     */
    protected handleYAxisRangeChange(event: AMEvent<Axis, IComponentEvents>["datarangechanged"]): void;
    /**
     * Creates and returns a new Cursor, of type suitable for RadarChart.
     *
     * @return {RadarCursor} Cursor
     */
    protected createCursor(): this["_cursor"];
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
     * Does calculations before drawing the chart.
     */
    protected beforeDraw(): void;
    /**
     * Creates and returns a new Series, suitable for RadarChart.
     *
     * @return {RadarSeries} New Series
     */
    protected createSeries(): this["_seriesType"];
    /**
     * @return {number} Start angle (degrees)
     */
    /**
     * Starting angle of the Radar face. (degrees)
     *
     * Normally, a circular radar face begins (the radial axis is drawn) at the
     * top center. (at -90 degrees)
     *
     * You can use `startAngle` to change this setting.
     *
     * E.g. setting this to 0 will make the radial axis start horizontally to
     * the right, as opposed to vertical.
     *
     * For a perfect circle the absolute sum of `startAngle` and `endAngle`
     * needs to be 360.
     *
     * However, it's **not** necessary to do so. You can set those to lesser
     * numbers, to create semi-circles.
     *
     * E.g. `startAngle = -90` with `endAngle = 0` will create a radar face that
     * looks like a quarter of a circle.
     *
     * @default -90
     * @param {number}  value  Start angle (degrees)
     */
    startAngle: number;
    /**
     * @return {number} End angle (degrees)
     */
    /**
     * Starting angle of the Radar face. (degrees)
     *
     * Normally, a circular radar face ends (the radial axis is drawn) exactly
     * where it has started, forming a full 360 circle. (at 270 degrees)
     *
     * You can use `endAngle` to end the circle somewhere else.
     *
     * E.g. setting this to 180 will make the radar face end at horizontal line
     * to the left off the center.
     *
     * For a perfect circle the absolute sum of `startAngle` and `endAngle`
     * needs to be 360.
     *
     * However, it's **not** necessary to do so. You can set those to lesser
     * numbers, to create semi-circles.
     *
     * E.g. `startAngle = -90` with `endAngle = 0` will create a radar face that
     * looks like a quarter of a circle.
     *
     * @default -90
     * @param {number}  value  End angle (degrees)
     */
    endAngle: number;
    /**
     * @return {number} Outer radius
     */
    /**
     * Outer radius of the Radar face.
     *
     * This can either be in absolute pixel value, or relative [[Percent]].
     *
     * @param {number | Percent}  value  Outer radius
     */
    radius: number | Percent;
    /**
     * @return {number} Inner radius in pixels
     */
    readonly pixelInnerRadius: number;
    /**
     * @return {number} Inner radius
     */
    /**
     * Inner radius of the radar face.
     *
     * This can either be in absolute pixel value, or relative [[Percent]].
     *
     * If set in Percent, it will be relative to `radius`. (outer radius)
     *
     * @param {number | Percent} value Inner radius
     */
    innerRadius: number | Percent;
    /**
     * Triggers (re)rendering of the horizontal (X) axis.
     *
     * @ignore Exclude from docs
     * @param {Axis} axis Axis
     */
    updateXAxis(renderer: AxisRenderer): void;
    /**
     * Triggers (re)rendering of the vertical (Y) axis.
     *
     * @ignore Exclude from docs
     * @param {Axis} axis Axis
     */
    updateYAxis(renderer: AxisRenderer): void;
}
