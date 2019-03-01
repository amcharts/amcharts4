/**
 * Map series module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Series, SeriesDataItem, ISeriesProperties, ISeriesDataFields, ISeriesAdapters, ISeriesEvents } from "../series/Series";
import { MapChart } from "../types/MapChart";
import { MapObject } from "./MapObject";
import { IListEvents } from "../../core/utils/List";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { DataSource } from "../../core/data/DataSource";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[MapSeries]].
 *
 * @see {@link DataItem}
 */
export class MapSeriesDataItem extends SeriesDataItem {

	/**
	 * Longitude of the East-most point of the element.
	 */
	public east: number;

	/**
	 * Longitude of the West-most point of the element.
	 */
	public west: number;

	/**
	 * Latitude of the South-most point of the element.
	 */
	public south: number;

	/**
	 * Latitude of the North-most point of the element.
	 */
	public north: number;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: MapSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "MapSeriesDataItem";
		this.values.value = {};
		this.applyTheme();
	}

	/**
	 * Numeric value of the data item.
	 *
	 * Value may be used in heat-map calculations.
	 *
	 * @param value  Value
	 */
	public set value(value: number) {
		this.setValue("value", value);
	}

	/**
	 * @return Value
	 */
	public get value(): number {
		return this.values.value.value;
	}

	/**
	 * Updates the item's bounding coordinates: coordinates of the East, West,
	 * North, and South-most points.
	 *
	 * @ignore Exclude from docs
	 * @param geoPoints  Points of the element
	 */
	public updateExtremes(geoPoints: IGeoPoint[]): void {
		for (let s: number = 0; s < geoPoints.length; s++) {
			let longitude: number = geoPoints[s].longitude;
			let latitude: number = geoPoints[s].latitude;

			if ((this.west > longitude) || !$type.isNumber(this.west)) {
				this.west = longitude;
			}
			if ((this.east < longitude) || !$type.isNumber(this.east)) {
				this.east = longitude;
			}

			if ((this.north < latitude) || !$type.isNumber(this.north)) {
				this.north = latitude;
			}
			if ((this.south > latitude) || !$type.isNumber(this.south)) {
				this.south = latitude;
			}
		}
	}

	/**
	 * When `zoomToMapObject()` is called the map will either calculate suitable
	 * zoom level itself or use object's `zoomLevel` if set.
	 *
	 * @param value  Zoom level
	 */
	public set zoomLevel(value: number) {
		this.setProperty("zoomLevel", value);
	}

	/**
	 * @return Zoom level
	 */
	public get zoomLevel(): number {
		return this.properties["zoomLevel"];
	}

	/**
	 * When `zoomToMapObject()` is called the map will either calculate suitable
	 * center position itself or use object's `zoomGeoPoint` if set.
	 *
	 * @param value  Zoom geo point
	 */
	public set zoomGeoPoint(value: IGeoPoint) {
		this.setProperty("zoomGeoPoint", value);
	}

	/**
	 * @return Zoom geo point
	 */
	public get zoomGeoPoint(): IGeoPoint {
		return this.properties["zoomGeoPoint"];
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * [GEOJSONGeometry description]
 *
 * @todo Description
 */
export type GEOJSONGeometry = "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";

/**
 * Defines data fields for [[MapSeries]].
 *
 * @todo Alllow any number of values?
 */
export interface IMapSeriesDataFields extends ISeriesDataFields {

	/**
	 * A field name in data for a numeric value of the map object.
	 */
	value?: string;

	/**
	 * A field name in data for a `zoomLevel` of the map object.
	 */
	zoomLevel?: string;

	/**
	 * A field name in data for a `zoomGeoPoint` of the map object.
	 */
	zoomGeoPoint?: string;

}

/**
 * Defines properties for [[MapSeries]].
 */
export interface IMapSeriesProperties extends ISeriesProperties {

	/**
	 * A flag telling if the series should get data from `geodata` or not
	 *
	 * @default false
	 */
	useGeodata?: boolean;

	/**
	 * A list of object ids to include from the series.
	 */
	include?: string[];

	/**
	 * A list of object ids to exclude from the series.
	 */
	exclude?: string[];
}

/**
 * Defines events for [[MapSeries]].
 */
export interface IMapSeriesEvents extends ISeriesEvents { }

/**
 * Defines adapters for [[MapSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapSeriesAdapters extends ISeriesAdapters, IMapSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A base class for series of map objects.
 *
 * @see {@link IMapSeriesEvents} for a list of available Events
 * @see {@link IMapSeriesAdapters} for a list of available Adapters
 * @important
 */
export class MapSeries extends Series {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IMapSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: MapSeriesDataItem;

	/**
	 * The longitude of the East-most point in the series. (out of all elements)
	 */
	public east: number;

	/**
	 * The longitude of the West-most point in the series. (out of all elements)
	 */
	public west: number;

	/**
	 * The latitude of the South-most point in the series. (out of all elements)
	 */
	public south: number;

	/**
	 * The latitude of the North-most point in the series. (out of all elements)
	 */
	public north: number;

	/**
	 * A chart series belongs to.
	 */
	public _chart: MapChart;


	/**
	 * Map data in GeoJSON format.
	 *
	 * @see {@link http://geojson.org/} GeoJSON official specification
	 */
	protected _geodata: Object;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "MapSeries";

		// Set defaults
		this.isMeasured = false;
		this.nonScalingStroke = true;

		// Set data fields
		this.dataFields.value = "value";

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
		return new MapSeriesDataItem();
	}

	/**
	 * (Re)validates series data, effectively causing the whole series to be
	 * redrawn.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {
		super.validateData();
		$iter.each(this.dataItems.iterator(), (dataItem) => {
			if ((this.west > dataItem.west) || !$type.isNumber(this.west)) {
				this.west = dataItem.west;
			}
			if ((this.east < dataItem.east) || !$type.isNumber(this.east)) {
				this.east = dataItem.east;
			}

			if ((this.north < dataItem.north) || !$type.isNumber(this.north)) {
				this.north = dataItem.north;
			}
			if ((this.south > dataItem.south) || !$type.isNumber(this.south)) {
				this.south = dataItem.south;
			}
		});
		if (this.chart) {
			this.chart.updateExtremes();
		}
	}

	/**
	 * Checks whether object should be included in series.
	 *
	 * @param includes  A list of explicitly included ids
	 * @param excludes  A list of explicitly excluded ids
	 * @param id        Id of the object
	 * @return Include?
	 */
	protected checkInclude(includes: string[], excludes: string[], id: string): boolean {
		if (includes) {
			if (includes.length == 0) {
				return false;
			}
			else {
				if (includes.indexOf(id) == -1) {
					return false;
				}
			}
		}

		if (excludes && excludes.length > 0) {
			if (excludes.indexOf(id) != -1) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Should the map extract all the data about element from the GeoJSON?
	 *
	 * This is especially relevant for [[MapPolygonSeries]]. If not set to `true`
	 * polygon series will need to contain geographical data in itself in order
	 * to be drawn.
	 *
	 * If this is set to `true`, series will try to extract data for its objects
	 * from either chart-level `geodata` or from series' `geodata` which holds
	 * map infor in GeoJSON format.
	 *
	 * @default false
	 * @param value  Use GeoJSON data?
	 */
	public set useGeodata(value: boolean) {
		if (this.setPropertyValue("useGeodata", value)) {
			this.invalidateData();
		}
	}

	/**
	 * @return Use GeoJSON data?
	 */
	public get useGeodata(): boolean {
		return this.getPropertyValue("useGeodata");
	}

	/**
	 * A list of object ids that should be explictly included in the series.
	 *
	 * If this is not set, the series will automatically include all of the
	 * objects, available in the GeoJSON map. (minus the ones listed in
	 * `exclude`)
	 *
	 * If you need to display only specific objects, use `include`. E.g.:
	 *
	 * `include = ["FR", "ES", "DE"];`
	 *
	 * The above will show only France, Spain, and Germany out of the whole map.
	 *
	 * @param value  Included objects
	 */
	public set include(value: string[]) {
		if (this.setPropertyValue("include", value)) {
			this.processIncExc();
		}
	}

	/**
	 * @ignore
	 */
	protected processIncExc() {
		//this.data = [];
		this.invalidateData();
	}

	/**
	 * @return Included objects
	 */
	public get include(): string[] {
		return this.getPropertyValue("include");
	}

	/**
	 * A list of object ids that should be excluded from the series.
	 *
	 * E.g. you want to include all of the areas from a GeoJSON map, except
	 * Antarctica.
	 *
	 * You'd leave `include` empty, and set `exclude = ["AQ"]`.
	 *
	 * @param value  Excluded ids
	 */
	public set exclude(value: string[]) {
		if (this.setPropertyValue("exclude", value)) {
			this.processIncExc();
		}
	}

	/**
	 * @return Excluded ids
	 */
	public get exclude(): string[] {
		return this.getPropertyValue("exclude");
	}

	/**
	 * Decorates a newly added object.
	 *
	 * @param event [description]
	 */
	protected handleObjectAdded(event: IListEvents<MapObject>["inserted"]) {
		let mapObject: MapObject = event.newValue;
		mapObject.parent = this;
		mapObject.series = this;
		mapObject.strokeWidth = mapObject.strokeWidth;
	}

	/**
	 * Map data in GeoJSON format.
	 *
	 * The series supports the following GeoJSON objects: `Point`, `LineString`,
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
		}, undefined, false);
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
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapSeries"] = MapSeries;
registry.registeredClasses["MapSeriesDataItem"] = MapSeriesDataItem;
