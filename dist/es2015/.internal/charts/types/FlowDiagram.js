/**
 * FlowDiagram module.
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
import { Chart, ChartDataItem } from "../Chart";
import { ListTemplate } from "../../core/utils/List";
import { DictionaryTemplate } from "../../core/utils/Dictionary";
import { Container } from "../../core/Container";
import { registry } from "../../core/Registry";
import { FlowDiagramNode } from "../elements/FlowDiagramNode";
import { FlowDiagramLink } from "../elements/FlowDiagramLink";
import { LinearGradientModifier } from "../../core/rendering/fills/LinearGradientModifier";
import { ColorSet } from "../../core/utils/ColorSet";
import { toColor, Color } from "../../core/utils/Color";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import * as $number from "../../core/utils/Number";
import * as $order from "../../core/utils/Order";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
//@todo rearange notes after dragged
/**
 * Defines a [[DataItem]] for [[FlowDiagram]].
 *
 * @see {@link DataItem}
 */
var FlowDiagramDataItem = /** @class */ (function (_super) {
    __extends(FlowDiagramDataItem, _super);
    /**
     * Constructor
     */
    function FlowDiagramDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "FlowDiagramDataItem";
        _this.values.value = {};
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(FlowDiagramDataItem.prototype, "fromName", {
        /**
         * @return {string} name
         */
        get: function () {
            return this.properties.fromName;
        },
        /**
         * Source node's name.
         *
         * @param {string}  value  Name
         */
        set: function (value) {
            this.setProperty("fromName", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowDiagramDataItem.prototype, "toName", {
        /**
         * @return {string} name
         */
        get: function () {
            return this.properties.toName;
        },
        /**
         * Destination node's name.
         *
         * @param {string}  value  Name
         */
        set: function (value) {
            this.setProperty("toName", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowDiagramDataItem.prototype, "color", {
        /**
         * @return {string} color
         */
        get: function () {
            return this.properties.color;
        },
        /**
         * Node color
         *
         * @param {string}  value  Name
         */
        set: function (value) {
            this.setProperty("color", toColor(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowDiagramDataItem.prototype, "value", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.value.value;
        },
        /**
         * Link's value.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("value", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowDiagramDataItem.prototype, "link", {
        /**
         * A visual element, representing link between the source and target nodes.
         *
         * Link's actual thickness will be determined by `value` of this link and
         * `value` of the source node.
         *
         * @readonly
         * @return {FlowDiagramLink} Link element
         */
        get: function () {
            if (!this._link) {
                this._link = this.component.links.create();
                this.addSprite(this._link);
            }
            return this._link;
        },
        enumerable: true,
        configurable: true
    });
    return FlowDiagramDataItem;
}(ChartDataItem));
export { FlowDiagramDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Pie chart
 * @see {@link IFlowDiagramEvents} for a list of available Events
 * @see {@link IFlowDiagramAdapters} for a list of available Adapters
 * @important
 */
var FlowDiagram = /** @class */ (function (_super) {
    __extends(FlowDiagram, _super);
    /**
     * Constructor
     */
    function FlowDiagram() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * A Color Set to use when applying/generating colors for each subsequent
         * node.
         *
         * @type {ColorSet}
         */
        _this.colors = new ColorSet();
        /**
         * A list of chart's FlowDiagram nodes.
         *
         * @param {DictionaryTemplate<string, FlowDiagramNode>}
         */
        _this.nodes = new DictionaryTemplate(new FlowDiagramNode());
        /**
         * A list of FlowDiagram links connecting nodes.
         *
         * @param {ListTemplate<FlowDiagramLink>}
         */
        _this.links = new ListTemplate(new FlowDiagramLink());
        _this.className = "FlowDiagram";
        _this.nodePadding = 20;
        _this.sortBy = "none";
        _this.sequencedInterpolation = true;
        _this.colors.step = 2;
        _this.minNodeSize = 0.02;
        var linksContainer = _this.chartContainer.createChild(Container);
        linksContainer.shouldClone = false;
        linksContainer.layout = "none";
        linksContainer.isMeasured = false;
        _this.linksContainer = linksContainer;
        var nodesContainer = _this.chartContainer.createChild(Container);
        nodesContainer.shouldClone = false;
        nodesContainer.layout = "none";
        nodesContainer.isMeasured = false;
        _this.nodesContainer = nodesContainer;
        // this data item holds sums, averages, etc
        _this.dataItem = _this.createDataItem();
        _this.dataItem.component = _this;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * (Re)validates chart's data, effectively causing the chart to redraw.
     *
     * @ignore Exclude from docs
     */
    FlowDiagram.prototype.validateData = function () {
        var _this = this;
        // reset toNodes and fromNodes
        $iter.each(this.nodes.iterator(), function (strNode) {
            var node = strNode[1];
            node.incomingDataItems.clear();
            node.outgoingDataItems.clear();
        });
        $iter.each(this.nodes.iterator(), function (strNode) {
            var node = strNode[1];
            _this.nodes.removeKey(strNode[0]);
            node.dispose();
        });
        this.links.clear();
        _super.prototype.validateData.call(this);
        var sum = 0;
        var count = 0;
        var low;
        var high;
        // build blocks
        $iter.each(this.dataItems.iterator(), function (dataItem) {
            var fromName = dataItem.fromName;
            if (fromName) {
                var node = _this.nodes.getKey(fromName);
                if (!node) {
                    node = _this.nodes.create(fromName);
                    node.name = fromName;
                    node.chart = _this;
                }
                dataItem.addSprite(node);
                dataItem.fromNode = node;
                dataItem.fromNode.outgoingDataItems.push(dataItem);
            }
            var toName = dataItem.toName;
            if (toName) {
                var node = _this.nodes.getKey(toName);
                if (!node) {
                    node = _this.nodes.create(toName);
                    node.name = toName;
                    node.chart = _this;
                    if (!node.dataItem) {
                        dataItem.addSprite(node);
                    }
                }
                dataItem.toNode = node;
                dataItem.toNode.incomingDataItems.push(dataItem);
            }
            if (!dataItem.fromNode) {
                var strokeModifier = new LinearGradientModifier();
                strokeModifier.opacities = [0, 1];
                dataItem.link.strokeModifier = strokeModifier;
            }
            if (!dataItem.toNode) {
                var fillModifier = new LinearGradientModifier();
                fillModifier.opacities = [1, 0];
                dataItem.link.strokeModifier = fillModifier;
            }
            var value = dataItem.value;
            if ($type.isNumber(value)) {
                sum += value;
                count++;
                if (low > value || !$type.isNumber(low)) {
                    low = value;
                }
                if (high < value || !$type.isNumber(high)) {
                    high = value;
                }
            }
        });
        var key = "value";
        this.dataItem.setCalculatedValue(key, high, "high");
        this.dataItem.setCalculatedValue(key, low, "low");
        this.dataItem.setCalculatedValue(key, sum, "sum");
        this.dataItem.setCalculatedValue(key, sum / count, "average");
        this.dataItem.setCalculatedValue(key, count, "count");
        $iter.each(this.nodes.iterator(), function (strNode) {
            var node = strNode[1];
            if (node.fill instanceof Color) {
                node.color = node.fill;
            }
            if (node.color == undefined) {
                node.color = _this.colors.next();
            }
            if (node.dataItem.color != undefined) {
                node.color = node.dataItem.color;
            }
            _this.getNodeValue(node);
        });
        this.sortNodes();
        if (this.interpolationDuration > 0) {
            this.events.once("validated", this.appear, this);
        }
    };
    FlowDiagram.prototype.handleDataItemWorkingValueChange = function (event) {
        this.invalidate();
    };
    /**
     * [appear description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    FlowDiagram.prototype.appear = function () {
        this.hide(0);
        this.show();
    };
    /**
     * Sorts nodes by either their values or names, based on `sortBy` setting.
     */
    FlowDiagram.prototype.sortNodes = function () {
        if (this.sortBy == "name") {
            this._sorted = this.nodes.sortedIterator();
        }
        else if (this.sortBy == "value") {
            this._sorted = $iter.sort(this.nodes.iterator(), function (x, y) { return $order.reverse($number.order(x[1].value, y[1].value)); });
        }
        else {
            this._sorted = this.nodes.iterator();
        }
    };
    /**
     * Updates a cummulative value of the node.
     *
     * A node's value is determined by summing values of all of the incoming
     * links or all of the outgoing links, whichever results in bigger number.
     *
     * @param {FlowDiagramNode}  node  Node value
     */
    FlowDiagram.prototype.getNodeValue = function (node) {
        var fromSum = 0;
        var toSum = 0;
        $iter.each(node.incomingDataItems.iterator(), function (dataItem) {
            fromSum += dataItem.getWorkingValue("value");
        });
        $iter.each(node.outgoingDataItems.iterator(), function (dataItem) {
            toSum += dataItem.getWorkingValue("value");
        });
        node.value = $math.max(fromSum, toSum);
        this.fixMin(node);
    };
    ;
    /**
     * Limit size of a node for it not to be too small
     * @ignore
     */
    FlowDiagram.prototype.fixMin = function (node) {
        var minNodeSize = this.minNodeSize;
        if (minNodeSize > 0) {
            var total = this.dataItem.values.value.sum;
            if (node.value < total * minNodeSize) {
                node.value = total * minNodeSize;
            }
        }
    };
    /**
     * Changes the sort type of the nodes.
     *
     * This will actually reshuffle nodes using nice animation.
     */
    FlowDiagram.prototype.changeSorting = function () {
        this.sortNodes();
    };
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    FlowDiagram.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Flow diagram");
        }
    };
    /**
     * Creates and returns a new data item.
     *
     * @return {this} Data item
     */
    FlowDiagram.prototype.createDataItem = function () {
        return new FlowDiagramDataItem();
    };
    Object.defineProperty(FlowDiagram.prototype, "nodePadding", {
        /**
         * @return {number} Padding (px)
         */
        get: function () {
            return this.getPropertyValue("nodePadding");
        },
        /**
         * Padding for node square in pixels.
         *
         * Padding will add extra space around node's name label.
         *
         * @param {number} value Padding (px)
         */
        set: function (value) {
            this.setPropertyValue("nodePadding", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowDiagram.prototype, "sortBy", {
        /**
         * @returns {"none" | name" | "value"} Node sorting
         */
        get: function () {
            return this.getPropertyValue("sortBy");
        },
        /**
         * Sort nodes by "name" or "value" or do not sort at all. If not sorted, nodes will appear in the same order as they are in the data.
         * @default "none"
         * @param {"none" | "name" | "value"}  value  Node sorting
         */
        set: function (value) {
            this.setPropertyValue("sortBy", value);
            this.changeSorting();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlowDiagram.prototype, "minNodeSize", {
        /**
         * @returns {number} min node size
         */
        get: function () {
            return this.getPropertyValue("minNodeSize");
        },
        /**
         * Sometimes nodes can get very small if their value is little. With this setting you
         * can set min size of a node (this is relative value from the total size of all nodes)
         * @default 0.02
         * @param {"none" | "name" | "value"}  value  Node sorting
         */
        set: function (value) {
            this.setPropertyValue("minNodeSize", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return FlowDiagram;
}(Chart));
export { FlowDiagram };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FlowDiagram"] = FlowDiagram;
//# sourceMappingURL=FlowDiagram.js.map