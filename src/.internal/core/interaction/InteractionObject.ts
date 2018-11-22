/**
 * Interaction Object module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IInteractionObjectEvents, InteractionObjectEventDispatcher } from "./InteractionObjectEvents";
import { BaseObjectEvents } from "../Base";
import { List } from "../utils/List";
import { Dictionary, DictionaryDisposer } from "../utils/Dictionary";
import { AMEvent } from "../utils/EventDispatcher";
import { IPoint } from "../defs/IPoint";
import { IPointer } from "./Pointer";
import { IInertiaOptions, ISwipeOptions, IHitOptions, IHoverOptions, ICursorOptions, IKeyboardOptions } from "./InteractionOptions";
import { InteractionKeyboardObject } from "./InteractionKeyboardObject";
import { getInteraction } from "./Interaction";
import { Inertia, InertiaTypes } from "./Inertia";
import { IDisposer } from "../utils/Disposer";
import { Optional } from "../utils/Type";
import * as $iter from "../utils/Iterator";
import * as $type from "../utils/Type";


/**
 * Re-exports
 */
export { IInteractionObjectEvents, InteractionObjectEventDispatcher };

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
export class InteractionObject extends BaseObjectEvents {
	/**
	 * Defines available events.
	 *
	 * @type {IInteractionObjectEvents}
	 */
	public _events!: IInteractionObjectEvents;

	/**
	 * An [[EventDispatcher]] instance which holds events for this object
	 */
	public events: InteractionObjectEventDispatcher<AMEvent<this, this["_events"]>> = new InteractionObjectEventDispatcher(this);

	/**
	 * Collection of Disposers for various events. (so that those get disposed
	 * when the whole InteractionObject is disposed)
	 *
	 * @ignore Exclude from docs
	 * @type {Dictionary<string, IDisposer>}
	 */
	public eventDisposers: Dictionary<string, IDisposer> = new Dictionary<string, IDisposer>();

	/**
	 * A [[Dictionary]] that holds temporarily replaced original style values for
	 * HTML element, so that they can be restored when the functionality that
	 * replaced them is done.
	 *
	 * @ignore Exclude from docs
	 * @type {Dictionary<string, string>}
	 */
	public replacedStyles: Dictionary<string, string> = new Dictionary<string, string>();

	protected _clickable: boolean = false;
	protected _hoverable: boolean = false;
	protected _trackable: boolean = false;
	protected _draggable: boolean = false;
	protected _swipeable: boolean = false;
	protected _resizable: boolean = false;
	protected _wheelable: boolean = false;
	protected _inert: boolean = false;
	protected _focusable: $type.Optional<boolean>;
	protected _tabindex: Optional<number>;

	/**
	 * Element to attach events to.
	 *
	 * @type {HTMLElement}
	 */
	private _element: HTMLElement | SVGSVGElement;

	/**
	 * Original coordinates for the [[InteractionObject]]. (before application
	 * of the drag)
	 *
	 * @type {IPoint}
	 */
	public _originalPosition: Optional<IPoint>;

	/**
	 * Original angle for the [[InteractionObject]]. (before rotation started)
	 *
	 * @type {Optional<number>}
	 */
	public _originalAngle: $type.Optional<number>;

	/**
	 * Original scale of the [[InteractionObject]]. (before resizing started)
	 * @type {Optional<number>}
	 */
	public _originalScale: $type.Optional<number>;

	/**
	 * List of pointers current over element.
	 *
	 * @type {Optional<List<IPointer>>}
	 */
	protected _overPointers: $type.Optional<List<IPointer>>;

	/**
	 * List of pointer currently pressing down on element.
	 *
	 * @type {Optional<List<IPointer>>}
	 */
	protected _downPointers: $type.Optional<List<IPointer>>;

	/**
	 * Is element currently hovered?
	 *
	 * @type {boolean}
	 */
	protected _isHover: boolean = false;

	/**
	 * Is the element hovered by touch pointer?
	 * 
	 * @type {boolean}
	 */
	protected _isHoverByTouch: boolean = false;

	/**
	 * Has element got any pointers currently pressing down on it?
	 * @type {boolean}
	 */
	protected _isDown: boolean = false;

	/**
	 * Does element have focus?
	 *
	 * @type {boolean}
	 */
	protected _isFocused: boolean = false;

	/**
	 * A timestamp of the last hit.
	 *
	 * Used to calculate double-hit.
	 *
	 * @ignore Exclude from docs
	 * @type {Optional<number>}
	 */
	public lastHit: $type.Optional<number>;

	/**
	 * A pointer element that was used for the last hit.
	 *
	 * We need to keep this since only the same pointer can generate doublehit.
	 *
	 * @ignore Exclude from docs
	 * @todo still needed?
	 * @type {Optional<IPointer>}
	 */
	public lastHitPointer: $type.Optional<IPointer>;

	/**
	 * Indicates whether object has delayed events initiated by touch.
	 *
	 * @ignore Exclude from docs
	 * @type {boolean}
	 */
	public hasDelayedOut?: boolean;

	/**
	 * Options used for inertia functionality.
	 *
	 * @type {Dictionary<InertiaTypes, IInertiaOptions>}
	 */
	public inertiaOptions: Dictionary<InertiaTypes, IInertiaOptions> = new Dictionary<InertiaTypes, IInertiaOptions>();

	/**
	 * A collection of different inertia types, currently playing out.
	 *
	 * @ignore Exclude from docs
	 * @type {Dictionary<InertiaTypes, Inertia>}
	 */
	public inertias: Dictionary<InertiaTypes, Inertia> = new Dictionary<InertiaTypes, Inertia>();

	/**
	 * Click/tap options.
	 *
	 * @type {IHitOptions}
	 */
	public hitOptions: IHitOptions = {};

	/**
	 * Hover options.
	 *
	 * @type {IHoverOptions}
	 */
	public hoverOptions: IHoverOptions = {};

	/**
	 * Swipe gesture options.
	 *
	 * @type {ISwipeOptions}
	 */
	public swipeOptions: ISwipeOptions = {};

	/**
	 * Keyboard options.
	 *
	 * @type {IKeyboarOptions}
	 */
	public keyboardOptions: IKeyboardOptions = {};

	/**
	 * Cursor options.
	 *
	 * @type {ICursorOptions}
	 */
	public cursorOptions: ICursorOptions = {
		"defaultStyle": [{
			"property": "cursor",
			"value": "default"
		}]
	};

	/**
	 * Constructor
	 */
	constructor(element: HTMLElement | SVGSVGElement) {
		super();
		this._element = element;
		this.className = "InteractionObject";
		this._disposers.push(new DictionaryDisposer(this.inertias));
		this._disposers.push(new DictionaryDisposer(this.eventDisposers));
		this.applyTheme();
	}

	/**
	 * Sets if this element is currently hovered.
	 *
	 * @param {boolean} value Hovered?
	 */
	public set isHover(value: boolean) {
		if (this.isHover != value) {
			this._isHover = value;
			if (value) {
				getInteraction().overObjects.moveValue(this);
			}
			else {
				getInteraction().overObjects.removeValue(this);
			}
		}
	}

	/**
	 * Returns if this element is currently hovered.
	 *
	 * @return {boolean} Hovered?
	 */
	public get isHover(): boolean {
		return this._isHover;
	}

	/**
	 * Sets if this element is currently hovered.
	 *
	 * @param {boolean} value Hovered?
	 */
	public set isHoverByTouch(value: boolean) {
		if (this.isHoverByTouch != value) {
			this._isHoverByTouch = value;
		}
	}

	/**
	 * Returns if this element is currently hovered.
	 *
	 * @return {boolean} Hovered?
	 */
	public get isHoverByTouch(): boolean {
		return this._isHoverByTouch;
	}

	/**
	 * Returns a list of pointers currently over the element.
	 *
	 * @see {@link Pointer}
	 * @return {List<IPointer>} List if pointers currently hovering the element
	 */
	public get overPointers(): List<IPointer> {
		if (!this._overPointers) {
			this._overPointers = new List<IPointer>();
		}
		return this._overPointers;
	}

	/**
	 * Sets if this element has currently any pointers pressing on it.
	 *
	 * @param {boolean} value Has down pointers?
	 */
	public set isDown(value: boolean) {
		if (this.isDown != value) {
			this._isDown = value;
			if (value) {
				getInteraction().downObjects.moveValue(this);
			}
			else {
				getInteraction().downObjects.removeValue(this);
			}
		}
	}

	/**
	 * Returns if this element has currently any pointers pressing on it.
	 *
	 * @return {boolean} Has down pointers?
	 */
	public get isDown(): boolean {
		return this._isDown;
	}

	/**
	 * Returns a list of pointers currently pressing down on this element.
	 *
	 * @see {@link Pointer}
	 * @return {List<IPointer>} List of down pointers
	 */
	public get downPointers(): List<IPointer> {
		if (!this._downPointers) {
			this._downPointers = new List<IPointer>();
		}
		return this._downPointers;
	}

	/**
	 * Sets if this element is currently focused.
	 *
	 * @param {boolean} value Focused?
	 */
	public set isFocused(value: boolean) {
		if (this.isFocused != value) {
			this._isFocused = value;
			if (value) {
				getInteraction().focusedObject = this;
			}
			else {
				getInteraction().focusedObject = undefined;
			}
		}
	}

	/**
	 * Returns if this element is currently focused.
	 *
	 * @return {boolean} Focused?
	 */
	public get isFocused(): boolean {
		return this._isFocused;
	}

	/**
	 * Is element clickable? Clickable elements will generate "hit" events when
	 * clicked or tapped.
	 *
	 * @param {boolean} value Clickable?
	 */
	public set clickable(value: boolean) {
		if (this._clickable !== value) {
			this._clickable = value;
			getInteraction().processClickable(this);
		}
	}

	/**
	 * Returns if element is currently set as clickable.
	 *
	 * @return {boolean} Clickable?
	 */
	public get clickable(): boolean {
		return this._clickable;
	}

	/**
	 * Sets if element should generate hover events.
	 *
	 * @param {boolean} value Hoverable?
	 */
	public set hoverable(value: boolean) {
		if (this._hoverable !== value) {
			this._hoverable = value;
			getInteraction().processHoverable(this);
		}
	}

	/**
	 * Returns if element is currently set to generate hover events.
	 *
	 * @return {boolean} Hoverable?
	 */
	public get hoverable(): boolean {
		return this._hoverable;
	}

	/**
	 * Sets if pointer movement over element should be tracked.
	 *
	 * @param {boolean} value Track pointer?
	 */
	public set trackable(value: boolean) {
		if (this._trackable !== value) {
			this._trackable = value;
			getInteraction().processTrackable(this);
		}
	}

	/**
	 * Returns if element is set to track pointer movement over it.
	 *
	 * @return {boolean} Track pointer?
	 */
	public get trackable(): boolean {
		return this._trackable;
	}

	/**
	 * Sets if element can be dragged. (moved)
	 *
	 * @param {boolean} value Draggable?
	 */
	public set draggable(value: boolean) {
		if (this._draggable !== value) {
			this._draggable = value;
			getInteraction().processDraggable(this);
		}
	}

	/**
	 * Returns if element is currently set as draggable.
	 *
	 * @return {boolean} Draggable?
	 */
	public get draggable(): boolean {
		return this._draggable;
	}

	/**
	 * Sets whether element should react to swipe gesture.
	 *
	 * @param {boolean} value Track swipe?
	 */
	public set swipeable(value: boolean) {
		if (this._swipeable !== value) {
			this._swipeable = value;
			getInteraction().processSwipeable(this);
		}
	}

	/**
	 * Returns if element is currently set to track swipe gesture.
	 *
	 * @return {boolean} Track swipe?
	 */
	public get swipeable(): boolean {
		return this._swipeable;
	}

	/**
	 * Sets if element can be resized.
	 *
	 * @param {boolean} value Resizeable?
	 */
	public set resizable(value: boolean) {
		if (this._resizable !== value) {
			this._resizable = value;
			getInteraction().processResizable(this);
		}
	}

	/**
	 * Returns if element is currently set as resizeable.
	 *
	 * @return {boolean} Resizeble?
	 */
	public get resizable(): boolean {
		return this._resizable;
	}

	/**
	 * Indicates whether track moouse wheel rotation over element.
	 *
	 * @param {boolean} value Track wheel?
	 */
	public set wheelable(value: boolean) {
		if (this._wheelable !== value) {
			this._wheelable = value;
			getInteraction().processWheelable(this);
		}
	}

	/**
	 * @return {boolean} Track wheel?
	 */
	public get wheelable(): boolean {
		return this._wheelable;
	}

	/**
	 * Sets if element is inert, i.e. if it should carry movement momentum after
	 * it is dragged and released.
	 *
	 * @param {boolean} value Inert?
	 */
	public set inert(value: boolean) {
		if (this._inert !== value) {
			this._inert = value;
		}
	}

	/**
	 * Returns if element is currently set as inert.
	 *
	 * @return {boolean} Inert?
	 */
	public get inert(): boolean {
		return this._inert;
	}

	/**
	 * Sets if element can gain focus.
	 *
	 * @param {Optional<boolean>} value Focusable?
	 */
	public set focusable(value: $type.Optional<boolean>) {
		if (this._focusable !== value) {
			this._focusable = value;
			if (this._focusable && this.tabindex == -1) {
				this._tabindex = 1;
			}
			getInteraction().processFocusable(this);
		}
	}

	/**
	 * Returns if element is currently set as focusable.
	 *
	 * @return {Optional<boolean>} Focusable?
	 */
	public get focusable(): $type.Optional<boolean> {
		return this._focusable;
	}

	/**
	 * Sets element's tab index.
	 *
	 * @param {number} value Tab index
	 */
	public set tabindex(value: number) {
		if (this._tabindex !== value) {
			this._tabindex = value;
			if (value > -1) {
				this.focusable = true;
			}
			getInteraction().processFocusable(this);
		}
	}

	/**
	 * Returns element's current tab index.
	 *
	 * @return {number} Tab index
	 */
	public get tabindex(): number {
		return $type.getValueDefault(this._tabindex, -1 as number);
	}

	/**
	 * Sets DOM element associated with this element
	 * @param {HTMLElement | SVGSVGElement} element Element
	 */
	public set element(element: HTMLElement | SVGSVGElement) {
		this._element = element;
	}

	/**
	 * Returns DOM element associated with this element
	 * @return {HTMLElement | SVGSVGElement} Element
	 */
	public get element(): HTMLElement | SVGSVGElement {
		return this._element;
	}

	/**
	 * Sets element's original position.
	 *
	 * @ignore Exclude from docs
	 * @param {Optional<IPoint>} value Position
	 */
	public set originalPosition(value: Optional<IPoint>) {
		this._originalPosition = value;
	}

	/**
	 * Returns element's original position.
	 *
	 * @ignore Exclude from docs
	 * @return {Optional<IPoint>} Position.
	 */
	public get originalPosition(): Optional<IPoint> {
		return this._originalPosition || { x: 0, y: 0 };
	}

	/**
	 * Sets element's original scale.
	 *
	 * @ignore Exclude from docs
	 * @param {number} value Scale
	 */
	public set originalScale(value: number) {
		if (this._originalScale !== value) {
			this._originalScale = value;
		}
	}

	/**
	 * Returns element's original scale.
	 *
	 * @return {number} Scale
	 */
	public get originalScale(): number {
		return $type.getValueDefault(this._originalScale, 1 as number);
	}

	/**
	 * Sets element's original angle.
	 *
	 * @ignore Exclude from docs
	 * @param {number} value Angle
	 */
	public set originalAngle(value: number) {
		if (this._originalAngle !== value) {
			this._originalAngle = value;
		}
	}

	/**
	 * Returns element's original angle.
	 *
	 * @return {number} Angle
	 */
	public get originalAngle(): number {
		return $type.getValueDefault(this._originalAngle, 0 as number);
	}

	/**
	 * Copies all properties and related assets from another object of the same
	 * type.
	 *
	 * @param {this} source Source object
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.inertiaOptions = source.inertiaOptions;
		this.hitOptions = source.hitOptions;
		this.hoverOptions = source.hoverOptions;
		this.swipeOptions = source.swipeOptions;
		this.keyboardOptions = source.keyboardOptions;
		this.cursorOptions = source.cursorOptions;
		getInteraction().applyCursorOverStyle(this);
	}

	/**
	 * @ignore Exclude from docs
	 */
	public setEventDisposer(key: string, value: boolean, f: () => IDisposer): void {
		const disposer = this.eventDisposers.getKey(key);

		if (value) {
			if (disposer == null) {
				this.eventDisposers.setKey(key, f());
			}

		} else {
			if (disposer != null) {
				disposer.dispose();
				this.eventDisposers.removeKey(key);
			}
		}
	}

	/**
	 * Disposes object.
	 */
	public dispose(): void {
		super.dispose();

		// Remove from all interaction registries
		const interaction = getInteraction();
		interaction.overObjects.removeValue(this);
		interaction.downObjects.removeValue(this);
		interaction.trackedObjects.removeValue(this);
		interaction.transformedObjects.removeValue(this);

		if (interaction.focusedObject === this) {
			interaction.focusedObject = undefined;
		}
	}
}
