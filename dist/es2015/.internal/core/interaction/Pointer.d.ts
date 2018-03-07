/**
 * The functionality related to interaction pointers such as mouse cursor and
 * point of touch on touch-enabled devices
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IPoint } from "../defs/IPoint";
import { AMEvent } from "../utils/EventDispatcher";
import { InteractionObject, IInteractionObjectEvents } from "./InteractionObject";
/**
 * Represents pointer, i.e. mouse cursor or touch point.
 */
export interface IPointer {
    /**
     * An ID of the pointer.
     *
     * Mouse is always "0".
     *
     * @type {string}
     */
    id: string;
    /**
     * Is that a touch pointer?
     *
     * @type {boolean}
     */
    touch: boolean;
    /**
     * A [[IPoint]] to where pointer position was when it was created.
     *
     * @type {IPoint}
     */
    startPoint: IPoint;
    /**
     * A timestamp of when the pointer was created.
     *
     * @type {Number}
     */
    startTime: number;
    /**
     * Current position of the pointer.
     *
     * @type {IPoint}
     */
    point: IPoint;
    /**
     * Holds information about trail of the pointer movement.
     *
     * It's an array of [[IBreadcrumb]] items, indicating where pointer has been
     * at any particular time in its movement.
     *
     * @type {IBreadcrumb[]}
     */
    track: IBreadcrumb[];
    /**
     * Holds a timeout identifier for HIT event.
     *
     * This is used to delay HIT event so that we can catch DOUBLEHIT. (if
     * enabled)
     *
     * @type {number}
     */
    hitTimeout?: number;
    /**
     * Holds a timeout indentifier for HOLD event.
     *
     * @type {[type]}
     */
    holdTimeout?: number;
    /**
     * Holds a reference to a swipe timeout.
     *
     * @type {number}
     */
    swipeTimeout?: number;
    /**
     * Holds indicator if swipe gesture was canceled.
     *
     * @type {boolean}
     */
    swipeCanceled?: boolean;
    /**
     * A reference to the last encountered event object.
     *
     * @type {MouseEvent | Touch}
     */
    lastEvent?: MouseEvent | Touch;
    /**
     * A reference to last "down" event in case we need to access it for some
     * other operation, such as initiating drag on a different object.
     *
     * @type {MouseEvent | TouchEvent}
     */
    lastDownEvent?: MouseEvent | TouchEvent;
    /**
     * A reference to last "up" event in case we need to access it for some
     * other operation, such as initiating drag on a different object.
     *
     * @type {MouseEvent | TouchEvent}
     */
    lastUpEvent?: MouseEvent | TouchEvent;
    /**
     * A reference to last "out" event in case we had to delay its execution
     * until mouseup.
     *
     * @type {MouseEvent | TouchEvent}
     * @deprecated Moved to `InteractionObject`
     */
    lastOutEvent?: MouseEvent | TouchEvent;
    /**
     * For mousedown events, we need to know which mouse button was clicked:
     * 1 - left button
     * 2 - middle button
     * 3 - right button
     *
     * @type {number}
     */
    button?: number;
    /**
     * A reference to "dragstart" event if it's necessary. Normally we don't
     * execute this event on draggable sprites immediately on DOWN event. We wait
     * until it is actually moved to do it.
     *
     * @type {InteractionEvent}
     */
    dragStartEvents?: Array<AMEvent<InteractionObject, IInteractionObjectEvents>["dragstart"]>;
}
/**
 * Represents coordinates at specific point in time.
 */
export interface IBreadcrumb {
    /**
     * Timestamp in milliseconds of the trail breadcrumb.
     *
     * @type {number}
     */
    timestamp: number;
    /**
     * Holds the coordinates for the breadcrumb.
     *
     * @type {IPoint}
     */
    point: IPoint;
}
