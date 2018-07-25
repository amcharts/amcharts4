/**
 * A collection of DOM-related functions.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Disposer } from "./Disposer";
import { readFrame, writeFrame } from "./AsyncPending";
import * as $object from "./Object";
import * as $array from "./Array";
import * as $type from "./Type";
/**
 * SVG namespace.
 *
 * @ignore Exclude from docs
 * @type {string}
 */
export var SVGNS = "http://www.w3.org/2000/svg";
/**
 * XML namespace.
 *
 * @ignore Exclude from docs
 * @type {string}
 */
export var XMLNS = "http://www.w3.org/2000/xmlns/";
/**
 * XLINK namespace.
 *
 * @ignore Exclude from docs
 * @type {string}
 */
export var XLINK = "http://www.w3.org/1999/xlink";
/**
 * Function that adds a disposable event listener directly to a DOM element.
 *
 * @ignore Exclude from docs
 * @param {EventTarget}   dom       A DOM element to add event to
 * @param {string}        type      Event type
 * @param {Function}      listener  Event listener
 * @returns {IDisposer}             Disposable event
 */
export function addEventListener(dom, type, listener, options) {
    //@todo proper type check for options: EventListenerOptions | boolean (TS for some reason gives error on passive parameter)
    //console.log(type, dom);
    dom.addEventListener(type, listener, options || false);
    return new Disposer(function () {
        dom.removeEventListener(type, listener, options || false);
    });
}
/**
 * Finds and returns an element reference using following logic:
 * * If we pass in an element instance, we just return it back.
 * * If we pass in a string, the function looks for an element with such id.
 * * If no element with such id is found, we grab the first element with a tag name like this.
 *
 * @ignore Exclude from docs
 * @param  {Optional<HTMLElement | string>}  el  Element definition (reference, or id, or tag name)
 * @return {Optional<HTMLElement>}               Element reference
 * @todo Review this function as it seems pretty fuzzy and hacky
 */
export function getElement(el) {
    if ($type.isString(el)) {
        var e = document.getElementById(el);
        if (e == null) {
            e = document.getElementsByClassName(el)[0];
        }
        if (e instanceof HTMLElement) {
            return e;
        }
    }
    else if (el instanceof HTMLElement) {
        return el;
    }
}
/**
 * Adds a class name to an HTML or SVG element.
 *
 * @ignore Exclude from docs
 * @param {HTMLElement | SVGSVGElement}  element    Element
 * @param {string}                       className  Class name to add
 */
export function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    }
    else {
        var currentClassName = element.getAttribute("class");
        if (currentClassName) {
            element.setAttribute("class", currentClassName.split(" ").filter(function (item) {
                return item !== className;
            }).join(" ") + " " + className);
        }
        else {
            element.setAttribute("class", className);
        }
        //element.className = element.className.replace(new RegExp("^" + className + "| " + className), "") + " " + className;
    }
}
/**
 * Removes a class name from an HTML or SVG element.
 *
 * @ignore Exclude from docs
 * @param {HTMLElement | SVGSVGElement}  element    Element
 * @param {string}                       className  Class name to add
 */
export function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
    else {
        var currentClassName = element.getAttribute("class");
        if (currentClassName) {
            element.setAttribute("class", currentClassName.split(" ").filter(function (item) {
                return item !== className;
            }).join(" "));
        }
        //element.className = element.className.replace(new RegExp("^" + className + "| " + className), "");
    }
}
/**
 * Sets style property on DOM element.
 *
 * @ignore Exclude from docs
 * @todo Still needed?
 */
export function setStyle(element, property, value) {
    element.style[property] = value;
}
/**
 * Removes focus from any element by shifting focus to body.
 *
 * @ignore Exclude from docs
 */
export function blur() {
    var input = document.createElement("input");
    input.style.position = "fixed";
    input.style.top = "0px";
    input.style.left = "-10000px";
    document.body.appendChild(input);
    input.focus();
    input.blur();
    document.body.removeChild(input);
}
/**
 * Tries to focus the element.
 *
 * @ignore Exlude from docs
 * @param {HTMLElement | SVGSVGElement}  element  Element to focus
 */
export function focus(element) {
    if (element instanceof HTMLElement) {
        element.focus();
    }
    else {
        var input = document.createElement("input");
        var fo = document.createElementNS(SVGNS, "foreignObject");
        fo.appendChild(input);
        element.appendChild(fo);
        input.focus();
        input.disabled = true;
        fo.remove();
    }
    /*if ((<any>element).focus != undefined) {
        (<any>element).focus();
    }
    else if (element instanceof SVGSVGElement) {
        // Not implemented
        // @todo implement focus fallback
    }*/
}
/**
 * Returns markup for the element including the element tag itself.
 * SVG elements do not support `outerHTML` so this functions applies of
 * a workaround which creates a new temporary wrapper, clones element and uses
 * wrapper's `innerHTML`.
 *
 * @ignore Exclude from docs
 * @param  {HTMLElement | SVGSVGElement}  element  Element to get full markup for
 * @return {string}                                Markup
 * @deprecated Not in use anywhere
 */
export function outerHTML(element) {
    if (element.outerHTML) {
        return element.outerHTML;
    }
    else {
        var twrap = document.createElement("div");
        var tnode = element.cloneNode(true);
        twrap.appendChild(tnode);
        var content = twrap.innerHTML;
        return content;
    }
}
/**
 * Checks if element is a valid DOM node.
 *
 * @ignore Exclude from docs
 * @param  {HTMLElement}  el  Element
 * @return {boolean}          `true` if element is a valid DOM node
 */
export function isElement(el) {
    return el instanceof Object && el && el.nodeType === 1;
}
/**
 * Checks of element `a` contains element `b`.
 *
 * @param  {HTMLElement | SVGSVGElement}  a  Aleged ascendant
 * @param  {HTMLElement | SVGSVGElement}  b  Aleged descendant
 * @return {boolean}                         Contains?
 */
export function contains(a, b) {
    return a !== b && (a.contains
        ? a.contains(b)
        : a.compareDocumentPosition
            ? !!(a.compareDocumentPosition(b) & 16)
            : true);
}
/**
 * Copies attributes from one element to another.
 *
 * @ignore Exclude from docs
 * @param {Element | HTMLElement |  SVGSVGElement}  source  Element to copy attributes from
 * @param {HTMLElement | SVGSVGElement}          target  Element to copy attributes to
 */
export function copyAttributes(source, target) {
    for (var attr in source.attributes) {
        var value = source.attributes[attr].nodeValue;
        // TODO what if it's null ?
        if (value != null) {
            target.setAttribute(source.attributes[attr].nodeName, value);
        }
    }
}
/**
 * [fixPixelPerfect description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param {HTMLElement}  el  Element
 */
export function fixPixelPerfect(el) {
    readFrame(function () {
        // sometimes IE doesn't like this
        // TODO figure out a way to remove this
        try {
            var rect = el.getBoundingClientRect();
            var left_1 = rect.left - Math.round(rect.left);
            var top_1 = rect.top - Math.round(rect.top);
            if (left_1 !== 0) {
                writeFrame(function () {
                    el.style.left = left_1 + "px";
                });
            }
            if (top_1 !== 0) {
                writeFrame(function () {
                    el.style.top = top_1 + "px";
                });
            }
        }
        catch (e) { }
    });
}
/**
 * [rootStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {Optional<CSSStyleSheet>}
 */
var rootStylesheet;
/**
 * [getStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @return {CSSStyleSheet} [description]
 */
function getStylesheet() {
    if (!$type.hasValue(rootStylesheet)) {
        // TODO use createElementNS ?
        var e = document.createElement("style");
        e.type = "text/css";
        document.head.appendChild(e);
        rootStylesheet = e.sheet;
    }
    return rootStylesheet;
}
/**
 * [makeStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {string}        selector  [description]
 * @return {CSSStyleRule}            [description]
 */
function makeStylesheet(selector) {
    var root = getStylesheet();
    var index = root.cssRules.length;
    root.insertRule(selector + "{}", index);
    return root.cssRules[index];
}
/**
 * Defines a class for a CSS rule.
 *
 * Can be used to dynamically add CSS to the document.
 */
var StyleRule = /** @class */ (function (_super) {
    tslib_1.__extends(StyleRule, _super);
    /**
     * Constructor.
     *
     * @param {string}  selector  CSS selector
     * @param {object}  styles    An object of style attribute - value pairs
     */
    function StyleRule(selector, styles) {
        var _this = 
        // TODO test this
        _super.call(this, function () {
            var root = getStylesheet();
            // TODO a bit hacky
            var index = $array.indexOf(root.cssRules, _this._rule);
            if (index === -1) {
                throw new Error("Could not dispose StyleRule");
            }
            else {
                root.deleteRule(index);
            }
        }) || this;
        _this._rule = makeStylesheet(selector);
        $object.each(styles, function (key, value) {
            _this.setStyle(key, value);
        });
        return _this;
    }
    Object.defineProperty(StyleRule.prototype, "selector", {
        /**
         * @return {string} CSS selector
         */
        get: function () {
            return this._rule.selectorText;
        },
        /**
         * A CSS selector text.
         *
         * E.g.: `.myClass p`
         *
         * @param {string}  selector  CSS selector
         */
        set: function (selector) {
            this._rule.selectorText = selector;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the same style properties with browser-speicifc prefixes.
     *
     * @param {string}  name   Attribute name
     * @param {string}  value  Attribute value
     */
    StyleRule.prototype._setVendorPrefixName = function (name, value) {
        var style = this._rule.style;
        style.setProperty("-webkit-" + name, value, "");
        style.setProperty("-moz-" + name, value, "");
        style.setProperty("-ms-" + name, value, "");
        style.setProperty("-o-" + name, value, "");
        style.setProperty(name, value, "");
    };
    /**
     * Sets a value for specific style attribute.
     *
     * @param {string}  name   Attribute
     * @param {string}  value  Value
     */
    StyleRule.prototype.setStyle = function (name, value) {
        if (name === "transition") {
            this._setVendorPrefixName(name, value);
        }
        else {
            this._rule.style.setProperty(name, value, "");
        }
    };
    return StyleRule;
}(Disposer));
export { StyleRule };
/**
 * An internal counter for unique style ids.
 *
 * @ignore Exclude from docs
 * @type {number}
 */
var styleId = 0;
/**
 * @ignore Exclude from docs
 * @todo Description
 */
var StyleClass = /** @class */ (function (_super) {
    tslib_1.__extends(StyleClass, _super);
    /**
     * Constructor.
     *
     * @param {object}  styles  An object of style attribute - value pairs
     * @param {string}  name    Class name
     */
    function StyleClass(styles, name) {
        var _this = this;
        var className = (!$type.hasValue(name)
            // TODO generate the classname randomly
            ? "__style_" + (++styleId) + "__"
            : name);
        _this = _super.call(this, "." + className, styles) || this;
        _this._className = className;
        return _this;
    }
    Object.defineProperty(StyleClass.prototype, "className", {
        /**
         * @return {string} Class name
         */
        get: function () {
            return this._className;
        },
        /**
         * Class name.
         *
         * @param {string}  name  Class name
         */
        set: function (name) {
            this._className = name;
            this.selector = "." + name;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts the whole class to
     * @ignore Exclude from docs
     */
    StyleClass.prototype.toString = function () {
        return this._className;
    };
    return StyleClass;
}(StyleRule));
export { StyleClass };
export function ready(f) {
    if (document.readyState !== "loading") {
        f();
    }
    else {
        var listener_1 = function () {
            if (document.readyState !== "loading") {
                document.removeEventListener("readystatechange", listener_1);
                f();
            }
        };
        document.addEventListener("readystatechange", listener_1);
    }
}
//# sourceMappingURL=DOM.js.map