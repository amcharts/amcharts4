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
import * as $type from "../../core/utils/Type";
import * as $math from "../../core/utils/Math";
import { ListTemplate } from "../../core/utils/List";
import * as d3geo from "d3-geo";

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
	 * South-most latitude.
	 */
	protected _south: number;

	/**
	 * North-most latitude.
	 */
	protected _north: number;

	/**
	 * East-most longitude.
	 */
	protected _east: number;

	/**
	 * West-most longitude.
	 */
	protected _west: number;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: MapSeries;

	/**
	 * Shortcut to either [[MapLine]], [[MapImage]], or [[MapPolygon]].
	 */
	public mapObject: MapObject;

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


	/**
	 * Longitude of the East-most point of the element.
	 */
	public get east(): number {
		return this._east;
	}

	/**
	 * Longitude of the West-most point of the element.
	 */
	public get west(): number {
		return this._west;
	}

	/**
	 * Latitude of the South-most point of the element.
	 */
	public get south(): number {
		return this._south;
	}

	/**
	 * Latitude of the North-most point of the element.
	 */
	public get north(): number {
		return this._north;
	}

	/**
	 * Updates the item's bounding coordinates: coordinates of the East, West,
	 * North, and South-most points.
	 *
	 * @ignore Exclude from docs
	 */
	public updateExtremes(): void {
		let geometry = this.getFeature().geometry;
		if (geometry) {

			let bounds = d3geo.geoBounds(geometry);

			let west = bounds[0][0];
			let south = bounds[0][1];

			let north = bounds[1][1];
			let east = bounds[1][0];

			let changed = false;
			if (north != this.north) {
				this._north = $math.round(north, 6);
				changed = true;
			}

			if (south != this.south) {
				this._south = $math.round(south, 6);
				changed = true;
			}

			if (east != this.east) {
				this._east = $math.round(east, 6);
				changed = true;
			}

			if (west != this.west) {
				this._west = $math.round(west, 6);
				changed = true;
			}

			// solves single russia prob
			if (this._east < this._west) {
				this._east = 180;
				this._west = -180;
			}

			if (changed) {
				this.component.invalidateDataItems();
			}
		}
	}

	public getFeature(): any {
		return {};
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

	/**
	 * Should this series be included when calculating bounds of the map?
	 *
	 * This affects initial zoom as well as limits for zoom/pan.
	 *
	 * By default, `MapPolygonSeries` included (true), while `MapImageSeries` and
	 * `MapLineSeries` are not (`false`).
	 */
	ignoreBounds?: boolean;
}

/**
 * Defines events for [[MapSeries]].
 */
export interface IMapSeriesEvents extends ISeriesEvents {
	geoBoundsChanged: {};
}

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
	protected _east: number;

	/**
	 * The longitude of the West-most point in the series. (out of all elements)
	 */
	protected _west: number;

	/**
	 * The latitude of the South-most point in the series. (out of all elements)
	 */
	protected _south: number;

	/**
	 * The latitude of the North-most point in the series. (out of all elements)
	 */
	protected _north: number;

	protected _eastDefined: number;

	protected _westDefined: number;

	protected _southDefined: number;

	protected _northDefined: number;

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


	protected _mapObjects: ListTemplate<MapObject>;

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

		this.ignoreBounds = false;

		if(this.tooltip){
			this.tooltip.showInViewport = true;
		}

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
	 * Should this series be included when calculating bounds of the map?
	 *
	 * This affects initial zoom as well as limits for zoom/pan.
	 *
	 * By default, `MapPolygonSeries` included (true), while `MapImageSeries` and
	 * `MapLineSeries` are not (`false`).
	 *
	 * @since 4.3.0
	 * @param  value  Ignore bounds?
	 */
	public set ignoreBounds(value: boolean) {
		if (this.setPropertyValue("ignoreBounds", value)) {
			if (this.chart) {
				this.chart.updateExtremes();
			}
		}
	}

	/**
	 * @return Ignore bounds?
	 */
	public get ignoreBounds(): boolean {
		return this.getPropertyValue("ignoreBounds");
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
			for (let i = this.data.length - 1; i >= 0; i--) {
				if (this.data[i].madeFromGeoData == true) {
					this.data.splice(i, 1);
				}
			}
			this.disposeData();
			this.invalidateData();
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


	/**
	 * @ignore
	 */
	public getFeatures(): { "type": "Feature", geometry: { type: "Point" | "MultiLineString" | "MultiPolygon", coordinates: [number, number] | Array<Array<[number, number]>> | Array<Array<Array<[number, number]>>> } }[] {
		return;
	}

	/**
	 * @ignore
	 */
	public validateDataItems() {
		super.validateDataItems();
		this.updateExtremes();
	}

	/**
	 * @ignore
	 */
	public updateExtremes() {
		let north: number;
		let south: number;
		let east: number;
		let west: number;

		this.dataItems.each((dataItem) => {
			if (dataItem.north > north || !$type.isNumber(north)) {
				north = dataItem.north;
			}

			if (dataItem.south < south || !$type.isNumber(south)) {
				south = dataItem.south;
			}

			if (dataItem.west < west || !$type.isNumber(west)) {
				west = dataItem.west;
			}

			if (dataItem.east > east || !$type.isNumber(east)) {
				east = dataItem.east;
			}
		})

		if (this._mapObjects) {
			this._mapObjects.each((mapObject) => {
				if (mapObject.north > north || !$type.isNumber(north)) {
					north = mapObject.north;
				}

				if (mapObject.south < south || !$type.isNumber(south)) {
					south = mapObject.south;
				}

				if (mapObject.west < west || !$type.isNumber(west)) {
					west = mapObject.west;
				}

				if (mapObject.east > east || !$type.isNumber(east)) {
					east = mapObject.east;
				}
			})
		}


		if (this.north != north || this.east != east || this.south != south || this.west != west) {
			this._north = north;
			this._east = east;
			this._west = west;
			this._south = south;

			this.dispatch("geoBoundsChanged");
			if (!this.ignoreBounds) {
				this.chart.updateExtremes();
			}
		}
	}

	/**
	 * North-most latitude of the series.
	 *
	 * By default, this holds auto-calculated latitude of the extremity.
	 *
	 * It can be overridden manually.
	 *
	 * @param  value  Latitude
	 */
	public set north(value: number) {
		this._northDefined = value;
	}

	/**
	 * @return Latitude
	 */
	public get north(): number {
		if ($type.isNumber(this._northDefined)) {
			return this._northDefined;
		}
		return this._north;
	}

	/**
	 * South-most latitude of the series.
	 *
	 * By default, this holds auto-calculated latitude of the extremity.
	 *
	 * It can be overridden manually.
	 *
	 * @param  value  Latitude
	 */
	public set south(value: number) {
		this._southDefined = value;
	}

	/**
	 * @return Latitude
	 */
	public get south(): number {
		if ($type.isNumber(this._southDefined)) {
			return this._southDefined;
		}
		return this._south;
	}

	/**
	 * West-most longitude of the series.
	 *
	 * By default, this holds auto-calculated longitude of the extremity.
	 *
	 * It can be overridden manually.
	 *
	 * @param  value  Longitude
	 */
	public set west(value: number) {
		this._westDefined = value;
	}

	/**
	 * @return Longitude
	 */
	public get west(): number {
		if ($type.isNumber(this._westDefined)) {
			return this._westDefined;
		}
		return this._west;
	}

	/**
	 * East-most longitude of the series.
	 *
	 * By default, this holds auto-calculated longitude of the extremity.
	 *
	 * It can be overridden manually.
	 *
	 * @param  value  Longitude
	 */
	public set east(value: number) {
		this._eastDefined = value;
	}

	/**
	 * @return Longitude
	 */
	public get east(): number {
		if ($type.isNumber(this._eastDefined)) {
			return this._eastDefined;
		}
		return this._east;
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

		super.processConfig(config);
	}

	/**
	 * Adds `projection` to "as is" fields.
	 *
	 * @param field  Field name
	 * @return Assign as is?
	 */
	protected asIs(field: string): boolean {
		return field == "geodata" || super.asIs(field);
	}

	/**
	 * @ignore
	 */
	public updateTooltipBounds() {
		if (this.tooltip && this.topParent) {
			this.tooltip.setBounds({ x: 10, y: 10, width: this.topParent.maxWidth - 20, height: this.topParent.maxHeight - 20 });
		}
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
