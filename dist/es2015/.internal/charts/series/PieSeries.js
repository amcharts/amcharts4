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
import { Series, SeriesDataItem } from "./Series";
import { Slice } from "../../core/elements/Slice";
import { AxisLabelCircular } from "../axes/AxisLabelCircular";
import { PieTick } from "./PieTick";
import { ListTemplate } from "../../core/utils/List";
import { Container } from "../../core/Container";
import { ColorSet } from "../../core/utils/ColorSet";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import * as $iter from "../../core/utils/Iterator";
import * as $ease from "../../core/utils/Ease";
import * as $type from "../../core/utils/Type";
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
}(SeriesDataItem));
export { PieSeriesDataItem };
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
        _this.colors = new ColorSet();
        _this.colors.step = 1;
        var slicesContainer = _this.createChild(Container);
        slicesContainer.shouldClone = false;
        slicesContainer.isMeasured = false;
        slicesContainer.layout = "none";
        _this.slicesContainer = slicesContainer;
        var ticksContainer = _this.createChild(Container);
        ticksContainer.shouldClone = false;
        ticksContainer.isMeasured = false;
        ticksContainer.layout = "none";
        _this.ticksContainer = ticksContainer;
        var labelsContainer = _this.createChild(Container);
        labelsContainer.shouldClone = false;
        labelsContainer.isMeasured = false;
        labelsContainer.layout = "none";
        _this.labelsContainer = labelsContainer;
        _this.bulletsContainer.toFront();
        _this.initSlice(Slice);
        // Create tick list
        var tick = new PieTick();
        tick.isMeasured = false;
        _this.ticks = new ListTemplate(tick);
        // Create labels list
        // @todo create a labelText/labelHTML properties just like
        // tooltipText/tooltipHTML
        var label = new AxisLabelCircular();
        label.text = "{category}: {value.percent.formatNumber('#.0')}%";
        label.isMeasured = false;
        label.radius = 25;
        label.padding(5, 5, 5, 5);
        label.renderingFrequency = 2;
        _this.labels = new ListTemplate(label);
        // Make all slices focusable
        _this.skipFocusThreshold = 50;
        //let hiddenState = this.hiddenState;
        //hiddenState.properties.opacity = 1;
        //hiddenState.properties.endAngle = -90;
        //hiddenState.properties.startAngle = -90;
        var defaultState = _this.defaultState;
        defaultState.transitionEasing = $ease.sinOut;
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
        if (!$type.hasValue(this.readerTitle)) {
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
        this.slices = new ListTemplate(slice);
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
        this._arcRect = $math.getArcRect(this.startAngle, this.endAngle);
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
                if ($type.isNumber(dataItem.radiusValue)) {
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
            this.setPropertyValue("startAngle", $math.normalizeAngle(value), true);
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
        $iter.each(marker.children.iterator(), function (child) {
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
        if ($type.isNumber(bullet.locationX)) {
            location = bullet.locationX;
        }
        if ($type.isNumber(bullet.locationY)) {
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
        $iter.each(dataItem.bullets.iterator(), function (a) {
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
}(Series));
export { PieSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PieSeries"] = PieSeries;
registry.registeredClasses["PieSeriesDataItem"] = PieSeriesDataItem;
//# sourceMappingURL=PieSeries.js.map