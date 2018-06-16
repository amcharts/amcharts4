/**
 * Sankey diagram module.
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Chart, ChartDataItem } from "../Chart";
import { percent } from "../../core/utils/Percent";
import { ListTemplate } from "../../core/utils/List";
import { DictionaryTemplate } from "../../core/utils/Dictionary";
import { Container } from "../../core/Container";
import { registry } from "../../core/Registry";
import { SankeyNode } from "../elements/SankeyNode";
import { SankeyLink } from "../elements/SankeyLink";
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
 * Defines a [[DataItem]] for [[SankeyDiagram]].
 *
 * @see {@link DataItem}
 */
var SankeyDiagramDataItem = /** @class */ (function (_super) {
    __extends(SankeyDiagramDataItem, _super);
    /**
     * Constructor
     */
    function SankeyDiagramDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "SankeyDiagramDataItem";
        _this.values.value = {};
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(SankeyDiagramDataItem.prototype, "fromName", {
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
    Object.defineProperty(SankeyDiagramDataItem.prototype, "toName", {
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
    Object.defineProperty(SankeyDiagramDataItem.prototype, "color", {
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
    Object.defineProperty(SankeyDiagramDataItem.prototype, "value", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values["value"].value;
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
    Object.defineProperty(SankeyDiagramDataItem.prototype, "link", {
        /**
         * A visual element, representing link between the source and target nodes.
         *
         * Link's actual thickness will be determined by `value` of this link and
         * `value` of the source node.
         *
         * @readonly
         * @return {SankeyLink} Link element
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
    return SankeyDiagramDataItem;
}(ChartDataItem));
export { SankeyDiagramDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Pie chart
 * @see {@link ISankeyDiagramEvents} for a list of available Events
 * @see {@link ISankeyDiagramAdapters} for a list of available Adapters
 * @important
 */
var SankeyDiagram = /** @class */ (function (_super) {
    __extends(SankeyDiagram, _super);
    /**
     * Constructor
     */
    function SankeyDiagram() {
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
         * A list of chart's Sankey nodes.
         *
         * @param {DictionaryTemplate<string, SankeyNode>}
         */
        _this.nodes = new DictionaryTemplate(new SankeyNode());
        /**
         * A list of Sankey links connecting nodes.
         *
         * @param {ListTemplate<SankeyLink>}
         */
        _this.links = new ListTemplate(new SankeyLink());
        /**
         * [valueHeight description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @type {number}
         */
        _this.valueHeight = 0;
        _this.className = "SankeyDiagram";
        _this.nodePadding = 20;
        _this.sortBy = "none";
        _this.orientation = "horizontal";
        _this.sequencedInterpolation = true;
        _this.nodeAlign = "middle";
        _this.colors.step = 2;
        var linksContainer = _this.chartContainer.createChild(Container);
        linksContainer.shouldClone = false;
        linksContainer.width = percent(100);
        linksContainer.height = percent(100);
        linksContainer.layout = "none";
        linksContainer.isMeasured = false;
        _this.linksContainer = linksContainer;
        _this.linksContainer.id = "linksContainer";
        var nodesContainer = _this.chartContainer.createChild(Container);
        nodesContainer.shouldClone = false;
        nodesContainer.width = percent(100);
        nodesContainer.height = percent(100);
        nodesContainer.layout = "none";
        nodesContainer.isMeasured = false;
        _this.nodesContainer = nodesContainer;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * (Re)validates chart's data, effectively causing the chart to redraw.
     *
     * @ignore Exclude from docs
     */
    SankeyDiagram.prototype.validateData = function () {
        var _this = this;
        _super.prototype.validateData.call(this);
        // reset toNodes and fromNodes
        $iter.each(this.nodes.iterator(), function (strNode) {
            var node = strNode[1];
            node.incomingDataItems.clear();
            node.outgoingDataItems.clear();
        });
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
        });
        this._levelCount = 0;
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
            node.level = _this.getNodeLevel(node, 0);
            _this._levelCount = $math.max(_this._levelCount, node.level);
        });
        this.sortNodes();
        if (this.interpolationDuration > 0) {
            this.events.once("validated", this.appear, this);
        }
    };
    /**
     * Returns node's highest level.
     *
     * @param  {SankeyNode}  node   Node
     * @param  {number}      level  Current level
     * @return {number}             New level
     */
    SankeyDiagram.prototype.getNodeLevel = function (node, level) {
        var _this = this;
        var levels = [level];
        $iter.each(node.incomingDataItems.iterator(), function (link) {
            if (link.fromNode) {
                levels.push(_this.getNodeLevel(link.fromNode, level + 1));
            }
        });
        return Math.max.apply(Math, __spread(levels));
    };
    /**
     * Sorts nodes by either their values or names, based on `sortBy` setting.
     */
    SankeyDiagram.prototype.sortNodes = function () {
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
     * Calculates relation between pixel height and total value.
     *
     * In Sankey the actual thickness of links and height of nodes will depend
     * on their values.
     */
    SankeyDiagram.prototype.calculateValueHeight = function () {
        var _this = this;
        //@todo respect startIndex/endIndex?
        // calculate values of each node
        $iter.each(this.nodes.iterator(), function (strNode) {
            _this.getNodeValue(strNode[1]);
        });
        // calculate sums of each level
        this._levelSum = {};
        this._levelNodesCount = {};
        this.maxSum = 0;
        $iter.each(this.nodes.iterator(), function (strNode) {
            var node = strNode[1];
            var level = node.level;
            if ($type.isNumber(_this._levelSum[level])) {
                _this._levelSum[level] += node.value;
            }
            else {
                _this._levelSum[level] = node.value;
            }
            if ($type.isNumber(_this._levelNodesCount[level])) {
                _this._levelNodesCount[level]++;
            }
            else {
                _this._levelNodesCount[level] = 1;
            }
        });
        var maxSumLevel;
        for (var key in this._levelSum) {
            if (this.maxSum < this._levelSum[key]) {
                this.maxSum = this._levelSum[key];
                maxSumLevel = Number(key);
            }
        }
        var maxSumLevelNodeCount = this._levelNodesCount[maxSumLevel];
        var availableHeight;
        if (this.orientation == "horizontal") {
            availableHeight = this.chartContainer.maxHeight - 1;
        }
        else {
            availableHeight = this.chartContainer.maxWidth - 1;
        }
        this.valueHeight = (availableHeight - (maxSumLevelNodeCount - 1) * this.nodePadding) / this.maxSum;
        this.maxSumLevelNodeCount = maxSumLevelNodeCount;
    };
    /**
     * Updates a cummulative value of the node.
     *
     * A node's value is determined by summing values of all of the incoming
     * links or all of the outgoing links, whichever results in bigger number.
     *
     * @param {SankeyNode}  node  Node value
     */
    SankeyDiagram.prototype.getNodeValue = function (node) {
        var fromSum = 0;
        var toSum = 0;
        $iter.each(node.incomingDataItems.iterator(), function (link) {
            fromSum += link.value;
        });
        $iter.each(node.outgoingDataItems.iterator(), function (link) {
            toSum += link.value;
        });
        node.value = $math.max(fromSum, toSum);
    };
    ;
    /**
     * Redraws the chart.
     *
     * @ignore Exclude from docs
     */
    SankeyDiagram.prototype.validate = function () {
        var _this = this;
        _super.prototype.validate.call(this);
        this.calculateValueHeight();
        var container = this.nodesContainer;
        container.removeChildren();
        var nextCoordinate = {};
        var nodesInLevel = [];
        $iter.each(this._sorted, function (strNode) {
            var node = strNode[1];
            var level = node.level;
            if (!$type.isNumber(nodesInLevel[level])) {
                nodesInLevel[level] = 1;
            }
            else {
                nodesInLevel[level]++;
            }
        });
        var maxSumLevelNodeCount = this.maxSumLevelNodeCount;
        $iter.each(this._sorted, function (strNode) {
            var node = strNode[1];
            var level = node.level;
            var levelCoordinate = 0;
            switch (_this.nodeAlign) {
                case "bottom":
                    levelCoordinate = (_this.maxSum - _this._levelSum[level]) * _this.valueHeight - (nodesInLevel[level] - maxSumLevelNodeCount) * _this.nodePadding;
                    break;
                case "middle":
                    levelCoordinate = (_this.maxSum - _this._levelSum[level]) * _this.valueHeight / 2 - (nodesInLevel[level] - maxSumLevelNodeCount) * _this.nodePadding / 2;
                    break;
            }
            if (node.value > 0) {
                node.parent = container;
            }
            var delta;
            var x;
            var y;
            if (_this.orientation == "horizontal") {
                delta = (container.pixelWidth - node.pixelWidth) / _this._levelCount;
                x = delta * node.level;
                y = nextCoordinate[level] || levelCoordinate;
                var h = node.value * _this.valueHeight;
                node.height = h;
                node.minX = x;
                node.maxX = x;
                nextCoordinate[level] = y + h + _this.nodePadding;
            }
            else {
                delta = (container.pixelHeight - node.pixelHeight) / _this._levelCount;
                x = nextCoordinate[level] || levelCoordinate;
                y = delta * node.level;
                var w = node.value * _this.valueHeight;
                node.width = w;
                node.minY = y;
                node.maxY = y;
                nextCoordinate[level] = x + w + _this.nodePadding;
            }
            node.x = x;
            node.y = y;
        });
    };
    /**
     * [appear description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    SankeyDiagram.prototype.appear = function () {
        var _this = this;
        var container = this.nodesContainer;
        var i = 0;
        $iter.each(this.links.iterator(), function (link) {
            link.hide(0);
        });
        $iter.each(this._sorted, function (strNode) {
            var node = strNode[1];
            var property;
            if (_this.orientation == "horizontal") {
                node.dx = -(container.pixelWidth - node.pixelWidth) / _this._levelCount;
                property = "dx";
            }
            else {
                node.dy = -(container.pixelHeight - node.pixelHeight) / _this._levelCount;
                property = "dy";
            }
            var delay = 0;
            var duration = _this.interpolationDuration;
            if (_this.sequencedInterpolation) {
                delay = _this.sequencedInterpolationDelay * i + duration * i / $iter.length(_this.nodes.iterator());
            }
            node.opacity = 0;
            node.invalidateLinks();
            node.animate([{ property: "opacity", from: 0, to: 1 }, { property: property, to: 0 }], _this.interpolationDuration, _this.interpolationEasing).delay(delay);
            $iter.each(node.outgoingDataItems.iterator(), function (dataItem) {
                dataItem.link.show(_this.interpolationDuration).delay(delay);
            });
            i++;
        });
    };
    /**
     * Changes the sort type of the nodes.
     *
     * This will actually reshuffle nodes using nice animation.
     */
    SankeyDiagram.prototype.changeSorting = function () {
        var _this = this;
        this.sortNodes();
        var nextCoordinate = {};
        $iter.each(this._sorted, function (strNode) {
            var node = strNode[1];
            var level = node.level;
            var levelCoordinate = (_this.maxSum - _this._levelSum[level]) * _this.valueHeight / 2;
            var property;
            var nodeHeight;
            if (_this.orientation == "horizontal") {
                property = "y";
                nodeHeight = node.pixelHeight;
            }
            else {
                property = "x";
                nodeHeight = node.pixelWidth;
            }
            node.animate({ property: property, to: nextCoordinate[level] || levelCoordinate }, _this.interpolationDuration, _this.interpolationEasing);
            nextCoordinate[level] = (nextCoordinate[level] || levelCoordinate) + nodeHeight + _this.nodePadding;
            node.invalidateLinks();
        });
    };
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    SankeyDiagram.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Sankey diagram");
        }
    };
    /**
     * Creates and returns a new data item.
     *
     * @return {this} Data item
     */
    SankeyDiagram.prototype.createDataItem = function () {
        return new SankeyDiagramDataItem();
    };
    Object.defineProperty(SankeyDiagram.prototype, "nodePadding", {
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
    Object.defineProperty(SankeyDiagram.prototype, "sortBy", {
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
    Object.defineProperty(SankeyDiagram.prototype, "nodeAlign", {
        /**
         * @returns {"top" | "middle" | "bottom"} Returns nodeAlign value
         */
        get: function () {
            return this.getPropertyValue("nodeAlign");
        },
        /**
         * How to align nodes. In case layout is vertical, top means left and bottom means right
         *
         * @param {"top" | "middle" | "bottom"}  value  Node sorting
         */
        set: function (value) {
            this.setPropertyValue("nodeAlign", value);
            this.changeSorting();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyDiagram.prototype, "orientation", {
        /**
         * @return {Orientation} Orientation
         */
        get: function () {
            return this.getPropertyValue("orientation");
        },
        /**
         * Orientation of the chart: "horizontal" or "vertical";
         *
         * @param {Orientation} value Orientation
         */
        set: function (value) {
            this.setPropertyValue("orientation", value, true);
            var nameLabel = this.nodes.template.nameLabel;
            if (value == "vertical") {
                nameLabel.label.horizontalCenter = "middle";
                nameLabel.locationX = 0.5;
            }
            else {
                nameLabel.label.horizontalCenter = "left";
                nameLabel.locationX = 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    return SankeyDiagram;
}(Chart));
export { SankeyDiagram };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SankeyDiagram"] = SankeyDiagram;
//# sourceMappingURL=SankeyDiagram.js.map