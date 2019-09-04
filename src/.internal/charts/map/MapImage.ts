/**
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapObject, IMapObjectProperties, IMapObjectAdapters, IMapObjectEvents } from "./MapObject";
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
	 */
	latitude?: number;

	/**
	 * Longitude of the mage location.
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
	 */
	public _properties!: IMapImageProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapImageAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapImageEvents;

	/**
	 * A related data item.
	 */
	public _dataItem: MapImageSeriesDataItem;

	/**
	 * A map series this object belongs to.
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
	 * @param value  Latitude
	 */
	public set latitude(value: number) {
		this.setPropertyValue("latitude", value, false, true);
		this.updateExtremes();
	}

	/**
	 * @return Latitude
	 */
	public get latitude(): number {
		return this.getPropertyValue("latitude");
	}

	/**
	 * Longitude image is placed on.
	 *
	 * @param value  Longitude
	 */
	public set longitude(value: number) {
		this.setPropertyValue("longitude", value, false, true);
		this.updateExtremes();
	}

	/**
	 * @return Longitude
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
			//this.moveTo(this.series.chart.projection.convert({ latitude: this.latitude, longitude: this.longitude }));
			let p = this.series.chart.projection.d3Projection([this.longitude, this.latitude]);

			let visible: any = this.series.chart.projection.d3Path({ type: 'Point', coordinates: [this.longitude, this.latitude] });

			if (!visible) {
				this.__disabled = true;
			}
			else {
				this.__disabled = false;
			}

			this.moveTo({ x: p[0], y: p[1] });
		}
		super.validatePosition();
	}

	/**
	 * @ignore
	 */
	public getFeature(): { "type": "Feature", geometry: { type: "Point", coordinates: [number, number] } } {
		return { "type": "Feature", geometry: { type: "Point", coordinates: [this.longitude, this.latitude] } };
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapImage"] = MapImage;
