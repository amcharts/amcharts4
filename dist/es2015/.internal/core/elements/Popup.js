/**
 * Popup class is used to display information over chart area.
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
import popupCSS from "./PopupCSS";
import { Adapter } from "../utils/Adapter";
import { BaseObject } from "../Base";
import { getInteraction } from "../interaction/Interaction";
import { keyboard } from "../utils/Keyboard";
import { MultiDisposer } from "../utils/Disposer";
import * as $type from "../utils/Type";
/**
 * Shows an HTML popup which covers window or a chart area.
 *
 * @todo Positioning over whole window
 */
var Popup = /** @class */ (function (_super) {
    __extends(Popup, _super);
    /**
     * Constructor
     */
    function Popup() {
        var _this = _super.call(this) || this;
        /**
         * Adapter.
         *
         * @type {Adapter<Popup, IPopupAdapters>}
         */
        _this.adapter = new Adapter(_this);
        /**
         * Contents of popup window.
         *
         * @type {string}
         */
        _this._content = "";
        /**
         * Prefix to apply to class names for popup elements.
         *
         * @type {string}
         */
        _this._classPrefix = "ampopup";
        /**
         * If set to `true` [[Popup]] will use default styles.
         *
         * @type {boolean}
         */
        _this._defaultStyles = true;
        /**
         * If set to `true` [[Popup]] will dim out all chart content behind it by
         * showing a semi-transparent fill. (curtain)
         *
         * @type {boolean}
         */
        _this._showCurtain = false;
        /**
         * Horizontal position of the content window.
         *
         * @type {Align}
         */
        _this._align = "center";
        /**
         * Vertical position of the content window.
         *
         * @type {VerticalAlign}
         */
        _this._verticalAlign = "middle";
        /**
         * A title for screen readers. It is very highly recommended to set that title
         * so that people using screen reader tools can get an immediate summary of
         * the information in the popup.
         *
         * @type {string}
         */
        _this.readerTitle = "";
        /**
         * Is popup closable?
         *
         * @type {boolean}
         */
        _this._closable = true;
        _this.className = "Popup";
        return _this;
    }
    /**
     * Shows popup window.
     */
    Popup.prototype.show = function () {
        if (this.container) {
            this.container.appendChild(this.element);
            this.positionElement();
        }
    };
    /**
     * Hides popup window.
     */
    Popup.prototype.hide = function () {
        if (this.element && this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
    };
    /**
     * Destroy (dispose) popup.
     */
    Popup.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.hide();
    };
    Object.defineProperty(Popup.prototype, "element", {
        /**
         * Creates and returns an HTML holder element for popup (`<div>`).
         *
         * @ignore Exclude from docs
         * @return {HTMLElement} Popup holder element
         */
        get: function () {
            if (!this._element) {
                // Get class names for popup elements
                var classNames = this.adapter.apply("classNames", {
                    wrapperClass: this.classPrefix + "",
                    contentClass: this.classPrefix + "-content",
                    curtainClass: this.classPrefix + "-curtain",
                    closeClass: this.classPrefix + "-close"
                });
                // Create the wrapper
                var wrapper = document.createElement("div");
                wrapper.className = classNames.wrapperClass;
                // See if we're loading external CSS
                // Hide it until CSS is loaded
                if (this.defaultStyles) {
                    wrapper.style.display = "none";
                }
                // Curtain
                if (this.showCurtain) {
                    // Create the curtain
                    var curtain = document.createElement("div");
                    curtain.className = classNames.curtainClass;
                    // Append curtain to wrapper
                    wrapper.appendChild(curtain);
                    // Create an InteractionObject for curtain because we might need to
                    // set interactions on it
                    this._curtainIO = getInteraction().getInteraction(curtain);
                    // Add Curtain IO to disposers
                    this._disposers.push(this._curtainIO);
                }
                // Create content element
                var contentWrapper = document.createElement("div");
                contentWrapper.className = classNames.contentClass;
                // Create close button
                var close_1 = document.createElement("a");
                close_1.className = classNames.closeClass;
                // Content div
                var content = document.createElement("div");
                content.innerHTML = this.content;
                // Append close to content wrapper
                contentWrapper.appendChild(close_1);
                // Create an InteractionObject for close
                this._closeIO = getInteraction().getInteraction(close_1);
                // Hide close for now
                close_1.style.visibility = "hidden";
                // Add accessible stuff
                content.setAttribute("role", "dialog");
                content.setAttribute("aria-label", this.adapter.apply("readerTitle", this.readerTitle));
                // Add to wrapper
                contentWrapper.appendChild(content);
                wrapper.appendChild(contentWrapper);
                // Set references for easy access later on
                this._element = wrapper;
                this._contentElement = content;
                this._contentWrapperElement = contentWrapper;
                // Add IOs to disposers
                this._disposers.push(this._closeIO);
                // Apply events
                this._applyEvents();
                // Load CSS
                if (this.defaultStyles) {
                    this.loadDefaultCSS();
                }
            }
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Positions content element in the center of popup based on its actual size.
     *
     * @ignore Exclude from docs
     */
    Popup.prototype.positionElement = function () {
        var _this = this;
        if (!this._contentWrapperElement) {
            return;
        }
        setTimeout(function () {
            _this._contentWrapperElement.style.opacity = "0.01";
            _this._contentWrapperElement.style.left = "0";
            _this._contentWrapperElement.style.top = "0";
            setTimeout(function () {
                var bbox = _this._contentWrapperElement.getBoundingClientRect();
                _this._contentWrapperElement.style.opacity = "initial";
                // Set horizontal positioning
                switch (_this.align) {
                    case "left":
                        _this._contentWrapperElement.style.left = "0";
                        _this._contentWrapperElement.style.right = "auto";
                        _this._contentWrapperElement.style.marginLeft = "0";
                        break;
                    case "center":
                        _this._contentWrapperElement.style.left = "50%";
                        _this._contentWrapperElement.style.right = "auto";
                        _this._contentWrapperElement.style.marginLeft = Math.round(-bbox.width / 2) + "px";
                        break;
                    case "right":
                        _this._contentWrapperElement.style.left = "auto";
                        _this._contentWrapperElement.style.right = "0";
                        _this._contentWrapperElement.style.marginLeft = "0";
                        break;
                    default:
                        _this._contentWrapperElement.style.left = _this.toStyle(_this.left) || "auto";
                        _this._contentWrapperElement.style.right = _this.toStyle(_this.right) || "auto";
                        _this._contentWrapperElement.style.marginLeft = "0";
                        break;
                }
                // Set vertical positioning
                switch (_this.verticalAlign) {
                    case "top":
                        _this._contentWrapperElement.style.top = "0";
                        _this._contentWrapperElement.style.bottom = "auto";
                        _this._contentWrapperElement.style.marginTop = "0";
                        break;
                    case "middle":
                        _this._contentWrapperElement.style.top = "50%";
                        _this._contentWrapperElement.style.bottom = "auto";
                        _this._contentWrapperElement.style.marginTop = Math.round(-bbox.height / 2) + "px";
                        break;
                    case "bottom":
                        _this._contentWrapperElement.style.top = "auto";
                        _this._contentWrapperElement.style.bottom = "0";
                        _this._contentWrapperElement.style.marginTop = "0";
                        break;
                    default:
                        _this._contentWrapperElement.style.top = _this.toStyle(_this.top) || "auto";
                        _this._contentWrapperElement.style.bottom = _this.toStyle(_this.bottom) || "auto";
                        _this._contentWrapperElement.style.marginTop = "0";
                        break;
                }
            }, 1);
        }, 1);
    };
    Popup.prototype.toStyle = function (value) {
        if (!$type.hasValue(value)) {
            return null;
        }
        else if ($type.isNumber(value)) {
            return "" + value + "px";
        }
        else {
            return value.toString();
        }
    };
    Object.defineProperty(Popup.prototype, "classPrefix", {
        /**
         * A prefix that is applied to class names of various popup elements.
         *
         * @return {string} Class name prefix
         */
        get: function () {
            return this.adapter.apply("classPrefix", this._classPrefix);
        },
        /**
         * @param {string} value Class name prefix
         */
        set: function (value) {
            this._classPrefix = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Popup.prototype, "content", {
        /**
         * @return {string} Popup content
         */
        get: function () {
            return this.adapter.apply("content", this._content);
        },
        /**
         * Popup content.
         *
         * Popup contemt can be any valid HTML, including CSS.
         * @param {string} value Popup content
         */
        set: function (value) {
            this._content = value;
            if (this._contentElement) {
                this._contentElement.innerHTML = value;
                this.positionElement();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Popup.prototype, "closable", {
        /**
         * @return {boolean} Closable?
         */
        get: function () {
            return this._closable;
        },
        /**
         * Is popup closable?
         *
         * If it is, it can be closed in a number of ways, e.g. by hitting ESC key,
         * clicking curtain, or clicking the close button.
         *
         * If it is not closable, the only way to close it is via `hide()` call.
         *
         * @param {boolean} value Closable?
         */
        set: function (value) {
            if (value !== this._closable) {
                this._closable = value;
                this._applyEvents();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Popup.prototype, "defaultStyles", {
        /**
         * @return {boolean} Use default CSS?
         */
        get: function () {
            return this.adapter.apply("defaultStyles", this._defaultStyles);
        },
        /**
         * Should popup use default CSS?
         *
         * If default CSS is disabled, an external CSS should handle the look of the
         * popup, since it will look quite out of place otherwise.
         *
         * @default true
         * @param {string} Use default CSS?
         */
        set: function (value) {
            if (this._defaultStyles != value) {
                this._defaultStyles = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Popup.prototype, "showCurtain", {
        /**
         * @return {boolean} Show curtain?
         */
        get: function () {
            return this.adapter.apply("showCurtain", this._showCurtain);
        },
        /**
         * Should popup use dim out all content behind it?
         *
         * @default false
         * @param {boolean} Show curtain?
         */
        set: function (value) {
            if (this._showCurtain != value) {
                this._showCurtain = value;
                this.positionElement();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Popup.prototype, "align", {
        /**
         * @return {boolean} Horizontal position
         */
        get: function () {
            return this.adapter.apply("align", this._align);
        },
        /**
         * Horizontal positioning of the content window.
         *
         * Available options: "left", "center" (default), "right", and "none".
         *
         * @default "center"
         * @param {Align} Horizontal position
         */
        set: function (value) {
            if (this._align != value) {
                this._align = value;
                this.positionElement();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Popup.prototype, "verticalAlign", {
        /**
         * @return {boolean} Vertical position
         */
        get: function () {
            return this.adapter.apply("verticalAlign", this._verticalAlign);
        },
        /**
         * Vertical positioning of the content window.
         *
         * Available options: "top", "middle" (default), "bottom", and "none".
         *
         * @default "middle"
         * @param {VerticalAlign} Vertical position
         */
        set: function (value) {
            if (this._verticalAlign != value) {
                this._verticalAlign = value;
                this.positionElement();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Popup.prototype, "left", {
        /**
         * @return {boolean} Left
         */
        get: function () {
            return this.adapter.apply("left", this._left);
        },
        /**
         * "left" coordinate of a non-aligned (`align = "none"`) popup.
         *
         * Can be either absolute pixel value, or relative (`Percent`).
         *
         * Setting this property will automatically set `align` to "none".
         *
         * NOTE: The position is relative to the chart container.
         *
         * @param {number | Percent} Left
         */
        set: function (value) {
            if (this.left != value) {
                this._left = value;
                this._align = "none";
                this.positionElement();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Popup.prototype, "right", {
        /**
         * @return {boolean} Right
         */
        get: function () {
            return this.adapter.apply("right", this._right);
        },
        /**
         * "right" coordinate of a non-aligned (`align = "none"`) popup.
         *
         * Can be either absolute pixel value, or relative (`Percent`).
         *
         * Setting this property will automatically set `align` to "none".
         *
         * NOTE: The position is relative to the chart container.
         *
         * @param {number | Percent} Right
         */
        set: function (value) {
            if (this.right != value) {
                this._right = value;
                this._align = "none";
                this.positionElement();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Popup.prototype, "top", {
        /**
         * @return {boolean} Top
         */
        get: function () {
            return this.adapter.apply("top", this._top);
        },
        /**
         * "top" coordinate of a non-aligned (`verticalAlign = "none"`) popup.
         *
         * Can be either absolute pixel value, or relative (`Percent`).
         *
         * Setting this property will automatically set `verticalAlign` to "none".
         *
         * NOTE: The position is relative to the chart container.
         *
         * @param {number | Percent} Top
         */
        set: function (value) {
            if (this.top != value) {
                this._top = value;
                this._verticalAlign = "none";
                this.positionElement();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Popup.prototype, "bottom", {
        /**
         * @return {boolean} Bottom
         */
        get: function () {
            return this.adapter.apply("bottom", this._bottom);
        },
        /**
         * "bottom" coordinate of a non-aligned (`verticalAlign = "none"`) popup.
         *
         * Can be either absolute pixel value, or relative (`Percent`).
         *
         * Setting this property will automatically set `verticalAlign` to "none".
         *
         * NOTE: The position is relative to the chart container.
         *
         * @param {number | Percent} Bottom
         */
        set: function (value) {
            if (this.bottom != value) {
                this._bottom = value;
                this._verticalAlign = "none";
                this.positionElement();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Loads popup CSS.
     *
     * @ignore Exclude from docs
     */
    Popup.prototype.loadDefaultCSS = function () {
        this._disposers.push(popupCSS(this.classPrefix));
        this._element.style.display = "initial";
    };
    /**
     * If popup is closable, this method adds various events to popup elements.
     */
    Popup.prototype._applyEvents = function () {
        var _this = this;
        if (this._closeIO) {
            if (this.closable) {
                this._closeIO.element.style.visibility = "visible";
                var disposers = [
                    getInteraction().body.events.on("keyup", function (ev) {
                        if (keyboard.isKey(ev.event, "esc") && _this.closable) {
                            _this.hide();
                        }
                    }),
                    this._closeIO.events.on("hit", function (ev) {
                        _this.hide();
                    })
                ];
                if (this.showCurtain) {
                    disposers.push(this._curtainIO.events.on("hit", function (ev) {
                        _this.hide();
                    }));
                }
                this._disposers.push(new MultiDisposer(disposers));
            }
            else {
                this._closeIO.element.style.visibility = "hidden";
            }
        }
    };
    /**
     * Copies all properties and related data from different element.
     *
     * @param {this} object Source element
     */
    Popup.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.container = source.container;
        this.classPrefix = source.classPrefix;
        this.content = source.content;
        this.readerTitle = source.readerTitle;
        this.defaultStyles = source.defaultStyles;
        this.showCurtain = source.showCurtain;
        this.align = source.align;
        this.verticalAlign = source.verticalAlign;
        this.left = source.left;
        this.right = source.right;
        this.top = source.top;
        this.bottom = source.bottom;
        this.adapter.copyFrom(source.adapter);
    };
    return Popup;
}(BaseObject));
export { Popup };
//# sourceMappingURL=Popup.js.map