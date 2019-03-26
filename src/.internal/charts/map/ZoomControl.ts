/**
 * Zoom control module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Sprite, ISpriteEvents, AMEvent } from "../../core/Sprite";
import { Button } from "../../core/elements/Button";
import { MapChart } from "../types/MapChart";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
import { MutableValueDisposer, MultiDisposer } from "../../core/utils/Disposer";
import { keyboard } from "../../core/utils/Keyboard";
import { getInteraction } from "../../core/interaction/Interaction";
import { percent } from "../../core/utils/Percent";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[ZoomControl]].
 */
export interface IZoomControlProperties extends IContainerProperties { }

/**
 * Defines events for [[ZoomControl]].
 */
export interface IZoomControlEvents extends IContainerEvents { }

/**
 * Defines adapters for [[ZoomControl]].
 *
 * @see {@link Adapter}
 */
export interface IZoomControlAdapters extends IContainerAdapters, IZoomControlProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a control for zooming the map.
 *
 * @see {@link IZoomControlEvents} for a list of available events
 * @see {@link IZoomControlAdapters} for a list of available Adapters
 * @important
 */
export class ZoomControl extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IZoomControlProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IZoomControlAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IZoomControlEvents;

	/**
	 * Zoom in button element.
	 */
	public plusButton: Button;

	/**
	 * Zoom out button element.
	 */
	public minusButton: Button;

	/**
	 * A zoom slider background element.
	 */
	public slider: Container;

	/**
	 * A zoom slider thumb element.
	 */
	public thumb: Button;

	/**
	 * A target map.
	 */
	protected _chart: MutableValueDisposer<MapChart> = new MutableValueDisposer<MapChart>();

	/**
	 * A type to use for the background element for zoom control.
	 */
	public _background: RoundedRectangle;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "ZoomControl";

		this.align = "right";
		this.valign = "bottom";

		this.layout = "vertical";
		this.padding(5, 5, 5, 5);

		let interfaceColors = new InterfaceColorSet();

		let plusButton: Button = this.createChild(Button);
		plusButton.shouldClone = false;
		plusButton.label.text = "+";
		//plusButton.fontFamily = "Verdana";
		this.plusButton = plusButton;

		let slider: Container = this.createChild(Container);
		slider.shouldClone = false;
		slider.background.fill = interfaceColors.getFor("alternativeBackground");
		slider.background.fillOpacity = 0.05;
		slider.background.events.on("hit", this.handleBackgroundClick, this, false);
		slider.events.on("sizechanged", this.updateThumbSize, this, false);
		this.slider = slider;

		let thumb: Button = slider.createChild(Button);
		thumb.shouldClone = false;
		thumb.padding(0, 0, 0, 0);
		thumb.draggable = true;
		thumb.events.on("drag", this.handleThumbDrag, this, false);
		this.thumb = thumb;

		let minusButton: Button = this.createChild(Button);
		minusButton.shouldClone = false;
		minusButton.label.text = "-";
		//minusButton.fontFamily = "Verdana";
		this.minusButton = minusButton;

		// Set roles
		this.thumb.role = "slider";
		this.thumb.readerLive = "polite";

		// Set reader text
		this.thumb.readerTitle = this.language.translate("Use arrow keys to zoom in and out");
		this.minusButton.readerTitle = this.language.translate("Press ENTER to zoom in");
		this.plusButton.readerTitle = this.language.translate("Press ENTER to zoom out");

		this.applyTheme();

		this.events.on("propertychanged", (event) => {
			if (event.property == "layout") {
				this.fixLayout();
			}
		}, undefined, false);

		this._disposers.push(this._chart);

		this.fixLayout();
	}

	/**
	 * @ignore
	 */
	protected fixLayout() {

		let plusButton = this.plusButton;
		let minusButton = this.minusButton;

		let thumb = this.thumb;
		let slider = this.slider;

		plusButton.x = undefined;
		plusButton.y = undefined;

		minusButton.x = undefined;
		minusButton.y = undefined;

		thumb.x = undefined;
		thumb.y = undefined;

		slider.x = undefined;
		slider.y = undefined;

		plusButton.padding(6, 10, 6, 10);
		minusButton.padding(6, 10, 6, 10);

		minusButton.label.align = "center";
		minusButton.label.valign = "middle";

		plusButton.label.align = "center";
		plusButton.label.valign = "middle";

		if (this.layout == "vertical") {
			this.width = 40;
			this.height = undefined;

			minusButton.width = percent(100);
			minusButton.height = undefined;

			thumb.width = percent(100);
			thumb.height = undefined;

			plusButton.width = percent(100);
			plusButton.height = undefined;

			slider.width = percent(100);
			minusButton.marginTop = 1;
			plusButton.marginBottom = 2;

			slider.height = 0;

			minusButton.toFront();
			plusButton.toBack();

			thumb.minX = 0;
			thumb.maxX = 0;
			thumb.minY = 0;


		}
		else if (this.layout == "horizontal") {
			this.height = 40;
			this.width = undefined;

			minusButton.height = percent(100);
			minusButton.width = undefined;

			plusButton.height = percent(100);
			plusButton.width = undefined;

			thumb.height = percent(100);
			thumb.width = undefined;

			thumb.minX = 0;
			thumb.minY = 0;
			thumb.maxY = 0;

			slider.height = percent(100);
			slider.width = 0;

			minusButton.toBack();
			plusButton.toFront();
		}
	}


	/**
	 * Handles zoom operation after clicking on the slider background.
	 *
	 * @ignore Exclude from docs
	 * @param event  Event
	 */
	public handleBackgroundClick(event: AMEvent<Sprite, ISpriteEvents>["hit"]): void {
		let sprite: Sprite = event.target;
		let y: number = event.spritePoint.y;
		let chart: MapChart = this.chart;

		let maxPower: number = Math.log(chart.maxZoomLevel) / Math.LN2;
		let minPower: number = Math.log(chart.minZoomLevel) / Math.LN2;

		let power: number = (sprite.pixelHeight - y) / sprite.pixelHeight * (minPower + (maxPower - minPower));
		let zoomLevel: number = Math.pow(2, power);
		chart.zoomToGeoPoint(chart.zoomGeoPoint, zoomLevel);
	}

	/**
	 * A main chart/map that this zoom control is for.
	 *
	 * @param chart  Map/chart
	 */
	public set chart(chart: MapChart) {
		this._chart.set(chart, new MultiDisposer([
			chart.events.on("maxsizechanged", this.updateThumbSize, this, false),
			chart.events.on("zoomlevelchanged", this.updateThumb, this, false),

			this.minusButton.events.on("hit", () => { chart.zoomOut(chart.zoomGeoPoint) }, chart, false),

			getInteraction().body.events.on("keyup", (ev) => {
				if (this.topParent.hasFocused) {
					if (keyboard.isKey(ev.event, "enter")) {
						if (this.minusButton.isFocused) {
							chart.zoomOut()
						}
						else if (this.plusButton.isFocused) {
							chart.zoomIn()
						}
					}
					else if (keyboard.isKey(ev.event, "plus")) {
						chart.zoomIn();
					}
					else if (keyboard.isKey(ev.event, "minus")) {
						chart.zoomOut();
					}
				}
			}, chart),
			this.plusButton.events.on("hit", () => { chart.zoomIn(chart.zoomGeoPoint) }, chart, false)
		]));
	}

	/**
	 * @return Map/chart
	 */
	public get chart(): MapChart {
		return this._chart.get();
	}

	/**
	 * Updates the slider's thumb size based on the available zoom space.
	 *
	 * @ignore Exclude from docs
	 */
	public updateThumbSize(): void {
		let chart = this.chart;
		if (chart) {
			let slider: Container = this.slider;
			let thumb: Button = this.thumb;
			if (this.layout == "vertical") {
				thumb.minHeight = Math.min(this.slider.pixelHeight, 20);

				thumb.height = slider.pixelHeight / this.stepCount;
				thumb.maxY = slider.pixelHeight - thumb.pixelHeight;

				if (thumb.pixelHeight <= 1) {
					thumb.visible = false;
				}
				else {
					thumb.visible = true;
				}
			}
			else {
				thumb.minWidth = Math.min(this.slider.pixelWidth, 20);
				thumb.width = slider.pixelWidth / this.stepCount;
				thumb.maxX = slider.pixelWidth - thumb.pixelWidth;

				if (thumb.pixelWidth <= 1) {
					thumb.visible = false;
				}
				else {
					thumb.visible = true;
				}
			}
		}
	}

	/**
	 * Updates thumb according to current zoom position from map.
	 *
	 * @ignore Exclude from docs
	 */
	public updateThumb(): void {
		let slider: Container = this.slider;
		let chart: MapChart = this.chart;
		let thumb: Button = this.thumb;

		if (!thumb.isDown) {
			let step: number = (Math.log(chart.zoomLevel) - Math.log(this.chart.minZoomLevel)) / Math.LN2;

			if (this.layout == "vertical") {
				thumb.y = slider.pixelHeight - (slider.pixelHeight - thumb.pixelHeight) * step / this.stepCount - thumb.pixelHeight;
			}
			else {
				thumb.x = slider.pixelWidth * step / this.stepCount;
			}
		}
	}

	/**
	 * Zooms the actual map when slider position changes.
	 *
	 * @ignore Exclude from docs
	 */
	public handleThumbDrag(): void {
		let slider: Container = this.slider;
		let chart: MapChart = this.chart;
		let thumb: Button = this.thumb;
		let step: number;

		let minStep = Math.log(this.chart.minZoomLevel) / Math.LN2;

		if (this.layout == "vertical") {
			step = this.stepCount * (slider.pixelHeight - thumb.pixelY - thumb.pixelHeight) / (slider.pixelHeight - thumb.pixelHeight);
		}
		else {
			step = this.stepCount * thumb.pixelX / slider.pixelWidth;
		}
		step = minStep + step;

		let zoomLevel: number = Math.pow(2, step);
		chart.zoomToGeoPoint(undefined, zoomLevel, false, 0);
	}

	/**
	 * Returns the step countfor the slider grid according to map's min and max
	 * zoom level settings.
	 *
	 * @ignore Exclude from docs
	 * @return Step count
	 */
	public get stepCount(): number {
		return Math.log(this.chart.maxZoomLevel) / Math.LN2 - Math.log(this.chart.minZoomLevel) / Math.LN2;
	}

	/**
	 * Creates a background element for slider control.
	 *
	 * @ignore Exclude from docs
	 * @return Background
	 */
	public createBackground(): this["_background"] {
		return new RoundedRectangle();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ZoomControl"] = ZoomControl;
