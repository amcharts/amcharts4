/**
 * Map line module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapObject, IMapObjectProperties, IMapObjectAdapters, IMapObjectEvents } from "./MapObject";
import { MapLineObject } from "./MapLineObject";
import { MapLineSeriesDataItem, MapLineSeries } from "./MapLineSeries";
import { MapImage } from "./MapImage";
import { IOrientationPoint } from "../../core/defs/IPoint";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { ListTemplate, IListEvents } from "../../core/utils/List";
import { Polyline } from "../../core/elements/Polyline";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[MapLine]].
 */
export interface IMapLineProperties extends IMapObjectProperties {
    /**
     * Lat/long coordinates of all line ends and intermediate elbows.
     */
    multiGeoLine?: IGeoPoint[][];
    /**
     * If `true` it line will be arched in the way to simulate shortest path
     * over curvature of Earth's surface, based on currently used on projection.
     *
     * @type {boolean}
     */
    shortestDistance?: boolean;
    /**
     * Instead of setting longitudes/latitudes you can set an array of images which will be connected by the line
     */
    imagesToConnect?: MapImage[];
}
/**
 * Defines events for [[MapLine]].
 */
export interface IMapLineEvents extends IMapObjectEvents {
}
/**
 * Defines adapters for [[MapLine]].
 *
 * @see {@link Adapter}
 */
export interface IMapLineAdapters extends IMapObjectAdapters, IMapLineProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw a line on the map.
 *
 * @see {@link IMapLineEvents} for a list of available events
 * @see {@link IMapLineAdapters} for a list of available Adapters
 */
export declare class MapLine extends MapObject {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapLineProperties}
     */
    _properties: IMapLineProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapLineAdapters}
     */
    _adapter: IMapLineAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapLineEvents}
     * @ignore Exclude from docs
     */
    _events: IMapLineEvents;
    /**
     * A line visual element.
     *
     * @type {Polyline}
     */
    line: Polyline;
    /**
     * [_lineObjects description]
     *
     * @todo Description
     * @type {ListTemplate<MapLineObject>}
     */
    protected _lineObjects: ListTemplate<MapLineObject>;
    /**
     * [_arrow description]
     *
     * @todo Description
     * @type {MapLineObject}
     */
    protected _arrow: MapLineObject;
    /**
     * [_distance description]
     *
     * @todo Description
     * @type {number}
     */
    protected _distance: number;
    /**
     * Related data item.
     *
     * @ignore Exclude from docs
     * @type {MapLineSeriesDataItem}
     */
    _dataItem: MapLineSeriesDataItem;
    /**
     * A map series this object belongs to.
     *
     * @type {MapLineSeries}
     */
    series: MapLineSeries;
    /**
     * Instead of setting longitudes/latitudes you can set an array of images which will be connected by the line
     * @ignore
     */
    protected _imagesToConnect: MapImage[];
    /**
     * Constructor
     */
    constructor();
    /**
     * Converts a position within the line (0-1) to a physical point
     * coordinates.
     *
     * 0 indicates start of the line, 0.5 - middle, while 1 indicates the end.
     *
     * @param  {number}             position  Position (0-1)
     * @return {IOrientationPoint}            Coordinates
     */
    positionToPoint(position: number): IOrientationPoint;
    /**
     * @return {IGeoPoint[]} [description]
     */
    /**
     * [multiGeoLine description]
     *
     * @todo Description
     * @param {IGeoPoint[][]} multiGeoLine [description]
     */
    multiGeoLine: IGeoPoint[][];
    /**
     * @return {MapImages[]}
     */
    /**
     * Instead of setting longitudes/latitudes you can set an array of images which will be connected by the line
     *
     * @param {MapImages[]} images
     */
    imagesToConnect: MapImage[];
    /**
     * (Re)validates the line, effectively forcing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * @ignore Exclude from docs
     */
    measureElement(): void;
    /**
     * @return {boolean} Real path?
     */
    /**
     * The line should take the shortest path over the globe.
     *
     * Enabling this will make the line look differently in different
     * projections. Only `MapLine` supports this setting, `MapArc` and
     * `MapSplice` don't.
     *
     * @default false
     * @param {boolean}  value  Real path?
     */
    shortestDistance: boolean;
    /**
     * List of separate line objects, the line consists of.
     *
     * @todo Description (review)
     * @readonly
     * @return {ListTemplate<MapLineObject>} List of line objects
     */
    readonly lineObjects: ListTemplate<MapLineObject>;
    /**
     * Decorate a [[LineObject]] when it is added to the line.
     *
     * @param {IListEvents<MapLineObject>["inserted"]}  event  Event
     */
    protected handleLineObjectAdded(event: IListEvents<MapLineObject>["inserted"]): void;
    /**
     * @return {MapLineObject} Arrow element
     */
    /**
     * A [[MapLineObject]] to use as an option arrowhead on the line.
     *
     * Just accessing this property will create a default arrowhead on the line
     * automatically.
     *
     * @param {MapLineObject}  arrow  Arrow element
     */
    arrow: MapLineObject;
    /**
     * Copies line properties and other attributes, like arrow, from another
     * instance of [[MapLine]].
     *
     * @param {MapLineObject}  source  Source map line
     */
    copyFrom(source: this): void;
    /**
     * Latitude of the line center.
     *
     * @readonly
     * @return {number} Latitude
     */
    readonly latitude: number;
    /**
     * Longitude of the line center.
     *
     * @readonly
     * @return {number} Latitude
     */
    readonly longitude: number;
}
