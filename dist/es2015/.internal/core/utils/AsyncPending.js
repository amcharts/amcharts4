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
var pendingFrame = false;
var pendingIdle = false;
var nextQueue = [];
var readQueue = [];
var writeQueue = [];
var idleQueue = [];
var fps = 1000 / 60;
/**
 * [raf description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {[type]}
 */
export var raf = (typeof requestAnimationFrame === "function"
    ? function (fn) {
        requestAnimationFrame(fn);
    }
    : function (fn) {
        setTimeout(fn, fps);
    });
/**
 * [frameLoop description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
function frameLoop() {
    var now = Date.now();
    var length = nextQueue.length;
    for (var i = 0; i < length; ++i) {
        nextQueue[i](now);
    }
    $array.shiftLeft(nextQueue, length);
    for (var i = 0; i < readQueue.length; ++i) {
        readQueue[i](now);
    }
    readQueue.length = 0;
    for (var i = 0; i < writeQueue.length; ++i) {
        writeQueue[i](now);
    }
    writeQueue.length = 0;
    if (nextQueue.length === 0 && readQueue.length === 0) {
        pendingFrame = false;
    }
    else {
        raf(frameLoop);
    }
}
/**
 * [pendFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
function pendFrame() {
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
 * @param {Listener} fn [description]
 */
export function nextFrame(fn) {
    nextQueue.push(fn);
    pendFrame();
}
/**
 * [readFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param {Listener} fn [description]
 */
export function readFrame(fn) {
    readQueue.push(fn);
    pendFrame();
}
/**
 * [writeFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param {Listener} fn [description]
 */
export function writeFrame(fn) {
    writeQueue.push(fn);
    pendFrame();
}
// Polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API#Falling_back_to_setTimeout
var requestIdle = (typeof requestIdleCallback === "function"
    ? requestIdleCallback
    : function (fn) {
        // TODO is this a good polyfill ?
        readFrame(function () {
            var startTime = Date.now();
            fn({
                didTimeout: false,
                timeRemaining: function () {
                    return Math.max(0, 50.0 - (Date.now() - startTime));
                }
            });
        });
    });
/**
 * [idleLoop description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param {IdleInfo} info [description]
 */
function idleLoop(info) {
    var now = Date.now();
    var i = 0;
    // TODO maybe new callbacks should be pushed to the next update tick ?
    while (i < idleQueue.length) {
        if (info.didTimeout || info.timeRemaining() > 0) {
            idleQueue[i](now);
            ++i;
        }
        else {
            $array.shiftLeft(idleQueue, i);
            // TODO is his a good timeout ?
            requestIdle(idleLoop, { timeout: 50 });
            return;
        }
    }
    idleQueue.length = 0;
    pendingIdle = false;
}
/*export function whenIdle(fn: Listener): void {
    idleQueue.push(fn);

    if (!pendingIdle) {
        pendingIdle = true;
        // TODO is his a good timeout ?
        requestIdle(idleLoop, { timeout: 50 });
    }
}*/
/**
 * [whenIdle description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param {Listener} fn [description]
 */
export function whenIdle(fn) {
    idleQueue.push(fn);
}
/**
 * [triggerIdle description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @todo Maybe don't trigger a callback which was added while in the middle of triggering?
 */
export function triggerIdle() {
    var now = Date.now();
    var length = idleQueue.length;
    for (var i = 0; i < length; ++i) {
        idleQueue.shift()(now);
    }
}
//# sourceMappingURL=AsyncPending.js.map