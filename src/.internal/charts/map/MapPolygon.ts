/**
 * Map polygon module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapObject, IMapObjectProperties, IMapObjectAdapters, IMapObjectEvents } from "./MapObject";
import { MapPolygonSeriesDataItem, MapPolygonSeries } from "./MapPolygonSeries";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { Polygon } from "../../core/elements/Polygon";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import $polylabel from "polylabel";
import * as $mapUtils from "./MapUtils";
import * as d3geo from "d3-geo";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[MapPolygon]].
 */
export interface IMapPolygonProperties extends IMapObjectProperties {

	/**
	 * Set of geographical coordinates for the polygon.
	 */
	multiGeoPolygon?: IGeoPoint[][][];

	/**
	 * Set of screen coordinates for the polygon.
	 */
	multiPolygon?: number[][][];

	/**
	 * Latitude of the visual center of the polygon.
	 */
	visualLatitude?: number;

	/**
	 * Longitude of the visual center of the polygon.
	 */
	visualLongitude?: number;
}

/**
 * Defines events for [[MapPolygon]].
 */
export interface IMapPolygonEvents extends IMapObjectEvents { }

/**
 * Defines adapters for [[MapPolygon]].
 *
 * @see {@link Adapter}
 */
export interface IMapPolygonAdapters extends IMapObjectAdapters, IMapPolygonProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to draw a polygon on the map.
 *
 * @see {@link IMapPolygonEvents} for a list of available events
 * @see {@link IMapPolygonAdapters} for a list of available Adapters
 */
export class MapPolygon extends MapObject {

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapPolygonProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapPolygonAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapPolygonEvents;

	/**
	 * A visual polygon element.
	 */
	public polygon: Polygon;

	/**
	 * A related data item.
	 */
	public _dataItem: MapPolygonSeriesDataItem;

	/**
	 * A map series this object belongs to.
	 */
	public series: MapPolygonSeries;

	/**
	 * Latitude of the visual center of the polygon.
	 */
	protected _visualLatitude: number;

	/**
	 * Longitude of the visual center of the polygon.
	 */
	protected _visualLongitude: number;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "MapPolygon";

		this.polygon = this.createChild(Polygon);
		this.polygon.shouldClone = false;
		this.polygon.applyOnClones = true;

		let interfaceColors = new InterfaceColorSet();

		this.fill = interfaceColors.getFor("secondaryButton");
		this.stroke = interfaceColors.getFor("secondaryButtonStroke");
		this.strokeOpacity = 1;

		this.tooltipPosition = "pointer";

		this.nonScalingStroke = true;

		this.applyTheme();
	}

	/**
	 * @ignore
	 */
	public getFeature(): { "type": "Feature", geometry: { type: "MultiPolygon", coordinates: number[][][][] } } {
		if (this.multiPolygon && this.multiPolygon.length > 0) {
			return { "type": "Feature", geometry: { type: "MultiPolygon", coordinates: this.multiPolygon } };
		}
	}

	/**
	 * Set of coordinates for the polygon.
	 *
	 * @param multiGeoPolygon  Polygon coordinates
	 */
	public set multiGeoPolygon(multiGeoPolygon: IGeoPoint[][][]) {
		this.setPropertyValue("multiGeoPolygon", multiGeoPolygon, true);
		this.multiPolygon = $mapUtils.multiGeoPolygonToMultipolygon(multiGeoPolygon);
	}

	/**
	 * @return Polygon coordinates
	 */
	public get multiGeoPolygon(): IGeoPoint[][][] {
		let multiGeoPolygon = this.getPropertyValue("multiGeoPolygon");
		if (!multiGeoPolygon && this.dataItem) {
			multiGeoPolygon = this.dataItem.multiPolygon;
		}
		return multiGeoPolygon;
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
	public set multiPolygon(multiPolygon: number[][][][]) {
		if (this.setPropertyValue("multiPolygon", multiPolygon)) {
			this.updateExtremes();
		}
	}

	/**
	 * @return Coordinates
	 */
	public get multiPolygon(): number[][][][] {
		let multiPolygon = this.getPropertyValue("multiPolygon");
		if (!multiPolygon && this.dataItem) {
			multiPolygon = this.dataItem.multiPolygon;
		}
		return multiPolygon;
	}


	/**
	 * (Re)validates the polygon, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		if (this.series) {
			let pathGenerator = this.series.chart.projection.d3Path;

			if (this.multiPolygon) {

				if (this.series) {
					let feature = { type: "MultiPolygon", coordinates: this.multiPolygon };
					this.polygon.path = pathGenerator(<any>feature);
					//let bounds = pathGenerator.bounds(<any>feature)
					//let bbox: IRectangle = { x: bounds[0][0], y: bounds[0][1], width: bounds[1][0] - bounds[0][0], height: bounds[1][1] - bounds[1][1] };
					//	let bbox = this.polygon.group.getBBox();
					//	this.polygon.definedBBox = bbox;
					//	this.definedBBox = bbox;
					//	this.boxArea = bbox.width * bbox.height;
				}

				if (this.series.calculateVisualCenter) {
					let biggestArea = 0;
					let biggestPolygon = this.multiPolygon[0];

					if (this.multiPolygon.length > 1) {
						for (let i = 0; i < this.multiPolygon.length; i++) {
							let polygon = this.multiPolygon[i];
							let area = d3geo.geoArea({ type: "Polygon", coordinates: polygon });

							if (area > biggestArea) {
								biggestPolygon = polygon;
								biggestArea = area;
							}
						}
					}

					let center = $polylabel(biggestPolygon);

					this._visualLongitude = center[0];
					this._visualLatitude = center[1];
				}
				else {
					this._visualLongitude = this.longitude;
					this._visualLatitude = this.latitude;
				}
			}
		}

		super.validate();
	}

	/**
	 * @ignore Exclude from docs
	 */
	public measureElement(): void {
		// Overriding, just to avoid extra measure
	}

	/**
	 * Latitude of the geometrical center of the polygon.
	 *
	 * @readonly
	 * @return Center latitude
	 */
	public get latitude(): number {
		return this.north + (this.south - this.north) / 2;
	}

	/**
	 * Longitude of the geometrical center of the polygon.
	 *
	 * @readonly
	 * @return Center longitude
	 */
	public get longitude(): number {
		return this.east + (this.west - this.east) / 2;
	}

	/**
	 * Latitude of the visual center of the polygon.
	 *
	 * It may (and probably won't) coincide with geometrical center.
	 *
	 * @since 4.3.0
	 * @param  value  Latitude
	 */
	public set visualLatitude(value: number) {
		this.setPropertyValue("visualLatitude", value);
	}

	/**
	 * @return  Latitude
	 */
	public get visualLatitude(): number {
		let latitude = this.getPropertyValue("visualLatitude");
		if ($type.isNumber(latitude)) {
			return (latitude);
		}
		return this.adapter.apply(
			"visualLatitude",
			this._visualLatitude
		);
	}

	/**
	 * Longitude of the visual center of the polygon.
	 *
	 * It may (and probably won't) coincide with geometrical center.
	 *
	 * @since 4.3.0
	 * @param  value  Longitude
	 */
	public set visualLongitude(value: number) {
		this.setPropertyValue("visualLongitude", value);
	}

	/**
	 * @return  Longitude
	 */
	public get visualLongitude(): number {
		let longitude = this.getPropertyValue("visualLongitude");
		if ($type.isNumber(longitude)) {
			return (longitude);
		}
		return this.adapter.apply(
			"visualLongitude",
			this._visualLongitude
		);
	}


	/**
	 * Not 100% sure about this, as if we add something to MapPolygon this
	 * won't be true, but otherwise we will get all 0 and the tooltip won't
	 * be positioned properly
	 * @hidden
	 */

	/**
	 * Element's width in pixels.
	 *
	 * @readonly
	 * @return Width (px)
	 */
	public get pixelWidth(): number {
		return this.polygon.pixelWidth;
	}

	/**
	 * Element's height in pixels.
	 *
	 * @readonly
	 * @return Width (px)
	 */
	public get pixelHeight(): number {
		return this.polygon.pixelHeight;
	}

	/**
	 * Copies all properties from another instance of [[MapPolygon]].
	 *
	 * @param source  Source series
	 */
	public copyFrom(source: this) {
		super.copyFrom(source);
		this.polygon.copyFrom(source.polygon);
	}

	/**
	 * @ignore
	 */
	public updateExtremes() {
		super.updateExtremes();
	}

	/**
	 * @ignore
	 * used to sorth polygons from big to small
	 */
	public get boxArea() {
		return (this.north - this.south) * (this.east - this.west);
	}

	/**
	 * X coordinate for the slice tooltip.
	 *
	 * @return X
	 */
	protected getTooltipX(): number {
		return this.series.chart.projection.convert({longitude:this.visualLongitude, latitude:this.visualLatitude}).x;
	}

	/**
	 * Y coordinate for the slice tooltip.
	 *
	 * @return Y
	 */
	protected getTooltipY(): number {
		return this.series.chart.projection.convert({longitude:this.visualLongitude, latitude:this.visualLatitude}).y
	}	
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapPolygon"] = MapPolygon;
