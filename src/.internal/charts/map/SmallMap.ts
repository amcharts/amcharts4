/**
 * A module for the mini-map control.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { IRectangle } from "../../core/defs/IRectangle";
import { Sprite, ISpriteEvents, AMEvent } from "../../core/Sprite";
import { Rectangle } from "../../core/elements/Rectangle";
import { IPoint } from "../../core/defs/IPoint";
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { MapChart } from "../types/MapChart";
import { MapSeries } from "./MapSeries";
import { List, IListEvents } from "../../core/utils/List";
import { MutableValueDisposer, MultiDisposer } from "../../core/utils/Disposer";
import { registry } from "../../core/Registry";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[SmallMap]].
 */
export interface ISmallMapProperties extends IContainerProperties { }

/**
 * Defines events for [[SmallMap]].
 */
export interface ISmallMapEvents extends IContainerEvents { }

/**
 * Defines adapters for [[SmallMap]].
 *
 * @see {@link Adapter}
 */
export interface ISmallMapAdapters extends IContainerAdapters, ISmallMapProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a "bird's eye" view of the whole map.
 *
 * This control creates a mini-map with the whole of the map, highlighting
 * the area which is in the current viewport of the map map.
 *
 * @see {@link ISmallMapEvents} for a list of available events
 * @see {@link ISmallMapAdapters} for a list of available Adapters
 * @important
 */
export class SmallMap extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: ISmallMapProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISmallMapAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISmallMapEvents;

	/**
	 * A target map.
	 */
	protected _chart: MutableValueDisposer<MapChart> = new MutableValueDisposer<MapChart>();

	/**
	 * A container that holds the visual elements for the mini-map.
	 *
	 * @ignore Exclude from docs
	 */
	public seriesContainer: Container;

	/**
	 * The rectangle element which highlights current viewport.
	 */
	public rectangle: Rectangle;

	/**
	 * A list of map series used to draw the mini-map.
	 */
	protected _series: List<MapSeries>;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "SmallMap";

		// Set defaults
		this.align = "left";
		this.valign = "bottom";
		this.percentHeight = 20;
		this.percentWidth = 20;
		this.margin(5, 5, 5, 5);

		let interfaceColors = new InterfaceColorSet();

		// Set background defailts
		this.background.fillOpacity = 0.9;
		this.background.fill = interfaceColors.getFor("background");

		// Set up events
		this.events.on("hit", this.moveToPosition, this, false);
		this.events.on("maxsizechanged", this.updateMapSize, this, false);

		// Create a container
		this.seriesContainer = this.createChild(Container);
		this.seriesContainer.shouldClone = false;

		// Create an outline rectangle
		let rectangle: Rectangle = this.createChild(Rectangle);
		rectangle.shouldClone = false;
		rectangle.stroke = interfaceColors.getFor("alternativeBackground");
		rectangle.strokeWidth = 1;
		rectangle.strokeOpacity = 0.5;
		rectangle.fill = color(); //"none";
		rectangle.verticalCenter = "middle";
		rectangle.horizontalCenter = "middle";
		rectangle.isMeasured = false;
		rectangle.visible = false;		

		this.rectangle = rectangle;

		this._disposers.push(this._chart);

		// Apply theme
		this.applyTheme();

	}


	/**
	 * A list of map series used to draw the mini-map.
	 *
	 * @readonly
	 * @return Series
	 */
	public get series(): List<MapSeries> {
		if (!this._series) {
			this._series = new List<MapSeries>();
			this._series.events.on("inserted", this.handleSeriesAdded, this, false);
			this._series.events.on("removed", this.handleSeriesRemoved, this, false);
		}
		return this._series;
	}


	/**
	 * Decorates a new series when they are pushed into a `series` list.
	 *
	 * @param event Event
	 */
	protected handleSeriesAdded(event: IListEvents<MapSeries>["inserted"]) {
		let series: MapSeries = event.newValue;
		if (this.chart.series.contains(series)) {
			let newSeries = series.clone();
			this._series.removeValue(series);
			this._series.push(newSeries);
			series = newSeries;

			this.chart.dataUsers.push(newSeries);
		}
		series.chart = this.chart;
		series.parent = this.seriesContainer;
		series.interactionsEnabled = false;
		series.events.on("inited", this.updateMapSize, this, false);
		series.hidden = false;
	}


	/**
	 * Cleans up after series are removed from Scrollbar.
	 *
	 * @param event  Event
	 */
	protected handleSeriesRemoved(event: IListEvents<MapSeries>["removed"]) {
		//let sourceSeries: MapSeries = event.oldValue;
		this.invalidate();
	}

	/**
	 * Moves main map pan position after click on the small map.
	 *
	 * @ignore Exclude from docs
	 * @param event  Event
	 */
	public moveToPosition(event: AMEvent<Sprite, ISpriteEvents>["hit"]) {
		let rectPoint: IPoint = $utils.spritePointToSprite(event.spritePoint, this, this.seriesContainer);
		let geoPoint: IGeoPoint = this.chart.seriesPointToGeo(rectPoint);
		this.chart.zoomToGeoPoint(geoPoint, this.chart.zoomLevel, true);
	}

	/**
	 * A chart/map that this control is meant for.
	 *
	 * @param chart  Chart/map
	 */
	public set chart(chart: MapChart) {
		if (this.chart != chart) {
			this._chart.set(chart, new MultiDisposer([
				//chart.events.on("zoomlevelchanged", this.updateRectangle, this, false),
				chart.events.on("mappositionchanged", this.updateRectangle, this, false),
				chart.events.on("scaleratiochanged", this.updateMapSize, this, false)
			]));
		}
	}

	/**
	 * @return Chart/map
	 */
	public get chart(): MapChart {
		return this._chart.get();
	}

	/**
	 * Updates the viewport recangle as per current map zoom/pan position.
	 *
	 * @ignore Exclude from docs
	 */
	public updateRectangle(): void {
		let chart: MapChart = this.chart;
		let zoomLevel: number = chart.zoomLevel;
		let rectangle: Rectangle = this.rectangle;

		rectangle.width = this.pixelWidth / zoomLevel;
		rectangle.height = this.pixelHeight / zoomLevel;

		let scale: number = Math.min(this.percentWidth, this.percentHeight) / 100;

		let seriesContainer: Container = chart.seriesContainer;

		rectangle.x = Math.ceil(( - seriesContainer.pixelX) * scale / zoomLevel) + this.seriesContainer.pixelX;
		rectangle.y = Math.ceil(( - seriesContainer.pixelY) * scale / zoomLevel) + this.seriesContainer.pixelY;

		rectangle.validate();
	}

	/**
	 * Update map size so that internal elements can redraw themselves after
	 * the size of the small map changes.
	 *
	 * @ignore Exclude from docs
	 */
	public updateMapSize(): void {
		if (this.chart) {
			let scale = this.chart.scaleRatio * Math.min(this.percentWidth, this.percentHeight) / 100;
			this.seriesContainer.scale = scale;

			let bbox: IRectangle = {
				width: 0,
				height: 0,
				x: 0,
				y: 0
			};

			try { // Add exception catching to tame FF
				bbox = this.seriesContainer.group.node.getBBox();
			} catch (err) { }

			if(bbox.width > 0){
				this.rectangle.visible = true;
			}

			this.seriesContainer.x = this.pixelWidth / 2 - bbox.x * scale - bbox.width / 2 * scale;
			this.seriesContainer.y = this.pixelHeight / 2 - bbox.y * scale - bbox.height / 2 * scale;

			this.updateRectangle();
			this.afterDraw();
		}
	}

	/**
	 * Update elements after drawing the small map.
	 */
	protected afterDraw(): void {
		super.afterDraw();
		//this.seriesContainer.moveTo({ x: this.pixelWidth / 2, y: this.pixelHeight / 2 });
		this.rectangle.maskRectangle = { x: -1, y: -1, width: Math.ceil(this.pixelWidth + 2), height: Math.ceil(this.pixelHeight + 2) };
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Set up series
			if ($type.hasValue(config.series) && $type.isArray(config.series)) {
				for (let i = 0, len = config.series.length; i < len; i++) {
					let series = config.series[i];
					if ($type.hasValue(series) && $type.isString(series) && this.map.hasKey(series)) {
						config.series[i] = this.map.getKey(series);
					}
				}
			}

		}

		super.processConfig(config);

	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SmallMap"] = SmallMap;
