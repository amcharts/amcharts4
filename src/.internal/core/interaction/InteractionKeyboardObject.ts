/**
 * Functionality related simulating of dragging of elements using keyboard.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { getInteraction } from "./Interaction";
import { InteractionObject } from "./InteractionObject";
import { IAnimationObject } from "../utils/Animation";
import { system } from "../System";
import { IPoint } from "../defs/IPoint";
import { IDisposer } from "../utils/Disposer";
import * as $array from "../utils/Array";

/**
 * [[InteractionKeyboardObject]] is used to simulate dragging of the `draggable`
 * element using keyboard arrows.
 *
 * @ignore Exclude from docs
 */
export class InteractionKeyboardObject implements IAnimationObject, IDisposer {

	/**
	 * A [[InteractionObject]] representation of an element we're performing
	 * animation on.
	 */
	public interaction: InteractionObject;

	/**
	 * Indicates if this object has already been deleted. Any
	 * destruction/disposal code should take this into account when deciding
	 * wheter to run potentially costly disposal operations if they already have
	 * been run.
	 */
	protected _disposed: boolean = false;

	/**
	 * Timestamp on when animation started.
	 */
	private _startedOn: number;

	/**
	 * Indicates direction of current horizontal movement.
	 *
	 * 0 - not moving horizontally
	 * 1 - moving right
	 * -1 - moving left
	 */
	public directionX: 0 | 1 | -1 = 0;

	/**
	 * Indicates direction of current vertical movement.
	 *
	 * 0 - not moving vertically
	 * 1 - moving down
	 * -1 - moving up
	 */
	public directionY: 0 | 1 | -1 = 0;

	/**
	 * Holds reference to original keyboard event.
	 */
	public keyboardEvent: KeyboardEvent;

	/**
	 * Constructor.
	 *
	 * @param io An InteractionObject
	 */
	constructor(io: InteractionObject, ev: KeyboardEvent) {
		this.interaction = io;
		this.keyboardEvent = ev;
		this._startedOn = new Date().getTime();
		getInteraction().processDragStart(io);
		system.animations.push(this);
		this.update();
	}

	/**
	 * It's an update method which is called by the system if
	 * [[InteractionObject]] is used as animation.
	 *
	 * This will update coordinates of the element based on the movement
	 * directions.
	 */
	public update(): void {

		// Init and get settings
		let io = this.interaction;
		let speed = getInteraction().getKeyboardOption(io, "speed"),
			accelleration = getInteraction().getKeyboardOption(io, "accelleration"),
			accellerationDelay = getInteraction().getKeyboardOption(io, "accellerationDelay"),
			shift: IPoint = {
				x: 0,
				y: 0
			};

		// If SHIFT key is pressed we slash speed by half and disable accelleration
		if (this.keyboardEvent.shiftKey) {
			speed *= 0.5;
			accelleration = 1;
		}
		// If CTRL is pressed we increase speed by x2
		else if (this.keyboardEvent.ctrlKey) {
			speed *= 2;
		}

		// Get elapsed time
		let ms = new Date().getTime() - this._startedOn;
		let accelleratedMs = ms - accellerationDelay;

		// Add accellerated movement
		if ((accelleration > 0) && (accelleratedMs > 0)) {
			let accellerationFactor = ms / accellerationDelay;
			ms = accellerationDelay;
			shift.x += this.directionX * (speed * accelleration * accellerationFactor * accelleratedMs);
			shift.y += this.directionY * (speed * accelleration * accellerationFactor * accelleratedMs);
		}

		// Calculate position
		shift.x += this.directionX * (speed * ms);
		shift.y += this.directionY * (speed * ms);

		// Simulate move on Interaction
		getInteraction().handleTransformMove(io, shift, { x: 0, y: 0 }, this.keyboardEvent, true, false);
	}

	/**
	 * Returns if this object has been already been disposed.
	 *
	 * @return Is disposed?
	 */
	public isDisposed(): boolean {
		return this._disposed;
	}

	/**
	 * Disposes this object. Removes from system animations.
	 */
	public dispose(): void {
		if (!this._disposed) {
			getInteraction().processDragStop(this.interaction);
			$array.remove(system.animations, this);
		}
	}

}
