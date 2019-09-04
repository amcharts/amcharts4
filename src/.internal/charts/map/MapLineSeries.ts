/**
 * Map line series module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapSeries, MapSeriesDataItem, GEOJSONGeometry, IMapSeriesProperties, IMapSeriesDataFields, IMapSeriesAdapters, IMapSeriesEvents } from "./MapSeries";
import { MapChart } from "../types/MapChart";
import { MapLine } from "./MapLine";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { IMapLineDataObject } from "../types/MapChart";
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
 * Defines a [[DataItem]] for [[MapLineSeries]]
 * @see {@link DataItem}
 */
export class MapLineSeriesDataItem extends MapSeriesDataItem {

	/**
	 * A [[MapLine]] element related to this data item.
	 */
	public _mapLine: MapLine;

	/**
	 * A collection of X/Y coordinates for a single-segment line.
	 */
	protected _line: Array<[number, number]>;

	/**
	 * A collection of X/Y coordinates for a multi-segment line.
	 */
	protected _multiLine: Array<Array<[number, number]>>;

	/**
	 * A collection of lat/long coordinates for a single-segment line.
	 */
	protected _geoLine: Array<IGeoPoint>;

	/**
	 * A collection of lat/long coordinates for a multi-segment line.
	 */
	protected _multiGeoLine: Array<Array<IGeoPoint>>;

	/**
	 * Defines a type of [[Component]] this data item is used for
	 */
	public _component!: MapLineSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "MapLineSeriesDataItem";
		this.applyTheme();
	}

	public getFeature(): { "type": "Feature", geometry: { type: "MultiLineString", coordinates: Array<Array<[number, number]>> } } {
		if (this.multiLine && this.multiLine.length > 0) {
			return { "type": "Feature", geometry: { type: "MultiLineString", coordinates: this.multiLine } };
		}
	}

	/**
	 * A [[MapLine]] element related to this data item.
	 *
	 * @readonly
	 * @return Element
	 */
	public get mapLine(): this["_mapLine"] {
		if (!this._mapLine) {
			let mapLine = this.component.mapLines.create();

			this._mapLine = mapLine;
			this.addSprite(mapLine);

			this._disposers.push(mapLine);
			this._disposers.push(new Disposer(() => {
				if (this.component) {
					this.component.mapLines.removeValue(mapLine);
				}
			}));

			this.mapObject = mapLine;
		}
		return this._mapLine;
	}

	/**
	 * A collection of X/Y coordinates for a single-segment line. E.g.:
	 *
	 * ```JSON
	 * [
	 *   [ 100, 150 ],
	 *   [ 120, 200 ]
	 * ]
	 * ```
	 *
	 * @param line  Coordinates
	 */
	public set line(line: Array<[number, number]>) {
		this._line = line;
		this.multiLine = [line];
	}

	/**
	 * @return Coordinates
	 */
	public get line(): Array<[number, number]> {
		return this._line;
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
		this._multiLine = multiLine;
		this._multiGeoLine = $mapUtils.multiLineToGeo(multiLine);
		this.updateExtremes();
	}

	/**
	 * @return Coordinates
	 */
	public get multiLine(): Array<Array<[number, number]>> {
		return this._multiLine;
	}

	/**
	 * A collection of lat/long coordinates for a single-segment line. E.g.:
	 *
	 * ```JSON
	 * [
	 *   { longitude: 3.121, latitude: 0.58 },
	 *   { longitude: -5.199, latitude: 21.223 }
	 * ]
	 * ```
	 *
	 * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.4} GeoJSON LineString reference
	 * @param geoLine  Coordinates
	 */
	public set geoLine(geoLine: Array<IGeoPoint>) {
		this._geoLine = geoLine;
		this.multiLine = $mapUtils.multiGeoLineToMultiLine([geoLine]);
	}

	/**
	 * @return Coordinates
	 */
	public get geoLine(): Array<IGeoPoint> {
		return this._geoLine;
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
		this._multiGeoLine = multiGeoLine;
		this.multiLine = $mapUtils.multiGeoLineToMultiLine(multiGeoLine);
	}

	/**
	 * @return Coordinates
	 */
	public get multiGeoLine(): Array<Array<IGeoPoint>> {
		return this._multiGeoLine;
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[MapLineSeries]].
 */
export interface IMapLineSeriesDataFields extends IMapSeriesDataFields {

	/**
	 * Field name that holds line data in pixels.
	 */
	line?: string;

	/**
	 * Field name that holds multi-line data in pixels.
	 */
	multiLine?: string;

	/**
	 * Field name that holds line data in Geo coordinates.
	 */
	geoLine?: string;

	/**
	 * Field name that holds multi-line data in Geo coordinates.
	 */
	multiGeoLine?: string;

}

/**
 * Defines properties for [[MapLineSeries]].
 */
export interface IMapLineSeriesProperties extends IMapSeriesProperties { }

/**
 * Defines events for [[MapLineSeries]].
 */
export interface IMapLineSeriesEvents extends IMapSeriesEvents { }

/**
 * Defines adapters for [[MapLineSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapLineSeriesAdapters extends IMapSeriesAdapters, IMapLineSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A series of map line series.
 *
 * @see {@link IMapLineSeriesEvents} for a list of available Events
 * @see {@link IMapLineSeriesAdapters} for a list of available Adapters
 * @important
 */
export class MapLineSeries extends MapSeries {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IMapLineSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapLineSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapLineSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapLineSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: MapLineSeriesDataItem;


	/**
	 * A related chart/map object, this element is drawn on.
	 */
	public chart: MapChart;

	/**
	 * Defines the type of the line items in this series.
	 */
	public _mapLine: MapLine;

	/**
	 * A list of map lins in the series.
	 */
	protected _mapLines: ListTemplate<this["_mapLine"]>;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "MapLineSeries";

		// Set data fields
		this.dataFields.multiLine = "multiLine";
		this.dataFields.line = "line";

		this.dataFields.geoLine = "geoLine";
		this.dataFields.multiGeoLine = "multiGeoLine";

		this.ignoreBounds = true;

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
		return new MapLineSeriesDataItem();
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
			let geoJSON: any = this.chart.geodata;
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
							if (type == "LineString" || type == "MultiLineString") {

								if (!this.checkInclude(this.include, this.exclude, id)) {
									continue;
								}

								let coordinates: any[] = geometry.coordinates;
								let dataObject: IMapLineDataObject = $array.find(this.data, (value, i) => {
									return value.id == id;
								});

								if (type == "LineString") {
									coordinates = [coordinates];
								}

								if (!dataObject) {
									dataObject = { multiLine: coordinates, id: id, madeFromGeoData:true};
									this.data.push(dataObject);
								}
								else {
									if (!dataObject.multiLine) {
										dataObject.multiLine = coordinates;
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
	 * A list of lines in the series.
	 *
	 * @return Lines
	 */
	public get mapLines(): ListTemplate<this["_mapLine"]> {

		if (!this._mapLines) {
			let lineTemplate: MapLine = this.createLine();
			let mapLines = new ListTemplate<MapLine>(lineTemplate);
			this._disposers.push(new ListDisposer(mapLines));
			this._disposers.push(mapLines.template);
			mapLines.events.on("inserted", this.handleObjectAdded, this, false);
			this._mapLines = mapLines;
			this._mapObjects = mapLines;
		}

		return this._mapLines;
	}

	/**
	 * Returns a new line instance of suitable type.
	 *
	 * @return New line
	 */
	protected createLine(): this["_mapLine"] {
		return new MapLine();
	}

	/**
	 * (Re)validates the series
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {

		this.dataItems.each((dataItem) => {
			$utils.used(dataItem.mapLine);
		})


		super.validate();
		this.mapLines.each((mapLine) => {
			mapLine.validate();
		})
	}

	/**
	 * Copies all properties from another instance of [[Series]].
	 *
	 * @param source  Source series
	 */
	public copyFrom(source: this) {
		this.mapLines.template.copyFrom(source.mapLines.template);
		super.copyFrom(source);
	}

	/**
	 * @ignore
	 */
	public getFeatures(): { "type": "Feature", geometry: { type: "MultiLineString", coordinates: Array<Array<[number, number]>> } }[] {
		let features: { "type": "Feature", geometry: { type: "MultiLineString", coordinates: Array<Array<[number, number]>> } }[] = [];
		this.dataItems.each((dataItem) => {
			let feature = dataItem.getFeature();
			if (feature) {
				features.push(feature);
			}
		})

		this.mapLines.each((mapLine) => {
			if (this.dataItems.indexOf(mapLine._dataItem) == -1) {
				let feature = mapLine.getFeature();
				if (feature) {
					features.push(feature);
				}
			}
		})
		return features;
	}


	/**
	 * returns MapLine by id
	 * @param line id
	 * @return {MapLine}
	 */
	public getLineById(id: string): MapLine {
		return $iter.find(this.mapLines.iterator(), (mapLine) => {
			let dataContext: any = mapLine.dataItem.dataContext;
			return dataContext.id == id;
		});
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapLineSeries"] = MapLineSeries;
registry.registeredClasses["MapLineSeriesDataItem"] = MapLineSeriesDataItem;
