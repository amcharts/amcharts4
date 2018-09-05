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
import { IInertiaOptions, ISwipeOptions, IHitOptions, IHoverOptions, IKeyboardOptions } from "./InteractionOptions";
import { InteractionObject, IInteractionObjectEvents } from "./InteractionObject";
import { Dictionary } from "../utils/Dictionary";
import { InertiaTypes } from "./Inertia";
import { IPointer, IBreadcrumb } from "./Pointer";
import { IPoint } from "../defs/IPoint";
import { IStyleProperty } from "../defs/IStyleProperty";
import * as $type from "../utils/Type";
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
        event: MouseEvent | TouchEvent;
    };
    down: {
        pointer: IPointer;
        event: MouseEvent | TouchEvent;
    };
    up: {
        pointer: IPointer;
        event: MouseEvent | TouchEvent;
    };
    focus: {
        event: FocusEvent;
    };
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
    timeout?: number;
}
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
export declare class Interaction extends BaseObjectEvents {
    /**
     * Defines available events.
     *
     * @type {IInteractionEvents}
     * @ignore Exclude from docs
     * @deprecated Use inetraction.body.events instead
     */
    _events: IInteractionEvents;
    /**
     * A reference to an [[Interaction]] object for document's body.
     *
     * Users can use it to add global, non-chart related events, that will be
     * applicable to the whole document.
     *
     * @type {InteractionObject}
     */
    body: InteractionObject;
    /**
     * An indicator of global events were already initialized.
     *
     * @type {boolean}
     */
    protected _globalEventsAdded: boolean;
    /**
     * Holds which mouse event listeners to use.
     *
     * @type {Object}
     */
    protected _pointerEvents: {
        "pointerdown": string;
        "pointerup": string;
        "pointermove": string;
        "wheel": string;
    };
    /**
     * Indicates if Interaction should use only "pointer" type events, like
     * "pointermove", available in all modern browsers, ignoring "legacy"
     * events, like "touchmove".
     *
     * @type {boolean}
     */
    protected _usePointerEventsOnly: boolean;
    /**
     * Indicates if passive mode options is supported by this browser.
     *
     * @type {boolean}
     */
    protected _passiveSupported: boolean;
    /**
     * Holds list of delayed events
     *
     * @type {IDelayedEvent[]}
     */
    protected _delayedEvents: {
        out: IDelayedEvent[];
    };
    /**
     * List of objects that current have a pointer hovered over them.
     *
     * @type {List<InteractionObject>}
     */
    overObjects: List<InteractionObject>;
    /**
     * List of objects that currently has a pressed pointer.
     *
     * @type {List<InteractionObject>}
     */
    downObjects: List<InteractionObject>;
    /**
     * List of objects that need mouse position to be reported to them.
     *
     * @type {List<InteractionObject>}
     */
    trackedObjects: List<InteractionObject>;
    /**
     * List of objects that are currently being dragged.
     *
     * @type {List<InteractionObject>}
     */
    transformedObjects: List<InteractionObject>;
    /**
     * An object that currently has focus. Usually set automatically via
     * [[InteractionObject]] `isFocus` method.
     *
     * @type {Optional<InteractionObject>}
     */
    focusedObject: $type.Optional<InteractionObject>;
    /**
     * Holds all known pointers.
     *
     * @type {Dictionary<string, IPointer>}
     */
    pointers: Dictionary<string, IPointer>;
    /**
     * Inertia options that need to be applied to after element drag, if it's
     * `inert = true`.
     *
     * This is just a default, which can and probably will be overridden by
     * actual elements.
     *
     * @type {Dictionary}
     */
    inertiaOptions: Dictionary<InertiaTypes, IInertiaOptions>;
    /**
     * Default options for click events. These can be overridden in
     * [[InteractionObject]].
     *
     * @type {IHitOptions}
     */
    hitOptions: IHitOptions;
    /**
     * Default options for hover events. These can be overridden in
     * [[InteractionObject]].
     *
     * @type {IHoverOptions}
     */
    hoverOptions: IHoverOptions;
    /**
     * Default options for detecting a swipe gesture. These can be overridden in
     * [[InteractionObject]].
     *
     * @type {ISwipeOptions}
     */
    swipeOptions: ISwipeOptions;
    /**
     * Default options for keyboard operations. These can be overridden in
     * [[InteractionObject]].
     *
     * @type {IKeyboarOptions}
     */
    keyboardOptions: IKeyboardOptions;
    /**
     * Constructor. Sets up universal document-wide move events to handle stuff
     * outside particular chart container.
     */
    constructor();
    protected debug(): void;
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
    addGlobalEvents(): void;
    /**
     * Sets if [[InteractionObject]] is clickable.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject} io [[InteractionObject]] instance
     */
    processClickable(io: InteractionObject): void;
    /**
     * Sets if [[InteractionObject]] is hoverable.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject} io [[InteractionObject]] instance
     */
    processHoverable(io: InteractionObject): void;
    /**
     * Sets up [[InteractionObject]] as movable. Movable can be any
     * transformation, e.g. drag, swipe, resize, track, or rotate.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    processMovable(io: InteractionObject): void;
    /**
     * Checks if [[InteractionObject]] is trackable and sets relative events.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    processTrackable(io: InteractionObject): void;
    /**
     * Checks if [[InteractionObject]] is draggable.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    processDraggable(io: InteractionObject): void;
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
    processSwipeable(io: InteractionObject): void;
    /**
     * Checks if [[InteractionObject]] is resizable and attaches required events
     * to it.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    processResizable(io: InteractionObject): void;
    /**
     * Checks if [[InteractionObject]] is rotatable and attaches required events
     * to it.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    processRotatable(io: InteractionObject): void;
    /**
     * Checks if [[InteractionObject]] is supposed to capture mouse wheel events
     * and prepares it to catch those events.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    processWheelable(io: InteractionObject): void;
    /**
     * Checks if [[InteractionObject]] is focusable. A focusable element is an
     * element that will be highlighted when users presses TAB key. If the
     * element is focusable, this function will attach relative focus/blur
     * events to it.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    processFocusable(io: InteractionObject): void;
    /**
     * Checks if [[InteractionObject]] is "touchable". It means any interaction
     * whatsoever: mouse click, touch screen tap, swipe, drag, resize, etc.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     */
    processTouchable(io: InteractionObject): void;
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
    handleFocus(io: InteractionObject, ev: FocusEvent): void;
    /**
     * Used by regular click events to prevent focus if "noFocus" is set.
     *
     * This should not be called by "focus" handlers.
     *
     * @param {InteractionObject}  io  Element
     * @param {MouseEvent | TouchEvent}         ev  Original event
     */
    private handleFocusBlur(io, ev);
    /**
     * Dispatches "blur" event when element loses focus.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     * @param {FocusEvent}         ev  Original event
     */
    handleBlur(io: InteractionObject, ev: FocusEvent): void;
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
    handleGlobalKeyDown(ev: KeyboardEvent): void;
    /**
     * Dispatches related events when the keyboard key is realeasd.
     *
     * @ignore Exclude from docs
     * @param {KeyboardEvent} ev An original keyboard event
     */
    handleGlobalKeyUp(ev: KeyboardEvent): void;
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
    handleGlobalPointerMove(ev: MouseEvent): void;
    /**
     * Handler for a global "pointerdown" event.
     *
     * @ignore Exclude from docs
     * @param {MouseEvent} ev Event object
     */
    handleGlobalPointerDown(ev: MouseEvent): void;
    /**
     * Prevents touch action from firing.
     *
     * @ignore Exclude from docs
     * @param {MouseEvent} ev Event
     */
    preventTouchAction(ev: TouchEvent): void;
    /**
     * Handler for a global "pointerup" event.
     *
     * @ignore Exclude from docs
     * @param {MouseEvent} ev Event object
     */
    handleGlobalPointerUp(ev: MouseEvent): void;
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
    handleGlobalTouchMove(ev: TouchEvent): void;
    /**
     * Handler for a global "touchstart" event.
     *
     * @ignore Exclude from docs
     * @param {TouchEvent} ev Event object
     */
    handleGlobalTouchStart(ev: TouchEvent): void;
    /**
     * Handler for a global "touchend" event.
     *
     * @ignore Exclude from docs
     * @param {TouchEvent} ev Event object
     */
    handleGlobalTouchEnd(ev: TouchEvent): void;
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
    handlePointerDown(io: InteractionObject, ev: MouseEvent | PointerEvent): void;
    /**
     * Handles event when [[InteractionObject]] is hovered by a mouse pointer.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     * @param {MouseEvent}         ev  Original event
     */
    handleMouseOver(io: InteractionObject, ev: MouseEvent): void;
    /**
     * Handles event when [[InteractionObject]] loses hover from a mouse pointer.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     * @param {MouseEvent}         ev  Original event
     */
    handleMouseOut(io: InteractionObject, ev: MouseEvent): void;
    /**
     * Handles event when mouse wheel is crolled over the [[InteractionObject]].
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io  Element
     * @param {WheelEvent}         ev  Original event
     * @todo Investigate more-cross browser stuff https://developer.mozilla.org/en-US/docs/Web/Events/wheel
     */
    handleMouseWheel(io: InteractionObject, ev: WheelEvent): void;
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
    handleTouchDown(io: InteractionObject, ev: TouchEvent): void;
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
    handleHit(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent): void;
    /**
     * Handles pointer hovering over [[InteractionObject]].
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Interaction object
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    handleOver(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent): void;
    /**
     * Handles when [[InteractionObject]] is no longer hovered.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Interaction object
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    handleOut(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent, ignoreBehavior?: boolean): void;
    /**
     * Performs tasks on pointer down.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Element
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    handleDown(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent | undefined): void;
    /**
     * Handles pointer move.
     *
     * @ignore Exclude from docs
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    handleMove(pointer: IPointer, ev: MouseEvent | TouchEvent): void;
    /**
     * Handles reporting of pointer movement.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io        Element
     * @param {IPointer}                 pointer    Pointer
     * @param {MouseEvent | TouchEvent}  ev         Original event
     * @param {boolean}                  skipCheck  Sould we skip check if cursor actually moved
     */
    handleTrack(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent, skipCheck?: boolean): void;
    /**
     * Performs tasks on pointer up.
     *
     * @ignore Exclude from docs
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    handleUp(pointer: IPointer, ev: MouseEvent | TouchEvent | undefined): void;
    /**
     * Handles swipe action.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Element
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    handleSwipe(io: InteractionObject, pointer: IPointer, ev: MouseEvent | TouchEvent): void;
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
    handleWheel(io: InteractionObject, pointer: IPointer, deltaX: number, deltaY: number, ev: WheelEvent): void;
    /**
     * Initiates inertia checking sub-routines for different movement types:
     * drag, resize, rotate.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}   sprite
     * @param {IPointer}            pointer
     */
    handleInertia(io: InteractionObject, pointer: IPointer): void;
    /**
     * Continues moving the element to simulate the effect of inertia. Happens
     * when `inert` and `draggable` object is dragged and then released.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     */
    handleMoveInertia(io: InteractionObject, pointer: IPointer): void;
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
    handleRotateInertia(io: InteractionObject, pointer: IPointer): void;
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
    handleResizeInertia(io: InteractionObject, pointer: IPointer): void;
    /**
     * Recalculates element's position, size and rotation based on position of
     * all its related pointers.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io  Element
     * @param {MouseEvent | TouchEvent}  ev  Original event
     */
    handleTransform(io: InteractionObject, ev: MouseEvent | TouchEvent): void;
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
    handleTransformMove(io: InteractionObject, point: IPoint, startPoint: IPoint, ev: MouseEvent | TouchEvent | KeyboardEvent, pointerMoved: boolean): void;
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
    handleTransformResize(io: InteractionObject, point1: IPoint, startPoint1: IPoint, point2: IPoint, startPoint2: IPoint, ev: MouseEvent | TouchEvent, pointerMoved: boolean): void;
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
    handleTransformRotate(io: InteractionObject, point1: IPoint, startPoint1: IPoint, point2: IPoint, startPoint2: IPoint, ev: MouseEvent | TouchEvent, pointerMoved: boolean): void;
    /**
     * Handles all the preparations of the element when it starts to be dragged.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Element
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    processDragStart(io: InteractionObject, pointer?: IPointer, ev?: MouseEvent | TouchEvent): void;
    /**
     * Finishes up element drag operation.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}        io       Element
     * @param {IPointer}                 pointer  Pointer
     * @param {MouseEvent | TouchEvent}  ev       Original event
     */
    processDragStop(io: InteractionObject, pointer?: IPointer, ev?: MouseEvent | TouchEvent): void;
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
    dragStart(io: InteractionObject, pointer?: IPointer): void;
    /**
     * Manually ends drag on the element.
     *
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     */
    dragStop(io: InteractionObject, pointer?: IPointer): void;
    /**
     * This method uses a fuzzy logic to find the pointer to be used for dragging.
     * Beware that this is not a rock-solid solution. If there are a few objects
     * being dragged at the same time, you may get unexepected results.
     *
     * @param  {InteractionObject}   io  InteractionObject to get pointers from
     * @return {Optional<IPointer>}      Pointer currently being used for dragging
     */
    getDragPointer(io?: InteractionObject): $type.Optional<IPointer>;
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
    protected getPointerId(ev: any): string;
    /**
     * Returns [[Pointer]] object that is associated with the Event.
     *
     * If no such [[Pointer]] object exists, it is created.
     *
     * @param  {MouseEvent | Touch}  ev  Event
     * @return {IPointer}                Pointer
     */
    protected getPointer(ev: MouseEvent | Touch): IPointer;
    /**
     * Resets the poiner to original state, i.e. cleans movement information,
     * starting point, etc.
     *
     * @param {IPointer} pointer Pointer
     */
    protected resetPointer(pointer: IPointer): void;
    /**
     * Adds a "breadcrumb" point to the [[Pointer]] to log its movement path.
     *
     * @param {IPointer}  pointer  Pointer
     * @param {IPoint}    point    Point coordinates
     */
    protected addBreadCrumb(pointer: IPointer, point: IPoint): void;
    /**
     * Prepares the document for various touch-related operations.
     *
     * @ignore Exclude from docs
     */
    lockDocument(): void;
    /**
     * Restores document functionality.
     *
     * @ignore Exclude from docs
     */
    unlockDocument(): void;
    /**
     * Lock element (disable all touch)
     *
     * @ignore Exclude from docs
     */
    lockElement(io: InteractionObject): void;
    /**
     * Restores element's functionality.
     *
     * @ignore Exclude from docs
     */
    unlockElement(io: InteractionObject): void;
    /**
     * Locks document's wheel scroll.
     *
     * @ignore Exclude from docs
     */
    lockWheel(): void;
    /**
     * Unlocks document's wheel scroll.
     *
     * @ignore Exclude from docs
     */
    unlockWheel(): void;
    /**
     * Checks if top element at pointer's position belongs to the SVG.
     *
     * @ignore Exlude from docs
     * @param  {IPointer}       pointer  Pointer
     * @param  {SVGSVGElement}  svg      The <svg> element
     * @return {boolean}                 Belongs to SVG/
     */
    isLocalElement(pointer: IPointer, svg: SVGSVGElement): boolean;
    /**
     * A function that cancels mouse wheel scroll.
     *
     * @ignore Exclude from docs
     * @param  {MouseEvent}  ev  Event object
     * @return {boolean}         Returns `false` to cancel
     */
    protected wheelLockEvent(ev: MouseEvent): boolean;
    /**
     * Applies a set of styles to an element. Stores the original styles so they
     * can be restored later.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}           io      Element
     * @param {Dictionary<string, string>}  styles  A Dictionary of style property and values
     */
    protected prepElement(io: InteractionObject, permanent?: boolean): void;
    /**
     * Cancels hold counting for the object.
     *
     * @param {InteractionObject} io Element
     */
    protected cancelHold(io: InteractionObject): void;
    /**
     * Cancels swipe.
     *
     * @param {InteractionObject} io Element
     */
    protected cancelSwipe(io: InteractionObject): void;
    /**
     * Returns an option associated with hit events.
     *
     * @ignore Exclude from docs
     * @param  {InteractionObject}  io      Element
     * @param  {string}             option  Option key
     * @return {any}                        Option value
     */
    getHitOption(io: InteractionObject, option: keyof IHitOptions): any;
    /**
     * Returns an option associated with hover events.
     *
     * @ignore Exclude from docs
     * @param  {InteractionObject}  io      Element
     * @param  {string}             option  Option key
     * @return {any}                        Option value
     */
    getHoverOption(io: InteractionObject, option: keyof IHoverOptions): any;
    /**
     * Returns an option associated with swipe events.
     *
     * @ignore Exclude from docs
     * @param  {InteractionObject}  io      Element
     * @param  {string}             option  Option key
     * @return {any}                        Option value
     */
    getSwipeOption(io: InteractionObject, option: keyof ISwipeOptions): any;
    /**
     * Returns an option for keyboard.
     *
     * @ignore Exclude from docs
     * @param  {InteractionObject}  io      Element
     * @param  {string}             option  Option key
     * @return {any}                        Option value
     */
    getKeyboardOption(io: InteractionObject, option: keyof IKeyboardOptions): any;
    /**
     * Returns an option associated with inertia.
     *
     * @ignore Exclude from docs
     * @param  {InteractionObject}  io      Element
     * @param  {InertiaTypes}       type    Inertia type
     * @param  {string}             option  Option key
     * @return {any}                        Option value
     */
    getInertiaOption(io: InteractionObject, type: InertiaTypes, option: keyof IInertiaOptions): any;
    /**
     * Stops currently going on inertia. Useful if inertia is currently being
     * animated and the object is being interacted with.
     *
     * @param {InteractionObject} io Element
     */
    protected stopInertia(io: InteractionObject): void;
    /**
     * Check if swiping is currently being performed on an object.
     *
     * @param  {InteractionObject}  io       Element
     * @param  {IPointer}           pointer  Pointer to check
     * @return {boolean}                     `true` if swiping
     */
    swiping(io: InteractionObject, pointer: IPointer): boolean;
    /**
     * Returns `true` if a successfull swipe action was performed on an element.
     *
     * @param  {InteractionObject}  io       Element
     * @param  {IPointer}           pointer  Pointer
     * @return {boolean}                     Swiped?
     */
    swiped(io: InteractionObject, pointer: IPointer): boolean;
    /**
     * Applies style to mouse cursor based on its stage in relation to
     * [[InteractionObject]].
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}   Element
     */
    applyCursorOverStyle(io: InteractionObject): void;
    /**
     * Applies style to mouse cursor based on its stage in relation to
     * [[InteractionObject]].
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     */
    applyCursorDownStyle(io: InteractionObject, pointer: IPointer): void;
    /**
     * Restores original cursor style for the element.
     *
     * @ignore Exclude from docs
     * @param {InteractionObject}  io       Element
     * @param {IPointer}           pointer  Pointer
     */
    restoreCursorDownStyle(io: InteractionObject, pointer: IPointer): void;
    /**
     * Sets style on the body of the document.
     *
     * @ignore Exclude from docs
     * @param {Array<IStyleProperty> | IStyleProperty}  style  Style definitions
     */
    setGlobalStyle(style: Array<IStyleProperty> | IStyleProperty): void;
    /**
     * Restores style on the body of the document.
     *
     * @ignore Exclude from docs
     * @param {Array<IStyleProperty> | IStyleProperty}  style  Style definitions
     */
    restoreGlobalStyle(style: Array<IStyleProperty> | IStyleProperty): void;
    /**
     * Checks if element is a non-cahrt element.
     *
     * @param  {InteractionObject}  io  InteractionObject
     * @return {boolean}                Global element?
     */
    protected isGlobalElement(io: InteractionObject): boolean;
    /**
     * Checks if pointer has moved since it was created.
     *
     * @param  {IPointer}  pointer    Pointer
     * @param  {number}    tolerance  Tolerance in pixels
     * @return {boolean}              `true` if the pointer has moved
     */
    moved(pointer: IPointer, tolerance: number): boolean;
    /**
     * Returns total a shift in pointers coordinates between its original
     * position and now.
     *
     * @param  {IPointer}  pointer  Pointer
     * @return {IPoint}             Shift in coordinates (x/y)
     */
    getShift(pointer: IPointer): IPoint;
    /**
     * Returns a point from [[Pointer]]'s move history at a certain timetamp.
     *
     * @param  {IPointer}               pointer    Pointer
     * @param  {number}                 timestamp  Timestamp
     * @return {Optional<IBreadcrumb>}             Point
     */
    getTrailPoint(pointer: IPointer, timestamp: number): $type.Optional<IBreadcrumb>;
    /**
     * Checks if same pointer already exists in the list.
     *
     * @param  {List<IPointer>}  list     List to check agains
     * @param  {IPointer}        pointer  Pointer
     * @return {boolean}                  Exists?
     */
    protected pointerExists(list: List<IPointer>, pointer: IPointer): boolean;
    /**
     * Returns an [[InteractionObject]] representation of a DOM element.
     *
     * You can use this on any HTML or SVG element, to add interactive features
     * to it.
     *
     * @param  {HTMLElement | SVGSVGElement}  element  Element
     * @return {InteractionObject}                     InteractionObject
     */
    getInteraction(element: HTMLElement | SVGSVGElement): InteractionObject;
    /**
     * Sets a style property on an element. Stores original value to be restored
     * later with [[restoreStyle]].
     *
     * @see {@link restoreStyle}
     * @param {InteractionObject}  io        Element
     * @param {string}             property  Property
     * @param {string}             value     Value
     */
    setTemporaryStyle(io: InteractionObject, property: string, value: string): void;
    /**
     * Restores specific style on an element.
     *
     * @param {InteractionObject}  io        Element
     * @param {string}             property  Style property
     */
    restoreStyle(io: InteractionObject, property: string): void;
    /**
     * Restore temporarily reset styles on an element.
     *
     * @param {InteractionObject} io Element
     */
    restoreAllStyles(io: InteractionObject): void;
    /**
     * Processes dalyed events, such as "out" event that was initiated for
     * elements by touch.
     */
    private processDelayed();
    /**
     * Disposes this object and cleans up after itself.
     */
    dispose(): void;
}
/**
 * Returns a single unified global instance of [[Interaction]].
 *
 * All code should use this function, rather than create their own instances
 * of [[Interaction]].
 */
export declare function getInteraction(): Interaction;
