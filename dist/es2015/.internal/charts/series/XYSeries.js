/**
 * XY series module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Series, SeriesDataItem } from "./Series";
import { Sprite } from "../../core/Sprite";
import { ValueAxis } from "../axes/ValueAxis";
import { Dictionary } from "../../core/utils/Dictionary";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { CategoryAxis } from "../axes/CategoryAxis";
import { DateAxis } from "../axes/DateAxis";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";
import * as $array from "../../core/utils/Array";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[XYSeries]].
 *
 * @see {@link DataItem}
 */
var XYSeriesDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(XYSeriesDataItem, _super);
    /**
     * Constructor
     */
    function XYSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "XYSeriesDataItem";
        _this.values.valueX = { stack: 0 };
        _this.values.valueY = { stack: 0 };
        _this.values.openValueX = {};
        _this.values.openValueY = {};
        _this.values.dateX = {};
        _this.values.dateY = {};
        _this.values.openDateX = {};
        _this.values.openDateY = {};
        _this.setLocation("dateX", 0.5, 0);
        _this.setLocation("dateY", 0.5, 0);
        _this.setLocation("categoryX", 0.5, 0);
        _this.setLocation("categoryY", 0.5, 0);
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(XYSeriesDataItem.prototype, "valueX", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.valueX.value;
        },
        /**
         * Item's numeric value on X value axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("valueX", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "valueY", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.valueY.value;
        },
        /**
         * Item's numeric value on Y value axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("valueY", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "dateX", {
        /**
         * @return {Date} Date
         */
        get: function () {
            return this.getDate("dateX");
        },
        /**
         * Item's date value on X date-based axis.
         *
         * @param {Date}  date  Date
         */
        set: function (date) {
            this.setDate("dateX", date);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "dateY", {
        /**
         * @return {Date} Date
         */
        get: function () {
            return this.getDate("dateY");
        },
        /**
         * Item's date value on Y date-based axis.
         *
         * @param {Date}  date  Date
         */
        set: function (date) {
            this.setDate("dateY", date);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "categoryX", {
        /**
         * @return {string} Category
         */
        get: function () {
            return this.categories.categoryX;
        },
        /**
         * Item's category on X category axis.
         *
         * @param {string}  category  Category
         */
        set: function (category) {
            this.setCategory("categoryX", category);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "categoryY", {
        /**
         * @return {string} Category
         */
        get: function () {
            return this.categories.categoryY;
        },
        /**
         * Item's category on Y category axis.
         *
         * @param {string}  category  Category
         */
        set: function (category) {
            this.setCategory("categoryY", category);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "openValueX", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.openValueX.value;
        },
        /**
         * Item's open numeric value on X value axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("openValueX", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "openValueY", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.openValueY.value;
        },
        /**
         * Item's open numeric value on Y value axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("openValueY", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "openDateX", {
        /**
         * @return {Date} Date
         */
        get: function () {
            return this.getDate("openDateX");
        },
        /**
         * Item's open date value on X date-based axis.
         *
         * @param {Date}  date  Date
         */
        set: function (date) {
            this.setDate("openDateX", date);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "openDateY", {
        /**
         * @return {Date} Date
         */
        get: function () {
            return this.getDate("openDateY");
        },
        /**
         * Item's open date value on Y date-based axis.
         *
         * @param {Date}  date  Date
         */
        set: function (date) {
            this.setDate("openDateY", date);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "openCategoryX", {
        /**
         * @return {string} Category
         */
        get: function () {
            return this.categories.openCategoryX;
        },
        /**
         * Item's open category on X category axis.
         *
         * @param {string}  category  Category
         */
        set: function (category) {
            this.setProperty("openCategoryX", category);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeriesDataItem.prototype, "openCategoryY", {
        /**
         * @return {string} Category
         */
        get: function () {
            return this.categories.openCategoryY;
        },
        /**
         * Item's open category on Y category axis.
         *
         * @param {string}  category  Category
         */
        set: function (category) {
            this.setProperty("openCategoryY", category);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return smallest value out of all item's value fields.
     *
     * @ignore Exclude from docs
     * @param  {string[]}  fields      Fields to check in
     * @param  {boolean}   working     Include working (temporary) values
     * @param  {number}    stackValue  If item is in a stack, the value item starts as
     * @return {number}                Value
     */
    XYSeriesDataItem.prototype.getMin = function (fields, working, stackValue) {
        var _this = this;
        //if (this.visible) {  // dumped because of non smooth zooming
        var min;
        if (!$type.isNumber(stackValue)) {
            stackValue = 0;
        }
        $array.each(fields, function (field) {
            var value;
            if (working) {
                value = _this.getWorkingValue(field);
            }
            else {
                value = _this.getValue(field);
            }
            value += stackValue;
            if (value < min || !$type.isNumber(min)) {
                min = value;
            }
        });
        return min;
        //}
    };
    /**
     * Return biggest value out of all item's value fields.
     *
     * @ignore Exclude from docs
     * @param  {string[]}  fields      Fields to check in
     * @param  {boolean}   working     Include working (temporary) values
     * @param  {number}    stackValue  If item is in a stack, the value item starts as
     * @return {number}                Value
     */
    XYSeriesDataItem.prototype.getMax = function (fields, working, stackValue) {
        var _this = this;
        //if (this.visible) { // dumped because of non smooth zooming
        var max;
        if (!$type.isNumber(stackValue)) {
            stackValue = 0;
        }
        $array.each(fields, function (field) {
            var value;
            if (working) {
                value = _this.getWorkingValue(field);
            }
            else {
                value = _this.getValue(field);
            }
            value += stackValue;
            if (value > max || !$type.isNumber(max)) {
                max = value;
            }
        });
        return max;
        //}
    };
    return XYSeriesDataItem;
}(SeriesDataItem));
export { XYSeriesDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines Series for [[XYChart]].
 *
 * @see {@link IXYSeriesEvents} for a list of available Events
 * @see {@link IXYSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var XYSeries = /** @class */ (function (_super) {
    tslib_1.__extends(XYSeries, _super);
    /**
     * Constructor
     */
    function XYSeries() {
        var _this = _super.call(this) || this;
        /**
         * X axis the series is attached to.
         *
         * @type {MutableValueDisposer}
         */
        _this._xAxis = new MutableValueDisposer();
        /**
         * Y axis the series is attached to.
         *
         * @type {MutableValueDisposer}
         */
        _this._yAxis = new MutableValueDisposer();
        _this.className = "XYSeries";
        _this.isMeasured = false;
        _this.mainContainer.mask = new Sprite();
        _this.mainContainer.mask.element = _this.paper.add("path");
        _this.stacked = false;
        _this.tooltip.pointerOrientation = "horizontal";
        _this.tooltip.events.on("hidden", function () {
            _this.returnBulletDefaultState();
        });
        _this._disposers.push(_this._xAxis);
        _this._disposers.push(_this._yAxis);
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    XYSeries.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("X/Y Series");
        }
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {XYSeriesDataItem} Data Item
     */
    XYSeries.prototype.createDataItem = function () {
        return new XYSeriesDataItem();
    };
    /**
     * (Re)validates the series' data.
     *
     * @ignore Exclude from docs
     */
    XYSeries.prototype.validateData = function () {
        this.defineFields();
        _super.prototype.validateData.call(this);
        if (!$type.hasValue(this.dataFields[this._xField]) || !$type.hasValue(this.dataFields[this._yField])) {
            throw Error("Data fields for series \"" + (this.name ? this.name : this.uid) + "\" are not properly defined.");
        }
    };
    /**
     * Processes data item.
     *
     * @param {XYSeriesDataItem}  dataItem     Data item
     * @param {Object}            dataContext  Raw data
     * @param {number}            index        Index of the data item
     */
    XYSeries.prototype.processDataItem = function (dataItem, dataContext) {
        try {
            _super.prototype.processDataItem.call(this, dataItem, dataContext);
            dataItem.events.disable();
            this.xAxis.processSeriesDataItem(dataItem);
            this.yAxis.processSeriesDataItem(dataItem);
            dataItem.events.enable();
            this.setInitialWorkingValues(dataItem);
        }
        catch (e) {
            this._chart.raiseCriticalError(e);
        }
    };
    /**
     * Inits data item's working values.
     *
     * @param {this["_dataItem"]}  dataItem  Data item
     * @param {number}             index     Data item's index
     */
    XYSeries.prototype.setInitialWorkingValues = function (dataItem) {
    };
    /**
     * @ignore
     */
    XYSeries.prototype.disposeData = function () {
        _super.prototype.disposeData.call(this);
        if (this.xAxis) {
            var dataItemsX = this.dataItemsByAxis.getKey(this.xAxis.uid);
            if (dataItemsX) {
                dataItemsX.clear();
            }
        }
        if (this.yAxis) {
            var dataItemsY = this.dataItemsByAxis.getKey(this.yAxis.uid);
            if (dataItemsY) {
                dataItemsY.clear();
            }
        }
    };
    /**
     * Sets up which data fields to use for data access.
     */
    XYSeries.prototype.defineFields = function () {
        var xAxis = this.xAxis;
        var yAxis = this.yAxis;
        var xAxisFieldName = xAxis.axisFieldName;
        var xField = (xAxisFieldName + "X");
        var xOpenField = ("open" + $utils.capitalize(xAxisFieldName) + "X");
        var yAxisFieldName = yAxis.axisFieldName;
        var yField = (yAxisFieldName + "Y");
        var yOpenField = ("open" + $utils.capitalize(yAxisFieldName) + "Y");
        this._xField = xField;
        this._yField = yField;
        if (this.dataFields[xOpenField]) {
            this._xOpenField = xOpenField;
        }
        if (this.dataFields[yOpenField]) {
            this._yOpenField = yOpenField;
        }
        if (!this.dataFields[yOpenField] && this.baseAxis == this.yAxis) {
            this._yOpenField = yField;
        }
        if (!this.dataFields[xOpenField] && this.baseAxis == this.xAxis) {
            this._xOpenField = xField;
        }
        if (this.stacked && this.baseAxis == this.xAxis) {
            this._xOpenField = xField;
        }
        if (this.stacked && this.baseAxis == this.yAxis) {
            this._yOpenField = yField;
        }
        if ((this.xAxis instanceof CategoryAxis) && (this.yAxis instanceof CategoryAxis)) {
            if (!this._yOpenField) {
                this._yOpenField = yField;
            }
        }
        this._xValueFields = [];
        this._yValueFields = [];
        this.addValueField(this.xAxis, this._xValueFields, this._xField);
        this.addValueField(this.xAxis, this._xValueFields, this._xOpenField);
        this.addValueField(this.yAxis, this._yValueFields, this._yField);
        this.addValueField(this.yAxis, this._yValueFields, this._yOpenField);
    };
    /**
     * [axis description]
     *
     * @todo Description
     * @param {Axis}        axis    Axis
     * @param {Array<Key>}  fields  Fields (?)
     * @param {Key}         field   Field
     */
    XYSeries.prototype.addValueField = function (axis, fields, field) {
        if (axis instanceof ValueAxis) {
            if ($type.hasValue(this.dataFields[field]) && fields.indexOf(field) == -1) {
                fields.push(field);
            }
        }
    };
    /**
     * Sets category field from the category axis.
     *
     * User might set field for category axis only, but not for series. In such
     * case, we take field value from axis and set it for series.
     *
     * @param {Key}           field  Field
     * @param {CategoryAxis}  axis   Axis
     */
    XYSeries.prototype.setCategoryAxisField = function (field, axis) {
        if (!$type.hasValue(this.dataFields[field])) {
            this.dataFields[field] = axis.dataFields.category;
        }
    };
    /**
     * Sets date field from the date axis.
     *
     * User might set field for category axis only, but not for series. In such
     * case, we take field value from axis and set it for series.
     *
     * @param {Key}       field  Field
     * @param {DateAxis}  axis   Axis
     */
    XYSeries.prototype.setDateAxisField = function (field, axis) {
        if (!$type.hasValue(this.dataFields[field])) {
            this.dataFields[field] = axis.dataFields.date;
        }
    };
    /**
     * Performs after-draw tasks, e.g. creates masks.
     */
    XYSeries.prototype.afterDraw = function () {
        _super.prototype.afterDraw.call(this);
        this.createMask();
    };
    /**
     * Create a mask for the series.
     *
     * @ignore Exclude from docs
     */
    XYSeries.prototype.createMask = function () {
        // this mask from which we cut out ranges. does not work well if ranges overlap.
        if (this.mainContainer.mask) {
            var path_1 = this.getMaskPath();
            // @todo: this approach won't work well on circluar or other non x/y axes
            $iter.each(this.axisRanges.iterator(), function (range) {
                if (range.axisFill.fillPath) {
                    range.axisFill.validate();
                    path_1 += range.axisFill.fillPath;
                }
            });
            this.mainContainer.mask.element.attr({ "d": path_1 });
        }
    };
    /**
     * Returns an SVG path to use as series mask.
     *
     * @return {string} SVG path
     */
    XYSeries.prototype.getMaskPath = function () {
        return $path.rectToPath({
            x: 0,
            y: 0,
            width: this.xAxis.axisLength,
            height: this.yAxis.axisLength
        });
    };
    /**
     * Returns axis data field to use.
     *
     * @param  {Axis}    axis  Axis
     * @return {string}        Field name
     */
    XYSeries.prototype.getAxisField = function (axis) {
        if (axis == this.xAxis) {
            return this.xField;
        }
        if (axis == this.yAxis) {
            return this.yField;
        }
    };
    /**
     * Validates data items.
     *
     * @ignore Exclude from docs
     */
    XYSeries.prototype.validateDataItems = function () {
        // this helps date axis to check which baseInterval we should use
        this.xAxis.updateAxisBySeries();
        this.yAxis.updateAxisBySeries();
        _super.prototype.validateDataItems.call(this);
        this.xAxis.postProcessSeriesDataItems();
        this.yAxis.postProcessSeriesDataItems();
    };
    /**
     * Validates data range.
     *
     * @ignore Exclude from docs
     */
    XYSeries.prototype.validateDataRange = function () {
        if (this.xAxis.dataRangeInvalid) {
            this.xAxis.validateDataRange();
        }
        if (this.yAxis.dataRangeInvalid) {
            this.yAxis.validateDataRange();
        }
        _super.prototype.validateDataRange.call(this);
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    XYSeries.prototype.validate = function () {
        if (this.xAxis.invalid) {
            this.xAxis.validate();
        }
        if (this.yAxis.invalid) {
            this.yAxis.validate();
        }
        this._showBullets = true;
        var minBulletDistance = this.minBulletDistance;
        if ($type.isNumber(minBulletDistance)) {
            if (this.baseAxis.axisLength / (this.endIndex - this.startIndex) < minBulletDistance) {
                this._showBullets = false;
            }
        }
        _super.prototype.validate.call(this);
    };
    Object.defineProperty(XYSeries.prototype, "xAxis", {
        /**
         * @return {Axis} Axis
         */
        get: function () {
            if (!this._xAxis.get()) {
                var axis = this.chart.xAxes.getIndex(0);
                if (!axis) {
                    throw Error("There are no X axes on chart.");
                }
                this.xAxis = axis;
            }
            return this._xAxis.get();
        },
        /**
         * X axis the series is attached to.
         *
         * @param {Axis}  axis  Axis
         */
        set: function (axis) {
            var oldAxis = this._xAxis.get();
            if (oldAxis != axis) {
                if (oldAxis) {
                    this.dataItemsByAxis.removeKey(oldAxis.uid);
                    // TODO why is this here ?
                    this._xAxis.dispose();
                    // temp @todo: why it is not disposed?
                    oldAxis.series.removeValue(this);
                }
                this._xAxis.set(axis, axis.registerSeries(this));
                this.dataItemsByAxis.setKey(axis.uid, new Dictionary());
                this.invalidateData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeries.prototype, "yAxis", {
        /**
         * @return {Axis} Axis
         */
        get: function () {
            if (!this._yAxis.get()) {
                var axis = this.chart.yAxes.getIndex(0);
                if (!axis) {
                    throw Error("There are no Y axes on chart.");
                }
                this.yAxis = axis;
            }
            return this._yAxis.get();
        },
        /**
         * Y axis the series is attached to.
         *
         * @param {Axis}  axis  Axis
         */
        set: function (axis) {
            var oldAxis = this._yAxis.get();
            if (oldAxis != axis) {
                if (oldAxis) {
                    this.dataItemsByAxis.removeKey(oldAxis.uid);
                    // TODO why is this here ?
                    this._yAxis.dispose();
                    // temp @todo: why it is not disposed?
                    oldAxis.series.removeValue(this);
                }
                this._yAxis.set(axis, axis.registerSeries(this));
                this.dataItemsByAxis.setKey(axis.uid, new Dictionary());
                this.invalidateData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeries.prototype, "baseAxis", {
        /**
         * @return {Axis} Axis
         */
        get: function () {
            if (!this._baseAxis) {
                if (this.yAxis instanceof DateAxis) {
                    this._baseAxis = this.yAxis;
                }
                if (this.xAxis instanceof DateAxis) {
                    this._baseAxis = this.xAxis;
                }
                if (this.yAxis instanceof CategoryAxis) {
                    this._baseAxis = this.yAxis;
                }
                if (this.xAxis instanceof CategoryAxis) {
                    this._baseAxis = this.xAxis;
                }
                if (!this._baseAxis) {
                    this._baseAxis = this.xAxis;
                }
            }
            return this._baseAxis;
        },
        /**
         * The main (base) axis.
         *
         * This is the axis that series fills will go to, or grow animations will
         * happen from.
         *
         * @param {Axis}  value  Axis
         */
        set: function (value) {
            this._baseAxis = value;
            this.invalidateDataRange();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Processes values after data items' were added.
     *
     * @ignore Exclude from docs
     * @param {OrderedListTemplate<this["_dataItem"]>}  dataItems  Data items
     */
    XYSeries.prototype.processValues = function (working) {
        // todo: if this is stacked, ensure that series to which this one can be stacked are processed before.
        _super.prototype.processValues.call(this, working);
        var dataItems = this.dataItems;
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        var startIndex = this.startIndex;
        var endIndex = this.endIndex;
        for (var i = startIndex; i < endIndex; i++) {
            var dataItem = dataItems.getIndex(i);
            this.getStackValue(dataItem, working);
            var stackX = dataItem.getValue("valueX", "stack");
            var stackY = dataItem.getValue("valueY", "stack");
            minX = $math.min(dataItem.getMin(this._xValueFields, working, stackX), minX);
            minY = $math.min(dataItem.getMin(this._yValueFields, working, stackY), minY);
            maxX = $math.max(dataItem.getMax(this._xValueFields, working, stackX), maxX);
            maxY = $math.max(dataItem.getMax(this._yValueFields, working, stackY), maxY);
        }
        // this is mainly for value axis to calculate total and perecent.total of each series category
        this.xAxis.processSeriesDataItems();
        this.yAxis.processSeriesDataItems();
        var xAxisId = this.xAxis.uid;
        var yAxisId = this.yAxis.uid;
        if (!working) {
            if (this._tmin.getKey(xAxisId) != minX || this._tmax.getKey(xAxisId) != maxX || this._tmin.getKey(yAxisId) != minY || this._tmax.getKey(yAxisId) != maxY) {
                this._tmin.setKey(xAxisId, minX);
                this._tmax.setKey(xAxisId, maxX);
                this._tmin.setKey(yAxisId, minY);
                this._tmax.setKey(yAxisId, maxY);
                this.dispatchImmediately("extremeschanged");
            }
        }
        if (this._smin.getKey(xAxisId) != minX || this._smax.getKey(xAxisId) != maxX || this._smin.getKey(yAxisId) != minY || this._smax.getKey(yAxisId) != maxY) {
            this._smin.setKey(xAxisId, minX);
            this._smax.setKey(xAxisId, maxX);
            this._smin.setKey(yAxisId, minY);
            this._smax.setKey(yAxisId, maxY);
            if (this.appeared) {
                this.dispatchImmediately("selectionextremeschanged");
            }
        }
    };
    /**
     * Shows series tooltip at specific position.
     *
     * @ignore Exclude from docs
     * @param {number}  xPosition  X
     * @param {number}  yPosition  Y
     */
    XYSeries.prototype.showTooltipAtPosition = function (xPosition, yPosition) {
        var dataItem;
        if (this.visible && !this.isHiding) {
            var xAxis = this._xAxis.get();
            var yAxis = this._yAxis.get();
            if (xAxis == this.baseAxis) {
                dataItem = xAxis.getSeriesDataItem(this, xAxis.toAxisPosition(xPosition));
            }
            if (yAxis == this.baseAxis) {
                dataItem = yAxis.getSeriesDataItem(this, yAxis.toAxisPosition(yPosition));
            }
            this.returnBulletDefaultState(dataItem);
            if (dataItem) {
                this.updateLegendValue(dataItem);
                this.tooltipDataItem = dataItem;
                // todo: add tooltipXField and tooltipYField.
                var tooltipXField = this.tooltipXField;
                var tooltipYField = this.tooltipYField;
                var tooltipPoint = this.getPoint(dataItem, tooltipXField, tooltipYField, dataItem.locations[tooltipXField], dataItem.locations[tooltipYField]);
                if (tooltipPoint) {
                    this.tooltipX = tooltipPoint.x;
                    this.tooltipY = tooltipPoint.y;
                    if (this._prevTooltipDataItem != dataItem) {
                        this.dispatchImmediately("tooltipshownat", {
                            type: "tooltipshownat",
                            target: this,
                            dataItem: dataItem
                        });
                        try {
                            for (var _a = tslib_1.__values(dataItem.bullets), _b = _a.next(); !_b.done; _b = _a.next()) {
                                var a = _b.value;
                                var bullet = a[1];
                                bullet.setState("hover");
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        this._prevTooltipDataItem = dataItem;
                    }
                    if (this.showTooltip()) {
                        return $utils.spritePointToSvg({ x: tooltipPoint.x, y: tooltipPoint.y }, this);
                    }
                    return;
                }
            }
        }
        this.hideTooltip();
        var e_1, _c;
    };
    /**
     * returns default state to bullets when tooltip is shown at some other data item or hidden
     *
     * @ignore Exclude from docs
     */
    XYSeries.prototype.returnBulletDefaultState = function (dataItem) {
        if (this._prevTooltipDataItem && this._prevTooltipDataItem != dataItem) {
            try {
                for (var _a = tslib_1.__values(this._prevTooltipDataItem.bullets), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var a = _b.value;
                    var bullet = a[1];
                    bullet.setState("default");
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        var e_2, _c;
    };
    /**
     * Positions series bullet.
     *
     * @ignore Exclude from docs
     * @param {Bullet}  bullet  Bullet
     */
    XYSeries.prototype.positionBullet = function (bullet) {
        _super.prototype.positionBullet.call(this, bullet);
        var dataItem = bullet.dataItem;
        // use series xField/yField if bullet doesn't have fields set
        var xField = bullet.xField;
        if (!$type.hasValue(xField)) {
            xField = this.xField;
        }
        var yField = bullet.yField;
        if (!$type.hasValue(yField)) {
            yField = this.yField;
        }
        if ((this.xAxis instanceof ValueAxis && !dataItem.hasValue([xField])) || (this.yAxis instanceof ValueAxis && !dataItem.hasValue([yField]))) {
            bullet.visible = false;
        }
        else {
            var bulletLocationX = this.getBulletLocationX(bullet, xField);
            var bulletLocationY = this.getBulletLocationX(bullet, yField);
            var point = this.getPoint(dataItem, xField, yField, bulletLocationX, bulletLocationY);
            if (point) {
                var x = point.x;
                var y = point.y;
                if ($type.isNumber(bullet.locationX) && this.xOpenField != this.xField) {
                    var openX = this.xAxis.getX(dataItem, this.xOpenField);
                    x = x - (x - openX) * bullet.locationX;
                }
                if ($type.isNumber(bullet.locationY) && this.yOpenField != this.yField) {
                    var openY = this.yAxis.getY(dataItem, this.yOpenField);
                    y = y - (y - openY) * bullet.locationY;
                }
                bullet.moveTo({ x: x, y: y });
            }
            else {
                bullet.visible = false;
            }
        }
    };
    /**
    * returns bullet x location
    * @ignore
    */
    XYSeries.prototype.getBulletLocationX = function (bullet, field) {
        var bulletLocation = bullet.locationX;
        var dataItem = bullet.dataItem;
        if (!$type.isNumber(bulletLocation)) {
            bulletLocation = dataItem.workingLocations[field];
        }
        return bulletLocation;
    };
    /**
    * returns bullet x location
    * @ignore
    */
    XYSeries.prototype.getBulletLocationY = function (bullet, field) {
        var bulletLocation = bullet.locationY;
        var dataItem = bullet.dataItem;
        if (!$type.isNumber(bulletLocation)) {
            bulletLocation = dataItem.workingLocations[field];
        }
        return bulletLocation;
    };
    Object.defineProperty(XYSeries.prototype, "stacked", {
        /**
         * @return {boolean} Can be stacked?
         */
        get: function () {
            return this.getPropertyValue("stacked");
        },
        /**
         * Can items from this series be included into stacks?
         *
         * @default false
         * @param {boolean}  stacked  Can be stacked?
         */
        set: function (stacked) {
            this.setPropertyValue("stacked", stacked, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Shows hidden series.
     *
     * @param  {number}     duration  Duration of reveal animation (ms)
     * @return {Animation}            Animation
     */
    XYSeries.prototype.show = function (duration) {
        var _this = this;
        var animation = _super.prototype.show.call(this, duration);
        var fields;
        if (this.xAxis instanceof ValueAxis && this.xAxis != this.baseAxis) {
            fields = this._xValueFields;
        }
        if (this.yAxis instanceof ValueAxis && this.yAxis != this.baseAxis) {
            fields = this._yValueFields;
        }
        var startIndex = this.startIndex;
        var endIndex = this.endIndex;
        $iter.each($iter.indexed(this.dataItems.iterator()), function (a) {
            var interpolationDuration = _this.interpolationDuration;
            if ($type.isNumber(duration)) {
                interpolationDuration = duration;
            }
            var i = a[0];
            var dataItem = a[1];
            var delay = 0;
            if (_this.sequencedInterpolation) {
                delay = _this.sequencedInterpolationDelay * i + interpolationDuration * (i - startIndex) / (endIndex - startIndex);
            }
            animation = dataItem.show(interpolationDuration, delay, fields);
        });
        return animation;
    };
    /**
     * Hides series.
     *
     * @param  {number}     duration  Duration of hiding animation (ms)
     * @return {Animation}            Animation
     */
    XYSeries.prototype.hide = function (duration) {
        var _this = this;
        var animation = _super.prototype.hide.call(this, duration);
        var fields;
        var value;
        var xAxis = this.xAxis;
        if (xAxis instanceof ValueAxis && xAxis != this.baseAxis) {
            fields = this._xValueFields;
            // animate to zero if 0 is within zoomMin/zoomMax
            if (this.stacked || (xAxis.minZoomed < 0 && xAxis.maxZoomed > 0)) {
                value = 0;
            }
            else {
                value = xAxis.min;
            }
        }
        var yAxis = this.yAxis;
        if (yAxis instanceof ValueAxis && yAxis != this.baseAxis) {
            fields = this._yValueFields;
            // animate to zero if 0 is within zoomMin/zoomMax
            if (this.stacked || (yAxis.minZoomed < 0 && yAxis.maxZoomed > 0)) {
                value = 0;
            }
            else {
                value = yAxis.min;
            }
        }
        //if ($type.hasValue(fields)) {
        var startIndex = this.startIndex;
        var endIndex = this.endIndex;
        $iter.each($iter.indexed(this.dataItems.iterator()), function (a) {
            var i = a[0];
            var dataItem = a[1];
            var delay = 0;
            var interpolationDuration = _this.interpolationDuration;
            if ($type.isNumber(duration)) {
                interpolationDuration = duration;
            }
            if (animation && !animation.isDisposed() && interpolationDuration == 0 && animation.duration > 0) {
                animation.events.once("animationended", function () {
                    dataItem.hide(0, 0, value, fields);
                });
            }
            else {
                if (_this.sequencedInterpolation) {
                    delay = _this.sequencedInterpolationDelay * i + interpolationDuration * (i - startIndex) / (endIndex - startIndex);
                }
                dataItem.hide(interpolationDuration, delay, value, fields);
            }
        });
        //}
        return animation;
    };
    /**
     * Updates series appearance when working value changes.
     */
    XYSeries.prototype.handleDataItemWorkingValueChange = function (event) {
        _super.prototype.handleDataItemWorkingValueChange.call(this, event);
        // to calculate stack values
        var axisSeries = this.baseAxis.series;
        $iter.each(axisSeries.iterator(), function (series) {
            if (series.stacked) {
                series.invalidateProcessedData();
            }
        });
    };
    /**
     * [getStackValue description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    XYSeries.prototype.getStackValue = function (dataItem, working) {
        // todo: here wer stack x and y values only. question is - what should we do with other values, like openX, openY?
        // if this series is not stacked or new stack begins, return.
        var _this = this;
        if (!this.stacked) {
            return;
        }
        else {
            // it might seem that it's better to go through base axis series, but we do not maintain the same order as in chart.series there.
            var chart = this.chart;
            var index = chart.series.indexOf(this);
            var field_1;
            if (this.xAxis != this.baseAxis && this.xAxis instanceof ValueAxis) {
                field_1 = this.xField;
            }
            if (this.yAxis != this.baseAxis && this.yAxis instanceof ValueAxis) {
                field_1 = this.yField;
            }
            //this is good for removing series, otherwise stack values will remain the same and chart won't pay atention when adding/removing series
            dataItem.setCalculatedValue(field_1, 0, "stack");
            $iter.eachContinue(chart.series.range(0, index).backwards().iterator(), function (prevSeries) {
                // stacking is only possible if both axes are the same
                if (prevSeries.xAxis == _this.xAxis && prevSeries.yAxis == _this.yAxis) {
                    // saving value
                    prevSeries.stackedSeries = _this;
                    var prevDataItem = prevSeries.dataItems.getIndex(dataItem.index); // indexes should match
                    if (prevDataItem.hasValue(_this._xValueFields) && prevDataItem.hasValue(_this._yValueFields)) {
                        var value = dataItem.getValue(field_1);
                        var prevValue = void 0;
                        if (working) {
                            prevValue = prevDataItem.getWorkingValue(field_1) + prevDataItem.getValue(field_1, "stack");
                        }
                        else {
                            prevValue = prevDataItem.getValue(field_1) + prevDataItem.getValue(field_1, "stack");
                        }
                        if ((value >= 0 && prevValue >= 0) || (value < 0 && prevValue < 0)) {
                            //dataItem.events.disable();
                            dataItem.setCalculatedValue(field_1, prevValue, "stack");
                            //dataItem.events.enable();
                            return false;
                        }
                    }
                    else if (!prevSeries.stacked) {
                        return false;
                    }
                }
                return true;
            });
        }
    };
    Object.defineProperty(XYSeries.prototype, "xField", {
        /**
         * [xField description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @return {string} [description]
         */
        get: function () {
            return this._xField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeries.prototype, "yField", {
        /**
         * [yField description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @return {string} [description]
         */
        get: function () {
            return this._yField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeries.prototype, "xOpenField", {
        /**
         * [xOpenField description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @return {string} [description]
         */
        get: function () {
            return this._xOpenField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeries.prototype, "yOpenField", {
        /**
         * [yOpenField description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @return {string} [description]
         */
        get: function () {
            return this._yOpenField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeries.prototype, "tooltipXField", {
        /**
         * @ignore Exclude from docs
         * @todo Description
         * @return {string} [description]
         */
        get: function () {
            if (this._tooltipXField) {
                return this._tooltipXField;
            }
            return this._xField;
        },
        /**
         * [tooltipXField description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @param {string} value [description]
         */
        set: function (value) {
            this._tooltipXField = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYSeries.prototype, "tooltipYField", {
        /**
         * @ignore Exclude from docs
         * @todo Description
         * @return {string} [description]
         */
        get: function () {
            if (this._tooltipYField) {
                return this._tooltipYField;
            }
            return this._yField;
        },
        /**
         * [tooltipYField description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @param {string} value [description]
         */
        set: function (value) {
            this._tooltipYField = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns lowest value in the series for the specific axis.
     *
     * @ignore Exclude from docs
     * @param  {ValueAxis}  axis  Axis
     * @return {number}           value
     */
    XYSeries.prototype.min = function (axis) {
        return this._tmin.getKey(axis.uid);
    };
    /**
     * Returns highest value in the series for the specific axis.
     *
     * @ignore Exclude from docs
     * @param  {ValueAxis}  axis  Axis
     * @return {number}           value
     */
    XYSeries.prototype.max = function (axis) {
        return this._tmax.getKey(axis.uid);
    };
    /**
     * Returns lowest value in the series for the specific axis within current
     * selection.
     *
     * @ignore Exclude from docs
     * @param  {ValueAxis}  axis  Axis
     * @return {number}           value
     */
    XYSeries.prototype.selectionMin = function (axis) {
        var value = this._smin.getKey(axis.uid);
        if (!$type.isNumber(value)) {
            value = this.min(axis);
        }
        return value;
    };
    /**
     * Returns highest value in the series for the specific axis within current
     * selection.
     *
     * @ignore Exclude from docs
     * @param  {ValueAxis}  axis  Axis
     * @return {number}           value
     */
    XYSeries.prototype.selectionMax = function (axis) {
        var value = this._smax.getKey(axis.uid);
        if (!$type.isNumber(value)) {
            value = this.max(axis);
        }
        return value;
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    XYSeries.prototype.processConfig = function (config) {
        if (config) {
            // Set up axes
            if ($type.hasValue(config.xAxis) && $type.isString(config.xAxis) && this.map.hasKey(config.xAxis)) {
                config.xAxis = this.map.getKey(config.xAxis);
            }
            if ($type.hasValue(config.yAxis) && $type.isString(config.yAxis) && this.map.hasKey(config.yAxis)) {
                config.yAxis = this.map.getKey(config.yAxis);
            }
            // Set up axis ranges
            if ($type.hasValue(config.axisRanges) && $type.isArray(config.axisRanges)) {
                for (var i = 0, len = config.axisRanges.length; i < len; i++) {
                    var range = config.axisRanges[i];
                    if (!$type.hasValue(range.type)) {
                        range.type = "AxisDataItem";
                    }
                    if ($type.hasValue(range.axis) && $type.isString(range.axis) && this.map.hasKey(range.axis)) {
                        range.component = this.map.getKey(range.axis);
                    }
                    else if ($type.hasValue(range.component) && $type.isString(range.component) && this.map.hasKey(range.component)) {
                        range.component = this.map.getKey(range.component);
                    }
                }
            }
            // Parse date fields based on the series fields
            if (!$type.hasValue(config.dataFields) || !$type.isObject(config.dataFields)) {
                throw Error("`dataFields` is not set for series [" + this.name + "]");
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    /**
     * [getPoint description]
     *
     * @todo Description
     * @param {XYSeriesDataItem}  dataItem   [description]
     * @param {string}          xKey       [description]
     * @param {string}          yKey       [description]
     * @param {number}          locationX  [description]
     * @param {number}          locationY  [description]
     * @param {string}          stackKeyX  [description]
     * @param {string}          stackKeyY  [description]
     */
    XYSeries.prototype.getPoint = function (dataItem, xKey, yKey, locationX, locationY, stackKeyX, stackKeyY) {
        var x = this.xAxis.getX(dataItem, xKey, locationX);
        var y = this.yAxis.getY(dataItem, yKey, locationY);
        x = $math.fitToRange(x, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        y = $math.fitToRange(y, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        return { x: x, y: y };
    };
    return XYSeries;
}(Series));
export { XYSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYSeries"] = XYSeries;
registry.registeredClasses["XYSeriesDataItem"] = XYSeriesDataItem;
//# sourceMappingURL=XYSeries.js.map