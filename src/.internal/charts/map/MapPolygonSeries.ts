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
import { Disposer } from "../../core/utils/Disposer";

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
	 */
	protected _mapPolygon: MapPolygon;

	/**
	 * A collection of X/Y coordinates for a single polygon.
	 */
	protected _polygon: Array<Array<[number, number]>>;

	/**
	 * A collection of X/Y coordinates for a multi-part polygon.
	 */
	protected _multiPolygon: Array<Array<Array<[number, number]>>>;

	/**
	 * A collection of lat/long coordinates for a single polygon.
	 */
	protected _geoPolygon: [Array<IGeoPoint>, Array<IGeoPoint>];

	/**
	 * A collection of lat/long coordinates for a multi-part polygon.
	 */
	protected _multiGeoPolygon: Array<[Array<IGeoPoint>, Array<IGeoPoint>]>;

	/**
	 * Defines a type of [[Component]] this data item is used for
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
	 * @ignore
	 */
	public getFeature(): { "type": "Feature", geometry: { type: "MultiPolygon", coordinates: Array<Array<Array<[number, number]>>> } } {
		if (this.multiPolygon && this.multiPolygon.length > 0) {
			return { "type": "Feature", geometry: { type: "MultiPolygon", coordinates: this.multiPolygon } };
		}
	}

	/**
	 * A [[MapPolygon]] element related to this data item.
	 *
	 * @readonly
	 * @return Element
	 */
	public get mapPolygon(): MapPolygon {
		if (!this._mapPolygon) {
			let mapPolygon = this.component.mapPolygons.create();
			this._mapPolygon = mapPolygon;
			this.addSprite(mapPolygon);

			this._disposers.push(new Disposer(() => {
				if (this.component) {
					this.component.mapPolygons.removeValue(mapPolygon);
				}
			}));

			this.mapObject = mapPolygon;
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
	 * @param polygon  Coordinates
	 */
	public set polygon(polygon: Array<Array<[number, number]>>) {
		this._polygon = polygon;
		this.multiPolygon = [polygon];
	}

	/**
	 * @return Coordinates
	 */
	public get polygon(): Array<Array<[number, number]>> {
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
	 * @param multiPolygon  Coordinates
	 */
	public set multiPolygon(multiPolygon: Array<Array<Array<[number, number]>>>) {
		this._multiPolygon = multiPolygon;
		this.updateExtremes();
	}

	/**
	 * @return Coordinates
	 */
	public get multiPolygon(): Array<Array<Array<[number, number]>>> {
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
	 * @param geoPolygon  Coordinates
	 */
	public set geoPolygon(geoPolygon: [Array<IGeoPoint>, Array<IGeoPoint>]) {
		this._geoPolygon = geoPolygon;
		this.multiGeoPolygon = [geoPolygon];
	}

	/**
	 * @return Coordinates
	 */
	public get geoPolygon(): [Array<IGeoPoint>, Array<IGeoPoint>] {
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
	 * @param multiGeoPolygon  Coordinates
	 */
	public set multiGeoPolygon(multiGeoPolygon: Array<[Array<IGeoPoint>, Array<IGeoPoint>]>) {
		this._multiGeoPolygon = multiGeoPolygon;
		this.multiPolygon = $mapUtils.multiGeoPolygonToMultipolygon(multiGeoPolygon);
	}

	/**
	 * @return Coordinates
	 */
	public get multiGeoPolygon(): Array<[Array<IGeoPoint>, Array<IGeoPoint>]> {
		return this._multiGeoPolygon;
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
	 */
	polygon?: string;

	/**
	 * Field name that holds multi-polygon pixels.
	 */
	multiPolygon?: string;

	/**
	 * Field name that holds polygon data in Geo coordinates.
	 */
	geoPolygon?: string;

	/**
	 * Field name that holds poly-polygon data in Geo coordinates.
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
	 */
	public _dataFields: IMapPolygonSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapPolygonSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapPolygonSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapPolygonSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: MapPolygonSeriesDataItem;

	/**
	 * A related chart/map object, this element is drawn on.
	 */
	public chart: MapChart;

	/**
	 * A list of map polygons in the series.
	 */
	protected _mapPolygons: ListTemplate<MapPolygon>;

	/**
	 * Indicates if series should automatically calculate visual center of the
	 * polygons (accessible via `visualLongitude` and `visualLatitude` properties
	 * of the [[MapPolygon]]).
	 *
	 * @default false
	 * @since 4.3.0
	 */
	public calculateVisualCenter: boolean = false;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();

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
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new MapPolygonSeriesDataItem();
	}

	/**
	 * @ignore
	 */
	protected processIncExc() {
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
		// process geoJSON and created map objects
		if (this.useGeodata || this.geodata) {
			let geoJSON: any = !this._dataSources["geodata"] ? this.chart.geodata : undefined;

			if (this.geodata) {
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

							if (this.chart.geodataNames && this.chart.geodataNames[id]) {
								feature.properties.name = this.chart.geodataNames[id];
							}

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
									dataObject = { multiPolygon: coordinates, id: id, madeFromGeoData:true };
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
	}


	/**
	 * (Re)validates the series
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {
		super.validate();

		this.dataItems.each((dataItem)=>{
			$utils.used(dataItem.mapPolygon);
		})

		this.mapPolygons.each((mapPolygon) => {
			mapPolygon.validate();
			// makes small go first to avoid hover problems with IE
			if (!mapPolygon.zIndex && !mapPolygon.propertyFields.zIndex) {
				mapPolygon.zIndex = 1000000 - mapPolygon.boxArea;
			}
		})
	}

	/**
	 * List of polygon elements in the series.
	 *
	 * @return Polygon list
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
			this._mapObjects = mapPolygons;
		}

		return this._mapPolygons;
	}

	/**
	 * returns MapPolygon by id in geoJSON file
	 * @param polygon id
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
	 * @param source  Source series
	 */
	public copyFrom(source: this) {
		this.mapPolygons.template.copyFrom(source.mapPolygons.template);
		super.copyFrom(source);
	}

	/**
	 * @ignore
	 */
	public getFeatures(): { "type": "Feature", geometry: { type: "MultiPolygon", coordinates: Array<Array<Array<[number, number]>>> } }[] {

		let features: { "type": "Feature", geometry: { type: "MultiPolygon", coordinates: Array<Array<Array<[number, number]>>> } }[] = [];

		this.dataItems.each((dataItem) => {
			let feature = dataItem.getFeature();
			if (feature) {
				features.push(feature);
			}
		})

		this.mapPolygons.each((mapPolygon)=>{
			if (this.dataItems.indexOf(mapPolygon._dataItem) == -1) {
				let feature = mapPolygon.getFeature();
				if (feature) {
					features.push(feature);
				}
			}
		})
		return features;
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
