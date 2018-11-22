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
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { MapLineObject } from "./MapLineObject";
import { MapLineSeriesDataItem, MapLineSeries } from "./MapLineSeries";
import { MapChart } from "../types/MapChart";
import { MapImage } from "./MapImage";
import { IOrientationPoint } from "../../core/defs/IPoint";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { Triangle } from "../../core/elements/Triangle";
import { ListTemplate, IListEvents, ListDisposer } from "../../core/utils/List";
import { Polyline } from "../../core/elements/Polyline";
import { registry } from "../../core/Registry";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { percent } from "../../core/utils/Percent";
import * as $type from "../../core/utils/Type";
import * as $iter from "../../core/utils/Iterator";
import * as $geo from "./Geo";


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
	 *
	 * @type {IMapLineProperties}
	 */
	public _properties!: IMapLineProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IMapLineAdapters}
	 */
	public _adapter!: IMapLineAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IMapLineEvents}
	 */
	public _events!: IMapLineEvents;

	/**
	 * A line visual element.
	 *
	 * @type {Polyline}
	 */
	public line: Polyline;

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
	 * @type {MapLineSeriesDataItem}
	 */
	public _dataItem: MapLineSeriesDataItem;

	/**
	 * A map series this object belongs to.
	 *
	 * @type {MapLineSeries}
	 */
	public series: MapLineSeries;

	/**
	 * Instead of setting longitudes/latitudes you can set an array of images which will be connected by the line
	 * @ignore
	 */
	protected _imagesToConnect: MapImage[];

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
	protected createLine(){
		this.line = new Polyline();
	}

	/**
	 * Converts a position within the line (0-1) to a physical point
	 * coordinates.
	 *
	 * 0 indicates start of the line, 0.5 - middle, while 1 indicates the end.
	 *
	 * @param  {number}             position  Position (0-1)
	 * @return {IOrientationPoint}            Coordinates
	 */
	public positionToPoint(position: number): IOrientationPoint {
		if (this.line) {
			return this.line.positionToPoint(position);
		}
		return { x: 0, y: 0, angle: 0 };
	}

	/**
	 * [multiGeoLine description]
	 *
	 * @todo Description
	 * @param {IGeoPoint[][]} multiGeoLine [description]
	 */
	public set multiGeoLine(multiGeoLine: IGeoPoint[][]) {
		this.setPropertyValue("multiGeoLine", $geo.normalizeMultiline(multiGeoLine), true);
	}

	/**
	 * @return {IGeoPoint[]} [description]
	 */
	public get multiGeoLine(): IGeoPoint[][] {
		return this.getPropertyValue("multiGeoLine");
	}

	/**
	 * Instead of setting longitudes/latitudes you can set an array of images
	 * which will be connected by the line.
	 *
	 * Parameter is an array that can hold string `id`'s to of the images, or
	 * references to actual [[MapImage]] objects.
	 *
	 * @param {MapImages[]}  images  Images
	 */
	public set imagesToConnect(images: MapImage[] | string[]) {
		//@todo dispose listeners if previous imagesToConnect exists
		for (let i = 0, len = images.length; i < len; i++) {
			let image = images[i];
			if ($type.isString(image)) {
				if (this.map.hasKey(image)) {
					image = <MapImage>this.map.getKey(image);
					images[i] = image;
				}
				else {
					continue;
				}
			}
			image.events.on("propertychanged", (event) => {
				if (event.property == "longitude" || event.property == "latitude") {
					this.invalidate();
				}
			}, this, false);
		}
		this.setPropertyValue("imagesToConnect", images);
	}

	/**
	 * @return {MapImages[]}
	 */
	public get imagesToConnect(): MapImage[] | string[] {
		return this.getPropertyValue("imagesToConnect");
	}

	/**
	 * (Re)validates the line, effectively forcing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		let chart: MapChart = this.series.chart;
		//let multiPoints: IPoint[][] = [];
		let multiGeoLine: IGeoPoint[][] = this.multiGeoLine || [];

		if (this.imagesToConnect) {
			let segment: IGeoPoint[] = [];
			multiGeoLine = [segment];

			for (let image of this.imagesToConnect) {
				segment.push({ longitude: (<MapImage>image).longitude, latitude: (<MapImage>image).latitude });
			}
		}

		if (this.shortestDistance) {
			let newMultiGeoLine: IGeoPoint[][] = [];

			for (let i = 0, len = multiGeoLine.length; i < len; i++) {
				let geoLine: IGeoPoint[] = multiGeoLine[i];
				let newGeoLine: IGeoPoint[] = [];

				for (let p = 1, plen = geoLine.length; p < plen; p++) {
					let geoPointA: IGeoPoint = geoLine[p - 1];
					let geoPointB: IGeoPoint = geoLine[p];

					let stepCount: number = Math.max(Math.abs(geoPointA.latitude - geoPointB.latitude), Math.abs(geoPointA.longitude - geoPointB.longitude)) * 4;
					//let latitudeStep: number = (geoPointB.latitude - geoPointA.latitude) / stepCount;
					//let longitudeStep: number = (geoPointB.longitude - geoPointA.longitude) / stepCount;

					for (let d = 0; d < stepCount; d++) {
						let intermediatePoint = chart.projection.intermediatePoint(geoPointA, geoPointB, d / stepCount);

						if (newGeoLine.length > 0) {
							let previousPoint = newGeoLine[newGeoLine.length - 1];
							if (Math.abs(previousPoint.longitude - intermediatePoint.longitude) > 359) {
								newMultiGeoLine.push(newGeoLine);
								newGeoLine = [];
							}
						}

						newGeoLine.push(intermediatePoint);
					}
					// add last point to avoid gap
					newGeoLine.push(geoPointB);
				}
				newMultiGeoLine.push(newGeoLine);
			}
			multiGeoLine = newMultiGeoLine;
		}

		this.line.segments = chart.projection.projectGeoLine(multiGeoLine);

		if (this._arrow) {
			this._arrow.validatePosition();
		}

		$iter.each(this.lineObjects.iterator(), (x) => {
			x.validatePosition();
		});
		
		super.validate();
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
	 * @param {boolean}  value  Real path?
	 */
	public set shortestDistance(value: boolean) {
		this.setPropertyValue("shortestDistance", value, true);
	}

	/**
	 * @return {boolean} Real path?
	 */
	public get shortestDistance(): boolean {
		return this.getPropertyValue("shortestDistance");
	}

	/**
	 * List of separate line objects, the line consists of.
	 *
	 * @todo Description (review)
	 * @readonly
	 * @return {ListTemplate<MapLineObject>} List of line objects
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
	 * @param {IListEvents<MapLineObject>["inserted"]}  event  Event
	 */
	protected handleLineObjectAdded(event: IListEvents<MapLineObject>["inserted"]) {
		let mapLineObject: MapLineObject = event.newValue;
		mapLineObject.mapLine = this;		
		mapLineObject.parent = this;
	}

	/**
	 * A [[MapLineObject]] to use as an option arrowhead on the line.
	 *
	 * Just accessing this property will create a default arrowhead on the line
	 * automatically.
	 *
	 * @param {MapLineObject}  arrow  Arrow element
	 */
	public set arrow(arrow: MapLineObject) {
		this._arrow = arrow;
		arrow.mapLine = this;
		arrow.parent = this;
	}

	/**
	 * @return {MapLineObject} Arrow element
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
	 * @param {MapLineObject}  source  Source map line
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
	 * @return {number} Latitude
	 */
	public get latitude(): number {
		let dataItem = this.dataItem;
		return dataItem.north + (dataItem.south - dataItem.north) / 2;
	}

	/**
	 * Longitude of the line center.
	 *
	 * @readonly
	 * @return {number} Latitude
	 */
	public get longitude(): number {
		let dataItem = this.dataItem;
		return dataItem.east + (dataItem.west - dataItem.east) / 2;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapLine"] = MapLine;
