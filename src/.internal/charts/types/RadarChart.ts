/**
 * Radar chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { XYChart, IXYChartProperties, IXYChartDataFields, IXYChartAdapters, IXYChartEvents, XYChartDataItem } from "./XYChart";
import { percent, Percent } from "../../core/utils/Percent";
import { RadarSeries } from "../series/RadarSeries";
import { RadarColumnSeries } from "../series/RadarColumnSeries";
import { Container } from "../../core/Container";
import { IRectangle } from "../../core/defs/IRectangle";
import { Circle } from "../../core/elements/Circle";
import { registry } from "../../core/Registry";
import { RadarCursor } from "../cursors/RadarCursor";
import { Axis } from "../axes/Axis";
import { AxisRenderer } from "../axes/AxisRenderer";
import { AxisRendererCircular } from "../axes/AxisRendererCircular";
import { AxisRendererRadial } from "../axes/AxisRendererRadial";
import * as $utils from "../../core/utils/Utils";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[RadarChart]].
 *
 * @see {@link DataItem}
 */
export class RadarChartDataItem extends XYChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: RadarChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "RadarChartDataItem";
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
 * Defines data fields for [[RadarChart]].
 */
export interface IRadarChartDataFields extends IXYChartDataFields { }

/**
 * Defines properties for [[RadarChart]].
 */
export interface IRadarChartProperties extends IXYChartProperties {

	/**
	 * Radius of the Radar face. Absolute or relative.
	 */
	radius?: number | Percent;

	/**
	 * Inner radius of the Radar face. Percent value is relative to radius.
	 *
	 * @todo review desc
	 */
	innerRadius?: number | Percent;

	/**
	 * An angle radar face starts on. (degrees)
	 *
	 * @default -90
	 */
	startAngle?: number;

	/**
	 * An angle radar face ends on. (degrees)
	 *
	 * @default 270
	 */
	endAngle?: number;

}

/**
 * Defines events for [[RadarChart]].
 */
export interface IRadarChartEvents extends IXYChartEvents { }

/**
 * Defines adapters for [[RadarChart]].
 *
 * @see {@link Adapter}
 */
export interface IRadarChartAdapters extends IXYChartAdapters, IRadarChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a Radar chart.
 *
 * @see {@link IRadarChartEvents} for a list of available Events
 * @see {@link IRadarChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/radar-chart/} for documentation
 * @important
 */
export class RadarChart extends XYChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IRadarChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IRadarChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IRadarChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IRadarChartEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: RadarSeries | RadarColumnSeries;

	/**
	 * Defines X axis renderer type.
	 */
	public _xAxisRendererType: AxisRendererCircular;

	/**
	 * Defines Y axis renderer type.
	 */
	public _yAxisRendererType: AxisRendererRadial;

	/**
	 * Defines X axis renderer type.
	 */
	protected _axisRendererX: typeof AxisRendererCircular = AxisRendererCircular;

	/**
	 * Defines Y axis renderer type.
	 */
	protected _axisRendererY: typeof AxisRendererRadial = AxisRendererRadial;

	/**
	 * [_cursor description]
	 *
	 * @todo Description
	 */
	public _cursor: RadarCursor;

	/**
	 * A container that holds Radar visual elements.
	 */
	public radarContainer: Container;


	/**
	 *
	 * @ignore Exclude from docs
	 */
	protected _pixelInnerRadius: number;


	/**
	 * used by cursor. We adjust innerradius if start and end angle are close to each other
	 * @ignore Exclude from docs
	 */
	public innerRadiusModifyer: number = 1;


	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "RadarChart";

		this.startAngle = -90;
		this.endAngle = 270;

		this.radius = percent(80);
		this.innerRadius = 0;

		let radarContainer = this.plotContainer.createChild(Container);
		radarContainer.shouldClone = false;
		radarContainer.layout = "absolute";
		radarContainer.align = "center";
		radarContainer.valign = "middle";

		this.seriesContainer.parent = radarContainer;
		this.radarContainer = radarContainer;
		this.bulletsContainer.parent = radarContainer;
		this.axisBulletsContainer = radarContainer;

		this._cursorContainer = radarContainer;

		this._bulletMask = radarContainer.createChild(Circle);
		this._bulletMask.shouldClone = false;
		this._bulletMask.element = this.paper.add("path");
		this._bulletMask.opacity = 0;

		// Apply theme
		this.applyTheme();
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
			this.readerTitle = this.language.translate("Radar chart");
		}

	}

	/**
	 * Decorates Axis with required properties for this chart.
	 *
	 * @param axis  Axis
	 */
	protected processAxis(axis: Axis): void {
		super.processAxis(axis);
		let renderer: AxisRenderer = axis.renderer;
		renderer.gridContainer.parent = renderer;
		renderer.breakContainer.parent = renderer;
		axis.parent = this.radarContainer;
		renderer.toBack();
	}

	/**
	 * Updates all X axes after range change event.
	 */
	protected handleXAxisRangeChange() {
		super.handleXAxisRangeChange();
		$iter.each(this.yAxes.iterator(), (axis) => {
			axis.invalidate();
		});
	}

	/**
	 * Updates all Y axes after range change event.
	 */
	protected handleYAxisRangeChange() {
		super.handleYAxisRangeChange();
		$iter.each(this.xAxes.iterator(), (axis) => {
			axis.invalidate();
		});
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Set up cursor
			if ($type.hasValue(config.cursor) && !$type.hasValue(config.cursor.type)) {
				config.cursor.type = "RadarCursor";
			}

			// Set up series
			if ($type.hasValue(config.series) && $type.isArray(config.series)) {
				for (let i = 0, len = config.series.length; i < len; i++) {
					config.series[i].type = config.series[i].type || "RadarSeries";
				}
			}

			// Set up axes
			/*if ($type.hasValue(config.xAxes) && $type.isArray(config.xAxes)) {
				for (let i = 0, len = config.xAxes.length; i < len; i++) {
					config.xAxes[i].type = config.xAxes[i].type || "AxisRendererCircular";
				}
			}
			if ($type.hasValue(config.yAxes) && $type.isArray(config.yAxes)) {
				for (let i = 0, len = config.yAxes.length; i < len; i++) {
					config.yAxes[i].type = config.yAxes[i].type || "AxisRendererRadial";
				}
			}*/

		}

		super.processConfig(config);
	}

	/**
	 * Does calculations before drawing the chart.
	 */
	protected beforeDraw(): void {
		super.beforeDraw();

		let plotContainer = this.plotContainer;

		let rect = $math.getArcRect(this.startAngle, this.endAngle, 1);
		let innerRect: IRectangle = { x: 0, y: 0, width: 0, height: 0 };

		let wr = plotContainer.innerWidth / rect.width;
		let hr = plotContainer.innerHeight / rect.height;

		let innerRadius = this.innerRadius;

		if (innerRadius instanceof Percent) {
			let value = innerRadius.value;
			let mr = Math.min(wr, hr);
			value = Math.max(mr * value, mr - Math.min(plotContainer.innerHeight, plotContainer.innerWidth)) / mr;
			innerRect = $math.getArcRect(this.startAngle, this.endAngle, value);

			this.innerRadiusModifyer = value / innerRadius.value;
			innerRadius = percent(value * 100);
		}
		// @todo handle this when innerRadius set in pixels (do it for pie also)
		rect = $math.getCommonRectangle([rect, innerRect]);

		let maxRadius = Math.min(plotContainer.innerWidth / rect.width, plotContainer.innerHeight / rect.height);

		let diameter = $utils.relativeRadiusToValue(this.radius, maxRadius) * 2 || 0;
		let radius = diameter / 2;
		let startAngle = this.startAngle;
		let endAngle = this.endAngle;

		this._pixelInnerRadius = $utils.relativeRadiusToValue(innerRadius, radius);

		this._bulletMask.path = $path.arc(startAngle, endAngle - startAngle, radius, this._pixelInnerRadius);

		$iter.each(this.xAxes.iterator(), (axis) => {
			if(axis.renderer.useChartAngles){
				axis.renderer.startAngle = startAngle;
				axis.renderer.endAngle = endAngle;
			}

			axis.width = diameter;
			axis.height = diameter;
			//axis.renderer.width = diameter;
			//axis.renderer.height = diameter;
			axis.renderer.pixelRadiusReal = radius;
			axis.renderer.innerRadius = innerRadius;
		});

		$iter.each(this.yAxes.iterator(), (axis) => {
			axis.renderer.startAngle = startAngle;
			axis.renderer.endAngle = endAngle;

			axis.width = diameter;
			axis.height = diameter;
			//axis.renderer.width = diameter;
			//axis.renderer.height = diameter;
			axis.renderer.pixelRadiusReal = radius;
			axis.renderer.innerRadius = innerRadius;
		});

		let cursor = this.cursor;
		if (cursor) {
			cursor.width = diameter;
			cursor.height = diameter;
			cursor.startAngle = startAngle;
			cursor.endAngle = endAngle;
		}

		this.radarContainer.definedBBox = { x: radius * rect.x, y: radius * rect.y, width: radius * rect.width, height: radius * rect.height };
		this.radarContainer.validatePosition();
	}

	/**
	 * Creates and returns a new Series, suitable for RadarChart.
	 *
	 * @return New Series
	 */
	protected createSeries(): this["_seriesType"] {
		return new RadarSeries();
	}

	/**
	 * Starting angle of the Radar face. (degrees)
	 *
	 * Normally, a circular radar face begins (the radial axis is drawn) at the
	 * top center. (at -90 degrees)
	 *
	 * You can use `startAngle` to change this setting.
	 *
	 * E.g. setting this to 0 will make the radial axis start horizontally to
	 * the right, as opposed to vertical.
	 *
	 * For a perfect circle the absolute sum of `startAngle` and `endAngle`
	 * needs to be 360.
	 *
	 * However, it's **not** necessary to do so. You can set those to lesser
	 * numbers, to create semi-circles.
	 *
	 * E.g. `startAngle = -90` with `endAngle = 0` will create a radar face that
	 * looks like a quarter of a circle.
	 *
	 * @default -90
	 * @param value  Start angle (degrees)
	 */
	public set startAngle(value: number) {
		this.setPropertyValue("startAngle", value, true);
	}

	/**
	 * @return Start angle (degrees)
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

	/**
	 * Starting angle of the Radar face. (degrees)
	 *
	 * Normally, a circular radar face ends (the radial axis is drawn) exactly
	 * where it has started, forming a full 360 circle. (at 270 degrees)
	 *
	 * You can use `endAngle` to end the circle somewhere else.
	 *
	 * E.g. setting this to 180 will make the radar face end at horizontal line
	 * to the left off the center.
	 *
	 * For a perfect circle the absolute sum of `startAngle` and `endAngle`
	 * needs to be 360.
	 *
	 * However, it's **not** necessary to do so. You can set those to lesser
	 * numbers, to create semi-circles.
	 *
	 * E.g. `startAngle = -90` with `endAngle = 0` will create a radar face that
	 * looks like a quarter of a circle.
	 *
	 * @default -90
	 * @param value  End angle (degrees)
	 */
	public set endAngle(value: number) {
		this.setPropertyValue("endAngle", value, true);
	}

	/**
	 * @return End angle (degrees)
	 */
	public get endAngle(): number {
		return this.getPropertyValue("endAngle");
	}

	/**
	 * Outer radius of the Radar face.
	 *
	 * This can either be in absolute pixel value, or relative [[Percent]].
	 *
	 * @param value  Outer radius
	 */
	public set radius(value: number | Percent) {
		this.setPercentProperty("radius", value, true, false, 10, false);
	}

	/**
	 * @return Outer radius
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * @return Inner radius in pixels
	 */
	public get pixelInnerRadius(): number {
		return this._pixelInnerRadius;
	}

	/**
	 * Inner radius of the radar face.
	 *
	 * This can either be in absolute pixel value, or relative [[Percent]].
	 *
	 * If set in Percent, it will be relative to `radius`. (outer radius)
	 *
	 * @param value Inner radius
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, true, false, 10, false);
	}

	/**
	 * @return Inner radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Triggers (re)rendering of the horizontal (X) axis.
	 *
	 * @ignore Exclude from docs
	 * @param axis Axis
	 */
	public updateXAxis(renderer: AxisRenderer) {
		//do not call super!
		if (renderer) {
			renderer.processRenderer();
		}
	}

	/**
	 * Triggers (re)rendering of the vertical (Y) axis.
	 *
	 * @ignore Exclude from docs
	 * @param axis Axis
	 */
	public updateYAxis(renderer: AxisRenderer) {
		// do not call super!
		if (renderer) {
			renderer.processRenderer();
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["RadarChart"] = RadarChart;
