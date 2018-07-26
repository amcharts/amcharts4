/**
 * FlowDiagramNode module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../../core/Container";
import { List } from "../../core/utils/List";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $iter from "../../core/utils/Iterator";
import * as $string from "../../core/utils/String";
import * as $order from "../../core/utils/Order";
import * as $number from "../../core/utils/Number";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a node in a Flow Diagram.
 *
 * A Flow node is a block with a value, which represents its size on the
 * diagram.
 *
 * Nodes are connected via [[FlowLink]] elements.
 *
 * @see {@link IFlowDiagramNodeEvents} for a list of available events
 * @see {@link IFlowDiagramNodeAdapters} for a list of available Adapters
 * @important
 */
var FlowDiagramNode = /** @class */ (function (_super) {
    tslib_1.__extends(FlowDiagramNode, _super);
    /**
     * Constructor
     */
    function FlowDiagramNode() {
        var _this = _super.call(this) || this;
        _this.className = "FlowDiagramNode";
        _this.isMeasured = false;
        var interfaceColors = new InterfaceColorSet();
        _this.pixelPerfect = false;
        _this.background.pixelPerfect = false;
        _this.draggable = true;
        _this.inert = true;
        _this.setStateOnChildren = true;
        _this.togglable = true;
        _this.events.on("positionchanged", _this.invalidateLinks, _this);
        _this.events.on("sizechanged", _this.invalidateLinks, _this);
        _this.states.create("active");
        _this.events.on("toggled", function (event) {
            var node = _this;
            if (node.isActive) {
                node.outgoingDataItems.each(function (dataItem) {
                    dataItem.setWorkingValue("value", 0);
                });
                node.incomingDataItems.each(function (dataItem) {
                    dataItem.setWorkingValue("value", 0);
                });
            }
            else {
                node.outgoingDataItems.each(function (dataItem) {
                    if (!dataItem.toNode.isActive) {
                        dataItem.setWorkingValue("value", dataItem.getValue("value"));
                    }
                });
                node.incomingDataItems.each(function (dataItem) {
                    if (!dataItem.fromNode.isActive) {
                        dataItem.setWorkingValue("value", dataItem.value);
                    }
                });
            }
        });
        return _this;
    }
    /**
     * Marks node as invalid, for redrawal in the next update cycle.
     *
     * @ignore Exclude from docs
     */
    FlowDiagramNode.prototype.validate = function () {
        _super.prototype.validate.call(this);
        this.invalidateLinks();
    };
    /**
     * Invalidates all links, attached to this node.
     *
     * @ignore Exclude from docs
     */
    FlowDiagramNode.prototype.invalidateLinks = function () {
        var _this = this;
        this.outgoingDataItems.each(function (dataItem) {
            var link = dataItem.link;
            if (link.colorMode == "fromNode") {
                link.fill = link.dataItem.fromNode.color;
            }
            if (link.colorMode == "gradient") {
                link.fill = link.gradient;
                link.stroke = link.gradient;
                var stop_1 = link.gradient.stops.getIndex(0);
                if (stop_1) {
                    stop_1.color = _this.color;
                    link.gradient.validate();
                }
            }
        });
        this.incomingDataItems.each(function (dataItem) {
            var link = dataItem.link;
            if (link.colorMode == "toNode") {
                link.fill = link.dataItem.toNode.color;
            }
            if (link.colorMode == "gradient") {
                link.fill = link.gradient;
                link.stroke = link.gradient;
                var stop_2 = link.gradient.stops.getIndex(1);
                if (stop_2) {
                    stop_2.color = _this.color;
                    link.gradient.validate();
                }
            }
        });
    };
    Object.defineProperty(FlowDiagramNode.prototype, "incomingDataItems", {
        /**
         * List of incoming items (links).
         *
         * @readonly
         * @return {List<FlowDiagramDataItem>} Incoming items
         */
        get: function () {
            var _this = this;
            if (!this._incomingDataItems) {
                var incomingDataItems = new List();
                incomingDataItems.events.on("inserted", function () {
                    if (_this.chart.sortBy == "name") {
                        _this._incomingSorted = $iter.sort(_this._incomingDataItems.iterator(), function (x, y) { return $string.order(x.fromName, y.fromName); });
                    }
                    else if (_this.chart.sortBy == "value") {
                        _this._incomingSorted = $iter.sort(_this._incomingDataItems.iterator(), function (x, y) { return $order.reverse($number.order(x.value, y.value)); });
                    }
                    else {
                        _this._incomingSorted = _this._incomingDataItems.iterator();
                    }
                }, this);
                this._incomingDataItems = incomingDataItems;
            }
            return this._incomingDataItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowDiagramNode.prototype, "outgoingDataItems", {
        /**
         * List of outgoing items (links).
         *
         * @readonly
         * @return {List<FlowDiagramDataItem>} Outgoing items
         */
        get: function () {
            var _this = this;
            if (!this._outgoingDataItems) {
                var outgoingDataItems = new List();
                outgoingDataItems.events.on("inserted", function () {
                    if (_this.chart.sortBy == "name") {
                        _this._outgoingSorted = $iter.sort(_this._outgoingDataItems.iterator(), function (x, y) { return $string.order(x.fromName, y.fromName); });
                    }
                    else if (_this.chart.sortBy == "value") {
                        _this._outgoingSorted = $iter.sort(_this._outgoingDataItems.iterator(), function (x, y) { return $order.reverse($number.order(x.value, y.value)); });
                    }
                    else {
                        _this._outgoingSorted = _this._outgoingDataItems.iterator();
                    }
                }, this);
                this._outgoingDataItems = outgoingDataItems;
            }
            return this._outgoingDataItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowDiagramNode.prototype, "name", {
        /**
         * @return {string} Name
         */
        get: function () {
            return this.getPropertyValue("name");
        },
        /**
         * A name of the node.
         *
         * @param {string}  value  Name
         */
        set: function (value) {
            this.setPropertyValue("name", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowDiagramNode.prototype, "value", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.getPropertyValue("value");
        },
        /**
         * Node's numeric value.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setPropertyValue("value", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowDiagramNode.prototype, "color", {
        /**
         * @return {Color} Color
         */
        get: function () {
            return this.getPropertyValue("color");
        },
        /**
         * Node's color.
         *
         * @param {Color}  value  Color
         */
        set: function (value) {
            this.setPropertyValue("color", value, true);
            this.background.fill = value;
            this.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    return FlowDiagramNode;
}(Container));
export { FlowDiagramNode };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FlowDiagramNode"] = FlowDiagramNode;
//# sourceMappingURL=FlowDiagramNode.js.map