/**
 * Graticule (map grid) series functionality.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapLineSeries, MapLineSeriesDataItem, IMapLineSeriesProperties, IMapLineSeriesDataFields, IMapLineSeriesAdapters, IMapLineSeriesEvents } from "./MapLineSeries";
import { Graticule } from "./Graticule";
import { registry } from "../../core/Registry";
import * as d3geo from "d3-geo";
import * as $array from "../../core/utils/Array";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[GraticuleSeries]].
 *
 * @see {@link DataItem}
 */
export class GraticuleSeriesDataItem extends MapLineSeriesDataItem {

	/**
	 * A [[Graticule]] element related to this data item.
	 */
	public _mapLine: Graticule;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: GraticuleSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "GraticuleSeriesDataItem";
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
 * Defines data fields for [[GraticuleSeries]].
 */
export interface IGraticuleSeriesDataFields extends IMapLineSeriesDataFields { }

/**
 * Defines properties for [[GraticuleSeries]].
 */
export interface IGraticuleSeriesProperties extends IMapLineSeriesProperties {
	/**
	 * Draw a graticule (grid) every X degrees of latitude.
	 *
	 * @default 10
	 */
	latitudeStep?: number;

	/**
	 * Draw a graticule (grid) every X degrees of longitude.
	 *
	 * @default 10
	 */
	longitudeStep?: number;

	/**
	 * Draw a thicker (major) graticule every X degrees of latitude.
	 *
	 * @default 90
	 */
	// majorLatitudeStep?: number;

	/**
	 * Draw a thicker (major) graticule every X degrees of longitude.
	 *
	 * @default 360
	 */
	// majorLongitudeStep?: number;

	/**
	 * Whether to cap graticules (grid) to actual span of the map (`true`), e.g.
	 * where there are polygons, or draw full-world grid (`false`).
	 *
	 * For world maps, using `false` makes sense. For smaller maps - not so much.
	 *
	 * If set to `false`, the grid will be drawn from this series `east` to
	 * `west`, and from `south` to `north` (default values: `east = -180`;
	 * `west = 180`; `south =-90`; `north =90`).
	 *
	 * These can be overridden by setting `GraticuleSeries`' respective
	 * properties.
	 *
	 * @default true
	 */
	fitExtent?: boolean;

	/**
	 * Whether to draw all the grid as a single element or as separate lines.
	 *
	 * Setting `true` (default) will result in better performance, whereas
	 * `false` allows setting visual properties of each line individually.
	 *
	 * @default true
	 */
	singleSprite?: boolean;
}

/**
 * Defines events for [[GraticuleSeries]].
 */
export interface IGraticuleSeriesEvents extends IMapLineSeriesEvents { }

/**
 * Defines adapters for [[GraticuleSeries]].
 *
 * @see {@link Adapter}
 */
export interface IGraticuleSeriesAdapters extends IMapLineSeriesAdapters, IGraticuleSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This class is used to create a set of graticules (map grid).
 *
 * To enable, create like you would create any regular map series:
 *
 * ```TypeScript
 * let graticule = chart.series.push(new am4maps.GraticuleSeries())
 * graticule.mapLines.template.line.stroke = am4core.color("#000000");
 * graticule.mapLines.template.line.strokeOpacity = 0.1;
 * ```
 * ```JavaScript
 * var graticule = chart.series.push(new am4maps.GraticuleSeries())
 * graticule.mapLines.template.line.stroke = am4core.color("#000000");
 * graticule.mapLines.template.line.strokeOpacity = 0.1;
 * ```
 * ```JSON
 * {
 *   // ...
 *   "series": [{
 *     "type": "GraticuleSeries",
 *     "mapLines": {
 *       "line": {
 *         "stroke": "#000000",
 *         "strokeOpacity": 0.1
 *       }
 *     }
 *   }]
 * }
 * ```
 *
 * @since 4.3.0
 * @see {@link IGraticuleSeriesEvents} for a list of available Events
 * @see {@link IGraticuleSeriesAdapters} for a list of available Adapters
 * @important
 */
export class GraticuleSeries extends MapLineSeries {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IGraticuleSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IGraticuleSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IGraticuleSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IGraticuleSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: GraticuleSeriesDataItem;

	/**
	 * Defines the type of the line items in this series.
	 */
	public _mapLine: Graticule;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "GraticuleSeries";

		this.longitudeStep = 10;

		this.latitudeStep = 10;

		this.north = 90;
		this.south = -90;
		this.east = -180;
		this.west = 180;

		//this.majorLatitudeStep = 90;
		//this.majorLongitudeStep = 360;

		this.fitExtent = true;

		this.singleSprite = true;

		this.events.disableType("geoBoundsChanged");

		this.mapLines.template.line.strokeOpacity = 0.08;

		this.ignoreBounds = false;

		this.hiddenInLegend = true;

		this.applyTheme();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new GraticuleSeriesDataItem();
	}

	public validateData() {
		super.validateData();

		this.mapLines.clear();

		let graticule = d3geo.geoGraticule();

		if (graticule) {
			graticule.stepMinor([this.longitudeStep, this.latitudeStep]);
			graticule.stepMajor([360, 360]);

			let chart = this.chart;
			if (this.fitExtent) {
				graticule.extent([[chart.east, chart.north], [chart.west, chart.south]]);
			}
			else {
				graticule.extent([[this.east, this.north], [this.west, this.south]]);
			}

			if (this.singleSprite) {
				let mapLine = this.mapLines.create();
				mapLine.multiLine = graticule().coordinates as Array<Array<[number, number]>>;
			}
			else {
				let lineStrings = graticule.lines();

				$array.each(lineStrings, (lineString) => {
					let mapLine = this.mapLines.create();
					mapLine.multiLine = [lineString.coordinates as Array<[number, number]>];
				})
			}
		}
	}

	/**
	 * Returns a new line instance of suitable type.
	 *
	 * @return New line
	 */
	protected createLine(): this["_mapLine"] {
		return new Graticule();
	}

	/**
	 * Draw a graticule (grid) every X degrees of latitude.
	 *
	 * @default 10
	 * @param  value Step
	 */
	public set latitudeStep(value: number) {
		if (this.setPropertyValue("latitudeStep", value)) {
			this.invalidateData();
		}
	}

	/**
	 * @return Step
	 */
	public get latitudeStep(): number {
		return this.getPropertyValue("latitudeStep");
	}

	/**
	 * Draw a graticule (grid) every X degrees of longitude.
	 *
	 * @default 10
	 * @param  value  Step
	 */
	public set longitudeStep(value: number) {
		if (this.setPropertyValue("longitudeStep", value)) {
			this.invalidateData();
		}
	}

	/**
	 * @return Step
	 */
	public get longitudeStep(): number {
		return this.getPropertyValue("longitudeStep");
	}

	/**
	 * Draw a thicker (major) graticule every X degrees of latitude.
	 *
	 * @default 90
	 * @param  value  Step
	 */
	// public set majorLatitudeStep(value: number) {
	// 	if (this.setPropertyValue("majorLatitudeStep", value)) {
	// 		this.invalidateData();
	// 	}
	// }

	/**
	 * @return Step
	 */
	// public get majorLatitudeStep(): number {
	// 	return this.getPropertyValue("majorLatitudeStep");
	// }

	/**
	 * Draw a thicker (major) graticule every X degrees of longitude.
	 *
	 * @default 360
	 * @param  value  Step
	 */
	// public set majorLongitudeStep(value: number) {
	// 	if (this.setPropertyValue("majorLongitudeStep", value)) {
	// 		this.invalidateData();
	// 	}
	// }

	/**
	 * @return Step
	 */
	// public get majorLongitudeStep(): number {
	// 	return this.getPropertyValue("majorLongitudeStep");
	// }

	/**
	 * Whether to cap graticules (grid) to actual span of the map (`true`), e.g.
	 * where there are polygons, or draw full-world grid (`false`).
	 *
	 * For world maps, using `false` makes sense. For smaller maps - not so much.
	 *
	 * If set to `false`, the grid will be drawn from this series `east` to
	 * `west`, and from `south` to `north` (default values: `east = -180`;
	 * `west = 180`; `south =-90`; `north =90`).
	 *
	 * These can be overridden by setting `GraticuleSeries`' respective
	 * properties.
	 *
	 * @default true
	 * @param  value  Fit?
	 */
	public set fitExtent(value: boolean) {
		if (this.setPropertyValue("fitExtent", value)) {
			this.invalidateData();
		}
	}

	/**
	 * @return Fit?
	 */
	public get fitExtent(): boolean {
		return this.getPropertyValue("fitExtent");
	}

	/**
	 * Whether to draw all the grid as a single element or as separate lines.
	 *
	 * Setting `true` (default) will result in better performance, whereas
	 * `false` allows setting visual properties of each line individually.
	 *
	 * @default true
	 * @param  value  Use single sprite?
	 */
	public set singleSprite(value: boolean) {
		if (this.setPropertyValue("singleSprite", value)) {
			this.invalidateData();
		}
	}

	/**
	 * @return Use single sprite?
	 */
	public get singleSprite(): boolean {
		return this.getPropertyValue("singleSprite");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["GraticuleSeries"] = GraticuleSeries;
registry.registeredClasses["GraticuleSeriesDataItem"] = GraticuleSeriesDataItem;
