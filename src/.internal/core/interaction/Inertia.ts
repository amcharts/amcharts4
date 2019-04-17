/**
 * Functionality related to inertia
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../Base";
import { getInteraction } from "./Interaction";
import { InteractionObject, IInteractionObjectEvents } from "./InteractionObject";
import { Animation, IAnimatable, AnimationDisposer } from "../utils/Animation";
import { AMEvent } from "../utils/EventDispatcher";
import { IPoint } from "../defs/IPoint";
import * as $type from "../utils/Type";

/**
 * Defines a list of available inertia types.
 */
export type InertiaTypes = "move" | "resize";

/**
 * A point of inertia is to simulate gradually drecreasing motion even after
 * actual interaction by user, that caused it, has already ended.
 *
 * [[Inertia]] object will continue triggering the same [[Sprite]] handlers
 * as if the interaction was still happening, gradually reducing
 * shift/angle/scale values until full stop.
 *
 * Basically, from the target element's point of view, while inertia is
 * playing, it is still being interacted with by user, albeit with a
 * decreasing speed.
 */
export class Inertia extends BaseObject implements IAnimatable {

	/**
	 * Holds what type of inertia it is.
	 */
	public type: InertiaTypes;

	/**
	 * An element we're performing animation on.
	 */
	public interaction: InteractionObject;

	/**
	 * Starting pointer position. The position of pointer when we "released"
	 * the element.
	 */
	public startPoint: IPoint;

	/**
	 * Current (simulated) pointer position.
	 */
	public point: IPoint;

	/**
	 * List of animations currently playing.
	 */
	public animations: Array<Animation> = [];

	/**
	 * Constructor
	 */
	constructor(interaction: InteractionObject, type: InertiaTypes, point: IPoint, startPoint: IPoint) {

		// Init
		super();
		this.className = "Inertia";

		this.interaction = interaction;
		this.type = type;
		this.point = point;
		this.startPoint = startPoint;

		// Make animations disposable
		this._disposers.push(new AnimationDisposer(this.animations));

	}

	/**
	 * Sets current X coordinate.
	 *
	 * Will trigger "drag" event for the target element.
	 *
	 * @param value X
	 */
	public set x(value: number) {
		if ($type.isNumber(value)) {
			this.point.x = value;
			this.handleMove();
		}
	}

	/**
	 * Returns current X coordinate.
	 *
	 * @return X
	 */
	public get x(): number {
		return this.point.x;
	}

	/**
	 * Sets current Y coordinate.
	 *
	 * Will trigger "drag" event for the target element.
	 *
	 * @param value Y
	 */
	public set y(value: number) {
		if ($type.isNumber(value)) {
			this.point.y = value;
			this.handleMove();
		}
	}

	/**
	 * Returns current Y coordinate.
	 *
	 * @return Y
	 */
	public get y(): number {
		return this.point.y;
	}

	/**
	 * Simulates dragging of element.
	 */
	public handleMove() {

		// Prepare {InteractionEvent} object
		if (this.interaction.events.isEnabled("drag")) {
			let imev: AMEvent<InteractionObject, IInteractionObjectEvents>["drag"] = {
				type: "drag",
				target: this.interaction,
				shift: {
					x: this.x - this.startPoint.x,
					y: this.y - this.startPoint.y
				},
				startPoint: this.startPoint,
				point: {
					x: this.x,
					y: this.y
				},
				touch: false
			};

			// Call handler
			this.interaction.events.dispatchImmediately("drag", imev);
		}

	}

	/**
	 * Finishes up the inertia animation. (removes reference to this animation
	 * object)
	 */
	public done() {

		// Remove inertia animation from the object
		this.interaction.inertias.removeKey(this.type);

		// Move ended
		if (this.type === "move") {
			getInteraction().processDragStop(this.interaction);
		}

		// Destroy
		this.dispose();

	}

}
