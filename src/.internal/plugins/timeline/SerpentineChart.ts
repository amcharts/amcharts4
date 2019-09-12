/**
 * Serpentine chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { CurveChart, ICurveChartProperties, ICurveChartDataFields, ICurveChartAdapters, ICurveChartEvents, CurveChartDataItem } from "./CurveChart";
import { registry } from "../../core/Registry";
import { Orientation } from "../../core/defs/Orientation";
import { IPoint } from "../../core/defs/IPoint";
import { percent, Percent } from "../../core/utils/Percent";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import { AxisRendererCurveY } from "./AxisRendererCurveY";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[SerpentineChart]].
 *
 * @see {@link DataItem}
 */
export class SerpentineChartDataItem extends CurveChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: SerpentineChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SerpentineChartDataItem";
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
 * Defines data fields for [[SerpentineChart]].
 */
export interface ISerpentineChartDataFields extends ICurveChartDataFields { }

/**
 * Defines properties for [[SerpentineChart]].
 */
export interface ISerpentineChartProperties extends ICurveChartProperties {

	/**
	 * Orientation (direction) of the chart.
	 *
	 * @default vertical
	 */
	orientation?: Orientation;

	/**
	 * How many "turns" (levels) the chart will have.
	 *
	 * @default 3
	 */
	levelCount?: number;

	/**
	 * Outer radius of the Y axis.
	 *
	 * It can be fixed number of pixels or percentage of the radius of distance
	 * between rings of the spiral.
	 *
	 * @default 25%
	 */
	yAxisRadius?: number | Percent;

	/**
	 * Inner radius of the Y axis.
	 *
	 * It can be fixed number of pixels or percentage of the radius of distance
	 * between rings of the spiral.
	 *
	 * @default -25%
	 */
	yAxisInnerRadius?: number | Percent;

}

/**
 * Defines events for [[SerpentineChart]].
 */
export interface ISerpentineChartEvents extends ICurveChartEvents { }

/**
 * Defines adapters for [[SerpentineChart]].
 *
 * @see {@link Adapter}
 */
export interface ISerpentineChartAdapters extends ICurveChartAdapters, ISerpentineChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a Serpentine chart.
 *
 * @see {@link ISerpentineChartEvents} for a list of available Events
 * @see {@link ISerpentineChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/timeline/#Serpentine} for documentation
 * @important
 */
export class SerpentineChart extends CurveChart {


	/**
	 * Defines available data fields.
	 */
	public _dataFields: ISerpentineChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ISerpentineChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISerpentineChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISerpentineChartEvents;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "SerpentineChart";

		this.orientation = "vertical";
		this.levelCount = 3;

		this.yAxisRadius = percent(25);
		this.yAxisInnerRadius = percent(-25);

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Orientation (direction) of the chart.
	 *
	 * Options: "vertical" (default) or "horizontal".
	 *
	 * @default vertical
	 * @param  value  Orientaiton
	 */
	public set orientation(value: Orientation) {
		this.setPropertyValue("orientation", value, true);
	}

	/**
	 * @return Orientation
	 */
	public get orientation(): Orientation {
		return this.getPropertyValue("orientation");
	}

	/**
	 * How many "turns" (levels) the chart will have.
	 *
	 * @default 3
	 * @param  value  Level count
	 */
	public set levelCount(value: number) {
		this.setPropertyValue("levelCount", value, true);
	}

	/**
	 * @return Level count
	 */
	public get levelCount(): number {
		return this.getPropertyValue("levelCount");
	}

	/**
	 * Outer radius of the Y axis.
	 *
	 * It can be fixed number of pixels or percentage of the radius of distance
	 * between rings of the spiral.
	 *
	 * IMPORTANT: this will override `radius` setting set on directly on the
	 * Y axis renderer.
	 *
	 * @default 25%
	 * @param  value  Outer radius
	 */
	public set yAxisRadius(value: number | Percent) {
		this.setPropertyValue("yAxisRadius", value, true);
	}

	/**
	 * @return {number} Outer radius
	 */
	public get yAxisRadius(): number | Percent {
		return this.getPropertyValue("yAxisRadius");
	}

	/**
	 * Inner radius of the Y axis.
	 *
	 * It can be fixed number of pixels or percentage of the radius of distance
	 * between rings of the spiral.
	 *
	 * IMPORTANT: this will override `innerRadius` setting set on directly on the
	 * Y axis renderer.
	 *
	 * @default -25%
	 * @param  value  Inner radius
	 */
	public set yAxisInnerRadius(value: number | Percent) {
		this.setPropertyValue("yAxisInnerRadius", value, true);
	}

	/**
	 * @return Inner radius
	 */
	public get yAxisInnerRadius(): number | Percent {
		return this.getPropertyValue("yAxisInnerRadius");
	}

	/**
	 * Validates the chart.
	 * 
	 * @ignore
	 */
	public validate() {
		super.validate();

		let curveContainer = this.curveContainer;

		let w = this.plotContainer.maxWidth - curveContainer.pixelPaddingLeft - curveContainer.pixelPaddingRight;
		let h = this.plotContainer.maxHeight - curveContainer.pixelPaddingTop - curveContainer.pixelPaddingBottom;

		let axisRadius = 0;
		this.yAxes.each((axis) => {
			axisRadius = $math.max(axis.renderer.radius, axisRadius);
		})

		w -= 2 * axisRadius;
		h -= 2 * axisRadius;

		let points: IPoint[] = [];

		let levelCount = this.levelCount;

		let radius: number;

		if (this.orientation == "vertical") {

			radius = $math.min(h / (levelCount - 1) / 2, w / 2);

			h = $math.min(radius * (levelCount - 1) * 2, h);

			for (let i = 0; i < this.levelCount; i++) {

				if (i % 2 === 0) {
					points.push({ x: -w / 2 + radius, y: -h / 2 + h / (levelCount - 1) * i })
					points.push({ x: w / 2 - radius, y: -h / 2 + h / (levelCount - 1) * i })

					let centerPoint = { x: w / 2 - radius, y: -h / 2 + h / (levelCount - 1) * (i + 0.5) }
					if (i < this.levelCount - 1) {
						for (let i = 0; i < 50; i++) {
							let angle = -90 + i / 50 * 180;
							points.push({ x: centerPoint.x + radius * $math.cos(angle), y: centerPoint.y + radius * $math.sin(angle) });
						}
					}
				}
				else {
					points.push({ x: w / 2 - radius, y: -h / 2 + h / (levelCount - 1) * i })
					points.push({ x: -w / 2 + radius, y: -h / 2 + h / (levelCount - 1) * i })
					let centerPoint = { x: -w / 2 + radius, y: -h / 2 + h / (levelCount - 1) * (i + 0.5) }
					if (i < this.levelCount - 1) {
						for (let i = 0; i < 50; i++) {
							let angle = -90 - i / 50 * 180;
							points.push({ x: centerPoint.x + radius * $math.cos(angle), y: centerPoint.y + radius * $math.sin(angle) });
						}
					}
				}
			}
		}
		else {

			radius = $math.min(w / (levelCount - 1) / 2, h / 2);

			w = $math.min(radius * (levelCount - 1) * 2, w);

			for (let i = 0; i < this.levelCount; i++) {

				if (i % 2 === 0) {
					points.push({ y: -h / 2 + radius, x: -w / 2 + w / (levelCount - 1) * i })
					points.push({ y: h / 2 - radius, x: -w / 2 + w / (levelCount - 1) * i })

					let centerPoint = { y: h / 2 - radius, x: -w / 2 + w / (levelCount - 1) * (i + 0.5) }
					if (i < this.levelCount - 1) {
						for (let i = 0; i < 50; i++) {
							let angle = -90 + i / 50 * 180;
							points.push({ y: centerPoint.y + radius * $math.cos(angle), x: centerPoint.x + radius * $math.sin(angle) });
						}
					}
				}
				else {
					points.push({ y: h / 2 - radius, x: -w / 2 + w / (levelCount - 1) * i })
					points.push({ y: -h / 2 + radius, x: -w / 2 + w / (levelCount - 1) * i })
					let centerPoint = { y: -h / 2 + radius, x: -w / 2 + w / (levelCount - 1) * (i + 0.5) }
					if (i < this.levelCount - 1) {
						for (let i = 0; i < 50; i++) {
							let angle = -90 - i / 50 * 180;
							points.push({ y: centerPoint.y + radius * $math.cos(angle), x: centerPoint.x + radius * $math.sin(angle) });
						}
					}
				}
			}
		}
		this.xAxes.each((axis) => {
			axis.renderer.points = points;
			axis.renderer.autoScale = false;
			axis.renderer.autoCenter = false;			
			axis.renderer.polyspline.tensionX = 1;
			axis.renderer.polyspline.tensionY = 1;
		})

		let yInnerRadius = $utils.relativeRadiusToValue(this.yAxisInnerRadius, radius * 2);
		let yRadius = $utils.relativeRadiusToValue(this.yAxisRadius, radius * 2);

		this.yAxes.each((axis) => {
			axis.renderer.radius = yRadius;
			axis.renderer.innerRadius = yInnerRadius;
		})
	}

	/**
	 * Triggers (re)rendering of the vertical (Y) axis.
	 *
	 * @ignore Exclude from docs
	 * @param axis  Axis
	 */
	public updateYAxis(renderer: AxisRendererCurveY) {
		super.updateYAxis(renderer);
		renderer.innerRadius = undefined;
		renderer.radius = undefined;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SerpentineChart"] = SerpentineChart;
