/**
 * A collection of low-level async operation stuff.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as $array from "./Array";

/**
 * [Listener description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export type Listener = (now: number) => void;

let pendingFrame = false;

const nextQueue: Array<Listener> = [];
const readQueue: Array<Listener> = [];
const writeQueue: Array<Listener> = [];
const idleQueue: Array<Listener> = [];


const fps = 1000 / 60;

/**
 * [raf description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export const raf =
	(typeof requestAnimationFrame === "function"
		? function(fn: () => void): void {
			requestAnimationFrame(fn);
		}
		: function(fn: () => void): void {
			setTimeout(fn, fps);
		});

/**
 * [frameLoop description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
function frameLoop(): void {
	const now = Date.now();


	const length = nextQueue.length;

	for (let i = 0; i < length; ++i) {
		nextQueue[i](now);
	}

	$array.shiftLeft(nextQueue, length);


	for (let i = 0; i < readQueue.length; ++i) {
		readQueue[i](now);
	}

	readQueue.length = 0;


	for (let i = 0; i < writeQueue.length; ++i) {
		writeQueue[i](now);
	}

	writeQueue.length = 0;


	if (nextQueue.length === 0 && readQueue.length === 0) {
		pendingFrame = false;

	} else {
		raf(frameLoop);
	}
}

/**
 * [pendFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
function pendFrame(): void {
	if (!pendingFrame) {
		pendingFrame = true;

		raf(frameLoop);
	}
}


/**
 * [nextFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param fn [description]
 */
export function nextFrame(fn: Listener): void {
	nextQueue.push(fn);
	pendFrame();
}

/**
 * [readFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param fn [description]
 */
export function readFrame(fn: Listener): void {
	readQueue.push(fn);
	pendFrame();
}

/**
 * [writeFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param fn [description]
 */
export function writeFrame(fn: Listener): void {
	writeQueue.push(fn);
	pendFrame();
}

/**
 * [whenIdle description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param fn [description]
 */
export function whenIdle(fn: Listener): void {
	idleQueue.push(fn);
}

/**
 * [triggerIdle description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @todo Maybe don't trigger a callback which was added while in the middle of triggering?
 */
export function triggerIdle(): void {
	const now = Date.now();

	const length = idleQueue.length;

	for (let i = 0; i < length; ++i) {
		(<any>idleQueue.shift())(now);
	}
}
