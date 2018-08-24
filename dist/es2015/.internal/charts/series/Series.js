/**
 * Functionality for any series-based elements, like Line Series (graphs),
 * Pie slice lists, etc.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Component } from "../../core/Component";
import { Sprite } from "../../core/Sprite";
import { List, ListTemplate, ListDisposer } from "../../core/utils/List";
import { Dictionary } from "../../core/utils/Dictionary";
import { DataItem } from "../../core/DataItem";
import { Container } from "../../core/Container";
import { Tooltip } from "../../core/elements/Tooltip";
import { Bullet } from "../elements/Bullet";
import { LegendSettings } from "../Legend";
import { options } from "../../core/Options";
import { registry } from "../../core/Registry";
import { Color } from "../../core/utils/Color";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $ease from "../../core/utils/Ease";
import * as $utils from "../../core/utils/Utils";
import * as $object from "../../core/utils/Object";
import * as $type from "../../core/utils/Type";
import * as $array from "../../core/utils/Array";
import * as $colors from "../../core/utils/Colors";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[Series]].
 *
 * @see {@link DataItem}
 */
var SeriesDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(SeriesDataItem, _super);
    /**
     * Constructor
     */
    function SeriesDataItem() {
        var _this = _super.call(this) || this;
        /**
         * A dictionary of data items bullets, where key is uid of a bullet template.
         *
         * @ignore Exclude from docs
         * @todo review description
         * @type {Dictionary}
         */
        _this.bullets = new Dictionary();
        _this.className = "SeriesDataItem";
        //@todo Should we make `bullets` list disposable?
        //this._disposers.push(new DictionaryDisposer(this.bullets));
        _this.values.value = {};
        _this.values.value = {};
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(SeriesDataItem.prototype, "value", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.value.value;
        },
        /**
         * data items's numeric value.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("value", value);
        },
        enumerable: true,
        configurable: true
    });
    return SeriesDataItem;
}(DataItem));
export { SeriesDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines base class for any kind of serial data.
 *
 * @see {@link ISeriesEvents} for a list of available Events
 * @see {@link ISeriesAdapters} for a list of available Adapters
 * @todo Separate axis-related stuff to some other class so that MapSeries would not have unrelated stuff
 */
var Series = /** @class */ (function (_super) {
    tslib_1.__extends(Series, _super);
    /**
     * Constructor
     */
    function Series() {
        var _this = _super.call(this) || this;
        /**
         * Should this series excluded from the axis scale calculations?
         *
         * @default false
         * @type {boolean}
         */
        _this._ignoreMinMax = false;
        /**
         * Should series' bullets?
         *
         * @default true
         * @type {boolean}
         */
        _this._showBullets = true;
        /**
         * Settings for the appearance of the related legend items.
         */
        _this.legendSettings = new LegendSettings();
        /**
         * Lowest overal values by type.
         *
         * @type {Dictionary}
         */
        _this._tmin = new Dictionary();
        /**
         * Highest overal values by type.
         *
         * @type {Dictionary}
         */
        _this._tmax = new Dictionary();
        /**
         * Lowest values in current selection by type.
         *
         * @type {Dictionary}
         */
        _this._smin = new Dictionary();
        /**
         * Highest values in current selection by type.
         *
         * @type {Dictionary}
         */
        _this._smax = new Dictionary();
        /**
         * [dataItemsByAxis description]
         *
         * Both by category and date.
         *
         * @ignore Exclude from docs
         * @todo Description
         * @type {Dictionary}
         */
        _this.dataItemsByAxis = new Dictionary();
        /**
         * Normally series items are focusable using keyboard, so that people can
         * select them with a TAB key. However, if there are a lot of data points on
         * screen it might be long and useless to tab through all o fthem.
         *
         * This is where `skipFocusThreshold` comes in. If there are more items than
         * the value set here, we will not make those focusable and rather let screen
         * reader software rely on the series summary, or authors provide alternative
         * detailed information display, such as HTML table.
         *
         * Different series might have different threshold defaults.
         *
         * @type {Number}
         */
        _this.skipFocusThreshold = 20;
        /**
         * flag which is set to true when initial animation is finished
         * @ignore
         */
        _this._appeared = false;
        /**
         * As calculating totals is expensive operation and not often needed, by default we do not do it. In case you use percent for your charts, you must set this to true.
         * Pie chart, which uses percent sets this to true by default.
         * @todo review description
         * @type {boolean}
         */
        _this.calculatePercent = false;
        _this.className = "Series";
        _this.isMeasured = false;
        _this.layout = "none";
        _this.shouldClone = false;
        _this.axisRanges = new List();
        _this.axisRanges.events.on("inserted", _this.processAxisRange, _this);
        _this.minBulletDistance = 0; // otherwise we'll have a lot of cases when people won't see bullets and think it's a bug
        _this.mainContainer = _this.createChild(Container);
        _this.mainContainer.shouldClone = false;
        _this.mainContainer.mask = _this.createChild(Sprite);
        _this._disposers.push(_this.mainContainer);
        // all bullets should go on top of lines/fills. So we add a separate container for bullets and later set it's parent to chart.bulletsContainer
        _this.bulletsContainer = _this.mainContainer.createChild(Container);
        _this.bulletsContainer.shouldClone = false;
        _this.bulletsContainer.layout = "none";
        _this.tooltip = new Tooltip();
        _this.tooltip.virtualParent = _this;
        _this._disposers.push(_this.tooltip);
        _this.hiddenState.transitionEasing = $ease.cubicIn;
        // this data item holds sums, averages, etc
        _this.dataItem = _this.createDataItem();
        _this.dataItem.component = _this;
        // Apply accessibility
        _this.role = "group";
        _this.appeared = false;
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    Series.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Series");
        }
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {SeriesDataItem} Data Item
     */
    Series.prototype.createDataItem = function () {
        return new SeriesDataItem();
    };
    Object.defineProperty(Series.prototype, "chart", {
        /**
         * @return {this} Chart
         */
        get: function () {
            return this._chart;
        },
        /**
         * Chart series is used on.
         *
         * @param {this["_chart"]}  value  Chart
         */
        set: function (value) {
            this._chart = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Performs initial animation of the series after data validation.
     *
     * @ignore Exclude from docs
     */
    Series.prototype.appear = function () {
        var _this = this;
        this._appeared = false;
        this.hide(0);
        var animation = this.show();
        if (animation && !animation.isDisposed()) {
            animation.events.once("animationended", function () {
                _this.appeared = true;
            });
        }
        else {
            this.appeared = true;
        }
    };
    /**
     * Fades in bullet container and related elements.
     *
     * @ignore Exclude from docs
     * @param  {number}     duration  Animation duration (ms)
     * @return {Animation}            Animation
     */
    Series.prototype.showReal = function (duration) {
        this.bulletsContainer.show(duration);
        return _super.prototype.showReal.call(this, duration);
    };
    /**
     * Fades out bullet container and related elements.
     *
     * @ignore Exclude from docs
     * @param  {number}     duration  Animation duration (ms)
     * @return {Animation}            Animation
     */
    Series.prototype.hideReal = function (duration) {
        this.bulletsContainer.hide(duration);
        return _super.prototype.hideReal.call(this, duration);
    };
    /**
     * Positions bullet.
     *
     * @param {Bullet}  bullet  Bullet
     */
    Series.prototype.positionBullet = function (bullet) {
        // Placeholder method for extending classes to override.
    };
    /**
     * Decorates newly created bullet after it has been instert into the list.
     *
     * @param {IListEvents<Bullet>["inserted"]}  event  List event
     * @todo investigate why itemReaderText is undefined
     */
    Series.prototype.processBullet = function (event) {
        var bullet = event.newValue;
        // Add accessibility options to bullet
        // If there are relatively few bullets, make them focusable
        if (this.itemsFocusable()) {
            bullet.focusable = true;
        }
    };
    /**
     * removes bullets
     *
     * @param {IListEvents<Bullet>["inserted"]}  event  List event
     */
    Series.prototype.removeBullet = function (event) {
        var bullet = event.oldValue;
        this.dataItems.each(function (dataItem) {
            var eachBullet = dataItem.bullets.getKey(bullet.uid);
            if (eachBullet) {
                eachBullet.dispose();
            }
        });
        this.invalidate();
    };
    /**
     * Validates data items.
     *
     * @ignore Exclude from docs
     */
    Series.prototype.validateDataItems = function () {
        _super.prototype.validateDataItems.call(this);
        this.processValues(false);
    };
    /**
     * Returns first value for the specific key in the series.
     *
     * @param  {string}  key  Key
     * @return {number}       Value
     * @todo Description
     * @todo Convert to propert object property iterator
     */
    Series.prototype.getFirstValue = function (key, startIndex) {
        // find first
        /*
        return $iter.findMap(this.dataItems.iterator(), (dataItem) => {
            for (let key in dataItem.values) {
                let value: number = dataItem.values[key].workingValue;
                if ($type.isNumber(value)) {
                    return value;
                }
            }

            return null;
        });*/
        if (startIndex > 0 && startIndex < this.dataItems.length - 1) {
            startIndex++;
        }
        for (var i = startIndex; i >= 0; i--) {
            var dataItem = this.dataItems.getIndex(i);
            var value = dataItem.values[key].workingValue;
            if ($type.isNumber(value)) {
                return value;
            }
        }
        return null;
    };
    /**
     * [rangeChangeUpdate description]
     *
     * @todo Description
     */
    Series.prototype.rangeChangeUpdate = function () {
        _super.prototype.rangeChangeUpdate.call(this);
        this.processValues(true);
    };
    /**
     * [processValues description]
     *
     * @todo Description
     * @todo Convert to propert object property iterator
     * @param {OrderedList<this["_dataItem"]>} dataItems [description]
     */
    Series.prototype.processValues = function (working) {
        var dataItems = this.dataItems;
        var count = {};
        var sum = {};
        var low = {};
        var high = {};
        var open = {};
        var close = {};
        var previous = {};
        var first = {};
        //let duration: number = 0; // todo: check if series uses selection.change or selection.change.percent and set duration to interpolationduration
        var startIndex = $math.max(0, this._workingStartIndex);
        var endIndex = $math.min(this._workingEndIndex, this.dataItems.length);
        if (!$type.isNumber(startIndex)) {
            startIndex = 0;
        }
        if (!$type.isNumber(endIndex)) {
            endIndex = this.dataItems.length;
        }
        this.bulletsContainer.children.each(function (sprite) {
            sprite.__disabled = true;
        });
        // it's ok, we loop trough all the data and check if i is within start/end index later
        //$iter.each($iter.indexed(dataItems.iterator()), (a) => {
        //	let i = a[0];
        //	let dataItem = a[1];
        for (var i = startIndex; i < endIndex; i++) {
            var dataItem_1 = dataItems.getIndex(i);
            for (var key in dataItem_1.values) {
                var value = dataItem_1.values[key].workingValue;
                //if (i >= startIndex && i <= endIndex) { // do not add to count, sum etc if it is not within start/end index
                if ($type.isNumber(value)) {
                    // count values
                    if (!$type.isNumber(count[key])) {
                        count[key] = 0;
                    }
                    count[key]++;
                    // sum values
                    if (!$type.isNumber(sum[key])) {
                        sum[key] = 0;
                    }
                    sum[key] += value;
                    // open
                    if (!$type.isNumber(open[key])) {
                        open[key] = value;
                    }
                    // close
                    close[key] = value;
                    // low
                    if (!$type.isNumber(low[key])) {
                        low[key] = value;
                    }
                    else {
                        if (low[key] > value) {
                            low[key] = value;
                        }
                    }
                    // high
                    if (!$type.isNumber(high[key])) {
                        high[key] = value;
                    }
                    else {
                        if (high[key] < value) {
                            high[key] = value;
                        }
                    }
                    if (!$type.isNumber(first[key])) {
                        first[key] = this.getFirstValue(key, startIndex);
                    }
                    // change
                    dataItem_1.setCalculatedValue(key, value - first[key], "change");
                    // change from start percent
                    // will fail if first value is 0
                    dataItem_1.setCalculatedValue(key, (value - first[key]) / first[key] * 100, "changePercent");
                    // previous change
                    var prevValue = previous[key];
                    if (!$type.isNumber(prevValue)) {
                        prevValue = value;
                    }
                    dataItem_1.setCalculatedValue(key, value - prevValue, "previousChange");
                    // previous change percent
                    dataItem_1.setCalculatedValue(key, (value - prevValue) / prevValue * 100, "previousChangePercent");
                    // save previous
                    previous[key] = value;
                }
            }
        }
        if (this.calculatePercent) {
            var _loop_1 = function (i) {
                var dataItem_2 = dataItems.getIndex(i);
                $object.each(dataItem_2.values, function (key) {
                    var ksum = sum[key];
                    var value = dataItem_2.values[key].workingValue;
                    if ($type.isNumber(value) && ksum > 0) {
                        // this hack is made in order to make it possible to animate single slice to 0
                        // if there is only one slice left, percent value is always 100%, so it won't animate
                        // so we use real value of a slice instead of current value
                        if (value == ksum) {
                            ksum = dataItem_2.values[key].value;
                        }
                        var percent = void 0; // used to be = 0; but no good for pie chart
                        percent = value / ksum * 100;
                        dataItem_2.setCalculatedValue(key, percent, "percent");
                    }
                });
            };
            for (var i = startIndex; i < endIndex; i++) {
                _loop_1(i);
            }
        }
        // calculate one before first (cant do that in cycle, as we don't know open yet
        // when drawing line chart we should draw line to the invisible data point to the left, otherwise the line will always look like it starts from the selected point
        // so we do startIndex - 1
        if (startIndex > 0) {
            var zeroItem_1 = dataItems.getIndex(startIndex - 1);
            $object.each(zeroItem_1.values, function (key) {
                //for (let key in zeroItem.values) {
                var value = zeroItem_1.values[key].value;
                // change
                zeroItem_1.setCalculatedValue(key, value - open[key], "change");
                // change percent
                zeroItem_1.setCalculatedValue(key, (value - open[key]) / open[key] * 100, "changePercent");
                //}
            });
        }
        // we save various data like sum, average to dataPoint of the series
        var dataItem = this.dataItem;
        $object.each(dataItem.values, function (key) {
            dataItem.setCalculatedValue(key, sum[key], "sum");
            dataItem.setCalculatedValue(key, sum[key] / count[key], "average");
            dataItem.setCalculatedValue(key, open[key], "open");
            dataItem.setCalculatedValue(key, close[key], "close");
            dataItem.setCalculatedValue(key, low[key], "low");
            dataItem.setCalculatedValue(key, high[key], "high");
            dataItem.setCalculatedValue(key, count[key], "count");
        });
    };
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    Series.prototype.validate = function () {
        $iter.each(this.axisRanges.iterator(), function (axisRange) {
            //axisRange.contents.disposeChildren(); // not good for columns, as they are reused
            //			axisRange.appendChildren();
            axisRange.validate();
        });
        _super.prototype.validate.call(this);
        this.bulletsContainer.fill = this.fill;
        this.bulletsContainer.stroke = this.stroke;
        this.updateTooltipBounds();
    };
    /**
     * @ignore
     */
    Series.prototype.updateTooltipBounds = function () {
        if (this.topParent) {
            this.tooltip.setBounds({ x: 0, y: 0, width: this.topParent.maxWidth, height: this.topParent.maxHeight });
        }
    };
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {SeriesDataItem}  dataItem  Data item
     */
    Series.prototype.validateDataElement = function (dataItem) {
        var _this = this;
        _super.prototype.validateDataElement.call(this, dataItem);
        if (this._showBullets) {
            $iter.each(this.bullets.iterator(), function (bulletTemplate) {
                // always better to use the same, this helps to avoid redrawing
                var bullet = dataItem.bullets.getKey(bulletTemplate.uid);
                if (!bullet) {
                    bullet = bulletTemplate.clone();
                }
                var currentDataItem = bullet.dataItem;
                if (currentDataItem != dataItem) {
                    // set to undefined in order not to reuse
                    if (currentDataItem) {
                        currentDataItem.bullets.setKey(bulletTemplate.uid, undefined);
                    }
                    dataItem.addSprite(bullet);
                    if (bullet.isDynamic) {
                        dataItem.events.on("workingvaluechanged", bullet.deepInvalidate, bullet);
                        //dataItem.events.on("calculatedvaluechanged", bullet.deepInvalidate, bullet);
                        _this.dataItem.events.on("workingvaluechanged", bullet.deepInvalidate, bullet);
                    }
                    bullet.deepInvalidate();
                }
                bullet.parent = _this.bulletsContainer;
                bullet.visible = true;
                dataItem.bullets.setKey(bulletTemplate.uid, bullet);
                // Add accessibility to bullet
                var readerText = _this.itemReaderText || ("{" + bullet.xField + "}: {" + bullet.yField + "}");
                if (bullet.focusable) {
                    bullet.events.once("focus", function (ev) {
                        bullet.readerTitle = _this.populateString(readerText, bullet.dataItem);
                    });
                    bullet.events.once("blur", function (ev) {
                        bullet.readerTitle = "";
                    });
                }
                if (bullet.hoverable) {
                    bullet.events.once("over", function (ev) {
                        bullet.readerTitle = _this.populateString(readerText, bullet.dataItem);
                    });
                    bullet.events.once("out", function (ev) {
                        bullet.readerTitle = "";
                    });
                }
                // pass max w/h so we'd know if we should show/hide somethings
                bullet.maxWidth = dataItem.itemWidth;
                bullet.maxHeight = dataItem.itemHeight;
                bullet.__disabled = false;
                _this.positionBullet(bullet);
            });
        }
    };
    /**
     * [handleDataItemWorkingValueChange description]
     *
     * @todo Description
     */
    Series.prototype.handleDataItemWorkingValueChange = function (event) {
        this.invalidateProcessedData();
    };
    Object.defineProperty(Series.prototype, "ignoreMinMax", {
        /**
         * @return {boolean} Exclude from calculations?
         */
        get: function () {
            return this._ignoreMinMax;
        },
        /**
         * Should this series excluded from the axis scale calculations?
         *
         * @default false
         * @param {boolean}  value  Exclude from calculations?
         */
        set: function (value) {
            this._ignoreMinMax = value;
            this.invalidateDataItems();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Create a mask for the series.
     *
     * @ignore Exclude from docs
     */
    Series.prototype.createMask = function () {
        // A placeholder method for extending classes to override.
    };
    /**
     * Process axis range after it has been added to the list.
     *
     * @param {IListEvents<AxisDataItem>["inserted"]}  event  Event
     */
    Series.prototype.processAxisRange = function (event) {
        // create container if not existing
        if (!this.rangesContainer) {
            this.rangesContainer = this.createChild(Container);
            this.rangesContainer.shouldClone = false;
            this.rangesContainer.isMeasured = false;
        }
        var axisRange = event.newValue;
        if (axisRange) {
            axisRange.contents.parent = this.rangesContainer;
            axisRange.isRange = true;
        }
    };
    /**
     * [getAxisField description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {Axis}    axis  [description]
     * @return {string}        [description]
     */
    Series.prototype.getAxisField = function (axis) {
        return;
    };
    /**
     * Shows the tooltip at specific position.
     *
     * @ignore Exclude from docs
     * @param {number}  xPosition  X
     * @param {number}  yPosition  Y
     */
    Series.prototype.showTooltipAtPosition = function (xPosition, yPosition) {
        // Placeholder method for extending classes to override.
    };
    Object.defineProperty(Series.prototype, "minBulletDistance", {
        /**
         * @return {number} Distance (px)
         */
        get: function () {
            return this.getPropertyValue("minBulletDistance");
        },
        /**
         * Minimal distance between two adjacent bullets in pixels.
         *
         * If bullet is closer, it will be skipped and not shown.
         *
         * This allows to avoid crammed up graphs wil a lot of bullets.
         *
         * @default 50
         * @param {number}  value  Distance (px)
         */
        set: function (value) {
            this.setPropertyValue("minBulletDistance", value);
            this.invalidateDataRange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Series.prototype, "bullets", {
        /**
         * A list of bullets that will be added to each and every items in the
         * series.
         *
         * You can push any object that is a descendant of a [[Bullet]] here. All
         * items added to this list will be copied and used as a bullet on all data
         * items, including their properties, events, etc.
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/bullets/} for more info about the concept of Bullets
         * @return {ListTemplate<Bullet>} List of bullets.
         */
        get: function () {
            if (!this._bullets) {
                this._bullets = new ListTemplate(new Bullet());
                this._bullets.template.virtualParent = this;
                this._bullets.events.on("inserted", this.processBullet, this);
                this._bullets.events.on("removed", this.removeBullet, this);
                this._disposers.push(new ListDisposer(this._bullets));
                this._disposers.push(this._bullets.template);
            }
            return this._bullets;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Destroys series and related elements.
     */
    Series.prototype.dispose = function () {
        if (!this._disposed) {
            _super.prototype.dispose.call(this);
            this.removeDispose(this.bulletsContainer);
            this.dataItem.dispose();
        }
    };
    /**
     * Binds related legend data item's visual settings to this series' visual
     * settings.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Legend item container
     */
    Series.prototype.createLegendMarker = function (marker) {
        // This is a placeholder method for extending classes to override.
    };
    Object.defineProperty(Series.prototype, "hiddenInLegend", {
        /**
         * @return {boolean} Hidden in legend?
         */
        get: function () {
            return this.getPropertyValue("hiddenInLegend");
        },
        /**
         * Should the series be hidden in legend?
         *
         * @param {boolean} value Hidden in legend?
         */
        set: function (value) {
            this.setPropertyValue("hiddenInLegend", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Series.prototype, "name", {
        /**
         * @return {string} Name
         */
        get: function () {
            return this.adapter.apply("name", this._title);
        },
        /**
         * Series' name.
         *
         * @param {string}  value  Name
         */
        set: function (value) {
            this._title = value;
            this.readerTitle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Series.prototype, "itemReaderText", {
        /**
         * @return {string} Screen reader text template
         */
        get: function () {
            // Get explicitly set reader text
            var readerText = this._itemReaderText;
            // Not set? Let's try something else
            if (!readerText) {
                // Tooltip text?
                if (this.tooltipText) {
                    readerText = $utils.plainText(this.tooltipText);
                }
                else if (this.tooltipHTML) {
                    readerText = $utils.plainText(this.tooltipHTML);
                }
            }
            return this.adapter.apply("itemReaderText", readerText);
        },
        /**
         * Screen reader text to be applied to each individual data item, such
         * as bullets, columns or slices.
         *
         * The template can contain field reference meta codes, i.e. `{dateX}`,
         * `{valueY}`, etc.
         *
         * Any text formatting options, e.g. `[bold]` will be ignored.
         *
         * @param {string} value Screen reader text template
         */
        set: function (value) {
            this._itemReaderText = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns if number of data items in the series are beyond non-focusable
     * count and should not be available for TAB-through.
     *
     * @ignore Exclude from docs
     * @return {boolean} Items focusable?
     */
    Series.prototype.itemsFocusable = function () {
        return this.dataItems.length >= this.skipFocusThreshold ? false : true;
    };
    Object.defineProperty(Series.prototype, "legendDataItem", {
        /**
         * @return {LegendDataItem<Series, ISeriesEvents>} Data item
         */
        get: function () {
            return this._legendDataItem;
        },
        /**
         * Legend data item that corresponds to this series.
         *
         * @param {LegendDataItem<Series, ISeriesEvents>}  value  Data item
         */
        set: function (value) {
            this._legendDataItem = value;
            this._legendDataItem.itemContainer.deepInvalidate();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates corresponding legend data item with current values.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    Series.prototype.updateLegendValue = function (dataItem) {
        // if this series has legend item
        if (this.legendDataItem) {
            var legendSettings = this.legendSettings;
            var legendDataItem = this.legendDataItem;
            var label = legendDataItem.label;
            var valueLabel = legendDataItem.valueLabel;
            // update legend
            if (dataItem) {
                if (valueLabel) {
                    if (legendSettings.itemValueText) {
                        valueLabel.text = legendSettings.itemValueText;
                    }
                    valueLabel.dataItem = dataItem;
                }
                if (label) {
                    if (legendSettings.itemLabelText) {
                        label.text = legendSettings.itemLabelText;
                    }
                    label.dataItem = this.dataItem;
                }
            }
            else {
                if (label) {
                    // if itemLabelText is set, means we have to reset label even if labelText is not set
                    if (legendSettings.labelText || legendSettings.itemLabelText != undefined) {
                        label.text = legendSettings.labelText;
                    }
                    label.dataItem = this.dataItem;
                }
                if (valueLabel) {
                    if (legendSettings.valueText || legendSettings.itemValueText != undefined) {
                        valueLabel.text = legendSettings.valueText;
                    }
                    valueLabel.dataItem = this.dataItem;
                }
            }
        }
    };
    /**
     * Copies all properties from another instance of [[Series]].
     *
     * @param {Series}  source  Source series
     */
    Series.prototype.copyFrom = function (source) {
        this.bullets.copyFrom(source.bullets);
        this.bulletsContainer.copyFrom(source.bulletsContainer);
        _super.prototype.copyFrom.call(this, source);
    };
    /**
     * Displays a modal or console message with error, and halts any further
     * processing of this element.
     *
     * @param {Error} e Error
     */
    Series.prototype.raiseCriticalError = function (e) {
        this._chart.modal.content = e.message;
        this._chart.modal.closable = false;
        this._chart.modal.open();
        this._chart.disabled = true;
        if (options.verbose) {
            console.log(e);
        }
    };
    /**
     * Applies filters to the element.
     *
     * @ignore Exclude from docs
     */
    Series.prototype.applyFilters = function () {
        _super.prototype.applyFilters.call(this);
        this.bulletsContainer.filters.clear();
        this.bulletsContainer.filters.copyFrom(this.filters);
    };
    Object.defineProperty(Series.prototype, "heatRules", {
        /**
         * @todo Description
         */
        get: function () {
            var _this = this;
            if (!this._heatRules) {
                this._heatRules = new List();
                this._heatRules.events.on("inserted", function (event) {
                    var heatRule = event.newValue;
                    var target = heatRule.target;
                    if (target) {
                        var dataField_1 = heatRule.dataField;
                        if (!$type.hasValue(dataField_1)) {
                            dataField_1 = "value";
                        }
                        var min_1 = heatRule.min;
                        var max_1 = heatRule.max;
                        var seriesDataItem_1 = _this.dataItem;
                        var property_1 = heatRule.property;
                        var minValue = $type.toNumber(heatRule.minValue);
                        var maxValue = $type.toNumber(heatRule.maxValue);
                        if (!$type.isNumber(minValue) && !$type.isNumber(maxValue)) {
                            _this.dataItem.events.on("calculatedvaluechanged", function (event) {
                                if (event.property == dataField_1) {
                                    $iter.each(_this.dataItems.iterator(), function (dataItem) {
                                        var foundSprite = false;
                                        $array.each(dataItem.sprites, function (sprite) {
                                            if (sprite.clonedFrom == target) {
                                                var anySprite = sprite;
                                                anySprite[property_1] = anySprite[property_1];
                                                foundSprite = true;
                                            }
                                        });
                                        if (!foundSprite) {
                                            $array.each(dataItem.sprites, function (sprite) {
                                                if (sprite instanceof Container) {
                                                    $iter.each(sprite.children.iterator(), function (child) {
                                                        if (child.className == target.className) {
                                                            var anyChild = child;
                                                            anyChild[property_1] = anyChild[property_1];
                                                        }
                                                        // giveup here
                                                        else if (child instanceof Container) {
                                                            child.deepInvalidate();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        _this.dataItems.template.events.on("workingvaluechanged", function (event) {
                            if (event.property == dataField_1) {
                                var dataItem = event.target;
                                var foundSprite_1 = false;
                                $array.each(dataItem.sprites, function (sprite) {
                                    if (sprite.clonedFrom == target) {
                                        var anySprite = sprite;
                                        anySprite[property_1] = anySprite[property_1];
                                        foundSprite_1 = true;
                                    }
                                });
                                if (!foundSprite_1) {
                                    $array.each(dataItem.sprites, function (sprite) {
                                        if (sprite instanceof Container) {
                                            $iter.each(sprite.children.iterator(), function (child) {
                                                if (child.className == target.className) {
                                                    var anyChild = child;
                                                    anyChild[property_1] = anyChild[property_1];
                                                }
                                                // givup here
                                                else if (child instanceof Container) {
                                                    child.deepInvalidate();
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                        target.adapter.add(property_1, function (value, ruleTarget, property) {
                            var minValue = $type.toNumber(heatRule.minValue);
                            var maxValue = $type.toNumber(heatRule.maxValue);
                            if (ruleTarget instanceof Sprite) {
                                var anySprite = ruleTarget;
                                var propertyField = anySprite.propertyFields[property];
                                if (propertyField && ruleTarget.dataItem) {
                                    var dataContext = ruleTarget.dataItem.dataContext;
                                    if (dataContext && $type.hasValue(dataContext[propertyField])) {
                                        return value;
                                    }
                                }
                            }
                            var dataItem = ruleTarget.dataItem;
                            if (!$type.isNumber(minValue)) {
                                minValue = seriesDataItem_1.values[dataField_1].low;
                            }
                            if (!$type.isNumber(maxValue)) {
                                maxValue = seriesDataItem_1.values[dataField_1].high;
                            }
                            if (dataItem) {
                                var workingValue = dataItem.values[dataField_1].workingValue;
                                if ($type.hasValue(min_1) && $type.hasValue(max_1) && $type.isNumber(minValue) && $type.isNumber(maxValue) && $type.isNumber(workingValue)) {
                                    var percent = (workingValue - minValue) / (maxValue - minValue);
                                    if ($type.isNumber(min_1)) {
                                        return min_1 + (max_1 - min_1) * percent;
                                    }
                                    else if (min_1 instanceof Color) {
                                        return new Color($colors.interpolate(min_1.rgb, max_1.rgb, percent));
                                    }
                                }
                            }
                            return value;
                        });
                    }
                });
            }
            return this._heatRules;
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
    Series.prototype.processConfig = function (config) {
        var heatRules;
        if (config) {
            // Set up bullets
            if ($type.hasValue(config.bullets) && $type.isArray(config.bullets)) {
                for (var i = 0, len = config.bullets.length; i < len; i++) {
                    var bullets = config.bullets[i];
                    if (!$type.hasValue(bullets.type)) {
                        bullets.type = "Bullet";
                    }
                }
            }
            // Let's take heatRules out of the config, so that we can process
            // them later, when bullets are already there
            if ($type.hasValue(config.heatRules) && $type.isArray(config.heatRules)) {
                heatRules = config.heatRules;
                delete config.heatRules;
            }
        }
        _super.prototype.processConfig.call(this, config);
        // Process heat rules again, when all other lements are ready
        if (heatRules) {
            for (var i = 0, len = heatRules.length; i < len; i++) {
                var rule = heatRules[i];
                // Resolve target
                var target = this;
                if ($type.hasValue(rule.target) && $type.isString(rule.target)) {
                    // Check if we can find this element by id
                    if (this.map.hasKey(rule.target)) {
                        target = this.map.getKey(rule.target);
                    }
                    else {
                        var parts = rule.target.split(".");
                        for (var x = 0; x < parts.length; x++) {
                            if (target instanceof List) {
                                target = target.getIndex($type.toNumber(parts[x]));
                            }
                            else {
                                target = target[parts[x]];
                            }
                        }
                    }
                }
                rule.target = target;
                // Resolve colors and percents
                if ($type.hasValue(rule.min)) {
                    rule.min = this.maybeColorOrPercent(rule.min);
                }
                if ($type.hasValue(rule.max)) {
                    rule.max = this.maybeColorOrPercent(rule.max);
                }
            }
            _super.prototype.processConfig.call(this, {
                heatRules: heatRules
            });
        }
    };
    Object.defineProperty(Series.prototype, "appeared", {
        get: function () {
            return this._appeared;
        },
        /**
         * flag which is set to true when initial animation is finished. If you set it to false, the series will animate on next validate.
         * @ignore
         */
        set: function (value) {
            var _this = this;
            if (value === false) {
                this.events.once("beforevalidated", function () {
                    if (_this.visible == false) {
                        _this.hide(0);
                        _this.appeared = true;
                    }
                    else {
                        _this.appear();
                    }
                }, this);
            }
            this._appeared = value;
        },
        enumerable: true,
        configurable: true
    });
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
    Series.prototype.configOrder = function (a, b) {
        if (a == b) {
            return 0;
        }
        // Must come last
        else if (a == "heatRules") {
            return 1;
        }
        else if (b == "heatRules") {
            return -1;
        }
        else {
            return _super.prototype.configOrder.call(this, a, b);
        }
    };
    return Series;
}(Component));
export { Series };
/**
 * Register class, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Series"] = Series;
registry.registeredClasses["SeriesDataItem"] = SeriesDataItem;
//# sourceMappingURL=Series.js.map