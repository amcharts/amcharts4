/**
 * Module for building 3D serial charts.
 */

/**
 * ============================================================================
 * Imports
 * ============================================================================
 * @hidden
 */
import { XYChart, IXYChartProperties, IXYChartDataFields, IXYChartAdapters, IXYChartEvents, XYChartDataItem } from "./XYChart";
import { Container } from "../../core/Container";
import { Sprite } from "../../core/Sprite";
import { AxisRendererX3D } from "../axes/AxisRendererX3D";
import { AxisRendererY3D } from "../axes/AxisRendererY3D";
import { ColumnSeries3D } from "../series/ColumnSeries3D";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import * as $path from "../../core/rendering/Path";
import * as $utils from "../../core/utils/Utils";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[XYChart3D]].
 *
 * @see {@link DataItem}
 */
export class XYChart3DDataItem extends XYChartDataItem {

	constructor() {
		super();
		this.className = "XYChart3DDataItem";
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
 * Defines data fields for [[XYChart3D]].
 */
export interface IXYChart3DDataFields extends IXYChartDataFields { }

/**
 * Defines available properties for [[XYChart3D]].
 */
export interface IXYChart3DProperties extends IXYChartProperties {

	/**
	 * Depths of the chart in pixels.
	 */
	depth?: number;

	/**
	 * Angle the chart is viewed at.
	 */
	angle?: number;

}

/**
 * Defines events for [[XYChart3D]].
 */
export interface IXYChart3DEvents extends IXYChartEvents { }

/**
 * Defines adapters for [[XYChart3D]].
 *
 * @see {@link Adapter}
 */
export interface IXYChart3DAdapters extends IXYChartAdapters, IXYChart3DProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a 3D XY chart.
 *
 * @see {@link IXYChart3DEvents} for a list of available Events
 * @see {@link IXYChart3DAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/} for documentation
 * @important
 */
export class XYChart3D extends XYChart {

	/**
	 * Available data fields.
	 */
	public _dataFields: IXYChart3DDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IXYChart3DProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IXYChart3DAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IXYChart3DEvents;

	/**
	 * Type of the axis renderer to use for X axes.
	 */
	protected _axisRendererX: typeof AxisRendererX3D = AxisRendererX3D;

	/**
	 * Type of the axis renderer to use for Y axes.
	 */
	protected _axisRendererY: typeof AxisRendererY3D = AxisRendererY3D;

	/**
	 * A container to add 3D column elements to.
	 *
	 * @ignore Exclude from docs
	 */
	public columnsContainer: Container;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "XYChart3D";

		// Set defaults
		this.depth = 30;
		this.angle = 30;

		// Creeate container for columns
		let columnsContainer = this.seriesContainer.createChild(Container);
		columnsContainer.shouldClone = false;
		columnsContainer.isMeasured = false;
		columnsContainer.layout = "none";
		this.columnsContainer = columnsContainer;

		this.columnsContainer.mask = this.createChild(Sprite);

		// Apply theme
		this.applyTheme();

	}

	/**
	 * This is done because for some reason IE doesn't change mask if path of a
	 * mask changes.
	 */
	protected updateSeriesMasks(): void {
		super.updateSeriesMasks();
		if ($utils.isIE()) {
			let columnsContainer = this.columnsContainer;
			let mask = columnsContainer.mask;
			columnsContainer.mask = undefined;
			columnsContainer.mask = mask;
		}
	}

	/**
	 * Depth of the 3D chart / columns in pixels.
	 *
	 * @param value  Depth (px)
	 */
	public set depth(value: number) {
		this.setPropertyValue("depth", value);
		this.fixLayout();
		this.invalidateDataUsers();
	}

	/**
	 * @return Depth (px)
	 */
	public get depth(): number {
		return this.getPropertyValue("depth");
	}

	/**
	 * Angle the chart is viewed at.
	 *
	 * @todo Description (review)
	 * @param value  Angle
	 */
	public set angle(value: number) {
		this.setPropertyValue("angle", value);
		this.fixLayout();
		this.invalidateDataUsers();
	}

	/**
	 * @return Angle
	 */
	public get angle(): number {
		return this.getPropertyValue("angle");
	}

	/**
	 * A calculated horizontal 3D offset (px).
	 *
	 * @readonly
	 * @return Offset (px)
	 */
	public get dx3D(): number {
		return $math.cos(this.angle) * this.depth;
	}

	/**
	 * A calculated vertical 3D offset (px).
	 *
	 * @readonly
	 * @return Offset (px)
	 */
	public get dy3D(): number {
		return -$math.sin(this.angle) * this.depth;
	}

	/**
	 * (Re)validates layout
	 *
	 * @ignore Exclude from docs
	 */
	public validateLayout() {
		super.validateLayout();
		this.fixColumns();
	}

	/**
	 * Updates the layout (padding and scrollbar positions) to accommodate for
	 * 3D depth and angle.
	 */
	protected fixLayout(): void {

		this.chartContainer.marginTop = -this.dy3D;
		this.chartContainer.paddingRight = this.dx3D;

		if (this.scrollbarX) {
			this.scrollbarX.dy = this.dy3D;
			this.scrollbarX.dx = this.dx3D;
		}

		if (this.scrollbarY) {
			this.scrollbarY.dy = this.dy3D;
			this.scrollbarY.dx = this.dx3D;
		}

		this.fixColumns();

		super.fixLayout();
	}

	/**
	 * Updates column positions, offset and dimensions based on chart's angle
	 * and depth.
	 */
	protected fixColumns(): void {
		let count: number = 1;
		let i = 0;
		$iter.each(this.series.iterator(), (series) => {
			if (series instanceof ColumnSeries3D) {

				if (!series.clustered && i > 0) {
					count++;
				}

				series.depthIndex = count - 1;
				i++;
			}
		});

		let s: number = 0;

		$iter.each(this.series.iterator(), (series) => {
			if (series instanceof ColumnSeries3D) {

				series.depth = this.depth / (count);
				series.angle = this.angle;
				if (series.columnsContainer == this.columnsContainer) {
					series.dx = this.depth / (count) * $math.cos(this.angle) * (series.depthIndex);
					series.dy = -this.depth / (count) * $math.sin(this.angle) * (series.depthIndex);
				}

				let inversed = false;
				if ((series.baseAxis == series.xAxis && series.xAxis.renderer.inversed) || (series.baseAxis == series.yAxis && series.yAxis.renderer.inversed)) {
					inversed = true;
				}

				let i: number = 1;
				series.dataItems.each((dataItem) => {
					let column = dataItem.column;
					if (column) {
						if (inversed) {
							column.zIndex = 1000 * (1000 - i) + s - series.depthIndex * 100;
						}
						else {
							column.zIndex = 1000 * i + s - series.depthIndex * 100;
						}

						i++;
					}
				});
				if (inversed) {
					s--;
				}
				else {
					s++;
				}
			}
		});
		this.maskColumns();
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
					config.series[i].type = config.series[i].type || "ColumnSeries3D";
				}
			}

		}

		super.processConfig(config);

	}

	protected maskColumns() {
		let w: number = this.plotContainer.pixelWidth;
		let h: number = this.plotContainer.pixelHeight;

		let dx: number = this.dx3D;
		let dy: number = this.dy3D;

		let path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: dx, y: dy }) + $path.lineTo({ x: w + dx, y: dy }) + $path.lineTo({ x: w + dx, y: h + dy }) + $path.lineTo({ x: w, y: h }) + $path.lineTo({ x: w, y: h }) + $path.lineTo({ x: 0, y: h }) + $path.closePath();

		let columnsContainer = this.columnsContainer;
		if (columnsContainer && columnsContainer.mask) {
			columnsContainer.mask.path = path;
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYChart3D"] = XYChart3D;
