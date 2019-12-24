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
import { Sprite } from "../Sprite";
import { List } from "../utils/List";
import { Dictionary, DictionaryDisposer } from "../utils/Dictionary";
import { AMEvent } from "../utils/EventDispatcher";
import { IPoint } from "../defs/IPoint";
import { IPointer } from "./Pointer";
import { IInertiaOptions, ISwipeOptions, IHitOptions, IHoverOptions, ICursorOptions, IKeyboardOptions, IMouseOptions } from "./InteractionOptions";
import { getInteraction } from "./Interaction";
import { Inertia, InertiaTypes } from "./Inertia";
import { IDisposer } from "../utils/Disposer";
import { Optional } from "../utils/Type";
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
	 */
	public _events!: IInteractionObjectEvents;

	/**
	 * @ignore
	 * An [[EventDispatcher]] instance which holds events for this object
	 */
	public _eventDispatcher: InteractionObjectEventDispatcher<AMEvent<this, this["_events"]>> = new InteractionObjectEventDispatcher(this);;

	/**
	 * An [[EventDispatcher]] instance which holds events for this object
	 */
	public get events(): InteractionObjectEventDispatcher<AMEvent<this, this["_events"]>> {
		return this._eventDispatcher;
	}

	/**
	 * A related [[Sprite]] if any.
	 */
	public sprite!: Sprite;

	/**
	 * Collection of Disposers for various events. (so that those get disposed
	 * when the whole InteractionObject is disposed)
	 *
	 * @ignore Exclude from docs
	 */
	public eventDisposers: Dictionary<string, IDisposer> = new Dictionary<string, IDisposer>();

	/**
	 * A [[Dictionary]] that holds temporarily replaced original style values for
	 * HTML element, so that they can be restored when the functionality that
	 * replaced them is done.
	 *
	 * @ignore Exclude from docs
	 */
	public replacedStyles: Dictionary<string, string> = new Dictionary<string, string>();

	protected _clickable: boolean = false;
	protected _contextMenuDisabled: boolean = false;
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
	 */
	private _element: HTMLElement | SVGSVGElement;

	/**
	 * Original coordinates for the [[InteractionObject]]. (before application
	 * of the drag)
	 */
	public _originalPosition: Optional<IPoint>;

	/**
	 * Original angle for the [[InteractionObject]]. (before rotation started)
	 */
	public _originalAngle: $type.Optional<number>;

	/**
	 * Original scale of the [[InteractionObject]]. (before resizing started)
	 */
	public _originalScale: $type.Optional<number>;

	/**
	 * List of pointers current over element.
	 */
	protected _overPointers: $type.Optional<List<IPointer>>;

	/**
	 * List of pointer currently pressing down on element.
	 */
	protected _downPointers: $type.Optional<List<IPointer>>;

	/**
	 * Is element currently hovered?
	 */
	protected _isHover: boolean = false;

	/**
	 * Is the element hovered by touch pointer?
	 */
	protected _isHoverByTouch: boolean = false;

	/**
	 * Has element got any pointers currently pressing down on it?
	 */
	protected _isDown: boolean = false;

	/**
	 * Does element have focus?
	 */
	protected _isFocused: boolean = false;

	/**
	 * Is element currently protected from touch interactions?
	 */
	protected _isTouchProtected: boolean = false;

	/**
	 * A timestamp of the last hit.
	 *
	 * Used to calculate double-hit.
	 *
	 * @ignore Exclude from docs
	 */
	public lastHit: $type.Optional<number>;

	/**
	 * A pointer element that was used for the last hit.
	 *
	 * We need to keep this since only the same pointer can generate doublehit.
	 *
	 * @ignore Exclude from docs
	 * @todo still needed?
	 */
	public lastHitPointer: $type.Optional<IPointer>;

	/**
	 * Indicates whether object has delayed events initiated by touch.
	 *
	 * @ignore Exclude from docs
	 */
	public hasDelayedOut?: boolean;

	/**
	 * Options used for inertia functionality.
	 */
	private _inertiaOptions: Dictionary<InertiaTypes, IInertiaOptions> = new Dictionary<InertiaTypes, IInertiaOptions>();

	/**
	 * A collection of different inertia types, currently playing out.
	 *
	 * @ignore Exclude from docs
	 */
	public inertias: Dictionary<InertiaTypes, Inertia> = new Dictionary<InertiaTypes, Inertia>();

	/**
	 * Click/tap options.
	 */
	private _hitOptions: IHitOptions = {};

	/**
	 * Hover options.
	 */
	private _hoverOptions: IHoverOptions = {};

	/**
	 * Swipe gesture options.
	 */
	private _swipeOptions: ISwipeOptions = {};

	/**
	 * Keyboard options.
	 */
	private _keyboardOptions: IKeyboardOptions = {};

	/**
	 * Mouse options.
	 */
	private _mouseOptions: IMouseOptions = {};

	/**
	 * Cursor options.
	 */
	private _cursorOptions: ICursorOptions = {
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
		
		this._disposers.push(this._eventDispatcher);

		this._element = element;
		this.className = "InteractionObject";
		this._disposers.push(new DictionaryDisposer(this.inertias));
		this._disposers.push(new DictionaryDisposer(this.eventDisposers));
		this.applyTheme();
	}

	/**
	 * Indicates if this element is currently hovered.
	 *
	 * @param value Hovered?
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
	 * @return Hovered?
	 */
	public get isHover(): boolean {
		return this._isHover;
	}

	/**
	 * Indicates if this element is currently hovered.
	 *
	 * @param value Hovered?
	 */
	public set isHoverByTouch(value: boolean) {
		if (this.isHoverByTouch != value) {
			this._isHoverByTouch = value;
		}
	}

	/**
	 * @return Hovered?
	 */
	public get isHoverByTouch(): boolean {
		return this._isHoverByTouch;
	}

	/**
	 * A list of pointers currently over the element.
	 *
	 * @see {@link Pointer}
	 * @return List if pointers currently hovering the element
	 */
	public get overPointers(): List<IPointer> {
		if (!this._overPointers) {
			this._overPointers = new List<IPointer>();
		}
		return this._overPointers;
	}

	/**
	 * Indicates if this element has currently any pointers pressing on it.
	 *
	 * @param value Has down pointers?
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
	 * @return Has down pointers?
	 */
	public get isDown(): boolean {
		return this._isDown;
	}

	/**
	 * A list of pointers currently pressing down on this element.
	 *
	 * @see {@link Pointer}
	 * @return List of down pointers
	 */
	public get downPointers(): List<IPointer> {
		if (!this._downPointers) {
			this._downPointers = new List<IPointer>();
		}
		return this._downPointers;
	}

	/**
	 * Indicates if this element is currently focused.
	 *
	 * @param value Focused?
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
	 * @return Focused?
	 */
	public get isFocused(): boolean {
		return this._isFocused;
	}

	/**
	 * Indicates if this element is currently being protected from touch actions.
	 *
	 * @ignore
	 * @param value Touch protected?
	 */
	public set isTouchProtected(value: boolean) {
		if (this._isTouchProtected != value) {
			this._isTouchProtected = value;
			if (value) {
				getInteraction().unprepElement(this);
			}
			else if (this.draggable || this.swipeable || this.trackable || this.resizable) {
				getInteraction().prepElement(this);
			}
		}
	}

	/**
	 * @ignore
	 * @return Touch protected?
	 */
	public get isTouchProtected(): boolean {
		return this._isTouchProtected;
	}

	/**
	 * Is element clickable? Clickable elements will generate "hit" events when
	 * clicked or tapped.
	 *
	 * @param value Clickable?
	 */
	public set clickable(value: boolean) {
		if (this._clickable !== value) {
			this._clickable = value;
			getInteraction().processClickable(this);
		}
	}

	/**
	 * @return Clickable?
	 */
	public get clickable(): boolean {
		return this._clickable;
	}

	/**
	 * Should element prevent context menu to be displayed, e.g. when
	 * right-clicked?
	 *
	 * @default false
	 * @param value Context menu disabled?
	 */
	public set contextMenuDisabled(value: boolean) {
		if (this._contextMenuDisabled !== value) {
			this._contextMenuDisabled = value;
			getInteraction().processContextMenu(this);
		}
	}

	/**
	 * @return Context menu disabled?
	 */
	public get contextMenuDisabled(): boolean {
		return this._contextMenuDisabled;
	}

	/**
	 * Indicates if element should generate hover events.
	 *
	 * @param value Hoverable?
	 */
	public set hoverable(value: boolean) {
		if (this._hoverable !== value) {
			this._hoverable = value;
			getInteraction().processHoverable(this);
		}
	}

	/**
	 * @return Hoverable?
	 */
	public get hoverable(): boolean {
		return this._hoverable;
	}

	/**
	 * Indicates if pointer movement over element should be tracked.
	 *
	 * @param value Track pointer?
	 */
	public set trackable(value: boolean) {
		if (this._trackable !== value) {
			this._trackable = value;
			getInteraction().processTrackable(this);
		}
	}

	/**
	 * @return Track pointer?
	 */
	public get trackable(): boolean {
		return this._trackable;
	}

	/**
	 * Indicates if element can be dragged. (moved)
	 *
	 * @param value Draggable?
	 */
	public set draggable(value: boolean) {
		if (this._draggable !== value) {
			this._draggable = value;
			getInteraction().processDraggable(this);
		}
	}

	/**
	 * @return Draggable?
	 */
	public get draggable(): boolean {
		return this._draggable;
	}

	/**
	 * Indicates whether element should react to swipe gesture.
	 *
	 * @param value Track swipe?
	 */
	public set swipeable(value: boolean) {
		if (this._swipeable !== value) {
			this._swipeable = value;
			getInteraction().processSwipeable(this);
		}
	}

	/**
	 * @return Track swipe?
	 */
	public get swipeable(): boolean {
		return this._swipeable;
	}

	/**
	 * Indicates if element can be resized.
	 *
	 * @param value Resizeable?
	 */
	public set resizable(value: boolean) {
		if (this._resizable !== value) {
			this._resizable = value;
			getInteraction().processResizable(this);
		}
	}

	/**
	 * @return Resizeble?
	 */
	public get resizable(): boolean {
		return this._resizable;
	}

	/**
	 * Indicates whether track moouse wheel rotation over element.
	 *
	 * @param value Track wheel?
	 */
	public set wheelable(value: boolean) {
		if (this._wheelable !== value) {
			this._wheelable = value;
			getInteraction().processWheelable(this);
		}
	}

	/**
	 * @return Track wheel?
	 */
	public get wheelable(): boolean {
		return this._wheelable;
	}

	/**
	 * Indicates if element is inert, i.e. if it should carry movement momentum
	 * after it is dragged and released.
	 *
	 * @param value Inert?
	 */
	public set inert(value: boolean) {
		if (this._inert !== value) {
			this._inert = value;
		}
	}

	/**
	 * @return Inert?
	 */
	public get inert(): boolean {
		return this._inert;
	}

	/**
	 * Indicates if element can gain focus.
	 *
	 * @param value Focusable?
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
	 * @return Focusable?
	 */
	public get focusable(): $type.Optional<boolean> {
		return this._focusable;
	}

	/**
	 * Element's tab index.
	 *
	 * @param value Tab index
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
	 * @return Tab index
	 */
	public get tabindex(): number {
		return $type.getValueDefault(this._tabindex, -1 as number);
	}

	/**
	 * A DOM element associated with this element.
	 *
	 * @param element Element
	 */
	public set element(element: HTMLElement | SVGSVGElement) {
		this._element = element;
	}

	/**
	 * @return Element
	 */
	public get element(): HTMLElement | SVGSVGElement {
		return this._element;
	}

	/**
	 * Element's original position.
	 *
	 * @ignore Exclude from docs
	 * @param value Position
	 */
	public set originalPosition(value: Optional<IPoint>) {
		this._originalPosition = value;
	}

	/**
	 * @ignore Exclude from docs
	 * @return Position.
	 */
	public get originalPosition(): Optional<IPoint> {
		return this._originalPosition || { x: 0, y: 0 };
	}

	/**
	 * Element's original scale.
	 *
	 * @ignore Exclude from docs
	 * @param value Scale
	 */
	public set originalScale(value: number) {
		if (this._originalScale !== value) {
			this._originalScale = value;
		}
	}

	/**
	 * @return Scale
	 */
	public get originalScale(): number {
		return $type.getValueDefault(this._originalScale, 1 as number);
	}

	/**
	 * Element's original angle.
	 *
	 * @ignore Exclude from docs
	 * @param value Angle
	 */
	public set originalAngle(value: number) {
		if (this._originalAngle !== value) {
			this._originalAngle = value;
		}
	}

	/**
	 * @return Angle
	 */
	public get originalAngle(): number {
		return $type.getValueDefault(this._originalAngle, 0 as number);
	}

	/**
	 * Inertia options.
	 *
	 * @param value  Options
	 */
	public set inertiaOptions(value: Dictionary<InertiaTypes, IInertiaOptions>) {
		this._inertiaOptions = value;
	}

	/**
	 * @return Options
	 */
	public get inertiaOptions(): Dictionary<InertiaTypes, IInertiaOptions> {
		if (this.sprite && this.sprite._adapterO) {
			return this.sprite._adapterO.apply("inertiaOptions", this._inertiaOptions);
		}
		else {
			return this._inertiaOptions;
		}
	}

	/**
	 * Hit options.
	 *
	 * @param value  Options
	 */
	public set hitOptions(value: IHitOptions) {
		this._hitOptions = value;
	}

	/**
	 * @return Options
	 */
	public get hitOptions(): IHitOptions {
		if (this.sprite && this.sprite._adapterO) {
			return this.sprite._adapterO.apply("hitOptions", this._hitOptions);
		}
		else {
			return this._hitOptions;
		}
	}

	/**
	 * Hover options.
	 *
	 * @param value  Options
	 */
	public set hoverOptions(value: IHoverOptions) {
		this._hoverOptions = value;
	}

	/**
	 * @return Options
	 */
	public get hoverOptions(): IHoverOptions {
		if (this.sprite && this.sprite._adapterO) {
			return this.sprite._adapterO.apply("hoverOptions", this._hoverOptions);
		}
		else {
			return this._hoverOptions;
		}
	}

	/**
	 * Swipe options.
	 *
	 * @param value  Options
	 */
	public set swipeOptions(value: ISwipeOptions) {
		this._swipeOptions = value;
	}

	/**
	 * @return Options
	 */
	public get swipeOptions(): ISwipeOptions {
		if (this.sprite && this.sprite._adapterO) {
			return this.sprite._adapterO.apply("swipeOptions", this._swipeOptions);
		}
		else {
			return this._swipeOptions;
		}
	}

	/**
	 * Keyboard options.
	 *
	 * @param value  Options
	 */
	public set keyboardOptions(value: IKeyboardOptions) {
		this._keyboardOptions = value;
	}

	/**
	 * @return Options
	 */
	public get keyboardOptions(): IKeyboardOptions {
		if (this.sprite && this.sprite._adapterO) {
			return this.sprite._adapterO.apply("keyboardOptions", this._keyboardOptions);
		}
		else {
			return this._keyboardOptions;
		}
	}

	/**
	 * Mouse options.
	 *
	 * Enables controlling options related to the mouse, for example sensitivity
	 * of its mouse wheel.
	 *
	 * E.g. the below will reduce chart's wheel-zoom speed to half its default
	 * speed:
	 *
	 * ```TypeScript
	 * chart.plotContainer.mouseOptions.sensitivity = 0.5;
	 * ```
	 * ```JavaScript
	 * chart.plotContainer.mouseOptions.sensitivity = 0.5;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "plotContainer": {
	 *     "mouseOptions": {
	 *       "sensitivity": 0.5
	 *     }
	 *   }
	 * }
	 * ```
	 *
	 * @since 4.5.14
	 * @param value  Options
	 */
	public set mouseOptions(value: IMouseOptions) {
		this._mouseOptions = value;
	}

	/**
	 * @return Options
	 */
	public get mouseOptions(): IMouseOptions {
		if (this.sprite && this.sprite._adapterO) {
			return this.sprite._adapterO.apply("mouseOptions", this._mouseOptions);
		}
		else {
			return this._mouseOptions;
		}
	}

	/**
	 * Cursor options.
	 *
	 * @param value  Options
	 */
	public set cursorOptions(value: ICursorOptions) {
		this._cursorOptions = value;
	}

	/**
	 * @return Options
	 */
	public get cursorOptions(): ICursorOptions {
		if (this.sprite && this.sprite._adapterO) {
			return this.sprite._adapterO.apply("cursorOptions", this._cursorOptions);
		}
		else {
			return this._cursorOptions;
		}
	}

	/**
	 * Copies all properties and related assets from another object of the same
	 * type.
	 *
	 * @param source Source object
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.inertiaOptions = source.inertiaOptions;
		this.hitOptions = source.hitOptions;
		this.hoverOptions = source.hoverOptions;
		this.swipeOptions = source.swipeOptions;
		this.keyboardOptions = source.keyboardOptions;
		this.cursorOptions = source.cursorOptions;
		this.contextMenuDisabled = source.contextMenuDisabled;
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

		// Unlock document wheel
		if (this.isHover && this.wheelable) {
			interaction.unlockWheel();
		}

		if (interaction.focusedObject === this) {
			interaction.focusedObject = undefined;
		}
	}
}
