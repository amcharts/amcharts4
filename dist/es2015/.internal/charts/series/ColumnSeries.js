/**
 * Column series module.
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
import { Dictionary } from "../../core/utils/Dictionary";
import { ValueAxis } from "../axes/ValueAxis";
import { CategoryAxis } from "../axes/CategoryAxis";
import { registry } from "../../core/Registry";
import { Column } from "../elements/Column";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
import { percent } from "../../core/utils/Percent";
import * as $math from "../../core/utils/Math";
import * as $object from "../../core/utils/Object";
import * as $iter from "../../core/utils/Iterator";
import * as $array from "../../core/utils/Array";
import * as $type from "../../core/utils/Type";
import { Disposer } from "../../core/utils/Disposer";
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
    tslib_1.__extends(ColumnSeriesDataItem, _super);
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
        var _this = this;
        if (this._column && column != this._column) {
            $array.remove(this.sprites, this._column);
        }
        this._column = column;
        if (column) {
            var prevDataItem = column.dataItem;
            if (prevDataItem && prevDataItem != this) {
                prevDataItem.column = undefined;
            }
            this.addSprite(column);
            this._disposers.push(new Disposer(function () {
                _this.component.columns.removeValue(column);
            }));
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
                this._rangesColumns = new Dictionary();
            }
            return this._rangesColumns;
        },
        enumerable: true,
        configurable: true
    });
    return ColumnSeriesDataItem;
}(XYSeriesDataItem));
export { ColumnSeriesDataItem };
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
    tslib_1.__extends(ColumnSeries, _super);
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
        _this.width = percent(100);
        _this.height = percent(100);
        _this.strokeOpacity = 0;
        _this.fillOpacity = 1;
        _this.clustered = true;
        var columnsContainer = _this.mainContainer.createChild(Container);
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
        if (!$type.hasValue(this.readerTitle)) {
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
        $iter.each(baseAxisSeries.iterator(), function (series) {
            if (series instanceof ColumnSeries) {
                if (_this.baseAxis == series.baseAxis) {
                    if ((!series.stacked && series.clustered) || clusterCount === 0) {
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
        $iter.each(this.columns.iterator(), function (column) {
            if (column.dataItem.index < _this.startIndex || column.dataItem.index >= _this.endIndex) {
                column.__disabled = true;
            }
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
        var maxWidth = template.maxWidth;
        var maxHeight = template.maxHeight;
        // two category axes
        if ((this.xAxis instanceof CategoryAxis) && (this.yAxis instanceof CategoryAxis)) {
            startLocation = 0;
            endLocation = 1;
            if (!$type.isNaN(percentWidth)) {
                var offset = $math.round((endLocation - startLocation) * (1 - percentWidth / 100) / 2, 5);
                startLocation += offset;
                endLocation -= offset;
            }
            l = this.xAxis.getX(dataItem, xOpenField, startLocation);
            r = this.xAxis.getX(dataItem, xField, endLocation);
            // in case width is set in pixels
            if ($type.isNaN(percentWidth)) {
                var offset = ((r - l) - pixelWidth) / 2;
                l += offset;
                r -= offset;
            }
            // in case max width is set in pixels
            if (!$type.isNaN(maxWidth)) {
                var offset = ((r - l) - maxWidth) / 2;
                l += offset;
                r -= offset;
            }
            startLocation = 0;
            endLocation = 1;
            if (!$type.isNaN(percentHeight)) {
                var offset = $math.round((1 - percentHeight / 100) / 2, 5);
                startLocation += offset;
                endLocation -= offset;
            }
            t = this.yAxis.getY(dataItem, yOpenField, startLocation);
            b = this.yAxis.getY(dataItem, yField, endLocation);
            // in case width is set in pixels
            if ($type.isNaN(percentHeight)) {
                var offset = ((b - t) - pixelHeight) / 2;
                b += offset;
                t -= offset;
            }
            // in case max width is set in pixels
            if (!$type.isNaN(maxHeight)) {
                var offset = ((b - t) - maxHeight) / 2;
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
            if (!$type.isNaN(percentWidth)) {
                var offset = $math.round((endLocation - startLocation) * (1 - percentWidth / 100) / 2, 5);
                startLocation += offset;
                endLocation -= offset;
            }
            l = this.xAxis.getX(dataItem, xOpenField, startLocation);
            r = this.xAxis.getX(dataItem, xField, endLocation);
            // in case width is set in pixels
            if ($type.isNaN(percentWidth)) {
                var offset = ((r - l) - pixelWidth) / 2;
                l += offset;
                r -= offset;
            }
            // in case width is set in pixels
            if (!$type.isNaN(maxWidth)) {
                var offset = ((r - l) - maxWidth) / 2;
                l += offset;
                r -= offset;
            }
            var bottomLocation = dataItem.locations[yOpenField];
            var topLocation = dataItem.locations[yField];
            // otherwise gantt chart will start items in the middle of a cell
            if (this.yAxis instanceof ValueAxis) {
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
            if (!$type.isNaN(percentHeight)) {
                var offset = $math.round((1 - percentHeight / 100) / 2, 5);
                startLocation += offset;
                endLocation -= offset;
            }
            t = this.yAxis.getY(dataItem, yOpenField, startLocation);
            b = this.yAxis.getY(dataItem, yField, endLocation);
            // in case height is set in pixels
            if ($type.isNaN(percentHeight)) {
                var offset = ((b - t) - pixelHeight) / 2;
                b -= offset;
                t += offset;
            }
            // in case height is set in pixels
            if (!$type.isNaN(maxHeight)) {
                var offset = ((b - t) - maxHeight) / 2;
                b -= offset;
                t += offset;
            }
            var rightLocation = dataItem.locations[xField];
            var leftLocation = dataItem.locations[xOpenField];
            // otherwise gantt chart will start items in the middle of a cell
            if (this.xAxis instanceof ValueAxis) {
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
                //$object.forceCopyProperties(this.columns.template, column, visualProperties);
                $object.copyProperties(this, column, visualProperties); // need this because 3d columns are not in the same container
                $object.copyProperties(this.columns.template, column, visualProperties); // second time, no force, so that columns.template would override series properties
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
            //column.returnAfterTemp();
            $iter.each(this.axisRanges.iterator(), function (axisRange) {
                var rangeColumn = dataItem.rangesColumns.getKey(axisRange.uid);
                if (!rangeColumn) {
                    rangeColumn = _this.columns.create();
                    //$object.forceCopyProperties(this.columns.template, rangeColumn, visualProperties);
                    $object.copyProperties(axisRange.contents, rangeColumn, visualProperties); // need this because 3d columns are not in the same container
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
                //rangeColumn.returnAfterTemp();
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
            // otherwise might flicker when enabling
            dataItem.column.width = 0;
            dataItem.column.height = 0;
            dataItem.column.__disabled = true;
        }
        $iter.each(this.axisRanges.iterator(), function (axisRange) {
            var rangeColumn = dataItem.rangesColumns.getKey(axisRange.uid);
            if (rangeColumn) {
                // otherwise might flicker when enabling
                rangeColumn.width = 0;
                rangeColumn.height = 0;
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
        if (this.xAxis instanceof ValueAxis || this.yAxis instanceof ValueAxis) {
            var open_1;
            var value = void 0;
            var change = void 0;
            if (this.baseAxis == this.yAxis) {
                if (this.xOpenField && this.xField) {
                    open_1 = dataItem.getValue(this.xOpenField);
                    value = dataItem.getValue(this.xField);
                    change = dataItem.getValue(this.xAxis.axisFieldName + "X", "previousChange");
                }
            }
            else {
                if (this.yOpenField && this.yField) {
                    open_1 = dataItem.getValue(this.yOpenField);
                    value = dataItem.getValue(this.yField);
                    change = dataItem.getValue(this.yAxis.axisFieldName + "Y", "previousChange");
                }
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
            if ($type.hasValue(this.itemReaderText) && this.itemReaderText != "") {
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
         * A list of column elements in the series.
         *
         * @return {ListTemplate<this["_column"]>} Columns
         */
        get: function () {
            if (!this._columns) {
                this._columns = new ListTemplate(this.createColumnTemplate());
                this._disposers.push(new ListDisposer(this._columns));
                this._disposers.push(this._columns.template);
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
        return new Column();
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
            $iter.each(marker.children.iterator(), function (child) {
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
        var column = marker.createChild(RoundedRectangle);
        column.shouldClone = false;
        $object.copyProperties(this, column, visualProperties);
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
        return $math.fitToRange(coordinate, minY, maxY);
    };
    /**
     * @ignore Exclude from docs
     */
    ColumnSeries.prototype.fixHorizontalCoordinate = function (coordinate) {
        var paddingLeft = this.columns.template.pixelPaddingLeft;
        var paddingRight = this.columns.template.pixelPaddingRight;
        var minX = -paddingLeft;
        var maxX = this.xAxis.axisLength + paddingRight;
        return $math.fitToRange(coordinate, minX, maxX);
    };
    return ColumnSeries;
}(XYSeries));
export { ColumnSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ColumnSeries"] = ColumnSeries;
registry.registeredClasses["ColumnSeriesDataItem"] = ColumnSeriesDataItem;
//# sourceMappingURL=ColumnSeries.js.map