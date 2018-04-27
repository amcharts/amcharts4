/**
 * @license
 * Copyright (c) 2018 amCharts (Antanas Marcelionis, Martynas Majeris)
 *
 * This sofware is provided under multiple licenses. Please see below for
 * links to appropriate usage.
 *
 * Free amCharts linkware license. Details and conditions:
 * https://github.com/amcharts/amcharts4/blob/master/LICENSE
 *
 * One of the amCharts commercial licenses. Details and pricing:
 * https://www.amcharts.com/online-store/
 * https://www.amcharts.com/online-store/licenses-explained/
 *
 * If in doubt, contact amCharts at contact@amcharts.com
 *
 * PLEASE DO NOT REMOVE THIS COPYRIGHT NOTICE.
 * @hidden
 */
 
webpackJsonp([4],{

/***/ 101:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Column; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_RoundedRectangle__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Percent__ = __webpack_require__(10);
/**
 * Module that defines everything related to building Columns.
 * It is a container which has column element which is a RoundedRectangle.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates Columns.
 *
 * @see {@link IColumnEvents} for a list of available events
 * @see {@link IColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    /**
     * Constructor
     */
    function Column() {
        var _this = _super.call(this) || this;
        _this.className = "Column";
        _this.width = Object(__WEBPACK_IMPORTED_MODULE_3__core_utils_Percent__["c" /* percent */])(80);
        _this.height = Object(__WEBPACK_IMPORTED_MODULE_3__core_utils_Percent__["c" /* percent */])(80);
        _this.isMeasured = false;
        _this.applyOnClones = true;
        _this.strokeOpacity = 1;
        _this.createAssets();
        return _this;
    }
    Column.prototype.createAssets = function () {
        this.column = this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_RoundedRectangle__["a" /* RoundedRectangle */]);
        this.column.shouldClone = false;
        this.column.cornerRadius(0, 0, 0, 0);
    };
    Column.prototype.validate = function () {
        _super.prototype.validate.call(this);
        if (this.column) {
            this.column.width = this.pixelWidth;
            this.column.height = this.pixelHeight;
        }
    };
    Column.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.column) {
            this.column.copyFrom(source.column);
        }
    };
    return Column;
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["Column"] = Column;
//# sourceMappingURL=Column.js.map

/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return XYSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return XYSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Series__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sprite__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__axes_ValueAxis__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Dictionary__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Disposer__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__axes_CategoryAxis__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__axes_DateAxis__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__core_utils_Type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__core_utils_Array__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__core_rendering_Path__ = __webpack_require__(12);
/**
 * XY series module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */














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
    __extends(XYSeriesDataItem, _super);
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](stackValue)) {
            stackValue = 0;
        }
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Array__["b" /* each */](fields, function (field) {
            var value;
            if (working) {
                value = _this.getWorkingValue(field);
            }
            else {
                value = _this.getValue(field);
            }
            value += stackValue;
            if (value < min || !__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](min)) {
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](stackValue)) {
            stackValue = 0;
        }
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Array__["b" /* each */](fields, function (field) {
            var value;
            if (working) {
                value = _this.getWorkingValue(field);
            }
            else {
                value = _this.getValue(field);
            }
            value += stackValue;
            if (value > max || !__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](max)) {
                max = value;
            }
        });
        return max;
        //}
    };
    return XYSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__Series__["b" /* SeriesDataItem */]));

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
    __extends(XYSeries, _super);
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
        _this._xAxis = new __WEBPACK_IMPORTED_MODULE_4__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        /**
         * Y axis the series is attached to.
         *
         * @type {MutableValueDisposer}
         */
        _this._yAxis = new __WEBPACK_IMPORTED_MODULE_4__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "XYSeries";
        _this.isMeasured = false;
        _this.mainContainer.mask = new __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["a" /* Sprite */]();
        _this.mainContainer.mask.element = _this.paper.add("path");
        _this.stacked = false;
        _this.newStack = false;
        _this.tooltip.pointerOrientation = "horizontal";
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    XYSeries.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](this.readerTitle)) {
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](this.dataFields[this._xField]) || !__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](this.dataFields[this._yField])) {
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
    XYSeries.prototype.processDataItem = function (dataItem, dataContext, index) {
        try {
            _super.prototype.processDataItem.call(this, dataItem, dataContext, index);
            dataItem.events.disable();
            this.xAxis.processSeriesDataItem(dataItem);
            this.yAxis.processSeriesDataItem(dataItem);
            dataItem.events.enable();
        }
        catch (e) {
            this._chart.raiseCriticalError(e);
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
        var xOpenField = ("open" + __WEBPACK_IMPORTED_MODULE_10__core_utils_Utils__["capitalize"](xAxisFieldName) + "X");
        var yAxisFieldName = yAxis.axisFieldName;
        var yField = (yAxisFieldName + "Y");
        var yOpenField = ("open" + __WEBPACK_IMPORTED_MODULE_10__core_utils_Utils__["capitalize"](yAxisFieldName) + "Y");
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
        if (!this.dataFields[this._xOpenField] && this.baseAxis == this.xAxis) {
            this._xOpenField = xField;
        }
        if (this.stacked && this.baseAxis == this.xAxis) {
            this._xOpenField = xField;
        }
        if (this.stacked && this.baseAxis == this.yAxis) {
            this._yOpenField = yField;
        }
        if ((this.xAxis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_CategoryAxis__["a" /* CategoryAxis */]) && (this.yAxis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_CategoryAxis__["a" /* CategoryAxis */])) {
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
        if (axis instanceof __WEBPACK_IMPORTED_MODULE_2__axes_ValueAxis__["a" /* ValueAxis */]) {
            if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](this.dataFields[field]) && fields.indexOf(field) == -1) {
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](this.dataFields[field])) {
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](this.dataFields[field])) {
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
        var path = this.getMaskPath();
        // @todo: this approach won't work well on circluar or other non x/y axes
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](this.axisRanges.iterator(), function (range) {
            if (range.axisFill.fillPath) {
                range.axisFill.validate();
                path += range.axisFill.fillPath;
            }
        });
        this.mainContainer.mask.element.attr({ "d": path });
    };
    /**
     * Returns an SVG path to use as series mask.
     *
     * @return {string} SVG path
     */
    XYSeries.prototype.getMaskPath = function () {
        return __WEBPACK_IMPORTED_MODULE_13__core_rendering_Path__["rectToPath"]({
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
        this.updateLegendValue();
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
        if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](minBulletDistance)) {
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
                    this._xAxis.dispose();
                    // temp @todo: why it is not disposed?
                    oldAxis.series.removeValue(this);
                }
                this._xAxis.set(axis, axis.registerSeries(this));
                this.dataItemsByAxis.setKey(axis.uid, new __WEBPACK_IMPORTED_MODULE_3__core_utils_Dictionary__["a" /* Dictionary */]());
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
                    this._yAxis.dispose();
                    // temp @todo: why it is not disposed?
                    oldAxis.series.removeValue(this);
                }
                this._yAxis.set(axis, axis.registerSeries(this));
                this.dataItemsByAxis.setKey(axis.uid, new __WEBPACK_IMPORTED_MODULE_3__core_utils_Dictionary__["a" /* Dictionary */]());
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
                if (this.yAxis instanceof __WEBPACK_IMPORTED_MODULE_6__axes_DateAxis__["a" /* DateAxis */]) {
                    this._baseAxis = this.yAxis;
                }
                if (this.xAxis instanceof __WEBPACK_IMPORTED_MODULE_6__axes_DateAxis__["a" /* DateAxis */]) {
                    this._baseAxis = this.xAxis;
                }
                if (this.yAxis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_CategoryAxis__["a" /* CategoryAxis */]) {
                    this._baseAxis = this.yAxis;
                }
                if (this.xAxis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_CategoryAxis__["a" /* CategoryAxis */]) {
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
            this.getStackValue(dataItem);
            var stackX = dataItem.getValue("valueX", "stack");
            var stackY = dataItem.getValue("valueY", "stack");
            minX = __WEBPACK_IMPORTED_MODULE_9__core_utils_Math__["min"](dataItem.getMin(this._xValueFields, working, stackX), minX);
            minY = __WEBPACK_IMPORTED_MODULE_9__core_utils_Math__["min"](dataItem.getMin(this._yValueFields, working, stackY), minY);
            maxX = __WEBPACK_IMPORTED_MODULE_9__core_utils_Math__["max"](dataItem.getMax(this._xValueFields, working, stackX), maxX);
            maxY = __WEBPACK_IMPORTED_MODULE_9__core_utils_Math__["max"](dataItem.getMax(this._yValueFields, working, stackY), maxY);
        }
        // this is mainly for value axis to calculate total and perecen.total of each series category
        this.xAxis.processSeriesDataItems();
        this.yAxis.processSeriesDataItems();
        var xAxisId = this.xAxis.uid;
        var yAxisId = this.yAxis.uid;
        if (this._smin.getKey(xAxisId) != minX || this._smax.getKey(xAxisId) != maxX || this._smin.getKey(yAxisId) != minY || this._smax.getKey(yAxisId) != maxY) {
            this._smin.setKey(xAxisId, minX);
            this._smax.setKey(xAxisId, maxX);
            this._smin.setKey(yAxisId, minY);
            this._smax.setKey(yAxisId, maxY);
            if (this.appeared) {
                this.dispatchImmediately("selectionextremeschanged");
            }
        }
        if (!working) {
            if (this._tmin.getKey(xAxisId) != minX || this._tmax.getKey(xAxisId) != maxX || this._tmin.getKey(yAxisId) != minY || this._tmax.getKey(yAxisId) != maxY) {
                this._tmin.setKey(xAxisId, minX);
                this._tmax.setKey(xAxisId, maxX);
                this._tmin.setKey(yAxisId, minY);
                this._tmax.setKey(yAxisId, maxY);
                this.dispatchImmediately("extremeschanged");
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
                    }
                    if (this.showTooltip()) {
                        return __WEBPACK_IMPORTED_MODULE_10__core_utils_Utils__["spritePointToSvg"]({ x: tooltipPoint.x, y: tooltipPoint.y }, this);
                    }
                    return;
                }
            }
        }
        this.hideTooltip();
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](xField)) {
            xField = this.xField;
        }
        var yField = bullet.yField;
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](yField)) {
            yField = this.yField;
        }
        if ((this.xAxis instanceof __WEBPACK_IMPORTED_MODULE_2__axes_ValueAxis__["a" /* ValueAxis */] && !dataItem.hasValue([xField])) || (this.yAxis instanceof __WEBPACK_IMPORTED_MODULE_2__axes_ValueAxis__["a" /* ValueAxis */] && !dataItem.hasValue([yField]))) {
            bullet.visible = false;
        }
        else {
            var bulletLocationX = this.getBulletLocationX(bullet, xField);
            var bulletLocationY = this.getBulletLocationX(bullet, yField);
            var point = this.getPoint(dataItem, xField, yField, bulletLocationX, bulletLocationY);
            if (point) {
                var x = point.x;
                var y = point.y;
                if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](bullet.locationX) && this.xOpenField != this.xField) {
                    var openX = this.xAxis.getX(dataItem, this.xOpenField);
                    x = x - (x - openX) * bullet.locationX;
                }
                if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](bullet.locationY) && this.yOpenField != this.yField) {
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](bulletLocation)) {
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](bulletLocation)) {
            bulletLocation = dataItem.workingLocations[field];
        }
        return bulletLocation;
    };
    Object.defineProperty(XYSeries.prototype, "newStack", {
        /**
         * @return {boolean} Start new stack?
         */
        get: function () {
            return this.getPropertyValue("newStack");
        },
        /**
         * Should this series start a new stack?
         *
         * @default false
         * @param {boolean}  value  Start new stack?
         */
        set: function (value) {
            this.setPropertyValue("newStack", value, true);
        },
        enumerable: true,
        configurable: true
    });
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](duration) && animation) {
            duration = animation.duration;
        }
        var fields;
        if (this.xAxis instanceof __WEBPACK_IMPORTED_MODULE_2__axes_ValueAxis__["a" /* ValueAxis */] && this.xAxis != this.baseAxis) {
            fields = this._xValueFields;
        }
        if (this.yAxis instanceof __WEBPACK_IMPORTED_MODULE_2__axes_ValueAxis__["a" /* ValueAxis */] && this.yAxis != this.baseAxis) {
            fields = this._yValueFields;
        }
        var startIndex = this.startIndex;
        var endIndex = this.endIndex;
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](__WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["indexed"](this.dataItems.iterator()), function (a) {
            var i = a[0];
            var dataItem = a[1];
            var delay = 0;
            if (_this.sequencedInterpolation) {
                delay = _this.sequencedInterpolationDelay * i + duration * (i - startIndex) / (endIndex - startIndex);
            }
            /*let realDuration: number = duration;
            // to avoid animation of non visible items
            if (i < startIndex || i > endIndex) {
                realDuration = 0;
            }*/
            animation = dataItem.show(duration, delay, fields);
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](duration) && animation) {
            duration = animation.duration;
        }
        var fields;
        var value;
        var xAxis = this.xAxis;
        if (xAxis instanceof __WEBPACK_IMPORTED_MODULE_2__axes_ValueAxis__["a" /* ValueAxis */] && xAxis != this.baseAxis) {
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
        if (yAxis instanceof __WEBPACK_IMPORTED_MODULE_2__axes_ValueAxis__["a" /* ValueAxis */] && yAxis != this.baseAxis) {
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
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](__WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["indexed"](this.dataItems.iterator()), function (a) {
            var i = a[0];
            var dataItem = a[1];
            var delay = 0;
            if (_this.sequencedInterpolation) {
                delay = _this.sequencedInterpolationDelay * i + duration * (i - startIndex) / (endIndex - startIndex);
            }
            var realDuration = duration;
            // to avoid animation of non visible items
            if (i < startIndex || i > endIndex) {
                realDuration = 0;
            }
            dataItem.hide(realDuration, delay, value, fields);
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
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](axisSeries.iterator(), function (series) {
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
    XYSeries.prototype.getStackValue = function (dataItem) {
        var _this = this;
        // todo: here wer stack x and y values only. question is - what should we do with other values, like openX, openY?
        // if this series is not stacked or new stack begins, return.
        if (!this.stacked || this.newStack) {
            return;
        }
        else {
            // it might seem that it's better to go through base axis series, but we do not maintain the same order as in chart.series there.
            var chart = this.chart;
            var index = chart.series.indexOf(this);
            var field_1;
            if (this.xAxis != this.baseAxis && this.xAxis instanceof __WEBPACK_IMPORTED_MODULE_2__axes_ValueAxis__["a" /* ValueAxis */]) {
                field_1 = this.xField;
            }
            if (this.yAxis != this.baseAxis && this.yAxis instanceof __WEBPACK_IMPORTED_MODULE_2__axes_ValueAxis__["a" /* ValueAxis */]) {
                field_1 = this.yField;
            }
            __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["eachContinue"](chart.series.range(0, index).backwards().iterator(), function (prevSeries) {
                // stacking is only possible if both axes are the same
                if (prevSeries.xAxis == _this.xAxis && prevSeries.yAxis == _this.yAxis) {
                    // saving value
                    prevSeries.stackedSeries = _this;
                    var prevDataItem = prevSeries.dataItems.getIndex(dataItem.index); // indexes should match
                    if (prevDataItem.hasValue(_this._xValueFields) && prevDataItem.hasValue(_this._yValueFields)) {
                        var value = dataItem.getValue(field_1);
                        var prevValue = prevDataItem.getWorkingValue(field_1) + prevDataItem.getValue(field_1, "stack");
                        if ((value >= 0 && prevValue >= 0) || (value < 0 && prevValue < 0)) {
                            //dataItem.events.disable();
                            dataItem.setCalculatedValue(field_1, prevValue, "stack");
                            //dataItem.events.enable();
                            return false;
                        }
                    }
                    else if (prevSeries.newStack || !prevSeries.stacked) {
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](value)) {
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
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](value)) {
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
            if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](config.xAxis) && __WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isString"](config.xAxis) && this.map.hasKey(config.xAxis)) {
                config.xAxis = this.map.getKey(config.xAxis);
            }
            if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](config.yAxis) && __WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isString"](config.yAxis) && this.map.hasKey(config.yAxis)) {
                config.yAxis = this.map.getKey(config.yAxis);
            }
            // Set up axis ranges
            if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](config.axisRanges) && __WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isArray"](config.axisRanges)) {
                for (var i = 0, len = config.axisRanges.length; i < len; i++) {
                    var range = config.axisRanges[i];
                    if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](range.type)) {
                        range.type = "AxisDataItem";
                    }
                    if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](range.axis) && __WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isString"](range.axis) && this.map.hasKey(range.axis)) {
                        range.component = this.map.getKey(range.axis);
                    }
                    else if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](range.component) && __WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isString"](range.component) && this.map.hasKey(range.component)) {
                        range.component = this.map.getKey(range.component);
                    }
                }
            }
            // Parse date fields based on the series fields
            if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](config.dataFields) || !__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isObject"](config.dataFields)) {
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
        x = __WEBPACK_IMPORTED_MODULE_9__core_utils_Math__["fitToRange"](x, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        y = __WEBPACK_IMPORTED_MODULE_9__core_utils_Math__["fitToRange"](y, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        return { x: x, y: y };
    };
    return XYSeries;
}(__WEBPACK_IMPORTED_MODULE_0__Series__["a" /* Series */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["b" /* registry */].registeredClasses["XYSeries"] = XYSeries;
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["b" /* registry */].registeredClasses["XYSeriesDataItem"] = XYSeriesDataItem;
//# sourceMappingURL=XYSeries.js.map

/***/ }),

/***/ 142:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisLabelCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisLabel__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(2);
/**
 * Axis Label module
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Use to create labels on circular axis.
 *
 * @see {@link IAxisLabelCircularEvents} for a list of available events
 * @see {@link IAxisLabelCircularAdapters} for a list of available Adapters
 */
var AxisLabelCircular = /** @class */ (function (_super) {
    __extends(AxisLabelCircular, _super);
    /**
     * Constructor
     */
    function AxisLabelCircular() {
        var _this = _super.call(this) || this;
        _this.className = "AxisLabelCircular";
        _this.padding(0, 0, 0, 0);
        _this.location = 0.5;
        _this.radius = 0;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(AxisLabelCircular.prototype, "relativeRotation", {
        /**
         * Returns current relative rotation.
         *
         * @return {number} Rotation angle
         */
        get: function () {
            return this.getPropertyValue("relativeRotation");
        },
        /**
         * Sets relative rotation of the label.
         *
         * It is an angle to circle. In case 90, labels will be positioned like rays
         * of light, if 0 - positione along the circle.
         *
         * @param {number} value Rotation angle
         */
        set: function (value) {
            this.setPropertyValue("relativeRotation", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisLabelCircular.prototype, "radius", {
        /**
         * Returns current setting for label distance.
         *
         * @return {number} Distance (px)
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Sets distance from axis circle to label in pixels.
         *
         * @param {number} value Distance (px)
         */
        set: function (value) {
            // No percent here, as it would be quite complicated to calculate radius
            // of a chart together with axis label radius
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [fixPoint description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {IPoint}  point       Label affixation point
     * @param  {number}  axisRadius  Distance from point (px)
     * @return {IPoint}              [description]
     */
    AxisLabelCircular.prototype.fixPoint = function (point, axisRadius) {
        var angle = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["DEGREES"] * Math.atan2(point.y, point.x);
        if (this.invalid) {
            this.validate(); //@todo" check if we need this
        }
        var sign = 1;
        if (this.inside) {
            sign = -1;
        }
        var relativeRotation = this.relativeRotation;
        // we don't use valign for labels because then they would jump while animating. instead we modify dy depending on a y position
        // this math makes dy to be 1 at the top of the circle, 0.5 at the middle and 1 at the bottom
        // @todo with this math doesn't work well with inside = true
        this.dy = -this.measuredHeight * (1 - (point.y + axisRadius) / (2 * axisRadius));
        // simmilar with dx
        this.dx = -this.measuredWidth * (1 - (point.x + axisRadius) / (2 * axisRadius));
        var labelRadius = this.radius * sign;
        if (__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](relativeRotation)) {
            this.rotation = relativeRotation + angle + 90;
            var pixelWidth = this._bbox.width;
            var pixelHeight = this._bbox.height;
            var dH = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](relativeRotation) / 2;
            var dW = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](relativeRotation) / 2;
            var rotation = this.rotation;
            this.dx = pixelHeight * dH * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](rotation) - pixelWidth * dW * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](rotation);
            this.dy = -pixelHeight * dH * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](rotation) - pixelWidth * dW * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](rotation);
            var pixelPaddingBottom = this.pixelPaddingBottom;
            var pixelPaddingTop = this.pixelPaddingTop;
            var pixelPaddingLeft = this.pixelPaddingLeft;
            var pixelPaddingRight = this.pixelPaddingRight;
            if (!this.inside) {
                labelRadius += (pixelHeight + pixelPaddingBottom + pixelPaddingTop) * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](relativeRotation) + (pixelWidth + pixelPaddingLeft + pixelPaddingRight) * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](relativeRotation);
            }
            else {
                labelRadius -= (pixelPaddingBottom + pixelPaddingTop) * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](relativeRotation) + (pixelPaddingLeft + pixelPaddingRight) * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](relativeRotation);
            }
        }
        point.x += __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](angle) * labelRadius;
        point.y += __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](angle) * labelRadius;
        return point;
    };
    return AxisLabelCircular;
}(__WEBPACK_IMPORTED_MODULE_0__AxisLabel__["a" /* AxisLabel */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["AxisLabelCircular"] = AxisLabelCircular;
//# sourceMappingURL=AxisLabelCircular.js.map

/***/ }),

/***/ 160:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DateAxisDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DateAxis; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ValueAxis__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Axis__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Dictionary__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__DateAxisBreak__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_utils_Object__ = __webpack_require__(20);
/**
 * DateAxis module
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */











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
    __extends(DateAxisDataItem, _super);
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
    Object.defineProperty(DateAxisDataItem.prototype, "startDate", {
        /**
         * @return {Date} Date
         */
        get: function () {
            return this.dates["date"];
        },
        /**
         * Start date.
         *
         * Used for items that span several dates, like [[DateAxisBreak]].
         *
         * @param {Date} date Start date
         */
        set: function (date) {
            this.date = date;
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
}(__WEBPACK_IMPORTED_MODULE_0__ValueAxis__["b" /* ValueAxisDataItem */]));

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
    __extends(DateAxis, _super);
    /**
     * Constructor
     */
    function DateAxis() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * [gridIntervals description]
         *
         * @todo Description
         * @type {List<ITimeInterval>}
         */
        _this.gridIntervals = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["b" /* List */]();
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
        _this.dateFormats = new __WEBPACK_IMPORTED_MODULE_3__core_utils_Dictionary__["a" /* Dictionary */]();
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
        _this.periodChangeDateFormats = new __WEBPACK_IMPORTED_MODULE_3__core_utils_Dictionary__["a" /* Dictionary */]();
        /**
         * Use `periodChangeDateFormats` to apply different formats to the first
         * label in bigger time unit.
         *
         * @type {boolean}
         */
        _this._markUnitChange = true;
        /**
         * Make labels for the first label in bigger time unit bold.
         *
         * @type {boolean}
         */
        _this._boldUnitChange = true;
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
        _this._prevSeriesTime = new __WEBPACK_IMPORTED_MODULE_3__core_utils_Dictionary__["a" /* Dictionary */]();
        /**
         * [_minSeriesDifference description]
         *
         * @todo Description
         * @type {number}
         */
        _this._minSeriesDifference = Number.MAX_VALUE;
        /**
         * A function which applies fills to alternating cells.
         *
         * @todo Description
         * @type {function}
         */
        _this.fillRule = function (dataItem) {
            var value = dataItem.value;
            var axis = dataItem.component;
            var gridInterval = axis._gridInterval;
            var gridDuration = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["getDuration"](gridInterval.timeUnit, gridInterval.count);
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
        // @todo: will this be visible in docs?
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
        return new __WEBPACK_IMPORTED_MODULE_4__DateAxisBreak__["a" /* DateAxisBreak */]();
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
        if (__WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["getDuration"](gridInterval.timeUnit, gridInterval.count) < this.baseDuration) {
            gridInterval = __assign({}, this.baseInterval);
        }
        this._gridInterval = gridInterval;
        this._gridDate = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["round"](new Date(this.min), gridInterval.timeUnit);
        this._nextGridUnit = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["getNextUnit"](gridInterval.timeUnit);
        // the following is needed to avoid grid flickering while scrolling
        this._intervalDuration = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["getDuration"](gridInterval.timeUnit, gridInterval.count);
        var count = Math.ceil(this._difference / this._intervalDuration);
        count = Math.floor(this.start * count) - 3; // some extra is needed
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["add"](this._gridDate, gridInterval.timeUnit, count * gridInterval.count);
        // tell series start/end
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
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
        if (!__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](this.baseInterval.count)) {
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
            this._minSeriesDifference = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["getDuration"]("day");
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
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](series.dataItems.iterator(), function (dataItem) {
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
        __WEBPACK_IMPORTED_MODULE_10__core_utils_Object__["each"](dataItem.dates, function (key) {
            //for (let key in dataItem.dates) {
            var date = dataItem.getDate(key);
            var startDate = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["round"](__WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["copy"](date), baseInterval.timeUnit, baseInterval.count);
            var endDate = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["add"](__WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["copy"](startDate), baseInterval.timeUnit, baseInterval.count);
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
        if (this.skipEmptyPeriods && __WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](this.min) && __WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](this.max)) {
            var timeUnit = this.baseInterval.timeUnit;
            var count = this.baseInterval.count;
            this.axisBreaks.clear(); // TODO: what about breaks added by user?
            var date = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["round"](new Date(this.min), timeUnit, count);
            var axisBreak = void 0;
            var _loop_1 = function () {
                __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["add"](date, timeUnit, count);
                var startTime = date.getTime();
                var startTimeStr = startTime.toString();
                var hasData = __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["contains"](this_1.series.iterator(), function (series) {
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
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](axisBreaks.iterator(), function (axisBreak) {
            var breakGridCount = _this._gridCount * (Math.min(_this.end, axisBreak.endPosition) - Math.max(_this.start, axisBreak.startPosition)) / (_this.end - _this.start);
            axisBreak.gridInterval = _this.chooseInterval(0, axisBreak.adjustedEndValue - axisBreak.adjustedStartValue, breakGridCount);
            axisBreak.gridDate = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["round"](new Date(axisBreak.adjustedStartValue), axisBreak.gridInterval.timeUnit);
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
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["round"](date, timeUnit);
        var prevTimestamp = date.getTime();
        var newDate = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["copy"](date);
        // modify date by adding intervalcount
        var timestamp = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["add"](newDate, timeUnit, intervalCount).getTime();
        // if it's axis break, get first rounded date which is not in a break
        var axisBreak = this.isInBreak(timestamp);
        if (axisBreak) {
            newDate = this.getBreaklessDate(axisBreak, this.baseInterval.timeUnit, this.baseInterval.count);
            timestamp = newDate.getTime();
        }
        // get duration between grid lines with break duration removed
        var durationBreaksRemoved = this.adjustDifference(prevTimestamp, timestamp);
        // calculate how many time units fit to this duration
        var countBreaksRemoved = Math.round(durationBreaksRemoved / __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["getDuration"](timeUnit));
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
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["round"](date, timeUnit, count);
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["add"](date, timeUnit, count);
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
        if (__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](this.max) && __WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](this.min)) {
            // first regular items
            var timestamp = this._gridDate.getTime();
            var timeUnit = this._gridInterval.timeUnit;
            var intervalCount = this._gridInterval.count;
            var prevGridDate = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["copy"](this._gridDate);
            var dataItemsIterator_1 = this._dataItemsIterator;
            this.resetIterators();
            var _loop_2 = function () {
                var date = this_2.getGridDate(new Date(prevGridDate), intervalCount);
                timestamp = date.getTime();
                var endDate = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["copy"](date); // you might think it's easier to add intervalduration to timestamp, however it won't work for months or years which are not of the same length
                endDate = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["add"](endDate, timeUnit, intervalCount);
                var format = this_2.dateFormats.getKey(timeUnit);
                if (this_2._markUnitChange && prevGridDate) {
                    if (__WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["checkChange"](date, prevGridDate, this_2._nextGridUnit)) {
                        if (timeUnit !== "year") {
                            format = this_2.periodChangeDateFormats.getKey(timeUnit);
                        }
                    }
                }
                var text = this_2.dateFormatter.format(date, format);
                var dataItem = dataItemsIterator_1.find(function (x) { return x.text === text; });
                //let dataItem = dataItemsIterator.getFirst();
                dataItem.__disabled = false;
                //dataItem.visible = true;
                this_2.processDataItem(dataItem);
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
            __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](this.axisBreaks.iterator(), function (axisBreak) {
                if (axisBreak.breakSize > 0) {
                    var timeUnit_1 = axisBreak.gridInterval.timeUnit;
                    var intervalCount_1 = axisBreak.gridInterval.count;
                    // only add grid if gap is bigger then minGridDistance
                    if (__WEBPACK_IMPORTED_MODULE_9__core_utils_Math__["getDistance"](axisBreak.startPoint, axisBreak.endPoint) > renderer_1.minGridDistance) {
                        var timestamp_1 = axisBreak.gridDate.getTime();
                        var prevGridDate_1;
                        var count = 0;
                        var _loop_3 = function () {
                            var date = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["copy"](axisBreak.gridDate);
                            timestamp_1 = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["add"](date, timeUnit_1, intervalCount_1 * count).getTime();
                            count++;
                            if (timestamp_1 > axisBreak.adjustedStartValue && timestamp_1 < axisBreak.adjustedEndValue) {
                                var endDate = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["copy"](date); // you might think it's easier to add intervalduration to timestamp, however it won't work for months or years which are not of the same length
                                endDate = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["add"](endDate, timeUnit_1, intervalCount_1);
                                var format = _this.dateFormats.getKey(timeUnit_1);
                                if (_this._markUnitChange && prevGridDate_1) {
                                    if (__WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["checkChange"](date, prevGridDate_1, _this._nextGridUnit)) {
                                        if (timeUnit_1 !== "year") {
                                            format = _this.periodChangeDateFormats.getKey(timeUnit_1);
                                        }
                                    }
                                }
                                var text_1 = _this.dateFormatter.format(date, format);
                                var dataItem = dataItemsIterator_1.find(function (x) { return x.text === text_1; });
                                _this.processDataItem(dataItem);
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
        if (__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](this.max) && __WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](this.min)) {
            var renderer = this.renderer;
            var timestamp = dataItem.value;
            var endTimestamp = dataItem.endValue;
            if (!__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](endTimestamp)) {
                endTimestamp = timestamp;
            }
            var position = this.valueToPosition(timestamp);
            var endPosition = this.valueToPosition(endTimestamp);
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
                    position = position + (endPosition - position) / 2;
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
            return __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["getDuration"](this.baseInterval.timeUnit, this.baseInterval.count);
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
        var intervalDuration = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["getDuration"](gridInterval.timeUnit, gridInterval.count);
        var lastIndex = gridIntervals.length - 1;
        if (index >= lastIndex) {
            return __assign({}, gridIntervals.getIndex(lastIndex));
        }
        var count = Math.ceil(duration / intervalDuration);
        if (duration < intervalDuration && index > 0) {
            return __assign({}, gridIntervals.getIndex(index - 1));
        }
        if (count <= gridCount) {
            return __assign({}, gridIntervals.getIndex(index));
        }
        else {
            if (index + 1 < gridIntervals.length) {
                return this.chooseInterval(index + 1, duration, gridCount);
            }
            else {
                return __assign({}, gridIntervals.getIndex(index));
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
        if (!__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](value)) {
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
        if (!__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](value)) {
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
        if (!__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](value)) {
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
        if (!__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](location)) {
            location = dataItem.workingLocations[key];
            if (!__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](location)) {
                location = 0;
            }
        }
        var startTime = dataItem.values[key]["open"];
        var endTime = dataItem.values[key]["close"];
        if (__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](startTime) && __WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](endTime)) {
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
        __WEBPACK_IMPORTED_MODULE_10__core_utils_Object__["each"](dataItem.dates, function (key, date) {
            //for (let key in dataItem.dates) {
            //let date: Date = dataItem.dates[key];
            var prevSeriesTime = _this._prevSeriesTime.getKey(key);
            var time = date.getTime();
            // need to check time difference betweend dates of the same data item (for example open/close. they also influence minSeriesDifference)
            if (__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNumber"](sameItemTime)) {
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
        if (this._minSeriesDifference >= __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["getDuration"]("day", 27) && baseInterval.timeUnit == "week") {
            baseInterval.timeUnit = "month";
        }
        // handle daylight saving
        if (this._minSeriesDifference >= __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["getDuration"]("hour", 23) && baseInterval.timeUnit == "hour") {
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
    Object.defineProperty(DateAxis.prototype, "boldUnitChange", {
        /**
         * @return {boolean} Use bold for period beginning?
         */
        get: function () {
            return this._boldUnitChange;
        },
        /**
         * Make labels for the first label in bigger time unit bold.
         *
         * @default true
         * @param {boolean}  value  Use bold for period beginning?
         */
        set: function (value) {
            if (this._boldUnitChange != value) {
                this._boldUnitChange = value;
                this.invalidateData();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns text to show in a tooltip, based on specific position within axis.
     *
     * The label will be formatted as per [[DateFormatter]] set for the whole
     * chart, or explicitly for this Axis.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position (px)
     * @return {string}            Label (formatted date)
     */
    DateAxis.prototype.getTooltipText = function (position) {
        var text;
        if (__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["hasValue"](this.tooltipDateFormat)) {
            text = this.dateFormatter.format(this.positionToDate(position), this.tooltipDateFormat);
        }
        else {
            text = this.getPositionLabel(position);
        }
        return this.adapter.apply("getTooltipText", text);
    };
    /**
     * Takes an absolute position (px) within axis and adjust it to a specific
     * `location` within base interval. (cell)
     *
     * @ignore Exclude from docs
     * @param  {number}            position  Source position (px)
     * @param  {AxisItemLocation}  location  Location within base interval (0-1)
     * @return {number}                      Adjusted position (px)
     */
    DateAxis.prototype.roundPosition = function (position) {
        var date = this.positionToDate(position);
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["round"](date, this.baseInterval.timeUnit, this.baseInterval.count);
        return this.dateToPosition(date);
    };
    /**
     * Returns an absolute pixel coordinate of the start of the cell (period),
     * that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  position  Position (px)
     * @return {number}            Cell start position (px)
     */
    DateAxis.prototype.getCellStartPosition = function (position) {
        return this.roundPosition(position);
    };
    /**
     * Returns an absolute pixel coordinate of the end of the cell (period),
     * that specific position value falls into.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  position  Position (px)
     * @return {number}            Cell end position (px)
     */
    DateAxis.prototype.getCellEndPosition = function (position) {
        position = this.roundPosition(position);
        var date = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["add"](this.positionToDate(position), this.baseInterval.timeUnit, this.baseInterval.count);
        return this.dateToPosition(date);
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
        var date = __WEBPACK_IMPORTED_MODULE_6__core_utils_Time__["round"](new Date(value), this.baseInterval.timeUnit, this.baseInterval.count);
        var dataItem = series.dataItemsByAxis.getKey(this.uid).getKey(date.getTime().toString());
        // todo:  alternatively we can find closiest here
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
            renderer.ticks.template.location = __WEBPACK_IMPORTED_MODULE_1__Axis__["c" /* AxisItemLocation */].Start;
            renderer.grid.template.location = __WEBPACK_IMPORTED_MODULE_1__Axis__["c" /* AxisItemLocation */].Start;
            renderer.labels.template.location = __WEBPACK_IMPORTED_MODULE_1__Axis__["c" /* AxisItemLocation */].Start;
            renderer.baseGrid.disabled = true;
        }
    };
    Object.defineProperty(DateAxis.prototype, "basePoint", {
        /**
         * [basePoint description]
         *
         * @todo Description
         * @return {IPoint} Base point
         */
        get: function () {
            return { x: 0, y: 0 };
        },
        enumerable: true,
        configurable: true
    });
    return DateAxis;
}(__WEBPACK_IMPORTED_MODULE_0__ValueAxis__["a" /* ValueAxis */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_5__core_Registry__["b" /* registry */].registeredClasses["DateAxis"] = DateAxis;
__WEBPACK_IMPORTED_MODULE_5__core_Registry__["b" /* registry */].registeredClasses["DateAxisDataItem"] = DateAxisDataItem;
//# sourceMappingURL=DateAxis.js.map

/***/ }),

/***/ 161:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return XYCursor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Cursor__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sprite__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Disposer__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Color__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_rendering_Path__ = __webpack_require__(12);
/**
 * Cursor for XY chart
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */










/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A cursor used on [[XYChart]].
 *
 * @see {@link IXYCursorEvents} for a list of available events
 * @see {@link IXYCursorAdapters} for a list of available Adapters
 * @todo Add description, examples
 * @todo Should we allow changing `_generalBehavior`?
 */
var XYCursor = /** @class */ (function (_super) {
    __extends(XYCursor, _super);
    /**
     * Constructor
     */
    function XYCursor() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Vertical cursor line element.
         *
         * @type {MutableValueDisposer<Sprite>}
         */
        _this._lineX = new __WEBPACK_IMPORTED_MODULE_2__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        /**
         * Horizontal cursor line element.
         *
         * @type {MutableValueDisposer<Sprite>}
         */
        _this._lineY = new __WEBPACK_IMPORTED_MODULE_2__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        /**
         * Horizontal [[Axis]].
         *
         * @type {MutableValueDisposer<Axis>}
         */
        _this._xAxis = new __WEBPACK_IMPORTED_MODULE_2__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        /**
         * Vertical [[Axis]].
         *
         * @type {MutableValueDisposer<Axis>}
         */
        _this._yAxis = new __WEBPACK_IMPORTED_MODULE_2__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "XYCursor";
        // Defaults
        _this.behavior = "zoomX";
        _this.maxPanOut = 0.1;
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_5__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        // Create selection element
        var selection = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Sprite__["a" /* Sprite */]);
        selection.shouldClone = false;
        selection.fillOpacity = 0.2;
        selection.fill = interfaceColors.getFor("alternativeBackground");
        selection.isMeasured = false;
        _this.selection = selection;
        _this._disposers.push(_this.selection);
        // Create cursor's vertical line
        var lineX = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Sprite__["a" /* Sprite */]);
        lineX.shouldClone = false;
        lineX.stroke = interfaceColors.getFor("grid");
        lineX.fill = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Color__["c" /* color */])();
        lineX.strokeDasharray = "3,3";
        lineX.isMeasured = false;
        lineX.strokeOpacity = 0.4;
        _this.lineX = lineX;
        _this._disposers.push(_this.lineX);
        // Create cursor's horizontal line
        var lineY = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Sprite__["a" /* Sprite */]);
        lineY.shouldClone = false;
        lineY.stroke = interfaceColors.getFor("grid");
        lineY.fill = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Color__["c" /* color */])();
        lineY.strokeDasharray = "3,3";
        lineY.isMeasured = false;
        lineY.strokeOpacity = 0.4;
        _this.lineY = lineY;
        _this._disposers.push(_this.lineY);
        // Add handler for size changes
        _this.events.on("sizechanged", _this.updateSize, _this);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Updates cursor element dimensions on size change.
     *
     * @ignore Exclude from docs
     */
    XYCursor.prototype.updateSize = function () {
        if (this.lineX) {
            this.lineX.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_9__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_9__core_rendering_Path__["lineTo"]({ x: 0, y: this.innerHeight }) });
        }
        if (this.lineY) {
            this.lineY.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_9__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_9__core_rendering_Path__["lineTo"]({ x: this.innerWidth, y: 0 }) });
        }
    };
    /**
     * Updates selection dimensions on size change.
     *
     * @ignore Exclude from docs
     */
    XYCursor.prototype.updateSelection = function () {
        if (this._usesSelection) {
            var downPoint = this.downPoint;
            if (downPoint) {
                var point = this.point;
                if (this.lineX) {
                    point.x = this.lineX.pixelX;
                }
                if (this.lineY) {
                    point.y = this.lineY.pixelY;
                }
                var selection = this.selection;
                var x = Math.min(point.x, downPoint.x);
                var y = Math.min(point.y, downPoint.y);
                var w = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"](Math.abs(downPoint.x - point.x), this._positionPrecision);
                var h = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"](Math.abs(downPoint.y - point.y), this._positionPrecision);
                switch (this.behavior) {
                    case "zoomX":
                        y = 0;
                        h = this.pixelHeight;
                        break;
                    case "zoomY":
                        x = 0;
                        w = this.pixelWidth;
                        break;
                    case "selectX":
                        y = 0;
                        h = this.pixelHeight;
                        break;
                    case "selectY":
                        x = 0;
                        w = this.pixelWidth;
                        break;
                }
                selection.x = x;
                selection.y = y;
                selection.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_9__core_rendering_Path__["rectangle"](w, h) });
                selection.validatePosition(); // otherwise Edge shoes some incorrect size rectangle
            }
        }
    };
    /**
     *
     * @ignore Exclude from docs
     */
    XYCursor.prototype.fixPoint = function (point) {
        point.x = Math.max(0, point.x);
        point.y = Math.max(0, point.y);
        point.x = Math.min(this.pixelWidth, point.x);
        point.y = Math.min(this.pixelHeight, point.y);
        return point;
    };
    /**
     * Updates position of Cursor's line(s) as pointer moves.
     *
     * @ignore Exclude from docs
     * @param {IInteractionEvents["track"]} event Original event
     */
    XYCursor.prototype.handleCursorMove = function (event) {
        var point = _super.prototype.handleCursorMove.call(this, event);
        this.updateLinePositions(point);
        if (this.downPoint) {
            if (this._generalBehavior == "pan") {
                this.getPanningRanges();
                this.dispatch("panning");
            }
        }
        return point;
    };
    /**
     *
     * @ignore Exclude from docs
     */
    XYCursor.prototype.updateLinePositions = function (point) {
        point = this.fixPoint(this.point);
        if (this.lineX && this.lineX.visible && !this.xAxis) {
            this.lineX.x = point.x;
        }
        if (this.lineY && this.lineY.visible && !this.yAxis) {
            this.lineY.y = point.y;
        }
        this.updateSelection();
    };
    /**
     * Starts pointer down action, according to `behavior`.
     *
     * @ignore Exclude from docs
     * @param {ISpriteEvents["down"]} event Original event
     */
    XYCursor.prototype.handleCursorDown = function (event) {
        if (this.visible && !this.isHiding) {
            this.downPoint = __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__["documentPointToSprite"](event.pointer.point, this);
            this.point.x = this.downPoint.x;
            this.point.y = this.downPoint.y;
            this.updateLinePositions(this.downPoint); // otherwise lines won't be in correct position and touch won't work fine
            if (this.fitsToBounds(this.downPoint)) {
                this.updateDownPoint();
                var selection = this.selection;
                var selectionX = this.downPoint.x;
                var selectionY = this.downPoint.y;
                if (this._usesSelection) {
                    selection.x = selectionX;
                    selection.y = selectionY;
                    selection.element.attr({ "d": "" });
                    selection.show();
                }
                _super.prototype.handleCursorDown.call(this, event);
            }
            else {
                this.downPoint = undefined;
            }
        }
    };
    /**
     * Updates the coordinates of where pointer down event occurred
     * (was pressed).
     */
    XYCursor.prototype.updateDownPoint = function () {
        if (this.lineX) {
            this.downPoint.x = this.lineX.pixelX;
        }
        if (this.lineY) {
            this.downPoint.y = this.lineY.pixelY;
        }
    };
    /**
     * Ends pointer down action, according to `behavior`.
     *
     * @ignore Exclude from docs
     * @param {ISpriteEvents["up"]} event Original event
     */
    XYCursor.prototype.handleCursorUp = function (event) {
        if (this.downPoint) {
            this.upPoint = __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__["documentPointToSprite"](event.pointer.point, this);
            this.getRanges();
            if (this.behavior == "selectX" || this.behavior == "selectY" || this.behavior == "selectXY") {
                // void
            }
            else {
                this.selection.hide();
            }
            _super.prototype.handleCursorUp.call(this, event);
        }
    };
    /**
     * [getRanges description]
     *
     * @todo Description
     */
    XYCursor.prototype.getPanningRanges = function () {
        var startX = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"](this.downPoint.x / this.innerWidth, 5);
        var startY = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"](this.downPoint.y / this.innerHeight, 5);
        var currentX = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"](this.point.x / this.innerWidth, 5);
        var currentY = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"](this.point.y / this.innerHeight, 5);
        var deltaX = startX - currentX;
        var deltaY = startY - currentY;
        this.xRange = { start: deltaX, end: 1 + deltaX };
        this.yRange = { start: deltaY, end: 1 + deltaY };
        if (this.behavior == "panX") {
            this.yRange.start = 0;
            this.yRange.end = 1;
        }
        if (this.behavior == "panY") {
            this.xRange.start = 0;
            this.xRange.end = 1;
        }
    };
    /**
     * [getRanges description]
     *
     * @todo Description
     */
    XYCursor.prototype.getRanges = function () {
        if (this.lineX) {
            this.upPoint.x = this.lineX.pixelX;
        }
        if (this.lineY) {
            this.upPoint.y = this.lineY.pixelY;
        }
        // @todo Is this needed?
        this.selection;
        var startX = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"](this.downPoint.x / this.innerWidth, 5);
        var endX = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"]((this.upPoint.x) / this.innerWidth, 5);
        var startY = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"](this.downPoint.y / this.innerHeight, 5);
        var endY = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"]((this.upPoint.y) / this.innerHeight, 5);
        this.xRange = { start: __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["min"](startX, endX), end: __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["max"](startX, endX) };
        this.yRange = { start: __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["min"](startY, endY), end: __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["max"](startY, endY) };
    };
    Object.defineProperty(XYCursor.prototype, "behavior", {
        /**
         * @type {"zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none"} Bheavior
         */
        get: function () {
            return this.getPropertyValue("behavior");
        },
        /**
         * Cursor's behavior when it's moved with pointer down:
         *
         * * "zoomX" - zooms horizontally;
         * * "zoomY" - zooms vertically;
         * * "zoomXY" - zooms both horizontally and vertically;
         * * "selectX" - selects a range horizontally;
         * * "selectY" - selects a range vertically;
         * * "selectXY" - selects a range both horizontally and vertically;
         * * "panX" - moves (pans) current selection horizontally;
         * * "panY" - moves (pans) current selection vertically;
         * * "panXY" - moves (pans) current selection both horizontally and vertically;
         * * "none" - does nothing with pointer down.
         *
         * E.g. "zoomXY" will mean that pressing a mouse over plot area and dragging
         * it will start zooming the chart.
         *
         * @param {"zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none"} value Bheavior
         */
        set: function (value) {
            this.setPropertyValue("behavior", value, true);
            this._usesSelection = false;
            if (value.indexOf("zoom") != -1) {
                this._generalBehavior = "zoom";
                this._usesSelection = true;
            }
            if (value.indexOf("select") != -1) {
                this._generalBehavior = "select";
                this._usesSelection = true;
            }
            if (value.indexOf("pan") != -1) {
                this._generalBehavior = "pan";
                this._usesSelection = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "fullWidthLineX", {
        /**
         * @return {boolean} Full width?
         */
        get: function () {
            return this.getPropertyValue("fullWidthLineX");
        },
        /**
         * Cursor's horizontal line is expanded to take full width of the related
         * Axis' cell/category.
         *
         * NOTE: this setting will work properly if `xAxis` is set and only in case
         * `xAxis` is [[CategoryAxis]] or [[DateAxis]].
         *
         * @param {boolean} value Full width?
         */
        set: function (value) {
            this.setPropertyValue("fullWidthLineX", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "fullWidthLineY", {
        /**
         * @return {boolean} Full width?
         */
        get: function () {
            return this.getPropertyValue("fullWidthLineY");
        },
        /**
         * Cursor's vertical line is expanded to take full width of the related
         * Axis' cell/category.
         *
         * NOTE: this setting will work properly if `yAxis` is set and only in case
         * `yAxis` is [[CategoryAxis]] or [[DateAxis]].
         *
         * @param {boolean} value Full width?
         */
        set: function (value) {
            this.setPropertyValue("fullWidthLineY", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "maxPanOut", {
        /**
         * @return {number} Full width?
         */
        get: function () {
            return this.getPropertyValue("maxPanOut");
        },
        /**
         * If cursor behavior is panX or panY, we allow to pan plot out of it's max bounds for a better user experience.
         * This setting specifies relative value by how much we can pan out the plot
         *
         * @param {number} value
         */
        set: function (value) {
            this.setPropertyValue("maxPanOut", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "xAxis", {
        /**
         * @return {Axis} X axis
         */
        get: function () {
            return this._xAxis.get();
        },
        /**
         * A reference to X [[Axis]].
         *
         * An XY cursor can live without `xAxis` set. You set xAxis for cursor when
         * you have axis tooltip enabled and you want cursor line to be at the same
         * position as tooltip.
         *
         * This works with [[CategoryAxis]] and [[DateAxis]] but not with
         * [[ValueAxis]].
         *
         * @todo Description (review)
         * @param {Axis} axis X axis
         */
        set: function (axis) {
            if (this._xAxis.get() != axis) {
                var chart = axis.chart;
                this._xAxis.set(axis, new __WEBPACK_IMPORTED_MODULE_2__core_utils_Disposer__["c" /* MultiDisposer */]([
                    axis.tooltip.events.on("positionchanged", this.handleXTooltipPosition, this),
                    axis.events.on("validated", chart.handleCursorPositionChange, chart)
                ]));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "yAxis", {
        /**
         * @return {Axis} Y Axis
         */
        get: function () {
            return this._yAxis.get();
        },
        /**
         * A reference to Y [[Axis]].
         *
         * An XY cursor can live without `yAxis` set. You set xAxis for cursor when
         * you have axis tooltip enabled and you want cursor line to be at the same
         * position as tooltip.
         *
         * This works with [[CategoryAxis]] and [[DateAxis]] but not with
         * [[ValueAxis]].
         *
         * @todo Description (review)
         * @param {Axis} axis Y axis
         */
        set: function (axis) {
            if (this._yAxis.get() != axis) {
                var chart = axis.chart;
                this._yAxis.set(axis, new __WEBPACK_IMPORTED_MODULE_2__core_utils_Disposer__["c" /* MultiDisposer */]([
                    axis.tooltip.events.on("positionchanged", this.handleYTooltipPosition, this),
                    axis.events.on("validated", chart.handleCursorPositionChange, chart)
                ]));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates Cursor's position when axis tooltip changes position.
     *
     * @ignore Exclude from docs
     * @param {ISpriteEvents["positionchanged"]} event Original Axis event
     */
    XYCursor.prototype.handleXTooltipPosition = function (event) {
        var tooltip = this.xAxis.tooltip;
        var point = __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__["svgPointToSprite"]({ x: tooltip.pixelX, y: tooltip.pixelY }, this);
        var x = point.x;
        if (this.lineX) {
            this.lineX.x = x;
            if (!this.fitsToBounds(point)) {
                this.hide();
            }
        }
        if (this.xAxis && this.fullWidthLineX) {
            var startPoint = this.xAxis.currentItemStartPoint;
            var endPoint = this.xAxis.currentItemEndPoint;
            if (startPoint && endPoint) {
                this.lineX.x = x;
                var width = endPoint.x - startPoint.x;
                this.lineX.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_9__core_rendering_Path__["rectangle"](width, this.innerHeight, -width / 2) });
            }
        }
    };
    /**
     * Updates Cursor's position when Y axis changes position or scale.
     *
     * @ignore Exclude from docs
     * @param {ISpriteEvents["positionchanged"]} event Original Axis event
     */
    XYCursor.prototype.handleYTooltipPosition = function (event) {
        var tooltip = this.yAxis.tooltip;
        var point = __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__["svgPointToSprite"]({ x: tooltip.pixelX, y: tooltip.pixelY }, this);
        var y = point.y;
        if (this.lineY) {
            this.lineY.y = y;
            if (!this.fitsToBounds(point)) {
                this.hide();
            }
        }
        if (this.yAxis && this.fullWidthLineY) {
            var startPoint = this.yAxis.currentItemStartPoint;
            var endPoint = this.yAxis.currentItemEndPoint;
            if (startPoint && endPoint) {
                this.lineY.y = y;
                var height = endPoint.y - startPoint.y;
                this.lineY.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_9__core_rendering_Path__["rectangle"](this.innerWidth, height, 0, -height / 2) });
            }
        }
    };
    Object.defineProperty(XYCursor.prototype, "lineX", {
        /**
         * @return {Sprite} Line element
         */
        get: function () {
            return this._lineX.get();
        },
        /**
         * A Line element to use for X axis.
         *
         * @param {Sprite} lineX Line
         */
        set: function (lineX) {
            if (lineX) {
                lineX.element = this.paper.add("path");
                this._lineX.set(lineX, lineX.events.on("positionchanged", this.updateSelection, this));
                lineX.parent = this;
            }
            else {
                this._lineX.reset();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "lineY", {
        /**
         * @return {Sprite} Line element
         */
        get: function () {
            return this._lineY.get();
        },
        /**
         * A Line element to use Y axis.
         *
         * @param {Sprite} lineY Line
         */
        set: function (lineY) {
            if (lineY) {
                lineY.element = this.paper.add("path");
                this._lineY.set(lineY, lineY.events.on("positionchanged", this.updateSelection, this));
                lineY.parent = this;
            }
            else {
                this._lineY.reset();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYCursor.prototype, "selection", {
        /**
         * @return {Sprite} Selection rectangle
         */
        get: function () {
            return this._selection;
        },
        /**
         * A selection element ([[Sprite]]).
         *
         * @param {Sprite} selection Selection rectangle
         */
        set: function (selection) {
            this._selection = selection;
            if (selection) {
                selection.element = this.paper.add("path");
                selection.parent = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * Looks if `xAxis` and `yAxis` is set via ID in JSON config, and replaces
     * with real references.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    XYCursor.prototype.processConfig = function (config) {
        if (config) {
            // Set up axes
            if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](config.xAxis) && __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isString"](config.xAxis) && this.map.hasKey(config.xAxis)) {
                config.xAxis = this.map.getKey(config.xAxis);
            }
            if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](config.yAxis) && __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isString"](config.yAxis) && this.map.hasKey(config.yAxis)) {
                config.yAxis = this.map.getKey(config.yAxis);
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return XYCursor;
}(__WEBPACK_IMPORTED_MODULE_0__Cursor__["a" /* Cursor */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["b" /* registry */].registeredClasses["XYCursor"] = XYCursor;
//# sourceMappingURL=XYCursor.js.map

/***/ }),

/***/ 162:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LineSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LineSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__XYSeries__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sprite__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__LineSeriesSegment__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__axes_ValueAxis__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__axes_DateAxis__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_elements_Line__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_elements_Label__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_elements_Rectangle__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__core_utils_Type__ = __webpack_require__(2);
/**
 * Line series module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */














/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[LineSeries]].
 *
 * @see {@link DataItem}
 */
var LineSeriesDataItem = /** @class */ (function (_super) {
    __extends(LineSeriesDataItem, _super);
    /**
     * Constructor
     */
    function LineSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "LineSeriesDataItem";
        return _this;
    }
    return LineSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__XYSeries__["b" /* XYSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a line graph.
 *
 * @see {@link ILineSeriesEvents} for a list of available Events
 * @see {@link ILineSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var LineSeries = /** @class */ (function (_super) {
    __extends(LineSeries, _super);
    /**
     * Constructor
     */
    function LineSeries() {
        var _this = _super.call(this) || this;
        /**
         * Minimum distance in pixels between two adjacent points.
         *
         * If the distance is less than this setting, a point is skipped.
         *
         * This allows acceptable performance with huge amounts of data points.
         *
         * @default 0.5
         * @type {number}
         */
        _this.minDistance = 0.5;
        _this.segments = new __WEBPACK_IMPORTED_MODULE_3__core_utils_List__["e" /* ListTemplate */](new __WEBPACK_IMPORTED_MODULE_4__LineSeriesSegment__["a" /* LineSeriesSegment */]());
        _this._segmentsIterator = new __WEBPACK_IMPORTED_MODULE_11__core_utils_Iterator__["ListIterator"](_this.segments, function () { return _this.segments.create(); });
        _this._segmentsIterator.createNewItems = true;
        _this.className = "LineSeries";
        _this.strokeOpacity = 1;
        _this.fillOpacity = 0;
        _this.connect = true;
        _this.tensionX = 1;
        _this.tensionY = 1;
        _this.segmentsContainer = _this.mainContainer.createChild(__WEBPACK_IMPORTED_MODULE_2__core_Container__["a" /* Container */]);
        _this.segmentsContainer.isMeasured = false;
        // line series might have multiple segments and it has a separate sprite for fill and stroke for each segment. So we need to observe all the changes on series and set them on the segments
        // todo: we need list here, otherwise everything will be redrawn event on change of properties like tooltipX or similar.
        // this.addEventListener(SpriteEvent.PROPERTY_CHANGED, this.validateDataElements, false, this);
        _this.bulletsContainer.toFront();
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    LineSeries.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        if (!__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](this.readerTitle)) {
            this.readerTitle = this.language.translate("Line Series");
        }
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {LineSeriesDataItem} Data Item
     */
    LineSeries.prototype.createDataItem = function () {
        return new LineSeriesDataItem();
    };
    /**
     * Inits data item's working values.
     *
     * @param {this["_dataItem"]}  dataItem  Data item
     * @param {number}             index     Data item's index
     */
    LineSeries.prototype.setInitialWorkingValues = function (dataItem, index) {
        var yAxis = this._yAxis.get();
        var xAxis = this._xAxis.get();
        // this makes data items animate when added
        if (this.visible) {
            var previousDataItem = this.dataItems.getIndex(index - 1);
            dataItem.component = this; // as these values are set before, we don't know component yet
            if (this.baseAxis == xAxis) {
                if (yAxis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_ValueAxis__["a" /* ValueAxis */]) {
                    var initialY = yAxis.minZoomed;
                    if (previousDataItem) {
                        initialY = previousDataItem.values["valueY"].workingValue;
                    }
                    // this makes line animate from previous point to newly added point
                    dataItem.setWorkingValue("valueY", initialY, 0);
                    if (xAxis instanceof __WEBPACK_IMPORTED_MODULE_6__axes_DateAxis__["a" /* DateAxis */]) {
                        dataItem.setWorkingLocation("dateX", -0.5, 0); // instantly move it to previous
                        dataItem.setWorkingLocation("dateX", 0.5); // animate to it's location
                    }
                }
            }
            if (this.baseAxis == yAxis) {
                if (xAxis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_ValueAxis__["a" /* ValueAxis */]) {
                    var initialX = xAxis.minZoomed;
                    if (previousDataItem) {
                        initialX = previousDataItem.values["valueX"].workingValue;
                    }
                    dataItem.setWorkingValue("valueX", initialX, 0);
                    if (yAxis instanceof __WEBPACK_IMPORTED_MODULE_6__axes_DateAxis__["a" /* DateAxis */]) {
                        dataItem.setWorkingLocation("dateY", -0.5, 0); // instantly move it to previous
                        dataItem.setWorkingLocation("dateY", 0.5); // animate to it's location
                    }
                }
            }
        }
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    LineSeries.prototype.validate = function () {
        var _this = this;
        _super.prototype.validate.call(this);
        this._segmentsIterator.reset();
        this.openSegment(this._workingStartIndex);
        __WEBPACK_IMPORTED_MODULE_11__core_utils_Iterator__["each"](this.axisRanges.iterator(), function (range) {
            _this.openSegment(0, range);
        });
        // can't use columnsContainer.removeChildren() because with 3d columns we use one container for all columns
        __WEBPACK_IMPORTED_MODULE_11__core_utils_Iterator__["each"](this._segmentsIterator.iterator(), function (segment) {
            segment.__disabled = true;
        });
    };
    /**
     * [sliceData description]
     *
     * @todo Description
     */
    LineSeries.prototype.sliceData = function () {
        var startIndex = this.startIndex;
        var endIndex = this.endIndex;
        // we need extra one item to both sides with values for line series, otherwise the line will not continue out of bounds of the chart while scrolling
        // find first to the left
        // TODO use iterator instead
        for (var i = this.startIndex - 1; i >= 0; i++) {
            var dataItem = this.dataItems.getIndex(i);
            if (dataItem.hasValue(this._xValueFields) && dataItem.hasValue(this._yValueFields)) {
                startIndex = i;
                break;
            }
        }
        // find first to the right
        // TODO use iterator instead
        for (var i = this.endIndex; i < this.dataItems.length; i++) {
            var dataItem = this.dataItems.getIndex(i);
            if (dataItem.hasValue(this._xValueFields) && dataItem.hasValue(this._yValueFields)) {
                endIndex = i + 1;
                break;
            }
        }
        this._workingStartIndex = startIndex;
        this._workingEndIndex = endIndex;
    };
    /**
     * [openSegment description]
     *
     * @todo Description
     * @param {number}        openIndex  [description]
     * @param {AxisDataItem}  axisRange  [description]
     */
    LineSeries.prototype.openSegment = function (openIndex, axisRange) {
        var points = [];
        var endIndex = this._workingEndIndex;
        var closeIndex;
        var propertiesChanged = false;
        var segment = this._segmentsIterator.getFirst();
        segment.__disabled = false;
        if (axisRange) {
            segment.parent = axisRange.contents;
            __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__["copyProperties"](axisRange.contents, segment, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
        }
        else {
            __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__["copyProperties"](this, segment, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
            segment.filters.clear();
            segment.parent = this.segmentsContainer;
        }
        for (var i = openIndex; i < endIndex; i++) {
            var dataItem = this.dataItems.getIndex(i);
            if (dataItem.hasProperties) {
                // if this is first item of segment
                if (i == openIndex) {
                    this.updateSegmentProperties(dataItem.properties, segment);
                }
                else {
                    // this time we only need to know if properties changed
                    propertiesChanged = this.updateSegmentProperties(dataItem.properties);
                }
            }
            if (dataItem.hasValue(this._xValueFields) && dataItem.hasValue(this._yValueFields)) {
                this.addPoints(points, dataItem, this.xField, this.yField);
            }
            else {
                // if no values in first data item, go to next
                if (i == openIndex) {
                    continue;
                }
                else {
                    var connect = this.connect;
                    // todo: other connect conditions
                    // stop cycle
                    if (!connect) {
                        closeIndex = i;
                        break;
                    }
                }
            }
            closeIndex = i;
            if (propertiesChanged) {
                break;
            }
        }
        this.closeSegment(segment, points, openIndex, closeIndex, axisRange);
    };
    /**
     * [addPoints description]
     *
     * @todo Description
     * @param {IPoint[]}          points    [description]
     * @param {this["_dataItem"]} dataItem  [description]
     * @param {string}            xField    [description]
     * @param {string}            yField    [description]
     * @param {boolean}           backwards [description]
     */
    LineSeries.prototype.addPoints = function (points, dataItem, xField, yField, backwards) {
        points.push(this.getPoint(dataItem, xField, yField, dataItem.locations[xField], dataItem.locations[yField]));
    };
    /**
     * [closeSegment description]
     *
     * @todo Description
     * @param {LineSeriesSegment} segment    [description]
     * @param {IPoint[]}          points     [description]
     * @param {number}            openIndex  [description]
     * @param {number}            closeIndex [description]
     * @param {AxisDataItem}      axisRange  [description]
     */
    LineSeries.prototype.closeSegment = function (segment, points, openIndex, closeIndex, axisRange) {
        var closePoints = [];
        if (this.dataFields[this._xOpenField] ||
            this.dataFields[this._yOpenField] ||
            this.stacked) {
            for (var i = closeIndex; i >= openIndex; i--) {
                var dataItem = this.dataItems.getIndex(i);
                if (dataItem.hasValue(this._xValueFields) && dataItem.hasValue(this._yValueFields)) { // not sure, this means that open point will only be added if value is also set for this point, but maybe it's ok.
                    this.addPoints(closePoints, dataItem, this.xOpenField, this.yOpenField, true);
                }
            }
        }
        else {
            var baseAxis = this.baseAxis;
            var count = points.length;
            var xAxis = this.xAxis;
            var yAxis = this.yAxis;
            if (baseAxis == xAxis) {
                closePoints.push({ x: points[count - 1].x, y: yAxis.basePoint.y }); // last x
                closePoints.push({ x: points[0].x, y: yAxis.basePoint.y }); // first x
            }
            else {
                closePoints.push({ x: xAxis.basePoint.x, y: points[count - 1].y }); // last y
                closePoints.push({ x: xAxis.basePoint.x, y: points[0].y }); // first y
            }
        }
        this.drawSegment(segment, points, closePoints);
        if (closeIndex < this._workingEndIndex) {
            this.openSegment(closeIndex + 1, axisRange);
        }
    };
    /**
     * Draws the line segment.
     *
     * @param {LineSeriesSegment}  segment     Segment
     * @param {IPoint[]}           points      Segment points
     * @param {IPoint[]}           closePoints Segment close points
     */
    LineSeries.prototype.drawSegment = function (segment, points, closePoints) {
        segment.drawSegment(points, closePoints, this.tensionX, this.tensionY);
    };
    /**
     * Segement will get its colors from `this.dataItem`, as thats how
     * `getPropertyValue()` method works.
     *
     * We pass `lineSeriesDataItem.properties` as item here each time when a flag
     * `hasProperties` is set to `true` on data item (this means it can contain
     * some properties set).
     *
     * @param  {object}             itemProperties  Item properties
     * @param  {LineSeriesSegment}  segment         Segment
     * @return {boolean}                            Properties changed?
     */
    LineSeries.prototype.updateSegmentProperties = function (itemProperties, segment) {
        var changed = false;
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__["each"](itemProperties, function (propertyName, value) {
            //for (let propertyName in itemProperties) {
            //let value: any = itemProperties[propertyName];
            if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](value)) {
                if (segment) {
                    if (segment.properties[propertyName] != value) {
                        segment.setPropertyValue(propertyName, value);
                        changed = true;
                    }
                }
                else {
                    changed = true;
                }
            }
        });
        return changed;
    };
    Object.defineProperty(LineSeries.prototype, "connect", {
        /**
         * @return {boolean} Connect?
         */
        get: function () {
            return this.getPropertyValue("connect");
        },
        /**
         * Connect the lines over empty data points?
         *
         * @default true
         * @param {boolean}  value  Connect?
         */
        set: function (value) {
            this.setPropertyValue("connect", value);
            this.invalidateDataRange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSeries.prototype, "tensionX", {
        /**
         * @return {number} Horizontal tension (0-1)
         */
        get: function () {
            return this.getPropertyValue("tensionX");
        },
        /**
         * Horizontal tension setting of the line (0-1).
         *
         * Can be used to create smoothed lines. It works like this:
         *
         * Accepted values are in the range between 0 and 1. The biggest value (1)
         * will mean that the "tension" is very high, so the line is maximally
         * attracted to the points it connects, hence the straight line.
         *
         * Using smaller numbers will "relax" the tension, creating some curving.
         *
         * The smaller the tension setting, the more relaxed the line and the more
         * wide the curve.
         *
         * This setting is for horizontal tension, meaning the curve will bend in
         * such way that it never goes below or above connecting points. To enable
         * vertical bending as well, use `tensionY`.
         *
         * @default 1
         * @param {number}  value  Horizontal tension (0-1)
         */
        set: function (value) {
            this.setPropertyValue("tensionX", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSeries.prototype, "tensionY", {
        /**
         * @return {number} Vertical tension (0-1)
         */
        get: function () {
            return this.getPropertyValue("tensionY");
        },
        /**
         * Can be used to create smoothed lines. It works like this:
         *
         * Accepted values are in the range between 0 and 1. The biggest value (1)
         * will mean that the "tension" is very high, so the line is maximally
         * attracted to the points it connects, hence the straight line.
         *
         * Using smaller numbers will "relax" the tension, creating some curving.
         *
         * The smaller the tension setting, the more relaxed the line and the more
         * wide the curve.
         *
         * This setting is for vertical tension, meaning the curve might bend in
         * such way that it will go below or above connected points.
         *
         * Combine this setting with `tensionX` to create beautifully looking
         * smoothed line series.
         *
         * @default 1
         * @param {number}  value  Vertical tension (0-1)
         */
        set: function (value) {
            this.setPropertyValue("tensionY", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates elements in related legend container, that mimics the look of this
     * Series.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Legend item container
     */
    LineSeries.prototype.createLegendMarker = function (marker) {
        var _this = this;
        var w = marker.pixelWidth;
        var h = marker.pixelHeight;
        marker.disposeChildren();
        var line = marker.createChild(__WEBPACK_IMPORTED_MODULE_8__core_elements_Line__["a" /* Line */]);
        line.shouldClone = false;
        line.copyFrom(this);
        line.x2 = w;
        line.y = h / 2;
        line.visible = true;
        if (this.fillOpacity > 0) {
            var fill = marker.createChild(__WEBPACK_IMPORTED_MODULE_10__core_elements_Rectangle__["a" /* Rectangle */]);
            fill.copyFrom(this);
            fill.width = w;
            fill.height = h;
            fill.y = 0;
            fill.strokeOpacity = 0;
            fill.visible = true;
            line.y = 0;
        }
        __WEBPACK_IMPORTED_MODULE_11__core_utils_Iterator__["eachContinue"](this.bullets.iterator(), function (bullet) {
            if (bullet.copyToLegendMarker) {
                // do not copy bullets with labels
                var hasLabels_1 = false;
                __WEBPACK_IMPORTED_MODULE_11__core_utils_Iterator__["each"](bullet.children.iterator(), function (child) {
                    if (child instanceof __WEBPACK_IMPORTED_MODULE_9__core_elements_Label__["a" /* Label */]) {
                        hasLabels_1 = true;
                        return true;
                    }
                });
                if (!hasLabels_1) {
                    var clone = bullet.clone();
                    clone.copyFrom(_this);
                    clone.parent = marker;
                    clone.isMeasured = true;
                    clone.tooltipText = undefined;
                    clone.x = w / 2;
                    clone.y = h / 2;
                    clone.visible = true;
                    return false;
                }
            }
        });
    };
    return LineSeries;
}(__WEBPACK_IMPORTED_MODULE_0__XYSeries__["a" /* XYSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["b" /* registry */].registeredClasses["LineSeries"] = LineSeries;
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["b" /* registry */].registeredClasses["LineSeriesDataItem"] = LineSeriesDataItem;
//# sourceMappingURL=LineSeries.js.map

/***/ }),

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PieSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PieSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Series__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Slice__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__axes_AxisLabelCircular__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PieTick__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_ColorSet__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_utils_Ease__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__core_utils_Type__ = __webpack_require__(2);
/**
 * Defines Pie Chart Series.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */












/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
//@todo: sequenced?
/**
 * Defines a [[DataItem]] for [[PieSeries]].
 *
 * @see {@link DataItem}
 */
var PieSeriesDataItem = /** @class */ (function (_super) {
    __extends(PieSeriesDataItem, _super);
    /**
     * Constructor
     */
    function PieSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "PieSeriesDataItem";
        _this.values.radiusValue = {};
        _this.applyTheme();
        return _this;
    }
    /**
     * Adds an `id` attribute the the slice element and returns its id.
     *
     * @ignore Exclude from docs
     */
    PieSeriesDataItem.prototype.uidAttr = function () {
        return this.slice.uidAttr();
    };
    /**
     * Hide the data item (and corresponding visual elements).
     *
     * @param {number}    duration  Duration (ms)
     * @param {number}    delay     Delay hiding (ms)
     * @param {number}    toValue   Target value for animation
     * @param {string[]}  fields    Fields to animate while hiding
     */
    PieSeriesDataItem.prototype.hide = function (duration, delay, toValue, fields) {
        return _super.prototype.hide.call(this, duration, delay, 0, ["value", "radiusValue"]);
    };
    /**
     * Show hidden data item (and corresponding cisual elements).
     *
     * @param {number}    duration  Duration (ms)
     * @param {number}    delay     Delay hiding (ms)
     * @param {string[]}  fields    Fields to animate while hiding
     */
    PieSeriesDataItem.prototype.show = function (duration, delay, fields) {
        return _super.prototype.show.call(this, duration, delay, ["value", "radiusValue"]);
    };
    Object.defineProperty(PieSeriesDataItem.prototype, "color", {
        /**
         * @return {string} Color
         */
        get: function () {
            return this.properties.color;
        },
        /**
         * Color of the slice.
         *
         * @todo why not Color?
         * @param {string}  value  Color
         */
        set: function (value) {
            this.setProperty("color", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeriesDataItem.prototype, "category", {
        /**
         * @return {string} Category
         */
        get: function () {
            return this.properties.category;
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
    Object.defineProperty(PieSeriesDataItem.prototype, "radiusValue", {
        /**
         * @return {number} Radius
         */
        get: function () {
            return this.values.radiusValue.value;
        },
        /**
         * Slice's radius, if other than default.
         *
         * @param {number}  value  Radius
         */
        set: function (value) {
            this.setValue("radiusValue", value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a marker used in the legend for this slice.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Marker container
     */
    PieSeriesDataItem.prototype.createLegendMarker = function (marker) {
        this.component.createLegendMarker(marker, this);
    };
    Object.defineProperty(PieSeriesDataItem.prototype, "legendDataItem", {
        /**
         * @return {LegendDataItem<DataItem, IDataItemEvents>} Legend data item
         */
        get: function () {
            return this._legendDataItem;
        },
        /**
         * A legend's data item, that corresponds to this data item.
         *
         * @param {LegendDataItem<DataItem, IDataItemEvents>}  value  Legend data item
         */
        set: function (value) {
            this._legendDataItem = value;
            value.label.dataItem = this;
            value.valueLabel.dataItem = this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeriesDataItem.prototype, "tick", {
        /**
         * A Pie Tick element, related to this data item. (slice)
         *
         * @readonly
         * @return {PieTick} Tick element
         */
        get: function () {
            if (!this._tick) {
                this._tick = this.component.ticks.create();
                this.addSprite(this._tick);
                this._tick.slice = this.slice;
                this._tick.label = this.label;
            }
            return this._tick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeriesDataItem.prototype, "label", {
        /**
         * A Label element, related to this data item. (slice)
         *
         * @readonly
         * @return {AxisLabelCircular} Label element
         */
        get: function () {
            if (!this._label) {
                this._label = this.component.labels.create();
                this.addSprite(this._label);
            }
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeriesDataItem.prototype, "slice", {
        /**
         * A Slice element, related to this data item. (slice)
         *
         * @readonly
         * @return {Slice} Slice element
         */
        get: function () {
            if (!this._slice) {
                this._slice = this.component.slices.create();
                this.addSprite(this._slice);
            }
            return this._slice;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeriesDataItem.prototype, "hiddenInLegend", {
        /**
         * @return {boolean} Disabled in legend?
         */
        get: function () {
            return this.properties.hiddenInLegend;
        },
        /**
         * Should dataItem (slice) be hidden in legend?
         *
         * @param {boolean} value Visible in legend?
         */
        set: function (value) {
            this.setProperty("hiddenInLegend", value);
        },
        enumerable: true,
        configurable: true
    });
    return PieSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__Series__["b" /* SeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a slice series on a Pie chart.
 *
 * @see {@link IPieSeriesEvents} for a list of available Events
 * @see {@link IPieSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var PieSeries = /** @class */ (function (_super) {
    __extends(PieSeries, _super);
    /**
     * Constructor
     */
    function PieSeries() {
        var _this = _super.call(this) || this;
        _this.className = "PieSeries";
        _this.alignLabels = true;
        _this.startAngle = -90;
        _this.endAngle = 270;
        _this.colors = new __WEBPACK_IMPORTED_MODULE_6__core_utils_ColorSet__["a" /* ColorSet */]();
        _this.colors.step = 1;
        var slicesContainer = _this.createChild(__WEBPACK_IMPORTED_MODULE_5__core_Container__["a" /* Container */]);
        slicesContainer.shouldClone = false;
        slicesContainer.isMeasured = false;
        slicesContainer.layout = "none";
        _this.slicesContainer = slicesContainer;
        var ticksContainer = _this.createChild(__WEBPACK_IMPORTED_MODULE_5__core_Container__["a" /* Container */]);
        ticksContainer.shouldClone = false;
        ticksContainer.isMeasured = false;
        ticksContainer.layout = "none";
        _this.ticksContainer = ticksContainer;
        var labelsContainer = _this.createChild(__WEBPACK_IMPORTED_MODULE_5__core_Container__["a" /* Container */]);
        labelsContainer.shouldClone = false;
        labelsContainer.isMeasured = false;
        labelsContainer.layout = "none";
        _this.labelsContainer = labelsContainer;
        _this.bulletsContainer.toFront();
        _this.initSlice(__WEBPACK_IMPORTED_MODULE_1__core_elements_Slice__["a" /* Slice */]);
        // Create tick list
        var tick = new __WEBPACK_IMPORTED_MODULE_3__PieTick__["a" /* PieTick */]();
        tick.isMeasured = false;
        _this.ticks = new __WEBPACK_IMPORTED_MODULE_4__core_utils_List__["e" /* ListTemplate */](tick);
        // Create labels list
        // @todo create a labelText/labelHTML properties just like
        // tooltipText/tooltipHTML
        var label = new __WEBPACK_IMPORTED_MODULE_2__axes_AxisLabelCircular__["a" /* AxisLabelCircular */]();
        label.text = "{category}: {value.percent.formatNumber('#.0')}%";
        label.isMeasured = false;
        label.radius = 25;
        label.padding(5, 5, 5, 5);
        label.renderingFrequency = 2;
        _this.labels = new __WEBPACK_IMPORTED_MODULE_4__core_utils_List__["e" /* ListTemplate */](label);
        // Make all slices focusable
        _this.skipFocusThreshold = 50;
        //let hiddenState = this.hiddenState;
        //hiddenState.properties.opacity = 1;
        //hiddenState.properties.endAngle = -90;
        //hiddenState.properties.startAngle = -90;
        var defaultState = _this.defaultState;
        defaultState.easing = __WEBPACK_IMPORTED_MODULE_10__core_utils_Ease__["sinOut"];
        var hoverState = _this.slices.template.states.create("hover");
        hoverState.properties.scale = 1.05;
        // Accessibility
        _this.itemReaderText = "{category}: {value.percent.formatNumber('#.#')}%";
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    PieSeries.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](this.readerTitle)) {
            this.readerTitle = this.language.translate("Pie Slice Series");
        }
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {PieSeriesDataItem} Data Item
     */
    PieSeries.prototype.createDataItem = function () {
        return new PieSeriesDataItem();
    };
    /**
     * Creates and returns a new slice element.
     *
     * @param  {typeof Slice}  sliceType  Type of the slice element
     * @return {Slice}                    Slice
     */
    PieSeries.prototype.initSlice = function (sliceType) {
        // Create a slice template
        var slice = new sliceType();
        slice.isMeasured = false;
        slice.defaultState.properties.scale = 1;
        slice.observe("scale", this.handleSliceScale, this);
        slice.observe(["dx", "dy", "x", "y", "shiftRadius"], this.handleSliceMove, this);
        slice.tooltipText = "{category}: {value.percent.formatNumber('#.#')}% ({value.value})";
        // Create slice hover state
        slice.states.create("hover");
        var defaultState = slice.defaultState;
        defaultState.properties.shiftRadius = 0;
        slice.togglable = true;
        slice.events.on("toggled", function (event) {
            event.target.hideTooltip();
        });
        var activeState = slice.states.create("active");
        activeState.properties.shiftRadius = 0.10;
        var hiddenState = slice.hiddenState;
        hiddenState.properties.visible = true;
        hiddenState.properties.opacity = 1;
        // Create slices list
        this.slices = new __WEBPACK_IMPORTED_MODULE_4__core_utils_List__["e" /* ListTemplate */](slice);
        return slice;
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    PieSeries.prototype.validate = function () {
        if (Math.abs(this.startAngle - this.endAngle) < 0.01) {
            return;
        }
        // so that radius would be updated
        if (this.chart.invalid) {
            this.chart.validate();
        }
        this._leftItems = [];
        this._rightItems = [];
        this._currentStartAngle = this.startAngle;
        this._arcRect = __WEBPACK_IMPORTED_MODULE_8__core_utils_Math__["getArcRect"](this.startAngle, this.endAngle);
        this._maxRadiusPercent = 0;
        for (var i = this.startIndex; i < this.endIndex; i++) {
            var dataItem = this.dataItems.getIndex(i);
            var radiusValuePercent = dataItem.values.radiusValue.percent;
            if (radiusValuePercent > this._maxRadiusPercent) {
                this._maxRadiusPercent = radiusValuePercent;
            }
        }
        _super.prototype.validate.call(this);
        if (this.alignLabels) {
            if (this.startAngle > this.endAngle) {
                this._rightItems.reverse();
            }
            else {
                this._leftItems.reverse();
            }
            this.arrangeLabels(this._rightItems);
            this.arrangeLabels(this._leftItems);
        }
    };
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {PieSeriesDataItem}  dataItem  Data item
     */
    PieSeries.prototype.validateDataElement = function (dataItem) {
        var _this = this;
        if (this.radius > 0) {
            var percent = dataItem.values.value.percent;
            if (percent > 0) {
                dataItem.__disabled = false;
                // SLICE
                var slice_1 = dataItem.slice;
                slice_1.parent = this.slicesContainer;
                slice_1.radius = this.radius;
                if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](dataItem.radiusValue)) {
                    slice_1.radius *= dataItem.values.radiusValue.percent / this._maxRadiusPercent;
                }
                slice_1.innerRadius = this.innerRadius;
                slice_1.startAngle = this._currentStartAngle;
                if (slice_1.fill == undefined) {
                    slice_1.fill = this.colors.getIndex(dataItem.index * this.colors.step);
                }
                if (slice_1.stroke == undefined) {
                    slice_1.stroke = this.colors.getIndex(dataItem.index * this.colors.step);
                }
                slice_1.arc = dataItem.values.value.percent * (this.endAngle - this.startAngle) / 100;
                // LABEL
                var label = dataItem.label;
                label.parent = this.labelsContainer;
                var tick = dataItem.tick;
                tick.parent = this.ticksContainer;
                var normalizedMiddleAngle = (slice_1.middleAngle + 360) % 360; // force angle to be 0 - 360;
                var point = void 0;
                if (this.alignLabels) {
                    var x = tick.length + label.radius;
                    label.verticalCenter = "middle";
                    var arcRect = this._arcRect;
                    // right half
                    if (normalizedMiddleAngle >= 270 || normalizedMiddleAngle <= 91) { // 91 makes less chances for flickering
                        x += (arcRect.width + arcRect.x) * this.radius;
                        label.horizontalCenter = "left";
                        this._rightItems.push(dataItem);
                    }
                    // left half
                    else {
                        x -= arcRect.x * this.radius;
                        label.horizontalCenter = "right";
                        this._leftItems.push(dataItem);
                        x *= -1;
                    }
                    var distance = this.radius + tick.length + label.radius;
                    point = { x: x, y: slice_1.iy * distance };
                }
                else {
                    var x = slice_1.ix * slice_1.radius;
                    var y = slice_1.iy * slice_1.radiusY;
                    point = label.fixPoint({ x: x, y: y }, slice_1.radius);
                }
                label.moveTo(point);
                this._currentStartAngle += slice_1.arc;
                // Apply accessibility
                if (this.itemsFocusable()) {
                    slice_1.role = "menuitem";
                    slice_1.focusable = true;
                }
                else {
                    slice_1.role = "listitem";
                    slice_1.focusable = false;
                }
                // Apply screen reader label
                if (slice_1.focusable) {
                    slice_1.events.once("focus", function (ev) {
                        slice_1.readerTitle = _this.populateString(_this.itemReaderText, dataItem);
                    });
                    slice_1.events.once("blur", function (ev) {
                        slice_1.readerTitle = "";
                    });
                }
                if (slice_1.hoverable) {
                    slice_1.events.once("over", function (ev) {
                        slice_1.readerTitle = _this.populateString(_this.itemReaderText, dataItem);
                    });
                    slice_1.events.once("out", function (ev) {
                        slice_1.readerTitle = "";
                    });
                }
                // do this at the end, otherwise bullets won't be positioned properly
                _super.prototype.validateDataElement.call(this, dataItem);
            }
            else {
                dataItem.__disabled = true;
            }
        }
    };
    /**
     * Arranges slice labels according to position settings.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"][]}  dataItems  Data items
     */
    PieSeries.prototype.arrangeLabels = function (dataItems) {
        for (var i = 0; i < dataItems.length; i++) {
            var dataItem = dataItems[i];
            var label = dataItem.label;
            if (label) {
                if (i < dataItems.length - 1) {
                    var nextLabel = this.getNextLabel(i + 1, dataItems);
                    if (label.invalid) {
                        label.validate();
                    }
                    var bottom = label.pixelY + label.measuredHeight;
                    if (nextLabel) {
                        if (nextLabel.y < bottom) {
                            nextLabel.y = bottom;
                        }
                    }
                }
            }
        }
    };
    /**
     * Returns the next label according to `index`.
     *
     * @param  {number}              index      Current index
     * @param  {PieSerisDataItem[]}  dataItems  Data items
     * @return {AxisLabelCircular}              Label element
     */
    PieSeries.prototype.getNextLabel = function (index, dataItems) {
        if (dataItems.length >= index) {
            var nextDataItem = dataItems[index];
            if (nextDataItem) {
                if (nextDataItem.label) {
                    return nextDataItem.label;
                }
                else {
                    return this.getNextLabel(index + 1, dataItems);
                }
            }
        }
    };
    Object.defineProperty(PieSeries.prototype, "radius", {
        /**
         * @ignore Exclude from docs
         * @return {number} Radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Outer radius for the series' slices in pixels.
         *
         * @ignore Exclude from docs
         * @todo Redo so that users can set it
         * @param {number}  value  Radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeries.prototype, "innerRadius", {
        /**
         * @ignore Exclude from docs
         * @return {number} Radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Inner radius for the series' slices in pixels.
         *
         * @ignore Exclude from docs
         * @todo Redo so that users can set it
         * @param {number}  value  Radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeries.prototype, "startAngle", {
        /**
         * @ignore Exclude from docs
         * @return {number} Angle
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
        /**
         * Start angle for the series' slices in degrees. (0-360)
         *
         * @ignore Exclude from docs
         * @todo Redo so that users can set it
         * @param {number}  value  Angle
         */
        set: function (value) {
            this.setPropertyValue("startAngle", __WEBPACK_IMPORTED_MODULE_8__core_utils_Math__["normalizeAngle"](value), true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeries.prototype, "endAngle", {
        /**
         * @ignore Exclude from docs
         * @return {number} Angle
         */
        get: function () {
            return this.getPropertyValue("endAngle");
        },
        /**
         * End angle for the series' slices in degrees. (0-360)
         *
         * @ignore Exclude from docs
         * @todo Redo so that users can set it
         * @param {number}  value  Angle
         */
        set: function (value) {
            this.setPropertyValue("endAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeries.prototype, "alignLabels", {
        /**
         * @return {boolean} Align labels?
         */
        get: function () {
            return this.getPropertyValue("alignLabels");
        },
        /**
         * Align labels into nice vertical columns?
         *
         * This will ensure that labels never overlap with each other.
         *
         * Arranging labels into columns makes them more readble, and better user
         * experience.
         *
         * If set to `false` labels will be positioned at `label.radius` distance,
         * and may, in some cases, overlap.
         *
         * @default true
         * @param {boolean}  value  Align labels?
         */
        set: function (value) {
            this.setPropertyValue("alignLabels", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeries.prototype, "colors", {
        /**
         * @return {ColorSet} Color set
         */
        get: function () {
            return this.getPropertyValue("colors");
        },
        /**
         * A color set to be used for slices.
         *
         * For each new subsequent slice, the chart will assign the next color in
         * this set.
         *
         * @param {ColorSet}  value  Color set
         */
        set: function (value) {
            this.setPropertyValue("colors", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Binds related legend data item's visual settings to this series' visual
     * settings.
     *
     * @ignore Exclude from docs
     * @param {Container}          marker    Container
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    PieSeries.prototype.createLegendMarker = function (marker, dataItem) {
        __WEBPACK_IMPORTED_MODULE_9__core_utils_Iterator__["each"](marker.children.iterator(), function (child) {
            var slice = dataItem.slice;
            // todo: make an easy possibility to bind visual properties
            child.bind("fill", slice);
            child.bind("stroke", slice);
            child.bind("fillOpacity", slice);
            child.bind("strokeOpacity", slice);
        });
    };
    /**
     * Positions series bullet.
     *
     * @ignore Exclude from docs
     * @param {Bullet}  bullet  Bullet
     */
    PieSeries.prototype.positionBullet = function (bullet) {
        _super.prototype.positionBullet.call(this, bullet);
        var dataItem = bullet.dataItem;
        var slice = dataItem.slice;
        var location = 1;
        if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](bullet.locationX)) {
            location = bullet.locationX;
        }
        if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isNumber"](bullet.locationY)) {
            location = bullet.locationY;
        }
        bullet.moveTo({ x: slice.ix * slice.radius * slice.scale * location, y: slice.iy * slice.radius * slice.scale * location });
    };
    /**
     * Repositions bullets when slice's size changes.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Slice, ISpriteEvents>["propertychanged"]}  event  Event
     */
    PieSeries.prototype.handleSliceScale = function (event) {
        var _this = this;
        var slice = event.target;
        var dataItem = slice.dataItem;
        __WEBPACK_IMPORTED_MODULE_9__core_utils_Iterator__["each"](dataItem.bullets.iterator(), function (a) {
            var value = a[1];
            _this.positionBullet(value);
        });
    };
    /**
     * Repositions bullet and labels when slice moves.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Slice, ISpriteEvents>["propertychanged"]}  event  Event
     */
    PieSeries.prototype.handleSliceMove = function (event) {
        if (!this.alignLabels) {
            var slice = event.target;
            var dataItem = slice.dataItem;
            // moving textelement, as label dx and dy are already employed for aligning
            //@labeltodo
            dataItem.label.dx = slice.dx + slice.pixelX;
            dataItem.label.dy = slice.dy + slice.pixelY;
        }
    };
    /**
     * Copies all properties from another instance of [[PieSeries]].
     *
     * @param {ColumnSeries}  source  Source series
     */
    PieSeries.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.slices.template.copyFrom(source.slices.template);
        this.labels.template.copyFrom(source.labels.template);
        this.ticks.template.copyFrom(source.ticks.template);
    };
    return PieSeries;
}(__WEBPACK_IMPORTED_MODULE_0__Series__["a" /* Series */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["b" /* registry */].registeredClasses["PieSeries"] = PieSeries;
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["b" /* registry */].registeredClasses["PieSeriesDataItem"] = PieSeriesDataItem;
//# sourceMappingURL=PieSeries.js.map

/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisRendererCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisRenderer__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AxisFillCircular__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__GridCircular__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AxisLabelCircular__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Type__ = __webpack_require__(2);
/**
 * Module, defining Axis Renderer for circular axes.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */










/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A renderer for circular axis.
 */
var AxisRendererCircular = /** @class */ (function (_super) {
    __extends(AxisRendererCircular, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRendererCircular(axis) {
        var _this = 
        // Init
        _super.call(this, axis) || this;
        // axis.layout = "none"; // does not trigger redraw when size changes
        _this.layout = "none";
        _this.className = "AxisRendererCircular";
        _this.isMeasured = false;
        _this.startAngle = -90;
        _this.endAngle = 270;
        _this.width = Object(__WEBPACK_IMPORTED_MODULE_5__core_utils_Percent__["c" /* percent */])(100);
        _this.height = Object(__WEBPACK_IMPORTED_MODULE_5__core_utils_Percent__["c" /* percent */])(100);
        _this.radius = Object(__WEBPACK_IMPORTED_MODULE_5__core_utils_Percent__["c" /* percent */])(100);
        _this.isMeasured = false;
        axis.isMeasured = false;
        _this.grid.template.location = 0;
        _this.labels.template.location = 0;
        _this.labels.template.isMeasured = true;
        _this.labels.template.radius = 15;
        _this.ticks.template.location = 0;
        _this.ticks.template.pixelPerfect = false;
        _this.tooltipLocation = 0;
        _this.line.strokeOpacity = 0;
        // modify x and y so that tooltip would always be on circle
        var tooltip = axis.tooltip;
        tooltip.adapter.add("dx", function (x, target) {
            var point = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["svgPointToSprite"]({ x: target.pixelX, y: target.pixelY }, _this);
            return _this.pixelRadius * Math.cos(Math.atan2(point.y, point.x)) - point.x;
        });
        tooltip.adapter.add("dy", function (y, target) {
            var point = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["svgPointToSprite"]({ x: target.pixelX, y: target.pixelY }, _this);
            return _this.pixelRadius * Math.sin(Math.atan2(point.y, point.x)) - point.y;
        });
        _this.applyTheme();
        return _this;
    }
    /**
     * Validates Axis renderer.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    AxisRendererCircular.prototype.validate = function () {
        // so that radius would be updated
        if (this.chart && this.chart.invalid) {
            this.chart.validate();
        }
        _super.prototype.validate.call(this);
    };
    Object.defineProperty(AxisRendererCircular.prototype, "axisLength", {
        /**
         * Returns actual length of the Axis, in pixels.
         *
         * @return {number} Length (px)
         */
        get: function () {
            return 2 * Math.PI * this.pixelRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "radius", {
        /**
         * Returns currently set outer radius.
         *
         * @return {number | Percent} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Sets outer radius of the axis.
         *
         * Can be absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "pixelRadius", {
        /**
         * Outer radius in pixels.
         *
         * @return {number} Outer radius (px)
         */
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](this.radius, __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["min"](this.innerWidth / 2, this.innerHeight / 2));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "innerRadius", {
        /**
         * Returns currently set inner radius.
         *
         * @return {number | Percent} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Sets inner radius of the axis.
         *
         * Can be absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "pixelInnerRadius", {
        /**
         * Inner radius in pixels.
         *
         * @return {number} Inner radius (px)
         */
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](this.innerRadius, __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["min"](this.innerWidth / 2, this.innerHeight / 2)) || 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts relative position on axis to point coordinates.
     *
     * @param  {number}  position  Position (0-1)
     * @return {IPoint}            Point
     */
    AxisRendererCircular.prototype.positionToPoint = function (position) {
        var coordinate = this.positionToCoordinate(position);
        var angle = this.startAngle + (this.endAngle - this.startAngle) * coordinate / this.axisLength;
        return { x: this.pixelRadius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](angle), y: this.pixelRadius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](angle) };
    };
    /**
     * Converts relative position on axis to angle.
     *
     * @todo Description (units)
     * @param  {number}  position  Position (0-1)
     * @return {number}            Angle
     */
    AxisRendererCircular.prototype.positionToAngle = function (position) {
        var axis = this.axis;
        var arc = (this.endAngle - this.startAngle) / (axis.end - axis.start);
        var angle;
        if (axis.renderer.inversed) {
            angle = this.startAngle + (axis.end - position) * arc;
        }
        else {
            angle = this.startAngle + (position - axis.start) * arc;
        }
        return __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["round"](angle, 3);
    };
    /**
     * Updates and positions the axis line element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererCircular.prototype.updateAxisLine = function () {
        var element = this.line.element;
        // @todo Is this needed?
        this.chart;
        var radius = this.pixelRadius;
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        var arc = endAngle - startAngle;
        element.attr({ "d": __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["moveTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](startAngle), y: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](startAngle) }) + __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["arcTo"](startAngle, arc, radius, radius) });
    };
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    AxisRendererCircular.prototype.updateGridElement = function (grid, position, endPosition) {
        position = position + (endPosition - position) * grid.location;
        var point = this.positionToPoint(position);
        if (grid.element) {
            var angle = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["DEGREES"] * Math.atan2(point.y, point.x);
            var radius = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](__WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["isNumber"](grid.radius) ? grid.radius : this.radius, this.pixelRadius);
            var gridInnerRadius = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](grid.innerRadius, this.pixelRadius);
            grid.zIndex = 0;
            var innerRadius = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](__WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["isNumber"](gridInnerRadius) ? gridInnerRadius : this.innerRadius, this.pixelRadius, true);
            grid.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["moveTo"]({ x: innerRadius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](angle), y: innerRadius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](angle) }) + __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["lineTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](angle) }) });
        }
        this.toggleVisibility(grid, position, 0, 1);
    };
    /**
     * Updates and positions a tick element.
     *
     * @ignore Exclude from docs
     * @param {AxisTick}  tick         Tick element
     * @param {number}    position     Starting position
     * @param {number}    endPosition  End position
     */
    AxisRendererCircular.prototype.updateTickElement = function (tick, position, endPosition) {
        position = position + (endPosition - position) * tick.location;
        var point = this.positionToPoint(position);
        if (tick.element) {
            var radius = this.pixelRadius;
            var angle = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["DEGREES"] * Math.atan2(point.y, point.x);
            var tickLength = tick.length;
            if (tick.inside) {
                tickLength = -tickLength;
            }
            tick.zIndex = 1;
            tick.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["moveTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](angle) }) + __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["lineTo"]({ x: (radius + tickLength) * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["cos"](angle), y: (radius + tickLength) * __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["sin"](angle) }) });
        }
        this.toggleVisibility(tick, position, 0, 1);
    };
    /**
     * Updates and positions a label element.
     *
     * @ignore Exclude from docs
     * @param {AxisLabel}  label        Label element
     * @param {number}     position     Starting position
     * @param {number}     endPosition  Ending position
     */
    AxisRendererCircular.prototype.updateLabelElement = function (label, position, endPosition) {
        position = position + (endPosition - position) * label.location;
        var point = this.positionToPoint(position);
        label.fixPoint(point, this.pixelRadius);
        label.zIndex = 2;
        this.positionItem(label, point);
        this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
    };
    /**
     * Checks if point is within bounds of a container.
     *
     * @ignore Exclude from docs
     * @param  {IPoint}   point Point coordinates
     * @return {boolean}         Fits?
     */
    AxisRendererCircular.prototype.fitsToBounds = function (point) {
        return true;
    };
    Object.defineProperty(AxisRendererCircular.prototype, "startAngle", {
        /**
         * Returns currently set start angle.
         *
         * @todo Description (units)
         * @return {number} Start angle
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
        /**
         * Sets start angle of the axis.
         *
         * @todo Description (units)
         * @param {number} value Start angle
         */
        set: function (value) {
            // do not normalize angel here!
            this.setPropertyValue("startAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererCircular.prototype, "endAngle", {
        /**
         * Returns currently set end angle.
         *
         * @todo Description (units)
         * @return {number} End angle
         */
        get: function () {
            return this.getPropertyValue("endAngle");
        },
        /**
         * Sets end angle of the axis.
         *
         * @todo Description (units)
         * @param {number} value end angle
         */
        set: function (value) {
            // do not normalize angel here!
            this.setPropertyValue("endAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [getPositionRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}  startPosition  Starting position
     * @param  {number}  endPosition    End position
     * @return {string}                 SVG path
     */
    AxisRendererCircular.prototype.getPositionRangePath = function (startPosition, endPosition, radius, innerRadius, cornerRadius) {
        var path = "";
        if (__WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["isNumber"](startPosition) && __WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["isNumber"](endPosition)) {
            if (!__WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["hasValue"](radius)) {
                radius = this.radius;
            }
            startPosition = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["max"](startPosition, this.axis.start);
            endPosition = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["min"](endPosition, this.axis.end);
            if (endPosition < startPosition) {
                endPosition = startPosition;
            }
            var pixelRadius = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](radius, this.pixelRadius);
            var pixelInnerRadius = __WEBPACK_IMPORTED_MODULE_8__core_utils_Utils__["relativeRadiusToValue"](innerRadius, this.pixelRadius, true);
            var startAngle = this.positionToAngle(startPosition);
            var endAngle = this.positionToAngle(endPosition);
            var arc = endAngle - startAngle;
            path = __WEBPACK_IMPORTED_MODULE_7__core_rendering_Path__["arc"](startAngle, arc, pixelRadius, pixelInnerRadius, pixelRadius, cornerRadius);
        }
        return path;
    };
    /**
     * Returns a new grid element, suitable for this Axis Renderer type.
     *
     * @return {GridCircular} Grid element
     */
    AxisRendererCircular.prototype.createGrid = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__GridCircular__["a" /* GridCircular */]();
    };
    /**
     * Returns a new fill element, suitable for this Axis Renderer type.
     *
     * @return {AxisFillCircular} Fill element
     */
    AxisRendererCircular.prototype.createFill = function (axis) {
        return new __WEBPACK_IMPORTED_MODULE_1__AxisFillCircular__["a" /* AxisFillCircular */](axis);
    };
    /**
     * Returns a new label element, suitable for this Axis Renderer type.
     *
     * @return {AxisLabelCircular} Label element
     */
    AxisRendererCircular.prototype.createLabel = function () {
        return new __WEBPACK_IMPORTED_MODULE_3__AxisLabelCircular__["a" /* AxisLabelCircular */]();
    };
    return AxisRendererCircular;
}(__WEBPACK_IMPORTED_MODULE_0__AxisRenderer__["a" /* AxisRenderer */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_4__core_Registry__["b" /* registry */].registeredClasses["AxisRendererCircular"] = AxisRendererCircular;
//# sourceMappingURL=AxisRendererCircular.js.map

/***/ }),

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisFillCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisFill__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(2);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Provides fill element functionality for circular Axes.
 *
 * @see {@link IAxisFillCircularEvents} for a list of available events
 * @see {@link IAxisFillCircularAdapters} for a list of available Adapters
 * @todo Needs description
 */
var AxisFillCircular = /** @class */ (function (_super) {
    __extends(AxisFillCircular, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Axis
     */
    function AxisFillCircular(axis) {
        var _this = _super.call(this, axis) || this;
        _this.className = "AxisFillCircular";
        _this.element = _this.paper.add("path");
        _this.radius = Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(100);
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the fill element.
     *
     * @ignore Exclude from docs
     */
    AxisFillCircular.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (this.axis) {
            var renderer = this.axis.renderer;
            this.fillPath = renderer.getPositionRangePath(this.startPosition, this.endPosition, this.radius, __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](this.innerRadius) ? this.innerRadius : renderer.innerRadius, this.cornerRadius);
            this.element.attr({ "d": this.fillPath });
        }
    };
    Object.defineProperty(AxisFillCircular.prototype, "innerRadius", {
        /**
         * Returns current inner radius.
         *
         * @return {number} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Sets inner radius of the fill. Relative ([[Percent]]) or absolute (pixels).
         *
         * @param {number | Percent}  value  Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisFillCircular.prototype, "radius", {
        /**
         * Returns current outer radius.
         *
         * @return {number} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Sets outer radius of the fill. Relative ([[Percent]]) or absolute (pixels).
         *
         * @param {number | Percent}  value  Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisFillCircular.prototype, "cornerRadius", {
        /**
         * Returns current corner radius.
         *
         * @return {number} Corner radius (px)
         */
        get: function () {
            return this.getPropertyValue("cornerRadius");
        },
        /**
         * Sets corner radius for the fill. In pixels.
         *
         * @param {number}  value  Corner radius (px)
         */
        set: function (value) {
            this.setPropertyValue("cornerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return AxisFillCircular;
}(__WEBPACK_IMPORTED_MODULE_0__AxisFill__["a" /* AxisFill */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["AxisFillCircular"] = AxisFillCircular;
//# sourceMappingURL=AxisFillCircular.js.map

/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridCircular; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Grid__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * A module defining functionality for circular axis grid elements.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a circular grid element for circular-type axis.
 *
 * @see {@link IGridCircularEvents} for a list of available events
 * @see {@link IGridCircularAdapters} for a list of available Adapters
 * @todo Review: container is better, as we'll be able to attach something to the GridCircular, also with 3d charts we might need some additional elements
 */
var GridCircular = /** @class */ (function (_super) {
    __extends(GridCircular, _super);
    /**
     * Constructor
     */
    function GridCircular() {
        var _this = _super.call(this) || this;
        _this.className = "GridCircular";
        _this.pixelPerfect = false;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(GridCircular.prototype, "innerRadius", {
        /**
         * @return {number} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Inner radius of the circular grid. (absolute or relative)
         *
         * @param {number | Percent} value Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridCircular.prototype, "radius", {
        /**
         * @return {number} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Outer radius of the circular grid. (absolute or relative)
         *
         * @param {number | Percent} value Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return GridCircular;
}(__WEBPACK_IMPORTED_MODULE_0__Grid__["a" /* Grid */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["GridCircular"] = GridCircular;
//# sourceMappingURL=GridCircular.js.map

/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return RadarChartDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RadarChart; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__XYChart__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__series_RadarSeries__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_elements_Circle__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__cursors_RadarCursor__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__axes_AxisRendererCircular__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__axes_AxisRendererRadial__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__core_utils_Type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__core_rendering_Path__ = __webpack_require__(12);
/**
 * Radar chart module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */














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
var RadarChartDataItem = /** @class */ (function (_super) {
    __extends(RadarChartDataItem, _super);
    /**
     * Constructor
     */
    function RadarChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "RadarChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return RadarChartDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__XYChart__["b" /* XYChartDataItem */]));

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
 * @todo Example
 * @important
 */
var RadarChart = /** @class */ (function (_super) {
    __extends(RadarChart, _super);
    /**
     * Constructor
     */
    function RadarChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Defines X axis renderer type.
         *
         * @type {AxisRendererCircular}
         */
        _this._axisRendererX = __WEBPACK_IMPORTED_MODULE_7__axes_AxisRendererCircular__["a" /* AxisRendererCircular */];
        /**
         * Defines Y axis renderer type.
         *
         * @type {AxisRendererRadial}
         */
        _this._axisRendererY = __WEBPACK_IMPORTED_MODULE_8__axes_AxisRendererRadial__["a" /* AxisRendererRadial */];
        /**
         * used by cursor. We adjust innerradius if start and end angle are close to each other
         * @ignore Exclude from docs
         */
        _this.innerRadiusModifyer = 1;
        _this.className = "RadarChart";
        _this.startAngle = -90;
        _this.endAngle = 270;
        _this.radius = Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(80);
        _this.innerRadius = 0;
        var radarContainer = _this.plotContainer.createChild(__WEBPACK_IMPORTED_MODULE_3__core_Container__["a" /* Container */]);
        radarContainer.shouldClone = false;
        radarContainer.width = Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(100);
        radarContainer.height = Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(100);
        radarContainer.layout = "none";
        radarContainer.events.on("maxsizechanged", function () {
            _this.invalidate();
        });
        _this.seriesContainer.parent = radarContainer;
        _this.radarContainer = radarContainer;
        _this.bulletsContainer.parent = radarContainer;
        _this._cursorContainer = radarContainer;
        _this._bulletMask = radarContainer.createChild(__WEBPACK_IMPORTED_MODULE_4__core_elements_Circle__["a" /* Circle */]);
        _this._bulletMask.shouldClone = false;
        _this._bulletMask.element = _this.paper.add("path");
        _this._bulletMask.opacity = 0;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    RadarChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](this.readerTitle)) {
            this.readerTitle = this.language.translate("Radar chart");
        }
    };
    /**
     * Decorates Axis with required properties for this chart.
     *
     * @param {Axis}  axis  Axis
     */
    RadarChart.prototype.processAxis = function (axis) {
        _super.prototype.processAxis.call(this, axis);
        var renderer = axis.renderer;
        renderer.gridContainer.parent = renderer;
        renderer.breakContainer.parent = renderer;
        axis.parent = this.radarContainer;
        renderer.toBack();
    };
    /**
     * Updates all X axes after range change event.
     *
     * @param {AMEvent<Axis, IComponentEvents>["datarangechanged"]}  event  Event
     */
    RadarChart.prototype.handleXAxisRangeChange = function (event) {
        _super.prototype.handleXAxisRangeChange.call(this, event);
        __WEBPACK_IMPORTED_MODULE_10__core_utils_Iterator__["each"](this.yAxes.iterator(), function (axis) {
            axis.invalidate();
        });
    };
    /**
     * Updates all Y axes after range change event.
     *
     * @param {AMEvent<Axis, IComponentEvents>["datarangechanged"]}  event  Event
     */
    RadarChart.prototype.handleYAxisRangeChange = function (event) {
        _super.prototype.handleYAxisRangeChange.call(this, event);
        __WEBPACK_IMPORTED_MODULE_10__core_utils_Iterator__["each"](this.xAxes.iterator(), function (axis) {
            axis.invalidate();
        });
    };
    /**
     * Creates and returns a new Cursor, of type suitable for RadarChart.
     *
     * @return {RadarCursor} Cursor
     */
    RadarChart.prototype.createCursor = function () {
        return new __WEBPACK_IMPORTED_MODULE_6__cursors_RadarCursor__["a" /* RadarCursor */]();
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    RadarChart.prototype.processConfig = function (config) {
        if (config) {
            // Set up cursor
            if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](config.cursor) && !__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](config.cursor.type)) {
                config.cursor.type = "RadarCursor";
            }
            // Set up series
            if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["hasValue"](config.series) && __WEBPACK_IMPORTED_MODULE_11__core_utils_Type__["isArray"](config.series)) {
                for (var i = 0, len = config.series.length; i < len; i++) {
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
        _super.prototype.processConfig.call(this, config);
    };
    /**
     * Does calculations before drawing the chart.
     */
    RadarChart.prototype.beforeDraw = function () {
        _super.prototype.beforeDraw.call(this);
        var radarCont = this.radarContainer;
        var rect = __WEBPACK_IMPORTED_MODULE_12__core_utils_Math__["getArcRect"](this.startAngle, this.endAngle, 1);
        var innerRect = { x: 0, y: 0, width: 0, height: 0 };
        var wr = radarCont.innerWidth / rect.width;
        var hr = radarCont.innerHeight / rect.height;
        var innerRadius = this.innerRadius;
        if (innerRadius instanceof __WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["a" /* Percent */]) {
            var value = innerRadius.value;
            var mr = Math.min(wr, hr);
            value = Math.max(mr * value, mr - Math.min(radarCont.innerHeight, radarCont.innerWidth)) / mr;
            innerRect = __WEBPACK_IMPORTED_MODULE_12__core_utils_Math__["getArcRect"](this.startAngle, this.endAngle, value);
            this.innerRadiusModifyer = value / innerRadius.value;
            innerRadius = Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(value * 100);
        }
        // @todo handle this when innerRadius set in pixels (do it for pie also)
        rect = __WEBPACK_IMPORTED_MODULE_12__core_utils_Math__["getCommonRectangle"]([rect, innerRect]);
        var maxRadius = Math.min(radarCont.innerWidth / rect.width, radarCont.innerHeight / rect.height);
        var diameter = __WEBPACK_IMPORTED_MODULE_9__core_utils_Utils__["relativeRadiusToValue"](this.radius, maxRadius) * 2;
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        this._pixelInnerRadius = __WEBPACK_IMPORTED_MODULE_9__core_utils_Utils__["relativeRadiusToValue"](innerRadius, diameter / 2);
        this._bulletMask.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_13__core_rendering_Path__["arc"](startAngle, endAngle - startAngle, diameter / 2, this._pixelInnerRadius) });
        __WEBPACK_IMPORTED_MODULE_10__core_utils_Iterator__["each"](this.xAxes.iterator(), function (axis) {
            axis.renderer.startAngle = startAngle;
            axis.renderer.endAngle = endAngle;
            axis.width = diameter;
            axis.height = diameter;
            axis.renderer.width = diameter;
            axis.renderer.height = diameter;
            axis.renderer.innerRadius = innerRadius;
        });
        __WEBPACK_IMPORTED_MODULE_10__core_utils_Iterator__["each"](this.yAxes.iterator(), function (axis) {
            axis.renderer.startAngle = startAngle;
            axis.renderer.endAngle = endAngle;
            axis.width = diameter;
            axis.height = diameter;
            axis.renderer.width = diameter;
            axis.renderer.height = diameter;
            axis.renderer.innerRadius = innerRadius;
        });
        var cursor = this.cursor;
        if (cursor) {
            cursor.width = diameter;
            cursor.height = diameter;
            cursor.startAngle = startAngle;
            cursor.endAngle = endAngle;
        }
        var x0 = rect.x;
        var y0 = rect.y;
        var x1 = rect.x + rect.width;
        var y1 = rect.y + rect.height;
        var point = { x: this.seriesContainer.maxWidth / 2 - diameter / 2 * (x0 + (x1 - x0) / 2), y: this.seriesContainer.maxHeight / 2 - diameter / 2 * (y0 + (y1 - y0) / 2) };
        this.radarContainer.moveTo(point);
    };
    /**
     * Creates and returns a new Series, suitable for RadarChart.
     *
     * @return {RadarSeries} New Series
     */
    RadarChart.prototype.createSeries = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__series_RadarSeries__["a" /* RadarSeries */]();
    };
    Object.defineProperty(RadarChart.prototype, "startAngle", {
        /**
         * @return {number} Start angle (degrees)
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
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
         * @param {number}  value  Start angle (degrees)
         */
        set: function (value) {
            this.setPropertyValue("startAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarChart.prototype, "endAngle", {
        /**
         * @return {number} End angle (degrees)
         */
        get: function () {
            return this.getPropertyValue("endAngle");
        },
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
         * @param {number}  value  End angle (degrees)
         */
        set: function (value) {
            this.setPropertyValue("endAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarChart.prototype, "radius", {
        /**
         * @return {number} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Outer radius of the Radar face.
         *
         * This can either be in absolute pixel value, or relative [[Percent]].
         *
         * @param {number | Percent}  value  Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarChart.prototype, "pixelInnerRadius", {
        /**
         * @return {number} Inner radius in pixels
         */
        get: function () {
            return this._pixelInnerRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarChart.prototype, "innerRadius", {
        /**
         * @return {number} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Inner radius of the radar face.
         *
         * This can either be in absolute pixel value, or relative [[Percent]].
         *
         * If set in Percent, it will be relative to `radius`. (outer radius)
         *
         * @param {number | Percent} value Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Triggers (re)rendering of the horizontal (X) axis.
     *
     * @ignore Exclude from docs
     * @param {Axis} axis Axis
     */
    RadarChart.prototype.updateXAxis = function (renderer) {
        //do not call super!
        renderer.axis.initRenderer();
    };
    /**
     * Triggers (re)rendering of the vertical (Y) axis.
     *
     * @ignore Exclude from docs
     * @param {Axis} axis Axis
     */
    RadarChart.prototype.updateYAxis = function (renderer) {
        // do not call super!
        renderer.axis.initRenderer();
    };
    return RadarChart;
}(__WEBPACK_IMPORTED_MODULE_0__XYChart__["a" /* XYChart */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_5__core_Registry__["b" /* registry */].registeredClasses["RadarChart"] = RadarChart;
//# sourceMappingURL=RadarChart.js.map

/***/ }),

/***/ 223:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoryAxisBreak; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisBreak__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * A module which defines functionality related to Category Axis Break.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Base class to define "breaks" in axes
 * @see {@link ICategoryAxisBreakEvents} for a list of available events
 * @see {@link ICategoryAxisBreakAdapters} for a list of available Adapters
 */
var CategoryAxisBreak = /** @class */ (function (_super) {
    __extends(CategoryAxisBreak, _super);
    /**
     * Constructor
     */
    function CategoryAxisBreak() {
        var _this = _super.call(this) || this;
        _this.className = "CategoryAxisBreak";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(CategoryAxisBreak.prototype, "startPosition", {
        /**
         * Pixel position of the break's start.
         *
         * @return {number} Position (px)
         * @readonly
         */
        get: function () {
            if (this.axis) {
                return this.axis.indexToPosition(this.adjustedStartValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBreak.prototype, "endPosition", {
        /**
         * Pixel position of the break's end.
         *
         * @return {number} Position (px)
         * @readonly
         */
        get: function () {
            if (this.axis) {
                return this.axis.indexToPosition(this.adjustedEndValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBreak.prototype, "startCategory", {
        /**
         * @return {string} Start category
         */
        get: function () {
            return this.getPropertyValue("startCategory");
        },
        /**
         * A category break starts on.
         *
         * @param {string}  value Start category
         */
        set: function (value) {
            if (this.setPropertyValue("startCategory", value)) {
                if (this.axis) {
                    this.axis.invalidateDataRange();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBreak.prototype, "endCategory", {
        /**
         * @return {string} End category
         */
        get: function () {
            return this.getPropertyValue("endCategory");
        },
        /**
         * A category break ends on.
         *
         * @param {string}  value  End category
         */
        set: function (value) {
            if (this.setPropertyValue("endCategory", value)) {
                if (this.axis) {
                    this.axis.invalidateDataRange();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBreak.prototype, "startValue", {
        /**
         * @return {number} Value
         */
        get: function () {
            var category = this.getPropertyValue("startCategory");
            if (category) {
                return this.axis.categoryToIndex(category);
            }
            else {
                return this.getPropertyValue("startValue");
            }
        },
        /**
         * An index of start category or a start value.
         *
         * @todo Description (review)
         * @param {number}  value  Value
         */
        set: function (value) {
            if (this.setPropertyValue("startValue", value)) {
                if (this.axis) {
                    this.axis.invalidateDataRange();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBreak.prototype, "endValue", {
        /**
         * @return {number} Value
         */
        get: function () {
            var category = this.getPropertyValue("endCategory");
            if (category) {
                return this.axis.categoryToIndex(category);
            }
            else {
                return this.getPropertyValue("endValue");
            }
        },
        /**
         * An index of end category or a end value.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            if (this.setPropertyValue("endValue", value)) {
                if (this.axis) {
                    this.axis.invalidateDataRange();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return CategoryAxisBreak;
}(__WEBPACK_IMPORTED_MODULE_0__AxisBreak__["a" /* AxisBreak */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["CategoryAxisBreak"] = CategoryAxisBreak;
//# sourceMappingURL=CategoryAxisBreak.js.map

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DateAxisBreak; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ValueAxisBreak__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * DateAxisBreak includes functionality to add breaks on a [[DateAxis]].
 *
 * A "break" can be used to "cut out" specific ranges of the axis scale, e.g.
 * weekends and holidays out of the Date-based axis.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to define breaks for [[DateAxis]].
 *
 * A "break" can be used to "cut out" specific ranges of the axis scale, e.g.
 * weekends and holidays out of the Date-based axis.
 *
 * @see {@link IDateAxisBreakEvents} for a list of available events
 * @see {@link IDateAxisBreakAdapters} for a list of available Adapters
 * @important
 */
var DateAxisBreak = /** @class */ (function (_super) {
    __extends(DateAxisBreak, _super);
    /**
     * Constructor
     */
    function DateAxisBreak() {
        var _this = _super.call(this) || this;
        _this.className = "DateAxisBreak";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(DateAxisBreak.prototype, "startDate", {
        /**
         * @return {Date} Start date
         */
        get: function () {
            return this.getPropertyValue("startDate");
        },
        /**
         * Starting date for the break.
         *
         * @param {Date} value Start date
         */
        set: function (value) {
            if (this.setPropertyValue("startDate", value)) {
                this.startValue = value.getTime();
                if (this.axis) {
                    this.axis.invalidateDataRange();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateAxisBreak.prototype, "endDate", {
        /**
         * @return {Date} End date
         */
        get: function () {
            return this.getPropertyValue("endDate");
        },
        /**
         * Ending date for the break.
         *
         * @param {Date} value End date
         */
        set: function (value) {
            if (this.setPropertyValue("endDate", value)) {
                this.endValue = value.getTime();
                if (this.axis) {
                    this.axis.invalidateDataRange();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return DateAxisBreak;
}(__WEBPACK_IMPORTED_MODULE_0__ValueAxisBreak__["a" /* ValueAxisBreak */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["DateAxisBreak"] = DateAxisBreak;
//# sourceMappingURL=DateAxisBreak.js.map

/***/ }),

/***/ 226:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Cursor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_interaction_Interaction__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__ = __webpack_require__(6);
/**
 * Cursor module
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */






/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Main Cursor class with common cursor functionality.
 *
 * Chart-specific cursors must extend this class.
 *
 * @see {@link ICursorEvents} for a list of available events
 * @see {@link ICursorAdapters} for a list of available Adapters
 * @todo Add description, examples
 * @todo Should we allow changing `_generalBehavior`?
 */
var Cursor = /** @class */ (function (_super) {
    __extends(Cursor, _super);
    /**
     * Constructor
     */
    function Cursor() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Current cursor position during selection.
         *
         * @type {IPoint}
         * @todo Better description
         */
        _this.point = { x: 0, y: 0 };
        _this.className = "Cursor";
        // Set defaults
        //this.background.fillOpacity = 0.5;
        //this.background.fill = color("#dadada");
        _this.width = Object(__WEBPACK_IMPORTED_MODULE_3__core_utils_Percent__["c" /* percent */])(100);
        _this.height = Object(__WEBPACK_IMPORTED_MODULE_3__core_utils_Percent__["c" /* percent */])(100);
        _this.shouldClone = false;
        _this.hide(0);
        _this.trackable = true;
        _this.clickable = true;
        _this.isMeasured = false;
        _this.mouseEnabled = false;
        // Add events on body to trigger down and up events (to start zooming or
        // selection)
        var interaction = Object(__WEBPACK_IMPORTED_MODULE_1__core_interaction_Interaction__["b" /* getInteraction */])();
        interaction.body.events.on("down", _this.handleCursorDown, _this);
        interaction.body.events.on("up", _this.handleCursorUp, _this);
        interaction.body.events.on("track", _this.handleCursorMove, _this);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Handle pointer movement in document and update cursor position as needed.
     *
     * @ignore Exclude from docs
     * @param {IInteractionEvents["track"]} event Event
     */
    Cursor.prototype.handleCursorMove = function (event) {
        var local = __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["documentPointToSprite"](event.pointer.point, this);
        // hide cursor if it's out of bounds
        if (this.fitsToBounds(local)) {
            this.show(0);
        }
        else {
            // unless we are selecting (mouse is down)
            if (!this.downPoint) {
                this.hide(0);
            }
        }
        this.point = local;
        this.getPositions();
        this.dispatch("cursorpositionchanged");
        return local;
    };
    /**
     * Updates cursors current positions.
     */
    Cursor.prototype.getPositions = function () {
        // positions are used by axes or series
        this.xPosition = this.point.x / this.innerWidth;
        this.yPosition = 1 - this.point.y / this.innerHeight;
    };
    /**
     * Handles pointer down event so we can start zoom or selection.
     *
     * @ignore Exclude from docs
     * @param {IInteractionEvents["down"]} event Original event
     */
    Cursor.prototype.handleCursorDown = function (event) {
        switch (this._generalBehavior) {
            case "zoom":
                this.dispatchImmediately("zoomstarted");
                break;
            case "select":
                this.dispatchImmediately("selectstarted");
                break;
            case "pan":
                this.dispatchImmediately("panstarted");
                break;
        }
    };
    /**
     * Handles pointer up event - finishes zoom or selection action.
     *
     * @ignore Exclude from docs
     * @param {IInteractionEvents["up"]} event Original event
     */
    Cursor.prototype.handleCursorUp = function (event) {
        this.upPoint = __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["documentPointToSprite"](event.pointer.point, this);
        if (__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getDistance"](this.upPoint, this.downPoint) > 5) {
            switch (this._generalBehavior) {
                case "zoom":
                    this.dispatchImmediately("zoomended");
                    break;
                case "select":
                    this.dispatchImmediately("selectended");
                    break;
                case "pan":
                    this.dispatchImmediately("panended");
                    break;
            }
        }
        this.downPoint = undefined;
    };
    Object.defineProperty(Cursor.prototype, "chart", {
        /**
         * @return {Chart} Chart
         */
        get: function () {
            return this._chart;
        },
        /**
         * A reference to a [[Chart]] the cursor belongs to.
         *
         * @param {Chart}  value  Chart
         */
        set: function (value) {
            this._chart = value;
        },
        enumerable: true,
        configurable: true
    });
    return Cursor;
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["Cursor"] = Cursor;
//# sourceMappingURL=Cursor.js.map

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return RadarSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RadarSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__LineSeries__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__ = __webpack_require__(12);
/**
 * Radar series module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[RadarSeries]].
 *
 * @see {@link DataItem}
 */
var RadarSeriesDataItem = /** @class */ (function (_super) {
    __extends(RadarSeriesDataItem, _super);
    /**
     * Constructor
     */
    function RadarSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "RadarSeriesDataItem";
        _this.setLocation("dateX", 0, 0);
        _this.setLocation("dateY", 0, 0);
        _this.setLocation("categoryX", 0, 0);
        _this.setLocation("categoryY", 0, 0);
        _this.applyTheme();
        return _this;
    }
    return RadarSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__LineSeries__["b" /* LineSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a radar graph.
 *
 * @see {@link IRadarSeriesEvents} for a list of available Events
 * @see {@link IRadarSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var RadarSeries = /** @class */ (function (_super) {
    __extends(RadarSeries, _super);
    /**
     * Constructor
     */
    function RadarSeries() {
        var _this = _super.call(this) || this;
        _this.className = "RadarSeries";
        _this.connectEnds = true;
        _this.applyTheme();
        return _this;
    }
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    RadarSeries.prototype.validate = function () {
        // so that radius would be updated
        if (this.chart.invalid) {
            this.chart.validate();
        }
        _super.prototype.validate.call(this);
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {RadarSeriesDataItem} Data Item
     */
    RadarSeries.prototype.createDataItem = function () {
        return new RadarSeriesDataItem();
    };
    /**
     * [getPoint description]
     *
     * @todo Description
     * @param {RadarSeriesDataItem} dataItem  [description]
     * @param {string}              xKey      [description]
     * @param {string}              yKey      [description]
     * @param {number}              locationX [description]
     * @param {number}              locationY [description]
     * @param {string}              stackKeyX [description]
     * @param {string}              stackKeyY [description]
     */
    RadarSeries.prototype.getPoint = function (dataItem, xKey, yKey, locationX, locationY, stackKeyX, stackKeyY) {
        if (!stackKeyX) {
            stackKeyX = "valueX";
        }
        if (!stackKeyY) {
            stackKeyY = "valueY";
        }
        var x = this.yAxis.getX(dataItem, yKey, locationY, stackKeyY);
        var y = this.yAxis.getY(dataItem, yKey, locationY, stackKeyY);
        var radius = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["getDistance"]({ x: x, y: y });
        var angle = this.xAxis.getAngle(dataItem, xKey, locationX, stackKeyX);
        var startAngle = this.chart.startAngle;
        var endAngle = this.chart.endAngle;
        //		angle = $math.fitToRange(angle, startAngle, endAngle);
        if (angle < startAngle || angle > endAngle) {
            return undefined;
        }
        else {
            return { x: radius * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["sin"](angle) };
        }
    };
    /**
     * [addPoints description]
     *
     * @todo Description
     * @param {IPoint[]}          points    [description]
     * @param {this["_dataItem"]} dataItem  [description]
     * @param {string}            xField    [description]
     * @param {string}            yField    [description]
     * @param {boolean}           backwards [description]
     */
    RadarSeries.prototype.addPoints = function (points, dataItem, xField, yField, backwards) {
        var point = this.getPoint(dataItem, xField, yField, dataItem.locations[xField], dataItem.locations[yField]);
        if (point) {
            points.push(point);
        }
    };
    /**
     * Returns an SVG path to be used as a mask for the series.
     *
     * @return {string} SVG path
     */
    RadarSeries.prototype.getMaskPath = function () {
        var renderer = this.yAxis.renderer;
        return __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arc"](renderer.startAngle, renderer.endAngle - renderer.startAngle, renderer.pixelRadius, renderer.pixelInnerRadius);
    };
    /**
     * [drawSegment description]
     *
     * @todo Description
     * @param {LineSeriesSegment}  segment      [description]
     * @param {IPoint[]}           points       [description]
     * @param {IPoint[]}           closePoints  [description]
     */
    RadarSeries.prototype.drawSegment = function (segment, points, closePoints) {
        var axis = this.yAxis;
        var renderer = axis.renderer;
        if (this.connectEnds && Math.abs(renderer.endAngle - renderer.startAngle) == 360) {
            // adds one point to the beginning of closePoints array, if needed
            if (this.dataFields[this._xOpenField] ||
                this.dataFields[this._yOpenField] ||
                this.stacked) {
                points.push(points[0]);
                if (closePoints.length > 0) {
                    closePoints.unshift(closePoints[closePoints.length - 1]);
                }
            }
        }
        _super.prototype.drawSegment.call(this, segment, points, closePoints);
    };
    Object.defineProperty(RadarSeries.prototype, "connectEnds", {
        /**
         * @return {boolean} Connect?
         */
        get: function () {
            return this.getPropertyValue("connectEnds");
        },
        /**
         * Should the last and and first data points be connected, forming a complete
         * closed circle?
         *
         * @default true
         * @param {boolean}  value  Connect?
         */
        set: function (value) {
            this.setPropertyValue("connectEnds", value);
            this.invalidateDataRange();
        },
        enumerable: true,
        configurable: true
    });
    return RadarSeries;
}(__WEBPACK_IMPORTED_MODULE_0__LineSeries__["a" /* LineSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["RadarSeries"] = RadarSeries;
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["RadarSeriesDataItem"] = RadarSeriesDataItem;
//# sourceMappingURL=RadarSeries.js.map

/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LineSeriesSegment; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sprite__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Object__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_rendering_Smoothing__ = __webpack_require__(82);
/**
 * Line series segment module.
 * @todo Add description about what this is
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */






/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Represents a line series segment.
 *
 * A line segment can be used to apply different properties to a part of the
 * line series, between two data points.
 *
 * @see {@link ILineSeriesSegmentEvents} for a list of available events
 * @see {@link ILineSeriesSegmentAdapters} for a list of available Adapters
 * @todo Example
 */
var LineSeriesSegment = /** @class */ (function (_super) {
    __extends(LineSeriesSegment, _super);
    /**
     * Constructor
     */
    function LineSeriesSegment() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "LineSeriesSegment";
        // Set defaults
        _this.isMeasured = false;
        _this.mouseEnabled = false;
        // Create fill element
        var fillSprite = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Sprite__["a" /* Sprite */]);
        _this.fillSprite = fillSprite;
        fillSprite.shouldClone = false;
        fillSprite.element = _this.paper.add("path");
        fillSprite.isMeasured = false;
        _this._disposers.push(fillSprite);
        // Create line element
        var strokeSprite = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Sprite__["a" /* Sprite */]);
        _this.strokeSprite = strokeSprite;
        strokeSprite.shouldClone = false;
        strokeSprite.element = _this.paper.add("path");
        strokeSprite.isMeasured = false;
        _this._disposers.push(strokeSprite);
        return _this;
    }
    /**
     * Draws the series segment.
     *
     * @ignore Exclude from docs
     * @param {IPoint[]}  points       Points to connect
     * @param {IPoint[]}  closePoints  ?
     * @param {number}    smoothnessX  Horizontal bezier setting (?)
     * @param {number}    smoothnessY  Vertical bezier setting (?)
     */
    LineSeriesSegment.prototype.drawSegment = function (points, closePoints, smoothnessX, smoothnessY) {
        if (points.length > 0 && closePoints.length > 0) {
            var path = __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"](points[0]) + new __WEBPACK_IMPORTED_MODULE_5__core_rendering_Smoothing__["f" /* Tension */](smoothnessX, smoothnessY).smooth(points);
            //if(this.strokeOpacity > 0 || this.strokeSprite.strokeOpacity > 0){ // not good, range stroke is not drawn then
            this.strokeSprite.element.attr({ "d": path });
            //}
            if (this.fillOpacity > 0 || this.fillSprite.fillOpacity > 0) { // helps to avoid drawing fill object if fill is not visible
                path += __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"](closePoints[0]) + new __WEBPACK_IMPORTED_MODULE_5__core_rendering_Smoothing__["f" /* Tension */](smoothnessX, smoothnessY).smooth(closePoints);
                path += __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"](points[0]);
                path += __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["closePath"]();
                this.fillSprite.element.attr({ "d": path });
            }
        }
    };
    /**
     * Copies properties from a [[Sprite]] to both line and fill elements.
     *
     * @param {Sprite} source Source [[Sprite]] to copy properties from
     */
    LineSeriesSegment.prototype.copyFrom = function (source) {
        var lineElement = this.strokeSprite;
        __WEBPACK_IMPORTED_MODULE_4__core_utils_Object__["copyProperties"](source, lineElement.properties, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
        lineElement.horizontalCenter = "none";
        lineElement.verticalCenter = "none";
        lineElement.visible = true;
        lineElement.fillOpacity = 0;
        lineElement.tooltipText = undefined;
        var fillElement = this.fillSprite;
        __WEBPACK_IMPORTED_MODULE_4__core_utils_Object__["copyProperties"](source, fillElement.properties, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
        fillElement.horizontalCenter = "none";
        fillElement.verticalCenter = "none";
        fillElement.visible = true;
        fillElement.strokeOpacity = 0;
        fillElement.tooltipText = undefined;
    };
    return LineSeriesSegment;
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["LineSeriesSegment"] = LineSeriesSegment;
//# sourceMappingURL=LineSeriesSegment.js.map

/***/ }),

/***/ 230:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RadarCursor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__XYCursor__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Type__ = __webpack_require__(2);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Cursor for [[RadarChart]].
 *
 * @see {@link IRadarCursorEvents} for a list of available events
 * @see {@link IRadarCursorAdapters} for a list of available Adapters
 */
var RadarCursor = /** @class */ (function (_super) {
    __extends(RadarCursor, _super);
    /**
     * Constructor
     */
    function RadarCursor() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "RadarCursor";
        _this.radius = Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(100);
        _this.innerRadius = Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(0);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Checks if point is within bounds of a container.
     *
     * @ignore Exclude from docs
     * @param  {IPoint}   point  Point to check
     * @return {boolean}         Fits within container?
     */
    RadarCursor.prototype.fitsToBounds = function (point) {
        var radius = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getDistance"](point);
        if (radius < this.truePixelRadius + 1 && radius > this.pixelInnerRadius - 1) { // ok to add/remove some
            return true;
        }
        return false;
    };
    Object.defineProperty(RadarCursor.prototype, "startAngle", {
        /**
         * @return {number} Start angle
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
        /**
         * Starting angle of the cursor's radial line.
         *
         * @param {number} value Start angle
         */
        set: function (value) {
            this.setPropertyValue("startAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarCursor.prototype, "endAngle", {
        /**
         * @return {number} End angle
         */
        get: function () {
            return this.getPropertyValue("endAngle");
        },
        /**
         * End angle of the cursor's radial line.
         *
         * @param {number} value End angle
         */
        set: function (value) {
            this.setPropertyValue("endAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates cursor's positions when the tracked coordinates change.
     *
     * @param {ISpriteEvents["track"]} event Event
     */
    RadarCursor.prototype.handleCursorMove = function (event) {
        var local = __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["documentPointToSprite"](event.pointer.point, this);
        _super.prototype.handleCursorMove.call(this, event);
        if (!this.xAxis || (this.xAxis && (!this.xAxis.cursorTooltipEnabled || this.xAxis.tooltip.disabled))) {
            this.updateLineX(this.point);
        }
        if (!this.yAxis || (this.yAxis && (!this.yAxis.cursorTooltipEnabled || this.yAxis.tooltip.disabled))) {
            this.updateLineY(this.point);
        }
        this.updateSelection();
        return local;
    };
    /**
     * (Re)draws the horizontal (circular) cursor's line.
     *
     * @param {IPoint} point New target point
     */
    RadarCursor.prototype.updateLineX = function (point) {
        var radius = this.pixelRadius;
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        if (radius > 0 && __WEBPACK_IMPORTED_MODULE_6__core_utils_Type__["isNumber"](startAngle) && __WEBPACK_IMPORTED_MODULE_6__core_utils_Type__["isNumber"](endAngle)) {
            var innerRadius = this.pixelInnerRadius;
            var angle = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitAngleToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getAngle"](point), startAngle, endAngle);
            var path = void 0;
            if (this.lineX && this.lineX.visible) {
                this.lineX.moveTo({ x: 0, y: 0 });
                // fill				
                if (this.xAxis && this.fullWidthLineX) {
                    var startPoint = this.xAxis.currentItemStartPoint;
                    var endPoint = this.xAxis.currentItemEndPoint;
                    if (startPoint && endPoint) {
                        var fillStartAngle = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitAngleToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getAngle"](startPoint), startAngle, endAngle);
                        var fillEndAngle = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitAngleToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getAngle"](endPoint), startAngle, endAngle);
                        var arc = fillEndAngle - fillStartAngle;
                        // clockwise
                        // this is needed, normalizeAngle doesn't solve it
                        if (startAngle < endAngle) {
                            if (arc < 0) {
                                arc += 360;
                            }
                        }
                        // ccw
                        else {
                            if (arc > 0) {
                                arc -= 360;
                            }
                        }
                        angle -= arc / 2;
                        path = __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: innerRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](angle), y: innerRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](angle) })
                            + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](angle) })
                            + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](angle, arc, radius)
                            + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: innerRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](angle + arc), y: innerRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](angle + arc) })
                            + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](angle + arc, -arc, innerRadius);
                    }
                }
                // line
                if (!path) {
                    path = __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: innerRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](angle), y: innerRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](angle) }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](angle) });
                }
                this.lineX.element.attr({ "d": path });
            }
        }
    };
    /**
     * (Re)draws the vertical (radial) cursor's line.
     *
     * @param {IPoint} point New target point
     */
    RadarCursor.prototype.updateLineY = function (point) {
        if (this.lineY && this.lineY.visible) {
            var startAngle = this.startAngle;
            var endAngle = this.endAngle;
            var truePixelRadius = this.truePixelRadius;
            var radius = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getDistance"](point), 0, this.truePixelRadius);
            if (__WEBPACK_IMPORTED_MODULE_6__core_utils_Type__["isNumber"](radius) && __WEBPACK_IMPORTED_MODULE_6__core_utils_Type__["isNumber"](startAngle)) {
                this.lineY.moveTo({ x: 0, y: 0 });
                var path = void 0;
                var arc = endAngle - startAngle;
                if (this.yAxis && this.fullWidthLineY) {
                    // fill
                    var startPoint = this.yAxis.currentItemStartPoint;
                    var endPoint = this.yAxis.currentItemEndPoint;
                    if (startPoint && endPoint) {
                        var innerRadius = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getDistance"](startPoint), 0, truePixelRadius);
                        radius = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getDistance"](endPoint), 0, truePixelRadius);
                        path = __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](startAngle), y: radius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](startAngle) }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](startAngle, arc, radius);
                        path += __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: innerRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](endAngle), y: innerRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](endAngle) }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](endAngle, -arc, innerRadius);
                    }
                }
                if (!path) {
                    path = __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](startAngle), y: radius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](startAngle) }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](startAngle, endAngle - startAngle, radius);
                }
                this.lineY.element.attr({ "d": path });
            }
        }
    };
    /**
     * Updates selection dimensions on size change.
     *
     * @ignore Exclude from docs
     */
    RadarCursor.prototype.updateSelection = function () {
        if (this._usesSelection) {
            var downPoint = this.downPoint;
            if (downPoint) {
                var point = this.point;
                var radius = this.pixelRadius;
                var truePixelRadius = this.truePixelRadius;
                var innerRadius = this.pixelInnerRadius;
                var startAngle = Math.min(this.startAngle, this.endAngle);
                var endAngle = Math.max(this.startAngle, this.endAngle);
                var downAngle = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitAngleToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getAngle"](downPoint), startAngle, endAngle);
                var angle = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitAngleToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getAngle"](point), startAngle, endAngle);
                var downRadius = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getDistance"](downPoint);
                if (downRadius < truePixelRadius) {
                    var currentRadius = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getDistance"](point), 0, truePixelRadius);
                    this._prevAngle = angle;
                    var path = __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: 0, y: 0 });
                    var downSin = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](downAngle);
                    var downCos = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](downAngle);
                    var sin = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](angle);
                    var cos = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](angle);
                    var behavior = this.behavior;
                    if (behavior == "zoomX" || behavior == "selectX") {
                        path += __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: radius * downCos, y: radius * downSin }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](downAngle, angle - downAngle, radius) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: innerRadius * cos, y: innerRadius * sin }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](angle, downAngle - angle, innerRadius);
                    }
                    else if (behavior == "zoomY" || behavior == "selectY") {
                        path = __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: currentRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](startAngle), y: currentRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](startAngle) }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](startAngle, endAngle - startAngle, currentRadius) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: downRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](endAngle), y: downRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](endAngle) }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](endAngle, startAngle - endAngle, downRadius) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["closePath"]();
                    }
                    else if (behavior == "zoomXY") {
                        path = __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: currentRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](downAngle), y: currentRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](downAngle) }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](downAngle, angle - downAngle, currentRadius) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: downRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["cos"](angle), y: downRadius * __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["sin"](angle) }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["arcTo"](angle, downAngle - angle, downRadius) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["closePath"]();
                    }
                    this.selection.element.attr({ "d": path });
                }
                this.selection.moveTo({ x: 0, y: 0 });
            }
        }
    };
    /**
     * Updates cursors current positions.
     */
    RadarCursor.prototype.getPositions = function () {
        // positions are used by axes or series
        var chart = this.chart;
        if (chart) {
            var innerRadius = this.pixelInnerRadius;
            var radius = this.truePixelRadius - innerRadius;
            var startAngle = this.startAngle;
            var endAngle = this.endAngle;
            var angle = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitAngleToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getAngle"](this.point), startAngle, endAngle);
            var xPosition = ((angle - startAngle) / (endAngle - startAngle));
            this.xPosition = xPosition;
            this.yPosition = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitToRange"]((__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getDistance"](this.point) - innerRadius) / radius, 0, 1);
        }
    };
    /**
     * Overriding inherited method, so that nothing happens when it's triggered.
     *
     * @ignore Exclude from docs
     */
    RadarCursor.prototype.updateDownPoint = function () { };
    /**
     * Updates Cursor's position when axis tooltip changes horizontal position.
     *
     * @param {ISpriteEvents["positionchanged"]} event Axis event
     */
    RadarCursor.prototype.handleXTooltipPosition = function (event) {
        if (this.xAxis.cursorTooltipEnabled) {
            var tooltip = this.xAxis.tooltip;
            this.updateLineX(__WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["svgPointToSprite"]({ x: tooltip.pixelX, y: tooltip.pixelY }, this));
        }
    };
    /**
     * Updates Cursor's position when axis tooltip changes vertical position.
     *
     * @todo Description
     * @param {ISpriteEvents["positionchanged"]} event Axis event
     */
    RadarCursor.prototype.handleYTooltipPosition = function (event) {
        if (this.yAxis.cursorTooltipEnabled) {
            var tooltip = this.yAxis.tooltip;
            this.updateLineY(__WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["svgPointToSprite"]({ x: tooltip.pixelX, y: tooltip.pixelY }, this));
        }
    };
    /**
     * needs to be overriden
     * @ignore
     */
    RadarCursor.prototype.updateLinePositions = function (point) {
    };
    /**
     * [getRanges description]
     *
     * @todo Description
     */
    RadarCursor.prototype.getRanges = function () {
        var downPoint = this.downPoint;
        if (downPoint) {
            var upPoint = this.upPoint;
            var chart = this.chart;
            if (chart) {
                var radius = this.pixelRadius;
                var startAngle = this.startAngle;
                var endAngle = this.endAngle;
                var downAngle = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitAngleToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getAngle"](downPoint), this.startAngle, this.endAngle);
                var upAngle = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitAngleToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getAngle"](upPoint), this.startAngle, this.endAngle);
                var downRadius = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getDistance"](downPoint), 0, radius);
                var upRadius = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitToRange"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["getDistance"](upPoint), 0, radius);
                var startX = 0;
                var endX = 1;
                var startY = 0;
                var endY = 1;
                var behavior = this.behavior;
                if (behavior == "zoomX" || behavior == "selectX" || behavior == "zoomXY" || behavior == "selectXY") {
                    var arc = endAngle - startAngle;
                    startX = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["round"]((downAngle - startAngle) / arc, 5);
                    endX = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["round"]((upAngle - startAngle) / arc, 5);
                }
                if (behavior == "zoomY" || behavior == "selectY" || behavior == "zoomXY" || behavior == "selectXY") {
                    startY = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["round"](downRadius / radius, 5);
                    endY = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["round"](upRadius / radius, 5);
                }
                this.xRange = { start: Math.min(startX, endX), end: Math.max(startX, endX) };
                this.yRange = { start: Math.min(startY, endY), end: Math.max(startY, endY) };
                if (this.behavior == "selectX" || this.behavior == "selectY" || this.behavior == "selectXY") {
                    // void
                }
                else {
                    this.selection.hide();
                }
            }
        }
    };
    /**
     * Overriding inherited method, so that nothing happens when `updateSize`
     * is triggered.
     *
     * RadarCursor is quite complicated and needs own sizing logic.
     *
     * @ignore Exclude from docs
     */
    RadarCursor.prototype.updateSize = function () { };
    Object.defineProperty(RadarCursor.prototype, "radius", {
        /**
         * @return {number} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Outer radius of the cursor's circular line.
         * Absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarCursor.prototype, "pixelRadius", {
        /**
         * Outer radius of the circular line in pixels.
         *
         * @return {number} Outer radius (px)
         * @readonly
         */
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["relativeRadiusToValue"](this.radius, this.truePixelRadius);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarCursor.prototype, "truePixelRadius", {
        /**
         * [truePixelRadius description]
         *
         * @todo Description
         * @return {number} Outer radius (px)
         * @readonly
         */
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["relativeToValue"](Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(100), __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["min"](this.innerWidth / 2, this.innerHeight / 2));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarCursor.prototype, "innerRadius", {
        /**
         * @return {number} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Inner radius of the cursor's circular line.
         * Absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadarCursor.prototype, "pixelInnerRadius", {
        /**
         * Inner radius of the circular line in pixels.
         *
         * @return {number} Inner radius (px)
         * @readonly
         */
        get: function () {
            var innerRadius = this.innerRadius;
            if (innerRadius instanceof __WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["a" /* Percent */]) {
                innerRadius = Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(100 * innerRadius.value * this.chart.innerRadiusModifyer);
            }
            return __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["relativeRadiusToValue"](innerRadius, this.truePixelRadius) || 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @ignore Exclude from docs
     */
    RadarCursor.prototype.fixPoint = function (point) {
        // overriding xy method
        return point;
    };
    return RadarCursor;
}(__WEBPACK_IMPORTED_MODULE_0__XYCursor__["a" /* XYCursor */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["RadarCursor"] = RadarCursor;
//# sourceMappingURL=RadarCursor.js.map

/***/ }),

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisRendererRadial; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AxisRendererY__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CategoryAxis__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_WavedCircle__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_utils_Type__ = __webpack_require__(2);
/**
 * Module, defining Axis Renderer for radial axes.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */











/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A renderer for radial axis.
 */
var AxisRendererRadial = /** @class */ (function (_super) {
    __extends(AxisRendererRadial, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRendererRadial(axis) {
        var _this = 
        // Init
        _super.call(this, axis) || this;
        /**
         * A related chart.
         *
         * @todo Description
         * @type {MutableValueDisposer}
         */
        _this._chart = new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "AxisRendererRadial";
        _this.isMeasured = false;
        _this.startAngle = -90;
        _this.endAngle = 270;
        _this.minGridDistance = 30;
        _this.gridType = "circles";
        _this.axisAngle = -90;
        _this.isMeasured = false;
        _this.layout = "none";
        _this.width = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(100);
        _this.radius = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(100);
        _this.line.strokeOpacity = 0;
        _this.labels.template.horizontalCenter = "middle";
        _this.applyTheme();
        return _this;
    }
    /**
     * Validates Axis renderer.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    AxisRendererRadial.prototype.validate = function () {
        // so that radius would be updated
        if (this.chart && this.chart.invalid) {
            this.chart.validate();
        }
        _super.prototype.validate.call(this);
    };
    Object.defineProperty(AxisRendererRadial.prototype, "axisLength", {
        /**
         * Returns actual length of the Axis, in pixels.
         *
         * @return {number} Length (px)
         */
        get: function () {
            return this.pixelRadius - this.pixelInnerRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererRadial.prototype, "radius", {
        /**
         * Returns currently set outer radius.
         *
         * @return {number | Percent} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Sets outer radius of the axis.
         *
         * Can be absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererRadial.prototype, "pixelRadius", {
        /**
         * Outer radius in pixels.
         *
         * @return {number} Outer radius (px)
         */
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_9__core_utils_Utils__["relativeRadiusToValue"](this.radius, __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["min"](this.innerWidth / 2, this.innerHeight / 2));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererRadial.prototype, "innerRadius", {
        /**
         * Returns currently set inner radius.
         *
         * @return {number | Percent} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Sets inner radius of the axis.
         *
         * Can be absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Outer radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererRadial.prototype, "pixelInnerRadius", {
        /**
         * Inner radius in pixels.
         *
         * @return {number} Inner radius (px)
         */
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_9__core_utils_Utils__["relativeRadiusToValue"](this.innerRadius, __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["min"](this.innerWidth / 2, this.innerHeight / 2)) || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererRadial.prototype, "chart", {
        /**
         * Returns currently set associated chart.
         *
         * @ignore Exclude from docs
         * @return {RadarChart} Chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * Sets a chart, associated with the Axis.
         *
         * @ignore Exclude from docs
         * @param {RadarChart} value Chart
         */
        set: function (chart) {
            this._chart.set(chart, null);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts relative position on axis to point coordinates.
     *
     * @param  {number}  position  Position (0-1)
     * @return {IPoint}            Point
     */
    AxisRendererRadial.prototype.positionToPoint = function (position) {
        var radius = __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["fitToRange"](this.positionToCoordinate(position), 0, Infinity);
        return { x: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](this.axisAngle), y: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](this.axisAngle) };
    };
    /**
     * Updates and positions the axis line element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererRadial.prototype.updateAxisLine = function () {
        this.line.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["moveTo"]({ x: this.pixelInnerRadius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](this.axisAngle), y: this.pixelInnerRadius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](this.axisAngle) }) + __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["lineTo"]({ x: this.pixelRadius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](this.axisAngle), y: this.pixelRadius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](this.axisAngle) }) });
        var title = this.axis.title;
        title.valign = "none";
        title.horizontalCenter = "middle";
        title.verticalCenter = "bottom";
        title.y = -this.axisLength / 2;
        var rotation = 90;
        if (this.opposite) {
            if (!this.inside) {
                rotation = -90;
            }
        }
        else {
            if (this.inside) {
                rotation = -90;
            }
        }
        title.rotation = rotation;
    };
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    AxisRendererRadial.prototype.updateGridElement = function (grid, position, endPosition) {
        position = position + (endPosition - position) * grid.location;
        var point = this.positionToPoint(position);
        var path;
        var radius = __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["getDistance"](point);
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        if (__WEBPACK_IMPORTED_MODULE_10__core_utils_Type__["isNumber"](radius) && grid.element) {
            var chart = this.chart;
            var xAxis = chart.xAxes.getIndex(0);
            var count = chart.dataItems.length;
            var series = chart.series.getIndex(0);
            // polygons are only possible if x axis is present
            // @todo: review this
            if (this.gridType == "polygons" && count > 0 && series && xAxis && xAxis instanceof __WEBPACK_IMPORTED_MODULE_1__CategoryAxis__["a" /* CategoryAxis */]) {
                var gridLocation = xAxis.renderer.grid.template.location;
                var angle = xAxis.getAngle(series.dataItems.getIndex(0), "categoryX", gridLocation);
                path = __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["moveTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](angle) });
                var count_1 = chart.dataItems.length;
                for (var i = 1; i < count_1; i++) {
                    angle = xAxis.getAngle(series.dataItems.getIndex(i), "categoryX", gridLocation);
                    path += __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["lineTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](angle) });
                }
                angle = xAxis.getAngle(series.dataItems.getIndex(count_1 - 1), "categoryX", xAxis.renderer.cellEndLocation);
                path += __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["lineTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](angle) });
            }
            else {
                path = __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["moveTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](startAngle), y: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](startAngle) }) + __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["arcTo"](startAngle, endAngle - startAngle, radius, radius);
            }
            grid.element.attr({ "d": path });
        }
        this.toggleVisibility(grid, position, 0, 1);
    };
    /**
     * Updates and positions a label element.
     *
     * @ignore Exclude from docs
     * @param {AxisLabel}  label        Label element
     * @param {number}     position     Starting position
     * @param {number}     endPosition  Ending position
     */
    AxisRendererRadial.prototype.updateLabelElement = function (label, position, endPosition) {
        position = position + (endPosition - position) * label.location;
        var point = this.positionToPoint(position);
        this.positionItem(label, point);
        this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
    };
    /**
     * Updates and positions the base grid element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererRadial.prototype.updateBaseGridElement = function () {
        // @todo? zero grid for radar chart, is it needed?
    };
    /**
     * Checks if point is within bounds of a container.
     *
     * @ignore Exclude from docs
     * @param  {IPoint}   point Point coordinates
     * @return {boolean}         Fits?
     */
    AxisRendererRadial.prototype.fitsToBounds = function (point) {
        return true;
    };
    Object.defineProperty(AxisRendererRadial.prototype, "startAngle", {
        /**
         * Returns currently set start angle.
         *
         * @todo Description (units)
         * @return {number} Start angle
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
        /**
         * Sets start angle of the axis.
         *
         * @todo Description (units)
         * @param {number} value Start angle
         */
        set: function (value) {
            // do not normalize angel here!
            this.setPropertyValue("startAngle", value);
            this.invalidateAxisItems();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererRadial.prototype, "endAngle", {
        /**
         * Returns currently set end angle.
         *
         * @todo Description (units)
         * @return {number} End angle
         */
        get: function () {
            return this.getPropertyValue("endAngle");
        },
        /**
         * Sets end angle of the axis.
         *
         * @todo Description (units)
         * @param {number} value end angle
         */
        set: function (value) {
            // do not normalize angel here!
            this.setPropertyValue("endAngle", value);
            this.invalidateAxisItems();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererRadial.prototype, "axisAngle", {
        /**
         * Returns currently set axis angle.
         *
         * @todo Description (units)
         * @return {number} Axis angle
         */
        get: function () {
            return this.getPropertyValue("axisAngle");
            //return $math.fitToRange(this.getPropertyValue("axisAngle"), this.startAngle, this.endAngle); // no good, as less flexible
        },
        /**
         * Sets the angle of the radial axis.
         *
         * @todo Description (units)
         * @param {number} value Axis angle
         */
        set: function (value) {
            this.setPropertyValue("axisAngle", __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["normalizeAngle"](value));
            this.invalidateAxisItems();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisRendererRadial.prototype, "gridType", {
        /**
         * Returns currently set grid type.
         *
         * @type {"circles" | "polygons"} Grid type
         */
        get: function () {
            var axis = this.chart.xAxes.getIndex(0);
            if (axis instanceof __WEBPACK_IMPORTED_MODULE_1__CategoryAxis__["a" /* CategoryAxis */]) {
                return this.getPropertyValue("gridType");
            }
            else {
                return "circles";
            }
        },
        // polygons grid type is only possible under these conditions: xAxis is available and it is CategoryAxis, also at least one series should be added to a chart
        /**
         * Sets the grid type for radia axis.
         *
         * A grid on radia axis can either be perfect circles ("circles"), or
         * straight lines ("polygons").
         *
         * @param {"circles" | "polygons"}  value  Grid type
         */
        set: function (value) {
            var _this = this;
            if (this.setPropertyValue("gridType", value, true)) {
                var axisBreaks = this.axis.axisBreaks;
                __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__["each"](axisBreaks.iterator(), function (axisBreak) {
                    _this.createBreakSprites(axisBreak);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [getPositionRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}  startPosition  Starting position
     * @param  {number}  endPosition    End position
     * @return {string}                 SVG path
     */
    AxisRendererRadial.prototype.getPositionRangePath = function (startPosition, endPosition) {
        var pixelInnerRadius = this.pixelInnerRadius;
        var pixelRadius = this.axisLength + pixelInnerRadius;
        var innerRadius = __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["fitToRange"](this.positionToCoordinate(startPosition), pixelInnerRadius, pixelRadius);
        var radius = __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["fitToRange"](this.positionToCoordinate(endPosition), pixelInnerRadius, pixelRadius);
        //let angleCount: number = this.angleCount;
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        var arc = endAngle - startAngle;
        var path;
        var chart = this.chart;
        var xAxis = chart.xAxes.getIndex(0);
        var count = chart.dataItems.length;
        var series = chart.series.getIndex(0);
        // polygons are only possible if x axis is present
        // @todo: review this
        if (this.gridType == "polygons" && count > 0 && series && xAxis && xAxis instanceof __WEBPACK_IMPORTED_MODULE_1__CategoryAxis__["a" /* CategoryAxis */]) {
            var gridLocation = xAxis.renderer.grid.template.location;
            var angle = xAxis.getAngle(series.dataItems.getIndex(0), "categoryX", gridLocation);
            path = __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["moveTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](angle) });
            var count_2 = chart.dataItems.length;
            for (var i = 1; i < count_2; i++) {
                angle = xAxis.getAngle(series.dataItems.getIndex(i), "categoryX", gridLocation);
                path += __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["lineTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](angle) });
            }
            angle = xAxis.getAngle(series.dataItems.getIndex(count_2 - 1), "categoryX", xAxis.renderer.cellEndLocation);
            path += __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["lineTo"]({ x: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](angle) });
            path += __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["moveTo"]({ x: innerRadius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](angle), y: innerRadius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](angle) });
            for (var i = count_2 - 1; i >= 0; i--) {
                angle = xAxis.getAngle(series.dataItems.getIndex(i), "categoryX", gridLocation);
                path += __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["lineTo"]({ x: innerRadius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](angle), y: innerRadius * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](angle) });
            }
        }
        else {
            path = __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["arc"](startAngle, arc, radius, innerRadius);
        }
        return path;
    };
    /**
     * Updates and positions an axis break element.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Break element
     */
    AxisRendererRadial.prototype.updateBreakElement = function (axisBreak) {
        // @todo: someday we might need axis break when gridType is polygons
        var startLine = axisBreak.startLine;
        var endLine = axisBreak.endLine;
        var fillShape = axisBreak.fillShape;
        var startPoint = axisBreak.startPoint;
        var endPoint = axisBreak.endPoint;
        startLine.radius = Math.abs(startPoint.y);
        endLine.radius = Math.abs(endPoint.y);
        fillShape.radius = Math.abs(endPoint.y);
        fillShape.innerRadius = Math.abs(startPoint.y);
    };
    /**
     * Creates visual elements for and axis break.
     *
     * @ignore Exclude from docs
     * @param {AxisBreak} axisBreak Axis break
     */
    AxisRendererRadial.prototype.createBreakSprites = function (axisBreak) {
        axisBreak.startLine = new __WEBPACK_IMPORTED_MODULE_2__core_elements_WavedCircle__["a" /* WavedCircle */]();
        axisBreak.endLine = new __WEBPACK_IMPORTED_MODULE_2__core_elements_WavedCircle__["a" /* WavedCircle */]();
        axisBreak.fillShape = new __WEBPACK_IMPORTED_MODULE_2__core_elements_WavedCircle__["a" /* WavedCircle */]();
    };
    /**
     * Updates some of the Axis tooltip's visual properties, related to
     * rendering of the Axis.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    AxisRendererRadial.prototype.updateTooltip = function () {
        var axis = this.axis;
        if (axis) {
            var bigNum = 4000;
            var bbx = -4000;
            var bby = -4000;
            var bbw = bigNum * 2;
            var bbh = bigNum * 2;
            var axisAngle = this.axisAngle;
            if (axisAngle < 0) {
                axisAngle += 360;
            }
            var tooltipOrientation = "vertical";
            if ((axisAngle > 45 && axisAngle < 135) || (axisAngle > 225 && axisAngle < 315)) {
                tooltipOrientation = "horizontal";
            }
            this.axis.updateTooltip(tooltipOrientation, { x: bbx, y: bby, width: bbw, height: bbh });
        }
    };
    /**
     * Updates and positions a tick element.
     *
     * @ignore Exclude from docs
     * @param {AxisTick}  tick      Tick element
     * @param {number}    position  Position
     */
    AxisRendererRadial.prototype.updateTickElement = function (tick, position) {
        var point = this.positionToPoint(position);
        if (tick.element) {
            var angle = __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["normalizeAngle"](this.axisAngle + 90);
            if (angle / 90 != Math.round(angle / 90)) {
                tick.pixelPerfect = false;
            }
            else {
                tick.pixelPerfect = true;
            }
            var tickLength = -tick.length;
            if (tick.inside) {
                tickLength *= -1;
            }
            tick.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_8__core_rendering_Path__["lineTo"]({ x: tickLength * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](angle), y: tickLength * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](angle) }) });
        }
        this.positionItem(tick, point);
        this.toggleVisibility(tick, position, 0, 1);
    };
    /**
     * Converts a position on the axis to a coordinate in pixels.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position (0-1)
     * @return {number}            Coordinate (px)
     */
    AxisRendererRadial.prototype.positionToCoordinate = function (position) {
        var coordinate;
        var axis = this.axis;
        var axisFullLength = axis.axisFullLength;
        var innerRadius = this.pixelInnerRadius;
        if (axis.renderer.inversed) {
            coordinate = (axis.end - position) * axisFullLength + innerRadius;
        }
        else {
            coordinate = (position - axis.start) * axisFullLength + innerRadius;
        }
        return __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["round"](coordinate, 1);
    };
    return AxisRendererRadial;
}(__WEBPACK_IMPORTED_MODULE_0__AxisRendererY__["a" /* AxisRendererY */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_5__core_Registry__["b" /* registry */].registeredClasses["AxisRendererRadial"] = AxisRendererRadial;
//# sourceMappingURL=AxisRendererRadial.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClockHand; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Circle__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_Trapezoid__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__ = __webpack_require__(2);
/**
 * Functionality for drawing simple ClockHands
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */









/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * ClockHand class is capable of drawing a simple pointy shape with optionally
 * rounderd corners and an icon.
 *
 * @see {@link IClockHandEvents} for a list of available events
 * @see {@link IClockHandAdapters} for a list of available Adapters
 * @todo Improve
 * @important
 */
var ClockHand = /** @class */ (function (_super) {
    __extends(ClockHand, _super);
    /**
     * Constructor
     */
    function ClockHand() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * An Axis hand is related to.
         *
         * @type {MutableValueDisposer<Axis>}
         */
        _this._axis = new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "ClockHand";
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        _this.fill = interfaceColors.getFor("alternativeBackground");
        _this.stroke = _this.fill;
        var pin = new __WEBPACK_IMPORTED_MODULE_1__core_elements_Circle__["a" /* Circle */]();
        pin.radius = 5;
        _this.pin = pin;
        _this.isMeasured = false;
        _this.startWidth = 5;
        _this.endWidth = 1;
        _this.width = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(100);
        _this.height = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(100);
        _this.radius = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(100);
        _this.innerRadius = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(0);
        var hand = new __WEBPACK_IMPORTED_MODULE_2__core_elements_Trapezoid__["a" /* Trapezoid */]();
        _this.hand = hand;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Re(validates) the clock hand, effectively redrawing it.
     *
     * @ignore Exclude from docs
     */
    ClockHand.prototype.validate = function () {
        _super.prototype.validate.call(this);
        var hand = this.hand;
        hand.width = this.pixelWidth;
        var h = Math.max(this.startWidth, this.endWidth);
        hand.height = h;
        hand.leftSide = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(this.startWidth / h * 100);
        hand.rightSide = Object(__WEBPACK_IMPORTED_MODULE_4__core_utils_Percent__["c" /* percent */])(this.endWidth / h * 100);
        if (this.axis) {
            var renderer = this.axis.renderer;
            var x0 = __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__["relativeRadiusToValue"](this.innerRadius, renderer.pixelRadius);
            var x1 = __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__["relativeRadiusToValue"](this.radius, renderer.pixelRadius);
            hand.x = x0;
            hand.y = -h / 2;
            hand.width = x1 - x0;
        }
    };
    Object.defineProperty(ClockHand.prototype, "pin", {
        /**
         * @return {Circle} Pin element
         */
        get: function () {
            return this._pin;
        },
        /**
         * A circle element used as hand's base. (pin)
         *
         * @param {Circle}  pin  Pin element
         */
        set: function (pin) {
            if (this._pin) {
                this.removeDispose(this._pin);
            }
            if (pin) {
                this._pin = pin;
                pin.parent = this;
                this._disposers.push(pin);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockHand.prototype, "hand", {
        /**
         * @return {Trapezoid} Hand element
         */
        get: function () {
            return this._hand;
        },
        /**
         * A trapezoid shape used for hand itself.
         *
         * The shape of the trapezoid is controlled by ClockHand's `startWidth` and
         * `endWidth` properties.
         *
         * Set `endWidth` to 1 (px) to make it pointy.
         *
         * @param {Trapezoid}  hand  Hand element
         */
        set: function (hand) {
            if (this._hand) {
                this.removeDispose(this._hand);
            }
            if (hand) {
                this._hand = hand;
                hand.parent = this;
                this._disposers.push(hand);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockHand.prototype, "radius", {
        /**
         * @return {number} Radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Radius of the hand's outer end. (tip)
         *
         * Absolute (px) or relative ([[Percent]]).
         *
         * @default Percent(0)
         * @param {number | Percent}  value  Radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockHand.prototype, "innerRadius", {
        /**
         * @return {number} Radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Radius of the hand's inner end. (base)
         *
         * Absolute (px) or relative ([[Percent]]).
         *
         * @default Percent(0)
         * @param {number | Percent}  value  Radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockHand.prototype, "startWidth", {
        /**
         * @return {number} Width (px)
         */
        get: function () {
            return this.getPropertyValue("startWidth");
        },
        /**
         * Width, in pixels, of the clock hand's inner end. (base)
         *
         * @default 5
         * @param {number}  value  Width (px)
         */
        set: function (value) {
            this.setPropertyValue("startWidth", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockHand.prototype, "endWidth", {
        /**
         * @return {number} Width (px)
         */
        get: function () {
            return this.getPropertyValue("endWidth");
        },
        /**
         * Width, in pixels, of the clock hand's outer end. (tip)
         *
         * @default 1
         * @param {number}  value  Width (px)
         */
        set: function (value) {
            this.setPropertyValue("endWidth", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockHand.prototype, "rotationDirection", {
        /**
         * @return {"any" | "clockWise" | "counterClockWise"} rotationDirection
         */
        get: function () {
            return this.getPropertyValue("rotationDirection");
        },
        /**
         * Rotation direction
         *
         * @default any
         * @param {"any" | "clockWise" | "counterClockWise"}  value
         */
        set: function (value) {
            this.setPropertyValue("rotationDirection", value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Moves clock hand to particular value.
     *
     * If `duration` is set to a number in milliseconds, the hand will move
     * to the new position gracefully, rather than jumping rigth to it.
     *
     * Alternatively, you can also set `value` directly.
     *
     * @param {any}     value     New value
     * @param {number}  duration  Animation duration (ms)
     * @param {(value:number)=>number}  easing  Animation easing function
     */
    ClockHand.prototype.showValue = function (value, duration, easing) {
        this._value = value;
        if (value != undefined) {
            if (!__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isNumber"](duration)) {
                duration = 0;
            }
            if (this.axis) {
                var renderer = this.axis.renderer;
                var newAngle = renderer.positionToAngle(this.axis.anyToPosition(value));
                var currentAngle = this.rotation;
                if (this.rotationDirection == "clockWise") {
                    if (newAngle < currentAngle) {
                        this.rotation = currentAngle - 360;
                    }
                }
                if (this.rotationDirection == "counterClockWise") {
                    if (newAngle > currentAngle) {
                        this.rotation = currentAngle + 360;
                    }
                }
                this.animate({ property: "rotation", to: newAngle }, duration, easing);
            }
        }
    };
    Object.defineProperty(ClockHand.prototype, "value", {
        /**
         * @return {any} Value
         */
        get: function () {
            return this._value;
        },
        /**
         * A current value clock hand is pointing to.
         *
         * @param {any}  value  Value
         */
        set: function (value) {
            this.showValue(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClockHand.prototype, "axis", {
        /**
         * @return {Axis} Axis
         */
        get: function () {
            return this._axis.get();
        },
        /**
         * An Axis clock hand is associated with.
         *
         * Hand's `value` relates to values on the Axis.
         *
         * @param {Axis}  axis  Axis
         */
        set: function (axis) {
            var _this = this;
            if (this.axis != axis) {
                this._axis.set(axis, new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["c" /* MultiDisposer */]([
                    axis.events.on("datavalidated", function () { return _this.updateValue(); }),
                    axis.events.on("datarangechanged", function () { return _this.updateValue(); }),
                    axis.events.on("valueschanged", function () { return _this.updateValue(); }),
                    axis.events.on("propertychanged", function () { return _this.invalidate(); })
                ]));
            }
            if (axis) {
                var chart = axis.chart;
                if (chart) {
                    this.rotation = chart.startAngle;
                }
            }
            this.parent = axis.renderer;
            this.zIndex = 5;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Triggers `value` accessor, so that Hand animates to new position, in case
     * value has changed.
     *
     * @ignore Exclude from docs
     */
    ClockHand.prototype.updateValue = function () {
        this.value = this.value;
    };
    /**
 * Processes JSON-based config before it is applied to the object.
 *
 * @ignore Exclude from docs
 * @param {object}  config  Config
 */
    ClockHand.prototype.processConfig = function (config) {
        if (config) {
            // Connect clock hands with axes
            if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](config.axis) && __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isString"](config.axis) && this.map.hasKey(config.axis)) {
                config.axis = this.map.getKey(config.axis);
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return ClockHand;
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_5__core_Registry__["b" /* registry */].registeredClasses["ClockHand"] = ClockHand;
//# sourceMappingURL=ClockHand.js.map

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PieChartDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PieChart; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SerialChart__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__series_PieSeries__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Type__ = __webpack_require__(2);
/**
 * Pie chart module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */








/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[PieChart]].
 *
 * @see {@link DataItem}
 */
var PieChartDataItem = /** @class */ (function (_super) {
    __extends(PieChartDataItem, _super);
    /**
     * Constructor
     */
    function PieChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "PieChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return PieChartDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__SerialChart__["b" /* SerialChartDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Pie chart.
 *
 * ```TypeScript
 * // Includes
 * import * as am4core from "@amcharts/amcharts4/core";
 * import * as am4charts from "@amcharts/amcharts4/charts";
 *
 * // Create chart
 * let chart = am4core.create("chartdiv", am4charts.PieChart);
 *
 * // Set data
 * chart.data = [{
 * 	"country": "Lithuania",
 * 	"litres": 501.9
 * }, {
 * 	"country": "Czech Republic",
 * 	"litres": 301.9
 * }, {
 * 	"country": "Ireland",
 * 	"litres": 201.1
 * }];
 *
 * // Create series
 * let series = chart.series.push(new am4charts.PieSeries());
 * series.dataFields.value = "litres";
 * series.dataFields.category = "country";
 * ```
 * ```JavaScript
 * // Create chart
 * var chart = am4core.create("chartdiv", am4charts.PieChart);
 *
 * // The following would work as well:
 * // var chart = am4core.create("chartdiv", "PieChart");
 *
 * // Set data
 * chart.data = [{
 * 	"country": "Lithuania",
 * 	"litres": 501.9
 * }, {
 * 	"country": "Czech Republic",
 * 	"litres": 301.9
 * }, {
 * 	"country": "Ireland",
 * 	"litres": 201.1
 * }];
 *
 * // Create series
 * var series = chart.series.push(new am4charts.PieSeries());
 * series.dataFields.value = "litres";
 * series.dataFields.category = "country";
 * ```
 * ```JSON
 * var chart = am4core.createFromConfig({
 *
 * 	// Series
 * 	"series": [{
 * 		"type": "PieSeries",
 * 		"dataFields": {
 * 			"value": "litres",
 * 			"category": "country"
 * 		}
 * 	}],
 *
 * 	// Data
 * 	"data": [{
 * 		"country": "Lithuania",
 * 		"litres": 501.9
 * 	}, {
 * 		"country": "Czech Republic",
 * 		"litres": 301.9
 * 	}, {
 * 		"country": "Ireland",
 * 		"litres": 201.1
 * 	}]
 *
 * }, "chartdiv", "PieChart");
 * ```
 *
 * @see {@link IPieChartEvents} for a list of available Events
 * @see {@link IPieChartAdapters} for a list of available Adapters
 * @important
 */
var PieChart = /** @class */ (function (_super) {
    __extends(PieChart, _super);
    /**
     * Constructor
     */
    function PieChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "PieChart";
        // Set defaults
        _this.innerRadius = 0;
        _this.radius = Object(__WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["c" /* percent */])(80);
        _this.align = "none";
        _this.valign = "none";
        _this.startAngle = -90;
        _this.endAngle = 270;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    PieChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["hasValue"](this.readerTitle)) {
            this.readerTitle = this.language.translate("Pie chart");
        }
    };
    /**
     * (Re)validates the chart, causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    PieChart.prototype.validate = function () {
        _super.prototype.validate.call(this);
        this.updateRadius();
    };
    /**
     * Recalculates pie's radius, based on a number of criteria.
     *
     * @ignore Exclude from docs
     */
    PieChart.prototype.updateRadius = function () {
        var _this = this;
        var chartCont = this.chartContainer;
        var rect = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["getArcRect"](this.startAngle, this.endAngle, 1);
        var innerRect = { x: 0, y: 0, width: 0, height: 0 };
        var innerRadius = this.innerRadius;
        if (innerRadius instanceof __WEBPACK_IMPORTED_MODULE_1__core_utils_Percent__["a" /* Percent */]) {
            innerRect = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["getArcRect"](this.startAngle, this.endAngle, innerRadius.value);
        }
        // @todo handle this when innerRadius set in pixels (do it for radar also)
        rect = __WEBPACK_IMPORTED_MODULE_6__core_utils_Math__["getCommonRectangle"]([rect, innerRect]);
        var maxRadius = Math.min(chartCont.innerWidth / rect.width, chartCont.innerHeight / rect.height);
        var radius = __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["relativeRadiusToValue"](this.radius, maxRadius);
        var pixelInnerRadius = __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["relativeRadiusToValue"](this.innerRadius, maxRadius);
        var seriesRadius = (radius - pixelInnerRadius) / this.series.length;
        //@todo: make it possible to set series radius in percent
        __WEBPACK_IMPORTED_MODULE_4__core_utils_Iterator__["each"](__WEBPACK_IMPORTED_MODULE_4__core_utils_Iterator__["indexed"](this.series.iterator()), function (a) {
            var i = a[0];
            var series = a[1];
            // todo: set this on default state instead?
            series.radius = pixelInnerRadius + seriesRadius * (i + 1);
            series.innerRadius = pixelInnerRadius + seriesRadius * i;
            series.startAngle = _this.startAngle;
            series.endAngle = _this.endAngle;
        });
        var x0 = rect.x;
        var y0 = rect.y;
        var x1 = rect.x + rect.width;
        var y1 = rect.y + rect.height;
        var point = { x: this.seriesContainer.maxWidth / 2 - radius * (x0 + (x1 - x0) / 2), y: this.seriesContainer.maxHeight / 2 - radius * (y0 + (y1 - y0) / 2) };
        __WEBPACK_IMPORTED_MODULE_4__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            series.moveTo(point);
        });
        this.bulletsContainer.moveTo(point);
    };
    /**
     * Setups the legend to use the chart's data.
     */
    PieChart.prototype.feedLegend = function () {
        var legend = this.legend;
        if (legend) {
            var legendData_1 = [];
            __WEBPACK_IMPORTED_MODULE_4__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
                __WEBPACK_IMPORTED_MODULE_4__core_utils_Iterator__["each"](series.dataItems.iterator(), function (dataItem) {
                    legendData_1.push(dataItem);
                });
            });
            legend.data = legendData_1;
            legend.dataFields.name = "category";
            legend.itemContainers.template.propertyFields.disabled = "hiddenInLegend";
        }
    };
    Object.defineProperty(PieChart.prototype, "radius", {
        /**
         * @return {number} Radius (px or relative)
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Sets radius of the pie chart.
         *
         * Setting to a number will mean a fixed pixel radius.
         *
         * Setting to an instance of [[Percent]] will mean a relative radius to
         * available space.
         *
         * E.g.:
         *
         * ```TypeScript
         * // Set pie chart to be at 50% of the available space
         * pieChart.radius = am4core.percent.percent(50);
         * ```
         * ```JavaScript
         * // Set pie chart to be at 50% of the available space
         * pieChart.radius = am4core.percent.percent(50);
         * ```
         * ```JSON
         * {
         *   // Set pie chart to be at 50% of the available space
         *   "radius": "50%"
         * }
         * ```
         *
         * @param {number | Percent}  value  Radius (px or relative)
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieChart.prototype, "innerRadius", {
        /**
         * @return {number} Relative inner radius (0-1)
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Sets relative inner radius (to create a donut chart).
         *
         * The inner radius is relative to pie's radius:
         * * 0 - solid pie (no hole inside);
         * * 0.5 - hole is half the radius of the pie;
         * * 1 - does not make sense, because the hole will take up the whole radius.
         *
         * @param {number | Percent}  value  Relative inner radius (0-1)
         * @todo Setting things like `innerRadius` modifies `slice.radius` and it then looks like it is not the same value as in default state
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new [[PieSeries]].
     *
     * @return {PieSeries} New series
     */
    PieChart.prototype.createSeries = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__series_PieSeries__["a" /* PieSeries */]();
    };
    Object.defineProperty(PieChart.prototype, "startAngle", {
        /**
         * @return {number} Start angle (degrees)
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
        /**
         * Starting angle of the Pie circle. (degrees)
         *
         * Normally, a pie chart begins (the left side of the first slice is drawn)
         * at the top center. (at -90 degrees)
         *
         * You can use `startAngle` to change this setting.
         *
         * E.g. setting this to 0 will make the first slice be drawn to the right.
         *
         * For a perfect circle the absolute sum of `startAngle` and `endAngle`
         * needs to be 360.
         *
         * However, it's **not** necessary to do so. You can set to those lesser
         * numbers, to create semi-circles.
         *
         * E.g. `startAngle = -90` with `endAngle = 0` will create a Pie chart that
         * looks like a quarter of a circle.
         *
         * @default -90
         * @param {number}  value  Start angle (degrees)
         */
        set: function (value) {
            this.setPropertyValue("startAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieChart.prototype, "endAngle", {
        /**
         * @return {number} End angle (degrees)
         */
        get: function () {
            return this.getPropertyValue("endAngle");
        },
        /**
         * End angle of the Pie circle. (degrees)
         *
         * Normally, a pie chart ends (the right side of the last slice is drawn)
         * at the top center. (at 270 degrees)
         *
         * You can use `endAngle` to change this setting.
         *
         * For a perfect circle the absolute sum of `startAngle` and `endAngle`
         * needs to be 360.
         *
         * However, it's **not** necessary to do so. You can set to those lesser
         * numbers, to create semi-circles.
         *
         * E.g. `startAngle = -90` with `endAngle = 0` will create a Pie chart that
         * looks like a quarter of a circle.
         *
         * @default 270
         * @param {number}  value  End angle (degrees)
         */
        set: function (value) {
            this.setPropertyValue("endAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @ignore
     */
    PieChart.prototype.setLegend = function (legend) {
        _super.prototype.setLegend.call(this, legend);
        if (legend) {
            legend.labels.template.text = "{category}";
            legend.valueLabels.template.text = "{value.percent.formatNumber('#.0')}%";
            legend.itemContainers.template.events.on("over", function (event) {
                var pieSeriesDataItem = event.target.dataItem.dataContext;
                if (pieSeriesDataItem.visible && !pieSeriesDataItem.isHiding) {
                    pieSeriesDataItem.slice.isHover = true;
                }
            });
            legend.itemContainers.template.events.on("out", function (event) {
                var pieSeriesDataItem = event.target.dataItem.dataContext;
                pieSeriesDataItem.slice.isHover = false;
            });
        }
    };
    return PieChart;
}(__WEBPACK_IMPORTED_MODULE_0__SerialChart__["a" /* SerialChart */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["b" /* registry */].registeredClasses["PieChart"] = PieChart;
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["b" /* registry */].registeredClasses["PieChartDataItem"] = PieChartDataItem;
//# sourceMappingURL=PieChart.js.map

/***/ }),

/***/ 236:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PieTick; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__elements_Tick__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Disposer__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/**
 * Pie tick module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws an tick line for a pie slice connecting it to a related label.
 *
 * @see {@link IPieTickEvents} for a list of available events
 * @see {@link IPieTickAdapters} for a list of available Adapters
 */
var PieTick = /** @class */ (function (_super) {
    __extends(PieTick, _super);
    /**
     * Constructor
     */
    function PieTick() {
        var _this = _super.call(this) || this;
        /**
         * A label element this tick is attached to.
         *
         * @type {MutableValueDisposer}
         */
        _this._label = new __WEBPACK_IMPORTED_MODULE_1__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        /**
         * A slice element this tick is attached to.
         *
         * @type {MutableValueDisposer}
         */
        _this._slice = new __WEBPACK_IMPORTED_MODULE_1__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "PieTick";
        _this.element = _this.paper.add("polyline");
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the tick element.
     *
     * @ignore Exclude from docs
     */
    PieTick.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var slice = this.slice;
        var label = this.label;
        var series = slice.dataItem.component;
        if (slice && slice.radius > 0 && label && label.text) {
            var x0 = slice.dx + slice.slice.dx + slice.pixelX + slice.ix * slice.radius * slice.scale;
            var y0 = slice.dy + slice.slice.dy + slice.pixelY + slice.iy * slice.radius * slice.scale;
            var x1 = void 0;
            var y1 = void 0;
            var x2 = void 0;
            var y2 = void 0;
            if (series.alignLabels) {
                x1 = label.pixelX - this.length;
                y1 = label.pixelY;
                x2 = label.pixelX;
                y2 = y1;
                if (label.horizontalCenter == "right") {
                    x1 += 2 * this.length;
                    x2 = x1 - this.length;
                }
            }
            else {
                x1 = x0 + label.radius * slice.ix;
                y1 = y0 + label.radius * slice.iy;
                x2 = x1;
                y2 = y1;
            }
            this.element.attr({ "points": [x0, y0, x1, y1, x2, y2] });
        }
    };
    Object.defineProperty(PieTick.prototype, "slice", {
        /**
         * @return {Slice} Slice
         */
        get: function () {
            return this._slice.get();
        },
        /**
         * Slice element tick is attached to.
         *
         * @param {Slice}  slice  Slice
         */
        set: function (slice) {
            this._slice.set(slice, new __WEBPACK_IMPORTED_MODULE_1__core_utils_Disposer__["c" /* MultiDisposer */]([
                slice.events.on("transformed", this.invalidate, this),
                slice.events.on("validated", this.invalidate, this)
            ]));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieTick.prototype, "label", {
        /**
         * @return {AxisLabelCircular} Label
         */
        get: function () {
            return this._label.get();
        },
        /**
         * Label element tick is attached to.
         *
         * @param {AxisLabelCircular}  label  Label
         */
        set: function (label) {
            this._label.set(label, label.events.on("transformed", this.invalidate, this));
        },
        enumerable: true,
        configurable: true
    });
    return PieTick;
}(__WEBPACK_IMPORTED_MODULE_0__elements_Tick__["a" /* Tick */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["PieTick"] = PieTick;
//# sourceMappingURL=PieTick.js.map

/***/ }),

/***/ 237:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PieSeries3DDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PieSeries3D; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__series_PieSeries__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_3d_Slice3D__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(2);
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[PieSeries3D]].
 *
 * @see {@link DataItem}
 */
var PieSeries3DDataItem = /** @class */ (function (_super) {
    __extends(PieSeries3DDataItem, _super);
    /**
     * Constructor
     */
    function PieSeries3DDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "PieSeries3DDataItem";
        _this.values.depthValue = {};
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(PieSeries3DDataItem.prototype, "depthValue", {
        /**
         * @return {number} Depth
         */
        get: function () {
            return this.values["depthValue"].value;
        },
        /**
         * Slice depth (height).
         *
         * @param {number}  value  Depth
         */
        set: function (value) {
            this.setValue("depthValue", value);
        },
        enumerable: true,
        configurable: true
    });
    return PieSeries3DDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__series_PieSeries__["b" /* PieSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a slice series on a 3D pie chart.
 *
 * @see {@link IPieSeries3DEvents} for a list of available Events
 * @see {@link IPieSeries3DAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var PieSeries3D = /** @class */ (function (_super) {
    __extends(PieSeries3D, _super);
    /**
     * Constructor
     */
    function PieSeries3D() {
        var _this = _super.call(this) || this;
        _this.className = "PieSeries3D";
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object
     * @see {@link DataItem}
     * @return {PieSeries3DDataItem} Data Item
     */
    PieSeries3D.prototype.createDataItem = function () {
        return new PieSeries3DDataItem();
    };
    /**
     * Creates and returns a new slice element.
     *
     * @param  {typeof Slice}  sliceType  Type of the slice element
     * @return {Slice3D}                  Slice
     */
    PieSeries3D.prototype.initSlice = function (sliceType) {
        var slice = _super.prototype.initSlice.call(this, __WEBPACK_IMPORTED_MODULE_1__core_elements_3d_Slice3D__["a" /* Slice3D */]);
        return slice;
    };
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {PieSeries3DDataItem}  dataItem  Data item
     */
    PieSeries3D.prototype.validateDataElement = function (dataItem) {
        _super.prototype.validateDataElement.call(this, dataItem);
        var slice = dataItem.slice;
        var depth = this.depth;
        if (!__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](depth)) {
            depth = this.chart.depth;
        }
        var depthPercent = dataItem.values.depthValue.percent;
        if (!__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](depthPercent)) {
            depthPercent = 100;
        }
        slice.depth = depthPercent * depth / 100;
        var angle = this.angle;
        if (!__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](angle)) {
            angle = this.chart.angle;
        }
        slice.angle = angle;
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    PieSeries3D.prototype.validate = function () {
        _super.prototype.validate.call(this);
        for (var i = this._workingStartIndex; i < this._workingEndIndex; i++) {
            var dataItem = this.dataItems.getIndex(i);
            var slice = dataItem.slice;
            var startAngle = slice.startAngle;
            // find quarter
            //q0 || q1
            if ((startAngle >= -90 && startAngle < 90)) {
                slice.toFront();
            }
            //q2 || q3
            else if ((startAngle >= 90)) {
                slice.toBack();
            }
        }
    };
    Object.defineProperty(PieSeries3D.prototype, "depth", {
        /**
         * @return {number} Depth (px)
         */
        get: function () {
            return this.getPropertyValue("depth");
        },
        /**
         * Depth (height) of the pie slice in pixels.
         *
         * @param {number}  value  Depth (px)
         */
        set: function (value) {
            this.setPropertyValue("depth", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeries3D.prototype, "angle", {
        /**
         * @return {number} Angle
         */
        get: function () {
            return this.getPropertyValue("angle");
        },
        /**
         * Angle of the view point of the 3D pie. (0-360)
         *
         * @param {number}  value  Angle
         */
        set: function (value) {
            this.setPropertyValue("angle", value);
        },
        enumerable: true,
        configurable: true
    });
    return PieSeries3D;
}(__WEBPACK_IMPORTED_MODULE_0__series_PieSeries__["a" /* PieSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["PieSeries3D"] = PieSeries3D;
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["PieSeries3DDataItem"] = PieSeries3DDataItem;
//# sourceMappingURL=PieSeries3D.js.map

/***/ }),

/***/ 244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TreeMapSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TreeMapSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ColumnSeries__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(2);
/**
 * TreeMap series module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[TreeMapSeries]].
 *
 * @see {@link DataItem}
 */
var TreeMapSeriesDataItem = /** @class */ (function (_super) {
    __extends(TreeMapSeriesDataItem, _super);
    /**
     * Constructor
     */
    function TreeMapSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "TreeMapSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(TreeMapSeriesDataItem.prototype, "parentName", {
        /**
         * Data for the this particular item.
         *
         * @param {Object}  value  Item's data
         */
        //public set dataContext(value: Object) {
        //	this._dataContext = value;
        //}
        /**
         * @return {Object} Item's data
         */
        /*
       public get dataContext(): Object {
           // It's because data of tree series is TreeMapDataItems.
           if (this._dataContext) {
               return (<any>this._dataContext).dataContext;
           }
       }*/
        /**
         * The name of the item's parent item.
         *
         * @return {string} Parent name
         */
        get: function () {
            var treeMapDataItem = this.treeMapDataItem;
            if (treeMapDataItem && treeMapDataItem.parent) {
                return treeMapDataItem.parent.name;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapSeriesDataItem.prototype, "value", {
        /**
         * Item's numeric value.
         *
         * @readonly
         * @return {number} Value
         */
        get: function () {
            return this.treeMapDataItem.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapSeriesDataItem.prototype, "treeMapDataItem", {
        /**
         * A corresponding data item from the tree map.
         *
         * @readonly
         * @return {TreeMapDataItem} Data item
         */
        get: function () {
            return this._dataContext;
        },
        enumerable: true,
        configurable: true
    });
    return TreeMapSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__ColumnSeries__["b" /* ColumnSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines Series for a TreeMap chart.
 *
 * @see {@link ITreeMapSeriesEvents} for a list of available Events
 * @see {@link ITreeMapSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var TreeMapSeries = /** @class */ (function (_super) {
    __extends(TreeMapSeries, _super);
    /**
     * Constructor
     */
    function TreeMapSeries() {
        var _this = _super.call(this) || this;
        _this.className = "TreeMapSeries";
        _this.applyTheme();
        _this.fillOpacity = 1;
        _this.strokeOpacity = 1;
        _this.minBulletDistance = 0;
        _this.columns.template.tooltipText = "{parentName} {name}: {value}"; //@todo add format number?
        _this.columns.template.configField = "config";
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_2__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        _this.stroke = interfaceColors.getFor("stroke");
        _this.dataFields.openValueX = "x0";
        _this.dataFields.valueX = "x1";
        _this.dataFields.openValueY = "y0";
        _this.dataFields.valueY = "y1";
        _this.sequencedInterpolation = false;
        // otherwise nodes don't stack nicely to each other
        _this.columns.template.pixelPerfect = false;
        return _this;
    }
    /**
     * Processes data item.
     *
     * @param {TreeMapSeriesDataItem}  dataItem     Data item
     * @param {Object}                 dataContext  Raw data
     * @param {number}                 index        Index of the data item
     */
    TreeMapSeries.prototype.processDataItem = function (dataItem, dataContext, index) {
        dataContext.seriesDataItem = dataItem; // save a reference here. dataContext is TreeMapDataItem and we need to know dataItem sometimes
        _super.prototype.processDataItem.call(this, dataItem, dataContext, index);
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {TreeMapSeriesDataItem} Data Item
     */
    TreeMapSeries.prototype.createDataItem = function () {
        return new TreeMapSeriesDataItem();
    };
    /**
     * Shows series.
     *
     * @param  {number}     duration  Duration of fade in (ms)
     * @return {Animation}            Animation
     */
    TreeMapSeries.prototype.show = function (duration) {
        return this.showReal(duration);
    };
    /**
     * Hides series.
     *
     * @param  {number}     duration  Duration of fade out (ms)
     * @return {Animation}            Animation
     */
    TreeMapSeries.prototype.hide = function (duration) {
        return this.hideReal(duration);
    };
    /**
     * Process values.
     *
     * @ignore Exclude from docs
     */
    TreeMapSeries.prototype.processValues = function () {
        // Just overriding so that inherited method does not kick in.
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    TreeMapSeries.prototype.processConfig = function (config) {
        if (config) {
            // Add empty data fields if the they are not set, so that XYSeries
            // dataField check does not result in error.
            if (!__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["hasValue"](config.dataFields) || !__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isObject"](config.dataFields)) {
                config.dataFields = {};
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return TreeMapSeries;
}(__WEBPACK_IMPORTED_MODULE_0__ColumnSeries__["a" /* ColumnSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["TreeMapSeries"] = TreeMapSeries;
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["TreeMapSeriesDataItem"] = TreeMapSeriesDataItem;
//# sourceMappingURL=TreeMapSeries.js.map

/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisRendererX3D; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axes_AxisRendererX__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Disposer__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__ = __webpack_require__(12);
/**
 * Module, defining Axis Renderer for horizontal 3D axes.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Renderer for horizontal 3D axis.
 *
 * @see {@link IAxisRendererX3DEvents} for a list of available events
 * @see {@link IAxisRendererX3DAdapters} for a list of available Adapters
 */
var AxisRendererX3D = /** @class */ (function (_super) {
    __extends(AxisRendererX3D, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRendererX3D(axis) {
        var _this = _super.call(this, axis) || this;
        /**
         * A related chart.
         *
         * @todo Description
         * @type {MutableValueDisposer}
         */
        _this._chart = new __WEBPACK_IMPORTED_MODULE_1__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "AxisRendererX3D";
        _this.applyTheme();
        return _this;
    }
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    AxisRendererX3D.prototype.updateGridElement = function (grid, position, endPosition) {
        position = position + (endPosition - position) * grid.location;
        var point = this.positionToPoint(position);
        if (grid.element) {
            var dx = this.chart.dx3D;
            var dy = this.chart.dy3D;
            var h = this.gridContainer.pixelHeight;
            grid.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: dx, y: dy }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: dx, y: h + dy }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: 0, y: h }) });
        }
        this.positionItem(grid, point);
        this.toggleVisibility(grid, position, 0, 1);
    };
    /**
     * Updates and positions the base grid element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererX3D.prototype.updateBaseGridElement = function () {
        _super.prototype.updateBaseGridElement.call(this);
        var h = this.gridContainer.pixelHeight;
        var dx = this.chart.dx3D;
        var dy = this.chart.dy3D;
        this.baseGrid.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: dx, y: dy }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: dx, y: h + dy }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: 0, y: h }) });
    };
    Object.defineProperty(AxisRendererX3D.prototype, "chart", {
        /**
         * Returns currently set associated chart.
         *
         * @ignore Exclude from docs
         * @return {XYChart3D} Chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * Sets a chart, associated with the Axis.
         *
         * @ignore Exclude from docs
         * @param {XYChart3D} value Chart
         */
        set: function (chart) {
            if (chart) {
                this._chart.set(chart, chart.events.on("propertychanged", this.handle3DChanged, this));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Invoked when 3D-related settings change, like depth or angle.
     *
     * @param {AMEvent<Sprite, ISpriteEvents>["propertychanged"]} event Event
     */
    AxisRendererX3D.prototype.handle3DChanged = function (event) {
        if (event.property == "depth" || event.property == "angle") {
            this.invalidate();
        }
    };
    return AxisRendererX3D;
}(__WEBPACK_IMPORTED_MODULE_0__axes_AxisRendererX__["a" /* AxisRendererX */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["AxisRendererX3D"] = AxisRendererX3D;
//# sourceMappingURL=AxisRendererX3D.js.map

/***/ }),

/***/ 246:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AxisRendererY3D; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axes_AxisRendererY__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Disposer__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_rendering_Path__ = __webpack_require__(12);
/**
 * Module, defining Axis Renderer for vertical 3D axes.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Renderer for vertical 3D axis.
 *
 * @see {@link IAxisRendererY3DEvents} for a list of available events
 * @see {@link IAxisRendererY3DAdapters} for a list of available Adapters
 */
var AxisRendererY3D = /** @class */ (function (_super) {
    __extends(AxisRendererY3D, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRendererY3D(axis) {
        var _this = _super.call(this, axis) || this;
        /**
         * A related chart.
         *
         * @todo Description
         * @type {MutableValueDisposer}
         */
        _this._chart = new __WEBPACK_IMPORTED_MODULE_1__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "AxisRendererY3D";
        _this.applyTheme();
        return _this;
    }
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    AxisRendererY3D.prototype.updateGridElement = function (grid, position, endPosition) {
        position = position + (endPosition - position) * grid.location;
        var point = this.positionToPoint(position);
        if (grid.element) {
            var dx = this.chart.dx3D;
            var dy = this.chart.dy3D;
            var w = this.gridContainer.pixelWidth;
            grid.element.attr({ "d": __WEBPACK_IMPORTED_MODULE_2__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_2__core_rendering_Path__["lineTo"]({ x: dx, y: dy }) + __WEBPACK_IMPORTED_MODULE_2__core_rendering_Path__["lineTo"]({ x: w + dx, y: dy }) });
        }
        this.positionItem(grid, point);
        this.toggleVisibility(grid, position, 0, 1);
    };
    /**
     * Updates and positions the base grid element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererY3D.prototype.updateBaseGridElement = function () {
        _super.prototype.updateBaseGridElement.call(this);
        var w = this.gridContainer.pixelWidth;
        this.baseGrid.element.attr({
            "d": __WEBPACK_IMPORTED_MODULE_2__core_rendering_Path__["moveTo"]({ x: 0, y: 0 })
                + __WEBPACK_IMPORTED_MODULE_2__core_rendering_Path__["lineTo"]({ x: w, y: 0 })
                + __WEBPACK_IMPORTED_MODULE_2__core_rendering_Path__["lineTo"]({ x: w + this.chart.dx3D, y: this.chart.dy3D })
        });
    };
    Object.defineProperty(AxisRendererY3D.prototype, "chart", {
        /**
         * Returns currently set associated chart.
         *
         * @ignore Exclude from docs
         * @return {XYChart3D} Chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * Sets a chart, associated with the Axis.
         *
         * @ignore Exclude from docs
         * @param {XYChart3D} value Chart
         */
        set: function (chart) {
            if (chart) {
                this._chart.set(chart, chart.events.on("propertychanged", this.handle3DChanged, this));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Invoked when 3D-related settings change, like depth or angle.
     *
     * @param {AMEvent<Sprite, ISpriteEvents>["propertychanged"]} event Event
     */
    AxisRendererY3D.prototype.handle3DChanged = function (event) {
        if (event.property == "depth" || event.property == "angle") {
            this.invalidate();
        }
    };
    return AxisRendererY3D;
}(__WEBPACK_IMPORTED_MODULE_0__axes_AxisRendererY__["a" /* AxisRendererY */]));

//# sourceMappingURL=AxisRendererY3D.js.map

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ColumnSeries3DDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ColumnSeries3D; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__series_ColumnSeries__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__elements_Column3D__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__ = __webpack_require__(12);
/**
 * 3D column series module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
var ColumnSeries3DDataItem = /** @class */ (function (_super) {
    __extends(ColumnSeries3DDataItem, _super);
    /**
     * Constructor
     */
    function ColumnSeries3DDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "ColumnSeries3DDataItem";
        _this.applyTheme();
        return _this;
    }
    return ColumnSeries3DDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__series_ColumnSeries__["b" /* ColumnSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a 3D column graph.
 *
 * @see {@link IColumnSeries3DEvents} for a list of available Events
 * @see {@link IColumnSeries3DAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var ColumnSeries3D = /** @class */ (function (_super) {
    __extends(ColumnSeries3D, _super);
    /**
     * Constructor
     */
    function ColumnSeries3D() {
        var _this = _super.call(this) || this;
        _this.className = "ColumnSeries3D";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(ColumnSeries3D.prototype, "columnsContainer", {
        get: function () {
            if (this.chart && this.chart.columnsContainer) {
                // @martynas: need to check aria-things here.
                return this.chart.columnsContainer;
            }
            else {
                return this._columnsContainer;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns an element to use for 3D bar.
     * @ignore
     * @return {this["_column"]} Element.
     */
    ColumnSeries3D.prototype.createColumnTemplate = function () {
        return new __WEBPACK_IMPORTED_MODULE_1__elements_Column3D__["a" /* Column3D */]();
    };
    /**
     * Returns SVG path to use as a mask for the series.
     *
     * @return {string} Mask path
     */
    ColumnSeries3D.prototype.getMaskPath = function () {
        var w = this.xAxis.axisLength;
        var h = this.yAxis.axisLength;
        var dx = this.chart.dx3D || 0;
        var dy = this.chart.dy3D || 0;
        return __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["moveTo"]({ x: 0, y: 0 }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: dx, y: dy }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: w + dx, y: dy }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: w + dx, y: h + dy }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: w, y: h }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: w, y: h }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["lineTo"]({ x: 0, y: h }) + __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["closePath"]();
    };
    Object.defineProperty(ColumnSeries3D.prototype, "depth", {
        /**
         * @ignore Exclude from docs
         * @return {number} Depth (px)
         */
        get: function () {
            return this.getPropertyValue("depth");
        },
        /**
         * Depth (height) of the slices in the series in pixels.
         *
         * @ignore Exclude from docs
         * @param {number}  value  Depth (px)
         */
        set: function (value) {
            this.setPropertyValue("depth", value, true);
            var template = this.columns.template; // todo: Cone is not Rectangle3D, maybe we should do some I3DShape?
            template.column3D.depth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnSeries3D.prototype, "angle", {
        /**
         * @ignore Exclude from docs
         * @return {number} Angle (0-360)
         */
        get: function () {
            return this.getPropertyValue("angle");
        },
        /**
         * Angle of view for the slices in series. (0-360)
         *
         * @ignore Exclude from docs
         * @param {number}  value  Angle (0-360)
         */
        set: function (value) {
            this.setPropertyValue("angle", value);
            var template = this.columns.template;
            template.column3D.angle = value;
        },
        enumerable: true,
        configurable: true
    });
    return ColumnSeries3D;
}(__WEBPACK_IMPORTED_MODULE_0__series_ColumnSeries__["a" /* ColumnSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["ColumnSeries3D"] = ColumnSeries3D;
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["ColumnSeries3DDataItem"] = ColumnSeries3DDataItem;
//# sourceMappingURL=ColumnSeries3D.js.map

/***/ }),

/***/ 296:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(297);


/***/ }),

/***/ 297:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__es2015_charts__ = __webpack_require__(298);

window.am4charts = __WEBPACK_IMPORTED_MODULE_0__es2015_charts__;

/***/ }),

/***/ 298:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_charts_types_GaugeChart__ = __webpack_require__(299);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "GaugeChartDataItem", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_charts_types_GaugeChart__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "GaugeChart", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_charts_types_GaugeChart__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal_charts_types_RadarChart__ = __webpack_require__(202);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "RadarChartDataItem", function() { return __WEBPACK_IMPORTED_MODULE_1__internal_charts_types_RadarChart__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "RadarChart", function() { return __WEBPACK_IMPORTED_MODULE_1__internal_charts_types_RadarChart__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__internal_charts_types_XYChart__ = __webpack_require__(92);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "XYChartDataItem", function() { return __WEBPACK_IMPORTED_MODULE_2__internal_charts_types_XYChart__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "XYChart", function() { return __WEBPACK_IMPORTED_MODULE_2__internal_charts_types_XYChart__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__internal_charts_types_SerialChart__ = __webpack_require__(109);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SerialChartDataItem", function() { return __WEBPACK_IMPORTED_MODULE_3__internal_charts_types_SerialChart__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SerialChart", function() { return __WEBPACK_IMPORTED_MODULE_3__internal_charts_types_SerialChart__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__internal_charts_types_PieChart3D__ = __webpack_require__(303);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PieChart3DDataItem", function() { return __WEBPACK_IMPORTED_MODULE_4__internal_charts_types_PieChart3D__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PieChart3D", function() { return __WEBPACK_IMPORTED_MODULE_4__internal_charts_types_PieChart3D__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__internal_charts_types_PieChart__ = __webpack_require__(235);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PieChartDataItem", function() { return __WEBPACK_IMPORTED_MODULE_5__internal_charts_types_PieChart__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PieChart", function() { return __WEBPACK_IMPORTED_MODULE_5__internal_charts_types_PieChart__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__internal_charts_types_SankeyDiagram__ = __webpack_require__(239);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SankeyDiagramDataItem", function() { return __WEBPACK_IMPORTED_MODULE_6__internal_charts_types_SankeyDiagram__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SankeyDiagram", function() { return __WEBPACK_IMPORTED_MODULE_6__internal_charts_types_SankeyDiagram__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__internal_charts_types_TreeMap__ = __webpack_require__(304);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "TreeMapDataItem", function() { return __WEBPACK_IMPORTED_MODULE_7__internal_charts_types_TreeMap__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "TreeMap", function() { return __WEBPACK_IMPORTED_MODULE_7__internal_charts_types_TreeMap__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__internal_charts_types_XYChart3D__ = __webpack_require__(305);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "XYChart3DDataItem", function() { return __WEBPACK_IMPORTED_MODULE_8__internal_charts_types_XYChart3D__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "XYChart3D", function() { return __WEBPACK_IMPORTED_MODULE_8__internal_charts_types_XYChart3D__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__internal_charts_Chart__ = __webpack_require__(143);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ChartDataItem", function() { return __WEBPACK_IMPORTED_MODULE_9__internal_charts_Chart__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Chart", function() { return __WEBPACK_IMPORTED_MODULE_9__internal_charts_Chart__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__internal_charts_Legend__ = __webpack_require__(147);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LegendDataItem", function() { return __WEBPACK_IMPORTED_MODULE_10__internal_charts_Legend__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Legend", function() { return __WEBPACK_IMPORTED_MODULE_10__internal_charts_Legend__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LegendSettings", function() { return __WEBPACK_IMPORTED_MODULE_10__internal_charts_Legend__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__internal_charts_elements_HeatLegend__ = __webpack_require__(249);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "HeatLegend", function() { return __WEBPACK_IMPORTED_MODULE_11__internal_charts_elements_HeatLegend__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__internal_charts_series_Series__ = __webpack_require__(83);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_12__internal_charts_series_Series__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Series", function() { return __WEBPACK_IMPORTED_MODULE_12__internal_charts_series_Series__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__internal_charts_series_XYSeries__ = __webpack_require__(120);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "XYSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_13__internal_charts_series_XYSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "XYSeries", function() { return __WEBPACK_IMPORTED_MODULE_13__internal_charts_series_XYSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__internal_charts_series_LineSeries__ = __webpack_require__(162);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LineSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_14__internal_charts_series_LineSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LineSeries", function() { return __WEBPACK_IMPORTED_MODULE_14__internal_charts_series_LineSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__internal_charts_series_LineSeriesSegment__ = __webpack_require__(229);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LineSeriesSegment", function() { return __WEBPACK_IMPORTED_MODULE_15__internal_charts_series_LineSeriesSegment__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__internal_charts_series_CandlestickSeries__ = __webpack_require__(307);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CandlestickSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_16__internal_charts_series_CandlestickSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CandlestickSeries", function() { return __WEBPACK_IMPORTED_MODULE_16__internal_charts_series_CandlestickSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__internal_charts_series_ColumnSeries__ = __webpack_require__(86);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ColumnSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_17__internal_charts_series_ColumnSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ColumnSeries", function() { return __WEBPACK_IMPORTED_MODULE_17__internal_charts_series_ColumnSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__internal_charts_series_StepLineSeries__ = __webpack_require__(309);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "StepLineSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_18__internal_charts_series_StepLineSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "StepLineSeries", function() { return __WEBPACK_IMPORTED_MODULE_18__internal_charts_series_StepLineSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__internal_charts_series_RadarSeries__ = __webpack_require__(228);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "RadarSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_19__internal_charts_series_RadarSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "RadarSeries", function() { return __WEBPACK_IMPORTED_MODULE_19__internal_charts_series_RadarSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__internal_charts_series_RadarColumnSeries__ = __webpack_require__(310);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "RadarColumnSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_20__internal_charts_series_RadarColumnSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "RadarColumnSeries", function() { return __WEBPACK_IMPORTED_MODULE_20__internal_charts_series_RadarColumnSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__internal_charts_series_PieSeries__ = __webpack_require__(163);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PieSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_21__internal_charts_series_PieSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PieSeries", function() { return __WEBPACK_IMPORTED_MODULE_21__internal_charts_series_PieSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__internal_charts_series_PieTick__ = __webpack_require__(236);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PieTick", function() { return __WEBPACK_IMPORTED_MODULE_22__internal_charts_series_PieTick__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__internal_charts_series_PieSeries3D__ = __webpack_require__(237);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PieSeries3DDataItem", function() { return __WEBPACK_IMPORTED_MODULE_23__internal_charts_series_PieSeries3D__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PieSeries3D", function() { return __WEBPACK_IMPORTED_MODULE_23__internal_charts_series_PieSeries3D__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__internal_charts_series_TreeMapSeries__ = __webpack_require__(244);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "TreeMapSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_24__internal_charts_series_TreeMapSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "TreeMapSeries", function() { return __WEBPACK_IMPORTED_MODULE_24__internal_charts_series_TreeMapSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__internal_charts_series_ColumnSeries3D__ = __webpack_require__(247);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ColumnSeries3DDataItem", function() { return __WEBPACK_IMPORTED_MODULE_25__internal_charts_series_ColumnSeries3D__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ColumnSeries3D", function() { return __WEBPACK_IMPORTED_MODULE_25__internal_charts_series_ColumnSeries3D__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__internal_charts_series_ConeSeries__ = __webpack_require__(312);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ConeSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_26__internal_charts_series_ConeSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ConeSeries", function() { return __WEBPACK_IMPORTED_MODULE_26__internal_charts_series_ConeSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__internal_charts_axes_Axis__ = __webpack_require__(118);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisDataItem", function() { return __WEBPACK_IMPORTED_MODULE_27__internal_charts_axes_Axis__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Axis", function() { return __WEBPACK_IMPORTED_MODULE_27__internal_charts_axes_Axis__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__internal_charts_axes_Grid__ = __webpack_require__(145);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Grid", function() { return __WEBPACK_IMPORTED_MODULE_28__internal_charts_axes_Grid__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__internal_charts_axes_AxisTick__ = __webpack_require__(219);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisTick", function() { return __WEBPACK_IMPORTED_MODULE_29__internal_charts_axes_AxisTick__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__internal_charts_axes_AxisLabel__ = __webpack_require__(146);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisLabel", function() { return __WEBPACK_IMPORTED_MODULE_30__internal_charts_axes_AxisLabel__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__internal_charts_axes_AxisLine__ = __webpack_require__(218);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisLine", function() { return __WEBPACK_IMPORTED_MODULE_31__internal_charts_axes_AxisLine__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__internal_charts_axes_AxisFill__ = __webpack_require__(144);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisFill", function() { return __WEBPACK_IMPORTED_MODULE_32__internal_charts_axes_AxisFill__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__internal_charts_axes_AxisRenderer__ = __webpack_require__(107);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisRenderer", function() { return __WEBPACK_IMPORTED_MODULE_33__internal_charts_axes_AxisRenderer__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__internal_charts_axes_AxisBreak__ = __webpack_require__(119);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisBreak", function() { return __WEBPACK_IMPORTED_MODULE_34__internal_charts_axes_AxisBreak__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__internal_charts_axes_ValueAxis__ = __webpack_require__(64);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ValueAxisDataItem", function() { return __WEBPACK_IMPORTED_MODULE_35__internal_charts_axes_ValueAxis__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ValueAxis", function() { return __WEBPACK_IMPORTED_MODULE_35__internal_charts_axes_ValueAxis__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__internal_charts_axes_CategoryAxis__ = __webpack_require__(99);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CategoryAxisDataItem", function() { return __WEBPACK_IMPORTED_MODULE_36__internal_charts_axes_CategoryAxis__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CategoryAxis", function() { return __WEBPACK_IMPORTED_MODULE_36__internal_charts_axes_CategoryAxis__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__internal_charts_axes_CategoryAxisBreak__ = __webpack_require__(223);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CategoryAxisBreak", function() { return __WEBPACK_IMPORTED_MODULE_37__internal_charts_axes_CategoryAxisBreak__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__internal_charts_axes_DateAxis__ = __webpack_require__(160);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "DateAxisDataItem", function() { return __WEBPACK_IMPORTED_MODULE_38__internal_charts_axes_DateAxis__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "DateAxis", function() { return __WEBPACK_IMPORTED_MODULE_38__internal_charts_axes_DateAxis__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__internal_charts_axes_DateAxisBreak__ = __webpack_require__(224);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "DateAxisBreak", function() { return __WEBPACK_IMPORTED_MODULE_39__internal_charts_axes_DateAxisBreak__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__internal_charts_axes_ValueAxisBreak__ = __webpack_require__(159);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ValueAxisBreak", function() { return __WEBPACK_IMPORTED_MODULE_40__internal_charts_axes_ValueAxisBreak__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__internal_charts_axes_AxisRendererX__ = __webpack_require__(108);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisRendererX", function() { return __WEBPACK_IMPORTED_MODULE_41__internal_charts_axes_AxisRendererX__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__internal_charts_axes_AxisRendererY__ = __webpack_require__(77);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisRendererY", function() { return __WEBPACK_IMPORTED_MODULE_42__internal_charts_axes_AxisRendererY__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__internal_charts_axes_AxisRendererRadial__ = __webpack_require__(231);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisRendererRadial", function() { return __WEBPACK_IMPORTED_MODULE_43__internal_charts_axes_AxisRendererRadial__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__internal_charts_axes_AxisLabelCircular__ = __webpack_require__(142);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisLabelCircular", function() { return __WEBPACK_IMPORTED_MODULE_44__internal_charts_axes_AxisLabelCircular__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__internal_charts_axes_AxisRendererCircular__ = __webpack_require__(198);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisRendererCircular", function() { return __WEBPACK_IMPORTED_MODULE_45__internal_charts_axes_AxisRendererCircular__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__internal_charts_axes_AxisFillCircular__ = __webpack_require__(199);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisFillCircular", function() { return __WEBPACK_IMPORTED_MODULE_46__internal_charts_axes_AxisFillCircular__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__internal_charts_axes_GridCircular__ = __webpack_require__(200);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "GridCircular", function() { return __WEBPACK_IMPORTED_MODULE_47__internal_charts_axes_GridCircular__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__internal_charts_axes_AxisRendererX3D__ = __webpack_require__(245);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisRendererX3D", function() { return __WEBPACK_IMPORTED_MODULE_48__internal_charts_axes_AxisRendererX3D__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__internal_charts_axes_AxisRendererY3D__ = __webpack_require__(246);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AxisRendererY3D", function() { return __WEBPACK_IMPORTED_MODULE_49__internal_charts_axes_AxisRendererY3D__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__internal_charts_elements_Tick__ = __webpack_require__(157);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Tick", function() { return __WEBPACK_IMPORTED_MODULE_50__internal_charts_elements_Tick__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__internal_charts_elements_Bullet__ = __webpack_require__(98);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Bullet", function() { return __WEBPACK_IMPORTED_MODULE_51__internal_charts_elements_Bullet__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__internal_charts_elements_LabelBullet__ = __webpack_require__(241);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LabelBullet", function() { return __WEBPACK_IMPORTED_MODULE_52__internal_charts_elements_LabelBullet__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__internal_charts_elements_CircleBullet__ = __webpack_require__(314);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CircleBullet", function() { return __WEBPACK_IMPORTED_MODULE_53__internal_charts_elements_CircleBullet__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__internal_charts_elements_XYChartScrollbar__ = __webpack_require__(315);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "XYChartScrollbar", function() { return __WEBPACK_IMPORTED_MODULE_54__internal_charts_elements_XYChartScrollbar__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__internal_charts_elements_ClockHand__ = __webpack_require__(233);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ClockHand", function() { return __WEBPACK_IMPORTED_MODULE_55__internal_charts_elements_ClockHand__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__internal_charts_elements_SankeyNode__ = __webpack_require__(240);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SankeyNode", function() { return __WEBPACK_IMPORTED_MODULE_56__internal_charts_elements_SankeyNode__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__internal_charts_elements_SankeyLink__ = __webpack_require__(242);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SankeyLink", function() { return __WEBPACK_IMPORTED_MODULE_57__internal_charts_elements_SankeyLink__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__internal_charts_elements_NavigationBar__ = __webpack_require__(316);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "NavigationBarDataItem", function() { return __WEBPACK_IMPORTED_MODULE_58__internal_charts_elements_NavigationBar__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "NavigationBar", function() { return __WEBPACK_IMPORTED_MODULE_58__internal_charts_elements_NavigationBar__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__internal_charts_cursors_XYCursor__ = __webpack_require__(161);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "XYCursor", function() { return __WEBPACK_IMPORTED_MODULE_59__internal_charts_cursors_XYCursor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__internal_charts_cursors_Cursor__ = __webpack_require__(226);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Cursor", function() { return __WEBPACK_IMPORTED_MODULE_60__internal_charts_cursors_Cursor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__internal_charts_cursors_RadarCursor__ = __webpack_require__(230);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "RadarCursor", function() { return __WEBPACK_IMPORTED_MODULE_61__internal_charts_cursors_RadarCursor__["a"]; });
/**
 * Module: gauge
 */
/**
 * Elements: types
 */









/**
 * Elements: charts
 */



/**
 * Elements: series
 */















/**
 * Elements: axes
 */























/**
 * Elements: elements
 */









/**
 * Elements: cursors
 */



//# sourceMappingURL=charts.js.map

/***/ }),

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GaugeChartDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GaugeChart; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RadarChart__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__elements_ClockHand__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Type__ = __webpack_require__(2);
/**
 * Module for building Gauge charts.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */





/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[GaugeChart]].
 *
 * @see {@link DataItem}
 */
var GaugeChartDataItem = /** @class */ (function (_super) {
    __extends(GaugeChartDataItem, _super);
    /**
     * Constructor
     */
    function GaugeChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "GaugeChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return GaugeChartDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__RadarChart__["b" /* RadarChartDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Gauge chart.
 *
 * @see {@link IGaugeChartEvents} for a list of available Events
 * @see {@link IGaugeChartAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var GaugeChart = /** @class */ (function (_super) {
    __extends(GaugeChart, _super);
    /**
     * Constructor
     */
    function GaugeChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "GaugeChart";
        _this.startAngle = 180;
        _this.endAngle = 360;
        _this.hands = new __WEBPACK_IMPORTED_MODULE_1__core_utils_List__["e" /* ListTemplate */](new __WEBPACK_IMPORTED_MODULE_2__elements_ClockHand__["a" /* ClockHand */]());
        _this.hands.events.on("insert", _this.processHand, _this);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    GaugeChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!__WEBPACK_IMPORTED_MODULE_4__core_utils_Type__["hasValue"](this.readerTitle)) {
            this.readerTitle = this.language.translate("Gauge chart");
        }
    };
    /**
     * Decorates a [[ClockHand]] when it is added to the chart.
     *
     * @param {IListEvents<ClockHand>["insert"]}  event  Event
     */
    GaugeChart.prototype.processHand = function (event) {
        var hand = event.newValue;
        if (!hand.axis) {
            hand.axis = this.xAxes.getIndex(0);
        }
    };
    return GaugeChart;
}(__WEBPACK_IMPORTED_MODULE_0__RadarChart__["a" /* RadarChart */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["b" /* registry */].registeredClasses["GaugeChart"] = GaugeChart;
//# sourceMappingURL=GaugeChart.js.map

/***/ }),

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PieChart3DDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PieChart3D; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PieChart__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__series_PieSeries3D__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/**
 * 3D Pie chart module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * Imports
 * ============================================================================
 * @hidden
 */



/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[PieChart3D]].
 *
 * @see {@link DataItem}
 */
var PieChart3DDataItem = /** @class */ (function (_super) {
    __extends(PieChart3DDataItem, _super);
    /**
     * Constructor
     */
    function PieChart3DDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "PieChart3DDataItem";
        _this.applyTheme();
        return _this;
    }
    return PieChart3DDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__PieChart__["b" /* PieChartDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a 3D Pie chart.
 *
 *  * ```TypeScript
 * // Includes
 * import * as am4core from "@amcharts/amcharts4/core";
 * import * as am4charts from "@amcharts/amcharts4/charts";
 *
 * // Create chart
 * let chart = am4core.create("chartdiv", am4charts.Pie3DChart);
 *
 * // Set data
 * chart.data = [{
 * 	"country": "Lithuania",
 * 	"litres": 501.9
 * }, {
 * 	"country": "Czech Republic",
 * 	"litres": 301.9
 * }, {
 * 	"country": "Ireland",
 * 	"litres": 201.1
 * }];
 *
 * // Create series
 * let series = chart.series.push(new am4charts.Pie3DSeries());
 * series.dataFields.value = "litres";
 * series.dataFields.category = "country";
 * ```
 * ```JavaScript
 * // Create chart
 * var chart = am4core.create("chartdiv", am4charts.Pie3DChart);
 *
 * // The following would work as well:
 * // var chart = am4core.create("chartdiv", "Pie3DChart");
 *
 * // Set data
 * chart.data = [{
 * 	"country": "Lithuania",
 * 	"litres": 501.9
 * }, {
 * 	"country": "Czech Republic",
 * 	"litres": 301.9
 * }, {
 * 	"country": "Ireland",
 * 	"litres": 201.1
 * }];
 *
 * // Create series
 * var series = chart.series.push(new am4charts.Pie3DSeries());
 * series.dataFields.value = "litres";
 * series.dataFields.category = "country";
 * ```
 * ```JSON
 * var chart = am4core.createFromConfig({
 *
 * 	// Series
 * 	"series": [{
 * 		"type": "Pie3DSeries",
 * 		"dataFields": {
 * 			"value": "litres",
 * 			"category": "country"
 * 		}
 * 	}],
 *
 * 	// Data
 * 	"data": [{
 * 		"country": "Lithuania",
 * 		"litres": 501.9
 * 	}, {
 * 		"country": "Czech Republic",
 * 		"litres": 301.9
 * 	}, {
 * 		"country": "Ireland",
 * 		"litres": 201.1
 * 	}]
 *
 * }, "chartdiv", "Pie3DChart");
 * ```
 *
 * @see {@link IPieChart3DEvents} for a list of available Events
 * @see {@link IPieChart3DAdapters} for a list of available Adapters
 * @important
 */
var PieChart3D = /** @class */ (function (_super) {
    __extends(PieChart3D, _super);
    /**
     * Constructor
     */
    function PieChart3D() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "PieChart3D";
        _this.depth = 20;
        _this.angle = 10;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(PieChart3D.prototype, "depth", {
        /**
         * @return {number} Depth (px)
         */
        get: function () {
            return this.getPropertyValue("depth");
        },
        /**
         * Depth of the 3D pie in pixels.
         *
         * This will determine "height" of the pie.
         *
         * @default 20
         * @param {number}  value  Depth (px)
         */
        set: function (value) {
            this.setPropertyValue("depth", value);
            this.invalidateDataUsers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieChart3D.prototype, "angle", {
        /**
         * @return {number} Angle (degrees)
         */
        get: function () {
            return this.getPropertyValue("angle");
        },
        /**
         * An angle of a "point of view" in degrees.
         *
         * @default 10
         * @param {number}  value  Angle (degrees)
         */
        set: function (value) {
            this.setPropertyValue("angle", value);
            this.invalidateDataUsers();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and returns a new Series.
     *
     * @return {PieSeries3D} New series
     */
    PieChart3D.prototype.createSeries = function () {
        return new __WEBPACK_IMPORTED_MODULE_1__series_PieSeries3D__["a" /* PieSeries3D */]();
    };
    return PieChart3D;
}(__WEBPACK_IMPORTED_MODULE_0__PieChart__["a" /* PieChart */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["PieChart3D"] = PieChart3D;
//# sourceMappingURL=PieChart3D.js.map

/***/ }),

/***/ 304:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TreeMapDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TreeMap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__XYChart__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Dictionary__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__axes_ValueAxis__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__series_TreeMapSeries__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_ColorSet__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_interaction_Mouse__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Array__ = __webpack_require__(15);
/**
 * TreeMap chart module.
 *
 * Parts of the functionality used in this module are taken from D3.js library
 * (https://d3js.org/)
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */










/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[TreeMap]].
 *
 * @see {@link DataItem}
 */
var TreeMapDataItem = /** @class */ (function (_super) {
    __extends(TreeMapDataItem, _super);
    /**
     * Constructor
     */
    function TreeMapDataItem() {
        var _this = _super.call(this) || this;
        /**
         * Required for squarify functionality.
         *
         * @ignore Exclude from docs
         * @type {TreeMapDataItem[]}
         */
        _this.rows = [];
        _this.className = "TreeMapDataItem";
        _this.values.value = {};
        _this.values.x0 = {};
        _this.values.y0 = {};
        _this.values.x1 = {};
        _this.values.y1 = {};
        _this.hasChildren.children = true;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(TreeMapDataItem.prototype, "value", {
        /**
         * @return {number} Value
         */
        get: function () {
            var value = this.values["value"].value;
            if (!__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isNumber"](value)) {
                value = 0;
                if (this.children) {
                    __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.children.iterator(), function (child) {
                        if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isNumber"](child.value)) {
                            value += child.value;
                        }
                    });
                }
            }
            return value;
        },
        /**
         * Numeric value of the item.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("value", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "x0", {
        /**
         * @return {number} X
         */
        get: function () {
            return this.values.x0.value;
        },
        /**
         * Item's X position.
         *
         * @ignore Exclude from docs
         * @todo Description (review)
         * @param {number}  value  X
         */
        set: function (value) {
            this.setValue("x0", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "x1", {
        /**
         * @return {number} X
         */
        get: function () {
            return this.values.x1.value;
        },
        /**
         * Item's X position.
         *
         * @ignore Exclude from docs
         * @todo Description (review)
         * @param {number}  value  X
         */
        set: function (value) {
            this.setValue("x1", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "y0", {
        /**
         * @return {number} Y
         */
        get: function () {
            return this.values.y0.value;
        },
        /**
         * Item's Y position.
         *
         * @ignore Exclude from docs
         * @todo Description (review)
         * @param {number}  value  Y
         */
        set: function (value) {
            this.setValue("y0", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "y1", {
        /**
         * @return {number} Y
         */
        get: function () {
            return this.values.y1.value;
        },
        /**
         * Item's Y position.
         *
         * @ignore Exclude from docs
         * @todo Description (review)
         * @param {number}  value  Y
         */
        set: function (value) {
            this.setValue("y1", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "name", {
        /**
         * @return {string} Name
         */
        get: function () {
            return this.properties.name;
        },
        /**
         * Item's name.
         *
         * @param {string}  name  Name
         */
        set: function (name) {
            this.setProperty("name", name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "children", {
        /**
         * @return {OrderedListTemplate<TreeMapDataItem>} Item's children
         */
        get: function () {
            return this.properties.children;
        },
        /**
         * A list of item's sub-children.
         *
         * Having children means that the TreeMap chat will automatically be
         * "drillable". Clicking on an item with children will zoom to the item, then
         * display its children.
         *
         * Treemap can have any level of nesting.
         *
         * @param {OrderedListTemplate<TreeMapDataItem>}  children  Item's children
         */
        set: function (children) {
            this.setProperty("children", children);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "level", {
        /**
         * Depth level in the treemap hierarchy.
         *
         * The top-level item will have level set at 0. Its children will have
         * level 1, and so on.
         *
         * @readonly
         * @return {number} Level
         */
        get: function () {
            if (!this.parent) {
                return 0;
            }
            else {
                return this.parent.level + 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "color", {
        /**
         * @return {Color} Color
         */
        get: function () {
            var color = this.properties.color;
            if (color == undefined) {
                if (this.parent) {
                    color = this.parent.color;
                }
            }
            if (color == undefined) {
                if (this.component) {
                    color = this.component.colors.getIndex(this.component.colors.step * this.index);
                }
            }
            return color;
        },
        /**
         * Item's color.
         *
         * If not set, will use parent's color, or, if that is not set either,
         * automatically assigned color from chart's color set. (`chart.colors`)
         *
         * @param {Color}  value  Color
         */
        set: function (value) {
            this.setProperty("color", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "series", {
        get: function () {
            return this._series;
        },
        /**
         * series of data item
         * @todo: proper descrition
         */
        set: function (series) {
            if (this._series) {
                this.component.series.removeValue(this._series);
                this._series.dispose();
            }
            this._series = series;
            this._disposers.push(series);
        },
        enumerable: true,
        configurable: true
    });
    return TreeMapDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__XYChart__["b" /* XYChartDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a TreeMap chart.
 *
 * @see {@link ITreeMapEvents} for a list of available Events
 * @see {@link ITreeMapAdapters} for a list of available Adapters
 * @todo Example
 */
var TreeMap = /** @class */ (function (_super) {
    __extends(TreeMap, _super);
    /**
     * Constructor
     */
    function TreeMap() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * An algorithm used to divide area into squares based on their value.
         *
         * Available options: squarify (default), binaryTree, slice, dice, sliceDice.
         *
         * ```TypeScript
         * chart.layoutAlgorithm = chart.sliceDice;
         * ```
         * ```JavaScript
         * chart.layoutAlgorithm = chart.sliceDice;
         * ```
         * ```JSON
         * {
         *   // ...
         *   "layoutAlgorithm": "sliceDice",
         *   // ...
         * }
         * ```
         *
         * @default squarify
         * @type {function}
         */
        _this.layoutAlgorithm = _this.squarify;
        /**
         * [TreeMapSeries description]
         *
         * @todo Description
         * @ignore Exclude from docs
         * @param {DictionaryTemplate<string, TreeMapSeries>} [description]
         */
        _this.seriesTemplates = new __WEBPACK_IMPORTED_MODULE_2__core_utils_Dictionary__["c" /* DictionaryTemplate */](new __WEBPACK_IMPORTED_MODULE_4__series_TreeMapSeries__["a" /* TreeMapSeries */]());
        /**
         * Is the chart zoomable?
         *
         * If the chart is `zoomable`, and items have sub-items, the chart will
         * drill-down to sub-items when click on their parent item.
         *
         * @default true
         * @type {boolean}
         */
        _this.zoomable = true;
        _this.className = "TreeMap";
        _this.maxLevels = 2;
        _this.currentLevel = 0;
        _this.homeText = _this.language.translate("Home");
        _this.colors = new __WEBPACK_IMPORTED_MODULE_5__core_utils_ColorSet__["a" /* ColorSet */]();
        _this.sorting = "descending";
        // create two value axes for the chart
        var xAxis = _this.xAxes.push(new __WEBPACK_IMPORTED_MODULE_3__axes_ValueAxis__["a" /* ValueAxis */]());
        xAxis.title.disabled = true;
        xAxis.strictMinMax = true;
        var xRenderer = xAxis.renderer;
        xRenderer.inside = true;
        xRenderer.labels.template.disabled = true;
        xRenderer.ticks.template.disabled = true;
        xRenderer.grid.template.disabled = true;
        xRenderer.axisFills.template.disabled = true;
        xRenderer.minGridDistance = 100;
        xRenderer.line.disabled = true;
        xRenderer.baseGrid.disabled = true;
        //xRenderer.inversed = true;
        var yAxis = _this.yAxes.push(new __WEBPACK_IMPORTED_MODULE_3__axes_ValueAxis__["a" /* ValueAxis */]());
        yAxis.title.disabled = true;
        yAxis.strictMinMax = true;
        var yRenderer = yAxis.renderer;
        yRenderer.inside = true;
        yRenderer.labels.template.disabled = true;
        yRenderer.ticks.template.disabled = true;
        yRenderer.grid.template.disabled = true;
        yRenderer.axisFills.template.disabled = true;
        yRenderer.minGridDistance = 100;
        yRenderer.line.disabled = true;
        yRenderer.baseGrid.disabled = true;
        yRenderer.inversed = true;
        // shortcuts
        _this.xAxis = xAxis;
        _this.yAxis = yAxis;
        _this.zoomOutButton.events.on("hit", function () {
            _this.zoomToChartDataItem(_this._homeDataItem);
        });
        _this.seriesTemplates.events.on("insertKey", function (event) {
            event.newValue.isTemplate = true;
        });
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(TreeMap.prototype, "navigationBar", {
        /**
         * Returns navigationBar if it is added to a chart
         */
        get: function () {
            return this._navigationBar;
        },
        /**
         * A navigation bar used to show "breadcrumb" control, indicating current
         * drill-down path.
         *
         * @type {NavigationBar}
         */
        set: function (navigationBar) {
            var _this = this;
            if (this._navigationBar != navigationBar) {
                this._navigationBar = navigationBar;
                navigationBar.parent = this;
                navigationBar.toBack();
                navigationBar.links.template.events.on("hit", function (event) {
                    var dataItem = event.target.dataItem.dataContext;
                    _this.zoomToChartDataItem(dataItem);
                    _this.createTreeSeries(dataItem);
                });
                this._disposers.push(navigationBar);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * (Re)validates chart's data.
     *
     * @ignore Exclude from docs
     */
    TreeMap.prototype.validateData = function () {
        var _this = this;
        _super.prototype.validateData.call(this);
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            series.dispose();
        });
        this.series.clear();
        if (this._homeDataItem) {
            this._homeDataItem.dispose();
        }
        var homeDataItem = this.dataItems.template.clone(); // cant' use createDataItem here!
        this._homeDataItem = homeDataItem;
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.dataItems.iterator(), function (dataItem) {
            dataItem.parent = homeDataItem;
        });
        homeDataItem.children = this.dataItems;
        homeDataItem.x0 = 0;
        homeDataItem.y0 = 0;
        homeDataItem.name = this._homeText;
        var maxX = 1000;
        var maxY = maxX * this.pixelHeight / this.pixelWidth;
        homeDataItem.x1 = maxX;
        homeDataItem.y1 = maxY;
        this.xAxis.min = 0;
        this.xAxis.max = maxX;
        this.yAxis.min = 0;
        this.yAxis.max = maxY;
        this.layoutItems(homeDataItem);
        this.createTreeSeries(homeDataItem);
        __WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].events.once("exitframe", function () {
            _this.toggleBullets(0);
        });
    };
    /**
     * Layouts and sizes all items according to their value and
     * `layoutAlgorithm`.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Parent data item
     */
    TreeMap.prototype.layoutItems = function (parent, sorting) {
        if (parent) {
            var children = parent.children;
            if (!sorting) {
                sorting = this.sorting;
            }
            if (sorting == "ascending") {
                children.values.sort(function (a, b) {
                    return a.value - b.value;
                });
            }
            if (sorting == "descending") {
                children.values.sort(function (a, b) {
                    return b.value - a.value;
                });
            }
            this.layoutAlgorithm(parent);
            for (var i = 0; i < children.length; i++) {
                var node = children.getIndex(i);
                if (node.children) {
                    this.layoutItems(node);
                }
            }
        }
    };
    /**
     * Creates and returns a new treemap series.
     *
     * @todo Description
     * @param {TreeMapDataItem}  dataItem  Data item to create series out of
     */
    TreeMap.prototype.createTreeSeries = function (dataItem) {
        var _this = this;
        this._tempSeries = [];
        var navigationData = [dataItem];
        // create parent series and navigation data
        var parentDataItem = dataItem.parent;
        while (parentDataItem != undefined) {
            this.initSeries(parentDataItem);
            navigationData.push(parentDataItem);
            parentDataItem = parentDataItem.parent;
        }
        navigationData.reverse();
        if (this.navigationBar) {
            this.navigationBar.data = navigationData;
        }
        // create series and children series
        this.createTreeSeriesReal(dataItem);
        // add those which are not in the list
        __WEBPACK_IMPORTED_MODULE_9__core_utils_Array__["b" /* each */](this._tempSeries, function (series) {
            if (_this.series.indexOf(series) == -1) {
                _this.series.push(series);
            }
            series.zIndex = series.level;
        });
    };
    /**
     * [createTreeSeriesReal description]
     *
     * @todo Description
     * @param {TreeMapDataItem} dataItem [description]
     */
    TreeMap.prototype.createTreeSeriesReal = function (dataItem) {
        if (dataItem.children) {
            var level = dataItem.level;
            if (level < this.currentLevel + this.maxLevels) {
                this.initSeries(dataItem);
                for (var i = 0; i < dataItem.children.length; i++) {
                    var child = dataItem.children.getIndex(i);
                    if (child.children) {
                        this.createTreeSeriesReal(child);
                    }
                }
            }
        }
    };
    /**
     * @ignore
     * Overriding, as tree map series are created on the fly all the time
     */
    TreeMap.prototype.seriesAppeared = function () {
        return true;
    };
    /**
     * Initializes the treemap series.
     *
     * @todo Description
     * @param {TreeMapDataItem}  dataItem  Chart data item
     */
    TreeMap.prototype.initSeries = function (dataItem) {
        var _this = this;
        if (!dataItem.series) {
            var series = void 0;
            var template = this.seriesTemplates.getKey(dataItem.level.toString());
            if (template) {
                series = template.clone();
            }
            else {
                series = this.series.create();
            }
            dataItem.series = series;
            var level = dataItem.level;
            series.level = level;
            var dataContext = dataItem.dataContext;
            if (dataContext) {
                series.config = dataContext.config;
            }
            this.dataUsers.removeValue(series); // series do not use data directly, that's why we remove it
            series.data = dataItem.children.values;
            series.columns.template.adapter.add("fill", function (fill, target) {
                var dataItem = target.dataItem;
                if (dataItem) {
                    var treeMapDataItem = dataItem.treeMapDataItem;
                    if (treeMapDataItem) {
                        target.fill = treeMapDataItem.color;
                        target.adapter.remove("fill"); //@todo: make it possible adapters applied once?
                        return treeMapDataItem.color;
                    }
                }
            });
            if (this.zoomable && (dataItem.level > this.currentLevel || (dataItem.children && dataItem.children.length > 0))) {
                series.columns.template.cursorOverStyle = __WEBPACK_IMPORTED_MODULE_6__core_interaction_Mouse__["a" /* MouseCursorStyle */].pointer;
                if (this.zoomable) {
                    series.columns.template.events.on("hit", function (event) {
                        var seriesDataItem = event.target.dataItem;
                        if (dataItem.level > _this.currentLevel) {
                            _this.zoomToChartDataItem(seriesDataItem.treeMapDataItem.parent);
                        }
                        else {
                            _this.zoomToSeriesDataItem(seriesDataItem);
                        }
                    }, this);
                }
            }
        }
        this._tempSeries.push(dataItem.series);
    };
    /**
     * Toggles bullets so that labels that belong to current drill level are
     * shown.
     *
     * @param {number}  duration  Animation duration (ms)
     */
    TreeMap.prototype.toggleBullets = function (duration) {
        var _this = this;
        // hide all series which are not in tempSeries
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            if (_this._tempSeries.indexOf(series) == -1) {
                series.hide();
            }
            else {
                series.show();
                if (series.level > _this.currentLevel + _this.maxLevels - 1) {
                    series.bulletsContainer.hide(duration);
                }
                else {
                    series.bulletsContainer.show(duration);
                }
            }
        });
    };
    /**
     * Zooms to particular item in series.
     *
     * @param {TreeMapSeriesDataItem}  dataItem  Data item
     */
    TreeMap.prototype.zoomToSeriesDataItem = function (dataItem) {
        this.zoomToChartDataItem(dataItem.treeMapDataItem);
    };
    /**
     * Zooms to particular item.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  dataItem  Data item
     */
    TreeMap.prototype.zoomToChartDataItem = function (dataItem) {
        var _this = this;
        if (dataItem.children) {
            this.xAxis.zoomToValues(dataItem.x0, dataItem.x1);
            this.yAxis.zoomToValues(dataItem.y0, dataItem.y1);
            this.currentLevel = dataItem.level;
            var rangeChangeAnimation = this.xAxis.rangeChangeAnimation || this.yAxis.rangeChangeAnimation;
            if (rangeChangeAnimation) {
                rangeChangeAnimation.events.once("animationended", function () {
                    _this.toggleBullets();
                });
            }
            else {
                this.toggleBullets();
            }
            this.createTreeSeries(dataItem);
        }
    };
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    TreeMap.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](this.readerTitle)) {
            this.readerTitle = this.language.translate("TreeMap chart");
        }
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {XYSeriesDataItem} Data Item
     */
    TreeMap.prototype.createDataItem = function () {
        return new TreeMapDataItem();
    };
    Object.defineProperty(TreeMap.prototype, "maxLevels", {
        /**
         * @return {number} Maximum drill-down level
         */
        get: function () {
            return this.getPropertyValue("maxLevels");
        },
        /**
         * Maximum drill-down levels the chart will allow going to.
         *
         * If set, the chart will not drill-down further, even if there are sub-items
         * available.
         *
         * Set to 0 to disable drill down functionality.
         *
         * @param {number}  value  Maximum drill-down level
         */
        set: function (value) {
            this.setPropertyValue("maxLevels", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMap.prototype, "currentLevel", {
        /**
         * @return {number} Current level
         */
        get: function () {
            return this.getPropertyValue("currentLevel");
        },
        /**
         * Current drill-down level the chart is at.
         *
         * @param {number}  value  Current level
         */
        set: function (value) {
            this.setPropertyValue("currentLevel", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMap.prototype, "sorting", {
        get: function () {
            return this.getPropertyValue("sorting");
        },
        /**
         * Sorting direction of treemap items.
         *
         * Available options: "none", "ascending", and "descending" (default).
         *
         * @default "descending"
         * @param {"none" | "ascending" | "descending"} value [description]
         */
        set: function (value) {
            this.setPropertyValue("sorting", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and returns a new series of the suitable type.
     *
     * @return {this} new series
     */
    TreeMap.prototype.createSeries = function () {
        return new __WEBPACK_IMPORTED_MODULE_4__series_TreeMapSeries__["a" /* TreeMapSeries */]();
    };
    Object.defineProperty(TreeMap.prototype, "homeText", {
        /**
         * @return {string} Home text
         */
        get: function () {
            return this._homeText;
        },
        /**
         * A text displayed on the "home" button which is used to go back to level 0
         * after drill into sub-items.
         *
         * @param {string}  value  Home text
         */
        set: function (value) {
            this._homeText = value;
            if (this._homeDataItem) {
                this._homeDataItem.name = this._homeText;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    TreeMap.prototype.processConfig = function (config) {
        // Instantiate projection
        if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](config["layoutAlgorithm"]) && __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isString"](config["layoutAlgorithm"])) {
            switch (config["layoutAlgorithm"]) {
                case "squarify":
                    config["layoutAlgorithm"] = this.squarify;
                    break;
                case "binaryTree":
                    config["layoutAlgorithm"] = this.binaryTree;
                    break;
                case "slice":
                    config["layoutAlgorithm"] = this.slice;
                    break;
                case "dice":
                    config["layoutAlgorithm"] = this.dice;
                    break;
                case "sliceDice":
                    config["layoutAlgorithm"] = this.sliceDice;
                    break;
                default:
                    delete config["layoutAlgorithm"];
                    break;
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    TreeMap.prototype.handleDataItemValueChange = function () {
        this.invalidateDataItems();
    };
    TreeMap.prototype.validateDataItems = function () {
        _super.prototype.validateDataItems.call(this);
        this.layoutItems(this._homeDataItem);
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            series.validateRawData();
        });
        this.zoomToChartDataItem(this._homeDataItem);
    };
    /**
     * ==========================================================================
     * TREEMAP LAYOUT FUNCTIONS
     * ==========================================================================
     * @hidden
     */
    /**
     * The functions below are from D3.js library (https://d3js.org/)
     *
     * --------------------------------------------------------------------------
     * Copyright 2017 Mike Bostock
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice,
     *    this list of conditions and the following disclaimer.
     *
     * 2. Redistributions in binary form must reproduce the above copyright
     *    notice,this list of conditions and the following disclaimer in the
     *    documentation and/or other materials provided with the distribution.
     *
     * 3. Neither the name of the copyright holder nor the names of its
     *    contributors may be used to endorse or promote products derived from
     *    this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
     * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     * POSSIBILITY OF SUCH DAMAGE.
     * --------------------------------------------------------------------------
     * @hidden
     */
    /**
     * Treemap layout algorithm: binaryTree.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    TreeMap.prototype.binaryTree = function (parent) {
        var nodes = parent.children, i, n = nodes.length, sum, sums = new Array(n + 1);
        for (sums[0] = sum = i = 0; i < n; ++i) {
            sums[i + 1] = sum += nodes.getIndex(i).value;
        }
        partition(0, n, parent.value, parent.x0, parent.y0, parent.x1, parent.y1);
        function partition(i, j, value, x0, y0, x1, y1) {
            if (i >= j - 1) {
                var node = nodes.getIndex(i);
                node.x0 = x0, node.y0 = y0;
                node.x1 = x1, node.y1 = y1;
                return;
            }
            var valueOffset = sums[i], valueTarget = (value / 2) + valueOffset, k = i + 1, hi = j - 1;
            while (k < hi) {
                var mid = k + hi >>> 1;
                if (sums[mid] < valueTarget)
                    k = mid + 1;
                else
                    hi = mid;
            }
            if ((valueTarget - sums[k - 1]) < (sums[k] - valueTarget) && i + 1 < k)
                --k;
            var valueLeft = sums[k] - valueOffset, valueRight = value - valueLeft;
            if ((x1 - x0) > (y1 - y0)) {
                var xk = (x0 * valueRight + x1 * valueLeft) / value;
                partition(i, k, valueLeft, x0, y0, xk, y1);
                partition(k, j, valueRight, xk, y0, x1, y1);
            }
            else {
                var yk = (y0 * valueRight + y1 * valueLeft) / value;
                partition(i, k, valueLeft, x0, y0, x1, yk);
                partition(k, j, valueRight, x0, yk, x1, y1);
            }
        }
    };
    /**
     * Treemap layout algorithm: slice.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    TreeMap.prototype.slice = function (parent) {
        var x0 = parent.x0;
        var x1 = parent.x1;
        var y0 = parent.y0;
        var y1 = parent.y1;
        var nodes = parent.children, node, i = -1, n = nodes.length, k = parent.value && (y1 - y0) / parent.value;
        while (++i < n) {
            node = nodes.getIndex(i), node.x0 = x0, node.x1 = x1;
            node.y0 = y0, node.y1 = y0 += node.value * k;
        }
    };
    /**
     * Treemap layout algorithm: dice.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    TreeMap.prototype.dice = function (parent) {
        var x0 = parent.x0;
        var x1 = parent.x1;
        var y0 = parent.y0;
        var y1 = parent.y1;
        var nodes = parent.children, node, i = -1, n = nodes.length, k = parent.value && (x1 - x0) / parent.value;
        while (++i < n) {
            node = nodes.getIndex(i), node.y0 = y0, node.y1 = y1;
            node.x0 = x0, node.x1 = x0 += node.value * k;
        }
    };
    /**
     * Treemap layout algorithm: slideDice.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    TreeMap.prototype.sliceDice = function (parent) {
        parent.level & 1 ? this.slice(parent) : this.dice(parent);
    };
    /**
     * Treemap layout algorithm: squarify.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    TreeMap.prototype.squarify = function (parent) {
        var ratio = (1 + Math.sqrt(5)) / 2;
        var x0 = parent.x0;
        var x1 = parent.x1;
        var y0 = parent.y0;
        var y1 = parent.y1;
        var nodes = parent.children;
        var nodeValue;
        var i0 = 0;
        var i1 = 0;
        var n = nodes.length;
        var dx;
        var dy;
        var value = parent.value;
        var sumValue;
        var minValue;
        var maxValue;
        var newRatio;
        var minRatio;
        var alpha;
        var beta;
        while (i0 < n) {
            dx = x1 - x0, dy = y1 - y0;
            // Find the next non-empty node.
            do
                sumValue = nodes.getIndex(i1++).value;
            while (!sumValue && i1 < n);
            minValue = maxValue = sumValue;
            alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
            beta = sumValue * sumValue * alpha;
            minRatio = Math.max(maxValue / beta, beta / minValue);
            // Keep adding nodes while the aspect ratio maintains or improves.
            for (; i1 < n; ++i1) {
                sumValue += nodeValue = nodes.getIndex(i1).value;
                if (nodeValue < minValue) {
                    minValue = nodeValue;
                }
                if (nodeValue > maxValue) {
                    maxValue = nodeValue;
                }
                beta = sumValue * sumValue * alpha;
                newRatio = Math.max(maxValue / beta, beta / minValue);
                if (newRatio > minRatio) {
                    sumValue -= nodeValue;
                    break;
                }
                minRatio = newRatio;
            }
            // Position and record the row orientation.
            var row = this.dataItems.template.clone();
            row.value = sumValue;
            row.dice = dx < dy;
            row.children = nodes.slice(i0, i1);
            row.x0 = x0;
            row.y0 = y0;
            row.x1 = x1;
            row.y1 = y1;
            if (row.dice) {
                row.y1 = value ? y0 += dy * sumValue / value : y1;
                this.dice(row);
            }
            else {
                row.x1 = value ? x0 += dx * sumValue / value : x1, y1;
                this.slice(row);
            }
            value -= sumValue, i0 = i1;
        }
    };
    return TreeMap;
}(__WEBPACK_IMPORTED_MODULE_0__XYChart__["a" /* XYChart */]));

/**
 * Register class, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["TreeMap"] = TreeMap;
//# sourceMappingURL=TreeMap.js.map

/***/ }),

/***/ 305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return XYChart3DDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return XYChart3D; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__XYChart__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__axes_AxisRendererX3D__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__axes_AxisRendererY3D__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__series_ColumnSeries3D__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__ = __webpack_require__(2);
/**
 * Module for building 3D serial charts.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * Imports
 * ============================================================================
 * @hidden
 */









/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[XYChart3D]].
 *
 * @see {@link DataItem}
 */
var XYChart3DDataItem = /** @class */ (function (_super) {
    __extends(XYChart3DDataItem, _super);
    function XYChart3DDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "XYChart3DDataItem";
        _this.applyTheme();
        return _this;
    }
    return XYChart3DDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__XYChart__["b" /* XYChartDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a 3D XY chart.
 *
 * @see {@link IXYChart3DEvents} for a list of available Events
 * @see {@link IXYChart3DAdapters} for a list of available Adapters
 * @important
 */
var XYChart3D = /** @class */ (function (_super) {
    __extends(XYChart3D, _super);
    /**
     * Constructor
     */
    function XYChart3D() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Type of the axis renderer to use for X axes.
         *
         * @type {[type]}
         */
        _this._axisRendererX = __WEBPACK_IMPORTED_MODULE_2__axes_AxisRendererX3D__["a" /* AxisRendererX3D */];
        /**
         * Type of the axis renderer to use for Y axes.
         * @type {[type]}
         */
        _this._axisRendererY = __WEBPACK_IMPORTED_MODULE_3__axes_AxisRendererY3D__["a" /* AxisRendererY3D */];
        _this.className = "XYChart3D";
        // Set defaults
        _this.depth = 30;
        _this.angle = 30;
        // Creeate container for columns
        var columnsContainer = _this.seriesContainer.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Container__["a" /* Container */]);
        columnsContainer.shouldClone = false;
        columnsContainer.isMeasured = false;
        columnsContainer.layout = "none";
        _this.columnsContainer = columnsContainer;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(XYChart3D.prototype, "depth", {
        /**
         * @return {number} Depth (px)
         */
        get: function () {
            return this.getPropertyValue("depth");
        },
        /**
         * Depth of the 3D chart / columns in pixels.
         *
         * @param {number}  value  Depth (px)
         */
        set: function (value) {
            this.setPropertyValue("depth", value);
            this.fixLayout();
            this.invalidateDataUsers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChart3D.prototype, "angle", {
        /**
         * @return {number} Angle
         */
        get: function () {
            return this.getPropertyValue("angle");
        },
        /**
         * Angle the chart is viewed at.
         *
         * @todo Description (review)
         * @param {number}  value  Angle
         */
        set: function (value) {
            this.setPropertyValue("angle", value);
            this.fixLayout();
            this.invalidateDataUsers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChart3D.prototype, "dx3D", {
        /**
         * A calculated horizontal 3D offset. (px)
         *
         * @readonly
         * @return {number} Offset (px)
         */
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](this.angle) * this.depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChart3D.prototype, "dy3D", {
        /**
         * A calculated vertical 3D offset. (px)
         *
         * @readonly
         * @return {number} Offset (px)
         */
        get: function () {
            return -__WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](this.angle) * this.depth;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * (Re)validates the chart.
     *
     * @ignore Exclude from docs
     */
    XYChart3D.prototype.validate = function () {
        _super.prototype.validate.call(this);
        this.fixLayout();
    };
    /**
     * Updates the layout (padding and scrollbar positions) to accommodate for
     * 3D depth and angle.
     */
    XYChart3D.prototype.fixLayout = function () {
        this.chartContainer.marginTop = -this.dy3D;
        this.chartContainer.paddingRight = this.dx3D;
        if (this.scrollbarX) {
            this.scrollbarX.dy = this.dy3D;
            this.scrollbarX.dx = this.dx3D;
        }
        if (this.scrollbarY) {
            this.scrollbarY.dy = this.dy3D;
            this.scrollbarY.dx = this.dx3D;
        }
        this.fixColumns();
    };
    /**
     * Updates column positions, offset and dimensions based on chart's angle
     * and depth.
     */
    XYChart3D.prototype.fixColumns = function () {
        var _this = this;
        var count = 1;
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            if (series instanceof __WEBPACK_IMPORTED_MODULE_4__series_ColumnSeries3D__["a" /* ColumnSeries3D */]) {
                if (!series.clustered) {
                    count++;
                }
                series.depthIndex = count - 1;
            }
        });
        var s = 0;
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            if (series instanceof __WEBPACK_IMPORTED_MODULE_4__series_ColumnSeries3D__["a" /* ColumnSeries3D */]) {
                series.depth = _this.depth / count;
                series.angle = _this.angle;
                series.dx = _this.depth / count * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["cos"](_this.angle) * series.depthIndex;
                series.dy = -_this.depth / count * __WEBPACK_IMPORTED_MODULE_7__core_utils_Math__["sin"](_this.angle) * series.depthIndex;
                var i_1 = 1;
                __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__["each"](series.columns.iterator(), function (column) {
                    column.zIndex = 1000 * i_1 + s - series.depthIndex * 100;
                    i_1++;
                });
                s++;
            }
        });
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    XYChart3D.prototype.processConfig = function (config) {
        if (config) {
            // Set up series
            if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](config.series) && __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isArray"](config.series)) {
                for (var i = 0, len = config.series.length; i < len; i++) {
                    config.series[i].type = config.series[i].type || "ColumnSeries3D";
                }
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return XYChart3D;
}(__WEBPACK_IMPORTED_MODULE_0__XYChart__["a" /* XYChart */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_5__core_Registry__["b" /* registry */].registeredClasses["XYChart3D"] = XYChart3D;
//# sourceMappingURL=XYChart3D.js.map

/***/ }),

/***/ 306:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Column3D; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Column__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_3d_Rectangle3D__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/**
 * Module that defines everything related to building 3D Columns.
 * It is a container which has column3D element which is a Rectangle3D.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates Column3Ds.
 *
 * @see {@link IColumn3DEvents} for a list of available events
 * @see {@link IColumn3DAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var Column3D = /** @class */ (function (_super) {
    __extends(Column3D, _super);
    /**
     * Constructor
     */
    function Column3D() {
        var _this = _super.call(this) || this;
        _this.className = "Column3D";
        return _this;
    }
    Column3D.prototype.createAssets = function () {
        this.column3D = this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_3d_Rectangle3D__["a" /* Rectangle3D */]);
        this.column3D.shouldClone = false;
        this.column3D.strokeOpacity = 0;
        // some dirty hack so that if user access column, it won't get error
        this.column = this.column3D;
    };
    Column3D.prototype.validate = function () {
        _super.prototype.validate.call(this);
        if (this.column3D) {
            this.column3D.width = this.pixelWidth;
            this.column3D.height = this.pixelHeight;
        }
    };
    Column3D.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.column3D) {
            this.column3D.copyFrom(source.column3D);
        }
    };
    return Column3D;
}(__WEBPACK_IMPORTED_MODULE_0__Column__["a" /* Column */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["Column3D"] = Column3D;
//# sourceMappingURL=Column3D.js.map

/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CandlestickSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CandlestickSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ColumnSeries__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sprite__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__elements_Candlestick__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Object__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__ = __webpack_require__(2);
/**
 * Candlestick Series module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */









/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[CandlestickSeries]].
 *
 * @see {@link DataItem}
 */
var CandlestickSeriesDataItem = /** @class */ (function (_super) {
    __extends(CandlestickSeriesDataItem, _super);
    /**
     * Defines a type of [[Component]] this data item is used for
     * @type {CandlestickSeries}
     * @todo Disabled to work around TS bug (see if we can re-enable it again)
     */
    //public _component: CandlestickSeries;
    /**
     * Constructor
     */
    function CandlestickSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.values.lowValueX = {};
        _this.values.lowValueY = {};
        _this.values.highValueX = {};
        _this.values.highValueY = {};
        _this.className = "CandlestickSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "lowValueX", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.lowValueX.value;
        },
        /**
         * Low value for horizontal axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("lowValueX", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "lowValueY", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.lowValueY.value;
        },
        /**
         * Low value for vertical axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("lowValueY", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "highValueX", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.highValueX.value;
        },
        /**
         * High value for horizontal axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("highValueX", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "highValueY", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.highValueY.value;
        },
        /**
         * High value for vertical axis.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("highValueY", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "closeValueX", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.valueX.value;
        },
        /**
         * Close value for horizontal axis.
         *
         * This is an alias for `valueX` added for convenience only.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("valueX", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeriesDataItem.prototype, "closeValueY", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.valueY.value;
        },
        /**
         * Close value for vertical axis.
         *
         * This is an alias for `valueX` added for convenience only.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("valueY", value);
        },
        enumerable: true,
        configurable: true
    });
    return CandlestickSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__ColumnSeries__["b" /* ColumnSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a candlestick graph.
 *
 * @see {@link ICandlestickSeriesEvents} for a list of available Events
 * @see {@link ICandlestickSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var CandlestickSeries = /** @class */ (function (_super) {
    __extends(CandlestickSeries, _super);
    /**
     * Constructor
     */
    function CandlestickSeries() {
        var _this = _super.call(this) || this;
        _this.className = "CandlestickSeries";
        _this.strokeOpacity = 1;
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_4__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        var positiveColor = interfaceColors.getFor("positive");
        var negativeColor = interfaceColors.getFor("negative");
        _this.dropFromOpenState.properties.fill = negativeColor;
        _this.dropFromOpenState.properties.stroke = negativeColor;
        _this.riseFromOpenState.properties.fill = positiveColor;
        _this.riseFromOpenState.properties.stroke = positiveColor;
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    CandlestickSeries.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        if (!__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](this.readerTitle)) {
            this.readerTitle = this.language.translate("Candlestick Series");
        }
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {CandlestickSeriesDataItem} Data Item
     */
    CandlestickSeries.prototype.createDataItem = function () {
        return new CandlestickSeriesDataItem();
    };
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {CandlestickSeriesDataItem}  dataItem  Data item
     */
    CandlestickSeries.prototype.validateDataElementReal = function (dataItem) {
        _super.prototype.validateDataElementReal.call(this, dataItem);
        var column = dataItem.column;
        if (column) {
            var lowLine_1 = column.lowLine;
            var highLine_1 = column.highLine;
            if (this.baseAxis == this.xAxis) {
                var x = column.pixelWidth / 2;
                lowLine_1.x = x;
                highLine_1.x = x;
                var open_1 = dataItem.getWorkingValue(this.yOpenField);
                var close_1 = dataItem.getWorkingValue(this.yField);
                var yOpen = this.yAxis.getY(dataItem, this.yOpenField);
                var yClose = this.yAxis.getY(dataItem, this.yField);
                var yLow = this.yAxis.getY(dataItem, this.yLowField);
                var yHigh = this.yAxis.getY(dataItem, this.yHighField);
                var pixelY = column.pixelY;
                lowLine_1.y1 = yLow - pixelY;
                highLine_1.y1 = yHigh - pixelY;
                if (open_1 < close_1) {
                    lowLine_1.y2 = yOpen - pixelY;
                    highLine_1.y2 = yClose - pixelY;
                }
                else {
                    lowLine_1.y2 = yClose - pixelY;
                    highLine_1.y2 = yOpen - pixelY;
                }
            }
            if (this.baseAxis == this.yAxis) {
                var y = column.pixelHeight / 2;
                lowLine_1.y = y;
                highLine_1.y = y;
                var open_2 = dataItem.getWorkingValue(this.xOpenField);
                var close_2 = dataItem.getWorkingValue(this.xField);
                var xOpen = this.xAxis.getX(dataItem, this.xOpenField);
                var xClose = this.xAxis.getX(dataItem, this.xField);
                var xLow = this.xAxis.getX(dataItem, this.xLowField);
                var xHigh = this.xAxis.getX(dataItem, this.xHighField);
                var pixelX = column.pixelX;
                lowLine_1.x1 = xLow - pixelX;
                highLine_1.x1 = xHigh - pixelX;
                if (open_2 < close_2) {
                    lowLine_1.x2 = xOpen - pixelX;
                    highLine_1.x2 = xClose - pixelX;
                }
                else {
                    lowLine_1.x2 = xClose - pixelX;
                    highLine_1.x2 = xOpen - pixelX;
                }
            }
            __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.axisRanges.iterator(), function (axisRange) {
                // LOW LINE
                var rangeColumn = dataItem.rangesColumns.getKey(axisRange.uid);
                if (rangeColumn) {
                    var rangeLowLine = rangeColumn.lowLine;
                    rangeLowLine.x = lowLine_1.x;
                    rangeLowLine.y = lowLine_1.y;
                    rangeLowLine.x1 = lowLine_1.x1;
                    rangeLowLine.x2 = lowLine_1.x2;
                    rangeLowLine.y1 = lowLine_1.y1;
                    rangeLowLine.y2 = lowLine_1.y2;
                    // HIGH LINE
                    var rangehighLine = rangeColumn.highLine;
                    rangehighLine.x = highLine_1.x;
                    rangehighLine.y = highLine_1.y;
                    rangehighLine.x1 = highLine_1.x1;
                    rangehighLine.x2 = highLine_1.x2;
                    rangehighLine.y1 = highLine_1.y1;
                    rangehighLine.y2 = highLine_1.y2;
                }
            });
        }
    };
    Object.defineProperty(CandlestickSeries.prototype, "xLowField", {
        /**
         * A data field to look for "low" value for horizontal axis.
         *
         * @ignore Exclude from docs
         * @return {string} Field name
         */
        get: function () {
            return this._xLowField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeries.prototype, "yLowField", {
        /**
         * A data field to look for "low" value for vertical axis.
         *
         * @ignore Exclude from docs
         * @return {string} Field name
         */
        get: function () {
            return this._yLowField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeries.prototype, "xHighField", {
        /**
         * A data field to look for "high" value for horizontal axis.
         *
         * @ignore Exclude from docs
         * @return {string} Field name
         */
        get: function () {
            return this._xHighField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandlestickSeries.prototype, "yHighField", {
        /**
         * A data field to look for "high" value for vertical axis.
         *
         * @ignore Exclude from docs
         * @return {string} Field name
         */
        get: function () {
            return this._yHighField;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets up which data fields to use for data access.
     */
    CandlestickSeries.prototype.defineFields = function () {
        _super.prototype.defineFields.call(this);
        if (this.baseAxis == this.xAxis) {
            var yAxisFieldName = __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["capitalize"](this.yAxis.axisFieldName);
            this._yLowField = ("low" + yAxisFieldName + "Y");
            this._yHighField = ("high" + yAxisFieldName + "Y");
        }
        if (this.baseAxis == this.yAxis) {
            var xAxisFieldName = __WEBPACK_IMPORTED_MODULE_5__core_utils_Utils__["capitalize"](this.xAxis.axisFieldName);
            this._xLowField = ("low" + xAxisFieldName + "X");
            this._xHighField = ("high" + xAxisFieldName + "X");
        }
        this.addValueField(this.xAxis, this._xValueFields, this._xLowField);
        this.addValueField(this.xAxis, this._xValueFields, this._xHighField);
        this.addValueField(this.yAxis, this._yValueFields, this._yLowField);
        this.addValueField(this.yAxis, this._yValueFields, this._yHighField);
    };
    /**
     * Creates elements in related legend container, that mimics the look of this
     * Series.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Legend item container
     */
    CandlestickSeries.prototype.createLegendMarker = function (marker) {
        var w = marker.pixelWidth;
        var h = marker.pixelHeight;
        marker.removeChildren();
        var column = marker.createChild(__WEBPACK_IMPORTED_MODULE_2__elements_Candlestick__["a" /* Candlestick */]);
        column.shouldClone = false;
        column.copyFrom(this.columns.template);
        var cw;
        var ch;
        var highLine = column.lowLine;
        var lowLine = column.highLine;
        if (this.baseAxis == this.yAxis) {
            cw = w / 3;
            ch = h;
            highLine.y = h / 2;
            lowLine.y = h / 2;
            highLine.x2 = w / 3;
            lowLine.x2 = w / 3;
            lowLine.x = w / 3 * 2;
            column.column.x = w / 3;
        }
        else {
            cw = w;
            ch = h / 3;
            highLine.x = w / 2;
            lowLine.x = w / 2;
            highLine.y2 = h / 3;
            lowLine.y2 = h / 3;
            lowLine.y = h / 3 * 2;
            column.column.y = h / 3;
        }
        column.width = cw;
        column.height = ch;
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Object__["copyProperties"](this, marker, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Object__["copyProperties"](this.columns.template, column, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
    };
    /**
     * Returns an element to use for Candlestick
     * @ignore
     * @return {this["_column"]} Element.
     */
    CandlestickSeries.prototype.createColumnTemplate = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__elements_Candlestick__["a" /* Candlestick */]();
    };
    return CandlestickSeries;
}(__WEBPACK_IMPORTED_MODULE_0__ColumnSeries__["a" /* ColumnSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["b" /* registry */].registeredClasses["CandlestickSeries"] = CandlestickSeries;
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["b" /* registry */].registeredClasses["CandlestickSeriesDataItem"] = CandlestickSeriesDataItem;
//# sourceMappingURL=CandlestickSeries.js.map

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Candlestick; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Column__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Line__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/**
 * Module that defines everything related to building Candlesticks.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates Candlesticks.
 *
 * @see {@link ICandlestickEvents} for a list of available events
 * @see {@link ICandlestickAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var Candlestick = /** @class */ (function (_super) {
    __extends(Candlestick, _super);
    /**
     * Constructor
     */
    function Candlestick() {
        var _this = _super.call(this) || this;
        _this.className = "Candlestick";
        _this.layout = "none";
        return _this;
    }
    Candlestick.prototype.createAssets = function () {
        _super.prototype.createAssets.call(this);
        this.lowLine = this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Line__["a" /* Line */]);
        this.lowLine.shouldClone = false;
        this.highLine = this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Line__["a" /* Line */]);
        this.highLine.shouldClone = false;
    };
    Candlestick.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.lowLine) {
            this.lowLine.copyFrom(source.lowLine);
        }
        if (this.highLine) {
            this.highLine.copyFrom(source.highLine);
        }
    };
    return Candlestick;
}(__WEBPACK_IMPORTED_MODULE_0__Column__["a" /* Column */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["Candlestick"] = Candlestick;
//# sourceMappingURL=Candlestick.js.map

/***/ }),

/***/ 309:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return StepLineSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StepLineSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__LineSeries__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__ = __webpack_require__(3);
/**
 * Step line series module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */



/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[StepLineSeries]].
 *
 * @see {@link DataItem}
 */
var StepLineSeriesDataItem = /** @class */ (function (_super) {
    __extends(StepLineSeriesDataItem, _super);
    /**
     * Constructor
     */
    function StepLineSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "StepLineSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    return StepLineSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__LineSeries__["b" /* LineSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a step line graph.
 *
 * @see {@link IStepLineSeriesEvents} for a list of available Events
 * @see {@link IStepLineSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var StepLineSeries = /** @class */ (function (_super) {
    __extends(StepLineSeries, _super);
    /**
     * Constructor
     */
    function StepLineSeries() {
        var _this = _super.call(this) || this;
        _this.className = "StepLineSeries";
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {StepLineSeriesDataItem} Data Item
     */
    StepLineSeries.prototype.createDataItem = function () {
        return new StepLineSeriesDataItem();
    };
    /**
     * [addPoints description]
     *
     * @todo Description
     * @param {IPoint[]}           points     [description]
     * @param {this["_dataItem"]}  dataItem   [description]
     * @param {string}             xField     [description]
     * @param {string}             yField     [description]
     * @param {boolean}            backwards  [description]
     */
    StepLineSeries.prototype.addPoints = function (points, dataItem, xField, yField, backwards) {
        var x0 = this.xAxis.getX(dataItem, xField, 0);
        var y0 = this.yAxis.getY(dataItem, yField, 0);
        var x1 = this.xAxis.getX(dataItem, xField, 1);
        var y1 = this.yAxis.getY(dataItem, yField, 1);
        x0 = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["fitToRange"](x0, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        y0 = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["fitToRange"](y0, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        x1 = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["fitToRange"](x1, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        y1 = __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["fitToRange"](y1, -20000, 20000); // from geometric point of view this is not right, but practically it's ok. this is done to avoid too big objects.
        // this might make an impression that points are duplicated, and they indeed are, but this is needed to handle gaps in data
        if (this.connect) {
            if (points.length > 1) {
                var prevPoint = points[points.length - 1];
                if (this.baseAxis == this.xAxis) {
                    if (backwards) {
                        points.push({ x: prevPoint.x, y: y1 });
                    }
                    else {
                        points.push({ x: x0, y: prevPoint.y });
                    }
                }
                if (this.baseAxis == this.yAxis) {
                    if (backwards) {
                        points.push({ x: x1, y: prevPoint.y });
                    }
                    else {
                        points.push({ x: prevPoint.x, y: y0 });
                    }
                }
            }
        }
        var point0 = { x: x0, y: y0 };
        var point1 = { x: x1, y: y1 };
        if (backwards) {
            points.push(point1, point0);
        }
        else {
            points.push(point0, point1);
        }
    };
    return StepLineSeries;
}(__WEBPACK_IMPORTED_MODULE_0__LineSeries__["a" /* LineSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["StepLineSeries"] = StepLineSeries;
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["StepLineSeriesDataItem"] = StepLineSeriesDataItem;
//# sourceMappingURL=StepLineSeries.js.map

/***/ }),

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return RadarColumnSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RadarColumnSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__series_ColumnSeries__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sprite__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__elements_RadarColumn__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_rendering_Path__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Object__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Array__ = __webpack_require__(15);
/**
 * Radar column series module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */










/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[RadarColumnSeries]].
 *
 * @see {@link DataItem}
 */
var RadarColumnSeriesDataItem = /** @class */ (function (_super) {
    __extends(RadarColumnSeriesDataItem, _super);
    /**
     * Constructor
     */
    function RadarColumnSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "ColumnSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    return RadarColumnSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__series_ColumnSeries__["b" /* ColumnSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a 3D column graph.
 *
 * @see {@link IRadarColumnSeriesEvents} for a list of available Events
 * @see {@link IRadarColumnSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var RadarColumnSeries = /** @class */ (function (_super) {
    __extends(RadarColumnSeries, _super);
    /**
     * Constructor
     */
    function RadarColumnSeries() {
        var _this = _super.call(this) || this;
        _this.className = "RadarColumnSeries";
        _this.applyTheme();
        return _this;
    }
    /**
     * Creates and returns a RadarColumn element to use as column in radar chart.
     *
     * @return {this["_column"]} RadarColumn.
     */
    RadarColumnSeries.prototype.createColumnTemplate = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__elements_RadarColumn__["a" /* RadarColumn */]();
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    RadarColumnSeries.prototype.validate = function () {
        // so that radius would be updated
        if (this.chart.invalid) {
            this.chart.validate();
        }
        _super.prototype.validate.call(this);
    };
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {RadarColumnSeriesDataItem}  dataItem  Data item
     */
    RadarColumnSeries.prototype.validateDataElementReal = function (dataItem) {
        var _this = this;
        var startAngle = this.chart.startAngle;
        var endAngle = this.chart.endAngle;
        var yField = this.yField;
        var yOpenField = this.yOpenField;
        var xField = this.xField;
        var xOpenField = this.xOpenField;
        var lAngle;
        var rAngle;
        var tRadius;
        var bRadius;
        var startLocation = this.getStartLocation(dataItem);
        var endLocation = this.getEndLocation(dataItem);
        var cellAngle = (endAngle - startAngle) / (this.dataItems.length * (this.end - this.start));
        startAngle = startAngle + startLocation * cellAngle;
        endAngle = endAngle - (1 - endLocation) * cellAngle;
        var template = this.columns.template;
        var percentWidth = template.percentWidth;
        if (__WEBPACK_IMPORTED_MODULE_7__core_utils_Type__["isNaN"](percentWidth)) {
            percentWidth = 100;
        }
        var offset = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["round"]((endLocation - startLocation) * (1 - percentWidth / 100) / 2, 5);
        startLocation += offset;
        endLocation -= offset;
        // @todo use getPoint() instead of these
        if (this.baseAxis == this.xAxis) {
            tRadius = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["getDistance"]({ x: this.yAxis.getX(dataItem, yField, dataItem.locations[yField], "valueY"), y: this.yAxis.getY(dataItem, yField, dataItem.locations[yField], "valueY") });
            bRadius = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["getDistance"]({ x: this.yAxis.getX(dataItem, yOpenField, dataItem.locations[yOpenField], "valueY"), y: this.yAxis.getY(dataItem, yOpenField, dataItem.locations[yOpenField], "valueY") });
            lAngle = this.xAxis.getAngle(dataItem, xOpenField, startLocation, "valueX");
            rAngle = this.xAxis.getAngle(dataItem, xField, endLocation, "valueX");
        }
        else {
            tRadius = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["getDistance"]({ x: this.yAxis.getX(dataItem, yField, startLocation, "valueY"), y: this.yAxis.getY(dataItem, yField, startLocation, "valueY") });
            bRadius = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["getDistance"]({ x: this.yAxis.getX(dataItem, yOpenField, endLocation, "valueY"), y: this.yAxis.getY(dataItem, yOpenField, endLocation, "valueY") });
            lAngle = this.xAxis.getAngle(dataItem, xField, dataItem.locations[xField], "valueX");
            rAngle = this.xAxis.getAngle(dataItem, xOpenField, dataItem.locations[xOpenField], "valueX");
        }
        if (rAngle < lAngle) {
            var temp = rAngle;
            rAngle = lAngle;
            lAngle = temp;
        }
        lAngle = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["fitToRange"](lAngle, startAngle, endAngle);
        rAngle = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["fitToRange"](rAngle, startAngle, endAngle);
        var radarColumn = dataItem.column;
        if (!radarColumn) {
            radarColumn = this.columns.create();
            dataItem.column = radarColumn;
            __WEBPACK_IMPORTED_MODULE_6__core_utils_Object__["forceCopyProperties"](this.columns.template, radarColumn, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
            dataItem.addSprite(radarColumn);
            this.setColumnStates(radarColumn);
        }
        var slice = radarColumn.radarColumn;
        slice.startAngle = lAngle;
        var arc = rAngle - lAngle;
        if (arc > 0) {
            slice.arc = arc;
            slice.radius = tRadius;
            slice.innerRadius = bRadius;
            radarColumn.__disabled = false;
            radarColumn.parent = this.columnsContainer;
            __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](this.axisRanges.iterator(), function (axisRange) {
                var rangeColumn = dataItem.rangesColumns.getKey(axisRange.uid);
                if (!rangeColumn) {
                    rangeColumn = _this.columns.create();
                    __WEBPACK_IMPORTED_MODULE_6__core_utils_Object__["forceCopyProperties"](_this.columns.template, rangeColumn, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
                    __WEBPACK_IMPORTED_MODULE_6__core_utils_Object__["copyProperties"](axisRange.contents, rangeColumn, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]); // need this because 3d columns are not in the same container
                    if (rangeColumn.dataItem) {
                        __WEBPACK_IMPORTED_MODULE_9__core_utils_Array__["k" /* remove */](rangeColumn.dataItem.sprites, rangeColumn);
                    }
                    dataItem.addSprite(rangeColumn);
                    _this.setColumnStates(rangeColumn);
                    dataItem.rangesColumns.setKey(axisRange.uid, rangeColumn);
                }
                var slice = radarColumn.radarColumn;
                slice.startAngle = lAngle;
                slice.arc = arc;
                slice.radius = tRadius;
                slice.innerRadius = bRadius;
                if (slice.invalid) {
                    slice.validate(); // validate as if it was used previously, it will flicker with previous dimensions
                }
                rangeColumn.__disabled = false;
                rangeColumn.parent = _this.columnsContainer;
            });
        }
        else {
            this.disableUnusedColumns(dataItem);
        }
    };
    /**
     * Returnsan SVG path that is used as mask for the series.
     *
     * @return {string} SVG path
     */
    RadarColumnSeries.prototype.getMaskPath = function () {
        var renderer = this.yAxis.renderer;
        return __WEBPACK_IMPORTED_MODULE_4__core_rendering_Path__["arc"](renderer.startAngle, renderer.endAngle - renderer.startAngle, renderer.pixelRadius, renderer.pixelInnerRadius);
    };
    /**
     * [getPoint description]
     *
     * @todo Description
     * @param {RadarColumnSeriesDataItem} dataItem  [description]
     * @param {string}                    xKey      [description]
     * @param {string}                    yKey      [description]
     * @param {number}                    locationX [description]
     * @param {number}                    locationY [description]
     * @param {string}                    stackKeyX [description]
     * @param {string}                    stackKeyY [description]
     */
    RadarColumnSeries.prototype.getPoint = function (dataItem, xKey, yKey, locationX, locationY, stackKeyX, stackKeyY) {
        if (!stackKeyX) {
            stackKeyX = "valueX";
        }
        if (!stackKeyY) {
            stackKeyY = "valueY";
        }
        var x = this.yAxis.getX(dataItem, yKey, locationY, stackKeyY);
        var y = this.yAxis.getY(dataItem, yKey, locationY, stackKeyY);
        var radius = __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["getDistance"]({ x: x, y: y });
        var angle = this.xAxis.getAngle(dataItem, xKey, locationX, stackKeyX);
        return { x: radius * __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["cos"](angle), y: radius * __WEBPACK_IMPORTED_MODULE_5__core_utils_Math__["sin"](angle) };
    };
    return RadarColumnSeries;
}(__WEBPACK_IMPORTED_MODULE_0__series_ColumnSeries__["a" /* ColumnSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["b" /* registry */].registeredClasses["RadarColumnSeries"] = RadarColumnSeries;
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["b" /* registry */].registeredClasses["RadarColumnSeriesDataItem"] = RadarColumnSeriesDataItem;
//# sourceMappingURL=RadarColumnSeries.js.map

/***/ }),

/***/ 311:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RadarColumn; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Column__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Slice__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(2);
/**
 * Module that defines everything related to building RadarColumns.
 * It is a container which has radarColumn element which is a Slice.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates RadarColumns.
 *
 * @see {@link IRadarColumnEvents} for a list of available events
 * @see {@link IRadarColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var RadarColumn = /** @class */ (function (_super) {
    __extends(RadarColumn, _super);
    /**
     * Constructor
     */
    function RadarColumn() {
        var _this = _super.call(this) || this;
        _this.className = "RadarColumn";
        return _this;
    }
    RadarColumn.prototype.createAssets = function () {
        this.radarColumn = this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Slice__["a" /* Slice */]);
        this.radarColumn.shouldClone = false;
        this.radarColumn.strokeOpacity = undefined;
        // some dirty hack so that if user access column, it won't get error
        this.column = this.radarColumn;
    };
    RadarColumn.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.radarColumn) {
            this.radarColumn.copyFrom(source.radarColumn);
        }
    };
    /**
     * X coordinate for the slice tooltip.
     *
     * @return {number} X
     */
    RadarColumn.prototype.getTooltipX = function () {
        var value = this.getPropertyValue("tooltipX");
        if (!__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](value)) {
            value = this.radarColumn.tooltipX;
        }
        return value;
    };
    /**
     * Y coordinate for the slice tooltip.
     *
     * @return {number} Y
     */
    RadarColumn.prototype.getTooltipY = function () {
        var value = this.getPropertyValue("tooltipX");
        if (!__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](value)) {
            value = this.radarColumn.tooltipY;
        }
        return value;
    };
    return RadarColumn;
}(__WEBPACK_IMPORTED_MODULE_0__Column__["a" /* Column */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["RadarColumn"] = RadarColumn;
//# sourceMappingURL=RadarColumn.js.map

/***/ }),

/***/ 312:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ConeSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConeSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ColumnSeries__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__elements_ConeColumn__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__ = __webpack_require__(12);
/**
 * ConeSeries module
 * Not recommended using if you use scrollbars or your chart is zoomable in some other way.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ConeSeries]].
 *
 * @see {@link DataItem}
 */
var ConeSeriesDataItem = /** @class */ (function (_super) {
    __extends(ConeSeriesDataItem, _super);
    /**
     * Constructor
     */
    function ConeSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "ConeSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    return ConeSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__ColumnSeries__["b" /* ColumnSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a cone graph.
 *
 * @see {@link IConeSeriesEvents} for a list of available Events
 * @see {@link IConeSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var ConeSeries = /** @class */ (function (_super) {
    __extends(ConeSeries, _super);
    /**
     * Constructor
     */
    function ConeSeries() {
        var _this = _super.call(this) || this;
        _this.className = "ConeSeries";
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns an element to use for Candlestick
     * @ignore
     * @return {this["_column"]} Element.
     */
    ConeSeries.prototype.createColumnTemplate = function () {
        return new __WEBPACK_IMPORTED_MODULE_1__elements_ConeColumn__["a" /* ConeColumn */]();
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    ConeSeries.prototype.validate = function () {
        _super.prototype.validate.call(this);
    };
    /**
     * Returns an SVG path to use as series mask.
     *
     * @return {string} SVG path
     */
    ConeSeries.prototype.getMaskPath = function () {
        var dx = 0;
        var dy = 0;
        var column = this.columns.getIndex(0);
        if (this.baseAxis == this.xAxis) {
            dy = column.coneColumn.bottom.radiusY + 1;
        }
        else {
            dx = column.coneColumn.bottom.radiusY + 1;
        }
        return __WEBPACK_IMPORTED_MODULE_3__core_rendering_Path__["rectToPath"]({
            x: -dx,
            y: 0,
            width: this.xAxis.axisLength + dx,
            height: this.yAxis.axisLength + dy
        });
    };
    /**
     * Validates data item's elements.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    ConeSeries.prototype.validateDataElementReal = function (dataItem) {
        _super.prototype.validateDataElementReal.call(this, dataItem);
        var coneColumn = dataItem.column.coneColumn;
        coneColumn.fill = dataItem.column.fill;
        if (this.baseAxis == this.yAxis) {
            coneColumn.orientation = "horizontal";
        }
        else {
            coneColumn.orientation = "vertical";
        }
    };
    return ConeSeries;
}(__WEBPACK_IMPORTED_MODULE_0__ColumnSeries__["a" /* ColumnSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["ConeSeries"] = ConeSeries;
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["ConeSeriesDataItem"] = ConeSeriesDataItem;
//# sourceMappingURL=ConeSeries.js.map

/***/ }),

/***/ 313:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConeColumn; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Column__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_3d_Cone__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/**
 * Module that defines everything related to building Cone Columns.
 * It is a container which has coneColumn element which is a Cone.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates ConeColumns.
 *
 * @see {@link IConeColumnEvents} for a list of available events
 * @see {@link IConeColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var ConeColumn = /** @class */ (function (_super) {
    __extends(ConeColumn, _super);
    /**
     * Constructor
     */
    function ConeColumn() {
        var _this = _super.call(this) || this;
        _this.className = "ConeColumn";
        return _this;
    }
    ConeColumn.prototype.createAssets = function () {
        this.coneColumn = this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_3d_Cone__["a" /* Cone */]);
        this.coneColumn.shouldClone = false;
        // some dirty hack so that if user access column, it won't get error
        this.column = this.coneColumn;
    };
    ConeColumn.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.coneColumn) {
            this.coneColumn.copyFrom(source.coneColumn);
        }
    };
    return ConeColumn;
}(__WEBPACK_IMPORTED_MODULE_0__Column__["a" /* Column */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["ConeColumn"] = ConeColumn;
//# sourceMappingURL=ConeColumn.js.map

/***/ }),

/***/ 314:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CircleBullet; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Bullet__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Circle__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/**
 * Bullet module
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a bullet with a textual label.
 *
 * Uses [[Label]] instance to draw the label, so the label itself is
 * configurable.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var CircleBullet = /** @class */ (function (_super) {
    __extends(CircleBullet, _super);
    /**
     * Constructor
     */
    function CircleBullet() {
        var _this = _super.call(this) || this;
        _this.className = "CircleBullet";
        _this.circle = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Circle__["a" /* Circle */]);
        _this.circle.shouldClone = false;
        _this.circle.radius = 5;
        return _this;
    }
    /**
     * Copies all proprities and related stuff from another instance of
     * [[CircleBullet]].
     *
     * @param {this}  source  Source element
     */
    CircleBullet.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.circle.copyFrom(source.circle);
    };
    return CircleBullet;
}(__WEBPACK_IMPORTED_MODULE_0__Bullet__["a" /* Bullet */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["b" /* registry */].registeredClasses["CircleBullet"] = CircleBullet;
//# sourceMappingURL=CircleBullet.js.map

/***/ }),

/***/ 315:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return XYChartScrollbar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_elements_Scrollbar__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sprite__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__types_XYChart__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_rendering_filters_DesaturateFilter__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_rendering_Path__ = __webpack_require__(12);
/**
 * A module with functionality for buildin a scrollbar with an XY graph in it.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */











/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A special version of the Scrollbar that has an XY chart in it.
 *
 * Used mainly as an advanced scrollbar with a preview for other XY charts.
 *
 * However, can be used as standalone element.
 *
 * @see {@link IXYChartScrollbarEvents} for a list of available events
 * @see {@link IXYChartScrollbarAdapters} for a list of available Adapters
 * @important
 */
var XYChartScrollbar = /** @class */ (function (_super) {
    __extends(XYChartScrollbar, _super);
    /**
     * Constructor
     */
    function XYChartScrollbar() {
        var _this = _super.call(this) || this;
        /**
         * A chart element Scrollbar is for.
         *
         * @type {MutableValueDisposer}
         */
        _this._chart = new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "XYChartScrollbar";
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        _this.padding(0, 0, 0, 0);
        var scrollbarChart = _this.createChild(__WEBPACK_IMPORTED_MODULE_4__types_XYChart__["a" /* XYChart */]);
        scrollbarChart.shouldClone = false;
        scrollbarChart.margin(0, 0, 0, 0);
        scrollbarChart.padding(0, 0, 0, 0);
        scrollbarChart.mouseEnabled = false;
        _this._scrollbarChart = scrollbarChart;
        _this._disposers.push(_this._scrollbarChart);
        _this.minHeight = 60;
        _this.minWidth = 60;
        var unselectedOverlay = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Sprite__["a" /* Sprite */]);
        unselectedOverlay.shouldClone = false;
        unselectedOverlay.element = _this.paper.add("path");
        unselectedOverlay.fill = interfaceColors.getFor("background");
        unselectedOverlay.fillOpacity = 0.8;
        unselectedOverlay.mouseEnabled = false;
        unselectedOverlay.isMeasured = false;
        unselectedOverlay.toBack();
        _this._unselectedOverlay = unselectedOverlay;
        _this._disposers.push(_this._unselectedOverlay);
        scrollbarChart.toBack();
        _this.background.cornerRadius(0, 0, 0, 0);
        var thumbBackground = _this.thumb.background;
        thumbBackground.cornerRadius(0, 0, 0, 0);
        thumbBackground.fillOpacity = 0;
        thumbBackground.fill = interfaceColors.getFor("background");
        var hoverState = thumbBackground.states.getKey("hover");
        if (hoverState) {
            hoverState.properties.fillOpacity = 0.2;
        }
        var downState = thumbBackground.states.getKey("down");
        if (downState) {
            downState.properties.fillOpacity = 0.4;
        }
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(XYChartScrollbar.prototype, "series", {
        /**
         * A list of series that are used to draw graph(s) on the scrollbar.
         *
         * @readonly
         * @return {List<XYSeries>} Series
         */
        get: function () {
            if (!this._series) {
                this._series = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["b" /* List */]();
                this._series.events.on("insert", this.handleSeriesAdded, this);
                this._series.events.on("remove", this.handleSeriesRemoved, this);
            }
            return this._series;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorates a new series when they are pushed into a `series` list.
     *
     * @param {IListEvents<XYSeries>["insert"]} event Event
     */
    XYChartScrollbar.prototype.handleSeriesAdded = function (event) {
        var sourceSeries = event.newValue;
        var scrollbarChart = this.scrollbarChart;
        scrollbarChart.zoomOutButton.disabled = true;
        this.chart = sourceSeries.chart;
        var addXAxis = true;
        var addYAxis = true;
        // check if we haven't added clone of x or y axis before
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            if (series != sourceSeries) {
                if (series.xAxis == sourceSeries.xAxis) {
                    addXAxis = false;
                }
                if (series.yAxis == sourceSeries.yAxis) {
                    addYAxis = false;
                }
            }
        });
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        var series = sourceSeries.clone();
        if (addXAxis) {
            var xAxis = sourceSeries.xAxis.clone();
            scrollbarChart.xAxes.moveValue(xAxis);
            xAxis.title.disabled = true;
            xAxis.rangeChangeDuration = 0;
            xAxis.id = sourceSeries.uid;
            xAxis.title.disabled = true;
            var renderer = xAxis.renderer;
            renderer.ticks.template.disabled = true;
            renderer.inside = true;
            renderer.line.strokeOpacity = 0;
            renderer.minLabelPosition = 0.02;
            renderer.maxLabelPosition = 0.98;
            renderer.line.disabled = true;
            renderer.axisFills.template.disabled = true;
            renderer.baseGrid.disabled = true;
            renderer.grid.template.strokeOpacity = 0.05;
            var labelsTemplate = renderer.labels.template;
            labelsTemplate.fillOpacity = 0.5;
            series.xAxis = xAxis;
        }
        else {
            // @todo find clone, otherwise there might be probs with multiple axes
        }
        if (addYAxis) {
            var yAxis = sourceSeries.yAxis.clone();
            scrollbarChart.yAxes.moveValue(yAxis);
            yAxis.title.disabled = true;
            yAxis.rangeChangeDuration = 0;
            var renderer = yAxis.renderer;
            renderer.ticks.template.disabled = true;
            renderer.inside = true;
            renderer.line.strokeOpacity = 0;
            renderer.minLabelPosition = 0.02;
            renderer.maxLabelPosition = 0.98;
            renderer.line.disabled = true;
            renderer.axisFills.template.disabled = true;
            renderer.grid.template.stroke = interfaceColors.getFor("background");
            renderer.baseGrid.disabled = true;
            renderer.grid.template.strokeOpacity = 0.05;
            var labelsTemplate = renderer.labels.template;
            labelsTemplate.fillOpacity = 0.5;
            series.yAxis = yAxis;
        }
        else {
            // @todo find clone, otherwise there might be probs with multiple axes
        }
        series.rangeChangeDuration = 0;
        series.interpolationDuration = 0;
        series.defaultState.transitionDuration = 0;
        series.events.on("validated", this.zoomOutAxes, this);
        series.defaultState.properties.visible = true;
        series.filters.push(new __WEBPACK_IMPORTED_MODULE_7__core_rendering_filters_DesaturateFilter__["a" /* DesaturateFilter */]());
        scrollbarChart.series.push(series);
    };
    /**
     * @ignore
     */
    XYChartScrollbar.prototype.updateByOrientation = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](this._scrollbarChart.xAxes.iterator(), function (xAxis) {
            if (_this.orientation == "vertical") {
                var renderer = xAxis.renderer;
                renderer.grid.template.disabled = true;
                renderer.labels.template.disabled = true;
                renderer.minGridDistance = 10;
            }
        });
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](this._scrollbarChart.yAxes.iterator(), function (yAxis) {
            if (_this.orientation == "horizontal") {
                var renderer = yAxis.renderer;
                renderer.grid.template.disabled = true;
                renderer.labels.template.disabled = true;
                renderer.minGridDistance = 10;
            }
        });
    };
    /**
     * Cleans up after series are removed from Scrollbar.
     *
     * @param {IListEvents<XYSeries>["remove"]}  event  Event
     */
    XYChartScrollbar.prototype.handleSeriesRemoved = function (event) {
        var sourceSeries = event.oldValue;
        sourceSeries.events.off("validated", this.zoomOutAxes, this);
    };
    Object.defineProperty(XYChartScrollbar.prototype, "scrollbarChart", {
        /**
         * A chart element that is used to display graphs in the Scrollbar.
         *
         * This is not the same as `chart`. It's a totally independent instance of
         * [[XYChart]] with separate config, series, etc.
         *
         * It can be configured just like any other [[XYChart]].
         *
         * @readonly
         * @return {XYChart} Scrollbar's internal chart
         */
        get: function () {
            return this._scrollbarChart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChartScrollbar.prototype, "chart", {
        /**
         * @return {XYChart} Chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * A chart that Scrollbar belongs to.
         *
         * @param {XYChart} chart  Chart
         */
        set: function (chart) {
            if (this._chart.get() !== chart) {
                this._chart.set(chart, chart.events.on("datavalidated", this.handleDataChanged, this));
                this.handleDataChanged();
                this._scrollbarChart.dataProvider = chart; // this makes scrollbar chart do not validate data untill charts' data is validated
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates Scrollbar's internal chart's data when the main chart's data
     * changes.
     *
     * @ignore Exclude from docs
     */
    XYChartScrollbar.prototype.handleDataChanged = function () {
        this.scrollbarChart.data = this.chart.data;
    };
    /**
     * Zooms out all axes on the internal chart.
     */
    XYChartScrollbar.prototype.zoomOutAxes = function () {
        var scrollbarChart = this.scrollbarChart;
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](scrollbarChart.xAxes.iterator(), function (x) {
            x.zoom({ start: 0, end: 1 }, true, true);
        });
        __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["each"](scrollbarChart.yAxes.iterator(), function (y) {
            y.zoom({ start: 0, end: 1 }, true, true);
        });
    };
    /**
     * Updates scrollbar thumb.
     */
    XYChartScrollbar.prototype.updateThumb = function () {
        _super.prototype.updateThumb.call(this);
        if (this._unselectedOverlay) {
            var thumb = this.thumb;
            var x = thumb.pixelX;
            var y = thumb.pixelY;
            var w = thumb.pixelWidth;
            var h = thumb.pixelHeight;
            var path = void 0;
            if (this.orientation == "horizontal") {
                path = __WEBPACK_IMPORTED_MODULE_10__core_rendering_Path__["rectToPath"]({
                    x: 0,
                    y: 0,
                    width: x,
                    height: h
                });
                path += __WEBPACK_IMPORTED_MODULE_10__core_rendering_Path__["rectToPath"]({
                    x: x + w,
                    y: 0,
                    width: this.pixelWidth - x - w,
                    height: h
                });
            }
            else {
                path = __WEBPACK_IMPORTED_MODULE_10__core_rendering_Path__["rectToPath"]({
                    x: 0,
                    y: 0,
                    width: w,
                    height: y
                });
                path += __WEBPACK_IMPORTED_MODULE_10__core_rendering_Path__["rectToPath"]({
                    x: 0,
                    y: y + h,
                    width: w,
                    height: this.pixelHeight - y - h
                });
            }
            this._unselectedOverlay.element.attr({ "d": path });
        }
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    XYChartScrollbar.prototype.processConfig = function (config) {
        if (config) {
            if (__WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["hasValue"](config.series) && __WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["isArray"](config.series)) {
                for (var i = 0, len = config.series.length; i < len; i++) {
                    var series = config.series[i];
                    if (__WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["hasValue"](series) && __WEBPACK_IMPORTED_MODULE_9__core_utils_Type__["isString"](series) && this.map.hasKey(series)) {
                        config.series[i] = this.map.getKey(series);
                    }
                }
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return XYChartScrollbar;
}(__WEBPACK_IMPORTED_MODULE_0__core_elements_Scrollbar__["a" /* Scrollbar */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_5__core_Registry__["b" /* registry */].registeredClasses["XYChartScrollbar"] = XYChartScrollbar;
//# sourceMappingURL=XYChartScrollbar.js.map

/***/ }),

/***/ 316:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return NavigationBarDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavigationBar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Component__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_DataItem__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_elements_TextLink__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_elements_Triangle__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__ = __webpack_require__(4);
/**
 * Functionality for drawing simple NavigationBar.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */









/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[NavigationBar]].
 *
 * @see {@link DataItem}
 */
var NavigationBarDataItem = /** @class */ (function (_super) {
    __extends(NavigationBarDataItem, _super);
    /**
     * Constructor
     */
    function NavigationBarDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "NavigationBarDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(NavigationBarDataItem.prototype, "name", {
        /**
         * @return {string} Name
         */
        get: function () {
            return this.properties["name"];
        },
        /**
         * Name of the navigation bar item.
         *
         * @param {string}  value  Name
         */
        set: function (value) {
            this.setProperty("name", value);
        },
        enumerable: true,
        configurable: true
    });
    return NavigationBarDataItem;
}(__WEBPACK_IMPORTED_MODULE_1__core_DataItem__["a" /* DataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * NavigationBar class can be used to create a multi-level breadcrumb-style
 * navigation control.
 *
 * @see {@link INavigationBarEvents} for a list of available events
 * @see {@link INavigationBarAdapters} for a list of available Adapters
 * @todo Implement better
 * @important
 */
var NavigationBar = /** @class */ (function (_super) {
    __extends(NavigationBar, _super);
    /**
     * Constructor
     */
    function NavigationBar() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "NavigationBar";
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        var textLink = new __WEBPACK_IMPORTED_MODULE_3__core_elements_TextLink__["a" /* TextLink */]();
        textLink.valign = "middle";
        textLink.paddingTop = 8;
        textLink.paddingBottom = 8;
        _this.paddingBottom = 2;
        _this.links = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["e" /* ListTemplate */](textLink);
        _this._linksIterator = new __WEBPACK_IMPORTED_MODULE_8__core_utils_Iterator__["ListIterator"](_this.links, function () { return _this.links.create(); });
        _this._linksIterator.createNewItems = true;
        var triangle = new __WEBPACK_IMPORTED_MODULE_4__core_elements_Triangle__["a" /* Triangle */]();
        triangle.direction = "right";
        triangle.width = 8;
        triangle.height = 12;
        triangle.fill = interfaceColors.getFor("alternativeBackground");
        triangle.fillOpacity = 0.5;
        triangle.valign = "middle";
        triangle.marginLeft = 10;
        triangle.marginRight = 10;
        _this.separators = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["e" /* ListTemplate */](triangle);
        var activeLink = new __WEBPACK_IMPORTED_MODULE_3__core_elements_TextLink__["a" /* TextLink */]();
        _this.activeLink = activeLink;
        activeLink.copyFrom(textLink);
        activeLink.valign = "middle";
        activeLink.fontWeigth = "bold";
        _this.width = Object(__WEBPACK_IMPORTED_MODULE_7__core_utils_Percent__["c" /* percent */])(100);
        _this.layout = "grid";
        _this.dataFields.name = "name";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Completely redraws the navigation bar.
     *
     * @ignore Exclude from docs
     */
    NavigationBar.prototype.validateDataElements = function () {
        this.removeChildren();
        this._linksIterator.reset();
        _super.prototype.validateDataElements.call(this);
        //@todo: dispose
    };
    /**
     * Creates a visual element for a data item (nav item).
     *
     * @ignore Exclude from docs
     * @param {NavigationBarDataItem}  dataItem  Data item
     */
    NavigationBar.prototype.validateDataElement = function (dataItem) {
        _super.prototype.validateDataElement.call(this, dataItem);
        var textLink;
        if (dataItem.index < this.dataItems.length - 1) {
            textLink = this._linksIterator.getLast();
            textLink.parent = this;
            var separator = this.separators.create();
            separator.parent = this;
            separator.valign = "middle";
        }
        else {
            textLink = this.activeLink;
            textLink.events.copyFrom(this.links.template.events);
            textLink.hide(0);
            textLink.show();
            textLink.parent = this;
        }
        textLink.dataItem = dataItem;
        textLink.text = dataItem.name;
    };
    return NavigationBar;
}(__WEBPACK_IMPORTED_MODULE_0__core_Component__["a" /* Component */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_5__core_Registry__["b" /* registry */].registeredClasses["NavigationBar"] = NavigationBar;
__WEBPACK_IMPORTED_MODULE_5__core_Registry__["b" /* registry */].registeredClasses["NavigationBarDataItem"] = NavigationBarDataItem;
//# sourceMappingURL=NavigationBar.js.map

/***/ }),

/***/ 86:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ColumnSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ColumnSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__XYSeries__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Sprite__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Dictionary__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__axes_ValueAxis__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__axes_CategoryAxis__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__elements_Column__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_elements_RoundedRectangle__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__core_utils_Array__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__core_utils_Type__ = __webpack_require__(2);
/**
 * Column series module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
















/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ColumnSeries]].
 *
 * @see {@link DataItem}
 */
var ColumnSeriesDataItem = /** @class */ (function (_super) {
    __extends(ColumnSeriesDataItem, _super);
    /**
     * Constructor
     */
    function ColumnSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "ColumnSeriesDataItem";
        _this.locations["dateX"] = 0.5;
        _this.locations["dateY"] = 0.5;
        _this.locations["categoryX"] = 0.5;
        _this.locations["categoryY"] = 0.5;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(ColumnSeriesDataItem.prototype, "column", {
        /**
         * @return {Column} Column
         */
        get: function () {
            return this._column;
        },
        /**
         * A column used to draw a column for this data item.
         *
         * @param {Column}  column
         */
        set: function (column) {
            this.setColumn(column);
        },
        enumerable: true,
        configurable: true
    });
    ColumnSeriesDataItem.prototype.setColumn = function (column) {
        if (this._column && column != this._column) {
            __WEBPACK_IMPORTED_MODULE_14__core_utils_Array__["k" /* remove */](this.sprites, this._column);
        }
        this._column = column;
        if (column) {
            var prevDataItem = column.dataItem;
            if (prevDataItem && prevDataItem != this) {
                prevDataItem.column = undefined;
            }
            this.addSprite(column);
        }
    };
    Object.defineProperty(ColumnSeriesDataItem.prototype, "rangesColumns", {
        /**
         * A dictionary storing axes ranges columns by axis uid
         *
         * @type {Dictionary<string, this["_column"]>}
         */
        get: function () {
            if (!this._rangesColumns) {
                this._rangesColumns = new __WEBPACK_IMPORTED_MODULE_4__core_utils_Dictionary__["a" /* Dictionary */]();
            }
            return this._rangesColumns;
        },
        enumerable: true,
        configurable: true
    });
    return ColumnSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__XYSeries__["b" /* XYSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a column graph.
 *
 * @see {@link IColumnSeriesEvents} for a list of available Events
 * @see {@link IColumnSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var ColumnSeries = /** @class */ (function (_super) {
    __extends(ColumnSeries, _super);
    /**
     * Constructor
     */
    function ColumnSeries() {
        var _this = _super.call(this) || this;
        /**
         * Start location within cell for columns.
         *
         * @type {number}
         */
        _this._startLocation = 0;
        /**
         * End location within cell for columns.
         *
         * @type {number}
         */
        _this._endLocation = 1;
        /**
         * When working value of dataItem changes, we must process all the values to calculate sum, min, max etc. Also update stack values. This is quite expensive operation.
         * Unfortunately we do not know if user needs this processed values or not. By setting simplifiedProcessing = true you disable this processing and in case working
         * value changes, we only redraw the particular column. Do not do this if you have staked chart or use calculated values in bullets or in tooltips.
         *
         * @type {boolean}
         */
        _this.simplifiedProcessing = false;
        _this.className = "ColumnSeries";
        _this.width = Object(__WEBPACK_IMPORTED_MODULE_10__core_utils_Percent__["c" /* percent */])(100);
        _this.height = Object(__WEBPACK_IMPORTED_MODULE_10__core_utils_Percent__["c" /* percent */])(100);
        _this.strokeOpacity = 0;
        _this.fillOpacity = 1;
        _this.clustered = true;
        var columnsContainer = _this.mainContainer.createChild(__WEBPACK_IMPORTED_MODULE_2__core_Container__["a" /* Container */]);
        columnsContainer.shouldClone = false;
        columnsContainer.isMeasured = false;
        columnsContainer.layout = "none";
        _this._columnsContainer = columnsContainer;
        _this.columns;
        _this.columns.template.pixelPerfect = false;
        _this.tooltipColorSource = _this.columns.template;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(ColumnSeries.prototype, "columnsContainer", {
        /**
         * A container that columns are created in.
         *
         * @ignore Exclude from docs
         */
        get: function () {
            return this._columnsContainer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    ColumnSeries.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        if (!__WEBPACK_IMPORTED_MODULE_15__core_utils_Type__["hasValue"](this.readerTitle)) {
            this.readerTitle = this.language.translate("Column Series");
        }
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {ColumnSeriesDataItem} Data Item
     */
    ColumnSeries.prototype.createDataItem = function () {
        return new ColumnSeriesDataItem();
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    ColumnSeries.prototype.validate = function () {
        //@todo Check if we can do better than use `instanceof`
        var _this = this;
        // find start/end locations based on clustered/stacked settings
        // go through chart series instead of base axis series, because axis series doesn't maintain order
        var baseAxisSeries = this.chart.series;
        var clusterCount = 0;
        var index = 0;
        __WEBPACK_IMPORTED_MODULE_13__core_utils_Iterator__["each"](baseAxisSeries.iterator(), function (series) {
            if (series instanceof ColumnSeries) {
                if (_this.baseAxis == series.baseAxis) {
                    if ((!series.stacked && series.clustered) || series.newStack || clusterCount === 0) {
                        clusterCount++;
                    }
                    if (series == _this) {
                        index = clusterCount - 1;
                    }
                }
            }
        });
        var renderer = this.baseAxis.renderer;
        var cellStartLocation = renderer.cellStartLocation;
        var cellEndLocation = renderer.cellEndLocation;
        this._startLocation = cellStartLocation + (index / clusterCount) * (cellEndLocation - cellStartLocation);
        this._endLocation = cellStartLocation + (index + 1) / clusterCount * (cellEndLocation - cellStartLocation);
        // can't use columnsContainer.removeChildren() because with 3d columns we use one container for all columns
        __WEBPACK_IMPORTED_MODULE_13__core_utils_Iterator__["each"](this.columns.iterator(), function (column) {
            column.__disabled = true;
        });
        _super.prototype.validate.call(this);
    };
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {ColumnSeriesDataItem}  dataItem  Data item
     */
    ColumnSeries.prototype.validateDataElement = function (dataItem) {
        // important oder here, first real, then super. we need this to know size
        this.validateDataElementReal(dataItem);
        _super.prototype.validateDataElement.call(this, dataItem);
    };
    /**
     * Returns relative start location for the data item.
     *
     * @param  {this["_dataItem"]}  dataItem  Data item
     * @return {number}                       Location (0-1)
     */
    ColumnSeries.prototype.getStartLocation = function (dataItem) {
        var startLocation = this._startLocation;
        if (this.baseAxis == this.xAxis) {
            startLocation += dataItem.locations[this.xOpenField] - 0.5;
        }
        else {
            startLocation += dataItem.locations[this.yOpenField] - 0.5;
        }
        return startLocation;
    };
    ColumnSeries.prototype.handleDataItemWorkingValueChange = function (event) {
        if (this.simplifiedProcessing) {
            this.validateDataElement(event.target);
        }
        else {
            _super.prototype.handleDataItemWorkingValueChange.call(this, event);
        }
    };
    /**
     * Returns relative end location for the data item.
     *
     * @param  {this["_dataItem"]}  dataItem  Data item
     * @return {number}                       Location (0-1)
     */
    ColumnSeries.prototype.getEndLocation = function (dataItem) {
        var endLocation = this._endLocation;
        if (this.baseAxis == this.xAxis) {
            endLocation += dataItem.locations[this.xField] - 0.5;
        }
        else {
            endLocation += dataItem.locations[this.yField] - 0.5;
        }
        return endLocation;
    };
    /**
     * Validates data item's elements.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    ColumnSeries.prototype.validateDataElementReal = function (dataItem) {
        var _this = this;
        //	if (dataItem.hasValue([this.xField, this.yField])) { // todo: this doesn't work with categories, think of a better way
        var l;
        var r;
        var t;
        var b;
        var startLocation = this.getStartLocation(dataItem);
        var endLocation = this.getEndLocation(dataItem);
        var xField = this.xField;
        var xOpenField = this.xOpenField;
        var yField = this.yField;
        var yOpenField = this.yOpenField;
        var template = this.columns.template;
        var percentWidth = template.percentWidth;
        var percentHeight = template.percentHeight;
        var pixelWidth = template.pixelWidth;
        var pixelHeight = template.pixelHeight;
        // two category axes
        if ((this.xAxis instanceof __WEBPACK_IMPORTED_MODULE_6__axes_CategoryAxis__["a" /* CategoryAxis */]) && (this.yAxis instanceof __WEBPACK_IMPORTED_MODULE_6__axes_CategoryAxis__["a" /* CategoryAxis */])) {
            startLocation = 0;
            endLocation = 1;
            if (!__WEBPACK_IMPORTED_MODULE_15__core_utils_Type__["isNaN"](percentWidth)) {
                var offset = __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["round"]((endLocation - startLocation) * (1 - percentWidth / 100) / 2, 5);
                startLocation += offset;
                endLocation -= offset;
            }
            l = this.xAxis.getX(dataItem, xOpenField, startLocation);
            r = this.xAxis.getX(dataItem, xField, endLocation);
            // in case width is set in pixels
            if (__WEBPACK_IMPORTED_MODULE_15__core_utils_Type__["isNaN"](percentWidth)) {
                var offset = ((r - l) - pixelWidth) / 2;
                l += offset;
                r -= offset;
            }
            startLocation = 0;
            endLocation = 1;
            if (!__WEBPACK_IMPORTED_MODULE_15__core_utils_Type__["isNaN"](percentHeight)) {
                var offset = __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["round"]((1 - percentHeight / 100) / 2, 5);
                startLocation += offset;
                endLocation -= offset;
            }
            t = this.yAxis.getY(dataItem, yOpenField, startLocation);
            b = this.yAxis.getY(dataItem, yField, endLocation);
            // in case width is set in pixels
            if (__WEBPACK_IMPORTED_MODULE_15__core_utils_Type__["isNaN"](percentHeight)) {
                var offset = ((b - t) - pixelHeight) / 2;
                b += offset;
                t -= offset;
            }
            r = this.fixHorizontalCoordinate(r);
            l = this.fixHorizontalCoordinate(l);
            t = this.fixVerticalCoordinate(t);
            b = this.fixVerticalCoordinate(b);
        }
        else if (this.baseAxis == this.xAxis) {
            // in case width is set in percent
            if (!__WEBPACK_IMPORTED_MODULE_15__core_utils_Type__["isNaN"](percentWidth)) {
                var offset = __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["round"]((endLocation - startLocation) * (1 - percentWidth / 100) / 2, 5);
                startLocation += offset;
                endLocation -= offset;
            }
            l = this.xAxis.getX(dataItem, xOpenField, startLocation);
            r = this.xAxis.getX(dataItem, xField, endLocation);
            // in case width is set in pixels
            if (__WEBPACK_IMPORTED_MODULE_15__core_utils_Type__["isNaN"](percentWidth)) {
                var offset = ((r - l) - pixelWidth) / 2;
                l += offset;
                r -= offset;
            }
            var bottomLocation = dataItem.locations[yOpenField];
            var topLocation = dataItem.locations[yField];
            // otherwise gantt chart will start items in the middle of a cell
            if (this.yAxis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_ValueAxis__["a" /* ValueAxis */]) {
                bottomLocation = 0;
                topLocation = 0;
            }
            b = this.yAxis.getY(dataItem, yOpenField, bottomLocation);
            t = this.yAxis.getY(dataItem, yField, topLocation);
            // used to save location for bullets, but it's not a good approach
            // dataItem.locations[xField] = startLocation + (endLocation - startLocation) / 2;
            t = this.fixVerticalCoordinate(t);
            b = this.fixVerticalCoordinate(b);
        }
        // horizontal bars
        else {
            if (!__WEBPACK_IMPORTED_MODULE_15__core_utils_Type__["isNaN"](percentHeight)) {
                var offset = __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["round"]((1 - percentHeight / 100) / 2, 5);
                startLocation += offset;
                endLocation -= offset;
            }
            t = this.yAxis.getY(dataItem, yOpenField, startLocation);
            b = this.yAxis.getY(dataItem, yField, endLocation);
            // in case width is set in pixels
            if (__WEBPACK_IMPORTED_MODULE_15__core_utils_Type__["isNaN"](percentHeight)) {
                var offset = ((b - t) - pixelHeight) / 2;
                b += offset;
                t -= offset;
            }
            var rightLocation = dataItem.locations[xField];
            var leftLocation = dataItem.locations[xOpenField];
            // otherwise gantt chart will start items in the middle of a cell
            if (this.xAxis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_ValueAxis__["a" /* ValueAxis */]) {
                rightLocation = 0;
                leftLocation = 0;
            }
            r = this.xAxis.getX(dataItem, xField, rightLocation);
            l = this.xAxis.getX(dataItem, xOpenField, leftLocation);
            // used to save location for bullets, but it's not a good approach
            // dataItem.locations[yField] = startLocation + (endLocation - startLocation) / 2;
            r = this.fixHorizontalCoordinate(r);
            l = this.fixHorizontalCoordinate(l);
        }
        var paddingLeft = template.pixelPaddingLeft;
        var paddingRight = template.pixelPaddingRight;
        var paddingTop = template.pixelPaddingTop;
        var paddingBottom = template.pixelPaddingBottom;
        var w = Math.abs(r - l);
        var h = Math.abs(b - t);
        var x = Math.min(l, r);
        var y = Math.min(t, b);
        if (w - paddingLeft - paddingRight > 0 && h - paddingTop - paddingBottom > 0) {
            var column = void 0;
            if (!dataItem.column) {
                column = this.columns.create();
                __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__["forceCopyProperties"](this.columns.template, column, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
                __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__["copyProperties"](this, column, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]); // need this because 3d columns are not in the same container
                __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__["copyProperties"](this.columns.template, column, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]); // second time, no force, so that columns.template would override series properties
                dataItem.addSprite(column);
                dataItem.column = column;
            }
            else {
                column = dataItem.column;
            }
            column.width = w;
            column.height = h;
            column.x = x;
            column.y = y;
            column.parent = this.columnsContainer;
            this.setColumnStates(column);
            if (column.invalid) {
                column.validate(); // validate as if it was used previously, it will flicker with previous dimensions
            }
            column.__disabled = false;
            __WEBPACK_IMPORTED_MODULE_13__core_utils_Iterator__["each"](this.axisRanges.iterator(), function (axisRange) {
                var rangeColumn = dataItem.rangesColumns.getKey(axisRange.uid);
                if (!rangeColumn) {
                    rangeColumn = _this.columns.create();
                    __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__["forceCopyProperties"](_this.columns.template, rangeColumn, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
                    __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__["copyProperties"](axisRange.contents, rangeColumn, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]); // need this because 3d columns are not in the same container
                    dataItem.addSprite(rangeColumn);
                    dataItem.rangesColumns.setKey(axisRange.uid, rangeColumn);
                }
                rangeColumn.parent = axisRange.contents;
                rangeColumn.width = w;
                rangeColumn.height = h;
                rangeColumn.x = x;
                rangeColumn.y = y;
                _this.setColumnStates(rangeColumn);
                if (rangeColumn.invalid) {
                    rangeColumn.validate(); // validate as if it was used previously, it will flicker with previous dimensions
                }
                rangeColumn.__disabled = false;
            });
        }
        else {
            this.disableUnusedColumns(dataItem);
        }
        dataItem.itemWidth = w;
        dataItem.itemHeight = h;
    };
    ColumnSeries.prototype.disableUnusedColumns = function (dataItem) {
        if (dataItem.column) {
            dataItem.column.__disabled = true;
        }
        __WEBPACK_IMPORTED_MODULE_13__core_utils_Iterator__["each"](this.axisRanges.iterator(), function (axisRange) {
            var rangeColumn = dataItem.rangesColumns.getKey(axisRange.uid);
            if (rangeColumn) {
                rangeColumn.__disabled = true;
            }
        });
    };
    /**
     * Apply different state/coloring to columns based on the change value.
     *
     * @param {Sprite}  sprite  Sprite to apply state to
     * @todo Do not apply accessibility to wicks of the candlesticks
     */
    ColumnSeries.prototype.setColumnStates = function (sprite) {
        var _this = this;
        var dataItem = sprite.dataItem;
        if (this.xAxis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_ValueAxis__["a" /* ValueAxis */] || this.yAxis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_ValueAxis__["a" /* ValueAxis */]) {
            var open_1;
            var value = void 0;
            var change = void 0;
            if (this.baseAxis == this.yAxis) {
                open_1 = dataItem.getValue(this.xOpenField);
                value = dataItem.getValue(this.xField);
                change = dataItem.getValue(this.xAxis.axisFieldName + "X", "previousChange");
            }
            else {
                open_1 = dataItem.getValue(this.yOpenField);
                value = dataItem.getValue(this.yField);
                change = dataItem.getValue(this.yAxis.axisFieldName + "Y", "previousChange");
            }
            if (value < open_1) {
                dataItem.droppedFromOpen = true;
                sprite.setState(this._dropFromOpenState, 0);
            }
            else {
                dataItem.droppedFromOpen = false;
                sprite.setState(this._riseFromOpenState, 0);
            }
            if (change < 0) {
                dataItem.droppedFromPrevious = true;
                sprite.setState((this._dropFromPreviousState), 0);
            }
            else {
                dataItem.droppedFromPrevious = false;
                sprite.setState((this._riseFromPreviousState), 0);
            }
        }
        // Set accessibility
        if (!this.isInTransition()) {
            if (this.itemsFocusable()) {
                sprite.role = "menuitem";
                sprite.focusable = true;
            }
            else {
                sprite.role = "listitem";
                sprite.focusable = false;
            }
            // Set readerTitle on demand only (focus or hover)
            if (__WEBPACK_IMPORTED_MODULE_15__core_utils_Type__["hasValue"](this.itemReaderText) && this.itemReaderText != "") {
                if (sprite.focusable) {
                    sprite.events.once("focus", function (ev) {
                        sprite.readerTitle = _this.populateString(_this.itemReaderText, dataItem);
                    });
                    sprite.events.once("blur", function (ev) {
                        sprite.readerTitle = "";
                    });
                }
                if (sprite.hoverable) {
                    sprite.events.once("over", function (ev) {
                        sprite.readerTitle = _this.populateString(_this.itemReaderText, dataItem);
                    });
                    sprite.events.once("out", function (ev) {
                        sprite.readerTitle = "";
                    });
                }
            }
        }
    };
    Object.defineProperty(ColumnSeries.prototype, "columns", {
        /**
         * A list of column elements.
         *
         * @ignore Exclude from docs
         * @return {ListTemplate<this["_column"]>} Columns
         */
        get: function () {
            if (!this._columns) {
                this._columns = new __WEBPACK_IMPORTED_MODULE_3__core_utils_List__["e" /* ListTemplate */](this.createColumnTemplate());
            }
            return this._columns;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and returns a column element to use as a template.
     *
     * @return {this["_column"]} Column template
     */
    ColumnSeries.prototype.createColumnTemplate = function () {
        return new __WEBPACK_IMPORTED_MODULE_8__elements_Column__["a" /* Column */]();
    };
    Object.defineProperty(ColumnSeries.prototype, "clustered", {
        /**
         * @return {boolean} Clustered?
         */
        get: function () {
            return this.getPropertyValue("clustered");
        },
        /**
         * Cluster this series columns?
         *
         * Setting to `false` will make columns overlap with pther series.
         *
         * @default true
         * @param {boolean}  value  Clustered?
         */
        set: function (value) {
            this.setPropertyValue("clustered", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnSeries.prototype, "dropFromOpenState", {
        /**
         * A state to apply to a column when close value is lower than open value.
         *
         * Can be used to differentiate appearance based on value relations.
         *
         * NOTE: this will work only if at least one axis is [[ValueAxis]].
         *
         * @readonly You can modify state object, but can't overwrite it
         * @return {SpriteState} State
         */
        get: function () {
            if (!this._dropFromOpenState) {
                this._dropFromOpenState = this.states.create("dropFromOpenState");
            }
            return this._dropFromOpenState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnSeries.prototype, "dropFromPreviousState", {
        /**
         * A state to apply to a column when its value is lower value of a previous
         * column.
         *
         * Can be used to differentiate appearance based on value relations.
         *
         * @readonly You can modify state object, but can't overwrite it
         * @return {SpriteState} State
         */
        get: function () {
            if (!this._dropFromPreviousState) {
                this._dropFromPreviousState = this.states.create("dropFromPreviousState");
            }
            return this._dropFromPreviousState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnSeries.prototype, "riseFromOpenState", {
        /**
         * A state to apply to a column when close value is same or higher than open
         * value.
         *
         * Can be used to differentiate appearance based on value relations.
         *
         * NOTE: this will work only if at least one axis is [[ValueAxis]].
         *
         * @readonly You can modify state object, but can't overwrite it
         * @return {SpriteState} State
         */
        get: function () {
            if (!this._riseFromOpenState) {
                this._riseFromOpenState = this.states.create("riseFromOpenState");
            }
            return this._riseFromOpenState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnSeries.prototype, "riseFromPreviousState", {
        /**
         * A state to apply to a column when its value is same or higher than value
         * of a previous column.
         *
         * Can be used to differentiate appearance based on value relations.
         *
         * @readonly You can modify state object, but can't overwrite it
         * @return {SpriteState} State
         */
        get: function () {
            if (!this._riseFromPreviousState) {
                this._riseFromPreviousState = this.states.create("riseFromPreviousState");
            }
            return this._riseFromPreviousState;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates value of the related legend item.
     *
     * @ignore Exclude from docs
     * @param {ColumnSeriesDataItem}  dataItem  Data item
     */
    ColumnSeries.prototype.updateLegendValue = function (dataItem) {
        var _this = this;
        _super.prototype.updateLegendValue.call(this, dataItem);
        if (this.legendDataItem) {
            var marker = this.legendDataItem.marker;
            var fromOpenState_1;
            var fromPreviousState_1;
            if (dataItem) {
                if (dataItem.droppedFromOpen) {
                    fromOpenState_1 = this._dropFromOpenState;
                }
                else {
                    fromOpenState_1 = this._riseFromOpenState;
                }
                if (dataItem.droppedFromPrevious) {
                    fromPreviousState_1 = this._dropFromPreviousState;
                }
                else {
                    fromPreviousState_1 = this._riseFromPreviousState;
                }
            }
            __WEBPACK_IMPORTED_MODULE_13__core_utils_Iterator__["each"](marker.children.iterator(), function (child) {
                if (dataItem) {
                    child.setState(fromPreviousState_1);
                    child.setState(fromOpenState_1);
                }
                else {
                    // todo: think what to do here, maybe apply above states based on totals?
                    child.setState(_this._riseFromPreviousState);
                    child.setState(_this._riseFromOpenState);
                }
            });
        }
    };
    /**
     * Creates elements in related legend container, that mimics the look of this
     * Series.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Legend item container
     */
    ColumnSeries.prototype.createLegendMarker = function (marker) {
        var w = marker.pixelWidth;
        var h = marker.pixelHeight;
        marker.removeChildren();
        var column = marker.createChild(__WEBPACK_IMPORTED_MODULE_9__core_elements_RoundedRectangle__["a" /* RoundedRectangle */]);
        column.shouldClone = false;
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Object__["copyProperties"](this, column, __WEBPACK_IMPORTED_MODULE_1__core_Sprite__["b" /* visualProperties */]);
        column.copyFrom(this.columns.template);
        column.padding(0, 0, 0, 0); // if columns will have padding (which is often), legend marker will be very narrow
        column.width = w;
        column.height = h;
    };
    /**
     * Copies all properties from another instance of [[ColumnSeries]].
     *
     * @param {ColumnSeries}  source  Source series
     */
    ColumnSeries.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.columns.template.copyFrom(source.columns.template);
    };
    /**
    * returns bullet x location
    * @ignore
    */
    ColumnSeries.prototype.getBulletLocationX = function (bullet, field) {
        if (this.baseAxis == this.xAxis) {
            return (this._startLocation + this._endLocation) / 2;
        }
        else {
            return _super.prototype.getBulletLocationX.call(this, bullet, field);
        }
    };
    /**
    * returns bullet y location
    * @ignore
    */
    ColumnSeries.prototype.getBulletLocationY = function (bullet, field) {
        if (this.baseAxis == this.yAxis) {
            return (this._startLocation + this._endLocation) / 2;
        }
        else {
            return _super.prototype.getBulletLocationY.call(this, bullet, field);
        }
    };
    /**
     * @ignore Exclude from docs
     */
    ColumnSeries.prototype.fixVerticalCoordinate = function (coordinate) {
        var paddingBottom = this.columns.template.pixelPaddingBottom;
        var paddingTop = this.columns.template.pixelPaddingTop;
        var minY = -paddingTop;
        var maxY = this.yAxis.axisLength + paddingBottom;
        return __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["fitToRange"](coordinate, minY, maxY);
    };
    /**
     * @ignore Exclude from docs
     */
    ColumnSeries.prototype.fixHorizontalCoordinate = function (coordinate) {
        var paddingLeft = this.columns.template.pixelPaddingLeft;
        var paddingRight = this.columns.template.pixelPaddingRight;
        var minX = -paddingLeft;
        var maxX = this.xAxis.axisLength + paddingRight;
        return __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["fitToRange"](coordinate, minX, maxX);
    };
    return ColumnSeries;
}(__WEBPACK_IMPORTED_MODULE_0__XYSeries__["a" /* XYSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["b" /* registry */].registeredClasses["ColumnSeries"] = ColumnSeries;
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["b" /* registry */].registeredClasses["ColumnSeriesDataItem"] = ColumnSeriesDataItem;
//# sourceMappingURL=ColumnSeries.js.map

/***/ }),

/***/ 92:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return XYChartDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return XYChart; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SerialChart__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__axes_AxisRendererX__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__axes_AxisRendererY__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__axes_CategoryAxis__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__series_XYSeries__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__cursors_XYCursor__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_elements_ZoomOutButton__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__core_utils_Type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__core_utils_Utils__ = __webpack_require__(6);
/**
 * XY Chart module.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */















/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[XYChart]].
 *
 * @see {@link DataItem}
 */
var XYChartDataItem = /** @class */ (function (_super) {
    __extends(XYChartDataItem, _super);
    /**
     * Constructor
     */
    function XYChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "XYChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return XYChartDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__SerialChart__["b" /* SerialChartDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates an XY chart, and any derivative chart, like Serial, Date-based, etc.
 *
 * Basically this is a chart type, that is used to display any chart
 * information in a square plot area.
 *
 * The horizontal and vertical scale is determined by the type of Axis.
 *
 * The plot types are determined by type of Series.
 *
 * ```TypeScript
 * // Includes
 * import * as am4core from "@amcharts/amcharts4/core";
 * import * as am4charts from "@amcharts/amcharts4/charts";
 *
 * // Create chart
 * let chart = am4core.create("chartdiv", am4charts.XYChart);
 *
 * // Add Data
 * chart.data = [{
 * "country": "USA",
 * "visits": 3025
 * }, {
 * 	"country": "China",
 * 	"visits": 1882
 * }, {
 * 	"country": "Japan",
 * 	"visits": 1809
 * }];
 *
 * // Add category axis
 * let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 * categoryAxis.dataFields.category = "country";
 *
 * // Add value axis
 * let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 *
 * // Add series
 * let series = chart.series.push(new am4charts.ColumnSeries());
 * series.name = "Web Traffic";
 * series.dataFields.categoryX = "country";
 * series.dataFields.valueY = "visits";
 * ```
 * ```JavaScript
 * // Create chart
 * var chart = am4core.create("chartdiv", am4charts.XYChart);
 *
 * // The following would work as well:
 * // var chart = am4core.create("chartdiv", "XYChart");
 *
 * // Add Data
 * chart.data = [{
 * "country": "USA",
 * "visits": 3025
 * }, {
 * 	"country": "China",
 * 	"visits": 1882
 * }, {
 * 	"country": "Japan",
 * 	"visits": 1809
 * }];
 *
 * // Add category axis
 * var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 * categoryAxis.dataFields.category = "country";
 *
 * // Add value axis
 * var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
 *
 * // Add series
 * var series = chart.series.push(new am4charts.ColumnSeries());
 * series.name = "Web Traffic";
 * series.dataFields.categoryX = "country";
 * series.dataFields.valueY = "visits";
 * ```
 * ```JSON
 * var chart = am4core.createFromConfig({
 *
 * 	// Category axis
 * 	"xAxes": [{
 * 		"type": "CategoryAxis",
 * 		"dataFields": {
 * 			"category": "country"
 * 		}
 * 	}],
 *
 * 	// Value axis
 * 	"yAxes": [{
 * 		"type": "ValueAxis"
 * 	}],
 *
 * 	// Series
 * 	"series": [{
 * 		"type": "ColumnSeries",
 * 		"dataFields": {
 * 			"categoryX": "country",
 * 			"valueY": "visits"
 * 		},
 * 		"name": "Web Traffic"
 * 	}],
 *
 * 	// Cursor
 * 	"cursor": {},
 *
 * 	// Data
 * 	"data": [{
 * 		"country": "USA",
 * 		"visits": 3025
 * 	}, {
 * 		"country": "China",
 * 		"visits": 1882
 * 	}, {
 * 		"country": "Japan",
 * 		"visits": 1809
 * 	}]
 *
 * }, "chartdiv", "XYChart");
 * ```
 *
 *
 * @see {@link IXYChartEvents} for a list of available Events
 * @see {@link IXYChartAdapters} for a list of available Adapters
 * @important
 */
var XYChart = /** @class */ (function (_super) {
    __extends(XYChart, _super);
    /**
     * Constructor
     */
    function XYChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Defines the type of horizontal axis rederer.
         *
         * @type {typeof AxisRendererX}
         */
        _this._axisRendererX = __WEBPACK_IMPORTED_MODULE_3__axes_AxisRendererX__["a" /* AxisRendererX */];
        /**
         * Defines the type of vertical axis rederer.
         *
         * @type {typeof AxisRendererY}
         */
        _this._axisRendererY = __WEBPACK_IMPORTED_MODULE_4__axes_AxisRendererY__["a" /* AxisRendererY */];
        _this.className = "XYChart";
        // Set defaults
        //this.margin(10, 10, 10, 10);
        _this.maskBullets = true;
        // Create main chart container
        var chartCont = _this.chartContainer;
        chartCont.layout = "vertical";
        _this.padding(15, 15, 15, 15);
        // Create top axes container
        var topAxesCont = chartCont.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Container__["a" /* Container */]);
        topAxesCont.shouldClone = false;
        topAxesCont.layout = "vertical";
        topAxesCont.width = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        topAxesCont.zIndex = 1;
        _this.topAxesContainer = topAxesCont;
        // Create vertical axes and plot area container
        // Plot area and vertical axes share the whole width of the chart,
        // so we need to put then into a separate container so that layouting
        // engine takes care of the positioning
        var yAxesAndPlotCont = chartCont.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Container__["a" /* Container */]);
        yAxesAndPlotCont.shouldClone = false;
        yAxesAndPlotCont.layout = "horizontal";
        yAxesAndPlotCont.width = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        yAxesAndPlotCont.height = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        yAxesAndPlotCont.zIndex = 0;
        _this.yAxesAndPlotCont = yAxesAndPlotCont;
        // Create a container for bottom axes
        var bottomAxesCont = chartCont.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Container__["a" /* Container */]);
        bottomAxesCont.shouldClone = false;
        bottomAxesCont.width = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        bottomAxesCont.layout = "vertical";
        bottomAxesCont.zIndex = 1;
        _this.bottomAxesContainer = bottomAxesCont;
        // Create a container for left-side axes
        var leftAxesCont = yAxesAndPlotCont.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Container__["a" /* Container */]);
        leftAxesCont.shouldClone = false;
        leftAxesCont.layout = "horizontal";
        leftAxesCont.height = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        leftAxesCont.contentAlign = "right";
        leftAxesCont.events.on("transformed", _this.updateXAxesMargins, _this);
        _this.leftAxesContainer = leftAxesCont;
        // Create a container for plot area
        var plotCont = yAxesAndPlotCont.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Container__["a" /* Container */]);
        plotCont.shouldClone = false;
        plotCont.height = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        plotCont.width = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        _this.plotContainer = plotCont;
        _this._cursorContainer = plotCont;
        // Create a container for right-side axes
        var rightAxesCont = yAxesAndPlotCont.createChild(__WEBPACK_IMPORTED_MODULE_1__core_Container__["a" /* Container */]);
        rightAxesCont.shouldClone = false;
        rightAxesCont.layout = "horizontal";
        rightAxesCont.height = Object(__WEBPACK_IMPORTED_MODULE_9__core_utils_Percent__["c" /* percent */])(100);
        rightAxesCont.events.on("transformed", _this.updateXAxesMargins, _this);
        _this.rightAxesContainer = rightAxesCont;
        _this.seriesContainer.parent = plotCont;
        _this.bulletsContainer.parent = plotCont;
        var zoomOutButton = plotCont.createChild(__WEBPACK_IMPORTED_MODULE_8__core_elements_ZoomOutButton__["a" /* ZoomOutButton */]);
        zoomOutButton.shouldClone = false;
        zoomOutButton.align = "right";
        zoomOutButton.valign = "top";
        zoomOutButton.zIndex = Number.MAX_SAFE_INTEGER;
        zoomOutButton.marginTop = 5;
        zoomOutButton.marginRight = 5;
        zoomOutButton.hide(0);
        _this.zoomOutButton = zoomOutButton;
        _this._bulletMask = _this.plotContainer;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    XYChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](this.readerTitle)) {
            this.readerTitle = this.language.translate("X/Y chart");
        }
    };
    /**
     * Draws the chart.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.seriesContainer.toFront();
        this.bulletsContainer.toFront();
        if (this.maskBullets) {
            this.bulletsContainer.mask = this._bulletMask;
        }
    };
    /**
     * Triggers a redrawing of all chart's series.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.updatePlotElements = function () {
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            series.invalidate();
        });
    };
    /**
     * Triggers data (re)validation which in turn can cause a redraw of the
     * whole chart or just aprticular series / elements.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.validateData = function () {
        // tell axes that data changed
        if (this._parseDataFrom == 0) {
            __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.xAxes.iterator(), function (axis) {
                axis.dataChangeUpdate();
            });
            __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.yAxes.iterator(), function (axis) {
                axis.dataChangeUpdate();
            });
        }
        _super.prototype.validateData.call(this);
        if (this.cursor) {
            if (this.data.length > 0) {
                this.cursor.__disabled = false;
            }
        }
        // reset minimums
        this.leftAxesContainer.minWidth = undefined;
        this.rightAxesContainer.minWidth = undefined;
    };
    /**
     * Updates margins for horizontal axes based on settings and available space.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.updateXAxesMargins = function () {
        var leftAxesWidth = this.leftAxesContainer.pixelWidth;
        var rightAxesWidth = this.rightAxesContainer.pixelWidth;
        var bottomAxesCont = this.bottomAxesContainer;
        if (bottomAxesCont.paddingLeft != leftAxesWidth || bottomAxesCont.paddingRight != rightAxesWidth) {
            bottomAxesCont.paddingLeft = leftAxesWidth;
            bottomAxesCont.paddingRight = rightAxesWidth;
        }
        var topAxesCont = this.topAxesContainer;
        if (topAxesCont.paddingLeft != leftAxesWidth || topAxesCont.paddingRight != rightAxesWidth) {
            topAxesCont.paddingLeft = leftAxesWidth;
            topAxesCont.paddingRight = rightAxesWidth;
        }
    };
    /**
     * Triggers an update on the horizontal axis when one of its properties
     * change.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Axis, ISpriteEvents>["propertychanged"]} event An event object
     */
    XYChart.prototype.handleXAxisChange = function (event) {
        this.updateXAxis(event.target);
    };
    /**
     * Triggers an update on the vertical axis when one of its properties
     * change.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Axis, ISpriteEvents>["propertychanged"]} event An event object
     */
    XYChart.prototype.handleYAxisChange = function (event) {
        this.updateYAxis(event.target);
    };
    /**
     * Sets up a new horizontal (X) axis when it is added to the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Axis>["insert"]}  event  Axis insert event
     */
    XYChart.prototype.processXAxis = function (event) {
        var axis = event.newValue;
        axis.chart = this;
        axis.renderer = new this._axisRendererX(axis);
        axis.axisLetter = "X";
        axis.renderer.observe(["opposite", "inside", "inversed", "minGridDistance"], this.handleXAxisChange, this);
        axis.events.on("datarangechanged", this.handleXAxisRangeChange, this);
        // Although axis does not use data directly, we set dataProvider here
        // (but not add to chart data users) to hold up rendering before data
        // is parsed (system handles this)
        axis.dataProvider = this;
        this.updateXAxis(axis.renderer);
        this.processAxis(axis);
    };
    /**
     * Removes events from the Axis when it is removed from the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Axis>["remove"]}  event  Event
     */
    XYChart.prototype.processXAxisRemoval = function (event) {
        var axis = event.oldValue;
        axis.events.off("datarangechanged", this.handleXAxisRangeChange, this);
    };
    /**
     * Sets up a new vertical (Y) axis when it is added to the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Axis>["insert"]} event Axis insert event
     */
    XYChart.prototype.processYAxis = function (event) {
        var axis = event.newValue;
        axis.chart = this;
        axis.renderer = new this._axisRendererY(axis);
        axis.axisLetter = "Y";
        axis.renderer.observe(["opposite", "inside", "inversed", "minGridDistance"], this.handleYAxisChange, this);
        axis.events.on("datarangechanged", this.handleYAxisRangeChange, this);
        // Although axis does not use data directly, we set dataProvider here
        // (but not add to chart data users) to hold up rendering before data
        // is parsed (system handles this)
        axis.dataProvider = this;
        this.updateYAxis(axis.renderer);
        this.processAxis(axis);
    };
    /**
     * Removes events from the Axis when it is removed from the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Axis>["remove"]}  event  Event
     */
    XYChart.prototype.processYAxisRemoval = function (event) {
        var axis = event.oldValue;
        axis.events.off("datarangechanged", this.handleYAxisRangeChange, this);
    };
    /**
     * Updates horizontal (X) scrollbar and other horizontal axis whenever axis'
     * value range changes.
     *
     * @param {AMEvent<Axis, IComponentEvents>["datarangechanged"]} event Range change event
     */
    XYChart.prototype.handleXAxisRangeChange = function (event) {
        var range = this.getCommonAxisRange(this.xAxes);
        if (this.scrollbarX) {
            this.zoomAxes(this.xAxes, range, true);
        }
        this.toggleZoomOutButton();
        this.updateScrollbar(this.scrollbarX, range);
    };
    /**
     * Shows or hides the Zoom Out button depending on whether the chart is fully
     * zoomed out or not.
     */
    XYChart.prototype.toggleZoomOutButton = function () {
        if (this.zoomOutButton) {
            var show_1 = false;
            __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["eachContinue"](this.xAxes.iterator(), function (axis) {
                if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["round"](axis.start, 3) != 0 || __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["round"](axis.end, 3) != 1) {
                    show_1 = true;
                    return false;
                }
                return true;
            });
            __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["eachContinue"](this.yAxes.iterator(), function (axis) {
                if (__WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["round"](axis.start, 3) != 0 || __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["round"](axis.end, 3) != 1) {
                    show_1 = true;
                    return false;
                }
                return true;
            });
            if (!this.seriesAppeared) {
                show_1 = false;
            }
            if (show_1) {
                this.zoomOutButton.show();
            }
            else {
                this.zoomOutButton.hide();
            }
        }
    };
    /**
     * @ignore
     * moved this check to a separate method so that we could override it in TreeMapSeries
     */
    XYChart.prototype.seriesAppeared = function () {
        var appeared = false;
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            if (!series.appeared) {
                appeared = false;
                return false;
            }
        });
        return appeared;
    };
    /**
     * Updates vertical (Y) scrollbar and other horizontal axis whenever axis'
     * value range changes.
     *
     * @param {AMEvent<Axis, IComponentEvents>["datarangechanged"]} event Range change event
     */
    XYChart.prototype.handleYAxisRangeChange = function (event) {
        var range = this.getCommonAxisRange(this.yAxes);
        if (this.scrollbarY) {
            this.zoomAxes(this.yAxes, range, true);
        }
        this.toggleZoomOutButton();
        this.updateScrollbar(this.scrollbarY, range);
    };
    /**
     * Updates a relative scrollbar whenever data range of the axis changes.
     *
     * @param {Scrollbar}  scrollbar  Scrollbar instance
     * @param {IRange}     range      New data (values) range of the axis
     */
    XYChart.prototype.updateScrollbar = function (scrollbar, range) {
        if (scrollbar) {
            scrollbar.skipRangeEvents();
            scrollbar.start = range.start;
            scrollbar.end = range.end;
        }
    };
    /**
     * Returns a common range of values between a list of axes.
     *
     * This is used to synchronize the zoom between multiple axes.
     *
     * @ignore Exclude from docs
     * @param  {List<Axis>}  axes  A list of axes
     * @return {IRange}            Common value range
     */
    XYChart.prototype.getCommonAxisRange = function (axes) {
        var start;
        var end;
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](axes.iterator(), function (axis) {
            var axisStart = axis.start;
            var axisEnd = axis.end;
            if (axis.renderer.inversed) {
                axisStart = 1 - axis.end;
                axisEnd = 1 - axis.start;
            }
            if (!__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNumber"](start) || (axisStart < start)) {
                start = axisStart;
            }
            if (!__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNumber"](end) || (axisEnd > end)) {
                end = axisEnd;
            }
        });
        return { start: start, end: end };
    };
    /**
     * Triggers (re)rendering of the horizontal (X) axis.
     *
     * @ignore Exclude from docs
     * @param {Axis}  axis  Axis
     */
    XYChart.prototype.updateXAxis = function (renderer) {
        var axis = renderer.axis;
        if (renderer.opposite) {
            axis.parent = this.topAxesContainer;
            axis.toFront();
        }
        else {
            axis.parent = this.bottomAxesContainer;
            axis.toBack();
        }
        axis.initRenderer();
    };
    /**
     * Triggers (re)rendering of the vertical (Y) axis.
     *
     * @ignore Exclude from docs
     * @param {Axis}  axis  Axis
     */
    XYChart.prototype.updateYAxis = function (renderer) {
        var axis = renderer.axis;
        if (renderer.opposite) {
            axis.parent = this.rightAxesContainer;
            axis.toBack();
        }
        else {
            axis.parent = this.leftAxesContainer;
            axis.toFront();
        }
        axis.initRenderer();
    };
    /**
     * Decorates an Axis for use with this chart, e.g. sets proper renderer
     * and containers for placement.
     *
     * @param {Axis}  axis  Axis
     */
    XYChart.prototype.processAxis = function (axis) {
        // Value axis does not use data directly, only category axis does
        if (axis instanceof __WEBPACK_IMPORTED_MODULE_5__axes_CategoryAxis__["a" /* CategoryAxis */]) {
            this._dataUsers.moveValue(axis);
        }
        var renderer = axis.renderer;
        renderer.gridContainer.parent = this.plotContainer;
        renderer.gridContainer.toBack();
        renderer.breakContainer.parent = this.plotContainer;
        renderer.breakContainer.toFront();
        renderer.breakContainer.zIndex = 1;
    };
    Object.defineProperty(XYChart.prototype, "xAxes", {
        /**
         * A list of horizontal (X) axes.
         *
         * @return {List<Axis>} List of axes
         */
        get: function () {
            if (!this._xAxes) {
                //let template = new Axis();
                //template.renderer = new this._axisRendererX(template);
                this._xAxes = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["b" /* List */]();
                this._xAxes.events.on("insert", this.processXAxis, this);
                this._xAxes.events.on("remove", this.processXAxisRemoval, this);
            }
            return this._xAxes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChart.prototype, "yAxes", {
        /**
         * A list of vertical (Y) axes.
         *
         * @return {List<Axis>} List of axes
         */
        get: function () {
            if (!this._yAxes) {
                //let template = new Axis();
                //template.renderer = new this._axisRendererY(template);
                this._yAxes = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["b" /* List */]();
                this._yAxes.events.on("insert", this.processYAxis, this);
                this._yAxes.events.on("remove", this.processYAxisRemoval, this);
            }
            return this._yAxes;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorates a new [[XYSeries]] object with required parameters when it is
     * added to the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<XYSeries>["insert"]}  event  Event
     */
    XYChart.prototype.processSeries = function (event) {
        try {
            _super.prototype.processSeries.call(this, event);
            var series = event.newValue;
            series.xAxis; // this is enough to get axis, handled in getter
            series.yAxis; // this is enough to get axis, handled in getter
            if (series.fill == undefined) {
                series.fill = this.colors.next();
            }
            if (series.stroke == undefined) {
                series.stroke = series.fill;
            }
        }
        catch (e) {
            this.raiseCriticalError(e);
        }
    };
    Object.defineProperty(XYChart.prototype, "cursor", {
        /**
         * @return {XYCursor} Cursor
         */
        get: function () {
            return this._cursor;
        },
        /**
         * Chart's [[Cursor]].
         *
         * @param {XYCursor}  cursor  Cursor
         */
        set: function (cursor) {
            if (this._cursor != cursor) {
                if (this._cursor) {
                    this.removeDispose(this._cursor);
                }
                this._cursor = cursor;
                if (cursor) {
                    this._disposers.push(cursor);
                    cursor.chart = this;
                    cursor.parent = this._cursorContainer;
                    cursor.events.on("cursorpositionchanged", this.handleCursorPositionChange, this);
                    cursor.events.on("zoomstarted", this.handleCursorZoomStart, this);
                    cursor.events.on("zoomended", this.handleCursorZoomEnd, this);
                    cursor.events.on("panstarted", this.handleCursorPanStart, this);
                    cursor.events.on("panning", this.handleCursorPanning, this);
                    cursor.events.on("panended", this.handleCursorPanEnd, this);
                    cursor.events.on("hidden", this.handleHideCursor, this);
                    cursor.zIndex = Number.MAX_SAFE_INTEGER;
                    if (this.data.length == 0) {
                        cursor.__disabled = true;
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and returns a new [[Cursor]] suitable for this chart type.
     *
     * @return {this} New cursor
     */
    XYChart.prototype.createCursor = function () {
        return new __WEBPACK_IMPORTED_MODULE_7__cursors_XYCursor__["a" /* XYCursor */]();
    };
    /**
     * Performs tasks when the cursor's position changes, e.g. shows proper
     * tooltips on axes and series.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.handleCursorPositionChange = function () {
        if (this.cursor.visible && !this.cursor.isHiding) {
            var xPosition = this.cursor.xPosition;
            var yPosition = this.cursor.yPosition;
            this.showAxisTooltip(this.xAxes, xPosition);
            this.showAxisTooltip(this.yAxes, yPosition);
            this.showSeriesTooltip({
                x: xPosition,
                y: yPosition
            });
        }
    };
    /**
     * Hides all cursor-related tooltips when the cursor itself is hidden.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.handleHideCursor = function () {
        this.hideObjectTooltip(this.xAxes);
        this.hideObjectTooltip(this.yAxes);
        this.hideObjectTooltip(this.series);
        this.updateSeriesLegend();
    };
    /**
     * Updates values for each series' legend item.
     *
     * @ignore Exclude from docs
     */
    XYChart.prototype.updateSeriesLegend = function () {
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            series.updateLegendValue();
        });
    };
    /**
     * Hides a tooltip for a list of objects.
     *
     * @ignore Exclude from docs
     * @param {List<Sprite>}  sprites  A list of sprites to hide tooltip for
     */
    XYChart.prototype.hideObjectTooltip = function (sprites) {
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](sprites.iterator(), function (sprite) {
            sprite.tooltip.hide(0);
        });
    };
    /**
     * Shows a tooltip for all chart's series, using specific coordinates as a
     * reference point.
     *
     * The tooltip might be shown at different coordinates depending on the
     * actual data point's position, overlapping with other tooltips, etc.
     *
     * @ignore Exclude from docs
     * @param {IPoint}  position  Reference point
     */
    XYChart.prototype.showSeriesTooltip = function (position) {
        var _this = this;
        var topLeft = __WEBPACK_IMPORTED_MODULE_14__core_utils_Utils__["spritePointToSvg"]({ x: 0, y: 0 }, this.plotContainer);
        var bottomRight = __WEBPACK_IMPORTED_MODULE_14__core_utils_Utils__["spritePointToSvg"]({ x: this.plotContainer.pixelWidth, y: this.plotContainer.pixelHeight }, this.plotContainer);
        var seriesPoints = [];
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            if (series.tooltipText || series.tooltipHTML) {
                series.tooltip.setBounds({ x: 0, y: 0, width: _this.pixelWidth, height: _this.pixelHeight });
                var point = series.showTooltipAtPosition(position.x, position.y);
                if (point && __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["isInRectangle"](point, { x: topLeft.x, y: topLeft.y, width: bottomRight.x - topLeft.x, height: bottomRight.y - topLeft.y })) {
                    seriesPoints.push({ point: point, series: series });
                }
                else {
                    series.tooltip.hide(0);
                }
            }
        });
        seriesPoints.sort(function (a, b) {
            if (a.point.y > b.point.y) {
                return 1;
            }
            else {
                return 0;
            }
        });
        if (seriesPoints.length > 0) {
            var top_1 = topLeft.y;
            var bottom = bottomRight.y;
            var topSeriesPoints = [];
            var botSeriesPoints = [];
            for (var i = 0; i < seriesPoints.length; i++) {
                if (seriesPoints[i].point.y < top_1 + (bottom - top_1) / 2) {
                    topSeriesPoints.push(seriesPoints[i]);
                }
                else {
                    botSeriesPoints.push(seriesPoints[i]);
                }
            }
            var nextY = top_1;
            //@todo: solve overlapping when tooltips are close to center
            for (var i = 0; i < topSeriesPoints.length; i++) {
                var series = topSeriesPoints[i].series;
                var pointY = topSeriesPoints[i].point.y;
                var tooltip = series.tooltip;
                tooltip.setBounds({ x: 0, y: nextY, width: this.pixelWidth, height: bottom });
                if (tooltip.invalid) {
                    tooltip.validate();
                }
                tooltip.toBack();
                //@labeltodo
                nextY = __WEBPACK_IMPORTED_MODULE_14__core_utils_Utils__["spritePointToSvg"]({ x: 0, y: tooltip.label.pixelY + tooltip.label.pixelHeight - tooltip.pixelY + pointY + tooltip.pixelMarginBottom }, tooltip).y;
            }
            var nextHeight = bottom;
            for (var i = botSeriesPoints.length - 1; i >= 0; i--) {
                var series = botSeriesPoints[i].series;
                var tooltip = series.tooltip;
                var pointY = botSeriesPoints[i].point.y;
                tooltip.setBounds({ x: 0, y: 0, width: this.pixelWidth, height: nextHeight });
                if (tooltip.invalid) {
                    tooltip.validate();
                }
                tooltip.toBack();
                //@labeltodo
                nextHeight = __WEBPACK_IMPORTED_MODULE_14__core_utils_Utils__["spritePointToSvg"]({ x: 0, y: tooltip.label.pixelY - tooltip.pixelY + pointY - tooltip.pixelMarginTop }, tooltip).y;
            }
        }
    };
    /**
     * Shows tooltips for a list of axes at specific position.
     *
     * Position might be X coordinate for horizontal axes, and Y coordinate for
     * vertical axes.
     *
     * @ignore Exclude from docs
     * @param {List<Axis>}  axes      List of axes to show tooltip on
     * @param {number}      position  Position (px)
     */
    XYChart.prototype.showAxisTooltip = function (axes, position) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](axes.iterator(), function (axis) {
            var axisPosition = axis.toAxisPosition(position);
            if (_this.dataItems.length > 0) {
                axis.showTooltipAtPosition(axisPosition);
            }
        });
    };
    /**
     * Recalculates the value range for the axis.
     *
     * @param  {Axis}    axis   Axis
     * @param  {IRange}  range  Range
     * @return {IRange}         Modified range
     */
    XYChart.prototype.getUpdatedRange = function (axis, range) {
        var start;
        var end;
        var inversed = axis.renderer.inversed;
        if (axis.renderer instanceof __WEBPACK_IMPORTED_MODULE_4__axes_AxisRendererY__["a" /* AxisRendererY */]) {
            range = __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["invertRange"](range);
        }
        if (inversed) {
            __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["invertRange"](range);
            start = 1 - axis.end;
            end = 1 - axis.start;
        }
        else {
            start = axis.start;
            end = axis.end;
        }
        var difference = end - start;
        return {
            start: start + range.start * difference,
            end: start + range.end * difference
        };
    };
    /**
     * Performs zoom and other operations when user finishes zooming using chart
     * cursor, e.g. zooms axes.
     *
     * @param {IXYCursorEvents["zoomended"]} event Cursor's event
     */
    XYChart.prototype.handleCursorZoomEnd = function (event) {
        var cursor = this.cursor;
        var behavior = cursor.behavior;
        if (behavior == "zoomX" || behavior == "zoomXY") {
            var xRange = cursor.xRange;
            xRange = this.getUpdatedRange(this.xAxes.getIndex(0), xRange);
            xRange.priority = "start";
            this.zoomAxes(this.xAxes, xRange);
        }
        if (behavior == "zoomY" || behavior == "zoomXY") {
            var yRange = cursor.yRange;
            yRange = this.getUpdatedRange(this.yAxes.getIndex(0), yRange);
            yRange.priority = "start";
            this.zoomAxes(this.yAxes, yRange);
        }
        this.handleHideCursor();
    };
    /**
     * Performs zoom and other operations when user is panning chart plot using chart cursor.
     *
     * @param {IXYCursorEvents["panning"]} event Cursor's event
     */
    XYChart.prototype.handleCursorPanStart = function (event) {
        var xAxis = this.xAxes.getIndex(0);
        if (xAxis) {
            this._panStartXRange = { start: xAxis.start, end: xAxis.end };
        }
        var yAxis = this.yAxes.getIndex(0);
        if (yAxis) {
            this._panStartYRange = { start: yAxis.start, end: yAxis.end };
        }
    };
    /**
     * Performs zoom and other operations when user ends panning
     *
     * @param {IXYCursorEvents["panning"]} event Cursor's event
     */
    XYChart.prototype.handleCursorPanEnd = function (event) {
        var cursor = this.cursor;
        var behavior = cursor.behavior;
        if (this._panEndXRange && (behavior == "panX" || behavior == "panXY")) {
            var panEndRange = this._panEndXRange;
            var delta = 0;
            if (panEndRange.start < 0) {
                delta = panEndRange.start;
            }
            if (panEndRange.end > 1) {
                delta = panEndRange.end - 1;
            }
            this.zoomAxes(this.xAxes, { start: panEndRange.start - delta, end: panEndRange.end - delta });
            this._panEndXRange = undefined;
            this._panStartXRange = undefined;
        }
        if (this._panEndYRange && (behavior == "panY" || behavior == "panXY")) {
            var panEndRange = this._panEndYRange;
            var delta = 0;
            if (panEndRange.start < 0) {
                delta = panEndRange.start;
            }
            if (panEndRange.end > 1) {
                delta = panEndRange.end - 1;
            }
            this.zoomAxes(this.yAxes, { start: panEndRange.start - delta, end: panEndRange.end - delta });
            this._panEndYRange = undefined;
            this._panStartYRange = undefined;
        }
    };
    /**
     * Performs zoom and other operations when user is panning chart plot using chart cursor.
     *
     * @param {IXYCursorEvents["panning"]} event Cursor's event
     */
    XYChart.prototype.handleCursorPanning = function (event) {
        var cursor = this.cursor;
        var behavior = cursor.behavior;
        var maxPanOut = cursor.maxPanOut;
        if (this._panStartXRange && (behavior == "panX" || behavior == "panXY")) {
            var panStartRange = this._panStartXRange;
            var range = cursor.xRange;
            var difference = panStartRange.end - panStartRange.start;
            var delta = range.start;
            var newStart = Math.max(-maxPanOut, delta + panStartRange.start);
            var newEnd = Math.min(range.start + panStartRange.end, 1 + maxPanOut);
            if (newStart <= 0) {
                newEnd = newStart + difference;
            }
            if (newEnd >= 1) {
                newStart = newEnd - difference;
            }
            var newRange = {
                start: newStart,
                end: newEnd
            };
            this._panEndXRange = newRange;
            this.zoomAxes(this.xAxes, newRange);
        }
        if (this._panStartYRange && (behavior == "panY" || behavior == "panXY")) {
            var panStartRange = this._panStartYRange;
            var range = cursor.yRange;
            var difference = panStartRange.end - panStartRange.start;
            var delta = range.start;
            var newStart = Math.max(-maxPanOut, delta + panStartRange.start);
            var newEnd = Math.min(range.start + panStartRange.end, 1 + maxPanOut);
            if (newStart <= 0) {
                newEnd = newStart + difference;
            }
            if (newEnd >= 1) {
                newStart = newEnd - difference;
            }
            var newRange = {
                start: newStart,
                end: newEnd
            };
            this._panEndYRange = newRange;
            this.zoomAxes(this.yAxes, newRange);
        }
        this.handleHideCursor();
    };
    /**
     * Performs zoom and other operations when user starts zooming using chart
     * cursor, e.g. zooms axes.
     *
     * @param {IXYCursorEvents["zoomended"]} event Cursor's event
     */
    XYChart.prototype.handleCursorZoomStart = function (event) {
        // Nothing here
        // This method is here only as a "placeholder" for extending classes to
        // override if necessary
    };
    Object.defineProperty(XYChart.prototype, "scrollbarX", {
        /**
         * @return {Scrollbar} Scrollbar
         */
        get: function () {
            return this._scrollbarX;
        },
        /**
         * Horizontal (X) scrollbar.
         *
         * @param {Scrollbar} scrollbar Scrollbar
         */
        set: function (scrollbar) {
            var _this = this;
            if (this._scrollbarX) {
                this.removeDispose(this._scrollbarX);
            }
            this._scrollbarX = scrollbar;
            if (scrollbar) {
                this._disposers.push(scrollbar);
                scrollbar.parent = this.topAxesContainer;
                scrollbar.toBack();
                scrollbar.orientation = "horizontal";
                scrollbar.events.on("rangechanged", this.handleXScrollbarChange, this);
                // accessibility related
                scrollbar.adapter.add("positionValue", function (arg) {
                    var xAxis = _this.xAxes.getIndex(0);
                    if (xAxis) {
                        arg.value = xAxis.getPositionLabel(arg.position);
                    }
                    return arg;
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XYChart.prototype, "scrollbarY", {
        /**
         * @return {Scrollbar} Scrollbar
         */
        get: function () {
            return this._scrollbarY;
        },
        /**
         * Vertical (Y) scrollbar.
         *
         * @param {Scrollbar} scrollbar Scrollbar
         */
        set: function (scrollbar) {
            var _this = this;
            if (this._scrollbarY) {
                this.removeDispose(this._scrollbarY);
            }
            this._scrollbarY = scrollbar;
            if (scrollbar) {
                this._disposers.push(scrollbar);
                scrollbar.parent = this.rightAxesContainer;
                scrollbar.toFront();
                scrollbar.orientation = "vertical";
                scrollbar.events.on("rangechanged", this.handleYScrollbarChange, this);
                // accessibility related
                scrollbar.adapter.add("positionValue", function (arg) {
                    var yAxis = _this.yAxes.getIndex(0);
                    if (yAxis) {
                        arg.value = yAxis.getPositionLabel(arg.position);
                    }
                    return arg;
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Zooms axes affected by the horizontal (X) scrollbar when the selection
     * on it changes.
     *
     * @param {AMEvent<Scrollbar, IScrollbarEvents>["rangechanged"]} event Scrollbar range change event
     */
    XYChart.prototype.handleXScrollbarChange = function (event) {
        var scrollbar = event.target;
        var range = this.zoomAxes(this.xAxes, scrollbar.range);
        scrollbar.fixRange(range);
    };
    /**
     * Zooms axes affected by the vertical (Y) scrollbar when the selection
     * on it changes.
     *
     * @param {AMEvent<Scrollbar, IScrollbarEvents>["rangechanged"]} event Scrollbar range change event
     */
    XYChart.prototype.handleYScrollbarChange = function (event) {
        var scrollbar = event.target;
        var range = this.zoomAxes(this.yAxes, scrollbar.range);
        scrollbar.fixRange(range);
    };
    /**
     * Zooms axes that are affected by to specific relative range.
     *
     * @param  {List<Axis>}  axes       List of axes to zoom
     * @param  {IRange}      range      Range of values to zoom to (0-1)
     * @param  {boolean}     instantly  If set to `true` will skip zooming animation
     * @return {IRange}                 Recalculated range that is common to all involved axes
     */
    XYChart.prototype.zoomAxes = function (axes, range, instantly) {
        var realRange = { start: 0, end: 1 };
        if (!this.dataInvalid) {
            __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](axes.iterator(), function (axis) {
                if (axis.renderer.inversed) {
                    range = __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["invertRange"](range);
                }
                var axisRange = axis.zoom(range, instantly, instantly);
                if (axis.renderer.inversed) {
                    axisRange = __WEBPACK_IMPORTED_MODULE_11__core_utils_Math__["invertRange"](axisRange);
                }
                realRange = axisRange;
            });
        }
        return realRange;
    };
    Object.defineProperty(XYChart.prototype, "maskBullets", {
        /**
         * @return {boolean} Mask bullet container?
         */
        get: function () {
            return this.getPropertyValue("maskBullets");
        },
        /**
         * Indicates if bullet container is masked.
         *
         * If it is set to `true`, any bullets that do not fit into bullet container
         * will be clipped off. Settting to `false` will allow bullets to "spill out"
         * of the plot area so they are not cut off.
         *
         * @param {boolean} value Mask bullet container?
         */
        set: function (value) {
            this.setPropertyValue("maskBullets", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This function is called by the [[DataSource]]'s `dateFields` adapater
     * so that particular chart types can popuplate this setting with their
     * own type-speicifc data fields so they are parsed properly.
     *
     * @param  {string[]}  fields  Array of date fields
     * @return {string[]}          Array of date fields populated with chart's date fields
     */
    XYChart.prototype.dataSourceDateFields = function (fields) {
        var _this = this;
        // Process parent
        fields = _super.prototype.dataSourceDateFields.call(this, fields);
        // Check if we have any series with date-fields
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            fields = _this.populateDataSourceFields(fields, series.dataFields, ["dateX", "dateY", "openDateX", "openDateY"]);
        });
        return fields;
    };
    /**
     * This function is called by the [[DataSource]]'s `numberFields` adapater
     * so that particular chart types can popuplate this setting with their
     * own type-speicifc data fields so they are parsed properly.
     *
     * @param  {string[]}  value  Array of number fields
     * @return {string[]}         Array of number fields populated with chart's number fields
     */
    XYChart.prototype.dataSourceNumberFields = function (fields) {
        var _this = this;
        fields = _super.prototype.dataSourceDateFields.call(this, fields);
        // Check if we have any series with date-fields
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            fields = _this.populateDataSourceFields(fields, series.dataFields, ["valueX", "valueY", "openValueX", "openValueY"]);
        });
        return fields;
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    XYChart.prototype.processConfig = function (config) {
        if (config) {
            // Set up axes
            if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.xAxes) && __WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isArray"](config.xAxes)) {
                for (var i = 0, len = config.xAxes.length; i < len; i++) {
                    if (!config.xAxes[i].type) {
                        throw Error("No type set for xAxes[" + i + "].");
                    }
                    //config.xAxes[i].type = config.xAxes[i].type || "ValueAxis";
                }
            }
            if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.yAxes) && __WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isArray"](config.yAxes)) {
                for (var i = 0, len = config.yAxes.length; i < len; i++) {
                    if (!config.yAxes[i].type) {
                        throw Error("No type set for yAxes[" + i + "].");
                    }
                    //config.yAxes[i].type = config.yAxes[i].type || "ValueAxis";
                }
            }
            // Set up series
            if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.series) && __WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isArray"](config.series)) {
                for (var i = 0, len = config.series.length; i < len; i++) {
                    config.series[i].type = config.series[i].type || "LineSeries";
                }
            }
            // Set up cursor
            if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.cursor) && !__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.cursor.type)) {
                config.cursor.type = "XYCursor";
            }
            // Set up scrollbars
            if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.scrollbarX) && !__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.scrollbarX.type)) {
                config.scrollbarX.type = "Scrollbar";
            }
            if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.scrollbarY) && !__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.scrollbarY.type)) {
                config.scrollbarY.type = "Scrollbar";
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    /**
     * This function is used to sort element's JSON config properties, so that
     * some properties that absolutely need to be processed last, can be put at
     * the end.
     *
     * @ignore Exclude from docs
     * @param  {string}  a  Element 1
     * @param  {string}  b  Element 2
     * @return {Ordering}   Sorting number
     */
    XYChart.prototype.configOrder = function (a, b) {
        if (a == b) {
            return 0;
        }
        // Must come last
        else if (a == "scrollbarX") {
            return 1;
        }
        else if (b == "scrollbarX") {
            return -1;
        }
        else if (a == "scrollbarY") {
            return 1;
        }
        else if (b == "scrollbarY") {
            return -1;
        }
        else if (a == "series") {
            return 1;
        }
        else if (b == "series") {
            return -1;
        }
        else {
            return _super.prototype.configOrder.call(this, a, b);
        }
    };
    /**
     * Creates a new Series of type suitable for this chart.
     *
     * @return {this} New series
     */
    XYChart.prototype.createSeries = function () {
        return new __WEBPACK_IMPORTED_MODULE_6__series_XYSeries__["a" /* XYSeries */]();
    };
    Object.defineProperty(XYChart.prototype, "zoomOutButton", {
        /**
         * @return {Button} Zoom out button
         */
        get: function () {
            return this._zoomOutButton;
        },
        /**
         * A [[Button]] element that is used for zooming out the chart.
         *
         * This button appears only when chart is zoomed in, and disappears
         * autoamatically when it is zoome dout.
         *
         * @param {Button}  button  Zoom out button
         */
        set: function (button) {
            var _this = this;
            this._zoomOutButton = button;
            if (button) {
                button.events.on("hit", function () {
                    _this.zoomAxes(_this.xAxes, { start: 0, end: 1 });
                    _this.zoomAxes(_this.yAxes, { start: 0, end: 1 });
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all parameters from another [[XYChart]].
     *
     * @param {XYChart} source Source XYChart
     */
    XYChart.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.xAxes.copyFrom(source.xAxes);
        this.yAxes.copyFrom(source.yAxes);
        this.zoomOutButton.copyFrom(source.zoomOutButton);
        //@todo copy all container properties
    };
    return XYChart;
}(__WEBPACK_IMPORTED_MODULE_0__SerialChart__["a" /* SerialChart */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_10__core_Registry__["b" /* registry */].registeredClasses["XYChart"] = XYChart;
//# sourceMappingURL=XYChart.js.map

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CategoryAxisDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoryAxis; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Axis__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Dictionary__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__CategoryAxisBreak__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__ = __webpack_require__(4);
/**
 * Category axis module
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */







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
    __extends(CategoryAxisDataItem, _super);
    /**
     * Constructor
     */
    function CategoryAxisDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "CategoryAxisDataItem";
        _this.text = "{category}";
        _this.locations.category = 0;
        _this.locations.startCategory = 0;
        _this.locations.endCategory = 1;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(CategoryAxisDataItem.prototype, "category", {
        /**
         * Returns category.
         *
         * @return {string} Category
         */
        get: function () {
            return this.properties["category"];
        },
        /**
         * Sets category.
         *
         * @param {string} value  Category
         */
        set: function (value) {
            this.setProperty("category", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisDataItem.prototype, "startCategory", {
        /**
         * An alias to `category`.
         *
         * @param {string} Category
         */
        get: function () {
            return this.properties["category"];
        },
        /**
         * An alias to `category`.
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
         * Returns currently set end category.
         *
         * @return {string} End category
         */
        get: function () {
            return this.properties["endCategory"];
        },
        /**
         * Sets end category.
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
}(__WEBPACK_IMPORTED_MODULE_0__Axis__["b" /* AxisDataItem */]));

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
    __extends(CategoryAxis, _super);
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
         * @ignore Exclude from docs
         * @type {Dictionary}
         */
        _this.dataItemsByCategory = new __WEBPACK_IMPORTED_MODULE_2__core_utils_Dictionary__["a" /* Dictionary */]();
        /**
         * [_preBuildCount description]
         *
         * @todo Description
         * @type {number}
         */
        _this._preBuildCount = 0;
        _this.className = "CategoryAxis";
        // Set field name
        _this.axisFieldName = "category";
        // Add adapter to strip down `#id=xxx` from categories
        _this.adapter.add("label", function (value) {
            value = value.replace(/\#id=.*$/, "");
            return value;
        });
        _this._prebuildDisposer = __WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].events.on("enterframe", _this.prebuildDataItem, _this);
        _this._lastDataItem = _this.createDataItem();
        _this._lastDataItem.component = _this;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * [prebuildDataItem description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    CategoryAxis.prototype.prebuildDataItem = function () {
        if (this.dataItems.length > 0) {
            this.dataItems.getIndex(this._preBuildCount);
            var dataItem = this.dataItems.getIndex(this._preBuildCount);
            if (dataItem.__disabled) {
                this.appendDataItem(dataItem);
                this.validateDataElement(dataItem);
                dataItem.__disabled = true;
            }
            this._preBuildCount++;
            if (this._preBuildCount >= this.dataItems.length - 1) {
                this._prebuildDisposer.dispose();
            }
        }
    };
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
        return new __WEBPACK_IMPORTED_MODULE_3__CategoryAxisBreak__["a" /* CategoryAxisBreak */]();
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
        var startIndex = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitToRange"](Math.floor(this.start * dataCount - 1), 0, dataCount);
        var endIndex = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitToRange"](Math.ceil(this.end * dataCount), 0, dataCount);
        if (this.renderer.invalid) {
            this.renderer.validate();
        }
        // find frequency at which we'll show items
        var maxCount = this.renderer.axisLength / this.renderer.minGridDistance;
        var frequency = Math.ceil((endIndex - startIndex) / maxCount);
        this._startIndex = Math.floor(startIndex / frequency) * frequency;
        this._endIndex = Math.ceil(this.end * dataCount);
        this.fixAxisBreaks();
        if (this._startIndex == this._endIndex) {
            this._endIndex++;
        }
        this._frequency = frequency;
        _super.prototype.validateDataRange.call(this);
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__["each"](this._series.iterator(), function (series) {
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
     * Validates Axis' data.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    CategoryAxis.prototype.validateData = function () {
        _super.prototype.validateData.call(this);
        this.maxZoomFactor = this.dataItems.length;
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
        this.resetIterators();
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__["each"](this.dataItems.iterator(), function (dataItem) {
            dataItem.__disabled = true;
        });
        // it's important to use protected variables here, as getters will return 0 - length
        // TODO use iterator instead
        // @ todo: not solved cat axis item fading
        var startIndex = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["max"](0, this._startIndex - this._frequency);
        var endIndex = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["min"](this.dataItems.length, this._endIndex + this._frequency);
        var itemIndex = 0;
        for (var i = startIndex; i < endIndex; i = i + this._frequency) {
            if (i <= this.dataItems.length) {
                var dataItem = this.dataItems.getIndex(i);
                var axisBreak = this.isInBreak(i);
                if (!axisBreak) {
                    this.appendDataItem(dataItem);
                    this.validateDataElement(dataItem, itemIndex);
                }
                itemIndex++;
            }
        }
        this.appendDataItem(this._lastDataItem);
        this.validateDataElement(this._lastDataItem, itemIndex + 1, this.dataItems.length);
        var axisBreaks = this.axisBreaks;
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__["each"](axisBreaks.iterator(), function (axisBreak) {
            var adjustedStartValue = axisBreak.adjustedStartValue;
            var adjustedEndValue = axisBreak.adjustedEndValue;
            if (__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["intersect"]({ start: adjustedStartValue, end: adjustedEndValue }, { start: _this._startIndex, end: _this._endIndex })) {
                var frequency = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["fitToRange"](Math.ceil(_this._frequency / axisBreak.breakSize), 1, adjustedEndValue - adjustedStartValue);
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
        if (!__WEBPACK_IMPORTED_MODULE_5__core_utils_Type__["isNumber"](index)) {
            index = this.categoryToIndex(dataItem.category);
        }
        var endIndex = this.categoryToIndex(dataItem.endCategory);
        if (!__WEBPACK_IMPORTED_MODULE_5__core_utils_Type__["isNumber"](endIndex)) {
            endIndex = index;
        }
        var position = this.indexToPosition(index, dataItem.locations.category);
        var endPosition = this.indexToPosition(endIndex, dataItem.locations.endCategory);
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
        if (!__WEBPACK_IMPORTED_MODULE_5__core_utils_Type__["isNumber"](location)) {
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
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__["eachContinue"](axisBreaks.iterator(), function (axisBreak) {
            var breakStartIndex = axisBreak.adjustedStartValue;
            var breakEndIndex = axisBreak.adjustedEndValue;
            if (index < startIndex) {
                return false;
            }
            if (__WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["intersect"]({ start: breakStartIndex, end: breakEndIndex }, { start: startIndex, end: endIndex })) {
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
        return __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["round"]((index + location - cellStartLocation - startIndex) / difference, 5);
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
        this.zoomToIndexes(this.categoryToIndex(startCategory), this.categoryToIndex(endCategory));
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
        var position = this.categoryToPosition(dataItem.categories[key], location);
        if (__WEBPACK_IMPORTED_MODULE_5__core_utils_Type__["isNaN"](position)) {
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
        var position = this.categoryToPosition(dataItem.categories[key], location);
        if (__WEBPACK_IMPORTED_MODULE_5__core_utils_Type__["isNaN"](position)) {
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
        position = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["round"](position, 10);
        var startIndex = this.startIndex;
        var endIndex = this.endIndex;
        var difference = endIndex - startIndex;
        var axisBreaks = this.axisBreaks;
        var index = null;
        // in case we have some axis breaks
        __WEBPACK_IMPORTED_MODULE_6__core_utils_Iterator__["eachContinue"](axisBreaks.iterator(), function (axisBreak) {
            var breakStartPosition = axisBreak.startPosition;
            var breakEndPosition = axisBreak.endPosition;
            var breakStartIndex = axisBreak.adjustedStartValue;
            var breakEndIndex = axisBreak.adjustedEndValue;
            breakStartIndex = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["max"](breakStartIndex, startIndex);
            breakEndIndex = __WEBPACK_IMPORTED_MODULE_4__core_utils_Math__["min"](breakEndIndex, endIndex);
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
        if (!__WEBPACK_IMPORTED_MODULE_5__core_utils_Type__["isNumber"](index)) {
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
         * [basePoint description]
         *
         * @todo Description
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
}(__WEBPACK_IMPORTED_MODULE_0__Axis__["a" /* Axis */]));

/**
 * Register class, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["CategoryAxis"] = CategoryAxis;
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["b" /* registry */].registeredClasses["CategoryAxisDataItem"] = CategoryAxisDataItem;
//# sourceMappingURL=CategoryAxis.js.map

/***/ })

},[296]);