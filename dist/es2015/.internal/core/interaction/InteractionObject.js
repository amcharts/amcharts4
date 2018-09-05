/**
 * Interaction Object module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { InteractionObjectEventDispatcher } from "./InteractionObjectEvents";
import { BaseObjectEvents } from "../Base";
import { List } from "../utils/List";
import { Dictionary, DictionaryDisposer } from "../utils/Dictionary";
import { getInteraction } from "./Interaction";
import * as $type from "../utils/Type";
/**
 * Re-exports
 */
export { InteractionObjectEventDispatcher };
/**
 * Interaction object represents an object that is subject for any kind of
 * interaction with it with any input devices: mouse, touch or keyboard.
 *
 * Any DOM element can be wrapped into an Internaction object which in turn
 * enables attaching various interaction events to it, such as: hit, drag,
 * swipe, etc.
 *
 * To create an [[InteractionObject]] out of a [[Sprite]], use:
 * `interaction.getInteractionFromSprite(sprite: Sprite)`
 *
 * To create an [[InteractionObject]] out of a a regular element:
 * `interaction.getInteraction(element: HTMLElement)`
 */
var InteractionObject = /** @class */ (function (_super) {
    tslib_1.__extends(InteractionObject, _super);
    /**
     * Constructor
     */
    function InteractionObject(element) {
        var _this = _super.call(this) || this;
        /**
         * An [[EventDispatcher]] instance which holds events for this object
         */
        _this.events = new InteractionObjectEventDispatcher(_this);
        /**
         * Collection of Disposers for various events. (so that those get disposed
         * when the whole InteractionObject is disposed)
         *
         * @ignore Exclude from docs
         * @type {Dictionary<string, IDisposer>}
         */
        _this.eventDisposers = new Dictionary();
        /**
         * A [[Dictionary]] that holds temporarily replaced original style values for
         * HTML element, so that they can be restored when the functionality that
         * replaced them is done.
         *
         * @ignore Exclude from docs
         * @type {Dictionary<string, string>}
         */
        _this.replacedStyles = new Dictionary();
        _this._clickable = false;
        _this._hoverable = false;
        _this._trackable = false;
        _this._draggable = false;
        _this._swipeable = false;
        _this._resizable = false;
        _this._rotatable = false;
        _this._wheelable = false;
        _this._inert = false;
        /**
         * Is element currently hovered?
         *
         * @type {boolean}
         */
        _this._isHover = false;
        /**
         * Has element got any pointers currently pressing down on it?
         * @type {boolean}
         */
        _this._isDown = false;
        /**
         * Does element have focus?
         *
         * @type {boolean}
         */
        _this._isFocused = false;
        /**
         * Options used for inertia functionality.
         *
         * @type {Dictionary<InertiaTypes, IInertiaOptions>}
         */
        _this.inertiaOptions = new Dictionary();
        /**
         * A collection of different inertia types, currently playing out.
         *
         * @ignore Exclude from docs
         * @type {Dictionary<InertiaTypes, Inertia>}
         */
        _this.inertias = new Dictionary();
        /**
         * Click/tap options.
         *
         * @type {IHitOptions}
         */
        _this.hitOptions = {};
        /**
         * Hover options.
         *
         * @type {IHoverOptions}
         */
        _this.hoverOptions = {};
        /**
         * Swipe gesture options.
         *
         * @type {ISwipeOptions}
         */
        _this.swipeOptions = {};
        /**
         * Keyboard options.
         *
         * @type {IKeyboarOptions}
         */
        _this.keyboardOptions = {};
        /**
         * Cursor options.
         *
         * @type {ICursorOptions}
         */
        _this.cursorOptions = {
            "defaultStyle": [{
                    "property": "cursor",
                    "value": "default"
                }]
        };
        _this._element = element;
        _this.className = "InteractionObject";
        _this._disposers.push(new DictionaryDisposer(_this.inertias));
        _this._disposers.push(new DictionaryDisposer(_this.eventDisposers));
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(InteractionObject.prototype, "isHover", {
        /**
         * Returns if this element is currently hovered.
         *
         * @return {boolean} Hovered?
         */
        get: function () {
            return this._isHover;
        },
        /**
         * Sets if this element is currently hovered.
         *
         * @param {boolean} value Hovered?
         */
        set: function (value) {
            if (this.isHover != value) {
                this._isHover = value;
                if (value) {
                    getInteraction().overObjects.moveValue(this);
                }
                else {
                    getInteraction().overObjects.removeValue(this);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "overPointers", {
        /**
         * Returns a list of pointers currently over the element.
         *
         * @see {@link Pointer}
         * @return {List<IPointer>} List if pointers currently hovering the element
         */
        get: function () {
            if (!this._overPointers) {
                this._overPointers = new List();
            }
            return this._overPointers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "isDown", {
        /**
         * Returns if this element has currently any pointers pressing on it.
         *
         * @return {boolean} Has down pointers?
         */
        get: function () {
            return this._isDown;
        },
        /**
         * Sets if this element has currently any pointers pressing on it.
         *
         * @param {boolean} value Has down pointers?
         */
        set: function (value) {
            if (this.isDown != value) {
                this._isDown = value;
                if (value) {
                    getInteraction().downObjects.moveValue(this);
                }
                else {
                    getInteraction().downObjects.removeValue(this);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "downPointers", {
        /**
         * Returns a list of pointers currently pressing down on this element.
         *
         * @see {@link Pointer}
         * @return {List<IPointer>} List of down pointers
         */
        get: function () {
            if (!this._downPointers) {
                this._downPointers = new List();
            }
            return this._downPointers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "isFocused", {
        /**
         * Returns if this element is currently focused.
         *
         * @return {boolean} Focused?
         */
        get: function () {
            return this._isFocused;
        },
        /**
         * Sets if this element is currently focused.
         *
         * @param {boolean} value Focused?
         */
        set: function (value) {
            if (this.isFocused != value) {
                this._isFocused = value;
                if (value) {
                    getInteraction().focusedObject = this;
                }
                else {
                    getInteraction().focusedObject = undefined;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "clickable", {
        /**
         * Returns if element is currently set as clickable.
         *
         * @return {boolean} Clickable?
         */
        get: function () {
            return this._clickable;
        },
        /**
         * Is element clickable? Clickable elements will generate "hit" events when
         * clicked or tapped.
         *
         * @param {boolean} value Clickable?
         */
        set: function (value) {
            if (this._clickable !== value) {
                this._clickable = value;
                getInteraction().processClickable(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "hoverable", {
        /**
         * Returns if element is currently set to generate hover events.
         *
         * @return {boolean} Hoverable?
         */
        get: function () {
            return this._hoverable;
        },
        /**
         * Sets if element should generate hover events.
         *
         * @param {boolean} value Hoverable?
         */
        set: function (value) {
            if (this._hoverable !== value) {
                this._hoverable = value;
                getInteraction().processHoverable(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "trackable", {
        /**
         * Returns if element is set to track pointer movement over it.
         *
         * @return {boolean} Track pointer?
         */
        get: function () {
            return this._trackable;
        },
        /**
         * Sets if pointer movement over element should be tracked.
         *
         * @param {boolean} value Track pointer?
         */
        set: function (value) {
            if (this._trackable !== value) {
                this._trackable = value;
                getInteraction().processTrackable(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "draggable", {
        /**
         * Returns if element is currently set as draggable.
         *
         * @return {boolean} Draggable?
         */
        get: function () {
            return this._draggable;
        },
        /**
         * Sets if element can be dragged. (moved)
         *
         * @param {boolean} value Draggable?
         */
        set: function (value) {
            if (this._draggable !== value) {
                this._draggable = value;
                getInteraction().processDraggable(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "swipeable", {
        /**
         * Returns if element is currently set to track swipe gesture.
         *
         * @return {boolean} Track swipe?
         */
        get: function () {
            return this._swipeable;
        },
        /**
         * Sets whether element should react to swipe gesture.
         *
         * @param {boolean} value Track swipe?
         */
        set: function (value) {
            if (this._swipeable !== value) {
                this._swipeable = value;
                getInteraction().processSwipeable(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "resizable", {
        /**
         * Returns if element is currently set as resizeable.
         *
         * @return {boolean} Resizeble?
         */
        get: function () {
            return this._resizable;
        },
        /**
         * Sets if element can be resized.
         *
         * @param {boolean} value Resizeable?
         */
        set: function (value) {
            if (this._resizable !== value) {
                this._resizable = value;
                getInteraction().processResizable(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "rotatable", {
        /**
         * Returns if element is currently set as rotatable.
         *
         * @return {boolean} Can rotate?
         */
        get: function () {
            return this._rotatable;
        },
        /**
         * Sets whether element can be rotated.
         *
         * @param {boolean} value Can rotate?
         */
        set: function (value) {
            if (this._rotatable !== value) {
                this._rotatable = value;
                getInteraction().processRotatable(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "wheelable", {
        /**
         * @return {boolean} Track wheel?
         */
        get: function () {
            return this._wheelable;
        },
        /**
         * Indicates whether track moouse wheel rotation over element.
         *
         * @param {boolean} value Track wheel?
         */
        set: function (value) {
            if (this._wheelable !== value) {
                this._wheelable = value;
                getInteraction().processWheelable(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "inert", {
        /**
         * Returns if element is currently set as inert.
         *
         * @return {boolean} Inert?
         */
        get: function () {
            return this._inert;
        },
        /**
         * Sets if element is inert, i.e. if it should carry movement momentum after
         * it is dragged and released.
         *
         * @param {boolean} value Inert?
         */
        set: function (value) {
            if (this._inert !== value) {
                this._inert = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "focusable", {
        /**
         * Returns if element is currently set as focusable.
         *
         * @return {Optional<boolean>} Focusable?
         */
        get: function () {
            return this._focusable;
        },
        /**
         * Sets if element can gain focus.
         *
         * @param {Optional<boolean>} value Focusable?
         */
        set: function (value) {
            if (this._focusable !== value) {
                this._focusable = value;
                if (this._focusable && this.tabindex == -1) {
                    this._tabindex = 1;
                }
                getInteraction().processFocusable(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "tabindex", {
        /**
         * Returns element's current tab index.
         *
         * @return {number} Tab index
         */
        get: function () {
            return $type.getValueDefault(this._tabindex, -1);
        },
        /**
         * Sets element's tab index.
         *
         * @param {number} value Tab index
         */
        set: function (value) {
            if (this._tabindex !== value) {
                this._tabindex = value;
                if (value > -1) {
                    this.focusable = true;
                }
                getInteraction().processFocusable(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "element", {
        /**
         * Returns DOM element associated with this element
         * @return {HTMLElement | SVGSVGElement} Element
         */
        get: function () {
            return this._element;
        },
        /**
         * Sets DOM element associated with this element
         * @param {HTMLElement | SVGSVGElement} element Element
         */
        set: function (element) {
            this._element = element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "originalPosition", {
        /**
         * Returns element's original position.
         *
         * @ignore Exclude from docs
         * @return {Optional<IPoint>} Position.
         */
        get: function () {
            return this._originalPosition || { x: 0, y: 0 };
        },
        /**
         * Sets element's original position.
         *
         * @ignore Exclude from docs
         * @param {Optional<IPoint>} value Position
         */
        set: function (value) {
            this._originalPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "originalScale", {
        /**
         * Returns element's original scale.
         *
         * @return {number} Scale
         */
        get: function () {
            return $type.getValueDefault(this._originalScale, 1);
        },
        /**
         * Sets element's original scale.
         *
         * @ignore Exclude from docs
         * @param {number} value Scale
         */
        set: function (value) {
            if (this._originalScale !== value) {
                this._originalScale = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionObject.prototype, "originalAngle", {
        /**
         * Returns element's original angle.
         *
         * @return {number} Angle
         */
        get: function () {
            return $type.getValueDefault(this._originalAngle, 0);
        },
        /**
         * Sets element's original angle.
         *
         * @ignore Exclude from docs
         * @param {number} value Angle
         */
        set: function (value) {
            if (this._originalAngle !== value) {
                this._originalAngle = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all properties and related assets from another object of the same
     * type.
     *
     * @param {this} source Source object
     */
    InteractionObject.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.inertiaOptions = source.inertiaOptions;
        this.hitOptions = source.hitOptions;
        this.hoverOptions = source.hoverOptions;
        this.swipeOptions = source.swipeOptions;
        this.keyboardOptions = source.keyboardOptions;
        this.cursorOptions = source.cursorOptions;
        getInteraction().applyCursorOverStyle(this);
    };
    /**
     * @ignore Exclude from docs
     */
    InteractionObject.prototype.setEventDisposer = function (key, value, f) {
        var disposer = this.eventDisposers.getKey(key);
        if (value) {
            if (disposer == null) {
                this.eventDisposers.setKey(key, f());
            }
        }
        else {
            if (disposer != null) {
                disposer.dispose();
                this.eventDisposers.removeKey(key);
            }
        }
    };
    /**
     * Disposes object.
     */
    InteractionObject.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        // Remove from all interaction registries
        var interaction = getInteraction();
        interaction.overObjects.removeValue(this);
        interaction.downObjects.removeValue(this);
        interaction.trackedObjects.removeValue(this);
        interaction.transformedObjects.removeValue(this);
        if (interaction.focusedObject === this) {
            interaction.focusedObject = undefined;
        }
    };
    return InteractionObject;
}(BaseObjectEvents));
export { InteractionObject };
//# sourceMappingURL=InteractionObject.js.map