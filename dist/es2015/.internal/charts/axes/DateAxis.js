/**
 * DateAxis module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ValueAxis, ValueAxisDataItem } from "./ValueAxis";
import { List } from "../../core/utils/List";
import { Dictionary } from "../../core/utils/Dictionary";
import { DateAxisBreak } from "./DateAxisBreak";
import { registry } from "../../core/Registry";
import * as $time from "../../core/utils/Time";
import * as $type from "../../core/utils/Type";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $object from "../../core/utils/Object";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines data item for [[DateAxis]].
 *
 * @see {@link DataItem}
 */
var DateAxisDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(DateAxisDataItem, _super);
    /**
     * Constructor
     */
    function DateAxisDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "DateAxisDataItem";
        _this.applyTheme();
        _this.values.date = {};
        _this.values.endDate = {};
        return _this;
    }
    Object.defineProperty(DateAxisDataItem.prototype, "date", {
        /**
         * @return Date
         */
        get: function () {
            return this.dates["date"];
        },
        /**
         * Date position of the data item.
         *
         * @param date  Date
         */
        set: function (date) {
            this.setDate("date", date);
            this.value = date.getTime();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateAxisDataItem.prototype, "endDate", {
        /**
         * @return End date
         */
        get: function () {
            return this.dates["endDate"];
        },
        /**
         * End date for data item.
         *
         * @param date End date
         */
        set: function (date) {
            this.setDate("endDate", date);
            this.endValue = date.getTime();
        },
        enumerable: true,
        configurable: true
    });
    return DateAxisDataItem;
}(ValueAxisDataItem));
export { DateAxisDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to create a date/time-based axis for the chart.
 *
 * ```TypeScript
 * // Create the axis
 * let xAxis = chart.xAxes.push(new am4charts.DateAxis());
 *
 * // Set settings
 * xAxis.title.text = "Time";
 * ```
 * ```JavaScript
 * // Create the axis
 * var valueAxis = chart.xAxes.push(new am4charts.DateAxis());
 *
 * // Set settings
 * valueAxis.title.text = "Time";
 * ```
 * ```JSON
 * "xAxes": [{
 *   "type": "DateAxis",
 *   "title": {
 *     "text": "Time"
 *   }
 * }]
 * ```
 *
 * @see {@link IDateAxisEvents} for a list of available Events
 * @see {@link IDateAxisAdapters} for a list of available Adapters
 * @important
 */
var DateAxis = /** @class */ (function (_super) {
    tslib_1.__extends(DateAxis, _super);
    /**
     * Constructor
     */
    function DateAxis() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * A list of date/time intervals for Date axis.
         *
         * This define various granularities available for the axis. For example
         * if you have an axis spanning an hour, and space for 6 grid lines / labels
         * the axis will choose the granularity of 10 minutes, displaying a label
         * every 10 minutes.
         *
         * Default intervals:
         *
         * ```JSON
         * [
         *  { timeUnit: "millisecond", count: 1 },
         *  { timeUnit: "millisecond", count: 5 },
         *  { timeUnit: "millisecond", count: 10 },
         *  { timeUnit: "millisecond", count: 50 },
         *  { timeUnit: "millisecond", count: 100 },
         *  { timeUnit: "millisecond", count: 500 },
         *  { timeUnit: "second", count: 1 },
         *  { timeUnit: "second", count: 5 },
         *  { timeUnit: "second", count: 10 },
         *  { timeUnit: "second", count: 30 },
         *  { timeUnit: "minute", count: 1 },
         *  { timeUnit: "minute", count: 5 },
         *  { timeUnit: "minute", count: 10 },
         *  { timeUnit: "minute", count: 30 },
         *  { timeUnit: "hour", count: 1 },
         *  { timeUnit: "hour", count: 3 },
         *  { timeUnit: "hour", count: 6 },
         *  { timeUnit: "hour", count: 12 },
         *  { timeUnit: "day", count: 1 },
         *  { timeUnit: "day", count: 2 },
         *  { timeUnit: "day", count: 3 },
         *  { timeUnit: "day", count: 4 },
         *  { timeUnit: "day", count: 5 },
         *  { timeUnit: "week", count: 1 },
         *  { timeUnit: "month", count: 1 },
         *  { timeUnit: "month", count: 2 },
         *  { timeUnit: "month", count: 3 },
         *  { timeUnit: "month", count: 6 },
         *  { timeUnit: "year", count: 1 },
         *  { timeUnit: "year", count: 2 },
         *  { timeUnit: "year", count: 5 },
         *  { timeUnit: "year", count: 10 },
         *  { timeUnit: "year", count: 50 },
         *  { timeUnit: "year", count: 100 }
         * ]
         * ```
         */
        _this.gridIntervals = new List();
        /**
         * A collection of date formats to use when formatting different time units
         * on Date/time axis.
         *
         * Actual defaults will depend on the language locale set for the chart.
         *
         * To override format for a specific time unit, say days, you need to set
         * the appropriate key to a format string. E.g.:
         *
         * ```TypeScript
         * axis.dateFormats.setKey("day", "MMMM d, yyyy");
         * ```
         * ```JavaScript
         * axis.dateFormats.setKey("day", "MMMM d, yyyy");
         * ```
         * ```JSON
         * "xAxes": [{
         *   "type": "DateAxis",
         *   "dateFormats": {
         *     "day": "MMMM d, yyyy"
         *   }
         * }]
         * ```
         *
         * @see {@link DateFormatter}
         */
        _this.dateFormats = new Dictionary();
        /**
         * These formats are applied to labels that are first in a larger unit.
         *
         * For example, if we have a DateAxis with days on it, the first day of month
         * indicates a break in month - a start of the bigger period.
         *
         * For those labels, `periodChangeDateFormats` are applied instead of
         * `dateFormats`.
         *
         * This allows us implement convenient structures, like instead of:
         *
         * `Jan 1 - Jan 2 - Jan 3 - ...`
         *
         * We can have:
         *
         * `Jan - 1 - 2 - 3 - ...`
         *
         * This can be disabled by setting `markUnitChange = false`.
         */
        _this.periodChangeDateFormats = new Dictionary();
        /**
         * Actual interval (granularity) derived from the actual data.
         */
        _this._baseIntervalReal = { timeUnit: "day", count: 1 };
        /**
         * [_minDifference description]
         *
         * @todo Description
         */
        _this._minDifference = {};
        _this.className = "DateAxis";
        _this.setPropertyValue("markUnitChange", true);
        _this.snapTooltip = true;
        // Translatable defaults are applied in `applyInternalDefaults()`
        // ...
        // Define default intervals
        _this.gridIntervals.pushAll([
            { timeUnit: "millisecond", count: 1 },
            { timeUnit: "millisecond", count: 5 },
            { timeUnit: "millisecond", count: 10 },
            { timeUnit: "millisecond", count: 50 },
            { timeUnit: "millisecond", count: 100 },
            { timeUnit: "millisecond", count: 500 },
            { timeUnit: "second", count: 1 },
            { timeUnit: "second", count: 5 },
            { timeUnit: "second", count: 10 },
            { timeUnit: "second", count: 30 },
            { timeUnit: "minute", count: 1 },
            { timeUnit: "minute", count: 5 },
            { timeUnit: "minute", count: 10 },
            { timeUnit: "minute", count: 15 },
            { timeUnit: "minute", count: 30 },
            { timeUnit: "hour", count: 1 },
            { timeUnit: "hour", count: 3 },
            { timeUnit: "hour", count: 6 },
            { timeUnit: "hour", count: 12 },
            { timeUnit: "day", count: 1 },
            { timeUnit: "day", count: 2 },
            { timeUnit: "day", count: 3 },
            { timeUnit: "day", count: 4 },
            { timeUnit: "day", count: 5 },
            { timeUnit: "week", count: 1 },
            { timeUnit: "month", count: 1 },
            { timeUnit: "month", count: 2 },
            { timeUnit: "month", count: 3 },
            { timeUnit: "month", count: 6 },
            { timeUnit: "year", count: 1 },
            { timeUnit: "year", count: 2 },
            { timeUnit: "year", count: 5 },
            { timeUnit: "year", count: 10 },
            { timeUnit: "year", count: 50 },
            { timeUnit: "year", count: 100 },
            { timeUnit: "year", count: 200 },
            { timeUnit: "year", count: 500 },
            { timeUnit: "year", count: 1000 },
            { timeUnit: "year", count: 2000 },
            { timeUnit: "year", count: 5000 },
            { timeUnit: "year", count: 10000 },
            { timeUnit: "year", count: 100000 }
        ]);
        // Set field name
        _this.axisFieldName = "date";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * A function which applies fills to axis cells.
     *
     * Default function fills every second fill. You can set this to a function
     * that follows some other logic.
     *
     * Function should accept a [[DateAxisDataItem]] and modify its `axisFill`
     * property accordingly.
     */
    DateAxis.prototype.fillRule = function (dataItem) {
        var value = dataItem.value;
        var axis = dataItem.component;
        var gridInterval = axis._gridInterval;
        var gridDuration = $time.getDuration(gridInterval.timeUnit, gridInterval.count);
        if (Math.round((value - axis.min) / gridDuration) / 2 == Math.round(Math.round((value - axis.min) / gridDuration) / 2)) {
            dataItem.axisFill.__disabled = true;
        }
        else {
            dataItem.axisFill.__disabled = false;
        }
    };
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    DateAxis.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Set default date formats
        if (!this.dateFormats.hasKey("millisecond")) {
            this.dateFormats.setKey("millisecond", this.language.translate("_date_millisecond"));
        }
        if (!this.dateFormats.hasKey("second")) {
            this.dateFormats.setKey("second", this.language.translate("_date_second"));
        }
        if (!this.dateFormats.hasKey("minute")) {
            this.dateFormats.setKey("minute", this.language.translate("_date_minute"));
        }
        if (!this.dateFormats.hasKey("hour")) {
            this.dateFormats.setKey("hour", this.language.translate("_date_hour"));
        }
        if (!this.dateFormats.hasKey("day")) {
            this.dateFormats.setKey("day", this.language.translate("_date_day"));
        }
        if (!this.dateFormats.hasKey("week")) {
            this.dateFormats.setKey("week", this.language.translate("_date_day")); // not a mistake
        }
        if (!this.dateFormats.hasKey("month")) {
            this.dateFormats.setKey("month", this.language.translate("_date_month"));
        }
        if (!this.dateFormats.hasKey("year")) {
            this.dateFormats.setKey("year", this.language.translate("_date_year"));
        }
        if (!this.periodChangeDateFormats.hasKey("millisecond")) {
            this.periodChangeDateFormats.setKey("millisecond", this.language.translate("_date_millisecond"));
        }
        if (!this.periodChangeDateFormats.hasKey("second")) {
            this.periodChangeDateFormats.setKey("second", this.language.translate("_date_second"));
        }
        if (!this.periodChangeDateFormats.hasKey("minute")) {
            this.periodChangeDateFormats.setKey("minute", this.language.translate("_date_minute"));
        }
        if (!this.periodChangeDateFormats.hasKey("hour")) {
            this.periodChangeDateFormats.setKey("hour", this.language.translate("_date_hour"));
        }
        if (!this.periodChangeDateFormats.hasKey("day")) {
            this.periodChangeDateFormats.setKey("day", this.language.translate("_date_day"));
        }
        if (!this.periodChangeDateFormats.hasKey("week")) {
            this.periodChangeDateFormats.setKey("week", this.language.translate("_date_day"));
        }
        if (!this.periodChangeDateFormats.hasKey("month")) {
            this.periodChangeDateFormats.setKey("month", this.language.translate("_date_month") + " " + this.language.translate("_date_year"));
        }
    };
    /**
     * Returns a new/empty [[DataItem]] of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return Data Item
     */
    DateAxis.prototype.createDataItem = function () {
        return new DateAxisDataItem();
    };
    /**
     * Returns a new/empty [[AxisBreak]] of the appropriate type.
     *
     * @return Axis break
     */
    DateAxis.prototype.createAxisBreak = function () {
        return new DateAxisBreak();
    };
    /**
     * Validates Axis' data items.
     *
     * @ignore Exclude from docs
     */
    DateAxis.prototype.validateDataItems = function () {
        // allows to keep selection of the same size
        var start = this.start;
        var end = this.end;
        var periodCount = (this.max - this.min) / this.baseDuration;
        _super.prototype.validateDataItems.call(this);
        this.maxZoomFactor = (this.max - this.min) / this.baseDuration;
        this._deltaMinMax = this.baseDuration / 2;
        // allows to keep selection of the same size
        var newPeriodCount = (this.max - this.min) / this.baseDuration;
        start = start + (end - start) * (1 - periodCount / newPeriodCount);
        this.zoom({ start: start, end: end }, false, true); // added instantlyto solve zoomout problem when we have axes gaps. @todo: check how this affects maxZoomFactor
    };
    /**
     * Handles process after zoom.
     *
     * @ignore Exclude from docs
     * @todo Does nothing?
     */
    DateAxis.prototype.handleSelectionExtremesChange = function () {
    };
    /**
     * Calculates all positions, related to axis as per current zoom.
     *
     * @ignore Exclude from docs
     */
    DateAxis.prototype.calculateZoom = function () {
        var _this = this;
        _super.prototype.calculateZoom.call(this);
        var gridInterval = this.chooseInterval(0, this.adjustDifference(this._minZoomed, this._maxZoomed), this._gridCount);
        if ($time.getDuration(gridInterval.timeUnit, gridInterval.count) < this.baseDuration) {
            gridInterval = tslib_1.__assign({}, this.baseInterval);
        }
        this._gridInterval = gridInterval;
        this._gridDate = $time.round(new Date(this.min), gridInterval.timeUnit, gridInterval.count, this.getFirstWeekDay(), this.dateFormatter.utc);
        this._nextGridUnit = $time.getNextUnit(gridInterval.timeUnit);
        // the following is needed to avoid grid flickering while scrolling
        this._intervalDuration = $time.getDuration(gridInterval.timeUnit, gridInterval.count);
        var count = Math.ceil(this._difference / this._intervalDuration);
        count = Math.max(-5, Math.floor(this.start * count) - 3); // some extra is needed
        $time.add(this._gridDate, gridInterval.timeUnit, count * gridInterval.count, this.dateFormatter.utc);
        // tell series start/end
        $iter.each(this.series.iterator(), function (series) {
            if (series.baseAxis == _this) {
                var field_1 = series.getAxisField(_this);
                var minZoomed = $time.round(new Date(_this._minZoomed), _this.baseInterval.timeUnit, _this.baseInterval.count).getTime();
                var minZoomedStr = minZoomed.toString();
                var startDataItem = series.dataItemsByAxis.getKey(_this.uid).getKey(minZoomedStr);
                var startIndex = 0;
                if (_this.start != 0) {
                    if (startDataItem) {
                        startDataItem = _this.findFirst(startDataItem, minZoomed, field_1);
                        startIndex = startDataItem.index;
                    }
                    else {
                        startIndex = series.dataItems.findClosestIndex(_this._minZoomed, function (x) { return x[field_1]; }, "left");
                    }
                }
                // 1 millisecond is removed so that if only first item is selected, it would not count in the second.
                var baseInterval = _this.baseInterval;
                var maxZoomed = $time.add($time.round(new Date(_this._maxZoomed), baseInterval.timeUnit, baseInterval.count, _this.getFirstWeekDay(), _this.dateFormatter.utc), baseInterval.timeUnit, baseInterval.count, _this.dateFormatter.utc).getTime();
                var maxZoomedStr = maxZoomed.toString();
                var endDataItem = series.dataItemsByAxis.getKey(_this.uid).getKey(maxZoomedStr);
                var endIndex = series.dataItems.length;
                if (_this.end != 1) {
                    if (endDataItem) {
                        endIndex = endDataItem.index;
                    }
                    else {
                        maxZoomed -= 1;
                        endIndex = series.dataItems.findClosestIndex(maxZoomed, function (x) { return x[field_1]; }, "right") + 1;
                    }
                }
                series.startIndex = startIndex;
                series.endIndex = endIndex;
            }
        });
    };
    DateAxis.prototype.findFirst = function (dataItem, time, key) {
        var index = dataItem.index;
        if (index > 0) {
            var series = dataItem.component;
            var previousDataItem = series.dataItems.getIndex(index - 1);
            var previousDate = previousDataItem[key];
            if (!previousDate || previousDate.getTime() < time) {
                return dataItem;
            }
            else {
                return this.findFirst(previousDataItem, time, key);
            }
        }
        else {
            return dataItem;
        }
    };
    /**
     * (Re)validates data.
     *
     * @ignore Exclude from docs
     */
    DateAxis.prototype.validateData = function () {
        _super.prototype.validateData.call(this);
        if (!$type.isNumber(this.baseInterval.count)) {
            this.baseInterval.count = 1;
        }
    };
    Object.defineProperty(DateAxis.prototype, "minDifference", {
        /**
         * @ignore
         */
        get: function () {
            var _this = this;
            var minDifference = Number.MAX_VALUE;
            this.series.each(function (series) {
                if (minDifference > _this._minDifference[series.uid]) {
                    minDifference = _this._minDifference[series.uid];
                }
            });
            if (minDifference == Number.MAX_VALUE || minDifference == 0) {
                minDifference = $time.getDuration("day");
            }
            return minDifference;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [dataChangeUpdate description]
     *
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    DateAxis.prototype.seriesDataChangeUpdate = function (series) {
        this._minDifference[series.uid] = Number.MAX_VALUE;
    };
    /**
     * [postProcessSeriesDataItems description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    DateAxis.prototype.postProcessSeriesDataItems = function () {
        var _this = this;
        this.series.each(function (series) {
            if (JSON.stringify(series._baseInterval[_this.uid]) != JSON.stringify(_this.baseInterval)) {
                series.dataItems.each(function (dataItem) {
                    _this.postProcessSeriesDataItem(dataItem);
                });
                series._baseInterval[_this.uid] = _this.baseInterval;
            }
        });
        this.addEmptyUnitsBreaks();
    };
    /**
     * [postProcessSeriesDataItem description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param dataItem Data item
     */
    DateAxis.prototype.postProcessSeriesDataItem = function (dataItem) {
        var _this = this;
        // we need to do this for all series data items not only added recently, as baseInterval might change
        var baseInterval = this.baseInterval;
        var series = dataItem.component;
        var dataItemsByAxis = series.dataItemsByAxis.getKey(this.uid);
        $object.each(dataItem.dates, function (key) {
            var date = dataItem.getDate(key);
            var time = date.getTime();
            var startDate = $time.round(new Date(time), baseInterval.timeUnit, baseInterval.count, _this.getFirstWeekDay(), _this.dateFormatter.utc);
            var startTime = startDate.getTime();
            var endDate = $time.add(new Date(startTime), baseInterval.timeUnit, baseInterval.count, _this.dateFormatter.utc);
            dataItem.setCalculatedValue(key, startTime, "open");
            dataItem.setCalculatedValue(key, endDate.getTime(), "close");
            dataItemsByAxis.setKey(startTime.toString(), dataItem);
        });
    };
    /**
     * Collapses empty stretches of date/time scale by creating [[AxisBreak]]
     * elements for them.
     *
     * Can be used to automatically remove strethes without data, like weekends.
     *
     * No, need to call this manually. It will automatically be done if
     * `skipEmptyPeriods = true`.
     *
     * @ignore Exclude from docs
     */
    DateAxis.prototype.addEmptyUnitsBreaks = function () {
        var _this = this;
        if (this.skipEmptyPeriods && $type.isNumber(this.min) && $type.isNumber(this.max)) {
            var timeUnit = this.baseInterval.timeUnit;
            var count = this.baseInterval.count;
            this.axisBreaks.clear(); // TODO: what about breaks added by user?
            var date = $time.round(new Date(this.min), timeUnit, count, this.getFirstWeekDay(), this.dateFormatter.utc);
            var axisBreak = void 0;
            var _loop_1 = function () {
                $time.add(date, timeUnit, count, this_1.dateFormatter.utc);
                var startTime = date.getTime();
                var startTimeStr = startTime.toString();
                var hasData = $iter.contains(this_1.series.iterator(), function (series) {
                    return !!series.dataItemsByAxis.getKey(_this.uid).getKey(startTimeStr);
                });
                // open break if not yet opened
                if (!hasData) {
                    if (!axisBreak) {
                        axisBreak = this_1.axisBreaks.create();
                        axisBreak.startDate = new Date(startTime);
                    }
                }
                else {
                    // close if already opened
                    if (axisBreak) {
                        // close at end time minus one millisecond
                        axisBreak.endDate = new Date(startTime - 1);
                        axisBreak = undefined;
                    }
                }
            };
            var this_1 = this;
            while (date.getTime() < this.max - this.baseDuration) {
                _loop_1();
            }
        }
    };
    /**
     * Updates positioning of Axis breaks after something changes.
     *
     * @ignore Exclude from docs
     */
    DateAxis.prototype.fixAxisBreaks = function () {
        var _this = this;
        _super.prototype.fixAxisBreaks.call(this);
        var axisBreaks = this.axisBreaks;
        if (axisBreaks.length > 0) {
            // process breaks
            axisBreaks.each(function (axisBreak) {
                var breakGridCount = Math.ceil(_this._gridCount * (Math.min(_this.end, axisBreak.endPosition) - Math.max(_this.start, axisBreak.startPosition)) / (_this.end - _this.start));
                axisBreak.gridInterval = _this.chooseInterval(0, axisBreak.adjustedEndValue - axisBreak.adjustedStartValue, breakGridCount);
                var gridDate = $time.round(new Date(axisBreak.adjustedStartValue), axisBreak.gridInterval.timeUnit, axisBreak.gridInterval.count, _this.getFirstWeekDay(), _this.dateFormatter.utc);
                if (gridDate.getTime() > axisBreak.startDate.getTime()) {
                    $time.add(gridDate, axisBreak.gridInterval.timeUnit, axisBreak.gridInterval.count, _this.dateFormatter.utc);
                }
                axisBreak.gridDate = gridDate;
            });
        }
    };
    /**
     * @ignore
     */
    DateAxis.prototype.getFirstWeekDay = function () {
        if (this.dateFormatter) {
            return this.dateFormatter.firstDayOfWeek;
        }
        return 1;
    };
    /**
     * [getGridDate description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param date           [description]
     * @param intervalCount  [description]
     * @return [description]
     */
    DateAxis.prototype.getGridDate = function (date, intervalCount) {
        var timeUnit = this._gridInterval.timeUnit;
        var realIntervalCount = this._gridInterval.count;
        // round date
        $time.round(date, timeUnit, 1, this.getFirstWeekDay(), this.dateFormatter.utc);
        var prevTimestamp = date.getTime();
        var newDate = $time.copy(date);
        // modify date by adding intervalcount
        var timestamp = $time.add(newDate, timeUnit, intervalCount, this.dateFormatter.utc).getTime();
        // if it's axis break, get first rounded date which is not in a break
        var axisBreak = this.isInBreak(timestamp);
        if (axisBreak) {
            newDate = new Date(axisBreak.endDate.getTime());
            $time.round(newDate, timeUnit, realIntervalCount, this.getFirstWeekDay(), this.dateFormatter.utc);
            if (newDate.getTime() < axisBreak.endDate.getTime()) {
                $time.add(newDate, timeUnit, realIntervalCount, this.dateFormatter.utc);
            }
            timestamp = newDate.getTime();
        }
        // get duration between grid lines with break duration removed
        var durationBreaksRemoved = this.adjustDifference(prevTimestamp, timestamp);
        // calculate how many time units fit to this duration
        var countBreaksRemoved = Math.round(durationBreaksRemoved / $time.getDuration(timeUnit));
        // if less units fit, add one and repeat
        if (countBreaksRemoved < realIntervalCount) {
            return this.getGridDate(date, intervalCount + realIntervalCount);
        }
        return newDate;
    };
    /**
     * [getBreaklessDate description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param axisBreak  [description]
     * @param timeUnit   [description]
     * @param count      [description]
     * @return [description]
     */
    DateAxis.prototype.getBreaklessDate = function (axisBreak, timeUnit, count) {
        var date = new Date(axisBreak.endValue);
        $time.round(date, timeUnit, count, this.getFirstWeekDay(), this.dateFormatter.utc);
        $time.add(date, timeUnit, count, this.dateFormatter.utc);
        var timestamp = date.getTime();
        axisBreak = this.isInBreak(timestamp);
        if (axisBreak) {
            return this.getBreaklessDate(axisBreak, timeUnit, count);
        }
        return date;
    };
    /**
     * (Re)validates all Axis elements.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    DateAxis.prototype.validateAxisElements = function () {
        var _this = this;
        if ($type.isNumber(this.max) && $type.isNumber(this.min)) {
            this.calculateZoom();
            // first regular items
            var timestamp = this._gridDate.getTime();
            var timeUnit = this._gridInterval.timeUnit;
            var intervalCount = this._gridInterval.count;
            var prevGridDate = $time.copy(this._gridDate);
            var dataItemsIterator_1 = this._dataItemsIterator;
            this.resetIterators();
            var _loop_2 = function () {
                var date = this_2.getGridDate($time.copy(prevGridDate), intervalCount);
                timestamp = date.getTime();
                var endDate = $time.copy(date); // you might think it's easier to add intervalduration to timestamp, however it won't work for months or years which are not of the same length
                endDate = $time.add(endDate, timeUnit, intervalCount, this_2.dateFormatter.utc);
                var format = this_2.dateFormats.getKey(timeUnit);
                if (this_2.markUnitChange && prevGridDate) {
                    if ($time.checkChange(date, prevGridDate, this_2._nextGridUnit, this_2.dateFormatter.utc)) {
                        if (timeUnit !== "year") {
                            format = this_2.periodChangeDateFormats.getKey(timeUnit);
                        }
                    }
                }
                var text = this_2.dateFormatter.format(date, format);
                var dataItem = dataItemsIterator_1.find(function (x) { return x.text === text; });
                if (dataItem.__disabled) {
                    dataItem.__disabled = false;
                }
                this_2.appendDataItem(dataItem);
                dataItem.axisBreak = undefined;
                dataItem.date = date;
                dataItem.endDate = endDate;
                dataItem.text = text;
                prevGridDate = date;
                this_2.validateDataElement(dataItem);
            };
            var this_2 = this;
            while (timestamp <= this._maxZoomed) {
                _loop_2();
            }
            // breaks later
            var renderer_1 = this.renderer;
            $iter.each(this.axisBreaks.iterator(), function (axisBreak) {
                if (axisBreak.breakSize > 0) {
                    var timeUnit_1 = axisBreak.gridInterval.timeUnit;
                    var intervalCount_1 = axisBreak.gridInterval.count;
                    // only add grid if gap is bigger then minGridDistance
                    if ($math.getDistance(axisBreak.startPoint, axisBreak.endPoint) > renderer_1.minGridDistance * 4) {
                        var timestamp_1 = axisBreak.gridDate.getTime();
                        var prevGridDate_1;
                        var count = 0;
                        var _loop_3 = function () {
                            var date = $time.copy(axisBreak.gridDate);
                            timestamp_1 = $time.add(date, timeUnit_1, intervalCount_1 * count, _this.dateFormatter.utc).getTime();
                            count++;
                            if (timestamp_1 > axisBreak.adjustedStartValue && timestamp_1 < axisBreak.adjustedEndValue) {
                                var endDate = $time.copy(date); // you might think it's easier to add intervalduration to timestamp, however it won't work for months or years which are not of the same length
                                endDate = $time.add(endDate, timeUnit_1, intervalCount_1, _this.dateFormatter.utc);
                                var format = _this.dateFormats.getKey(timeUnit_1);
                                if (_this.markUnitChange && prevGridDate_1) {
                                    if ($time.checkChange(date, prevGridDate_1, _this._nextGridUnit, _this.dateFormatter.utc)) {
                                        if (timeUnit_1 !== "year") {
                                            format = _this.periodChangeDateFormats.getKey(timeUnit_1);
                                        }
                                    }
                                }
                                var text_1 = _this.dateFormatter.format(date, format);
                                var dataItem = dataItemsIterator_1.find(function (x) { return x.text === text_1; });
                                if (dataItem.__disabled) {
                                    dataItem.__disabled = false;
                                }
                                //this.processDataItem(dataItem);
                                _this.appendDataItem(dataItem);
                                dataItem.axisBreak = axisBreak;
                                axisBreak.dataItems.moveValue(dataItem);
                                dataItem.date = date;
                                dataItem.endDate = endDate;
                                dataItem.text = text_1;
                                prevGridDate_1 = date;
                                _this.validateDataElement(dataItem);
                            }
                        };
                        while (timestamp_1 <= axisBreak.adjustedMax) {
                            _loop_3();
                        }
                    }
                }
            });
        }
    };
    /**
     * Validates Axis data item.
     *
     * @ignore Exclude from docs
     * @param dataItem Data item
     */
    DateAxis.prototype.validateDataElement = function (dataItem) {
        //super.validateDataElement(dataItem);
        if ($type.isNumber(this.max) && $type.isNumber(this.min)) {
            var renderer = this.renderer;
            var timestamp = dataItem.value;
            var endTimestamp = dataItem.endValue;
            if (!$type.isNumber(endTimestamp)) {
                endTimestamp = timestamp;
            }
            var position = this.valueToPosition(timestamp);
            var endPosition = this.valueToPosition(endTimestamp);
            var fillEndPosition = endPosition;
            if (!dataItem.isRange && this._gridInterval.count > this.baseInterval.count) {
                endPosition = position + (endPosition - position) / (this._gridInterval.count / this.baseInterval.count);
            }
            dataItem.position = position;
            var tick = dataItem.tick;
            if (tick && !tick.disabled) {
                renderer.updateTickElement(tick, position, endPosition);
            }
            var grid = dataItem.grid;
            if (grid && !grid.disabled) {
                renderer.updateGridElement(grid, position, endPosition);
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
                renderer.updateFillElement(mask, position, endPosition);
            }
            var label = dataItem.label;
            if (label && !label.disabled) {
                var location_1 = label.location;
                if (location_1 == 0) {
                    if (this._gridInterval.count == 1 && this._gridInterval.timeUnit != "week" && !dataItem.isRange) {
                        location_1 = 0.5;
                    }
                    else {
                        location_1 = 0;
                    }
                }
                renderer.updateLabelElement(label, position, endPosition, location_1);
            }
        }
    };
    Object.defineProperty(DateAxis.prototype, "baseDuration", {
        /**
         * A duration in milliseconds of the `baseInterval`.
         *
         * @return Duration (ms)
         */
        get: function () {
            return $time.getDuration(this.baseInterval.timeUnit, this.baseInterval.count);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adjusts min/max values.
     *
     * @ignore Exclude from docs.
     * @todo Description (review)
     * @param min  Min timestamp
     * @param max  Max timestamp
     * @return Adjusted min/max step
     */
    DateAxis.prototype.adjustMinMax = function (min, max) {
        return { min: min, max: max, step: this.baseDuration };
    };
    /**
     * Adjusts the minimum timestamp as per cell start location.
     *
     * @param value  Value
     * @return Adjusted value
     */
    DateAxis.prototype.fixMin = function (value) {
        // like this because months are not equal
        var startTime = $time.round(new Date(value), this.baseInterval.timeUnit, this.baseInterval.count, this.getFirstWeekDay(), this.dateFormatter.utc).getTime();
        var endTime = $time.add(new Date(startTime), this.baseInterval.timeUnit, this.baseInterval.count, this.dateFormatter.utc).getTime();
        return startTime + (endTime - startTime) * this.startLocation;
    };
    /**
     * Adjusts the maximum timestamp as per cell start location.
     *
     * @param value  Value
     * @return Adjusted value
     */
    DateAxis.prototype.fixMax = function (value) {
        // like this because months are not equal
        var startTime = $time.round(new Date(value), this.baseInterval.timeUnit, this.baseInterval.count, this.getFirstWeekDay(), this.dateFormatter.utc).getTime();
        var endTime = $time.add(new Date(startTime), this.baseInterval.timeUnit, this.baseInterval.count, this.dateFormatter.utc).getTime();
        return startTime + (endTime - startTime) * this.endLocation;
    };
    /**
     * [chooseInterval description]
     *
     * @ignore Exclude from docs.
     * @todo Description
     * @param index      [description]
     * @param duration   [description]
     * @param gridCount  [description]
     * @return [description]
     */
    DateAxis.prototype.chooseInterval = function (index, duration, gridCount) {
        var gridIntervals = this.gridIntervals;
        var gridInterval = gridIntervals.getIndex(index);
        var intervalDuration = $time.getDuration(gridInterval.timeUnit, gridInterval.count);
        var lastIndex = gridIntervals.length - 1;
        if (index >= lastIndex) {
            return tslib_1.__assign({}, gridIntervals.getIndex(lastIndex));
        }
        var count = Math.ceil(duration / intervalDuration);
        if (duration < intervalDuration && index > 0) {
            return tslib_1.__assign({}, gridIntervals.getIndex(index - 1));
        }
        if (count <= gridCount) {
            return tslib_1.__assign({}, gridIntervals.getIndex(index));
        }
        else {
            if (index + 1 < gridIntervals.length) {
                return this.chooseInterval(index + 1, duration, gridCount);
            }
            else {
                return tslib_1.__assign({}, gridIntervals.getIndex(index));
            }
        }
    };
    /**
     * Formats the value according to axis' own [[DateFormatter]].
     *
     * @param value  Source value
     * @return Formatted value
     */
    DateAxis.prototype.formatLabel = function (value) {
        return this.dateFormatter.format(value);
    };
    /**
     * Converts a Date to an asbolute pixel position within Axis.
     *
     * @param date  Date
     * @return Position (px)
     */
    DateAxis.prototype.dateToPosition = function (date) {
        return this.valueToPosition(date.getTime());
    };
    /**
     * Converts a numeric timestamp or a `Date` to a relative position on axis.
     *
     * @param date  Date or a timestamp
     * @return Relative position
     */
    DateAxis.prototype.anyToPosition = function (date) {
        if (date instanceof Date) {
            return this.dateToPosition(date);
        }
        else {
            return this.valueToPosition(date);
        }
    };
    /**
     * Converts date to orientation point (x, y, angle) on axis
     *
     * @param date Date
     * @return IOrientationPoint
     */
    DateAxis.prototype.dateToPoint = function (date) {
        var position = this.dateToPosition(date);
        var point = this.renderer.positionToPoint(position);
        var angle = this.renderer.positionToAngle(position);
        return { x: point.x, y: point.y, angle: angle };
    };
    /**
     * Converts a numeric value to orientation (x, y, angle) point on axis
     *
     * @param value  Value
     * @return Orientation point
     */
    DateAxis.prototype.anyToPoint = function (date) {
        if (date instanceof Date) {
            return this.dateToPoint(date);
        }
        else {
            return this.valueToPoint(date);
        }
    };
    /**
     * Converts pixel position within Axis to a corresponding Date.
     *
     * @param position  Position (px)
     * @return Date
     */
    DateAxis.prototype.positionToDate = function (position) {
        return new Date(this.positionToValue(position));
    };
    /**
     * Returns the X coordinate for series' data item's value.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param dataItem  Data item
     * @param key       Data field to get value from
     * @param location  Location (0-1)
     * @return X coordinate (px)
     */
    DateAxis.prototype.getX = function (dataItem, key, location) {
        var value = this.getTimeByLocation(dataItem, key, location);
        //let stack: number = dataItem.getValue("valueX", "stack");
        if (!$type.isNumber(value)) {
            value = this.baseValue;
        }
        return this.renderer.positionToPoint(this.valueToPosition(value)).x;
    };
    /**
     * Returns the Y coordinate for series' data item's value.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param dataItem  Data item
     * @param key       Data field to get value from
     * @param location  Location (0-1)
     * @return Y coordinate (px)
     */
    DateAxis.prototype.getY = function (dataItem, key, location) {
        var value = this.getTimeByLocation(dataItem, key, location);
        var stack = dataItem.getValue("valueX", "stack");
        if (!$type.isNumber(value)) {
            value = this.baseValue;
        }
        return this.renderer.positionToPoint(this.valueToPosition(value + stack)).y;
    };
    /**
     * Returns an angle for series data item.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param dataItem  Data item
     * @param key       Data field to get value from
     * @param location  Location (0-1)
     * @param stackKey  Stack ID
     * @return Angle
     */
    DateAxis.prototype.getAngle = function (dataItem, key, location, stackKey) {
        var value = this.getTimeByLocation(dataItem, key, location);
        var stack = dataItem.getValue(stackKey, "stack");
        if (!$type.isNumber(value)) {
            value = this.baseValue;
        }
        return this.positionToAngle(this.valueToPosition(value + stack));
    };
    /**
     * [getTimeByLocation description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param dataItem  [description]
     * @param key       [description]
     * @param location  [description]
     * @return [description]
     */
    DateAxis.prototype.getTimeByLocation = function (dataItem, key, location) {
        if (!$type.hasValue(key)) {
            return;
        }
        if (!$type.isNumber(location)) {
            location = dataItem.workingLocations[key];
            if (!$type.isNumber(location)) {
                location = 0;
            }
        }
        var startTime = dataItem.values[key]["open"];
        var endTime = dataItem.values[key]["close"];
        if ($type.isNumber(startTime) && $type.isNumber(endTime)) {
            return startTime + (endTime - startTime) * location;
        }
    };
    /**
     * Processes a related series' data item.
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param dataItem  Data item
     */
    DateAxis.prototype.processSeriesDataItem = function (dataItem, axisLetter) {
        var series = dataItem.component;
        var time;
        var date = dataItem["date" + axisLetter];
        if (date) {
            time = date.getTime();
        }
        else {
            return;
        }
        var openDate = dataItem["openDate" + axisLetter];
        var prevSeriesTime = this._prevSeriesTime;
        var openTime;
        if (openDate) {
            openTime = openDate.getTime();
        }
        if ($type.isNumber(openTime)) {
            var difference = Math.abs(time - openTime);
            if (this._minDifference[series.uid] > difference) {
                this._minDifference[series.uid] = difference;
            }
        }
        var differece = time - prevSeriesTime;
        if (differece > 0) {
            if (this._minDifference[series.uid] > differece) {
                this._minDifference[series.uid] = differece;
            }
        }
        this._prevSeriesTime = time;
        if (series._baseInterval[this.uid]) {
            this.postProcessSeriesDataItem(dataItem);
        }
        else {
            if (this._baseInterval) {
                series._baseInterval[this.uid] = this._baseInterval;
                this.postProcessSeriesDataItem(dataItem);
            }
        }
    };
    /**
     * [updateAxisBySeries description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    DateAxis.prototype.updateAxisBySeries = function () {
        _super.prototype.updateAxisBySeries.call(this);
        var baseInterval = this.chooseInterval(0, this.minDifference, 1);
        // handle short months
        if (this.minDifference >= $time.getDuration("day", 27) && baseInterval.timeUnit == "week") {
            baseInterval.timeUnit = "month";
            baseInterval.count = 1;
        }
        // handle daylight saving
        if (this.minDifference >= $time.getDuration("hour", 23) && baseInterval.timeUnit == "hour") {
            baseInterval.timeUnit = "day";
            baseInterval.count = 1;
        }
        if (this.minDifference >= $time.getDuration("week", 1) - $time.getDuration("hour", 1) && baseInterval.timeUnit == "day") {
            baseInterval.timeUnit = "week";
            baseInterval.count = 1;
        }
        if (this.minDifference >= $time.getDuration("year", 1) - $time.getDuration("day", 1.01) && baseInterval.timeUnit == "month") {
            baseInterval.timeUnit = "year";
            baseInterval.count = 1;
        }
        this._baseIntervalReal = baseInterval;
        // no need to invalidate
    };
    Object.defineProperty(DateAxis.prototype, "baseInterval", {
        /**
         * @return Base interval
         */
        get: function () {
            if (this._baseInterval) {
                return this._baseInterval;
            }
            else {
                return this._baseIntervalReal;
            }
        },
        /**
         * A base interval (granularity) of data.
         *
         * Used to indicate what are the base units of your data.
         *
         * For example, if you have a data set that has a data point every 5 minutes,
         * you may want to set this to `{ timeUnit: "minute", count: 5 }`.
         *
         * If not set, the Axis will try to determine the setting by its own, looking
         * at actual data.
         *
         * @param timeInterval base interval
         */
        set: function (timeInterval) {
            if (JSON.stringify(this._baseInterval) != JSON.stringify(timeInterval)) {
                this._baseInterval = timeInterval;
                this.invalidate();
                this.postProcessSeriesDataItems();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateAxis.prototype, "skipEmptyPeriods", {
        /**
         * @return Remove empty stretches of time?
         */
        get: function () {
            return this.getPropertyValue("skipEmptyPeriods");
        },
        /**
         * If enabled, axis will automatically collapse empty (without data points)
         * periods of time, i.e. weekends.
         *
         * An "empty" period is considered a stretch of time in the length of current
         * `baseInterval` without a single data point in it.
         *
         * For each such empty period, axis will automatically create an
         * [[AxisBreak]]. By default they will be invisible. You can still configure
         * them by accessing `axis.breaks.template`.
         *
         * [More info about breaks](https://www.amcharts.com/docs/v4/concepts/axes/#Breaks).
         *
         * Important notes:
         * * If you set this property to `true`, you can not add your custom axis breaks to this axis anymore.
         * * Using this feature affects performance. Use only if you need it.
         * * Setting this to `true` will reset appearance of breaks. If you want to modify appearance, do it *after* you set `skipEmptyPeriods`.
         *
         * @default false
         * @param value  Remove empty stretches of time?
         */
        set: function (value) {
            if (this.setPropertyValue("skipEmptyPeriods", value)) {
                this.invalidateData();
            }
            if (value) {
                var breakTemplate = this.axisBreaks.template;
                breakTemplate.startLine.disabled = true;
                breakTemplate.endLine.disabled = true;
                breakTemplate.fillShape.disabled = true;
                breakTemplate.breakSize = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateAxis.prototype, "tooltipDateFormat", {
        /**
         * @return Date format
         */
        get: function () {
            return this.getPropertyValue("tooltipDateFormat");
        },
        /**
         * A special date format to apply axis tooltips.
         *
         * Will use same format as for labels, if not set.
         *
         * @param value  Date format
         */
        set: function (value) {
            this.setPropertyValue("tooltipDateFormat", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateAxis.prototype, "markUnitChange", {
        /**
         * @return Use different format for period beginning?
         */
        get: function () {
            return this.getPropertyValue("markUnitChange");
        },
        /**
         * Use `periodChangeDateFormats` to apply different formats to the first
         * label in bigger time unit.
         *
         * @default true
         * @param value  Use different format for period beginning?
         */
        set: function (value) {
            if (this.setPropertyValue("markUnitChange", value)) {
                this.invalidateData();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns text to show in a tooltip, based on specific relative position
     * within axis.
     *
     * The label will be formatted as per [[DateFormatter]] set for the whole
     * chart, or explicitly for this Axis.
     *
     * @ignore Exclude from docs
     * @param position  Position
     * @return Label (formatted date)
     */
    DateAxis.prototype.getTooltipText = function (position) {
        var text;
        var date = this.positionToDate(position);
        date = $time.round(date, this.baseInterval.timeUnit, this.baseInterval.count, this.getFirstWeekDay(), this.dateFormatter.utc);
        if ($type.hasValue(this.tooltipDateFormat)) {
            text = this.dateFormatter.format(date, this.tooltipDateFormat);
        }
        else {
            var dateFormat = this.dateFormats.getKey(this.baseInterval.timeUnit);
            if (dateFormat) {
                text = this.dateFormatter.format(date, dateFormat);
            }
            else {
                text = this.getPositionLabel(position);
            }
        }
        return this.adapter.apply("getTooltipText", text);
    };
    /**
     * Takes an absolute position within axis and adjust it to a specific position within base interval. (cell)
     *
     * @ignore Exclude from docs
     * @param position Source position
     * @param location  Location in the cell
     * @return Adjusted position
     */
    DateAxis.prototype.roundPosition = function (position, location) {
        var baseInterval = this.baseInterval;
        var timeUnit = baseInterval.timeUnit;
        var count = baseInterval.count;
        var date = this.positionToDate(position);
        $time.round(date, timeUnit, count, this.getFirstWeekDay(), this.dateFormatter.utc);
        if (location > 0) {
            $time.add(date, timeUnit, location * count, this.dateFormatter.utc);
        }
        if (this.isInBreak(date.getTime())) {
            while (date.getTime() < this.max) {
                $time.add(date, timeUnit, count, this.dateFormatter.utc);
                if (!this.isInBreak(date.getTime())) {
                    break;
                }
            }
        }
        return this.dateToPosition(date);
    };
    /**
     * Returns an relative position of the start of the cell (period), that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param position  Relative position
     * @return Cell start relative position
     */
    DateAxis.prototype.getCellStartPosition = function (position) {
        return this.roundPosition(position, 0);
    };
    /**
     * Returns an relative position of the end of the cell (period), that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param position  Relative position
     * @return Cell end relative position
     */
    DateAxis.prototype.getCellEndPosition = function (position) {
        return this.roundPosition(position, 1);
        //return this.dateToPosition($time.add(this.positionToDate(this.roundPosition(position, 1)), this.baseInterval.timeUnit, this.baseInterval.count));
    };
    /**
     * Returns a Series data item that corresponds to the specific pixel position
     * of the Axis.
     *
     * If `findNearest` (third parameter) is set to `true`, the method will try
     * to locate nearest available data item if none is found directly under
     * `position`.
     *
     * @param series       Series
     * @param position     Position (px)
     * @param findNearest  Should axis try to find nearest tooltip if there is no data item at exact position
     * @return Data item
     */
    DateAxis.prototype.getSeriesDataItem = function (series, position, findNearest) {
        var value = this.positionToValue(position);
        var date = $time.round(new Date(value), this.baseInterval.timeUnit, this.baseInterval.count, this.getFirstWeekDay(), this.dateFormatter.utc);
        var dataItemsByAxis = series.dataItemsByAxis.getKey(this.uid);
        var dataItem = dataItemsByAxis.getKey(date.getTime().toString());
        // todo:  alternatively we can find closiest here
        if (!dataItem && findNearest) {
            var key_1;
            if (this.axisLetter == "Y") {
                key_1 = "dateY";
            }
            else {
                key_1 = "dateX";
            }
            dataItem = series.dataItems.getIndex(series.dataItems.findClosestIndex(date.getTime(), function (x) {
                if (x[key_1]) {
                    return x[key_1].getTime();
                }
                else {
                    return -Infinity;
                }
            }, "any"));
        }
        return dataItem;
    };
    /**
     * Returns a formatted date based on position in axis scale.
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
    DateAxis.prototype.getPositionLabel = function (position) {
        // @todo Better format recognition
        var date = this.positionToDate(position);
        return this.dateFormatter.format(date, this.getCurrentLabelFormat());
    };
    /**
     * Returns label date format based on currently used time units
     *
     * @return Format
     */
    DateAxis.prototype.getCurrentLabelFormat = function () {
        return this.dateFormats.getKey(this._gridInterval ? this._gridInterval.timeUnit : "day");
    };
    /**
     * Initializes an Axis renderer.
     *
     * @ignore Exclude from docs
     */
    DateAxis.prototype.initRenderer = function () {
        _super.prototype.initRenderer.call(this);
        var renderer = this.renderer;
        if (renderer) {
            // Set defaults
            renderer.ticks.template.location = 0;
            renderer.grid.template.location = 0;
            renderer.labels.template.location = 0;
            renderer.baseGrid.disabled = true;
        }
    };
    Object.defineProperty(DateAxis.prototype, "basePoint", {
        /**
         * Coordinates of the actual axis start.
         *
         * @ignore Exclude from docs
         * @return Base point
         */
        get: function () {
            return { x: 0, y: 0 };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Zooms axis to specific Dates.
     *
     * @param startDate       Start date
     * @param endValue        End date
     * @param skipRangeEvent  Do not invoke events
     * @param instantly       Do not play zoom animations
     */
    DateAxis.prototype.zoomToDates = function (startDate, endDate, skipRangeEvent, instantly) {
        startDate = this.dateFormatter.parse(startDate);
        endDate = this.dateFormatter.parse(endDate);
        this.zoomToValues(startDate.getTime(), endDate.getTime(), skipRangeEvent, instantly);
    };
    /**
     * Adds `baseInterval` to "as is" fields.
     *
     * @param field  Field name
     * @return Assign as is?
     */
    DateAxis.prototype.asIs = function (field) {
        return field == "baseInterval" || _super.prototype.asIs.call(this, field);
    };
    /**
     * Copies all properties and related data from a different instance of Axis.
     *
     * @param source Source Axis
     */
    DateAxis.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.dateFormats = source.dateFormats;
        this.periodChangeDateFormats = source.periodChangeDateFormats;
        if (source["_baseInterval"]) {
            this.baseInterval = source.baseInterval;
        }
    };
    /**
     * Shows Axis tooltip at specific relative position within Axis. (0-1)
     *
     * @param position Position (0-1)
     * @param local or global position
     */
    DateAxis.prototype.showTooltipAtPosition = function (position, local) {
        var _this = this;
        if (!local) {
            position = this.toAxisPosition(position);
        }
        if (this.snapTooltip) {
            var actualDate = $time.round(this.positionToDate(position), this.baseInterval.timeUnit, 1, this.getFirstWeekDay(), this.dateFormatter.utc);
            var actualTime_1 = actualDate.getTime();
            var closestDate_1;
            this.series.each(function (series) {
                if (series.baseAxis == _this) {
                    var dataItem = _this.getSeriesDataItem(series, position, true);
                    if (dataItem) {
                        var date = void 0;
                        if (series.xAxis == _this) {
                            date = dataItem.dateX;
                        }
                        if (series.yAxis == _this) {
                            date = dataItem.dateY;
                        }
                        if (!closestDate_1) {
                            closestDate_1 = date;
                        }
                        else {
                            if (Math.abs(closestDate_1.getTime() - actualTime_1) > Math.abs(date.getTime() - actualTime_1)) {
                                closestDate_1 = date;
                            }
                        }
                    }
                }
            });
            if (closestDate_1) {
                var closestTime_1 = closestDate_1.getTime();
                closestDate_1 = $time.round(new Date(closestTime_1), this.baseInterval.timeUnit, this.baseInterval.count, this.getFirstWeekDay(), this.dateFormatter.utc);
                closestTime_1 = closestDate_1.getTime();
                closestDate_1 = new Date(closestDate_1.getTime() + this.baseDuration * this.renderer.tooltipLocation);
                position = this.dateToPosition(closestDate_1);
                this.series.each(function (series) {
                    var dataItem = series.dataItemsByAxis.getKey(_this.uid).getKey(closestTime_1.toString());
                    var point = series.showTooltipAtDataItem(dataItem);
                    if (point) {
                        _this.chart._seriesPoints.push({ series: series, point: point });
                    }
                    else {
                        // check, otherwise column tooltip will be hidden
                        if (series.tooltipText) {
                            series.hideTooltip();
                        }
                    }
                });
                //this.chart.sortSeriesTooltips(seriesPoints);
            }
        }
        _super.prototype.showTooltipAtPosition.call(this, position, true);
    };
    Object.defineProperty(DateAxis.prototype, "snapTooltip", {
        /**
         * @return Should snap?
         */
        get: function () {
            return this.getPropertyValue("snapTooltip");
        },
        /**
         * Should the nearest tooltip be shown if no data item is found on the
         * current cursor position.
         *
         * @default true
         * @param value  Should snap?
         */
        set: function (value) {
            this.setPropertyValue("snapTooltip", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateAxis.prototype, "gridInterval", {
        /**
         * Current grid interval.
         *
         * @return Grid interval
         */
        get: function () {
            return this._gridInterval;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @ignore
     */
    DateAxis.prototype.makeGap = function (dataItem, previous) {
        var series = dataItem.component;
        if (dataItem && previous) {
            if (!series.connect && $type.isNumber(series.autoGapCount)) {
                if (series.baseAxis == this) {
                    var time = dataItem.dates["date" + this.axisLetter].getTime();
                    var prevTime = previous.dates["date" + this.axisLetter].getTime();
                    if (time - prevTime > series.autoGapCount * this.baseDuration) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    return DateAxis;
}(ValueAxis));
export { DateAxis };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["DateAxis"] = DateAxis;
registry.registeredClasses["DateAxisDataItem"] = DateAxisDataItem;
//# sourceMappingURL=DateAxis.js.map