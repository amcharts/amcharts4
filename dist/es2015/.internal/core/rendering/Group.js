import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AMElement } from "./AMElement";
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
        return _super.call(this, elementName) || this;
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
                if (first != element.node) {
                    this.node.insertBefore(element.node, first);
                }
            }
            else {
                this.node.appendChild(element.node);
            }
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
                if (element.node && element.node.parentNode == this.node) {
                    this.node.removeChild(element.node);
                }
            }
            catch (err) {
            }
        }
    };
    /**
     * Checks if this group already has the child element added
     *
     * @param {AMElement}  element
     * @return {boolean}
     */
    Group.prototype.hasChild = function (element) {
        for (var i = 0; i < this.node.childNodes.length; i++) {
            if (this.node.childNodes[i] == element.node) {
                return true;
            }
        }
        return false;
    };
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
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Removes all children from the group.
     */
    Group.prototype.removeChildren = function () {
        if (this.node.childNodes) {
            while (this.node.childNodes.length > 0) {
                var childNode = this.node.firstChild;
                if (childNode && childNode.parentNode) {
                    childNode.parentNode.removeChild(childNode);
                }
            }
        }
    };
    return Group;
}(AMElement));
export { Group };
//# sourceMappingURL=Group.js.map