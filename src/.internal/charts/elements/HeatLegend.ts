/**
 * HeatLegend module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerEvents, IContainerAdapters } from "../../core/Container";
import { Series } from "../series/Series";
import { LinearGradient } from "../../core/rendering/fills/LinearGradient";
import { registry } from "../../core/Registry";
import { toColor, Color } from "../../core/utils/Color";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { percent } from "../../core/utils/Percent";
import { ValueAxis } from "../../charts/axes/ValueAxis";
import { AxisRendererX } from "../../charts/axes/AxisRendererX";
import { AxisRendererY } from "../../charts/axes/AxisRendererY";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $colors from "../../core/utils/Colors";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[HeatLegend]].
 */
export interface IHeatLegendProperties extends IContainerProperties {

	/**
	 * Minimum color
	 *
	 * @todo Description
	 */
	minColor?: Color;

	/**
	 * Minimum value
	 *
	 * @todo Description
	 */
	minValue?: number;

	/**
	 * Maximum value
	 *
	 * @todo Description
	 */
	maxValue?: number;


	/**
	 * Maximum color
	 *
	 * @todo Description
	 */
	maxColor?: Color;

	/**
	 * Number of markers (steps)
	 *
	 * @todo Description
	 */
	markerCount?: number;


	/**
	 * Orientation
	 *
	 * @todo Description
	 */
	orientation?: "horizontal" | "vertical";

}

/**
 * Defines events for [[HeatLegend]].
 */
export interface IHeatLegendEvents extends IContainerEvents { }

/**
 * Defines adapters for [[HeatLegend]].
 *
 * @see {@link Adapter}
 */
export interface IHeatLegendAdapters extends IContainerAdapters, IHeatLegendProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Sankey Diagram.
 *
 * @see {@link IHeatLegendEvents} for a list of available events
 * @see {@link IHeatLegendAdapters} for a list of available Adapters
 * @important
 */
export class HeatLegend extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IHeatLegendProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IHeatLegendAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IHeatLegendEvents;

	/**
	 * List of heat legend markers (color step rectangles).
	 */
	public markers: ListTemplate<RoundedRectangle>;

	/**
	 * Container which holds markers
	 */
	public markerContainer: Container;

	/**
	 * Value axis of a heat legend
	 * @ignore
	 */
	protected _valueAxis: ValueAxis;

	/**
	 * Series of a heat legend
	 * @ignore
	 */
	protected _series: Series;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "HeatLegend";

		this.markerContainer = this.createChild(Container);
		this.markerContainer.shouldClone = false;

		this.markerCount = 1;

		// Create a template container and list for the a marker
		let marker: RoundedRectangle = new RoundedRectangle();
		marker.minHeight = 20;
		marker.minWidth = 20;
		marker.interactionsEnabled = false;
		marker.fillOpacity = 1;
		marker.cornerRadius(0, 0, 0, 0);

		this.markerContainer.minHeight = 20;
		this.markerContainer.minWidth = 20;

		this.orientation = "horizontal";

		this.markers = new ListTemplate<RoundedRectangle>(marker);
		this._disposers.push(new ListDisposer(this.markers));
		this._disposers.push(this.markers.template);

		this.applyTheme();
	}


	protected getMinFromRules(property: string, ) {
		let series = this.series;
		if (series) {
			let minValue;
			$iter.eachContinue(series.heatRules.iterator(), (heatRule) => {
				if (heatRule.property == property) {
					minValue = heatRule.min;
					return false;
				}
				return true;
			})
			return minValue;
		}
	}

	protected getMaxFromRules(property: string, ) {
		let series = this.series;
		if (series) {
			let maxValue;
			$iter.each(series.heatRules.iterator(), (heatRule) => {
				if (heatRule.property == property) {
					maxValue = heatRule.max;
					return false;
				}
				return true;
			});
			return maxValue;
		}
	}

	/**
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {
		super.validate();

		this.valueAxis.renderer.inversed = this.reverseOrder;

		let series = this.series;

		let minColor = this.minColor;
		let maxColor = this.maxColor;

		if (!$type.hasValue(minColor)) {
			minColor = toColor(this.getMinFromRules("fill"));
		}

		if (!$type.hasValue(maxColor)) {
			maxColor = toColor(this.getMaxFromRules("fill"));
		}

		if (series) {
			let seriesFill = series.fill;
			if (!$type.hasValue(minColor) && seriesFill instanceof Color) {
				minColor = seriesFill;
			}
			if (!$type.hasValue(maxColor) && seriesFill instanceof Color) {
				maxColor = seriesFill;
			}
		}

		if (!$type.hasValue(maxColor)) {
			maxColor = toColor(this.getMaxFromRules("fill"));
		}

		let minOpacity = $type.toNumber(this.getMinFromRules("fillOpacity"));
		if (!$type.isNumber(minOpacity)) {
			minOpacity = 1;
		}
		let maxOpacity = $type.toNumber(this.getMaxFromRules("fillOpacity"));
		if (!$type.isNumber(maxOpacity)) {
			maxOpacity = 1;
		}


		let minStrokeOpacity = $type.toNumber(this.getMinFromRules("strokeOpacity"));
		if (!$type.isNumber(minStrokeOpacity)) {
			minStrokeOpacity = 1;
		}
		let maxStrokeOpacity = $type.toNumber(this.getMaxFromRules("strokeOpacity"));
		if (!$type.isNumber(maxStrokeOpacity)) {
			maxStrokeOpacity = 1;
		}

		let minStroke = toColor(this.getMinFromRules("stroke"));
		let maxStroke = toColor(this.getMaxFromRules("stroke"));


		//if (series) {
		for (let i = 0; i < this.markerCount; i++) {
			let marker = this.markers.getIndex(i);

			if (!marker) {
				marker = this.markers.create();
				marker.parent = this.markerContainer;
				marker.height = percent(100);
				marker.width = percent(100);
			}


			if (this.markerCount == 1) {
				let gradient = new LinearGradient();
				if (this.reverseOrder) {
					gradient.addColor(maxColor, maxOpacity);
					gradient.addColor(minColor, minOpacity);

				}
				else {
					gradient.addColor(minColor, minOpacity);
					gradient.addColor(maxColor, maxOpacity);
				}


				if (this.orientation == "vertical") {
					gradient.rotation = -90;
				}

				marker.fill = gradient;
				if ($type.hasValue(minStroke) && $type.hasValue(maxStroke)) {
					let strokeGradient = new LinearGradient();
					if (this.reverseOrder) {
						strokeGradient.addColor(maxStroke, maxStrokeOpacity);
						strokeGradient.addColor(minStroke, minStrokeOpacity);
					}
					else {
						strokeGradient.addColor(minStroke, minStrokeOpacity);
						strokeGradient.addColor(maxStroke, maxStrokeOpacity);
					}

					if (this.orientation == "vertical") {
						strokeGradient.rotation = -90;
					}
					marker.stroke = strokeGradient;
				}
			}
			else {
				let c = i;
				if (this.reverseOrder) {
					c = this.markerCount - i - 1;
				}

				let color = new Color($colors.interpolate(minColor.rgb, maxColor.rgb, c / this.markerCount));
				marker.fill = color;

				let opacity = minOpacity + (maxOpacity - minOpacity) * c / this.markerCount;
				marker.fillOpacity = opacity;

				if ($type.hasValue(minStroke) && $type.hasValue(maxStroke)) {
					let color = new Color($colors.interpolate(minStroke.rgb, maxStroke.rgb, c / this.markerCount));
					marker.stroke = color;

					let opacity = minStrokeOpacity + (maxStrokeOpacity - minStrokeOpacity) * c / this.markerCount;
					marker.strokeOpacity = opacity;
				}
			}
		}

		let renderer = this.valueAxis.renderer;
		if (this.markerCount > 1) {
			if (this.orientation == "horizontal") {
				renderer.minGridDistance = this.measuredWidth / this.markerCount;
			}
			else {
				renderer.minGridDistance = this.measuredHeight / this.markerCount;
			}
		}

		this.valueAxis.invalidate();

		for (let i = this.markerCount, len = this.markers.length; i < len; i++) {
			this.markers.getIndex(i).parent = undefined;
		}
	}

	/**
	 * Min color of a heat legend. If a series is set for the legend, minColor is taken from series.
	 *
	 * @param {Color}
	 */
	public set minColor(value: Color) {

		if (!(value instanceof Color)) {
			value = toColor(value);
		}

		this.setColorProperty("minColor", value, true);
	}

	/**
	 * Returns minColor value
	 * @return {Color}
	 */
	public get minColor(): Color {
		return this.getPropertyValue("minColor");
	}

	/**
	 * Max color of a heat legend. If a series is set for the legend, maxColor is taken from series.
	 *
	 * @param {Color}
	 */
	public set maxColor(value: Color) {

		if (!$type.isObject(value)) {
			value = toColor(value);
		}

		this.setColorProperty("maxColor", value, true);
	}

	/**
	 * Returns maxColor value
	 * @return {Color}
	 */
	public get maxColor(): Color {
		return this.getPropertyValue("maxColor");
	}

	/**
	 * Number of color squares (markers) in the heat legend. If only 1 marker is used, it will be filled with gradient.
	 *
	 * @param {number}
	 */
	public set markerCount(value: number) {
		this.setPropertyValue("markerCount", value, true);
	}

	/**
	 * Returns number of color squares (markers).
	 * @return {number}
	 */
	public get markerCount(): number {
		return this.getPropertyValue("markerCount");
	}

	/**
	 * Minimum value of heat legend's value axis. If a series is set for the legend, min is taken from series.
	 *
	 * @param {number}
	 */
	public set minValue(value: number) {
		this.setPropertyValue("minValue", value);
		this.valueAxis.min = value;
	}

	/**
	 * Returns minimum value of heat legend.
	 * @return {number}
	 */
	public get minValue(): number {
		return this.getPropertyValue("minValue");
	}

	/**
	 * Maximum value of heat legend's value axis. If a series is set for the legend, max is taken from series.
	 *
	 * @param {number}
	 */
	public set maxValue(value: number) {
		this.setPropertyValue("maxValue", value);
		this.valueAxis.max = value;
	}

	/**
	 * Returns maximum value of heat legend.
	 * @return {number}
	 */
	public get maxValue(): number {
		return this.getPropertyValue("maxValue");
	}

	/**
	* Heat legend orientation. Note, if you change orientation of a heat legend, you must set value axis renderer properties after that, as with orientation renderer changes.
	*
	* @param {"horizontal" | "vertical"}
	*/
	public set orientation(value: "horizontal" | "vertical") {
		this.setPropertyValue("orientation", value, true);
		let markerContainer = this.markerContainer;
		let valueAxis = this.valueAxis;

		// HORIZONTAL
		if (value == "horizontal") {
			if (!$type.hasValue(this.width)) {
				this.width = 200;
			}
			this.height = undefined;

			valueAxis.width = percent(100);
			valueAxis.height = undefined;
			valueAxis.tooltip.pointerOrientation = "vertical";

			this.layout = "vertical";
			markerContainer.width = percent(100);
			markerContainer.height = undefined;
			if (!(valueAxis.renderer instanceof AxisRendererX)) {
				valueAxis.renderer = new AxisRendererX();
			}
		}
		// VERTICAL
		else {
			if (!$type.hasValue(this.height)) {
				this.height = 200;
			}
			this.width = undefined;
			this.layout = "horizontal";
			markerContainer.width = undefined;
			markerContainer.height = percent(100);
			valueAxis.height = percent(100);
			valueAxis.width = undefined;
			valueAxis.tooltip.pointerOrientation = "horizontal";

			if (!(valueAxis.renderer instanceof AxisRendererY)) {
				valueAxis.renderer = new AxisRendererY();
			}
			valueAxis.renderer.inside = true;
			valueAxis.renderer.labels.template.inside = true;

			this.markerContainer.reverseOrder = true;
		}

		let renderer = valueAxis.renderer;
		renderer.grid.template.disabled = true;
		renderer.axisFills.template.disabled = true;
		renderer.baseGrid.disabled = true;
		renderer.labels.template.padding(2, 3, 2, 3);

		renderer.minHeight = undefined;
		renderer.minWidth = undefined;

		this.markerContainer.layout = value;
	}

	/**
	 * Returns orientation value.
	 *
	 * @return {"horizontal" | "vertical"}
	 */
	public get orientation(): "horizontal" | "vertical" {
		return this.getPropertyValue("orientation");
	}

	/**
	 * Sets a value axis of heat legend. Value axis for heat legend is created automatically.
	 * @param {ValueAxis}
	 */
	public set valueAxis(valueAxis: ValueAxis) {

		this._valueAxis = valueAxis;

		valueAxis.parent = this;
		valueAxis.strictMinMax = true;
		this.orientation = this.orientation;
	}

	/**
	 * Returns valueAxis value.
	 * @return {ValueAxis}
	 */
	public get valueAxis(): ValueAxis {
		if (!this._valueAxis) {
			this.valueAxis = this.createChild(ValueAxis);
			this.valueAxis.shouldClone = false;
		}
		return this._valueAxis;
	}

	/**
	 * You can set series for heat legend. It will take min, max, minColor and maxColor values from this series.
	 * @param series
	 */
	set series(series: Series) {
		this._series = series;

		let dataField = "value";

		try {
			let dataFieldDefined = series.heatRules.getIndex(0).dataField;
			if (dataFieldDefined) {
				dataField = dataFieldDefined;
			}
		}
		catch (err) {

		}

		this.updateMinMax(series.dataItem.values[dataField].low, series.dataItem.values[dataField].high);

		series.dataItem.events.on("calculatedvaluechanged", (event) => {
			this.updateMinMax(series.dataItem.values[dataField].low, series.dataItem.values[dataField].high);
		}, undefined, false);

		series.heatRules.events.on("inserted", this.invalidate, this, false);
		series.heatRules.events.on("removed", this.invalidate, this, false);
	}

	/**
	 * Returns series value.
	 * @return {Series}
	 */
	get series(): Series {
		return this._series;
	}

	/**
	 * Updates min/max of value axis.
	 * @ignore
	 */
	protected updateMinMax(min: number, max: number) {
		let valueAxis = this.valueAxis;
		if (!$type.isNumber(this.minValue)) {
			valueAxis.min = min;
			valueAxis.invalidate();
		}
		if (!$type.isNumber(this.maxValue)) {
			valueAxis.max = max;
			valueAxis.invalidate();
		}
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
			if ($type.hasValue(config.series) && $type.isString(config.series)) {
				if ($type.isString(config.series)) {
					if (this.map.hasKey(config.series)) {
						config.series = this.map.getKey(config.series);
					}
					else {
						let seriesId = config.series;
						const disposer = this.map.events.on("insertKey", function(ev) {
							if (ev.key == seriesId) {
								this.series = ev.newValue;
								disposer.dispose();
							}
						}, this);
						this._disposers.push(disposer);
						delete config.series;
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
registry.registeredClasses["HeatLegend"] = HeatLegend;
