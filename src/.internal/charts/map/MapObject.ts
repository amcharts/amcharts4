/**
 * Map object module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { MapSeries, MapSeriesDataItem } from "./MapSeries";
import { registry } from "../../core/Registry";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { IPoint } from "../../core/defs/IPoint";
import * as $math from "../../core/utils/Math";
import * as d3geo from "d3-geo";
import * as $type from "../../core/utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines propeties for [[MapObject]].
 */
export interface IMapObjectProperties extends IContainerProperties {

	/**
	 * A custom zoom level to use when `zoomToMapObject()` is called on this
	 * map object.
	 */
	zoomLevel?: number;

	/**
	 * A custom point to use when `zoomToMapObject()` is called on this map
	 * object.
	 */
	zoomGeoPoint?: IGeoPoint;

}

/**
 * Defines events for [[MapObject]].
 */
export interface IMapObjectEvents extends IContainerEvents {
	geoBoundsChanged: {}
}

/**
 * Defines adapters for [[MapObject]].
 *
 * @see {@link Adapter}
 */
export interface IMapObjectAdapters extends IContainerAdapters, IMapObjectProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A base class for all map objects: lines, images, etc.
 *
 * @see {@link IMapObjectEvents} for a list of available events
 * @see {@link IMapObjectAdapters} for a list of available Adapters
 */
export class MapObject extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapObjectProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapObjectAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapObjectEvents;

	/**
	 * A map series this object belongs to.
	 */
	public series: MapSeries;

	public _dataItem: MapSeriesDataItem;


	/**
	 * Longitude of the East-most point of the element.
	 */
	protected _east: number;

	/**
	 * Longitude of the West-most point of the element.
	 */
	protected _west: number;

	/**
	 * Latitude of the South-most point of the element.
	 */
	protected _south: number;

	/**
	 * Latitude of the North-most point of the element.
	 */
	protected _north: number;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "MapObject";

		// Set defaults
		this.isMeasured = false;
		this.layout = "none";
		this.clickable = true;

		// Apply theme
		this.applyTheme();

	}

	/**
	 * (Re)validates this object, forcing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		if (this.series) {
			this.readerTitle = this.series.itemReaderText;
		}
		super.validate();
	}


	/**
	 * Updates the item's bounding coordinates: coordinates of the East, West,
	 * North, and South-most points.
	 *
	 * @ignore Exclude from docs
	 */
	public updateExtremes(): void {
		let feature = this.getFeature();
		if (feature) {
			let geometry = feature.geometry;

			if (geometry) {				
				let bounds = d3geo.geoBounds(geometry);

				let west = bounds[0][0];
				let south = bounds[0][1];

				let north = bounds[1][1];
				let east = bounds[1][0];

				let changed = false;
				if (north != this.north) {
					this._north = $math.round(north, 8);
					changed = true;
				}

				if (south != this.south) {
					this._south = $math.round(south);
					changed = true;
				}

				if (east != this.east) {
					this._east = $math.round(east);
					changed = true;
				}

				if (west != this.west) {
					this._west = $math.round(west);
					changed = true;
				}

				if (changed) {
					this.dispatch("geoBoundsChanged");
					if(this.series){
						this.series.invalidateDataItems();
					}
				}
			}
		}
	}

	/**
	 * @ignore
	 */
	public getFeature(): any {
		return {};
	}

	/**
	 * Longitude of the East-most point of the element.
	 */
	public get east(): number {
		if ($type.isNumber(this._east)) {
			return this._east;
		}
		else if (this.dataItem) {
			return this.dataItem.east;
		}
	}

	/**
	 * Longitude of the West-most point of the element.
	 */
	public get west(): number {
		if ($type.isNumber(this._west)) {
			return this._west;
		}
		else if (this.dataItem) {
			return this.dataItem.west;
		}
	}

	/**
	 * Latitude of the South-most point of the element.
	 */
	public get south(): number {
		if ($type.isNumber(this._south)) {
			return this._south;
		}
		else if (this.dataItem) {
			return this.dataItem.south;
		}
	}

	/**
	 * Latitude of the North-most point of the element.
	 */
	public get north(): number {
		if ($type.isNumber(this._north)) {
			return this._north;
		}
		else if (this.dataItem) {
			return this.dataItem.north;
		}
	}

	/**
	 * Shows the element's [[Tooltip]].
	 *
	 * A tooltip will be populated using text templates in either `tooltipHTML` or
	 * `tooltipText` as well as data in `tooltipDataItem`.
	 *
	 * @see {@link Tooltip}
	 * @param optional point (sprite-related) to which tooltip must point.
	 * @return returns true if the tooltip was shown and false if it wasn't (no text was found)
	 */
	public showTooltip(point?: IPoint): boolean {
		const res = super.showTooltip(point);
		if (res && this.showTooltipOn == "always" && !this.series.chart.events.has("mappositionchanged", this.handleTooltipMove, this)) {
			this.series.chart.events.on("mappositionchanged", this.handleTooltipMove, this);
		}
		return res;
	}

	protected handleTooltipMove(ev: any): void {
		this.showTooltip();
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapObject"] = MapObject;
