/**
 * Interaction manages all aspects of user interaction - mouse move,
 * click, hover, drag events, touch gestures.
 *
 * [[InteractionObject]] elements that want to use certain events, must attach event
 * listeners to Interaction instance.
 *
 * Interaction itself will not modify [[InteractionObject]] elements, it will be up to
 * those elements to handle interaction information received via event triggers.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents } from "../Base";
import { List } from "../utils/List";
import { Animation } from "../utils/Animation";
import { MultiDisposer } from "../utils/Disposer";
import { InteractionObject } from "./InteractionObject";
import { InteractionKeyboardObject } from "./InteractionKeyboardObject";
import { Dictionary } from "../utils/Dictionary";
import { Inertia } from "./Inertia";
import { addEventListener } from "../utils/DOM";
import { keyboard } from "../utils/Keyboard";
import * as $ease from "../utils/Ease";
import * as $math from "../utils/Math";
import * as $dom from "../utils/DOM";
import * as $iter from "../utils/Iterator";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
* Interaction manages all aspects of user interaction - mouse move,
* click, hover, drag events, touch gestures.
*
* [[InteractionObject]] elements that want to use certain events, must attach event
* listeners to Interaction instance.
*
* Interaction itself will not modify [[InteractionObject]] elements, it will be up to
* those elements to handle interaction information received via event triggers.
*
* @see {@link IInteractionEvents} for a list of available events
* @todo Throw exceptions on errors
*/
var Interaction = /** @class */ (function (_super) {
    tslib_1.__extends(Interaction, _super);
    /**
     * Constructor. Sets up universal document-wide move events to handle stuff
     * outside particular chart container.
     */
    function Interaction() {
        var _this = 
        // Call super
        _super.call(this) || this;
        /**
         * An indicator of global events were already initialized.
         *
         * @type {boolean}
         */
        _this._globalEventsAdded = false;
        /**
         * Holds which mouse event listeners to use.
         *
         * @type {Object}
         */
        _this._pointerEvents = {
            "pointerdown": "mousedown",
            "pointerup": "mouseup",
            "pointermove": "mousemove",
            "wheel": "wheel"
        };
        /**
         * Indicates if Interaction should use only "pointer" type events, like
         * "pointermove", available in all modern browsers, ignoring "legacy"
         * events, like "touchmove".
         *
         * @type {boolean}
         */
        _this._usePointerEventsOnly = false;
        /**
         * Indicates if passive mode options is supported by this browser.
         *
         * @type {boolean}
         */
        _this._passiveSupported = false;
        /**
         * Holds list of delayed events
         *
         * @type {IDelayedEvent[]}
         */
        _this._delayedEvents = { out: [] };
        /**
         * List of objects that current have a pointer hovered over them.
         *
         * @type {List<InteractionObject>}
         */
        _this.overObjects = new List();
        /**
         * List of objects that currently has a pressed pointer.
         *
         * @type {List<InteractionObject>}
         */
        _this.downObjects = new List();
        /**
         * List of objects that need mouse position to be reported to them.
         *
         * @type {List<InteractionObject>}
         */
        _this.trackedObjects = new List();
        /**
         * List of objects that are currently being dragged.
         *
         * @type {List<InteractionObject>}
         */
        _this.transformedObjects = new List();
        /**
         * Holds all known pointers.
         *
         * @type {Dictionary<string, IPointer>}
         */
        _this.pointers = new Dictionary();
        /**
         * Inertia options that need to be applied to after element drag, if it's
         * `inert = true`.
         *
         * This is just a default, which can and probably will be overridden by
         * actual elements.
         *
         * @type {Dictionary}
         */
        _this.inertiaOptions = new Dictionary();
        /**
         * Default options for click events. These can be overridden in
         * [[InteractionObject]].
         *
         * @type {IHitOptions}
         */
        _this.hitOptions = {
            "holdTime": 1000,
            "doubleHitTime": 300,
            "delayFirstHit": false,
            "hitTolerance": 10,
            "noFocus": true
        };
        /**
         * Default options for hover events. These can be overridden in
         * [[InteractionObject]].
         *
         * @type {IHoverOptions}
         */
        _this.hoverOptions = {
            "touchOutBehavior": "leave",
            "touchOutDelay": 1000
        };
        /**
         * Default options for detecting a swipe gesture. These can be overridden in
         * [[InteractionObject]].
         *
         * @type {ISwipeOptions}
         */
        _this.swipeOptions = {
            "time": 500,
            "verticalThreshold": 75,
            "horizontalThreshold": 30
        };
        /**
         * Default options for keyboard operations. These can be overridden in
         * [[InteractionObject]].
         *
         * @type {IKeyboarOptions}
         */
        _this.keyboardOptions = {
            "speed": 0.1,
            "accelleration": 1.2,
            "accellerationDelay": 1000
        };
        // Set class name
        _this.className = "Interaction";
        // Create InteractionObject for <body>
        _this.body = _this.getInteraction(document.body);
        _this._disposers.push(_this.body);
        // Detect browser capabilities and determine what event listeners to use
        if (window.hasOwnProperty("PointerEvent")) {
            // IE10+/Edge without touch controls enabled
            _this._pointerEvents.pointerdown = "pointerdown";
            _this._pointerEvents.pointerup = "pointerup";
            _this._pointerEvents.pointermove = "pointermove";
            _this._usePointerEventsOnly = true;
        }
        else if (window.hasOwnProperty("MSPointerEvent")) {
            // IE9
            _this._pointerEvents.pointerdown = "MSPointerDown";
            _this._pointerEvents.pointerup = "MSPointerUp";
            _this._pointerEvents.pointermove = "MSPointerMove";
            _this._usePointerEventsOnly = true;
        }
        else {
            // uses defaults for normal browsers
        }
        // Detect proper mouse wheel events
        if ("onwheel" in document.createElement("div")) {
            // Modern browsers
            _this._pointerEvents.wheel = "wheel";
        }
        else if ($type.hasValue(document.onmousewheel)) {
            // Webkit and IE support at least "mousewheel"
            _this._pointerEvents.wheel = "mousewheel";
        }
        else {
            // The rest of the legacy browsers
            _this._pointerEvents.wheel = "DOMMouseScroll";
        }
        // Set up default inertia options
        _this.inertiaOptions.setKey("move", {
            "time": 100,
            "duration": 500,
            "factor": 1,
            "easing": $ease.polyOut3
        });
        _this.inertiaOptions.setKey("resize", {
            "time": 100,
            "duration": 500,
            "factor": 1,
            "easing": $ease.polyOut3
        });
        _this.inertiaOptions.setKey("rotate", {
            "time": 100,
            "duration": 500,
            "factor": 1,
            "easing": $ease.polyOut3
        });
        // Check for passive mode support
        try {
            var target_1 = _this;
            var options = Object.defineProperty({}, "passive", {
                get: function () {
                    target_1._passiveSupported = true;
                }
            });
            window.addEventListener("test", options, options);
            window.removeEventListener("test", options, options);
        }
        catch (err) {
            _this._passiveSupported = false;
        }
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Interaction.prototype.debug = function () { };
    /**
     * ==========================================================================
     * Processing
     * ==========================================================================
     * @hidden
     */
    /**
     * Sets up global events.
     *
     * We need this so that we can track drag movement beyond chart's container.
     *
     * @ignore Exclude from docs
     */
    Interaction.prototype.addGlobalEvents = function () {
        var _this = this;
        if (!this._globalEventsAdded) {
            this._disposers.push(addEventListener(document, this._pointerEvents.pointermove, function (ev) { _this.handleGlobalPointerMove(ev); }));
            this._disposers.push(addEventListener(document, this._pointerEvents.pointerdown, function (ev) { _this.handleGlobalPointerDown(ev); }));
            this._disposers.push(addEventListener(document, this._pointerEvents.pointerup, function (ev) { _this.handleGlobalPointerUp(ev); }));
            this._disposers.push(addEventListener(document, "touchend", function (ev) { _this.handleGlobalTouchEnd(ev); }));
            if (!this._usePointerEventsOnly) {
                this._disposers.push(addEventListener(document, "touchmove", function (ev) { _this.handleGlobalTouchMove(ev); }));
                this._disposers.push(addEventListener(document, "touchstart", function (ev) { _this.handleGlobalTouchStart(ev); }));
            }
            this._disposers.push(addEventListener(document, "keydown", function (ev) { _this.handleGlobalKeyDown(ev); }));
            this._disposers.push(addEventListener(document, "keyup", function (ev) { _this.handleGlobalKeyUp(ev); }));
            this._globalEventsAdded = true;
        }
    };
    /**
     * Sets if [[InteractionObject]] is clickable.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject} io [[InteractionObject]] instance
     */
    Interaction.prototype.processClickable = function (io) {
        // Add or remove touch events
        this.processTouchable(io);
    };
    /**
     * Sets if [[InteractionObject]] is hoverable.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject} io [[InteractionObject]] instance
     */
    Interaction.prototype.processHoverable = function (io) {
        var _this = this;
        if (io.hoverable || io.trackable) {
            // Add global events
            this.addGlobalEvents();
            // Add hover styles
            this.applyCursorOverStyle(io);
            // Add local events
            if (!io.eventDisposers.hasKey("hoverable")) {
                io.eventDisposers.setKey("hoverable", new MultiDisposer([
                    addEventListener(io.element, "mouseover", function (e) { return _this.handleMouseOver(io, e); }),
                    addEventListener(io.element, "mouseout", function (e) { return _this.handleMouseOut(io, e); })
                ]));
            }
            if (io.trackable) {
                //sprite.addEventListener("touchmove", this.handleTouchMove, false, this);
            }
        }
        else {
            var disposer = io.eventDisposers.getKey("hoverable");
            if (disposer != null) {
                disposer.dispose();
                io.eventDisposers.removeKey("hoverable");
            }
        }
        // Add or remove touch events
        this.processTouchable(io);
    };
    /**
     * Sets up [[InteractionObject]] as movable. Movable can be any
     * transformation, e.g. drag, swipe, resize, track, or rotate.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    Interaction.prototype.processMovable = function (io) {
        // Add unified events
        if (io.draggable || io.swipeable || io.trackable || io.resizable || io.rotatable) {
            // Prep the element
            if (!this.isGlobalElement(io)) {
                this.prepElement(io);
            }
            // Add hover styles
            this.applyCursorOverStyle(io);
        }
        // Add or remove touch events
        this.processTouchable(io);
    };
    /**
     * Checks if [[InteractionObject]] is trackable and sets relative events.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    Interaction.prototype.processTrackable = function (io) {
        this.processHoverable(io);
        this.processMovable(io);
        if (io.trackable) {
            this.trackedObjects.moveValue(io);
        }
        else {
            this.trackedObjects.removeValue(io);
        }
    };
    /**
     * Checks if [[InteractionObject]] is draggable.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    Interaction.prototype.processDraggable = function (io) {
        this.processMovable(io);
    };
    /**
     * Checks if [[InteractionObject]] is swipeable and sets relative events.
     *
     * A swipe event is triggered when a horizontal drag of 75px or more (and
     * less than 30px vertically) occurs within 700 milliseconds. This can be
     * overridden in sprites [[swipeOptions]].
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    Interaction.prototype.processSwipeable = function (io) {
        this.processMovable(io);
    };
    /**
     * Checks if [[InteractionObject]] is resizable and attaches required events
     * to it.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    Interaction.prototype.processResizable = function (io) {
        this.processMovable(io);
    };
    /**
     * Checks if [[InteractionObject]] is rotatable and attaches required events
     * to it.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    Interaction.prototype.processRotatable = function (io) {
        this.processMovable(io);
    };
    /**
     * Checks if [[InteractionObject]] is supposed to capture mouse wheel events
     * and prepares it to catch those events.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    Interaction.prototype.processWheelable = function (io) {
        var _this = this;
        if (io.wheelable) {
            io.hoverable = true;
            if (!io.eventDisposers.hasKey("wheelable")) {
                io.eventDisposers.setKey("wheelable", addEventListener(io.element, this._pointerEvents.wheel, function (e) { return _this.handleMouseWheel(io, e); }));
            }
        }
        else {
            var disposer = io.eventDisposers.getKey("wheelable");
            if (disposer != null) {
                disposer.dispose();
                io.eventDisposers.removeKey("wheelable");
            }
        }
    };
    /**
     * Checks if [[InteractionObject]] is focusable. A focusable element is an
     * element that will be highlighted when users presses TAB key. If the
     * element is focusable, this function will attach relative focus/blur
     * events to it.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    Interaction.prototype.processFocusable = function (io) {
        var _this = this;
        if (io.focusable === true && (io.tabindex > -1)) {
            if (!io.eventDisposers.hasKey("focusable")) {
                io.eventDisposers.setKey("focusable", new MultiDisposer([
                    addEventListener(io.element, "focus", function (e) { return _this.handleFocus(io, e); }),
                    addEventListener(io.element, "blur", function (e) { return _this.handleBlur(io, e); }),
                    addEventListener(io.element, this._pointerEvents.pointerdown, function (e) { return _this.handleFocusBlur(io, e); }),
                    addEventListener(io.element, "touchstart", function (e) { return _this.handleFocusBlur(io, e); }, this._passiveSupported ? { passive: false } : false)
                ]));
            }
        }
        else {
            var disposer = io.eventDisposers.getKey("focusable");
            if (disposer != null) {
                disposer.dispose();
                io.eventDisposers.removeKey("focusable");
            }
        }
    };
    /**
     * Checks if [[InteractionObject]] is "touchable". It means any interaction
     * whatsoever: mouse click, touch screen tap, swipe, drag, resize, etc.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    Interaction.prototype.processTouchable = function (io) {
        var _this = this;
        // Add unified events
        if (io.clickable || io.hoverable || io.trackable || io.draggable || io.swipeable || io.resizable || io.rotatable) {
            // Add global events
            this.addGlobalEvents();
            // Add local events
            if (!io.eventDisposers.hasKey("touchable")) {
                io.eventDisposers.setKey("touchable", new MultiDisposer([
                    addEventListener(io.element, this._pointerEvents.pointerdown, function (e) { return _this.handlePointerDown(io, e); }),
                    addEventListener(io.element, "touchstart", function (e) { return _this.handleTouchDown(io, e); }, this._passiveSupported ? { passive: false } : false)
                ]));
            }
        }
        else {
            var disposer = io.eventDisposers.getKey("touchable");
            if (disposer != null) {
                disposer.dispose();
                io.eventDisposers.removeKey("touchable");
            }
        }
    };
    /**
     * ==========================================================================
     * Non-pointer events
     * ==========================================================================
     * @hidden
     */
    /**
     * Dispatches "focus" event when element gains focus.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     * @param {FocusEvent}         ev  Original event
     */
    Interaction.prototype.handleFocus = function (io, ev) {
        if (!io.focusable) {
            ev.preventDefault();
            return;
        }
        io.isFocused = true;
        if (io.events.isEnabled("focus")) {
            var imev = {
                type: "focus",
                target: io,
                event: ev
            };
            io.events.dispatchImmediately("focus", imev);
        }
    };
    /**
     * Used by regular click events to prevent focus if "noFocus" is set.
     *
     * This should not be called by "focus" handlers.
     *
     * @param {InteractionObject}  io  Element
     * @param {MouseEvent | TouchEvent}         ev  Original event
     */
    Interaction.prototype.handleFocusBlur = function (io, ev) {
        if (io.focusable !== false && this.getHitOption(io, "noFocus")) {
            ev.preventDefault();
            $dom.blur();
        }
    };
    /**
     * Dispatches "blur" event when element loses focus.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     * @param {FocusEvent}         ev  Original event
     */
    Interaction.prototype.handleBlur = function (io, ev) {
        if (!io.focusable) {
            ev.preventDefault();
            return;
        }
        io.isFocused = false;
        if (io.events.isEnabled("blur")) {
            var imev = {
                type: "blur",
                target: io,
                event: ev
            };
            io.events.dispatchImmediately("blur", imev);
        }
    };
    /**
     * ==========================================================================
     * Global keyboard-related even handlers
     * ==========================================================================
     * @hidden
     */
    /**
     * Checks if there is an item that has currently focus and that they key is
     * one of the directional keys. If both of the conditions are true, it
     * creates an object to simulate movement of dragable element with keyboard.
     *
     * @ignore Exclude from docs
     * @param {KeyboardEvent} ev An original keyboard event
     */
    Interaction.prototype.handleGlobalKeyDown = function (ev) {
        if (this.focusedObject) {
            if (keyboard.isKey(ev, "esc")) {
                // ESC removes focus
                $dom.blur();
            }
            else if (this.focusedObject.draggable && keyboard.isKey(ev, ["up", "down", "left", "right"])) {
                // Prevent scrolling of the document
                ev.preventDefault();
                // Get focused object
                var io = this.focusedObject;
                // Get particular key
                var disposerKey = "interactionKeyboardObject";
                // If such disposer already exists we know the event is going on so we
                // just move on
                if (io.eventDisposers.hasKey(disposerKey)) {
                    return;
                }
                // Create a keyboard mover
                var ko = new InteractionKeyboardObject(io, ev);
                io.eventDisposers.setKey(disposerKey, ko);
                switch (keyboard.getEventKey(ev)) {
                    case "up":
                        ko.directionY = -1;
                        break;
                    case "down":
                        ko.directionY = 1;
                        break;
                    case "left":
                        ko.directionX = -1;
                        break;
                    case "right":
                        ko.directionX = 1;
                        break;
                }
            }
        }
    };
    /**
     * Dispatches related events when the keyboard key is realeasd.
     *
     * @ignore Exclude from docs
     * @param {KeyboardEvent} ev An original keyboard event
     */
    Interaction.prototype.handleGlobalKeyUp = function (ev) {
        var disposerKey = "interactionKeyboardObject";
        if (this.focusedObject) {
            var disposer = this.focusedObject.eventDisposers.getKey(disposerKey);
            if (disposer != null) {
                // Prevent scrolling of the document
                ev.preventDefault();
                // Dispose stuff
                disposer.dispose();
                this.focusedObject.eventDisposers.removeKey(disposerKey);
            }
        }
    };
    /**
     * ==========================================================================
     * Global pointer-related even handlers
     * ==========================================================================
     * @hidden
     */
    /**
     * Handler for a global "pointermove" event.
     *
     * @ignore Exclude from docs
     * @param {MouseEvent} ev Event object
     */
    Interaction.prototype.handleGlobalPointerMove = function (ev) {
        // Get pointer
        var pointer = this.getPointer(ev);
        // Prepare and fire global event
        if (this.events.isEnabled("track")) {
            var imev = {
                type: "track",
                target: this,
                event: ev,
                pointer: pointer
            };
            this.events.dispatchImmediately("track", imev);
        }
        // Track
        this.addBreadCrumb(pointer, pointer.point);
        // Process further
        this.handleMove(pointer, ev);
    };
    /**
     * Handler for a global "pointerdown" event.
     *
     * @ignore Exclude from docs
     * @param {MouseEvent} ev Event object
     */
    Interaction.prototype.handleGlobalPointerDown = function (ev) {
        // Remove delayed hovers
        this.processDelayed();
        // Get pointer
        var pointer = this.getPointer(ev);
        // Prepare and fire global event
        if (this.events.isEnabled("down")) {
            var imev = {
                type: "down",
                target: this,
                event: ev,
                pointer: pointer
            };
            this.events.dispatchImmediately("down", imev);
        }
    };
    /**
     * Prevents touch action from firing.
     *
     * @ignore Exclude from docs
     * @param {MouseEvent} ev Event
     */
    Interaction.prototype.preventTouchAction = function (ev) {
        if (!ev.defaultPrevented) {
            ev.preventDefault();
        }
    };
    /**
     * Handler for a global "pointerup" event.
     *
     * @ignore Exclude from docs
     * @param {MouseEvent} ev Event object
     */
    Interaction.prototype.handleGlobalPointerUp = function (ev) {
        // Get pointer
        var pointer = this.getPointer(ev);
        // Prepare and fire global event
        if (this.events.isEnabled("up")) {
            var imev = {
                type: "up",
                target: this,
                event: ev,
                pointer: pointer
            };
            this.events.dispatchImmediately("up", imev);
        }
        // Process further
        this.handleUp(pointer, ev);
    };
    /**
 * ==========================================================================
 * Global touch-related even handlers
 * ==========================================================================
 */
    /**
     * Handler for a global "touchmove" event.
     *
     * @ignore Exclude from docs
     * @param {TouchEvent} ev Event object
     */
    Interaction.prototype.handleGlobalTouchMove = function (ev) {
        // Stop further propagation so we don't get multiple triggers on hybrid
        // devices (both mouse and touch capabilities)
        /*ev.stopPropagation();
        if (ev.defaultPrevented) {
            ev.preventDefault();
        }*/
        // Process each changed touch point
        for (var i = 0; i < ev.changedTouches.length; i++) {
            // Get pointer
            var pointer = this.getPointer(ev.changedTouches[i]);
            // Prepare and fire global event
            if (this.events.isEnabled("track")) {
                var imev = {
                    type: "track",
                    target: this,
                    event: ev,
                    pointer: pointer
                };
                this.events.dispatchImmediately("track", imev);
            }
            // Track
            this.addBreadCrumb(pointer, pointer.point);
            // Process further
            this.handleMove(pointer, ev);
        }
    };
    /**
     * Handler for a global "touchstart" event.
     *
     * @ignore Exclude from docs
     * @param {TouchEvent} ev Event object
     */
    Interaction.prototype.handleGlobalTouchStart = function (ev) {
        // Stop further propagation so we don't get multiple triggers on hybrid
        // devices (both mouse and touch capabilities)
        /*ev.preventDefault();
        if (ev.defaultPrevented) {
            ev.stopPropagation();
        }*/
        // Process each changed touch point
        for (var i = 0; i < ev.changedTouches.length; i++) {
            // Get pointer
            var pointer = this.getPointer(ev.changedTouches[i]);
            // Prepare and fire global event
            if (!this._usePointerEventsOnly && this.events.isEnabled("down")) {
                var imev = {
                    type: "down",
                    target: this,
                    event: ev,
                    pointer: pointer
                };
                this.events.dispatchImmediately("down", imev);
            }
        }
    };
    /**
     * Handler for a global "touchend" event.
     *
     * @ignore Exclude from docs
     * @param {TouchEvent} ev Event object
     */
    Interaction.prototype.handleGlobalTouchEnd = function (ev) {
        // Stop further propagation so we don't get multiple triggers on hybrid
        // devices (both mouse and touch capabilities)
        /*ev.stopPropagation();
        if (ev.defaultPrevented) {
            ev.preventDefault();
        }*/
        // Process each changed touch point
        for (var i = 0; i < ev.changedTouches.length; i++) {
            // Get pointer
            var pointer = this.getPointer(ev.changedTouches[i]);
            // Prepare and fire global event
            if (this.events.isEnabled("up")) {
                var imev = {
                    type: "up",
                    target: this,
                    event: ev,
                    pointer: pointer
                };
                this.events.dispatchImmediately("up", imev);
            }
            // Handle element-related events
            this.handleUp(pointer, ev);
        }
    };
    /**
     * ==========================================================================
     * Element-specific pointer-related even handlers
     * ==========================================================================
     * @hidden
     */
    /**
     * Handles event when pointer is over [[InteractionObject]] and button is
     * pressed.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}          io  Element
     * @param {MouseEvent | PointerEvent}  ev  Original event
     */
    Interaction.prototype.handlePointerDown = function (io, ev) {
        // Stop further propagation so we don't get multiple triggers on hybrid
        // devices (both mouse and touch capabilities)
        //ev.preventDefault();
        //ev.stopPropagation();
        //if (ev.defaultPrevented) {
        //}
        // Get pointer
        var pointer = this.getPointer(ev);
        // Set mouse button
        pointer.button = ev.which;
        // Reset pointer
        this.resetPointer(pointer);
        // Process down
        this.handleDown(io, pointer, ev);
    };
    /**
     * Handles event when [[InteractionObject]] is hovered by a mouse pointer.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     * @param {MouseEvent}         ev  Original event
     */
    Interaction.prototype.handleMouseOver = function (io, ev) {
        // Get pointer
        var pointer = this.getPointer(ev);
        // Lock wheel
        if (io.wheelable) {
            this.lockWheel();
        }
        // Process down
        this.handleOver(io, pointer, ev);
    };
    /**
     * Handles event when [[InteractionObject]] loses hover from a mouse pointer.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     * @param {MouseEvent}         ev  Original event
     */
    Interaction.prototype.handleMouseOut = function (io, ev) {
        // Get pointer
        var pointer = this.getPointer(ev);
        // Lock wheel
        if (io.wheelable) {
            this.unlockWheel();
        }
        // Process down
        this.handleOut(io, pointer, ev);
    };
    /**
     * Handles event when mouse wheel is crolled over the [[InteractionObject]].
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     * @param {WheelEvent}         ev  Original event
     * @todo Investigate more-cross browser stuff https://developer.mozilla.org/en-US/docs/Web/Events/wheel
     */
    Interaction.prototype.handleMouseWheel = function (io, ev) {
        // Get pointer
        var pointer = this.getPointer(ev);
        // Init delta values
        var deltaX = 0, deltaY = 0;
        // Calculate deltas
        if (ev instanceof WheelEvent) {
            deltaX = Math.round(ev.deltaX);
            deltaY = Math.round(ev.deltaY);
        }
        else {
            throw new Error("Invalid event type");
        }
        // Handle the event
        this.handleWheel(io, pointer, deltaX, deltaY, ev);
    };
    /**
     * ==========================================================================
     * Element-specific touch-related even handlers
     * ==========================================================================
     * @hidden
     */
    /**
      * Handles an event when an [[InteractionObject]] is touched on a touch
      * device.
      *
      * @ignore Exclude from docs
      * @param {InteractionObject}  io  Element
      * @param {TouchEvent}         ev  Original event
      */
    Interaction.prototype.handleTouchDown = function (io, ev) {
        // Stop further propagation so we don't get multiple triggers on hybrid
        // devices (both mouse and touch capabilities)
        // We're disabling this here because it's impossible to cancel touch
        // event otherwise, and it might be needed in order to control default
        // touch gestures.
        /*if (this._usePointerEventsOnly) {
            return;
        }*/
        // Process each changed touch point
        for (var i = 0; i < ev.changedTouches.length; i++) {
            // Get pointer
            var pointer = this.getPointer(ev.changedTouches[i]);
            // Reset pointer
            this.resetPointer(pointer);
            // Process down
            this.handleDown(io, pointer, ev);
        }
    };
    /**
     * ==========================================================================
     * Universal handlers
     * ==========================================================================
     * @hidden
     */
    /**
     * Handles click/tap. Checks for doublehit.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Interaction object
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    Interaction.prototype.handleHit = function (io, pointer, ev) {
        // Check if this is a double-hit
        var now = new Date().getTime();
        if (io.lastHit && (io.lastHit >= (now - this.getHitOption(io, "doubleHitTime")))) {
            // Yup - it's a double-hit
            // Cancel the hit
            //clearTimeout(io.lastHitPointer.hitTimeout);
            // Clear last hit
            io.lastHit = undefined;
            io.lastHitPointer = undefined;
            // Dispatch event
            if (io.events.isEnabled("doublehit")) {
                var imev = {
                    type: "doublehit",
                    target: io,
                    point: pointer.point,
                    event: ev
                };
                io.events.dispatchImmediately("doublehit", imev);
            }
        }
        else {
            // Log last hit
            io.lastHit = now;
            io.lastHitPointer = pointer;
            if (this.getHitOption(io, "delayFirstHit")) {
                // Schedule hit report event to element
                /*io.lastHitPointer.hitTimeout = setTimeout(() => {
                    if (pointer.button === 3) {
                        if (io.events.isEnabled("rightclick")) {
                            let imev: AMEvent<InteractionObject, InteractionObjectEvents>["rightclick"] = {
                                type: "rightclick",
                                target: io,
                                event: ev
                            };
                            io.events.dispatchImmediately("rightclick", imev);
                        }

                    } else {
                        if (io.events.isEnabled("hit")) {
                            let imev: AMEvent<InteractionObject, InteractionObjectEvents>["hit"] = {
                                type: "hit",
                                target: io,
                                event: ev,
                                point: pointer.point
                            };
                            io.events.dispatchImmediately("hit", imev);
                        }
                    }
                }, this.getHitOption(io, "doubleHitTime"));*/
            }
            else {
                if (pointer.button === 3) {
                    // Execute HIT now
                    if (io.events.isEnabled("rightclick")) {
                        var imev = {
                            type: "rightclick",
                            target: io,
                            event: ev
                        };
                        io.events.dispatchImmediately("rightclick", imev);
                    }
                }
                else {
                    if (io.events.isEnabled("hit")) {
                        var imev = {
                            type: "hit",
                            target: io,
                            event: ev,
                            point: pointer.point
                        };
                        io.events.dispatchImmediately("hit", imev);
                    }
                }
            }
        }
    };
    /**
     * Handles pointer hovering over [[InteractionObject]].
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Interaction object
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    Interaction.prototype.handleOver = function (io, pointer, ev) {
        if (!io.hoverable) {
            return;
        }
        // We need to check if pointer already exists in the downPointers so we
        // don't end up with duplicate pointers. This could happen on hybrid
        // displays where both touch and pointer event is generated on screen
        // touch.
        if (this.pointerExists(io.overPointers, pointer)) {
            return;
        }
        // Add pointer to object
        io.overPointers.moveValue(pointer);
        // First one?
        if (io.overPointers.length === 1) {
            // Add to hovered elements (moved to InteractionObject)
            //this.overObjects.moveValue(io);
            // Report event to interaction object (but only for the first time)
            if (!io.isHover) {
                // Set element as hovered
                io.isHover = true;
                // Generate body track event. This is needed so that if element loads
                // under unmoved mouse cursor, we still need all the actions that are
                // required to happen to kick in.
                this.handleTrack(this.body, pointer, ev, true);
                // Event
                if (io.events.isEnabled("over")) {
                    var imev = {
                        type: "over",
                        target: io,
                        event: ev,
                        pointer: pointer
                    };
                    io.events.dispatchImmediately("over", imev);
                }
            }
        }
    };
    /**
     * Handles when [[InteractionObject]] is no longer hovered.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Interaction object
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    Interaction.prototype.handleOut = function (io, pointer, ev, ignoreBehavior) {
        var _this = this;
        if (ignoreBehavior === void 0) { ignoreBehavior = false; }
        if (!io.hoverable) {
            return;
        }
        // Remove pointer from object
        io.overPointers.removeValue(pointer);
        // If there are no over and down pointers left, report OUT event
        // We need to check downPointers here because we might be dragging an item
        // that is constrained to certain area, but the mouse is already outside
        // that area. In this case we don't want to trigger an out event, not until
        // down pointer is rised.
        if (io.overPointers.length === 0) {
            // Remove from hovered objects (moved to InteractionObject)
            //this.overObjects.removeValue(io);
            // Report event to InteractionObject (but only when the last hover leaves)
            if (io.isHover) {
                if (io.downPointers.length === 0) {
                    // Check touch behavior, but only if the pointer did not move
                    if (!ignoreBehavior && pointer.touch && !this.moved(pointer, this.getHitOption(io, "hitTolerance"))) {
                        var behavior = this.getHoverOption(io, "touchOutBehavior");
                        if (behavior == "leave") {
                            // Set to "leave", so we do not execute any "out" event.
                            // It will be handled by any other interaction that happens
                            // afterwards.
                            this._delayedEvents.out.push({
                                type: "out",
                                io: io,
                                pointer: pointer,
                                event: ev
                            });
                            return;
                        }
                        else if (behavior == "delay" && this.getHoverOption(io, "touchOutDelay")) {
                            this._delayedEvents.out.push({
                                type: "out",
                                io: io,
                                pointer: pointer,
                                event: ev,
                                timeout: setTimeout(function () {
                                    _this.handleOut(io, pointer, ev, true);
                                }, this.getHoverOption(io, "touchOutDelay"))
                            });
                            return;
                        }
                        else {
                            // Nothing for "remove" - that's how it works "out-of-the-box"
                        }
                    }
                    // Generate body track event. This is needed so that if element loads
                    // under unmoved mouse cursor, we still need all the actions that are
                    // required to happen to kick in.
                    this.handleTrack(this.body, pointer, ev, true);
                    if (io.lastOutEvent) {
                        io.lastOutEvent = undefined;
                    }
                    io.isHover = false;
                    if (io.events.isEnabled("out")) {
                        var imev = {
                            type: "out",
                            target: io,
                            event: ev,
                            pointer: pointer
                        };
                        io.events.dispatchImmediately("out", imev);
                    }
                }
                else {
                    io.lastOutEvent = ev;
                }
            }
        }
    };
    /**
     * Performs tasks on pointer down.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Element
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    Interaction.prototype.handleDown = function (io, pointer, ev) {
        // Remove delayed hovers
        this.processDelayed();
        // Stop inertia animations if they're currently being played out
        if (io.inert) {
            this.stopInertia(io);
        }
        // Reset hover status if it's a touch pointer
        // @todo Check if we need to keep this
        /*if (pointer.touch && io.overPointers.length) {
            while (io.overPointers.length) {
                this.handleOut(io, io.overPointers.getIndex(0), ev);
            }
            io.isHover = false;
        }*/
        // Log last down event
        pointer.lastDownEvent = ev;
        // Add Pointer in object
        // We need to check if pointer already exists in the downPointers so we
        // don't end up with duplicate pointers. This could happen on hybrid
        // displays where both touch and pointer event is generated on screen
        // touch.
        if (!this.pointerExists(io.downPointers, pointer)) {
            //return;
            io.downPointers.moveValue(pointer);
        }
        // Lose focus if needed
        if (io.focusable !== false && this.getHitOption(io, "noFocus")) {
            if (this.focusedObject) {
                $dom.blur();
            }
            if (!this.isGlobalElement(io)) {
                ev.preventDefault();
            }
        }
        io.isDown = true;
        // Report event
        if (io.events.isEnabled("down")) {
            var imev = {
                type: "down",
                target: io,
                event: ev,
                pointer: pointer
            };
            io.events.dispatchImmediately("down", imev);
        }
        // Apply styles if necessary
        this.applyCursorDownStyle(io, pointer);
        // Check if element is already hovered
        // (can't be pressed down without hovering)
        this.handleOver(io, pointer, ev);
        // First down pointer?
        if (io.downPointers.length === 1) {
            // Start hold timeout
            /*pointer.holdTimeout = setTimeout(() => {
                if (io.events.isEnabled("hold")) {
                    let imev: AMEvent<InteractionObject, InteractionObjectEvents>["hold"] = {
                        type: "hold",
                        target: io,
                        event: ev,
                        pointer: pointer
                    };
                    io.events.dispatchImmediately("hold", imev);
                }
            }, this.getHitOption(io, "holdTime"));*/
        }
        else {
            this.cancelHold(io);
        }
        // If element is draggable we prepare and postpone DRAG_START event (until
        // it is actually moved)
        if (io.draggable) {
            this.processDragStart(io, pointer, ev);
        }
        // Set up swipe timeout
        if (io.swipeable) {
            pointer.swipeCanceled = false;
            /*pointer.swipeTimeout = setTimeout(function() {
                pointer.swipeCanceled = true;
            }, this.getSwipeOption(io, "time"));*/
        }
    };
    /**
     * Handles pointer move.
     *
     * @ignore Exclude from docs
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    Interaction.prototype.handleMove = function (pointer, ev) {
        var _this = this;
        // Process hovered elements
        // We check if the element became unhovered without reporting the mouseout
        // event. (it happens in some cases)
        if (!pointer.touch) {
            $iter.each(this.overObjects.backwards().iterator(), function (io) {
                // Is this pointer relevant to element?
                if (io.overPointers.contains(pointer) && io.hoverable) {
                    // Check if the element is still hovered
                    var reset = false;
                    if (io.element && pointer.lastEvent) {
                        if (!$dom.contains(io.element, pointer.lastEvent.target)) {
                            reset = true;
                        }
                    }
                    else {
                        reset = true;
                    }
                    if (reset) {
                        _this.handleOut(io, pointer, ev);
                    }
                }
            });
        }
        // Override only if we have objects currently being dragged or otherwise
        // interacted with
        if (this.transformedObjects.length) {
            ev.preventDefault();
        }
        // Process down elements
        $iter.each(this.transformedObjects.backwards().iterator(), function (io) {
            // Is this pointer relevant to element?
            if (io.downPointers.contains(pointer) &&
                // Swipe still happening?
                !(io.swipeable && _this.swiping(io, pointer)) &&
                (io.draggable || io.resizable || io.rotatable)) {
                _this.handleTransform(io, ev);
            }
        });
        // Process tracked elements
        $iter.each(this.trackedObjects.backwards().iterator(), function (io) {
            // Is this pointer relevant to element?
            // @todo check if this is check is necessary
            /*if (!io.overPointers.contains(pointer)) {
                continue;
            }*/
            _this.handleTrack(io, pointer, ev);
        });
    };
    /**
     * Handles reporting of pointer movement.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io        Element
     * @param {IPointer}                 pointer    Pointer
     * @param {MouseEvent | TouchEvent}  ev         Original event
     * @param {boolean}                  skipCheck  Sould we skip check if cursor actually moved
     */
    Interaction.prototype.handleTrack = function (io, pointer, ev, skipCheck) {
        if (skipCheck === void 0) { skipCheck = false; }
        // Do nothing if the cursor did not actually move
        if (!skipCheck && !this.moved(pointer, 0)) {
            return;
        }
        // Initiate TRACK event
        if (io.events.isEnabled("track")) {
            var imev = {
                type: "track",
                target: io,
                event: ev,
                point: pointer.point,
                pointer: pointer
            };
            io.events.dispatchImmediately("track", imev);
        }
    };
    /**
     * Performs tasks on pointer up.
     *
     * @ignore Exclude from docs
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    Interaction.prototype.handleUp = function (pointer, ev) {
        var _this = this;
        // Log last up event
        pointer.lastUpEvent = ev;
        // Process hovered elements (but only if it's a touch pointer)
        if (pointer.touch) {
            $iter.each(this.overObjects.backwards().iterator(), function (io) {
                // Is this pointer relevant to element?
                if (io.overPointers.contains(pointer)) {
                    // Remove from over pointers
                    io.overPointers.removeValue(pointer);
                    // No over pointers left?
                    if (io.overPointers.length === 0) {
                        _this.handleOut(io, pointer, ev);
                        //this.overObjects.removeValue(io);
                        //io.isHover = false;
                    }
                }
            });
        }
        // Process down objects
        $iter.each(this.downObjects.backwards().iterator(), function (io) {
            // Is this pointer relevant to element?
            if (io && io.downPointers.contains(pointer)) {
                // Clear HOLD timeout just in case
                //this.cancelHold(io);
                // Restore styles
                _this.restoreCursorDownStyle(io, pointer);
                // Remove from over pointers
                io.downPointers.removeValue(pointer);
                // Initiate UP event
                if (io.events.isEnabled("up")) {
                    var imev = {
                        type: "up",
                        target: io,
                        event: ev,
                        pointer: pointer
                    };
                    io.events.dispatchImmediately("up", imev);
                }
                // Initiate delayed OUT event
                if (io.lastOutEvent) {
                    _this.handleOut(io, pointer, io.lastOutEvent);
                }
                // Handle swiping-related stuff
                if (io.swipeable && _this.swiped(io, pointer)) {
                    // Swiped - nothing else should happen
                    _this.handleSwipe(io, pointer, ev);
                }
                else {
                    // Check if it maybe a click
                    if (io.clickable && !_this.moved(pointer, _this.getHitOption(io, "hitTolerance"))) {
                        _this.handleHit(io, pointer, ev);
                    }
                    // Remove from down objects if no more pointers pressing down
                    if (io.downPointers.length === 0) {
                        io.isDown = false;
                    }
                    // Do extra work for inert draggable objects
                    if (io.inert && _this.moved(pointer, _this.getHitOption(io, "hitTolerance"))) {
                        _this.handleInertia(io, pointer);
                    }
                    else if (io.draggable) {
                        _this.processDragStop(io, pointer, ev);
                    }
                }
            }
        });
        // No more down pointers?
        /*if (this.transformedObjects.length === 0) {
            this.unlockDocument();
        }*/
        // Reset pointer
        this.resetPointer(pointer);
    };
    /**
     * Handles swipe action.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Element
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    Interaction.prototype.handleSwipe = function (io, pointer, ev) {
        // We pass in InteractionEvent with shift in mouse coordinates
        // between when the drag started and ended
        if (io.events.isEnabled("swipe")) {
            var imev = {
                type: "swipe",
                target: io,
                event: ev
            };
            io.events.dispatchImmediately("swipe", imev);
        }
        if (pointer.startPoint.x < pointer.point.x) {
            if (io.events.isEnabled("swiperight")) {
                var imev = {
                    type: "swiperight",
                    target: io,
                    event: ev
                };
                io.events.dispatchImmediately("swiperight", imev);
            }
        }
        else {
            if (io.events.isEnabled("swipeleft")) {
                var imev = {
                    type: "swipeleft",
                    target: io,
                    event: ev
                };
                io.events.dispatchImmediately("swipeleft", imev);
            }
        }
    };
    /**
     * Handles event triggering for wheel rotation.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     * @param {number}             deltaX   Horizontal shift
     * @param {number}             deltaY   Vertical shift
     * @param {WheelEvent}         ev       Original event
     */
    Interaction.prototype.handleWheel = function (io, pointer, deltaX, deltaY, ev) {
        var shift = {
            x: deltaX,
            y: deltaY
        };
        // Trigger generic WHEEL event
        if (io.events.isEnabled("swiperight")) {
            io.events.dispatchImmediately("wheel", {
                type: "wheel",
                target: io,
                event: ev,
                point: pointer.point,
                shift: shift
            });
        }
        // Trigger direction-specific events
        // Horizontal
        if (deltaX < 0) {
            if (io.events.isEnabled("wheelleft")) {
                io.events.dispatchImmediately("wheelleft", {
                    type: "wheelleft",
                    target: io,
                    event: ev,
                    point: pointer.point,
                    shift: shift
                });
            }
        }
        else if (deltaX > 0) {
            if (io.events.isEnabled("swiperight")) {
                io.events.dispatchImmediately("wheelright", {
                    type: "wheelright",
                    target: io,
                    event: ev,
                    point: pointer.point,
                    shift: shift
                });
            }
            // Vertical
        }
        else if (deltaY < 0) {
            if (io.events.isEnabled("wheelup")) {
                io.events.dispatchImmediately("wheelup", {
                    type: "wheelup",
                    target: io,
                    event: ev,
                    point: pointer.point,
                    shift: shift
                });
            }
        }
        else if (deltaY > 0) {
            if (io.events.isEnabled("wheeldown")) {
                io.events.dispatchImmediately("wheeldown", {
                    type: "wheeldown",
                    target: io,
                    event: ev,
                    point: pointer.point,
                    shift: shift
                });
            }
        }
    };
    /**
     * Initiates inertia checking sub-routines for different movement types:
     * drag, resize, rotate.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}   sprite
     * @param {IPointer}            pointer
     */
    Interaction.prototype.handleInertia = function (io, pointer) {
        if (io.draggable && io.downPointers.length === 0) {
            this.handleMoveInertia(io, pointer);
        }
        if (io.rotatable && io.downPointers.length === 1) {
            this.handleRotateInertia(io, pointer);
        }
        if (io.resizable && io.downPointers.length > 1) {
            this.handleResizeInertia(io, pointer);
        }
    };
    /**
     * Continues moving the element to simulate the effect of inertia. Happens
     * when `inert` and `draggable` object is dragged and then released.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     */
    Interaction.prototype.handleMoveInertia = function (io, pointer) {
        var interaction = io;
        var type = "move";
        var point = {
            "x": pointer.point.x,
            "y": pointer.point.y
        };
        var startPoint = {
            "x": pointer.startPoint.x,
            "y": pointer.startPoint.y
        };
        // Init inertia object
        var inertia = new Inertia(interaction, type, point, startPoint);
        // Get inertia data
        var ref = this.getTrailPoint(pointer, new Date().getTime() - this.getInertiaOption(io, "move", "time"));
        if (typeof ref === "undefined") {
            this.processDragStop(io, pointer, pointer.lastUpEvent);
            return;
        }
        // Init animation options
        var factor = this.getInertiaOption(io, "move", "factor");
        var animationOptions = [{
                "to": pointer.point.x + (pointer.point.x - ref.point.x) * factor,
                "property": "x"
            }, {
                "to": pointer.point.y + (pointer.point.y - ref.point.y) * factor,
                "property": "y"
            }];
        // Start animation
        var animation = new Animation(inertia, animationOptions, this.getInertiaOption(io, "move", "duration"), this.getInertiaOption(io, "move", "easing")).start();
        this._disposers.push(animation.events.on("animationended", function (ev) {
            inertia.done();
        }));
        // Add inertia object
        io.inertias.setKey("move", inertia);
    };
    /**
     * Continues rotation of a `rotatable` element after it is rotated and
     * released.
     *
     * **NOTE:** this is is just a placeholder function. No actual functionality
     * is implemented, yet.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     * @todo Implement functionality
     */
    Interaction.prototype.handleRotateInertia = function (io, pointer) {
        // Some day, folks. Some day...
    };
    /**
     * Continues resizing of a `resizable` element after it is resized and
     * released.
     *
     * **NOTE:** this is is just a placeholder function. No actual fucntionality
     * is implemented, yet.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     */
    Interaction.prototype.handleResizeInertia = function (io, pointer) {
        // Some day, folks. Some day...
    };
    /**
     * Recalculates element's position, size and rotation based on position of
     * all its related pointers.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io  Element
     * @param {MouseEvent | TouchEvent}  ev  Original event
     */
    Interaction.prototype.handleTransform = function (io, ev) {
        // Get primary pointer and its respective points
        var pointer1 = io.downPointers.getIndex(0);
        var point1 = null;
        var startPoint1 = null;
        if (pointer1) {
            point1 = pointer1.point;
            startPoint1 = pointer1.startPoint;
        }
        // Init secondary pointer
        var pointer2 = io.downPointers.getIndex(1);
        var point2;
        var startPoint2;
        // Determine if it's a sinngle pointer or multi
        var singlePoint = true;
        if ((io.downPointers.length > 1) && pointer2) {
            // Several pointers down
            singlePoint = false;
            // Get second pointer
            point2 = pointer2.point;
            startPoint2 = pointer2.startPoint;
        }
        else {
            // Just one pointer down
            singlePoint = true;
            // Use center of the sprite to simulate "second" point of touch
            point2 = {
                "x": io.originalPosition.x,
                "y": io.originalPosition.y
            };
            startPoint2 = point2;
        }
        // Primary touch point moved?
        var pointer1Moved = pointer1 && this.moved(pointer1, 0);
        // Report DRAG_START if necessary
        if (io.draggable && pointer1 && pointer1.dragStartEvents && pointer1.dragStartEvents.length && pointer1Moved) {
            if (io.events.isEnabled("dragstart")) {
                io.events.dispatchImmediately("dragstart", pointer1.dragStartEvents.shift());
            }
            //delete pointer1.dragStartEvents;
        }
        // Determine what we do in order of superiority
        if (singlePoint && io.draggable) {
            // We have only one pointer and the Sprite is draggable
            // There's nothing else to be done - just move it
            this.handleTransformMove(io, point1, startPoint1, ev, pointer1Moved);
        }
        else {
            // Check if second touch point moved
            var pointer2Moved = pointer2 && this.moved(pointer2, 0);
            if (io.draggable && io.resizable && io.rotatable) {
                //this.handleTransformAll(io, point1, startPoint1, point2, startPoint2, ev, pointer1Moved && pointer2Moved);
                this.handleTransformMove(io, point1, startPoint1, ev, pointer1Moved && pointer2Moved);
                this.handleTransformResize(io, point1, startPoint1, point2, startPoint2, ev, pointer1Moved && pointer2Moved);
                this.handleTransformRotate(io, point1, startPoint1, point2, startPoint2, ev, pointer1Moved && pointer2Moved);
            }
            else {
                if (io.draggable) {
                    this.handleTransformMove(io, point1, startPoint1, ev, pointer1Moved);
                }
                if (io.resizable) {
                    this.handleTransformResize(io, point1, startPoint1, point2, startPoint2, ev, pointer1Moved && pointer2Moved);
                }
                if (io.rotatable) {
                    this.handleTransformRotate(io, point1, startPoint1, point2, startPoint2, ev, pointer1Moved && pointer2Moved);
                }
            }
        }
    };
    /**
     * Handles movement of the dragged element.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}                        io            Element
     * @param {IPoint}                                   point         Current point of the pointer
     * @param {IPoint}                                   startPoint    Starting point of the pointer
     * @param {MouseEvent | TouchEvent | KeyboardEvent}  ev            Original event
     * @param {boolean}                                  pointerMoved  Did pointer move?
     */
    Interaction.prototype.handleTransformMove = function (io, point, startPoint, ev, pointerMoved) {
        if (pointerMoved) {
            if (io.events.isEnabled("drag")) {
                var imev = {
                    type: "drag",
                    target: io,
                    event: ev,
                    shift: {
                        "x": point.x - startPoint.x,
                        "y": point.y - startPoint.y
                    },
                    startPoint: startPoint,
                    point: point
                };
                io.events.dispatchImmediately("drag", imev);
            }
        }
    };
    /**
     * Handles resizing of the element.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io            Element
     * @param {IPoint}                   point1        Current position of reference point #1
     * @param {IPoint}                   startPoint1   Original position of reference point #1
     * @param {IPoint}                   point2        Current position of reference point #2
     * @param {IPoint}                   startPoint2   Original position of reference point #2
     * @param {MouseEvent | TouchEvent}  ev            Original event
     * @param {boolean}                  pointerMoved  Did pointer move?
     */
    Interaction.prototype.handleTransformResize = function (io, point1, startPoint1, point2, startPoint2, ev, pointerMoved) {
        if (io.events.isEnabled("resize")) {
            var imev = {
                type: "resize",
                target: io,
                event: ev,
                scale: $math.getScale(point1, startPoint1, point2, startPoint2),
                startPoint1: startPoint1,
                point1: point1,
                startPoint2: startPoint2,
                point2: point2
            };
            io.events.dispatchImmediately("resize", imev);
        }
    };
    /**
     * Hdanles rotation of the element.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io            Element
     * @param {IPoint}                   point1        Current position of reference point #1
     * @param {IPoint}                   startPoint1   Original position of reference point #1
     * @param {IPoint}                   point2        Current position of reference point #2
     * @param {IPoint}                   startPoint2   Original position of reference point #2
     * @param {MouseEvent | TouchEvent}  ev            Original event
     * @param {boolean}                  pointerMoved  Did pointer move?
     */
    Interaction.prototype.handleTransformRotate = function (io, point1, startPoint1, point2, startPoint2, ev, pointerMoved) {
        // Prepare {InteractionEvent} object
        if (io.events.isEnabled("rotate")) {
            var imev = {
                type: "rotate",
                target: io,
                event: ev,
                angle: $math.getRotation(point1, startPoint1, point2, startPoint2),
            };
            io.events.dispatchImmediately("rotate", imev);
        }
    };
    /**
     * Handles all the preparations of the element when it starts to be dragged.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Element
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    Interaction.prototype.processDragStart = function (io, pointer, ev) {
        // Add to draggedObjects
        this.transformedObjects.push(io);
        // Report "dragstart"
        var imev = {
            type: "dragstart",
            target: io,
            event: ev
        };
        /**
         * If pointer is set we will not fire the event until the pointer has
         * actually moved. If it's not set we don't have to wait for anything, so we
         * just fire off the event right away.
         */
        if (pointer && pointer.dragStartEvents) {
            pointer.dragStartEvents.push(imev);
        }
        else {
            io.dispatchImmediately("dragstart", imev);
        }
    };
    /**
     * Finishes up element drag operation.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Element
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    Interaction.prototype.processDragStop = function (io, pointer, ev) {
        // Pointer set?
        if (!pointer) {
            pointer = this.getDragPointer(io);
        }
        // Removed from transformedObjects
        this.transformedObjects.removeValue(io);
        // Unlock document
        //this.unlockDocument();
        // Report dragstop
        if (!pointer || this.moved(pointer, 0)) {
            if (io.events.isEnabled("dragstop")) {
                var imev = {
                    type: "dragstop",
                    target: io
                };
                io.events.dispatchImmediately("dragstop", imev);
            }
        }
    };
    /**
     * ==========================================================================
     * Controls for InteractionObjects initiating directly
     * ==========================================================================
     * @hidden
     */
    /**
     * Manually triggers drag start on the element. Could be useful in cases
     * where tracking or dragging one element can also influence dragging another
     * element.
     *
     * Passing in `pointer` reference is advisable. If not passed in it will try
     * to determine which pointer to attach to. However, it's better to specify
     * it explicitly.
     *
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     */
    Interaction.prototype.dragStart = function (io, pointer) {
        if (pointer || (pointer = this.getDragPointer(io))) {
            this.handleDown(io, pointer, pointer.lastDownEvent);
        }
    };
    /**
     * Manually ends drag on the element.
     *
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     */
    Interaction.prototype.dragStop = function (io, pointer) {
        if (pointer || (pointer = this.getDragPointer(io))) {
            this.handleUp(pointer, pointer.lastUpEvent);
        }
    };
    /**
     * This method uses a fuzzy logic to find the pointer to be used for dragging.
     * Beware that this is not a rock-solid solution. If there are a few objects
     * being dragged at the same time, you may get unexepected results.
     *
     * @param  {InteractionObject}   io  InteractionObject to get pointers from
     * @return {Optional<IPointer>}      Pointer currently being used for dragging
     */
    Interaction.prototype.getDragPointer = function (io) {
        if (io) {
            // InteractionObject is supplied
            // Use it's first down pointer
            return io.downPointers.getIndex(0);
        }
        else if (this.transformedObjects.length) {
            // Use first dragged object
            return this.getDragPointer(this.transformedObjects.getIndex(0));
        }
        else {
            return undefined;
        }
    };
    /**
     * ==========================================================================
     * Utils
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns pointer id for the given event object.
     *
     * @param  {any}     ev  Event
     * @return {string}      Pointer ID
     */
    Interaction.prototype.getPointerId = function (ev) {
        if ($type.hasValue(ev.identifier)) {
            return ev.identifier;
        }
        else if ($type.hasValue(ev.pointerId)) {
            return ev.pointerId;
        }
        else {
            return "1";
        }
    };
    /**
     * Returns [[Pointer]] object that is associated with the Event.
     *
     * If no such [[Pointer]] object exists, it is created.
     *
     * @param  {MouseEvent | Touch}  ev  Event
     * @return {IPointer}                Pointer
     */
    Interaction.prototype.getPointer = function (ev) {
        // Get pointer id
        var id = this.getPointerId(ev);
        // Get current coordinates
        var point = {
            "x": ev.clientX,
            "y": ev.clientY
        };
        // Look for the pointer in the Dictionary if it maybe already exists
        var pointer;
        if (this.pointers.hasKey(id)) {
            // We already have such pointer
            pointer = this.pointers.getKey(id);
            // Reset pointer
            pointer.point = point;
        }
        else {
            // Init pointer
            pointer = {
                "id": id,
                //"touch": !(ev instanceof MouseEvent) || ((<any>ev).pointerType && (<any>ev).pointerType != "pointer"),
                "touch": !(ev instanceof MouseEvent) || (ev.pointerType && ev.pointerType != "mouse"),
                "startPoint": point,
                "startTime": new Date().getTime(),
                "point": point,
                "track": [],
                "swipeCanceled": false,
                "dragStartEvents": []
            };
            // Add first breadcrumb
            this.addBreadCrumb(pointer, point);
            // Add for re-use later
            this.pointers.setKey(id, pointer);
        }
        // Log last event
        pointer.lastEvent = ev;
        return pointer;
    };
    /**
     * Resets the poiner to original state, i.e. cleans movement information,
     * starting point, etc.
     *
     * @param {IPointer} pointer Pointer
     */
    Interaction.prototype.resetPointer = function (pointer) {
        pointer.startTime = new Date().getTime();
        pointer.startPoint = pointer.point;
        pointer.track = [];
        pointer.swipeCanceled = false;
        //clearTimeout(pointer.swipeTimeout);
        //clearTimeout(pointer.holdTimeout);
    };
    /**
     * Adds a "breadcrumb" point to the [[Pointer]] to log its movement path.
     *
     * @param {IPointer}  pointer  Pointer
     * @param {IPoint}    point    Point coordinates
     */
    Interaction.prototype.addBreadCrumb = function (pointer, point) {
        pointer.track.push({
            "timestamp": new Date().getTime(),
            "point": point
        });
    };
    /**
     * Prepares the document for various touch-related operations.
     *
     * @ignore Exclude from docs
     */
    Interaction.prototype.lockDocument = function () {
        this.prepElement(this.body);
    };
    /**
     * Restores document functionality.
     *
     * @ignore Exclude from docs
     */
    Interaction.prototype.unlockDocument = function () {
        if (this.transformedObjects.length == 0) {
            this.restoreAllStyles(this.body);
        }
    };
    /**
     * Lock element (disable all touch)
     *
     * @ignore Exclude from docs
     */
    Interaction.prototype.lockElement = function (io) {
        this.prepElement(io);
    };
    /**
     * Restores element's functionality.
     *
     * @ignore Exclude from docs
     */
    Interaction.prototype.unlockElement = function (io) {
        this.restoreAllStyles(io);
    };
    /**
     * Locks document's wheel scroll.
     *
     * @ignore Exclude from docs
     */
    Interaction.prototype.lockWheel = function () {
        window.addEventListener(this._pointerEvents.wheel, this.wheelLockEvent);
    };
    /**
     * Unlocks document's wheel scroll.
     *
     * @ignore Exclude from docs
     */
    Interaction.prototype.unlockWheel = function () {
        window.removeEventListener(this._pointerEvents.wheel, this.wheelLockEvent);
    };
    /**
     * Checks if top element at pointer's position belongs to the SVG.
     *
     * @ignore Exlude from docs
     * @param  {IPointer}       pointer  Pointer
     * @param  {SVGSVGElement}  svg      The <svg> element
     * @return {boolean}                 Belongs to SVG/
     */
    Interaction.prototype.isLocalElement = function (pointer, svg) {
        var target = document.elementFromPoint(pointer.point.x, pointer.point.y);
        return target && (svg === target || $dom.contains(svg, target));
    };
    /**
     * A function that cancels mouse wheel scroll.
     *
     * @ignore Exclude from docs
     * @param  {MouseEvent}  ev  Event object
     * @return {boolean}         Returns `false` to cancel
     */
    Interaction.prototype.wheelLockEvent = function (ev) {
        ev.preventDefault();
        return false;
    };
    /**
     * Applies a set of styles to an element. Stores the original styles so they
     * can be restored later.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}           io      Element
     * @param {Dictionary<string, string>}  styles  A Dictionary of style property and values
     */
    Interaction.prototype.prepElement = function (io, permanent) {
        var el = io.element;
        if (el) {
            // Define possible props
            var props = [
                "touchAction", "webkitTouchAction", "MozTouchAction", "MSTouchAction", "msTouchAction", "oTouchAction",
                "userSelect", "webkitUserSelect", "MozUserSelect", "MSUserSelect", "msUserSelect", "oUserSelect",
                "touchSelect", "webkitTouchSelect", "MozTouchSelect", "MSTouchSelect", "msTouchSelect", "oTouchSelect",
                "touchCallout", "webkitTouchCallout", "MozTouchCallout", "MSTouchCallout", "msTouchCallout", "oTouchCallout",
                "contentZooming", "webkitContentZooming", "MozContentZooming", "MSContentZooming", "msContentZooming", "oContentZooming",
                "userDrag", "webkitUserDrag", "MozUserDrag", "MSUserDrag", "msUserDrag", "oUserDrag"
            ];
            for (var i = 0; i < props.length; i++) {
                if (props[i] in el.style) {
                    this.setTemporaryStyle(io, props[i], "none");
                }
            }
            // Remove iOS-specific selection;
            this.setTemporaryStyle(io, "tapHighlightColor", "rgba(0, 0, 0, 0)");
            //this.setTemporaryStyle(io, "webkitOverflowScrolling", "none");
        }
    };
    /**
     * Cancels hold counting for the object.
     *
     * @param {InteractionObject} io Element
     */
    Interaction.prototype.cancelHold = function (io) {
        $iter.each(io.downPointers.iterator(), function (pointer) {
            //clearTimeout(pointer.holdTimeout);
        });
    };
    /**
     * Cancels swipe.
     *
     * @param {InteractionObject} io Element
     */
    Interaction.prototype.cancelSwipe = function (io) {
        $iter.each(io.downPointers.iterator(), function (pointer) {
            //clearTimeout(pointer.swipeTimeout);
        });
    };
    /**
     * Returns an option associated with hit events.
     *
     * @ignore Exclude from docs
     * @param  {InteractionObject}  io      Element
     * @param  {string}             option  Option key
     * @return {any}                        Option value
     */
    Interaction.prototype.getHitOption = function (io, option) {
        var res = io.hitOptions[option];
        if (typeof res === "undefined") {
            res = this.hitOptions[option];
        }
        return res;
    };
    /**
     * Returns an option associated with hover events.
     *
     * @ignore Exclude from docs
     * @param  {InteractionObject}  io      Element
     * @param  {string}             option  Option key
     * @return {any}                        Option value
     */
    Interaction.prototype.getHoverOption = function (io, option) {
        var res = io.hoverOptions[option];
        if (typeof res === "undefined") {
            res = this.hoverOptions[option];
        }
        return res;
    };
    /**
     * Returns an option associated with swipe events.
     *
     * @ignore Exclude from docs
     * @param  {InteractionObject}  io      Element
     * @param  {string}             option  Option key
     * @return {any}                        Option value
     */
    Interaction.prototype.getSwipeOption = function (io, option) {
        var res = io.swipeOptions[option];
        if (typeof res === "undefined") {
            res = this.swipeOptions[option];
        }
        return res;
    };
    /**
     * Returns an option for keyboard.
     *
     * @ignore Exclude from docs
     * @param  {InteractionObject}  io      Element
     * @param  {string}             option  Option key
     * @return {any}                        Option value
     */
    Interaction.prototype.getKeyboardOption = function (io, option) {
        var res = io.keyboardOptions[option];
        if (typeof res === "undefined") {
            res = this.keyboardOptions[option];
        }
        return res;
    };
    /**
     * Returns an option associated with inertia.
     *
     * @ignore Exclude from docs
     * @param  {InteractionObject}  io      Element
     * @param  {InertiaTypes}       type    Inertia type
     * @param  {string}             option  Option key
     * @return {any}                        Option value
     */
    Interaction.prototype.getInertiaOption = function (io, type, option) {
        var options = io.inertiaOptions.getKey(type);
        var res;
        if (options && $type.hasValue(options[type])) {
            res = options[type];
        }
        else {
            res = this.inertiaOptions.getKey(type)[option];
        }
        return res;
    };
    /**
     * Stops currently going on inertia. Useful if inertia is currently being
     * animated and the object is being interacted with.
     *
     * @param {InteractionObject} io Element
     */
    Interaction.prototype.stopInertia = function (io) {
        var x;
        var inertias = ["move", "resize", "rotate"];
        for (var i = 0; i < inertias.length; i++) {
            x = inertias[i];
            if (io.inertias.hasKey(x)) {
                var inertia = io.inertias.getKey(x);
                if (inertia) {
                    inertia.dispose();
                    //io.inertiaAnimations.removeKey(x);
                    //this.processDragStop(io);
                    continue;
                }
            }
        }
    };
    /**
     * Check if swiping is currently being performed on an object.
     *
     * @param  {InteractionObject}  io       Element
     * @param  {IPointer}           pointer  Pointer to check
     * @return {boolean}                     `true` if swiping
     */
    Interaction.prototype.swiping = function (io, pointer) {
        var now = new Date().getTime();
        if (pointer.swipeCanceled || !io.swipeable) {
            return false;
        }
        else if ((Math.abs(pointer.startPoint.y - pointer.point.y) < this.getSwipeOption(io, "verticalThreshold")) &&
            (pointer.startTime > (now - this.getSwipeOption(io, "time")))) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Returns `true` if a successfull swipe action was performed on an element.
     *
     * @param  {InteractionObject}  io       Element
     * @param  {IPointer}           pointer  Pointer
     * @return {boolean}                     Swiped?
     */
    Interaction.prototype.swiped = function (io, pointer) {
        var now = new Date().getTime();
        if (pointer.swipeCanceled) {
            return false;
        }
        else if ((Math.abs(pointer.startPoint.x - pointer.point.x) > this.getSwipeOption(io, "horizontalThreshold")) &&
            (Math.abs(pointer.startPoint.y - pointer.point.y) < this.getSwipeOption(io, "verticalThreshold")) &&
            (pointer.startTime > (now - this.getSwipeOption(io, "time")))) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Applies style to mouse cursor based on its stage in relation to
     * [[InteractionObject]].
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}   Element
     */
    Interaction.prototype.applyCursorOverStyle = function (io) {
        // Get sprite's cursor ooptions
        var options = io.cursorOptions;
        if (!$type.hasValue(options.overStyle)) {
            return;
        }
        // Apply cursor down styles
        for (var i = 0; i < options.overStyle.length; i++) {
            $dom.setStyle(io.element, options.overStyle[i].property, options.overStyle[i].value);
        }
    };
    /**
     * Applies style to mouse cursor based on its stage in relation to
     * [[InteractionObject]].
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     */
    Interaction.prototype.applyCursorDownStyle = function (io, pointer) {
        // Not applicable for touch pointers since they don't display a cursor
        if (pointer.touch) {
            return;
        }
        var downStyle = io.cursorOptions.downStyle;
        // Is down?
        if (io.downPointers.contains(pointer) && $type.hasValue(downStyle)) {
            // Apply cursor down styles
            for (var i = 0; i < downStyle.length; i++) {
                this.setTemporaryStyle(this.body, downStyle[i].property, downStyle[i].value);
                this.setTemporaryStyle(io, downStyle[i].property, downStyle[i].value);
            }
        }
    };
    /**
     * Restores original cursor style for the element.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     */
    Interaction.prototype.restoreCursorDownStyle = function (io, pointer) {
        // Not applicable for touch pointers since they don't display a cursor
        if (pointer.touch) {
            return;
        }
        var downStyle = io.cursorOptions.downStyle;
        // Is down?
        if (io.downPointers.contains(pointer) && $type.hasValue(downStyle)) {
            // Apply cursor down styles
            for (var i = 0; i < downStyle.length; i++) {
                this.restoreStyle(this.body, downStyle[i].property);
                this.restoreStyle(io, downStyle[i].property);
            }
        }
    };
    /**
     * Sets style on the body of the document.
     *
     * @ignore Exclude from docs
     * @param {Array<IStyleProperty> | IStyleProperty}  style  Style definitions
     */
    Interaction.prototype.setGlobalStyle = function (style) {
        var body = getInteraction().body;
        var styles = ($type.isArray(style) ? style : [style]);
        for (var i = 0; i < styles.length; i++) {
            this.setTemporaryStyle(body, styles[i].property, styles[i].value);
        }
    };
    /**
     * Restores style on the body of the document.
     *
     * @ignore Exclude from docs
     * @param {Array<IStyleProperty> | IStyleProperty}  style  Style definitions
     */
    Interaction.prototype.restoreGlobalStyle = function (style) {
        var body = getInteraction().body;
        var styles = ($type.isArray(style) ? style : [style]);
        for (var i = 0; i < styles.length; i++) {
            this.restoreStyle(body, styles[i].property);
        }
    };
    /**
     * Checks if element is a non-cahrt element.
     *
     * @param  {InteractionObject}  io  InteractionObject
     * @return {boolean}                Global element?
     */
    Interaction.prototype.isGlobalElement = function (io) {
        return document.body === io.element;
    };
    /**
     * Checks if pointer has moved since it was created.
     *
     * @param  {IPointer}  pointer    Pointer
     * @param  {number}    tolerance  Tolerance in pixels
     * @return {boolean}              `true` if the pointer has moved
     */
    Interaction.prototype.moved = function (pointer, tolerance) {
        var shift = this.getShift(pointer);
        return (Math.abs(shift.x) > tolerance) || (Math.abs(shift.y) > tolerance);
    };
    /**
     * Returns total a shift in pointers coordinates between its original
     * position and now.
     *
     * @param  {IPointer}  pointer  Pointer
     * @return {IPoint}             Shift in coordinates (x/y)
     */
    Interaction.prototype.getShift = function (pointer) {
        return {
            "x": pointer.startPoint.x - pointer.point.x,
            "y": pointer.startPoint.y - pointer.point.y
        };
    };
    /**
     * Returns a point from [[Pointer]]'s move history at a certain timetamp.
     *
     * @param  {IPointer}               pointer    Pointer
     * @param  {number}                 timestamp  Timestamp
     * @return {Optional<IBreadcrumb>}             Point
     */
    Interaction.prototype.getTrailPoint = function (pointer, timestamp) {
        var res;
        for (var i = 0; i < pointer.track.length; i++) {
            if (pointer.track[i].timestamp >= timestamp) {
                res = pointer.track[i];
                break;
            }
        }
        return res;
    };
    /**
     * Checks if same pointer already exists in the list.
     *
     * @param  {List<IPointer>}  list     List to check agains
     * @param  {IPointer}        pointer  Pointer
     * @return {boolean}                  Exists?
     */
    Interaction.prototype.pointerExists = function (list, pointer) {
        var exists = false;
        list.each(function (item) {
            exists = item.point.x == pointer.point.x && item.point.y == pointer.point.y;
        });
        return exists;
    };
    /**
     * Returns an [[InteractionObject]] representation of a DOM element.
     *
     * You can use this on any HTML or SVG element, to add interactive features
     * to it.
     *
     * @param  {HTMLElement | SVGSVGElement}  element  Element
     * @return {InteractionObject}                     InteractionObject
     */
    Interaction.prototype.getInteraction = function (element) {
        return new InteractionObject(element);
    };
    /**
     * Sets a style property on an element. Stores original value to be restored
     * later with [[restoreStyle]].
     *
     * @see {@link restoreStyle}
     * @param {InteractionObject}  io        Element
     * @param {string}             property  Property
     * @param {string}             value     Value
     */
    Interaction.prototype.setTemporaryStyle = function (io, property, value) {
        // Get element
        //let el = io.element.tagName == "g" ? <SVGSVGElement>io.element.parentNode : io.element;
        var el = io.element;
        // Save original property if it is set and hasn't been saved before already
        if ($type.hasValue(el.style[property]) && !io.replacedStyles.hasKey(property)) {
            io.replacedStyles.setKey(property, el.style[property]);
        }
        // Replace with the new one
        $dom.setStyle(el, property, value);
    };
    /**
     * Restores specific style on an element.
     *
     * @param {InteractionObject}  io        Element
     * @param {string}             property  Style property
     */
    Interaction.prototype.restoreStyle = function (io, property) {
        // Reset style
        if (io.replacedStyles.hasKey(property)) {
            io.element.style[property] = io.replacedStyles.getKey(property);
            io.replacedStyles.removeKey(property);
        }
        else {
            delete io.element.style[property];
        }
    };
    /**
     * Restore temporarily reset styles on an element.
     *
     * @param {InteractionObject} io Element
     */
    Interaction.prototype.restoreAllStyles = function (io) {
        $iter.each(io.replacedStyles.iterator(), function (a) {
            var key = a[0];
            var value = a[1];
            io.element.style[key] = value;
            io.replacedStyles.removeKey(key);
        });
    };
    /**
     * Processes dalyed events, such as "out" event that was initiated for
     * elements by touch.
     */
    Interaction.prototype.processDelayed = function () {
        var delayedEvent;
        while (delayedEvent = this._delayedEvents.out.shift()) {
            if (delayedEvent.timeout) {
                clearTimeout(delayedEvent.timeout);
            }
            this.handleOut(delayedEvent.io, delayedEvent.pointer, delayedEvent.event, true);
        }
    };
    /**
     * Disposes this object and cleans up after itself.
     */
    Interaction.prototype.dispose = function () {
        if (!this.isDisposed) {
            _super.prototype.dispose.call(this);
            this.restoreAllStyles(this.body);
            this.unlockWheel();
        }
    };
    return Interaction;
}(BaseObjectEvents));
export { Interaction };
var interaction = null;
/**
 * Returns a single unified global instance of [[Interaction]].
 *
 * All code should use this function, rather than create their own instances
 * of [[Interaction]].
 */
export function getInteraction() {
    if (interaction == null) {
        interaction = new Interaction();
    }
    return interaction;
}
//# sourceMappingURL=Interaction.js.map