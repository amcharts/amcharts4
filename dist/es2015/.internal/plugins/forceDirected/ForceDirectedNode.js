/**
 * Module that defines everything related to building ForceDirectedNodes.
 *
 * It is a container which has ForceDirectedNode element which is a RoundedRectangle.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../../core/Container";
import { registry } from "../../core/Registry";
import { Circle } from "../../core/elements/Circle";
import { Label } from "../../core/elements/Label";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates [[ForceDirectedNode]] elements (circles).
 *
 * @see {@link IForceDirectedNodeEvents} for a list of available events
 * @see {@link IForceDirectedNodeAdapters} for a list of available Adapters
 * @since 4.3.8
 * @important
 */
var ForceDirectedNode = /** @class */ (function (_super) {
    tslib_1.__extends(ForceDirectedNode, _super);
    /**
     * Constructor
     */
    function ForceDirectedNode() {
        var _this = _super.call(this) || this;
        _this.className = "ForceDirectedNode";
        //this.isMeasured = true; // for correct position of the tooltip
        _this.applyOnClones = true;
        _this.togglable = true;
        _this.draggable = true;
        _this.setStateOnChildren = true;
        _this.isActive = false;
        _this.events.on("dragstart", function () {
            if (_this.dataItem.component) {
                _this.dataItem.component.nodeDragStarted();
            }
        }, _this, false);
        _this.events.on("drag", function () {
            _this.updateSimulation();
        }, _this, false);
        var outerCircle = _this.createChild(Circle);
        outerCircle.shouldClone = false;
        outerCircle.strokeWidth = 2;
        var bgColor = new InterfaceColorSet().getFor("background");
        outerCircle.fill = bgColor;
        _this.outerCircle = outerCircle;
        var hoverState = outerCircle.states.create("hover");
        hoverState.properties.scale = 1.1;
        var outerActiveState = outerCircle.states.create("active");
        outerActiveState.properties.scale = 1.1;
        outerActiveState.properties.visible = true;
        var activeHoverState = outerCircle.states.create("hoverActive");
        activeHoverState.properties.scale = 1;
        var circle = _this.createChild(Circle);
        var activeState = circle.states.create("active");
        activeState.properties.visible = true;
        circle.shouldClone = false;
        circle.interactionsEnabled = false;
        circle.hiddenState.properties.radius = 0.01;
        circle.events.on("validated", _this.updateSimulation, _this, false);
        circle.hiddenState.properties.visible = true;
        _this.circle = circle;
        _this.addDisposer(outerCircle.events.on("validated", _this.updateLabelSize, _this, false));
        _this._disposers.push(_this.circle);
        var label = _this.createChild(Label);
        label.shouldClone = false;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fill = bgColor;
        label.strokeOpacity = 0;
        label.interactionsEnabled = false;
        label.textAlign = "middle";
        label.textValign = "middle";
        _this.label = label;
        _this.adapter.add("tooltipY", function (y, target) {
            return -target.circle.pixelRadius;
        });
        return _this;
    }
    /**
     * @ignore
     */
    ForceDirectedNode.prototype.updateLabelSize = function () {
        if (this.label.text) {
            var circle = this.circle;
            var radius = circle.pixelRadius;
            var ds = circle.defaultState;
            var dsRadius = ds.properties.radius;
            if ($type.isNumber(dsRadius)) {
                radius = dsRadius;
            }
            this.label.width = 2 * radius;
            this.label.height = 2 * radius;
        }
    };
    /**
     * Copies all parameters from another [[ForceDirectedNode]].
     *
     * @param source Source ForceDirectedNode
     */
    ForceDirectedNode.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.circle) {
            this.circle.copyFrom(source.circle);
        }
        if (this.label) {
            this.label.copyFrom(source.label);
        }
        if (this.outerCircle) {
            this.outerCircle.copyFrom(source.outerCircle);
        }
    };
    /**
     * Sets node as "active" (expanded).
     *
     * @ignore
     * @param  value  Active or not?
     */
    ForceDirectedNode.prototype.setActive = function (value) {
        _super.prototype.setActive.call(this, value);
        var dataItem = this.dataItem;
        if (dataItem) {
            var children = dataItem.children;
            if (value && children && !dataItem.childrenInited) {
                dataItem.component.initNode(dataItem);
                dataItem.component.updateNodeList();
            }
            if (value) {
                if (children) {
                    children.each(function (child) {
                        child.node.show();
                        child.node.interactionsEnabled = true;
                        if (child.parentLink) {
                            child.parentLink.show();
                        }
                        child.node.isActive = true;
                    });
                }
                dataItem.dispatchVisibility(true);
            }
            else {
                if (children) {
                    children.each(function (child) {
                        if (child.parentLink) {
                            child.parentLink.hide();
                        }
                        child.node.isActive = false;
                        child.node.interactionsEnabled = false;
                        child.node.hide();
                    });
                }
                dataItem.dispatchVisibility(false);
            }
        }
        this.updateSimulation();
    };
    /**
     * @ignore
     * @todo description
     */
    ForceDirectedNode.prototype.updateSimulation = function () {
        var dataItem = this.dataItem;
        if (dataItem && dataItem.component) {
            dataItem.component.restartSimulation();
        }
    };
    return ForceDirectedNode;
}(Container));
export { ForceDirectedNode };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ForceDirectedNode"] = ForceDirectedNode;
//# sourceMappingURL=ForceDirectedNode.js.map