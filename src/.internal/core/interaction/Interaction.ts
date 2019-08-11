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

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents, IBaseObjectEvents } from "../Base";
import { List } from "../utils/List";
import { AMEvent } from "../utils/EventDispatcher";
import { Animation } from "../utils/Animation";
import { IInertiaOptions, ISwipeOptions, IHitOptions, IHoverOptions, IKeyboardOptions, IMouseOptions } from "./InteractionOptions";
import { MultiDisposer, IDisposer } from "../utils/Disposer";
import { InteractionObject, IInteractionObjectEvents } from "./InteractionObject";
import { InteractionKeyboardObject } from "./InteractionKeyboardObject";
import { Dictionary } from "../utils/Dictionary";
import { Inertia, InertiaTypes } from "./Inertia";
import { IPointer, IBreadcrumb } from "./Pointer";
import { addEventListener } from "../utils/DOM";
import { IPoint } from "../defs/IPoint";
import { IStyleProperty } from "../defs/IStyleProperty";
import { keyboard } from "../utils/Keyboard";
import { system } from "./../System";
import * as $ease from "../utils/Ease";
import * as $math from "../utils/Math";
import * as $dom from "../utils/DOM";
import * as $iter from "../utils/Iterator";
import * as $type from "../utils/Type";
import * as $time from "../utils/Time";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Represents an Event object that comes from [[Interaction]]
 */
export interface IInteractionEvents extends IBaseObjectEvents {

	track: {
		pointer: IPointer;
		touch: boolean;
		event: MouseEvent | TouchEvent;
	};

	down: {
		pointer: IPointer;
		touch: boolean;
		event: MouseEvent | TouchEvent;
	};

	up: {
		pointer: IPointer;
		touch: boolean;
		event: MouseEvent | TouchEvent;
	};

	focus: {
		event: FocusEvent;
	}
}

/**
 * Interface representing a delayed event
 *
 * @ignore Exclude from docs
 */
export interface IDelayedEvent {
	type: keyof IInteractionObjectEvents;
	io: InteractionObject;
	pointer: IPointer;
	event: MouseEvent | TouchEvent;
	keepUntil?: number;
	timeout?: IDisposer;
}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */


﻿/**
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
 */
export class Interaction extends BaseObjectEvents {

	/**
	 * Defines available events.
	 *
	 * @deprecated Use inetraction.body.events instead
	 */
	public _events!: IInteractionEvents;

	/**
	 * A reference to an [[Interaction]] object for document's body.
	 *
	 * Users can use it to add global, non-chart related events, that will be
	 * applicable to the whole document.
	 */
	public body: InteractionObject;

	/**
	 * An indicator of global events were already initialized.
	 */
	protected _globalEventsAdded: boolean = false;

	/**
	 * Holds which mouse event listeners to use.
	 */
	protected _pointerEvents = {
		"pointerdown": "mousedown",
		"pointerup": "mouseup",
		"pointermove": "mousemove",
		"pointercancel": "mouseup",
		"pointerover": "mouseover",
		"pointerout": "mouseout",
		"wheel": "wheel"
	};

	/**
	 * Indicates if Interaction should use only "pointer" type events, like
	 * "pointermove", available in all modern browsers, ignoring "legacy"
	 * events, like "touchmove".
	 */
	protected _usePointerEventsOnly: boolean = false;

	/**
	 * Use only touch events (for touch only devices such as tablets and phones)
	 */
	protected _useTouchEventsOnly: boolean = false;

	/**
	 * Add special hover events. Normally, touch device tap will also simulate
	 * hover event. On some devices (ahem iOS) we want to prevent that so that
	 * over/out events are not duplicated.
	 */
	protected _addHoverEvents: boolean = true;

	/**
	 * Indicates if passive mode options is supported by this browser.
	 */
	protected _passiveSupported: boolean = false;

	/**
	 * Holds list of delayed events
	 */
	protected _delayedEvents: { out: IDelayedEvent[] } = { out: [] };

	/**
	 * List of objects that current have a pointer hovered over them.
	 */
	public overObjects: List<InteractionObject> = new List<InteractionObject>();

	/**
	 * List of objects that currently has a pressed pointer.
	 */
	public downObjects: List<InteractionObject> = new List<InteractionObject>();

	/**
	 * List of objects that need mouse position to be reported to them.
	 */
	public trackedObjects: List<InteractionObject> = new List<InteractionObject>();

	/**
	 * List of objects that are currently being dragged.
	 */
	public transformedObjects: List<InteractionObject> = new List<InteractionObject>();

	/**
	 * An object that currently has focus. Usually set automatically via
	 * [[InteractionObject]] `isFocus` method.
	 */
	public focusedObject: $type.Optional<InteractionObject>;

	/**
	 * Holds all known pointers.
	 */
	public pointers = new Dictionary<string, IPointer>();

	/**
	 * Inertia options that need to be applied to after element drag, if it's
	 * `inert = true`.
	 *
	 * This is just a default, which can and probably will be overridden by
	 * actual elements.
	 */
	public inertiaOptions = new Dictionary<InertiaTypes, IInertiaOptions>();

	/**
	 * Default options for click events. These can be overridden in
	 * [[InteractionObject]].
	 */
	public hitOptions: IHitOptions = {
		//"holdTime": 1000,
		"doubleHitTime": 300,
		//"delayFirstHit": false,
		"hitTolerance": 10,
		"noFocus": true
	};

	/**
	 * Default options for hover events. These can be overridden in
	 * [[InteractionObject]].
	 */
	public hoverOptions: IHoverOptions = {
		"touchOutBehavior": "leave",
		"touchOutDelay": 1000
	};

	/**
	 * Default options for detecting a swipe gesture. These can be overridden in
	 * [[InteractionObject]].
	 */
	public swipeOptions: ISwipeOptions = {
		"time": 500,
		"verticalThreshold": 75,
		"horizontalThreshold": 30
	};

	/**
	 * Default options for keyboard operations. These can be overridden in
	 * [[InteractionObject]].
	 */
	public keyboardOptions: IKeyboardOptions = {
		"speed": 0.1,
		"accelleration": 1.2,
		"accellerationDelay": 2000
	};

	/**
	 * Default options for keyboard operations. These can be overridden in
	 * [[InteractionObject]].
	 *
	 * @since 4.5.14
	 */
	public mouseOptions: IMouseOptions = {
		"sensitivity": 1
	};


	/**
	 * Constructor. Sets up universal document-wide move events to handle stuff
	 * outside particular chart container.
	 */
	constructor() {

		// Call super
		super();

		// Set class name
		this.className = "Interaction";

		// Create InteractionObject for <body>
		this.body = this.getInteraction(document.body);

		this._disposers.push(this.body);

		// Detect browser capabilities and determine what event listeners to use
		if (window.hasOwnProperty("PointerEvent")) {
			// IE10+/Edge without touch controls enabled
			this._pointerEvents.pointerdown = "pointerdown";
			this._pointerEvents.pointerup = "pointerup";
			this._pointerEvents.pointermove = "pointermove";
			this._pointerEvents.pointercancel = "pointercancel";
			this._pointerEvents.pointerover = "pointerover";
			this._pointerEvents.pointerout = "pointerout";
			//this._usePointerEventsOnly = true;
		} else if (window.hasOwnProperty("MSPointerEvent")) {
			// IE9
			this._pointerEvents.pointerdown = "MSPointerDown";
			this._pointerEvents.pointerup = "MSPointerUp";
			this._pointerEvents.pointermove = "MSPointerMove";
			this._pointerEvents.pointercancel = "MSPointerUp";
			this._pointerEvents.pointerover = "MSPointerOver";
			this._pointerEvents.pointerout = "MSPointerOut";
			//this._usePointerEventsOnly = true;
		}
		else if ((typeof matchMedia !== "undefined") && matchMedia('(pointer:fine)').matches) {
			// This is only for Safari as it does not support PointerEvent
			// Do nothing and let it use regular `mouse*` events
			// Hi Apple ;)

			// Additionally disable hover events for iOS devices
			if ('ontouchstart' in window) {
				this._addHoverEvents = false;
				this._useTouchEventsOnly = true;
			}
		}
		else if (window.navigator.userAgent.match(/MSIE /)) {
			// Oh looky, an MSIE that does not support PointerEvent. Hi granpa IE9!
			this._usePointerEventsOnly = true;
		}
		else {
			// Uses defaults for normal browsers
			// We also assume that this must be a touch device that does not have
			// any pointer events
			this._useTouchEventsOnly = true;
		}

		// Detect if device has a mouse
		// This is turning out to be not reliable
		// @todo remove
		/*if (!window.navigator.msPointerEnabled && (typeof matchMedia !== "undefined") && !matchMedia('(pointer:fine)').matches && !this.fullFF()) {
			this._useTouchEventsOnly = true;
		}*/

		// Detect proper mouse wheel events
		if ("onwheel" in document.createElement("div")) {
			// Modern browsers
			this._pointerEvents.wheel = "wheel";
		}
		else if ($type.hasValue((<any>document).onmousewheel)) {
			// Webkit and IE support at least "mousewheel"
			this._pointerEvents.wheel = "mousewheel";
		}

		// Set up default inertia options
		this.inertiaOptions.setKey("move", {
			"time": 100,
			"duration": 500,
			"factor": 1,
			"easing": $ease.polyOut3
		});
		this.inertiaOptions.setKey("resize", {
			"time": 100,
			"duration": 500,
			"factor": 1,
			"easing": $ease.polyOut3
		});

		// Set the passive mode support
		this._passiveSupported = Interaction.passiveSupported;

		// Apply theme
		this.applyTheme();
	}

	/**
	 * This is a nasty detection for Firefox. The reason why we have is that
	 * Firefox ESR version does not support matchMedia correctly.
	 *
	 * On iOS, Firefox uses different userAgent, so we don't have to detect iOS.
	 *
	 * @return Full Firefox?
	 */
	protected fullFF(): boolean {
		return (window.navigator.userAgent.match(/Firefox/)) && !(window.navigator.userAgent.match(/Android/));
	}

	protected debug(): void { }


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
	public addGlobalEvents(): void {
		if (!this._globalEventsAdded) {

			if (!this._useTouchEventsOnly) {
				this._disposers.push(addEventListener<MouseEvent | PointerEvent>(
					document,
					this._pointerEvents.pointerdown,
					(ev: MouseEvent) => { this.handleGlobalPointerDown(ev) }
				));

				this._disposers.push(addEventListener<MouseEvent | PointerEvent>(
					document,
					this._pointerEvents.pointermove,
					(ev: MouseEvent) => { this.handleGlobalPointerMove(ev) }
				));

				this._disposers.push(addEventListener<MouseEvent | PointerEvent>(
					document,
					this._pointerEvents.pointerup,
					(ev: MouseEvent) => { this.handleGlobalPointerUp(ev) }
				));

				this._disposers.push(addEventListener<MouseEvent | PointerEvent>(
					document,
					this._pointerEvents.pointercancel,
					(ev: MouseEvent) => { this.handleGlobalPointerUp(ev, true) }
				));
			}

			// No need to duplicate events for hubrid systems that support both
			// pointer events and touch events. Touch events are need only for
			// some touch-only systems, like Mobile Safari.
			if (!this._usePointerEventsOnly) {
				this._disposers.push(addEventListener(
					document,
					"touchstart",
					(ev: TouchEvent) => { this.handleGlobalTouchStart(ev) }
				));

				this._disposers.push(addEventListener(
					document,
					"touchmove",
					(ev: TouchEvent) => { this.handleGlobalTouchMove(ev) }
				));

				this._disposers.push(addEventListener(
					document,
					"touchend",
					(ev: TouchEvent) => { this.handleGlobalTouchEnd(ev) }
				));
			}

			this._disposers.push(addEventListener(
				document,
				"keydown",
				(ev: KeyboardEvent) => { this.handleGlobalKeyDown(ev) }
			));

			this._disposers.push(addEventListener(
				document,
				"keyup",
				(ev: KeyboardEvent) => { this.handleGlobalKeyUp(ev) }
			));

			this._globalEventsAdded = true;
		}
	}

	/**
	 * Sets if [[InteractionObject]] is clickable.
	 *
	 * @ignore Exclude from docs
	 * @param io [[InteractionObject]] instance
	 */
	public processClickable(io: InteractionObject): void {
		// Add or remove touch events
		this.processTouchable(io);
	}

	/**
	 * Sets if [[InteractionObject]] will display context menu when right-clicked.
	 *
	 * @ignore Exclude from docs
	 * @param io [[InteractionObject]] instance
	 */
	public processContextMenu(io: InteractionObject): void {
		if (io.contextMenuDisabled) {
			if (!io.eventDisposers.hasKey("contextMenuDisabled")) {
				io.eventDisposers.setKey("contextMenuDisabled",
					addEventListener<MouseEvent | PointerEvent>(io.element, "contextmenu", (e) => {
						e.preventDefault();
					})
				);
			}
		}
		else {
			if (io.eventDisposers.hasKey("contextMenuDisabled")) {
				io.eventDisposers.getKey("contextMenuDisabled").dispose();
			}
		}
	}

	/**
	 * Sets if [[InteractionObject]] is hoverable.
	 *
	 * @ignore Exclude from docs
	 * @param io [[InteractionObject]] instance
	 */
	public processHoverable(io: InteractionObject): void {
		if (io.hoverable || io.trackable) {

			// Add global events
			this.addGlobalEvents();

			// Add hover styles
			this.applyCursorOverStyle(io);

			// Add local events
			if (!io.eventDisposers.hasKey("hoverable") && this._addHoverEvents) {
				io.eventDisposers.setKey("hoverable", new MultiDisposer([
					addEventListener<MouseEvent | PointerEvent>(io.element, this._pointerEvents.pointerout, (e) => this.handlePointerOut(io, e)),
					addEventListener<MouseEvent | PointerEvent>(io.element, this._pointerEvents.pointerover, (e) => this.handlePointerOver(io, e))
				]));
			}

			if (io.trackable) {
				//sprite.addEventListener("touchmove", this.handleTouchMove, false, this);
			}

		} else {
			const disposer = io.eventDisposers.getKey("hoverable");

			if (disposer != null) {
				disposer.dispose();
				io.eventDisposers.removeKey("hoverable");
			}
		}

		// Add or remove touch events
		this.processTouchable(io);
	}

	/**
	 * Sets up [[InteractionObject]] as movable. Movable can be any
	 * transformation, e.g. drag, swipe, resize, track.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 */
	public processMovable(io: InteractionObject) {

		// Add unified events
		if (io.draggable || io.swipeable || io.trackable || io.resizable) {

			// Prep the element
			if (!this.isGlobalElement(io) && !io.isTouchProtected) {
				this.prepElement(io);
			}

			// Add hover styles
			this.applyCursorOverStyle(io);

		}

		// Add or remove touch events
		this.processTouchable(io);

	}

	/**
	 * Checks if [[InteractionObject]] is trackable and sets relative events.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 */
	public processTrackable(io: InteractionObject): void {
		this.processHoverable(io);
		this.processMovable(io);
		if (io.trackable) {
			this.trackedObjects.moveValue(io);
		}
		else {
			this.trackedObjects.removeValue(io);
		}
	}

	/**
	 * Checks if [[InteractionObject]] is draggable.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 */
	public processDraggable(io: InteractionObject): void {
		this.processMovable(io);
	}

	/**
	 * Checks if [[InteractionObject]] is swipeable and sets relative events.
	 *
	 * A swipe event is triggered when a horizontal drag of 75px or more (and
	 * less than 30px vertically) occurs within 700 milliseconds. This can be
	 * overridden in sprites [[swipeOptions]].
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 */
	public processSwipeable(io: InteractionObject): void {
		this.processMovable(io);
	}

	/**
	 * Checks if [[InteractionObject]] is resizable and attaches required events
	 * to it.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 */
	public processResizable(io: InteractionObject): void {
		this.processMovable(io);
	}

	/**
	 * Checks if [[InteractionObject]] is supposed to capture mouse wheel events
	 * and prepares it to catch those events.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 */
	public processWheelable(io: InteractionObject): void {
		if (io.wheelable) {
			//io.hoverable = true;
			if (!io.eventDisposers.hasKey("wheelable")) {
				io.eventDisposers.setKey("wheelable", new MultiDisposer([
					addEventListener<WheelEvent>(
						io.element,
						this._pointerEvents.wheel,
						(e) => this.handleMouseWheel(io, e),
						this._passiveSupported ? { passive: false } : false
					),
					io.events.on("out", (e) => {
						if (io.wheelable) {
							this.unlockWheel();
						}
					}),
					io.events.on("over", (e) => {
						if (io.wheelable) {
							this.lockWheel();
						}
					})
				]));
			}

		} else {
			const disposer = io.eventDisposers.getKey("wheelable");

			if (disposer != null) {
				disposer.dispose();
				io.eventDisposers.removeKey("wheelable");
			}
		}
	}

	/**
	 * Checks if [[InteractionObject]] is focusable. A focusable element is an
	 * element that will be highlighted when users presses TAB key. If the
	 * element is focusable, this function will attach relative focus/blur
	 * events to it.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 */
	public processFocusable(io: InteractionObject): void {
		if (io.focusable === true && (io.tabindex > -1) && !this._useTouchEventsOnly) {
			if (!io.eventDisposers.hasKey("focusable")) {
				io.eventDisposers.setKey("focusable", new MultiDisposer([
					addEventListener<FocusEvent>(io.element, "focus", (e) => this.handleFocus(io, e)),
					addEventListener<FocusEvent>(io.element, "blur", (e) => this.handleBlur(io, e)),
					addEventListener<MouseEvent>(
						io.element,
						this._pointerEvents.pointerdown,
						(e) => this.handleFocusBlur(io, e)
					),

					addEventListener<TouchEvent>(
						io.element,
						"touchstart",
						(e) => this.handleFocusBlur(io, e),
						this._passiveSupported ? { passive: false } : false
					)
				]));
			}
		}
		else {
			const disposer = io.eventDisposers.getKey("focusable");

			if (disposer != null) {
				disposer.dispose();
				io.eventDisposers.removeKey("focusable");
			}
		}
	}

	/**
	 * Checks if [[InteractionObject]] is "touchable". It means any interaction
	 * whatsoever: mouse click, touch screen tap, swipe, drag, resize, etc.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 */
	public processTouchable(io: InteractionObject): void {

		// Add unified events
		if (io.clickable || io.hoverable || io.trackable || io.draggable || io.swipeable || io.resizable) {

			// Add global events
			this.addGlobalEvents();

			// Add local events
			if (!io.eventDisposers.hasKey("touchable")) {
				if (!this._useTouchEventsOnly && !this._usePointerEventsOnly) {
					io.eventDisposers.setKey("touchable", new MultiDisposer([

						addEventListener<MouseEvent>(
							io.element,
							this._pointerEvents.pointerdown,
							(e) => this.handlePointerDown(io, e)
						),

						addEventListener<TouchEvent>(
							io.element,
							"touchstart",
							(e) => this.handleTouchDown(io, e),
							this._passiveSupported ? { passive: false } : false
						)

					]));
				}
				else if (!this._useTouchEventsOnly) {
					io.eventDisposers.setKey("touchable",
						addEventListener<MouseEvent>(
							io.element,
							this._pointerEvents.pointerdown,
							(e) => this.handlePointerDown(io, e)
						)
					);
				}
				else if (!this._usePointerEventsOnly) {
					io.eventDisposers.setKey("touchable",
						addEventListener<TouchEvent>(
							io.element,
							"touchstart",
							(e) => this.handleTouchDown(io, e),
							this._passiveSupported ? { passive: false } : false
						)
					);
				}
			}

		} else {
			const disposer = io.eventDisposers.getKey("touchable");

			if (disposer != null) {
				disposer.dispose();
				io.eventDisposers.removeKey("touchable");
			}
		}

	}

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
	 * @param io  Element
	 * @param ev  Original event
	 */
	public handleFocus(io: InteractionObject, ev: FocusEvent): void {
		if (!io.focusable) {
			ev.preventDefault();
			return;
		}
		io.isFocused = true;
		if (io.events.isEnabled("focus") && !system.isPaused) {
			let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["focus"] = {
				type: "focus",
				target: io,
				event: ev
			};
			io.events.dispatchImmediately("focus", imev);
		}
	}

	/**
	 * Used by regular click events to prevent focus if "noFocus" is set.
	 *
	 * This should not be called by "focus" handlers.
	 *
	 * @param io  Element
	 * @param ev  Original event
	 */
	private handleFocusBlur(io: InteractionObject, ev: MouseEvent | TouchEvent): void {
		if (io.focusable !== false && this.getHitOption(io, "noFocus")) {
			io.events.once("focus", () => {
				io.events.disableType("blur");
				$dom.blur();
				if (io.sprite) {
					io.sprite.handleBlur();
				}
				io.events.enableType("blur");
			});
		}
	}

	/**
	 * Dispatches "blur" event when element loses focus.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 * @param ev  Original event
	 */
	public handleBlur(io: InteractionObject, ev: FocusEvent): void {
		if (!io.focusable) {
			ev.preventDefault();
			return;
		}
		io.isFocused = false;
		if (io.events.isEnabled("blur") && !system.isPaused) {
			let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["blur"] = {
				type: "blur",
				target: io,
				event: ev
			};
			io.events.dispatchImmediately("blur", imev);
		}
	}

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
	 * @param ev An original keyboard event
	 */
	public handleGlobalKeyDown(ev: KeyboardEvent): void {

		if (this.focusedObject) {
			if (keyboard.isKey(ev, "esc")) {
				// ESC removes focus
				$dom.blur();
			}
			else if (this.focusedObject.draggable && keyboard.isKey(ev, ["up", "down", "left", "right"])) {

				// Prevent scrolling of the document
				ev.preventDefault();

				// Get focused object
				let io = this.focusedObject;

				// Get particular key
				let disposerKey = "interactionKeyboardObject";

				// If such disposer already exists we know the event is going on so we
				// just move on
				if (io.eventDisposers.hasKey(disposerKey)) {
					return;
				}

				// Create a keyboard mover
				let ko = new InteractionKeyboardObject(io, ev);
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
	}

	/**
	 * Dispatches related events when the keyboard key is realeasd.
	 *
	 * @ignore Exclude from docs
	 * @param ev An original keyboard event
	 */
	public handleGlobalKeyUp(ev: KeyboardEvent): void {
		let disposerKey = "interactionKeyboardObject";
		if (this.focusedObject) {
			const disposer = this.focusedObject.eventDisposers.getKey(disposerKey);

			if (disposer != null) {
				// Prevent scrolling of the document
				ev.preventDefault();

				// Dispose stuff
				disposer.dispose();
				this.focusedObject.eventDisposers.removeKey(disposerKey);
			}
		}
	}

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
	 * @param ev Event object
	 */
	public handleGlobalPointerMove(ev: MouseEvent): void {
		// Get pointer
		let pointer: IPointer = this.getPointer(ev);

		// Update current point position
		pointer.point = this.getPointerPoint(ev);

		// Prepare and fire global event
		if (this.events.isEnabled("track") && !system.isPaused) {
			let imev: AMEvent<this, IInteractionEvents>["track"] = {
				type: "track",
				target: this,
				event: ev,
				pointer: pointer,
				touch: pointer.touch
			};
			this.events.dispatchImmediately("track", imev);
		}

		// Track
		this.addBreadCrumb(pointer, pointer.point);

		// Process further
		this.handleGlobalMove(pointer, ev);
	}

	/**
	 * Handler for a global "pointerdown" event.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event object
	 */
	public handleGlobalPointerDown(ev: MouseEvent): void {

		// Remove delayed hovers
		this.processDelayed();

		// Get pointer
		let pointer: IPointer = this.getPointer(ev);

		// Prepare and fire global event
		if (this.events.isEnabled("down") && !system.isPaused) {
			let imev: AMEvent<this, IInteractionEvents>["down"] = {
				type: "down",
				target: this,
				event: ev,
				pointer: pointer,
				touch: pointer.touch
			};
			this.events.dispatchImmediately("down", imev);
		}
	}

	/**
	 * Prevents touch action from firing.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event
	 */
	public preventTouchAction(ev: TouchEvent): void {
		if (!ev.defaultPrevented) {
			ev.preventDefault();
		}
	}

	/**
	 * Handler for a global "pointerup" event.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event object
	 */
	public handleGlobalPointerUp(ev: MouseEvent, cancelled: boolean = false): void {

		// Get pointer
		let pointer: IPointer = this.getPointer(ev);

		// Prepare and fire global event
		if (this.events.isEnabled("up") && !system.isPaused) {
			let imev: AMEvent<this, IInteractionEvents>["up"] = {
				type: "up",
				target: this,
				event: ev,
				pointer: pointer,
				touch: pointer.touch
			};
			this.events.dispatchImmediately("up", imev);
		}

		// Process further
		this.handleGlobalUp(pointer, ev, cancelled);

	}

	/**
 * ==========================================================================
 * Global touch-related even handlers
 * ==========================================================================
 */

	/**
	 * Handler for a global "touchmove" event.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event object
	 */
	public handleGlobalTouchMove(ev: TouchEvent): void {

		// Process each changed touch point
		for (let i = 0; i < ev.changedTouches.length; i++) {
			// Get pointer
			let pointer: IPointer = this.getPointer(ev.changedTouches[i]);

			// Update current point position
			pointer.point = this.getPointerPoint(ev.changedTouches[i]);

			// Prepare and fire global event
			if (this.events.isEnabled("track") && !system.isPaused) {
				let imev: AMEvent<this, IInteractionEvents>["track"] = {
					type: "track",
					target: this,
					event: ev,
					pointer: pointer,
					touch: pointer.touch
				};
				this.events.dispatchImmediately("track", imev);
			}

			// Track
			this.addBreadCrumb(pointer, pointer.point);

			// Process further
			this.handleGlobalMove(pointer, ev);
		}

	}

	/**
	 * Handler for a global "touchstart" event.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event object
	 */
	public handleGlobalTouchStart(ev: TouchEvent): void {

		// Remove delayed hovers
		this.processDelayed();

		// Process each changed touch point
		for (let i = 0; i < ev.changedTouches.length; i++) {

			// Get pointer
			let pointer: IPointer = this.getPointer(ev.changedTouches[i]);

			// Prepare and fire global event
			if (!this._usePointerEventsOnly && this.events.isEnabled("down") && !system.isPaused) {
				let imev: AMEvent<this, IInteractionEvents>["down"] = {
					type: "down",
					target: this,
					event: ev,
					pointer: pointer,
					touch: pointer.touch
				};
				this.events.dispatchImmediately("down", imev);
			}

		}

	}

	/**
	 * Handler for a global "touchend" event.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event object
	 */
	public handleGlobalTouchEnd(ev: TouchEvent): void {

		// Process each changed touch point
		for (let i = 0; i < ev.changedTouches.length; i++) {

			// Get pointer
			let pointer: IPointer = this.getPointer(ev.changedTouches[i]);

			// Prepare and fire global event
			if (this.events.isEnabled("up") && !system.isPaused) {
				let imev: AMEvent<this, IInteractionEvents>["up"] = {
					type: "up",
					target: this,
					event: ev,
					pointer: pointer,
					touch: pointer.touch
				};
				this.events.dispatchImmediately("up", imev);
			}

			// Handle element-related events
			this.handleGlobalUp(pointer, ev);

		}

	}

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
	 * @param io  Element
	 * @param ev  Original event
	 */
	public handlePointerDown(io: InteractionObject, ev: MouseEvent | PointerEvent): void {

		// Stop further propagation so we don't get multiple triggers on hybrid
		// devices (both mouse and touch capabilities)
		//ev.preventDefault();
		//ev.stopPropagation();
		//if (ev.defaultPrevented) {
		//}

		// Get pointer
		let pointer = this.getPointer(ev);

		// Ignore if it's anything but mouse's primary button
		if (!pointer.touch && ev.which != 1 && ev.which != 3) {
			return;
		}

		// Set mouse button
		pointer.button = ev.which;

		// Reset pointer
		this.resetPointer(pointer, ev);

		// Process down
		this.handleDown(io, pointer, ev);
	}

	/**
	 * Handles event when [[InteractionObject]] is hovered by a mouse pointer.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 * @param ev  Original event
	 */
	public handlePointerOver(io: InteractionObject, ev: MouseEvent | PointerEvent): void {
		// Get pointer
		let pointer = this.getPointer(ev);

		// Process down
		this.handleOver(io, pointer, ev);
	}

	/**
	 * Handles event when [[InteractionObject]] loses hover from a mouse pointer.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 * @param ev  Original event
	 */
	public handlePointerOut(io: InteractionObject, ev: MouseEvent | PointerEvent): void {

		// Get pointer
		let pointer = this.getPointer(ev);

		// Process down
		this.handleOut(io, pointer, ev);
	}

	/**
	 * Handles event when mouse wheel is crolled over the [[InteractionObject]].
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 * @param ev  Original event
	 * @todo Investigate more-cross browser stuff https://developer.mozilla.org/en-US/docs/Web/Events/wheel
	 */
	public handleMouseWheel(io: InteractionObject, ev: WheelEvent): void {

		// Get pointer
		let pointer = this.getPointer(ev);

		// Update current point position
		pointer.point = this.getPointerPoint(ev);

		// Init delta values
		let deltaX: number = 0, deltaY: number = 0;

		// Set up modifier
		// This is needed because FireFox reports wheel deltas in "lines" instead
		// of pixels so we have to approximate pixel value
		let mod = 1;
		if (ev.deltaMode == 1) {
			mod = 50;
		}

		// Adjust configurable sensitivity
		mod *= this.getMouseOption(io, "sensitivity");

		// Calculate deltas
		if (ev instanceof WheelEvent) {
			deltaX = Math.round((-1 * (<any>ev).wheelDeltaX) || ev.deltaX) * mod;
			deltaY = Math.round((-1 * (<any>ev).wheelDeltaY) || ev.deltaY) * mod;
		} else {
			throw new Error("Invalid event type");
		}

		// Handle the event
		this.handleWheel(io, pointer, deltaX, deltaY, ev);
	}


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
	  * @param io  Element
	  * @param ev  Original event
	  */
	public handleTouchDown(io: InteractionObject, ev: TouchEvent): void {

		// Stop further propagation so we don't get multiple triggers on hybrid
		// devices (both mouse and touch capabilities)
		//this.maybePreventDefault(io, ev);
		//return;

		// Process each changed touch point
		for (let i = 0; i < ev.changedTouches.length; i++) {

			// Get pointer
			let pointer = this.getPointer(ev.changedTouches[i]);
			this.maybePreventDefault(io, ev, pointer);

			// Reset pointer
			this.resetPointer(pointer, ev.changedTouches[i]);

			// Process down
			this.handleDown(io, pointer, ev);
		}

	}


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
	 * @param io       Interaction object
	 * @param pointer  Pointer
	 * @param ev       Original event
	 */
	public handleHit(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent): void {

		// Check if this is a double-hit
		let now = $time.getTime();
		if (io.lastHit && (io.lastHit >= (now - this.getHitOption(io, "doubleHitTime")))) {

			// Yup - it's a double-hit

			// Cancel the hit
			//clearTimeout(io.lastHitPointer.hitTimeout);

			// If it happened too fast it probably means that hybrid device just
			// generated two events for the same tap
			if ((now - io.lastHit) < 100) {
				// Ignore
				return;
			}

			// Clear last hit
			io.lastHit = undefined;
			io.lastHitPointer = undefined;

			// Dispatch event
			if (io.events.isEnabled("doublehit") && !system.isPaused) {
				let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["doublehit"] = {
					type: "doublehit",
					target: io,
					point: pointer.point,
					event: ev,
					touch: pointer.touch
				};
				io.events.dispatchImmediately("doublehit", imev);
			}

		}
		else {

			// Log last hit
			io.lastHit = now;
			io.lastHitPointer = pointer;

			if (pointer.button === 3) {
				// Execute HIT now
				if (io.events.isEnabled("rightclick") && !system.isPaused) {
					let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["rightclick"] = {
						type: "rightclick",
						target: io,
						event: ev
					}
					io.events.dispatchImmediately("rightclick", imev);
				}
			} else {
				if (io.events.isEnabled("hit") && !system.isPaused) {
					let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["hit"] = {
						type: "hit",
						target: io,
						event: ev,
						point: pointer.point,
						touch: pointer.touch
					};
					io.events.dispatchImmediately("hit", imev);
				}
			}

		}

	}

	/**
	 * Handles pointer hovering over [[InteractionObject]].
	 *
	 * @ignore Exclude from docs
	 * @param io       Interaction object
	 * @param pointer  Pointer
	 * @param ev       Original event
	 * @param soft     Invoked by helper function
	 */
	public handleOver(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent, soft: boolean = false): void {

		if (!io.hoverable) {
			return;
		}

		// Remove any delayed outs
		this.processDelayed();

		// Add pointer
		io.overPointers.moveValue(pointer);

		// Check if object is not yet hovered
		if (!io.isHover) {

			// Set element as hovered
			io.isHover = true;
			this.overObjects.moveValue(io);

			// Generate body track event. This is needed so that if element loads
			// under unmoved mouse cursor, we still need all the actions that are
			// required to happen to kick in.
			this.handleTrack(this.body, pointer, ev, true);

			// Event
			if (io.events.isEnabled("over") && !system.isPaused) {
				let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["over"] = {
					type: "over",
					target: io,
					event: ev,
					pointer: pointer,
					touch: pointer.touch
				};
				io.events.dispatchImmediately("over", imev);
			}

		}

	}

	/**
	 * Handles when [[InteractionObject]] is no longer hovered.
	 *
	 * If `soft = true`, this means that method is being invoked by some other
	 * code, not hard "out" function, like `handleUp` which implies we need to
	 * run additional checks before unhovering the object.
	 *
	 * @ignore Exclude from docs
	 * @param io       Interaction object
	 * @param pointer  Pointer
	 * @param ev       Original event
	 * @param soft     Invoked by helper function
	 * @param force    Force imediate out
	 */
	public handleOut(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent, soft: boolean = false, force: boolean = false): void {

		if (!io.hoverable) {
			return;
		}

		// Remove pointer
		io.overPointers.removeValue(pointer);

		// Check if element is still hovered
		if (io.isHover && (!io.hasDelayedOut || force)) {


			// Should we run additional checks?
			if (soft && io.overPointers.length) {
				// There are still pointers hovering - don't do anything else and
				// wait until either no over pointers are there or we get a hard out
				// event.
				return;
			}

			// Should we delay "out" if this is happening on a touch device?
			if (pointer.touch && !force && !this.old(pointer)) {

				// This is a touch pointer, and it hasn't moved, let's pretend
				// the object is still hovered, and act as per "behavior" setting
				let behavior = this.getHoverOption(io, "touchOutBehavior");
				if (behavior == "leave") {
					// Set to "leave", so we do not execute any "out" event.
					// It will be handled by any other interaction that happens
					// afterwards.
					this._delayedEvents.out.push({
						type: "out",
						io: io,
						pointer: pointer,
						event: ev,
						keepUntil: $time.getTime() + 500
					});
					io.hasDelayedOut = true;
					return;
				}
				else if (behavior == "delay" && this.getHoverOption(io, "touchOutDelay")) {
					this._delayedEvents.out.push({
						type: "out",
						io: io,
						pointer: pointer,
						event: ev,
						keepUntil: $time.getTime() + 500,
						timeout: this.setTimeout(() => {
							this.handleOut(io, pointer, ev, true);
						}, this.getHoverOption(io, "touchOutDelay"))
					});
					return;
				}
				else {
					// Nothing for "remove" - that's how it works "out-of-the-box"
				}

			}

			// Set element as not hovered
			io.isHover = false;
			this.overObjects.removeValue(io);

			// Invoke event
			if (io.events.isEnabled("out") && !system.isPaused) {
				let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["out"] = {
					type: "out",
					target: io,
					event: ev,
					pointer: pointer,
					touch: pointer.touch
				};
				io.events.dispatchImmediately("out", imev);
			}

			// Reset object from lefover delayed outs, pointers
			io.overPointers.clear();
			io.hasDelayedOut = false;
			// @todo (clean delayed)

		}

	}

	/**
	 * Processes dalyed events, such as "out" event that was initiated for
	 * elements by touch.
	 */
	private processDelayed(): void {
		let delayedEvent;

		while (true) {
			delayedEvent = this._delayedEvents.out.pop();

			if (!delayedEvent) {
				break;
			}

			if (delayedEvent.timeout) {
				delayedEvent.timeout.dispose();
			}

			this.handleOut(delayedEvent.io, delayedEvent.pointer, delayedEvent.event, false, true);
		}

	}

	/**
	 * Performs tasks on pointer down.
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 * @param ev       Original event
	 */
	public handleDown(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent | undefined): void {

		// Need to prevent default event from happening on transformable objects
		this.maybePreventDefault(io, ev, pointer);

		// Stop inertia animations if they're currently being played out
		if (io.inert) {
			this.stopInertia(io);
		}

		// Trigger hover because some touch devices won't trigger over events
		// on their own
		this.handleOver(io, pointer, ev, true);

		// Add pointer to list
		io.downPointers.moveValue(pointer);

		// Apply styles if necessary
		this.applyCursorDownStyle(io, pointer);

		// Check if object is already down
		if (!io.isDown) {

			// Lose focus if needed
			if (io.focusable !== false && this.getHitOption(io, "noFocus") && this.focusedObject) {
				$dom.blur();
			}

			// Set object as hovered
			io.isDown = true;
			this.downObjects.moveValue(io);

			// Prep object for dragging and/or resizing
			if (io.draggable) {
				this.processDragStart(io, pointer, ev);
			}
			if (io.resizable) {
				this.processResizeStart(io, pointer, ev);
			}

		}

		// Dispatch "down" event
		if (io.events.isEnabled("down") && !system.isPaused) {
			let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["down"] = {
				type: "down",
				target: io,
				event: ev,
				pointer: pointer,
				touch: pointer.touch
			};
			io.events.dispatchImmediately("down", imev);
		}

	}

	/**
	 * Performs tasks on pointer up.
	 *
	 * @ignore Exclude from docs
	 * @param pointer  Pointer
	 * @param ev       Original event
	 */
	public handleGlobalUp(pointer: IPointer, ev: MouseEvent | TouchEvent | undefined, cancelled: boolean = false): void {

		// Process all down objects
		$iter.each(this.downObjects.backwards().iterator(), (io) => {

			// Check if this particular pointer is pressing down
			// on object
			if (io && io.downPointers.contains(pointer)) {
				this.handleUp(io, pointer, ev, cancelled);
			}

		});

	}

	/**
	 * Handles when [[InteractionObject]] is no longer hovered.
	 *
	 * @ignore Exclude from docs
	 * @param io       Interaction object
	 * @param pointer  Pointer
	 * @param ev       Original event
	 */
	public handleUp(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent, cancelled: boolean = false): void {

		// Restore cursor style
		this.restoreCursorDownStyle(io, pointer);

		// Remove pointer from the list
		io.downPointers.removeValue(pointer);

		// Trigger out because some touch devices won't trigger out events
		// on their own
		if (pointer.touch || this._useTouchEventsOnly) {
			this.handleOut(io, pointer, ev, true);
		}

		// Check if object still down
		if (io.isDown) {

			// Check if there are no other pointers hovering this element
			if (io.downPointers.length == 0) {
				// Set element as no longer down
				io.isDown = false;
				this.downObjects.removeValue(io);
			}

			// Dispatch "up" event
			if (io.events.isEnabled("up") && !system.isPaused) {
				let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["up"] = {
					type: "up",
					target: io,
					event: ev,
					pointer: pointer,
					touch: pointer.touch
				};
				io.events.dispatchImmediately("up", imev);
			}

			// Check if this was not a cancelled event.
			// If event was canelled (which might happen if gesture resulted in
			// navigation or page scroll) there's no point in triggering hit and
			// other actions.
			if (!cancelled) {

				// Handle swiping-related stuff
				if (io.swipeable && this.swiped(io, pointer)) {
					// Swiped - nothing else should happen
					this.handleSwipe(io, pointer, ev);
				} else {

					// Check if it maybe a click
					if (io.clickable && !this.moved(pointer, this.getHitOption(io, "hitTolerance"))) {
						this.handleHit(io, pointer, ev);
					}

					// Handle inertia
					if (io.inert && this.moved(pointer, this.getHitOption(io, "hitTolerance"))) {
						this.handleInertia(io, pointer);
					}
					else if (io.draggable) {
						this.processDragStop(io, pointer, ev);
					}

					if (io.resizable) {
						this.processResizeStop(io, pointer, ev);
					}

				}

			}

		}

	}

	/**
	 * Checks if event needs to be prevented on draggable and such items, so that
	 * touch gestures like navigation and scroll do not kick in.
	 *
	 * @param io  Object
	 * @param ev  Event
	 */
	private maybePreventDefault(io: InteractionObject, ev: MouseEvent | TouchEvent | undefined, pointer?: IPointer): void {
		if (
			$type.hasValue(ev)
			&& (io.draggable || io.swipeable || io.trackable || io.resizable)
			&& !this.isGlobalElement(io)
			&& ev.cancelable !== false
			&& (!io.isTouchProtected || !pointer || !pointer.touch)
		) {
			ev.preventDefault();
		}
	}

	/**
	 * Handles pointer move.
	 *
	 * @ignore Exclude from docs
	 * @param pointer  Pointer
	 * @param ev       Original event
	 */
	public handleGlobalMove(pointer: IPointer, ev: MouseEvent | TouchEvent): void {

		// Process hovered elements
		// We check if the element became unhovered without reporting the mouseout
		// event. (it happens in some cases)
		if (!pointer.touch) {
			const target = <HTMLElement>$dom.eventTarget(<Event>pointer.lastEvent);

			$iter.each(this.overObjects.backwards().iterator(), (io) => {
				// Is this pointer relevant to element?
				if (io && io.overPointers.contains(pointer) && io.hoverable) {
					// Check if the element is still hovered
					let reset = false;
					if (io.element && pointer.lastEvent) {
						if (!$dom.contains(io.element, target)) {
							reset = true;
						}
					}
					else {
						reset = true;
					}
					if (reset) {
						this.handleOut(io, pointer, ev, true);
					}
				}
			});
		}


		// Process down elements
		$iter.each(this.transformedObjects.backwards().iterator(), (io) => {
			// Is this pointer relevant to element?
			if (io.downPointers.contains(pointer) &&
				// Swipe still happening?
				!(io.swipeable && this.swiping(io, pointer)) &&
				(io.draggable || io.resizable)) {
				this.handleTransform(io, ev);
			}
		});

		// Process tracked elements
		$iter.each(this.trackedObjects.backwards().iterator(), (io) => {
			// Is this pointer relevant to element?
			if (!io.overPointers.contains(pointer)) {
				this.handleTrack(io, pointer, ev);
			}
		});
	}

	/**
	 * Handles reporting of pointer movement.
	 *
	 * @ignore Exclude from docs
	 * @param io        Element
	 * @param pointer    Pointer
	 * @param ev         Original event
	 * @param skipCheck  Sould we skip check if cursor actually moved
	 */
	public handleTrack(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent, skipCheck = false): void {

		// Do nothing if the cursor did not actually move
		if (!skipCheck && !this.moved(pointer, 0)) {
			return;
		}

		// Initiate TRACK event
		if (io.events.isEnabled("track") && !system.isPaused) {
			let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["track"] = {
				type: "track",
				target: io,
				event: ev,
				point: pointer.point,
				pointer: pointer,
				touch: pointer.touch
			};
			io.events.dispatchImmediately("track", imev);
		}
	}

	/**
	 * Handles swipe action.
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 * @param ev       Original event
	 */
	public handleSwipe(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent): void {

		// We pass in InteractionEvent with shift in mouse coordinates
		// between when the drag started and ended
		if (io.events.isEnabled("swipe") && !system.isPaused) {
			let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["swipe"] = {
				type: "swipe",
				target: io,
				event: ev,
				touch: pointer.touch
			};
			io.events.dispatchImmediately("swipe", imev);
		}

		if (pointer.startPoint.x < pointer.point.x) {
			if (io.events.isEnabled("swiperight") && !system.isPaused) {
				let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["swiperight"] = {
					type: "swiperight",
					target: io,
					event: ev,
					touch: pointer.touch
				};
				io.events.dispatchImmediately("swiperight", imev);
			}
		}
		else {
			if (io.events.isEnabled("swipeleft") && !system.isPaused) {
				let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["swipeleft"] = {
					type: "swipeleft",
					target: io,
					event: ev,
					touch: pointer.touch
				};
				io.events.dispatchImmediately("swipeleft", imev);
			}
		}

	}

	/**
	 * Handles event triggering for wheel rotation.
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 * @param deltaX   Horizontal shift
	 * @param deltaY   Vertical shift
	 * @param ev       Original event
	 */
	public handleWheel(io: InteractionObject, pointer: IPointer, deltaX: number, deltaY: number, ev: WheelEvent): void {
		const shift: IPoint = {
			x: deltaX,
			y: deltaY
		};

		// Trigger generic WHEEL event
		if (io.events.isEnabled("wheel") && !system.isPaused) {
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
			if (io.events.isEnabled("wheelleft") && !system.isPaused) {
				io.events.dispatchImmediately("wheelleft", {
					type: "wheelleft",
					target: io,
					event: ev,
					point: pointer.point,
					shift: shift
				});
			}

		} else if (deltaX > 0) {
			if (io.events.isEnabled("swiperight") && !system.isPaused) {
				io.events.dispatchImmediately("wheelright", {
					type: "wheelright",
					target: io,
					event: ev,
					point: pointer.point,
					shift: shift
				});
			}

			// Vertical
		} else if (deltaY < 0) {
			if (io.events.isEnabled("wheelup") && !system.isPaused) {
				io.events.dispatchImmediately("wheelup", {
					type: "wheelup",
					target: io,
					event: ev,
					point: pointer.point,
					shift: shift
				});
			}

		} else if (deltaY > 0) {
			if (io.events.isEnabled("wheeldown") && !system.isPaused) {
				io.events.dispatchImmediately("wheeldown", {
					type: "wheeldown",
					target: io,
					event: ev,
					point: pointer.point,
					shift: shift
				});
			}
		}
	}

	/**
	 * Initiates inertia checking sub-routines for different movement types:
	 * drag, resize.
	 *
	 * @ignore Exclude from docs
	 * @param sprite
	 * @param pointer
	 */
	public handleInertia(io: InteractionObject, pointer: IPointer): void {

		if (io.draggable && io.downPointers.length === 0) {
			this.handleMoveInertia(io, pointer);
		}

		if (io.resizable && io.downPointers.length > 1) {
			this.handleResizeInertia(io, pointer);
		}

	}

	/**
	 * Continues moving the element to simulate the effect of inertia. Happens
	 * when `inert` and `draggable` object is dragged and then released.
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 */
	public handleMoveInertia(io: InteractionObject, pointer: IPointer): void {
		let interaction = io;
		let type: "move" = "move";
		let point = {
			"x": pointer.point.x,
			"y": pointer.point.y
		};
		let startPoint = {
			"x": pointer.startPoint.x,
			"y": pointer.startPoint.y
		};

		// Init inertia object
		let inertia = new Inertia(interaction, type, point, startPoint);

		// Get inertia data
		let ref = this.getTrailPoint(pointer, $time.getTime() - this.getInertiaOption(io, "move", "time"));
		if (typeof ref === "undefined") {
			this.processDragStop(io, pointer, pointer.lastUpEvent);
			return;
		}

		// Init animation options
		let factor = this.getInertiaOption(io, "move", "factor");
		let animationOptions = [{
			"to": pointer.point.x + (pointer.point.x - ref.point.x) * factor,
			"property": "x"
		}, {
			"to": pointer.point.y + (pointer.point.y - ref.point.y) * factor,
			"property": "y"
		}];

		// Start animation
		let animation: Animation = new Animation(
			inertia,
			animationOptions,
			this.getInertiaOption(io, "move", "duration"),
			this.getInertiaOption(io, "move", "easing")
		).start();
		this._disposers.push(animation.events.on("animationended", (ev) => {
			inertia.done();
		}));

		// Add inertia object
		io.inertias.setKey("move", inertia);

	}

	/**
	 * Continues resizing of a `resizable` element after it is resized and
	 * released.
	 *
	 * **NOTE:** this is is just a placeholder function. No actual fucntionality
	 * is implemented, yet.
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 */
	public handleResizeInertia(io: InteractionObject, pointer: IPointer): void {

		// Some day, folks. Some day...

	}

	/**
	 * Recalculates element's position and size based on position of
	 * all its related pointers.
	 *
	 * @ignore Exclude from docs
	 * @param io  Element
	 * @param ev  Original event
	 */
	public handleTransform(io: InteractionObject, ev: MouseEvent | TouchEvent): void {


		// Get primary pointer and its respective points
		let pointer1: $type.Optional<IPointer> = io.downPointers.getIndex(0);
		let point1: IPoint = null;
		let startPoint1: IPoint = null;

		if (pointer1) {
			point1 = pointer1.point;
			startPoint1 = pointer1.startPoint;
		}

		// Init secondary pointer
		let pointer2: $type.Optional<IPointer>;
		let point2: IPoint;
		let startPoint2: IPoint;

		// Use center of the sprite to simulate "second" point of touch
		point2 = {
			"x": io.originalPosition.x,
			"y": io.originalPosition.y
		};
		startPoint2 = point2;

		// Determine if it's a sinngle pointer or multi
		let singlePoint: boolean = true;
		for (let i = 1; i < io.downPointers.length; i++) {

			// Get pointer
			let nextPointer = io.downPointers.getIndex(i);

			// Doublecheck if it's not the same pointer by comparing original position
			if (startPoint1.x != nextPointer.startPoint.x && startPoint1.y != nextPointer.startPoint.y) {

				// Several pointers down
				singlePoint = false;

				// Get second pointer
				pointer2 = nextPointer;
				point2 = pointer2.point;
				startPoint2 = pointer2.startPoint;

				// Stop looking
				break;
			}
		}

		// Primary touch point moved?
		let pointer1Moved = pointer1 && this.moved(pointer1, 0);

		// Report DRAG_START if necessary
		if (io.draggable && pointer1 && pointer1.dragStartEvents && pointer1.dragStartEvents.length && pointer1Moved) {
			if (io.events.isEnabled("dragstart") && !system.isPaused) {
				io.events.dispatchImmediately("dragstart", pointer1.dragStartEvents.shift());
			}
			//delete pointer1.dragStartEvents;
		}

		// Determine what we do in order of superiority
		if (singlePoint && io.draggable) {

			// We have only one pointer and the Sprite is draggable
			// There's nothing else to be done - just move it
			this.handleTransformMove(io, point1, startPoint1, ev, pointer1Moved, pointer1.touch);

		}
		else {

			// Check if second touch point moved
			let pointer2Moved = pointer2 && this.moved(pointer2, 0);

			if (io.draggable && io.resizable) {
				//this.handleTransformAll(io, point1, startPoint1, point2, startPoint2, ev, pointer1Moved && pointer2Moved);
				this.handleTransformMove(io, point1, startPoint1, ev, pointer1Moved && pointer2Moved, pointer1.touch);
				this.handleTransformResize(io, point1, startPoint1, point2, startPoint2, ev, pointer1Moved && pointer2Moved, pointer1.touch);
			}
			else {

				if (io.draggable) {
					this.handleTransformMove(io, point1, startPoint1, ev, pointer1Moved, pointer1.touch);
				}

				if (io.resizable && (!singlePoint || ev.ctrlKey)) {
					this.handleTransformResize(io, point1, startPoint1, point2, startPoint2, ev, pointer1Moved && pointer2Moved, pointer1.touch);
				}

			}

		}

	}

	/**
	 * Handles movement of the dragged element.
	 *
	 * @ignore Exclude from docs
	 * @param io            Element
	 * @param point         Current point of the pointer
	 * @param startPoint    Starting point of the pointer
	 * @param ev            Original event
	 * @param pointerMoved  Did pointer move?
	 */
	public handleTransformMove(io: InteractionObject, point: IPoint, startPoint: IPoint, ev: MouseEvent | TouchEvent | KeyboardEvent, pointerMoved: boolean, touch: boolean): void {

		if (pointerMoved) {
			if (io.events.isEnabled("drag") && !system.isPaused && (!io.isTouchProtected || !touch)) {
				let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["drag"] = {
					type: "drag",
					target: io,
					event: ev,
					shift: {
						"x": point.x - startPoint.x,
						"y": point.y - startPoint.y
					},
					startPoint: startPoint,
					point: point,
					touch: touch
				};
				io.events.dispatchImmediately("drag", imev);
			}

		}

	}

	/**
	 * Handles resizing of the element.
	 *
	 * @ignore Exclude from docs
	 * @param io            Element
	 * @param point1        Current position of reference point #1
	 * @param startPoint1   Original position of reference point #1
	 * @param point2        Current position of reference point #2
	 * @param startPoint2   Original position of reference point #2
	 * @param ev            Original event
	 * @param pointerMoved  Did pointer move?
	 */
	public handleTransformResize(io: InteractionObject, point1: IPoint, startPoint1: IPoint, point2: IPoint, startPoint2: IPoint, ev: MouseEvent | TouchEvent, pointerMoved: boolean, touch: boolean): void {
		if (io.events.isEnabled("resize") && !system.isPaused && (!io.isTouchProtected || !touch)) {
			let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["resize"] = {
				type: "resize",
				target: io,
				event: ev,
				scale: $math.getScale(point1, startPoint1, point2, startPoint2),
				startPoint1: startPoint1,
				point1: point1,
				startPoint2: startPoint2,
				point2: point2,
				touch: touch
			};
			io.events.dispatchImmediately("resize", imev);
		}

	}

	/**
	 * Handles all the preparations of the element when it starts to be dragged.
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 * @param ev       Original event
	 */
	public processDragStart(io: InteractionObject, pointer?: IPointer, ev?: MouseEvent | TouchEvent): void {

		// Add to draggedObjects
		this.transformedObjects.moveValue(io);

		// Report "dragstart"
		let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["dragstart"] = {
			type: "dragstart",
			target: io,
			event: ev,
			touch: pointer ? pointer.touch : false
		};

		// Log object that we are starting to drag, so we can check against and
		// avoid hovers on other objects that might be in the path of movement.
		if (pointer) {
			pointer.dragTarget = io;
			//pointer.startPoint = pointer.point;
		}

		/**
		 * If pointer is set we will not fire the event until the pointer has
		 * actually moved. If it's not set we don't have to wait for anything, so we
		 * just fire off the event right away.
		 */
		if (pointer && pointer.dragStartEvents) {
			pointer.dragStartEvents.push(imev);
		}
		else {
			if (!system.isPaused) {
				io.dispatchImmediately("dragstart", imev);
			}
		}
	}

	/**
	 * Finishes up element drag operation.
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 * @param ev       Original event
	 */
	public processDragStop(io: InteractionObject, pointer?: IPointer, ev?: MouseEvent | TouchEvent): void {

		// Pointer set?
		if (!pointer) {
			pointer = this.getDragPointer(io);
		}

		// Unset drag object
		if (pointer) {
			pointer.dragTarget = undefined;
		}

		// Removed from transformedObjects
		this.transformedObjects.removeValue(io);

		// Unlock document
		//this.unlockDocument();

		// Report dragstop
		if (!pointer || this.moved(pointer, 0)) {
			if (io.events.isEnabled("dragstop") && !system.isPaused) {
				let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["dragstop"] = {
					type: "dragstop",
					target: io,
					touch: pointer ? pointer.touch : false
				};
				io.events.dispatchImmediately("dragstop", imev);
			}
		}
	}

	/**
	 * Handles all the preparations of the element when it starts to be resized.
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 * @param ev       Original event
	 */
	public processResizeStart(io: InteractionObject, pointer?: IPointer, ev?: MouseEvent | TouchEvent): void {

		// Add to draggedObjects
		this.transformedObjects.moveValue(io);

	}

	/**
	 * Finishes up element drag operation.
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 * @param ev       Original event
	 */
	public processResizeStop(io: InteractionObject, pointer?: IPointer, ev?: MouseEvent | TouchEvent): void {

		// Removed from transformedObjects
		this.transformedObjects.removeValue(io);

	}


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
	 * @param io       Element
	 * @param pointer  Pointer
	 */
	public dragStart(io: InteractionObject, pointer?: IPointer): void {
		if (!pointer) {
			pointer = this.getDragPointer(io);
		}

		if (pointer) {
			this.handleDown(io, pointer, pointer.lastDownEvent);
		}
	}

	/**
	 * Manually ends drag on the element.
	 *
	 * @param io       Element
	 * @param pointer  Pointer
	 */
	public dragStop(io: InteractionObject, pointer?: IPointer): void {
		if (!pointer) {
			pointer = this.getDragPointer(io);
		}

		if (pointer) {
			this.handleGlobalUp(pointer, pointer.lastUpEvent);
		}
	}

	/**
	 * This method uses a fuzzy logic to find the pointer to be used for dragging.
	 * Beware that this is not a rock-solid solution. If there are a few objects
	 * being dragged at the same time, you may get unexepected results.
	 *
	 * @param io  InteractionObject to get pointers from
	 * @return Pointer currently being used for dragging
	 */
	public getDragPointer(io?: InteractionObject): $type.Optional<IPointer> {
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
	}


	/**
	 * ==========================================================================
	 * Utils
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Returns pointer id for the given event object.
	 *
	 * @param ev  Event
	 * @return Pointer ID
	 */
	protected getPointerId(ev: any): string {
		let id = "";
		if ($type.hasValue(ev.identifier)) {
			id = "" + <string>ev.identifier;
		} else if ($type.hasValue(ev.pointerId)) {
			id = "" + <string>ev.pointerId;
		} else {
			id = "m";
		}
		return id.replace("-", "");
	}

	/**
	 * Returns a cursor position of the event.
	 *
	 * @param ev  Original event
	 * @return Event point
	 */
	protected getPointerPoint(ev: MouseEvent | Touch): IPoint {
		return {
			"x": ev.clientX,
			"y": ev.clientY
		};
	}

	/**
	 * Returns [[Pointer]] object that is associated with the Event.
	 *
	 * If no such [[Pointer]] object exists, it is created.
	 *
	 * @param ev  Event
	 * @return Pointer
	 */
	protected getPointer(ev: MouseEvent | Touch): IPointer {

		// Get pointer id
		let id = this.getPointerId(ev);

		// Get current coordinates
		let point = this.getPointerPoint(ev);

		// Look for the pointer in the Dictionary if it maybe already exists
		let pointer: IPointer;
		if (this.pointers.hasKey(id)) {

			// We already have such pointer
			pointer = this.pointers.getKey(id)!;

			// We need this, because Edge reuses pointer ids across touch and mouse
			pointer.touch = this.isPointerTouch(ev);

			// Reset pointer
			//pointer.point = point;

		}
		else {
			// Init pointer
			pointer = {
				"id": id,
				//"touch": !(ev instanceof MouseEvent) || ((<any>ev).pointerType && (<any>ev).pointerType != "pointer"),
				//"touch": !(ev instanceof MouseEvent) || ((<any>ev).pointerType && (<any>ev).pointerType != "mouse"),
				"touch": this.isPointerTouch(ev),
				"startPoint": point,
				"startTime": $time.getTime(),
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
	}

	/**
	 * Determines if pointer event originated from a touch pointer or mouse.
	 *
	 * @param ev  Original event
	 * @return Touch pointer?
	 */
	protected isPointerTouch(ev: MouseEvent | Touch): boolean {
		if (typeof Touch !== "undefined" && ev instanceof Touch) {
			return true;
		}
		else if (typeof PointerEvent !== "undefined" && ev instanceof PointerEvent && $type.hasValue((<any>ev).pointerType)) {
			switch ((<any>ev).pointerType) {
				case "touch":
				case "pen":
				case 2:
					return true;
				case "mouse":
				case 4:
					return false;
				default:
					return !(ev instanceof MouseEvent);
			}
		}
		else if ($type.hasValue((<any>ev).type)) {
			if ((<any>ev).type.match(/^mouse/)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Resets the poiner to original state, i.e. cleans movement information,
	 * starting point, etc.
	 *
	 * @param pointer Pointer
	 */
	protected resetPointer(pointer: IPointer, ev: MouseEvent | PointerEvent | Touch): void {
		// Get current coordinates
		let point = this.getPointerPoint(ev);;
		pointer.startTime = $time.getTime();
		pointer.startPoint = { x: point.x, y: point.y };
		pointer.point = { x: point.x, y: point.y };
		pointer.track = [];
		pointer.swipeCanceled = false;
		//clearTimeout(pointer.swipeTimeout);
		//clearTimeout(pointer.holdTimeout);
	}

	/**
	 * Adds a "breadcrumb" point to the [[Pointer]] to log its movement path.
	 *
	 * @param pointer  Pointer
	 * @param point    Point coordinates
	 */
	protected addBreadCrumb(pointer: IPointer, point: IPoint): void {
		pointer.track.push({
			"timestamp": $time.getTime(),
			"point": point
		});
	}

	/**
	 * Prepares the document for various touch-related operations.
	 *
	 * @ignore Exclude from docs
	 */
	public lockDocument(): void {
		this.prepElement(this.body);
	}

	/**
	 * Restores document functionality.
	 *
	 * @ignore Exclude from docs
	 */
	public unlockDocument(): void {
		if (this.transformedObjects.length == 0) {
			this.restoreAllStyles(this.body);
		}
	}

	/**
	 * Lock element (disable all touch)
	 *
	 * @ignore Exclude from docs
	 */
	public lockElement(io: InteractionObject): void {
		this.prepElement(io);
	}

	/**
	 * Restores element's functionality.
	 *
	 * @ignore Exclude from docs
	 */
	public unlockElement(io: InteractionObject): void {
		this.restoreAllStyles(io);
	}

	/**
	 * Locks document's wheel scroll.
	 *
	 * @ignore Exclude from docs
	 */
	public lockWheel(): void {
		window.addEventListener(
			this._pointerEvents.wheel,
			this.wheelLockEvent,
			this._passiveSupported ? { passive: false } : false
		);
	}

	/**
	 * Unlocks document's wheel scroll.
	 *
	 * @ignore Exclude from docs
	 */
	public unlockWheel(): void {
		window.removeEventListener(
			this._pointerEvents.wheel,
			this.wheelLockEvent
		);
	}

	/**
	 * Checks if top element at pointer's position belongs to the SVG.
	 *
	 * @ignore Exlude from docs
	 * @param pointer  Pointer
	 * @param svg      The <svg> element
	 * @param id       A unique identifier of the object that is checking for locality
	 * @return Belongs to SVG
	 */
	public isLocalElement(pointer: IPointer, svg: SVGSVGElement, id: string): boolean {
		let cached = this.getCache("local_pointer_" + pointer.id);
		if ($type.hasValue(cached)) {
			return cached;
		}
		let target = ($dom.getRoot(svg) || document).elementFromPoint(pointer.point.x, pointer.point.y);
		let local = target && $dom.contains(svg, <HTMLElement>target);
		this.setCache("local_pointer_" + pointer.id + "_" + id, local, 100);
		return local;
	}

	/**
	 * A function that cancels mouse wheel scroll.
	 *
	 * @ignore Exclude from docs
	 * @param ev  Event object
	 * @return Returns `false` to cancel
	 */
	protected wheelLockEvent(ev: Event): boolean {
		ev.preventDefault();
		return false;
	}

	/**
	 * Applies a set of styles to an element. Stores the original styles so they
	 * can be restored later.
	 *
	 * @ignore
	 * @param io      Element
	 */
	public prepElement(io: InteractionObject): void {

		let el = io.element;

		if (el) {

			// Define possible props
			let props = [
				"touchAction", "webkitTouchAction", "MozTouchAction", "MSTouchAction", "msTouchAction", "oTouchAction",
				"userSelect", "webkitUserSelect", "MozUserSelect", "MSUserSelect", "msUserSelect", "oUserSelect",
				"touchSelect", "webkitTouchSelect", "MozTouchSelect", "MSTouchSelect", "msTouchSelect", "oTouchSelect",
				"touchCallout", "webkitTouchCallout", "MozTouchCallout", "MSTouchCallout", "msTouchCallout", "oTouchCallout",
				"contentZooming", "webkitContentZooming", "MozContentZooming", "MSContentZooming", "msContentZooming", "oContentZooming",
				"userDrag", "webkitUserDrag", "MozUserDrag", "MSUserDrag", "msUserDrag", "oUserDrag"
			];
			for (let i = 0; i < props.length; i++) {
				if (props[i] in el.style) {
					this.setTemporaryStyle(io, props[i], "none");
				}
			}

			// Remove iOS-specific selection;
			this.setTemporaryStyle(io, "tapHighlightColor", "rgba(0, 0, 0, 0)");
			//this.setTemporaryStyle(io, "webkitOverflowScrolling", "none");
		}

	}

	/**
	 * Restores replaced styles
	 *
	 * @ignore
	 * @param  io  Element
	 */
	public unprepElement(io: InteractionObject): void {

		let el = io.element;

		if (el) {

			// Define possible props
			let props = [
				"touchAction", "webkitTouchAction", "MozTouchAction", "MSTouchAction", "msTouchAction", "oTouchAction",
				"userSelect", "webkitUserSelect", "MozUserSelect", "MSUserSelect", "msUserSelect", "oUserSelect",
				"touchSelect", "webkitTouchSelect", "MozTouchSelect", "MSTouchSelect", "msTouchSelect", "oTouchSelect",
				"touchCallout", "webkitTouchCallout", "MozTouchCallout", "MSTouchCallout", "msTouchCallout", "oTouchCallout",
				"contentZooming", "webkitContentZooming", "MozContentZooming", "MSContentZooming", "msContentZooming", "oContentZooming",
				"userDrag", "webkitUserDrag", "MozUserDrag", "MSUserDrag", "msUserDrag", "oUserDrag"
			];
			for (let i = 0; i < props.length; i++) {
				if (props[i] in el.style) {
					this.restoreStyle(io, props[i]);
				}
			}

			// Remove iOS-specific selection;
			this.restoreStyle(io, "tapHighlightColor");
			//this.restoreStyle(io, "webkitOverflowScrolling");
		}

	}

	/**
	 * Returns an option associated with hit events.
	 *
	 * @ignore Exclude from docs
	 * @param io      Element
	 * @param option  Option key
	 * @return Option value
	 */
	public getHitOption(io: InteractionObject, option: keyof IHitOptions): any {
		let res = io.hitOptions[option];
		if (typeof res === "undefined") {
			res = this.hitOptions[option];
		}
		return res;
	}

	/**
	 * Returns an option associated with hover events.
	 *
	 * @ignore Exclude from docs
	 * @param io      Element
	 * @param option  Option key
	 * @return Option value
	 */
	public getHoverOption(io: InteractionObject, option: keyof IHoverOptions): any {
		let res = io.hoverOptions[option];
		if (typeof res === "undefined") {
			res = this.hoverOptions[option];
		}
		return res;
	}

	/**
	 * Returns an option associated with swipe events.
	 *
	 * @ignore Exclude from docs
	 * @param io      Element
	 * @param option  Option key
	 * @return Option value
	 */
	public getSwipeOption(io: InteractionObject, option: keyof ISwipeOptions): any {
		let res = io.swipeOptions[option];
		if (typeof res === "undefined") {
			res = this.swipeOptions[option];
		}
		return res;
	}

	/**
	 * Returns an option for keyboard.
	 *
	 * @ignore Exclude from docs
	 * @param io      Element
	 * @param option  Option key
	 * @return Option value
	 */
	public getKeyboardOption(io: InteractionObject, option: keyof IKeyboardOptions): any {
		let res = io.keyboardOptions[option];
		if (typeof res === "undefined") {
			res = this.keyboardOptions[option];
		}
		return res;
	}

	/**
	 * Returns an option for mouse.
	 *
	 * @ignore Exclude from docs
	 * @param io      Element
	 * @param option  Option key
	 * @return Option value
	 */
	public getMouseOption(io: InteractionObject, option: keyof IMouseOptions): any {
		let res = io.mouseOptions[option];
		if (typeof res === "undefined") {
			res = this.mouseOptions[option];
		}
		return res;
	}

	/**
	 * Returns an option associated with inertia.
	 *
	 * @ignore Exclude from docs
	 * @param io      Element
	 * @param type    Inertia type
	 * @param option  Option key
	 * @return Option value
	 */
	public getInertiaOption(io: InteractionObject, type: InertiaTypes, option: keyof IInertiaOptions): any {
		let options: any = io.inertiaOptions.getKey(type);
		let res: IInertiaOptions;
		if (options && $type.hasValue(options[option])) {
			res = options[option];
		}
		else {
			res = (<any>this.inertiaOptions.getKey(type))[option];
		}
		return res;
	}

	/**
	 * Stops currently going on inertia. Useful if inertia is currently being
	 * animated and the object is being interacted with.
	 *
	 * @param io Element
	 */
	protected stopInertia(io: InteractionObject): void {
		let x: InertiaTypes;
		let inertias: Array<InertiaTypes> = ["move", "resize"];
		for (let i = 0; i < inertias.length; i++) {
			x = inertias[i];
			if (io.inertias.hasKey(x)) {
				let inertia: $type.Optional<Inertia> = io.inertias.getKey(x);
				if (inertia) {
					inertia.dispose();
					//io.inertiaAnimations.removeKey(x);
					//this.processDragStop(io);
					continue;
				}
			}
		}
	}

	/**
	 * Check if swiping is currently being performed on an object.
	 *
	 * @param io       Element
	 * @param pointer  Pointer to check
	 * @return `true` if swiping
	 */
	public swiping(io: InteractionObject, pointer: IPointer): boolean {
		let now = $time.getTime();

		if (pointer.swipeCanceled || !io.swipeable) {
			return false;
		}
		else if (
			(Math.abs(pointer.startPoint.y - pointer.point.y) < this.getSwipeOption(io, "verticalThreshold")) &&
			(pointer.startTime > (now - this.getSwipeOption(io, "time")))
		) {
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * Returns `true` if a successfull swipe action was performed on an element.
	 *
	 * @param io       Element
	 * @param pointer  Pointer
	 * @return Swiped?
	 */
	public swiped(io: InteractionObject, pointer: IPointer): boolean {
		let now = $time.getTime();
		if (pointer.swipeCanceled) {
			return false;
		}
		else if (
			(Math.abs(pointer.startPoint.x - pointer.point.x) > this.getSwipeOption(io, "horizontalThreshold")) &&
			(Math.abs(pointer.startPoint.y - pointer.point.y) < this.getSwipeOption(io, "verticalThreshold")) &&
			(pointer.startTime > (now - this.getSwipeOption(io, "time")))
		) {
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * Applies style to mouse cursor based on its stage in relation to
	 * [[InteractionObject]].
	 *
	 * @ignore Exclude from docs
	 * @param Element
	 */
	public applyCursorOverStyle(io: InteractionObject): void {

		// Get sprite's cursor ooptions
		let options = io.cursorOptions;

		if (!$type.hasValue(options.overStyle)) {
			return;
		}

		// Apply cursor down styles
		for (let i = 0; i < options.overStyle.length; i++) {
			$dom.setStyle(io.element, options.overStyle[i].property, options.overStyle[i].value);
		}

	}

	/**
	 * Applies style to mouse cursor based on its stage in relation to
	 * [[InteractionObject]].
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 */
	public applyCursorDownStyle(io: InteractionObject, pointer: IPointer): void {

		// Not applicable for touch pointers since they don't display a cursor
		if (pointer.touch) {
			return;
		}

		const downStyle = io.cursorOptions.downStyle;
		// Is down?
		if (io.downPointers.contains(pointer) && $type.hasValue(downStyle)) {
			// Apply cursor down styles
			for (let i = 0; i < downStyle.length; i++) {
				this.setTemporaryStyle(this.body, downStyle[i].property, downStyle[i].value);
				this.setTemporaryStyle(io, downStyle[i].property, downStyle[i].value);
			}
		}
	}

	/**
	 * Restores original cursor style for the element.
	 *
	 * @ignore Exclude from docs
	 * @param io       Element
	 * @param pointer  Pointer
	 */
	public restoreCursorDownStyle(io: InteractionObject, pointer: IPointer): void {

		// Not applicable for touch pointers since they don't display a cursor
		if (pointer.touch) {
			return;
		}

		const downStyle = io.cursorOptions.downStyle;

		// Is down?
		if (io.downPointers.contains(pointer) && $type.hasValue(downStyle)) {
			// Apply cursor down styles
			for (let i = 0; i < downStyle.length; i++) {
				this.restoreStyle(this.body, downStyle[i].property);
				this.restoreStyle(io, downStyle[i].property);
			}
		}
	}

	/**
	 * Sets style on the body of the document.
	 *
	 * @ignore Exclude from docs
	 * @param style  Style definitions
	 */
	public setGlobalStyle(style: Array<IStyleProperty> | IStyleProperty): void {
		let body = getInteraction().body;
		let styles = <Array<IStyleProperty>>($type.isArray(style) ? style : [style]);
		for (let i = 0; i < styles.length; i++) {
			this.setTemporaryStyle(body, styles[i].property, styles[i].value);
		}
	}

	/**
	 * Restores style on the body of the document.
	 *
	 * @ignore Exclude from docs
	 * @param style  Style definitions
	 */
	public restoreGlobalStyle(style: Array<IStyleProperty> | IStyleProperty): void {
		let body = getInteraction().body;
		let styles = <Array<IStyleProperty>>($type.isArray(style) ? style : [style]);
		for (let i = 0; i < styles.length; i++) {
			this.restoreStyle(body, styles[i].property);
		}
	}

	/**
	 * Checks if element is a non-cahrt element.
	 *
	 * @param io  InteractionObject
	 * @return Global element?
	 */
	protected isGlobalElement(io: InteractionObject): boolean {
		return document.body === io.element;
	}

	/**
	 * Checks if pointer has moved since it was created.
	 *
	 * @param pointer    Pointer
	 * @param tolerance  Tolerance in pixels
	 * @param minTime    Minimum time required for the pointer to be down to be considered moved
	 * @return `true` if the pointer has moved
	 */
	public moved(pointer: IPointer, tolerance: number, minTime: number = 300): boolean {

		/*// If there was more time, we don't care if cursor actually moved
		let duration = $time.getTime() - pointer.startTime;
		if ($type.hasValue(minTime) && (minTime > duration)) {
			return false;
		}*/

		// That was quick measure shift
		let shift = this.getShift(pointer);

		return (Math.abs(shift.x) > tolerance) || (Math.abs(shift.y) > tolerance);
	}

	/**
	 * Returns if pointer is "old", meaning it has been pressing for more than
	 * X milliseconds.
	 *
	 * @ignore
	 * @param pointer  Pointer
	 * @param minTime  Minimum time to consider pointer old
	 * @return {boolean}
	 */
	public old(pointer: IPointer, minTime: number = 300): boolean {
		return $time.getTime() - pointer.startTime > minTime;
	}

	/**
	 * Returns total a shift in pointers coordinates between its original
	 * position and now.
	 *
	 * @param pointer  Pointer
	 * @return Shift in coordinates (x/y)
	 */
	public getShift(pointer: IPointer): IPoint {
		return {
			"x": pointer.startPoint.x - pointer.point.x,
			"y": pointer.startPoint.y - pointer.point.y
		}
	}

	/**
	 * Returns a point from [[Pointer]]'s move history at a certain timetamp.
	 *
	 * @param pointer    Pointer
	 * @param timestamp  Timestamp
	 * @return Point
	 */
	public getTrailPoint(pointer: IPointer, timestamp: number): $type.Optional<IBreadcrumb> {
		let res: $type.Optional<IBreadcrumb>;
		for (let i = 0; i < pointer.track.length; i++) {
			if (pointer.track[i].timestamp >= timestamp) {
				res = pointer.track[i];
				break;
			}
		}
		return res;
	}

	/**
	 * Checks if same pointer already exists in the list.
	 *
	 * @param list     List to check agains
	 * @param pointer  Pointer
	 * @return Exists?
	 */
	protected pointerExists(list: List<IPointer>, pointer: IPointer): boolean {
		let exists = false;
		list.each((item) => {
			if (item == pointer) {
				return;
			}
			exists = item.point.x == pointer.point.x && item.point.y == pointer.point.y;
		});
		return exists;
	}

	/**
	 * Returns an [[InteractionObject]] representation of a DOM element.
	 *
	 * You can use this on any HTML or SVG element, to add interactive features
	 * to it.
	 *
	 * @param element  Element
	 * @return InteractionObject
	 */
	public getInteraction(element: HTMLElement | SVGSVGElement): InteractionObject {
		return new InteractionObject(element);
	}

	/**
	 * Sets a style property on an element. Stores original value to be restored
	 * later with [[restoreStyle]].
	 *
	 * @see {@link restoreStyle}
	 * @param io        Element
	 * @param property  Property
	 * @param value     Value
	 */
	public setTemporaryStyle(io: InteractionObject, property: string, value: string): void {

		// Get element
		//let el = io.element.tagName == "g" ? <SVGSVGElement>io.element.parentNode : io.element;
		let el = io.element;

		// Save original property if it is set and hasn't been saved before already
		if ($type.hasValue((<any>el.style)[property]) && !io.replacedStyles.hasKey(property)) {
			io.replacedStyles.setKey(property, (<any>el.style)[property]);
		}

		// Replace with the new one
		$dom.setStyle(el, property, value);

	}

	/**
	 * Restores specific style on an element.
	 *
	 * @param io        Element
	 * @param property  Style property
	 */
	public restoreStyle(io: InteractionObject, property: string): void {

		// Reset style
		if (io.replacedStyles.hasKey(property)) {
			(<any>io.element.style)[property] = io.replacedStyles.getKey(property);
			io.replacedStyles.removeKey(property);
		}
		else {
			delete (<any>io.element.style)[property];
		}
	}

	/**
	 * Restore temporarily reset styles on an element.
	 *
	 * @param io Element
	 */
	public restoreAllStyles(io: InteractionObject): void {
		$iter.each(io.replacedStyles.iterator(), (a) => {
			const key = a[0];
			const value = a[1];
			(<any>io.element.style)[key] = value;
			io.replacedStyles.removeKey(key);
		});
	}

	/**
	 * Disposes this object and cleans up after itself.
	 */
	public dispose(): void {
		if (!this.isDisposed()) {
			super.dispose();
			this.restoreAllStyles(this.body);
			this.unlockWheel();
		}
	}

	// @ts-ignore Used for debugging
	private log(text: string, ev: MouseEvent | TouchEvent | PointerEvent, io?: InteractionObject): void {
		let show = true;
		if (show) {
			// Touchlist?
			if ((<any>ev).changedTouches) {
				for (let i = 0; i < (<any>ev).changedTouches.length; i++) {
					this.logTouch(text, ev.type, (<any>ev).changedTouches[i])
				}
				return;
			}

			// Get type
			let type = "";
			if ((<any>ev).pointerType) {
				switch ((<any>ev).pointerType) {
					case 2:
						type = "touch";
						break;
					case 4:
						type = "mouse";
						break;
					default:
						type = (<any>ev).pointerType;
						break;
				}
			}
			else if (typeof TouchEvent != "undefined" && ev instanceof TouchEvent) {
				type = "touch";
			}
			else if (ev.type.match(/^mouse/)) {
				type = "mouse";
			}
			else {
				type = "???";
			}

			// Get ID
			let id = "";
			if ($type.hasValue((<any>ev).identifier)) {
				id = <string>(<any>ev).identifier;
			} else if ($type.hasValue((<any>ev).pointerId)) {
				id = <string>(<any>ev).pointerId;
			} else {
				id = "???";
			}

			if (io) {
				console.log(text + " (" + io.uid + ")  " + ev.type + "  " + type + "  " + id);
			}
			else {
				console.log(text + "  " + ev.type + "  " + type + "  " + id);
			}
		}

	}

	private logTouch(text: string, type: string, ev: Touch): void {
		console.log(text + "  " + type + "  " + "touch" + "  " + ev.identifier);
	}

	/**
	 * Indicates if passive mode options is supported by this browser.
	 */
	private static _passiveSupported: boolean;

	/**
	 * Indicates if passive mode options is supported by this browser.
	 */
	static get passiveSupported () {

		if (this._passiveSupported == null) {

			// Check for passive mode support
			try {
				let options = Object.defineProperty({}, "passive", {
					get: () => {
						this._passiveSupported = true;
					}
				});
				window.addEventListener("test", options, options);
				window.removeEventListener("test", options, options);
			} catch (err) {
				this._passiveSupported = false;
			}
		}

		return this._passiveSupported;
	}

}


let interaction: Interaction | null = null;

/**
 * Returns a single unified global instance of [[Interaction]].
 *
 * All code should use this function, rather than create their own instances
 * of [[Interaction]].
 */
export function getInteraction(): Interaction {
	if (interaction == null) {
		interaction = new Interaction();
	}

	return interaction;
}
