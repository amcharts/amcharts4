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
         * @return {Date} Date
         */
        get: function () {
            return this.dates["date"];
        },
        /**
         * Date position of the data item.
         *
         * @param {Date}  date  Date
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
         * @return {Date} End date
         */
        get: function () {
            return this.dates["endDate"];
        },
        /**
         * End date for data item.
         *
         * @param {Date} date End date
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
         *
         * @type {List<ITimeInterval>}
         */
        _this.gridIntervals = new List();
        /**
         * A collection of date formats to use when formatting different time units
         * on Date/time axis.
         *
         * Actual defaults will depend on the language locale set for the chart.
         *
         * To override format for a specific time unit, say days, you need to set
         * the approperiate key to a format string. E.g.:
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
         * @type {Dictionary<TimeUnit, string>}
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
         *
         * @type {Dictionary<TimeUnit, string>}
         */
        _this.periodChangeDateFormats = new Dictionary();
        /**
         * Use `periodChangeDateFormats` to apply different formats to the first
         * label in bigger time unit.
         *
         * @type {boolean}
         */
        _this._markUnitChange = true;
        /**
         * Actual interval (granularity) derived from the actual data.
         *
         * @type {ITimeInterval}
         */
        _this._baseIntervalReal = { timeUnit: "day", count: 1 };
        /**
         * Axis start location.
         *
         * * 0 - Full first cell is shown.
         * * 0.5 - Half of first cell is shown.
         * * 1 - None of the first cell is visible. (you probably don't want that)
         *
         * @param {number} value Location (0-1)
         */
        _this._startLocation = 0;
        /**
         * Axis end location.
         *
         * * 0 - None of the last cell is shown. (don't do that)
         * * 0.5 - Half of the last cell is shown.
         * * 1 - Full last cell is shown.
         *
         * @param {number} value Location (0-1)
         */
        _this._endLocation = 1;
        /**
         * A collection of timestamps of previously processed data items. Used
         * internally to track distance between data items when processing data.
         *
         * @type {Dictionary<string, number>}
         */
        _this._prevSeriesTime = new Dictionary();
        /**
         * [_minSeriesDifference description]
         *
         * @todo Description
         * @type {number}
         */
        _this._minSeriesDifference = Number.MAX_VALUE;
        /**
         * A function which applies fills to axis cells.
         *
         * Default function fills every second fill. You can set this to a function
         * that follows some other logic.
         *
         * Function should accept a [[DateAxisDataItem]] and modify its `axisFill`
         * property accordingly.
         *
         * @type {function}
         */
        _this.fillRule = function (dataItem) {
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
        _this.className = "DateAxis";
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
            { timeUnit: "year", count: 100 }
        ]);
        // Set field name
        _this.axisFieldName = "date";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
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
     * @return {DateAxisDataItem} Data Item
     */
    DateAxis.prototype.createDataItem = function () {
        return new DateAxisDataItem();
    };
    /**
     * Returns a new/empty [[AxisBreak]] of the appropriate type.
     *
     * @return {DateAxisBreak} Axis break
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
        this._gridDate = $time.round(new Date(this.min), gridInterval.timeUnit);
        this._nextGridUnit = $time.getNextUnit(gridInterval.timeUnit);
        // the following is needed to avoid grid flickering while scrolling
        this._intervalDuration = $time.getDuration(gridInterval.timeUnit, gridInterval.count);
        var count = Math.ceil(this._difference / this._intervalDuration);
        count = Math.floor(this.start * count) - 3; // some extra is needed
        $time.add(this._gridDate, gridInterval.timeUnit, count * gridInterval.count);
        // tell series start/end
        $iter.each(this.series.iterator(), function (series) {
            if (series.baseAxis == _this) {
                var field_1 = series.getAxisField(_this);
                // TODO use $type.castNumber ?
                var startIndex = series.dataItems.findClosestIndex(_this._minZoomed, function (x) { return x[field_1]; }, "left");
                // 1 millisecond is removed so that if only first item is selected, it would not count in the second.
                var endIndex = series.dataItems.findClosestIndex(_this._maxZoomed - 1, function (x) { return x[field_1]; }, "left") + 1;
                series.startIndex = startIndex;
                series.endIndex = endIndex;
            }
        });
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
    /**
     * [dataChangeUpdate description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    DateAxis.prototype.dataChangeUpdate = function () {
        _super.prototype.dataChangeUpdate.call(this);
        this._minSeriesDifference = Number.MAX_VALUE;
        // use day duration if only one item. as this method is called before data is processed, we check data.length and not dataItems.length
        if (this.chart.data.length <= 1) {
            this._minSeriesDifference = $time.getDuration("day");
        }
    };
    /**
     * [postProcessSeriesDataItems description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    DateAxis.prototype.postProcessSeriesDataItems = function () {
        var _this = this;
        $iter.each(this.series.iterator(), function (series) {
            $iter.each(series.dataItems.iterator(), function (dataItem) {
                _this.postProcessSeriesDataItem(dataItem);
            });
        });
        this.addEmptyUnitsBreaks();
    };
    /**
     * [postProcessSeriesDataItem description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {XYSeriesDataItem} dataItem Data item
     */
    DateAxis.prototype.postProcessSeriesDataItem = function (dataItem) {
        var _this = this;
        // we need to do this for all series data items not only added recently, as baseInterval might change
        var baseInterval = this.baseInterval;
        $object.each(dataItem.dates, function (key) {
            //for (let key in dataItem.dates) {
            var date = dataItem.getDate(key);
            var startDate = $time.round($time.copy(date), baseInterval.timeUnit, baseInterval.count);
            var endDate = $time.add($time.copy(startDate), baseInterval.timeUnit, baseInterval.count);
            dataItem.setCalculatedValue(key, startDate.getTime(), "open");
            dataItem.setCalculatedValue(key, endDate.getTime(), "close");
            var series = dataItem.component;
            series.dataItemsByAxis.getKey(_this.uid).setKey(startDate.getTime().toString(), dataItem);
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
            var date = $time.round(new Date(this.min), timeUnit, count);
            var axisBreak = void 0;
            var _loop_1 = function () {
                $time.add(date, timeUnit, count);
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
        var axisBreaks = this._axisBreaks;
        $iter.each(axisBreaks.iterator(), function (axisBreak) {
            var breakGridCount = _this._gridCount * (Math.min(_this.end, axisBreak.endPosition) - Math.max(_this.start, axisBreak.startPosition)) / (_this.end - _this.start);
            axisBreak.gridInterval = _this.chooseInterval(0, axisBreak.adjustedEndValue - axisBreak.adjustedStartValue, breakGridCount);
            axisBreak.gridDate = $time.round(new Date(axisBreak.adjustedStartValue), axisBreak.gridInterval.timeUnit);
        });
    };
    /**
     * [getGridDate description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {Date}    date           [description]
     * @param  {number}  intervalCount  [description]
     * @return {Date}                   [description]
     */
    DateAxis.prototype.getGridDate = function (date, intervalCount) {
        var timeUnit = this._gridInterval.timeUnit;
        var realIntervalCount = this._gridInterval.count;
        // round date
        $time.round(date, timeUnit);
        var prevTimestamp = date.getTime();
        var newDate = $time.copy(date);
        // modify date by adding intervalcount
        var timestamp = $time.add(newDate, timeUnit, intervalCount).getTime();
        // if it's axis break, get first rounded date which is not in a break
        var axisBreak = this.isInBreak(timestamp);
        if (axisBreak) {
            newDate = this.getBreaklessDate(axisBreak, this.baseInterval.timeUnit, this.baseInterval.count);
            timestamp = newDate.getTime();
        }
        // get duration between grid lines with break duration removed
        var durationBreaksRemoved = this.adjustDifference(prevTimestamp, timestamp);
        // calculate how many time units fit to this duration
        var countBreaksRemoved = Math.round(durationBreaksRemoved / $time.getDuration(timeUnit));
        // if less units fit, add one and repeat
        if (countBreaksRemoved < realIntervalCount) {
            return this.getGridDate(date, intervalCount + 1);
        }
        return newDate;
    };
    /**
     * [getBreaklessDate description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {DateAxisBreak}  axisBreak  [description]
     * @param  {TimeUnit}       timeUnit   [description]
     * @param  {number}         count      [description]
     * @return {Date}                      [description]
     */
    DateAxis.prototype.getBreaklessDate = function (axisBreak, timeUnit, count) {
        var date = new Date(axisBreak.endValue);
        $time.round(date, timeUnit, count);
        $time.add(date, timeUnit, count);
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
                var date = this_2.getGridDate(new Date(prevGridDate), intervalCount);
                timestamp = date.getTime();
                var endDate = $time.copy(date); // you might think it's easier to add intervalduration to timestamp, however it won't work for months or years which are not of the same length
                endDate = $time.add(endDate, timeUnit, intervalCount);
                var format = this_2.dateFormats.getKey(timeUnit);
                if (this_2._markUnitChange && prevGridDate) {
                    if ($time.checkChange(date, prevGridDate, this_2._nextGridUnit)) {
                        if (timeUnit !== "year") {
                            format = this_2.periodChangeDateFormats.getKey(timeUnit);
                        }
                    }
                }
                var text = this_2.dateFormatter.format(date, format);
                var dataItem = dataItemsIterator_1.find(function (x) { return x.text === text; });
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
                    if ($math.getDistance(axisBreak.startPoint, axisBreak.endPoint) > renderer_1.minGridDistance) {
                        var timestamp_1 = axisBreak.gridDate.getTime();
                        var prevGridDate_1;
                        var count = 0;
                        var _loop_3 = function () {
                            var date = $time.copy(axisBreak.gridDate);
                            timestamp_1 = $time.add(date, timeUnit_1, intervalCount_1 * count).getTime();
                            count++;
                            if (timestamp_1 > axisBreak.adjustedStartValue && timestamp_1 < axisBreak.adjustedEndValue) {
                                var endDate = $time.copy(date); // you might think it's easier to add intervalduration to timestamp, however it won't work for months or years which are not of the same length
                                endDate = $time.add(endDate, timeUnit_1, intervalCount_1);
                                var format = _this.dateFormats.getKey(timeUnit_1);
                                if (_this._markUnitChange && prevGridDate_1) {
                                    if ($time.checkChange(date, prevGridDate_1, _this._nextGridUnit)) {
                                        if (timeUnit_1 !== "year") {
                                            format = _this.periodChangeDateFormats.getKey(timeUnit_1);
                                        }
                                    }
                                }
                                var text_1 = _this.dateFormatter.format(date, format);
                                var dataItem = dataItemsIterator_1.find(function (x) { return x.text === text_1; });
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
     * @param {DateAxisDataItem} dataItem Data item
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
            dataItem.position = position;
            var tick = dataItem.tick;
            if (tick) {
                renderer.updateTickElement(tick, position, endPosition);
            }
            var grid = dataItem.grid;
            if (grid) {
                renderer.updateGridElement(grid, position, endPosition);
            }
            var fill = dataItem.axisFill;
            if (fill) {
                renderer.updateFillElement(fill, position, endPosition);
                if (!dataItem.isRange) {
                    this.fillRule(dataItem);
                }
            }
            var mask = dataItem.mask;
            if (mask) {
                renderer.updateFillElement(mask, position, endPosition);
            }
            var label = dataItem.label;
            if (label) {
                //label.invalidate();
                // when count == 1 this means label represents all the period between grid lines. so we center label because of that.
                // we don't do that through label.location because it would reset the setting
                /// and we do not do that to axis ranges
                if (this._gridInterval.count == 1 && this._gridInterval.timeUnit != "week" && !dataItem.isRange) {
                    position = position + (endPosition - position) * label.location;
                    endPosition = position;
                }
                renderer.updateLabelElement(label, position, endPosition);
            }
        }
    };
    Object.defineProperty(DateAxis.prototype, "baseDuration", {
        /**
         * A duration in milliseconds of the `baseInterval`.
         *
         * @return {number} Duration (ms)
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
     * @param  {number}       min  Min timestamp
     * @param  {number}       max  Max timestamp
     * @return {IMinMaxStep}       Adjusted min/max step
     */
    DateAxis.prototype.adjustMinMax = function (min, max) {
        return { min: min, max: max, step: this.baseDuration };
    };
    /**
     * Adjusts the minimum timestamp as per cell start location.
     *
     * @param  {number}  value  Value
     * @return {number}         Adjusted value
     */
    DateAxis.prototype.fixMin = function (value) {
        return value + this.baseDuration * this.startLocation;
    };
    /**
     * Adjusts the maximum timestamp as per cell start location.
     *
     * @param  {number}  value  Value
     * @return {number}         Adjusted value
     */
    DateAxis.prototype.fixMax = function (value) {
        return value + this.baseDuration * this.endLocation;
    };
    /**
     * [chooseInterval description]
     *
     * @ignore Exclude from docs.
     * @todo Description
     * @param  {number}         index      [description]
     * @param  {number}         duration   [description]
     * @param  {number}         gridCount  [description]
     * @return {ITimeInterval}             [description]
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
     * @param  {number}  value  Source value
     * @return {string}         Formatted value
     */
    DateAxis.prototype.formatLabel = function (value) {
        return this.dateFormatter.format(value);
    };
    /**
     * Converts a Date to an asbolute pixel position within Axis.
     *
     * @param  {Date}    date  Date
     * @return {number}        Position (px)
     */
    DateAxis.prototype.dateToPosition = function (date) {
        return this.valueToPosition(date.getTime());
    };
    /**
     * Converts a numeric timestamp or a `Date` to a relative position on axis.
     *
     * @param  {Date | number}  date  Date or a timestamp
     * @return {number}               Relative position
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
     * @param  {Date}  date Date
     * @return {IOrientationPoint} IOrientationPoint
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
     * @param  {number}  value  Value
     * @return {IOrientationPoint}  Orientation point
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
     * @param  {number}  position  Position (px)
     * @return {Date}              Date
     */
    DateAxis.prototype.positionToDate = function (position) {
        return new Date(this.positionToValue(position));
    };
    /**
     * Returns the X coordinate for series' data item's value.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}            key       Data field to get value from
     * @param  {number}            location  Location (0-1)
     * @return {number}                      X coordinate (px)
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
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}            key       Data field to get value from
     * @param  {number}            location  Location (0-1)
     * @return {number}                      Y coordinate (px)
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
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}            key       Data field to get value from
     * @param  {number}            location  Location (0-1)
     * @param  {string}            stackKey  Stack ID
     * @return {number}                      Angle
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
     * @param  {XYSeriesDataItem}  dataItem  [description]
     * @param  {string}            key       [description]
     * @param  {number}            location  [description]
     * @return {number}                      [description]
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
     * @param {XYSeriesDataItem}  dataItem  Data item
     */
    DateAxis.prototype.processSeriesDataItem = function (dataItem) {
        var _this = this;
        // this is used to automatically define baseInterval
        var sameItemTime;
        // actually here we should only get dates of this axis. But it's not likely that the chart will have more than one date axis with different baseInterval.
        // So using this approach would mean we'll have the same baseInterval for all date axes. In case user wants different timeIntervals for different date axes, he can manually set baseInterval
        $object.each(dataItem.dates, function (key, date) {
            //for (let key in dataItem.dates) {
            //let date: Date = dataItem.dates[key];
            var prevSeriesTime = _this._prevSeriesTime.getKey(key);
            var time = date.getTime();
            // need to check time difference betweend dates of the same data item (for example open/close. they also influence minSeriesDifference)
            if ($type.isNumber(sameItemTime)) {
                var difference = Math.abs(time - sameItemTime);
                if (_this._minSeriesDifference > difference) {
                    _this._minSeriesDifference = difference;
                }
            }
            sameItemTime = time;
            var differece = time - prevSeriesTime;
            if (differece > 0) {
                if (_this._minSeriesDifference > differece) {
                    _this._minSeriesDifference = differece;
                }
            }
            _this._prevSeriesTime.setKey(key, time);
        });
    };
    /**
     * [updateAxisBySeries description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    DateAxis.prototype.updateAxisBySeries = function () {
        _super.prototype.updateAxisBySeries.call(this);
        var baseInterval = this.chooseInterval(0, this._minSeriesDifference, 1);
        // handle short months
        if (this._minSeriesDifference >= $time.getDuration("day", 27) && baseInterval.timeUnit == "week") {
            baseInterval.timeUnit = "month";
        }
        // handle daylight saving
        if (this._minSeriesDifference >= $time.getDuration("hour", 23) && baseInterval.timeUnit == "hour") {
            baseInterval.timeUnit = "day";
        }
        baseInterval.count = 1; // good
        this._baseIntervalReal = baseInterval;
        // no need to invalidate
    };
    Object.defineProperty(DateAxis.prototype, "baseInterval", {
        /**
         * @return {ITimeInterval} Base interval
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
         * @param {ITimeInterval} timeInterval base interval
         */
        set: function (timeInterval) {
            this._baseInterval = timeInterval;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateAxis.prototype, "startLocation", {
        /**
         * @return {number} Location (0-1)
         */
        get: function () {
            return this._startLocation;
        },
        /**
         * Axis start location.
         *
         * * 0 - Full first cell is shown.
         * * 0.5 - Half of first cell is shown.
         * * 1 - None of the first cell is visible. (you probably don't want that)
         *
         * @param {number} value Location (0-1)
         */
        set: function (value) {
            if (this._startLocation != value) {
                this._startLocation = value;
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateAxis.prototype, "endLocation", {
        /**
         * @return {number} Location (0-1)
         */
        get: function () {
            return this._endLocation;
        },
        /**
         * Axis end location.
         *
         * * 0 - None of the last cell is shown. (don't do that)
         * * 0.5 - Half of the last cell is shown.
         * * 1 - Full last cell is shown.
         *
         * @param {number} value Location (0-1)
         */
        set: function (value) {
            if (this._endLocation != value) {
                this._endLocation = value;
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateAxis.prototype, "skipEmptyPeriods", {
        /**
         * @return {boolean} Remove empty stretches of time?
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
         * @param {boolean}  value  Remove empty stretches of time?
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
         * @return {string} Date format
         */
        get: function () {
            return this._tooltipDateFormat;
        },
        /**
         * A special date format to apply axis tooltips.
         *
         * Will use same format as for labels, if not set.
         *
         * @param {string}  value  Date format
         */
        set: function (value) {
            if (this._tooltipDateFormat != value) {
                this._tooltipDateFormat = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateAxis.prototype, "markUnitChange", {
        /**
         * @return {boolean} Use different format for period beginning?
         */
        get: function () {
            return this._markUnitChange;
        },
        /**
         * Use `changeDateFormats` to apply different formats to the first label in
         * bigger time unit.
         *
         * @default true
         * @param {boolean}  value  Use different format for period beginning?
         */
        set: function (value) {
            if (this._markUnitChange != value) {
                this._markUnitChange = value;
                this.invalidateData();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns text to show in a tooltip, based on specific relative position within axis.
     *
     * The label will be formatted as per [[DateFormatter]] set for the whole
     * chart, or explicitly for this Axis.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position
     * @return {string}            Label (formatted date)
     */
    DateAxis.prototype.getTooltipText = function (position) {
        var text;
        var date = this.positionToDate(position);
        date = $time.round(date, this.baseInterval.timeUnit, this.baseInterval.count);
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
     * @param  {number}            position Source position
     * @param  {AxisItemLocation}  location  Location in the cell
     * @return {number}            Adjusted position
     */
    DateAxis.prototype.roundPosition = function (position, location) {
        var baseInterval = this.baseInterval;
        var timeUnit = baseInterval.timeUnit;
        var count = baseInterval.count;
        var date = this.positionToDate(position);
        $time.round(date, timeUnit, count);
        if (location > 0) {
            $time.add(date, timeUnit, location);
        }
        if (this.isInBreak(date.getTime())) {
            while (date.getTime() < this.max) {
                $time.add(date, timeUnit, count);
                if (this.isInBreak(date.getTime())) {
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
     * @param  {number}  position  Relative position
     * @return {number}            Cell start relative position
     */
    DateAxis.prototype.getCellStartPosition = function (position) {
        return this.roundPosition(position, 0);
    };
    /**
     * Returns an relative position of the end of the cell (period), that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  position  Relative position
     * @return {number}            Cell end relative position
     */
    DateAxis.prototype.getCellEndPosition = function (position) {
        return this.roundPosition(position, 1);
        //return this.dateToPosition($time.add(this.positionToDate(this.roundPosition(position, 1)), this.baseInterval.timeUnit, this.baseInterval.count));
    };
    /**
     * Returns a Series data item that corresponds to the specific pixel position
     * of the Axis.
     *
     * @param  {XYSeries}          series    Series
     * @param  {number}            position  Position (px)
     * @return {XYSeriesDataItem}            Data item
     */
    DateAxis.prototype.getSeriesDataItem = function (series, position) {
        var value = this.positionToValue(position);
        var date = $time.round(new Date(value), this.baseInterval.timeUnit, this.baseInterval.count);
        var dataItem = series.dataItemsByAxis.getKey(this.uid).getKey(date.getTime().toString());
        // todo:  alternatively we can find closiest here
        if (!dataItem) {
            // to the left
            var leftCount = 0;
            var leftDataItem = void 0;
            var leftDate = new Date(date.getTime());
            while (leftDate.getTime() > this.minZoomed) {
                leftDate = $time.add(leftDate, this.baseInterval.timeUnit, -this.baseInterval.count);
                leftDataItem = series.dataItemsByAxis.getKey(this.uid).getKey(leftDate.getTime().toString());
                if (leftDataItem) {
                    break;
                }
                leftCount++;
            }
            var rightCount = 0;
            var rightDataItem = void 0;
            var rightDate = new Date(date.getTime());
            while (rightDate.getTime() < this.maxZoomed) {
                rightDate = $time.add(rightDate, this.baseInterval.timeUnit, this.baseInterval.count);
                rightDataItem = series.dataItemsByAxis.getKey(this.uid).getKey(rightDate.getTime().toString());
                if (rightDataItem) {
                    break;
                }
                rightCount++;
            }
            if (leftDataItem && !rightDataItem) {
                return leftDataItem;
            }
            else if (!leftDataItem && rightDataItem) {
                return rightDataItem;
            }
            else if (leftDataItem && rightDataItem) {
                if (leftCount < rightCount) {
                    return leftDataItem;
                }
                else {
                    return rightDataItem;
                }
            }
        }
        return dataItem;
    };
    /**
     * Returns a formatted date based on position in axis scale.
     *
     * @param  {number}  position  Relative position on axis (0-1)
     * @return {string}            Position label
     * @todo Better format recognition
     */
    DateAxis.prototype.getPositionLabel = function (position) {
        var date = this.positionToDate(position);
        return this.dateFormatter.format(date, this.getCurrentLabelFormat());
    };
    /**
     * Returns label date format based on currently used time units
     *
     * @return {string}  Format
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
            renderer.labels.template.location = 0.5;
            renderer.baseGrid.disabled = true;
        }
    };
    Object.defineProperty(DateAxis.prototype, "basePoint", {
        /**
         * Coordinates of the actual axis start.
         *
         * @ignore Exclude from docs
         * @return {IPoint} Base point
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
     * @param {Date}     startDate       Start date
     * @param {Date}     endValue        End date
     * @param {boolean}  skipRangeEvent  Do not invoke events
     * @param {boolean}  instantly       Do not play zoom animations
     */
    DateAxis.prototype.zoomToDates = function (startDate, endDate, skipRangeEvent, instantly) {
        startDate = this.dateFormatter.parse(startDate);
        endDate = this.dateFormatter.parse(endDate);
        this.zoomToValues(startDate.getTime(), endDate.getTime(), skipRangeEvent, instantly);
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