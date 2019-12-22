/**
 * Value Axis module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Axis, AxisDataItem, IAxisProperties, IAxisDataFields, IAxisAdapters, IAxisEvents } from "./Axis";
import { AxisRenderer } from "./AxisRenderer";
import { AxisRendererY } from "./AxisRendererY";
import { AxisTick } from "./AxisTick";
import { AxisLabel } from "./AxisLabel";
import { AxisFill } from "./AxisFill";
import { List } from "../../core/utils/List";
import { IPoint, IOrientationPoint } from "../../core/defs/IPoint";
import { Grid } from "./Grid";
import { IDisposer, MultiDisposer } from "../../core/utils/Disposer";
import { XYChart } from "../types/XYChart";
import { XYSeries, XYSeriesDataItem } from "../series/XYSeries";
import { registry } from "../../core/Registry";
import { ValueAxisBreak } from "./ValueAxisBreak";
import * as $math from "../../core/utils/Math";
import * as $iter from "../../core/utils/Iterator";
import * as $object from "../../core/utils/Object";
import * as $type from "../../core/utils/Type";
import * as $utils from "../../core/utils/Utils";
import { Animation } from "../../core/utils/Animation";
import { IRange } from "../../core/defs/IRange";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[ValueAxis]].
 *
 * @see {@link DataItem}
 */
export class ValueAxisDataItem extends AxisDataItem {
	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: ValueAxis;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ValueAxisDataItem";

		this.values.value = {};
		this.values.endValue = {};

		this.applyTheme();
	}

	/**
	 * A data point's numeric value.
	 *
	 * @param value  Value
	 */
	public set value(value: number) {
		this.setValue("value", value);
	}

	/**
	 * @return Value
	 */
	public get value(): number {
		return this.values["value"].value;
	}

	/**
	 * Data point's numeric end value.
	 *
	 * @param value  End value
	 */
	public set endValue(value: number) {
		this.setValue("endValue", value);
	}

	/**
	 * @return Value
	 */
	public get endValue(): number {
		return this.values["endValue"].value;
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 */
export interface IMinMaxStep {
	min: number;
	max: number;
	step: number;
}

/**
 * Defines data fields for [[ValueAxis]].
 */
export interface IValueAxisDataFields extends IAxisDataFields { }

/**
 * Defines properties for [[ValueAxis]].
 */
export interface IValueAxisProperties extends IAxisProperties {
	strictMinMax?: boolean;
	logarithmic?: boolean;
	maxPrecision?: number;
	extraMin?: number;
	extraMax?: number;
	keepSelection?: boolean;
	includeRangesInMinMax?: boolean;
}

/**
 * Defines events for [[ValueAxis]].
 */
export interface IValueAxisEvents extends IAxisEvents {

	/**
	 * Invoked when selection/zoom on axis occurs and start/end coordinates
	 * change.
	 */
	selectionextremeschanged: {};

	/**
	 * Invoked when start/end coordinates of the axis change.
	 */
	extremeschanged: {};

}

/**
 * Defines adapters for [[ValueAxis]].
 *
 * @see {@link Adapter}
 */
export interface IValueAxisAdapters extends IAxisAdapters, IValueAxisProperties {
	/**
	 * Applied to the base value of the axis
	 */
	baseValue: number,

	/**
	 * Applied to the min value of the axis
	 */
	min: number

	/**
	 * Applied to the max value of the axis
	 */
	max: number
}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to create a value axis for the chart.
 *
 * ```TypeScript
 * // Create the axis
 * let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 *
 * // Set settings
 * valueAxis.title.text = "Monthly Sales";
 * ```
 * ```JavaScript
 * // Create the axis
 * var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 *
 * // Set settings
 * valueAxis.title.text = "Monthly Sales";
 * ```
 * ```JSON
 * "yAxes": [{
 *   "type": "ValueAxis",
 *   "title": {
 *     "text": "Monthly Sales"
 *   }
 * }]
 * ```
 *
 * @see {@link IValueAxisEvents} for a list of available Events
 * @see {@link IValueAxisAdapters} for a list of available Adapters
 * @important
 */
export class ValueAxis<T extends AxisRenderer = AxisRenderer> extends Axis<T> {

	/**
	 * Defines data fields.
	 */
	public _dataFields: IValueAxisDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IValueAxisProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IValueAxisAdapters;

	/**
	 * Defines the type of the Date Items.
	 */
	public _dataItem: ValueAxisDataItem;

	/**
	 * Defines the type of the axis breaks.
	 */
	public _axisBreak: ValueAxisBreak;

	/**
	 * Defines available events.
	 */
	public _events!: IValueAxisEvents;

	/**
	 * A reference to chart the axis is for.
	 */
	public chart: XYChart;

	/**
	 * A list of Series that are using this Axis.
	 */
	public series: List<XYSeries>;

	/**
	 * Minimum value for the axis scale.
	 */
	protected _min: number;

	/**
	 * Maximum value for the axis scale.
	 */
	protected _max: number;

	/**
	 * User-defined min value for axis.
	 */
	protected _minDefined: number;

	/**
	 * User-defined max value for axis.
	 */
	protected _maxDefined: number;

	/**
	 * [_minAdjusted description]
	 *
	 * @todo Description
	 */
	protected _minAdjusted: number;

	/**
	 * [_maxAdjusted description]
	 *
	 * @todo Description
	 */
	protected _maxAdjusted: number;

	/**
	 * Min real value. (lowest value of all data points)
	 */
	protected _minReal: number;

	/**
	 * Max real value. (highest value of all data points)
	 */
	protected _maxReal: number;

	/**
	 * Min value within current zoom.
	 */
	protected _minZoomed: number;

	/**
	 * Max value within current zoom.
	 */
	protected _maxZoomed: number

	/**
	 * [_step description]
	 *
	 * @todo Description
	 */
	protected _step: number;

	/**
	 * [_stepDecimalPlaces description]
	 *
	 * @todo Description
	 */
	protected _stepDecimalPlaces: number = 0;

	/**
	 * [_difference description]
	 *
	 * @todo Description
	 */
	protected _difference: number;

	/**
	 * Base value for the axis.
	 */
	protected _baseValue: number = 0;

	/**
	 * [_previousValue description]
	 *
	 * @todo Description
	 */
	protected _previousValue: number;

	/**
	 * [_previousPoint description]
	 *
	 * @todo Description
	 */
	protected _previousPoint: IPoint;

	/**
	 * Adjusted start in case we have breaks.
	 *
	 * @todo Description
	 */
	protected _adjustedStart: number = 0;

	/**
	 * Adjusted end in case we have breaks.
	 *
	 * @todo Description
	 */
	protected _adjustedEnd: number = 1;

	protected _finalMin: number;
	protected _finalMax: number;

	protected _extremesChanged: boolean = false;

	protected _deltaMinMax: number = 1;

	/**
	 * Holds reference to a function that accepts a DataItem as parameter.
	 *
	 * It can either return a fill opacity for a fill, or manipulate data item
	 * directly, to create various highlighting scenarios.
	 */
	public fillRule(dataItem: this["_dataItem"]): void {
		let value = dataItem.value;
		let axis = dataItem.component;
		if (!dataItem.axisFill.disabled) {
			// rounding in left to solve floating point number
			if ($math.round(value / axis.step / 2, 5) == Math.round(value / axis.step / 2)) {
				dataItem.axisFill.__disabled = true;
			}
			else {
				dataItem.axisFill.__disabled = false;
			}
		}
	}

	/**
	 * As calculating totals is expensive operation and not often needed, we
	 * don't do it by default.
	 *
	 * In case you use `totalPercent` or `total` in your charts, this must be set
	 * to `true`.
	 *
	 * @default false
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/xy-chart/#100_stacks} For using `calculateTotals` for 100% stacked series.
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-strings/#Placeholders_for_numeric_values} For using `calculateTotals` in labels.
	 */
	public calculateTotals: boolean = false;


	protected _minMaxAnimation: Animation;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "ValueAxis";

		// Set field name
		this.axisFieldName = "value";

		// Set defaults
		this.setPropertyValue("maxZoomFactor", 1000);
		this.setPropertyValue("extraMin", 0);
		this.setPropertyValue("extraMax", 0);
		this.setPropertyValue("strictMinMax", false);
		this.setPropertyValue("maxPrecision", Number.MAX_VALUE);
		this.keepSelection = false;
		this.includeRangesInMinMax = false;

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Returns a new/empty [[DataItem]] of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new ValueAxisDataItem();
	}

	/**
	 * Returns a new/empty [[AxisBreak]] of the appropriate type.
	 *
	 * @return Axis break
	 */
	protected createAxisBreak(): this["_axisBreak"] {
		return new ValueAxisBreak();
	}

	/**
	 * [dataChangeUpdate description]
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public dataChangeUpdate(): void {
		if (!this.keepSelection) {
			if (this._start != 0 || this._end != 1) {
				this._start = 0;
				this._end = 1;
				this.dispatchImmediately("startendchanged");
			}
		}
		else {
			if (this._start != 0) {
				this.dispatchImmediately("startchanged");
			}
			if (this._end != 1) {
				this.dispatchImmediately("endchanged");

			}
			if (this._start != 0 || this._end != 1) {
				this.dispatchImmediately("startendchanged");
			}
		}

		this._maxZoomed = this._maxDefined;
		this._minZoomed = this._minDefined;
		this._maxAdjusted = this._maxDefined;
		this._minAdjusted = this._minDefined;
	}

	/**
	 * Processes data items of the related Series.
	 *
	 * @ignore Exclude from docs
	 */
	public processSeriesDataItems(): void {
		// @todo: add some boolean (maybe autodedect) if we need these calculations or not. this place uses a lot of cpu
		if (this.calculateTotals) {
			let series: XYSeries = this.series.getIndex(0);
			let startIndex: number = series.startIndex;

			if (series.dataItems.length > 0) {

				if (startIndex > 0) {
					startIndex--;
				}
				let endIndex: number = series.endIndex;
				if (endIndex < series.dataItems.length) {
					endIndex++;
				}


				// This has to be `var` in order to avoid garbage collection
				for (let i: number = startIndex; i < endIndex; ++i) {
					// This has to be `var` in order to avoid garbage collection
					const total: { [index: string]: number } = {};

					this.series.each((series) => {
						if (!series.excludeFromTotal) {
							let dataItem: XYSeriesDataItem = series.dataItems.getIndex(i);
							if (dataItem) {
								$object.each(dataItem.values, (key) => {
									let value: number = dataItem.values[key].workingValue; // can not use getWorkingValue here!

									if ($type.isNumber(value)) {
										if (!$type.isNumber(total[key])) {
											total[key] = Math.abs(value);
										}
										else {
											total[key] += Math.abs(value);
										}
									}
								});
							}
						}
					});


					this.series.each((series) => {
						if (!series.excludeFromTotal) {
							let dataItem: XYSeriesDataItem = series.dataItems.getIndex(i);
							if (dataItem) {
								$object.each(dataItem.values, (key) => {
									let value: number = dataItem.values[key].workingValue; // can not use getWorkingValue here!
									if ($type.isNumber(value)) {
										dataItem.setCalculatedValue(key, total[key], "total");
										dataItem.setCalculatedValue(key, 100 * value / total[key], "totalPercent");
									}
								});
							}
						}
					});
				}
			}
		}
	}


	/**
	 * Validates the whole axis. Causes it to redraw.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 */
	public validate(): void {

		if (this.axisLength <= 0) {
			return;
		}

		super.validate();

		this.getMinMax();

		this.fixAxisBreaks();

		this.calculateZoom();

		this.validateAxisElements();

		this.validateAxisRanges();

		this.validateBreaks();

		this.hideUnusedDataItems();

		this.renderer.invalidateLayout();
		// hide too close
		//this.hideTooCloseDataItems();
	}

	/**
	 * Calculates all positions, related to axis as per current zoom.
	 *
	 * @ignore Exclude from docs
	 */
	public calculateZoom(): void {
		if ($type.isNumber(this.min) && $type.isNumber(this.max)) {
			let min: number = this.positionToValue(this.start);
			let max: number = this.positionToValue(this.end);

			let differece: number = this.adjustDifference(min, max);
			let minMaxStep: IMinMaxStep = this.adjustMinMax(min, max, differece, this._gridCount, true);

			min = minMaxStep.min;
			max = minMaxStep.max;

			this._adjustedStart = $math.round((min - this.min) / (this.max - this.min), 5);
			this._adjustedEnd = $math.round((max - this.min) / (this.max - this.min), 5);

			this._step = minMaxStep.step;
			this._stepDecimalPlaces = $utils.decimalPlaces(this._step);

			if (this._minZoomed != min || this._maxZoomed != max) {
				this._minZoomed = min;
				this._maxZoomed = max;
				this.dispatchImmediately("selectionextremeschanged");
			}

		}
		else {
			this._adjustedStart = this.start;
			this._adjustedEnd = this.end;
		}
	}

	/**
	 * Validates Axis elements.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public validateAxisElements(): void {
		if ($type.isNumber(this.max) && $type.isNumber(this.min)) {
			// first regular items
			let value: number = this.minZoomed - this._step * 2;

			if (!this.logarithmic) {
				value = Math.floor(value / this._step) * this._step;
			}
			else {
				let differencePower = Math.log(this.max) * Math.LOG10E - Math.log(this.min) * Math.LOG10E;
				if (differencePower > 1) {
					value = Math.pow(10, Math.log(this.min) * Math.LOG10E);
				}
				else {
					value = Math.floor(this.minZoomed / this._step) * this._step;
					if (value == 0) {
						value = this.minZoomed;
					}
				}
			}

			let maxZoomed = this._maxZoomed + this._step;

			this.resetIterators();

			let dataItemsIterator = this._dataItemsIterator;

			let i: number = 0;

			while (value <= maxZoomed) {
				let axisBreak: ValueAxisBreak = <ValueAxisBreak>this.isInBreak(value);

				if (!axisBreak) {

					let dataItem: this["_dataItem"] = dataItemsIterator.find((x) => x.value === value);
					if (dataItem.__disabled) {
						dataItem.__disabled = false;
					}
					//this.processDataItem(dataItem);
					this.appendDataItem(dataItem);
					dataItem.axisBreak = undefined;
					if (dataItem.value != value) {
						dataItem.value = value;

						dataItem.text = this.formatLabel(value);
						if (dataItem.label && dataItem.label.invalid) {
							dataItem.label.validate();
						}
						if (dataItem.value >= this.min && dataItem.value <= this.max) {
							if (dataItem.label) {
								if ((this.axisLetter == "Y" && dataItem.label.measuredWidth > this.ghostLabel.measuredWidth) || (this.axisLetter == "X" && dataItem.label.measuredHeight > this.ghostLabel.measuredHeight)) {
									this.ghostLabel.text = dataItem.label.currentText;
									this.ghostLabel.validate();
								}
							}
						}
					}
					this.validateDataElement(dataItem);
				}
				i++;

				if (!this.logarithmic) {
					value += this._step;

				}
				else {
					let differencePower = Math.log(this.max) * Math.LOG10E - Math.log(this.min) * Math.LOG10E;
					if (differencePower > 1) {
						value = Math.pow(10, Math.log(this.min) * Math.LOG10E + i);
					}
					else {
						value += this._step;
					}
				}


				let stepPower = Math.pow(10, Math.floor(Math.log(Math.abs(this._step)) * Math.LOG10E));
				if (stepPower < 1) {
					// exponent is less then 1 too. Count decimals of exponent
					let decCount = Math.round(Math.abs(Math.log(Math.abs(stepPower)) * Math.LOG10E)) + 2;
					// round value to avoid floating point issues
					value = $math.round(value, decCount);
				}
			}


			let axisBreaks = this._axisBreaks;
			if (axisBreaks) {
				// breaks later
				let renderer: AxisRenderer = this.renderer;

				$iter.each(axisBreaks.iterator(), (axisBreak) => {
					if (axisBreak.breakSize > 0) {
						// only add grid if gap is bigger then minGridDistance
						if ($math.getDistance(axisBreak.startPoint, axisBreak.endPoint) > renderer.minGridDistance) {
							let breakValue: number = axisBreak.adjustedMin;

							while (breakValue <= axisBreak.adjustedMax) {
								if (breakValue >= axisBreak.adjustedStartValue && breakValue <= axisBreak.adjustedEndValue) {
									let dataItem: this["_dataItem"] = dataItemsIterator.find((x) => x.value === breakValue);
									if (dataItem.__disabled) {
										dataItem.__disabled = false;
									}
									//this.processDataItem(dataItem);
									this.appendDataItem(dataItem);
									dataItem.axisBreak = axisBreak;
									if (dataItem.value != breakValue) {
										dataItem.value = breakValue;
										dataItem.text = this.formatLabel(breakValue);
										if (dataItem.label && dataItem.label.invalid) {
											dataItem.label.validate();
										}
									}
									this.validateDataElement(dataItem);
								}
								breakValue += axisBreak.adjustedStep;
							}
						}
					}
				});
			}
		}
	}

	/**
	 * Validates axis data item.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param dataItem  Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {
		super.validateDataElement(dataItem);

		//dataItem.__disabled = false;

		dataItem.itemIndex = this._axisItemCount;
		this._axisItemCount++;

		let renderer: AxisRenderer = this.renderer;
		let value: number = dataItem.value;
		let endValue: number = dataItem.endValue;

		let position: number = this.valueToPosition(value);
		dataItem.position = position;

		let endPosition: number = position;
		let fillEndPosition: number = this.valueToPosition(value + this._step);

		if ($type.isNumber(endValue)) {
			endPosition = this.valueToPosition(endValue);
			fillEndPosition = endPosition;
		}

		// this point is needed to calculate distance to satisfy minGridDistance
		dataItem.point = renderer.positionToPoint(position);

		let tick: AxisTick = dataItem.tick;
		if (tick && !tick.disabled) {
			renderer.updateTickElement(tick, position, endPosition);
		}

		let grid: Grid = dataItem.grid;
		if (grid && !grid.disabled) {
			renderer.updateGridElement(grid, position, endPosition);
		}


		let label: AxisLabel = dataItem.label;
		if (label && !label.disabled) {
			renderer.updateLabelElement(label, position, endPosition);
		}

		let fill: AxisFill = dataItem.axisFill;
		if (fill && !fill.disabled) {
			renderer.updateFillElement(fill, position, fillEndPosition);
			if (!dataItem.isRange) {
				this.fillRule(dataItem);
			}
		}

		if (dataItem.bullet) {
			renderer.updateBullet(dataItem.bullet, position, endPosition);
		}

		let mask: AxisFill = dataItem.mask;
		if (mask) {
			renderer.updateFillElement(mask, position, fillEndPosition);
		}
	}

	/**
	 * Formats the value according to axis' own [[NumberFormatter]].
	 *
	 * @param value  Source value
	 * @return Formatted value
	 */
	public formatLabel(value: number): string {
		return this.numberFormatter.format(value);
	}

	/**
	 * Coordinates of the actual axis start.
	 *
	 * @ignore Exclude from docs
	 * @return Base point
	 */
	public get basePoint(): IPoint {
		let baseValue: number = this.baseValue;
		let position: number = this.valueToPosition(baseValue);
		let basePoint: IPoint = this.renderer.positionToPoint(position);

		return basePoint;
	}

	/**
	 * A base value.
	 *
	 * This is a threshold value that will divide "positive" and "negative"
	 * value ranges.
	 *
	 * Other scale-related functionality also depend on base value. E.g. stacks,
	 * value-dependent coloring, etc.
	 *
	 * @param value Base value
	 */
	public set baseValue(value: number) {
		this._baseValue = value;
		this.invalidateLayout();
		this.invalidateSeries();
	}

	/**
	 * @return base value
	 */
	public get baseValue(): number {

		let baseValue = this._baseValue;
		if (this.logarithmic) {
			baseValue = this.min;
		}

		if (!this._adapterO) {
			return baseValue;
		}
		else {
			return this._adapterO.apply("baseValue", baseValue);
		}

	}

	/**
	 * Converts a numeric value to relative position on axis
	 *
	 * An alias to `valueToPosition()`.
	 *
	 * @param value  Value
	 * @return Position
	 */
	public anyToPosition(value: number): number {
		return this.valueToPosition(value);
	}


	/**
	 * Converts a numeric value to orientation point (x, y, angle) on axis
	 *
	 * @param value  Value
	 * @return Orientation point
	 */
	public valueToPoint(value: number): IOrientationPoint {
		let position = this.valueToPosition(value);
		let point = this.renderer.positionToPoint(position);
		let angle = this.renderer.positionToAngle(position);
		return { x: point.x, y: point.y, angle: angle };
	}

	/**
	 * Converts a numeric value to orientation (x, y, angle) point on axis
	 *
	 * @param value  Value
	 * @return Orientation point
	 */
	public anyToPoint(value: number): IOrientationPoint {
		return this.valueToPoint(value);
	}


	/**
	 * Converts a numeric value to relative position on axis.
	 *
	 * @param value  Value
	 * @return relative position
	 */
	public valueToPosition(value: number): number {
		if ($type.isNumber(value)) {

			// todo: think if possible to take previous value and do not go through all previous breaks
			let min: number = this.min;
			let max: number = this.max;

			if ($type.isNumber(min) && $type.isNumber(max)) {
				let difference: number = this._difference;

				let axisBreaks = this._axisBreaks;
				if (axisBreaks && axisBreaks.length > 0) {
					$iter.eachContinue(axisBreaks.iterator(), (axisBreak) => {
						let startValue: number = axisBreak.adjustedStartValue;
						let endValue: number = axisBreak.adjustedEndValue;

						if ($type.isNumber(startValue) && $type.isNumber(endValue)) {

							if (value < startValue) {
								return false;
							}

							if ($math.intersect({ start: startValue, end: endValue }, { start: min, end: max })) { // todo: check this once and set some flag in axisBreak
								startValue = Math.max(startValue, min);
								endValue = Math.min(endValue, max);

								let breakSize: number = axisBreak.breakSize;

								// value to the right of break end
								if (value > endValue) {
									min += (endValue - startValue) * (1 - breakSize); // todo: maybe this can be done differently?
								}
								// value to the left of break start
								else if (value < startValue) {

								}
								// value within break
								else {
									value = startValue + (value - startValue) * breakSize;
								}
							}
						}

						return true;
					});
				}

				let position;

				if (!this.logarithmic) {
					position = (value - min) / difference;
				}
				else {
					position = (Math.log(value) * Math.LOG10E - Math.log(this.min) * Math.LOG10E) / ((Math.log(this.max) * Math.LOG10E - Math.log(this.min) * Math.LOG10E));
				}

				//position = $math.round(position, 10);

				return position;
			}
		}

		return 0;
	}

	/**
	 * Converts an relative position to a corresponding value within
	 * axis' scale.
	 *
	 * @param position  Position (px)
	 * @return Value
	 */
	public positionToValue(position: number): number {
		position = $math.round(position, 10);

		let min: number = this.min;
		let max: number = this.max;

		if ($type.isNumber(min) && $type.isNumber(max)) {

			let difference: number = max - min; //no need to adjust!

			let value: number = null;

			let axisBreaks = this._axisBreaks;

			if (axisBreaks) {
				// in case we have some axis breaks
				if (axisBreaks.length > 0) {
					$iter.eachContinue(axisBreaks.iterator(), (axisBreak) => {
						let breakStartPosition: number = axisBreak.startPosition;
						let breakEndPosition: number = axisBreak.endPosition;

						let breakStartValue: number = axisBreak.adjustedStartValue;
						let breakEndValue: number = axisBreak.adjustedEndValue;

						if ($type.isNumber(breakStartValue) && $type.isNumber(breakEndValue)) {

							if (breakStartValue > max) {
								return false;
							}

							if ($math.intersect({ start: breakStartValue, end: breakEndValue }, { start: min, end: max })) {

								breakStartValue = $math.max(breakStartValue, min);
								breakEndValue = $math.min(breakEndValue, max);

								let breakSize: number = axisBreak.breakSize;

								difference -= (breakEndValue - breakStartValue) * (1 - breakSize);

								// position to the right of break end
								if (position > breakEndPosition) {
									min += (breakEndValue - breakStartValue) * (1 - breakSize);
								}
								// position to the left of break start
								else if (position < breakStartPosition) {

								}
								// value within break
								else {
									let breakPosition: number = (position - breakStartPosition) / (breakEndPosition - breakStartPosition);
									value = breakStartValue + breakPosition * (breakEndValue - breakStartValue);
									return false;
								}
							}
							return true;
						}
					});
				}
			}

			if (!$type.isNumber(value)) {
				if (this.logarithmic) {
					value = Math.pow(Math.E, (position * ((Math.log(this.max) * Math.LOG10E - Math.log(this.min) * Math.LOG10E)) + Math.log(this.min) * Math.LOG10E) / Math.LOG10E);
				}
				else {
					value = position * difference + min;
				}
			}

			return value;
		}
		//}
	}

	/**
	 * Converts an X coordinate to a relative value in axis' scale.
	 *
	 * @param x  X (px)
	 * @return Value
	 */
	public xToValue(x: number): number {
		return this.positionToValue(this.pointToPosition({ x: x, y: 0 }));
	}

	/**
	 * Converts an Y coordinate to a relative value in axis' scale.
	 *
	 * @param y  Y (px)
	 * @return Value
	 */
	public yToValue(y: number): number {
		return this.positionToValue(this.pointToPosition({ x: 0, y: y }));
	}


	/**
	 * Converts pixel coordinates to a relative position. (0-1)
	 *
	 * @param point  Coorinates (px)
	 * @return Position (0-1)
	 */
	public pointToPosition(point: IPoint): number {
		if (this.renderer instanceof AxisRendererY) {
			return 1 - this.renderer.pointToPosition(point);
		}
		else {
			return this.renderer.pointToPosition(point);
		}
	}

	/**
	 * @ignore
	 */
	protected animateMinMax(min: number, max: number): Animation {
		return this.animate([{ property: "_minAdjusted", from: this._minAdjusted, to: min }, { property: "_maxAdjusted", from: this._maxAdjusted, to: max }], this.rangeChangeDuration, this.rangeChangeEasing);
	}


	/**
	 * Calculates smallest and biggest value for the axis scale.
	 * @ignore
	 * @todo Description (review)
	 */
	public getMinMax() {

		this.updateGridCount();

		let min: number = Number.POSITIVE_INFINITY;
		let max: number = Number.NEGATIVE_INFINITY;

		// only if min and max are not set from outside, we go through min and max influencers
		if (!$type.isNumber(this._minDefined) || !$type.isNumber(this._maxDefined)) {
			this.series.each((series) => {
				if (!series.ignoreMinMax) {
					// check min
					let seriesMin: number = series.min(this);
					if ($type.isNumber(seriesMin) && (seriesMin < min)) {
						min = seriesMin;
					}
					// check max
					let seriesMax: number = series.max(this);

					if ($type.isNumber(seriesMax) && (seriesMax > max)) {
						max = seriesMax;
					}
				}
			});

			if (this.includeRangesInMinMax) {
				this.axisRanges.each((range) => {
					if (!range.ignoreMinMax) {
						let minValue = $math.min(range.value, range.endValue);
						let maxValue = $math.max(range.value, range.endValue);

						if (minValue < min || !$type.isNumber(min)) {
							min = minValue;
						}
						if (maxValue > max || !$type.isNumber(max)) {
							max = maxValue;
						}
					}
				})
			}
		}

		if (this.logarithmic) {
			if (min <= 0) {
				throw Error("Logarithmic value axis can not have vales <= 0.");
			}
		}

		if (min == 0 && max == 0) {
			max = 0.9;
			min = -0.9;
		}

		// if defined from outside
		if ($type.isNumber(this._minDefined)) {
			min = this._minDefined;
		}

		if ($type.isNumber(this._maxDefined)) {
			max = this._maxDefined;
		}

		if (this._adapterO) {
			min = this._adapterO.apply("min", min);
		}

		if (this._adapterO) {
			max = this._adapterO.apply("max", max);
		}

		if (!$type.isNumber(min) || !$type.isNumber(max)) {
			return;
		}

		this._minReal = min;
		this._maxReal = max;

		if (min == Number.POSITIVE_INFINITY) {
			min = undefined;
		}
		if (max == Number.NEGATIVE_INFINITY) {
			max = undefined;
		}

		let dif: number = this.adjustDifference(min, max); // previously it was max-min, but not worked well

		min = this.fixMin(min);
		max = this.fixMax(max);

		// this happens if starLocation and endLocation are 0.5 and DateAxis has only one date
		if (max - min <= 1 / Math.pow(10, 15)) {
			if (max - min != 0) {
				this._deltaMinMax = (max - min) / 2;
			}
			else {

				// the number by which we need to raise 10 to get difference
				let exponent: number = Math.log(Math.abs(max)) * Math.LOG10E;

				// here we find a number which is power of 10 and has the same count of numbers as difference has
				let power = Math.pow(10, Math.floor(exponent));

				// reduce this number by 10 times
				power = power / 10;

				this._deltaMinMax = power;
			}
			min -= this._deltaMinMax;
			max += this._deltaMinMax;
		}

		min -= (max - min) * this.extraMin;
		max += (max - min) * this.extraMax;

		let strict = this.strictMinMax;
		if ($type.isNumber(this._maxDefined)) {
			strict = true;
		}

		let minMaxStep: IMinMaxStep = this.adjustMinMax(min, max, dif, this._gridCount, strict);

		min = minMaxStep.min;
		max = minMaxStep.max;

		dif = max - min;  //new

		// do it for the second time (importat!)
		minMaxStep = this.adjustMinMax(min, max, max - min, this._gridCount, true);

		min = minMaxStep.min;
		max = minMaxStep.max;

		// return min max if strict
		if (this.strictMinMax) {
			if ($type.isNumber(this._minDefined)) {
				min = this._minDefined;
			}
			else {
				min = this._minReal;
			}

			if ($type.isNumber(this._maxDefined)) {
				max = this._maxDefined;
			}
			else {
				max = this._maxReal;
			}

			if (max - min <= 0.00000001) {
				min -= this._deltaMinMax;
				max += this._deltaMinMax;
			}

			min -= (max - min) * this.extraMin;
			max += (max - min) * this.extraMax;
		}

		if (this._adapterO) {
			min = this._adapterO.apply("min", min);
		}

		if (this._adapterO) {
			max = this._adapterO.apply("max", max);
		}

		// checking isNumber is good when all series are hidden
		if ((this._minAdjusted != min || this._maxAdjusted != max) && $type.isNumber(min) && $type.isNumber(max)) {

			let animation = this._minMaxAnimation;

			if (this._extremesChanged && $type.isNumber(this._minAdjusted) && $type.isNumber(this._maxAdjusted) && this.inited) {
				if ((animation && !animation.isFinished()) && this._finalMax == max && this._finalMin == min) {
					return;
				}
				else {
					this._finalMin = min;
					this._finalMax = max;

					animation = this.animateMinMax(min, max);

					if (animation && !animation.isFinished()) {
						animation.events.on("animationprogress", this.validateDataItems, this);

						animation.events.on("animationended", () => {
							//this.validateDataItems();
							this.series.each((series) => {
								series.validate();
							})
							this.validateDataItems();
							this.handleSelectionExtremesChange();
						});
						this._minMaxAnimation = animation;
					}
					else {
						this.series.each((series) => {
							series.validate();
						})
					}

					this.validateDataItems();
					this.dispatchImmediately("extremeschanged");
					this.handleSelectionExtremesChange();
				}
			}
			else {
				if ((animation && !animation.isFinished()) && this._finalMax == max && this._finalMin == min) {
					return;
				}
				else {

					this._minAdjusted = min;
					this._maxAdjusted = max;

					this._finalMin = min;
					this._finalMax = max;

					this.invalidateDataItems();
					this.dispatchImmediately("extremeschanged");
				}
			}
		}
		this._extremesChanged = false;
		this._difference = this.adjustDifference(min, max);
	}

	/**
	 * Adjusts the minimum value.
	 *
	 * This is a placeholder method for extending classes to override.
	 *
	 * For numeric values this does nothing, however for more complex types, like
	 * dates, it may be necessary to adjust.
	 *
	 * @param value  Value
	 * @return Adjusted value
	 */
	protected fixMin(value: number): number {
		return value;
	}

	/**
	 * Adjusts the maximum value.
	 *
	 * This is a placeholder method for extending classes to override.
	 *
	 * For numeric values this does nothing, however for more complex types, like
	 * dates, it may be necessary to adjust.
	 *
	 * @param value  Value
	 * @return Adjusted value
	 */
	protected fixMax(value: number): number {
		return value;
	}

	/**
	 * Adjusts actual min and max scale values so that the axis starts and ends
	 * at "nice" values, unless `strictMinMax` is set.
	 *
	 * The `difference` can be something else than `max - min`, because of the
	 * axis breaks.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param min        [description]
	 * @param max        [description]
	 * @param difference [description]
	 * @param gridCount  [description]
	 * @param strictMode [description]
	 * @return [description]
	 */
	public adjustMinMax(min: number, max: number, difference: number, gridCount: number, strictMode?: boolean): IMinMaxStep {

		// will fail if 0
		if (gridCount <= 1) {
			gridCount = 1;
		}

		gridCount = Math.round(gridCount);

		let initialMin: number = min;
		let initialMax: number = max;

		// in case min and max is the same, use max
		if (difference === 0) {
			difference = Math.abs(max);
		}

		// the number by which we need to raise 10 to get difference
		let exponent: number = Math.log(Math.abs(difference)) * Math.LOG10E;

		// here we find a number which is power of 10 and has the same count of numbers as difference has
		let power = Math.pow(10, Math.floor(exponent));

		// reduce this number by 10 times
		power = power / 10;

		let extra: number = power;
		if (strictMode) {
			extra = 0;
		}

		if (!this.logarithmic) {

			// round down min
			if (strictMode) {
				min = Math.floor(min / power) * power;
				// round up max
				max = Math.ceil(max / power) * power;
			}
			else {
				min = Math.ceil(min / power) * power - extra;
				// round up max
				max = Math.floor(max / power) * power + extra;
			}

			// don't let min go below 0 if real min is >= 0
			if (min < 0 && initialMin >= 0) {
				min = 0;
			}
			// don't let max go above 0 if real max is <= 0
			if (max > 0 && initialMax <= 0) {
				max = 0;
			}
		}
		else {
			if (min <= 0) {
				//throw Error("Logarithmic value axis can not have vales <= 0.");
				min = this.baseValue;
			}

			// @todo: think of a better way or to restrict zooming when no series are selected
			if (min == Infinity) {
				min = 1;
			}

			if (max == -Infinity) {
				max = 10;
			}

			min = Math.pow(10, Math.floor(Math.log(Math.abs(min)) * Math.LOG10E));
			max = Math.pow(10, Math.ceil(Math.log(Math.abs(max)) * Math.LOG10E));
		}
		// repeat diff, exponent and power again with rounded values
		//difference = this.adjustDifference(min, max);
		/*

				if(min > initialMin){
					min = initialMin;
				}

				if(max < initialMax){
					max = initialMax;
				}
		*/

		exponent = Math.log(Math.abs(difference)) * Math.LOG10E;
		power = Math.pow(10, Math.floor(exponent));
		power = power / 10;

		// approximate difference between two grid lines
		let step = Math.ceil((difference / gridCount) / power) * power;

		let stepPower = Math.pow(10, Math.floor(Math.log(Math.abs(step)) * Math.LOG10E));

		// TODO: in v3 I had fixStepE here, ommiting it for a while, need to think about other solution
		// the step should divide by  2, 5, and 10.
		let stepDivisor: number = Math.ceil(step / stepPower); // number 0 - 10

		if (stepDivisor > 5) {
			stepDivisor = 10;
		}
		else if (stepDivisor <= 5 && stepDivisor > 2) {
			stepDivisor = 5;
		}

		// now get real step
		step = Math.ceil(step / (stepPower * stepDivisor)) * stepPower * stepDivisor;

		if (this.maxPrecision < Number.MAX_VALUE && step != $math.ceil(step, this.maxPrecision)) {
			step = $math.ceil(step, this.maxPrecision);
		}

		let decCount: number = 0;
		// in case numbers are smaller than 1
		if (stepPower < 1) {
			// exponent is less then 1 too. Count decimals of exponent
			decCount = Math.round(Math.abs(Math.log(Math.abs(stepPower)) * Math.LOG10E)) + 1;
			// round step
			step = $math.round(step, decCount);
		}
		if (!this.logarithmic) {
			// final min and max
			let minCount = Math.floor(min / step);

			min = $math.round(step * minCount, decCount);

			let maxCount: number;

			if (!strictMode) {
				maxCount = Math.ceil(max / step);
			}
			else {
				maxCount = Math.floor(max / step);
			}

			if (maxCount == minCount) {
				maxCount++;
			}

			max = $math.round(step * maxCount, decCount);

			if (max < initialMax) {
				max = max + step;
			}


			if (min > initialMin) {
				min = min - step;
			}
		}

		return { min: min, max: max, step: step };
	}

	/**
	 * A minimum value for the axis scale.
	 *
	 * This value might be auto-adjusted by the Axis in order to accomodate the
	 * grid nicely, i.e. plot area is divided by grid in nice equal cells.
	 *
	 * The above might be overridden by `strictMinMax` which will force exact
	 * user-defined min and max values to be used for scale.
	 *
	 * @param value  Min value
	 */
	public set min(value: number) {
		if (this._minDefined != value) {
			this._minDefined = value;
			this.invalidate();
		}
	}

	/**
	 * @return Min value
	 */
	public get min(): number {
		let min = this._minAdjusted;
		if (!$type.isNumber(min)) {
			min = this._minDefined;
		}
		return min;
	}

	/**
	 * Min value as defined by user's code, not auto-calculated.
	 *
	 * @readonly
	 * @return Min value
	 */
	public get minDefined(): number {
		return this._minDefined;
	}

	/**
	 * Max value as defined by user's code, not auto-calculated.
	 *
	 * @readonly
	 * @return Man value
	 */
	public get maxDefined(): number {
		return this._maxDefined;
	}

	/**
	 * Allows relatively adjusting minimum value of the axis' scale.
	 *
	 * The value is relative to the actual range of values currently displayed
	 * on the axis.
	 *
	 * E.g.: 0.5 will mean half of the current range. If we have axis displaying
	 * from 100 to 200, we will now have axis displaying from 50 to 200 because
	 * we asked to expand minimum value by 50% (0.5).
	 *
	 * @param {number}
	 */
	public set extraMin(value: number) {
		if (this.setPropertyValue("extraMin", value)) {
			this.invalidateDataItems();
		}
	}

	/**
	 * @return {number}
	 */
	public get extraMin(): number {
		return this.getPropertyValue("extraMin");
	}

	/**
	 * Allows relatively adjusting maximum value of the axis' scale.
	 *
	 * The value is relative to the actual range of values currently displayed
	 * on the axis.
	 *
	 * E.g.: 0.5 will mean half of the current range. If we have axis displaying
	 * from 100 to 200, we will now have axis displaying from 100 to 250 because
	 * we asked to expand maximum value by 50% (0.5).
	 *
	 * @param {number}
	 */
	public set extraMax(value: number) {
		if (this.setPropertyValue("extraMax", value)) {
			this.invalidateDataItems();
		}
	}

	/**
	 * @return Min multiplier
	 */
	public get extraMax(): number {
		return this.getPropertyValue("extraMax");
	}


	/**
	 * Current calculated delta in values between two adjacent grid lines (step).
	 *
	 * This is a read-only value and cannot be used to set actual step.
	 *
	 * @readonly
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/#Setting_the_density_of_the_the_grid_labels} For more information about modifying density of labels
	 * @return [description]
	 */
	public get step(): number {
		return this._step;
	}

	/**
	 * A maximum value for the axis scale.
	 *
	 * This value might be auto-adjusted by the Axis in order to accomodate the
	 * grid nicely, i.e. plot area is divided by grid in nice equal cells.
	 *
	 * The above might be overridden by `strictMinMax` which will force exact
	 * user-defined min and max values to be used for scale.
	 *
	 * @param value  Max value
	 */
	public set max(value: number) {
		if (this._maxDefined != value) {
			this._maxDefined = value;
			this.invalidate();
		}
	}

	/**
	 * @return Max value
	 */
	public get max(): number {
		let max = this._maxAdjusted;
		if (!$type.isNumber(max)) {
			max = this._maxDefined;
		}
		return max;
	}

	/**
	 * Used for the Series to register itself as the user of this Axis.
	 *
	 * This will also decorate both the Series and Axis with event handlers, used
	 * to redraw on Axis position/zoom change.
	 *
	 * A disposer for those events is returned, so that they can be disposed
	 * together with Series.
	 *
	 * @ignore Exclude from docs
	 * @param series  Series
	 * @return Disposer for events
	 */
	public registerSeries(series: XYSeries): IDisposer {
		return new MultiDisposer([
			super.registerSeries(series),

			series.events.on("extremeschanged", this.handleExtremesChange, this, false),
			series.events.on("selectionextremeschanged", this.handleSelectionExtremesChange, this, false),
			this.events.on("extremeschanged", series.invalidate, series, false)
		]);
	}

	/**
	 * Perform tasks after Axis zoom.
	 */
	protected handleSelectionExtremesChange(): void {
		let selectionMin: number;
		let selectionMax: number;

		let allHidden: boolean = true;

		$iter.each(this.series.iterator(), (series) => {
			if (!series.ignoreMinMax && !series.isHidden) {

				if (series.visible && !series.isHiding) {
					allHidden = false;
				}

				let seriesSelectionMin: number = series.selectionMin(this);
				let seriesSelectionMax: number = series.selectionMax(this);

				if ($type.isNumber(seriesSelectionMin)) {
					if (!$type.isNumber(selectionMin) || (seriesSelectionMin < selectionMin)) {
						selectionMin = seriesSelectionMin;
					}
				}
				// check max
				if ($type.isNumber(seriesSelectionMax)) {
					if (!$type.isNumber(selectionMax) || (seriesSelectionMax > selectionMax)) {
						selectionMax = seriesSelectionMax;
					}
				}
			}
		});

		if (this.includeRangesInMinMax) {
			this.axisRanges.each((range) => {
				if (!range.ignoreMinMax) {
					let minValue = $math.min(range.value, range.endValue);
					let maxValue = $math.max(range.value, range.endValue);

					if (minValue < selectionMax) {
						selectionMax = minValue;
					}
					if (maxValue > selectionMax) {
						selectionMax = maxValue;
					}
				}
			})
		}

		// this is not good, as if date axis is initially zoomed, selection of y axis is reset to 0, 1 at the end of this method
		//$iter.each(this.series.iterator(), (series) => {
		//	if (!series.appeared) {
		//		allHidden = true;
		//	}
		//})

		if ($type.isNumber(this._minDefined)) {
			if (this.strictMinMax) {
				selectionMin = this._minDefined;
			}
			else {
				selectionMin = this.min;
			}
		}
		else if (this.strictMinMax) {
			selectionMin = this._minReal;
		}

		if ($type.isNumber(this._maxDefined)) {
			if (this.strictMinMax) {
				selectionMax = this._maxDefined;
			}
			else {
				selectionMax = this.max;
			}
		}
		else if (this.strictMinMax) {
			selectionMax = this._maxReal;
		}

		if (selectionMin == selectionMax) {

			selectionMin -= this._deltaMinMax;
			selectionMax += this._deltaMinMax;

			let minMaxStep2 = this.adjustMinMax(selectionMin, selectionMax, 0, this._gridCount, this.strictMinMax);
			selectionMin = minMaxStep2.min;
			selectionMax = minMaxStep2.max;
		}

		let dif: number = this.adjustDifference(selectionMin, selectionMax);
		let minMaxStep: IMinMaxStep = this.adjustMinMax(selectionMin, selectionMax, dif, this._gridCount);

		selectionMin = minMaxStep.min;
		selectionMax = minMaxStep.max;

		selectionMin -= (selectionMax - selectionMin) * this.extraMin;
		selectionMax += (selectionMax - selectionMin) * this.extraMax;

		selectionMin = $math.fitToRange(selectionMin, this.min, this.max);
		selectionMax = $math.fitToRange(selectionMax, this.min, this.max);

		// do it for the second time !important
		dif = this.adjustDifference(selectionMin, selectionMax);
		minMaxStep = this.adjustMinMax(selectionMin, selectionMax, dif, this._gridCount, true);
		selectionMin = minMaxStep.min;
		selectionMax = minMaxStep.max;

		if (this.strictMinMax) {
			selectionMin = $math.max(selectionMin, this._minDefined);
			selectionMax = $math.min(selectionMax, this._maxDefined);
		}

		this._minZoomed = selectionMin;
		this._maxZoomed = selectionMax;
		this._step = minMaxStep.step;

		// needed because of grouping
		this._difference = this.adjustDifference(this.min, this.max);

		let start: number = this.valueToPosition(selectionMin);
		let end: number = this.valueToPosition(selectionMax);

		// in case all series are hidden or hiding, full zoomout
		if (allHidden) {
			start = 0;
			end = 1;
		}

		if (!this.keepSelection) {
			this.zoom({ start: start, end: end }, false, false, 0);
		}
	}

	/**
	 * Indicates whether to blindly use exact `min` and `max` values set by user
	 * when generating Axis scale.
	 *
	 * If not set, the Axis might slightly adjust those values to accomodate a
	 * better looking grid.
	 *
	 * NOTE: if `min` and `max` are not set, setting `strictMinMax` to `true`
	 * will result in fixing the scale of the axis to actual lowest and highest
	 * values in the series within currently selected scope.
	 *
	 * @default false
	 * @param value Use exact values?
	 */
	public set strictMinMax(value: boolean) {
		if (this.setPropertyValue("strictMinMax", value)) {
			this.invalidate();
		}
	}

	/**
	 * @return Use exact values?
	 */
	public get strictMinMax(): boolean {
		return this.getPropertyValue("strictMinMax");
	}

	/**
	 * Indicates if this axis should use a logarithmic scale.
	 *
	 * Please note that logarithmic axis can **only** accommodate values bigger
	 * than zero.
	 *
	 * Having zero or negative values will result in error and failure of the
	 * whole chart.
	 *
	 * @param value Logarithmic scale?
	 */
	public set logarithmic(value: boolean) {
		if (this.setPropertyValue("logarithmic", value)) {
			this.invalidate();
		}
	}

	/**
	 * @return Logarithmic scale?
	 */
	public get logarithmic(): boolean {
		return this.getPropertyValue("logarithmic");
	}

	/**
	 * Indicates if a current selection (zoom) should be kept across data updates.
	 *
	 * If your axis is zoomed while chart's data is updated, the axis will try
	 * to retain the same start and end values.
	 *
	 * You can also use this to initially pre-zoom axis:
	 *
	 * ```TypeScript
	 * axis.keepSelection = true;
	 * axis.start = 0.5;
	 * axis.end = 0.7;
	 * ```
	 * ```JavaScript
	 * axis.keepSelection = true;
	 * axis.start = 0.5;
	 * axis.end = 0.7;
	 * ```
	 * ```JSON
	 * {
	 *   "xAxes": [{
	 *     // ...
	 *     "keepSelection": true,
	 *     "start": 0.5,
	 *     "end": 0.7
	 *   }]
	 * }
	 * ```
	 *
	 * The above will start the chart zoomed from the middle of the actual scope
	 * to 70%.
	 *
	 * @since 4.1.1
	 * @default flase
	 * @param  value  Preseve zoom after data update?
	 */
	public set keepSelection(value: boolean) {
		this.setPropertyValue("keepSelection", value);
	}

	/**
	 * @return Preseve zoom after data update?
	 */
	public get keepSelection(): boolean {
		return this.getPropertyValue("keepSelection");
	}

	/**
	 * If set to `true`, values of axis ranges will be included when calculating
	 * range of values / scale of the [[ValueAxis]].
	 *
	 * @default false
	 * @since 4.4.9
	 * @param  value  Include ranges?
	 */
	public set includeRangesInMinMax(value: boolean) {
		this.setPropertyValue("includeRangesInMinMax", value);
	}

	/**
	 * @return Include ranges?
	 */
	public get includeRangesInMinMax(): boolean {
		return this.getPropertyValue("includeRangesInMinMax");
	}

	/**
	 * Maximum number of decimals to allow when placing grid lines and labels
	 * on axis.
	 *
	 * Set it to `0` (zero) to force integer-only axis labels.
	 *
	 * @param {number}
	 */
	public set maxPrecision(value: number) {
		if (this.setPropertyValue("maxPrecision", value)) {
			this.invalidate();
		}
	}

	/**
	 * @return max precision
	 */
	public get maxPrecision(): number {
		return this.getPropertyValue("maxPrecision");
	}

	/**
	 * Invalidates axis data items when series extremes change
	 */
	protected handleExtremesChange() {
		this._extremesChanged = true;
		this.getMinMax();

		if (this.ghostLabel) {
			let mw = 0;

			this.dataItems.each((dataItem) => {
				if (dataItem.label && dataItem.label.pixelWidth > mw) {
					this.ghostLabel.text = dataItem.label.currentText;
				}
			})
		}
	}

	/**
	 * Returns relative position on axis for series' data item's value.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem  Data item
	 * @param key       Data field to get value from
	 * @param location  Location (0-1)
	 * @param stackKey  ?
	 * @return X coordinate (px)
	 */
	public getX(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		return this.renderer.positionToPoint(this.getPositionX(dataItem, key, location, stackKey, range)).x;
	}

	/**
	 * Returns the X coordinate for series' data item's value.
	 *
	 * @since 4.5.14
	 * @param  dataItem  Data item
	 * @param  key       Data field to get value from
	 * @param  location  Location (0-1)
	 * @param  stackKey  ?
	 * @return           Relative position
	 */
	public getPositionX(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		let value: number = dataItem.getWorkingValue(key);
		if (!$type.hasValue(stackKey)) {
			stackKey = "valueX";
		}
		let stack: number = dataItem.getValue(stackKey, "stack");

		if (!$type.isNumber(value)) {
			value = this.baseValue;

			if (this.logarithmic) {
				if (stack > 0) {
					value = 0;
				}
			}
		}

		let position = this.valueToPosition(value + stack);

		if (range) {
			position = $math.fitToRange(position, range.start, range.end);
		}

		return position;
	}

	/**
	 * Returns the Y coordinate for series' data item's value.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem  Data item
	 * @param key       Data field to get value from
	 * @param location  Location (0-1)
	 * @param stackKey  Stack ID
	 * @return Y coordinate (px)
	 */
	public getY(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		return this.renderer.positionToPoint(this.getPositionY(dataItem, key, location, stackKey, range)).y;
	}

	/**
	 * Returns relative position on axis for series' data item's value.
	 *
	 * @since 4.5.14
	 * @param  dataItem  Data item
	 * @param  key       Data field to get value from
	 * @param  location  Location (0-1)
	 * @param  stackKey  Stack ID
	 * @return           Relative position
	 */
	public getPositionY(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		let value: number = dataItem.getWorkingValue(key);

		if (!$type.hasValue(stackKey)) {
			stackKey = "valueY";
		}

		let stack: number = dataItem.getValue(stackKey, "stack");

		if (!$type.isNumber(value)) {
			value = this.baseValue;

			if (this.logarithmic) {
				if (stack > 0) {
					value = 0;
				}
			}
		}

		let position = this.valueToPosition(value + stack);
		if (range) {
			position = $math.fitToRange(position, range.start, range.end);
		}

		return position;
	}

	/**
	 * Returns an angle for series data item.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem  Data item
	 * @param key       Data field to get value from
	 * @param location  Location (0-1)
	 * @param stackKey  Stack ID
	 * @param range Range to fit in
	 * @return Angle
	 */
	public getAngle(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		let value: number = dataItem.getWorkingValue(key);
		let stack: number = dataItem.getValue(stackKey, "stack");

		if (!$type.isNumber(value)) {
			value = this.baseValue;
		}

		let position = this.valueToPosition(value + stack);
		if (range) {
			position = $math.fitToRange(position, range.start, range.end);
		}

		return this.positionToAngle(position);
	}

	/**
	 * [getAnyRangePath description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param start     [description]
	 * @param end       [description]
	 * @param location  [description]
	 * @return [description]
	 */
	public getAnyRangePath(start: number, end: number, location?: number): string {
		let startPosition: number = this.valueToPosition(start);
		let endPosition: number = this.valueToPosition(end);

		return this.getPositionRangePath(startPosition, endPosition); // Base class (Axis) gets range shape from AxisRenderer
	}

	/**
	 * Returns text to show in a axis tooltip, based on specific position within
	 * axis.
	 *
	 * The label will be formatted as per [[NumberFormatter]] set for the whole
	 * chart, or explicitly for this Axis.
	 *
	 * @ignore Exclude from docs
	 * @param position  Position (px)
	 * @return Label (numeric value)
	 */
	public getTooltipText(position: number): string {
		let value: number = $math.round(this.positionToValue(position), this._stepDecimalPlaces);
		let valueStr = this.tooltip.numberFormatter.format(value);
		if (!this._adapterO) {
			return valueStr;
		}
		else {
			return this._adapterO.apply("getTooltipText", valueStr);
		}
	}

	/**
	 * Zooms axis to specific values.
	 *
	 * @param startValue      Start value
	 * @param endValue        End value
	 * @param skipRangeEvent  Do not invoke events
	 * @param instantly       Do not play zoom animations
	 */
	public zoomToValues(startValue: number, endValue: number, skipRangeEvent?: boolean, instantly?: boolean): void {
		let start: number = (startValue - this.min) / (this.max - this.min);
		let end: number = (endValue - this.min) / (this.max - this.min);

		this.zoom({ start: start, end: end }, skipRangeEvent, instantly);
	}

	/**
	 * A smallest value in axis scale within current zoom.
	 *
	 * @return Min zoom value
	 */
	public get minZoomed(): number {
		return $math.max(this.min, this._minZoomed);
	}

	/**
	 * A biggest value in axis scale within current zoom.
	 * @return [description]
	 */
	public get maxZoomed(): number {
		return $math.min(this.max, this._maxZoomed);
	}

	/**
	 * Updates positioning of Axis breaks after something changes.
	 *
	 * @ignore Exclude from docs
	 */
	public fixAxisBreaks(): void {

		super.fixAxisBreaks();
		let axisBreaks = this._axisBreaks;
		if (axisBreaks && axisBreaks.length > 0) {
			// process breaks
			axisBreaks.each((axisBreak) => {
				let startValue: number = axisBreak.adjustedStartValue;
				let endValue: number = axisBreak.adjustedEndValue;

				// break difference
				let axisBreakDif: number = endValue - startValue;
				let axisBreakGridCount: number = Math.ceil(axisBreakDif * axisBreak.breakSize) * this._gridCount / (this.max - this.min);

				// calculate min, max and step for axis break
				let breakMinMaxStep = this.adjustMinMax(startValue, endValue, axisBreakDif, axisBreakGridCount, true);

				axisBreak.adjustedStep = breakMinMaxStep.step;
				axisBreak.adjustedMin = breakMinMaxStep.min;
				axisBreak.adjustedMax = breakMinMaxStep.max;
			});
		}

		this._difference = this.adjustDifference(this.min, this.max);
	}

	/**
	 * Returns value based on position.
	 *
	 * Please note that `position` represents position within axis which may be
	 * zoomed and not correspond to Cursor's `position`.
	 *
	 * To convert Cursor's `position` to Axis' `position` use `toAxisPosition()` method.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/tutorials/tracking-cursors-position-via-api/#Tracking_Cursor_s_position} For more information about cursor tracking.
	 * @param position  Relative position on axis (0-1)
	 * @return Position label
	 */
	public getPositionLabel(position: number): string {
		let value: number = this.positionToValue(position);
		return this.numberFormatter.format(value);
	}

	/**
	 * Shows Axis tooltip at specific value
	 *
	 * @param value Value
	 */
	public showTooltipAt(value: number) {
		this.showTooltipAtPosition(this.valueToPosition(value));
	}

	/**
	 * Copies all properties and related data from a different instance of Axis.
	 *
	 * @param source Source Axis
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.min = source.min;
		this.max = source.max;
		this.calculateTotals = source.calculateTotals;
		this._baseValue = source.baseValue;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ValueAxis"] = ValueAxis;
registry.registeredClasses["ValueAxisDataItem"] = ValueAxisDataItem;
