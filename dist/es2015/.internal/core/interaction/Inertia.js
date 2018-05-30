/**
 * Functionality related to inertia
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../Base";
import { getInteraction } from "./Interaction";
import { AnimationDisposer } from "../utils/Animation";
import * as $type from "../utils/Type";
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
var Inertia = /** @class */ (function (_super) {
    __extends(Inertia, _super);
    /**
     * Constructor
     */
    function Inertia() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * List of animations currently playing.
         *
         * @type {List<Animation>}
         */
        _this.animations = [];
        _this.className = "Inertia";
        // Make animations disposable
        _this._disposers.push(new AnimationDisposer(_this.animations));
        return _this;
    }
    Object.defineProperty(Inertia.prototype, "x", {
        /**
         * Returns current X coordinate.
         *
         * @return {number} X
         */
        get: function () {
            return this.point.x;
        },
        /**
         * Sets current X coordinate.
         *
         * Will trigger "drag" event for the target element.
         *
         * @param {number} value X
         */
        set: function (value) {
            if ($type.isNumber(value)) {
                this.point.x = value;
                this.handleMove();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Inertia.prototype, "y", {
        /**
         * Returns current Y coordinate.
         *
         * @return {number} Y
         */
        get: function () {
            return this.point.y;
        },
        /**
         * Sets current Y coordinate.
         *
         * Will trigger "drag" event for the target element.
         *
         * @param {number} value Y
         */
        set: function (value) {
            if ($type.isNumber(value)) {
                this.point.y = value;
                this.handleMove();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Simulates dragging of element.
     */
    Inertia.prototype.handleMove = function () {
        // Prepare {InteractionEvent} object
        if (this.interaction.events.isEnabled("drag")) {
            var imev = {
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
                }
            };
            // Call handler
            this.interaction.events.dispatchImmediately("drag", imev);
        }
    };
    Object.defineProperty(Inertia.prototype, "rotation", {
        /**
         * Sets current angle.
         *
         * Will trigger "rotate" event on a target element.
         *
         * @param {number} value Angle
         */
        set: function (value) {
            if ($type.isNumber(value)) {
                if (this.interaction.events.isEnabled("rotate")) {
                    var imev = {
                        type: "rotate",
                        target: this.interaction,
                        angle: value
                    };
                    this.interaction.events.dispatchImmediately("rotate", imev);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Finishes up the inertia animation. (removes reference to this animation
     * object)
     */
    Inertia.prototype.done = function () {
        // Remove inertia animation from the object
        this.interaction.inertias.removeKey(this.type);
        // Move ended
        if (this.type === "move") {
            getInteraction().processDragStop(this.interaction);
        }
        // Destroy
        this.dispose();
    };
    return Inertia;
}(BaseObject));
export { Inertia };
//# sourceMappingURL=Inertia.js.map