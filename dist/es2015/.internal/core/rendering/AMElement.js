/**
 * [[AMElement]] represents any SVG element and related functionality.
 */
import * as $dom from "../utils/DOM";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for all SVG elements. Provides low-level DOM functionality.
 *
 * All visual elements extend this class.
 */
var AMElement = /** @class */ (function () {
    /**
     * Constructor creates a new element or uses the one that was passed in.
     *
     * @param {string | SVGSVGElement} element Element reference node type
     */
    function AMElement(element) {
        /**
         * Indicates if the element was already disposed.
         *
         * @type {boolean}
         */
        this._isDisposed = false;
        /**
         * Current X coordinate.
         *
         * @type {number}
         */
        this._x = 0;
        /**
         * Current Y coordinate.
         *
         * @type {number}
         */
        this._y = 0;
        /**
         * Current rotation.
         *
         * @type {number}
         */
        this._rotation = 0;
        /**
         * Current scale.
         *
         * @type {number}
         */
        this._scale = 1;
        if (typeof element === "string") {
            this.node = document.createElementNS($dom.SVGNS, element);
        }
        else {
            this.node = element;
        }
    }
    /**
     * Removes element's node from DOM.
     */
    AMElement.prototype.removeNode = function () {
        if (this.node) {
            if (this.node.parentNode) {
                this.node.parentNode.removeChild(this.node);
            }
        }
    };
    Object.defineProperty(AMElement.prototype, "transformString", {
        /**
         * Returns `transform` attribute of the element.
         *
         * @ignore Exclude from docs
         * @return {Optional<string>} Transform attribute value
         */
        get: function () {
            if (this.node) {
                var value = this.node.getAttribute("transform");
                if (value !== null) {
                    return value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Appply position, rotation and scale properties via elemen's `transform`
     * property
     *
     * @ignore Exclude from docs
     */
    AMElement.prototype.transform = function () {
        var transfromString = "";
        transfromString += "translate(" + this._x + "," + this._y + ")";
        if (this._scale != 1) {
            transfromString += ((transfromString ? " " : "") + "scale(" + this._scale + ")");
        }
        if (this._rotation != 0) {
            transfromString += ((transfromString ? " " : "") + "rotate(" + this._rotation + ")");
        }
        this.node.setAttribute("transform", transfromString);
    };
    /**
     * Returns bounding box of the element.
     *
     * ATTENTION: Bounding box calculations are extremely costly so should be
     * used sparingly and cached whenever possible.
     *
     * @return {IRectangle} Bounding rectangle
     */
    AMElement.prototype.getBBox = function () {
        var bbox = {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        };
        if (this.node) {
            // FF would fail if getBBox() is called without node added to parent
            if (this.node.parentNode) {
                try { // again for ff. TODO: check if this doesn't slow down
                    var svgbbox = this.node.getBBox();
                    bbox.x = svgbbox.x;
                    bbox.y = svgbbox.y;
                    bbox.width = svgbbox.width;
                    bbox.height = svgbbox.height;
                }
                catch (err) {
                }
            }
        }
        return bbox;
    };
    /**
     * Moves the element to new coordinates.
     *
     * @param {number}  x  Target X
     * @param {number}  y  Target Y
     */
    AMElement.prototype.moveTo = function (point) {
        if (point) {
            var x = point.x;
            var y = point.y;
            if ((this._x != x && $type.isNumber(x)) || (this._y != y && $type.isNumber(y))) {
                this._x = x;
                this._y = y;
                this.transform();
            }
        }
    };
    Object.defineProperty(AMElement.prototype, "content", {
        /**
         * Returns element's contents as SVG markup.
         *
         * @return {string} Contents
         */
        get: function () {
            // @todo Do not use `innerHTML` as this is not reliable and will not work on all browsers
            return this.node.innerHTML || "";
        },
        /**
         * Element's SVG contents.
         *
         * @param {string} value Contents
         */
        set: function (value) {
            // @todo Do not use `innerHTML` as this is not reliable and will not work on all browsers
            this.node.innerHTML = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AMElement.prototype, "textContent", {
        /**
         * @return {string} Text contents
         */
        get: function () {
            return this.node.textContent || "";
        },
        /**
         * Text contents of the SVG element.
         *
         * @param {string} value Text contents
         */
        set: function (value) {
            this.node.textContent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AMElement.prototype, "x", {
        /**
         * @return {number} X coordinate (px)
         */
        get: function () {
            return this._x;
        },
        /**
         * Element's X position in pixels.
         *
         * @param {number}  value  X coordinate (px)
         */
        set: function (value) {
            if (this._x != value && $type.isNumber(value)) {
                this._x = value;
                this.transform();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AMElement.prototype, "y", {
        /**
         * @return {number} Y coordinate (px)
         */
        get: function () {
            return this._y;
        },
        /**
         * Element's Y position in pixels.
         *
         * @param {number} value Y coordinate (px)
         */
        set: function (value) {
            if (this._y != value && $type.isNumber(value)) {
                this._y = value;
                this.transform();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AMElement.prototype, "rotation", {
        /**
         * @return {number} Rotation
         */
        get: function () {
            return this._rotation;
        },
        /**
         * Element's rotation in degrees.
         *
         * @param {number} value Rotation
         */
        set: function (angle) {
            if (this._rotation != angle) {
                this._rotation = angle;
                this.transform();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AMElement.prototype, "scale", {
        /**
         * @return {number} Scale
         */
        get: function () {
            return this._scale;
        },
        /**
         * Element's scale where 1 is original size.
         *
         * Setting to 0.5 will reduce element's size by 50%, 2 will make element
         * twice as large, etc.
         *
         * @param {number} value Scale
         */
        set: function (value) {
            if (this._scale != value) {
                this._scale = value;
                this.transform();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Removes an attribute from element.
     *
     * @param {string}  attribute  Attribute to remove
     */
    AMElement.prototype.removeAttr = function (attribute) {
        this.node.removeAttribute(attribute);
    };
    /**
     * Sets a set of attributes on a element.
     *
     * @param  {ISVGAttribute}  attributes  An object with attribute names (key) and values
     * @return {AMElement}                  The same element
     */
    AMElement.prototype.attr = function (attributes) {
        for (var attributeName in attributes) {
            if (!$type.hasValue(attributes[attributeName])) {
                this.node.removeAttribute(attributeName);
            }
            else {
                this.node.setAttribute(attributeName, attributes[attributeName]);
            }
        }
        return this;
    };
    /**
     * Returns a value of a node attribute.
     *
     * @param  {string}         attribute  Attribute name
     * @return {string | null}             Attribute value
     */
    AMElement.prototype.getAttr = function (attribute) {
        return this.node.getAttribute(attribute);
    };
    /**
     * Sets a single attribute of the element's node using namesspace.
     *
     * @param  {string}     ns         Namespace
     * @param  {string}     attribute  Attribute
     * @param  {string}     value      Value
     * @return {AMElement}             The same element
     */
    AMElement.prototype.attrNS = function (ns, attribute, value) {
        this.node.setAttributeNS(ns, attribute, value);
        return this;
    };
    /**
     * Returns a namespaced attribute value from node.
     *
     * @param  {string}  ns         Namespace
     * @param  {string}  attribute  Attribute
     * @return {string}             Attribute value
     */
    AMElement.prototype.getAttrNS = function (ns, attribute) {
        return this.node.getAttributeNS(ns, attribute);
    };
    /**
     * Removes `style` attribute from node.
     *
     * @param {string}  attribute  Attribute to remove
     */
    AMElement.prototype.removeStyle = function (attribute) {
        // @todo Review because it's a bit messy and maybe not needed (pratically not used)
        delete this.node.style[attribute];
    };
    /**
     * Returns style attribute value.
     *
     * @param  {string}  attribute  Style attribute value
     * @return {string}             Attribute value
     */
    AMElement.prototype.getStyle = function (attribute) {
        // @todo Review because it's a bit messy and maybe not needed (pratically not used)
        return this.node.style[attribute];
    };
    /**
     * Adds style attributes to element's node.
     *
     * @param  {Object}     attributes  Object containing attribute: value pairs
     * @return {AMElement}              The same element
     */
    AMElement.prototype.addStyle = function (attributes) {
        // @todo Review because it's a bit messy and maybe not needed (pratically not used)
        for (var attributeName in attributes) {
            if (!$type.hasValue(attributes[attributeName])) {
                this.removeStyle(attributeName);
            }
            else {
                this.node.style[attributeName] = attributes[attributeName];
            }
        }
        return this;
    };
    /**
     * Adds a class to element.
     *
     * @param {string}  name  Class name
     */
    AMElement.prototype.addClass = function (name) {
        $dom.addClass(this.node, name);
    };
    /**
     * Removes a class from element.
     *
     * @param {string} name Class name
     */
    AMElement.prototype.removeClass = function (name) {
        $dom.removeClass(this.node, name);
    };
    /**
     * Sets a class name on element.
     *
     * @param {string}  name  Class name
     */
    AMElement.prototype.setClass = function (name) {
        this.node.setAttribute("class", name);
    };
    /**
     * Removes all element's child nodes, basically leaving it empty.
     */
    AMElement.prototype.removeChildNodes = function () {
        // remove all children
        while (this.node.childNodes.length > 0) {
            this.node.removeChild(this.node.firstChild);
        }
    };
    /**
     * Was this element already been disposed?
     *
     * @return {boolean} Disposed?
     */
    AMElement.prototype.isDisposed = function () {
        return this._isDisposed;
    };
    /**
     * Disposes element.
     */
    AMElement.prototype.dispose = function () {
        this.removeNode();
    };
    return AMElement;
}());
export { AMElement };
//# sourceMappingURL=AMElement.js.map