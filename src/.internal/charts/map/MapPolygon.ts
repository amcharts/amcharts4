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
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { MapPolygonSeriesDataItem, MapPolygonSeries } from "./MapPolygonSeries";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { Polygon } from "../../core/elements/Polygon";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";


/**
 * ============================f================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[MapPolygon]].
 */
export interface IMapPolygonProperties extends IMapObjectProperties {

	/**
	 * Set of coordinates for the polygon.
	 */
	multiGeoPolygon?: IGeoPoint[][][];

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
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "MapPolygon";

		this.polygon = this.createChild(Polygon);
		this.polygon.shouldClone = false;

		let interfaceColors = new InterfaceColorSet();

		this.fill = interfaceColors.getFor("secondaryButton");
		this.stroke = interfaceColors.getFor("secondaryButtonStroke");
		this.strokeOpacity = 1;

		this.tooltipPosition = "pointer";

		this.nonScalingStroke = true;

		this.applyTheme();
	}

	/**
	 * Set of coordinates for the polygon.
	 *
	 * @param multiGeoPolygon  Polygon coordinates
	 */
	public set multiGeoPolygon(multiGeoPolygon: IGeoPoint[][][]) {
		this.setPropertyValue("multiGeoPolygon", multiGeoPolygon, true);
	}

	/**
	 * @return Polygon coordinates
	 */
	public get multiGeoPolygon(): IGeoPoint[][][] {
		return this.getPropertyValue("multiGeoPolygon");
	}

	/**
	 * (Re)validates the polygon, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		if (this.series) {
			this.polygon.points = this.series.chart.projection.projectGeoArea(this.multiGeoPolygon);
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
	 * Calculated polygon center latitude.
	 *
	 * @readonly
	 * @return Center latitude
	 */
	public get latitude(): number {
		let dataItem = this.dataItem;
		return dataItem.north + (dataItem.south - dataItem.north) / 2;
	}

	/**
	 * Calculated polygon center longitude.
	 *
	 * @readonly
	 * @return Center longitude
	 */
	public get longitude(): number {
		let dataItem = this.dataItem;
		return dataItem.east + (dataItem.west - dataItem.east) / 2;
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
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapPolygon"] = MapPolygon;
