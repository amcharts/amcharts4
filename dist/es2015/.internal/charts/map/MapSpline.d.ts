/**
 * Map spline module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapLine, IMapLineProperties, IMapLineAdapters, IMapLineEvents } from "./MapLine";
import { Polyspline } from "../../core/elements/Polyspline";
import { MapSplineSeriesDataItem, MapSplineSeries } from "./MapSplineSeries";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[MapSpline]].
 */
export interface IMapSplineProperties extends IMapLineProperties {
}
/**
 * Defines events for [[MapSpline]].
 */
export interface IMapSplineEvents extends IMapLineEvents {
}
/**
 * Defines adapters for [[MapSpline]].
 *
 * @see {@link Adapter}
 */
export interface IMapSplineAdapters extends IMapLineAdapters, IMapSplineProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw a spline on the map.
 *
 * @see {@link IMapSplineEvents} for a list of available events
 * @see {@link IMapSplineAdapters} for a list of available Adapters
 */
export declare class MapSpline extends MapLine {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapSplineProperties}
     */
    _properties: IMapSplineProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapSplineAdapters}
     */
    _adapter: IMapSplineAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapSplineEvents}
     * @ignore Exclude from docs
     */
    _events: IMapSplineEvents;
    /**
     * A visual element for the spline.
     *
     * @type {Polyspline}
     */
    line: Polyspline;
    /**
     * A related data item.
     *
     * @ignore Exclude from docs
     * @type {MapSplineSeriesDataItem}
     */
    _dataItem: MapSplineSeriesDataItem;
    /**
     * A map series this object belongs to.
     *
     * @type {MapSplineSeries}
     */
    series: MapSplineSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * ShortestDistance = true is not supported by MapSpline, only MapLine does support it
     * @default false
     * @param {boolean}  value
     * @todo: review description
     */
    shortestDistance: boolean;
}
