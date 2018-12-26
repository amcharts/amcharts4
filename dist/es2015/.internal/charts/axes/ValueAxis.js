/**
 * Value Axis module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Axis, AxisDataItem } from "./Axis";
import { AxisRendererY } from "./AxisRendererY";
import { MultiDisposer } from "../../core/utils/Disposer";
import { registry } from "../../core/Registry";
import { ValueAxisBreak } from "./ValueAxisBreak";
import * as $math from "../../core/utils/Math";
import * as $iter from "../../core/utils/Iterator";
import * as $object from "../../core/utils/Object";
import * as $type from "../../core/utils/Type";
import * as $utils from "../../core/utils/Utils";
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
var ValueAxisDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(ValueAxisDataItem, _super);
    /**
     * Constructor
     */
    function ValueAxisDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "ValueAxisDataItem";
        _this.values.value = {};
        _this.values.endValue = {};
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(ValueAxisDataItem.prototype, "value", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values["value"].value;
        },
        /**
         * A data point's numeric value.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("value", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueAxisDataItem.prototype, "endValue", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values["endValue"].value;
        },
        /**
         * Data point's numeric end value.
         *
         * @param {number}  value  End value
         */
        set: function (value) {
            this.setValue("endValue", value);
        },
        enumerable: true,
        configurable: true
    });
    return ValueAxisDataItem;
}(AxisDataItem));
export { ValueAxisDataItem };
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
var ValueAxis = /** @class */ (function (_super) {
    tslib_1.__extends(ValueAxis, _super);
    /**
     * Constructor
     */
    function ValueAxis() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * [_stepDecimalPlaces description]
         *
         * @todo Description
         * @type {number}
         */
        _this._stepDecimalPlaces = 0;
        /**
         * Base value for the axis.
         *
         * @type {number}
         */
        _this._baseValue = 0;
        /**
         * Adjusted start in case we have breaks.
         *
         * @todo Description
         * @type {number}
         */
        _this._adjustedStart = 0;
        /**
         * Adjusted end in case we have breaks.
         *
         * @todo Description
         * @type {number}
         */
        _this._adjustedEnd = 1;
        _this._extremesChanged = false;
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
         * @type {boolean}
         */
        _this.calculateTotals = false;
        _this.className = "ValueAxis";
        // Set field name
        _this.axisFieldName = "value";
        // Set defaults
        _this.setPropertyValue("maxZoomFactor", 1000);
        _this.setPropertyValue("extraMin", 0);
        _this.setPropertyValue("extraMax", 0);
        _this.setPropertyValue("strictMinMax", false);
        _this.setPropertyValue("maxPrecision", Number.MAX_VALUE);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Holds reference to a function that accepts a DataItem as parameter.
     *
     * It can either return a fill opacity for a fill, or manipulate data item
     * directly, to create various highlighting scenarios.
     *
     * @todo type
     */
    ValueAxis.prototype.fillRule = function (dataItem) {
        var value = dataItem.value;
        var axis = dataItem.component;
        if (!dataItem.axisFill.disabled) {
            // rounding in left to solve floating point number
            if ($math.round(value / axis.step / 2, 5) == Math.round(value / axis.step / 2)) {
                dataItem.axisFill.__disabled = true;
            }
            else {
                dataItem.axisFill.__disabled = false;
            }
        }
    };
    /**
     * Returns a new/empty [[DataItem]] of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {ValueAxisDataItem} Data Item
     */
    ValueAxis.prototype.createDataItem = function () {
        return new ValueAxisDataItem();
    };
    /**
     * Returns a new/empty [[AxisBreak]] of the appropriate type.
     *
     * @return {ValueAxisBreak} Axis break
     */
    ValueAxis.prototype.createAxisBreak = function () {
        return new ValueAxisBreak();
    };
    /**
     * [dataChangeUpdate description]
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    ValueAxis.prototype.dataChangeUpdate = function () {
        this._start = 0;
        this._end = 1;
        this._maxZoomed = this._maxDefined;
        this._minZoomed = this._minDefined;
        this._maxAdjusted = this._maxDefined;
        this._minAdjusted = this._minDefined;
    };
    /**
     * Processes data items of the related Series.
     *
     * @ignore Exclude from docs
     */
    ValueAxis.prototype.processSeriesDataItems = function () {
        // @todo: add some boolean (maybe autodedect) if we need these calculations or not. this place uses a lot of cpu
        if (this.calculateTotals) {
            var series = this.series.getIndex(0);
            var startIndex = series.startIndex;
            if (series.dataItems.length > 0) {
                if (startIndex > 0) {
                    startIndex--;
                }
                var endIndex = series.endIndex;
                if (endIndex < series.dataItems.length) {
                    endIndex++;
                }
                // This has to be `var` in order to avoid garbage collection
                for (var i = startIndex; i < endIndex; ++i) {
                    // This has to be `var` in order to avoid garbage collection
                    var total = {};
                    $iter.each(this.series.iterator(), function (series) {
                        var dataItem = series.dataItems.getIndex(i);
                        if (dataItem) {
                            $object.each(dataItem.values, function (key) {
                                var value = dataItem.values[key].workingValue; // can not use getWorkingValue here!
                                if ($type.isNumber(value)) {
                                    if (!$type.isNumber(total[key])) {
                                        total[key] = value;
                                    }
                                    else {
                                        total[key] += value;
                                    }
                                }
                            });
                        }
                    });
                    $iter.each(this.series.iterator(), function (series) {
                        var dataItem = series.dataItems.getIndex(i);
                        if (dataItem) {
                            $object.each(dataItem.values, function (key) {
                                var value = dataItem.values[key].workingValue; // can not use getWorkingValue here!
                                if ($type.isNumber(value)) {
                                    dataItem.setCalculatedValue(key, total[key], "total");
                                    dataItem.setCalculatedValue(key, 100 * value / total[key], "totalPercent");
                                }
                            });
                        }
                    });
                }
            }
        }
    };
    /**
     * Validates the whole axis. Causes it to redraw.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    ValueAxis.prototype.validate = function () {
        if (this.axisLength <= 0) {
            return;
        }
        _super.prototype.validate.call(this);
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
    };
    /**
     * Calculates all positions, related to axis as per current zoom.
     *
     * @ignore Exclude from docs
     */
    ValueAxis.prototype.calculateZoom = function () {
        if ($type.isNumber(this.min) && $type.isNumber(this.max)) {
            var min = this.positionToValue(this.start);
            var max = this.positionToValue(this.end);
            var differece = this.adjustDifference(min, max);
            var minMaxStep = this.adjustMinMax(min, max, differece, this._gridCount, true);
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
    };
    /**
     * Validates Axis elements.
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    ValueAxis.prototype.validateAxisElements = function () {
        var _this = this;
        if ($type.isNumber(this.max) && $type.isNumber(this.min)) {
            // first regular items
            var value_1 = this.minZoomed - this._step * 2;
            if (!this.logarithmic) {
                value_1 = Math.floor(value_1 / this._step) * this._step;
            }
            else {
                var differencePower = Math.log(this.max) * Math.LOG10E - Math.log(this.min) * Math.LOG10E;
                if (differencePower > 1) {
                    value_1 = Math.pow(10, Math.log(this.min) * Math.LOG10E);
                }
                else {
                    value_1 = Math.floor(this.minZoomed / this._step) * this._step;
                }
            }
            var maxZoomed = this._maxZoomed + this._step;
            this.resetIterators();
            var dataItemsIterator_1 = this._dataItemsIterator;
            var i = 0;
            while (value_1 <= maxZoomed) {
                var axisBreak = this.isInBreak(value_1);
                if (!axisBreak) {
                    var dataItem = dataItemsIterator_1.find(function (x) { return x.value === value_1; });
                    //this.processDataItem(dataItem);
                    this.appendDataItem(dataItem);
                    dataItem.axisBreak = undefined;
                    if (dataItem.value != value_1) {
                        dataItem.value = value_1;
                        dataItem.text = this.formatLabel(value_1);
                        if (dataItem.label && dataItem.label.invalid) {
                            dataItem.label.validate();
                        }
                        if (dataItem.value > this.min && dataItem.value < this.max) {
                            if (dataItem.label && (dataItem.label.measuredWidth > this.ghostLabel.measuredWidth || dataItem.label.measuredHeight > this.ghostLabel.measuredHeight)) {
                                this.ghostLabel.text = dataItem.label.text;
                            }
                        }
                    }
                    this.validateDataElement(dataItem);
                }
                i++;
                if (!this.logarithmic) {
                    value_1 += this._step;
                }
                else {
                    var differencePower = Math.log(this.max) * Math.LOG10E - Math.log(this.min) * Math.LOG10E;
                    if (differencePower > 1) {
                        value_1 = Math.pow(10, Math.log(this.min) * Math.LOG10E + i);
                    }
                    else {
                        value_1 += this._step;
                    }
                }
            }
            var axisBreaks = this.axisBreaks;
            // breaks later
            var renderer_1 = this.renderer;
            $iter.each(axisBreaks.iterator(), function (axisBreak) {
                if (axisBreak.breakSize > 0) {
                    // only add grid if gap is bigger then minGridDistance
                    if ($math.getDistance(axisBreak.startPoint, axisBreak.endPoint) > renderer_1.minGridDistance) {
                        var breakValue_1 = axisBreak.adjustedMin;
                        while (breakValue_1 <= axisBreak.adjustedMax) {
                            if (breakValue_1 >= axisBreak.adjustedStartValue && breakValue_1 <= axisBreak.adjustedEndValue) {
                                var dataItem = dataItemsIterator_1.find(function (x) { return x.value === breakValue_1; });
                                //this.processDataItem(dataItem);
                                _this.appendDataItem(dataItem);
                                dataItem.axisBreak = axisBreak;
                                if (dataItem.value != breakValue_1) {
                                    dataItem.value = breakValue_1;
                                    dataItem.text = _this.formatLabel(breakValue_1);
                                    if (dataItem.label && dataItem.label.invalid) {
                                        dataItem.label.validate();
                                    }
                                }
                                _this.validateDataElement(dataItem);
                            }
                            breakValue_1 += axisBreak.adjustedStep;
                        }
                    }
                }
            });
        }
    };
    /**
     * Validates axis data item.
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {ValueAxisDataItem}  dataItem  Data item
     */
    ValueAxis.prototype.validateDataElement = function (dataItem) {
        _super.prototype.validateDataElement.call(this, dataItem);
        //dataItem.__disabled = false;
        var renderer = this.renderer;
        var value = dataItem.value;
        var endValue = dataItem.endValue;
        var position = this.valueToPosition(value);
        dataItem.position = position;
        var endPosition = position;
        var fillEndPosition = this.valueToPosition(value + this._step);
        if ($type.isNumber(endValue)) {
            endPosition = this.valueToPosition(endValue);
            fillEndPosition = endPosition;
        }
        // this point is needed to calculate distance to satisfy minGridDistance
        dataItem.point = renderer.positionToPoint(position);
        var tick = dataItem.tick;
        if (tick && !tick.disabled) {
            renderer.updateTickElement(tick, position, endPosition);
        }
        var grid = dataItem.grid;
        if (grid && !grid.disabled) {
            renderer.updateGridElement(grid, position, endPosition);
        }
        var label = dataItem.label;
        if (label && !label.disabled) {
            renderer.updateLabelElement(label, position, endPosition);
        }
        var fill = dataItem.axisFill;
        if (fill && !fill.disabled) {
            renderer.updateFillElement(fill, position, fillEndPosition);
            if (!dataItem.isRange) {
                this.fillRule(dataItem);
            }
        }
        var mask = dataItem.mask;
        if (mask) {
            renderer.updateFillElement(mask, position, fillEndPosition);
        }
    };
    /**
     * Formats the value according to axis' own [[NumberFormatter]].
     *
     * @param  {number}  value  Source value
     * @return {string}         Formatted value
     */
    ValueAxis.prototype.formatLabel = function (value) {
        return this.numberFormatter.format(value);
    };
    Object.defineProperty(ValueAxis.prototype, "basePoint", {
        /**
         * Coordinates of the actual axis start.
         *
         * @ignore Exclude from docs
         * @return {IPoint} Base point
         */
        get: function () {
            var baseValue = this._baseValue;
            var position = this.valueToPosition(baseValue);
            var basePoint = this.renderer.positionToPoint(position);
            return basePoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueAxis.prototype, "baseValue", {
        /**
         * @return {number} base value
         */
        get: function () {
            if (this.logarithmic) {
                return this.min;
            }
            else {
                return this._baseValue;
            }
        },
        /**
         * A base value.
         *
         * This is a threshold value that will divide "positive" and "negative"
         * value ranges.
         *
         * Other scale-related functionality also depend on base value. E.g. stacks,
         * value-dependent coloring, etc.
         *
         * @param {number} value Base value
         */
        set: function (value) {
            this._baseValue = value;
            this.invalidateLayout();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts a numeric value to relative position on axis
     *
     * An alias to `valueToPosition()`.
     *
     * @param  {number}  value  Value
     * @return {number}         Position
     */
    ValueAxis.prototype.anyToPosition = function (value) {
        return this.valueToPosition(value);
    };
    /**
     * Converts a numeric value to orientation point (x, y, angle) on axis
     *
     * @param  {number}  value  Value
     * @return {IOrientationPoint}  Orientation point
     */
    ValueAxis.prototype.valueToPoint = function (value) {
        var position = this.valueToPosition(value);
        var point = this.renderer.positionToPoint(position);
        var angle = this.renderer.positionToAngle(position);
        return { x: point.x, y: point.y, angle: angle };
    };
    /**
     * Converts a numeric value to orientation (x, y, angle) point on axis
     *
     * @param  {number}  value  Value
     * @return {IOrientationPoint}  Orientation point
     */
    ValueAxis.prototype.anyToPoint = function (value) {
        return this.valueToPoint(value);
    };
    /**
     * Converts a numeric value to relative position on axis.
     *
     * @param  {number}  value  Value
     * @return {number}  relative position
     */
    ValueAxis.prototype.valueToPosition = function (value) {
        if ($type.isNumber(value)) {
            // todo: think if possible to take previous value and do not go through all previous breaks
            var min_1 = this.min;
            var max_1 = this.max;
            if ($type.isNumber(min_1) && $type.isNumber(max_1)) {
                var difference = this._difference;
                var axisBreaks = this.axisBreaks;
                if (axisBreaks.length > 0) {
                    $iter.eachContinue(axisBreaks.iterator(), function (axisBreak) {
                        var startValue = axisBreak.adjustedStartValue;
                        var endValue = axisBreak.adjustedEndValue;
                        if ($type.isNumber(startValue) && $type.isNumber(endValue)) {
                            if (value < startValue) {
                                return false;
                            }
                            if ($math.intersect({ start: startValue, end: endValue }, { start: min_1, end: max_1 })) { // todo: check this once and set some flag in axisBreak
                                startValue = Math.max(startValue, min_1);
                                endValue = Math.min(endValue, max_1);
                                var breakSize = axisBreak.breakSize;
                                // value to the right of break end
                                if (value > endValue) {
                                    min_1 += (endValue - startValue) * (1 - breakSize); // todo: maybe this can be done differently?
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
                var position = void 0;
                if (!this.logarithmic) {
                    position = (value - min_1) / difference;
                }
                else {
                    position = (Math.log(value) * Math.LOG10E - Math.log(this.min) * Math.LOG10E) / ((Math.log(this.max) * Math.LOG10E - Math.log(this.min) * Math.LOG10E));
                }
                //position = $math.round(position, 10);
                return position;
            }
        }
        return 0;
    };
    /**
     * Converts an relative position to a corresponding value within
     * axis' scale.
     *
     * @param  {number}  position  Position (px)
     * @return {number}            Value
     */
    ValueAxis.prototype.positionToValue = function (position) {
        position = $math.round(position, 10);
        var strPosition = position.toString();
        var min = this.min;
        var max = this.max;
        if ($type.isNumber(min) && $type.isNumber(max)) {
            var difference_1 = max - min; //no need to adjust!
            var axisBreaks = this.axisBreaks;
            var value_2 = null;
            // in case we have some axis breaks
            if (axisBreaks.length > 0) {
                $iter.eachContinue(axisBreaks.iterator(), function (axisBreak) {
                    var breakStartPosition = axisBreak.startPosition;
                    var breakEndPosition = axisBreak.endPosition;
                    var breakStartValue = axisBreak.adjustedStartValue;
                    var breakEndValue = axisBreak.adjustedEndValue;
                    if ($type.isNumber(breakStartValue) && $type.isNumber(breakEndValue)) {
                        if (breakStartValue > max) {
                            return false;
                        }
                        if ($math.intersect({ start: breakStartValue, end: breakEndValue }, { start: min, end: max })) {
                            breakStartValue = $math.max(breakStartValue, min);
                            breakEndValue = $math.min(breakEndValue, max);
                            var breakSize = axisBreak.breakSize;
                            difference_1 -= (breakEndValue - breakStartValue) * (1 - breakSize);
                            // position to the right of break end
                            if (position > breakEndPosition) {
                                min += (breakEndValue - breakStartValue) * (1 - breakSize);
                            }
                            // position to the left of break start
                            else if (position < breakStartPosition) {
                            }
                            // value within break
                            else {
                                var breakPosition = (position - breakStartPosition) / (breakEndPosition - breakStartPosition);
                                value_2 = breakStartValue + breakPosition * (breakEndValue - breakStartValue);
                                return false;
                            }
                        }
                        return true;
                    }
                });
            }
            if (!$type.isNumber(value_2)) {
                value_2 = position * difference_1 + min;
            }
            return value_2;
        }
        //}
    };
    /**
     * Converts an X coordinate to a relative value in axis' scale.
     *
     * @param  {number}  x  X (px)
     * @return {number}     Value
     */
    ValueAxis.prototype.xToValue = function (x) {
        return this.positionToValue(this.pointToPosition({ x: x, y: 0 }));
    };
    /**
     * Converts an Y coordinate to a relative value in axis' scale.
     *
     * @param  {number}  y  Y (px)
     * @return {number}     Value
     */
    ValueAxis.prototype.yToValue = function (y) {
        return this.positionToValue(this.pointToPosition({ x: 0, y: y }));
    };
    /**
     * Converts pixel coordinates to a relative position. (0-1)
     *
     * @param {IPoint}   point  Coorinates (px)
     * @return {number}         Position (0-1)
     */
    ValueAxis.prototype.pointToPosition = function (point) {
        if (this.renderer instanceof AxisRendererY) {
            return 1 - this.renderer.pointToPosition(point);
        }
        else {
            return this.renderer.pointToPosition(point);
        }
    };
    /**
     * Calculates smallest and biggest value for the axis scale.
     *
     * @todo Description (review)
     */
    ValueAxis.prototype.getMinMax = function () {
        var _this = this;
        this.updateGridCount();
        var min = Number.POSITIVE_INFINITY;
        var max = Number.NEGATIVE_INFINITY;
        // only if min and max are not set from outside, we go through min and max influencers
        if (!$type.isNumber(this._minDefined) || !$type.isNumber(this._maxDefined)) {
            $iter.each(this.series.iterator(), function (series) {
                if (!series.ignoreMinMax) {
                    // check min
                    var seriesMin = series.min(_this);
                    if ($type.isNumber(seriesMin) && (seriesMin < min)) {
                        min = seriesMin;
                    }
                    // check max
                    var seriesMax = series.max(_this);
                    if ($type.isNumber(seriesMax) && (seriesMax > max)) {
                        max = seriesMax;
                    }
                }
            });
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
        var dif = this.adjustDifference(min, max); // previously it was max-min, but not worked well
        min = this.fixMin(min);
        max = this.fixMax(max);
        // this happens if starLocation and endLocation are 0.5 and DateAxis has only one date
        if (min == max) {
            min -= 1;
            max += 1;
        }
        min -= (max - min) * this.extraMin;
        max += (max - min) * this.extraMax;
        var minMaxStep = this.adjustMinMax(min, max, dif, this._gridCount, this.strictMinMax);
        min = minMaxStep.min;
        max = minMaxStep.max;
        dif = max - min; //new
        // do it for the second time (importat!)
        minMaxStep = this.adjustMinMax(min, max, max - min, this._gridCount, true);
        min = minMaxStep.min;
        max = minMaxStep.max;
        // return min max if strict
        if (this.strictMinMax) {
            if ($type.isNumber(this._minDefined)) {
                min = this._minDefined;
            }
            if ($type.isNumber(this._maxDefined)) {
                max = this._maxDefined;
            }
        }
        // checking isNumber is good when all series are hidden
        if ((this._minAdjusted != min || this._maxAdjusted != max) && $type.isNumber(min) && $type.isNumber(max)) {
            var animation = this._minMaxAnimation;
            if (this._extremesChanged && $type.isNumber(this._minAdjusted) && $type.isNumber(this._maxAdjusted) && this.inited) {
                if ((animation && !animation.isFinished()) && this._finalMax == max && this._finalMin == min) {
                    return;
                }
                else {
                    this._finalMin = min;
                    this._finalMax = max;
                    animation = this.animate([{ property: "_minAdjusted", from: this._minAdjusted, to: min }, { property: "_maxAdjusted", from: this._maxAdjusted, to: max }], this.rangeChangeDuration);
                    animation.events.on("animationprogress", this.validateDataItems, this);
                    animation.events.on("animationended", function () {
                        _this.validateDataItems();
                        _this.handleSelectionExtremesChange();
                    });
                    this._minMaxAnimation = animation;
                    this.validateDataItems();
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
    };
    /**
     * Adjusts the minimum value.
     *
     * This is a placeholder method for extending classes to override.
     *
     * For numeric values this does nothing, however for more complex types, like
     * dates, it may be necessary to adjust.
     *
     * @param  {number}  value  Value
     * @return {number}         Adjusted value
     */
    ValueAxis.prototype.fixMin = function (value) {
        return value;
    };
    /**
     * Adjusts the maximum value.
     *
     * This is a placeholder method for extending classes to override.
     *
     * For numeric values this does nothing, however for more complex types, like
     * dates, it may be necessary to adjust.
     *
     * @param  {number}  value  Value
     * @return {number}         Adjusted value
     */
    ValueAxis.prototype.fixMax = function (value) {
        return value;
    };
    /**
     * Adjusts actual min and max scale values so that the axis starts and ends
     * at "nice" values, unless `strictMinMax` is set.
     *
     * The `difference` can be something else than `max - min`, because of the
     * axis breaks.
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}      min        [description]
     * @param  {number}      max        [description]
     * @param  {number}      difference [description]
     * @param  {number}      gridCount  [description]
     * @param  {boolean}     strictMode [description]
     * @return {IMinMaxStep}            [description]
     */
    ValueAxis.prototype.adjustMinMax = function (min, max, difference, gridCount, strictMode) {
        // will fail if 0
        if (gridCount <= 1) {
            gridCount = 1;
        }
        gridCount = Math.round(gridCount);
        var initialMin = min;
        var initialMax = max;
        // in case min and max is the same, use max
        if (difference === 0) {
            difference = Math.abs(max);
        }
        // the number by which we need to raise 10 to get difference
        var exponent = Math.log(Math.abs(difference)) * Math.LOG10E;
        // here we find a number which is power of 10 and has the same count of numbers as difference has
        var power = Math.pow(10, Math.floor(exponent));
        // reduce this number by 10 times
        power = power / 10;
        var extra = power;
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
        var step = Math.ceil((difference / gridCount) / power) * power;
        var stepPower = Math.pow(10, Math.floor(Math.log(Math.abs(step)) * Math.LOG10E));
        // TODO: in v3 I had fixStepE here, ommiting it for a while, need to think about other solution
        // the step should divide by  2, 5, and 10.
        var stepDivisor = Math.ceil(step / stepPower); // number 0 - 10
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
        var decCount = 0;
        // in case numbers are smaller than 1
        if (stepPower < 1) {
            // exponent is less then 1 too. Count decimals of exponent
            decCount = Math.round(Math.abs(Math.log(Math.abs(stepPower)) * Math.LOG10E)) + 1;
            // round step
            step = $math.round(step, decCount);
        }
        if (!this.logarithmic) {
            // final min and max
            var minCount = Math.floor(min / step);
            min = $math.round(step * minCount, decCount);
            var maxCount = void 0;
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
    };
    Object.defineProperty(ValueAxis.prototype, "min", {
        /**
         * @return {number} Min value
         */
        get: function () {
            var min = this._minAdjusted;
            if (!$type.isNumber(min)) {
                min = this._minDefined;
            }
            return min;
        },
        /**
         * A minimum value for the axis scale.
         *
         * This value might be auto-adjusted by the Axis in order to accomodate the
         * grid nicely, i.e. plot area is divided by grid in nice equal cells.
         *
         * The above might be overridden by `strictMinMax` which will force exact
         * user-defined min and max values to be used for scale.
         *
         * @param {number}  value  Min value
         */
        set: function (value) {
            if (this._minDefined != value) {
                this._minDefined = value;
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueAxis.prototype, "extraMin", {
        /**
         * @return {number}
         */
        get: function () {
            return this.getPropertyValue("extraMin");
        },
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
        set: function (value) {
            if (this.setPropertyValue("extraMin", value)) {
                this.invalidateDataItems();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueAxis.prototype, "extraMax", {
        /**
         * @return {number} Min multiplier
         */
        get: function () {
            return this.getPropertyValue("extraMax");
        },
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
        set: function (value) {
            if (this.setPropertyValue("extraMax", value)) {
                this.invalidateDataItems();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueAxis.prototype, "step", {
        /**
         * Current calculated delta in values between two adjacent grid lines (step).
         *
         * This is a read-only value and cannot be used to set actual step.
         *
         * @readonly
         * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/#Setting_the_density_of_the_the_grid_labels} For more information about modifying density of labels
         * @return {number} [description]
         */
        get: function () {
            return this._step;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueAxis.prototype, "max", {
        /**
         * @return {number} Max value
         */
        get: function () {
            var max = this._maxAdjusted;
            if (!$type.isNumber(max)) {
                max = this._maxDefined;
            }
            return max;
        },
        /**
         * A maximum value for the axis scale.
         *
         * This value might be auto-adjusted by the Axis in order to accomodate the
         * grid nicely, i.e. plot area is divided by grid in nice equal cells.
         *
         * The above might be overridden by `strictMinMax` which will force exact
         * user-defined min and max values to be used for scale.
         *
         * @param {number}  value  Max value
         */
        set: function (value) {
            if (this._maxDefined != value) {
                this._maxDefined = value;
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
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
     * @param  {XYSeries}   series  Series
     * @return {IDisposer}          Disposer for events
     */
    ValueAxis.prototype.registerSeries = function (series) {
        return new MultiDisposer([
            _super.prototype.registerSeries.call(this, series),
            series.events.on("extremeschanged", this.handleExtremesChange, this, false),
            series.events.on("selectionextremeschanged", this.handleSelectionExtremesChange, this, false),
            this.events.on("extremeschanged", series.invalidate, series, false)
        ]);
    };
    /**
     * Perform tasks after Axis zoom.
     */
    ValueAxis.prototype.handleSelectionExtremesChange = function () {
        var _this = this;
        var selectionMin;
        var selectionMax;
        var allHidden = true;
        $iter.each(this.series.iterator(), function (series) {
            if (!series.ignoreMinMax) {
                if (series.visible && !series.isHiding) {
                    allHidden = false;
                }
                var seriesSelectionMin = series.selectionMin(_this);
                var seriesSelectionMax = series.selectionMax(_this);
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
        $iter.each(this.series.iterator(), function (series) {
            if (!series.appeared) {
                allHidden = true;
            }
        });
        if ($type.isNumber(this._minDefined)) {
            if (this.strictMinMax) {
                selectionMin = this._minDefined;
            }
            else {
                selectionMin = this.min;
            }
        }
        if ($type.isNumber(this._maxDefined)) {
            if (this.strictMinMax) {
                selectionMax = this._maxDefined;
            }
            else {
                selectionMax = this.max;
            }
        }
        if (selectionMin == selectionMax) {
            selectionMin -= 1;
            selectionMax += 1;
        }
        var dif = this.adjustDifference(selectionMin, selectionMax);
        var minMaxStep = this.adjustMinMax(selectionMin, selectionMax, dif, this._gridCount);
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
        var start = this.valueToPosition(selectionMin);
        var end = this.valueToPosition(selectionMax);
        // in case all series are hidden or hiding, full zoomout
        if (allHidden) {
            start = 0;
            end = 1;
        }
        this.zoom({ start: start, end: end }, false, false, 0);
    };
    Object.defineProperty(ValueAxis.prototype, "strictMinMax", {
        /**
         * @return {boolean} Use exact values?
         */
        get: function () {
            return this.getPropertyValue("strictMinMax");
        },
        /**
         * Indicates whether to blindly use exact `min` and `max` values set by user
         * when generating Axis scale.
         *
         * If not set, the Axis might slightly adjust those values to accomodate a
         * better looking grid.
         *
         * @default false
         * @param {boolean} value Use exact values?
         */
        set: function (value) {
            if (this.setPropertyValue("strictMinMax", value)) {
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueAxis.prototype, "logarithmic", {
        /**
         * @return {boolean} Logarithmic scale?
         */
        get: function () {
            return this.getPropertyValue("logarithmic");
        },
        /**
         * Indicates if this axis should use a logarithmic scale.
         *
         * Please note that logarithmic axis can **only** accommodate values bigger
         * than zero.
         *
         * Having zero or negative values will result in error and failure of the
         * whole chart.
         *
         * @param {boolean} value Logarithmic scale?
         */
        set: function (value) {
            if (this.setPropertyValue("logarithmic", value)) {
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueAxis.prototype, "maxPrecision", {
        /**
         * @return {boolean} max precision
         */
        get: function () {
            return this.getPropertyValue("maxPrecision");
        },
        /**
         * Maximum number of decimals to allow when placing grid lines and labels
         * on axis.
         *
         * Set it to `0` (zero) to force integer-only axis labels.
         *
         * @param {number}
         */
        set: function (value) {
            if (this.setPropertyValue("maxPrecision", value)) {
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Invalidates axis data items when series extremes change
     */
    ValueAxis.prototype.handleExtremesChange = function () {
        this._extremesChanged = true;
        this.getMinMax();
        if (this.ghostLabel) {
            var min = this.min;
            var max = this.max;
            var text = 0;
            if ($type.isNumber(min) && $type.isNumber(max) && min.toString().length > max.toString().length) {
                text = min;
            }
            else {
                text = max;
            }
            this.ghostLabel.text = this.formatLabel(text);
        }
    };
    /**
     * Returns the X coordinate for series' data item's value.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}            key       Data field to get value from
     * @param  {number}            location  Location (0-1)
     * @param  {string}            stackKey  ?
     * @return {number}                      X coordinate (px)
     */
    ValueAxis.prototype.getX = function (dataItem, key, location, stackKey) {
        var value = dataItem.getWorkingValue(key);
        if (!$type.hasValue(stackKey)) {
            stackKey = "valueX";
        }
        var stack = dataItem.getValue(stackKey, "stack");
        if (!$type.isNumber(value)) {
            value = this.baseValue;
            if (this.logarithmic) {
                if (stack > 0) {
                    value = 0;
                }
            }
        }
        return this.renderer.positionToPoint(this.valueToPosition(value + stack)).x;
    };
    /**
     * Returns the Y coordinate for series' data item's value.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}            key       Data field to get value from
     * @param  {number}            location  Location (0-1)
     * @param  {string}            stackKey  Stack ID
     * @return {number}                      Y coordinate (px)
     */
    ValueAxis.prototype.getY = function (dataItem, key, location, stackKey) {
        var value = dataItem.getWorkingValue(key);
        if (!$type.hasValue(stackKey)) {
            stackKey = "valueY";
        }
        var stack = dataItem.getValue(stackKey, "stack");
        if (!$type.isNumber(value)) {
            value = this.baseValue;
            if (this.logarithmic) {
                if (stack > 0) {
                    value = 0;
                }
            }
        }
        return this.renderer.positionToPoint(this.valueToPosition(value + stack)).y;
    };
    /**
     * Returns an angle for series data item.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}            key       Data field to get value from
     * @param  {number}            location  Location (0-1)
     * @param  {string}            stackKey  Stack ID
     * @return {number}                      Angle
     */
    ValueAxis.prototype.getAngle = function (dataItem, key, location, stackKey) {
        var value = dataItem.getWorkingValue(key);
        var stack = dataItem.getValue(stackKey, "stack");
        if (!$type.isNumber(value)) {
            value = this.baseValue;
        }
        return this.positionToAngle(this.valueToPosition(value + stack));
    };
    /**
     * [getAnyRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}  start     [description]
     * @param  {number}  end       [description]
     * @param  {number}  location  [description]
     * @return {string}            [description]
     */
    ValueAxis.prototype.getAnyRangePath = function (start, end, location) {
        var startPosition = this.valueToPosition(start);
        var endPosition = this.valueToPosition(end);
        return this.getPositionRangePath(startPosition, endPosition); // Base class (Axis) gets range shape from AxisRenderer
    };
    /**
     * Returns text to show in a axis tooltip, based on specific position within
     * axis.
     *
     * The label will be formatted as per [[NumberFormatter]] set for the whole
     * chart, or explicitly for this Axis.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position (px)
     * @return {string}            Label (numeric value)
     */
    ValueAxis.prototype.getTooltipText = function (position) {
        var value = $math.round(this.positionToValue(position), this._stepDecimalPlaces);
        return this.adapter.apply("getTooltipText", this.tooltip.numberFormatter.format(value));
    };
    /**
     * Zooms axis to specific values.
     *
     * @param {number}   startValue      Start value
     * @param {number}   endValue        End value
     * @param {boolean}  skipRangeEvent  Do not invoke events
     * @param {boolean}  instantly       Do not play zoom animations
     */
    ValueAxis.prototype.zoomToValues = function (startValue, endValue, skipRangeEvent, instantly) {
        var start = (startValue - this.min) / (this.max - this.min);
        var end = (endValue - this.min) / (this.max - this.min);
        this.zoom({ start: start, end: end }, skipRangeEvent, instantly);
    };
    Object.defineProperty(ValueAxis.prototype, "minZoomed", {
        /**
         * A smallest value in axis scale within current zoom.
         *
         * @return {number} Min zoom value
         */
        get: function () {
            return $math.max(this.min, this._minZoomed);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueAxis.prototype, "maxZoomed", {
        /**
         * A biggest value in axis scale within current zoom.
         * @return {number} [description]
         */
        get: function () {
            return $math.min(this.max, this._maxZoomed);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates positioning of Axis breaks after something changes.
     *
     * @ignore Exclude from docs
     */
    ValueAxis.prototype.fixAxisBreaks = function () {
        var _this = this;
        _super.prototype.fixAxisBreaks.call(this);
        // process breaks
        $iter.each(this.axisBreaks.iterator(), function (axisBreak) {
            var startValue = axisBreak.adjustedStartValue;
            var endValue = axisBreak.adjustedEndValue;
            // break difference
            var axisBreakDif = endValue - startValue;
            var axisBreakGridCount = Math.ceil(axisBreakDif * axisBreak.breakSize) * _this._gridCount / (_this.max - _this.min);
            // calculate min, max and step for axis break
            var breakMinMaxStep = _this.adjustMinMax(startValue, endValue, axisBreakDif, axisBreakGridCount, true);
            axisBreak.adjustedStep = breakMinMaxStep.step;
            axisBreak.adjustedMin = breakMinMaxStep.min;
            axisBreak.adjustedMax = breakMinMaxStep.max;
        });
        this._difference = this.adjustDifference(this.min, this.max);
    };
    /**
     * Returns value based on position.
     *
     * Please note that `position` represents position within axis which may be
     * zoomed and not correspond to Cursor's `position`.
     *
     * To convert Cursor's `position` to Axis' `position` use `toAxisPosition()` method.
     *
     * @see {@link https://www.amcharts.com/docs/v4/tutorials/tracking-cursors-position-via-api/#Tracking_Cursor_s_position} For more information about cursor tracking.
     * @param  {number}  position  Relative position on axis (0-1)
     * @return {string}            Position label
     */
    ValueAxis.prototype.getPositionLabel = function (position) {
        var value = this.positionToValue(position);
        return this.numberFormatter.format(value);
    };
    /**
     * Shows Axis tooltip at specific value
     *
     * @param {number} value Value
     */
    ValueAxis.prototype.showTooltipAt = function (value) {
        this.showTooltipAtPosition(this.valueToPosition(value));
    };
    /**
     * Copies all properties and related data from a different instance of Axis.
     *
     * @param {this} source Source Axis
     */
    ValueAxis.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.min = source.min;
        this.max = source.max;
        this.calculateTotals = source.calculateTotals;
        this._baseValue = source.baseValue;
    };
    return ValueAxis;
}(Axis));
export { ValueAxis };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ValueAxis"] = ValueAxis;
registry.registeredClasses["ValueAxisDataItem"] = ValueAxisDataItem;
//# sourceMappingURL=ValueAxis.js.map