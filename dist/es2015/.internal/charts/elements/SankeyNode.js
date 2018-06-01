/**
 * SankeyNode module
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
import { Container } from "../../core/Container";
import { List } from "../../core/utils/List";
import { LabelBullet } from "./LabelBullet";
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
 * Creates a node in a Sankey Diagram.
 *
 * A Sankey node is a block with a value, which represents its size on the
 * diagram.
 *
 * Nodes are connected via [[SankeyLink]] elements.
 *
 * @see {@link ISankeyNodeEvents} for a list of available events
 * @see {@link ISankeyNodeAdapters} for a list of available Adapters
 * @important
 */
var SankeyNode = /** @class */ (function (_super) {
    __extends(SankeyNode, _super);
    /**
     * Constructor
     */
    function SankeyNode() {
        var _this = _super.call(this) || this;
        /**
         * [nextInCoord description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @type {number}
         */
        _this.nextInCoord = 0;
        /**
         * [nextOutCoord description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @type {number}
         */
        _this.nextOutCoord = 0;
        _this.className = "SankeyNode";
        _this.width = 10;
        _this.height = 10;
        _this.isMeasured = false;
        var interfaceColors = new InterfaceColorSet();
        _this.background.fill = interfaceColors.getFor("alternativeBackground");
        _this.background.fillOpacity = 1;
        _this.pixelPerfect = false;
        _this.background.pixelPerfect = false;
        _this.draggable = true;
        _this.inert = true;
        _this.events.on("positionchanged", _this.invalidateLinks, _this);
        _this.events.on("sizechanged", _this.invalidateLinks, _this);
        var nameLabel = _this.createChild(LabelBullet);
        nameLabel.shouldClone = false;
        //@should we auto update these locations if position is changed?
        nameLabel.locationX = 1;
        nameLabel.locationY = 0.5;
        nameLabel.label.text = "{name}";
        //nameLabel.label.textElement.hideOversized = false;
        nameLabel.width = 150;
        nameLabel.height = 150;
        nameLabel.label.horizontalCenter = "left";
        nameLabel.label.padding(0, 5, 0, 5);
        _this.nameLabel = nameLabel;
        var valueLabel = _this.createChild(LabelBullet);
        valueLabel.shouldClone = false;
        valueLabel.label.hideOversized = false;
        valueLabel.locationX = 0.5;
        valueLabel.locationY = 0.5;
        valueLabel.width = 150;
        valueLabel.height = 150;
        //valueLabel.label.text = "{value}";
        valueLabel.label.horizontalCenter = "middle";
        _this.valueLabel = valueLabel;
        return _this;
    }
    /**
     * Marks node as invalid, for redrawal in the next update cycle.
     *
     * @ignore Exclude from docs
     */
    SankeyNode.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this.invalidateLinks();
    };
    /**
     * Invalidates all links, attached to this node.
     *
     * @ignore Exclude from docs
     */
    SankeyNode.prototype.invalidateLinks = function () {
        var _this = this;
        this.nextInCoord = 0;
        this.nextOutCoord = 0;
        var chart = this.chart;
        if (chart) {
            var orientation_1 = chart.orientation;
            if (this._incomingSorted) {
                $iter.each(this._incomingSorted, function (dataItem) {
                    var link = dataItem.link;
                    link.parent = _this.chart.linksContainer;
                    var x;
                    var y;
                    var angle;
                    if (orientation_1 == "horizontal") {
                        x = _this.pixelX + _this.dx;
                        y = _this.nextInCoord + _this.pixelY + _this.dy;
                        angle = 0;
                    }
                    else {
                        y = _this.pixelY + _this.dy;
                        x = _this.nextInCoord + _this.pixelX + _this.dx;
                        angle = 90;
                    }
                    link.endX = x;
                    link.endY = y;
                    link.startAngle = angle;
                    link.endAngle = angle;
                    link.gradient.rotation = angle;
                    link.linkWidth = dataItem.value * chart.valueHeight;
                    if (!dataItem.fromNode) {
                        if (orientation_1 == "horizontal") {
                            link.startX = _this.pixelX + _this.dx - link.maxWidth;
                            link.startY = link.endY;
                        }
                        else {
                            link.startX = link.endX;
                            link.startY = _this.pixelY + _this.dy - link.maxHeight;
                        }
                        var stop_1 = link.gradient.stops.getIndex(0);
                        if (stop_1) {
                            if (link.colorMode == "gradient") {
                                stop_1.color = _this.color;
                            }
                            stop_1.opacity = 0;
                            link.fill = link.gradient;
                            link.gradient.validate();
                        }
                    }
                    if (link.colorMode == "gradient") {
                        var stop_2 = link.gradient.stops.getIndex(1);
                        if (stop_2) {
                            stop_2.color = _this.color;
                            link.gradient.validate();
                        }
                    }
                    _this.nextInCoord += link.linkWidth;
                    link.validate();
                });
            }
            if (this._outgoingSorted) {
                $iter.each(this._outgoingSorted, function (dataItem) {
                    var link = dataItem.link;
                    link.parent = _this.chart.linksContainer;
                    var x;
                    var y;
                    var angle;
                    if (orientation_1 == "horizontal") {
                        angle = 0;
                        x = _this.pixelX + _this.pixelWidth + _this.dx - 1;
                        y = _this.nextOutCoord + _this.pixelY + _this.dy;
                    }
                    else {
                        angle = 90;
                        x = _this.nextOutCoord + _this.pixelX + _this.dx;
                        y = _this.pixelY + _this.pixelHeight + _this.dy - 1;
                    }
                    link.startX = x;
                    link.startY = y;
                    link.startAngle = angle;
                    link.endAngle = angle;
                    link.gradient.rotation = angle;
                    link.linkWidth = dataItem.value * _this.chart.valueHeight;
                    if (!dataItem.toNode) {
                        if (orientation_1 == "horizontal") {
                            link.endX = _this.pixelX + link.maxWidth + _this.dx;
                            link.endY = link.startY;
                        }
                        else {
                            link.endX = link.startX;
                            link.endY = _this.pixelY + link.maxHeight + _this.dy;
                        }
                        link.opacity = _this.opacity;
                        var stop_3 = link.gradient.stops.getIndex(1);
                        if (stop_3) {
                            if (link.colorMode == "gradient") {
                                stop_3.color = _this.color;
                            }
                            stop_3.opacity = 0;
                            link.fill = link.gradient;
                            link.gradient.validate();
                        }
                    }
                    if (link.colorMode == "gradient") {
                        var stop_4 = link.gradient.stops.getIndex(0);
                        if (stop_4) {
                            stop_4.color = _this.color;
                            link.gradient.validate();
                        }
                    }
                    _this.nextOutCoord += link.linkWidth;
                    link.validate();
                });
            }
        }
        this.positionBullet(this.nameLabel);
        this.positionBullet(this.valueLabel);
    };
    /**
     * Positions the bullet so it is centered within the node element.
     *
     * @param {LabelBullet}  bullet  Target bullet
     */
    SankeyNode.prototype.positionBullet = function (bullet) {
        if (bullet) {
            bullet.x = this.pixelWidth * bullet.locationX;
            bullet.y = this.pixelHeight * bullet.locationY;
        }
    };
    Object.defineProperty(SankeyNode.prototype, "incomingDataItems", {
        /**
         * List of incoming items (links).
         *
         * @readonly
         * @return {List<SankeyDiagramDataItem>} Incoming items
         */
        get: function () {
            var _this = this;
            if (!this._incomingDataItems) {
                var incomingDataItems = new List();
                incomingDataItems.events.on("insert", function () {
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
    Object.defineProperty(SankeyNode.prototype, "outgoingDataItems", {
        /**
         * List of outgoing items (links).
         *
         * @readonly
         * @return {List<SankeyDiagramDataItem>} Outgoing items
         */
        get: function () {
            var _this = this;
            if (!this._outgoingDataItems) {
                var outgoingDataItems = new List();
                outgoingDataItems.events.on("insert", function () {
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
    Object.defineProperty(SankeyNode.prototype, "name", {
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
    Object.defineProperty(SankeyNode.prototype, "level", {
        /**
         * @return {number} Level
         */
        get: function () {
            return this.getPropertyValue("level");
        },
        /**
         * A level node is displayed at. (0 - ...)
         *
         * Levels are measured from left to right.
         *
         * The nodes in the left-most column will have `level = 0`.
         *
         * Nodes in second column - `level = 1`, etc.
         *
         * @param {number}  value  Level
         */
        set: function (value) {
            this.setPropertyValue("level", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyNode.prototype, "value", {
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
    Object.defineProperty(SankeyNode.prototype, "color", {
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
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies properties and labels from another [[SankeyNode]].
     *
     * @param {SankeyNode}  source  Source node
     */
    SankeyNode.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.nameLabel.copyFrom(source.nameLabel);
        this.valueLabel.copyFrom(source.valueLabel);
    };
    return SankeyNode;
}(Container));
export { SankeyNode };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SankeyNode"] = SankeyNode;
//# sourceMappingURL=SankeyNode.js.map