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
import { MapChart } from "../types/MapChart";
import { MapImage } from "./MapImage";
import { MapImageSeries } from "./MapImageSeries";
import { IOrientationPoint } from "../../core/defs/IPoint";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { Triangle } from "../../core/elements/Triangle";
import { ListTemplate, IListEvents, ListDisposer } from "../../core/utils/List";
import { Polyline } from "../../core/elements/Polyline";
import { registry } from "../../core/Registry";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { percent, Percent } from "../../core/utils/Percent";
import * as $type from "../../core/utils/Type";
import * as $iter from "../../core/utils/Iterator";
import { IDisposer } from "../../core/utils/Disposer";
import * as $geo from "./Geo";
import * as $mapUtils from "./MapUtils";
import { IPoint } from "../../core/defs/IPoint";



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
	multiGeoLine?: Array<Array<IGeoPoint>>;

	/**
	 * Lat/long coordinates of all line ends and intermediate elbows.
	 */
	multiLine?: Array<Array<[number, number]>>;

	/**
	 * If `true` it line will be arched in the way to simulate shortest path
	 * over curvature of Earth's surface, based on currently used on projection.
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
export interface IMapLineEvents extends IMapObjectEvents { }

/**
 * Defines adapters for [[MapLine]].
 *
 * @see {@link Adapter}
 */
export interface IMapLineAdapters extends IMapObjectAdapters, IMapLineProperties { }


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
export class MapLine extends MapObject {

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapLineProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapLineAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapLineEvents;

	/**
	 * A line visual element.
	 */
	public line: Polyline;

	/**
	 * A list of actual line objects.
	 */
	protected _lineObjects: ListTemplate<MapLineObject>;

	/**
	 * A reference to arrow object.
	 */
	protected _arrow: MapLineObject;

	/**
	 * Related data item.
	 */
	public _dataItem: MapLineSeriesDataItem;

	/**
	 * A map series this object belongs to.
	 */
	public series: MapLineSeries;

	/**
	 * Instead of setting longitudes/latitudes you can set an array of images
	 * which will be connected by the line.
	 */
	protected _imagesToConnect: MapImage[];

	/**
	 * A list of event disposers for images.
	 */
	protected _imageListeners: { [index: string]: IDisposer } = {};

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "MapLine";

		this.createLine();
		this.line.stroke = color();
		this.line.parent = this;
		this.strokeOpacity = 1;

		let interfaceColors = new InterfaceColorSet();

		this.stroke = interfaceColors.getFor("grid");
		this.shortestDistance = true;

		// Apply theme
		this.applyTheme();

	}

	/**
	 * @ignore
	 */
	protected createLine() {
		this.line = new Polyline();
	}

	/**
	 * Converts a position within the line (0-1) to a physical point
	 * coordinates.
	 *
	 * 0 indicates start of the line, 0.5 - middle, while 1 indicates the end.
	 *
	 * @param position  Position (0-1)
	 * @return Coordinates
	 */
	public positionToPoint(position: number): IOrientationPoint {
		if (this.shortestDistance) {
			return this.series.chart.projection.positionToPoint(this.multiGeoLine, position);
		}
		else {
			if (this.line) {
				return this.line.positionToPoint(position);
			}
		}
		return { x: 0, y: 0, angle: 0 };
	}

	/**
	 * A collection of X/Y coordinates for a multi-segment line. E.g.:
	 *
	 * ```JSON
	 * [
	 *   // Segment 1
	 *   [
	 *     { longitude: 3.121, latitude: 0.58 },
	 *     { longitude: -5.199, latitude: 21.223 }
	 *   ],
	 *
	 *   // Segment 2
	 *   [
	 *     { longitude: -5.199, latitude: 21.223 },
	 *     { longitude: -12.9, latitude: 25.85 }
	 *   ]
	 * ]
	 * ```
	 *
	 * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.5} GeoJSON MultiLineString reference
	 * @param multiGeoLine  Coordinates
	 */
	public set multiGeoLine(multiGeoLine: Array<Array<IGeoPoint>>) {
		if (multiGeoLine && multiGeoLine.length > 0) {
			this.setPropertyValue("multiGeoLine", $geo.normalizeMultiline(multiGeoLine), true);

			let multiLine: Array<Array<[number, number]>> = $mapUtils.multiGeoLineToMultiLine(multiGeoLine);

			this.setPropertyValue("multiLine", multiLine);

			this.updateExtremes();
		}
	}

	/**
	 * @return Coordinates
	 */
	public get multiGeoLine(): Array<Array<IGeoPoint>> {
		let multiGeoLine = this.getPropertyValue("multiGeoLine");
		if (!multiGeoLine && this.dataItem && this.dataItem.multiGeoLine) {
			multiGeoLine = this.dataItem.multiGeoLine;
		}

		return multiGeoLine;
	}

	/**
	 * A collection of X/Y coordinates for a multi-segment line. E.g.:
	 *
	 * ```JSON
	 * [
	 *   // Segment 1
	 *   [
	 *     [ 100, 150 ],
	 *     [ 120, 200 ]
	 *   ],
	 *
	 *   // Segment 2
	 *   [
	 *     [ 120, 200 ],
	 *     [ 150, 100 ]
	 *   ]
	 * ]
	 * ```
	 *
	 * @param multiLine  Coordinates
	 */
	public set multiLine(multiLine: Array<Array<[number, number]>>) {
		this.setPropertyValue("multiLine", multiLine);
		this.multiGeoLine = $mapUtils.multiLineToGeo(multiLine);
	}

	/**
	 * @return Coordinates
	 */
	public get multiLine(): Array<Array<[number, number]>> {

		let multiLine = this.getPropertyValue("multiLine");
		if (!multiLine && this.dataItem && this.dataItem.multiLine) {
			multiLine = this.dataItem.multiLine;
		}

		return multiLine;
	}

	/**
	 * Instead of setting longitudes/latitudes you can set an array of images
	 * which will be connected by the line.
	 *
	 * Parameter is an array that can hold string `id`'s to of the images, or
	 * references to actual [[MapImage]] objects.
	 *
	 * @param images  Images
	 */
	public set imagesToConnect(images: MapImage[] | string[]) {
		this.setPropertyValue("imagesToConnect", images, true);
		this.handleImagesToConnect();

		if (this.series) {
			let chart = this.series.chart;
			if (chart) {
				chart.series.each((series) => {
					if (series instanceof MapImageSeries) {
						if(!series.isReady()){
							this._disposers.push(series.events.on("ready", this.handleImagesToConnect, this, false));
						}
					}
				})
			}
		}
	}

	/**
	 * @return {MapImages[]}
	 */
	public get imagesToConnect(): MapImage[] | string[] {
		return this.getPropertyValue("imagesToConnect");
	}

	protected handleImagesToConnect() {
		if (this.imagesToConnect) {
			let segment: Array<IGeoPoint> = [];
			let multiGeoLine = [segment];

			for (let image of this.imagesToConnect) {
				if ($type.isString(image)) {
					let chart = this.series.chart;
					if (chart) {
						chart.series.each((series) => {
							if (series instanceof MapImageSeries) {
								let img = series.getImageById(<string>image)
								if (img) {
									image = img;
								}
							}
						})
					}
				}

				if (image instanceof MapImage) {

					segment.push({ longitude: (<MapImage>image).longitude, latitude: (<MapImage>image).latitude });

					if (!this._imageListeners[image.uid]) {
						let disposer = image.events.on("propertychanged", (event) => {
							if (event.property == "longitude" || event.property == "latitude") {
								this.handleImagesToConnect();
								this.invalidate();
							}
						}, this, false);
						this._imageListeners[image.uid] = disposer;
						this._disposers.push(disposer);
					}
				}
			}

			this.multiGeoLine = multiGeoLine;
		}
	}

	/**
	 * (Re)validates the line, effectively forcing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		let chart: MapChart = this.series.chart;

		if (this.multiLine) {

			if (!this.shortestDistance) {

				let convertedPoints: Array<Array<IPoint>> = [];

				for (let i = 0, len = this.multiLine.length; i < len; i++) {

					let segment: Array<[number, number]> = this.multiLine[i];

					let convertedSegmentPoints: Array<IPoint> = [];

					for (let s = 0, slen = segment.length; s < slen; s++) {
						let geoPoint: [number, number] = segment[s];
						let point: IPoint = this.series.chart.projection.convert({ longitude: geoPoint[0], latitude: geoPoint[1] });
						convertedSegmentPoints.push(point);
					}

					convertedPoints.push(convertedSegmentPoints);
				}
				this.line.segments = convertedPoints;
			}
			else {
				chart.projection.d3Projection.precision(0.1);
				this.line.path = chart.projection.d3Path(<any>this.getFeature());
			}

			if (this._arrow) {
				this._arrow.validatePosition();
			}

			$iter.each(this.lineObjects.iterator(), (x) => {
				x.validatePosition();
			});

			this.handleGlobalScale();
		}
		else if (this.imagesToConnect) {
			this.handleImagesToConnect();
		}


		super.validate();
	}

	/**
	 * @ignore
	 */
	public getFeature(): { "type": "Feature", geometry: { type: "MultiLineString", coordinates: Array<Array<[number, number]>> } } {
		if (this.multiLine && this.multiLine.length > 0 && this.multiLine[0] && this.multiLine[0].length > 0) {
			return { "type": "Feature", geometry: { type: "MultiLineString", coordinates: this.multiLine } };
		}
	}

	/**
	 * @ignore Exclude from docs
	 */
	public measureElement(): void {
		// Overriding, just to avoid extra measure
	}

	/**
	 * The line should take the shortest path over the globe.
	 *
	 * Enabling this will make the line look differently in different
	 * projections. Only `MapLine` supports this setting, `MapArc` and
	 * `MapSplice` don't.
	 *
	 * @default false
	 * @param value  Real path?
	 */
	public set shortestDistance(value: boolean) {
		this.setPropertyValue("shortestDistance", value, true);
	}

	/**
	 * @return Real path?
	 */
	public get shortestDistance(): boolean {
		return this.getPropertyValue("shortestDistance");
	}

	/**
	 * List of separate line objects the line consists of.
	 *
	 * @readonly
	 * @return List of line objects
	 */
	public get lineObjects(): ListTemplate<MapLineObject> {
		if (!this._lineObjects) {
			this._lineObjects = new ListTemplate<MapLineObject>(new MapLineObject());
			this._lineObjects.events.on("inserted", this.handleLineObjectAdded, this, false);
			this._disposers.push(new ListDisposer(this._lineObjects));
			this._disposers.push(this._lineObjects.template);
		}

		return this._lineObjects;
	}

	/**
	 * Decorate a [[LineObject]] when it is added to the line.
	 *
	 * @param event  Event
	 */
	protected handleLineObjectAdded(event: IListEvents<MapLineObject>["inserted"]) {
		let mapLineObject: MapLineObject = event.newValue;
		mapLineObject.mapLine = this;
		mapLineObject.shouldClone = false;
		mapLineObject.parent = this;
	}

	/**
	 * A [[MapLineObject]] to use as an option arrowhead on the line.
	 *
	 * Just accessing this property will create a default arrowhead on the line
	 * automatically.
	 *
	 * @param arrow  Arrow element
	 */
	public set arrow(arrow: MapLineObject) {
		this._arrow = arrow;
		arrow.mapLine = this;
		arrow.parent = this;
	}

	/**
	 * @return Arrow element
	 */
	public get arrow(): MapLineObject {
		if (!this._arrow) {
			let arrow: MapLineObject = this.createChild(MapLineObject);
			arrow.shouldClone = false;
			arrow.width = 8;
			arrow.height = 10;
			arrow.mapLine = this;
			arrow.position = 0.5;

			let triangle = arrow.createChild(Triangle);
			//triangle.shouldClone = false;
			triangle.fillOpacity = 1;
			triangle.width = percent(100);
			triangle.height = percent(100);
			triangle.rotation = 90;
			triangle.horizontalCenter = "middle";
			triangle.verticalCenter = "middle";
			this._arrow = arrow;
		}
		return this._arrow;
	}

	/**
	 * Copies line properties and other attributes, like arrow, from another
	 * instance of [[MapLine]].
	 *
	 * @param source  Source map line
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.line.copyFrom(source.line);
		this.lineObjects.copyFrom(source.lineObjects);
		if (source._arrow) {
			this.arrow = <MapLineObject>source.arrow.clone();
		}
	}

	/**
	 * Latitude of the line center.
	 *
	 * @readonly
	 * @return Latitude
	 */
	public get latitude(): number {
		return this.north + (this.south - this.north) / 2;
	}

	/**
	 * Longitude of the line center.
	 *
	 * @readonly
	 * @return Latitude
	 */
	public get longitude(): number {
		return this.east + (this.west - this.east) / 2;
	}

	/**
	 * X coordinate for the slice tooltip.
	 *
	 * @ignore
	 * @return X
	 */
	public getTooltipX(): number {
		let x = this.getPropertyValue("tooltipX");
		if (!(x instanceof Percent)) {
			x = percent(50);
		}
		if (x instanceof Percent) {
			return this.positionToPoint(x.value).x;
		}
		else {
			return 0;
		}
	}

	/**
	 * Y coordinate for the slice tooltip.
	 *
	 * @ignore
	 * @return Y
	 */
	public getTooltipY(): number {
		let y = this.getPropertyValue("tooltipY");
		if (!(y instanceof Percent)) {
			y = percent(50);
		}
		if (y instanceof Percent) {
			return this.positionToPoint(y.value).y;
		}
		else {
			return 0;
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapLine"] = MapLine;
