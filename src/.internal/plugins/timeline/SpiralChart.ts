/**
 * Radar chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { CurveChart, ICurveChartProperties, ICurveChartDataFields, ICurveChartAdapters, ICurveChartEvents, CurveChartDataItem } from "./CurveChart";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import { percent, Percent } from "../../core/utils/Percent";
import * as $path from "../../core/rendering/Path";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";
import { AxisRendererCurveY } from "./AxisRendererCurveY";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[SpiralChart]].
 *
 * @see {@link DataItem}
 */
export class SpiralChartDataItem extends CurveChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: SpiralChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SpiralChartDataItem";
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
 * Defines data fields for [[SpiralChart]].
 */
export interface ISpiralChartDataFields extends ICurveChartDataFields { }

/**
 * Defines properties for [[SpiralChart]].
 */
export interface ISpiralChartProperties extends ICurveChartProperties {

	/**
	 * Inner radius of the spiral.
	 *
	 * Can be either fixed number in pixels, or in percent.
	 *
	 * @default 25%
	 */
	innerRadius?: number | Percent;

	/**
	 * Number of rings the spiral will consist of.
	 *
	 * @default 3
	 */
	levelCount?: number;

	/**
	 * An angle the spiral will start at.
	 *
	 * @default 0
	 */
	startAngle?: number;

	/**
	 * An angle the spiral will end at.
	 *
	 * @default 0
	 */
	endAngle?: number;

	/**
	 * Number of pixels the spiral diameter will increase by each full rotation.
	 *
	 * Normally the chart will calculate it by itself. You can override it by
	 * setting your own value of `radiusStep`.
	 *
	 * In such case the chart might be bigger or smaller than chart container.
	 */
	radiusStep?: number;

	/**
	 * Precision setting to use when automatically generating axis points for the
	 * spiral.
	 *
	 * The smaller the number, the finer line. However, small number will impact
	 * the performace.
	 *
	 * Depending on actual chart configuration, you might need to find the best
	 * possible value to balance between detail and good performance.
	 *
	 * @default 5
	 */
	precisionStep?: number;

	/**
	 * Outer radius of the Y axis.
	 *
	 * It can be fixed number of pixels or percentage of the radius of distance
	 * between rings of the spiral.
	 *
	 * @default 35%
	 */
	yAxisRadius?: number | Percent;

	/**
	 * Inner radius of the Y axis.
	 *
	 * It can be fixed number of pixels or percentage of the radius of distance
	 * between rings of the spiral.
	 *
	 * @default -35%
	 */
	yAxisInnerRadius?: number | Percent;

	/**
	 * Normally the spiral will start at the center.
	 *
	 * Set this to `true` to start at the outer end.
	 * 
	 * @default false
	 */
	inversed?: boolean;

}

/**
 * Defines events for [[SpiralChart]].
 */
export interface ISpiralChartEvents extends ICurveChartEvents { }

/**
 * Defines adapters for [[SpiralChart]].
 *
 * @see {@link Adapter}
 */
export interface ISpiralChartAdapters extends ICurveChartAdapters, ISpiralChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a Spiral chart.
 *
 * @see {@link ISpiralChartEvents} for a list of available Events
 * @see {@link ISpiralChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/timeline/#Spiral} for documentation
 * @important
 */
export class SpiralChart extends CurveChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: ISpiralChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ISpiralChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISpiralChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISpiralChartEvents;


	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "SpiralChart";

		this.levelCount = 3;
		this.precisionStep = 5;
		this.startAngle = 0;
		this.endAngle = 0;
		this.innerRadius = percent(25);

		this.yAxisRadius = percent(35);
		this.yAxisInnerRadius = percent(-35);

		this.inversed = false;

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Number of rings the spiral will consist of.
	 *
	 * @default 3
	 * @param  value  Number of circles
	 */
	public set levelCount(value: number) {
		this.setPropertyValue("levelCount", value, true);
	}

	/**
	 * @return Number of circles
	 */
	public get levelCount(): number {
		return this.getPropertyValue("levelCount");
	}

	/**
	 * An angle the spiral will start at.
	 *
	 * @default 0
	 * @param  value  Start angle
	 */
	public set startAngle(value: number) {
		this.setPropertyValue("startAngle", value, true);
	}

	/**
	 * @return End angle
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

	/**
	 * An angle the spiral will end at.
	 *
	 * @default 0
	 * @param  value  End angle
	 */
	public set endAngle(value: number) {
		this.setPropertyValue("endAngle", value, true);
	}

	/**
	 * @return End angle
	 */
	public get endAngle(): number {
		return this.getPropertyValue("endAngle");
	}

	/**
	 * Number of pixels the spiral diameter will increase by each full rotation.
	 *
	 * Normally the chart will calculate it by itself. You can override it by
	 * setting your own value of `radiusStep`.
	 *
	 * In such case the chart might be bigger or smaller than chart container.
	 * 
	 * @param {number} value  Radius step (px)
	 */
	public set radiusStep(value: number) {
		this.setPropertyValue("radiusStep", value, true);
	}

	/**
	 * @return Radius step (px)
	 */
	public get radiusStep(): number {
		return this.getPropertyValue("radiusStep");
	}

	/**
	 * Precision setting to use when automatically generating axis points for the
	 * spiral.
	 *
	 * The smaller the number, the finer line. However, small number will impact
	 * the performace.
	 *
	 * Depending on actual chart configuration, you might need to find the best
	 * possible value to balance between detail and good performance.
	 *
	 * @default 5
	 * @param  value  Precision
	 */
	public set precisionStep(value: number) {
		this.setPropertyValue("precisionStep", value, true);
	}

	/**
	 * @return Precision
	 */
	public get precisionStep(): number {
		return this.getPropertyValue("precisionStep");
	}

	/**
	 * Inner radius of the spiral.
	 *
	 * Can be either fixed number in pixels, or in percent.
	 *
	 * @default 25%
	 * @param  value  Inner radius
	 */
	public set innerRadius(value: number | Percent) {
		this.setPropertyValue("innerRadius", value, true);
	}

	/**
	 * @return Inner radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
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
	 * @default 35%
	 * @param  value  Outer radius
	 */
	public set yAxisRadius(value: number | Percent) {
		this.setPropertyValue("yAxisRadius", value, true);
	}

	/**
	 * @return Outer radius
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
	 * @default -35%
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
	 * Normally the spiral will start at the center.
	 *
	 * Set this to `true` to start at the outer end.
	 *
	 * @default false
	 * @param  value  Inversed?
	 */
	public set inversed(value: boolean) {
		this.setPropertyValue("inversed", value, true);
	}

	/**
	 * @return Inversed?
	 */
	public get inversed(): boolean {
		return this.getPropertyValue("inversed");
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

		let radius = $math.min(w, h) / 2;

		let radiusStep = this.radiusStep;

		let innerRadius = $utils.relativeRadiusToValue(this.innerRadius, radius);

		if (!$type.isNumber(radiusStep)) {
			radiusStep = (radius - innerRadius) / this.levelCount;
		}

		let points = $path.spiralPoints(0, 0, radius, radius, innerRadius, this.precisionStep, radiusStep, this.startAngle, this.endAngle);

		let yInnerRadius = $utils.relativeRadiusToValue(this.yAxisInnerRadius, radiusStep);
		let yRadius = $utils.relativeRadiusToValue(this.yAxisRadius, radiusStep);

		if (this.inversed) {
			points.reverse();
		}

		this.xAxes.each((axis) => {
			axis.renderer.points = points;
			axis.renderer.autoScale = false;
			axis.renderer.autoCenter = false;
			axis.renderer.polyspline.tensionX = 1;
			axis.renderer.polyspline.tensionY = 1;			
		})

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
registry.registeredClasses["SpiralChart"] = SpiralChart;
