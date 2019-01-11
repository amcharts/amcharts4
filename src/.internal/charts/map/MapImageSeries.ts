/**
 * Map image series module
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
import { MapImage } from "./MapImage";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { IMapImageDataObject } from "../types/MapChart";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { registry } from "../../core/Registry";
import * as $array from "../../core/utils/Array";
import * as $mapUtils from "./MapUtils";
import * as $utils from "../../core/utils/Utils";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import { IDisposer, Disposer, MultiDisposer } from "../../core/utils/Disposer";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[MapImageSeries]]
 * @see {@link DataItem}
 */
export class MapImageSeriesDataItem extends MapSeriesDataItem {

	/**
	 * A [[MapImage]] element related to this data item.
	 *
	 * @type {MapImage}
	 */
	protected _mapImage: MapImage;

	/**
	 * [_point description]
	 *
	 * @todo Description
	 * @type {number[]}
	 */
	protected _point: number[];

	/**
	 * Geographical coordinates image is placed at.
	 *
	 * @type {IGeoPoint}
	 */
	protected _geoPoint: IGeoPoint;

	/**
	 * Defines a type of [[Component]] this data item is used for
	 * @type {Component}
	 */
	public _component!: MapImageSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "MapImageSeriesDataItem";
		this.applyTheme();
	}

	/**
	 * A [[MapImage]] element related to this data item.
	 *
	 * @return {MapImage} Element
	 */
	public get mapImage(): MapImage {
		if (!this._mapImage) {
			let mapImage = this.component.mapImages.create();
			this.addSprite(mapImage);
			this._mapImage = mapImage;
			this._disposers.push(mapImage);
			this._disposers.push(new Disposer(() => {
				if (this.component) {
					this.component.mapImages.removeValue(mapImage);
				}
			}));
		}
		return this._mapImage;
	}

	/**
	 * [point description]
	 *
	 * @todo Description
	 * @param {number[]} point [description]
	 */
	public set point(point: number[]) {
		this._point = point;
		this.geoPoint = $mapUtils.pointToGeo(point);
	}

	/**
	 * @return {number[]} [description]
	 */
	public get point(): number[] {
		return this._point;
	}

	/**
	 * Geographical coordinates (lat/long) image is placed at.
	 *
	 * @param {IGeoPoint} geoPoint Image coordinates
	 */
	public set geoPoint(geoPoint: IGeoPoint) {
		this._geoPoint = geoPoint;
		this.updateExtremes([this._geoPoint]);

		this.mapImage.latitude = this._geoPoint.latitude;
		this.mapImage.longitude = this._geoPoint.longitude;
	}

	/**
	 * @return {IGeoPoint} Image coordinates
	 */
	public get geoPoint(): IGeoPoint {
		return this._geoPoint;
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[MapImageSeries]].
 */
export interface IMapImageSeriesDataFields extends IMapSeriesDataFields {

	/**
	 * Field name that holds image point data in pixels.
	 *
	 * @type {string}
	 */
	point?: string;

	/**
	 * Field name that holds multi-image point data in pixels.
	 *
	 * @type {string}
	 */
	multiPoint?: string;

	/**
	 * Field name that holds image point data in Geo coordinates.
	 *
	 * @type {string}
	 */
	geoPoint?: string;

	/**
	 * Field name that holds multi-image point data in Geo coordinates.
	 *
	 * @type {string}
	 */
	multiGeoPoint?: string;

}

/**
 * Defines properties for [[MapImageSeries]].
 */
export interface IMapImageSeriesProperties extends IMapSeriesProperties { }

/**
 * Defines events for [[MapImageSeries]].
 */
export interface IMapImageSeriesEvents extends IMapSeriesEvents { }

/**
 * Defines adapters for [[MapImageSeries]].
 *
 * @see {@link Adapter}
 */
export interface IMapImageSeriesAdapters extends IMapSeriesAdapters, IMapImageSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A series of map image (marker) elements.
 *
 * @see {@link IMapImageSeriesEvents} for a list of available Events
 * @see {@link IMapImageSeriesAdapters} for a list of available Adapters
 * @important
 */
export class MapImageSeries extends MapSeries {

	/**
	 * Defines available data fields.
	 *
	 * @type {IMapImageSeriesDataFields}
	 */
	public _dataFields: IMapImageSeriesDataFields;

	/**
	 * Defines available properties.
	 *
	 * @type {IMapImageSeriesProperties}
	 */
	public _properties!: IMapImageSeriesProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IMapImageSeriesAdapters}
	 */
	public _adapter!: IMapImageSeriesAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IMapImageSeriesEvents}
	 */
	public _events!: IMapImageSeriesEvents;

	/**
	 * Defines the type of data item.
	 *
	 * @type {MapImageSeriesDataItem}
	 */
	public _dataItem: MapImageSeriesDataItem;

	/**
	 * A related chart/map object, this image is drawn on.
	 *
	 * @type {MapChart}
	 */
	public chart: MapChart;

	/**
	 * A list of map images in the series.
	 *
	 * @type {ListTemplate<MapImage>}
	 */
	protected _mapImages: ListTemplate<MapImage>;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "MapImageSeries";

		// Set data fields
		this.dataFields.multiPoint = "multiPoint";
		this.dataFields.point = "point";

		this.dataFields.geoPoint = "geoPoint";
		this.dataFields.multiGeoPoint = "multiGeoPoint";

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return {MapImageSeriesDataItem} Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new MapImageSeriesDataItem();
	}

	/**
	 * (Re)validates the data of the sries, effectively forcing it to redraw
	 * all of its elements.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {
		if (this.data.length > 0) {
			this.mapImages.clear();
		}

		// process geoJSON and created map objects
		if (this.useGeodata) {
			if (this.useGeodata || this.geodata) {
				let geoJSON: any = this.chart.geodata;

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
							if (type == "Point" || type == "MultiPoint") {  // todo: we don't support multipoints at the moment actually

								if (!this.checkInclude(this.include, this.exclude, id)) {
									continue;
								}

								let coordinates: any[] = geometry.coordinates;

								// make the same as MultiPoint
								if (type == "Point") {
									coordinates = [coordinates];
								}								

								let dataObject: IMapImageDataObject = $array.find(this.data, (value, i) => {
									return value.id == id;
								});

								if (!dataObject) {
									dataObject = { multiPoint: coordinates, id: id };
									this.data.push(dataObject);
								}
								else {
									if (!dataObject.multiPoint) {
										dataObject.multiPoint = coordinates;
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
		// important! this should go after super.validateData
		// if data is parsed in chunks, images list is corrupted, fix it here

		$iter.each(this.dataItems.iterator(), (dataItem) => {
			let mapImage = dataItem.mapImage;
			this.mapImages.moveValue(mapImage);
			if($type.isNumber(mapImage.latitude) && $type.isNumber(mapImage.latitude)){
				dataItem.geoPoint = {latitude:mapImage.latitude, longitude:mapImage.longitude}
			}
		});
	}

	/**
	 * A list of map images in the series.
	 *
	 * @return {ListTemplate<MapImage>} Map images
	 */
	public get mapImages(): ListTemplate<MapImage> {

		if (!this._mapImages) {
			let template: MapImage = new MapImage();
			let mapImages = new ListTemplate<MapImage>(template);
			this._disposers.push(new ListDisposer(mapImages));
			this._disposers.push(mapImages.template);
			mapImages.template.focusable = true;
			mapImages.events.on("inserted", this.handleObjectAdded, this, false);
			this._mapImages = mapImages;
		}

		return this._mapImages;
	}

	/**
	 * (Re)validates data element, effectively triggering its redrawal.
	 *
	 * @ignore Exclude from docs
	 * @param {this["_dataItem"]}  dataItem  Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]) {
		super.validateDataElement(dataItem);
		dataItem.mapImage.invalidate();
	}

	/**
	 * (Re)validates the series
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {
		super.validate();
		$iter.each(this.mapImages.iterator(), (mapImage) => {
			mapImage.validatePosition();
		})
	}

	/**
	 * Copies all properties from another instance of [[Series]].
	 *
	 * @param {Series}  source  Source series
	 */
	public copyFrom(source: this) {
		this.mapImages.template.copyFrom(source.mapImages.template);
		super.copyFrom(source);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapImageSeries"] = MapImageSeries;
registry.registeredClasses["MapImageSeriesDataItem"] = MapImageSeriesDataItem;
