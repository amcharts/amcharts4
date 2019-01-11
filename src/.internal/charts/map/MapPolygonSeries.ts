/**
 * Map polygon series module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapSeries, MapSeriesDataItem, GEOJSONGeometry, IMapSeriesProperties, IMapSeriesDataFields, IMapSeriesAdapters, IMapSeriesEvents } from "./MapSeries";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { MapChart } from "../types/MapChart";
import { MapPolygon } from "./MapPolygon";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { IMapPolygonDataObject } from "../types/MapChart";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { registry } from "../../core/Registry";
import * as $mapUtils from "./MapUtils";
import * as $array from "../../core/utils/Array";
import * as $utils from "../../core/utils/Utils";
import * as $iter from "../../core/utils/Iterator";
import { IDisposer, Disposer, MultiDisposer } from "../../core/utils/Disposer";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[MapPolygonSeries]]
 * @see {@link DataItem}
 */
export class MapPolygonSeriesDataItem extends MapSeriesDataItem {

	/**
	 * A [[MapPolygon]] element related to this data item.
	 *
	 * @type {MapPolygon}
	 */
	protected _mapPolygon: MapPolygon;

	/**
	 * A collection of X/Y coordinates for a single polygon.
	 *
	 * @type {number[][][]}
	 */
	protected _polygon: number[][][];

	/**
	 * A collection of X/Y coordinates for a multi-part polygon.
	 *
	 * @type {number[][][][]}
	 */
	protected _multiPolygon: number[][][][];

	/**
	 * A collection of lat/long coordinates for a single polygon.
	 *
	 * @type {IGeoPoint[][]}
	 */
	protected _geoPolygon: IGeoPoint[][];

	/**
	 * A collection of lat/long coordinates for a multi-part polygon.
	 *
	 * @type {IGeoPoint[][][]}
	 */
	protected _multiGeoPolygon: IGeoPoint[][][];

	/**
	 * Defines a type of [[Component]] this data item is used for
	 * @type {MapPolygonSeries}
	 */
	public _component!: MapPolygonSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "MapPolygonSeriesDataItem";
		this.applyTheme();
	}

	/**
	 * A [[MapPolygon]] element related to this data item.
	 *
	 * @readonly
	 * @return {MapPolygon} Element
	 */
	public get mapPolygon(): MapPolygon {
		if (!this._mapPolygon) {
			let mapPolygon = this.component.mapPolygons.create();
			this._mapPolygon = mapPolygon;
			this.addSprite(mapPolygon);

			this._disposers.push(mapPolygon);
			this._disposers.push(new Disposer(() => {
				if (this.component) {
					this.component.mapPolygons.removeValue(mapPolygon);
				}
			}));
		}
		return this._mapPolygon;
	}

	/**
	 * A collection of X/Y coordinates for a single polygon. E.g.:
	 *
	 * ```JSON
	 * [
	 *   [
	 *     [ 100, 150 ],
	 *     [ 120, 200 ],
	 *     [ 150, 200 ],
	 *     [ 170, 240 ],
	 *     [ 100, 150 ]
	 *   ]
	 * ]
	 * ```
	 *
	 * @param {number[][][]}  polygon  Coordinates
	 */
	public set polygon(polygon: number[][][]) {
		this._polygon = polygon;
		this.multiGeoPolygon = $mapUtils.multiPolygonToGeo([polygon]);
	}

	/**
	 * @return {number[]} Coordinates
	 */
	public get polygon(): number[][][] {
		return this._polygon;
	}

	/**
	 * A collection of X/Y coordinates for a multi-part polygon. E.g.:
	 *
	 * ```JSON
	 * [
	 *   // Part 1
	 *   [
	 *     [
	 *       [ 100, 150 ],
	 *       [ 120, 200 ],
	 *       [ 150, 220 ],
	 *       [ 170, 240 ],
	 *       [ 100, 150 ]
	 *     ]
	 *   ],
	 *
	 *   // Part 2
	 *   [
	 *     [
	 *       [ 300, 350 ],
	 *       [ 320, 400 ],
	 *       [ 350, 420 ],
	 *       [ 370, 440 ],
	 *       [ 300, 350 ]
	 *     ]
	 *   ]
	 * ]
	 * ```
	 *
	 * @param {number[][][]}  multiPolygon  Coordinates
	 */
	public set multiPolygon(multiPolygon: number[][][][]) {
		this._multiPolygon = multiPolygon;
		this.multiGeoPolygon = $mapUtils.multiPolygonToGeo(multiPolygon);
	}

	/**
	 * @return {number[]} Coordinates
	 */
	public get multiPolygon(): number[][][][] {
		return this._multiPolygon;
	}

	/**
	 * A collection of lat/long coordinates for a single polygon. E.g.:
	 *
	 * ```JSON
	 * [
	 *   [
	 *     { latitude: -10.0, longitude: -10.0 },
	 *     { latitude: 10.0, longitude: -10.0 },
	 *     { latitude: 10.0, longitude: 10.0 },
	 *     { latitude: -10.0, longitude: -10.0 }
	 *   ]
	 * ]
	 * ```
	 *
	 * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.6} GeoJSON Polygon reference
	 * @param {IGeoPoint[][]}  geoPolygon  Coordinates
	 */
	public set geoPolygon(geoPolygon: IGeoPoint[][]) {
		this._geoPolygon = geoPolygon;
		this.multiGeoPolygon = [geoPolygon];
	}

	/**
	 * @return {IGeoPoint[]} Coordinates
	 */
	public get geoPolygon(): IGeoPoint[][] {
		return this._geoPolygon;
	}

	/**
	 * A collection of lat/long coordinates for a multi-part polygon. E.g.:
	 *
	 * ```JSON
	 * [
	 *   [
	 *     [
	 *       { longitude: 180.0, latitude: 40.0 },
	 *       { longitude: 180.0, latitude: 50.0 },
	 *       { longitude: 170.0, latitude: 50.0 },
	 *       { longitude: 170.0, latitude: 40.0 },
	 *       { longitude: 180.0, latitude: 40.0 }
	 *     ]
	 *   ],
	 *   [
	 *     [
	 *       { longitude: -170.0, latitude: 40.0 },
	 *       { longitude: -170.0, latitude: 50.0 },
	 *       { longitude: -180.0, latitude: 50.0 },
	 *       { longitude: -180.0, latitude: 40.0 },
	 *       { longitude: -170.0, latitude: 40.0 }
	 *     ]
	 *   ]
	 * ]
	 * ```
	 *
	 * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.7} GeoJSON MultiPolygon reference
	 * @param {IGeoPoint[][][]}  multiGeoPolygon  Coordinates
	 */
	public set multiGeoPolygon(multiGeoPolygon: IGeoPoint[][][]) {
		this._multiGeoPolygon = multiGeoPolygon;
		this.updateAreaExtremes(multiGeoPolygon);
		this.mapPolygon.multiGeoPolygon = this._multiGeoPolygon;
	}

	/**
	 * @return {IGeoPoint[]} Coordinates
	 */
	public get multiGeoPolygon(): IGeoPoint[][][] {
		return this._multiGeoPolygon;
	}

	/**
	 * Updates the item's bounding coordinates: coordinates of the East, West,
	 * North, and South-most points.
	 *
	 * @ignore Exclude from docs
	 * @param {IGeoPoint[]}  geoPoints  Points of the element
	 */
	public updateAreaExtremes(multiGeoPolygon: IGeoPoint[][][]): void {
		for (let i = 0, len = multiGeoPolygon.length; i < len; i++) {
			let geoPolygon: IGeoPoint[][] = multiGeoPolygon[i];
			let surface: IGeoPoint[] = geoPolygon[0];
			this.updateExtremes(surface);
		}
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[MapPolygonSeries]].
 */
export interface IMapPolygonSeriesDataFields extends IMapSeriesDataFields {

	/**
	 * Field name that holds polygon pixels.
	 *
	 * @type {string}
	 */
	polygon?: string;

	/**
	 * Field name that holds multi-polygon pixels.
	 *
	 * @type {string}
	 */
	multiPolygon?: string;

	/**
	 * Field name that holds polygon data in Geo coordinates.
	 *
	 * @type {string}
	 */
	geoPolygon?: string;

	/**
	 * Field name that holds poly-polygon data in Geo coordinates.
	 *
	 * @type {string}
	 */
	multiGeoPolygon?: string;

}

/**
 * Defines properties for [[MapPolygonSeries]].
 */
export interface IMapPolygonSeriesProperties extends IMapSeriesProperties { }

/**
 * Defines events for [[MapPolygonSeries]].
 */
export interface IMapPolygonSeriesEvents extends IMapSeriesEvents { }

/**
 * Defines adapters for [[MapPolygonSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapPolygonSeriesAdapters extends IMapSeriesAdapters, IMapPolygonSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A series of map polygon elements.
 *
 * @see {@link IMapPolygonSeriesEvents} for a list of available Events
 * @see {@link IMapPolygonSeriesAdapters} for a list of available Adapters
 * @important
 */
export class MapPolygonSeries extends MapSeries {

	/**
	 * Defines available data fields.
	 *
	 * @type {IMapPolygonSeriesDataFields}
	 */
	public _dataFields: IMapPolygonSeriesDataFields;

	/**
	 * Defines available properties.
	 *
	 * @type {IMapPolygonSeriesProperties}
	 */
	public _properties!: IMapPolygonSeriesProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IMapPolygonSeriesAdapters}
	 */
	public _adapter!: IMapPolygonSeriesAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IMapPolygonSeriesEvents}
	 */
	public _events!: IMapPolygonSeriesEvents;

	/**
	 * Defines the type of data item.
	 *
	 * @type {MapPolygonSeriesDataItem}
	 */
	public _dataItem: MapPolygonSeriesDataItem;

	/**
	 * A related chart/map object, this element is drawn on.
	 *
	 * @type {MapChart}
	 */
	public chart: MapChart;

	/**
	 * A list of map polygons in the series.
	 *
	 * @type {ListTemplate<MapImage>}
	 */
	protected _mapPolygons: ListTemplate<MapPolygon>;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();

		this.parsingStepDuration = 250; // to avoid some extra redrawing

		this.className = "MapPolygonSeries";

		// Set data fields
		this.dataFields.multiPolygon = "multiPolygon";
		this.dataFields.polygon = "polygon";

		this.dataFields.geoPolygon = "geoPolygon";
		this.dataFields.multiGeoPolygon = "multiGeoPolygon";

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return {MapPolygonSeriesDataItem} Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new MapPolygonSeriesDataItem();
	}

	/**
	 * @ignore
	 */
	protected processIncExc(){
		this.mapPolygons.clear();
		super.processIncExc();
	}

	/**
	 * (Re)validates series data, effectively causing the whole series to be
	 * redrawn.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {
		if (this.data.length > 0 && this._parseDataFrom == 0) {
			this.mapPolygons.clear();
		}

		this.west = null;
		this.east = null;
		this.north = null;
		this.south = null;

		// process geoJSON and created map objects
		if (this.useGeodata || this.geodata) {
			let geoJSON: any = !this._dataSources["geodata"] ? this.chart.geodata : undefined;

			if(this.geodata){
				geoJSON = this.geodata;
			}

			if (geoJSON) {

				let features: any[];

				if (geoJSON.type == "FeatureCollection") {
					features = geoJSON.features;
				}
				else if (geoJSON.type == "Feature") {
					features = [geoJSON];
				}
				else if (["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"].indexOf(geoJSON.type) != -1) {
					features = [{ geometry: geoJSON }];
				}
				else {
					console.log("nothing found in geoJSON");
				}

				if (features) {
					for (let i = 0, len = features.length; i < len; i++) {

						let feature: any = features[i];
						let geometry: any = feature.geometry;
						if (geometry) {
							let type: GEOJSONGeometry = <GEOJSONGeometry>geometry.type;
							let id: string = feature.id;

							if (type == "Polygon" || type == "MultiPolygon") {

								if (!this.checkInclude(this.include, this.exclude, id)) {
									continue;
								}

								let coordinates: any[] = geometry.coordinates;

								if (coordinates) {
									// make the same as MultiPolygon
									if (type == "Polygon") {
										coordinates = [coordinates];
									}
								}

								// find data object in user-provided data
								let dataObject: IMapPolygonDataObject = $array.find(this.data, (value, i) => {
									return value.id == id;
								});


								// create one if not found
								if (!dataObject) {
									dataObject = { multiPolygon: coordinates, id: id };
									this.data.push(dataObject);
								}
								// in case found
								else {
									// if user-provided object doesn't have points data provided in any way:
									if (!dataObject.multiPolygon) {
										dataObject.multiPolygon = coordinates;
									}
								}

								// copy properties data to datacontext
								$utils.softCopyProperties(feature.properties, dataObject);
							}
						}
					}
				}
			}
		}

		super.validateData();

		// if data is parsed in chunks, polygon list is corrupted, fix it here
		// !important this should go after super!
		$iter.each(this.dataItems.iterator(), (dataItem) => {
			this.mapPolygons.moveValue(dataItem.mapPolygon);
		});
	}

	/**
	 * (Re)validates the series
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {
		super.validate();
		$iter.each(this.mapPolygons.iterator(), (mapPolygon) => {			
			mapPolygon.validate();
		})
	}

	/**
	 * List of polygon elements in the series.
	 *
	 * @return {ListTemplate<MapPolygon>} Polygon list
	 */
	public get mapPolygons(): ListTemplate<MapPolygon> {

		if (!this._mapPolygons) {
			let polygonTemplate: MapPolygon = new MapPolygon();

			let mapPolygons: ListTemplate<MapPolygon> = new ListTemplate<MapPolygon>(polygonTemplate);
			this._disposers.push(new ListDisposer(mapPolygons));
			this._disposers.push(mapPolygons.template);
			mapPolygons.template.focusable = true;
			mapPolygons.events.on("inserted", this.handleObjectAdded, this, false);
			this._mapPolygons = mapPolygons;
		}

		return this._mapPolygons;
	}

	/**
	 * returns MapPolygon by id in geoJSON file
	 * @param {string} polygon id
	 * @return {MapPolygon}
	 */
	public getPolygonById(id: string): MapPolygon {
		return $iter.find(this.mapPolygons.iterator(), (mapPolygon) => {
			let dataContext: any = mapPolygon.dataItem.dataContext;
			return dataContext.id == id;
		});
	}

	/**
	 * Copies all properties from another instance of [[Series]].
	 *
	 * @param {Series}  source  Source series
	 */
	public copyFrom(source: this) {
		this.mapPolygons.template.copyFrom(source.mapPolygons.template);
		super.copyFrom(source);
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapPolygonSeries"] = MapPolygonSeries;
registry.registeredClasses["MapPolygonSeriesDataItem"] = MapPolygonSeriesDataItem;
