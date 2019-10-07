/**
 * Curve chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { XYChart, IXYChartProperties, IXYChartDataFields, IXYChartAdapters, IXYChartEvents, XYChartDataItem } from "../../charts/types/XYChart";
import { CurveLineSeries } from "./CurveLineSeries";
import { CurveColumnSeries } from "./CurveColumnSeries";
import { Container } from "../../core/Container";
import { registry } from "../../core/Registry";
import { CurveCursor } from "./CurveCursor";
import { Axis } from "../../charts/axes/Axis";
import { AxisRenderer } from "../../charts/axes/AxisRenderer";
import { AxisRendererCurveX } from "./AxisRendererCurveX";
import { AxisRendererCurveY } from "./AxisRendererCurveY";
import * as $type from "../../core/utils/Type";
import { options } from "../../core/Options";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[CurveChart]].
 *
 * @see {@link DataItem}
 */
export class CurveChartDataItem extends XYChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: CurveChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CurveChartDataItem";
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
 * Defines data fields for [[CurveChart]].
 */
export interface ICurveChartDataFields extends IXYChartDataFields { }

/**
 * Defines properties for [[CurveChart]].
 */
export interface ICurveChartProperties extends IXYChartProperties { }

/**
 * Defines events for [[CurveChart]].
 */
export interface ICurveChartEvents extends IXYChartEvents { }

/**
 * Defines adapters for [[CurveChart]].
 *
 * @see {@link Adapter}
 */
export interface ICurveChartAdapters extends IXYChartAdapters, ICurveChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a Curve chart.
 *
 * @see {@link ICurveChartEvents} for a list of available Events
 * @see {@link ICurveChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/timeline/} for documentation
 * @important
 */
export class CurveChart extends XYChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: ICurveChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ICurveChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICurveChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICurveChartEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: CurveLineSeries | CurveColumnSeries;

	/**
	 * Defines X axis renderer type.
	 */
	public _xAxisRendererType: AxisRendererCurveX;

	/**
	 * Defines Y axis renderer type.
	 */
	public _yAxisRendererType: AxisRendererCurveY;

	/**
	 * Defines X axis renderer type.
	 */
	protected _axisRendererX: typeof AxisRendererCurveX = AxisRendererCurveX;

	/**
	 * Defines Y axis renderer type.
	 */
	protected _axisRendererY: typeof AxisRendererCurveY = AxisRendererCurveY;

	/**
	 * Defines type of the cursor used in this chart.
	 */
	public _cursor: CurveCursor;

	/**
	 * A container that holds chart's visual elements.
	 */
	public curveContainer: Container;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "CurveChart";

		let curvedContainer = this.plotContainer.createChild(Container);
		curvedContainer.shouldClone = false;
		curvedContainer.layout = "absolute";
		curvedContainer.align = "center";
		curvedContainer.valign = "middle";

		this.seriesContainer.parent = curvedContainer;
		this.curveContainer = curvedContainer;
		this.bulletsContainer.parent = curvedContainer;
		this.axisBulletsContainer.parent = curvedContainer;
		this._cursorContainer = curvedContainer;

		this._bulletMask = undefined;
		//this._bulletMask.shouldClone = false;

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
			//this.readerTitle = this.language.translate("Curved chart");
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
		axis.parent = this.curveContainer;
		renderer.toBack();
	}

	/**
	 * Updates all X axes after range change event.
	 */
	/*
   protected handleXAxisRangeChange() {
	   super.handleXAxisRangeChange();
	   $iter.each(this.yAxes.iterator(), (axis) => {
		   axis.invalidate();
	   });
   }*/

	/**
	 * Updates all Y axes after range change event.
	 */
	/*
   protected handleYAxisRangeChange() {
	   super.handleYAxisRangeChange();
	   $iter.each(this.xAxes.iterator(), (axis) => {
		   axis.invalidate();
	   });
   }*/

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
				config.cursor.type = "CurveCursor";
			}

			// Set up series
			if ($type.hasValue(config.series) && $type.isArray(config.series)) {
				for (let i = 0, len = config.series.length; i < len; i++) {
					config.series[i].type = config.series[i].type || "CurveLineSeries";
				}
			}
		}

		super.processConfig(config);
	}

	/**
	 * Creates and returns a new Series, suitable for [[CurveChart]].
	 *
	 * @return New Series
	 */
	protected createSeries(): this["_seriesType"] {
		return new CurveLineSeries();
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

	/**
	 * @ignore
	 * @return Has license?
	 */
	public hasLicense(): boolean {
		if (!super.hasLicense()) {
			return false;
		}
		for (let i = 0; i < options.licenses.length; i++) {
			if (options.licenses[i].match(/^TL.{5,}/i)) {
				return true;
			}
		}
		return false;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CurveChart"] = CurveChart;
