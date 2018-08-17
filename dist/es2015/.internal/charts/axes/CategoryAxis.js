/**
 * Category axis module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Axis, AxisDataItem } from "./Axis";
import { registry } from "../../core/Registry";
import { Dictionary } from "../../core/utils/Dictionary";
import { CategoryAxisBreak } from "./CategoryAxisBreak";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[CategoryAxis]].
 *
 * @see {@link DataItem}
 */
var CategoryAxisDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(CategoryAxisDataItem, _super);
    /**
     * Constructor
     */
    function CategoryAxisDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "CategoryAxisDataItem";
        _this.text = "{category}";
        _this.locations.category = 0;
        _this.locations.endCategory = 1;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(CategoryAxisDataItem.prototype, "category", {
        /**
         * @return {string} Category
         */
        get: function () {
            return this.properties["category"];
        },
        /**
         * Category.
         *
         * @param {string}  value  Category
         */
        set: function (value) {
            this.setProperty("category", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisDataItem.prototype, "endCategory", {
        /**
         * @return {string} End category
         */
        get: function () {
            return this.properties["endCategory"];
        },
        /**
         * End category.
         *
         * Used for items that span several categories, like [[CategoryAxisBreak]].
         *
         * @param {string}  value  End category
         */
        set: function (value) {
            this.setProperty("endCategory", value);
        },
        enumerable: true,
        configurable: true
    });
    return CategoryAxisDataItem;
}(AxisDataItem));
export { CategoryAxisDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to create a category-based axis for the chart.
 *
 * ```TypeScript
 * // Create the axis
 * let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 *
 * // Set settings
 * xAxis.title.text = "Clients";
 * ```
 * ```JavaScript
 * // Create the axis
 * var valueAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 *
 * // Set settings
 * valueAxis.title.text = "Clients";
 * ```
 * ```JSON
 * "xAxes": [{
 *   "type": "CategoryAxis",
 *   "title": {
 *     "text": "Clients"
 *   }
 * }]
 * ```
 *
 * @see {@link ICategoryAxisEvents} for a list of available Events
 * @see {@link ICategoryAxisAdapters} for a list of available Adapters
 * @important
 */
var CategoryAxis = /** @class */ (function (_super) {
    tslib_1.__extends(CategoryAxis, _super);
    /**
     * Constructor
     */
    function CategoryAxis() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * A collection that holds Axis' data items sorted by each category.
         *
         * @type {Dictionary}
         */
        _this.dataItemsByCategory = new Dictionary();
        _this.className = "CategoryAxis";
        // Set field name
        _this.axisFieldName = "category";
        _this._lastDataItem = _this.createDataItem();
        _this._lastDataItem.component = _this;
        _this._disposers.push(_this._lastDataItem);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty [[DataItem]] of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {CategoryAxisDataItem} Data Item
     */
    CategoryAxis.prototype.createDataItem = function () {
        return new CategoryAxisDataItem();
    };
    /**
     * Returns a new/empty [[AxisBreak]] of the appropriate type.
     *
     * @return {CategoryAxisBreak} Axis break
     */
    CategoryAxis.prototype.createAxisBreak = function () {
        return new CategoryAxisBreak();
    };
    /**
     * Validates the data range.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    CategoryAxis.prototype.validateDataRange = function () {
        var _this = this;
        var dataCount = this.dataItems.length;
        var startIndex = $math.fitToRange(Math.floor(this.start * dataCount - 1), 0, dataCount);
        var endIndex = $math.fitToRange(Math.ceil(this.end * dataCount), 0, dataCount);
        if (this.renderer.invalid) {
            this.renderer.validate();
        }
        // find frequency at which we'll show items
        var maxCount = this.renderer.axisLength / this.renderer.minGridDistance;
        var frequency = Math.min(this.dataItems.length, Math.ceil((endIndex - startIndex) / maxCount));
        this._startIndex = Math.floor(startIndex / frequency) * frequency;
        this._endIndex = Math.ceil(this.end * dataCount);
        this.fixAxisBreaks();
        if (this._startIndex == this._endIndex) {
            this._endIndex++;
        }
        this._frequency = frequency;
        _super.prototype.validateDataRange.call(this);
        $iter.each(this._series.iterator(), function (series) {
            if ((series.xAxis instanceof CategoryAxis) && (series.yAxis instanceof CategoryAxis)) {
                series.invalidateDataRange();
            }
            else {
                series.start = _this.start;
                series.end = _this.end;
                // range might not change, but axis breaks might.
                if (_this.axisBreaks.length > 0) {
                    series.invalidateDataRange();
                }
            }
        });
    };
    /**
     * Validates the whole axis. Causes it to redraw.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    CategoryAxis.prototype.validate = function () {
        var _this = this;
        _super.prototype.validate.call(this);
        if (this.axisLength <= 0) {
            return;
        }
        this.maxZoomFactor = this.dataItems.length;
        if (this.dataItems.length <= 0) {
            this.maxZoomFactor = 1;
        }
        this.resetIterators();
        // it's important to use protected variables here, as getters will return 0 - length
        // TODO use iterator instead
        // @ todo: not solved cat axis item fading
        var startIndex = $math.max(0, this._startIndex - this._frequency);
        var endIndex = $math.min(this.dataItems.length, this._endIndex + this._frequency);
        var itemIndex = 0;
        for (var i = 0; i < startIndex; i++) {
            var dataItem = this.dataItems.getIndex(i);
            dataItem.__disabled = true;
        }
        for (var i = endIndex; i < this.dataItems.length; i++) {
            var dataItem = this.dataItems.getIndex(i);
            dataItem.__disabled = true;
        }
        for (var i = startIndex; i < endIndex; i++) {
            if (i < this.dataItems.length) {
                var dataItem = this.dataItems.getIndex(i);
                if (i / this._frequency == Math.round(i / this._frequency)) {
                    var axisBreak = this.isInBreak(i);
                    if (!axisBreak) {
                        this.appendDataItem(dataItem);
                        this.validateDataElement(dataItem, itemIndex);
                    }
                    itemIndex++;
                }
                else {
                    //previously we disabled all before, but this is better for cpu
                    this.validateDataElement(dataItem, itemIndex); // helps to solve shrinking
                    dataItem.__disabled = true;
                }
            }
        }
        this.appendDataItem(this._lastDataItem);
        this.validateDataElement(this._lastDataItem, itemIndex + 1, this.dataItems.length);
        var axisBreaks = this.axisBreaks;
        $iter.each(axisBreaks.iterator(), function (axisBreak) {
            var adjustedStartValue = axisBreak.adjustedStartValue;
            var adjustedEndValue = axisBreak.adjustedEndValue;
            if ($math.intersect({ start: adjustedStartValue, end: adjustedEndValue }, { start: _this._startIndex, end: _this._endIndex })) {
                var frequency = $math.fitToRange(Math.ceil(_this._frequency / axisBreak.breakSize), 1, adjustedEndValue - adjustedStartValue);
                var itemIndex_1 = 0;
                // TODO use iterator instead
                for (var b = adjustedStartValue; b <= adjustedEndValue; b = b + frequency) {
                    var dataItem = _this.dataItems.getIndex(b);
                    _this.appendDataItem(dataItem);
                    _this.validateDataElement(dataItem, itemIndex_1);
                    itemIndex_1++;
                }
            }
        });
    };
    /**
     * [validateDataElement description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {CategoryAxisDataItem}  dataItem   [description]
     * @param {number}                itemIndex  [description]
     */
    CategoryAxis.prototype.validateDataElement = function (dataItem, itemIndex, index) {
        _super.prototype.validateDataElement.call(this, dataItem);
        dataItem.__disabled = false;
        var renderer = this.renderer;
        if (!$type.isNumber(index)) {
            index = this.categoryToIndex(dataItem.category);
        }
        var endIndex = this.categoryToIndex(dataItem.endCategory);
        if (!$type.isNumber(endIndex)) {
            endIndex = index;
        }
        var position = this.indexToPosition(index, dataItem.locations.category);
        var endPosition = this.indexToPosition(endIndex, dataItem.locations.endCategory);
        dataItem.position = position;
        var fillEndIndex;
        var fillPosition;
        var fillEndPosition;
        if (dataItem.isRange) {
            fillEndIndex = endIndex;
            fillPosition = this.indexToPosition(index, dataItem.locations.category);
            fillEndPosition = this.indexToPosition(fillEndIndex, dataItem.locations.endCategory);
        }
        else {
            fillEndIndex = index + this._frequency;
            fillPosition = this.indexToPosition(index, dataItem.axisFill.location);
            fillEndPosition = this.indexToPosition(fillEndIndex, dataItem.axisFill.location);
        }
        dataItem.point = renderer.positionToPoint(position);
        var tick = dataItem.tick;
        if (tick) {
            renderer.updateTickElement(tick, position, endPosition);
        }
        var grid = dataItem.grid;
        if (grid) {
            renderer.updateGridElement(grid, position, endPosition);
        }
        var label = dataItem.label;
        if (label) {
            dataItem.text = dataItem.text; //@todo if this is left, kills custom data item text. this.adapter.apply("label", dataItem.category);
            renderer.updateLabelElement(label, position, endPosition);
        }
        var fill = dataItem.axisFill;
        if (fill) {
            renderer.updateFillElement(fill, fillPosition, fillEndPosition);
            if (!dataItem.isRange) {
                this.fillRule(dataItem, itemIndex);
            }
        }
        var mask = dataItem.mask;
        if (mask) {
            renderer.updateFillElement(mask, fillPosition, fillEndPosition);
        }
    };
    /**
     * Processes the axis data item.
     *
     * @ignore Exclude from docs
     * @param {CategoryAxisDataItem}  dataItem     Data item
     * @param {Object}                dataContext  The raw data that corresponds to this data item
     */
    CategoryAxis.prototype.processDataItem = function (dataItem, dataContext) {
        // creat a collection for fast access
        _super.prototype.processDataItem.call(this, dataItem, dataContext);
        // check if such category already exists
        var existingDataItem = this.dataItemsByCategory.getKey(dataItem.category);
        if (existingDataItem != dataItem) {
            this.dataItems.remove(existingDataItem);
        }
        this.dataItemsByCategory.setKey(dataItem.category, dataItem);
    };
    /**
     * Converts a category index to an actual screen coordinate on the axis.
     *
     * `location` identifies relative location within category. 0 - beginning,
     * 0.5 - middle, 1 - end, and anything inbetween.
     *
     * @param  {number}                     index     Index
     * @param  {AxisItemLocation | number}  location  Location (0-1)
     * @return {number}                               Position (px)
     */
    CategoryAxis.prototype.indexToPosition = function (index, location) {
        if (!$type.isNumber(location)) {
            location = 0.5;
        }
        var startIndex = this.startIndex;
        var endIndex = this.endIndex;
        var difference = this.adjustDifference(startIndex, endIndex);
        var cellStartLocation = this.renderer.cellStartLocation;
        var cellEndLocation = this.renderer.cellEndLocation;
        difference -= cellStartLocation;
        difference -= (1 - cellEndLocation);
        var axisBreaks = this.axisBreaks;
        $iter.eachContinue(axisBreaks.iterator(), function (axisBreak) {
            var breakStartIndex = axisBreak.adjustedStartValue;
            var breakEndIndex = axisBreak.adjustedEndValue;
            if (index < startIndex) {
                return false;
            }
            if ($math.intersect({ start: breakStartIndex, end: breakEndIndex }, { start: startIndex, end: endIndex })) {
                breakStartIndex = Math.max(startIndex, breakStartIndex);
                breakEndIndex = Math.min(endIndex, breakEndIndex);
                var breakSize = axisBreak.breakSize;
                // value to the right of break end
                if (index > breakEndIndex) {
                    startIndex += (breakEndIndex - breakStartIndex) * (1 - breakSize);
                }
                // value to the left of break start
                else if (index < breakStartIndex) {
                }
                // value within break
                else {
                    index = breakStartIndex + (index - breakStartIndex) * breakSize;
                }
            }
            return true;
        });
        return $math.round((index + location - cellStartLocation - startIndex) / difference, 5);
    };
    /**
     * Converts a string category name to relative position on axis.
     *
     * `location` identifies relative location within category. 0 - beginning,
     * 0.5 - middle, 1 - end, and anything inbetween.
     *
     * @param  {string}            category  Category name
     * @param  {AxisItemLocation}  location  Location (0-1)
     * @return {number}                      Position
     */
    CategoryAxis.prototype.categoryToPosition = function (category, location) {
        var index = this.categoryToIndex(category);
        return this.indexToPosition(index, location);
    };
    /**
     * Converts a string category name to a orientation point (x, y, angle) on axis
     *
     * `location` identifies relative location within category. 0 - beginning,
     * 0.5 - middle, 1 - end, and anything inbetween.
     * @param  {string}            category  Category name
     * @param  {AxisItemLocation}  location  Location (0-1)
     * @return {IOrientationPoint}  Orientation point
     */
    CategoryAxis.prototype.categoryToPoint = function (category, location) {
        var position = this.categoryToPosition(category, location);
        var point = this.renderer.positionToPoint(position);
        var angle = this.renderer.positionToAngle(position);
        return { x: point.x, y: point.y, angle: angle };
    };
    /**
     * Converts a string category name to a orientation point (x, y, angle) on axis
     *
     * `location` identifies relative location within category. 0 - beginning,
     * 0.5 - middle, 1 - end, and anything inbetween.
     * @param  {string}            category  Category name
     * @param  {AxisItemLocation}  location  Location (0-1)
     * @return {IOrientationPoint}  Orientation point
     */
    CategoryAxis.prototype.anyToPoint = function (category, location) {
        return this.categoryToPoint(category, location);
    };
    /**
     * Converts a string category name to relative position on axis.
     *
     * An alias to `categoryToPosition()`.
     *
     * @param  {string}            category  Category name
     * @param  {AxisItemLocation}  location  Location (0-1)
     * @return {number}                      Relative position
     */
    CategoryAxis.prototype.anyToPosition = function (category, location) {
        return this.categoryToPosition(category, location);
    };
    /**
     * Converts named category to an index of data item it corresponds to.
     *
     * @param  {string}  category  Category
     * @return {number}            Data item index
     */
    CategoryAxis.prototype.categoryToIndex = function (category) {
        var dataItem = this.dataItemsByCategory.getKey(category);
        if (dataItem) {
            return dataItem.index;
        }
    };
    /**
     * Zooms the axis to specific named ctaegories.
     *
     * @param {string}  startCategory  Start category
     * @param {string}  endCategory    End category
     */
    CategoryAxis.prototype.zoomToCategories = function (startCategory, endCategory) {
        this.zoomToIndexes(this.categoryToIndex(startCategory), this.categoryToIndex(endCategory) + 1);
    };
    /**
     * [getAnyRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {string}           start         [description]
     * @param  {string}           end           [description]
     * @param  {AxisItemLocation} startLocation [description]
     * @param  {AxisItemLocation} endLocation   [description]
     * @return {string}                         [description]
     */
    CategoryAxis.prototype.getAnyRangePath = function (start, end, startLocation, endLocation) {
        var startPos = this.categoryToPosition(start, startLocation);
        var endPos = this.categoryToPosition(end, endLocation);
        return this.getPositionRangePath(startPos, endPos); // Base class (Axis) gets range shape from AxisRenderer
    };
    /**
     * Takes an absolute position (px) within axis and adjust it to a specific
     * `location` within category it corresponds to.
     *
     * @param  {number}            position  Source position (px)
     * @param  {AxisItemLocation}  location  Location within category (0-1)
     * @return {number}                      Adjusted position (px)
     */
    CategoryAxis.prototype.roundPosition = function (position, location) {
        var index = this.positionToIndex(position);
        return this.indexToPosition(index, location);
    };
    /**
     * Returns a data item from Series that corresponds to a specific absolute
     * position on the Axis.
     *
     * @param  {XYSeries}          series    Target series
     * @param  {number}            position  Position (px)
     * @return {XYSeriesDataItem}            Series data item
     */
    CategoryAxis.prototype.getSeriesDataItem = function (series, position) {
        return series.dataItems.getIndex(this.positionToIndex(position));
    };
    /**
     * Returns the X coordinate for series' data item.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {SeriesDataItem}  dataItem  Data item
     * @param  {string}          key       Category
     * @param  {number}          location  Location (0-1)
     * @return {number}                    X coordinate (px)
     */
    CategoryAxis.prototype.getX = function (dataItem, key, location) {
        var position;
        if ($type.hasValue(key)) {
            position = this.categoryToPosition(dataItem.categories[key], location);
        }
        if ($type.isNaN(position)) {
            return this.basePoint.x;
        }
        else {
            return this.renderer.positionToPoint(position).x;
        }
    };
    /**
     * Returns the Y coordinate for series' data item.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {SeriesDataItem}  dataItem  Data item
     * @param  {string}          key       Category
     * @param  {number}          location  Location (0-1)
     * @return {number}                    Y coordinate (px)
     */
    CategoryAxis.prototype.getY = function (dataItem, key, location) {
        var position;
        if ($type.hasValue(key)) {
            position = this.categoryToPosition(dataItem.categories[key], location);
        }
        if ($type.isNaN(position)) {
            return this.basePoint.y;
        }
        else {
            return this.renderer.positionToPoint(position).y;
        }
    };
    /**
     * Returns an angle for series data item.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}            key       Category
     * @param  {number}            location  Location (0-1)
     * @param  {string}            stackKey  Stack key (?)
     * @return {number}                      Angle
     */
    CategoryAxis.prototype.getAngle = function (dataItem, key, location, stackKey) {
        return this.positionToAngle(this.categoryToPosition(dataItem.categories[key], location));
    };
    /**
     * Returns an absolute pixel coordinate of the start of the cell (category),
     * that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  position  Position (px)
     * @return {number}            Cell start position (px)
     */
    CategoryAxis.prototype.getCellStartPosition = function (position) {
        return this.roundPosition(position, 0);
    };
    /**
     * Returns an absolute pixel coordinate of the end of the cell (category),
     * that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  position  Position (px)
     * @return {number}            Cell end position (px)
     */
    CategoryAxis.prototype.getCellEndPosition = function (position) {
        return this.roundPosition(position, 1);
    };
    /**
     * Returns text to show in a category tooltip, based on specific position
     * within axis.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position (px)
     * @return {string}            Label (category)
     */
    CategoryAxis.prototype.getTooltipText = function (position) {
        var dataItem = this.dataItems.getIndex(this.positionToIndex(position));
        if (dataItem) {
            return this.adapter.apply("getTooltipText", dataItem.category);
        }
    };
    /**
     * Returns an index of the category that corresponds to specific pixel
     * position within axis.
     *
     * @param  {number}  position  Position (px)
     * @return {number}            Category index
     */
    CategoryAxis.prototype.positionToIndex = function (position) {
        position = $math.round(position, 10);
        var startIndex = this.startIndex;
        var endIndex = this.endIndex;
        var difference = endIndex - startIndex;
        var axisBreaks = this.axisBreaks;
        var index = null;
        // in case we have some axis breaks
        $iter.eachContinue(axisBreaks.iterator(), function (axisBreak) {
            var breakStartPosition = axisBreak.startPosition;
            var breakEndPosition = axisBreak.endPosition;
            var breakStartIndex = axisBreak.adjustedStartValue;
            var breakEndIndex = axisBreak.adjustedEndValue;
            breakStartIndex = $math.max(breakStartIndex, startIndex);
            breakEndIndex = $math.min(breakEndIndex, endIndex);
            var breakSize = axisBreak.breakSize;
            difference -= (breakEndIndex - breakStartIndex) * (1 - breakSize);
            // position to the right of break end
            if (position > breakEndPosition) {
                startIndex += (breakEndIndex - breakStartIndex) * (1 - breakSize);
            }
            // position to the left of break start
            else if (position < breakStartPosition) {
            }
            // value within break
            else {
                var breakPosition = (position - breakStartPosition) / (breakEndPosition - breakStartPosition);
                index = breakStartIndex + Math.round(breakPosition * (breakEndIndex - breakStartIndex));
                return false;
            }
            return true;
        });
        if (!$type.isNumber(index)) {
            index = Math.floor(position * difference + startIndex);
        }
        if (index >= endIndex) {
            index--;
        }
        return index;
    };
    /**
     * Returns category based on position.
     *
     * @param  {number}  position  Relative position on axis (0-1)
     * @return {string}            Position label
     */
    CategoryAxis.prototype.getPositionLabel = function (position) {
        var dataItem = this.dataItems.getIndex(this.positionToIndex(position));
        if (dataItem) { // @martynas todo: added this check, but this means that some aria label might not be received?
            return dataItem.category;
        }
    };
    Object.defineProperty(CategoryAxis.prototype, "basePoint", {
        /**
         * Coordinates of the actual axis start.
         *
         * @ignore Exclude from docs
         * @return {IPoint} Base point
         */
        get: function () {
            // This makes base grid to be drawn at the end of the axis and adds extra
            // grid which we need to nicely close the chart.
            return this.renderer.positionToPoint(1);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initializes Axis' renderer.
     *
     * @ignore Exclude from docs
     */
    CategoryAxis.prototype.initRenderer = function () {
        _super.prototype.initRenderer.call(this);
        var renderer = this.renderer;
        renderer.baseGrid.disabled = true;
    };
    return CategoryAxis;
}(Axis));
export { CategoryAxis };
/**
 * Register class, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CategoryAxis"] = CategoryAxis;
registry.registeredClasses["CategoryAxisDataItem"] = CategoryAxisDataItem;
//# sourceMappingURL=CategoryAxis.js.map