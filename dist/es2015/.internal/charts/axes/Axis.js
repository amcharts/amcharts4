/**
 * Base class for all Axis
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
import { Component } from "../../core/Component";
import { Container } from "../../core/Container";
import { DataItem } from "../../core/DataItem";
import { AxisBreak } from "./AxisBreak";
import { Label } from "../../core/elements/Label";
import { Tooltip } from "../../core/elements/Tooltip";
import { SortedListTemplate } from "../../core/utils/SortedList";
import { List, ListTemplate, ListDisposer } from "../../core/utils/List";
import { Disposer, MultiDisposer } from "../../core/utils/Disposer";
import { system } from "../../core/System";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $number from "../../core/utils/Number";
import * as $array from "../../core/utils/Array";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[Axis]].
 *
 * @see {@link DataItem}
 */
var AxisDataItem = /** @class */ (function (_super) {
    __extends(AxisDataItem, _super);
    /**
     * Constructor
     */
    function AxisDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "AxisDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(AxisDataItem.prototype, "grid", {
        /**
         * Returns currently associated [[Grid]] element.
         *
         * If there is no grid element associated with data item, a new one is
         * created and returned.
         *
         * @return {Grid} Grid element
         */
        get: function () {
            if (!this._grid) {
                var component = this.component;
                if (component) {
                    this.grid = component.renderer.grid.create();
                }
            }
            return this._grid;
        },
        /**
         * Associates a [[Grid]] element with this data item.
         *
         * @param {Grid} grid Grid element
         */
        set: function (grid) {
            if (this._grid && this._grid != grid) {
                $array.remove(this.sprites, this._grid);
                this._grid.dataItem = undefined;
            }
            if (grid) {
                if (grid.dataItem && grid.dataItem != this) {
                    $array.remove(grid.dataItem.sprites, grid);
                    grid.dataItem.grid = undefined;
                }
                grid.__disabled = false;
                grid.dataItem = this;
                this.sprites.push(grid);
            }
            this._grid = grid;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Override to cancel super call for data element validation.
     */
    AxisDataItem.prototype.validateDataElements = function () {
    };
    Object.defineProperty(AxisDataItem.prototype, "tick", {
        /**
         * Returns currently associated [[AxisTick]] element.
         *
         * If there is no tick element associated with data item, a new one is
         * created and returned.
         *
         * @return {AxisTick} Tick element
         */
        get: function () {
            if (!this._tick) {
                var component = this.component;
                if (component) {
                    this.tick = component.renderer.ticks.create();
                }
            }
            return this._tick;
        },
        /**
         * Associates an [[AxisTick]] element with this data item.
         *
         * @param {AxisTick} tick Tick element
         */
        set: function (tick) {
            if (this._tick && this._tick != tick) {
                $array.remove(this.sprites, this._tick);
                this._tick.dataItem = undefined;
            }
            if (tick) {
                if (tick.dataItem && tick.dataItem != this) {
                    $array.remove(tick.dataItem.sprites, tick);
                    tick.dataItem.tick = undefined;
                }
                tick.__disabled = false;
                tick.dataItem = this;
                this.sprites.push(tick);
            }
            this._tick = tick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisDataItem.prototype, "label", {
        /**
         * Returns currently associated [[AxisLabel]] element.
         *
         * If there is no label element associated with data item, a new one is
         * created and returned.
         *
         * @return {AxisLabel} Label element
         */
        get: function () {
            if (!this._label) {
                var component = this.component;
                if (component) {
                    this.label = component.renderer.labels.create();
                }
            }
            return this._label;
        },
        /**
         * Associates an [[AxisLabel]] element with this data item.
         *
         * @param {AxisLabel} label Label element
         */
        set: function (label) {
            if (this._label && this._label != label) {
                $array.remove(this.sprites, this._label);
                this._label.dataItem = undefined;
            }
            if (label) {
                if (label.dataItem && label.dataItem != this) {
                    $array.remove(label.dataItem.sprites, label);
                    label.dataItem.label = undefined;
                }
                label.__disabled = false;
                label.dataItem = this;
                this.sprites.push(label);
            }
            this._label = label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisDataItem.prototype, "axisFill", {
        /**
         * Returns currently associated [[AxisFill]] element.
         *
         * If there is no fill element associated with data item, a new one is
         * created and returned.
         *
         * @return {AxisFill} Label element
         */
        get: function () {
            if (!this._axisFill) {
                var component = this.component;
                if (component) {
                    this.axisFill = component.renderer.axisFills.create();
                }
            }
            return this._axisFill;
        },
        /**
         * Associates an [[AxisFill]] element with this data item.
         *
         * @param {AxisFill} label Label element
         */
        set: function (axisFill) {
            if (this._axisFill && this._axisFill != axisFill) {
                $array.remove(this.sprites, this._axisFill);
                this._axisFill.dataItem = undefined;
            }
            if (axisFill) {
                if (axisFill.dataItem && axisFill.dataItem != this) {
                    $array.remove(axisFill.dataItem.sprites, axisFill);
                    axisFill.dataItem.axisFill = undefined;
                }
                axisFill.__disabled = false;
                axisFill.dataItem = this;
                axisFill.axis = this.component;
                this.sprites.push(axisFill);
            }
            this._axisFill = axisFill;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisDataItem.prototype, "text", {
        /**
         * Returns data item's current label.
         *
         * @return {string} Text label
         */
        get: function () {
            return this._text;
        },
        /**
         * Sets text to be used as data item's label.
         *
         * @param {string} text Text label
         */
        set: function (text) {
            this._text = text;
            if (this._label) {
                this._label.textElement.text = text;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisDataItem.prototype, "mask", {
        /**
         * Data item's mask.
         *
         * @return {AxisFill} Mask
         */
        get: function () {
            return this._mask;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisDataItem.prototype, "contents", {
        /**
         * Returns a [[Container]] to place all visual elements, related to data item
         * in.
         *
         * If there is no Container, a new one is created.
         *
         * @return {Container} Contents container
         */
        get: function () {
            if (!this._contents) {
                var contents = new Container();
                this.sprites.push(contents);
                contents.isMeasured = false;
                contents.dataItem = this;
                this._contents = contents;
                var component = this.component;
                if (component) {
                    var mask = component.renderer.axisFills.create();
                    mask.axis = component;
                    mask.dataItem = this;
                    this.sprites.push(mask);
                    this._mask = mask;
                    contents.mask = mask;
                }
            }
            return this._contents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisDataItem.prototype, "axisBreak", {
        /**
         * Returns currently set [[AxisBreak]].
         *
         * @return {AxisBreak} Axis break
         */
        get: function () {
            return this._axisBreak;
        },
        /**
         * Sets an [[AxisBreak]] this data item falls within.
         *
         * @param {AxisBreak} axisBreak Axis break
         */
        set: function (axisBreak) {
            if (this._axisBreak) {
                this._axisBreak.dataItems.removeValue(this);
            }
            if (axisBreak) {
                axisBreak.dataItems.push(this);
            }
            this._axisBreak = axisBreak;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Re-draws the element.
     *
     * @ignore Exclude from docs
     */
    AxisDataItem.prototype.validate = function () {
        if (this.component) {
            this.component.validateDataElement(this);
        }
    };
    /**
     * Appends data item's elements to the parent [[Container]].
     *
     * @ignore Exclude from docs
     */
    AxisDataItem.prototype.appendChildren = function () {
        if (this.component) {
            this.component.appendDataItem(this);
        }
    };
    /**
     * Ordering function used in JSON setup.
     *
     * @param  {string}  a  Item A
     * @param  {string}  b  Item B
     * @return {Ordering}   Order
     */
    AxisDataItem.prototype.configOrder = function (a, b) {
        if (a == b) {
            return 0;
        }
        else if (a == "language") {
            return -1;
        }
        else if (b == "language") {
            return 1;
        }
        else if (a == "component") {
            return -1;
        }
        else if (b == "component") {
            return 1;
        }
        else {
            return 0;
        }
    };
    /**
     * Checks if data item has particular property set.
     *
     * @param  {string}   prop  Property name
     * @return {boolean}        Property set?
     */
    AxisDataItem.prototype.hasProperty = function (prop) {
        return prop == "component" ? true : _super.prototype.hasProperty.call(this, prop);
    };
    return AxisDataItem;
}(DataItem));
export { AxisDataItem };
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines named positions for data item's location within [[Axis]].
 */
export var AxisItemLocation;
(function (AxisItemLocation) {
    AxisItemLocation[AxisItemLocation["Start"] = 0] = "Start";
    AxisItemLocation[AxisItemLocation["Middle"] = 0.5] = "Middle";
    AxisItemLocation[AxisItemLocation["End"] = 1] = "End";
})(AxisItemLocation || (AxisItemLocation = {}));
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for all Axis elements.
 *
 * @see {@link IAxisEvents} for a list of available Events
 * @see {@link IAxisAdapters} for a list of available Adapters
 */
var Axis = /** @class */ (function (_super) {
    __extends(Axis, _super);
    /**
     * Constructor
     */
    function Axis() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Number of Grid elements on the axis.
         *
         * @type {number}
         */
        _this._gridCount = 5;
        /**
         * A list of [[Series]] that are using this Axis.
         *
         * @type {List<Series>}
         */
        _this._series = new List();
        /**
         * Holds reference to a function that accepts a DataItem and its index as
         * parameters.
         *
         * It can either return a fill opacity for a fill, or manipulate data item
         * directly, to create various highlighting scenarios.
         *
         * For example, you can set it up to highlight only weekends on a
         * [[DateAxis]].
         *
         * @param {AxisDataItem} dataItem [description]
         * @param {number}       index    [description]
         */
        _this.fillRule = function (dataItem, index) {
            if (!$type.isNumber(index)) {
                index = dataItem.index;
            }
            if (index / 2 == Math.round(index / 2)) {
                dataItem.axisFill.__disabled = true;
            }
            else {
                dataItem.axisFill.__disabled = false;
            }
        };
        _this.className = "Axis";
        _this.cursorTooltipEnabled = true;
        var interfaceColors = new InterfaceColorSet();
        // Create title
        _this.title = new Label();
        _this._disposers.push(_this.title);
        // Data item iterator
        _this._dataItemsIterator = new $iter.ListIterator(_this.dataItems, function () { return _this.dataItems.create(); });
        _this._dataItemsIterator.createNewItems = true;
        // Create tooltip
        var tooltip = new Tooltip();
        tooltip.textElement.padding(5, 10, 5, 10);
        tooltip.background.pointerLength = 5;
        tooltip.fitPointerToBounds = true;
        tooltip.filters.clear();
        // Create background element for the tooltip
        var background = tooltip.background;
        background.cornerRadius = 0;
        background.fill = interfaceColors.getFor("alternativeBackground");
        background.stroke = background.fill;
        background.strokeWidth = 1;
        background.fillOpacity = 1;
        tooltip.textElement.fill = interfaceColors.getFor("alternativeText");
        _this.tooltip = tooltip;
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {AxisDataItem} Data Item
     */
    Axis.prototype.createDataItem = function () {
        return new AxisDataItem();
    };
    /**
     * Invalidates layout.
     *
     * @ignore Exclude from docs
     */
    Axis.prototype.invalidateLayout = function () {
        _super.prototype.invalidateLayout.call(this);
        // this puts series after axis in invalidation order also makes series update it's data items in case widht/height of a series is not 100%
        $iter.each(this.series.iterator(), function (series) {
            series.invalidateLayout();
        });
    };
    /**
     * Recalculates the number of grid items on the axis.
     */
    Axis.prototype.updateGridCount = function () {
        if (this.renderer) {
            this._gridCount = this.axisLength / this.renderer.minGridDistance;
        }
    };
    /**
     * Redraws the element.
     *
     * @ignore Exclude from docs
     */
    Axis.prototype.validateLayout = function () {
        this.axisFullLength = this.axisLength / (this.end - this.start);
        _super.prototype.validateLayout.call(this);
        this.updateGridCount();
        this.renderer.updateAxisLine();
        this.renderer.updateBaseGridElement();
        if (this._prevLength != this.axisLength) {
            this.dispatchImmediately("lengthchanged");
            this._prevLength = this.axisLength;
        }
    };
    /**
     * Initializes Axis' renderer.
     *
     * @ignore Exclude from docs
     */
    Axis.prototype.initRenderer = function () {
        if (this.renderer) {
            this.renderer.processRenderer();
        }
    };
    /**
     * Appends data items.
     *
     * Does nothing on a base Axis.
     */
    Axis.prototype.appendDataItems = function () {
        // void
    };
    /**
     * Adds a data item to the Axis.
     *
     * @param {this["_dataItem"]} dataItem Data item
     */
    Axis.prototype.appendDataItem = function (dataItem) {
        _super.prototype.appendDataItem.call(this, dataItem);
        var renderer = this.renderer;
        dataItem.tick.parent = renderer;
        dataItem.label.parent = renderer;
        dataItem.grid.parent = renderer.gridContainer;
        dataItem.axisFill.parent = renderer.gridContainer;
    };
    /**
     * Redraws Axis' related items.
     *
     * @ignore Exclude from docs
     */
    Axis.prototype.validate = function () {
        _super.prototype.validate.call(this);
        this.axisFullLength = this.axisLength / (this.end - this.start);
        this.validateAxisRanges();
        this.validateBreaks();
    };
    /**
     * Redars Axis ranges.
     *
     * @ignore Exclude from docs
     */
    Axis.prototype.validateAxisRanges = function () {
        var _this = this;
        $iter.each(this.axisRanges.iterator(), function (axisRange) {
            _this.appendDataItem(axisRange);
            _this.validateDataElement(axisRange);
            axisRange.grid.invalidate();
            axisRange.label.deepInvalidate();
            axisRange.tick.invalidate();
            axisRange.axisFill.invalidate();
        });
    };
    /**
     * Invalidates all axis breaks, so they are redrawn.
     *
     * @ignore Exclude from docs
     */
    Axis.prototype.validateBreaks = function () {
        $iter.each(this.axisBreaks.iterator(), function (axisBreak) {
            axisBreak.invalidate();
        });
    };
    /**
     * Associates an Axis break with this Axis, after it is inserted into
     * `axisBreaks`.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<AxisBreak>["insert"]} event Event
     */
    Axis.prototype.processBreak = function (event) {
        var axisBreak = event.newValue;
        axisBreak.parent = this.renderer.breakContainer;
        axisBreak.axis = this;
    };
    /**
     * Registers a [[Series]] element with this Axis.
     *
     * Returns a [[Disposer]] for all events, added to Series for watching
     * changes in Axis, and vice versa.
     *
     * @param  {Series}     series  Series
     * @return {IDisposer}          Event disposer
     */
    Axis.prototype.registerSeries = function (series) {
        var _this = this;
        this.series.moveValue(series);
        return new MultiDisposer([
            new Disposer(function () {
                _this.series.removeValue(series);
            }),
            this.events.on("lengthchanged", series.invalidate, series) //,
            // TODO should these be disposed of ?
            //series.events.on("datavalidated", this.processSeriesDataItems, this),
            //series.events.on("visibilitychanged", this.processSeriesDataItems, this),
            //series.events.on("hide", this.processSeriesDataItems, this)
        ]);
    };
    Object.defineProperty(Axis.prototype, "renderer", {
        /**
         * Returns currently set [[AxisRenderer]].
         *
         * Please note that most of the settings, related to Axis' appearance are set
         * via its renderer. Not directly on the Axis.
         *
         * E.g.:
         *
         * ```TypeScript
         * axis.renderer.inside = true;
         * axis.renderer.minLabelPosition = 0.1;
         * axis.renderer.maxLabelPosition = 0.9;
         * ```
         * ```JavaScript
         * axis.renderer.inside = true;
         * axis.renderer.minLabelPosition = 0.1;
         * axis.renderer.maxLabelPosition = 0.9;
         * ```
         *
         * @return {T} Renderer
         */
        get: function () {
            return this._renderer;
        },
        /**
         * Sets [[AxisRenderer]] to be used to render this Axis.
         *
         * @param {T} renderer Renderer
         */
        set: function (renderer) {
            this._renderer = renderer;
            renderer.chart = this.chart;
            renderer.axis = this;
            renderer.parent = this;
            this.title.parent = this; // we add title to axis and set layout in renderer to avoid one extra container, as otherwise axis container would be used for holding renderer only
            this.initRenderer();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts a relative position to angle. (for circular axes)
     *
     * @param  {number} position Position (0-1)
     * @return {number}          Angle
     */
    Axis.prototype.positionToAngle = function (position) {
        return this.renderer.positionToAngle(position);
    };
    /**
     * Converts pixel coordinates to a relative position. (0-1)
     *
     * @param {IPoint}   point  Coorinates (px)
     * @return {number}         Position (0-1)
     */
    Axis.prototype.pointToPosition = function (point) {
        return this.renderer.pointToPosition(point);
    };
    /**
     * [getAnyRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {any}     start  [description]
     * @param  {any}     end    [description]
     * @return {string}         [description]
     */
    Axis.prototype.getAnyRangePath = function (start, end) {
        return this.renderer.getPositionRangePath(start, end);
    };
    /**
     * Converts any positional parameter to a relative position on axis.
     *
     * @todo Description (review)
     * @param  {any}     value  Pisition
     * @return {number}         Position (0-1)
     */
    Axis.prototype.anyToPosition = function (value) {
        return 0;
    };
    /**
     * [getPositionRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number} startPosition [description]
     * @param  {number} endPosition   [description]
     * @return {string}               [description]
     */
    Axis.prototype.getPositionRangePath = function (startPosition, endPosition) {
        return this.renderer.getPositionRangePath(startPosition, endPosition);
    };
    Object.defineProperty(Axis.prototype, "axisLength", {
        /**
         * Actual axis length in pixels.
         *
         * @return {number} Axis length (px)
         */
        get: function () {
            return this.renderer.axisLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "cursorTooltipEnabled", {
        /**
         * Returns current setting for showing axis tooltip.
         *
         * @return {boolean} Display tooltip?
         */
        get: function () {
            return this._cursorTooltipEnabled;
        },
        /**
         * Sets if axis should display a tooltip for chart's cursor.
         *
         * @param {boolean} value Display tooltip?
         */
        set: function (value) {
            this._cursorTooltipEnabled = value;
            if (value && this.renderer) {
                this.renderer.updateTooltip();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Shows Axis tooltip at specific relative position within Axis. (0-1)
     *
     * @param {number} position Position (0-1)
     */
    Axis.prototype.showTooltipAtPosition = function (position) {
        if (this._cursorTooltipEnabled) {
            var tooltip = this._tooltip;
            var renderer = this.renderer;
            if (tooltip) {
                var tooltipLocation = renderer.tooltipLocation;
                var startPosition = this.getCellStartPosition(position);
                var endPosition = this.getCellEndPosition(position);
                position = startPosition + (endPosition - startPosition) * tooltipLocation;
                position = $math.fitToRange(position, this.start, this.end);
                var startPoint = renderer.positionToPoint(startPosition);
                var endPoint = renderer.positionToPoint(endPosition);
                // save values so cursor could use them
                this.currentItemStartPoint = startPoint;
                this.currentItemEndPoint = endPoint;
                if (renderer.fullWidthTooltip) {
                    tooltip.width = endPoint.x - startPoint.x;
                    tooltip.height = endPoint.y - startPoint.y;
                }
                var point = renderer.positionToPoint(position);
                var globalPoint = $utils.spritePointToSvg(point, this.renderer.line);
                tooltip.text = this.getTooltipText(position);
                tooltip.pointTo(globalPoint);
                tooltip.show();
            }
        }
    };
    /**
     * Converts relative position (0-1) to Axis position with zoom level and
     * inversed taken into account.
     *
     * @param  {number} position Global position (0-1)
     * @return {number}          Position within Axis (0-1)
     */
    Axis.prototype.toAxisPosition = function (position) {
        position = position * (this.end - this.start);
        if (this.renderer.inversed) {
            position = this.end - position;
        }
        else {
            position = this.start + position;
        }
        return position;
    };
    /**
     * Returns text to be used for cursor's Axis tooltip.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position coordinate (px)
     * @return {string}            Label text
     */
    Axis.prototype.getTooltipText = function (position) {
        return;
    };
    /**
     * Updates Axis' tooltip's position and possibly size, and pointer (stem)
     * place.
     *
     * @ignore Exclude from docs
     * @param {PointerOrientation}  pointerOrientation  Pointer (stem) orientation
     * @param {IRectangle}          boundingRectangle   A rectangle for tooltip to fit within
     */
    Axis.prototype.updateTooltip = function (pointerOrientation, boundingRectangle) {
        var tooltip = this._tooltip;
        if (tooltip) {
            tooltip.pointerOrientation = pointerOrientation;
            tooltip.setBounds($utils.spriteRectToSvg(boundingRectangle, this.renderer.line));
        }
    };
    /**
     * [roundPosition description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}            position  Relative position
     * @param  {AxisItemLocation}  location  Location on axis
     * @return {number}                      Rounded position
     */
    Axis.prototype.roundPosition = function (position, location) {
        return position;
    };
    /**
     * [getCellStartPosition description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number} position [description]
     * @return {number}          [description]
     */
    Axis.prototype.getCellStartPosition = function (position) {
        return position;
    };
    /**
     * [getCellEndPosition description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number} position [description]
     * @return {number}          [description]
     */
    Axis.prototype.getCellEndPosition = function (position) {
        return position;
    };
    Object.defineProperty(Axis.prototype, "axisRanges", {
        /**
         * A list of axis ranges for this Axis.
         *
         * @return {ListTemplate} Axis ranges
         */
        get: function () {
            if (!this._axisRanges) {
                var dataItem = this.createDataItem();
                this._axisRanges = new ListTemplate(dataItem);
                this._axisRanges.events.on("insert", this.processAxisRange, this);
                this._disposers.push(new ListDisposer(this._axisRanges));
            }
            return this._axisRanges;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorates an axis range after it has been added to the axis range list.
     *
     * @param {IListEvents<AxisDataItem>["insert"]} event Event
     */
    Axis.prototype.processAxisRange = function (event) {
        var axisRange = event.newValue;
        axisRange.component = this;
        axisRange.isRange = true;
    };
    Object.defineProperty(Axis.prototype, "axisBreaks", {
        /**
         * A list of axis breaks on this Axis.
         *
         * @return {SortedListTemplate} Axis breaks.
         */
        get: function () {
            if (!this._axisBreaks) {
                this._axisBreaks = new SortedListTemplate(this.createAxisBreak(), function (a, b) {
                    return $number.order(a.adjustedStartValue, b.adjustedStartValue);
                });
                this._axisBreaks.events.on("insert", this.processBreak, this);
                this._disposers.push(new ListDisposer(this._axisBreaks));
            }
            return this._axisBreaks;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new axis break.
     *
     * @return {this["_axisBreak"]} Axis break
     */
    Axis.prototype.createAxisBreak = function () {
        return new AxisBreak();
    };
    Object.defineProperty(Axis.prototype, "series", {
        /**
         * A list of Series currently associated with this Axis.
         *
         * @return {List<Series>} Series
         */
        get: function () {
            if (!this._series) {
                this._series = new List();
            }
            return this._series;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Processes Series' data items.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     */
    Axis.prototype.processSeriesDataItems = function () {
    };
    /**
     * Processes Series' single data item.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @param {SeriesDataItem} dataItem Data item
     */
    Axis.prototype.processSeriesDataItem = function (dataItem) {
    };
    /**
     * Post-processes Serie's data items.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     */
    Axis.prototype.postProcessSeriesDataItems = function () {
    };
    /**
     * Post-processes Serie's single data item.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @param {SeriesDataItem} dataItem Data item
     */
    Axis.prototype.postProcessSeriesDataItem = function (dataItem) {
    };
    //
    /**
     * Updates Axis based on all Series that might influence it.
     *
     * Called by Series after Series data is validated.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     */
    Axis.prototype.updateAxisBySeries = function () {
    };
    /**
     * Hides unused data items.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     */
    Axis.prototype.hideUnusedDataItems = function () {
        // hide all unused
        var dataItemsIterator = this._dataItemsIterator;
        dataItemsIterator.createNewItems = false;
        $iter.each(dataItemsIterator.iterator(), function (dataItem) {
            dataItem.__disabled = true;
        });
        dataItemsIterator.clear();
        dataItemsIterator.createNewItems = true;
    };
    /**
     * Returns a Series' data item that corresponds to specific position on Axis.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @param  {Series}          series    Series
     * @param  {number}          position  Position (0-1)
     * @return {SeriesDataItem}            Data item
     */
    Axis.prototype.getSeriesDataItem = function (series, position) {
        return;
    };
    /**
     * Returns an angle that corresponds to specific angle.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {SeriesDataItem}  dataItem  Data item
     * @param  {string}          key       ???
     * @param  {number}          location  Location
     * @param  {string}          stackKey  ???
     * @return {number}                    Angle
     */
    Axis.prototype.getAngle = function (dataItem, key, location, stackKey) {
        return;
    };
    /**
     * [getX description]
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {SeriesDataItem} dataItem [description]
     * @param  {string}         key      [description]
     * @param  {number}         location [description]
     * @param  {string}         stackKey [description]
     * @return {number}                  [description]
     */
    Axis.prototype.getX = function (dataItem, key, location, stackKey) {
        return;
    };
    /**
     * [getY description]
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {SeriesDataItem} dataItem [description]
     * @param  {string}         key      [description]
     * @param  {number}         location [description]
     * @param  {string}         stackKey [description]
     * @return {number}                  [description]
     */
    Axis.prototype.getY = function (dataItem, key, location, stackKey) {
        return;
    };
    Object.defineProperty(Axis.prototype, "basePoint", {
        /**
         * [basePoint description]
         *
         * @ignore Exclude from docs
         * @todo Description (review)
         * @return {IPoint} Base point coordinates
         */
        get: function () {
            return { x: 0, y: 0 };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [dataChangeUpdate description]
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Axis.prototype.dataChangeUpdate = function () {
    };
    /**
     * Removes axis breaks that fall between `min` and `max` (???)
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  min  Start value
     * @param  {number}  max  End value
     * @return {number}       Spread o
     */
    Axis.prototype.adjustDifference = function (min, max) {
        var difference = max - min;
        if ($type.isNumber(difference)) {
            $iter.eachContinue(this.axisBreaks.iterator(), function (axisBreak) {
                var startValue = axisBreak.adjustedStartValue;
                var endValue = axisBreak.adjustedEndValue;
                if ($type.isNumber(startValue) && $type.isNumber(endValue)) {
                    // breaks are sorted, we don't need go further anymore
                    if (startValue > max) {
                        return false;
                    }
                    if (endValue >= min) {
                        if ($type.isNumber(startValue) && $type.isNumber(endValue)) {
                            var breakSize = axisBreak.breakSize;
                            var intersection = $math.intersection({ start: startValue, end: endValue }, { start: min, end: max });
                            if (intersection) {
                                difference -= (intersection.end - intersection.start) * (1 - breakSize);
                            }
                        }
                    }
                    return true;
                }
            });
            return difference;
        }
    };
    /**
     * Checks if specific value falls within a break.
     *
     * Returns [[AxisBreak]] the value falls into.
     *
     * @param  {number}     value  Value to check
     * @return {AxisBreak}         Axis break
     */
    Axis.prototype.isInBreak = function (value) {
        return $iter.find(this.axisBreaks.iterator(), function (axisBreak) {
            return value >= axisBreak.adjustedStartValue &&
                value <= axisBreak.adjustedEndValue;
        });
    };
    /**
     * [fixAxisBreaks description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Axis.prototype.fixAxisBreaks = function () {
        var _this = this;
        var axisBreaks = this.axisBreaks;
        if (axisBreaks.length > 0) {
            // first make sure that startValue is <= end value
            // This needs to make a copy of axisBreaks because it mutates the list while traversing
            // TODO very inefficient
            $array.each($iter.toArray(axisBreaks.iterator()), function (axisBreak) {
                var startValue = $math.min(axisBreak.startValue, axisBreak.endValue);
                var endValue = $math.max(axisBreak.startValue, axisBreak.endValue);
                axisBreak.adjustedStartValue = startValue;
                axisBreak.adjustedEndValue = endValue;
                _this.axisBreaks.update(axisBreak);
            });
            var firstAxisBreak = axisBreaks.first;
            var previousEndValue_1 = Math.min(firstAxisBreak.startValue, firstAxisBreak.endValue);
            // process breaks
            // TODO does this need to call axisBreaks.update ?
            $iter.each(this.axisBreaks.iterator(), function (axisBreak) {
                var startValue = axisBreak.adjustedStartValue;
                var endValue = axisBreak.adjustedEndValue;
                // breaks can't overlap
                // if break starts before previous break ends
                if (startValue < previousEndValue_1) {
                    startValue = previousEndValue_1;
                    if (endValue < previousEndValue_1) {
                        endValue = previousEndValue_1;
                    }
                }
                axisBreak.adjustedStartValue = startValue;
                axisBreak.adjustedEndValue = endValue;
            });
        }
    };
    Object.defineProperty(Axis.prototype, "startIndex", {
        /**
         * [startIndex description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @return {number} [description]
         */
        get: function () {
            return 0;
        },
        /**
         * We need start/end indexes of axes to be 0 - `dataItems.length`.
         *
         * Yes, also for category axis, this helps to avoid jumping of categories
         * while scrolling and does not do a lot of extra work as we use
         * protected `_startIndex` and `_endIndex` when working with items.
         *
         * @hidden
         */
        /**
         * [startIndex description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @param {number} value [description]
         */
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "endIndex", {
        /**
         * [endIndex description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @return {number} [description]
         */
        get: function () {
            return this.dataItems.length;
        },
        /**
         * [endIndex description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @param {number} value [description]
         */
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a formatted label based on position.
     *
     * Individual axis types should override this method to generate a label
     * that is relevant to axis type.
     *
     * @param  {number}  position  Relative position on axis (0-1)
     * @return {string}            Position label
     */
    Axis.prototype.getPositionLabel = function (position) {
        return Math.round(position * 100) + "%x";
    };
    Object.defineProperty(Axis.prototype, "chart", {
        /**
         * Returns currently associated Chart.
         *
         * @return {Chart} Chart
         */
        get: function () {
            return this._chart;
        },
        /**
         * Sets associated Chart for this Axis.
         *
         * @param {Chart}  value  Chart
         */
        set: function (value) {
            this._chart = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a data item for a Series range.
     *
     * @param  {Series}  series  Target Series
     * @return {this}            Range data item
     */
    Axis.prototype.createSeriesRange = function (series) {
        var range = this.createDataItem();
        range.component = this;
        series.axisRanges.push(range);
        return range;
    };
    /**
     * Copies all properties and related data from a different instance of Axis.
     *
     * @param {this} source Source Axis
     */
    Axis.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.renderer) {
            this.renderer.copyFrom(source.renderer);
        }
    };
    /**
     * Resets internal iterator.
     */
    Axis.prototype.resetIterators = function () {
        this._dataItemsIterator.reset();
    };
    return Axis;
}(Component));
export { Axis };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
system.registeredClasses["Axis"] = Axis;
system.registeredClasses["AxisDataItem"] = AxisDataItem;
//# sourceMappingURL=Axis.js.map