/**
 *
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapObject, IMapObjectProperties, IMapObjectAdapters, IMapObjectEvents } from "./MapObject";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { MapImageSeriesDataItem, MapImageSeries } from "./MapImageSeries";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[MapImage]].
 */
export interface IMapImageProperties extends IMapObjectProperties {

	/**
	 * Latitude of the image location.
	 *
	 * @type {number}
	 */
	latitude?: number;

	/**
	 * Longitude of the mage location.
	 *
	 * @type {number}
	 */
	longitude?: number;

}

/**
 * Defines events for [[MapImage]].
 */
export interface IMapImageEvents extends IMapObjectEvents { }

/**
 * Defines adapters for [[MapImage]].
 *
 * @see {@link Adapter}
 */
export interface IMapImageAdapters extends IMapObjectAdapters, IMapImageProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to place an image on the map.
 *
 * @see {@link IMapImageEvents} for a list of available events
 * @see {@link IMapImageAdapters} for a list of available Adapters
 */
export class MapImage extends MapObject {

	/**
	 * Defines available properties.
	 *
	 * @type {IMapImageProperties}
	 */
	public _properties!: IMapImageProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IMapImageAdapters}
	 */
	public _adapter!: IMapImageAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IMapImageEvents}
	 */
	public _events!: IMapImageEvents;

	/**
	 * A related data item.
	 *
	 * @type {MapImageSeriesDataItem}
	 */
	public _dataItem: MapImageSeriesDataItem;

	/**
	 * A map series this object belongs to.
	 *
	 * @type {MapImageSeries}
	 */
	public series: MapImageSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "MapImage";
		this.applyTheme();
	}

	/**
	 * Latitude image is placed at.
	 *
	 * @param {number}  value  Latitude
	 */
	public set latitude(value: number) {
		this.setPropertyValue("latitude", value, false, true);
	}

	/**
	 * @return {number} Latitude
	 */
	public get latitude(): number {
		return this.getPropertyValue("latitude");
	}

	/**
	 * Longitude image is placed on.
	 *
	 * @param {number}  value  Longitude
	 */
	public set longitude(value: number) {
		this.setPropertyValue("longitude", value, false, true);
	}

	/**
	 * @return {number} Longitude
	 */
	public get longitude(): number {
		return this.getPropertyValue("longitude");
	}

	/**
	 * Repositions the image to it's current position.
	 *
	 * @ignore Exclude from docs
	 */
	public validatePosition(): void {
		if ($type.isNumber(this.latitude) && $type.isNumber(this.longitude)) {
			this.moveTo(this.series.chart.projection.convert({ latitude: this.latitude, longitude: this.longitude }));
		}
		super.validatePosition();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapImage"] = MapImage;
