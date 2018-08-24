/**
 * Line series module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { XYSeries, XYSeriesDataItem } from "./XYSeries";
import { visualProperties } from "../../core/Sprite";
import { Container } from "../../core/Container";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { LineSeriesSegment } from "./LineSeriesSegment";
import { ValueAxis } from "../axes/ValueAxis";
import { DateAxis } from "../axes/DateAxis";
import { registry } from "../../core/Registry";
import { Line } from "../../core/elements/Line";
import { Label } from "../../core/elements/Label";
import { Rectangle } from "../../core/elements/Rectangle";
import * as $iter from "../../core/utils/Iterator";
import * as $object from "../../core/utils/Object";
import * as $type from "../../core/utils/Type";
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
    tslib_1.__extends(LineSeriesDataItem, _super);
    /**
     * Constructor
     */
    function LineSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "LineSeriesDataItem";
        return _this;
    }
    return LineSeriesDataItem;
}(XYSeriesDataItem));
export { LineSeriesDataItem };
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
    tslib_1.__extends(LineSeries, _super);
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
        _this.segments = new ListTemplate(_this.createSegment());
        _this.segments.template.applyOnClones = true;
        _this._disposers.push(new ListDisposer(_this.segments));
        _this._disposers.push(_this.segments.template);
        _this._segmentsIterator = new $iter.ListIterator(_this.segments, function () { return _this.segments.create(); });
        _this._segmentsIterator.createNewItems = true;
        _this.className = "LineSeries";
        _this.strokeOpacity = 1;
        _this.fillOpacity = 0;
        _this.connect = true;
        _this.tensionX = 1;
        _this.tensionY = 1;
        _this.segmentsContainer = _this.mainContainer.createChild(Container);
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
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Line Series");
        }
    };
    /**
     * @ignore
     */
    LineSeries.prototype.createSegment = function () {
        return new LineSeriesSegment();
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
    LineSeries.prototype.setInitialWorkingValues = function (dataItem) {
        // this makes data items animate when added
        if (this.appeared && this.visible) {
            var yAxis = this._yAxis.get();
            var xAxis = this._xAxis.get();
            var previousDataItem = this.dataItems.getIndex(dataItem.index - 1);
            dataItem.component = this; // as these values are set before, we don't know component yet
            if (this.baseAxis == xAxis) {
                if (yAxis instanceof ValueAxis) {
                    var initialY = yAxis.minZoomed;
                    if (previousDataItem) {
                        initialY = previousDataItem.values["valueY"].workingValue;
                    }
                    // this makes line animate from previous point to newly added point
                    dataItem.setWorkingValue("valueY", initialY, 0);
                    dataItem.setWorkingValue("valueY", dataItem.values.valueY.value);
                    if (xAxis instanceof DateAxis) {
                        dataItem.setWorkingLocation("dateX", -0.5, 0); // instantly move it to previous
                        dataItem.setWorkingLocation("dateX", 0.5); // animate to it's location
                    }
                }
            }
            if (this.baseAxis == yAxis) {
                if (xAxis instanceof ValueAxis) {
                    var initialX = xAxis.minZoomed;
                    if (previousDataItem) {
                        initialX = previousDataItem.values["valueX"].workingValue;
                    }
                    dataItem.setWorkingValue("valueX", initialX, 0);
                    dataItem.setWorkingValue("valueX", dataItem.values.valueX.value);
                    if (yAxis instanceof DateAxis) {
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
        $iter.each(this.axisRanges.iterator(), function (range) {
            _this.openSegment(0, range);
        });
        // can't use columnsContainer.removeChildren() because with 3d columns we use one container for all columns
        $iter.each(this._segmentsIterator.iterator(), function (segment) {
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
            $object.copyProperties(axisRange.contents, segment, visualProperties);
        }
        else {
            $object.copyProperties(this, segment, visualProperties);
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
                    // this time we only need to know if properties changed, so we don't pass segment
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
        var point = this.getPoint(dataItem, xField, yField, dataItem.workingLocations[xField], dataItem.workingLocations[yField]);
        if (!backwards) {
            dataItem.point = point;
        }
        points.push(point);
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
        if (closeIndex < this._workingEndIndex - 1) {
            this.openSegment(closeIndex, axisRange);
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
        $object.each(itemProperties, function (propertyName, value) {
            //for (let propertyName in itemProperties) {
            //let value: any = itemProperties[propertyName];
            if ($type.hasValue(value)) {
                if (segment) {
                    if (segment.properties[propertyName] != value) {
                        segment[propertyName] = value;
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
        var line = marker.createChild(Line);
        line.shouldClone = false;
        line.copyFrom(this);
        line.x2 = w;
        line.y = h / 2;
        line.visible = true;
        if (this.fillOpacity > 0) {
            var fill = marker.createChild(Rectangle);
            fill.copyFrom(this);
            fill.width = w;
            fill.height = h;
            fill.y = 0;
            fill.strokeOpacity = 0;
            fill.visible = true;
            line.y = 0;
        }
        $iter.eachContinue(this.bullets.iterator(), function (bullet) {
            if (bullet.copyToLegendMarker) {
                // do not copy bullets with labels
                var hasLabels_1 = false;
                $iter.each(bullet.children.iterator(), function (child) {
                    if (child instanceof Label) {
                        hasLabels_1 = true;
                        return true;
                    }
                });
                if (!hasLabels_1) {
                    var clone = bullet.clone();
                    clone.parent = marker;
                    clone.isMeasured = true;
                    clone.tooltipText = undefined;
                    clone.x = w / 2;
                    if (_this.fillOpacity > 0) {
                        clone.y = 0;
                    }
                    else {
                        clone.y = h / 2;
                    }
                    clone.visible = true;
                    // otherwise will not transit to color after hiding
                    if (!$type.hasValue(clone.fill)) {
                        clone.fill = _this.fill;
                    }
                    if (!$type.hasValue(clone.stroke)) {
                        clone.stroke = _this.stroke;
                    }
                    return false;
                }
            }
        });
    };
    return LineSeries;
}(XYSeries));
export { LineSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LineSeries"] = LineSeries;
registry.registeredClasses["LineSeriesDataItem"] = LineSeriesDataItem;
//# sourceMappingURL=LineSeries.js.map