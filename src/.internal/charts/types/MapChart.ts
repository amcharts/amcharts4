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
import { IDisposer, Disposer } from "../../core/utils/Disposer";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { MapSeries } from "../map/MapSeries";
import { MapObject } from "../map/MapObject";
import { MapImage } from "../map/MapImage";
import { MapPolygon } from "../map/MapPolygon";
import { MapPolygonSeries } from "../map/MapPolygonSeries";
import { IPoint } from "../../core/defs/IPoint";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { DataSource } from "../../core/data/DataSource";
import { Projection } from "../map/projections/Projection";
import { ZoomControl } from "../map/ZoomControl";
import { Ordering } from "../../core/utils/Order";
import { Circle } from "../../core/elements/Circle";
import { SmallMap } from "../map/SmallMap";
import * as $mapUtils from "../map/MapUtils";
import { Animation } from "../../core/utils/Animation";
import { keyboard } from "../../core/utils/Keyboard";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $ease from "../../core/utils/Ease";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $geo from "../map/Geo";
import { Paper } from "../../core/rendering/Paper";
import { IListEvents } from "../../core/utils/List";
import { GraticuleSeries } from "../map/GraticuleSeries";
import { getInteraction, IInteractionEvents } from "../../core/interaction/Interaction";
import { Legend } from "../Legend";

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
	polygon?: Array<Array<[number, number]>>;

	/**
	 * Multi-part polygon information in X/Y coordinates.
	 */
	multiPolygon?: Array<Array<Array<[number, number]>>>;

	/**
	 * Single polygon information in lat/long geo-coordinates.
	 */
	geoPolygon?: Array<Array<IGeoPoint>>;

	/**
	 * Multi-part polygon information in lat/long geo-coordinates.
	 */
	multiGeoPolygon?: Array<Array<Array<IGeoPoint>>>;

	/**
	 * flag indicating whether this data item was created from geo data
	 */
	madeFromGeoData?: boolean;
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
	line?: Array<[number, number]>;

	/**
	 * Multi-part line information in X/Y coordinates.
	 */
	multiLine?: Array<Array<[number, number]>>;

	/**
	 * Single line information in lat/long geo-coordinates.
	 */
	geoLine?: Array<IGeoPoint>;

	/**
	 * Multi-part line information in lat/long geo-coordinates.
	 */
	multiGeoLine?: Array<Array<IGeoPoint>>;

	/**
	 * flag indicating whether this data item was created from geo data
	 */
	madeFromGeoData?: boolean;

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
	point?: [number, number];

	/**
	 * Multi-image position information in X/Y coordinates.
	 */
	multiPoint?: Array<[number, number]>;

	/**
	 * Image position information in lat/long geo-coordinates.
	 */
	geoPoint?: IGeoPoint;

	/**
	 * Multi-image position information in lat/long geo-coordinates.
	 */
	multiGeoPoint?: Array<IGeoPoint>;


	/**
	 * flag indicating whether this data item was created from geo data
	 */
	madeFromGeoData?: boolean;
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
	 * Degrees to rotate the map around vertical axis (Y).
	 *
	 * E.g. if set to -160, the longitude 20 will become a new center, creating
	 * a Pacific-centered map.
	 */
	deltaLongitude?: number;

	/**
	 * Degrees to rotate the map around horizontal axis (X).
	 *
	 * E.g. setting this to -90 will put Antarctica directly in the center of
	 * the map.
	 *
	 * @since 4.3.0
	 */
	deltaLatitude?: number;

	/**
	 * Degrees to rotate the map around horizontal "Z" - an axis that goes from
	 * the center of the globe directly to the viewer.
	 *
	 * @since 4.3.0
	 */
	deltaGamma?: number;

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

	/**
	 * What "dragging" map does.
	 *
	 * Available values:
	 * * `"move"` (default): changes position of the map.
	 * * `"rotateLat"`: changes `deltaLatitude` (rotates the globe vertically).
	 * * `"rotateLong"`: changes `deltaLongitude` (rotates the globe horizontally).
	 * * `"rotateLongLat"`: changes both `deltaLongitude` and `deltaLatitude` (rotates the globe in any direction).
	 *
	 * @default "move"
	 * @since 4.3.0
	 */
	panBehavior?: "move" | "rotateLat" | "rotateLong" | "rotateLongLat";


	/**
	 * Specifies if the map should be centered when zooming out
	 * @default true
	 * @since 4.7.12
	 */	
	centerMapOnZoomOut?: boolean;
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
	 * @ignore
	 */
	public seriesMaxLeft: number;

	/**
	 * @ignore
	 */
	public seriesMaxRight: number;

	/**
	 * @ignore
	 */
	public seriesMaxTop: number;

	/**
	 * @ignore
	 */
	public seriesMaxBottom: number;

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
	 * Names of geodata items, such as countries, to replace by from loaded
	 * geodata.
	 *
	 * Can be used to override built-in English names for countries.
	 *
	 * ```TypeScript
	 * import am4geodata_lang_ES from '@amcharts4-geodata/lang/es';
	 * // ...
	 * map.geodataNames = am4geodata_lang_ES;
	 * ```
	 * ```JavaScript
	 * map.geodataNames = am4geodata_lang_ES;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "geodataNames": am4geodata_lang_ES
	 * }
	 * ```
	 *
	 * @since 4.7.4
	 */
	public geodataNames: { [index: string]: string };

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

	/**
	 * @ignore
	 */
	protected _mouseWheelDisposer: IDisposer;

	/**
	 * @ignore
	 */
	protected _zoomGeoPointReal: IGeoPoint;

	/**
	 * @ignore
	 */
	protected _centerGeoPoint: IGeoPoint;

	/**
	 * @ignore
	 */
	protected _fitWidth: number;

	/**
	 * @ignore
	 */
	protected _fitHeight: number;

	/**
	 * @ignore
	 */

	public panSprite: Circle;

	/**
	 * @ignore
	 */
	protected _downPointOrig: IPoint;

	/**
	 * @ignore
	 */
	protected _downDeltaLongitude: number;

	/**
	 * @ignore
	 */
	protected _downDeltaLatitude: number;

	/**
	 * @ignore
	 */
	protected _backgroundSeries: MapPolygonSeries;


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
		this.deltaLatitude = 0;
		this.deltaGamma = 0;
		this.maxPanOut = 0.7;
		this.homeZoomLevel = 1;
		this.zoomStep = 2;
		this.layout = "absolute";

		this.centerMapOnZoomOut = true;

		// Set padding
		this.padding(0, 0, 0, 0);

		$utils.used(this.backgroundSeries);

		// so that the map would render in a hidden div too
		this.minWidth = 10;
		this.minHeight = 10;

		this.events.once("inited", this.handleAllInited, this, false);

		// Create a container for map series
		let seriesContainer = this.seriesContainer;
		seriesContainer.visible = false;
		seriesContainer.inert = true;
		seriesContainer.resizable = true;
		seriesContainer.events.on("transformed", this.handleMapTransform, this, false);
		seriesContainer.events.on("doublehit", this.handleDoubleHit, this, false);
		seriesContainer.events.on("dragged", this.handleDrag, this, false);
		seriesContainer.zIndex = 0;
		seriesContainer.dragWhileResize = true;
		//seriesContainer.background.fillOpacity = 0;

		// Set up events
		//this.events.on("validated", this.updateExtremes, this);
		//this.events.on("datavalidated", this.handleAllValidated, this, false);
		//this.events.on("datavalidated", this.updateExtremes, this, false);

		// Set up main chart container, e.g. set backgrounds and events to monitor
		// size changes, etc.
		let chartContainer = this.chartContainer;
		chartContainer.parent = this;
		chartContainer.zIndex = -1;

		this._disposers.push(this.events.on("maxsizechanged", () => {
			if (this.inited) {
				if (this._mapAnimation) {
					this._mapAnimation.stop();
				}

				let allInited = true;
				this.series.each((series) => {
					series.updateTooltipBounds();
					if (!series.inited || series.dataInvalid) {
						allInited = false;
					}
				})
				if (allInited) {
					this.updateScaleRatio();
				}
				this.zoomToGeoPoint(this._zoomGeoPointReal, this.zoomLevel, true, 0);
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

		const interaction = getInteraction();
		this._disposers.push(interaction.body.events.on("down", this.handlePanDown, this));
		this._disposers.push(interaction.body.events.on("up", this.handlePanUp, this));
		//this._disposers.push(interaction.body.events.on("track", this.handlePanMove, this));

		let panSprite = this.seriesContainer.createChild(Circle);
		panSprite.radius = 10;
		panSprite.inert = true;
		panSprite.isMeasured = false;
		panSprite.events.on("transformed", this.handlePanMove, this, false);
		panSprite.interactionsEnabled = false;
		panSprite.opacity = 0;
		panSprite.x = 0;
		panSprite.y = 0;
		this.panSprite = panSprite;
		this.panBehavior = "move";
		/*
				this.panSprite.inertiaOptions.setKey("move", {
					"time": 100,
					"duration": 1000,
					"factor": 3,
					"easing": $ease.sinOut
				});*/

		// Apply theme
		this.applyTheme();

	}

	/**
	 * @ignore
	 */
	protected handlePanDown(event: IInteractionEvents["down"]): void {
		let svgPoint = $utils.documentPointToSvg(event.pointer.point, this.htmlContainer);
		if (svgPoint.x > 0 && svgPoint.y > 0 && svgPoint.x < this.svgContainer.width && svgPoint.y < this.svgContainer.height) {
			// Get local point
			this._downPointOrig = $utils.documentPointToSprite(event.pointer.point, this.seriesContainer);

			this.panSprite.moveTo(this._downPointOrig);
			this.panSprite.dragStart(event.pointer);
			this._downDeltaLongitude = this.deltaLongitude;
			this._downDeltaLatitude = this.deltaLatitude;
		}
	}

	/**
	 * @ignore
	 */
	protected handlePanUp(event: IInteractionEvents["down"]): void {
		if (this._downPointOrig) {
			this.panSprite.dragStop(event.pointer);
		}
		this._downPointOrig = undefined;
	}

	/**
	 * @ignore
	 */
	protected handlePanMove(): void {

		if (!this.seriesContainer.isResized) {

			let d3Projection = this.projection.d3Projection;

			let panBehavior = this.panBehavior;

			if (panBehavior != "move" && panBehavior != "none" && this._downPointOrig && d3Projection.rotate) {

				let rotation = d3Projection.rotate();

				let dln = rotation[0];
				let dlt = rotation[1];
				let dlg = rotation[2];

				d3Projection.rotate([0, 0, 0]);

				let downGeoLocal = this.projection.invert(this._downPointOrig);

				let local: IPoint = { x: this.panSprite.pixelX, y: this.panSprite.pixelY };
				let geoLocal: IGeoPoint;
				if (local) {
					geoLocal = this.projection.invert(local);
				}

				d3Projection.rotate([dln, dlt, dlg]);
				if (geoLocal) {
					if (panBehavior == "rotateLat" || panBehavior == "rotateLongLat") {
						this.deltaLatitude = this._downDeltaLatitude + geoLocal.latitude - downGeoLocal.latitude;
					}

					if (panBehavior == "rotateLong" || panBehavior == "rotateLongLat") {
						this.deltaLongitude = this._downDeltaLongitude + geoLocal.longitude - downGeoLocal.longitude;
					}
				}
			}
		}
	}

	/**
	 * @ignore
	 */
	protected handleAllInited() {
		let inited = true;
		this.seriesContainer.visible = true;
		this.series.each((series) => {
			if (!series.inited || series.dataInvalid) {
				inited = false;
			}
		})
		if (inited) {
			this.updateCenterGeoPoint();
			this.updateScaleRatio();
			this.goHome(0);
		}
		else {
			// TODO verify that this is correct
			const disposer = registry.events.once("exitframe", () => {
				this.removeDispose(disposer);
				this.handleAllInited();
			}, this, false);

			this.addDisposer(disposer);
		}
	}

	/**
	 * @ignore
	 */
	protected updateZoomGeoPoint() {
		let seriesPoint = $utils.svgPointToSprite({ x: this.innerWidth / 2 + this.pixelPaddingLeft, y: this.innerHeight / 2 + this.pixelPaddingTop }, this.series.getIndex(0));
		let geoPoint = this.projection.invert(seriesPoint);
		this._zoomGeoPointReal = geoPoint;
	}

	/**
	 * @ignore
	 */
	protected updateCenterGeoPoint() {
		let maxLeft: number;
		let maxRight: number;
		let maxTop: number;
		let maxBottom: number;


		if (this.backgroundSeries) {
			let features = this.backgroundSeries.getFeatures();
			if (features.length > 0) {
				let bounds = this.projection.d3Path.bounds(<any>features[0].geometry);
				maxLeft = bounds[0][0];
				maxTop = bounds[0][1];
				maxRight = bounds[1][0];
				maxBottom = bounds[1][1];
			}
		}
		else {
			this.series.each((series) => {
				let bbox = series.group.node.getBBox();
				if (maxLeft > bbox.x || !$type.isNumber(maxLeft)) {
					maxLeft = bbox.x;
				}
				if (maxRight < bbox.x + bbox.width || !$type.isNumber(maxRight)) {
					maxRight = bbox.x + bbox.width;
				}
				if (maxTop > bbox.y || !$type.isNumber(maxTop)) {
					maxTop = bbox.y;
				}
				if (maxBottom < bbox.y + bbox.height || !$type.isNumber(maxBottom)) {
					maxBottom = bbox.y + bbox.height;
				}
			})
		}

		this.seriesMaxLeft = maxLeft;
		this.seriesMaxRight = maxRight;
		this.seriesMaxTop = maxTop;
		this.seriesMaxBottom = maxBottom;

		this.seriesWidth = maxRight - maxLeft;
		this.seriesHeight = maxBottom - maxTop;

		if (this.seriesWidth > 0 && this.seriesHeight > 0) {
			this.chartContainer.visible = true;
			this._centerGeoPoint = this.projection.invert({ x: maxLeft + (maxRight - maxLeft) / 2, y: maxTop + (maxBottom - maxTop) / 2 });

			if (!this._zoomGeoPointReal || !$type.isNumber(this._zoomGeoPointReal.latitude)) {
				this._zoomGeoPointReal = this._centerGeoPoint;
			}
		}
		else {
			this.chartContainer.visible = false;
		}

	}

	/**
	 * Prevents map to be dragged out of the container area
	 * @ignore
	 */
	protected handleDrag() {
		let d = this.zoomLevel * this.scaleRatio;

		let ww = this.seriesWidth * d;
		let hh = this.seriesHeight * d;

		let seriesContainer = this.seriesContainer;
		let maxLeft = this.seriesMaxLeft * d;
		let maxRight = this.seriesMaxRight * d;
		let maxTop = this.seriesMaxTop * d;
		let maxBottom = this.seriesMaxBottom * d;

		let x = seriesContainer.pixelX;
		let y = seriesContainer.pixelY;

		let maxPanOut = this.maxPanOut;

		let minX = Math.min(this.maxWidth * (1 - maxPanOut) - ww - maxLeft, -maxLeft);
		if (x < minX) {
			x = minX;
		}

		let maxX = Math.max(this.maxWidth * maxPanOut - maxLeft, this.maxWidth - maxRight);
		if (x > maxX) {
			x = maxX;
		}

		let minY = Math.min(this.maxHeight * (1 - maxPanOut) - hh - maxTop, -maxTop)
		if (y < minY) {
			y = minY;
		}

		let maxY = Math.max(this.maxHeight * maxPanOut - maxTop, this.maxHeight - maxBottom);
		if (y > maxY) {
			y = maxY;
		}

		seriesContainer.moveTo({ x: x, y: y }, undefined, undefined, true);

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

		// Cancel any move inertia if there is one
		const inertia = this.seriesContainer.interactions.inertias.getKey("move");
		if (inertia) {
			inertia.done();
		}

		let svgPoint: IPoint = $utils.documentPointToSvg(event.point, this.htmlContainer, this.svgContainer.cssScale);
		let geoPoint: IGeoPoint = this.svgPointToGeo(svgPoint);

		if (event.shift.y < 0) {
			this.zoomIn(geoPoint, undefined, this.interactions.mouseOptions.sensitivity);
		}
		else {
			this.zoomOut(geoPoint, undefined, this.interactions.mouseOptions.sensitivity);
		}
	}


	/**
	 * Specifies what should chart do if when mouse wheel is rotated.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/reference/sprite/#mouseOptions_property} More information about `mouseOptions`
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
	 * What "dragging" map does.
	 *
	 * Available values:
	 * * `"move"` (default): changes position of the map.
	 * * `"rotateLat"`: changes `deltaLatitude` (rotates the globe vertically).
	 * * `"rotateLong"`: changes `deltaLongitude` (rotates the globe horizontally).
	 * * `"rotateLongLat"`: changes both `deltaLongitude` and `deltaLatitude` (rotates the globe in any direction).
	 *
	 * @default "move"
	 * @since 4.3.0
	 * @param  value  Behavior
	 */
	public set panBehavior(value: "none" | "move" | "rotateLat" | "rotateLong" | "rotateLongLat") {
		if (this.setPropertyValue("panBehavior", value)) {
			let seriesContainer = this.seriesContainer;
			this.panSprite.draggable = false;
			seriesContainer.draggable = false;

			switch (value) {
				case "move":
					seriesContainer.draggable = true;
					break;
				default:
					this.panSprite.draggable = true;
					break;
			}
		}
	}

	/**
	 * @returns If the map should be centered when zooming out.
	 */	
	public get centerMapOnZoomOut(): boolean {
		return this.getPropertyValue("centerMapOnZoomOut");
	}

	/**
	 * Specifies if the map should be centered when zooming out
	 * @default true
	 * @since 4.7.12
	 */	
	public set centerMapOnZoomOut(value: boolean) {
		this.setPropertyValue("centerMapOnZoomOut", value);
	}

	/**
	 * @returns Behavior
	 */
	public get panBehavior(): "none" | "move" | "rotateLat" | "rotateLong" | "rotateLongLat" {
		return this.getPropertyValue("panBehavior");
	}	

	/**
	 * Projection to use for the map.
	 *
	 * Available projections:
	 * * Albers
	 * * AlbersUSA
	 * * AzimuthalEqualArea
	 * * Eckert6
	 * * EqualEarth
	 * * Mercator
	 * * Miller
	 * * NaturalEarth
	 * * Orthographic
	 * * Stereographic
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
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/map/#Setting_projection} More about projections
	 * @param projection  Projection
	 */
	public set projection(projection: Projection) {
		if (this.setPropertyValue("projection", projection)) {
			this.invalidateProjection();

			projection.chart = this;

			if (this._backgroundSeries) {
				this._backgroundSeries.invalidate();
			}

			this.series.each((series) => {
				series.events.once("validated", () => {
					this.updateCenterGeoPoint();
					this.updateScaleRatio();
					this.goHome(0);
				});
			})
		}
	}

	/**
	 * @return Projection
	 */
	public get projection(): Projection {
		return this.getPropertyValue("projection");
	}

	/**
	 * Validates (processes) data items.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataItems() {
		super.validateDataItems();
		this.updateExtremes();
	}


	/**
	 * Calculates the longitudes and latitudes of the most distant points from
	 * the center in all four directions: West, East, North, and South.
	 *
	 * @ignore Exclude from docs
	 */
	public updateExtremes(): void {

		let east: number;
		let north: number;
		let west: number;
		let south: number;

		this.series.each((series) => {
			if (series.ignoreBounds || (series instanceof GraticuleSeries && series.fitExtent)) {
			}
			else {
				if (series.north > north || !$type.isNumber(north)) {
					north = series.north;
				}

				if (series.south < south || !$type.isNumber(south)) {
					south = series.south;
				}

				if (series.west < west || !$type.isNumber(west)) {
					west = series.west;
				}

				if (series.east > east || !$type.isNumber(east)) {
					east = series.east;
				}
			}
		})

		let features: any[] = [];
		let foundGraticule = false;
		// if we gave graticule, get features of these series only for faster fitSize
		this.series.each((series) => {
			if (series instanceof GraticuleSeries && !series.fitExtent) {
				features = series.getFeatures();
				foundGraticule = true;
			}
		})

		if (!foundGraticule) {
			this.series.each((series) => {
				if (series.ignoreBounds || (series instanceof GraticuleSeries && series.fitExtent)) {
				}
				else {
					features = features.concat(series.getFeatures());
				}
			})
		}

		let w = $math.max(50, this.innerWidth);
		let h = $math.max(50, this.innerHeight);

		let d3Projection = this.projection.d3Projection;

		if (features.length > 0 && d3Projection && (this.east != east || this.west != west || this.north != north || this.south != south)) {
			this.east = east;
			this.west = west;
			this.north = north;
			this.south = south;
			if (d3Projection.rotate) {
				let rotation = d3Projection.rotate();
				let deltaLong = rotation[0];
				let deltaLat = rotation[1];
				let deltaGamma = rotation[2];

				this.deltaLongitude = deltaLong;
				this.deltaLatitude = deltaLat;
				this.deltaGamma = deltaGamma;
			}

			let geoJSON = { "type": "FeatureCollection", features: features };

			let initialScale = d3Projection.scale();

			d3Projection.fitSize([w, h], <any>geoJSON);

			if (d3Projection.scale() != initialScale) {
				this.invalidateDataUsers();
			}

			this.series.each((series) => {
				if (series instanceof GraticuleSeries) {
					series.invalidateData();
				}
			})

			if (this._backgroundSeries) {
				let polygon = this._backgroundSeries.mapPolygons.getIndex(0);
				if (polygon) {
					polygon.multiPolygon = $mapUtils.getBackground(this.north, this.east, this.south, this.west);
				}
			}

			this._fitWidth = w;
			this._fitHeight = h;
		}

		if (!this._zoomGeoPointReal || !$type.isNumber(this._zoomGeoPointReal.latitude)) {
			this.goHome(0);
		}
	}


	/**
	 * (Re)calculates a ratio which should be used to scale the actual map so
	 * that it fits perfectly into available space. Helps to avoid redrawing of all the map if container size changes
	 * @ignore
	 */
	protected updateScaleRatio(): void {
		let scaleRatio: number;

		this.updateCenterGeoPoint();

		let hScale: number = this.innerWidth / this.seriesWidth;
		let vScale: number = this.innerHeight / this.seriesHeight;

		scaleRatio = $math.min(hScale, vScale);

		if ($type.isNaN(scaleRatio) || scaleRatio == Infinity) {
			scaleRatio = 1;
		}

		if (scaleRatio != this.scaleRatio) {
			this.scaleRatio = scaleRatio;

			$iter.each(this.series.iterator(), (series) => {
				series.scale = scaleRatio;
				series.updateTooltipBounds();
			});

			this.backgroundSeries.scale = scaleRatio;

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

			this.dataUsers.each((dataUser) => {
				for (let i = dataUser.data.length - 1; i >= 0; i--) {
					if (dataUser.data[i].madeFromGeoData == true) {
						dataUser.data.splice(i, 1);
					}
				}
				dataUser.disposeData();
				dataUser.invalidateData();
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
	public zoomToGeoPoint(point: IGeoPoint, zoomLevel: number, center?: boolean, duration?: number, mapObject?:boolean): Animation {
		if (!point) {
			point = this.zoomGeoPoint;
		}

		if (!point || !$type.isNumber(point.longitude) || !$type.isNumber(point.latitude)) {
			return;
		}

		this._zoomGeoPointReal = point;

		zoomLevel = $math.fitToRange(zoomLevel, this.minZoomLevel, this.maxZoomLevel);

		let seriesPoint: IPoint = this.projection.convert(point);
		if (seriesPoint) {

			let svgPoint: IPoint = this.geoPointToSVG(point);

			let mapPoint = $utils.svgPointToSprite(svgPoint, this);

			if (center) {
				mapPoint = {
					x: this.innerWidth / 2,
					y: this.innerHeight / 2
				};
			}

			if (!$type.isNumber(duration)) {
				duration = this.zoomDuration;
			}

			let x = mapPoint.x - seriesPoint.x * zoomLevel * this.scaleRatio;
			let y = mapPoint.y - seriesPoint.y * zoomLevel * this.scaleRatio;


			if (!mapObject && zoomLevel < this.zoomLevel && this.centerMapOnZoomOut && zoomLevel < 1.5) {
				x = this.innerWidth / 2 - (this.seriesMaxLeft + (this.seriesMaxRight - this.seriesMaxLeft) / 2) * zoomLevel * this.scaleRatio;
				y = this.innerHeight / 2 - (this.seriesMaxTop + (this.seriesMaxBottom - this.seriesMaxTop) / 2) * zoomLevel * this.scaleRatio;
			}

			this._mapAnimation = this.seriesContainer.animate(
				[{
					property: "scale",
					to: zoomLevel
				}, {
					property: "x", from: this.seriesContainer.pixelX,
					to: x
				}, {
					property: "y", from: this.seriesContainer.pixelY,
					to: y
				}], duration, this.zoomEasing);

			this._disposers.push(this._mapAnimation.events.on("animationended", () => {
				this._zoomGeoPointReal = this.zoomGeoPoint;
			}))


			this.seriesContainer.validatePosition();

			return this._mapAnimation;
		}
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

		const inertia = this.seriesContainer.interactions.inertias.getKey("move");
		if (inertia) {
			inertia.done();
		}		

		if (mapObject instanceof MapImage) {
			if ($type.isNaN(zoomLevel)) {
				zoomLevel = 5;
			}
			return this.zoomToGeoPoint({ latitude: mapObject.latitude, longitude: mapObject.longitude }, zoomLevel, center, duration, true);
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

			return this.zoomToGeoPoint(geoPoint, zoomLevel, true, duration, true);
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

		return this.zoomToGeoPoint({ latitude: north + (south - north) / 2, longitude: west + (east - west) / 2 }, zoomLevel, center, duration, true);
	}

	/**
	 * Zooms in the map, optionally centering on particular latitude/longitude
	 * point.
	 *
	 * @param geoPoint  Optional center point
	 * @param duration  Duration for zoom animation (ms)
	 * @return Zoom animation
	 */
	public zoomIn(geoPoint?: IGeoPoint, duration?: number, sensitivity: number = 1): Animation {
		let step = 1 + (this.zoomStep - 1) * sensitivity;
		if (step < 1) {
			step = 1;
		}
		return this.zoomToGeoPoint(geoPoint, this.zoomLevel * step, false, duration);
	}

	/**
	 * Zooms out the map, optionally centering on particular latitude/longitude
	 * point.
	 *
	 * @param geoPoint  Optional center point
	 * @param duration  Duration for zoom animation (ms)
	 * @return Zoom animation
	 */
	public zoomOut(geoPoint?: IGeoPoint, duration?: number, sensitivity: number = 1): Animation {
		let step = 1 + (this.zoomStep - 1) * sensitivity;
		if (step < 1) {
			step = 1;
		}
		return this.zoomToGeoPoint(geoPoint, this.zoomLevel / step, false, duration);
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
		this.zoomToGeoPoint(this.svgPointToGeo(point), this.zoomLevel, true, duration, true);
	}

	/**
	 * Current lat/long coordinates for the center of the viewport. (default
	 * zoom reference point)
	 *
	 * @readonly
	 * @return Coordinates
	 */
	public get zoomGeoPoint(): IGeoPoint {
		const point = $utils.spritePointToSvg({ x: this.pixelWidth / 2, y: this.pixelHeight / 2 }, this);
		return this.svgPointToGeo(point);
	}

	/**
	 * Current zoom level.
	 *
	 * @readonly
	 * @return Zoom level
	 */
	public set zoomLevel(value: number) {
		this.seriesContainer.scale = value;
	}

	/**
	 * @return Zoom level
	 */
	public get zoomLevel(): number {
		return this.seriesContainer.scale;
	}

	/**
	 * Dispatches events after some map transformation, like pan or zoom.
	 *
	 * @ignore
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
		zoomControl.plusButton.exportable = false;
		zoomControl.minusButton.exportable = false;
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
	 * Degrees to rotate the map around vertical axis (Y).
	 *
	 * E.g. if set to -160, the longitude 20 will become a new center, creating
	 * a Pacific-centered map.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/map/#Map_rotation} For more info on map rotation.
	 * @param  value  Rotation
	 */
	public set deltaLongitude(value: number) {
		if (this.setPropertyValue("deltaLongitude", $geo.wrapAngleTo180(value))) {
			this.rotateMap();
			this.updateZoomGeoPoint();
		}
	}

	/**
	 * @return Rotation
	 */
	public get deltaLongitude(): number {
		return this.getPropertyValue("deltaLongitude");
	}

	/**
	 * Degrees to rotate the map around horizontal axis (X).
	 *
	 * E.g. setting this to 90 will put Antarctica directly in the center of
	 * the map.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/map/#Map_rotation} For more info on map rotation.
	 * @since 4.3.0
	 * @param  value  Rotation
	 */
	public set deltaLatitude(value: number) {
		if (this.setPropertyValue("deltaLatitude", value)) {
			this.rotateMap()
			this.updateZoomGeoPoint();
		}
	}

	/**
	 * @return Rotation
	 */
	public get deltaLatitude(): number {
		return this.getPropertyValue("deltaLatitude");
	}

	/**
	 * Degrees to rotate the map around "Z" axis. This is the axis that pierces
	 * the globe directly from the viewer's point of view.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/map/#Map_rotation} For more info on map rotation.
	 * @since 4.3.0
	 * @param  value  Rotation
	 */
	public set deltaGamma(value: number) {
		if (this.setPropertyValue("deltaGamma", value)) {
			this.rotateMap()
			this.updateZoomGeoPoint();
		}
	}

	/**
	 * @return Rotation
	 */
	public get deltaGamma(): number {
		return this.getPropertyValue("deltaGamma");
	}

	/**
	 * @ignore
	 */
	protected rotateMap() {
		if (this.projection.d3Projection) {
			if (this.projection.d3Projection.rotate) {
				this.projection.d3Projection.rotate([this.deltaLongitude, this.deltaLatitude, this.deltaGamma]);
				this.invalidateProjection();
			}
		}
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
	 *
	 * Call this after changing projection or its settings.
	 */
	public invalidateProjection() {
		this.invalidateDataUsers();
		this.updateCenterGeoPoint();
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
	 * Decorates a new [[Series]] object with required parameters when it is
	 * added to the chart.
	 *
	 * @ignore Exclude from docs
	 * @param event  Event
	 */
	public handleSeriesAdded(event: IListEvents<MapSeries>["inserted"]): void {
		super.handleSeriesAdded(event);
		let series = event.newValue;
		series.scale = this.scaleRatio;
		series.events.on("validated", this.updateCenterGeoPoint, this, false);
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
		return field == "projection" || field == "geodata" || super.asIs(field);
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
	 *
	 * Use the only parameter to set number of milliseconds for the zoom
	 * animation to play.
	 *
	 * @param  duration  Duration (ms)
	 */
	public goHome(duration?: number) {
		let homeGeoPoint = this.homeGeoPoint;
		if (!homeGeoPoint) {
			homeGeoPoint = this.centerGeoPoint;
		}
		if (homeGeoPoint) {
			this.zoomToGeoPoint(homeGeoPoint, this.homeZoomLevel, true, duration, true);
		}
	}

	/**
	 * Sets [[Paper]] instance to use to draw elements.
	 *
	 * @ignore
	 * @param   paper  Paper
	 * @return         true if paper was changed, false, if it's the same
	 */
	public setPaper(paper: Paper): boolean {
		if (this.svgContainer) {
			this.svgContainer.hideOverflow = true;
		}

		return super.setPaper(paper);
	}

	/**
	 * Background series will create polygons that will fill all the map area
	 * with some color (or other fill).
	 *
	 * This might be useful with non-rectangular projections, like Orthographic,
	 * Albers, etc.
	 *
	 * To change background color/opacity access polygon template.
	 *
	 * ```TypeScript
	 * chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#fff");
	 * chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.1;
	 * ```
	 * ```JavaScript
	 * chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#fff");
	 * chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.1;
	 * ```
	 * ```JSON
	 * {
	 *   "backgroundSeries": {
	 *     "mapPolygons": {
	 *       "polygon": {
	 *         "fill": "#fff",
	 *         "fillOpacity": 0.1
	 *       }
	 *     }
	 *   }
	 * }
	 * ```
	 *
	 * @since 4.3.0
	 */
	public get backgroundSeries(): MapPolygonSeries {
		if (!this._backgroundSeries) {
			let backgroundSeries = new MapPolygonSeries();
			backgroundSeries.parent = this.seriesContainer;
			backgroundSeries.chart = this;

			backgroundSeries.hiddenInLegend = true;
			backgroundSeries.addDisposer(new Disposer(() => {
				this._backgroundSeries = undefined;
			}))
			this._disposers.push(backgroundSeries);

			let interfaceColors = new InterfaceColorSet();
			let color = interfaceColors.getFor("background");

			let polygonTemplate = backgroundSeries.mapPolygons.template.polygon;
			polygonTemplate.stroke = color;
			polygonTemplate.fill = color;
			polygonTemplate.fillOpacity = 0;
			polygonTemplate.strokeOpacity = 0;

			backgroundSeries.mapPolygons.create();

			this._backgroundSeries = backgroundSeries;
		}

		return this._backgroundSeries;
	}

	/**
	 * Prepares the legend instance for use in this chart.
	 *
	 * @param legend  Legend
	 */
	protected setLegend(legend: Legend) {
		super.setLegend(legend);
		legend.parent = this;
	}

	/**
	 * @param  value  Tap to activate?
	 */
	protected setTapToActivate(value: boolean): void {
		super.setTapToActivate(value);
		// setup other containers
		this.seriesContainer.interactions.isTouchProtected = true;
		this.panSprite.interactions.isTouchProtected = true;
	}

	protected handleTapToActivate(): void {
		super.handleTapToActivate();
		this.seriesContainer.interactions.isTouchProtected = false;
		this.panSprite.interactions.isTouchProtected = false;
	}

	protected handleTapToActivateDeactivation(): void {
		super.handleTapToActivateDeactivation();
		this.seriesContainer.interactions.isTouchProtected = true;
		this.panSprite.interactions.isTouchProtected = true;
	}

	/**
	 * Adds easing functions to "function" fields.
	 *
	 * @param field  Field name
	 * @return Assign as function?
	 */
	protected asFunction(field: string): boolean {
		return field == "zoomEasing" || super.asIs(field);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapChart"] = MapChart;
