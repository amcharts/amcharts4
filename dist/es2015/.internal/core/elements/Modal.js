/**
 * Modal class is used to display information over chart area.
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
import { Adapter } from "../utils/Adapter";
import { BaseObject } from "../Base";
import { interaction } from "../interaction/Interaction";
import { keyboard } from "../utils/Keyboard";
import { MultiDisposer } from "../utils/Disposer";
/**
 * Shows an HTML modal which covers window or a chart area.
 *
 * @todo Positioning over whole window
 */
var Modal = /** @class */ (function (_super) {
    __extends(Modal, _super);
    function Modal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Adapter.
         *
         * @type {Adapter<Modal, IModalAdapters>}
         */
        _this.adapter = new Adapter(_this);
        /**
         * Contents of modal window.
         *
         * @type {string}
         */
        _this._content = "";
        /**
         * Prefix to apply to class names for modal elements.
         *
         * @type {string}
         */
        _this._classPrefix = "ammodal";
        /**
         * If set to `true` [[Modal]] will use default styles.
         *
         * @type {boolean}
         */
        _this._defaultStyles = true;
        /**
         * A title for screen readers. It is very highly recommended to set that title
         * so that people using screen reader tools can get an immediate summary of
         * the information in the modal.
         *
         * @type {string}
         */
        _this.readerTitle = "";
        /**
         * Is modal closable?
         *
         * @type {boolean}
         */
        _this._closable = true;
        return _this;
    }
    /**
     * Shows modal window.
     */
    Modal.prototype.show = function () {
        if (this.container) {
            this.container.appendChild(this.element);
            this.positionElement();
        }
    };
    /**
     * Hides modal window.
     */
    Modal.prototype.hide = function () {
        if (this.element && this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
    };
    /**
     * Destroy (dispose) modal.
     */
    Modal.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.hide();
    };
    Object.defineProperty(Modal.prototype, "element", {
        /**
         * Creates and returns an HTML holder element for modal (`<div>`).
         *
         * @ignore Exclude from docs
         * @return {HTMLElement} Modal holder element
         */
        get: function () {
            var _this = this;
            if (!this._element) {
                // Get class names for modal elements
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
                // Create the curtain
                var curtain = document.createElement("div");
                curtain.className = classNames.curtainClass;
                // Append curtain to wrapper
                wrapper.appendChild(curtain);
                // Create an InteractionObject for curtain because we might need to
                // set interactions on it
                this._curtainIO = interaction.getInteraction(curtain);
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
                this._closeIO = interaction.getInteraction(close_1);
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
                this._disposers.push(this._curtainIO);
                this._disposers.push(this._closeIO);
                // Apply events
                this._applyEvents();
                // Load CSS
                if (this.defaultStyles) {
                    this.loadDefaultCSS().then(function (css) {
                        _this._disposers.push(css.default(_this.classPrefix));
                        _this._element.style.display = "initial";
                    });
                }
            }
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Positions content element in the center of modal based on its actual size.
     *
     * @ignore Exclude from docs
     */
    Modal.prototype.positionElement = function () {
        var _this = this;
        setTimeout(function () {
            _this._contentWrapperElement.style.left = "0";
            _this._contentWrapperElement.style.top = "0";
            setTimeout(function () {
                var bbox = _this._contentWrapperElement.getBoundingClientRect();
                _this._contentWrapperElement.style.left = "50%";
                _this._contentWrapperElement.style.top = "50%";
                _this._contentWrapperElement.style.marginLeft = Math.round(-bbox.width / 2) + "px";
                _this._contentWrapperElement.style.marginTop = Math.round(-bbox.height / 2) + "px";
            }, 1);
        }, 1);
    };
    Object.defineProperty(Modal.prototype, "classPrefix", {
        /**
         * A prefix that is applied to class names of various modal elements.
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
    Object.defineProperty(Modal.prototype, "content", {
        /**
         * @return {string} Modal content
         */
        get: function () {
            return this.adapter.apply("content", this._content);
        },
        /**
         * Modal content.
         *
         * Modal contemt can be any valid HTML, including CSS.
         * @param {string} value Modal content
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
    Object.defineProperty(Modal.prototype, "closable", {
        /**
         * @return {boolean} Closable?
         */
        get: function () {
            return this._closable;
        },
        /**
         * Is modal closable?
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
    Object.defineProperty(Modal.prototype, "defaultStyles", {
        /**
         * @return {boolean} Use default CSS?
         */
        get: function () {
            return this.adapter.apply("defaultStyles", this._defaultStyles);
        },
        /**
         * Should modal use default CSS?
         *
         * If default CSS is disabled, an external CSS should handle the look of the
         * modal, since it will look quite out of place otherwise.
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
    /**
     * Loads modal CSS.
     *
     * @ignore Exclude from docs
     * @return {Promise<any>} Promise
     */
    Modal.prototype.loadDefaultCSS = function () {
        return import(/* webpackChunkName: "exportcss" */ "./ModalCSS");
    };
    /**
     * If modal is closable, this method adds various events to modal elements.
     */
    Modal.prototype._applyEvents = function () {
        var _this = this;
        if (this._closeIO) {
            if (this.closable) {
                this._closeIO.element.style.visibility = "visible";
                this._disposers.push(new MultiDisposer([
                    interaction.body.events.on("keyup", function (ev) {
                        if (keyboard.isKey(ev.event, "esc") && _this.closable) {
                            _this.hide();
                        }
                    }),
                    this._curtainIO.events.on("hit", function (ev) {
                        _this.hide();
                    }),
                    this._closeIO.events.on("hit", function (ev) {
                        _this.hide();
                    })
                ]));
            }
            else {
                this._closeIO.element.style.visibility = "hidden";
            }
        }
    };
    return Modal;
}(BaseObject));
export { Modal };
//# sourceMappingURL=Modal.js.map