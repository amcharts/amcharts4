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
import { Dictionary } from "../utils/Dictionary";
import { AMEvent } from "../utils/EventDispatcher";
import { IPoint } from "../defs/IPoint";
import { IPointer } from "./Pointer";
import { IInertiaOptions, ISwipeOptions, IHitOptions, IHoverOptions, ICursorOptions, IKeyboardOptions } from "./InteractionOptions";
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
export declare class InteractionObject extends BaseObjectEvents {
    /**
     * Defines available events.
     *
     * @type {IInteractionObjectEvents}
     * @ignore Exclude from docs
     */
    _events: IInteractionObjectEvents;
    /**
     * An [[EventDispatcher]] instance which holds events for this object
     */
    events: InteractionObjectEventDispatcher<AMEvent<this, this["_events"]>>;
    /**
     * Collection of Disposers for various events. (so that those get disposed
     * when the whole InteractionObject is disposed)
     *
     * @ignore Exclude from docs
     * @type {Dictionary<string, IDisposer>}
     */
    eventDisposers: Dictionary<string, IDisposer>;
    /**
     * A [[Dictionary]] that holds temporarily replaced original style values for
     * HTML element, so that they can be restored when the functionality that
     * replaced them is done.
     *
     * @ignore Exclude from docs
     * @type {Dictionary<string, string>}
     */
    replacedStyles: Dictionary<string, string>;
    protected _clickable: boolean;
    protected _hoverable: boolean;
    protected _trackable: boolean;
    protected _draggable: boolean;
    protected _swipeable: boolean;
    protected _resizable: boolean;
    protected _rotatable: boolean;
    protected _wheelable: boolean;
    protected _inert: boolean;
    protected _focusable: $type.Optional<boolean>;
    protected _tabindex: Optional<number>;
    /**
     * Element to attach events to.
     *
     * @type {HTMLElement}
     */
    private _element;
    /**
     * Original coordinates for the [[InteractionObject]]. (before application
     * of the drag)
     *
     * @ignore Exclude from docs
     * @type {IPoint}
     */
    _originalPosition: Optional<IPoint>;
    /**
     * Original angle for the [[InteractionObject]]. (before rotation started)
     *
     * @ignore Exclude from docs
     * @type {Optional<number>}
     */
    _originalAngle: $type.Optional<number>;
    /**
     * Original scale of the [[InteractionObject]]. (before resizing started)
     * @type {Optional<number>}
     */
    _originalScale: $type.Optional<number>;
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
    protected _isHover: boolean;
    /**
     * Has element got any pointers currently pressing down on it?
     * @type {boolean}
     */
    protected _isDown: boolean;
    /**
     * Does element have focus?
     *
     * @type {boolean}
     */
    protected _isFocused: boolean;
    /**
     * A timestamp of the last hit.
     *
     * Used to calculate double-hit.
     *
     * @ignore Exclude from docs
     * @type {Optional<number>}
     */
    lastHit: $type.Optional<number>;
    /**
     * A pointer element that was used for the last hit.
     *
     * We need to keep this since only the same pointer can generate doublehit.
     *
     * @ignore Exclude from docs
     * @type {Optional<IPointer>}
     */
    lastHitPointer: $type.Optional<IPointer>;
    /**
     * A reference to last "out" event in case we had to delay its execution
     * until mouseup.
     *
     * This is not on [[Pointer]] because one "out" event can happen at the same
     * time on several elements.
     *
     * @type {MouseEvent | TouchEvent}
     */
    lastOutEvent?: MouseEvent | TouchEvent;
    /**
     * Options used for inertia functionality.
     *
     * @type {Dictionary<InertiaTypes, IInertiaOptions>}
     */
    inertiaOptions: Dictionary<InertiaTypes, IInertiaOptions>;
    /**
     * A collection of different inertia types, currently playing out.
     *
     * @ignore Exclude from docs
     * @type {Dictionary<InertiaTypes, Inertia>}
     */
    inertias: Dictionary<InertiaTypes, Inertia>;
    /**
     * Click/tap options.
     *
     * @type {IHitOptions}
     */
    hitOptions: IHitOptions;
    /**
     * Hover options.
     *
     * @type {IHoverOptions}
     */
    hoverOptions: IHoverOptions;
    /**
     * Swipe gesture options.
     *
     * @type {ISwipeOptions}
     */
    swipeOptions: ISwipeOptions;
    /**
     * Keyboard options.
     *
     * @type {IKeyboarOptions}
     */
    keyboardOptions: IKeyboardOptions;
    /**
     * Cursor options.
     *
     * @type {ICursorOptions}
     */
    cursorOptions: ICursorOptions;
    /**
     * Constructor
     */
    constructor(element: HTMLElement | SVGSVGElement);
    /**
     * Returns if this element is currently hovered.
     *
     * @return {boolean} Hovered?
     */
    /**
     * Sets if this element is currently hovered.
     *
     * @param {boolean} value Hovered?
     */
    isHover: boolean;
    /**
     * Returns a list of pointers currently over the element.
     *
     * @see {@link Pointer}
     * @return {List<IPointer>} List if pointers currently hovering the element
     */
    readonly overPointers: List<IPointer>;
    /**
     * Returns if this element has currently any pointers pressing on it.
     *
     * @return {boolean} Has down pointers?
     */
    /**
     * Sets if this element has currently any pointers pressing on it.
     *
     * @param {boolean} value Has down pointers?
     */
    isDown: boolean;
    /**
     * Returns a list of pointers currently pressing down on this element.
     *
     * @see {@link Pointer}
     * @return {List<IPointer>} List of down pointers
     */
    readonly downPointers: List<IPointer>;
    /**
     * Returns if this element is currently focused.
     *
     * @return {boolean} Focused?
     */
    /**
     * Sets if this element is currently focused.
     *
     * @param {boolean} value Focused?
     */
    isFocused: boolean;
    /**
     * Returns if element is currently set as clickable.
     *
     * @return {boolean} Clickable?
     */
    /**
     * Is element clickable? Clickable elements will generate "hit" events when
     * clicked or tapped.
     *
     * @param {boolean} value Clickable?
     */
    clickable: boolean;
    /**
     * Returns if element is currently set to generate hover events.
     *
     * @return {boolean} Hoverable?
     */
    /**
     * Sets if element should generate hover events.
     *
     * @param {boolean} value Hoverable?
     */
    hoverable: boolean;
    /**
     * Returns if element is set to track pointer movement over it.
     *
     * @return {boolean} Track pointer?
     */
    /**
     * Sets if pointer movement over element should be tracked.
     *
     * @param {boolean} value Track pointer?
     */
    trackable: boolean;
    /**
     * Returns if element is currently set as draggable.
     *
     * @return {boolean} Draggable?
     */
    /**
     * Sets if element can be dragged. (moved)
     *
     * @param {boolean} value Draggable?
     */
    draggable: boolean;
    /**
     * Returns if element is currently set to track swipe gesture.
     *
     * @return {boolean} Track swipe?
     */
    /**
     * Sets whether element should react to swipe gesture.
     *
     * @param {boolean} value Track swipe?
     */
    swipeable: boolean;
    /**
     * Returns if element is currently set as resizeable.
     *
     * @return {boolean} Resizeble?
     */
    /**
     * Sets if element can be resized.
     *
     * @param {boolean} value Resizeable?
     */
    resizable: boolean;
    /**
     * Returns if element is currently set as rotatable.
     *
     * @return {boolean} Can rotate?
     */
    /**
     * Sets whether element can be rotated.
     *
     * @param {boolean} value Can rotate?
     */
    rotatable: boolean;
    /**
     * @return {boolean} Track wheel?
     */
    /**
     * Indicates whether track moouse wheel rotation over element.
     *
     * @param {boolean} value Track wheel?
     */
    wheelable: boolean;
    /**
     * Returns if element is currently set as inert.
     *
     * @return {boolean} Inert?
     */
    /**
     * Sets if element is inert, i.e. if it should carry movement momentum after
     * it is dragged and released.
     *
     * @param {boolean} value Inert?
     */
    inert: boolean;
    /**
     * Returns if element is currently set as focusable.
     *
     * @return {Optional<boolean>} Focusable?
     */
    /**
     * Sets if element can gain focus.
     *
     * @param {Optional<boolean>} value Focusable?
     */
    focusable: $type.Optional<boolean>;
    /**
     * Returns element's current tab index.
     *
     * @return {number} Tab index
     */
    /**
     * Sets element's tab index.
     *
     * @param {number} value Tab index
     */
    tabindex: number;
    /**
     * Returns DOM element associated with this element
     * @return {HTMLElement | SVGSVGElement} Element
     */
    /**
     * Sets DOM element associated with this element
     * @param {HTMLElement | SVGSVGElement} element Element
     */
    element: HTMLElement | SVGSVGElement;
    /**
     * Returns element's original position.
     *
     * @ignore Exclude from docs
     * @return {Optional<IPoint>} Position.
     */
    /**
     * Sets element's original position.
     *
     * @ignore Exclude from docs
     * @param {Optional<IPoint>} value Position
     */
    originalPosition: Optional<IPoint>;
    /**
     * Returns element's original scale.
     *
     * @return {number} Scale
     */
    /**
     * Sets element's original scale.
     *
     * @ignore Exclude from docs
     * @param {number} value Scale
     */
    originalScale: number;
    /**
     * Returns element's original angle.
     *
     * @return {number} Angle
     */
    /**
     * Sets element's original angle.
     *
     * @ignore Exclude from docs
     * @param {number} value Angle
     */
    originalAngle: number;
    /**
     * Copies all properties and related assets from another object of the same
     * type.
     *
     * @param {this} source Source object
     */
    copyFrom(source: this): void;
    /**
     * @ignore Exclude from docs
     */
    setEventDisposer(key: string, value: boolean, f: () => IDisposer): void;
    /**
     * Disposes object.
     */
    dispose(): void;
}
