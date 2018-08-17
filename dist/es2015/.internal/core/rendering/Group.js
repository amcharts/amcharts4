import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AMElement } from "./AMElement";
import { List } from "../utils/List";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates an SVG `<g>` element.
 *
 * SVG groups are used for elements that need more elements just one.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g} About `<g>` element
 */
var Group = /** @class */ (function (_super) {
    tslib_1.__extends(Group, _super);
    /**
     * Constructor.
     *
     * @param {string} elementName Element type (should be "g")
     */
    function Group(elementName) {
        var _this = _super.call(this, elementName) || this;
        /**
         * All child elements contained in the group.
         *
         * @type {List<AMElement>}
         */
        _this.children = new List();
        return _this;
    }
    /**
     * Adds an element to group.
     *
     * This will manipulate DOM. `element` will be physically moved into group.
     *
     * @param {AMElement}  element  Element
     */
    Group.prototype.add = function (element) {
        if (element) {
            this.children.moveValue(element);
            this.node.appendChild(element.node);
        }
    };
    /**
     * Adds an element to group.
     *
     * This will manipulate DOM. `element` will be physically moved into group.
     *
     * @param {AMElement}  element  Element
     */
    Group.prototype.addToBack = function (element) {
        if (element) {
            var first = this.node.childNodes[0];
            if (first) {
                this.node.insertBefore(element.node, first);
            }
            else {
                this.node.appendChild(element.node);
            }
            this.children.moveValue(element);
        }
    };
    /**
     * Removes the `element` from group.
     *
     * Please note that this will not dispose the element itself, it will just
     * remove it from the group.
     *
     * @param {AMElement}  element  Element
     */
    Group.prototype.removeElement = function (element) {
        // todo: not sure about the speed, need to investigate, maybe it's faster to check if node is a child
        if (element) {
            try {
                this.node.removeChild(element.node);
            }
            catch (err) {
            }
            this.children.removeValue(element);
        }
    };
    Object.defineProperty(Group.prototype, "firstChild", {
        /**
         * First element in the group.
         *
         * @return {Optional<AMElement>} First element
         */
        get: function () {
            if (this.children.length) {
                return this.children.getIndex(0);
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "lastChild", {
        /**
         * Last element in the group.
         *
         * @return {Optional<AMElement>} Last element
         */
        get: function () {
            var len;
            if (len = this.children.length) {
                return this.children.getIndex(len - 1);
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "content", {
        /**
         * @return {string} SVG markup
         */
        get: function () {
            return this.node.innerHTML;
        },
        /**
         * Content of the group element.
         *
         * Can be used to add a lot of proprietary SVG markup into group.
         *
         * @param {string}  value  SVG markup
         */
        set: function (value) {
            this.node.innerHTML = value;
            this.populateChildren();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Removes all children from the group.
     *
     * This will note dispose the children. They will remain in memory as
     * orphans. To automatically remove and dispose children elements use
     * `disposeChildren()` instead.
     */
    Group.prototype.removeChildren = function () {
        while (this.children.length > 0) {
            var child = this.children.getIndex(0);
            if (child.node && child.node.parentNode) {
                child.node.parentNode.removeChild(child.node);
            }
            this.children.removeValue(child);
        }
    };
    /**
     * Removes and disposes all elements in the group.
     */
    Group.prototype.disposeChildren = function () {
        // TODO make this more efficient
        while (this.children.length > 0) {
            var child = this.children.getIndex(0);
            this.children.removeValue(child);
            child.dispose();
        }
    };
    /**
     * Regenerates internal `children` list out of the actual nodes in DOM.
     *
     * @ignore Exclude from docs
     */
    Group.prototype.populateChildren = function () {
        this.children.clear();
        for (var i = 0, len = this.node.childNodes.length; i < len; i++) {
            var element = this.node.childNodes[i];
            this.children.push(new AMElement(element));
        }
    };
    return Group;
}(AMElement));
export { Group };
//# sourceMappingURL=Group.js.map