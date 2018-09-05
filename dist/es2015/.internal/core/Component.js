import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "./Container";
import { List, ListDisposer } from "./utils/List";
import { OrderedListTemplate } from "./utils/SortedList";
import { Dictionary } from "./utils/Dictionary";
import { Disposer, MultiDisposer } from "./utils/Disposer";
import { DataSource } from "./data/DataSource";
import { Responsive } from "./responsive/Responsive";
import { DataItem } from "./DataItem";
import { registry } from "./Registry";
import * as $math from "./utils/Math";
import * as $array from "./utils/Array";
import * as $ease from "./utils/Ease";
import * as $utils from "./utils/Utils";
import * as $iter from "./utils/Iterator";
import * as $object from "./utils/Object";
import * as $type from "./utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A Component represents an independent functional element or control, that
 * can have it's own behavior, children, data, etc.
 *
 * A few examples of a Component: [[Legend]], [[Series]], [[Scrollbar]].
 *
 * @see {@link IComponentEvents} for a list of available events
 * @see {@link IComponentAdapters} for a list of available Adapters
 * @important
 */
var Component = /** @class */ (function (_super) {
    tslib_1.__extends(Component, _super);
    /**
     * Constructor
     */
    function Component() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Holds data field names.
         *
         * Data fields define connection beween [[DataItem]] and actual properties
         * in raw data.
         *
         * @type {IComponentDataFields}
         */
        _this.dataFields = {};
        /**
         * A list of [[DataSource]] definitions of external data source.
         *
         * @ignore Exclude from docs
         * @type {Object}
         */
        _this._dataSources = {};
        /**
         * This is used when only new data is invalidated (if added using `addData`
         * method).
         *
         * @ignore Exclude from docs
         * @type {number}
         */
        _this._parseDataFrom = 0;
        /**
         * Holds the disposers for the dataItems and dataUsers
         *
         * @ignore Exclude from docs
         * @type {Array<IDisposer>}
         */
        _this._dataDisposers = [];
        /**
         * [_start description]
         *
         * @ignore Exclude from docs
         * @type {number}
         */
        _this._start = 0;
        /**
         * [_end description]
         *
         * @ignore Exclude from docs
         * @type {number}
         */
        _this._end = 1;
        /**
         * If set to `true`, changing data range in element will not trigger
         * `daterangechanged` event.
         *
         * @type {boolean}
         */
        _this.skipRangeEvent = false;
        /**
         * Whenever selected scope changes (chart is zoomed or panned), for example
         * by interaction from a Scrollbar, or API, a chart needs to reposition
         * its contents.
         *
         * `rangeChangeDuration` influences how this is performed.
         *
         * If set to zero (0), the change will happen instantenously.
         *
         * If set to non-zero value, the chart will gradually animate into new
         * position for the set amount of milliseconds.
         *
         * @default 0
         * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
         * @type {number}
         */
        _this.rangeChangeDuration = 0;
        /**
         * An easing function to use for range change animation.
         *
         * @see {@link Ease}
         * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
         * @type {function}
         */
        _this.rangeChangeEasing = $ease.cubicOut;
        /**
         * A duration (ms) of each data parsing step. A Component parses its data in
         * chunks in order to avoid completely freezing the machine when large data
         * sets are used. This setting will control how many milliseconds should pass
         * when parsing data until parser stops for a brief moment to let other
         * processes catch up.
         *
         * @type {number}
         */
        _this.parsingStepDuration = 50;
        /**
         * [dataInvalid description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @type {boolean}
         */
        _this.dataInvalid = false;
        /**
         *
         * @ignore Exclude from docs
         */
        _this.rawDataInvalid = false;
        /**
         * [dataRangeInvalid description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @type {boolean}
         */
        _this.dataRangeInvalid = false;
        /**
         * [dataItemsInvalid description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @type {boolean}
         */
        _this.dataItemsInvalid = false;
        /**
         * If set to a non-zero number the element will "animate" data values of its
         * children.
         *
         * This will happen on first load and whenever data values change.
         *
         * Enabling interpolation will mean that elements will transit smoothly into
         * new values rather than updating instantly.
         *
         * @default 0
         * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
         * @type {number}
         */
        _this.interpolationDuration = 0;
        /**
         * An easing function to use for interpolating values when transiting from
         * one source value to another.
         *
         * @default cubicOut
         * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
         * @see {@link Ease}
         * @type {function}
         */
        _this.interpolationEasing = $ease.cubicOut;
        /**
         * Indicates whether transition between data item's values should start and
         * play out all at once, or with a small delay (as defined by
         * `sequencedInterpolationDelay`) for each subsequent data item.
         *
         * @default true
         * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
         * @type {boolean}
         */
        _this.sequencedInterpolation = true;
        /**
         * A delay (ms) to wait between animating each subsequent data item's
         * interpolation animation.
         *
         * Relative only if `sequencedInterpolation = true`.
         *
         * @default 0
         * @see {@link https://www.amcharts.com/docs/v4/concepts/animations/} for more info about animations
         * @type {number}
         */
        _this.sequencedInterpolationDelay = 0;
        /**
         * A progress (0-1) for the data validation process.
         *
         * @ignore Exclude from docs
         * @type {number}
         */
        _this.dataValidationProgress = 0;
        _this.className = "Component";
        _this.invalidateData();
        // Set up events
        _this.events.on("maxsizechanged", _this.invalidate, _this);
        // TODO what about remove ?
        _this.dataUsers.events.on("inserted", _this.handleDataUserAdded, _this);
        // Set up disposers
        _this._disposers.push(new MultiDisposer(_this._dataDisposers));
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {DataItem} Data Item
     */
    Component.prototype.createDataItem = function () {
        return new DataItem();
    };
    /**
     * [handleDataUserAdded description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {IListEvents<Component>["inserted"]} event Event object
     */
    Component.prototype.handleDataUserAdded = function (event) {
        var dataUser = event.newValue;
        dataUser.dataProvider = this;
    };
    /**
     * [handleDataItemValueChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Component.prototype.handleDataItemValueChange = function () {
        this.invalidateDataItems();
    };
    /**
     * [handleDataItemWorkingValueChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Component.prototype.handleDataItemWorkingValueChange = function (event) {
    };
    /**
     * [handleDataItemWorkingLocationChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Component.prototype.handleDataItemWorkingLocationChange = function (event) {
    };
    /**
     * [handleDataItemCalculatedValueChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Component.prototype.handleDataItemCalculatedValueChange = function () {
    };
    /**
     * [handleDataItemPropertyChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Component.prototype.handleDataItemPropertyChange = function () {
    };
    /**
     * Populates a [[DataItem]] width data from data source.
     *
     * Loops through all the fields and if such a field is found in raw data
     * object, a corresponding value on passed in `dataItem` is set.
     *
     * @ignore Exclude from docs
     * @param {Object} item
     */
    Component.prototype.processDataItem = function (dataItem, dataContext) {
        var _this = this;
        if (dataItem) {
            if (!dataContext) {
                dataContext = {};
            }
            // store reference to original data item
            dataItem.dataContext = dataContext;
            $object.each(this.dataFields, function (key, fieldValue) {
                var fieldName = key;
                var value = dataContext[fieldValue];
                // Apply adapters to a retrieved value
                value = _this.adapter.apply("dataContextValue", {
                    field: fieldName,
                    value: value,
                    dataItem: dataItem
                }).value;
                if (dataItem.hasChildren[fieldName]) {
                    if (value) {
                        var children = new OrderedListTemplate(_this.createDataItem());
                        children.events.on("inserted", _this.handleDataItemAdded, _this);
                        children.events.on("removed", _this.handleDataItemRemoved, _this);
                        _this._dataDisposers.push(new ListDisposer(children));
                        for (var i = 0; i < value.length; i++) {
                            var rawDataItem = value[i];
                            var childDataItem = children.create();
                            childDataItem.parent = dataItem;
                            _this.processDataItem(childDataItem, rawDataItem);
                        }
                        var anyDataItem = dataItem;
                        anyDataItem[fieldName] = children;
                    }
                }
                else {
                    // data is converted to numbers/dates in each dataItem
                    if ($type.hasValue(value)) {
                        dataItem[fieldName] = value;
                    }
                }
            });
            $object.each(this.propertyFields, function (key, fieldValue) {
                var f = key;
                var value = dataContext[fieldValue];
                if ($type.hasValue(value)) {
                    dataItem.setProperty(f, value);
                }
            });
            this._dataDisposers.push(dataItem.events.on("valuechanged", this.handleDataItemValueChange, this));
            this._dataDisposers.push(dataItem.events.on("workingvaluechanged", this.handleDataItemWorkingValueChange, this));
            this._dataDisposers.push(dataItem.events.on("calculatedvaluechanged", this.handleDataItemCalculatedValueChange, this));
            this._dataDisposers.push(dataItem.events.on("propertychanged", this.handleDataItemPropertyChange, this));
            this._dataDisposers.push(dataItem.events.on("locationchanged", this.handleDataItemValueChange, this));
            this._dataDisposers.push(dataItem.events.on("workinglocationchanged", this.handleDataItemWorkingLocationChange, this));
        }
    };
    /**
     *
     * When validating raw data, instead of processing data item, we update it
     *
     * @ignore Exclude from docs
     * @param {Object} item
     */
    Component.prototype.updateDataItem = function (dataItem) {
        var _this = this;
        if (dataItem) {
            var dataContext_1 = dataItem.dataContext;
            $object.each(this.dataFields, function (key, fieldValue) {
                var fieldName = key;
                var value = dataContext_1[fieldValue];
                // Apply adapters to a retrieved value
                value = _this.adapter.apply("dataContextValue", {
                    field: fieldName,
                    value: value,
                    dataItem: dataItem
                }).value;
                if (dataItem.hasChildren[fieldName]) {
                    if (value) {
                        var anyDataItem = dataItem;
                        var children = (anyDataItem[fieldName]);
                        $iter.each(children.iterator(), function (child) {
                            _this.updateDataItem(child);
                        });
                    }
                }
                else {
                    // data is converted to numbers/dates in each dataItem
                    if ($type.hasValue(value)) {
                        dataItem[fieldName] = value;
                    }
                }
            });
            $object.each(this.propertyFields, function (key, fieldValue) {
                var f = key;
                var value = dataContext_1[fieldValue];
                if ($type.hasValue(value)) {
                    dataItem.setProperty(f, value);
                }
            });
        }
    };
    /**
     * [validateDataElements description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Component.prototype.validateDataElements = function () {
        for (var i = this.startIndex; i < this.endIndex; i++) {
            var dataItem = this.dataItems.getIndex(i);
            // TODO is this correct
            if (dataItem) {
                this.validateDataElement(dataItem);
            }
        }
    };
    /**
     * Validates this element and its related elements.
     *
     * @ignore Exclude from docs
     */
    Component.prototype.validate = function () {
        this.validateDataElements();
        _super.prototype.validate.call(this);
    };
    /**
     * [validateDataElement description]
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]} dataItem [description]
     */
    Component.prototype.validateDataElement = function (dataItem) {
    };
    /**
     * Adds one or several (array) of data items to the existing data.
     *
     * @param {Object | Object[]} rawDataItem One or many raw data item objects
     */
    Component.prototype.addData = function (rawDataItem, removeCount) {
        this._parseDataFrom = this.data.length; // save length of parsed data
        if (rawDataItem instanceof Array) {
            this.data = this.data.concat(rawDataItem);
        }
        else {
            this.data.push(rawDataItem); // add to raw data array
        }
        this.removeData(removeCount);
        this.invalidateData();
    };
    /**
     * Removes elements from the beginning of data
     *
     * @param {Optional<number>} coun number of elements to remove
     */
    Component.prototype.removeData = function (count) {
        if ($type.isNumber(count)) {
            while (count > 0) {
                var dataItem = this.dataItems.getIndex(0);
                if (dataItem) {
                    this.dataItems.remove(dataItem);
                }
                $iter.each(this.dataUsers.iterator(), function (dataUser) {
                    var dataItem = dataUser.dataItems.getIndex(0);
                    if (dataItem) {
                        dataUser.dataItems.remove(dataItem);
                    }
                });
                this.data.shift();
                this._parseDataFrom--;
                count--;
            }
        }
    };
    /**
     * Triggers a data (re)parsing.
     *
     * @ignore Exclude from docs
     */
    Component.prototype.invalidateData = function () {
        if (this.disabled || this.isTemplate) {
            return;
        }
        //if(!this.dataInvalid){
        $array.move(registry.invalidDatas, this);
        this.dataInvalid = true;
        $iter.each(this.dataUsers.iterator(), function (x) {
            x.invalidateDataItems();
        });
        //}
    };
    /**
     * [invalidateDataUsers description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Component.prototype.invalidateDataUsers = function () {
        $iter.each(this.dataUsers.iterator(), function (x) {
            x.invalidate();
        });
    };
    /**
     * Invalidates data values. When data array is not changed, but values within
     * it changes, we invalidate data so that component would process changes.
     *
     * @ignore Exclude from docs
     */
    Component.prototype.invalidateDataItems = function () {
        if (this.disabled || this.isTemplate) {
            return;
        }
        //if(!this.dataItemsInvalid){
        $array.move(registry.invalidDataItems, this);
        this.dataItemsInvalid = true;
        $iter.each(this.dataUsers.iterator(), function (x) {
            x.invalidateDataItems();
        });
        //}
    };
    /**
     * Invalidates data range. This is done when data which must be shown
     * changes (chart is zoomed for example).
     *
     * @ignore Exclude from docs
     */
    Component.prototype.invalidateDataRange = function () {
        if (this.disabled || this.isTemplate) {
            return;
        }
        //if(!this.dataRangeInvalid){
        this.dataRangeInvalid = true;
        $array.move(registry.invalidDataRange, this);
        //}
    };
    /**
     * Processes data range.
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    Component.prototype.validateDataRange = function () {
        $array.remove(registry.invalidDataRange, this);
        this.dataRangeInvalid = false;
        if (this.startIndex != this._prevStartIndex || this.endIndex != this._prevEndIndex) {
            this.rangeChangeUpdate();
        }
        this.appendDataItems();
        this.invalidate();
        this.dispatchImmediately("datarangechanged");
    };
    /**
     * [sliceData description]
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    Component.prototype.sliceData = function () {
        this._workingStartIndex = this.startIndex;
        this._workingEndIndex = this.endIndex;
    };
    /**
     * [rangeChangeUpdate description]
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    Component.prototype.rangeChangeUpdate = function () {
        this.sliceData();
        this._prevStartIndex = this.startIndex;
        this._prevEndIndex = this.endIndex;
    };
    /**
     * [removeDataItems description]
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    Component.prototype.removeDataItems = function () {
    };
    /**
     * [appendDataItems description]
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    Component.prototype.appendDataItems = function () {
        // todo: think if we can optimize this place, maybe mark the ones which should not be removed and then remove all others?
        this.removeDataItems();
        // TODO use an iterator instead
        for (var i = this.startIndex; i < this.endIndex; i++) {
            // data item
            var dataItem = this.dataItems.getIndex(i);
            if (dataItem) {
                // append item
                this.appendDataItem(dataItem);
            }
        }
    };
    /**
     * [appendDataItem description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {this["_dataItem"]} dataItem [description]
     */
    Component.prototype.appendDataItem = function (dataItem) {
        // todo: this makes default state to be applied a lot of times. Need to think of a diff solution
        // and we also need to find when we actually need this
        //dataItem.invalidate();
    };
    /**
     * If you want to have a smooth transition from one data values to another, you change your raw data and then you must call this method.
     * then instead of redrawing everything, the chart will check raw data and smoothly transit from previous to new data
     */
    Component.prototype.invalidateRawData = function () {
        if (this.disabled || this.isTemplate) {
            return;
        }
        //if(!this.rawDataInvalid){
        $array.move(registry.invalidRawDatas, this);
        this.rawDataInvalid = true;
        $iter.each(this.dataUsers.iterator(), function (x) {
            x.invalidateRawData();
        });
        //}
    };
    /**
     * @ignore
     */
    Component.prototype.validateRawData = function () {
        var _this = this;
        $array.remove(registry.invalidRawDatas, this);
        $iter.each(this.dataItems.iterator(), function (dataItem) {
            if (dataItem) {
                _this.updateDataItem(dataItem);
            }
        });
    };
    /**
     * @ignore
     */
    Component.prototype.disposeData = function () {
        $array.each(this._dataDisposers, function (x) {
            x.dispose();
        });
        this._dataDisposers.length = 0;
        // dispose old
        this.dataItems.clear();
    };
    /**
     * Validates (processes) data.
     *
     * @ignore Exclude from docs
     */
    Component.prototype.validateData = function () {
        this.dispatchImmediately("beforedatavalidated");
        this.dataInvalid = false;
        $array.remove(registry.invalidDatas, this);
        this.dataValidationProgress = 0;
        // need this to slice new data
        this._prevStartIndex = undefined;
        this._prevEndIndex = undefined;
        // todo: this needs some overthinking, maybe some extra settings like zoomOotonDataupdate like in v3 or so. some charts like pie chart probably should act like this always
        this._startIndex = undefined;
        this._endIndex = undefined;
        if (this.dataFields.data && this.dataItem) {
            var dataContext = this.dataItem.dataContext;
            this._data = dataContext[this.dataFields.data];
        }
        if (this.data.length > 0) {
            var preloader = this.preloader;
            // data items array is reset only if all data is validated, if _parseDataFrom is not 0, we append new data only
            if (this._parseDataFrom === 0) {
                this.disposeData();
                // and for all components
                $iter.each(this.dataUsers.iterator(), function (dataUser) {
                    dataUser.disposeData();
                    // todo: this needs some overthinking, maybe some extra settings like zoomOUtonDataupdate like in v3 or so. some charts like pie chart probably should act like this always
                    dataUser._startIndex = undefined;
                    dataUser._endIndex = undefined;
                });
            }
            // and for all components
            $iter.each(this.dataUsers.iterator(), function (dataUser) {
                // todo: this needs some overthinking, maybe some extra settings like zoomOUtonDataupdate like in v3 or so. some charts like pie chart probably should act like this always
                dataUser._startIndex = undefined;
                dataUser._endIndex = undefined;
            });
            var counter = 0;
            var startTime = Date.now();
            // parse data
            var i = this._parseDataFrom;
            var n = this.data.length;
            var _loop_1 = function () {
                var rawDataItem = this_1.data[i];
                var dataItem = this_1.dataItems.create();
                this_1.processDataItem(dataItem, rawDataItem);
                $iter.each(this_1.dataUsers.iterator(), function (dataUser) {
                    var dataUserDataItem = dataUser.dataItems.create();
                    dataUser.processDataItem(dataUserDataItem, rawDataItem);
                });
                counter++;
                // show preloader if this takes too many time
                if (counter == 100) { // no need to check it on each data item
                    counter = 0;
                    var elapsed = Date.now() - startTime;
                    if (elapsed > this_1.parsingStepDuration) {
                        if (i < this_1.data.length - 10) {
                            this_1._parseDataFrom = i + 1;
                            // update preloader
                            if (preloader) {
                                if (i / this_1.data.length > 0.5 && !preloader.visible) {
                                    // do not start showing
                                }
                                else {
                                    preloader.progress = i / this_1.data.length;
                                }
                            }
                            this_1.dataValidationProgress = i / this_1.data.length;
                            i = this_1.data.length; // stops cycle
                            this_1.invalidateData();
                            return { value: void 0 };
                        }
                    }
                }
            };
            var this_1 = this;
            for (i; i < n; i++) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            if (preloader) {
                preloader.progress = 1;
            }
        }
        this.dataValidationProgress = 1;
        this._parseDataFrom = 0; // reset this index, it is set to dataItems.length if addData() method was used.
        this.invalidateDataItems();
        this.dispatch("datavalidated");
    };
    /**
     * Validates (processes) data items.
     *
     * @ignore Exclude from docs
     */
    Component.prototype.validateDataItems = function () {
        $array.remove(registry.invalidDataItems, this);
        this.dataItemsInvalid = false;
        this.invalidateDataRange();
        this.dispatch("valueschanged");
        /*
         this is needed in this scenario: chart has some series, then one is hidden. then data is validated (for example add some more series)
         then data is processed, working values are not set to 0 but the series is still not visibleand this then this results problems with stacked series.
         */
        if (!this.visible) {
            this.hide();
        }
    };
    Object.defineProperty(Component.prototype, "data", {
        /**
         * Returns element's source (raw) data.
         *
         * @return {any[]} Data
         */
        get: function () {
            if (!this._data) {
                this._data = [];
            }
            return this.adapter.apply("data", this._data);
        },
        /**
         * Sets source (raw) data for the element. The "data" is always an `Array`
         * of objects.
         *
         * @param {any[]} value Data
         */
        set: function (value) {
            // array might be the same, but there might be items added
            // todo: check if array changed, toString maybe?
            //if (this._data != value) {
            this._data = value;
            this.invalidateData();
            //}
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns (creates if necessary) a [[DataSource]] bound to any specific
     * property.
     *
     * For example if I want to bind `data` to an external JSON file, I'd create
     * a DataSource for it.
     *
     * @param  {string}      property  Property to bind external data to
     * @return {DataSource}            A DataSource for property
     */
    Component.prototype.getDataSource = function (property) {
        var _this = this;
        if (!$type.hasValue(this._dataSources[property])) {
            this._dataSources[property] = new DataSource();
            this._dataSources[property].component = this;
            this.setDataSourceEvents(this._dataSources[property], property);
            this._dataSources[property].adapter.add("dateFields", function (val) {
                return _this.dataSourceDateFields(val);
            });
            this._dataSources[property].adapter.add("numberFields", function (val) {
                return _this.dataSourceNumberFields(val);
            });
            this.events.on("inited", function () {
                _this.loadData(property);
            }, this);
        }
        return this._dataSources[property];
    };
    Object.defineProperty(Component.prototype, "dataSource", {
        /**
         * @return {DataSource} Data source
         */
        get: function () {
            if (!this._dataSources["data"]) {
                this.getDataSource("data");
            }
            return this._dataSources["data"];
        },
        /**
         *A [[DataSource]] to be used for loading Component's data.
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/loading-external-data/} for more on loading external data
         * @param {DataSource}  value  Data source
         */
        set: function (value) {
            var _this = this;
            if (this._dataSources["data"]) {
                this.removeDispose(this._dataSources["data"]);
            }
            this._dataSources["data"] = value;
            this._dataSources["data"].component = this;
            this.events.on("inited", function () {
                _this.loadData("data");
            }, this);
            this.setDataSourceEvents(value, "data");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initiates loading of the external data via [[DataSource]].
     *
     * @ignore Exclude from docs
     */
    Component.prototype.loadData = function (property) {
        this._dataSources[property].load();
    };
    /**
     * This function is called by the [[DataSource]]'s `dateFields` adapater
     * so that particular chart types can popuplate this setting with their
     * own type-speicifc data fields so they are parsed properly.
     *
     * @ignore Exclude from docs
     * @param  {string[]}  value  Array of date fields
     * @return {string[]}         Array of date fields populated with chart's date fields
     */
    Component.prototype.dataSourceDateFields = function (value) {
        return value;
    };
    /**
     * This function is called by the [[DataSource]]'s `numberFields` adapater
     * so that particular chart types can popuplate this setting with their
     * own type-speicifc data fields so they are parsed properly.
     *
     * @ignore Exclude from docs
     * @param  {string[]}  value  Array of number fields
     * @return {string[]}         Array of number fields populated with chart's number fields
     */
    Component.prototype.dataSourceNumberFields = function (value) {
        return value;
    };
    /**
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {string[]}  list        [description]
     * @param  {object}    dataFields  [description]
     * @param  {string[]}  targetList  [description]
     * @return {string[]}              [description]
     */
    Component.prototype.populateDataSourceFields = function (list, dataFields, targetList) {
        $array.each(targetList, function (value) {
            if (dataFields[value] && $array.indexOf(list, dataFields[value]) === -1) {
                list.push(dataFields[value]);
            }
        });
        return list;
    };
    /**
     * Sets events on a [[DataSource]].
     *
     * @ignore Exclude from docs
     */
    Component.prototype.setDataSourceEvents = function (ds, property) {
        var _this = this;
        ds.events.on("started", function (ev) {
            var preloader = _this.preloader;
            if (preloader) {
                preloader.progress = 0;
                //preloader.label.text = this.language.translate("Loading");
            }
        });
        ds.events.on("loadstarted", function (ev) {
            var preloader = _this.preloader;
            if (preloader) {
                preloader.progress = 0.25;
            }
        });
        ds.events.on("loadended", function (ev) {
            var preloader = _this.preloader;
            if (preloader) {
                preloader.progress = 0.5;
            }
        });
        ds.events.on("parseended", function (ev) {
            var preloader = _this.preloader;
            if (preloader) {
                preloader.progress = 0.75;
            }
        });
        ds.events.on("ended", function (ev) {
            var preloader = _this.preloader;
            if (preloader) {
                preloader.progress = 1;
            }
        });
        ds.events.on("error", function (ev) {
            var preloader = _this.preloader;
            if (preloader) {
                preloader.progress = 1;
            }
            _this.openModal(ev.message);
        });
        if (property) {
            ds.events.on("done", function (ev) {
                var preloader = _this.preloader;
                if (preloader) {
                    preloader.progress = 1;
                }
                if (property == "data" && !$type.isArray(ev.data)) {
                    ev.data = [ev.data];
                }
                if (ds.incremental && property == "data" && _this.data.length) {
                    _this.addData(ev.data, ds.keepCount ? ev.data.length : 0);
                }
                else {
                    _this[property] = ev.data;
                }
            });
        }
    };
    Object.defineProperty(Component.prototype, "responsive", {
        /**
         * @return {DataSource} Data source
         */
        get: function () {
            if (!this._responsive) {
                this._responsive = new Responsive();
                this._responsive.component = this;
            }
            return this._responsive;
        },
        /**
         * A [[Responsive]] instance to be used when applying conditional
         * property values.
         *
         * NOTE: Responsive features are currently in development and may not work
         * as expected, if at all.
         *
         * @param {Responsive}  value  Data source
         */
        set: function (value) {
            this._responsive = value;
            this._responsive.component = this;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets current zoom.
     *
     * The range uses relative values from 0 to 1, with 0 marking beginning and 1
     * marking end of the available data range.
     *
     * This method will not have any effect when called on a chart object.
     * Since the chart can have a number of axes and series, each with its own
     * data, the meaning of "range" is very ambiguous.
     *
     * To zoom the chart use `zoom*` methods on its respective axes.
     *
     * @param  {IRange}  range          Range
     * @param  {boolean} skipRangeEvent Should rangechanged event not be triggered?
     * @param  {boolean} instantly      Do not animate?
     * @return {IRange}                 Actual modidied range (taking `maxZoomFactor` into account)
     */
    Component.prototype.zoom = function (range, skipRangeEvent, instantly) {
        var _this = this;
        if (skipRangeEvent === void 0) { skipRangeEvent = false; }
        if (instantly === void 0) { instantly = false; }
        var start = range.start;
        var end = range.end;
        var priority = range.priority;
        if (!$type.isNumber(start) || !$type.isNumber(end)) {
            return { start: this.start, end: this.end };
        }
        if (this._finalStart != start || this._finalEnd != end) {
            var maxZoomFactor = this.maxZoomFactor;
            // most likely we are dragging left scrollbar grip here, so we tend to modify end
            if (priority == "start") {
                // add to the end
                if (1 / (end - start) > maxZoomFactor) {
                    end = start + 1 / maxZoomFactor;
                }
                //unless end is > 0
                if (end > 1 && end - start < 1 / maxZoomFactor) {
                    //end = 1;
                    start = end - 1 / maxZoomFactor;
                }
            }
            // most likely we are dragging right, so we modify left
            else {
                // remove from start
                if (1 / (end - start) > maxZoomFactor) {
                    start = end - 1 / maxZoomFactor;
                }
                if (start < 0 && end - start < 1 / maxZoomFactor) {
                    //start = 0;
                    end = start + 1 / maxZoomFactor;
                }
            }
            this._finalEnd = end;
            this._finalStart = start;
            this.skipRangeEvent = skipRangeEvent;
            if (this.rangeChangeDuration > 0 && !instantly) {
                // todo: maybe move this to Animation
                var rangeChangeAnimation = this.rangeChangeAnimation;
                if (rangeChangeAnimation && rangeChangeAnimation.progress < 1) {
                    var options = rangeChangeAnimation.animationOptions;
                    if (options.length > 1) {
                        if (options[0].to == start && options[1].to == end) {
                            return { start: start, end: end };
                        }
                    }
                }
                this.dispatchImmediately("rangechangestarted");
                if (this.rangeChangeAnimation) {
                    this.rangeChangeAnimation.dispose();
                }
                this.rangeChangeAnimation = this.animate([{ property: "start", to: start }, { property: "end", to: end }], this.rangeChangeDuration, this.rangeChangeEasing);
                if (this.rangeChangeAnimation && !this.rangeChangeAnimation.isDisposed()) {
                    this.rangeChangeAnimation.events.on("animationended", function () {
                        _this.dispatchImmediately("rangechangeended");
                    });
                }
                else {
                    this.dispatchImmediately("rangechangeended");
                }
            }
            else {
                this.start = start;
                this.end = end;
            }
        }
        return { start: start, end: end };
    };
    /**
     * Zooms to specific data items using their index in data.
     *
     * This method will not have any effect when called on a chart object.
     * Since the chart can have a number of axes and series, each with its own
     * data, the meaning of "index" is very ambiguous.
     *
     * To zoom the chart use `zoom*` methods on its respective axes.
     *
     * @param {number}  startIndex     Index of the starting data item
     * @param {number}  endIndex       Index of the ending data item
     * @param {boolean} skipRangeEvent Should rangechanged event not be triggered?
     * @param {boolean} instantly      Do not animate?
     */
    Component.prototype.zoomToIndexes = function (startIndex, endIndex, skipRangeEvent, instantly) {
        if (!$type.isNumber(startIndex) || !$type.isNumber(endIndex)) {
            return;
        }
        var start = startIndex / this.dataItems.length;
        var end = endIndex / this.dataItems.length;
        this.zoom({ start: start, end: end }, skipRangeEvent, instantly);
    };
    Object.defineProperty(Component.prototype, "zoomFactor", {
        /**
         * A current zoom factor (0-1). 1 meaning fully zoomed out. (showing all of
         * the available data)
         *
         * @return {number} Zoom factor
         */
        get: function () {
            return $math.fitToRange(1 / (this.end - this.start), 1, this.maxZoomFactor);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "maxZoomFactor", {
        /**
         * @return {number} Maximum `zoomFactor`
         */
        get: function () {
            return this.getPropertyValue("maxZoomFactor");
        },
        /**
         * Max available `zoomFactor`.
         *
         * The element will not allow zoom to occur beyond this factor.
         *
         * @param {number}  value  Maximum `zoomFactor`
         */
        set: function (value) {
            if (this.setPropertyValue("maxZoomFactor", value)) {
                this.invalidateDataRange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "startIndex", {
        /**
         * Current starting index.
         *
         * @return {number} Start index
         */
        get: function () {
            if (!$type.isNumber(this._startIndex)) {
                this._startIndex = 0;
            }
            return this._startIndex;
        },
        /**
         * Sets current starting index.
         *
         * @ignore Exclude from docs
         * @param {number} value Start index
         */
        set: function (value) {
            this._startIndex = $math.fitToRange(Math.round(value), 0, this.dataItems.length);
            this.start = this.indexToPosition(this._startIndex);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @ignore
     * @todo:review description
     * returns item's relative position by the index of the item
     * @param {number} index
     */
    Component.prototype.indexToPosition = function (index) {
        return index / this.dataItems.length;
    };
    Object.defineProperty(Component.prototype, "endIndex", {
        /**
         * Current ending index.
         *
         * @return {number} End index
         */
        get: function () {
            if (!$type.isNumber(this._endIndex)) {
                this._endIndex = this.dataItems.length;
            }
            return this._endIndex;
        },
        /**
         * Sets current ending index.
         *
         * @ignore Exclude from docs
         * @param {number} value End index
         */
        set: function (value) {
            this._endIndex = $math.fitToRange(Math.round(value), 0, this.dataItems.length);
            this.end = this.indexToPosition(this._endIndex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "start", {
        /**
         * Current relative starting position of the data range (zoom).
         *
         * @return {number} Start (0-1)
         */
        get: function () {
            return this._start;
        },
        /**
         * Sets start of the current data range (zoom).
         *
         * @ignore Exclude from docs
         * @param {number} value Start (0-1)
         */
        set: function (value) {
            value = $math.round(value, 5);
            //if (1 / (this.end - value) > this.maxZoomFactor) {
            //	value = this.end - 1 / this.maxZoomFactor;
            //}
            if (this._start != value) {
                this._start = value;
                this._startIndex = Math.max(0, Math.floor(this.dataItems.length * value) || 0);
                this.invalidateDataRange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "end", {
        /**
         * Current relative ending position fo the data range (zoom).
         *
         * @return {number} End (0-1)
         */
        get: function () {
            return this._end;
        },
        /**
         * Sets end of the current data range (zoom).
         *
         * @ignore Exclude from docs
         * @param {number} value End (0-1)
         */
        set: function (value) {
            value = $math.round(value, 5);
            //if (1 / (value - this.start) > this.maxZoomFactor) {
            //	value = 1 / this.maxZoomFactor + this.start;
            //}
            if (this._end != value) {
                this._end = value;
                this._endIndex = Math.min(this.dataItems.length, Math.ceil(this.dataItems.length * value) || 0);
                this.invalidateDataRange();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [removeFromInvalids description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Component.prototype.removeFromInvalids = function () {
        _super.prototype.removeFromInvalids.call(this);
        $array.remove(registry.invalidDatas, this);
        $array.remove(registry.invalidSprites, this);
        $array.remove(registry.invalidDataItems, this);
        $array.remove(registry.invalidDataRange, this);
        $array.remove(registry.invalidRawDatas, this);
    };
    Object.defineProperty(Component.prototype, "dataItems", {
        /**
         * Returns a list of source [[DataItem]] objects.
         *
         * @return {OrderedListTemplate} List of data items
         */
        get: function () {
            // @todo Check if we can automatically dispose all of the data items when
            // Component is disposed
            if (!this._dataItems) {
                this._dataItems = new OrderedListTemplate(this.createDataItem());
                this._dataItems.events.on("inserted", this.handleDataItemAdded, this);
                this._dataItems.events.on("removed", this.invalidateDataItems, this);
                this._disposers.push(new ListDisposer(this._dataItems));
                this._disposers.push(this._dataItems.template);
            }
            return this._dataItems;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Processes newly added [[DataItem]] as well as triggers data re-validation.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<DataItem>["inserted"]} event [description]
     */
    Component.prototype.handleDataItemAdded = function (event) {
        event.newValue.component = this;
        this.invalidateDataItems();
    };
    /**
     * removes [[DataItem]] as well as triggers data re-validation.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<DataItem>["inserted"]} event [description]
     */
    Component.prototype.handleDataItemRemoved = function (event) {
        event.oldValue.component = undefined;
        this.invalidateDataItems();
    };
    Object.defineProperty(Component.prototype, "dataMethods", {
        /**
         * [dataMethods description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @deprecated Not used?
         * @param {Dictionary} List of data methods
         */
        get: function () {
            if (!this._dataMethods) {
                this._dataMethods = new Dictionary();
            }
            return this._dataMethods;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Binds a data element's field to a specific field in raw data.
     * For example, for the very basic column chart you'd want to bind a `value`
     * field to a field in data, such as `price`.
     *
     * Some more advanced Components, like [[CandlestickSeries]] need several
     * data fields bound to data, such as ones for open, high, low and close
     * values.
     *
     * @todo Example
     * @param {Key}                       field  Field name
     * @param {this["_dataFields"][Key]}  value  Field name in data
     */
    Component.prototype.bindDataField = function (field, value) {
        this.dataFields[field] = value;
        this.invalidateDataRange();
    };
    /**
     * Invalidates processed data.
     *
     * @ignore Exclude from docs
     */
    Component.prototype.invalidateProcessedData = function () {
        this.resetProcessedRange();
        this.invalidateDataRange();
    };
    /**
     * [resetProcessedRange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Component.prototype.resetProcessedRange = function () {
        this._prevEndIndex = null;
        this._prevStartIndex = null;
    };
    Object.defineProperty(Component.prototype, "dataUsers", {
        /**
         * Returns all other [[Component]] objects that are using this element's
         * data.
         *
         * @ignore Exclude from docs
         * @todo Description (review)
         * @return {List<Component>} [description]
         */
        get: function () {
            var _this = this;
            if (!this._dataUsers) {
                this._dataUsers = new List();
                //this._disposers.push(new ListDisposer(this._dataUsers));
                // TODO better way of handling this? e.g. move into another module ?
                this._disposers.push(new Disposer(function () {
                    // TODO clear the list ?
                    $iter.each(_this._dataUsers.iterator(), function (x) {
                        x.dispose();
                    });
                }));
            }
            return this._dataUsers;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a clone of this element.
     *
     * @return {this} Clone
     */
    Component.prototype.clone = function () {
        var component = _super.prototype.clone.call(this);
        component.dataFields = $utils.copyProperties(this.dataFields, {});
        return component;
    };
    /**
     * Copies all parameters from another [[Component]].
     *
     * @param {Component} source Source Component
     */
    Component.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.data = source.data;
    };
    /**
     * Invalidates the whole element, including all its children, causing
     * complete re-parsing of data and redraw.
     *
     * Use sparingly!
     */
    Component.prototype.reinit = function () {
        this._inited = false;
        this.deepInvalidate();
    };
    /**
     * Add an adapter for data.
     *
     * @return {Export} Exporting
     */
    Component.prototype.getExporting = function () {
        var _export = _super.prototype.getExporting.call(this);
        if (!_export.adapter.has("data", this._exportData, null, this)) {
            _export.adapter.add("data", this._exportData, null, this);
        }
        return _export;
    };
    Component.prototype._exportData = function (arg) {
        arg.data = this.data;
        return arg;
    };
    Component.prototype.setDisabled = function (value) {
        _super.prototype.setDisabled.call(this, value);
        this.invalidateData();
    };
    return Component;
}(Container));
export { Component };
//# sourceMappingURL=Component.js.map