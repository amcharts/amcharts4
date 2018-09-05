/**
 * Map module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, ISerialChartProperties, ISerialChartDataFields, ISerialChartAdapters, ISerialChartEvents, SerialChartDataItem } from "./SerialChart";
import { Sprite, ISpriteEvents, AMEvent } from "../../core/Sprite";
import { IDisposer } from "../../core/utils/Disposer";
import { ListTemplate } from "../../core/utils/List";
import { MapSeries } from "../map/MapSeries";
import { MapObject } from "../map/MapObject";
import { IPoint } from "../../core/defs/IPoint";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { DataSource } from "../../core/data/DataSource";
import { Projection } from "../map/projections/Projection";
import { ZoomControl } from "../map/ZoomControl";
import { Ordering } from "../../core/utils/Order";
import { SmallMap } from "../map/SmallMap";
import { Animation } from "../../core/utils/Animation";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapChart]].
 *
 * @see {@link DataItem}
 */
export declare class MapChartDataItem extends SerialChartDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {MapChart}
     */
    _component: MapChart;
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
 * Defines interface for a map polygon object.
 */
export interface IMapPolygonDataObject {
    /**
     * A unique id of the object.
     *
     * @type {string}
     */
    id?: string;
    /**
     * Numeric value for heat-map scenarios.
     *
     * @type {[type]}
     */
    value?: number;
    /**
     * Single polygon information in X/Y coordinates.
     */
    polygon?: number[][][];
    /**
     * Multi-part polygon information in X/Y coordinates.
     */
    multiPolygon?: number[][][][];
    /**
     * Single polygon information in lat/long geo-coordinates.
     */
    geoPolygon?: IGeoPoint[][];
    /**
     * Multi-part polygon information in lat/long geo-coordinates.
     */
    multiGeoPolygon?: IGeoPoint[][][];
}
/**
 * Defines types of map line.
 *
 * @type {string}
 */
export declare type MapLineType = "line" | "arc" | "spline" | "realTrajectory";
/**
 * Defines interface for the map line object.
 */
export interface IMapLineDataObject {
    /**
     * A unique id of the object.
     *
     * @type {string}
     */
    id?: string;
    /**
     * Numeric value for heat-map scenarios.
     *
     * @type {[type]}
     */
    value?: number;
    /**
     * Single line information in X/Y coordinates.
     */
    lineString?: number[][];
    /**
     * Multi-part line information in X/Y coordinates.
     */
    multiLineString?: number[][][];
    /**
     * Single line information in lat/long geo-coordinates.
     */
    geoLineString?: IGeoPoint[];
    /**
     * Multi-part line information in lat/long geo-coordinates.
     */
    multiGeoLineString?: IGeoPoint[][];
}
/**
 * Defines interface for a map image (market) object.
 */
export interface IMapImageDataObject {
    /**
     * A unique id of the object.
     *
     * @type {string}
     */
    id?: string;
    /**
     * Numeric value for heat-map scenarios.
     *
     * @type {[type]}
     */
    value?: number;
    /**
     * Image position information in X/Y coordinates.
     */
    point?: number[];
    /**
     * Multi-image position information in X/Y coordinates.
     */
    multiPoint?: number[][];
    /**
     * Image position information in lat/long geo-coordinates.
     */
    geoPoint?: IGeoPoint;
    /**
     * Multi-image position information in lat/long geo-coordinates.
     */
    multiGeoPoint?: IGeoPoint[];
}
/**
 * Defines type suitable for all map objects.
 *
 * @type {IMapPolygonDataObject | IMapLineDataObject}
 */
export declare type IMapDataObject = IMapPolygonDataObject | IMapLineDataObject;
/**
 * Defines data fields for [[MapChart]].
 */
export interface IMapChartDataFields extends ISerialChartDataFields {
}
/**
 * Defines properties for [[MapChart]].
 */
export interface IMapChartProperties extends ISerialChartProperties {
    /**
     * Projection to be used when drawing the map.
     *
     * @type {Projection}
     */
    projection?: Projection;
    /**
     * Degrees to shift map center by.
     *
     * E.g. if set to -160, the longitude 20 will become a new center, creating
     * a Pacific-centered map.
     *
     * @type {number}
     */
    deltaLongitude?: number;
    maxPanOut?: number;
    homeGeoPoint?: IGeoPoint;
    homeZoomLevel?: number;
    /**
     * Specifies what should chart do if when mouse wheel is rotated.
     */
    mouseWheelBehavior?: "zoom" | "none";
}
/**
 * Defines events for [[MapChart]].
 */
export interface IMapChartEvents extends ISerialChartEvents {
    /**
     * Invoked when map is zoomed in or out.
     */
    zoomlevelchanged: {};
    /**
     * Invoked when map is panned. (moved)
     */
    mappositionchanged: {};
    /**
     * Invoked when scale ratio is changed, e.g when the whole map area is
     * resized and the map needs to be resized to fit it, without changing
     * zoom level.
     */
    scaleratiochanged: {};
}
/**
 * Defines adapters for [[MapChart]].
 *
 * @see {@link Adapter}
 */
export interface IMapChartAdapters extends ISerialChartAdapters, IMapChartProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a map.
 *
 * @see {@link IMapChartEvents} for a list of available Events
 * @see {@link IMapChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/map/} for documentation
 */
export declare class MapChart extends SerialChart {
    /**
     * Available data fields.
     *
     * @ignore Exclude from docs
     * @type {IMapChartDataFields}
     */
    _dataFields: IMapChartDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IMapChartProperties}
     */
    _properties: IMapChartProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IMapChartAdapters}
     */
    _adapter: IMapChartAdapters;
    /**
     * Defines available events.
     *
     * @type {IMapChartEvents}
     * @ignore Exclude from docs
     */
    _events: IMapChartEvents;
    /**
     * The East-most longitude point of the map.
     *
     * @type {number}
     */
    east: number;
    /**
     * The West-most longitude point of the map.
     *
     * @type {number}
     */
    west: number;
    /**
     * The South-most latitude point of the map.
     *
     * @type {number}
     */
    south: number;
    /**
     * The North-most latitude point of the map.
     *
     * @type {number}
     */
    north: number;
    /**
     * A ratio to be used when scaling the map shapes.
     *
     * @readonly
     * @type {number}
     */
    scaleRatio: number;
    /**
     * A screen point of the map's center.
     *
     * @readonly
     * @type {IPoint}
     */
    centerPoint: IPoint;
    /**
     * A screen point of the map's left.
     *
     * @readonly
     * @type {IPoint}
     */
    westPoint: IPoint;
    /**
     * A screen point of the map's right.
     *
     * @readonly
     * @type {IPoint}
     */
    eastPoint: IPoint;
    /**
     * A screen point of the map's top.
     *
     * @readonly
     * @type {IPoint}
     */
    northPoint: IPoint;
    /**
     * A screen point of the map's bottom.
     *
     * @readonly
     * @type {IPoint}
     */
    southPoint: IPoint;
    /**
     * Geo point of map center
     *
     * @readonly
     * @type {IPoint}
     */
    centerGeoPoint: IGeoPoint;
    /**
     * Width of the actual map objects (px).
     *
     * @type {number}
     */
    seriesWidth: number;
    /**
     * Height of the actual map objects (px).
     *
     * @type {number}
     */
    seriesHeight: number;
    /**
     * Map data in GeoJSON format.
     *
     * @see {@link http://geojson.org/} GeoJSON official specification
     * @type {Object}
     */
    protected _geodata: Object;
    /**
     * A reference to a [[ZoomControl]] instance.
     *
     * @type {ZoomControl}
     */
    protected _zoomControl: ZoomControl;
    /**
     * A reference to a [[SmallMap]] control instance.
     *
     * @type {SmallMap}
     */
    protected _smallMap: SmallMap;
    /**
     * [_zoomGeoPoint description]
     *
     * @todo Description
     * @type {IGeoPoint}
     */
    protected _zoomGeoPoint: IGeoPoint;
    /**
     * Default duration of zoom animations (ms).
     *
     * @type {number}
     */
    zoomDuration: number;
    /**
     * Default zooming animation easing function.
     *
     * @type {function}
     */
    zoomEasing: (value: number) => number;
    /**
     * Smallest available zoom level. The map will not allow to zoom out past
     * this setting.
     *
     * NOTE: Should be power of 2.
     *
     * @defautl 1
     * @type {number}
     */
    minZoomLevel: number;
    /**
     * Biggest available zoom level. The map will not allow to zoom in past
     * this setting.
     *
     * NOTE: Should be power of 2.
     *
     * @default 32
     * @type {number}
     */
    maxZoomLevel: number;
    /**
     * [_prevZoomLevel description]
     *
     * @todo Description
     * @type {number}
     */
    protected _prevZoomLevel: number;
    /**
     * [_prevZoomGeoPoint description]
     *
     * @todo Description
     * @type {IGeoPoint}
     */
    protected _prevZoomGeoPoint: IGeoPoint;
    /**
     * List of series of map objects. (lines, areas, etc.)
     *
     * @type {ListTemplate<MapSeries>}
     */
    series: ListTemplate<MapSeries>;
    /**
     * A reference to currently playing animation, e.g. zooming.
     *
     * @type {Animation}
     */
    protected _mapAnimation: Animation;
    protected _mouseWheelDisposer: IDisposer;
    /**
     * Constructor
     */
    constructor();
    /**
     * Prevents map to be dragged out of the container area
     * @ignore
     */
    protected handleDrag(): void;
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
    /**
     * Handles event when a pointer presses down on the map, e.g. user presses
     * down mouse or touches the map on a screen.
     *
     * Stops all animations currently going on.
     */
    protected handleMapDown(): void;
    /**
     * Handles the event when user doubleclicks or dooubletaps the map: zooms
     * in on the reference point.
     *
     * @param {AMEvent<Sprite, ISpriteEvents>["doublehit"]}  event  Original event
     */
    protected handleDoubleHit(event: AMEvent<Sprite, ISpriteEvents>["doublehit"]): void;
    /**
     * Handles mouse wheel event, e.g. user rotates mouse wheel while over the
     * map: zooms in or out depending on the direction of the wheel turn.
     *
     * @param {AMEvent<Sprite, ISpriteEvents>["wheel"]}  event  Original event
     */
    protected handleWheel(event: AMEvent<Sprite, ISpriteEvents>["wheel"]): void;
    /**
     * @return { "zoom" | "none"}  mouse wheel behavior
     */
    /**
     * Specifies what should chart do if when mouse wheel is rotated.
     *
     * @param {"zoom" | "none"} mouse wheel behavior
     * @default zoomX
     */
    mouseWheelBehavior: "zoom" | "none";
    /**
     * @return {Projection} Projection
     */
    /**
     * Projection to use for the map.
     *
     * Available projections:
     * * Eckert6
     * * Mercator
     * * Miller
     * * Orthographic
     *
     * ```TypeScript
     * map.projection = new am4maps.projections.Mercator();
     * ```
     * ```JavaScript
     * map.projection = new am4maps.projections.Mercator();
     * ```
     * ```JSON
     * {
     *   // ...
     *   "projection": "Mercator"
     *   // ...
     * }
     * ```
     *
     * @param {Projection}  projection  Projection
     */
    projection: Projection;
    /**
     * Calculates the longitudes and latitudes of the most distant points from
     * the center in all four directions: West, East, North, and South.
     *
     * @ignore Exclude from docs
     */
    updateExtremes(): void;
    /**
     * (Re)calculates a ratio which should be used to scale the actual map so
     * that it fits perfectly into available space. Helps to avoid redrawing of all the map if container size changes
     * @ignore
     */
    protected udpateScaleRatio(): void;
    /**
     * Converts a point within map container to geographical (lat/long)
     * coordinates.
     *
     * @param  {IPoint}     point  Source point
     * @return {IGeoPoint}         Geo-point
     */
    svgPointToGeo(point: IPoint): IGeoPoint;
    /**
     * Converts geographical (lat/long) coordinates to an X/Y point within map's
     * container.
     *
     * @param  {IGeoPoint}  point  Source geo-point
     * @return {IPoint}            Point
     */
    geoPointToSVG(point: IGeoPoint): IPoint;
    /**
     * Converts a point (X/Y) within actual objects of the map to geographical
     * (lat/long) coordinates.
     *
     * @param  {IPoint}     point  Source point
     * @return {IGeoPoint}         Geo-point
     */
    seriesPointToGeo(point: IPoint): IGeoPoint;
    /**
     * Converts geographical (lat/long) coordinates to an X/Y point within
     * actual elements/objects of the maps.
     *
     * @param  {IGeoPoint}  point  Source geo-point
     * @return {IPoint}            Point
     */
    geoPointToSeries(point: IGeoPoint): IPoint;
    /**
     * @return {Object} GeoJSON data
     */
    /**
     * Map data in GeoJSON format.
     *
     * The Map supports the following GeoJSON objects: `Point`, `LineString`,
     * `Polygon`, `MultiPoint`, `MultiLineString`, and `MultiPolygon`.
     *
     * @see {@link http://geojson.org/} Official GeoJSON format specification
     * @param {Object} geoJSON GeoJSON data
     */
    geodata: Object;
    /**
     * Zooms the map to particular zoom level and centers on a latitude/longitude
     * coordinate.
     *
     * @param  {IGeoPoint}  point      Center coordinate
     * @param  {number}     zoomLevel  Zoom level
     * @param  {boolean}    center     Center on the given coordinate?
     * @param  {number}     duration   Duration for zoom animation (ms)
     * @return {Animation}             Zoom animation
     */
    zoomToGeoPoint(point: IGeoPoint, zoomLevel: number, center?: boolean, duration?: number): Animation;
    /**
     * Zooms the map to a particular map object.
     *
     * @param  {MapObject}  mapObject  Target map object
     * @param  {number}     zoomLevel  Zoom level
     * @param  {boolean}    center     Center on the given coordinate?
     * @param  {number}     duration   Duration for zoom animation (ms)
     * @return {Animation}             Zoom animation
     */
    zoomToMapObject(mapObject: MapObject, zoomLevel?: number, center?: boolean, duration?: number): Animation;
    /**
     * Zooms the map to a particular viewport.
     *
     * The `north`, `east`, `south`, and `west` define boundaries of the
     * imaginary viewort we want to zoom the map to.
     *
     * `level` is not actual zoom level. The map will determine the zoom level
     * required to accommodated such zoom, and will adjust it by `level` if set.
     *
     * @param  {number}     north     Latitude of the North-most boundary
     * @param  {number}     east      Longitude of the East-most boundary
     * @param  {number}     south     Latitude of the South-most boundary
     * @param  {number}     west      Longitude of the West-most boundary
     * @param  {number}     level     Adjust zoom level
     * @param  {boolean}    center    Center on the given coordinate?
     * @param  {number}     duration  Duration for zoom animation (ms)
     * @return {Animation}            Zoom animation
     */
    zoomToRectangle(north: number, east: number, south: number, west: number, level?: number, center?: boolean, duration?: number): Animation;
    /**
     * Zooms in the map, optionally centering on particular latitude/longitude
     * point.
     *
     * @param  {IGeoPoint}  geoPoint  Optional center point
     * @param  {number}     duration  Duration for zoom animation (ms)
     * @return {Animation}            Zoom animation
     */
    zoomIn(geoPoint?: IGeoPoint, duration?: number): Animation;
    /**
     * Zooms out the map, optionally centering on particular latitude/longitude
     * point.
     *
     * @param  {IGeoPoint}  geoPoint  Optional center point
     * @param  {number}     duration  Duration for zoom animation (ms)
     * @return {Animation}            Zoom animation
     */
    zoomOut(geoPoint?: IGeoPoint, duration?: number): Animation;
    /**
     * Pans the maps using relative coordinates. E.g.:
     *
     * ```JSON
     * {
     *   x: 0.1,
     *   y: -0.1
     * }
     * ```
     *
     * The above will move the map by 10% to the right, and by 10% upwards.
     *
     * @param {IPoint}  shift     Vertical and horizontal shift
     * @param {number}  duration  Pan animation duration (ms)
     */
    pan(shift: IPoint, duration?: number): void;
    /**
     * Current lat/long coordinates for the center of the viewport. (default
     * zoom reference point)
     *
     * @readonly
     * @return {IGeoPoint} Coordinates
     */
    readonly zoomGeoPoint: IGeoPoint;
    /**
     * Current zoom level.
     *
     * @readonly
     * @return {number} Zoom level
     */
    zoomLevel: number;
    /**
     * Dispatches events after some map transformation, like pan or zoom.
     */
    protected handleMapTransform(): void;
    /**
     * @return {SmallMap} Small map
     */
    /**
     * A [[SmallMap]] to be used on the map.
     *
     * Please note, that accessing this property will NOT create a small map
     * if it has not yet been created. (except in JSON)
     *
     * ```TypeScript
     * // Create a small map
     * map.smallMap = new am4maps.SmallMap();
     * ```
     * ```JavaScript
     * // Create a small map
     * map.smallMap = new am4maps.SmallMap();
     * ```
     * ```JSON
     * {
     *   // ...
     *   "smallMap": {}
     *   // ...
     * }
     * ```
     *
     * @param {SmallMap}  smallMap  Small map
     */
    smallMap: SmallMap;
    /**
     * @return {ZoomControl} Zoom control
     */
    /**
     * A [[ZoomControl]] to be used on the map.
     *
     * Please note, that accessing this property will NOT create a zoom control
     * if it has not yet been created. (except in JSON)
     *
     * ```TypeScript
     * // Create a zoom control
     * map.zoomControl = new am4maps.ZoomControl();
     * ```
     * ```JavaScript
     * // Create a zoom control
     * map.zoomControl = new am4maps.ZoomControl();
     * ```
     * ```JSON
     * {
     *   // ...
     *   "zoomControl": {}
     *   // ...
     * }
     * ```
     *
     * @param {ZoomControl}  zoomControl  Zoom control
     */
    zoomControl: ZoomControl;
    /**
     * Creates and returns a map series of appropriate type.
     *
     * @return {MapSeries} Map series
     */
    protected createSeries(): this["_seriesType"];
    /**
     * @return {number} Map center shift
     */
    /**
     * Degrees to shift map center by.
     *
     * E.g. if set to -160, the longitude 20 will become a new center, creating
     * a Pacific-centered map.
     *
     * @param {number}  value  Map center shift
     */
    deltaLongitude: number;
    /**
     * @return {number} Max pan out
     */
    /**
     * Max pan out
     *
     * @param {number} Max pan out
     */
    maxPanOut: number;
    /**
     * @return {IGeoPoint} Home geo point
     */
    /**
     * The geographical point to center map on when it is first loaded.
     *
     * The map will also be centered to this point when you call `goHome()`
     * method.
     *
     * @param {IGeoPoint}  value  Home geo point
     */
    homeGeoPoint: IGeoPoint;
    /**
     * @return {number} Home zoom level
     */
    /**
     * The zoom level to put the map in when it is first loaded.
     *
     * The map will also be set to this zoom level when you call `goHome()`
     * method.
     *
     * @param {number}  value  Home zoom level
     */
    homeZoomLevel: number;
    /**
     * Invalidates projection, causing all series to be redrawn.
     */
    protected invalidateProjection(): void;
    /**
     * Returns a [[DataSource]] specifically for loading Component's data.
     *
     * @return {DataSource} Data source
     */
    /**
     * Sets a [[DataSource]] to be used for loading Component's data.
     *
     * @param {DataSource} value Data source
     */
    geodataSource: DataSource;
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
 * This function is used to sort element's JSON config properties, so that
 * some properties that absolutely need to be processed last, can be put at
 * the end.
 *
 * @ignore Exclude from docs
 * @param  {string}  a  Element 1
 * @param  {string}  b  Element 2
 * @return {number}     Sorting number
 */
    protected configOrder(a: string, b: string): Ordering;
    /**
     * Adds `projection` to "as is" fields.
     *
     * @param  {string}   field  Field name
     * @return {boolean}         Assign as is?
     */
    protected asIs(field: string): boolean;
    /**
     * Resets the map to its original position and zoom level.
     */
    goHome(duration?: number): void;
}
