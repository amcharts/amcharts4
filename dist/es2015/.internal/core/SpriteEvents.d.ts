/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "./Sprite";
import { EventListener, TargetedEventDispatcher, AMEvent } from "./utils/EventDispatcher";
import { IInteractionObjectEvents } from "./interaction/InteractionObject";
import { IPointer } from "./interaction/Pointer";
import { IPoint } from "./defs/IPoint";
/**
 * ============================================================================
 * RE-EXPORTS
 * ============================================================================
 * @hidden
 */
export { AMEvent };
/**
 * An [[EventDispatcher]] for [[Sprite]].
 *
 * @type {TargetedEventDispatcher}
 * @important
 */
export declare class SpriteEventDispatcher<T extends AMEvent<Sprite, ISpriteEvents>> extends TargetedEventDispatcher<Sprite, T> {
    /**
     * [_interactionEvents description]
     *
     * @todo Description
     * @type {Dictionary}
     */
    private _interactionEvents;
    /**
     * [_dispatchSpriteEvent description]
     *
     * @todo Description
     * @type {[type]}
     */
    private _dispatchSpriteEvent<Key>(ev);
    /**
     * [_dispatchSpritePointEvent description]
     *
     * @todo Description
     * @type {[type]}
     */
    private _dispatchSpritePointEvent<Key>(ev);
    /**
     * [_addInteractionObjectEvent description]
     *
     * @todo Description
     * @type {[type]}
     */
    private _addInteractionObjectEvent<C, Key>(type, callback, context);
    /**
     * [_on description]
     *
     * @todo Description
     * @type {[type]}
     */
    protected _on<A, B, Key extends keyof T>(once: boolean, type: Key | null, callback: A, context: B, dispatch: (type: Key, event: T[Key]) => void): EventListener<T>;
}
/**
 * Defines property set for a [[Sprite]] event that contains point information.
 *
 * @type {Object}
 */
export declare type SpritePointEvent = {
    /**
     * Event point in global (document) coordinates.
     *
     * @type {IPoint}
     */
    point: IPoint;
    /**
     * Event point in local Sprite coordinates.
     *
     * @type {IPoint}
     */
    spritePoint: IPoint;
    /**
     * Event point with chart (svg) coodinates.
     *
     * @type {IPoint}
     */
    svgPoint: IPoint;
};
/**
 * Defines a type of event that has a related Pointer.
 */
export declare type SpritePointerEvent = {
    /**
     * Coordinates of the primary cursor position.
     *
     * @type {Pointer}
     */
    pointer: IPointer;
};
/**
 * Defines property set for a [[Sprite]] event that contains mouse or touch
 * event.
 *
 * @type {Object}
 */
export declare type SpriteMouseTouchEvent = {
    /**
     * Original mouse/touch event.
     *
     * @type {MouseEvent | TouchEvent}
     */
    event: MouseEvent | TouchEvent;
};
/**
 * Defines property set for a [[Sprite]] event that contains coordinate shift
 * information, such as drag events.
 *
 * @type {Object}
 */
export declare type SpriteShiftEvent = {
    /**
     * Shift in coordinates after dragging.
     *
     * @type {IPoint}
     */
    shift: IPoint;
};
/**
 * Defines available events available for [[Sprite]].
 */
export interface ISpriteEvents extends IInteractionObjectEvents {
    /**
     * Invoked when Sprite completes transition to a [[SpriteState]].
     */
    transitionended: {};
    /**
     * Invoked when size of the Sprite changes.
     */
    sizechanged: {};
    /**
     * Invoked when maximum available size of the Sprite changes, i.e. when the
     * size of parent container changes.
     */
    maxsizechanged: {};
    /**
     * @todo Description
     */
    transformed: {
        /**
         * [string description]
         * @type {string}
         * @todo Needs description
         */
        dummyData?: string;
    };
    /**
     * Invoked when position of the [[Sprite]] changes.
     */
    positionchanged: {};
    /**
     * Invoked when [[Sprite]] is initialized.
     */
    inited: {};
    /**
     * Invoked before [[Sprite]] is validated.
     *
     * @todo Description (check)
     */
    beforevalidated: {};
    /**
     * Invoked when [[Sprite]] is validated. (on init or after update)
     *
     * @todo Description (check)
     */
    validated: {};
    /**
     * Invoked when visibility of the [[Sprite]] changes. (from visible to hidden,
     * and vice versa)
     */
    visibilitychanged: {
        visible: boolean;
    };
    /**
     * Invoked when hidden [[Sprite]] is shown.
     */
    shown: {};
    /**
     * Invoked when visible [[Sprite]] is hidden.
     */
    hidden: {};
    /**
     * Invoked when zIndex of a sprite is changed
     */
    zIndexChanged: {};
    /**
     * Invoked when property of the [[Sprite]] changes.
     */
    propertychanged: {
        /**
         * Property key.
         *
         * @type {string}
         */
        property: string;
    };
    /**
     * Invoked when the global scale changed, meaning that scale of [[Sprite]]
     * or any of its ascendants changed.
     */
    globalscalechanged: {};
    /**
     * Invoked when [[Sprite]] is clicked or touched.
     */
    hit: SpritePointEvent & SpriteMouseTouchEvent;
    /**
     * Invoked when [[Sprite]] is clicked or touched twice in rapid succession.
     */
    doublehit: SpritePointEvent & SpriteMouseTouchEvent;
    /**
     * Invoked when pointer (mouse cursor or touch point) moves over `trackable`
     * [[Sprite]].
     */
    track: SpritePointEvent & SpritePointerEvent & SpriteMouseTouchEvent;
    /**
     * Invoked when user turns mouse wheel while over the [[Sprite]].
     */
    wheel: SpritePointEvent & SpriteShiftEvent & {
        /**
         * Original JavaScript event.
         *
         * @type {WheelEvent}
         */
        event: WheelEvent;
    };
    /**
     * Invoked when user turns mouse wheel upwards while over the [[Sprite]].
     */
    wheelup: SpritePointEvent & SpriteShiftEvent & {
        /**
         * Original JavaScript event
         * @type {WheelEvent}
         */
        event: WheelEvent;
    };
    /**
     * Invoked when user turns mouse wheel downwards while over the [[Sprite]].
     */
    wheeldown: SpritePointEvent & SpriteShiftEvent & {
        /**
         * Original JavaScript event.
         *
         * @type {WheelEvent}
         */
        event: WheelEvent;
    };
    /**
     * Invoked when user turns mouse wheel leftwards while over the [[Sprite]].
     */
    wheelleft: SpritePointEvent & SpriteShiftEvent & {
        /**
         * Original JavaScript event
         * @type {WheelEvent}
         */
        event: WheelEvent;
    };
    /**
     * Invoked when user turns mouse wheel rightwards while over the [[Sprite]].
     */
    wheelright: SpritePointEvent & SpriteShiftEvent & {
        /**
         * Original JavaScript event.
         *
         * @type {WheelEvent}
         */
        event: WheelEvent;
    };
    /**
     * Invoked when `togglable` Sprite is being toggled on and off. (its
     * `isActive` property is being changed)
     */
    toggled: {};
}
