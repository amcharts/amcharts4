/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "./Sprite";
import { Dictionary } from "./utils/Dictionary";
import { EventListener, TargetedEventDispatcher, AMEvent } from "./utils/EventDispatcher";
import { InteractionObject, IInteractionObjectEvents } from "./interaction/InteractionObject";
import { IPointer } from "./interaction/Pointer";
import { MultiDisposer, IDisposer, CounterDisposer } from "./utils/Disposer";
import { IPoint } from "./defs/IPoint";
import * as $utils from "./utils/Utils";
import * as $object from "./utils/Object";

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
export class SpriteEventDispatcher<T extends AMEvent<Sprite, ISpriteEvents>> extends TargetedEventDispatcher<Sprite, T> {

	/**
	 * [_interactionEvents description]
	 *
	 * @todo Description
	 * @type {Dictionary}
	 */
	private _interactionEvents = new Dictionary<keyof IInteractionObjectEvents, CounterDisposer>();

	/**
	 * [_dispatchSpriteEvent description]
	 *
	 * @todo Description
	 * @type {[type]}
	 */
	private _dispatchSpriteEvent<Key extends keyof IInteractionObjectEvents>(ev: AMEvent<InteractionObject, IInteractionObjectEvents>[Key]): void {
		if (this.target.disabled || this.target.isTemplate) {
			return;
		}
		// TODO remove this <any> later
		if (this.target.events.isEnabled(ev.type)) {
			let imev: AMEvent<Sprite, ISpriteEvents>[Key] = <any>$object.merge(ev, {
				target: this.target
			});
			this.target.events.dispatchImmediately(imev.type, imev);
		}
	}

	/**
	 * [_dispatchSpritePointEvent description]
	 *
	 * @todo Description
	 * @type {[type]}
	 */
	private _dispatchSpritePointEvent<Key extends "hit" | "track">(ev: AMEvent<InteractionObject, IInteractionObjectEvents>[Key]): void {
		if (this.target.disabled || this.target.isTemplate) {
			return;
		}
		// TODO remove this <any> later
		if (this.target.events.isEnabled(ev.type)) {

			let imev: AMEvent<Sprite, ISpriteEvents>[Key] = <any>$object.merge(ev, {
				target: this.target,
				spritePoint: $utils.documentPointToSprite(ev.point, this.target),
				svgPoint: this.target.getSvgPoint(ev.point)
			});
			this.target.events.dispatchImmediately(imev.type, imev);
		}
	}

	/**
	 * [_addInteractionObjectEvent description]
	 *
	 * @todo Description
	 * @type {[type]}
	 */
	private _addInteractionObjectEvent<C, Key extends keyof IInteractionObjectEvents>(type: Key, callback: (this: C, ev: AMEvent<InteractionObject, IInteractionObjectEvents>[Key]) => void, context: C, shouldClone: boolean): IDisposer {
		const counter = this._interactionEvents.insertKeyIfEmpty(type, () => {
			const disposer = this.target.interactions.events.on(type, callback, context, shouldClone);

			return new CounterDisposer(() => {
				this._interactionEvents.removeKey(type);
				disposer.dispose();
			});
		});

		return counter.increment();
	}

	/**
	 * [_on description]
	 *
	 * @todo Description
	 * @type {[type]}
	 */
	protected _on<A, B, Key extends keyof T>(once: boolean, type: Key | null, callback: A, context: B, shouldClone: boolean, dispatch: (type: Key, event: T[Key]) => void): EventListener<T> {
		const info = super._on(once, type, callback, context, shouldClone, dispatch);

		const disposers = [info.disposer];

		/**
		 * Catching Sprite-related events, converting them to [[SpriteEvent]] and
		 * triggering them on sprite
		 */
		switch (type) {
			case "hit":
			case "track":
			case "doublehit":
			case "wheel":
			case "wheelup":
			case "wheeldown":
			case "wheelleft":
			case "wheelright":
				disposers.push(this._addInteractionObjectEvent(<any>type, this._dispatchSpritePointEvent, this, shouldClone));
				break;
			case "rightclick":
			case "down":
			//case "hold":
			case "up":
			case "drag":
			case "dragstart":
			case "dragstop":
			case "over":
			case "out":
			case "swipe":
			case "swipeleft":
			case "swiperight":
			case "resize":
			//case "rotate":
			case "focus":
			case "blur":
			case "toggled":
				disposers.push(this._addInteractionObjectEvent(<any>type, this._dispatchSpriteEvent, this, shouldClone));
				break;
		}

		/**
		 * Set functional properties based on events. For example if we add a
		 * "drag" event handler, we want to make the Sprite draggable, even if we
		 * don't explicitly set "draggable"
		 */
		switch (type) {
			case "hit":
			case "doublehit":
			case "rightclick":
			case "down":
			case "up":
				this.target.clickable = true;
				break;
			case "toggled":
				this.target.togglable = true;
				break;
			case "drag":
			case "dragstart":
			case "dragstop":
				this.target.draggable = true;
				break;
			case "track":
				this.target.trackable = true;
				break;
			case "resize":
				this.target.resizable = true;
				break;
			case "swipe":
			case "swipeleft":
			case "swiperight":
				this.target.swipeable = true;
				break;
			case "wheel":
			case "wheelup":
			case "wheeldown":
			case "wheelleft":
			case "wheelright":
				this.target.wheelable = true;
				break;
			case "over":
				this.target.hoverable = true;
			case "out":
				this.target.hoverable = true;
				break;
			case "focus":
			case "blur":
				this.target.focusable = true;
				break;
		}

		info.disposer = new MultiDisposer(disposers);

		return info;
	}
}


/**
 * Defines property set for a [[Sprite]] event that contains point information.
 *
 * @type {Object}
 */
export type SpritePointEvent = {
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
export type SpritePointerEvent = {

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
export type SpriteMouseTouchEvent = {

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
export type SpriteShiftEvent = {

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
	maxsizechanged: {
		previousWidth: number,
		previousHeight: number
	};

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
	 * Invoked when [[Sprite]] is becomes ready, that is it has finished all
	 * calculations and building itself.
	 *
	 * For [[Container]] object (and all those inheriting it, including charts)
	 * this event will fire when all children become ready.
	 */
	ready: {};

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
		event: WheelEvent

	};

	/**
	 * Invoked when user turns mouse wheel upwards while over the [[Sprite]].
	 */
	wheelup: SpritePointEvent & SpriteShiftEvent & {

		/**
		 * Original JavaScript event
		 * @type {WheelEvent}
		 */
		event: WheelEvent

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
		event: WheelEvent

	};

	/**
	 * Invoked when user turns mouse wheel leftwards while over the [[Sprite]].
	 */
	wheelleft: SpritePointEvent & SpriteShiftEvent & {

		/**
		 * Original JavaScript event
		 * @type {WheelEvent}
		 */
		event: WheelEvent

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
		event: WheelEvent

	};

	/**
	 * Invoked when `togglable` Sprite is being toggled on and off. (its
	 * `isActive` property is being changed)
	 */
	toggled: {};

	/**
	 * Invoked just before Sprite is disposed.
	 */
	beforedisposed: {};

}
