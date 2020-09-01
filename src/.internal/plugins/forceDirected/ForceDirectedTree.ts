/**
 * ForceDirectedTree chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, ISerialChartProperties, ISerialChartDataFields, ISerialChartAdapters, ISerialChartEvents, SerialChartDataItem } from "../../charts/types/SerialChart";
import { ForceDirectedSeries, ForceDirectedSeriesDataItem } from "./ForceDirectedSeries";
import { Export } from "../../core/export/Export";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";
import * as $utils from "../../core/utils/Utils";
import { color } from "../../core/utils/Color";
import { percent } from "../../core/utils/Percent";
import { IPoint } from "../../core/defs/IPoint";
import { Sprite, ISpriteEvents, AMEvent } from "../../core/Sprite";
import { IDisposer } from "../../core/utils/Disposer";
import * as $ease from "../../core/utils/Ease";
import * as $math from "../../core/utils/Math";
import { ZoomOutButton } from "../../core/elements/ZoomOutButton";
import { getInteraction, IInteractionEvents } from "../../core/interaction/Interaction";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 * @see {@link DataItem}
 */
export class ForceDirectedTreeDataItem extends SerialChartDataItem { }


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedTreeDataFields extends ISerialChartDataFields { }

/**
 * Defines properties for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedTreeProperties extends ISerialChartProperties {

	/**
	 * Indicates whether chart can be zoomed/panned (via mouse, touch, or API).
	 *
	 * @since 4.10.0
	 * @default false
	 */
	zoomable?: boolean;

	/**
	 * Specifies what should chart do if when mouse wheel is rotated.
	 *
	 * @since 4.10.0
	 * @default none
	 */
	mouseWheelBehavior?: "zoom" | "none";

	/**
	 * When user zooms in or out current zoom level is multiplied or divided
	 * by value of this setting.
	 *
	 * @since 4.10.0
	 * @default 2
	 */
	zoomStep?: number;
}

/**
 * Defines events for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedTreeEvents extends ISerialChartEvents { }

/**
 * Defines adapters for [[ForceDirectedTree]].
 *
 * @since 4.3.8
 * @see {@link Adapter}
 */
export interface IForceDirectedTreeAdapters extends ISerialChartAdapters, IForceDirectedTreeProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A main class for [[ForceDirectedTree]] chart type.
 *
 * @see {@link IForceDirectedTreeEvents} for a list of available Events
 * @see {@link IForceDirectedTreeAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/force-directed/} For more information
 * @since 4.3.8
 * @important
 */
export class ForceDirectedTree extends SerialChart {

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: ForceDirectedTreeDataItem;

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IForceDirectedTreeDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IForceDirectedTreeProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IForceDirectedTreeAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IForceDirectedTreeEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: ForceDirectedSeries;

	/**
	 * @ignore
	 */
	protected _mouseWheelDisposer: IDisposer;

	/**
	 * @ignore
	 */
	protected _backgroundZoomoutDisposer: IDisposer;

	/**
	 * Default duration of zoom animations (ms).
	 */
	public zoomDuration: number = 1000;


	/**
	 * Default zooming animation easing function.
	 */
	public zoomEasing: (value: number) => number = $ease.cubicOut;

	/**
	 * Smallest available zoom level. The chart will not allow to zoom out past
	 * this setting.
	 *
	 * NOTE: Should be power of 2.
	 *
	 * @default 1
	 */
	public minZoomLevel: number = 1;

	/**
	 * Biggest available zoom level. The chart will not allow to zoom in past
	 * this setting.
	 *
	 * NOTE: Should be power of 2.
	 *
	 * @default 32
	 */
	public maxZoomLevel: number = 16;

	/**
	 * A button which is used to zoom out the chart.
	 */
	protected _zoomOutButton: ZoomOutButton;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "ForceDirectedTree";

		this.seriesContainer.isMeasured = true;
		this.seriesContainer.layout = "absolute";

		this.mouseWheelBehavior = "none";
		this.zoomStep = 2;

		this.seriesContainer.background.fillOpacity = 0;
		this.seriesContainer.background.fill = color("#ffffff")

		let zoomOutButton = this.createChild(ZoomOutButton);
		zoomOutButton.shouldClone = false;
		zoomOutButton.x = percent(100);
		zoomOutButton.horizontalCenter = "right";
		zoomOutButton.valign = "top";
		zoomOutButton.zIndex = Number.MAX_SAFE_INTEGER;
		zoomOutButton.marginTop = 5;
		zoomOutButton.marginRight = 5;
		zoomOutButton.isMeasured = false;

		zoomOutButton.adapter.add("dx", (dx, target) => {
			return - zoomOutButton.marginRight;
		})

		zoomOutButton.hide(0);
		this.zoomOutButton = zoomOutButton;

		this.addDisposer(this.seriesContainer.events.on("sizechanged", () => {

			if (this.seriesContainer.scale != 1) {
				this.zoomOutButton.show();
			}
			else {
				this.zoomOutButton.hide();
			}
		}));

		const interaction = getInteraction();
		this._disposers.push(interaction.body.events.on("down", (event: IInteractionEvents["down"]) => {
			if (this.zoomable) {
				let svgPoint = $utils.documentPointToSvg(event.pointer.point, this.htmlContainer);
				if (svgPoint.x > 0 && svgPoint.y > 0 && svgPoint.x < this.svgContainer.width && svgPoint.y < this.svgContainer.height) {
					this.seriesContainer.dragStart(event.pointer);
				}
			}
		}, this));
		this._disposers.push(interaction.body.events.on("up", (event: IInteractionEvents["up"]) => {
			if (this.zoomable) {
				this.seriesContainer.dragStop(event.pointer, true);
			}
		}, this));

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Creates and returns a new series of the suitable type.
	 *
	 * @return New series
	 */
	protected createSeries(): this["_seriesType"] {
		return new ForceDirectedSeries();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new ForceDirectedTreeDataItem();
	}

	/**
	 * Setups the legend to use the chart's data.
	 *
	 * @ignore
	 */
	public feedLegend(): void {
		let legend = this.legend;
		if (legend) {

			let legendData: any[] = [];

			this.series.each((series) => {
				if (!series.hiddenInLegend) {

					let dataItems = series.dataItems;
					if (dataItems.length == 1) {
						let children = series.dataItems.getIndex(0).children;
						if (children && children.length > 0) {
							dataItems = children;
						}
					}

					dataItems.each((dataItem) => {
						if (!dataItem.hiddenInLegend) {
							legendData.push(<ForceDirectedSeriesDataItem>dataItem);

							let legendSettings = series.legendSettings;
							if (legendSettings) {
								if (legendSettings.labelText) {
									legend.labels.template.text = legendSettings.labelText;
								}
								if (legendSettings.itemLabelText) {
									legend.labels.template.text = legendSettings.itemLabelText;
								}
								if (legendSettings.valueText) {
									legend.valueLabels.template.text = legendSettings.valueText;
								}
								if (legendSettings.itemValueText) {
									legend.valueLabels.template.text = legendSettings.itemValueText;
								}
							}
						}
					});
				}
			});

			legend.data = legendData;
			legend.dataFields.name = "name";
		}
	}


	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {

		super.applyInternalDefaults();

		// Add a default screen reader title for accessibility
		// This will be overridden in screen reader if there are any `titles` set
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Force directed tree");
		}
	}

	/**
	 * Since this chart uses hierarchical data, we need to remove childrent
	 * dataField from export of non-hierarchical formats such as CSV and XSLX.
	 *
	 * @return Export
	 */
	protected getExporting(): Export {
		const exporting = super.getExporting();
		exporting.adapter.add("formatDataFields", (info) => {
			if (info.format == "csv" || info.format == "xlsx") {
				this.series.each((series) => {
					if ($type.hasValue(series.dataFields.children)) {
						delete info.dataFields[series.dataFields.children];
					}
				})
			}
			return info;
		})
		return exporting;
	}

	/**
	 * Handles mouse wheel event, e.g. user rotates mouse wheel while over the
	 * map: zooms in or out depending on the direction of the wheel turn.
	 *
	 * @param event  Original event
	 */
	protected handleWheel(event: AMEvent<Sprite, ISpriteEvents>["wheel"]) {

		let point: IPoint = $utils.documentPointToSprite(event.point, this.seriesContainer);

		let zoomLevel = this.seriesContainer.scale;

		if (event.shift.y < 0) {
			zoomLevel *= this.zoomStep;
		}
		else {
			zoomLevel /= this.zoomStep;
		}

		zoomLevel = $math.fitToRange(zoomLevel, this.minZoomLevel, this.maxZoomLevel);

		this.zoomToPoint(point, zoomLevel)
	}

	/**
	 * Zooms the chart to particular point.
	 *
	 * @from 4.10.0
	 * @param  point      A point to zoom to
	 * @param  zoomLevel  Zoom level
	 * @param  center     Should the chart center on the target point?
	 */
	public zoomToPoint(point: IPoint, zoomLevel: number, center?: boolean): void {

		let container = this.seriesContainer;

		let svgPoint: IPoint
		if (center) {
			svgPoint = { x: this.maxWidth / 2, y: this.maxHeight / 2 };
		}
		else {
			svgPoint = $utils.spritePointToSvg(point, container)
		}

		let x = svgPoint.x - point.x * zoomLevel;
		let y = svgPoint.y - point.y * zoomLevel;

		container.animate([{ property: "scale", to: zoomLevel }, { property: "x", to: x }, { property: "y", to: y }], this.zoomDuration, this.zoomEasing);
	}

	/**
	 * Zooms the chart to particular data item (node).
	 *
	 * @from 4.10.0
	 * @param  dataItem   A data item to zoom to
	 * @param  zoomLevel  Zoom level
	 * @param  center     Should the chart center on the target point?
	 */
	public zoomToDataItem(dataItem: ForceDirectedSeriesDataItem, zoomLevel?: number, center?: boolean): void {
		let x = dataItem.node.pixelX;
		let y = dataItem.node.pixelY;

		if (!$type.isNumber(zoomLevel)) {
			zoomLevel = this.seriesContainer.scale * this.zoomStep;
		}

		this.zoomToPoint({ x: x, y: y }, zoomLevel, center);
	}

	/**
	 * Zooms out the chart to initial full view.
	 *
	 * @from 4.10.0
	 */
	public zoomOut(): void {
		let container = this.seriesContainer;
		this.zoomToPoint({ x: container.pixelWidth / 2, y: container.pixelHeight / 2 }, 1, true);
	}

	/**
	 * When user zooms in or out current zoom level is multiplied or divided
	 * by value of this setting.
	 *
	 * @default false
	 * @since 4.10.0
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/force-directed/#Zooming} for more information about zooming ForceDirectedTree
	 * @param value  Zoomable
	 */
	public set zoomable(value: boolean) {
		if (this.setPropertyValue("zoomable", value)) {
			if (value) {
				this.seriesContainer.resizable = true;
				this.seriesContainer.draggable = true;
				this.seriesContainer.dragWhileResize = true;
				this.mouseWheelBehavior = "zoom";

				this._backgroundZoomoutDisposer = this.seriesContainer.background.events.on("hit", () => {
					this.zoomOut();
				}, this, false);
				this._disposers.push(this._backgroundZoomoutDisposer);
			}
			else {
				this.seriesContainer.resizable = false;
				this.seriesContainer.draggable = false;
				this.seriesContainer.dragWhileResize = false;
				this.mouseWheelBehavior = "none";
				if (this._backgroundZoomoutDisposer) {
					this._backgroundZoomoutDisposer.dispose();
				}
			}
		}
	}

	/**
	 * @return Zoomable
	 */
	public get zoomable(): boolean {
		return this.getPropertyValue("zoomable");
	}

	/**
	 * Specifies what should chart do if when mouse wheel is rotated.
	 *
	 * @param Mouse wheel behavior
	 * @since 4.10.0
	 * @default none
	 */
	public set mouseWheelBehavior(value: "zoom" | "none") {

		if (this.setPropertyValue("mouseWheelBehavior", value)) {
			if (value != "none") {
				this._mouseWheelDisposer = this.chartContainer.events.on("wheel", this.handleWheel, this, false);
				this._disposers.push(this._mouseWheelDisposer);
			}
			else {
				if (this._mouseWheelDisposer) {
					this._mouseWheelDisposer.dispose();
				}
				this.chartContainer.wheelable = false;
			}
		}
	}

	/**
	 * @return Mouse wheel behavior
	 */
	public get mouseWheelBehavior(): "zoom" | "none" {
		return this.getPropertyValue("mouseWheelBehavior");
	}

	/**
	 * When user zooms in or out current zoom level is multiplied or divided
	 * by value of this setting.
	 *
	 * @since 4.10.0
	 * @default 2
	 * @param value  Zoom factor
	 */
	public set zoomStep(value: number) {
		this.setPropertyValue("zoomStep", value);
	}

	/**
	 * @return Zoom factor
	 */
	public get zoomStep(): number {
		return this.getPropertyValue("zoomStep");
	}

	/**
	 * A [[Button]] element that is used for zooming out the chart.
	 *
	 * This button appears only when chart is zoomed in, and disappears
	 * autoamatically when it is zoome dout.
	 *
	 * @param button  Zoom out button
	 */
	public set zoomOutButton(button: ZoomOutButton) {
		this._zoomOutButton = button;
		if (button) {
			button.events.on("hit", () => {
				this.zoomOut();
			}, undefined, false);
		}
	}

	/**
	 * @return Zoom out button
	 */
	public get zoomOutButton(): ZoomOutButton {
		return this._zoomOutButton;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ForceDirectedTree"] = ForceDirectedTree;
registry.registeredClasses["ForceDirectedTreeDataItem"] = ForceDirectedTreeDataItem;
