/**
 * Bullet module
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
import { Bullet } from "./Bullet";
import { Circle } from "../../core/elements/Circle";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a bullet with a textual label.
 *
 * Uses [[Label]] instance to draw the label, so the label itself is
 * configurable.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var CircleBullet = /** @class */ (function (_super) {
    __extends(CircleBullet, _super);
    /**
     * Constructor
     */
    function CircleBullet() {
        var _this = _super.call(this) || this;
        _this.className = "CircleBullet";
        _this.circle = _this.createChild(Circle);
        _this.circle.shouldClone = false;
        _this.circle.radius = 5;
        _this.circle.isMeasured = false;
        return _this;
    }
    /**
     * Copies all proprities and related stuff from another instance of
     * [[CircleBullet]].
     *
     * @param {this}  source  Source element
     */
    CircleBullet.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.circle.copyFrom(source.circle);
    };
    return CircleBullet;
}(Bullet));
export { CircleBullet };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CircleBullet"] = CircleBullet;
//# sourceMappingURL=CircleBullet.js.map