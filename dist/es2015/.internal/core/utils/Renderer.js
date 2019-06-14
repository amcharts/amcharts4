import * as tslib_1 from "tslib";
import { Interaction } from "../../core/interaction/Interaction";
import { options } from "../Options";
/**
 * The item with the information to be queued.
 *
 * @class Item
 * @ignore Exclude from docs
 */
var Item = /** @class */ (function () {
    function Item(element, sprite, callback) {
        this.element = element;
        this.sprite = sprite;
        this.callback = callback;
    }
    return Item;
}());
/**
 * Timeout to delay scroll and resize event handler triggering.
 */
var timeout = 0;
var items = new Set();
var queue = new Array();
/**
 * Remove an item from queue.
 *
 * @param item The item to be removed from queue.
 */
var removeFromQueue = function (item) {
    var index = queue.indexOf(item);
    if (index > -1) {
        queue.splice(index, 1);
    }
};
/**
 * Add an item to queue.
 *
 * @param item The item to be queued.
 */
var addToQueue = function (item) {
    if (item.sprite.isDisposed()) {
        return;
    }
    // Queue charts but show event out of the viewport
    queue.push(item);
    if (queue.length > 1) {
        var previousSprite = queue[queue.length - 2].sprite;
        if (previousSprite.isReady()) {
            item.callback();
        }
        else {
            // Add an event to previous chart
            previousSprite.events.once("ready", function () {
                item.callback();
            });
        }
    }
    else {
        item.callback();
    }
    // Remove from renderer when ready
    item.sprite.events.once("ready", function () {
        removeFromQueue(item);
    });
    // Remove from renderer before disposing
    item.sprite.events.once("beforedisposed", function () {
        if (items.has(item)) {
            items.delete(item);
        }
        removeFromQueue(item);
    });
};
/**
 * Check whether an element is visible on the viewport.
 *
 * @param item The item to be checked.
 * @param clientWidth The HTML element width.
 * @param clientHeight The HTML element height.
 * @param e The event.
 */
var check = function (item, clientWidth, clientHeight, e) {
    var clientRect = item.element.getBoundingClientRect(), visibleHeight = clientRect.height;
    // If there is something visible vertically (Should we check horizontally?)
    if ((clientRect.top >= visibleHeight * -1 && clientRect.bottom <= clientHeight + visibleHeight)
        // If there is an area visible in the container. This may be needed if the CSS display and
        // and dimenion properties didn't take effect yet depending when it's loaded.
        && (clientRect.top || clientRect.right || clientRect.bottom || clientRect.left)) {
        if (options.queue) {
            addToQueue(item);
        }
        else {
            item.callback();
        }
        // Remove the element from the list of items as the callback is already executed
        items.delete(item);
    }
};
/**
 * Handler to check when an element is in the viewport
 *
 * @param e The event object.
 * @param instantly Whether the execute the check right away or wait.
 */
var handler = function (e, instantly) {
    clearTimeout(timeout);
    var executor = function () {
        var html = document.documentElement, clientWidth = html.clientWidth, clientHeight = html.clientHeight, item;
        try {
            for (var items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                item = items_1_1.value;
                check(item, clientWidth, clientHeight, e);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Unbind the events if there is nothing to watch for
        if (!items.size) {
            window.removeEventListener("resize", handler, false);
            window.removeEventListener("scroll", handler, false);
        }
        var e_1, _a;
    };
    if (instantly) {
        executor();
    }
    else {
        // Delay the checks
        timeout = setTimeout(executor, 200);
    }
};
/**
 * Promise resolved when the DOM content finishes loading or the `deviceready`
 * event triggers in a Cordova environment.
 */
export var documentReady = new Promise(function (resolve, reject) {
    // Fallback to the current document
    var doc = window.document;
    if (doc.readyState === "complete") {
        resolve();
    }
    else {
        // Support Cordova or document ready events
        doc.addEventListener(window.cordova ? "deviceready" : "DOMContentLoaded", function (e) {
            resolve(e);
        }, false);
    }
});
/**
 * Add elements to be checked when available on the viewport. Also add
 * callback to be executed when the element is on the viewport.
 *
 * @param element  The HTML element where the charts is rendered
 * @param callback The callback function
 */
export function add(element, sprite, callback) {
    var _this = this;
    documentReady.then(function (e) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            if (!options.queue && !options.onlyShowOnViewport) {
                // Show the chart right away and don't wait to be in the viewport or queued
                callback();
            }
            else if (options.queue && !options.onlyShowOnViewport) {
                addToQueue(new Item(element, sprite, callback));
            }
            else {
                // Only bind the DOM events when there is something to check
                if (!items.size) {
                    window.addEventListener("resize", handler, Interaction.passiveSupported ? { passive: true } : false);
                    window.addEventListener("scroll", handler, Interaction.passiveSupported ? { passive: true } : false);
                }
                // Add items to show when visible on the viewport
                items.add({
                    element: element,
                    sprite: sprite,
                    callback: callback
                });
                // Call the handler right away to check it the element is already in the
                // viewport
                handler(e, true);
            }
            return [2 /*return*/];
        });
    }); });
}
//# sourceMappingURL=Renderer.js.map