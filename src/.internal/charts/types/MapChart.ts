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
import { Container } from "../../core/Container";
import { Legend } from "../Legend";
import { MapSeries } from "../map/MapSeries";
import { MapObject } from "../map/MapObject";
import { MapImage } from "../map/MapImage";
import { MapPolygon } from "../map/MapPolygon";
import { IPoint } from "../../core/defs/IPoint";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { DataSource } from "../../core/data/DataSource";
import { Projection } from "../map/projections/Projection";
import { ZoomControl } from "../map/ZoomControl";
import { Ordering } from "../../core/utils/Order";
import { SmallMap } from "../map/SmallMap";
import { Animation } from "../../core/utils/Animation";
import { keyboard } from "../../core/utils/Keyboard";
import { getInteraction } from "../../core/interaction/Interaction";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $ease from "../../core/utils/Ease";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $geo from "../map/Geo";
import { Paper } from "../../core/rendering/Paper";


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
export class MapChartDataItem extends SerialChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: MapChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "MapChartDataItem";
		this.applyTheme();
	}

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
	 */
	id?: string;

	/**
	 * Numeric value for heat-map scenarios.
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
 */
export type MapLineType = "line" | "arc" | "spline" | "realTrajectory";

/**
 * Defines interface for the map line object.
 */
export interface IMapLineDataObject {

	/**
	 * A unique id of the object.
	 */
	id?: string;

	/**
	 * Numeric value for heat-map scenarios.
	 */
	value?: number;

	/**
	 * Single line information in X/Y coordinates.
	 */
	line?: number[][];

	/**
	 * Multi-part line information in X/Y coordinates.
	 */
	multiLine?: number[][][];

	/**
	 * Single line information in lat/long geo-coordinates.
	 */
	geoLine?: IGeoPoint[];

	/**
	 * Multi-part line information in lat/long geo-coordinates.
	 */
	multiGeoLine?: IGeoPoint[][];

}

/**
 * Defines interface for a map image (market) object.
 */
export interface IMapImageDataObject {

	/**
	 * A unique id of the object.
	 */
	id?: string;

	/**
	 * Numeric value for heat-map scenarios.
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
 */
export type IMapDataObject = IMapPolygonDataObject | IMapLineDataObject;

/**
 * Defines data fields for [[MapChart]].
 */
export interface IMapChartDataFields extends ISerialChartDataFields { }

/**
 * Defines properties for [[MapChart]].
 */
export interface IMapChartProperties extends ISerialChartProperties {

	/**
	 * Projection to be used when drawing the map.
	 */
	projection?: Projection;

	/**
	 * Degrees to shift map center by.
	 *
	 * E.g. if set to -160, the longitude 20 will become a new center, creating
	 * a Pacific-centered map.
	 */
	deltaLongitude?: number;

	/**
	 * Maximum portion of the map's width/height to allow panning "off screen".
	 *
	 * A value of 0 (zero) will prevent any portion of the the map to be panned
	 * outside the viewport.
	 *
	 * 0.5 will allow half of the map to be outside viewable area.
	 *
	 * @default 0.7
	 */
	maxPanOut?: number;

	/**
	 * A map will start centered on this geographical point.
	 */
	homeGeoPoint?: IGeoPoint;

	/**
	 * A map will start zoomed to this level.
	 */
	homeZoomLevel?: number;

	/**
	 * When user zooms in or out current zoom level is multiplied or divided
	 * by value of this setting.
	 *
	 * @default 2
	 */
	zoomStep?: number;

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
export interface IMapChartAdapters extends ISerialChartAdapters, IMapChartProperties { }


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
export class MapChart extends SerialChart {

	/**
	 * Available data fields.
	 */
	public _dataFields: IMapChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapChartEvents;

	/**
	 * The East-most longitude point of the map.
	 */
	public east: number;

	/**
	 * The West-most longitude point of the map.
	 */
	public west: number;

	/**
	 * The South-most latitude point of the map.
	 */
	public south: number;

	/**
	 * The North-most latitude point of the map.
	 */
	public north: number;

	/**
	 * A ratio to be used when scaling the map shapes.
	 *
	 * @readonly
	 */
	public scaleRatio: number = 1;

	/**
	 * A screen point of the map's center.
	 *
	 * @readonly
	 */
	public centerPoint: IPoint;

	/**
	 * A screen point of the map's left.
	 *
	 * @readonly
	 */
	public westPoint: IPoint;

	/**
	 * A screen point of the map's right.
	 *
	 * @readonly
	 */
	public eastPoint: IPoint;

	/**
	 * A screen point of the map's top.
	 *
	 * @readonly
	 */
	public northPoint: IPoint;

	/**
	 * A screen point of the map's bottom.
	 *
	 * @readonly
	 */
	public southPoint: IPoint;

	/**
	 * Width of the actual map objects (px).
	 */
	public seriesWidth: number;

	/**
	 * Height of the actual map objects (px).
	 */
	public seriesHeight: number;

	/**
	 * Map data in GeoJSON format.
	 *
	 * @see {@link http://geojson.org/} GeoJSON official specification
	 */
	protected _geodata: Object;

	/**
	 * A reference to a [[ZoomControl]] instance.
	 */
	protected _zoomControl: ZoomControl;

	/**
	 * A reference to a [[SmallMap]] control instance.
	 */
	protected _smallMap: SmallMap;

	/**
	 * [_zoomGeoPoint description]
	 *
	 * @todo Description
	 */
	protected _zoomGeoPoint: IGeoPoint;

	/**
	 * Default duration of zoom animations (ms).
	 */
	public zoomDuration: number = 1000;

	/**
	 * Default zooming animation easing function.
	 */
	public zoomEasing: (value: number) => number = $ease.cubicOut;

	/**
	 * Smallest available zoom level. The map will not allow to zoom out past
	 * this setting.
	 *
	 * NOTE: Should be power of 2.
	 *
	 * @default 1
	 */
	public minZoomLevel: number = 1;

	/**
	 * Biggest available zoom level. The map will not allow to zoom in past
	 * this setting.
	 *
	 * NOTE: Should be power of 2.
	 *
	 * @default 32
	 */
	public maxZoomLevel: number = 32;

	/**
	 * [_prevZoomLevel description]
	 *
	 * @todo Description
	 */
	protected _prevZoomLevel: number;

	/**
	 * [_prevZoomGeoPoint description]
	 *
	 * @todo Description
	 */
	protected _prevZoomGeoPoint: IGeoPoint = { latitude: 0, longitude: 0 };

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: MapSeries;

	/**
	 * A reference to currently playing animation, e.g. zooming.
	 */
	protected _mapAnimation: Animation;

	protected _mouseWheelDisposer: IDisposer;

	protected _zoomGeoPointReal: IGeoPoint;

	protected _centerGeoPoint: IGeoPoint;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "MapChart";

		// Set default projection
		this.projection = new Projection();

		this.deltaLongitude = 0;
		this.maxPanOut = 0.7;
		this.homeZoomLevel = 1;
		this.zoomStep = 2;

		// Set padding
		this.padding(0, 0, 0, 0);

		// so that the map would render in a hidden div too
		this.minWidth = 10;
		this.minHeight = 10;

		this.events.once("inited", this.handleAllInited, this, false);

		// Create a container for map series
		let seriesContainer = this.seriesContainer;
		seriesContainer.draggable = true;
		seriesContainer.visible = false;
		seriesContainer.inert = true;
		seriesContainer.resizable = true;
		seriesContainer.events.on("transformed", this.handleMapTransform, this, false);
		seriesContainer.events.on("doublehit", this.handleDoubleHit, this, false);
		seriesContainer.events.on("drag", this.handleDrag, this, false);
		seriesContainer.zIndex = 0;
		seriesContainer.background.fillOpacity = 0;

		// Set up events
		//this.events.on("validated", this.updateExtremes, this);
		this.events.on("datavalidated", this.updateExtremes, this, false);

		// Set up main chart container, e.g. set backgrounds and events to monitor
		// size changes, etc.
		let chartContainer = this.chartContainer;
		chartContainer.parent = this;
		chartContainer.isMeasured = false;
		chartContainer.zIndex = -1;

		this._disposers.push(seriesContainer.events.on("maxsizechanged", () => {
			if (this.inited) {
				if (this._mapAnimation) {
					this._mapAnimation.stop();
				}
				this.updateScaleRatio();
				this.zoomToGeoPoint(this._zoomGeoPointReal, this.zoomLevel, true, 0);

				this.series.each((series) => {
					series.updateTooltipBounds();
				})
			}
		}, undefined, false));

		let chartContainerBg = chartContainer.background;
		chartContainerBg.fillOpacity = 0;
		chartContainerBg.events.on("down", (e) => { this.seriesContainer.dragStart(e.target.interactions.downPointers.getIndex(0)); }, this);
		chartContainerBg.events.on("up", (e) => { this.seriesContainer.dragStop() }, this);
		chartContainerBg.events.on("doublehit", this.handleDoubleHit, this);
		chartContainerBg.focusable = true;

		chartContainer.events.on("down", this.handleMapDown, this, false);

		// Add description to background
		this.background.fillOpacity = 0;
		this.background.readerTitle = this.language.translate("Use plus and minus keys on your keyboard to zoom in and out");

		// Add keyboard events for panning
		this._disposers.push(getInteraction().body.events.on("keyup", (ev) => {
			if (this.topParent.hasFocused && (!this._zoomControl || !this._zoomControl.thumb.isFocused)) {
				switch (keyboard.getEventKey(ev.event)) {
					case "up":
						this.pan({ x: 0, y: 0.1 });
						break;
					case "down":
						this.pan({ x: 0, y: -0.1 });
						break;
					case "left":
						this.pan({ x: 0.1, y: 0 });
						break;
					case "right":
						this.pan({ x: -0.1, y: 0 });
						break;
				}
			}
		}, this));

		this.mouseWheelBehavior = "zoom";

		// Apply theme
		this.applyTheme();

	}


	protected handleAllInited() {
		let inited = true;
		this.seriesContainer.visible = true;
		this.series.each((series) => {
			if (!series.inited) {
				inited = false;
			}
		})
		if (inited) {
			this.updateExtremes();
			this.goHome(0);
		}
		else {
			registry.events.once("exitframe", this.handleAllInited, this, false);
		}
	}

	/**
	 * Prevents map to be dragged out of the container area
	 * @ignore
	 */
	protected handleDrag() {
		// not good doing it with adapters.
		let ww = this.seriesWidth * this.zoomLevel * this.scaleRatio;
		let hh = this.seriesHeight * this.zoomLevel * this.scaleRatio;
		let x = this.seriesContainer.pixelX;
		let y = this.seriesContainer.pixelY;

		let maxPanOut = this.maxPanOut;

		let minX = Math.min(this.maxWidth * (1 - maxPanOut) - ww / 2, -ww * (maxPanOut - 0.5));
		if (x < minX) {
			x = minX;
		}

		let maxX = Math.max(this.maxWidth * maxPanOut + ww / 2, this.maxWidth + ww * (maxPanOut - 0.5));
		if (x > maxX) {
			x = maxX;
		}


		let minY = Math.min(this.maxHeight * (1 - maxPanOut) - hh / 2, -hh * (maxPanOut - 0.5));
		if (y < minY) {
			y = minY;
		}

		let maxY = Math.max(this.maxHeight * maxPanOut + hh / 2, this.maxHeight + hh * (maxPanOut - 0.5));
		if (y > maxY) {
			y = maxY;
		}

		this.seriesContainer.moveTo({ x: x, y: y }, undefined, undefined, true);

		this._zoomGeoPointReal = this.zoomGeoPoint;
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {

		super.applyInternalDefaults();

		// Add a default screen reader title for accessibility
		// This will be overridden in screen reader if there are any `titles` set
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Map");
		}

	}

	/**
	 * Handles event when a pointer presses down on the map, e.g. user presses
	 * down mouse or touches the map on a screen.
	 *
	 * Stops all animations currently going on.
	 */
	protected handleMapDown(): void {
		if (this._mapAnimation) {
			this._mapAnimation.stop();
		}
	}

	/**
	 * Handles the event when user doubleclicks or dooubletaps the map: zooms
	 * in on the reference point.
	 *
	 * @param event  Original event
	 */
	protected handleDoubleHit(event: AMEvent<Sprite, ISpriteEvents>["doublehit"]) {
		let svgPoint: IPoint = $utils.documentPointToSvg(event.point, this.htmlContainer, this.svgContainer.cssScale);
		let geoPoint: IGeoPoint = this.svgPointToGeo(svgPoint);
		this.zoomIn(geoPoint);
	}

	/**
	 * Handles mouse wheel event, e.g. user rotates mouse wheel while over the
	 * map: zooms in or out depending on the direction of the wheel turn.
	 *
	 * @param event  Original event
	 */
	protected handleWheel(event: AMEvent<Sprite, ISpriteEvents>["wheel"]) {

		let svgPoint: IPoint = $utils.documentPointToSvg(event.point, this.htmlContainer, this.svgContainer.cssScale);
		let geoPoint: IGeoPoint = this.svgPointToGeo(svgPoint);

		if (event.shift.y < 0) {
			this.zoomIn(geoPoint);
		}
		else {
			this.zoomOut(geoPoint);
		}
	}


	/**
	 * Specifies what should chart do if when mouse wheel is rotated.
	 *
	 * @param mouse wheel behavior
	 * @default zoomX
	 */
	public set mouseWheelBehavior(value: "zoom" | "none") {

		if (this.setPropertyValue("mouseWheelBehavior", value)) {
			if (value != "none") {
				this._mouseWheelDisposer = this.chartContainer.events.on("wheel", this.handleWheel, this, false);
				this._disposers.push(this._mouseWheelDisposer);
			}
			else {
				if (this._mouseWheelDisposer) {
					this._mouseWheelDisposer.dispose();
				}
				this.chartContainer.wheelable = false;
			}
		}
	}

	/**
	 * @return mouse wheel behavior
	 */
	public get mouseWheelBehavior(): "zoom" | "none" {
		return this.getPropertyValue("mouseWheelBehavior");
	}

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
	 * @param projection  Projection
	 */
	public set projection(projection: Projection) {
		projection.deltaLongitude = this.deltaLongitude;
		if (this.setPropertyValue("projection", projection)) {
			this.invalidateProjection();
		}
	}

	/**
	 * @return Projection
	 */
	public get projection(): Projection {
		return this.getPropertyValue("projection");
	}

	/**
	 * Calculates the longitudes and latitudes of the most distant points from
	 * the center in all four directions: West, East, North, and South.
	 *
	 * @ignore Exclude from docs
	 */
	public updateExtremes(): void {

		let pWest = this.west;
		let pEast = this.east;
		let pNorth = this.north;
		let pSouth = this.south;

		this.west = null;
		this.east = null;
		this.north = null;
		this.south = null;

		let chartContainer: Container = this.chartContainer;


		$iter.each(this.series.iterator(), (series) => {
			if ((this.west > series.west) || !$type.isNumber(this.west)) {
				this.west = series.west;
			}
			if ((this.east < series.east) || !$type.isNumber(this.east)) {
				this.east = series.east;
			}

			if ((this.north < series.north) || !$type.isNumber(this.north)) {
				this.north = series.north;
			}
			if ((this.south > series.south) || !$type.isNumber(this.south)) {
				this.south = series.south;
			}
		});
		if ($type.isNumber(this.east) && $type.isNumber(this.north)) {
			// must reset
			this.projection.centerPoint = { x: 0, y: 0 };
			this.projection.scale = 1;

			// temporary setting deltaLongitude to 0 in order to measure w/h correctly
			let deltaLongitude = this.projection.deltaLongitude;
			this.projection.deltaLongitude = 0;

			let northPoint: IPoint = this.projection.convert({ longitude: (this.east - this.west) / 2, latitude: this.north });
			let southPoint: IPoint = this.projection.convert({ longitude: (this.east - this.west) / 2, latitude: this.south });

			let westPoint: IPoint = this.projection.convert({ longitude: this.west, latitude: 0 });
			let eastPoint: IPoint = this.projection.convert({ longitude: this.east, latitude: 0 });

			this.projection.deltaLongitude = deltaLongitude;

			this.projection.centerPoint = { x: westPoint.x + (eastPoint.x - westPoint.x) / 2, y: northPoint.y + (southPoint.y - northPoint.y) / 2 };

			let scaleRatio: number;

			let seriesWidth = eastPoint.x - westPoint.x;
			let seriesHeight = southPoint.y - northPoint.y;

			let vScale: number = chartContainer.innerWidth / seriesWidth;
			let hScale: number = chartContainer.innerHeight / seriesHeight;

			if (vScale > hScale) {
				scaleRatio = hScale;
			} else {
				scaleRatio = vScale;
			}
			if ($type.isNaN(scaleRatio) || scaleRatio == Infinity) {
				scaleRatio = 1;
			}

			let projectionScaleChanged = false;
			if (this.projection.scale != scaleRatio) {
				this.projection.scale = scaleRatio;
				projectionScaleChanged = true;
			}

			this.seriesWidth = seriesWidth * scaleRatio;
			this.seriesHeight = seriesHeight * scaleRatio;

			let northPoint2: IPoint = this.projection.convert({ longitude: (this.east - this.west) / 2, latitude: this.north });
			let westPoint2: IPoint = this.projection.convert({ longitude: this.west - this.deltaLongitude, latitude: 0 });

			this._centerGeoPoint = this.projection.invert({ x: westPoint2.x + this.seriesWidth / 2, y: northPoint2.y + this.seriesHeight / 2 });

			//this.seriesContainer.width = this.seriesWidth; // not good, doesn't resize
			//this.seriesContainer.height = this.seriesHeight; // not good, doesn't resize
			this.seriesContainer.definedBBox = { x: westPoint2.x, y: northPoint2.y, width: this.seriesWidth, height: this.seriesHeight };

			this.updateScaleRatio();

			let seriesContainer: Container = this.seriesContainer;

			seriesContainer.x = chartContainer.pixelWidth / 2;
			seriesContainer.y = chartContainer.pixelHeight / 2;

			if (projectionScaleChanged || pWest != this.west || pEast != this.east || pNorth != this.north || pSouth != this.south) {
				$iter.each(this.series.iterator(), (series) => {
					series.invalidate();
				});
			}
		}
	}


	/**
	 * (Re)calculates a ratio which should be used to scale the actual map so
	 * that it fits perfectly into available space. Helps to avoid redrawing of all the map if container size changes
	 * @ignore
	 */
	protected updateScaleRatio(): void {
		let scaleRatio: number;

		let vScale: number = this.chartContainer.innerWidth / this.seriesWidth;
		let hScale: number = this.chartContainer.innerHeight / this.seriesHeight;

		if (vScale > hScale) {
			scaleRatio = hScale;
		} else {
			scaleRatio = vScale;
		}

		if ($type.isNaN(scaleRatio) || scaleRatio == Infinity) {
			scaleRatio = 1;
		}

		if (scaleRatio != this.scaleRatio) {
			this.scaleRatio = scaleRatio;

			$iter.each(this.series.iterator(), (series) => {
				series.scale = scaleRatio;
				series.updateTooltipBounds();
			});

			this.dispatch("scaleratiochanged");
		}
	}

	/**
	 * Converts a point within map container to geographical (lat/long)
	 * coordinates.
	 *
	 * @param point  Source point
	 * @return Geo-point
	 */
	public svgPointToGeo(point: IPoint): IGeoPoint {
		let series: MapSeries = <MapSeries>this.series.getIndex(0);
		if (series) {
			let seriesPoint: IPoint = $utils.svgPointToSprite(point, series);
			return this.seriesPointToGeo(seriesPoint);
		}
	}

	/**
	 * Converts geographical (lat/long) coordinates to an X/Y point within map's
	 * container.
	 *
	 * @param point  Source geo-point
	 * @return Point
	 */
	public geoPointToSVG(point: IGeoPoint): IPoint {
		let series: MapSeries = <MapSeries>this.series.getIndex(0);
		if (series) {
			let seriesPoint: IPoint = this.geoPointToSeries(point);
			return $utils.spritePointToSvg(seriesPoint, series);
		}
	}

	/**
	 * Converts a point (X/Y) within actual objects of the map to geographical
	 * (lat/long) coordinates.
	 *
	 * @param point  Source point
	 * @return Geo-point
	 */
	public seriesPointToGeo(point: IPoint): IGeoPoint {
		return this.projection.invert(point);
	}

	/**
	 * Converts geographical (lat/long) coordinates to an X/Y point within
	 * actual elements/objects of the maps.
	 *
	 * @param point  Source geo-point
	 * @return Point
	 */
	public geoPointToSeries(point: IGeoPoint): IPoint {
		return this.projection.convert(point);
	}

	/**
	 * Map data in GeoJSON format.
	 *
	 * The Map supports the following GeoJSON objects: `Point`, `LineString`,
	 * `Polygon`, `MultiPoint`, `MultiLineString`, and `MultiPolygon`.
	 *
	 * @see {@link http://geojson.org/} Official GeoJSON format specification
	 * @param geoJSON GeoJSON data
	 */
	public set geodata(geodata: Object) {
		if (geodata != this._geodata) {
			this._geodata = geodata;
			this.invalidateData();

			$iter.each(this._dataUsers.iterator(), (x) => {
				x.invalidateData();
			});
		}
	}

	/**
	 * @return GeoJSON data
	 */
	public get geodata(): Object {
		return this._geodata;
	}

	/**
	 * Zooms the map to particular zoom level and centers on a latitude/longitude
	 * coordinate.
	 *
	 * @param point      Center coordinate
	 * @param zoomLevel  Zoom level
	 * @param center     Center on the given coordinate?
	 * @param duration   Duration for zoom animation (ms)
	 * @return Zoom animation
	 */
	public zoomToGeoPoint(point: IGeoPoint, zoomLevel: number, center?: boolean, duration?: number): Animation {

		if (!point) {
			point = this.zoomGeoPoint;
		}

		if (!point) {
			return;
		}

		this._zoomGeoPointReal = point;

		zoomLevel = $math.fitToRange(zoomLevel, this.minZoomLevel, this.maxZoomLevel);

		let seriesPoint: IPoint = this.projection.convert(point);

		let svgPoint: IPoint = this.geoPointToSVG(point);
		let mapPoint = $utils.svgPointToSprite(svgPoint, this);

		if (center) {
			mapPoint = {
				x: this.maxWidth / 2,
				y: this.maxHeight / 2
			};
		}

		if (!$type.isNumber(duration)) {
			duration = this.zoomDuration;
		}

		this._mapAnimation = this.seriesContainer.animate(
			[{
				property: "scale",
				to: zoomLevel
			}, {
				property: "x",
				to: mapPoint.x - seriesPoint.x * zoomLevel * this.scaleRatio - this.pixelPaddingLeft
			}, {
				property: "y",
				to: mapPoint.y - seriesPoint.y * zoomLevel * this.scaleRatio - this.pixelPaddingTop
			}], duration, this.zoomEasing);

		this._disposers.push(this._mapAnimation.events.on("animationended", () => {
			this._zoomGeoPointReal = this.zoomGeoPoint;
		}))

		this.seriesContainer.validatePosition();

		return this._mapAnimation;
	}

	/**
	 * Zooms the map to a particular map object.
	 *
	 * @param mapObject  Target map object
	 * @param zoomLevel  Zoom level
	 * @param center     Center on the given coordinate?
	 * @param duration   Duration for zoom animation (ms)
	 * @return Zoom animation
	 */
	public zoomToMapObject(mapObject: MapObject, zoomLevel?: number, center?: boolean, duration?: number): Animation {

		if (center == undefined) {
			center = true;
		}

		if (mapObject instanceof MapImage) {
			if ($type.isNaN(zoomLevel)) {
				zoomLevel = 5;
			}
			return this.zoomToGeoPoint({ latitude: mapObject.latitude, longitude: mapObject.longitude }, zoomLevel, center, duration);
		}

		let dataItem = mapObject.dataItem;

		if (dataItem && $type.isNumber(dataItem.zoomLevel)) {
			zoomLevel = dataItem.zoomLevel;
		}

		if (mapObject instanceof MapPolygon) {
			let dataItem = mapObject.dataItem;
			let bbox = mapObject.polygon.bbox;

			if (!$type.isNumber(zoomLevel)) {
				zoomLevel = Math.min(this.seriesWidth / bbox.width, this.seriesHeight / bbox.height);
			}

			let geoPoint: IGeoPoint;

			if (dataItem && $type.hasValue(dataItem.zoomGeoPoint)) {
				geoPoint = dataItem.zoomGeoPoint;
			}
			else {
				// this is more accurate
				let polygonPoint = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
				let seriesPoint = $utils.spritePointToSprite(polygonPoint, mapObject.polygon, mapObject.series);

				geoPoint = this.seriesPointToGeo(seriesPoint);
			}
			return this.zoomToGeoPoint(geoPoint, zoomLevel, true, duration);
		}
	}

	/**
	 * Zooms the map to a particular viewport.
	 *
	 * The `north`, `east`, `south`, and `west` define boundaries of the
	 * imaginary viewort we want to zoom the map to.
	 *
	 * `level` is not actual zoom level. The map will determine the zoom level
	 * required to accommodated such zoom, and will adjust it by `level` if set.
	 *
	 * @param north     Latitude of the North-most boundary
	 * @param east      Longitude of the East-most boundary
	 * @param south     Latitude of the South-most boundary
	 * @param west      Longitude of the West-most boundary
	 * @param level     Adjust zoom level
	 * @param center    Center on the given coordinate?
	 * @param duration  Duration for zoom animation (ms)
	 * @return Zoom animation
	 */
	public zoomToRectangle(north: number, east: number, south: number, west: number, level?: number, center?: boolean, duration?: number): Animation {
		if ($type.isNaN(level)) {
			level = 1;
		}
		let zoomLevel = level * Math.min((this.south - this.north) / (south - north), (this.west - this.east) / (west - east));

		return this.zoomToGeoPoint({ latitude: north + (south - north) / 2, longitude: west + (east - west) / 2 }, zoomLevel, center, duration);
	}

	/**
	 * Zooms in the map, optionally centering on particular latitude/longitude
	 * point.
	 *
	 * @param geoPoint  Optional center point
	 * @param duration  Duration for zoom animation (ms)
	 * @return Zoom animation
	 */
	public zoomIn(geoPoint?: IGeoPoint, duration?: number): Animation {
		return this.zoomToGeoPoint(geoPoint, this.zoomLevel * this.zoomStep, false, duration);
	}

	/**
	 * Zooms out the map, optionally centering on particular latitude/longitude
	 * point.
	 *
	 * @param geoPoint  Optional center point
	 * @param duration  Duration for zoom animation (ms)
	 * @return Zoom animation
	 */
	public zoomOut(geoPoint?: IGeoPoint, duration?: number): Animation {
		return this.zoomToGeoPoint(geoPoint, this.zoomLevel / this.zoomStep, false, duration);
	}

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
	 * @param shift     Vertical and horizontal shift
	 * @param duration  Pan animation duration (ms)
	 */
	public pan(shift: IPoint, duration?: number): void {
		let point = this.geoPointToSVG(this.zoomGeoPoint);
		point.x += this.pixelWidth * shift.x;
		point.y += this.pixelHeight * shift.y;
		this.zoomToGeoPoint(this.svgPointToGeo(point), this.zoomLevel, true, duration);
	}

	/**
	 * Current lat/long coordinates for the center of the viewport. (default
	 * zoom reference point)
	 *
	 * @readonly
	 * @return Coordinates
	 */
	public get zoomGeoPoint(): IGeoPoint {
		var point = $utils.spritePointToSvg({ x: this.pixelWidth / 2, y: this.pixelHeight / 2 }, this);
		return this.svgPointToGeo(point);
	}

	/**
	 * Current zoom level.
	 *
	 * @readonly
	 * @return Zoom level
	 */
	public get zoomLevel(): number {
		return this.seriesContainer.scale;
	}

	public set zoomLevel(value: number) {
		this.seriesContainer.scale = value;
	}

	/**
	 * Dispatches events after some map transformation, like pan or zoom.
	 */
	protected handleMapTransform(): void {
		if (this.zoomLevel != this._prevZoomLevel) {
			this.dispatch("zoomlevelchanged");
			this._prevZoomLevel = this.zoomLevel;
		}

		if (this.zoomGeoPoint && (this._prevZoomGeoPoint.latitude != this.zoomGeoPoint.latitude || this._prevZoomGeoPoint.longitude != this.zoomGeoPoint.longitude)) {
			this.dispatch("mappositionchanged");
		}
	}

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
	 * @param smallMap  Small map
	 */
	public set smallMap(smallMap: SmallMap) {
		if (this._smallMap) {
			this.removeDispose(this._smallMap);
		}
		this._smallMap = smallMap;
		this._smallMap.chart = this;
		smallMap.parent = this.chartContainer;
	}

	/**
	 * @return Small map
	 */
	public get smallMap(): SmallMap {
		if (!this._smallMap) {
			let smallMap: SmallMap = new SmallMap();
			this.smallMap = smallMap;
		}
		return this._smallMap;
	}

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
	 * @param zoomControl  Zoom control
	 */
	public set zoomControl(zoomControl: ZoomControl) {
		if (this._zoomControl) {
			this.removeDispose(this._zoomControl);
		}
		this._zoomControl = zoomControl;
		zoomControl.chart = this;
		zoomControl.parent = this.chartContainer;
	}

	/**
	 * @return Zoom control
	 */
	public get zoomControl(): ZoomControl {
		return this._zoomControl;
	}

	/**
	 * Creates and returns a map series of appropriate type.
	 *
	 * @return Map series
	 */
	protected createSeries(): this["_seriesType"] {
		return new MapSeries();
	}


	/**
	 * Degrees to shift map center by.
	 *
	 * E.g. if set to -160, the longitude 20 will become a new center, creating
	 * a Pacific-centered map.
	 *
	 * @param value  Map center shift
	 */
	public set deltaLongitude(value: number) {
		if (this.setPropertyValue("deltaLongitude", $geo.wrapAngleTo180(value))) {
			this.invalidateProjection();
		}
	}

	/**
	 * @return Map center shift
	 */
	public get deltaLongitude(): number {
		return this.getPropertyValue("deltaLongitude");
	}

	/**
	 * Maximum portion of the map's width/height to allow panning "off screen".
	 *
	 * A value of 0 (zero) will prevent any portion of the the map to be panned
	 * outside the viewport.
	 *
	 * 0.5 will allow half of the map to be outside viewable area.
	 *
	 * @default 0.7
	 * @param value  Max pan out
	 */
	public set maxPanOut(value: number) {
		this.setPropertyValue("maxPanOut", value);
	}

	/**
	 * @return Max pan out
	 */
	public get maxPanOut(): number {
		return this.getPropertyValue("maxPanOut");
	}

	/**
	 * The geographical point to center map on when it is first loaded.
	 *
	 * The map will also be centered to this point when you call `goHome()`
	 * method.
	 *
	 * @param value  Home geo point
	 */
	public set homeGeoPoint(value: IGeoPoint) {
		this.setPropertyValue("homeGeoPoint", value);
	}

	/**
	 * @return Home geo point
	 */
	public get homeGeoPoint(): IGeoPoint {
		return this.getPropertyValue("homeGeoPoint");
	}

	/**
	 * The zoom level to put the map in when it is first loaded.
	 *
	 * The map will also be set to this zoom level when you call `goHome()`
	 * method.
	 *
	 * @param value  Home zoom level
	 */
	public set homeZoomLevel(value: number) {
		this.setPropertyValue("homeZoomLevel", value);
	}

	/**
	 * @return Home zoom level
	 */
	public get homeZoomLevel(): number {
		return this.getPropertyValue("homeZoomLevel");
	}

	/**
	 * When user zooms in or out current zoom level is multiplied or divided
	 * by value of this setting.
	 *
	 * @default 2
	 * @param value  Zoom factor
	 */
	public set zoomStep(value: number) {
		this.setPropertyValue("zoomStep", value);
	}

	/**
	 * @return Zoom factor
	 */
	public get zoomStep(): number {
		return this.getPropertyValue("zoomStep");
	}

	/**
	 * Invalidates projection, causing all series to be redrawn.
	 */
	protected invalidateProjection() {
		this.updateExtremes();
		//		this.projection.deltaLatitude = this.deltaLatitude;
		this.projection.deltaLongitude = this.deltaLongitude;

		$iter.each(this.series.iterator(), (series) => {
			series.invalidate();
		})
	}

	/**
	 * Sets a [[DataSource]] to be used for loading Component's data.
	 *
	 * @param value Data source
	 */
	public set geodataSource(value: DataSource) {
		if (this._dataSources["geodata"]) {
			this.removeDispose(this._dataSources["geodata"]);
		}
		this._dataSources["geodata"] = value;
		this._dataSources["geodata"].component = this;
		this.events.on("inited", () => {
			this.loadData("geodata")
		}, this, false);
		this.setDataSourceEvents(value, "geodata");
	}

	/**
	 * Returns a [[DataSource]] specifically for loading Component's data.
	 *
	 * @return Data source
	 */
	public get geodataSource(): DataSource {
		if (!this._dataSources["geodata"]) {
			this.getDataSource("geodata");
		}
		return this._dataSources["geodata"];
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if ($type.hasValue(config["geodata"]) && $type.isString(config["geodata"])) {
			const name = config["geodata"];
			// Check if there's a map loaded by such name
			if ($type.hasValue((<any>window)["am4geodata_" + config["geodata"]])) {
				config["geodata"] = (<any>window)["am4geodata_" + config["geodata"]];
			}
			// Nope. Let's try maybe we got JSON as string?
			else {
				try {
					config["geodata"] = JSON.parse(config["geodata"]);
				}
				catch (e) {
					// No go again. Error out.
					throw Error("MapChart error: Geodata `" + name + "` is not loaded or is incorrect.");
				}
			}
		}

		// Instantiate projection
		if ($type.hasValue(config["projection"]) && $type.isString(config["projection"])) {
			config["projection"] = this.createClassInstance(config["projection"]);
		}

		// Set up small map
		if ($type.hasValue(config.smallMap) && !$type.hasValue(config.smallMap.type)) {
			config.smallMap.type = "SmallMap";
		}

		// Set up zoom control
		if ($type.hasValue(config.zoomControl) && !$type.hasValue(config.zoomControl.type)) {
			config.zoomControl.type = "ZoomControl";
		}

		super.processConfig(config);

	}

	/**
 * This function is used to sort element's JSON config properties, so that
 * some properties that absolutely need to be processed last, can be put at
 * the end.
 *
 * @ignore Exclude from docs
 * @param a  Element 1
 * @param b  Element 2
 * @return Sorting number
 */
	protected configOrder(a: string, b: string): Ordering {
		if (a == b) {
			return 0;
		}
		// Must come last
		else if (a == "smallMap") {
			return 1;
		}
		else if (b == "smallMap") {
			return -1;
		}
		else if (a == "series") {
			return 1;
		}
		else if (b == "series") {
			return -1;
		}
		else {
			return super.configOrder(a, b);
		}
	}

	/**
	 * Adds `projection` to "as is" fields.
	 *
	 * @param field  Field name
	 * @return Assign as is?
	 */
	protected asIs(field: string): boolean {
		return field == "projection" || super.asIs(field);
	}

	/**
	 * Geo point of map center
	 *
	 * @readonly
	 */
	public get centerGeoPoint(): IGeoPoint {
		return this._centerGeoPoint;
	}


	/**
	 * Resets the map to its original position and zoom level.
	 */
	public goHome(duration?: number) {
		let homeGeoPoint = this.homeGeoPoint;
		if (!homeGeoPoint) {
			homeGeoPoint = this.centerGeoPoint;
		}
		if (homeGeoPoint) {
			this.zoomToGeoPoint(homeGeoPoint, this.homeZoomLevel, true, duration);
		}
	}


	/**
	 * Sets [[Paper]] instance to use to draw elements.
	 * @ignore
	 * @param paper Paper
	 * @return true if paper was changed, false, if it's the same
	 */
	public setPaper(paper: Paper): boolean {
		if (this.svgContainer) {
			this.svgContainer.hideOverflow = true;
		}

		return super.setPaper(paper);
	}

	/**
	 * Prepares the legend instance for use in this chart.
	 *
	 * @param legend  Legend
	 */
	protected setLegend(legend: Legend) {
		super.setLegend(legend);
		if (legend) {
			legend.parent = this.chartContainer;
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapChart"] = MapChart;
